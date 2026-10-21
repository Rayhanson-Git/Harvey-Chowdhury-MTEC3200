# JimBro interface system

Deep charcoal provides the working surface; crimson identifies primary actions and time urgency; pale cucumber green marks Jim and positive feedback. Shared Tailwind tokens in `app/globals.css`: `jim-background` #0c0d0f, `jim-panel` #111215, `jim-raised` #17181b, `jim-crimson` #e11d48 and `jim-positive` #c1e88b. Neutral body text is at least neutral-400 against charcoal. No meaning depends only on color.

System sans-serif avoids runtime font downloads; mono is reserved for clocks. Page headings 30–44 px, section headings 24 px, body 14–16 px, compact metadata 10–12 px. Spacing uses the existing Tailwind scale, cards use rounded-3xl, inputs/buttons rounded-xl or the existing shadcn radii, borders are restrained white/10–20. Elevation is concentrated on modal and timer surfaces.

Existing shadcn Button/Input remain the primitives. `buttonStyle`, `secondaryStyle` and `inputStyle` in ScheduleEditor are shared throughout; SectionCard, AppDialog, TimerDock and DataChart carry consistent screen/card/dialog/timer/chart behavior. Native dialog supplies modal semantics, initial focus, Escape handling, focus containment and restored focus. All interactive inputs have labels; key actions are 44–48+ px. The mobile navigation exposes all five destinations, and a compact sticky clock stays above the logger. It occupies layout space and does not float over fields.

Motion is an inexpensive SVG/CSS rig with small transforms and opacity. No competing animation library is added. Pose changes use event IDs, persistent phrase/alert receipts and priorities. Hidden-page motion pauses; app and system reduced-motion controls retain static poses and essential text. Gallery at `/jim-gallery` demonstrates all states.

First visit, no matches, empty history/progress, loading, save failures, blocked storage, conflict/retry, interrupted session, overdue deadline, import failure/success and disabled saving states have explicit messages. Errors preserve form input while persisted completed work remains in IndexedDB. Human usability validation is still pending.
