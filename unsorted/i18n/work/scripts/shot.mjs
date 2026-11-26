// node shot.mjs <urlSubstring> <out.png> [js to run first]
import { writeFileSync } from "node:fs";
const [, , match, out, pre] = process.argv;
const list = await (await fetch("http://127.0.0.1:9333/json/list")).json();
const tgt = list.find((t) => t.type === "page" && t.url.includes(match));
const ws = new WebSocket(tgt.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const send = (method, params) =>
  new Promise((res) => {
    const my = ++id;
    const h = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id === my) ws.removeEventListener("message", h), res(m.result);
    };
    ws.addEventListener("message", h);
    ws.send(JSON.stringify({ id: my, method, params }));
  });
await send("Emulation.setDeviceMetricsOverride", { width: 430, height: 900, deviceScaleFactor: 1, mobile: true });
if (pre) await send("Runtime.evaluate", { expression: `(async()=>{${pre}})()`, awaitPromise: true, userGesture: true });
await new Promise((r) => setTimeout(r, 600));
const { data } = await send("Page.captureScreenshot", { format: "png" });
writeFileSync(out, Buffer.from(data, "base64"));
ws.close();
