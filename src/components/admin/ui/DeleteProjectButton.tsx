"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteProjectButton({
  id,
  title,
  redirectTo = "/admin/projects",
  variant = "icon", // "icon" for dashboard card, "full" for editor header
}: {
  id: string;
  title?: string;
  redirectTo?: string;
  variant?: "icon" | "full";
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/projects/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.error(err);
      setDeleting(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      {variant === "full" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          <Trash2 size={12} />
          Delete
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
          title="Delete project"
        >
          <Trash2 size={12} />
        </button>
      )}

      {/* Confirmation modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !deleting && setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 z-10">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-red-600" />
            </div>

            <h2 className="text-base font-bold text-gray-900 mb-1">
              Delete project?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {title ? (
                <>
                  <span className="font-semibold text-gray-700">&ldquo;{title}&rdquo;</span> will be permanently deleted and removed from your portfolio. This cannot be undone.
                </>
              ) : (
                "This project will be permanently deleted. This cannot be undone."
              )}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setOpen(false)}
                className="flex-1 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Yes, delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
