"use client";
/**
 * SmoothScroller
 * Adds a very subtle easing to scroll — "15% dramatic" feel.
 * Trackpad stays almost native (high lerp), mouse wheel gets a light ease.
 * Snaps to target when within 0.5px to avoid a slow drag-tail.
 *
 * - On touch devices falls back to native scroll.
 * - Does NOT break anchor links or programmatic scroll.
 */
import { useEffect, useRef } from "react";

// Mouse wheel: gentle ease (heavier lerp = smoother/slower)
const LERP_MOUSE    = 0.10;
// Trackpad: nearly native — just a hair of smoothness
const LERP_TRACKPAD = 0.28;
const WHEEL_MULTIPLIER = 1.0;

export default function HeavyScroller({ children }: { children: React.ReactNode }) {
  const raf     = useRef<number | null>(null);
  const current = useRef(0);
  const target  = useRef(0);
  const active  = useRef(false);
  // Adaptive lerp — updated on every wheel event based on input type
  const lerp    = useRef(LERP_MOUSE);

  useEffect(() => {
    // Skip on touch-primary devices
    const isTouchOnly = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouchOnly) return;

    current.current = window.scrollY;
    target.current  = window.scrollY;

    function loop() {
      const dist = target.current - current.current;
      if (Math.abs(dist) > 0.5) {
        current.current += dist * lerp.current;
        window.scrollTo(0, current.current);
        active.current = true;
      } else if (active.current) {
        // Snap to exact target — eliminates the slow drag-tail at end of scroll
        current.current = target.current;
        window.scrollTo(0, current.current);
        active.current = false;
      }
      raf.current = requestAnimationFrame(loop);
    }

    function maxScroll() {
      return document.documentElement.scrollHeight - window.innerHeight;
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      // Trackpad heuristic: pixel-mode (deltaMode===0) with small per-event deltas
      // Mouse wheels typically fire large deltas (≥ 50px) or use line mode (deltaMode===1)
      const isTrackpad = e.deltaMode === 0 && Math.abs(e.deltaY) < 50;
      lerp.current = isTrackpad ? LERP_TRACKPAD : LERP_MOUSE;
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
