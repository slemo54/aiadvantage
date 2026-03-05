"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Mail, LayoutGrid, Flame, BookOpen } from "lucide-react";
import { ArticleCard } from "@/components/blog/article-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/constants";
import type { Article } from "@/lib/types";
import type { CategoryKey } from "@/lib/constants";
import { SEED_ARTICLES } from "@/lib/seed-articles";

// ─── Extended placeholder data ────────────────────────────────────────────────

interface ArticleMeta {
  gradient: string;
  author: string;
  readTime: number;
}

const ARTICLE_META: Record<string, ArticleMeta> = {
  "seed-1": { gradient: "from-indigo-900 via-violet-900 to-purple-900", author: "Anselmo", readTime: 8 },
  "seed-2": { gradient: "from-emerald-900 via-teal-900 to-cyan-900", author: "Anselmo", readTime: 12 },
  "3": { gradient: "from-cyan-800 to-blue-700", author: "Anselmo", readTime: 5 },
  "4": { gradient: "from-emerald-900 to-green-800", author: "Anselmo", readTime: 10 },
  "5": { gradient: "from-slate-800 to-zinc-700", author: "Anselmo", readTime: 7 },
  "6": { gradient: "from-orange-900 to-amber-800", author: "Anselmo", readTime: 9 },
};

// Seed articles first, then fallback placeholders
const PLACEHOLDER_ARTICLES: Article[] = [
  ...SEED_ARTICLES.map(s => ({
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
    meta_description: "Cosa cambia per le startup AI con il nuovo regolamento europeo. Tutto quello che devi sapere.",
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
    meta_description: "Come deployare agenti AI in produzione senza perdere il controllo. Architetture, guardrail e best practice.",
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
    meta_description: "Confronto completo tra i migliori modelli open source del 2026: performance, costi e casi d'uso.",
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
    category: "web_dev",
    freshness_score: 82,
    hero_image_url: null,
    meta_description: "A deep dive into why typography matters for coding speed and legibility.",
    keywords: ["typography", "devtools", "fonts"],
    published_at: "2026-02-10T10:00:00Z",
    created_at: "2026-02-10T08:00:00Z",
    updated_at: "2026-02-10T10:00:00Z",
  },
];

// ─── Newsletter Section Component ─────────────────────────────────────────────

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900/40 via-zinc-900 to-zinc-950 py-20">
      {/* Glow effect */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/20">
          <Mail className="h-5 w-5 text-indigo-400" />
        </div>
        <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
          Stay Ahead of the Curve
        </h2>
        <p className="mb-8 text-zinc-400">
          Get the weekly digest of AI breakthroughs and practical implementation guides delivered to your inbox.
        </p>
        {submitted ? (
          <div className="rounded-xl border border-green-500/30 bg-green-900/20 px-6 py-4 text-green-400">
            Grazie per l&apos;iscrizione! Ti terremo aggiornato.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              required
              className="h-12 border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-indigo-500/20 sm:w-72"
            />
            <Button
              type="submit"
              className="h-12 bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Join 5,000+ Readers
            </Button>
          </form>
        )}
        <p className="mt-4 text-xs text-zinc-600">
          ZERO SPAM. PURE INSIGHT. UNSUBSCRIBE ANYTIME.
        </p>
      </div>
    </section>
  );
}

// ─── Tab Button Component ─────────────────────────────────────────────────────

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
        active
          ? "border-indigo-500 text-indigo-400"
          : "border-transparent text-zinc-500 hover:text-zinc-300",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>(PLACEHOLDER_ARTICLES);
  const [activeTab, setActiveTab] = useState<"latest" | "popular" | "tutorials">("latest");
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">("all");
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

  const featured = articles[0];
  const rest = articles.slice(1);

  const filtered =
    activeCategory === "all"
      ? rest
      : rest.filter((a) => a.category === activeCategory);

  return (
    <div className="flex flex-col bg-zinc-950">
      {/* ── FEATURED ARTICLE HERO ────────────────────────────────────────────── */}
      {!isLoading && featured && (
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-zinc-900 to-zinc-950"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(6, 78, 59, 0.5) 50%, rgba(9, 9, 11, 1) 100%)`
            }}
          />
          {/* Pattern overlay */}
          <div 
            aria-hidden 
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              {/* Left - Image/Visual */}
              <div className="relative order-2 lg:order-1">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800/50 to-teal-900/50">
                  {/* Abstract visual */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl font-black text-white/20 tracking-tighter">FEATURE</span>
                      <span className="block text-4xl font-black text-white/10 tracking-tighter">ARTICLE</span>
                    </div>
                  </div>
                  {/* Grid lines */}
                  <div 
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />
                </div>
              </div>

              {/* Right - Content */}
              <div className="order-1 lg:order-2">
                {/* Meta */}
                <div className="mb-4 flex items-center gap-3 text-xs">
                  <span 
                    className="rounded-full px-3 py-1 font-semibold text-white"
                    style={{ backgroundColor: CATEGORIES[featured.category].accent }}
                  >
                    {CATEGORIES[featured.category].label.toUpperCase()}
                  </span>
                  <span className="text-zinc-400">12 Min Read</span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-400">March 18, 2024</span>
                </div>

                {/* Title */}
                <h1 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                  The Edge of Innovation: How AI is Reshaping the Digital Frontier
                </h1>

                {/* CTA */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
                  >
                    Read Full Story
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-900 text-xs font-bold text-indigo-300">
                      A
                    </div>
                    <span className="text-sm text-zinc-400">By Anselmo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── ARTICLES GRID ─────────────────────────────────────────────────────── */}
      <section
        id="articoli"
        className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        {/* Tabs */}
        <div className="mb-8 flex items-center justify-between border-b border-zinc-800">
          <div className="flex">
            <TabButton
              active={activeTab === "latest"}
              onClick={() => setActiveTab("latest")}
              icon={<LayoutGrid className="h-4 w-4" />}
              label="Latest Insights"
            />
            <TabButton
              active={activeTab === "popular"}
              onClick={() => setActiveTab("popular")}
              icon={<Flame className="h-4 w-4" />}
              label="Popular"
            />
            <TabButton
              active={activeTab === "tutorials"}
              onClick={() => setActiveTab("tutorials")}
              icon={<BookOpen className="h-4 w-4" />}
              label="Tutorials"
            />
          </div>
          <Link
            href="/blog"
            className="hidden items-center gap-1 text-sm font-medium text-zinc-500 transition-colors hover:text-indigo-400 sm:flex"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Category filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={[
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
              activeCategory === "all"
                ? "border-indigo-500 bg-indigo-500 text-white"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
            ].join(" ")}
          >
            Tutti
          </button>
          {(
            Object.entries(CATEGORIES) as [
              CategoryKey,
              (typeof CATEGORIES)[CategoryKey],
            ][]
          ).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={[
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                activeCategory === key
                  ? "text-white"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
              ].join(" ")}
              style={
                activeCategory === key
                  ? { backgroundColor: cat.accent, borderColor: cat.accent }
                  : {}
              }
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-zinc-500">
            Nessun articolo in questa categoria.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                gradient={ARTICLE_META[article.id]?.gradient}
                author={ARTICLE_META[article.id]?.author}
                readTime={ARTICLE_META[article.id]?.readTime}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── NEWSLETTER CTA ────────────────────────────────────────────────────── */}
      <NewsletterSection />
    </div>
  );
}
