"use client";

import { useState, useEffect } from "react";
import {
  Brain,
  Search,
  ImageIcon,
  RefreshCw,
  Wand2,
  Sparkles,
  Paintbrush,
  Loader2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/lib/types";

interface EditorAISidebarProps {
  article: Article | null;
  onUpdate?: (fields: Partial<Article>) => void;
  onHumanize?: () => Promise<void>;
  onGenerateImage?: () => Promise<void>;
  onGenerateSEO?: () => Promise<void>;
  onUploadImage?: (file: File) => Promise<void>;
}

export function EditorAISidebar({
  article,
  onUpdate,
  onHumanize,
  onGenerateImage,
  onGenerateSEO,
  onUploadImage,
}: EditorAISidebarProps) {
  const [tone, setTone] = useState<"conversational" | "professional" | "storytelling">("conversational");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageRatio, setImageRatio] = useState("16:9");
  const [imageStyle, setImageStyle] = useState("photorealistic");
  const [humanizing, setHumanizing] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatingSEO, setGeneratingSEO] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Sync fields from article prop
  useEffect(() => {
    if (article) {
      setMetaDescription(article.meta_description ?? "");
      setFocusKeyword(article.keywords?.join(", ") ?? "");
      setSlug(article.slug ?? "");
    }
  }, [article]);

  async function handleHumanize() {
    if (!onHumanize) return;
    setHumanizing(true);
    try {
      await onHumanize();
    } finally {
      setHumanizing(false);
    }
  }

  async function handleGenerateImage() {
    if (!onGenerateImage) return;
    setGeneratingImage(true);
    try {
      await onGenerateImage();
    } finally {
      setGeneratingImage(false);
    }
  }

  async function handleGenerateSEO() {
    if (!onGenerateSEO) return;
    setGeneratingSEO(true);
    try {
      await onGenerateSEO();
    } finally {
      setGeneratingSEO(false);
    }
  }

  async function handleUploadImage(file: File) {
    if (!onUploadImage) return;
    setUploadingImage(true);
    try {
      await onUploadImage(file);
    } finally {
      setUploadingImage(false);
    }
  }

  function handleSaveSEO() {
    if (!onUpdate) return;
    const keywords = focusKeyword
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    onUpdate({ meta_description: metaDescription, keywords, slug });
  }

  return (
    <aside className="flex w-80 flex-shrink-0 flex-col overflow-y-auto border-l border-border bg-muted/30 lg:w-96">
      <div className="flex items-center gap-2 border-b border-border bg-card p-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Assistente AI</h2>
      </div>

      <div className="space-y-4 p-4">
        {/* Hero Image Preview */}
        {article?.hero_image_url && (
          <Card>
            <CardContent className="p-3">
              <img
                src={article.hero_image_url}
                alt="Hero"
                className="w-full rounded-md object-cover"
              />
            </CardContent>
          </Card>
        )}

        {/* Umanizzazione */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-sm">
                <Brain className="mr-1.5 h-4 w-4 text-blue-500" />
                Umanizzazione
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                Venice AI
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Regola tono e stile per un suono pi&ugrave; naturale e coinvolgente.
            </p>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="tone"
                checked={tone === "conversational"}
                onChange={() => setTone("conversational")}
                className="text-primary"
              />
              Conversazionale &amp; Amichevole
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="tone"
                checked={tone === "professional"}
                onChange={() => setTone("professional")}
                className="text-primary"
              />
              Professionale &amp; Autorevole
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="tone"
                checked={tone === "storytelling"}
                onChange={() => setTone("storytelling")}
                className="text-primary"
              />
              Storytelling
            </label>
            <Button
              variant="outline"
              className="mt-3 w-full"
              size="sm"
              disabled={!article || humanizing}
              onClick={() => void handleHumanize()}
            >
              {humanizing ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              )}
              Applica Umanizzazione
            </Button>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-sm">
                <Search className="mr-1.5 h-4 w-4 text-green-500" />
                Ottimizzazione SEO
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                Venice AI
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Keywords (separate da virgola)
              </label>
              <Input
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                className="h-8 text-sm"
                disabled={!article}
              />
            </div>
            <div>
              <div className="mb-1 flex items-end justify-between">
                <label className="text-xs font-medium text-muted-foreground">
                  Meta Description
                </label>
                <span
                  className={`text-[10px] ${
                    metaDescription.length > 160
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {metaDescription.length}/160
                </span>
              </div>
              <Textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                className="text-sm"
                disabled={!article}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                URL Slug
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="h-8 font-mono text-xs"
                disabled={!article}
              />
            </div>
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              disabled={!article || generatingSEO}
              onClick={() => void handleGenerateSEO()}
            >
              {generatingSEO ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Wand2 className="mr-1.5 h-3.5 w-3.5" />
              )}
              Genera con AI
            </Button>
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              disabled={!article}
              onClick={handleSaveSEO}
            >
              Salva SEO
            </Button>
          </CardContent>
        </Card>

        {/* Image Generation */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-sm">
                <ImageIcon className="mr-1.5 h-4 w-4 text-purple-500" />
                Generazione Immagini
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                Venice AI
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Prompt
              </label>
              <Textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Descrivi l'immagine che vuoi..."
                rows={2}
                className="text-sm"
                disabled={!article}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={imageRatio}
                onChange={(e) => setImageRatio(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                disabled={!article}
              >
                <option value="16:9">16:9 Landscape</option>
                <option value="1:1">1:1 Quadrato</option>
                <option value="4:3">4:3 Standard</option>
              </select>
              <select
                value={imageStyle}
                onChange={(e) => setImageStyle(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                disabled={!article}
              >
                <option value="photorealistic">Fotorealistico</option>
                <option value="illustration">Illustrazione</option>
                <option value="3d">3D Render</option>
                <option value="vector">Vector Art</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Carica immagine manuale (quadrata)
              </label>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  id="hero-upload"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleUploadImage(f);
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={!article || uploadingImage}
                  onClick={() => document.getElementById("hero-upload")?.click()}
                >
                  {uploadingImage ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  {uploadingImage ? "Caricamento..." : "Carica immagine"}
                </Button>
              </div>
            </div>
            <Button
              className="w-full"
              size="sm"
              disabled={!article || generatingImage}
              onClick={() => void handleGenerateImage()}
            >
              {generatingImage ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Paintbrush className="mr-1.5 h-3.5 w-3.5" />
              )}
              Genera Immagine AI
            </Button>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
