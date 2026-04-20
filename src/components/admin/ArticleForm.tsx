/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import DropZone from "@/components/admin/ui/DropZone";
import {
  Plus, Trash2, ChevronUp, ChevronDown, Type, Quote,
  Image as ImageIcon, Minus, AlignLeft, Eye, EyeOff,
  Save, ArrowLeft, Loader2, Hash, Tag, Bold, Italic,
} from "lucide-react";

// ─── Block types ──────────────────────────────────────────────────────────────

export type ArticleBlock =
  | { type: "paragraph"; text: string; fontFamily?: "sans" | "serif" }
  | { type: "h2";        text: string }
  | { type: "h3";        text: string }
  | { type: "quote";     text: string; author?: string }
  | { type: "image";     url: string; caption?: string }
  | { type: "divider" };

// ─── Article data ─────────────────────────────────────────────────────────────

interface ArticleData {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverUrl: string;
  coverPosition?: string;
  blocks: ArticleBlock[];
  published: boolean;
  createdAt?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function wordCount(blocks: ArticleBlock[]) {
  let n = 0;
  for (const b of blocks) {
    if ("text" in b && b.text) n += b.text.trim().split(/\s+/).filter(Boolean).length;
  }
  return n;
}

function blocksToBody(blocks: ArticleBlock[]): string {
  return blocks.map((b) => {
    if (b.type === "paragraph") return b.text;
    if (b.type === "h2") return `## ${b.text}`;
    if (b.type === "h3") return `### ${b.text}`;
    if (b.type === "quote") return `> ${b.text}${b.author ? `\n— ${b.author}` : ""}`;
    if (b.type === "image") return `[image:${b.url}]${b.caption ? ` ${b.caption}` : ""}`;
    if (b.type === "divider") return "---";
    return "";
  }).join("\n\n");
}

function newBlock(type: ArticleBlock["type"]): ArticleBlock {
  if (type === "paragraph") return { type, text: "", fontFamily: "sans" };
  if (type === "h2")        return { type, text: "" };
  if (type === "h3")        return { type, text: "" };
  if (type === "quote")     return { type, text: "", author: "" };
  if (type === "image")     return { type, url: "", caption: "" };
  return { type: "divider" };
}

// ─── Wrap selection with markers ──────────────────────────────────────────────

function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  getValue: () => string,
  setValue: (v: string) => void
) {
  const start = textarea.selectionStart;
  const end   = textarea.selectionEnd;
  const text  = getValue();
  const selected = text.slice(start, end);
  const wrapped = before + selected + after;
  const next = text.slice(0, start) + wrapped + text.slice(end);
  setValue(next);
  // Restore cursor after React re-render
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
  });
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden ${className}`}>{children}</div>;
}

function CardHeader({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
      {icon && <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">{icon}</span>}
      <h3 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">{title}</h3>
    </div>
  );
}

function TInput({ value, onChange, placeholder, className = "" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className={`w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 ${className}`} />
  );
}

function TArea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none" />
  );
}

// ─── Formatting toolbar ───────────────────────────────────────────────────────

function FormatToolbar({
  textareaRef,
  getValue,
  setValue,
  fontFamily,
  onFontFamily,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  getValue: () => string;
  setValue: (v: string) => void;
  fontFamily?: "sans" | "serif";
  onFontFamily?: (f: "sans" | "serif") => void;
}) {
  const wrap = (before: string, after: string) => {
    if (!textareaRef.current) return;
    wrapSelection(textareaRef.current, before, after, getValue, setValue);
  };

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-100 flex-wrap">
      <button type="button" onClick={() => wrap("**", "**")}
        className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold text-gray-600 hover:bg-gray-200 transition"
        title="Bold (**text**)">
        <Bold size={12} />
      </button>
      <button type="button" onClick={() => wrap("_", "_")}
        className="flex items-center gap-1 px-2 py-1 rounded text-xs italic text-gray-600 hover:bg-gray-200 transition"
        title="Italic (_text_)">
        <Italic size={12} />
      </button>
      <div className="w-px h-4 bg-gray-200 mx-1" />
      {onFontFamily && (
        <>
          <button type="button" onClick={() => onFontFamily("sans")}
            className={`px-2 py-1 rounded text-xs font-medium transition ${fontFamily !== "serif" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-200"}`}>
            Sans
          </button>
          <button type="button" onClick={() => onFontFamily("serif")}
            className={`px-2 py-1 rounded text-xs transition ${fontFamily === "serif" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-200"}`}
            style={{ fontFamily: "Georgia, serif" }}>
            Serif
          </button>
        </>
      )}
      <span className="ml-auto text-[10px] text-gray-300 pr-1">**bold** _italic_</span>
    </div>
  );
}

// ─── Block icons / labels ─────────────────────────────────────────────────────

const BLOCK_ICONS: Record<string, React.ReactNode> = {
  paragraph: <AlignLeft size={13} />,
  h2:        <Type size={13} />,
  h3:        <Hash size={13} />,
  quote:     <Quote size={13} />,
  image:     <ImageIcon size={13} />,
  divider:   <Minus size={13} />,
};
const BLOCK_LABELS: Record<string, string> = {
  paragraph: "Paragraph",
  h2:        "Heading 2",
  h3:        "Heading 3",
  quote:     "Quote",
  image:     "Image",
  divider:   "Divider",
};
const BLOCK_TYPES: ArticleBlock["type"][] = ["paragraph", "h2", "h3", "quote", "image", "divider"];

// ─── Single block item ────────────────────────────────────────────────────────

function BlockItem({
  block, index, total, onUpdate, onRemove, onMove,
}: {
  block: ArticleBlock;
  index: number;
  total: number;
  onUpdate: (b: ArticleBlock) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const isDivider = block.type === "divider";

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors group">
      {/* Block header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
        <span className="text-gray-400">{BLOCK_ICONS[block.type]}</span>
        <span className="text-xs font-medium text-gray-500 flex-1">{BLOCK_LABELS[block.type]}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button" disabled={index === 0} onClick={() => onMove(-1)}
            className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-black disabled:opacity-20 transition">
            <ChevronUp size={13} />
          </button>
          <button type="button" disabled={index === total - 1} onClick={() => onMove(1)}
            className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-black disabled:opacity-20 transition">
            <ChevronDown size={13} />
          </button>
          <button type="button" onClick={onRemove}
            className="w-6 h-6 flex items-center justify-center rounded text-gray-300 hover:text-red-500 transition">
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Block body */}
      {!isDivider && (
        <div>
          {/* Formatting toolbar for text blocks */}
          {(block.type === "paragraph" || block.type === "quote") && (
            <FormatToolbar
              textareaRef={taRef}
              getValue={() => "text" in block ? (block as { text: string }).text : ""}
              setValue={(v) => onUpdate({ ...block, text: v } as ArticleBlock)}
              fontFamily={block.type === "paragraph" ? block.fontFamily : undefined}
              onFontFamily={block.type === "paragraph"
                ? (f) => onUpdate({ ...block, fontFamily: f })
                : undefined}
            />
          )}

          <div className="p-3">
            {block.type === "paragraph" && (
              <textarea
                ref={taRef as React.RefObject<HTMLTextAreaElement>}
                value={block.text}
                onChange={(e) => onUpdate({ ...block, text: e.target.value })}
                placeholder="Write your paragraph here…"
                rows={4}
                className={`w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none leading-relaxed ${block.fontFamily === "serif" ? "font-serif" : ""}`}
              />
            )}
            {block.type === "h2" && (
              <input type="text" value={block.text}
                onChange={(e) => onUpdate({ ...block, text: e.target.value })}
                placeholder="Section heading…"
                className="w-full text-xl font-bold border-0 border-b-2 border-gray-200 pb-2 focus:outline-none focus:border-black bg-transparent" />
            )}
            {block.type === "h3" && (
              <input type="text" value={block.text}
                onChange={(e) => onUpdate({ ...block, text: e.target.value })}
                placeholder="Sub-heading…"
                className="w-full text-lg font-semibold border-0 border-b border-gray-200 pb-2 focus:outline-none focus:border-black bg-transparent" />
            )}
            {block.type === "quote" && (
              <div className="grid gap-2">
                <textarea
                  ref={taRef as React.RefObject<HTMLTextAreaElement>}
                  value={block.text}
                  onChange={(e) => onUpdate({ ...block, text: e.target.value })}
                  placeholder="Quote text…"
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm italic focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
                />
                <TInput value={block.author ?? ""} onChange={(v) => onUpdate({ ...block, author: v })}
                  placeholder="— Author name (optional)" />
              </div>
            )}
            {block.type === "image" && (
              <div className="grid gap-3">
                {block.url ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img src={block.url} alt="" className="w-full max-h-64 object-cover" />
                    <button type="button" onClick={() => onUpdate({ ...block, url: "" })}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center text-xs transition">×</button>
                  </div>
                ) : (
                  <DropZone value="" onUploaded={(url) => onUpdate({ ...block, url })}
                    placeholder="Drop image or click to upload" aspectRatio="16/7" />
                )}
                <TInput value={block.caption ?? ""} onChange={(v) => onUpdate({ ...block, caption: v })}
                  placeholder="Image caption (optional)" />
              </div>
            )}
          </div>
        </div>
      )}

      {isDivider && (
        <div className="px-4 py-4 flex items-center gap-2 text-gray-200">
          <div className="flex-1 border-t border-dashed border-gray-200" />
          <Minus size={12} className="shrink-0" />
          <div className="flex-1 border-t border-dashed border-gray-200" />
        </div>
      )}
    </div>
  );
}

// ─── Add block menu (portal-style, rendered outside card) ─────────────────────

function AddBlockMenu({ onAdd }: { onAdd: (type: ArticleBlock["type"]) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative z-20">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors">
        <Plus size={15} /> Add block
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
          <p className="px-4 pt-3 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Insert block</p>
          {BLOCK_TYPES.map((type) => (
            <button key={type} type="button"
              onClick={() => { onAdd(type); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
              <span className="text-gray-400">{BLOCK_ICONS[type]}</span>
              {BLOCK_LABELS[type]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Preview ──────────────────────────────────────────────────────────────────

function BlockPreview({ blocks }: { blocks: ArticleBlock[] }) {
  if (!blocks.length) return <p className="text-gray-400 text-sm italic">Add some blocks to see a preview.</p>;
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        if (b.type === "paragraph") {
          const parts = b.text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
          return (
            <p key={i} className={`text-base text-gray-700 leading-[1.8] ${b.fontFamily === "serif" ? "font-serif" : ""}`}>
              {parts.map((p, j) => {
                if (p.startsWith("**") && p.endsWith("**")) return <strong key={j} className="font-semibold text-gray-900">{p.slice(2, -2)}</strong>;
                if (p.startsWith("_") && p.endsWith("_")) return <em key={j}>{p.slice(1, -1)}</em>;
                return p;
              })}
            </p>
          );
        }
        if (b.type === "h2") return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-8">{b.text}</h2>;
        if (b.type === "h3") return <h3 key={i} className="text-lg font-semibold text-gray-800 mt-6">{b.text}</h3>;
        if (b.type === "quote") return (
          <blockquote key={i} className="border-l-4 border-black pl-5 py-1">
            <p className="text-gray-700 italic">{b.text}</p>
            {b.author && <cite className="text-sm text-gray-400 mt-1 block">— {b.author}</cite>}
          </blockquote>
        );
        if (b.type === "image") return b.url
          ? <figure key={i}><img src={b.url} alt={b.caption ?? ""} className="w-full rounded-xl" />{b.caption && <figcaption className="text-xs text-gray-400 text-center mt-2">{b.caption}</figcaption>}</figure>
          : <div key={i} className="w-full h-32 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300"><ImageIcon size={24} /></div>;
        if (b.type === "divider") return <hr key={i} className="border-gray-200 my-6" />;
        return null;
      })}
    </div>
  );
}

// ─── Tag input ────────────────────────────────────────────────────────────────

function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim().toLowerCase();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setDraft("");
  };
  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-1 text-xs text-gray-600">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-gray-700">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Add tag…"
          className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
        <button type="button" onClick={add}
          className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">Add</button>
      </div>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export default function ArticleForm({
  id,
  initial,
}: {
  id?: string;
  initial?: Partial<ArticleData & { body?: string; blocks?: ArticleBlock[] }>;
}) {
  const router = useRouter();
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [preview, setPreview]   = useState(false);
  const [slugEdited, setSlugEdited] = useState(!!initial?.slug);

  const [title,     setTitle]     = useState(initial?.title ?? "");
  const [slug,      setSlug]      = useState(initial?.slug ?? "");
  const [excerpt,   setExcerpt]   = useState(initial?.excerpt ?? "");
  const [category,  setCategory]  = useState(initial?.category ?? "");
  const [tags,      setTags]      = useState<string[]>(initial?.tags ?? []);
  const [coverUrl,      setCoverUrl]      = useState(initial?.coverUrl ?? "");
  const [coverPosition, setCoverPosition] = useState(initial?.coverPosition ?? "center");
  const [published, setPublished] = useState(initial?.published ?? false);

  const [blocks, setBlocks] = useState<ArticleBlock[]>(() => {
    if (initial?.blocks?.length) return initial.blocks;
    if (initial?.body) {
      return initial.body.split(/\n\n+/).filter(Boolean).map((text): ArticleBlock => {
        if (text.startsWith("## "))  return { type: "h2", text: text.slice(3) };
        if (text.startsWith("### ")) return { type: "h3", text: text.slice(4) };
        if (text.startsWith("> "))   return { type: "quote", text: text.slice(2) };
        if (text === "---")          return { type: "divider" };
        return { type: "paragraph", text, fontFamily: "sans" };
      });
    }
    return [];
  });

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugEdited) setSlug(slugify(v));
  };

  const addBlock    = (type: ArticleBlock["type"]) => setBlocks((b) => [...b, newBlock(type)]);
  const updateBlock = useCallback((i: number, b: ArticleBlock) => setBlocks((prev) => prev.map((x, idx) => idx === i ? b : x)), []);
  const removeBlock = (i: number) => setBlocks((b) => b.filter((_, idx) => idx !== i));
  const moveBlock   = (i: number, dir: -1 | 1) => setBlocks((b) => {
    const a = [...b]; const j = i + dir;
    if (j < 0 || j >= a.length) return a;
    [a[i], a[j]] = [a[j], a[i]]; return a;
  });

  const handleSave = async () => {
    if (!title.trim()) { setError("Title is required."); return; }
    const finalSlug = slug || slugify(title);
    const finalId   = id || finalSlug;
    setSaving(true); setError(null);
    try {
      const wc = wordCount(blocks);
      const payload = {
        id: finalId,
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim(),
        category: category.trim(),
        tags,
        coverUrl,
        coverPosition,
        blocks,
        body: blocksToBody(blocks),
        published,
        readTime: Math.max(1, Math.round(wc / 200)),
        ...(!id ? { createdAt: initial?.createdAt ?? Date.now() } : {}),
      };
      const res = await fetch("/api/admin/articles/save", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true); setTimeout(() => setSaved(false), 2000);
      if (!id) router.replace(`/admin/articles/${finalId}`);
    } catch {
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const wc = wordCount(blocks);

  return (
    <div className="max-w-5xl">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <button type="button" onClick={() => router.push("/admin/articles")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition">
          <ArrowLeft size={15} /> Articles
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{wc} words · ~{Math.max(1, Math.round(wc / 200))} min read</span>
          <button type="button" onClick={() => setPreview((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition ${preview ? "border-black bg-black text-white" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
            {preview ? <EyeOff size={14} /> : <Eye size={14} />}
            {preview ? "Edit" : "Preview"}
          </button>
          <button type="button" onClick={handleSave} disabled={saving}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium transition ${saved ? "bg-green-500 text-white" : "bg-black text-white hover:bg-gray-800"}`}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saved ? "Saved!" : saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="grid lg:grid-cols-[1fr_300px] gap-5 items-start">
        {/* ── Left: content ── */}
        <div className="grid gap-4">
          {/* Title */}
          <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Article title…"
            className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 border-0 border-b-2 border-gray-100 focus:border-black pb-3 focus:outline-none bg-transparent transition-colors" />

          {/* Slug */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="shrink-0">blog/</span>
            <input type="text" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
              placeholder="article-slug"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>

          {/* Blocks / preview */}
          {preview ? (
            <Card>
              <CardHeader title="Preview" icon={<Eye size={14} />} />
              <div className="p-6"><BlockPreview blocks={blocks} /></div>
            </Card>
          ) : (
            /* NOTE: no overflow-hidden on this card so the Add Block dropdown isn't clipped */
            <div className="bg-white border border-gray-200 rounded-2xl">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
                <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500"><AlignLeft size={14} /></span>
                <h3 className="text-sm font-semibold text-gray-700 tracking-wide uppercase flex-1">Content Blocks</h3>
                <span className="text-xs text-gray-400">{blocks.length} block{blocks.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="p-4 grid gap-3">
                {blocks.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-gray-400">
                    <AlignLeft size={24} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No blocks yet — add your first block below.</p>
                  </div>
                )}
                {blocks.map((block, i) => (
                  <BlockItem key={i} block={block} index={i} total={blocks.length}
                    onUpdate={(b) => updateBlock(i, b)}
                    onRemove={() => removeBlock(i)}
                    onMove={(dir) => moveBlock(i, dir)} />
                ))}
                <AddBlockMenu onAdd={addBlock} />
              </div>
            </div>
          )}
        </div>

        {/* ── Right: sidebar ── */}
        <div className="grid gap-4">
          {/* Publish */}
          <Card>
            <CardHeader title="Publish" />
            <div className="p-4">
              <button type="button" onClick={() => setPublished((v) => !v)}
                className={`w-full py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${published ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}>
                {published ? "✓ Published" : "Draft — click to publish"}
              </button>
            </div>
          </Card>

          {/* Cover */}
          <Card>
            <CardHeader title="Cover Image" icon={<ImageIcon size={14} />} />
            <div className="p-4 grid gap-3">
              <DropZone value={coverUrl} onUploaded={setCoverUrl} onClear={() => setCoverUrl("")}
                aspectRatio="3/4" placeholder="Upload cover image" />
              <p className="text-xs text-gray-400">Recommended: portrait 3:4 — will be cropped to 4:3 on blog cards</p>

              {/* Crop position picker — visible only when a cover is uploaded */}
              {coverUrl && (
                <div className="grid gap-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Card crop position
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Choose which part of your cover shows in the blog card (4:3 crop).
                  </p>
                  {/* 3×3 grid of hotspots */}
                  <div className="relative rounded-xl overflow-hidden border border-gray-200" style={{ aspectRatio: "4/3" }}>
                    <img src={coverUrl} alt="" className="w-full h-full object-cover" style={{ objectPosition: coverPosition }} />
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0">
                      {(["top left","top center","top right","center left","center","center right","bottom left","bottom center","bottom right"] as const).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setCoverPosition(pos)}
                          title={pos}
                          className={[
                            "transition-all",
                            coverPosition === pos
                              ? "bg-white/40 ring-2 ring-white ring-inset"
                              : "hover:bg-white/20",
                          ].join(" ")}
                        />
                      ))}
                    </div>
                    {/* Indicator dot */}
                    <div
                      className="absolute w-4 h-4 rounded-full bg-white shadow-lg border-2 border-black pointer-events-none transition-all duration-200"
                      style={{
                        top:  coverPosition.includes("top") ? "16.6%" : coverPosition.includes("bottom") ? "83.3%" : "50%",
                        left: coverPosition.includes("left") ? "16.6%" : coverPosition.includes("right") ? "83.3%" : "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    Selected: <span className="font-mono text-gray-600">{coverPosition}</span>
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Excerpt */}
          <Card>
            <CardHeader title="Excerpt" />
            <div className="p-4">
              <TArea value={excerpt} onChange={setExcerpt}
                placeholder="Short description shown in article list…" rows={3} />
            </div>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader title="Category" icon={<Hash size={14} />} />
            <div className="p-4">
              <TInput value={category} onChange={setCategory}
                placeholder="e.g. Branding, Design, Strategy" />
            </div>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader title="Tags" icon={<Tag size={14} />} />
            <div className="p-4">
              <TagInput tags={tags} onChange={setTags} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
