"use client";
import { makeId } from "@/lib/jimbro/identity";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { exercises } from "@/lib/jimbro/catalog";
import { durationRange, planned } from "@/lib/jimbro/routines";
import type { Session } from "@/lib/jimbro/types";
import type { ChangeSession } from "./workout-logger";
import { secondaryStyle, inputStyle } from "./schedule-editor";
export function ActivePlan({
  session,
  busy,
  change,
}: {
  session: Session;
  busy: boolean;
  change: ChangeSession;
}) {
  const [open, setOpen] = useState(false);
  const plan = session.plan || [];
  return (
    <section className="mb-6 rounded-2xl border border-white/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">Your workout plan</h3>
          <p className="mt-1 text-xs text-neutral-400">
            {plan.length
              ? `${plan.length} exercises · estimated ${durationRange(plan).join("–")} min`
              : "Open workout. Add exercises as you train."}
          </p>
        </div>
        <Button className={secondaryStyle} onClick={() => setOpen(!open)}>
          {open ? "Close plan" : "Edit plan"}
        </Button>
      </div>
      {open ? (
        <div className="mt-4 space-y-4">
          {plan.map((e, i) => (
            <div key={e.id} className="space-y-2 border-t border-white/10 pt-3">
              <label className="block text-sm">
                Exercise {i + 1}
                <select
                  className={`${inputStyle} mt-1 w-full rounded-lg border px-2`}
                  disabled={busy}
                  value={e.exerciseId}
                  onChange={(ev) =>
                    change(session.id, session.revision, (s) => ({
                      ...s,
                      plan: s.plan!.map((x, j) =>
                        j === i
                          ? {
                              ...planned(
                                ev.target.value,
                                e.sets,
                                e.reps,
                                e.rest,
                              ),
                              id: e.id,
                            }
                          : x,
                      ),
                    }))
                  }
                >
                  {exercises.map((x) => (
                    <option value={x.id} key={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
              </label>
              <p className="text-xs text-neutral-400">
                {
                  session.sets.filter((s) => s.exerciseId === e.exerciseId)
                    .length
                }
                /{e.sets} recorded sets · {e.reps} suggested reps · {e.rest}s
                rest
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(["sets", "reps", "rest"] as const).map((k) => (
                  <label key={k} className="text-xs capitalize">
                    {k}
                    <input
                      key={`${session.revision}-${k}`}
                      className={`${inputStyle} mt-1 w-full rounded-lg border px-2`}
                      inputMode="numeric"
                      defaultValue={e[k]}
                      onBlur={(ev) => {
                        const n = Number(ev.target.value);
                        if (
                          Number.isInteger(n) &&
                          n >= (k === "rest" ? 0 : 1) &&
                          n <=
                            (k === "rest" ? 3600 : k === "sets" ? 30 : 1000) &&
                          n !== e[k]
                        )
                          void change(session.id, session.revision, (s) => ({
                            ...s,
                            plan: s.plan!.map((x, j) =>
                              i === j ? { ...x, [k]: n } : x,
                            ),
                          }));
                        else ev.target.value = String(e[k]);
                      }}
                    />
                  </label>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={busy || i === 0}
                  className={secondaryStyle}
                  onClick={() =>
                    change(session.id, session.revision, (s) => {
                      const arr = [...s.plan!];
                      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                      return { ...s, plan: arr };
                    })
                  }
                >
                  Move up
                </Button>
                <Button
                  disabled={busy || i === plan.length - 1}
                  className={secondaryStyle}
                  onClick={() =>
                    change(session.id, session.revision, (s) => {
                      const arr = [...s.plan!];
                      [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
                      return { ...s, plan: arr };
                    })
                  }
                >
                  Move down
                </Button>
                <Button
                  className={secondaryStyle}
                  disabled={busy}
                  onClick={() =>
                    change(session.id, session.revision, (s) => ({
                      ...s,
                      plan: s.plan!.filter((_, j) => j !== i),
                    }))
                  }
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <label className="block text-sm">
            Add planned exercise
            <select
              value=""
              className={`${inputStyle} mt-2 w-full rounded-xl border px-2`}
              disabled={busy}
              onChange={(e) => {
                if (e.target.value)
                  void change(session.id, session.revision, (s) => ({
                    ...s,
                    plan: [
                      ...(s.plan || []),
                      { ...planned(e.target.value), id: makeId() },
                    ],
                  }));
              }}
            >
              <option value="">Choose exercise…</option>
              {exercises.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </label>
          <p className="text-xs text-neutral-400">
            Changes affect planned work only. Completed sets stay recorded.
          </p>
        </div>
      ) : null}
    </section>
  );
}
