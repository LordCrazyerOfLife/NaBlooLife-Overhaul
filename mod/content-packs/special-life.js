/* [mod] Special Life: Illegal Street Racer, Judge y Artist para NaBlooLife.
 *
 * Se carga desde modloader.js y se engancha a Occupation -> Special Careers.
 * No modifica game.html: usa state (JSON por vida), jCard/notice y los coches
 * que el jugador ya compró. Las obras de arte se guardan en localStorage.
 */
(() => {
  "use strict";

  if (window.FL_SPECIAL_LIFE || window.__FL_SPECIAL_LOADING) return;
  window.__FL_SPECIAL_LOADING = true;

  const ICON = {
    race: "emoji/1f3ce-fe0f.png",
    judge: "emoji/2696-fe0f.png",
    art: "emoji/1f3a8.png",
    car: "emoji/1f697.png",
    heat: "emoji/1f46e.png",
    money: "emoji/1f4b0.png",
    gavel: "emoji/1f528.png",
    paint: "emoji/1f58d-fe0f.png",
  };
  const ART_KEY = "fl-art-gallery-v1";
  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const esc = (s) =>
    String(s ?? "").replace(/[&<>\"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;", "'": "&#39;" })[c]);
  const ip = (n) => Math.round(n * (typeof window.inflFx === "function" ? window.inflFx() : 1));
  const money = (n) =>
    typeof usd === "function" ? usd(Math.round(n)) : "$" + Math.round(n).toLocaleString("en-US");
  const back = (fn) => (typeof fn === "function" ? fn : () => window.openSpecialCareers());
  const chev = () => (typeof CHEV !== "undefined" ? CHEV : "");
  const backIcon = () => (typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;");
  const row = (id, icon, title, sub, dis, tail) =>
    `<div class="row${dis ? " dis" : ""}" id="${id}"><img src="${icon}" alt=""><div class="t"><b>${esc(title)}</b><span>${esc(sub)}</span></div>${dis ? "" : tail === undefined ? chev() : tail}</div>`;
  const section = (t) => `<div class="sec">${esc(t)}</div>`;
  const tap = (id, fn) => {
    const el = document.getElementById(id);
    if (el && !el.classList.contains("dis"))
      el.onclick = () => {
        if (typeof play === "function") play("choice");
        fn();
      };
  };
  const openScreen = (title, fn) => {
    if (typeof screen === "undefined" || typeof sList === "undefined" || typeof sTitle === "undefined") return false;
    if (state.prison) {
      if (typeof notice === "function") notice("Not available", "You can't do that from prison.", null, true);
      return false;
    }
    screen.classList.add("open");
    sTitle.textContent = String(title).toUpperCase();
    sSub.style.display = "none";
    sBack.innerHTML = backIcon();
    sBack.onclick = back(fn);
    sList.scrollTop = 0;
    return true;
  };
  const setJob = (job) => {
    state.job = {
      ...(job || {}),
      kind: "special",
      yrs: Number(state.job && state.job.yrs) || 0,
      perf: Number(job && job.perf) || 50,
    };
    if (typeof renderStats === "function") renderStats();
  };
  const clearJob = (flag) => {
    if (state.job && state.job[flag]) state.job = null;
    if (typeof renderStats === "function") renderStats();
  };

  // ------------------------------------------------------------------ coches
  const carName = (c) => `${c.make || ""} ${c.model || ""}`.trim() || "Unknown car";
  const carImg = (c) =>
    c && c.sprite ? `cars/${c.sprite}.png` : `cars/${(c && c.type) || "coupe"}-${(c && c.color) || "black"}.png`;
  const carValue = (c) => Math.max(0, Number(c.price) || Number(c.base) || 0);
  const carScore = (c) => {
    if (!c) return 0;
    const v = carValue(c);
    const cond = Number(c.cond);
    return clamp(
      0.12 +
        Math.min(0.58, v / 4500000) +
        (Number.isFinite(cond) ? cond / 420 : 0.2) +
        (/exotic|super|hyper/i.test(String(c.cls || "")) ? 0.14 : 0),
      0.08,
      0.96,
    );
  };

  const EXOTICS = [
    { make: "Apex", model: "Predator", type: "coupe", color: "black", price: 1450000, sprite: "lux-valkor-tempest", cls: "Exotic" },
    { make: "Nightfall", model: "GT", type: "coupe", color: "black", price: 2100000, sprite: "lux-corsaire-nocturne-oro", cls: "Exotic" },
    { make: "Velvet", model: "Thunder", type: "coupe", color: "red", price: 2850000, sprite: "lux-ventura-scorpione", cls: "Exotic" },
    { make: "Aster", model: "Comet", type: "coupe", color: "blue", price: 980000, sprite: "lux-aeris-zephyr", cls: "Exotic" },
    { make: "Onyx", model: "Wraith", type: "coupe", color: "purple", price: 3300000, sprite: "lux-valkor-eclipse", cls: "Exotic" },
    { make: "Solaris", model: "Fulmine", type: "coupe", color: "orange", price: 1750000, sprite: "lux-ventura-fulmine", cls: "Exotic" },
  ];

  // ------------------------------------------------------------------ racing
  const RANKS = [
    { n: "Street Rookie", pay: 0, wins: 0 },
    { n: "Midnight Racer", pay: 8000, wins: 3 },
    { n: "Highway Menace", pay: 24000, wins: 8 },
    { n: "National Outlaw", pay: 65000, wins: 15 },
    { n: "Road Legend", pay: 150000, wins: 25 },
  ];
  const R = () => {
    const r = (state.racing ||= {
      active: false,
      rank: 0,
      heat: 0,
      rep: 0,
      wins: 0,
      losses: 0,
      earned: 0,
      raceYear: -1,
      layYear: -1,
      auctionYear: -1,
      auction: [],
      car: null,
      national: false,
      caught: 0,
      lastAge: -1,
    });
    if (!Array.isArray(r.auction)) r.auction = [];
    return r;
  };
  const racingCar = () => {
    const r = R();
    const cars = state.cars || [];
    return Number.isInteger(r.car) && cars[r.car] ? cars[r.car] : null;
  };
  const policeChance = (r = R()) => clamp(0.09 + r.heat / 125 + (r.national ? 0.22 : 0) + (r.rank >= 3 ? 0.05 : 0), 0.09, 0.9);
  const raceSub = () => {
    const r = R();
    if (!r.active) return "Race bought cars on the underground circuit";
    return `${RANKS[r.rank].n} · Heat ${r.heat}${r.national ? " · WANTED NATIONWIDE" : ""}`;
  };

  function openRacing() {
    if (state.age < 18)
      return typeof notice === "function" && notice("Too young", "You must be 18 to race on the street circuit.", null, true);
    const r = R();
    if (!r.active) return racingIntro();
    if (!openScreen("Illegal Street Racer", openSpecialCareers)) return;
    const car = racingCar();
    const canRace = r.raceYear !== state.age;
    const canLay = r.layYear !== state.age;
    sList.innerHTML =
      section("Career") +
      row("rcStat", ICON.race, RANKS[r.rank].n, `${r.wins} wins · ${r.losses} losses · Rep ${r.rep}`, true, "") +
      row("rcHeat", ICON.heat, r.national ? "Wanted nationwide" : "Police heat", `Heat ${r.heat}% · Police risk ${Math.round(policeChance(r) * 100)}% a year`, true, "") +
      section("This Year") +
      row("rcRace", ICON.race, canRace ? "Race" : "Already raced this year", canRace ? "Take a car to the line" : "Come back next year", !canRace) +
      row("rcCar", car ? carImg(car) : ICON.car, car ? carName(car) : "Choose a car", car ? `Condition ${Math.round(car.cond)}% · Class ${car.cls || "Street"}` : "You need a car for this", false) +
      row("rcAuction", ICON.money, "Underground auction", "Exotic cars that never touch a normal dealership", false) +
      row("rcLay", ICON.heat, canLay ? "Lay low" : "Already laid low", canLay ? "Cool the heat down" : "Come back next year", !canLay) +
      section("Danger") +
      row("rcQuit", ICON.heat, "Leave the circuit", "Walk away from the racing life", false, "");
    tap("rcRace", raceEvent);
    tap("rcCar", chooseRaceCar);
    tap("rcAuction", openAuction);
    tap("rcLay", layLow);
    tap("rcQuit", quitRacing);
  }

  function racingIntro() {
    if (!openScreen("Illegal Street Racer", openSpecialCareers)) return;
    const r = R();
    const cars = state.cars || [];
    sList.innerHTML =
      `<div class="row"><img src="${ICON.race}" alt=""><div class="t"><b>Illegal Street Racer</b><span>Run the underground circuit. The police are always listening.</span></div></div>` +
      `<div class="sec">What you need</div>` +
      row("rcStart", ICON.car, cars.length ? "Start racing" : "Find a car first", cars.length ? `${cars.length} car${cars.length === 1 ? "" : "s"} in your garage` : "Buy a car or visit the underground auction", !cars.length) +
      row("rcAuctionIntro", ICON.money, "Underground auction", "Exotic cars, no paperwork, no normal dealership", false) +
      `<div class="sec">The Rules</div><div class="row"><img src="${ICON.heat}" alt=""><div class="t"><b>Heat is everything</b><span>Win, crash, and run from the police. High heat makes them look for you nationwide.</span></div></div>`;
    tap("rcStart", startRacing);
    tap("rcAuctionIntro", openAuction);
    if (r.active) openRacing();
  }

  function startRacing() {
    if (window.FL_CAREERS && !window.FL_CAREERS.canStart("Illegal Street Racer")) return;
    const r = R();
    if (!(state.cars || []).length)
      return typeof notice === "function" && notice("No car", "You need a car before you can race.", openAuction, true);
    r.active = true;
    r.lastAge = state.age;
    if (!Number.isInteger(r.car) || !state.cars[r.car]) r.car = 0;
    setJob({ t: RANKS[r.rank].n, c: "Motorsport", emp: "Underground circuit", pay: ip(RANKS[r.rank].pay), icon: ICON.race, racing: true, perf: clamp(40 + r.rep / 4, 0, 100) });
    if (typeof say === "function") say("I joined the illegal street racing circuit.");
    openRacing();
  }

  function chooseRaceCar() {
    if (!openScreen("Choose a Car", openRacing)) return;
    const cars = state.cars || [];
    if (!cars.length) {
      sList.innerHTML = section("Garage") + row("rcAuctionEmpty", ICON.money, "No cars", "The underground auction has exotics", false);
      tap("rcAuctionEmpty", openAuction);
      return;
    }
    sList.innerHTML =
      section("Your Garage") +
      cars
        .map(
          (c, i) =>
            `<div class="row" data-rcar="${i}"><img src="${carImg(c)}" alt=""><div class="t"><b>${esc(carName(c))}</b><span>${esc(c.cls || "Street")} · ${money(carValue(c))}${c.stolen ? " · Stolen" : ""}</span></div>${chev()}</div>`,
        )
        .join("");
    sList.querySelectorAll("[data-rcar]").forEach((el) => {
      el.onclick = () => {
        if (typeof play === "function") play("choice");
        R().car = Number(el.dataset.rcar);
        openRacing();
      };
    });
  }

  function raceEvent() {
    const r = R();
    const c = racingCar();
    if (!c) return typeof notice === "function" && notice("No car", "Choose a car from your garage first.", chooseRaceCar, true);
    if (r.raceYear === state.age) return;
    r.raceYear = state.age;
    const chanceToWin = clamp(0.2 + carScore(c) * 0.55 + r.rank * 0.035 + r.rep / 900, 0.15, 0.88);
    const win = rnd() < chanceToWin;
    const purse = Math.round(ri(1800, 9000) * (1 + r.rank * 0.75) * (0.7 + carValue(c) / 900000));
    if (win) {
      r.wins++;
      r.rep = clamp(r.rep + ri(7, 14), 0, 999);
      r.heat = clamp(r.heat + ri(5, 11), 0, 100);
      r.earned += purse;
      state.money += purse;
      if (typeof renderStats === "function") renderStats();
      if (typeof say === "function") say(`I won an illegal street race in my ${carName(c)} and made ${money(purse)}.`);
      if (typeof notice === "function")
        notice("Winner", `You took the money and the pink slip story: ${money(purse)}.<br><br>Heat is now ${r.heat}%.`, maybePolice, true);
    } else {
      r.losses++;
      r.heat = clamp(r.heat + ri(3, 8), 0, 100);
      c.cond = clamp((Number(c.cond) || 100) - ri(8, 24), 1, 100);
      if (typeof say === "function") say(`I lost an illegal street race and wrecked my ${carName(c)} a little.`);
      if (typeof notice === "function")
        notice("Lost the run", `You finished behind the pack. The car took some damage.<br><br>Heat is now ${r.heat}%.`, maybePolice, true);
    }
    updateRacingRank(true);
  }

  function updateRacingRank(show) {
    const r = R();
    let next = r.rank;
    while (next + 1 < RANKS.length && r.wins >= RANKS[next + 1].wins) next++;
    if (next !== r.rank) {
      r.rank = next;
      if (state.job && state.job.racing) {
        state.job.t = RANKS[next].n;
        state.job.pay = ip(RANKS[next].pay);
      }
      if (show && typeof notice === "function")
        notice("Promoted", `You are now a ${RANKS[next].n}.`, null, true);
    }
    r.national = r.heat >= 65 || r.wins >= 12 || r.rep >= 90;
    if (state.job && state.job.racing) state.job.perf = clamp(40 + r.rep / 4, 0, 100);
  }

  function layLow() {
    const r = R();
    if (r.layYear === state.age) return;
    r.layYear = state.age;
    const before = r.heat;
    r.heat = clamp(r.heat - ri(18, 34), 0, 100);
    updateRacingRank(false);
    if (typeof notice === "function")
      notice("Laying low", `You kept the car in the garage and paid some people to forget. Heat ${before}% -> ${r.heat}%.`, openRacing, true);
  }

  function quitRacing() {
    const r = R();
    r.active = false;
    clearJob("racing");
    if (typeof say === "function") say("I walked away from illegal street racing.");
    openSpecialCareers();
  }

  function maybePolice() {
    const r = R();
    if (!r.active || state.dead || state.prison) return;
    if (rnd() >= policeChance(r)) return;
    setTimeout(policeStop, 350);
  }

  function policeStop() {
    const r = R();
    if (!r.active || state.dead || state.prison) return;
    const c = racingCar();
    const heat = r.heat;
    if (typeof jCard !== "function") return;
    jCard({
      tag: "Street Racing",
      iconSrc: ICON.heat,
      title: heat >= 65 ? "National Roadblock" : "Police Roadblock",
      lead: `A line of cruisers cuts off the highway. ${heat >= 65 ? "Your face is on every news channel in the country." : "They are looking for a car like yours."}`,
      rows: [
        ["Heat", `${heat}%`],
        ["Car", c ? carName(c) : "On foot"],
        ["Risk", `${Math.round(policeChance(r) * 100)}% this year`],
      ],
      choices: [
        [
          "Floor it",
          () => {
            const chance = clamp(0.3 + carScore(c) * 0.55, 0.25, 0.9);
            if (rnd() < chance) {
              r.heat = clamp(r.heat + 14, 0, 100);
              updateRacingRank(false);
              if (typeof notice === "function") notice("Gone", "You lost them between the exits. The heat just went up.", openRacing, true);
            } else {
              r.caught++;
              screen.classList.remove("open");
              if (typeof say === "function") say("The police caught me street racing.");
              setTimeout(() => typeof arrest === "function" && arrest("illegal street racing", [1, 4]), 80);
            }
          },
        ],
        [
          "Pull over",
          () => {
            const fine = Math.min(75000, 900 + heat * 260 + r.rank * 1800);
            state.money = Math.max(0, state.money - fine);
            r.heat = clamp(r.heat - 26, 0, 100);
            updateRacingRank(false);
            if (typeof renderStats === "function") renderStats();
            if (typeof notice === "function")
              notice("Impounded", `You paid ${money(fine)} in fines and the car was towed for a week.<br><br>Heat ${r.heat}%.`, openRacing, true);
          },
        ],
        [
          "Bribe the cop",
          () => {
            const bribe = 3500 * (r.rank + 1);
            if (state.money < bribe)
              return typeof notice === "function" && notice("No cash", `You need ${money(bribe)} for that bribe.`, null, true);
            state.money -= bribe;
            if (rnd() < clamp(0.62 - r.heat / 500, 0.2, 0.75)) {
              r.heat = clamp(r.heat - 22, 0, 100);
              updateRacingRank(false);
              if (typeof renderStats === "function") renderStats();
              if (typeof notice === "function") notice("Paid", `The envelope disappeared. So did the roadblock.<br><br>You paid ${money(bribe)}.`, openRacing, true);
            } else {
              if (typeof say === "function") say("I tried to bribe a cop during a street racing stop.");
              screen.classList.remove("open");
              setTimeout(() => typeof arrest === "function" && arrest("bribery and illegal street racing", [2, 6]), 80);
            }
          },
        ],
        [
          "Surrender",
          () => {
            screen.classList.remove("open");
            if (typeof say === "function") say("I surrendered at a police roadblock.");
            setTimeout(() => typeof arrest === "function" && arrest("illegal street racing", [1, 3]), 80);
          },
        ],
      ],
    });
  }

  function auctionStock() {
    const r = R();
    if (r.auctionYear !== state.age || !r.auction.length) {
      r.auction = [...EXOTICS].sort(() => rnd() - 0.5).slice(0, 3);
      r.auctionYear = state.age;
    }
    return r.auction;
  }

  function openAuction() {
    if (state.age < 18) return typeof notice === "function" && notice("Too young", "The auction doesn't sell to minors.", null, true);
    if (!openScreen("Underground Auction", R().active ? openRacing : racingIntro)) return;
    const stock = auctionStock();
    sList.innerHTML =
      section("No Paperwork") +
      `<div class="row"><img src="${ICON.money}" alt=""><div class="t"><b>Exotics only</b><span>These cars are not sold in any normal dealership. Cash, no questions.</span></div></div>` +
      section("On the Block") +
      stock
        .map(
          (c, i) =>
            `<div class="row" data-exotic="${i}"><img src="${carImg(c)}" alt=""><div class="t"><b>${esc(carName(c))}</b><span>${money(c.price)} · ${esc(c.cls)}</span></div>${chev()}</div>`,
        )
        .join("");
    sList.querySelectorAll("[data-exotic]").forEach((el) => {
      el.onclick = () => {
        const c = stock[Number(el.dataset.exotic)];
        buyExotic(c);
      };
    });
  }

  function buyExotic(def) {
    if (!def) return;
    if (state.money < def.price)
      return typeof notice === "function" && notice("Not enough", `You need ${money(def.price)} for the ${carName(def)}.`, null, true);
    state.money -= def.price;
    const car = {
      ...def,
      base: def.price,
      price: def.price,
      age: 0,
      cond: 100,
      expense: Math.max(25, Math.round(def.price * 0.00002)),
      isNew: true,
      racing: true,
    };
    (state.cars ||= []).push(car);
    R().car = state.cars.length - 1;
    if (typeof renderStats === "function") renderStats();
    if (typeof say === "function") say(`I bought a ${carName(car)} at an underground auction.`);
    if (typeof notice === "function")
      notice("Keys in hand", `The ${carName(car)} is yours. It will never show up in a normal dealership.`, R().active ? openRacing : racingIntro, true);
  }

  // ------------------------------------------------------------------ judge
  const JUDGE_RANKS = [
    { n: "Municipal Judge", pay: 90000, cases: 0 },
    { n: "State Judge", pay: 145000, cases: 5 },
    { n: "Federal Judge", pay: 225000, cases: 15 },
    { n: "Supreme Court Justice", pay: 320000, cases: 30 },
  ];
  const CHARGES = ["armed robbery", "fraud", "murder", "drug trafficking", "assault", "embezzlement", "kidnapping", "arson"];
  const FIRST = ["Marcus", "Elena", "Darius", "Sofia", "Victor", "Amara", "Julian", "Nadia", "Felix", "Rosa"];
  const LAST = ["Vale", "Ortiz", "Bennett", "Kaur", "Mercer", "Reyes", "Sato", "Novak", "Bishop", "Silva"];
  const EVIDENCE = [
    { k: "video", n: "Security video", icon: "emoji/1f3a5.png" },
    { k: "text", n: "Phone messages", icon: "emoji/1f4ac.png" },
    { k: "news", n: "News reports", icon: "emoji/1f4f0.png" },
    { k: "witness", n: "Witness statement", icon: "emoji/1f9d1.png" },
  ];
  const J = () => {
    const j = (state.judge ||= {
      active: false,
      rank: 0,
      approval: 60,
      corruption: 0,
      cases: 0,
      correct: 0,
      wrong: 0,
      bribes: 0,
      earned: 0,
      caseYear: -1,
      case: null,
      lastAge: -1,
    });
    if (!j.case || typeof j.case !== "object") j.case = null;
    return j;
  };

  function newCase() {
    const j = J();
    const guilty = rnd() < 0.55;
    const evidence = EVIDENCE.map((e, i) => ({
      ...e,
      found: false,
      lean: clamp((guilty ? 1 : -1) * ri(0, 2) + ri(-1, 1) + (i === 0 && guilty ? 1 : 0), -3, 3),
    }));
    j.case = {
      first: pick(FIRST),
      last: pick(LAST),
      charge: pick(CHARGES),
      guilty,
      evidence,
      actions: 3,
      done: false,
      bribed: false,
      bribe: 0,
      score: 0,
      sentence: null,
      year: state.age,
    };
    j.caseYear = state.age;
    return j.case;
  }

  function caseName(c) {
    return `${c.first} ${c.last}`;
  }

  function openJudge() {
    if (state.age < 25)
      return typeof notice === "function" && notice("Too young", "You need to be at least 25 to become a judge.", null, true);
    const j = J();
    if (!j.active) return judgeIntro();
    if (!openScreen("Judge", openSpecialCareers)) return;
    if (!j.case || j.case.year !== state.age) newCase();
    const c = j.case;
    const evFound = c.evidence.filter((e) => e.found).length;
    sList.innerHTML =
      section("The Court") +
      row("jdStat", ICON.judge, JUDGE_RANKS[j.rank].n, `Approval ${j.approval}% · Integrity ${100 - j.corruption}%`, true, "") +
      section("This Year's Case") +
      row("jdCase", ICON.gavel, `The People v. ${caseName(c)}`, c.done ? "Case closed. New case next year." : `${c.charge} · ${evFound}/4 evidence reviewed`, false) +
      row("jdBribe", ICON.money, c.bribed ? "Bribe accepted" : "Take a bribe", c.bribed ? `${money(c.bribe)} already in your pocket` : "Money now, a verdict later", c.done || c.bribed, "") +
      section("Career") +
      row("jdQuit", ICON.judge, "Resign from the bench", "Leave the judge career", false, "");
    tap("jdCase", () => openCase());
    tap("jdBribe", takeBribe);
    tap("jdQuit", quitJudge);
  }

  function judgeIntro() {
    if (!openScreen("Judge", openSpecialCareers)) return;
    const j = J();
    sList.innerHTML =
      `<div class="row"><img src="${ICON.judge}" alt=""><div class="t"><b>Judge</b><span>Hear one case a year. Investigate the evidence, then sentence the accused.</span></div></div>` +
      `<div class="sec">Requirements</div>` +
      row("jdStart", ICON.judge, state.stats.Smarts >= 55 ? "Take the bench" : "You need more Smarts", state.stats.Smarts >= 55 ? `Smarts ${Math.round(state.stats.Smarts)} · Age 25+` : "Study and come back when your Smarts are 55+", state.stats.Smarts < 55) +
      `<div class="sec">The Job</div><div class="row"><img src="${ICON.money}" alt=""><div class="t"><b>Evidence and sentences</b><span>Video, messages, news and witnesses. You choose the sentence. Corruption has a price.</span></div></div>`;
    tap("jdStart", startJudge);
    if (j.active) openJudge();
  }

  function startJudge() {
    if (state.age < 25) return;
    if (state.stats.Smarts < 55)
      return typeof notice === "function" && notice("Not ready", "You need at least 55 Smarts to become a judge.", null, true);
    if (window.FL_CAREERS && !window.FL_CAREERS.canStart("Judge")) return;
    const j = J();
    j.active = true;
    j.lastAge = state.age;
    newCase();
    setJob({ t: JUDGE_RANKS[j.rank].n, c: "Legal", emp: "The Court", pay: ip(JUDGE_RANKS[j.rank].pay), icon: ICON.judge, judge: true, perf: j.approval });
    if (typeof say === "function") say("I became a judge.");
    openJudge();
  }

  function openCase() {
    const j = J();
    if (!j.case || j.case.year !== state.age) {
      newCase();
    }
    const c = j.case;
    if (c.done) return openJudge();
    if (!openScreen(`The People v. ${caseName(c)}`, openJudge)) return;
    sList.innerHTML =
      `<div class="row"><img src="${ICON.gavel}" alt=""><div class="t"><b>${esc(caseName(c))}</b><span>Charged with ${esc(c.charge)}</span></div></div>` +
      section("Evidence") +
      c.evidence
        .map((e, i) =>
          row(
            `jdEv_${e.k}`,
            e.found ? e.icon : "emoji/2753.png",
            e.n,
            e.found ? "Reviewed" : `Investigate (${c.actions} action${c.actions === 1 ? "" : "s"} left)`,
            e.found || c.actions <= 0,
            "",
          ),
        )
        .join("") +
      section("Verdict") +
      row("jdVerdict", ICON.judge, "Reach a verdict", c.actions > 0 ? "You can still investigate" : "No actions left", false);
    c.evidence.forEach((e) => tap(`jdEv_${e.k}`, () => investigate(e.k)));
    tap("jdVerdict", verdictCard);
  }

  function investigate(kind) {
    const j = J();
    const c = j.case;
    const e = c && c.evidence.find((x) => x.k === kind);
    if (!e || e.found || c.done) return;
    if (c.actions <= 0)
      return typeof notice === "function" && notice("No actions left", "You have already used your investigation time this year.", openCase, true);
    c.actions--;
    const success = rnd() < clamp(0.58 + (Number(state.stats.Smarts) || 50) / 220, 0.45, 0.9);
    let text;
    if (success) {
      e.found = true;
      c.score += e.lean;
      text =
        kind === "video"
          ? `The footage is grainy, but it puts ${caseName(c)} near the scene.`
          : kind === "text"
            ? `The messages are damning in places and ambiguous in others.`
            : kind === "news"
              ? `The news coverage has details the police never released.`
              : `The witness is nervous, but their story lines up with the file.`;
    } else {
      text = `You spent the afternoon chasing a lead that went nowhere.`;
    }
    if (typeof jCard === "function")
      jCard({
        tag: "Judge",
        iconSrc: e.icon,
        title: e.n,
        lead: text,
        rows: [
          ["Case", caseName(c)],
          ["Evidence reviewed", `${c.evidence.filter((x) => x.found).length}/4`],
          ["Actions left", String(c.actions)],
        ],
        choices: [["Back to the case", openCase]],
      });
  }

  function verdictCard() {
    const c = J().case;
    if (!c || c.done) return;
    if (typeof jCard !== "function") return;
    jCard({
      tag: "Judge",
      iconSrc: ICON.judge,
      title: `The People v. ${caseName(c)}`,
      lead: `The court is waiting. You have reviewed ${c.evidence.filter((e) => e.found).length} of 4 pieces of evidence.`,
      rows: [
        ["Charge", c.charge],
        ["Defendant", caseName(c)],
        ["Bribe", c.bribed ? money(c.bribe) : "None"],
      ],
      choices: [
        ["Guilty", sentenceCard],
        ["Not guilty", () => resolveCase(false, null)],
        ["Not yet", openCase],
      ],
    });
  }

  function sentenceCard() {
    const c = J().case;
    if (!c || c.done) return;
    jCard({
      tag: "Judge",
      iconSrc: ICON.gavel,
      title: "Choose the Sentence",
      lead: `You are about to sentence ${caseName(c)} for ${c.charge}.`,
      choices: [
        ["A fine", () => resolveCase(true, "a heavy fine")],
        ["Probation", () => resolveCase(true, "probation")],
        ["5 years", () => resolveCase(true, "5 years")],
        ["15 years", () => resolveCase(true, "15 years")],
        ["Life", () => resolveCase(true, "life in prison")],
      ],
    });
  }

  function resolveCase(guiltyVerdict, sentence) {
    const j = J();
    const c = j.case;
    if (!c || c.done) return;
    c.done = true;
    c.sentence = sentence;
    const correct = guiltyVerdict === c.guilty;
    j.cases++;
    if (correct) {
      j.correct++;
      j.approval = clamp(j.approval + 7, 0, 100);
    } else {
      j.wrong++;
      j.approval = clamp(j.approval - 13, 0, 100);
    }
    if (guiltyVerdict) j.convictions = (j.convictions || 0) + 1;
    if (c.bribed && guiltyVerdict) j.corruption = clamp(j.corruption + 12, 0, 100);
    if (c.bribed && !guiltyVerdict) j.corruption = clamp(j.corruption + 5, 0, 100);
    if (state.job && state.job.judge) state.job.perf = j.approval;
    updateJudgeRank();
    const outcome = correct
      ? guiltyVerdict
        ? `The evidence holds up. ${caseName(c)} is convicted and sentenced to ${sentence}.`
        : `The evidence was thin. ${caseName(c)} walks out of the courthouse.`
      : guiltyVerdict
        ? `The appeals court will remember this one. ${caseName(c)}'s conviction looks unsafe.`
        : `The public wanted a conviction. ${caseName(c)} walks, and the papers blame you.`;
    if (typeof say === "function") say(`In court, I ${guiltyVerdict ? `sentenced ${caseName(c)} to ${sentence}` : `acquitted ${caseName(c)}`}.`);
    if (typeof notice === "function") notice("Verdict", outcome, openJudge, true);
    // Una condena injusta o una traición a un soborno puede traer represalias.
    const revenge = !correct && guiltyVerdict ? 0.12 + (sentence === "life in prison" ? 0.1 : 0) : c.bribed && guiltyVerdict ? 0.1 : 0;
    if (revenge && rnd() < revenge) {
      setTimeout(
        () =>
          typeof notice === "function" &&
          notice(
            "A Threat",
            `Someone connected to ${caseName(c)} is waiting for you outside. They have a gun.`,
            () => setTimeout(() => typeof die === "function" && die(`being killed by someone connected to ${caseName(c)}`), 300),
            true,
          ),
        500,
      );
    }
  }

  function takeBribe() {
    const j = J();
    const c = j.case;
    if (!c || c.done || c.bribed) return;
    const amount = ri(4000, 18000) * (j.rank + 1);
    j.corruption = clamp(j.corruption + 15, 0, 100);
    j.bribes++;
    c.bribed = true;
    c.bribe = amount;
    state.money += amount;
    if (typeof renderStats === "function") renderStats();
    if (typeof say === "function") say(`I took a ${money(amount)} bribe from ${caseName(c)}.`);
    if (typeof notice === "function")
      notice("Bribe", `You took ${money(amount)}. ${caseName(c)} expects a not guilty verdict.<br><br>Integrity is now ${100 - j.corruption}%.`, openJudge, true);
  }

  function updateJudgeRank() {
    const j = J();
    let rank = j.rank;
    while (rank + 1 < JUDGE_RANKS.length && j.cases >= JUDGE_RANKS[rank + 1].cases) rank++;
    if (rank !== j.rank) {
      j.rank = rank;
      if (state.job && state.job.judge) {
        state.job.t = JUDGE_RANKS[rank].n;
        state.job.pay = ip(JUDGE_RANKS[rank].pay);
      }
      if (typeof notice === "function")
        notice("Promoted", `You are now a ${JUDGE_RANKS[rank].n}.`, null, true);
    }
  }

  function quitJudge() {
    const j = J();
    j.active = false;
    clearJob("judge");
    if (typeof say === "function") say("I resigned from the bench.");
    openSpecialCareers();
  }

  // ------------------------------------------------------------------ artist
  const BUYERS = [
    { k: "working", n: "Working class buyer", mult: 0.45, icon: "emoji/1f527.png" },
    { k: "middle", n: "Middle class buyer", mult: 1, icon: "emoji/1f3e0.png" },
    { k: "wealthy", n: "Wealthy collector", mult: 2.2, icon: "emoji/1f3e6.png" },
    { k: "elite", n: "Private museum", mult: 4.5, icon: "emoji/1f3db-fe0f.png" },
  ];
  const A = () => {
    const a = (state.artCareer ||= {
      active: false,
      fame: 0,
      sold: 0,
      earnings: 0,
      painted: 0,
      lastAge: -1,
    });
    return a;
  };

  function readGallery() {
    try {
      const raw = localStorage.getItem(ART_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list.filter((p) => p && p.data && p.title) : [];
    } catch {
      return [];
    }
  }
  function writeGallery(list) {
    try {
      localStorage.setItem(ART_KEY, JSON.stringify(list));
      return true;
    } catch {
      if (typeof notice === "function") notice("Storage full", "The browser could not save another piece. Sell or delete one first.", null, true);
      return false;
    }
  }

  function openArtist() {
    if (state.age < 16)
      return typeof notice === "function" && notice("Too young", "You can start selling art at 16.", null, true);
    const a = A();
    if (!a.active) return artistIntro();
    if (!openScreen("Artist", openSpecialCareers)) return;
    const gallery = readGallery();
    sList.innerHTML =
      section("Studio") +
      row("arStat", ICON.art, "Independent Artist", `Fame ${a.fame} · ${a.sold} sold · ${money(a.earnings)} earned`, true, "") +
      section("Work") +
      row("arPaint", ICON.paint, "Paint a new piece", "Open the canvas and save it to your gallery", false) +
      row("arGallery", ICON.art, "My gallery", `${gallery.length} piece${gallery.length === 1 ? "" : "s"} saved on this device`, gallery.length === 0) +
      section("Career") +
      row("arQuit", ICON.art, "Quit the art career", "Keep the pieces already in your gallery", false, "");
    tap("arPaint", () => paintStudio());
    tap("arGallery", () => openGallery());
    tap("arQuit", quitArtist);
  }

  function artistIntro() {
    if (!openScreen("Artist", openSpecialCareers)) return;
    const a = A();
    sList.innerHTML =
      `<div class="row"><img src="${ICON.art}" alt=""><div class="t"><b>Artist</b><span>Paint real pieces on a canvas and sell them to buyers from every walk of life.</span></div></div>` +
      section("Requirements") +
      row("arStart", ICON.art, "Start painting", "Age 16+ · No degree required", false) +
      `<div class="sec">How it works</div><div class="row"><img src="${ICON.paint}" alt=""><div class="t"><b>Your hand, your gallery</b><span>Every piece is saved in localStorage. Fame makes collectors pay more.</span></div></div>`;
    tap("arStart", startArtist);
    if (a.active) openArtist();
  }

  function startArtist() {
    if (state.age < 16) return;
    if (window.FL_CAREERS && !window.FL_CAREERS.canStart("Artist")) return;
    const a = A();
    a.active = true;
    a.lastAge = state.age;
    setJob({ t: "Artist", c: "Art", emp: "Independent", pay: 0, icon: ICON.art, artist: true, perf: clamp(35 + a.fame / 2, 0, 100) });
    if (typeof say === "function") say("I started selling my own art.");
    openArtist();
  }

  function installArtCss() {
    if (document.getElementById("flArtCss")) return;
    const st = document.createElement("style");
    st.id = "flArtCss";
    st.textContent =
      ".fl-art-wrap{max-width:620px;margin:0 auto}.fl-art-canvas{display:block;width:100%;max-width:560px;height:auto;margin:8px auto;border:2px solid #b9c3cf;border-radius:8px;background:#fff;touch-action:none;cursor:crosshair}.fl-art-tools{display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center;margin:8px 0}.fl-art-sw{width:26px;height:26px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px #8a95a3;cursor:pointer}.fl-art-sw.on{box-shadow:0 0 0 3px #1a6fd1}.fl-art-range{width:130px}.fl-art-title{width:100%;padding:9px 11px;border:1px solid #c8d1dc;border-radius:10px;font:inherit;color:#24313f}.fl-art-btn{width:auto;margin:4px 5px 0 0;padding:7px 12px;font-size:14px}.fl-art-note{text-align:center;font-size:13px;color:#66717f;margin:4px 0 8px}";
    document.head.append(st);
  }

  function paintStudio() {
    installArtCss();
    if (typeof ev === "undefined" || typeof evWrap === "undefined") return;
    ev.classList.remove("death18");
    ev.style.overflow = "visible";
    ev.innerHTML =
      `<div class="jcw fl-art-wrap"><div class="jm-tag" style="margin-top:12px">Artist</div>` +
      `<h4><img src="${ICON.paint}" alt=""><span>Studio</span></h4>` +
      `<div class="lead">Draw something. It will be saved in your gallery on this device.</div>` +
      `<canvas id="flArtCanvas" class="fl-art-canvas" width="640" height="480"></canvas>` +
      `<div class="fl-art-tools" id="flArtTools">` +
      ["#1f2933", "#e2401f", "#f2b705", "#2e9e5b", "#1a6fd1", "#8e44ad", "#d96a9a", "#ffffff"]
        .map((c, i) => `<button class="fl-art-sw${i === 0 ? " on" : ""}" data-c="${c}" style="background:${c}" aria-label="Color ${c}"></button>`)
        .join("") +
      `<label style="font-size:13px">Size <input id="flArtSize" class="fl-art-range" type="range" min="2" max="28" value="8"></label>` +
      `<button class="jm-apply ev-btn gy fl-art-btn" id="flArtErase">Eraser</button>` +
      `<button class="jm-apply ev-btn gy fl-art-btn" id="flArtClear">Clear</button>` +
      `</div>` +
      `<label class="hr-lab">Title:</label><input id="flArtTitle" class="fl-art-title" maxlength="48" placeholder="Untitled" autocomplete="off">` +
      `<div class="fl-art-note" id="flArtNote">Canvas 640×480 · saved locally</div>` +
      `<button class="jm-apply ev-btn" id="flArtSave">Save to gallery</button>` +
      `<button class="jm-apply ev-btn gy" id="flArtClose">Close</button></div>`;
    evWrap.classList.add("open");
    const canvas = document.getElementById("flArtCanvas");
    const ctx = canvas.getContext("2d");
    let color = "#1f2933";
    let size = 8;
    let drawing = false;
    let painted = 0;
    const colors = new Set();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - r.left) / r.width) * canvas.width,
        y: ((e.clientY - r.top) / r.height) * canvas.height,
      };
    };
    const dot = (p) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    };
    canvas.onpointerdown = (e) => {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      drawing = true;
      const p = pos(e);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = size;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      dot(p);
      painted++;
      if (color !== "#ffffff") colors.add(color);
    };
    canvas.onpointermove = (e) => {
      if (!drawing) return;
      const p = pos(e);
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      painted++;
      if (color !== "#ffffff") colors.add(color);
    };
    const stop = () => {
      drawing = false;
    };
    canvas.onpointerup = stop;
    canvas.onpointercancel = stop;
    canvas.onpointerleave = stop;
    ev.querySelectorAll("[data-c]").forEach((b) => {
      b.onclick = () => {
        color = b.dataset.c;
        ev.querySelectorAll("[data-c]").forEach((x) => x.classList.toggle("on", x === b));
      };
    });
    document.getElementById("flArtSize").oninput = (e) => (size = Number(e.target.value) || 8);
    document.getElementById("flArtErase").onclick = () => {
      color = "#ffffff";
      ev.querySelectorAll("[data-c]").forEach((x) => x.classList.remove("on"));
    };
    document.getElementById("flArtClear").onclick = () => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      painted = 0;
      colors.clear();
    };
    document.getElementById("flArtClose").onclick = () => {
      evWrap.classList.remove("open");
      ev.style.overflow = "";
    };
    document.getElementById("flArtSave").onclick = () => {
      if (painted < 12)
        return typeof notice === "function" && notice("Blank canvas", "Draw a little more before saving.", null, true);
      const title = (document.getElementById("flArtTitle").value || "Untitled").trim().slice(0, 48) || "Untitled";
      const quality = clamp(Math.round(26 + painted / 26 + colors.size * 5 + rnd() * 15 + (Number(state.stats.Smarts) || 50) / 9), 20, 99);
      const piece = {
        id: Date.now(),
        title,
        artist: `${state.first || "You"} ${state.last || ""}`.trim(),
        data: canvas.toDataURL("image/jpeg", 0.7),
        quality,
        year: state.birthYear + state.age,
        age: state.age,
      };
      const gallery = readGallery();
      if (gallery.length >= 12)
        return typeof notice === "function" && notice("Gallery full", "You can keep up to 12 pieces. Sell one before painting another.", openGallery, true);
      if (!writeGallery([piece, ...gallery])) return;
      A().painted++;
      evWrap.classList.remove("open");
      ev.style.overflow = "";
      if (typeof say === "function") say(`I painted "${title}" (${quality}/99).`);
      if (typeof notice === "function") notice("Saved", `"${title}" is in your gallery. Quality ${quality}/99.`, openArtist, true);
    };
  }

  function openGallery() {
    if (!openScreen("My Gallery", openArtist)) return;
    const gallery = readGallery();
    if (!gallery.length) {
      sList.innerHTML = section("Gallery") + row("arNoArt", ICON.art, "No pieces yet", "Paint something in the studio", false);
      tap("arNoArt", paintStudio);
      return;
    }
    sList.innerHTML =
      section("Saved on this device") +
      gallery
        .map(
          (p, i) =>
            `<div class="row" data-art="${i}"><img src="${p.data}" alt="" style="width:56px;height:42px;object-fit:cover;border-radius:6px"><div class="t"><b>${esc(p.title)}</b><span>Quality ${p.quality}/99 · ${esc(p.artist || "")}</span></div>${chev()}</div>`,
        )
        .join("");
    sList.querySelectorAll("[data-art]").forEach((el) => {
      el.onclick = () => {
        const p = gallery[Number(el.dataset.art)];
        if (p) sellArt(p);
      };
    });
  }

  function sellArt(piece) {
    const a = A();
    if (!piece) return;
    const base = Math.max(75, Math.round(piece.quality * 95 * (1 + a.fame / 55) * (0.78 + rnd() * 0.55)));
    const offers = BUYERS.map((b) => ({ ...b, price: Math.max(40, Math.round(base * b.mult * (0.9 + rnd() * 0.2))) }));
    if (typeof jCard !== "function") return;
    jCard({
      tag: "Artist",
      iconSrc: piece.data,
      title: piece.title,
      lead: `"${piece.title}" is on the table. Four buyers are interested.`,
      rows: [
        ["Quality", `${piece.quality}/99`],
        ["Fame", String(a.fame)],
        ["Artist", piece.artist || "You"],
      ],
      choices: [
        ...offers.map((o) => [
          `${o.n} · ${money(o.price)}`,
          () => {
            const gallery = readGallery();
            const idx = gallery.findIndex((x) => x.id === piece.id);
            if (idx < 0) return openGallery();
            const paid = o.price;
            gallery.splice(idx, 1);
            if (!writeGallery(gallery)) return;
            state.money += paid;
            a.sold++;
            a.earnings += paid;
            a.fame = clamp(a.fame + 1 + Math.round(piece.quality / 30), 0, 100);
            if (typeof renderStats === "function") renderStats();
            if (typeof say === "function") say(`I sold "${piece.title}" to a ${o.n.toLowerCase()} for ${money(paid)}.`);
            if (typeof notice === "function")
              notice("Sold", `The ${o.n.toLowerCase()} paid ${money(paid)} for "${piece.title}".<br><br>Fame ${a.fame}.`, openArtist, true);
          },
        ]),
        ["Keep it", () => openGallery()],
      ],
    });
  }

  function quitArtist() {
    A().active = false;
    clearJob("artist");
    if (typeof say === "function") say("I stepped away from my art career.");
    openSpecialCareers();
  }

  // ------------------------------------------------------------------ año
  function yearTick() {
    if (state.dead) return;
    const r = R();
    const j = J();
    const a = A();
    if (r.active) {
      if (r.lastAge !== state.age) {
        r.lastAge = state.age;
        if (state.job && state.job.racing) state.job.yrs = (state.job.yrs || 0) + 1;
        r.earned += ip(RANKS[r.rank].pay);
        if (ip(RANKS[r.rank].pay)) {
          state.money += ip(RANKS[r.rank].pay);
          if (typeof renderStats === "function") renderStats();
        }
        updateRacingRank(true);
        if (rnd() < policeChance(r)) setTimeout(policeStop, 500);
      }
    }
    if (j.active) {
      if (j.lastAge !== state.age) {
        j.lastAge = state.age;
        if (state.job && state.job.judge) state.job.yrs = (state.job.yrs || 0) + 1;
        j.earned += ip(JUDGE_RANKS[j.rank].pay);
        state.money += ip(JUDGE_RANKS[j.rank].pay);
        if (typeof renderStats === "function") renderStats();
        if (j.corruption > 0 && rnd() < clamp(j.corruption / 320, 0, 0.35)) {
          j.active = false;
          clearJob("judge");
          setTimeout(
            () =>
              typeof notice === "function" &&
              notice("Disbarred", "A investigation found money and favors tied to your court. You are removed from the bench.", () => {
                if (typeof arrest === "function") arrest("judicial corruption", [2, 8]);
              }, true),
            600,
          );
        } else if (!j.case || j.case.done) {
          newCase();
        }
      }
    }
    if (a.active && a.lastAge !== state.age) {
      a.lastAge = state.age;
      if (state.job && state.job.artist) state.job.yrs = (state.job.yrs || 0) + 1;
      a.fame = clamp(a.fame + (a.painted > 0 ? 1 : 0) - 1, 0, 100);
      if (state.job && state.job.artist) state.job.perf = clamp(35 + a.fame / 2, 0, 100);
    }
  }

  // ------------------------------------------------------------------ menú
  function decorateSpecialCareers() {
    if (typeof window.openSpecialCareers !== "function") return;
    const orig = window.openSpecialCareers;
    if (orig.__flSpecialWrapped) return;
    const wrapped = function () {
      const result = orig.apply(this, arguments);
      try {
        if (sList.querySelector("#spRacer, #spJudge, #spArtist, #spFootball")) return result;
        const cards =
          row("spRacer", ICON.race, "Illegal Street Racer", raceSub(), state.age < 18) +
          row("spJudge", ICON.judge, "Judge", state.age < 25 ? `Age 25+ · Smarts ${Math.round(state.stats.Smarts || 0)}` : "Hear cases, weigh evidence and sentence the accused", state.age < 25) +
          row("spArtist", ICON.art, "Artist", state.age < 16 ? "Age 16+" : "Paint real pieces and sell them to every social class", state.age < 16);
        const first = sList.querySelector(".sp-pack");
        first ? first.insertAdjacentHTML("beforebegin", cards) : sList.insertAdjacentHTML("beforeend", cards);
        tap("spRacer", openRacing);
        tap("spJudge", openJudge);
        tap("spArtist", openArtist);
      } catch (e) {
        console.warn("[special-life] menu", e);
      }
      return result;
    };
    wrapped.__flSpecialWrapped = true;
    window.openSpecialCareers = wrapped;
  }

  // ---------------------------------------------------------------- una sola carrera
  function careerNames(except) {
    const out = [];
    if (state.racing && state.racing.active) out.push("Illegal Street Racer");
    if (state.judge && state.judge.active) out.push("Judge");
    if (state.art && state.art.active) out.push("Artist");
    if (state.futbol && state.futbol.active && !state.futbol.retired) out.push("Footballer");
    if (state.gangLife && state.gangLife.member) out.push("Gang member");
    if (state.drift && state.drift.active) out.push("Drift Boy");
    if (state.job && state.job.acting) out.push("Actor");
    if (state.job && state.job.fighter) out.push("Fighter");
    if (state.job && state.job.politician) out.push("Politician");
    if (state.job && state.job.athlete) out.push("Pro Athlete");
    return out.filter((n) => n !== except);
  }
  window.FL_CAREERS = {
    list: () => careerNames(),
    canStart(name) {
      const busy = careerNames(name);
      if (!busy.length) return true;
      if (typeof notice === "function")
        notice(
          "One career at a time",
          `You are already a ${busy[0]}. Quit that career before starting a new one.`,
          null,
          true,
        );
      return false;
    },
  };

  // "Your Job" opens the same menu the career has in Special Careers.
  const origJobScreen = window.openJobScreen;
  if (typeof origJobScreen === "function") {
    window.openJobScreen = function () {
      if (state.job && state.job.racing) return openRacing();
      if (state.job && state.job.judge) return openJudge();
      if (state.job && state.job.artist) return openArtist();
      return origJobScreen.apply(this, arguments);
    };
  }

  // Police heat meter, right below Fame.
  const origRenderStats = window.renderStats;
  if (typeof origRenderStats === "function") {
    window.renderStats = function () {
      const out = origRenderStats.apply(this, arguments);
      try {
        if (state.racing && state.racing.active) {
          const st = document.getElementById("stats");
          if (st && !st.querySelector("#flHeatRow")) {
            const h = clamp(Math.round(state.racing.heat || 0), 0, 100);
            st.insertAdjacentHTML(
              "beforeend",
              `<div class="stat-l" id="flHeatRow">Police Heat<span class="e"><img src="emoji/1f46e.png" alt="" style="width:24px;height:24px;vertical-align:middle"></span></div>` +
                `<div class="bar"><div class="bi"><div class="fill ${h >= 65 ? "crit" : h >= 35 ? "low" : ""}" style="width:${h}%"><span class="fin${h >= 75 ? " hi" : ""}">${h}%</span></div></div><span class="pct${h >= 75 ? " in" : ""}">${h}%</span></div>`,
            );
          }
        }
      } catch (e) {
        console.warn("[special-life] heat meter", e);
      }
      return out;
    };
  }

  function boot() {
    if (
      typeof state === "undefined" ||
      typeof sList === "undefined" ||
      typeof screen === "undefined" ||
      typeof openSpecialCareers !== "function" ||
      !document.getElementById("ageBtn")
    )
      return setTimeout(boot, 80);
    decorateSpecialCareers();
    R().lastAge = R().lastAge < 0 ? state.age : R().lastAge;
    J().lastAge = J().lastAge < 0 ? state.age : J().lastAge;
    A().lastAge = A().lastAge < 0 ? state.age : A().lastAge;
    document.getElementById("ageBtn").addEventListener("click", () => setTimeout(yearTick, 90));
    window.FL_SPECIAL_LIFE = {
      racing: R,
      judge: J,
      art: A,
      openRacing,
      openJudge,
      openArtist,
      gallery: readGallery,
    };
    window.__FL_SPECIAL_LOADING = false;
  }

  boot();
})();
