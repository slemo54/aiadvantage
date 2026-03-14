"use client";

import Image from "next/image";
import { Zap, Clock3, ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";

interface InBriefProps {
  articles: Article[];
}

export function InBrief({ articles }: InBriefProps) {
  // Get most recent articles for quick reads
  const briefArticles = articles.slice(0, 6);

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

  return (
    <section className="bg-black py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal-on-scroll mb-8 flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-2xl font-black text-white sm:text-3xl">
            <Zap className="h-6 w-6 text-[#10b981]" />
            In breve
          </h2>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-[#86efac] hover:text-white">
            Tutti gli articoli
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {briefArticles.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="group block reveal-on-scroll">
              <article className="bento-card overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <div className="relative mb-4 h-44 overflow-hidden rounded-[1.1rem] bg-[linear-gradient(135deg,#111827,#0f172a)]">
                  {article.hero_image_url ? (
                    <Image
                      src={article.hero_image_url}
                      alt={article.title}
                      fill
                      sizes="(max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl">🤖</div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 text-[11px] text-zinc-500">
                  <span className="font-bold uppercase tracking-[0.18em]" style={{ color: CATEGORIES[article.category]?.accent || '#22c55e' }}>
                    {CATEGORIES[article.category]?.label ?? article.category}
                  </span>
                  <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {formatDate(article.published_at)}</span>
                </div>

                <h4 className="link-underline mt-3 text-lg font-bold leading-7 text-white">
                  {article.title}
                </h4>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-zinc-400">
                  {article.meta_description ?? "Insight rapido, concreto e leggibile in pochi minuti."}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
