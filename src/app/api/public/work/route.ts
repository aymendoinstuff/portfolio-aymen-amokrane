import { NextResponse } from "next/server";
import { repoGetPublishedProjects } from "@/lib/repositories/projects";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const max = Math.min(Number(searchParams.get("limit") ?? 24), 100);

  const items = await repoGetPublishedProjects(max);
  return NextResponse.json({ items });
}
