"use client";
export default function ErrorBoundary({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen bg-[#0c0d0f] p-8 text-white">
      <h1 className="text-2xl font-semibold">Let’s recover your workout.</h1>
      <p className="my-5 max-w-xl text-sm leading-6 text-neutral-300">
        The view could not load. Stored data has not been reset. Retry, or
        reopen JimBro in the same browser. Avoid clearing site data.
      </p>
      <button className="min-h-12 rounded-xl bg-rose-700 px-5" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
