// Historical schema-v1 suite. Current v2 acceptance: tests/release-browser.mjs.
// Run against a production build with disposable browser contexts, never a live account.
// Playwright/axe are verification tools installed outside the application dependency tree.
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import path from "node:path";
const qaRequire = createRequire(process.env.JIMBRO_QA_MODULES ? path.join(process.env.JIMBRO_QA_MODULES, "qa.cjs") : import.meta.url);
const { chromium } = qaRequire("playwright");
const AxeBuilder = qaRequire("@axe-core/playwright").default;
const results = [], errors = [], accessibility = [];
const base = process.env.JIMBRO_URL || "http://127.0.0.1:3000";
const reportPath = process.env.JIMBRO_REPORT || "/tmp/jimbro-browser-results.json";
async function step(name, run) {
  try { await run(); results.push({ name, pass: true }); console.log(`PASS ${name}`); }
  catch (error) { results.push({ name, pass: false, error: String(error) }); throw error; }
}
async function database(page) {
  return page.evaluate(() => new Promise((resolve, reject) => {
    const r = indexedDB.open("jimbro", 1); r.onerror = () => reject(r.error);
    r.onsuccess = () => { const db = r.result, tx = db.transaction(["sessions", "meta", "bodyWeight"]); const a = tx.objectStore("sessions").getAll(), b = tx.objectStore("meta").get("active"), c = tx.objectStore("bodyWeight").getAll(); tx.oncomplete = () => { db.close(); resolve({ sessions: a.result, pointer: b.result, weights: c.result }); }; };
  }));
}
async function scan(page, name) {
  const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  accessibility.push({ name, violations: scan.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })) })) });
  assert.equal(scan.violations.length, 0, JSON.stringify(accessibility.at(-1)));
}
(async () => {
  let browser;
  let nativePassed = 0;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, timezoneId: "America/New_York" });
    const page = await context.newPage(); page.setDefaultTimeout(7000);
    page.on("pageerror", (error) => errors.push(String(error)));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.clock.install({ time: new Date("2030-01-02T08:10:00-05:00") });
    await step("initial schedule and keyboard-accessible validation", async () => {
      await page.goto(base); await page.getByRole("heading", { name: "What are you training before?" }).waitFor();
      await page.getByRole("button", { name: "Start workout", exact: true }).click();
      assert.equal(await page.locator("#schedule-date").evaluate((e) => document.activeElement === e), true);
      assert.equal(await page.locator("#schedule-time").inputValue(), "10:00");
    });
    await step("invalid duration preserves other plan inputs", async () => {
      await page.locator("#schedule-date").fill("2030-01-02"); await page.locator("#schedule-commute").fill("-1");
      await page.getByRole("button", { name: "Start workout", exact: true }).click();
      assert.equal(await page.locator("#schedule-commute").getAttribute("aria-invalid"), "true");
      assert.equal(await page.locator("#schedule-preparation").inputValue(), "30");
    });
    await step("start enters logger with one persistent session and dock", async () => {
      await page.locator("#schedule-commute").fill("60"); await page.getByRole("button", { name: "Start workout", exact: true }).click();
      await page.getByRole("heading", { name: "Make every set count." }).waitFor();
      await page.getByRole("complementary", { name: "Session countdown" }).waitFor();
      const db = await database(page); assert.equal(db.sessions.length, 1); assert.equal(db.pointer.id, db.sessions[0].id);
    });
    await step("completed set is saved and navigation retains an unfinished draft", async () => {
      await page.getByLabel("Load", { exact: true }).fill("135"); await page.getByRole("button", { name: "Save completed set", exact: true }).click();
      await page.getByText("Completed set saved.", { exact: true }).waitFor();
      await page.getByLabel("Reps", { exact: true }).fill("11");
      await page.getByRole("button", { name: "History", exact: true }).click(); await page.getByRole("button", { name: "Workout", exact: true }).click();
      assert.equal(await page.getByLabel("Reps", { exact: true }).inputValue(), "11"); assert.equal((await database(page)).sessions[0].sets.length, 1);
    });
    await step("categorized exercise search and second completed set", async () => {
      await page.getByLabel("Muscle group", { exact: true }).selectOption("Back"); await page.getByLabel("Find an exercise", { exact: true }).fill("pulldown");
      await page.getByRole("button", { name: /Lat pulldown/ }).click(); await page.getByLabel("Load", { exact: true }).fill("90");
      await page.getByRole("button", { name: "Save completed set", exact: true }).click();
      await page.getByText("2 completed sets", { exact: true }).waitFor();
      await page.screenshot({ path: "/tmp/jimbro-desktop.png", fullPage: true });
    });
    await step("desktop dock and session controls never overlap workout content", async () => {
      const dock = page.getByRole("complementary", { name: "Session countdown" });
      const heading = page.getByRole("heading", { name: "Make every set count." });
      await page.evaluate(() => scrollTo(0, 0));
      const a = await dock.boundingBox(), b = await heading.boundingBox();
      assert.ok(a.x >= b.x + b.width, "Countdown must occupy a separate desktop column");
      const action = page.getByRole("button", { name: "Finish exercise", exact: true });
      const c = await action.boundingBox(); assert.ok(c.y >= a.y + a.height, "Countdown must not cover session controls");
      await page.screenshot({ path: "/tmp/jimbro-desktop.png", fullPage: true });
    });
    await step("set correction and removal retain schedule and session", async () => {
      const list = page.getByRole("list", { name: "Completed sets", exact: true });
      await list.locator("li").first().getByRole("button", { name: "Edit", exact: true }).click();
      await page.getByLabel("Reps", { exact: true }).fill("9"); await page.getByRole("button", { name: "Save correction", exact: true }).click();
      await page.getByText("Set corrected and saved.", { exact: true }).waitFor();
      await list.locator("li").last().getByRole("button", { name: "Remove", exact: true }).click();
      await page.getByText("1 completed set", { exact: true }).waitFor(); assert.equal((await database(page)).sessions[0].sets[0].reps, 9);
    });
    await step("schedule editing preserves recorded work and recalculates absolute deadlines", async () => {
      await page.getByRole("button", { name: "View plan", exact: true }).click(); await page.locator("#schedule-commute").fill("75");
      const rebase = page.getByRole("button", { name: "Apply my input to the latest saved version", exact: true }); if (await rebase.isVisible()) await rebase.click();
      await page.getByRole("button", { name: "Save updated plan", exact: true }).click(); await page.getByRole("heading", { name: "Make every set count." }).waitFor();
      const s = (await database(page)).sessions[0]; assert.equal(s.sets.length, 1); assert.equal(s.schedule.input.commute, "75"); assert.equal(s.schedule.revision, 2);
    });
    await step("body-weight records persist with explicit mixed units", async () => {
      await page.getByRole("button", { name: "Body weight", exact: true }).click(); await page.locator("#weight-date").fill("2030-01-02");
      await page.locator("#body-weight").fill("170"); await page.getByRole("button", { name: "Save body weight", exact: true }).click(); await page.getByText("Body weight saved.", { exact: true }).waitFor();
      await page.locator("#weight-unit").selectOption("kg"); await page.locator("#body-weight").fill("80"); await page.getByRole("button", { name: "Save body weight", exact: true }).click();
      await page.getByRole("row", { name: /2030-01-02 80 kg/ }).waitFor(); const db = await database(page); assert.equal(db.weights.length, 2); assert.deepEqual(db.weights.map((w) => w.unit).sort(), ["kg", "lb"]);
    });
    await step("reload restores the same active workout and history", async () => {
      const before = await database(page); await page.reload(); await page.getByRole("heading", { name: "Make every set count." }).waitFor();
      const after = await database(page); assert.equal(after.pointer.id, before.pointer.id); assert.equal(after.sessions[0].sets.length, 1); assert.equal(after.weights.length, 2);
    });
    await step("second browser tab resumes the same active session", async () => {
      const other = await context.newPage(); await other.goto(base); await other.getByRole("heading", { name: "Make every set count." }).waitFor();
      const a = await database(page), b = await database(other); assert.equal(a.pointer.id, b.pointer.id); assert.equal(b.sessions.filter((s) => s.status === "active").length, 1); await other.close();
    });
    await step("history correction view has unique field IDs", async () => {
      await page.getByRole("button", { name: "History", exact: true }).click(); await page.getByRole("button", { name: "Review / correct", exact: true }).click();
      assert.equal(await page.evaluate(() => { const ids = [...document.querySelectorAll("[id]")].map((e) => e.id); return ids.length === new Set(ids).size; }), true);
      await scan(page, "history"); await page.getByRole("button", { name: "Workout", exact: true }).click();
    });
    await step("320px logger and expanded plan fit without horizontal overflow", async () => {
      await page.setViewportSize({ width: 320, height: 720 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.screenshot({ path: "/tmp/jimbro-mobile.png", fullPage: true }); await scan(page, "mobile logger");
      await page.getByRole("button", { name: "View plan", exact: true }).click(); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true); await scan(page, "mobile plan");
      await page.setViewportSize({ width: 1280, height: 900 }); await page.getByRole("button", { name: "Workout", exact: true }).click();
    });
    await step("narrow short viewport keeps focused set input clear of countdown", async () => {
      await page.setViewportSize({ width: 320, height: 420 });
      const input = page.getByRole("textbox", { name: "Reps", exact: true });
      await input.focus(); await input.evaluate((e) => e.scrollIntoView({ block: "center" }));
      const a = await input.boundingBox(), b = await page.getByRole("complementary", { name: "Session countdown" }).boundingBox();
      assert.ok(a.y >= b.y + b.height, "Focused input must stay below dock");
      assert.ok(a.y + a.height <= 420, "Focused input must fit visible viewport");
      for (let i = 0; i < 12; i++) {
        await page.keyboard.press("Tab");
        const visible = await page.locator(":focus").evaluate((element) => {
          const r = element.getBoundingClientRect(), hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
          return !!hit && (hit === element || element.contains(hit));
        });
        assert.ok(visible, "Keyboard focus must not be obscured by the countdown");
      }
      await page.setViewportSize({ width: 1280, height: 900 }); await page.evaluate(() => scrollTo(0, 0));
    });
    await step("early exercise finish keeps departure guidance and optional audio", async () => {
      await page.getByRole("button", { name: "Enable alert sound", exact: true }).click();
      await page.getByRole("button", { name: "Finish exercise", exact: true }).click(); await page.getByText(/Workout finished. Shower/).filter({ visible: true }).waitFor();
      assert.ok((await database(page)).pointer); await page.clock.fastForward("20:01"); await page.getByRole("heading", { name: "Time to leave", exact: true }).waitFor();
      await page.getByText(/Departure overdue/).waitFor(); await page.getByRole("button", { name: "Mute alerts", exact: true }).click();
    });
    await step("return after missed deadlines shows current phase instead of replay", async () => {
      await page.clock.fastForward("01:20:00"); await page.reload(); await page.getByRole("heading", { name: "Arrival target reached", exact: true }).waitFor();
      assert.equal(await page.getByRole("button", { name: "Acknowledge", exact: true }).count() <= 1, true);
    });
    await step("actual arrival and explicit completion retain history and clear active pointer", async () => {
      await page.getByRole("button", { name: "I’ve left", exact: true }).click(); await page.getByRole("button", { name: "I’ve arrived", exact: true }).click();
      await page.getByRole("button", { name: "Finish session", exact: true }).click(); await page.getByRole("button", { name: "Confirm finish", exact: true }).click();
      await page.getByRole("heading", { name: "What are you training before?" }).waitFor(); const db = await database(page); assert.equal(db.pointer, undefined); assert.equal(db.sessions[0].status, "completed"); assert.equal(db.sessions[0].sets.length, 1);
    });
    await step("new session does not inherit stale alerts and cancellation stays distinct", async () => {
      await page.locator("#schedule-date").fill("2030-01-03"); await page.getByRole("button", { name: "Start workout", exact: true }).click(); await page.getByRole("heading", { name: "Make every set count." }).waitFor();
      assert.equal(await page.getByRole("button", { name: "Acknowledge", exact: true }).count(), 0);
      await page.getByRole("button", { name: "Cancel session", exact: true }).click(); await page.getByRole("button", { name: "Confirm cancel", exact: true }).click();
      await page.getByRole("heading", { name: "What are you training before?" }).waitFor(); assert.equal((await database(page)).sessions.filter((s) => s.status === "cancelled").length, 1);
    });
    await step("DST gap is rejected and repeated time requires occurrence selection", async () => {
      await page.locator("#schedule-date").fill("2030-03-10"); await page.locator("#schedule-time").fill("02:30"); await page.getByRole("button", { name: "Start workout", exact: true }).click();
      await page.getByText("This date or local time is unavailable. Choose another.", { exact: true }).waitFor();
      await page.locator("#schedule-date").fill("2030-11-03"); await page.locator("#schedule-time").fill("01:30"); assert.equal(await page.getByRole("radio").count(), 2);
      await page.getByRole("button", { name: "Start workout", exact: true }).click(); await page.getByText("This time happens twice. Choose an occurrence below.", { exact: true }).waitFor();
      await page.getByRole("radio").last().check(); await page.getByRole("button", { name: "Start workout", exact: true }).click(); await page.getByRole("heading", { name: "Make every set count." }).waitFor();
    });
    await step("original LeaveBy route still calculates and edits correctly", async () => {
      const original = await context.newPage(); await original.goto(`${base}/leaveby`); await original.getByLabel("Commitment date", { exact: true }).fill("2030-01-02");
      await original.getByRole("button", { name: "Calculate times", exact: true }).click(); await original.getByText("8:15 AM", { exact: true }).waitFor();
      await original.getByRole("button", { name: "Edit plan", exact: true }).click(); assert.equal(await original.getByLabel("Commute (minutes)", { exact: true }).inputValue(), "60"); await original.close();
    });
    await step("failed set save retains input and retry persists exactly once", async () => {
      const originalPut = await page.evaluateHandle(() => IDBObjectStore.prototype.put);
      await page.evaluate(() => { IDBObjectStore.prototype.put = function () { throw new DOMException("Injected quota failure", "QuotaExceededError"); }; });
      try {
        await page.getByLabel("Reps", { exact: true }).fill("7"); await page.getByLabel("Load", { exact: true }).fill("123");
        await page.getByRole("button", { name: "Save completed set", exact: true }).click(); await page.getByText("Injected quota failure", { exact: true }).waitFor();
        assert.equal(await page.getByLabel("Reps", { exact: true }).inputValue(), "7"); assert.equal(await page.getByLabel("Load", { exact: true }).inputValue(), "123");
      } finally { await page.evaluate((fn) => { IDBObjectStore.prototype.put = fn; }, originalPut); await originalPut.dispose(); }
      await page.getByRole("button", { name: "Save completed set", exact: true }).click(); await page.getByText("Completed set saved.", { exact: true }).waitFor();
      const db = await database(page), current = db.sessions.find((s) => s.id === db.pointer.id); assert.equal(current.sets.length, 1); assert.equal(current.sets[0].load, 123);
    });
    await step("unavailable storage blocks a new session with a visible recovery path", async () => {
      const denied = await context.newPage(); await denied.addInitScript(() => Object.defineProperty(window, "indexedDB", { value: undefined, configurable: true }));
      await denied.goto(base); await denied.getByText("Browser storage is unavailable. Your work cannot be saved in this browser.", { exact: true }).waitFor();
      assert.equal(await denied.getByRole("button", { name: "Start workout", exact: true }).count(), 0); await denied.getByRole("button", { name: "Refresh saved data", exact: true }).waitFor(); await denied.close();
    });
    await step("midnight dates and zero-duration boundaries render correctly", async () => {
      const fresh = await browser.newContext({ timezoneId: "America/New_York" }), zero = await fresh.newPage();
      await zero.clock.install({ time: new Date("2030-01-02T08:10:00-05:00") }); await zero.goto(base);
      await zero.locator("#schedule-date").fill("2030-01-03"); await zero.locator("#schedule-time").fill("00:30");
      await zero.getByRole("button", { name: "Start workout", exact: true }).press("Enter"); await zero.getByRole("button", { name: "View plan", exact: true }).click();
      await zero.locator("dl").getByText(/Jan 2, 10:45 PM/).waitFor(); await zero.locator("dl").getByText(/Jan 2, 11:15 PM/).waitFor();
      for (const field of ["preparation", "commute", "buffer"]) await zero.locator(`#schedule-${field}`).fill("0");
      await zero.getByRole("button", { name: "Save updated plan", exact: true }).click(); await zero.getByRole("heading", { name: "Make every set count." }).waitFor();
      await zero.clock.fastForward(Date.parse("2030-01-03T00:31:00-05:00") - await zero.evaluate(() => Date.now()));
      await zero.getByRole("heading", { name: "Commitment due", exact: true }).waitFor(); await zero.getByLabel("Commitment countdown", { exact: true }).getByText("00:00:00", { exact: true }).waitFor(); await fresh.close();
    });
    await step("timezone change preserves the saved deadline and requires edit confirmation", async () => {
      const profile = `/tmp/jimbro-zone-verification-${process.pid}`;
      let zone = await chromium.launchPersistentContext(profile, { headless: true, timezoneId: "America/New_York" });
      let tab = zone.pages()[0]; await tab.clock.install({ time: new Date("2030-01-02T08:10:00-05:00") }); await tab.goto(base);
      await tab.locator("#schedule-date").fill("2030-01-02"); await tab.getByRole("button", { name: "Start workout", exact: true }).click(); await tab.getByRole("heading", { name: "Make every set count." }).waitFor();
      const before = (await database(tab)).sessions[0].schedule.commitment; await zone.close();
      zone = await chromium.launchPersistentContext(profile, { headless: true, timezoneId: "Asia/Dhaka" }); tab = zone.pages()[0];
      await tab.clock.install({ time: new Date("2030-01-02T08:10:00-05:00") }); await tab.goto(base); await tab.getByRole("button", { name: "View plan", exact: true }).click();
      await tab.getByRole("button", { name: "Save updated plan", exact: true }).click(); await tab.getByText("Confirm the plan timezone before saving.", { exact: true }).waitFor();
      await tab.getByRole("checkbox", { name: "Keep editing in America/New_York", exact: true }).check(); await tab.getByRole("button", { name: "Save updated plan", exact: true }).click();
      await tab.getByRole("heading", { name: "Make every set count." }).waitFor(); assert.equal((await database(tab)).sessions[0].schedule.commitment, before); await zone.close();
    });
    await step("blocked audio retains a visible phase fallback", async () => {
      const blocked = await context.newPage();
      await blocked.addInitScript(() => Object.defineProperty(window, "AudioContext", { value: class { constructor() { throw new Error("Audio blocked for test"); } } }));
      await blocked.goto(base); await blocked.getByRole("heading", { name: "Make every set count." }).waitFor();
      await blocked.getByRole("button", { name: "Enable alert sound", exact: true }).click();
      await blocked.getByText("Sound could not play. Visual phase alerts will still appear.", { exact: true }).waitFor();
      assert.equal(await blocked.getByRole("button", { name: "Mute alerts", exact: true }).count(), 0);
      await blocked.getByRole("complementary", { name: "Session countdown" }).waitFor(); await blocked.close();
    });
    await step("native IndexedDB transaction and real-reload fixture", async () => {
      const fixture = await context.newPage(); await fixture.goto("http://127.0.0.1:4876"); await fixture.waitForFunction(() => /\d+ passed; \d+ failed/.test(document.querySelector("#results")?.textContent || ""), { timeout: 20000 });
      const text = await fixture.locator("#results").textContent(); const count = text.match(/(\d+) passed; (\d+) failed/); nativePassed = Number(count[1]); assert.equal(Number(count[2]), 0, text); assert.equal(nativePassed, 18); await fixture.close();
    });
    await step("no application console or hydration errors", async () => { assert.deepEqual(errors, []); });
  } catch (error) { console.error(String(error)); process.exitCode = 1; }
  finally {
    const report = { passed: results.filter((r) => r.pass).length, failed: results.filter((r) => !r.pass).length, nativePassed, results, accessibility, errors };
    writeFileSync(reportPath, JSON.stringify(report, null, 2)); console.log(JSON.stringify({ passed: report.passed, failed: report.failed, nativePassed })); await browser?.close();
  }
})();
