import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/* routes; /admin-login is outside this scope
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // API auth routes do not require a session cookie
  if (
    pathname.startsWith("/api/admin/auth") ||
    pathname.startsWith("/api/admin/logout")
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("admin_session");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    // No password configured — block access entirely
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  const expectedHash = hashPassword(adminPassword);

  if (!sessionCookie || sessionCookie.value !== expectedHash) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
