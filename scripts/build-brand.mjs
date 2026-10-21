// Original JimBro geometric lettering; no font, stock mark or generated character.
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import Module from "node:module";
import path from "node:path";
const require = createRequire(import.meta.url),
  ts = require("typescript"),
  sharp = require("sharp");
const source = path.resolve("components/jimbro/jim-character.tsx");
const compiled = ts.transpileModule(readFileSync(source, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const mod = new Module(source);
mod.filename = source;
mod.paths = Module._nodeModulePaths(path.dirname(source));
mod._compile(compiled, source);
const { renderToStaticMarkup } = require("react-dom/server"),
  React = require("react");
const master = renderToStaticMarkup(
  React.createElement(mod.exports.JimCharacter, { motion: false }),
).replace(/<style>[\s\S]*?<\/style>/, "");
writeFileSync("public/jim-master.svg", master);
const inside = (s) => s.slice(s.indexOf(">") + 1, s.lastIndexOf("</svg>"));
// Each glyph occupies a 44×64 unit cell; deliberately open J, angled M and cut R.
const glyphs = [
  ["J", "M4 4h36v38q0 18-18 18T4 44"],
  ["I", "M22 4v56"],
  ["M", "M4 60V4l18 29L40 4v56"],
  ["B", "M4 60V4h17q19 0 19 14 0 14-19 14H4m17 0q21 0 21 14T21 60H4"],
  ["R", "M4 60V4h17q19 0 19 15T21 34H4m18 0 20 26"],
  ["O", "M22 3Q3 3 3 32t19 29q19 0 19-29T22 3Z"],
];
const letters = (ink) =>
  `<g fill="none" stroke="${ink}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">${glyphs.map(([name, d], i) => `<path data-letter="${name}" transform="translate(${i * 58} 0)" d="${d}"/>`).join("")}</g>`;
const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${body}</svg>`;
mkdirSync("public/brand", { recursive: true });
for (const [variant, ink] of [
  ["dark", "#f4f3ef"],
  ["light", "#20292a"],
  ["mono", "#20292a"],
]) {
  const word = `<g transform="translate(12 12)">${letters(ink)}<rect x="344" y="51" width="10" height="10" rx="2" fill="${variant === "mono" ? ink : "#e11d48"}"/></g>`;
  writeFileSync(`public/brand/wordmark-${variant}.svg`, svg(380, 88, word));
  const mark = inside(readFileSync("public/icon.svg", "utf8"));
  writeFileSync(
    `public/brand/lockup-${variant}.svg`,
    svg(
      490,
      100,
      `<g transform="translate(4 10) scale(1.25)">${variant === "mono" ? mark.replace(/#[\da-fA-F]{6}/g, ink) : mark}</g><g transform="translate(106 18)">${letters(ink)}<rect x="344" y="51" width="10" height="10" rx="2" fill="${variant === "mono" ? ink : "#e11d48"}"/></g>`,
    ),
  );
}
// Face remains readable at favicon sizes; the full rig is reserved for large artwork.
writeFileSync("public/brand/app-mark.svg", readFileSync("public/icon.svg"));
// A useful one-color mark uses negative-space glasses, rather than a solid silhouette.
writeFileSync(
  "public/brand/app-mark-mono.svg",
  svg(
    64,
    64,
    '<path fill="#20292a" fill-rule="evenodd" d="M32 8c11 0 18 8 19 20l1 20c0 9-8 13-20 13S12 57 12 48l1-20C14 16 21 8 32 8Zm-4 1-2-5 8-1 3 6ZM17 24v13h13V24Zm17 0v13h13V24ZM24 44q8 12 16 0Z"/>',
  ),
);
// Replace mono lockup's face with the actual negative-space mark.
let mono = readFileSync("public/brand/lockup-mono.svg", "utf8");
const markStart = mono.indexOf('<g transform="translate(4');
const wordStart = mono.indexOf('<g transform="translate(106');
mono =
  mono.slice(0, markStart) +
  `<g transform="translate(4 10) scale(1.25)">${inside(readFileSync("public/brand/app-mark-mono.svg", "utf8"))}</g>` +
  mono.slice(wordStart);
writeFileSync("public/brand/lockup-mono.svg", mono);
const social = svg(
  1200,
  630,
  `<rect width="1200" height="630" fill="#0c0d0f"/><circle cx="955" cy="315" r="222" fill="#182015"/><g transform="translate(76 136) scale(1.5)">${inside(readFileSync("public/brand/wordmark-dark.svg", "utf8"))}</g><text x="96" y="330" fill="#c1e88b" font-family="Arial,sans-serif" font-size="28">Know your window. Make it count.</text><text x="96" y="399" fill="#f4f3ef" font-family="Arial,sans-serif" font-size="25">Plan. Train. Track. Leave on time.</text><text x="96" y="554" fill="#aaa" font-family="Arial,sans-serif" font-size="22">jimbro.rayhanson.tech</text><g transform="translate(748 75) scale(1.4)">${inside(master)}</g>`,
);
writeFileSync("public/social.svg", social);
await sharp(Buffer.from(social))
  .resize(1200, 630)
  .png()
  .toFile("public/social.png");
for (const size of [16, 32, 48, 180, 192, 512])
  await sharp("public/icon.svg")
    .resize(size, size)
    .png()
    .toFile(
      size === 180
        ? "public/apple-touch-icon.png"
        : `public/brand/icon-${size}.png`,
    );
// ICO directory with three PNG-encoded images (16/32/48).
const pngs = await Promise.all(
  [16, 32, 48].map((s) =>
    sharp("public/icon.svg").resize(s, s).png().toBuffer(),
  ),
);
const header = Buffer.alloc(6 + 16 * 3);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(3, 4);
let offset = header.length;
pngs.forEach((buf, i) => {
  const at = 6 + i * 16,
    size = [16, 32, 48][i];
  header[at] = size;
  header[at + 1] = size;
  header.writeUInt16LE(1, at + 4);
  header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(buf.length, at + 8);
  header.writeUInt32LE(offset, at + 12);
  offset += buf.length;
});
writeFileSync("app/favicon.ico", Buffer.concat([header, ...pngs]));
console.log(
  "Built editable SVG brand family, synchronized Jim master, social PNG, home icons and 3-size favicon.",
);
