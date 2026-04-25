// ProjectThumb.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { Project } from "@/lib/types/project";
import { WorkCursor } from "@/components/public/work/WorkCursor";

export function ProjectThumb({
  p,
  ratio = "square",
  sizes,
  priority = false,
}: {
  p: Project;
  ratio?: "square" | "1x1" | "2x1" | "3x1";
  sizes?: string;
  priority?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const ratioClass =
    ratio === "3x1"
      ? "aspect-[3/1]"
      : ratio === "2x1"
      ? "aspect-[2/1]"
      : "aspect-square";

  const pid =
    p.general?.id ??
    p.general?.slug ??
    p.general?.title ??
    p.general?.heroUrl ??
    "";

  const computedSizes = useMemo(() => {
    if (sizes) return sizes;
    switch (ratio) {
      case "3x1":
        return "(min-width:1280px) 1100px, (min-width:1024px) 900px, (min-width:768px) 70vw, 100vw";
      case "2x1":
        return "(min-width:1280px) 900px, (min-width:1024px) 750px, (min-width:768px) 60vw, 100vw";
      case "1x1":
      case "square":
      default:
        return "(min-width:1024px) 33vw, (min-width:768px) 55vw, 100vw";
    }
  }, [sizes, ratio]);

  const tags = (p.general.tags ?? []).slice(0, 3);

  return (
    <div
      className="group cursor-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Custom cursor */}
      {hovered && (
        <WorkCursor
          title={p.general.title}
          tagline={p.main?.details?.tagline}
        />
      )}

      {/* Thumbnail */}
      <Link
        href={`/work/${p.general.id}`}
        className="relative block overflow-hidden rounded-[2px]"
        aria-label={p.general.title}
      >
        <div className={cn("relative w-full", ratioClass)}>
          {/* Skeleton shimmer */}
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 bg-gray-100 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          )}

          {!imgError && p.general.heroUrl ? (
            <Image
              key={pid}
              src={p.general.heroUrl}
              alt={p.general.title}
              fill
              sizes={computedSizes}
              className={cn(
                "object-cover transition-[transform,opacity] duration-700 ease-out will-change-transform group-hover:scale-105 select-none",
                imgLoaded ? "opacity-100" : "opacity-0"
              )}
              quality={85}
              priority={priority}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              draggable={false}
            />
          ) : imgError ? (
            <div className="absolute inset-0 bg-gray-200" />
          ) : null}
        </div>
      </Link>

      {/* Tags — always visible below thumbnail, max 3 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((t, ix) => (
            <span
              key={ix}
              className="rounded-full border border-black/20 px-3 py-0.5 text-xs font-medium text-gray-700 bg-white"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
