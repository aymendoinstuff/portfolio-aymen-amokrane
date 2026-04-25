import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdminApi } from "@/server/auth/apiGuard";

export async function POST(req: NextRequest) {
  const deny = await requireAdminApi();
  if (deny) return deny;


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
