import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Team } from "@/components/Team";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F1F0EF]">
      {/* Barra de Navegação */}
      <Navbar />

      {/* Conteúdo Principal Informativo */}
      <main className="flex-1">
        {/* 1. Hero com apresentação do Projeto C.A.I.X.A. e Parcerias integradas acima da dobra */}
        <Hero />

        {/* 2. Lugar para Descrição do Projeto */}
        <About />

        {/* 3. Espaço para a Equipa que vai desenvolver o projeto */}
        <Team />

      </main>

      {/* 5. Rodapé */}
      <Footer />
    </div>
  );
}
