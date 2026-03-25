// Image generation via Venice AI — fluently-xl model

const LOG = "[ai/gemini]";
const TIMEOUT_MS = 30_000;
const API_URL = "https://api.venice.ai/api/v1/images/generations";
const MODEL = "fluently-xl";

interface VeniceImageItem {
  b64_json?: string;
  url?: string;
}

interface VeniceImageResponse {
  data?: VeniceImageItem[];
}

export async function generateImage(prompt: string): Promise<string | null> {
  const apiKey = process.env.VENICE_API_KEY;
  if (!apiKey) {
    console.warn(`${LOG} VENICE_API_KEY non configurata, skip image generation`);
    return null;
  }

  if (!prompt.trim()) {
    console.warn(`${LOG} Empty prompt, skip image generation`);
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    console.log(`${LOG} Generating image with ${MODEL}: "${prompt.slice(0, 80)}..."`);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        response_format: "b64_json",
        n: 1,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Rate limit — single retry
      if (response.status === 429) {
        console.warn(`${LOG} Rate limited (429), retrying in 3s`);
        await new Promise((r) => setTimeout(r, 3000));

        clearTimeout(timeout);
        const retryController = new AbortController();
        const retryTimeout = setTimeout(() => retryController.abort(), TIMEOUT_MS);

        try {
          const retryResponse = await fetch(API_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: MODEL,
              prompt,
              response_format: "b64_json",
              n: 1,
            }),
            signal: retryController.signal,
          });

          if (!retryResponse.ok) {
            throw new Error(`${LOG} Retry failed: HTTP ${retryResponse.status}`);
          }

          const retryData = (await retryResponse.json()) as VeniceImageResponse;
          const b64 = retryData.data?.[0]?.b64_json;
          if (!b64) return null;
          return `data:image/png;base64,${b64}`;
        } finally {
          clearTimeout(retryTimeout);
        }
      }

      throw new Error(`${LOG} HTTP ${response.status}: ${errorText.slice(0, 400)}`);
    }

    const data = (await response.json()) as VeniceImageResponse;
    const b64 = data.data?.[0]?.b64_json;

    if (!b64) {
      console.warn(`${LOG} No image data in response`);
      return null;
    }

    console.log(`${LOG} Image generated, base64 length: ${b64.length}`);
    return `data:image/png;base64,${b64}`;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      console.error(`${LOG} Timeout after ${TIMEOUT_MS}ms`);
    } else {
      console.error(`${LOG} Image generation failed:`, String(err));
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
