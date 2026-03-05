"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArticleCard } from "@/components/blog/article-card";
import { CATEGORIES } from "@/lib/constants";
import type { Article } from "@/lib/types";
import type { CategoryKey } from "@/lib/constants";

// ─── Extended placeholder data ────────────────────────────────────────────────

interface ArticleMeta {
  gradient: string;
  author: string;
  readTime: number;
}

const ARTICLE_META: Record<string, ArticleMeta> = {
  "1": { gradient: "from-emerald-800 to-teal-700", author: "Anselmo", readTime: 8 },
  "2": { gradient: "from-blue-900 to-indigo-800", author: "Anselmo", readTime: 6 },
  "3": { gradient: "from-cyan-800 to-blue-700", author: "Anselmo", readTime: 5 },
  "4": { gradient: "from-emerald-900 to-green-800", author: "Anselmo", readTime: 10 },
  "5": { gradient: "from-slate-800 to-zinc-700", author: "Anselmo", readTime: 7 },
  "6": { gradient: "from-orange-900 to-amber-800", author: "Anselmo", readTime: 9 },
  "7": { gradient: "from-purple-900 to-violet-800", author: "Anselmo", readTime: 12 },
  "8": { gradient: "from-rose-900 to-pink-800", author: "Anselmo", readTime: 6 },
  "9": { gradient: "from-indigo-900 to-blue-800", author: "Anselmo", readTime: 8 },
};

const PLACEHOLDER_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Automating Enterprise Workflows with Local LLMs",
    slug: "automating-enterprise-workflows-local-llms",
    content_html: null,
    status: "published",
    category: "casi_duso",
    freshness_score: 95,
    hero_image_url: null,
    meta_description: "Discover how to deploy Llama 3 for internal data processing without compromising privacy.",
    keywords: ["LLM", "privacy", "enterprise"],
    published_at: "2026-03-01T10:00:00Z",
    created_at: "2026-03-01T08:00:00Z",
    updated_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "2",
    title: "The State of Generative AI: Q1 2024 Report",
    slug: "state-generative-ai-q1-2024",
    content_html: null,
    status: "published",
    category: "ai_news",
    freshness_score: 90,
    hero_image_url: null,
    meta_description: "A comprehensive look at the foundation models dominating the market this year.",
    keywords: ["AI", "report", "generative"],
    published_at: "2026-02-28T10:00:00Z",
    created_at: "2026-02-28T08:00:00Z",
    updated_at: "2026-02-28T10:00:00Z",
  },
  {
    id: "3",
    title: "Building Scalable Web Apps with AI-Ready APIs",
    slug: "building-scalable-web-apps-ai-ready-apis",
    content_html: null,
    status: "published",
    category: "web_dev",
    freshness_score: 88,
    hero_image_url: null,
    meta_description: "Architecting your frontend to handle real-time generative streaming responses.",
    keywords: ["API", "web", "scalable"],
    published_at: "2026-02-25T10:00:00Z",
    created_at: "2026-02-25T08:00:00Z",
    updated_at: "2026-02-25T10:00:00Z",
  },
  {
    id: "4",
    title: "AI in Healthcare: Beyond the Hype",
    slug: "ai-healthcare-beyond-hype",
    content_html: null,
    status: "published",
    category: "casi_duso",
    freshness_score: 91,
    hero_image_url: null,
    meta_description: "Practical implementations of diagnostic AI currently saving lives in clinics.",
    keywords: ["healthcare", "AI", "diagnostic"],
    published_at: "2026-02-20T10:00:00Z",
    created_at: "2026-02-20T08:00:00Z",
    updated_at: "2026-02-20T10:00:00Z",
  },
  {
    id: "5",
    title: "The Rise of Agentic AI Workflows",
    slug: "rise-agentic-ai-workflows",
    content_html: null,
    status: "published",
    category: "ai_news",
    freshness_score: 85,
    hero_image_url: null,
    meta_description: "Why the next shift in AI isn't better models, but autonomous agents.",
    keywords: ["agents", "workflow", "autonomous"],
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
  {
    id: "7",
    title: "LLM Locali vs Cloud: Guida alla Scelta 2024",
    slug: "llm-locali-vs-cloud-guida-2024",
    content_html: null,
    status: "published",
    category: "tutorial",
    freshness_score: 94,
    hero_image_url: null,
    meta_description: "Quando conviene usare modelli locali e quando il cloud è la scelta migliore.",
    keywords: ["LLM", "tutorial", "privacy"],
    published_at: "2026-02-05T10:00:00Z",
    created_at: "2026-02-05T08:00:00Z",
    updated_at: "2026-02-05T10:00:00Z",
  },
  {
    id: "8",
    title: "L'Etica dell'AI: Dilemmi e Soluzioni",
    slug: "etica-ai-dilemmi-soluzioni",
    content_html: null,
    status: "published",
    category: "opinioni",
    freshness_score: 87,
    hero_image_url: null,
    meta_description: "Un'analisi critica su bias, fairness e responsabilità nei sistemi AI.",
    keywords: ["etica", "bias", "fairness"],
    published_at: "2026-02-01T10:00:00Z",
    created_at: "2026-02-01T08:00:00Z",
    updated_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "9",
    title: "Cursor.sh: Il Futuro del Coding con AI",
    slug: "cursor-sh-futuro-coding-ai",
    content_html: null,
    status: "published",
    category: "tools",
    freshness_score: 93,
    hero_image_url: null,
    meta_description: "Come Cursor sta rivoluzionando il modo in cui scriviamo codice.",
    keywords: ["cursor", "IDE", "coding"],
    published_at: "2026-01-28T10:00:00Z",
    created_at: "2026-01-28T08:00:00Z",
    updated_at: "2026-01-28T10:00:00Z",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function CategoryBadge({ 
  category, 
  isActive, 
  onClick, 
  count 
}: { 
  category: { key: CategoryKey; label: string; accent: string };
  isActive: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
        isActive
          ? "border-transparent text-white"
          : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
      ].join(" ")}
      style={
        isActive
          ? { backgroundColor: category.accent }
          : {}
      }
    >
      {category.label}
      <span className={[
        "rounded-full px-2 py-0.5 text-xs",
        isActive ? "bg-white/20" : "bg-zinc-800 text-zinc-500"
      ].join(" ")}>
        {count}
      </span>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function BlogContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as CategoryKey | null;
  
  const [articles, setArticles] = useState<Article[]>(PLACEHOLDER_ARTICLES);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">(categoryParam || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const categoryFilter = activeCategory !== "all" ? `&category=${activeCategory}` : "";
        const res = await fetch(`/api/articles?status=published&limit=24${categoryFilter}`);
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { articles?: Article[] };
        if (Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
        }
      } catch {
        // Keep placeholders
      } finally {
        setIsLoading(false);
      }
    }
    void loadArticles();
  }, [activeCategory]);

  // Calculate category counts
  const categoryCounts = (Object.keys(CATEGORIES) as CategoryKey[]).reduce((acc, key) => {
    acc[key] = articles.filter(a => a.category === key).length;
    return acc;
  }, {} as Record<CategoryKey, number>);

  // Filter articles
  let filteredArticles = articles;
  
  if (activeCategory !== "all") {
    filteredArticles = filteredArticles.filter(a => a.category === activeCategory);
  }
  
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredArticles = filteredArticles.filter(a => 
      a.title.toLowerCase().includes(query) ||
      a.meta_description?.toLowerCase().includes(query) ||
      a.keywords.some(k => k.toLowerCase().includes(query))
    );
  }

  const categoryList = (Object.entries(CATEGORIES) as [CategoryKey, typeof CATEGORIES[CategoryKey]][]).map(
    ([key, cat]) => ({ key, label: cat.label, accent: cat.accent })
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header Section */}
      <section className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold text-white">Blog</h1>
            <p className="max-w-2xl text-lg text-zinc-400">
              Esplora articoli su Intelligenza Artificiale, casi d&apos;uso reali, 
              tutorial pratici e analisi del settore.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                type="search"
                placeholder="Cerca articoli..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 border-zinc-700 bg-zinc-900 pl-10 text-sm text-zinc-300 placeholder:text-zinc-500 focus:border-indigo-500"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-zinc-800 text-white" : "text-zinc-500"}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-zinc-800 text-white" : "text-zinc-500"}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="border-b border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-4 w-4 shrink-0 text-zinc-500" />
            <button
              onClick={() => setActiveCategory("all")}
              className={[
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                activeCategory === "all"
                  ? "border-indigo-500 bg-indigo-500 text-white"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
              ].join(" ")}
            >
              Tutti
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {articles.length}
              </span>
            </button>
            {categoryList.map((cat) => (
              <CategoryBadge
                key={cat.key}
                category={cat}
                isActive={activeCategory === cat.key}
                onClick={() => setActiveCategory(cat.key)}
                count={categoryCounts[cat.key] || 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid/List */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Results info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            {filteredArticles.length} articoli trovati
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <TrendingUp className="h-4 w-4" />
            <span>Ordinati per: Più recenti</span>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" ? (
          isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900"
                />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 py-16 text-center">
              <p className="text-zinc-500">Nessun articolo trovato.</p>
              <Button
                variant="link"
                onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
                className="mt-2 text-indigo-400"
              >
                Cancella filtri
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  gradient={ARTICLE_META[article.id]?.gradient}
                  author={ARTICLE_META[article.id]?.author}
                  readTime={ARTICLE_META[article.id]?.readTime}
                />
              ))}
            </div>
          )
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700 sm:flex-row sm:items-center"
              >
                <div className={`h-24 w-full shrink-0 rounded-lg bg-gradient-to-br ${ARTICLE_META[article.id]?.gradient || "from-indigo-900 to-violet-900"} sm:w-32`} />
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: CATEGORIES[article.category].accent }}
                    >
                      {CATEGORIES[article.category].label}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {new Date(article.published_at || "").toLocaleDateString("it-IT")}
                    </span>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-white group-hover:text-indigo-400">
                    {article.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-zinc-400">
                    {article.meta_description}
                  </p>
                </div>
                <ArrowRight className="hidden h-5 w-5 text-zinc-600 transition-colors group-hover:text-indigo-400 sm:block" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <BlogContent />
    </Suspense>
  );
}
