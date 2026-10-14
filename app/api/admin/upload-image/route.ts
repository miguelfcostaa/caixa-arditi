import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { isAuthenticatedAdmin } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "Nenhum ficheiro de imagem foi fornecido." },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    const filename = `conteudo-${baseName}-${Date.now()}.${ext}`;

    // 1. Guardar localmente
    const localImagesDir = path.join(
      process.cwd(),
      "public",
      "images",
      "noticias",
    );
    await fs.mkdir(localImagesDir, { recursive: true });
    const localFilePath = path.join(localImagesDir, filename);
    await fs.writeFile(localFilePath, buffer);

    const relativeUrl = `/images/noticias/${filename}`;

    // 2. Se o GitHub Token estiver ativo, comita no GitHub
    const token = process.env.GITHUB_TOKEN?.trim();
    const repository =
      process.env.GITHUB_REPOSITORY?.trim() || "miguelfcostaa/caixa-arditi";
    const branch = process.env.GITHUB_BRANCH?.trim() || "main";

    if (token) {
      try {
        const imageGithubPath = `public/images/noticias/${filename}`;
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
              message: `feat(noticias): upload imagem inline ${filename}`,
              content: buffer.toString("base64"),
              branch,
            }),
          },
        );
      } catch (err) {
        console.error("Erro ao comitar imagem no GitHub:", err);
      }
    }

    return NextResponse.json({
      success: true,
      url: relativeUrl,
    });
  } catch (error) {
    console.error("Erro no upload de imagem:", error);
    return NextResponse.json(
      { error: "Erro ao processar o upload da imagem." },
      { status: 500 },
    );
  }
}

