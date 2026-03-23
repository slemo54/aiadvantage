"use client";

import { Clock } from "lucide-react";
import type { Article } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/animations/fade-in";

interface FeaturedArticlesProps {
  articles: Article[];
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Data sconosciuta";
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes} min fa`;
  if (hours < 24) return `${hours} ore fa`;
  if (days < 7) return `${days}g fa`;
  return date.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

function ArticleImage({ src, alt }: { src: string | null; alt: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );
  }
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
  );
}

export function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  const featured = articles.slice(0, 6);
  const mainArticle = featured[0];
  const rightArticles = featured.slice(1, 3);
  const headlineArticles = featured.slice(0, 5);

  return (
    <section className="py-6 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-5">
          {/* Left — Main Featured */}
          {mainArticle && (
            <FadeIn className="lg:col-span-5">
              <Link href={`/blog/${mainArticle.slug}`}>
                <article className="group relative h-full min-h-[420px] rounded-2xl overflow-hidden cursor-pointer">
                  <div className="absolute inset-0">
                    <ArticleImage src={mainArticle.hero_image_url} alt={mainArticle.title} />
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  </div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <span className="inline-block px-3 py-1 rounded text-xs font-bold tracking-wider w-fit mb-3 bg-black/60 text-white uppercase">
                      {CATEGORIES[mainArticle.category]?.label || mainArticle.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-[#22c55e] transition-colors line-clamp-3">
                      {mainArticle.title}
                    </h3>
                    {mainArticle.meta_description && (
                      <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                        {mainArticle.meta_description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(mainArticle.published_at)}</span>
                    </div>
                  </div>
                </article>
              </Link>
            </FadeIn>
          )}

          {/* Center — Two stacked medium articles */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {rightArticles.map((article, index) => (
              <FadeIn key={article.id} delay={index * 100} className="flex-1">
                <Link href={`/blog/${article.slug}`}>
                  <article className="group relative h-full min-h-[195px] rounded-2xl overflow-hidden cursor-pointer">
                    <div className="absolute inset-0">
                      <ArticleImage src={article.hero_image_url} alt={article.title} />
                      <div
                        className="absolute inset-0 opacity-15"
                        style={{
                          backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                          `,
                          backgroundSize: "40px 40px",
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>
                    <div className="absolute inset-0 p-5 flex flex-col justify-end">
                      <span className="inline-block px-3 py-1 rounded text-xs font-bold tracking-wider w-fit mb-2 bg-black/60 text-white uppercase">
                        {CATEGORIES[article.category]?.label || article.category}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-[#22c55e] transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            ))}
          </div>

          {/* Right — Top Headlines */}
          <FadeIn direction="right" className="lg:col-span-3">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-5 h-full">
              <h3 className="text-lg font-bold text-white mb-5">Top Headlines</h3>
              <div className="space-y-4">
                {headlineArticles.map((article) => (
                  <Link key={article.id} href={`/blog/${article.slug}`}>
                    <div className="group flex items-start gap-3 py-2 cursor-pointer">
                      <span
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{
                          backgroundColor: CATEGORIES[article.category]?.accent || "#22c55e",
                        }}
                      />
                      <span className="text-sm text-gray-300 group-hover:text-[#22c55e] transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
