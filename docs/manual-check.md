# LeaveBy verification checklist

Updated October 20, 2026 (America/New_York).
Live app: https://leaveby.rayhanson.tech

## Hosted browser checks reported by Harvey

Harvey reported each of these four guided checks as passed on the deployed app. These are self-tests, not peer-testing observations.

- [x] Reference calculation: future 10:00 AM commitment, preparation 30, commute 60, buffer 15 gives stop 8:15 AM, departure 8:45 AM and arrival 9:45 AM.
- [x] Edit and recalculate: all five inputs preserved; commute changed to 75 gives stop 8:00 AM, departure 8:30 AM and arrival 9:45 AM.
- [x] Blank commute blocks calculation, identifies the missing input and preserves other inputs; restoring 75 permits correct recalculation.
- [x] Midnight crossing: 12:30 AM commitment, preparation 30, commute 60, buffer 15 gives previous-day stop 10:45 PM and departure 11:15 PM, with arrival 12:15 AM on the commitment date; dates distinguish the days.

The guided past-commitment browser check was proposed but not confirmed. It is not marked passed.

## Assistant checks — October 20

- HTTPS fetch of the deployed app returned HTTP 200, LeaveBy form HTML and HSTS max-age=63072000. The Vercel connector can use an authentication bypass; this fetch alone does not establish signed-out access.
- Executed the current GitHub calculation/validation source in the orchestration JavaScript runtime after removing TypeScript-only declarations and annotations. Seven groups passed: reference times; changed commute and source-input preservation; midnight times/dates; explicit zeros; past-stop warning flag; blank/negative/fractional/nonnumeric/exponent/excessive durations; missing/invalid/past/exact-now commitments.
- This was a direct logic check, not the Node test suite, a TypeScript build, or browser interaction. The local execution environment was unavailable. The America/New_York daylight-saving test was not rerun because this runtime's timezone cannot be configured.
- Earlier full Node, lint and production-build results remain historical evidence in PROGRESS.md and docs/release-audit.md.

## Remaining browser checks

- [ ] Past commitment: rejected with a future-date/time error; correcting the date permits recalculation.
- [ ] Future commitment with an already-passed workout stop: results remain visible with a stop-now warning.
- [ ] Negative/fractional/nonnumeric duration errors and explicit-zero behavior in the actual form.
- [ ] Keyboard-only entry, calculation, errors and editing; visible focus and sensible focus movement.
- [ ] Phone and desktop layouts, including no clipped results or horizontal overflow; light/dark controls readable.
- [ ] Reload resets the plan as specified; saved routines are outside the MVP.

## Peer feedback

- [ ] Another person tries creating and editing a plan; record actual observations, feedback and resulting decisions.

Research/process/presentation gaps remain tracked in docs/release-audit.md. These checks do not establish final assignment completion.
