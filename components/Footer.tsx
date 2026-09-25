import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer id="contacto" className="border-t border-[#4D5061] bg-[#30323D] text-[#F1F0EF] scroll-mt-18">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 sm:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Cópia do Hero: Nome do Projeto e Descrição Curta */}
          <div className="max-w-xl space-y-3">
            <span className="text-xl font-bold tracking-tight text-white">
              Projeto <span className="">C.A.I.X.A.</span>
            </span>
            <p className="text-sm leading-relaxed text-[#F1F0EF]/80 pt-2">
              Da <span>C</span>onsciencialização à{" "}
              <span>A</span>ção:{" "}
              <span>I</span>mpacto neuropsicológico das tecnologias{" "}
              <span>X</span>R na{" "}
              <span>A</span>prendizagem para prevenção do cancro infantil.
            </p>
          </div>

          {/* Email Único para Contacto */}
          <div className="flex shrink-0 items-center">
            <a
              href="mailto:contacto@projetocaixa.pt"
              className="group inline-flex items-center gap-2.5 rounded-full border border-[#4D5061] bg-[#4D5061]/30 px-5 py-2.5 text-sm font-medium text-[#F1F0EF] transition-all hover:border-[#E06126] hover:bg-[#E06126] hover:text-white"
            >
              <Mail className="h-4 w-4 transition-colors group-hover:text-white" />
              <span>luis.ferreira@arditi.pt</span>
            </a>
          </div>
        </div>

        {/* Linha com Copyright Exclusivo */}
        <div className="mt-10 border-t border-[#4D5061]/50 pt-6 text-center sm:text-left">
          <p className="text-xs text-[#F1F0EF]/60">
            © 2026 Projeto C.A.I.X.A. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
