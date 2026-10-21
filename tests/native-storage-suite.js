import {
  loadSnapshot,
  startSession,
  updateSession,
  putRoutine,
  putPreferences,
  makeBackup,
  importBackup,
  claimAlert,
  claimPhrase,
  databaseName,
} from "./jimbro/storage.js";
import { newSession, saveSet } from "./jimbro/session.js";
import { makeSchedule } from "./jimbro/schedule.js";
import { starterRoutines } from "./jimbro/routines.js";
import { defaultPreferences } from "./jimbro/types.js";
const result = document.querySelector("#result"),
  button = document.querySelector("#run");
const assert = (value, msg = "Assertion failed") => {
  if (!value) throw new Error(msg);
};
const remove = () =>
  new Promise((resolve, reject) => {
    const r = indexedDB.deleteDatabase(databaseName);
    r.onsuccess = resolve;
    r.onerror = reject;
    r.onblocked = () => reject(new Error("Database blocked"));
  });

const raw = (db, stores, action) =>
  new Promise((resolve, reject) => {
    const tx = db.transaction(stores, "readwrite");
    action(tx);
    tx.oncomplete = resolve;
    tx.onabort = () => reject(tx.error);
  });
const now = Date.parse("2030-01-02T12:00:00Z"),
  schedule = makeSchedule(
    {
      date: "2030-01-02",
      time: "10:00",
      preparation: "30",
      commute: "60",
      buffer: "15",
    },
    "America/New_York",
    now,
  ).schedule;
const fresh = (id) => newSession(id, schedule, "QA workout", now);
const set = {
  id: "set-one",
  exerciseId: "bench-press",
  exerciseName: "Bench press",
  reps: 8,
  load: 20,
  unit: "kg",
  completedAt: now + 1000,
};
button.onclick = async () => {
  button.disabled = true;
  let pass = 0,
    fail = 0;
  const lines = [];
  const test = async (name, fn) => {
    try {
      await fn();
      pass++;
      lines.push("PASS " + name);
    } catch (e) {
      fail++;
      lines.push("FAIL " + name + ": " + e.message);
    }
    result.textContent = lines.join("\n");
  };
  try {
    await remove();
    await test("new v2 database loads with default preferences", async () => {
      const s = await loadSnapshot();
      assert(s.sessions.length === 0 && s.preferences.unit === "kg");
    });
    await test("two independent concurrent starts serialize to one active ID", async () => {
      const [a, b] = await Promise.all([
        startSession(fresh("a")),
        startSession(fresh("b")),
      ]);
      assert(a.id === b.id);
      assert((await loadSnapshot()).sessions.length === 1);
    });
    await test("completed set commits and survives a fresh connection", async () => {
      const s = (await loadSnapshot()).active;
      await updateSession(s.id, s.revision, (c) => saveSet(c, set));
      assert((await loadSnapshot()).active.sets.length === 1);
    });
    await test("stale revision rejects without duplicate work", async () => {
      const s = (await loadSnapshot()).active;
      let rejected = false;
      try {
        await updateSession(s.id, 1, (c) => saveSet(c, { ...set, id: "bad" }));
      } catch {
        rejected = true;
      }
      assert(rejected);
      assert((await loadSnapshot()).active.sets.length === 1);
    });
    await test("routine and preferences persist", async () => {
      await putRoutine({ ...starterRoutines[0], id: "custom", starter: false });
      await putPreferences({ ...defaultPreferences, tone: "playful" });
      const s = await loadSnapshot();
      assert(s.routines.length === 1 && s.preferences.tone === "playful");
    });
    await test("alert claims are atomic across connections", async () => {
      const s = (await loadSnapshot()).active;
      const claims = await Promise.all([
        claimAlert(s, "stop"),
        claimAlert(s, "stop"),
      ]);
      assert(claims.filter(Boolean).length === 1);
    });
    await test("phrase events persist and deduplicate", async () => {
      const ctx = { tone: "playful", flirtation: false, saved: true };
      const a = await claimPhrase("set", "qa-event", ctx, 100000),
        b = await claimPhrase("set", "qa-event", ctx, 200000);
      assert(a.text && !b.text);
    });
    let backup = makeBackup(await loadSnapshot());
    await test("invalid replacement validates before touching records", async () => {
      let rejected = false;
      try {
        await importBackup(
          {
            ...backup,
            sessions: [{ ...backup.sessions[0], sets: [{ ...set, load: -1 }] }],
          },
          "replace",
        );
      } catch {
        rejected = true;
      }
      assert(rejected);
      assert((await loadSnapshot()).active.sets.length === 1);
    });
    await test("merge keeps existing IDs without duplication", async () => {
      await importBackup(backup, "merge");
      const s = await loadSnapshot();
      assert(s.sessions.length === 1 && s.routines.length === 1);
    });
    await test("competing active import rolls back entirely", async () => {
      const next = { ...backup, sessions: [fresh("other")] };
      let rejected = false;
      try {
        await importBackup(next, "merge");
      } catch {
        rejected = true;
      }
      assert(rejected);
      assert((await loadSnapshot()).active.id === backup.sessions[0].id);
    });
    await test("failed transaction preserves old sets and revision", async () => {
      const s = (await loadSnapshot()).active;
      let rejected = false;
      try {
        await updateSession(s.id, s.revision, (c) => ({
          ...c,
          sets: [...c.sets, { ...set, id: "invalid", reps: -2 }],
        }));
      } catch {
        rejected = true;
      }
      assert(rejected);
      const after = (await loadSnapshot()).active;
      assert(after.revision === s.revision && after.sets.length === 1);
    });
    await test("simulated write failure never resolves success", async () => {
      const s = (await loadSnapshot()).active,
        original = IDBObjectStore.prototype.put;
      let rejected = false;
      IDBObjectStore.prototype.put = function (value, ...args) {
        if (this.name === "sessions")
          throw new DOMException("QA quota", "QuotaExceededError");
        return original.call(this, value, ...args);
      };
      try {
        await updateSession(s.id, s.revision, (c) => ({
          ...c,
          label: "Must not save",
        }));
      } catch {
        rejected = true;
      } finally {
        IDBObjectStore.prototype.put = original;
      }
      assert(rejected);
      assert((await loadSnapshot()).active.label === s.label);
    });
    await test("valid full replacement restores sessions routines and preferences atomically", async () => {
      await importBackup(
        { ...backup, preferences: { ...backup.preferences, unit: "lb" } },
        "replace",
      );
      const s = await loadSnapshot();
      assert(
        s.sessions.length === 1 &&
          s.active.sets.length === 1 &&
          s.routines.length === 1 &&
          s.preferences.unit === "lb",
      );
    });
    await test("v1 IndexedDB upgrade preserves session pointer work and date", async () => {
      await remove();
      const request = indexedDB.open(databaseName, 1);
      await new Promise((resolve, reject) => {
        request.onupgradeneeded = () => {
          const db = request.result;
          const sessions = db.createObjectStore("sessions", { keyPath: "id" });
          sessions.createIndex("workoutDate", "workoutDate");
          db.createObjectStore("meta", { keyPath: "key" });
          db.createObjectStore("exercises", { keyPath: "id" });
          const weights = db.createObjectStore("bodyWeight", { keyPath: "id" });
          weights.createIndex("date", "date");
        };
        request.onsuccess = resolve;
        request.onerror = reject;
      });
      const db = request.result,
        old = saveSet(fresh("legacy"), set);
      await raw(db, ["sessions", "meta"], (tx) => {
        tx.objectStore("sessions").put(old);
        tx.objectStore("meta").put({ key: "active", id: old.id });
      });
      db.close();
      const s = await loadSnapshot();
      assert(
        s.active.schemaVersion === 2 &&
          s.active.sets[0].id === set.id &&
          s.active.workoutDate === old.workoutDate &&
          s.active.id === "legacy",
      );
    });
    await test("rest and elapsed pause state survive reload connection", async () => {
      const s = (await loadSnapshot()).active;
      await updateSession(s.id, s.revision, (c) => ({
        ...c,
        rest: { endsAt: now + 90000, pausedMs: 30000 },
        pausedAt: now + 2000,
        pausedMs: 1000,
      }));
      const after = (await loadSnapshot()).active;
      assert(
        after.rest.pausedMs === 30000 &&
          after.pausedMs === 1000 &&
          after.pausedAt === now + 2000,
      );
    });
    await remove();
  } catch (e) {
    fail++;
    lines.push("FATAL " + e.message);
  }
  result.textContent = `${pass} passed, ${fail} failed\n` + lines.join("\n");
  button.disabled = false;
};
