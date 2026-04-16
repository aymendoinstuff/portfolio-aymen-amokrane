"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ArrowUpRight } from "lucide-react";
import { SECTIONS } from "@/lib/data/general";

export default function NavBar() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const update = () => {
      const h = barRef?.current
        ? barRef.current.getBoundingClientRect().height
        : 64;
      document.documentElement.style.setProperty("--nav-h", h + "px");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [visible, open]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b-2 border-black"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <div
            ref={barRef}
            className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between"
          >
            <Link href="/" className="font-semibold tracking-wide">
              We Doing
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {SECTIONS.map((s) => (
                <Link
                  key={s}
                  href={s === "home" ? "/" : `/${s}`}
                  className="uppercase tracking-[0.2em] text-[12px] hover:underline"
                >
                  {s.toUpperCase()}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="rounded-full border-2 border-black px-5 py-2 text-sm md:text-base inline-flex items-center gap-2"
                aria-label="Go to Contact"
              >
                <span className="font-medium">Let&apos;s do stuff</span>
                <ArrowUpRight size={16} />
              </Link>
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden rounded-full border-2 px-2 py-2"
                aria-label="Open Menu"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="md:hidden border-b-2 border-black bg-white"
              >
                <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
                  {SECTIONS.map((s) => (
                    <Link
                      key={s}
                      href={s === "home" ? "/" : `/${s}`}
                      onClick={() => setOpen(false)}
                      className="text-left py-2 uppercase tracking-[0.2em] text-[12px] hover:underline"
                    >
                      {s.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
