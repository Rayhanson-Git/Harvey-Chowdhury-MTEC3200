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
