import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Partners } from "@/components/Partners";
import { Team } from "@/components/Team";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";
import { loadPublishedNews } from "@/lib/githubStorage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  alternateName: siteConfig.shortName,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: ["pt-PT", "en-GB"],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: absoluteUrl("/logo.ico"),
};

export default async function Home() {
  const articles = await loadPublishedNews();

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFAF9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteJsonLd, organizationJsonLd]).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      {/* Barra de Navegação */}
      <Navbar />

      {/* Conteúdo Principal Informativo */}
      <main className="flex-1">
        {/* 1. Hero com apresentação do Projeto C.A.I.X.A. */}
        <Hero />

        {/* 2. Descrição do Projeto / Pilares */}
        <About />

        {/* 3. Equipa que vai desenvolver o projeto */}
        <Team />

        {/* 4. Apoios / Parcerias */}
        <Partners />

        {/* 5. Newsletter */}
        <Newsletter articles={articles} />
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}
