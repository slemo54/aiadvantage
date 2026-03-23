"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { Article } from "@/lib/types";
import Link from "next/link";

interface InBriefProps {
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

export function InBrief({ articles }: InBriefProps) {
  const briefArticles = articles.slice(0, 4);

  return (
    <section className="py-10 bg-[#0a0a0a] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-0 divide-y divide-gray-800">
          {briefArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/blog/${article.slug}`}>
                <article className="group flex gap-4 py-4 cursor-pointer">
                  {/* Thumbnail */}
                  <div className="w-24 h-18 sm:w-28 sm:h-20 rounded-lg overflow-hidden shrink-0">
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
                            backgroundSize: "16px 16px",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#22c55e] text-black text-[10px] font-bold tracking-wider uppercase">
                        IN BRIEF
                      </span>
                    </div>
                    <h4 className="text-white font-bold text-sm sm:text-base line-clamp-2 group-hover:text-[#22c55e] transition-colors">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mt-1.5">
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
