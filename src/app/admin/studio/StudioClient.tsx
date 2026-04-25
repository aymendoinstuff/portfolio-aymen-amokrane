"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Plus, X,
  Briefcase, Ban, AlertCircle, Trash2,
  Phone, Clock,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType = "call" | "project" | "blocked" | "pending";

interface CalEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;         // YYYY-MM-DD
  endDate?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
  clientName?: string;
  clientEmail?: string;
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
  existingEvent,
  onClose,
  onSave,
  onDelete,
}: {
  date: string;
  existingEvent?: CalEvent | null;
  onClose: () => void;
  onSave: (event: Omit<CalEvent, "id">) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [title, setTitle]       = useState(existingEvent?.title ?? "");
  const [type, setType]         = useState<EventType>(existingEvent?.type ?? "call");
  const [eventDate, setDate]    = useState(existingEvent?.date ?? date);
  const [endDate, setEndDate]   = useState(existingEvent?.endDate ?? "");
  const [startTime, setStart]   = useState(existingEvent?.startTime ?? "");
  const [endTime, setEnd]       = useState(existingEvent?.endTime ?? "");
  const [clientName, setClient] = useState(existingEvent?.clientName ?? "");
  const [clientEmail, setEmail] = useState(existingEvent?.clientEmail ?? "");
  const [notes, setNotes]       = useState(existingEvent?.notes ?? "");
  const [saving, setSaving]     = useState(false);

  const selectedDay = new Date(eventDate + "T12:00:00").getDay();
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
          <div className={`flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${activeProjects >= 2 ? "bg-red-50 text-red-600" : activeProjects === 1 ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`}>
            <Briefcase size={10} />
            {activeProjects}/2 projects
          </div>
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
  initialEvents,
}: {
  initialEvents: CalEvent[];
}) {
  const [events, setEvents] = useState<CalEvent[]>(initialEvents);

  const [modal, setModal] = useState<{
    date: string;
    existing?: CalEvent | null;
  } | null>(null);

  const today = todayStr();
  const activeProjects = events.filter(
    e => e.type === "project" && (e.endDate ?? e.date) >= today
  ).length;

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

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Calendar</h1>
          <p className="text-xs text-gray-400 mt-0.5">Schedule confirmed sessions after reaching out to clients</p>
        </div>
        <div className="flex items-center gap-3">
          {activeProjects >= 2 && (
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              At capacity — 2 active projects
            </span>
          )}
          <button
            onClick={() => setModal({ date: new Date().toISOString().slice(0, 10) })}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition"
          >
            <Plus size={14} />
            New Event
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 min-h-0 overflow-hidden bg-white">
        <CalendarView
          events={events}
          activeProjects={activeProjects}
          onDayClick={(date) => setModal({ date, existing: null })}
          onEventClick={(event) => setModal({ date: event.date, existing: event })}
        />
      </div>

      {/* Event modal */}
      <AnimatePresence>
        {modal && (
          <EventModal
            date={modal.date}
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
