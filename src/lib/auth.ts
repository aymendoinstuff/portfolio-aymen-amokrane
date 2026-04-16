/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

export const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "__session";

export type SessionUser = {
  uid: string;
  email?: string;
  isAdmin: boolean;
  claims: Record<string, any>;
};

function parseAdminAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = cookies(); // ✅ not async
  const sessionCookie = (await jar).get(COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const email = decoded.email ?? undefined;

    const allowlist = parseAdminAllowlist();
    const isAllowlisted = email
      ? allowlist.includes(email.toLowerCase())
      : false;
    const isAdminClaim = Boolean((decoded as any).admin);

    return {
      uid: decoded.uid,
      email,
      isAdmin: isAdminClaim || isAllowlisted,
      claims: decoded as Record<string, any>,
    };
  } catch {
    // ✅ Break redirect loops by removing invalid/expired cookies
    try {
      (await cookies()).delete(COOKIE_NAME);
    } catch {}
    return null;
  }
}
