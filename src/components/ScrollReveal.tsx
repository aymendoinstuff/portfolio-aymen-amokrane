"use client";

/**
 * ScrollReveal — wraps any section with a smooth fade-up entrance.
 * Matches the site's clean, editorial aesthetic: no bounce, just clarity.
 *
 * Usage:
 *   <ScrollReveal>
 *     <YourSection />
 *   </ScrollReveal>
 *
 * Props:
 *   delay    — stagger offset in seconds (default 0)
 *   y        — vertical slide distance px (default 28)
 *   once     — only animate once (default true)
 *   className — pass-through
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
}

export default function ScrollReveal({
  children,
  delay = 0,
  y = 28,
  once = true,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1], // custom ease: fast out, luxurious settle
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
