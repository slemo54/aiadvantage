"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Article } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";

interface FeaturedArticlesProps {
  articles: Article[];
}

export function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  const featured = articles.slice(0, 5);
  const mainArticle = featured[0];
  const sideArticles = featured.slice(1, 4);

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
    <section id="articles" className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-3xl font-bold text-white">In evidenza</h2>
          <Link 
            href="/blog" 
            className="text-[#22c55e] hover:text-[#4ade80] flex items-center gap-1 text-sm font-medium transition-colors"
          >
            Vedi tutti
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Featured Article */}
          {mainArticle && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-8"
            >
              <Link href={`/blog/${mainArticle.slug}`}>
                <article className="group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {mainArticle.hero_image_url ? (
                      <img
                        src={mainArticle.hero_image_url}
                        alt={mainArticle.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold w-fit mb-4"
                      style={{ 
                        backgroundColor: `${CATEGORIES[mainArticle.category]?.accent || '#22c55e'}20`,
                        color: CATEGORIES[mainArticle.category]?.accent || '#22c55e'
                      }}
                    >
                      {mainArticle.category.replace("_", " ").toUpperCase()}
                    </span>
                    <h3 className="text-2xl lg:text-4xl font-bold text-white mb-3 group-hover:text-[#22c55e] transition-colors line-clamp-3">
                      {mainArticle.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(mainArticle.published_at)}</span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          )}

          {/* Side Articles */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {sideArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/blog/${article.slug}`}>
                  <article className="group flex gap-4 p-4 rounded-xl bg-[#0a0a0a] border border-gray-800 hover:border-[#22c55e]/30 transition-all cursor-pointer">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                      {article.hero_image_url ? (
                        <img
                          src={article.hero_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                          <span className="text-2xl">🤖</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center min-w-0">
                      <span 
                        className="text-xs font-semibold mb-1"
                        style={{ color: CATEGORIES[article.category]?.accent || '#22c55e' }}
                      >
                        {article.category.replace("_", " ").toUpperCase()}
                      </span>
                      <h4 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-[#22c55e] transition-colors">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
