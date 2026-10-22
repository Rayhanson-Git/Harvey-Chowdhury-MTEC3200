# JimBro — time well lifted

[Open JimBro](https://jimbro.rayhanson.tech) · [Animation gallery](https://jimbro.rayhanson.tech/jim-gallery) · [Current release record](docs/jimbro/WEB-RELEASE.md)

Plan your available training time, choose or edit a routine, log completed work, review your progress and protect your departure time. This local-first web release combines LeaveBy with the GymLog logging concept. It includes seven editable starters, custom routines, independent rest/elapsed timers, interruption recovery, calendar/history editing and repeat, comparable progress charts, JSON import/export, and original animated Jim with 248 contextual local phrases.

## What each tab does

**Today** is the planning view: enter the next commitment, preparation, travel and buffer, then choose a routine. **Workout** is the active training view: log/correct completed sets, manage rest and finish the session. Starting from Today opens Workout automatically. Both views share one session and its deadlines; switching tabs never pauses departure time. History holds saved sessions; Progress compares recorded training; Settings controls appearance, Jim, alerts and backups.

In **Settings → Appearance → Color theme**, choose **Light**, **Dark** or **System preference**. System follows the device and updates while JimBro is open. The choice is saved in this browser and included in JSON backups. Original LeaveBy keeps its existing system-based appearance.

## Run and verify

Node 24 recommended. `npm ci`, then `npm run dev`. No API key, account, paid service or backend is required.

```sh
npm test
npm run test:jimbro
npm run test:web
npm run lint
npm run build
npx tsc --noEmit
```

Brand sources and integrated variants: [asset inventory](docs/jimbro/BRAND-ASSETS.md). Regenerate with `npm run build:brand`. Browser acceptance and animation sampling use `npm run test:browser` / `npm run test:mascot` with Playwright and axe installed in an isolated QA directory; see the verification record for exact commands and current results.

Read [architecture/data and migration](docs/jimbro/WEB-ARCHITECTURE.md), [design system](docs/jimbro/DESIGN-SYSTEM.md), [Jim source/provenance](docs/jimbro/JIM-ART.md), [phrase content](docs/jimbro/PHRASES.md), [actual verification](docs/jimbro/WEB-VERIFICATION.md), [handoff](docs/jimbro/HANDOFF.md), [peer-test script](docs/jimbro/PEER-TEST.md) and [future native evaluation](docs/jimbro/NATIVE-READINESS.md).

The final released source is `a6d646e`. [Actual preview/production verification](https://github.com/Rayhanson-Git/Harvey-Chowdhury-MTEC3200/actions/runs/39656940318) passed all release gates; the release-specific GitHub workflow provides a fail-fast remote runner without application dependencies or credentials in the app. Browser emulation does not establish physical-device, screen-reader or human peer usability. Current evidence and local-host resumption details are in the linked records.

## Data and timing limits

Data lives on this device/browser and origin. Clearing site data can remove it. Export JSON from Settings for your own backup; another device will not synchronize automatically. v1 IndexedDB records migrate in place to v2; no cross-origin GymLog migration is claimed. Keep the app visible for alerts. Background, lock-screen and closed-app delivery, offline launch and a trusted server clock are not guaranteed. Sound and notifications require understandable user actions. A deadline never marks a workout completed or records departure.

Routes: `/` and `/today`, `/workout`, `/history` (session detail via `?session=ID`), `/progress`, `/settings`, `/jim-gallery`; original planner preserved at `/leaveby`. Native apps, accounts/sync, payments, nutrition, social features, wearable integration and runtime AI remain deferred.

The documents below preserve the historical course submission; their older release/verification claims describe that baseline rather than the current web release.

# LeaveBy — original coursework
MTEC 3200 · Product Design & Prototyping · Fall 2026
Harvey Chowdhury · Instructor: Dora Do

LeaveBy works backward from a fixed class or work commitment to show when to stop a workout and leave. One plan combines preparation, commute and buffer estimates.

[Open LeaveBy](https://leaveby.rayhanson.tech) · [Submission checklist](docs/submission-checklist.md) · [Presentation](Presentation/README.md)

## Project materials

| Area | Materials |
| --- | --- |
| Research | [Research index](research/README.md), [method](research/research_plan.md), [routine observations](research/routine_audit.md), [interview questions](research/interview_questions.md), [three interview records](interviews/) |
| Synthesis | [Affinity map](research/affinity_map.md), [insights](research/insight_statements.md), [persona](research/persona.md), [POV and HMW](research/point_of_view.md), [original synthesis](research/synthesis.md) |
| Design | [User flow and original wireframes](Design/README.md), [editable Figma wireframes](https://www.figma.com/design/o5HfqhQTqwBFK8nFTEWvx2), [design rationale](Design/rationale.md) |
| Specification | [PRD](PRD.md), [MVP scope](Specs/MVP.md) |
| Process | [Prompting log](docs/prompting-log.md), [build history](docs/build-log.md), [project evaluation](docs/reflection.md) |
| Testing | [Current verification](docs/verification.md), [manual checklist](docs/manual-check.md), [peer feedback sheet](docs/peer-feedback.md) |
| Presentation | [PPTX and PDF](Presentation/README.md), [code-defense guide](Presentation/code-defense.md) |

## Run and verify

Use Node.js 20.9 or newer. From the repository root:

```bash
npm ci
npm run dev
```

Open http://localhost:3000 or the forwarded port in Codespaces.

```bash
npm test
npm run lint
npm run build
```

The app uses Next.js, React, TypeScript, Tailwind CSS and shadcn/ui. No API key or database is required.

## Behavior and limits

Enter a future commitment and nonnegative whole-minute durations. Arrival equals commitment minus buffer. Departure subtracts commute, then workout stop subtracts preparation. Edit plan preserves the five inputs.

The plan stays in memory until reload. There are no accounts, live transit predictions, notifications or saved routines. The interface uses device-local time.

## Current status

The core app is deployed with HTTPS. Automated acceptance tests, lint and production build pass. Hosted browser results and their limits are recorded in the verification document. Research and presentation materials are linked above. Separate research artifacts organized after the build retain their actual documentation dates.

Peer feedback is pending. Presentation delivery and demonstrated code understanding remain student activities. The submission checklist records course-specific qualifications.

## Repository organization

Application code lives in app/, components/ and lib/. Course materials live in research/, interviews/, Design/, Specs/ and Presentation/. Instructor templates remain in templates/. Read AGENTS.md and PRD.md before feature changes.

This personal course repository can continue to hold LeaveBy. Project 2 is a separate pair assignment with shared-repository requirements; it has not been implemented here.
