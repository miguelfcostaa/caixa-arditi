"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
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
      { id: "parcerias", name: "parcerias" },
      { id: "equipa", name: "equipa" },
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
    { label: "Início", href: "#", onClick: handleScrollToTop, id: "inicio" },
    { label: "O Projeto", href: "#sobre", id: "sobre" },
    { label: "Apoios", href: "#parcerias", id: "parcerias" },
    { label: "Equipa", href: "#equipa", id: "equipa" },
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
          <span className="text-xl font-bold tracking-tight text-[#07213D] sm:text-2xl">
            Projeto <span className="text-[#F85308]">C.A.I.X.A.</span>
          </span>
        </Link>

        {/* Links Desktop com indicador ativo como na referência */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <Link
                key={link.label}
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

        {/* Botão Mobile Menu */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-[#07213D] hover:bg-slate-100 focus:outline-hidden"
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
                  key={link.label}
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
