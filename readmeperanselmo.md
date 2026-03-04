# IlVantaggioAI — Checklist Setup

## 1. API Keys da Ottenere

- [ ] **Supabase**: Crea progetto su [supabase.com](https://supabase.com)
  - Copia `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - Copia `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Copia `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`
  - Esegui `supabase/migrations/001_initial_schema.sql` nell'SQL Editor

- [ ] **Perplexity**: [perplexity.ai/settings/api](https://perplexity.ai/settings/api)
  - Copia API key → `PERPLEXITY_API_KEY`

- [ ] **Kimi 2.5**: [platform.moonshot.cn](https://platform.moonshot.cn) oppure via OpenRouter
  - Copia API key → `KIMI_API_KEY`

- [ ] **Anthropic (Claude)**: [console.anthropic.com](https://console.anthropic.com)
  - Copia API key → `ANTHROPIC_API_KEY`

- [ ] **Google AI (Gemini)**: [aistudio.google.com](https://aistudio.google.com)
  - Copia API key → `GOOGLE_AI_API_KEY`

- [ ] **Resend**: [resend.com](https://resend.com)
  - Copia API key → `RESEND_API_KEY`

## 2. Domain Setup

- [ ] Registra dominio `ilvantaggioai.it` (se non già fatto)
- [ ] Aggiungi dominio su Vercel: Settings → Domains
- [ ] Configura DNS: CNAME `@` → `cname.vercel-dns.com`
- [ ] Verifica propagazione DNS (può richiedere 24-48h)

## 3. Supabase Setup

- [ ] Crea nuovo progetto Supabase
- [ ] Vai su SQL Editor e esegui il contenuto di `supabase/migrations/001_initial_schema.sql`
- [ ] Verifica che le tabelle siano state create (Database → Tables)
- [ ] Verifica RLS policies attive (Authentication → Policies)

## 4. Deploy Vercel

```bash
# Primo deploy
vercel

# Imposta env vars su Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... ripeti per tutte le variabili

# Deploy produzione
vercel --prod
```

## 5. Post-Deploy Verifiche

- [ ] Homepage carica correttamente (`/`)
- [ ] Pagina blog funziona (`/blog/test`)
- [ ] Admin dashboard raggiungibile (`/admin/dashboard`)
- [ ] Admin ideas raggiungibile (`/admin/ideas`)
- [ ] API articles risponde (`/api/articles`)
- [ ] API cron risponde (`/api/cron/generate-ideas`)
- [ ] Dark mode attivo di default
- [ ] Mobile responsive funzionante

## 6. Cose da Fare Dopo il Setup

- [ ] Implementare auth admin (semplice password check)
- [ ] Completare editor TipTap
- [ ] Implementare wrapper AI reali (ora sono stub)
- [ ] Configurare cron su Vercel (`vercel.json`)
- [ ] Setup email templates Resend
- [ ] SEO: sitemap, robots.txt, structured data
- [ ] Analytics (Vercel Analytics o Plausible)

## Note

- **ADMIN_PASSWORD**: Scegli una password forte per l'accesso admin. Per MVP si usa un semplice check in middleware.
- **CRON_SECRET**: Genera un token random (`openssl rand -hex 32`) per proteggere gli endpoint cron.
- **Kimi 2.5**: Se Moonshot richiede verifica telefono cinese, usa OpenRouter come alternativa.
