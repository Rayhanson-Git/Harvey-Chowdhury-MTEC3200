# LeaveBy insight statements

Prepared October 20, 2026.

Status: assistant-assisted retrospective draft for Harvey's review. These interpretations draw on the existing interview records and [affinity map](affinity_map.md). They were documented after the prototype build and do not establish that the app solves the reported problems.

## 1. Protecting the transition requires accounting for several sources of delay

People moving from a workout to a fixed commitment need to reserve time across preparation and travel because delays can occur at multiple stages, while the next commitment remains fixed.

Evidence: affinity cards C1, C2, D1, S1 and S2 in [Cluster 1](affinity_map.md#cluster-1--unexpected-waits-reduce-available-transition-time). [Chris](../interviews/Chris_2026-09-19.md#answers) describes equipment and train delays occurring on the same day. [David](../interviews/David_2026-09-19.md#answers) describes waiting for a shower. [Selina](../interviews/Selina_2026-09-19.md#answers) describes equipment waits and variable preparation time.

Design implication to evaluate: make preparation, commute and buffer explicit in a backward plan from the commitment.

Limit: Chris's account illustrates stacked delays; the three records do not measure their frequency or establish how much buffer prevents lateness.

## 2. Transition pressure depends on predictability and available buffer

A workout before class does not create the same pressure for everyone. The contrast between Chris and David suggests that commute conditions and available buffer shape how manageable the transition feels.

Evidence: C2 and C3; D2, D3 and D4 in [Clusters 1 and 2](affinity_map.md#cluster-2--commute-predictability-and-buffer-change-the-experience). [Chris](../interviews/Chris_2026-09-19.md#answers) reports an unpredictable train commute and fifteen to twenty minutes of buffer. [David](../interviews/David_2026-09-19.md#answers) reports a predictable ten-minute walk, twenty to thirty minutes of buffer, and usually not feeling rushed.

Design implication to evaluate: let users enter their own commute and buffer estimates instead of treating a single duration as suitable for everyone.

Limit: this is a comparison between two accounts, not proof that commute length or buffer alone causes the difference. David's smoother routine must remain visible in the research.

## 3. Protecting the next commitment often means sacrificing part of the current routine

When time becomes tight, participants describe shortening workouts or preparation activities to protect a fixed class or work commitment. A useful planning boundary therefore needs to distinguish stopping exercise from physically departing.

Evidence: C4, D5 and S3 in [Cluster 3](affinity_map.md#cluster-3--people-sacrifice-workout-or-preparation-activities-to-protect-commitments). [Chris](../interviews/Chris_2026-09-19.md#answers) describes skipped exercises, stretching or food; [David](../interviews/David_2026-09-19.md#answers) ends the workout rather than arrive late; [Selina](../interviews/Selina_2026-09-19.md#answers) cuts sets or exercises. Their recorded routines also include showering/changing between exercise and the next commitment.

Design implication to evaluate: show a workout-stop time separately from the departure time, reserving preparation time between them.

Limit: the distinction is a design interpretation of the recorded routines. It has not yet been validated through peer use of LeaveBy.

## 4. Explicit time boundaries build on strategies participants already use

Participants already manage transitions with preparation routines and, in Chris's and Selina's accounts, explicit stopping cues. A planner may fit these existing strategies by making the boundary easier to calculate.

Evidence: C5, C6, D6, S4 and S5 in [Cluster 4](affinity_map.md#cluster-4--existing-workarounds-create-boundaries-and-reduce-preparation-effort). [Chris](../interviews/Chris_2026-09-19.md#answers) packs ahead and uses a hard stop; [David](../interviews/David_2026-09-19.md#answers) organizes his bag consistently; [Selina](../interviews/Selina_2026-09-19.md#answers) keeps a stocked bag and sets a warning alarm before departure.

Design implication to evaluate: make the calculated stop/departure times easy to find and understand alongside the user's existing preparation routine.

Limit: these workarounds do not establish demand for an app. LeaveBy's current MVP displays times; this evidence does not mean it provides alarms or live reminders.

## 5. Perceived deadline pressure deserves separate investigation

For Selina, feeling rushed can begin before time has actually run out. Knowing that work is approaching affects her attention even when she believes enough time remains.

Evidence: S6, S7 and S8 in [Cluster 5](affinity_map.md#cluster-5--the-upcoming-deadline-affects-attention-and-perceived-pressure); [Selina's recorded answers](../interviews/Selina_2026-09-19.md#answers) about repeated clock checking, the tight transition window and mental pressure.

Design implication to evaluate: during peer testing, ask whether the displayed times clarify the next action or create additional clock watching.

Limit: this is a single-participant insight candidate. It is not a shared finding across all three interviews, and no reduction in stress has been demonstrated.

## Review status and next step

The source-to-card links and the differences between participant accounts have been checked against the recorded answers. Harvey's interpretation and approval remain pending.

After review, use the supported needs and conditions to develop a persona and a point-of-view statement. Retain the [existing HMW question](synthesis.md#how-might-we) for comparison. Peer feedback on the deployed app remains pending.
