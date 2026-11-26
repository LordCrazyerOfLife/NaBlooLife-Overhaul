/* NaBlooLife Mod Loader — adaptado para los mods de NaBlooLife.
 *
 * Instalación: copiar este archivo a la raíz del juego (junto a game.html). NaBlooLife
 * lo inyecta solo desde game.html cuando el Mod Loader está activo; en builds viejos
 * también se puede agregar <script src="modloader.js?v=17"></script> después de mods.js.
 * No hace falta ningún código de 8 dígitos: los mods se cargan solos y se pueden apagar
 * desde Settings → Mod Loader.
 *
 * Cada entrada de MODS es { id, name, icon, src, desc, deps? }. `deps` se inyecta
 * antes que `src` (el ajedrez necesita motor, puzzles y eventos). Para sumar un mod
 * nuevo basta con agregar otra entrada: no hay que tocar game.html.
 *
 * Compatible con el mods.js de NaBlooLife: si ese loader ya cargó este archivo, la
 * segunda ejecución sale por el guard de window.MOD_LOADER y no duplica nada.
 */
(() => {
  "use strict";

  if (window.MOD_LOADER) return;

  const MODS = [
    {
      id: "black-market",
      name: "Black Market",
      icon: "blackmarket/bm-07-oni-mask.png",
      src: "blackmarket.js?v=1",
      desc: "Activities, Black Market (18+): an Antique Peddler, Arms Dealer, Art Thief and Jewel Fencer sell katanas, watches, chains, crowns, masks and more. Dealers have an attitude (prices, haggling), goods can be fakes until you pay for an appraisal, you can sell to a fence, and the police can raid you.",
    },
    {
      id: "rich-life",
      name: "Rich Life",
      icon: "emoji/1f4b8.png",
      src: "rich-life.js?v=2",
      desc: "What comes with money: family and friends asking for loans (say no and they get angry), paparazzi headlines when you buy a mansion or a supercar, scams and break-ins, police heat, fans and critics, and a yearly tax season with audits if you cheat.",
    },
    {
      id: "chess-career",
      name: "Chess Career",
      icon: "emoji/265f-fe0f.png",
      src: "chess.js?v=6",
      deps: ["chess-engine.js?v=2", "chess-puzzles.js?v=2", "chess-events.js?v=2"],
      desc: "Play chess from childhood to the World Championship: FIDE rating, titles from CM to GM, norms, tournaments, coaches, lessons, puzzles and the Pawnder site. Find it in Occupation, Special Careers.",
    },
    {
      id: "gang-bang",
      name: "Gang Bang",
      icon: "special/gangbang.png",
      src: "gang.js?v=12",
      desc: "Join a street gang, rise from Prospect to Boss, hustle, fight for turf and keep the police heat down. Find it in Occupation, Special Careers.",
    },
    {
      id: "drift-boy",
      name: "Drift Boy",
      icon: "emoji/1f3ce-fe0f.png",
      src: "drift.js?v=2",
      desc: "A new special career: from illegal street runs to the pro league. Tandem battles (you lead, you chase, the judges score Angle, Speed and Line), tuning, a mechanic who may scam you, sponsors, a team and trips to Tokyo, Hakone and Fuji. Find it in Occupation, Special Careers.",
    },
    {
      id: "jdm-mods",
      name: "JDM Mods",
      icon: "cars/jdm-13.png",
      src: "jdmmods.js?v=2",
      deps: ["jdmmods-data.js?v=1"],
      desc: "A new Shopping store: drift cars (60 JDM models, new and used, a new random selection every year) and 105 performance parts. Parts add rating that Drift Boy counts; a roll cage and a harness make crashes cheaper. Find it in Shopping.",
    },
    {
      id: "femboy",
      name: "Femboy Journey",
      icon: "emoji/1f485.png",
      src: "femboy.js?v=2",
      desc: "Help an adult male friend explore his feminine side: clothes, a new name, coming out, transition, and a few very direct attempts to seduce you. Find it on an adult male friend in Relationships.",
    },
    {
      id: "special-life",
      name: "Special Life: Racer, Judge & Artist",
      icon: "emoji/1f3ce-fe0f.png",
      src: "special-life.js?v=3",
      desc: "Three special careers: illegal street racer with nationwide police heat and an underground exotic-car auction, judge with evidence, sentences, bribes and revenge, and artist with a real drawing canvas whose pieces persist in localStorage.",
    },
    {
      id: "political-career",
      name: "Political Career",
      icon: "special/politician.png",
      src: "politician.js?v=5",
      desc: "Run for office from School Board to President: ranks, powers, campaigns, elections and scandals. Find it in Occupation, Special Careers.",
    },
    {
      id: "cheat",
      name: "Cheat Menu",
      icon: "emoji/1f4b0.png",
      src: "cheat.js?v=1",
      desc: "Adds a small draggable button floating on screen. Tap it to open a panel of cheats: add money, set cash to $0, max or min all four stats, full heal, and age up on demand.",
    },
    {
      id: "displayfix",
      name: "Display Fix (Scale + Safe Area)",
      icon: "emoji/1f4cf.png",
      src: "displayfix.js?v=1",
      desc: "Shrinks the whole phone screen down (default 85%, edit --ui-scale in game.html's style block to adjust). Turning this off takes effect the next time NaBlooLife loads. The notch / status-bar safe-area bar is always on now, built into the page itself.",
    },
    {
      id: "nk",
      name: "North Korea Events",
      icon: "emoji/1f575-fe0f.png",
      src: "nk.js?v=1",
      desc: "Country-specific life events for characters born in North Korea: a songbun social class at birth, food rationing, mandatory ideology sessions, the risk of being reported by an informant, and a rare, high-risk chance to attempt leaving the country. Only activates when your country is North Korea.",
    },
    {
      id: "football-career",
      name: "Football Career",
      icon: "emoji/26bd.png",
      src: "futbol.js?v=32",
      deps: ["futbol-data.js?v=1", "futbol-events.js?v=2", "futbol-events-life.js?v=2"],
      desc: "A full BitLife-style football life: high-school team, academy, first team, league/cup/continental/national-team competitions, key match decisions, transfers, loans, contracts and a permanent trophy cabinet. Find it in Occupation, Special Careers.",
    },
    {
      id: "auction-house",
      name: "Auction House",
      icon: "emoji/1f528.png",
      src: "auctions.js?v=3",
      desc: "Auctions at the end of Shopping: a new catalogue every year with collectible hypercars, exotic cars, watches and chains. Bid live against named rivals with private limits and memories, jump-bid to scare them off, and pay a 10% buyer's premium when you win.",
    },
    {
      id: "licenses",
      name: "Licenses",
      icon: "cars/ui-license.png",
      src: "licenses.js?v=2",
      desc: "License Office in Activities: car, motorcycle, commercial (CDL), boat, private pilot, helicopter and firearm licenses, each with a written exam and a practical test. They unlock sport bikes, boats, planes, helicopters, legal guns and driver jobs.",
    },
    {
      id: "mental-health",
      name: "Mental Health",
      icon: "emoji/1f9e0.png",
      src: "mentalhealth.js?v=7",
      desc: "A serious mental-health layer: depression, anxiety, ADHD, bipolar disorder and PTSD with hidden symptoms, evaluation, therapy, medication with side effects, and real effects on stats, work and relationships. Military combat can cause PTSD. Also adds a sadistic streak as a personality trait (not a disorder) that ties into Melon and Infamous Killers. Find it in Activities.",
    },
    {
      id: "nba-career",
      name: "NBA Career",
      icon: "bball/ball.png",
      src: "nba.js?v=5",
      deps: ["nba-data.js?v=1"],
      desc: "A full NBA life with all 30 teams, coaches, rosters and logos: high school, college offers, the draft lottery, rookie scale and free-agent contracts, playoffs, awards (All-Star, All-NBA, MVP, DPOY, ROY, Finals MVP), sneaker deals, trades, injuries, 25+ events, retirement and the Hall of Fame. Find it in Occupation, Special Careers, Pro Athlete.",
    },
    {
      id: "zookeeper",
      name: "Zookeeper",
      icon: "emoji/1f981.png",
      src: "zoo.js?v=4",
      desc: "A zoo career from volunteer to director: care for named animals, run shows, breed viral babies, and handle escapes, bites, a child in the gorilla enclosure, activists and inspections. Dark side: animal trafficking, a private big-cat collection and budget cuts. Also exotic pets at home, plus your own zoo: Assets, Zoo. Buy every species (with its art), build enclosures, set staff and tickets, breed viral babies. The career is in Occupation, Special Careers.",
    },
  ];

  // ---------------------------------------------------------------- on/off por mod
  const STORE_KEY = "modloader-enabled";
  const readState = () => {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      return s && typeof s === "object" ? s : {};
    } catch {
      return {};
    }
  };
  const writeState = (s) => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(s));
    } catch {}
  };
  const isOn = (m) => {
    const s = readState();
    if (typeof s[m.id] === "boolean") return s[m.id];
    if (typeof s[m.src] === "boolean") return s[m.src]; // formato viejo, por src
    return true; // por defecto: encendido
  };
  const setOn = (m, on) => {
    const s = readState();
    (s[m.id] = on), writeState(s);
  };

  // ---------------------------------------------------------------- carga de scripts
  const loaded = new Set();
  const order = [];
  function inject(src) {
    if (!src || loaded.has(src)) return;
    loaded.add(src);
    order.push(src);
    try {
      const s = document.createElement("script");
      (s.src = src), (s.async = !1), document.head.append(s);
      console.log(`[modloader] loaded "${src}"`);
    } catch (e) {
      console.warn("[modloader] failed to load", src, e);
    }
  }
  function loadOne(m) {
    if (!m || !m.src || !isOn(m)) return false;
    (m.deps || []).forEach(inject);
    inject(m.src);
    return true;
  }
  const loadAll = () => MODS.forEach(loadOne);

  // ---------------------------------------------------------------- filas con alto flexible
  (() => {
    const css = document.createElement("style");
    css.textContent =
      "[data-ml]{height:auto;min-height:76px;padding:10px 14px;align-items:flex-start}" +
      "[data-ml] img{margin-top:2px}" +
      "[data-ml] .ck{margin-top:2px}";
    document.head.append(css);
  })();

  // ---------------------------------------------------------------- pantalla del loader (standalone, no toca el Workshop)
  const scriptName = (src) => String(src || "").split("?")[0].split("/").pop();
  const PORTED = "bitlifepp-ported";
  const portedList = () => {
    try {
      return window.BL_MODS && BL_MODS.read ? BL_MODS.read() : [];
    } catch {
      return [];
    }
  };
  const savePorted = (list) => {
    try {
      localStorage.setItem(PORTED, JSON.stringify(list));
    } catch {}
  };
  const registryMods = () => {
    const reg = (window.BL_MODS && BL_MODS.REGISTRY) || {};
    const mine = new Set(MODS.flatMap((m) => [scriptName(m.src), ...(m.deps || []).map(scriptName)]));
    return Object.entries(reg)
      .filter(([code, d]) => d && d.src && code !== "11111111" && !mine.has(scriptName(d.src)))
      .map(([code, d]) => ({ code, ...d }));
  };

  function openModLoader() {
    typeof play === "function" && play("choice");
    sList.innerHTML = "";
    (sTitle.textContent = "MOD LOADER"), (sSub.style.display = "none");
    (sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;"),
      (sBack.onclick = () => (typeof openMainMenu === "function" ? openMainMenu() : screen.classList.remove("open")));

    const ported = portedList();
    const row = (attr, m, on) =>
      `<div class="row" ${attr}><img src="${m.icon || "ui/gear.png"}" style="object-fit:contain"><div class="t"><b>${m.name || m.src}</b>` +
      `<span>${on ? "Enabled" : "Disabled"}${m.desc ? ` · ${m.desc}` : ""}</span></div>` +
      `<img class="ck" src="${modBox(on)}"></div>`;
    const reg = registryMods();
    sList.innerHTML =
      '<div class="mm-foot" style="padding:8px 14px; text-align:left">Toggle mods on or off. Script mods apply the next time NaBlooLife loads.</div>' +
      (MODS.length ? '<div class="sec">Mod Loader</div>' + MODS.map((m) => row(`data-ml="${m.id}" data-mlr="1"`, m, isOn(m))).join("") : "") +
      (reg.length
        ? '<div class="sec">Special careers &amp; extras</div>' +
          reg.map((m) => row(`data-rc="${m.code}" data-mlr="1"`, m, !!ported.find((x) => x.code === m.code && x.on))).join("")
        : "");
    const click = (el, fn) =>
      (el.onclick = () => {
        typeof play === "function" && play("choice");
        fn();
      });

    sList.querySelectorAll("[data-ml]").forEach((el) => {
      click(el, () => {
        const m = MODS.find((x) => x.id === el.dataset.ml),
          nowOn = !isOn(m);
        setOn(m, nowOn);
        el.querySelector(".ck").src = modBox(nowOn);
        const sub = el.querySelector(".t span");
        if (sub) sub.textContent = `${nowOn ? "Enabled" : "Disabled"}${m.desc ? ` · ${m.desc}` : ""}`;
        if (nowOn) loadOne(m); // load it right now
        typeof notice === "function" &&
          notice(
            nowOn ? "Mod Enabled" : "Mod Disabled",
            `${m.name || m.src} ${nowOn ? "is loaded now" : "will be skipped the next time NaBlooLife loads"}.`,
            null,
            !0,
          );
      });
    });
    sList.querySelectorAll("[data-rc]").forEach((el) => {
      click(el, () => {
        const code = el.dataset.rc,
          list = portedList(),
          m = reg.find((x) => x.code === code);
        let it = list.find((x) => x.code === code);
        if (!it) {
          it = { code, on: true };
          list.push(it);
        } else it.on = !it.on;
        savePorted(list);
        if (it.on && window.BL_MODS && BL_MODS.load) BL_MODS.load(code);
        el.querySelector(".ck").src = modBox(it.on);
        const sub = el.querySelector(".t span");
        if (sub) sub.textContent = `${it.on ? "Enabled" : "Disabled"}${m && m.desc ? ` · ${m.desc}` : ""}`;
        typeof notice === "function" &&
          notice(
            it.on ? "Mod Enabled" : "Mod Disabled",
            `${(m && m.name) || code} ${it.on ? "is loaded now" : "will be off the next time NaBlooLife loads"}.`,
            null,
            !0,
          );
      });
    });
    sList.scrollTop = 0;
  }

  // ---------------------------------------------------------------- menú principal + arranque
  let hooked = false;
  function hookMenu() {
    if (hooked) return;
    hooked = true;
    const orig = openMainMenu;
    openMainMenu = function () {
      const r = orig.apply(this, arguments);
      try {
        if (document.getElementById("mlRow")) return r;
        sList.insertAdjacentHTML(
          "afterbegin",
          '<div class="sec">Mods</div><div class="row" id="mlRow"><img src="ui/gear.png">' +
            '<div class="t"><b>Mod Loader</b><span>Enable or disable installed mods</span></div>' +
            (typeof CHEV !== "undefined" ? CHEV : "") +
            "</div>",
        );
        document.getElementById("mlRow").onclick = openModLoader;
      } catch (e) {
        console.warn("[modloader] menu", e);
      }
      return r;
    };
  }

  function ready() {
    return (
      typeof openMainMenu === "function" &&
      typeof sList !== "undefined" &&
      !!sList &&
      typeof modBox === "function" &&
      !!document.querySelector(".phone")
    );
  }
  function boot() {
    if (!ready()) return setTimeout(boot, 60);
    // the Workshop's own switch still decides whether the Mods row shows up in the Main Menu
    const allowed = typeof mods === "undefined" || !mods || mods.modLoader !== false;
    if (allowed) hookMenu();
    loadAll();
  }

  window.MOD_LOADER = {
    MODS,
    load: loadOne,
    reload: loadAll,
    open: openModLoader,
    loaded: () => order.slice(),
    isOn,
    setOn,
  };
  boot();
})();
