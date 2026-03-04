import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

// ---- Zod schema ----

const SubscribeSchema = z.object({
  email: z.string().email("Email non valida"),
});

// ---- Helpers ----

function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

// ---- POST /api/subscribe ----

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    // In dev mode, just return success
    return NextResponse.json(
      { 
        success: true, 
        message: "Iscrizione ricevuta (modalità sviluppo)" 
      },
      { status: 201 }
    );
  }

  try {
    const body: unknown = await request.json();
    const parsed = SubscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Email non valida.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    
    // Check if email already exists
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, confirmed")
      .eq("email", parsed.data.email)
      .single();

    if (existing) {
      if (existing.confirmed) {
        return NextResponse.json(
          { error: "Email già iscritta.", alreadySubscribed: true },
          { status: 409 }
        );
      } else {
        // Resend confirmation
        return NextResponse.json(
          { 
            success: true, 
            message: "Email già registrata. Controlla la tua casella per confermare." 
          },
          { status: 200 }
        );
      }
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from("subscribers")
      .insert({
        email: parsed.data.email,
        confirmed: false,
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/subscribe] Supabase error:", error.message);
      return NextResponse.json(
        { error: "Errore nella registrazione." },
        { status: 500 }
      );
    }

    // TODO: Send confirmation email via Resend
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Iscrizione effettuata! Controlla la tua email per confermare.",
        subscriber: data 
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/subscribe] Unexpected error:", err);
    return NextResponse.json(
      { error: "Errore interno." },
      { status: 500 }
    );
  }
}
