# JimBro scope and verification

Updated October 21, 2026 (UTC). Branch `revamp/foundation`; baseline `4af9f2bc004bb1a0f1d8649991bf41cea649e90c`.

The user explicitly authorized finishing JimBro, committing it to GitHub and deploying it. This expands the earlier Milestone 1-only task. Implementation, verification and release now proceed on `revamp/foundation`; main, the original coursework and the seven frozen v1 foundation records remain preserved. The initial continuation's scope error remains in dated progress history and is not retroactively presented as Milestone 1 work.

The current app combines LeaveBy scheduling and post-set workout logging in one persistent session. Release publication and post-deployment results are recorded separately in `RELEASE.md` once confirmed. The baseline SHA above identifies the implementation's starting point, not the final release commit.

## Preserved implementation

| Area | Implemented source |
| --- | --- |
| Session/schedule | One active persistent session, absolute epoch deadlines, captured timezone/date, DST gap rejection and explicit repeated-time choice |
| Persistence | Native IndexedDB transactions, active pointer, revision conflicts, retry IDs, alert receipts, schema validation and visible storage errors |
| Unified flow | Plan before completed-set logging, docked countdown, editable plan, preparation/departure guidance and separate actual-action confirmations |
| Supporting records | 24 original categorized common exercises, set correction/removal, history/day labels and dated kg/lb body-weight records |
| Alerts | Foreground text and optional user-enabled sound; no closed-app/background guarantee |
| Coursework | Original root PRD, research, interviews, designs, slides, templates, calculation source/tests and form/result components retained. Original entry page copied byte-for-byte to `/leaveby` |

GymLog source was unavailable in the baseline; this is not a verified source merge or data migration. Accounts, cloud sync, background push and final branding remain deferred. No peer observations were invented.

## Actual verification

After the initial source transfer was rejected, the user explicitly approved exporting the reduced application/test/build bundle to the connected Vercel sandbox. The isolated sandbox restored locked app dependencies and installed temporary browser QA tooling outside the app. It exposed no public app ports, created no deployment, and will be stopped after live deployment checks. No application dependency versions or lockfile changed. Earlier host registry/localhost restrictions were not bypassed through the local browser.

Environment: Node 24.21.0, npm 11.19.0, Next 16.4, Playwright 1.64.1, Chromium 156.0.8078.4, axe 4.14.0. Test clocks deliberately use 2030 dates.

| Check | Result |
| --- | --- |
| `npm test` | **8 passed, 0 failed**, using the original TypeScript compiler/test pipeline |
| `npm run test:jimbro` | **18 passed, 0 failed**, native Node TypeScript stripping |
| `npm run lint` | **Passed, exit 0**, including the browser script |
| `./node_modules/.bin/tsc --noEmit` | **Passed, exit 0** |
| `npm run build` | **Passed**; `/` and `/leaveby` prerendered |
| Production browser checks | **27 passed, 0 failed; runner exit 0**; [report](qa-report.json) |
| Native IndexedDB fixture | **18 passed, 0 failed**, including real reload and independent connections; nested within one browser check, not 18 additional independent UI cases |
| axe | **0 violations** in history, 320px logger and 320px plan scans; not accessibility certification |
| Console/hydration | No errors observed on the instrumented primary page |
| Source identity | Sandbox and checkout match the same 42-file source/test/build fingerprint; [metadata](verification-results.json) |
| Preservation | All 77 baseline paths remain, 70 unchanged and seven modified paths listed below. Original entry copy, lockfile and local/remote main preserved |

Verification corrected prerender-time clock initialization, effect hydration and insufficient small-text/button contrast. The release also fixes desktop dock overlap with a dedicated sticky column and adds layout, short-viewport keyboard focus and blocked-audio regression coverage. A fresh-checkout type check needs Next route types; production build generates them before the final `tsc --noEmit` check.

## Acceptance evidence and remaining observations

| v1 cases | Automated evidence | Remaining observations |
| --- | --- | --- |
| P-01, P-05 | One active ID across navigation, reload and a second tab; records survive | Physical device/profile testing |
| P-02–P-04, P-16 | Arithmetic, invalid inputs, midnight, zero boundaries, clock jumps, DST and persistent-profile timezone reconfirmation | Broader browsers/devices |
| P-06, P-11 | Jump past deadlines, current-phase summary, early exercise finish retains guidance, actual actions, finish/cancel, stale-alert suppression | Real OS suspension |
| P-07 | No horizontal overflow at 320px; invalid-field focus, keyboard submission, 12 Tab transitions and input visibility at 320×420 exercised; desktop dock/control separation asserted | Physical mobile keyboard/touch and human keyboard usability evaluation; desktop overlap fixed and screenshot reviewed |
| P-08, P-13–P-15 | Sets, correction/removal, exercise search/filter, history view, mixed-unit measurements and core validation/count/name-snapshot checks | Human assessment of history/filter clarity |
| P-09, P-10 | Native concurrent starts, stale writes, rollback, corruption/schema errors; UI save failure retains input and retry saves once; denied storage prevents start | Blocked-upgrade UI and wider failure conditions |
| P-12 | Enable/mute controls and blocked-audio fallback exercised; phase text, receipt deduplication and no per-second live region reviewed | Audible output and actual screen-reader announcements |

All recorded automated checks pass. Human physical-device, screen-reader, audible-output and peer usability evaluation remain separate observations. Background/closed-app delivery is explicitly deferred. These human observations are not claimed as automated results.

Production screenshot excerpts: [desktop](qa-desktop.webp), [320px](qa-mobile.webp). These are cropped review evidence.

## Reproduction

Existing standard commands: `npm test`, `npm run lint`, `npm run build`. Supplemental core suite: `npm run test:jimbro` (Node 22.18+). Locked dependencies can be restored with `npm ci`. Browser QA tools remain separate from application dependencies; use the documented versions above. Run build before a standalone type check in a fresh checkout, or generate Next route types first.

For later authorized browser reproduction with existing locked dependencies and separate Playwright/axe tooling, run the production app on `127.0.0.1:3000`, `node tests/serve-storage.mjs` on `127.0.0.1:4876`, then:

```sh
JIMBRO_QA_MODULES=/path/to/qa/node_modules node tests/jimbro-browser.mjs
```

The native fixture uses its own disposable origin. Browser-local records have no cloud backup. Foreground alerts use the device clock and cannot guarantee delivery while closed or suspended.

## Changed files

Existing baseline paths modified in the complete working tree: `AGENTS.md`, `PROGRESS.md`, `README.md`, `app/page.tsx`, `docs/components.md`, `package.json` (test script only), `tsconfig.json` (TypeScript import flag only). These paths are covered by the current explicit implementation/release authorization; the root course PRD is unchanged.

New paths:

- `docs/jimbro/v1/README.md`, `PRD.md`, `ARCHITECTURE.md`, `ACCEPTANCE.md`, `INVENTORY.md`, `VERIFICATION.md`, `baseline-files.csv`: frozen foundation records, preserved in this follow-up.
- `app/leaveby/page.tsx`: original entry page.
- `lib/jimbro/types.ts`, `schedule.ts`, `session.ts`, `catalog.ts`, `storage.ts`: existing model, scheduling, validation/catalog and persistence.
- `components/jimbro/section-card.tsx`, `schedule-editor.tsx`, `workout-logger.tsx`, `session-countdown.tsx`, `session-actions.tsx`, `workout-history.tsx`, `body-weight-tracker.tsx`, `workout-app.tsx`, `use-workout-store.ts`: existing interface/controller.
- `tests/jimbro.test.mjs`, `jimbro-browser.mjs`, `serve-storage.mjs`, `storage-browser.html`: existing supplemental verification.
- `docs/jimbro/IMPLEMENTATION.md`, `verification-upload-manifest.json`, `verification-results.json`, `RELEASE.md`, `qa-report.json`, `qa-desktop.webp`, `qa-mobile.webp`: scope/evidence records. Upload manifest describes the initial approved bundle; verification metadata identifies final tested source after fixes/test additions.

Publication is performed from the verified tree. Final commit, deployment state, URL and live smoke checks belong in the release record. Original LeaveBy production hosting is preserved in its existing Vercel project; JimBro uses its own project.
