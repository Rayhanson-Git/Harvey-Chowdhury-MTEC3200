# JimBro release — October 21, 2026

- **URL:** [https://jimbro-rayhanson.vercel.app](https://jimbro-rayhanson.vercel.app)
- **Target/status:** production, READY
- **Deployed source commit:** [bfa7c562aacafdb925540642dffc8be372ef0569](https://github.com/Rayhanson-Git/Harvey-Chowdhury-MTEC3200/commit/bfa7c562aacafdb925540642dffc8be372ef0569)
- **Branch:** `revamp/foundation`; main preserved
- **Project:** `jimbro` (`prj_5dLMR9qmoPZn1H4YtQ5zO1c708IF`)
- **Deployment:** `dpl_D54XwUhqEQzn3tGrg4s82SMrhMXa`
- **Framework:** Next.js 16.4; configured Node 24.x
- **Build:** 35 seconds reported by Vercel; deployment reached READY after approximately 41 seconds of building

## Verification

Existing calculation tests **8/8**, JimBro core **18/18**, lint, production build and TypeScript passed. The full browser suite passed **27/27** against both the isolated production build and the public URL above, using disposable browser profiles. Native IndexedDB **18/18** cases run within one browser case; do not add them as independent UI assertions. Three axe scans reported zero violations in each run. The two machine-readable browser reports were byte-identical; [qa-report.json](qa-report.json) represents both runs.

Checks include schedule entry/editing, midnight/zero/DST/timezone boundaries, logging/correction/removal, reload recovery, same active session across tabs, native transaction/conflict/rollback/schema failures, visible denied-storage and save-error recovery, desktop dock separation, short-viewport keyboard focus, early exercise finish, actual transition actions, cancellation/completion, optional/blocked audio, history/body-weight records and original LeaveBy at `/leaveby`. No console/hydration errors were observed on the instrumented page.

The desktop dock overlap is fixed and the [updated screenshot](qa-desktop.webp) was visually reviewed. [Mobile excerpt](qa-mobile.webp). Physical device, real screen-reader/audible-output and human peer usability observations remain separate from automated results. Foreground alerts have no closed-app/background guarantee.

## Preservation and operations

All 77 baseline paths remain, with 70 unchanged and seven intended modifications documented in [implementation](IMPLEMENTATION.md). Root PRD, research, interviews, original calculation code/tests, designs, templates, presentation assets and dependency lockfile remain unchanged. Original entry page is retained byte-for-byte at `/leaveby`. Application dependency versions were not changed.

GitHub main remains `4af9f2bc004bb1a0f1d8649991bf41cea649e90c`; local main remains `1dee74521095cfbd7c8e1498c070860bb79a29eb`. The existing LeaveBy project still serves production deployment `dpl_3XLr2C3VqFY1v2m6KFZG4M8zf5v7`; JimBro uses a separate Vercel project. This release does not merge into main.

A post-deployment Vercel runtime scan found no error/fatal logs for this deployment in the preceding 15 minutes. This mostly static/client-side app has no added server logging, monitoring service or log drain. The temporary verification sandbox is stopped after evidence collection; no temporary public sandbox ports were exposed.

The documentation-only follow-up commit records publication evidence. It does not change the deployed application source; the 42-file fingerprint in [verification metadata](verification-results.json) identifies that source exactly. Future deployments are manual releases from an explicitly selected tested branch/commit; no new CI pipeline or change to the repository's main branch was made.
