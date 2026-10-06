# LeaveBy — Product Requirements Document

Harvey Chowdhury · MTEC 3200 · Project 1: Everyday Tool  
October 6, 2026

## Project Overview

LeaveBy is a lightweight transition planner for someone who works out before a fixed class or work commitment. The user enters the commitment date and start time, preparation time, commute time, and a buffer. LeaveBy works backward to show when to stop the workout and when to leave.

The first version handles one upcoming commitment at a time. It makes a timing decision easier; it does not track workouts or predict transit delays.

### Problem and research basis

Small, unpredictable delays can consume the limited gap between a workout and the next commitment. Showering, changing, and commuting still need to happen, so people rush, cut activities, or risk arriving late.

The research folder identifies the gym-to-school transition as a narrow, recurring problem. The synthesis selects a planner that works backward from a fixed deadline and protects preparation, commute, and buffer time.

The supplied interview records add three perspectives:

- Chris describes gym and transit delays stacking together. He already uses a workout hard stop and packs his bag beforehand.
- Selina describes variable preparation time and pressure from a fixed work start. She uses an alarm as a warning to stop starting new exercises.
- David usually has a short, predictable commute and more buffer. His experience shows that the transition is not equally stressful for everyone.

These records support the design direction, but they do not establish that this app reduces lateness. That remains an assumption to test.

### Scope

#### Goals

- Turn a future commitment and three duration estimates into clear action times.
- Distinguish stopping the workout from leaving the gym.
- Explain the calculation through a visible breakdown.
- Preserve inputs when editing and recalculate correctly.
- Handle invalid inputs and already-passed stop times clearly.

#### Outside this MVP

- Exercise programs, sets, reps, calories, and nutrition tracking.
- Live transit information, automatic delay detection, and calendar syncing.
- Accounts, cloud storage, social features, and multiple users.
- Push notifications, smartwatch alerts, and automatic workout shortening.
- Saved routines, live countdowns, transition checklists, and planned-versus-actual departure comparisons. These remain possible later features, not build requirements.

## Target users

The primary user is a student or working person who exercises before a fixed commitment and must fit preparation and travel into a limited window.

They need to answer: “When should I stop working out, and when should I leave?” They should be able to understand the result quickly and change an estimate without entering the entire plan again.

## Skills Required

- **Next.js (required):** app framework, using React and the App Router.
- **Vercel (required):** host and share the working app for review and testing.
- **React and TypeScript:** reusable form/result components and typed plan data.
- **Tailwind CSS:** responsive styling consistent with the wireframes.
- **Component library:** selection remains open; use the chosen library consistently.
- **Local date/time calculations and form validation:** calculate milestones and explain invalid inputs.
- **Git and GitHub:** save working checkpoints and maintain project documentation.

No API, API key, database, authentication, or cloud storage is needed for this MVP. The current repository has research and design files but no application package manifest or source code yet; the stack above is planned, not reported as installed.

Proposed first-build data behavior: retain one plan in browser memory while moving between the form and results. Reloading starts a new plan. Saving routines across visits remains outside the MVP. Only the commitment date/time and three duration estimates are required; result times are derived.

## Key Features

### Milestone 1 — Enter and validate a transition plan

**Deliverable:** the first wireframe screen, with commitment date/time, preparation, commute, and buffer inputs, and a **Calculate times** action.

| Input | Meaning | Validation |
| --- | --- | --- |
| Commitment date | Local date of the next class or work commitment | Required, valid date |
| Commitment start | Local start time on that date | Required; combined date/time must be in the future |
| Get ready (minutes) | Showering, changing, and other tasks before departure | Required, nonnegative whole number |
| Commute (minutes) | Estimated travel time to the commitment | Required, nonnegative whole number |
| Buffer (minutes) | Extra time reserved before the commitment | Required, nonnegative whole number |

Blank duration fields are not treated as zero. An explicitly entered zero is valid. Negative, fractional, nonnumeric, and unrepresentable values must not produce results.


Use visible labels and keep entered values when an error occurs. Show an error beside each relevant input. Reject a commitment at or before the current time and ask for a future date and time.

**Validation:** a user can complete all fields by keyboard or touch. Missing values, negative durations, fractional durations, and past commitments show clear errors. Explicit zero durations are accepted. Compare the form with the supplied wireframe before moving on.

### Milestone 2 — Calculate and display the plan

**Deliverable:** the results screen, with **Stop workout** most prominent, then **Leave by**, the duration breakdown, target arrival, commitment date/time, and **Edit plan**.

Calculate in this order:


1. Target arrival = commitment start − buffer.
2. Leave by = target arrival − commute.
3. Stop workout = leave by − preparation.

Subtract the buffer only once. Use the commitment's full local date and time, rather than time-of-day strings alone. Show the date when a result falls on a different day from the commitment.

#### Reference example

| Item | Initial plan | After editing commute |
| --- | --- | --- |
| Commitment | 10:00 AM | 10:00 AM |
| Preparation | 30 minutes | 30 minutes |
| Commute | 60 minutes | 75 minutes |
| Buffer | 15 minutes | 15 minutes |
| Stop workout | 8:15 AM | 8:00 AM |
| Leave by | 8:45 AM | 8:30 AM |
| Target arrival | 9:45 AM | 9:45 AM |

The October 6 date in the wireframe is an interface example, not a live default or the class meeting time. Use a future date when testing this example.

Display **Times use your estimates** so the result is not mistaken for a live transit prediction.

If the commitment is still in the future but the workout stop time has passed, keep the calculated times visible and show: **Your workout stop time has passed. Stop now and review your plan.**

**Validation:** verify the reference example above. For a 12:30 AM commitment with 30 minutes preparation, 60 minutes commute, and 15 minutes buffer, display target arrival at 12:15 AM, departure at 11:15 PM on the previous date, and workout stop at 10:45 PM on the previous date. Show the earlier date explicitly. Verify that zero preparation makes stop and departure equal and that buffer is deducted only once.

### Milestone 3 — Edit and recalculate

**Deliverable:** the adjustment state, prefilled with all existing values, and a **Recalculate** action returning to the results.

Validate again on recalculation, including whether the commitment is still in the future. Invalid edits preserve the user's inputs and do not produce a new result. The input and adjustment states may reuse one form component; separate URLs are not required.

**Validation:** changing commute from 60 to 75 minutes moves stop from 8:15 AM to 8:00 AM and departure from 8:45 AM to 8:30 AM. Target arrival remains 9:45 AM. All other inputs remain unchanged.

### Milestone 4 — Review, deploy, and prepare for peer testing

**Deliverable:** a working Next.js app on Vercel with the complete flow: enter a plan → read the times → edit → recalculate.

Build and review one screen at a time. Test every input, button, and link; check keyboard focus, readable contrast, and phone-width layout. Use text rather than color alone for errors and results. Have Harvey review each screen against the wireframes and commit working checkpoints.

Ask a participant to enter a future plan, explain the two action times, and increase the commute estimate. Record confusion, help needed, and changes to make. These tests are planned; no completed app testing or reduction in lateness is claimed.

**Validation:** the deployed URL loads, the full flow works on desktop and phone widths, and the calculation/validation cases in milestones 1–3 pass. Record actual findings after peer testing.

Class 6 says there is no class next week and to continue building for testing at the next class. No exact deadline or meeting date is inferred here.

### Research and design references

All current files in `research/`:

- [Interview questions](research/interview_questions.md)
- [Problem statement](research/problem_statement.md)
- [Synthesis and chosen direction](research/synthesis.md)
- [What / How / Why](research/what_how_why.md)

Supporting project materials:

- [MVP definition](Specs/MVP.md)
- [Design flow and states](Design/README.md)
- [Clean wireframes](Design/LeaveBy_Wireframes.png)
- [Rough sketches](Design/LeaveBy_Rough_Sketches.png)
- [Chris interview record](interviews/Chris_2026-09-19.md)
- [David interview record](interviews/David_2026-09-19.md)
- [Selina interview record](interviews/Selina_2026-09-19.md)
- [Class 6 in Notion](https://app.notion.com/p/5923d2939d2f83058aa2817c11045cad)

## Open questions

- Which component library should the first build use?
- Is session-only data sufficient for the first version? This is the proposed behavior; saved routines remain outside scope.
- Can users estimate preparation and commute durations well enough for a useful plan?
- Do users clearly distinguish **Stop workout** from **Leave by**, and does the chosen buffer help them plan earlier?
- How should an ambiguous daylight-saving time be explained if the date/time controls permit one? The MVP uses device-local time, with no cross-time-zone planning.
