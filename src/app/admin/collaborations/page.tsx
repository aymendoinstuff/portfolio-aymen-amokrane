/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDb } from "@/lib/firebase/admin";
import Link from "next/link";
async function getAll() {
  const snap = await adminDb
    .collection("collaborations")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}
export default async function CollabAdmin() {
  const list = await getAll();
  return (
    <main className="grid gap-4">
      <div className="text-xl font-semibold">Collaborations</div>
      <div className="grid divide-y border-2 border-black rounded-xl overflow-hidden">
        {list.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-[2fr_1fr_1fr_auto] items-center gap-2 px-3 py-2"
          >
            <div className="font-medium">{c.projectTitle}</div>
            <div className="text-sm opacity-70">{c.contact?.email}</div>
            <div className="text-sm">{c.status}</div>
            <Link
              href={`/preview/collaboration/${c.id}`}
              className="underline text-sm"
              target="_blank"
            >
              Preview
            </Link>
          </div>
        ))}
        {list.length === 0 && (
          <div className="px-3 py-2 text-sm">No collaborations yet.</div>
        )}
      </div>
    </main>
  );
}
