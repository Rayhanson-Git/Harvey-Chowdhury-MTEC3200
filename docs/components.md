# Component inventory

shadcn/ui is configured using its documented manual installation, with the new-york style, neutral tokens, Tailwind v4 and the existing `@/*` alias.

- Configuration: `components.json`
- Shared class helper: `lib/utils.ts`
- Tokens and animation import: `app/globals.css`
- Dependencies: class-variance-authority, clsx, tailwind-merge, lucide-react, tw-animate-css
- Installed UI components: none yet. Add only what the first wireframe needs during step 4, then record each file here.

Planned mapping: Calculate/Recalculate → Button; date/time/durations → Input with visible labels; result breakdown → Card; validation → inline text. These are plans, not installed components.

The automatic installer could not reach ui.shadcn.com in this environment. Manual setup followed https://v3.shadcn.com/docs/installation/manual. Add components later with the compatible shadcn CLI or the official documented source, reviewing any generated changes before committing.
