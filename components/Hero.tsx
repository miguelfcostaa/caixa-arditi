import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-12 sm:pt-20 sm:pb-20">
      {/* Luz difusa de fundo arquitetural em harmonia com a imagem */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#EE6F36]/15 via-[#DFDDD9]/40 to-[#D1D1D1]/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Título Principal */}
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-[#2A2826] sm:text-6xl sm:leading-tight">
            Projeto{" "}
            <span className="text-[#EE6F36]">
              C.A.I.X.A.
            </span>
          </h1>

          {/* Descrição do Projeto */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#2A2826] sm:text-lg">
            Da <span className="text-[#EE6F36] font-bold">C</span>onsciencialização à <span className="text-[#EE6F36] font-bold">A</span>ção: <span className="text-[#EE6F36] font-bold">I</span>mpacto neuropsicológico das tecnologias <span className="text-[#EE6F36] font-bold">X</span>R na <span className="text-[#EE6F36] font-bold">A</span>prendizagem para prevenção do cancro infantil. 
          </p>

          {/* Botões de Ação */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#sobre"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#EE6F36] px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-[#EE6F36]/25 transition-all hover:bg-[#d85e27] hover:shadow-md hover:shadow-[#EE6F36]/30"
            >
              <span>Conhecer o Projeto</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D1D1D1] bg-[#DFDDD9]/90 px-6 py-3 text-sm font-semibold text-[#2A2826] shadow-2xs transition-all hover:border-[#EE6F36] hover:bg-[#DFDDD9] hover:text-[#EE6F36]"
            >
              <span>Contactar Equipa</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
