// src/lib/auth/server.ts
import "server-only";
import type { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth } from "@/lib/firebase/admin";
import { COOKIE, getCookie, setCookie, deleteCookie } from "@/server/cookies";

const isProd = process.env.NODE_ENV === "production";

// Admin allowlist (comma-separated)
const ADMIN_ALLOWLIST = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

function extractCustomClaims(t: DecodedIdToken): Record<string, unknown> {
  const reserved = new Set([
    "aud",
    "auth_time",
    "email",
    "email_verified",
    "exp",
    "firebase",
    "iat",
    "iss",
    "sub",
    "uid",
    "phone_number",
    "name",
    "picture",
    "provider_id",
  ]);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(t)) if (!reserved.has(k)) out[k] = v;
  return out;
}

function isAllowlisted(email?: string | null) {
  return email ? ADMIN_ALLOWLIST.has(email.trim().toLowerCase()) : false;
}

export type SessionUser = {
  uid: string;
  email?: string;
  emailVerified: boolean;
  isAdmin: boolean;
  claims: Record<string, unknown>; // custom claims only
};

// Verify session cookie on server (SSR, RSC, route handlers)
export async function getCurrentUser(): Promise<SessionUser | null> {
  const sessionCookie = await getCookie(COOKIE.SESSION);
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, false);
    const email = decoded.email ?? undefined;
    const emailVerified = Boolean(decoded.email_verified);
    const custom = extractCustomClaims(decoded);
    const claimAdmin = custom["admin"] === true;

    const isAdmin = (claimAdmin && emailVerified) || isAllowlisted(email);
    return {
      uid: decoded.uid,
      email,
      emailVerified,
      isAdmin,
      claims: custom,
    };
  } catch (err) {
    console.error("[getCurrentUser] verifySessionCookie failed:", err);
    await deleteCookie(COOKIE.SESSION);
    return null;
  }
}

// Mint a Firebase session cookie after client signs in with ID token
export async function createSessionFromIdToken(
  idToken: string,
  maxAgeSec: number
) {
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: maxAgeSec,
  });
  await setCookie(COOKIE.SESSION, sessionCookie, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSec,
  });
}

// ✅ NEW: Server-side login using Firebase Admin
// - Verifies client ID token (checks revocation)
// - Applies emailVerified / admin allowlist rules
// - Mints the HTTP-only session cookie on success
export async function loginWithIdToken(
  idToken: string,
  opts?: {
    maxAgeSec?: number;
    requireAdmin?: boolean; // set true for admin-only areas
    requireEmailVerified?: boolean; // set true if you require verified emails
  }
): Promise<
  | { ok: true; user: SessionUser }
  | {
      ok: false;
      code: "INVALID_TOKEN" | "EMAIL_UNVERIFIED" | "FORBIDDEN";
      message: string;
    }
> {
  const maxAgeSec = opts?.maxAgeSec ?? 60 * 60 * 24 * 5; // 5 days
  const requireAdmin = opts?.requireAdmin ?? false;
  const requireEmailVerified = opts?.requireEmailVerified ?? false;

  let decoded: DecodedIdToken;
  try {
    // Verify the raw ID token from the client, checking revocation
    decoded = await adminAuth.verifyIdToken(idToken, false);
  } catch (err) {
    console.error("[loginWithIdToken] verifyIdToken failed:", err);
    return {
      ok: false,
      code: "INVALID_TOKEN",
      message: "Invalid or expired token.",
    };
  }

  const email = decoded.email ?? undefined;
  const emailVerified = Boolean(decoded.email_verified);
  const custom = extractCustomClaims(decoded);
  const claimAdmin = custom["admin"] === true;
  const isAdmin = (claimAdmin && emailVerified) || isAllowlisted(email);

  if (requireEmailVerified && !emailVerified) {
    return {
      ok: false,
      code: "EMAIL_UNVERIFIED",
      message: "Email not verified.",
    };
  }
  if (requireAdmin && !isAdmin) {
    return {
      ok: false,
      code: "FORBIDDEN",
      message: "This account doesn’t have admin access.",
    };
  }

  // Create the long-lived session cookie
  await createSessionFromIdToken(idToken, maxAgeSec);

  const user: SessionUser = {
    uid: decoded.uid,
    email,
    emailVerified,
    isAdmin,
    claims: custom,
  };

  return { ok: true, user };
}

// Destroy session (also consider revoking refresh tokens on sign-out)
export async function destroySession(uid?: string) {
  if (uid) {
    // Optional but recommended on sign-out or role change:
    await adminAuth.revokeRefreshTokens(uid);
  }
  await deleteCookie(COOKIE.SESSION);
}
