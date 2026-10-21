"use client";
import { Button } from "@/components/ui/button";
import {
  clockText,
  deadlines,
  formatMoment,
  phaseAt,
} from "@/lib/jimbro/schedule";
import { elapsed, restRemaining } from "@/lib/jimbro/routines";
import type { Preferences, Session } from "@/lib/jimbro/types";
import type { ChangeSession } from "./workout-logger";
import { secondaryStyle } from "./schedule-editor";
export function TimerDock({
  session,
  now,
  busy,
  change,
  preferences,
  onPlan,
}: {
  session: Session;
  now: number;
  busy: boolean;
  change: ChangeSession;
  preferences: Preferences;
  onPlan: () => void;
}) {
  const phase = phaseAt(session, now),
    d = deadlines(session.schedule),
    rest = restRemaining(session.rest, now);
  return (
    <aside
      className="space-y-4 rounded-3xl border border-white/15 bg-jim-raised p-5"
      aria-label="Workout timers"
    >
      <div>
        <div className="flex justify-between gap-2 text-xs uppercase tracking-widest text-neutral-400">
          <span>{session.withoutDeadline ? "Open workout" : phase.label}</span>
          <span className="text-rose-300">Live</span>
        </div>
        <p className="mt-2 font-mono text-3xl font-semibold tabular-nums">
          {session.withoutDeadline
            ? clockText(elapsed(session, now))
            : clockText(phase.deadline - now)}
        </p>
        <p role="status" className="mt-2 text-sm text-rose-200">
          {phase.title}
        </p>
        {!session.withoutDeadline ? (
          <>
            <p className="mt-2 text-xs leading-5 text-neutral-400">
              Cutoff {formatMoment(d.stop, session.schedule.timezone)}
              <br />
              Leave {formatMoment(d.departure, session.schedule.timezone)}
            </p>
            {now > d.stop && !session.actual.workoutEndedAt ? (
              <p className="mt-2 text-xs text-amber-200">
                Workout cutoff reached. Keep completed work and begin preparing.
              </p>
            ) : null}
            <Button
              className={`${secondaryStyle} mt-3 w-full`}
              onClick={onPlan}
            >
              Review schedule
            </Button>
          </>
        ) : null}
      </div>
      <div className="border-t border-white/10 pt-3">
        <p className="text-xs text-neutral-400">
          Elapsed training · excludes pauses
        </p>
        <p className="mt-1 font-mono text-lg">
          {clockText(elapsed(session, now))}
        </p>
        {!session.actual.workoutEndedAt ? (
          <Button
            disabled={busy}
            className={`${secondaryStyle} mt-2`}
            onClick={() =>
              change(session.id, session.revision, (s) =>
                s.pausedAt
                  ? {
                      ...s,
                      pausedMs: (s.pausedMs || 0) + Date.now() - s.pausedAt,
                      pausedAt: undefined,
                    }
                  : { ...s, pausedAt: Date.now() },
              )
            }
          >
            {session.pausedAt ? "Resume elapsed time" : "Pause elapsed time"}
          </Button>
        ) : null}
        <p className="mt-2 text-xs text-neutral-400">
          {session.withoutDeadline
            ? "Elapsed time can pause. There is no departure deadline."
            : "Your departure deadline always keeps running."}
        </p>
      </div>
      {preferences.restEnabled ? (
        <div className="border-t border-white/10 pt-3">
          <p className="text-xs text-neutral-400">
            Set rest ·{" "}
            {session.rest?.pausedMs !== undefined
              ? "paused"
              : rest
                ? "running"
                : "ready"}
          </p>
          <p
            role={rest === 0 && session.rest ? "status" : undefined}
            className="mt-1 font-mono text-2xl"
          >
            {rest ? clockText(rest) : session.rest ? "Rest complete" : "01:30"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              disabled={busy}
              className={secondaryStyle}
              onClick={() =>
                change(session.id, session.revision, (s) => ({
                  ...s,
                  rest:
                    s.rest && restRemaining(s.rest, Date.now()) > 0
                      ? s.rest.pausedMs !== undefined
                        ? { endsAt: Date.now() + s.rest.pausedMs }
                        : {
                            ...s.rest,
                            pausedMs: restRemaining(s.rest, Date.now()),
                          }
                      : { endsAt: Date.now() + 90000 },
                }))
              }
            >
              {session.rest && rest > 0
                ? session.rest.pausedMs !== undefined
                  ? "Resume rest"
                  : "Pause rest"
                : "Start rest"}
            </Button>
            <Button
              disabled={busy}
              className={secondaryStyle}
              onClick={() =>
                change(session.id, session.revision, (s) => ({
                  ...s,
                  rest: {
                    endsAt:
                      Date.now() + restRemaining(s.rest, Date.now()) + 30000,
                    ...(s.rest?.pausedMs !== undefined
                      ? { pausedMs: s.rest.pausedMs + 30000 }
                      : {}),
                  },
                }))
              }
            >
              +30s
            </Button>
            <Button
              disabled={busy}
              className={secondaryStyle}
              onClick={() =>
                change(session.id, session.revision, (s) => ({
                  ...s,
                  rest: undefined,
                }))
              }
            >
              Skip rest
            </Button>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
