import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json();
    if (!articleId) {
      return NextResponse.json({ error: "articleId required" }, { status: 400 });
    }

    // TODO: Generate hero image with Gemini/Imagen

    return NextResponse.json({
      success: true,
      message: "Image generation stub — not yet implemented",
      articleId,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
