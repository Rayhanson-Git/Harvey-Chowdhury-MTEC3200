"use client";
import { useId, useState } from "react";
import { exercises } from "@/lib/jimbro/catalog";
import {
  exerciseProgress,
  externalVolume,
  weeklyFrequency,
  workoutRecords,
} from "@/lib/jimbro/progress";
import { localDate } from "@/lib/jimbro/schedule";
import type { Session, Unit } from "@/lib/jimbro/types";
import { inputStyle } from "./schedule-editor";
export function DataChart({
  rows,
  label,
  unit,
}: {
  rows: { date: string; value: number }[];
  label: string;
  unit: string;
}) {
  const id = useId(),
    max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div>
      <p id={id} className="mb-4 text-sm text-jim-secondary">
        {label}
      </p>
      {rows.length ? (
        <>
          <svg
            viewBox="0 0 600 180"
            role="img"
            aria-labelledby={id}
            className="h-40 w-full overflow-visible"
          >
            <title>{label}; values are listed in the table below</title>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <line
                  x1="45"
                  x2="585"
                  y1={20 + i * 60}
                  y2={20 + i * 60}
                  stroke="var(--jim-chart-grid)"
                  strokeDasharray="4 4"
                />
                <text x="0" y={24 + i * 60} fill="var(--jim-muted)" fontSize="12">
                  {(max * (1 - i / 2)).toFixed(0)}
                </text>
              </g>
            ))}
            <polyline
              fill="none"
              stroke="var(--jim-positive)"
              strokeWidth="3"
              points={rows
                .map(
                  (r, i) =>
                    `${45 + (rows.length === 1 ? 270 : (i / (rows.length - 1)) * 530)},${140 - (r.value / max) * 120}`,
                )
                .join(" ")}
            />
            {rows.map((r, i) => (
              <circle
                key={i}
                cx={
                  45 + (rows.length === 1 ? 270 : (i / (rows.length - 1)) * 530)
                }
                cy={140 - (r.value / max) * 120}
                r="4"
                fill="var(--jim-positive)"
              />
            ))}
            <text x="45" y="175" fill="var(--jim-muted)" fontSize="12">
              {rows[0].date}
            </text>
            <text x="585" y="175" textAnchor="end" fill="var(--jim-muted)" fontSize="12">
              {rows.length > 1 ? rows.at(-1)!.date : ""}
            </text>
          </svg>
          <p className="mt-3 text-xs text-jim-muted">
            {rows.length} recorded{" "}
            {rows.length === 1
              ? "point; more records are needed for a trend."
              : "points. Values reflect your records, not a prediction."}
          </p>
          <details className="mt-3">
            <summary className="min-h-11 cursor-pointer text-sm">
              View chart data
            </summary>
            <div className="max-h-64 overflow-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">{label}</caption>
                <thead>
                  <tr>
                    <th className="py-2 text-left">Date</th>
                    <th className="text-right">{unit}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t border-jim-border-soft">
                      <td className="py-2">{r.date}</td>
                      <td className="text-right">
                        {Number(r.value.toFixed(2))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      ) : (
        <p className="rounded-xl border border-dashed border-jim-border p-5 text-sm text-jim-muted">
          No comparable recorded data in this period yet.
        </p>
      )}
    </div>
  );
}
export function ProgressPanel({
  sessions,
  unit,
  now,
}: {
  sessions: Session[];
  unit: Unit;
  now: number;
}) {
  const today = localDate(
      now,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    ),
    [period, setPeriod] = useState("90"),
    [exercise, setExercise] = useState("bench-press"),
    [kind, setKind] = useState("external"),
    [reps, setReps] = useState("8");
  const from = localDate(
      now - Number(period) * 86400000,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    ),
    records = workoutRecords(sessions, from, today),
    weeks = weeklyFrequency(records),
    series = exerciseProgress(records, exercise, kind, Number(reps), unit);
  return (
    <div className="space-y-6">
      <label className="block max-w-xs text-sm">
        Period
        <select
          className={`${inputStyle} mt-2 w-full rounded-xl border px-3`}
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
          <option value="36500">All records</option>
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-jim-border-soft p-5">
          <p className="text-3xl font-semibold">
            {new Set(records.map((s) => s.workoutDate)).size}
          </p>
          <p className="mt-1 text-sm text-jim-muted">workout days</p>
        </div>
        <div className="rounded-2xl border border-jim-border-soft p-5">
          <p className="text-3xl font-semibold">{records.length}</p>
          <p className="mt-1 text-sm text-jim-muted">sessions</p>
        </div>
      </div>
      <DataChart
        rows={weeks.map((w) => ({ date: w.date, value: w.sessions }))}
        label="Sessions per recorded week (Monday start)"
        unit="Sessions"
      />
      <p className="text-xs text-jim-muted">
        Weeks without workouts have zero sessions. Recorded weeks:{" "}
        {weeks.map((w) => `${w.date}: ${w.days} workout days`).join("; ") ||
          "none"}
        .
      </p>
      <section className="space-y-4 rounded-2xl border border-jim-border-soft p-5">
        <h3 className="font-semibold">Compare the same movement</h3>
        <label className="block text-sm">
          Exercise
          <select
            className={`${inputStyle} mt-2 w-full rounded-xl border px-3`}
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
          >
            {exercises.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Measure
          <select
            className={`${inputStyle} mt-2 w-full rounded-xl border px-3`}
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="external">External load at matching reps</option>
            <option value="bodyweight">Bodyweight reps</option>
            <option value="assisted">Assistance at matching reps</option>
            <option value="timed">Duration (seconds)</option>
            <option value="distance">Distance (km)</option>
          </select>
        </label>
        {kind === "external" || kind === "assisted" ? (
          <label className="block text-sm">
            Repetitions to compare
            <input
              className={`${inputStyle} mt-2 w-full rounded-xl border px-3`}
              inputMode="numeric"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </label>
        ) : null}
        <DataChart
          rows={series}
          label={
            kind === "assisted"
              ? "Lowest recorded assistance per session at matching reps"
              : "Highest recorded measure per session"
          }
          unit={
            kind === "bodyweight"
              ? "Reps"
              : kind === "timed"
                ? "Seconds"
                : kind === "distance"
                  ? "km"
                  : unit
          }
        />
        <p className="text-xs leading-5 text-jim-muted">
          Load records compare the same exercise, movement type and repetition
          count. Assistance is shown separately; more assistance is not treated
          as a strength record. Personal best means a greater external load at
          the same reps than an earlier valid set; a first entry is a baseline.
        </p>
      </section>
      <p className="text-sm text-jim-secondary">
        External-load volume: {Number(externalVolume(records, unit).toFixed(1))}{" "}
        {unit}·reps
      </p>
      <p className="text-xs leading-5 text-jim-muted">
        Volume sums external load × repetitions only. It excludes bodyweight,
        assistance, timed and distance sets, and does not measure universal
        strength or exercise quality.
      </p>
    </div>
  );
}
