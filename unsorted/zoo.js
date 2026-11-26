/* [mod] Zookeeper career for NaBlooLife (local mod).
 *
 * Occupation -> Special Careers -> Zookeeper. Volunteer -> Junior Keeper -> Zone Keeper (savanna, jungle,
 * aquarium, arctic, aviary) -> Head Keeper -> Zoo Director. It is a real job (state.job.zoo): the game pays
 * the salary, taxes it and raises it every year.
 *
 *  - Every animal has a name, species, happiness and health. Each year you get a few care actions (feed,
 *    clean, health checks, bond), shows (penguins, dolphins, birds) and breeding programs (a baby can go viral).
 *  - Events with decisions: an escape, a bite (dangerous animals pay more), a child in the gorilla enclosure,
 *    activists, a welfare inspection, an animal that dies, a donor gala, disease, a heat wave.
 *  - Dark side: sell a cub out the back door (trafficking), run a private big-cat collection (a "Tiger King" story
 *    with a FICTIONAL rival, no real people), and, as director, cut the budget while the animals pay for it.
 *  - Connections: exotic pets at home, fame when a baby goes viral, and your own safari park as a business.
 *
 * State: state.zoo (JSON only). API: FL_ZOO.open(), FL_ZOO.state(), FL_ZOO.tick(), FL_ZOO.eventNow(id).
 */
(() => {
  "use strict";
  if (window.FL_ZOO) return;

  // ------------------------------------------------------------------ helpers
  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const cl = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const ch = (p) => rnd() < p;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ifx = () => (typeof window.inflFx === "function" ? window.inflFx() : 1);
  const price = (n) => Math.max(1, Math.round((typeof localPrice === "function" ? localPrice(n) : n) * ifx()));
  const money = (n) => (typeof usd === "function" ? usd(Math.round(n)) : "$" + Math.round(n).toLocaleString("en-US"));
  const chev = () => (typeof CHEV !== "undefined" ? CHEV : "");
  const snd = (n) => {
    try {
      typeof play === "function" && play(n);
    } catch {}
  };
  const warn = (w, e) => console.warn("[zoo] " + w, e);
  const sayIt = (s) => {
    try {
      typeof say === "function" && say(s);
    } catch {}
  };
  const stat = (k, d) => {
    if (!state.stats) return;
    state.stats[k] = cl((Number(state.stats[k]) || 0) + d);
  };
  const render = () => {
    try {
      renderStats();
    } catch {}
  };
  const addMoney = (n) => {
    state.money = Math.max(0, (Number(state.money) || 0) + n);
    render();
  };
  const era1800 = () => {
    try {
      return typeof isOldEra === "function" && isOldEra();
    } catch {
      return false;
    }
  };
  const card = (o) => {
    const run = () => {
      try {
        jCard({ tag: "Zoo", ...o });
      } catch (e) {
        warn("card", e);
      }
    };
    typeof queuePopup === "function" ? queuePopup(run) : setTimeout(run, 300);
  };
  const now = (o) => {
    try {
      jCard({ tag: "Zoo", ...o });
    } catch (e) {
      warn("now", e);
    }
  };
  const note = (title, text, cb) => notice(title, text, cb || null, true);

  // ------------------------------------------------------------------ data
  const ZONES = {
    savanna: { n: "Savanna", hex: "1f981" },
    jungle: { n: "Jungle", hex: "1f98d" },
    aquarium: { n: "Aquarium", hex: "1f9ad" },
    arctic: { n: "Arctic", hex: "1f43b" },
    aviary: { n: "Aviary", hex: "1f989" },
    forest: { n: "Forest", hex: "1f43b" },
    reptiles: { n: "Reptile House", hex: "1f40d" },
  };
  // hex = emoji file in the game's assets (null = none). Species whose id is in CUSTOM use zoo/<id>.png
  // (cut from the animal grids with _art-src/split_grid.py).
  const CUSTOM = new Set(["lion", "elephant", "giraffe", "zebra", "rhino", "hippo", "cheetah", "hyena", "gorilla", "tiger", "polarbear", "penguin", "seal", "walrus", "arcticwolf", "arcticfox", "reindeer", "snowleopard", "brownbear", "blackbear", "panda", "sunbear", "slothbear", "spectacledbear", "grizzly", "kodiak", "cinnamonbear", "russetbear", "americanbear", "bananapython", "blackrat", "bluekrait", "forestcobra", "greensnake", "milksnake", "snake", "cobra", "coralsnake", "rattlesnake", "greenpython", "hornedviper", "dolphin", "shark", "parrot", "flamingo", "monkey", "kangaroo", "owl", "lizard"]);
  const SP = {
    lion: { n: "Lion", z: "savanna", d: 3, hex: "1f981", v: 45000, viral: 0.15 },
    zebra: { n: "Zebra", z: "savanna", d: 1, hex: "1f993", v: 12000, viral: 0.1 },
    giraffe: { n: "Giraffe", z: "savanna", d: 1, hex: null, v: 30000, viral: 0.2 },
    elephant: { n: "Elephant", z: "savanna", d: 2, hex: null, v: 90000, viral: 0.3, life: 40 },
    rhino: { n: "Rhinoceros", z: "savanna", d: 2, hex: null, v: 70000, viral: 0.25, life: 35 },
    hippo: { n: "Hippopotamus", z: "savanna", d: 3, hex: null, v: 50000, viral: 0.2, life: 35 },
    cheetah: { n: "Cheetah", z: "savanna", d: 2, hex: null, v: 55000, viral: 0.3 },
    hyena: { n: "Spotted hyena", z: "savanna", d: 2, hex: null, v: 8000, viral: 0.1 },
    kangaroo: { n: "Kangaroo", z: "savanna", d: 1, hex: "1f998", v: 9000, viral: 0.15 },
    gorilla: { n: "Gorilla", z: "jungle", d: 3, hex: "1f98d", v: 80000, viral: 0.25, life: 35 },
    monkey: { n: "Monkey", z: "jungle", d: 1, hex: "1f412", v: 6000, viral: 0.15, pet: true },
    tiger: { n: "Tiger", z: "jungle", d: 3, hex: null, v: 70000, viral: 0.3 },
    seal: { n: "Seal", z: "aquarium", d: 0, hex: "1f9ad", v: 15000, viral: 0.2, show: true },
    dolphin: { n: "Dolphin", z: "aquarium", d: 0, hex: null, v: 60000, viral: 0.25, show: true, life: 30 },
    shark: { n: "Shark", z: "aquarium", d: 3, hex: "1f988", v: 20000, viral: 0.05 },
    penguin: { n: "Penguin", z: "arctic", d: 0, hex: null, v: 8000, viral: 0.35, show: true },
    polarbear: { n: "Polar bear", z: "arctic", d: 3, hex: "1f43b", v: 60000, viral: 0.35 },
    walrus: { n: "Walrus", z: "arctic", d: 2, hex: null, v: 35000, viral: 0.3 },
    arcticwolf: { n: "Arctic wolf", z: "arctic", d: 2, hex: null, v: 22000, viral: 0.2 },
    arcticfox: { n: "Arctic fox", z: "arctic", d: 0, hex: null, v: 7000, viral: 0.35 },
    reindeer: { n: "Reindeer", z: "arctic", d: 0, hex: null, v: 6000, viral: 0.15 },
    snowleopard: { n: "Snow leopard", z: "arctic", d: 2, hex: null, v: 85000, viral: 0.35 },
    parrot: { n: "Macaw", z: "aviary", d: 0, hex: null, v: 3000, viral: 0.1, show: true, pet: true },
    owl: { n: "Owl", z: "aviary", d: 0, hex: "1f989", v: 1500, viral: 0.1, show: true, pet: true },
    flamingo: { n: "Flamingo", z: "aviary", d: 0, hex: null, v: 2500, viral: 0.1 },
    panda: { n: "Giant panda", z: "forest", d: 1, hex: "1f43c", v: 250000, viral: 0.6 },
    brownbear: { n: "Brown bear", z: "forest", d: 3, hex: "1f43b", v: 25000, viral: 0.2 },
    blackbear: { n: "Black bear", z: "forest", d: 2, hex: "1f43b", v: 15000, viral: 0.2 },
    sunbear: { n: "Sun bear", z: "forest", d: 2, hex: "1f43b", v: 30000, viral: 0.3 },
    slothbear: { n: "Sloth bear", z: "forest", d: 2, hex: "1f43b", v: 28000, viral: 0.2 },
    spectacledbear: { n: "Spectacled bear", z: "forest", d: 2, hex: "1f43b", v: 45000, viral: 0.3 },
    snake: { n: "Ball python", z: "reptiles", d: 1, hex: "1f40d", v: 2500, viral: 0.05, pet: true },
    cobra: { n: "King cobra", z: "reptiles", d: 3, hex: "1f40d", v: 6000, viral: 0.1 },
    coralsnake: { n: "Coral snake", z: "reptiles", d: 2, hex: "1f40d", v: 800, viral: 0.05 },
    rattlesnake: { n: "Rattlesnake", z: "reptiles", d: 2, hex: "1f40d", v: 1500, viral: 0.05 },
    greenpython: { n: "Green tree python", z: "reptiles", d: 1, hex: "1f40d", v: 5000, viral: 0.1, pet: true },
    hornedviper: { n: "Horned viper", z: "reptiles", d: 2, hex: "1f40d", v: 1200, viral: 0.05 },
    grizzly: { n: "Grizzly bear", z: "forest", d: 3, hex: null, v: 30000, viral: 0.2, file: "bear-grey" },
    kodiak: { n: "Kodiak bear", z: "forest", d: 3, hex: null, v: 42000, viral: 0.3, file: "bear-kodiak" },
    cinnamonbear: { n: "Cinnamon bear", z: "forest", d: 2, hex: null, v: 18000, viral: 0.25, file: "bear-cinnamon" },
    russetbear: { n: "Russet bear", z: "forest", d: 2, hex: null, v: 20000, viral: 0.2, file: "bear-russet" },
    americanbear: { n: "American bear", z: "forest", d: 2, hex: null, v: 16000, viral: 0.2, file: "bear-american" },
    bananapython: { n: "Banana ball python", z: "reptiles", d: 1, hex: null, v: 4500, viral: 0.1, pet: true, file: "snake-banana" },
    blackrat: { n: "Black rat snake", z: "reptiles", d: 1, hex: null, v: 900, viral: 0.05, pet: true, file: "snake-black" },
    bluekrait: { n: "Blue krait", z: "reptiles", d: 3, hex: null, v: 2800, viral: 0.1, file: "snake-blue-krait" },
    forestcobra: { n: "Forest cobra", z: "reptiles", d: 3, hex: null, v: 5000, viral: 0.1, file: "snake-forest-cobra" },
    greensnake: { n: "Green snake", z: "reptiles", d: 0, hex: null, v: 600, viral: 0.05, pet: true, file: "snake-green" },
    milksnake: { n: "Milk snake", z: "reptiles", d: 1, hex: null, v: 1100, viral: 0.05, pet: true, file: "snake-milk" },
    lizard: { n: "Iguana", z: "reptiles", d: 1, hex: "1f98e", v: 2000, viral: 0.05, pet: true },
  };
  const bySpZone = (zn) => Object.keys(SP).filter((k) => SP[k].z === zn);
  const iconUrl = (sp) => (CUSTOM.has(sp) ? `zoo/${(SP[sp] && SP[sp].file) || sp}.png` : SP[sp] && SP[sp].hex ? `emoji/${SP[sp].hex}.png` : "emoji/1f43e.png");
  const NAMES = ["Nala", "Kibo", "Zuri", "Milo", "Pip", "Bruno", "Luna", "Rocky", "Coco", "Maya", "Tango", "Oscar", "Daisy", "Ziggy", "Atlas", "Echo", "Willow", "Bandit", "Pepper", "Juno", "Sasha", "Tuck", "Mango", "Pearl", "Remy", "Biscuit", "Clover", "Onyx", "Fiona", "Gus"];
  const RANKS = [
    { t: "Volunteer", pay: 0 },
    { t: "Junior Keeper", pay: 28000, yrs: 1, perf: 50 },
    { t: "Zone Keeper", pay: 42000, yrs: 2, perf: 60 },
    { t: "Head Keeper", pay: 62000, yrs: 3, perf: 68 },
    { t: "Zoo Director", pay: 95000, yrs: 4, perf: 75, age: 28 },
  ];

  // ------------------------------------------------------------------ state
  const Z = () => {
    if (!state.zoo || typeof state.zoo !== "object") state.zoo = {};
    const z = state.zoo;
    if (z.on == null) z.on = false;
    if (z.rank == null) z.rank = 0;
    if (!Array.isArray(z.animals)) z.animals = [];
    if (!Array.isArray(z.home)) z.home = [];
    if (!z.breeding || typeof z.breeding !== "object") z.breeding = {};
    if (z.yrs == null) z.yrs = 0;
    if (z.perf == null) z.perf = 55;
    if (z.rep == null) z.rep = 40;
    if (z.fame == null) z.fame = 0;
    if (z.heat == null) z.heat = 0;
    if (z.care == null) z.care = 0;
    if (z.left == null) z.left = 4;
    if (z.seq == null) z.seq = 0;
    if (!z.budget) z.budget = "normal";
    if (z.last == null) z.last = -1;
    if (!z.ev) z.ev = {};
    if (z.traffic == null) z.traffic = 0;
    return z;
  };
  const scopeZones = () => (Z().rank >= 3 ? Object.keys(ZONES) : [Z().zone || "savanna"]);
  const mine = () => Z().animals.filter((a) => scopeZones().includes(SP[a.sp].z));
  const avg = (arr, k) => (arr.length ? arr.reduce((s, a) => s + a[k], 0) / arr.length : 60);
  const spName = (a) => SP[a.sp].n.toLowerCase();

  function uniqueName() {
    const used = new Set(Z().animals.map((a) => a.name));
    const free = NAMES.filter((n) => !used.has(n));
    return free.length ? pick(free) : pick(NAMES) + ri(2, 9);
  }
  function mkAnimal(sp, baby) {
    const z = Z();
    return { id: ++z.seq, name: uniqueName(), sp, hap: ri(55, 85), hea: ri(62, 92), age: baby ? 0 : ri(2, 9), baby: !!baby, sick: false, bond: 0 };
  }
  function seedZoo() {
    const z = Z();
    z.animals = [];
    Object.keys(ZONES).forEach((zn) => {
      const list = bySpZone(zn).sort(() => rnd() - 0.5).slice(0, 3);
      list.forEach((sp, i) => {
        z.animals.push(mkAnimal(sp, false));
        if (i === 0 || ch(0.5)) z.animals.push(mkAnimal(sp, false));
      });
    });
  }

  // ------------------------------------------------------------------ job
  function dangerBonus() {
    return mine().some((a) => SP[a.sp].d >= 3) ? 1.15 : 1;
  }
  function syncJob(promoted) {
    const z = Z();
    if (!z.on) return;
    const r = RANKS[z.rank];
    const prev = state.job && state.job.zoo ? state.job : null;
    const pay = promoted || !prev ? (r.pay ? Math.round(price(r.pay) * dangerBonus()) : 0) : prev.pay;
    state.job = { t: r.t, c: "Zoo", emp: z.name || "City Zoo", pay, icon: iconUrl("lion"), zoo: true, perf: z.perf, yrs: z.yrs };
    render();
  }
  function endJob(why) {
    const z = Z();
    z.on = false;
    if (state.job && state.job.zoo) state.job = null;
    z.ended = why;
    render();
  }

  // ------------------------------------------------------------------ yearly tick
  function ownerTick() {
    if (era1800() || state.dead) return;
    const z = Z();
    if (!z.biz || state.prison) return;
    const ev = [];
    bizYear(ev);
    ev.forEach((f) => {
      try {
        f();
      } catch (e) {
        warn("owner", e);
      }
    });
  }
  function tick() {
    if (era1800()) return;
    const z = Z();
    if (state.dead) return;
    if (!z.on) return ownerTick();
    if (z.last === state.age) return;
    z.last = state.age;
    if (state.prison) return;
    z.yrs++;
    const care = z.care;
    const careLevel = care >= 6 ? "good" : care >= 3 ? "ok" : "poor";
    const scope = scopeZones();
    const ev = [];
    // animals
    z.animals.forEach((a) => {
      const own = scope.includes(SP[a.sp].z);
      let dh = own ? (careLevel === "good" ? 4 : careLevel === "ok" ? 0 : -7) : ri(-3, 2);
      let dl = own ? (careLevel === "good" ? 3 : careLevel === "ok" ? 0 : -5) : ri(-3, 2);
      if (z.rank === 4 || (z.biz && !own)) {
        const b = z.budget === "cut" ? [-ri(5, 9), -ri(4, 8)] : z.budget === "good" ? [ri(2, 4), ri(2, 4)] : [0, 0];
        dh += b[0];
        dl += b[1];
      }
      a.hap = cl(a.hap + dh);
      a.hea = cl(a.hea + dl);
      a.age++;
      if (a.age >= 2) a.baby = false;
      if (a.hea < 50 && ch(0.2)) a.sick = true;
      if (a.sick && ch(0.35)) a.hea = cl(a.hea - ri(6, 14));
    });
    // breeding programs resolve
    for (const sp of Object.keys(z.breeding)) {
      if (z.breeding[sp] >= state.age) continue;
      delete z.breeding[sp];
      const pair = z.animals.filter((a) => a.sp === sp && !a.baby);
      const happy = avg(pair, "hap");
      if (pair.length >= 2 && ch(cl(0.35 + happy / 160, 0.3, 0.85))) {
        const baby = mkAnimal(sp, true);
        z.animals.push(baby);
        ev.push(() => birth(baby));
      } else ev.push(() => card({ iconSrc: iconUrl(sp), title: "No baby this year", lead: `The ${SP[sp].n.toLowerCase()} pair did not conceive. Breeding is slow and unpredictable, and stress makes it harder. You can try again.`, ok: () => {} }));
    }
    // deaths
    z.animals.filter((a) => a.hea <= 3 || (a.age >= (SP[a.sp].life || 18) && ch(0.35))).forEach((a) => ev.push(() => animalDies(a)));
    // reputation, performance
    const ah = avg(mine(), "hap");
    const ahe = avg(mine(), "hea");
    z.perf = cl(z.perf + (careLevel === "good" ? 6 : careLevel === "ok" ? 1 : -9) + Math.round((ah + ahe - 120) / 20));
    z.rep = cl(z.rep + (careLevel === "good" ? 3 : careLevel === "poor" ? -4 : 0) + Math.round((avg(z.animals, "hap") - 60) / 15));
    z.fame = Math.max(0, z.fame - 4);
    z.heat = Math.max(0, z.heat - 5);
    z.care = 0;
    z.left = z.rank >= 3 ? 5 : 4;
    stat("Happiness", careLevel === "good" ? 1 : careLevel === "poor" ? -2 : 0);
    // rank-specific money
    if (z.rank === 4) {
      const prof = Math.round(price(40000) * (z.rep / 50) * (z.budget === "cut" ? 1.9 : z.budget === "good" ? 0.4 : 1));
      addMoney(prof);
      if (z.budget === "cut") z.rep = cl(z.rep - 2);
    }
    bizYear(ev);
    privYear(ev);
    homeYear(ev);
    // firing, promotion
    if (z.perf < 20 && z.rank > 0) {
      sayIt("I was let go from the zoo for neglecting the animals.");
      endJob("fired");
      card({ iconSrc: iconUrl("lion"), title: "Let go", lead: "The zoo let you go: the animals in your care were neglected and the numbers showed it.", ok: () => {} });
      return;
    }
    syncJob(false);
    const nxt = RANKS[z.rank + 1];
    if (nxt && z.yrs - (z.rankYr || 0) >= nxt.yrs && z.perf >= nxt.perf && (!nxt.age || state.age >= nxt.age)) ev.unshift(() => promotion());
    // random events (1-2)
    const n = ch(0.55) ? 1 : 0;
    for (let i = 0; i < n + (ch(0.2) ? 1 : 0); i++) {
      const e = pickEvent();
      if (e) ev.push(e);
    }
    ev.forEach((f) => {
      try {
        f();
      } catch (e) {
        warn("event", e);
      }
    });
    if (z.rank === 4 && z.budget === "cut" && ch(0.3)) setTimeout(() => EVENTS.activists.run(), 200);
  }

  function promotion() {
    const z = Z();
    const nxt = RANKS[z.rank + 1];
    if (!nxt) return;
    const go = (zone) => {
      z.rank++;
      z.rankYr = z.yrs;
      if (zone) z.zone = zone;
      z.perf = Math.max(z.perf, 55);
      syncJob(true);
      sayIt(`I was promoted to ${RANKS[z.rank].t} at the zoo.`);
      snd("achievement");
      note("Promoted!", `You are now ${RANKS[z.rank].t}.${z.rank === 4 ? " You run the zoo: budget, staff and everything that goes wrong." : ""}`);
    };
    const choices = nxt.t === "Zone Keeper" ? Object.keys(ZONES).map((k) => [`Take the ${ZONES[k].n}`, () => go(k)]) : [["Accept the promotion", () => go(null)]];
    choices.push(["Not yet", () => {}]);
    card({ iconSrc: iconUrl("lion"), title: `Promotion: ${nxt.t}`, lead: `Your work has been noticed. The zoo offers you the position of ${nxt.t}${nxt.t === "Zone Keeper" ? ". Pick the zone you will run." : "."}`, rows: [["New salary", money(Math.round(price(nxt.pay)))]], choices });
  }

  // ------------------------------------------------------------------ births, deaths
  function birth(a) {
    const z = Z();
    const sp = SP[a.sp];
    const viral = ch(sp.viral);
    if (viral) {
      z.fame = cl(z.fame + ri(15, 30));
      z.rep = cl(z.rep + ri(6, 12));
      const bonus = price(ri(4000, 20000));
      addMoney(bonus);
      sayIt(`A baby ${sp.n.toLowerCase()} named ${a.name} was born at my zoo and went viral.`);
    } else sayIt(`A baby ${sp.n.toLowerCase()} named ${a.name} was born at my zoo.`);
    stat("Happiness", 6);
    card({
      iconSrc: iconUrl(a.sp),
      title: viral ? `${a.name} went viral` : "A baby is born",
      lead: viral ? `A baby ${sp.n.toLowerCase()}, ${a.name}, was born at your zoo, and a clip of its first steps took over the internet. Visitors are lining up and sponsors are calling.` : `A baby ${sp.n.toLowerCase()} named ${a.name} was born. The whole team is glowing.`,
      rows: viral ? [["Fame", `+ (now ${Math.round(Z().fame)}%)`], ["Zoo reputation", `${Math.round(Z().rep)}%`]] : [],
      ok: () => {},
    });
  }
  function animalDies(a) {
    const z = Z();
    z.animals = z.animals.filter((x) => x !== a);
    stat("Happiness", -6);
    sayIt(`${a.name} the ${spName(a)} died.`);
    card({
      iconSrc: iconUrl(a.sp),
      title: `${a.name} has died`,
      lead: `${a.name}, the ${spName(a)} you looked after, has died${a.sick ? " after a long illness" : a.age >= (SP[a.sp].life || 18) ? " of old age" : ""}. It hits harder than you expected.`,
      choices: [
        ["Hold a small memorial for the staff", () => {
          stat("Happiness", 3);
          z.rep = cl(z.rep + 2);
        }],
        ["Keep working", () => {}],
      ],
    });
  }

  // ------------------------------------------------------------------ events
  const hasDanger = (d) => Z().animals.some((a) => SP[a.sp].d >= d);
  const EVENTS = {
    escape: {
      w: () => (Z().animals.length ? 3 : 0),
      run: () => {
        const a = pick(Z().animals);
        const d = SP[a.sp].d;
        card({
          iconSrc: iconUrl(a.sp),
          title: `${a.name} is loose`,
          lead: `Someone left a gate unlatched. ${a.name}, a ${spName(a)}, is out of the enclosure and heading toward the visitor area.`,
          choices: [
            ["Track it down and sedate it myself", () => {
              if (ch(cl(0.82 - d * 0.14, 0.3, 0.9))) {
                Z().perf = cl(Z().perf + 5);
                stat("Happiness", 3);
                note("Caught", `You get close, dart ${a.name} and walk it back. The visitors never knew how close it was.`);
              } else {
                stat("Health", -ri(8, 20));
                a.hap = cl(a.hap - 12);
                Z().rep = cl(Z().rep - 4);
                note("It went wrong", `${a.name} panicked. You were hurt and the animal is shaken. The incident made the local news.`);
              }
            }],
            ["Call the response team and clear the area", () => {
              Z().rep = cl(Z().rep - 1);
              if (ch(0.92)) note("Contained", "The response team arrives within minutes. Nobody is hurt, though the park is closed for the afternoon.");
              else {
                a.hea = cl(a.hea - 10);
                note("Messy", "It takes hours, and the animal is hurt in the chase. The park loses a day of revenue.");
              }
            }],
            ["Lure it back with food", () => {
              if (ch(d <= 1 ? 0.85 : 0.3)) {
                a.hap = cl(a.hap + 4);
                note("It worked", `${a.name} follows the food bucket back in like nothing happened.`);
              } else {
                stat("Health", -ri(6, 16));
                Z().rep = cl(Z().rep - 3);
                note("Bad idea", `${a.name} was not interested in food at all. You get away with a bruise and a lesson.`);
              }
            }],
          ],
        });
      },
    },
    bite: {
      w: () => (mine().some((a) => SP[a.sp].d >= 1) ? 2 : 0),
      run: () => {
        const a = pick(mine().filter((x) => SP[x.sp].d >= 1));
        card({
          iconSrc: iconUrl(a.sp),
          title: "Bitten",
          lead: `You moved a little too fast during a check and ${a.name}, the ${spName(a)}, bit you. Dangerous animals pay better, and this is why.`,
          choices: [
            ["Report it and get treated", () => {
              stat("Health", -ri(4, 10 + SP[a.sp].d * 6));
              Z().perf = cl(Z().perf + 1);
              note("Treated", "Cleaned, stitched and a shot for good measure. The zoo covers it and logs the incident.");
            }],
            ["Hide it and keep working", () => {
              if (ch(0.3)) {
                stat("Health", -ri(14, 28));
                note("Infected", "The wound got infected. You ended up in the ER anyway, and your boss was not happy.");
              } else stat("Health", -ri(3, 8));
            }],
          ],
        });
      },
    },
    kid: {
      w: () => (Z().animals.some((a) => a.sp === "gorilla") && Z().rank >= 1 ? 2 : 0),
      run: () => {
        const g = Z().animals.find((a) => a.sp === "gorilla");
        card({
          iconSrc: iconUrl("gorilla"),
          title: "A child in the enclosure",
          lead: `A little boy slipped through the railing and fell into the gorilla enclosure. ${g.name}, a ${Math.round(g.age)}-year-old silverback, is standing over him. The crowd is screaming. You have seconds.`,
          choices: [
            ["Go in and get the boy myself", () => {
              if (ch(0.55)) {
                stat("Happiness", 6);
                Z().fame = cl(Z().fame + 18);
                Z().rep = cl(Z().rep + 6);
                note("You got him out", `You talk ${g.name} down and carry the boy to the rail. He is shaken but fine. The video of the rescue is everywhere.`);
              } else {
                stat("Health", -ri(25, 45));
                Z().rep = cl(Z().rep - 5);
                note("Hurt", `${g.name} reacted to the chaos. You and the boy were both hurt, and the team had to step in.`);
              }
            }],
            ["Call the sedation team", () => {
              if (ch(0.62)) {
                g.hap = cl(g.hap - 10);
                Z().rep = cl(Z().rep + 3);
                note("Sedated", `The team darts ${g.name} and the boy is pulled out unharmed. The gorilla is groggy but alive.`);
              } else {
                Z().rep = cl(Z().rep - 5);
                stat("Happiness", -4);
                note("Too slow", `The dart takes too long to work and ${g.name} drags the boy before the team can act. He is badly hurt. You will never forget it.`);
              }
            }],
            ["Order the gorilla shot", () => {
              Z().animals = Z().animals.filter((x) => x !== g);
              stat("Happiness", -10);
              Z().rep = cl(Z().rep - ri(8, 18));
              Z().fame = cl(Z().fame + 20);
              sayIt(`${g.name} was shot to save a child. The internet never forgave us.`);
              note("A decision you cannot take back", `${g.name} was killed. The boy is alive, and the world is furious at the zoo, at you, and at the parents. People are arguing about it everywhere.`);
            }],
          ],
        });
      },
    },
    activists: {
      w: () => (Z().rep < 70 || hasDanger(3) ? 2 : 0),
      run: () => {
        card({
          iconSrc: "emoji/1f4e3.png",
          title: "Protest at the gate",
          lead: "Animal-rights activists are blocking the entrance with banners and megaphones. A camera crew is already filming. Some of their claims are fair, some are not.",
          choices: [
            ["Meet them and hear them out", () => {
              Z().rep = cl(Z().rep + 3);
              Z().animals.forEach((a) => (a.hap = cl(a.hap + 2)));
              note("A better enclosure", "You listen. A few complaints are valid and you push for upgrades. Both sides leave calmer than they came.");
            }],
            ["Call security to clear them", () => {
              Z().rep = cl(Z().rep - 6);
              Z().fame = cl(Z().fame + 4);
              note("It backfired", "The clip of security dragging people away spreads faster than any explanation. Donors are asking questions.");
            }],
            ["Ignore it and keep working", () => {
              Z().rep = cl(Z().rep - 2);
            }],
          ],
        });
      },
    },
    inspection: {
      w: () => 2,
      run: () => {
        const z = Z();
        const score = (avg(z.animals, "hap") + avg(z.animals, "hea")) / 2 - (z.budget === "cut" ? 15 : 0) + (z.perf - 50) / 4;
        const pass = score >= 58;
        if (pass) {
          z.rep = cl(z.rep + 6);
          z.perf = cl(z.perf + 3);
        } else {
          z.rep = cl(z.rep - 10);
          addMoney(-Math.min(Number(state.money) || 0, price(20000)));
        }
        card({
          iconSrc: "emoji/1f4cb.png",
          title: "Animal welfare inspection",
          lead: pass ? "State inspectors walked through every enclosure and kitchen. The animals look healthy, the records are in order, and they sign off." : "Inspectors found underfed animals, dirty enclosures and gaps in the vet records. The zoo gets a citation and a fine.",
          rows: [["Result", pass ? "Passed" : "Failed"], ["Average welfare", `${Math.round(score)}%`]],
          ok: () => {
            if (!pass && z.rank === 4 && ch(0.35)) {
              sayIt("I was fired as zoo director after a failed inspection.");
              endJob("fired");
              note("Dismissed", "The board holds you responsible for the failed inspection and lets you go.");
            }
          },
        });
      },
    },
    disease: {
      w: () => (Z().animals.some((a) => a.sick) ? 2 : 1),
      run: () => {
        const z = Z();
        card({
          iconSrc: "emoji/1f9f9.png",
          title: "An outbreak",
          lead: "A respiratory illness is moving through the animals. The vet wants to quarantine a section and test everyone.",
          choices: [
            ["Quarantine and test everyone", () => {
              z.animals.forEach((a) => {
                if (a.sick && ch(0.7)) {
                  a.sick = false;
                  a.hea = cl(a.hea + 12);
                }
              });
              z.rep = cl(z.rep - 2);
              z.perf = cl(z.perf + 3);
              note("Contained", "Closing the section costs visitors, but the outbreak dies out within weeks.");
            }],
            ["Keep it quiet and keep the park open", () => {
              z.animals.forEach((a) => (a.hea = cl(a.hea - ri(4, 12))));
              z.perf = cl(z.perf - 4);
              note("It spreads", "The illness spreads through the park. Several animals get worse before anybody admits it.");
            }],
          ],
        });
      },
    },
    heat: {
      w: () => 1,
      run: () => {
        card({
          iconSrc: "emoji/1f4a8.png",
          title: "Heat wave",
          lead: "Record heat. The arctic enclosure is straining, the pools are warm and the keepers are exhausted.",
          choices: [
            ["Run extra shifts and cooling", () => {
              Z().animals.forEach((a) => (a.hea = cl(a.hea - 1)));
              stat("Health", -2);
              Z().perf = cl(Z().perf + 3);
              note("You got them through", "Long days, but nobody was lost. The team appreciated that you stayed.");
            }],
            ["Wait it out", () => {
              Z().animals.forEach((a) => (a.hea = cl(a.hea - ri(3, 9))));
              note("Rough", "Several animals suffered in the heat. Some will not fully recover this year.");
            }],
          ],
        });
      },
    },
    gala: {
      w: () => (Z().rank >= 3 ? 2 : 0),
      run: () => {
        card({
          iconSrc: "emoji/1f4b0.png",
          title: "Donor gala",
          lead: "The zoo is hosting its annual fundraiser. The board wants you to give the speech.",
          choices: [
            ["Talk about the animals and conservation", () => {
              addMoney(price(ri(8000, 30000)));
              Z().rep = cl(Z().rep + 4);
              note("A great night", "Your honesty moves the room. Donors write checks and a few sign up for the long term.");
            }],
            ["Talk about the numbers", () => {
              addMoney(price(ri(2000, 12000)));
              note("Polite applause", "The numbers are fine. The room is not moved.");
            }],
          ],
        });
      },
    },
    media: {
      w: () => (Z().fame >= 30 ? 3 : 0),
      run: () => {
        card({
          iconSrc: "emoji/1f4f9.png",
          title: "Interview request",
          lead: "A morning show wants you on air to talk about the zoo's viral star and your work.",
          choices: [
            ["Do the interview", () => {
              Z().fame = cl(Z().fame + 8);
              Z().rep = cl(Z().rep + 4);
              addMoney(price(ri(2500, 9000)));
              note("You nailed it", "Charming and honest. Ticket sales jump and a sponsor emails you.");
            }],
            ["Pass", () => {}],
          ],
        });
      },
    },
    offer: {
      w: () => (Z().rank >= 1 && state.age >= 18 && Z().animals.some((a) => a.age <= 2) ? 1.5 : 0),
      run: () => {
        const a = pick(Z().animals.filter((x) => x.age <= 2));
        const p = price(Math.round(SP[a.sp].v * 0.55));
        card({
          iconSrc: iconUrl(a.sp),
          title: "An offer by the back door",
          lead: `A man you do not know waits by the staff gate. He knows exactly which cub is newest and offers ${money(p)} in cash for ${a.name}, the young ${spName(a)}, and no questions.`,
          choices: [
            ["Turn him down", () => {
              stat("Happiness", 2);
              note("Walked away", "He leaves a card. You do not keep it.");
            }],
            ["Take the cash", () => sellAnimal(a)],
            ["Report him", () => {
              Z().rep = cl(Z().rep + 3);
              Z().heat = Math.max(0, Z().heat - 5);
              note("Reported", "Wildlife officers thank you and open a file on the buyer. You hear nothing more.");
            }],
          ],
        });
      },
    },
  };
  function pickEvent() {
    const z = Z();
    const pool = Object.keys(EVENTS).map((k) => ({ k, w: z.ev[k] != null && state.age - z.ev[k] < 2 ? 0 : EVENTS[k].w() })).filter((x) => x.w > 0);
    if (!pool.length) return null;
    let r = rnd() * pool.reduce((s, x) => s + x.w, 0);
    let ch0 = pool[0].k;
    for (const x of pool) {
      r -= x.w;
      if (r <= 0) {
        ch0 = x.k;
        break;
      }
    }
    z.ev[ch0] = state.age;
    return () => EVENTS[ch0].run();
  }

  // ------------------------------------------------------------------ dark side
  function busted(kind, crime, range) {
    const z = Z();
    sayIt(`I was caught ${kind}.`);
    endJob("busted");
    z.heat = 0;
    note("Busted", `Wildlife investigators traced it back to you. You lose your job, and the charges are serious.`, () => {
      if (typeof arrest === "function") arrest(crime, range);
    });
  }
  function sellAnimal(a) {
    const z = Z();
    const p = price(Math.round(SP[a.sp].v * 0.55));
    z.animals = z.animals.filter((x) => x !== a);
    addMoney(p);
    z.heat = cl(z.heat + ri(18, 30));
    z.traffic++;
    stat("Happiness", -ri(2, 6));
    sayIt(`I sold a young ${spName(a)} out the back door of the zoo.`);
    if (ch(0.12 + z.heat / 300)) return busted("trafficking wildlife", "wildlife trafficking", [2, 6]);
    note("Done", `${money(p)} in an envelope, and ${a.name} goes out in a crate. You tell yourself you will not do it again.`);
    syncJob(false);
  }
  function openDark() {
    const z = Z();
    if (!z.on || z.rank < 1 || state.age < 18) return note("Not for you", "You are not in a position to deal with anyone yet.");
    const cubs = z.animals.filter((a) => a.age <= 2);
    const choices = cubs.slice(0, 4).map((a) => [`Sell ${a.name} (${SP[a.sp].n}, ${money(price(Math.round(SP[a.sp].v * 0.55)))})`, () => sellAnimal(a)]);
    if (!z.priv && (Number(state.money) || 0) >= price(75000)) choices.push([`Start a private big-cat collection (${money(price(75000))})`, () => startPriv()]);
    if (z.priv) choices.push([`Buy another cub for ${z.priv.name} (${money(price(30000))})`, () => buyCub()]);
    choices.push(["Back", () => openHub()]);
    now({
      iconSrc: "emoji/1f43e.png",
      title: "The other side of the business",
      lead: "There is money in animals if you do not care where they end up. Everything here is illegal and the heat adds up. You can lose your job, your money and your freedom.",
      rows: [["Heat", `${Math.round(z.heat)}%`], ["Animals sold", String(z.traffic)], ...(z.priv ? [[z.priv.name, `${z.priv.cats} big cats`]] : [])],
      bars: [["Heat", Math.max(3, z.heat), z.heat >= 60 ? "#b3261e" : "#f5841f"]],
      choices,
    });
  }
  function startPriv() {
    const z = Z();
    addMoney(-price(75000));
    z.priv = { name: "Wild Acres", cats: 2, rep: 20, feud: 0, years: 0 };
    z.heat = cl(z.heat + 15);
    sayIt("I started a private big-cat collection in my backyard.");
    note("Wild Acres", "Two cubs, a chain-link run and a hand-painted sign. It is not legal, and it is going to be a lot of work.");
  }
  function buyCub() {
    const z = Z();
    if ((Number(state.money) || 0) < price(30000)) return note("Not enough money", `A cub costs ${money(price(30000))}.`);
    addMoney(-price(30000));
    z.priv.cats++;
    z.heat = cl(z.heat + 8);
    stat("Happiness", 3);
    note("Another one", "It has your attention for about a week.");
  }
  function privYear(ev) {
    const z = Z();
    const p = z.priv;
    if (!p) return;
    p.years++;
    p.rep = cl(p.rep + ri(-2, 6));
    addMoney(Math.round(price(8000) * p.cats * (p.rep / 40)) - price(5000) * p.cats);
    z.heat = cl(z.heat + 6 + p.cats);
    stat("Happiness", p.cats >= 3 ? 2 : 0);
    if (p.years >= 1 && ch(0.35)) ev.push(() => privFeud());
    if (p.years >= 2 && ch(0.2)) ev.push(() => crew());
    if (z.heat >= 75 || (p.cats >= 4 && ch(0.25))) ev.push(() => privBust());
  }
  function privFeud() {
    const z = Z();
    z.priv.feud++;
    card({
      iconSrc: "emoji/1f4e3.png",
      title: "Brenda Hale is coming for you",
      lead: "Brenda Hale, who runs a big-cat sanctuary two counties over (and who has made it her mission to shut private collections like yours), is calling you out online and on the news. She also has a good lawyer. This is a fictional rivalry, but it feels very personal.",
      choices: [
        ["Hit back in a viral video", () => {
          z.fame = cl(z.fame + 15);
          z.heat = cl(z.heat + 12);
          z.priv.rep = cl(z.priv.rep + 6);
          note("Everybody watched", "The video explodes. Visitors triple, and so does the attention of the authorities.");
        }],
        ["Settle quietly", () => {
          addMoney(-Math.min(Number(state.money) || 0, price(25000)));
          z.heat = Math.max(0, z.heat - 6);
          note("Settled", "It costs you, and it buys some peace.");
        }],
        ["Ignore her", () => {
          z.priv.rep = cl(z.priv.rep - 6);
          z.heat = cl(z.heat + 6);
        }],
      ],
    });
  }
  function crew() {
    const z = Z();
    card({
      iconSrc: "emoji/1f4f9.png",
      title: "A documentary crew",
      lead: "A production company wants to film a docuseries about you and Wild Acres. They promise fame and a lot of money. They also promise full access.",
      choices: [
        ["Sign the deal", () => {
          z.fame = cl(z.fame + 30);
          addMoney(price(60000));
          z.heat = cl(z.heat + 25);
          z.priv.rep = cl(z.priv.rep + 12);
          note("You are famous", "The series is a hit. So is the file the agencies are keeping on you.");
        }],
        ["Say no", () => {}],
      ],
    });
  }
  function privBust() {
    const z = Z();
    const p = z.priv;
    z.priv = null;
    z.heat = 0;
    sayIt("Wildlife agents raided my private big-cat collection.");
    note("The raid", `Wildlife agents arrive at dawn with trucks and a warrant. ${p.cats} big cats are taken away, and so are you.`, () => {
      if (z.on && z.rank > 0) endJob("busted");
      if (typeof arrest === "function") arrest("illegal exotic animal ownership", [3, 9]);
    });
  }

  // ------------------------------------------------------------------ your own zoo (Assets -> Zoo)
  const CAP = 8; // animals per enclosure
  const STAFF = { low: ["Skeleton crew", 0.7, -3], normal: ["Normal staff", 1, 2], high: ["Well staffed", 1.6, 5] };
  const TICKET = { cheap: ["Cheap tickets", 0.6, 1.3], normal: ["Normal tickets", 1, 1], premium: ["Premium tickets", 1.5, 0.7] };
  const gentle = (d) => (d >= 3 ? "dangerous" : d === 2 ? "risky" : d === 1 ? "calm" : "gentle");
  function biz() {
    const z = Z();
    const b = z.biz;
    if (!b) return null;
    if (!b.zones || typeof b.zones !== "object") {
      b.zones = { savanna: 1 };
      b.animals.forEach((a) => (b.zones[SP[a.sp].z] = 1));
    }
    if (!b.ticket) b.ticket = "normal";
    if (!b.staff || !STAFF[b.staff]) b.staff = "normal";
    if (b.ads == null) b.ads = 0;
    if (b.yrs == null) b.yrs = 0;
    if (b.last == null) b.last = state.age;
    if (!b.breed) b.breed = {};
    b.animals.forEach((a) => {
      if (a.bond == null) a.bond = 0;
    });
    return b;
  }
  const bizAnimal = (sp, baby) => {
    const z = Z();
    const b = z.biz;
    const used = new Set(b.animals.map((a) => a.name));
    const free = NAMES.filter((n) => !used.has(n));
    return { id: ++z.seq, name: free.length ? pick(free) : pick(NAMES) + ri(2, 9), sp, hap: ri(65, 90), hea: ri(70, 95), age: baby ? 0 : ri(2, 6), baby: !!baby, sick: false, bond: 0 };
  };
  const bizCost = () => price(450000);
  const zoneCost = () => price(120000);
  const buyPrice = (sp) => price(Math.round(SP[sp].v * 0.55));
  const sellPrice = (a) => Math.round(price(Math.round(SP[a.sp].v * 0.4)) * (0.6 + (a.hap + a.hea) / 400));
  function bizYear(ev) {
    const z = Z();
    const b = biz();
    if (!b || b.last === state.age) return;
    b.last = state.age;
    b.yrs++;
    const st = STAFF[b.staff];
    const tk = TICKET[b.ticket];
    const zones = Object.keys(b.zones).length;
    // animals: decent by default, better with staff and vet
    b.animals.forEach((a) => {
      a.hap = cl(a.hap + st[2] + ri(-2, 3) + (a.bond > 0 ? 1 : 0));
      a.hea = cl(a.hea + st[2] + ri(-2, 2) + (b.vet ? 3 : 0));
      a.age++;
      if (a.age >= 2) a.baby = false;
      if (a.hea < 45 && ch(0.2)) a.sick = true;
      if (a.sick) {
        a.hea = cl(a.hea - ri(2, 7));
        if (b.vet || ch(0.5)) a.sick = false;
      }
      a.bond = 0;
    });
    // breeding
    const bySp = {};
    b.animals.forEach((a) => !a.baby && (bySp[a.sp] = (bySp[a.sp] || 0) + 1));
    Object.keys(bySp).forEach((sp) => {
      if (bySp[sp] < 2 || b.animals.length >= zones * CAP) return;
      const pair = b.animals.filter((a) => a.sp === sp && !a.baby);
      const p = (b.breed[sp] ? 0.45 : 0.1) + avg(pair, "hap") / 500;
      if (b.breed[sp]) delete b.breed[sp];
      if (!ch(p)) return;
      const baby = bizAnimal(sp, true);
      b.animals.push(baby);
      const viral = ch(SP[sp].viral);
      if (viral) {
        z.fame = cl(z.fame + ri(10, 25));
        b.rep = cl(b.rep + ri(6, 12));
        addMoney(price(ri(8000, 30000)));
      }
      stat("Happiness", 4);
      sayIt(`A baby ${SP[sp].n.toLowerCase()} named ${baby.name} was born at my zoo${viral ? " and went viral" : ""}.`);
      ev.push(() => card({ iconSrc: iconUrl(sp), title: viral ? `${baby.name} went viral` : "A baby is born", lead: viral ? `A baby ${SP[sp].n.toLowerCase()}, ${baby.name}, was born at ${b.name} and the clip is everywhere. Visitors are lining up and sponsors are calling.` : `A baby ${SP[sp].n.toLowerCase()} named ${baby.name} was born at ${b.name}. Visitors will love it.`, ok: () => {} }));
    });
    // old age / neglect
    b.animals.filter((a) => a.hea <= 3 || (a.age >= (SP[a.sp].life || 18) && ch(0.3))).forEach((a) => {
      b.animals = b.animals.filter((x) => x !== a);
      stat("Happiness", -3);
      ev.push(() => card({ iconSrc: iconUrl(a.sp), title: `${a.name} has died`, lead: `${a.name} the ${spName(a)} died ${a.sick ? "after an illness" : "of old age"}. The keepers say goodbye.`, ok: () => {} }));
    });
    // money
    const show = b.animals.filter((a) => SP[a.sp].show).length;
    const appeal = (avg(b.animals, "hap") + avg(b.animals, "hea")) / 2;
    const visitors = Math.round((600 + b.rep * 60) * (1 + zones * 0.18) * (1 + b.ads * 0.2) * tk[2] * (0.7 + appeal / 200) * (1 + Math.min(show, 4) * 0.04) * Math.min(2, 0.5 + b.animals.length / 10));
    const gross = Math.round(visitors * price(14) * tk[1]);
    const cost = Math.round(price(22000) * st[1] + b.animals.length * price(1400) + zones * price(6000) + (b.vet ? price(15000) : 0) + b.ads * price(8000));
    const net = gross - cost;
    b.last$ = net;
    addMoney(net);
    b.rep = cl(b.rep + (b.staff === "high" ? 3 : b.staff === "low" ? -3 : 1) + (b.ads ? 2 : 0) + Math.round((appeal - 60) / 15) + (b.ticket === "cheap" ? 2 : b.ticket === "premium" ? -2 : 0) + ri(-1, 2));
    b.ads = 0;
    z.fame = Math.max(0, z.fame - 3);
    if (net > 0) stat("Happiness", 1);
    ev.push(() => card({ iconSrc: iconUrl(b.animals[0] ? b.animals[0].sp : "lion"), title: `${b.name}: year report`, lead: `${visitors.toLocaleString("en-US")} visitors came this year.`, rows: [["Income", money(gross)], ["Costs", money(cost)], [net >= 0 ? "Profit" : "Loss", money(Math.abs(net))], ["Reputation", `${Math.round(b.rep)}%`]], ok: () => {} }));
    // events
    const r = rnd();
    if (r < 0.14 && b.animals.some((a) => SP[a.sp].d >= 2)) {
      const a = pick(b.animals.filter((x) => SP[x.sp].d >= 2));
      ev.push(() => card({
        iconSrc: iconUrl(a.sp), title: `${a.name} got out`, lead: `${a.name} the ${spName(a)} slipped out of its enclosure at ${b.name}. Visitors are screaming and everyone is looking at you.`,
        choices: [
          [`Call the keepers (${money(price(4000))})`, () => { addMoney(-price(4000)); b.rep = cl(b.rep + 1); note("Contained", `The keepers sedate ${a.name} and bring it back safely.`); }],
          ["Go in yourself", () => { if (ch(0.6)) { stat("Happiness", 4); b.rep = cl(b.rep + 4); sayIt(`I caught an escaped ${spName(a)} myself.`); note("You did it", `You calm ${a.name} and walk it back. The crowd applauds.`); } else { stat("Health", -ri(8, 18)); b.rep = cl(b.rep - 5); note("It bit you", `${a.name} mauled your arm before the keepers arrived. You survive, bandaged.`); } }],
        ],
      }));
    } else if (r < 0.26) {
      ev.push(() => {
        const ok = b.staff !== "low" && avg(b.animals, "hea") >= 55;
        if (ok) { b.rep = cl(b.rep + 3); note("Inspection passed", `An animal welfare inspector goes through ${b.name} and leaves a glowing report.`); }
        else { const fine = price(ri(15000, 40000)); addMoney(-fine); b.rep = cl(b.rep - 6); note("Inspection failed", `The inspector found underfed animals and too few staff. Fine: ${money(fine)}.`); }
      });
    } else if (r < 0.36) {
      ev.push(() => card({ iconSrc: "emoji/1f4b0.png", title: "A sponsor calls", lead: `A beverage company wants its logo on the gates of ${b.name}.`, choices: [["Take the money", () => { addMoney(price(ri(20000, 70000))); b.rep = cl(b.rep - 1); }], ["Decline, keep it wild", () => { b.rep = cl(b.rep + 2); }]] }));
    } else if (r < 0.44) {
      ev.push(() => card({ iconSrc: "emoji/1f4e3.png", title: "Activists at the gate", lead: "A group is protesting the animals in captivity. The cameras are already there.", choices: [["Invite them in for a tour", () => { b.rep = cl(b.rep + (avg(b.animals, "hap") >= 60 ? 4 : -4)); }], ["Ignore them", () => { b.rep = cl(b.rep - 2); }]] }));
    }
    if (b.rep < 8) {
      z.biz = null;
      ev.push(() => note("Zoo closed", `Visitors stopped coming. The bank closed ${b.name} and the animals were rehomed.`));
    }
  }
  function bizHead(b) {
    const zones = Object.keys(b.zones).length;
    return `<div class="row" style="flex-direction:column;align-items:stretch;height:auto;padding:10px 14px"><b>${esc(b.name)}</b>${bar("Reputation", b.rep, col(b.rep))}${b.animals.length ? bar("Animal happiness", avg(b.animals, "hap"), col(avg(b.animals, "hap"))) + bar("Animal health", avg(b.animals, "hea"), col(avg(b.animals, "hea"))) : ""}<span style="font-size:12px;opacity:.75">${b.animals.length} animals · ${zones} enclosure${zones === 1 ? "" : "s"} (room for ${zones * CAP}) · ${STAFF[b.staff][0]} · ${TICKET[b.ticket][0]}${b.last$ != null ? ` · last year ${b.last$ >= 0 ? "+" : "-"}${money(Math.abs(b.last$))}` : ""}</span></div>`;
  }
  function openBiz() {
    const z = Z();
    const b = biz();
    if (!b) {
      const cost = bizCost();
      return now({
        iconSrc: iconUrl("lion"),
        title: "Open your own zoo",
        lead: "Buy the land, build enclosures and fill them with animals. Staff, ticket prices, shows and breeding decide if it prints money or bleeds it.",
        rows: [["Cost (land + savanna enclosure)", money(cost)], ["Your money", money(state.money)]],
        choices: [
          [`Buy the land and open (${money(cost)})`, () => {
            if (state.age < 18) return note("Too young", "You need to be 18 to own a zoo.");
            if ((Number(state.money) || 0) < cost) return note("Not enough money", `The zoo costs ${money(cost)}.`);
            addMoney(-cost);
            z.biz = { name: `${state.last || "My"} Zoo`, rep: 35, staff: "normal", ticket: "normal", ads: 0, yrs: 0, last: state.age, zones: { savanna: 1 }, breed: {}, animals: [] };
            sayIt("I opened my own zoo.");
            snd("achievement");
            note("Open for business", "The gates open next season. Buy some animals first.", () => openBiz());
          }],
          ["Not now", () => {}],
        ],
      });
    }
    if (!openScreen("ZOO", () => (typeof openAssets === "function" ? openAssets() : screen.classList.remove("open")))) return;
    let h = bizHead(b);
    h += `<div class="sec">Animals</div>`;
    h += row("buy", iconUrl("giraffe"), "Buy animals", `${Object.keys(SP).length} species · ${Object.keys(b.zones).length} of ${Object.keys(ZONES).length} enclosures built`);
    h += row("list", iconUrl(b.animals[0] ? b.animals[0].sp : "lion"), "Your animals", `${b.animals.length} in the zoo · care, breed or sell`);
    h += `<div class="sec">Running the zoo</div>`;
    h += row("staff", "emoji/1f9d1-200d-1f33e.png", "Staff", `${STAFF[b.staff][0]} · tap to change`);
    h += row("ticket", "emoji/1f3ab.png", "Ticket price", `${TICKET[b.ticket][0]} · tap to change`);
    h += row("ads", "emoji/1f4e3.png", "Advertising", b.ads ? "Campaign running this year" : `Campaign for ${money(price(8000))} · more visitors this year`);
    h += row("vet", "emoji/1fa7a.png", "Vet clinic", b.vet ? "Built · animals recover faster" : `Build one for ${money(price(60000))}`);
    h += row("name", "emoji/270f-fe0f.png", "Rename the zoo", esc(b.name));
    h += row("close", "emoji/1f6aa.png", "Sell the zoo", `${money(Math.round(bizCost() * 0.5 + b.animals.reduce((s, a) => s + sellPrice(a), 0)))} for land and animals`);
    sList.innerHTML = h;
    sList.querySelectorAll("[data-z]").forEach((el) => {
      el.onclick = () => {
        snd("choice");
        const k = el.dataset.z;
        if (k === "buy") return openBuy();
        if (k === "list") return openBizAnimals();
        if (k === "staff") { b.staff = b.staff === "normal" ? "high" : b.staff === "high" ? "low" : "normal"; return openBiz(); }
        if (k === "ticket") { b.ticket = b.ticket === "normal" ? "premium" : b.ticket === "premium" ? "cheap" : "normal"; return openBiz(); }
        if (k === "ads") {
          if (b.ads) return;
          if ((Number(state.money) || 0) < price(8000)) return note("Not enough money", `A campaign costs ${money(price(8000))}.`);
          addMoney(-price(8000));
          b.ads = 1;
          return openBiz();
        }
        if (k === "vet") {
          if (b.vet) return;
          if ((Number(state.money) || 0) < price(60000)) return note("Not enough money", `The clinic costs ${money(price(60000))}.`);
          addMoney(-price(60000));
          b.vet = true;
          return openBiz();
        }
        if (k === "name") {
          const nn = typeof prompt === "function" ? prompt("Name your zoo", b.name) : null;
          if (nn && nn.trim()) b.name = nn.trim().slice(0, 28);
          return openBiz();
        }
        if (k === "close") {
          const val = Math.round(bizCost() * 0.5 + b.animals.reduce((s, a) => s + sellPrice(a), 0));
          return now({ iconSrc: iconUrl("lion"), title: "Sell the zoo?", lead: `A buyer offers ${money(val)} for the land and every animal.`, choices: [["Sell", () => { addMoney(val); z.biz = null; sayIt("I sold my zoo."); screen.classList.remove("open"); }], ["Keep it", () => openBiz()]] });
        }
      };
    });
  }
  function openBuy() {
    const b = biz();
    if (!b || !openScreen("BUY ANIMALS", () => openBiz())) return;
    let h = "";
    Object.keys(ZONES).forEach((zn) => {
      const built = !!b.zones[zn];
      const n = b.animals.filter((a) => SP[a.sp].z === zn).length;
      h += `<div class="sec">${esc(ZONES[zn].n)}${built ? ` · ${n}/${CAP}` : ""}</div>`;
      if (!built) {
        h += `<div class="row" data-build="${zn}"><img src="${iconUrl(bySpZone(zn)[0])}" alt="" style="object-fit:contain"><div class="t"><b>Build the ${esc(ZONES[zn].n.toLowerCase())} enclosure</b><span>${money(zoneCost())} · room for ${CAP} animals</span></div>${chev()}</div>`;
        return;
      }
      bySpZone(zn).forEach((k) => {
        h += `<div class="row" data-buy="${k}"><img src="${iconUrl(k)}" alt="" style="object-fit:contain"><div class="t"><b>${esc(SP[k].n)}</b><span>${money(buyPrice(k))} · ${gentle(SP[k].d)}${SP[k].show ? " · does shows" : ""}${SP[k].viral >= 0.3 ? " · goes viral" : ""}</span></div>${chev()}</div>`;
      });
    });
    sList.innerHTML = h;
    sList.querySelectorAll("[data-build]").forEach((el) => (el.onclick = () => {
      if ((Number(state.money) || 0) < zoneCost()) return note("Not enough money", `An enclosure costs ${money(zoneCost())}.`);
      addMoney(-zoneCost());
      b.zones[el.dataset.build] = 1;
      snd("choice");
      openBuy();
    }));
    sList.querySelectorAll("[data-buy]").forEach((el) => (el.onclick = () => {
      const k = el.dataset.buy;
      const zn = SP[k].z;
      const n = b.animals.filter((a) => SP[a.sp].z === zn).length;
      const p = buyPrice(k);
      if (n >= CAP) return note("Enclosure full", `The ${ZONES[zn].n.toLowerCase()} is full. Sell an animal or build elsewhere.`);
      if ((Number(state.money) || 0) < p) return note("Not enough money", `A ${SP[k].n.toLowerCase()} costs ${money(p)}.`);
      addMoney(-p);
      const a = bizAnimal(k, false);
      b.animals.push(a);
      snd("choice");
      sayIt(`I bought a ${SP[k].n.toLowerCase()} named ${a.name} for my zoo.`);
      note("New arrival", `${a.name} the ${SP[k].n.toLowerCase()} joins ${b.name}.`, () => openBuy());
    }));
  }
  function openBizAnimals() {
    const b = biz();
    if (!b || !openScreen("YOUR ANIMALS", () => openBiz())) return;
    const list = b.animals.slice().sort((x, y) => SP[x.sp].z.localeCompare(SP[y.sp].z) || x.name.localeCompare(y.name));
    sList.innerHTML = `<div class="sec">${list.length} animals</div>` + (list.length ? list.map((a) => `<div class="row" data-a="${a.id}"><img src="${iconUrl(a.sp)}" alt="" style="object-fit:contain"><div class="t"><b>${esc(a.name)}${a.baby ? " (baby)" : ""}${a.sick ? " · sick" : ""}</b><span>${esc(SP[a.sp].n)} · ${esc(ZONES[SP[a.sp].z].n)}</span>${bar("Happiness", a.hap, col(a.hap))}${bar("Health", a.hea, col(a.hea))}</div></div>`).join("") : `<div class="mm-foot" style="padding:12px 14px">No animals yet. Buy some.</div>`);
    sList.querySelectorAll("[data-a]").forEach((el) => (el.onclick = () => {
      const a = b.animals.find((x) => x.id === +el.dataset.a);
      if (!a) return;
      const pair = b.animals.filter((x) => x.sp === a.sp && !x.baby).length >= 2;
      now({
        iconSrc: iconUrl(a.sp),
        title: `${a.name} the ${spName(a)}`,
        lead: `${gentle(SP[a.sp].d)[0].toUpperCase() + gentle(SP[a.sp].d).slice(1)} animal, ${a.age} year${a.age === 1 ? "" : "s"} old.${a.sick ? " It looks sick." : ""}`,
        rows: [["Happiness", `${Math.round(a.hap)}%`], ["Health", `${Math.round(a.hea)}%`], ["Worth", money(sellPrice(a))]],
        choices: [
          ["Spend time with it", () => { if (a.bond) return note("Already today", `You already spent time with ${a.name} this year.`, () => openBizAnimals()); a.bond = 1; a.hap = cl(a.hap + 12); stat("Happiness", 2); note("Quality time", `${a.name} loves the attention.`, () => openBizAnimals()); }],
          [`Vet checkup (${money(price(1500))})`, () => { if ((Number(state.money) || 0) < price(1500)) return note("Not enough money", "You can't afford the vet."); addMoney(-price(1500)); a.hea = cl(a.hea + 25); a.sick = false; note("Checked", `${a.name} is on the mend.`, () => openBizAnimals()); }],
          pair ? [b.breed[a.sp] ? "Breeding program running" : `Breeding program (${money(price(5000))})`, () => { if (b.breed[a.sp]) return openBizAnimals(); if ((Number(state.money) || 0) < price(5000)) return note("Not enough money", "The program costs more than you have."); addMoney(-price(5000)); b.breed[a.sp] = 1; note("Program started", `If the ${spName(a)}s are happy you may get a baby next year.`, () => openBizAnimals()); }] : ["Needs a second adult for breeding", () => openBizAnimals()],
          [`Sell (${money(sellPrice(a))})`, () => { addMoney(sellPrice(a)); b.animals = b.animals.filter((x) => x !== a); openBizAnimals(); }],
          ["Back", () => openBizAnimals()],
        ],
      });
    }));
  }

  // ------------------------------------------------------------------ exotic pets at home
  function homeYear(ev) {
    const z = Z();
    z.home.forEach((p) => {
      p.hap = cl(p.hap + ri(-3, 3));
      stat("Happiness", p.hap >= 55 ? 2 : -1);
      if (ch(0.05)) {
        stat("Health", -ri(3, 10));
        ev.push(() => note("A bite at home", `${p.name}, your ${SP[p.sp].n.toLowerCase()}, bit you. It is a wild animal after all.`));
      } else if (ch(0.04)) {
        ev.push(() => note("Escaped", `${p.name} got out and the neighbors are not happy. You find it two streets over.`));
      }
    });
  }
  function openHome() {
    const z = Z();
    const list = Object.keys(SP).filter((k) => SP[k].pet);
    const disc = z.rank >= 2 ? 0.7 : 1;
    const rows = z.home.map((p) => [p.name, `${SP[p.sp].n} · happiness ${Math.round(p.hap)}%`]);
    now({
      iconSrc: iconUrl("monkey"),
      title: "Exotic pets at home",
      lead: "Working here means you know people. A pet from a licensed breeder is legal in many places, but exotic animals are never easy.",
      rows: rows.length ? rows : [["Pets", "None yet"]],
      choices: [
        ...list.map((k) => [`Get a ${SP[k].n.toLowerCase()} (${money(Math.round(price(Math.round(SP[k].v * 0.5)) * disc))})`, () => {
          const p = Math.round(price(Math.round(SP[k].v * 0.5)) * disc);
          if ((Number(state.money) || 0) < p) return note("Not enough money", `It costs ${money(p)}.`, () => openHome());
          addMoney(-p);
          const name = uniqueName();
          z.home.push({ sp: k, name, hap: ri(55, 80), since: state.age });
          stat("Happiness", 6);
          sayIt(`I brought home a pet ${SP[k].n.toLowerCase()} named ${name}.`);
          note("A new pet", `${name} the ${SP[k].n.toLowerCase()} moves in.`, () => openHome());
        }]),
        ["Back", () => openHub()],
      ],
    });
  }

  // ------------------------------------------------------------------ care rounds (a few actions a year)
  function useAct() {
    const z = Z();
    if (z.left <= 0) {
      now({ iconSrc: iconUrl("lion"), title: "Out of hours", lead: "You have used all your care hours for this year. The animals will have to wait until next year.", ok: () => openHub() });
      return false;
    }
    z.left--;
    return true;
  }
  const done = (title, lead) => now({ iconSrc: iconUrl("lion"), title, lead, ok: () => openHub() });
  function pickAnimal(title, cb) {
    const list = mine().slice().sort((a, b) => a.hea + a.hap - (b.hea + b.hap)).slice(0, 6);
    if (!list.length) return done("No animals", "You do not have any animals in your section.");
    now({
      iconSrc: iconUrl(list[0].sp),
      title,
      lead: "Who needs you most? The animals who are worst off are listed first.",
      choices: [...list.map((a) => [`${a.name} (${SP[a.sp].n}) · health ${Math.round(a.hea)}%${a.sick ? " · sick" : ""}`, () => cb(a)]), ["Back", () => openCare()]],
    });
  }
  function openCare() {
    const z = Z();
    now({
      iconSrc: iconUrl("lion"),
      title: "Care rounds",
      lead: `Hours left this year: ${z.left}. Each round uses one. Animals in your section (${scopeZones().map((k) => ZONES[k].n).join(", ")}) that go uncared for get worse.`,
      rows: [["Hours left", String(z.left)], ["Care this year", String(z.care)]],
      choices: [
        ["Feed and enrich", () => {
          if (!useAct()) return;
          mine().forEach((a) => ((a.hap = cl(a.hap + ri(5, 10))), (a.hea = cl(a.hea + ri(1, 4)))));
          z.care += 2;
          done("Fed and enriched", "Fresh food, new toys and hidden snacks. The whole section is livelier.");
        }],
        ["Clean the enclosures", () => {
          if (!useAct()) return;
          mine().forEach((a) => ((a.hea = cl(a.hea + ri(6, 10))), (a.hap = cl(a.hap + 2))));
          z.care += 2;
          done("Spotless", "Dirty work, and it shows: fewer infections and calmer animals.");
        }],
        ["Health check", () => pickAnimal("Health check", (a) => {
          if (!useAct()) return;
          z.care += 1.5;
          if (a.sick) {
            if (ch(0.85)) {
              a.sick = false;
              a.hea = cl(a.hea + 15);
              done(`${a.name} treated`, `The vet found an infection in time. ${a.name} is on antibiotics and doing better.`);
            } else {
              a.hea = cl(a.hea + 4);
              done(`${a.name} is struggling`, `The treatment did not take well. ${a.name} needs another look soon.`);
            }
          } else {
            a.hea = cl(a.hea + 3);
            done(`${a.name} checks out`, `${a.name} is healthy. A clean bill of health is always a good day.`);
          }
        })],
        ["Spend time with an animal", () => pickAnimal("Bond with an animal", (a) => {
          if (!useAct()) return;
          z.care += 1;
          a.hap = cl(a.hap + 12);
          a.bond++;
          if (ch(SP[a.sp].d * 0.06)) {
            stat("Health", -ri(5, 18));
            return done(`${a.name} bit you`, `Mostly affectionate, until it was not. ${a.name} the ${spName(a)} reminded you what it is.`);
          }
          done(`${a.name} trusts you`, `A quiet hour with ${a.name}. The bond grows.`);
        })],
        ["Run a show", () => runShow()],
        ["Breeding program", () => openBreed()],
        ["Back", () => openHub()],
      ],
    });
  }
  function runShow() {
    const z = Z();
    const stars = z.animals.filter((a) => SP[a.sp].show && (z.rank >= 3 || scopeZones().includes(SP[a.sp].z)));
    if (!stars.length) return done("No show animals", "You have no penguins, dolphins, seals or birds in your section to perform.");
    if (!useAct()) return;
    const hap = avg(stars, "hap");
    const ok = ch(cl(0.35 + hap / 130, 0.3, 0.92));
    z.care += 1;
    if (ok) {
      z.rep = cl(z.rep + ri(2, 5));
      addMoney(price(ri(800, 3500)));
      if (ch(0.07)) {
        z.fame = cl(z.fame + 12);
        sayIt("A clip of my animal show went viral.");
        return done("It went viral", "The audience loved it, and a clip of the show is all over social media.");
      }
      done("A great show", "Standing room only. The kids loved it and the animals did too.");
    } else {
      stars.forEach((a) => (a.hap = cl(a.hap - 4)));
      z.rep = cl(z.rep - 2);
      done("A rough show", "The animals were off today and the show fell flat.");
    }
  }
  function openBreed() {
    const z = Z();
    const sps = {};
    z.animals.filter((a) => !a.baby && (z.rank >= 3 || scopeZones().includes(SP[a.sp].z))).forEach((a) => (sps[a.sp] = (sps[a.sp] || 0) + 1));
    const ready = Object.keys(sps).filter((k) => sps[k] >= 2 && !z.breeding[k]);
    if (!ready.length) return done("Breeding program", "You need at least two adults of the same species that are not already in a program.");
    now({
      iconSrc: iconUrl(ready[0]),
      title: "Breeding program",
      lead: "Pair two animals and manage their diet and stress. If it works, a baby arrives next year, and a baby can become a star.",
      choices: [
        ...ready.map((k) => [`${SP[k].n} (viral chance ${Math.round(SP[k].viral * 100)}%)`, () => {
          if (!useAct()) return;
          z.breeding[k] = state.age;
          z.care += 1.5;
          done("Program started", `The ${SP[k].n.toLowerCase()} pair is in the program. Keep them happy and see what next year brings.`);
        }]),
        ["Back", () => openCare()],
      ],
    });
  }

  // ------------------------------------------------------------------ screens
  const barOld = (label, v, color) => `<div style="margin:3px 0"><span style="font-size:12px;opacity:.8">${esc(label)} ${Math.round(v)}%</span><i style="display:block;height:7px;border-radius:4px;background:#0002;overflow:hidden;margin-top:2px"><u style="display:block;height:100%;width:${Math.max(3, v)}%;background:${color}"></u></i></div>`;
  const bar = (label, v, color, hint) => (window.FL_BARS ? FL_BARS.html(label, v, color, hint) : barOld(label, v, color));
  const col = (v) => (v >= 60 ? "#2fa03b" : v >= 35 ? "#f5841f" : "#b3261e");
  const openScreen = (title, back) => {
    if (typeof screen === "undefined" || typeof sList === "undefined") return false;
    sTitle.textContent = title;
    if (typeof sSub !== "undefined" && sSub && sSub.style) sSub.style.display = "none";
    sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;";
    sBack.onclick = back;
    screen.classList.add("open");
    sList.scrollTop = 0;
    return true;
  };
  const row = (id, ic, t, s) => `<div class="row" data-z="${id}"><img src="${ic}" alt="" style="object-fit:contain"><div class="t"><b>${esc(t)}</b><span>${s}</span></div>${chev()}</div>`;

  function startCareer() {
    const z = Z();
    if (state.age < 16) return note("Too young", "You need to be at least 16 to volunteer at the zoo.");
    if (state.prison) return note("Not possible", "You cannot work at a zoo from prison.");
    if (state.job && !state.job.zoo) return note("You already have a job", "Quit your current job first to start at the zoo.");
    if (z.fired && !z.on) z.fired = false;
    z.on = true;
    z.rank = 0;
    z.yrs = 0;
    z.rankYr = 0;
    z.perf = 55;
    z.name = `${state.city || "City"} Zoo`;
    z.zone = pick(Object.keys(ZONES));
    z.left = 4;
    z.care = 0;
    z.last = state.age;
    if (!z.animals.length) seedZoo();
    syncJob(true);
    sayIt(`I started volunteering at ${z.name}.`);
    now({ iconSrc: iconUrl("lion"), title: "Welcome to the zoo", lead: `You start as a volunteer at ${z.name}. Work hard, keep the animals healthy and happy, and the zoo will notice. You begin in the ${ZONES[z.zone].n}.`, ok: () => openHub() });
  }

  function openHub() {
    const z = Z();
    if (!z.on) {
      if (!openScreen("ZOOKEEPER", () => typeof openSpecialCareers === "function" && openSpecialCareers())) return;
      sList.innerHTML = `<div class="sec">Zookeeper</div>` + row("start", iconUrl("lion"), "Start at the zoo", "Begin as a volunteer (16+) and work your way up to Zoo Director") + `<div class="mm-foot" style="padding:10px 14px;text-align:left">Volunteer, Junior Keeper, Zone Keeper, Head Keeper, Director. Feed, clean and care for the animals, run shows, breed babies, and deal with whatever goes wrong.</div>`;
      sList.querySelector('[data-z="start"]').onclick = startCareer;
      return;
    }
    snd("choice");
    openScreen("ZOOKEEPER", () => typeof openSpecialCareers === "function" && openSpecialCareers());
    const r = RANKS[z.rank];
    const nxt = RANKS[z.rank + 1];
    const my = mine();
    let h = `<div class="sec">${esc(z.name)}</div><div class="row" style="flex-direction:column;align-items:stretch;height:auto;padding:10px 14px"><b>${esc(r.t)}${z.rank >= 2 && z.rank < 3 ? ` · ${ZONES[z.zone].n}` : ""}</b>` + bar("Performance", z.perf, col(z.perf)) + bar("Zoo reputation", z.rep, col(z.rep)) + (z.fame > 0 ? bar("Fame", z.fame, "#6b2f8f") : "") + (z.heat > 0 ? bar("Heat", z.heat, z.heat >= 60 ? "#b3261e" : "#f5841f") : "") + `<span style="font-size:12px;opacity:.75">${z.yrs} year${z.yrs === 1 ? "" : "s"} at the zoo · care hours left: ${z.left}</span></div>`;
    h += `<div class="sec">Work</div>`;
    h += row("care", iconUrl("zebra"), "Care rounds", `${z.left} hours left this year · feed, clean, check, bond, shows`);
    h += row("animals", iconUrl(my[0] ? my[0].sp : "lion"), "Animals", `${my.length} in your section · ${z.animals.length} in the zoo`);
    if (z.rank === 4) h += row("budget", "emoji/1f4b0.png", "Budget", `Currently: ${z.budget === "cut" ? "Cut (more profit, animals suffer)" : z.budget === "good" ? "Generous (animals thrive)" : "Normal"}`);
    h += row("career", iconUrl("lion"), "Career", nxt ? `Next: ${nxt.t} (${nxt.yrs} years, ${nxt.perf}% performance)` : "You run the zoo");
    h += `<div class="sec">Beyond the job</div>`;
    h += row("home", iconUrl("monkey"), "Exotic pets at home", z.home.length ? `${z.home.length} at home` : "Bring a pet home");
    h += row("biz", iconUrl("giraffe"), z.biz ? z.biz.name : "Your own zoo", z.biz ? `${z.biz.animals.length} animals · reputation ${Math.round(z.biz.rep)}%` : `Open one for ${money(price(450000))}`);
    if (z.rank >= 1 && state.age >= 18) h += row("dark", "emoji/1f43e.png", "Exotic contacts", z.priv ? `${z.priv.name} · ${z.priv.cats} big cats` : "Where the real money is. And the real risk.");
    sList.innerHTML = h;
    sList.querySelectorAll("[data-z]").forEach((el) => {
      const k = el.dataset.z;
      el.onclick = () => {
        snd("choice");
        if (k === "care") return openCare();
        if (k === "animals") return openAnimals();
        if (k === "budget") return openBudget();
        if (k === "career") return openCareer();
        if (k === "home") return openHome();
        if (k === "biz") return openBiz();
        if (k === "dark") return openDark();
      };
    });
  }
  function openAnimals() {
    const z = Z();
    openScreen("ANIMALS", () => openHub());
    const list = z.animals.slice().sort((a, b) => Number(scopeZones().includes(SP[b.sp].z)) - Number(scopeZones().includes(SP[a.sp].z)) || a.name.localeCompare(b.name));
    sList.innerHTML = `<div class="sec">${z.animals.length} animals</div>` + list.map((a) => `<div class="row" data-a="${a.id}"><img src="${iconUrl(a.sp)}" alt="" style="object-fit:contain"><div class="t"><b>${esc(a.name)}${a.baby ? " (baby)" : ""}${a.sick ? " · sick" : ""}</b><span>${esc(SP[a.sp].n)} · ${esc(ZONES[SP[a.sp].z].n)}${scopeZones().includes(SP[a.sp].z) ? " · yours" : ""}</span>${bar("Happiness", a.hap, col(a.hap))}${bar("Health", a.hea, col(a.hea))}</div></div>`).join("");
  }
  function openBudget() {
    const z = Z();
    const set = (b) => {
      z.budget = b;
      openHub();
    };
    now({
      iconSrc: "emoji/1f4b0.png",
      title: "Zoo budget",
      lead: "The board rewards profit. The animals pay the bill when you cut. Inspectors and activists notice.",
      rows: [["Current", z.budget === "cut" ? "Cut" : z.budget === "good" ? "Generous" : "Normal"]],
      choices: [["Generous: animals thrive, small bonus", () => set("good")], ["Normal", () => set("normal")], ["Cut the budget: big bonus, animals suffer", () => set("cut")], ["Back", () => openHub()]],
    });
  }
  function openCareer() {
    const z = Z();
    const nxt = RANKS[z.rank + 1];
    now({
      iconSrc: iconUrl("lion"),
      title: "Career",
      lead: nxt ? `Next step: ${nxt.t}. You need ${nxt.yrs} years in your current role and ${nxt.perf}% performance.${nxt.age ? ` Minimum age ${nxt.age}.` : ""}` : "You are the director. There is no higher rank, only a higher fall.",
      rows: [["Rank", RANKS[z.rank].t], ["Years in role", String(z.yrs - (z.rankYr || 0))], ["Performance", `${Math.round(z.perf)}%`]],
      choices: [
        ["Resign", () => now({ iconSrc: iconUrl("lion"), title: "Resign?", lead: "You walk away from the zoo. The animals stay without you.", choices: [["Yes, resign", () => {
          sayIt("I resigned from the zoo.");
          endJob("resigned");
          screen.classList.remove("open");
        }], ["Never mind", () => openHub()]] })],
        ["Back", () => openHub()],
      ],
    });
  }

  // ------------------------------------------------------------------ hooks
  function boot() {
    if (typeof state === "undefined" || typeof jCard !== "function" || typeof notice !== "function" || typeof sList === "undefined" || typeof openSpecialCareers !== "function" || !document.getElementById("ageBtn")) return setTimeout(boot, 80);
    const orig = openSpecialCareers;
    window.openSpecialCareers = function () {
      const r = orig.apply(this, arguments);
      try {
        const z = state.zoo && state.zoo.on ? state.zoo : null;
        const sub = z ? `${RANKS[z.rank].t} · ${z.name}` : "Feed, heal and run a zoo. From volunteer to director.";
        const html = `<div class="row sp-pack" id="spZoo"><img src="${iconUrl("lion")}" alt=""><div class="t"><b>Zookeeper</b><span>${esc(sub)}</span></div>${chev()}</div>`;
        const first = sList.querySelector(".sp-pack");
        first ? first.insertAdjacentHTML("beforebegin", html) : sList.insertAdjacentHTML("beforeend", html);
        document.getElementById("spZoo").onclick = () => (snd("choice"), openHub());
      } catch (e) {
        warn("menu", e);
      }
      return r;
    };
    // Assets -> Zoo (the base game shows it as "coming soon")
    const origAssets = window.openAssets;
    if (typeof origAssets === "function")
      window.openAssets = function () {
        const r = origAssets.apply(this, arguments);
        try {
          let el = sList.querySelector('[data-soon="Zoo"]');
          if (!el && !document.querySelector(".phone").classList.contains("y2018")) {
            const anchor = sList.querySelector("#assetPay") || sList.querySelector("#assetBank");
            if (anchor) {
              anchor.insertAdjacentHTML("afterend", `<div class="row" data-soon="Zoo"><img src="${iconUrl("lion")}" alt=""><div class="t"><b>Zoo</b><span>${Z().biz ? esc(Z().biz.name) : "Purchase a zoo"}</span></div>${chev()}</div>`);
              el = sList.querySelector('[data-soon="Zoo"]');
            }
          }
          if (el) {
            const im = el.querySelector("img");
            if (im) im.src = iconUrl("lion");
            const seal = el.querySelector(".seal");
            if (seal) seal.remove();
            const sp = el.querySelector(".t span");
            if (sp) sp.textContent = Z().biz ? Z().biz.name : "Purchase a zoo";
            el.onclick = () => (snd("choice"), openBiz());
          }
        } catch (e) {
          warn("assets", e);
        }
        return r;
      };
    const origJob = window.openJobScreen;
    if (typeof origJob === "function")
      window.openJobScreen = function () {
        if (state.job && state.job.zoo) return openHub();
        return origJob.apply(this, arguments);
      };
    document.getElementById("ageBtn").addEventListener("click", () =>
      setTimeout(() => {
        try {
          tick();
        } catch (e) {
          warn("tick", e);
        }
      }, 500),
    );
    console.log("[zoo] loaded");
  }
  window.FL_ZOO = {
    open: () => openHub(),
    state: () => Z(),
    tick,
    start: startCareer,
    eventNow: (id) => (EVENTS[id] ? EVENTS[id].run() : null),
    custom: CUSTOM,
    openZoo: () => openBiz(),
    SP,
  };
  boot();
})();
