import React from "react";
import type { Stat } from "@/lib/admin/types";

export type StatCardProps = Stat & { className?: string };

export function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <div
      className={
        "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow transition-shadow " +
        (className ?? "")
      }
      role="group"
      aria-label={label}
    >
      <div className="flex items-start justify-between">
        <div className="text-3xl font-extrabold leading-none tabular-nums">
          {value}
        </div>
        {icon && (
          <div className="opacity-70" aria-hidden>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-2 text-sm text-gray-600">{label}</div>
    </div>
  );
}
