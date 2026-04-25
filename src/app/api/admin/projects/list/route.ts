import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdminApi } from "@/server/auth/apiGuard";

export async function GET() {
  const deny = await requireAdminApi();
  if (deny) return deny;

  try {
    const snap = await adminDb.collection("projects").get();
    const projects = snap.docs
      .map((d) => {
        const data = d.data() as Record<string, any>;
        return {
          id: data?.general?.id || d.id,
          title: data?.general?.title ?? "Untitled",
          heroUrl: data?.general?.heroUrl ?? "",
          slug: data?.general?.slug ?? d.id,
          published: data?.general?.published ?? false,
        };
      })
      .filter((p) => p.published)
      .sort((a, b) => a.title.localeCompare(b.title));

    return NextResponse.json({ projects });
  } catch (err) {
    console.error("[GET /api/admin/projects/list]", err);
    return NextResponse.json({ projects: [] });
  }
}
