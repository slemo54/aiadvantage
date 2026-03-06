"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  PenTool,
  Trash2,
  ExternalLink,
  RefreshCw,
  Loader2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/admin/status-badge";
import type { Article } from "@/lib/types";
import type { WorkflowState } from "@/lib/constants";

interface ArticlesApiResponse {
  articles: Article[];
  total: number;
}

const STATUS_TABS: { label: string; value: WorkflowState | "all" }[] = [
  { label: "Tutti", value: "all" },
  { label: "Pubblicati", value: "published" },
  { label: "In revisione", value: "reviewing" },
  { label: "Pronti", value: "ready" },
  { label: "Bozze", value: "drafting" },
];

export default function AdminBlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<WorkflowState | "all">("published");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const statuses: (WorkflowState | "all")[] =
        activeTab === "all"
          ? ["drafting", "humanizing", "reviewing", "ready", "published"]
          : [activeTab];

      const results = await Promise.all(
        statuses.map((s) =>
          fetch(`/api/articles?status=${s}&limit=100`)
            .then((r) => r.json() as Promise<ArticlesApiResponse>)
            .then((d) => d.articles ?? [])
        )
      );
      setArticles(results.flat());
    } catch (err) {
      setError(`Errore caricamento: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    void fetchArticles();
  }, [fetchArticles]);

  async function handleDelete(slug: string) {
    if (!confirm(`Eliminare "${slug}"? Azione irreversibile.`)) return;
    setDeleting(slug);
    try {
      const res = await fetch(`/api/articles/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.slug !== slug));
      } else {
        alert("Errore nell'eliminazione.");
      }
    } finally {
      setDeleting(null);
    }
  }

  const filtered = articles.filter((a) =>
    search.trim() === "" ||
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight">Storico Blog</h1>
        <Button variant="outline" size="sm" onClick={() => void fetchArticles()} disabled={loading}>
          {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}
          Aggiorna
        </Button>
      </header>

      {/* Tabs + Search */}
      <div className="flex flex-col gap-3 border-b border-border bg-card/50 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca per titolo o slug..."
            className="h-8 pl-8 text-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {error && (
          <p className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-500">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-muted-foreground">Nessun articolo trovato.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((article) => (
              <div
                key={article.slug}
                className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-accent/20"
              >
                {/* Image thumbnail */}
                {article.hero_image_url ? (
                  <img
                    src={article.hero_image_url}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded-md bg-muted" />
                )}

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{article.title}</p>
                  <p className="truncate text-xs text-muted-foreground">/blog/{article.slug}</p>
                </div>

                {/* Status */}
                <StatusBadge status={article.status} />

                {/* Date */}
                <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" })
                    : new Date(article.created_at).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" })}
                </span>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  <Link href={`/admin/editor?slug=${article.slug}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Modifica">
                      <PenTool className="h-4 w-4" />
                    </Button>
                  </Link>
                  {article.status === "published" && (
                    <a href={`/blog/${article.slug}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Visualizza sul sito">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    title="Elimina"
                    disabled={deleting === article.slug}
                    onClick={() => void handleDelete(article.slug)}
                  >
                    {deleting === article.slug ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer count */}
      {!loading && (
        <div className="border-t border-border bg-card/50 px-6 py-2 text-xs text-muted-foreground">
          {filtered.length} articol{filtered.length === 1 ? "o" : "i"}
          {search && ` (filtrati da ${articles.length}`})
        </div>
      )}
    </div>
  );
}
