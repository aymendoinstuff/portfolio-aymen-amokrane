import { adminDb } from "@/lib/firebase/admin";
import type { ArticleDoc } from "@/lib/types/article";

// Sanitise Firestore Timestamp/special objects so they don't crash Next.js
// serialisation when passed as props to "use client" components.
function sanitise<T>(data: unknown): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

export async function repoGetPublishedArticles(
  limit = 50
): Promise<ArticleDoc[]> {
  try {
    const snap = await adminDb
      .collection("articles")
      .where("published", "==", true)
      .limit(limit)
      .get();

    const docs = snap.docs.map((d) => sanitise<ArticleDoc>({ ...d.data(), id: d.id }));
    docs.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    return docs;
  } catch (error) {
    console.error("[repoGetPublishedArticles] error:", error);
    try {
      const snap = await adminDb.collection("articles").limit(limit).get();
      const docs = snap.docs
        .map((d) => sanitise<ArticleDoc>({ ...d.data(), id: d.id }))
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
    const snap = await adminDb
      .collection("articles")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snap.empty) return null;
    const d = snap.docs[0];
    const data = sanitise<ArticleDoc>({ ...d.data(), id: d.id });
    if (!data.published) return null;
    return data;
  } catch (error) {
    console.error("[repoGetArticleBySlug] error:", error);
    return null;
  }
}
