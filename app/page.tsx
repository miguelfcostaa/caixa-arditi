import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Partners } from "@/components/Partners";
import { Team } from "@/components/Team";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FCFAF9]">
      {/* Barra de Navegação */}
      <Navbar />

      {/* Conteúdo Principal Informativo */}
      <main className="flex-1">
        {/* 1. Hero com apresentação do Projeto C.A.I.X.A. */}
        <Hero />

        {/* 2. Descrição do Projeto / Pilares */}
        <About />

        {/* 4. Equipa que vai desenvolver o projeto */}
        <Team />

        {/* 3. Apoios / Parcerias */}
        <Partners />
      </main>

      {/* 5. Rodapé */}
      <Footer />
    </div>
  );
}
