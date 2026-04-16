import type { Project } from "@/lib/types/project";
import { ProjectThumb } from "../ProjectThumb";
export function GridRowWide({ a }: { a: Project }) {
  return (
    <div className="mb-6">
      <div className="grid gap-6">
        <ProjectThumb p={a} ratio="3x1" />
      </div>
    </div>
  );
}
