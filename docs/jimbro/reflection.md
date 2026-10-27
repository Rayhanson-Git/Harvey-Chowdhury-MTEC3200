# JimBro — Project Reflection

Harvey Chowdhury · MTEC 3200 · October 27, 2026

## Purpose and development

JimBro developed from a problem in my daily routine: fitting a workout before school or work while leaving enough time to get ready and travel. LeaveBy addressed the timing problem by working backward from a commitment. GymLog addressed recording completed exercises. Combining those ideas made the product useful during the workout as well as before it.

The feedback I reported during development was that LeaveBy alone felt too simple and overlapped with what a calendar could already do. That influenced the move toward JimBro. This feedback shaped the direction; it does not establish that the finished app has passed a new peer usability study.

The resulting flow connects planning, training and reviewing progress. A user plans available time, chooses or adapts a routine, records completed sets and reviews saved sessions. The departure schedule stays attached to the same session throughout.

## Design decisions

A key decision was to distinguish the workout cutoff from the leave-by time. Stopping exercise still leaves preparation to complete before traveling. Showing both milestones makes that transition explicit. The countdown uses saved deadlines, so switching views, reloading or pausing a rest timer does not move the departure time.

Editable routines accommodate different schedules and equipment. Users can shorten a routine or create their own instead of being forced into one fixed program. Training without a deadline is also supported.

Jim, the cucumber mascot, gives the app a recognizable personality. His phrases and animation accompany the information, while users can change his tone, reduce motion or hide him. Essential timers and workout controls remain available without the character. Light, Dark and System appearance options provide another way to adapt the interface.

The Today and Workout tabs exposed a clarity issue during review: their different purposes were not immediately obvious to me. Explanatory text now identifies Today as planning and Workout as active logging. This showed that having separate screens is not enough; their purpose must be understandable.

## Challenges and revisions

Jim's detached arm was a visible defect with an underlying animation problem. The repair corrected shoulder, elbow and wrist relationships across the rig, rather than adjusting only one pose. Sampling multiple poses, times and sizes helped check the result while retaining movement.

Reliability also required attention beyond the normal success path. Active-plan exercise changes needed to preserve the selected value during asynchronous saving. Import controls needed clear merge and replacement behavior. Progress calculations needed to distinguish external load, bodyweight and assistance so different measures were not presented as equivalent achievements.

These revisions reinforced that a finished interface depends on accurate state, understandable controls and recoverable data, as well as appearance.

## Testing and outcome

The current release has 49 passing domain tests, plus lint, type checks and a production build. Browser checks covered Chromium, Firefox and WebKit. The deployed preview and production each passed 20 workout journeys and seven appearance journeys, including reload recovery, set correction and actual backup download/import. Automated accessibility checks reported no violations in those runs; that does not establish complete accessibility.

Real-phone interactions, screen-reader output, OS alert behavior and a new human usability study remain unverified. The project does not yet demonstrate that people arrive earlier or train more consistently.

## Limitations and next steps

The web scope is implemented and deployed. Data is stored locally in the browser, with JSON export/import for backups. There are no accounts or automatic device synchronization. Alerts depend on browser conditions; reliable closed-app or locked-screen delivery is not promised.

The next step is to observe people using the complete journey on actual devices and revise any confusing interactions. Those findings should also inform a later native application, especially its notification and storage requirements. Adding more features before understanding the current experience would make that evaluation harder.

## Project references

- [Live JimBro](https://jimbro.rayhanson.tech)
- [Original LeaveBy reflection](../reflection.md)
- [Current release record](WEB-RELEASE.md)
- [Core repair verification](WEB-VERIFICATION.md)
- [Appearance and hosted-release verification](THEME-VERIFICATION.md)
- [Prepared peer-test tasks](PEER-TEST.md)
