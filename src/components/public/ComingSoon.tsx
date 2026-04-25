"use client";

import { useEffect, useRef } from "react";
import {
  Instagram, Dribbble, Github, Linkedin,
  Twitter, Youtube, Globe,
} from "lucide-react";
import type { SiteSettings } from "@/app/admin/settings/schema";

type Props = {
  settings: Pick<SiteSettings, "nav" | "footer">;
};

// ── Social icon map ────────────────────────────────────────────────────────────
function SocialIcon({ platform }: { platform: string }) {
  const size = 22;
  switch (platform.toLowerCase()) {
    case "instagram": return <Instagram size={size} />;
    case "dribbble":  return <Dribbble  size={size} />;
    case "github":    return <Github    size={size} />;
    case "linkedin":  return <Linkedin  size={size} />;
    case "twitter":   return <Twitter   size={size} />;
    case "youtube":   return <Youtube   size={size} />;
    default:          return <Globe     size={size} />;
  }
}

function platformLabel(p: string) {
  const m: Record<string, string> = {
    instagram: "Instagram", dribbble: "Dribbble", github: "GitHub",
    linkedin: "LinkedIn", twitter: "X / Twitter", youtube: "YouTube",
  };
  return m[p.toLowerCase()] ?? p;
}

// ── Starfield canvas ──────────────────────────────────────────────────────────
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    type Star = {
      x: number; y: number; r: number;
      alpha: number; speed: number; dir: 1 | -1;
    };

    const stars: Star[] = [];
    const COUNT = 260;

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function spawn() {
      stars.length = 0;
      for (let i = 0; i < COUNT; i++) {
        stars.push({
          x:     Math.random() * canvas!.width,
          y:     Math.random() * canvas!.height,
          r:     Math.random() * 1.4 + 0.3,
          alpha: Math.random(),
          speed: Math.random() * 0.008 + 0.003,
          dir:   Math.random() > 0.5 ? 1 : -1,
        });
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.alpha += s.speed * s.dir;
        if (s.alpha >= 1)      { s.alpha = 1; s.dir = -1; }
        else if (s.alpha <= 0) { s.alpha = 0; s.dir = 1; }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    }

    resize();
    spawn();
    draw();

    window.addEventListener("resize", () => { resize(); spawn(); });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", () => { resize(); spawn(); });
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ComingSoon({ settings }: Props) {
  const { nav, footer } = settings;
  const logoUrl    = nav.logoUrl;
  const brand      = nav.brand || "We Doing";
  const socials    = footer.socialLinks ?? [];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 text-white">
      {/* Stars */}
      <Starfield />

      {/* Content — above canvas */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center">

        {/* Logo / Brand */}
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={brand}
            fetchPriority="high"
            decoding="sync"
            className="bg-white block max-w-[220px] md:max-w-[300px]"
          />
        ) : (
          <span className="text-6xl md:text-8xl font-thin tracking-tight leading-none select-none bg-white text-black px-5 py-3">
            {brand}
          </span>
        )}

        {/* Headline */}
        <p className="text-4xl md:text-6xl lg:text-7xl font-thin tracking-tight leading-none">
          Stuff Coming<span className="animate-pulse">...</span>
        </p>

        {/* Socials */}
        {socials.length > 0 && (
          <div className="flex items-center gap-5 mt-2">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={platformLabel(s.platform)}
                className="text-white/50 hover:text-white transition-colors duration-200"
              >
                <SocialIcon platform={s.platform} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
