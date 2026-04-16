"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";
export default function HalftoneCursorBG({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      el.style.setProperty("--mx", e.clientX + "px");
      el.style.setProperty("--my", e.clientY + "px");
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  const dot =
    variant === "dark" ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.12)";
  const blend = variant === "dark" ? "mix-blend-screen" : "mix-blend-multiply";
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[1] opacity-50",
        blend
      )}
      style={{
        backgroundImage: `radial-gradient(circle at var(--mx,50%) var(--my,50%), ${dot} 0, ${dot} 2px, transparent 3px)`,
        backgroundSize: "14px 14px",
        filter: "contrast(140%) brightness(100%)",
      }}
    />
  );
}
