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

      <div className={`grid gap-4 ${
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
            className="bg-white border border-gray-200 rounded-2xl px-6 py-7 flex flex-col select-none"
          >
            <div className="text-5xl md:text-6xl font-extrabold tracking-tight leading-none mb-4">
              <CountUp value={stat.v} suffix={stat.suffix} />
            </div>
            <h3 className="font-semibold text-base leading-snug">{stat.k}</h3>
            {stat.sub && <p className="text-sm text-gray-400 mt-1">{stat.sub}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
