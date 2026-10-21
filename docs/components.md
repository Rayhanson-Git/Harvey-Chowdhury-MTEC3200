# Component inventory

shadcn/ui is configured using its documented manual installation, with the new-york style, neutral tokens, Tailwind v4 and the existing `@/*` alias.

- Configuration: `components.json`
- Shared class helper: `lib/utils.ts`
- Tokens and animation import: `app/globals.css`
- Dependencies: class-variance-authority, clsx, tailwind-merge, lucide-react, tw-animate-css
- `components/ui/input.tsx`: shadcn/ui Input for all five entry fields.
- `components/ui/button.tsx`: shadcn/ui Button for Calculate times; adds the official radix-ui dependency.
- `components/plan-field.tsx`: visible label, input, associated error text.
- `components/plan-form.tsx`: controlled entry/edit values, validation, focus and status feedback.

The Input and Button source was retrieved through GitHub from `shadcn-ui/ui`, `apps/v4/registry/new-york-v4/ui/`, on October 19, 2026. Only the `cn` import was adapted to the existing local `@/lib/utils` helper.

Current mapping: Calculate times → Button; date/time/durations → Input with visible labels; validation → inline text. Results now use semantic headings and a definition list inside the existing page panel; no extra Card component is needed.

The automatic installer could not reach ui.shadcn.com in this environment. Manual setup followed https://v3.shadcn.com/docs/installation/manual. Add components later with the compatible shadcn CLI or the official documented source, reviewing any generated changes before committing.

- `components/plan-result.tsx`: workout stop, departure, breakdown, arrival, commitment and Edit plan; reuses Button.
- `lib/plan-input.ts`: validation and calculation shared by initial submission and recalculation.

## JimBro implementation

The original form/result components remain unchanged and are served at `/leaveby`. JimBro at `/` reuses the existing shadcn/ui Button and Input; no UI package was added. Native labeled select/radio/checkbox controls cover simple choices; semantic sections, lists and tables cover presentation.

| File in `components/jimbro/` | Elements and purpose |
| --- | --- |
| `workout-app.tsx` | Shared application shell, section navigation, save errors and foreground alert banner |
| `section-card.tsx` | Semantic section, heading and responsive panel |
| `schedule-editor.tsx` | Labeled date/time/duration Inputs, day label, DST occurrence radios, timezone reconfirmation and save Button |
| `workout-logger.tsx` | Search Input, category/unit selects, exercise buttons, set-entry Inputs and edit/remove controls |
| `session-countdown.tsx` | Sticky deadline label/countdown, overdue text and expanded-plan Button |
| `session-actions.tsx` | Phase status, actual-action confirmations and inline finish/cancel confirmation |
| `workout-history.tsx` | Workout/day totals, month/label filters, dated session list and correction view |
| `body-weight-tracker.tsx` | Dated positive measurements, explicit units, converted comparison and original-unit table |
| `use-workout-store.ts` | Shared persistence/reload controller, visible clock, cross-tab updates and optional user-enabled audio |

The clock remains outside live regions; phase/status changes are announced. Inputs remain mounted while changing sections so ordinary navigation does not discard a draft. Runtime, browser and accessibility evidence is tracked separately in [implementation verification](jimbro/IMPLEMENTATION.md).

JimBro release layout: SessionCountdown occupies a dedicated sticky desktop column above the session controls; narrow screens retain a sticky countdown with focus scroll clearance. The workout logger stays in the other column. Existing shadcn Button/Input are reused; no application dependency was added.

## JimBro complete web release

Retained shadcn/ui Button and Input; no new application dependency or shadcn component added. Product components: SectionCard, AppDialog (native modal semantics/focus), RoutineLibrary/editor/preview, ActivePlan, WorkoutLogger, TimerDock, HistoryPanel, ProgressPanel/DataChart, SettingsPanel, JimCharacter/JimGallery. Shared appearance is documented in `docs/jimbro/DESIGN-SYSTEM.md`. Data, phrase and mascot controllers remain separate from the UI.
