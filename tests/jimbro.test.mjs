import { test } from "node:test";
import assert from "node:assert/strict";
import { alertMilestone, clockText, commitmentOptions, deadlines, localDate, makeSchedule, phaseAt } from "../lib/jimbro/schedule.ts";
import { assertSession, completedWorkout, newSession, saveSet, validateWeight } from "../lib/jimbro/session.ts";
import { exercises } from "../lib/jimbro/catalog.ts";

const zone = "America/New_York";
const input = { date: "2030-01-02", time: "10:00", preparation: "30", commute: "60", buffer: "15" };
const now = Date.parse("2030-01-01T14:00:00Z");
const build = (patch = {}) => {
  const result = makeSchedule({ ...input, ...patch }, zone, now);
  assert.deepEqual(result.errors, {}); assert.ok(result.schedule); return result.schedule;
};
const schedule = build();
const session = () => newSession("one", schedule, "Push", now);
const set = { id: "set-one", exerciseId: "bench-press", exerciseName: "Bench press", reps: 8, load: 0, unit: "lb", completedAt: now };

test("reference absolute timestamps reserve the buffer once", () => {
  assert.deepEqual(deadlines(schedule), { stop: Date.parse("2030-01-02T13:15:00Z"), departure: Date.parse("2030-01-02T13:45:00Z"), arrival: Date.parse("2030-01-02T14:45:00Z"), commitment: Date.parse("2030-01-02T15:00:00Z") });
});
test("edited commute shifts stop and departure, preserving arrival and input", () => {
  const original = structuredClone(input), edited = build({ commute: "75" });
  assert.equal(deadlines(edited).stop, deadlines(schedule).stop - 15 * 60_000);
  assert.equal(deadlines(edited).arrival, deadlines(schedule).arrival); assert.deepEqual(input, original);
});
test("midnight calculations keep the prior date", () => {
  const d = deadlines(build({ time: "00:30" }));
  assert.equal(localDate(d.stop, zone), "2030-01-01"); assert.equal(localDate(d.departure, zone), "2030-01-01"); assert.equal(localDate(d.arrival, zone), "2030-01-02");
});
test("zero durations coincide and choose the most urgent boundary", () => {
  const s = newSession("zero", build({ preparation: "0", commute: "0", buffer: "0" }), "", now);
  assert.equal(deadlines(s.schedule).stop, s.schedule.commitment);
  assert.equal(phaseAt(s, s.schedule.commitment).key, "commitment"); assert.equal(alertMilestone(s, s.schedule.commitment), "commitment");
});
test("schedule rejects invalid inputs without mutating them", () => {
  for (const commute of ["", "-1", "1.5", "abc", "1e2", "9007199254740992"]) {
    const value = { ...input, commute }, copy = structuredClone(value);
    assert.equal(makeSchedule(value, zone, now).schedule, undefined); assert.deepEqual(value, copy);
  }
  for (const patch of [{ date: "" }, { time: "" }, { date: "2030-02-30" }, { date: "2020-01-01" }, { time: "24:00" }, { buffer: "9007199254740991" }]) assert.equal(makeSchedule({ ...input, ...patch }, zone, now).schedule, undefined);
  assert.equal(makeSchedule(input, zone, schedule.commitment).schedule, undefined);
});
test("spring gap is rejected; repeated fall time requires an explicit occurrence", () => {
  assert.deepEqual(commitmentOptions({ ...input, date: "2030-03-10", time: "02:30" }, zone), []);
  const repeated = { ...input, date: "2030-11-03", time: "01:30" };
  const options = commitmentOptions(repeated, zone);
  assert.equal(options.length, 2); assert.equal(options[1] - options[0], 3_600_000);
  assert.equal(makeSchedule(repeated, zone, now).schedule, undefined);
  assert.equal(makeSchedule(repeated, zone, now, options[1]).schedule.commitment, options[1]);
});
test("a non-hour DST change is resolved without assuming a 60-minute shift", () => {
  const repeated = { ...input, date: "2030-04-07", time: "01:45" };
  const options = commitmentOptions(repeated, "Australia/Lord_Howe");
  assert.equal(options.length, 2); assert.equal(options[1] - options[0], 1_800_000);
});
test("absolute deadlines do not move when the device timezone changes", () => {
  const original = process.env.TZ;
  try { const before = deadlines(schedule); process.env.TZ = "Asia/Dhaka"; assert.deepEqual(deadlines(schedule), before); }
  finally { if (original === undefined) delete process.env.TZ; else process.env.TZ = original; }
});
test("phases use exact boundaries and resuming skips stale phases", () => {
  const s = session(), d = deadlines(s.schedule);
  assert.equal(phaseAt(s, d.stop - 1).key, "workout");
  assert.equal(phaseAt(s, d.stop).key, "preparation");
  assert.equal(phaseAt(s, d.departure).key, "departure");
  assert.equal(phaseAt(s, d.arrival).key, "arrival");
  assert.equal(phaseAt(s, d.commitment + 100).key, "commitment");
  assert.deepEqual(s.actual, {});
});
test("early workout finish retains departure, while actual actions change guidance", () => {
  const s = session(), d = deadlines(s.schedule);
  s.actual.workoutEndedAt = now;
  assert.equal(phaseAt(s, now).key, "preparation"); assert.equal(phaseAt(s, now).deadline, d.departure);
  assert.match(phaseAt(s, now).message, /Workout finished/);
  assert.equal(alertMilestone(s, d.departure), "departure");
  s.actual.departedAt = now; assert.equal(phaseAt(s, now).key, "travel");
  s.actual.arrivedAt = now; assert.equal(phaseAt(s, now).key, "arrived");
});
test("alert selection consolidates missed deadlines and stops after session closure", () => {
  const s = session(), d = deadlines(s.schedule);
  assert.equal(alertMilestone(s, d.stop - 1), null); assert.equal(alertMilestone(s, d.stop), "stop");
  assert.equal(alertMilestone(s, d.departure + 1), "departure");
  s.status = "completed"; assert.equal(alertMilestone(s, d.commitment), null);
});
test("countdown never goes negative and wall clock jumps recompute it", () => {
  assert.equal(clockText(-10_000), "00:00:00"); assert.equal(clockText(3_661_001), "01:01:02");
  const target = deadlines(schedule).stop;
  assert.equal(clockText(target - (target - 90_000)), "00:01:30"); assert.equal(clockText(target - (target + 1)), "00:00:00");
});
test("set retries deduplicate and corrections preserve the exercise-name snapshot", () => {
  const original = session(), first = saveSet(original, set), retry = saveSet(first, set), corrected = saveSet(retry, { ...set, reps: 10 });
  assert.equal(original.sets.length, 0); assert.equal(retry.sets.length, 1); assert.equal(corrected.sets[0].reps, 10);
  assert.equal(corrected.id, original.id); assert.equal(corrected.sets[0].exerciseName, "Bench press");
});
test("set validation rejects invalid repetitions, loads and units", () => {
  for (const patch of [{ reps: 0 }, { reps: 1.5 }, { reps: Number.MAX_SAFE_INTEGER + 1 }, { load: -1 }, { load: Infinity }, { unit: "stones" }, { exerciseId: "" }]) assert.throws(() => saveSet(session(), { ...set, ...patch }));
});
test("history counts actual completed work rather than starts or cancelled work", () => {
  const s = session(); assert.equal(completedWorkout(s), false);
  s.sets = [set]; assert.equal(completedWorkout(s), false);
  s.actual.workoutEndedAt = now; assert.equal(completedWorkout(s), true);
  s.status = "cancelled"; assert.equal(completedWorkout(s), false);
});
test("body weight requires a valid date, positive finite value and explicit unit", () => {
  const value = { id: "w1", date: "2030-01-01", value: 170, unit: "lb", recordedAt: now };
  assert.doesNotThrow(() => validateWeight(value));
  for (const patch of [{ value: 0 }, { value: -1 }, { value: Infinity }, { date: "2030-02-30" }, { date: "" }, { unit: "stone" }]) assert.throws(() => validateWeight({ ...value, ...patch }));
});
test("saved records reject corruption or unsupported schema without a reset", () => {
  assert.doesNotThrow(() => assertSession(session()));
  for (const value of [null, {}, { ...session(), schemaVersion: 2 }, { ...session(), revision: 0 }, { ...session(), sets: [set, set] }, { ...session(), schedule: { ...schedule, commitment: NaN } }]) assert.throws(() => assertSession(value));
});
test("exercise catalog IDs are unique and source information is explicit", () => {
  assert.equal(exercises.length, 24); assert.equal(new Set(exercises.map((x) => x.id)).size, 24);
  for (const e of exercises) assert.ok(e.name && e.category && e.equipment && e.source);
});
