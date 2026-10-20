import { test } from "node:test";
import assert from "node:assert/strict";
import { calculatePlan } from "../.test-build/plan-input.js";

process.env.TZ = "America/New_York";
const input = { date: "2030-01-02", time: "10:00", preparation: "30", commute: "60", buffer: "15" };
const now = new Date("2030-01-01T09:00");
function plan(values, at = now) {
  const result = calculatePlan(values, at);
  assert.equal(result.ok, true);
  return result.plan;
}
function clock(value) {
  return `${value.getHours()}:${String(value.getMinutes()).padStart(2, "0")}`;
}

test("reference example deducts each duration and buffer once", () => {
  const result = plan(input);
  assert.deepEqual([clock(result.stop), clock(result.leave), clock(result.arrival)], ["8:15", "8:45", "9:45"]);
});
test("edited commute changes action times while preserving arrival and source values", () => {
  const original = { ...input };
  const result = plan({ ...input, commute: "75" });
  assert.deepEqual([clock(result.stop), clock(result.leave), clock(result.arrival)], ["8:00", "8:30", "9:45"]);
  assert.deepEqual(input, original);
});
test("midnight example crosses to the previous calendar date", () => {
  const result = plan({ ...input, time: "00:30" });
  assert.deepEqual([clock(result.stop), clock(result.leave), clock(result.arrival)], ["22:45", "23:15", "0:15"]);
  assert.deepEqual([result.stop.getDate(), result.leave.getDate(), result.arrival.getDate()], [1, 1, 2]);
});
test("explicit zero durations are valid", () => {
  const result = plan({ ...input, preparation: "0", commute: "0", buffer: "0" });
  assert.equal(result.stop.getTime(), result.commitment.getTime());
});
test("passed workout stop retains a valid future commitment and warns", () => {
  assert.equal(plan(input).stopHasPassed, false);
  assert.equal(plan(input, new Date("2030-01-02T09:00")).stopHasPassed, true);
});
test("blank, negative, fractional, nonnumeric and excessive inputs produce no plan", () => {
  for (const commute of ["", "-1", "1.5", "abc", "1e2", "9007199254740992"]) {
    const result = calculatePlan({ ...input, commute }, now);
    assert.equal(result.ok, false);
    assert.ok(result.errors.commute);
  }
  assert.equal(calculatePlan({ ...input, buffer: "9007199254740991" }, now).ok, false);
});
test("missing, invalid or expired commitment is rejected on every calculation", () => {
  for (const patch of [{ date: "" }, { time: "" }, { date: "2030-02-30" }, { date: "2029-12-31" }]) {
    assert.equal(calculatePlan({ ...input, ...patch }, now).ok, false);
  }
  assert.equal(calculatePlan(input, new Date("2030-01-02T10:00")).ok, false);
});
test("nonexistent local time at the spring daylight-saving transition is rejected", () => {
  assert.equal(calculatePlan({ ...input, date: "2030-03-10", time: "02:30" }, now).ok, false);
});
