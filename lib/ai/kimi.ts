// Venice AI API — api.venice.ai (OpenAI-compatible)

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

const MODEL = "venice-uncensored";

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

async function callVenice(
  apiKey: string,
  prompt: string,
  attempt: number = 1
): Promise<VeniceResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);

  try {
    const response = await fetch(
      "https://api.venice.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.75,
          max_tokens: 4000,
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          `VENICE_API_KEY non valida o scaduta (HTTP 401). Aggiornala su Vercel → Settings → Environment Variables.`
        );
      }
      const errorText = await response.text();
      if (response.status === 429 && attempt < 3) {
        await new Promise((r) => setTimeout(r, attempt * 3000));
        return callVenice(apiKey, prompt, attempt + 1);
      }
      throw new Error(
        `Venice API HTTP ${response.status} (model: ${MODEL}): ${errorText.slice(0, 400)}`
      );
    }

    return response.json() as Promise<VeniceResponse>;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateDraft(
  research: string,
  category: string
): Promise<string> {
  const apiKey = process.env.VENICE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "VENICE_API_KEY non configurata. Aggiungila su Vercel → Settings → Environment Variables."
    );
  }

  const prompt = buildDraftPrompt(research, category);
  console.log(`[venice] Calling model: ${MODEL}`);
  const data = await callVenice(apiKey, prompt);
  const content = data.choices[0]?.message?.content ?? "";
  if (!content.trim()) {
    throw new Error(`Venice: risposta vuota dal modello ${MODEL}`);
  }
  console.log(`[venice] Draft generated successfully`);
  return content
    .replace(/^```html?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function generateSEO(
  title: string,
  content: string
): Promise<{ meta_description: string; keywords: string[]; slug: string }> {
  const apiKey = process.env.VENICE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "VENICE_API_KEY non configurata. Aggiungila su Vercel → Settings → Environment Variables."
    );
  }

  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 3000);

  const prompt = `Sei un esperto SEO italiano. Analizza questo articolo e restituisci SOLO un JSON valido senza markdown:
{
  "meta_description": "massimo 155 caratteri, include keyword principale, chiara e invitante",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "slug": "url-slug-ottimizzato-senza-accenti"
}
Titolo: ${title}
Contenuto:
${plainText}`;

  console.log(`[venice-seo] Calling model: ${MODEL}`);
  const data = await callVenice(apiKey, prompt);
  const raw = data.choices[0]?.message?.content ?? "";
  const cleaned = raw
    .replace(/^```json?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  const parsed = JSON.parse(cleaned) as {
    meta_description: string;
    keywords: string[];
    slug: string;
  };
  console.log(`[venice-seo] SEO generated successfully`);
  return parsed;
}
