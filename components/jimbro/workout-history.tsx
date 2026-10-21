import { useState } from "react";
import { Button } from "@/components/ui/button";
import { completedWorkout } from "@/lib/jimbro/session";
import type { Session } from "@/lib/jimbro/types";
import { secondaryStyle } from "./schedule-editor";
import { WorkoutLogger, type ChangeSession } from "./workout-logger";

export function WorkoutHistory({ sessions, busy, change }: { sessions: Session[]; busy: boolean; change: ChangeSession }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [month, setMonth] = useState("");
  const [label, setLabel] = useState("");
  const record = sessions.find((s) => s.id === selected);
  const visible = sessions.filter((s) => (!month || s.workoutDate.startsWith(month)) && s.label.toLowerCase().includes(label.toLowerCase()));
  const done = sessions.filter(completedWorkout);
  const days = new Set(done.map((s) => s.workoutDate));
  return <div className="space-y-6">
    <div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-black p-4"><p className="text-3xl font-semibold">{done.length}</p><p className="mt-1 text-xs text-neutral-400">Workouts with completed work</p></div><div className="rounded-2xl bg-black p-4"><p className="text-3xl font-semibold">{days.size}</p><p className="mt-1 text-xs text-neutral-400">Training days</p></div></div>
    <div className="grid gap-3 sm:grid-cols-2"><div><label htmlFor="history-month" className="mb-2 block text-sm">Month</label><input id="history-month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-12 w-full rounded-md border border-white/20 bg-black px-3" /></div><div><label htmlFor="history-label" className="mb-2 block text-sm">Workout day</label><input id="history-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Push, pull, legs…" className="h-12 w-full rounded-md border border-white/20 bg-black px-3" /></div></div>
    {visible.length ? <ul className="space-y-3">{visible.map((s) => <li key={s.id} className="rounded-xl border border-white/10 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-medium">{s.label}</h3><p className="mt-1 text-sm text-neutral-400">{s.workoutDate} · {s.sets.length} sets · {s.status}</p><p className="mt-1 text-xs text-neutral-400">{s.workoutTimezone}</p></div><Button className={secondaryStyle} onClick={() => setSelected(selected === s.id ? null : s.id)}>{selected === s.id ? "Close record" : "Review / correct"}</Button></div></li>)}</ul> : <p className="py-6 text-sm text-neutral-400">No sessions match yet. Your first completed set will start the story.</p>}
    {record ? <div className="rounded-2xl border border-rose-500/30 p-4"><h3 className="mb-4 text-lg font-medium">{record.workoutDate} · {record.label}</h3><WorkoutLogger key={record.id} session={record} busy={busy} change={change} /></div> : null}
    <p className="text-xs leading-5 text-neutral-400">Dates retain the timezone where each workout started. Empty starts and cancelled workouts are excluded from completed-workout totals.</p>
  </div>;
}
