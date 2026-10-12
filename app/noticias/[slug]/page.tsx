import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/ArticleView";
import { absoluteUrl, siteConfig, truncateDescription } from "@/lib/siteConfig";
import { loadPublishedNews } from "@/lib/githubStorage";
import { getNewsImageUrl } from "@/lib/newsImage";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await loadPublishedNews();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const articles = await loadPublishedNews();
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return {
      title: "Notícia não encontrada",
      robots: { index: false, follow: false },
    };
  }

  const canonicalPath = `/noticias/${article.slug}`;
  const description = truncateDescription(article.content.pt[0]);
  const socialImage = article.image
    ? absoluteUrl(getNewsImageUrl(article.image))
    : absoluteUrl("/opengraph-image");

  return {
    title: article.title.pt,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      alternateLocale: siteConfig.alternateLocale,
      url: canonicalPath,
      siteName: siteConfig.name,
      title: article.title.pt,
      description,
      publishedTime: article.publishedAt,
      section: article.category.pt,
      images: [{ url: socialImage, alt: article.title.pt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title.pt,
      description,
      images: [socialImage],
    },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const articles = await loadPublishedNews();
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  const canonicalUrl = absoluteUrl(`/noticias/${article.slug}`);
  const description = truncateDescription(article.content.pt[0]);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title.pt,
    description,
    image: article.image
      ? [absoluteUrl(getNewsImageUrl(article.image))]
      : undefined,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    url: canonicalUrl,
    articleSection: article.category.pt,
    keywords: [
      article.category.pt,
      "prevenção do cancro infantil",
      "literacia em saúde",
      "tecnologias XR",
    ],
    isAccessibleForFree: true,
    inLanguage: "pt-PT",
    mainEntityOfPage: canonicalUrl,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.ico"),
      },
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Notícias",
        item: absoluteUrl("/noticias"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title.pt,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleJsonLd, breadcrumbJsonLd]).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <ArticleView article={article} articles={articles} />
    </>
  );
}
