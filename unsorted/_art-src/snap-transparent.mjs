// node snap-transparent.mjs <file.html> <out.png> <w> <h> -> screenshot con fondo transparente (Brave debug en 9333)
import { writeFileSync } from "node:fs";
const [, , file, out, w = "480", h = "480"] = process.argv;
const t = await (await fetch(`http://127.0.0.1:9333/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const send = (method, params = {}) =>
  new Promise((res) => {
    const my = ++id;
    const hnd = (ev) => { const m = JSON.parse(ev.data); if (m.id === my) { ws.removeEventListener("message", hnd); res(m.result); } };
    ws.addEventListener("message", hnd);
    ws.send(JSON.stringify({ id: my, method, params }));
  });
await send("Emulation.setDeviceMetricsOverride", { width: +w, height: +h, deviceScaleFactor: 1, mobile: false });
await send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
await send("Page.enable");
await send("Page.navigate", { url: "file:///" + file.replace(/\\/g, "/") });
await new Promise((r) => setTimeout(r, 1200));
const { data } = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: +w, height: +h, scale: 1 } });
writeFileSync(out, Buffer.from(data, "base64"));
ws.close();
await fetch(`http://127.0.0.1:9333/json/close/${t.id}`);
console.log("ok");
