import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticatedAdmin } from "@/lib/adminAuth";
import { loadAllNews } from "@/lib/githubStorage";
import { ArticleView } from "@/components/ArticleView";
import { ArrowLeft, Edit2, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PreviewNoticiaPage({ params }: PreviewPageProps) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const { slug } = await params;
  const allNews = await loadAllNews();
  const article = allNews.find((item) => item.slug === slug);

  if (!article) {
    redirect("/admin");
  }

  const isPublished = article.status === "publicada";

  const previewBanner = (
    <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 text-xs text-amber-900">
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-bold truncate">
            <span className="hidden sm:inline">Modo de </span>Pré-visualização
        </span>
        <span className="text-amber-600 hidden sm:inline">|</span>
        <span className="hidden sm:inline text-amber-800">
            Estado:{" "}
            <strong className={isPublished ? "text-emerald-700" : "text-amber-800"}>
                {isPublished ? "Publicada" : "Rascunho (não visível ao público)"}
            </strong>
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/admin/editar/${article.slug}`}
          className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <Edit2 className="h-3 w-3" />
          <span>Editar</span>
        </Link>

        <Link
          href="/admin"
          className="inline-flex items-center gap-1 rounded-md bg-[#07213D] px-2.5 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-[#07213D]/90 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Voltar ao Painel</span>
        </Link>
      </div>
    </div>
  );

  return <ArticleView article={article} banner={previewBanner} />;
}

