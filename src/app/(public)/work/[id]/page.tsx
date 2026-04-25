import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Project } from "@/lib/types/project";
import ProjectViewer from "./ProjectViewer.client";
import { repoGetPublishedProjects } from "@/lib/repositories/projects";

export const revalidate = 60; // same cache policy as multi-project page
export const dynamicParams = true; // ✅ allow fallback for new ids

async function getProject(id: string) {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/public/work/${id}`, {
    next: { revalidate },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch project");

  const data = (await res.json()) as { item: Project };
  return data.item;
}


// /** ✅ Prebuild known ids (SSG/ISR) while still allowing runtime fallback */
// export async function generateStaticParams() {
//   const base = await getBaseUrl();
//   const res = await fetch(`${base}/api/public/work?select=id`, {
//     next: { revalidate },
//   });
//   if (!res.ok) return [];
//   const data = (await res.json()) as { items: Array<{ id: string }> };
//   return (data.items ?? []).map(({ id }) => ({ id }));
// }

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: "Project not found" };

  const title = project.general.title ?? "Project";
  const description =
    project.main?.details?.tagline ??
    project.main?.details?.summary ??
    "Brand design case study by Aymen Amokrane.";
  const image = project.general.heroUrl ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `/work/${id}` },
    openGraph: {
      title,
      description,
      url: `/work/${id}`,
      type: "article",
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, allProjects] = await Promise.all([
    getProject(id),
    repoGetPublishedProjects(20),
  ]);
  if (!project) notFound();

  // 2 related projects: same tags first, then any others
  const related = allProjects
    .filter((p) => p.general.id !== id && p.general.slug !== id)
    .sort((a, b) => {
      const aTags = project.general.tags ?? [];
      const aShared = a.general.tags?.filter((t) => aTags.includes(t)).length ?? 0;
      const bShared = b.general.tags?.filter((t) => aTags.includes(t)).length ?? 0;
      return bShared - aShared;
    })
    .slice(0, 2);

  return <ProjectViewer project={project} relatedProjects={related} />;
}
