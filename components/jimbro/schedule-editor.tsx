import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  commitmentOptions,
  deadlines,
  formatMoment,
  makeSchedule,
} from "@/lib/jimbro/schedule";
import type {
  PlanErrors,
  PlanInput,
  Schedule,
  Session,
} from "@/lib/jimbro/types";

const fields = [
  { key: "date", label: "Commitment date", type: "date" },
  { key: "time", label: "Commitment start", type: "time" },
  { key: "preparation", label: "Get ready (minutes)", type: "text" },
  { key: "commute", label: "Commute (minutes)", type: "text" },
  { key: "buffer", label: "Buffer (minutes)", type: "text" },
] as const;
export const inputStyle =
  "h-12 border-jim-border-strong bg-jim-input text-jim-text placeholder:text-jim-muted focus-visible:ring-jim-focus";
export const buttonStyle =
  "min-h-12 bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-jim-focus";
export const secondaryStyle =
  "min-h-11 border border-jim-border-strong bg-jim-input text-jim-text hover:bg-jim-hover focus-visible:ring-jim-focus";

export function ScheduleEditor({
  session,
  busy,
  onSave,
  now = 0,
}: {
  now?: number;
  session: Session | null;
  busy: boolean;
  onSave: (
    schedule: Schedule,
    label: string,
    expected: number,
    commitmentName: string,
    commitmentType: "general" | "class" | "work",
  ) => Promise<boolean>;
}) {
  const [input, setInput] = useState<PlanInput>(
    () =>
      (session && !session.withoutDeadline
        ? session.schedule.input
        : undefined) || {
        date: "",
        time: "10:00",
        preparation: "30",
        commute: "60",
        buffer: "15",
      },
  );
  const [label, setLabel] = useState(session?.label || "Workout");
  const [commitmentName, setCommitmentName] = useState(
    session?.commitmentName || "",
  );
  const [commitmentType, setCommitmentType] = useState<
    "general" | "class" | "work"
  >(session?.commitmentType || "general");
  const [timezone, setTimezone] = useState(
    () =>
      session?.schedule.timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [expected, setExpected] = useState(session?.revision || 0);
  const [occurrence, setOccurrence] = useState<number | undefined>(
    session?.schedule.commitment,
  );
  const [errors, setErrors] = useState<PlanErrors>({});
  const [zoneConfirmed, setZoneConfirmed] = useState(false);
  const deviceZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const changedZone = !!session && session.schedule.timezone !== deviceZone;
  let options: number[] = [];
  try {
    options = commitmentOptions(input, timezone);
  } catch {
    /* shown on submit */
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = makeSchedule(
      input,
      timezone,
      Date.now(),
      occurrence,
      (session?.schedule.revision || 0) + 1,
    );
    if (changedZone && !zoneConfirmed)
      result.errors.time = "Confirm the plan timezone before saving.";
    setErrors(result.errors);
    if (!result.schedule || Object.keys(result.errors).length) {
      event.currentTarget
        .querySelector<HTMLElement>(`[name="${Object.keys(result.errors)[0]}"]`)
        ?.focus();
      return;
    }
    if (
      await onSave(
        result.schedule,
        label,
        expected,
        commitmentName,
        commitmentType,
      )
    )
      setExpected((session?.revision || 0) + 1);
  }
  const candidate = makeSchedule(input, timezone, now, occurrence).schedule;
  return (
    <div className="space-y-6">
      {session && !session.withoutDeadline ? (
        <dl className="grid gap-3 rounded-2xl border border-jim-border-soft p-4 text-sm sm:grid-cols-2">
          {Object.entries(deadlines(session.schedule)).map(([key, at]) => (
            <div key={key}>
              <dt className="capitalize text-jim-muted">
                {key === "stop" ? "Stop workout" : key}
              </dt>
              <dd className="mt-1 font-medium">
                {formatMoment(at, session.schedule.timezone)}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm leading-6 text-jim-muted">
          Work backward from what’s next. We’ll reserve your preparation,
          commute and buffer, then keep your stop time in sight.
        </p>
      )}
      <form onSubmit={submit} noValidate className="space-y-5">
        <label className="block text-sm">
          Next commitment
          <Input
            className={`${inputStyle} mt-2`}
            value={commitmentName}
            maxLength={80}
            placeholder="Class, work, dinner…"
            onChange={(e) => setCommitmentName(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          Commitment type
          <select
            value={commitmentType}
            onChange={(e) =>
              setCommitmentType(e.target.value as "general" | "class" | "work")
            }
            className={`${inputStyle} mt-2 w-full rounded-md border px-3`}
          >
            <option value="general">Personal / other</option>
            <option value="class">Class</option>
            <option value="work">Work</option>
          </select>
        </label>
        <div>
          <label htmlFor="workout-label" className="mb-2 block text-sm">
            Workout day
          </label>
          <Input
            id="workout-label"
            list="workout-days"
            value={label}
            maxLength={60}
            onChange={(e) => setLabel(e.target.value)}
            className={inputStyle}
          />
          <datalist id="workout-days">
            {["Push", "Pull", "Legs", "Chest", "Back", "Arms", "Full body"].map(
              (x) => (
                <option key={x} value={x} />
              ),
            )}
          </datalist>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(({ key, label: fieldLabel, type }) => (
            <div key={key}>
              <label htmlFor={`schedule-${key}`} className="mb-2 block text-sm">
                {fieldLabel}
              </label>
              <Input
                id={`schedule-${key}`}
                name={key}
                type={type}
                inputMode={type === "text" ? "numeric" : undefined}
                value={input[key]}
                aria-invalid={!!errors[key]}
                aria-describedby={errors[key] ? `${key}-error` : undefined}
                onChange={(e) => {
                  setInput({ ...input, [key]: e.target.value });
                  setOccurrence(undefined);
                }}
                className={inputStyle}
              />
              {errors[key] ? (
                <p id={`${key}-error`} className="mt-2 text-sm text-jim-accent">
                  {errors[key]}
                </p>
              ) : null}
            </div>
          ))}
        </div>
        {options.length > 1 ? (
          <fieldset className="space-y-2 rounded-xl border border-jim-warning/40 p-4">
            <legend className="px-1 text-sm">
              This time happens twice. Choose one.
            </legend>
            {options.map((at) => (
              <label
                key={at}
                className="flex min-h-11 items-center gap-3 text-sm"
              >
                <input
                  type="radio"
                  name="occurrence"
                  checked={occurrence === at}
                  onChange={() => setOccurrence(at)}
                />
                {formatMoment(at, timezone)} · {new Date(at).toISOString()}
              </label>
            ))}
          </fieldset>
        ) : null}
        <p className="text-xs leading-5 text-jim-muted">
          Plan timezone: {timezone}. Times use your estimates, not live travel
          data.
        </p>
        {changedZone ? (
          <div className="space-y-3 rounded-xl border border-jim-warning/30 p-4 text-sm">
            <p>
              Your device timezone is now {deviceZone}. The saved deadline has
              not moved.
            </p>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={zoneConfirmed}
                onChange={(e) => setZoneConfirmed(e.target.checked)}
              />
              Keep editing in {timezone}
            </label>
            <button
              type="button"
              className="min-h-11 underline"
              onClick={() => {
                setTimezone(deviceZone);
                setOccurrence(undefined);
                setZoneConfirmed(true);
              }}
            >
              Use device timezone for this edit
            </button>
          </div>
        ) : null}
        {session && expected !== session.revision ? (
          <div className="space-y-2 text-sm text-jim-warning">
            <p>
              Saved data changed while you were editing. Your input is still
              here.
            </p>
            <button
              type="button"
              className="min-h-11 underline"
              onClick={() => setExpected(session.revision)}
            >
              Apply my input to the latest saved version
            </button>
          </div>
        ) : null}
        {candidate ? (
          <div className="rounded-xl border border-jim-positive/20 bg-jim-positive/5 p-4 text-sm leading-6">
            <p>
              You have about{" "}
              {Math.max(
                0,
                Math.floor((deadlines(candidate).stop - now) / 60000),
              )}{" "}
              minutes to train.
            </p>
            <p>
              Start getting ready{" "}
              {formatMoment(deadlines(candidate).stop, timezone)}. Leave{" "}
              {formatMoment(deadlines(candidate).departure, timezone)}.
            </p>
            {deadlines(candidate).stop <= now ? (
              <p className="text-jim-warning">
                Workout cutoff has passed. Review your plan before starting.
              </p>
            ) : null}
            {session ? (
              <p className="mt-2 text-jim-secondary">
                Saving replaces only your schedule. Your chosen workout and
                completed sets stay as they are.
              </p>
            ) : null}
          </div>
        ) : null}
        <Button
          type="submit"
          disabled={busy}
          className={`${buttonStyle} w-full`}
        >
          {busy ? "Saving…" : session ? "Save updated plan" : "Review workouts"}
        </Button>
        <p className="text-xs leading-5 text-jim-muted">
          Saved on this browser. Alerts work while the app is open and visible;
          keep another alarm for anything critical.
        </p>
      </form>
    </div>
  );
}
