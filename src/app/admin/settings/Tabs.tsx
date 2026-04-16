"use client";
import * as React from "react";
export const SECTIONS = ["GENERAL", "HOME", "ABOUT", "WORK", "BLOG"] as const;
export type SectionKey = (typeof SECTIONS)[number];
export function Tabs({
  active,
  onChange,
  items,
}: {
  active: SectionKey;
  onChange: (s: SectionKey) => void;
  items: readonly SectionKey[];
}) {
  return (
    <nav
      role="tablist"
      aria-label="Settings sections"
      className="border-b border-gray-200 bg-gray-50/60 sticky top-0 z-10"
    >
      <ul className="flex flex-wrap items-center gap-2 px-4 py-2">
        {items.map((s) => {
          const selected = active === s;
          return (
            <li key={s}>
              <button
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${s}`}
                id={`tab-${s}`}
                onClick={() => onChange(s)}
                className={[
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  selected
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                ].join(" ")}
              >
                {s[0] + s.slice(1).toLowerCase()}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
