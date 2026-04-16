/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDb } from "@/lib/firebase/admin";
async function getOffers() {
  const snap = await adminDb
    .collection("offers")
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}
export default async function InboxPage() {
  const list = await getOffers();
  return (
    <main className="grid gap-4">
      <div className="text-xl font-semibold">Inbox</div>
      <div className="grid gap-3">
        {list.map((o) => (
          <div key={o.id} className="border-2 border-black rounded-xl p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium">
                {o.name} —{" "}
                <a className="underline" href={`mailto:${o.email}`}>
                  {o.email}
                </a>
              </div>
              <div className="text-xs opacity-70">
                {new Date(o.createdAt || Date.now()).toLocaleString()}
              </div>
            </div>
            <div className="text-xs uppercase opacity-70 mt-1">{o.type}</div>
            <p className="mt-2 text-sm">{o.message}</p>
            <form
              action="/api/respond"
              method="POST"
              className="mt-3 grid gap-2"
            >
              <input type="hidden" name="offerId" value={o.id} />
              <input
                className="border rounded px-2 py-1"
                name="to"
                defaultValue={o.email}
                placeholder="to"
              />
              <input
                className="border rounded px-2 py-1"
                name="subject"
                placeholder="Subject"
                defaultValue={`Re: your ${o.type} inquiry`}
              />
              <textarea
                className="border rounded px-2 py-1 min-h-[100px]"
                name="body"
                placeholder="Message"
              ></textarea>
              <button
                className="rounded-full border-2 border-black px-3 py-1.5 text-sm w-max"
                formAction="/api/respond"
              >
                Send reply
              </button>
            </form>
          </div>
        ))}
        {list.length === 0 && <div className="text-sm">No offers yet.</div>}
      </div>
    </main>
  );
}
