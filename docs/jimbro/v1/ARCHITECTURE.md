# JimBro architecture decisions v1

Version 1.0 · October 20, 2026. Planning only; no modules, stores or UI below have been implemented. Requirements: [PRD](PRD.md). Scenarios: [acceptance](ACCEPTANCE.md).

## ADR-001 — One session across the product

**Status:** selected product direction; proposed data shape.

The application has one shared session owner above the logger, dock and history navigation. Views read the same session ID and submit commands to that owner. Avoid independent LeaveBy and GymLog roots with separate storage or timer state. Retain Next.js/React/TypeScript and the existing UI foundation; no framework replacement is needed for this plan.

| Proposed boundary | Responsibility |
| --- | --- |
| Session controller | Start/resume, edit schedule, record/correct sets, record actual actions, complete/cancel |
| Pure scheduling engine | Validate inputs, resolve timestamps, derive deadlines/phase/remaining time for an injected `now` |
| Persistence adapter | Load/save transactions, schema/version checks, single-active invariant, conflict and error reporting |
| Shared views | Schedule form, logger, countdown dock, preparation/departure view, history and body-weight view |
| Alert coordinator | Observe phase changes, claim/deduplicate foreground alerts and present a visible fallback |

Existing `lib/plan-input.ts` is the calculation/validation starting point, not already a persistent engine. Existing form/result state is local to `components/plan-form.tsx`; extracting a shared owner is future work. Keep scheduling logic independent of React and storage so deterministic tests can supply `now`.

### Proposed records

| Record | Important fields / invariant |
| --- | --- |
| WorkoutSession | Stable ID, schema version, revision, created/started/updated times, captured local workout date/timezone, optional day label, lifecycle (`draft`, `active`, `completed`, `cancelled`), schedule, set entries and actual-action timestamps |
| Schedule | Original local input, timezone ID, resolved offset, commitment epoch ms, preparation/commute/buffer minutes, schedule revision; stop/departure/arrival derived from these values |
| CompletedSet | Stable ID, exercise ID and name snapshot, reps, lifted load and unit, completedAt epoch ms; save/correction belongs to its session |
| ActualAction | Optional workoutEndedAt, preparationCompletedAt, departedAt, arrivedAt; user actions only, never inferred from a deadline |
| Exercise | Stable ID, name, categories, source/attribution; catalog edits cannot rewrite historical set names |
| BodyWeightEntry | Stable ID, measured local date, recordedAt epoch ms, positive value and unit; optional session link |
| ActiveSessionPointer | Singleton key `active` referencing at most one active session |
| AlertReceipt | Session ID, schedule revision, milestone, delivery/acknowledgment status and timestamp |

Lifecycle and scheduling phase are different: a session can remain active while its workout stop is overdue. Completing exercise does not complete the transition. Cancellation retains recorded sets and explicitly labels the session cancelled. History derives completed-workout counts from recorded work and workout completion, not the number of schedule starts. A completed session may later be corrected explicitly, without reactivating its alerts.

## ADR-002 — Absolute timestamps drive the schedule

**Status:** selected.

Use `C → A → D → S` as defined in the PRD. Deadline values are epoch milliseconds; `remaining = max(0, deadline − now)`. Keep the signed difference available for overdue wording. A rendering interval does not decrement or persist seconds. Recompute on session load, visibility/focus return, plan edit and each visible refresh.

| Time at observation | Derived phase | Foreground guidance / next deadline |
| --- | --- | --- |
| `now < S` | Workout | Stop at `S`; if user finished exercise early, show preparation guidance while retaining the same plan |
| `S ≤ now < D` | Preparation | Stop exercising / get ready; countdown to `D` |
| `D ≤ now < A` | Departure due until confirmed, then travel | Leave now or show travel after actual departure confirmation; next planned target `A` |
| `A ≤ now < C` | Arrival target reached | Ask for actual arrival if unconfirmed; retain deadline/overdue context and next `C` |
| `C ≤ now` | Commitment due / overdue | Show the commitment deadline and unresolved actual actions; do not infer arrival or complete the session |

At equal deadlines, evaluate the latest applicable boundary first so zero durations produce one urgent state. On resume across several boundaries, derive the present phase directly; do not walk through stale phases with a sequence of alarms. Actual departure before `D` changes the guidance but leaves the fixed schedule intact. Actual arrival confirmation may allow explicit transition completion; the clock alone cannot do it.

Resolve a local commitment with its timezone and explicit offset when ambiguous. The original validator rejects nonexistent local times but does not resolve fall-back ambiguity; that needs a later implementation decision, potentially a dependency subject to separate authorization. Arithmetic after resolution uses elapsed milliseconds. Keep saved timestamps fixed across timezone changes; label the plan timezone when it differs from the device. Detect a device timezone change while editing and request reconfirmation before replacing the saved plan. The device wall clock remains authoritative; no trusted server clock is introduced.

A valid edit atomically replaces schedule values, increments both session and schedule revision and preserves the session ID, sets and actual timestamps. Reevaluate immediately, including when the new stop is already past. No pause control is proposed for a fixed commitment.

## ADR-003 — IndexedDB behind an adapter

**Status:** proposed implementation; persistent local session is the selected requirement.

Use IndexedDB in a future browser client adapter, keeping React/server rendering free of browser-storage calls until client hydration. Proposed database `jimbro`, schema version 1: `sessions`, `meta` (including active pointer and alert receipts), `exercises`, and `bodyWeight`. Index sessions by workout date/lifecycle and measurements by date. Keep each session's set entries in that session record initially; normalized set stores can be reconsidered if actual data volume requires them.

Create the session and claim the singleton active pointer in one read-write transaction. A second start reads and resumes the active record rather than overwriting it. Complete/cancel and clear the matching pointer in one transaction. Save sets and schedule edits against the expected session revision; reject stale writes instead of silently discarding another tab's changes. Stable command/set IDs make retries idempotent.

Tabs share one database: read-write transactions serialize changes to the active pointer and expected revision. A lightweight cross-tab notification may request a reload, but correctness must not rely on it. Alert receipts are also claimed transactionally so two tabs do not ring for the same deadline.

Only mark a save successful after the transaction completes. Keep unsaved input in memory on failure; show a retry action and warn that reload may lose that draft. If IndexedDB is unavailable, blocked, over quota or unreadable, do not silently fall back to session-only storage while claiming persistence. Keep existing data untouched on an unsupported schema, failed migration or corrupt record and offer a clear recovery state. Handle blocked upgrades/version changes by asking other tabs to close; do not delete/recreate the database automatically.

Restore the active session before showing the new-session action; show loading/error states rather than briefly offering a second start. Persist raw plan inputs and commitment resolution; recompute deadlines on load. Validate stored shape/version and finite numbers. Future migrations must be incremental and transactional. Local browser storage can be cleared or evicted; no account/cloud backup is provided. There is no implemented GymLog store to migrate in this baseline, and separate origins cannot be read as if they shared one database.

Alternatives considered: React-only memory cannot meet reload recovery; localStorage is a poor fit for transactional multi-record writes and schema evolution; a cloud database introduces accounts/network dependencies outside the selected scope. Choosing IndexedDB does not add a wrapper dependency in this milestone.

## ADR-004 — Docked countdown and foreground alerts

**Status:** selected behavior; delivery details proposed.

The shared dock stays visible in logging/history/progress views and links to the expanded schedule. Label which deadline it represents. Reserve space so it does not cover inputs, save actions, keyboard focus or mobile safe areas. Keep it readable at narrow widths; allow reviewing full dates and estimates. Countdown seconds update visually without repeated live-region announcements.

Foreground visual/text messages are required. Optional audio needs a user gesture and a visible failure/mute state. No Notification permission, background push, service worker alarm or closed-app guarantee is part of this design. A hidden or suspended page may not execute; returning to it recomputes the phase and shows one current summary.

Use an alert key `(sessionId, scheduleRevision, milestone)`. Claim delivery via a transaction before presenting one foreground alert; store acknowledgment separately from actual stopping/departure. This favors avoiding duplicate alarms; a crash between claiming and displaying can lose a sound. Required current-phase text remains visible on reload, so recovery does not depend on replaying sound. Valid schedule changes create a new revision and one updated current-phase message; unchanged re-renders do not retrigger it. Completing the session disables its future alerts. Finishing the workout alone does not.

## ADR-005 — Preserve coursework and isolate future implementation

**Status:** selected for Milestone 1.

Keep the original LeaveBy PRD, source, tests, assets, research and templates in place. Add versioned JimBro planning here and update only branch instructions/progress. The baseline manifest makes accidental changes visible. No copied GymLog source, simulated participant feedback or rewrite of historical verification is needed to document a future product direction.

Future implementation should proceed through the pure schedule/session contract, persistence/recovery, unified entry/logger/dock and phase guidance, then supporting history/catalog/body-weight views, with each slice checked against the acceptance plan. This ordering is a proposal, not permission to begin another milestone. Browser persistence, cross-tab recovery, accessibility and foreground alert tests are still required; the old calculation tests cannot establish those behaviors.
