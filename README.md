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

## URI funzionali attuali
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
1. Crea un articolo via API o backoffice.
2. Esegui `draft` per generare la bozza.
3. Esegui `humanize` per migliorare il tono editoriale.
4. Esegui `images` per generare la hero image.
5. Porta l’articolo in revisione e poi in pubblicazione.

## Non ancora implementato / migliorabile
- Valutazione automatica qualità immagine prima del salvataggio.
- Storage immagini su bucket/CDN invece di data URI nel database.
- Varianti multiple immagine con selezione automatica o manuale.
- SEO step e publishing flow completamente automatizzati.
- README operativo completo per ambiente locale, deploy e variabili.

## Prossimi step consigliati
1. Spostare le immagini generate su Supabase Storage / object storage.
2. Generare 2-4 varianti e salvare quella migliore tramite scoring AI.
3. Aggiungere metadati immagine (`prompt usato`, `model`, `timestamp`, `quality score`).
4. Introdurre controllo qualità automatico su testo indesiderato, volti/mani e leggibilità thumbnail.
5. Completare documentazione deploy e setup variabili ambiente.

## Stato deploy
- **Piattaforma corrente**: Next.js app
- **Status**: attivo in sviluppo
- **Ultimo aggiornamento**: 2026-03-14
