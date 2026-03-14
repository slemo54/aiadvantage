"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Hero3D } from "@/components/sections/hero-3d";
import { FeaturedArticles } from "@/components/sections/featured-articles";
import { CategorySection } from "@/components/sections/category-section";
import { Sidebar } from "@/components/sections/sidebar";
import { InBrief } from "@/components/sections/in-brief";
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
    category: "opinioni" as CategoryKey,
    freshness_score: 88,
    hero_image_url: null,
    meta_description:
      "Cosa cambia per le startup AI con il nuovo regolamento europeo. Tutto quello che devi sapere.",
    keywords: ["AI Act", "startup", "Europa"],
    published_at: "2026-03-04T10:00:00Z",
    created_at: "2026-03-04T08:00:00Z",
    updated_at: "2026-03-04T10:00:00Z",
  },
  {
    id: "4",
    title: "Agenti AI Autonomi: Dalla Teoria alla Produzione",
    slug: "agenti-ai-autonomi-produzione",
    content_html: null,
    status: "published",
    category: "casi_duso" as CategoryKey,
    freshness_score: 91,
    hero_image_url: null,
    meta_description:
      "Come deployare agenti AI in produzione senza perdere il controllo. Architetture, guardrail e best practice.",
    keywords: ["agenti", "AI", "produzione"],
    published_at: "2026-03-03T10:00:00Z",
    created_at: "2026-03-03T08:00:00Z",
    updated_at: "2026-03-03T10:00:00Z",
  },
  {
    id: "5",
    title: "Mistral vs Llama 3.3: Quale Modello Open Source Scegliere?",
    slug: "mistral-vs-llama-3-open-source",
    content_html: null,
    status: "published",
    category: "ai_news" as CategoryKey,
    freshness_score: 85,
    hero_image_url: null,
    meta_description:
      "Confronto completo tra i migliori modelli open source del 2026: performance, costi e casi d'uso.",
    keywords: ["Mistral", "Llama", "open source"],
    published_at: "2026-03-02T10:00:00Z",
    created_at: "2026-03-02T08:00:00Z",
    updated_at: "2026-03-02T10:00:00Z",
  },
  {
    id: "6",
    title: "Mastering JetBrains Mono for Modern Dev",
    slug: "mastering-jetbrains-mono-modern-dev",
    content_html: null,
    status: "published",
    category: "tutorial" as CategoryKey,
    freshness_score: 82,
    hero_image_url: null,
    meta_description:
      "A deep dive into why typography matters for coding speed and legibility.",
    keywords: ["typography", "devtools", "fonts"],
    published_at: "2026-03-01T10:00:00Z",
    created_at: "2026-03-01T08:00:00Z",
    updated_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "7",
    title: "ChatGPT Enterprise: Guida per Aziende Italiane",
    slug: "chatgpt-enterprise-guida-italia",
    content_html: null,
    status: "published",
    category: "tools" as CategoryKey,
    freshness_score: 89,
    hero_image_url: null,
    meta_description:
      "Come implementare ChatGPT Enterprise nella tua azienda: sicurezza, privacy e best practice GDPR.",
    keywords: ["ChatGPT", "Enterprise", "GDPR"],
    published_at: "2026-02-28T10:00:00Z",
    created_at: "2026-02-28T08:00:00Z",
    updated_at: "2026-02-28T10:00:00Z",
  },
  {
    id: "8",
    title: "Next.js 15 con AI: La Nuova Frontier del Web Dev",
    slug: "nextjs-15-ai-web-development",
    content_html: null,
    status: "published",
    category: "web_dev" as CategoryKey,
    freshness_score: 93,
    hero_image_url: null,
    meta_description:
      "Come integrare l'AI nelle app Next.js 15: streaming, RSC e pattern avanzati.",
    keywords: ["Next.js", "AI", "streaming", "RSC"],
    published_at: "2026-02-27T10:00:00Z",
    created_at: "2026-02-27T08:00:00Z",
    updated_at: "2026-02-27T10:00:00Z",
  },
];

const trustPillars = [
  {
    title: "Strategia prima della moda",
    description: "Analisi editoriali che traducono l’AI in opportunità concrete per aziende, creator e team tech.",
    icon: ShieldCheck,
  },
  {
    title: "Selezione ad alta utilità",
    description: "Tutorial, tool e use case scelti per ridurre rumore, accelerare decisioni e generare risultati.",
    icon: TrendingUp,
  },
  {
    title: "Media brand con conversione",
    description: "Design premium e funnel editoriale pensati per aumentare attenzione, fiducia e iscrizioni.",
    icon: Sparkles,
  },
];

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>(PLACEHOLDER_ARTICLES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles?status=published&limit=20");
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
      <Hero3D />

      <section className="border-y border-white/5 bg-[#050505] py-6">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {trustPillars.map((pillar) => (
            <div key={pillar.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm">
              <pillar.icon className="h-5 w-5 text-[#22c55e]" />
              <h3 className="mt-3 text-base font-bold text-white">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-7 text-zinc-400">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      <FeaturedArticles articles={articles} />

      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/8 bg-gradient-to-r from-[#22c55e]/10 via-white/[0.03] to-cyan-400/10 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86efac]">
                <Sparkles className="h-3.5 w-3.5" />
                Feed premium AI italiano
              </span>
              <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
                Contenuti costruiti per far crescere attenzione, autorevolezza e iscritti
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
                Ogni sezione del magazine è pensata per guidare il lettore dal primo insight all’azione: leggere, salvare, condividere e iscriversi.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-[#22c55e]"
            >
              Vai all’archivio completo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <CategorySection 
                articles={articles} 
                category="ai_news" 
                title="AI News"
                accentColor="#3b82f6"
              />

              <CategorySection 
                articles={articles} 
                category="casi_duso" 
                title="Casi d'Uso"
                accentColor="#22c55e"
              />

              <CategorySection 
                articles={articles} 
                category="tools" 
                title="Tools"
                accentColor="#a855f7"
              />

              <InBrief articles={articles} />
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <Sidebar articles={articles} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategorySection 
        articles={articles} 
        category="tutorial" 
        title="Tutorial"
        accentColor="#f59e0b"
      />

      <CategorySection 
        articles={articles} 
        category="opinioni" 
        title="Opinioni"
        accentColor="#ec4899"
      />

      <CategorySection 
        articles={articles} 
        category="web_dev" 
        title="Web Dev"
        accentColor="#14b8a6"
      />

      <Newsletter />
    </main>
  );
}
