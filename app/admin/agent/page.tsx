"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  FileText,
  PenTool,
  Sparkles,
  Send,
  ChevronRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Circle,
  Play,
  ArrowRight,
  BookOpen,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/admin/status-badge";
import { CATEGORIES } from "@/lib/constants";
import { getNextState } from "@/lib/ai/pipeline";
import type { WorkflowState, CategoryKey } from "@/lib/constants";

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

interface IdeaFromApi {
  id: string;
  topic: string;
}

interface IdeasApiResponse {
  ideas: IdeaFromApi[];
  total: number;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const PIPELINE_STEPS = [
  {
    id: "researching",
    label: "Perplexity",
    sublabel: "Discovery",
    Icon: Search,
  },
  {
    id: "drafting",
    label: "Kimi",
    sublabel: "Structuring",
    Icon: FileText,
  },
  {
    id: "humanizing",
    label: "Claude",
    sublabel: "Drafting",
    Icon: PenTool,
  },
  {
    id: "reviewing",
    label: "Gemini",
    sublabel: "Review",
    Icon: Sparkles,
  },
  {
    id: "ready",
    label: "Pubblica",
    sublabel: "Publish",
    Icon: Send,
  },
] as const;

// ─── Helper ─────────────────────────────────────────────────────────────────

function getStepStatus(
  stepId: string,
  articles: PipelineArticle[]
): "idle" | "running" | "done" | "error" {
  const count = articles.filter((a) => a.status === stepId).length;
  if (count > 0) return "running";
  return "idle";
}

function getStepCount(stepId: string, articles: PipelineArticle[]): number {
  return articles.filter((a) => a.status === stepId).length;
}

function StepStatusIcon({
  status,
}: {
  status: "idle" | "running" | "done" | "error";
}) {
  if (status === "running")
    return <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />;
  if (status === "done")
    return <CheckCircle2 className="h-4 w-4 text-green-400" />;
  if (status === "error")
    return <AlertCircle className="h-4 w-4 text-red-400" />;
  return <Circle className="h-4 w-4 text-muted-foreground" />;
}

function formatLogDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("it-IT", {
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
  const [articles, setArticles] = useState<PipelineArticle[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [ideas, setIdeas] = useState<IdeaFromApi[]>([]);
  const [advancingId, setAdvancingId] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [selectedIdea, setSelectedIdea] = useState("");
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Load logs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pipeline_logs");
      if (stored) setLogs(JSON.parse(stored) as ActivityLog[]);
    } catch {
      // ignore parse errors
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
        // ignore storage errors
      }
      return updated;
    });
  }

  const fetchArticles = useCallback(async () => {
    setArticlesLoading(true);
    try {
      // Fetch multiple statuses in parallel
      const [drafting, humanizing, reviewing, ready] = await Promise.all([
        fetch("/api/articles?status=drafting&limit=10").then(
          (r) => r.json() as Promise<ArticlesApiResponse>
        ),
        fetch("/api/articles?status=humanizing&limit=10").then(
          (r) => r.json() as Promise<ArticlesApiResponse>
        ),
        fetch("/api/articles?status=reviewing&limit=10").then(
          (r) => r.json() as Promise<ArticlesApiResponse>
        ),
        fetch("/api/articles?status=ready&limit=10").then(
          (r) => r.json() as Promise<ArticlesApiResponse>
        ),
      ]);
      const combined: PipelineArticle[] = [
        ...(drafting.articles ?? []),
        ...(humanizing.articles ?? []),
        ...(reviewing.articles ?? []),
        ...(ready.articles ?? []),
      ];
      setArticles(combined);
    } catch {
      addLog("Errore nel caricamento degli articoli dal server.", "error");
    } finally {
      setArticlesLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchIdeas = useCallback(async () => {
    try {
      const res = await fetch("/api/ideas?status=new&limit=20");
      if (!res.ok) return;
      const json = (await res.json()) as IdeasApiResponse;
      setIdeas(json.ideas ?? []);
    } catch {
      // silently ignore
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
        addLog(
          `Errore nell'avanzamento di "${article.title}".`,
          "error"
        );
      }
    } catch {
      addLog(`Errore di rete durante l'avanzamento.`, "error");
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
        setArticles((prev) =>
          prev.map((a) =>
            a.id === article.id ? { ...a, status: "published" } : a
          )
        );
        addLog(`"${article.title}" pubblicato con successo!`, "success");
      } else {
        addLog(`Errore nella pubblicazione di "${article.title}".`, "error");
      }
    } catch {
      addLog(`Errore di rete durante la pubblicazione.`, "error");
    } finally {
      setAdvancingId(null);
    }
  }

  async function handleGenerateIdeas() {
    if (!newTopic.trim()) return;
    setIsGeneratingIdeas(true);
    addLog(`Avvio crawl topic tramite Perplexity: "${newTopic}"`);
    try {
      const res = await fetch("/api/admin/cron-trigger", {
        method: "POST",
      });
      if (res.ok) {
        addLog("Ricerca avviata con successo", "success");
        setNewTopic("");
        setTimeout(() => void fetchIdeas(), 3000);
      } else {
        addLog("Errore durante la ricerca topic", "error");
      }
    } catch {
      addLog("Errore di rete durante la ricerca topic", "error");
    } finally {
      setIsGeneratingIdeas(false);
    }
  }

  async function handleGenerateDraft() {
    if (!selectedIdea) return;
    setIsGeneratingDraft(true);
    addLog(`Generazione bozza per idea: ${selectedIdea}`);
    try {
      const res = await fetch("/api/workflow/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId: selectedIdea }),
      });
      if (res.ok) {
        addLog("Bozza generata con successo", "success");
        setSelectedIdea("");
        void fetchArticles();
        void fetchIdeas();
      } else {
        addLog("Errore durante la generazione bozza", "error");
      }
    } catch {
      addLog("Errore di rete durante la generazione bozza", "error");
    } finally {
      setIsGeneratingDraft(false);
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

  const activeArticles = articles.filter((a) => a.status !== "published");

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Pipeline</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestisci il flusso automatizzato Perplexity &rarr; Kimi &rarr; Claude &rarr; Gemini
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
          {articlesLoading ? "..." : `${activeArticles.length} articoli attivi`}
        </Badge>
      </header>

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
                          status === "running"
                            ? "text-indigo-400"
                            : "text-muted-foreground",
                        ].join(" ")}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold">{step.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {step.sublabel}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <StepStatusIcon status={status} />
                      {count > 0 && (
                        <Badge
                          variant="secondary"
                          className="h-5 px-1.5 text-xs"
                        >
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
                            style={{
                              borderColor: category.accent,
                              color: category.accent,
                            }}
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

      {/* Manual Controls */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* 1. Nuova Ricerca Topic */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Search className="h-4 w-4 text-indigo-400" />
              Nuova Ricerca Topic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Inserisci un topic da esplorare con Perplexity..."
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              className="min-h-[80px] resize-none text-sm"
            />
            <Button
              size="sm"
              className="w-full gap-1.5"
              disabled={!newTopic.trim() || isGeneratingIdeas}
              onClick={() => void handleGenerateIdeas()}
            >
              {isGeneratingIdeas ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              Avvia Ricerca
            </Button>
          </CardContent>
        </Card>

        {/* 2. Genera Bozza da Idea */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              Genera Bozza da Idea
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ideas.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Nessuna idea disponibile. Avvia prima una ricerca topic.
              </p>
            ) : (
              <select
                value={selectedIdea}
                onChange={(e) => setSelectedIdea(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Seleziona un&apos;idea...</option>
                {ideas.map((idea) => (
                  <option key={idea.id} value={idea.id}>
                    {idea.topic}
                  </option>
                ))}
              </select>
            )}
            <Button
              size="sm"
              className="w-full gap-1.5"
              disabled={!selectedIdea || isGeneratingDraft || ideas.length === 0}
              onClick={() => void handleGenerateDraft()}
            >
              {isGeneratingDraft ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <PenTool className="h-3.5 w-3.5" />
              )}
              Genera Bozza
            </Button>
          </CardContent>
        </Card>

        {/* 3. Log Attività */}
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
              <p className="text-xs text-muted-foreground">
                Nessuna attivita&apos; registrata.
              </p>
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
