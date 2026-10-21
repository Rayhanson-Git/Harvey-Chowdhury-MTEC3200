"use client";
import { makeId } from "@/lib/jimbro/identity";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Dumbbell,
  History,
  TrendingUp,
  Settings,
  ArrowUpRight,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { newSession } from "@/lib/jimbro/session";
import {
  deadlines,
  makeSchedule,
  localDate,
  clockText,
  phaseAt,
} from "@/lib/jimbro/schedule";
import {
  elapsed,
  routineFromSession,
  durationRange,
} from "@/lib/jimbro/routines";
import {
  acknowledgeAlert,
  startSession,
  updateSession,
  putRoutine,
  putBodyWeight,
} from "@/lib/jimbro/storage";
import {
  defaultPreferences,
  type Schedule,
  type Routine,
} from "@/lib/jimbro/types";
import {
  ScheduleEditor,
  buttonStyle,
  secondaryStyle,
  inputStyle,
} from "./schedule-editor";
import { SectionCard } from "./section-card";
import { useWorkoutStore } from "./use-workout-store";
import { WorkoutLogger, type ChangeSession } from "./workout-logger";
import { RoutineLibrary } from "./routine-library";
import { ActivePlan } from "./active-plan";
import { TimerDock } from "./timer-dock";
import { HistoryPanel } from "./history-panel";
import { DataChart, ProgressPanel } from "./progress-panel";
import { SettingsPanel } from "./settings-panel";
import { BodyWeightTracker } from "./body-weight-tracker";
import { JimCharacter } from "./jim-character";
import { useJim } from "./use-jim";
import { AppDialog } from "./app-dialog";
const tabs = [
  { id: "today", label: "Today", icon: CalendarDays },
  { id: "workout", label: "Workout", icon: Dumbbell },
  { id: "history", label: "History", icon: History },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "settings", label: "Settings", icon: Settings },
] as const;
export type View = (typeof tabs)[number]["id"];
type Draft = {
  schedule: Schedule;
  label: string;
  commitmentName: string;
  commitmentType: "general" | "class" | "work";
  withoutDeadline?: boolean;
};
export function WorkoutApp({ initialView = "today" }: { initialView?: View }) {
  const [view, setView] = useState<View>(initialView),
    [draft, setDraft] = useState<Draft | null>(null),
    [repeat, setRepeat] = useState<Routine | null>(null),
    [finish, setFinish] = useState(false),
    [close, setClose] = useState(false),
    [discard, setDiscard] = useState(false),
    [early, setEarly] = useState(false),
    [notes, setNotes] = useState(""),
    [directId] = useState<string | undefined>(() =>
      typeof window === "undefined"
        ? undefined
        : new URLSearchParams(window.location.search).get("session") ||
          undefined,
    );
  const store = useWorkoutStore(),
    { snapshot, busy, now } = store,
    active = snapshot.active,
    prefs = snapshot.preferences || defaultPreferences,
    jim = useJim(),
    welcomed = useRef(false);
  const previous = snapshot.sessions.filter(
    (s) => s.status !== "cancelled" && s.sets.length && s.id !== active?.id,
  );
  const context = {
    tone: prefs.tone,
    flirtation: prefs.flirtation,
    history: previous.length > 0,
    previous: previous.length > 0,
    previousNotes: previous.some(
      (s) => !!s.notes || s.sets.some((x) => !!x.notes),
    ),
    class: active?.commitmentType === "class",
    deadline: !!active && !active.withoutDeadline,
    saved: true,
  };
  const { emit } = jim;
  const ctx = useRef(context);
  useEffect(() => {
    ctx.current = context;
  });

  useEffect(() => {
    if (store.ready && !welcomed.current) {
      welcomed.current = true;
      void emit(
        previous.length ? "return" : "start",
        `visit:${makeId()}`,
        ctx.current,
      );
    }
  }, [store.ready, emit, previous.length]);
  const restKey = active?.rest?.endsAt;
  useEffect(() => {
    if (restKey && active?.id)
      void emit("rest", `${active.id}:rest:${restKey}`, ctx.current);
  }, [restKey, active?.id, emit]);
  const alertId = store.alert?.key;
  useEffect(() => {
    if (store.alert) {
      const milestone = store.alert.milestone,
        event =
          milestone === "warning"
            ? "warning"
            : milestone === "stop"
              ? "preparation"
              : milestone === "departure" ||
                  milestone === "arrival" ||
                  milestone === "commitment"
                ? "departure"
                : "warning";
      void emit(event, store.alert.key, ctx.current);
    }
  }, [alertId, emit, store.alert]);
  useEffect(() => {
    if (store.error) void emit("error", `error:${store.error}`, ctx.current);
  }, [store.error, emit]);
  const change: ChangeSession = (id, revision, transform) =>
    store.run(() => updateSession(id, revision, transform));
  const navigate = (v: View) => {
    setView(v);
    window.history.replaceState(null, "", v === "today" ? "/" : `/${v}`);
  };
  async function choose(r: Routine) {
    if (active) {
      await store.run(() => putRoutine({ ...r, id: makeId(), starter: false }));
      return;
    }
    if (!draft) {
      setRepeat(r);
      navigate("today");
      return;
    }
    const candidate = {
      ...newSession(makeId(), draft.schedule, r.name, Date.now()),
      schemaVersion: 2 as const,
      plan: structuredClone(r.exercises),
      routineId: r.id,
      withoutDeadline: draft.withoutDeadline,
      commitmentName: draft.commitmentName,
      commitmentType: draft.commitmentType,
      pausedMs: 0,
    };
    if (await store.run(() => startSession(candidate))) {
      setDraft(null);
      setRepeat(null);
      navigate("workout");
      void emit("start", `${candidate.id}:start`, {
        ...ctx.current,
        deadline: !candidate.withoutDeadline,
        class: candidate.commitmentType === "class",
      });
    }
  }
  function openUnscheduled() {
    const at = Date.now() + 86400000,
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const input = {
      date: localDate(at, zone),
      time: new Date(at).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }),
      preparation: "0",
      commute: "0",
      buffer: "0",
    };
    const result = makeSchedule(input, zone, Date.now());
    if (result.schedule)
      setDraft({
        schedule: result.schedule,
        label: "Open workout",
        commitmentName: "",
        commitmentType: "general",
        withoutDeadline: true,
      });
  }
  const title =
    view === "today"
      ? "Make time. Make progress."
      : view === "workout"
        ? "Put the work in."
        : view === "history"
          ? "Every session has a story."
          : view === "progress"
            ? "Your effort, in perspective."
            : "Make JimBro yours.";
  return (
    <main
      onClickCapture={(event) => {
        // WebKit does not focus pointer-clicked buttons by default. Capture the
        // invoking control before a modal mounts so focus can return to it.
        const trigger = (event.target as Element).closest<HTMLButtonElement>(
          "button",
        );
        if (trigger && !trigger.disabled)
          trigger.focus({ preventScroll: true });
      }}
      className="min-h-screen bg-jim-background font-sans text-[#f4f3ef] [color-scheme:dark] [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-4 [&_button]:focus-visible:outline-lime-200 [&_input]:scroll-mt-28 [&_input]:focus-visible:outline-lime-200 [&_select]:focus-visible:outline-lime-200"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-black focus:p-4"
      >
        Skip to main content
      </a>
      <div className="mx-auto max-w-[1440px] md:grid md:grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-[#101114] px-4 py-4 md:sticky md:top-0 md:h-screen md:border-r md:border-b-0 md:px-6 md:py-10">
          <Link
            prefetch={false}
            href="/"
            className="flex items-center gap-2 text-2xl font-black tracking-tighter"
          >
            {/* The shared vector lockup contains the canonical compact Jim mark. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/lockup-dark.svg"
              alt="JimBro"
              width="160"
              height="33"
              className="h-auto w-40"
            />
          </Link>
          <p className="mt-3 hidden text-[10px] uppercase tracking-[.2em] text-neutral-400 md:block">
            Time well lifted
          </p>
          <nav
            aria-label="Main navigation"
            className="mt-4 grid grid-cols-5 gap-1 md:mt-12 md:flex md:flex-col md:gap-3"
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(t.id)}
                aria-current={view === t.id ? "page" : undefined}
                className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] transition-colors md:min-h-12 md:flex-row md:justify-start md:gap-3 md:px-3 md:text-sm ${view === t.id ? "bg-rose-600/15 font-semibold text-rose-200" : "text-neutral-400 hover:bg-white/5 hover:text-white"}`}
              >
                <t.icon size={18} />
                {t.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto hidden pt-20 text-xs leading-6 text-neutral-400 md:block">
            <p>
              One workout.
              <br />
              The rest of your day.
            </p>
            <Link
              prefetch={false}
              href="/leaveby"
              className="mt-4 inline-flex min-h-11 items-center gap-1 underline"
            >
              Original LeaveBy
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </aside>
        <div className="min-w-0 px-4 py-7 sm:px-8 lg:px-10 lg:py-10">
          <header className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.24em] text-neutral-400">
                {view === "today"
                  ? "Your day, with room to train"
                  : `JimBro / ${view}`}
              </p>
              <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[44px]">
                {title}
              </h1>
            </div>
            <span className="hidden rounded-full border border-white/15 px-3 py-2 text-[10px] uppercase tracking-widest text-neutral-400 sm:inline-flex">
              Local first
            </span>
          </header>
          {active ? (
            <div className="sticky top-0 z-20 -mx-1 mb-4 flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-jim-raised p-3 shadow-xl xl:hidden">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                  {active.withoutDeadline
                    ? "Elapsed training"
                    : phaseAt(active, now).label}
                </p>
                <p className="font-mono text-xl tabular-nums">
                  {clockText(
                    active.withoutDeadline
                      ? elapsed(active, now)
                      : phaseAt(active, now).deadline - now,
                  )}
                </p>
              </div>
              <button
                className="min-h-11 rounded-xl border border-white/20 px-3 text-xs"
                onClick={() =>
                  document
                    .querySelector('[aria-label="Workout timers"]')
                    ?.scrollIntoView({ block: "center" })
                }
              >
                All timers
              </button>
            </div>
          ) : null}
          {!active && prefs.showJim && jim.text ? (
            <div className="mb-5 flex items-center gap-4 rounded-2xl border border-lime-300/20 bg-[#171e14] p-3">
              <div className="w-24 shrink-0">
                <JimCharacter
                  pose={jim.pose}
                  motion={prefs.motion && jim.visible}
                />
              </div>
              <p className="text-sm leading-6 text-neutral-200">{jim.text}</p>
            </div>
          ) : null}
          {store.error ? (
            <div
              role="alert"
              className="mb-5 rounded-2xl border border-amber-300/40 bg-amber-300/5 p-5 text-sm text-amber-100"
            >
              <p>{store.error}</p>
              <p className="mt-2 text-xs">
                Your unsaved inputs remain here. Avoid reloading until you retry
                successfully.
              </p>
              <Button
                className={`${secondaryStyle} mt-3`}
                disabled={busy}
                onClick={() => store.reload(true)}
              >
                Refresh saved data
              </Button>
            </div>
          ) : null}
          {store.alert &&
          active &&
          store.alert.key.startsWith(
            `${active.id}:${active.schedule.revision}:`,
          ) ? (
            <div
              role="alert"
              className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-400/40 bg-rose-400/10 p-4"
            >
              <p className="max-w-xl text-sm">{store.alert.message}</p>
              <Button
                className={secondaryStyle}
                onClick={async () => {
                  try {
                    await acknowledgeAlert(active, store.alert!.milestone);
                    store.setAlert(null);
                  } catch {
                    /* Keep alert available. */
                  }
                }}
              >
                Acknowledge
              </Button>
            </div>
          ) : null}
          <div
            className={`grid items-start gap-6 ${active ? "xl:grid-cols-[minmax(0,1fr)_290px]" : ""}`}
          >
            <div
              id="main-content"
              tabIndex={-1}
              className="min-w-0 outline-none"
            >
              {store.loading ? (
                <p role="status" className="py-20 text-neutral-400">
                  Restoring your saved workout…
                </p>
              ) : !store.ready ? (
                <p className="py-12 text-sm text-neutral-300">
                  Browser storage is required to save your workouts. Check
                  storage settings, then retry above.
                </p>
              ) : (
                <>
                  {view === "today" ? (
                    <div className="space-y-6">
                      {active ? (
                        <SectionCard
                          title={
                            active.actual.workoutEndedAt
                              ? "Your workout is saved. Keep your day on track."
                              : "You have a workout in progress."
                          }
                          eyebrow="Pick up where you left off"
                        >
                          <p className="mb-5 text-sm text-neutral-400">
                            {active.label} · {active.sets.length} recorded sets
                          </p>
                          <Button
                            className={buttonStyle}
                            onClick={() => navigate("workout")}
                          >
                            Resume session
                          </Button>
                        </SectionCard>
                      ) : null}
                      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(220px,1fr)]">
                        <SectionCard
                          title={
                            active
                              ? active.withoutDeadline
                                ? "Add a departure deadline"
                                : "Your departure plan"
                              : "What’s next on your calendar?"
                          }
                          eyebrow="01 / Protect your time"
                        >
                          <ScheduleEditor
                            now={now}
                            key={active?.id || "new"}
                            session={active}
                            busy={busy}
                            onSave={async (
                              schedule,
                              label,
                              expected,
                              commitmentName,
                              commitmentType,
                            ) => {
                              if (active)
                                return change(active.id, expected, (s) => ({
                                  ...s,
                                  schedule,
                                  label,
                                  commitmentName,
                                  commitmentType,
                                  withoutDeadline: false,
                                }));
                              setDraft({
                                schedule,
                                label,
                                commitmentName,
                                commitmentType,
                              });
                              return true;
                            }}
                          />
                          {!active ? (
                            <Button
                              className={`${secondaryStyle} mt-4 w-full`}
                              onClick={openUnscheduled}
                            >
                              Train without a deadline
                            </Button>
                          ) : null}
                        </SectionCard>
                        <div className="space-y-5">
                          <section className="overflow-hidden rounded-3xl border border-lime-300/15 bg-[#171e14] p-6">
                            {prefs.showJim ? (
                              <div className="mx-auto max-w-[240px]">
                                <JimCharacter
                                  pose={
                                    jim.pose === "idle" ? "ready" : jim.pose
                                  }
                                  motion={prefs.motion && jim.visible}
                                />
                              </div>
                            ) : (
                              <Clock3
                                className="mb-6 text-lime-200"
                                size={40}
                              />
                            )}
                            <p className="text-[10px] uppercase tracking-[.2em] text-lime-300">
                              Meet Jim. Your timekeeper with arms.
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold leading-tight">
                              A little structure.
                              <br />A lot of character.
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-neutral-400">
                              Plan your window, record your effort, and make the
                              rest of your day. No guilt about a shorter
                              session.
                            </p>
                          </section>
                          <section className="rounded-3xl border border-white/10 p-6">
                            <p className="text-3xl font-semibold">
                              {snapshot.sessions
                                .filter(
                                  (s) =>
                                    s.sets.length &&
                                    s.actual.workoutEndedAt &&
                                    s.status !== "cancelled",
                                )
                                .length.toString()
                                .padStart(2, "0")}
                            </p>
                            <p className="mt-2 text-sm text-neutral-400">
                              workouts in your story
                            </p>
                            <Button
                              className={`${secondaryStyle} mt-4`}
                              onClick={() => navigate("history")}
                            >
                              Open history ↗
                            </Button>
                          </section>
                        </div>
                      </div>
                      {!active ? (
                        <SectionCard
                          title="Find your next workout."
                          eyebrow="02 / Choose your starting point"
                        >
                          <RoutineLibrary
                            routines={snapshot.routines || []}
                            busy={busy}
                            run={store.run}
                            onChoose={(r) => {
                              setRepeat(r);
                              document
                                .getElementById("main-content")
                                ?.scrollIntoView();
                            }}
                          />
                        </SectionCard>
                      ) : null}
                    </div>
                  ) : null}
                  {view === "workout" ? (
                    active ? (
                      <div className="space-y-5">
                        {active.actual.workoutEndedAt ? (
                          <SectionCard
                            title="Work done. Session saved."
                            eyebrow={
                              active.endedEarly
                                ? "A shorter session still counts"
                                : "Your workout summary"
                            }
                          >
                            <p className="text-sm leading-6 text-neutral-300">
                              {active.sets.length} completed sets ·{" "}
                              {Math.round(elapsed(active, now) / 60000)}{" "}
                              minutes.{" "}
                              {active.withoutDeadline
                                ? ""
                                : "Your departure schedule remains active until you close the session."}
                            </p>
                            <div className="mt-5 flex flex-wrap gap-3">
                              <Button
                                className={buttonStyle}
                                onClick={() => setClose(true)}
                              >
                                Close session & reminders
                              </Button>
                              <Button
                                className={secondaryStyle}
                                onClick={() => navigate("history")}
                              >
                                Review history
                              </Button>
                            </div>
                          </SectionCard>
                        ) : null}
                        <SectionCard
                          title={active.label}
                          eyebrow="Your active workout"
                        >
                          <ActivePlan
                            session={active}
                            busy={busy}
                            change={change}
                          />
                          <WorkoutLogger
                            key={active.id}
                            session={active}
                            busy={busy}
                            change={change}
                            history={snapshot.sessions}
                            preferences={prefs}
                            onEvent={(event, id) => {
                              void emit(event, id, {
                                ...ctx.current,
                                personalBest: event === "progress",
                              });
                            }}
                          />
                          <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
                            {!active.actual.workoutEndedAt ? (
                              <Button
                                disabled={busy}
                                className={buttonStyle}
                                onClick={() => {
                                  setNotes(active.notes || "");
                                  setFinish(true);
                                }}
                              >
                                Finish workout
                              </Button>
                            ) : null}
                            <Button
                              className={secondaryStyle}
                              disabled={busy}
                              onClick={async () => {
                                await store.run(() =>
                                  putRoutine({
                                    ...routineFromSession(active),
                                    name: `${active.label} adaptation`,
                                  }),
                                );
                              }}
                            >
                              Save adaptation as routine
                            </Button>
                            <Button
                              className={secondaryStyle}
                              disabled={busy}
                              onClick={() => setDiscard(true)}
                            >
                              Discard session
                            </Button>
                          </div>
                        </SectionCard>
                      </div>
                    ) : (
                      <SectionCard
                        title="Start with the time you have."
                        eyebrow="No active workout"
                      >
                        <p className="mb-5 text-sm text-neutral-400">
                          Plan your next commitment, or choose an open workout.
                        </p>
                        <Button
                          className={buttonStyle}
                          onClick={() => navigate("today")}
                        >
                          Plan a workout
                        </Button>
                      </SectionCard>
                    )
                  ) : null}
                  {view === "history" ? (
                    <SectionCard
                      title="The work you’ve put in."
                      eyebrow="Calendar & sessions"
                    >
                      <HistoryPanel
                        key={directId || "history"}
                        initialId={directId}
                        sessions={snapshot.sessions}
                        busy={busy}
                        change={change}
                        run={store.run}
                        onRepeat={(r) => {
                          setRepeat(r);
                          navigate("today");
                        }}
                        preferences={prefs}
                      />
                    </SectionCard>
                  ) : null}
                  {view === "progress" ? (
                    <div className="space-y-6">
                      <SectionCard
                        title="Training, over time."
                        eyebrow="Actual records only"
                      >
                        <ProgressPanel
                          sessions={snapshot.sessions}
                          unit={prefs.unit}
                          now={now}
                        />
                      </SectionCard>
                      <SectionCard
                        title="Bodyweight, if you want it."
                        eyebrow="Optional · separate from lifted load"
                      >
                        <DataChart
                          rows={[...snapshot.weights].reverse().map((w) => ({
                            date: w.date,
                            value:
                              w.unit === prefs.unit
                                ? w.value
                                : prefs.unit === "kg"
                                  ? w.value * 0.45359237
                                  : w.value / 0.45359237,
                          }))}
                          label="Recorded bodyweight"
                          unit={prefs.unit}
                        />
                        <div className="mt-6">
                          <BodyWeightTracker
                            weights={snapshot.weights}
                            busy={busy}
                            onSave={(w) => store.run(() => putBodyWeight(w))}
                          />
                        </div>
                      </SectionCard>
                    </div>
                  ) : null}
                  {view === "settings" ? (
                    <SectionCard
                      title="The details are yours."
                      eyebrow="Preferences & data"
                    >
                      <SettingsPanel
                        snapshot={snapshot}
                        busy={busy}
                        run={store.run}
                        toggleSound={store.toggleSound}
                        sound={store.sound}
                        soundMessage={store.soundMessage}
                      />
                    </SectionCard>
                  ) : null}
                </>
              )}
            </div>
            {active ? (
              <div className="space-y-5 xl:sticky xl:top-6">
                <TimerDock
                  session={active}
                  now={now}
                  busy={busy}
                  change={change}
                  preferences={prefs}
                  onPlan={() => navigate("today")}
                />
                {prefs.showJim ? (
                  <section className="rounded-3xl border border-white/10 p-4">
                    <div className="mx-auto max-w-[180px]">
                      <JimCharacter
                        pose={jim.pose}
                        motion={prefs.motion && jim.visible}
                      />
                    </div>
                    <p className="min-h-12 text-center text-sm leading-6 text-neutral-300">
                      {jim.text || "Your sets. Your pace. I’ve got the clock."}
                    </p>
                  </section>
                ) : null}
              </div>
            ) : null}
          </div>

          <footer className="mt-10 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-5 text-[11px] leading-6 text-neutral-400">
            <p>Saved on this browser · Export in Settings for backup.</p>
            <Link
              prefetch={false}
              href="/leaveby"
              className="inline-flex min-h-11 items-center underline"
            >
              Original LeaveBy ↗
            </Link>
          </footer>
        </div>
      </div>
      {draft ? (
        <AppDialog
          title={
            draft.withoutDeadline
              ? "Choose your open workout"
              : "Your window is ready"
          }
          onClose={() => setDraft(null)}
        >
          <p className="mb-5 text-sm text-neutral-300">
            {draft.withoutDeadline
              ? "No deadline. Choose a routine and take the time you need."
              : `About ${Math.max(0, Math.floor((deadlines(draft.schedule).stop - now) / 60000))} minutes available. A duration estimate includes suggested rest and transitions.`}
          </p>
          {repeat ? (
            <div className="mb-5 rounded-xl border border-lime-300/30 p-4">
              <p className="mb-3 text-sm">Selected: {repeat.name}</p>
              <Button
                className={buttonStyle}
                disabled={busy}
                onClick={() => choose(repeat)}
              >
                Use selected routine
                {!draft.withoutDeadline &&
                durationRange(repeat.exercises)[1] >
                  (deadlines(draft.schedule).stop - now) / 60000
                  ? " anyway"
                  : ""}
              </Button>
              <p className="mt-2 text-xs text-neutral-400">
                Estimated {durationRange(repeat.exercises).join("–")} minutes.{" "}
                {!draft.withoutDeadline &&
                durationRange(repeat.exercises)[1] >
                  (deadlines(draft.schedule).stop - now) / 60000
                  ? "This may exceed your available time. Adapt it or explicitly keep it."
                  : "Review the preset below to adapt it."}
              </p>
            </div>
          ) : null}
          <RoutineLibrary
            routines={snapshot.routines || []}
            busy={busy}
            run={store.run}
            available={
              draft.withoutDeadline
                ? undefined
                : (deadlines(draft.schedule).stop - now) / 60000
            }
            onChoose={(r) => {
              void choose(r);
            }}
          />
        </AppDialog>
      ) : null}
      {repeat && !draft && !active ? (
        <div
          role="status"
          className="fixed bottom-4 left-4 right-4 z-30 mx-auto flex max-w-lg items-center justify-between gap-3 rounded-2xl border border-lime-200/30 bg-[#192014] p-4 text-sm"
        >
          <p>{repeat.name} selected. Set your time window above.</p>
          <button
            aria-label="Clear selected routine"
            className="min-h-11 min-w-11"
            onClick={() => setRepeat(null)}
          >
            ✕
          </button>
        </div>
      ) : null}
      {finish && active ? (
        <AppDialog
          title="Finish and keep your work"
          onClose={() => setFinish(false)}
        >
          <p className="text-sm text-neutral-300">
            {active.sets.length} completed sets will remain in your log.{" "}
            {active.withoutDeadline ? "" : "Departure reminders stay active."}
          </p>
          <label className="mt-4 flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={early}
              onChange={(e) => setEarly(e.target.checked)}
            />
            I’m ending earlier than planned
          </label>
          <label className="mt-3 block text-sm">
            Session notes
            <textarea
              maxLength={4000}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputStyle} mt-2 min-h-24 w-full rounded-xl border p-3`}
            />
          </label>
          <Button
            disabled={busy}
            className={`${buttonStyle} mt-5`}
            onClick={async () => {
              const id = active.id;
              if (
                await change(active.id, active.revision, (s) => ({
                  ...s,
                  notes,
                  endedEarly: early,
                  rest: undefined,
                  pausedMs:
                    (s.pausedMs || 0) +
                    (s.pausedAt ? Date.now() - s.pausedAt : 0),
                  pausedAt: undefined,
                  actual: { ...s.actual, workoutEndedAt: Date.now() },
                  status: s.withoutDeadline ? "completed" : "active",
                }))
              ) {
                setFinish(false);
                void emit(
                  early ? "short" : "complete",
                  `${id}:finish`,
                  ctx.current,
                );
                if (active.withoutDeadline) navigate("history");
              }
            }}
          >
            Save & finish workout
          </Button>
        </AppDialog>
      ) : null}
      {(close || discard) && active ? (
        <AppDialog
          title={discard ? "Discard this workout?" : "Close this session?"}
          onClose={() => {
            setClose(false);
            setDiscard(false);
          }}
        >
          <p className="text-sm leading-6 text-neutral-300">
            {discard
              ? "The session is marked discarded; recorded work remains recoverable in history and is excluded from progress."
              : "Your workout stays in history. This stops departure reminders and does not record an actual departure."}
          </p>
          <Button
            disabled={busy}
            className={`${buttonStyle} mt-5`}
            onClick={async () => {
              if (
                await change(active.id, active.revision, (s) => ({
                  ...s,
                  status: discard ? "cancelled" : "completed",
                  rest: undefined,
                  actual: {
                    ...s.actual,
                    workoutEndedAt: s.actual.workoutEndedAt || Date.now(),
                  },
                }))
              ) {
                setClose(false);
                setDiscard(false);
                navigate("history");
              }
            }}
          >
            {discard ? "Confirm discard" : "Close & keep workout"}
          </Button>
        </AppDialog>
      ) : null}
    </main>
  );
}
