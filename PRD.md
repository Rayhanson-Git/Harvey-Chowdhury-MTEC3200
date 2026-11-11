# JimBro — Product Requirements Document

**Active specification · November 10, 2026 · `revamp/foundation`**

JimBro is a browser-based, mobile-first gym companion combining workout scheduling, completed-set tracking, and departure guidance into one session. This document describes the **current product direction and implemented scope**. The [v1 planning requirements](docs/jimbro/v1/PRD.md) are a dated design record; [implementation evidence](docs/jimbro/IMPLEMENTATION.md) and the [October 21 release record](docs/jimbro/RELEASE.md) distinguish completed work from proposed features.

## The problem

People who exercise before a fixed class or work commitment need to make progress without losing the time reserved for showering, travel, and arrival. A separate workout logger and timer fragment the experience. JimBro joins both needs while keeping planned deadlines distinct from what the user actually did.

The early user research in [research/](research/) and [interviews/](interviews/) investigated the scheduling problem. It does **not** establish that every expanded JimBro feature is validated by new interviews or that the product reduces lateness. Human usability evaluation is still needed.

## Primary experience

1. **Create a plan:** enter a future commitment date/time and nonnegative whole-minute preparation, commute, and buffer estimates; choose an optional workout label.
2. **Start a workout:** save one active session with a durable ID, local schedule and timestamp.
3. **Log completed sets:** select an exercise, record reps, load and unit after each set, and amend or remove mistakes.
4. **Stay time-aware:** a docked countdown and phase guidance remain visible throughout navigation; plan edits update deadlines without replacing completed sets.
5. **Act on transitions:** foreground cues indicate workout stop, preparation and departure. The user separately confirms actual actions.
6. **Review activity:** completed workouts and dated body-weight entries remain in local browser history.

## Required capabilities

| ID | Requirement | Implementation status as of October 21, 2026 |
| --- | --- | --- |
| JB-01 | Exactly one persistent active session; distinguish active, completed and cancelled states | Implemented |
| JB-02 | Validate dates/durations; retain form input on errors; support explicit zero and cross-midnight plans | Implemented |
| JB-03 | Derive absolute arrival, departure and workout-stop timestamps, including timezone and DST behavior | Implemented |
| JB-04 | Show a docked countdown without obscuring the workout logger or navigation | Implemented |
| JB-05 | Record completed sets with exercise, reps, weight, unit and timestamp; permit corrections/removal | Implemented |
| JB-06 | Use native IndexedDB to recover the active session and history; handle storage failures visibly | Implemented |
| JB-07 | Separate automatic schedule phases from user-confirmed workout/transition actions | Implemented |
| JB-08 | Provide foreground visual alerts and optional user-enabled audio, without claiming background delivery | Implemented |
| JB-09 | Present workout history with date, activity label and completed-set details | Implemented |
| JB-10 | Provide a searchable categorized starter exercise library with stable exercise IDs | Implemented |
| JB-11 | Support dated body-weight records with explicit kg/lb units | Implemented |
| JB-12 | Support narrow-screen layouts, keyboard focus and meaningful text cues | Automated checks passed; human accessibility evaluation still outstanding |

These status statements describe the dated verified release, not a fresh November build. See [acceptance criteria](docs/jimbro/v1/ACCEPTANCE.md) and [release QA](docs/jimbro/RELEASE.md).

## Scheduling contract

For commitment timestamp `C`, buffer `B`, commute `T`, and preparation `P` measured in minutes:

```text
arrival       = C - B * 60_000
departure     = arrival - T * 60_000
workout_stop  = departure - P * 60_000
```

Deduct buffer only once. Keep absolute timestamps, original local date/time and the resolved timezone. A past workout-stop time for a still-future commitment must generate an actionable warning, not silently move the time forward. Invalid plan edits cannot replace the last valid saved plan.

## Data and technical decisions

- **Application:** Next.js App Router, React, TypeScript, Tailwind CSS and shadcn/ui.
- **Persistence:** browser-local IndexedDB with one active session and durable historical records; save failures and conflicts are visible.
- **Exercise data:** a documented 24-item starter catalog; no claim of importing an unavailable GymLog codebase or migrating its historical data.
- **Time:** absolute deadline differences against the current device clock, not a decremented stored timer.
- **Privacy:** no account or hosted app database; local storage is not a backup and can be cleared.
- **Availability:** foreground/browser app only; no guarantee of sound or alerts while suspended or closed.

## Outside current scope

No accounts, cross-device cloud synchronization, background push or lock-screen guarantees, service-worker offline installation guarantee, data import/export, live transit predictions, calendar integration, nutrition guidance, AI coaching or social features. Do not claim these features are implemented without a separately specified and verified upgrade.

## Verification and remaining work

The October 21 release passed the documented calculation, core, browser, native storage and build checks. New revisions must re-run relevant checks and record their actual results; historical passes must not be relabeled as current. Human device, accessibility and peer usability testing remains outstanding. Improvements should be grounded in user observations rather than inferred course requirements.

## Historical course context

The original Project 1 time-planning PRD is preserved at [docs/archive/LeaveBy-PRD.md](docs/archive/LeaveBy-PRD.md), with its independent course research, designs and submission documents intact. That historical specification is **not** the active JimBro scope. The MTEC 3200 instructor's requirements have not been reinterpreted as approval of expanded product functionality.
