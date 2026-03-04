 # IlVantaggioAI — Istruzioni Progetto

## Overview
Blog italiano sull'AI con workflow editoriale automatizzato (Perplexity → Kimi → Claude → Gemini).

## Tech Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL + RLS)
- **AI**: Perplexity, Kimi 2.5, Claude, Gemini
- **Email**: Resend
- **Deploy**: Vercel

## Documentazione Completa
Leggi `docs/architecture/` per architettura dettagliata:
- `index.md` — Quick start e mappa docs
- `1-system-overview.md` — Architettura, tech stack, state machine
- `2-frontend-architecture.md` — Routes, componenti, styling
- `3-backend-data-architecture.md` — Schema DB, API, RLS
- `4-ai-workflows.md` — Pipeline AI, prompt, cron

## Struttura Directory
```
app/           → Routes (App Router)
app/admin/     → Pannello admin
app/api/       → API Routes
lib/ai/        → Wrapper AI + pipeline state machine
lib/supabase/  → Client browser/server/admin
components/    → UI components (shadcn + custom)
supabase/      → Migrations SQL
docs/          → Architettura e docs
```

## Comandi
```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Build produzione
npm run lint     # ESLint
```

## Convenzioni
- **TypeScript strict** — no `any`, interfacce in `lib/types.ts`
- **Italiano per UI** — testi visibili all'utente in italiano
- **Inglese per codice** — nomi variabili, funzioni, commenti tecnici
- **Dark mode default** — CSS variables in `globals.css`
- **Categorie con colori** — definite in `lib/constants.ts`
- **Workflow states** — 7 stati in `lib/constants.ts`, transizioni in `lib/ai/pipeline.ts`

## Database
Schema in `supabase/migrations/001_initial_schema.sql`. 4 tabelle: articles, ideas, subscribers, editorial_calendar.

## API Routes
- `GET/POST /api/articles` — CRUD articoli
- `POST /api/cron/generate-ideas` — Cron (auth: Bearer CRON_SECRET)
- `POST /api/workflow/draft` — Genera bozza
- `POST /api/workflow/humanize` — Umanizza testo
- `POST /api/workflow/images` — Genera immagini
- `POST /api/notify` — Notifica email
