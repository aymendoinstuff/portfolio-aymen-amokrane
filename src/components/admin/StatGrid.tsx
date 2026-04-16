import React from "react";
import { StatCard } from "./StatCard";
import type { Stat, StatGridColumns } from "@/lib/admin/types";

export type StatGridProps = {
  stats: Stat[];
  columns?: StatGridColumns;
  className?: string;
};

export function StatGrid({
  stats,
  columns = 4,
  className = "",
}: StatGridProps) {
  const colClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
  }[columns];

  return (
    <div className={`grid grid-cols-1 ${colClass} gap-4 ${className}`}>
      {stats.map((s) => (
        <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
      ))}
    </div>
  );
}
