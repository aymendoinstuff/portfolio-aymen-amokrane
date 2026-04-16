/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";
export default async function ArticlesAdmin() {
  const snap = await adminDb
    .collection("articles")
    .orderBy("updatedAt", "desc")
    .limit(50)
    .get();
  const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  return (
    <main className="grid gap-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Articles</div>
        <Link
          href="/admin/articles/new"
          className="rounded-full border-2 border-black px-3 py-1.5 text-sm"
        >
          + New
        </Link>
      </div>
      <div className="grid divide-y border-2 border-black rounded-xl overflow-hidden">
        {list.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-[2fr_2fr_auto] gap-2 px-3 py-2"
          >
            <div className="font-medium">{p.title}</div>
            <div className="text-sm opacity-70">{p.slug}</div>
            <div className="flex gap-2">
              <Link
                className="underline text-sm"
                href={`/admin/articles/${p.id}`}
              >
                Edit
              </Link>
              <Link
                className="underline text-sm"
                href={`/preview/article/${p.id}`}
                target="_blank"
              >
                Preview
              </Link>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="px-3 py-2 text-sm">No articles yet.</div>
        )}
      </div>
    </main>
  );
}
