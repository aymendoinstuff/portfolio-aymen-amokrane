// app/api/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs"; // ✅ Admin SDK requires Node
export const dynamic = "force-dynamic"; // avoid caching issues

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "__session";
const EXPIRES_IN = 60 * 60 * 24 * 5 * 1000; // 5 days (ms)
const isProd = process.env.NODE_ENV === "production";

export async function POST(req: NextRequest) {
  const { idToken } = await req.json().catch(() => ({}));
  if (!idToken) {
    return NextResponse.json({ error: "missing idToken" }, { status: 400 });
  }

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN,
    });

    // Try to honor ?next from the /login page via the Referer URL
    const referer = req.headers.get("referer");
    const next =
      (referer && new URL(referer).searchParams.get("next")) || "/admin";

    const res = NextResponse.json({ ok: true, redirectTo: next });
    res.cookies.set(COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: isProd, // ✅ dev on http://localhost will now work
      sameSite: "lax",
      maxAge: EXPIRES_IN / 1000,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
