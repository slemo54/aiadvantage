"use client";

import { motion } from "framer-motion";
import { Zap, Clock } from "lucide-react";
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
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#22c55e]" />
            In Breve
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {briefArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/blog/${article.slug}`}>
                <article className="group flex gap-4 p-4 rounded-xl bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 transition-all cursor-pointer">
                  {/* Thumbnail */}
                  <div className="w-28 h-20 rounded-lg overflow-hidden shrink-0">
                    {(article.featured_image_url || article.hero_image_url) ? (
                      <img
                        src={article.featured_image_url || article.hero_image_url!}
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
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <span 
                      className="text-xs font-bold tracking-wider mb-1"
                      style={{ color: CATEGORIES[article.category]?.accent || '#22c55e' }}
                    >
                      {article.category.replace("_", " ").toUpperCase()}
                    </span>
                    
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded bg-[#22c55e] flex items-center justify-center shrink-0 mt-0.5">
                        <Zap className="w-3 h-3 text-black" />
                      </span>
                      <h4 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-[#22c55e] transition-colors">
                        {article.title}
                      </h4>
                    </div>
                    
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
    </section>
  );
}
