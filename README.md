# JimBro — workout planning & tracking

**Train with a plan. Log every set. Leave on time.**

[Launch JimBro](https://jimbro-rayhanson.vercel.app) · [Product requirements](PRD.md) · [Documentation](docs/jimbro/README.md) · [Release & verification](docs/jimbro/RELEASE.md)

JimBro is a mobile-first workout companion that combines a time-aware workout schedule with a completed-set logger, workout history, and body-weight records. Instead of switching between a gym log and a separate departure timer, one active session keeps training and the next commitment connected.

This is the **JimBro project branch** (`revamp/foundation`). The shared repository's `main` branch remains the original MTEC 3200 Project 1 submission. JimBro is a separate product and Vercel deployment, but **not a separate GitHub repository**.

## What JimBro does

1. **Plan your session.** Enter the date and time of your next commitment, plus preparation, commute, and buffer estimates. JimBro calculates when to stop exercising, leave, and arrive.
2. **Train and log.** Start one active workout, choose from a categorized 24-exercise starter library, and record sets after completing them. Correct or remove mistaken entries.
3. **Keep time in view.** A docked countdown stays available while you navigate the workout, plan, history, and body-weight sections.
4. **Follow the transition.** Visual phase guidance and optional user-enabled sound explain when to finish working out, prepare, and depart. Actual actions are confirmed separately.
5. **Pick up where you left off.** IndexedDB stores the active session, history, and body-weight entries in the current browser profile.

## Capabilities and boundaries

| Available | Not included |
| --- | --- |
| Persistent browser-local workout sessions and logs | Accounts, cloud sync, and cross-device backup |
| Editable schedule, countdown, and phase guidance | Guaranteed closed-app or background push alerts |
| Completed-set logging, corrections, and history | Workout programming, nutrition, or AI coaching |
| Body-weight entries with explicit kg/lb units | Import/export and automatic migration from other apps |
| Responsive interface and keyboard-focused states | Real-time transit estimates or calendar sync |

**Data note:** Browser storage is local to the current site and profile. Clearing site data can delete records. The app does not currently provide a backup/export feature. For reliable time cues, keep the app open and visible.

## Run locally

Use Node.js 22.18+ for the JimBro supplemental tests (the Next.js app itself specifies Node.js 20.9+).

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

```bash
npm test                 # original schedule-calculation regression tests
npm run test:jimbro      # JimBro core unit tests
npm run lint
npm run build
```

The stack is Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, and native IndexedDB. No external API keys or hosted database are required. Browser QA uses separate optional tooling documented in [implementation and verification](docs/jimbro/IMPLEMENTATION.md).

## Repository guide

| Location | Purpose |
| --- | --- |
| [`PRD.md`](PRD.md) | **Current JimBro product specification** |
| [`app/`](app/) | JimBro home page and preserved original-route view |
| [`components/jimbro/`](components/jimbro/) | Current workout interface and state management |
| [`lib/jimbro/`](lib/jimbro/) | Session, scheduling, exercise catalog and IndexedDB code |
| [`tests/`](tests/) | Core, regression and browser-verification code |
| [`docs/jimbro/`](docs/jimbro/) | Architecture, implementation, release and QA history |
| [`docs/archive/`](docs/archive/) | Original Project 1 PRD and earlier progress record |
| [`research/`](research/), [`interviews/`](interviews/), [`Design/`](Design/), [`Presentation/`](Presentation/) | Original course research and presentation evidence, kept intact |

## Releases and verification

The [October 21, 2026 production release](docs/jimbro/RELEASE.md) recorded 8 original calculation tests, 18 JimBro core tests and 27 browser assertions passing, with 18 native storage checks nested inside the browser suite. It also recorded passing lint, TypeScript and build checks. **These are dated results for that release, not a claim that subsequent changes have been freshly tested or deployed.** Physical-device, screen-reader, audible-output and peer usability evaluation remain separate outstanding checks.

JimBro's deployed URL is [jimbro-rayhanson.vercel.app](https://jimbro-rayhanson.vercel.app). GitHub updates to this branch are not by themselves proof of a new production deployment.

## Course lineage

JimBro grew out of the course's narrower time-planning exercise. The original Project 1 artifacts remain available for research integrity and comparison, including the [historical PRD](docs/archive/LeaveBy-PRD.md), [submission checklist](docs/submission-checklist.md) and legacy application route `/leaveby`. Those archival materials document the earlier prototype; they are **not** the JimBro specification.

MTEC 3200 · Product Design & Prototyping · Fall 2026.
