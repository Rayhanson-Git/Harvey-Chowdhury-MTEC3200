"use client";
import { useEffect, useState } from "react";
import { JimCharacter, type JimPose } from "./jim-character";
const poses: JimPose[] = [
  "idle",
  "greeting",
  "ready",
  "set",
  "rest",
  "progress",
  "warning",
  "preparation",
  "departure",
  "complete",
  "recovery",
  "error",
];
export function JimGallery() {
  const [motion, setMotion] = useState(true),
    [visible, setVisible] = useState(true),
    [version, setVersion] = useState(0);
  useEffect(() => {
    const handler = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);
  return (
    <main className="jim-theme min-h-screen bg-jim-background px-5 py-10 text-jim-text">
      <div className="mx-auto max-w-6xl">
        <a
          href="/settings"
          className="inline-flex min-h-11 items-center text-sm text-jim-positive underline"
        >
          ← Return to JimBro
        </a>
        <h1 className="mt-5 text-4xl font-semibold">Jim, in motion.</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-jim-muted">
          Production rig gallery. Every state uses the same aligned artwork.
          Your system’s reduced-motion setting overrides animation.
        </p>
        <label className="my-5 flex min-h-11 items-center gap-3">
          <input
            type="checkbox"
            checked={motion}
            onChange={(e) => setMotion(e.target.checked)}
          />
          Play animations
        </label>
        <button
          className="mb-6 min-h-11 rounded-xl border border-jim-border-strong px-4"
          onClick={() => setVersion((v) => v + 1)}
        >
          Replay states
        </button>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {poses.map((pose) => (
            <section
              key={`${pose}-${version}`}
              className="rounded-3xl border border-jim-border-soft p-5"
            >
              <div className="mx-auto max-w-[200px]">
                <JimCharacter pose={pose} motion={motion && visible} />
              </div>
              <h2 className="mt-3 text-center text-sm capitalize">{pose}</h2>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
