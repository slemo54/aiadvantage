"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="inline-flex items-center gap-1 px-4 py-2 rounded-full border-2 text-sm font-bold transition-all hover:bg-white hover:text-black"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Vedi tutti
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Article */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <Link href={`/blog/${mainArticle.slug}`}>
              <article className="group cursor-pointer">
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4">
                  {(mainArticle.featured_image_url || mainArticle.hero_image_url) ? (
                    <img
                      src={mainArticle.featured_image_url || mainArticle.hero_image_url!}
                      alt={mainArticle.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-700" />
                  )}
                </div>
                <span 
                  className="text-xs font-bold tracking-wider opacity-80"
                  style={{ color: accentColor }}
                >
                  {mainArticle.category.replace("_", " ").toUpperCase()}
                </span>
                <h3 
                  className="text-xl font-bold text-white mt-2 group-hover:opacity-80 transition-opacity line-clamp-2"
                >
                  {mainArticle.title}
                </h3>
                <span className="text-gray-500 text-xs mt-2 block">
                  {formatDate(mainArticle.published_at)}
                </span>
              </article>
            </Link>
          </motion.div>

          {/* Side Articles */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sideArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/blog/${article.slug}`}>
                  <article className="group flex items-center gap-4 py-4 border-b border-gray-800 cursor-pointer hover:border-gray-700 transition-colors">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                      {(article.featured_image_url || article.hero_image_url) ? (
                        <img
                          src={article.featured_image_url || article.hero_image_url!}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                          <span className="text-xl">🤖</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-gray-300 transition-colors">
                        {article.title}
                      </h4>
                      <span className="text-gray-500 text-xs mt-1 block">
                        {formatDate(article.published_at)}
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div 
        className="h-1 mt-12 opacity-30"
        style={{ backgroundColor: accentColor }}
      />
    </section>
  );
}
