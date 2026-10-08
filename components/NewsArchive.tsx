"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { NewsArticle } from "@/lib/newsletterData";

export function NewsArchive({ articles }: { articles: NewsArticle[] }) {
  const router = useRouter();
  const { locale } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        onClick={(event) => {
          event.preventDefault();
          try {
            sessionStorage.setItem("caixa_scroll_target", "newsletter");
          } catch {}
          router.push("/");
        }}
        className="group mb-8 inline-flex items-center gap-2 text-xs font-semibold text-[#07213D] transition-colors hover:text-[#F85308] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F85308] focus-visible:ring-offset-2 sm:text-sm"
      >
        <ArrowLeft className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
        {locale === "pt" ? "Voltar" : "Back"}
      </Link>

      <header className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#07213D] sm:text-4xl lg:text-5xl">
          {locale === "pt" ? "Notícias & Eventos" : "News & Events"}
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          {locale === "pt"
            ? "Acompanhe todas as novidades, iniciativas e eventos do Projeto C.A.I.X.A."
            : "Follow all the latest news, initiatives and events from Project C.A.I.X.A."}
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="mt-10 px-6 py-14 text-center sm:mt-12">
          <p className="text-base font-semibold text-[#07213D] sm:text-lg">
            {locale === "pt"
              ? "Ainda não existem notícias publicadas."
              : "There are no published news yet."}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {locale === "pt" ? "Volte em breve." : "Please check back soon."}
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
          const title = article.title[locale] || article.title.pt;

          return (
            <Link
              key={article.slug}
              href={`/noticias/${article.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#dcdacf] bg-[#F5F2EE] shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F85308] focus-visible:ring-offset-4"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-200/60">
                <Image
                  src={article.image}
                  alt={article.imageAlt[locale] || article.imageAlt.pt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-bold uppercase tracking-wide text-[#F85308]">
                  {article.category[locale] || article.category.pt}
                </span>
                <h2 className="mt-2 line-clamp-3 text-lg font-bold leading-snug text-[#07213D] transition-colors group-hover:text-[#F85308]">
                  {title}
                </h2>

                <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-xs font-semibold text-[#07213D]/70">
                  <span>{article.date[locale] || article.date.pt}</span>
                  <span className="flex shrink-0 items-center gap-1 font-bold transition-colors group-hover:text-[#F85308]">
                    {locale === "pt" ? "Ler notícia" : "Read more"}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          );
          })}
        </div>
      )}
    </section>
  );
}
