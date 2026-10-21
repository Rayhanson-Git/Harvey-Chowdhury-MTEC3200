import { makeId } from "./identity.ts";
import { exercises } from "./catalog.ts";
import type {
  Routine,
  PlannedExercise,
  Session,
  Unit,
  CompletedSet,
  RestTimer,
} from "./types.ts";
export const kgPerLb = 0.45359237;
export const convertLoad = (value: number, from: Unit, to: Unit) =>
  from === to ? value : to === "kg" ? value * kgPerLb : value / kgPerLb;
export function planned(
  exerciseId: string,
  sets = 3,
  reps = 8,
  rest = 90,
): PlannedExercise {
  const e = exercises.find((e) => e.id === exerciseId);
  if (!e) throw new Error("Unknown exercise");
  return {
    id: exerciseId,
    exerciseId,
    name: e.name,
    sets,
    reps,
    rest,
    kind:
      e.kind ||
      (e.equipment === "Body weight" ||
      e.equipment === "Pull-up bar" ||
      e.equipment === "Parallel bars"
        ? "bodyweight"
        : "external"),
  };
}
const definitions: [string, string, string[], number, number][] = [
  ["full", "Full body", ["squat", "bench-press", "seated-row"], 3, 90],
  [
    "push",
    "Push",
    ["bench-press", "shoulder-press", "triceps-pushdown"],
    3,
    90,
  ],
  ["pull", "Pull", ["lat-pulldown", "barbell-row", "biceps-curl"], 3, 90],
  ["legs", "Legs", ["squat", "rdl", "calf-raise"], 3, 120],
  [
    "twenty",
    "20-minute essentials",
    ["leg-press", "bench-press", "seated-row"],
    2,
    60,
  ],
  [
    "dumbbell",
    "Dumbbell only",
    ["lunge", "incline-press", "hammer-curl"],
    3,
    75,
  ],
  [
    "bodyweight",
    "Bodyweight",
    ["push-up", "crunch", "hanging-knee-raise"],
    3,
    60,
  ],
];
export const starterRoutines: Routine[] = definitions.map(
  ([id, name, ids, sets, rest]) => ({
    id: `starter-${id}`,
    name,
    exercises: ids.map((x) => planned(x, sets, 8, rest)),
    updatedAt: 0,
    revision: 1,
    starter: true,
  }),
);
export function durationRange(plan: PlannedExercise[]) {
  const seconds = plan.reduce(
    (n, e) => n + e.sets * 40 + Math.max(0, e.sets - 1) * e.rest + 90,
    0,
  );
  return [
    Math.max(1, Math.floor((seconds / 60) * 0.85)),
    Math.ceil((seconds / 60) * 1.2),
  ] as const;
}
export function validateRoutine(r: Routine) {
  if (
    !r ||
    typeof r.id !== "string" ||
    !r.id ||
    typeof r.name !== "string" ||
    !r.name.trim() ||
    r.name.length > 80 ||
    !Number.isFinite(r.updatedAt) ||
    !Number.isSafeInteger(r.revision) ||
    r.revision < 1 ||
    !Array.isArray(r.exercises) ||
    r.exercises.length > 60
  )
    throw new Error("Invalid routine.");
  const ids = new Set();
  for (const e of r.exercises) {
    if (
      !e ||
      typeof e.id !== "string" ||
      !e.id ||
      ids.has(e.id) ||
      typeof e.exerciseId !== "string" ||
      !e.exerciseId ||
      typeof e.name !== "string" ||
      !e.name ||
      !Number.isInteger(e.sets) ||
      e.sets < 1 ||
      e.sets > 30 ||
      !Number.isInteger(e.reps) ||
      e.reps < 1 ||
      e.reps > 1000 ||
      !Number.isInteger(e.rest) ||
      e.rest < 0 ||
      e.rest > 3600 ||
      !["external", "bodyweight", "assisted", "timed", "distance"].includes(
        e.kind,
      )
    )
      throw new Error(
        "Routine has invalid exercises, sets, repetitions or rest.",
      );
    ids.add(e.id);
  }
}
export function migrateSession(s: Session): Session {
  return {
    ...s,
    schemaVersion: 2,
    plan: s.plan || [],
    notes: s.notes || "",
    pausedMs: s.pausedMs || 0,
  };
}
export function restRemaining(rest: RestTimer | undefined, now: number) {
  return !rest
    ? 0
    : rest.pausedMs !== undefined
      ? rest.pausedMs
      : Math.max(0, rest.endsAt - now);
}
export function elapsed(s: Session, now: number) {
  return Math.max(
    0,
    (s.actual.workoutEndedAt || s.pausedAt || now) -
      s.createdAt -
      (s.pausedMs || 0),
  );
}
export function comparableKey(set: CompletedSet) {
  return `${set.exerciseId}:${set.kind || "external"}:${set.reps}`;
}
export function personalBest(set: CompletedSet, history: Session[]) {
  if ((set.kind || "external") !== "external" || set.load <= 0) return false;
  const prior = history
    .filter((s) => s.status !== "cancelled")
    .flatMap((s) => s.sets)
    .filter(
      (s) =>
        s.id !== set.id &&
        s.completedAt < set.completedAt &&
        comparableKey(s) === comparableKey(set),
    );
  return (
    prior.length > 0 &&
    prior.every(
      (s) =>
        convertLoad(s.load, s.unit, "kg") <
        convertLoad(set.load, set.unit, "kg") - 1e-6,
    )
  );
}
export function previousSet(
  id: string,
  history: Session[],
  activeId?: string,
  kind?: CompletedSet["kind"],
) {
  return history
    .filter((s) => s.id !== activeId && s.status !== "cancelled")
    .flatMap((s) => s.sets)
    .filter(
      (s) => s.exerciseId === id && (!kind || (s.kind || "external") === kind),
    )
    .sort((a, b) => b.completedAt - a.completedAt)[0];
}
export function routineFromSession(s: Session): Routine {
  const plan = s.plan?.length
    ? structuredClone(s.plan)
    : [...new Set(s.sets.map((x) => x.exerciseId))].map((id) => {
        const sets = s.sets.filter((x) => x.exerciseId === id);
        return {
          id,
          exerciseId: id,
          name: sets[0].exerciseName,
          sets: sets.length,
          reps: sets[0].reps || 8,
          rest: 90,
          kind: sets[0].kind || "external",
        } as PlannedExercise;
      });
  return {
    id: makeId(),
    name: s.label,
    exercises: plan,
    updatedAt: Date.now(),
    revision: 1,
  };
}
