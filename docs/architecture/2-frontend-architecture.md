# 2. Frontend Architecture

## Routes

| Route | Tipo | Descrizione |
|-------|------|-------------|
| `/` | Pubblica | Home con listing articoli, filtro categorie |
| `/blog/[slug]` | Pubblica (SSR) | Singolo articolo, SEO ottimizzato |
| `/admin/dashboard` | Admin | Calendario editoriale, statistiche |
| `/admin/ideas` | Admin | Griglia idee, selezione topic |
| `/admin/editor` | Admin | Editor TipTap (futuro) |
| `/admin/agent` | Admin | Chat AI assistant (futuro) |

## Albero Componenti

```
RootLayout
├── Providers (ThemeProvider)
├── Header (logo, nav, dark mode toggle)
├── main
│   ├── HomePage
│   │   ├── Badge[] (filtri categoria)
│   │   └── ArticleCard[] (griglia articoli)
│   ├── BlogPage (articolo singolo)
│   └── AdminLayout
│       ├── AdminSidebar (nav verticale)
│       └── children
│           ├── DashboardPage (stats cards)
│           ├── IdeasPage → IdeaCard[]
│           ├── EditorPage (stub)
│           └── AgentPage (stub)
├── Footer (categorie, link, copyright)
└── Toaster (notifiche)
```

## Sistema Styling

### Dark Mode
- Default: dark (`#0a0a0a` bg, `#fafafa` text)
- Toggle via `next-themes` (classe `dark` su `<html>`)
- CSS variables in `globals.css` per light/dark

### Colori Categorie
Ogni categoria ha un colore accent definito in `lib/constants.ts`:

| Categoria | Colore | Hex |
|-----------|--------|-----|
| Casi d'Uso | Green | `#22c55e` |
| AI News | Blue | `#3b82f6` |
| Web Dev | Orange | `#f97316` |
| Tools | Purple | `#a855f7` |
| Tutorial | Cyan | `#06b6d4` |
| Opinioni | Rose | `#f43f5e` |

Usati in: Badge categorie, ArticleCard placeholder, bordi.

### Componenti UI
Base: shadcn/ui (Radix + Tailwind). Componenti installati:
`button`, `card`, `input`, `textarea`, `badge`, `dialog`, `dropdown-menu`, `tabs`, `separator`, `avatar`, `select`, `toast`, `sheet`, `skeleton`

## Layout Pubblico vs Admin

- **Pubblico**: Header + Footer wrappano il contenuto. Layout centrato con `container mx-auto`.
- **Admin**: Header + Footer nascosti (admin layout separato). Sidebar sinistra fissa + contenuto a destra.

## Font
Inter (Google Fonts) caricato via `next/font/google` nel root layout.
