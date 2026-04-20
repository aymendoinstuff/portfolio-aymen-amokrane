import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

/**
 * GET /api/public/availability?month=YYYY-MM
 * Returns busy dates for the public availability widget.
 * "Busy" = has a blocked or project event on that day.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month") ?? new Date().toISOString().slice(0, 7);

    const snap = await adminDb
      .collection("events")
      .where("date", ">=", `${month}-01`)
      .where("date", "<=", `${month}-31`)
      .get();

    const busyDates: string[] = [];
    const callDates: string[] = [];

    snap.docs.forEach((d) => {
      const data = d.data();
      if (data.type === "blocked" || data.type === "project") {
        busyDates.push(data.date);
        // Handle multi-day project events
        if (data.endDate && data.endDate !== data.date) {
          const start = new Date(data.date);
          const end = new Date(data.endDate);
          const cur = new Date(start);
          cur.setDate(cur.getDate() + 1);
          while (cur <= end) {
            busyDates.push(cur.toISOString().slice(0, 10));
            cur.setDate(cur.getDate() + 1);
          }
        }
      }
      if (data.type === "call") {
        callDates.push(data.date);
      }
    });

    return NextResponse.json(
      { busyDates: [...new Set(busyDates)], callDates: [...new Set(callDates)] },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" } }
    );
  } catch (err) {
    console.error("[GET /api/public/availability] error:", err);
    return NextResponse.json({ busyDates: [], callDates: [] });
  }
}
