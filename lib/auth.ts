import { createHash } from "crypto";

/**
 * Hash a password using SHA-256.
 * This function is used consistently across login, middleware, and API routes.
 */
export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

/**
 * Verify a session cookie against the admin password.
 * Returns true if the cookie value matches the hash of the admin password.
 */
export function verifySessionCookie(
  cookieValue: string | undefined,
  adminPassword: string | undefined
): boolean {
  if (!cookieValue || !adminPassword) {
    return false;
  }
  const expectedHash = hashPassword(adminPassword);
  return cookieValue === expectedHash;
}
