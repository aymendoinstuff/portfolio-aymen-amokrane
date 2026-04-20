"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useReducedMotion,
} from "framer-motion";

// ————————————————————————————————————————————————————————————
// Config types (single prop)
// ————————————————————————————————————————————————————————————
export type SweepConfig = {
  enabled?: boolean; // turn on/off sweep
  color?: string; // optional override; auto-contrasted from rectColor when unset
  angleDeg?: number; // default 135
  widthPct?: number; // default 18 (band width)
};

export type GlowConfig = {
  enabled?: boolean; // glow border around the loading rectangle
  color?: string; // defaults to rectColor when unset
  blurPx?: number; // default 28
  spreadPx?: number; // default 6
  opacity?: number; // 0..1 default 0.7
};

export type IntroConfig = {
  bgColor?: string;
  rectColor?: string;
  rectSize?: { w: number; h: number };
  borderRadius?: number;

  // Image
  imageUrl?: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  tintOpacity?: number; // if imageUrl present and undefined => 0.35
  disableTint?: boolean;

  // Timings (separate controls)
  durationMs?: number; // legacy baseline (used for expand heuristic)
  bgFadeStartAtMs?: number; // when to start fading the background overlay
  bgFadeDurationMs?: number; // duration of the background fade
  overlayHideAtMs?: number; // when to remove the overlay entirely

  // Motion & FX
  shakeIntensity?: number; // 0..8
  sweep?: SweepConfig;
  glow?: GlowConfig;
};

const DEFAULTS: Required<Omit<IntroConfig, "sweep" | "glow">> & {
  sweep: Required<SweepConfig>;
  glow: Required<GlowConfig>;
} = {
  bgColor: "#000000",
  rectColor: "#ffffff",
  rectSize: { w: 280, h: 170 },
  borderRadius: 24,

  imageUrl: "",
  imageFit: "cover",
  imagePosition: "center",
  tintOpacity: 1,
  disableTint: false,

  // timings
  durationMs: 1900,
  bgFadeStartAtMs: 0, // 0 => compute from expand start
  bgFadeDurationMs: 320,
  overlayHideAtMs: 0, // 0 => compute from grow end

  // motion
  shakeIntensity: 3,
  sweep: { enabled: true, color: "", angleDeg: 135, widthPct: 18 },

  // glow
  glow: { enabled: false, color: "", blurPx: 28, spreadPx: 6, opacity: 0.7 },
};

// ————————————————————————————————————————————————————————————
// Helpers
// ————————————————————————————————————————————————————————————
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const msToSec = (ms: number) => ms / 1000;

function hexToRgb(hex: string) {
  const h = hex.replace("#", "").trim();
  const parse = (s: string) => parseInt(s, 16);
  if (h.length === 3)
    return {
      r: parse(h[0] + h[0]),
      g: parse(h[1] + h[1]),
      b: parse(h[2] + h[2]),
    };
  if (h.length === 6)
    return {
      r: parse(h.slice(0, 2)),
      g: parse(h.slice(2, 4)),
      b: parse(h.slice(4, 6)),
    };
  return { r: 255, g: 255, b: 255 };
}
function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function pickContrastStreak(rectColor: string) {
  const lum = relativeLuminance(hexToRgb(rectColor));
  return lum > 0.5 ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.55)";
}
function colorWithOpacity(color: string, opacity: number) {
  if (!color) return `rgba(255,255,255,${opacity})`;
  const c = color.trim().toLowerCase();
  if (c.startsWith("#")) {
    const { r, g, b } = hexToRgb(c);
    return `rgba(${r},${g},${b},${opacity})`;
  }
  if (c.startsWith("rgb(")) {
    const inside = c.slice(4, -1);
    return `rgba(${inside},${opacity})`;
  }
  return c; // if rgba() or named color; leave as-is
}

// ————————————————————————————————————————————————————————————
// Component (single config + shake + sweep + energetic grow + separate bg/overlay timings + glow)
// ————————————————————————————————————————————————————————————
export default function PageIntroTransition({
  children,
  config = {},
}: {
  children: React.ReactNode;
  config?: Partial<IntroConfig>;
}) {
  // Shallow-merge with nested patches for rectSize, sweep, glow
  const cfg = useMemo(
    () => ({
      ...DEFAULTS,
      ...config,
      rectSize: { ...DEFAULTS.rectSize, ...(config.rectSize || {}) },
      sweep: { ...DEFAULTS.sweep, ...(config.sweep || {}) },
      glow: { ...DEFAULTS.glow, ...(config.glow || {}) },
    }),
    [config]
  );

  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(true);

  // Anim controls
  const box = useAnimation();
  const jitter = useAnimation();
  const content = useAnimation();
  const sweepAnim = useAnimation();
  const imageLayer = useAnimation();
  const bg = useAnimation(); // overlay background opacity

  // Timers
  const expandTimeoutRef = useRef<number | null>(null);
  const bgFadeTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  // Tint logic: if user didn't set and image exists, default 0.35; else 1
  const tintOpacity = useMemo(() => {
    if (typeof config.tintOpacity === "number")
      return clamp(config.tintOpacity, 0, 1);
    return cfg.imageUrl ? 0.35 : 1;
  }, [config.tintOpacity, cfg.imageUrl]);

  // Sweep color (auto if not provided)
  const sweepColor = useMemo(
    () => cfg.sweep.color || pickContrastStreak(cfg.rectColor),
    [cfg.sweep.color, cfg.rectColor]
  );

  // Shake magnitudes
  const clampShake = clamp(cfg.shakeIntensity, 0, 8);
  const px = clampShake * 0.8;
  const deg = clampShake * 0.25;

  // Sweep gradient CSS
  const gradientCSS = useMemo(() => {
    const band = cfg.sweep.widthPct;
    const fade = Math.max(8, Math.floor(band * 0.9));
    return `linear-gradient(${cfg.sweep.angleDeg}deg,
      rgba(0,0,0,0) 0%,
      rgba(0,0,0,0) ${50 - band - fade}%,
      ${sweepColor} ${50 - band / 2}%,
      ${sweepColor} ${50 + band / 2}%,
      rgba(0,0,0,0) ${50 + band + fade}%,
      rgba(0,0,0,0) 100%
    )`;
  }, [sweepColor, cfg.sweep.angleDeg, cfg.sweep.widthPct]);

  // Glow box-shadow
  const boxShadow = useMemo(() => {
    if (!cfg.glow.enabled) return "0 10px 30px rgba(0,0,0,0.35)";
    const col = colorWithOpacity(
      cfg.glow.color || cfg.rectColor,
      cfg.glow.opacity
    );
    return `0 10px 30px rgba(0,0,0,0.35), 0 0 ${cfg.glow.blurPx}px ${cfg.glow.spreadPx}px ${col}`;
  }, [
    cfg.glow.enabled,
    cfg.glow.color,
    cfg.glow.blurPx,
    cfg.glow.spreadPx,
    cfg.glow.opacity,
    cfg.rectColor,
  ]);

  useEffect(() => {
    let mounted = true;

    // Initial states
    bg.set({ opacity: 1 });
    box.start({
      scale: 1,
      borderRadius: cfg.borderRadius,
      transition: { duration: 0.001 },
    });

    // Jitter (disabled with reduced motion)
    if (!reduceMotion && clampShake > 0) {
      jitter.start({
        x: [0, -px, px, -px * 0.6, px * 0.6, 0],
        y: [0, px * 0.6, -px * 0.6, px * 0.4, -px * 0.4, 0],
        rotate: [0, -deg, deg, -deg * 0.6, deg * 0.6, 0],
        transition: { repeat: Infinity, duration: 0.44, ease: "easeInOut" },
      });
    }

    // Sweep (disabled with reduced motion or when off)
    if (!reduceMotion && cfg.sweep.enabled) {
      sweepAnim.start({
        backgroundPositionX: ["150%", "-50%"],
        transition: { repeat: Infinity, duration: 0.9, ease: "easeInOut" },
      });
    }

    // Timings
    const expandAtMs = Math.max(220, Math.floor(cfg.durationMs * 0.45)); // when the grow starts
    const growDurationMs = 920; // energetic pop/overshoot duration

    const bgFadeStartAtMs =
      cfg.bgFadeStartAtMs && cfg.bgFadeStartAtMs > 0
        ? cfg.bgFadeStartAtMs
        : expandAtMs;
    const bgFadeDurationMs = cfg.bgFadeDurationMs;

    const overlayHideAtMs =
      cfg.overlayHideAtMs && cfg.overlayHideAtMs > 0
        ? cfg.overlayHideAtMs
        : expandAtMs + growDurationMs + 120;

    // Kick background fade separately so the black bg doesn't linger
    bgFadeTimeoutRef.current = window.setTimeout(() => {
      if (!mounted) return;
      bg.start({
        opacity: 0,
        transition: { duration: bgFadeDurationMs / 1000 },
      });
    }, bgFadeStartAtMs);

    // Energetic grow sequence
    expandTimeoutRef.current = window.setTimeout(() => {
      if (!mounted) return;

      // Settle jitter
      jitter.start({
        x: 0,
        y: 0,
        rotate: 0,
        transition: { duration: 0.18, ease: "easeOut" },
      });

      // Pop → overshoot → fill
      box.start({
        scale: [1, 1.06, 16.6, 16],
        borderRadius: [cfg.borderRadius, cfg.borderRadius * 0.6, 0, 0],
        rotate: [0, -0.3, 0, 0],
        transition: {
          duration: growDurationMs / 1000,
          ease: "easeOut",
          times: [0, 0.12, 0.72, 1],
        },
      });

      // Reveal content
      content.start({
        opacity: [0, 1],
        transition: { duration: 0.9, ease: "easeOut" },
      });

      // Fade image layer so the color sweep reads nicely during expand
      imageLayer.start({
        opacity: 0,
        transition: { duration: 0.25, ease: "easeOut" },
      });
    }, expandAtMs);

    // Hide overlay entirely based on overlayHideAtMs (separate from durationMs)
    hideTimeoutRef.current = window.setTimeout(() => {
      if (!mounted) return;
      setShow(false);
      jitter.stop();
      sweepAnim.stop();
      bg.stop();
    }, overlayHideAtMs);

    return () => {
      mounted = false;
      if (expandTimeoutRef.current)
        window.clearTimeout(expandTimeoutRef.current);
      if (bgFadeTimeoutRef.current)
        window.clearTimeout(bgFadeTimeoutRef.current);
      if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
      jitter.stop();
      sweepAnim.stop();
      bg.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cfg.durationMs,
    cfg.borderRadius,
    clampShake,
    reduceMotion,
    cfg.sweep.enabled,
    cfg.bgFadeStartAtMs,
    cfg.bgFadeDurationMs,
    cfg.overlayHideAtMs,
  ]);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Overlay */}
      <AnimatePresence>
        {show && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ backgroundColor: cfg.bgColor }}
            animate={bg}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: msToSec(350) }}
            aria-hidden
          >
            <motion.div animate={jitter} style={{ willChange: "transform" }}>
              <motion.div
                animate={box}
                initial={{ scale: 0.95, borderRadius: cfg.borderRadius }}
                className="relative"
                style={{
                  width: cfg.rectSize.w,
                  height: cfg.rectSize.h,
                  boxShadow, // glow + base shadow
                  overflow: "hidden",
                  willChange: "transform,border-radius",
                }}
              >
                {/* Image layer */}
                {cfg.imageUrl && (
                  <motion.div
                    animate={imageLayer}
                    initial={{ opacity: 1 }}
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${cfg.imageUrl})`,
                      backgroundSize: cfg.imageFit,
                      backgroundPosition: cfg.imagePosition,
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                )}

                {/* Tint */}
                {!cfg.disableTint && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: cfg.rectColor,
                      opacity: tintOpacity,
                      pointerEvents: "none",
                    }}
                  />
                )}

                {/* Sweep */}
                {cfg.sweep.enabled && !reduceMotion && (
                  <motion.div
                    animate={sweepAnim}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: gradientCSS,
                      backgroundSize: "220% 220%",
                      backgroundRepeat: "no-repeat",
                      backgroundPositionX: "150%",
                      backgroundPositionY: "50%",
                      filter: "blur(2px)",
                      transform: "translateZ(0)",
                      willChange: "background-position",
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content — w-full so hero and other full-bleed sections go edge-to-edge */}
      <motion.div
        animate={content}
        initial={{ opacity: 0 }}
        className="relative z-10 w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
