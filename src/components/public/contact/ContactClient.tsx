"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, CheckCircle2, ArrowRight } from "lucide-react";
import type { SiteSettings } from "@/app/admin/settings/schema";
import { BookingModal, type BookingType } from "./BookingModal";
import AvailabilityWidget from "./AvailabilityWidget";
import ScrollReveal from "@/components/ScrollReveal";

// ─── Shared button classes ────────────────────────────────────────────────────
// Primary (dark fill, pill)
const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50";
// Primary full-width (for inside cards)
const BTN_PRIMARY_FULL =
  "w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50";
// Secondary outline (pill)
const BTN_OUTLINE =
  "inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-900 text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-900 hover:text-white transition-colors";

// ─── Wishlist ─────────────────────────────────────────────────────────────────

const GOLD_BORDER = "border-[#E8D5A3]";
const GOLD_TEXT   = "text-[#9A7A2E]";
const GOLD_LIGHT  = "#FDF6E3";
const GOLD_MID    = "#F0DFB0";

function WishlistSection({
  title,
  subtitle,
  projects,
  locked,
  onBook,
}: {
  title: string;
  subtitle?: string;
  projects: SiteSettings["contact"]["wishlistProjects"];
  locked?: boolean;
  onBook: (b: BookingType) => void;
}) {
  const visible = projects.filter((p) => p.visible);
  const [discovered, setDiscovered] = useState(false);
  // Accordion: only one card open at a time
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const openCount      = visible.filter((p) => !p.fulfilled).length;
  const fulfilledCount = visible.filter((p) => p.fulfilled).length;

  const hasProjects = !locked && visible.length > 0;

  function toggleCard(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
      <div className="grid md:grid-cols-[3fr_2fr] gap-6 items-start">

        {/* ── Single golden card ── */}
        <div
          className={`rounded-3xl border ${GOLD_BORDER} overflow-hidden`}
          style={{ background: `linear-gradient(160deg, ${GOLD_LIGHT} 0%, ${GOLD_MID} 100%)` }}
        >
          <AnimatePresence mode="wait" initial={false}>

            {/* ── COVER: locked or pre-discover ── */}
            {(!hasProjects || !discovered) && (
              <motion.div
                key="cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center text-center px-8 py-8 gap-3"
              >
                {/* Seal */}
                <div
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{ borderColor: "#E8D5A3", background: "#F0DFB0" }}
                >
                  <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
                    <path d="M16 3l2.5 8.5H27l-7 5 2.5 8.5L16 20l-6.5 5L12 16.5l-7-5h8.5L16 3z" fill="#C8A85A" opacity="0.85"/>
                  </svg>
                </div>

                {/* Label — acts as the main title */}
                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.05em] leading-none" style={{ color: "#9A7A2E" }}>
                  ✦ {new Date().getFullYear()} Wishlist
                </h2>

                {/* Subtitle / teaser */}
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#7A6030" }}>
                  {subtitle || (locked
                    ? "Something worth waiting for — check back soon."
                    : "Dream projects I'm actively seeking. Open invitations for founders ready to build something worth flying for."
                  )}
                </p>

                {locked ? (
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#C8A85A" }}>
                    Unveiling soon
                  </p>
                ) : (
                  <button
                    onClick={() => setDiscovered(true)}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all"
                    style={{ background: "#C8A85A", color: "#fff" }}
                    onMouseEnter={(e) => { (e.currentTarget).style.background = "#9A7A2E"; }}
                    onMouseLeave={(e) => { (e.currentTarget).style.background = "#C8A85A"; }}
                  >
                    Discover ✦
                  </button>
                )}
              </motion.div>
            )}

            {/* ── EXPANDED: title top-left, accordion rows ── */}
            {hasProjects && discovered && (
              <motion.div
                key="open"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Compact header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: "#E8D5A3" }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-0.5" style={{ color: "#9A7A2E" }}>
                      ✦ {new Date().getFullYear()} Wishlist
                    </p>
                    <h2 className="text-lg md:text-xl tracking-tight leading-tight text-gray-900">{title}</h2>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="hidden sm:block text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#C8A85A" }}>
                      {openCount > 0
                        ? `${openCount} open${fulfilledCount > 0 ? ` · ${fulfilledCount} granted` : ""}`
                        : "All granted"
                      }
                    </p>
                    <button
                      onClick={() => { setDiscovered(false); setExpandedId(null); }}
                      className="text-xs font-medium transition-colors"
                      style={{ color: "#C8A85A" }}
                      onMouseEnter={(e) => { (e.currentTarget).style.color = "#9A7A2E"; }}
                      onMouseLeave={(e) => { (e.currentTarget).style.color = "#C8A85A"; }}
                    >
                      ← Back
                    </button>
                  </div>
                </div>

                {/* Accordion rows — others hide when one is open */}
                <div>
                  {visible.map((project, i) => (
                    <AnimatePresence key={project.id} initial={false}>
                      {(expandedId === null || expandedId === project.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden border-b last:border-0"
                          style={{ borderColor: "#E8D5A3" }}
                        >
                          <WishlistCard
                            project={project}
                            index={i}
                            expanded={expandedId === project.id}
                            onToggle={() => toggleCard(project.id)}
                            onBook={onBook}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Availability — always visible ── */}
        <div className="hidden md:block sticky top-24">
          <div className="border border-gray-200 rounded-3xl p-6 bg-white">
            <AvailabilityWidget />
          </div>
        </div>
      </div>

      {/* Mobile availability — always visible */}
      <div className="md:hidden mt-6">
        <div className="border border-gray-200 rounded-3xl p-6 bg-white">
          <AvailabilityWidget />
        </div>
      </div>
    </section>
  );
}

function WishlistCard({
  project,
  index,
  expanded,
  onToggle,
  onBook,
}: {
  project: SiteSettings["contact"]["wishlistProjects"][number];
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onBook: (b: BookingType) => void;
}) {
  return (
    <div className="group">
      {/* Row header */}
      <div
        className="flex items-center gap-4 px-6 py-4 cursor-pointer"
        onClick={onToggle}
      >
        {/* Golden index */}
        <span
          className="shrink-0 text-xs font-bold tabular-nums w-5 text-right select-none"
          style={{ color: "#C8A85A" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base md:text-lg tracking-tight leading-snug text-gray-900 group-hover:underline underline-offset-4 decoration-1 truncate">
                {project.title}
              </h3>
              {project.subtitle && (
                <p className="text-xs mt-0.5 truncate" style={{ color: "#9A7A2E" }}>{project.subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {project.fulfilled ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: "#E8F5E9", color: "#388E3C", border: "1px solid #A5D6A7" }}>
                  <CheckCircle2 size={9} /> Granted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: "#FDF6E3", color: "#C8A85A", border: "1px solid #E8D5A3" }}>
                  Open
                </span>
              )}
              <span
                className="transition-transform duration-200 shrink-0"
                style={{ color: "#C8A85A", transform: expanded ? "rotate(45deg)" : "none", display: "block" }}
              >
                <Plus size={14} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="mx-4 mb-4 rounded-2xl px-5 py-4 space-y-4"
              style={{ background: "#F5E8C0", border: "1px solid #E8D5A3" }}
            >
              {project.brief && (
                <p className="text-sm leading-relaxed" style={{ color: "#5C4A1E" }}>
                  {project.brief}
                </p>
              )}

              {project.criteria?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "#9A7A2E" }}>
                    Who this is for
                  </p>
                  <ul className="space-y-1.5">
                    {project.criteria.map((c, ci) => (
                      <li key={ci} className="flex items-start gap-2.5 text-sm" style={{ color: "#5C4A1E" }}>
                        <span
                          className="mt-0.5 w-4 h-4 shrink-0 rounded-full flex items-center justify-center text-[9px] font-bold"
                          style={{ background: "#E8D5A3", color: "#9A7A2E" }}
                        >
                          {ci + 1}
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!project.fulfilled && (
                <div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onBook({ kind: "wishlist", projectTitle: project.title }); }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                    style={{ background: "#C8A85A", color: "#fff" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#9A7A2E"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#C8A85A"; }}
                  >
                    Apply for this project
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Services Section ─────────────────────────────────────────────────────────

function ServicesSection({
  title,
  services,
  onBook,
}: {
  title: string;
  services: SiteSettings["contact"]["services"];
  onBook: (b: BookingType) => void;
}) {
  const visible = [...services].filter((s) => s.visible).sort((a, b) => a.order - b.order);
  if (visible.length === 0) return null;

  // All cards closed by default — user clicks to open one
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14 border-t border-gray-100">
      <h2 className="text-4xl md:text-6xl tracking-tight leading-[0.95] mb-8">{title}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visible.map((svc) => (
          <ServiceCard
            key={svc.id}
            service={svc}
            expanded={expandedId === svc.id}
            onToggle={() => setExpandedId(expandedId === svc.id ? null : svc.id)}
            onBook={onBook}
          />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  expanded,
  onToggle,
  onBook,
}: {
  service: SiteSettings["contact"]["services"][number];
  expanded: boolean;
  onToggle: () => void;
  onBook: (b: BookingType) => void;
}) {
  return (
    <div
      className={[
        "border rounded-2xl flex flex-col transition-all duration-200",
        expanded ? "border-gray-900 shadow-sm" : "border-gray-200 hover:border-gray-300",
      ].join(" ")}
      style={{ aspectRatio: expanded ? "auto" : "3/2" }}
    >
      {/* Header toggle */}
      <button
        type="button"
        onClick={onToggle}
        className={[
          "flex items-start justify-between gap-2 px-5 text-left w-full",
          expanded ? "pt-5 pb-3" : "flex-1 pt-5 pb-5",
        ].join(" ")}
      >
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-[1] uppercase">{service.title}</h3>
          {service.subtitle && (
            <p className="text-xs text-gray-400 mt-1.5 leading-snug">{service.subtitle}</p>
          )}
        </div>
        <span className="shrink-0 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center mt-0.5">
          {expanded ? <Minus size={11} /> : <Plus size={11} />}
        </span>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {service.description && (
                <>
                  <p className="text-xs text-gray-500 leading-relaxed">{service.description}</p>
                  <div className="border-t border-gray-100" />
                </>
              )}
              {service.pricing?.length > 0 && (
                <div className="space-y-2">
                  {service.pricing.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <span className="text-gray-600 text-xs leading-snug">{item.name}</span>
                      <span className="font-black text-gray-900 shrink-0 text-sm">{item.price}</span>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() =>
                  onBook({
                    kind: "service",
                    serviceId: service.id,
                    serviceTitle: service.title,
                    serviceSubtitle: service.subtitle,
                    pricingOptions: service.pricing ?? [],
                  })
                }
                className={BTN_PRIMARY_FULL}
              >
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── General Inquiry — full-width card with form ─────────────────────────────

function InquirySection({ title }: { title: string }) {
  const [fields, setFields] = useState({ name: "", email: "", role: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function set(k: string, v: string) {
    setFields((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/public/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "inquiry", ...fields }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-4 h-11 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition placeholder:text-gray-300 bg-white";
  const selectCls =
    "w-full border border-gray-200 rounded-xl px-4 h-11 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition bg-white appearance-none cursor-pointer text-gray-700";
  const textareaCls =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition placeholder:text-gray-300 resize-none bg-white";

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14 border-t border-gray-100">
      <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 md:p-12">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16 items-start">

          {/* Left — title + description */}
          <div className="md:sticky md:top-24">
            <h2 className="text-4xl md:text-5xl tracking-tight leading-[0.95] mb-4">{title}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Not sure which service fits? Have a question or an idea?
              Just send a message — no pitch, no pressure.
            </p>
            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Usually replies within 24h
            </p>
          </div>

          {/* Right — form */}
          <div>
            {status === "sent" ? (
              <div className="flex flex-col gap-4 py-6">
                <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-5 h-5">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-2xl font-black tracking-tight">Message received.</p>
                <p className="text-gray-500 text-sm">I&apos;ll get back to you as soon as I can.</p>
                <button
                  onClick={() => { setStatus("idle"); setFields({ name: "", email: "", role: "", subject: "", message: "" }); }}
                  className="mt-1 text-sm text-gray-400 hover:text-black underline underline-offset-4 transition w-fit"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-1.5">Name *</label>
                    <input className={inputCls} placeholder="Your name" value={fields.name} onChange={(e) => set("name", e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-1.5">Email *</label>
                    <input type="email" className={inputCls} placeholder="you@email.com" value={fields.email} onChange={(e) => set("email", e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-1.5">Who are you?</label>
                  <div className="relative">
                    <select className={selectCls} value={fields.role} onChange={(e) => set("role", e.target.value)}>
                      <option value="">Select one…</option>
                      <option value="Creative">Creative</option>
                      <option value="Business Owner">Business Owner</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-1.5">Subject</label>
                  <input className={inputCls} placeholder="What's on your mind?" value={fields.subject} onChange={(e) => set("subject", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-1.5">Message *</label>
                  <textarea className={textareaCls} rows={5} placeholder="Tell me anything..." value={fields.message} onChange={(e) => set("message", e.target.value)} required />
                </div>
                {status === "error" && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    Something went wrong. Please try again or email directly.
                  </p>
                )}
                <button type="submit" disabled={status === "sending"} className={BTN_PRIMARY}>
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ContactClient({
  contact,
}: {
  contact: SiteSettings["contact"];
}) {
  const [booking, setBooking] = useState<BookingType | null>(null);
  // Array order from Firestore already reflects the admin drag order — no sort needed
  const sortedSections = contact.sections ?? [];

  function renderSection(id: string) {
    const section = contact.sections.find((s) => s.id === id);
    if (!section?.visible) return null;

    switch (id) {
      case "wishlist":
        return (
          <WishlistSection
            key="wishlist"
            title={contact.wishlistTitle}
            subtitle={contact.wishlistSubtitle}
            projects={contact.wishlistProjects}
            locked={contact.wishlistLocked}
            onBook={setBooking}
          />
        );
      case "services":
        return (
          <ServicesSection
            key="services"
            title={contact.servicesTitle}
            services={contact.services}
            onBook={setBooking}
          />
        );
      case "inquiry":
        return <InquirySection key="inquiry" title={contact.inquiryTitle} />;
      default:
        return null;
    }
  }

  return (
    <>
      {sortedSections.map((s, i) => {
        const el = renderSection(s.id);
        if (!el) return null;
        return (
          <ScrollReveal key={s.id} delay={i * 0.08}>
            {el}
          </ScrollReveal>
        );
      })}
      <BookingModal booking={booking} onClose={() => setBooking(null)} />
    </>
  );
}
