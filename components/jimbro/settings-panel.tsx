"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  defaultPreferences,
  type Preferences,
  type Snapshot,
} from "@/lib/jimbro/types";
import {
  importBackup,
  makeBackup,
  putPreferences,
  validateBackup,
  type Backup,
} from "@/lib/jimbro/storage";
import { AppDialog } from "./app-dialog";
import { buttonStyle, inputStyle, secondaryStyle } from "./schedule-editor";
export function SettingsPanel({
  snapshot,
  busy,
  run,
  toggleSound,
  sound,
  soundMessage,
}: {
  snapshot: Snapshot;
  busy: boolean;
  run: (f: () => Promise<unknown>) => Promise<boolean>;
  toggleSound: () => Promise<void>;
  sound: boolean;
  soundMessage: string;
}) {
  const preferences = snapshot.preferences || defaultPreferences,
    [backup, setBackup] = useState<Backup | null>(null),
    [mode, setMode] = useState<"merge" | "replace">("merge"),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [notification, setNotification] = useState("");
  const save = (patch: Partial<Preferences>) =>
    run(() => putPreferences({ ...preferences, ...patch }));
  function exportData() {
    const blob = new Blob([JSON.stringify(makeBackup(snapshot), null, 2)], {
        type: "application/json",
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = `JimBro-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Backup download requested. Keep the JSON file somewhere safe.");
  }
  return (
    <div className="space-y-7">
      <section className="space-y-4">
        <h3 className="font-semibold">Your training preferences</h3>
        <label className="block text-sm">
          Display unit
          <select
            className={`${inputStyle} mt-2 w-full rounded-xl border px-3`}
            value={preferences.unit}
            disabled={busy}
            onChange={(e) => save({ unit: e.target.value as "kg" | "lb" })}
          >
            <option>kg</option>
            <option>lb</option>
          </select>
        </label>
        <p className="text-xs text-neutral-400">
          Changing display units converts values. Original measurements retain
          their original units.
        </p>
        {[
          ["restEnabled", "Enable set-rest timer"],
          ["autoRest", "Start rest after a saved set"],
        ].map(([key, label]) => (
          <label key={key} className="flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={preferences[key as "restEnabled" | "autoRest"]}
              disabled={busy}
              onChange={(e) => save({ [key]: e.target.checked })}
            />
            {label}
          </label>
        ))}
        <label className="block text-sm">
          Near-cutoff warning
          <select
            className={`${inputStyle} mt-2 w-full rounded-xl border px-3`}
            value={preferences.nearMinutes}
            disabled={busy}
            onChange={(e) => save({ nearMinutes: Number(e.target.value) })}
          >
            {[3, 5, 10, 15].map((n) => (
              <option key={n} value={n}>
                {n} minutes before cutoff
              </option>
            ))}
          </select>
        </label>
      </section>
      <section className="space-y-3 border-t border-white/10 pt-6">
        <h3 className="font-semibold">Jim’s personality</h3>
        <label className="block text-sm">
          Banter level
          <select
            value={preferences.tone}
            disabled={busy}
            onChange={(e) =>
              save({ tone: e.target.value as Preferences["tone"] })
            }
            className={`${inputStyle} mt-2 w-full rounded-xl border px-3`}
          >
            <option value="quiet">Quiet — minimal cues</option>
            <option value="encouraging">Encouraging — welcoming</option>
            <option value="playful">Playful — gym-bro jokes</option>
            <option value="unhinged">Unhinged — vegetable theatre</option>
          </select>
        </label>
        {(
          [
            ["flirtation", "Allow flirtatious lines"],
            ["showJim", "Show Jim"],
            ["motion", "Animate Jim"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={preferences[key]}
              disabled={busy}
              onChange={(e) => save({ [key]: e.target.checked })}
            />
            {label}
          </label>
        ))}
        <p className="text-xs text-neutral-400">
          Your system’s reduced-motion setting also applies. Timing information
          is always visible, with or without Jim.
        </p>
        <a
          href="/jim-gallery"
          className="inline-flex min-h-11 items-center text-sm text-lime-200 underline"
        >
          Explore Jim’s animation gallery
        </a>
      </section>
      <section className="space-y-3 border-t border-white/10 pt-6">
        <h3 className="font-semibold">Alerts</h3>
        <Button
          className={secondaryStyle}
          onClick={() => {
            void toggleSound();
          }}
        >
          {sound ? "Mute alert sound" : "Enable and test alert sound"}
        </Button>
        <p role="status" className="text-xs text-neutral-300">
          {soundMessage || "Sound starts muted on each visit."}
        </p>
        <Button
          className={secondaryStyle}
          onClick={async () => {
            if (!("Notification" in window)) {
              setNotification(
                "This browser does not support notifications. In-app cues still work.",
              );
              return;
            }
            try {
              const result = await Notification.requestPermission();
              setNotification(
                result === "granted"
                  ? "Notifications allowed for foreground deadline events. Delivery while locked or suspended is not guaranteed."
                  : "Notifications are not enabled. In-app cues still work.",
              );
            } catch {
              setNotification(
                "Notifications unavailable. In-app cues still work.",
              );
            }
          }}
        >
          Enable browser notifications
        </Button>
        <p role="status" className="text-xs text-neutral-300">
          {notification}
        </p>
        <p className="text-xs leading-5 text-neutral-400">
          Keep JimBro open and visible for cues. Browsers can suspend timers,
          sound and notifications when backgrounded, locked or closed. Use a
          separate reliable alarm for critical commitments.
        </p>
      </section>
      <section className="space-y-4 border-t border-white/10 pt-6">
        <h3 className="font-semibold">Your data, your device</h3>
        <p className="text-sm leading-6 text-neutral-300">
          Workout history lives in this browser on this device. Clearing site
          data can remove it. There are no accounts, cloud backups or automatic
          device synchronization. Export a backup regularly.
        </p>
        <Button className={buttonStyle} onClick={exportData}>
          Export full JSON backup
        </Button>
        <label className="block text-sm">
          Import JimBro backup
          <input
            type="file"
            accept="application/json,.json"
            className="mt-3 block w-full text-sm file:mr-3 file:min-h-11 file:rounded-lg file:border file:border-white/20 file:bg-black file:px-3 file:text-white"
            onChange={async (e) => {
              setError("");
              setMessage("");
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                if (file.size > 15000000)
                  throw new Error("Backup is too large (15 MB maximum).");
                const value = validateBackup(JSON.parse(await file.text()));
                setBackup(value);
              } catch (reason) {
                setError(
                  reason instanceof SyntaxError
                    ? "This file is not valid JSON. Nothing has changed."
                    : (reason as Error).message,
                );
              }
              e.target.value = "";
            }}
          />
        </label>
        <p role="alert" className="text-sm text-rose-300">
          {error}
        </p>
        <p role="status" className="text-sm text-lime-200">
          {message}
        </p>
      </section>
      {backup ? (
        <AppDialog title="Review backup import" onClose={() => setBackup(null)}>
          <p className="text-sm leading-6">
            {backup.sessions.length} sessions, {backup.routines.length}{" "}
            routines, {backup.weights.length} bodyweight records. Exported{" "}
            {new Date(backup.exportedAt).toLocaleString()}.
          </p>
          <fieldset className="my-5 space-y-3">
            <legend className="mb-3 text-sm">Import policy</legend>
            <label className="flex min-h-11 items-center gap-3 text-sm">
              <input
                type="radio"
                name="policy"
                checked={mode === "merge"}
                onChange={() => setMode("merge")}
              />
              Merge: existing IDs and preferences win; add new records.
            </label>
            <label className="flex min-h-11 items-center gap-3 text-sm">
              <input
                type="radio"
                name="policy"
                checked={mode === "replace"}
                onChange={() => setMode("replace")}
              />
              Replace: remove current records and restore this backup.
            </label>
          </fieldset>
          <p className="mb-4 text-xs text-amber-200">
            {mode === "replace"
              ? "This replaces all current workout records, routines and preferences. Export a backup first."
              : "Competing active sessions block the entire import; finish your current workout first. No duplicate IDs are added."}
          </p>
          <Button
            className={buttonStyle}
            disabled={busy}
            onClick={async () => {
              if (await run(() => importBackup(backup, mode))) {
                setBackup(null);
                setMessage("Import committed successfully. Records are ready.");
              }
            }}
          >
            {mode === "replace" ? "Confirm replacement" : "Import and merge"}
          </Button>
        </AppDialog>
      ) : null}
    </div>
  );
}
