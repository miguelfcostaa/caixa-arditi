import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { NewsArchive } from "@/components/NewsArchive";
import { loadPublishedNews } from "@/lib/githubStorage";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Notícias e Eventos | Projeto C.A.I.X.A.",
  },
  description:
    "Notícias, investigação, iniciativas e eventos do Projeto C.A.I.X.A. sobre prevenção do cancro infantil, literacia em saúde e tecnologias XR.",
  alternates: {
    canonical: "/noticias",
  },
  openGraph: {
    type: "website",
    url: "/noticias",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    alternateLocale: siteConfig.alternateLocale,
    title: "Notícias e Eventos | Projeto C.A.I.X.A.",
    description:
      "Notícias, investigação, iniciativas e eventos do Projeto C.A.I.X.A. sobre prevenção do cancro infantil, literacia em saúde e tecnologias XR.",
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Notícias e Eventos | Projeto C.A.I.X.A.",
    description:
      "Notícias, investigação, iniciativas e eventos do Projeto C.A.I.X.A. sobre prevenção do cancro infantil, literacia em saúde e tecnologias XR.",
    images: [absoluteUrl("/opengraph-image")],
  },
};

export default async function NewsPage() {
  const articles = await loadPublishedNews();
  const itemListJsonLd = {
    "@type": "ItemList",
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.title.pt,
      url: absoluteUrl(`/noticias/${article.slug}`),
    })),
  };
  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Notícias e Eventos do Projeto C.A.I.X.A.",
    description:
      "Notícias, investigação, iniciativas e eventos sobre prevenção do cancro infantil, literacia em saúde e tecnologias XR.",
    url: absoluteUrl("/noticias"),
    inLanguage: "pt-PT",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntity: itemListJsonLd,
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFAF9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="flex-1 pb-20 pt-32 sm:pb-24 sm:pt-36">
        <NewsArchive articles={articles} />
      </main>
      <Footer />
    </div>
  );
}
