// node snap.mjs <url> <out.png> <w> <h>  -> abre una pestaña nueva en el Brave de debug (9333), saca screenshot y la cierra
import { writeFileSync } from "node:fs";
const [, , url, out, w = "1100", h = "860"] = process.argv;
const t = await (await fetch(`http://127.0.0.1:9333/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" })).json();
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
await send("Page.enable");
await send("Page.navigate", { url });
await new Promise((r) => setTimeout(r, 1500));
const { data } = await send("Page.captureScreenshot", { format: "png" });
writeFileSync(out, Buffer.from(data, "base64"));
ws.close();
await fetch(`http://127.0.0.1:9333/json/close/${t.id}`);
console.log("ok");
