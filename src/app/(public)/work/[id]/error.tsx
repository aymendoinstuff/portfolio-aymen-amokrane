"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen grid place-items-center p-8 text-center">
      <div className="max-w-prose">
        <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
        <p className="text-neutral-600 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="rounded-full border-2 border-black px-3 py-1.5 hover:bg-black hover:text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
