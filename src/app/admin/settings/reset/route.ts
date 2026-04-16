import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { SettingsSchema } from "@/app/admin/settings/schema";
import initialJson from "@/app/admin/settings/initial.json";

export async function POST() {
  try {
    const validated = SettingsSchema.parse(initialJson);
    await adminDb
      .collection("site")
      .doc("settings")
      .set({ ...validated, updatedAt: Date.now() }, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "Failed to reset settings" },
      { status: 500 }
    );
  }
}
