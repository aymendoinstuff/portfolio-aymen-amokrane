import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { SettingsSchema } from "@/app/admin/settings/schema";

// For now, accept any request (in production, add auth)
// If you have getCurrentUser or similar auth, add it here
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate data against schema
    const validated = SettingsSchema.parse(data);

    // Save to Firestore
    await adminDb
      .collection("site")
      .doc("settings")
      .set(
        { ...validated, updatedAt: Date.now() },
        { merge: true }
      );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[POST /api/admin/settings/save] error:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 400 }
    );
  }
}
