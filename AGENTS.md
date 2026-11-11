<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# JimBro — current contributor instructions

**Target:** `release/jimbro-web`, the source branch for the newer JimBro web product. The shared repository's `main` remains the MTEC 3200 course baseline; `revamp/foundation` is an **earlier** JimBro implementation, not the source to copy over this branch.

## Sources of truth

- [Active PRD](PRD.md) and [project README](README.md).
- [Architecture and v2 data contract](docs/jimbro/WEB-ARCHITECTURE.md), [design system](docs/jimbro/DESIGN-SYSTEM.md), [brand sources](docs/jimbro/BRAND-ASSETS.md).
- [Implementation handoff](docs/jimbro/HANDOFF.md), [web release record](docs/jimbro/WEB-RELEASE.md), [web verification](docs/jimbro/WEB-VERIFICATION.md) and [theme verification](docs/jimbro/THEME-VERIFICATION.md).
- [Current progress](PROGRESS.md). Historical `docs/jimbro/v1/` plans and `docs/archive/` explain prior decisions; their old "current" statements are not active instructions.

## Preserve existing products and data

- Never overwrite, merge into, or force-push `main` without explicit authorization.
- Do not replace the modern `release/jimbro-web` runtime with the outdated `revamp/foundation` implementation.
- Leave the original course evidence intact and preserve `/leaveby` as an archival route (but it does not need promotion inside JimBro's navigation).
- **Keep IndexedDB v2 compatible.** Never downgrade to v1, reset real data to resolve errors, change IDs silently or treat a failed import as success. Preserve backup/import semantics and all user history.
- Do not invent peer testing, user results or device tests. Keep release evidence tied to the source commit actually checked.
- Do not commit credentials, `.env` files, authentication state or sensitive QA data.

## Product and code

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, shadcn/ui, native IndexedDB. No workout backend or runtime AI.

Code locations: `app/` route pages, `components/jimbro/` interface/state/mascot, `lib/jimbro/` timing/persistence/routines/progress/personality, `scripts/` brand assets, `tests/` QA and regression. Maintain the existing theme system, JSON backup, routine/measure semantics, real time-based countdown and motion/sound controls. Prefer small, verifiable changes and update documentation with behavior changes.

## Verification

```sh
npm ci
npm test
npm run test:jimbro
npm run test:web
npm run lint
npm run build
npx tsc --noEmit
```

Follow `docs/jimbro/WEB-VERIFICATION.md` and `docs/jimbro/THEME-VERIFICATION.md` for browser, theme, mascot and accessibility checks with isolated QA dependencies. Browser screenshots and scans are not substitutes for real-device and human evaluation.

## Deploying

Production site: `https://jimbro.rayhanson.tech`, Vercel project `jimbro`. Confirm the exact Git SHA and project before deploying; a preview build does not prove production has changed. Avoid modifying the legacy deployment or other domains. Run tests for the current commit, inspect build evidence, and document what was actually deployed. Changes to documentation do not authorize unrelated infrastructure actions.

## History

- [Legacy course PRD](docs/archive/LeaveBy-PRD.md)
- [Pre-brand-refresh progress](docs/archive/PROGRESS-2026-10-27.md)
- [Earlier project instructions](docs/archive/AGENTS-2026-10-27.md)
- [First JimBro planning milestone](docs/jimbro/v1/README.md)

Update `PROGRESS.md` with honest status after substantial changes.
