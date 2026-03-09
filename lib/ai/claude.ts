// Claude API wrapper — direct fetch (no SDK dependency)

import { resolvePrompt, interpolatePrompt, appendKnowledgeBase } from "./prompt-resolver";

interface AnthropicContentBlock {
  type: string;
  text?: string;
}

interface AnthropicResponse {
  content: AnthropicContentBlock[];
}

const MODEL = "claude-sonnet-4-6";
const ANTHROPIC_VERSION = "2023-06-01";

function buildHumanizePrompt(draft: string): string {
  return `Sei un editor esperto che rende i testi AI più naturali e coinvolgenti.

Riscrivi questo articolo mantenendo il contenuto ma migliorando:
- Tono conversazionale naturale (non robotico)
- Transizioni fluide tra le sezioni
- Espressioni idiomatiche italiane dove appropriato
- Variazione nella struttura delle frasi
- Rimuovi ripetizioni e frasi generiche
- Aggiungi opinioni e prospettive personali dove possibile

Articolo originale:
${draft}

Mantieni il formato HTML. Non modificare i fatti o le fonti citate.
Rispondi SOLO con l'HTML dell'articolo riscritto, senza markdown o testo aggiuntivo.`;
}

async function callAnthropic(
  apiKey: string,
  prompt: string,
  attempt: number = 1
): Promise<AnthropicResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

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
      if (response.status === 529 && attempt < 3) {
        // Overloaded: retry with backoff
        await new Promise((resolve) => setTimeout(resolve, attempt * 5000));
        return callAnthropic(apiKey, prompt, attempt + 1);
      }
      if (response.status === 429 && attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 3000));
        return callAnthropic(apiKey, prompt, attempt + 1);
      }
      throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
    }

    return response.json() as Promise<AnthropicResponse>;
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
    throw new Error("Il testo da umanizzare è vuoto.");
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
    throw new Error("Claude ha restituito una risposta vuota.");
  }

  return content
    .replace(/^```html?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}
