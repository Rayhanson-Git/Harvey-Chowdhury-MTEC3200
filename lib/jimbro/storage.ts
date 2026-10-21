import type { BodyWeight, Session, Snapshot } from "./types.ts";
import { assertSession, validateWeight } from "./session.ts";

export const databaseName = "jimbro";
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") { reject(new Error("Browser storage is unavailable. Your work cannot be saved in this browser.")); return; }
    let rejected = false;
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      const sessions = db.createObjectStore("sessions", { keyPath: "id" });
      sessions.createIndex("workoutDate", "workoutDate");
      db.createObjectStore("meta", { keyPath: "key" });
      db.createObjectStore("exercises", { keyPath: "id" });
      const weights = db.createObjectStore("bodyWeight", { keyPath: "id" });
      weights.createIndex("date", "date");
    };
    request.onblocked = () => { rejected = true; reject(new Error("Close other JimBro tabs, then retry. A storage upgrade is blocked.")); };
    request.onerror = () => reject(new Error("Could not open local storage. Your data has not been reset. Close other tabs or check browser storage settings."));
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      if (rejected) db.close(); else resolve(db);
    };
  });
}

// Resolve only after commit, never on individual request success.
async function transaction<T>(stores: string[], mode: IDBTransactionMode, run: (tx: IDBTransaction, done: (result: T) => void, fail: (error: unknown) => void) => void): Promise<T> {
  const db = await openDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(stores, mode);
      let result: T;
      let failure: unknown;
      const fail = (error: unknown) => { failure = error; try { tx.abort(); } catch { reject(error); } };
      tx.oncomplete = () => resolve(result);
      tx.onabort = () => reject(failure || tx.error || new Error("Save failed. Your unsaved input is still here; retry before reloading."));
      tx.onerror = () => { failure ||= tx.error; };
      try { run(tx, (value) => { result = value; }, fail); } catch (error) { fail(error); }
    });
  } finally { db.close(); }
}

function read<T>(request: IDBRequest<T>, success: (value: T) => void, fail: (error: unknown) => void) {
  request.onsuccess = () => { try { success(request.result); } catch (error) { fail(error); } };
}

export function loadSnapshot(): Promise<Snapshot> {
  return transaction(["sessions", "meta", "bodyWeight"], "readonly", (tx, done, fail) => {
    let sessions: Session[] | undefined, weights: BodyWeight[] | undefined;
    let pointer: { key: string; id: string } | undefined;
    let pending = 3;
    const finish = () => {
      if (--pending) return;
      sessions!.forEach(assertSession); weights!.forEach(validateWeight);
      const active = pointer ? sessions!.find((s) => s.id === pointer!.id && s.status === "active") : null;
      if ((pointer && !active) || sessions!.filter((s) => s.status === "active").length !== (active ? 1 : 0)) throw new Error("The saved active session needs recovery. Your data has been kept; do not clear browser storage.");
      done({ active: active || null, sessions: sessions!.sort((a, b) => b.createdAt - a.createdAt), weights: weights!.sort((a, b) => b.date.localeCompare(a.date) || b.recordedAt - a.recordedAt) });
    };
    read(tx.objectStore("sessions").getAll(), (value) => { sessions = value; finish(); }, fail);
    read(tx.objectStore("bodyWeight").getAll(), (value) => { weights = value; finish(); }, fail);
    read(tx.objectStore("meta").get("active"), (value) => { pointer = value; finish(); }, fail);
  });
}

export function startSession(candidate: Session): Promise<Session> {
  assertSession(candidate);
  if (candidate.status !== "active") throw new Error("Only an active workout can be started.");
  return transaction(["sessions", "meta"], "readwrite", (tx, done, fail) => {
    const sessions = tx.objectStore("sessions"), meta = tx.objectStore("meta");
    read(meta.get("active"), (pointer) => {
      if (pointer) {
        read(sessions.get(pointer.id), (existing) => {
          assertSession(existing);
          if (existing.status !== "active") throw new Error("The saved session needs recovery. No data was changed.");
          done(existing);
        }, fail);
      } else {
        // The pointer and session are created atomically; competing tabs serialize.
        sessions.add(candidate); meta.add({ key: "active", id: candidate.id }); done(candidate);
      }
    }, fail);
  });
}

export function updateSession(id: string, expectedRevision: number, change: (session: Session) => Session): Promise<Session> {
  return transaction(["sessions", "meta"], "readwrite", (tx, done, fail) => {
    const sessions = tx.objectStore("sessions");
    read(sessions.get(id), (current) => {
      assertSession(current);
      if (current.revision !== expectedRevision) throw new Error("This workout changed in another tab. Refresh saved data, then retry your unsaved entry.");
      const next = { ...change(structuredClone(current)), id: current.id, schemaVersion: current.schemaVersion, createdAt: current.createdAt, workoutDate: current.workoutDate, workoutTimezone: current.workoutTimezone, revision: current.revision + 1, updatedAt: Date.now() };
      if (current.status !== "active" && next.status === "active") throw new Error("A finished session cannot be reactivated.");
      assertSession(next);
      sessions.put(next);
      if (next.status !== "active") {
        const meta = tx.objectStore("meta");
        read(meta.get("active"), (pointer) => { if (pointer?.id === id) meta.delete("active"); }, fail);
      }
      done(next);
    }, fail);
  });
}

export function putBodyWeight(weight: BodyWeight): Promise<BodyWeight> {
  validateWeight(weight);
  return transaction(["bodyWeight"], "readwrite", (tx, done) => { tx.objectStore("bodyWeight").put(weight); done(weight); });
}

export function claimAlert(session: Session, milestone: string): Promise<boolean> {
  const key = `alert:${session.id}:${session.schedule.revision}:${milestone}`;
  return transaction(["sessions", "meta"], "readwrite", (tx, done, fail) => {
    read(tx.objectStore("sessions").get(session.id), (current) => {
      assertSession(current);
      if (current.status !== "active" || current.schedule.revision !== session.schedule.revision) { done(false); return; }
      const meta = tx.objectStore("meta");
      read(meta.get(key), (receipt) => {
        if (receipt) { done(false); return; }
        meta.add({ key, deliveredAt: Date.now() }); done(true);
      }, fail);
    }, fail);
  });
}

export function acknowledgeAlert(session: Session, milestone: string): Promise<void> {
  const key = `alert:${session.id}:${session.schedule.revision}:${milestone}`;
  return transaction(["meta"], "readwrite", (tx, done, fail) => {
    const meta = tx.objectStore("meta");
    read(meta.get(key), (receipt) => { if (receipt) meta.put({ ...receipt, acknowledgedAt: Date.now() }); done(); }, fail);
  });
}
