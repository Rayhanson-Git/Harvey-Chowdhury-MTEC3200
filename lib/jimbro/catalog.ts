import type { Exercise } from "./types.ts";

// Original starter catalog of common exercise names, not an imported GymLog dataset.
// No coaching, medical claims, media, or third-party descriptions are copied.
const rows = [
  ["bench-press", "Bench press", "Chest", "Barbell"],
  ["incline-press", "Incline dumbbell press", "Chest", "Dumbbells"],
  ["push-up", "Push-up", "Chest", "Body weight"],
  ["chest-fly", "Cable chest fly", "Chest", "Cable"],
  ["pull-up", "Pull-up", "Back", "Pull-up bar"],
  ["lat-pulldown", "Lat pulldown", "Back", "Cable"],
  ["barbell-row", "Barbell row", "Back", "Barbell"],
  ["seated-row", "Seated cable row", "Back", "Cable"],
  ["squat", "Back squat", "Legs", "Barbell"],
  ["leg-press", "Leg press", "Legs", "Machine"],
  ["rdl", "Romanian deadlift", "Legs", "Barbell"],
  ["lunge", "Dumbbell lunge", "Legs", "Dumbbells"],
  ["leg-curl", "Leg curl", "Legs", "Machine"],
  ["calf-raise", "Standing calf raise", "Legs", "Machine"],
  ["shoulder-press", "Dumbbell shoulder press", "Shoulders", "Dumbbells"],
  ["lateral-raise", "Lateral raise", "Shoulders", "Dumbbells"],
  ["face-pull", "Face pull", "Shoulders", "Cable"],
  ["biceps-curl", "Dumbbell curl", "Biceps", "Dumbbells"],
  ["hammer-curl", "Hammer curl", "Biceps", "Dumbbells"],
  ["triceps-pushdown", "Triceps pushdown", "Triceps", "Cable"],
  ["dip", "Dip", "Triceps", "Parallel bars"],
  ["crunch", "Crunch", "Core/Abs", "Body weight"],
  ["hanging-knee-raise", "Hanging knee raise", "Core/Abs", "Pull-up bar"],
  ["deadlift", "Deadlift", "Back", "Barbell"],
  ["wrist-curl", "Wrist curl", "Forearms", "Dumbbells"],
  ["hip-thrust", "Hip thrust", "Glutes", "Barbell"],
  ["glute-bridge", "Glute bridge", "Glutes", "Body weight"],
  ["plank", "Plank", "Core/Abs", "Body weight"],
  ["burpee", "Burpee", "Full body", "Body weight"],
  ["treadmill-run", "Treadmill run", "Cardio", "Treadmill"],
  ["stationary-cycle", "Stationary cycling", "Cardio", "Bike"],
];
const aliases: Record<string, string[]> = {
  "bench-press": ["flat bench", "barbell chest press"],
  rdl: ["RDL", "Romanian deadlift"],
  "lat-pulldown": ["lat pull down"],
  "hip-thrust": ["glute thrust"],
  "stationary-cycle": ["cycling", "bicycle", "bike"],
  "treadmill-run": ["running", "jogging"],
  "biceps-curl": ["bicep curl"],
};
export const exercises: Exercise[] = rows.map(
  ([id, name, category, equipment]) => ({
    id,
    name,
    category,
    equipment,
    aliases: aliases[id] || [],
    ...(id === "plank"
      ? { kind: "timed" as const }
      : ["treadmill-run", "stationary-cycle"].includes(id)
        ? { kind: "distance" as const }
        : {}),
    source: "JimBro original starter catalog · common exercise names",
  }),
);
export const categories = [...new Set(exercises.map((e) => e.category))];
