// Node harness for penalty.js: fake DOM + fake canvas, auto-clicks, thousands of kicks.
const fs = require("fs");
const noop = () => {};
const handlers = {};
const mkEl = () => {
  const el = { style: {}, children: [], textContent: "", addEventListener: (t, f) => ((handlers[el._id + t] = f)), appendChild: noop, getBoundingClientRect: () => ({ left: 0, top: 0, width: 960, height: 600 }) };
  el.getContext = () => {
    const ctx = {};
    for (const m of ["fillRect","clearRect","beginPath","moveTo","lineTo","closePath","fill","stroke","arc","ellipse","rect","roundRect","save","restore","translate","rotate","scale","setTransform","fillText","strokeText","setLineDash","quadraticCurveTo","bezierCurveTo","drawImage","clip","arcTo"]) ctx[m] = noop;
    ctx.measureText = (s) => ({ width: String(s).length * 7 });
    ctx.createLinearGradient = ctx.createRadialGradient = () => ({ addColorStop: noop });
    return ctx;
  };
  return el;
};
let ids = 0;
const els = {};
global.window = global;
global.innerWidth = 960;
global.innerHeight = 600;
global.devicePixelRatio = 1;
global.addEventListener = noop;
global.document = {
  createElement: () => { const e = mkEl(); e._id = ++ids; return e; },
  body: { appendChild: (e) => { els.last = e; } },
  getElementById: (id) => ({ textContent: "" }),
};
let rafCb = null;
global.requestAnimationFrame = (cb) => { rafCb = cb; return 1; };
global.cancelAnimationFrame = () => { rafCb = null; };
let nowMs = 0;
global.performance = { now: () => nowMs };
global.play = noop;

// capture canvas element: second created element is the canvas
let canvasId;
const origCreate = document.createElement;
let created = 0;
document.createElement = (t) => { const e = origCreate(t); created++; if (t === "canvas" && canvasId === undefined) canvasId = e._id; return e; };

require(process.argv[2]);

const click = (x, y) => handlers[canvasId + "pointerdown"]({ clientX: x, clientY: y });
const step = (frames = 1) => { for (let i = 0; i < frames && rafCb; i++) { nowMs += 50; const cb = rafCb; rafCb = null; cb(nowMs); } };
const runUntil = (cond, max = 4000) => { let n = 0; while (!cond() && n++ < max) step(1); return n < max; };

function oneKick(aim, skill, keeper) {
  let res = null;
  FL_PEN.kick({ name: "Test", skill, keeper, onDone: (r) => (res = r) });
  step(2);
  click(aim.x, aim.y);
  if (!runUntil(() => res)) throw new Error("kick never finished");
  return res;
}

const G = FL_PEN.G;
const spots = {
  "center": { x: G.x + G.w / 2, y: G.y + G.h / 2 },
  "low corner": { x: G.x + 22, y: G.y + G.h - 14 },
  "top corner": { x: G.x + 22, y: G.y + 16 },
  "mid side": { x: G.x + 30, y: G.y + G.h * 0.55 },
  "off target": { x: G.x - 60, y: G.y + 40 },
};
const N = 10000;
console.log("goal% / saved% / post% / wide%   (" + N + " kicks each, logic only)");
for (const [name, aim] of Object.entries(spots)) {
  for (const [skill, keeper] of [[50, 0.5], [70, 0.5], [90, 0.5], [70, 0.2], [70, 0.8]]) {
    const c = { goal: 0, saved: 0, post: 0, wide: 0 };
    for (let i = 0; i < N; i++) {
      const o = FL_PEN._decide({ skill, keeper, pressure: 0 }, aim);
      c[o.result === "over" ? "wide" : o.result]++;
    }
    console.log(name.padEnd(11), "skill", String(skill).padStart(2), "keeper", keeper.toFixed(1), "->", Object.values(c).map((v) => ((v / N) * 100).toFixed(0).padStart(3)).join(" / "));
  }
}
// full state machine, a few real kicks with frames
for (let i = 0; i < 5; i++) oneKick(spots.center, 70, 0.5);
console.log("25 full kicks through the frame loop: ok");

// shootout flow
let flows = { win: 0, lose: 0, lens: [] };
for (let g = 0; g < 3; g++) {
  let res = null;
  FL_PEN.shootout({ name: "Test", skill: 70, keeper: 0.5, oppRate: 0.74, myTeam: "A", oppTeam: "B", onDone: (r) => (res = r) });
  let guard = 0;
  while (!res && guard++ < 200) {
    step(2);
    // aim at a corner whenever the game is waiting for a click
    try { click(G.x + 28, G.y + 20); } catch {}
    runUntil(() => res || false, 400);
  }
  if (!res) throw new Error("shootout never finished");
  res.won ? flows.win++ : flows.lose++;
  flows.lens.push(res.my + res.opp);
}
console.log("shootout 15 games: win", flows.win, "lose", flows.lose, "avg goals", (flows.lens.reduce((a, b) => a + b, 0) / flows.lens.length).toFixed(1));

// practice
let pr = null;
FL_PEN.practice({ skill: 70, onDone: (r) => (pr = r) });
let guard = 0;
while (!pr && guard++ < 50) { step(2); try { click(480, 200); } catch {} runUntil(() => pr || false, 400); }
console.log("practice:", JSON.stringify(pr));

// skip button simulates
let sk = null;
FL_PEN.shootout({ skill: 70, onDone: (r) => (sk = r) });
step(2);
handlers[(canvasId + 1) + "click"] && handlers[(canvasId + 1) + "click"]();
console.log("skip handler present:", !!handlers[(canvasId + 1) + "click"], "result:", JSON.stringify(sk));
