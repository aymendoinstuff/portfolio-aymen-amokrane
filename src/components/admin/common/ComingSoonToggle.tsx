"use client";

import { useEffect, useState } from "react";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function ComingSoonToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  // Fetch current state on mount
  useEffect(() => {
    fetch("/api/admin/coming-soon")
      .then((r) => r.json())
      .then((d) => setEnabled(d.comingSoon ?? false))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function toggle() {
    if (saving) return;
    setSaving(true);
    const next = !enabled;
    try {
      const res = await fetch("/api/admin/coming-soon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comingSoon: next }),
      });
      if (res.ok) setEnabled(next);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading || saving}
      title={enabled ? "Coming Soon ON — click to show site" : "Site Live — click to show Coming Soon"}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
        enabled
          ? "bg-black text-white hover:bg-gray-800"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      {loading || saving ? (
        <Loader2 size={17} className="animate-spin shrink-0 text-gray-400" />
      ) : enabled ? (
        <EyeOff size={17} className="shrink-0 text-white" />
      ) : (
        <Eye size={17} className="shrink-0 text-gray-400" />
      )}

      <span className="leading-tight">
        {enabled ? (
          <>Coming Soon <span className="ml-1 text-[10px] font-bold uppercase tracking-widest opacity-60">ON</span></>
        ) : (
          "Coming Soon"
        )}
      </span>
    </button>
  );
}
