# JimBro — current development branch

On `revamp/foundation`, `/` now contains JimBro: a shared workout session with scheduling, logging, a docked countdown, local IndexedDB storage, phase guidance, history and body-weight records. The original LeaveBy screen is preserved at `/leaveby`.

Read [implementation and actual verification](docs/jimbro/IMPLEMENTATION.md). The unified app is implemented and authorized for release from `revamp/foundation`. Existing tests (8), core tests (18), production browser checks (27) and native storage cases (18, nested in the browser suite) pass; lint, TypeScript and production build pass. Original coursework and main are preserved. Accounts, cloud sync and background push remain deferred.

The following LeaveBy documentation describes the original course baseline, including its historical verification. It does not report fresh JimBro build or browser results. Original specification and coursework remain intact.

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
