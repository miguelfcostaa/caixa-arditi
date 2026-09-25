import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#FCFAF9] pt-24 pb-16 sm:pt-28 sm:pb-20 scroll-mt-0"
    >
      {/* Imagem de Fundo com Ondas Orgânicas como na Referência */}
      <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none overflow-hidden">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          quality={100}
          className="object-cover object-center"
        />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-left">

          {/* Título Principal */}
          <h1 className="text-5xl font-extrabold tracking-tight text-[#07213D] sm:text-6xl md:text-7xl">
            Projeto <span className="text-[#F85308]">C.A.I.X.A.</span>
          </h1>

          {/* Subtítulo de Impacto */}
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#07213D] sm:text-3xl md:text-4xl leading-snug sm:leading-tight">
            Aprender a prevenir através do jogo e da Realidade Estendida.
          </h2>

          {/* Parágrafo Descritivo */}
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#07213D]/80 sm:text-lg">
            Uma experiência educativa e interativa que ajuda as crianças a conhecer, compreender e adotar comportamentos de prevenção do cancro, através de um jogo em Realidade Estendida (XR).
          </p>

          {/* Botões de Chamada para Ação */}
          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <Link
              href="#sobre"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F85308] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F85308]/25 transition-all hover:bg-[#e04804] hover:shadow-xl hover:shadow-[#F85308]/30 hover:-translate-y-0.5"
            >
              <span>Conhecer o Projeto</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#07213D] bg-transparent px-8 py-3.5 text-sm font-bold text-[#07213D] transition-all hover:border-[#F85308] hover:text-[#F85308] hover:-translate-y-0.5"
            >
              <span>Contactar Equipa</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
