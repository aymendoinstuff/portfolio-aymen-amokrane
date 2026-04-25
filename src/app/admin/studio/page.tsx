export const dynamic = "force-dynamic";

import { adminDb } from "@/lib/firebase/admin";
import StudioClient from "./StudioClient";

async function getEvents() {
  try {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      .toISOString()
      .slice(0, 10);
    const to = new Date(now.getFullYear(), now.getMonth() + 3, 0)
      .toISOString()
      .slice(0, 10);

    const snap = await adminDb
      .collection("events")
      .where("date", ">=", from)
      .where("date", "<=", to)
      .orderBy("date", "asc")
      .get();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch { return []; }
}

export default async function StudioPage() {
  const events = await getEvents();
  return <StudioClient initialEvents={events} />;
}
