"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Locale } from "@/lib/translations";

export function LanguageSelector() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Locale; label: string }[] = [
    { code: "pt", label: "Português" },
    { code: "en", label: "English" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão Seletor com Globo, Código e Seta */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-[#07213D] transition-colors hover:text-[#F85308] hover:bg-slate-100/70 cursor-pointer focus:outline-hidden"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Selecionar idioma"
      >
        <Globe className="h-4 w-4 shrink-0 text-slate-600" />
        <span className="font-bold tracking-wide">{locale.toUpperCase()}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menu Dropdown com a lista de idiomas */}
      {isOpen && (
        <div className="absolute right-0 mt-2 min-w-[140px] overflow-hidden rounded-lg border border-slate-200/80 bg-white py-1.5 shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150">
          {languages.map((lang) => {
            const isSelected = locale === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLocale(lang.code);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                  isSelected
                    ? "font-bold text-[#F85308] bg-[#F85308]/5"
                    : "font-medium text-[#07213D]/90 hover:bg-slate-50 hover:text-[#F85308]"
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

