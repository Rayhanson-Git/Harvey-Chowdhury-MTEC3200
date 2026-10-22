// Real UI, disposable profiles only. No user workout history is accessed.
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const require = createRequire(path.join(process.env.JIMBRO_QA_MODULES || "/tmp/jimbro-qa-tools", "package.json"));
const { chromium, firefox, webkit } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const base = process.env.JIMBRO_URL || "http://127.0.0.1:3110";
const out = process.env.JIMBRO_EVIDENCE || "/tmp/jimbro-theme-evidence";
const engine = process.env.JIMBRO_ENGINE || "chromium";
mkdirSync(out, { recursive: true });
const report = { base, engine, checks: [], accessibility: [], errors: [], startedAt: new Date().toISOString() };
const browser = await { chromium, firefox, webkit }[engine].launch();
const context = await browser.newContext({ colorScheme: "light", viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
context.on("page", p => {
  p.on("pageerror", e => report.errors.push(String(e)));
  p.on("console", m => { if (m.type() === "error") report.errors.push(m.text()); });
  p.on("response", r => { if (r.url().startsWith(base) && r.status() >= 400) report.errors.push(`${r.status()} ${r.url()}`); });
});
const page = await context.newPage();
page.setDefaultTimeout(10000);
const choice = () => page.getByRole("combobox", { name: "Color theme", exact: true });
const button = name => page.getByRole("button", { name, exact: true });
async function ready() { await choice().waitFor(); await page.waitForFunction(() => !document.querySelector("select[disabled]")); }
async function appearance(theme, target = page) {
  const background = theme === "light" ? "rgb(245, 245, 242)" : "rgb(12, 13, 15)";
  await target.waitForFunction(bg => { const main = document.querySelector("main"); return main && getComputedStyle(main).backgroundColor === bg; }, background);
  const logo = target.locator(`.jim-brand-${theme}`);
  if (await logo.count()) assert.equal(await logo.isVisible(), true);
}
async function select(theme) {
  await choice().selectOption(theme);
  await page.waitForFunction(t => document.documentElement.dataset.jimTheme === t && !document.querySelector("select[disabled]"), theme);
}
async function scan(name) {
  const result = await new AxeBuilder({ page }).analyze();
  report.accessibility.push({ name, violations: result.violations, incomplete: result.incomplete.map(x => ({ id: x.id, impact: x.impact })) });
  assert.deepEqual(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], name);
}
async function step(name, run) {
  try { await run(); report.checks.push({ name, status: "Verified" }); console.log("PASS " + name); }
  catch (e) { report.checks.push({ name, status: "Defective", error: String(e) }); await page.screenshot({ path: path.join(out, `theme-failure-${engine}.png`), fullPage: true, animations: "disabled" }); throw e; }
}
async function exportUI() {
  const downloaded = page.waitForEvent("download");
  await button("Export full JSON backup").click();
  const download = await downloaded;
  const filename = path.join(out, `synthetic-theme-backup-${engine}.json`);
  await download.saveAs(filename);
  return JSON.parse(readFileSync(filename, "utf8"));
}
async function upload(data) {
  const filename = path.join(out, `synthetic-theme-import-${engine}.json`);
  writeFileSync(filename, JSON.stringify(data));
  const chooser = page.waitForEvent("filechooser");
  await page.getByLabel("Import JimBro backup", { exact: true }).click();
  await (await chooser).setFiles(filename);
}
try {
  await step("System default follows live OS changes; explicit themes override OS", async () => {
    await page.goto(base + "/settings"); await ready();
    assert.equal(await choice().inputValue(), "system"); await appearance("light");
    await page.emulateMedia({ colorScheme: "dark" }); await appearance("dark");
    await select("light"); await appearance("light");
    await page.emulateMedia({ colorScheme: "light" }); await select("dark"); await appearance("dark");
    await page.reload(); await ready(); assert.equal(await choice().inputValue(), "dark"); await appearance("dark");
  });
  await step("Saved choice synchronizes to another tab and the gallery", async () => {
    const second = await context.newPage(); await second.goto(base + "/settings");
    await second.getByRole("combobox", { name: "Color theme", exact: true }).waitFor(); await appearance("dark", second);
    await select("light"); await appearance("light", second);
    await second.waitForFunction(() => document.querySelector('select[aria-describedby="theme-help"]').value === "light");
    await second.goto(base + "/jim-gallery"); await appearance("light", second);
    await select("dark"); await appearance("dark", second); await second.close();
  });
  await step("Light/dark routes, dialogs, logos and 320px layout pass accessibility checks", async () => {
    for (const theme of ["light", "dark"]) {
      await page.goto(base + "/settings"); await ready(); await select(theme);
      for (const route of ["/today", "/workout", "/history", "/progress", "/settings", "/jim-gallery"]) {
        await page.goto(base + route); await appearance(theme);
        if (route !== "/jim-gallery") await page.getByRole("navigation", { name: "Main navigation" }).waitFor();
        if (route === "/settings") await ready();
        else if (route === "/today") await button("Review workouts").waitFor();
        else if (route === "/workout") await button("Plan a workout").waitFor();
        await scan(`${theme} ${route}`);
        for (const width of [320, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${theme} ${route} ${width}`);
        }
      }
      await page.goto(base + "/settings"); await ready();
      const backup = await exportUI(); await upload(backup);
      await page.getByRole("dialog", { name: "Review backup import" }).waitFor();
      await scan(`${theme} import dialog`);
      await page.screenshot({ path: path.join(out, `theme-${theme}-dialog-${engine}.png`), fullPage: true, animations: "disabled" });
      await button("Close dialog").click();
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: path.join(out, `theme-${theme}-mobile-${engine}.png`), fullPage: true, animations: "disabled" });
    }
  });
  await step("Actual file backup restores theme; merge and invalid/legacy imports preserve policy", async () => {
    await page.goto(base + "/settings"); await ready(); await select("dark");
    const backup = await exportUI(); assert.equal(backup.preferences.theme, "dark");
    await select("light"); await upload(backup); await button("Import and merge").click();
    await page.getByRole("dialog").waitFor({ state: "hidden" }); await appearance("light");
    await upload(backup); await page.getByRole("radio", { name: /Replace:/ }).check(); await appearance("light");
    await button("Confirm replacement").click(); await page.getByRole("dialog").waitFor({ state: "hidden" }); await appearance("dark");
    await upload({ ...backup, preferences: { ...backup.preferences, theme: "invalid" } });
    await page.getByText("Invalid preferences.", { exact: true }).waitFor(); await appearance("dark");
    const legacy = structuredClone(backup); delete legacy.preferences.theme;
    await upload(legacy); await page.getByRole("radio", { name: /Replace:/ }).check(); await button("Confirm replacement").click();
    await page.getByRole("dialog").waitFor({ state: "hidden" }); await appearance("light");
    assert.equal(await choice().inputValue(), "system");
  });
  await step("Failed preference writes keep the selected theme and honest error", async () => {
    await select("light");
    await page.evaluate(() => {
      const original = IDBObjectStore.prototype.put;
      window.restoreThemePut = () => { IDBObjectStore.prototype.put = original; };
      IDBObjectStore.prototype.put = function (...args) {
        if (this.name === "meta" && args[0]?.key === "preferences") throw new DOMException("Synthetic theme quota failure", "QuotaExceededError");
        return original.apply(this, args);
      };
    });
    await choice().selectOption("dark");
    await page.getByText("Synthetic theme quota failure", { exact: true }).waitFor();
    await appearance("light"); assert.equal(await choice().inputValue(), "light");
    await page.evaluate(() => window.restoreThemePut()); await select("dark");
  });
  await step("Blocked optional localStorage cache still allows persisted themes", async () => {
    const isolated = await browser.newContext({ colorScheme: "light" });
    await isolated.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } }); });
    const other = await isolated.newPage(); await other.goto(base + "/settings");
    await other.getByRole("combobox", { name: "Color theme", exact: true }).selectOption("dark"); await appearance("dark", other);
    await other.reload(); await other.getByRole("combobox", { name: "Color theme", exact: true }).waitFor(); await appearance("dark", other);
    await isolated.close();
  });
  await step("Cached explicit choice applies before hydration; original LeaveBy palette is unchanged", async () => {
    await select("dark");
    const initial = await context.newPage();
    let release; const held = new Promise(resolve => { release = resolve; });
    await initial.route("**/_next/**/*.js", async route => { await held; await route.continue(); });
    try {
      await initial.goto(base + "/settings", { waitUntil: "commit" });
      await appearance("dark", initial);
      assert.equal(await initial.getByRole("combobox", { name: "Color theme", exact: true }).count(), 0, "UI has not hydrated its stored snapshot yet");
    } finally { release(); }
    await initial.getByRole("combobox", { name: "Color theme", exact: true }).waitFor(); await initial.close();
    await page.goto(base + "/leaveby");
    assert.equal(await page.locator(".jim-theme").count(), 0);
    await page.getByLabel("Commitment date", { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), "rgb(255, 255, 255)");
  });
  assert.deepEqual(report.errors, []);
} finally {
  report.finishedAt = new Date().toISOString();
  writeFileSync(path.join(out, `theme-${engine}.json`), JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify({ engine, checks: report.checks.length, axeScans: report.accessibility.length, errors: report.errors }));
