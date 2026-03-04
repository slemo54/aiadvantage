import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
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

    // Update idea status to 'selected'
    const { data: idea, error: updateError } = await supabase
      .from("ideas")
      .update({ status: "selected" })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Idea non trovata." },
          { status: 404 }
        );
      }
      console.error("[POST /api/ideas/[id]/select] Supabase error:", updateError.message);
      return NextResponse.json(
        { error: "Errore nell'aggiornamento dell'idea." },
        { status: 500 }
      );
    }

    // Trigger draft workflow pipeline
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    try {
      const draftRes = await fetch(`${baseUrl}/api/workflow/draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea_id: id }),
      });

      if (!draftRes.ok) {
        console.warn(
          `[POST /api/ideas/[id]/select] Draft pipeline returned ${draftRes.status} for idea ${id}`
        );
      }
    } catch (draftErr) {
      // Pipeline call failing should not block the select response
      console.error(
        "[POST /api/ideas/[id]/select] Failed to trigger draft pipeline:",
        draftErr
      );
    }

    return NextResponse.json({ success: true, idea });
  } catch (err) {
    console.error("[POST /api/ideas/[id]/select] Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno." }, { status: 500 });
  }
}
