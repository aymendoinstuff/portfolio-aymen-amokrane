"use client";
import { useMemo, useState } from "react";
import { Container } from "@/components/public/layout/Container";
import { unique, sortDesc } from "@/lib/utils/array";
import type { Project } from "@/lib/types/project";
import type { CollaborationDoc } from "@/lib/types/collaboration";
import { WorkFilters } from "./WorkFiltersSection";
import { WorkSection } from "./WorkGallerySection";
import { CollaborationProposals } from "./CollaborationProposalsSections";
import { ResultsBadge } from "./ResultsBadge";

export type WorkPageProps = Readonly<{
  allProjects: Project[];
  latest?: Project;
  collabs: CollaborationDoc[];
}>;


export default function WorkPageClient ({
  allProjects,
  latest,
  collabs,
}: WorkPageProps) {
  const years = useMemo(
    () => sortDesc(unique(allProjects.map((p) => p.general.year))),
    [allProjects]
  );
  const cats = useMemo(
    () => unique(allProjects.flatMap((p) => p.general.tags)),
    [allProjects]
  );

  const [filterYear, setFilterYear] = useState<string>("All");
  const [filterCat, setFilterCat] = useState<string>("All");

  const filtered = useMemo(
    () =>
      allProjects.filter(
        (p) =>
          (filterYear === "All" || p.general.year === Number(filterYear)) &&
          (filterCat === "All" || p.general.tags.includes(filterCat))
      ),
    [allProjects, filterYear, filterCat]
  );

  return (
    <>
      {/* Filters */}
      <section aria-labelledby="filters">
        <Container className="pb-6">
          <h2 id="filters" className="sr-only">
            Filters
          </h2>
          <WorkFilters
            years={years}
            cats={cats}
            filterYear={filterYear}
            filterCat={filterCat}
            onYearChange={setFilterYear}
            onCatChange={setFilterCat}
          >
            <ResultsBadge count={filtered.length} />
          </WorkFilters>
        </Container>
      </section>

      {/* Work */}
      <section id="work" aria-labelledby="work-heading">
        <h2 id="work-heading" className="sr-only">
          Work
        </h2>
        <WorkSection projects={filtered} latest={latest} />
      </section>

      <div className="border-t my-10" />

      {/* Collaborations */}
      <section id="collaborations" aria-labelledby="collabs-heading">
        <h2 id="collabs-heading" className="sr-only">
          Collaborations
        </h2>
        <CollaborationProposals collabs={collabs} />
      </section>
    </>
  );
}
