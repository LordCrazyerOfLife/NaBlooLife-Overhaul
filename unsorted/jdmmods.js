/* [mod] "JDM Mods": a Shopping store for drift cars and parts (id "jdm-mods" in modloader.js, data in jdmmods-data.js).
 * Cars: 60 JDM sprites (cars/jdm-NN.png), a new random selection every year (new and used). Parts: 105 pieces (jdmparts/),
 * one part per slot per car; every part adds rating points that Drift Boy (drift.js) counts, a roll cage / harness make
 * crashes cheaper. Cars are pushed to state.cars with their parts in car.parts = [{slot, id, n, bonus}].
 */
(() => {
  "use strict";
  if (window.FL_JDMMODS) return;
  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pickN = (arr, n) => arr.slice().sort(() => rnd() - 0.5).slice(0, n);
  const money = (n) => (typeof usd === "function" ? usd(n) : "$" + Math.round(n).toLocaleString("en-US"));
  const price = (n) => (!n ? 0 : typeof localPrice === "function" ? localPrice(n) : n);
  const say = (t) => typeof window.say === "function" && window.say(t);
  const chev = () => (typeof CHEV !== "undefined" ? CHEV : "");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const ICON = "cars/jdm-13.png";
  const DEALER = "JDM Mods";
  const CAT_ICON = {
    "Engine & Turbo": "turbo-engine-swap-4-cyl", "Intake & Cooling": "front-mount-intercooler", "Suspension & Steering": "purple-coilovers",
    Brakes: "red-6-pot-caliper-kit", "Wheels & Tires": "gold-mesh-wheel", "Interior & Safety": "racing-seat", "Body & Aero": "carbon-gt-wing",
  };
  const parts = () => window.JDM_PARTS || [];
  const cats = () => window.JDM_CATS || [];
  const defs = () => window.JDM_CARS || [];
  const cars = () => (Array.isArray(state.cars) ? state.cars : (state.cars = []));
  const carName = (c) => `${c.make || ""} ${c.model || ""}`.trim();
  const carImg = (c) => (c && c.sprite ? `cars/${c.sprite}.png` : `cars/${(c && c.type) || "coupe"}-${(c && c.color) || "black"}.png`);
  const rating = (c) => (window.FL_DRIFT && FL_DRIFT.carRating ? Math.round(FL_DRIFT.carRating(c)) : null);
  const yearNow = () => (state.birthYear || 0) + (state.age || 0);

  // ------------------------------------------------------------------ yearly stock of drift cars
  function stock() {
    const y = yearNow();
    if (!state.jdmShop || state.jdmShop.year !== y) {
      state.jdmShop = {
        year: y,
        cars: pickN(defs(), 12).map((d) => {
          const used = rnd() < 0.3,
            cond = used ? ri(45, 88) : 100;
          const p = used ? d.price * (0.45 + (0.55 * cond) / 100) * (0.95 + rnd() * 0.1) : d.price * (0.95 + rnd() * 0.15);
          return { i: d.i, used, cond, price: Math.max(500, Math.round(p / 50) * 50) };
        }),
      };
    }
    return state.jdmShop.cars;
  }

  // ------------------------------------------------------------------ screens
  const row = (id, icon, t, s) =>
    `<div class="row" data-j="${id}"><img src="${icon}" alt="" style="object-fit:contain"><div class="t"><b>${t}</b><span>${s}</span></div>${chev()}</div>`;
  const sec = (t) => `<div class="sec">${t}</div>`;
  function screenOf(title, back, html) {
    sTitle.textContent = title;
    if (typeof sSub !== "undefined" && sSub && sSub.style) sSub.style.display = "none";
    sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;";
    sBack.onclick = back;
    sList.innerHTML = html;
    sList.scrollTop = 0;
    screen.classList.add("open");
  }
  function bind(map) {
    sList.querySelectorAll("[data-j]").forEach((el) => {
      el.onclick = () => {
        if (typeof play === "function") play("choice");
        const f = map[el.dataset.j];
        if (f) f();
      };
    });
  }
  const back = () => (typeof openShopping === "function" ? openShopping() : screen.classList.remove("open"));

  let carsOpen = false; // the drift-car list is a dropdown: closed until you tap it
  function openShop() {
    const st = stock();
    const map = {};
    let list = "";
    st.forEach((l, k) => {
      const d = defs().find((x) => x.i === l.i);
      if (!d) return;
      list += row(`car${k}`, `cars/jdm-${String(d.i).padStart(2, "0")}.png`, `${esc(d.make)} ${esc(d.model)} <em>(${l.used ? `Used · ${l.cond}%` : "New"} · ${d.color})</em>`, `${money(price(l.price))}`).replace('style="object-fit:contain"', 'style="object-fit:contain;width:64px"');
      map[`car${k}`] = () => carCard(l, d);
    });
    if (!st.length) list = `<div class="row dis"><img src="${ICON}" alt=""><div class="t"><b>Sold out</b><span>New stock next year</span></div></div>`;
    let html =
      `<div class="row" style="cursor:default"><img src="${ICON}" alt="" style="object-fit:contain"><div class="t"><b>${DEALER}</b><span>Drift cars and parts, straight from Japan</span></div></div>` +
      sec("Drift cars") +
      `<div class="row" data-j="toggle"><img src="${ICON}" alt="" style="object-fit:contain"><div class="t"><b>Cars in stock for ${yearNow()}</b><span>${st.length} car${st.length === 1 ? "" : "s"} · tap to ${carsOpen ? "close" : "open"} the list</span></div><span id="jdmArrow" style="font-size:22px;opacity:.8;padding-right:6px">${carsOpen ? "▾" : "▸"}</span></div>` +
      `<div id="jdmCarsBox" style="display:${carsOpen ? "block" : "none"}">${list}</div>`;
    html += sec("Parts");
    cats().forEach((c, k) => {
      html += row(`cat${k}`, `jdmparts/${CAT_ICON[c]}.png`, c, `${parts().filter((p) => p.c === c).length} parts`);
      map[`cat${k}`] = () => openCat(c);
    });
    html += sec("Your cars") + row("mine", ICON, "Installed parts", `${cars().length} car${cars().length === 1 ? "" : "s"} in your garage`);
    map.mine = openMine;
    map.toggle = () => {
      carsOpen = !carsOpen;
      const box = document.getElementById("jdmCarsBox");
      const arrow = document.getElementById("jdmArrow");
      if (box) box.style.display = carsOpen ? "block" : "none";
      if (arrow) arrow.textContent = carsOpen ? "▾" : "▸";
      const sub = sList.querySelector('[data-j="toggle"] .t span');
      if (sub) sub.textContent = `${st.length} car${st.length === 1 ? "" : "s"} · tap to ${carsOpen ? "close" : "open"} the list`;
    };
    html += `<div class="mm-foot" style="padding:10px 14px;text-align:left">The showroom gets a new random selection of drift cars every year.</div>`;
    screenOf("JDM MODS", back, html);
    bind(map);
  }

  function carCard(l, d) {
    jCard({
      tag: DEALER, iconSrc: `cars/jdm-${String(d.i).padStart(2, "0")}.png`, title: `${d.make} ${d.model}`, close: true,
      lead: l.used ? `A used one in ${d.color}: ${l.cond}% condition, so it is cheaper and needs some love.` : `A clean ${d.color} one straight off the boat. Perfect for sliding.`,
      rows: [["Price", money(price(l.price))], ["Condition", `${l.cond}%`], ["Drift bonus", `+${d.db}`]],
      choices: [
        [`Buy it · ${money(price(l.price))}`, () => buyCar(l, d)],
        ["Not today", () => openShop(), "gray"],
      ],
    });
  }
  function buyCar(l, d) {
    if (state.age < 18) return notice(DEALER, "You must be at least 18 to buy a car.", null, true);
    const cost = price(l.price);
    if ((state.money || 0) < cost) return notice("Not enough money", `You need ${money(cost)} for the ${d.make} ${d.model}.`, null, true);
    state.money -= cost;
    const c = {
      make: d.make, model: d.model, type: "coupe", color: d.color, price: d.price, base: d.price, age: l.used ? ri(6, 22) : 1, cond: l.cond,
      sprite: `jdm-${String(d.i).padStart(2, "0")}`, dbonus: d.db, cls: "Drift", dt: { tires: 0, susp: 0, diff: 0, turbo: 0 }, parts: [],
    };
    cars().push(c);
    state.jdmShop.cars = state.jdmShop.cars.filter((x) => x !== l);
    if (typeof chaChing === "function") chaChing();
    if (typeof renderStats === "function") renderStats();
    say(`I bought a ${l.used ? "used " : ""}${d.make} ${d.model} at JDM Mods.`);
    notice("Delivered", `The ${d.make} ${d.model} is in your garage.`, () => openShop(), true);
  }

  function openCat(c) {
    const list = parts().filter((p) => p.c === c);
    const map = {};
    let html = sec(c);
    list.forEach((p, k) => {
      html += row(`p${k}`, `jdmparts/${p.f}.png`, esc(p.n), `${money(price(p.p))} · +${p.b} rating · ${p.s}`);
      map[`p${k}`] = () => partCard(p, c);
    });
    screenOf(c.toUpperCase(), openShop, html);
    bind(map);
  }
  function partCard(p, c) {
    const list = cars();
    if (!list.length) return notice(DEALER, "You need a car to fit parts on. Buy one first.", () => openShop(), true);
    jCard({
      tag: DEALER, iconSrc: `jdmparts/${p.f}.png`, title: p.n, close: true,
      lead: `Slot: ${p.s}. A new part in this slot replaces the old one. +${p.b} drift rating${p.s === "cage" ? ", and crashes hurt the car less" : p.s === "harness" ? ", and crashes hurt you less" : ""}.`,
      rows: [["Price", money(price(p.p))], ["Rating bonus", `+${p.b}`]],
      choices: [
        ...list.slice(0, 6).map((car) => [`Fit on ${carName(car)}${rating(car) != null ? ` (rating ${rating(car)})` : ""}`, () => install(car, p, c)]),
        ["Back", () => openCat(c), "gray"],
      ],
    });
  }
  function install(car, p, c) {
    const cost = price(p.p);
    if ((state.money || 0) < cost) return notice("Not enough money", `This part costs ${money(cost)}.`, () => openCat(c), true);
    const before = rating(car);
    state.money -= cost;
    car.parts = (car.parts || []).filter((x) => x.slot !== p.s);
    car.parts.push({ slot: p.s, id: p.f, n: p.n, bonus: p.b });
    if (p.s === "cage") car.cage = true;
    if (p.s === "harness") car.harness = true;
    if (p.s === "plate" && state.drift && state.drift.active) state.drift.rep = Math.min(100, (state.drift.rep || 0) + 2);
    if (typeof chaChing === "function") chaChing();
    if (typeof renderStats === "function") renderStats();
    say(`I fitted ${p.n} on my ${carName(car)}.`);
    const after = rating(car);
    jCard({
      tag: DEALER, iconSrc: `jdmparts/${p.f}.png`, title: "Installed", lead: `${p.n} is on the ${carName(car)}.`,
      rows: [["Paid", money(cost)], ...(before != null && after != null ? [["Drift rating", `${before} → ${after}`]] : [["Rating bonus", `+${p.b}`]])],
      choices: [["Keep shopping", () => openCat(c)], ["Done", () => openShop(), "gray"]],
    });
  }
  function openMine() {
    const map = {};
    let html = sec("Your cars");
    cars().forEach((c, k) => {
      const ps = c.parts || [];
      html += row(`m${k}`, carImg(c), esc(carName(c)), `${ps.length} part${ps.length === 1 ? "" : "s"}${rating(c) != null ? ` · rating ${rating(c)}` : ""}`);
      map[`m${k}`] = () =>
        jCard({
          tag: DEALER, iconSrc: carImg(c), title: carName(c), close: true,
          lead: ps.length ? "Installed parts:" : "No aftermarket parts yet.",
          rows: ps.map((x) => [x.slot, `${x.n} (+${x.bonus})`]),
          choices: [["OK", () => openMine()]],
        });
    });
    if (!cars().length) html += `<div class="row dis"><img src="${ICON}" alt=""><div class="t"><b>No cars</b><span>Buy one at JDM Mods or any dealer</span></div></div>`;
    screenOf("INSTALLED PARTS", openShop, html);
    bind(map);
  }

  // ------------------------------------------------------------------ Shopping row
  function addRow() {
    if (typeof isOldEra === "function" && isOldEra()) return;
    if (document.getElementById("jdmShopRow")) return;
    const html =
      `<div class="sec">${DEALER}</div><div class="row" id="jdmShopRow"><img src="${ICON}" alt="" style="object-fit:contain"><div class="t"><b>${DEALER}</b><span>Drift cars and performance parts</span></div>${chev()}</div>`;
    const brokers = [...sList.querySelectorAll(".sec")].find((s) => s.textContent.trim() === "Real Estate Brokers");
    brokers ? brokers.insertAdjacentHTML("beforebegin", html) : sList.insertAdjacentHTML("beforeend", html);
    document.getElementById("jdmShopRow").onclick = () => (typeof play === "function" && play("choice"), openShop());
  }
  function boot() {
    if (typeof openShopping !== "function" || typeof sList === "undefined") return setTimeout(boot, 80);
    const orig = window.openShopping;
    window.openShopping = function () {
      const r = orig.apply(this, arguments);
      try {
        if (typeof sTitle !== "undefined" && sTitle.textContent === "SHOPPING") addRow();
      } catch (e) {
        console.warn("[jdmmods] shopping", e);
      }
      return r;
    };
    try {
      openShopping = window.openShopping;
    } catch {}
    window.FL_JDMMODS = { open: openShop, stock };
  }
  boot();
})();
