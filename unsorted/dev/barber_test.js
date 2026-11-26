// Node harness for barber-all.js: real HAIR_PACK ids, fake salonPreview; checks the unified list per gender and the pick effects.
const noop = () => {};
global.window = global;
const HAIR_PACK = [];
[1, 2, 3, 4, 5].forEach((e) => HAIR_PACK.push([`hhc${e}`, `Hip-Hop Hair ${e}`]));
[1, 2, 3].forEach((e) => HAIR_PACK.push([`long${e}`, `Long Hair ${e}`]));
[1, 2, 3, 4, 5].forEach((e) => HAIR_PACK.push([`short${e}`, `Short Hair ${e}`]));
HAIR_PACK.push(["buzz", "Buzz Cut"]);
for (let t = 0; t < 48; t++) HAIR_PACK.push([`tx${String(t + 1).padStart(2, "0")}`, `Textured Hair ${t + 1}`, true]);
["dread-green", "dread-blonde", "dread-red", "dread-black", "emo-pink1", "emo-pink2", "rainbow-long", "braids-bw"].forEach((id) => HAIR_PACK.push([id, id, true]));
for (let t = 1; t <= 10; t++) HAIR_PACK.push([`west${t}`, `Shaggy Hair ${t}`]);
for (let t = 1; t <= 24; t++) HAIR_PACK.push([`nh${String(t).padStart(2, "0")}`, `nh${t}`, true]);
let gender = "m"; global.PG = () => gender;
global.stage = () => 3; global.hairList = () => Array.from({ length: 12 }, (_, i) => `base-${i}`); global.hairPackList = () => HAIR_PACK;
global.state = { age: 25, mod: { style: null, xHair: null }, look: {}, acc: {}, stats: {} }; global.previewCache = {}; global.dyeKey = () => ""; global.composeFace = (...a) => Promise.resolve({ args: a });
global.renderAvatar = noop; const says = []; global.say = (s) => says.push(s); const notes = []; global.notice = (t) => notes.push(t);
global.FL_BARBER = { price: () => 25 };
let seen = null; global.salonPreview = function (o) { seen = o; };
const t = global.setInterval; global.setInterval = () => 0;
require(process.argv[2]);
const open = (title) => { seen = null; salonPreview({ title, lead: "Pick a new hairstyle today!", btn: "x", count: 5, start: 0, faceFor: noop, onPick: noop }); return seen; };
for (const g of ["m", "f"]) {
  gender = g;
  const o = open(g === "f" ? "Hair Stylist" : "Barber");
  const names = Array.from({ length: o.count }, (_, i) => o.nameFor(i));
  const packNames = names.slice(1 + 12);
  const hasHip = packNames.some((n) => /Hip-Hop/.test(n)), hasBuzz = packNames.some((n) => /Buzz/.test(n));
  const hasBun = names.some((n) => /nh18|nh14|nh21|nh16/.test(n)), hasRainbow = names.some((n) => /rainbow/.test(n));
  console.log(g, "count", o.count, "| base 12 + pack", packNames.length, "| hip-hop:", hasHip, "buzz:", hasBuzz, "| feminine (bun/pony/bob/space buns):", hasBun, "rainbow:", hasRainbow);
}
gender = "m"; let o = open("Barber");
o.onPick(0); console.log("none ->", JSON.stringify(state.mod));
o.onPick(3); console.log("base #3 ->", JSON.stringify(state.mod));
o.onPick(1 + 12 + 2); console.log("pack #3 ->", JSON.stringify(state.mod), "| says:", says.slice(-1)[0], "| notice:", notes.slice(-1)[0]);
o = open("Barber"); console.log("start after picking a pack style (should point at it):", o.start, "=", 1 + 12 + 2);
state.mod = { style: 4, xHair: null }; o = open("Barber"); console.log("start with base style 4:", o.start, "(expected 5)");
// preview calls composeFace with the right options
o = open("Barber"); o.faceFor(1 + 12 + 2, 3, "happy").then((r) => console.log("preview args:", JSON.stringify(r.args[5])));
o.faceFor(2, 3, "happy").then((r) => console.log("base preview args:", JSON.stringify(r.args[5])));
console.log("other previews untouched:", (() => { seen = null; salonPreview({ title: "Face Tattoo", lead: "Pick your ink today!", count: 7 }); return seen.count === 7; })());
