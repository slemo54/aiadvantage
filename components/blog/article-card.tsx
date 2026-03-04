import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/constants";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  gradient?: string;
  author?: string;
  readTime?: number;
}

export function ArticleCard({ article, gradient, author, readTime }: ArticleCardProps) {
  const category = CATEGORIES[article.category];

  const gradientClass = gradient ?? "from-indigo-900 to-violet-900";

  return (
    <Link href={`/blog/${article.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all duration-200 hover:border-zinc-700 hover:shadow-lg hover:shadow-indigo-950/20">
        {/* Image / gradient placeholder */}
        {article.hero_image_url ? (
          <div className="aspect-video overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.hero_image_url}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div
            className={`relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br ${gradientClass}`}
          >
            {/* Subtle overlay grid */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <Sparkles className="h-10 w-10 text-white/20" />
            {/* Category badge top-left */}
            <span
              className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: `${category.accent}cc` }}
            >
              {category.label}
            </span>
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
          <h3 className="mb-2 line-clamp-2 flex-1 text-base font-bold leading-snug text-zinc-100 transition-colors group-hover:text-white">
            {article.title}
          </h3>

          {/* Description */}
          {article.meta_description && (
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-500">
              {article.meta_description}
            </p>
          )}

          {/* Footer meta */}
          <div className="mt-auto flex items-center gap-2 text-xs text-zinc-600">
            {/* Avatar placeholder */}
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-900 text-[10px] font-bold text-indigo-300">
              {(author ?? "A")[0].toUpperCase()}
            </div>
            <span className="font-medium text-zinc-400">{author ?? "Redazione"}</span>
            {article.published_at && (
              <>
                <span className="text-zinc-700">·</span>
                <time dateTime={article.published_at}>
                  {formatDate(article.published_at)}
                </time>
              </>
            )}
            {readTime && (
              <>
                <span className="text-zinc-700">·</span>
                <span>{readTime} min</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
