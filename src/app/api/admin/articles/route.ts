import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null);

  // Minimal required fields for an article
  if (!data?.title || !data?.content) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const id = String(Date.now());

  await adminDb
    .collection("articles")
    .doc(id)
    .set({
      id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || "",
      authorName: data.authorName || null,
      authorEmail: data.authorEmail || null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      coverImage: data.coverImage || null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      published: false, // your client fetch uses this
      status: "draft", // simple workflow hint
    });

  return NextResponse.json({ ok: true, id });
}
