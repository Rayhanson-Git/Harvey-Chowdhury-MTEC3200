"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { elapsed, routineFromSession } from "@/lib/jimbro/routines";
import { deleteSession, putRoutine } from "@/lib/jimbro/storage";
import { localDate } from "@/lib/jimbro/schedule";
import type { Session, Routine, Preferences } from "@/lib/jimbro/types";
import { AppDialog } from "./app-dialog";
import { WorkoutLogger, type ChangeSession } from "./workout-logger";
import { buttonStyle, inputStyle, secondaryStyle } from "./schedule-editor";
export function HistoryPanel({
  sessions,
  busy,
  change,
  run,
  onRepeat,
  preferences,
  initialId,
}: {
  sessions: Session[];
  busy: boolean;
  change: ChangeSession;
  run: (f: () => Promise<unknown>) => Promise<boolean>;
  onRepeat: (r: Routine) => void;
  preferences: Preferences;
  initialId?: string;
}) {
  const [month, setMonth] = useState(
      () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    ),
    [day, setDay] = useState(""),
    [selected, setSelected] = useState(initialId || ""),
    [deleting, setDeleting] = useState(false),
    [message, setMessage] = useState("");
  const records = sessions.filter(
      (s) => s.status !== "active" || !!s.actual.workoutEndedAt,
    ),
    detail = sessions.find((s) => s.id === selected);
  const start = new Date(month);
  start.setDate(1 - start.getDay());
  const days = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    return {
      date,
      key: localDate(
        date.getTime(),
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      ),
    };
  });
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-jim-border-soft p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <Button
            aria-label="Previous month"
            className={secondaryStyle}
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
            }
          >
            ←
          </Button>
          <h3 className="text-sm font-medium">
            {month.toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <Button
            aria-label="Next month"
            className={secondaryStyle}
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
          >
            →
          </Button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs text-jim-muted">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((x) => (
            <span key={x} className="py-2">
              {x}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map(({ date, key }) => {
            const count = records.filter(
              (s) =>
                s.workoutDate === key &&
                s.sets.length &&
                s.status !== "cancelled",
            ).length;
            return (
              <button
                key={key}
                onClick={() => setDay(day === key ? "" : key)}
                aria-label={`${date.getDate()} ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}, ${count} ${count === 1 ? "workout" : "workouts"}`}
                aria-pressed={day === key}
                className={`relative min-h-11 rounded-lg border text-sm ${day === key ? "border-jim-accent bg-rose-500/20" : "border-transparent"} ${date.getMonth() !== month.getMonth() ? "text-jim-muted" : "text-jim-secondary"}`}
              >
                {date.getDate()}
                {count ? (
                  <span
                    aria-hidden
                    className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-jim-positive"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-xs leading-5 text-jim-muted">
          Each session stays on its recorded start date in its captured
          timezone, even when you travel or finish after midnight.
        </p>
      </section>
      {day ? (
        <Button className={secondaryStyle} onClick={() => setDay("")}>
          Showing {day} · clear filter
        </Button>
      ) : null}
      <div className="space-y-3">
        {records
          .filter((s) => !day || s.workoutDate === day)
          .map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelected(s.id);
                setMessage("");
              }}
              className="flex w-full items-center justify-between gap-4 rounded-2xl border border-jim-border-soft bg-jim-subtle p-5 text-left hover:border-jim-muted"
            >
              <div>
                <p className="text-xs text-jim-muted">
                  {s.workoutDate} · {s.workoutTimezone}
                </p>
                <h3 className="mt-1 font-semibold">{s.label}</h3>
                <p className="mt-2 text-xs text-jim-muted">
                  {s.sets.length} completed sets ·{" "}
                  {Math.round(
                    elapsed(s, s.actual.workoutEndedAt || s.updatedAt) / 60000,
                  )}{" "}
                  min ·{" "}
                  {s.status === "cancelled"
                    ? "Discarded"
                    : s.endedEarly
                      ? "Ended early"
                      : "Completed"}
                </p>
              </div>
              <span aria-hidden className="text-jim-muted">
                ↗
              </span>
            </button>
          ))}
        {!records.filter((s) => !day || s.workoutDate === day).length ? (
          <div className="rounded-2xl border border-dashed border-jim-border p-8 text-center">
            <h3 className="font-medium">Your work will live here.</h3>
            <p className="mt-2 text-sm text-jim-muted">
              Finish a workout to see its exercises, sets and notes.
            </p>
          </div>
        ) : null}
      </div>
      {detail ? (
        <AppDialog
          title={detail.label}
          onClose={() => {
            setSelected("");
            setDeleting(false);
          }}
        >
          <p className="mb-4 text-xs text-jim-muted">
            {detail.workoutDate} · {detail.sets.length} completed sets ·{" "}
            {Math.round(
              elapsed(
                detail,
                detail.actual.workoutEndedAt || detail.updatedAt,
              ) / 60000,
            )}{" "}
            minutes
          </p>
          <div className="mb-5 flex flex-wrap gap-2">
            <Button
              className={buttonStyle}
              onClick={() => {
                onRepeat(routineFromSession(detail));
                setSelected("");
              }}
            >
              Repeat workout
            </Button>
            <Button
              className={secondaryStyle}
              disabled={busy}
              onClick={async () => {
                if (
                  await run(() =>
                    putRoutine({
                      ...routineFromSession(detail),
                      name: `${detail.label} routine`,
                    }),
                  )
                )
                  setMessage("Routine saved.");
              }}
            >
              Save as new routine
            </Button>
            <Button
              className={secondaryStyle}
              onClick={() => setDeleting(true)}
            >
              Delete session
            </Button>
            <a
              className={`${secondaryStyle} inline-flex items-center rounded-lg px-3 text-sm`}
              href={`/history?session=${encodeURIComponent(detail.id)}`}
            >
              Direct link
            </a>
          </div>
          <label className="block text-sm">
            Session notes
            <textarea
              key={detail.revision}
              defaultValue={detail.notes || ""}
              maxLength={4000}
              className={`${inputStyle} mt-2 min-h-24 w-full rounded-xl border p-3`}
              onBlur={(e) => {
                const value = e.currentTarget.value;
                if (value !== (detail.notes || ""))
                  void change(detail.id, detail.revision, (s) => ({
                    ...s,
                    notes: value,
                  }));
              }}
            />
          </label>
          <p role="status" className="my-3 text-sm text-jim-positive">
            {message}
          </p>
          <WorkoutLogger
            session={detail}
            busy={busy}
            change={change}
            history={sessions}
            preferences={{ ...preferences, autoRest: false }}
          />
          {deleting ? (
            <div className="mt-5 rounded-xl border border-jim-accent/40 p-4">
              <p className="text-sm">
                Delete this workout permanently? Its sets will also be removed
                from progress. Export a backup first if needed.
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  className={buttonStyle}
                  disabled={busy}
                  onClick={async () => {
                    if (
                      await run(() => deleteSession(detail.id, detail.revision))
                    ) {
                      setSelected("");
                      setDeleting(false);
                    }
                  }}
                >
                  Confirm delete
                </Button>
                <Button
                  className={secondaryStyle}
                  onClick={() => setDeleting(false)}
                >
                  Keep session
                </Button>
              </div>
            </div>
          ) : null}
        </AppDialog>
      ) : null}
    </div>
  );
}
