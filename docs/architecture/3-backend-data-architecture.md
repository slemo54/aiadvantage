# 3. Backend & Data Architecture

## Schema Database

### ER Diagram

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────┐
│    ideas     │     │ editorial_calendar│     │ subscribers │
├──────────────┤     ├──────────────────┤     ├─────────────┤
│ id (PK)      │◀────│ idea_id (FK)     │     │ id (PK)     │
│ topic        │     │ article_id (FK)  │────▶│ email (UQ)  │
│ source_url   │     │ scheduled_date   │     │ confirmed   │
│ freshness    │     │ status           │     │ created_at  │
│ status       │     │ created_at       │     └─────────────┘
│ category     │     └──────────────────┘
│ perplexity_  │            │
│   research   │            │
│ created_at   │            ▼
└──────────────┘     ┌──────────────┐
                     │   articles   │
                     ├──────────────┤
                     │ id (PK)      │
                     │ title        │
                     │ slug (UQ)    │
                     │ content_html │
                     │ status       │
                     │ category     │
                     │ freshness    │
                     │ hero_image   │
                     │ meta_desc    │
                     │ keywords[]   │
                     │ published_at │
                     │ created_at   │
                     │ updated_at   │
                     └──────────────┘
```

### Enums

| Enum | Valori |
|------|--------|
| `article_status` | idea, researching, drafting, humanizing, reviewing, ready, published |
| `article_category` | casi_duso, ai_news, web_dev, tools, tutorial, opinioni |
| `idea_status` | new, selected, rejected, used |
| `calendar_status` | planned, in_progress, completed, skipped |

### RLS Policies

| Tabella | Policy | Regola |
|---------|--------|--------|
| articles | Public read | Solo `status = 'published'` |
| articles | Service role | Full CRUD |
| ideas | Service role | Full CRUD |
| subscribers | Service role | Full CRUD |
| editorial_calendar | Service role | Full CRUD |

### Indici

- `idx_articles_status` — filtro per stato workflow
- `idx_articles_slug` — lookup articolo per URL
- `idx_articles_category` — filtro per categoria
- `idx_articles_published_at` — ordinamento cronologico
- `idx_ideas_status` — filtro idee per stato
- `idx_calendar_scheduled_date` — ordinamento calendario

### Trigger

- `articles_updated_at` — aggiorna automaticamente `updated_at` su ogni UPDATE

## API Routes

### `GET /api/articles`
Ritorna articoli pubblicati con paginazione.

| Param | Tipo | Default | Descrizione |
|-------|------|---------|-------------|
| category | string | - | Filtra per categoria |
| limit | number | 10 | Max risultati |

**Response**: `{ articles: Article[], total: number }`

### `POST /api/articles`
Crea nuovo articolo. Richiede autenticazione admin.

**Body**: `{ title, category, content_html? }`
**Response**: `{ success: boolean, article?: Article }`

### `POST /api/cron/generate-ideas`
Cron job per generare idee via Perplexity. Autenticazione via `Bearer CRON_SECRET`.

### `POST /api/workflow/draft`
Genera bozza da ricerca. Body: `{ articleId }`.

### `POST /api/workflow/humanize`
Umanizza bozza con Claude. Body: `{ articleId }`.

### `POST /api/workflow/images`
Genera hero image. Body: `{ articleId }`.

### `POST /api/notify`
Invia notifica email via Resend. Body: `{ articleId }`.

## Supabase Client

Tre client per contesti diversi:

| Client | File | Uso |
|--------|------|-----|
| Browser | `lib/supabase/client.ts` | Client Components, interazioni utente |
| Server | `lib/supabase/server.ts` | Server Components, SSR con cookies |
| Admin | `lib/supabase/admin.ts` | API Routes, bypass RLS con service_role |
