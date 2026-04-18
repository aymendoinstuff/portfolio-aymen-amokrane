"use client";

import React from "react";
import Image from "next/image";
import type { ExtraBlock, TextStyle } from "@/lib/types/project";

// ── Apply TextStyle as className + inline style ───────────────
function styleClass(s?: TextStyle): string {
  if (!s) return "";
  const c: string[] = [];
  if (s.bold) c.push("font-bold");
  if (s.italic) c.push("italic");
  if (s.underline) c.push("underline");
  if (s.align === "center") c.push("text-center");
  if (s.align === "right") c.push("text-right");
  if (s.size) c.push(`text-${s.size}`);
  if (s.font === "serif") c.push("font-serif");
  if (s.font === "mono") c.push("font-mono");
  return c.join(" ");
}

function styleInline(s?: TextStyle): React.CSSProperties {
  return s?.color ? { color: s.color } : {};
}

// ── Caption ───────────────────────────────────────────────────
function Caption({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p className="mt-3 text-xs text-gray-400 tracking-wide">{text}</p>
  );
}

// ── Main renderer ─────────────────────────────────────────────
export function BlocksRenderer({ blocks }: { blocks: ExtraBlock[] }) {
  if (!blocks.length) return null;

  return (
    <div className="w-full">
      {blocks.map((block) => {
        switch (block.type) {

          // ── Heading ──────────────────────────────────────────
          case "heading": {
            const sizes: Record<1 | 2 | 3, string> = {
              1: "text-5xl md:text-6xl font-black tracking-tight leading-[1]",
              2: "text-3xl md:text-4xl font-bold tracking-tight leading-[1.1]",
              3: "text-2xl md:text-3xl font-semibold tracking-tight",
            };
            const base = sizes[block.level] ?? sizes[2];
            const Tag = (`h${block.level}`) as "h1" | "h2" | "h3";
            return (
              <section key={block.id} className="max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-14">
                <Tag
                  className={`${base} ${styleClass(block.style)}`}
                  style={styleInline(block.style)}
                >
                  {block.text}
                </Tag>
              </section>
            );
          }

          // ── Paragraph ─────────────────────────────────────────
          case "paragraph":
            return (
              <section key={block.id} className="max-w-3xl mx-auto px-6 md:px-10 py-6">
                <p
                  className={`leading-relaxed text-gray-700 whitespace-pre-line text-base md:text-lg ${styleClass(block.style)}`}
                  style={styleInline(block.style)}
                >
                  {block.text}
                </p>
              </section>
            );

          // ── Quote ─────────────────────────────────────────────
          case "quote":
            return (
              <section key={block.id} className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-20">
                <figure>
                  <blockquote
                    className={`text-2xl md:text-4xl font-semibold leading-[1.2] tracking-tight ${styleClass(block.style)}`}
                    style={styleInline(block.style)}
                  >
                    {block.text}
                  </blockquote>
                  {block.cite && (
                    <figcaption className="mt-4 text-sm text-gray-400 tracking-widest uppercase">
                      {block.cite}
                    </figcaption>
                  )}
                </figure>
              </section>
            );

          // ── Full-width image ──────────────────────────────────
          case "image":
            return (
              <section key={block.id} className="w-full py-2">
                <figure>
                  <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                    <Image
                      src={block.item.url}
                      alt={block.item.alt ?? "Project image"}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      loading="lazy"
                    />
                  </div>
                  <div className="max-w-5xl mx-auto px-6 md:px-10">
                    <Caption text={block.caption} />
                  </div>
                </figure>
              </section>
            );

          // ── Image grid ────────────────────────────────────────
          case "grid": {
            const cols = block.columns ?? 2;
            const gridClass = cols === 3 ? "grid-cols-3" : "grid-cols-2";
            return (
              <section key={block.id} className="w-full py-2">
                <figure>
                  <div className={`grid ${gridClass} gap-1`}>
                    {block.items.map((item, i) => (
                      <div
                        key={i}
                        className="relative w-full"
                        style={{ aspectRatio: cols === 3 ? "4/3" : "3/2" }}
                      >
                        {item.type === "image" ? (
                          <Image
                            src={item.url}
                            alt={item.alt ?? `Image ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes={cols === 3 ? "33vw" : "50vw"}
                            loading="lazy"
                          />
                        ) : (
                          <video
                            className="absolute inset-0 w-full h-full object-cover"
                            src={item.url}
                            controls
                            playsInline
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="max-w-5xl mx-auto px-6 md:px-10">
                    <Caption text={block.caption} />
                  </div>
                </figure>
              </section>
            );
          }

          // ── Video ─────────────────────────────────────────────
          case "video":
            return (
              <section key={block.id} className="w-full py-2">
                <figure>
                  <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      src={block.item.url}
                      controls
                      playsInline
                      preload="metadata"
                    />
                  </div>
                  <div className="max-w-5xl mx-auto px-6 md:px-10">
                    <Caption text={block.caption} />
                  </div>
                </figure>
              </section>
            );

          // ── List ──────────────────────────────────────────────
          case "list":
            return (
              <section key={block.id} className="max-w-3xl mx-auto px-6 md:px-10 py-6">
                {block.ordered ? (
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700 text-base md:text-lg">
                    {block.items.map((t, i) => <li key={i}>{t}</li>)}
                  </ol>
                ) : (
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base md:text-lg">
                    {block.items.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                )}
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
