import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "10");

  // TODO: Fetch published articles from Supabase

  return NextResponse.json({
    articles: [],
    total: 0,
    category,
    limit,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Create article in Supabase

    return NextResponse.json({
      success: true,
      message: "Article creation stub — not yet implemented",
      received: Object.keys(body),
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
