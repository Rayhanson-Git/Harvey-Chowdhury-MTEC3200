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
  kind?: SetKind;
  seconds?: number;
  distanceKm?: number;
  notes?: string;
};
export type Session = {
  id: string;
  schemaVersion: 1 | 2;
  revision: number;
  createdAt: number;
  updatedAt: number;
  workoutDate: string;
  workoutTimezone: string;
  label: string;
  status: "active" | "completed" | "cancelled";
  schedule: Schedule;
  sets: CompletedSet[];
  withoutDeadline?: boolean;
  commitmentName?: string;
  commitmentType?: "general" | "class" | "work";
  plan?: PlannedExercise[];
  routineId?: string;
  notes?: string;
  endedEarly?: boolean;
  rest?: RestTimer;
  pausedAt?: number;
  pausedMs?: number;
  actual: Partial<
    Record<
      "workoutEndedAt" | "preparationCompletedAt" | "departedAt" | "arrivedAt",
      number
    >
  >;
};
export type BodyWeight = {
  id: string;
  date: string;
  value: number;
  unit: Unit;
  recordedAt: number;
};
export type Snapshot = {
  active: Session | null;
  sessions: Session[];
  weights: BodyWeight[];
  routines?: Routine[];
  preferences?: Preferences;
};
export type Exercise = {
  id: string;
  name: string;
  category: string;
  equipment: string;
  source: string;
};

export type SetKind =
  "external" | "bodyweight" | "assisted" | "timed" | "distance";
export type PlannedExercise = {
  id: string;
  exerciseId: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
  kind: SetKind;
};
export type Routine = {
  id: string;
  name: string;
  exercises: PlannedExercise[];
  updatedAt: number;
  revision: number;
  starter?: boolean;
};
export type RestTimer = { endsAt: number; pausedMs?: number };
export type Preferences = {
  unit: Unit;
  tone: "quiet" | "encouraging" | "playful" | "unhinged";
  flirtation: boolean;
  showJim: boolean;
  motion: boolean;
  autoRest: boolean;
  restEnabled: boolean;
  nearMinutes: number;
};
export const defaultPreferences: Preferences = {
  unit: "kg",
  tone: "encouraging",
  flirtation: false,
  showJim: true,
  motion: true,
  autoRest: true,
  restEnabled: true,
  nearMinutes: 5,
};
