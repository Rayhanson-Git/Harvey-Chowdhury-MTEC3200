import { PlanForm } from "@/components/plan-form";

export default function Home() {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-8 font-sans sm:items-center sm:px-6 sm:py-12">
      <section aria-labelledby="app-title" className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
        <header className="mb-8 space-y-2">
          <h1 id="app-title" className="text-3xl font-semibold tracking-tight">LeaveBy</h1>
          <p className="text-sm leading-6 text-muted-foreground">Plan the transition from your workout to what’s next.</p>
        </header>
        <PlanForm />
      </section>
    </main>
  );
}
