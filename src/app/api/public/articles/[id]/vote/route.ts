import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = await req.json();
    const action = body?.action; // "like" | "dislike" | "unlike" | "undislike"

    if (!["like", "dislike", "unlike", "undislike"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const field = action === "like" || action === "unlike" ? "likes" : "dislikes";
    const increment = action === "unlike" || action === "undislike" ? -1 : 1;

    await adminDb
      .collection("articles")
      .doc(id)
      .update({ [field]: FieldValue.increment(increment) });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/public/articles/[id]/vote]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
