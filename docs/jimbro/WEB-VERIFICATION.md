# JimBro repair verification — October 21, 2026

Current repair starts from release branch `a02322bba563513c23770ed8d9b7441c03e8693e`, whose application source `1af1c647` was serving production. Original source and actual deployed Vercel project/domain were verified before edits. Prior release records are preserved under `history/2026-10-21-initial-*`; their pending checks are historical, not this run's status.

## Product story and data boundaries

Plan commitment → preview time/routine → start → log/correct completed sets → reload the same active record → finish early or normally → review/edit/delete history and derive progress. Alternate open-workout mode has no deadline. Browser UI writes through the existing transactional IndexedDB v2 adapter; there is no workout API, cloud account or remote persistence. UI success is evaluated after transaction commit. All browser QA uses synthetic records and disposable contexts; no real user's history is read, changed or uploaded.

## Repaired findings

- Actual production ready pose: `fill-box` transform origin displaced the left shoulder by 34.22 CSS pixels in the 200px gallery. View-box shoulder and elbow anchors, overlap and wrist-attached hand repair all poses. Pointing now rotates instead of translating away from its elbow. Runtime, editable master and share derivatives agree.
- Active-plan add/replace read a controlled select's value inside a later IndexedDB callback. Capture the selected ID immediately; browser tests cover add/reorder/replace.
- Previous-performance lookup mixed external, assisted, bodyweight, timed and distance measures. It now filters the selected measure before showing/reusing values.
- Bodyweight progress incorrectly retained the external-load repetition filter; assisted progress now reports the lowest assistance at matching reps, clearly labeled.
- Backup import retained a previously selected Replace policy on later files. Fresh files default to Merge; destructive replacement still requires explicit selection and confirmation. Failed imports explain the error inside the modal.
- Saved-set removal now requires a named confirmation.
- Long modal Tab order could pass outside the dialog, and unmount lost trigger focus. Explicit wrapping/cleanup restores focus. JimBro captures pointer-button focus before mounting dialogs because WebKit does not do so by default.
- Disabled unnecessary root/LeaveBy link prefetches after WebKit reported canceled background fetch errors under rapid navigation. Final console-clean cross-browser runs include the correction.
- Consistent original path-based wordmarks, lockups, mono marks, icon family, multi-size favicon, manifest and share assets replace the generic navigation badge. No application dependencies added.

## Current automated checks

Commands and detailed results are retained in `evidence/2026-10-21-repair/`.

| Check | Current outcome |
|---|---|
| `npm test` | 8/8 |
| `npm run test:jimbro` | 18/18 in the final fail-fast cloud run; initial 17/18 stale-assertion failure retained below |
| `npm run test:web` | 22/22; comparable measures, singleton/empty phrase pools and library scope regressions included |
| `npm run lint` | Passed, zero warnings |
| `npx tsc --noEmit` | Passed |
| `npm run build` | Passed; all product routes and manifest prerender |
| Native Chromium IndexedDB fixture | 15/15: upgrade, atomic starts/alerts, conflicts, rollback, quota, import and recovery |
| `npm run test:mascot` | 12 poses × 10 times = 120 frames; 144 discrete state changes; joint matrices/torso containment/alpha connectivity; 48/96/240/600px |
| Motion overrides | Explicit off, OS reduced-motion emulation and simulated document hiding suppress decorative tracks |
| Full compiled browser suite | 20/20 on final compiled production source in each of Chromium, Firefox and WebKit; no recorded console/HTTP errors |
| Hosted preview and production | Verified on exact final source: 20/20 actual-preview and 20/20 production journeys; production mascot suite passed |

Native fixture: `node tests/prepare-native-qa.mjs`, open `/qa-native/index.html`, run isolated checks. Generated `public/qa-native` is removed before production build. No fixture is deployed. Existing schema remains v2; original v1 data migrates in place.

Browser tools are external QA tooling, not runtime dependencies. Reproduce with Playwright and `@axe-core/playwright` in an isolated directory, then `JIMBRO_QA_MODULES=/absolute/qa-dir JIMBRO_URL=https://target npm run test:browser`. Select Firefox/WebKit with `JIMBRO_ENGINE=firefox|webkit`. `JIMBRO_EVIDENCE=/absolute/path` selects output. `npm run test:mascot` uses the same target/tool directory. The retained old `tests/jimbro-browser.mjs` is explicitly labeled historical schema v1.

## Backup UI evidence and policy

Synthetic sessions, a reusable routine, a bodyweight record and non-default preferences are created through the UI. Export observes a real download event, saves and parses versioned JSON. Import clicks the actual file input, observes the browser's native file-chooser event and selects that JSON. Merge leaves existing IDs/preferences intact without duplicates; replacement stays unchanged until Confirm replacement and then restores all supported records/preferences. A second export compares those fields exactly. Malformed JSON, unsupported version and competing-active imports preserve existing records/preferences. Optional error phrase receipts can change independently and are excluded from record equality. This is an automated browser chooser, not a human-operated desktop OS dialog.

## Visual/accessibility limits

Representative browser widths are 320, 390, 768 and 1440 CSS pixels; these are viewport emulations, not physical phones/tablets. Keyboard automation checks named dialogs, initial focus, Tab containment, Escape and restored trigger focus. Axe checks report individual incomplete/manual nodes in the retained JSON; zero reported violations is not accessibility certification. Jim's normal/gallery/screenshots, 120 sampled frame transforms, representative start/intermediate/end atlas and actual-size 16/32/48px icons were visually inspected. Sampling is not a proof for every infinitesimal frame. Pose changes are discrete, with independent part motion, rather than interpolating incompatible skeletons.

Unavailable: real iPhone/Android software keyboards/safe-area behavior, real VoiceOver/TalkBack output, human audible-output assessment, OS notification prompts, physical suspension/lock/reboot delivery and human peer usability. Notification-denied fallback is tested with a deterministic browser stub. Browser clocks and phrase randomness are controlled; document-hidden behavior is simulated. No human participant, real-device or screen-reader pass is claimed. Closed/background/locked alarms and offline launch remain unsupported guarantees. The prepared peer script is unchanged in its truthfulness.

## Final compiled-source browser results

All 20 journeys passed independently in Chromium, Firefox and WebKit (60 completed journeys). Each engine ran six axe scans with zero reported violations; individual incomplete/manual flags are retained in browser JSON and are not claimed resolved by automation. The final tests use actual download and native file-chooser events, controlled clocks and seeded phrase randomness, and include active-plan controls, rest start/pause/resume/extend/skip, all five measurement types and repeated finish activation. No page exceptions, console errors or application-origin HTTP failures were recorded in these final runs. Successful cache revalidation (304) is accepted. Local compiled URL: http://127.0.0.1:3103; source files are fingerprinted in evidence. Hosted identities are recorded separately.

## Correction to the initial local summary

The combined local command did not stop on the legacy catalog-size failure. Its retained core log records 17/18, not the originally summarized 18/18. The cloud runner exposed this mismatch. The stale exact-24 assertion is replaced by original minimum coverage and uniqueness across all current IDs; the expanded category requirements remain independently tested. The initial failure is preserved as `core-tests-initial-failure.txt`; current source subsequently passed the final fail-fast CI job before the release was called verified. Final production serves a6d646eeaf4f4c2e1af7cf525774eee226f3bb5a. The stale assertion is repaired, runtime-file fingerprints match the compiled application, and final clean CI results supersede the failed local core result.

## Final hosted verification — completed

Exact application source `a6d646eeaf4f4c2e1af7cf525774eee226f3bb5a`. Final preview https://jimbro-m3befnj78-rayhanson.vercel.app and production https://jimbro.rayhanson.tech each passed 20/20 actual-URL browser journeys. Production mascot suite passed 120 sampled frames, 144 discrete transitions, all sizes and explicit/system/hidden-page motion checks. Final cloud run [39656940318](https://github.com/Rayhanson-Git/Harvey-Chowdhury-MTEC3200/actions/runs/39656940318), workflow eb17c66, job 119419599259 succeeded in every gate, including 8+18+22 tests, lint, build and TypeScript. Its source checkout is pinned to the deployed application commit. Actual summary completed at 2026-10-21T18:56:36.362Z.

Production browser output recorded no page/console/HTTP errors; six axe scans reported zero violations, with incomplete/manual-review qualifications retained in report artifacts. The final preview suite also passed its six scans. No browser-profile user data or real workout history was used. Synthetic records remain isolated to disposable contexts.

Reports and sample images are available in the run's `jimbro-production-verification-1` artifact until October 28, 2026; the actual command result extracts and summary are preserved permanently here. Production deployment and alias/source identity were independently checked through Vercel, and the separate LeaveBy deployment/main SHA were unchanged. See WEB-RELEASE.md for exact identities.

## Recovered-host completion

The host reconnected and the canonical release branch was fast-forwarded to c13e755 after preserving the local release draft and preview evidence in Git stash 8259227fb31deb33a159a2a03fb03f958d7d1007. All 78 application fingerprints match the deployed source. Fresh local plan/core/web tests passed 8/18/22 and lint passed. The initial standalone type check failed on duplicate ignored `.next/types/routes.d 2.ts` output. The old cache was preserved outside the checkout; clean `npm run build && npx tsc --noEmit` then passed. No tracked application file changed.

The actual production URL freshly passed 20 Chromium journeys, six axe scans with no reported violations, and the 120-frame/144-transition mascot suite. No page/console/application HTTP errors were recorded. No old verification processes/listeners remained on 3100–3103. Durable reports and clean-build output: `evidence/2026-10-21-recovery/`. Physical-device, assistive-technology, audible/OS and peer limitations above remain unchanged.
