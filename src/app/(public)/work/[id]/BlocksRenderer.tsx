"use client";

import React from "react";
import Image from "next/image";
import type { Block, MediaItem } from "@/lib/types/project";

// ── Caption ───────────────────────────────────────────────────
function Caption({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p className="mt-1 text-xs text-gray-400 italic">{text}</p>
  );
}

// ── Media Item Renderer ────────────────────────────────────────
function MediaItemRender({ item }: { item: MediaItem }) {
  if (item.mediaType === "video") {
    return (
      <div className="relative w-full h-full">
        <video
          src={item.url}
          className="w-full h-full object-cover"
          controls
          playsInline
        />
      </div>
    );
  }

  if (item.mediaType === "embed") {
    return (
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: item.url }}
      />
    );
  }

  // Default to image
  return (
    <Image
      src={item.url}
      alt="Media"
      fill
      className="object-cover"
      sizes="100vw"
      loading="lazy"
    />
  );
}

// ── Main renderer ─────────────────────────────────────────────
export function BlocksRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks.length) return null;

  return (
    <div className="w-full">
      {blocks.map((block, idx) => {
        if (block.type === "media") {
          const layoutConfig = {
            full: { gridClass: "grid-cols-1", aspectRatio: "16/9" },
            "2col": { gridClass: "grid-cols-2", aspectRatio: "4/3" },
            "3col": { gridClass: "grid-cols-3", aspectRatio: "4/3" },
          };
          const config = layoutConfig[block.layout];

          return (
            <section key={idx} className="w-full py-4">
              <figure>
                <div className={`grid ${config.gridClass} gap-1 max-w-6xl mx-auto px-6`}>
                  {block.items.map((item, i) => (
                    <div
                      key={i}
                      className="relative w-full"
                      style={{ aspectRatio: config.aspectRatio }}
                    >
                      <MediaItemRender item={item} />
                    </div>
                  ))}
                </div>
                <div className="max-w-6xl mx-auto px-6">
                  {block.items.map((item, i) => (
                    <Caption key={i} text={item.caption} />
                  ))}
                </div>
              </figure>
            </section>
          );
        }

        if (block.type === "text") {
          const alignClass = {
            left: "text-left",
            center: "text-center",
            right: "text-right",
          }[block.align];

          return (
            <section key={idx} className="w-full py-12">
              <div className={`max-w-4xl mx-auto px-6 font-bold text-3xl md:text-4xl leading-tight ${alignClass}`}>
                {block.content}
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
