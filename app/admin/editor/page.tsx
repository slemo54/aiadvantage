"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Save, Send, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { EditorAISidebar } from "@/components/admin/editor-ai-sidebar";
import { StatusBadge } from "@/components/admin/status-badge";
import { CATEGORIES } from "@/lib/constants";
import type { CategoryKey } from "@/lib/constants";
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
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <EditorPageInner />
    </Suspense>
  );
}

function EditorPageInner() {
  const searchParams = useSearchParams();
  const slugFromUrl = searchParams.get("slug");

  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);

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
    setArticlesError(null);
    try {
      const [drafting, humanizing, reviewing, ready, published] = await Promise.all([
        fetch("/api/articles?status=drafting&limit=20").then((r) => r.json() as Promise<ArticlesApiResponse>),
        fetch("/api/articles?status=humanizing&limit=20").then((r) => r.json() as Promise<ArticlesApiResponse>),
        fetch("/api/articles?status=reviewing&limit=20").then((r) => r.json() as Promise<ArticlesApiResponse>),
        fetch("/api/articles?status=ready&limit=20").then((r) => r.json() as Promise<ArticlesApiResponse>),
        fetch("/api/articles?status=published&limit=50").then((r) => r.json() as Promise<ArticlesApiResponse>),
      ]);
      const all = [
        ...(drafting.articles ?? []),
        ...(humanizing.articles ?? []),
        ...(reviewing.articles ?? []),
        ...(ready.articles ?? []),
        ...(published.articles ?? []),
      ];
      setArticles(all);

      // Pre-select from URL if provided
      if (slugFromUrl && all.some((a) => a.slug === slugFromUrl)) {
        setSelectedSlug(slugFromUrl);
      }
    } catch (err) {
      setArticlesError(`Errore caricamento articoli: ${String(err)}. Verifica Supabase.`);
    } finally {
      setArticlesLoading(false);
    }
  }, [slugFromUrl]);

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
        body: JSON.stringify({
          content_html: content,
          category: currentArticle.category,
        }),
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

  async function handleUploadImage(file: File) {
    if (!selectedSlug) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUri = e.target?.result as string;
      if (!dataUri) return;
      const res = await fetch(`/api/articles/${selectedSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero_image_url: dataUri }),
      });
      if (res.ok) {
        setCurrentArticle((prev) => prev ? { ...prev, hero_image_url: dataUri } : prev);
        setStatusMessage("Immagine caricata.");
      } else {
        setStatusMessage("Errore upload immagine.");
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleHumanize() {
    if (!currentArticle) return;
    const res = await fetch("/api/workflow/humanize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId: currentArticle.id }),
    });
    if (res.ok) {
      const updated = await fetch(`/api/articles/${selectedSlug}`).then(
        (r) => r.json() as Promise<ArticleApiResponse>
      );
      setCurrentArticle(updated.article);
      setContent(updated.article.content_html ?? "");
      setStatusMessage("Umanizzazione completata.");
    } else {
      const data = await res.json().catch(() => ({})) as { error?: string };
      setStatusMessage(`Errore umanizzazione: ${data.error ?? res.statusText}`);
    }
  }

  async function handleGenerateImage() {
    if (!currentArticle) return;
    const res = await fetch("/api/workflow/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId: currentArticle.id }),
    });
    const data = await res.json().catch(() => ({})) as { success?: boolean; hero_image_url?: string | null; warning?: string; error?: string };
    if (!res.ok) {
      setStatusMessage(`Errore generazione immagine: ${data.error ?? res.statusText}`);
      return;
    }
    if (!data.hero_image_url) {
      setStatusMessage(data.warning ?? "Immagine non generata (controlla VENICE_API_KEY).");
      return;
    }
    const updated = await fetch(`/api/articles/${selectedSlug}`).then(
      (r) => r.json() as Promise<ArticleApiResponse>
    );
    setCurrentArticle(updated.article);
    setStatusMessage("Immagine generata.");
  }

  async function handleGenerateSEO() {
    if (!currentArticle) return;
    const res = await fetch("/api/workflow/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId: currentArticle.id }),
    });
    const data = await res.json().catch(() => ({})) as { meta_description?: string; keywords?: string[]; slug?: string; error?: string };
    if (!res.ok) {
      setStatusMessage(`Errore SEO: ${data.error ?? res.statusText}`);
      return;
    }
    setCurrentArticle((prev) =>
      prev ? { ...prev, meta_description: data.meta_description ?? prev.meta_description, keywords: data.keywords ?? prev.keywords, slug: data.slug ?? prev.slug } : prev
    );
    setStatusMessage("SEO generato con AI.");
  }

  async function handleSidebarUpdate(fields: Partial<Article>) {
    if (!selectedSlug) return;
    const res = await fetch(`/api/articles/${selectedSlug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (res.ok) {
      setCurrentArticle((prev) => (prev ? { ...prev, ...fields } : prev));
      setStatusMessage("Campi aggiornati.");
    } else {
      setStatusMessage("Errore nell'aggiornamento.");
    }
  }

  function handleCategoryChange(category: CategoryKey) {
    setCurrentArticle((prev) => (prev ? { ...prev, category } : prev));
  }

  return (
    <div className="flex h-full">
      {/* Main editor column */}
      <div className="flex flex-1 flex-col min-w-0">
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

        {/* Article Selector + Category */}
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-border bg-card/50 px-6 py-3">
          <div className="relative max-w-sm flex-1">
            {articlesLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Caricamento articoli...
              </div>
            ) : articlesError ? (
              <p className="text-xs text-red-500">{articlesError}</p>
            ) : (
              <>
                <select
                  value={selectedSlug}
                  onChange={(e) => {
                    const value = e.target.value;
                    setContent("");
                    setArticleLoading(true);
                    setSelectedSlug(value);
                  }}
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

          {currentArticle && (
            <div className="relative">
              <select
                value={currentArticle.category}
                onChange={(e) => handleCategoryChange(e.target.value as CategoryKey)}
                className="appearance-none rounded-md border border-input bg-background py-2 pl-3 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          )}
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
              <>
                {!articleLoading && currentArticle && !content && (
                  <div className="mb-4 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400">
                    Nessuna bozza disponibile per questo articolo. Scrivi manualmente oppure rigenera il draft dalla Pipeline.
                  </div>
                )}
                <TiptapEditor
                  key={selectedSlug || "empty"}
                  content={content}
                  onChange={setContent}
                />
              </>
            )}
          </div>
        </section>
      </div>

      {/* AI Sidebar */}
      <div className="hidden lg:flex">
        <EditorAISidebar
          article={currentArticle}
          onUpdate={handleSidebarUpdate}
          onHumanize={handleHumanize}
          onGenerateImage={handleGenerateImage}
          onGenerateSEO={handleGenerateSEO}
          onUploadImage={handleUploadImage}
        />
      </div>
    </div>
  );
}
