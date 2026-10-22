import { useState } from "react";
import { Button } from "@/components/ui/button";
import { phaseAt } from "@/lib/jimbro/schedule";
import type { Session } from "@/lib/jimbro/types";
import type { ChangeSession } from "./workout-logger";
import { buttonStyle, secondaryStyle } from "./schedule-editor";

function focusHeading(node: HTMLHeadingElement | null) { node?.focus(); }

export function SessionActions({ session, now, busy, change }: { session: Session; now: number; busy: boolean; change: ChangeSession }) {
  const [confirm, setConfirm] = useState<"completed" | "cancelled" | null>(null);
  const phase = phaseAt(session, now);
  const actions = [{ key: "workoutEndedAt", label: "Finish exercise" }, { key: "preparationCompletedAt", label: "Ready to leave" }, { key: "departedAt", label: "I’ve left" }, { key: "arrivedAt", label: "I’ve arrived" }] as const;
  return <div className="space-y-5">
    <div role="status" aria-live="polite"><h3 className="font-semibold text-jim-accent">{phase.title}</h3><p className="mt-2 text-sm leading-6 text-jim-muted">{phase.message}</p></div>
    <div className="grid gap-3 sm:grid-cols-2">{actions.map(({ key, label }) => <Button key={key} type="button" disabled={busy || !!session.actual[key]} className={secondaryStyle} onClick={() => change(session.id, session.revision, (current) => ({ ...current, actual: { ...current.actual, [key]: Date.now() } }))}>{session.actual[key] ? `${label} · recorded` : label}</Button>)}</div>
    <p className="text-xs leading-5 text-jim-muted">These buttons record what you actually did. Finishing exercise keeps your departure reminder active.</p>
    {confirm ? <div className="space-y-3 rounded-xl border border-jim-warning/30 p-4"><h3 tabIndex={-1} ref={focusHeading} className="font-medium outline-none">{confirm === "completed" ? "Finish this session?" : "Cancel this session?"}</h3><p className="text-sm text-jim-secondary">Recorded sets stay in history. This ends the countdown and alerts; it does not record an arrival.</p><div className="flex flex-wrap gap-3"><Button disabled={busy} className={buttonStyle} onClick={() => change(session.id, session.revision, (current) => ({ ...current, status: confirm, actual: confirm === "completed" ? { ...current.actual, workoutEndedAt: current.actual.workoutEndedAt || Date.now() } : current.actual }))}>Confirm {confirm === "completed" ? "finish" : "cancel"}</Button><Button className={secondaryStyle} onClick={() => setConfirm(null)}>Keep session</Button></div></div> : <div className="flex flex-wrap gap-3 border-t border-jim-border-soft pt-4"><Button disabled={busy} className={buttonStyle} onClick={() => setConfirm("completed")}>Finish session</Button><Button disabled={busy} className={secondaryStyle} onClick={() => setConfirm("cancelled")}>Cancel session</Button></div>}
  </div>;
}
