import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
export async function GET() {
  const u = await getCurrentUser();
  return NextResponse.json({ isAdmin: !!u?.isAdmin, email: u?.email || null });
}
