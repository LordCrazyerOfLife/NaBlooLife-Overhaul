/* [base] Garage for NaBlooLife.
 *
 * Assets -> Garage: every vehicle you own lives here, split in four sections:
 *   Cars (state.cars), Motorcycles, Marina (boats) and Hangar (planes and helicopters) (state.eliteVehicles).
 * Cars keep the game's own menu (openCar). Motorcycles, boats and aircraft now get the SAME activities as cars:
 * View, Abandon, Drive (Ride / Sail / Fly), Garage, Gift, Maintenance, Pay Off, Repair, Sell (dealer, ad with offers or
 * black market) and Scrap. The old per-car rows in Assets and the elite-life row are replaced by one Garage row, and
 * the car menu's "Garage" entry (it used to say coming soon) opens this screen.
 * Debug: FL_GARAGE.open(), FL_GARAGE.sections().
 */
(() => {
  "use strict";
  if (window.FL_GARAGE) return;

  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const cl = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const warn = (w, e) => console.warn("[garage] " + w, e);
  const usdf = (n) => {
    try {
      return usd(n);
    } catch {
      return "$" + Math.round(n).toLocaleString("en-US");
    }
  };
  const chev = () => (typeof CHEV !== "undefined" ? CHEV : "");
  const dots = () => (typeof DOTS !== "undefined" ? DOTS : "");
  const barColor = (v) => (typeof barCol === "function" ? barCol(v) : v >= 31 ? "#2fa03b" : v >= 13 ? "#f5841f" : "#b3261e");
  const logLine = (s) => {
    try {
      say(s);
    } catch {}
  };
  const note = (t, m, cb, rows) => notice(t, m, cb || null, true, rows || "");
  const broke = (n) => {
    try {
      return brokeRows(n);
    } catch {
      return "";
    }
  };
  const refresh = () => {
    try {
      renderStats();
    } catch {}
  };

  // ------------------------------------------------------------------ what lives where
  const fleet = () => (Array.isArray(state.eliteVehicles) ? state.eliteVehicles : (state.eliteVehicles = []));
  const KIND = {
    sportbikes: { noun: "motorcycle", short: "Bike", verb: "Ride", past: "rode", lic: "motorcycle", out: "Take it out for a ride", gone: "left it on the side of the road" },
    boats: { noun: "boat", short: "Boat", verb: "Sail", past: "sailed", lic: "boat", out: "Take it out on the water", gone: "left it adrift at the pier" },
    planes: { noun: "aircraft", short: "Aircraft", verb: "Fly", past: "flew", lic: "pilot", out: "Take it up for a flight", gone: "left it on the apron" },
    islands: { noun: "island", short: "Island", verb: "Visit", past: "visited", lic: null, out: "Spend time on your island", gone: "gave up the deed to it" },
    helicopters: { noun: "helicopter", short: "Helicopter", verb: "Fly", past: "flew", lic: "heli", out: "Take it up for a flight", gone: "left it on the pad" },
  };
  const SECTIONS = [
    { id: "cars", title: "Cars", icon: "cars/ui-race-car.png", empty: "No cars yet", shop: "Visit a car dealer", kinds: null },
    { id: "bikes", title: "Motorcycles", icon: "bikes/sportbike-01-ducati-red.png", empty: "No motorcycles yet", shop: "Visit Redline Motorcycles", kinds: ["sportbikes"], store: "sportbikes" },
    { id: "marina", title: "Marina", icon: "boats/ship-06-superyacht-white.png", empty: "No boats yet", shop: "Visit Northstar Marine", kinds: ["boats"], store: "boats" },
    { id: "hangar", title: "Hangar", icon: "aircraft/private-jet.png", empty: "No aircraft yet", shop: "Visit the aircraft dealers", kinds: ["planes", "helicopters"], store: "planes" },
    { id: "islands", title: "Islands", icon: "islands/island-01-modern-villa.png", empty: "No islands yet", shop: "Visit Archipelago Estates", kinds: ["islands"], store: "islands" },
  ];
  const inSection = (s) => fleet().filter((v) => v && s.kinds && s.kinds.includes(v.kind));
  const counts = () => ({
    cars: (state.cars || []).length,
    bikes: inSection(SECTIONS[1]).length,
    marina: inSection(SECTIONS[2]).length,
    hangar: inSection(SECTIONS[3]).length,
  });

  // vehicle maths (same shape as the cars')
  const base = (v) => Math.max(1000, Number(v.price) || 1000);
  const evalue = (v) => Math.max(0, Math.round(base(v) * (0.55 + (Number(v.cond) || 100) / 300)));
  const age = (v) => Math.max(0, state.age - (Number(v.bought) || state.age));
  const removeV = (v) => {
    const i = fleet().indexOf(v);
    if (i >= 0) fleet().splice(i, 1);
  };

  // ------------------------------------------------------------------ ui helpers
  const openScreen = (title, back, html) => {
    sTitle.textContent = title;
    if (typeof sSub !== "undefined" && sSub && sSub.style) sSub.style.display = "none";
    sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;";
    sBack.onclick = back;
    sList.innerHTML = html;
    sList.scrollTop = 0;
    screen.classList.add("open");
  };
  const condRow = (cond) => `<div class="rel">Condition <i><u style="width:${Math.max(2, cond)}%;background:${barColor(cond)}"></u></i></div>`;
  const carRow = (e, i) =>
    `<div class="row" data-car="${i}"><img src="${typeof carImg === "function" ? carImg(e) : ""}"><div class="t"><b>${esc(e.make)} ${esc(e.model)} <em>(${esc((window.CAR_TYPE_NAME || {})[e.type] || "Car")})</em></b>${condRow(e.cond)}</div>${chev()}</div>`;
  const vehRow = (v, i) =>
    `<div class="row" data-veh="${i}"><img src="${v.img}" style="object-fit:contain"><div class="t"><b>${esc(v.name)} <em>(${esc((KIND[v.kind] || {}).short || "Vehicle")})</em></b>${condRow(Math.round(v.cond))}</div>${chev()}</div>`;
  const emptyRow = (icon, t, s) => `<div class="row" style="cursor:default"><img src="${icon}" style="object-fit:contain"><div class="t"><b>${t}</b><span>${s}</span></div></div>`;

  // ------------------------------------------------------------------ the garage screen
  function openGarage() {
    if (typeof screen === "undefined" || typeof sList === "undefined") return;
    const c = counts();
    const total = c.cars + c.bikes + c.marina + c.hangar;
    let h = `<div class="sec">Your vehicles</div>`;
    h += `<div class="row sm" style="cursor:default"><div class="t"><b style="font-weight:600">${total} vehicle${total === 1 ? "" : "s"}</b><span>${c.cars} car${c.cars === 1 ? "" : "s"} · ${c.bikes} motorcycle${c.bikes === 1 ? "" : "s"} · ${c.marina} boat${c.marina === 1 ? "" : "s"} · ${c.hangar} aircraft</span></div></div>`;
    if ((state.visited || []).length) h += `<div class="row sm" style="cursor:default"><div class="t"><b style="font-weight:600">${state.visited.length} countr${state.visited.length === 1 ? "y" : "ies"} visited by air</b><span>${state.visited.slice(-5).map((c) => esc(cname(c))).join(" · ")}</span></div></div>`;
    const carsList = state.cars || [];
    SECTIONS.forEach((s) => {
      const list = s.id === "cars" ? carsList : inSection(s);
      h += `<div class="sec">${s.title} (${list.length})</div>`;
      if (!list.length) h += emptyRow(s.icon, s.empty, "Nothing parked here");
      else h += s.id === "cars" ? list.map((e, i) => carRow(e, i)).join("") : list.map((v) => vehRow(v, fleet().indexOf(v))).join("");
      h += `<div class="row" data-shop="${s.id}"><img src="${s.icon}" style="object-fit:contain"><div class="t"><b>${s.shop}</b><span>Browse and buy</span></div>${chev()}</div>`;
    });
    openScreen("GARAGE", () => (typeof openAssets === "function" ? openAssets() : screen.classList.remove("open")), h);
    sList.querySelectorAll("[data-car]").forEach((el) => (el.onclick = () => openCar(state.cars[+el.dataset.car])));
    sList.querySelectorAll("[data-veh]").forEach((el) => (el.onclick = () => openVehicle(fleet()[+el.dataset.veh])));
    sList.querySelectorAll("[data-shop]").forEach((el) => {
      el.onclick = () => {
        const s = SECTIONS.find((x) => x.id === el.dataset.shop);
        try {
          play("choice");
        } catch {}
        if (s.store && window.FL_ELITE_LIFE && FL_ELITE_LIFE.openVehicleStore) FL_ELITE_LIFE.openVehicleStore(s.store);
        else if (typeof openShopping === "function") openShopping();
      };
    });
  }

  // ------------------------------------------------------------------ taking someone along (every vehicle, cars included)
  // Pick a lover, a relative or a friend for the next seat (or a few of them if there is room): you go out together,
  // your relationship with them improves and you have more fun than going alone.
  const seatsOfCar = (e) => ({ coupe: 2, convertible: 2, roadster: 2, truck: 3, pickup: 3, van: 7, minivan: 7, suv: 7, "4x4": 5, hatchback: 5, wagon: 5 }[String(e.type || "").toLowerCase()] || 5);
  function companions() {
    const abroad = (e) => {
      try {
        return !!livesAbroad(e);
      } catch {
        return false;
      }
    };
    const rAge = (e) => {
      try {
        return relAge(e);
      } catch {
        return 18;
      }
    };
    const on = (e) => {
      try {
        return famOn(e);
      } catch {
        return true;
      }
    };
    const out = [];
    (state.lovers || []).filter((e) => e && !e.dead && !abroad(e)).forEach((e) => {
      let label = "partner";
      try {
        label = loverTitle(e).toLowerCase();
      } catch {}
      out.push({ p: e, first: e.first, kind: "lover", label });
    });
    (state.parents || []).filter((e) => e && !e.dead && !abroad(e)).forEach((e) => out.push({ p: e, first: e.first, kind: "family", label: String(e.role || "parent").toLowerCase() }));
    (state.family || []).filter((e) => e && !e.dead && on(e) && rAge(e) >= 4 && !abroad(e)).forEach((e) => {
      let label = "relative";
      try {
        label = relTitle(e).toLowerCase();
      } catch {}
      out.push({ p: e, first: e.first, kind: "family", label });
    });
    (state.friends || []).filter((e) => e && !abroad(e)).forEach((e) => out.push({ p: e, first: e.first, kind: "friend", label: "friend" }));
    return out;
  }
  const SCENES = {
    lover: {
      car: ["You held hands over the gearstick the whole way.", "You sang every song together with the windows down.", "You parked somewhere with a view and just talked for hours."],
      bike: ["They held on tight and laughed into your shoulder the whole ride.", "You stopped at a lookout and watched the lights come on.", "Helmets, wind and a very long kiss at the red light."],
      boat: ["You shared a bottle on deck and watched the sunset together.", "You dropped anchor, swam off the stern and lost track of time.", "A quiet night on the water with nobody around."],
      air: ["You flew them over the city at golden hour. They did not stop smiling.", "Above the clouds they leaned on your shoulder and said nothing at all.", "You landed and they hugged you for a long time."],
    },
    family: {
      car: ["You stopped for ice cream and talked about old times.", "The whole drive was a debate about the music. Everybody won.", "You got lost on purpose and ended up at a diner."],
      bike: ["They held on and screamed for the first mile, then asked for more.", "You rode to the coast and they bought you a snack for the road.", "They kept telling everyone about it afterwards."],
      boat: ["You all swam off the boat and ate on the deck.", "You taught them to steer and they would not give the wheel back.", "Fishing, jokes and a very bad sunburn."],
      air: ["They pressed their face to the window the entire flight.", "You pointed out their old neighbourhood from above.", "They are still telling the story at every dinner."],
    },
    friend: {
      car: ["You blasted music and laughed until the gas light came on.", "A random road trip to nowhere. The best kind.", "You raced a bunch of yellow lights and talked about everything."],
      bike: ["You rode side by side and did the whole loop twice.", "You stopped for burgers and plotted your next adventure.", "Wind, noise and zero worries."],
      boat: ["You jumped off the bow and splashed each other like kids.", "Music, snacks and a very lazy afternoon.", "You swapped stories until the stars came out."],
      air: ["They begged you to do a low pass over the beach.", "You took a photo above the clouds that is now their profile picture.", "You landed and they wanted to go again immediately."],
    },
  };
  const groupOf = (kind) => (kind === "sportbikes" ? "bike" : kind === "boats" || kind === "islands" ? "boat" : kind === "planes" || kind === "helicopters" ? "air" : "car");

  // vehicle: { name, img, tag, verb, past, noun, seats, group, run(wearFn), ... }
  function pickCompany(V, onGo) {
    const all = companions();
    const room = Math.max(0, (V.seats || 4) - 1);
    if (!all.length || !room) return onGo([]);
    const shuffle = (a) => a.slice().sort(() => rnd() - 0.5);
    const lovers = shuffle(all.filter((c) => c.kind === "lover")).slice(0, 2);
    const fam = shuffle(all.filter((c) => c.kind === "family")).slice(0, 3);
    const friends = shuffle(all.filter((c) => c.kind === "friend")).slice(0, 2);
    const offered = [...lovers, ...fam, ...friends].slice(0, 6);
    const label = (c) => `${c.first} (${c.kind === "lover" ? c.label : c.kind === "family" ? c.label : "friend"}) · ${Math.round(c.p.rel ?? 0)}%`;
    const choices = offered.map((c) => [label(c), () => onGo([c])]);
    if (room >= 3 && all.length >= 2) {
      const crew = shuffle(all).slice(0, Math.min(room, 4));
      choices.push([`Take the whole crew (${crew.length})`, () => onGo(crew)]);
    }
    choices.push(["Go alone", () => onGo([])]);
    jCard({
      tag: V.tag, iconSrc: V.img, title: `${V.verb}: who comes along?`, close: true,
      lead: `There ${room === 1 ? "is a seat" : `are ${room} seats`} free. Someone to share the ${V.noun} with makes the day better, and it is good for your relationship.`,
      choices,
    });
  }

  function finishOuting(V, group, after) {
    const alone = !group.length;
    const happy = alone ? ri(3, 7) : ri(6, 12) + Math.min(3, group.length - 1);
    try {
      fx({ Happiness: happy }, "");
    } catch {}
    const lines = [];
    const changes = [];
    let text = "";
    if (alone) {
      text = V.soloLine();
    } else {
      const argued = [];
      group.forEach((c) => {
        const argue = rnd() < 0.1;
        if (argue) argued.push(c.first);
        const d = argue ? -ri(2, 5) : ri(4, 10);
        const before = Number(c.p.rel) || 0;
        try {
          c.p.rel = clamp(before + d);
        } catch {
          c.p.rel = cl(before + d);
        }
        changes.push(`<div><b>${esc(c.first)}:</b> ${d > 0 ? "+" : ""}${d} relationship</div>`);
        lines.push(argue ? `${c.first} and you argued about the route the whole way.` : pick((SCENES[c.kind] || SCENES.friend)[V.group] || SCENES.friend.car));
      });
      const names = group.map((c) => c.first);
      const nameStr = names.length > 1 ? names.slice(0, -1).join(", ") + " and " + names.slice(-1) : names[0];
      text = V.tripText ? V.tripText(nameStr, argued) : `You took your ${esc(V.name)} out with ${nameStr}. ${lines.slice(0, 2).join(" ")}`;
    }
    const names = group.map((c) => c.first);
    logLine(alone ? `I ${V.past} my ${V.name}.` : `I ${V.past} my ${V.name} with ${names.length > 1 ? names.slice(0, -1).join(", ") + " and " + names.slice(-1) : names[0]}.`);
    refresh();
    const rows = `<div class="brk"><div><b>Happiness:</b> +${happy}</div>${changes.join("")}</div>`;
    after(V.verb, text, rows);
  }

  // ------------------------------------------------------------------ short trips abroad (jets, planes and helicopters)
  // Capital coordinates of every country in the game, to know which ones are "close to yours".
  const GEO = Object.fromEntries(
    "ad 42.5 1.5|ae 24.5 54.4|af 34.5 69.2|ag 17.1 -61.8|al 41.3 19.8|am 40.2 44.5|ao -8.8 13.2|ar -34.6 -58.4|at 48.2 16.4|au -35.3 149.1|aw 12.5 -70|az 40.4 49.9|ba 43.9 18.4|bb 13.1 -59.6|bd 23.8 90.4|be 50.8 4.4|bf 12.4 -1.5|bg 42.7 23.3|bh 26.2 50.6|bi -3.4 29.4|bj 6.5 2.6|bn 4.9 114.9|bo -16.5 -68.1|br -15.8 -47.9|bs 25 -77.4|bt 27.5 89.6|bw -24.7 25.9|by 53.9 27.6|bz 17.3 -88.8|ca 45.4 -75.7|cd -4.3 15.3|cf 4.4 18.6|cg -4.3 15.3|ch 46.9 7.4|ci 6.8 -5.3|cl -33.4 -70.7|cm 3.9 11.5|cn 39.9 116.4|co 4.7 -74.1|cr 9.9 -84.1|cu 23.1 -82.4|cv 14.9 -23.5|cy 35.2 33.4|cz 50.1 14.4|de 52.5 13.4|dj 11.6 43.1|dk 55.7 12.6|dm 15.3 -61.4|do 18.5 -69.9|dz 36.8 3.1|ec -0.2 -78.5|ee 59.4 24.7|eg 30 31.2|er 15.3 38.9|es 40.4 -3.7|et 9 38.7|fi 60.2 24.9|fj -18.1 178.4|fm 6.9 158.2|fr 48.9 2.4|ga 0.4 9.5|gb 51.5 -0.1|gd 12.1 -61.7|ge 41.7 44.8|gh 5.6 -0.2|gm 13.5 -16.6|gn 9.5 -13.7|gq 3.8 8.8|gr 38 23.7|gt 14.6 -90.5|gw 11.9 -15.6|gy 6.8 -58.2|hk 22.3 114.2|hn 14.1 -87.2|hr 45.8 16|ht 18.5 -72.3|hu 47.5 19|id -6.2 106.8|ie 53.3 -6.3|il 31.8 35.2|in 28.6 77.2|iq 33.3 44.4|ir 35.7 51.4|is 64.1 -21.9|it 41.9 12.5|jm 18 -76.8|jo 31.9 35.9|jp 35.7 139.7|ke -1.3 36.8|kg 42.9 74.6|kh 11.6 104.9|ki 1.4 173|km -11.7 43.3|kn 17.3 -62.7|kp 39 125.8|kr 37.6 127|kw 29.4 48|kz 51.2 71.4|la 18 102.6|lb 33.9 35.5|lc 14 -61|li 47.1 9.5|lk 6.9 79.9|lr 6.3 -10.8|ls -29.3 27.5|lt 54.7 25.3|lu 49.6 6.1|lv 56.9 24.1|ly 32.9 13.2|ma 34 -6.8|mc 43.7 7.4|md 47 28.9|me 42.4 19.3|mg -18.9 47.5|mh 7.1 171.4|mk 42 21.4|ml 12.6 -8|mm 19.8 96.1|mn 47.9 106.9|mr 18.1 -15.9|mt 35.9 14.5|mu -20.2 57.5|mv 4.2 73.5|mw -14 33.8|mx 19.4 -99.1|my 3.1 101.7|mz -25.9 32.6|na -22.6 17.1|ne 13.5 2.1|ng 9.1 7.5|ni 12.1 -86.3|nl 52.4 4.9|no 59.9 10.8|np 27.7 85.3|nr -0.5 166.9|nz -41.3 174.8|om 23.6 58.4|pa 9 -79.5|pe -12 -77|pg -9.4 147.2|ph 14.6 121|pk 33.7 73.1|pl 52.2 21|pr 18.5 -66.1|ps 31.9 35.2|pt 38.7 -9.1|pw 7.5 134.6|py -25.3 -57.6|qa 25.3 51.5|ro 44.4 26.1|rs 44.8 20.5|ru 55.8 37.6|rw -1.9 30.1|sa 24.7 46.7|sb -9.4 160|sc -4.6 55.5|sd 15.6 32.5|se 59.3 18.1|sg 1.35 103.8|si 46.1 14.5|sk 48.1 17.1|sl 8.5 -13.2|sm 43.9 12.4|sn 14.7 -17.5|so 2 45.3|ss 4.9 31.6|st 0.3 6.7|sr 5.9 -55.2|sv 13.7 -89.2|sy 33.5 36.3|sz -26.3 31.1|td 12.1 15|tg 6.1 1.2|th 13.8 100.5|tj 38.6 68.8|tl -8.6 125.6|tm 38 58.4|tn 36.8 10.2|to -21.1 -175.2|tr 39.9 32.9|tt 10.7 -61.5|tv -8.5 179.2|tw 25 121.6|tz -6.2 35.7|ua 50.5 30.5|ug 0.3 32.6|us 38.9 -77|uy -34.9 -56.2|uz 41.3 69.3|va 41.9 12.5|vc 13.2 -61.2|ve 10.5 -66.9|vn 21 105.8|vu -17.7 168.3|ws -13.8 -171.8|ye 15.4 44.2|za -25.7 28.2|zm -15.4 28.3|zw -17.8 31".split("|").map((t) => {
      const [c, la, lo] = t.split(" ");
      return [c, [+la, +lo]];
    }),
  );
  const km = (a, b) => {
    const R = 6371, r = Math.PI / 180;
    const dLa = (b[0] - a[0]) * r, dLo = (b[1] - a[1]) * r;
    const x = Math.sin(dLa / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLo / 2) ** 2;
    return Math.round(2 * R * Math.asin(Math.sqrt(x)));
  };
  const rangeKm = (v) => {
    if (v.kind === "helicopters") return 900;
    const t = `${v.id || ""} ${v.name || ""}`.toLowerCase();
    if (/seaplane|turboprop|prop|cessna|piper|caravan|pilatus|beech|king air/.test(t)) return 1800;
    return 4000; // jets
  };
  const ratePerKm = (v) => (v.kind === "helicopters" ? 11 : rangeKm(v) <= 1800 ? 14 : 32);
  const inflK = () => {
    try {
      return typeof inflFx === "function" ? inflFx(1.03) : 1;
    } catch {
      return 1;
    }
  };
  const cname = (c) => ((window.COUNTRIES || {})[c] || [c])[0];
  const ccity = (c) => ((window.COUNTRIES || {})[c] || [c, ""])[1];
  const RISKY = new Set(["kp", "af", "ss", "sy", "ye", "so", "ly"]);
  const TRIP_SCENES = [
    "You checked into a beach hotel in {city} and did absolutely nothing for three days.",
    "A long lazy vacation in {city}: late breakfasts, a pool, and sunsets from the balcony.",
    "You wandered around {city} with no plan, found a tiny restaurant and stayed for hours.",
    "You spent the vacation in {city} at a spa, then ate something incredible and slept like a baby.",
    "Souvenirs, street food and a rooftop sunset in {city}. The flight home felt too short.",
    "You took a hundred photos in {city} and had zero regrets.",
    "A spontaneous getaway to {city}: no schedule, no phone, just rest.",
    "A boat day, a long dinner and a very slow morning in {city}. Exactly what you needed.",
  ];
  const MISHAPS = [
    { k: "weather", w: 3 },
    { k: "customs", w: 2 },
    { k: "engine", w: 1 },
  ];

  function nearbyCountries(v) {
    const home = GEO[state.country];
    if (!home) return [];
    const range = rangeKm(v);
    return Object.keys(GEO)
      .filter((c) => c !== state.country && !RISKY.has(c))
      .map((c) => ({ c, d: km(home, GEO[c]) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 8)
      .map((x) => ({ ...x, ok: x.d <= range }));
  }
  const costOf = (v, d) => Math.round(d * ratePerKm(v) * inflK() + (v.kind === "helicopters" ? 300 : 1200) * inflK());

  function openTrips(v) {
    const K = KIND[v.kind] || KIND.planes;
    const list = nearbyCountries(v);
    let h = `<div class="sec">Short vacations from ${esc(cname(state.country))}</div>`;
    h += `<div class="row sm" style="cursor:default"><div class="t"><b style="font-weight:600">${esc(v.name)}: range ${rangeKm(v)} km</b><span>Pick a country close to yours for a quick vacation. Farther ones need a longer-range aircraft.</span></div></div>`;
    if (!list.length) h += `<div class="row" style="cursor:default"><div class="t"><b>No destinations</b><span>Your home country has no map data.</span></div></div>`;
    list.forEach((x, i) => {
      const hours = x.d / (v.kind === "helicopters" ? 250 : rangeKm(v) <= 1800 ? 380 : 800);
      h += `<div class="row${x.ok ? "" : " dis"}" data-trip="${i}"><img src="flags/${x.c}.png" alt=""><div class="t"><b>${esc(cname(x.c))}</b><span>${x.d} km · ${hours < 1 ? Math.round(hours * 60) + " min" : hours.toFixed(1) + " h"} · ${x.ok ? usdf(costOf(v, x.d)) : "out of range"}</span></div>${x.ok ? dots() : ""}</div>`;
    });
    openScreen("VACATION", () => openVehicle(v), h);
    sList.querySelectorAll("[data-trip]").forEach((el) => {
      if (el.classList.contains("dis")) return;
      el.onclick = () => tripCard(v, list[+el.dataset.trip]);
    });
  }

  function tripCard(v, x) {
    const K = KIND[v.kind] || KIND.planes;
    const cost = costOf(v, x.d);
    jCard({
      tag: K.short, iconSrc: `flags/${x.c}.png`, title: `${cname(x.c)}`, close: () => openTrips(v),
      lead: `A short vacation in ${esc(ccity(x.c))}, ${esc(cname(x.c))}. You ${K.verb.toLowerCase()} there yourself in your ${esc(v.name)}.`,
      rows: [["Distance", `${x.d} km`], ["Fuel and fees", usdf(cost)], ["Vacation this year", state.vacationAt === state.age ? "Already taken" : "Available"], ["Bank", usdf(state.money)]],
      choices: [
        ["Pick who comes along", () => go(v, x, cost)],
        ["Back", () => openTrips(v), "gray"],
      ],
    });
  }

  function go(v, x, cost) {
    const K = KIND[v.kind] || KIND.planes;
    if (state.prison) return note("Vacation", "You cannot travel from prison.", () => openTrips(v));
    if (state.age < 18) return note("Too Young", "You must be at least 18 to go on vacation.", () => openTrips(v));
    if (state.vacationAt === state.age) return note("Vacation", "You already went on vacation this year.", () => openTrips(v));
    if (state.money < cost) return note("Not enough", `You need ${usdf(cost)} for fuel and fees.`, () => openTrips(v), broke(cost));
    const place = cname(x.c);
    // sometimes the vacation has one of the game's own vacation moments (an accent joke, a phone-free day...)
    const afterVacation = () => {
      try {
        const kinds = ["accent", "disconnected"];
        const seen = (state.tripSeen ||= {});
        const ok = kinds.filter((k) => !seen[k] || state.age - seen[k] >= 8);
        if (ok.length && rnd() < 0.65 && typeof tripMoment === "function") {
          const k = pick(ok);
          seen[k] = state.age;
          setTimeout(() => tripMoment(k, { c: x.c, name: place }), 150);
        }
      } catch (e) {
        warn("vacation moment", e);
      }
      openGarage();
    };
    const V = {
      name: v.name, img: v.img, tag: K.short, verb: K.verb, past: `flew to ${place} on vacation in`, noun: K.noun, seats: Math.max(1, Number(v.cap) || 2), group: "air",
      soloLine: () => TRIP_SCENES[Math.floor(rnd() * TRIP_SCENES.length)].replace("{city}", ccity(x.c) || place),
      tripText: (names, argued) =>
        `You ${K.past} your ${esc(v.name)} to ${esc(place)} on vacation with ${names}. ${TRIP_SCENES[Math.floor(rnd() * TRIP_SCENES.length)].replace("{city}", ccity(x.c) || place)}${argued.length ? ` ${argued.join(" and ")} argued about the plans for a while, but it passed.` : ""}`,
    };
    pickCompany(V, (group) => {
      state.money -= cost;
      v.used = state.age;
      state.vacationAt = state.age; // it counts as this year's vacation (the Activities -> Vacation one)
      v.cond = Math.max(0, (Number(v.cond) || 100) - ri(1, 4));
      const vis = (state.visited ||= []);
      if (!vis.includes(x.c)) vis.push(x.c);
      (state.trips ||= []).push({ y: state.age, to: x.c, by: v.name });
      try {
        fx({ Happiness: ri(2, 5), Health: ri(0, 3) }, "");
      } catch {}
      let mishap = "";
      if (rnd() < 0.12) {
        const tot = MISHAPS.reduce((s2, m) => s2 + m.w, 0);
        let r = rnd() * tot, k = MISHAPS[0].k;
        for (const m of MISHAPS) {
          r -= m.w;
          if (r <= 0) {
            k = m.k;
            break;
          }
        }
        if (k === "weather") {
          const extra = Math.round(ri(500, 4000) * inflK());
          state.money = Math.max(0, state.money - extra);
          v.cond = Math.max(0, v.cond - 4);
          mishap = ` Bad weather forced a diversion and an extra ${usdf(extra)} in fuel.`;
        } else if (k === "customs") {
          const fine = Math.round(ri(300, 2500) * inflK());
          state.money = Math.max(0, state.money - fine);
          mishap = ` A long customs check and a ${usdf(fine)} handling fee.`;
        } else {
          v.cond = Math.max(0, v.cond - 10);
          mishap = " An engine warning light came on over the water. Everything was fine, but it needs a check.";
        }
      }
      finishOuting(V, group, (t, m, rows) => {
        refresh();
        note(`Vacation in ${place}`, `${m}${mishap}`, afterVacation, `${rows}<div class="brk"><div><b>Fuel and fees:</b> ${usdf(cost)}</div><div><b>Countries visited:</b> ${(state.visited || []).length}</div></div>`);
      });
    });
  }

  // ------------------------------------------------------------------ the vehicle menu (same activities as a car)
  function openVehicle(v) {
    if (!v || !fleet().includes(v)) return openGarage();
    const K = KIND[v.kind] || KIND.boats;
    const row = (icon, t, s, id, locked) =>
      `<div class="row${locked ? " dis locked" : ""}" data-va="${id}"><img src="${icon}"><div class="t"><b>${t}</b><span>${s}</span></div>${locked ? "" : dots()}</div>`;
    const html =
      `<div class="row" data-va="view"><img src="${v.img}" style="object-fit:contain"><div class="t"><b>${esc(v.name)}</b><span>View your ${age(v) === 0 ? "brand new" : `${age(v)}-year old`} ${K.noun}</span></div>${dots()}</div>` +
      row("cars/ui-sign-litter.png", "Abandon", "Leave it somewhere", "abandon") +
      row("cars/ui-drive-car.png", K.verb, K.out, "drive") +
      row("cars/ui-tire.png", "Garage", "See all your vehicles", "garage") +
      row("cars/ui-gift.png", "Gift", "Give it to someone", "gift") +
      row("cars/ui-mechanic.png", "Maintenance", "Schedule maintenance", "fix") +
      row("cars/ui-money-bag.png", "Pay Off", "Pay off your loan", "payoff", !v.loanYears) +
      row("cars/ui-tools.png", "Repair", "Repair it", "repair") +
      row("cars/ui-hand-waving.png", "Sell", "Sell it", "sell") +
      (v.kind === "islands" ? "" : row("cars/ui-magnet.png", "Scrap", "Scrap it", "scrap"));
    openScreen(K.short.toUpperCase(), openGarage, html);
    const done = (t, m, l) => {
      if (l) logLine(l);
      refresh();
      note(t, m, openGarage);
    };
    sList.querySelectorAll("[data-va]").forEach((el) => {
      el.onclick = () => {
        if (el.classList.contains("locked")) return;
        const a = el.dataset.va;
        if (a === "view") return viewCard(v);
        if (a === "garage") return openGarage();
        if (a === "sell") return sellCard(v);
        if (a === "abandon") {
          removeV(v);
          return done("Abandoned", `You ${K.gone}: your ${esc(v.name)} is gone.`, `I abandoned my ${v.name}.`);
        }
        if (a === "drive") {
          if (state.age < 16) return note("Too young", `You are too young to ${K.verb.toLowerCase()} a ${K.noun}.`);
          if (K.lic && window.FL_LICENSES && !FL_LICENSES.has(K.lic)) return FL_LICENSES.need(K.lic);
          if (v.used === state.age) return note(K.verb, `You already took your ${esc(v.name)} out this year.`);
          const lines = { islands: ["You walked the beach at sunrise and had the whole island to yourself.", "A day of swimming off the dock, a long lunch under the palms and not one phone call.", "You watched the sun go down from your own private shore."], sportbikes: ["The engine screamed through every gear.", "You leaned into every corner and grinned the whole way.", "You blasted down the highway with the sun going down."], boats: ["The water was glass and the wind was perfect.", "You cut across the bay and left a long white wake.", "You dropped anchor and watched the sunset."], planes: ["The city looked like a toy from up there.", "You flew above the clouds and the whole world went quiet.", "A smooth landing, applause from the ground crew."], helicopters: ["You hovered over the skyline and watched it glitter.", "You skimmed the coast and waved at the beaches.", "The city came and went below the rotors."] };
          const V = { name: v.name, img: v.img, tag: K.short, verb: K.verb, past: K.past, noun: K.noun, seats: Math.max(1, Number(v.cap) || 2), group: groupOf(v.kind), soloLine: () => (v.kind === "islands" ? `You spent the day on ${esc(v.name)}. ${pick(lines.islands)}` : `You took your ${esc(v.name)} out. ${pick(lines[v.kind] || lines.boats)}`), ...(v.kind === "islands" ? { tripText: (who) => `You spent the day on ${esc(v.name)} with ${who}. Sand, sun and nobody else around.` } : {}) };
          const goLocal = () =>
            pickCompany(V, (group) => {
              v.used = state.age;
              v.cond = Math.max(0, (Number(v.cond) || 100) - ri(0, v.kind === "planes" || v.kind === "helicopters" ? 3 : 2));
              finishOuting(V, group, (t, m, rows) => {
                refresh();
                note(t, m, openGarage, rows);
              });
            });
          if (v.kind === "planes" || v.kind === "helicopters")
            return jCard({
              tag: K.short, iconSrc: v.img, title: `${K.verb}: where to?`, close: true,
              lead: "Stay local, or go on a short vacation to a country close to yours.",
              choices: [["Local flight", goLocal], ["Short vacation abroad", () => openTrips(v)], ["Cancel", () => openVehicle(v), "gray"]],
            });
          return goLocal();
        }
        if (a === "gift") {
          const who = (typeof victims === "function" ? victims() : []).filter((x) => x.age >= 16).slice(0, 4);
          if (!who.length) return note("Gift", `There is nobody to give your ${K.noun} to.`);
          return jCard({
            tag: K.short, iconSrc: v.img, title: "Gift", close: true,
            lead: `Who will you give your ${esc(v.name)} to?`,
            choices: who.map((x) => [
              `${x.name.split(" ")[0]} (${x.title})`,
              () => {
                removeV(v);
                done("Generous", `You gave your ${esc(v.name)} to ${x.rel}, ${x.name.split(" ")[0]}. ${x.g === "f" ? "She" : "He"} loved it!`, `I gave my ${v.name} to ${x.rel.replace("your ", "my ")}, ${x.name.split(" ")[0]}.`);
              },
            ]),
          });
        }
        if (a === "fix") {
          const c = Math.max(150, Math.round(0.02 * base(v)));
          if ((Number(v.cond) || 0) >= 100) return note("Maintenance", `Your ${esc(v.name)} is already in perfect condition.`);
          if (state.money < c) return note("Not enough", `You need ${usdf(c)} to get your ${esc(v.name)} serviced.`, null, broke(c));
          state.money -= c;
          v.cond = Math.min(100, (Number(v.cond) || 0) + ri(10, 20));
          return done("Maintenance", `The mechanics serviced your ${esc(v.name)} for ${usdf(c)}.`, `I paid ${usdf(c)} to get my ${v.name} serviced.`);
        }
        if (a === "repair") {
          const c = Math.max(400, Math.round((base(v) * (100 - (Number(v.cond) || 0))) / 1000));
          if ((Number(v.cond) || 0) >= 100) return note("Repair", `Your ${esc(v.name)} doesn't need any repairs.`);
          if (state.money < c) return note("Not enough", `You need ${usdf(c)} to repair your ${esc(v.name)}.`, null, broke(c));
          state.money -= c;
          v.cond = 100;
          return done("Good as new", `The workshop fully repaired your ${esc(v.name)} for ${usdf(c)}.`, `I paid ${usdf(c)} to repair my ${v.name}.`);
        }
        if (a === "scrap") {
          const go = () => {
            const t = Math.max(100, 10 * Math.round((0.08 * evalue(v)) / 10));
            removeV(v);
            state.money += t;
            done("Scrapped", `The scrapyard paid you ${usdf(t)} for your ${esc(v.name)}.`, `I scrapped my ${v.name} for ${usdf(t)}.`);
          };
          return typeof iosConfirm === "function" ? iosConfirm("Scrap it", `Scrap your ${esc(v.name)} for parts?`, go) : go();
        }
      };
    });
  }

  function viewCard(v) {
    const K = KIND[v.kind] || KIND.boats;
    jCard({
      tag: K.short, iconSrc: v.img, title: v.name, close: () => openVehicle(v),
      lead: v.desc || `Your ${K.noun}.`,
      rows: [
        ["Estimated value", usdf(evalue(v))],
        ["Top speed", v.speed || "-"],
        ["Capacity", `${v.cap || "-"} people`],
        ["Yearly upkeep", usdf(v.upkeep || 0)],
        ["Owned for", age(v) ? `${age(v)} year${age(v) === 1 ? "" : "s"}` : "Just bought"],
        ["Last used", v.used >= 0 ? `Age ${v.used}` : "Never"],
      ],
      bars: [["Condition", cl(Math.round(v.cond), 1, 100)]],
      choices: [["Close", () => openVehicle(v)]],
    });
  }

  // ------------------------------------------------------------------ selling, like the cars: dealer, ad with offers, black market
  function sellCard(v) {
    const K = KIND[v.kind] || KIND.boats;
    const val = evalue(v);
    const dealer = 10 * Math.round((val * 0.85) / 10);
    const prices = [0.95, 1.05, 1.2, 1.35].map((f) => 10 * Math.round((val * f) / 10));
    const sold = (amt, who, ad) => {
      removeV(v);
      state.money += amt;
      refresh();
      try {
        chaChing();
      } catch {}
      logLine(`I sold my ${v.name} ${who} for ${usdf(amt)}.`);
      note("Done deal", `You sold your ${esc(v.name)} ${who} for ${usdf(amt)}.`, openGarage);
    };
    const ad = (price) => {
      const ratio = price / val;
      logLine(`I posted an ad to sell my ${v.name} for ${usdf(price)}.`);
      if (rnd() >= cl(1.45 - ratio, 0.08, 0.95)) return note("No bites", `Nobody responded to your ad for the ${esc(v.name)}${ratio > 1.15 ? `. ${usdf(price)} might be too much` : ""}.`, () => openVehicle(v));
      if (rnd() < 0.3 / Math.max(0.6, ratio)) return sold(price, `to a ${pick(["collector", "businessman", "weekend sailor", "retired captain", "young investor"])}`);
      const offer = 100 * Math.round((price * (0.72 + 0.2 * rnd())) / 100);
      jCard({
        tag: K.short, iconSrc: v.img, title: "Offer", surprise: true,
        lead: `A buyer has offered you ${usdf(offer)} for your ${esc(v.name)}.<br><br>What will you do?`,
        rows: [["Offer", usdf(offer)], ["List Price", usdf(price)]],
        choices: [["Take the offer", () => sold(offer, "to a buyer")], ["Decline", () => openVehicle(v)]],
      });
    };
    jCard({
      tag: K.short, iconSrc: v.img, title: "Sell", close: () => openVehicle(v),
      lead: `How do you want to sell your ${esc(v.name)}?`,
      rows: [["Estimated value", usdf(val)]],
      choices: [
        [`Dealer trade-in: ${usdf(dealer)}`, () => sold(dealer, "to a dealer")],
        ...prices.map((p) => [`Post an ad: ${usdf(p)}`, () => ad(p)]),
        [`Black market (~${usdf(Math.round(val * 0.45))})`, () => sold(10 * Math.round((val * (0.35 + 0.25 * rnd())) / 10), "on the black market")],
      ],
    });
  }

  // ------------------------------------------------------------------ wiring
  function tidyAssets() {
    // the cars no longer sit loose in Assets, and the elite-life row is replaced by the Garage row
    sList.querySelectorAll("[data-car]").forEach((el) => el.remove());
    const secs = [...sList.querySelectorAll(".sec")];
    const vehSec = secs.find((s) => s.textContent.trim() === "Vehicles");
    const eliteSec = secs.find((s) => s.textContent.trim() === "Garage, Marina & Hangar");
    const eliteRow = document.getElementById("eliteAssetsRow");
    if (eliteRow) eliteRow.remove();
    if (eliteSec) eliteSec.remove();
    const c = counts();
    const total = c.cars + c.bikes + c.marina + c.hangar;
    const html =
      `<div class="sec" id="flGarageSec">Garage</div><div class="row" id="flGarageRow"><img src="cars/ui-tire.png" alt=""><div class="t"><b>Garage</b><span>${total ? `${c.cars} car${c.cars === 1 ? "" : "s"} · ${c.bikes} motorcycle${c.bikes === 1 ? "" : "s"} · ${c.marina} boat${c.marina === 1 ? "" : "s"} · ${c.hangar} aircraft` : "Cars, motorcycles, boats and aircraft"}</span></div>${chev()}</div>`;
    if (vehSec) {
      vehSec.insertAdjacentHTML("beforebegin", html);
      vehSec.remove();
    } else {
      const misc = [...sList.querySelectorAll(".sec")].find((s) => s.textContent.trim() === "Misc.");
      if (misc) misc.insertAdjacentHTML("beforebegin", html);
      else sList.insertAdjacentHTML("beforeend", html);
    }
    const r = document.getElementById("flGarageRow");
    if (r)
      r.onclick = () => {
        try {
          play("choice");
        } catch {}
        openGarage();
      };
    // BitLife-style "Race Car Garage" placeholder row
    const soon = sList.querySelector('[data-soon="Race Car Garage"]');
    if (soon) {
      soon.removeAttribute("data-soon");
      soon.querySelector(".seal")?.remove();
      const sp = soon.querySelector("span");
      if (sp) sp.textContent = "Cars, motorcycles, boats and aircraft";
      soon.onclick = () => openGarage();
    }
  }

  function boot() {
    if (typeof state === "undefined" || typeof openAssets !== "function" || typeof openCar !== "function" || typeof jCard !== "function" || typeof sList === "undefined") return setTimeout(boot, 150);
    const origAssets = window.openAssets;
    window.openAssets = function () {
      const r = origAssets.apply(this, arguments);
      try {
        if (sTitle.textContent === "ASSETS" && !(typeof isOldEra === "function" && isOldEra())) tidyAssets();
      } catch (e) {
        warn("assets", e);
      }
      return r;
    };
    const origCar = window.openCar;
    window.openCar = function () {
      const r = origCar.apply(this, arguments);
      try {
        const g = sList.querySelector('[data-ca="garage"]');
        if (g) {
          g.querySelector(".seal")?.remove();
          const sp = g.querySelector("span");
          if (sp) sp.textContent = "See all your vehicles";
          g.onclick = () => openGarage();
        }
        sBack.onclick = () => openGarage();
        // Drive a car with someone in the next seat
        const e = arguments[0];
        const dr = sList.querySelector('[data-ca="drive"]');
        if (dr && e && !dr.classList.contains("dis")) {
          const sp = dr.querySelector("span");
          if (sp) sp.textContent = "Take it out, alone or with someone";
          dr.onclick = () => {
            if (!(state.license || e.stolen)) return typeof drivingLicenseCard === "function" ? drivingLicenseCard() : note("Drive", "You need a driving license.");
            if (e.driven === state.age) return note("Drive", `You already took your ${esc(e.make)} ${esc(e.model)} for a drive this year.`);
            const nm = `${e.make} ${e.model}`;
            const V = { name: nm, img: typeof carImg === "function" ? carImg(e) : "", tag: "Car", verb: "Drive", past: "drove", noun: "car", seats: seatsOfCar(e), group: "car", soloLine: () => `You took your ${esc(nm)} out for a spin. ${pick(["The open road felt amazing.", "You blasted your favorite songs the whole way.", "You cruised around town with the windows down."])}` };
            pickCompany(V, (group) => {
              e.driven = state.age;
              e.cond = Math.max(0, e.cond - ri(0, 2));
              try {
                honk();
              } catch {}
              finishOuting(V, group, (t, m, rows) => {
                screen.classList.remove("open");
                refresh();
                note(t, m, null, rows);
              });
            });
          };
        }
      } catch (e) {
        warn("car", e);
      }
      return r;
    };
    // the flat elite-life list now points at the garage too
    if (window.FL_ELITE_LIFE && typeof FL_ELITE_LIFE === "object") FL_ELITE_LIFE.openOwned = openGarage;
    console.log("[garage] loaded");
  }

  window.FL_GARAGE = { open: openGarage, vehicle: openVehicle, trips: openTrips, nearby: nearbyCountries, km, sections: () => SECTIONS.map((s) => ({ id: s.id, n: s.id === "cars" ? (state.cars || []).length : inSection(s).length })) };
  boot();
})();
