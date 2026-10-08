import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticatedAdmin } from "@/lib/adminAuth";
import {
  deleteNewsArticle,
  loadAllNews,
  saveNewsArticle,
} from "@/lib/githubStorage";
import { NewsArticle } from "@/lib/newsletterData";

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const news = await loadAllNews();
  return NextResponse.json({ news });
}

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let articleData: Partial<NewsArticle>;
    let imageFile: { filename: string; buffer: Buffer } | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const rawJson = formData.get("data") as string;
      if (!rawJson) {
        return NextResponse.json(
          { error: "Dados da notícia não fornecidos." },
          { status: 400 },
        );
      }
      articleData = JSON.parse(rawJson);

      const file = formData.get("imageFile") as File | null;
      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const ext = file.name.split(".").pop() || "jpg";
        const cleanSlug = (articleData.slug || "noticia").toLowerCase();
        const filename = `${cleanSlug}-${Date.now()}.${ext}`;
        imageFile = { filename, buffer };
      }
    } else {
      articleData = await request.json();
    }

    // Validações obrigatórias
    if (!articleData.title?.pt || !articleData.title?.pt.trim()) {
      return NextResponse.json(
        { error: "O título em português é obrigatório." },
        { status: 400 },
      );
    }

    if (!articleData.slug || !articleData.slug.trim()) {
      return NextResponse.json(
        { error: "O slug da notícia é obrigatório." },
        { status: 400 },
      );
    }

    // Normalização dos dados
    const fullArticle: NewsArticle = {
      slug: articleData.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      status: articleData.status === "rascunho" ? "rascunho" : "publicada",
      publishedAt: articleData.publishedAt || new Date().toISOString().split("T")[0],
      title: {
        pt: articleData.title.pt.trim(),
        en: articleData.title.en?.trim() || articleData.title.pt.trim(),
      },
      category: {
        pt: articleData.category?.pt?.trim() || "Geral",
        en: articleData.category?.en?.trim() || articleData.category?.pt?.trim() || "General",
      },
      date: {
        pt: articleData.date?.pt?.trim() || "",
        en: articleData.date?.en?.trim() || articleData.date?.pt?.trim() || "",
      },
      image: articleData.image || "/images/image1.jpg",
      imageAlt: {
        pt: articleData.imageAlt?.pt?.trim() || articleData.title.pt.trim(),
        en: articleData.imageAlt?.en?.trim() || articleData.title.en?.trim() || articleData.title.pt.trim(),
      },
      content: {
        pt: Array.isArray(articleData.content?.pt)
          ? articleData.content.pt.filter((p) => p && p.trim())
          : [],
        en: Array.isArray(articleData.content?.en)
          ? articleData.content.en.filter((p) => p && p.trim())
          : [],
      },
    };

    const result = await saveNewsArticle(fullArticle, imageFile);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Erro ao guardar a notícia." },
        { status: 500 },
      );
    }

    // Revalidar páginas públicas
    try {
      revalidatePath("/");
      revalidatePath("/noticias");
      revalidatePath(`/noticias/${fullArticle.slug}`);
      revalidatePath("/sitemap.xml");
    } catch {}

    return NextResponse.json({
      success: true,
      article: fullArticle,
      localOnly: result.localOnly,
      commitSha: result.commitSha,
    });
  } catch (err) {
    console.error("Erro na API de notícias:", err);
    return NextResponse.json(
      { error: "Erro interno ao processar a notícia." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json(
        { error: "O identificador da notícia é obrigatório." },
        { status: 400 },
      );
    }

    const result = await deleteNewsArticle(slug);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Não foi possível remover a notícia." },
        { status: 404 },
      );
    }

    try {
      revalidatePath("/");
      revalidatePath("/noticias");
      revalidatePath(`/noticias/${slug}`);
      revalidatePath("/sitemap.xml");
    } catch {}

    return NextResponse.json({ success: true, localOnly: result.localOnly });
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar a eliminação." },
      { status: 500 },
    );
  }
}

