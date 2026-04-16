/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { firestore } from "./firebase/client";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { Project } from "./types/project";
import { ArticleDoc } from "./types/article";
import { CollaborationDoc } from "./types/collaboration";
export async function fetchPublishedProjects(max = 12): Promise<Project[]> {
  try {
    const q = query(
      collection(firestore, "projects"),
      where("published", "==", true),
      orderBy("updatedAt", "desc"),
      limit(max)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch {
    return [];
  }
}
export async function fetchPublishedArticles(max = 6): Promise<ArticleDoc[]> {
  try {
    const q = query(
      collection(firestore, "articles"),
      where("published", "==", true),
      orderBy("updatedAt", "desc"),
      limit(max)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch {
    return [];
  }
}
export async function fetchApprovedCollaborations(
  max = 12
): Promise<CollaborationDoc[]> {
  try {
    const q = query(
      collection(firestore, "collaborations"),
      where("published", "==", true),
      limit(max)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch {
    return [];
  }
}
