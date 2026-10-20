# LeaveBy manual checklist

Updated October 20, 2026. Detailed evidence and limits: [verification](verification.md).

## Completed checks

- [x] Reference calculation.
- [x] Preserved inputs and edited-commute recalculation.
- [x] Blank input, error association, preserved values and recovery.
- [x] Negative, fractional and text-duration rejection.
- [x] Past-commitment rejection and correction.
- [x] Midnight times and previous-day labels.
- [x] Explicit zero durations.
- [x] Passed-stop warning with visible results.
- [x] Keyboard activation and result/edit focus transitions.
- [x] Reload resets the session plan.
- [x] Desktop form/results appearance and overflow at the tested viewport.
- [x] Eight acceptance tests, lint and production build.
- [x] Public HTTPS response and production dependency check.

Harvey reported the first four guided tests as passed earlier. The hosted checks above were subsequently performed directly during finalization.

## Verification limits

Phone-width and dark-mode visual review, complete native-control keyboard traversal and assistive-technology testing remain unverified. The current browser interface does not provide the required emulation controls.

## Peer evaluation

- [ ] Another person creates/edits a plan, explains Stop workout versus Leave by, and gives feedback.
- [ ] Record actual findings and any changes/retest in [peer-feedback.md](peer-feedback.md).

Use the [submission checklist](submission-checklist.md) for course deliverables and the live defense.
