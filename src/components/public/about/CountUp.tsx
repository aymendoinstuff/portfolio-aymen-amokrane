"use client";
import { useEffect, useRef, useState } from "react";

/** Generic, works with any element ref like HTMLSpanElement | null */
function useInView<T extends Element>(
  ref: React.RefObject<T | null>,
  options?: IntersectionObserverInit
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (e?.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, options ?? { threshold: 0.3 });

    obs.observe(node);
    return () => obs.disconnect();
  }, [ref, options]);

  return inView;
}

export default function CountUp({
  value,
  duration = 1200,
  suffix = "",
}: {
  value: number | string;
  duration?: number;
  suffix?: string;
}) {
  const target =
    typeof value === "number" ? value : parseFloat(String(value)) || 0;

  // IMPORTANT: include `| null` here to match the initial null
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView<HTMLSpanElement>(ref);

  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let raf = 0;

    const step = (t: number) => {
      if (start == null) start = t;
      const p = Math.min((t - start) / duration, 1);
      setN(Math.floor(target * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}
