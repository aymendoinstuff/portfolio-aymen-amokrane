import ProjectForm from "@/components/admin/ProjectForm";
export default function NewProject() {
  return (
    <main className="grid gap-4">
      <div className="text-xl font-semibold">New Project</div>
      <ProjectForm />
    </main>
  );
}
