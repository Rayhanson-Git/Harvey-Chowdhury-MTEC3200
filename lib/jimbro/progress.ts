import type { Session, Unit } from "./types.ts";
import { convertLoad } from "./routines.ts";
export function workoutRecords(sessions: Session[], from: string, to: string) {
  return sessions.filter(
    (s) =>
      s.status !== "cancelled" &&
      !!s.actual.workoutEndedAt &&
      s.sets.length &&
      s.workoutDate >= from &&
      s.workoutDate <= to,
  );
}
export function weeklyFrequency(sessions: Session[]) {
  const weeks = new Map<string, { sessions: number; days: Set<string> }>();
  for (const s of sessions) {
    const date = new Date(`${s.workoutDate}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
    const key = date.toISOString().slice(0, 10);
    const row = weeks.get(key) || { sessions: 0, days: new Set<string>() };
    row.sessions++;
    row.days.add(s.workoutDate);
    weeks.set(key, row);
  }
  if (weeks.size) {
    const keys = [...weeks.keys()].sort();
    const at = new Date(`${keys[0]}T12:00:00Z`);
    const end = keys.at(-1)!;
    while (at.toISOString().slice(0, 10) <= end) {
      const key = at.toISOString().slice(0, 10);
      if (!weeks.has(key))
        weeks.set(key, { sessions: 0, days: new Set<string>() });
      at.setUTCDate(at.getUTCDate() + 7);
    }
  }
  return [...weeks]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, row]) => ({
      date,
      sessions: row.sessions,
      days: row.days.size,
    }));
}
export function exerciseProgress(
  sessions: Session[],
  exerciseId: string,
  kind: string,
  reps: number,
  unit: Unit,
) {
  return sessions
    .flatMap((s) => {
      const sets = s.sets.filter(
        (x) =>
          x.exerciseId === exerciseId &&
          (x.kind || "external") === kind &&
          (kind === "timed" || kind === "distance" || x.reps === reps),
      );
      if (!sets.length) return [];
      return [
        {
          date: s.workoutDate,
          value: Math.max(
            ...sets.map((x) =>
              kind === "timed"
                ? x.seconds || 0
                : kind === "distance"
                  ? x.distanceKm || 0
                  : kind === "bodyweight"
                    ? x.reps
                    : convertLoad(x.load, x.unit, unit),
            ),
          ),
        },
      ];
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}
export function externalVolume(sessions: Session[], unit: Unit) {
  return sessions
    .flatMap((s) => s.sets)
    .filter((s) => (s.kind || "external") === "external")
    .reduce((n, s) => n + convertLoad(s.load, s.unit, unit) * s.reps, 0);
}
