"use client";

import Image from "next/image";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import type { Article } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";

interface FeaturedArticlesProps {
  articles: Article[];
  isLoading?: boolean;
}

function formatRelativeDate(dateString: string | null) {
  if (!dateString) return "Data sconosciuta";
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return "Adesso";
  if (hours < 24) return `${hours} ore fa`;
  if (days === 1) return "1 giorno fa";
  if (days < 7) return `${days} giorni fa`;
  return date.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

function estimateReadTime(article: Article) {
  const base = article.meta_description?.split(" ").length ?? 18;
  return Math.max(4, Math.min(9, Math.round(base / 4)));
}

function BentoImage({ article, priority = false }: { article: Article; priority?: boolean }) {
  const category = CATEGORIES[article.category];

  if (article.hero_image_url) {
    return (
      <Image
        src={article.hero_image_url}
        alt={article.title}
        fill
        sizes={priority ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 33vw"}
        priority={priority}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#111827] via-[#0f172a] to-[#020617]">
      <span className="text-5xl opacity-80">{category.icon}</span>
    </div>
  );
}

function BentoCard({
  article,
  large = false,
}: {
  article: Article;
  large?: boolean;
}) {
  const category = CATEGORIES[article.category];
  const readTime = estimateReadTime(article);
  const relativeDate = formatRelativeDate(article.published_at);

  return (
    <Link href={`/blog/${article.slug}`} className="group block h-full reveal-on-scroll">
      <article className={[
        "bento-card relative h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03]",
        large ? "min-h-[420px] lg:min-h-[520px]" : "min-h-[250px]",
      ].join(" ")}>
        <div className="absolute inset-0">
          <BentoImage article={article} priority={large} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/5" />
        </div>

        <div className="relative flex h-full flex-col justify-end p-6 lg:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: category.accent }}
            >
              {category.label}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-zinc-300">
              <Clock className="h-3.5 w-3.5" /> {readTime} min lettura
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
              <CalendarDays className="h-3.5 w-3.5" /> {relativeDate}
            </span>
          </div>

          <h3 className={[
            "link-underline max-w-3xl font-black text-white",
            large ? "text-3xl leading-tight lg:text-4xl" : "text-lg leading-snug lg:text-xl",
          ].join(" ")}>
            {article.title}
          </h3>

          {article.meta_description && (
            <p className={[
              "mt-3 max-w-2xl text-zinc-300",
              large ? "text-sm leading-7 lg:text-base" : "line-clamp-2 text-sm leading-6",
            ].join(" ")}>
              {article.meta_description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <div className="lg:col-span-8 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <div className="skeleton-shimmer h-[420px] rounded-[1.5rem]" />
      </div>
      <div className="space-y-5 lg:col-span-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
            <div className="skeleton-shimmer h-[150px] rounded-[1.2rem]" />
            <div className="mt-4 space-y-3">
              <div className="skeleton-shimmer h-3 w-24 rounded-full" />
              <div className="skeleton-shimmer h-5 w-4/5 rounded-full" />
              <div className="skeleton-shimmer h-4 w-3/5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeaturedArticles({ articles, isLoading = false }: FeaturedArticlesProps) {
  const featured = articles.slice(0, 4);
  const mainArticle = featured[0];
  const sideArticles = featured.slice(1, 4);

  return (
    <section id="articles" className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between reveal-on-scroll">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#34d399]">
              In evidenza ora
            </p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Il feed AI che cattura attenzione e genera ritorni
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Una selezione editoriale progettata per massimizzare lettura, condivisione e iscrizioni.
            </p>
          </div>
          <Link
            href="/blog"
            className="cta-cursor relative inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#10b981]/40 hover:text-[#34d399]"
          >
            Vedi tutti gli articoli
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading || !mainArticle ? (
          <FeaturedSkeleton />
        ) : (
          <div className="grid gap-5 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <BentoCard article={mainArticle} large />
            </div>
            <div className="space-y-5 lg:col-span-4">
              {sideArticles.map((article) => (
                <BentoCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
