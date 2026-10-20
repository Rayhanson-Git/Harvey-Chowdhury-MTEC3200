# Build activity log

This records observed assistant activity, not a student-authored reflection or evidence of student comprehension.

## October 19, 2026 — Step 4

- Request: “go to step 4”.
- References: PRD.md, AGENTS.md, instructor-derived build-screen skill, Design/README.md and first wireframe.
- Changes: replaced starter home page with the entry screen; added official shadcn Input and Button sources, form state, field errors and validation; changed page metadata; documented the component inventory and progress.
- Validation: production build/TypeScript, lint and 13 input scenarios passed. Browser review was blocked by preview-service startup flags incompatible with Next.js.
- Limitation: submit validates inputs only. Calculation, results and edit flow remain step 5.
- Student review/understanding: not yet recorded. Harvey should review the screen and be able to explain that page.tsx arranges the screen, plan-form.tsx retains inputs and handles submission, plan-field.tsx connects labels/errors to inputs, and plan-input.ts checks values.

## October 19, 2026 — Step 5 core flow

- Request: “okat, go”, following the explanation of calculation, results and editing.
- Changes: implemented timestamp calculations, semantic results display, preserved-value editing and recalculation, invalid/past-time handling and focus transitions. Added reusable automated acceptance tests and a manual checklist.
- Validation: eight acceptance tests, lint and production build/TypeScript passed. Browser interaction review and peer feedback are not claimed.
- Deployment inspection: connected Vercel account returned no matching project or teams; deployment remains pending.
- Student review: prior screenshot establishes that the first screen loaded in Codespaces. It does not establish testing of the new flow or comprehension of the calculation code.
