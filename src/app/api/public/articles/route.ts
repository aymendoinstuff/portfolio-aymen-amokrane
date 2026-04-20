import { NextRequest, NextResponse } from "next/server";
import { repoGetPublishedArticles } from "@/lib/repositories/articles";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") ?? "10"), 1),
      50
    );

    const articles = await repoGetPublishedArticles(limit);

    return NextResponse.json({
      articles,
      count: articles.length,
    });
  } catch (error) {
    console.error("[GET /api/public/articles] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
