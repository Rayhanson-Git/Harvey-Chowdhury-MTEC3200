# Web release verification — October 21, 2026

This file records this implementation task. Earlier QA reports remain historical and are not counted as fresh passes.

## Actual results so far

- Baseline: original calculation tests 8/8; original JimBro tests 18/18; lint; production build passed.
- Expanded domain suite `npm run test:web`: 18/18. Covers snapshots, migration function, units, rest/elapsed, open mode, PR eligibility, typed measures, progress recomputation, date policy, backup validation, preference validation, phrase pools/filters/exhaustion/cooldown/dedup and priority.
- Real Chromium IndexedDB fixture: 15/15. Isolated database `jimbro-qa-release`, not the app database. Covers first open, concurrent starts, committed set recovery, stale revision, routine/preferences, atomic alerts, persistent phrase dedup, invalid import safety, merge duplicate policy, competing-active rollback, failed domain write, injected quota failure, valid replacement, native v1→v2 upgrade and rest/pause recovery.
- UI: future schedule → full-body preview/start; completed set save and automatic rest; mid-session reload retained set, deadline and running rest; correction; early finish retained work/reminders; explicit closure; calendar/history/detail; historical correction changed volume from 176 to 192 kg·reps; save session as routine; create custom two-exercise routine, reorder/change sets/save/reuse; unscheduled mode; hide/motion/tone preferences.
- Desktop screenshots inspected for planner and gallery. Actual browser viewport frames at 320 and 768 CSS pixels reported no horizontal overflow and zero unlabeled inputs on the logger. The responsive harness also inspected all twelve SVG states. These are browser frames, not physical devices.
- All 12 production poses rendered. Browser animation inspector observed running breathe/blink/wave/flex/nod/thumb/exhale/spark/glance/clock/point/cheer tracks. Disabling motion produced zero running tracks in all 12 poses.
- Production build/type checks passed for expanded routes before final UI refinements; the final release rerun is recorded in WEB-RELEASE.md.

## Reproduce

`npm ci` (Node 24 recommended), `npm test`, `npm run test:jimbro`, `npm run test:web`, `npm run lint`, `npm run build`, `npx tsc --noEmit`. For native browser storage checks, run `node tests/prepare-native-qa.mjs`; open `/qa-native/index.html` in the local preview, run checks, then remove generated `public/qa-native`. Copy `tests/responsive-browser.html` temporarily to `public/qa-layout.html` for responsive/animation inspection; remove it before release. The tests intentionally use disposable data.

## Findings repaired

HTTP preview’s secure-context-only randomUUID failed: use getRandomValues-based record IDs. Schedule preview time now comes from the shared clock rather than render-time Date.now calls. kg/lb input changes convert values. Mobile dock is sticky above the logger. Mobile navigation displays all five destinations without horizontal scrolling. Open workouts do not present their compatibility sentinel as a real schedule. Local system fonts remove network font dependencies. The preview supervisor’s host flags are adapted to Next’s documented CLI.

## Verification limits

Physical iPhone/Android, actual mobile software keyboard, screen-reader output, OS reduced-motion emulation, permission-denial OS dialog, audible output and peer usability have not been exercised in this task. System reduced-motion CSS is implemented, while the explicit motion switch is browser-verified. JSON import validation/transaction paths are native-browser tested; file chooser/download round-trip UI verification is still pending. Axe results and their incomplete/manual flags are recorded below. No guaranteed background alarm/offline launch is claimed.

Additional browser recovery check: edited an active open workout into a future commitment whose cutoff had already passed. The preparation banner appeared without finishing the workout. Editing travel so departure was already passed produced “Time to leave” and the leave-by alert while preserving the same active routine. This uses deliberately extreme estimates as isolated missed-phase fixtures, not a recommended plan.

Accessibility: fresh-style workout axe scan reported zero violations (WCAG 2A/2AA/2.1AA tags); `aria-prohibited-attr` and some contrast checks remained marked incomplete/manual review by axe. This is not accessibility certification. The initial stale-style contrast failures were reproduced before restarting the dev compiler; the production CSS contained the correct token utilities.
Settings axe scan: zero violations and zero incomplete checks on the inspected desktop screen. Fresh automated tests remain 8 original + 18 existing core + 18 expanded domain cases; generated third-party axe code is temporary and excluded from final source/lint/deployment.
Progress axe scan: zero violations; color-contrast had incomplete/manual-review nodes. Three inspected screens therefore have zero reported automated violations, not a claim of full accessibility. Generated QA pages and the temporary axe bundle were moved out of public/ before final build; only reproducible test source is retained.
