import { adminDb } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";

const Schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = Schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Check for existing subscriber (avoid duplicates)
    const existing = await adminDb
      .collection("subscribers")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existing.empty) {
      // Already subscribed — still return success (don't leak info)
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    await adminDb.collection("subscribers").add({
      email,
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ status: "ok" }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/public/newsletter] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
