// Venice AI wrapper — draft, humanize, SEO generation

import { resolvePrompt, interpolatePrompt } from "./prompt-resolver";

const LOG = "[ai/venice]";
const TIMEOUT_MS = 30_000;
const API_URL = "https://api.venice.ai/api/v1/chat/completions";
const MODEL = "venice-uncensored";

interface VeniceMessage {
  role: string;
  content: string;
}

interface VeniceChoice {
  message: VeniceMessage;
}

interface VeniceResponse {
  choices: VeniceChoice[];
}

interface SEOResult {
  meta_description: string;
  keywords: string[];
  slug: string;
}

// ---------------------------------------------------------------------------
// Default prompts (used when prompt-resolver has no DB entry)
// ---------------------------------------------------------------------------

const DEFAULT_DRAFT_PROMPT = `Sei un content writer esperto di tecnologia e AI.
Scrivi un articolo blog in italiano basandoti su questa ricerca:

{{research}}

Requisiti:
- Titolo accattivante (max 80 caratteri)
- Introduzione che cattura l'attenzione (2-3 paragrafi)
- 3-5 sezioni con sottotitoli H2
- Esempi pratici e casi d'uso concreti relativi alla categoria: {{category}}
- Conclusione con call-to-action
- Lunghezza: 1200-1800 parole
- Tono: professionale ma accessibile
- Target: professionisti italiani interessati all'AI

Formatta in HTML (h2, p, ul, li, strong, em). Non usare h1 (è nel layout).
Rispondi SOLO con l'HTML dell'articolo, senza markdown o testo aggiuntivo.`;

const DEFAULT_HUMANIZE_PROMPT = `Sei un editor esperto che rende i testi AI più naturali e coinvolgenti.

Riscrivi questo articolo mantenendo il contenuto ma migliorando:
- Tono conversazionale naturale (non robotico)
- Transizioni fluide tra le sezioni
- Espressioni idiomatiche italiane dove appropriato
- Variazione nella struttura delle frasi
- Rimuovi ripetizioni e frasi generiche
- Aggiungi opinioni e prospettive personali dove possibile

Articolo originale:
{{html}}

Mantieni il formato HTML. Non modificare i fatti o le fonti citate.
Rispondi SOLO con l'HTML dell'articolo riscritto, senza markdown o testo aggiuntivo.`;

const DEFAULT_SEO_PROMPT = `Analizza questo articolo e genera metadata SEO ottimizzati.

Titolo: {{title}}

Contenuto:
{{content}}

Rispondi SOLO con un oggetto JSON valido (niente markdown, niente testo extra):
{
  "meta_description": "descrizione max 160 caratteri, in italiano, persuasiva e con keyword principale",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "slug": "slug-url-ottimizzato-seo"
}`;

// ---------------------------------------------------------------------------
// Core fetch helper
// ---------------------------------------------------------------------------

function stripCodeFences(text: string): string {
  return text
    .replace(/^```(?:html|json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

async function callVenice(
  apiKey: string,
  prompt: string,
  maxTokens: number = 4000,
  attempt: number = 1
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }] as VeniceMessage[],
        temperature: 0.75,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();

      if (response.status === 429 && attempt < 3) {
        const delay = attempt * 3000;
        console.warn(`${LOG} Rate limited (429), retry #${attempt + 1} in ${delay}ms`);
        await new Promise((r) => setTimeout(r, delay));
        return callVenice(apiKey, prompt, maxTokens, attempt + 1);
      }

      throw new Error(`${LOG} HTTP ${response.status}: ${errorText.slice(0, 400)}`);
    }

    const data = (await response.json()) as VeniceResponse;
    const content = data.choices?.[0]?.message?.content ?? "";

    if (!content.trim()) {
      throw new Error(`${LOG} Empty response from Venice AI`);
    }

    return stripCodeFences(content);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(`${LOG} Timeout after ${TIMEOUT_MS}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

function getApiKey(): string {
  const key = process.env.VENICE_API_KEY;
  if (!key) {
    throw new Error(
      "VENICE_API_KEY non configurata. Aggiungila su Vercel → Settings → Environment Variables."
    );
  }
  return key;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function generateDraft(
  research: string,
  category: string
): Promise<string> {
  const apiKey = getApiKey();

  let template: string;
  try {
    const resolved = await resolvePrompt("draft");
    template = resolved.promptText || DEFAULT_DRAFT_PROMPT;
  } catch {
    console.warn(`${LOG} prompt-resolver fallback to default draft prompt`);
    template = DEFAULT_DRAFT_PROMPT;
  }

  const prompt = interpolatePrompt(template, { research, category });

  console.log(`${LOG} Generating draft for category: ${category}`);
  const html = await callVenice(apiKey, prompt, 4000);
  console.log(`${LOG} Draft generated, ${html.length} chars`);
  return html;
}

export async function humanizeText(html: string): Promise<string> {
  const apiKey = getApiKey();

  if (!html.trim()) {
    throw new Error(`${LOG} Il testo da umanizzare è vuoto.`);
  }

  let template: string;
  try {
    const resolved = await resolvePrompt("humanize");
    template = resolved.promptText || DEFAULT_HUMANIZE_PROMPT;
  } catch {
    console.warn(`${LOG} prompt-resolver fallback to default humanize prompt`);
    template = DEFAULT_HUMANIZE_PROMPT;
  }

  const prompt = interpolatePrompt(template, { html });

  console.log(`${LOG} Humanizing text, input: ${html.length} chars`);
  const result = await callVenice(apiKey, prompt, 4096);
  console.log(`${LOG} Humanized, output: ${result.length} chars`);
  return result;
}

export async function generateSEO(
  title: string,
  content: string
): Promise<SEOResult> {
  const apiKey = getApiKey();

  let template: string;
  try {
    const resolved = await resolvePrompt("seo");
    template = resolved.promptText || DEFAULT_SEO_PROMPT;
  } catch {
    console.warn(`${LOG} prompt-resolver fallback to default SEO prompt`);
    template = DEFAULT_SEO_PROMPT;
  }

  const prompt = interpolatePrompt(template, { title, content: content.slice(0, 3000) });

  console.log(`${LOG} Generating SEO for: "${title}"`);
  const raw = await callVenice(apiKey, prompt, 1000);

  // Extract JSON object from response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`${LOG} SEO response is not valid JSON: ${raw.slice(0, 200)}`);
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as SEOResult;

    if (!parsed.meta_description || !parsed.keywords || !parsed.slug) {
      throw new Error("Missing required SEO fields");
    }

    console.log(`${LOG} SEO generated: slug=${parsed.slug}, ${parsed.keywords.length} keywords`);
    return parsed;
  } catch (err) {
    throw new Error(`${LOG} SEO JSON parse error: ${String(err)}`);
  }
}
