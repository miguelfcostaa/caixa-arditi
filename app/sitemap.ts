import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/siteConfig";
import { loadPublishedNews } from "@/lib/githubStorage";
import { getNewsImageUrl } from "@/lib/newsImage";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await loadPublishedNews();
  const latestPublishedAt = articles[0]?.publishedAt;
  const latestContentUpdate = latestPublishedAt
    ? new Date(`${latestPublishedAt}T00:00:00.000Z`)
    : undefined;
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: latestContentUpdate,
    },
    {
      url: absoluteUrl("/noticias"),
      lastModified: latestContentUpdate,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absoluteUrl(`/noticias/${article.slug}`),
    lastModified: new Date(`${article.publishedAt}T00:00:00.000Z`),
    images: article.image
      ? [absoluteUrl(getNewsImageUrl(article.image))]
      : undefined,
  }));

  return [...staticPages, ...articlePages];
}
