"use client";
import { useMemo, useState } from "react";
import { useForm, type DeepPartial } from "react-hook-form";
import Upload from "./Upload";
import type { Project, ProjectTimeline, ProjectTeamMember } from "@/lib/types/project";
import { firestore } from "@/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";
import { MediaItem } from "@/lib/types/common";

// ---------- Props ----------
type Props = {
  id?: string;
  initial?: Partial<Project>;
};

// ---------- Utils ----------
function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\- ]+/g, "") // remove non-word chars except space/hyphen
    .replace(/\s+/g, "-");
}

function arrToCSV(arr?: string[]) {
  return (arr ?? []).join(", ");
}

function csvToArr(s: string) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

// ---------- Component ----------
export default function ProjectForm({ id, initial }: Props) {
  // Build sensible defaults from the new Project schema
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
          timeline: initial?.main?.details?.timeline as ProjectTimeline | undefined,
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

  // ----- watches (for dynamic UI) -----
  const gallery: MediaItem[] = watch("main.gallery") ?? [];
  const team: ProjectTeamMember[] = watch("main.details.team") ?? [];
  const timeline = watch("main.details.timeline") as ProjectTimeline | undefined;

  const tagsFromInitial = arrToCSV(initial?.general?.tags);
  const disciplineFromInitial = arrToCSV(initial?.main?.details?.discipline);
  const servicesFromInitial = arrToCSV(initial?.main?.details?.services);
  const deliverablesFromInitial = arrToCSV(initial?.main?.details?.deliverables);
  const quotesFromInitial = (initial?.general?.quotes ?? []).join("\n");

  // ----- submit -----
  const onSubmit = async (data: Project) => {
    setSaving(true);

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
    };

    await setDoc(doc(firestore, "projects", _id), payload, { merge: true });
    setSaving(false);
    alert("Saved");
  };

  // ----- UI helpers -----
  const setTimelineMode = (mode: "range" | "label") => {
    if (mode === "range") {
      setValue("main.details.timeline", { start: "", end: "" } as ProjectTimeline);
    } else {
      setValue("main.details.timeline", { label: "" } as ProjectTimeline);
    }
  };

  const isTimelineLabel = (tl?: ProjectTimeline): tl is { label: string } =>
    typeof tl === "object" && tl !== null && "label" in tl;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      {/* GENERAL */}
      <h2 className="text-lg font-semibold">General</h2>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-1">
          <label htmlFor="title">Title</label>
          <input id="title" className="border rounded px-2 py-1" {...register("general.title", { required: true })} />
        </div>
        <div className="grid gap-1">
          <label htmlFor="slug">Slug</label>
          <input id="slug" className="border rounded px-2 py-1" {...register("general.slug")} />
        </div>
        <div className="grid gap-1">
          <label htmlFor="year">Year</label>
          <input id="year" type="number" className="border rounded px-2 py-1" {...register("general.year", { valueAsNumber: true })} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-1">
          <label htmlFor="industry">Industry</label>
          <input id="industry" className="border rounded px-2 py-1" {...register("general.industry")} />
        </div>
        <div className="grid gap-1">
          <label htmlFor="tags">Tags (comma)</label>
          <input
            id="tags"
            className="border rounded px-2 py-1"
            onChange={(e) => setValue("general.tags", csvToArr(e.currentTarget.value))}
            defaultValue={tagsFromInitial}
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="published" className="flex items-center gap-2">
            <input id="published" type="checkbox" {...register("general.published")} />
            <span>Published</span>
          </label>
        </div>
      </div>

      <div className="grid gap-1">
        <label htmlFor="quotes">Quotes (one per line)</label>
        <textarea
          id="quotes"
          className="border rounded px-2 py-1 min-h-[80px]"
          onChange={(e) => setValue("general.quotes", e.currentTarget.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          defaultValue={quotesFromInitial}
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="heroUrl">Hero</label>
        <div className="flex items-center gap-3">
          <input id="heroUrl" className="border rounded px-2 py-1 flex-1" {...register("general.heroUrl")} />
          <Upload onUploaded={(url) => setValue("general.heroUrl", url)} />
        </div>
      </div>

      {/* MAIN */}
      <h2 className="text-lg font-semibold mt-2">Main</h2>
      <div className="grid gap-1">
        <label htmlFor="brief">Brief</label>
        <textarea id="brief" className="border rounded px-2 py-1 min-h-[100px]" {...register("main.brief")} />
      </div>

      {/* DETAILS */}
      <h3 className="font-medium">Details</h3>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-1">
          <label htmlFor="client">Client</label>
          <input id="client" className="border rounded px-2 py-1" {...register("main.details.client", { required: true })} />
        </div>
        <div className="grid gap-1">
          <label htmlFor="sector">Sector</label>
          <input id="sector" className="border rounded px-2 py-1" {...register("main.details.sector", { required: true })} />
        </div>
        <div className="grid gap-1">
          <label htmlFor="discipline">Discipline (comma)</label>
          <input
            id="discipline"
            className="border rounded px-2 py-1"
            onChange={(e) => setValue("main.details.discipline", csvToArr(e.currentTarget.value))}
            defaultValue={disciplineFromInitial}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-1">
          <label htmlFor="tagline">Tagline</label>
          <input id="tagline" className="border rounded px-2 py-1" {...register("main.details.tagline")} />
        </div>
        <div className="grid gap-1 md:col-span-2">
          <label htmlFor="summary">Summary</label>
          <input id="summary" className="border rounded px-2 py-1" {...register("main.details.summary", { required: true })} />
        </div>
      </div>

      {/* TEAM */}
      <div className="grid gap-2">
        <label>Team</label>
        <div className="grid gap-2">
          {(team as { name: string; role: string }[]).map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                aria-label={`Team member ${i + 1} name`}
                value={m.name}
                onChange={(e) => {
                  const next = [...team];
                  next[i] = { ...next[i], name: e.currentTarget.value };
                  setValue("main.details.team", next);
                }}
                placeholder="Name"
                className="border rounded px-2 py-1 flex-1"
              />
              <input
                aria-label={`Team member ${i + 1} role`}
                value={m.role}
                onChange={(e) => {
                  const next = [...team];
                  next[i] = { ...next[i], role: e.currentTarget.value };
                  setValue("main.details.team", next);
                }}
                placeholder="Role"
                className="border rounded px-2 py-1 w-56"
              />
              <button
                type="button"
                onClick={() => setValue("main.details.team", team.filter((_, ix) => ix !== i))}
                className="text-sm underline"
              >
                remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="border rounded px-2 py-1 w-fit"
            onClick={() => setValue("main.details.team", [...team, { name: "", role: "" }])}
          >
            + Add member
          </button>
        </div>
      </div>

      {/* SERVICES / DELIVERABLES */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="grid gap-1">
          <label htmlFor="services">Services (comma)</label>
          <input
            id="services"
            className="border rounded px-2 py-1"
            onChange={(e) => setValue("main.details.services", csvToArr(e.currentTarget.value))}
            defaultValue={servicesFromInitial}
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="deliverables">Deliverables (comma)</label>
          <input
            id="deliverables"
            className="border rounded px-2 py-1"
            onChange={(e) => setValue("main.details.deliverables", csvToArr(e.currentTarget.value))}
            defaultValue={deliverablesFromInitial}
          />
        </div>
      </div>

      {/* TIMELINE */}
      <div className="grid gap-2">
        <label>Timeline</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="timelineMode"
              checked={!!timeline && !isTimelineLabel(timeline)}
              onChange={() => setTimelineMode("range")}
            />
            <span>Start/End</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="timelineMode"
              checked={!!timeline && isTimelineLabel(timeline)}
              onChange={() => setTimelineMode("label")}
            />
            <span>Freeform label</span>
          </label>
        </div>
        {!timeline || !isTimelineLabel(timeline) ? (
          <div className="grid md:grid-cols-2 gap-3">
            <input
              placeholder="Start (e.g. 2021-06)"
              className="border rounded px-2 py-1"
              value={!timeline || !isTimelineLabel(timeline) ? (timeline?.start ?? "") : ""}
              onChange={(e) => setValue("main.details.timeline", { start: e.currentTarget.value, end: !timeline || isTimelineLabel(timeline) ? "" : (timeline?.end ?? "") })}
            />
            <input
              placeholder="End (optional)"
              className="border rounded px-2 py-1"
              value={!timeline || !isTimelineLabel(timeline) ? (timeline?.end ?? "") : ""}
              onChange={(e) => setValue("main.details.timeline", { start: !timeline || isTimelineLabel(timeline) ? "" : (timeline?.start ?? ""), end: e.currentTarget.value })}
            />
          </div>
        ) : (
          <input
            placeholder="Label (e.g. 2021–2023)"
            className="border rounded px-2 py-1"
            value={isTimelineLabel(timeline) ? (timeline.label ?? "") : ""}
            onChange={(e) => setValue("main.details.timeline", { label: e.currentTarget.value })}
          />
        )}
      </div>

      {/* LOCATION & LINKS */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="grid gap-1">
          <label htmlFor="location">Location</label>
          <input id="location" className="border rounded px-2 py-1" {...register("main.details.location")} />
        </div>
        <div className="grid gap-1">
          <label>Links</label>
          <div className="grid gap-2">
            <input placeholder="Behance URL" className="border rounded px-2 py-1" {...register("main.details.links.behance")} />
            <input placeholder="Case Study URL" className="border rounded px-2 py-1" {...register("main.details.links.caseStudy")} />
            <input placeholder="Live Site URL" className="border rounded px-2 py-1" {...register("main.details.links.liveSite")} />
            <input placeholder="Repo URL" className="border rounded px-2 py-1" {...register("main.details.links.repo")} />
          </div>
        </div>
      </div>

      {/* GALLERY */}
      <div className="grid gap-2">
        <label>Gallery</label>
        <div className="grid gap-2">
          {gallery.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                aria-label={`Gallery item ${i + 1} type`
                }
                value={m.type}
                onChange={(e) => {
                  const g: MediaItem[] = [...gallery];
                  g[i] = { ...g[i], type: e.currentTarget.value as MediaItem["type"] };
                  setValue("main.gallery", g);
                }}
                className="border rounded px-2 py-1"
              >
                <option value="image">image</option>
                <option value="video">video</option>
              </select>
              <input
                aria-label={`Gallery item ${i + 1} URL`}
                value={m.url}
                onChange={(e) => {
                  const g: MediaItem[] = [...gallery];
                  g[i] = { ...g[i], url: e.currentTarget.value };
                  setValue("main.gallery", g);
                }}
                placeholder={m.type === "video" ? "https://…" : "/path/or/https://…"}
                className="border rounded px-2 py-1 flex-1"
              />
              <input
                aria-label={`Gallery item ${i + 1} alt text`}
                value={m.alt ?? ""}
                onChange={(e) => {
                  const g: MediaItem[] = [...gallery];
                  g[i] = { ...g[i], alt: e.currentTarget.value || undefined };
                  setValue("main.gallery", g);
                }}
                placeholder="Alt (optional)"
                className="border rounded px-2 py-1 w-56"
              />
              <button
                type="button"
                onClick={() => setValue("main.gallery", gallery.filter((_, ix) => ix !== i))}
                className="text-sm underline"
              >
                remove
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="border rounded px-2 py-1"
              onClick={() => setValue("main.gallery", [...gallery, { type: "image", url: "" } as MediaItem])}
            >
              + Add
            </button>
            <Upload onUploaded={(url) => setValue("main.gallery", [...gallery, { type: "image", url } as MediaItem])} />
          </div>
        </div>
      </div>

      {/* SUBMIT */}
      <div>
        <button className="rounded-full border-2 border-black px-4 py-2" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
