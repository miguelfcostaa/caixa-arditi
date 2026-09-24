import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-12 sm:pt-20 sm:pb-20">
      {/* Luz difusa de fundo arquitetural com #E06126 */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#E06126]/15 via-[#4D5061]/10 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Título Principal */}
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-[#30323D] sm:text-6xl sm:leading-tight">
            Projeto{" "}
            <span className="text-[#E06126]">
              C.A.I.X.A.
            </span>
          </h1>

          {/* Descrição do Projeto */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#4D5061] sm:text-lg">
            Da <span className="text-[#E06126] font-bold">C</span>onsciencialização à <span className="text-[#E06126] font-bold">A</span>ção: <span className="text-[#E06126] font-bold">I</span>mpacto neuropsicológico das tecnologias <span className="text-[#E06126] font-bold">X</span>R na <span className="text-[#E06126] font-bold">A</span>prendizagem para prevenção do cancro infantil. 
          </p>

          {/* Botões de Ação */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#sobre"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E06126] px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-[#E06126]/25 transition-all hover:bg-[#c8531d] hover:shadow-md hover:shadow-[#E06126]/30"
            >
              <span>Conhecer o Projeto</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#4D5061]/35 bg-[#F1F0EF] px-6 py-3 text-sm font-semibold text-[#30323D] shadow-2xs transition-all hover:border-[#E06126] hover:bg-[#F1F0EF] hover:text-[#E06126]"
            >
              <span>Contactar Equipa</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
