import { NextResponse } from "next/server";
import { repoGetProjectById } from "@/lib/repositories/projects";
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const trimmedId = id.trim();

  if (!trimmedId) {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }

  const item = await repoGetProjectById(trimmedId);
  if (!item) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item });
}
