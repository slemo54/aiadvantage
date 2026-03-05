"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Eye,
  Gauge,
  TrendingUp,
  Clock,
  Cpu,
  RefreshCw,
  Play,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CategoryKey, WorkflowState } from "@/lib/constants";
import { CATEGORIES } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IdeaFromApi {
  id: string;
  topic: string;
  freshness_score: number;
  category: CategoryKey;
  source_url: string | null;
  status: string;
  created_at: string;
}

interface IdeasResponse {
  ideas: IdeaFromApi[];
  total: number;
  note?: string;
}

interface ArticlesResponse {
  articles: unknown[];
  total: number;
}

// ─── Pipeline steps (static config — status comes from real data) ─────────────

const PIPELINE_STEPS: Array<{
  name: string;
  status: "idle" | "processing" | "waiting";
  progress: number;
}> = [
  { name: "Perplexity (Discovery)", status: "idle", progress: 100 },
  { name: "Kimi (Structuring)", status: "waiting", progress: 0 },
  { name: "Claude (Drafting)", status: "waiting", progress: 0 },
  { name: "Gemini (Review)", status: "waiting", progress: 0 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTrendingColor(score: number) {
  if (score >= 90)
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  if (score >= 80)
    return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
  return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
}

function getStatusColor(status: "idle" | "processing" | "waiting") {
  switch (status) {
    case "idle":
      return "text-green-600 dark:text-green-400";
    case "processing":
      return "text-blue-600 dark:text-blue-400";
    case "waiting":
      return "text-muted-foreground";
  }
}

function getStatusLabel(status: "idle" | "processing" | "waiting") {
  switch (status) {
    case "idle":
      return "Idle";
    case "processing":
      return "Processing...";
    case "waiting":
      return "In attesa";
  }
}

function getProgressColor(status: "idle" | "processing" | "waiting") {
  switch (status) {
    case "idle":
      return "bg-primary";
    case "processing":
      return "bg-blue-500";
    case "waiting":
      return "bg-gray-400";
  }
}

// ─── Article counts by status ─────────────────────────────────────────────────

type StatusCounts = Partial<Record<WorkflowState, number>>;

// ─── Main component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [articleTotal, setArticleTotal] = useState<number | null>(null);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({});
  const [ideas, setIdeas] = useState<IdeaFromApi[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(true);
  const [ideasError, setIdeasError] = useState<string | null>(null);
  const [crawlLoading, setCrawlLoading] = useState(false);
  const [crawlMessage, setCrawlMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Fetch total article count
    fetch("/api/articles?limit=1")
      .then((res) => res.json())
      .then((json: ArticlesResponse) => {
        if (typeof json.total === "number") {
          setArticleTotal(json.total);
        }
      })
      .catch(() => {
        // silently ignore
      });

    // Fetch status breakdown — published articles
    fetch("/api/articles?status=published&limit=1")
      .then((res) => res.json())
      .then((json: ArticlesResponse) => {
        setStatusCounts((prev) => ({ ...prev, published: json.total ?? 0 }));
      })
      .catch(() => {});

    // Fetch new ideas from API
    setIdeasLoading(true);
    setIdeasError(null);
    try {
      const res = await fetch("/api/ideas?status=new&limit=3");
      if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
      const json = (await res.json()) as IdeasResponse;
      setIdeas(json.ideas ?? []);
    } catch (err) {
      setIdeasError(
        err instanceof Error ? err.message : "Errore nel caricamento delle idee."
      );
    } finally {
      setIdeasLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  async function handleCrawl() {
    setCrawlLoading(true);
    setCrawlMessage(null);
    try {
      const res = await fetch("/api/admin/cron-trigger", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setCrawlMessage("Crawl avviato con successo. Le nuove idee appariranno a breve.");
        // Refresh ideas after a short delay
        setTimeout(() => void fetchData(), 3000);
      } else {
        const body = (await res.json()) as { error?: string };
        setCrawlMessage(body.error ?? "Errore nell'avvio del crawl.");
      }
    } catch {
      setCrawlMessage("Errore di rete.");
    } finally {
      setCrawlLoading(false);
    }
  }

  async function handleSelectIdea(ideaId: string) {
    try {
      const res = await fetch(`/api/ideas/${ideaId}/select`, { method: "POST" });
      if (res.ok) {
        setIdeas((prev) => prev.filter((i) => i.id !== ideaId));
      }
    } catch {
      // silently ignore
    }
  }

  return (
    <>
      <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-card px-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => void fetchData()}
            title="Aggiorna dati"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-6 xl:flex-row">
          {/* Main content */}
          <div className="flex-1 space-y-6">
            {/* Content Overview */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">Panoramica Contenuti</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Articoli Totali
                      </h3>
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-2 text-2xl font-bold">
                      {articleTotal !== null
                        ? articleTotal.toLocaleString("it-IT")
                        : "—"}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      <span>
                        {statusCounts.published !== undefined
                          ? `${statusCounts.published} pubblicati`
                          : "Caricamento..."}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Idee in Coda
                      </h3>
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-2 text-2xl font-bold">
                      {ideasLoading ? "—" : ideas.length}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Con stato &ldquo;new&rdquo;
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Freshness Score
                      </h3>
                      <Gauge className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-2 text-2xl font-bold">
                      {ideas.length > 0
                        ? `${Math.round(
                            ideas.reduce((acc, i) => acc + i.freshness_score, 0) /
                              ideas.length
                          )}/100`
                        : "—"}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Media sulle idee recenti
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Topic Proposals (real ideas from API) */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Proposte Topic (Perplexity AI)
                </h2>
                <Button
                  variant="link"
                  className="text-sm text-primary"
                  onClick={() => void fetchData()}
                >
                  Aggiorna
                </Button>
              </div>

              {ideasLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Caricamento idee...
                </div>
              ) : ideasError ? (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {ideasError}
                </div>
              ) : ideas.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p className="text-sm text-muted-foreground">
                      Nessuna proposta disponibile. Avvia un crawl per generare
                      nuove idee.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {ideas.map((idea) => {
                    const category = CATEGORIES[idea.category];
                    return (
                      <Card key={idea.id} className="flex flex-col">
                        <CardContent className="flex flex-1 flex-col p-4">
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <Badge
                              className={getTrendingColor(idea.freshness_score)}
                              variant="secondary"
                            >
                              Score: {idea.freshness_score}
                            </Badge>
                            {category && (
                              <span
                                className="text-xs font-medium"
                                style={{ color: category.accent }}
                              >
                                {category.label}
                              </span>
                            )}
                          </div>
                          <h3 className="mb-3 flex-1 text-sm font-medium leading-snug line-clamp-3">
                            {idea.topic}
                          </h3>
                          {idea.source_url && (
                            <p className="mb-2 truncate text-xs text-muted-foreground">
                              {idea.source_url}
                            </p>
                          )}
                          <Button
                            variant="outline"
                            className="mt-auto w-full hover:bg-primary hover:text-primary-foreground"
                            onClick={() => void handleSelectIdea(idea.id)}
                          >
                            Seleziona per Sviluppo
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar - AI Pipeline Status */}
          <aside className="w-full xl:w-80">
            <Card>
              <CardContent className="p-5">
                <h2 className="mb-4 flex items-center text-base font-semibold">
                  <Cpu className="mr-2 h-5 w-5 text-primary" />
                  Stato AI Pipeline
                </h2>
                <div className="space-y-4">
                  {PIPELINE_STEPS.map((step) => (
                    <div key={step.name}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium">{step.name}</span>
                        <span className={getStatusColor(step.status)}>
                          {getStatusLabel(step.status)}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className={`h-2 rounded-full transition-all ${getProgressColor(step.status)}`}
                          style={{ width: `${step.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    Prossima Generazione Automatica
                  </h3>
                  <div className="flex items-center text-sm text-foreground">
                    <Clock className="mr-2 h-4 w-4 text-primary" />
                    Ogni 3 giorni (automatico)
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => void handleCrawl()}
                    disabled={crawlLoading}
                  >
                    {crawlLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="mr-2 h-4 w-4" />
                    )}
                    {crawlLoading ? "Avvio in corso..." : "Esegui Crawl Ora"}
                  </Button>
                  {crawlMessage && (
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                      {crawlMessage}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
