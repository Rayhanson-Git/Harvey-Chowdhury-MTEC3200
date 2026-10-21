# JimBro repair release — October 21, 2026

Target: existing Rayhanson team `team_McLOi8RvhigiilQftObY7ZJ9`, project `jimbro` / `prj_5dLMR9qmoPZn1H4YtQ5zO1c708IF`, domain https://jimbro.rayhanson.tech. Repository `Rayhanson-Git/Harvey-Chowdhury-MTEC3200`, release branch `release/jimbro-web`. Starting release head `a02322b`; original production application `1af1c647`. Main remains `4271e8465b131a368610bb02c79b896377dadaa5`. Branch listing reported no protected release branch; no protection or deployment configuration was changed.

Current release contains the joint-rig repair, production brand package, asynchronous active-plan selection repair, comparable-record/progress corrections, safer backup import and deletion, and cross-browser modal focus fixes. Full details and limitations: WEB-VERIFICATION.md. Initial release records are archived under `history/`.

## Release gates

Fresh 8+18+22 domain tests, clean lint/type checks, production build, isolated native storage and sampled animation checks. Final compiled source passed 20/20 browser journeys in Chromium, Firefox and WebKit (60 total), with six zero-violation axe scans per engine and no recorded console/HTTP errors. Preview/production identities remain pending until observed.

## Rollback and durability

Database remains v2; no repair migration or destructive reset is introduced. Never deploy the old v1 reader against newer data, delete/recreate IndexedDB, or rewrite snapshots to force compatibility. Prefer a forward patch on this branch retaining current v2 validation, new catalog IDs and comparable measure semantics. Before any recovery operation, export a version-2 backup from the affected origin. Test restore in a disposable profile. A UI rollback must keep the current storage adapter/catalog and prove export/import and new-session reads; a Vercel artifact alone is not proof of schema compatibility.

The separate LeaveBy deployment and main are preserved. Deploy only this selected source to the existing JimBro project; no new domains, unrelated project changes, paid service, runtime backend or native app. Preview is tested before production, then production is smoke-tested again. Final deployment/source evidence follows below.
