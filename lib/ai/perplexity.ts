// Perplexity API wrapper — sonar-pro model

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

async function callPerplexityWithRetry(
  apiKey: string,
  topic: string,
  attempt: number = 1
): Promise<PerplexityResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          {
            role: "user",
            content: topic
              ? `${RESEARCH_PROMPT}\n\nFocus particolare su: ${topic}`
              : RESEARCH_PROMPT,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429 && attempt < 3) {
        // Rate limit: exponential backoff
        await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
        return callPerplexityWithRetry(apiKey, topic, attempt + 1);
      }
      throw new Error(
        `Perplexity API error ${response.status}: ${errorText}`
      );
    }

    return response.json() as Promise<PerplexityResponse>;
  } finally {
    clearTimeout(timeout);
  }
}

export async function researchTopic(
  topic: string = ""
): Promise<PerplexityResearchResult> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error(
      "PERPLEXITY_API_KEY non configurata. Aggiungila nelle variabili d'ambiente."
    );
  }

  const data = await callPerplexityWithRetry(apiKey, topic);

  const content = data.choices[0]?.message?.content ?? "";

  // Extract JSON from the response (model may wrap it in markdown)
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error(
      `Perplexity non ha restituito JSON valido. Contenuto ricevuto: ${content.slice(0, 200)}`
    );
  }

  let topics: PerplexityTopicResult[];
  try {
    topics = JSON.parse(jsonMatch[0]) as PerplexityTopicResult[];
  } catch {
    throw new Error(`Errore nel parsing JSON da Perplexity: ${jsonMatch[0].slice(0, 200)}`);
  }

  if (!Array.isArray(topics) || topics.length === 0) {
    throw new Error("Perplexity ha restituito un array vuoto o non valido.");
  }

  // Aggregate sources from all topics
  const allSources = topics.flatMap((t) =>
    Array.isArray(t.fonti) ? t.fonti : []
  );

  // Average freshness score across topics
  const avgFreshness =
    topics.reduce((sum, t) => sum + (t.freshness_score ?? 50), 0) /
    topics.length;

  // Build summary from all topic titles + descriptions
  const summary = topics
    .map((t, i) => `${i + 1}. ${t.titolo}: ${t.descrizione}`)
    .join("\n\n");

  return {
    summary,
    sources: allSources,
    freshness_score: Math.round(avgFreshness),
    raw_topics: topics,
  };
}
