"use client";

import { useState, useEffect, useCallback } from "react";
import { generateIdeasAction } from "@/app/actions/generate-ideas";
import {
  Search,
  FileText,
  PenTool,
  Sparkles,
  Send,
  ChevronRight,
  Loader2,
  Circle,
  ArrowRight,
  Clock,
  Lightbulb,
  LayoutList,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/admin/status-badge";
import { IdeaCard } from "@/components/admin/idea-card";
import { CATEGORIES } from "@/lib/constants";
import { getNextState } from "@/lib/ai/pipeline";
import type { WorkflowState, CategoryKey } from "@/lib/constants";
import type { Idea } from "@/lib/types";

// ─── Types ─────────────────────────────────────────────────────────────────

interface PipelineArticle {
  id: string;
  slug: string;
  title: string;
  status: WorkflowState;
  category: CategoryKey;
  created_at: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "error";
}

interface ArticlesApiResponse {
  articles: PipelineArticle[];
  total: number;
}

interface IdeasApiResponse {
  ideas: Idea[];
  total: number;
}

type IdeaStatus = Idea["status"] | "all";

// ─── Constants ──────────────────────────────────────────────────────────────

const PIPELINE_STEPS = [
  { id: "researching", label: "Perplexity", sublabel: "Discovery", Icon: Search },
  { id: "drafting", label: "Venice AI", sublabel: "Structuring", Icon: FileText },
  { id: "humanizing", label: "Claude", sublabel: "Drafting", Icon: PenTool },
  { id: "reviewing", label: "Gemini", sublabel: "Review", Icon: Sparkles },
  { id: "ready", label: "Pubblica", sublabel: "Publish", Icon: Send },
] as const;

const IDEA_STATUS_FILTERS: { value: IdeaStatus; label: string }[] = [
  { value: "all", label: "Tutte" },
  { value: "new", label: "Nuove" },
  { value: "selected", label: "Selezionate" },
  { value: "rejected", label: "Rifiutate" },
  { value: "used", label: "Usate" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStepStatus(stepId: string, articles: PipelineArticle[]): "idle" | "running" {
  return articles.some((a) => a.status === stepId) ? "running" : "idle";
}

function getStepCount(stepId: string, articles: PipelineArticle[]): number {
  return articles.filter((a) => a.status === stepId).length;
}

function StepStatusIcon({ status }: { status: "idle" | "running" }) {
  if (status === "running") return <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />;
  return <Circle className="h-4 w-4 text-muted-foreground" />;
}

function formatLogDate(iso: string) {
  return new Date(iso).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AgentPage() {
  // Articles in pipeline
  const [articles, setArticles] = useState<PipelineArticle[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [totalArticles, setTotalArticles] = useState<number | null>(null);

  // Ideas
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(true);
  const [ideaFilter, setIdeaFilter] = useState<IdeaStatus>("all");
  const [selectingId, setSelectingId] = useState<string | null>(null);

  // Actions
  const [advancingId, setAdvancingId] = useState<string | null>(null);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);

  // Logs
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pipeline_logs");
      if (stored) setLogs(JSON.parse(stored) as ActivityLog[]);
    } catch {
      // ignore
    }
  }, []);

  function addLog(message: string, type: ActivityLog["type"] = "info") {
    const entry: ActivityLog = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      message,
      type,
    };
    setLogs((prev) => {
      const updated = [entry, ...prev].slice(0, 50);
      try {
        localStorage.setItem("pipeline_logs", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }

  const fetchArticles = useCallback(async () => {
    setArticlesLoading(true);
    try {
      const [drafting, humanizing, reviewing, ready, total] = await Promise.all([
        fetch("/api/articles?status=drafting&limit=10").then((r) => r.json() as Promise<ArticlesApiResponse>),
        fetch("/api/articles?status=humanizing&limit=10").then((r) => r.json() as Promise<ArticlesApiResponse>),
        fetch("/api/articles?status=reviewing&limit=10").then((r) => r.json() as Promise<ArticlesApiResponse>),
        fetch("/api/articles?status=ready&limit=10").then((r) => r.json() as Promise<ArticlesApiResponse>),
        fetch("/api/articles?limit=1").then((r) => r.json() as Promise<ArticlesApiResponse>),
      ]);
      setArticles([
        ...(drafting.articles ?? []),
        ...(humanizing.articles ?? []),
        ...(reviewing.articles ?? []),
        ...(ready.articles ?? []),
      ]);
      setTotalArticles(total.total ?? null);
    } catch {
      addLog("Errore nel caricamento degli articoli.", "error");
    } finally {
      setArticlesLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchIdeas = useCallback(async () => {
    setIdeasLoading(true);
    try {
      const res = await fetch("/api/ideas?limit=50");
      if (!res.ok) return;
      const json = (await res.json()) as IdeasApiResponse;
      setIdeas(json.ideas ?? []);
    } catch {
      // silently ignore
    } finally {
      setIdeasLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchArticles();
    void fetchIdeas();
  }, [fetchArticles, fetchIdeas]);

  async function handleAdvance(article: PipelineArticle) {
    const next = getNextState(article.status);
    if (!next) return;
    setAdvancingId(article.id);
    addLog(`Avanzamento "${article.title}": ${article.status} → ${next}`);
    try {
      const res = await fetch(`/api/articles/${article.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === article.id ? { ...a, status: next } : a))
        );
        addLog(`"${article.title}" ora e' in stato: ${next}`, "success");
      } else {
        addLog(`Errore nell'avanzamento di "${article.title}".`, "error");
      }
    } catch {
      addLog("Errore di rete durante l'avanzamento.", "error");
    } finally {
      setAdvancingId(null);
    }
  }

  async function handlePublish(article: PipelineArticle) {
    setAdvancingId(article.id);
    addLog(`Pubblicazione di "${article.title}"...`);
    try {
      const res = await fetch(`/api/articles/${article.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "published",
          published_at: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== article.id));
        addLog(`"${article.title}" pubblicato con successo!`, "success");
      } else {
        addLog(`Errore nella pubblicazione di "${article.title}".`, "error");
      }
    } catch {
      addLog("Errore di rete durante la pubblicazione.", "error");
    } finally {
      setAdvancingId(null);
    }
  }

  async function handleSelectIdea(id: string) {
    setSelectingId(id);
    const idea = ideas.find((i) => i.id === id);
    addLog(`Avvio pipeline per idea: "${idea?.topic ?? id}"`);
    try {
      const res = await fetch(`/api/ideas/${id}/select`, { method: "POST" });
      if (res.ok) {
        setIdeas((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: "selected" as const } : i))
        );
        addLog("Idea selezionata, pipeline avviata.", "success");
        setTimeout(() => void fetchArticles(), 2000);
      } else {
        addLog("Errore durante la selezione dell'idea.", "error");
      }
    } catch {
      addLog("Errore di rete durante la selezione.", "error");
    } finally {
      setSelectingId(null);
    }
  }

  async function handleGenerateIdeas() {
    setIsGeneratingIdeas(true);
    addLog("Avvio generazione idee con Perplexity...");
    try {
      const result = await generateIdeasAction();
      if (result.success) {
        addLog("Nuove idee generate con successo.", "success");
        setTimeout(() => void fetchIdeas(), 2000);
      } else {
        addLog("Errore durante la generazione idee.", "error");
      }
    } catch {
      addLog("Errore di rete durante la generazione idee.", "error");
    } finally {
      setIsGeneratingIdeas(false);
    }
  }

  function clearLogs() {
    setLogs([]);
    try {
      localStorage.removeItem("pipeline_logs");
    } catch {
      // ignore
    }
  }

  // Computed
  const activeArticles = articles.filter((a) => a.status !== "published");
  const ideasInQueue = ideas.filter((i) => i.status === "new").length;
  const ideasInPipeline = activeArticles.length;

  const ideaCounts: Record<IdeaStatus, number> = {
    all: ideas.length,
    new: ideas.filter((i) => i.status === "new").length,
    selected: ideas.filter((i) => i.status === "selected").length,
    rejected: ideas.filter((i) => i.status === "rejected").length,
    used: ideas.filter((i) => i.status === "used").length,
  };

  const filteredIdeas =
    ideaFilter === "all" ? ideas : ideas.filter((i) => i.status === ideaFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Perplexity &rarr; Venice AI &rarr; Claude &rarr; Gemini
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
          {articlesLoading ? "..." : `${activeArticles.length} articoli attivi`}
        </Badge>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Articoli Totali</p>
              <p className="mt-1 text-2xl font-bold">
                {totalArticles !== null ? totalArticles : "—"}
              </p>
            </div>
            <FileText className="h-8 w-8 text-muted-foreground/40" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Idee in Coda</p>
              <p className="mt-1 text-2xl font-bold">
                {ideasLoading ? "—" : ideasInQueue}
              </p>
            </div>
            <Lightbulb className="h-8 w-8 text-muted-foreground/40" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">In Pipeline</p>
              <p className="mt-1 text-2xl font-bold">
                {articlesLoading ? "—" : ideasInPipeline}
              </p>
            </div>
            <LayoutList className="h-8 w-8 text-muted-foreground/40" />
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Visualizer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stato Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-0 overflow-x-auto pb-2">
            {PIPELINE_STEPS.map((step, idx) => {
              const status = getStepStatus(step.id, articles);
              const count = getStepCount(step.id, articles);
              const { Icon } = step;
              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={[
                      "flex min-w-[120px] flex-col items-center gap-2 rounded-xl border p-4 transition-colors",
                      status === "running"
                        ? "border-indigo-500/50 bg-indigo-500/10"
                        : "border-border bg-card",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        status === "running" ? "bg-indigo-500/20" : "bg-muted",
                      ].join(" ")}
                    >
                      <Icon
                        className={[
                          "h-5 w-5",
                          status === "running" ? "text-indigo-400" : "text-muted-foreground",
                        ].join(" ")}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold">{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.sublabel}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <StepStatusIcon status={status} />
                      {count > 0 && (
                        <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                          {count}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {idx < PIPELINE_STEPS.length - 1 && (
                    <ChevronRight className="mx-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Articles in Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Articoli in Lavorazione</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {articlesLoading ? (
            <div className="flex items-center gap-2 px-6 py-10 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Caricamento articoli...
            </div>
          ) : activeArticles.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              Nessun articolo in lavorazione.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {activeArticles.map((article) => {
                const category = CATEGORIES[article.category];
                const next = getNextState(article.status);
                const isAdvancing = advancingId === article.id;

                return (
                  <div
                    key={article.id}
                    className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate font-medium">{article.title}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={article.status} />
                        {category && (
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{ borderColor: category.accent, color: category.accent }}
                          >
                            {category.label}
                          </Badge>
                        )}
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(article.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {article.status === "ready" ? (
                        <Button
                          size="sm"
                          className="gap-1.5 bg-green-600 hover:bg-green-700"
                          disabled={isAdvancing}
                          onClick={() => void handlePublish(article)}
                        >
                          {isAdvancing ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="h-3.5 w-3.5" />
                          )}
                          Pubblica
                        </Button>
                      ) : (
                        next && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            disabled={isAdvancing}
                            onClick={() => void handleAdvance(article)}
                          >
                            {isAdvancing ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <ArrowRight className="h-3.5 w-3.5" />
                            )}
                            Avanza
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ideas Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Idee Disponibili</CardTitle>
          <div className="flex flex-wrap gap-1.5">
            {IDEA_STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setIdeaFilter(f.value)}
                className={[
                  "flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                  ideaFilter === f.value
                    ? "border-indigo-500 bg-indigo-500 text-white"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
                ].join(" ")}
              >
                {f.label}
                <Badge
                  variant="secondary"
                  className={[
                    "h-4 min-w-[16px] px-1 text-[10px]",
                    ideaFilter === f.value ? "bg-white/20 text-white" : "",
                  ].join(" ")}
                >
                  {ideaCounts[f.value]}
                </Badge>
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {ideasLoading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Caricamento idee...
            </div>
          ) : filteredIdeas.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Nessuna idea in questa categoria.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onSelect={handleSelectIdea}
                  isSelecting={selectingId === idea.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Genera Nuove Idee */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Search className="h-4 w-4 text-indigo-400" />
              Genera Nuove Idee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-xs text-muted-foreground">
              Avvia Perplexity per scoprire nuovi topic sull&apos;AI da trasformare in articoli.
            </p>
            <Button
              size="sm"
              className="w-full gap-1.5"
              disabled={isGeneratingIdeas}
              onClick={() => void handleGenerateIdeas()}
            >
              {isGeneratingIdeas ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {isGeneratingIdeas ? "Generazione in corso..." : "Genera con Perplexity"}
            </Button>
          </CardContent>
        </Card>

        {/* Log Attività */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-indigo-400" />
              Log Attività
            </CardTitle>
            {logs.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={clearLogs}
              >
                Svuota
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nessuna attivita&apos; registrata.</p>
            ) : (
              <ul className="max-h-[120px] space-y-1 overflow-y-auto">
                {logs.map((log) => (
                  <li key={log.id} className="flex items-start gap-2 text-xs">
                    <span className="shrink-0 font-mono text-muted-foreground">
                      {formatLogDate(log.timestamp)}
                    </span>
                    <span
                      className={
                        log.type === "success"
                          ? "text-green-400"
                          : log.type === "error"
                            ? "text-red-400"
                            : "text-foreground"
                      }
                    >
                      {log.message}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
