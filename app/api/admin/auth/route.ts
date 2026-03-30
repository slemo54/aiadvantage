import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/auth";

const LoginSchema = z.object({
  password: z.string().min(1, "Password obbligatoria"),
});

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      console.error("[admin/auth] Validazione fallita:", parsed.error.flatten());
      return NextResponse.json(
        { error: "Dati non validi." },
        { status: 400 }
      );
    }

    const { password } = parsed.data;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("[admin/auth] ADMIN_PASSWORD env var not set");
      return NextResponse.json(
        { error: "Configurazione server mancante: ADMIN_PASSWORD non impostata." },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      console.warn("[admin/auth] Password mismatch");
      return NextResponse.json(
        { error: "Password non corretta." },
        { status: 401 }
      );
    }

    const sessionValue = await hashPassword(adminPassword);
    const sevenDays = 7 * 24 * 60 * 60;

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sevenDays,
      path: "/",
    });

    console.log("[admin/auth] Login successful, cookie set");
    return response;
  } catch (err) {
    console.error("[admin/auth] Errore interno:", err);
    return NextResponse.json({ error: "Errore interno." }, { status: 500 });
  }
}
