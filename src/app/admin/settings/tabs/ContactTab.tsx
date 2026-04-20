"use client";
import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray, useWatch } from "react-hook-form";
import type { SiteSettings } from "../schema";
import { TextInput, Textarea, Button, Checkbox } from "../ui/Inputs";
import {
  Plus, Trash2, ChevronUp, ChevronDown,
  Eye, EyeOff, GripVertical,
} from "lucide-react";

// ─── Shared Card ─────────────────────────────────────────────────────────────

function SectionCard({
  title, action, children, hint,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
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

// ─── Default data ─────────────────────────────────────────────────────────────

export const DEFAULT_WISHLIST = [
  {
    id: "cafe-shop",
    title: "Café Shop",
    subtitle: "The kind of café I'd fly for",
    brief: "A café that doesn't look like a café. We're looking for founders who understand that a coffee experience is a brand experience — from the name on the cup to the story on the wall.",
    criteria: [
      "You have a location and a strong concept",
      "Open budget for identity & spatial branding",
      "Timeline of 3+ months",
      "You want someone who shows up in person",
    ],
    fulfilled: false,
    visible: true,
  },
  {
    id: "concept-restaurant",
    title: "Concept Restaurant",
    subtitle: "Food that deserves a narrative",
    brief: "If you're launching a restaurant that's more than a menu — with a concept, a culture, and a customer worth designing for — we should talk. The brief writes itself when the idea is strong.",
    criteria: [
      "Strong concept, not just a cuisine",
      "Willing to invest in a full brand system",
      "Open to creative direction on naming & identity",
      "Ready to move within 2026",
    ],
    fulfilled: false,
    visible: true,
  },
  {
    id: "esports-team",
    title: "E-Sports Team",
    subtitle: "Competitive gaming needs competitive branding",
    brief: "We're looking for an org ready to invest in an identity that holds up on merch, streams, and the main stage. If your team is serious about competing, your brand should be too.",
    criteria: [
      "Established roster or active competitive season",
      "Budget for a full visual identity system",
      "Merch, social, and stage-ready deliverables in scope",
      "Founder who sees brand as a long-term asset",
    ],
    fulfilled: false,
    visible: true,
  },
  {
    id: "fintech",
    title: "Fintech Solution",
    subtitle: "Financial trust is built, not assumed",
    brief: "If you're building a fintech product that wants to feel different — cleaner, bolder, more human — we want to be part of it. The best financial brands don't look financial at all.",
    criteria: [
      "Product in active development or pre-launch",
      "Budget for brand strategy + visual identity",
      "Open to bold, unconventional positioning",
      "Founder with a clear market vision",
    ],
    fulfilled: false,
    visible: true,
  },
];

export const DEFAULT_SERVICES = [
  {
    id: "branding",
    title: "Branding",
    subtitle: "Full Identity Systems",
    description: "Choose what you need — from strategy to full identity systems.",
    pricing: [
      { name: "Full Brand Identity System", price: "$4,000+" },
      { name: "Brand Strategy", price: "$2,500+" },
      { name: "Visual Identity", price: "$2,000+" },
      { name: "Brand Naming", price: "$1,000" },
      { name: "Logo Only (Side Hustle)", price: "$1,000" },
      { name: "Identity Facelift", price: "$1,500+" },
    ],
    bookingFields: [],
    visible: true,
    order: 0,
  },
  {
    id: "11-meet",
    title: "1/1 Meet",
    subtitle: "Creative Mentorship",
    description: "One-on-one sessions for designers and founders who want to sharpen their brand thinking.",
    pricing: [
      { name: "Single Session (90 min)", price: "$300" },
      { name: "Monthly Retainer (4 sessions)", price: "$900" },
    ],
    bookingFields: [],
    visible: true,
    order: 1,
  },
  {
    id: "brand-audit",
    title: "Brand Audit",
    subtitle: "Strategy Review",
    description: "A thorough review of your existing brand — what's working, what's not, and what to do about it.",
    pricing: [
      { name: "Full Brand Audit", price: "$1,200" },
      { name: "Quick Review (48h turnaround)", price: "$500" },
    ],
    bookingFields: [],
    visible: true,
    order: 2,
  },
  {
    id: "team-training",
    title: "Team Training",
    subtitle: "Brand Workshops",
    description: "Interactive workshops for in-house teams who want to think and work with brand clarity.",
    pricing: [
      { name: "Half-Day Workshop", price: "$1,500" },
      { name: "Full-Day Workshop", price: "$2,500" },
      { name: "Series (3 sessions)", price: "$4,000" },
    ],
    bookingFields: [],
    visible: true,
    order: 3,
  },
];

// ─── Wishlist Row ─────────────────────────────────────────────────────────────

function WishlistRow({
  index, total, form, onMoveUp, onMoveDown, onRemove,
}: {
  index: number;
  total: number;
  form: UseFormReturn<SiteSettings>;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const title = useWatch({ control: form.control, name: `contact.wishlistProjects.${index}.title` as const }) ?? `Project ${index + 1}`;
  const fulfilled = useWatch({ control: form.control, name: `contact.wishlistProjects.${index}.fulfilled` as const }) ?? false;
  const visible = useWatch({ control: form.control, name: `contact.wishlistProjects.${index}.visible` as const }) ?? true;
  const criteria = useFieldArray({ control: form.control, name: `contact.wishlistProjects.${index}.criteria` as never });

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Row header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 cursor-pointer" onClick={() => setOpen(v => !v)}>
        <GripVertical size={14} className="text-gray-300 shrink-0" />
        <span className="flex-1 text-sm font-semibold text-gray-800 truncate">{title || `Project ${index + 1}`}</span>
        {fulfilled && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">Fulfilled</span>
        )}
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button type="button" disabled={index === 0} onClick={onMoveUp} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30">
            <ChevronUp size={13} />
          </button>
          <button type="button" disabled={index === total - 1} onClick={onMoveDown} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30">
            <ChevronDown size={13} />
          </button>
          <button type="button" onClick={onRemove} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
            <Trash2 size={13} />
          </button>
        </div>
        <span className="text-gray-400 text-xs ml-1">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className="p-4 space-y-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Title">
              <TextInput placeholder="Café Shop" {...form.register(`contact.wishlistProjects.${index}.title`)} />
            </Field>
            <Field label="Subtitle">
              <TextInput placeholder="The kind of café I'd fly for" {...form.register(`contact.wishlistProjects.${index}.subtitle`)} />
            </Field>
          </div>
          <Field label="Brief (invitation copy)">
            <Textarea rows={3} placeholder="Describe the project in an inviting tone..." {...form.register(`contact.wishlistProjects.${index}.brief`)} className="min-h-[80px]" />
          </Field>

          {/* Criteria */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Criteria</label>
              <Button size="sm" type="button" onClick={() => criteria.append("" as never)}>
                <Plus size={12} className="mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {criteria.fields.map((f, ci) => (
                <div key={f.id} className="flex gap-2 items-center">
                  <TextInput
                    placeholder={`Criterion ${ci + 1}`}
                    {...form.register(`contact.wishlistProjects.${index}.criteria.${ci}` as never)}
                  />
                  <button type="button" onClick={() => criteria.remove(ci)} className="shrink-0 text-gray-400 hover:text-red-500 p-1">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Fulfilled toggle */}
          <div className="flex items-center gap-3 pt-1">
            <Checkbox
              id={`wishlist-fulfilled-${index}`}
              checked={!!fulfilled}
              onChange={(v) => form.setValue(`contact.wishlistProjects.${index}.fulfilled`, v)}
              label="Mark as Fulfilled"
              description="Shows a 'Fulfilled' badge on the card"
            />
            <Checkbox
              id={`wishlist-visible-${index}`}
              checked={!!visible}
              onChange={(v) => form.setValue(`contact.wishlistProjects.${index}.visible`, v)}
              label="Visible"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Service Row ─────────────────────────────────────────────────────────────

function ServiceRow({
  index, total, form, onMoveUp, onMoveDown, onRemove,
}: {
  index: number;
  total: number;
  form: UseFormReturn<SiteSettings>;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const title = useWatch({ control: form.control, name: `contact.services.${index}.title` as const }) ?? `Service ${index + 1}`;
  const svcVisible = useWatch({ control: form.control, name: `contact.services.${index}.visible` as const }) ?? true;
  const pricing = useFieldArray({ control: form.control, name: `contact.services.${index}.pricing` as never });

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 cursor-pointer" onClick={() => setOpen(v => !v)}>
        <GripVertical size={14} className="text-gray-300 shrink-0" />
        <span className="flex-1 text-sm font-semibold text-gray-800 truncate">{title || `Service ${index + 1}`}</span>
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button type="button" disabled={index === 0} onClick={onMoveUp} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30">
            <ChevronUp size={13} />
          </button>
          <button type="button" disabled={index === total - 1} onClick={onMoveDown} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30">
            <ChevronDown size={13} />
          </button>
          <button type="button" onClick={onRemove} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
            <Trash2 size={13} />
          </button>
        </div>
        <span className="text-gray-400 text-xs ml-1">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className="p-4 space-y-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Title">
              <TextInput placeholder="Branding" {...form.register(`contact.services.${index}.title`)} />
            </Field>
            <Field label="Subtitle">
              <TextInput placeholder="Full Identity Systems" {...form.register(`contact.services.${index}.subtitle`)} />
            </Field>
          </div>
          <Field label="Description">
            <Textarea rows={2} placeholder="Short description of the service..." {...form.register(`contact.services.${index}.description`)} className="min-h-[60px]" />
          </Field>

          {/* Pricing tiers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pricing Tiers</label>
              <Button size="sm" type="button" onClick={() => pricing.append({ name: "", price: "" } as never)}>
                <Plus size={12} className="mr-1" /> Add tier
              </Button>
            </div>
            <div className="space-y-2">
              {pricing.fields.map((f, pi) => (
                <div key={f.id} className="flex gap-2 items-center">
                  <TextInput
                    placeholder="Service name"
                    {...form.register(`contact.services.${index}.pricing.${pi}.name` as never)}
                  />
                  <TextInput
                    placeholder="$2,500+"
                    className="w-28"
                    {...form.register(`contact.services.${index}.pricing.${pi}.price` as never)}
                  />
                  <button type="button" onClick={() => pricing.remove(pi)} className="shrink-0 text-gray-400 hover:text-red-500 p-1">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Checkbox
            id={`service-visible-${index}`}
            checked={!!svcVisible}
            onChange={(v) => form.setValue(`contact.services.${index}.visible`, v)}
            label="Visible"
          />
        </div>
      )}
    </div>
  );
}

// ─── Section Order Row ────────────────────────────────────────────────────────

const CONTACT_SECTION_LABELS: Record<string, string> = {
  wishlist: "2026 Wishlist",
  services: "My Services",
  inquiry: "General Inquiry",
};

function ContactSectionRow({
  index, total, form, onMoveUp, onMoveDown,
}: {
  index: number;
  total: number;
  form: UseFormReturn<SiteSettings>;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const watchedId      = useWatch({ control: form.control, name: `contact.sections.${index}.id`      as const });
  const watchedVisible = useWatch({ control: form.control, name: `contact.sections.${index}.visible` as const });

  return (
    <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
      <GripVertical size={14} className="text-gray-300" />
      <span className="flex-1 text-sm font-medium text-gray-700">
        {CONTACT_SECTION_LABELS[watchedId as string] ?? watchedId}
      </span>
      <div className="flex items-center gap-1">
        <button type="button" disabled={index === 0} onClick={onMoveUp} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30">
          <ChevronUp size={13} />
        </button>
        <button type="button" disabled={index >= total - 1} onClick={onMoveDown} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30">
          <ChevronDown size={13} />
        </button>
      </div>
      <button
        type="button"
        onClick={() => form.setValue(`contact.sections.${index}.visible`, !watchedVisible)}
        className={`p-1.5 rounded-lg transition ${watchedVisible ? "text-black bg-gray-100" : "text-gray-300"}`}
      >
        {watchedVisible ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────

export function ContactTab({ form }: { form: UseFormReturn<SiteSettings> }) {
  const wishlist = useFieldArray({ control: form.control, name: "contact.wishlistProjects" });
  const services = useFieldArray({ control: form.control, name: "contact.services" });
  const sections = useFieldArray({ control: form.control, name: "contact.sections" });

  function moveSectionUp(i: number) {
    if (i === 0) return;
    sections.fields.forEach((_, idx) => form.setValue(`contact.sections.${idx}.order`, idx));
    sections.swap(i, i - 1);
  }
  function moveSectionDown(i: number) {
    if (i >= sections.fields.length - 1) return;
    sections.fields.forEach((_, idx) => form.setValue(`contact.sections.${idx}.order`, idx));
    sections.swap(i, i + 1);
  }

  function moveWishlistUp(i: number) {
    if (i === 0) return;
    wishlist.swap(i, i - 1);
  }
  function moveWishlistDown(i: number) {
    if (i >= wishlist.fields.length - 1) return;
    wishlist.swap(i, i + 1);
  }

  function moveServiceUp(i: number) {
    if (i === 0) return;
    services.swap(i, i - 1);
  }
  function moveServiceDown(i: number) {
    if (i >= services.fields.length - 1) return;
    services.swap(i, i + 1);
  }

  return (
    <div className="space-y-6">

      {/* ── Section Visibility & Order ── */}
      <SectionCard title="Page Sections" hint="Toggle visibility and reorder sections on the contact page">
        <div className="space-y-2">
          {sections.fields.map((field, i) => (
            <ContactSectionRow
              key={field.id}
              index={i}
              total={sections.fields.length}
              form={form}
              onMoveUp={() => moveSectionUp(i)}
              onMoveDown={() => moveSectionDown(i)}
            />
          ))}
        </div>
      </SectionCard>

      {/* ── Wishlist ── */}
      <SectionCard
        title="2026 Wishlist"
        hint="Dream projects open for booking"
        action={
          <div className="flex gap-2">
            {wishlist.fields.length === 0 && (
              <Button size="sm" type="button" onClick={() => wishlist.replace(DEFAULT_WISHLIST as never)}>
                Load defaults
              </Button>
            )}
            <Button size="sm" type="button" onClick={() => wishlist.append({
              id: `project-${Date.now()}`,
              title: "",
              subtitle: "",
              brief: "",
              criteria: [],
              fulfilled: false,
              visible: true,
            } as never)}>
              <Plus size={13} className="mr-1" /> Add Project
            </Button>
          </div>
        }
      >
        <div className="space-y-3 mb-4">
          <Field label="Section Title">
            <TextInput placeholder="2026 Wishlist" {...form.register("contact.wishlistTitle")} />
          </Field>
          <Field label="Section Subtitle (optional)">
            <TextInput placeholder="Dream projects I'm actively seeking..." {...form.register("contact.wishlistSubtitle")} />
          </Field>
        </div>

        {wishlist.fields.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No wishlist projects yet. Click &quot;Load defaults&quot; to start with 4 pre-written project cards.</p>
        ) : (
          <div className="space-y-3">
            {wishlist.fields.map((f, i) => (
              <WishlistRow
                key={f.id}
                index={i}
                total={wishlist.fields.length}
                form={form}
                onMoveUp={() => moveWishlistUp(i)}
                onMoveDown={() => moveWishlistDown(i)}
                onRemove={() => wishlist.remove(i)}
              />
            ))}
          </div>
        )}
      </SectionCard>

      {/* ── Services ── */}
      <SectionCard
        title="My Services"
        hint="Service cards with pricing and booking"
        action={
          <div className="flex gap-2">
            {services.fields.length === 0 && (
              <Button size="sm" type="button" onClick={() => services.replace(DEFAULT_SERVICES as never)}>
                Load defaults
              </Button>
            )}
            <Button size="sm" type="button" onClick={() => services.append({
              id: `service-${Date.now()}`,
              title: "",
              subtitle: "",
              description: "",
              pricing: [],
              bookingFields: [],
              visible: true,
              order: services.fields.length,
            } as never)}>
              <Plus size={13} className="mr-1" /> Add Service
            </Button>
          </div>
        }
      >
        <div className="space-y-2 mb-4">
          <Field label="Section Title">
            <TextInput placeholder="My Services" {...form.register("contact.servicesTitle")} />
          </Field>
        </div>

        {services.fields.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No services yet. Click &quot;Load defaults&quot; to add the standard service cards.</p>
        ) : (
          <div className="space-y-3">
            {services.fields.map((f, i) => (
              <ServiceRow
                key={f.id}
                index={i}
                total={services.fields.length}
                form={form}
                onMoveUp={() => moveServiceUp(i)}
                onMoveDown={() => moveServiceDown(i)}
                onRemove={() => services.remove(i)}
              />
            ))}
          </div>
        )}
      </SectionCard>

      {/* ── Inquiry ── */}
      <SectionCard title="General Inquiry" hint="Email contact form at the bottom of the page">
        <Field label="Section Title">
          <TextInput placeholder="General Inquiry" {...form.register("contact.inquiryTitle")} />
        </Field>
      </SectionCard>
    </div>
  );
}
