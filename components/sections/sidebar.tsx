"use client";

import { TrendingUp, Sparkles, Clock } from "lucide-react";
import type { Article } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/animations/fade-in";

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
    <aside className="space-y-8">
      {/* Latest News */}
      <FadeIn direction="right">
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#22c55e]" />
              Ultime News
            </h3>
          </div>
          <div className="p-2">
            {latest.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`}>
                <article className="group flex gap-4 p-3 rounded-xl hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 relative">
                    {article.hero_image_url ? (
                      <Image
                        src={article.hero_image_url}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                        <span className="text-lg">&#129302;</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-[10px] font-bold tracking-wider"
                      style={{ color: CATEGORIES[article.category]?.accent || "#22c55e" }}
                    >
                      {article.category.replace("_", " ").toUpperCase()}
                    </span>
                    <h4 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-[#22c55e] transition-colors">
                      {article.title}
                    </h4>
                    <span className="text-gray-500 text-xs mt-1 block">
                      {formatDate(article.published_at)}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Most Popular */}
      <FadeIn direction="right" delay={100}>
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h3 className="font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#ef4444]" />
              Pi&ugrave; Popolari
            </h3>
          </div>
          <div className="p-2">
            {popular.map((article, idx) => (
              <Link key={article.id} href={`/blog/${article.slug}`}>
                <article className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <span className="w-6 h-6 rounded-full bg-[#22c55e] text-black text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-[#22c55e] transition-colors">
                      {article.title}
                    </h4>
                    <span className="text-gray-500 text-xs mt-1 block">
                      {formatDate(article.published_at)}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Promo Box */}
      <FadeIn direction="right" delay={200}>
        <div
          className="relative p-6 rounded-2xl border-2 border-[#22c55e]/30 bg-gradient-to-br from-[#0a0a0a] to-[#111] overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#22c55e]" />
              <span className="text-[#22c55e] font-bold text-sm">Newsletter</span>
            </div>
            <h4 className="text-white font-bold mb-2">
              Resta aggiornato sull&apos;AI
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Ricevi le ultime news sull&apos;intelligenza artificiale direttamente nella tua inbox.
            </p>
            <a
              href="#newsletter"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#22c55e] text-black font-semibold rounded-lg hover:bg-[#4ade80] transition-colors"
            >
              Iscriviti gratis
            </a>
          </div>
        </div>
      </FadeIn>
    </aside>
  );
}
