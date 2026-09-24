import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Partners } from "@/components/Partners";
import { About } from "@/components/About";
import { Team } from "@/components/Team";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#EAE8E5]">
      {/* Barra de Navegação */}
      <Navbar />

      {/* Conteúdo Principal Informativo */}
      <main className="flex-1">
        {/* 1. Hero com apresentação do Projeto C.A.I.X.A. */}
        <Hero />

        {/* 2. Espaço para Parcerias */}
        <Partners />

        {/* 3. Lugar para Descrição do Projeto */}
        <About />

        {/* 4. Espaço para a Equipa que vai desenvolver o projeto */}
        <Team />

        {/* 5. Contacto Simples */}
        <Contact />
      </main>

      {/* 6. Rodapé */}
      <Footer />
    </div>
  );
}
