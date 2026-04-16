// ProjectThumb.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { Project } from "@/lib/types/project";

export function ProjectThumb({
  p,
  ratio = "square",
  // optional: override sizes if you know the exact rendered width in your row
  sizes,
  priority = false, // set true for above-the-fold/hero
}: {
  p: Project;
  ratio?: "square" | "1x1" | "2x1" | "3x1";
  sizes?: string;
  priority?: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  const ratioClass =
    ratio === "3x1"
      ? "aspect-[3/1]"
      : ratio === "2x1"
      ? "aspect-[2/1]"
      : "aspect-square";

  // Stable identity for keys (prevents stale images when filtering/reordering)
  const pid =
    p.general?.id ??
    p.general?.slug ??
    p.general?.title ??
    p.general?.heroUrl ??
    "";

  // Better default sizes per aspect ratio (keeps images crisp across DPR)
  // Feel free to tweak px numbers to match your container's real max width.
  const computedSizes = useMemo(() => {
    if (sizes) return sizes;

    // Original baseline you had for "square":
    // "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
    // We'll keep that for square, but give wider ratios a bit more room.
    switch (ratio) {
      case "3x1":
        // very wide card → likely spans most of the content width
        return "(min-width:1280px) 1100px, (min-width:1024px) 900px, (min-width:768px) 70vw, 100vw";
      case "2x1":
        // wide card → about ~2/3–full width depending on row; err slightly larger for sharpness
        return "(min-width:1280px) 900px, (min-width:1024px) 750px, (min-width:768px) 60vw, 100vw";
      case "1x1":
      case "square":
      default:
        // keep your original intent but make md a touch larger to avoid upscaling
        return "(min-width:1024px) 33vw, (min-width:768px) 55vw, 100vw";
    }
  }, [sizes, ratio]);

  return (
    <Link
      href={`/work/${p.general.id}`}
      className="group relative block overflow-hidden rounded-[2px]"
      aria-label={p.general.title}
    >
      <div className={cn("relative w-full", ratioClass)}>
        {!imgError && p.general.heroUrl ? (
          <Image
            // Keyed to identity to avoid stale images when list changes
            key={pid}
            src={p.general.heroUrl}
            alt={p.general.title}
            fill
            sizes={computedSizes}
            // keep visuals identical to your design
            className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105 select-none"
            // quality helps compression artifacts without ballooning size
            quality={85}
            // nice-to-have: blur placeholder if your model carries it
            // placeholder={p.general.blurDataURL ? "blur" : "empty"}
            // blurDataURL={p.general.blurDataURL}
            // loading hints
            priority={priority}
            onError={() => setImgError(true)}
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}

        {/* Gradient overlay for readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tags (top-left) */}
        <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {p.general.tags.map((t, ix) => (
            <span
              key={ix}
              className="rounded-full border-2 border-black/10 px-2 py-0.5 text-xs bg-white/90 backdrop-blur"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Title + tagline (bottom) */}
        <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black">
          <div className="max-w-[90%]">
            <div className="text-xl md:text-2xl font-extrabold tracking-tight line-clamp-2">
              {p.general.title}
            </div>
            <div className="text-xs md:text-sm opacity-80 mt-1 line-clamp-2">
              {p.main.details.tagline}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
