# JimBro — Time well lifted

**Plan smarter. Train better. Make time for the rest of your day.**

[**Open JimBro**](https://jimbro.rayhanson.tech) · [App gallery](https://jimbro.rayhanson.tech/jim-gallery) · [Product specification](PRD.md) · [Release verification](docs/jimbro/WEB-RELEASE.md) · [Project reflection](docs/jimbro/reflection.md)

JimBro is a local-first, responsive workout companion. It keeps **planning, active training, workout history, progress, and departure guidance in one connected experience**—whether you have a fixed commitment afterward or want an open-ended workout.

**Canonical JimBro source branch: `release/jimbro-web`.** Its live Vercel project is `jimbro`. The GitHub repository is shared with the MTEC 3200 course submission on `main`; this is a separate product **branch and deployment**, not an independently named GitHub repository.

## The five main views

| View | What it does |
| --- | --- |
| **Today** | Plan a scheduled or open workout, estimate available time, choose or adjust a routine |
| **Workout** | Follow the active session, record and correct sets, and use independent rest/elapsed timers |
| **History** | Browse calendar sessions, edit past entries, and reuse completed work |
| **Progress** | Compare compatible training measures and view body-weight history with readable charts |
| **Settings** | Choose Light/Dark/System theme, adjust Jim and alerts, and export/import JSON backups |

Today and Workout deliberately serve different stages of **the same workout**: Today plans; Workout tracks completed work. Changing views never resets the stored deadline or the current session.

## What is implemented

- **Smart time planning:** commitment date/time, preparation, travel and buffer; calculated cutoff, departure and target arrival. Open-ended workouts work without a deadline.
- **Workout routines:** seven editable starter routines plus custom routines, with editable exercise order and planned sets.
- **Training log:** record actual completed sets, loads and measurements, correct mistakes, and review prior comparable performance.
- **History and progress:** calendar entries, session detail and repeat, comparable progress views, body-weight tracking and measurement-specific charts.
- **Jim the mascot:** an original animated character with selectable tone, motion preferences and a curated local phrase library.
- **Local-first data:** transactional IndexedDB v2, cross-tab recovery, versioned JSON backup export/import and supported migration from earlier v1 browser data.
- **Appearance:** Light, Dark or System preference; the choice persists in browser records and backup files. UI surfaces, charts and branding adapt.

The app has no runtime AI, no user account and no paid backend.

## Running and checking the project

Node.js 24 is recommended. From the repository root:

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`.

```sh
npm test
npm run test:jimbro
npm run test:web
npm run lint
npm run build
npx tsc --noEmit
```

Browser, mascot, and theme acceptance suites use isolated Playwright/axe QA dependencies, not application dependencies. See [verification instructions](docs/jimbro/WEB-VERIFICATION.md) and [theme evidence](docs/jimbro/THEME-VERIFICATION.md) before claiming browser checks passed.

## Architecture, documentation and assets

| Source | Purpose |
| --- | --- |
| [`PRD.md`](PRD.md) | Current JimBro scope and acceptance boundaries |
| [`docs/jimbro/`](docs/jimbro/README.md) | Current documentation index |
| [`docs/jimbro/WEB-ARCHITECTURE.md`](docs/jimbro/WEB-ARCHITECTURE.md) | Storage v2, migration, timing and progress rules |
| [`docs/jimbro/DESIGN-SYSTEM.md`](docs/jimbro/DESIGN-SYSTEM.md) | UI and responsive guidance |
| [`docs/jimbro/BRAND-ASSETS.md`](docs/jimbro/BRAND-ASSETS.md) | Original JimBro visual identity and asset generation |
| [`docs/jimbro/PHRASES.md`](docs/jimbro/PHRASES.md) | Local mascot phrase guidelines |
| [`docs/jimbro/WEB-RELEASE.md`](docs/jimbro/WEB-RELEASE.md) | Dated production evidence |
| [`docs/jimbro/HANDOFF.md`](docs/jimbro/HANDOFF.md) | Implementation history and operational cautions |
| [`docs/jimbro/NATIVE-READINESS.md`](docs/jimbro/NATIVE-READINESS.md) | Future native-app evaluation only |
| [`PROGRESS.md`](PROGRESS.md) | Current branch tracking |

App routes: `/`, `/today`, `/workout`, `/history` (detail with `?session=ID`), `/progress`, `/settings`, and `/jim-gallery`.

## Storage and notification limits

Data lives in the current site origin and browser profile. **Use Settings → Export** to keep an offline JSON backup; clearing browser storage can delete records. There is no automatic cross-device sync. Foreground alerts and enabled sounds are best effort; background, locked-screen and closed-app reminders are **not guaranteed**. Offline launch, a trusted server clock, live transit predictions and native notifications are not guaranteed. Recording a deadline does not prove a workout ended or a user departed.

Accounts, subscriptions, live AI coaching, nutrition, social features, device synchronization, wearables and native apps remain outside the shipped web scope.

## Verification status

The **October 26, 2026** hosted appearance release is the last documented production verification in this branch: eight original calculation tests, 18 core tests, 23 web domain tests, lint, build and type checks, plus seven theme and 20 workout browser journeys on both preview and production. Automated accessibility scans reported zero violations in those runs, with explicit manual-review limitations. These are **dated results**, not a claim of new test passes or a new deployment after subsequent commits. See [theme verification](docs/jimbro/THEME-VERIFICATION.md).

Real-device, screen-reader, audible-alert, suspended-browser and human peer usability testing remains outstanding.

## Project lineage

JimBro evolved from the course's narrower workout-to-commitment time-planning prototype. Historical Project 1 evidence is deliberately retained for attribution and audit, including the [archived PRD](docs/archive/LeaveBy-PRD.md), [research](research/README.md), [course submission checklist](docs/submission-checklist.md) and the unchanged legacy route `/leaveby`. **Those materials describe the earlier assignment, not the current JimBro product.**

MTEC 3200 · Product Design & Prototyping · Fall 2026.
