import { NextResponse } from "next/server";
// If you haven't renamed your data file yet, temporarily import the old names and re-export them.
import {
  PROPOSED_PROJECTS,
  PROJECT_REQUIREMENTS,
  PROJECT_TAGS,
} from "@/lib/data/contact";

export async function GET() {
  return NextResponse.json({
    PROPOSED_PROJECTS,
    PROJECT_REQUIREMENTS,
    PROJECT_TAGS,
  });
}
