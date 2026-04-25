import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { z } from "zod";
import { requireAdminApi } from "@/server/auth/apiGuard";

const EventSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["call", "project", "blocked", "pending"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  notes: z.string().optional(),
  bookingId: z.string().optional(),
  clientName: z.string().optional(),
  clientEmail: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const deny = await requireAdminApi();
  if (deny) return deny;

  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // YYYY-MM

    let query = adminDb.collection("events").orderBy("date", "asc") as FirebaseFirestore.Query;
    if (month) {
      query = query
        .where("date", ">=", `${month}-01`)
        .where("date", "<=", `${month}-31`);
    }

    const snap = await query.limit(200).get();
    const events = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ events });
  } catch (err) {
    console.error("[GET /api/admin/events] error:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const deny = await requireAdminApi();
  if (deny) return deny;

  try {
    const json = await req.json();
    const parsed = EventSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
    }

    const ref = await adminDb.collection("events").add({
      ...parsed.data,
      createdAt: Date.now(),
    });

    // If linked to a booking, mark it as confirmed
    if (parsed.data.bookingId && parsed.data.type === "call") {
      await adminDb.collection("bookings").doc(parsed.data.bookingId).update({
        status: "confirmed",
        updatedAt: Date.now(),
      });
    }

    return NextResponse.json({ id: ref.id, ok: true }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/events] error:", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const deny = await requireAdminApi();
  if (deny) return deny;

  try {
    const json = await req.json();
    const { id, ...updates } = json;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await adminDb.collection("events").doc(id).update({ ...updates, updatedAt: Date.now() });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/admin/events] error:", err);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const deny = await requireAdminApi();
  if (deny) return deny;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await adminDb.collection("events").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/events] error:", err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
