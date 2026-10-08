import fs from "node:fs/promises";
import path from "node:path";
import { NewsArticle } from "@/lib/newsletterData";

interface GitHubConfig {
  token?: string;
  repository: string;
  branch: string;
}

function getGitHubConfig(): GitHubConfig {
  return {
    token: process.env.GITHUB_TOKEN?.trim(),
    repository: process.env.GITHUB_REPOSITORY?.trim() || "miguelfcostaa/caixa-arditi",
    branch: process.env.GITHUB_BRANCH?.trim() || "main",
  };
}

const LOCAL_JSON_PATH = path.join(process.cwd(), "content", "noticias.json");
const LOCAL_IMAGES_DIR = path.join(process.cwd(), "public", "images", "noticias");

/**
 * Lê todas as notícias. Quando o GitHub está configurado, o repositório é a
 * fonte de verdade; o ficheiro local é apenas usado no modo de desenvolvimento.
 */
export async function loadAllNews(): Promise<NewsArticle[]> {
  const { token, repository, branch } = getGitHubConfig();

  if (token) {
    const res = await fetch(
      `https://api.github.com/repos/${repository}/contents/content/noticias.json?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "caixa-web-admin",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error(`Não foi possível ler as notícias do GitHub (${res.status}).`);
    }

    const data = await res.json();
    const content = Buffer.from(data.content, "base64").toString("utf8");
    return JSON.parse(content);
  }

  try {
    const raw = await fs.readFile(LOCAL_JSON_PATH, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Erro ao ler content/noticias.json:", error);
    throw new Error("Não foi possível ler o ficheiro local de notícias.");
  }
}

/**
 * Guarda a notícia localmente e comita no repositório GitHub caso GITHUB_TOKEN esteja configurado.
 */
export async function saveNewsArticle(
  article: NewsArticle,
  imageFile?: { filename: string; buffer: Buffer },
): Promise<{ success: boolean; localOnly: boolean; commitSha?: string; error?: string }> {
  try {
    const { token, repository, branch } = getGitHubConfig();
    const currentNews = await loadAllNews();

    // Se houver uma nova imagem carregada
    if (imageFile) {
      const sanitizedName = imageFile.filename
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, "-");
      const imageRelativePath = `/images/noticias/${sanitizedName}`;
      article.image = imageRelativePath;

      // Guarda a imagem no sistema de ficheiros local
      try {
        await fs.mkdir(LOCAL_IMAGES_DIR, { recursive: true });
        const localImagePath = path.join(LOCAL_IMAGES_DIR, sanitizedName);
        await fs.writeFile(localImagePath, imageFile.buffer);
      } catch (err) {
        console.error("Erro ao guardar imagem localmente:", err);
      }

      // Se GitHub Token estiver ativo, comita a imagem no GitHub
      if (token) {
        try {
          const imageGithubPath = `public/images/noticias/${sanitizedName}`;
          // Verifica se a imagem já existe no GitHub para obter o SHA
          let existingSha: string | undefined;
          const checkRes = await fetch(
            `https://api.github.com/repos/${repository}/contents/${imageGithubPath}?ref=${branch}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "caixa-web-admin",
              },
            },
          );
          if (checkRes.ok) {
            const data = await checkRes.json();
            existingSha = data.sha;
          }

          await fetch(
            `https://api.github.com/repos/${repository}/contents/${imageGithubPath}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "caixa-web-admin",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: `feat(noticias): upload imagem ${sanitizedName}`,
                content: imageFile.buffer.toString("base64"),
                sha: existingSha,
                branch,
              }),
            },
          );
        } catch (imgErr) {
          console.error("Erro ao enviar imagem para GitHub:", imgErr);
        }
      }
    }

    // Atualiza a lista de notícias (substitui se já existir pelo slug ou insere no topo)
    const existingIndex = currentNews.findIndex((item) => item.slug === article.slug);
    let updatedNews: NewsArticle[];
    if (existingIndex >= 0) {
      updatedNews = [...currentNews];
      updatedNews[existingIndex] = article;
    } else {
      updatedNews = [article, ...currentNews];
    }

    const updatedJsonString = JSON.stringify(updatedNews, null, 2);

    // Guarda no sistema de ficheiros local quando este estiver disponível.
    let localWriteError: unknown;
    try {
      await fs.mkdir(path.dirname(LOCAL_JSON_PATH), { recursive: true });
      await fs.writeFile(LOCAL_JSON_PATH, updatedJsonString, "utf8");
    } catch (fsErr) {
      localWriteError = fsErr;
      console.error("Erro ao gravar content/noticias.json local:", fsErr);
    }

    // Se não houver GitHub Token, conclui em modo local
    if (!token) {
      if (localWriteError) {
        return {
          success: false,
          localOnly: true,
          error: "Não foi possível guardar a notícia no ficheiro local.",
        };
      }
      return { success: true, localOnly: true };
    }

    // Comita o ficheiro content/noticias.json no repositório GitHub
    const getFileRes = await fetch(
      `https://api.github.com/repos/${repository}/contents/content/noticias.json?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "caixa-web-admin",
        },
      },
    );

    if (!getFileRes.ok) {
      return {
        success: false,
        localOnly: false,
        error: `Não foi possível obter a versão atual das notícias no GitHub (${getFileRes.status}).`,
      };
    }

    const fileData = await getFileRes.json();
    const fileSha: string = fileData.sha;

    const commitMessage =
      existingIndex >= 0
        ? `update(noticias): atualizar notícia "${article.title.pt}"`
        : `feat(noticias): ${article.status === "publicada" ? "publicar" : "criar rascunho de"} "${article.title.pt}"`;

    const putRes = await fetch(
      `https://api.github.com/repos/${repository}/contents/content/noticias.json`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "caixa-web-admin",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: commitMessage,
          content: Buffer.from(updatedJsonString, "utf8").toString("base64"),
          sha: fileSha,
          branch,
        }),
      },
    );

    if (!putRes.ok) {
      const errorText = await putRes.text();
      console.error("Erro ao comitar content/noticias.json no GitHub:", errorText);
      return {
        success: false,
        localOnly: false,
        error: `Não foi possível guardar a notícia no GitHub (${putRes.status}).`,
      };
    }

    const putData = await putRes.json();
    return {
      success: true,
      localOnly: false,
      commitSha: putData.commit?.sha,
    };
  } catch (error) {
    console.error("Erro global ao guardar notícia:", error);
    return {
      success: false,
      localOnly: true,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Remove uma notícia pelo slug (ou marca como rascunho/arquivada).
 */
export async function deleteNewsArticle(
  slug: string,
): Promise<{ success: boolean; localOnly: boolean; error?: string }> {
  try {
    const { token, repository, branch } = getGitHubConfig();
    const currentNews = await loadAllNews();
    const targetArticle = currentNews.find((item) => item.slug === slug);

    if (!targetArticle) {
      return { success: false, localOnly: true, error: "Notícia não encontrada." };
    }

    const updatedNews = currentNews.filter((item) => item.slug !== slug);
    const updatedJsonString = JSON.stringify(updatedNews, null, 2);

    // Grava localmente quando o sistema de ficheiros estiver disponível.
    let localWriteError: unknown;
    try {
      await fs.mkdir(path.dirname(LOCAL_JSON_PATH), { recursive: true });
      await fs.writeFile(LOCAL_JSON_PATH, updatedJsonString, "utf8");
    } catch (fsErr) {
      localWriteError = fsErr;
      console.error("Erro ao atualizar ficheiro local:", fsErr);
    }

    // Se não houver token, termina
    if (!token) {
      if (localWriteError) {
        return {
          success: false,
          localOnly: true,
          error: "Não foi possível atualizar o ficheiro local de notícias.",
        };
      }
      return { success: true, localOnly: true };
    }

    // Comita a remoção no GitHub
    const getFileRes = await fetch(
      `https://api.github.com/repos/${repository}/contents/content/noticias.json?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "caixa-web-admin",
        },
      },
    );

    if (!getFileRes.ok) {
      return {
        success: false,
        localOnly: false,
        error: `Não foi possível obter a versão atual das notícias no GitHub (${getFileRes.status}).`,
      };
    }

    const fileData = await getFileRes.json();
    const fileSha: string = fileData.sha;

    const putRes = await fetch(
      `https://api.github.com/repos/${repository}/contents/content/noticias.json`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "caixa-web-admin",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `chore(noticias): remover notícia "${targetArticle.title.pt}"`,
          content: Buffer.from(updatedJsonString, "utf8").toString("base64"),
          sha: fileSha,
          branch,
        }),
      },
    );

    if (!putRes.ok) {
      const errorText = await putRes.text();
      console.error("Erro ao remover notícia no GitHub:", errorText);
      return {
        success: false,
        localOnly: false,
        error: `Não foi possível remover a notícia no GitHub (${putRes.status}).`,
      };
    }

    return { success: true, localOnly: false };
  } catch (error) {
    return {
      success: false,
      localOnly: true,
      error: error instanceof Error ? error.message : "Erro ao remover notícia",
    };
  }
}

/**
 * Consulta o estado do deployment através da GitHub Actions API.
 */
export async function getDeploymentStatus(): Promise<{
  status: "success" | "in_progress" | "queued" | "failure" | "local" | "unknown";
  message: string;
  runUrl?: string;
  updatedAt?: string;
  commitSha?: string;
}> {
  const { token, repository, branch } = getGitHubConfig();

  if (!token) {
    return {
      status: "local",
      message: "Modo Local: alterações guardadas em content/noticias.json.",
    };
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repository}/actions/runs?branch=${branch}&per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "caixa-web-admin",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return {
        status: "unknown",
        message: "Repositório GitHub conectado.",
      };
    }

    const data = await res.json();
    const runs = data.workflow_runs;
    if (!runs || runs.length === 0) {
      return {
        status: "unknown",
        message: "Nenhuma ação de deployment registada recentemente.",
      };
    }

    const latest = runs[0];
    const runUrl = latest.html_url;
    const updatedAt = latest.updated_at;
    const commitSha = latest.head_sha?.slice(0, 7);

    if (latest.status === "in_progress") {
      return {
        status: "in_progress",
        message: "Deployment em progresso no GitHub Actions...",
        runUrl,
        updatedAt,
        commitSha,
      };
    }

    if (latest.status === "queued") {
      return {
        status: "queued",
        message: "Deployment em fila de espera...",
        runUrl,
        updatedAt,
        commitSha,
      };
    }

    if (latest.conclusion === "success") {
      return {
        status: "success",
        message: "Último deployment concluído com sucesso.",
        runUrl,
        updatedAt,
        commitSha,
      };
    }

    if (latest.conclusion === "failure") {
      return {
        status: "failure",
        message: "O último deployment falhou. Verifique os logs no GitHub.",
        runUrl,
        updatedAt,
        commitSha,
      };
    }

    return {
      status: "unknown",
      message: `Estado: ${latest.status} (${latest.conclusion || "aguardando"})`,
      runUrl,
      updatedAt,
      commitSha,
    };
  } catch {
    return {
      status: "unknown",
      message: "Não foi possível verificar o estado do deployment.",
    };
  }
}
