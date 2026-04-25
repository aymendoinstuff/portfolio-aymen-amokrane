import { NextRequest, NextResponse } from "next/server";

/**
 * Edge middleware — runs before any page or API route is hit.
 *
 * Protects /admin/* by checking for the session cookie.
 * This is a fast "gate" check (cookie existence only — the real
 * cryptographic verification happens server-side in requireAdmin/requireAdminApi).
 */

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME?.trim() || "__session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard admin routes
  if (pathname.startsWith("/admin")) {
    const session = req.cookies.get(SESSION_COOKIE);

    // No cookie at all → redirect to login immediately
    if (!session?.value) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = `?reason=auth&next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all /admin routes, skip static files and Next internals
    "/admin/:path*",
  ],
};
