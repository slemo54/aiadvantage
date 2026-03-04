# IlVantaggioAI — Agent Documentation

> AI coding agent reference for the IlVantaggioAI project.
> Last updated: 2026-03-04

---

## Project Overview

IlVantaggioAI is an Italian AI blog (`ilvantaggioai.it`) featuring an automated editorial workflow that leverages multiple AI providers to research, draft, humanize, and publish content. The system follows a 7-state workflow pipeline from idea generation to publication.

### Key Purpose
- **Public**: Display AI-related articles in Italian across 6 categories
- **Admin**: Manage editorial calendar, review AI-generated content, publish articles
- **Automation**: AI-powered content pipeline (Perplexity → Kimi → Claude → Gemini)

---

## Technology Stack

| Layer | Technology | Version/Notes |
|-------|------------|---------------|
| Framework | Next.js | 14.2.35 (App Router) |
| Language | TypeScript | 5.x, strict mode enabled |
| UI Library | React | 18.x |
| Styling | Tailwind CSS | 3.4.1 |
| UI Components | shadcn/ui | New York style |
| Icons | Lucide React | - |
| Database | Supabase | PostgreSQL + RLS |
| AI Providers | Perplexity, Kimi, Claude, Gemini | Multiple APIs |
| Email | Resend | Transactional emails |
| Deployment | Vercel | Serverless, Edge |

---

## Project Structure

```
ilvantaggioai/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public route group
│   │   ├── blog/[slug]/          # Article pages (SSR)
│   │   ├── layout.tsx            # Public layout
│   │   └── page.tsx              # Homepage
│   ├── admin/                    # Admin dashboard
│   │   ├── dashboard/            # Editorial calendar
│   │   ├── ideas/                # Topic ideas management
│   │   ├── editor/               # TipTap editor (WIP)
│   │   ├── agent/                # AI assistant (WIP)
│   │   ├── settings/             # Configuration
│   │   └── layout.tsx            # Admin layout (no header/footer)
│   ├── admin-login/              # Admin authentication
│   ├── api/                      # API Routes
│   │   ├── articles/             # CRUD articles
│   │   ├── ideas/                # Ideas management
│   │   ├── cron/generate-ideas   # Cron: AI topic research
│   │   ├── workflow/             # Workflow automation
│   │   │   ├── draft             # Generate draft (Kimi)
│   │   │   ├── humanize          # Humanize text (Claude)
│   │   │   └── images            # Generate images (Gemini)
│   │   ├── notify                # Email notifications
│   │   └── admin/                # Admin auth endpoints
│   ├── globals.css               # Tailwind + CSS variables
│   ├── layout.tsx                # Root layout
│   └── providers.tsx             # Theme provider
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Header, Footer, AdminSidebar
│   ├── blog/                     # ArticleCard
│   └── admin/                    # IdeaCard, StatusBadge, TipTap editor
├── lib/
│   ├── ai/                       # AI provider wrappers
│   │   ├── perplexity.ts         # Research API
│   │   ├── kimi.ts               # Draft generation
│   │   ├── claude.ts             # Text humanization
│   │   ├── gemini.ts             # Image generation
│   │   └── pipeline.ts           # Workflow state machine
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server Component client
│   │   └── admin.ts              # Admin client (service_role)
│   ├── types.ts                  # TypeScript interfaces
│   ├── constants.ts              # Categories, workflow states
│   └── utils.ts                  # cn(), slugify(), formatDate()
├── supabase/migrations/          # SQL schema
├── docs/architecture/            # Detailed documentation
├── middleware.ts                 # Admin route protection
└── vercel.json                   # Cron configuration
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Development server (localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint (ESLint)
npm run lint
```

---

## Environment Variables

Create `.env.local` from `.env.local.example`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Providers
PERPLEXITY_API_KEY=
KIMI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_AI_API_KEY=

# Email
RESEND_API_KEY=
ADMIN_EMAIL=

# Security
ADMIN_PASSWORD=              # SHA-256 hashed for session
CRON_SECRET=                 # Bearer token for cron endpoints

# Site
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SITE_NAME=
```

---

## Code Conventions

### Language Rules
- **UI Text**: Italian (user-facing strings, labels, messages)
- **Code**: English (variables, functions, comments, file names)
- **Comments**: English, technical focus

### TypeScript
- Strict mode enabled (`noImplicitAny`, `strictNullChecks`)
- Use interfaces from `lib/types.ts`
- No `any` types without explicit justification
- Path alias `@/*` maps to project root

### Styling
- **Dark mode default**: CSS variables in `globals.css`
- **Tailwind first**: Use utility classes; avoid custom CSS when possible
- **shadcn/ui**: Base components in `components/ui/`
- **Category colors**: Defined in `lib/constants.ts` with accent hex values

### Naming Conventions
```typescript
// Components: PascalCase
export function ArticleCard() {}

// Functions: camelCase
async function generateDraft() {}

// Constants: UPPER_SNAKE_CASE
const WORKFLOW_STATES = [...]

// Types: PascalCase with descriptive names
interface ArticleCreateInput {}
type WorkflowState = ...

// Files: kebab-case
article-card.tsx
use-articles.ts
```

---

## Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `articles` | Blog posts with workflow state |
| `ideas` | AI-generated topic ideas |
| `subscribers` | Email subscribers |
| `editorial_calendar` | Publishing schedule |

### Enums

```sql
article_status: idea → researching → drafting → humanizing → reviewing → ready → published
article_category: casi_duso | ai_news | web_dev | tools | tutorial | opinioni
idea_status: new | selected | rejected | used
calendar_status: planned | in_progress | completed | skipped
```

### RLS Policies
- Public: Read `articles` only where `status = 'published'`
- Service role: Full CRUD on all tables (API routes use `SUPABASE_SERVICE_ROLE_KEY`)

### Indexes
Key indexes on: `status`, `slug`, `category`, `published_at`, `scheduled_date`

---

## Workflow State Machine

The editorial workflow follows this linear pipeline:

```
idea → researching → drafting → humanizing → reviewing → ready → published
```

| State | Trigger | Action | API Route |
|-------|---------|--------|-----------|
| idea | Cron/manual | Research topic | `/api/cron/generate-ideas` |
| researching | Auto | Generate draft | `/api/workflow/draft` |
| drafting | Auto | Humanize text | `/api/workflow/humanize` |
| humanizing | Auto | Ready for review | (notification) |
| reviewing | Manual | Admin approves + image | `/api/workflow/images` |
| ready | Manual | Publish + notify | (admin action) |
| published | - | Final state | - |

Transition logic is in `lib/ai/pipeline.ts`.

---

## API Routes

### Public
- `GET /api/articles?category=&limit=` — List published articles

### Admin (requires auth)
- `POST /api/articles` — Create article
- `GET/PUT/DELETE /api/articles` — CRUD operations

### Workflow (protected)
- `POST /api/cron/generate-ideas` — Trigger AI research (requires `Bearer CRON_SECRET`)
- `POST /api/workflow/draft` — Generate draft from research
- `POST /api/workflow/humanize` — Humanize draft with Claude
- `POST /api/workflow/images` — Generate hero image
- `POST /api/notify` — Send email notification

### Authentication
- `POST /api/admin/auth` — Login (sets `admin_session` cookie)
- `POST /api/admin/logout` — Clear session

---

## Security Considerations

### Admin Authentication
- Simple cookie-based session with SHA-256 hashed password
- Middleware (`middleware.ts`) protects `/admin/*` routes
- Session cookie compared against `hash(ADMIN_PASSWORD)`
- No session = redirect to `/admin-login`

### API Security
- Cron endpoints require `Authorization: Bearer CRON_SECRET`
- Admin API routes check session cookie
- Supabase RLS prevents unauthorized DB access

### Database
- Service role key only used in API routes (never client-side)
- Anon key for browser/client operations
- RLS policies enforce public read-only on published content

---

## AI Provider Integration

### Perplexity (`lib/ai/perplexity.ts`)
- **Model**: sonar-pro
- **Purpose**: Research trending AI topics
- **Features**: Web search, source citations, freshness scoring
- **Retry**: 3 attempts with exponential backoff on 429

### Kimi 2.5 (`lib/ai/kimi.ts`)
- **Purpose**: Generate article drafts from research
- **Output**: HTML formatted content (h2, p, ul, li)
- **Length**: 1200-1800 words

### Claude (`lib/ai/claude.ts`)
- **Model**: claude-sonnet-4-20250514
- **Purpose**: Humanize AI-generated text
- **Focus**: Natural tone, Italian idioms, flow improvement

### Gemini (`lib/ai/gemini.ts`)
- **Purpose**: Generate hero images for articles
- **Integration**: Google AI Studio / Vertex AI

---

## Testing Strategy

### Current State
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **No automated tests**: Project relies on manual testing

### Manual Testing Checklist
1. Homepage loads with dark theme
2. Blog article pages render correctly (`/blog/[slug]`)
3. Admin login works with correct password
4. Admin dashboard displays ideas and calendar
5. API routes respond correctly:
   - `GET /api/articles` returns published articles
   - `POST /api/cron/generate-ideas` with CRON_SECRET works
6. TipTap editor loads without errors

---

## Deployment

### Vercel Configuration
- `vercel.json` defines cron job schedule: `0 8 */3 * *` (every 3 days at 8am)
- Environment variables set via Vercel dashboard or CLI
- Auto-deploy on git push to main branch

### Pre-deployment Checklist
- [ ] All environment variables configured in Vercel
- [ ] Supabase migrations applied
- [ ] RLS policies active
- [ ] Domain configured and DNS propagated
- [ ] Admin password set (strong, hashed)
- [ ] CRON_SECRET generated (`openssl rand -hex 32`)

---

## Common Issues & Solutions

### Build Errors
```bash
# Type errors - check lib/types.ts matches DB schema
# Clear .next cache
rm -rf .next
npm run build
```

### Supabase Connection
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check RLS policies if queries return empty
- Use admin client for API routes, server client for SSR

### AI API Failures
- Perplexity: Check rate limits (429 errors trigger retry)
- Kimi: May require phone verification; OpenRouter is alternative
- All AI wrappers have timeout handling (30s) and error logging

---

## Documentation References

Detailed architecture docs in `docs/architecture/`:
- `index.md` — Quick start and conventions
- `1-system-overview.md` — System architecture, tech rationale
- `2-frontend-architecture.md` — Routes, components, styling
- `3-backend-data-architecture.md` — DB schema, API details, RLS
- `4-ai-workflows.md` — Pipeline prompts, cost estimates

Setup checklist: `readmeperanselmo.md`

---

## File Templates

### New API Route
```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const Schema = z.object({
  // validation schema
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    // implementation
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API Error]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

### New Component
```typescript
// components/example/my-component.tsx
import { cn } from "@/lib/utils";

interface MyComponentProps {
  className?: string;
  // other props
}

export function MyComponent({ className }: MyComponentProps) {
  return (
    <div className={cn("base-classes", className)}>
      {/* content */}
    </div>
  );
}
```

---

## Contact & Maintenance

- **Project**: IlVantaggioAI
- **Domain**: ilvantaggioai.it
- **Admin Email**: Configured in `ADMIN_EMAIL` env var
- **Stack**: Next.js 14 + Supabase + Vercel

---

*This documentation is maintained for AI coding agents. Update when making architectural changes.*
