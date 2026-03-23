"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Article } from "@/lib/types";
import type { CategoryKey } from "@/lib/constants";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";

interface CategorySectionProps {
  articles: Article[];
  category: CategoryKey;
  title: string;
  accentColor?: string;
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

export function CategorySection({
  articles,
  category,
  title,
  accentColor = "#22c55e",
}: CategorySectionProps) {
  const categoryArticles = articles.filter((a) => a.category === category).slice(0, 7);

  if (categoryArticles.length === 0) return null;

  const mainArticle = categoryArticles[0];
  const sideArticles = categoryArticles.slice(1, 4);
  const bottomArticles = categoryArticles.slice(4, 7);

  return (
    <section
      className="py-12 relative overflow-hidden"
      style={{
        backgroundColor: `${accentColor}10`,
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(${accentColor}40 1px, transparent 1px),
            linear-gradient(90deg, ${accentColor}40 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-8"
        >
          <h2
            className="text-3xl lg:text-4xl font-black tracking-tight"
            style={{ color: accentColor }}
          >
            {title}
          </h2>
          <Link
            href={`/category/${category}`}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-full border-2 text-sm font-bold transition-all hover:scale-105"
            style={{
              borderColor: accentColor,
              color: accentColor,
              backgroundColor: `${accentColor}15`,
            }}
          >
            Vedi tutti
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Top row: main article + side grid */}
        <div className="grid lg:grid-cols-12 gap-6 mb-8">
          {/* Main Article — left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <Link href={`/blog/${mainArticle.slug}`}>
              <article className="group cursor-pointer">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative">
                  {mainArticle.hero_image_url ? (
                    <img
                      src={mainArticle.hero_image_url}
                      alt={mainArticle.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 relative">
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                          `,
                          backgroundSize: "40px 40px",
                        }}
                      />
                    </div>
                  )}
                  {/* Category badge */}
                  <div className="absolute bottom-4 left-4">
                    <span
                      className="px-3 py-1 rounded text-xs font-bold tracking-wider uppercase bg-black/70 text-white"
                    >
                      {CATEGORIES[mainArticle.category]?.label || category}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white group-hover:opacity-80 transition-opacity line-clamp-2">
                  {mainArticle.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(mainArticle.published_at)}</span>
                </div>
              </article>
            </Link>
          </motion.div>

          {/* Side articles — right grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {sideArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link href={`/blog/${article.slug}`}>
                  <article className="group flex gap-4 p-3 rounded-xl bg-black/30 hover:bg-black/50 transition-all cursor-pointer">
                    {/* Thumbnail */}
                    <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
                      {article.hero_image_url ? (
                        <img
                          src={article.hero_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                              backgroundSize: "16px 16px",
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <span
                        className="text-[10px] font-bold tracking-wider uppercase mb-1"
                        style={{ color: accentColor }}
                      >
                        {CATEGORIES[article.category]?.label || category}
                      </span>
                      <h4 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-gray-300 transition-colors">
                        {article.title}
                      </h4>
                      <span className="text-gray-500 text-xs mt-1">
                        {formatDate(article.published_at)}
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}

            {/* Site info mini card in bottom-right slot */}
            {sideArticles.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center"
              >
                <div className="bg-black/40 border border-gray-800/50 rounded-xl p-4 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold text-xs">AI</span>
                    </div>
                    <span className="text-white font-bold text-sm">IlVantaggioAI</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-gray-400">
                    <li className="flex items-center gap-1.5">
                      <span className="text-[#22c55e]">&#9679;</span>
                      AI-powered. Contenuti curati con AI.
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-[#22c55e]">&#9679;</span>
                      In italiano. Sempre aggiornato.
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom row: extra articles in horizontal strip */}
        {bottomArticles.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
            {bottomArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link href={`/blog/${article.slug}`}>
                  <article className="group flex gap-3 py-3 cursor-pointer">
                    <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0">
                      {article.hero_image_url ? (
                        <img
                          src={article.hero_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-700" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span
                        className="text-[10px] font-bold tracking-wider uppercase"
                        style={{ color: accentColor }}
                      >
                        {CATEGORIES[article.category]?.label || category}
                      </span>
                      <h4 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-gray-300 transition-colors">
                        {article.title}
                      </h4>
                      <span className="text-gray-500 text-xs">
                        {formatDate(article.published_at)}
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
