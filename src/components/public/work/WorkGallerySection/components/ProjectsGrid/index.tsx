import { GridRowWide } from "./GridRowWide";
import { GridRowTwoUp } from "./GridRowTwoUp";
import type { Project } from "@/lib/types/project";
import { isProject } from "@/lib/utils/typeguards";

export type ProjectsGridProps = Readonly<{ projects: Project[] }>;

const pid = (p: Project) => p.general.id ?? p.general.slug ?? String(p.general?.title);

/**
 * Layout algorithm — alternates WIDE and TWO_UP:
 *   cycle_pos 0 → WIDE (1 project, full width)
 *   cycle_pos 1 → TWO_UP if ≥2 remain, else WIDE (1 leftover)
 *
 * Examples:
 *   3 → WIDE, TWO_UP
 *   4 → WIDE, TWO_UP, WIDE
 *   5 → WIDE, TWO_UP, WIDE, WIDE
 *   6 → WIDE, TWO_UP, WIDE, TWO_UP
 */
export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const valid = projects.filter(isProject);
  if (valid.length === 0) return null;

  const rows: React.ReactNode[] = [];
  let i = 0;
  let cyclePos = 0; // 0 = wide slot, 1 = two-up slot

  while (i < valid.length) {
    const remaining = valid.length - i;

    if (cyclePos === 0) {
      // Always show a full-width single
      const p = valid[i];
      rows.push(
        <GridRowWide key={`wide-${pid(p)}`} a={p} priority={rows.length === 0} />
      );
      i += 1;
      cyclePos = 1;
    } else {
      // Two-up if 2+ remain, else fall back to single wide
      if (remaining >= 2) {
        const items = [valid[i], valid[i + 1]];
        rows.push(
          <GridRowTwoUp
            key={`twoup-${items.map(pid).join("__")}`}
            items={items}
            priority={false}
          />
        );
        i += 2;
      } else {
        const p = valid[i];
        rows.push(
          <GridRowWide key={`wide-tail-${pid(p)}`} a={p} priority={false} />
        );
        i += 1;
      }
      cyclePos = 0;
    }
  }

  return <div className="flex flex-col gap-2">{rows}</div>;
}
