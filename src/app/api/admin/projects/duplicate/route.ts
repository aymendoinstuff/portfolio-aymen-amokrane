import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdminApi } from "@/server/auth/apiGuard";

export async function POST(req: NextRequest) {
  const deny = await requireAdminApi();
  if (deny) return deny;


  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    // Fetch original
    const snap = await adminDb.collection("projects").doc(id).get();
    if (!snap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data = snap.data() as Record<string, unknown>;

    // Deep-copy and patch
    const now = Date.now();
    const newData = {
      ...data,
      general: {
        ...(data.general as Record<string, unknown>),
        title: `${(data.general as Record<string, unknown>)?.title ?? "Project"} (Copy)`,
        published: false,
        createdAt: now,
        updatedAt: now,
      },
    };

    // Create new doc with auto-generated ID
    // Use Date.now() (not FieldValue.serverTimestamp()) so the value is a plain
    // number — Firestore Timestamps can't be serialised by Next.js when passed
    // as props to client components, which would cause an error page on open.
    const newRef = adminDb.collection("projects").doc();
    await newRef.set({
      ...newData,
      _duplicatedFrom: id,
      _duplicatedAt: now,
    });

    return NextResponse.json({ ok: true, newId: newRef.id });
  } catch (err) {
    console.error("[api/admin/projects/duplicate]", err);
    return NextResponse.json({ error: "Duplicate failed" }, { status: 500 });
  }
}
