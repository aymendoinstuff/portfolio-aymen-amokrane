"use client";
import { useEffect, useState } from "react";
export default function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const sc = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      setP(max ? sc / max : 0);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className="fixed right-1 top-16 bottom-4 w-[2px] bg-black/10 z-30 hidden md:block"
      aria-hidden
    >
      <div
        className="absolute bottom-0 left-0 w-full bg-black"
        style={{ height: Math.round(p * 100) + "%" }}
      />
    </div>
  );
}
