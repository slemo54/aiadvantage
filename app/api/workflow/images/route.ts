import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/ai/gemini";
import { createAdminClient } from "@/lib/supabase/admin";

function buildImagePrompt(title: string, category: string): string {
  return (
    `Professional blog hero image for an Italian AI technology article. ` +
    `Article title: "${title}". Category: ${category}. ` +
    `Style: modern, clean, tech-focused, abstract digital illustration. ` +
    `Colors: deep blue and purple gradient with bright accents. ` +
    `No text, no letters, no words in the image. Photorealistic quality.`
  );
}

function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase non configurato. Aggiungi NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY su Vercel." },
      { status: 503 }
    );
  }

  try {
    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("articleId" in body) ||
      typeof (body as Record<string, unknown>).articleId !== "string"
    ) {
      return NextResponse.json(
        { error: "articleId (string) richiesto nel body" },
        { status: 400 }
      );
    }

    const { articleId } = body as { articleId: string };

    const supabase = createAdminClient();

    const { data: article, error: fetchError } = await supabase
      .from("articles")
      .select("id, title, category, status")
      .eq("id", articleId)
      .single();

    if (fetchError || !article) {
      return NextResponse.json(
        { error: `Articolo non trovato: ${fetchError?.message ?? "id sconosciuto"}` },
        { status: 404 }
      );
    }

    const imagePrompt = buildImagePrompt(
      article.title as string,
      article.category as string
    );

    const imageDataUri = await generateImage(imagePrompt);

    if (!imageDataUri) {
      // Non-fatal: continue without image and move to reviewing
      await supabase
        .from("articles")
        .update({ status: "reviewing", updated_at: new Date().toISOString() })
        .eq("id", articleId);

      return NextResponse.json({
        success: true,
        articleId,
        hero_image_url: null,
        warning: "Gemini Imagen non ha restituito un'immagine. Articolo in revisione senza hero image.",
      });
    }

    const { error: updateError } = await supabase
      .from("articles")
      .update({
        hero_image_url: imageDataUri,
        status: "reviewing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId);

    if (updateError) {
      throw new Error(`Supabase update error: ${updateError.message}`);
    }

    return NextResponse.json({
      success: true,
      articleId,
      hero_image_url: imageDataUri.slice(0, 60) + "…[base64]",
    });
  } catch (err) {
    console.error("[workflow/images] Errore:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
