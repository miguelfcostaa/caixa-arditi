"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, MapPin, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("luis.ferreira@arditi.pt");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", window.location.pathname);
  };

  return (
    <footer id="contacto" className="border-t border-slate-800 bg-[#07213D] text-[#F1F0EF] scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 sm:py-16">
        {/* Cabeçalho da Secção de Contacto */}
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t("footer.contactTitle")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#F1F0EF]/80">
            {t("footer.contactDesc")}
          </p>
        </div>

        {/* Informações Diretas: Email em cima, Localização por baixo (sem caixas, com ícone de copiar discreto) */}
        <div className="mt-10 space-y-8">
          {/* Email de Coordenação */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t("footer.directEmailTitle")}
            </span>
            <p className="mt-1 font-semibold text-slate-300">
                {t("footer.coordinatorName")} ({t("footer.coordinatorRole")})
                <span className=" text-white break-all ml-4">
                    luis.ferreira@arditi.pt
                </span>
                <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inlinfae-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                    title={copied ? t("footer.copied") : t("footer.copyEmail")}
                    aria-label={copied ? t("footer.copied") : t("footer.copyEmail")}
                >
                    {copied ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                    <Copy className="h-4 w-4" />
                    )}
                </button>
            </p>
          </div>

          {/* Localização */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t("footer.institutionTitle")}
            </span>
            <p className="mt-3 text-sm sm:text-base font-bold text-white">
              {t("footer.institutionName")}
            </p>
            <p className="justify-center mt-1.5 text-xs sm:text-sm text-slate-300">
              <MapPin className="inline h-4 w-4 mb-1 text-slate-400" /> {t("footer.institutionAddress")} 
            </p>
          </div>
        </div>

        {/* Barra Inferior com Navegação Rápida e Direitos */}
        <div className="mt-14 flex flex-col gap-6 border-t border-slate-800/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="#"
              onClick={handleScrollToTop}
              className="text-lg font-bold tracking-tight text-white hover:text-slate-200 transition-colors"
            >
              Projeto <span className="text-[#F85308]">C.A.I.X.A.</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-400">
            <Link href="#" onClick={handleScrollToTop} className="hover:text-white transition-colors">
              {t("navbar.home")}
            </Link>
            <Link href="#sobre" className="hover:text-white transition-colors">
              {t("navbar.about")}
            </Link>
            <Link href="#equipa" className="hover:text-white transition-colors">
              {t("navbar.team")}
            </Link>
            <Link href="#parcerias" className="hover:text-white transition-colors">
              {t("navbar.partners")}
            </Link>
          </div>

          <p className="text-xs text-[#F1F0EF]/60">
            {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
