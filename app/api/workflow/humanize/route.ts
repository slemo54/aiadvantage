import { NextRequest, NextResponse } from "next/server";
import { humanizeText } from "@/lib/ai/kimi";
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

    // Fetch the article in drafting state
    const { data: article, error: fetchError } = await supabase
      .from("articles")
      .select("id, content_html, status")
      .eq("id", articleId)
      .single();

    if (fetchError || !article) {
      return NextResponse.json(
        { error: `Articolo non trovato: ${fetchError?.message ?? "id sconosciuto"}` },
        { status: 404 }
      );
    }

    if (!article.content_html) {
      return NextResponse.json(
        { error: "L'articolo non ha contenuto HTML da umanizzare. Esegui prima il draft." },
        { status: 400 }
      );
    }

    // Update to 'humanizing' before long AI call
    await supabase
      .from("articles")
      .update({ status: "humanizing", updated_at: new Date().toISOString() })
      .eq("id", articleId);

    const humanizedHtml = await humanizeText(article.content_html as string);

    // Save humanized content
    const { error: updateError } = await supabase
      .from("articles")
      .update({
        content_html: humanizedHtml,
        status: "humanizing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId);

    if (updateError) {
      throw new Error(`Supabase update error: ${updateError.message}`);
    }

    // Trigger next step (images) asynchronously - fire and forget
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    fetch(`${baseUrl}/api/workflow/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
    }).catch((err) => {
      console.error("[workflow/humanize] Failed to trigger images:", err);
    });

    return NextResponse.json({
      success: true,
      articleId,
      preview: humanizedHtml.slice(0, 500) + (humanizedHtml.length > 500 ? "…" : ""),
    });
  } catch (err) {
    console.error("[workflow/humanize] Errore:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
