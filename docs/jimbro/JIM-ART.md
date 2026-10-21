# Jim — original character and motion source

Created October 21, 2026 for JimBro. Original code-native vector artwork, authored for this product; no stock art, trademarked character, raster tracing, image model or external art dependency. Font used in sharing artwork is a platform sans-serif fallback.

## Character sheet and chosen direction

Jim is a confident cucumber gym buddy. His tall, gently tapered cucumber silhouette, dark square glasses, tiny stem, speckled skin, broad arms, short legs and crimson belt buckle identify him. A large grin and expressive eyebrows keep the humor friendly. His muscle lines are simple cartoon marks; he has no sexualized anatomy. The chosen direction uses thick outlines and limited detail so his face remains readable in a compact dock. A complicated painted character was rejected as a poor match for lightweight, editable animation.

- Canvas: 300 × 330, transparent; ground anchor (150, 310).
- Body anchor: (150, 286); shoulders: (100, 160) / (201, 160).
- Face: glasses centered about (151, 124); eyebrows above, smile below.
- Palette: cucumber #72bd3d, highlight #a5e45d, shade #3c7d32; outline #1d422b; glasses #20292a; cream #f7f8e4; crimson #f16b83.
- Lighting: upper left. Poses keep the same rig, proportions and palette.
- Main layers: shadow, legs/shoes, upper arms, forearms/hands, cucumber body/ridges/speckles, head/eyes/glasses/mouth, torso marks, belt, contextual props.

## Production inventory

| Path | Purpose |
| --- | --- |
| `public/jim-master.svg` | Canonical editable, standalone master. Named vector groups; transparent 300 × 330 canvas. |
| `components/jimbro/jim-character.tsx` | Runtime layered rig, twelve semantic poses and scoped CSS animations. Source asset and animation implementation in one file. |
| `public/icon.svg` | Simplified face, 64 × 64 vector favicon. |
| `public/social.svg` | 1200 × 630 share artwork, using the canonical master. |

SVGs scale without a second high-resolution file. Runtime uses no network image fetch, canvas repaint loop, animation dependency, or raster sheet. Each rig instance has unique gradient IDs. The SVG has a useful state label; speech and essential schedule information belong in HTML outside it.

## Pose and motion inventory

| State | Visual pose / actual runtime action |
| --- | --- |
| Idle | Relaxed stance; torso breathing and occasional eye blink. |
| Greeting | Raised right arm with independently waving forearm. |
| Ready | Both arms flexed; left forearm flexes twice. |
| Set acknowledged | Thumbs-up prop and nodding head; two short gestures. |
| Rest | Lowered arms, relaxed eyes, breath-shaped mouth; breathing and exhale lines. |
| Progress | Flexed arms and spark marks; brief flex and sparkle. |
| Warning | Clock prop; pupils glance toward it and clock hand rotates. |
| Preparation | Directional hand and shirt prop; short pointing gesture. |
| Departure | Directional hand and door/arrow prop; short pointing gesture. |
| Complete | Both arms flexed, celebratory spark marks; brief torso cheer and sparkle. |
| Recovery | Relaxed arms, reassuring smile and drinking cup prop. |
| Error | Paused stance, concerned eyebrows and neutral mouth. |

`motion={false}` makes every layer static. `prefers-reduced-motion: reduce` overrides all animations even when motion is enabled. The parent controller must stop motion when the document is hidden, set event priorities and cooldowns, prevent render-driven restarts, and return transient actions to idle. Finite event gestures do not loop indefinitely; idle/rest decorative movement does.

## Repair, October 21, 2026

The detached viewer-left arm was reproduced in the actual production ready pose. The global `transform-box: fill-box` rule made the arm's SVG pose rotation resolve relative to its moving bounding box rather than the intended shoulder coordinate. Browser matrices measured a 34.22 CSS-pixel shoulder displacement at the 200px gallery rendering. Forearm percentages also moved their effective elbow pivots with pose bounds, and the pointing gesture translated the forearm away from its elbow.

The repaired rig uses view-box coordinates, separate shoulder translation and arm rotation groups, explicit elbow translation wrappers with zero-origin forearm rotations, and overlapping shoulder/elbow shapes. Pointing now rotates at the elbow. The set-acknowledged thumb replaces the right hand within its wrist hierarchy instead of floating beside the torso. Breathing and cheer still animate the shared body parent; blink, wave, flex, nod, thumb, breath, pupils, clock, pointing and spark tracks remain independent. Gradient IDs still come from React useId.

`public/jim-master.svg` is now regenerated from the actual neutral runtime rig by `scripts/build-brand.mjs`, and social artwork uses that export. The runtime component is the editable canonical geometry/motion source; the standalone SVG is its editable vector export. No divergent manually patched master.

Regression source: `tests/mascot-browser.mjs`. It freezes actual browser animations at ten times per pose, compares shoulder/elbow matrices, checks shoulder points inside the torso, and rasterizes evaluated transforms for alpha-component connectivity (decorative props, confetti, breath and shadow excluded). Representative 0/425/2400ms frames are captured. This verifies 120 sampled frames and 144 discrete pose changes; it is not a mathematical proof for every infinitesimal frame. Pose attributes switch atomically; there is no hidden interpolating pose tween. Sizes 48/96/240/600px, unique IDs, explicit motion-off, system reduced motion and simulated document hiding are included. Current final-source results live in WEB-VERIFICATION.md.

All logo/icon/share assets and provenance are in [BRAND-ASSETS.md](BRAND-ASSETS.md). No image-generation model or external character source was used.
