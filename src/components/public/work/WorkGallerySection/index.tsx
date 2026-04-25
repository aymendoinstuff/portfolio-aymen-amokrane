"use client";
import { memo } from "react";
import { Container } from "@/components/public/layout/Container";
import type { Project } from "@/lib/types/project";
import { ProjectsGrid } from "./components/ProjectsGrid";

export type WorkSectionProps = Readonly<{ projects: Project[] }>;

export const WorkSection = memo(function WorkSection({ projects }: WorkSectionProps) {
  return (
    <section>
      <Container className="pb-16 px-2">
        <ProjectsGrid projects={projects} />
      </Container>
    </section>
  );
});
