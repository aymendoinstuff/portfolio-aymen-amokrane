// Debug route removed — no longer needed
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
