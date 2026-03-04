import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { CATEGORIES } from "@/lib/constants";
import type { CategoryKey } from "@/lib/constants";

const CATEGORY_KEYS = Object.keys(CATEGORIES) as [CategoryKey, ...CategoryKey[]];

const IDEA_STATUSES = ["new", "selected", "rejected", "used"] as const;
type IdeaStatus = (typeof IDEA_STATUSES)[number];

const IdeaCreateSchema = z.object({
  topic: z.string().min(1, "Topic obbligatorio").max(500),
  source_url: z.string().url().nullable().optional(),
  freshness_score: z.number().int().min(0).max(100).optional().default(50),
  status: z.enum(IDEA_STATUSES).optional().default("new"),
  category: z.enum(CATEGORY_KEYS),
  perplexity_research: z.record(z.string(), z.unknown()).nullable().optional(),
});

function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

const PLACEHOLDER_IDEAS = [
  {
    id: "1",
    topic: "Come Claude Code sta cambiando lo sviluppo software",
    source_url: "https://example.com",
    freshness_score: 92,
    status: "new" as IdeaStatus,
    category: "tools" as CategoryKey,
    perplexity_research: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    topic: "AI Act europeo: impatto sulle startup italiane",
    source_url: null,
    freshness_score: 88,
    status: "new" as IdeaStatus,
    category: "ai_news" as CategoryKey,
    perplexity_research: null,
    created_at: new Date().toISOString(),
  },
];

// ---- GET /api/ideas ----

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as IdeaStatus | null;

  if (!isSupabaseConfigured()) {
    const filtered =
      status && (IDEA_STATUSES as readonly string[]).includes(status)
        ? PLACEHOLDER_IDEAS.filter((i) => i.status === status)
        : PLACEHOLDER_IDEAS;

    return NextResponse.json({
      ideas: filtered,
      total: filtered.length,
      note: "Supabase non configurato — dati placeholder",
    });
  }

  try {
    const supabase = createAdminClient();
    let query = supabase
      .from("ideas")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (status && (IDEA_STATUSES as readonly string[]).includes(status)) {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("[GET /api/ideas] Supabase error:", error.message);
      return NextResponse.json(
        { error: "Errore nel recupero delle idee." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ideas: data ?? [], total: count ?? 0 });
  } catch (err) {
    console.error("[GET /api/ideas] Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno." }, { status: 500 });
  }
}

// ---- POST /api/ideas ----

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase non configurato." },
      { status: 503 }
    );
  }

  try {
    const body: unknown = await request.json();
    const parsed = IdeaCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("ideas")
      .insert({
        ...parsed.data,
        source_url: parsed.data.source_url ?? null,
        perplexity_research: parsed.data.perplexity_research ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/ideas] Supabase error:", error.message);
      return NextResponse.json(
        { error: "Errore nella creazione dell'idea." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, idea: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Errore interno." }, { status: 500 });
  }
}
