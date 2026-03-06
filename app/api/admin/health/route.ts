import { NextRequest, NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin_session");
  
  // Check config status without exposing actual values
  const status = {
    ADMIN_PASSWORD_CONFIGURED: Boolean(process.env.ADMIN_PASSWORD?.trim()),
    CRON_SECRET_CONFIGURED: Boolean(process.env.CRON_SECRET?.trim()),
    PERPLEXITY_API_KEY_CONFIGURED: Boolean(process.env.PERPLEXITY_API_KEY?.trim()),
    ANTHROPIC_API_KEY_CONFIGURED: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
    VENICE_API_KEY_CONFIGURED: Boolean(process.env.VENICE_API_KEY?.trim()),
    GEMINI_API_KEY_CONFIGURED: Boolean(
      (process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY)?.trim()
    ),
    SUPABASE_CONFIGURED: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && 
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
    ),
    hasSessionCookie: Boolean(sessionCookie),
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  // Verify session cookie using shared function
  const sessionValid = await verifySessionCookie(sessionCookie?.value, process.env.ADMIN_PASSWORD);

  return NextResponse.json({
    ...status,
    sessionValid,
    message: !status.ADMIN_PASSWORD_CONFIGURED 
      ? "CRITICAL: ADMIN_PASSWORD non configurata. Aggiungila su Vercel → Settings → Environment Variables"
      : sessionValid 
        ? "Sessione valida"
        : "Sessione non valida o mancante. Rifai il login.",
  });
}
