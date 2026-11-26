// node shot2.mjs <urlSubstring> <out.png> "<js async>"  -> modo móvil, espera a que el juego cargue,
// pasa el selector de dispositivo, corre el JS y saca screenshot. Todo en una sola conexión CDP.
import { writeFileSync } from "node:fs";
const [, , match, out, js = ""] = process.argv;
const list = await (await fetch("http://127.0.0.1:9333/json/list")).json();
const tgt = list.find((t) => t.type === "page" && t.url.includes(match));
const ws = new WebSocket(tgt.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const send = (method, params = {}) =>
  new Promise((res) => {
    const my = ++id;
    const h = (ev) => { const m = JSON.parse(ev.data); if (m.id === my) { ws.removeEventListener("message", h); res(m.result); } };
    ws.addEventListener("message", h);
    ws.send(JSON.stringify({ id: my, method, params }));
  });
const evalJs = async (code) => {
  const r = await send("Runtime.evaluate", { expression: `(async()=>{${code}})()`, awaitPromise: true, returnByValue: true, userGesture: true });
  return r && r.result ? r.result.value : r;
};
await send("Emulation.setDeviceMetricsOverride", { width: 430, height: 900, deviceScaleFactor: 1, mobile: true });
// esperar a que el juego esté listo (puede recargar al cambiar el viewport, y esa recarga tarda en arrancar)
await new Promise((r) => setTimeout(r, 6000));
for (let i = 0; i < 60; i++) {
  await new Promise((r) => setTimeout(r, 500));
  const ok = await evalJs(`return !!(window.FL_CHESS && document.getElementById('ageBtn') && typeof lifeLive!=='undefined')`).catch(() => false);
  if (ok) break;
}
await new Promise((r) => setTimeout(r, 1500));
// solo si el selector está visible: el botón recarga el juego
await evalJs(`const b=[...document.querySelectorAll('*')].find(e=>e.textContent==='Play on Mobile' && e.offsetParent!==null && e.getBoundingClientRect().height>0); if(b){ b.click(); await new Promise(r=>setTimeout(r,1200)); }`);
const result = js ? await evalJs(js) : null;
await new Promise((r) => setTimeout(r, 400));
const { data } = await send("Page.captureScreenshot", { format: "png" });
writeFileSync(out, Buffer.from(data, "base64"));
console.log(JSON.stringify(result));
ws.close();
