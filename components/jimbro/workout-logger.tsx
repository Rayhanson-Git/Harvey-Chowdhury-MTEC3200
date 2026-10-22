"use client";
import { makeId } from "@/lib/jimbro/identity";
import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, exercises } from "@/lib/jimbro/catalog";
import { saveSet, validateSet } from "@/lib/jimbro/session";
import { convertLoad, personalBest, previousSet } from "@/lib/jimbro/routines";
import type {
  CompletedSet,
  Session,
  Unit,
  SetKind,
  Preferences,
} from "@/lib/jimbro/types";
import { defaultPreferences } from "@/lib/jimbro/types";
import { AppDialog } from "./app-dialog";
import { buttonStyle, inputStyle, secondaryStyle } from "./schedule-editor";
export type ChangeSession = (
  id: string,
  expected: number,
  change: (s: Session) => Session,
) => Promise<boolean>;
export function WorkoutLogger({
  session,
  busy,
  change,
  history = [],
  preferences = defaultPreferences,
  onEvent,
}: {
  session: Session;
  busy: boolean;
  change: ChangeSession;
  history?: Session[];
  preferences?: Preferences;
  onEvent?: (event: "set" | "progress", id: string) => void;
}) {
  const prefix = useId(),
    pending = useRef<string | null>(null),
    form = useRef<HTMLFormElement>(null);
  const [exerciseId, setExercise] = useState(
      session.plan?.[0]?.exerciseId || exercises[0].id,
    ),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [reps, setReps] = useState(String(session.plan?.[0]?.reps || 8)),
    [load, setLoad] = useState("0"),
    [unit, setUnit] = useState<Unit>(preferences.unit),
    [kind, setKind] = useState<SetKind>(session.plan?.[0]?.kind || "external"),
    [measure, setMeasure] = useState("60"),
    [notes, setNotes] = useState(""),
    [removing, setRemoving] = useState<CompletedSet | null>(null),
    [editing, setEditing] = useState<CompletedSet | null>(null),
    [revision, setRevision] = useState(session.revision),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const selected = exercises.find((e) => e.id === exerciseId),
    previous = previousSet(exerciseId, history, session.id, kind);
  const filtered = exercises.filter(
    (e) =>
      (category === "All" || e.category === category) &&
      `${e.name} ${e.equipment} ${(e.aliases || []).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  function pick(id: string) {
    setExercise(id);
    const e = exercises.find((e) => e.id === id);
    setKind(
      session.plan?.find((e) => e.exerciseId === id)?.kind ||
        e?.kind ||
        (["Body weight", "Pull-up bar", "Parallel bars"].includes(
          e?.equipment || "",
        )
          ? "bodyweight"
          : "external"),
    );
    setReps(String(session.plan?.find((x) => x.exerciseId === id)?.reps || 8));
    setMessage("");
  }
  function edit(s: CompletedSet) {
    setEditing(s);
    setRevision(session.revision);
    setExercise(s.exerciseId);
    setReps(String(s.reps));
    setLoad(String(s.load));
    setUnit(s.unit);
    setKind(s.kind || "external");
    setMeasure(String(s.kind === "distance" ? s.distanceKm : s.seconds || 60));
    setNotes(s.notes || "");
    setMessage("");
    form.current?.scrollIntoView({ block: "center", behavior: "instant" });
    form.current?.querySelector<HTMLInputElement>("input")?.focus();
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    pending.current ||= makeId();
    const entry: CompletedSet = {
      id: editing?.id || pending.current,
      exerciseId,
      exerciseName: selected?.name || editing?.exerciseName || "Exercise",
      reps: kind === "timed" || kind === "distance" ? 0 : Number(reps),
      load:
        kind === "bodyweight" || kind === "timed" || kind === "distance"
          ? 0
          : Number(load),
      unit,
      kind,
      completedAt: editing?.completedAt || Date.now(),
      notes: notes.trim().slice(0, 500),
      ...(kind === "timed"
        ? { seconds: Number(measure) }
        : kind === "distance"
          ? { distanceKm: Number(measure) }
          : {}),
    };
    try {
      if ((kind === "external" || kind === "assisted") && !load.trim())
        throw new Error("Enter a load, including zero when unloaded.");
      validateSet(entry);
    } catch (reason) {
      setError((reason as Error).message);
      return;
    }
    const rest =
      session.plan?.find((e) => e.exerciseId === exerciseId)?.rest ?? 90;
    const ok = await change(
      session.id,
      editing ? revision : session.revision,
      (s) => {
        const saved = saveSet(s, entry);
        return !editing && preferences.autoRest && preferences.restEnabled
          ? { ...saved, rest: { endsAt: Date.now() + rest * 1000 } }
          : saved;
      },
    );
    if (ok) {
      setMessage(editing ? "Correction saved." : "Completed set saved.");
      onEvent?.(
        personalBest(entry, history) ? "progress" : "set",
        entry.id + (editing ? ":edit:" + session.revision : ""),
      );
      setEditing(null);
      pending.current = null;
    }
  }
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-jim-muted">
          {session.sets.length} completed sets
        </p>
        <span className="rounded-full border border-jim-border px-3 py-1 text-xs">
          {session.label}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Find an exercise
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${inputStyle} mt-2`}
            placeholder="Name or equipment"
          />
        </label>
        <label className="text-sm">
          Muscle group
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputStyle} mt-2 w-full rounded-xl border px-3`}
          >
            {["All", ...categories].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <div
        aria-label="Exercise library"
        className="grid max-h-44 grid-cols-1 gap-2 overflow-auto sm:grid-cols-2"
      >
        {filtered.map((e) => (
          <button
            type="button"
            key={e.id}
            aria-pressed={exerciseId === e.id}
            onClick={() => pick(e.id)}
            className={`min-h-14 rounded-xl border p-3 text-left ${exerciseId === e.id ? "border-jim-accent bg-rose-500/10" : "border-jim-border-soft hover:bg-jim-hover"}`}
          >
            <span className="block text-sm">{e.name}</span>
            <small className="text-jim-muted">
              {e.category} · {e.equipment}
            </small>
          </button>
        ))}
        {!filtered.length ? (
          <p className="py-3 text-sm text-jim-muted">
            No matches. Try another name or muscle group.
          </p>
        ) : null}
      </div>
      <form
        ref={form}
        onSubmit={submit}
        noValidate
        className="space-y-4 rounded-2xl border border-jim-border bg-jim-inset p-4"
      >
        <h3 className="text-lg font-semibold">
          {editing ? "Correct set" : "Log completed set"}
          <span className="mt-1 block text-sm font-normal text-jim-muted">
            {selected?.name || editing?.exerciseName}
          </span>
        </h3>
        {previous ? (
          <div className="rounded-xl bg-jim-hover p-3 text-sm">
            <p>
              Last time:{" "}
              {previous.kind === "timed"
                ? `${previous.seconds} seconds`
                : previous.kind === "distance"
                  ? `${previous.distanceKm} km`
                  : `${previous.reps} reps · ${Number(convertLoad(previous.load, previous.unit, unit).toFixed(2))} ${unit} ${previous.kind === "assisted" ? "assistance" : previous.kind === "bodyweight" ? "bodyweight (no added load)" : "external load"}`}
            </p>
            <Button
              className={`${secondaryStyle} mt-2`}
              type="button"
              onClick={() => {
                setReps(String(previous.reps));
                setLoad(
                  String(
                    Number(
                      convertLoad(previous.load, previous.unit, unit).toFixed(
                        2,
                      ),
                    ),
                  ),
                );
                setKind(previous.kind || "external");
                setMeasure(
                  String(
                    previous.kind === "distance"
                      ? previous.distanceKm
                      : previous.seconds || 60,
                  ),
                );
              }}
            >
              Reuse values
            </Button>
          </div>
        ) : (
          <p className="text-xs text-jim-muted">
            No previous comparable entry for this exercise yet.
          </p>
        )}
        <label className="block text-sm">
          Measure
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as SetKind)}
            className={`${inputStyle} mt-2 w-full rounded-xl border px-2`}
          >
            <option value="external">Reps + external load</option>
            <option value="bodyweight">Bodyweight reps (no added load)</option>
            <option value="assisted">Reps + assistance</option>
            <option value="timed">Time (seconds)</option>
            <option value="distance">Distance (km)</option>
          </select>
        </label>
        {kind === "timed" || kind === "distance" ? (
          <label className="block text-sm">
            {kind === "timed" ? "Seconds" : "Distance (km)"}
            <Input
              inputMode="decimal"
              value={measure}
              onChange={(e) => setMeasure(e.target.value)}
              className={`${inputStyle} mt-2`}
            />
          </label>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <label className="text-sm" htmlFor={`${prefix}-reps`}>
              Reps
              <Input
                id={`${prefix}-reps`}
                name="reps"
                inputMode="numeric"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className={`${inputStyle} mt-2`}
              />
            </label>
            {kind !== "bodyweight" ? (
              <>
                <label className="text-sm" htmlFor={`${prefix}-load`}>
                  {kind === "assisted" ? "Assistance" : "Load"}
                  <Input
                    id={`${prefix}-load`}
                    inputMode="decimal"
                    value={load}
                    onChange={(e) => setLoad(e.target.value)}
                    className={`${inputStyle} mt-2`}
                  />
                </label>
                <label className="text-sm">
                  Unit
                  <select
                    value={unit}
                    onChange={(e) => {
                      const next = e.target.value as Unit;
                      if (load.trim() && Number.isFinite(Number(load)))
                        setLoad(
                          String(
                            Number(
                              convertLoad(Number(load), unit, next).toFixed(3),
                            ),
                          ),
                        );
                      setUnit(next);
                    }}
                    className={`${inputStyle} mt-2 w-full rounded-xl border px-2`}
                  >
                    <option>kg</option>
                    <option>lb</option>
                  </select>
                </label>
              </>
            ) : null}
          </div>
        )}
        <label className="block text-sm">
          Set notes (optional)
          <Input
            maxLength={500}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`${inputStyle} mt-2`}
          />
        </label>
        {error ? (
          <p role="alert" className="text-sm text-jim-accent">
            {error}
          </p>
        ) : null}
        <p role="status" className="text-sm text-jim-positive">
          {message}
        </p>
        {editing && revision !== session.revision ? (
          <Button
            className={secondaryStyle}
            type="button"
            onClick={() => setRevision(session.revision)}
          >
            Apply correction to latest saved workout
          </Button>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={busy}
            className={`${buttonStyle} flex-1`}
            type="submit"
          >
            {busy
              ? "Saving…"
              : editing
                ? "Save correction"
                : "Save completed set"}
          </Button>
          {editing ? (
            <Button
              className={secondaryStyle}
              type="button"
              onClick={() => {
                setEditing(null);
                pending.current = null;
              }}
            >
              Cancel edit
            </Button>
          ) : null}
        </div>
      </form>
      <ol aria-label="Completed sets" className="space-y-3">
        {session.sets.map((s, i) => (
          <li
            key={s.id}
            className="flex flex-wrap justify-between gap-3 border-t border-jim-border-soft pt-3"
          >
            <div>
              <p className="text-sm">
                {i + 1}. {s.exerciseName}
              </p>
              <p className="mt-1 text-xs text-jim-muted">
                {s.kind === "timed"
                  ? `${s.seconds}s`
                  : s.kind === "distance"
                    ? `${s.distanceKm} km`
                    : s.kind === "bodyweight"
                      ? `${s.reps} bodyweight reps`
                      : `${s.reps} reps × ${s.load} ${s.unit}${s.kind === "assisted" ? " assistance" : ""}`}
              </p>
              {s.notes ? (
                <p className="mt-1 max-w-sm text-xs text-jim-muted">
                  {s.notes}
                </p>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button
                className={secondaryStyle}
                disabled={busy}
                onClick={() => edit(s)}
              >
                Edit
              </Button>
              <Button
                className={secondaryStyle}
                disabled={busy}
                onClick={() => setRemoving(s)}
              >
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ol>
      {removing ? (
        <AppDialog
          title="Remove this completed set?"
          onClose={() => setRemoving(null)}
        >
          <p className="text-sm">
            {removing.exerciseName}: this removes the saved set from your
            workout and progress.
          </p>
          <Button
            className={`${buttonStyle} mt-5`}
            disabled={busy}
            onClick={async () => {
              if (
                await change(session.id, session.revision, (c) => ({
                  ...c,
                  sets: c.sets.filter((x) => x.id !== removing.id),
                }))
              ) {
                if (editing?.id === removing.id) {
                  setEditing(null);
                  pending.current = null;
                }
                setRemoving(null);
              }
            }}
          >
            Confirm remove set
          </Button>
        </AppDialog>
      ) : null}
    </div>
  );
}
