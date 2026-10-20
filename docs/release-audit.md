# LeaveBy pre-deployment audit

Audited October 19, 2026 (America/New_York). Baseline remote commit: `028d0bab70217422730a124b03e35416d464382c`.

## Decision

**Application:** core MVP checks pass; suitable for a prototype deployment once the Vercel connection works. This is not an unconditional security guarantee or a claim that all browser cases were exercised.

**Course submission:** Needs revision / evidence completion. The functioning app is only one part of Project 1. Missing research/design/process/presentation evidence is listed below and was not invented.

**Deployment update:** Initial access blockers were resolved after this audit. Project `leaveby` was created in team Rayhanson and deployment `dpl_AFcg2HsEdxZYUhFdiHXVV9jaPSHT` reached READY from the audited commit `ca1783897df844561d2dedf56eaaafca7d33119a`. Live URL: https://leaveby-mu.vercel.app. Vercel fetch returned 200 with the app page; this authenticated-capable fetch does not verify anonymous access. No custom-domain/DNS changes were made. Historical findings below describe the pre-deployment audit state.

## Sources and coverage

Read the current tracked application, configuration, tests, research, interviews, specs, design notes, skills, templates and progress documentation. Checked local Markdown references, decoded the three design PNGs and inspected the clean wireframe PDF. The supplied instructor ZIP is intact and contains a README plus its enclosing directory; it is not an archive of the student's application. Its course README overlaps the syllabus; the current Notion pages take priority.

Cross-checked the duplicated Notion course overview, syllabus, Project 1 brief and Classes 1–7. Links are in the source index below. The overview's dated announcement says no class October 13. Class 7 is dated October 20 and lists status updates, MVP scoping, peer feedback, Vercel deployment and reflection. Its content and Class 6's template filenames match the earlier check; no new exact submission deadline is shown.

Limits: one alias block in the overview is not expanded; Class 6 attachment bodies and the recording cannot be compared through this connector. The saved templates remain the earlier screenshot transcriptions. No claim is made to have rewatched lecture videos, inspected the live Miro boards, or byte-compared attachment versions.

## Application cases

| Case | Evidence and outcome |
| --- | --- |
| Clean setup | `npm ci` succeeded from the lockfile. |
| Standard example | Automated: future 10:00 AM commitment, 30 preparation, 60 commute, 15 buffer → 8:15 AM stop, 8:45 AM departure, 9:45 AM arrival. User screenshot also shows these results. |
| Edit/recalculate | Automated 75-minute commute → 8:00 AM stop and 8:30 AM departure, unchanged arrival. User reported the browser edit/recalculate check working. Form state retains the five inputs. |
| Midnight crossing | Automated: 12:30 AM commitment with 30/60/15 → previous-day 10:45 PM stop and 11:15 PM departure; 12:15 AM arrival. Rendering code explicitly shows a date when the day differs. |
| Zero durations | Automated: explicit zeros accepted; stop, departure and arrival coincide with commitment. |
| Invalid durations | Automated blanks, negatives, fractions, text, exponent notation, unsafe integers and out-of-range arithmetic rejected. Errors remain beside fields. |
| Invalid/expired date and time | Automated missing values, impossible date and at/past-current-time commitment rejected. Recalculation calls validation with a fresh current time. |
| Passed workout stop | Automated future commitment with past stop produces visible results plus the PRD warning. The warning is evaluated when calculating; no live countdown is in scope. |
| Daylight saving | Nonexistent spring-forward local time rejected in the America/New_York acceptance test. Fall-back ambiguous times use the JavaScript local-date choice; this remains an explicit PRD limitation. No cross-time-zone planning is offered. |
| Input preservation | Calculation does not mutate source values; the React parent retains inputs during result/edit transitions. Invalid submission stays in the form. |
| Keyboard/accessibility | Source inspection: visible labels, associated errors, live feedback, stable focus callbacks, semantic headings/time/definition-list markup, 48-pixel controls. Full keyboard and assistive-technology review not completed. |
| Responsive display | Single bounded column with flexible width and phone padding. User desktop screenshots display the form and results. Phone-width visual review remains unverified. |
| Persistence/privacy | One plan in React memory; refresh resets it. No accounts, API requests, database, analytics or transit lookup in the app code. |
| Build quality | Eight acceptance tests, ESLint, TypeScript through production build, and optimized build passed. |
| Hydration warning | User screenshot shows extra Immersive Translate/Grammarly attributes on the document. Extension mutation is the supported explanation; a clean-browser retest is still needed. No blanket warning suppression added. |

Browser automation remains limited: the managed preview supervisor passes unsupported Next.js startup flags, and the connected browser tool lacks an originating browser context. User-provided browser evidence is distinguished from automated tests throughout.

## Dependency and repository checks

- Production dependency audit (`npm audit --omit=dev`): zero reported vulnerabilities at audit time.
- Full dependency audit: five high-severity package entries along one development dependency chain: eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces 3.0.3. These are related entries, not five independent app vulnerabilities.
- Advisory: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), nested-pattern stack exhaustion. The registry's latest braces version is 3.0.3; the advisory lists no patched version. This app does not accept user glob patterns. Keep tracked as development tooling risk; do not apply npm's suggested major framework-lint downgrade blindly.
- npm reports ESLint 9 as unsupported. A tooling migration needs separate compatibility review; no untested major dependency upgrade is included in this release.
- Targeted scan of tracked files found no matches for the tested private-key/GitHub-token/AWS-key/OpenAI-style-key patterns. This is a pattern scan, not proof that every possible secret is absent. Environment files and build/dependency output are ignored.
- The GitHub repository is public. There is no application-wide LICENSE. The MIT file in docs/licenses applies to shadcn/UI source only. No license or visibility change was made.
- Original templates, research and interview content remain preserved. Build/runtime dependencies are locked. No database migration or environment secrets are needed for this MVP.

## Fixes made during audit

1. Added in-code attribution to copied Input, Button, shared class helper and retained Next.js scaffold code, following the syllabus rule for borrowed code longer than four lines.
2. Declared native light/dark color-scheme support so browser date/time controls can match the dark background. This was prompted by low-contrast icons in the user screenshot; the new icon rendering still needs a visual retest.
3. Changed two broken rough-sketch PDF links to the existing PNG. The omitted PDF is intentional; it was not recreated or treated as a submission/build blocker.
4. Updated the template index to the current duplicated Class 6 link.
5. Recorded the user's successful initial calculation and reported editing test without claiming peer testing or code comprehension.

## Course deliverables and rubric mapping

| Area | Current evidence | Gap / grade implication |
| --- | --- | --- |
| Research process — 20% | Problem statement, What/How/Why, interview questions, three interview records and synthesis. All three records identify interviewees as outside the immediate friend group. HMW and chosen direction exist in synthesis. | Separate research plan, affinity map and persona not found in this repo. Insights and POV are partly expressed in prose rather than fully traceable named artifacts. The recorded claims are not independent verification that interviews occurred. |
| Design/rationale — 20% | Three-state wireframe PNG, clean PDF, flow notes, MVP and research-to-design mapping. | Norman vocabulary/rationale is thin; needs the student's specific explanations. Class 5 says Figma conversion is optional, while the overall Project 1 brief lists Figma wireframes. Treat this as a source conflict to clarify for final submission, not an automatic failure of Class 5. |
| Technical comprehension/defense — 25% | Small modules, documented calculation order, incremental Git history and reproducible tests. | Live defense and the student's actual understanding are not established by generated code or automated tests. |
| Functionality/deployment — 15% | Core flow passes checks; user confirms initial and edit flow. | Public deployment is still absent. Phone, keyboard, error-path and clean-browser checks remain to be completed. |
| Process documentation — 10% | PRD precedes build; templates, instructions, skills, progress, build log and iterative commits exist. | Log covers recent steps and observed assistant activity; it does not replace the student's full reflective prompting log. Earlier build prompts/reflections and current student understanding need evidence. |
| Creativity/effort — 10% | Narrow research-linked transition planner with distinct stop/departure concepts. | Peer findings, design iteration and reflection still need to be recorded after real testing. No score is predicted. |
| Routine audit | Earlier course history refers to a routine-audit document; What/How/Why records relevant routine observations. | Original routine audit/self-log not found in this repo. This does not establish that it was never supplied elsewhere. |
| Presentation | Presentation directory is a placeholder. | Presentation and live Q&A preparation remain. |
| Tool wording | Project brief names GitHub Copilot Agent Mode; overview/syllabus also name Claude Code and describe AI tools more broadly. Actual assistance is recorded in the build log. | Do not assert that every named-tool requirement is met by this environment; confirm any tool-specific expectation if it matters to grading. |

No missing interviews, research results, reflections, student explanations or peer feedback were manufactured to fill these gaps.

## Deployment approach

Recommended setup: a separate Vercel project linked to `Rayhanson-Git/Harvey-Chowdhury-MTEC3200`, with repository root as the app root, Next.js framework detection, npm lockfile installation and `npm run build`. First verify a generated Vercel deployment URL, then attach a chosen subdomain, for example `leaveby.rayhanson.tech`. Use Vercel's returned DNS/verification instructions for the actual record. No DNS value is guessed here.

A subdomain gives the app an independent address while allowing a portfolio project entry to link to it. Hosting, domain naming and open-source licensing are independent decisions. Keeping the current public course repository does not require licensing all research/interview materials as open source. Leave licensing unchanged unless Harvey chooses it explicitly.

The connected account and GitHub integration have been repaired, and the Rayhanson team scope was verified before deployment. Deployment authorization came from Harvey’s explicit request. Custom-domain/DNS changes still await selection of the actual hostname and verified domain access.

## Course source index

- [Course overview](https://app.notion.com/p/a253d2939d2f838dbb81016da295cd4f)
- [Syllabus](https://app.notion.com/p/a8e3d2939d2f82919ea781690ef08aec)
- [Project 1](https://app.notion.com/p/09d3d2939d2f82168b7b010f3bd35894)
- [Class 1](https://app.notion.com/p/aa43d2939d2f824688f381ea3376b72b)
- [Class 2](https://app.notion.com/p/b6e3d2939d2f83929b0981215246b7d7)
- [Class 3](https://app.notion.com/p/c703d2939d2f836ebb1c01cc2f6f7ac8)
- [Class 4](https://app.notion.com/p/89e3d2939d2f82b2a5f48123bf8ba8c1)
- [Class 5](https://app.notion.com/p/2323d2939d2f8389be2e81baaf1a61c5)
- [Class 6](https://app.notion.com/p/9713d2939d2f825c9ee28126d1031619)
- [Class 7](https://app.notion.com/p/9073d2939d2f83498e9301afecd07211)
