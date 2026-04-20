import SectionTitle from "@/components/SectionTitle";
import CountUp from "@/components/public/about/CountUp";
import { stats } from "@/lib/data/about";

interface NumbersSectionProps {
  statIndices: number[];
}

export default function NumbersSection({ statIndices }: NumbersSectionProps) {
  // Default to [0, 1, 2, 3] if empty or use provided indices
  const indices = statIndices.length > 0 ? statIndices : [0, 1, 2, 3];

  // Filter to only valid indices
  const displayStats = indices
    .filter((i) => i >= 0 && i < stats.length)
    .slice(0, 4) // Max 4 stats
    .map((i) => stats[i]);

  if (displayStats.length === 0) {
    return null;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <SectionTitle>By the numbers</SectionTitle>

      <div className={`grid gap-6 md:gap-8 ${
        displayStats.length === 1
          ? "md:grid-cols-1"
          : displayStats.length === 2
            ? "md:grid-cols-2"
            : displayStats.length === 3
              ? "md:grid-cols-3"
              : "md:grid-cols-4"
      }`}>
        {displayStats.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center md:items-start md:text-left"
          >
            <div className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              <CountUp value={stat.v} suffix={stat.suffix} />
            </div>
            <h3 className="font-semibold text-base mb-1">{stat.k}</h3>
            <p className="text-sm opacity-70">{stat.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
