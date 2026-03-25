"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Save,
  FlaskConical,
  Upload,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Loader2,
  FileText,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  PIPELINE_STAGES,
  PIPELINE_STAGE_LABELS,
  PIPELINE_STAGE_MODELS,
  PIPELINE_STAGE_VARIABLES,
} from "@/lib/constants";
import type { PipelineStage } from "@/lib/constants";
import type { PromptConfig, KnowledgeBaseFile } from "@/lib/types";

// ─── Sample inputs for verification ─────────────────────────────────────────

const SAMPLE_INPUTS: Record<PipelineStage, string> = {
  research: "intelligenza artificiale generativa nel settore sanitario",
  draft: "L'intelligenza artificiale sta rivoluzionando la sanita italiana. Nuovi strumenti AI permettono diagnosi piu rapide e accurate...",
  humanize: "<h2>L'AI nella Sanita</h2><p>L'intelligenza artificiale sta cambiando il modo in cui i medici diagnosticano le malattie.</p>",
  images: "Come l'AI sta rivoluzionando la diagnostica medica in Italia",
  seo: "Come l'AI sta rivoluzionando la diagnostica medica in Italia\n\nL'intelligenza artificiale sta cambiando il modo in cui i medici italiani diagnosticano le malattie...",
};

// ─── TabStagePrompt ─────────────────────────────────────────────────────────

function TabStagePrompt({ stage }: { stage: PipelineStage }) {
  const { toast } = useToast();
  const [promptText, setPromptText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<PromptConfig[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);

  // Knowledge base state
  const [kbFiles, setKbFiles] = useState<KnowledgeBaseFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPrompt = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/prompts?stage=${stage}`, {
        credentials: "include",
      });
      const data = (await res.json()) as { prompts: PromptConfig[] };
      const active = data.prompts?.[0];
      if (active) {
        setPromptText(active.prompt_text);
        setOriginalText(active.prompt_text);
      }
    } catch {
      toast({ title: "Errore", description: "Impossibile caricare il prompt." });
    } finally {
      setLoading(false);
    }
  }, [stage, toast]);

  const fetchKbFiles = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/knowledge-base?stage=${stage}`, {
        credentials: "include",
      });
      const data = (await res.json()) as { files: KnowledgeBaseFile[] };
      setKbFiles(data.files ?? []);
    } catch {
      // silent
    }
  }, [stage]);

  useEffect(() => {
    fetchPrompt();
    fetchKbFiles();
  }, [fetchPrompt, fetchKbFiles]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/prompts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage, prompt_text: promptText }),
      });
      if (!res.ok) throw new Error("Errore salvataggio");
      setOriginalText(promptText);
      toast({ title: "Salvato", description: `Prompt "${PIPELINE_STAGE_LABELS[stage]}" aggiornato.` });
    } catch {
      toast({ title: "Errore", description: "Impossibile salvare il prompt." });
    } finally {
      setSaving(false);
    }
  }

  async function fetchHistory() {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/admin/prompts/history?stage=${stage}`, {
        credentials: "include",
      });
      const data = (await res.json()) as { history: PromptConfig[] };
      setHistory(data.history ?? []);
    } catch {
      toast({ title: "Errore", description: "Impossibile caricare la cronologia." });
    } finally {
      setHistoryLoading(false);
    }
  }

  function toggleHistory() {
    const next = !historyOpen;
    setHistoryOpen(next);
    if (next) fetchHistory();
  }

  async function handleRevert(promptId: string) {
    try {
      const res = await fetch("/api/admin/prompts/revert", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId }),
      });
      if (!res.ok) throw new Error("Errore ripristino");
      toast({ title: "Ripristinato", description: "Versione precedente riattivata." });
      fetchPrompt();
      fetchHistory();
    } catch {
      toast({ title: "Errore", description: "Impossibile ripristinare la versione." });
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("stage", stage);
      formData.append("file", file);
      const res = await fetch("/api/admin/knowledge-base", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const err = (await res.json()) as { error: string };
        throw new Error(err.error);
      }
      toast({ title: "File caricato", description: `${file.name} aggiunto alla knowledge base.` });
      fetchKbFiles();
    } catch (err) {
      toast({ title: "Errore upload", description: String(err) });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDeleteFile(fileId: string, fileName: string) {
    if (!confirm(`Eliminare "${fileName}"? Azione irreversibile.`)) return;
    try {
      const res = await fetch(`/api/admin/knowledge-base/${fileId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Errore eliminazione");
      toast({ title: "Eliminato", description: `${fileName} rimosso.` });
      fetchKbFiles();
    } catch {
      toast({ title: "Errore", description: "Impossibile eliminare il file." });
    }
  }

  const hasChanges = promptText !== originalText;
  const variables = PIPELINE_STAGE_VARIABLES[stage];

  return (
    <div className="space-y-6">
      {/* Prompt editor card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Prompt attivo</CardTitle>
              <CardDescription className="mt-1">
                Modifica il prompt usato dal modello AI per questo stadio della pipeline.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-[10px] shrink-0">
              {PIPELINE_STAGE_MODELS[stage]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <Textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="min-h-[300px] font-mono text-sm leading-relaxed"
                placeholder="Inserisci il prompt..."
              />
              {variables.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Variabili disponibili:{" "}
                  {variables.map((v) => (
                    <code
                      key={v}
                      className="mx-0.5 rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono"
                    >
                      {`{{${v}}}`}
                    </code>
                  ))}
                </p>
              )}
              <div className="flex items-center gap-2">
                <Button onClick={handleSave} disabled={saving || !hasChanges} size="sm">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Salva
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVerifyOpen(true)}
                  disabled={!promptText.trim()}
                >
                  <FlaskConical className="h-4 w-4" />
                  Verifica
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Knowledge Base card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Knowledge Base</CardTitle>
          <CardDescription>
            File di contesto (.md) iniettati automaticamente nel prompt. Max 5MB per file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {kbFiles.length > 0 ? (
            <div className="divide-y divide-border rounded-md border">
              {kbFiles.map((f) => (
                <div key={f.id} className="flex items-center justify-between px-3 py-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{f.file_name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {((f.file_size_bytes ?? 0) / 1024).toFixed(1)} KB &middot;{" "}
                        {new Date(f.created_at).toLocaleDateString("it-IT")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      .{f.file_type}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Elimina file"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                      onClick={() => handleDeleteFile(f.id, f.file_name)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Nessun file caricato per questo stadio.
            </p>
          )}

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md"
              className="hidden"
              onChange={handleUpload}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Carica file .md
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History card (collapsible) */}
      <Card>
        <CardHeader
          className="cursor-pointer select-none"
          onClick={toggleHistory}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Cronologia versioni</CardTitle>
            </div>
            {historyOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {historyOpen && (
          <CardContent>
            {historyLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nessuna versione salvata.
              </p>
            ) : (
              <div className="divide-y divide-border rounded-md border">
                {history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between px-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={h.is_active ? "default" : "outline"}
                          className="text-[10px] shrink-0"
                        >
                          v{h.version}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(h.created_at).toLocaleString("it-IT")}
                        </span>
                        {h.is_active && (
                          <Badge className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30" variant="outline">
                            attivo
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-lg">
                        {h.prompt_text.slice(0, 120)}...
                      </p>
                    </div>
                    {!h.is_active && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-xs"
                        onClick={() => handleRevert(h.id)}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Ripristina
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Verify dialog */}
      <VerifyDialog
        stage={stage}
        promptText={promptText}
        open={verifyOpen}
        onOpenChange={setVerifyOpen}
      />
    </div>
  );
}

// ─── VerifyDialog ───────────────────────────────────────────────────────────

function VerifyDialog({
  stage,
  promptText,
  open,
  onOpenChange,
}: {
  stage: PipelineStage;
  promptText: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [sampleInput, setSampleInput] = useState(SAMPLE_INPUTS[stage]);
  const [output, setOutput] = useState("");
  const [model, setModel] = useState("");
  const [durationMs, setDurationMs] = useState(0);
  const [testing, setTesting] = useState(false);

  async function handleTest() {
    setTesting(true);
    setOutput("");
    try {
      const res = await fetch("/api/admin/prompts/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage, prompt_text: promptText, sample_input: sampleInput }),
      });
      const data = (await res.json()) as {
        output?: string;
        model?: string;
        duration_ms?: number;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Errore verifica");
      setOutput(data.output ?? "");
      setModel(data.model ?? "");
      setDurationMs(data.duration_ms ?? 0);
    } catch (err) {
      toast({ title: "Errore verifica", description: String(err) });
    } finally {
      setTesting(false);
    }
  }

  const isImageStage = stage === "images";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Verifica prompt &mdash; {PIPELINE_STAGE_LABELS[stage]}</DialogTitle>
          <DialogDescription>
            Testa il prompt con un input di esempio. Viene chiamato il vero modello AI ({PIPELINE_STAGE_MODELS[stage]}).
            Consuma token reali.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <Label htmlFor="sample-input" className="text-sm font-medium">
              Input di esempio
            </Label>
            <Textarea
              id="sample-input"
              value={sampleInput}
              onChange={(e) => setSampleInput(e.target.value)}
              className="mt-1.5 min-h-[100px] font-mono text-sm"
              placeholder="Inserisci un input di test..."
            />
          </div>

          <Button onClick={handleTest} disabled={testing || !sampleInput.trim()}>
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Test in corso...
              </>
            ) : (
              <>
                <FlaskConical className="h-4 w-4" />
                Esegui test
              </>
            )}
          </Button>

          {output && (
            <>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Output AI</Label>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px] font-mono">{model}</Badge>
                    <span>{(durationMs / 1000).toFixed(1)}s</span>
                  </div>
                </div>
                {isImageStage && output.startsWith("data:image") ? (
                  <div className="rounded-md border p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={output}
                      alt="Generated preview"
                      className="rounded max-w-full max-h-[400px] mx-auto"
                    />
                  </div>
                ) : (
                  <div className="rounded-md border bg-muted/30 p-4 max-h-[400px] overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap break-words font-mono">
                      {output}
                    </pre>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function PromptsPage() {
  return (
    <>
      <div className="flex flex-col flex-1 overflow-auto">
        {/* Page header */}
        <div className="border-b border-border px-6 py-5">
          <h1 className="text-2xl font-bold tracking-tight">
            Gestione Prompt &amp; Knowledge Base
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Modifica i prompt AI per ogni stadio della pipeline e carica file di contesto.
            Le modifiche saranno effettive entro 1 minuto.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="research" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-2xl h-10">
              {PIPELINE_STAGES.map((stage) => (
                <TabsTrigger
                  key={stage}
                  value={stage}
                  className="gap-1.5 text-xs sm:text-sm"
                >
                  {PIPELINE_STAGE_LABELS[stage]}
                </TabsTrigger>
              ))}
            </TabsList>

            {PIPELINE_STAGES.map((stage) => (
              <TabsContent key={stage} value={stage}>
                <TabStagePrompt stage={stage} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      <Toaster />
    </>
  );
}
