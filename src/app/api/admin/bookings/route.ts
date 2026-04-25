import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdminApi } from "@/server/auth/apiGuard";

export async function GET() {
  const deny = await requireAdminApi();
  if (deny) return deny;

  try {
    const snap = await adminDb
      .collection("bookings")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const bookings = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("[GET /api/admin/bookings] error:", err);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
