"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, LayoutGrid, Flame, BookOpen, ChevronRight } from "lucide-react";
import { ArticleCard, ArticleCardSkeleton } from "@/components/blog/article-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/constants";
import type { Article } from "@/lib/types";
import type { CategoryKey } from "@/lib/constants";
import { SEED_ARTICLES } from "@/lib/seed-articles";
import { AnimatedHeroBackground, FloatingParticles } from "@/components/animations/animated-hero";

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
      {/* Animated background elements */}
      <motion.div
        className="pointer-events-none absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/20"
        >
          <Mail className="h-5 w-5 text-indigo-400" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-3 text-3xl font-bold text-white sm:text-4xl"
        >
          Stay Ahead of the Curve
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 text-zinc-400"
        >
          Get the weekly digest of AI breakthroughs and practical implementation guides delivered to your inbox.
        </motion.p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-green-500/30 bg-green-900/20 px-6 py-4 text-green-400"
          >
            Grazie per l&apos;iscrizione! Ti terremo aggiornato.
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              required
              className="h-12 border-zinc-700 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-indigo-500/20 sm:w-72"
            />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="h-12 w-full bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-500 sm:w-auto"
              >
                Join 5,000+ Readers
              </Button>
            </motion.div>
          </motion.form>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 text-xs text-zinc-600"
        >
          ZERO SPAM. PURE INSIGHT. UNSUBSCRIBE ANYTIME.
        </motion.p>
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
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={[
        "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
        active
          ? "border-indigo-500 text-indigo-400"
          : "border-transparent text-zinc-500 hover:text-zinc-300",
      ].join(" ")}
    >
      {icon}
      {label}
    </motion.button>
  );
}

// ─── Category Filter Button ───────────────────────────────────────────────────

function CategoryFilterButton({
  active,
  onClick,
  label,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  accent?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={[
        "rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200",
        active
          ? "border-transparent text-white"
          : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
      ].join(" ")}
      style={active && accent ? { backgroundColor: accent } : {}}
    >
      {label}
    </motion.button>
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
        <section className="relative min-h-[70vh] overflow-hidden">
          <AnimatedHeroBackground gradient="from-emerald-900/60 via-zinc-900 to-zinc-950" />
          <FloatingParticles count={15} />
          
          <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid w-full gap-12 lg:grid-cols-2 lg:gap-12 items-center">
              {/* Left - Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="order-1"
              >
                {/* Meta */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-4 flex flex-wrap items-center gap-3 text-xs"
                >
                  <span
                    className="rounded-full px-3 py-1 font-semibold text-white"
                    style={{ backgroundColor: CATEGORIES[featured.category].accent }}
                  >
                    {CATEGORIES[featured.category].label.toUpperCase()}
                  </span>
                  <span className="text-zinc-400">12 Min Read</span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-400">March 18, 2024</span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
                >
                  The Edge of Innovation: How{" "}
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    AI is Reshaping
                  </span>{" "}
                  the Digital Frontier
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-8 max-w-xl text-lg text-zinc-400"
                >
                  Scopri come l&apos;intelligenza artificiale sta trasformando i mercati digitali
                  e creando nuove opportunità per startup e enterprise.
                </motion.p>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href={`/blog/${featured.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/25"
                    >
                      Read Full Story
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </motion.div>

                  {/* Author */}
                  <motion.div
                    className="flex items-center gap-3"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-sm font-bold text-white">
                      A
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Anselmo</p>
                      <p className="text-xs text-zinc-500">AI Policy Expert</p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Right - Visual */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative order-2 hidden lg:block"
              >
                <motion.div
                  className="relative aspect-square overflow-hidden rounded-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-800/50 via-indigo-900/50 to-purple-900/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="text-center"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <span className="text-7xl font-black text-white/10 tracking-tighter">AI</span>
                      <span className="block text-5xl font-black text-white/5 tracking-tighter">ADVANTAGE</span>
                    </motion.div>
                  </div>
                  {/* Decorative elements */}
                  <motion.div
                    className="absolute right-4 top-4 h-20 w-20 rounded-full border border-white/10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute bottom-8 left-8 h-12 w-12 rounded-lg border border-white/10"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ── ARTICLES GRID ─────────────────────────────────────────────────────── */}
      <section
        id="articoli"
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center justify-between border-b border-zinc-800"
        >
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
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          <CategoryFilterButton
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            label="Tutti"
            accent="#6366f1"
          />
          {(
            Object.entries(CATEGORIES) as [
              CategoryKey,
              (typeof CATEGORIES)[CategoryKey],
            ][]
          ).map(([key, cat]) => (
            <CategoryFilterButton
              key={key}
              active={activeCategory === key}
              onClick={() => setActiveCategory(key)}
              label={cat.label}
              accent={cat.accent}
            />
          ))}
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ArticleCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center text-zinc-500"
          >
            Nessun articolo in questa categoria.
          </motion.p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                author={ARTICLE_META[article.id]?.author}
                readTime={ARTICLE_META[article.id]?.readTime}
                index={index}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-indigo-500/50 hover:text-white"
            >
              View All Articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── NEWSLETTER CTA ────────────────────────────────────────────────────── */}
      <NewsletterSection />
    </div>
  );
}
