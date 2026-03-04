import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// ---- Helpers ----

function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

// ---- GET /api/articles/[slug] ----

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json(
      { error: "Slug mancante." },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase non configurato.", slug },
      { status: 503 }
    );
  }

  try {
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Articolo non trovato." },
          { status: 404 }
        );
      }
      console.error("[GET /api/articles/[slug]] Supabase error:", error.message);
      return NextResponse.json(
        { error: "Errore nel recupero dell'articolo." },
        { status: 500 }
      );
    }

    // Check if article is published (for public access)
    // In production, you might want to check authentication for drafts
    if (data.status !== "published") {
      // Allow access but mark as draft
      return NextResponse.json({
        article: data,
        isDraft: true,
      });
    }

    return NextResponse.json({
      article: data,
      isDraft: false,
    });
  } catch (err) {
    console.error("[GET /api/articles/[slug]] Unexpected error:", err);
    return NextResponse.json(
      { error: "Errore interno." },
      { status: 500 }
    );
  }
}

// ---- PUT /api/articles/[slug] ----

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase non configurato." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("articles")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug)
      .select()
      .single();

    if (error) {
      console.error("[PUT /api/articles/[slug]] Supabase error:", error.message);
      return NextResponse.json(
        { error: "Errore nell'aggiornamento dell'articolo." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      article: data,
    });
  } catch (err) {
    console.error("[PUT /api/articles/[slug]] Unexpected error:", err);
    return NextResponse.json(
      { error: "Errore interno." },
      { status: 500 }
    );
  }
}

// ---- DELETE /api/articles/[slug] ----

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase non configurato." },
      { status: 503 }
    );
  }

  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("slug", slug);

    if (error) {
      console.error("[DELETE /api/articles/[slug]] Supabase error:", error.message);
      return NextResponse.json(
        { error: "Errore nell'eliminazione dell'articolo." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Articolo eliminato.",
    });
  } catch (err) {
    console.error("[DELETE /api/articles/[slug]] Unexpected error:", err);
    return NextResponse.json(
      { error: "Errore interno." },
      { status: 500 }
    );
  }
}
