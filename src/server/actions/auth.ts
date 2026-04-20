"use server";

import { redirect } from "next/navigation";
import {
  destroySession,
  getCurrentUser,
  loginWithIdToken,
} from "@/server/auth/server";
import { revalidatePath } from "next/cache";


// Logout
export async function logoutAction() {
  // Revoke refresh tokens if you have a UID; otherwise just clear the cookie
  const user = await getCurrentUser();
  await destroySession(user?.uid);
  revalidatePath("/");
  redirect("/login");
}


function sanitizeNext(next?: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
}

/** Direct-call action: pass an idToken (from client helper) and optional next path */
export async function loginAction(idToken: string, next?: string) {
  if (!idToken) return { ok: false as const, message: "Missing ID token." };

  const res = await loginWithIdToken(idToken, {
    maxAgeSec: 60 * 60 * 24 * 5,  // 5 days
    requireAdmin: true,           // toggle to false if not needed
    requireEmailVerified: true,   // toggle to false if not needed
  });

  if (!res.ok) {
    return { ok: false as const, message: res.message };
  }

  // Return redirect path to client — let the browser navigate so the
  // Set-Cookie header is fully committed before the next request fires.
  return { ok: true as const, redirectTo: sanitizeNext(next) };
}
