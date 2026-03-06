import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifySessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin_session");
  const adminPassword = process.env.ADMIN_PASSWORD;

  const isValid = await verifySessionCookie(sessionCookie?.value, adminPassword);
  if (!isValid) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const status: Record<string, boolean | number> = {
    PERPLEXITY_API_KEY: Boolean(process.env.PERPLEXITY_API_KEY?.trim()),
    KIMI_API_KEY: Boolean(process.env.KIMI_API_KEY?.trim()),
    ANTHROPIC_API_KEY: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
    GEMINI_API_KEY: Boolean(
      (process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY)?.trim()
    ),
    RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY?.trim()),
    CRON_SECRET: Boolean(process.env.CRON_SECRET?.trim()),
    subscriberCount: 0,
  };

  try {
    const supabase = createAdminClient();
    const { count } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true });
    status.subscriberCount = count ?? 0;
  } catch {
    // Supabase not yet configured
  }

  return NextResponse.json(status);
}
