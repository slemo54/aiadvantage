# IlVantaggioAI — Documentazione Architettura

## Quick Start

```bash
cd ilvantaggioai
cp .env.local.example .env.local
# Compila .env.local con le tue chiavi API
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Mappa Documentazione

| Doc | Contenuto |
|-----|-----------|
| [1-system-overview.md](./1-system-overview.md) | Architettura generale, tech stack, workflow state machine |
| [2-frontend-architecture.md](./2-frontend-architecture.md) | Routes, componenti, styling, layout pubblico vs admin |
| [3-backend-data-architecture.md](./3-backend-data-architecture.md) | Schema DB, API routes, RLS policies |
| [4-ai-workflows.md](./4-ai-workflows.md) | Pipeline AI 5 step, prompt templates, cron |

## Convenzioni

- **Lingua UI**: Italiano
- **Lingua codice**: Inglese (nomi variabili, commenti tecnici)
- **Styling**: Tailwind CSS + shadcn/ui, dark mode di default
- **State management**: Server-first (RSC), client state solo dove necessario
- **Database**: Supabase (PostgreSQL) con RLS
- **Deploy**: Vercel

## Struttura Directory

```
app/                  → Routes Next.js (App Router)
  admin/              → Pannello amministrazione
  api/                → API Routes
  blog/[slug]/        → Pagine articoli (SSR)
lib/                  → Logica condivisa
  ai/                 → Wrapper AI providers + pipeline
  supabase/           → Client Supabase (browser/server/admin)
components/           → Componenti React
  ui/                 → shadcn/ui base components
  layout/             → Header, Footer, AdminSidebar
  blog/               → ArticleCard
  admin/              → IdeaCard, StatusBadge
supabase/migrations/  → Schema SQL
docs/architecture/    → Questa documentazione
```
