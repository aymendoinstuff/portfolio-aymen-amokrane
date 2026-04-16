import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null);
  if (!data?.name || !data?.email || !data?.message)
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  const id = String(Date.now());
  await adminDb
    .collection("offers")
    .doc(id)
    .set({
      id,
      type: data.type || "work",
      name: data.name,
      email: data.email,
      message: data.message,
      projectId: data.projectId || null,
      createdAt: Date.now(),
      status: "new",
    });
  return NextResponse.json({ ok: true, id });
}
