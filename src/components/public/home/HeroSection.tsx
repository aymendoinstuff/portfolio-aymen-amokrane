"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BigWordRotator from "./BigWordRotator";
import { ROTATE_WORDS } from "@/lib/data/general";
import Link from "next/link";
import type { Project } from "@/lib/types/project";

const INTERVAL = 2400;

// Font-weight class mapping
const FONT_WEIGHT_CLASS: Record<string, string> = {
  thin:   "font-thin",
  medium: "font-semibold",
  bold:   "font-black",
};

interface HeroSectionProps {
  projects: Project[];
  heroCta?: { label: string; href: string };
  heroMainText?: string;
  heroFontWeight?: "thin" | "medium" | "bold";
  heroRotateWords?: string[];
}

export default function HeroSection({
  projects,
  heroCta = { label: "AVAILABLE FOR WORK", href: "/contact" },
  heroMainText = "WE DOING",
  heroFontWeight = "bold",
  heroRotateWords,
}: HeroSectionProps) {
  const words = heroRotateWords && heroRotateWords.length > 0
    ? heroRotateWords
    : (ROTATE_WORDS as unknown as string[]);

  const heroImages = projects
    .filter((p) => p.general.heroUrl)
    .slice(0, words.length)
    .map((p) => p.general.heroUrl as string);

  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const id = setInterval(
      () => setImgIndex((v) => (v + 1) % heroImages.length),
      INTERVAL
    );
    return () => clearInterval(id);
  }, [heroImages.length]);

  const weightClass = FONT_WEIGHT_CLASS[heroFontWeight] ?? "font-black";

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        // Pull upward to cancel the layout's paddingTop so the hero starts at
        // the very top of the viewport (navbar floats on top of it)
        marginTop: "calc(-1 * var(--nav-h, 64px))",
        height: "100vh",
        minHeight: 620,
      }}
    >

      {/* ── Full-width background image, synced with word ── */}
      <AnimatePresence mode="sync">
        {heroImages.map((url, i) =>
          i === imgIndex ? (
            <motion.div
              key={url + i}
              className="absolute inset-0 -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <img
                src={url}
                alt=""
                aria-hidden
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* ── Foreground content ── */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto text-white">
        <h1 className={`text-6xl md:text-8xl lg:text-9xl ${weightClass} leading-[0.9] tracking-tight uppercase`}>
          {heroMainText}
        </h1>
        <div className={`mt-1 text-6xl md:text-8xl lg:text-9xl ${weightClass} tracking-tight uppercase`}>
          <BigWordRotator words={words} interval={INTERVAL} />
        </div>
        <div className="mt-10">
          <Link href={heroCta.href} className="inline-block">
            {/* Transparent white button with pulsing status dot */}
            <span className="group inline-flex items-center gap-3 rounded-full border-2 border-white/70 bg-white/10 px-8 py-3.5 md:px-10 md:py-4 text-sm md:text-base uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black hover:border-white">
              {/* Pulsing dot */}
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white group-hover:bg-black transition-colors duration-300" />
              </span>
              {heroCta.label}
            </span>
          </Link>
        </div>
      </div>

    </section>
  );
}
