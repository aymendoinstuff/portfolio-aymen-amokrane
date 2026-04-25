import type { Project } from "@/lib/types/project";
import { ProjectThumb } from "../ProjectThumb";

export function GridRowWide({ a, priority = false }: { a: Project; priority?: boolean }) {
  return <ProjectThumb p={a} ratio="2x1" priority={priority} />;
}
