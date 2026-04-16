"use client";
import { memo } from "react";
import { Container } from "@/components/public/layout/Container";
import type { CollaborationDoc } from "@/lib/types/collaboration";

export type CollaborationProposalsProps = Readonly<{
  collabs: CollaborationDoc[];
  title?: string;
}>;

export const CollaborationProposals = memo(function CollaborationProposals({
  collabs,
  title = "Collaboration Proposals",
}: CollaborationProposalsProps) {
  if (collabs.length === 0) return null;

  return (
    <section>
      <Container className="pb-16">
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3">{title}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {collabs.map((c) => (
              <article
                key={c.id ?? c.contact.email}
                className="border rounded-xl p-3"
              >
                <h3 className="font-medium">{c.projectTitle}</h3>
                <p className="text-sm opacity-80">{c.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
});
