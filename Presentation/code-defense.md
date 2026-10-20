# Code defense guide

Use the actual files during Q&A. These notes explain the implementation; reading them does not establish mastery.

## File map

| File | Responsibility |
| --- | --- |
| app/page.tsx | Page heading and layout around the form. |
| components/plan-form.tsx | Five string inputs, errors, calculated plan and edit state. Handles submission and focus. |
| components/plan-field.tsx | Connects labels, inputs, invalid state and error descriptions. |
| lib/plan-input.ts | Validates the input and calculates full timestamps. |
| components/plan-result.tsx | Formats milestones, dates, breakdown and warning; exposes Edit plan. |
| tests/plan.test.mjs | Eight acceptance tests for calculation and validation. |

## Calculation example

For a 10:00 AM commitment with preparation 30, commute 60 and buffer 15:

1. Arrival is 9:45 AM.
2. Departure is 8:45 AM.
3. Workout stop is 8:15 AM.

The buffer is subtracted once. Each timestamp is the previous timestamp minus minutes multiplied by 60,000. A full date makes previous-day results possible.

## Questions to practice

**Why keep input as strings?** A blank must remain distinguishable from zero. Validate the string before converting it into a number.

**What prevents a past commitment?** validatePlanInput compares the combined local date/time with a fresh current time on every calculation.

**What happens when editing?** The parent form keeps input state. Edit plan clears the result and shows the form; calculation replaces the result only after valid submission.

**How are errors accessible?** A visible label identifies each input. aria-invalid and aria-describedby associate errors with their fields, a live status announces a problem, and focus moves to the first invalid input.

**What if the stop time has passed?** A future commitment can still produce a valid plan. stopHasPassed causes a warning while results remain visible.

**What is not saved?** The plan lives in React memory. Reload resets it. There are no accounts, database or live transit predictions.

**How does daylight saving work?** Calculations subtract elapsed minutes from local timestamps. Nonexistent spring-forward times fail validation. Ambiguous fall-back times follow JavaScript's local-date choice.

## Debugging example to study

The domain had correct configuration but HTTPS failed and no certificate was listed. Issuing the exact-host certificate and rechecking HTTPS resolved that deployment issue. This is a documented project incident, not a claim that the student personally performed each diagnostic action. See the prompting log for the recorded workflow.

For a code-specific example, trace the invalid-duration path from the input string through validation, errors, first-error focus, and correction.

## Live demo

Open the [live app](https://leaveby.rayhanson.tech), show the reference calculation, edit commute to 75, then show an invalid value and recovery. Keep the repository open to lib/plan-input.ts. Rehearse explaining a function in your own words before presenting.

