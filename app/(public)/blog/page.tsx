"use client";

import { useState, useEffect, Suspense, type ComponentType } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Grid3X3, List, ArrowRight } from "lucide-react";
import { ArticleCard, ArticleCardSkeleton } from "@/components/blog/article-card";
import { CATEGORIES } from "@/lib/constants";
import type { Article } from "@/lib/types";
import type { CategoryKey } from "@/lib/constants";
import { FadeIn } from "@/components/animations/motion";

// ─── Extended placeholder data ────────────────────────────────────────────────

const ARTICLE_META: Record<string, { author: string; readTime: number }> = {};

// ─── Components ───────────────────────────────────────────────────────────────

function CategoryBadge({
  category,
  isActive,
  onClick,
  count,
}: {
  category: { key: CategoryKey; label: string; accent: string };
  isActive: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={[
        "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
        isActive
          ? "border-transparent text-black"
          : "border-gray-700 text-gray-400 hover:border-[#22c55e] hover:text-[#22c55e] bg-black",
      ].join(" ")}
      style={isActive ? { backgroundColor: category.accent } : {}}
    >
      {category.label}
      <span
        className={[
          "rounded-full px-2 py-0.5 text-xs",
          isActive ? "bg-black/20" : "bg-gray-800 text-gray-500",
        ].join(" ")}
      >
        {count}
      </span>
    </motion.button>
  );
}

function ViewModeButton({
  active,
  onClick,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={[
        "flex h-9 w-9 items-center justify-center rounded-lg transition-all",
        active
          ? "bg-[#22c55e] text-black"
          : "bg-black border border-gray-700 text-gray-400 hover:border-[#22c55e] hover:text-[#22c55e]",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
    </motion.button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function BlogContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as CategoryKey | null;

  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">(
    categoryParam || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const categoryFilter =
          activeCategory !== "all" ? `&category=${activeCategory}` : "";
        const res = await fetch(
          `/api/articles?status=published&limit=24${categoryFilter}`
        );
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { articles?: Article[] };
        if (Array.isArray(data.articles)) {
          setArticles(data.articles);
        }
      } catch {
        // keep empty state
      } finally {
        setIsLoading(false);
      }
    }
    void loadArticles();
  }, [activeCategory]);

  // Calculate category counts
  const categoryCounts = (Object.keys(CATEGORIES) as CategoryKey[]).reduce(
    (acc, key) => {
      acc[key] = articles.filter((a) => a.category === key).length;
      return acc;
    },
    {} as Record<CategoryKey, number>
  );

  // Filter articles
  let filteredArticles = articles;

  if (activeCategory !== "all") {
    filteredArticles = filteredArticles.filter(
      (a) => a.category === activeCategory
    );
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredArticles = filteredArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.meta_description?.toLowerCase().includes(query) ||
        a.keywords.some((k) => k.toLowerCase().includes(query))
    );
  }

  const categoryList = (
    Object.entries(CATEGORIES) as [CategoryKey, (typeof CATEGORIES)[CategoryKey]][]
  ).map(([key, cat]) => ({ key, label: cat.label, accent: cat.accent }));

  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-black border-b border-gray-800">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22c55e]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/10 px-4 py-1.5 text-xs font-medium text-[#22c55e]">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              Esplora la Knowledge Base AI
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              Blog
            </h1>
            <p className="max-w-2xl text-lg text-gray-400">
              Esplora articoli su Intelligenza Artificiale, casi d&apos;uso reali,
              tutorial pratici e analisi del settore.
            </p>
          </FadeIn>

          {/* Search and Filters */}
          <FadeIn delay={0.1} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="search"
                placeholder="Cerca articoli..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-800 bg-black pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="mr-2 text-xs text-gray-500">Vista:</span>
              <ViewModeButton
                active={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
                icon={Grid3X3}
              />
              <ViewModeButton
                active={viewMode === "list"}
                onClick={() => setViewMode("list")}
                icon={List}
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Category Filters */}
      <section className="sticky top-16 lg:top-20 z-30 border-b border-gray-800 bg-black/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="h-4 w-4 shrink-0 text-gray-500" />
            <motion.button
              onClick={() => setActiveCategory("all")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={[
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                activeCategory === "all"
                  ? "bg-[#22c55e] text-black border-transparent"
                  : "border-gray-700 text-gray-400 hover:border-[#22c55e] hover:text-[#22c55e] bg-black",
              ].join(" ")}
            >
              Tutti
              <span className="ml-2 rounded-full bg-black/20 px-2 py-0.5 text-xs">
                {articles.length}
              </span>
            </motion.button>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex items-center justify-between"
        >
          <p className="text-sm text-gray-500">
            <span className="font-medium text-white">
              {filteredArticles.length}
            </span>{" "}
            articoli trovati
          </p>
        </motion.div>

        {/* Grid View */}
        {viewMode === "grid" ? (
          isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ArticleCardSkeleton key={i} index={i} />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-gray-800 bg-[#0a0a0a] py-16 text-center"
            >
              <p className="text-gray-500">Nessun articolo trovato.</p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 text-[#22c55e] font-medium hover:underline"
              >
                Cancella filtri
              </button>
            </motion.div>
          ) : (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  author={ARTICLE_META[article.id]?.author}
                  readTime={ARTICLE_META[article.id]?.readTime}
                  index={index}
                />
              ))}
            </motion.div>
          )
        ) : (
          /* List View */
          <motion.div layout className="space-y-4">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`/blog/${article.slug}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-gray-800 bg-[#0a0a0a] p-4 transition-all hover:border-[#22c55e]/30 sm:flex-row sm:items-center"
                >
                  <div
                    className="h-24 w-full shrink-0 rounded-xl sm:w-32 flex items-center justify-center text-3xl bg-[#171717]"
                  >
                    {CATEGORIES[article.category].icon}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-semibold text-black"
                        style={{
                          backgroundColor: CATEGORIES[article.category].accent,
                        }}
                      >
                        {CATEGORIES[article.category].label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(article.published_at || "").toLocaleDateString(
                          "it-IT"
                        )}
                      </span>
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-white transition-colors group-hover:text-[#22c55e]">
                      {article.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-gray-500">
                      {article.meta_description}
                    </p>
                  </div>
                  <ArrowRight className="hidden h-5 w-5 text-gray-600 transition-colors group-hover:text-[#22c55e] sm:block" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <BlogContent />
    </Suspense>
  );
}
