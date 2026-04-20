// middleware.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Keep this in sync with your server-side name:
 * src/server/cookies.ts -> COOKIE.SESSION or process.env.SESSION_COOKIE_NAME
 */
const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME?.trim() || "__session";

// Paths
const PUBLIC_LOGIN_PATH = "/login";
const DEFAULT_AFTER_LOGIN = "/admin";

// Anything here is "cookie-required" at the edge.
// (Server still does the real auth/role checks.)
const PROTECTED_PREFIXES = ["/admin", "/api/respond"];

/** Utility: does pathname start with any of the given prefixes? */
function startsWithAny(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p));
}

/** Only allow internal redirect targets (avoid open redirect). */
function normalizeNext(next: string | null | undefined): string | null {
  if (!next) return null;
  // Allow absolute path only (no protocol/host)
  return next.startsWith("/") ? next : null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const searchParams = req.nextUrl.searchParams;
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE_NAME)?.value);

  // NOTE: We intentionally do NOT auto-redirect signed-in users away from /login
  // here because the Edge can only check cookie presence, not validity.
  // A stale/invalid cookie would cause an infinite redirect loop.

  // Only guard the routes we explicitly mark as protected.
  const needsAuth = startsWithAny(pathname, PROTECTED_PREFIXES);
  if (!needsAuth) return NextResponse.next();

  // Edge guard = presence of cookie only. (Full verification happens server-side.)
  if (hasSession) return NextResponse.next();

  // No cookie:
  if (pathname.startsWith("/api/")) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  // Redirect to login with a reason + next param for return after login.
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = PUBLIC_LOGIN_PATH;
  loginUrl.searchParams.set("reason", "auth");

  // Preserve original path + query so we can send the user back after login.
  const original = pathname + (req.nextUrl.search || "");
  // original always begins with '/', so it's safe to pass as `next`.
  loginUrl.searchParams.set("next", original);

  return NextResponse.redirect(loginUrl);
}

/**
 * Match only what we need:
 * - all admin pages
 * - the protected API endpoint
 * - the login page (to auto-redirect signed-in users)
 *
 * If you use i18n locales, you can extend this to include locale prefixes.
 */
export const config = {
  matcher: ["/admin/:path*", "/api/respond", "/login"],
};
