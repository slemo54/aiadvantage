// Claude API wrapper — direct fetch (no SDK dependency)

import { resolvePrompt, interpolatePrompt, appendKnowledgeBase } from "./prompt-resolver";

interface AnthropicContentBlock {
  type: string;
  text?: string;
}

interface AnthropicResponse {
  content: AnthropicContentBlock[];
}

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

async function callAnthropic(
  apiKey: string,
  prompt: string,
  attempt: number = 1
): Promise<AnthropicResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Overloaded — retry with backoff
      if (response.status === 529 && attempt < 3) {
        const delay = attempt * 5000;
        console.warn(`${LOG} Overloaded (529), retry #${attempt + 1} in ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return callAnthropic(apiKey, prompt, attempt + 1);
      }

      // Rate limit — retry with backoff
      if (response.status === 429 && attempt < 3) {
        const delay = attempt * 3000;
        console.warn(`${LOG} Rate limited (429), retry #${attempt + 1} in ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return callAnthropic(apiKey, prompt, attempt + 1);
      }

      throw new Error(`${LOG} HTTP ${response.status}: ${errorText.slice(0, 400)}`);
    }

    return response.json() as Promise<AnthropicResponse>;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(`${LOG} Timeout after ${TIMEOUT_MS}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export async function humanizeText(draft: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY non configurata. Aggiungila nelle variabili d'ambiente."
    );
  }

  if (!draft.trim()) {
    throw new Error(`${LOG} Il testo da umanizzare è vuoto.`);
  }

  // Resolve prompt from DB or fallback to hardcoded
  const { promptText: dbPrompt, knowledgeContext } = await resolvePrompt("humanize");
  const prompt = dbPrompt
    ? appendKnowledgeBase(interpolatePrompt(dbPrompt, { draft }), knowledgeContext)
    : buildHumanizePrompt(draft);
  const data = await callAnthropic(apiKey, prompt);

  const textBlock = data.content.find((block) => block.type === "text");
  const content = textBlock?.text ?? "";

  if (!content.trim()) {
    throw new Error(`${LOG} Claude ha restituito una risposta vuota.`);
  }

  const result = content
    .replace(/^```html?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  console.log(`${LOG} Humanized output: ${result.length} chars`);
  return result;
}
