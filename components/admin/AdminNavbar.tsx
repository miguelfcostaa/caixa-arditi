"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, ExternalLink, Newspaper, Plus } from "lucide-react";

export function AdminNavbar() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-bold text-[#07213D] transition-opacity hover:opacity-90"
          >
            <img src="/logo.ico" alt="Logo do Projeto C.A.I.X.A." className="h-12 w-14" />
          </Link>

          <h2 className="text-lg font-extrabold text-[#07213D] sm:text-xl">
            Gestão de Notícias & Eventos
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/noticias"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-lg text-xs font-medium text-slate-700 transition-colors hover:text-[#F85308] sm:inline-flex sm:text-sm"
            title="Ver arquivo público de notícias"
          >
            <span>Ver Website</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:text-red-600 sm:px-3 sm:py-2 sm:text-sm cursor-pointer"
            title="Terminar sessão"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">
              {loggingOut ? "A sair..." : "Sair"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

