# JimBro — Product Requirements Document

**Active web product specification · November 10, 2026 · `release/jimbro-web`**

JimBro is a local-first workout and schedule companion with personalized routines, real completed-set tracking, session history, progress charts, body-weight records and departure guidance. This specification replaces the earlier Project 1 PRD **for the JimBro release branch only**. Historical requirements are preserved at [docs/archive/LeaveBy-PRD.md](docs/archive/LeaveBy-PRD.md); `main` is not changed.

## Problem and intended user

A student or working adult may want to exercise before another commitment but still needs to prepare and travel. Planning with one tool and logging workouts with another fragments attention and state. JimBro offers one flow from **planning → active workout → transitions → review**, or an open workout without a scheduled deadline.

Early interviews and course research support the original scheduling problem; they do not establish demand for every expanded feature or prove that JimBro reduces lateness. User testing of the complete product remains an open validation step.

## Primary user journey

1. On **Today**, enter a commitment and preparation/travel/buffer estimates or choose an unscheduled workout.
2. Choose, adjust or create a workout routine, then start the active session.
3. On **Workout**, record actual completed sets; use independent rest and elapsed timers.
4. When scheduled, a persistent deadline and phase guidance continue across tabs and page reloads. Workout-stop, departure and actual user actions stay distinct.
5. On **History**, review calendar entries and session details, edit mistakes, or reuse a session.
6. On **Progress**, view comparable recorded measurements and body weight.
7. On **Settings**, manage appearance, Jim's preferences, alerts and versioned JSON backup import/export.

Today and Workout are **different responsibilities for the same active session**, not duplicate daily trackers.

## Implemented acceptance scope

| ID | Requirement | Current behavior documented in the October 2026 release |
| --- | --- | --- |
| JB-01 | One active session with clear lifecycle and local recovery | Native IndexedDB v2 active pointer; transactional conflict safeguards |
| JB-02 | Schedule a fixed commitment or choose an open workout | Validated inputs, captured timezone, optional no-deadline mode |
| JB-03 | Keep cutoff, leave and arrival times correct | Absolute epoch deadlines with DST gap/repeated-time handling |
| JB-04 | Provide routines and a completed-set logger | Seven editable starter routines, custom plans, actual recorded measures |
| JB-05 | Keep workout timers distinct from the deadline | Rest/elapsed controls do not move the scheduled stop/departure |
| JB-06 | Make saved work recoverable and correctable | Session/history corrections, stable IDs and clear failed-write behavior |
| JB-07 | Show meaningful history and comparable progress | Calendar entries, repeats, measurement-specific charts, body-weight series |
| JB-08 | Include a controllable animated mascot | Original Jim rig, local phrase selection, tone/motion preferences |
| JB-09 | Offer data backup and migration | JSON export/import with merge/replace confirmation, v1→v2 DB migration |
| JB-10 | Support persistent appearance preferences | Light, Dark and System; stored across tabs/reloads and in backups |
| JB-11 | Support accessible and responsive interactions | Documented 320–1440px automated checks; manual-device/accessibility validation still pending |
| JB-12 | State alert limitations accurately | Foreground best-effort notices and opt-in sound, without closed-app guarantees |

Refer to [WEB-ARCHITECTURE](docs/jimbro/WEB-ARCHITECTURE.md), [WEB-VERIFICATION](docs/jimbro/WEB-VERIFICATION.md), [THEME-VERIFICATION](docs/jimbro/THEME-VERIFICATION.md) and the [release record](docs/jimbro/WEB-RELEASE.md) for exact implemented behavior and dated evidence.

## Scheduling contract

Given commitment epoch timestamp `C` and estimated buffer `B`, commute `T`, preparation `P` in minutes:

```text
arrival = C - B * 60_000
departure = arrival - T * 60_000
workout_stop = departure - P * 60_000
```

Buffer is subtracted exactly once. Use absolute timestamps and a captured time zone. Explicit zero durations are valid; blank, fractional, negative and invalid date entries are rejected. An overdue milestone does not automatically mark a workout finished, pause a rest timer, or record that a person left. An open workout has no meaningful departure deadline.

## Session and data requirements

- **Database:** IndexedDB `jimbro`, version 2, with backward-compatible migration of supported version 1 records.
- **Integrity:** transactional writes, stable set/session IDs, revisions to reject stale updates and visible recovery paths.
- **Data boundaries:** routine templates, copied active-session plans and completed sets remain independent; editing a template does not rewrite historic workouts.
- **Measures:** external load, assistance, body-weight, time and distance are separate types. Charts and comparable-history calculations must not silently mix them. Body-weight entries store their original unit.
- **Backup:** versioned JSON export/import from Settings. A new import defaults to Merge; Replace requires explicit confirmation. Invalid/conflicting input must not partially replace records.
- **Appearance:** persisted Light/Dark/System preference with live system response, included in backward-compatible v2 backups.
- **Privacy:** workout data stays in the current browser profile/origin. It is not automatically synchronized, backed up remotely or sent to a workout API.

## Product character and design

Jim's character animations and phrases complement essential information but must never be required to complete a workout. Respect user motion controls and reduced-motion preferences. Important deadlines and errors get priority over decorative speech; local phrases must not fabricate exercise performance. The design system supports light and dark palettes with legible forms, controls, charts and calendar labels.

## Exclusions and restrictions

No authenticated accounts, paid backend, automatic cloud sync, nutrition features, social network, smart wearable integration, AI-generated coaching, fully offline installation guarantee, or native iOS/Android application is shipped. Background/lock-screen alerts and a trusted server clock are not guaranteed. Historical GymLog data from another browser origin is not claimed migrated.

Never downgrade an existing v2 database to a v1 reader or clear user data to "fix" a failed migration. Export and validate a backup before any risky recovery.

## Validation and delivery

Use the current code on `release/jimbro-web` with tests `npm test`, `npm run test:jimbro`, `npm run test:web`, lint, build and TypeScript; run the optional browser, mascot and theme acceptance suites as documented. Historic passes must be attributed to their **dated commit and deployment** rather than used as blanket evidence for later commits.

The October 26 production release passed the documented theme and workout journeys and automated scans. Real-device keyboards, VoiceOver/TalkBack, OS/locked-screen alert behavior, and peer usability remain unverified. Any subsequent release must record its own results and deployment identity.

## Academic history

Preserve the [Project 1 original PRD](docs/archive/LeaveBy-PRD.md), research, interviews, designs, templates and presentation materials unchanged as evidence. The original solo assignment and JimBro's subsequent product expansion are not interchangeable, and this document does not assert new instructor approval.
