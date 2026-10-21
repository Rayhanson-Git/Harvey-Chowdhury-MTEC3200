import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, exercises } from "@/lib/jimbro/catalog";
import { saveSet } from "@/lib/jimbro/session";
import type { CompletedSet, Session, Unit } from "@/lib/jimbro/types";
import { buttonStyle, inputStyle, secondaryStyle } from "./schedule-editor";

export type ChangeSession = (id: string, expected: number, change: (current: Session) => Session) => Promise<boolean>;

export function WorkoutLogger({ session, busy, change }: { session: Session; busy: boolean; change: ChangeSession }) {
  const fieldPrefix = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [exerciseId, setExerciseId] = useState(exercises[0].id);
  const [reps, setReps] = useState("8");
  const [load, setLoad] = useState("0");
  const [unit, setUnit] = useState<Unit>("lb");
  const [editing, setEditing] = useState<CompletedSet | null>(null);
  const [editRevision, setEditRevision] = useState(session.revision);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const pendingId = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const filtered = exercises.filter((e) => (category === "All" || e.category === category) && `${e.name} ${e.equipment}`.toLowerCase().includes(query.toLowerCase()));
  const selected = exercises.find((e) => e.id === exerciseId)!;
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setSaved("");
    if (!/^\d+$/.test(reps.trim()) || !Number.isSafeInteger(Number(reps)) || Number(reps) <= 0 || !/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(load.trim()) || !Number.isFinite(Number(load))) { setError("Enter positive whole reps and a load of zero or more."); return; }
    pendingId.current ||= crypto.randomUUID();
    const entry: CompletedSet = { id: editing?.id || pendingId.current, exerciseId, exerciseName: editing?.exerciseId === exerciseId ? editing.exerciseName : selected.name, reps: Number(reps), load: Number(load), unit, completedAt: editing?.completedAt || Date.now() };
    const ok = await change(session.id, editing ? editRevision : session.revision, (current) => saveSet(current, entry));
    if (ok) { setSaved(editing ? "Set corrected and saved." : "Completed set saved."); setEditing(null); pendingId.current = null; }
  }
  function edit(entry: CompletedSet) {
    setEditing(entry); setEditRevision(session.revision); setExerciseId(entry.exerciseId); setReps(String(entry.reps)); setLoad(String(entry.load)); setUnit(entry.unit); setSaved(""); setError("");
    formRef.current?.querySelector<HTMLInputElement>('input[name="reps"]')?.focus();
  }
  return <div className="space-y-6">
    <div className="flex items-center justify-between gap-3"><p className="text-sm text-neutral-400">{session.sets.length} completed {session.sets.length === 1 ? "set" : "sets"}</p><span className="rounded-full border border-white/15 px-3 py-1 text-xs">{session.label}</span></div>
    {session.actual.workoutEndedAt || session.status !== "active" ? <p className="rounded-xl border border-white/15 p-3 text-sm text-neutral-300">Workout finished. You can still correct a record or add a missed completed set.</p> : null}
    <div className="grid gap-3 sm:grid-cols-2"><div><label htmlFor={`search-${fieldPrefix}`} className="mb-2 block text-sm">Find an exercise</label><Input id={`search-${fieldPrefix}`} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name or equipment" className={inputStyle} /></div><div><label htmlFor={`category-${fieldPrefix}`} className="mb-2 block text-sm">Muscle group</label><select id={`category-${fieldPrefix}`} value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputStyle} w-full rounded-md border px-3`}>{["All", ...categories].map((x) => <option key={x}>{x}</option>)}</select></div></div>
    <div className="grid max-h-52 grid-cols-1 gap-2 overflow-auto sm:grid-cols-2" aria-label="Exercise library">{filtered.map((e) => <button key={e.id} type="button" aria-pressed={exerciseId === e.id} onClick={() => { setExerciseId(e.id); setSaved(""); }} className={`min-h-14 rounded-xl border p-3 text-left focus-visible:outline-2 focus-visible:outline-rose-400 ${exerciseId === e.id ? "border-rose-500 bg-rose-500/10" : "border-white/10 hover:border-white/30"}`}><span className="block text-sm font-medium">{e.name}</span><span className="text-xs text-neutral-400">{e.category} · {e.equipment}</span></button>)}{filtered.length === 0 ? <p className="text-sm text-neutral-400">No matches. Try another name or group.</p> : null}</div>
    <form ref={formRef} onSubmit={submit} noValidate className="space-y-4 rounded-2xl border border-white/10 bg-black p-4">
      <h3 className="font-medium">{editing ? "Correct set" : "Log a completed set"} · {selected?.name || editing?.exerciseName}</h3>
      <div className="grid grid-cols-3 gap-3"><div><label className="mb-2 block text-sm" htmlFor={`reps-${fieldPrefix}`}>Reps</label><Input id={`reps-${fieldPrefix}`} name="reps" inputMode="numeric" value={reps} onChange={(e) => { setReps(e.target.value); setSaved(""); }} className={inputStyle} /></div><div><label className="mb-2 block text-sm" htmlFor={`load-${fieldPrefix}`}>Load</label><Input id={`load-${fieldPrefix}`} inputMode="decimal" value={load} onChange={(e) => { setLoad(e.target.value); setSaved(""); }} className={inputStyle} /></div><div><label className="mb-2 block text-sm" htmlFor={`unit-${fieldPrefix}`}>Unit</label><select id={`unit-${fieldPrefix}`} value={unit} onChange={(e) => setUnit(e.target.value as Unit)} className={`${inputStyle} w-full rounded-md border px-2`}><option>lb</option><option>kg</option></select></div></div>
      <p className="text-xs text-neutral-400">Enter added load. Use 0 for an unloaded or body-weight set.</p>
      {error ? <p role="alert" className="text-sm text-rose-300">{error}</p> : null}
      <p role="status" className="text-sm text-emerald-300">{saved}</p>
      {editing && editRevision !== session.revision ? <button type="button" className="min-h-11 text-sm text-amber-200 underline" onClick={() => setEditRevision(session.revision)}>Use my correction with the latest saved workout</button> : null}
      <div className="flex flex-wrap gap-3"><Button disabled={busy} className={`${buttonStyle} flex-1`} type="submit">{busy ? "Saving…" : editing ? "Save correction" : "Save completed set"}</Button>{editing ? <Button type="button" className={secondaryStyle} onClick={() => { setEditing(null); pendingId.current = null; }}>Cancel edit</Button> : null}</div>
    </form>
    <ol className="space-y-3" aria-label="Completed sets">{session.sets.map((entry, index) => <li key={entry.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3"><div><p className="text-sm"><span className="mr-2 text-neutral-400">{String(index + 1).padStart(2, "0")}</span>{entry.exerciseName}</p><p className="mt-1 text-xs text-neutral-400">{entry.reps} reps × {entry.load} {entry.unit}</p></div><div className="flex gap-2"><Button type="button" className={secondaryStyle} disabled={busy} onClick={() => edit(entry)}>Edit</Button><Button type="button" className={secondaryStyle} disabled={busy} onClick={async () => { if (await change(session.id, session.revision, (current) => ({ ...current, sets: current.sets.filter((s) => s.id !== entry.id) }))) { if (editing?.id === entry.id) setEditing(null); setSaved("Set removed."); } }}>Remove</Button></div></li>)}</ol>
    <p className="text-xs text-neutral-400">24 common exercises · Original JimBro starter catalog</p>
  </div>;
}
