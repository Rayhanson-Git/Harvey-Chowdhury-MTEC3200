<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Instructions

Read this file before every task.

## Current authorization — JimBro completion and release

The user explicitly authorized: “Complete it, finish it, commit it to git hub and deploy.” Finish and verify the JimBro v1 implementation, fix discovered issues, commit and push on `revamp/foundation`, and deploy JimBro. Preserve main, the original coursework and all existing work. Restoring locked dependencies and temporary verification tooling is authorized as necessary; do not add application dependencies without need. The Milestone 1 restrictions below are historical and do not block this explicit expansion. Keep the seven v1 foundation records intact; record current implementation, actual checks and deployment evidence separately. Continue through verification and release without stopping after each screen. Accounts, cloud sync and background push remain deferred.

## JimBro branch scope — completed Milestone 1

- Work on `revamp/foundation`. Preserve `main` and the original coursework.
- Verified starting commit: `4af9f2bc004bb1a0f1d8649991bf41cea649e90c`.
- Read this file and the entire root `PRD.md` before work. Root `PRD.md` remains the original LeaveBy specification; do not rewrite it as JimBro.
- JimBro planning lives in [`docs/jimbro/v1/`](docs/jimbro/v1/README.md). Read its PRD, architecture decisions and acceptance checklist before future JimBro work. These documents describe a target, not implemented behavior.
- Milestone 1 allows inventory, preservation, requirements, architecture, acceptance criteria, branch instructions, progress updates and existing verification only. Do not implement features, install dependencies (including shadcn/ui), commit, push or deploy in this milestone. This restriction overrides broader workflow suggestions below and in the original PRD.
- Keep research, interviews, designs, instructor templates, presentation assets, attribution and historical verification intact. Use the baseline manifest to verify preservation. Only `AGENTS.md` and `PROGRESS.md` are approved updates to existing tracked files in this milestone.
- At the Milestone 1 baseline, data remained one in-memory LeaveBy plan. Persistent sessions, IndexedDB, a docked countdown and foreground alerts are target decisions in the frozen v1 plan. Existing uncommitted implementation is recorded separately; it has not shipped.
- Inspect staged, unstaged and untracked changes before edits; preserve existing work. Record actual command results and blockers separately from historical passes in `PROGRESS.md` and the versioned verification record.

## About This Project

JimBro combines LeaveBy scheduling and logging after completed sets. `/` is JimBro; `/leaveby` preserves the original planner. Read `docs/jimbro/v1/PRD.md` for the target and `docs/jimbro/IMPLEMENTATION.md` for actual implementation/verification. Root `PRD.md` remains the historical LeaveBy course specification.

## Stack

- Next.js (App Router), React
- Tailwind CSS
- shadcn/ui (new-york, neutral; manually configured)
- Data: JimBro uses native IndexedDB for one active session and local history. The original LeaveBy route retains its in-memory behavior.
- APIs: none

## Commands

- Run: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Existing acceptance tests: `npm test`
- JimBro core runtime tests: `npm run test:jimbro` (Node 22.18+)
- Native browser storage fixture: `node tests/serve-storage.mjs` on isolated `http://127.0.0.1:4876`

## Code Style

- Use TypeScript.
- One component per file.
- Put reusable components in `components/`.
- Use Tailwind classes. No separate CSS files. Prefer Tailwind's spacing utilities over arbitrary pixel values for spacing and sizing; reserve arbitrary values for custom typography or layout geometry that has no suitable utility.
- Use clear, descriptive names.
- Put sections into their own component, so that code is easy to read from a top-level and put them inside `components/`.

## Rules

- Don't add dependencies without asking. Components from shadcn/ui are the exception.
- Use components from shadcn/ui before building new ones.
- Add shadcn/ui components as needed. List each one in `docs/components.md`.
- Build one screen at a time.
- Read `PRD.md` before adding any feature. Don't add features that aren't in it.
- Don't change working screens unless asked.
- Never commit `.env.local` or API keys.
- Update `PROGRESS.md` after each task.

## How to Talk to Me

- I am a student with limited coding knowledge. Explain things to me knowing my level.
- Keep explanations short.
- Tell me which files you touched.
- Stop after each task so I can test it manually.

## Project references and skills

- Read `Design/README.md` and `Design/LeaveBy_Wireframes.png` before screen work. Existing research stays in `research/`; design assets stay in `Design/`.
- Use `.github/skills/build-screen/SKILL.md` for a screen and `.github/skills/verify-plan/SKILL.md` for calculation and validation changes.
- Keep original instructor templates in `templates/` unchanged.
- Use local date/time and full dates for calculations, not time strings alone. Deduct buffer once. Show dates for previous-day results.
- Keep user-facing errors beside fields and preserve inputs. Use visible labels, keyboard focus, and text feedback.
- Explain changes and validation without claiming that Harvey manually tested or understood something unless he confirms it.
