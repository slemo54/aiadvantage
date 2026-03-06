"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  ChevronRight,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/constants";
import type { Article } from "@/lib/types";
import type { CategoryKey } from "@/lib/constants";
import { SEED_ARTICLES, type SeedArticle } from "@/lib/seed-articles";

// ─── Table of Contents ────────────────────────────────────────────────────────

interface TocItem { id: string; label: string; level: number }

function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const label = match[2].replace(/<[^>]+>/g, "");
    const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    items.push({ id, label, level });
  }
  return items;
}

function injectHeadingIds(html: string): string {
  return html.replace(/<h([23])([^>]*)>(.*?)<\/h[23]>/gi, (_, level, attrs, text) => {
    const label = text.replace(/<[^>]+>/g, "");
    const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `<h${level} id="${id}"${attrs}>${text}</h${level}>`;
  });
}

function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav className="sticky top-24">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Indice
      </p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="flex items-start gap-2 text-sm text-zinc-400 transition-colors hover:text-indigo-400"
              style={{ paddingLeft: item.level > 2 ? "12px" : 0 }}
            >
              <span className="mt-0.5 shrink-0 text-zinc-600">{index + 1}.</span>
              <span className="line-clamp-2">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─── Related Articles ─────────────────────────────────────────────────────────

function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const related = SEED_ARTICLES.filter(a => a.slug !== currentSlug).slice(0, 3);
  return (
    <section className="border-t border-zinc-800 bg-zinc-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Articoli Correlati</h2>
          <Link href="/blog" className="flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-indigo-300">
            Vedi tutti <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="group block">
              <article className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all hover:border-zinc-700">
                <div className={`relative h-40 bg-gradient-to-br ${article.gradient}`}>
                  <div className="pointer-events-none absolute inset-0 opacity-10"
                    style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                  <span className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                    style={{ backgroundColor: `${CATEGORIES[article.category as CategoryKey]?.accent ?? "#6366f1"}cc` }}>
                    {CATEGORIES[article.category as CategoryKey]?.label ?? article.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="mb-2 line-clamp-2 text-sm font-bold text-zinc-100 group-hover:text-white">
                    {article.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-zinc-500">{article.meta_description}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter CTA ───────────────────────────────────────────────────────────

function ArticleNewsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setSent(true);
  }

  return (
    <section className="border-t border-zinc-800 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 sm:flex-row sm:p-10">
          <div className="text-center sm:text-left">
            <h3 className="mb-2 text-xl font-bold text-white sm:text-2xl">
              Il vantaggio dell&apos;IA ogni settimana
            </h3>
            <p className="text-sm text-indigo-100">
              Analisi, tutorial e news per restare avanti nel mondo AI.
            </p>
          </div>
          {sent ? (
            <p className="rounded-xl bg-white/20 px-6 py-3 text-sm font-semibold text-white">
              ✓ Iscritto! Controlla la tua email.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2 sm:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="La tua email"
                required
                className="flex-1 rounded-lg border-0 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:bg-white/20 focus:outline-none"
              />
              <Button type="submit" className="bg-white text-indigo-600 hover:bg-white/90">
                Iscriviti
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Main Article Page ────────────────────────────────────────────────────────

function seedToArticle(s: SeedArticle): Article {
  return {
    id: s.id,
    title: s.title,
    slug: s.slug,
    content_html: s.content_html,
    status: "published",
    category: s.category as CategoryKey,
    freshness_score: 90,
    hero_image_url: null,
    meta_description: s.meta_description,
    keywords: s.keywords,
    published_at: s.published_at,
    created_at: s.published_at,
    updated_at: s.published_at,
  };
}

export default function BlogArticlePage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : (params.slug?.[0] ?? "");

  const seedMatch = SEED_ARTICLES.find((a) => a.slug === slug);
  const defaultArticle = seedMatch ? seedToArticle(seedMatch) : seedToArticle(SEED_ARTICLES[0]);

  const [article, setArticle] = useState<Article>(defaultArticle);
  const [seedMeta, setSeedMeta] = useState<SeedArticle | undefined>(seedMatch);
  const [isLoading, setIsLoading] = useState(!seedMatch);

  useEffect(() => {
    if (seedMatch) { setIsLoading(false); return; }
    async function loadArticle() {
      try {
        const res = await fetch(`/api/articles/${slug}`);
        if (res.ok) {
          const data = await res.json() as { article?: Article };
          if (data.article) {
            setArticle(data.article);
            setSeedMeta(undefined);
          }
        }
      } catch {}
      finally { setIsLoading(false); }
    }
    void loadArticle();
  }, [slug, seedMatch]);

  const category = CATEGORIES[article.category as CategoryKey] ?? CATEGORIES.ai_news;
  const gradient = seedMeta?.gradient ?? "from-indigo-900 via-violet-900 to-purple-900";
  const readTime = seedMeta?.readTime ?? 8;
  const author = seedMeta?.author ?? "Anselmo";

  const rawContent = article.content_html ?? "";
  const contentWithIds = injectHeadingIds(rawContent);
  const toc = extractToc(rawContent);

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })
    : "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 h-8 w-48 animate-pulse rounded-lg bg-zinc-800" />
          <div className="aspect-[21/9] animate-pulse rounded-2xl bg-zinc-900" />
          <div className="mt-8 space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-zinc-800" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-900" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-900" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Breadcrumb */}
      <div className="border-b border-zinc-800/50 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-300">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-zinc-300">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-400 line-clamp-1">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className={`relative aspect-[21/9] overflow-hidden rounded-2xl bg-gradient-to-br ${gradient}`}>
            {/* Grid overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-10"
              style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            {/* Category badge */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="h-48 w-48 opacity-10" fill="none">
                <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="1"/>
                <circle cx="100" cy="100" r="55" stroke="white" strokeWidth="1"/>
                <circle cx="100" cy="100" r="30" stroke="white" strokeWidth="1"/>
                <line x1="20" y1="100" x2="180" y2="100" stroke="white" strokeWidth="1"/>
                <line x1="100" y1="20" x2="100" y2="180" stroke="white" strokeWidth="1"/>
                <circle cx="100" cy="40" r="5" fill="white"/>
                <circle cx="100" cy="160" r="5" fill="white"/>
                <circle cx="40" cy="100" r="5" fill="white"/>
                <circle cx="160" cy="100" r="5" fill="white"/>
              </svg>
            </div>
            <div className="absolute bottom-4 left-4">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: `${category.accent}dd` }}>
                {category.label}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">

          {/* Left Sidebar — TOC */}
          <aside className="hidden lg:col-span-3 lg:block">
            <TableOfContents items={toc} />
          </aside>

          {/* Article */}
          <article className="lg:col-span-6">
            {/* Meta */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge className="text-xs font-semibold text-white" style={{ backgroundColor: category.accent }}>
                {category.label}
              </Badge>
              {article.keywords.slice(0, 3).map((k) => (
                <span key={k} className="rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-400">{k}</span>
              ))}
            </div>

            {/* Title */}
            <h1 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl">
              {article.title}
            </h1>

            {/* Author / date / read time */}
            <div className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {author[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{author}</p>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {readTime} min
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Lead / description */}
            {article.meta_description && (
              <p className="mb-8 rounded-xl border-l-4 border-indigo-500 bg-indigo-950/30 px-5 py-4 text-base italic text-zinc-300">
                {article.meta_description}
              </p>
            )}

            {/* Article Content */}
            <div
              className="prose-dark max-w-none"
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />

            {/* Engagement */}
            <div className="mt-10 flex items-center justify-between border-t border-zinc-800 pt-6">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-400 hover:border-indigo-500 hover:text-indigo-400">
                  <ThumbsUp className="mr-2 h-4 w-4" /> Utile
                </Button>
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white">
                  <MessageCircle className="mr-2 h-4 w-4" /> Commenta
                </Button>
              </div>
              <Link href="/blog" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> Tutti gli articoli
              </Link>
            </div>
          </article>

          {/* Right Sidebar */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Sull&apos;Autore
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                    {author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{author}</p>
                    <p className="text-xs text-zinc-500">AI Strategist & Developer</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-zinc-500">
                  Esploro l&apos;AI applicata al business e allo sviluppo software.
                </p>
                <Link href="/about">
                  <Button variant="outline" size="sm" className="mt-3 w-full border-zinc-700 text-xs text-zinc-400">
                    Profilo completo
                  </Button>
                </Link>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Newsletter
                </p>
                <p className="mb-3 text-xs text-zinc-400">
                  Ricevi ogni settimana le migliori analisi AI.
                </p>
                <Link href="/#newsletter">
                  <Button size="sm" className="w-full bg-indigo-600 text-xs hover:bg-indigo-500">
                    Iscriviti gratis
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Articles */}
      <RelatedArticles currentSlug={slug} />

      {/* Newsletter */}
      <ArticleNewsletter />
    </div>
  );
}
