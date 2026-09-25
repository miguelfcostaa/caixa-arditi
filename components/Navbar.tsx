"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", window.location.pathname);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Início", href: "#", onClick: handleScrollToTop },
    { label: "O Projeto", href: "#sobre" },
    { label: "Apoios", href: "#parcerias" },
    { label: "Equipa", href: "#equipa" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#cc551f] bg-[#E06126] shadow-sm transition-all">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logótipo / Nome do Projeto - Clicar sobe até ao topo da página */}
        <Link
          href="#"
          onClick={handleScrollToTop}
          className="group flex items-center gap-3 transition-opacity hover:opacity-95"
        >
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white">
              Projeto C.A.I.X.A.
            </span>
          </div>
        </Link>

        {/* Links Desktop */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={link.onClick}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Botão Mobile Menu */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/15 focus:outline-hidden"
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
        <div className="border-t border-white/20 bg-[#E06126] px-4 pt-2 pb-6 md:hidden">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.onClick) {
                    link.onClick(e);
                  }
                  setMobileMenuOpen(false);
                }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
