import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Brand design projects by Aymen Amokrane — identity systems, visual branding, and strategy-led design.",
  alternates: { canonical: "/work" },
  openGraph: { title: "Work — Aymen Amokrane", url: "/work", type: "website" },
};

import SectionTitle from "@/components/SectionTitle";
import ScrollProgress from "@/components/ScrollProgress";
import { Container } from "@/components/public/layout/Container"
import type { Project } from "@/lib/types/project";
import type { CollaborationDoc } from "@/lib/types/collaboration";

import { getBaseUrl } from '@/lib/getBaseUrl';
import { getServerSiteSettings } from "@/lib/settings/server";
import WorkPageClient from "@/components/public/work/WorkPage.client";

export const revalidate = 60;

async function getPublishedProjects(limit = 24) {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/public/work?limit=${limit}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { items: Project[] };
  return data.items ?? [];
}

async function getApprovedCollaborations(limit = 6) {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/public/collaborations?limit=${limit}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { items: CollaborationDoc[] };
  return data.items ?? [];
}

export default async function WorkPage() {
  const [allProjects, collabs, settings] = await Promise.all([
    getPublishedProjects(24),
    getApprovedCollaborations(6),
    getServerSiteSettings(),
  ]);

  const latest = allProjects[0];
  const pageTitle = settings.work?.pageTitle || "Latest project";

  return (
    <main>
      <ScrollProgress />
      <section>
        <Container className="pt-8 pb-10">
          <SectionTitle>{pageTitle}</SectionTitle>
        </Container>
      </section>
      <WorkPageClient allProjects={allProjects} collabs={collabs} latest={latest} />
    </main>
  );
}
