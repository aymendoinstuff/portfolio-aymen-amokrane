"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Plus, X, Check, Clock,
  Calendar, Mail, Phone, Briefcase, Ban, AlertCircle, Trash2,
  Tag, Flame, Star, CheckCircle2, Archive,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType = "call" | "project" | "blocked" | "pending";
type LabelKey  = "urgent" | "hot-lead" | "follow-up" | "done";

interface CalEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;         // YYYY-MM-DD
  endDate?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
  bookingId?: string;
  clientName?: string;
  clientEmail?: string;
}

interface Booking {
  id: string;
  type?: string;
  name?: string;
  email?: string;
  status?: string;
  labels?: LabelKey[];
  createdAt?: number;
  message?: string;
  subject?: string;
  serviceTitle?: string;
  projectTitle?: string;
  brandName?: string;
  brief?: string;
  budgetRange?: string;
  timeline?: string;
  location?: string;
}

// ─── Label config ─────────────────────────────────────────────────────────────

const LABELS: Record<LabelKey, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  "urgent":    { label: "Urgent",     color: "text-red-600",    bg: "bg-red-50 border-red-200",    icon: Flame },
  "hot-lead":  { label: "Hot Lead",   color: "text-orange-600", bg: "bg-orange-50 border-orange-200", icon: Star },
  "follow-up": { label: "Follow-up",  color: "text-blue-600",   bg: "bg-blue-50 border-blue-200",  icon: Clock },
  "done":      { label: "Done",       color: "text-green-600",  bg: "bg-green-50 border-green-200",icon: CheckCircle2 },
};

// Auto-label by booking type
function autoLabel(b: Booking): string {
  const map: Record<string, string> = {
    wishlist:       "Wishlist",
    branding:       "Branding",
    "11-meet":      "1/1 Meet",
    "brand-audit":  "Brand Audit",
    "team-training":"Training",
    service:        "Service",
    inquiry:        "Inquiry",
  };
  return b.serviceTitle ?? b.projectTitle ?? (b.type ? (map[b.type] ?? b.type) : "Inquiry");
}

// ─── Event styles ─────────────────────────────────────────────────────────────

const EVENT_STYLES: Record<EventType, { bg: string; text: string; dot: string; label: string; icon: React.ElementType }> = {
  call:    { bg: "bg-blue-50",   text: "text-blue-700",  dot: "bg-blue-500",   label: "Call",    icon: Phone },
  project: { bg: "bg-amber-50",  text: "text-amber-700", dot: "bg-amber-500",  label: "Project", icon: Briefcase },
  blocked: { bg: "bg-gray-100",  text: "text-gray-600",  dot: "bg-gray-400",   label: "Blocked", icon: Ban },
  pending: { bg: "bg-yellow-50", text: "text-yellow-700",dot: "bg-yellow-400", label: "Pending", icon: AlertCircle },
};

// ─── Calendar helpers ─────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstWeekday(year: number, month: number) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}
function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function todayStr() { return new Date().toISOString().slice(0, 10); }

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ─── Event Modal ──────────────────────────────────────────────────────────────

function EventModal({
  date,
  booking,
  existingEvent,
  onClose,
  onSave,
  onDelete,
}: {
  date: string;
  booking?: Booking | null;
  existingEvent?: CalEvent | null;
  onClose: () => void;
  onSave: (event: Omit<CalEvent, "id">) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [title, setTitle]       = useState(existingEvent?.title ?? booking?.name ?? "");
  const [type, setType]         = useState<EventType>(existingEvent?.type ?? (booking ? "call" : "blocked"));
  const [eventDate, setDate]    = useState(existingEvent?.date ?? date);
  const [endDate, setEndDate]   = useState(existingEvent?.endDate ?? "");
  const [startTime, setStart]   = useState(existingEvent?.startTime ?? "");
  const [endTime, setEnd]       = useState(existingEvent?.endTime ?? "");
  const [clientName, setClient] = useState(existingEvent?.clientName ?? booking?.name ?? "");
  const [clientEmail, setEmail] = useState(existingEvent?.clientEmail ?? booking?.email ?? "");
  const [notes, setNotes]       = useState(existingEvent?.notes ?? "");
  const [saving, setSaving]     = useState(false);

  // Warn if call not on Sunday 11am–5pm (Dubai time = UTC+4)
  const selectedDay = new Date(eventDate + "T12:00:00").getDay(); // 0=Sun
  const isCallWarning = type === "call" && selectedDay !== 0;
  const isTimeWarning = type === "call" && startTime && (startTime < "11:00" || startTime > "17:00");

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 h-10 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition bg-white";
  const labelCls = "block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1";

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    await onSave({
      title: title.trim(), type, date: eventDate,
      ...(endDate ? { endDate } : {}),
      ...(startTime ? { startTime } : {}),
      ...(endTime ? { endTime } : {}),
      ...(clientName ? { clientName } : {}),
      ...(clientEmail ? { clientEmail } : {}),
      ...(notes ? { notes } : {}),
      ...(booking?.id ? { bookingId: booking.id } : existingEvent?.bookingId ? { bookingId: existingEvent.bookingId } : {}),
    });
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">
            {existingEvent ? "Edit Event" : "New Event"}
          </h3>
          <div className="flex items-center gap-2">
            {existingEvent && onDelete && (
              <button
                onClick={async () => { await onDelete(existingEvent.id); onClose(); }}
                className="p-1.5 text-gray-300 hover:text-red-500 transition rounded-lg hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            )}
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-black transition rounded-lg hover:bg-gray-100">
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Type selector */}
          <div>
            <label className={labelCls}>Type</label>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(EVENT_STYLES) as EventType[]).map((t) => {
                const s = EVENT_STYLES[t];
                const Icon = s.icon;
                return (
                  <button key={t} type="button" onClick={() => setType(t)}
                    className={["flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition",
                      type === t ? `${s.bg} ${s.text} border-current` : "border-gray-200 text-gray-500 hover:border-gray-300",
                    ].join(" ")}
                  >
                    <Icon size={11} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Call slot warnings */}
          {isCallWarning && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
              <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700">Calls are typically on <strong>Sundays</strong> — this is a {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][selectedDay]}.</p>
            </div>
          )}
          {isTimeWarning && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
              <Clock size={14} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700">Call slot is <strong>11:00–17:00 Dubai time</strong>.</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className={labelCls}>Title *</label>
            <input className={inputCls} placeholder="Event title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Date *</label>
              <input type="date" className={inputCls} value={eventDate} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>End Date (multi-day)</label>
              <input type="date" className={inputCls} value={endDate} onChange={e => setEndDate(e.target.value)} min={eventDate} />
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Start Time</label>
              <input type="time" className={inputCls} value={startTime} onChange={e => setStart(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>End Time</label>
              <input type="time" className={inputCls} value={endTime} onChange={e => setEnd(e.target.value)} />
            </div>
          </div>

          {/* Client */}
          {type !== "blocked" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Client Name</label>
                <input className={inputCls} placeholder="Name" value={clientName} onChange={e => setClient(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Client Email</label>
                <input className={inputCls} placeholder="email@..." value={clientEmail} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition resize-none bg-white"
              rows={3} placeholder="Optional notes..." value={notes} onChange={e => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-black transition">Cancel</button>
          <button onClick={handleSave} disabled={!title.trim() || saving}
            className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-900 transition disabled:opacity-50"
          >
            {saving ? "Saving…" : existingEvent ? "Update" : "Create Event"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Booking Panel ────────────────────────────────────────────────────────────

function BookingPanel({
  bookings,
  onSchedule,
  onDecline,
  onMarkRead,
  onLabel,
}: {
  bookings: Booking[];
  onSchedule: (b: Booking) => void;
  onDecline: (id: string) => void;
  onMarkRead: (id: string) => void;
  onLabel: (id: string, labels: LabelKey[]) => void;
}) {
  const [selected, setSelected] = useState<Booking | null>(null);
  const [filterLabel, setFilterLabel] = useState<LabelKey | "all">("all");

  const newCount = bookings.filter(b => b.status === "new").length;

  const filteredBookings = filterLabel === "all"
    ? bookings
    : bookings.filter(b => b.labels?.includes(filterLabel));

  const statusBadge = (status?: string) => {
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "declined")  return "bg-red-100 text-red-500";
    if (status === "read")      return "bg-gray-100 text-gray-500";
    return "bg-yellow-100 text-yellow-700";
  };

  function toggleLabel(bookingId: string, current: LabelKey[] | undefined, key: LabelKey) {
    const cur = current ?? [];
    const next = cur.includes(key) ? cur.filter(l => l !== key) : [...cur, key];
    onLabel(bookingId, next);
    if (selected?.id === bookingId) {
      setSelected(prev => prev ? { ...prev, labels: next } : null);
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Mail size={14} className="text-gray-400" />
            Bookings
          </h2>
          {newCount > 0 && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {newCount} new
            </span>
          )}
        </div>
        {/* Label filter pills */}
        <div className="flex gap-1 overflow-x-auto pb-0.5">
          <button onClick={() => setFilterLabel("all")}
            className={`shrink-0 text-[10px] px-2 py-1 rounded-full font-semibold transition border ${filterLabel === "all" ? "bg-black text-white border-black" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}
          >All</button>
          {(Object.keys(LABELS) as LabelKey[]).map(k => {
            const L = LABELS[k];
            const Icon = L.icon;
            return (
              <button key={k} onClick={() => setFilterLabel(filterLabel === k ? "all" : k)}
                className={`shrink-0 flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold transition border ${filterLabel === k ? `${L.bg} ${L.color} border-current` : "border-gray-200 text-gray-500 hover:border-gray-400"}`}
              >
                <Icon size={9} />{L.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail slide-in */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="absolute inset-0 z-20 bg-white flex flex-col"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 shrink-0">
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-gray-100 transition">
                <ChevronLeft size={14} />
              </button>
              <span className="text-sm font-bold text-gray-900 truncate">{selected.name}</span>
              <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusBadge(selected.status)}`}>
                {selected.status ?? "new"}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {/* Auto-type badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full text-[10px] font-semibold text-gray-600">
                <Tag size={9} />
                {autoLabel(selected)}
              </div>

              {/* Labels */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">Labels</p>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(LABELS) as LabelKey[]).map(k => {
                    const L = LABELS[k];
                    const Icon = L.icon;
                    const active = selected.labels?.includes(k);
                    return (
                      <button key={k} type="button"
                        onClick={() => toggleLabel(selected.id, selected.labels, k)}
                        className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-semibold border transition ${active ? `${L.bg} ${L.color} border-current` : "border-gray-200 text-gray-400 hover:border-gray-400"}`}
                      >
                        <Icon size={9} />{L.label}
                        {active && <Check size={8} className="ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">From</p>
                <p className="text-sm font-semibold">{selected.name}</p>
                <a href={`mailto:${selected.email}`} className="text-xs text-blue-600 underline">{selected.email}</a>
              </div>

              {selected.subject && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Subject</p>
                  <p className="text-sm">{selected.subject}</p>
                </div>
              )}

              {(selected.message ?? selected.brief) && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Message</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{selected.message ?? selected.brief}</p>
                </div>
              )}

              {selected.budgetRange && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Budget</p>
                  <p className="text-sm">{selected.budgetRange}</p>
                </div>
              )}

              {selected.timeline && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Timeline</p>
                  <p className="text-sm">{selected.timeline}</p>
                </div>
              )}

              {selected.location && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Location</p>
                  <p className="text-sm">{selected.location}</p>
                </div>
              )}

              {selected.createdAt && (
                <p className="text-[10px] text-gray-400 pt-2">
                  Received {new Date(selected.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </div>

            {selected.status !== "confirmed" && selected.status !== "declined" && (
              <div className="px-4 py-4 border-t border-gray-100 space-y-2 shrink-0">
                <button
                  onClick={() => { onSchedule(selected); setSelected(null); }}
                  className="w-full py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-900 transition flex items-center justify-center gap-2"
                >
                  <Calendar size={14} />
                  Schedule on Calendar
                </button>
                <button
                  onClick={() => { onDecline(selected.id); setSelected({ ...selected, status: "declined" }); }}
                  className="w-full py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:border-red-300 hover:text-red-600 transition"
                >
                  Decline
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-300">
            <Archive size={24} className="mb-2" />
            <p className="text-xs">{filterLabel === "all" ? "No bookings yet" : `No ${LABELS[filterLabel as LabelKey]?.label} bookings`}</p>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => { setSelected(b); if (b.status === "new") onMarkRead(b.id); }}
              className="w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={`text-sm truncate ${b.status === "new" ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                    {b.name ?? "Unknown"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{autoLabel(b)}</p>
                  {/* Label chips */}
                  {b.labels && b.labels.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {b.labels.map(k => {
                        const L = LABELS[k];
                        if (!L) return null;
                        const Icon = L.icon;
                        return (
                          <span key={k} className={`inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-semibold border ${L.bg} ${L.color}`}>
                            <Icon size={8} />{L.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {b.status === "new" && <span className="w-2 h-2 bg-black rounded-full" />}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${statusBadge(b.status)}`}>
                    {b.status ?? "new"}
                  </span>
                </div>
              </div>
              {b.createdAt && (
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

function CalendarView({
  events,
  activeProjects,
  onDayClick,
  onEventClick,
}: {
  events: CalEvent[];
  activeProjects: number;
  onDayClick: (date: string) => void;
  onEventClick: (event: CalEvent) => void;
}) {
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const today = todayStr();
  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = getFirstWeekday(year, month);

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function eventsForDay(day: number) {
    const ds = toDateStr(year, month, day);
    return events.filter(e => {
      if (e.date === ds) return true;
      if (e.endDate && e.date <= ds && e.endDate >= ds) return true;
      return false;
    });
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Calendar nav */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <ChevronLeft size={15} />
          </button>
          <h3 className="text-sm font-bold text-gray-900 min-w-[130px] text-center">
            {MONTHS[month]} {year}
          </h3>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Project capacity badge */}
          <div className={`flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${activeProjects >= 2 ? "bg-red-50 text-red-600" : activeProjects === 1 ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`}>
            <Briefcase size={10} />
            {activeProjects}/2 projects
          </div>
          {/* Legend */}
          {(Object.keys(EVENT_STYLES) as EventType[]).map(t => (
            <span key={t} className="hidden lg:flex items-center gap-1 text-[10px] text-gray-500">
              <span className={`w-2 h-2 rounded-full ${EVENT_STYLES[t].dot}`} />
              {EVENT_STYLES[t].label}
            </span>
          ))}
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-100 shrink-0">
        {WEEKDAYS.map(d => (
          <div key={d} className="py-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-7 h-full">
          {cells.map((day, i) => {
            if (!day) return <div key={`blank-${i}`} className="border-r border-b border-gray-50 min-h-[90px]" />;

            const ds = toDateStr(year, month, day);
            const dayEvents = eventsForDay(day);
            const isToday = ds === today;
            const isPast = ds < today;
            // Sundays = 0
            const isSunday = new Date(ds + "T12:00:00").getDay() === 0;

            return (
              <div
                key={ds}
                onClick={() => onDayClick(ds)}
                className={[
                  "border-r border-b border-gray-100 min-h-[90px] p-1.5 cursor-pointer transition-colors",
                  isToday ? "bg-gray-950/[0.03]" : isPast ? "bg-gray-50/50" : isSunday ? "bg-blue-50/30" : "hover:bg-gray-50",
                ].join(" ")}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className={[
                    "w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full",
                    isToday ? "bg-black text-white" : isPast ? "text-gray-300" : isSunday ? "text-blue-700 font-black" : "text-gray-700",
                  ].join(" ")}>
                    {day}
                  </div>
                  {isSunday && !isPast && <span className="text-[8px] font-bold text-blue-400 tracking-wide">CALLS</span>}
                </div>

                <div className="space-y-0.5">
                  {dayEvents.slice(0, 3).map(e => {
                    const s = EVENT_STYLES[e.type];
                    return (
                      <button
                        key={e.id}
                        type="button"
                        onClick={(ev) => { ev.stopPropagation(); onEventClick(e); }}
                        className={["w-full text-left px-1.5 py-0.5 rounded text-[10px] font-semibold truncate", s.bg, s.text].join(" ")}
                      >
                        {e.startTime && <span className="opacity-60 mr-1">{e.startTime}</span>}
                        {e.title}
                      </button>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <p className="text-[9px] text-gray-400 pl-1">+{dayEvents.length - 3} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming strip */}
      <div className="border-t border-gray-100 px-4 py-3 shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">Upcoming</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {events
            .filter(e => e.date >= today)
            .slice(0, 8)
            .map(e => {
              const s = EVENT_STYLES[e.type];
              return (
                <button key={e.id} type="button" onClick={() => onEventClick(e)}
                  className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold ${s.bg} ${s.text} hover:opacity-80 transition`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  <span className="max-w-[100px] truncate">{e.title}</span>
                  <span className="opacity-60 text-[10px]">{e.date.slice(5)}</span>
                </button>
              );
            })}
          {events.filter(e => e.date >= today).length === 0 && (
            <p className="text-xs text-gray-300">No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main StudioClient ────────────────────────────────────────────────────────

export default function StudioClient({
  initialBookings,
  initialEvents,
}: {
  initialBookings: Booking[];
  initialEvents: CalEvent[];
}) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [events,   setEvents]   = useState<CalEvent[]>(initialEvents);
  const [tab, setTab] = useState<"bookings" | "calendar">("bookings");

  const [modal, setModal] = useState<{
    date: string;
    booking?: Booking | null;
    existing?: CalEvent | null;
  } | null>(null);

  // Count active projects (confirmed or scheduled project events in the future or ongoing)
  const today = todayStr();
  const activeProjects = events.filter(
    e => e.type === "project" && (e.endDate ?? e.date) >= today
  ).length;

  // ── API helpers ──
  const createEvent = useCallback(async (data: Omit<CalEvent, "id">) => {
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create event");
    const json = await res.json() as { id: string };
    const newEvent: CalEvent = { id: json.id, ...data };
    setEvents(prev => [...prev, newEvent].sort((a, b) => a.date.localeCompare(b.date)));
    if (data.bookingId) {
      setBookings(prev => prev.map(b => b.id === data.bookingId ? { ...b, status: "confirmed" } : b));
    }
  }, []);

  const updateEvent = useCallback(async (data: Omit<CalEvent, "id"> & { id: string }) => {
    await fetch("/api/admin/events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEvents(prev => prev.map(e => e.id === data.id ? { ...e, ...data } : e));
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const updateBooking = useCallback(async (id: string, status: string) => {
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  }, []);

  const labelBooking = useCallback(async (id: string, labels: LabelKey[]) => {
    // Optimistic update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, labels } : b));
    // Persist — the PATCH endpoint accepts any extra fields
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: bookings.find(b => b.id === id)?.status ?? "read", labels }),
    });
  }, [bookings]);

  const newCount = bookings.filter(b => b.status === "new").length;

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Studio</h1>
          <p className="text-xs text-gray-400 mt-0.5">Calendar · Bookings · Schedule</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Capacity warning */}
          {activeProjects >= 2 && (
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              At capacity — 2 active projects
            </span>
          )}
          <button
            onClick={() => { setModal({ date: new Date().toISOString().slice(0, 10) }); setTab("calendar"); }}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition"
          >
            <Plus size={14} />
            New Event
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 shrink-0">
        <div className="flex gap-1">
          {(["bookings", "calendar"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-3 text-sm font-semibold capitalize transition-colors ${tab === t ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              {t}
              {t === "bookings" && newCount > 0 && (
                <span className="ml-1.5 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {newCount}
                </span>
              )}
              {tab === t && (
                <motion.div
                  layoutId="studio-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab panels */}
      <div className="flex-1 min-h-0 overflow-hidden bg-white relative">
        <AnimatePresence mode="wait" initial={false}>
          {tab === "bookings" ? (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col overflow-hidden"
            >
              <div className="relative flex-1 overflow-hidden">
                <BookingPanel
                  bookings={bookings}
                  onSchedule={(b) => { setModal({ date: new Date().toISOString().slice(0, 10), booking: b }); setTab("calendar"); }}
                  onDecline={(id) => updateBooking(id, "declined")}
                  onMarkRead={(id) => updateBooking(id, "read")}
                  onLabel={labelBooking}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <CalendarView
                events={events}
                activeProjects={activeProjects}
                onDayClick={(date) => setModal({ date, booking: null, existing: null })}
                onEventClick={(event) => setModal({ date: event.date, existing: event })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Event modal */}
      <AnimatePresence>
        {modal && (
          <EventModal
            date={modal.date}
            booking={modal.booking}
            existingEvent={modal.existing}
            onClose={() => setModal(null)}
            onSave={modal.existing
              ? async (data) => { await updateEvent({ id: modal.existing!.id, ...data }); }
              : createEvent
            }
            onDelete={modal.existing ? deleteEvent : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
