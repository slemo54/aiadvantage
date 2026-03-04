import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json();
    if (!articleId) {
      return NextResponse.json({ error: "articleId required" }, { status: 400 });
    }

    // TODO: 1. Fetch draft from Supabase
    // TODO: 2. Call Claude to humanize the text
    // TODO: 3. Update article with humanized content

    return NextResponse.json({
      success: true,
      message: "Humanization stub — not yet implemented",
      articleId,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
