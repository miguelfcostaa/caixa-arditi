"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { NewsArticle } from "@/lib/newsletterData";
import { NewsImage } from "@/components/NewsImage";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function ArticleView({
  article,
  articles = [],
  banner,
}: {
  article: NewsArticle;
  articles?: NewsArticle[];
  banner?: React.ReactNode;
}) {
  const router = useRouter();
  const { locale } = useLanguage();

  const title = article.title[locale] || article.title.pt;
  const date = article.date[locale] || article.date.pt;
  const paragraphs = article.content[locale] || article.content.pt;

  const otherArticles = articles.filter((a) => a.slug !== article.slug);

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFAF9]">
      {banner && (
        <aside className="fixed top-0 left-0 right-0 z-60 h-11 border-b border-amber-300 bg-amber-50">
          {banner}
        </aside>
      )}

      <Navbar topOffset={banner ? "top-11" : "top-0"} />

      <main className={`flex-1 pb-20 sm:pb-24 ${banner ? "pt-36 sm:pt-40" : "pt-28 sm:pt-32"}`}>
        {/* Contentor com largura padrão uniforme max-w-6xl de todo o site */}
        <article className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Botão de retroceder */}
          <div className="mb-6 flex justify-between ">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#07213D] transition-colors hover:text-[#F85308] cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{locale === "pt" ? "Voltar" : "Back"}</span>
            </button>
            <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {date}    
            </div>
          </div>

          {/* Imagem de Destaque em formato banner esticado (~1200x200), cover stretch e overflow hidden */}
          <div className="relative mt-8 h-[150px] sm:h-[150px] md:h-[150px] w-full overflow-hidden bg-slate-200 shadow-sm">
            <NewsImage
              src={article.image}
              alt={title}
              priority
         
              className="h-full w-full object-cover object-center"
            />
          </div>
          
          {/* Título da Notícia */}
          <h1 className="mt-8 text-left text-2xl font-extrabold leading-tight text-[#07213D] sm:text-3xl sm:leading-snug lg:text-4xl lg:text-justify lg:leading-relaxed">
            {title}
          </h1>


          {/* Conteúdo do Artigo */}
          <div className="mx-auto mt-10 space-y-6 text-base sm:text-lg leading-relaxed text-[#334155]">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="text-justify leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {/* Divisória */}
          <div className="my-14 h-px w-full bg-slate-200" />

          {/* Outras Notícias Recomendadas */}
          {otherArticles.length > 0 && (
            <div className="mt-18">
              <h2 className="text-2xl font-bold tracking-tight text-[#07213D] sm:text-3xl">
                {locale === "pt" ? "Outras Notícias e Atividades" : "Other News and Activities"}
              </h2>

              <div className="mt-10 mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherArticles.slice(0, 3).map((other) => (
                  <Link
                    key={other.slug}
                    href={`/noticias/${other.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#dcdacf] bg-[#F5F2EE] shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
                      <NewsImage
                        src={other.image}
                        alt={other.title[locale] || other.title.pt}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex min-h-40 flex-1 flex-col p-4 sm:p-5">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#F85308] sm:text-xs">
                        {other.category[locale] || other.category.pt}
                      </span>
                      <h3 className="mt-2 line-clamp-3 text-base font-bold leading-snug text-[#07213D] transition-colors group-hover:text-[#F85308] sm:text-lg">
                        {other.title[locale] || other.title.pt}
                      </h3>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs font-semibold text-[#07213D]/70 transition-colors group-hover:text-[#F85308]">
                        <span>{other.date[locale] || other.date.pt}</span>
                        <span className="flex shrink-0 items-center gap-1 font-bold">
                          {locale === "pt" ? "Ler notícia" : "Read more"}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-20 flex justify-center">
            <Link
              href="/noticias"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#F85308] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F85308]/25 transition-all hover:-translate-y-0.5 hover:bg-[#e04804] hover:shadow-xl hover:shadow-[#F85308]/30"
            >
              {locale === "pt" ? "Ver todas" : "View all"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
