import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await req.json();
    const { status, ...rest } = json;

    if (!["new", "confirmed", "declined", "read"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await adminDb.collection("bookings").doc(id).update({
      status,
      ...rest,
      updatedAt: Date.now(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/admin/bookings/[id]] error:", err);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doc = await adminDb.collection("bookings").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ booking: { id: doc.id, ...doc.data() } });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
