"use client";

import Image from "next/image";
import { TrendingUp, Sparkles, Clock, ArrowRight } from "lucide-react";
import type { Article } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";

interface SidebarProps {
  articles: Article[];
}

export function Sidebar({ articles }: SidebarProps) {
  const latest = articles.slice(0, 4);
  const popular = [...articles]
    .sort((a, b) => (b.freshness_score || 0) - (a.freshness_score || 0))
    .slice(0, 5);

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
    <aside className="space-y-6">
      <div className="reveal-on-scroll overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-white">
            <Clock className="h-4 w-4 text-[#10b981]" />
            Ultime notizie
          </h3>
          <Link href="/blog" className="text-xs font-semibold text-[#86efac] hover:text-white">Vedi tutte</Link>
        </div>
        <div className="space-y-3 p-3">
          {latest.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="group block">
              <article className="bento-card grid grid-cols-[92px_1fr] gap-3 rounded-[1.2rem] border border-white/6 bg-black/20 p-3">
                <div className="relative overflow-hidden rounded-xl bg-[linear-gradient(135deg,#0f172a,#111827)]">
                  {article.hero_image_url ? (
                    <Image
                      src={article.hero_image_url}
                      alt={article.title}
                      fill
                      sizes="160px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full min-h-[76px] w-full items-center justify-center text-xl">🤖</div>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: CATEGORIES[article.category]?.accent || '#22c55e' }}>
                    {CATEGORIES[article.category]?.label ?? article.category}
                  </span>
                  <h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-white group-hover:text-[#86efac]">
                    {article.title}
                  </h4>
                  <span className="mt-2 block text-xs text-zinc-500">{formatDate(article.published_at)}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <div className="reveal-on-scroll overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-white">
            <TrendingUp className="h-4 w-4 text-[#f97316]" />
            Più letti
          </h3>
        </div>
        <div className="space-y-2 p-3">
          {popular.map((article, idx) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="group block">
              <article className="rounded-[1.2rem] border border-white/6 bg-black/20 p-4 transition hover:border-[#10b981]/30 hover:bg-white/[0.04]">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-xs font-black text-black">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="line-clamp-2 text-sm font-semibold leading-6 text-white group-hover:text-[#86efac]">
                      {article.title}
                    </h4>
                    <span className="mt-1 block text-xs text-zinc-500">{formatDate(article.published_at)}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <div className="reveal-on-scroll dots-pattern overflow-hidden rounded-[1.8rem] border border-[#10b981]/20 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_30%),linear-gradient(135deg,#07110d,#0a0f14)] p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#10b981]" />
          <span className="text-sm font-bold text-[#86efac]">Newsletter</span>
        </div>
        <h4 className="mt-3 text-xl font-black text-white">Ricevi il vantaggio prima degli altri</h4>
        <p className="mt-3 text-sm leading-7 text-zinc-300">
          Ogni settimana: trend selezionati, tool utili e insight rapidi da applicare subito.
        </p>
        <a
          href="#newsletter"
          className="cta-cursor relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#10b981] px-4 py-3 text-sm font-black text-black transition hover:bg-[#34d399]"
        >
          Iscriviti gratis
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </aside>
  );
}
