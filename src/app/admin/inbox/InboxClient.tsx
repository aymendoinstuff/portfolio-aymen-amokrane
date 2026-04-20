"use client";

import { useState } from "react";
import { Mail, Users } from "lucide-react";

type Offer = Record<string, any>;
type Collab = Record<string, any>;

export default function InboxClient({ offers, collabs }: { offers: Offer[]; collabs: Collab[] }) {
  const [tab, setTab] = useState<"offers" | "collabs">("offers");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Inbox</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {offers.length} message{offers.length !== 1 ? "s" : ""} · {collabs.length} collaboration{collabs.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-0">
          {(["offers", "collabs"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                tab === t
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-gray-600",
              ].join(" ")}
            >
              {t === "offers" ? <Mail size={14} /> : <Users size={14} />}
              {t === "offers" ? `Messages (${offers.length})` : `Collaborations (${collabs.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-w-3xl">
        {tab === "offers" && (
          <div className="grid gap-3">
            {offers.length === 0 && (
              <p className="text-sm text-gray-400 py-10 text-center">No messages yet.</p>
            )}
            {offers.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="font-semibold text-gray-900">{o.name}</span>
                    <a href={`mailto:${o.email}`} className="ml-2 text-sm text-gray-500 underline">{o.email}</a>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(o.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                {o.type && (
                  <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs mb-2">{o.type}</span>
                )}
                <p className="text-sm text-gray-700 leading-relaxed">{o.message}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "collabs" && (
          <div className="grid gap-3">
            {collabs.length === 0 && (
              <p className="text-sm text-gray-400 py-10 text-center">No collaboration requests yet.</p>
            )}
            {collabs.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="font-semibold text-gray-900">{c.projectTitle ?? "Untitled"}</span>
                  <span className={[
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    c.status === "approved" ? "bg-green-100 text-green-700" :
                    c.status === "rejected" ? "bg-red-100 text-red-500" :
                    "bg-gray-100 text-gray-500"
                  ].join(" ")}>
                    {c.status ?? "pending"}
                  </span>
                </div>
                {c.contact?.email && (
                  <a href={`mailto:${c.contact.email}`} className="text-sm text-gray-500 underline block mb-2">
                    {c.contact.email}
                  </a>
                )}
                {c.message && <p className="text-sm text-gray-700">{c.message}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
