import fs from "node:fs/promises";
import path from "node:path";

const IMAGE_DIRECTORY = path.join(
  process.cwd(),
  "public",
  "images",
  "noticias",
);

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function imageResponse(body: ArrayBuffer, filename: string) {
  const extension = path.extname(filename).toLowerCase();

  return new Response(body, {
    headers: {
      "Content-Type": CONTENT_TYPES[extension] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(filename)) {
    return new Response("Imagem inválida.", { status: 400 });
  }

  try {
    const localImage = await fs.readFile(path.join(IMAGE_DIRECTORY, filename));
    return imageResponse(Uint8Array.from(localImage).buffer, filename);
  } catch {
    // Em produção, o filesystem pode ser imutável. Tenta a cópia no GitHub.
  }

  const token = process.env.GITHUB_TOKEN?.trim();
  const repository =
    process.env.GITHUB_REPOSITORY?.trim() || "miguelfcostaa/caixa-arditi";
  const branch = process.env.GITHUB_BRANCH?.trim() || "main";
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.raw",
    "User-Agent": "caixa-web",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${repository}/contents/public/images/noticias/${encodeURIComponent(filename)}?ref=${encodeURIComponent(branch)}`,
    { headers, cache: "no-store" },
  );

  if (!response.ok) {
    return new Response("Imagem não encontrada.", { status: 404 });
  }

  return imageResponse(await response.arrayBuffer(), filename);
}
