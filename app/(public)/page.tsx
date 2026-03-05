"use client";

import { useState, useEffect } from "react";
import { Hero } from "@/components/sections/hero";
import { MarketingVision } from "@/components/sections/marketing-vision";
import { Services } from "@/components/sections/services";
import { Features } from "@/components/sections/features";
import { RecentArticles } from "@/components/sections/recent-articles";
import { Testimonials } from "@/components/sections/testimonials";
import { Newsletter } from "@/components/sections/newsletter";
import type { Article } from "@/lib/types";
import { SEED_ARTICLES } from "@/lib/seed-articles";
import type { CategoryKey } from "@/lib/constants";

// Seed articles first, then fallback placeholders
const PLACEHOLDER_ARTICLES: Article[] = [
  ...SEED_ARTICLES.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    content_html: null,
    status: "published" as const,
    category: s.category as CategoryKey,
    freshness_score: 92,
    hero_image_url: null,
    meta_description: s.meta_description,
    keywords: s.keywords,
    published_at: s.published_at,
    created_at: s.published_at,
    updated_at: s.published_at,
  })),
  {
    id: "3",
    title: "AI Act Europeo: Guida Pratica per Startup Italiane",
    slug: "ai-act-europeo-guida-startup",
    content_html: null,
    status: "published",
    category: "opinioni",
    freshness_score: 88,
    hero_image_url: null,
    meta_description:
      "Cosa cambia per le startup AI con il nuovo regolamento europeo. Tutto quello che devi sapere.",
    keywords: ["AI Act", "startup", "Europa"],
    published_at: "2026-02-25T10:00:00Z",
    created_at: "2026-02-25T08:00:00Z",
    updated_at: "2026-02-25T10:00:00Z",
  },
  {
    id: "4",
    title: "Agenti AI Autonomi: Dalla Teoria alla Produzione",
    slug: "agenti-ai-autonomi-produzione",
    content_html: null,
    status: "published",
    category: "casi_duso",
    freshness_score: 91,
    hero_image_url: null,
    meta_description:
      "Come deployare agenti AI in produzione senza perdere il controllo. Architetture, guardrail e best practice.",
    keywords: ["agenti", "AI", "produzione"],
    published_at: "2026-02-20T10:00:00Z",
    created_at: "2026-02-20T08:00:00Z",
    updated_at: "2026-02-20T10:00:00Z",
  },
  {
    id: "5",
    title: "Mistral vs Llama 3.3: Quale Modello Open Source Scegliere?",
    slug: "mistral-vs-llama-3-open-source",
    content_html: null,
    status: "published",
    category: "ai_news",
    freshness_score: 85,
    hero_image_url: null,
    meta_description:
      "Confronto completo tra i migliori modelli open source del 2026: performance, costi e casi d'uso.",
    keywords: ["Mistral", "Llama", "open source"],
    published_at: "2026-02-15T10:00:00Z",
    created_at: "2026-02-15T08:00:00Z",
    updated_at: "2026-02-15T10:00:00Z",
  },
  {
    id: "6",
    title: "Mastering JetBrains Mono for Modern Dev",
    slug: "mastering-jetbrains-mono-modern-dev",
    content_html: null,
    status: "published",
    category: "tutorial",
    freshness_score: 82,
    hero_image_url: null,
    meta_description:
      "A deep dive into why typography matters for coding speed and legibility.",
    keywords: ["typography", "devtools", "fonts"],
    published_at: "2026-02-10T10:00:00Z",
    created_at: "2026-02-10T08:00:00Z",
    updated_at: "2026-02-10T10:00:00Z",
  },
];

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>(PLACEHOLDER_ARTICLES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles?status=published&limit=12");
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { articles?: Article[] };
        if (Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
        }
      } catch {
        // Fall back to placeholders silently
      } finally {
        setIsLoading(false);
      }
    }
    void loadArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <Hero />
      <MarketingVision />
      <Services />
      <Features />
      <RecentArticles articles={articles} />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
