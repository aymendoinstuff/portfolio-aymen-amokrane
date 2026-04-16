import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null);

  // Required: name, email, message (mirrors your offers shape)
  if (!data?.name || !data?.email || !data?.message) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const id = String(Date.now());

  await adminDb
    .collection("collaborations")
    .doc(id)
    .set({
      id,
      // You can keep a 'type' if you like for filtering
      type: data.type || "collaboration",
      name: data.name,
      email: data.email,
      message: data.message,
      projectId: data.projectId || null,
      role: data.role || null,
      skills: Array.isArray(data.skills) ? data.skills : [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: "pending", // new request default
      published: false, // surface-control flag (aligns w/ your client queries)
    });

  return NextResponse.json({ ok: true, id });
}
