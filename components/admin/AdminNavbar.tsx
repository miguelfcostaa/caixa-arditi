"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

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
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-[#FCFAF9]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Título */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <img src="/logo.ico" alt="Logo do Projeto C.A.I.X.A." className="h-10 w-auto sm:h-12" />
          </Link>
          <div className="hidden sm:block">
            <h1 className="text-base font-extrabold leading-tight text-[#07213D]">
              Gestão de Notícias
            </h1>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/noticias"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-xs font-semibold text-[#07213D]/60 transition-colors hover:text-[#F85308] sm:inline-flex sm:text-sm"
          >
            Ver website ↗
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#07213D] transition-colors hover:border-rose-300 hover:text-rose-600 disabled:opacity-50 cursor-pointer sm:px-4 sm:py-2 sm:text-sm"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{loggingOut ? "A sair..." : "Sair"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
