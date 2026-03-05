import { NextRequest, NextResponse } from "next/server";
import { generateDraft } from "@/lib/ai/kimi";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Idea } from "@/lib/types";

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

    // Fetch the idea linked to this articleId
    const { data: article, error: articleError } = await supabase
      .from("articles")
      .select("id, title, category, status")
      .eq("id", articleId)
      .single();

    if (articleError || !article) {
      return NextResponse.json(
        { error: `Articolo non trovato: ${articleError?.message ?? "id sconosciuto"}` },
        { status: 404 }
      );
    }

    // Find most recent idea matching this article's title or any "selected" idea
    const { data: idea, error: ideaError } = await supabase
      .from("ideas")
      .select("*")
      .eq("status", "selected")
      .order("freshness_score", { ascending: false })
      .limit(1)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json(
        { error: "Nessuna idea con status 'selected' trovata" },
        { status: 404 }
      );
    }

    const typedIdea = idea as Idea;

    // Build research string from perplexity_research blob
    const researchData = typedIdea.perplexity_research ?? {};
    const researchText = [
      `Titolo: ${typedIdea.topic}`,
      `Descrizione: ${(researchData as Record<string, unknown>).descrizione ?? ""}`,
      `Fonti: ${((researchData as Record<string, unknown>).fonti as string[] | undefined)?.join(", ") ?? ""}`,
      `Summary: ${(researchData as Record<string, unknown>).summary ?? ""}`,
    ].join("\n");

    // Update status to 'drafting' before long AI call
    await supabase
      .from("articles")
      .update({ status: "drafting", updated_at: new Date().toISOString() })
      .eq("id", articleId);

    const htmlDraft = await generateDraft(researchText, typedIdea.category);

    // Save content and advance status
    const { error: updateError } = await supabase
      .from("articles")
      .update({
        content_html: htmlDraft,
        status: "drafting",
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId);

    if (updateError) {
      throw new Error(`Supabase update error: ${updateError.message}`);
    }

    // Mark idea as used
    await supabase
      .from("ideas")
      .update({ status: "used" })
      .eq("id", typedIdea.id);

    return NextResponse.json({
      success: true,
      articleId,
      preview: htmlDraft.slice(0, 500) + (htmlDraft.length > 500 ? "…" : ""),
    });
  } catch (err) {
    console.error("[workflow/draft] Errore:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
