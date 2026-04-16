import type { Project } from "@/lib/types/project";

export const isProject = (x: Project | undefined): x is Project => Boolean(x);