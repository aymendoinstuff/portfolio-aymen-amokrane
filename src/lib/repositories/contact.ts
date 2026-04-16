/* eslint-disable @typescript-eslint/no-explicit-any */
import { firestore } from "@/lib/firebase/client";
import {
  addDoc,
  collection,
  getDocs,
  limit as fbLimit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

export type OfferKind = "collab" | "job";

export interface OfferCreateInput {
  kind: OfferKind;
  name: string;
  email: string;
  projectName: string;
  industry: string;
  budget: string;
  timeline: string;
  country: string;
  projectType: string;
  brief: string;
  priorityKey?: "cafe" | "esports" | "fintech" | "event" | "logistics";
}

export async function repoCreateOffer(input: OfferCreateInput): Promise<string> {
  try {
    const ref = await addDoc(collection(firestore, "offers"), {
      ...input,
      status: "new",              // optional triage field
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (err) {
    console.error("[repoCreateOffer] error:", err);
    throw err;
  }
}

export async function repoListOffers(args?: {
  limit?: number;
  kind?: OfferKind;
}) {
  try {
    const base = collection(firestore, "offers");
    const clauses = [
      args?.kind ? where("kind", "==", args.kind) : null,
      orderBy("createdAt", "desc"),
      fbLimit(args?.limit ?? 24),
    ].filter(Boolean) as any[];

    const q = query(base, ...clauses);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch (err) {
    console.error("[repoListOffers] error:", err);
    return [];
  }
}
