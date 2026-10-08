import type { MetadataRoute } from "next";
import { newsArticles } from "@/lib/newsletterData";
import { absoluteUrl } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
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

  const articlePages: MetadataRoute.Sitemap = newsArticles.map((article) => ({
    url: absoluteUrl(`/noticias/${article.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
    images: [absoluteUrl(article.image)],
  }));

  return [...staticPages, ...articlePages];
}
