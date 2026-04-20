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

// First 6 services shown as individual filter pills
const MAIN_SERVICES = [
  "Brand Strategy",
  "Advertising Campaign",
  "Branding",
  "Visual Identity Design",
  "Illustration",
  "Web Design",
];

export type WorkPageProps = Readonly<{
  allProjects: Project[];
  latest?: Project;
  collabs: CollaborationDoc[];
}>;

export default function WorkPageClient({
  allProjects,
  latest,
  collabs,
}: WorkPageProps) {
  const years = useMemo(
    () => sortDesc(unique(allProjects.map((p) => p.general.year))),
    [allProjects]
  );

  const [filterYear, setFilterYear] = useState<string>("All");
  const [filterCat, setFilterCat] = useState<string>("All");

  const noFilters = filterYear === "All" && filterCat === "All";

  const filtered = useMemo(() => {
    const base = allProjects.filter((p) => {
      const yearMatch =
        filterYear === "All" || p.general.year === Number(filterYear);

      let catMatch = true;
      if (filterCat !== "All") {
        const services = p.notes?.services ?? [];
        if (filterCat === "Others") {
          // matches projects that have at least one service NOT in MAIN_SERVICES
          catMatch = services.some((s) => !MAIN_SERVICES.includes(s));
        } else {
          catMatch = services.includes(filterCat);
        }
      }
      return yearMatch && catMatch;
    });

    // When no filters: exclude the latest from grid (it's shown as featured hero)
    if (noFilters && latest) {
      return base.filter((p) => p.general.id !== latest.general.id);
    }
    return base;
  }, [allProjects, filterYear, filterCat, noFilters, latest]);

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
            filterYear={filterYear}
            filterCat={filterCat}
            onYearChange={setFilterYear}
            onCatChange={setFilterCat}
          >
            <ResultsBadge count={noFilters ? allProjects.length : filtered.length} />
          </WorkFilters>
        </Container>
      </section>

      {/* Work */}
      <section id="work" aria-labelledby="work-heading">
        <h2 id="work-heading" className="sr-only">
          Work
        </h2>
        {/* Only show featured latest when no filters are active */}
        <WorkSection projects={filtered} latest={noFilters ? latest : undefined} />
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
