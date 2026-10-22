import { Button } from "@/components/ui/button";
import { clockText, deadlines, formatMoment, phaseAt } from "@/lib/jimbro/schedule";
import type { Session } from "@/lib/jimbro/types";

export function SessionCountdown({ session, now, onExpand }: { session: Session; now: number; onExpand: () => void }) {
  const phase = phaseAt(session, now);
  const times = deadlines(session.schedule);
  const stillAtGym = !session.actual.arrivedAt && !session.actual.departedAt;
  const overdue = stillAtGym && now >= times.departure ? "Departure overdue" : stillAtGym && !session.actual.workoutEndedAt && now >= times.stop ? "Workout stop time passed" : null;
  return <aside aria-label="Session countdown" className="rounded-2xl border border-jim-accent/40 bg-jim-input p-4 shadow-lg shadow-black/50">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-widest text-jim-accent">{phase.label}</p><p className="mt-1 font-mono text-3xl font-semibold tabular-nums" aria-label={`${phase.label} countdown`}>{clockText(phase.deadline - now)}</p></div><Button type="button" onClick={onExpand} className="min-h-11 border border-jim-border-strong bg-jim-input text-jim-text hover:bg-jim-hover">View plan</Button></div>
    <p className="mt-2 text-xs text-jim-muted">{formatMoment(phase.deadline, session.schedule.timezone)}</p>
    {overdue ? <p className="mt-2 text-sm text-jim-warning">{overdue} · {clockText(now - (now >= times.departure ? times.departure : times.stop))} overdue</p> : null}
  </aside>;
}
