import type { ReactNode } from "react";

export function SectionCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-3xl border border-white/10 bg-jim-panel p-5 sm:p-8">
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-rose-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
