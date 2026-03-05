"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/constants";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

import { AnimatedImagePlaceholder } from "@/components/animations/animated-image";

interface ArticleCardProps {
  article: Article;
  author?: string;
  readTime?: number;
  index?: number;
}

export function ArticleCard({ article, author, readTime, index = 0 }: ArticleCardProps) {
  const category = CATEGORIES[article.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Link href={`/blog/${article.slug}`} className="group block h-full">
        <motion.article 
          className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-colors duration-300 hover:border-indigo-500/50"
          whileHover={{ 
            boxShadow: "0 20px 40px -15px rgba(99, 102, 241, 0.25)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Image / gradient placeholder */}
          {article.hero_image_url ? (
            <div className="aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.hero_image_url}
                alt={article.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ) : (
            <div className="relative aspect-video overflow-hidden">
              <AnimatedImagePlaceholder 
                category={article.category} 
                className="h-full w-full"
              />
              {/* Category badge top-left */}
              <motion.span
                className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm"
                style={{ backgroundColor: `${category.accent}cc` }}
                whileHover={{ scale: 1.05 }}
              >
                {category.label}
              </motion.span>
              
              {/* Hover overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Card body */}
          <div className="flex flex-1 flex-col p-5">
            {/* Badge (only shown when there IS a real hero image) */}
            {article.hero_image_url && (
              <Badge
                variant="outline"
                className="mb-3 w-fit border-none px-0 text-xs font-semibold"
                style={{ color: category.accent }}
              >
                {category.label}
              </Badge>
            )}

            {/* Title */}
            <h3 className="mb-2 line-clamp-2 flex-1 text-base font-bold leading-snug text-zinc-100 transition-colors duration-300 group-hover:text-indigo-300">
              {article.title}
            </h3>

            {/* Description */}
            {article.meta_description && (
              <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
                {article.meta_description}
              </p>
            )}

            {/* Footer meta */}
            <div className="mt-auto flex items-center gap-2 text-xs text-zinc-600">
              {/* Avatar placeholder */}
              <motion.div 
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-900 text-[10px] font-bold text-indigo-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {(author ?? "A")[0].toUpperCase()}
              </motion.div>
              <span className="font-medium text-zinc-400">{author ?? "Redazione"}</span>
              {article.published_at && (
                <>
                  <span className="text-zinc-700">·</span>
                  <time dateTime={article.published_at} className="text-zinc-500">
                    {formatDate(article.published_at)}
                  </time>
                </>
              )}
              {readTime && (
                <>
                  <span className="text-zinc-700">·</span>
                  <span className="text-zinc-500">{readTime} min</span>
                </>
              )}
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}

// ─── Skeleton Card for Loading State ──────────────────────────────────────────

export function ArticleCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="aspect-video bg-zinc-800 animate-pulse" />
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 h-4 w-16 rounded bg-zinc-800 animate-pulse" />
          <div className="mb-2 h-6 w-full rounded bg-zinc-800 animate-pulse" />
          <div className="mb-2 h-6 w-3/4 rounded bg-zinc-800 animate-pulse" />
          <div className="mb-4 h-4 w-full rounded bg-zinc-800 animate-pulse" />
          <div className="mt-auto flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-zinc-800 animate-pulse" />
            <div className="h-4 w-20 rounded bg-zinc-800 animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
