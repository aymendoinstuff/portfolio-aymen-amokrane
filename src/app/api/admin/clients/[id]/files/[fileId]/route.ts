import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/server/auth/apiGuard";
import { repoDeleteClientFile } from "@/lib/repositories/clientVault";
import { adminStorage } from "@/lib/firebase/admin";

type Ctx = { params: Promise<{ id: string; fileId: string }> };

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const deny = await requireAdminApi();
  if (deny) return deny;
  const { id, fileId } = await params;
  try {
    const { storagePath } = await req.json().catch(() => ({}));
    // Delete from Firebase Storage
    if (storagePath) {
      await adminStorage.bucket().file(storagePath).delete().catch(() => {});
    }
    // Delete metadata from Firestore
    await repoDeleteClientFile(id, fileId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[client file DELETE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
