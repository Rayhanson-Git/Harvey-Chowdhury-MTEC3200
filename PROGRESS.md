# JimBro — active project tracker

**November 10, 2026 · Source branch `release/jimbro-web`**

## Current web product

The released JimBro application includes planning and open workouts, seven editable starter routines and custom routines, completed-set logging, rest/elapsed timers, editable history, comparable progress/body-weight charts, versioned JSON backups, Jim's original animation/phrases, and persistent Light/Dark/System appearance. Native IndexedDB v2 records and v1 migration remain supported.

**Production:** [jimbro.rayhanson.tech](https://jimbro.rayhanson.tech) · [Dated release record](docs/jimbro/WEB-RELEASE.md)

## November 10 — source documentation and branding update

- Centered the root README, active PRD, contributor instructions and progress on the **current JimBro product**.
- Preserved original coursework PRD and earlier progress/agent instructions in `docs/archive/`; repaired navigation links from legacy course records.
- Updated npm package identity consistently in `package.json` and `package-lock.json`, without dependency changes.
- Removed promotional legacy navigation from the JimBro interface but preserved the original `/leaveby` route and historical tests.
- Updated a stale scaffold comment and added legacy-route metadata for clearer browser identity.
- Kept `main`, the `revamp/foundation` history and existing production configuration separate.

## November 10 — completed automated verification

Fresh checks for exact application commit [`f616d278`](https://github.com/Rayhanson-Git/Harvey-Chowdhury-MTEC3200/commit/f616d278ef9275f7ef4e6679dfb3172a40b32da4): **49/49 unit/domain tests**, lint, production build, TypeScript, **20/20 workout + 7/7 theme journeys** against both built app and deployed Vercel alias, **20 axe scans per environment with no reported violations**, and mascot motion checks (12 poses, 120 frames, 144 transitions). Vercel deployment `dpl_DHXHgNJWcB8frS5SHaUEPLzVxFoQ` reported READY in production with the same Git SHA. The original course `main` remained unchanged.

PR [#2](https://github.com/Rayhanson-Git/Harvey-Chowdhury-MTEC3200/pull/2) was reviewed and closed without merging because the test-only improvement already exists independently in this current branch. Automated requests to the custom domain received a Cloudflare challenge; the Vercel alias passed full browser tests. Real-user access to the challenged domain has not been established either way.

[Current, detailed QA record](docs/jimbro/REBRAND-VERIFICATION-2026-11-10.md).

## Verified prior release (dated evidence)

The October 26, 2026 source `3de6ec13bc87172a326b099cd517708573174e8a` passed 8 original calculation, 18 core and 23 web tests, lint, build, types, 20 workout and seven theme browser journeys on preview and production, plus 20 accessibility scans per hosted environment with zero reported violations. These numbers **do not automatically apply** to the subsequent branding commit. See [THEME-VERIFICATION.md](docs/jimbro/THEME-VERIFICATION.md) for exact evidence and limitations.

## Next checkpoints

| Work | Status | Next action |
| --- | --- | --- |
| Current full web feature scope | Completed | Maintain modern IndexedDB v2 runtime; plan future features separately |
| Root docs, names and app navigation | Completed | Keep new scope/version links current |
| Automated regression pass | Completed | 49/49 tests plus lint, build and TypeScript passed on `f616d278` |
| Chromium local and production-alias browser QA | Completed | 27/27 journeys per environment, 20 axe scans per environment; mascot motion passed |
| Production release | Completed | Vercel READY at `dpl_DHXHgNJWcB8frS5SHaUEPLzVxFoQ` |
| Custom-domain automated access | Needs revision | Cloudflare challenged automated HTTP access; confirm visitor impact before changing security rules |
| Human phone, screen-reader, OS alert and peer checks | Not started | Gather real observations without claiming a pass |
| Native version evaluation | Planning | Revisit after human web-app testing |

## Archive

[Complete prior progress log](docs/archive/PROGRESS-2026-10-27.md) · [Current implementation handoff](docs/jimbro/HANDOFF.md) · [Project reflection](docs/jimbro/reflection.md)
