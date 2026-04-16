import { NextResponse } from "next/server";
import { repoGetApprovedCollaborations } from "@/lib/repositories/collaborations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const max = Math.min(Number(searchParams.get("limit") ?? 6), 100);

  const items = await repoGetApprovedCollaborations(max);
  return NextResponse.json({ items });
}
