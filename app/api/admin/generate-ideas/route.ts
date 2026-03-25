import { NextResponse } from "next/server";
import { researchTopic } from "@/lib/ai/perplexity";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CategoryKey } from "@/lib/constants";

// This endpoint is protected by middleware (session cookie auth).
// It provides the same functionality as the cron route but without
// requiring the CRON_SECRET — the admin session is the auth.

const VALID_CATEGORIES: CategoryKey[] = [
  "casi_duso",
  "ai_news",
  "web_dev",
  "tools",
  "tutorial",
  "opinioni",
];

function sanitizeCategory(raw: string): CategoryKey {
  const normalized = raw.toLowerCase().trim() as CategoryKey;
  return VALID_CATEGORIES.includes(normalized) ? normalized : "ai_news";
}

export async function POST() {
  if (!process.env.PERPLEXITY_API_KEY) {
    return NextResponse.json(
      { error: "PERPLEXITY_API_KEY non configurata" },
      { status: 500 }
    );
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json(
      { error: "Supabase non configurato" },
      { status: 503 }
    );
  }

  try {
    console.log("[admin/generate-ideas] Avvio ricerca topic...");
    const research = await researchTopic("");

    const supabase = createAdminClient();

    const ideasToInsert = research.raw_topics.map((topic) => ({
      topic: topic.titolo,
      source_url: topic.fonti?.[0] ?? null,
      freshness_score: topic.freshness_score ?? 50,
      status: "new" as const,
      category: sanitizeCategory(topic.categoria),
      perplexity_research: {
        descrizione: topic.descrizione,
        fonti: topic.fonti,
        summary: research.summary,
      },
    }));

    const { data: inserted, error } = await supabase
      .from("ideas")
      .insert(ideasToInsert)
      .select("id, topic, category, freshness_score");

    if (error) {
      throw new Error(`Supabase insert error: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      message: `${inserted?.length ?? 0} idee create con successo`,
      ideas: inserted ?? [],
    });
  } catch (err) {
    console.error("[admin/generate-ideas] Errore:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
