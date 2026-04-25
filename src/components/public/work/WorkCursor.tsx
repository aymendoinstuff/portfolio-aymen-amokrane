"use client";
import { useEffect, useRef, useState } from "react";

interface WorkCursorProps {
  title: string;
  tagline?: string;
}

export function WorkCursor({ title, tagline }: WorkCursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: -200 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (raf.current === null) {
        raf.current = requestAnimationFrame(() => {
          if (ref.current) {
            ref.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
          }
          raf.current = null;
        });
      }
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);

  const label = tagline ? `${title} | ${tagline}` : title;

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-full"
      style={{ willChange: "transform" }}
    >
      <div
        className="mb-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium tracking-tight shadow-lg border border-black/10 text-black"
        style={{
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
        }}
      >
        {label}
      </div>
    </div>
  );
}
