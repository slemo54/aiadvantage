import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import type { WorkflowState, CategoryKey } from "@/lib/constants";
import { WORKFLOW_STATES, CATEGORIES } from "@/lib/constants";

const CATEGORY_KEYS = Object.keys(CATEGORIES) as [CategoryKey, ...CategoryKey[]];

// ---- Zod schemas ----

const ArticleCreateSchema = z.object({
  title: z.string().min(1, "Titolo obbligatorio").max(255),
  slug: z
    .string()
    .min(1, "Slug obbligatorio")
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Slug: solo lettere minuscole, numeri e trattini"),
  content_html: z.string().nullable().optional(),
  status: z.enum(WORKFLOW_STATES).optional().default("idea"),
  category: z.enum(CATEGORY_KEYS),
  freshness_score: z.number().int().min(0).max(100).optional().default(50),
  hero_image_url: z.string().url().nullable().optional(),
  featured_image_url: z.string().url().nullable().optional(),
  meta_description: z.string().max(160).nullable().optional(),
  keywords: z.array(z.string()).optional().default([]),
  published_at: z.string().datetime().nullable().optional(),
});

// ---- Helpers ----

function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

// ---- GET /api/articles ----

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status") as WorkflowState | null;
  const category = searchParams.get("category") as CategoryKey | null;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10"), 100);
  const page = Math.max(parseInt(searchParams.get("page") ?? "1"), 1);
  const offset = (page - 1) * limit;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      articles: [],
      total: 0,
      page,
      limit,
      note: "Supabase non configurato — dati placeholder",
    });
  }

  try {
    const supabase = createAdminClient();
    let query = supabase
      .from("articles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && (WORKFLOW_STATES as readonly string[]).includes(status)) {
      query = query.eq("status", status);
    }

    if (category && CATEGORY_KEYS.includes(category)) {
      query = query.eq("category", category);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("[GET /api/articles] Supabase error:", error.message);
      return NextResponse.json(
        { error: "Errore nel recupero degli articoli." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      articles: data ?? [],
      total: count ?? 0,
      page,
      limit,
    });
  } catch (err) {
    console.error("[GET /api/articles] Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno." }, { status: 500 });
  }
}

// ---- POST /api/articles ----

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase non configurato." },
      { status: 503 }
    );
  }

  try {
    const body: unknown = await request.json();
    const parsed = ArticleCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("articles")
      .insert({
        ...parsed.data,
        content_html: parsed.data.content_html ?? null,
        hero_image_url: parsed.data.hero_image_url ?? null,
        meta_description: parsed.data.meta_description ?? null,
        published_at: parsed.data.published_at ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/articles] Supabase error:", error.message);

      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Slug gia' esistente." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Errore nella creazione dell'articolo." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, article: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Errore interno." }, { status: 500 });
  }
}
