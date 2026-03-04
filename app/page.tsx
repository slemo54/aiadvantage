import { ArticleCard } from "@/components/blog/article-card";
import { CATEGORIES } from "@/lib/constants";
import type { Article } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

// Placeholder articles for development
const PLACEHOLDER_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Come usare l'AI per automatizzare il tuo workflow editoriale",
    slug: "ai-workflow-editoriale",
    content_html: null,
    status: "published",
    category: "casi_duso",
    freshness_score: 95,
    hero_image_url: null,
    meta_description: "Scopri come automatizzare la creazione di contenuti con AI",
    keywords: ["AI", "workflow", "automazione"],
    published_at: "2025-01-15T10:00:00Z",
    created_at: "2025-01-14T08:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "I migliori strumenti AI del 2025 per sviluppatori web",
    slug: "strumenti-ai-2025-sviluppatori",
    content_html: null,
    status: "published",
    category: "tools",
    freshness_score: 90,
    hero_image_url: null,
    meta_description: "La lista definitiva dei tool AI per il web development",
    keywords: ["tools", "AI", "sviluppo web"],
    published_at: "2025-01-12T10:00:00Z",
    created_at: "2025-01-11T08:00:00Z",
    updated_at: "2025-01-12T10:00:00Z",
  },
  {
    id: "3",
    title: "GPT-5 è in arrivo: cosa sappiamo e cosa aspettarci",
    slug: "gpt-5-cosa-sappiamo",
    content_html: null,
    status: "published",
    category: "ai_news",
    freshness_score: 85,
    hero_image_url: null,
    meta_description: "Le ultime notizie su GPT-5 e le previsioni degli esperti",
    keywords: ["GPT-5", "OpenAI", "news"],
    published_at: "2025-01-10T10:00:00Z",
    created_at: "2025-01-09T08:00:00Z",
    updated_at: "2025-01-10T10:00:00Z",
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Il Vantaggio dell&apos;AI
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Casi d&apos;uso reali, tutorial, strumenti e opinioni su come
          l&apos;intelligenza artificiale sta trasformando il mondo.
        </p>
      </section>

      <section className="mb-8 flex flex-wrap justify-center gap-2">
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <Badge key={key} variant="outline" className="cursor-pointer hover:bg-accent">
            {cat.label}
          </Badge>
        ))}
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLACEHOLDER_ARTICLES.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </section>
    </div>
  );
}
