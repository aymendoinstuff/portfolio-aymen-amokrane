import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/server/auth/apiGuard";
import {
  repoGetClient, repoUpdateClient, repoDeleteClient, repoListClientFiles,
} from "@/lib/repositories/clientVault";
import { adminStorage } from "@/lib/firebase/admin";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const deny = await requireAdminApi();
  if (deny) return deny;
  const { id } = await params;
  try {
    const [client, files] = await Promise.all([repoGetClient(id), repoListClientFiles(id)]);
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ client, files });
  } catch (err) {
    console.error("[client GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const deny = await requireAdminApi();
  if (deny) return deny;
  const { id } = await params;
  try {
    const body = await req.json();
    await repoUpdateClient(id, body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[client PATCH]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const deny = await requireAdminApi();
  if (deny) return deny;
  const { id } = await params;
  try {
    // Delete all Storage files for this client
    const bucket = adminStorage.bucket();
    await bucket.deleteFiles({ prefix: `client-vault/${id}/` }).catch(() => {});
    await repoDeleteClient(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[client DELETE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
