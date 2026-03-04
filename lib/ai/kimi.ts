// Kimi via OpenRouter — moonshot-v1-8k with Claude fallback

interface OpenRouterMessage {
  role: string;
  content: string;
}

interface OpenRouterChoice {
  message: OpenRouterMessage;
}

interface OpenRouterResponse {
  choices: OpenRouterChoice[];
}

const PRIMARY_MODEL = "moonshotai/moonshot-v1-8k";
const FALLBACK_MODEL = "anthropic/claude-3-5-sonnet";

function buildDraftPrompt(research: string, category: string): string {
  return `Sei un content writer esperto di tecnologia e AI.
Scrivi un articolo blog in italiano basandoti su questa ricerca:

${research}

Requisiti:
- Titolo accattivante (max 80 caratteri)
- Introduzione che cattura l'attenzione (2-3 paragrafi)
- 3-5 sezioni con sottotitoli H2
- Esempi pratici e casi d'uso concreti relativi alla categoria: ${category}
- Conclusione con call-to-action
- Lunghezza: 1200-1800 parole
- Tono: professionale ma accessibile
- Target: professionisti italiani interessati all'AI

Formatta in HTML (h2, p, ul, li, strong, em). Non usare h1 (è nel layout).
Rispondi SOLO con l'HTML dell'articolo, senza markdown o testo aggiuntivo.`;
}

async function callOpenRouter(
  apiKey: string,
  model: string,
  prompt: string,
  attempt: number = 1
): Promise<OpenRouterResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://ilvantaggioai.it",
          "X-Title": "IlVantaggioAI",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.75,
          max_tokens: 3000,
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429 && attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 3000));
        return callOpenRouter(apiKey, model, prompt, attempt + 1);
      }
      throw new Error(
        `OpenRouter API error ${response.status} (model: ${model}): ${errorText}`
      );
    }

    return response.json() as Promise<OpenRouterResponse>;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateDraft(
  research: string,
  category: string
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY non configurata. Aggiungila nelle variabili d'ambiente."
    );
  }

  const prompt = buildDraftPrompt(research, category);

  let data: OpenRouterResponse;
  try {
    data = await callOpenRouter(apiKey, PRIMARY_MODEL, prompt);
  } catch (primaryError) {
    console.warn(
      `Kimi (${PRIMARY_MODEL}) fallito, tentativo con fallback ${FALLBACK_MODEL}:`,
      primaryError
    );
    try {
      data = await callOpenRouter(apiKey, FALLBACK_MODEL, prompt);
    } catch (fallbackError) {
      throw new Error(
        `Entrambi i modelli hanno fallito. Primario: ${String(primaryError)}. Fallback: ${String(fallbackError)}`
      );
    }
  }

  const content = data.choices[0]?.message?.content ?? "";
  if (!content.trim()) {
    throw new Error("OpenRouter ha restituito una risposta vuota.");
  }

  // Strip any markdown code fences the model might wrap HTML in
  return content
    .replace(/^```html?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}
