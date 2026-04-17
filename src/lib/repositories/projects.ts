/* eslint-disable @typescript-eslint/no-explicit-any */
import { firestore } from "@/lib/firebase/client";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { Project } from "@/lib/types/project";

export async function repoGetPublishedProjects(max = 24): Promise<Project[]> {
  try {
    const q = query(
      collection(firestore, "projects"),
      where("general.published", "==", true),
      orderBy("general.updatedAt", "desc"),
      limit(max)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...(d.data() as any) }));
  } catch (err) {
    console.error("[repoGetPublishedProjects] error:", err);
    return [];
  }
}

export async function repoGetProjectById(id: string): Promise<Project | null> {
  try {
    // 1) Try direct document lookup by doc id
    const ref = doc(firestore, "projects", id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data() as any;
      if (data?.general?.published === true) {
        return { ...(data as any) } as Project;
      }
      return null;
    }

    // 2) Fallback: look up by slug field
    const q = query(
      collection(firestore, "projects"),
      where("general.slug", "==", id),
      where("general.published", "==", true),
      limit(1)
    );
    const qsnap = await getDocs(q);

    if (!qsnap.empty) {
      const d = qsnap.docs[0];
      return { ...(d.data() as any) } as Project;
    }

    return null;
  } catch (err) {
    console.error("[repoGetProjectById] error:", err);
    return null;
  }
}
