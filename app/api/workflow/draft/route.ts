import { NextRequest, NextResponse } from "next/server";
import { generateDraft } from "@/lib/ai/venice";
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

    // Fetch the article
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

    const articleTitle = article.title as string;
    const articleCategory = article.category as string;

    // Try to find a 'selected' idea matching the article title (exact or partial)
    const { data: matchingIdea } = await supabase
      .from("ideas")
      .select("*")
      .eq("status", "selected")
      .ilike("topic", `%${articleTitle.slice(0, 40)}%`)
      .limit(1)
      .single();

    // Fallback: any selected idea ordered by freshness
    const { data: fallbackIdea } = matchingIdea
      ? { data: null }
      : await supabase
          .from("ideas")
          .select("*")
          .eq("status", "selected")
          .order("freshness_score", { ascending: false })
          .limit(1)
          .single();

    const idea = (matchingIdea ?? fallbackIdea) as Idea | null;

    let researchText: string;
    let usedCategory: string;

    if (idea) {
      // Build research string from perplexity_research blob
      const researchData = (idea.perplexity_research as Record<string, unknown>) ?? {};
      researchText = [
        `Titolo: ${idea.topic}`,
        `Categoria: ${idea.category}`,
        researchData.descrizione ? `Descrizione: ${String(researchData.descrizione)}` : "",
        researchData.summary ? `Summary: ${String(researchData.summary)}` : "",
        (researchData.fonti as string[] | undefined)?.length
          ? `Fonti: ${(researchData.fonti as string[]).join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n");
      usedCategory = idea.category;
    } else {
      // No idea found — generate directly from article title + category
      console.warn(`[workflow/draft] Nessuna idea trovata per articleId=${articleId}, genero dal titolo.`);
      researchText = [
        `Titolo: ${articleTitle}`,
        `Categoria: ${articleCategory}`,
        `Genera un articolo approfondito e professionale su questo argomento, con esempi pratici e casi d'uso reali per il pubblico italiano.`,
      ].join("\n");
      usedCategory = articleCategory;
    }

    // Update status to 'drafting' before long AI call
    await supabase
      .from("articles")
      .update({ status: "drafting", updated_at: new Date().toISOString() })
      .eq("id", articleId);

    const htmlDraft = await generateDraft(researchText, usedCategory);

    // Save content
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

    // Mark idea as used if we found one
    if (idea) {
      await supabase
        .from("ideas")
        .update({ status: "used" })
        .eq("id", idea.id);
    }

    // Trigger next step (humanize) asynchronously - fire and forget
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    fetch(`${baseUrl}/api/workflow/humanize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
    }).catch((err) => {
      console.error("[workflow/draft] Failed to trigger humanize:", err);
    });

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
