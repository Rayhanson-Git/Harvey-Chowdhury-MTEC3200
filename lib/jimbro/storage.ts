import type {
  BodyWeight,
  Session,
  Snapshot,
  Routine,
  Preferences,
} from "./types.ts";
import { assertSession, validateWeight } from "./session.ts";

import { defaultPreferences } from "./types.ts";
import { migrateSession, validateRoutine } from "./routines.ts";
export const databaseName = "jimbro";
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(
        new Error(
          "Browser storage is unavailable. Your work cannot be saved in this browser.",
        ),
      );
      return;
    }
    let rejected = false;
    const request = indexedDB.open(databaseName, 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("sessions")) {
        const sessions = db.createObjectStore("sessions", { keyPath: "id" });
        sessions.createIndex("workoutDate", "workoutDate");
        db.createObjectStore("meta", { keyPath: "key" });
        db.createObjectStore("exercises", { keyPath: "id" });
        const weights = db.createObjectStore("bodyWeight", { keyPath: "id" });
        weights.createIndex("date", "date");
      }
      if (!db.objectStoreNames.contains("routines"))
        db.createObjectStore("routines", { keyPath: "id" });
      const cursor = request.transaction!.objectStore("sessions").openCursor();
      cursor.onsuccess = () => {
        const c = cursor.result;
        if (c) {
          assertSession(c.value);
          c.update(migrateSession(c.value));
          c.continue();
        }
      };
    };
    request.onblocked = () => {
      rejected = true;
      reject(
        new Error(
          "Close other JimBro tabs, then retry. A storage upgrade is blocked.",
        ),
      );
    };
    request.onerror = () =>
      reject(
        new Error(
          "Could not open local storage. Your data has not been reset. Close other tabs or check browser storage settings.",
        ),
      );
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      if (rejected) db.close();
      else resolve(db);
    };
  });
}

// Resolve only after commit, never on individual request success.
async function transaction<T>(
  stores: string[],
  mode: IDBTransactionMode,
  run: (
    tx: IDBTransaction,
    done: (result: T) => void,
    fail: (error: unknown) => void,
  ) => void,
): Promise<T> {
  const db = await openDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(stores, mode);
      let result: T;
      let failure: unknown;
      const fail = (error: unknown) => {
        failure = error;
        try {
          tx.abort();
        } catch {
          reject(error);
        }
      };
      tx.oncomplete = () => resolve(result);
      tx.onabort = () =>
        reject(
          failure ||
            tx.error ||
            new Error(
              "Save failed. Your unsaved input is still here; retry before reloading.",
            ),
        );
      tx.onerror = () => {
        failure ||= tx.error;
      };
      try {
        run(
          tx,
          (value) => {
            result = value;
          },
          fail,
        );
      } catch (error) {
        fail(error);
      }
    });
  } finally {
    db.close();
  }
}

function read<T>(
  request: IDBRequest<T>,
  success: (value: T) => void,
  fail: (error: unknown) => void,
) {
  request.onsuccess = () => {
    try {
      success(request.result);
    } catch (error) {
      fail(error);
    }
  };
}

export function loadSnapshot(): Promise<Snapshot> {
  return transaction(
    ["sessions", "meta", "bodyWeight", "routines"],
    "readonly",
    (tx, done, fail) => {
      let sessions: Session[] | undefined, weights: BodyWeight[] | undefined;
      let pointer: { key: string; id: string } | undefined;
      let pending = 5;
      let routines: Routine[] = [],
        preferences: Preferences = defaultPreferences;
      const finish = () => {
        if (--pending) return;
        sessions!.forEach(assertSession);
        weights!.forEach(validateWeight);
        const active = pointer
          ? sessions!.find((s) => s.id === pointer!.id && s.status === "active")
          : null;
        if (
          (pointer && !active) ||
          sessions!.filter((s) => s.status === "active").length !==
            (active ? 1 : 0)
        )
          throw new Error(
            "The saved active session needs recovery. Your data has been kept; do not clear browser storage.",
          );
        done({
          active: active || null,
          sessions: sessions!.sort((a, b) => b.createdAt - a.createdAt),
          routines,
          preferences,
          weights: weights!.sort(
            (a, b) =>
              b.date.localeCompare(a.date) || b.recordedAt - a.recordedAt,
          ),
        });
      };
      read(
        tx.objectStore("routines").getAll(),
        (value) => {
          routines = value;
          routines.forEach(validateRoutine);
          finish();
        },
        fail,
      );
      read(
        tx.objectStore("meta").get("preferences"),
        (value) => {
          if (value) {
            validatePreferences(value.value);
            preferences = value.value;
          }
          finish();
        },
        fail,
      );
      read(
        tx.objectStore("sessions").getAll(),
        (value) => {
          sessions = value;
          finish();
        },
        fail,
      );
      read(
        tx.objectStore("bodyWeight").getAll(),
        (value) => {
          weights = value;
          finish();
        },
        fail,
      );
      read(
        tx.objectStore("meta").get("active"),
        (value) => {
          pointer = value;
          finish();
        },
        fail,
      );
    },
  );
}

export function startSession(candidate: Session): Promise<Session> {
  assertSession(candidate);
  if (candidate.status !== "active")
    throw new Error("Only an active workout can be started.");
  return transaction(["sessions", "meta"], "readwrite", (tx, done, fail) => {
    const sessions = tx.objectStore("sessions"),
      meta = tx.objectStore("meta");
    read(
      meta.get("active"),
      (pointer) => {
        if (pointer) {
          read(
            sessions.get(pointer.id),
            (existing) => {
              assertSession(existing);
              if (existing.status !== "active")
                throw new Error(
                  "The saved session needs recovery. No data was changed.",
                );
              done(existing);
            },
            fail,
          );
        } else {
          // The pointer and session are created atomically; competing tabs serialize.
          sessions.add(candidate);
          meta.add({ key: "active", id: candidate.id });
          done(candidate);
        }
      },
      fail,
    );
  });
}

export function updateSession(
  id: string,
  expectedRevision: number,
  change: (session: Session) => Session,
): Promise<Session> {
  return transaction(["sessions", "meta"], "readwrite", (tx, done, fail) => {
    const sessions = tx.objectStore("sessions");
    read(
      sessions.get(id),
      (current) => {
        assertSession(current);
        if (current.revision !== expectedRevision)
          throw new Error(
            "This workout changed in another tab. Refresh saved data, then retry your unsaved entry.",
          );
        const next = {
          ...change(structuredClone(current)),
          id: current.id,
          schemaVersion: 2 as const,
          createdAt: current.createdAt,
          workoutDate: current.workoutDate,
          workoutTimezone: current.workoutTimezone,
          revision: current.revision + 1,
          updatedAt: Date.now(),
        };
        if (current.status !== "active" && next.status === "active")
          throw new Error("A finished session cannot be reactivated.");
        assertSession(next);
        sessions.put(next);
        if (next.status !== "active") {
          const meta = tx.objectStore("meta");
          read(
            meta.get("active"),
            (pointer) => {
              if (pointer?.id === id) meta.delete("active");
            },
            fail,
          );
        }
        done(next);
      },
      fail,
    );
  });
}

export function putBodyWeight(weight: BodyWeight): Promise<BodyWeight> {
  validateWeight(weight);
  return transaction(["bodyWeight"], "readwrite", (tx, done) => {
    tx.objectStore("bodyWeight").put(weight);
    done(weight);
  });
}

export function claimAlert(
  session: Session,
  milestone: string,
): Promise<boolean> {
  const key = `alert:${session.id}:${session.schedule.revision}:${milestone}`;
  return transaction(["sessions", "meta"], "readwrite", (tx, done, fail) => {
    read(
      tx.objectStore("sessions").get(session.id),
      (current) => {
        assertSession(current);
        if (
          current.status !== "active" ||
          current.schedule.revision !== session.schedule.revision
        ) {
          done(false);
          return;
        }
        const meta = tx.objectStore("meta");
        read(
          meta.get(key),
          (receipt) => {
            if (receipt) {
              done(false);
              return;
            }
            meta.add({ key, deliveredAt: Date.now() });
            done(true);
          },
          fail,
        );
      },
      fail,
    );
  });
}

export function acknowledgeAlert(
  session: Session,
  milestone: string,
): Promise<void> {
  const key = `alert:${session.id}:${session.schedule.revision}:${milestone}`;
  return transaction(["meta"], "readwrite", (tx, done, fail) => {
    const meta = tx.objectStore("meta");
    read(
      meta.get(key),
      (receipt) => {
        if (receipt) meta.put({ ...receipt, acknowledgedAt: Date.now() });
        done();
      },
      fail,
    );
  });
}

export function validatePreferences(p: Preferences) {
  if (
    !p ||
    !["kg", "lb"].includes(p.unit) ||
    !["quiet", "encouraging", "playful", "unhinged"].includes(p.tone) ||
    !["flirtation", "showJim", "motion", "autoRest", "restEnabled"].every(
      (k) => typeof p[k as keyof Preferences] === "boolean",
    ) ||
    !Number.isInteger(p.nearMinutes) ||
    p.nearMinutes < 1 ||
    p.nearMinutes > 30
  )
    throw new Error("Invalid preferences.");
}
export function putPreferences(value: Preferences): Promise<void> {
  validatePreferences(value);
  return transaction(["meta"], "readwrite", (tx, done) => {
    tx.objectStore("meta").put({ key: "preferences", value });
    done();
  });
}
export function putRoutine(r: Routine, expected?: number): Promise<void> {
  validateRoutine(r);
  return transaction(["routines"], "readwrite", (tx, done, fail) => {
    const store = tx.objectStore("routines");
    read(
      store.get(r.id),
      (current) => {
        if (current && expected !== current.revision)
          throw new Error(
            "Routine changed in another tab. Reopen it before editing.",
          );
        store.put({
          ...r,
          revision: (current?.revision || 0) + 1,
          updatedAt: Date.now(),
          starter: false,
        });
        done();
      },
      fail,
    );
  });
}
export function deleteRoutine(id: string): Promise<void> {
  return transaction(["routines"], "readwrite", (tx, done) => {
    tx.objectStore("routines").delete(id);
    done();
  });
}
export function deleteSession(id: string, expected: number): Promise<void> {
  return transaction(["sessions", "meta"], "readwrite", (tx, done, fail) => {
    const s = tx.objectStore("sessions");
    read(
      s.get(id),
      (current) => {
        assertSession(current);
        if (current.revision !== expected)
          throw new Error("Session changed. Refresh before deleting.");
        if (current.status === "active")
          throw new Error("Finish or discard the active session first.");
        s.delete(id);
        done();
      },
      fail,
    );
  });
}
export type Backup = {
  format: "jimbro";
  version: 2;
  exportedAt: number;
  sessions: Session[];
  weights: BodyWeight[];
  routines: Routine[];
  preferences: Preferences;
};
export function validateBackup(value: unknown): Backup {
  if (!value || typeof value !== "object")
    throw new Error("This is not a JimBro backup.");
  const b = value as Backup;
  if (
    b.format !== "jimbro" ||
    b.version !== 2 ||
    !Number.isFinite(b.exportedAt) ||
    !Array.isArray(b.sessions) ||
    !Array.isArray(b.weights) ||
    !Array.isArray(b.routines) ||
    b.sessions.length > 20000 ||
    b.weights.length > 20000 ||
    b.routines.length > 500
  )
    throw new Error("Unsupported or oversized backup. Nothing has changed.");
  b.sessions.forEach(assertSession);
  b.weights.forEach(validateWeight);
  b.routines.forEach(validateRoutine);
  validatePreferences(b.preferences);
  for (const rows of [b.sessions, b.weights, b.routines])
    if (new Set(rows.map((r) => r.id)).size !== rows.length)
      throw new Error("Duplicate identifiers in backup. Nothing has changed.");
  if (b.sessions.filter((s) => s.status === "active").length > 1)
    throw new Error("Backup contains competing active sessions.");
  return structuredClone(b);
}
export function makeBackup(s: Snapshot): Backup {
  return {
    format: "jimbro",
    version: 2,
    exportedAt: Date.now(),
    sessions: s.sessions,
    weights: s.weights,
    routines: s.routines || [],
    preferences: s.preferences || defaultPreferences,
  };
}
export function importBackup(
  value: unknown,
  mode: "merge" | "replace",
): Promise<void> {
  const b = validateBackup(value);
  return transaction(
    ["sessions", "meta", "bodyWeight", "routines"],
    "readwrite",
    (tx, done, fail) => {
      const sessions = tx.objectStore("sessions"),
        meta = tx.objectStore("meta");
      read(
        sessions.getAll(),
        (existing) => {
          // Keep existing IDs on merge; importing active work beside different active work is forbidden.
          const merged =
            mode === "replace"
              ? b.sessions
              : [
                  ...existing,
                  ...b.sessions.filter(
                    (s) => !existing.some((x: Session) => x.id === s.id),
                  ),
                ];
          const active = merged.filter((s) => s.status === "active");
          if (active.length > 1)
            throw new Error(
              "Finish the current workout before importing another active session.",
            );
          if (mode === "replace") {
            sessions.clear();
            meta.clear();
            tx.objectStore("bodyWeight").clear();
            tx.objectStore("routines").clear();
          }
          for (const session of b.sessions)
            if (
              mode === "replace" ||
              !existing.some((x: Session) => x.id === session.id)
            )
              sessions.put(migrateSession(session));
          for (const [name, rows] of [
            ["bodyWeight", b.weights],
            ["routines", b.routines],
          ] as const) {
            const store = tx.objectStore(name);
            for (const row of rows) {
              if (mode === "replace") store.put(row);
              else
                read(
                  store.get(row.id),
                  (current) => {
                    if (!current) store.put(row);
                  },
                  fail,
                );
            }
          }
          if (active[0]) meta.put({ key: "active", id: active[0].id });
          else meta.delete("active");
          if (mode === "replace")
            meta.put({ key: "preferences", value: b.preferences });
          done();
        },
        fail,
      );
    },
  );
}

export async function claimPhrase(
  event: import("./phrases.ts").PhraseEvent,
  id: string,
  context: import("./personality.ts").PhraseContext,
  now: number,
) {
  const { selectPhrase, emptyMemory } = await import("./personality.ts");
  return transaction<{ text: string | null; accepted: boolean }>(
    ["meta"],
    "readwrite",
    (tx, done, fail) => {
      const store = tx.objectStore("meta");
      read(
        store.get("jim-memory"),
        (record) => {
          const memory = record?.value || emptyMemory();
          const result = selectPhrase(event, id, context, memory, now);
          store.put({ key: "jim-memory", value: result.memory });
          done({ text: result.text, accepted: !memory.events.includes(id) });
        },
        fail,
      );
    },
  );
}
