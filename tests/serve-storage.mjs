// Dependency-free native IndexedDB test server. Use a separate origin from the app.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const server = createServer((request, response) => {
  const pathname = new URL(request.url, "http://127.0.0.1").pathname;
  if (pathname === "/result" && request.method === "POST") {
    let text = ""; request.on("data", (data) => { text += data; }); request.on("end", () => { console.log(text); response.end("recorded"); }); return;
  }
  try {
    if (pathname === "/") { response.setHeader("Content-Type", "text/html"); response.end(readFileSync(`${root}tests/storage-browser.html`)); return; }
    if (!/^\/lib\/jimbro\/[a-z-]+\.ts$/.test(pathname)) { response.writeHead(404).end(); return; }
    response.setHeader("Content-Type", "text/javascript"); response.end(stripTypeScriptTypes(readFileSync(root + pathname, "utf8")));
  } catch (error) { response.writeHead(500).end(String(error)); }
});
server.on("error", (error) => { console.error("Storage test server unavailable:", error.message); process.exitCode = 1; });
server.listen(4876, "127.0.0.1", () => console.log("Native IndexedDB tests: http://127.0.0.1:4876 (isolated test origin; fixtures only)"));
