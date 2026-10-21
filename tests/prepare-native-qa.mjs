// Disposable native-browser storage checks. Generated files are never deployed.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, cpSync } from "node:fs";
const root = "public/qa-native";
mkdirSync(root, { recursive: true });
execFileSync(
  "node_modules/.bin/tsc",
  [
    "lib/jimbro/storage.ts",
    "lib/jimbro/personality.ts",
    "--outDir",
    root,
    "--module",
    "esnext",
    "--target",
    "es2022",
    "--moduleResolution",
    "bundler",
    "--rewriteRelativeImportExtensions",
    "--skipLibCheck",
    "--strict",
  ],
  { stdio: "inherit" },
);
const path = `${root}/jimbro/storage.js`;
writeFileSync(
  path,
  readFileSync(path, "utf8").replace('"jimbro"', '"jimbro-qa-release"'),
);
cpSync("tests/native-storage-suite.js", `${root}/suite.js`);
writeFileSync(
  `${root}/index.html`,
  `<!doctype html><html lang="en"><meta charset="utf-8"><title>JimBro isolated native storage verification</title><body style="font:16px system-ui;background:#111;color:#eee;padding:30px"><h1>Native IndexedDB verification</h1><p>Disposable database: jimbro-qa-release. Production records are never used.</p><button id="run">Run isolated checks</button><pre id="result">Ready.</pre><script type="module" src="suite.js"></script></body></html>`,
);
console.log(
  "Prepared /qa-native/index.html; delete public/qa-native before release.",
);
