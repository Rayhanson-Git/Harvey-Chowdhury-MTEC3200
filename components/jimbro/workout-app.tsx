"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { newSession } from "@/lib/jimbro/session";
import { acknowledgeAlert, putBodyWeight, startSession, updateSession } from "@/lib/jimbro/storage";
import { BodyWeightTracker } from "./body-weight-tracker";
import { ScheduleEditor, secondaryStyle } from "./schedule-editor";
import { SectionCard } from "./section-card";
import { SessionActions } from "./session-actions";
import { SessionCountdown } from "./session-countdown";
import { useWorkoutStore } from "./use-workout-store";
import { WorkoutHistory } from "./workout-history";
import { WorkoutLogger, type ChangeSession } from "./workout-logger";

const tabs = [{ id: "workout", label: "Workout" }, { id: "schedule", label: "Plan" }, { id: "history", label: "History" }, { id: "progress", label: "Body weight" }] as const;
export function WorkoutApp() {
  const [view, setView] = useState<(typeof tabs)[number]["id"]>("workout");
  const store = useWorkoutStore();
  const { snapshot, busy, now } = store;
  const active = snapshot.active;
  const change: ChangeSession = (id, revision, transform) => store.run(() => updateSession(id, revision, transform));
  return <main className="min-h-screen w-full bg-black px-4 py-6 font-sans text-white [color-scheme:dark] [&_input]:scroll-mt-64 [&_select]:scroll-mt-64 [&_button]:scroll-mt-64 lg:[&_input]:scroll-mt-6 lg:[&_select]:scroll-mt-6 lg:[&_button]:scroll-mt-6 sm:px-8 sm:py-10">
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6"><div><a href="#main-content" className="sr-only focus:not-sr-only">Skip to workout content</a><p className="text-xs font-semibold uppercase tracking-widest text-rose-400">Make room for your next rep.</p><h1 className="mt-2 text-4xl font-bold tracking-tighter">Jim<span className="text-rose-500">Bro</span><span className="ml-3 align-middle text-xs font-normal tracking-normal text-neutral-400">working title</span></h1></div><div className="text-right text-xs leading-6 text-neutral-400"><p>Train with a plan. Leave on time.</p><p>One session. All your progress.</p></div></header>
      <div className={active ? "grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]" : ""}>
        {active ? <div className="sticky top-0 z-20 bg-black py-3 lg:col-start-2 lg:row-start-1 lg:top-6 lg:py-0">
          <SessionCountdown session={active} now={now} onExpand={() => setView("schedule")} />
          <div className="mt-6 hidden lg:block"><SectionCard title="Your next move" eyebrow="Workout → what’s next"><SessionActions key={active.id} session={active} now={now} busy={busy} change={change} /></SectionCard></div>
        </div> : null}
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
      <nav aria-label="Workout sections" className="mb-6 flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab.id} type="button" aria-current={view === tab.id ? "page" : undefined} onClick={() => setView(tab.id)} className={`min-h-12 rounded-xl px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-rose-400 ${view === tab.id ? "bg-white text-black" : "border border-white/10 text-neutral-300 hover:bg-neutral-900"}`}>{tab.label}</button>)}</nav>
      {store.error ? <div role="alert" className="mb-6 space-y-3 rounded-2xl border border-amber-500/40 p-5 text-sm text-amber-100"><p>{store.error}</p><p className="text-xs">Unsaved form input stays here. Refresh saved data before retrying; avoid reloading the page while you have an unsaved draft.</p><Button className={secondaryStyle} disabled={busy} onClick={() => { void store.reload(true); }}>Refresh saved data</Button></div> : null}
      {store.alert && active && store.alert.key.startsWith(`${active.id}:${active.schedule.revision}:`) ? <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rose-500/50 bg-rose-500/10 p-5"><p className="max-w-xl text-sm leading-6">{store.alert.message}</p><Button className={secondaryStyle} onClick={async () => { const alert = store.alert; if (!alert) return; try { await acknowledgeAlert(active, alert.milestone); store.setAlert(null); } catch { /* Keep visible so acknowledgment can be retried. */ } }}>Acknowledge</Button></div> : null}
      <div id="main-content" tabIndex={-1} className="outline-none">
        {store.loading ? <p role="status" className="py-16 text-neutral-400">Restoring your saved session…</p> : store.ready ? <>
          <div hidden={view !== "workout"}>{active ? <div className="space-y-6"><SectionCard title="Make every set count." eyebrow={`${active.workoutDate} · ${active.label}`}><WorkoutLogger key={active.id} session={active} busy={busy} change={change} /></SectionCard><div className="lg:hidden"><SectionCard title="Your next move" eyebrow="Workout → what’s next"><SessionActions key={active.id} session={active} now={now} busy={busy} change={change} /></SectionCard></div></div> : <div className="mx-auto max-w-xl"><SectionCard title="What are you training before?" eyebrow="First, protect your time"><ScheduleEditor session={null} busy={busy} onSave={async (schedule, label) => { const ok = await store.run(() => startSession(newSession(crypto.randomUUID(), schedule, label, Date.now()))); if (ok) setView("workout"); return ok; }} /></SectionCard></div>}</div>
          <div hidden={view !== "schedule"} className="mx-auto max-w-xl"><SectionCard title={active ? "Your transition plan" : "Start with a plan"} eyebrow="LeaveBy, built into your workout">{active ? <ScheduleEditor key={active.id} session={active} busy={busy} onSave={async (schedule, label, expected) => { const ok = await change(active.id, expected, (current) => ({ ...current, schedule, label: label.trim().slice(0, 60) || "Workout" })); if (ok) setView("workout"); return ok; }} /> : <p className="text-sm text-neutral-400">Open Workout to create your next session.</p>}</SectionCard></div>
          <div hidden={view !== "history"}><SectionCard title="The work you’ve put in." eyebrow="Your training history"><WorkoutHistory sessions={snapshot.sessions} busy={busy} change={change} /></SectionCard></div>
          <div hidden={view !== "progress"} className="mx-auto max-w-xl"><SectionCard title="A little perspective." eyebrow="Body-weight history"><BodyWeightTracker weights={snapshot.weights} busy={busy} onSave={(weight) => store.run(() => putBodyWeight(weight))} /></SectionCard></div>
        </> : <p className="py-10 text-sm text-neutral-400">Local storage must be available before starting a persistent session. Retry above after checking your browser settings.</p>}
      </div>
        </div>
      </div>
      <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs leading-6 text-neutral-400"><div><p>Saved in this browser. Clearing site data removes local records.</p><Link href="/leaveby" className="inline-block min-h-11 underline hover:text-white">Original LeaveBy coursework</Link></div><div className="max-w-sm"><Button className={secondaryStyle} type="button" onClick={() => { void store.toggleSound(); }}>{store.sound ? "Mute alerts" : "Enable alert sound"}</Button><p role="status" className="mt-2">{store.soundMessage || "Visual alerts stay on. Keep JimBro open and visible."}</p></div></footer>
    </div>
  </main>;
}
