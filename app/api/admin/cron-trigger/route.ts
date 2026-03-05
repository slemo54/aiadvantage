import { NextRequest, NextResponse } from "next/server";

// Server-side proxy: lets authenticated admin trigger cron without exposing CRON_SECRET client-side
export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin_session");
  const adminPassword = process.env.ADMIN_PASSWORD;
  const cronSecret = process.env.CRON_SECRET;

  if (!adminPassword || !sessionCookie) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(adminPassword);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const expectedHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  if (sessionCookie.value !== expectedHash) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET non configurato" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${request.headers.get("host")}`;
  const res = await fetch(`${baseUrl}/api/cron/generate-ideas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cronSecret}`,
    },
  });

  const body: unknown = await res.json();
  return NextResponse.json(body, { status: res.status });
}
