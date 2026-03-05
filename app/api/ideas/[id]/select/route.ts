import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

function generateSlug(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 100);
}

// ---- POST /api/ideas/[id]/select ----

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID mancante." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase non configurato." },
      { status: 503 }
    );
  }

  try {
    const supabase = createAdminClient();

    // 1. Fetch the idea first
    const { data: idea, error: ideaError } = await supabase
      .from("ideas")
      .select("id, topic, category, perplexity_research, freshness_score")
      .eq("id", id)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json(
        { error: "Idea non trovata." },
        { status: 404 }
      );
    }

    // 2. Create article from idea
    const slug = generateSlug(idea.topic);
    const { data: article, error: articleError } = await supabase
      .from("articles")
      .insert({
        title: idea.topic,
        slug: `${slug}-${Date.now().toString(36)}`,
        category: idea.category,
        status: "idea",
        freshness_score: idea.freshness_score ?? 50,
        content_html: null,
        hero_image_url: null,
        meta_description: null,
      })
      .select()
      .single();

    if (articleError || !article) {
      console.error("[select] Errore creazione articolo:", articleError);
      return NextResponse.json(
        { error: "Errore nella creazione dell'articolo." },
        { status: 500 }
      );
    }

    // 3. Update idea status to 'selected'
    const { error: updateError } = await supabase
      .from("ideas")
      .update({ status: "selected" })
      .eq("id", id);

    if (updateError) {
      console.error("[select] Errore aggiornamento idea:", updateError);
    }

    // 4. Trigger draft workflow pipeline with the new articleId
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    try {
      const draftRes = await fetch(`${baseUrl}/api/workflow/draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: article.id }),  // ✅ Manda articleId, non idea_id
      });

      if (!draftRes.ok) {
        const errorText = await draftRes.text();
        console.warn(
          `[select] Draft pipeline returned ${draftRes.status}: ${errorText}`
        );
      }
    } catch (draftErr) {
      console.error(
        "[select] Failed to trigger draft pipeline:",
        draftErr
      );
    }

    return NextResponse.json({ success: true, idea, article });
  } catch (err) {
    console.error("[POST /api/ideas/[id]/select] Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno." }, { status: 500 });
  }
}
