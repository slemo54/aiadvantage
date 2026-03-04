import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json();

    // TODO: Send email notification via Resend

    return NextResponse.json({
      success: true,
      message: "Notification stub — not yet implemented",
      articleId,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
