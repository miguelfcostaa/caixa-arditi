"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Início", href: "#hero" },
    { label: "O Projeto", href: "#sobre" },
    { label: "Parcerias", href: "#parcerias" },
    { label: "Equipa", href: "#equipa" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#cc551f] bg-[#E06126] shadow-sm transition-all">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logótipo / Nome do Projeto */}
        <Link
          href="#hero"
          className="group flex items-center gap-3 transition-opacity hover:opacity-95"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F0EF] text-[#E06126] shadow-xs transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white">
              Projeto C.A.I.X.A.
            </span>
            <span className="text-xs font-medium text-white/85">
              Prevenção Oncológica Infantil
            </span>
          </div>
        </Link>

        {/* Links Desktop */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Botão de Destaque Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="#contacto"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F0EF] px-4 py-2 text-xs font-semibold text-[#E06126] shadow-xs transition-all hover:bg-[#DFDDD9] hover:shadow-md"
          >
            <span>Falar Connosco</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#E06126]" />
          </Link>
        </div>

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
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="#contacto"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#F1F0EF] py-2.5 text-center text-xs font-semibold text-[#E06126] shadow-xs hover:bg-[#DFDDD9]"
              >
                <span>Falar Connosco</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
