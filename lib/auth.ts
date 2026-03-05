/**
 * Hash a password using SHA-256 via Web Crypto API.
 * Works in both Node.js and Edge Runtime.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify a session cookie against the admin password.
 * Returns true if the cookie value matches the hash of the admin password.
 */
export async function verifySessionCookie(
  cookieValue: string | undefined,
  adminPassword: string | undefined
): Promise<boolean> {
  if (!cookieValue || !adminPassword) {
    return false;
  }
  const expectedHash = await hashPassword(adminPassword);
  return cookieValue === expectedHash;
}
