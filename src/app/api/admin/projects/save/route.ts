import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getCurrentUser } from "@/server/auth/server";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const id = payload?.general?.id;
    if (!id) {
      return NextResponse.json({ error: "Missing project id" }, { status: 400 });
    }

    await adminDb.collection("projects").doc(id).set(payload, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/projects/save]", err);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
