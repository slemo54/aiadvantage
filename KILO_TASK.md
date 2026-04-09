# KILO TASK — IlVantaggioAI Fix

Data: 9 aprile 2026. Scadenza: ore 18:00 UTC.

## OBIETTIVO
Rendere il sito ilvantaggioai.it completamente professionale. Riferimento estetico: https://techsnif.com/

---

## TASK 1 — FRONTEND: elimina mock/placeholder

File: `app/(public)/page.tsx`
- Rimuovi SEED_ARTICLES e PLACEHOLDER_ARTICLES hardcoded
- Fetcha SOLO da Supabase via `/api/articles?status=published`
- Se vuoto: empty state elegante in italiano ("I nostri articoli stanno arrivando")
- NON importare più da `lib/seed-articles.ts`

File: `components/sections/*.tsx`
- Sostituisci testimonials falsi, statistiche inventate, features placeholder
- Copy professionale in italiano per un blog AI serio

Testi homepage:
- Hero tagline: "Il punto di riferimento italiano sull'intelligenza artificiale"
- Sottotitolo: "Analisi, guide pratiche e casi d'uso per professionisti che vogliono usare l'AI come vantaggio competitivo"
- About: "IlVantaggioAI è una pubblicazione editoriale dedicata a chi vuole capire e usare l'AI in modo concreto. Non hype, non paura: solo contenuti utili, approfonditi e sempre aggiornati."

---

## TASK 2 — PIPELINE FIX

### 2a. `app/api/workflow/draft/route.ts`
Problema: cerca un'idea `selected` qualsiasi, non quella collegata all'articolo.
Fix: se non trova idea collegata all'articolo per titolo, usa titolo+categoria dell'articolo come base per il draft (senza bisogno di idea separata).

### 2b. Venice Image Generation
Aggiungi in `lib/ai/venice.ts` una funzione `generateImageVenice(prompt: string): Promise<string | null>` che:
- Chiama `https://api.venice.ai/api/v1/image/generate`
- Usa model: `fluently-xl` 
- width: 1792, height: 1024
- Returns base64 data URI `data:image/png;base64,...`
- Retry su 429

Modifica `app/api/workflow/images/route.ts` per chiamare `generateImageVenice` invece di Gemini.

---

## TASK 3 — BLOG POST DI QUALITÀ

Crea `scripts/insert_article.js` che inserisce questo articolo in Supabase:

Title: "Come l'AI Sta Trasformando il Marketing Digitale Italiano nel 2026"
Slug: ai-marketing-digitale-italia-2026
Category: casi_duso
Status: ready
Meta_description: "Come le aziende italiane stanno usando l'AI per rivoluzionare marketing, contenuti e conversioni nel 2026."
Keywords: ["AI marketing", "intelligenza artificiale", "marketing digitale", "Italia", "conversioni", "contenuti AI"]

Content HTML (scrivi articolo completo 1500+ parole, professionale, SEO, con h2, esempi pratici italiani):

Supabase config:
- URL: https://qmeegftsbtmjnvlluokp.supabase.co
- service_role key: cerca in process.env.SUPABASE_SERVICE_ROLE_KEY

---

## TASK 4 — COMMIT & PUSH

git add -A
git commit -m "fix: rimuovi placeholder, fix pipeline draft/images con Venice, blog post marketing AI"
git push origin main

