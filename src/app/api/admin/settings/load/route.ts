import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { SettingsSchema } from "@/app/admin/settings/schema";

/**
 * GET /api/admin/settings/load
 * Reads site settings using the Admin SDK (bypasses Firestore security rules).
 * Used by the admin settings form to load current saved values reliably.
 */
export async function GET() {
  try {
    const snap = await adminDb.collection("site").doc("settings").get();

    if (!snap.exists) {
      return NextResponse.json({ settings: SettingsSchema.parse({}) });
    }

    const raw = snap.data() ?? {};
    const result = SettingsSchema.safeParse(raw);
    const settings = result.success ? result.data : SettingsSchema.parse({});

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("[GET /api/admin/settings/load] error:", error);
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}
