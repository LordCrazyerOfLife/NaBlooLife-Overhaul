// node hardreload.mjs <urlSubstring>  -> borra el caché del navegador y recarga la pestaña (CDP en 9333)
const [, , match] = process.argv;
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
await send("Network.enable");
await send("Network.clearBrowserCache");
await send("Page.reload", { ignoreCache: true });
ws.close();
console.log("reloaded");
