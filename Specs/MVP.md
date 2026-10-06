# LeaveBy — Minimum Viable Product

Harvey Chowdhury · MTEC 3200 · Project 1: Everyday Tool

## Core problem

After a workout, I still need time to shower, get ready, and travel to class or work. Small delays can use up the little spare time I have, so I end up rushing or cutting something short. My research points to the transition after the workout as the main problem. A shorter, more predictable commute made that transition easier in David's interview, while Chris and Selina described more pressure around fixed commitments.

LeaveBy is the working name for the lightweight transition planner selected in my Class 4 synthesis. The user enters the next commitment time and the time needed to get ready and travel. The tool works backward and gives them a clear workout stop time, with a buffer already included.

## Must-have features

1. **Enter a plan:** commitment date and start time, preparation minutes, commute minutes, and buffer minutes. Preparation includes showering, changing, and any other tasks before leaving.
2. **Calculate two clear times:** when to stop the workout and when to leave for the commitment.
3. **Show the breakdown:** display preparation, commute, and buffer alongside the result so the user can understand the calculation.
4. **Adjust the plan:** edit the existing inputs and recalculate without starting over.
5. **Catch unusable inputs:** require a future commitment, nonnegative whole-minute durations, and complete fields. If the workout stop time has passed, keep the calculated times visible and show a clear message to stop now and review the plan.

### Calculation and example

The buffer is reserved before the commitment, so the target arrival is earlier than the start time.

- Target arrival = commitment start − buffer.
- Leave by = target arrival − commute.
- Stop workout = leave by − preparation.

For an example **10:00 AM class**, **30 minutes preparation**, **60 minutes commute**, and **15 minutes buffer**:

| Milestone | Time |
| --- | --- |
| Stop workout | 8:15 AM |
| Leave for class | 8:45 AM |
| Target arrival | 9:45 AM |
| Class begins | 10:00 AM |

Increasing the commute to 75 minutes moves the workout stop to **8:00 AM** and departure to **8:30 AM**. The buffer is deducted only once. Calculations use the commitment date and local time; if a result falls on the previous day, its date must be shown.

## Nice to have / not MVP

- Save a usual routine for later visits.
- Show a live countdown to the workout stop time.
- Add a small checklist for the transition.
- Compare planned and actual departure times.

## Out of scope for now

- Exercise programs, sets, reps, calories, or nutrition tracking.
- Live transit data, automatic delay detection, and calendar syncing.
- Accounts, cloud storage, social features, or multiple users.
- Push notifications, smartwatch alerts, and automatic workout shortening.

The first version handles one upcoming commitment at a time. Users estimate their own durations and update them when needed.

## Key assumptions to test

- Users can estimate preparation and commute time well enough for a useful first plan.
- A visible workout stop time helps people act earlier than a class start time alone.
- Users understand the difference between stopping the workout and leaving the gym.
- A manually chosen buffer is useful without live transit information.
- The input form is short enough to use before a workout.

When the first build is ready, ask someone to enter a plan, explain both result times, and increase the commute duration. Check whether they finish without help and whether they understand that the times are based on their own estimates. These checks are planned; results will be recorded after testing.

Research basis: [problem statement](../research/problem_statement.md) and [interview synthesis](../research/synthesis.md).
