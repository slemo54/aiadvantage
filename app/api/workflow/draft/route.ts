import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json();
    if (!articleId) {
      return NextResponse.json({ error: "articleId required" }, { status: 400 });
    }

    // TODO: 1. Fetch article/idea from Supabase
    // TODO: 2. Call Kimi 2.5 to generate draft from research
    // TODO: 3. Update article status to 'drafting' and save content

    return NextResponse.json({
      success: true,
      message: "Draft generation stub — not yet implemented",
      articleId,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
