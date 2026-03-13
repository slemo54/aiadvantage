// Gemini API wrapper — Imagen 3 for images, gemini-1.5-pro for content review

interface ImagenInstance {
  prompt: string;
}

interface ImagenParameters {
  sampleCount: number;
  aspectRatio?: string;
}

interface ImagenPrediction {
  bytesBase64Encoded: string;
  mimeType: string;
}

interface ImagenResponse {
  predictions: ImagenPrediction[];
}

interface GeminiContentPart {
  text: string;
}

interface GeminiContent {
  parts: GeminiContentPart[];
}

interface GeminiCandidate {
  content: GeminiContent;
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
}

const IMAGEN_MODEL = "gemini-nano-banana-2";
const REVIEW_MODEL = "gemini-1.5-pro";

async function callImagen(
  apiKey: string,
  prompt: string,
  attempt: number = 1
): Promise<ImagenResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict?key=${apiKey}`;

  const body: { instances: ImagenInstance[]; parameters: ImagenParameters } = {
    instances: [{ prompt }],
    parameters: { sampleCount: 1, aspectRatio: "16:9" },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429 && attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 3000));
        return callImagen(apiKey, prompt, attempt + 1);
      }
      throw new Error(`Gemini Imagen error ${response.status}: ${errorText}`);
    }

    return response.json() as Promise<ImagenResponse>;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateImage(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY non configurata. Aggiungila nelle variabili d'ambiente."
    );
  }

  try {
    const data = await callImagen(apiKey, prompt);
    const prediction = data.predictions?.[0];
    if (!prediction?.bytesBase64Encoded) {
      return null;
    }
    const mimeType = prediction.mimeType ?? "image/png";
    return `data:${mimeType};base64,${prediction.bytesBase64Encoded}`;
  } catch (err) {
    console.error("Gemini Imagen fallito:", err);
    return null;
  }
}

export async function generateContent(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY non configurata. Aggiungila nelle variabili d'ambiente."
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${REVIEW_MODEL}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as GeminiResponse;
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!text.trim()) {
      throw new Error("Gemini ha restituito una risposta vuota.");
    }

    return text;
  } finally {
    clearTimeout(timeout);
  }
}
