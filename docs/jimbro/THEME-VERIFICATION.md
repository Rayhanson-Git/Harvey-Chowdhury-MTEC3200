# Theme and navigation clarification — October 21, 2026

User story: choose Light, Dark or System in Settings → validate/persist to existing IndexedDB v2 preferences → update all JimBro surfaces → preserve choice on reload, across tabs and through JSON backups. Today explains planning; Workout explains logging the same active session. No server/API or account is involved.

## Local verification

- `npm test`: 8/8; `npm run test:jimbro`: 18/18; `npm run test:web`: 23/23, including legacy/malformed theme preference coverage.
- `npm run lint`, `npm run build`, `npx tsc --noEmit`: passed; final build includes the calendar label correction.
- Chromium, Firefox and WebKit: 7 theme journeys each, 14 axe scans each, zero reported violations or page/console/HTTP errors. Incomplete/manual-review nodes remain recorded.
- Each engine also passed all 20 existing workout journeys and six existing axe scans. Chromium/WebKit exercised the light system default; Firefox exercised dark during the workout journey.
- Actual downloads and native browser file-chooser events tested export, merge, deliberate replacement, invalid theme rejection and legacy backups without theme. Failed IndexedDB writes retain the old appearance; blocked optional localStorage still permits persisted themes.
- Explicit choices override OS preference; System follows live emulated OS changes. Another tab and gallery update. Cached choice applies before hydration with app scripts held. LeaveBy stays outside product theme styling.
- Visual review: desktop light/dark Settings, phone-width Settings and populated light progress chart; responsive checks at 320/390/1440 CSS pixels. This is viewport emulation, not physical-device or screen-reader testing.

The broader axe scan found the existing calendar’s ISO aria-label did not match a visible single-digit day. It now uses the visible day plus readable month/year. Initial browser harness selectors and pre-hydration element readiness were corrected; only the final successful reports count as evidence.

Evidence: `evidence/2026-10-21-theme/`; runtime fingerprints identify the compiled source. Preview and production identities/results are appended after actual hosted verification. Previous release evidence remains historical and unchanged.

## Compatibility

The database and backup stay v2. Theme is optional so existing records/backups are supported. Workouts, IDs and historical snapshots are unchanged. Prefer a forward patch for rollback; older v2 code can read workouts but saving old preferences may drop the new appearance choice. Native, OS alert, physical-phone and human peer limits from the previous release remain.
