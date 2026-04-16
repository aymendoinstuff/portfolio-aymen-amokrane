import { GridRowWide } from "./GridRowWide";
import { GridRowTwoUp } from "./GridRowTwoUp";
import { GridRowFeature } from "./GridRowFeature";
import type { Project } from "@/lib/types/project";
import { isProject } from "@/lib/utils/typeguards";

export type ProjectsGridProps = Readonly<{ projects: Project[] }>;

type RowType = "WIDE" | "TWO_UP" | "FEATURE";
type Row = { type: RowType; items: Project[]; key: string };

const pid = (p: Project) => p.general.id ?? p.general.slug ?? String(p.general?.title);

const rowKey = (type: RowType, items: Project[]) =>
  `${type}__${items.map((p) => pid(p)).join("__")}`;

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const order: RowType[] = ["WIDE", "TWO_UP", "FEATURE"]; // visual rhythm
  const rows: Row[] = [];

  let i = 0;
  let t = 0;
  while (i < projects.length) {
    const type = order[t % order.length];

    if (type === "WIDE") {
      const items = [projects[i]].filter(isProject);
      if (items.length) {
        rows.push({ type, items, key: rowKey(type, items) });
      }
      i += 1;
    } else {
      const items = [projects[i], projects[i + 1]].filter(isProject);
      if (items.length) {
        rows.push({ type, items, key: rowKey(type, items) });
      }
      i += 2;
    }
    t++;
  }

  return (
    <div>
      {rows.map((row) => {
        switch (row.type) {
          case "WIDE":
            // key is derived from the project's identity, not the index
            return <GridRowWide key={row.key} a={row.items[0]} />;
          case "TWO_UP":
            return <GridRowTwoUp key={row.key} items={row.items} />;
          case "FEATURE":
          default:
            return <GridRowFeature key={row.key} items={row.items} />;
        }
      })}
    </div>
  );
}
