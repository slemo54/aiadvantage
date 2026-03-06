"use client";

import { useState, useEffect } from "react";
import { generateIdeasAction } from "@/app/actions/generate-ideas";
import {
  Globe,
  Cpu,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  RefreshCw,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// ─── Types ───────────────────────────────────────────────────────────────────

interface EnvVarConfig {
  key: string;
  label: string;
  service: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getNextCronRun(): string {
  const now = new Date();
  const next = new Date(now);
  next.setDate(now.getDate() + (3 - (now.getDay() % 3)));
  next.setHours(8, 0, 0, 0);
  if (next <= now) {
    next.setDate(next.getDate() + 3);
  }
  return next.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function FieldRow({
  label,
  id,
  children,
  hint,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start">
      <div className="sm:pt-2">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {hint && (
          <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
        )}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

// ─── Tab: Sito ────────────────────────────────────────────────────────────────

function TabSito() {
  const { toast } = useToast();
  const [siteName, setSiteName] = useState("IlVantaggioAI");
  const [tagline, setTagline] = useState("Il blog italiano sull'AI");
  const [siteUrl, setSiteUrl] = useState("https://ilvantaggioai.it");
  const [author, setAuthor] = useState("Anselmo");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

  function handleSave() {
    toast({
      title: "Impostazioni salvate",
      description: "Le impostazioni del sito sono state aggiornate.",
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informazioni generali</CardTitle>
          <CardDescription>
            Dati principali del sito mostrati nell&apos;intestazione e nei meta tag.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FieldRow label="Nome sito" id="site-name">
            <Input
              id="site-name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="IlVantaggioAI"
            />
          </FieldRow>
          <Separator />
          <FieldRow
            label="Tagline"
            id="tagline"
            hint="Sottotitolo visualizzato nell'header"
          >
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Il blog italiano sull'AI"
            />
          </FieldRow>
          <Separator />
          <FieldRow label="URL sito" id="site-url">
            <Input
              id="site-url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://ilvantaggioai.it"
            />
          </FieldRow>
          <Separator />
          <FieldRow label="Autore principale" id="author">
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Anselmo"
            />
          </FieldRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Social</CardTitle>
          <CardDescription>
            Link ai profili social, usati nel footer e nei metadati Open Graph.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FieldRow label="Twitter / X" id="twitter">
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="twitter"
                className="pl-9"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://x.com/username"
              />
            </div>
          </FieldRow>
          <Separator />
          <FieldRow label="LinkedIn" id="linkedin">
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="linkedin"
                className="pl-9"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </FieldRow>
          <Separator />
          <FieldRow label="GitHub" id="github">
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="github"
                className="pl-9"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
          </FieldRow>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Salva impostazioni</Button>
      </div>
    </div>
  );
}

// ─── Tab: AI Pipeline ─────────────────────────────────────────────────────────

const ENV_VAR_CONFIGS: EnvVarConfig[] = [
  {
    key: "PERPLEXITY_API_KEY",
    label: "Perplexity",
    service: "Ricerca & Trend",
  },
  {
    key: "KIMI_API_KEY",
    label: "Kimi (Moonshot)",
    service: "Kimi 2.5 — Strutturazione bozza",
  },
  {
    key: "ANTHROPIC_API_KEY",
    label: "Anthropic / Claude",
    service: "Umanizzazione testo",
  },
  {
    key: "GEMINI_API_KEY",
    label: "Google Gemini",
    service: "Generazione immagini (Imagen 3)",
  },
  {
    key: "RESEND_API_KEY",
    label: "Resend",
    service: "Email & Newsletter",
  },
];

function EnvVarRow({
  config,
  configured,
  loading,
}: {
  config: EnvVarConfig;
  configured: boolean;
  loading: boolean;
}) {
  const { toast } = useToast();

  const isConfigured = configured;

  function handleTest() {
    toast({
      title: `Test ${config.label}`,
      description: isConfigured
        ? `Chiave ${config.key} rilevata su Vercel.`
        : `Chiave ${config.key} non trovata nelle env vars.`,
    });
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-4">
      {/* Status + labels */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {loading ? (
          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin shrink-0" />
        ) : isConfigured ? (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
        ) : (
          <XCircle className="h-4 w-4 shrink-0 text-red-500" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium leading-none">{config.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{config.service}</p>
        </div>
      </div>

      {/* Env var name */}
      <Badge
        variant="outline"
        className="font-mono text-[10px] hidden sm:inline-flex shrink-0"
      >
        {config.key}
      </Badge>

      {/* Status badge */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={[
          "text-xs px-2 py-1 rounded font-mono",
          loading ? "text-muted-foreground bg-muted" :
          isConfigured ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400" :
          "text-red-500 bg-red-50 dark:bg-red-950/30"
        ].join(" ")}>
          {loading ? "..." : isConfigured ? "configurata ✓" : "non configurata"}
        </span>
      </div>

      {/* Test button */}
      <Button
        variant="outline"
        size="sm"
        className="shrink-0 text-xs"
        onClick={handleTest}
        disabled={loading || !isConfigured}
      >
        Info
      </Button>
    </div>
  );
}

function TabAIPipeline() {
  const [envStatus, setEnvStatus] = useState<Record<string, boolean>>({});
  const [envLoading, setEnvLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/env-status", { credentials: "include" })
      .then((r) => r.json())
      .then((data: Record<string, boolean>) => {
        setEnvStatus(data);
      })
      .catch(() => {
        // Leave as empty = all unknown
      })
      .finally(() => setEnvLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Variabili d&apos;ambiente</CardTitle>
          <CardDescription>
            Stato reale delle chiavi API configurate su Vercel. I valori non
            sono mai visibili lato client per sicurezza.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {ENV_VAR_CONFIGS.map((cfg) => (
              <EnvVarRow
                key={cfg.key}
                config={cfg}
                configured={envStatus[cfg.key] === true}
                loading={envLoading}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Flusso pipeline</CardTitle>
          <CardDescription>
            Ogni articolo percorre questi passaggi in sequenza.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 items-center">
            {[
              { label: "Perplexity", role: "Ricerca" },
              { label: "Kimi 2.5", role: "Bozza" },
              { label: "Claude", role: "Revisione" },
              { label: "Gemini", role: "Immagini" },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="rounded-md border border-border bg-muted px-3 py-1.5 text-center">
                  <p className="text-xs font-semibold">{step.label}</p>
                  <p className="text-[10px] text-muted-foreground">{step.role}</p>
                </div>
                {i < arr.length - 1 && (
                  <span className="text-muted-foreground text-xs">→</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab: Newsletter ──────────────────────────────────────────────────────────

function TabNewsletter() {
  const { toast } = useToast();
  const [fromEmail, setFromEmail] = useState("noreply@ilvantaggioai.it");
  const [welcomeSubject, setWelcomeSubject] = useState(
    "Benvenuto su IlVantaggioAI!"
  );
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/env-status", { credentials: "include" })
      .then((r) => r.json())
      .then((d: Record<string, boolean | number>) => {
        if (typeof d.subscriberCount === "number") setSubscriberCount(d.subscriberCount);
      })
      .catch(() => {});
  }, []);

  function handleSave() {
    toast({
      title: "Impostazioni newsletter salvate",
      description: "La configurazione email è stata aggiornata.",
    });
  }

  return (
    <div className="space-y-6">
      {/* Provider card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Provider email</CardTitle>
          <CardDescription>
            Servizio di invio email usato per notifiche e newsletter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Mail className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Resend</p>
                <p className="text-xs text-muted-foreground">
                  resend.com — Transazionale &amp; bulk
                </p>
              </div>
            </div>
            <Badge className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10" variant="outline">
              Attivo
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Config card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configurazione invii</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <FieldRow
            label="Email mittente"
            id="from-email"
            hint="Visibile nell'intestazione dell'email"
          >
            <Input
              id="from-email"
              type="email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder="noreply@ilvantaggioai.it"
            />
          </FieldRow>
          <Separator />
          <FieldRow
            label="Oggetto benvenuto"
            id="welcome-subject"
            hint="Email inviata al nuovo iscritto"
          >
            <Input
              id="welcome-subject"
              value={welcomeSubject}
              onChange={(e) => setWelcomeSubject(e.target.value)}
              placeholder="Benvenuto su IlVantaggioAI!"
            />
          </FieldRow>
          <Separator />
          <div className="flex items-center justify-between py-1">
            <div>
              <Label htmlFor="weekly-digest" className="text-sm font-medium cursor-pointer">
                Digest settimanale
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Invia un riepilogo ogni settimana agli iscritti attivi
              </p>
            </div>
            <Switch
              id="weekly-digest"
              checked={weeklyDigest}
              onCheckedChange={setWeeklyDigest}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Statistiche iscritti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {subscriberCount === null ? "—" : subscriberCount}
              </p>
              <p className="text-xs text-muted-foreground">iscritti attivi</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Salva impostazioni</Button>
      </div>
    </div>
  );
}

// ─── Tab: Cron & Automazione ──────────────────────────────────────────────────

function TabCron() {
  const { toast } = useToast();
  const [autoGenEnabled, setAutoGenEnabled] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  async function handleManualTrigger() {
    setIsRunning(true);
    try {
      const result = await generateIdeasAction();
      if (result.success) {
        toast({
          title: "Cron eseguito",
          description: "La generazione idee è stata avviata con successo.",
        });
      } else {
        toast({
          title: "Errore",
          description: result.error ?? "Errore nell'avvio del cron.",
        });
      }
    } catch {
      toast({
        title: "Errore di rete",
        description: "Impossibile contattare l'endpoint cron.",
      });
    } finally {
      setIsRunning(false);
    }
  }

  function handleToggle(val: boolean) {
    setAutoGenEnabled(val);
    toast({
      title: val
        ? "Auto-generazione attivata"
        : "Auto-generazione disattivata",
      description: val
        ? "Il cron eseguirà la pipeline automaticamente."
        : "Il cron è stato sospeso.",
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pianificazione cron</CardTitle>
          <CardDescription>
            La pipeline AI genera nuovi articoli in automatico secondo il
            calendario impostato su Vercel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Schedule badge */}
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 flex items-center gap-3">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">Ogni 3 giorni alle 08:00</p>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                0 8 */3 * *
              </p>
            </div>
          </div>

          <Separator />

          {/* Auto-gen toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label
                htmlFor="auto-gen"
                className="text-sm font-medium cursor-pointer"
              >
                Auto-generazione articoli
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Abilita l&apos;esecuzione automatica del cron
              </p>
            </div>
            <Switch
              id="auto-gen"
              checked={autoGenEnabled}
              onCheckedChange={handleToggle}
            />
          </div>

          <Separator />

          {/* Last / Next run */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground mb-1">
                Ultima esecuzione
              </p>
              <p className="text-sm font-medium text-muted-foreground">Mai</p>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground mb-1">
                Prossima esecuzione
              </p>
              <p className="text-sm font-medium capitalize">
                {getNextCronRun()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual trigger */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trigger manuale</CardTitle>
          <CardDescription>
            Esegui subito la pipeline senza aspettare il prossimo cron
            schedulato.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium font-mono truncate">
                POST /api/cron/generate-ideas
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Avvia la ricerca trend e la creazione delle proposte
              </p>
            </div>
            <Button
              onClick={handleManualTrigger}
              disabled={isRunning}
              className="shrink-0"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  In esecuzione...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Esegui ora
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <>
      <div className="flex flex-col flex-1 overflow-auto">
        {/* Page header */}
        <div className="border-b border-border px-6 py-5">
          <h1 className="text-2xl font-bold tracking-tight">Impostazioni</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestisci sito, pipeline AI, newsletter e automazioni.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="sito" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-xl h-10">
              <TabsTrigger value="sito" className="gap-1.5 text-xs sm:text-sm">
                <Globe className="h-3.5 w-3.5" />
                Sito
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-1.5 text-xs sm:text-sm">
                <Cpu className="h-3.5 w-3.5" />
                AI Pipeline
              </TabsTrigger>
              <TabsTrigger
                value="newsletter"
                className="gap-1.5 text-xs sm:text-sm"
              >
                <Mail className="h-3.5 w-3.5" />
                Newsletter
              </TabsTrigger>
              <TabsTrigger value="cron" className="gap-1.5 text-xs sm:text-sm">
                <Clock className="h-3.5 w-3.5" />
                Cron
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sito">
              <TabSito />
            </TabsContent>

            <TabsContent value="ai">
              <TabAIPipeline />
            </TabsContent>

            <TabsContent value="newsletter">
              <TabNewsletter />
            </TabsContent>

            <TabsContent value="cron">
              <TabCron />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Toaster />
    </>
  );
}
