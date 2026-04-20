"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BookingType =
  | { kind: "wishlist"; projectTitle: string }
  | { kind: "service"; serviceId: string; serviceTitle: string; serviceSubtitle: string; pricingOptions: { name: string; price: string }[] }
  | { kind: "inquiry" };

// ─── Small shared UI ──────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full border border-gray-200 rounded-xl px-3 h-11 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition placeholder:text-gray-300"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition placeholder:text-gray-300 resize-none"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className="w-full border border-gray-200 rounded-xl px-3 h-11 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition bg-white"
    />
  );
}

// ─── Form bodies per booking type ────────────────────────────────────────────

function WishlistForm({ projectTitle, fields, onChange }: {
  projectTitle: string;
  fields: Record<string, string>;
  onChange: (k: string, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{projectTitle}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Your Name *</Label>
          <Input placeholder="Ahmed Al Rashid" value={fields.name ?? ""} onChange={e => onChange("name", e.target.value)} required />
        </div>
        <div>
          <Label>Email *</Label>
          <Input type="email" placeholder="you@email.com" value={fields.email ?? ""} onChange={e => onChange("email", e.target.value)} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Project / Brand Name *</Label>
          <Input placeholder="e.g. Mist Café" value={fields.brandName ?? ""} onChange={e => onChange("brandName", e.target.value)} required />
        </div>
        <div>
          <Label>City / Location *</Label>
          <Input placeholder="e.g. Dubai, UAE" value={fields.location ?? ""} onChange={e => onChange("location", e.target.value)} required />
        </div>
      </div>
      <div>
        <Label>Tell me about the concept *</Label>
        <Textarea rows={4} placeholder="Describe your vision, the feeling you want to create, what makes this project different..." value={fields.concept ?? ""} onChange={e => onChange("concept", e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Budget Range</Label>
          <Select value={fields.budgetRange ?? ""} onChange={e => onChange("budgetRange", e.target.value)}>
            <option value="">Select range</option>
            <option value="$5k–$10k">$5k – $10k</option>
            <option value="$10k–$25k">$10k – $25k</option>
            <option value="$25k–$50k">$25k – $50k</option>
            <option value="$50k+">$50k+</option>
            <option value="Open to discuss">Open to discuss</option>
          </Select>
        </div>
        <div>
          <Label>Ideal Timeline</Label>
          <Select value={fields.timeline ?? ""} onChange={e => onChange("timeline", e.target.value)}>
            <option value="">Select timeline</option>
            <option value="ASAP">ASAP</option>
            <option value="1–3 months">1–3 months</option>
            <option value="3–6 months">3–6 months</option>
            <option value="6+ months">6+ months</option>
            <option value="Flexible">Flexible</option>
          </Select>
        </div>
      </div>
    </div>
  );
}

function BrandingForm({ pricingOptions, fields, onChange }: {
  pricingOptions: { name: string; price: string }[];
  fields: Record<string, string>;
  onChange: (k: string, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Your Name *</Label>
          <Input placeholder="Ahmed Al Rashid" value={fields.name ?? ""} onChange={e => onChange("name", e.target.value)} required />
        </div>
        <div>
          <Label>Email *</Label>
          <Input type="email" placeholder="you@email.com" value={fields.email ?? ""} onChange={e => onChange("email", e.target.value)} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Brand / Project Name *</Label>
          <Input placeholder="e.g. Volta" value={fields.brandName ?? ""} onChange={e => onChange("brandName", e.target.value)} required />
        </div>
        <div>
          <Label>Industry</Label>
          <Input placeholder="e.g. Food & Beverage" value={fields.industry ?? ""} onChange={e => onChange("industry", e.target.value)} />
        </div>
      </div>
      {pricingOptions.length > 0 && (
        <div>
          <Label>I&apos;m interested in</Label>
          <Select value={fields.selectedTier ?? ""} onChange={e => onChange("selectedTier", e.target.value)}>
            <option value="">Select a service tier</option>
            {pricingOptions.map(p => (
              <option key={p.name} value={p.name}>{p.name} — {p.price}</option>
            ))}
          </Select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Timeline</Label>
          <Select value={fields.timeline ?? ""} onChange={e => onChange("timeline", e.target.value)}>
            <option value="">Select timeline</option>
            <option value="Less than 1 month">Less than 1 month</option>
            <option value="1–3 months">1–3 months</option>
            <option value="3–6 months">3–6 months</option>
            <option value="6+ months">6+ months</option>
            <option value="Flexible">Flexible</option>
          </Select>
        </div>
        <div>
          <Label>Budget Range</Label>
          <Select value={fields.budgetRange ?? ""} onChange={e => onChange("budgetRange", e.target.value)}>
            <option value="">Select range</option>
            <option value="Under $2k">Under $2k</option>
            <option value="$2k–$5k">$2k – $5k</option>
            <option value="$5k–$10k">$5k – $10k</option>
            <option value="$10k+">$10k+</option>
          </Select>
        </div>
      </div>
      <div>
        <Label>Project Brief</Label>
        <Textarea rows={4} placeholder="Tell me about your project, what you're trying to achieve, and any context I should know..." value={fields.brief ?? ""} onChange={e => onChange("brief", e.target.value)} />
      </div>
    </div>
  );
}

function MeetForm({ fields, onChange }: { fields: Record<string, string>; onChange: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Your Name *</Label>
          <Input placeholder="Ahmed Al Rashid" value={fields.name ?? ""} onChange={e => onChange("name", e.target.value)} required />
        </div>
        <div>
          <Label>Email *</Label>
          <Input type="email" placeholder="you@email.com" value={fields.email ?? ""} onChange={e => onChange("email", e.target.value)} required />
        </div>
      </div>
      <div>
        <Label>Your role / background</Label>
        <Input placeholder="e.g. Junior Designer at Agency X" value={fields.background ?? ""} onChange={e => onChange("background", e.target.value)} />
      </div>
      <div>
        <Label>What do you need help with? *</Label>
        <Textarea rows={4} placeholder="Describe what you're working on, what's blocking you, or what you want to get better at..." value={fields.helpTopic ?? ""} onChange={e => onChange("helpTopic", e.target.value)} required />
      </div>
      <div>
        <Label>Preferred session frequency</Label>
        <Select value={fields.frequency ?? ""} onChange={e => onChange("frequency", e.target.value)}>
          <option value="">Select frequency</option>
          <option value="One-time session">One-time session</option>
          <option value="Bi-weekly">Bi-weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Open to discuss">Open to discuss</option>
        </Select>
      </div>
    </div>
  );
}

function AuditForm({ fields, onChange }: { fields: Record<string, string>; onChange: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Your Name *</Label>
          <Input placeholder="Ahmed Al Rashid" value={fields.name ?? ""} onChange={e => onChange("name", e.target.value)} required />
        </div>
        <div>
          <Label>Email *</Label>
          <Input type="email" placeholder="you@email.com" value={fields.email ?? ""} onChange={e => onChange("email", e.target.value)} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Brand / Company Name *</Label>
          <Input placeholder="e.g. Volta" value={fields.brandName ?? ""} onChange={e => onChange("brandName", e.target.value)} required />
        </div>
        <div>
          <Label>Website or Socials</Label>
          <Input placeholder="https://" value={fields.website ?? ""} onChange={e => onChange("website", e.target.value)} />
        </div>
      </div>
      <div>
        <Label>What&apos;s not working with your current brand?</Label>
        <Textarea rows={3} placeholder="Describe what feels off — visually, strategically, or both..." value={fields.issues ?? ""} onChange={e => onChange("issues", e.target.value)} />
      </div>
      <div>
        <Label>What outcome are you hoping for?</Label>
        <Textarea rows={3} placeholder="What does success look like after this audit?" value={fields.goals ?? ""} onChange={e => onChange("goals", e.target.value)} />
      </div>
    </div>
  );
}

function TrainingForm({ pricingOptions, fields, onChange }: {
  pricingOptions: { name: string; price: string }[];
  fields: Record<string, string>;
  onChange: (k: string, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Your Name *</Label>
          <Input placeholder="Ahmed Al Rashid" value={fields.name ?? ""} onChange={e => onChange("name", e.target.value)} required />
        </div>
        <div>
          <Label>Email *</Label>
          <Input type="email" placeholder="you@email.com" value={fields.email ?? ""} onChange={e => onChange("email", e.target.value)} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Company / Organisation *</Label>
          <Input placeholder="e.g. Studio XYZ" value={fields.companyName ?? ""} onChange={e => onChange("companyName", e.target.value)} required />
        </div>
        <div>
          <Label>Team Size</Label>
          <Select value={fields.teamSize ?? ""} onChange={e => onChange("teamSize", e.target.value)}>
            <option value="">Select size</option>
            <option value="1–5">1–5 people</option>
            <option value="6–15">6–15 people</option>
            <option value="16–30">16–30 people</option>
            <option value="30+">30+ people</option>
          </Select>
        </div>
      </div>
      {pricingOptions.length > 0 && (
        <div>
          <Label>Workshop format</Label>
          <Select value={fields.selectedTier ?? ""} onChange={e => onChange("selectedTier", e.target.value)}>
            <option value="">Select a format</option>
            {pricingOptions.map(p => (
              <option key={p.name} value={p.name}>{p.name} — {p.price}</option>
            ))}
          </Select>
        </div>
      )}
      <div>
        <Label>Preferred delivery</Label>
        <Select value={fields.format ?? ""} onChange={e => onChange("format", e.target.value)}>
          <option value="">Select</option>
          <option value="In-person">In-person</option>
          <option value="Online">Online</option>
          <option value="Hybrid">Hybrid</option>
        </Select>
      </div>
      <div>
        <Label>What topic(s) should we cover?</Label>
        <Textarea rows={3} placeholder="e.g. Brand strategy, visual identity systems, tone of voice..." value={fields.workshopTopic ?? ""} onChange={e => onChange("workshopTopic", e.target.value)} />
      </div>
    </div>
  );
}

function InquiryForm({ fields, onChange }: { fields: Record<string, string>; onChange: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Your Name *</Label>
          <Input placeholder="Ahmed Al Rashid" value={fields.name ?? ""} onChange={e => onChange("name", e.target.value)} required />
        </div>
        <div>
          <Label>Email *</Label>
          <Input type="email" placeholder="you@email.com" value={fields.email ?? ""} onChange={e => onChange("email", e.target.value)} required />
        </div>
      </div>
      <div>
        <Label>Subject</Label>
        <Input placeholder="What's on your mind?" value={fields.subject ?? ""} onChange={e => onChange("subject", e.target.value)} />
      </div>
      <div>
        <Label>Message *</Label>
        <Textarea rows={5} placeholder="Tell me anything..." value={fields.message ?? ""} onChange={e => onChange("message", e.target.value)} required />
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function BookingModal({ booking, onClose }: { booking: BookingType | null; onClose: () => void }) {
  const [fields, setFields] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function handleChange(key: string, value: string) {
    setFields(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!booking) return;
    setStatus("sending");

    const payload: Record<string, unknown> = {
      ...fields,
      type: booking.kind === "service" ? (booking.serviceId ?? "service") : booking.kind,
    };
    if (booking.kind === "service") {
      payload.serviceId = booking.serviceId;
      payload.serviceTitle = booking.serviceTitle;
    }
    if (booking.kind === "wishlist") {
      payload.projectTitle = booking.projectTitle;
    }

    try {
      const res = await fetch("/api/public/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function getTitle() {
    if (!booking) return "";
    if (booking.kind === "wishlist") return `Book — ${booking.projectTitle}`;
    if (booking.kind === "inquiry") return "General Inquiry";
    return `Book — ${booking.serviceTitle}`;
  }

  function renderForm() {
    if (!booking) return null;
    if (booking.kind === "wishlist") return <WishlistForm projectTitle={booking.projectTitle} fields={fields} onChange={handleChange} />;
    if (booking.kind === "inquiry") return <InquiryForm fields={fields} onChange={handleChange} />;
    if (booking.kind === "service") {
      const id = booking.serviceId;
      if (id === "branding") return <BrandingForm pricingOptions={booking.pricingOptions} fields={fields} onChange={handleChange} />;
      if (id === "11-meet") return <MeetForm fields={fields} onChange={handleChange} />;
      if (id === "brand-audit") return <AuditForm fields={fields} onChange={handleChange} />;
      if (id === "team-training") return <TrainingForm pricingOptions={booking.pricingOptions} fields={fields} onChange={handleChange} />;
      // Generic service fallback
      return <BrandingForm pricingOptions={booking.pricingOptions} fields={fields} onChange={handleChange} />;
    }
    return null;
  }

  return (
    <AnimatePresence>
      {booking && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed inset-x-4 top-[5vh] bottom-[5vh] max-w-xl mx-auto bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
              <h2 className="text-base font-bold tracking-tight text-gray-900">{getTitle()}</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-black">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-7 h-7">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 tracking-tight">Message received.</p>
                    <p className="text-sm text-gray-500 mt-1">I&apos;ll get back to you as soon as I can.</p>
                  </div>
                  <button onClick={onClose} className="mt-4 px-6 py-2.5 rounded-full border border-gray-200 text-sm font-semibold hover:bg-gray-900 hover:text-white hover:border-gray-900 transition">
                    Close
                  </button>
                </div>
              ) : (
                <form id="booking-form" onSubmit={handleSubmit}>
                  {renderForm()}
                  {status === "error" && (
                    <p className="text-sm text-red-600 mt-4">Something went wrong. Please try again.</p>
                  )}
                </form>
              )}
            </div>

            {/* Footer */}
            {status !== "sent" && (
              <div className="px-6 py-4 border-t border-gray-100 shrink-0">
                <button
                  form="booking-form"
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full h-12 bg-black text-white rounded-full font-semibold text-sm hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {status === "sending" ? "Sending..." : "Send Request"}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
