"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Eye,
  Gauge,
  TrendingUp,
  Clock,
  Cpu,
  RefreshCw,
  Play,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopicProposal {
  id: string;
  title: string;
  source: string;
  trendingScore: number;
}

const PLACEHOLDER_PROPOSALS: TopicProposal[] = [
  {
    id: "1",
    title: "OpenAI annuncia il nuovo modello GPT-4.5 con capacita' di ragionamento avanzate",
    source: "TechCrunch",
    trendingScore: 98,
  },
  {
    id: "2",
    title: "La strategia AI di Apple: processing on-device incontra l'intelligenza cloud",
    source: "The Verge",
    trendingScore: 85,
  },
  {
    id: "3",
    title: "L'ascesa dell'AI Open Source: Llama 3 e' il punto di svolta?",
    source: "Wired",
    trendingScore: 72,
  },
];

const PIPELINE_STEPS = [
  { name: "Perplexity (Discovery)", status: "idle" as const, progress: 100 },
  { name: "Kimi (Structuring)", status: "processing" as const, progress: 65 },
  { name: "Claude (Drafting)", status: "waiting" as const, progress: 0 },
  { name: "Gemini (Review)", status: "waiting" as const, progress: 0 },
];

function getTrendingColor(score: number) {
  if (score >= 90) return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  if (score >= 80) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
  return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
}

function getStatusColor(status: "idle" | "processing" | "waiting") {
  switch (status) {
    case "idle": return "text-green-600 dark:text-green-400";
    case "processing": return "text-blue-600 dark:text-blue-400";
    case "waiting": return "text-muted-foreground";
  }
}

function getStatusLabel(status: "idle" | "processing" | "waiting") {
  switch (status) {
    case "idle": return "Idle";
    case "processing": return "Processing...";
    case "waiting": return "In attesa";
  }
}

function getProgressColor(status: "idle" | "processing" | "waiting") {
  switch (status) {
    case "idle": return "bg-primary";
    case "processing": return "bg-blue-500";
    case "waiting": return "bg-gray-400";
  }
}

export default function DashboardPage() {
  const [countdown, setCountdown] = useState(45 * 60 + 12);
  const [articleTotal, setArticleTotal] = useState<number | null>(null);
  const [crawlLoading, setCrawlLoading] = useState(false);
  const [crawlMessage, setCrawlMessage] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("/api/articles?limit=1")
      .then((res) => res.json())
      .then((json: { total?: number }) => {
        if (typeof json.total === "number") {
          setArticleTotal(json.total);
        }
      })
      .catch(() => {
        // silently ignore — placeholder will be shown
      });
  }, []);

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  async function handleCrawl() {
    setCrawlLoading(true);
    setCrawlMessage(null);
    try {
      const res = await fetch("/api/cron/generate-ideas", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET ?? ""}`,
        },
      });
      if (res.ok) {
        setCrawlMessage("Crawl avviato con successo.");
      } else {
        setCrawlMessage("Errore nell'avvio del crawl.");
      }
    } catch {
      setCrawlMessage("Errore di rete.");
    } finally {
      setCrawlLoading(false);
    }
  }

  return (
    <>
      <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-card px-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
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
                      <h3 className="text-sm font-medium text-muted-foreground">Articoli Totali</h3>
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-2 text-2xl font-bold">
                      {articleTotal !== null ? articleTotal.toLocaleString("it-IT") : "—"}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      <span>+12 questa settimana</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">Visualizzazioni</h3>
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-2 text-2xl font-bold">45.2K</p>
                    <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      <span>+5.4% vs mese scorso</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">Freshness Score</h3>
                      <Gauge className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-2 text-2xl font-bold">92/100</p>
                    <p className="mt-2 text-sm text-muted-foreground">Eccellente</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Topic Proposals */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Proposte Topic (Perplexity AI)</h2>
                <Button variant="link" className="text-sm text-primary">
                  Vedi Tutti
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {PLACEHOLDER_PROPOSALS.map((proposal) => (
                  <Card key={proposal.id} className="flex flex-col">
                    <CardContent className="flex flex-1 flex-col p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <Badge className={getTrendingColor(proposal.trendingScore)} variant="secondary">
                          Trending: {proposal.trendingScore}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Fonte: {proposal.source}
                        </span>
                      </div>
                      <h3 className="mb-3 flex-1 text-sm font-medium leading-snug line-clamp-3">
                        {proposal.title}
                      </h3>
                      <Button variant="outline" className="mt-auto w-full hover:bg-primary hover:text-primary-foreground">
                        Seleziona per Sviluppo
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                    Prossimo Crawl Automatico
                  </h3>
                  <div className="flex items-center text-lg font-bold">
                    <Clock className="mr-2 h-5 w-5 text-primary" />
                    {formatCountdown(countdown)}
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleCrawl}
                    disabled={crawlLoading}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {crawlLoading ? "Avvio in corso..." : "Esegui Crawl"}
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
