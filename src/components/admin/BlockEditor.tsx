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
import type { Block, MediaItem } from "@/lib/types/project";
import {
  GripVertical,
  Trash2,
  Plus,
  Type,
  Image as ImageIcon,
  Video,
  Loader2,
  Upload as UploadIcon,
  X,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

// ─── Helpers ───────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function makeBlock(kind: string): Block {
  const id = uid();
  switch (kind) {
    case "media-full":
      return {
        type: "media",
        layout: "full",
        items: [],
      };
    case "media-2col":
      return {
        type: "media",
        layout: "2col",
        items: [],
      };
    case "media-3col":
      return {
        type: "media",
        layout: "3col",
        items: [],
      };
    case "text":
      return {
        type: "text",
        content: "",
        align: "left",
      };
    default:
      return {
        type: "text",
        content: "",
        align: "left",
      };
  }
}

const MEDIA_UPLOAD_MENU = [
  {
    kind: "media-full",
    label: "Full Width",
    desc: "Single image full width",
  },
  {
    kind: "media-2col",
    label: "2 Columns",
    desc: "Two items side by side",
  },
  {
    kind: "media-3col",
    label: "3 Columns",
    desc: "Three items in a row",
  },
];

// ─── Media Uploader ────────────────────────────────────────────
function MediaUploader({
  value,
  onChange,
  onRemove,
  aspectRatio = "4/3",
}: {
  value: MediaItem;
  onChange: (updated: MediaItem) => void;
  onRemove: () => void;
  aspectRatio?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [embedMode, setEmbedMode] = useState(value.mediaType === "embed");

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
          const mediaType = file.type.startsWith("video") ? "video" : "image";
          onChange({ ...value, url, mediaType });
          setUploading(false);
          setProgress(0);
        }
      );
    },
    [value, onChange]
  );

  if (embedMode && value.mediaType === "embed") {
    return (
      <div className="grid gap-2">
        <textarea
          rows={4}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none placeholder:text-gray-400"
          placeholder='Paste iframe code (e.g. <iframe src="..."></iframe>)'
          value={value.url}
          onChange={(e) =>
            onChange({ ...value, url: e.target.value })
          }
        />
        <button
          type="button"
          onClick={() => setEmbedMode(false)}
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          Switch to file upload
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
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
            {value.mediaType === "video" ? (
              <video
                src={value.url}
                className="w-full h-full object-cover"
                controls
              />
            ) : (
              <img
                src={value.url}
                alt="Media"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
              <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-semibold">
                Replace
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
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
      <button
        type="button"
        onClick={() => setEmbedMode(true)}
        className="text-sm text-gray-500 hover:text-black transition-colors"
      >
        Embed iframe instead
      </button>
    </div>
  );
}

// ─── Block Renderer ────────────────────────────────────────────
function BlockContent({
  block,
  onChange,
}: {
  block: Block;
  onChange: (updated: Block) => void;
}) {
  const inputCls =
    "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400";

  if (block.type === "media") {
    const aspectMap = {
      full: "16/9",
      "2col": "4/3",
      "3col": "4/3",
    };
    const colsMap = {
      full: 1,
      "2col": 2,
      "3col": 3,
    };
    const gridClass = {
      full: "grid-cols-1",
      "2col": "grid-cols-2",
      "3col": "grid-cols-3",
    };

    return (
      <div className="grid gap-3">
        <div
          className={`grid gap-2 ${gridClass[block.layout]}`}
        >
          {block.items.map((item, i) => (
            <div key={i} className="grid gap-2">
              <MediaUploader
                value={item}
                onChange={(updated) => {
                  const items = [...block.items];
                  items[i] = updated;
                  onChange({ ...block, items });
                }}
                onRemove={() => {
                  const items = block.items.filter((_, ix) => ix !== i);
                  onChange({ ...block, items });
                }}
                aspectRatio={aspectMap[block.layout]}
              />
              <input
                className={inputCls}
                placeholder="Caption (optional)"
                value={item.caption ?? ""}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...items[i], caption: e.target.value || undefined };
                  onChange({ ...block, items });
                }}
              />
            </div>
          ))}
        </div>

        {/* Add media item button */}
        <button
          type="button"
          onClick={() => {
            const items = [...block.items, { url: "", mediaType: "image" as const }];
            onChange({ ...block, items });
          }}
          className="py-2 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-black hover:border-black transition-colors font-medium"
        >
          <Plus size={14} className="inline mr-1" />
          Add media item
        </button>
      </div>
    );
  }

  if (block.type === "text") {
    const sizeOptions: { value: NonNullable<typeof block.size>; label: string }[] = [
      { value: "sm",  label: "XS" },
      { value: "base",label: "S" },
      { value: "lg",  label: "M" },
      { value: "xl",  label: "L" },
      { value: "2xl", label: "XL" },
      { value: "3xl", label: "2X" },
      { value: "4xl", label: "3X" },
    ];
    const weightOptions: { value: NonNullable<typeof block.weight>; label: string }[] = [
      { value: "normal",   label: "Thin" },
      { value: "medium",   label: "Med" },
      { value: "semibold", label: "Semi" },
      { value: "bold",     label: "Bold" },
      { value: "black",    label: "Black" },
    ];
    const currentSize   = block.size   ?? "3xl";
    const currentWeight = block.weight ?? "bold";

    return (
      <div className="grid gap-3">
        {/* Toolbar row */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Alignment */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {[
              { align: "left" as const, Icon: AlignLeft },
              { align: "center" as const, Icon: AlignCenter },
              { align: "right" as const, Icon: AlignRight },
            ].map(({ align, Icon }) => (
              <button
                key={align}
                type="button"
                onClick={() => onChange({ ...block, align })}
                className={[
                  "p-2 rounded-md transition-all",
                  block.align === align
                    ? "bg-white text-black shadow"
                    : "text-gray-400 hover:text-gray-600",
                ].join(" ")}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>

          {/* Size */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {sizeOptions.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ ...block, size: value })}
                className={[
                  "px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all",
                  currentSize === value
                    ? "bg-white text-black shadow"
                    : "text-gray-400 hover:text-gray-600",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Weight */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {weightOptions.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ ...block, weight: value })}
                className={[
                  "px-2.5 py-1.5 rounded-md text-xs transition-all",
                  `font-${value}`,
                  currentWeight === value
                    ? "bg-white text-black shadow"
                    : "text-gray-400 hover:text-gray-600",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={4}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none placeholder:text-gray-400"
          placeholder="Text block content…"
          value={block.content}
          onChange={(e) =>
            onChange({ ...block, content: e.target.value })
          }
        />
      </div>
    );
  }

  return null;
}

// ─── Block Label ───────────────────────────────────────────────
function blockLabel(block: Block): string {
  if (block.type === "media") {
    const layouts = { full: "Full", "2col": "2 Col", "3col": "3 Col" };
    return `Media (${layouts[block.layout]})`;
  }
  return "Text";
}

function blockIcon(block: Block) {
  if (block.type === "media") return <ImageIcon size={14} />;
  return <Type size={14} />;
}

// ─── Main Component ────────────────────────────────────────────
interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragIdx = useRef<number | null>(null);

  // Drag reorder
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
    setShowMediaMenu(false);
  };

  const updateBlock = (i: number) => (updated: Block) => {
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
          <ImageIcon size={32} className="opacity-40" />
          <p className="text-sm font-medium">No blocks yet</p>
          <p className="text-xs text-center max-w-xs">
            Add media and text blocks below to build your project gallery.
          </p>
        </div>
      )}

      {blocks.map((block, i) => (
        <div
          key={`${block.type}-${i}`}
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
            <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors">
              <GripVertical size={16} />
            </div>

            <div className="flex items-center gap-1.5 text-gray-500">
              {blockIcon(block)}
              <span className="text-xs font-semibold uppercase tracking-wide">
                {blockLabel(block)}
              </span>
            </div>

            <span className="ml-auto text-xs text-gray-300 font-mono">
              #{i + 1}
            </span>

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

      {/* Add block menu */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowMediaMenu((v) => !v)}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-500 hover:border-black hover:text-black transition-all"
        >
          <Plus size={16} />
          Add block
          <ChevronDown
            size={14}
            className={`transition-transform ${showMediaMenu ? "rotate-180" : ""}`}
          />
        </button>

        {showMediaMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-20">
            <div className="p-3 grid gap-1.5">
              {/* Media section */}
              <div className="pb-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-2 mb-2">
                  Media
                </p>
                {MEDIA_UPLOAD_MENU.map(({ kind, label, desc }) => (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => addBlock(kind)}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 shrink-0 mt-0.5">
                      <ImageIcon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-700">{label}</div>
                      <div className="text-xs text-gray-400">{desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Text section */}
              <button
                type="button"
                onClick={() => addBlock("text")}
                className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 shrink-0 mt-0.5">
                  <Type size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-700">Text</div>
                  <div className="text-xs text-gray-400">Bold aligned text</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
