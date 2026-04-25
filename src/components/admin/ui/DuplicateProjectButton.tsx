"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";

export function DuplicateProjectButton({
  id,
  title,
}: {
  id: string;
  title?: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects/duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });
      const json = await res.json() as { ok?: boolean; newId?: string };
      if (!res.ok || !json.newId) throw new Error("Duplicate failed");
      // Navigate straight to the new project editor.
      // No router.refresh() here — it races with push on force-dynamic routes
      // and can cause the error boundary to trigger.
      router.push(`/admin/projects/${json.newId}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDuplicate}
      disabled={loading}
      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
      title={title ? `Duplicate "${title}"` : "Duplicate project"}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <Copy size={12} />}
    </button>
  );
}
