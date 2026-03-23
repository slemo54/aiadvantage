"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock, TrendingUp } from "lucide-react";
import type { Article } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";

interface LatestNewsProps {
  articles: Article[];
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Data sconosciuta";
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 24) return `${hours}h fa`;
  if (days < 7) return `${days}g fa`;
  return date.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

export function LatestNews({ articles }: LatestNewsProps) {
  const newsArticles = articles.slice(0, 8);
  const popular = [...articles]
    .sort((a, b) => (b.freshness_score || 0) - (a.freshness_score || 0))
    .slice(0, 7);

  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-5 mb-8"
        >
          <h2
            className="text-3xl sm:text-4xl font-black text-white tracking-tight"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Ultime <span className="text-[#22c55e]">News</span>
          </h2>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 px-5 py-2 rounded-full border-2 border-gray-700 text-sm font-bold text-gray-300 hover:border-[#22c55e] hover:text-[#22c55e] transition-all"
          >
            Vedi tutti
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gray-800 mb-8" />

        {/* Articles list + sidebar */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left — Article list */}
          <div className="lg:col-span-8 space-y-0 divide-y divide-gray-800">
            {newsArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/blog/${article.slug}`}>
                  <article className="group flex gap-5 py-5 cursor-pointer">
                    {/* Thumbnail */}
                    <div className="w-28 h-20 sm:w-36 sm:h-24 rounded-xl overflow-hidden shrink-0">
                      {article.hero_image_url ? (
                        <img
                          src={article.hero_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-700 relative">
                          <div
                            className="absolute inset-0 opacity-30"
                            style={{
                              backgroundImage: `
                                linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
                              `,
                              backgroundSize: "20px 20px",
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center min-w-0 flex-1">
                      <span
                        className="text-xs font-bold tracking-wider mb-1 uppercase"
                        style={{
                          color: CATEGORIES[article.category]?.accent || "#22c55e",
                        }}
                      >
                        {CATEGORIES[article.category]?.label || article.category}
                      </span>
                      <h3 className="text-white font-bold text-base sm:text-lg line-clamp-2 group-hover:text-[#22c55e] transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-16 space-y-6">
              {/* Site info card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[#22c55e] rounded-xl flex items-center justify-center">
                    <span className="text-black font-bold text-sm">AI</span>
                  </div>
                  <span className="text-white font-bold text-lg">IlVantaggioAI</span>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#22c55e] mt-0.5">&#9679;</span>
                    <span className="text-gray-300">
                      <strong className="text-white">AI-powered.</strong> Contenuti generati e curati con AI.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#22c55e] mt-0.5">&#9679;</span>
                    <span className="text-gray-300">
                      <strong className="text-white">In italiano.</strong> News e guide sull&apos;AI in italiano.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#22c55e] mt-0.5">&#9679;</span>
                    <span className="text-gray-300">
                      <strong className="text-white">Sempre aggiornato.</strong> Novit&agrave; ogni giorno.
                    </span>
                  </li>
                </ul>
              </motion.div>

              {/* Most Popular */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#22c55e]" />
                    Pi&ugrave; Popolari
                  </h3>
                  <Link
                    href="/blog"
                    className="text-[#22c55e] hover:text-[#4ade80] transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="p-3 space-y-1">
                  {popular.map((article) => (
                    <Link key={article.id} href={`/blog/${article.slug}`}>
                      <div className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-800/50 transition-colors cursor-pointer">
                        <span
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{
                            backgroundColor:
                              CATEGORIES[article.category]?.accent || "#22c55e",
                          }}
                        />
                        <span className="text-sm text-gray-300 group-hover:text-[#22c55e] transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
