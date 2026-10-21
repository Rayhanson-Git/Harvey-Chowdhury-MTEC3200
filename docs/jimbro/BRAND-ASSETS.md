# JimBro brand assets

Original production family, October 21, 2026. The selected identity is the geometric JIMBRO wordmark, crimson full stop, and Jim's cucumber face with signature glasses. The full muscular Jim remains the animated companion. No purchased assets, stock marks, traced artwork, generated character variants, or font outlines are used. Letter paths are original editable geometry in `scripts/build-brand.mjs`; character source is `components/jimbro/jim-character.tsx`. Existing original compact face geometry is retained.

| Asset | Intended use |
|---|---|
| `public/brand/wordmark-dark.svg` | Pale lettering on dark surfaces; primary wordmark |
| `public/brand/wordmark-light.svg` | Charcoal lettering on white/light surfaces |
| `public/brand/wordmark-mono.svg` | Single-ink wordmark for reproduction |
| `public/brand/lockup-dark.svg` | Selected app navigation identity, face + wordmark |
| `public/brand/lockup-light.svg` | Face + wordmark on light surfaces |
| `public/brand/lockup-mono.svg` | Single-ink lockup using negative-space glasses |
| `public/brand/app-mark.svg`, `public/icon.svg` | Identical compact face mark; standalone icon/favicon source |
| `public/brand/app-mark-mono.svg` | Single-ink compact mark |
| `public/brand/icon-16.png`, `icon-32.png`, `icon-48.png` | Actual-size browser icon exports |
| `public/brand/icon-192.png`, `icon-512.png` | Web manifest home-screen icons |
| `public/apple-touch-icon.png` | 180px Apple home-screen icon |
| `app/favicon.ico` | 16/32/48px multi-image browser favicon |
| `public/jim-master.svg` | Editable, neutral-pose vector export of the repaired production rig |
| `public/social.svg`, `public/social.png` | Editable 1200×630 share artwork and optimized PNG derivative |

Run `node scripts/build-brand.mjs` from the repository root to regenerate derivatives with the locked TypeScript/React/Sharp dependencies. No runtime image-generation or font service. SVG files have no external resources. The rig source is canonical for geometry and motion; master and share artwork are regenerated from it rather than maintained as divergent drawings. Runtime SVG gradient IDs are unique per React instance. Independent SVG image files have their own document scope.

Palette: background #0c0d0f, lettering #f4f3ef / #20292a, crimson #e11d48, cucumber #72bd3d with #a5e45d and #3c7d32 shading, outline #1d422b, glasses #20292a. Reserve one icon-eye width around a compact mark and one letter-stroke height around a wordmark. Keep the full character at 96px or larger where possible; use the compact face at 16/32/48px. Do not distort, rotate, recolor individual letters, add glow, or put pale lettering on light surfaces. Mono artwork uses transparent negative space; place it on a contrasting surface. SVG wordmarks contain paths, so editing and display do not require a font installation.

Integration: app navigation uses `lockup-dark.svg`; root metadata uses icon/apple/share derivatives; `/manifest.webmanifest` declares 192/512 icons. Providing a manifest does not guarantee offline launch or background alarms. The logo family and 16/32/48px face exports were visually reviewed in a browser at actual size; see current verification record for final test status.
