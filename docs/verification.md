# LeaveBy verification

October 20, 2026 (America/New_York). Tested source baseline: 0fc19b5c9212c313e096a4504816b80410671813. Finalization changes are course documentation and presentation assets; application code is unchanged from that baseline.

## Build and dependency checks

| Check | Result |
| --- | --- |
| Locked install: npm ci | Passed |
| npm test | 8 passed, 0 failed, including America/New_York spring-forward rejection |
| npm run lint | Passed |
| npm run build | Passed, including TypeScript |
| npm audit --omit=dev | 0 reported vulnerabilities |
| Anonymous HTTPS request | HTTP 200, app HTML and HSTS max-age=63072000 |

The previous full audit documents an unresolved development-tool dependency advisory. The production-only check is not a complete security guarantee.

## Hosted browser checks

URL: https://leaveby.rayhanson.tech. Chrome desktop viewport: 1363 × 936 CSS pixels.

| Case | Observed result |
| --- | --- |
| Reference plan: Jan 2, 2030, 10:00 AM, 30/60/15 | Stop 8:15 AM, leave 8:45 AM, arrive 9:45 AM |
| Edit commute to 75 | All inputs preserved; stop 8:00 AM, leave 8:30 AM, arrival unchanged |
| Blank commute | Calculation blocked; field error shown; other values preserved; first invalid input focused |
| Correct blank commute | Valid value allows recalculation |
| Negative, fractional and text commute | -1, 1.5 and abc each rejected with the duration error |
| Past commitment: Jan 2, 2020 | Rejected with future-date/time message |
| Correct past date | Future date calculates successfully |
| Midnight: Jan 2, 2030, 12:30 AM, 30/60/15 | Stop Jan 1 at 10:45 PM, leave Jan 1 at 11:15 PM; arrive 12:15 AM |
| Explicit zeros | Stop, leave, arrival and commitment coincide |
| Future commitment with past stop | Oct 21, 2026, 12:30 AM and 2880-minute preparation keeps results and shows the stop-now warning |
| Keyboard activation and focus | Enter activates calculation/editing; focus moves to Stop workout, then Tab reaches Edit plan; editing focuses Adjust your plan |
| Reload | Clears the plan and returns the initial form/default durations |
| Desktop appearance | Form and result screenshots inspected; no horizontal document overflow at the observed viewport |

The browser automation's fill operation on native date/time controls initially changed the DOM value without updating React input state. Keyboard changes produced the expected input events and allowed the hosted checks to proceed. No application fix was made on that basis.

A query for hydration warnings returned no entries. Captured console errors referenced a browser-extension content script, rather than LeaveBy application files. This does not establish an entirely extension-free browser environment.

## Scope limits

The available browser interface did not expose viewport or color-scheme emulation. Phone-width and dark-mode visual review remain unverified. Full traversal of native date/time subfields and assistive-technology testing are also not established by the keyboard activation checks above.

Screenshots: [form](../Presentation/media/form.jpg), [reference result](../Presentation/media/result.jpg), [midnight result](../Presentation/media/midnight.jpg).

## Research and presentation checks

- Twenty affinity cards checked against the three recorded interview answers. Persona and POV link to this evidence and preserve the contrasting case.
- Editable Figma file contains three screen states and 44 editable text nodes. Visual review corrected the workout-stop emphasis.
- Ten-slide PPTX passed package, layout, font and import checks. Embedded images were corrected and visually checked. PDF export contains ten pages.
- Required process evidence remains in the prompting/build logs. Retrospective documentation dates remain visible.

Peer feedback remains pending. Test results do not establish that LeaveBy reduces lateness or stress.

