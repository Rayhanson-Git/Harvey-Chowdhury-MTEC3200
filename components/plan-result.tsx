import { Button } from "@/components/ui/button";
import type { TransitionPlan } from "@/lib/plan-input";

function focusHeading(node: HTMLHeadingElement | null) {
  node?.focus();
}

function formatTime(value: Date, commitment: Date) {
  const time = value.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (value.getFullYear() === commitment.getFullYear() && value.getMonth() === commitment.getMonth() && value.getDate() === commitment.getDate()) return time;
  return `${time} · ${value.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

export function PlanResult({ plan, onEdit }: { plan: TransitionPlan; onEdit: () => void }) {
  return (
    <section aria-labelledby="result-title" className="space-y-6">
      <h2 id="result-title" ref={focusHeading} tabIndex={-1} className="text-sm font-medium uppercase tracking-wider outline-none">Stop workout</h2>
      <p className="rounded-lg border border-border px-4 py-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        <time dateTime={plan.stop.toISOString()}>{formatTime(plan.stop, plan.commitment)}</time>
      </p>
      {plan.stopHasPassed ? (
        <p role="alert" className="rounded-md border border-destructive p-3 text-sm leading-6 text-destructive">Your workout stop time has passed. Stop now and review your plan.</p>
      ) : null}
      <div className="space-y-2">
        <h3 className="text-sm font-medium uppercase tracking-wider">Leave by</h3>
        <p className="text-3xl font-semibold tracking-tight"><time dateTime={plan.leave.toISOString()}>{formatTime(plan.leave, plan.commitment)}</time></p>
      </div>
      <dl className="space-y-3 border-t border-border pt-5 text-sm">
        <div className="flex justify-between gap-4"><dt>Get ready</dt><dd>{plan.preparation} min</dd></div>
        <div className="flex justify-between gap-4"><dt>Commute</dt><dd>{plan.commute} min</dd></div>
        <div className="flex justify-between gap-4"><dt>Buffer</dt><dd>{plan.buffer} min</dd></div>
        <div className="flex justify-between gap-4 pt-3"><dt>Target arrival</dt><dd className="text-right"><time dateTime={plan.arrival.toISOString()}>{formatTime(plan.arrival, plan.commitment)}</time></dd></div>
        <div className="flex justify-between gap-4"><dt>Commitment</dt><dd className="text-right"><time dateTime={plan.commitment.toISOString()}>{plan.commitment.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}<br />{formatTime(plan.commitment, plan.commitment)}</time></dd></div>
      </dl>
      <Button type="button" onClick={onEdit} className="h-12 w-full text-base">Edit plan</Button>
      <p className="text-center text-sm text-muted-foreground">Times use your estimates</p>
    </section>
  );
}
