"use client";
export default function ErrorBoundary({ reset }: { reset: () => void }) {
  return (
    <main className="jim-theme min-h-screen bg-jim-background p-8 text-jim-text">
      <h1 className="text-2xl font-semibold">Let’s recover your workout.</h1>
      <p className="my-5 max-w-xl text-sm leading-6 text-jim-secondary">
        The view could not load. Stored data has not been reset. Retry, or
        reopen JimBro in the same browser. Avoid clearing site data.
      </p>
      <button className="min-h-12 rounded-xl bg-rose-700 px-5 text-white" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
