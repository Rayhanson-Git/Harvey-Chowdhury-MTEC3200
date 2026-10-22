# JimBro interface system

Deep charcoal provides the working surface; crimson identifies primary actions and time urgency; pale cucumber green marks Jim and positive feedback. Shared Tailwind tokens in `app/globals.css`: `jim-background` #0c0d0f, `jim-panel` #111215, `jim-raised` #17181b, `jim-crimson` #e11d48 and `jim-positive` #c1e88b. Neutral body text is at least neutral-400 against charcoal. No meaning depends only on color.

System sans-serif avoids runtime font downloads; mono is reserved for clocks. Page headings 30–44 px, section headings 24 px, body 14–16 px, compact metadata 10–12 px. Spacing uses the existing Tailwind scale, cards use rounded-3xl, inputs/buttons rounded-xl or the existing shadcn radii, borders are restrained white/10–20. Elevation is concentrated on modal and timer surfaces.

Existing shadcn Button/Input remain the primitives. `buttonStyle`, `secondaryStyle` and `inputStyle` in ScheduleEditor are shared throughout; SectionCard, AppDialog, TimerDock and DataChart carry consistent screen/card/dialog/timer/chart behavior. Native dialog supplies modal semantics, initial focus, Escape handling, focus containment and restored focus. All interactive inputs have labels; key actions are 44–48+ px. The mobile navigation exposes all five destinations, and a compact sticky clock stays above the logger. It occupies layout space and does not float over fields.

Motion is an inexpensive SVG/CSS rig with small transforms and opacity. No competing animation library is added. Pose changes use event IDs, persistent phrase/alert receipts and priorities. Hidden-page motion pauses; app and system reduced-motion controls retain static poses and essential text. Gallery at `/jim-gallery` demonstrates all states.

First visit, no matches, empty history/progress, loading, save failures, blocked storage, conflict/retry, interrupted session, overdue deadline, import failure/success and disabled saving states have explicit messages. Errors preserve form input while persisted completed work remains in IndexedDB. Human usability validation is still pending.

The navigation selects `/brand/lockup-dark.svg` or `/brand/lockup-light.svg` for the resolved appearance; production color/light/mono variants, compact icons and spacing rules are in BRAND-ASSETS.md. AppDialog explicitly wraps keyboard focus and restores its invoking control after unmount. JimBro captures pointer-click button focus before opening a modal to support WebKit's different default button-focus behavior; original LeaveBy components are unchanged.

## Light, dark and system appearance

Settings exposes a labeled native select with Light, Dark and System preference. New/legacy records default to System. Scoped semantic `jim-*` Tailwind tokens use CSS `light-dark()` under the product surface’s color scheme. Light surfaces use off-white #f5f5f2, white cards, #171b20 text, #59616d muted text, #b3163c crimson text and #335d18 green; dark surfaces retain charcoal and cucumber-green. Inputs, modal dialogs, alerts, charts, calendar markers, focus outlines and navigation logos follow the same choice. Character artwork remains original. LeaveBy’s palette is outside this scope.

Today/Workout headings now explain planning versus logging. Calendar accessible names include the visible day number and a readable month/year, improving speech-control matching.
