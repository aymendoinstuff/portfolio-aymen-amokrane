/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectForm from "@/components/admin/ProjectForm";
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export default async function EditProjectPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const snap = await adminDb.collection("projects").doc(id).get();

  // Sanitise via JSON round-trip so that any Firestore Timestamps (or other
  // non-plain objects) are coerced to plain values before being passed as props
  // to the "use client" ProjectForm.  Only forward the fields the form needs so
  // that internal metadata (_duplicatedFrom, _duplicatedAt, etc.) never reaches
  // the client component at all.
  let initial: Record<string, unknown> = {};
  if (snap.exists) {
    const raw = snap.data() as any;
    const picked = {
      general: raw.general,
      main:    raw.main,
      notes:   raw.notes,
      extra:   raw.extra,
    };
    initial = JSON.parse(JSON.stringify(picked));
  }

  return <ProjectForm id={id} initial={initial} />;
}
