"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function ScientificBasis() {
  const router = useRouter();
  const { locale } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        onClick={(event) => {
          event.preventDefault();
          try {
            sessionStorage.setItem("caixa_scroll_target", "sobre");
          } catch {}
          router.push("/");
        }}
        className="group mb-8 inline-flex items-center gap-2 text-xs font-semibold text-[#07213D] transition-colors hover:text-[#F85308] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F85308] focus-visible:ring-offset-2 sm:text-sm"
      >
        <ArrowLeft className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
        {locale === "pt" ? "Voltar" : "Back"}
      </Link>

      <header className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#F85308]">
          {locale === "pt" ? "O Projeto" : "The Project"}
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#07213D] sm:text-4xl lg:text-5xl">
          {locale === "pt" ? "Base Científica" : "Scientific Basis"}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          {locale === "pt"
            ? "Trabalhos científicos e investigação de referência que estiveram na origem do Projeto C.A.I.X.A."
            : "Scientific work and reference research that formed the basis of Project C.A.I.X.A."}
        </p>
      </header>
    </section>
  );
}
