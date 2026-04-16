import FilterPill from "./components/FilterPill";


export type WorkFilterBarProps = Readonly<{
  years: number[];
  cats: string[];
  filterYear: string;
  filterCat: string;
  onYearChange: (y: string) => void;
  onCatChange: (c: string) => void;
  children?: React.ReactNode;
}>;

export function WorkFilters({
  years,
  cats,
  filterYear,
  filterCat,
  onYearChange,
  onCatChange,
  children,
}: WorkFilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="uppercase tracking-[0.2em] text-[12px]">Year</span>
        <div className="flex flex-wrap gap-2">
          <FilterPill
            active={filterYear === "All"}
            onClick={() => onYearChange("All")}
          >
            All
          </FilterPill>
          {years.map((y) => (
            <FilterPill
              key={y}
              active={filterYear === String(y)}
              onClick={() => onYearChange(String(y))}
            >
              {y}
            </FilterPill>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="uppercase tracking-[0.2em] text-[12px]">Category</span>
        <div className="flex flex-wrap gap-2">
          <FilterPill
            active={filterCat === "All"}
            onClick={() => onCatChange("All")}
          >
            All
          </FilterPill>
          {cats.map((c) => (
            <FilterPill
              key={c}
              active={filterCat === c}
              onClick={() => onCatChange(c)}
            >
              {c}
            </FilterPill>
          ))}
        </div>
        <div className="ml-auto text-xs opacity-70">{children}</div>
      </div>
    </div>
  );
}