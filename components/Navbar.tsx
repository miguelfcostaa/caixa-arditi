"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

export function Navbar({ topOffset = "top-0" }: { topOffset?: string } = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (window.scrollY < 80) {
        setActiveSection("inicio");
      } else if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 80
      ) {
        setActiveSection("contacto");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    const sections = [
      { id: "hero", name: "inicio" },
      { id: "sobre", name: "sobre" },
      { id: "equipa", name: "equipa" },
      { id: "parcerias", name: "parcerias" },
      { id: "newsletter", name: "noticias" },
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

  // Se o utilizador navegou a partir de outra página (ex: /noticias/[slug]), efetua o scroll suave ao chegar à Home
  useEffect(() => {
    if (pathname === "/") {
      try {
        const targetId = sessionStorage.getItem("caixa_scroll_target");
        if (targetId) {
          sessionStorage.removeItem("caixa_scroll_target");
          setTimeout(() => {
            if (targetId === "inicio" || targetId === "hero") {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setActiveSection("inicio");
            } else {
              const el =
                document.getElementById(targetId) ||
                (targetId === "noticias" ? document.getElementById("newsletter") : null) ||
                (targetId === "newsletter" ? document.getElementById("newsletter") : null);
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                setActiveSection(targetId === "newsletter" ? "noticias" : targetId);
              }
            }
            window.history.replaceState(null, "", "/");
          }, 150);
        }
      } catch {}
    }
  }, [pathname]);

  // Função centralizada para navegar suavemente e sem adicionar qualquer #hash ao link/URL
  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();

    const wasMobileOpen = mobileMenuOpen;
    if (mobileMenuOpen) setMobileMenuOpen(false);

    if (pathname !== "/") {
      try {
        sessionStorage.setItem("caixa_scroll_target", sectionId);
      } catch {}
      router.push("/");
    } else {
      const executeScroll = () => {
        if (sectionId === "inicio" || sectionId === "hero") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setActiveSection("inicio");
        } else {
          const element =
            document.getElementById(sectionId) ||
            (sectionId === "noticias" ? document.getElementById("newsletter") : null) ||
            (sectionId === "newsletter" ? document.getElementById("newsletter") : null);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setActiveSection(sectionId === "newsletter" ? "noticias" : sectionId);
          }
        }
        // Mantém a barra de endereço estritamente limpa (sem #equipa, #sobre, etc.)
        window.history.replaceState(null, "", "/");
      };

      if (wasMobileOpen) {
        setTimeout(executeScroll, 60);
      } else {
        executeScroll();
      }
    }
  };

  const navLinks = [
    { label: t("navbar.home"), id: "inicio" },
    { label: t("navbar.about"), id: "sobre" },
    { label: t("navbar.team"), id: "equipa" },
    { label: t("navbar.partners"), id: "parcerias" },
    { label: t("navbar.news"), id: "noticias" },
    { label: t("navbar.contact"), id: "contacto" },
  ];

  return (
    <header
      className={`fixed ${topOffset} left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? "bg-[#FCFAF9]/95 backdrop-blur-md border-b border-slate-200/60 shadow-xs"
          : "bg-transparent border-b border-transparent shadow-none"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logótipo do Projeto */}
        <Link
          href="/"
          onClick={(e) => handleNavClick(e, "inicio")}
          className="group flex items-center gap-1.5 transition-opacity hover:opacity-90"
        >
          <img src="/logo.ico" alt="Logo do Projeto C.A.I.X.A." className="h-10 w-auto sm:h-12" />
        </Link>

        {/* Lado Direito Desktop: Links e Seletor de Idioma */}
        <div className="hidden items-center gap-5 lg:gap-7 md:flex">
          <nav className="flex items-center gap-5 lg:gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === "/" && activeSection === link.id;
              return (
                <Link
                  key={link.id}
                  href="/"
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`relative py-1 text-sm font-semibold transition-colors cursor-pointer ${
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

          {/* Seletor de Idioma Dropdown */}
          <LanguageSelector />
        </div>

        {/* Ações Mobile: Seletor de Idioma + Botão Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSelector />

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
              const isActive = pathname === "/" && activeSection === link.id;
              return (
                <Link
                  key={link.id}
                  href="/"
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer ${
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
