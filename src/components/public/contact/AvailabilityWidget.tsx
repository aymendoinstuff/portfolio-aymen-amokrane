"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toYYYYMM(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function toYYYYMMDD(date: Date) {
  return date.toISOString().slice(0, 10);
}

// Build the 6-row calendar grid (Mon-first). Returns array of Date|null.
function buildGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  // getDay() is 0=Sun…6=Sat; convert to Mon-first: 0=Mon…6=Sun
  const startDow = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  // pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

interface AvailabilityData {
  busyDates: string[];
  callDates: string[];
}

export default function AvailabilityWidget() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [data, setData] = useState<AvailabilityData>({ busyDates: [], callDates: [] });
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const fetchData = useCallback(async (y: number, m: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/public/availability?month=${toYYYYMM(y, m)}`);
      const json = await res.json();
      setData(json);
    } catch {
      setData({ busyDates: [], callDates: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(year, month);
  }, [year, month, fetchData]);

  const prev = () => {
    setDirection(-1);
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };

  const next = () => {
    setDirection(1);
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const grid = buildGrid(year, month);
  const todayStr = toYYYYMMDD(today);
  const busySet = new Set(data.busyDates);
  const callSet = new Set(data.callDates);

  return (
    <div className="flex flex-col h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 tracking-tight">
          Availability
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            disabled={year === today.getFullYear() && month === today.getMonth()}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={next}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Month/Year */}
      <div className="mb-3 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`${year}-${month}`}
            initial={{ opacity: 0, x: direction * 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="text-xs text-gray-500 font-medium"
          >
            {MONTHS[month]} {year}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-[10px] text-gray-400 text-center font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="relative flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${year}-${month}`}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="grid grid-cols-7 gap-y-0.5"
          >
            {grid.map((date, i) => {
              if (!date) return <div key={i} />;
              const ds = toYYYYMMDD(date);
              const isToday = ds === todayStr;
              const isPast = date < today && !isToday;
              const isBusy = busySet.has(ds);
              const isCall = callSet.has(ds);

              // Sunday = 0, calls only on Sundays
              const isSunday = date.getDay() === 0;

              return (
                <div key={i} className="flex flex-col items-center py-0.5">
                  <div
                    className={[
                      "w-7 h-7 flex items-center justify-center rounded-full text-[11px] font-medium transition-colors",
                      isToday
                        ? "bg-black text-white"
                        : isPast
                        ? "text-gray-300"
                        : isBusy
                        ? "text-gray-400"
                        : isSunday
                        ? "text-blue-700 font-bold"
                        : "text-gray-700",
                    ].join(" ")}
                  >
                    {date.getDate()}
                  </div>
                  {/* Status dot */}
                  {!isPast && (
                    <div
                      className={[
                        "w-1 h-1 rounded-full mt-0.5 transition-colors",
                        isBusy
                          ? "bg-red-400"
                          : isCall
                          ? "bg-blue-400"
                          : isSunday
                          ? "bg-blue-200"
                          : "bg-emerald-400",
                      ].join(" ")}
                    />
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-[10px] text-gray-500">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-200 shrink-0" />
          <span className="text-[10px] text-gray-500">Sunday — call slots open</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
          <span className="text-[10px] text-gray-500">Call scheduled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
          <span className="text-[10px] text-gray-500">Busy / On project</span>
        </div>
      </div>
    </div>
  );
}
