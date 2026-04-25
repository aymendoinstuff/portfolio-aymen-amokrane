import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdminApi } from "@/server/auth/apiGuard";

export async function POST(req: NextRequest) {
  const deny = await requireAdminApi();
  if (deny) return deny;

  try {
    const data = await req.json();
    const { id, ...fields } = data;

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await adminDb
      .collection("articles")
      .doc(id)
      .set(
        { ...fields, updatedAt: Date.now() },
        { merge: true }
      );

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("[POST /api/admin/articles/save]", err);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
