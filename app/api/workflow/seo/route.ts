import { NextRequest, NextResponse } from "next/server";
import { generateSEO } from "@/lib/ai/kimi";
import { createAdminClient } from "@/lib/supabase/admin";

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
      .select("id, title, content_html")
      .eq("id", articleId)
      .single();

    if (fetchError || !article) {
      return NextResponse.json(
        { error: `Articolo non trovato: ${fetchError?.message ?? "id sconosciuto"}` },
        { status: 404 }
      );
    }

    const seoData = await generateSEO(
      article.title as string,
      (article.content_html as string) ?? ""
    );

    const { error: updateError } = await supabase
      .from("articles")
      .update({
        meta_description: seoData.meta_description,
        keywords: seoData.keywords,
        slug: seoData.slug,
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId);

    if (updateError) {
      throw new Error(`Supabase update error: ${updateError.message}`);
    }

    return NextResponse.json({
      success: true,
      meta_description: seoData.meta_description,
      keywords: seoData.keywords,
      slug: seoData.slug,
    });
  } catch (err) {
    console.error("[workflow/seo] Errore:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
