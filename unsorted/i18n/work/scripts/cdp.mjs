// Tiny CDP helper: node cdp.mjs <targetUrlSubstring> <jsFile|-e code>
// Evaluates JS (async allowed) in the first page whose URL contains the substring and prints the JSON result.
import { readFileSync } from "node:fs";
const [, , match, ...rest] = process.argv;
const code = rest[0] === "-e" ? rest.slice(1).join(" ") : readFileSync(rest[0], "utf8");
const list = await (await fetch("http://127.0.0.1:9333/json/list")).json();
const tgt = list.find((t) => t.type === "page" && t.url.includes(match));
if (!tgt) throw new Error("no target matching " + match);
const ws = new WebSocket(tgt.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const send = (method, params) =>
  new Promise((res) => {
    const my = ++id;
    const h = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id === my) ws.removeEventListener("message", h), res(m);
    };
    ws.addEventListener("message", h);
    ws.send(JSON.stringify({ id: my, method, params }));
  });
const r = await send("Runtime.evaluate", {
  expression: `(async()=>{${code}})()`,
  awaitPromise: true,
  returnByValue: true,
  userGesture: true,
});
console.log(JSON.stringify(r.result?.result?.value ?? r.result?.exceptionDetails ?? r, null, 1));
ws.close();
