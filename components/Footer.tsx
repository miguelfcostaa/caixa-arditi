import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#4D5061] bg-[#30323D] text-[#F1F0EF]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Coluna Principal: Identidade do Projeto */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E06126] text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#F1F0EF]">
                Projeto C.A.I.X.A.
              </span>
            </div>

            <p className="max-w-md text-xs leading-relaxed text-[#F1F0EF]/75">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Iniciativa dedicada
              à sensibilização e prevenção oncológica pediátrica.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#4D5061]/40 px-3 py-1 text-[11px] text-[#E06126]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E06126]" />
              <span>Símbolo do Laço Dourado • Esperança e Cuidado Infantil</span>
            </div>
          </div>

          {/* Coluna de Navegação Rápida */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F1F0EF]">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#hero" className="transition-colors hover:text-[#E06126]">
                  Início
                </Link>
              </li>
              <li>
                <Link href="#sobre" className="transition-colors hover:text-[#E06126]">
                  O Projeto C.A.I.X.A.
                </Link>
              </li>
              <li>
                <Link href="#parcerias" className="transition-colors hover:text-[#E06126]">
                  Parcerias e Apoios
                </Link>
              </li>
              <li>
                <Link href="#equipa" className="transition-colors hover:text-[#E06126]">
                  Equipa do Projeto
                </Link>
              </li>
              <li>
                <Link href="#contacto" className="transition-colors hover:text-[#E06126]">
                  Contacto e Informações
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna Institucional / Informação */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F1F0EF]">
              Informação Legal
            </h4>
            <p className="text-xs leading-relaxed text-[#F1F0EF]/75">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Conteúdo estritamente informativo sem valor de diagnóstico clínico direto.
            </p>
            <div className="pt-2">
              <span className="inline-block rounded-md border border-[#4D5061] bg-[#4D5061]/30 px-2.5 py-1 text-[10px] text-[#F1F0EF]">
                Versão Web Informativa 1.0
              </span>
            </div>
          </div>
        </div>

        {/* Linha Inferior com Copyright e Crédito */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-[#4D5061] pt-8 text-xs text-[#F1F0EF]/60 sm:flex-row gap-4">
          <p>
            © 2026 <span className="text-[#F1F0EF] font-medium">Projeto C.A.I.X.A.</span> Todos os direitos reservados.
          </p>

          <p className="flex items-center gap-1.5 text-[#F1F0EF]/80">
            <span>Desenvolvido com dedicação à saúde das crianças</span>
            <Heart className="h-3.5 w-3.5 text-[#E06126] fill-[#E06126]/20" />
          </p>
        </div>
      </div>
    </footer>
  );
}
