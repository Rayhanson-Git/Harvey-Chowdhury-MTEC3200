# JimBro complete web release — October 21, 2026

## Target
Existing Vercel project `jimbro` (`prj_5dLMR9qmoPZn1H4YtQ5zO1c708IF`), team Rayhanson (`team_McLOi8RvhigiilQftObY7ZJ9`), custom domain https://jimbro.rayhanson.tech. Implementation branch `release/jimbro-web`, based on main `4271e846`. Production release details are appended after actual deployment.

## Changes
Unified Today/Workout/History/Progress/Settings experience, seven editable templates and custom routines, immutable session plans, real set logging/correction, rest/elapsed pause and deadline dock, interrupted-session recovery, finish/early-finish, calendar/details/repeat, actual comparable charts and bodyweight trend, versioned JSON export/import and preferences. Original Jim is a layered SVG with twelve poses, independent runtime animation tracks, priorities and optional local banter. Catalog contains 248 lines including the supplied 100. Metadata/icon/social artwork and documentation finished. Original `/leaveby`, frozen v1 records, instructor templates/research/interviews/designs/presentation and unrelated hosting retained.

## Checks
Fresh original tests 8/8, existing JimBro tests 18/18, expanded domain tests 18/18, native IndexedDB fixture 15/15. Expanded build and TypeScript pass. Browser flow and animation findings are in [WEB-VERIFICATION.md](WEB-VERIFICATION.md); final build/lint, preview and production smoke identity are recorded below when completed.

## Release/rollback policy
Git integration is shared with a separate LeaveBy project, so keep main unchanged and deploy the explicitly selected tested release branch only to JimBro. Do not change unrelated projects/domains or deployment protection. No new environment variables, paid services, backend, account or application dependencies. Rollback must retain IndexedDB version 2 and compatible readers; the old v1 binary cannot open a v2 database. Prefer a forward-compatible patch, export before recovery, and never delete the newer store to enable older code. Vercel can retain prior deployment artifacts, but code-only rollback to v1 is not data-compatible.

## Remaining observations
Real peer usability, physical mobile keyboard/touch, actual screen-reader/audible-output and OS notification/background behavior remain unverified. The peer script and native-readiness note are provided. Browser-local storage is not a backup or sync service; closed/locked/background alarms and offline launch are not guaranteed. No native development started.
