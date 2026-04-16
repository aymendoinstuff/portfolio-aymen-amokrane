"use client";

import React from "react";
import Image from "next/image";
import type { ExtraBlock } from "@/lib/types/project";

export function BlocksRenderer({ blocks }: { blocks: ExtraBlock[] }) {
  if (!blocks.length) return null;

  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        switch (block.type) {
          case "heading": {
            const tag =
              block.level === 1 ? "h1" : block.level === 2 ? "h2" : "h3";
            return React.createElement(
              tag,
              { key: block.id, className: "font-semibold tracking-tight" },
              block.text
            );
          }
          case "paragraph":
            return (
              <p key={block.id} className="leading-relaxed">
                {block.text}
              </p>
            );
          case "quote":
            return (
              <figure key={block.id} className="border-l-2 pl-4">
                <blockquote className="italic">{block.text}</blockquote>
                {block.cite ? (
                  <figcaption className="mt-1 text-xs opacity-70">
                    — {block.cite}
                  </figcaption>
                ) : null}
              </figure>
            );
          case "image":
            return (
              <figure key={block.id}>
                <div className="relative w-full h-[60vh] rounded overflow-hidden">
                  <Image
                    src={block.item.url}
                    alt={block.item.alt ?? "Project image"}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
                {block.caption ? (
                  <figcaption className="mt-1 text-xs opacity-70">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          case "video":
            return (
              <figure key={block.id}>
                <video
                  className="w-full rounded"
                  src={block.item.url}
                  controls
                />
                {block.caption ? (
                  <figcaption className="mt-1 text-xs opacity-70">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          case "grid":
            return (
              <figure key={block.id}>
                <div className={`grid gap-3 grid-cols-${block.columns ?? 2}`}>
                  {block.items.map((m, i) => (
                    <div
                      key={`${m.url}-${i}`}
                      className="relative w-full h-72 rounded overflow-hidden"
                    >
                      {m.type === "image" ? (
                        <Image
                          src={m.url}
                          alt={m.alt ?? "Grid image"}
                          fill
                          sizes="50vw"
                          className="object-cover"
                        />
                      ) : (
                        <video
                          className="w-full h-full object-cover"
                          src={m.url}
                          controls
                        />
                      )}
                    </div>
                  ))}
                </div>
                {block.caption ? (
                  <figcaption className="mt-1 text-xs opacity-70">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          case "list":
            return block.ordered ? (
              <ol key={block.id} className="list-decimal pl-6 space-y-1">
                {block.items.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ol>
            ) : (
              <ul key={block.id} className="list-disc pl-6 space-y-1">
                {block.items.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
