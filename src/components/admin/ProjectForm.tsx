"use client";

import { useMemo, useState } from "react";
import { useForm, useFieldArray, type DeepPartial } from "react-hook-form";
import Link from "next/link";
import type { Project, Block } from "@/lib/types/project";
import DropZone from "@/components/admin/ui/DropZone";
import TagInput from "@/components/admin/ui/TagInput";
import { toast, ToastContainer } from "@/components/admin/ui/Toast";
import BlockEditor from "@/components/admin/BlockEditor";
import { DeleteProjectButton } from "@/components/admin/ui/DeleteProjectButton";
import { slugify } from "@/lib/utils/slugify";
import {
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Briefcase,
  Plus,
  Trash2,
} from "lucide-react";

// Industries dropdown list
const INDUSTRIES = [
  "Technology",
  "Finance & Banking",
  "Healthcare & Pharma",
  "Retail & E-commerce",
  "Food & Beverage",
  "Fashion & Luxury",
  "Real Estate",
  "Education",
  "Entertainment & Media",
  "Sports & Fitness",
  "Travel & Hospitality",
  "Automotive",
  "Energy & Sustainability",
  "Non-Profit & Social Impact",
  "Government & Public Sector",
  "Music & Arts",
  "Beauty & Wellness",
  "Architecture & Design",
  "Logistics & Supply Chain",
  "Legal & Professional Services",
];

// Services multi-select list
const SERVICES = [
  "Brand Strategy",
  "Advertising Campaign",
  "Branding",
  "Visual Identity Design",
  "Illustration",
  "Web Design",
  "Brand Facelift",
  "Brand Guidelines",
  "Art Direction",
  "Copywriting",
  "Packaging Design",
  "Motion Design",
  "Social Media Design",
  "UX/UI Design",
  "Print & Editorial",
  "Photography Direction",
  "Campaign Strategy",
  "Content Creation",
];

// ─── Small UI Components ───────────────────────────────────────
function SectionCard({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
        {icon && (
          <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            {icon}
          </span>
        )}
        <h2 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
          {title}
        </h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid gap-1.5 ${className}`}>
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400";

const textareaCls =
  "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-y placeholder:text-gray-400";

const selectCls =
  "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all";

// ─── Main Component ────────────────────────────────────────────
type Props = {
  id?: string;
  initial?: Partial<Project>;
};

export default function ProjectForm({ id, initial }: Props) {
  const defaultValues = useMemo<DeepPartial<Project>>(
    () => ({
      general: {
        id: initial?.general?.id ?? "",
        title: initial?.general?.title ?? "",
        slug: initial?.general?.slug ?? "",
        year: initial?.general?.year ?? new Date().getFullYear(),
        tags: initial?.general?.tags ?? [],
        heroUrl: initial?.general?.heroUrl ?? "",
        published: initial?.general?.published ?? false,
        createdAt: initial?.general?.createdAt ?? Date.now(),
        updatedAt: initial?.general?.updatedAt ?? Date.now(),
      },
      main: {
        details: {
          tagline: initial?.main?.details?.tagline ?? "",
          summary: initial?.main?.details?.summary ?? "",
        },
      },
      notes: {
        brief: initial?.notes?.brief ?? "",
        client: initial?.notes?.client ?? "",
        industry: initial?.notes?.industry ?? "",
        services: initial?.notes?.services ?? [],
        year: initial?.notes?.year ?? new Date().getFullYear(),
        region: initial?.notes?.region ?? "",
        deliverables: initial?.notes?.deliverables ?? "",
        customNotes: initial?.notes?.customNotes ?? [],
      },
      extra: initial?.extra ?? undefined,
    }),
    [initial]
  );

  const { register, handleSubmit, setValue, watch, control } = useForm<Project>({
    defaultValues: defaultValues as Project,
  });

  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>(
    initial?.extra?.blocks ?? []
  );

  // Watched values
  const tags: string[] = watch("general.tags") ?? [];
  const heroUrl: string = watch("general.heroUrl") ?? "";
  const published: boolean = watch("general.published") ?? false;
  const services: string[] = watch("notes.services") ?? [];

  const { fields: customNoteFields, append: appendCustomNote, remove: removeCustomNote } =
    useFieldArray({ control, name: "notes.customNotes" as never });

  // Submit
  const onSubmit = async (data: Project) => {
    setSaving(true);
    try {
      const slug = data.general.slug || slugify(data.general.title);
      const _id = id || data.general.id || slug;
      const payload: Project = {
        ...data,
        general: {
          ...data.general,
          id: _id,
          slug,
          createdAt: initial?.general?.createdAt ?? Date.now(),
          updatedAt: Date.now(),
        },
        extra: blocks.length > 0 ? { blocks } : undefined,
      };
      // Strip undefined values (Firestore rejects them)
      const clean = JSON.parse(JSON.stringify(payload));
      const res = await fetch("/api/admin/projects/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(clean),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Project saved successfully");
    } catch (err) {
      console.error("[ProjectForm] save error:", err);
      toast.error("Failed to save — check your connection");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-gray-50">
        {/* ── Sticky header ── */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Projects</span>
          </Link>

          <div className="w-px h-5 bg-gray-200" />

          {/* Inline title preview */}
          <input
            {...register("general.title", { required: true })}
            placeholder="Project title"
            className="flex-1 text-sm font-semibold text-gray-700 bg-transparent outline-none placeholder:text-gray-400 min-w-0"
          />

          {/* Status badge */}
          <button
            type="button"
            onClick={() => setValue("general.published", !published)}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
              published
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200",
            ].join(" ")}
          >
            {published ? <Eye size={12} /> : <EyeOff size={12} />}
            {published ? "Published" : "Draft"}
          </button>

          {id && (
            <DeleteProjectButton
              id={id}
              title={watch("general.title")}
              variant="full"
            />
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-60 hover:bg-gray-800 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving…
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>

        {/* ── Body ── */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
          {/* ── LEFT COLUMN ── */}
          <div className="grid gap-5">

            {/* COVER IMAGE */}
            <SectionCard title="Cover Image" icon={<ImageIcon size={14} />}>
              <DropZone
                value={heroUrl}
                onUploaded={(url) => setValue("general.heroUrl", url)}
                onClear={() => setValue("general.heroUrl", "")}
                aspectRatio="16/7"
                placeholder="Upload your project cover image"
              />
              <p className="text-xs text-gray-400 mt-2">
                Recommended: 1600×700px or wider, max 10MB
              </p>
            </SectionCard>

            {/* OVERVIEW */}
            <SectionCard title="Overview" icon={<Briefcase size={14} />}>
              <div className="grid gap-4">
                <Field label="Tagline" hint="Short slogan">
                  <input
                    className={inputCls}
                    placeholder="e.g. Rebranding a challenger bank"
                    {...register("main.details.tagline")}
                  />
                </Field>
                <Field label="Summary" hint="Small body text">
                  <input
                    className={inputCls}
                    placeholder="e.g. Full brand identity and digital design system"
                    {...register("main.details.summary")}
                  />
                </Field>
                <Field label="Brief" hint="Shown in project sidebar — use ## for sub-headings, blank line for new paragraph">
                  <textarea
                    className={`${textareaCls} min-h-[220px]`}
                    placeholder={`Describe the project context and approach…\n\nYou can use:\n## Sub-heading\nParagraph text here.`}
                    {...register("notes.brief")}
                  />
                </Field>
                <Field label="Tags">
                  <TagInput
                    value={tags}
                    onChange={(v) => setValue("general.tags", v)}
                    placeholder="Add tag, press Enter…"
                  />
                </Field>
              </div>
            </SectionCard>

            {/* GALLERY BLOCKS */}
            <SectionCard title="Page Layout" icon={<span className="text-sm">⊞</span>}>
              <p className="text-xs text-gray-500 mb-4">
                Build your project gallery block by block. Drag to reorder.
              </p>
              <BlockEditor blocks={blocks} onChange={setBlocks} />
            </SectionCard>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="grid gap-5 content-start">

            {/* YEAR */}
            <SectionCard title="Year" icon={<Briefcase size={14} />}>
              <input
                type="number"
                className={inputCls}
                {...register("notes.year", { valueAsNumber: true })}
              />
            </SectionCard>

            {/* NOTES SECTION */}
            <SectionCard title="Project Notes">
              <div className="grid gap-3">
                <Field label="Client">
                  <input
                    className={inputCls}
                    placeholder="e.g. Acme Corp"
                    {...register("notes.client")}
                  />
                </Field>

                <Field label="Industry">
                  <select
                    className={selectCls}
                    {...register("notes.industry")}
                  >
                    <option value="">Select industry…</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Services">
                  <div className="grid gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
                    {SERVICES.map((svc) => (
                      <label key={svc} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={services.includes(svc)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setValue("notes.services", [...services, svc]);
                            } else {
                              setValue(
                                "notes.services",
                                services.filter((s) => s !== svc)
                              );
                            }
                          }}
                          className="rounded border-gray-200"
                        />
                        <span className="text-sm text-gray-700">{svc}</span>
                      </label>
                    ))}
                  </div>
                </Field>

                <Field label="Region" hint="Optional">
                  <input
                    className={inputCls}
                    placeholder="e.g. Europe"
                    {...register("notes.region")}
                  />
                </Field>

                <Field label="Deliverables" hint="Optional">
                  <textarea
                    className={`${textareaCls} min-h-[80px]`}
                    placeholder="List deliverables, comma-separated or line-by-line…"
                    {...register("notes.deliverables")}
                  />
                </Field>
              </div>
            </SectionCard>

            {/* CUSTOM NOTES */}
            <SectionCard title="Custom Notes">
              <div className="grid gap-3">
                {(customNoteFields as { id: string }[]).map((field, idx) => (
                  <div key={field.id} className="border border-gray-200 rounded-xl p-3 grid gap-2 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <input
                        className={`${inputCls} flex-1`}
                        placeholder="Note title…"
                        {...register(`notes.customNotes.${idx}.title` as never)}
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomNote(idx)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <textarea
                      className={`${textareaCls} min-h-[72px]`}
                      placeholder="Note content…"
                      {...register(`notes.customNotes.${idx}.content` as never)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendCustomNote({ title: "", content: "" })}
                  className="flex items-center justify-center gap-2 w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-black hover:text-black transition-colors"
                >
                  <Plus size={14} />
                  Add note
                </button>
              </div>
            </SectionCard>
          </div>
        </div>
      </form>

      <ToastContainer />
    </>
  );
}
