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
      where("published", "==", true),
      orderBy("updatedAt", "desc"),
      limit(max)
    );
    const snap = await getDocs(q);
    console.log("✅ Projects:", snap.docs);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch (err) {
    console.error("[repoGetPublishedProjects] error:", err);
    return [];
  }
}

export async function repoGetProjectById(id: string): Promise<Project | null> {
  try {
    // 1) Try direct document lookup
    const ref = doc(firestore, "projects", id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data() as any;
      if (data?.published === true) {
        return { id: snap.id, ...(data as any) } as Project;
      }
      // Exists but not published → treat as not found for public repo
      return null;
    }

    // 2) Fallback: some setups use a `slug` field instead of doc id
    const q = query(
      collection(firestore, "projects"),
      where("slug", "==", id),
      where("published", "==", true),
      limit(1)
    );
    const qsnap = await getDocs(q);

    if (!qsnap.empty) {
      const d = qsnap.docs[0];
      return { id: d.id, ...(d.data() as any) } as Project;
    }

    return null;
  } catch (err) {
    console.error("[repoGetProjectById] error:", err);
    return null;
  }
}
