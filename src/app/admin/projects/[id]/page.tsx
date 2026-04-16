/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectForm from "@/components/admin/ProjectForm";
import { adminDb } from "@/lib/firebase/admin";

export default async function ProjectPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params; 
  const ref = await adminDb.collection("projects").doc(id).get();

  return (
    <main className="grid gap-4">
      <div className="text-xl font-semibold">Edit Project</div>
      <ProjectForm id={id} initial={ref.exists ? (ref.data() as any) : {}} />
    </main>
  );
}
