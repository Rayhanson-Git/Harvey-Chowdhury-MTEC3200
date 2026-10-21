# JimBro product requirements v1

Version 1.0 · October 20, 2026 · Working title: JimBro

## Authority and current milestone

This version records the user's approved direction: combine LeaveBy scheduling and GymLog's logging after a completed set in one application. Only Milestone 1 is authorized now: preserve and inventory coursework, document requirements and architecture, prepare acceptance criteria, update instructions/progress and run existing checks. All product behavior below is a future target, not delivered functionality or permission to begin implementation.

The [root PRD](../../../PRD.md) remains the original LeaveBy course specification. Its exclusions of exercise tracking, countdowns and persistence describe that original MVP. This JimBro version deliberately expands those areas on `revamp/foundation`; it does not overwrite the course record. Research supports the transition problem; demand for the expanded product remains a hypothesis. GymLog source and detailed new peer observations are unavailable; see [inventory](INVENTORY.md).

## Problem and unified experience

A person exercising before a fixed class or work commitment needs to record completed work without losing sight of when to stop, prepare and leave. Two disconnected apps would make that person maintain separate state and watch a separate timer. JimBro instead attaches the schedule, completed sets and workout history to one persistent session.

Open the schedule entry first. Enter the commitment date/time, preparation, commute and buffer. Start the session; the schedule contracts into a docked countdown while the logger becomes the main view. Log each set after doing it. Moving between exercises, history and progress keeps the same countdown/session. At the stop deadline, foreground feedback directs the person to preparation; at departure, it directs them to leave. The application never claims that an alert means the person actually stopped or departed.

## Required target behavior

| ID | Requirement | Acceptance reference |
| --- | --- | --- |
| JB-01 | One active session ID owns scheduling, workout label, completed sets and lifecycle. Starting twice or reopening the app must not create two active sessions. | P-01, P-05, P-09 |
| JB-02 | Keep LeaveBy's future-date validation, nonnegative whole-minute estimates, explicit zero handling, visible errors, preserved input and dates across midnight. Invalid edits cannot replace a valid saved plan. | P-02, P-03 |
| JB-03 | Resolve the commitment to an absolute timestamp once; derive arrival, departure and workout-stop timestamps. Remaining time is deadline minus current time, never a stored decrementing counter. Recompute after reload/resume and schedule edits. | P-02, P-04, P-06, P-16 |
| JB-04 | Show schedule entry before a new session. After a successful start/save, reveal the workout logger and keep a labeled countdown docked across session views. The dock exposes the next deadline and access to the full plan without hiding essential logging controls. | P-01, P-07 |
| JB-05 | Log completed sets after exercise: exercise ID/name, repetitions, load, explicit unit and completion timestamp. A stable set ID prevents duplicate saves. Draft input is not a completed set. Allow correcting/removing a mistaken entry without creating another workout. | P-08 |
| JB-06 | Preserve the active session and recorded history locally across reloads with proposed IndexedDB storage. Show save failures honestly; do not announce success or discard the current draft when persistence fails. | P-05, P-09, P-10 |
| JB-07 | Derive workout, preparation, departure-due, travel/arrival and commitment-due phases from absolute deadlines. Keep planned milestones separate from actual user confirmations. Stopping exercise early must not cancel the departure reminder. | P-04, P-06, P-11 |
| JB-08 | Provide foreground visual/text alerts for workout stop and departure. Optional sound must be enabled by user action and have a visible fallback. Deduplicate alerts and summarize missed milestones on return. Do not promise alerts while the app is closed, suspended or hidden. | P-06, P-12 |
| JB-09 | Store session date and optional workout-day label (such as push, pull, chest, back or arms). Show completed workout history by date, exercise and recorded sets/load; a scheduled session with no completed work is not counted as a completed workout. | P-13 |
| JB-10 | Provide a categorized, searchable exercise catalog with stable IDs, exercise names and recorded source/attribution. Preserve an exercise name snapshot in past set entries when catalog names change. No copied GymLog library is claimed available. | P-14 |
| JB-11 | Support dated body-weight records with explicit kg/lb units and a simple history. Keep body weight separate from the weight lifted in a set. Show recorded data without inventing progress or measurements. | P-15 |
| JB-12 | Support keyboard/touch use, visible labels/focus, text meaning beyond color and layouts at 320 CSS pixels and desktop widths. Avoid announcing countdown changes every second to assistive technology; announce phase changes instead. | P-07, P-12 |

JB-09–JB-11 capture the user's wider GymLog direction. They remain future requirements; the ordering of their implementation is not approved by this milestone. Account-free means one local browser profile, not authenticated multi-user separation.

## Scheduling contract

Let `C` be commitment epoch milliseconds, and `B`, `T`, `P` be buffer, commute and preparation durations in minutes:

- Target arrival `A = C − B × 60,000`.
- Departure `D = A − T × 60,000`.
- Workout stop `S = D − P × 60,000`.

Buffer is deducted once. Preserve the original local date/time and resolved timezone/offset alongside `C`; persist numeric timestamps, not serialized Date objects or countdown seconds. The device clock is the time source, so changes to that clock affect displayed remaining time. Countdown rendering is only a refresh mechanism.

Reject incomplete, invalid, negative, fractional, unsafe or out-of-range schedule inputs. Reject a new commitment at or before now. A future commitment with a stop/departure time already passed still produces the plan and an explicit current-phase warning. Display a countdown of zero plus overdue text when a deadline passes; do not wrap to a new day or pause the schedule.

Reference: January 2, 2030, 10:00 AM in America/New_York, with preparation/commute/buffer of 30/60/15 minutes, yields stop 8:15 AM, departure 8:45 AM and arrival 9:45 AM. Changing commute to 75 yields 8:00/8:30/9:45. A January 2, 12:30 AM commitment yields stop January 1 at 10:45 PM, departure January 1 at 11:15 PM, arrival January 2 at 12:15 AM.

## Proposed product policies

These explicit defaults make the future acceptance plan reviewable; they are design decisions rather than instructor requirements or findings from a tested GymLog build.

- Starting requires a valid plan and a successful initial save. Reload restores an existing active session instead of opening an empty start form. A new session starts only after explicit completion/cancellation of the previous one.
- Scheduling phases derive from time. Actual workout finish, preparation completion, departure and arrival are separately recorded optional confirmations. A missed deadline remains visible; no automatic set completion or fabricated departure occurs.
- A session remains active through the transition. Finishing exercise closes the workout portion but retains departure alerts. Explicitly finishing the transition or cancelling closes the active session while preserving its recorded work in history; cancellation is labeled separately.
- Repetitions are positive whole numbers. Lifted load is finite and nonnegative; zero supports body-weight/unloaded sets. Body weight is finite and positive. Store the chosen kg/lb unit with each measurement; do not mix raw values from different units in a chart. No calorie, strength or health prediction is required.
- Local dates/times use the scheduling timezone captured for the plan. Reject nonexistent daylight-saving times. For a repeated fall-back time, require an explicit offset choice before saving; the existing LeaveBy parser does not yet provide that choice. Once resolved, changing the device timezone must not move a saved deadline.
- Preparation and commute may be zero. At coincident deadlines, show the most urgent current action and one combined message; do not replay every intermediate alert.
- Navigation cannot pause the schedule. Only a validated plan edit changes deadlines; an invalid edit leaves the saved schedule and logs intact.

## Deferred scope

Accounts, cloud sync, background push, guaranteed lock-screen/background alarms, social/buddy messaging, wearable integrations, live transit, calendar sync, automatic workout programming, nutrition/calories, AI coaching and final branding are deferred. No service worker, authentication service, external API, database dependency or deployment is added in Milestone 1.

IndexedDB is a proposed persistence mechanism, not a backup guarantee: browser-profile clearing can remove local records. Full offline installation/caching and export/import are separate future decisions. Cross-origin migration from the original LeaveBy deployment or any GymLog store is not assumed.

## Evidence and next implementation boundaries

Success later requires a tested flow from schedule → persistent session → completed-set logging → preparation/departure feedback → recoverable history. The [acceptance checklist](ACCEPTANCE.md) defines observations needed; none of those new product cases is marked passed in Milestone 1. Obtain and inspect the actual GymLog source, if available, before promising source-level reuse or migration. Keep human evaluation and course submission status separate from automated verification.
