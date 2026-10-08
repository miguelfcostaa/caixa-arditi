import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/siteConfig";
import { loadPublishedNews } from "@/lib/githubStorage";
import { getNewsImageUrl } from "@/lib/newsImage";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await loadPublishedNews();
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/noticias"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absoluteUrl(`/noticias/${article.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
    images: [absoluteUrl(getNewsImageUrl(article.image))],
  }));

  return [...staticPages, ...articlePages];
}
