
import type { Project } from "@/lib/types/project";
import { ProjectThumb } from "../ProjectThumb";
export function GridRowTwoUp({ items, priority = false }: { items: Project[]; priority?: boolean }) {
  return (
    <div className="mb-6">
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((p, ix) => (
          <ProjectThumb key={p.general.id ?? p.general.slug} p={p} ratio="1x1" priority={priority && ix === 0} />
        ))}
      </div>
    </div>
  );
}
