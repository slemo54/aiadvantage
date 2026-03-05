"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, RefreshCw, Lightbulb } from "lucide-react";
import { IdeaCard } from "@/components/admin/idea-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Idea } from "@/lib/types";

// ─── Placeholder data ────────────────────────────────────────────────────────

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
  {
    id: "3",
    topic: "Costruire RAG systems con Supabase e Next.js",
    source_url: "https://supabase.com",
    freshness_score: 95,
    status: "selected",
    category: "tutorial",
    perplexity_research: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "4",
    topic: "Come i modelli multimodali stanno cambiando il design",
    source_url: null,
    freshness_score: 79,
    status: "used",
    category: "casi_duso",
    perplexity_research: null,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "5",
    topic: "Gemini 2.0 Flash: il modello piu' veloce per produzione",
    source_url: "https://deepmind.google",
    freshness_score: 97,
    status: "new",
    category: "ai_news",
    perplexity_research: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "6",
    topic: "Accessibilita' web con AI: strumenti e best practice",
    source_url: null,
    freshness_score: 83,
    status: "selected",
    category: "web_dev",
    perplexity_research: null,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "7",
    topic: "L'AI non puo' sostituire la creativita' umana: mito o realta'?",
    source_url: null,
    freshness_score: 75,
    status: "used",
    category: "opinioni",
    perplexity_research: null,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

type IdeaStatus = Idea["status"] | "all";

const STATUS_FILTERS: { value: IdeaStatus; label: string }[] = [
  { value: "all", label: "Tutte" },
  { value: "new", label: "Nuove" },
  { value: "selected", label: "Selezionate" },
  { value: "rejected", label: "Rifiutate" },
  { value: "used", label: "Usate" },
];

interface IdeasApiResponse {
  ideas?: Idea[];
  total?: number;
  note?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>(PLACEHOLDER_IDEAS);
  const [activeFilter, setActiveFilter] = useState<IdeaStatus>("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    try {
      const res = await fetch("/api/ideas");
      const data: IdeasApiResponse = await res.json();
      if (data.ideas && Array.isArray(data.ideas) && data.ideas.length > 0) {
        setIdeas(data.ideas);
      }
    } catch {
      // keep placeholder data on network error
    }
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const counts: Record<IdeaStatus, number> = {
    all: ideas.length,
    new: ideas.filter((i) => i.status === "new").length,
    selected: ideas.filter((i) => i.status === "selected").length,
    rejected: ideas.filter((i) => i.status === "rejected").length,
    used: ideas.filter((i) => i.status === "used").length,
  };

  const filtered =
    activeFilter === "all" ? ideas : ideas.filter((i) => i.status === activeFilter);

  async function handleSelect(id: string) {
    setSelectingId(id);
    try {
      const res = await fetch(`/api/ideas/${id}/select`, { method: "POST" });
      if (res.ok) {
        setIdeas((prev) =>
          prev.map((idea) =>
            idea.id === id ? { ...idea, status: "selected" as const } : idea
          )
        );
      }
    } catch {
      // silently ignore
    } finally {
      setSelectingId(null);
    }
  }

  async function handleGenerateIdeas() {
    setIsGenerating(true);
    try {
      await fetch("/api/admin/cron-trigger", {
        method: "POST",
        credentials: "include",
      });
      // Refetch ideas after generation to pick up any new entries from DB
      await fetchIdeas();
    } catch {
      // silently fail in demo mode
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Idee &amp; Topic</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestisci le idee generate dalla pipeline Perplexity
          </p>
        </div>
        <Button
          className="shrink-0 gap-2"
          disabled={isGenerating}
          onClick={handleGenerateIdeas}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Genera Nuove Idee
        </Button>
      </header>

      {/* Status counters */}
      <div className="flex flex-wrap items-center gap-2">
        <Lightbulb className="h-4 w-4 text-muted-foreground" />
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={[
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              activeFilter === f.value
                ? "border-indigo-500 bg-indigo-500 text-white"
                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
            ].join(" ")}
          >
            {f.label}
            <Badge
              variant="secondary"
              className={[
                "h-5 min-w-[20px] px-1.5 text-xs",
                activeFilter === f.value ? "bg-white/20 text-white" : "",
              ].join(" ")}
            >
              {counts[f.value]}
            </Badge>
          </button>
        ))}
      </div>

      {/* Ideas grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border py-16 text-center text-muted-foreground">
          Nessuna idea in questa categoria.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onSelect={handleSelect}
              isSelecting={selectingId === idea.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
