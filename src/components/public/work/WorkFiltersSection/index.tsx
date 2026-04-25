// First 6 shown individually; everything else is grouped under "Others"
const CATEGORY_PILLS = [
  "Brand Strategy",
  "Advertising Campaign",
  "Branding",
  "Visual Identity Design",
  "Illustration",
  "Web Design",
  "Others",
];

export type WorkFilterBarProps = Readonly<{
  years: number[];
  filterYear: string;
  filterCat: string;
  onYearChange: (y: string) => void;
  onCatChange: (c: string) => void;
  children?: React.ReactNode;
}>;

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
        active
          ? "bg-black text-white border-black"
          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function WorkFilters({
  years,
  filterYear,
  filterCat,
  onYearChange,
  onCatChange,
  children,
}: WorkFilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Year row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Pill active={filterYear === "All"} onClick={() => onYearChange("All")}>All years</Pill>
          {years.map((y) => (
            <Pill
              key={y}
              active={filterYear === String(y)}
              onClick={() => onYearChange(String(y))}
            >
              {y}
            </Pill>
          ))}
        </div>
        <div className="text-sm text-gray-400">{children}</div>
      </div>

      {/* Category row */}
      <div className="flex flex-wrap gap-2">
        <Pill active={filterCat === "All"} onClick={() => onCatChange("All")}>All categories</Pill>
        {CATEGORY_PILLS.map((c) => (
          <Pill
            key={c}
            active={filterCat === c}
            onClick={() => onCatChange(c)}
          >
            {c}
          </Pill>
        ))}
      </div>
    </div>
  );
}