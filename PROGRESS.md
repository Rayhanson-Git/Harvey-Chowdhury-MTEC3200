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

## Verified prior release (dated evidence)

The October 26, 2026 source `3de6ec13bc87172a326b099cd517708573174e8a` passed 8 original calculation, 18 core and 23 web tests, lint, build, types, 20 workout and seven theme browser journeys on preview and production, plus 20 accessibility scans per hosted environment with zero reported violations. These numbers **do not automatically apply** to the subsequent branding commit. See [THEME-VERIFICATION.md](docs/jimbro/THEME-VERIFICATION.md) for exact evidence and limitations.

## Next checkpoints

| Work | Status | Next action |
| --- | --- | --- |
| Current full web feature scope | Draft complete | Continue only from verified v2 runtime, not the older revamp branch |
| Root docs, names and app navigation | Draft complete | Verify committed diff and corrected links |
| New automated regression pass | Not started | Run `npm test`, `npm run test:jimbro`, `npm run test:web`, lint, build and types |
| New browser QA and production rollout | Not started | Verify preview of the exact commit, then release deliberately |
| Human phone, screen-reader, OS alert and peer checks | Not started | Gather real observations without claiming a pass |
| Native version evaluation | Planning | Revisit after human web-app testing |

## Archive

[Complete prior progress log](docs/archive/PROGRESS-2026-10-27.md) · [Current implementation handoff](docs/jimbro/HANDOFF.md) · [Project reflection](docs/jimbro/reflection.md)
