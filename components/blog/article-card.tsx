"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui-new/badge";
import { CATEGORIES } from "@/lib/constants";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  author?: string;
  readTime?: number;
  index?: number;
}

const categoryColors: Record<string, "blue" | "purple" | "orange" | "green" | "yellow"> = {
  ai_news: "blue",
  use_cases: "purple",
  web_dev: "orange",
  opinions: "green",
  tools: "yellow",
  tutorials: "blue",
};

export function ArticleCard({ article, author, readTime, index = 0 }: ArticleCardProps) {
  const category = CATEGORIES[article.category];
  const badgeColor = categoryColors[article.category] || "blue";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <Link href={`/blog/${article.slug}`} className="block h-full">
        <article className="h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
          {/* Image Container */}
          <div className="relative h-52 overflow-hidden">
            {article.hero_image_url ? (
              <Image
                src={article.hero_image_url}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: category.accent }}
              >
                <span className="text-4xl">{category.icon}</span>
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <Badge color={badgeColor}>{category.label}</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#3B5BFF] transition-colors">
              {article.title}
            </h3>
            
            {article.meta_description && (
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {article.meta_description}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B5BFF] to-[#A855F7] flex items-center justify-center text-white text-xs font-bold">
                  {(author || "A")[0].toUpperCase()}
                </div>
                <span className="text-xs font-medium text-gray-600">
                  {author || "Team"}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-400">
                {article.published_at && (
                  <span>{formatDate(article.published_at)}</span>
                )}
                {readTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {readTime}m
                  </span>
                )}
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

// Skeleton loader for article cards
export function ArticleCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <div className="h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        {/* Image Skeleton */}
        <div className="relative h-52 overflow-hidden bg-gray-200 animate-pulse" />

        {/* Content Skeleton */}
        <div className="p-5 space-y-3">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />

          {/* Meta Skeleton */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
            </div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
