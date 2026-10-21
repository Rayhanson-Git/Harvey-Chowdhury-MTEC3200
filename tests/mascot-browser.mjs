import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const require = createRequire(
  path.join(
    process.env.JIMBRO_QA_MODULES || "/tmp/jimbro-qa-tools",
    "package.json",
  ),
);
const { chromium } = require("playwright");
const appRequire = createRequire(path.resolve("package.json")),
  sharp = appRequire("sharp");
const base = process.env.JIMBRO_URL || "http://127.0.0.1:3100",
  out = process.env.JIMBRO_EVIDENCE || "/tmp/jimbro-release-evidence";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  }),
  page = await context.newPage();
const result = { base, poses: [], transitions: 0, sizes: [], errors: [] };
try {
  await page.goto(base + "/jim-gallery");
  await page.locator(".jim-rig").first().waitFor();
  const ids = await page
    .locator("[id]")
    .evaluateAll((nodes) => nodes.map((n) => n.id));
  assert.equal(new Set(ids).size, ids.length, "Unique SVG resource IDs");
  for (const pose of [
    "idle",
    "greeting",
    "ready",
    "set",
    "rest",
    "progress",
    "warning",
    "preparation",
    "departure",
    "complete",
    "recovery",
    "error",
  ]) {
    const rig = page.locator(`.jim-rig[data-pose="${pose}"]`);
    const frames = [];
    for (const time of [0, 150, 300, 425, 600, 850, 1200, 2400, 3450, 4600]) {
      const sample = await rig.evaluate((svg, time) => {
        svg.getAnimations({ subtree: true }).forEach((a) => {
          a.pause();
          a.currentTime = time;
        });
        const body = svg.querySelector(".jim-body"),
          torso = [...body.children].find((x) => x.tagName === "path");
        const point = (e, x, y) =>
          new DOMPoint(x, y).matrixTransform(e.getCTM());
        const joints = [];
        for (const side of ["left", "right"]) {
          const shoulder = svg.querySelector(`.jim-${side}-shoulder`),
            arm = svg.querySelector(`.jim-${side}-arm`),
            elbow = svg.querySelector(`.jim-${side}-elbow`),
            forearm = svg.querySelector(`.jim-${side}-forearm`);
          const a = point(shoulder, 0, 0),
            b = point(arm, 0, 0),
            c = point(elbow, 0, 0),
            d = point(forearm, 0, 0);
          const local = a.matrixTransform(torso.getCTM().inverse());
          joints.push({
            side,
            shoulderGap: Math.hypot(a.x - b.x, a.y - b.y),
            elbowGap: Math.hypot(c.x - d.x, c.y - d.y),
            insideTorso: torso.isPointInFill(local),
          });
        }
        const clone = svg.cloneNode(true),
          source = [svg, ...svg.querySelectorAll("*")],
          target = [clone, ...clone.querySelectorAll("*")];
        source.forEach((s, i) => {
          if (s.tagName === "style") return;
          const c = getComputedStyle(s),
            t = target[i];
          for (const key of [
            "transform",
            "transformOrigin",
            "transformBox",
            "opacity",
          ])
            t.style[key] = c[key];
          t.style.animation = "none";
        });
        clone.querySelectorAll("style").forEach((x) => x.remove());
        clone.removeAttribute("class");
        clone.setAttribute("width", "600");
        clone.setAttribute("height", "660");
        const rendered = new XMLSerializer().serializeToString(clone);
        clone
          .querySelectorAll(".jim-prop,.jim-confetti,.jim-breath")
          .forEach((x) => x.remove());
        clone.querySelector(":scope > ellipse")?.remove();
        return {
          joints,
          svg: rendered,
          silhouette: new XMLSerializer().serializeToString(clone),
          tracks: svg
            .getAnimations({ subtree: true })
            .map((a) => a.animationName),
        };
      }, time);
      for (const j of sample.joints) {
        assert.ok(j.shoulderGap < 0.01, pose + " shoulder gap");
        assert.ok(j.elbowGap < 0.01, pose + " elbow gap");
        assert.ok(j.insideTorso, pose + " shoulder outside torso");
      }
      // Opaque connected-component sampling on actual evaluated browser transforms.
      const png = await sharp(Buffer.from(sample.svg)).png().toBuffer();
      const { data, info } = await sharp(Buffer.from(sample.silhouette))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const seen = new Uint8Array(info.width * info.height),
        components = [];
      for (let pixel = 0; pixel < seen.length; pixel++)
        if (!seen[pixel] && data[pixel * 4 + 3] > 128) {
          const queue = [pixel];
          seen[pixel] = 1;
          let n = 0;
          for (let q = 0; q < queue.length; q++) {
            const i = queue[q];
            n++;
            const x = i % info.width,
              y = Math.floor(i / info.width);
            for (let dy = -1; dy <= 1; dy++)
              for (let dx = -1; dx <= 1; dx++) {
                if (
                  x + dx < 0 ||
                  x + dx >= info.width ||
                  y + dy < 0 ||
                  y + dy >= info.height
                )
                  continue;
                const v = (y + dy) * info.width + x + dx;
                if (!seen[v] && data[v * 4 + 3] > 128) {
                  seen[v] = 1;
                  queue.push(v);
                }
              }
          }
          components.push(n);
        }
      const major = components.filter((n) => n > 200);
      assert.equal(
        major.length,
        1,
        pose + " detached major body/limb at " + time + "ms: " + major,
      );
      frames.push({
        time,
        joints: sample.joints,
        majorComponents: major.length,
        tracks: sample.tracks,
      });
      if ([0, 425, 2400].includes(time))
        await sharp(png).toFile(path.join(out, `jim-${pose}-${time}.png`));
    }
    result.poses.push({ pose, frames });
  }
  // Pose changes switch the rig's complete SVG attributes atomically (no CSS pose tween).
  // Clone each production pose into the same slot, then sample its actual motion.
  const transitions = await page.evaluate(() => {
    const originals = [...document.querySelectorAll(".jim-rig")],
      slot = document.createElement("div");
    document.body.append(slot);
    let count = 0;
    for (const from of originals)
      for (const to of originals) {
        slot.replaceChildren(from.cloneNode(true));
        slot.replaceChildren(to.cloneNode(true));
        const svg = slot.firstChild;
        for (const time of [0, 150, 600]) {
          svg.getAnimations({ subtree: true }).forEach((a) => {
            a.pause();
            a.currentTime = time;
          });
          for (const side of ["left", "right"]) {
            const a = new DOMPoint(0, 0).matrixTransform(
                svg.querySelector(`.jim-${side}-elbow`).getCTM(),
              ),
              b = new DOMPoint(0, 0).matrixTransform(
                svg.querySelector(`.jim-${side}-forearm`).getCTM(),
              );
            if (Math.hypot(a.x - b.x, a.y - b.y) > 0.01)
              throw Error("transition gap");
          }
        }
        count++;
      }
    slot.remove();
    return count;
  });
  assert.equal(transitions, 144);
  result.transitions = transitions;
  for (const width of [48, 96, 240, 600]) {
    await page.locator(".jim-rig").evaluateAll(
      (nodes, w) =>
        nodes.forEach((x) => {
          x.style.width = w + "px";
          x.style.maxWidth = "none";
        }),
      width,
    );
    await page
      .locator('.jim-rig[data-pose="ready"]')
      .screenshot({ path: path.join(out, "jim-size-" + width + ".png") });
    result.sizes.push(width);
  }
  await page.getByLabel("Play animations", { exact: true }).uncheck();
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
  await page.getByLabel("Play animations", { exact: true }).check();
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
  result.motionOff = true;
  result.systemReducedMotion = true;
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      value: "hidden",
      configurable: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".jim-rig")].every(
      (x) => x.dataset.motion === "off",
    ),
  );
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
  result.simulatedHiddenPage = true;
} finally {
  writeFileSync(path.join(out, "mascot.json"), JSON.stringify(result, null, 2));
  await browser.close();
}
console.log(
  JSON.stringify({
    poses: result.poses.length,
    frames: result.poses.reduce((n, p) => n + p.frames.length, 0),
    transitions: result.transitions,
    sizes: result.sizes,
  }),
);
