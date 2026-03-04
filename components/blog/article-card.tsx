import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/constants";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const category = CATEGORIES[article.category];

  return (
    <Link href={`/blog/${article.slug}`}>
      <Card className="h-full transition-colors hover:bg-accent/50">
        {article.hero_image_url && (
          <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.hero_image_url}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        {!article.hero_image_url && (
          <div
            className="flex aspect-video items-center justify-center rounded-t-lg"
            style={{ backgroundColor: `${category.accent}20` }}
          >
            <span className="text-3xl font-bold" style={{ color: category.accent }}>
              {category.label}
            </span>
          </div>
        )}
        <CardHeader className="pb-2">
          <Badge
            variant="outline"
            className="w-fit text-xs"
            style={{ borderColor: category.accent, color: category.accent }}
          >
            {category.label}
          </Badge>
        </CardHeader>
        <CardContent>
          <h3 className="mb-2 line-clamp-2 font-semibold leading-tight">
            {article.title}
          </h3>
          {article.meta_description && (
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {article.meta_description}
            </p>
          )}
          {article.published_at && (
            <p className="text-xs text-muted-foreground">
              {formatDate(article.published_at)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
