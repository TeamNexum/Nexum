import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const binary = resolve("src-tauri", "target", "debug", process.platform === "win32" ? "nexum-desktop.exe" : "nexum-desktop");
const edgeDriver = resolve("src-tauri", "target", "debug", "msedgedriver.exe");
const modeId = "00000000-0000-4000-8000-00000000e2e0";
const port = 20000 + process.pid % 10000;
const base = `http://127.0.0.1:${port}`;
assert.ok(existsSync(binary), `Tauri binary missing: ${binary}; run npm run tauri build -- --debug --no-bundle`);

const driver = spawn(
  process.platform === "win32" ? "tauri-driver.exe" : "tauri-driver",
  [
    "--port", String(port),
    "--native-port", String(port + 1),
    ...(process.platform === "win32" && existsSync(edgeDriver) ? ["--native-driver", edgeDriver] : []),
  ],
  { stdio: "inherit" },
);
let session;

async function request(method, path, body) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok || data.value?.error) {
    throw new Error(`${method} ${path}: ${JSON.stringify(data.value)}`);
  }
  return data.value;
}

async function until(fn, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  let last;
  while (Date.now() < deadline) {
    try {
      const result = await fn();
      if (result) return result;
    } catch (error) {
      last = error;
    }
    await new Promise((done) => setTimeout(done, 250));
  }
  throw last ?? new Error("Timed out waiting for Tauri UI");
}

function path(part) {
  return `/session/${session}${part}`;
}

async function element(selector) {
  const value = await request("POST", path("/element"), { using: "css selector", value: selector });
  return value["element-6066-11e4-a52e-4f735466cecf"];
}

async function elements(selector) {
  const values = await request("POST", path("/elements"), { using: "css selector", value: selector });
  return values.map((value) => value["element-6066-11e4-a52e-4f735466cecf"]);
}

async function textOf(selector) {
  const id = await element(selector);
  return request("GET", path(`/element/${id}/text`));
}

async function invoke(command, args) {
  return request("POST", path("/execute/async"), {
    script: "const done = arguments[arguments.length - 1]; window.__TAURI__.core.invoke(arguments[0], arguments[1]).then(done, e => done({ error: String(e) }));",
    args: [command, args],
  });
}

try {
  await until(async () => {
    if (driver.exitCode !== null) throw new Error(`tauri-driver exited: ${driver.exitCode}`);
    try { await request("GET", "/status"); return true; } catch { return false; }
  });
  const created = await request("POST", "/session", {
    capabilities: { alwaysMatch: { browserName: "wry", "tauri:options": { application: binary } } },
  });
  session = created.sessionId;
  await until(async () => (await textOf(".brand-name")) === "NEXUM");

  const saved = await invoke("save_mode", { mode: {
    id: modeId,
    name: "Nexum smoke mode",
    category: "custom",
    steps: [{ order: 1, type: "system.launch_app", params: { path: "nexum-smoke-nonexistent-executable" }, enabled: true, on_error: "continue" }],
  } });
  assert.equal(saved?.error, undefined, JSON.stringify(saved));
  await request("POST", path("/refresh"), {});
  const card = await until(async () => {
    for (const id of await elements(".cine-card:not(.starter)")) {
      const label = await request("GET", path(`/element/${id}/text`));
      if (label.includes("Nexum smoke mode")) return id;
    }
    return false;
  });
  await request("POST", path("/execute/sync"), {
    script: "arguments[0].scrollIntoView({ block: 'center', inline: 'center' }); arguments[0].click();",
    args: [{ "element-6066-11e4-a52e-4f735466cecf": card }],
  });
  await until(async () => (await textOf(".activity-stream")).includes("Certaines actions ont échoué"));
  const feed = await textOf(".activity-stream");
  assert.match(feed, /Nexum smoke mode/);
  assert.match(feed, /Lancer|application/i);
  assert.match(feed, /Certaines actions ont échoué/);
  console.log("Tauri smoke test passed: launched, activated a mode, and observed the engine event feed.");
} finally {
  if (session) {
    try { await invoke("delete_mode", { id: modeId }); } catch { /* app may already be closed */ }
    try { await request("DELETE", path("")); } catch { /* driver may already be closed */ }
  }
  driver.kill();
}
