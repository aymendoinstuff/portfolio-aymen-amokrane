export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center p-8 text-center">
      <div className="max-w-prose">
        <h1 className="text-2xl font-semibold mb-2">Project not found</h1>
        <p className="text-neutral-600">
          The project you’re looking for doesn’t exist or is unavailable.
        </p>
      </div>
    </main>
  );
}
