---
name: verify-plan
description: Verify LeaveBy time calculations, validation, and editing behavior. Use when implementing or changing plan logic or preparing the full app flow for review.
---

# Verify a transition plan

1. Read `PRD.md` milestones 1–3 and inspect the actual calculation and form code.
2. Use a future commitment date. Verify 10:00 AM minus 15-minute buffer, 60-minute commute and 30-minute preparation gives 9:45 AM arrival, 8:45 AM departure and 8:15 AM workout stop.
3. Change commute to 75 minutes. Verify 8:30 AM departure and 8:00 AM stop; preserve other values.
4. Verify a 12:30 AM commitment with the original durations shows 11:15 PM departure and 10:45 PM stop on the previous date.
5. Check blank, negative, fractional, nonnumeric, excessive durations, explicit zero, past commitments and already-passed workout stops. Follow PRD messages and preserve inputs.
6. Run lint, TypeScript and build checks. Record actual results and blockers in `PROGRESS.md`.
7. Report what passed, what failed and what still needs Harvey’s manual review. Never invent test results.
