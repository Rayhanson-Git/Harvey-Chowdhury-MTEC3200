<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Instructions

Read this file before every task.

## About This Project

LeaveBy works backward from a fixed commitment to show when to stop a workout and leave. See `PRD.md` for full details.

## Stack

- Next.js (App Router), React
- Tailwind CSS
- shadcn/ui (new-york, neutral; manually configured)
- Data: one plan in React memory; no database or persistence
- APIs: none

## Commands

- Run: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Code Style

- Use TypeScript.
- One component per file.
- Put reusable components in `components/`.
- Use Tailwind classes. No separate CSS files. Prefer Tailwind's spacing utilities over arbitrary pixel values for spacing and sizing; reserve arbitrary values for custom typography or layout geometry that has no suitable utility.
- Use clear, descriptive names.
- Put sections into their own component, so that code is easy to read from a top-level and put them inside `components/`.

## Rules

- Don't add dependencies without asking. Components from shadcn/ui are the exception.
- Use components from shadcn/ui before building new ones.
- Add shadcn/ui components as needed. List each one in `docs/components.md`.
- Build one screen at a time.
- Read `PRD.md` before adding any feature. Don't add features that aren't in it.
- Don't change working screens unless asked.
- Never commit `.env.local` or API keys.
- Update `PROGRESS.md` after each task.

## How to Talk to Me

- I am a student with limited coding knowledge. Explain things to me knowing my level.
- Keep explanations short.
- Tell me which files you touched.
- Stop after each task so I can test it manually.

## Project references and skills

- Read `Design/README.md` and `Design/LeaveBy_Wireframes.png` before screen work. Existing research stays in `research/`; design assets stay in `Design/`.
- Use `.github/skills/build-screen/SKILL.md` for a screen and `.github/skills/verify-plan/SKILL.md` for calculation and validation changes.
- Keep original instructor templates in `templates/` unchanged.
- Use local date/time and full dates for calculations, not time strings alone. Deduct buffer once. Show dates for previous-day results.
- Keep user-facing errors beside fields and preserve inputs. Use visible labels, keyboard focus, and text feedback.
- Explain changes and validation without claiming that Harvey manually tested or understood something unless he confirms it.
