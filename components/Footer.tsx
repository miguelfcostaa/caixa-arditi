import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer id="contacto" className="border-t border-slate-800 bg-[#07213D] text-[#F1F0EF] scroll-mt-18">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Cópia do Hero: Nome do Projeto e Descrição Curta */}
          <div className="max-w-xl space-y-3">
            <span className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Projeto <span className="text-[#F85308]">C.A.I.X.A.</span>
            </span>
            <p className="text-xs leading-relaxed text-[#F1F0EF]/75 mt-4">
              Da Consciencialização à Ação: Impacto neuropsicológico das tecnologias XR na Aprendizagem para prevenção do cancro infantil.
            </p>
          </div>

          {/* Email Único para Contacto */}
          <div className="flex shrink-0 items-center">
            <a
              href="mailto:luis.ferreira@arditi.pt"
              className="group inline-flex items-center gap-2.5 rounded-full border border-slate-700 bg-slate-800/60 px-5 py-2.5 text-sm font-medium text-[#F1F0EF] transition-all hover:border-[#F85308] hover:bg-[#F85308] hover:text-white hover:shadow-lg hover:shadow-[#F85308]/20"
            >
              <Mail className="h-4 w-4 transition-colors group-hover:text-white" />
              <span>luis.ferreira@arditi.pt</span>
            </a>
          </div>
        </div>

        {/* Linha com Copyright Exclusivo */}
        <div className="mt-8 border-t border-slate-800/80 pt-6 text-center sm:text-left">
          <p className="text-xs text-[#F1F0EF]/60">
            © 2026 Projeto C.A.I.X.A. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
