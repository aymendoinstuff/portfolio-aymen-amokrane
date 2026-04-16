/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMemo, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import { Btn, Field, Input, Select } from "@/components/public/common/ui";
import { X } from "lucide-react";
import {
  PROPOSED_PROJECTS,
  PROJECT_REQUIREMENTS,
  PROJECT_TAGS,
  PriorityKey,
} from "@/lib/data/contact";

// ----------------------
// Types matching the API schema (client-side)
// ----------------------
type OfferKind = "collab" | "job";

type OfferPayloadBase = {
  kind: OfferKind;
  name: string;
  email: string;
  projectName: string;
  industry: string;
  budget: string;
  timeline: string;
  country: string;
  projectType: string;
  brief: string;
};

type CollabPayload = OfferPayloadBase & {
  kind: "collab";
  priorityKey?: "cafe" | "esports" | "fintech" | "event" | "logistics";
};

type JobPayload = OfferPayloadBase & {
  kind: "job";
  priorityKey?: never;
};

type OfferPayload = CollabPayload | JobPayload;

type ApiOk = { id: string; status: "ok" };
type ApiErr = { error: string } | { error: string; issues?: unknown };

// ----------------------
// Styles
// ----------------------
const BORDER = "border-2 border-black";
const CARD = `${BORDER} rounded-2xl`;
const PILL = `${BORDER} rounded-full`;

// ----------------------
// Helpers
// ----------------------
async function postOffer(payload: OfferPayload): Promise<ApiOk> {
  const res = await fetch("/api/public/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = (await res.json()) as ApiOk | ApiErr;

  if (!res.ok || "error" in json) {
    const message =
      "error" in json
        ? typeof json.error === "string"
          ? json.error
          : "Invalid payload"
        : "Failed to submit";
    throw new Error(message);
  }
  return json;
}

function getStr(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

// ----------------------
// UI primitives
// ----------------------
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className={`${CARD} p-3`}>
      <div className="uppercase text-[10px] opacity-70">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
      <div className={`bg-white w-full max-w-2xl ${CARD} overflow-hidden`}>
        <div className="px-5 py-4 bg-black text-white flex items-center justify-between">
          <div className="font-medium">{title}</div>
          <button
            onClick={onClose}
            className={`${PILL} px-2 py-1 border-white`}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5 text-sm grid gap-4">{children}</div>
      </div>
    </div>
  );
}

function CenteredSection({ children }: { children: React.ReactNode }) {
  return <section className="mx-auto max-w-6xl px-4">{children}</section>;
}

// ----------------------
// Priority UI
// ----------------------
function PillTab({
  label,
  keywords,
  onClick,
}: {
  label: string;
  keywords: string[];
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${PILL} text-center transition hover:bg-black hover:text-white w-64 h-24 flex flex-col items-center justify-center`}
    >
      <div className="text-lg font-semibold uppercase tracking-[0.12em]">
        {label}
      </div>
      <div className="mt-2 text-xs opacity-80 text-balance">
        {keywords.join(" • ")}
      </div>
    </button>
  );
}

function PriorityTabs({ onOpen }: { onOpen: (k: PriorityKey) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 w-full max-w-[980px] mx-auto">
      {PROPOSED_PROJECTS.map((p) => (
        <PillTab
          key={p.key}
          label={p.label}
          keywords={PROJECT_TAGS[p.key]}
          onClick={() => onOpen(p.key)}
        />
      ))}
    </div>
  );
}

// ----------------------
// Collab modal (collects name/email; other fields come from PROJECT_REQUIREMENTS)
// ----------------------
function RequirementModal({
  open,
  onClose,
}: {
  open: PriorityKey | null;
  onClose: () => void;
}) {
  const data = useMemo(
    () => (open ? PROJECT_REQUIREMENTS[open] : null),
    [open]
  );
  const title = useMemo(
    () => PROPOSED_PROJECTS.find((p) => p.key === open)?.label ?? "",
    [open]
  );

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  const fieldInput = `${CARD} px-3 py-2 w-full`;

  if (!open || !data) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);

    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const name = getStr(form, "name").trim();
    const email = getStr(form, "email").trim();
    if (!name || !email) {
      setMsg({ type: "err", text: "Please add your name and email." });
      return;
    }

    // Map PROJECT_REQUIREMENTS to all required schema fields
    const payload: CollabPayload = {
      kind: "collab",
      priorityKey: (open as CollabPayload["priorityKey"]) ?? undefined,
      name,
      email,
      projectName:
        PROPOSED_PROJECTS.find((p) => p.key === open)?.label ??
        "Priority Project",
      industry: data?.industryDefault || "General",
      projectType: data?.projectTypeDefault || "Branding",

      // ↓ guarantee strings
      budget: data?.budget ?? "TBD",
      timeline: data?.timeline ?? "TBD",
      country: data?.country ?? "TBD",
      brief: data?.scope ?? "",
    };

    try {
      setLoading(true);
      await postOffer(payload);
      setMsg({
        type: "ok",
        text: "Thanks! Your collab request was submitted successfully.",
      });
      formEl.reset();
    } catch (err) {
      const text =
        err instanceof Error
          ? err.message
          : "Failed to submit. Please try again.";
      setMsg({ type: "err", text });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title={`${title} — Requirements`} onClose={onClose}>
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard label="timeline" value={data.timeline} />
        <StatCard label="budget" value={data.budget} />
        <StatCard label="country" value={data.country} />
      </div>
      <div>
        <div className="uppercase text-[10px] opacity-70">Scope</div>
        <p className="mt-1">{data.scope}</p>
      </div>

      <form className="grid md:grid-cols-2 gap-3 mt-3" onSubmit={onSubmit}>
        <label className="grid gap-1">
          <span className="text-xs uppercase opacity-70">Name</span>
          <Input
            name="name"
            className={fieldInput}
            placeholder="Full name"
            required
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs uppercase opacity-70">Email</span>
          <Input
            name="email"
            className={fieldInput}
            placeholder="name@email.com"
            type="email"
            required
          />
        </label>

        {msg && (
          <div className="md:col-span-2">
            <div
              className={`${CARD} px-4 py-3 text-sm ${
                msg.type === "ok" ? "bg-green-50" : "bg-red-50"
              }`}
            >
              {msg.text}
            </div>
          </div>
        )}

        <div className="md:col-span-2 flex justify-end gap-2">
          <Btn
            type="button"
            onClick={onClose}
            className={`${PILL} px-4 py-2 text-sm`}
          >
            Close
          </Btn>
          <Btn
            type="submit"
            className={`${PILL} px-4 py-2 text-sm`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Start this project"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}

// ----------------------
// Job Inquiry (all required to satisfy schema)
// ----------------------
function InquiryForm() {
  const fieldInput = `${CARD} px-3 py-2 w-full`;
  const fieldSelect = `${CARD} px-3 py-2 w-full bg-white`;
  const fieldTextArea = `${CARD} px-3 py-2 min-h-[140px] w-full`;

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setMsg(null);
    const form = new FormData(formEl);

    const payload: JobPayload = {
      kind: "job",
      name: getStr(form, "name").trim(),
      email: getStr(form, "email").trim(),
      projectName: getStr(form, "projectName").trim(),
      industry: getStr(form, "industry").trim(),
      budget: getStr(form, "budget").trim(),
      timeline: getStr(form, "timeline").trim(),
      country: getStr(form, "country").trim(),
      projectType: getStr(form, "projectType").trim(),
      brief: getStr(form, "brief").trim(),
    };

    try {
      setLoading(true);
      await postOffer(payload);
      setMsg({
        type: "ok",
        text: "Thanks! Your job offer was submitted successfully.",
      });
      formEl.reset();
    } catch (err) {
      const text =
        err instanceof Error
          ? err.message
          : "Failed to submit. Please try again.";
      setMsg({ type: "err", text });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="grid md:grid-cols-2 gap-4 w-full max-w-2xl"
      onSubmit={onSubmit}
    >
      <Field label="Your name">
        <Input
          className={fieldInput}
          placeholder="Full name"
          name="name"
          required
        />
      </Field>
      <Field label="Email">
        <Input
          className={fieldInput}
          placeholder="name@email.com"
          name="email"
          type="email"
          required
        />
      </Field>
      <Field className="md:col-span-2" label="Project name">
        <Input
          className={fieldInput}
          placeholder="e.g., Glowz"
          name="projectName"
          required
        />
      </Field>
      <Field label="Industry">
        <Input
          className={fieldInput}
          placeholder="e.g., Beauty / F&B"
          name="industry"
          required
        />
      </Field>
      <Field label="Budget (USD)">
        <Select
          className={fieldSelect}
          name="budget"
          defaultValue="5k-8k"
          required
        >
          <option value="5k-8k">5k-8k</option>
          <option value="8k-12k">8k-12k</option>
          <option value="12k-20k">12k-20k</option>
          <option value="20k+">20k+</option>
        </Select>
      </Field>
      <Field label="Timeline">
        <Select
          className={fieldSelect}
          name="timeline"
          defaultValue="4-6 weeks"
          required
        >
          <option value="4-6 weeks">4-6 weeks</option>
          <option value="6-8 weeks">6-8 weeks</option>
          <option value="8-12 weeks">8-12 weeks</option>
          <option value="Flexible">Flexible</option>
        </Select>
      </Field>
      <Field label="Country">
        <Input
          className={fieldInput}
          placeholder="e.g., UAE"
          name="country"
          required
        />
      </Field>
      <Field className="md:col-span-2" label="Project type">
        <Select
          className={fieldSelect}
          name="projectType"
          defaultValue="Branding"
          required
        >
          <option value="Branding">Branding</option>
          <option value="Strategy">Strategy</option>
          <option value="Illustration">Illustration</option>
          <option value="Systems">Systems</option>
          <option value="Logos">Logos</option>
        </Select>
      </Field>
      <Field className="md:col-span-2" label="Brief">
        <textarea
          className={fieldTextArea}
          placeholder="Give me a quick brief."
          name="brief"
          required
        />
      </Field>

      {msg && (
        <div className="md:col-span-2">
          <div
            className={`${CARD} px-4 py-3 text-sm ${
              msg.type === "ok" ? "bg-green-50" : "bg-red-50"
            }`}
          >
            {msg.text}
          </div>
        </div>
      )}

      <div className="md:col-span-2 flex justify-center">
        <Btn
          type="submit"
          className={`${PILL} px-5 py-2 text-sm`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send inquiry"}
        </Btn>
      </div>
    </form>
  );
}

// ----------------------
// Page
// ----------------------
export default function ContactPage() {
  const [open, setOpen] = useState<PriorityKey | null>(null);

  return (
    <main className="py-12">
      <CenteredSection>
        <SectionTitle>Priority Projects</SectionTitle>
        <p className="mt-4 mb-8 text-sm opacity-80 text-center">
          Pre-defined scope with clear timelines & budgets. Pick one to see
          requirements.
        </p>

        <div className="flex justify-center">
          <PriorityTabs onOpen={setOpen} />
        </div>
        <RequirementModal open={open} onClose={() => setOpen(null)} />

        <div className="my-12 mx-auto h-0 w-full max-w-6xl border-t-2 border-black" />

        <SectionTitle>Project Inquiry</SectionTitle>
        <div className="mt-4 flex justify-center">
          <InquiryForm />
        </div>
      </CenteredSection>
    </main>
  );
}
