# JimBro — November 10, 2026 branding release verification

**Source under test:** [`f616d278ef9275f7ef4e6679dfb3172a40b32da4`](https://github.com/Rayhanson-Git/Harvey-Chowdhury-MTEC3200/commit/f616d278ef9275f7ef4e6679dfb3172a40b32da4)  
**Branch:** `release/jimbro-web`  
**Production deployment:** `dpl_DHXHgNJWcB8frS5SHaUEPLzVxFoQ` — Vercel reported **READY** with `target=production`, no alias error, exact Git SHA above  
**Vercel alias verified in-browser:** https://jimbro-rayhanson.vercel.app/  
**Custom site alias:** https://jimbro.rayhanson.tech/ (automated HTTP access caveat below)

## Scope

This release updates JimBro's current README, root PRD, contributor instructions, package identity/lockfile naming, branch documentation and original Project 1 archive. The updated application removes prominent links to the old course prototype from JimBro navigation; the original `/leaveby` route and its tests remain. The modern JimBro v2 app, routines, backups, themes, mascot and runtime data semantics were preserved.

The existing repository's `main` remained `4271e8465b131a368610bb02c79b896377dadaa5` during this work. Earlier `revamp/foundation` remains a separate JimBro historical branch.

## Reproducible checks

A new disposable Vercel Sandbox with Node **24.22.1**, npm **11.19.1**, 2 vCPUs / 4 GB RAM was created from the exact Git commit. Locked application dependencies were restored with `npm ci --no-audit --no-fund`; QA dependencies were installed *outside* the app (`playwright@1.64.1` and `@axe-core/playwright@4.14.0`). Chromium's system libraries were installed only into the disposable sandbox. No app dependencies or customer data were changed.

| Check | Current result |
| --- | --- |
| `npm test` | **8/8 passed** |
| `npm run test:jimbro` | **18/18 passed** |
| `npm run test:web` | **23/23 passed** |
| `npm run lint` | **Passed** |
| `npm run build` | **Passed**, all expected app routes prerendered |
| `npx tsc --noEmit` | **Passed** after build generated route types |
| Local built app: `npm run test:browser` | **20/20 Chromium journeys**, 6 axe scans / 0 reported violations, 0 reported browser errors |
| Local built app: `npm run test:theme` | **7/7 Chromium journeys**, 14 axe scans / 0 reported violations, 0 reported browser errors |
| Local built app: `npm run test:mascot` | **12 poses, 120 sampled frames, 144 transitions**, success |
| Deployed Vercel alias: `npm run test:browser` | **20/20 Chromium journeys**, 6 axe scans / 0 reported violations, 0 reported browser errors |
| Deployed Vercel alias: `npm run test:theme` | **7/7 Chromium journeys**, 14 axe scans / 0 reported violations, 0 reported browser errors |
| Deployed Vercel alias: `npm run test:mascot` | **12 poses, 120 sampled frames, 144 transitions**, success |

**Combined summary:** 49/49 domain tests passed. Browser runs checked 27/27 journeys against both the isolated build and Vercel's production alias, with 20 axe scans per environment and no violations reported by the automated scanner. These browser tests used disposable/synthetic profiles. Chromium was tested freshly; prior Firefox/WebKit results belong to the older dated release and are not automatically current.

Commands for independent browser reproduction (after `npm ci`, building and starting the app on port 3100):

```sh
JIMBRO_URL=http://127.0.0.1:3100 JIMBRO_QA_MODULES=/tmp/jimbro-qa-tools npm run test:browser
JIMBRO_URL=http://127.0.0.1:3100 JIMBRO_QA_MODULES=/tmp/jimbro-qa-tools npm run test:theme
JIMBRO_URL=http://127.0.0.1:3100 JIMBRO_QA_MODULES=/tmp/jimbro-qa-tools npm run test:mascot
```

Point `JIMBRO_URL` at `https://jimbro-rayhanson.vercel.app` to reproduce the deployed-host runs with a disposable browser context. The isolated QA tooling and the sandbox are not production dependencies.

## Access and human-verification limitations

- Vercel reported the production deployment **READY**, matching the tested Git SHA, and both `jimbro-rayhanson.vercel.app` and the immutable Vercel deployment host returned HTTP **200** and JimBro metadata.
- Automated requests to `jimbro.rayhanson.tech` returned a **Cloudflare HTTP 403 “Just a moment…” challenge**. This is evidence of automated access being challenged, **not proof** the custom domain is broken for real visitors. Hosted browser QA above was performed against the working Vercel alias, not through the challenged custom domain.
- Real physical devices, VoiceOver/TalkBack, actual speaker/notification behavior, browser suspension/lock-screen behavior and human peer usability remain unverified. Passing axe scans are not full accessibility certification.
- Historical tests and prior production source fingerprints in [WEB-RELEASE.md](WEB-RELEASE.md) and [THEME-VERIFICATION.md](THEME-VERIFICATION.md) remain tied to their original October commits.

## Repository maintenance

Pull request [#2](https://github.com/Rayhanson-Git/Harvey-Chowdhury-MTEC3200/pull/2) was **closed without merging** after inspection. It only proposed making the old `main` branch's fixed 24-exercise test dynamic; the active JimBro release branch already has an equivalent flexible regression assertion. Course `main` was not changed.

This QA record is a documentation-only follow-up to the tested application commit; it does not alter the deployed runtime or assert a separate new application release.
