import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null);

  // Minimal required fields for a project
  if (!data?.name || !data?.description) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const id = String(Date.now());

  await adminDb
    .collection("projects")
    .doc(id)
    .set({
      id,
      name: data.name,
      description: data.description,
      url: data.url || null,
      repo: data.repo || null,
      images: Array.isArray(data.images) ? data.images : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      published: false,      // your client fetch uses this
      status: "new",
    });

  return NextResponse.json({ ok: true, id });
}
