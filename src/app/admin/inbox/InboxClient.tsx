"use client";

import { useState, useCallback, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Trash2, AlertOctagon, MailOpen, Mail, RotateCcw, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type InboxItem = {
  id: string;
  source: "inquiry" | "booking";
  name: string;
  email: string;
  message: string;
  role?: string | null;
  projectName?: string | null;
  industry?: string | null;
  budget?: string | null;
  timeline?: string | null;
  country?: string | null;
  projectType?: string | null;
  subject?: string | null;
  location?: string | null;
  serviceTitle?: string | null;
  kind?: string | null;
  status: string;
  createdAt: number;
  updatedAt: number;
};

// ── Helpers ────────────────────────────────────────────────────

function timeAgo(ms: number): string {
  if (!ms) return "";
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function statusBadge(status: string) {
  switch (status) {
    case "new":       return { label: "New",      cls: "bg-blue-100 text-blue-700" };
    case "spam":      return { label: "Spam",     cls: "bg-red-100 text-red-600" };
    case "responded": return { label: "Replied",  cls: "bg-green-100 text-green-700" };
    case "confirmed": return { label: "Confirmed",cls: "bg-green-100 text-green-700" };
    case "declined":  return { label: "Declined", cls: "bg-red-100 text-red-500" };
    case "archived":  return { label: "Archived", cls: "bg-gray-100 text-gray-500" };
    default:          return { label: status,     cls: "bg-gray-100 text-gray-500" };
  }
}

// ── Copy button ────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className="inline-flex items-center gap-1.5 text-gray-500 hover:text-black transition-colors group"
      title="Copy"
    >
      <span className="underline underline-offset-2 text-sm">{text}</span>
      {copied
        ? <Check size={13} className="text-green-500" />
        : <Copy size={13} className="opacity-0 group-hover:opacity-70 transition-opacity" />}
    </button>
  );
}

// ── Meta pill ─────────────────────────────────────────────────

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
      <span className="text-sm text-gray-700 font-medium">{value}</span>
    </div>
  );
}

// ── Action button ─────────────────────────────────────────────

function ActionBtn({
  icon, label, loading, onClick, danger = false,
}: {
  icon: ReactNode; label: string; loading: boolean; onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={[
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50",
        danger
          ? "text-red-500 hover:bg-red-50 hover:text-red-600"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800",
      ].join(" ")}
    >
      {loading
        ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        : icon}
      {label}
    </button>
  );
}

// ── Source badge ──────────────────────────────────────────────

function SourceBadge({ source }: { source: "inquiry" | "booking" }) {
  if (source === "booking") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
        <Calendar size={9} />
        Booking
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
      <Mail size={9} />
      Inquiry
    </span>
  );
}

// ── API endpoint helper (bookings use different route) ─────────

function apiPath(item: InboxItem) {
  return item.source === "booking"
    ? `/api/admin/bookings/${item.id}`
    : `/api/admin/offer/${item.id}`;
}

// ── Inbox card ─────────────────────────────────────────────────

function InboxCard({
  item,
  onUpdate,
  onDelete,
}: {
  item: InboxItem;
  onUpdate: (id: string, patch: Partial<InboxItem>) => void;
  onDelete: (id: string) => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const isUnread = item.status === "new";
  const badge = statusBadge(item.status);

  const patch = useCallback(async (data: Partial<InboxItem>, key: string) => {
    setLoading(key);
    try {
      await fetch(apiPath(item), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      onUpdate(item.id, data);
    } finally {
      setLoading(null);
    }
  }, [item, onUpdate]);

  const remove = useCallback(async () => {
    setLoading("delete");
    try {
      await fetch(apiPath(item), { method: "DELETE" });
      onDelete(item.id);
    } finally {
      setLoading(null);
    }
  }, [item, onDelete]);

  const meta = [
    item.role         && { label: "Role",     value: item.role },
    item.serviceTitle && { label: "Service",  value: item.serviceTitle },
    item.projectName  && { label: "Project",  value: item.projectName },
    item.projectType  && { label: "Type",     value: item.projectType },
    item.subject      && { label: "Subject",  value: item.subject },
    item.industry     && { label: "Industry", value: item.industry },
    item.budget       && { label: "Budget",   value: item.budget },
    item.timeline     && { label: "Timeline", value: item.timeline },
    (item.country ?? item.location) && { label: "Location", value: (item.country ?? item.location)! },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={[
        "bg-white rounded-2xl border transition-all",
        isUnread ? "border-blue-100 shadow-sm shadow-blue-50" : "border-gray-200",
      ].join(" ")}
    >
      {/* ── Header ── */}
      <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={[
            "w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold shrink-0",
            isUnread ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500",
          ].join(" ")}>
            {(item.name?.[0] ?? "?").toUpperCase()}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-lg leading-tight ${isUnread ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>
                {item.name}
              </span>
              {isUnread && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
            </div>
            {item.email && <div className="mt-0.5"><CopyBtn text={item.email} /></div>}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
          {item.createdAt > 0 && (
            <span className="text-xs text-gray-400">{timeAgo(item.createdAt)}</span>
          )}
          <SourceBadge source={item.source} />
          {item.kind && item.kind !== item.source && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium capitalize">
              {item.kind}
            </span>
          )}
        </div>
      </div>

      {/* ── Meta grid ── */}
      {meta.length > 0 && (
        <div className="px-6 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 border-t border-gray-50 pt-4">
          {meta.map((m) => (
            <MetaPill key={m.label} label={m.label} value={m.value} />
          ))}
        </div>
      )}

      {/* ── Message body ── */}
      {item.message && (
        <div className={`px-6 pb-5 ${meta.length > 0 ? "" : "pt-0"}`}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            {item.source === "booking" ? "Brief / Request" : "Brief"}
          </p>
          <p className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-line">
            {item.message}
          </p>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="px-6 py-3 border-t border-gray-100 flex items-center gap-1 flex-wrap">
        {item.status !== "new" ? (
          <ActionBtn icon={<Mail size={13} />} label="Mark unread" loading={loading === "unread"}
            onClick={() => patch({ status: "new" }, "unread")} />
        ) : (
          <ActionBtn icon={<MailOpen size={13} />} label="Mark read" loading={loading === "read"}
            onClick={() => patch({ status: "responded" }, "read")} />
        )}

        {item.status !== "spam" ? (
          <ActionBtn icon={<AlertOctagon size={13} />} label="Spam" loading={loading === "spam"}
            onClick={() => patch({ status: "spam" }, "spam")} danger />
        ) : (
          <ActionBtn icon={<RotateCcw size={13} />} label="Not spam" loading={loading === "notspam"}
            onClick={() => patch({ status: "new" }, "notspam")} />
        )}

        <div className="ml-auto">
          <ActionBtn icon={<Trash2 size={13} />} label="Delete" loading={loading === "delete"}
            onClick={remove} danger />
        </div>
      </div>
    </motion.div>
  );
}

// ── Subscriber type ───────────────────────────────────────────

type Subscriber = {
  id: string;
  email: string;
  status: string;
  createdAt: number;
};

// ── Tabs ───────────────────────────────────────────────────────

type TabId = "all" | "new" | "bookings" | "spam" | "subscribers";

const TABS: { id: TabId; label: string }[] = [
  { id: "all",         label: "All" },
  { id: "new",         label: "Unread" },
  { id: "bookings",    label: "Bookings" },
  { id: "spam",        label: "Spam" },
  { id: "subscribers", label: "Newsletter" },
];

// ── Subscriber list ───────────────────────────────────────────

function SubscriberList({ subscribers }: { subscribers: Subscriber[] }) {
  if (subscribers.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-16 text-center">No subscribers yet.</p>
    );
  }
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">
          Newsletter Subscribers
        </p>
        <span className="text-xs text-gray-400 font-medium">{subscribers.length} total</span>
      </div>
      <div className="divide-y divide-gray-50">
        {subscribers.map((s) => (
          <div key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
            <CopyBtn text={s.email} />
            <span className="text-xs text-gray-400 ml-auto">{timeAgo(s.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────

export default function InboxClient({
  items: initial,
  subscribers,
}: {
  items: InboxItem[];
  subscribers: Subscriber[];
}) {
  const [items, setItems] = useState<InboxItem[]>(initial);
  const [tab, setTab]     = useState<TabId>("all");
  const router            = useRouter();

  // When router.refresh() delivers fresh server data, merge in any NEW items
  // (preserves local optimistic changes like mark-read / delete)
  useEffect(() => {
    setItems((prev) => {
      const existingIds = new Set(prev.map((i) => i.id));
      const incoming    = initial.filter((i) => !existingIds.has(i.id));
      if (incoming.length === 0) return prev;
      return [...incoming, ...prev].sort((a, b) => b.createdAt - a.createdAt);
    });
  }, [initial]);

  // Poll every 30 seconds
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 30_000);
    return () => clearInterval(id);
  }, [router]);

  const handleUpdate = useCallback((id: string, patch: Partial<InboxItem>) => {
    setItems((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setItems((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const filtered = items.filter((o) => {
    if (tab === "new")      return o.status === "new";
    if (tab === "spam")     return o.status === "spam";
    if (tab === "bookings") return o.source === "booking" && o.status !== "spam";
    return o.status !== "spam"; // "all"
  });

  const newCount         = items.filter((o) => o.status === "new").length;
  const bookingCount     = items.filter((o) => o.source === "booking" && o.status !== "spam").length;
  const spamCount        = items.filter((o) => o.status === "spam").length;
  const subscriberCount  = subscribers.length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Inbox</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {items.filter((o) => o.status !== "spam").length} message{items.length !== 1 ? "s" : ""}
          {newCount > 0 && (
            <span className="ml-2 text-blue-600 font-semibold">· {newCount} unread</span>
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap shrink-0",
                tab === t.id ? "text-black" : "text-gray-400 hover:text-gray-600",
              ].join(" ")}
            >
              {t.label}
              {t.id === "new" && newCount > 0 && (
                <span className="text-[10px] bg-blue-500 text-white font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {newCount}
                </span>
              )}
              {t.id === "bookings" && bookingCount > 0 && (
                <span className="text-[10px] bg-violet-500 text-white font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {bookingCount}
                </span>
              )}
              {t.id === "spam" && spamCount > 0 && (
                <span className="text-[10px] bg-gray-300 text-gray-600 font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {spamCount}
                </span>
              )}
              {t.id === "subscribers" && subscriberCount > 0 && (
                <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {subscriberCount}
                </span>
              )}
              {tab === t.id && (
                <motion.div layoutId="inbox-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-w-3xl">
        {tab === "subscribers" ? (
          <SubscriberList subscribers={subscribers} />
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 py-16 text-center">
            {tab === "new"      ? "No unread messages."
            : tab === "spam"    ? "Spam folder is empty."
            : tab === "bookings"? "No booking requests yet."
            :                     "No messages yet."}
          </p>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid gap-3">
              {filtered.map((o) => (
                <InboxCard key={o.id} item={o} onUpdate={handleUpdate} onDelete={handleDelete} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
