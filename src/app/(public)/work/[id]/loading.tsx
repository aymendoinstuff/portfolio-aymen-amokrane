export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-8 flex items-center justify-between">
        <div className="h-8 w-32 bg-neutral-200 animate-pulse rounded" />
        <div className="h-8 w-64 bg-neutral-200 animate-pulse rounded" />
        <div className="h-8 w-28 bg-neutral-200 animate-pulse rounded" />
      </div>
      <div className="max-w-6xl mx-auto px-4 grid gap-8">
        <div className="h-[80vh] bg-neutral-100 animate-pulse rounded" />
        <div className="h-[60vh] bg-neutral-100 animate-pulse rounded" />
      </div>
    </main>
  );
}
