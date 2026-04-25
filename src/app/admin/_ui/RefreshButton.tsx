"use client";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = () => {
    setSpinning(true);
    router.refresh();
    setTimeout(() => setSpinning(false), 900);
  };

  return (
    <button
      onClick={handleRefresh}
      className="flex items-center gap-2 border border-gray-200 text-gray-600 px-3.5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
      title="Refresh dashboard"
    >
      <RefreshCw size={14} className={spinning ? "animate-spin" : ""} />
      Refresh
    </button>
  );
}
