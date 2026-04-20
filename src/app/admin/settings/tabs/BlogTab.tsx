"use client";
import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import type { SiteSettings } from "../schema";
import { TextInput, Button } from "../ui/Inputs";
import { BookOpen, Hash, Plus, Settings2 } from "lucide-react";

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

// ─── BlogTab ────────────────────────────────────────────────────────────────

export function BlogTab({ form }: { form: UseFormReturn<SiteSettings> }) {
  const categories = form.watch("blog.categories") ?? [];
  const [draft, setDraft] = React.useState("");

  const addCategory = () => {
    const v = draft.trim();
    if (!v) return;
    form.setValue("blog.categories", [...categories, v], { shouldDirty: true });
    setDraft("");
  };

  const removeCategory = (i: number) => {
    form.setValue("blog.categories", categories.filter((_, idx) => idx !== i), { shouldDirty: true });
  };

  const showDates = form.watch("blog.showDates");

  return (
    <div className="grid gap-5">

      {/* ── Blog Settings ── */}
      <SectionCard title="Blog Settings" icon={<Settings2 size={14} />}>
        <div className="grid md:grid-cols-3 gap-5">
          <Field label="Posts per page" hint="1–50">
            <TextInput
              inputMode="numeric"
              placeholder="10"
              {...form.register("blog.postsPerPage", {
                valueAsNumber: true,
                onChange: (e) => {
                  const n = Math.max(1, Math.min(50, Number(String(e.currentTarget.value).replace(/[^0-9]/g, "")) || 1));
                  e.currentTarget.value = String(n);
                  return n;
                },
              })}
            />
          </Field>

          <Field label="Newsletter link">
            <TextInput placeholder="https://..." {...form.register("blog.newsletterHref")} />
          </Field>

          <Field label="Show dates on posts">
            <button
              type="button"
              onClick={() => form.setValue("blog.showDates", !showDates, { shouldDirty: true })}
              className={[
                "flex items-center gap-3 h-11 px-4 rounded-xl border text-sm font-medium transition-all",
                showDates ? "border-black bg-black text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-400",
              ].join(" ")}
            >
              <span className={[
                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition",
                showDates ? "border-white bg-white" : "border-gray-300",
              ].join(" ")}>
                {showDates && (
                  <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M3 8l3 3 7-7" />
                  </svg>
                )}
              </span>
              {showDates ? "Dates shown" : "Dates hidden"}
            </button>
          </Field>
        </div>
      </SectionCard>

      {/* ── Categories ── */}
      <SectionCard title="Categories" icon={<Hash size={14} />}>
        <p className="text-xs text-gray-400 mb-4">
          Categories used to tag and filter articles. Press Enter or click Add to create one.
        </p>

        {/* Chip list */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.length === 0 && (
            <span className="text-sm text-gray-400 italic">No categories yet</span>
          )}
          {categories.map((cat, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm font-medium"
            >
              <Hash size={11} className="text-gray-400" />
              {cat}
              <button
                type="button"
                onClick={() => removeCategory(i)}
                className="text-gray-400 hover:text-red-500 transition text-base leading-none ml-0.5"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Add input */}
        <div className="flex gap-2 max-w-sm">
          <TextInput
            value={draft}
            onChange={(e) => setDraft(e.currentTarget.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCategory(); } }}
            placeholder="New category…"
          />
          <Button type="button" size="sm" onClick={addCategory}>
            <Plus size={12} className="mr-1" /> Add
          </Button>
        </div>
      </SectionCard>

    </div>
  );
}
