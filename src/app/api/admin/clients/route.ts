import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/server/auth/apiGuard";
import { repoListClients, repoCreateClient } from "@/lib/repositories/clientVault";

export async function GET() {
  const deny = await requireAdminApi();
  if (deny) return deny;
  try {
    const clients = await repoListClients();
    return NextResponse.json({ clients });
  } catch (err) {
    console.error("[clients GET]", err);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const deny = await requireAdminApi();
  if (deny) return deny;
  try {
    const body = await req.json();
    if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    const client = await repoCreateClient({
      name: body.name,
      company: body.company ?? "",
      email: body.email ?? "",
      phone: body.phone ?? "",
      industry: body.industry ?? "",
      projectTitle: body.projectTitle ?? "",
      status: body.status ?? "active",
      value: body.value ?? "",
      startDate: body.startDate ?? "",
      endDate: body.endDate ?? "",
      notes: body.notes ?? "",
    });
    return NextResponse.json({ client });
  } catch (err) {
    console.error("[clients POST]", err);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
