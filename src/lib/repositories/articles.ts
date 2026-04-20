import { adminDb } from "@/lib/firebase/admin";
import type { ArticleDoc } from "@/lib/types/article";

export async function repoGetPublishedArticles(
  limit = 50
): Promise<ArticleDoc[]> {
  try {
    // Query by published only (no orderBy) to avoid requiring a composite index.
    // Sort by createdAt descending in memory.
    const snap = await adminDb
      .collection("articles")
      .where("published", "==", true)
      .limit(limit)
      .get();

    const docs = snap.docs.map((d) => ({ ...(d.data() as ArticleDoc), id: d.id }));
    docs.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    return docs;
  } catch (error) {
    console.error("[repoGetPublishedArticles] error:", error);
    // Fallback: fetch all without filter and sort in memory
    try {
      const snap = await adminDb.collection("articles").limit(limit).get();
      const docs = snap.docs
        .map((d) => ({ ...(d.data() as ArticleDoc), id: d.id }))
        .filter((d) => d.published);
      docs.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      return docs;
    } catch {
      return [];
    }
  }
}

export async function repoGetArticleBySlug(
  slug: string
): Promise<ArticleDoc | null> {
  try {
    // Query by slug only, then filter published in memory — avoids composite index.
    const snap = await adminDb
      .collection("articles")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snap.empty) return null;
    const d = snap.docs[0];
    const data = d.data() as ArticleDoc;
    if (!data.published) return null;
    return { ...data, id: d.id };
  } catch (error) {
    console.error("[repoGetArticleBySlug] error:", error);
    return null;
  }
}
