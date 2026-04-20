import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await adminDb
      .collection("articles")
      .doc(id)
      .update({ views: FieldValue.increment(1) });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/public/articles/[id]/view]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
