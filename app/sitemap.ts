import type { MetadataRoute } from "next";
import { SEED_ARTICLES } from "@/lib/seed-articles";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ilvantaggioai.it";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic article pages from Supabase
  let articlePages: MetadataRoute.Sitemap = [];

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("articles")
        .select("slug, updated_at, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (data) {
        articlePages = data.map((article) => ({
          url: `${SITE_URL}/blog/${article.slug}`,
          lastModified: new Date(article.updated_at || article.published_at),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
      }
    } catch {
      // Fall through to seed articles
    }
  }

  // If no DB articles, use seed articles
  if (articlePages.length === 0) {
    articlePages = SEED_ARTICLES.map((article) => ({
      url: `${SITE_URL}/blog/${article.slug}`,
      lastModified: new Date(article.published_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  }

  return [...staticPages, ...articlePages];
}
