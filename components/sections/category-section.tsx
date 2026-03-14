"use client";

import Image from "next/image";
import { ArrowRight, Clock3, CalendarDays } from "lucide-react";
import type { Article } from "@/lib/types";
import type { CategoryKey } from "@/lib/constants";
import Link from "next/link";

interface CategorySectionProps {
  articles: Article[];
  category: CategoryKey;
  title: string;
  accentColor?: string;
}

export function CategorySection({ 
  articles, 
  category, 
  title, 
  accentColor = "#22c55e" 
}: CategorySectionProps) {
  const categoryArticles = articles.filter(a => a.category === category).slice(0, 4);
  
  if (categoryArticles.length === 0) return null;

  const mainArticle = categoryArticles[0];
  const sideArticles = categoryArticles.slice(1);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Data sconosciuta";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return "Adesso";
    if (hours < 24) return `${hours}h fa`;
    if (days < 7) return `${days}g fa`;
    return date.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
  };

  const readTime = (article: Article) => {
    const words = article.meta_description?.split(" ").length ?? 18;
    return Math.max(4, Math.min(9, Math.round(words / 4)));
  };

  return (
    <section className="bg-black py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal-on-scroll mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: accentColor }}>
              Selezione editoriale
            </p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">{title}</h2>
          </div>
          <Link
            href={`/blog?category=${category}`}
            className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            style={{ borderColor: `${accentColor}55` }}
          >
            Vedi tutti
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Link href={`/blog/${mainArticle.slug}`} className="group block reveal-on-scroll">
              <article className="bento-card relative min-h-[420px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.03]">
                <div className="absolute inset-0">
                  {mainArticle.hero_image_url ? (
                    <Image
                      src={mainArticle.hero_image_url}
                      alt={mainArticle.title}
                      fill
                      priority={false}
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-[linear-gradient(135deg,#0f172a,#111827,#020617)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                </div>

                <div className="relative flex h-full flex-col justify-end p-6 lg:p-8">
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-zinc-300">
                    <span className="rounded-full px-3 py-1 font-semibold text-white" style={{ backgroundColor: accentColor }}>
                      {title}
                    </span>
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {readTime(mainArticle)} min lettura</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(mainArticle.published_at)}</span>
                  </div>
                  <h3 className="link-underline max-w-3xl text-2xl font-black leading-tight text-white sm:text-3xl">
                    {mainArticle.title}
                  </h3>
                  {mainArticle.meta_description && (
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                      {mainArticle.meta_description}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          </div>

          <div className="grid gap-5 lg:col-span-5">
            {sideArticles.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`} className="group block reveal-on-scroll">
                <article className="bento-card grid min-h-[128px] grid-cols-[120px_1fr] gap-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-3 sm:grid-cols-[148px_1fr] sm:p-4">
                  <div className="relative overflow-hidden rounded-[1.1rem] bg-[linear-gradient(135deg,#111827,#0f172a)]">
                    {article.hero_image_url ? (
                      <Image
                        src={article.hero_image_url}
                        alt={article.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl">🤖</div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col justify-center">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                      <span className="font-semibold uppercase tracking-[0.18em]" style={{ color: accentColor }}>{title}</span>
                      <span>•</span>
                      <span>{formatDate(article.published_at)}</span>
                    </div>
                    <h4 className="link-underline text-sm font-bold leading-6 text-white sm:text-base">
                      {article.title}
                    </h4>
                    <p className="mt-2 line-clamp-2 text-xs leading-6 text-zinc-400 sm:text-sm">
                      {article.meta_description ?? "Insight operativo, rapido da leggere e immediato da applicare."}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
