import type { Project } from "@/lib/types/project";
import { ProjectThumb } from "../ProjectThumb";
export function GridRowWide({ a, priority = false }: { a: Project; priority?: boolean }) {
  return (
    <div className="mb-6">
      <div className="grid gap-6">
        <ProjectThumb p={a} ratio="3x1" priority={priority} />
      </div>
    </div>
  );
}
