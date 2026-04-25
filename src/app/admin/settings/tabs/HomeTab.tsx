"use client";
import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { SiteSettings } from "../schema";
import { TextInput, Textarea, Button } from "../ui/Inputs";
import { ImageUploader } from "../ui/ImageUploader";
import { stats } from "@/lib/data/about";
import {
  Eye, EyeOff, Plus, Trash2,
  LayoutGrid, Quote, Hash, Users, MousePointerClick, Star,
  Loader2, Type, CheckSquare, Square, GripVertical,
} from "lucide-react";

// ─── Drag-to-reorder hook ─────────────────────────────────────────────────────

type DragItemProps = {
  draggable: true;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver:  (e: React.DragEvent) => void;
  onDrop:      (e: React.DragEvent) => void;
  onDragEnd:   () => void;
};

function useDragList(onMove: (from: number, to: number) => void) {
  const dragIdx    = React.useRef<number | null>(null);
  const fromHandle = React.useRef(false);
  const [dragOver, setDragOver] = React.useState<number | null>(null);

  const handleProps = {
    onPointerDown: () => { fromHandle.current = true; },
    style: { cursor: "grab" } as React.CSSProperties,
  };

  function getProps(i: number): DragItemProps {
    return {
      draggable: true,
      onDragStart: (e) => {
        if (!fromHandle.current) { e.preventDefault(); return; }
        dragIdx.current = i; e.dataTransfer.effectAllowed = "move";
      },
      onDragOver:  (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOver(i); },
      onDrop:      (e) => {
        e.preventDefault();
        const from = dragIdx.current;
        if (from != null && from !== i) onMove(from, i);
        dragIdx.current = null; setDragOver(null);
      },
      onDragEnd:   () => { fromHandle.current = false; dragIdx.current = null; setDragOver(null); },
    };
  }
  return { getProps, handleProps, dragOver };
}

// ─── Shared card/field components ────────────────────────────────────────────

function SectionCard({
  title, icon, action, children, hint,
}: {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
        {icon && (
          <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            {icon}
          </span>
        )}
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">{title}</h2>
          {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

// ─── Human-readable section labels ───────────────────────────────────────────

const SECTION_LABELS: Record<string, { name: string; desc: string }> = {
  hero:              { name: "Hero",              desc: "Big headline + rotating word + CTA button" },
  featured_projects: { name: "Featured Projects", desc: "2 highlighted projects with cover images" },
  clients:           { name: "Clients",           desc: "Scrolling marquee of client logos" },
  articles:          { name: "Articles",          desc: "3 most recent blog posts" },
  testimonials:      { name: "Testimonials",      desc: "Client quotes carousel" },
  numbers:           { name: "Stats / Numbers",   desc: "Key metrics like clients, countries, etc." },
};

// ─── Famous brand placeholders ────────────────────────────────────────────────

const SAMPLE_CLIENTS = [
  { name: "Nike",    href: "https://nike.com",    logoHref: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
  { name: "Adidas",  href: "https://adidas.com",  logoHref: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
  { name: "Apple",   href: "https://apple.com",   logoHref: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { name: "Spotify", href: "https://spotify.com", logoHref: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
  { name: "Airbnb",  href: "https://airbnb.com",  logoHref: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" },
  { name: "Netflix", href: "https://netflix.com", logoHref: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
];

// ─── Project type for picker ──────────────────────────────────────────────────

type ProjectSummary = { id: string; title: string; heroUrl: string; slug: string };

// ─── HeroTextCard ─────────────────────────────────────────────────────────────

const FONT_WEIGHT_OPTIONS = [
  { value: "thin",   label: "Thin",   preview: "font-thin" },
  { value: "medium", label: "Medium", preview: "font-semibold" },
  { value: "bold",   label: "Bold",   preview: "font-black" },
] as const;

function HeroTextCard({ form }: { form: UseFormReturn<SiteSettings> }) {
  const rotateWords = form.watch("home.heroRotateWords") ?? [];
  const fontWeight  = form.watch("home.heroFontWeight") ?? "bold";

  const [draft, setDraft] = React.useState("");
  const addWord = () => {
    const v = draft.trim().toUpperCase();
    if (!v) return;
    form.setValue("home.heroRotateWords", [...rotateWords, v], { shouldDirty: true });
    setDraft("");
  };
  const removeWord = (i: number) => {
    form.setValue("home.heroRotateWords", rotateWords.filter((_, idx) => idx !== i), { shouldDirty: true });
  };

  return (
    <SectionCard
      title="Hero Text"
      icon={<Type size={14} />}
      hint="Controls the big headline text and rotating words on the hero"
    >
      <div className="grid gap-5">
        {/* Main text */}
        <Field label="Main headline" hint='Shown above the rotating word'>
          <TextInput placeholder="WE DOING" {...form.register("home.heroMainText")} />
        </Field>

        {/* Font weight picker */}
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Font weight</label>
          <div className="flex gap-2">
            {FONT_WEIGHT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => form.setValue("home.heroFontWeight", opt.value, { shouldDirty: true })}
                className={[
                  "flex-1 py-2.5 rounded-xl border-2 text-sm transition-all",
                  fontWeight === opt.value
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-400",
                ].join(" ")}
              >
                <span className={opt.preview}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rotating words */}
        <div className="grid gap-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Rotating words{" "}
            <span className="font-normal text-gray-400 normal-case">
              — leave empty to use defaults (THINKING, BRANDING…)
            </span>
          </label>
          <div className="flex flex-wrap gap-2 min-h-[2rem]">
            {rotateWords.length === 0 && (
              <span className="text-xs text-gray-400 italic">Using defaults</span>
            )}
            {rotateWords.map((w, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-mono">
                {w}
                <button type="button" onClick={() => removeWord(i)} className="text-gray-400 hover:text-gray-700 transition">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addWord(); } }}
              placeholder="e.g. DESIGN"
              className="flex-1 max-w-48 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 uppercase"
            />
            <button
              type="button"
              onClick={addWord}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium shadow-sm hover:bg-gray-50 transition"
            >
              <Plus size={12} /> Add word
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── ClientRow (must be its own component — hooks can't live inside .map()) ───

function ClientRow({
  index, form, dragProps, handleProps, isDragOver, onRemove,
}: {
  index: number;
  form: UseFormReturn<SiteSettings>;
  dragProps: DragItemProps;
  handleProps: { onPointerDown: () => void; style: React.CSSProperties };
  isDragOver: boolean;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const logoHref = form.watch(`home.clients.${index}.logoHref` as const);
  const name     = form.watch(`home.clients.${index}.name` as const);

  return (
    <div
      {...dragProps}
      className={[
        "rounded-xl border bg-white overflow-hidden transition-all select-none",
        isDragOver ? "border-black ring-2 ring-black/10 shadow-md" : "border-gray-200",
      ].join(" ")}
    >
      {/* Collapsed row */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        {/* Drag handle */}
        <GripVertical size={14} className="text-gray-300 shrink-0 active:cursor-grabbing" {...handleProps} />
        {/* Logo thumbnail */}
        <div className="w-10 h-10 rounded-lg shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
          {logoHref
            ? <img src={logoHref} alt="" className="w-full h-full object-contain p-1.5" />
            : <Users size={14} className="text-gray-300" />
          }
        </div>
        {/* Name */}
        <span className="flex-1 text-sm font-medium text-gray-700 truncate min-w-0">
          {name || <span className="text-gray-300">Client {index + 1}</span>}
        </span>
        {/* Expand / remove */}
        <button type="button" onClick={() => setExpanded((p) => !p)}
          className="text-xs text-gray-400 hover:text-black transition px-2 py-1 rounded-lg hover:bg-gray-100 shrink-0">
          {expanded ? "Done" : "Edit"}
        </button>
        <button type="button" onClick={onRemove}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition shrink-0">
          <Trash2 size={13} />
        </button>
      </div>
      {/* Expanded fields */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 grid gap-3 bg-gray-50/50">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Client name">
              <TextInput placeholder="Acme Inc." {...form.register(`home.clients.${index}.name` as const)} />
            </Field>
            <Field label="Website link">
              <TextInput placeholder="https://..." {...form.register(`home.clients.${index}.href` as const)} />
            </Field>
          </div>
          <Field label="Logo URL (or upload)">
            <div className="flex gap-2">
              <TextInput placeholder="https://..." {...form.register(`home.clients.${index}.logoHref` as const)} />
              <ImageUploader
                value={logoHref}
                onChange={(url) => form.setValue(`home.clients.${index}.logoHref`, url, { shouldDirty: true })}
                folder="clients"
                label="Upload"
              />
            </div>
          </Field>
        </div>
      )}
    </div>
  );
}

// ─── HomeTab ─────────────────────────────────────────────────────────────────

export function HomeTab({ form }: { form: UseFormReturn<SiteSettings> }) {
  const sections    = useFieldArray({ control: form.control, name: "home.sections" });
  const testimonials = useFieldArray({ control: form.control, name: "home.testimonials" });
  const clients     = useFieldArray({ control: form.control, name: "home.clients" });

  const sectionsDrag     = useDragList((from, to) => {
    sections.move(from, to);
    // update order fields after move
    sections.fields.forEach((_, idx) => form.setValue(`home.sections.${idx}.order`, idx, { shouldDirty: true }));
  });
  const testimonialsDrag = useDragList((from, to) => testimonials.move(from, to));
  const clientsDrag      = useDragList((from, to) => clients.move(from, to));
  const numberIndices = form.watch("home.numberStatIndices") ?? [];
  const featuredIds   = form.watch("home.featuredProjectIds") ?? [];

  // Projects for the picker
  const [projects, setProjects] = React.useState<ProjectSummary[]>([]);
  const [projectsLoading, setProjectsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/admin/projects/list")
      .then((r) => r.json())
      .then((data) => {
        const loaded: ProjectSummary[] = data.projects ?? [];
        setProjects(loaded);
        // Auto-clean stale featured IDs that no longer point to a real project
        const current = form.getValues("home.featuredProjectIds") ?? [];
        const valid = current.filter((id: string) => id && loaded.some((p) => p.id === id));
        if (valid.length !== current.length) {
          form.setValue("home.featuredProjectIds", valid, { shouldDirty: false });
        }
      })
      .catch(() => setProjects([]))
      .finally(() => setProjectsLoading(false));
  }, []);

  // Only count IDs that actually match a loaded project toward the 2-slot limit
  const validFeaturedIds = featuredIds.filter((id: string) => id && projects.some((p) => p.id === id));

  const toggleFeatured = (id: string) => {
    const current = featuredIds;
    if (current.includes(id)) {
      form.setValue("home.featuredProjectIds", current.filter((x) => x !== id), { shouldDirty: true });
    } else if (validFeaturedIds.length < 2) {
      form.setValue("home.featuredProjectIds", [...current.filter((x: string) => x && projects.some((p) => p.id === x)), id], { shouldDirty: true });
    }
  };

  const toggleStatIndex = (index: number) => {
    const current = numberIndices;
    const next = current.includes(index)
      ? current.filter((i) => i !== index)
      : [...current, index].slice(-4);
    form.setValue("home.numberStatIndices", next, { shouldDirty: true });
  };

  return (
    <div className="grid gap-5">

      {/* ── Page Sections Manager ── */}
      <SectionCard
        title="Page Sections"
        icon={<LayoutGrid size={14} />}
        hint="Toggle visibility and reorder. Drag the arrows to rearrange."
      >
        <div className="grid gap-2">
          {sections.fields.map((field, i) => {
            const sectionId = form.watch(`home.sections.${i}.id` as const) as string;
            const visible   = form.watch(`home.sections.${i}.visible` as const);
            const meta      = SECTION_LABELS[sectionId] ?? { name: sectionId, desc: "" };
            const isDragOver = sectionsDrag.dragOver === i;

            return (
              <div
                key={field.id}
                {...sectionsDrag.getProps(i)}
                className={[
                  "flex items-center gap-3 rounded-xl border px-4 py-3 transition-all select-none",
                  isDragOver
                    ? "border-black ring-2 ring-black/10 shadow-md bg-white"
                    : visible ? "bg-white border-gray-200" : "bg-gray-50 border-dashed border-gray-200 opacity-50",
                ].join(" ")}
              >
                {/* Drag handle */}
                <GripVertical size={14} className="text-gray-300 shrink-0 active:cursor-grabbing" {...sectionsDrag.handleProps} />

                {/* Name + description */}
                <div className="flex-1 min-w-0">
                  <p className={["text-sm font-semibold leading-tight", visible ? "text-gray-900" : "text-gray-400"].join(" ")}>
                    {meta.name}
                  </p>
                  {meta.desc && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{meta.desc}</p>
                  )}
                </div>

                {/* Visibility toggle */}
                <button
                  type="button"
                  onClick={() => form.setValue(`home.sections.${i}.visible`, !visible, { shouldDirty: true })}
                  className={[
                    "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors",
                    visible
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200",
                  ].join(" ")}
                  title={visible ? "Click to hide" : "Click to show"}
                >
                  {visible ? <Eye size={12} /> : <EyeOff size={12} />}
                  {visible ? "Visible" : "Hidden"}
                </button>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* ── Hero Text ── */}
      <HeroTextCard form={form} />

      {/* ── Hero Button ── */}
      <SectionCard
        title="Hero Button"
        icon={<MousePointerClick size={14} />}
        hint="The call-to-action button shown on the hero section"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Button label">
            <TextInput placeholder='e.g. "See my work"' {...form.register("home.heroCta.label")} />
          </Field>
          <Field label="Button link">
            <TextInput placeholder="/work" {...form.register("home.heroCta.href")} />
          </Field>
        </div>
      </SectionCard>

      {/* ── Featured Projects Picker ── */}
      <SectionCard
        title="Featured Projects"
        icon={<Star size={14} />}
        hint="Pick up to 2 projects to highlight on the home page"
        action={
          <span className="text-xs text-gray-400 font-medium">{validFeaturedIds.length}/2 selected</span>
        }
      >
        {projectsLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
            <Loader2 size={14} className="animate-spin" /> Loading projects…
          </div>
        )}
        {!projectsLoading && projects.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
            <Star size={20} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">No published projects yet. Add some in the Projects section.</p>
          </div>
        )}
        {!projectsLoading && projects.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {projects.map((p) => {
              const selected = validFeaturedIds.includes(p.id);
              const disabled = !selected && validFeaturedIds.length >= 2;
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleFeatured(p.id)}
                  className={[
                    "relative rounded-xl border-2 overflow-hidden text-left transition-all",
                    selected ? "border-black" : "border-gray-200 hover:border-gray-400",
                    disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer",
                  ].join(" ")}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    {p.heroUrl ? (
                      <img src={p.heroUrl} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Star size={24} />
                      </div>
                    )}
                  </div>
                  {/* Title */}
                  <div className={[
                    "px-3 py-2 text-xs font-semibold truncate",
                    selected ? "bg-black text-white" : "bg-white text-gray-700",
                  ].join(" ")}>
                    {p.title}
                  </div>
                  {/* Check badge */}
                  {selected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M3 8l3 3 7-7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* ── Stats / Numbers Picker ── */}
      <SectionCard
        title="Stats / Numbers to Display"
        icon={<Hash size={14} />}
        hint="Pick up to 4 stats shown in the Numbers section on the home page"
        action={
          <span className="text-xs text-gray-400 font-medium">{numberIndices.length}/4 selected</span>
        }
      >
        <div className="grid md:grid-cols-2 gap-2">
          {stats.map((stat, i) => {
            const checked  = numberIndices.includes(i);
            const disabled = !checked && numberIndices.length >= 4;
            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => toggleStatIndex(i)}
                className={[
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                  checked  ? "border-black bg-black text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400",
                  disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
              >
                <span className="shrink-0">
                  {checked ? <CheckSquare size={15} /> : <Square size={15} className="text-gray-300" />}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">{stat.v}{stat.suffix} {stat.k}</p>
                  <p className={["text-xs mt-0.5", checked ? "text-gray-300" : "text-gray-400"].join(" ")}>{stat.sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* ── Testimonials ── */}
      <SectionCard
        title="Testimonials"
        icon={<Quote size={14} />}
        hint="Client quotes shown in the testimonials carousel"
        action={
          <Button
            type="button"
            size="sm"
            onClick={() => testimonials.append({ text: "", author: "", role: "", company: "" })}
          >
            <Plus size={12} className="mr-1" /> Add
          </Button>
        }
      >
        {testimonials.fields.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
            <Quote size={24} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-400 mb-1">No testimonials yet</p>
            <p className="text-xs text-gray-400">Click <strong>Add</strong> to create your first client quote.</p>
          </div>
        )}
        <div className="grid gap-3">
          {testimonials.fields.map((f, i) => {
            const author = form.watch(`home.testimonials.${i}.author` as const);
            const role   = form.watch(`home.testimonials.${i}.role` as const);
            const company = form.watch(`home.testimonials.${i}.company` as const);
            const isDragOver = testimonialsDrag.dragOver === i;
            return (
              <div
                key={f.id}
                {...testimonialsDrag.getProps(i)}
                className={[
                  "rounded-2xl border bg-white overflow-hidden shadow-sm transition-all select-none",
                  isDragOver ? "border-black ring-2 ring-black/10 shadow-md" : "border-gray-200",
                ].join(" ")}
              >
                {/* Card header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                  {/* Drag handle */}
                  <GripVertical size={14} className="text-gray-300 shrink-0 active:cursor-grabbing" {...testimonialsDrag.handleProps} />

                  {/* Avatar placeholder */}
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-gray-500 text-xs font-bold uppercase select-none">
                    {(author?.[0] ?? "?").toUpperCase()}
                  </div>

                  {/* Name + role/company */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">
                      {author || <span className="text-gray-400 font-normal">Testimonial {i + 1}</span>}
                    </p>
                    {(role || company) && (
                      <p className="text-xs text-gray-400 truncate">
                        {[role, company].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>

                  {/* Index badge */}
                  <span className="text-xs text-gray-300 font-mono shrink-0">{i + 1}/{testimonials.fields.length}</span>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => testimonials.remove(i)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition shrink-0"
                    title="Remove testimonial"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Quote text */}
                <div className="px-4 pt-4 pb-2">
                  <Field label="Quote">
                    <Textarea
                      rows={3}
                      placeholder="What they said about working with you…"
                      {...form.register(`home.testimonials.${i}.text` as const)}
                    />
                  </Field>
                </div>

                {/* Author fields */}
                <div className="grid md:grid-cols-3 gap-3 px-4 pb-4">
                  <Field label="Name">
                    <TextInput placeholder="Jane Doe" {...form.register(`home.testimonials.${i}.author` as const)} />
                  </Field>
                  <Field label="Role / Title">
                    <TextInput placeholder="CEO" {...form.register(`home.testimonials.${i}.role` as const)} />
                  </Field>
                  <Field label="Company">
                    <TextInput placeholder="Acme Inc." {...form.register(`home.testimonials.${i}.company` as const)} />
                  </Field>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add another button at the bottom when there are items */}
        {testimonials.fields.length > 0 && (
          <button
            type="button"
            onClick={() => testimonials.append({ text: "", author: "", role: "", company: "" })}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition"
          >
            <Plus size={14} /> Add testimonial
          </button>
        )}
      </SectionCard>

      {/* ── Clients / Logos ── */}
      <SectionCard
        title="Clients / Logos"
        icon={<Users size={14} />}
        hint="Logos shown on the home page (upload or paste a URL)"
        action={
          <div className="flex gap-2">
            {clients.fields.length === 0 && (
              <Button
                type="button"
                size="sm"
                onClick={() => clients.replace(SAMPLE_CLIENTS)}
              >
                Load examples
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              onClick={() => clients.append({ name: "", href: "", logoHref: "" })}
            >
              <Plus size={12} className="mr-1" /> Add
            </Button>
          </div>
        }
      >
        <Field label="Section label" hint='Shown above the logos — e.g. "Trusted by"'>
          <TextInput placeholder="Trusted by" {...form.register("home.clientsLabel")} />
        </Field>

        <div className="border-t border-gray-100 mt-5 pt-3">
          {clients.fields.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
              <Users size={24} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-400 mb-1">No clients yet</p>
              <p className="text-xs text-gray-400">Click <strong>Load examples</strong> to preview with placeholder brands.</p>
            </div>
          )}

          <div className="grid gap-2">
            {clients.fields.map((f, i) => (
              <ClientRow
                key={f.id}
                index={i}
                form={form}
                dragProps={clientsDrag.getProps(i)}
                handleProps={clientsDrag.handleProps}
                isDragOver={clientsDrag.dragOver === i}
                onRemove={() => clients.remove(i)}
              />
            ))}
          </div>

          {clients.fields.length > 0 && (
            <button
              type="button"
              onClick={() => clients.append({ name: "", href: "", logoHref: "" })}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition"
            >
              <Plus size={14} /> Add client
            </button>
          )}
        </div>
      </SectionCard>

    </div>
  );
}
