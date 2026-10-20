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

## October 19, 2026 — repository and course audit

- Request: audit the whole repository and updated Notion before deploying; advise on domain/subdomain versus open-source options.
- Cross-checked course overview, syllabus, Project 1 and Classes 1–7; inspected application, tracked course materials and links, targeted secret patterns, assets, installation, tests and dependency advisories.
- Fixed source attribution comments, native control color scheme, missing-PDF references and the template source link. Preserved original research/templates and the intentionally omitted PDF.
- Results and limits are in release-audit.md. No student research or reflections were invented. Deployment is authorized but blocked by Vercel account lookup failure; no hosting or DNS mutation occurred.

## October 19, 2026 — deployment

- Continued the authorized deployment after Vercel connection and GitHub integration were repaired.
- Created/reused project leaveby in the verified Rayhanson team; deployed audited main commit ca1783897df844561d2dedf56eaaafca7d33119a.
- Deployment dpl_AFcg2HsEdxZYUhFdiHXVV9jaPSHT reached READY in production. Vercel fetch returned HTTP 200 and the LeaveBy form at https://leaveby-mu.vercel.app.
- Default protection was preserved. Anonymous access, custom domain, full hosted interaction testing and peer tests remain unverified/pending.
