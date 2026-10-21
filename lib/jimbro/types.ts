import type { PlanInput, PlanErrors } from "../plan-input.ts";

export type { PlanInput, PlanErrors };
export type Unit = "kg" | "lb";
export type Schedule = {
  input: PlanInput;
  timezone: string;
  commitment: number;
  offsetMinutes: number;
  revision: number;
};
export type CompletedSet = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  reps: number;
  load: number;
  unit: Unit;
  completedAt: number;
};
export type Session = {
  id: string;
  schemaVersion: 1;
  revision: number;
  createdAt: number;
  updatedAt: number;
  workoutDate: string;
  workoutTimezone: string;
  label: string;
  status: "active" | "completed" | "cancelled";
  schedule: Schedule;
  sets: CompletedSet[];
  actual: Partial<Record<"workoutEndedAt" | "preparationCompletedAt" | "departedAt" | "arrivedAt", number>>;
};
export type BodyWeight = { id: string; date: string; value: number; unit: Unit; recordedAt: number };
export type Snapshot = { active: Session | null; sessions: Session[]; weights: BodyWeight[] };
export type Exercise = { id: string; name: string; category: string; equipment: string; source: string };
