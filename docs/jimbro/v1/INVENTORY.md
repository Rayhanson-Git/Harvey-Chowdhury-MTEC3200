# Original project inventory v1

Recorded October 20, 2026. Baseline: `4af9f2bc004bb1a0f1d8649991bf41cea649e90c`; tree: `84f0e990a5bc3f79cb87fa46b445717522c1cf1b`.

## Repository and preservation evidence

The configured workspace was empty. The existing course checkout at `/Users/rayhanson/Documents/School/Harvey-Chowdhury-MTEC3200` was clean on `main` at `1dee74521095cfbd7c8e1498c070860bb79a29eb`, ahead of its stale local origin/main by two commits. It did not contain the requested baseline or branch. Its files, index and branch were left untouched.

The GitHub connector confirmed remote `main` and `revamp/foundation` both at the requested baseline. Terminal GitHub access failed with `Could not resolve host: github.com`. A separate checkout was recovered in this workspace's `JimBro/` directory using locally available Git objects and connector-fetched blobs. Every recovered blob, all baseline trees and the original commit were verified against their Git object IDs. The recovered commit retains its original author, message and parent ID; no new commit was made. The baseline is marked as a shallow boundary because intervening history was not downloaded.

The new checkout uses `revamp/foundation`, tracking `origin/revamp/foundation`. Its local `main` retains the copied old checkout's `1dee745` pointer; remote-tracking `origin/main` records the verified remote baseline. No existing local or remote `main` branch was moved. Do not confuse the stale copied local `main` with current GitHub `main`.

Before documentation edits, staged/unstaged/untracked status was clean and all 77 tracked files matched baseline blob IDs. [baseline-files.csv](baseline-files.csv) records each original file's path, size, Git blob SHA-1 and content SHA-256. It covers binaries as well as text. `AGENTS.md` and `PROGRESS.md` are the only permitted changes to those original files in this milestone; their baseline versions remain recoverable from the verified commit.

## Tracked material

| Location | Files | Existing purpose | Preservation / JimBro use |
| --- | ---: | --- | --- |
| Root | 12 | LeaveBy PRD, README, progress, instructions, package/configuration files and tracked metadata | Keep original PRD/README and configuration; update branch instructions/progress only |
| `research/` | 12 | Routine observations, method, interview script, synthesis, affinity map, insights, persona and POV | Preserve dated evidence and retrospective labels; no new claims |
| `interviews/` | 3 | Chris, David and Selina records | Preserve participant accounts verbatim |
| `Design/` | 6 | Rough sketches, clean wireframes, design flow/rationale and placeholder | Preserve original PNG/PDF assets and links |
| `Specs/` | 2 | Original LeaveBy MVP and placeholder | Retain original scope as historical specification |
| `Presentation/` | 8 | PPTX, PDF, demo/defense guidance, screenshots and placeholder | Preserve coursework and media |
| `templates/` | 4 | Instructor templates and their provenance | Preserve exactly |
| `docs/` | 10 | Component list/license, build/prompting logs, reflection, verification, release audit and submission/peer checklists | Preserve original results, attribution and pending peer sheet |
| `.github/` | 3 | Existing screen-building/calculation-verification skill files | Preserve; no skill changes in this task |
| `app/` | 4 | LeaveBy route, layout, styling and icon | No changes |
| `components/` | 5 | Form, result, field, button and input | No changes |
| `lib/` | 2 | Plan validation/calculation and class-name helper | Reuse calculation behavior later; no changes now |
| `public/` | 5 | Scaffold SVG assets | No changes |
| `tests/` | 1 | Eight existing calculation/validation tests | Run without modifying tests |
| **Total** | **77** | **Original tracked baseline** | **75 unchanged; two authorized documentation updates** |

Counts include placeholders and tracked metadata, rather than only substantive deliverables. They exclude this new versioned folder and ignored generated output.

## Available behavior and source gaps

- LeaveBy source: form → calculated results → preserved-input editing; one in-memory plan; full-date calculations; field errors; previous-day dates; past-stop warning. The eight tests cover calculation and validation, not persistence or workout logging.
- GymLog source: absent from this baseline. No exercise database, workout logger, history store, migration source or GymLog package was found in the tracked tree. The user's description establishes the intended integration, not an audited implementation. No original GymLog files have been copied, renamed, deleted or claimed preserved here. Import/source review belongs to later work if those files become available.
- Peer feedback: the user reports feedback motivated the unification. The baseline's `docs/peer-feedback.md` still says pending and supplies no new participant observations. Preserve that record; do not invent names, quotes or test outcomes.
- Instructor material: retain `templates/`, root PRD and existing submission evidence. This task does not establish a new deadline or approval of an expanded assignment scope.
- Dependencies: no `node_modules` in the recovered checkout. Package manifest and lockfile remain unchanged; no install was run.

## Preservation rules

Add JimBro planning under this version folder. Do not move coursework into an archive, replace rough sketches, repair intentionally retained artifacts, rewrite interviews, remove attribution or relabel historical passes as fresh test results. Preserve originals in place and use the baseline manifest for final comparison. No changes to hosting, domains or production aliases are part of Milestone 1.
