import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import type { Project } from "@/lib/types/project";

interface FeaturedProjectsSectionProps {
  projects: Project[];
  featuredProjectIds?: string[];
}

export default function FeaturedProjectsSection({
  projects,
  featuredProjectIds,
}: FeaturedProjectsSectionProps) {
  // Use admin-picked IDs when available, otherwise show 2 most recent
  let featured: Project[];
  if (featuredProjectIds && featuredProjectIds.length > 0) {
    featured = featuredProjectIds
      .map((id) => projects.find((p) => p.general.id === id || p.general.slug === id))
      .filter((p): p is Project => Boolean(p))
      .slice(0, 2);
  } else {
    featured = projects.slice(0, 2);
  }

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <SectionTitle>Featured projects</SectionTitle>
      <div className="grid gap-6 md:grid-cols-2">
        {featured.map((project) => (
          <Link
            key={project.general.id}
            href={`/work/${project.general.slug}`}
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-[2px]"
          >
            <div className="relative rounded-[2px] overflow-hidden group cursor-pointer h-full">
              {/* Hero Image */}
              <div className="w-full aspect-[2/1] overflow-hidden bg-gray-200">
                <img
                  src={project.general.heroUrl}
                  alt={project.general.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                <div className="text-white">
                  <div className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    {project.general.title}
                  </div>
                  {project.main.details.tagline && (
                    <div className="text-sm opacity-90 mt-1">
                      {project.main.details.tagline}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {project.general.tags.length > 0 && (
                <div className="absolute top-2 left-2 flex gap-2 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  {project.general.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] tracking-[0.2em] uppercase bg-white/90 text-black px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
