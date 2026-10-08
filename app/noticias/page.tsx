import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { NewsArchive } from "@/components/NewsArchive";
import { loadPublishedNews } from "@/lib/githubStorage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notícias & Eventos",
  description:
    "Todas as notícias, iniciativas e eventos do Projeto C.A.I.X.A.",
  alternates: {
    canonical: "/noticias",
  },
  openGraph: {
    type: "website",
    url: "/noticias",
    title: "Notícias & Eventos | Projeto C.A.I.X.A.",
    description:
      "Todas as notícias, iniciativas e eventos do Projeto C.A.I.X.A.",
  },
};

export default async function NewsPage() {
  const articles = await loadPublishedNews();

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFAF9]">
      <Navbar />
      <main className="flex-1 pb-20 pt-32 sm:pb-24 sm:pt-36">
        <NewsArchive articles={articles} />
      </main>
      <Footer />
    </div>
  );
}
