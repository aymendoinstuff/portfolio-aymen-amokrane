"use client";
import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { SiteSettings } from "../schema";
import { TextInput, Textarea, Button } from "../ui/Inputs";
import { ImageUploader } from "../ui/ImageUploader";
import {
  User, Briefcase, Plus, Trash2, Tag, GraduationCap, Wrench, BarChart2, ImageIcon,
} from "lucide-react";

// ─── Shared ───────────────────────────────────────────────────────────────────

function SectionCard({
  title, icon, action, children,
}: {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
        {icon && (
          <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            {icon}
          </span>
        )}
        <h2 className="text-sm font-semibold text-gray-700 tracking-wide uppercase flex-1">{title}</h2>
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

// Tag chip for primitive string arrays
function TagChips({
  values,
  onAdd,
  onRemove,
  placeholder = "Add item…",
}: {
  values: string[];
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = React.useState("");
  const commit = () => {
    const v = draft.trim();
    if (v) { onAdd(v); setDraft(""); }
  };
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {values.map((v, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm">
            {v}
            <button type="button" onClick={() => onRemove(i)} className="text-gray-400 hover:text-gray-600 transition">
              ×
            </button>
          </span>
        ))}
        {values.length === 0 && <span className="text-sm text-gray-400 italic">None added yet</span>}
      </div>
      <div className="flex gap-2">
        <TextInput
          value={draft}
          onChange={(e) => setDraft(e.currentTarget.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
          placeholder={placeholder}
          className="max-w-64"
        />
        <Button type="button" size="sm" onClick={commit}>
          <Plus size={12} className="mr-1" /> Add
        </Button>
      </div>
    </div>
  );
}

// ─── AboutTab ────────────────────────────────────────────────────────────────

export function AboutTab({ form }: { form: UseFormReturn<SiteSettings> }) {
  const expArray = useFieldArray({ control: form.control, name: "about.experiences" });
  const statsArray = useFieldArray({ control: form.control, name: "about.stats" });

  const education = form.watch("about.education") ?? [];
  const skills = form.watch("about.skills") ?? [];
  const tools = form.watch("about.tools") ?? [];

  const pushStr = (path: "about.education" | "about.skills" | "about.tools", value: string) => {
    const cur = form.getValues(path) ?? [];
    form.setValue(path, [...cur, value], { shouldDirty: true });
  };
  const removeStr = (path: "about.education" | "about.skills" | "about.tools", idx: number) => {
    const cur = form.getValues(path) ?? [];
    form.setValue(path, cur.filter((_, i) => i !== idx), { shouldDirty: true });
  };

  return (
    <div className="grid gap-5">

      {/* ── Hero Cover Image ── */}
      <SectionCard title="Hero Cover Image" icon={<ImageIcon size={14} />}>
        <div className="grid gap-3">
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50" style={{ aspectRatio: "3/1", maxHeight: 180 }}>
            {form.watch("about.heroCoverUrl") ? (
              <>
                <img
                  src={form.watch("about.heroCoverUrl")}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => form.setValue("about.heroCoverUrl", "", { shouldDirty: true })}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black text-white rounded-full text-sm flex items-center justify-center leading-none transition"
                  title="Remove cover"
                >×</button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                <ImageIcon size={28} />
                <span className="text-xs text-gray-400">No cover image yet</span>
              </div>
            )}
          </div>
          <ImageUploader
            value={form.watch("about.heroCoverUrl")}
            onChange={(url) => form.setValue("about.heroCoverUrl", url, { shouldDirty: true })}
            folder="covers"
            label="Upload cover image"
            hint="1920 × 640 px recommended — wide landscape, will be cropped to 3:1"
          />
        </div>
      </SectionCard>

      {/* ── Personal Info ── */}
      <SectionCard title="Personal Info" icon={<User size={14} />}>
        <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
          {/* Avatar */}
          <div className="grid gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Profile photo</label>
            {form.watch("about.heroAvatarUrl") ? (
              <div className="relative">
                <img
                  src={form.watch("about.heroAvatarUrl")}
                  alt="Avatar"
                  className="w-24 h-24 rounded-2xl object-cover border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => form.setValue("about.heroAvatarUrl", "", { shouldDirty: true })}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none"
                  title="Remove photo"
                >×</button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                <User size={28} />
              </div>
            )}
            <ImageUploader
              value={form.watch("about.heroAvatarUrl")}
              onChange={(url) => form.setValue("about.heroAvatarUrl", url, { shouldDirty: true })}
              folder="avatars"
              label="Upload photo"
              hint="400 × 400 px recommended — square, will be cropped to circle"
            />
          </div>

          {/* Fields */}
          <div className="grid gap-4">
            <Field label="Full name">
              <TextInput placeholder="Aymen Amokrane" {...form.register("about.personal.name")} />
            </Field>
            <Field label="Role / Title">
              <TextInput placeholder="Brand Designer" {...form.register("about.personal.role")} />
            </Field>
            <Field label="Location">
              <TextInput placeholder="Paris, France" {...form.register("about.personal.location")} />
            </Field>
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <Field label="Intro paragraph" hint="Shown at top of About page">
            <Textarea rows={4} placeholder="A short intro about you…" {...form.register("about.intro")} />
          </Field>
          <Field label="Bio" hint="Longer version">
            <Textarea rows={5} placeholder="Longer bio text…" {...form.register("about.bio")} />
          </Field>
        </div>
      </SectionCard>

      {/* ── Experience ── */}
      <SectionCard
        title="Experience"
        icon={<Briefcase size={14} />}
        action={
          <Button
            type="button"
            size="sm"
            onClick={() => expArray.append({ role: "", company: "", period: "", desc: "" })}
          >
            <Plus size={12} className="mr-1" /> Add
          </Button>
        }
      >
        {expArray.fields.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
            <Briefcase size={20} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">No experience yet. Click Add to create an entry.</p>
          </div>
        )}
        <div className="grid gap-4">
          {expArray.fields.map((f, i) => (
            <div key={f.id} className="rounded-xl border border-gray-200 overflow-hidden">
              {/* Card header */}
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">
                  {form.watch(`about.experiences.${i}.role`) || `Experience ${i + 1}`}
                  {form.watch(`about.experiences.${i}.company`) && (
                    <span className="font-normal text-gray-400"> · {form.watch(`about.experiences.${i}.company`)}</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => expArray.remove(i)}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="p-4 grid gap-3">
                <div className="grid md:grid-cols-3 gap-3">
                  <Field label="Role">
                    <TextInput placeholder="Brand Designer" {...form.register(`about.experiences.${i}.role` as const)} />
                  </Field>
                  <Field label="Company">
                    <TextInput placeholder="Studio X" {...form.register(`about.experiences.${i}.company` as const)} />
                  </Field>
                  <Field label="Period">
                    <TextInput placeholder="2022 — Present" {...form.register(`about.experiences.${i}.period` as const)} />
                  </Field>
                </div>
                <Field label="Description">
                  <Textarea rows={2} placeholder="What you did there…" {...form.register(`about.experiences.${i}.desc` as const)} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Education / Skills / Tools ── */}
      <div className="grid md:grid-cols-3 gap-5">
        <SectionCard title="Education" icon={<GraduationCap size={14} />}>
          <TagChips
            values={education}
            onAdd={(v) => pushStr("about.education", v)}
            onRemove={(i) => removeStr("about.education", i)}
            placeholder="e.g. BA Design…"
          />
        </SectionCard>
        <SectionCard title="Skills" icon={<Tag size={14} />}>
          <TagChips
            values={skills}
            onAdd={(v) => pushStr("about.skills", v)}
            onRemove={(i) => removeStr("about.skills", i)}
            placeholder="e.g. Brand Strategy…"
          />
        </SectionCard>
        <SectionCard title="Tools" icon={<Wrench size={14} />}>
          <TagChips
            values={tools}
            onAdd={(v) => pushStr("about.tools", v)}
            onRemove={(i) => removeStr("about.tools", i)}
            placeholder="e.g. Figma…"
          />
        </SectionCard>
      </div>

      {/* ── Stats ── */}
      <SectionCard
        title="Stats (By the Numbers)"
        icon={<BarChart2 size={14} />}
        action={
          <Button
            type="button"
            size="sm"
            onClick={() => statsArray.append({ v: 0, suffix: "", k: "", sub: "" })}
          >
            <Plus size={12} className="mr-1" /> Add
          </Button>
        }
      >
        <p className="text-xs text-gray-400 mb-4">
          These are the raw stat values. Which ones to display on the home page is set in the Home tab.
        </p>
        {statsArray.fields.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
            <BarChart2 size={20} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">No stats yet. Click Add to create one.</p>
          </div>
        )}
        <div className="grid gap-3">
          {statsArray.fields.map((f, i) => (
            <div key={f.id} className="flex gap-3 rounded-xl border border-gray-200 p-4 items-start">
              <div className="flex-1 grid md:grid-cols-4 gap-3">
                <Field label="Value">
                  <TextInput
                    inputMode="numeric"
                    placeholder="20"
                    {...form.register(`about.stats.${i}.v` as const, { valueAsNumber: true })}
                  />
                </Field>
                <Field label="Suffix">
                  <TextInput placeholder="+" {...form.register(`about.stats.${i}.suffix` as const)} />
                </Field>
                <Field label="Label">
                  <TextInput placeholder="Clients Served" {...form.register(`about.stats.${i}.k` as const)} />
                </Field>
                <Field label="Sub-text">
                  <TextInput placeholder="Real projects only" {...form.register(`about.stats.${i}.sub` as const)} />
                </Field>
              </div>
              <button
                type="button"
                onClick={() => statsArray.remove(i)}
                className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 transition mt-0.5"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

    </div>
  );
}
