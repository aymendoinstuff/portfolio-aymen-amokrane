import type { Project } from "@/lib/types/project";
import { ProjectThumb } from "../ProjectThumb";
export function GridRowFeature({ items }: { items: Project[] }) {
  const [first, second] = items;
  return (
    <div className="mb-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProjectThumb p={first} ratio="2x1" />
        </div>
        {second && (
          <ProjectThumb key={second.general.id ?? second.general.slug} p={second} ratio="1x1" />
        )}
      </div>
    </div>
  );
}
