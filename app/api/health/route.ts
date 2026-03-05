import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const config = {
    supabase_url_set: Boolean(supabaseUrl),
    supabase_url_valid: supabaseUrl?.startsWith("https://") ?? false,
    service_key_set: Boolean(serviceKey),
    service_key_looks_valid: serviceKey?.startsWith("eyJ") ?? false,
    perplexity_key_set: Boolean(process.env.PERPLEXITY_API_KEY),
    cron_secret_set: Boolean(process.env.CRON_SECRET),
    openrouter_key_set: Boolean(process.env.OPENROUTER_API_KEY),
    anthropic_key_set: Boolean(process.env.ANTHROPIC_API_KEY),
  };

  let supabase_connection: string;
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const client = createClient(supabaseUrl!, serviceKey!);
    const { error } = await client
      .from("articles")
      .select("id")
      .limit(1);
    supabase_connection = error ? `error: ${error.message}` : "ok";
  } catch (err) {
    supabase_connection = `exception: ${String(err)}`;
  }

  const allGood =
    config.supabase_url_set &&
    config.supabase_url_valid &&
    config.service_key_set &&
    config.service_key_looks_valid &&
    supabase_connection === "ok";

  return NextResponse.json({
    status: allGood ? "ok" : "degraded",
    config,
    supabase_connection,
  });
}
