import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/* routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Login/logout routes are always allowed
  if (
    pathname === "/admin-login" ||
    pathname.startsWith("/api/admin/auth") ||
    pathname.startsWith("/api/admin/logout")
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("admin_session");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  const expectedHash = await hashPassword(adminPassword);

  if (!sessionCookie || sessionCookie.value !== expectedHash) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
