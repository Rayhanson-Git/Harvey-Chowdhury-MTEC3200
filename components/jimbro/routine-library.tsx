"use client";
import { makeId } from "@/lib/jimbro/identity";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { exercises } from "@/lib/jimbro/catalog";
import {
  durationRange,
  planned,
  starterRoutines,
  validateRoutine,
} from "@/lib/jimbro/routines";
import { deleteRoutine, putRoutine } from "@/lib/jimbro/storage";
import type { Routine } from "@/lib/jimbro/types";
import { AppDialog } from "./app-dialog";
import { buttonStyle, inputStyle, secondaryStyle } from "./schedule-editor";
export function RoutineLibrary({
  routines,
  busy,
  run,
  onChoose,
  available,
}: {
  routines: Routine[];
  busy: boolean;
  run: (fn: () => Promise<unknown>) => Promise<boolean>;
  onChoose: (r: Routine) => void;
  available?: number;
}) {
  const [edit, setEdit] = useState<Routine | null>(null),
    [preview, setPreview] = useState<Routine | null>(null),
    [query, setQuery] = useState(""),
    [error, setError] = useState(""),
    [confirm, setConfirm] = useState<Routine | null>(null);
  const cards = [...routines, ...starterRoutines];
  function duplicate(r: Routine) {
    setEdit({
      ...structuredClone(r),
      id: makeId(),
      name: `${r.name} copy`,
      revision: 1,
      starter: false,
    });
  }
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-md text-sm leading-6 text-neutral-400">
          General-purpose starting points. Review the exercises, recovery time
          and fit before you start.
        </p>
        <Button
          className={secondaryStyle}
          onClick={() => {
            setError("");
            setEdit({
              id: makeId(),
              name: "My routine",
              exercises: [],
              revision: 1,
              updatedAt: Date.now(),
            });
          }}
        >
          Create routine
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((r) => {
          const range = durationRange(r.exercises);
          return (
            <div
              key={r.id}
              className="rounded-2xl border border-white/10 bg-white/[.025] p-5"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-lime-300">
                {r.starter ? "Jim’s starter" : "Your routine"}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{r.name}</h3>
              <p className="mt-2 text-sm text-neutral-400">
                {r.exercises.length} exercises · about {range[0]}–{range[1]} min
              </p>
              {available !== undefined && range[1] > available ? (
                <p className="mt-2 text-xs text-amber-200">
                  May exceed your available {Math.max(0, Math.floor(available))}{" "}
                  min
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  className={secondaryStyle}
                  onClick={() => setPreview(r)}
                >
                  Preview
                </Button>
                <Button
                  className={secondaryStyle}
                  onClick={() => {
                    setError("");
                    setEdit(structuredClone(r));
                  }}
                >
                  Edit
                </Button>
                <Button className={secondaryStyle} onClick={() => duplicate(r)}>
                  Duplicate
                </Button>
                {!r.starter ? (
                  <Button
                    className={secondaryStyle}
                    onClick={() => setConfirm(r)}
                  >
                    Delete
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      <Button
        className={`${secondaryStyle} w-full`}
        onClick={() =>
          onChoose({
            id: "empty",
            name: "Open workout",
            exercises: [],
            revision: 1,
            updatedAt: Date.now(),
          })
        }
      >
        Start with an empty workout
      </Button>
      {preview ? (
        <AppDialog title={preview.name} onClose={() => setPreview(null)}>
          <p className="mb-5 text-sm text-neutral-400">
            Estimated {durationRange(preview.exercises).join("–")} minutes,
            including rest and transitions. Your pace may vary.
          </p>
          <ol className="space-y-3">
            {preview.exercises.map((e, i) => (
              <li key={e.id} className="rounded-xl border border-white/10 p-3">
                <b>
                  {i + 1}. {e.name}
                </b>
                <p className="mt-1 text-sm text-neutral-400">
                  {e.sets} sets · {e.reps} reps · {e.rest}s rest
                </p>
              </li>
            ))}
          </ol>
          {available !== undefined &&
          durationRange(preview.exercises)[1] > available ? (
            <div className="my-5 rounded-xl border border-amber-300/30 p-4 text-sm text-amber-100">
              <p>
                This may not fit. Choose 20-minute essentials, edit optional
                sets, or explicitly keep this plan. Preserve safe form and
                recovery.
              </p>
              <Button
                className={`${secondaryStyle} mt-3`}
                onClick={() =>
                  setPreview(
                    starterRoutines.find((r) => r.id === "starter-twenty")!,
                  )
                }
              >
                Review shorter preset
              </Button>
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              disabled={busy}
              className={buttonStyle}
              onClick={() => {
                onChoose(structuredClone(preview));
                setPreview(null);
              }}
            >
              Use this workout
              {available !== undefined &&
              durationRange(preview.exercises)[1] > available
                ? " anyway"
                : ""}
            </Button>
            <Button
              className={secondaryStyle}
              onClick={() => {
                setEdit(structuredClone(preview));
                setPreview(null);
              }}
            >
              Adapt first
            </Button>
          </div>
        </AppDialog>
      ) : null}
      {edit ? (
        <AppDialog title="Build your routine" onClose={() => setEdit(null)}>
          <label className="block text-sm">
            Routine name
            <input
              className={`${inputStyle} mt-2 w-full rounded-xl border px-3`}
              value={edit.name}
              maxLength={80}
              onChange={(e) => setEdit({ ...edit, name: e.target.value })}
            />
          </label>
          <p className="my-4 text-xs text-neutral-400">
            Editing a routine does not change a workout already saved or in
            progress.
          </p>
          <ol className="space-y-4">
            {edit.exercises.map((e, i) => (
              <li key={e.id} className="rounded-xl border border-white/10 p-3">
                <label className="text-sm">
                  Exercise {i + 1}
                  <select
                    aria-label={`Replace exercise ${i + 1}`}
                    className={`${inputStyle} mt-2 w-full rounded-xl border px-2`}
                    value={e.exerciseId}
                    onChange={(ev) => {
                      const next = planned(
                        ev.target.value,
                        e.sets,
                        e.reps,
                        e.rest,
                      );
                      setEdit({
                        ...edit,
                        exercises: edit.exercises.map((x, j) =>
                          j === i ? { ...next, id: x.id } : x,
                        ),
                      });
                    }}
                  >
                    {exercises.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(["sets", "reps", "rest"] as const).map((k) => (
                    <label key={k} className="text-xs capitalize">
                      {k}
                      {k === "rest" ? " (sec)" : ""}
                      <input
                        aria-label={`${k} for ${e.name}`}
                        inputMode="numeric"
                        className={`${inputStyle} mt-1 w-full rounded-lg border px-2`}
                        value={e[k]}
                        onChange={(ev) =>
                          setEdit({
                            ...edit,
                            exercises: edit.exercises.map((x, j) =>
                              j === i
                                ? { ...x, [k]: Number(ev.target.value) }
                                : x,
                            ),
                          })
                        }
                      />
                    </label>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    className={secondaryStyle}
                    disabled={i === 0}
                    onClick={() => {
                      const arr = [...edit.exercises];
                      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                      setEdit({ ...edit, exercises: arr });
                    }}
                  >
                    Move up
                  </Button>
                  <Button
                    className={secondaryStyle}
                    disabled={i === edit.exercises.length - 1}
                    onClick={() => {
                      const arr = [...edit.exercises];
                      [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
                      setEdit({ ...edit, exercises: arr });
                    }}
                  >
                    Move down
                  </Button>
                  <Button
                    className={secondaryStyle}
                    onClick={() =>
                      setEdit({
                        ...edit,
                        exercises: edit.exercises.filter((_, j) => j !== i),
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 space-y-3">
            <label className="block text-sm">
              Add exercise
              <select
                value=""
                className={`${inputStyle} mt-2 w-full rounded-xl border px-2`}
                onChange={(e) => {
                  if (e.target.value)
                    setEdit({
                      ...edit,
                      exercises: [
                        ...edit.exercises,
                        { ...planned(e.target.value), id: makeId() },
                      ],
                    });
                }}
              >
                <option value="">Choose an exercise…</option>
                {exercises
                  .filter((x) =>
                    x.name.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
              </select>
            </label>
            <input
              aria-label="Filter exercises to add"
              placeholder="Filter exercises"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`${inputStyle} w-full rounded-xl border px-3`}
            />
            {error ? (
              <p role="alert" className="text-sm text-rose-300">
                {error}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button
                className={buttonStyle}
                disabled={busy}
                onClick={async () => {
                  try {
                    validateRoutine(edit);
                    const existing = routines.find((r) => r.id === edit.id);
                    const save = edit.starter
                      ? { ...edit, id: makeId(), starter: false }
                      : edit;
                    if (await run(() => putRoutine(save, existing?.revision)))
                      setEdit(null);
                  } catch (e) {
                    setError((e as Error).message);
                  }
                }}
              >
                Save routine
              </Button>
              <Button
                className={secondaryStyle}
                disabled={busy}
                onClick={() => {
                  try {
                    validateRoutine(edit);
                    onChoose(structuredClone(edit));
                    setEdit(null);
                  } catch (e) {
                    setError((e as Error).message);
                  }
                }}
              >
                Use this adaptation
              </Button>
            </div>
          </div>
        </AppDialog>
      ) : null}
      {confirm ? (
        <AppDialog
          title="Delete this routine?"
          onClose={() => setConfirm(null)}
        >
          <p className="text-sm text-neutral-300">
            {confirm.name} will be removed. Historical workouts remain.
          </p>
          <Button
            className={`${buttonStyle} mt-5`}
            disabled={busy}
            onClick={async () => {
              if (await run(() => deleteRoutine(confirm.id))) setConfirm(null);
            }}
          >
            Delete routine
          </Button>
        </AppDialog>
      ) : null}
    </div>
  );
}
