"use client";

import { useMemo, useState } from "react";
import { useForm, type DeepPartial } from "react-hook-form";
import Link from "next/link";
import { firestore } from "@/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";
import type { Project, ProjectTimeline, ProjectTeamMember } from "@/lib/types/project";
import DropZone from "@/components/admin/ui/DropZone";
import TagInput from "@/components/admin/ui/TagInput";
import { toast, ToastContainer } from "@/components/admin/ui/Toast";
import BlockEditor from "@/components/admin/BlockEditor";
import type { ExtraBlock } from "@/lib/types/project";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Eye,
  EyeOff,
  Image as ImageIcon,
  ExternalLink,
  Users,
  MapPin,
  Clock,
  Link2,
  Briefcase,
  Globe,
  Github,
  X,
} from "lucide-react";

// ---------- Utils ----------
function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\- ]+/g, "")
    .replace(/\s+/g, "-");
}

// ---------- Types ----------
type Props = {
  id?: string;
  initial?: Partial<Project>;
};

// ---------- Small UI Pieces ----------
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

// ---------- Main Component ----------
export default function ProjectForm({ id, initial }: Props) {
  const defaultValues = useMemo<DeepPartial<Project>>(
    () => ({
      general: {
        id: initial?.general?.id ?? "",
        title: initial?.general?.title ?? "",
        slug: initial?.general?.slug ?? "",
        year: initial?.general?.year ?? new Date().getFullYear(),
        tags: initial?.general?.tags ?? [],
        industry: initial?.general?.industry ?? "",
        heroUrl: initial?.general?.heroUrl ?? "",
        quotes: initial?.general?.quotes ?? [],
        published: initial?.general?.published ?? false,
        createdAt: initial?.general?.createdAt ?? Date.now(),
        updatedAt: initial?.general?.updatedAt ?? Date.now(),
      },
      main: {
        brief: initial?.main?.brief ?? "",
        gallery: initial?.main?.gallery ?? [],
        details: {
          client: initial?.main?.details?.client ?? "",
          sector: initial?.main?.details?.sector ?? "",
          discipline: initial?.main?.details?.discipline ?? [],
          tagline: initial?.main?.details?.tagline ?? "",
          summary: initial?.main?.details?.summary ?? "",
          team: initial?.main?.details?.team ?? [],
          services: initial?.main?.details?.services ?? [],
          deliverables: initial?.main?.details?.deliverables ?? [],
          timeline: initial?.main?.details?.timeline as
            | ProjectTimeline
            | undefined,
          location: initial?.main?.details?.location ?? "",
          links: initial?.main?.details?.links ?? {},
        },
      },
      extra: initial?.extra ?? undefined,
    }),
    [initial]
  );

  const { register, handleSubmit, setValue, watch } = useForm<Project>({
    defaultValues: defaultValues as Project,
  });

  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState<ExtraBlock[]>(
    initial?.extra?.blocks ?? []
  );

  // Watched values
  const team: ProjectTeamMember[] = watch("main.details.team") ?? [];
  const timeline = watch("main.details.timeline") as ProjectTimeline | undefined;
  const tags: string[] = watch("general.tags") ?? [];
  const discipline: string[] = watch("main.details.discipline") ?? [];
  const services: string[] = watch("main.details.services") ?? [];
  const deliverables: string[] = watch("main.details.deliverables") ?? [];
  const heroUrl: string = watch("general.heroUrl") ?? "";
  const published: boolean = watch("general.published") ?? false;

  // Timeline helpers
  const isTimelineLabel = (tl?: ProjectTimeline): tl is { label: string } =>
    typeof tl === "object" && tl !== null && "label" in tl;

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
      await setDoc(doc(firestore, "projects", _id), payload, { merge: true });
      toast.success("Project saved successfully");
    } catch {
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
                <Field label="Tagline" hint="Short punchy line">
                  <input
                    className={inputCls}
                    placeholder="e.g. Rebranding a challenger bank"
                    {...register("main.details.tagline")}
                  />
                </Field>
                <Field label="Brief" hint="Concise project overview">
                  <textarea
                    className={`${textareaCls} min-h-[100px]`}
                    placeholder="Describe the project in a few sentences…"
                    {...register("main.brief")}
                  />
                </Field>
                <Field label="Summary" hint="One-line summary for listings">
                  <input
                    className={inputCls}
                    placeholder="e.g. Full brand identity and digital design system"
                    {...register("main.details.summary", { required: true })}
                  />
                </Field>
              </div>
            </SectionCard>

            {/* LAYOUT BUILDER */}
            <SectionCard
              title="Page Layout"
              icon={<span className="text-sm">⊞</span>}
            >
              <p className="text-xs text-gray-500 mb-4">
                Build your project page block by block — like Pentagram. Drag to reorder.
              </p>
              <BlockEditor blocks={blocks} onChange={setBlocks} />
            </SectionCard>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="grid gap-5 content-start">

            {/* PROJECT INFO */}
            <SectionCard title="Project Info" icon={<Briefcase size={14} />}>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Year">
                    <input
                      type="number"
                      className={inputCls}
                      {...register("general.year", { valueAsNumber: true })}
                    />
                  </Field>
                  <Field label="Slug" hint="Auto">
                    <input
                      className={inputCls}
                      placeholder="auto-generated"
                      {...register("general.slug")}
                    />
                  </Field>
                </div>
                <Field label="Client">
                  <input
                    className={inputCls}
                    placeholder="e.g. Acme Corp"
                    {...register("main.details.client", { required: true })}
                  />
                </Field>
                <Field label="Industry">
                  <input
                    className={inputCls}
                    placeholder="e.g. Fintech"
                    {...register("general.industry")}
                  />
                </Field>
                <Field label="Sector">
                  <input
                    className={inputCls}
                    placeholder="e.g. Banking & Finance"
                    {...register("main.details.sector", { required: true })}
                  />
                </Field>
              </div>
            </SectionCard>

            {/* TAGS & CATEGORIES */}
            <SectionCard title="Tags & Disciplines">
              <div className="grid gap-3">
                <Field label="Tags">
                  <TagInput
                    value={tags}
                    onChange={(v) => setValue("general.tags", v)}
                    placeholder="Add tag, press Enter…"
                  />
                </Field>
                <Field label="Disciplines">
                  <TagInput
                    value={discipline}
                    onChange={(v) => setValue("main.details.discipline", v)}
                    placeholder="e.g. Branding…"
                  />
                </Field>
                <Field label="Services">
                  <TagInput
                    value={services}
                    onChange={(v) => setValue("main.details.services", v)}
                    placeholder="e.g. Strategy…"
                  />
                </Field>
                <Field label="Deliverables">
                  <TagInput
                    value={deliverables}
                    onChange={(v) => setValue("main.details.deliverables", v)}
                    placeholder="e.g. Brand guide…"
                  />
                </Field>
              </div>
            </SectionCard>

            {/* TIMELINE & LOCATION */}
            <SectionCard title="Timeline & Location">
              <div className="grid gap-3">
                {/* Timeline mode toggle */}
                <div className="flex gap-1.5 p-1 bg-gray-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() =>
                      setValue("main.details.timeline", {
                        start: "",
                        end: "",
                      } as ProjectTimeline)
                    }
                    className={[
                      "flex-1 py-1.5 rounded-md text-xs font-semibold transition-all",
                      !isTimelineLabel(timeline)
                        ? "bg-white shadow text-black"
                        : "text-gray-500 hover:text-gray-700",
                    ].join(" ")}
                  >
                    <Clock size={11} className="inline mr-1" />
                    Date Range
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setValue("main.details.timeline", {
                        label: "",
                      } as ProjectTimeline)
                    }
                    className={[
                      "flex-1 py-1.5 rounded-md text-xs font-semibold transition-all",
                      isTimelineLabel(timeline)
                        ? "bg-white shadow text-black"
                        : "text-gray-500 hover:text-gray-700",
                    ].join(" ")}
                  >
                    Freeform
                  </button>
                </div>

                {isTimelineLabel(timeline) ? (
                  <input
                    placeholder="e.g. 2021–2023"
                    className={inputCls}
                    value={timeline.label ?? ""}
                    onChange={(e) =>
                      setValue("main.details.timeline", {
                        label: e.currentTarget.value,
                      })
                    }
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Start (YYYY-MM)"
                      className={inputCls}
                      value={
                        !isTimelineLabel(timeline)
                          ? (timeline?.start ?? "")
                          : ""
                      }
                      onChange={(e) =>
                        setValue("main.details.timeline", {
                          start: e.currentTarget.value,
                          end: !isTimelineLabel(timeline)
                            ? (timeline?.end ?? "")
                            : "",
                        })
                      }
                    />
                    <input
                      placeholder="End (optional)"
                      className={inputCls}
                      value={
                        !isTimelineLabel(timeline)
                          ? (timeline?.end ?? "")
                          : ""
                      }
                      onChange={(e) =>
                        setValue("main.details.timeline", {
                          start: !isTimelineLabel(timeline)
                            ? (timeline?.start ?? "")
                            : "",
                          end: e.currentTarget.value,
                        })
                      }
                    />
                  </div>
                )}

                <Field label="Location" hint="Optional">
                  <div className="relative">
                    <MapPin
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      className={`${inputCls} pl-8`}
                      placeholder="e.g. Paris, France"
                      {...register("main.details.location")}
                    />
                  </div>
                </Field>
              </div>
            </SectionCard>

            {/* LINKS */}
            <SectionCard title="Links" icon={<Link2 size={14} />}>
              <div className="grid gap-2.5">
                {[
                  {
                    key: "main.details.links.behance" as const,
                    label: "Behance",
                    icon: <Globe size={14} />,
                    placeholder: "https://behance.net/…",
                  },
                  {
                    key: "main.details.links.caseStudy" as const,
                    label: "Case Study",
                    icon: <ExternalLink size={14} />,
                    placeholder: "https://…",
                  },
                  {
                    key: "main.details.links.liveSite" as const,
                    label: "Live Site",
                    icon: <Globe size={14} />,
                    placeholder: "https://…",
                  },
                  {
                    key: "main.details.links.repo" as const,
                    label: "Repository",
                    icon: <Github size={14} />,
                    placeholder: "https://github.com/…",
                  },
                ].map(({ key, label, icon, placeholder }) => (
                  <div key={key} className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {icon}
                    </div>
                    <input
                      className={`${inputCls} pl-8`}
                      placeholder={`${label}: ${placeholder}`}
                      {...register(key)}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* TEAM */}
            <SectionCard title="Team" icon={<Users size={14} />}>
              <div className="grid gap-2">
                {(team as { name: string; role: string }[]).map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 grid grid-cols-2 gap-1.5">
                      <input
                        value={m.name}
                        onChange={(e) => {
                          const next = [...team];
                          next[i] = { ...next[i], name: e.currentTarget.value };
                          setValue("main.details.team", next);
                        }}
                        placeholder="Name"
                        className={inputCls}
                      />
                      <input
                        value={m.role}
                        onChange={(e) => {
                          const next = [...team];
                          next[i] = { ...next[i], role: e.currentTarget.value };
                          setValue("main.details.team", next);
                        }}
                        placeholder="Role"
                        className={inputCls}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "main.details.team",
                          team.filter((_, ix) => ix !== i)
                        )
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setValue("main.details.team", [
                      ...team,
                      { name: "", role: "" },
                    ])
                  }
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors py-1"
                >
                  <Plus size={15} />
                  Add team member
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
