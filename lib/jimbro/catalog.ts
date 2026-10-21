import type { Exercise } from "./types.ts";

// Original starter catalog of common exercise names, not an imported GymLog dataset.
// No coaching, medical claims, media, or third-party descriptions are copied.
const rows = [
  ["bench-press", "Bench press", "Chest", "Barbell"], ["incline-press", "Incline dumbbell press", "Chest", "Dumbbells"],
  ["push-up", "Push-up", "Chest", "Body weight"], ["chest-fly", "Cable chest fly", "Chest", "Cable"],
  ["pull-up", "Pull-up", "Back", "Pull-up bar"], ["lat-pulldown", "Lat pulldown", "Back", "Cable"],
  ["barbell-row", "Barbell row", "Back", "Barbell"], ["seated-row", "Seated cable row", "Back", "Cable"],
  ["squat", "Back squat", "Legs", "Barbell"], ["leg-press", "Leg press", "Legs", "Machine"],
  ["rdl", "Romanian deadlift", "Legs", "Barbell"], ["lunge", "Dumbbell lunge", "Legs", "Dumbbells"],
  ["leg-curl", "Leg curl", "Legs", "Machine"], ["calf-raise", "Standing calf raise", "Legs", "Machine"],
  ["shoulder-press", "Dumbbell shoulder press", "Shoulders", "Dumbbells"], ["lateral-raise", "Lateral raise", "Shoulders", "Dumbbells"],
  ["face-pull", "Face pull", "Shoulders", "Cable"], ["biceps-curl", "Dumbbell curl", "Arms", "Dumbbells"],
  ["hammer-curl", "Hammer curl", "Arms", "Dumbbells"], ["triceps-pushdown", "Triceps pushdown", "Arms", "Cable"],
  ["dip", "Dip", "Arms", "Parallel bars"], ["crunch", "Crunch", "Core", "Body weight"],
  ["hanging-knee-raise", "Hanging knee raise", "Core", "Pull-up bar"], ["deadlift", "Deadlift", "Back", "Barbell"],
];
export const exercises: Exercise[] = rows.map(([id, name, category, equipment]) => ({ id, name, category, equipment, source: "JimBro original starter catalog · common exercise names" }));
export const categories = [...new Set(exercises.map((e) => e.category))];
