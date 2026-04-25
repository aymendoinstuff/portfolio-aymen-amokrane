/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDb } from "@/lib/firebase/admin";
import InboxClient from "./InboxClient";

export const dynamic = "force-dynamic";

/** Firestore Timestamp → epoch ms */
function toMs(val: any): number {
  if (!val) return 0;
  if (typeof val === "number") return val;
  if (typeof val?.toMillis === "function") return val.toMillis();
  if (typeof val?.seconds === "number") return val.seconds * 1000;
  return 0;
}

/** Normalise an `offers` doc (general inquiry / collab request) */
function normaliseOffer(id: string, raw: any) {
  return {
    id,
    source: "inquiry" as const,
    name:        raw.name        ?? raw.contactName  ?? "Unknown",
    email:       raw.email       ?? raw.contactEmail ?? "",
    message:     raw.brief       ?? raw.message      ?? "",
    role:        raw.role        ?? null,
    projectName: raw.projectName ?? null,
    industry:    raw.industry    ?? null,
    budget:      raw.budget      ?? null,
    timeline:    raw.timeline    ?? null,
    country:     raw.country     ?? null,
    projectType: raw.projectType ?? null,
    subject:     raw.subject     ?? null,
    location:    null as string | null,
    serviceTitle: raw.serviceTitle ?? null,
    kind:        raw.kind        ?? raw.type ?? null,
    status:      raw.status      ?? "new",
    createdAt:   toMs(raw.createdAt),
    updatedAt:   toMs(raw.updatedAt),
  };
}

/** Normalise a `bookings` doc (service booking request) */
function normaliseBooking(id: string, raw: any) {
  return {
    id,
    source: "booking" as const,
    name:        raw.name         ?? raw.contactName  ?? "Unknown",
    email:       raw.email        ?? raw.contactEmail ?? "",
    message:     raw.brief ?? raw.message ?? raw.helpTopic ?? raw.concept ?? raw.issues ?? raw.workshopTopic ?? "",
    role:        null as string | null,
    projectName: raw.projectTitle ?? raw.brandName    ?? null,
    industry:    null as string | null,
    budget:      raw.budgetRange  ?? null,
    timeline:    raw.timeline     ?? null,
    country:     raw.location     ?? null,
    projectType: null as string | null,
    subject:     raw.subject      ?? null,
    location:    raw.location     ?? null,
    serviceTitle: raw.serviceTitle ?? null,
    kind:        raw.type         ?? raw.kind ?? null,
    status:      raw.status       ?? "new",
    createdAt:   toMs(raw.createdAt),
    updatedAt:   toMs(raw.updatedAt),
  };
}

async function getInboxItems() {
  try {
    const [offersSnap, bookingsSnap] = await Promise.all([
      adminDb.collection("offers").orderBy("createdAt", "desc").limit(200).get(),
      adminDb.collection("bookings").orderBy("createdAt", "desc").limit(100).get(),
    ]);

    const offers   = offersSnap.docs.map((d) => normaliseOffer(d.id, d.data()));
    const bookings = bookingsSnap.docs.map((d) => normaliseBooking(d.id, d.data()));

    // Merge and sort newest first
    return [...offers, ...bookings].sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

async function getSubscribers(): Promise<{ id: string; email: string; status: string; createdAt: number }[]> {
  try {
    const snap = await adminDb.collection("subscribers").orderBy("createdAt", "desc").limit(500).get();
    return snap.docs.map((d) => {
      const raw = d.data() as any;
      return {
        id: d.id,
        email: raw.email ?? "",
        status: raw.status ?? "active",
        createdAt: toMs(raw.createdAt),
      };
    });
  } catch {
    return [];
  }
}

export default async function InboxPage() {
  const [items, subscribers] = await Promise.all([getInboxItems(), getSubscribers()]);
  return <InboxClient items={items} subscribers={subscribers} />;
}
