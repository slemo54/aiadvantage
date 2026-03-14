# ilvantaggioai

## Panoramica progetto
- **Nome**: ilvantaggioai
- **Obiettivo**: piattaforma editoriale AI-first per generare, arricchire e pubblicare articoli blog su AI, web development, tool e casi d’uso.
- **Stack**: Next.js 14, TypeScript, Supabase, pipeline AI multi-step.

## Funzionalità completate
- Workflow articoli con stati: `idea -> researching -> drafting -> humanizing -> reviewing -> ready -> published`.
- API per gestione articoli con persistenza su Supabase.
- Pipeline AI con step distinti per ricerca, draft, humanize e immagini.
- Generazione hero image per blog post tramite Gemini.
- Miglioramento della pipeline immagini con:
  - prompt builder più ricco e specifico per categoria;
  - estrazione keyword visuali dal titolo;
  - vincoli più forti contro testo/loghi/watermark;
  - retry automatico con variante del prompt più pulita e focalizzata.
- Mega-upgrade UI/UX high-converting del frontend pubblico:
  - hero riposizionato come media brand premium italiano sull’AI;
  - header con messaging più autorevole e CTA più forti;
  - trust section orientata a conversione e posizionamento;
  - homepage più editoriale e premium;
  - newsletter section completamente ridisegnata per aumentare iscrizioni;
  - pagina articolo resa più coerente, autorevole e conversion-friendly.

## URI funzionali attuali
- `GET /` — homepage editoriale premium con hero, trust section, featured content e CTA newsletter.
- `GET /blog` — archivio articoli con ricerca, filtro categorie e view grid/list.
- `GET /blog/[slug]` — pagina articolo con hero editoriale, TOC, share, related posts e CTA newsletter.
- `GET /api/articles?status=&category=&limit=&page=` — lista articoli.
- `POST /api/articles` — crea un articolo.
- `POST /api/workflow/draft` — genera bozza da `articleId`.
- `POST /api/workflow/humanize` — umanizza contenuto da `articleId`.
- `POST /api/workflow/images` — genera hero image da `articleId`.

### Parametri principali
- Body workflow: `{ "articleId": "<uuid>" }`
- Body create article:
  - `title`
  - `slug`
  - `category`
  - `content_html?`
  - `status?`
  - `freshness_score?`
  - `hero_image_url?`
  - `meta_description?`
  - `keywords?`
  - `published_at?`

## Architettura dati
- **articles**: contenuti del blog, metadati, stato workflow, hero image.
- **ideas**: idee selezionate e ricerca collegata.
- **prompt_configs**: prompt configurabili per stage pipeline.
- **knowledge_base_files**: contesto extra per i prompt.
- **Storage**: Supabase database; immagini attualmente salvate come data URI in `hero_image_url`.

## Guida rapida utilizzo
1. Apri la homepage per consultare featured articles, category feed e CTA principali.
2. Vai su `/blog` per filtrare gli articoli per categoria o parola chiave.
3. Apri una pagina articolo per leggere il contenuto completo e usare share + indice.
4. Iscriviti alla newsletter nelle CTA presenti in homepage e article page.
5. Per la pipeline editoriale: crea un articolo, esegui `draft`, poi `humanize`, poi `images`.

## Non ancora implementato / migliorabile
- Valutazione automatica qualità immagine prima del salvataggio.
- Storage immagini su bucket/CDN invece di data URI nel database.
- Varianti multiple immagine con selezione automatica o manuale.
- SEO step e publishing flow completamente automatizzati.
- Tracking analytics per CTA, scroll depth e conversion rate.
- README operativo completo per ambiente locale, deploy e variabili.

## Prossimi step consigliati
1. Spostare le immagini generate su Supabase Storage / object storage.
2. Generare 2-4 varianti e salvare quella migliore tramite scoring AI.
3. Aggiungere metadati immagine (`prompt usato`, `model`, `timestamp`, `quality score`).
4. Introdurre controllo qualità automatico su testo indesiderato, volti/mani e leggibilità thumbnail.
5. Integrare analytics eventi su newsletter, click CTA e percorsi di conversione.
6. Aggiungere social proof reale, lead magnet e test A/B sulle CTA principali.

## Stato deploy
- **Piattaforma corrente**: Next.js app
- **Status**: attivo in sviluppo
- **Verifiche eseguite**:
  - `npx tsc --noEmit` ✅
  - `npm run build` ⚠️ worker terminato dal sandbox per limiti risorse, non per errori TypeScript rilevati
- **Ultimo aggiornamento**: 2026-03-14
