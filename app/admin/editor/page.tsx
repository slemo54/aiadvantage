"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Send, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { StatusBadge } from "@/components/admin/status-badge";
import type { Article } from "@/lib/types";

// ─── Types ─────────────────────────────────────────────────────────────────

interface ArticlesApiResponse {
  articles: Article[];
  total: number;
}

interface ArticleApiResponse {
  article: Article;
  isDraft: boolean;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function EditorPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);

  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Load articles eligible for editing
  const fetchArticles = useCallback(async () => {
    setArticlesLoading(true);
    try {
      const [drafting, humanizing, reviewing, ready] = await Promise.all([
        fetch("/api/articles?status=drafting&limit=20").then((r) => r.json() as Promise<ArticlesApiResponse>),
        fetch("/api/articles?status=humanizing&limit=20").then((r) => r.json() as Promise<ArticlesApiResponse>),
        fetch("/api/articles?status=reviewing&limit=20").then((r) => r.json() as Promise<ArticlesApiResponse>),
        fetch("/api/articles?status=ready&limit=20").then((r) => r.json() as Promise<ArticlesApiResponse>),
      ]);
      setArticles([
        ...(drafting.articles ?? []),
        ...(humanizing.articles ?? []),
        ...(reviewing.articles ?? []),
        ...(ready.articles ?? []),
      ]);
    } catch {
      // silently ignore
    } finally {
      setArticlesLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchArticles();
  }, [fetchArticles]);

  // Load article content when slug changes
  useEffect(() => {
    if (!selectedSlug) {
      setCurrentArticle(null);
      setContent("");
      return;
    }

    setArticleLoading(true);
    setStatusMessage(null);

    fetch(`/api/articles/${selectedSlug}`)
      .then((r) => r.json() as Promise<ArticleApiResponse>)
      .then((json) => {
        setCurrentArticle(json.article);
        setContent(json.article.content_html ?? "");
      })
      .catch(() => {
        setStatusMessage("Errore nel caricamento dell'articolo.");
      })
      .finally(() => {
        setArticleLoading(false);
      });
  }, [selectedSlug]);

  async function handleSave() {
    if (!selectedSlug || !currentArticle) return;
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/articles/${selectedSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_html: content }),
      });
      if (res.ok) {
        setStatusMessage("Bozza salvata.");
      } else {
        setStatusMessage("Errore nel salvataggio.");
      }
    } catch {
      setStatusMessage("Errore di rete.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!selectedSlug || !currentArticle) return;
    setPublishing(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/articles/${selectedSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "published",
          published_at: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setCurrentArticle((prev) =>
          prev ? { ...prev, status: "published" } : prev
        );
        setStatusMessage("Articolo pubblicato con successo!");
        void fetchArticles();
      } else {
        setStatusMessage("Errore nella pubblicazione.");
      }
    } catch {
      setStatusMessage("Errore di rete.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex flex-shrink-0 flex-col gap-3 border-b border-border bg-card px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">Editor</h1>
          {currentArticle && (
            <>
              <div className="h-5 w-px bg-border" />
              <p className="truncate text-sm text-muted-foreground max-w-xs">
                {currentArticle.title}
              </p>
              <StatusBadge status={currentArticle.status} />
            </>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {statusMessage && (
            <span className="text-xs text-muted-foreground">{statusMessage}</span>
          )}
          <Button
            variant="ghost"
            size="sm"
            disabled={!currentArticle || saving || publishing}
            onClick={() => void handleSave()}
          >
            {saving ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-4 w-4" />
            )}
            Salva Bozza
          </Button>
          <Button
            size="sm"
            disabled={!currentArticle || saving || publishing}
            onClick={() => void handlePublish()}
          >
            {publishing ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-1.5 h-4 w-4" />
            )}
            Approva &amp; Pubblica
          </Button>
        </div>
      </header>

      {/* Article Selector */}
      <div className="flex-shrink-0 border-b border-border bg-card/50 px-6 py-3">
        <div className="relative max-w-sm">
          {articlesLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Caricamento articoli...
            </div>
          ) : (
            <>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="w-full appearance-none rounded-md border border-input bg-background py-2 pl-3 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">
                  {articles.length === 0
                    ? "Nessun articolo in lavorazione"
                    : "Seleziona un articolo..."}
                </option>
                {articles.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    [{a.status}] {a.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <section className="flex-1 overflow-y-auto bg-card p-8 lg:p-12">
        <div className="mx-auto max-w-3xl">
          {articleLoading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Caricamento articolo...
            </div>
          ) : (
            <TiptapEditor
              key={selectedSlug || "empty"}
              content={content}
              onChange={setContent}
            />
          )}
        </div>
      </section>
    </div>
  );
}
