# JimBro Milestone 1 verification

October 20, 2026 · Branch: `revamp/foundation` · HEAD: `4af9f2bc004bb1a0f1d8649991bf41cea649e90c`

This record reports this task's checks. Earlier passes in [LeaveBy verification](../../verification.md) are historical and are not fresh results from this environment.

## Environment and baseline

- Separate recovered checkout: workspace `JimBro/`; original course checkout left untouched. [Inventory](INVENTORY.md) explains recovery and shallow history.
- GitHub branch listing confirmed both remote branches at the approved baseline. Every recovered baseline file, tree and original commit object matched its expected Git SHA. Local `git rev-parse HEAD` returned the full expected commit; status was clean before edits.
- Node.js `v25.9.0`; npm `11.12.1`. No `node_modules`; `tsc`, `eslint` and `next` unavailable on PATH. No dependency install attempted. Package manifest, lockfile and tests unchanged.

## Existing commands — actual results

| Command | Exit | Actual result |
| --- | ---: | --- |
| `npm test` | 127 | Stopped at `sh: tsc: command not found`; standard compilation/test pipeline did not complete |
| `npm run lint` | 127 | Stopped at `sh: eslint: command not found`; lint not performed |
| `npm run build` | 127 | Stopped at `sh: next: command not found`; production build/TypeScript checks not performed |
| `git fsck --connectivity-only` | 0 | No connectivity errors within the local repository's declared shallow boundaries |
| `git diff --check` | 0 | No whitespace errors in existing tracked-file changes |
| Final preservation/link checks | 0 | All 77 baseline paths present; 75 match their original blobs/content hashes, only AGENTS.md/PROGRESS.md intentionally differ; new Markdown links resolve; manifest matches HEAD |

The missing executables are environment blockers. They do not establish an application regression or a successful standard check. Completing standard checks requires an environment with the locked dependencies already present or separate future authorization to install them. This task did neither.

## Supplemental execution of the existing tests

Used Node's built-in `node:module.stripTypeScriptTypes` on the unchanged `lib/plan-input.ts`, writing only ignored `.test-build/plan-input.js`. Then ran the unchanged existing suite:

```sh
node --input-type=module -e 'import { stripTypeScriptTypes } from "node:module"; import { mkdirSync, readFileSync, writeFileSync } from "node:fs"; mkdirSync(".test-build", {recursive:true}); writeFileSync(".test-build/plan-input.js", stripTypeScriptTypes(readFileSync("lib/plan-input.ts", "utf8")));'
node --test tests/plan.test.mjs
```

Both commands exited 0. Test result: **8 passed, 0 failed, 0 skipped**. Cases: reference arithmetic; edited commute/source preservation; midnight dates; explicit zeros; past-stop flag; invalid/excessive durations; missing/invalid/expired commitment; America/New_York spring daylight-saving gap.

Node emitted an experimental API warning and a warning about detecting ES-module syntax in the generated file. No package configuration was changed to suppress them. Stripping types is not type checking and differs from the standard script's CommonJS compiler output. These are runtime results for the original calculation tests only; they do not substitute for `npm test`, lint, build, browser interaction or any future JimBro acceptance scenario.

## Documentation and preservation checks

Compared manifest rows to baseline Git blobs, sizes and SHA-256 hashes, checked current files with the two authorized exceptions, verified the versioned Markdown's relative links, inspected diff scope and checked that the index remains unchanged. No original research, interviews, designs, slides, templates, source, tests or dependency files were edited. No feature implementation, dependency installation, commit, push, deployment or production change occurred.

Milestone 1 documentation is complete. Standard test/lint/build verification remains blocked; all JimBro product acceptance scenarios remain pending. No new peer testing or instructor approval is claimed.
