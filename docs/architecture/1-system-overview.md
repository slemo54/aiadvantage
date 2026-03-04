# 1. System Overview

## Architettura Generale

```
┌─────────────┐     ┌──────────────────────────┐     ┌──────────────┐
│   Browser   │────▶│   Next.js 14 (Vercel)    │────▶│   Supabase   │
│  (React 18) │◀────│   App Router + API Routes │◀────│  PostgreSQL  │
└─────────────┘     └──────────┬───────────────┘     └──────────────┘
                               │
                    ┌──────────┴───────────┐
                    │     AI API Layer     │
                    ├──────────────────────┤
                    │ Perplexity (Research) │
                    │ Kimi 2.5 (Draft)     │
                    │ Claude (Humanize)    │
                    │ Gemini (Images)      │
                    │ Resend (Email)       │
                    └──────────────────────┘
```

## Tech Stack

| Layer | Tecnologia | Motivazione |
|-------|-----------|-------------|
| Framework | Next.js 14 (App Router) | SSR/SSG, API routes, deploy Vercel |
| UI | React 18 + TypeScript | Type safety, componenti riusabili |
| Styling | Tailwind CSS + shadcn/ui | Rapid prototyping, dark mode nativo |
| Database | Supabase (PostgreSQL) | RLS, real-time, hosting gestito |
| AI Research | Perplexity sonar-pro | Web search + sintesi |
| AI Draft | Kimi 2.5 | Long context, buona qualità italiano |
| AI Humanize | Claude | Tono naturale, editing raffinato |
| AI Images | Gemini Pro + Imagen | Generazione hero images |
| Email | Resend | API moderna, deliverability |
| Deploy | Vercel | CI/CD automatico, edge functions |

## Workflow State Machine

```
idea → researching → drafting → humanizing → reviewing → ready → published
  │                                                          │
  └─── (rejected) ──────────────────────────────────────────┘
```

### Transizioni

| Da | A | Trigger | Azione |
|----|---|---------|--------|
| idea | researching | Cron (ogni 72h) | Perplexity ricerca topic |
| researching | drafting | Auto | Kimi genera bozza da ricerca |
| drafting | humanizing | Auto | Claude riscrive in tono naturale |
| humanizing | reviewing | Auto | Articolo pronto per review umana |
| reviewing | ready | Manuale (admin) | Admin approva + genera immagine |
| ready | published | Manuale (admin) | Pubblicazione + notifica subscribers |

## Rationale Decisioni

1. **4 AI diversi**: Ogni modello eccelle in un task specifico. Perplexity per ricerca web, Kimi per draft lunghi, Claude per qualità testo, Gemini per immagini.
2. **Supabase vs Prisma**: RLS nativo, hosting PostgreSQL incluso, meno infrastruttura da gestire.
3. **Next.js App Router**: Server Components riducono JS client, API routes colocate col frontend.
4. **Dark mode default**: Target audience tech/AI preferisce dark mode.
