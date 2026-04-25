"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Folder, ChevronRight } from "lucide-react";
import type { ClientVaultDoc, ClientStatus } from "@/lib/types/clientVault";

const STATUS_COLORS: Record<ClientStatus, string> = {
  active:    "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  "on-hold": "bg-yellow-100 text-yellow-700",
  paused:    "bg-orange-100 text-orange-700",
};

export default function ClientsPageClient({ initialClients }: { initialClients: ClientVaultDoc[] }) {
  const router = useRouter();
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const filtered = clients.filter((c) =>
    `${c.name} ${c.company} ${c.projectTitle}`.toLowerCase().includes(search.toLowerCase())
  );

  async function createClient() {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const { client } = await res.json();
      router.push(`/admin/clients/${client.id}`);
    } catch {
      setCreating(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Vault</h1>
          <p className="text-sm text-gray-500 mt-0.5">{clients.length} client{clients.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => {
            const name = prompt("Client name:");
            if (name?.trim()) { setNewName(name.trim()); createClient(); }
          }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          New Client
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>

      {/* Client list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Folder size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">{search ? "No clients match your search" : "No clients yet — add your first one"}</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {filtered.map((client) => (
            <Link
              key={client.id}
              href={`/admin/clients/${client.id}`}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-base font-bold text-gray-600">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{client.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {[client.company, client.projectTitle].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_COLORS[client.status]}`}>
                  {client.status}
                </span>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
