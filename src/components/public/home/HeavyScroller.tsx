"use client";
/**
 * HeavyScroller
 * Intercepts wheel/keyboard scroll events and replaces them with a lerp-based
 * animation, creating a "heavy" / weighted scroll feel.
 *
 * - On touch devices it falls back to native scroll (no interference).
 * - Does NOT break anchor links or programmatic scroll.
 */
import { useEffect, useRef } from "react";

const LERP  = 0.035;  // lower = heavier/slower — creates suspense and weighted feel
const WHEEL_MULTIPLIER = 1.0;

export default function HeavyScroller({ children }: { children: React.ReactNode }) {
  const raf     = useRef<number | null>(null);
  const current = useRef(0);
  const target  = useRef(0);
  const active  = useRef(false);

  useEffect(() => {
    // Skip on touch-primary devices
    const isTouchOnly = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouchOnly) return;

    current.current = window.scrollY;
    target.current  = window.scrollY;

    function loop() {
      const dist = target.current - current.current;
      if (Math.abs(dist) > 0.5) {
        current.current += dist * LERP;
        window.scrollTo(0, current.current);
        active.current = true;
      } else {
        active.current = false;
      }
      raf.current = requestAnimationFrame(loop);
    }

    function maxScroll() {
      return document.documentElement.scrollHeight - window.innerHeight;
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      target.current = Math.max(
        0,
        Math.min(maxScroll(), target.current + e.deltaY * WHEEL_MULTIPLIER)
      );
    }

    function onKeydown(e: KeyboardEvent) {
      // Only intercept global keys (not inside inputs / textareas)
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const vh = window.innerHeight;
      let delta = 0;
      if (e.key === "ArrowDown")  delta = 80;
      if (e.key === "ArrowUp")    delta = -80;
      if (e.key === "PageDown")   delta = vh * 0.9;
      if (e.key === "PageUp")     delta = -vh * 0.9;
      if (e.key === " " && !e.shiftKey) delta = vh * 0.9;
      if (e.key === " " &&  e.shiftKey) delta = -vh * 0.9;

      if (delta !== 0) {
        e.preventDefault();
        target.current = Math.max(0, Math.min(maxScroll(), target.current + delta));
      }
    }

    // Keep target in sync with any external scrollTo calls (e.g. anchor links)
    function onScroll() {
      if (!active.current) {
        // External scroll (anchor, browser back/fwd) — sync both pointers
        current.current = window.scrollY;
        target.current  = window.scrollY;
      }
    }

    raf.current = requestAnimationFrame(loop);
    window.addEventListener("wheel",   onWheel,   { passive: false });
    window.addEventListener("keydown", onKeydown, { passive: false });
    window.addEventListener("scroll",  onScroll,  { passive: true });

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("wheel",   onWheel);
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("scroll",  onScroll);
    };
  }, []);

  return <>{children}</>;
}
