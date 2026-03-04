import { NextRequest, NextResponse } from "next/server";
import { humanizeText } from "@/lib/ai/claude";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
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
