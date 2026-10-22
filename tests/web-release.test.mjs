import { test } from "node:test";
import assert from "node:assert/strict";
import {
  newSession,
  saveSet,
  assertSession,
  validateSet,
} from "../lib/jimbro/session.ts";
import {
  makeSchedule,
  deadlines,
  phaseAt,
  alertMilestone,
  localDate,
} from "../lib/jimbro/schedule.ts";
import {
  convertLoad,
  starterRoutines,
  durationRange,
  migrateSession,
  elapsed,
  restRemaining,
  personalBest,
  routineFromSession,
  validateRoutine,
  previousSet,
} from "../lib/jimbro/routines.ts";
import {
  validateBackup,
  makeBackup,
  validatePreferences,
} from "../lib/jimbro/storage.ts";
import { defaultPreferences } from "../lib/jimbro/types.ts";
import { isThemePreference } from "../lib/jimbro/theme.ts";
import {
  emptyMemory,
  selectPhrase,
  chooseMascot,
} from "../lib/jimbro/personality.ts";
import { exercises, categories } from "../lib/jimbro/catalog.ts";
import { phraseCatalog } from "../lib/jimbro/phrases.ts";
import {
  exerciseProgress,
  externalVolume,
  workoutRecords,
  weeklyFrequency,
} from "../lib/jimbro/progress.ts";
const now = Date.parse("2030-01-02T12:00:00Z"),
  zone = "America/New_York";
const schedule = makeSchedule(
  {
    date: "2030-01-02",
    time: "10:00",
    preparation: "30",
    commute: "60",
    buffer: "15",
  },
  zone,
  now,
).schedule;
const fresh = () => newSession("s", schedule, "Push", now);
const set = (patch = {}) => ({
  id: "a",
  exerciseId: "bench-press",
  exerciseName: "Bench press",
  reps: 8,
  load: 20,
  unit: "kg",
  kind: "external",
  completedAt: now + 1000,
  ...patch,
});
const context = {
  tone: "unhinged",
  flirtation: false,
  history: true,
  previous: true,
  previousNotes: true,
  class: true,
  deadline: true,
  personalBest: true,
  saved: true,
};

test("theme preferences accept legacy records and reject invalid imported choices", () => {
  const legacy = { ...defaultPreferences };
  delete legacy.theme;
  assert.doesNotThrow(() => validatePreferences(legacy));
  for (const theme of ["light", "dark", "system"]) {
    assert.equal(isThemePreference(theme), true);
    const backup = makeBackup({ active: null, sessions: [], weights: [], preferences: { ...legacy, theme } });
    assert.equal(validateBackup(backup).preferences.theme, theme);
  }
  for (const theme of ["auto", "", null, 0, {}, "<script>"]) {
    assert.equal(isThemePreference(theme), false);
    assert.throws(() => validatePreferences({ ...legacy, theme }), /Invalid preferences/);
  }
  const oldBackup = makeBackup({ active: null, sessions: [], weights: [], preferences: legacy });
  assert.doesNotThrow(() => validateBackup(oldBackup));
  assert.equal(oldBackup.preferences.theme, undefined);
});
test("all seven starter routines validate and estimate a duration range", () => {
  assert.equal(starterRoutines.length, 7);
  for (const r of starterRoutines) {
    validateRoutine(r);
    const [a, b] = durationRange(r.exercises);
    assert.ok(a > 0 && b >= a);
  }
  assert.ok(
    durationRange(
      starterRoutines.find((r) => r.id === "starter-twenty").exercises,
    )[1] <= 20,
  );
});
test("routine snapshots never mutate when the reusable template is edited", () => {
  const r = structuredClone(starterRoutines[0]),
    s = { ...fresh(), plan: structuredClone(r.exercises) };
  r.exercises[0].sets = 20;
  assert.equal(s.plan[0].sets, 3);
  s.sets = [set()];
  const copy = routineFromSession(s);
  copy.exercises[0].sets = 9;
  assert.equal(s.plan[0].sets, 3);
});
test("v1 migration preserves ID revision all completed work and timestamps", () => {
  const original = saveSet(fresh(), set()),
    copy = structuredClone(original),
    migrated = migrateSession(original);
  assertSession(migrated);
  assert.equal(migrated.schemaVersion, 2);
  assert.deepEqual(migrated.sets, copy.sets);
  assert.equal(migrated.createdAt, copy.createdAt);
  assert.deepEqual(original, copy);
  assert.deepEqual(migrated.plan, []);
});
test("kg/lb round trips and mixed-unit comparison are equivalent", () => {
  assert.ok(
    Math.abs(convertLoad(convertLoad(20, "kg", "lb"), "lb", "kg") - 20) < 1e-9,
  );
  assert.equal(convertLoad(20, "kg", "kg"), 20);
});
test("rest pause recovery leaves departure and phase boundaries unchanged", () => {
  const s = { ...fresh(), rest: { endsAt: now + 90000 } };
  assert.equal(restRemaining(s.rest, now + 30000), 60000);
  s.rest.pausedMs = 60000;
  assert.equal(restRemaining(s.rest, now + 999999), 60000);
  assert.equal(deadlines(s.schedule).departure, deadlines(schedule).departure);
  assert.equal(phaseAt(s, deadlines(schedule).stop).key, "preparation");
});
test("elapsed pause behavior excludes pauses and ignores departure countdown", () => {
  const s = { ...fresh(), pausedAt: now + 60000, pausedMs: 10000 };
  assert.equal(elapsed(s, now + 999999), 50000);
  s.pausedAt = undefined;
  s.pausedMs = 110000;
  assert.equal(elapsed(s, now + 200000), 90000);
  s.actual.workoutEndedAt = now + 200000;
  assert.equal(elapsed(s, now + 999999), 90000);
});
test("unplanned workouts have no alerts and do not fake a departure", () => {
  const s = { ...fresh(), withoutDeadline: true };
  assert.equal(phaseAt(s, now + 1e8).key, "untimed");
  assert.equal(alertMilestone(s, now + 1e8), null);
  assert.deepEqual(s.actual, {});
});
test("personal best needs a comparable earlier result, excludes baseline/bodyweight/assistance", () => {
  const s = { ...fresh(), sets: [set()] };
  assert.equal(
    personalBest(set({ id: "b", load: 21, completedAt: now + 2000 }), [s]),
    true,
  );
  assert.equal(
    personalBest(set({ id: "b", load: 21, reps: 6, completedAt: now + 2000 }), [
      s,
    ]),
    false,
  );
  assert.equal(personalBest(set({ kind: "assisted" }), [s]), false);
  assert.equal(personalBest(set(), []), false);
  assert.equal(
    personalBest(
      set({
        id: "b",
        load: convertLoad(20, "kg", "lb"),
        unit: "lb",
        completedAt: now + 2000,
      }),
      [s],
    ),
    false,
  );
});
test("timed distance and assisted records validate without invented weight volume", () => {
  for (const s of [
    set({ kind: "timed", reps: 0, seconds: 60, load: 0 }),
    set({ kind: "distance", reps: 0, distanceKm: 2, load: 0 }),
    set({ kind: "assisted", load: 10 }),
  ])
    validateSet(s);
  assert.throws(() => validateSet(set({ kind: "timed", reps: 0, seconds: 0 })));
  assert.throws(() => validateSet(set({ reps: 0 })));
});
test("progress normalizes units, filters comparable measures, recomputes edits/deletions", () => {
  const s = {
    ...fresh(),
    status: "completed",
    actual: { workoutEndedAt: now + 10000 },
    sets: [
      set(),
      set({ id: "b", kind: "bodyweight", load: 0, reps: 20 }),
      set({ id: "c", kind: "assisted", load: 50 }),
    ],
  };
  assert.equal(externalVolume([s], "kg"), 160);
  assert.equal(
    exerciseProgress([s], "bench-press", "external", 8, "kg")[0].value,
    20,
  );
  s.sets[0].load = 30;
  assert.equal(externalVolume([s], "kg"), 240);
  assert.deepEqual(
    exerciseProgress([], "bench-press", "external", 8, "kg"),
    [],
  );
  assert.equal(workoutRecords([s], "2030-01-01", "2030-01-03").length, 1);
  assert.equal(weeklyFrequency([s, s])[0].days, 1);
});
test("captured workout local day survives device timezone changes and midnight finish", () => {
  const s = fresh();
  const date = s.workoutDate;
  s.actual.workoutEndedAt = now + 86400000;
  assert.equal(s.workoutDate, date);
  assert.equal(
    localDate(Date.parse("2030-01-02T04:59:59Z"), zone),
    "2030-01-01",
  );
});
test("backup validates complete records and malformed/duplicate/incompatible imports fail before writes", () => {
  const backup = makeBackup({
    active: null,
    sessions: [{ ...fresh(), status: "completed" }],
    weights: [],
    routines: [],
    preferences: defaultPreferences,
  });
  assert.deepEqual(validateBackup(backup), backup);
  for (const bad of [
    { ...backup, version: 3 },
    { ...backup, sessions: [fresh(), fresh()] },
    { ...backup, preferences: { ...defaultPreferences, nearMinutes: -1 } },
    { ...backup, sessions: [{ ...fresh(), sets: [set({ load: -1 })] }] },
  ])
    assert.throws(() => validateBackup(bad));
});
test("preferences validate booleans tones units and warning bounds", () => {
  validatePreferences(defaultPreferences);
  assert.throws(() =>
    validatePreferences({ ...defaultPreferences, unit: "stone" }),
  );
  assert.throws(() =>
    validatePreferences({ ...defaultPreferences, motion: "yes" }),
  );
});
test("all phrases have unique IDs and 100 supplied seed records", () => {
  assert.equal(
    new Set(phraseCatalog.map((p) => p.id)).size,
    phraseCatalog.length,
  );
  assert.equal(
    phraseCatalog.filter((p) => p.id.startsWith("seed-")).length,
    100,
  );
  for (const p of phraseCatalog) {
    assert.ok(p.text && p.event && p.tone && Array.isArray(p.requires));
  }
});
test("phrase truth and tone/flirt filters hold over exhaustion", () => {
  let memory = emptyMemory();
  for (let i = 0; i < 100; i++) {
    const result = selectPhrase(
      "set",
      `event${i}`,
      { tone: "quiet", flirtation: false, saved: true },
      memory,
      100000 + i * 13000,
      () => 0.3,
    );
    memory = result.memory;
    assert.ok(result.id);
    const phrase = phraseCatalog.find((p) => p.id === result.id);
    assert.equal(phrase.tone, "quiet");
    assert.equal(phrase.flirtatious, false);
  }
  assert.equal(
    selectPhrase(
      "complete",
      "invalid",
      { tone: "unhinged", flirtation: true },
      emptyMemory(),
      100000,
    ).text,
    null,
  );
  assert.equal(
    selectPhrase("progress", "invalid", context, emptyMemory(), 100000).id ===
      null,
    false,
  );
});
test("shuffle bag excludes immediate repeat and persists bounded history", () => {
  let memory = emptyMemory(),
    last = "";
  for (let i = 0; i < 140; i++) {
    const result = selectPhrase(
      "rest",
      `r${i}`,
      context,
      memory,
      100000 + i * 13000,
      () => 0.5,
    );
    assert.ok(result.id);
    assert.notEqual(result.id, last);
    last = result.id;
    memory = result.memory;
  }
  assert.ok(memory.events.length <= 100 && memory.recent.length <= 50);
});
test("event dedup and cooldown suppress ordinary chatter; deadlines outrank celebrations", () => {
  const first = selectPhrase(
    "set",
    "x",
    context,
    emptyMemory(),
    100000,
    () => 0,
  );
  assert.equal(
    selectPhrase("set", "x", context, first.memory, 999999).text,
    null,
  );
  assert.equal(
    selectPhrase("rest", "y", context, first.memory, 101000).text,
    null,
  );
  assert.ok(selectPhrase("departure", "z", context, first.memory, 101000).text);
  assert.equal(
    chooseMascot("departure", "complete", 200000, 100000),
    "departure",
  );
  assert.equal(chooseMascot("departure", "error", 200000, 100000), "error");
  assert.equal(chooseMascot("departure", "set", 100000, 100001), "set");
});
test("no eligible phrase is a safe silent result", () => {
  const r = selectPhrase(
    "progress",
    "p",
    { tone: "quiet", flirtation: false },
    emptyMemory(),
    100000,
    () => 0,
  );
  assert.equal(r.text, null);
});

test("previous performance respects measure type and never treats assistance as external load", () => {
  const s = {
    ...fresh(),
    sets: [
      set(),
      set({ id: "assisted", kind: "assisted", completedAt: now + 2000 }),
      set({
        id: "timed",
        kind: "timed",
        reps: 0,
        load: 0,
        seconds: 60,
        completedAt: now + 3000,
      }),
    ],
  };
  assert.equal(previousSet("bench-press", [s], "other", "external").id, "a");
  assert.equal(
    previousSet("bench-press", [s], "other", "assisted").id,
    "assisted",
  );
  assert.equal(
    previousSet("bench-press", [s], "other", "bodyweight"),
    undefined,
  );
});

test("bodyweight progress compares repetitions freely; assistance uses lower comparable assistance", () => {
  const s = {
    ...fresh(),
    sets: [
      set({ kind: "bodyweight", reps: 20, load: 0 }),
      set({ id: "b", kind: "assisted", load: 40 }),
      set({ id: "c", kind: "assisted", load: 25 }),
    ],
  };
  assert.equal(
    exerciseProgress([s], "bench-press", "bodyweight", 8, "kg")[0].value,
    20,
  );
  assert.equal(
    exerciseProgress([s], "bench-press", "assisted", 8, "kg")[0].value,
    25,
  );
});

test("singleton and empty phrase pools remain safe across cooldown and exhaustion", () => {
  const one = phraseCatalog.find(
    (p) => p.event === "set" && p.tone === "quiet" && !p.flirtatious,
  );
  let memory = emptyMemory();
  for (let i = 0; i < 4; i++) {
    const r = selectPhrase(
      "set",
      `single-${i}`,
      { tone: "quiet", flirtation: false, saved: true },
      memory,
      100000 + i * 13000,
      () => 0,
      [one],
    );
    assert.equal(r.id, one.id);
    memory = r.memory;
  }
  assert.equal(
    selectPhrase("set", "empty", context, memory, 999999, () => 0, []).text,
    null,
  );
});
test("catalog includes the original muscle-group scope and useful timing/distance defaults", () => {
  for (const group of [
    "Chest",
    "Back",
    "Shoulders",
    "Biceps",
    "Triceps",
    "Forearms",
    "Legs",
    "Glutes",
    "Core/Abs",
    "Full body",
    "Cardio",
  ])
    assert.ok(categories.includes(group));
  assert.equal(exercises.find((e) => e.id === "plank").kind, "timed");
  assert.equal(
    exercises.find((e) => e.id === "treadmill-run").kind,
    "distance",
  );
});
