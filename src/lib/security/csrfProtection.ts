import { cookies } from "next/headers";
import crypto from "crypto";

const CSRF_COOKIE_NAME = "fh_csrf_token";

// Generates a random CSRF token
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Attaches a new CSRF token to the session cookies
export function setCsrfCookie() {
  const token = generateCsrfToken();
  const cookieStore = cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  return token;
}

// Validates the CSRF token from the request header against the cookie
export function validateCsrfToken(request: Request): boolean {
  const cookieStore = cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;
  
  const headerToken = request.headers.get("x-csrf-token");
  
  if (!cookieToken || !headerToken) return false;
  
  // Constant time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken),
      Buffer.from(headerToken)
    );
  } catch (e) {
    return false;
  }
}

// Rotates the token (generates a new one and overwrites the cookie)
export function rotateCsrfToken() {
  return setCsrfCookie();
}
