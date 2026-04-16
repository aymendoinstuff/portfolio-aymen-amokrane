/* eslint-disable @typescript-eslint/no-explicit-any */
import { firestore } from "@/lib/firebase/client";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import type { CollaborationDoc } from "@/lib/types/collaboration";

export async function repoGetApprovedCollaborations(
  max = 6
): Promise<CollaborationDoc[]> {
  try {
    const q = query(
      collection(firestore, "collaborations"),
      where("published", "==", true),
      limit(max)
    );
    const snap = await getDocs(q);
    console.log("✅ Collaborations:", snap.docs);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch (err) {
    console.error("[repoGetApprovedCollaborations] error:", err);
    return [];
  }
}
