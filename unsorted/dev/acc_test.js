// Node harness for accessories-plus.js: fake game globals, opens Accessories, Jewelry and a slot, wears/removes pieces.
const noop = () => {};
global.window = global;
let html = ""; const handlers = {};
global.sList = { set innerHTML(v) { html = v; }, get innerHTML() { return html; }, scrollTop: 0,
  insertAdjacentHTML: (w, h) => { html += h; },
  querySelectorAll: (sel) => { const m = sel.match(/\[data-([a-z]+)\]/); if (!m) return []; const out = []; const re = new RegExp("data-" + m[1] + '="([^"]+)"', "g"); let x;
    while ((x = re.exec(html))) { const id = x[1], key = m[1]; out.push({ dataset: { [key]: id }, classList: { contains: (c) => new RegExp('class="row[^"]*' + c + '[^"]*"[^>]*data-' + key + '="' + id + '"').test(html) }, set onclick(f) { handlers[key + ":" + id] = f; } }); } return out; } };
global.sTitle = { textContent: "" }; global.sBack = {}; global.sSub = { style: {} }; global.screen = { classList: { add: noop } };
global.DOTS = ""; global.BACK_ICON = "<"; global.usd = (n) => "$" + Math.round(n); global.play = noop; global.isOldEra = () => false; global.PG = () => "m";
global.state = { age: 30, jewelry: [ { id: "a", img: "cuban-01-gold", name: "Gold Cuban Chain", noun: "chain", metal: "Gold", claim: 5000 }, { id: "b", img: "grillz-01", name: "Gold Grillz", noun: "grillz", metal: "Gold" }, { id: "c", img: "watch-01", name: "Rolex", noun: "watch", metal: "Steel" } ], jewelEq: {} };
global.openAccessories = function () { sTitle.textContent = "ACCESSORIES"; html = '<div class="row" data-cat="0">x</div>'; };
global.openSalon = noop; const salonCalls = []; global.SALON_OPEN = { barber: () => salonCalls.push("barber"), dye: () => salonCalls.push("dye"), shave: () => salonCalls.push("shave") };
const worn = {}; global.FL_JEWEL_WEAR = {
  slot: (it) => ({ chain: "neck", grillz: "mouth", watch: "wrist" }[it.noun] || null),
  worn: (it) => Object.values(worn).includes(it),
  toggle: (it) => { const s = FL_JEWEL_WEAR.slot(it); if (worn[s] === it) delete worn[s]; else worn[s] = it; },
  equipped: () => ({ ...worn }) };
global.FL_BARBER = { price: (k) => ({ barber: 25, dye: 60, shave: 15 }[k]) };
global.setTimeout = (f) => f();
global.requestAnimationFrame = () => 1; global.cancelAnimationFrame = () => {};
global.document = { getElementById: () => null, querySelector: () => null };
global.ACCESSORIES = { eyewear: [{ id: "g1", name: "Gold Aviators" }], headwear: [] }; global.accessoryPicker = (i) => (global.pickedAcc = i);
require(process.argv[2]);
openAccessories();
console.log("sections:", ["Jewelry", "Barbershop", "Barber", "Dye Job", "Shave", "Salon & Spa"].every((w) => html.includes(w)), "| price shown:", /Barber[^<]*<\/b><span>[^<]*\$25/.test(html) || /\$25/.test(html));
handlers["ap:jewelry"]();
console.log("jewelry screen rows:", (html.match(/data-js=/g) || []).length);
handlers["js:neck"]();
console.log("neck screen shows chain:", html.includes("Gold Cuban Chain"));
handlers["sl:0"](); console.log("worn after tap:", Object.keys(worn).join(","), "| screen says wearing:", html.includes("(wearing)"));
handlers["sl:off"](); console.log("worn after take off:", Object.keys(worn).length);
handlers["js:mouth"](); handlers["sl:0"](); handlers["js:wrist"](); handlers["sl:0"]();
console.log("two slots worn:", Object.keys(worn).sort().join(","));
handlers["js:off"] && handlers["js:off"]();
openAccessories(); handlers["ap:barber"](); handlers["ap:dye"](); handlers["ap:shave"]();
console.log("salon calls:", salonCalls.join(","), "| worn after take-off-all:", Object.keys(worn).length);
state.age = 12; openAccessories(); console.log("age 12: barber locked:", /class="row dis"[^>]*data-ap="barber"/.test(html));
state.age = 30; handlers["js:neck"] && 0; FL_ACCPLUS.openJewelry(); console.log("take-off row present:", html.includes("Take off everything")); handlers["js:off"](); console.log("worn after Take off everything:", Object.keys(worn).length);

state.first = "Ben"; state.last = "Stewart"; state.acc = { eyewear: "g1" }; worn.neck = state.jewelry[0];
openAccessories(); handlers["ap:mirror"]();
console.log("mirror screen:", sTitle.textContent, "| canvas:", html.includes("flMirrorCv"), "| name:", html.includes("Ben Stewart"), "| eyewear:", html.includes("Gold Aviators"), "| neck:", html.includes("Gold Cuban Chain"));
handlers["mr:acc0"](); console.log("eyewear picker opened:", global.pickedAcc === 0);
handlers["mr:slot:neck"](); console.log("neck slot screen:", sTitle.textContent, "| has live preview:", html.includes("flMirrorCv"));
handlers["mr:barber"] && 0;
FL_ACCPLUS.openMirror(); handlers["mr:barber"](); console.log("barber from mirror:", salonCalls[salonCalls.length - 1]);
