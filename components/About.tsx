"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export function About() {
  const { t } = useLanguage();

  return (
    <section
      id="sobre"
      className="relative flex min-h-screen flex-col justify-center border-t border-slate-200/60 bg-[#F5F2EE] py-16 sm:py-24 lg:py-32 scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Coluna 1: Texto Informativo */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-[#F85308]">
              <span>{t("about.tag")}</span>
            </div>
            <h2 className="text-left text-3xl font-bold tracking-tight text-[#07213D] sm:text-4xl lg:text-justify">
              {t("about.title")}
            </h2>
            <p className="mt-6 sm:mt-8 text-base leading-relaxed text-justify text-[#334155]">
              {t("about.description")}
            </p>
          </div>

          {/* Coluna 2: 2 Imagens sobrepostas verticalmente (sem sombras) */}
          <div className="flex w-full flex-col items-center justify-center gap-4 sm:gap-6">
            <div className="relative h-56 sm:h-80 w-[90%] max-w-md lg:max-w-lg overflow-hidden rounded-2xl bg-white/40">
              <Image
                src="/images/image1.jpg"
                alt={t("about.image1Alt")}
                fill
                sizes="(max-width: 1024px) 100vw, 512px"
                className="object-cover"
              />
            </div>
            <div className="relative h-56 sm:h-80 w-[90%] max-w-md lg:max-w-lg overflow-hidden rounded-2xl bg-white/40">
              <Image
                src="/images/image2.jpg"
                alt={t("about.image2Alt")}
                fill
                sizes="(max-width: 1024px) 100vw, 512px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
