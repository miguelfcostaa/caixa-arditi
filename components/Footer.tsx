"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Copy, Check, MapPin, Mail, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const COORDINATOR_EMAIL = "luis.ferreira@arditi.pt";
const COPIED_FEEDBACK_MS = 2500;

/** Edifício Madeira Tecnopolo, Caminho da Penteada, Funchal. */
const MAP_LATITUDE = 32.6599776;
const MAP_LONGITUDE = -16.9263114;
const MAP_EMBED_URL = `https://www.openstreetmap.org/export/embed.html?bbox=-16.9308%2C32.6572%2C-16.9218%2C32.6628&layer=mapnik&marker=${MAP_LATITUDE}%2C${MAP_LONGITUDE}`;
const MAP_LINK_URL = `https://www.openstreetmap.org/?mlat=${MAP_LATITUDE}&mlon=${MAP_LONGITUDE}#map=17/${MAP_LATITUDE}/${MAP_LONGITUDE}`;

export function Footer() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(COORDINATOR_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
    } catch {
      // Clipboard indisponível (contexto inseguro ou permissão negada):
      // o endereço continua visível e o link mailto continua a funcionar.
    }
  };

  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (pathname !== "/") {
      try {
        sessionStorage.setItem("caixa_scroll_target", sectionId);
      } catch {}
      router.push("/");
    } else {
      if (sectionId === "inicio" || sectionId === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const element =
          document.getElementById(sectionId) ||
          (sectionId === "noticias" ? document.getElementById("newsletter") : null);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
      window.history.replaceState(null, "", "/");
    }
  };

  const handleScrollToTop = (e: React.MouseEvent) => {
    handleNavClick(e, "inicio");
  };

  return (
    <footer
      id="contacto"
      className="relative flex min-h-[calc(100vh-5rem)] flex-col justify-between border-t border-slate-800 bg-[#07213D] text-[#F1F0EF] scroll-mt-20"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        {/* Cabeçalho e coordenação à esquerda, instituição anfitriã e mapa à direita */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {t("footer.contactTitle")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#F1F0EF]/80">
              {t("footer.contactDesc")}
            </p>

            {/* Email de Coordenação */}
            <span className="mt-8 block text-xs font-bold uppercase tracking-wider text-slate-400">
              {t("footer.directEmailTitle")}
            </span>
            <p className="mt-3 text-base font-semibold text-white">
              {t("footer.coordinatorName")}
            </p>
            <p className="mt-0.5 text-sm text-slate-400">
              {t("footer.coordinatorRole")}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${COORDINATOR_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#F85308] px-3 py-2.5 text-xs sm:text-sm sm:px-4 font-semibold text-white transition-colors hover:bg-[#D64505]"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span className="break-all">{COORDINATOR_EMAIL}</span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/60 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white cursor-pointer"
                title={copied ? t("footer.copied") : t("footer.copyEmail")}
                aria-label={copied ? t("footer.copied") : t("footer.copyEmail")}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Instituição Anfitriã & Localização */}
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-700/60">
            <iframe
              src={MAP_EMBED_URL}
              title={t("footer.mapLabel")}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-44 w-full shrink-0 border-0 sm:h-48"
            />
            <div className="flex-1 bg-[#F1F0EF]/5 px-5 py-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t("footer.institutionTitle")}
              </span>
              <p className="mt-2 text-sm font-bold leading-snug text-white">
                {t("footer.institutionName")}
              </p>
              <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span>{t("footer.institutionAddress")}</span>
              </p>
              <a
                href={MAP_LINK_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#F85308] transition-colors hover:text-[#FF7034]"
              >
                {t("footer.viewOnMap")}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Barra Inferior com Navegação Rápida e Direitos */}
        <div className="mt-10 sm:mt-14 flex flex-col items-center gap-6 border-t border-slate-800/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, "inicio")}
              className="text-lg font-bold tracking-tight text-white hover:text-slate-200 transition-colors cursor-pointer"
            >
              Projeto <span className="text-[#F85308]">C.A.I.X.A.</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-slate-400">
            <Link href="/" onClick={(e) => handleNavClick(e, "inicio")} className="hover:text-white transition-colors cursor-pointer">
              {t("navbar.home")}
            </Link>
            <Link href="/" onClick={(e) => handleNavClick(e, "sobre")} className="hover:text-white transition-colors cursor-pointer">
              {t("navbar.about")}
            </Link>
            <Link href="/" onClick={(e) => handleNavClick(e, "equipa")} className="hover:text-white transition-colors cursor-pointer">
              {t("navbar.team")}
            </Link>
            <Link href="/" onClick={(e) => handleNavClick(e, "parcerias")} className="hover:text-white transition-colors cursor-pointer">
              {t("navbar.partners")}
            </Link>
            <Link href="/" onClick={(e) => handleNavClick(e, "noticias")} className="hover:text-white transition-colors cursor-pointer">
              {t("navbar.news")}
            </Link>
            <Link href="/" onClick={(e) => handleNavClick(e, "contacto")} className="hover:text-white transition-colors cursor-pointer">
              {t("navbar.contact")}
            </Link>
          </div>

          <p className="text-center sm:text-right text-xs text-[#F1F0EF]/60">
            {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
