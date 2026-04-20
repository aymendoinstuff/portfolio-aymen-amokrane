import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getCurrentUser } from "@/server/auth/server";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await adminDb.collection("projects").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/projects/delete]", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
