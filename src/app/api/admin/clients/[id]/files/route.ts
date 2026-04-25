import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/server/auth/apiGuard";
import { repoAddClientFile } from "@/lib/repositories/clientVault";
import type { DocType } from "@/lib/types/clientVault";

type Ctx = { params: Promise<{ id: string }> };

/** POST — save file metadata after client has uploaded directly to Firebase Storage */
export async function POST(req: NextRequest, { params }: Ctx) {
  const deny = await requireAdminApi();
  if (deny) return deny;
  const { id } = await params;
  try {
    const body = await req.json();
    const { label, docType, url, storagePath, size, mimeType, notes } = body;
    if (!url || !storagePath || !docType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const file = await repoAddClientFile(id, {
      label: label || docType,
      docType: docType as DocType,
      url,
      storagePath,
      size: size ?? 0,
      mimeType: mimeType ?? "application/octet-stream",
      uploadedAt: Date.now(),
      notes: notes ?? "",
    });
    return NextResponse.json({ file });
  } catch (err) {
    console.error("[client files POST]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
