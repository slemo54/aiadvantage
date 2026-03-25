import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { SEED_ARTICLES } from "@/lib/seed-articles";
import { ArticlePageClient } from "@/components/blog/article-page-client";
import type { Article } from "@/lib/types";
import type { CategoryKey } from "@/lib/constants";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ilvantaggioai.it";

// ─── Data fetching ───────────────────────────────────────────────────────────

async function getArticle(slug: string): Promise<{
  article: Article;
  gradient: string;
  readTime: number;
  author: string;
} | null> {
  // Try seed articles first (always available, no DB needed)
  const seedMatch = SEED_ARTICLES.find((a) => a.slug === slug);
  if (seedMatch) {
    return {
      article: {
        id: seedMatch.id,
        title: seedMatch.title,
        slug: seedMatch.slug,
        content_html: seedMatch.content_html,
        status: "published",
        category: seedMatch.category as CategoryKey,
        freshness_score: 90,
        hero_image_url: null,
        meta_description: seedMatch.meta_description,
        keywords: seedMatch.keywords,
        published_at: seedMatch.published_at,
        created_at: seedMatch.published_at,
        updated_at: seedMatch.published_at,
      },
      gradient: seedMatch.gradient,
      readTime: seedMatch.readTime,
      author: seedMatch.author,
    };
  }

  // Try Supabase
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return null;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) return null;

    const article = data as Article;
    const wordCount = (article.content_html ?? "")
      .replace(/<[^>]+>/g, "")
      .split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      article,
      gradient: "from-emerald-900 via-green-900 to-teal-900",
      readTime,
      author: "Anselmo",
    };
  } catch {
    return null;
  }
}

// ─── SEO: generateMetadata ───────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArticle(slug);

  if (!data) {
    return { title: "Articolo non trovato" };
  }

  const { article } = data;
  const url = `${SITE_URL}/blog/${article.slug}`;
  const description =
    article.meta_description ??
    `${article.title} — leggi su IlVantaggioAI`;
  const image = article.hero_image_url ?? `${SITE_URL}/og-default.svg`;

  return {
    title: article.title,
    description,
    keywords: article.keywords,
    authors: [{ name: "Anselmo", url: SITE_URL }],
    openGraph: {
      type: "article",
      locale: "it_IT",
      url,
      siteName: "IlVantaggioAI",
      title: article.title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.published_at ?? undefined,
      modifiedTime: article.updated_at,
      section: article.category,
      tags: article.keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [image],
      creator: "@ilvantaggioai",
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ─── JSON-LD structured data ─────────────────────────────────────────────────

function ArticleJsonLd({
  article,
  readTime,
  author,
}: {
  article: Article;
  readTime: number;
  author: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description:
      article.meta_description ?? `${article.title} — IlVantaggioAI`,
    image: article.hero_image_url ?? `${SITE_URL}/og-default.svg`,
    author: {
      "@type": "Person",
      name: author,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "IlVantaggioAI",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
      },
    },
    url: `${SITE_URL}/blog/${article.slug}`,
    datePublished: article.published_at ?? article.created_at,
    dateModified: article.updated_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${article.slug}`,
    },
    keywords: article.keywords.join(", "),
    wordCount: (article.content_html ?? "")
      .replace(/<[^>]+>/g, "")
      .split(/\s+/).length,
    timeRequired: `PT${readTime}M`,
    inLanguage: "it-IT",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─── Page component (Server) ─────────────────────────────────────────────────

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getArticle(slug);

  if (!data) {
    notFound();
  }

  const { article, gradient, readTime, author } = data;

  return (
    <>
      <ArticleJsonLd
        article={article}
        readTime={readTime}
        author={author}
      />
      <ArticlePageClient
        article={article}
        gradient={gradient}
        readTime={readTime}
        author={author}
      />
    </>
  );
}
