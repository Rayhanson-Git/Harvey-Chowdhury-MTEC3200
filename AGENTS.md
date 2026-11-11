<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# JimBro — contributor and agent instructions

This branch is the **JimBro application** on `revamp/foundation`. Do not confuse it with the shared repository's original MTEC 3200 `main` branch or the archived Project 1 documents.

## Read before changing code

1. [Active JimBro PRD](PRD.md) and [README](README.md).
2. [JimBro architecture](docs/jimbro/v1/ARCHITECTURE.md) and [acceptance plan](docs/jimbro/v1/ACCEPTANCE.md). Those v1 files describe their October 20 planning snapshot; compare against the [implemented product](docs/jimbro/IMPLEMENTATION.md).
3. [Release evidence](docs/jimbro/RELEASE.md) and [current progress](PROGRESS.md).
4. Relevant tests, code and prior decisions before making changes.

## Branch and preservation rules

- Work on `revamp/foundation` unless explicitly directed otherwise. Do not change, overwrite, merge, or force-push `main` as part of JimBro upgrades.
- JimBro lives at `/`; the original prototype remains at `/leaveby` for historical comparison and regression coverage. Preserve the old route and underlying calculation behavior unless specifically asked to change them.
- Original research, interviews, presentation files, designs, templates, and archived PRD are historical evidence, not current JimBro marketing or feature requirements. Don't alter their findings or invent new peer feedback.
- No automated process may claim manual device or user testing occurred without real evidence.
- Check for uncommitted changes and overlapping work before edits. Never commit credentials or `.env` files.

## Technology and implementation

- Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui; native browser IndexedDB.
- Current product: scheduled workout session, completed-set logging, countdown, phase guidance, exercise catalog, workout history and body-weight records.
- Prefer the existing `components/jimbro/` and `lib/jimbro/` modules. Use accessible labels, keyboard interactions, responsive layouts and clear error recovery.
- Treat planned deadlines and actual confirmations as separate data. Compute remaining time against absolute timestamps; never promise background notification delivery.
- Accounts, cloud sync, data import/export, background push and external API integration are not existing capabilities.
- Do not change dependencies or add features absent from the PRD without an explicit reason and matching specification update. Keep lockfile consistent with `package.json`.

## Test and release workflow

```bash
npm ci
npm test
npm run test:jimbro
npm run lint
npm run build
```

The JimBro core suite requires Node.js 22.18+ for native TypeScript stripping. Browser QA needs separate tooling; follow [verification instructions](docs/jimbro/IMPLEMENTATION.md) and distinguish it from the standard local commands.

Document *which checks actually ran*, their results, and blockers. Verify the selected Git branch and deployed commit before saying a release is live. Vercel's `jimbro` project is separate from the original project; a GitHub commit alone is not proof of deployment. Update `PROGRESS.md` after substantial changes.

## Historical records

- [Original Project 1 PRD](docs/archive/LeaveBy-PRD.md)
- [Pre-rebrand progress and release history](docs/archive/PROGRESS-2026-10-21.md)
- [Versioned JimBro planning snapshot](docs/jimbro/v1/README.md)

The archived material explains how JimBro evolved; it does not override the active specification.
