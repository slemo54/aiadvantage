import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/ai/gemini";
import { createAdminClient } from "@/lib/supabase/admin";

function buildHeroPrompt(title: string, category: string): string {
  return (
    `Professional blog hero image for an Italian AI technology article. ` +
    `Article title: "${title}". Category: ${category}. ` +
    `Style: modern, clean, tech-focused, abstract digital illustration. ` +
    `Colors: deep blue and purple gradient with bright accents. ` +
    `No text, no letters, no words in the image. Photorealistic quality.`
  );
}

function buildFeaturedPrompt(title: string, category: string): string {
  return (
    `Wide landscape featured image for an Italian AI blog article card. ` +
    `Article title: "${title}". Category: ${category}. ` +
    `Style: modern, sleek, tech-focused composition optimized for a wide rectangular card. ` +
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

    const heroPrompt = buildHeroPrompt(
      article.title as string,
      article.category as string
    );
    const featuredPrompt = buildFeaturedPrompt(
      article.title as string,
      article.category as string
    );

    // Generate both images in parallel: hero (square) and featured (16:9 landscape)
    const [heroDataUri, featuredDataUri] = await Promise.all([
      generateImage(heroPrompt),
      generateImage(featuredPrompt, "16:9"),
    ]);

    if (!heroDataUri && !featuredDataUri) {
      // Non-fatal: continue without images and move to reviewing
      await supabase
        .from("articles")
        .update({ status: "reviewing", updated_at: new Date().toISOString() })
        .eq("id", articleId);

      return NextResponse.json({
        success: true,
        articleId,
        hero_image_url: null,
        featured_image_url: null,
        warning: "Gemini Imagen non ha restituito immagini. Articolo in revisione senza immagini.",
      });
    }

    const updatePayload: Record<string, unknown> = {
      status: "reviewing",
      updated_at: new Date().toISOString(),
    };
    if (heroDataUri) updatePayload.hero_image_url = heroDataUri;
    if (featuredDataUri) updatePayload.featured_image_url = featuredDataUri;

    const { error: updateError } = await supabase
      .from("articles")
      .update(updatePayload)
      .eq("id", articleId);

    if (updateError) {
      throw new Error(`Supabase update error: ${updateError.message}`);
    }

    return NextResponse.json({
      success: true,
      articleId,
      hero_image_url: heroDataUri ? heroDataUri.slice(0, 60) + "…[base64]" : null,
      featured_image_url: featuredDataUri ? featuredDataUri.slice(0, 60) + "…[base64]" : null,
    });
  } catch (err) {
    console.error("[workflow/images] Errore:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
