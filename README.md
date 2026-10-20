# MTEC 3200 — Product Design & Prototyping

**Student:** Harvey Chowdhury  
**Semester:** Fall 2026  
**Instructor:** Dora Do

This repository is the course workspace for MTEC 3200. It is organized to hold weekly deliverables, Project 1 research/design/build files, and course submission materials as they are completed.

The current project direction is LeaveBy, a lightweight planner for the transition between a workout and a fixed class or work commitment.

## Live app

[Open LeaveBy](https://leaveby-mu.vercel.app) · [Vercel dashboard](https://vercel.com/rayhanson/leaveby)

Production build is deployed. Custom-domain configuration and signed-out access verification are pending.

## Run the app

The Next.js starter uses React, TypeScript, Tailwind CSS, and the App Router.
Use Node.js 20.9 or newer. From the repository root:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`, or use **Open in Browser** for port 3000 in Codespaces.
The home page supports entering a plan, calculating action times, viewing results, and editing/recalculating. Values stay in memory until reload.

- `app/page.tsx`: entry-screen layout
- `app/layout.tsx`: shared page layout
- `app/globals.css`: global styles and Tailwind
- `npm run build`: production build check
- `npm run start`: serve the production build
- `npm run lint`: lint the source

See [PRD.md](PRD.md) for the LeaveBy requirements and [templates/](templates/) for the Class 6 instructor templates.

## Repository Structure

```text
.
├── README.md
├── PRD.md
├── app/
├── public/
├── templates/
├── package.json
├── research/
├── interviews/
├── Design/
├── Specs/
└── Presentation/
```

### research/

For research and synthesis work from Project 1.

Files expected by the course as work is completed include:

- `routine_audit.md` or the saved routine-audit artifact
- `what_how_why.md`
- `problem_statement.md`
- `research_plan.md`
- `interview_script.md`
- `synthesis.md`
- affinity-map documentation
- insight statements
- persona
- point-of-view statement
- How Might We questions

### interviews/

For individual interview notes.

Class 2 and Class 3 require **3–5 interviews** saved as Markdown files in an `/interviews` folder.

At least half of the interviewees should be outside the immediate friend group.

### Design/

For design documentation created later in Project 1.

Expected materials include:

- user flow
- low-fidelity wireframe documentation
- design rationale

Figma files can remain in Figma and be linked from the relevant documentation when needed.

### Specs/

For the functional specification and other written build specifications required later in Project 1.

### Presentation/

For Project 1 presentation materials when they are created.

## Course Progress — Day 1 Through Current Class

### Class 1 — Course Intro & Design Thinking Foundations

Course work introduced:

- Finish and save the routine audit.
- Continue observing real friction in the daily routine.
- Choose the top 3 candidate problems for Project 1.
- Line up 3–5 people to interview.
- Set up Figma and GitHub accounts.
- Watch the IDEO Shopping Cart video.
- Email the instructor the GitHub repository link.

### Class 2 — GitHub, Problem Framing & Interview Prep

Repository work assigned:

- Add `what_how_why.md` to `/research`.
- Add `problem_statement.md` to `/research`.
- Conduct 3–5 interviews.
- Save interview notes as Markdown files in `/interviews`.
- Commit all files.

The current Notion assignment lists `problem_statement.md` twice. This repository does not invent a replacement file for the duplicate entry.

### Class 3 — Problem Framing Continued & Dev Environment Bootcamp

The weekly assignment repeats the Class 2 repository requirements:

- research activity files in `/research`
- 3–5 interview Markdown files in `/interviews`
- all work committed to GitHub

### Class 4 — Synthesis & Brainstorming

Current weekly work:

- Commit class synthesis notes as `synthesis.md`.
- Watch *It's not you. Bad doors are everywhere*.
- Read Chapters 1–3 of *Don't Make Me Think*.
- Arrive at the next class with a chosen direction ready for design work.

### Class 5 — MVP & Wireframes

- [MVP definition](Specs/MVP.md)
- [Wireframe flow and notes](Design/README.md)
- [Three-screen rough sketches](Design/LeaveBy_Rough_Sketches.png)
- [Clean wireframe reference](Design/LeaveBy_Wireframes.pdf)

The MVP and digital wireframes follow the transition-planner direction selected in the Class 4 synthesis. The assigned Figma beginner tutorial is complete, as confirmed by Harvey. The rough-sketch PNG is available; the omitted rough-sketch PDF is intentional. No missing PDF is treated as a build blocker.

## Project 1 — Everyday Tool

Project 1 is a solo project. The repository will eventually contain:

- research plan
- interview script
- raw research notes
- affinity map
- insight statements
- persona
- point-of-view statement
- How Might We questions
- specifications
- research and design documentation
- working prototype code
- deployment information
- presentation materials

Only completed or supplied artifacts should be added.

## Project 2

Project 2 is a required pair project and requires both partners to work in a shared repository. A separate shared repository should be created when pairs are assigned rather than pre-building Project 2 content here.

## Current Status

**Repository foundation:** Ready  
**Assignment files:** Research and interview files present; MVP and digital wireframes prepared  
**Current course stage:** Step 5 — core flow ready for manual testing
**Build/deployment:** Production deployment READY; custom domain and peer testing pending
**Submission:** Not confirmed


## Workflow Collaboration

**Donna (OpenClaw)** is the designated AI workflow assistant for automation, file management, repository management, proofreading, approved submission handling, and automated website deployments when needed. Submission and deployment actions remain subject to Harvey’s approval.

## Build workflow

Read `AGENTS.md` and `PRD.md` before making changes. Track completed steps and checks in `PROGRESS.md`; component inventory is in `docs/components.md`. Project skills live in `.github/skills/`.

The three states from `Design/LeaveBy_Wireframes.png` are implemented. Follow [the manual checklist](docs/manual-check.md) before peer testing and deployment. Class 7 on October 20 covers MVP scoping, peer feedback, deployment and reflection; see `PROGRESS.md` for source links.

Run `npm test` to check the calculation and validation acceptance cases.

See [the pre-deployment audit](docs/release-audit.md) for verified checks, course gaps and the deployment blocker.
