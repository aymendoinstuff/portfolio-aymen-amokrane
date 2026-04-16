"use client";
import { cn } from "@/lib/utils/cn";
export default function FilterPill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded-full border-2 text-xs uppercase tracking-[0.15em]",
        active
          ? "bg-black text-white border-black"
          : "border-black hover:bg-black hover:text-white"
      )}
      aria-pressed={!!active}
    >
      {children}
    </button>
  );
}
