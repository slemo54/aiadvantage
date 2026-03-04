import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: 1. Call Perplexity to research trending AI topics
  // TODO: 2. Score freshness
  // TODO: 3. Save ideas to Supabase

  return NextResponse.json({
    success: true,
    message: "Idea generation stub — not yet implemented",
    ideas: [],
  });
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "generate-ideas" });
}
