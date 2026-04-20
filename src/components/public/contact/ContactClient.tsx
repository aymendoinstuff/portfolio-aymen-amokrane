"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import type { SiteSettings } from "@/app/admin/settings/schema";
import { BookingModal, type BookingType } from "./BookingModal";
import AvailabilityWidget from "./AvailabilityWidget";

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

// ─── Wishlist — folder system ─────────────────────────────────────────────────

function WishlistSection({
  title,
  subtitle,
  projects,
  onBook,
}: {
  title: string;
  subtitle?: string;
  projects: SiteSettings["contact"]["wishlistProjects"];
  onBook: (b: BookingType) => void;
}) {
  const visible = projects.filter((p) => p.visible);
  if (visible.length === 0) return null;

  const [opened, setOpened] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const active = visible[activeIdx] ?? visible[0];

  const fulfilledCount = visible.filter((p) => p.fulfilled).length;
  const wishStat =
    fulfilledCount === 0
      ? `${visible.length} open invitations`
      : fulfilledCount === visible.length
      ? "All wishes granted — new ones coming soon"
      : `${fulfilledCount} of ${visible.length} wishes granted this year`;

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
      {/* 2-column: availability (left) + wishlist folder (right) */}
      <div className="grid md:grid-cols-[280px_1fr] gap-6 items-stretch">

        {/* ── LEFT: Availability widget (desktop only) ── */}
        <div className="hidden md:flex flex-col">
          <div className="border border-gray-200 rounded-3xl p-6 bg-white flex-1 flex flex-col">
            <AvailabilityWidget />
          </div>
        </div>

        {/* ── RIGHT: Wishlist folder ── */}
        <div className="min-w-0 flex flex-col">
          <AnimatePresence mode="wait" initial={false}>
            {!opened ? (
              /* ── COVER STATE ── */
              <motion.div
                key="cover"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                <div
                  className="flex-1 flex flex-col rounded-3xl border border-[#E8D5A3] overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #FDF6E3 0%, #F9EDCA 100%)" }}
                >
                  {/* Decorative folder tabs */}
                  <div className="flex gap-0 px-8 pt-7 pointer-events-none select-none overflow-x-hidden">
                    {visible.map((p, i) => (
                      <div
                        key={p.id}
                        className="px-4 py-2 rounded-t-xl text-[10px] font-bold uppercase tracking-widest border border-b-0 mr-1 truncate max-w-[110px]"
                        style={{
                          background: i === 0 ? "#FDF6E3" : `rgba(200,168,90,${0.15 + i * 0.08})`,
                          borderColor: "#E8D5A3",
                          color: i === 0 ? "#8B6914" : "#C8A85A",
                          opacity: 1 - i * 0.15,
                          transform: `translateY(${i * 2}px)`,
                          zIndex: visible.length - i,
                        }}
                      >
                        {p.title}
                      </div>
                    ))}
                  </div>

                  {/* Cover body */}
                  <div className="border-t border-[#E8D5A3] px-8 py-10 flex-1 flex flex-col justify-between gap-8">
                    <div>
                      <h2 className="text-4xl md:text-5xl tracking-tight leading-[0.95] text-gray-900 mb-4">
                        {title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed max-w-[280px]">
                        {subtitle ||
                          "Dream projects I'm actively seeking in 2026 — open invitations for founders ready to build something worth flying for."}
                      </p>
                      <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C8A85A]">
                        {wishStat}
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() => { setOpened(true); setActiveIdx(0); }}
                        className={BTN_PRIMARY}
                      >
                        View Projects
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile availability widget */}
                <div className="md:hidden mt-4">
                  <div className="border border-gray-200 rounded-3xl p-6 bg-white">
                    <AvailabilityWidget />
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ── OPEN FOLDER STATE ── */
              <motion.div
                key="open"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                {/* Folder tabs row */}
                <div className="flex items-end gap-1 px-1 overflow-x-auto shrink-0">
                  {visible.map((project, i) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      className={[
                        "relative px-4 py-2.5 rounded-t-2xl text-sm font-semibold tracking-tight transition-all border border-b-0 whitespace-nowrap shrink-0",
                        i === activeIdx
                          ? "bg-[#FDF6E3] border-[#E8D5A3] text-gray-900 z-10 -mb-px pb-[13px]"
                          : "bg-[#F0DFB0] border-[#D4BC80] text-[#A07840] hover:bg-[#F5E8C0] hover:text-gray-800 z-0",
                      ].join(" ")}
                      style={{ transform: i === activeIdx ? "none" : `translateY(${(i % 2) * 2}px)` }}
                    >
                      {project.title}
                      {project.fulfilled && (
                        <CheckCircle2 size={10} className="inline ml-1.5 opacity-70" />
                      )}
                    </button>
                  ))}

                  <button
                    onClick={() => setOpened(false)}
                    className="ml-auto text-xs text-[#C8A85A] hover:text-[#8B6914] font-medium transition-colors pb-2 pr-1 shrink-0"
                  >
                    ← Back
                  </button>
                </div>

                {/* Folder content */}
                <div
                  className="flex-1 rounded-b-3xl rounded-tr-3xl border border-[#E8D5A3]"
                  style={{ background: "#FDF6E3" }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={active.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="p-8 h-full grid md:grid-cols-[1fr_180px] gap-8"
                    >
                      {/* Left: content */}
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 leading-tight">
                            {active.title}
                          </h3>
                          {active.subtitle && (
                            <p className="text-sm text-[#A07840] mt-1.5 font-medium">{active.subtitle}</p>
                          )}
                        </div>

                        {active.brief && (
                          <p className="text-sm text-gray-700 leading-relaxed">{active.brief}</p>
                        )}

                        {active.criteria?.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A07840] mb-3">
                              Who this is for
                            </p>
                            <ul className="space-y-2">
                              {active.criteria.map((c, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                                  <span className="mt-0.5 w-4 h-4 shrink-0 rounded-full border border-[#C8A85A] flex items-center justify-center text-[9px] font-bold text-[#A07840]">
                                    {i + 1}
                                  </span>
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Right: nav + CTA */}
                      <div className="flex flex-col justify-between gap-4">
                        {/* Pagination */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
                            disabled={activeIdx === 0}
                            className="w-8 h-8 rounded-full border border-[#D4BC80] flex items-center justify-center text-[#A07840] hover:bg-[#F0DFB0] disabled:opacity-30 transition"
                          >
                            <ChevronLeft size={13} />
                          </button>
                          <span className="text-xs font-semibold text-[#C8A85A] flex-1 text-center tabular-nums">
                            {activeIdx + 1} / {visible.length}
                          </span>
                          <button
                            onClick={() => setActiveIdx(Math.min(visible.length - 1, activeIdx + 1))}
                            disabled={activeIdx === visible.length - 1}
                            className="w-8 h-8 rounded-full border border-[#D4BC80] flex items-center justify-center text-[#A07840] hover:bg-[#F0DFB0] disabled:opacity-30 transition"
                          >
                            <ChevronRight size={13} />
                          </button>
                        </div>

                        {/* CTA */}
                        <div className="mt-auto">
                          {active.fulfilled ? (
                            <div className="flex items-center gap-2 text-sm text-[#A07840] font-semibold">
                              <CheckCircle2 size={15} />
                              Wish Granted
                            </div>
                          ) : (
                            <button
                              onClick={() => onBook({ kind: "wishlist", projectTitle: active.title })}
                              className={BTN_PRIMARY_FULL}
                            >
                              Book Now
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
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
        className="flex items-start justify-between gap-2 px-5 pt-5 pb-3 text-left w-full"
      >
        <div>
          <h3 className="text-base font-black tracking-tight leading-tight uppercase">{service.title}</h3>
          {service.subtitle && (
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1">{service.subtitle}</p>
          )}
        </div>
        <span className="shrink-0 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center mt-0.5">
          {expanded ? <Minus size={11} /> : <Plus size={11} />}
        </span>
      </button>

      {/* Collapsed: show starting price */}
      {!expanded && service.pricing?.length > 0 && (
        <div className="flex-1 flex flex-col justify-end px-5 pb-5">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">From</p>
          <p className="text-sm font-black text-gray-800">{service.pricing[0]?.price}</p>
        </div>
      )}

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

// ─── General Inquiry — full-width card ───────────────────────────────────────

function InquirySection({ title }: { title: string }) {
  const [fields, setFields] = useState({ name: "", email: "", subject: "", message: "" });
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
  const textareaCls =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition placeholder:text-gray-300 resize-none bg-white";

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14 border-t border-gray-100">
      {/* Full-width card */}
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
                  onClick={() => { setStatus("idle"); setFields({ name: "", email: "", subject: "", message: "" }); }}
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
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-1.5">Subject</label>
                  <input className={inputCls} placeholder="What's on your mind?" value={fields.subject} onChange={(e) => set("subject", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-1.5">Message *</label>
                  <textarea className={textareaCls} rows={5} placeholder="Tell me anything..." value={fields.message} onChange={(e) => set("message", e.target.value)} required />
                </div>
                {status === "error" && (
                  <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
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
  const sortedSections = [...(contact.sections ?? [])].sort((a, b) => a.order - b.order);

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
      {sortedSections.map((s) => renderSection(s.id))}
      <BookingModal booking={booking} onClose={() => setBooking(null)} />
    </>
  );
}
