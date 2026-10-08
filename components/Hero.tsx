"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedMesh } from "./AnimatedMesh";
import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden bg-[#FCFAF9] pt-24 pb-16 sm:pt-28 sm:pb-20 scroll-mt-0"
    >
      <AnimatedMesh />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-left">
          {/* Título Principal */}
          <h1 className="text-5xl font-extrabold tracking-tight text-[#07213D] sm:text-6xl md:text-7xl">
            {t("hero.titlePrefix")}
            <span className="text-[#F85308]">{t("hero.titleHighlight")}</span>
          </h1>

          {/* Parágrafo Descritivo */}
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#07213D]/80 sm:text-lg">
            {t("hero.description")}
          </p>

          {/* Botões de Chamada para Ação */}
          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("sobre");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                window.history.replaceState(null, "", "/");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F85308] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F85308]/25 transition-all hover:bg-[#e04804] hover:shadow-xl hover:shadow-[#F85308]/30 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{t("hero.btnAbout")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
