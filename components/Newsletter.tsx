"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { NewsArticle } from "@/lib/newsletterData";

export function Newsletter({ articles }: { articles: NewsArticle[] }) {
  const { locale, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const isCarousel = articles.length > 1;
  const maxVisibleDots = 5;
  const firstVisibleDot = Math.min(
    Math.max(currentIndex - Math.floor(maxVisibleDots / 2), 0),
    Math.max(articles.length - maxVisibleDots, 0),
  );
  const visibleDotIndexes = Array.from(
    { length: Math.min(maxVisibleDots, articles.length) },
    (_, index) => firstVisibleDot + index,
  );

  // Avançar com "dar a volta" (loop circular)
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  // Recuar com "dar a volta" (loop circular)
  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + articles.length) % articles.length,
    );
  };

  const getSlidePosition = (index: number) => {
    const offset = (index - currentIndex + articles.length) % articles.length;

    if (offset === 0) return "active";
    if (offset === 1) return "next";
    if (offset === articles.length - 1) return "previous";
    return "hidden";
  };

  // Suporte a gestos de arrasto (swipe) em dispositivos móveis
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      id="newsletter"
      className="relative border-t border-slate-200/60 bg-[#FCFAF9] py-16 sm:py-24 lg:py-32 scroll-mt-20"
    >
      <div id="noticias" className="absolute -top-20" />
      <div className="mx-auto max-w-6xl">
        {/* Cabeçalho da Secção com Controlos do Carousel */}
        <div className="px-4 text-center sm:px-6 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#07213D] sm:text-4xl">
              {t("newsletter.title")}
            </h2>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="mx-4 mt-10 px-6 py-14 text-center sm:mx-6 sm:mt-12 lg:mx-8">
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
          <>
            {/* Zona do Carousel: notícia principal com prévias laterais */}
            <div
              className="relative mt-5 h-[350px] overflow-hidden sm:mt-12 sm:h-[500px] lg:h-[540px]"
              onTouchStart={isCarousel ? handleTouchStart : undefined}
              onTouchMove={isCarousel ? handleTouchMove : undefined}
              onTouchEnd={isCarousel ? handleTouchEnd : undefined}
            >
              {articles.map((item, index) => {
            const position = getSlidePosition(index);
            const isActive = position === "active";
            const isPrevious = position === "previous";
            const isNext = position === "next";

            const positionClasses = {
              active:
                "left-1/2 z-20 w-[74%] -translate-x-1/2 scale-100 opacity-100 sm:w-[66%] lg:w-[52%]",
              previous:
                "left-[-25%] z-10 w-[60%] scale-[0.82] opacity-45 blur-[3px] sm:left-[-24%] sm:w-[50%] lg:left-[-20%] lg:w-[42%]",
              next:
                "right-[-25%] z-10 w-[60%] scale-[0.82] opacity-45 blur-[3px] sm:right-[-24%] sm:w-[50%] lg:right-[-20%] lg:w-[42%]",
              hidden:
                "left-1/2 z-0 w-[62%] -translate-x-1/2 scale-75 opacity-0 pointer-events-none",
            }[position];

            const card = (
              <div
                className={`group flex w-full flex-col overflow-hidden rounded-2xl border border-[#dcdacf] bg-[#F5F2EE] text-left shadow-sm ${
                  isActive
                    ? "transition-shadow duration-300 hover:-translate-y-1 hover:shadow-md"
                    : "shadow-lg"
                }`}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-200/60">
                  <Image
                    src={item.image}
                    alt={item.imageAlt[locale] || item.imageAlt.pt}
                    fill
                    sizes="(max-width: 640px) 84vw, (max-width: 1024px) 72vw, 62vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex min-h-36 flex-1 flex-col p-4 sm:min-h-40 sm:p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#F85308] sm:text-xs">
                    {item.category[locale] || item.category.pt}
                  </span>
                  <h3 className="mt-2 line-clamp-3 text-[15px] font-bold leading-snug text-[#07213D] transition-colors group-hover:text-[#F85308] sm:line-clamp-2 sm:text-lg lg:text-xl">
                    {item.title[locale] || item.title.pt}
                  </h3>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-[10px] font-semibold text-[#07213D]/70 transition-colors group-hover:text-[#F85308] sm:text-xs">
                    <span>{item.date[locale] || item.date.pt}</span>
                    <span className="flex shrink-0 items-center gap-1 font-bold">
                      {locale === "pt" ? "Ler notícia" : "Read more"}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            );

            return (
              <div
                key={item.slug}
                className={`absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out ${positionClasses}`}
                aria-hidden={position === "hidden" ? true : undefined}
              >
                {isActive ? (
                  <Link
                    href={`/noticias/${item.slug}`}
                    className="block cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F85308] focus-visible:ring-offset-4"
                  >
                    {card}
                  </Link>
                ) : isPrevious || isNext ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className="block w-full cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F85308] focus-visible:ring-offset-4"
                    aria-label={
                      locale === "pt"
                        ? `Mostrar notícia: ${item.title.pt}`
                        : `Show article: ${item.title.en}`
                    }
                  >
                    {card}
                  </button>
                ) : (
                  <div>{card}</div>
                )}
              </div>
            );
              })}

              {isCarousel && (
                <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute top-1/2 left-[10%] z-30 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#07213D] shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-[#F85308] hover:bg-[#F85308] hover:text-white active:scale-95 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F85308] focus-visible:ring-offset-2 sm:left-[11%] lg:left-[10%]"
                aria-label={locale === "pt" ? "Notícia anterior" : "Previous article"}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute top-1/2 right-[10%] z-30 flex h-11 w-11 translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#07213D] shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-[#F85308] hover:bg-[#F85308] hover:text-white active:scale-95 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F85308] focus-visible:ring-offset-2 sm:right-[11%] lg:right-[10%]"
                aria-label={locale === "pt" ? "Próxima notícia" : "Next article"}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
                </>
              )}
            </div>

            {/* Paginação limitada */}
            {isCarousel && (
              <div className="mt-5 flex items-center justify-center sm:mt-7">
                <div className="flex min-w-28 items-center justify-center gap-2">
                  {visibleDotIndexes.map((idx) => (
                    <button
                      key={articles[idx].slug}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 focus:outline-hidden ${
                        currentIndex === idx
                          ? "w-8 bg-[#F85308]"
                          : "w-2.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                      aria-label={`Ir para o slide ${idx + 1}`}
                      aria-current={currentIndex === idx ? "true" : undefined}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-14 flex justify-center px-4 sm:mt-14">
              <Link
                href="/noticias"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#F85308] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F85308]/25 transition-all hover:-translate-y-0.5 hover:bg-[#e04804] hover:shadow-xl hover:shadow-[#F85308]/30"
              >
                {locale === "pt" ? "Ver todas" : "View all"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
