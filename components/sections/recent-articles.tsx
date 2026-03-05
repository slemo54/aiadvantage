"use client";

import { motion } from "framer-motion";
import { ArticleCard } from "@/components/blog/article-card";
import { Button } from "@/components/ui-new/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Article } from "@/lib/types";

interface RecentArticlesProps {
  articles: Article[];
}

const ARTICLE_META: Record<string, { author: string; readTime: number }> = {
  "1": { author: "Anselmo", readTime: 5 },
  "2": { author: "Maria", readTime: 8 },
  "3": { author: "Luca", readTime: 6 },
};

export function RecentArticles({ articles }: RecentArticlesProps) {
  const recentArticles = articles.slice(0, 6);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Articoli Recenti
            </h2>
            <p className="text-gray-600">
              Esplora i nostri ultimi contenuti sull&apos;intelligenza artificiale
            </p>
          </div>
          <Link href="/blog">
            <Button variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
              Vedi tutti
            </Button>
          </Link>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              author={ARTICLE_META[article.id]?.author}
              readTime={ARTICLE_META[article.id]?.readTime}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
