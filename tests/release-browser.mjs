// Disposable contexts only. QA dependencies live outside the application.
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";
import path from "node:path";
const require = createRequire(
  path.join(
    process.env.JIMBRO_QA_MODULES || "/tmp/jimbro-qa-tools",
    "package.json",
  ),
);
const { chromium, firefox, webkit } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const base = process.env.JIMBRO_URL || "http://127.0.0.1:3100";
const out = process.env.JIMBRO_EVIDENCE || "/tmp/jimbro-release-evidence";
mkdirSync(out, { recursive: true });
const report = {
  base,
  startedAt: new Date().toISOString(),
  checks: [],
  accessibility: [],
  errors: [],
};
const engine = process.env.JIMBRO_ENGINE || "chromium";
const browser = await { chromium, firefox, webkit }[engine].launch({
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: process.env.JIMBRO_COLOR_SCHEME || "light",
  timezoneId: "America/New_York",
  acceptDownloads: true,
});
await context.addInitScript(() => {
  let seed = 42;
  Math.random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
});
const page = await context.newPage();
page.setDefaultTimeout(10000);
context.on("page", (p) => {
  p.on("pageerror", (e) => report.errors.push(String(e)));
  p.on("console", (m) => {
    if (m.type() === "error") report.errors.push(m.text());
  });
  p.on("response", (r) => {
    if (r.url().startsWith(base) && r.status() >= 400)
      report.errors.push(`${r.status()} ${r.url()}`);
  });
});
page.on("pageerror", (e) => report.errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") report.errors.push(m.text());
});
page.on("response", (r) => {
  if (r.url().startsWith(base) && r.status() >= 400)
    report.errors.push(`${r.status()} ${r.url()}`);
});
const button = (name, root = page) =>
  root.getByRole("button", { name, exact: true });
const label = (name, root = page) =>
  /^(Add exercise|Replace exercise \d+|Unit|Measure|Muscle group|Banter level|Display unit|Commitment type)$/.test(
    name,
  )
    ? root.getByRole("combobox", { name, exact: true })
    : root.getByLabel(name, { exact: true });
const nav = async (name) => {
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("button", { name, exact: true })
    .click();
};
async function step(name, run) {
  try {
    await run();
    report.checks.push({ name, status: "Verified" });
    console.log("PASS " + name);
  } catch (e) {
    report.checks.push({ name, status: "Defective", error: String(e) });
    await page.screenshot({
      path: path.join(out, "failure.png"),
      fullPage: true,
    });
    throw e;
  }
}
async function db(p = page) {
  return p.evaluate(
    () =>
      new Promise((resolve, reject) => {
        const r = indexedDB.open("jimbro");
        r.onerror = () => reject(r.error);
        r.onsuccess = () => {
          const d = r.result,
            t = d.transaction(["sessions", "routines", "bodyWeight", "meta"]),
            data = {};
          for (const [key, store] of Object.entries({
            sessions: "sessions",
            routines: "routines",
            weights: "bodyWeight",
            meta: "meta",
          })) {
            const q = t.objectStore(store).getAll();
            q.onsuccess = () => (data[key] = q.result);
          }
          t.oncomplete = () => {
            d.close();
            resolve(data);
          };
        };
      }),
  );
}
async function scan(name) {
  const a = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  report.accessibility.push({
    name,
    violations: a.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    incomplete: a.incomplete.map((v) => ({ id: v.id, nodes: v.nodes.length })),
  });
  assert.equal(
    a.violations.length,
    0,
    JSON.stringify(report.accessibility.at(-1)),
  );
}
async function exportUI() {
  const download = page.waitForEvent("download");
  await button("Export full JSON backup").click();
  const d = await download;
  const file = path.join(out, d.suggestedFilename());
  await d.saveAs(file);
  return { file, json: JSON.parse(readFileSync(file, "utf8")) };
}
async function upload(value) {
  const chosen = page.waitForEvent("filechooser");
  await label("Import JimBro backup").click();
  await (
    await chosen
  ).setFiles({
    name: "test-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      typeof value === "string" ? value : JSON.stringify(value),
    ),
  });
}
async function finish(open = true) {
  await button("Finish workout").click();
  await label("I’m ending earlier than planned").check();
  await label("Session notes").fill("QA durable notes");
  await button("Save & finish workout").click();
  if (open)
    await page
      .getByRole("heading", { name: "Every session has a story." })
      .waitFor();
}
await page.clock.install({ time: new Date("2030-01-02T08:00:00-05:00") });
let backup, custom, first;
try {
  await step(
    "new-user planner, inline invalid input and honest empty states",
    async () => {
      await page.goto(base);
      await button("Review workouts").waitFor();
      await button("Review workouts").click();
      assert.equal(
        await label("Commitment date").getAttribute("aria-invalid"),
        "true",
      );
      await label("Commitment date").fill("2030-01-02");
      await label("Commitment start").fill("10:00");
      await label("Commute (minutes)").fill("-1");
      await button("Review workouts").click();
      assert.equal(
        await label("Commute (minutes)").getAttribute("aria-invalid"),
        "true",
      );
      await label("Commute (minutes)").fill("60");
      await scan("planner");
    },
  );
  await step(
    "custom routine create, reorder, replace, edit sets/reps/rest and reuse",
    async () => {
      await button("Create routine").click();
      const d = page.getByRole("dialog", { name: "Build your routine" });
      await label("Routine name", d).fill("QA anchor routine");
      await label("Add exercise", d).selectOption("bench-press");
      await label("Add exercise", d).selectOption("squat");
      await d
        .locator("li")
        .last()
        .getByRole("button", { name: "Move up", exact: true })
        .click();
      await label("Replace exercise 1", d).selectOption("leg-press");
      await label("sets for Leg press", d).fill("2");
      await label("reps for Leg press", d).fill("11");
      await label("rest for Leg press", d).fill("45");
      await button("Save routine", d).click();
      await d.waitFor({ state: "hidden" });
      custom = (await db()).routines[0];
      assert.equal(custom.name, "QA anchor routine");
      assert.equal(custom.exercises[0].exerciseId, "leg-press");
      assert.equal(custom.exercises[0].reps, 11);
    },
  );
  await step(
    "custom rename, duplicate and delete confirmation preserve original",
    async () => {
      let card = page
        .locator("div.rounded-2xl")
        .filter({
          has: page.getByRole("heading", {
            name: "QA anchor routine",
            exact: true,
          }),
        })
        .last();
      await button("Edit", card).click();
      await label("Routine name").fill("QA renamed routine");
      await button("Save routine").click();
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      card = page
        .locator("div.rounded-2xl")
        .filter({
          has: page.getByRole("heading", {
            name: "QA renamed routine",
            exact: true,
          }),
        })
        .last();
      await button("Duplicate", card).click();
      await button("Save routine").click();
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      assert.equal((await db()).routines.length, 2);
      const copy = page
        .locator("div.rounded-2xl")
        .filter({
          has: page.getByRole("heading", {
            name: "QA renamed routine copy",
            exact: true,
          }),
        })
        .last();
      await button("Delete", copy).click();
      assert.equal((await db()).routines.length, 2);
      await button("Delete routine", page.getByRole("dialog")).click();
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      assert.equal((await db()).routines.length, 1);
    },
  );
  await step(
    "plan → routine adaptation → one persistent scheduled workout",
    async () => {
      await button("Review workouts").click();
      const choose = page.getByRole("dialog", { name: "Your window is ready" });
      const card = choose
        .locator("div.rounded-2xl")
        .filter({
          has: page.getByRole("heading", {
            name: "QA renamed routine",
            exact: true,
          }),
        })
        .last();
      await button("Preview", card).click();
      const preview = page.getByRole("dialog", {
        name: "QA renamed routine",
        exact: true,
      });
      await button("Use this workout", preview).click();
      await button("Finish workout").waitFor();
      const data = await db();
      assert.equal(data.sessions.length, 1);
      first = data.sessions[0];
      assert.equal(
        first.schedule.commitment,
        Date.parse("2030-01-02T10:00:00-05:00"),
      );
      assert.equal(first.plan[0].reps, 11);
      assert.equal(await label("Reps").inputValue(), "11");
    },
  );
  await step(
    "saved set, correction, units, notes and confirmation before removal",
    async () => {
      await label("Load").fill("20");
      await label("Set notes (optional)").fill("QA first set");
      await button("Save completed set").click();
      await page.getByText("Completed set saved.", { exact: true }).waitFor();
      const list = page.getByRole("list", { name: "Completed sets" });
      await button("Edit", list).click();
      await label("Reps").fill("9");
      await button("Save correction").click();
      await page.getByText("Correction saved.", { exact: true }).waitFor();
      assert.equal((await db()).sessions[0].sets[0].reps, 9);
      await label("Unit").selectOption("lb");
      assert.ok(
        Math.abs(Number(await label("Load").inputValue()) - 44.092) < 0.01,
      );
      await label("Unit").selectOption("kg");
      await button("Save completed set").click();
      await page.waitForFunction(
        () =>
          document.querySelector('[aria-label="Completed sets"]').children
            .length === 2,
      );
      await button("Remove", list.locator("li").last()).click();
      assert.equal((await db()).sessions[0].sets.length, 2);
      await button("Confirm remove set").click();
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      assert.equal((await db()).sessions[0].sets.length, 1);
      await scan("active workout");
    },
  );
  await step(
    "reload and second tab retain same workout; failed writes preserve draft",
    async () => {
      await page.reload();
      await button("Finish workout").waitFor();
      assert.equal((await db()).sessions[0].id, first.id);
      const other = await context.newPage();
      await other.goto(base + "/workout");
      await other
        .getByRole("button", { name: "Finish workout", exact: true })
        .waitFor();
      assert.equal((await db(other)).sessions[0].id, first.id);
      await other.close();
      await page.evaluate(() => {
        window.__originalPut = IDBObjectStore.prototype.put;
        IDBObjectStore.prototype.put = function () {
          throw new DOMException("QA quota failure", "QuotaExceededError");
        };
      });
      await label("Load").fill("23");
      await button("Save completed set").click();
      await page.getByText("QA quota failure", { exact: true }).waitFor();
      assert.equal(await label("Load").inputValue(), "23");
      assert.equal((await db()).sessions[0].sets.length, 1);
      await page.evaluate(
        () => (IDBObjectStore.prototype.put = window.__originalPut),
      );
      await button("Save completed set").click();
      await page.getByText("Completed set saved.", { exact: true }).waitFor();
      assert.equal((await db()).sessions[0].sets.length, 2);
    },
  );
  await step(
    "rest/elapsed pauses do not change deadlines; warning, cutoff and departure survive reload",
    async () => {
      const before = (await db()).sessions[0].schedule;
      await button("Pause elapsed time").click();
      await button("Pause rest").click();
      await page.clock.fastForward(10 * 60000);
      assert.deepEqual((await db()).sessions[0].schedule, before);
      await page.clock.fastForward(1);
      await page
        .getByText(
          "Workout cutoff is approaching. Review remaining sets and allow time to prepare.",
          { exact: true },
        )
        .waitFor();
      await page.clock.fastForward(5 * 60000);
      await page
        .getByText(
          "Workout cutoff reached. Keep completed work and begin preparing.",
          { exact: true },
        )
        .waitFor();
      assert.equal((await db()).sessions[0].status, "active");
      await page.reload();
      await button("Resume elapsed time").waitFor();
      await page.clock.fastForward(30 * 60000);
      await page.getByText("Time to leave", { exact: true }).waitFor();
      assert.equal((await db()).sessions[0].status, "active");
    },
  );
  await step(
    "early finish retains sets, closes reminders only with confirmation",
    async () => {
      await finish(false);
      assert.equal((await db()).sessions[0].sets.length, 2);
      assert.equal((await db()).sessions[0].status, "active");
      await button("Close session & reminders").click();
      await button("Close & keep workout").click();
      await page
        .getByRole("heading", { name: "Every session has a story." })
        .waitFor();
      assert.equal((await db()).sessions[0].endedEarly, true);
    },
  );
  await step(
    "history detail correction and chart recomputation use real saved work",
    async () => {
      await page
        .getByRole("button", { name: /2030-01-02.*QA renamed routine/ })
        .click();
      const d = page.getByRole("dialog", { name: "QA renamed routine" });
      await button(
        "Edit",
        d.getByRole("list", { name: "Completed sets" }).locator("li").first(),
      ).click();
      await label("Load", d).fill("30");
      await button("Save correction", d).click();
      await page.getByText("Correction saved.", { exact: true }).waitFor();
      await button("Close dialog", d).click();
      await nav("Progress");
      await scan("saved progress");
      assert.ok((await page.locator("body").innerText()).includes("kg"));
      await page.screenshot({
        path: path.join(out, "progress.png"),
        fullPage: true,
      });
    },
  );
  await step(
    "history repeat and previous comparable reuse never auto-completes a set",
    async () => {
      await nav("History");
      await page
        .getByRole("button", { name: /2030-01-02.*QA renamed routine/ })
        .click();
      await button("Repeat workout").click();
      await button("Train without a deadline").click();
      await button("Use selected routine").click();
      await button("Finish workout").waitFor();
      await button("Reuse values").click();
      assert.equal(
        (await db()).sessions.filter((s) => s.status === "active")[0].sets
          .length,
        0,
      );
      await label("Measure").selectOption("timed");
      assert.equal(await button("Reuse values").count(), 0);
      await label("Seconds").fill("75");
      await button("Save completed set").click();
      await page.getByText("Completed set saved.", { exact: true }).waitFor();
      await label("Measure").selectOption("distance");
      await label("Distance (km)").fill("2.5");
      await button("Save completed set").click();
      await page.waitForFunction(
        () =>
          document.querySelector('[aria-label="Completed sets"]').children
            .length === 2,
      );
      await finish();
    },
  );
  await step(
    "optional bodyweight entry converts units and persists into backups",
    async () => {
      await nav("Progress");
      await page.locator("#weight-date").fill("2030-01-02");
      await page.locator("#weight-unit").selectOption("kg");
      await page.locator("#body-weight").fill("80");
      await page.locator("#weight-unit").selectOption("lb");
      assert.ok(
        Math.abs(
          Number(await page.locator("#body-weight").inputValue()) - 176.37,
        ) < 0.02,
      );
      await button("Save body weight").click();
      await page.getByText("Body weight saved.", { exact: true }).waitFor();
      assert.equal((await db()).weights.length, 1);
    },
  );
  await step(
    "preferences, notification denial and actual download/upload backup round-trip",
    async () => {
      await nav("Settings");
      await label("Banter level").selectOption("quiet");
      await page.waitForFunction(
        () => !document.querySelector("select[disabled]"),
      );
      await label("Show Jim").click();
      await page.waitForFunction(() =>
        [...document.querySelectorAll("input[type=checkbox]")]
          .filter((x) => x.closest("label")?.textContent.includes("Show Jim"))
          .every((x) => !x.checked && !x.disabled),
      );
      await label("Animate Jim").click();
      await page.waitForFunction(() =>
        [...document.querySelectorAll("input[type=checkbox]")]
          .filter((x) =>
            x.closest("label")?.textContent.includes("Animate Jim"),
          )
          .every((x) => !x.checked && !x.disabled),
      );
      await label("Display unit").selectOption("lb");
      await page.waitForFunction(
        () => !document.querySelector("select[disabled]"),
      );
      await page.evaluate(() => {
        Object.defineProperty(window, "Notification", {
          configurable: true,
          value: class {
            static permission = "denied";
            static async requestPermission() {
              return "denied";
            }
          },
        });
      });
      await button("Enable browser notifications").click();
      await page
        .getByText("Notifications are not enabled. In-app cues still work.", {
          exact: true,
        })
        .waitFor();
      backup = await exportUI();
      assert.equal(backup.json.version, 2);
      assert.equal(backup.json.sessions.length, 2);
      assert.equal(backup.json.weights.length, 1);
      assert.equal(backup.json.preferences.showJim, false);
      assert.equal(backup.json.preferences.unit, "lb");
      await upload(backup.json);
      const d = page.getByRole("dialog", { name: "Review backup import" });
      await button("Import and merge", d).click();
      await d.waitFor({ state: "hidden" });
      assert.equal((await db()).sessions.length, 2);
      await label("Display unit").selectOption("kg");
      await page.waitForFunction(
        () => !document.querySelector("select[disabled]"),
      );
      await upload(backup.json);
      await page.getByRole("radio", { name: /Replace:/ }).check();
      assert.equal(
        (await db()).meta.find((x) => x.key === "preferences").value.unit,
        "kg",
      );
      await button("Confirm replacement").click();
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      const restored = await exportUI();
      for (const key of ["sessions", "routines", "weights", "preferences"])
        assert.deepEqual(restored.json[key], backup.json[key]);
      await scan("settings");
    },
  );
  await step(
    "malformed, incompatible and conflicting file imports leave data unchanged",
    async () => {
      const before = await db();
      await upload("{broken");
      await page
        .getByText("This file is not valid JSON. Nothing has changed.", {
          exact: true,
        })
        .waitFor();
      await upload({ ...backup.json, version: 999 });
      await page
        .getByText("Unsupported or oversized backup. Nothing has changed.", {
          exact: true,
        })
        .waitFor();
      assert.deepEqual(await db(), before);
      const active = structuredClone(backup.json.sessions[0]);
      active.id = "QA-competing-a";
      active.status = "active";
      active.actual = {};
      await upload({ ...backup.json, sessions: [active] });
      await button("Import and merge").click();
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      const after = await db();
      const conflict = { ...active, id: "QA-competing-b" };
      await upload({ ...backup.json, sessions: [conflict] });
      await button("Import and merge").click();
      await page
        .getByRole("dialog")
        .getByText(
          "Finish the current workout before importing another active session.",
          { exact: true },
        )
        .waitFor();
      const stable = await db();
      for (const key of ["sessions", "routines", "weights"])
        assert.deepEqual(stable[key], after[key]);
      assert.deepEqual(
        stable.meta.filter((x) => ["active", "preferences"].includes(x.key)),
        after.meta.filter((x) => ["active", "preferences"].includes(x.key)),
      );
      await button("Close dialog", page.getByRole("dialog")).click();
      await upload(backup.json);
      await page.getByRole("radio", { name: /Replace:/ }).check();
      await button("Confirm replacement").click();
      await page.getByRole("dialog").waitFor({ state: "hidden" });
    },
  );
  await step(
    "direct routes, metadata assets and preserved LeaveBy",
    async () => {
      for (const route of [
        "/today",
        "/workout",
        "/history",
        "/progress",
        "/settings",
        "/jim-gallery",
        "/leaveby",
      ]) {
        assert.ok(
          [200, 304].includes((await page.goto(base + route)).status()),
        );
        await page.locator("main").waitFor();
      }
      await label("Commitment date").fill("2030-01-03");
      await button("Calculate times").click();
      await page.getByText("8:15 AM", { exact: true }).waitFor();
      for (const route of [
        "/icon.svg",
        "/apple-touch-icon.png",
        "/social.png",
        "/brand/lockup-dark.svg",
        "/brand/wordmark-light.svg",
      ])
        assert.equal((await context.request.get(base + route)).status(), 200);
    },
  );
  await step(
    "responsive routes, keyboard dialog focus and automated accessibility",
    async () => {
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 850 });
        for (const route of [
          "/",
          "/workout",
          "/history",
          "/progress",
          "/settings",
          "/jim-gallery",
        ]) {
          await page.goto(base + route);
          await page.locator("main").waitFor();
          const ready =
            route === "/"
              ? button("Review workouts")
              : route === "/workout"
                ? button("Plan a workout")
                : route === "/history"
                  ? button("Previous month")
                  : route === "/progress"
                    ? page.getByRole("combobox", {
                        name: "Period",
                        exact: true,
                      })
                    : route === "/settings"
                      ? button("Export full JSON backup")
                      : page.getByLabel("Play animations", { exact: true });
          await ready.waitFor();
          assert.ok(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            route + " overflow " + width,
          );
        }
        await page.screenshot({
          path: path.join(out, "viewport-" + width + ".png"),
          fullPage: true,
        });
      }
      await page.goto(base);
      await button("Train without a deadline").click();
      const dialog = page.getByRole("dialog", {
        name: "Choose your open workout",
      });
      assert.equal(
        await dialog.evaluate((d) => d.contains(document.activeElement)),
        true,
      );
      for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab");
        assert.equal(
          await dialog.evaluate((d) => d.contains(document.activeElement)),
          true,
        );
      }
      await scan("workout chooser");
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "hidden" });
      assert.equal(
        await button("Train without a deadline").evaluate(
          (x) => x === document.activeElement,
        ),
        true,
      );
    },
  );
  await step(
    "every preset previews and starts its own immutable snapshot",
    async () => {
      const names = [
        "Full body",
        "Push",
        "Pull",
        "Legs",
        "20-minute essentials",
        "Dumbbell only",
        "Bodyweight",
      ];
      for (const name of names) {
        await button("Train without a deadline").click();
        const d = page.getByRole("dialog", {
          name: "Choose your open workout",
        });
        const card = d
          .locator("div.rounded-2xl")
          .filter({ has: page.getByRole("heading", { name, exact: true }) })
          .last();
        await button("Preview", card).click();
        const preview = page.getByRole("dialog", { name, exact: true });
        assert.equal(await preview.locator("li").count(), 3);
        await button("Use this workout", preview).click();
        await button("Finish workout").waitFor();
        const current = (await db()).sessions.find(
          (s) => s.status === "active",
        );
        assert.equal(current.label, name);
        assert.equal(current.plan.length, 3);
        await button("Discard session").click();
        await button("Confirm discard").click();
        await nav("Today");
      }
    },
  );
  await step(
    "direct saved-session link, deliberate deletion and progress recomputation",
    async () => {
      await page.goto(base + "/history");
      await page
        .getByRole("button", { name: /2030-01-02.*QA renamed routine/ })
        .first()
        .click();
      const detail = page.getByRole("dialog", { name: "QA renamed routine" });
      const href = await detail
        .getByRole("link", { name: "Direct link", exact: true })
        .getAttribute("href");
      await page.goto(base + href);
      await page.getByRole("dialog", { name: "QA renamed routine" }).waitFor();
      const before = (await db()).sessions.filter(
        (s) =>
          s.status !== "cancelled" && s.actual.workoutEndedAt && s.sets.length,
      ).length;
      await button("Delete session").click();
      assert.equal(
        (await db()).sessions.filter(
          (s) =>
            s.status !== "cancelled" &&
            s.actual.workoutEndedAt &&
            s.sets.length,
        ).length,
        before,
      );
      await button("Confirm delete").click();
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      assert.equal(
        (await db()).sessions.filter(
          (s) =>
            s.status !== "cancelled" &&
            s.actual.workoutEndedAt &&
            s.sets.length,
        ).length,
        before - 1,
      );
      await nav("Progress");
      await scan("progress after deletion");
    },
  );
  await step(
    "browser scheduling: edits preview, midnight, zero boundaries and DST choices",
    async () => {
      const c = await browser.newContext({ timezoneId: "America/New_York" }),
        p = await c.newPage();
      await p.clock.install({ time: new Date("2030-01-02T08:00:00-05:00") });
      await p.goto(base);
      await p.getByLabel("Commitment date", { exact: true }).fill("2030-01-03");
      await p.getByLabel("Commitment start", { exact: true }).fill("00:30");
      await p.getByText(/Jan 2, 2030(?:,| at) 10:45 PM/).waitFor();
      await button("Review workouts", p).click();
      await button(
        "Start with an empty workout",
        p.getByRole("dialog"),
      ).click();
      await button("Finish workout", p).waitFor();
      await p
        .getByRole("navigation")
        .getByRole("button", { name: "Today", exact: true })
        .click();
      const old = (await db(p)).sessions[0];
      await p.getByLabel("Commute (minutes)", { exact: true }).fill("75");
      assert.equal((await db(p)).sessions[0].schedule.input.commute, "60");
      await p.getByText(/Jan 2, 2030(?:,| at) 10:30 PM/).waitFor();
      await button("Save updated plan", p).click();
      await p.waitForFunction(
        () => !document.querySelector("button[disabled]"),
      );
      assert.equal((await db(p)).sessions[0].schedule.input.commute, "75");
      assert.equal((await db(p)).sessions[0].id, old.id);
      for (const field of [
        "Get ready (minutes)",
        "Commute (minutes)",
        "Buffer (minutes)",
      ])
        await p.getByLabel(field, { exact: true }).fill("0");
      await button("Save updated plan", p).click();
      await p.waitForFunction(
        () => !document.querySelector("button[disabled]"),
      );
      assert.equal((await db(p)).sessions[0].schedule.input.buffer, "0");
      await p
        .getByRole("navigation")
        .getByRole("button", { name: "Workout", exact: true })
        .click();
      await button("Discard session", p).click();
      await button("Confirm discard", p).click();
      await p
        .getByRole("navigation")
        .getByRole("button", { name: "Today", exact: true })
        .click();
      await p.getByLabel("Commitment date", { exact: true }).fill("2030-03-10");
      await p.getByLabel("Commitment start", { exact: true }).fill("02:30");
      await button("Review workouts", p).click();
      assert.equal(
        await p
          .getByLabel("Commitment start", { exact: true })
          .getAttribute("aria-invalid"),
        "true",
      );
      await p.getByLabel("Commitment date", { exact: true }).fill("2030-11-03");
      await p.getByLabel("Commitment start", { exact: true }).fill("01:30");
      assert.equal(await p.getByRole("radio").count(), 2);
      await p.getByRole("radio").last().check();
      await button("Review workouts", p).click();
      await p.getByRole("dialog", { name: "Your window is ready" }).waitFor();
      await c.close();
    },
  );
  await step(
    "storage unavailable offers honest recovery without false save",
    async () => {
      const denied = await context.newPage();
      await denied.addInitScript(() =>
        Object.defineProperty(window, "indexedDB", {
          value: undefined,
          configurable: true,
        }),
      );
      await denied.goto(base);
      await denied
        .getByText(
          "Browser storage is unavailable. Your work cannot be saved in this browser.",
          { exact: true },
        )
        .waitFor();
      assert.equal(
        await denied
          .getByRole("button", { name: "Review workouts", exact: true })
          .count(),
        0,
      );
      await denied.close();
    },
  );
  await step(
    "active plan controls, rest controls, typed measures and repeated finish",
    async () => {
      await nav("Today");
      await button("Train without a deadline").click();
      await button(
        "Start with an empty workout",
        page.getByRole("dialog"),
      ).click();
      await button("Finish workout").waitFor();
      const current = (await db()).sessions.find((s) => s.status === "active");
      await button("Edit plan").click();
      const add = page.getByRole("combobox", {
        name: "Add planned exercise",
        exact: true,
      });
      await add.selectOption("bench-press");
      await page
        .getByRole("combobox", { name: "Exercise 1", exact: true })
        .waitFor();
      await add.selectOption("squat");
      await page
        .getByRole("combobox", { name: "Exercise 2", exact: true })
        .waitFor();
      await page
        .getByRole("button", { name: "Move up", exact: true })
        .last()
        .click();
      await page.waitForFunction(
        () => !document.querySelector("select[disabled]"),
      );
      assert.equal(
        (await db()).sessions.find((s) => s.id === current.id).plan[0]
          .exerciseId,
        "squat",
      );
      await page
        .getByRole("combobox", { name: "Exercise 1", exact: true })
        .selectOption("leg-press");
      await button("Close plan").click();
      await button("Start rest").click();
      const until = (await db()).sessions.find((s) => s.id === current.id).rest
        .endsAt;
      await button("+30s").click();
      assert.equal(
        (await db()).sessions.find((s) => s.id === current.id).rest.endsAt,
        until + 30000,
      );
      await button("Pause rest").click();
      await button("Resume rest").click();
      await button("Skip rest").click();
      for (const [kind, field, value] of [
        ["assisted", "Assistance", "10"],
        ["bodyweight", "Reps", "15"],
        ["timed", "Seconds", "30"],
        ["distance", "Distance (km)", "1"],
      ]) {
        await label("Measure").selectOption(kind);
        await label(field).fill(value);
        await button("Save completed set").click();
        await page.getByText("Completed set saved.", { exact: true }).waitFor();
      }
      assert.equal(
        (await db()).sessions.find((s) => s.id === current.id).sets.length,
        4,
      );
      await button("Finish workout").click();
      await button("Save & finish workout").click({ clickCount: 2 });
      await page
        .getByRole("heading", { name: "Every session has a story." })
        .waitFor();
      assert.equal(
        (await db()).sessions.filter((s) => s.id === current.id).length,
        1,
      );
      assert.equal(
        (await db()).sessions.find((s) => s.id === current.id).sets.length,
        4,
      );
    },
  );
  assert.deepEqual(report.errors, []);
} finally {
  report.finishedAt = new Date().toISOString();
  report.engine = engine;
  writeFileSync(
    path.join(out, "browser-" + engine + ".json"),
    JSON.stringify(report, null, 2),
  );
  await browser.close();
}
console.log(
  JSON.stringify({
    engine,
    passed: report.checks.filter((c) => c.status === "Verified").length,
    errors: report.errors,
  }),
);
