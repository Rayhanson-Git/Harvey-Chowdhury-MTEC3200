# LeaveBy progress

Updated October 19, 2026 (America/New_York).

| Step | Status | Evidence / next action |
| --- | --- | --- |
| 1. Next.js foundation | Completed | Starter commit 137cf62; TypeScript and Tailwind installed. |
| 2. Run the starter | Completed | Assistant check passed; Harvey subsequently supplied a Codespaces screenshot showing LeaveBy loaded. |
| 3. Project setup | Completed | AGENTS.md, two project skills, shadcn manual configuration and component inventory added; lint, TypeScript, production build and both skill validators passed. |
| 4. Build first screen | Completed | First screen loaded in Harvey’s Codespace, confirmed by screenshot October 19. No completed interaction or peer test is inferred. |
| 5. Complete and test flow | In progress | Core calculation/result/edit flow implemented and automated checks passed; Harvey confirmed the core browser flow; remaining manual edge-case checks, peer testing and Vercel deployment remain. |

## Course source check

The duplicated Class 6 page still lists AGENTS-template.md, PRD-template.md, build-screen/SKILL.md and no class the following week. Attachment contents cannot be compared through the connector; repository templates are the earlier screenshot transcriptions.

Class 7 (October 20) lists status updates, scoping remaining MVP, peer feedback, Vercel deployment and reflection. It supplies no exact submission deadline.

Sources: [Class 6](https://app.notion.com/p/9713d2939d2f825c9ee28126d1031619), [Class 7](https://app.notion.com/p/9073d2939d2f83498e9301afecd07211), [Project 1](https://app.notion.com/p/09d3d2939d2f82168b7b010f3bd35894).

Project 1 requires a prompting log and code defense. Student explanations and manual testing must be recorded only when actually supplied; no understanding or testing is inferred.

## Step 3 verification

Lint, TypeScript, production build, both skill validators and diff checks passed. No LeaveBy feature or deployment is claimed.

## Step 4 verification

- Production build (including TypeScript) and ESLint passed.
- 13 input-validation scenarios passed: valid plan, explicit zeros, six invalid-duration formats, missing date/time, past commitment, invalid calendar date and unrepresentable duration. The source input object remains unchanged.
- React review: client state is confined to the form; no unnecessary effects, stable field keys, visible associated labels, error descriptions, live status feedback and first-error focus.
- Layout uses a single bounded column, flexible width, phone padding and 48-pixel input/button heights. Visual/keyboard interaction review remains unverified.
- Browser QA could not run: the managed preview supervisor supplies `--host` and `--strictPort`, which Next.js does not accept. No app configuration was changed to compensate.
- Calculate times currently validates and acknowledges the inputs. It does not calculate action times or navigate to a result yet. No persistence or deployment was added.
- Next action: Harvey compares this screen with Design/LeaveBy_Wireframes.png, then step 5 connects calculations, results and editing.

## Step 5 — core flow

- Added validated timestamp calculations: commitment minus buffer gives arrival; minus commute gives departure; minus preparation gives workout stop.
- Results show the stop first, departure, duration breakdown, arrival and commitment. Dates appear when an action falls on a different day.
- Edit plan preserves all five inputs; Recalculate revalidates against the current time. Invalid edits stay in the form. Past workout stops show the PRD warning while retaining results.
- Keyboard focus moves to the result heading, editing heading or first invalid input. Focus callbacks stay stable while typing.
- Eight reproducible acceptance tests cover the reference example, edited commute, midnight crossing, zero durations, past-stop warning, invalid durations, invalid/expired commitments and a nonexistent daylight-saving local time. Run `npm test`.
- Production build/TypeScript and lint passed. Automated checks do not establish browser interactions or peer testing.
- Vercel inspection: the connected account returned no matching repository project, no project matching mtec3200 and no teams. No deployment was created or claimed.
- Manual checklist: [docs/manual-check.md](docs/manual-check.md). Existing preview-service limitation still prevents internal browser QA.

## Pre-deployment audit — October 19

See [docs/release-audit.md](docs/release-audit.md) for case-by-case results and source cross-checks. Harvey supplied a screenshot of correct results and reported the edit/recalculate check working. The repository passed a fresh locked install, tests, lint and production build. Attribution comments, sketch references and native dark controls were corrected. Production npm audit is clean; full audit retains the unpatched braces development-tool chain advisory.

Deployment was authorized but remains blocked: Vercel returned no projects/teams and its account endpoint returned 404 User not found. No deployment or DNS changes occurred. Prototype build readiness does not establish final course submission readiness; the audit lists missing research/process/presentation evidence.
