import React from "react";
import { adminDb } from "@/lib/firebase/admin";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatGrid } from "@/components/admin/StatGrid";
import type { Stat } from "@/lib/admin/types";
// import { LinkButton } from "@/components/LinkButton";

export const dynamic = "force-static"; // or "force-dynamic" if counts change constantly

export default async function AdminPage() {
  const [
    projectsCountSnap,
    articlesCountSnap,
    offersCountSnap,
    collabsCountSnap,
  ] = await Promise.all([
    adminDb.collection("projects").count().get(),
    adminDb.collection("articles").count().get(),
    adminDb.collection("offers").count().get(),
    adminDb.collection("collaborations").count().get(),
  ]);

  const [pc, ac, oc, cc] = [
    projectsCountSnap.data().count,
    articlesCountSnap.data().count,
    offersCountSnap.data().count,
    collabsCountSnap.data().count,
  ];

  const stats: Stat[] = [
    { label: "Projects", value: pc },
    { label: "Articles", value: ac },
    { label: "Offers", value: oc },
    { label: "Collaborations", value: cc },
  ];

  return (
    <main className="p-4 md:p-6">
      <PageHeader
        title="Admin Overview"
        subtitle="Quick pulse of your content and activity."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Overview" },
        ]}
        actions={
          <>
            {/* <LinkButton href="/admin/new" variant="outline">
              New item
            </LinkButton>
            <LinkButton href="/admin/settings">Settings</LinkButton> */}
          </>
        }
      />

      <StatGrid stats={stats} columns={4} />
    </main>
  );
}
