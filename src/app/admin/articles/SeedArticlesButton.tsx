"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SeedArticlesButton() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/articles/seed", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setDone(true);
        router.refresh();
      }
    } catch {
      alert("Seed failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) return null;

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="h-9 px-4 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
    >
      {loading ? "Seeding…" : "Seed placeholders"}
    </button>
  );
}
