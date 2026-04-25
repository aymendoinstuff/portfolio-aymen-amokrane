/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDb } from "@/lib/firebase/admin";
import type { Project } from "@/lib/types/project";

// Firestore can return Timestamp objects for date fields. These crash Next.js
// when passed as props to "use client" components. Sanitise through JSON to
// coerce them into plain numbers/strings before they leave the repository.
function sanitise<T>(data: unknown): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

export async function repoGetPublishedProjects(max = 24): Promise<Project[]> {
  try {
    const snap = await adminDb.collection("projects").get();
    return snap.docs
      .map((d) => {
        const data = sanitise<Project>(d.data());
        // Ensure general.id is always populated — mirrors the admin picker's
        // fallback of `data?.general?.id ?? d.id` so featured-project ID
        // matching works even for older docs that lack an inline general.id.
        if (data?.general && !data.general.id) {
          data.general.id = d.id;
        }
        return data;
      })
      .filter((p) => p?.general?.published === true)
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
      const data = sanitise<any>(snap.data());
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
      return sanitise<Project>(qsnap.docs[0].data());
    }

    return null;
  } catch (err) {
    console.error("[repoGetProjectById] error:", err);
    return null;
  }
}
