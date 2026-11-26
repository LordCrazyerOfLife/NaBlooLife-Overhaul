/* [base] Business Empire for NaBlooLife.
 *
 * Activities -> Business gets a "Business Empire" section on top (modern era, 18+). It is a second layer next to the
 * old era businesses: real chains and local shops that grow from one store to a global company.
 *
 *  - Buy an existing business (local shop or a franchise) by MAKING AN OFFER: asking price, haggling rounds, due
 *    diligence that reveals hidden problems, a seller that can walk away, a bank loan, or found your own from zero.
 *  - Growth stages: Local -> Regional -> National -> Global, opening locations, products picked from the art catalogs
 *    (clothes, sneakers, food), marketing, rivals, mergers and acquisitions.
 *  - People: operations / marketing / finance managers. Money: loans, investors, IPO and share trading, dividends.
 *  - Yearly events (lawsuits, recalls, price wars, hacks, union, buyout offers for YOUR company, ...).
 *
 * State: state.empire = { cos[], market[], rivals{}, eco, tickAge, nid }.
 * Art: ropa2/ sneakers+clothes stores, tenis/ ropa/ comida/ catalogs (names.json in each), comida-business/,
 * gyms/, heladerias/, concesionarios-business/, tiendas/, joyeria/.
 * Debug: FL_EMP.open(), FL_EMP.tick(), FL_EMP.state(), FL_EMP.EVENTS.
 */
(() => {
  "use strict";
  if (window.FL_EMP) return;

  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const cl = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const warn = (w, e) => console.warn("[bizempire] " + w, e);
  const usdf = (n) => {
    try {
      return usd(n);
    } catch {
      return "$" + Math.round(n).toLocaleString("en-US");
    }
  };
  const money = (n) => {
    const a = Math.abs(n);
    const s = a >= 1e9 ? (a / 1e9).toFixed(2) + "B" : a >= 1e6 ? (a / 1e6).toFixed(2) + "M" : a >= 1e4 ? Math.round(a / 1e3) + "K" : Math.round(a).toLocaleString("en-US");
    return (n < 0 ? "-$" : "$") + s;
  };
  const rN = (n) => {
    const m = Math.pow(10, Math.max(1, String(Math.round(Math.abs(n))).length - 3));
    return Math.round(n / m) * m;
  };
  const K = () => {
    try {
      return typeof inflFx === "function" ? inflFx(1.03) : 1;
    } catch {
      return 1;
    }
  };
  const yearNow = () => {
    try {
      return bizYear();
    } catch {
      return 2026;
    }
  };

  // ------------------------------------------------------------------ data
  const BRANDS = {
    mcdonalds: "McDonald's", "burger-king": "Burger King", "taco-bell": "Taco Bell", dominos: "Domino's", starbucks: "Starbucks", kfc: "KFC", wendys: "Wendy's",
    subway: "Subway", dunkin: "Dunkin'", toyota: "Toyota", bmw: "BMW", "mercedes-benz": "Mercedes-Benz", lamborghini: "Lamborghini", ferrari: "Ferrari",
    porsche: "Porsche", audi: "Audi", chevrolet: "Chevrolet", ford: "Ford", nissan: "Nissan", hyundai: "Hyundai", adidas: "adidas", gucci: "Gucci", "jordan-jumpman": "Jordan",
  };
  const brandOf = (path) => {
    const f = path.split("/")[1] || "";
    return Object.keys(BRANDS).find((b) => f.startsWith(b)) || null;
  };
  const title = (s) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const prettyIcon = (path) => {
    const b = brandOf(path);
    if (b) return BRANDS[b];
    return title((path.split("/")[1] || "").replace(/-(ice-cream-shop|restaurant|store|shop|gym|dealership|jewelry-store|coffee-shop|sandwich-shop|donuts-shop|retail-store|showroom|pizza-restaurant|chicken-restaurant|grill-restaurant)$/, ""));
  };
  const mk = (dir, files) => files.map((f) => `${dir}/${f}`);
  // startup = cost of one location (2026 dollars), rev = yearly revenue of one location, margin = operating margin
  const CATS = {
    clothing: { name: "Clothing Store", noun: "Apparel", staff: "sales staff", startup: 180e3, rev: 520e3, margin: 0.17, mult: 5, perLoc: 7, wage: 32e3, catalog: "ropa", icons: mk("ropa2", ["hanger-clothing-store", "crown-clothing-store", "t-shirt-clothing-store", "red-hanger-clothing-store", "dress-boutique-store", "x-logo-clothing-store", "denim-jeans-store", "pink-bow-boutique", "skateboard-clothing-store", "gucci-store"]), blurb: "Tees, hoodies, jerseys and streetwear." },
    sneaker: { name: "Sneaker Store", noun: "Kicks", staff: "sales staff", startup: 220e3, rev: 760e3, margin: 0.16, mult: 5, perLoc: 6, wage: 33e3, catalog: "tenis", icons: mk("ropa2", ["sneaker-store", "adidas-store"]), blurb: "Jordans, Dunks and Yeezys. Hype sells." },
    food: { name: "Fast Food", noun: "Grill", staff: "cooks and cashiers", startup: 350e3, rev: 1.1e6, margin: 0.1, mult: 6, perLoc: 16, wage: 27e3, catalog: "comida", icons: mk("comida-business", ["mcdonalds-restaurant", "burger-king-restaurant", "taco-bell-restaurant", "dominos-pizza-restaurant", "starbucks-coffee-shop", "kfc-restaurant", "pepper-logo-grill-restaurant", "rooster-chicken-restaurant", "wendys-restaurant", "red-roof-pizza-restaurant", "subway-sandwich-shop", "dunkin-donuts-shop"]), blurb: "Burgers, tacos, pizza and fries. Volume is everything." },
    icecream: { name: "Ice Cream Shop", noun: "Creamery", staff: "scoopers", startup: 90e3, rev: 320e3, margin: 0.2, mult: 4.5, perLoc: 6, wage: 25e3, catalog: null, icons: mk("heladerias", ["pink-soft-serve-ice-cream-shop", "pink-scoop-ice-cream-shop", "cream-cone-ice-cream-shop", "maroon-scoop-ice-cream-shop", "sundae-cherry-ice-cream-shop", "pink-double-scoop-ice-cream-shop", "italian-tricolor-gelato-shop", "neon-ice-cream-shop", "giant-cone-sprinkles-ice-cream-shop", "round-sign-ice-cream-shop", "blue-cherry-ice-cream-shop", "stone-chocolate-scoop-ice-cream-shop"]), blurb: "Cheap to open, great summers, dead winters." },
    gym: { name: "Gym", noun: "Fitness", staff: "trainers", startup: 400e3, rev: 900e3, margin: 0.22, mult: 5.5, perLoc: 10, wage: 34e3, catalog: null, icons: mk("gyms", ["dumbbell-logo-gym-red", "g-letter-gym", "muscle-flex-gym", "neon-dumbbell-gym", "24-7-gym", "dumbbell-logo-gym-stone", "yellow-f-logo-gym", "muscle-silhouette-gym", "crown-gym", "jordan-jumpman-gym", "gym-wordmark", "hexagon-dumbbell-gym"]), blurb: "Memberships, classes and a lot of January sign-ups." },
    dealer: { name: "Car Dealership", noun: "Motors", staff: "salespeople", startup: 3.5e6, rev: 24e6, margin: 0.035, mult: 7, perLoc: 40, wage: 52e3, catalog: null, icons: mk("concesionarios-business", ["toyota-dealership", "bmw-dealership", "mercedes-benz-dealership", "lamborghini-dealership", "ferrari-dealership", "porsche-dealership", "audi-dealership", "red-slash-car-dealership", "chevrolet-dealership", "ford-dealership", "nissan-dealership", "hyundai-dealership"]).concat(mk("tiendas", ["car-showroom-glass-front", "blue-awning-car-showroom"])), blurb: "Huge revenue, thin margins, lots of cash tied up." },
    jewelry: { name: "Jewelry Store", noun: "Jewelers", staff: "jewelers", startup: 600e3, rev: 1.6e6, margin: 0.25, mult: 6, perLoc: 6, wage: 45e3, catalog: null, icons: mk("joyeria", ["diamond-jewelry-store-cream", "crown-jewelry-store-marble", "gold-ring-jewelry-store", "diamond-jewelry-store-black", "gold-g-jewelry-store", "diamond-jewelry-store-awning", "gold-rings-jewelry-store", "gold-crown-jewelry-store", "diamond-jewelry-store-dark", "arched-diamond-jewelry-store", "gold-leopard-jewelry-store", "gold-diamond-jewelry-store"]), blurb: "Rare sales, fat margins, a target for thieves." },
    retail: { name: "Retail & Convenience", noun: "Market", staff: "clerks", startup: 250e3, rev: 900e3, margin: 0.07, mult: 5, perLoc: 7, wage: 28e3, catalog: null, icons: mk("tiendas", ["convenience-store-red-roof", "gas-station-convenience-store", "red-cross-pharmacy", "blue-awning-retail-store", "blue-sign-retail-store", "red-awning-retail-store", "blue-stripe-retail-store", "red-facade-retail-store", "purple-neon-retail-store", "wood-neon-retail-store"]), blurb: "Convenience stores, pharmacies and gas stations." },
  };
  const FOUND_BAN = /^(adidas|gucci)/; // a franchise-only storefront cannot be used when you found your own brand
  const isBrandIcon = (p) => !!brandOf(p);
  const STAGES = ["Local", "Regional", "National", "Global"];
  const STAGE_MAX = [3, 15, 60, 500];
  const STAGE_MUL = [1, 1.12, 1.25, 1.45];
  const CITIES = ["Miami", "Los Angeles", "Houston", "Chicago", "Atlanta", "Dallas", "Phoenix", "Seattle", "Denver", "Boston", "Brooklyn", "Las Vegas", "San Juan", "Toronto", "Mexico City", "Madrid", "London"];
  const PRE = ["Urban", "Prime", "Golden", "Metro", "Royal", "Iron", "Blue Moon", "Sunset", "Apex", "Nova", "Maple", "Harbor", "Crown", "Rocket", "Lucky"];
  const NOUN = {
    clothing: ["Threads", "Apparel", "Wear", "Fits"], sneaker: ["Kicks", "Soles", "Sneakers", "Drip"], food: ["Grill", "Burger Co.", "Wraps", "Crispy"],
    icecream: ["Creamery", "Scoops", "Cones", "Gelato"], gym: ["Fitness", "Iron Gym", "Barbell Club", "Athletics"], dealer: ["Motors", "Auto Group", "Cars", "Autos"],
    jewelry: ["Jewelers", "Diamonds", "Gold & Co.", "Gems"], retail: ["Market", "Mart", "Corner Store", "Express"],
  };

  // ------------------------------------------------------------------ catalogs (products)
  const CATALOG = {}; // dir -> [{file,label,price}]
  const hashN = (s) => {
    let h = 7;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  };
  function priceOf(dir, label) {
    const l = label.toLowerCase();
    const j = hashN(l) % 100;
    if (dir === "tenis") return /jordan|yeezy|travis|off-white/.test(l) ? 190 + j * 1.5 : 100 + j * 0.9;
    if (dir === "comida") return +(3 + (j / 100) * (/bucket|combo|box|whole|stacked/.test(l) ? 12 : 7)).toFixed(2);
    if (/chain|necklace/.test(l)) return 350 + j * 6;
    if (/pendant|crown|belt|bracelet/.test(l)) return 250 + j * 5;
    if (/puffer/.test(l)) return 200 + j;
    if (/jacket|hoodie/.test(l)) return 85 + j * 0.8;
    if (/jersey/.test(l)) return 90 + j * 0.6;
    if (/polo/.test(l)) return 65 + j * 0.4;
    if (/jeans|pants|cargo/.test(l)) return 70 + j * 0.5;
    if (/sunglass/.test(l)) return 80 + j * 0.8;
    if (/cap|beanie|mask|bandana/.test(l)) return 15 + j * 0.3;
    if (/short/.test(l)) return 45 + j * 0.3;
    return 28 + j * 0.3;
  }
  async function loadCatalogs() {
    for (const dir of ["ropa", "tenis", "comida"]) {
      try {
        const r = await fetch(`${dir}/names.json`);
        const list = await r.json();
        CATALOG[dir] = list.map((e) => ({ file: e.file.replace(/\.png$/, ""), label: e.label || title(e.file.replace(/\.png$/, "")), price: Math.round(priceOf(dir, e.label || e.file) * 100) / 100 }));
      } catch (e) {
        warn("catalog " + dir, e);
      }
    }
  }
  const prodOf = (dir, file) => (CATALOG[dir] || []).find((p) => p.file === file);

  // ------------------------------------------------------------------ state and money
  const E = () => {
    if (!state.empire || typeof state.empire !== "object") state.empire = {};
    const e = state.empire;
    e.cos ||= [];
    e.market ||= [];
    e.rivals ||= {};
    e.eco ??= 1;
    e.tickAge ??= -1;
    e.mktYear ??= -1;
    e.nid ??= 1;
    return e;
  };
  const enabled = () => !state.dead && state.era !== "1800s" && state.age >= 18 && yearNow() >= 1990;
  const bank = () => (typeof bankTotal === "function" ? bankTotal() : Number(state.money) || 0);
  const refresh = () => {
    try {
      renderStats();
    } catch {}
  };
  const spend = (n) => {
    n = Math.round(n);
    if (n <= 0) return true;
    if (bank() < n) return false;
    let left = n;
    const cash = Math.min(Number(state.money) || 0, left);
    state.money -= cash;
    left -= cash;
    for (const a of state.bankAccts || []) {
      if (left <= 0) break;
      const t = Math.min(a.bal || 0, left);
      a.bal -= t;
      left -= t;
    }
    refresh();
    return true;
  };
  const earn = (n) => {
    state.money = (Number(state.money) || 0) + Math.round(n);
    refresh();
  };
  const note = (t, m, cb) => notice(t, m, cb || null, true);
  const logLine = (s) => {
    try {
      say(s);
    } catch {}
  };
  const heat = (d) => {
    try {
      if (window.FL_RICH) {
        const r = FL_RICH.state();
        r.heat = cl((r.heat || 0) + d);
      }
    } catch {}
  };
  // company money first, then your own
  const payCo = (c, n) => {
    n = Math.round(n);
    if (n <= 0) return true;
    if (c.cash + bank() < n) return false;
    const fromCo = Math.max(0, Math.min(c.cash, n));
    c.cash -= fromCo;
    if (n - fromCo > 0) spend(n - fromCo);
    return true;
  };
  const coFunds = (c) => c.cash + bank();

  // ------------------------------------------------------------------ company maths
  const C_ = (c) => CATS[c.cat];
  const maxLocs = (c) => STAGE_MAX[c.stage];
  const locCost = (c) => rN(C_(c).startup * K() * (0.85 + c.locs * 0.004));
  const salary = (lvl) => rN(70e3 * K() * (1 + lvl * 0.9));
  const avgHype = (c) => (c.stock.length ? c.stock.reduce((s, f) => s + (c.hype[f] ?? 60), 0) / c.stock.length : 50);
  const pressure = (cat) => {
    const r = E().rivals[cat] || [];
    return r.length ? r.reduce((s, x) => s + x.strength, 0) / r.length / 100 : 0.4;
  };
  const estProfit = (c) => C_(c).rev * K() * Math.pow(c.locs, 0.94) * (0.55 + (c.rep / 100) * 0.75) * STAGE_MUL[c.stage] * C_(c).margin * 0.65;
  const profitAvg = (c) => (c.hist.length ? c.hist.slice(-2).reduce((s, h) => s + h.profit, 0) / Math.min(2, c.hist.length) : estProfit(c));
  const mult = (c) => C_(c).mult * (0.75 + c.rep / 200) * (1 + c.stage * 0.12);
  const value = (c) => Math.max(0, Math.max(0, profitAvg(c)) * mult(c) + (c.locs * C_(c).startup * K() * 0.25) + c.cash - c.debt);
  const myValue = (c) => value(c) * c.own;
  const sharePrice = (c) => (c.pub ? value(c) / c.shares : 0);
  const cname = (c) => esc(c.name);
  const img = (p) => `${p}.png`;
  const tot = () => E().cos.reduce((s, c) => s + myValue(c), 0);

  function makeCo(o) {
    const E_ = E();
    const c = {
      id: E_.nid++, cat: o.cat, icon: o.icon, name: o.name, city: o.city || pick(CITIES), franchise: !!o.franchise, locs: o.locs || 1, stage: 0, rep: o.rep ?? 35,
      cash: 0, debt: o.debt || 0, own: 1, pub: false, shares: 1e6, mgr: { ops: 0, mkt: 0, fin: 0 }, mkt: 1, pay: 0.5, stock: [], hype: {}, founded: yearNow(), hist: [], union: false, neg: 0, note: o.note || "",
    };
    if (c.locs > STAGE_MAX[0]) c.stage = c.locs > STAGE_MAX[1] ? 2 : 1;
    const dir = CATS[c.cat].catalog;
    if (dir && CATALOG[dir]) {
      const pool = CATALOG[dir].slice().sort(() => rnd() - 0.5).slice(0, 3);
      c.stock = pool.map((p) => p.file);
      pool.forEach((p) => (c.hype[p.file] = ri(40, 80)));
    }
    return c;
  }

  // ------------------------------------------------------------------ rivals
  function rivalsFor(cat) {
    const E_ = E();
    const arr = (E_.rivals[cat] ||= []);
    while (arr.length < 3) arr.push({ name: `${pick(PRE)} ${pick(NOUN[cat])}`, strength: ri(35, 75), locs: ri(3, 40) });
    return arr;
  }

  // ------------------------------------------------------------------ market (businesses for sale)
  function makeListing() {
    const cat = pick(Object.keys(CATS));
    const C = CATS[cat];
    const icon = pick(C.icons);
    const brand = isBrandIcon(icon);
    const k = K();
    const franchise = brand;
    const locs = franchise ? 1 : rnd() < 0.7 ? 1 : ri(2, 8);
    const city = pick(CITIES);
    const rev = C.rev * k * Math.pow(locs, 0.94) * (0.7 + rnd() * 0.6);
    const real = rev * C.margin * (0.55 + rnd() * 0.8);
    const issues = [];
    if (!franchise) {
      if (rnd() < 0.22) issues.push({ k: "lawsuit", cost: rN(C.startup * k * (0.3 + rnd() * 0.5)), txt: "A pending lawsuit" });
      if (rnd() < 0.2) issues.push({ k: "debt", cost: rN(C.startup * k * locs * (0.2 + rnd() * 0.5)), txt: "Hidden debts" });
      if (rnd() < 0.25) issues.push({ k: "decline", cost: 0, txt: "Sales have been declining" });
    }
    const claimed = issues.length ? real * (1.2 + rnd() * 0.25) : real * (0.94 + rnd() * 0.14);
    const ask = franchise ? rN(C.startup * k * (1.15 + rnd() * 0.35)) : rN(real * C.mult * (0.9 + rnd() * 0.4) + locs * C.startup * k * 0.2);
    return {
      id: E().nid++, cat, icon, franchise, name: franchise ? `${BRANDS[brandOf(icon)]} franchise` : `${city} ${pick(NOUN[cat])}`, city, locs, rev, real, claimed, issues, ask,
      motive: rnd(), rounds: 0, dd: false, age: 0,
    };
  }
  function refreshMarket() {
    const E_ = E();
    const y = yearNow();
    if (E_.mktYear === y && E_.market.length) return;
    E_.mktYear = y;
    E_.market = E_.market.filter((l) => rnd() < 0.55 && l.age < 3);
    E_.market.forEach((l) => l.age++);
    while (E_.market.length < 9) E_.market.push(makeListing());
  }
  const reserve = (l) => l.ask * (0.72 + 0.22 * (1 - l.motive));

  // ------------------------------------------------------------------ UI helpers
  const chev = () => (typeof CHEV !== "undefined" ? CHEV : "");
  const row = (data, ic, t, s) =>
    `<div class="row" ${data}>${ic ? `<img src="${ic}" alt="" style="object-fit:contain">` : ""}<div class="t"><b>${t}</b><span>${s}</span></div>${chev()}</div>`;
  const openScreen = (ttl, back, html) => {
    sTitle.textContent = ttl;
    if (typeof sSub !== "undefined" && sSub && sSub.style) sSub.style.display = "none";
    sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;";
    sBack.onclick = back;
    sList.innerHTML = html;
    sList.scrollTop = 0;
    screen.classList.add("open");
  };
  const card = (o) => {
    try {
      jCard({ tag: "Business Empire", ...o });
    } catch (e) {
      warn("card", e);
    }
  };
  const ccard = (c, o) => card({ iconSrc: img(c.icon), ...o, rows: [["Company", cname(c)], ...(o.rows || [])] });
  const noFunds = (back) => note("Not enough money", "You cannot cover that right now.", back);
  const goBiz = () => (typeof openBusiness === "function" ? openBusiness() : screen.classList.remove("open"));

  // ------------------------------------------------------------------ builders: the game's own rows, sections and bars
  const logoRow = (data, ic, t, s_) => `<div class="row" ${data}><img src="${ic}" alt="" style="width:54px;height:38px;object-fit:contain"><div class="t"><b>${t}</b><span>${s_}</span></div>${chev()}</div>`;
  const eSec = (t) => `<div class="sec">${t}</div>`;
  const infoRow = (t, s_) => `<div class="row sm" style="cursor:default"><div class="t"><b style="font-weight:600">${t}</b><span>${s_}</span></div></div>`;
  const barsRow = (list) =>
    `<div class="row" style="flex-direction:column;align-items:stretch;height:auto;padding:8px 14px;cursor:default">${list
      .map(([l, v, hint]) => (window.FL_BARS ? FL_BARS.html(l, v, null, hint) : `<div style="margin:4px 0"><b>${l}</b> ${Math.round(v)}% ${hint || ""}</div>`))
      .join("")}</div>`;
  const injectCss = () => {};

  // ------------------------------------------------------------------ screens: overview
  function openEmpire() {
    const E_ = E();
    const cos = E_.cos;
    const prof = cos.reduce((s_, c) => s_ + (c.last ? c.last.profit * c.own : 0), 0);
    const locs = cos.reduce((s_, c) => s_ + c.locs, 0);
    let h = eSec("Empire");
    h += infoRow(`${cos.length} compan${cos.length === 1 ? "y" : "ies"} · your stake ${money(tot())}`, `${locs} location${locs === 1 ? "" : "s"} · last year's profit (your share) ${money(prof)}`);
    h += eSec("Your companies");
    if (!cos.length) h += `<div class="row" style="cursor:default"><div class="t"><b>No companies yet</b><span>Buy a business on the market or start your own.</span></div></div>`;
    cos.forEach((c, i) => {
      h += logoRow(`data-co="${i}"`, img(c.icon), cname(c), `${STAGES[c.stage]} · ${c.locs} location${c.locs === 1 ? "" : "s"} · ${c.last ? `profit ${money(c.last.profit)}` : "just opened"}${c.pub ? " · public" : ""}${c.franchise ? " · franchise" : ""}`);
    });
    h += eSec("Grow");
    h += row(`data-go="market"`, "freelife/apple/1f4b0.png", "Businesses for sale", `${E_.market.length} listings · make an offer`);
    h += row(`data-go="found"`, "freelife/apple/1f3d7-fe0f.png", "Start a company", "Open your first location from scratch");
    openScreen("BUSINESS EMPIRE", goBiz, h);
    sList.querySelectorAll("[data-co]").forEach((el) => (el.onclick = () => openCo(cos[+el.dataset.co])));
    sList.querySelectorAll("[data-go]").forEach((el) => (el.onclick = () => (el.dataset.go === "market" ? openMarket() : openFound())));
  }

  // ------------------------------------------------------------------ market and offers
  function openMarket() {
    refreshMarket();
    const E_ = E();
    let h = eSec("For sale");
    E_.market.forEach((l, i) => (h += logoRow(`data-l="${i}"`, img(l.icon), esc(l.name), `${l.franchise ? "Franchise fee" : "Asking"} ${money(l.ask)} · ${l.locs} location${l.locs === 1 ? "" : "s"} · ${esc(l.city)}`)));
    if (!E_.market.length) h += `<div class="row" style="cursor:default"><div class="t"><b>Nothing on the market</b><span>Come back next year.</span></div></div>`;
    openScreen("FOR SALE", openEmpire, h);
    sList.querySelectorAll("[data-l]").forEach((el) => (el.onclick = () => listingCard(E_.market[+el.dataset.l])));
  }
  const mood = (l) => (l.motive > 0.66 ? "Eager to sell" : l.motive > 0.33 ? "Open to offers" : "In no hurry");

  function listingCard(l) {
    if (!l || !E().market.includes(l)) return openMarket();
    const C = CATS[l.cat];
    const rows = [
      ["Type", C.name],
      ["City", esc(l.city)],
      ["Locations", String(l.locs)],
      ["Yearly profit", `${money(l.dd ? l.real : l.claimed)}${l.dd ? " (verified)" : " (claimed)"}`],
      ["Asking", usdf(l.ask)],
      ["Seller", l.rounds ? mood(l) : "Unknown"],
    ];
    if (l.franchise) rows.splice(3, 0, ["Royalty", "6% of revenue"]);
    if (l.dd) rows.push(["Problems", l.issues.length ? l.issues.map((i) => i.txt).join(", ") : "None found"]);
    const choices = [["Make an offer", () => offerCard(l)]];
    if (!l.dd && !l.franchise) choices.push([`Due diligence (${money(l.ask * 0.015)})`, () => diligence(l), "gray"]);
    choices.push(["Back", openMarket, "gray"]);
    card({ iconSrc: img(l.icon), title: esc(l.name), lead: l.franchise ? "A franchise unit: the brand is real, but you pay royalties and follow the rules." : `A ${C.name.toLowerCase()} in ${esc(l.city)}. The owner says it is a great opportunity.`, rows, choices });
  }
  function diligence(l) {
    const fee = Math.round(l.ask * 0.015);
    if (!spend(fee)) return noFunds(() => listingCard(l));
    l.dd = true;
    note("Books reviewed", l.issues.length ? `The accountants found problems: ${l.issues.map((i) => i.txt.toLowerCase()).join(", ")}. Real yearly profit: ${money(l.real)}.` : `Everything checks out. Real yearly profit: ${money(l.real)}.`, () => listingCard(l));
  }

  function offerCard(l, counter) {
    const mk_ = (f) => ({ pct: f, amt: rN(l.ask * f) });
    const opts = [1, 0.9, 0.8, 0.7].map(mk_);
    const choices = [];
    if (counter) choices.push([`Accept ${usdf(counter)}`, () => financeCard(l, counter)]);
    opts.forEach((o) => choices.push([`Offer ${usdf(o.amt)} (${Math.round(o.pct * 100)}%)`, () => decide(l, o.amt)]));
    choices.push(["Walk away", () => listingCard(l), "gray"]);
    card({
      iconSrc: img(l.icon),
      title: "Make an offer",
      lead: counter ? `The seller counters at ${usdf(counter)}.` : l.rounds ? `Round ${l.rounds + 1} of 3. The seller is getting impatient.` : "Lowball too hard and the seller may walk away.",
      rows: [["Asking", usdf(l.ask)], ["Bank", usdf(bank())]],
      choices,
    });
  }
  function decide(l, amt) {
    const res = reserve(l);
    if (l.franchise) {
      // franchises have a fixed fee, a small discount at most
      if (amt >= l.ask * 0.95) return financeCard(l, Math.round(amt));
      return note("Corporate says no", "The franchisor does not negotiate the franchise fee. Offer close to the asking price.", () => listingCard(l));
    }
    if (amt >= res) return financeCard(l, amt);
    l.rounds++;
    if (amt >= res * 0.9 && l.rounds < 3) return note("Counteroffer", `The seller meets you halfway.`, () => offerCard(l, rN((amt + res * 1.04) / 2)));
    if (l.rounds >= 3 || rnd() < 0.25) {
      E().market = E().market.filter((x) => x !== l);
      return note("The seller walked", "Too many low offers. They stop returning your calls.", openMarket);
    }
    l.motive = cl(l.motive - 0.1, 0, 1);
    note("Rejected", "The seller says that is not even close.", () => offerCard(l));
  }
  function financeCard(l, price) {
    const loan = Math.round(price * 0.5);
    const buy = (withLoan) => {
      const cashNeeded = withLoan ? price - loan : price;
      if (!spend(cashNeeded)) return noFunds(() => financeCard(l, price));
      let hidden = 0;
      let debt = withLoan ? loan : 0;
      let rep = ri(40, 65);
      const issues = l.issues.slice();
      issues.forEach((i) => {
        if (i.k === "debt") debt += i.cost;
        if (i.k === "decline") rep -= 15;
      });
      const lawsuit = issues.find((i) => i.k === "lawsuit");
      if (lawsuit) hidden = lawsuit.cost;
      const co = makeCo({ cat: l.cat, icon: l.icon, name: l.franchise ? `${BRANDS[brandOf(l.icon)]} (${l.city})` : l.name, city: l.city, locs: l.locs, franchise: l.franchise, rep: cl(rep, 15, 95), debt });
      E().cos.push(co);
      E().market = E().market.filter((x) => x !== l);
      logLine(`I bought ${l.name} for ${usdf(price)}.`);
      const bits = [];
      if (!l.dd && issues.length) bits.push(issues.map((i) => i.txt).join(", ") + " turned up after the deal closed.");
      if (hidden) {
        const pay = hidden;
        const ok = payCo(co, pay);
        if (!ok) co.debt += pay;
        bits.push(`The lawsuit cost ${usdf(pay)}.`);
      }
      note("It's yours", `You own ${l.name}. ${bits.join(" ")}`, () => openCo(co));
    };
    card({
      iconSrc: img(l.icon),
      title: "Deal agreed",
      lead: `${esc(l.name)} for ${usdf(price)}. How do you pay?`,
      rows: [["Price", usdf(price)], ["Bank", usdf(bank())], ["Bank loan (50%)", `${usdf(loan)} at 8%`]],
      choices: [["Pay in cash", () => buy(false)], ["Finance half with a loan", () => buy(true)], ["Back out", () => listingCard(l), "gray"]],
    });
  }

  // ------------------------------------------------------------------ found a company
  function openFound() {
    let h = eSec("Pick an industry");
    Object.entries(CATS).forEach(([id, C]) => (h += logoRow(`data-c="${id}"`, img(C.icons.find((x) => !isBrandIcon(x)) || C.icons[0]), C.name, `${money(C.startup * K())} to open · ${esc(C.blurb)}`)));
    openScreen("START A COMPANY", openEmpire, h);
    sList.querySelectorAll("[data-c]").forEach((el) => (el.onclick = () => openFoundIcons(el.dataset.c)));
  }
  function openFoundIcons(cat) {
    const C = CATS[cat];
    const icons = C.icons.filter((i) => !isBrandIcon(i));
    let h = eSec(`${C.name}: choose your storefront`);
    icons.forEach((p, i) => (h += logoRow(`data-i="${i}"`, img(p), prettyIcon(p), `${money(C.startup * K())} to open`)));
    openScreen(C.name.toUpperCase(), openFound, h);
    sList.querySelectorAll("[data-i]").forEach((el) => (el.onclick = () => foundConfirm(cat, icons[+el.dataset.i])));
  }
  function foundConfirm(cat, icon) {
    const C = CATS[cat];
    const cost = rN(C.startup * K());
    let sn = "My";
    try {
      sn = typeof SURNAME === "string" && SURNAME ? SURNAME : "My";
    } catch {}
    const name = `${sn} ${pick(NOUN[cat])}`;
    card({
      iconSrc: img(icon),
      title: name,
      lead: `Open your first ${C.name.toLowerCase()}. ${C.blurb}`,
      rows: [["Startup cost", usdf(cost)], ["Bank", usdf(bank())], ["Workers", `~${C.perLoc} ${C.staff}`]],
      choices: [
        [
          "Open it",
          () => {
            if (E().cos.length >= 8) return note("Too many companies", "You can only run eight companies at once.", openEmpire);
            if (!spend(cost)) return noFunds(() => foundConfirm(cat, icon));
            const co = makeCo({ cat, icon, name, rep: 28 });
            E().cos.push(co);
            logLine(`I opened ${name}, a new ${C.name.toLowerCase()}.`);
            note("Open for business", `${name} opens its doors. Expect a slow first year.`, () => openCo(co));
          },
        ],
        ["Cancel", openFoundIcons.bind(null, cat), "gray"],
      ],
    });
  }

  // ------------------------------------------------------------------ company screens
  const MKT = ["None", "Low", "High"];
  const PAY = [["Reinvest everything", 0], ["Pay 50% as dividends", 0.5], ["Pay everything out", 1]];
  function openCo(c) {
    if (!E().cos.includes(c)) return openEmpire();
    const C = C_(c);
    let h = eSec(`${cname(c)} · ${esc(c.city)}`);
    h += infoRow(`Value ${money(value(c))} · you own ${Math.round(c.own * 100)}% (${money(myValue(c))})`, `${STAGES[c.stage]} · ${c.locs}/${maxLocs(c)} locations · cash ${money(c.cash)} · debt ${money(c.debt)}${c.pub ? ` · share ${usdf(sharePrice(c))}` : ""}${c.franchise ? " · franchise" : ""}${c.union ? " · union" : ""}`);
    h += barsRow([["Reputation", c.rep, ""], ["Locations", (c.locs / maxLocs(c)) * 100, `${c.locs}/${maxLocs(c)}`]]);
    if (c.last) h += infoRow(`Last year: revenue ${money(c.last.rev)} · profit ${money(c.last.profit)}`, `${c.hist.length} year${c.hist.length === 1 ? "" : "s"} of history`);
    h += `<div class="sec">Grow</div>`;
    h += row(`data-a="expand"`, "freelife/apple/1f3d7-fe0f.png", "Expand", c.stage < 3 ? `${STAGES[c.stage]} → open locations or go ${STAGES[c.stage + 1]}` : "Open more locations worldwide");
    if (C.catalog && CATALOG[C.catalog]) h += row(`data-a="prod"`, prodOf(C.catalog, c.stock[0]) ? `${C.catalog}/${c.stock[0]}.png` : "", "Products", `${c.stock.length}/${3 + c.stage * 2} on the shelves · hype ${Math.round(avgHype(c))}`);
    h += row(`data-a="mkt"`, "freelife/apple/1f4e3.png", `Marketing: ${MKT[c.mkt]}`, "Tap to change the yearly budget");
    h += row(`data-a="rivals"`, "freelife/apple/2694-fe0f.png", "Competition and acquisitions", `${rivalsFor(c.cat).length} rival chains · pressure ${Math.round(pressure(c.cat) * 100)}%`);
    h += `<div class="sec">Run it</div>`;
    h += row(`data-a="mgr"`, "freelife/apple/1f454.png", "Management", `Ops ${c.mgr.ops} · Marketing ${c.mgr.mkt} · Finance ${c.mgr.fin}`);
    h += row(`data-a="fin"`, "freelife/apple/1f4b5.png", "Finance", c.pub ? "Loans, buybacks and your shares" : "Loans, investors, cash, IPO");
    h += row(`data-a="pay"`, "freelife/apple/1f4b8.png", `Payout: ${PAY.find((p) => p[1] === c.pay)[0]}`, "Tap to change the dividend policy");
    h += row(`data-a="sell"`, "freelife/apple/1f4b0.png", "Sell the company", "Ask the market for offers");
    openScreen(cname(c).toUpperCase().slice(0, 24), openEmpire, h);
    sList.querySelectorAll("[data-a]").forEach((el) => {
      el.onclick = () => {
        const a = el.dataset.a;
        if (a === "expand") expandCard(c);
        else if (a === "prod") openProducts(c);
        else if (a === "mkt") {
          c.mkt = (c.mkt + 1) % 3;
          openCo(c);
        } else if (a === "rivals") openRivals(c);
        else if (a === "mgr") openMgr(c);
        else if (a === "fin") openFin(c);
        else if (a === "pay") {
          const i = PAY.findIndex((p) => p[1] === c.pay);
          c.pay = PAY[(i + 1) % PAY.length][1];
          openCo(c);
        } else if (a === "sell") sellCard(c);
      };
    });
  }

  // ---- expansion
  function stageUpCost(c) {
    return rN(C_(c).startup * K() * [8, 30, 100][c.stage]);
  }
  function stageReq(c) {
    return [[4, 0], [15, 50], [50, 65]][c.stage];
  }
  function expandCard(c) {
    const lc = locCost(c);
    const room = maxLocs(c) - c.locs;
    const choices = [];
    [1, 5, 10].forEach((n) => {
      if (room >= n) choices.push([`Open ${n} location${n > 1 ? "s" : ""} (${money(lc * n)})`, () => openLocs(c, n)]);
    });
    if (c.stage < 3) {
      const [rl, rr] = stageReq(c);
      choices.push([`Go ${STAGES[c.stage + 1]} (${money(stageUpCost(c))})`, () => stageUp(c)]);
    }
    choices.push(["Back", () => openCo(c), "gray"]);
    const req = c.stage < 3 ? stageReq(c) : null;
    ccard(c, {
      title: "Expand",
      lead: room <= 0 ? `You are at the limit for a ${STAGES[c.stage].toLowerCase()} company.` : "More locations mean more revenue, but every one costs money and talent.",
      rows: [["Locations", `${c.locs}/${maxLocs(c)}`], ["Cost per location", usdf(lc)], ["Available", usdf(coFunds(c))], ...(req ? [[`To go ${STAGES[c.stage + 1]}`, `${req[0]}+ locations${req[1] ? `, reputation ${req[1]}+` : ""}`]] : [])],
      choices,
    });
  }
  function openLocs(c, n) {
    const cost = locCost(c) * n;
    if (!payCo(c, cost)) return noFunds(() => expandCard(c));
    c.locs += n;
    c.rep = cl(c.rep - n * 0.4);
    logLine(`${c.name} opened ${n} new location${n > 1 ? "s" : ""}.`);
    note("Expanded", `${n} new location${n > 1 ? "s" : ""} open. ${c.name} now has ${c.locs}.`, () => expandCard(c));
  }
  function stageUp(c) {
    const [rl, rr] = stageReq(c);
    if (c.locs < rl || c.rep < rr) return note("Not ready", `To go ${STAGES[c.stage + 1]} you need ${rl}+ locations${rr ? ` and reputation ${rr}+` : ""}.`, () => expandCard(c));
    if (c.franchise && c.stage >= 1) return note("Franchise limit", "A franchisee cannot become a national brand. Buy the corporation instead.", () => expandCard(c));
    const cost = stageUpCost(c);
    if (!payCo(c, cost)) return noFunds(() => expandCard(c));
    c.stage++;
    c.rep = cl(c.rep + 6);
    logLine(`${c.name} became a ${STAGES[c.stage].toLowerCase()} company.`);
    note(`${STAGES[c.stage]} company`, `${c.name} goes ${STAGES[c.stage].toLowerCase()}. You can now run up to ${maxLocs(c)} locations.`, () => openCo(c));
  }

  // ---- products
  function openProducts(c) {
    const dir = C_(c).catalog;
    const list = CATALOG[dir] || [];
    const slots = 3 + c.stage * 2;
    let h = `<div class="sec">On the shelves (${c.stock.length}/${slots})</div>`;
    c.stock.forEach((f) => {
      const p = prodOf(dir, f);
      if (p) h += row(`data-s="${f}"`, `${dir}/${f}.png`, esc(p.label), `${usdf(p.price)} · hype ${Math.round(c.hype[f] ?? 60)} · tap to remove`);
    });
    if (!c.stock.length) h += `<div class="row" style="cursor:default"><div class="t"><b>Empty shelves</b><span>Stock something below.</span></div></div>`;
    h += `<div class="sec">Catalog</div>`;
    list.filter((p) => !c.stock.includes(p.file)).forEach((p) => (h += row(`data-p="${p.file}"`, `${dir}/${p.file}.png`, esc(p.label), `${usdf(p.price)} · stock cost ${money(p.price * 35 * Math.sqrt(c.locs))}`)));
    openScreen("PRODUCTS", () => openCo(c), h);
    sList.querySelectorAll("[data-s]").forEach((el) => (el.onclick = () => {
      c.stock = c.stock.filter((f) => f !== el.dataset.s);
      openProducts(c);
    }));
    sList.querySelectorAll("[data-p]").forEach((el) => (el.onclick = () => {
      if (c.stock.length >= slots) return note("Shelves are full", `Remove something first, or go ${STAGES[Math.min(3, c.stage + 1)]} for more room.`, () => openProducts(c));
      const p = prodOf(dir, el.dataset.p);
      const cost = p.price * 35 * Math.sqrt(c.locs);
      if (!payCo(c, cost)) return noFunds(() => openProducts(c));
      c.stock.push(p.file);
      c.hype[p.file] = ri(45, 85);
      openProducts(c);
    }));
  }

  // ---- rivals and M&A
  function openRivals(c) {
    const rs = rivalsFor(c.cat);
    let h = `<div class="sec">Rival chains</div>`;
    rs.forEach((r, i) => (h += row(`data-r="${i}"`, "", esc(r.name), `${r.locs} locations · strength ${Math.round(r.strength)} · buy for ${money(rivalPrice(c, r))}`)));
    openScreen("COMPETITION", () => openCo(c), h);
    sList.querySelectorAll("[data-r]").forEach((el) => (el.onclick = () => acquireCard(c, rs[+el.dataset.r])));
  }
  const rivalPrice = (c, r) => rN(r.locs * C_(c).startup * K() * (0.8 + r.strength / 100));
  function acquireCard(c, r) {
    const price = rivalPrice(c, r);
    const add = Math.round(r.locs * 0.85);
    const others = rivalsFor(c.cat).filter((x) => x !== r).reduce((s, x) => s + x.locs, 0);
    const share = (c.locs + add) / (c.locs + add + others);
    ccard(c, {
      title: `Acquire ${esc(r.name)}`,
      lead: c.stage < 1 ? "Only a regional company or bigger can buy a rival." : "Buying a competitor adds its locations and removes it from the market. Regulators may object if you get too big.",
      rows: [["Price", usdf(price)], ["Locations gained", `~${add}`], ["Market share after", `${Math.round(share * 100)}%`], ["Available", usdf(coFunds(c))]],
      choices: [
        [
          "Make the offer",
          () => {
            if (c.stage < 1) return note("Too small", "Grow to a regional company first.", () => openRivals(c));
            if (c.locs + add > maxLocs(c)) return note("Over your limit", `You would exceed the ${maxLocs(c)} locations of a ${STAGES[c.stage].toLowerCase()} company.`, () => openRivals(c));
            if (coFunds(c) < price) return noFunds(() => openRivals(c));
            if (share > 0.5 && rnd() < 0.55) {
              payCo(c, Math.round(price * 0.08));
              return note("Blocked", "Antitrust regulators blocked the merger and fined you for trying.", () => openRivals(c));
            }
            if (rnd() < 0.2) return note("They said no", `${r.name}'s board refused the offer.`, () => openRivals(c));
            payCo(c, price);
            c.locs += add;
            c.rep = cl(c.rep + 4);
            const rs = rivalsFor(c.cat);
            rs[rs.indexOf(r)] = { name: `${pick(PRE)} ${pick(NOUN[c.cat])}`, strength: ri(30, 60), locs: ri(2, 12) };
            logLine(`${c.name} acquired ${r.name}.`);
            note("Acquired", `${r.name} is now part of ${c.name}: +${add} locations.`, () => openRivals(c));
          },
        ],
        ["Back", () => openRivals(c), "gray"],
      ],
    });
  }

  // ---- management
  function openMgr(c) {
    const R = [["ops", "Operations", "Cuts costs, +1.2% margin per level"], ["mkt", "Marketing", "Boosts reputation and sales"], ["fin", "Finance", "Lower interest and taxes, stops fraud"]];
    let h = `<div class="sec">Executives</div>`;
    R.forEach(([k, n, d]) => (h += row(`data-m="${k}"`, "", `${n}: level ${c.mgr[k]}`, `${d} · ${c.mgr[k] ? `paid ${money(salary(c.mgr[k]))}/yr` : "vacant"}`)));
    openScreen("MANAGEMENT", () => openCo(c), h);
    sList.querySelectorAll("[data-m]").forEach((el) => (el.onclick = () => mgrCard(c, el.dataset.m)));
  }
  function mgrCard(c, k) {
    const lvl = c.mgr[k];
    const nm = { ops: "Operations", mkt: "Marketing", fin: "Finance" }[k];
    const fee = Math.round(salary(lvl + 1) * 0.5);
    const choices = [];
    if (lvl < 3)
      choices.push([`${lvl ? "Hire a better" : "Hire a"} ${nm.toLowerCase()} director (fee ${money(fee)}, ${money(salary(lvl + 1))}/yr)`, () => {
        if (!payCo(c, fee)) return noFunds(() => mgrCard(c, k));
        c.mgr[k] = lvl + 1;
        logLine(`${c.name} hired a ${nm.toLowerCase()} director.`);
        note("Hired", `Your new ${nm.toLowerCase()} director starts Monday.`, () => openMgr(c));
      }]);
    if (lvl > 0) choices.push(["Fire them", () => ((c.mgr[k] = 0), note("Fired", "They clear out their desk.", () => openMgr(c))), "gray"]);
    choices.push(["Back", () => openMgr(c), "gray"]);
    ccard(c, { title: `${nm} director`, lead: lvl ? "Good people leave when a rival offers more. Keep them happy." : "The seat is empty.", rows: [["Level", String(lvl)], ["Salary", lvl ? `${usdf(salary(lvl))}/yr` : "-"]], choices });
  }

  // ---- finance
  function maxDebt(c) {
    return rN(Math.max(C_(c).startup * K() * 2, Math.max(0, profitAvg(c)) * 4));
  }
  function openFin(c) {
    const my = value(c) * c.own;
    let h = `<div class="sec">Finance</div>`;
    h += `<div class="row sm" style="cursor:default"><div class="t"><b style="font-weight:600">Cash ${money(c.cash)} · Debt ${money(c.debt)} · Stake ${Math.round(c.own * 100)}%</b><span>Company value ${money(value(c))}${c.pub ? ` · share ${usdf(sharePrice(c))}` : ""}</span></div></div>`;
    h += row(`data-f="loan"`, "", "Borrow from the bank", `Up to ${money(Math.max(0, maxDebt(c) - c.debt))} more at 8%`);
    if (c.debt > 0) h += row(`data-f="repay"`, "", "Repay debt", `${money(c.debt)} owed`);
    h += row(`data-f="wd"`, "", "Take cash out", `${money(c.cash)} in the company`);
    h += row(`data-f="inj"`, "", "Put your own money in", `Bank ${money(bank())}`);
    if (!c.pub) {
      h += row(`data-f="inv"`, "", "Sell a stake to investors", `10-30% for cash, you keep control above 50%`);
      h += row(`data-f="ipo"`, "", "Go public (IPO)", c.stage >= 2 && c.locs >= 15 ? "Sell 25% on the stock market" : "Needs a national company with 15+ locations");
    } else {
      h += row(`data-f="sellsh"`, "", "Sell shares", `Your stake is worth ${money(my)}`);
      h += row(`data-f="buysh"`, "", "Buy back shares", `${usdf(sharePrice(c))} per share`);
    }
    openScreen("FINANCE", () => openCo(c), h);
    sList.querySelectorAll("[data-f]").forEach((el) => (el.onclick = () => finAct(c, el.dataset.f)));
  }
  function finAct(c, a) {
    const back = () => openFin(c);
    if (a === "loan") {
      const room = Math.max(0, maxDebt(c) - c.debt);
      const opts = [0.25, 0.5, 1].map((f) => rN(room * f)).filter((v) => v > 0);
      return ccard(c, { title: "Bank loan", lead: "8% interest a year, paid from the company's profit.", rows: [["Available", usdf(room)]], choices: [...opts.map((v) => [`Borrow ${usdf(v)}`, () => ((c.debt += v), (c.cash += v), note("Approved", `${usdf(v)} lands in the company account.`, back))]), ["Back", back, "gray"]] });
    }
    if (a === "repay") {
      const v = Math.min(c.debt, coFunds(c));
      return ccard(c, { title: "Repay debt", rows: [["Owed", usdf(c.debt)]], choices: [[`Repay ${usdf(v)}`, () => (payCo(c, v) && (c.debt -= v), note("Paid", "Less interest every year.", back))], ["Back", back, "gray"]] });
    }
    if (a === "wd") {
      const v = Math.round(c.cash * c.own);
      return ccard(c, { title: "Take cash out", lead: "You can only take your share of what the company holds.", rows: [["Your share of the cash", usdf(v)]], choices: [[`Take ${usdf(v)}`, () => (v > 0 && ((c.cash -= v / c.own), earn(v)), note("Done", "The money hits your account.", back))], ["Back", back, "gray"]] });
    }
    if (a === "inj") {
      const opts = [0.1, 0.25, 0.5].map((f) => rN(bank() * f)).filter((v) => v > 0);
      return ccard(c, { title: "Inject cash", rows: [["Bank", usdf(bank())]], choices: [...opts.map((v) => [`Put in ${usdf(v)}`, () => (spend(v) && (c.cash += v), note("Done", "The company has more to work with.", back))]), ["Back", back, "gray"]] });
    }
    if (a === "inv") {
      const v = value(c);
      const ch = [0.1, 0.2, 0.3].filter((p) => c.own - p >= 0.5).map((p) => [`Sell ${p * 100}% for ${money(v * p * 0.9)}`, () => ((c.own -= p), (c.cash += v * p * 0.9), logLine(`I sold ${p * 100}% of ${c.name} to investors.`), note("Funded", `Investors put ${money(v * p * 0.9)} into the company.`, back))]);
      return ccard(c, { title: "Investors", lead: ch.length ? "They pay a little under the valuation and share future dividends." : "You cannot give up control below 50%.", rows: [["Valuation", usdf(v)], ["Your stake", `${Math.round(c.own * 100)}%`]], choices: [...ch, ["Back", back, "gray"]] });
    }
    if (a === "ipo") {
      if (c.stage < 2 || c.locs < 15) return note("Not ready", "Underwriters want a national company with at least 15 locations.", back);
      const v = value(c);
      return ccard(c, {
        title: "Initial public offering",
        lead: "The company lists on the stock exchange and sells 25% to the public. After that the board and the market watch every move.",
        rows: [["Valuation", usdf(v)], ["Proceeds", usdf(v * 0.25 * 0.94)], ["Your stake after", `${Math.round(c.own * 75)}%`]],
        choices: [["Ring the bell", () => ((c.pub = true), (c.cash += v * 0.25 * 0.94), (c.own *= 0.75), (c.rep = cl(c.rep + 8)), logLine(`${c.name} went public.`), note("We are public", `${c.name} opens at ${usdf(sharePrice(c))} a share.`, () => openCo(c)))], ["Back", back, "gray"]],
      });
    }
    if (a === "sellsh" || a === "buysh") {
      const sp = sharePrice(c);
      const sell = a === "sellsh";
      const ch = [0.05, 0.1, 0.2].map((p) => {
        const amt = sp * c.shares * p;
        return [`${sell ? "Sell" : "Buy"} ${p * 100}% (${money(amt)})`, () => {
          if (sell && c.own - p < 0.2) return note("Too much", "Selling that much would end your control.", back);
          if (!sell && (c.own + p > 1 || !spend(amt))) return note("Cannot", "Not enough money, or there is nothing left to buy.", back);
          if (sell) earn(amt);
          c.own += sell ? -p : p;
          note("Done", `${sell ? "Sold" : "Bought"} at ${usdf(sp)} a share.`, back);
        }];
      });
      return ccard(c, { title: sell ? "Sell shares" : "Buy back shares", rows: [["Share price", usdf(sp)], ["Your stake", `${Math.round(c.own * 100)}%`]], choices: [...ch, ["Back", back, "gray"]] });
    }
  }

  // ---- selling
  function sellCard(c) {
    const v = value(c);
    const bids = [0.88, 1.02, 1.22].map((f) => rN(v * f * (0.95 + rnd() * 0.1)));
    const buyers = ["a regional chain", "a private equity firm", "a competitor"];
    const sellFor = (b) => () => {
      earn(b * c.own);
      E().cos = E().cos.filter((x) => x !== c);
      logLine(`I sold ${c.name} for ${usdf(b * c.own)}.`);
      note("Sold", `${c.name} is no longer yours. You pocketed ${usdf(b * c.own)}.`, openEmpire);
    };
    ccard(c, {
      title: "Offers for the company",
      lead: `Three buyers made bids on the whole company. You get your ${Math.round(c.own * 100)}% share.`,
      rows: [["Estimated value", usdf(v)], ["Your stake", `${Math.round(c.own * 100)}%`]],
      choices: [...bids.map((b, i) => [`${buyers[i]}: ${usdf(b)} (you get ${usdf(b * c.own)})`, sellFor(b)]), ["Keep it", () => openCo(c), "gray"]],
    });
  }

  // ------------------------------------------------------------------ events
  const m_ = (c, x) => rN(x * K() * Math.max(1, Math.pow(c.locs, 0.6)));
  const EVENTS = [
    {
      id: "viral", w: (c) => (c.stock.length ? 1 : 0.2),
      run: (c) => {
        const f = c.stock.length ? pick(c.stock) : null;
        if (f) c.hype[f] = 100;
        const cost = m_(c, 25e3);
        ccard(c, { title: "Going viral", lead: f ? `A video of your ${esc((prodOf(C_(c).catalog, f) || {}).label || "product")} is blowing up online.` : "A video about your brand is blowing up online.", rows: [["Boost campaign", usdf(cost)]], choices: [["Ride the wave", () => (payCo(c, cost) ? ((c.rep = cl(c.rep + 10)), note("Massive", "Sales spike and the brand gets a big lift.")) : noFunds())], ["Let it run", () => ((c.rep = cl(c.rep + 3)), note("Free exposure", "It helps a bit."))]] });
      },
    },
    {
      id: "recall", w: (c) => (c.cat === "food" || c.cat === "clothing" ? 0.9 : 0.15),
      run: (c) => {
        const cost = m_(c, 60e3);
        ccard(c, { title: "Product recall", lead: "A batch has a safety problem.", rows: [["Recall cost", usdf(cost)]], choices: [["Recall everything", () => (payCo(c, cost) || (c.debt += cost), (c.rep = cl(c.rep - 3)), note("Handled", "People respect a fast recall."))], ["Quietly ignore it", () => (rnd() < 0.5 ? ((c.rep = cl(c.rep - 18)), payCo(c, m_(c, 250e3)) || (c.debt += m_(c, 250e3)), note("It blew up", "People got hurt. Lawsuits and bad press follow.")) : note("Lucky", "Nobody noticed this time."))]] });
      },
    },
    {
      id: "union", w: (c) => (c.union || c.locs < 5 ? 0.1 : 0.8),
      run: (c) => {
        ccard(c, { title: "Union drive", lead: "Your workers want to unionize.", choices: [["Recognize the union", () => ((c.union = true), (c.rep = cl(c.rep + 5)), note("Signed", "Margins shrink a bit, morale goes up."))], ["Fight it", () => (rnd() < 0.6 ? note("Defeated", "The drive collapses.") : (payCo(c, m_(c, 90e3)) || (c.debt += m_(c, 90e3)), (c.rep = cl(c.rep - 8)), note("Strike", "A strike hits sales and your name.")))]] });
      },
    },
    {
      id: "lawsuit", w: () => 1,
      run: (c) => {
        const s = m_(c, 40e3);
        ccard(c, { title: "Lawsuit", lead: "A customer says one of your locations hurt them.", rows: [["Settlement", usdf(s)]], choices: [["Settle", () => (payCo(c, s) || (c.debt += s), note("Settled", "Quietly done."))], ["Fight it", () => (rnd() < 0.45 ? note("Won", "The court dismisses it.") : (payCo(c, s * 3.5) || (c.debt += s * 3.5), (c.rep = cl(c.rep - 6)), note("Lost", "You pay far more than the settlement.")))]] });
      },
    },
    {
      id: "hack", w: (c) => (c.mgr.fin ? 0.3 : 0.7),
      run: (c) => {
        const s = m_(c, 90e3);
        ccard(c, { title: "Data breach", lead: "Hackers got your customers' data.", rows: [["Response cost", usdf(s)]], choices: [["Hire a security firm", () => (payCo(c, s) || (c.debt += s), (c.rep = cl(c.rep - 3)), note("Contained", "It could have been worse."))], ["Say nothing", () => ((c.rep = cl(c.rep - 14)), note("Leaked", "It comes out anyway, and people are angry."))]] });
      },
    },
    {
      id: "scandal", w: () => 0.5,
      run: (c) => {
        ccard(c, { title: "Scandal", lead: `A photo of you at a party leaks and the press ties it to ${cname(c)}.`, choices: [["Apologize", () => (payCo(c, m_(c, 30e3)), (c.rep = cl(c.rep - 3)), note("Forgiven", "The internet moves on in a week."))], ["Deny everything", () => (rnd() < 0.5 ? note("Blown over", "Nobody cares for long.") : ((c.rep = cl(c.rep - 15)), note("Backfired", "The denial becomes the story.")))]] });
      },
    },
    {
      id: "supplier", w: () => 1,
      run: (c) => {
        const x = m_(c, 50e3);
        ccard(c, { title: "Supplier price hike", lead: "Your main supplier raises prices.", rows: [["Extra cost", usdf(x)]], choices: [["Accept", () => (payCo(c, x) || (c.debt += x), note("Accepted", "Margins take a hit."))], ["Switch suppliers", () => (payCo(c, m_(c, 70e3)) ? (rnd() < 0.7 ? (c.mgr.ops < 3 && (c.rep = cl(c.rep + 2)), note("Cheaper", "The new supplier is better and cheaper.")) : note("Mess", "The new supplier has delays.")) : noFunds())]] });
      },
    },
    {
      id: "celeb", w: () => 0.7,
      run: (c) => {
        const x = m_(c, 120e3);
        ccard(c, { title: "Celebrity endorsement", lead: "A famous name wants to be the face of your brand.", rows: [["Deal", usdf(x)]], choices: [["Sign them", () => (payCo(c, x) ? (c.stock.forEach((f) => (c.hype[f] = cl((c.hype[f] ?? 60) + 12))), (c.rep = cl(c.rep + 10)), note("Signed", "The ads go live next week.")) : noFunds())], ["Pass", () => {}, "gray"]] });
      },
    },
    {
      id: "inspect", w: (c) => (["food", "icecream", "gym", "retail"].includes(c.cat) ? 1 : 0.2),
      run: (c) => {
        const x = m_(c, 25e3);
        ccard(c, { title: "Health inspection", lead: "Inspectors found violations.", rows: [["Fix cost", usdf(x)]], choices: [["Fix everything", () => (payCo(c, x) || (c.debt += x), note("Compliant", "You pass the re-inspection."))], ["Slip them a bribe", () => (heat(6), rnd() < 0.6 ? note("Overlooked", "The report disappears.") : (payCo(c, x * 3) || (c.debt += x * 3), (c.rep = cl(c.rep - 10)), note("Caught", "The bribe is reported. Fines and headlines.")))]] });
      },
    },
    {
      id: "robbery", w: (c) => (c.cat === "jewelry" ? 1.5 : 0.5),
      run: (c) => {
        const x = m_(c, c.cat === "jewelry" ? 220e3 : 30e3);
        ccard(c, { title: "Robbery", lead: `Thieves hit one of your locations.`, rows: [["Losses", usdf(x)]], choices: [["Absorb the loss", () => (payCo(c, x) || (c.debt += x), note("Done", "Police are looking."))], ["Upgrade security", () => (payCo(c, x + m_(c, 40e3)) || (c.debt += x), (c.rep = cl(c.rep + 2)), note("Safer", "Cameras and guards everywhere."))]] });
      },
    },
    {
      id: "poach", w: (c) => (c.mgr.ops + c.mgr.mkt + c.mgr.fin > 0 ? 0.9 : 0),
      run: (c) => {
        const k = pick(["ops", "mkt", "fin"].filter((x) => c.mgr[x] > 0));
        const nm = { ops: "operations", mkt: "marketing", fin: "finance" }[k];
        const x = salary(c.mgr[k]) * 0.5;
        ccard(c, { title: "Poached", lead: `A rival is trying to steal your ${nm} director.`, rows: [["Counteroffer", `${usdf(x)} bonus`]], choices: [["Counter", () => (payCo(c, x) ? note("Stays", "They stay, and stay loyal.") : noFunds())], ["Let them go", () => ((c.mgr[k] = Math.max(0, c.mgr[k] - 1)), note("Gone", "Time to hire someone."))]] });
      },
    },
    {
      id: "audit", w: (c) => (c.mgr.fin ? 0.3 : 0.9),
      run: (c) => {
        const x = m_(c, 60e3);
        ccard(c, { title: "Tax audit", lead: "The tax authority wants a look at your books.", rows: [["Back taxes", usdf(x)]], choices: [["Pay and move on", () => (payCo(c, x) || (c.debt += x), note("Paid", "Boring but safe."))], ["Hire lawyers ($30K)", () => (payCo(c, m_(c, 30e3)), rnd() < 0.5 ? note("Cleared", "The lawyers win.") : (payCo(c, x) || (c.debt += x), note("Lost", "You pay both.")))]] });
      },
    },
    {
      id: "pricewar", w: (c) => 0.4 + pressure(c.cat),
      run: (c) => {
        const x = m_(c, 80e3);
        ccard(c, { title: "Price war", lead: "A rival slashes prices across town.", choices: [[`Match them (${usdf(x)})`, () => (payCo(c, x) || (c.debt += x), (c.rep = cl(c.rep + 2)), note("Matched", "Margins hurt, customers stay."))], ["Hold your prices", () => ((c.rep = cl(c.rep - 5)), payCo(c, x / 2), note("Lost customers", "Some leave for the cheaper place."))]] });
      },
    },
    {
      id: "partner", w: (c) => (c.locs < maxLocs(c) ? 0.8 : 0),
      run: (c) => {
        const x = Math.round(locCost(c) * 0.5);
        ccard(c, { title: "A mayor's offer", lead: "A city offers a cheap lease and tax breaks for a new location.", rows: [["Half price", usdf(x)]], choices: [["Open there", () => (payCo(c, x) ? ((c.locs += 1), note("New location", "It opens next quarter.")) : noFunds())], ["Pass", () => {}, "gray"]] });
      },
    },
    {
      id: "angel", w: (c) => (!c.pub && c.own >= 0.7 ? 0.7 : 0),
      run: (c) => {
        const v = value(c);
        const x = Math.round(v * 0.1 * 1.1);
        ccard(c, { title: "Investor interest", lead: "An angel investor offers a premium for a minority stake.", rows: [["Offer", `${usdf(x)} for 10%`]], choices: [["Accept", () => ((c.own -= 0.1), (c.cash += x), note("Funded", "The money goes into the company."))], ["Decline", () => {}, "gray"]] });
      },
    },
    {
      id: "buyout", w: (c) => (value(c) > 5 * C_(c).startup * K() ? 0.9 : 0.2),
      run: (c) => {
        const v = value(c);
        const b = rN(v * (1.1 + rnd() * 0.5));
        ccard(c, { title: "Buyout offer", lead: `${pick(["A private equity fund", "A larger chain", "A foreign investor"])} wants to buy ${cname(c)}.`, rows: [["Offer", usdf(b)], ["Your share", usdf(b * c.own)]], choices: [["Sell", () => (earn(b * c.own), (E().cos = E().cos.filter((x) => x !== c)), logLine(`I sold ${c.name} for ${usdf(b * c.own)}.`), note("Sold", `You pocket ${usdf(b * c.own)}.`))], ["Counter at 25% more", () => (rnd() < 0.4 ? (earn(b * 1.25 * c.own), (E().cos = E().cos.filter((x) => x !== c)), note("They agreed", `Sold for ${usdf(b * 1.25 * c.own)}.`)) : note("They walked", "The buyer withdrew."))], ["Refuse", () => {}, "gray"]] });
      },
    },
    {
      id: "award", w: () => 0.6,
      run: (c) => {
        c.rep = cl(c.rep + 6);
        ccard(c, { title: "Best of the year", lead: `${cname(c)} wins a local business award.`, choices: [["Nice", () => {}]] });
      },
    },
    {
      id: "embezzle", w: (c) => (c.mgr.fin || c.locs < 3 ? 0 : 0.7),
      run: (c) => {
        const x = m_(c, 60e3);
        ccard(c, { title: "Missing money", lead: "An accountant has been skimming from the books. You have no finance director to catch it.", rows: [["Missing", usdf(x)]], choices: [["Report it", () => (heat(-1), (c.cash = Math.max(0, c.cash - x)), note("Reported", "Police take over."))], ["Hire a finance director", () => ((c.mgr.fin = 1), (c.cash = Math.max(0, c.cash - x)), note("Hired", "Never again."))]] });
      },
    },
    {
      id: "copycat", w: (c) => (c.stock.length ? 0.6 : 0),
      run: (c) => {
        const f = pick(c.stock);
        const x = m_(c, 30e3);
        ccard(c, { title: "Copycats", lead: "A knockoff chain is selling your best product for less.", choices: [[`Sue them (${usdf(x)})`, () => (payCo(c, x), rnd() < 0.55 ? note("Won", "They pull it off the shelves.") : ((c.hype[f] = cl((c.hype[f] ?? 60) - 20)), note("Lost", "The case drags on.")))], ["Ignore", () => ((c.hype[f] = cl((c.hype[f] ?? 60) - 10)), note("Hype fades", "People get tired of it."))]] });
      },
    },
    {
      id: "activist", w: (c) => (c.pub && c.own < 0.5 ? 1.5 : 0),
      run: (c) => {
        ccard(c, { title: "Activist investor", lead: "A hedge fund bought a large stake and wants the board to cut costs and pay a special dividend.", choices: [["Give in", () => (payCo(c, 0), (c.mgr.ops = Math.min(3, c.mgr.ops + 1)), (c.rep = cl(c.rep - 4)), note("Settled", "They claim a win."))], ["Fight for control", () => (rnd() < 0.5 ? note("Held the line", "Shareholders back you.") : ((c.own = Math.max(0.2, c.own - 0.1)), note("They won seats", "You lose some control.")))]] });
      },
    },
  ];

  function pickEvent(c) {
    const opts = EVENTS.map((e) => ({ e, w: e.w(c) })).filter((o) => o.w > 0);
    const t = opts.reduce((s, o) => s + o.w, 0);
    if (!t) return null;
    let x = rnd() * t;
    for (const o of opts) {
      x -= o.w;
      if (x <= 0) return o.e;
    }
    return opts[0].e;
  }

  // ------------------------------------------------------------------ yearly tick
  const queue = [];
  let running = false;
  const later = (fn) => {
    queue.push(fn);
    pump();
  };
  function pump() {
    if (running) return;
    running = true;
    const step = () => {
      const fn = queue.shift();
      if (!fn) {
        running = false;
        return;
      }
      const go = () => {
        try {
          fn();
        } catch (e) {
          warn("queue", e);
        }
        setTimeout(step, 900);
      };
      typeof whenClear === "function" ? whenClear(go) : go();
    };
    setTimeout(step, 700);
  }

  function yearCo(c, out) {
    const C = C_(c);
    const k = K();
    const E_ = E();
    for (const f of c.stock) c.hype[f] = cl((c.hype[f] ?? 60) + ri(-14, 12), 10, 100);
    const prod = C.catalog && CATALOG[C.catalog] ? 0.82 + 0.5 * Math.min(1, c.stock.length / 3) * (avgHype(c) / 100) : 1;
    const comp = 1 - pressure(c.cat) * 0.22 + c.mgr.mkt * 0.025 + [0, 0.02, 0.05][c.mkt];
    const rev = C.rev * k * Math.pow(c.locs, 0.94) * (0.55 + (c.rep / 100) * 0.75) * STAGE_MUL[c.stage] * prod * comp * E_.eco * (0.92 + rnd() * 0.2);
    const margin = C.margin + c.mgr.ops * 0.012 - (c.franchise ? 0.06 : 0) - (c.union ? 0.012 : 0);
    const opProfit = rev * margin;
    const marketing = rev * [0, 0.02, 0.05][c.mkt];
    const wages = (c.mgr.ops ? salary(c.mgr.ops) : 0) + (c.mgr.mkt ? salary(c.mgr.mkt) : 0) + (c.mgr.fin ? salary(c.mgr.fin) : 0);
    const interest = c.debt * 0.08 * (1 - c.mgr.fin * 0.1);
    const pre = opProfit - marketing - wages - interest;
    const tax = pre > 0 ? pre * (0.21 - c.mgr.fin * 0.015) : 0;
    const profit = pre - tax;
    c.cash += profit;
    if (c.cash < 0) {
      c.debt += -c.cash;
      c.cash = 0;
    }
    c.rep = cl(c.rep + [-2, 1, 3][c.mkt] + c.mgr.mkt + (profit > 0 ? 1 : -2) + ri(-2, 2));
    c.neg = profit < 0 ? c.neg + 1 : 0;
    // dividends
    let div = 0;
    if (c.pay > 0 && profit > 0) {
      const total = Math.min(c.cash, profit * c.pay);
      c.cash -= total;
      div = total * c.own;
      earn(div);
    }
    c.hist.push({ y: yearNow(), rev, profit });
    if (c.hist.length > 15) c.hist.shift();
    c.last = { rev, profit };
    out.rev += rev * c.own;
    out.profit += profit * c.own;
    out.div += div;
    // managers leave
    ["ops", "mkt", "fin"].forEach((m) => {
      if (c.mgr[m] && rnd() < 0.05) c.mgr[m] = 0;
    });
    // bankruptcy
    if (c.neg >= 3 && c.debt > value(c) * 0.5 + 1 && c.cash <= 0) {
      E_.cos = E_.cos.filter((x) => x !== c);
      logLine(`${c.name} went bankrupt.`);
      later(() => note("Bankruptcy", `${c.name} could not pay its debts and closed. You lose your investment.`));
      return;
    }
    if (rnd() < 0.6) {
      const e = pickEvent(c);
      e && later(() => e.run(c));
    }
  }

  function tick(force) {
    if (!enabled()) return;
    const E_ = E();
    if (E_.tickAge === state.age && !force) return;
    E_.tickAge = state.age;
    // economy and rivals
    E_.eco = rnd() < 0.06 ? 0.82 + rnd() * 0.06 : cl(E_.eco * 0.4 + 0.6 + (rnd() - 0.5) * 0.12, 0.8, 1.1);
    Object.keys(CATS).forEach((cat) => {
      rivalsFor(cat).forEach((r, i, arr) => {
        r.strength = cl(r.strength + ri(-8, 8), 5, 95);
        r.locs = Math.max(1, Math.round(r.locs * (0.95 + rnd() * 0.15)));
        if (r.strength < 12) arr[i] = { name: `${pick(PRE)} ${pick(NOUN[cat])}`, strength: ri(30, 55), locs: ri(2, 10) };
      });
    });
    refreshMarket();
    const out = { rev: 0, profit: 0, div: 0 };
    for (const c of E_.cos.slice()) {
      try {
        yearCo(c, out);
      } catch (e) {
        warn("yearCo", e);
      }
    }
    if (E_.cos.length) {
      logLine(`My companies made ${money(out.profit)} this year${out.div ? ` and paid me ${money(out.div)} in dividends` : ""}.`);
      later(() => note("Business Empire", `Your share of the profit: ${money(out.profit)}. Dividends paid to you: ${money(out.div)}. Your stake is worth ${money(tot())}.${E_.eco < 0.9 ? " The economy is in a slump." : ""}`));
    }
  }

  // ------------------------------------------------------------------ boot
  function inject() {
    if (!enabled() || sTitle.textContent !== "BUSINESS" || document.getElementById("flEmpRow")) return;
    const E_ = E();
    const n = E_.cos.length;
    const html =
      `<div class="sec" id="flEmpRow">Business Empire</div>` +
      row(`data-emp="open"`, "freelife/apple/1f3e2.png", "Your empire", n ? `${n} compan${n === 1 ? "y" : "ies"} · stake ${money(tot())}` : "Chains, franchises and shops. Start small, think big.") +
      row(`data-emp="market"`, "freelife/apple/1f4b0.png", "Businesses for sale", "Make an offer on a shop or a franchise") +
      row(`data-emp="found"`, "freelife/apple/1f3d7-fe0f.png", "Start a company", "Clothing, sneakers, food, gyms, dealerships...");
    sList.insertAdjacentHTML("afterbegin", html);
    sList.querySelectorAll("[data-emp]").forEach((el) => {
      el.onclick = () => {
        try {
          play("choice");
        } catch {}
        refreshMarket();
        const a = el.dataset.emp;
        a === "open" ? openEmpire() : a === "market" ? openMarket() : openFound();
      };
    });
  }
  function boot() {
    if (typeof state === "undefined" || typeof openBusiness !== "function" || typeof jCard !== "function" || !document.getElementById("ageBtn") || typeof sList === "undefined") return setTimeout(boot, 150);
    const orig = window.openBusiness;
    window.openBusiness = function () {
      const r = orig.apply(this, arguments);
      try {
        inject();
      } catch (e) {
        warn("inject", e);
      }
      return r;
    };
    document.getElementById("ageBtn").addEventListener("click", () =>
      setTimeout(() => {
        try {
          tick();
        } catch (e) {
          warn("tick", e);
        }
      }, 1300),
    );
    // Occupation -> Special Careers -> "Business" job pack used to say "not available": open the empire instead
    const origSpecial = window.openSpecialCareers;
    if (typeof origSpecial === "function")
      window.openSpecialCareers = function () {
        const r = origSpecial.apply(this, arguments);
        try {
          const el = sList.querySelector('[data-pack="business"]');
          if (el) {
            el.classList.remove("dis");
            el.onclick = () => {
              try {
                play("choice");
              } catch {}
              if (!enabled()) return note("Not yet", "Business Empire opens at 18, from 1990 on.");
              refreshMarket();
              openEmpire();
              sBack.onclick = () => (typeof openSpecialCareers === "function" ? openSpecialCareers() : screen.classList.remove("open"));
            };
          }
        } catch (e) {
          warn("special", e);
        }
        return r;
      };
    loadCatalogs();
    console.log("[bizempire] loaded");
  }

  window.FL_EMP = { open: openEmpire, tick: () => tick(true), state: E, EVENTS, CATS, CATALOG, makeCo, makeListing, value, myValue, yearCo };
  boot();
})();
