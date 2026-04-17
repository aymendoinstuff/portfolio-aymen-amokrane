/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectForm from "@/components/admin/ProjectForm";
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export default async function EditProjectPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const snap = await adminDb.collection("projects").doc(id).get();

  return (
    <ProjectForm
      id={id}
      initial={snap.exists ? (snap.data() as any) : {}}
    />
  );
}
