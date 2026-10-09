"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
} from "lucide-react";
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
      {actionError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 sm:text-sm">
          {actionError}
        </div>
      )}

      {/* Controlo de Filtros e Botão de Ação */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-[#07213D] text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Todas ({news.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter("publicada")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              filter === "publicada"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Publicadas ({publishedCount})
          </button>

          <button
            type="button"
            onClick={() => setFilter("rascunho")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              filter === "rascunho"
                ? "bg-amber-600 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Rascunhos ({draftCount})
          </button>
        </div>

        <Link
          href="/admin/nova"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F85308] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#D64505] sm:text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Criar Nova Notícia</span>
        </Link>
      </div>

      {/* Lista de Notícias */}
      {filteredNews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-sm font-semibold text-slate-600">
            Nenhuma notícia encontrada com o filtro selecionado.
          </p>
          <Link
            href="/admin/nova"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#F85308] hover:underline sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar a primeira notícia</span>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          {filteredNews.map((article) => {
            const isPublished = article.status === "publicada";

            return (
              <div
                key={article.slug}
                className="flex flex-col gap-4 p-4 transition-colors hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                {/* Lado Esquerdo: Imagem + Detalhes */}
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-20 sm:w-28">
                    <NewsImage
                      src={article.image}
                      alt={article.title.pt}
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          isPublished
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                            : "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isPublished ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {isPublished ? "Publicada" : "Rascunho"}
                      </span>

                      <span className="text-xs font-medium text-slate-500">
                        {article.category.pt}
                      </span>

                      <span className="text-xs text-slate-300">•</span>

                      <span className="text-xs text-slate-500">
                        {article.publishedAt}
                      </span>
                    </div>

                    <h3 className="mt-1 text-sm font-bold text-[#07213D] sm:text-base">
                      {article.title.pt}
                    </h3>

                    {article.title.en && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 italic">
                        EN: {article.title.en}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-slate-400 font-mono">
                      /noticias/{article.slug}
                    </p>
                  </div>
                </div>

                {/* Lado Direito: Ações */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Pré-visualizar ou Ver */}
                  {isPublished ? (
                    <Link
                      href={`/noticias/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100"
                      title="Ver no website público"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      href={`/admin/preview/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100"
                      title="Pré-visualizar rascunho"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  )}

                  {/* Editar */}
                  <Link
                    href={`/admin/editar/${article.slug}`}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200"
                    title="Editar notícia"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Editar</span>
                  </Link>

                  {/* Remover */}
                  <button
                    type="button"
                    onClick={() => setDeleteModalSlug(article.slug)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                    title="Remover notícia"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Confirmação de Remoção */}
      {deleteModalSlug && targetArticleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-[#07213D]">
              Remover notícia?
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Tem a certeza de que deseja remover a notícia{" "}
              <strong>&ldquo;{targetArticleToDelete.title.pt}&rdquo;</strong>?
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Esta ação criará um commit de remoção no repositório.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalSlug(null)}
                disabled={deleting}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => handleDelete(deleteModalSlug)}
                disabled={deleting}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? "A remover..." : "Sim, remover"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

