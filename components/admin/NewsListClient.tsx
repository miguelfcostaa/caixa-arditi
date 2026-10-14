"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Eye, ExternalLink } from "lucide-react";
import { NewsArticle } from "@/lib/newsletterData";
import { NewsImage } from "@/components/NewsImage";

interface NewsListClientProps {
  initialNews: NewsArticle[];
}

export function NewsListClient({ initialNews }: NewsListClientProps) {
  const router = useRouter();
  const [news, setNews] = useState<NewsArticle[]>(initialNews);
  const [filter, setFilter] = useState<"all" | "publicada" | "rascunho">("all");
  const [deleteModalSlug, setDeleteModalSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const publishedCount = news.filter((n) => n.status === "publicada").length;
  const draftCount = news.filter((n) => n.status === "rascunho").length;

  const filteredNews = news.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const handleDelete = async (slug: string) => {
    setDeleting(true);
    setActionError(null);
    try {
      const res = await fetch("/api/admin/noticias", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      if (!res.ok) {
        const data = await res.json();
        setActionError(data.error || "Erro ao remover a notícia.");
        setDeleting(false);
        return;
      }

      setNews((prev) => prev.filter((item) => item.slug !== slug));
      setDeleteModalSlug(null);
      setDeleting(false);
      router.refresh();
    } catch {
      setActionError("Erro de ligação ao servidor.");
      setDeleting(false);
    }
  };

  const targetArticleToDelete = news.find((n) => n.slug === deleteModalSlug);

  return (
    <div className="space-y-8">
      {/* Cabeçalho da secção */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#07213D] sm:text-3xl">
            Notícias & Eventos
          </h2>
          <p className="mt-1 text-sm text-[#07213D]/50">
            Gerir notícias publicadas e rascunhos do website.
          </p>
        </div>

        <Link
          href="/admin/nova"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-[#F85308] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#d64505] sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Notícia</span>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-1 rounded-xl border border-slate-200/80 bg-white p-1 shadow-xs w-fit">
        {[
          { key: "all", label: `Todas (${news.length})` },
          { key: "publicada", label: `Publicadas (${publishedCount})` },
          { key: "rascunho", label: `Rascunhos (${draftCount})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key as typeof filter)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              filter === key
                ? "bg-[#07213D] text-white"
                : "text-[#07213D]/60 hover:text-[#07213D]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Erro */}
      {actionError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {actionError}
        </div>
      )}

      {/* Lista */}
      {filteredNews.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <p className="text-sm font-semibold text-[#07213D]/50">
            Nenhuma notícia encontrada.
          </p>
          <Link
            href="/admin/nova"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#F85308] hover:underline"
          >
            <Plus className="h-4 w-4" />
            Criar a primeira notícia
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs divide-y divide-slate-100">
          {filteredNews.map((article) => {
            const isPublished = article.status === "publicada";

            return (
              <div
                key={article.slug}
                className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between sm:py-5"
              >
                {/* Esquerda: imagem + informação */}
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-[72px] sm:w-28">
                    <NewsImage
                      src={article.image}
                      alt={article.title.pt}
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Badge de estado */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          isPublished
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isPublished ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {isPublished ? "Publicada" : "Rascunho"}
                      </span>
                      <span className="text-xs text-[#07213D]/40">
                        {article.category.pt}
                      </span>
                      <span className="text-xs text-[#07213D]/30">·</span>
                      <span className="text-xs text-[#07213D]/40">
                        {article.publishedAt}
                      </span>
                    </div>

                    <h3 className="mt-1 text-sm font-bold text-[#07213D] leading-snug sm:text-base line-clamp-1">
                      {article.title.pt}
                    </h3>

                    <p className="mt-0.5 font-mono text-[10px] text-[#07213D]/30">
                      /noticias/{article.slug}
                    </p>
                  </div>
                </div>

                {/* Direita: ações */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Ver / Pré-visualizar */}
                  {isPublished ? (
                    <Link
                      href={`/noticias/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ver no website"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-[#07213D]/50 transition-colors hover:border-[#07213D]/20 hover:text-[#07213D]"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      href={`/admin/preview/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Pré-visualizar rascunho"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-[#07213D]/50 transition-colors hover:border-[#07213D]/20 hover:text-[#07213D]"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  )}

                  {/* Editar */}
                  <Link
                    href={`/admin/editar/${article.slug}`}
                    title="Editar notícia"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#07213D] transition-colors hover:bg-[#07213D] hover:text-white hover:border-[#07213D]"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Editar
                  </Link>

                  {/* Eliminar */}
                  <button
                    type="button"
                    onClick={() => setDeleteModalSlug(article.slug)}
                    title="Eliminar notícia"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#07213D]/30 transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de confirmação de eliminação */}
      {deleteModalSlug && targetArticleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07213D]/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
            <h3 className="text-lg font-extrabold text-[#07213D]">
              Eliminar notícia?
            </h3>
            <p className="mt-2 text-sm text-[#07213D]/60 leading-relaxed">
              Tem a certeza que pretende eliminar{" "}
              <strong className="text-[#07213D]">
                &ldquo;{targetArticleToDelete.title.pt}&rdquo;
              </strong>
              ? Esta ação não pode ser desfeita localmente.
            </p>

            <div className="mt-7 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalSlug(null)}
                disabled={deleting}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-[#07213D] hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteModalSlug)}
                disabled={deleting}
                className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? "A eliminar..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
