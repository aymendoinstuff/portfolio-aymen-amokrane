"use client";
import { memo } from "react";
import { Container } from "@/components/public/layout/Container";
import type { Project } from "@/lib/types/project";
import { ProjectThumb } from "./components/ProjectThumb";
import { ProjectsGrid } from "./components/ProjectsGrid";

export type WorkSectionProps = Readonly<{
  projects: Project[];
  latest?: Project;
}>;

export const WorkSection = memo(function WorkSection({
  projects,
  latest,
}: WorkSectionProps) {
  return (
    <>
      <section>
        <Container className="pb-16">
          {latest && (
            <div className="mb-6">
              <ProjectThumb p={latest} ratio="2x1" />
            </div>
          )}
          <ProjectsGrid projects={projects} />
        </Container>
      </section>
    </>
  );
});
