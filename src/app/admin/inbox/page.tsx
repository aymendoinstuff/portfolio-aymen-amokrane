/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDb } from "@/lib/firebase/admin";
import InboxClient from "./InboxClient";

async function getOffers() {
  try {
    const snap = await adminDb.collection("offers").orderBy("createdAt", "desc").limit(100).get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch { return []; }
}

async function getCollaborations() {
  try {
    const snap = await adminDb.collection("collaborations").orderBy("createdAt", "desc").limit(100).get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch { return []; }
}

export default async function InboxPage() {
  const [offers, collabs] = await Promise.all([getOffers(), getCollaborations()]);
  return <InboxClient offers={offers} collabs={collabs} />;
}
