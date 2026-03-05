import { NextRequest, NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/auth";

// Server-side proxy: lets authenticated admin trigger cron without exposing CRON_SECRET client-side
export async function POST(request: NextRequest) {
  console.log("[admin/cron-trigger] Request received");
  
  const sessionCookie = request.cookies.get("admin_session");
  const adminPassword = process.env.ADMIN_PASSWORD;
  const cronSecret = process.env.CRON_SECRET;

  console.log("[admin/cron-trigger] Cookie present:", Boolean(sessionCookie));
  console.log("[admin/cron-trigger] ADMIN_PASSWORD configured:", Boolean(adminPassword));
  console.log("[admin/cron-trigger] CRON_SECRET configured:", Boolean(cronSecret));

  if (!adminPassword) {
    console.error("[admin/cron-trigger] ADMIN_PASSWORD not configured");
    return NextResponse.json({ error: "ADMIN_PASSWORD non configurata" }, { status: 500 });
  }

  if (!sessionCookie) {
    console.error("[admin/cron-trigger] No session cookie");
    return NextResponse.json({ error: "Non autorizzato: nessun cookie di sessione" }, { status: 401 });
  }

  const isValid = await verifySessionCookie(sessionCookie.value, adminPassword);
  if (!isValid) {
    console.error("[admin/cron-trigger] Invalid session cookie");
    return NextResponse.json({ error: "Non autorizzato: cookie non valido" }, { status: 401 });
  }

  if (!cronSecret) {
    console.error("[admin/cron-trigger] CRON_SECRET not configured");
    return NextResponse.json({ error: "CRON_SECRET non configurato" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${request.headers.get("host")}`;
  console.log("[admin/cron-trigger] Calling cron at:", `${baseUrl}/api/cron/generate-ideas`);
  
  try {
    const res = await fetch(`${baseUrl}/api/cron/generate-ideas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cronSecret}`,
      },
    });

    const body: unknown = await res.json();
    console.log("[admin/cron-trigger] Cron response:", res.status, body);
    return NextResponse.json(body, { status: res.status });
  } catch (err) {
    console.error("[admin/cron-trigger] Error calling cron:", err);
    return NextResponse.json({ error: "Errore chiamata cron: " + String(err) }, { status: 500 });
  }
}
