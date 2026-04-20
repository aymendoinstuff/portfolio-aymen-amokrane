"use client";
import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { SiteSettings } from "../schema";
import { TextInput, Textarea, Button } from "../ui/Inputs";
import { Navigation, Plus, Trash2, Footprints, Copyright, ImageIcon, Share2 } from "lucide-react";
import { ImageUploader } from "../ui/ImageUploader";

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

// ─── GeneralTab ───────────────────────────────────────────────────────────────

const SOCIAL_PLATFORMS = [
  { value: "instagram",  label: "Instagram" },
  { value: "dribbble",   label: "Dribbble" },
  { value: "behance",    label: "Behance" },
  { value: "linkedin",   label: "LinkedIn" },
  { value: "github",     label: "GitHub" },
  { value: "twitter",    label: "X / Twitter" },
  { value: "youtube",    label: "YouTube" },
  { value: "tiktok",     label: "TikTok" },
  { value: "pinterest",  label: "Pinterest" },
  { value: "other",      label: "Other / Custom" },
] as const;

export function GeneralTab({ form }: { form: UseFormReturn<SiteSettings> }) {
  const navLinks    = useFieldArray({ control: form.control, name: "nav.links" });
  const footerLinks = useFieldArray({ control: form.control, name: "footer.links" });
  const socialLinks = useFieldArray({ control: form.control, name: "footer.socialLinks" });

  return (
    <div className="grid gap-5">

      {/* ── Navigation ── */}
      <SectionCard
        title="Navigation"
        icon={<Navigation size={14} />}
        action={
          <Button
            type="button"
            size="sm"
            onClick={() => navLinks.append({ label: "", href: "" })}
          >
            <Plus size={12} className="mr-1" /> Add link
          </Button>
        }
      >
        <div className="grid md:grid-cols-2 gap-4 mb-5 items-start">
          {/* Logo upload */}
          <div className="grid gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Logo image <span className="text-gray-400 font-normal normal-case">(replaces brand name in nav)</span>
            </label>
            <div className="flex items-center gap-3">
              {form.watch("nav.logoUrl") ? (
                <div className="relative">
                  <img
                    src={form.watch("nav.logoUrl")}
                    alt="Logo"
                    className="h-10 w-auto max-w-[140px] object-contain rounded-lg border border-gray-200 bg-gray-50 px-2"
                  />
                  <button
                    type="button"
                    onClick={() => form.setValue("nav.logoUrl", "", { shouldDirty: true })}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none"
                    title="Remove logo"
                  >×</button>
                </div>
              ) : (
                <div className="h-10 w-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                  <ImageIcon size={16} />
                </div>
              )}
              <ImageUploader
                value={form.watch("nav.logoUrl")}
                onChange={(url) => form.setValue("nav.logoUrl", url, { shouldDirty: true })}
                folder="logo"
                label="Upload logo"
                hint="200 × 60 px recommended — PNG/SVG with transparent background"
              />
            </div>
            <p className="text-xs text-gray-400">PNG or SVG with transparent background works best</p>
          </div>

          {/* Brand name fallback */}
          <Field label="Brand name" hint="Shown if no logo uploaded">
            <TextInput placeholder="We Doing" {...form.register("nav.brand")} />
          </Field>
        </div>

        {navLinks.fields.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center mb-0">
            <p className="text-sm text-gray-400">No nav links yet. Click Add link.</p>
          </div>
        )}
        <div className="grid gap-2">
          {navLinks.fields.map((f, i) => (
            <div key={f.id} className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
              <div className="flex-1 grid md:grid-cols-2 gap-3">
                <Field label="Label">
                  <TextInput placeholder="Work" {...form.register(`nav.links.${i}.label` as const)} />
                </Field>
                <Field label="Href">
                  <TextInput placeholder="/work" {...form.register(`nav.links.${i}.href` as const)} />
                </Field>
              </div>
              <button
                type="button"
                onClick={() => navLinks.remove(i)}
                className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 transition shrink-0 mt-3"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Footer ── */}
      <SectionCard title="Footer" icon={<Footprints size={14} />}>
        <div className="grid gap-4 mb-6">
          <Field label="CTA Headline" hint="Big call-to-action text">
            <TextInput placeholder="Let's work together" {...form.register("footer.ctaHeadline")} />
          </Field>
          <Field label="CTA Sub-text">
            <Textarea rows={2} placeholder="A short line below the headline…" {...form.register("footer.ctaSubtext")} />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="CTA button label">
              <TextInput placeholder="Get in touch" {...form.register("footer.ctaButton.label")} />
            </Field>
            <Field label="CTA button link">
              <TextInput placeholder="/contact" {...form.register("footer.ctaButton.href")} />
            </Field>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 grid gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Footer links</label>
            <Button type="button" size="sm" onClick={() => footerLinks.append({ label: "", href: "" })}>
              <Plus size={12} className="mr-1" /> Add
            </Button>
          </div>
          {footerLinks.fields.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-400">No footer links yet.</p>
            </div>
          )}
          <div className="grid gap-2">
            {footerLinks.fields.map((f, i) => (
              <div key={f.id} className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
                <div className="flex-1 grid md:grid-cols-2 gap-3">
                  <Field label="Label">
                    <TextInput placeholder="Privacy" {...form.register(`footer.links.${i}.label` as const)} />
                  </Field>
                  <Field label="Href">
                    <TextInput placeholder="/privacy" {...form.register(`footer.links.${i}.href` as const)} />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={() => footerLinks.remove(i)}
                  className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 transition shrink-0 mt-3"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* ── Social Links ── */}
      <SectionCard
        title="Social Links"
        icon={<Share2 size={14} />}
        action={
          <Button type="button" size="sm" onClick={() => socialLinks.append({ platform: "instagram", href: "" })}>
            <Plus size={12} className="mr-1" /> Add
          </Button>
        }
      >
        {socialLinks.fields.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center">
            <p className="text-sm text-gray-400">No social links yet. Click Add to set up your profiles.</p>
          </div>
        )}
        <div className="grid gap-2">
          {socialLinks.fields.map((f, i) => (
            <div key={f.id} className="flex items-end gap-3 rounded-xl border border-gray-200 px-4 py-3">
              <Field label="Platform">
                <select
                  {...form.register(`footer.socialLinks.${i}.platform` as const)}
                  className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </Field>
              <div className="flex-1">
                <Field label="Profile URL">
                  <TextInput placeholder="https://instagram.com/yourhandle" {...form.register(`footer.socialLinks.${i}.href` as const)} />
                </Field>
              </div>
              <button
                type="button"
                onClick={() => socialLinks.remove(i)}
                className="w-8 h-9 flex items-center justify-center text-gray-300 hover:text-red-500 transition shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Copyright ── */}
      <SectionCard title="Copyright" icon={<Copyright size={14} />}>
        <Field label="Copyright text" hint="Use {year} for the current year">
          <TextInput placeholder="© {year} We Doing. All rights reserved." {...form.register("footer.copyright")} />
        </Field>
        <p className="text-xs text-gray-400 mt-2">
          Example: <code className="bg-gray-100 px-1 rounded">© {"{year}"} We Doing. All rights reserved.</code>
        </p>
      </SectionCard>

    </div>
  );
}
