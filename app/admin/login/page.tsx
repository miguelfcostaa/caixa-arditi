"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Por favor, introduza a palavra-passe.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Palavra-passe incorreta.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erro de ligação ao servidor. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FCFAF9] px-4 py-16">
      {/* Logo + Identidade */}
      <Link href="/" className="mb-10 flex flex-col items-center gap-3 transition-opacity hover:opacity-80">
        <img src="/logo.ico" alt="Logo Projeto C.A.I.X.A." className="h-16 w-auto" />
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-[#07213D]">
            Painel de Administração
          </h1>
          <p className="mt-1 text-sm text-[#07213D]/60">
            Projeto C.A.I.X.A.
          </p>
        </div>
      </Link>

      {/* Cartão de login */}
      <div className="w-full max-w-sm">
        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#07213D]"
            >
              Palavra-passe de acesso
            </label>

            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-[#07213D] placeholder:text-[#07213D]/25 transition-colors focus:border-[#F85308] focus:outline-hidden focus:ring-2 focus:ring-[#F85308]/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#07213D]/30 hover:text-[#07213D]/60 cursor-pointer"
                aria-label={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#07213D] px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#07213D]/90 focus:outline-hidden focus:ring-2 focus:ring-[#F85308] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>A verificar...</span>
            ) : (
              <>
                <span>Entrar no Painel</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-[#07213D]/30">
          Área restrita — apenas para administradores
        </p>
      </div>
    </div>
  );
}
