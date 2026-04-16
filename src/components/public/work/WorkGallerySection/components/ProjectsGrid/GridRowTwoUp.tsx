
import type { Project } from "@/lib/types/project";
import { ProjectThumb } from "../ProjectThumb";
export function GridRowTwoUp({ items }: { items: Project[] }) {
  return (
    <div className="mb-6">
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((p) => (
          <ProjectThumb key={p.general.id ?? p.general.slug} p={p} ratio="1x1" />
        ))}
      </div>
    </div>
  );
}
