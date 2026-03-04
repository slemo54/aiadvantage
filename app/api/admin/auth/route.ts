import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { z } from "zod";

const LoginSchema = z.object({
  password: z.string().min(1, "Password obbligatoria"),
});

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi." },
        { status: 400 }
      );
    }

    const { password } = parsed.data;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD env var not set");
      return NextResponse.json(
        { error: "Configurazione server mancante." },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Password non corretta." },
        { status: 401 }
      );
    }

    const sessionValue = hashPassword(adminPassword);
    const sevenDays = 7 * 24 * 60 * 60;

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sevenDays,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Errore interno." }, { status: 500 });
  }
}
