"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ArrowUpRight } from "lucide-react";

interface NavLink { label: string; href: string }

interface NavBarProps {
  brand?: string;
  logoUrl?: string;
  links?: NavLink[];
}

const DEFAULT_LINKS: NavLink[] = [
  { label: "Home",  href: "/" },
  { label: "About", href: "/about" },
  { label: "Work",  href: "/work" },
  { label: "Blog",  href: "/blog" },
];

export default function NavBar({
  brand = "We Doing",
  logoUrl = "",
  links = DEFAULT_LINKS,
}: NavBarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [visible, setVisible] = useState(!isHome); // always visible on non-home
  const [open, setOpen]       = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrolled = useRef(false);

  // On non-home pages: always visible, no hide behavior
  // On home page: peek behavior (show on mouse near top or scroll)
  useEffect(() => {
    if (!isHome) {
      setVisible(true);
      return;
    }
    // Home page peek behavior
    setVisible(false);
    const show = () => {
      setVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (!scrolled.current) {
        hideTimer.current = setTimeout(() => {
          if (!scrolled.current) setVisible(false);
        }, 3000);
      }
    };

    const onScroll = () => {
      const atTop = window.scrollY < 60;
      scrolled.current = !atTop;
      if (!atTop) {
        setVisible(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
      } else {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setVisible(false), 2000);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY < 120 || scrolled.current) show();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [isHome]);

  // Keep --nav-h CSS var in sync
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

  const navLinks = links.length > 0 ? links : DEFAULT_LINKS;

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b-2 border-black"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
        >
          <div
            ref={barRef}
            className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between"
          >
            <Link href="/" className="flex items-center">
              {logoUrl ? (
                <img src={logoUrl} alt={brand} className="h-8 w-auto object-contain" />
              ) : (
                <span className="font-semibold tracking-wide">{brand}</span>
              )}
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="uppercase tracking-[0.2em] text-[12px] hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="rounded-full border-2 border-black px-5 py-2 text-sm md:text-base inline-flex items-center gap-2"
                aria-label="Contact"
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

          {/* Mobile menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="md:hidden border-b-2 border-black bg-white overflow-hidden"
              >
                <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-left py-2 uppercase tracking-[0.2em] text-[12px] hover:underline"
                    >
                      {link.label}
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
