"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (window.scrollY < 80) {
        setActiveSection("inicio");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    const sections = [
      { id: "hero", name: "inicio" },
      { id: "sobre", name: "sobre" },
      { id: "equipa", name: "equipa" },
      { id: "parcerias", name: "parcerias" },
      { id: "contacto", name: "contacto" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && window.scrollY >= 80) {
            const match = sections.find((s) => s.id === entry.target.id);
            if (match) {
              setActiveSection(match.name);
            }
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", window.location.pathname);
    setActiveSection("inicio");
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: t("navbar.home"), href: "#", onClick: handleScrollToTop, id: "inicio" },
    { label: t("navbar.about"), href: "#sobre", id: "sobre" },
    { label: t("navbar.team"), href: "#equipa", id: "equipa" },
    { label: t("navbar.partners"), href: "#parcerias", id: "parcerias" },
    { label: t("navbar.contact"), href: "#contacto", id: "contacto" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? "bg-[#FCFAF9]/95 backdrop-blur-md border-b border-slate-200/60 shadow-xs"
          : "bg-transparent border-b border-transparent shadow-none"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logótipo do Projeto */}
        <Link
          href="#"
          onClick={handleScrollToTop}
          className="group flex items-center gap-1.5 transition-opacity hover:opacity-90"
        >
          <img src="/logo.ico" alt="Logo do Projeto C.A.I.X.A." className="h-10 w-auto sm:h-12" />
        </Link>

        {/* Lado Direito Desktop: Links, Seletor de Idioma e Botão de Contacto */}
        <div className="hidden items-center gap-7 md:flex">
          <nav className="flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={link.onClick}
                  className={`relative py-1 text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-[#F85308]"
                      : "text-[#07213D] hover:text-[#F85308]"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#F85308]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Divisória subtil */}
          <div className="h-5 w-px bg-slate-300/70" />

          {/* Seletor de Idioma (PT | EN) */}
          <div className="flex items-center rounded-full bg-slate-200/70 p-0.5 text-xs font-bold text-[#07213D]">
            <button
              type="button"
              onClick={() => setLocale("pt")}
              className={`rounded-full px-2.5 py-1 transition-all cursor-pointer ${
                locale === "pt"
                  ? "bg-white text-[#F85308] shadow-xs font-extrabold"
                  : "text-[#07213D]/70 hover:text-[#07213D]"
              }`}
              aria-label="Mudar para Português"
            >
              PT
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`rounded-full px-2.5 py-1 transition-all cursor-pointer ${
                locale === "en"
                  ? "bg-white text-[#F85308] shadow-xs font-extrabold"
                  : "text-[#07213D]/70 hover:text-[#07213D]"
              }`}
              aria-label="Switch to English"
            >
              EN
            </button>
          </div>
        </div>

        {/* Ações Mobile: Seletor de Idioma + Botão Menu */}
        <div className="flex items-center gap-3 md:hidden">
          <div className="flex items-center rounded-full bg-slate-200/70 p-0.5 text-xs font-bold text-[#07213D]">
            <button
              type="button"
              onClick={() => setLocale("pt")}
              className={`rounded-full px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                locale === "pt"
                  ? "bg-white text-[#F85308] shadow-xs font-extrabold"
                  : "text-[#07213D]/70"
              }`}
            >
              PT
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`rounded-full px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                locale === "en"
                  ? "bg-white text-[#F85308] shadow-xs font-extrabold"
                  : "text-[#07213D]/70"
              }`}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-[#07213D] hover:bg-slate-100 focus:outline-hidden cursor-pointer"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Dropdown Mobile */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200/60 bg-[#FCFAF9] px-4 pt-3 pb-6 shadow-lg md:hidden">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    if (link.onClick) {
                      link.onClick(e);
                    }
                    setActiveSection(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                    isActive
                      ? "bg-[#F85308]/10 text-[#F85308]"
                      : "text-[#07213D]/85 hover:bg-slate-100 hover:text-[#F85308]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
