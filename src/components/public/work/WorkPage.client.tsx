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
  latest?: Project; // kept for API compat, no longer used separately
  collabs: CollaborationDoc[];
}>;

export default function WorkPageClient({
  allProjects,
  collabs,
}: WorkPageProps) {
  const years = useMemo(
    () => sortDesc(unique(allProjects.map((p) => p.notes?.year || p.general.year))),
    [allProjects]
  );

  const [filterYear, setFilterYear] = useState<string>("All");
  const [filterCat, setFilterCat] = useState<string>("All");

  const noFilters = filterYear === "All" && filterCat === "All";
  const filtered = useMemo(() => {
    return allProjects.filter((p) => {
      const projectYear = p.notes?.year || p.general.year;
      const yearMatch =
        filterYear === "All" || projectYear === Number(filterYear);

      let catMatch = true;
      if (filterCat !== "All") {
        const services = p.notes?.services ?? [];
        if (filterCat === "Others") {
          catMatch = services.some((s) => !MAIN_SERVICES.includes(s));
        } else {
          catMatch = services.includes(filterCat);
        }
      }
      return yearMatch && catMatch;
    });
  }, [allProjects, filterYear, filterCat]);

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
        <WorkSection projects={filtered} />
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
