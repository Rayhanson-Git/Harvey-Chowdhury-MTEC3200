import type { BodyWeight, CompletedSet, Schedule, Session, Unit } from "./types.ts";
import { commitmentOptions, localDate } from "./schedule.ts";

export function newSession(id: string, schedule: Schedule, label: string, now: number): Session {
  return { id, schemaVersion: 1, revision: 1, createdAt: now, updatedAt: now, workoutDate: localDate(now, schedule.timezone), workoutTimezone: schedule.timezone, label: label.trim().slice(0, 60) || "Workout", status: "active", schedule, sets: [], actual: {} };
}
export function validUnit(unit: unknown): unit is Unit { return unit === "kg" || unit === "lb"; }
export function validateSet(set: CompletedSet) {
  if (typeof set.id !== "string" || !set.id || typeof set.exerciseId !== "string" || !set.exerciseId || typeof set.exerciseName !== "string" || !set.exerciseName || !Number.isSafeInteger(set.reps) || set.reps <= 0 || !Number.isFinite(set.load) || set.load < 0 || !validUnit(set.unit) || !Number.isFinite(set.completedAt)) throw new Error("Enter positive whole reps, a load of zero or more, and a unit.");
}
export function saveSet(session: Session, set: CompletedSet): Session {
  validateSet(set);
  return { ...session, sets: [...session.sets.filter((x) => x.id !== set.id), { ...set }].sort((a, b) => a.completedAt - b.completedAt) };
}
export function validateWeight(weight: BodyWeight) {
  if (typeof weight.id !== "string" || !weight.id || !/^\d{4}-\d{2}-\d{2}$/.test(weight.date) || new Date(`${weight.date}T12:00:00Z`).toISOString().slice(0, 10) !== weight.date || !Number.isFinite(weight.value) || weight.value <= 0 || !validUnit(weight.unit) || !Number.isFinite(weight.recordedAt)) throw new Error("Enter a valid measurement date, positive body weight and unit.");
}
export function completedWorkout(session: Session) {
  return session.status !== "cancelled" && !!session.actual.workoutEndedAt && session.sets.length > 0;
}

// Reject incompatible/corrupt records instead of deleting a user's database.
export function assertSession(value: unknown): asserts value is Session {
  if (!value || typeof value !== "object") throw new Error("A saved session is unreadable. Your stored data has been kept.");
  const s = value as Session;
  if (s.schemaVersion !== 1 || typeof s.id !== "string" || !s.id || !Number.isSafeInteger(s.revision) || s.revision < 1 || !["active", "completed", "cancelled"].includes(s.status) || !Array.isArray(s.sets) || !s.actual || typeof s.actual !== "object" || Array.isArray(s.actual) || typeof s.label !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s.workoutDate) || !Number.isFinite(s.createdAt) || !Number.isFinite(s.updatedAt)) throw new Error("A saved session has an unsupported format. Your stored data has been kept.");
  const p = s.schedule;
  if (!p || !Number.isFinite(p.commitment) || !Number.isFinite(p.offsetMinutes) || !Number.isSafeInteger(p.revision) || p.revision < 1 || !p.input || !/^\d{4}-\d{2}-\d{2}$/.test(p.input.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(p.input.time)) throw new Error("The saved schedule is unreadable. Your stored data has been kept.");
  for (const field of ["preparation", "commute", "buffer"] as const) if (typeof p.input[field] !== "string" || !/^\d+$/.test(p.input[field].trim()) || !Number.isSafeInteger(Number(p.input[field]))) throw new Error("The saved schedule contains invalid durations.");
  if (!Number.isFinite(new Date(p.commitment - (Number(p.input.preparation) + Number(p.input.commute) + Number(p.input.buffer)) * 60_000).getTime())) throw new Error("The saved schedule is outside the supported date range.");
  if (!commitmentOptions(p.input, p.timezone).includes(p.commitment)) throw new Error("The saved commitment does not match its local time and timezone.");
  if (localDate(s.createdAt, s.workoutTimezone) !== s.workoutDate) throw new Error("The saved workout date is unreadable.");
  s.sets.forEach(validateSet);
  if (new Set(s.sets.map((x) => x.id)).size !== s.sets.length || Object.values(s.actual).some((x) => !Number.isFinite(x))) throw new Error("The saved workout contains invalid entries.");
}
