// Perplexity API wrapper — sonar-pro with sonar fallback

import { resolvePrompt, appendKnowledgeBase } from "./prompt-resolver";

interface PerplexityTopicResult {
  titolo: string;
  descrizione: string;
  fonti: string[];
  categoria: string;
  freshness_score: number;
}

interface PerplexityResearchResult {
  summary: string;
  sources: string[];
  freshness_score: number;
  raw_topics: PerplexityTopicResult[];
}

interface PerplexityMessage {
  role: string;
  content: string;
}

interface PerplexityChoice {
  message: PerplexityMessage;
}

interface PerplexityResponse {
  choices: PerplexityChoice[];
}

const LOG = "[ai/perplexity]";
const TIMEOUT_MS = 30_000;

const RESEARCH_PROMPT = `Sei un ricercatore esperto di tecnologia e intelligenza artificiale.
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

Rispondi SOLO con un array JSON valido, senza testo aggiuntivo, nel formato:
[
  {
    "titolo": "...",
    "descrizione": "...",
    "fonti": ["url1", "url2"],
    "categoria": "ai_news",
    "freshness_score": 85
  }
]`;

// Models to try in order
const MODELS = ["sonar-pro", "sonar"];

async function callPerplexity(
  apiKey: string,
  model: string,
  prompt: string,
  attempt: number = 1
): Promise<PerplexityResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Rate limit — retry with exponential backoff (max 3 attempts)
      if (response.status === 429 && attempt < 3) {
        const delay = attempt * 3000;
        console.warn(`${LOG} Rate limited (429), retry #${attempt + 1} in ${delay}ms`);
        await new Promise((r) => setTimeout(r, delay));
        return callPerplexity(apiKey, model, prompt, attempt + 1);
      }

      throw new Error(
        `Perplexity ${model} HTTP ${response.status}: ${errorText.slice(0, 400)}`
      );
    }

    return response.json() as Promise<PerplexityResponse>;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(`${LOG} Timeout after ${TIMEOUT_MS}ms (model: ${model})`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

async function callWithFallback(
  apiKey: string,
  prompt: string
): Promise<PerplexityResponse> {
  let lastError: unknown;

  for (const model of MODELS) {
    try {
      console.log(`${LOG} Trying model: ${model}`);
      const result = await callPerplexity(apiKey, model, prompt);
      console.log(`${LOG} Success with model: ${model}`);
      return result;
    } catch (err) {
      console.warn(`${LOG} Model ${model} failed:`, String(err));
      lastError = err;
    }
  }

  throw lastError;
}

export async function researchTopic(
  topic: string = ""
): Promise<PerplexityResearchResult> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error(
      "PERPLEXITY_API_KEY non configurata. Aggiungila su Vercel → Settings → Environment Variables."
    );
  }

  // Resolve prompt from DB (falls back to hardcoded RESEARCH_PROMPT)
  const { promptText, knowledgeContext } = await resolvePrompt("research");
  const basePrompt = promptText || RESEARCH_PROMPT;
  const withKB = appendKnowledgeBase(basePrompt, knowledgeContext);
  const prompt = topic
    ? `${withKB}\n\nFocus particolare su: ${topic}`
    : withKB;

  const data = await callWithFallback(apiKey, prompt);

  const content = data.choices[0]?.message?.content ?? "";

  // Extract JSON array from response (model may wrap in markdown code fences)
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error(
      `${LOG} Non ha restituito JSON valido. Risposta: ${content.slice(0, 300)}`
    );
  }

  let topics: PerplexityTopicResult[];
  try {
    topics = JSON.parse(jsonMatch[0]) as PerplexityTopicResult[];
  } catch {
    throw new Error(
      `${LOG} Errore parsing JSON: ${jsonMatch[0].slice(0, 300)}`
    );
  }

  if (!Array.isArray(topics) || topics.length === 0) {
    throw new Error(`${LOG} Array vuoto o non valido.`);
  }

  const allSources = topics.flatMap((t) =>
    Array.isArray(t.fonti) ? t.fonti : []
  );

  const avgFreshness =
    topics.reduce((sum, t) => sum + (t.freshness_score ?? 50), 0) /
    topics.length;

  const summary = topics
    .map((t, i) => `${i + 1}. ${t.titolo}: ${t.descrizione}`)
    .join("\n\n");

  console.log(`${LOG} Found ${topics.length} topics, avg freshness: ${Math.round(avgFreshness)}`);

  return {
    summary,
    sources: allSources,
    freshness_score: Math.round(avgFreshness),
    raw_topics: topics,
  };
}
