/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDb } from "@/lib/firebase/admin";
import type { Project } from "@/lib/types/project";

export async function repoGetPublishedProjects(max = 24): Promise<Project[]> {
  try {
    const snap = await adminDb
      .collection("projects")
      .where("general.published", "==", true)
      .get();
    return snap.docs
      .map((d) => d.data() as Project)
      .sort((a, b) => (b.general.updatedAt ?? 0) - (a.general.updatedAt ?? 0))
      .slice(0, max);
  } catch (err) {
    console.error("[repoGetPublishedProjects] error:", err);
    return [];
  }
}

export async function repoGetProjectById(id: string): Promise<Project | null> {
  try {
    // 1) Try direct document lookup by doc id
    const snap = await adminDb.collection("projects").doc(id).get();

    if (snap.exists) {
      const data = snap.data() as any;
      if (data?.general?.published === true) {
        return data as Project;
      }
      return null;
    }

    // 2) Fallback: look up by slug field
    const qsnap = await adminDb
      .collection("projects")
      .where("general.slug", "==", id)
      .where("general.published", "==", true)
      .limit(1)
      .get();

    if (!qsnap.empty) {
      return qsnap.docs[0].data() as Project;
    }

    return null;
  } catch (err) {
    console.error("[repoGetProjectById] error:", err);
    return null;
  }
}
