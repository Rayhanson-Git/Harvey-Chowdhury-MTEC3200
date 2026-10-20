# LeaveBy progress

Updated October 19, 2026 (America/New_York).

| Step | Status | Evidence / next action |
| --- | --- | --- |
| 1. Next.js foundation | Completed | Starter commit 137cf62; TypeScript and Tailwind installed. |
| 2. Run the starter | Completed (assistant check) | Previous session recorded HTTP 200 and starter content. Harvey's Codespace/browser check is not confirmed. |
| 3. Project setup | Completed | AGENTS.md, two project skills, shadcn manual configuration and component inventory added; lint, TypeScript, production build and both skill validators passed. |
| 4. Build first screen | Ready for manual review | Entry form built from the first wireframe, with five fields, library components and inline validation. Button checks inputs; timing results remain step 5. |
| 5. Complete and test flow | Not started | Calculation, results, editing, validation, peer testing and Vercel deployment remain. |

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
