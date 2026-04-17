"use client";

import React, {
  useState,
  useRef,
  DragEvent,
  useCallback,
} from "react";
import { storage } from "@/lib/firebase/client";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import type {
  ExtraBlock,
  TextStyle,
} from "@/lib/types/project";
import type { MediaItem } from "@/lib/types/common";
import TextFormatBar from "@/components/admin/ui/TextFormatBar";
import {
  GripVertical,
  Trash2,
  Plus,
  Type,
  Quote,
  Image as ImageIcon,
  Video,
  Heading1,
  Loader2,
  Upload as UploadIcon,
  X,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function makeBlock(kind: string): ExtraBlock {
  const id = uid();
  switch (kind) {
    case "image":
      return { id, type: "image", item: { type: "image", url: "" } };
    case "grid2":
      return {
        id,
        type: "grid",
        columns: 2,
        items: [
          { type: "image", url: "" },
          { type: "image", url: "" },
        ],
      };
    case "grid3":
      return {
        id,
        type: "grid",
        columns: 3,
        items: [
          { type: "image", url: "" },
          { type: "image", url: "" },
          { type: "image", url: "" },
        ],
      };
    case "quote":
      return { id, type: "quote", text: "" };
    case "paragraph":
      return { id, type: "paragraph", text: "" };
    case "heading":
      return { id, type: "heading", level: 2, text: "" };
    case "video":
      return { id, type: "video", item: { type: "video", url: "" } };
    default:
      return { id, type: "paragraph", text: "" };
  }
}

const BLOCK_MENU = [
  {
    kind: "image",
    label: "Full Image",
    icon: ImageIcon,
    desc: "Full-width photo",
  },
  {
    kind: "grid2",
    label: "2-Column",
    icon: LayoutGrid,
    desc: "Two images side by side",
  },
  {
    kind: "grid3",
    label: "3-Column",
    icon: LayoutGrid,
    desc: "Three images in a row",
  },
  { kind: "quote", label: "Quote", icon: Quote, desc: "Pull quote + citation" },
  {
    kind: "paragraph",
    label: "Text",
    icon: Type,
    desc: "Paragraph of text",
  },
  {
    kind: "heading",
    label: "Heading",
    icon: Heading1,
    desc: "Section heading",
  },
  { kind: "video", label: "Video", icon: Video, desc: "Video upload or URL" },
];

// ─── tiny image uploader ─────────────────────────────────────
function ImageSlot({
  value,
  onChange,
  aspectRatio = "4/3",
}: {
  value: MediaItem;
  onChange: (updated: MediaItem) => void;
  aspectRatio?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    (file: File) => {
      setUploading(true);
      const path = `uploads/${Date.now()}-${file.name}`;
      const sRef = storageRef(storage, path);
      const task = uploadBytesResumable(sRef, file);
      task.on(
        "state_changed",
        (s) =>
          setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
        (e) => {
          console.error(e);
          setUploading(false);
        },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          onChange({ ...value, url });
          setUploading(false);
          setProgress(0);
        }
      );
    },
    [value, onChange]
  );

  return (
    <div
      className={[
        "relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all",
        dragging
          ? "border-black scale-[0.99]"
          : value.url
          ? "border-transparent"
          : "border-dashed border-gray-200 bg-gray-50 hover:border-gray-400",
      ].join(" ")}
      style={{ aspectRatio }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) upload(f);
      }}
      onClick={() => !uploading && inputRef.current?.click()}
    >
      {value.url ? (
        <>
          <img
            src={value.url}
            alt={value.alt || ""}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
            <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-semibold">
              Replace
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange({ ...value, url: "" });
            }}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
            style={{ opacity: 1 }}
          >
            <X size={12} />
          </button>
        </>
      ) : uploading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Loader2 size={20} className="animate-spin text-gray-400" />
          <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-gray-400">
          <UploadIcon size={20} />
          <span className="text-xs">Drop or click</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ─── style helpers ───────────────────────────────────────────
function styleToClass(s?: TextStyle): string {
  if (!s) return "";
  const parts: string[] = [];
  if (s.bold) parts.push("font-bold");
  if (s.italic) parts.push("italic");
  if (s.underline) parts.push("underline");
  if (s.align === "center") parts.push("text-center");
  if (s.align === "right") parts.push("text-right");
  if (s.align === "left") parts.push("text-left");
  if (s.size) parts.push(`text-${s.size}`);
  if (s.font === "serif") parts.push("font-serif");
  if (s.font === "mono") parts.push("font-mono");
  return parts.join(" ");
}

function styleToInline(s?: TextStyle): React.CSSProperties {
  if (!s?.color) return {};
  return { color: s.color };
}

// ─── individual block renderers ──────────────────────────────
function BlockContent({
  block,
  onChange,
}: {
  block: ExtraBlock;
  onChange: (updated: ExtraBlock) => void;
}) {
  const inputCls =
    "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400";
  const textareaCls =
    "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none placeholder:text-gray-400";

  if (block.type === "image") {
    return (
      <div className="grid gap-2">
        <ImageSlot
          value={block.item}
          onChange={(item) => onChange({ ...block, item })}
          aspectRatio="16/7"
        />
        <input
          className={inputCls}
          placeholder="Caption (optional)"
          value={block.caption ?? ""}
          onChange={(e) =>
            onChange({ ...block, caption: e.target.value || undefined })
          }
        />
      </div>
    );
  }

  if (block.type === "grid") {
    return (
      <div className="grid gap-2">
        <div
          className={`grid gap-2 ${
            block.columns === 2 ? "grid-cols-2" : "grid-cols-3"
          }`}
        >
          {block.items.map((item, i) => (
            <ImageSlot
              key={i}
              value={item}
              onChange={(updated) => {
                const items = [...block.items];
                items[i] = updated;
                onChange({ ...block, items });
              }}
              aspectRatio="4/3"
            />
          ))}
        </div>
        <input
          className={inputCls}
          placeholder="Caption (optional)"
          value={block.caption ?? ""}
          onChange={(e) =>
            onChange({ ...block, caption: e.target.value || undefined })
          }
        />
      </div>
    );
  }

  if (block.type === "quote") {
    return (
      <div className="grid gap-2">
        <TextFormatBar
          style={block.style}
          onChange={(s) => onChange({ ...block, style: s })}
        />
        <textarea
          rows={3}
          className={`${textareaCls} text-lg font-medium ${styleToClass(block.style)}`}
          style={styleToInline(block.style)}
          placeholder="&ldquo;Your quote here…&rdquo;"
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
        />
        <input
          className={inputCls}
          placeholder="— Attribution (optional)"
          value={block.cite ?? ""}
          onChange={(e) =>
            onChange({ ...block, cite: e.target.value || undefined })
          }
        />
      </div>
    );
  }

  if (block.type === "paragraph") {
    return (
      <div className="grid gap-2">
        <TextFormatBar
          style={block.style}
          onChange={(s) => onChange({ ...block, style: s })}
        />
        <textarea
          rows={4}
          className={`${textareaCls} ${styleToClass(block.style)}`}
          style={styleToInline(block.style)}
          placeholder="Write your paragraph…"
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
        />
      </div>
    );
  }

  if (block.type === "heading") {
    return (
      <div className="grid gap-2">
        <div className="flex gap-2">
          <select
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-black transition-all shrink-0"
            value={block.level}
            onChange={(e) =>
              onChange({
                ...block,
                level: Number(e.target.value) as 1 | 2 | 3,
              })
            }
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
          <input
            className={`${inputCls} ${styleToClass(block.style)}`}
            style={styleToInline(block.style)}
            placeholder="Section heading…"
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
          />
        </div>
        <TextFormatBar
          style={block.style}
          onChange={(s) => onChange({ ...block, style: s })}
        />
      </div>
    );
  }

  if (block.type === "video") {
    return (
      <div className="grid gap-2">
        <ImageSlot
          value={block.item}
          onChange={(item) => onChange({ ...block, item })}
          aspectRatio="16/9"
        />
        <input
          className={inputCls}
          placeholder="Or paste video URL (YouTube, Vimeo, direct .mp4…)"
          value={block.item.url}
          onChange={(e) =>
            onChange({ ...block, item: { ...block.item, url: e.target.value } })
          }
        />
        <input
          className={inputCls}
          placeholder="Caption (optional)"
          value={block.caption ?? ""}
          onChange={(e) =>
            onChange({ ...block, caption: e.target.value || undefined })
          }
        />
      </div>
    );
  }

  if (block.type === "list") {
    return (
      <textarea
        rows={4}
        className={textareaCls}
        placeholder="One item per line…"
        value={block.items.join("\n")}
        onChange={(e) =>
          onChange({
            ...block,
            items: e.target.value.split("\n").map((s) => s.trimStart()),
          })
        }
      />
    );
  }

  return null;
}

// ─── block type label ────────────────────────────────────────
function blockLabel(block: ExtraBlock): string {
  if (block.type === "grid") return `${block.columns}-Column Grid`;
  return (
    {
      image: "Full Image",
      quote: "Quote",
      paragraph: "Text",
      heading: "Heading",
      video: "Video",
      list: "List",
    }[block.type] ?? block.type
  );
}

function blockIcon(block: ExtraBlock) {
  if (block.type === "image") return <ImageIcon size={14} />;
  if (block.type === "grid") return <LayoutGrid size={14} />;
  if (block.type === "quote") return <Quote size={14} />;
  if (block.type === "paragraph") return <Type size={14} />;
  if (block.type === "heading") return <Heading1 size={14} />;
  if (block.type === "video") return <Video size={14} />;
  return <Type size={14} />;
}

// ─── main component ──────────────────────────────────────────
interface BlockEditorProps {
  blocks: ExtraBlock[];
  onChange: (blocks: ExtraBlock[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragIdx = useRef<number | null>(null);

  // drag reorder
  const onDragStart = (i: number) => (e: DragEvent<HTMLDivElement>) => {
    dragIdx.current = i;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (i: number) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(i);
  };
  const onDrop = (dropI: number) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const from = dragIdx.current;
    if (from == null || from === dropI) return;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(dropI, 0, moved);
    onChange(next);
    dragIdx.current = null;
    setDragOver(null);
  };
  const onDragEnd = () => {
    dragIdx.current = null;
    setDragOver(null);
  };

  const addBlock = (kind: string) => {
    onChange([...blocks, makeBlock(kind)]);
    setShowMenu(false);
  };

  const updateBlock = (i: number) => (updated: ExtraBlock) => {
    const next = [...blocks];
    next[i] = updated;
    onChange(next);
  };

  const removeBlock = (i: number) => {
    onChange(blocks.filter((_, ix) => ix !== i));
  };

  return (
    <div className="grid gap-3">
      {blocks.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center gap-3 text-gray-400">
          <LayoutGrid size={32} className="opacity-40" />
          <p className="text-sm font-medium">No blocks yet</p>
          <p className="text-xs text-center max-w-xs">
            Add images, quotes, and text blocks below to build your project
            layout — just like Pentagram.
          </p>
        </div>
      )}

      {blocks.map((block, i) => (
        <div
          key={block.id}
          draggable
          onDragStart={onDragStart(i)}
          onDragOver={onDragOver(i)}
          onDrop={onDrop(i)}
          onDragEnd={onDragEnd}
          className={[
            "group bg-white border-2 rounded-2xl overflow-hidden transition-all",
            dragOver === i
              ? "border-black shadow-lg scale-[1.01]"
              : "border-gray-200 hover:border-gray-300",
          ].join(" ")}
        >
          {/* Block header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            {/* drag handle */}
            <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors">
              <GripVertical size={16} />
            </div>

            {/* type icon + label */}
            <div className="flex items-center gap-1.5 text-gray-500">
              {blockIcon(block)}
              <span className="text-xs font-semibold uppercase tracking-wide">
                {blockLabel(block)}
              </span>
            </div>

            {/* index */}
            <span className="ml-auto text-xs text-gray-300 font-mono">
              #{i + 1}
            </span>

            {/* delete */}
            <button
              type="button"
              onClick={() => removeBlock(i)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Block body */}
          <div className="p-4">
            <BlockContent block={block} onChange={updateBlock(i)} />
          </div>
        </div>
      ))}

      {/* Add block button + menu */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowMenu((v) => !v)}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-500 hover:border-black hover:text-black transition-all"
        >
          <Plus size={16} />
          Add block
          <ChevronDown
            size={14}
            className={`transition-transform ${showMenu ? "rotate-180" : ""}`}
          />
        </button>

        {showMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-20">
            <div className="p-2 grid grid-cols-2 sm:grid-cols-4 gap-1">
              {BLOCK_MENU.map(({ kind, label, icon: Icon, desc }) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => addBlock(kind)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors text-center group"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-black group-hover:text-white transition-all">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-700">
                      {label}
                    </div>
                    <div className="text-[10px] text-gray-400 leading-tight">
                      {desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
