# JimBro web architecture and data contract

## Boundaries
Next.js 16.4 App Router/React/TypeScript/Tailwind; no new application dependencies. `schedule.ts` resolves local wall-clock input in a captured IANA zone to an epoch timestamp, explicitly handles DST repeated times, rejects gaps, and derives cutoff/departure/arrival. `session.ts` validates records. `routines.ts` owns estimates, snapshots, units, elapsed/rest and comparable personal bests. `progress.ts` derives aggregates from actual recorded work. `storage.ts` owns IndexedDB transactions, revision checks, migration, import and alert/phrase receipts. `personality.ts` selects local content; `use-jim.ts` handles timed priorities. `JimCharacter` is the original layered SVG rig.

## Records and migration
Native IndexedDB `jimbro`, version 2. `sessions`, `bodyWeight`, `exercises`, `meta` are retained; `routines` is added. The upgrade cursor validates v1 records and copies them to v2 with empty planned snapshots/notes and zero paused duration. Existing IDs, original sets/units, timestamps, local dates, actual-action fields and revisions remain. Unsupported/corrupt records fail visibly rather than resetting the database. Historical GymLog prototype data on another origin is not claimed migrated. Browser origins cannot read each other’s storage.

Routine → deep-copied planned snapshot → completed sets are separate. Changing a routine never rewrites an old session. Stable set IDs support retry; revision checks reject stale writes. One transactional active pointer prevents competing starts. BroadcastChannel refreshes peers; focus/visibility refresh is the fallback. Stale forms require an explicit retry against the latest record. Destructive import uses one transaction after complete validation; merge keeps existing IDs/preferences and adds new IDs. Competing active sessions block the entire merge. Failed commits do not announce saved.

## Timing and lifecycle
Countdown = persisted epoch deadline minus current device time. Rest and elapsed workout pause state do not affect the deadline. Elapsed pause excludes paused time; a saved finish timestamp stops elapsed duration. Finishing exercise retains a scheduled session’s departure reminders until explicit closure. Open workouts have no departure deadline. Scheduled workouts are never completed by a timer. Closed, early-ended and discarded records are distinguishable; discarded work is retained for review but excluded from progress.

The legacy required Schedule field is retained for backward compatibility in open workouts; `withoutDeadline=true` prevents any scheduling meaning or alerts, and its internal sentinel is not displayed as a real plan. Adding a real deadline requires explicit validated save.

## Units and progress
Every measurement retains its original unit. Conversion uses 1 lb = 0.45359237 kg. Bodyweight repetitions, added external load, assistance, seconds and kilometers are separate measures. Legacy v1 records retain their original numeric interpretation (no retroactive inference of bodyweight or assistance). Volume sums external load × reps, excluding all other types. Personal best requires an earlier lower valid external load for the same exercise and repetition count. First entries are baselines. Edits and deletions recompute views; no persisted PR flag or universal strength score.

Workout days stay on the captured local start date, even after midnight or timezone travel. Weekly buckets use those date strings with Monday starts and zero-fill intervening unrecorded weeks. Date filters use the current device-local today. Charts have text/table alternatives and state when there is insufficient data for a trend.

## Personality and privacy
248 finite local phrases, including the 100 supplied seeds. Tone is cumulative: stronger modes include quieter lines. Flirtation is independently opt-in. Requirements gate saved, prior history/notes, class, deadline and verified personal-best claims. Shuffle bags, recent exclusion, event receipts, a 12-second ordinary-speech cooldown and bounded persistent history reduce repetition. Urgent scheduling/error cues bypass the ordinary cooldown. Mascot priority is error → departure → preparation → warning → recovery → completion → progress → set → rest → ready → greeting → idle. State changes are event-driven, never render-driven. No runtime AI, analytics, remote workout logs or account service.

## Limits and rollback
Data is device/browser-local. Clearing site data can delete it; export is the user-controlled backup. No synchronization or backup service is implied. No guaranteed offline launch, background/closed-app/lock-screen alarm, or trusted server clock. Notifications need explicit permission and best-effort foreground delivery. Sound starts muted each visit.

Do not roll back a v2 database to the old v1 app: the old browser open request will fail with VersionError. Use a forward-compatible patch retaining DB version 2. Export backups before rollback/recovery; never auto-delete a newer database to make older code open it. Production data must never be used for QA fixtures.

## October 21 repair extension

Storage stays at IndexedDB v2 with the same migration, transaction, revision and snapshot policy. No persisted record is rewritten for this repair. The original starter library is extended to 31 common exercises across eleven muscle groups, with local aliases and sensible timed/distance defaults for plank/running/cycling. IDs and historical names remain stable. Previous-set lookup now filters the current measure type. Bodyweight progress compares actual repetition counts without the external-load repetition filter; assisted progress reports the lowest assistance at matching repetitions, separately from external-load personal bests.

Backup export remains version 2. A fresh file selection always starts in Merge mode. Replace requires selecting the explicit policy and activating Confirm replacement. Invalid/conflicting imports report inside the still-open modal and preserve records/preferences; a separate error phrase receipt can be added by the optional controller. Merge keeps existing IDs and preferences; exact equality checks exclude transient alert/phrase receipts. The UI is verified using a real download event and a native browser file-chooser event followed by selecting the test JSON.

Active-plan add/replace handlers capture exercise IDs synchronously before the asynchronous IndexedDB mutation callback. A controlled select can reset before the callback; reading the DOM event target later previously produced an unknown exercise or retained the old selection. History note edits likewise capture their value before persistence. The browser regression exercises actual active-plan add/reorder/replace controls.

## Appearance preference

`Preferences.theme` is optional (`light`, `dark`, `system`) within the existing v2 record/backup. Missing values mean System; invalid present values reject the whole import before writes. No database version bump or destructive migration is needed. IndexedDB remains authoritative, and the appearance changes only after successful preference persistence and snapshot refresh. A validated `jimbro-theme-v1` localStorage cache applies the last choice before hydration; unavailable localStorage is caught and does not block IndexedDB or rendering. The document’s data attribute controls scoped color tokens; CSS follows live OS changes for System without per-render media queries. Storage/BroadcastChannel updates synchronize tabs, and imported replacement preferences refresh the appearance. Backup merge retains existing preferences.
