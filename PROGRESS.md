# LeaveBy progress

Updated October 20, 2026 (America/New_York).

| Step | Status | Evidence / next action |
| --- | --- | --- |
| 1. Next.js foundation | Completed | Starter commit 137cf62; TypeScript and Tailwind installed. |
| 2. Run the starter | Completed | Assistant check passed; Harvey subsequently supplied a Codespaces screenshot showing LeaveBy loaded. |
| 3. Project setup | Completed | AGENTS.md, two project skills, shadcn manual configuration and component inventory added; lint, TypeScript, production build and both skill validators passed. |
| 4. Build first screen | Completed | First screen loaded in Harvey’s Codespace, confirmed by screenshot October 19. No completed interaction or peer test is inferred. |
| 5. Complete and test flow | In progress | Core calculation/result/edit flow implemented and automated checks passed; Harvey confirmed the core browser flow; remaining manual edge-case checks and peer testing remain; deployment and custom-domain HTTPS are verified below. |

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

## Vercel deployment — October 19, 2026

The connection and GitHub integration are now working. The authorized deployment succeeded:

- Team: Rayhanson (`team_McLOi8RvhigiilQftObY7ZJ9`)
- Project: leaveby (`prj_m7qKsy2AQxw9JO5BvFQQks6DRD9m`)
- Production branch: main
- Verified source commit: ca1783897df844561d2dedf56eaaafca7d33119a
- Deployment: dpl_AFcg2HsEdxZYUhFdiHXVV9jaPSHT; READY
- Live alias: https://leaveby-mu.vercel.app
- HTTP verification: Vercel fetch returned 200 with LeaveBy's form. This connector can use authentication bypass, so it does not establish anonymous public access.
- Runtime error/fatal log query returned no matching records; this static page does not necessarily emit runtime function logs.
- Default project protection remains enabled. Custom-domain/DNS changes and signed-out access verification remain pending. No claim of peer testing is made.

The earlier access blockers above are historical and resolved. Peer feedback, remaining manual cases and final course evidence still need completion.

## Custom-domain HTTPS — October 19, 2026

- Harvey connected leaveby.rayhanson.tech; Vercel reports verified domain and correct CNAME, misconfigured=false.
- Investigated a browser security warning. HTTPS initially failed; no certificate was returned in the team's certificate list, while HTTP initially served the page without upgrade.
- Requested a certificate scoped only to leaveby.rayhanson.tech. Vercel issued cert_WfM5a1P0ZIykhJzeUGOaYcZi with autoRenew=true.
- Subsequent HTTPS checks via ordinary Python urllib (default TLS validation) and the Vercel fetch connector both returned HTTP 200 with the LeaveBy page and strict-transport-security: max-age=63072000.
- The ordinary HTTPS request did not supply a Vercel bypass link or login cookie, providing HTTP-level anonymous access evidence. This does not establish full hosted browser interaction testing.
- Canonical link: https://leaveby.rayhanson.tech. The HTTP endpoint returned 308 with Location: https://leaveby.rayhanson.tech/. HTTPS and redirect checks pass; certificate validity does not establish whole-application security.

## Guided verification — October 20, 2026

Harvey reported four deployed-app checks as passed: the reference calculation; editing with all inputs preserved and a 75-minute commute; blank-commute validation followed by successful correction; and midnight crossing with dates distinguished. No peer testing is inferred. The proposed past-commitment browser check was not confirmed.

The assistant fetched the live app over HTTPS and received HTTP 200 with LeaveBy's form and HSTS. This connector can use an authentication bypass, so this request alone does not verify anonymous access.

The current GitHub calculation/validation source was executed in the orchestration JavaScript runtime after removing TypeScript-only declarations and annotations. Seven groups passed: reference times, edited commute/source preservation, midnight times/dates, zero durations, past-stop flag, invalid/excessive durations, and invalid/expired commitments. This was not a rerun of npm test, TypeScript, lint, production build or browser interaction. The local execution environment was unavailable; the America/New_York daylight-saving case was not rerun.

See [the updated checklist](docs/manual-check.md) for the remaining hosted browser checks and peer feedback. Step 5 remains in progress. Research artifacts, reflective process documentation and presentation/defense preparation remain open as listed in the release audit.

## Research organization — October 20, 2026

Added [research/README.md](research/README.md) as an index of the existing observations, problem statement, interview questions, Chris/David/Selina interview records, and synthesis sections. Linked the existing HMW question, brainstorming, chosen direction, design notes, MVP and PRD. The course README now links this index.

The index identifies coverage and remaining research documentation; it does not add new interview answers, personas, affinity-map findings or student reflection. Original research and interview files remain unchanged. Research-plan, affinity-map, persona and explicit insight/POV gaps remain open. Peer feedback remains on hold at Harvey's request.

Verification: checked linked repository paths against the current main tree and section targets against synthesis.md; read back the three documentation files after writing. No application code changed.

## Affinity map draft — October 20, 2026

Added [research/affinity_map.md](research/affinity_map.md): 20 paraphrased observation cards from the existing Chris, David and Selina interview answers, grouped into five themes. Each card links to its interview and identifies the source question. Interpretations are labeled for review, David's contrasting experience is retained, and the deadline-pressure cluster is identified as based on Selina's account.

The document explicitly dates this as an assistant-assisted retrospective analysis after the prototype build. Harvey has not yet confirmed the grouping or interpretations. Updated the research index to link the draft and replace its absent-artifact status with review pending. Original interview records remain unchanged; no new participants or outcomes were added.

Verification: checked 20 unique card IDs, source questions and links against the three current interview records; read back the map, research index and progress update. Insight statements, persona, explicit POV and remaining research-plan evidence still require completion/review. Peer feedback remains on hold.

## Insight statements draft — October 20, 2026

Added [research/insight_statements.md](research/insight_statements.md) with five retrospective interpretations covering delay across stages, commute predictability/buffer, routine trade-offs, existing stopping/preparation strategies and perceived deadline pressure. Each links to affinity cards and interview answers, distinguishes evidence from design implications, and records limits. The fifth is labeled as a candidate based only on Selina's account; David's contrasting experience remains explicit.

Checked the grouping and statements against the recorded source answers. Harvey's review is pending for both the map and insights; no student approval, app effectiveness or peer feedback is inferred. The research index now links the insights and records this status.

Verification: reviewed source/card references and read back the three documentation files after writing. Original interviews, synthesis and application code remain unchanged. Persona, explicit POV, remaining research-plan evidence, reflection/prompting log, presentation/defense and peer feedback remain open.
