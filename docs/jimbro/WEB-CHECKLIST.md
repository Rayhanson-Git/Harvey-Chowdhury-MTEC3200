# Repair and release acceptance ledger — October 21, 2026

This run starts at release branch `a02322b` (production application `1af1c647`). Historical passes are not counted as fresh evidence. Status vocabulary: Implemented = source exists; Verified = checked in this run; Defective = reproduced unresolved fault; Blocked = exact unavailable prerequisite; Explicitly deferred = outside the authorized web scope.

| Acceptance area | Implementation status | Verification status / current evidence |
|---|---|---|
| Light/Dark/System appearance, persisted choice, live system updates | Implemented | Verified: three-engine theme tests, actual preview/production 7 theme + 20 workout journeys each; see THEME-VERIFICATION.md |
| Correct repo, release branch, production project/domain | Implemented | Verified: remote and Vercel source identity inspected |
| Original main, coursework and separate LeaveBy preservation | Implemented | Verified: original route, PRD, coursework directories and frozen v1 files unchanged from a02322b |
| Jim shoulder/elbow hierarchy and wrist attachment | Implemented | Verified: explicit joint matrices + silhouette connectivity at 120 rendered samples |
| All twelve poses, motion sampling, multi-instance IDs | Implemented | Verified: twelve states, ten frames each, 144 pose changes, unique IDs |
| Independent motion; explicit/system reduced motion | Implemented | Verified: real animation tracks; both motion overrides suppress them |
| Compact, mobile, desktop, enlarged Jim | Implemented | Verified: 48/96/240/600px rendered inspection |
| Wordmark/lockup/app mark/light/dark/mono sources | Implemented | Verified: deterministic generated SVG family, visual review |
| Favicon/home-screen/social derivatives and integration | Implemented | Verified: compiled and hosted routes/assets, manifest and icon integration |
| Calculation, midnight, DST gap/repeated time, timezone | Implemented | Verified: domain tests and midnight/zero/DST browser cases in all three engines |
| Schedule edit consequences, absolute recovery, rest/elapsed independence | Implemented | Verified: current browser journey and core domain tests |
| Warning/cutoff/preparation/departure, denied notifications | Implemented | Verified: browser clock progression; mocked denial fallback (not OS dialog) |
| Seven preset previews and starts | Implemented | Verified: every preset preview/start snapshot in all three engines |
| Routine create/rename/duplicate/edit/replace/reorder/reuse | Implemented | Verified: current browser CRUD and start snapshot |
| Active-plan add/replace/reorder; set kinds, units, correction, notes | Implemented | Verified: current browser logging and domain measure checks |
| Comparable previous values without automatic completion | Implemented | Verified: external/timed browser behavior; new regression |
| Saved set removal confirmation; early finish; no duplicate session | Implemented | Verified: current UI confirmation/early-finish/reload and storage concurrency |
| Calendar/history/details/direct links/repeat/delete | Implemented | Verified: calendar, detail link, correction, repeat, confirmed deletion and recomputation browser journeys |
| Progress/volume/comparability/chart recomputation | Implemented | Verified: current domain tests and UI correction; new bodyweight/assistance regression |
| Atomic writes, versioned v1→v2 migration, stale tab conflicts | Implemented | Verified: 15 native Chromium IndexedDB checks |
| Storage unavailability/quota/retry | Implemented | Verified: native failures plus unavailable-storage UI and quota/retry in all three engines |
| JSON download/file-input restore, record/preference equality | Implemented | Verified: real UI round-trip in disposable Chromium profile |
| Merge duplicates, replacement confirmation, invalid/conflicting imports | Implemented | Verified: native cases plus actual file chooser/download round-trip, conflict/invalid-file protection and policy confirmation in all three engines |
| Local phrases/truth/tone/flirt/cooldown/dedup/exhaustion | Implemented | Verified: domain catalog and selection tests; bounded history |
| Optional Jim/motion/quiet settings and hidden-page cleanup | Implemented | Verified: preferences and overrides, simulated document-hidden cleanup and phrase tests |
| Routes, responsive screens, keyboard focus/dialogs, axe | Implemented | Verified: 320/390/768/1440 widths, dialog keyboard/focus, six axe scans × three engines; incomplete/manual nodes retained |
| Preview URL test and exact-source production release | Implemented | Verified: exact final source a6d646e; final immutable preview and production each 20/20, hosted mascot checks and alias/source identity confirmed |
| Physical phones, real software keyboards, screen-reader output | Implemented | Blocked: physical device/assistive-technology test session unavailable |
| OS permission prompts, audible output, locked/background delivery | Implemented | Blocked: no human OS/device session; foreground behavior only; background guarantee explicitly excluded |
| Human peer usability | Implemented script | Blocked: real participants unavailable; no fabricated feedback |
| Native app/accounts/cloud/payments/social/nutrition/wearables/runtime AI | Explicitly deferred | Explicitly deferred by product scope |

No unresolved reproduced product defect may be labeled Verified. The final verification and release records identify tested source, commands, browser engines, artifacts and remaining manual limitations.

Final authority: fail-fast cloud run 39656940318 on source a6d646e passed all 48 domain tests, lint, build, type checks, 20 final-preview and 20 production journeys plus 120 joint samples/144 transitions. Initial exact-24 catalog test failure is preserved and corrected; it is not counted as a pass. Local checkout resynchronization and old-runner checks are Verified after host recovery; fresh production acceptance passed 20/20 and mascot sampling 120/144. Preserved drafts and recovery evidence are documented in HANDOFF.md. Physical-device, assistive-technology and human peer rows remain Blocked rather than silently marked Verified.
