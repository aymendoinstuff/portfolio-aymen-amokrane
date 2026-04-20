/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";
import { Plus, Eye, EyeOff, Pencil, ExternalLink } from "lucide-react";
import { DeleteProjectButton } from "@/components/admin/ui/DeleteProjectButton";

export const dynamic = "force-dynamic";

export default async function ProjectsAdmin() {
  const snap = await adminDb
    .collection("projects")
    .orderBy("general.updatedAt", "desc")
    .limit(100)
    .get()
    .catch(async () => {
      // Fallback: some projects may use old flat schema
      return adminDb.collection("projects").limit(100).get();
    });

  const list = snap.docs.map((d) => {
    const data = d.data() as any;
    // Support both new nested schema (general.title) and old flat schema (title)
    return {
      id: d.id,
      title: data.general?.title ?? data.title ?? "(untitled)",
      year: data.general?.year ?? data.year ?? "—",
      published: data.general?.published ?? data.published ?? false,
      heroUrl: data.general?.heroUrl ?? data.heroUrl ?? null,
      tags: data.general?.tags ?? data.tags ?? [],
      client: data.main?.details?.client ?? data.client ?? null,
      updatedAt: data.general?.updatedAt ?? data.updatedAt ?? 0,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {list.length} {list.length === 1 ? "project" : "projects"} total
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          New project
        </Link>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {list.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              No projects yet
            </h2>
            <p className="text-sm text-gray-500 max-w-xs mb-6">
              Start building your portfolio by adding your first project.
            </p>
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} />
              Add your first project
            </Link>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {list.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: {
    id: string;
    title: string;
    year: number | string;
    published: boolean;
    heroUrl: string | null;
    tags: string[];
    client: string | null;
  };
}) {
  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all">
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {project.heroUrl ? (
          <img
            src={project.heroUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-2.5 right-2.5">
          <span
            className={[
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
              project.published
                ? "bg-green-100 text-green-700"
                : "bg-gray-100/90 backdrop-blur-sm text-gray-500",
            ].join(" ")}
          >
            {project.published ? (
              <Eye size={10} />
            ) : (
              <EyeOff size={10} />
            )}
            {project.published ? "Live" : "Draft"}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 flex-1">
            {project.title}
          </h3>
          <span className="text-xs text-gray-400 shrink-0 mt-0.5">
            {project.year}
          </span>
        </div>
        {project.client && (
          <p className="text-xs text-gray-500 mb-2">{project.client}</p>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full text-xs">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-1.5 pt-3 border-t border-gray-100">
          <Link
            href={`/admin/projects/${project.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Pencil size={12} />
            Edit
          </Link>
          <Link
            href={`/work/${project.id}`}
            target="_blank"
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ExternalLink size={12} />
            View
          </Link>
          <DeleteProjectButton id={project.id} title={project.title} variant="icon" />
        </div>
      </div>
    </div>
  );
}
