import rawArticles from "@/content/noticias.json";

export type NewsStatus = "publicada" | "rascunho";

export interface NewsArticle {
  slug: string;
  status: NewsStatus;
  publishedAt: string;
  title: {
    pt: string;
    en: string;
  };
  category: {
    pt: string;
    en: string;
  };
  date: {
    pt: string;
    en: string;
  };
  image: string;
  imageAlt: {
    pt: string;
    en: string;
  };
  content: {
    pt: string[];
    en: string[];
  };
}

/**
 * Ordenação global: mais recente primeiro (descendente por publishedAt).
 */
function sortByDateDesc(articles: NewsArticle[]): NewsArticle[] {
  return [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

const allNewsArticles: NewsArticle[] = sortByDateDesc(
  (rawArticles as Array<Partial<NewsArticle>>).map((item) => ({
    slug: item.slug || "",
    status: (item.status as NewsStatus) || "publicada",
    publishedAt: item.publishedAt || new Date().toISOString().split("T")[0],
    title: {
      pt: item.title?.pt || "",
      en: item.title?.en || item.title?.pt || "",
    },
    category: {
      pt: item.category?.pt || "",
      en: item.category?.en || item.category?.pt || "",
    },
    date: {
      pt: item.date?.pt || "",
      en: item.date?.en || item.date?.pt || "",
    },
    image: item.image || "/images/image1.jpg",
    imageAlt: {
      pt: item.imageAlt?.pt || item.title?.pt || "",
      en: item.imageAlt?.en || item.title?.en || "",
    },
    content: {
      pt: Array.isArray(item.content?.pt) ? item.content.pt : [],
      en: Array.isArray(item.content?.en) ? item.content.en : [],
    },
  })),
);

/**
 * Retorna todas as notícias existentes, incluindo rascunhos (usado no painel administrativo).
 * Ordenadas da mais recente para a mais antiga.
 */
export function getAllNewsArticles(): NewsArticle[] {
  return allNewsArticles;
}

/**
 * Retorna apenas as notícias publicadas (usado no website público e sitemap).
 * Ordenadas da mais recente para a mais antiga.
 */
export function getPublishedNewsArticles(): NewsArticle[] {
  return allNewsArticles.filter((article) => article.status === "publicada");
}

/**
 * Procura um artigo pelo slug.
 */
export function getArticleBySlug(
  slug: string,
  includeDrafts = false,
): NewsArticle | undefined {
  const list = includeDrafts ? getAllNewsArticles() : getPublishedNewsArticles();
  return list.find((article) => article.slug === slug);
}

/**
 * Exportação de compatibilidade: por omissão, expõe apenas notícias publicadas,
 * ordenadas da mais recente para a mais antiga.
 */
export const newsArticles: NewsArticle[] = getPublishedNewsArticles();

