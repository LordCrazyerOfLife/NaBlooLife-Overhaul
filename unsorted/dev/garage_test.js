// Node harness for garage.js: fake game globals, walks every vehicle activity and the "take someone along" flow.
const noop = () => {};
global.window = global;
let html = "";
const listeners = [];
global.sList = { set innerHTML(v) { html = v; }, get innerHTML() { return html; }, scrollTop: 0,
  querySelectorAll: (sel) => {
    const m = sel.match(/\[data-([a-z]+)\]/); if (!m) return [];
    const out = []; const re = new RegExp('data-' + m[1] + '="([^"]+)"', 'g'); let x;
    while ((x = re.exec(html))) { const id = x[1], key = m[1]; out.push({ dataset: { [key]: id }, classList: { contains: (c) => new RegExp('class="row[^"]*' + c + '[^"]*"[^>]*data-' + key + '="' + id + '"').test(html) }, set onclick(f) { handlers[key + ':' + id] = f; } }); }
    return out;
  }, querySelector: () => null, insertAdjacentHTML: noop };
global.sTitle = { textContent: "" }; global.sBack = {}; global.sSub = { style: {} }; global.screen = { classList: { add: noop, remove: noop } };
global.document = { getElementById: () => null };
global.CHEV = ""; global.DOTS = ""; global.BACK_ICON = "<"; global.barCol = () => "#fff";
const handlers = {};
global.state = { age: 30, money: 5e7, cars: [{ make: "Ford", model: "Mustang", type: "coupe", cond: 80, base: 40000, age: 1, color: "blue" }],
  eliteVehicles: [ { kind: "boats", id: "speedboat", name: "Marlin 22", price: 85000, upkeep: 420, speed: "54 kn", cap: 6, img: "boats/x.png", cond: 70, bought: 28, used: -1 },
                   { kind: "planes", id: "jet", name: "Jet", price: 5e6, upkeep: 9000, speed: "800", cap: 8, img: "a.png", cond: 100, bought: 29, used: -1 },
                   { kind: "sportbikes", id: "ducati", name: "Ducati", price: 30000, upkeep: 300, speed: "200", cap: 2, img: "b.png", cond: 50, bought: 25, used: -1 } ],
  lovers: [{ first: "Ana", rel: 60, main: true }], parents: [{ first: "Mama", role: "Mother", rel: 70, dead: false }], family: [{ first: "Leo", kind: "sibling", g: "m", rel: 40, ageOffset: 2 }], friends: [{ first: "Bob", rel: 30 }], stats: {} };
global.usd = (n) => "$" + Math.round(n); global.renderStats = noop; global.say = (s) => log.push(s); global.fx = noop; global.chaChing = noop; global.play = noop; global.honk = noop;
global.clamp = (v) => Math.max(0, Math.min(100, v)); global.livesAbroad = () => false; global.loverTitle = () => "Girlfriend"; global.relAge = () => 20; global.famOn = () => true; global.relTitle = (e) => "Brother";
global.victims = () => [{ name: "Mama X", rel: "your mother", title: "Mother", g: "f", age: 50 }]; global.carImg = () => "cars/x.png"; global.CAR_TYPE_NAME = { coupe: "Coupe" };
global.iosConfirm = (t, m, cb) => cb(); global.isOldEra = () => false; global.brokeRows = () => "";
const log = []; const notices = []; global.notice = (t, m, cb, one, rows) => { notices.push(t + ": " + m + (rows ? " | " + rows.replace(/<[^>]+>/g, " ") : "")); cb && cb(); };
let lastCard = null; global.jCard = (o) => { lastCard = o; };
global.COUNTRIES = { us: ["United States", "Washington"], ca: ["Canada", "Ottawa"], mx: ["Mexico", "Mexico City"], cu: ["Cuba", "Havana"], bs: ["Bahamas", "Nassau"], gb: ["United Kingdom", "London"] }; global.tripMoment = (k, c) => (global.moments = (global.moments || []).concat(k + ":" + c.name)); global.openAssets = noop; global.openShopping = noop; global.openCar = noop; global.FL_LICENSES = { has: () => true, need: noop };
global.setTimeout = (f) => f();
global.FL_ELITE_LIFE = { openOwned: noop, openVehicleStore: noop };
require(process.argv[2]);
state.country = "us"; const G = FL_GARAGE; const fleet = state.eliteVehicles;
G.open(); console.log("sections:", JSON.stringify(G.sections()));

const click = (id) => { handlers["va:" + id](); };
const pickChoice = (re) => { const c = lastCard.choices.find((c) => re.test(c[0])); if (!c) throw new Error("no choice " + re + " in " + lastCard.choices.map((c) => c[0]).join(" | ")); c[1](); };
for (const v of fleet.slice()) {
  G.vehicle(v);
  for (const a of ["view", "drive", "fix", "repair"]) {
    G.vehicle(v);
    click(a);
    if (a === "drive") { if (lastCard.choices.some((c) => /Local flight/.test(c[0]))) pickChoice(/Local flight/); console.log(" ", v.name, "drive card choices:", lastCard.choices.map((c) => c[0]).join(" | ")); pickChoice(/Ana/i); }
  }
  G.vehicle(v); click("drive"); // second time in the same year -> "already"
}
console.log(notices.slice(-12).map((x) => "  " + x).join(String.fromCharCode(10)));
// sell paths
G.vehicle(fleet[0]); click("sell"); pickChoice(/Dealer/); console.log("after dealer sale fleet:", fleet.length);
G.vehicle(fleet[0]); click("sell"); pickChoice(/Post an ad/); 
G.vehicle(fleet[0]); click("gift"); lastCard.choices[0][1](); console.log("after gift fleet:", fleet.length);
G.vehicle(fleet[0]); click("scrap"); console.log("after scrap fleet:", fleet.length);
console.log("relations after outings:", state.lovers[0].rel, state.parents[0].rel);
console.log("log:", log.slice(0, 6));
// the car goes through openCar wrapper
console.log("OK full walk");

// ---- vacations abroad with aircraft
state.eliteVehicles.push({ kind: "planes", id: "jet-g650", name: "Gulfstream", price: 6e7, upkeep: 1e5, speed: "900", cap: 8, img: "a.png", cond: 100, bought: 29, used: -1 });
state.eliteVehicles.push({ kind: "helicopters", id: "heli", name: "Heli", price: 3e6, upkeep: 2e4, speed: "250", cap: 5, img: "h.png", cond: 100, bought: 29, used: -1 });
state.money = 5e8; state.age = 31; state.vacationAt = undefined; state.visited = undefined;
const jet = state.eliteVehicles[state.eliteVehicles.length - 2], heli = state.eliteVehicles[state.eliteVehicles.length - 1];
console.log("nearby from US for the jet:", FL_GARAGE.nearby(jet).map((x) => x.c + ":" + x.d + (x.ok ? "" : "(x)")).join(" "));
console.log("nearby from US for the heli:", FL_GARAGE.nearby(heli).slice(0, 3).map((x) => x.c + ":" + x.d + (x.ok ? "" : "(x)")).join(" "));
G.vehicle(jet); click("drive");
console.log("fly menu:", lastCard.choices.map((c) => c[0]).join(" | "));
pickChoice(/vacation abroad/);
console.log("vacation screen has flags:", html.includes('flags/ca.png'), "| title:", sTitle.textContent);
const before = state.money; handlers["trip:0"](); console.log("trip card:", lastCard.title, "|", lastCard.rows.map((r) => r.join("=")).join("; "));
pickChoice(/who comes along/); pickChoice(/Ana/);
console.log("after trip: money spent", Math.round(before - state.money), "| vacationAt", state.vacationAt, "| visited", JSON.stringify(state.visited), "| rel Ana", state.lovers[0].rel, "| moments", JSON.stringify(global.moments || []));
console.log("last notice:", notices[notices.length - 1].slice(0, 160));
G.vehicle(heli); click("drive"); pickChoice(/vacation abroad/); handlers["trip:0"](); pickChoice(/who comes along/); 
console.log("second vacation same year blocked:", notices[notices.length - 1].includes("already went on vacation"), "| heli used flag untouched:", heli.used === -1);
