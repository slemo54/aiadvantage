import { NextRequest, NextResponse } from "next/server";
import { researchTopic } from "@/lib/ai/perplexity";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CategoryKey } from "@/lib/constants";

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

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!process.env.CRON_SECRET) {
    console.error("[cron] CRON_SECRET non configurata");
    return NextResponse.json(
      { error: "CRON_SECRET non configurata nelle env vars Vercel" },
      { status: 500 }
    );
  }
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.PERPLEXITY_API_KEY) {
    return NextResponse.json(
      { error: "PERPLEXITY_API_KEY non configurata nelle env vars Vercel" },
      { status: 500 }
    );
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json(
      {
        error:
          "Supabase non configurato. Aggiungi NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY su Vercel → Settings → Environment Variables.",
      },
      { status: 503 }
    );
  }

  try {

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
    console.error("[cron/generate-ideas] Errore:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "generate-ideas" });
}
