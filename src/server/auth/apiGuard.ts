import "server-only";
import { NextResponse } from "next/server";
import { getCurrentUser } from "./server";

/**
 * Use at the top of every admin API route handler.
 * Returns a 401 NextResponse if the caller is not an authenticated admin,
 * or null if the request is allowed to proceed.
 *
 * Usage:
 *   const deny = await requireAdminApi();
 *   if (deny) return deny;
 */
export async function requireAdminApi(): Promise<NextResponse | null> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
