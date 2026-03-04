# 4. AI Workflows

## Pipeline Overview

```
┌─────────┐    ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌─────────┐
│ STEP 1  │───▶│ STEP 2  │───▶│  STEP 3  │───▶│  STEP 4  │───▶│ STEP 5  │
│Perplexity│    │ Kimi 2.5│    │  Claude  │    │  Review  │    │ Publish │
│ Research │    │  Draft  │    │ Humanize │    │ (Manual) │    │+ Notify │
└─────────┘    └─────────┘    └──────────┘    └──────────┘    └─────────┘
```

## Step 1: Ricerca Topic (Perplexity)

**Trigger**: Cron ogni 72h (o manuale)
**API**: Perplexity `sonar-pro`
**File**: `lib/ai/perplexity.ts`

### Prompt Template
```
Sei un ricercatore esperto di tecnologia e intelligenza artificiale.
Analizza le ultime tendenze AI degli ultimi 3 giorni.

Trova 5 topic interessanti per un blog italiano sull'AI, focalizzandoti su:
- Nuovi strumenti e tool AI
- Casi d'uso pratici per professionisti e aziende
- Novità da OpenAI, Anthropic, Google, Meta
- Impatto dell'AI sul lavoro e sulla società italiana
- Tutorial pratici per sviluppatori

Per ogni topic fornisci:
1. Titolo proposto (in italiano, max 80 caratteri)
2. Breve descrizione (2-3 frasi)
3. Fonti principali (URL)
4. Categoria suggerita: casi_duso | ai_news | web_dev | tools | tutorial | opinioni
5. Punteggio freschezza (0-100, quanto è attuale)

Rispondi in formato JSON.
```

## Step 2: Generazione Bozza (Kimi 2.5)

**Trigger**: Automatico dopo Step 1
**API**: Kimi 2.5 (via Moonshot o OpenRouter)
**File**: `lib/ai/kimi.ts`

### Prompt Template
```
Sei un content writer esperto di tecnologia e AI.
Scrivi un articolo blog in italiano basandoti su questa ricerca:

{research_content}

Requisiti:
- Titolo accattivante (max 80 caratteri)
- Introduzione che cattura l'attenzione (2-3 paragrafi)
- 3-5 sezioni con sottotitoli H2
- Esempi pratici e casi d'uso concreti
- Conclusione con call-to-action
- Lunghezza: 1200-1800 parole
- Tono: professionale ma accessibile
- Target: professionisti italiani interessati all'AI

Formatta in HTML (h2, p, ul, li, strong, em). Non usare h1 (è nel layout).
```

## Step 3: Umanizzazione (Claude)

**Trigger**: Automatico dopo Step 2
**API**: Claude (claude-sonnet-4-20250514)
**File**: `lib/ai/claude.ts`

### Prompt Template
```
Sei un editor esperto che rende i testi AI più naturali e coinvolgenti.

Riscrivi questo articolo mantenendo il contenuto ma migliorando:
- Tono conversazionale naturale (non robotico)
- Transizioni fluide tra le sezioni
- Espressioni idiomatiche italiane dove appropriato
- Variazione nella struttura delle frasi
- Rimuovi ripetizioni e frasi generiche
- Aggiungi opinioni e prospettive personali dove possibile

Articolo originale:
{draft_content}

Mantieni il formato HTML. Non modificare i fatti o le fonti citate.
```

## Step 4: Review Manuale

**Trigger**: Notifica admin via UI
**Azioni admin**:
- Revisione contenuto nell'editor TipTap
- Modifica titolo, meta description, keywords
- Approvazione → genera immagine hero (Gemini)
- Reject → torna a step 2

## Step 5: Pubblicazione

**Trigger**: Admin clicca "Pubblica"
**Azioni**:
1. Status → `published`, set `published_at`
2. Genera immagine hero via Gemini/Imagen
3. Notifica subscribers via Resend
4. Invalida cache SSR

## Cron Configuration

Per Vercel (hobby plan, minimo daily):

```json
// vercel.json (da aggiungere in futuro)
{
  "crons": [{
    "path": "/api/cron/generate-ideas",
    "schedule": "0 8 */3 * *"
  }]
}
```

Il handler controlla internamente se sono passate 72h dall'ultimo run.

## Gestione Errori

| Errore | Strategia |
|--------|-----------|
| API timeout | Retry con backoff (max 3 tentativi) |
| Rate limit | Queue con delay, fallback su modello alternativo |
| Contenuto inappropriato | Flag per review manuale |
| Errore DB | Log + notifica admin, rollback stato |

## Costi Stimati (mensili, ~20 articoli)

| Servizio | Costo Stimato |
|----------|--------------|
| Perplexity sonar-pro | ~$5 |
| Kimi 2.5 | ~$2 |
| Claude Sonnet | ~$3 |
| Gemini Pro | ~$1 |
| Resend | Free tier (100/day) |
| Supabase | Free tier |
| Vercel | Free tier (hobby) |
| **Totale** | **~$11/mese** |
