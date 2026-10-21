# JimBro acceptance checklist v1

Version 1.0 · October 20, 2026. Requirements: [PRD](PRD.md). Decisions: [architecture](ARCHITECTURE.md). Results: [verification](VERIFICATION.md).

## Milestone 1 gates

- [x] Inspect existing changes before edits; preserve the old clean course checkout.
- [x] Verify exact baseline `4af9f2bc004bb1a0f1d8649991bf41cea649e90c` and remote branch; work on `revamp/foundation` without moving `main`.
- [x] Read `AGENTS.md` and root `PRD.md` completely.
- [x] Inventory all 77 original tracked files and record baseline content hashes, including binary assets.
- [x] Preserve original coursework, source, tests, package manifest/lockfile and instructor templates. Existing file edits are confined to branch instructions/progress.
- [x] Record missing GymLog source and absence of detailed new peer evidence without inventing either.
- [x] Create versioned JimBro requirements, architecture decisions and future acceptance scenarios.
- [x] Update branch instructions and `PROGRESS.md`, keeping historical verification separate.
- [x] Attempt existing tests, lint and build; record failures/limits as well as supplemental test results.
- [x] Make no feature changes, dependency installations, commits, pushes or deployments.
- [x] Check the final diff, document links and original-file hashes.
- [ ] Obtain successful standard `npm test`, lint and build results in an environment with the locked dependencies already present. Current environment is blocked; do not claim this gate passed.

Milestone 1 documentation can be complete while standard verification remains blocked. The final box is an unresolved verification gate, not authorization to install dependencies or implement another milestone.

## Future product scenarios — all pending

Every case below is **not implemented / not verified for JimBro**. Existing LeaveBy calculation tests cover a subset of P-02/P-03 only and do not pass the broader product scenarios.

| ID | Requirement | Setup / action | Expected observation |
| --- | --- | --- | --- |
| P-01 | JB-01, JB-04 | Enter a valid future plan; start; navigate from logger to history and back | One session ID; start saved once; logger becomes main view; dock stays visible and opens the same plan |
| P-02 | JB-02, JB-03 | Use Jan 2, 2030 10:00 AM America/New_York and 30/60/15; edit commute to 75 | Stop/leave/arrival 8:15/8:45/9:45, then 8:00/8:30/9:45; buffer once; same session/sets; schedule revision changes |
| P-03 | JB-02 | Try blank, negative, fractional, text/unsafe durations, missing/past commitment; explicit zeros; Jan 2 00:30; spring-forward gap and fall-back repeat | Field errors preserve inputs and saved plan; zeros accepted; prior-day dates shown; nonexistent time rejected; repeated time requires explicit offset |
| P-04 | JB-03, JB-07 | With an injected clock, advance to just before, exactly at and after S, D, A and C; repeat with equal deadlines | Correct current phase and labeled next deadline; zero/overdue text; combined guidance for simultaneous boundaries; no inferred real-world actions |
| P-05 | JB-01, JB-06 | Save sets, reload in the same origin/profile and resume | Same active ID, sets, plan and label; countdown derived from current time, not a stored stale value; no duplicate session |
| P-06 | JB-03, JB-07, JB-08 | Hide/suspend across S and D, then return; reload again; edit plan to a deadline already past | One current-phase summary; no stale alarm sequence or drift; no false closed-app promise; persistent text remains; schedule revision controls deduplication |
| P-07 | JB-04, JB-12 | Use keyboard/touch at 320px and desktop widths, with mobile keyboard shown; expand/collapse schedule | No horizontal page overflow or covered save control; visible focus/labels; readable dock; no focus loss or new session on navigation |
| P-08 | JB-05 | Log a completed set, double-submit/retry, correct it, remove a mistaken entry and leave an unfinished draft | One entry per stable ID; explicit reps/load/unit; edits affect intended entry; draft never counted; existing logs survive schedule edits |
| P-09 | JB-01, JB-06 | Two tabs start simultaneously, then submit competing edits to one session | One active pointer; second start resumes; stale revision cannot overwrite newer sets/plan; explicit conflict/reload path |
| P-10 | JB-06 | Deny storage, simulate quota/transaction failure, corrupt a record and encounter a newer schema/blocked upgrade | No false saved message; input retained for retry; no destructive reset or silent memory-only success; clear recovery/loading states |
| P-11 | JB-07 | Finish exercise early; reach departure; confirm actual departure/arrival; complete or cancel transition | Departure guidance remains after workout finish; actual timestamps require user action; completion clears active pointer and disables alerts; history remains, with cancelled state distinguished |
| P-12 | JB-08, JB-12 | Cross a milestone during set entry; mute/block audio; inspect screen-reader announcements; open a second visible tab | Phase text communicates action without color/sound alone; input is retained; audio failure has fallback; no per-second announcements; at most one foreground alarm per alert key |
| P-13 | JB-09 | Save completed work on different local dates/day labels; include an empty start and cancelled session | History reflects recorded dates, sets and labels; empty start is not a completed workout; cancelled state is clear; changing device timezone does not silently redate old entries |
| P-14 | JB-10 | Search/filter catalog, log an exercise, then rename its catalog entry | Stable exercise ID and categories; source recorded; set history retains original name snapshot; no fabricated imported GymLog library |
| P-15 | JB-11 | Record positive kg/lb body weights on chosen dates; try zero/negative/invalid input | Dated measurements preserved with units; invalid input rejected; body weight stays separate from lifted load; mixed units normalized explicitly or shown separately |
| P-16 | JB-03 | Change the device timezone and wall clock while a saved session is active | Saved epoch deadlines unchanged by timezone; plan timezone identified; wall-clock changes recompute remaining time without pretending a trusted server clock; editing requests timezone reconfirmation |

Before a future milestone is called complete, attach actual automated/browser evidence to its cases. Human peer feedback needs an actual participant record and remains separate from these checks. No instructor deadline or expanded-coursework approval is inferred from this checklist.
