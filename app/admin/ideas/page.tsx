import { IdeaCard } from "@/components/admin/idea-card";
import type { Idea } from "@/lib/types";

const PLACEHOLDER_IDEAS: Idea[] = [
  {
    id: "1",
    topic: "Come Claude Code sta cambiando lo sviluppo software",
    source_url: "https://example.com",
    freshness_score: 92,
    status: "new",
    category: "tools",
    perplexity_research: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    topic: "AI Act europeo: impatto sulle startup italiane",
    source_url: null,
    freshness_score: 88,
    status: "new",
    category: "ai_news",
    perplexity_research: null,
    created_at: new Date().toISOString(),
  },
];

export default function IdeasPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Idee & Topic</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLACEHOLDER_IDEAS.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>
    </div>
  );
}
