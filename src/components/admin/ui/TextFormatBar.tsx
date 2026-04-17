"use client";

import type { TextStyle } from "@/lib/types/project";
import { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Type,
} from "lucide-react";

const SIZES: { label: string; value: TextStyle["size"] }[] = [
  { label: "XS", value: "sm" },
  { label: "S", value: "base" },
  { label: "M", value: "lg" },
  { label: "L", value: "xl" },
  { label: "XL", value: "2xl" },
  { label: "2XL", value: "3xl" },
  { label: "3XL", value: "4xl" },
];

const FONTS: { label: string; value: TextStyle["font"]; cls: string }[] = [
  { label: "Sans", value: "sans", cls: "font-sans" },
  { label: "Serif", value: "serif", cls: "font-serif" },
  { label: "Mono", value: "mono", cls: "font-mono" },
];

const PRESET_COLORS = [
  "#000000",
  "#ffffff",
  "#6b7280",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

interface Props {
  style?: TextStyle;
  onChange: (s: TextStyle) => void;
}

export default function TextFormatBar({ style = {}, onChange }: Props) {
  const [showColors, setShowColors] = useState(false);
  const [showFonts, setShowFonts] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const set = (patch: Partial<TextStyle>) =>
    onChange({ ...style, ...patch });

  const toggle = (key: "bold" | "italic" | "underline") =>
    set({ [key]: !style[key] });

  const activeBtn =
    "bg-gray-900 text-white shadow-sm";
  const inactiveBtn =
    "text-gray-500 hover:bg-gray-100 hover:text-gray-900";
  const btn = (active: boolean) =>
    `flex items-center justify-center w-7 h-7 rounded-md text-sm font-medium transition-all ${active ? activeBtn : inactiveBtn}`;

  return (
    <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* ── Bold / Italic / Underline ── */}
      <button type="button" onClick={() => toggle("bold")} className={btn(!!style.bold)} title="Bold">
        <Bold size={13} />
      </button>
      <button type="button" onClick={() => toggle("italic")} className={btn(!!style.italic)} title="Italic">
        <Italic size={13} />
      </button>
      <button type="button" onClick={() => toggle("underline")} className={btn(!!style.underline)} title="Underline">
        <Underline size={13} />
      </button>

      <div className="w-px h-5 bg-gray-200 mx-0.5" />

      {/* ── Alignment ── */}
      <button type="button" onClick={() => set({ align: "left" })} className={btn(style.align === "left" || !style.align)} title="Left">
        <AlignLeft size={13} />
      </button>
      <button type="button" onClick={() => set({ align: "center" })} className={btn(style.align === "center")} title="Center">
        <AlignCenter size={13} />
      </button>
      <button type="button" onClick={() => set({ align: "right" })} className={btn(style.align === "right")} title="Right">
        <AlignRight size={13} />
      </button>

      <div className="w-px h-5 bg-gray-200 mx-0.5" />

      {/* ── Font size ── */}
      <div className="relative">
        <button
          type="button"
          onClick={() => { setShowSizes((v) => !v); setShowColors(false); setShowFonts(false); }}
          className={`flex items-center gap-1 px-2 h-7 rounded-md text-xs font-semibold transition-all ${showSizes ? activeBtn : inactiveBtn}`}
          title="Size"
        >
          <Type size={12} />
          {SIZES.find((s) => s.value === style.size)?.label ?? "M"}
        </button>
        {showSizes && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 flex gap-1 z-30">
            {SIZES.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => { set({ size: value }); setShowSizes(false); }}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${style.size === value ? activeBtn : inactiveBtn}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Font family ── */}
      <div className="relative">
        <button
          type="button"
          onClick={() => { setShowFonts((v) => !v); setShowColors(false); setShowSizes(false); }}
          className={`flex items-center gap-1 px-2 h-7 rounded-md text-xs font-semibold transition-all ${showFonts ? activeBtn : inactiveBtn}`}
          title="Font"
        >
          {FONTS.find((f) => f.value === style.font)?.label ?? "Sans"}
        </button>
        {showFonts && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 flex flex-col gap-1 z-30 min-w-[80px]">
            {FONTS.map(({ label, value, cls }) => (
              <button
                key={value}
                type="button"
                onClick={() => { set({ font: value }); setShowFonts(false); }}
                className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-left transition-all ${cls} ${style.font === value ? activeBtn : inactiveBtn}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-gray-200 mx-0.5" />

      {/* ── Color ── */}
      <div className="relative">
        <button
          type="button"
          onClick={() => { setShowColors((v) => !v); setShowSizes(false); setShowFonts(false); }}
          className={`flex items-center gap-1.5 px-2 h-7 rounded-md text-xs font-semibold transition-all ${showColors ? activeBtn : inactiveBtn}`}
          title="Color"
        >
          <Palette size={13} />
          <span
            className="w-3 h-3 rounded-full border border-gray-300"
            style={{ backgroundColor: style.color ?? "#000000" }}
          />
        </button>
        {showColors && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-30 w-52">
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { set({ color: c }); setShowColors(false); }}
                  className="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: style.color === c ? "#000" : "#e5e7eb",
                  }}
                  title={c}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <label className="text-xs text-gray-500 shrink-0">Custom</label>
              <input
                type="color"
                value={style.color ?? "#000000"}
                onChange={(e) => set({ color: e.target.value })}
                className="w-full h-7 rounded cursor-pointer border border-gray-200"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
