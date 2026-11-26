// node gunshot.mjs <out.png> ["<js async a correr antes>"]
// Conecta por CDP (9333) a la página del juego, espera a que arranque, corre el JS y guarda captura.
import { writeFileSync } from "node:fs";

const [, , out, pre = ""] = process.argv;
const PORT = 9333;
const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const tgt = list.find((t) => t.type === "page" && /game\.html/.test(t.url)) || list.find((t) => t.type === "page");
if (!tgt) throw new Error("no hay pestaña del juego");
const ws = new WebSocket(tgt.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));

let id = 0;
const send = (method, params = {}) =>
  new Promise((res) => {
    const my = ++id;
    const h = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id === my) {
        ws.removeEventListener("message", h);
        res(m.result);
      }
    };
    ws.addEventListener("message", h);
    ws.send(JSON.stringify({ id: my, method, params }));
  });

const evalJs = async (code) => {
  const r = await send("Runtime.evaluate", {
    expression: `(async()=>{${code}})()`,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true,
  });
  return r && r.result ? (r.result.value !== undefined ? r.result.value : r.result.description) : r;
};

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1366, height: 900, deviceScaleFactor: 1, mobile: false });

// esperar arranque del juego
let ready = false;
for (let i = 0; i < 80; i++) {
  const ok = await evalJs(`return !!(document.getElementById('ageBtn') && typeof state !== 'undefined' && typeof sList !== 'undefined')`).catch(() => false);
  if (ok) {
    ready = true;
    break;
  }
  await new Promise((r) => setTimeout(r, 500));
}
if (!ready) console.log("AVISO: el juego no reportó listo");

console.log("URL:", (await evalJs("return location.href")).toString());
if (pre) {
  const out2 = await evalJs(pre);
  console.log("pre ->", JSON.stringify(out2));
}
await new Promise((r) => setTimeout(r, 700));
const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log("guardado", out);
ws.close();
