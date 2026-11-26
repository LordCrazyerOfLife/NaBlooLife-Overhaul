/* [mod] Crime Extras for NaBlooLife (local mod).
 *
 * Turns on the four Crime rows the base game lists but never finished:
 *  - Trespassing:     urban exploring, pools, rooftops, a military base, the zoo after hours.
 *  - Street Racing:   needs a car. Four tiers of opponents, stakes, crashes, police chases.
 *  - Illegal Betting: underground fights, street dice, backroom poker, a bookie. A loan shark if you run dry.
 *  - Train Robbery:   pick the cargo, the approach and the crew. Scouting helps. The feds do not forget.
 *
 * State: state.crimeX (JSON only). API: FL_CRIMEX.trespass() / race() / bet() / train() / state().
 */
(() => {
  "use strict";
  if (window.FL_CRIMEX) return;

  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const cl = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const ch = (p) => rnd() < p;
  const ifx = () => (typeof window.inflFx === "function" ? window.inflFx() : 1);
  const price = (n) => Math.max(1, Math.round((typeof localPrice === "function" ? localPrice(n) : n) * ifx()));
  const money = (n) => (typeof usd === "function" ? usd(Math.round(n)) : "$" + Math.round(n).toLocaleString("en-US"));
  const warn = (w, e) => console.warn("[crime-extra] " + w, e);
  const sayIt = (s) => {
    try {
      typeof say === "function" && say(s);
    } catch {}
  };
  const stat = (k, d) => {
    if (state.stats) state.stats[k] = cl((Number(state.stats[k]) || 0) + d);
  };
  const render = () => {
    try {
      renderStats();
    } catch {}
  };
  const cash = () => Number(state.money) || 0;
  const addMoney = (n) => {
    state.money = Math.max(0, cash() + n);
    render();
  };
  const note = (title, text, cb) => notice(title, text, cb || null, true);
  const card = (o) => {
    try {
      jCard({ tag: "Crime", ...o });
    } catch (e) {
      warn("card", e);
    }
  };
  const sfx = (g) => window.FL_SND && FL_SND.result(g);
  const caught = (charge, text) => {
    sfx(false);
    state.record = (state.record || 0) + 1;
    note("Busted", text, () => {
      try {
        arrest(charge);
      } catch (e) {
        warn("arrest", e);
      }
    });
  };
  const X = () => {
    const x = (state.crimeX ||= {});
    x.bet ||= { won: 0, lost: 0, debt: 0 };
    x.race ||= { wins: 0, losses: 0, crashes: 0 };
    x.rail ||= { jobs: 0, loot: 0, scout: -9, heat: 0 };
    x.year ??= -1;
    return x;
  };
  const back = () => {
    try {
      typeof openCrime === "function" && openCrime();
    } catch {}
  };
  const snd = (n) => {
    try {
      typeof play === "function" && play(n);
    } catch {}
  };

  // charges the base game does not know
  const addCharges = () => {
    try {
      const add = {
        "illegal gambling": [1, 3],
        "street racing": [1, 4],
        "reckless driving": [1, 3],
        "criminal trespass": [1, 2],
        "trespassing on a military base": [2, 8],
        "evading police": [2, 6],
        "train robbery": [6, 16],
        "assaulting a rail guard": [8, 20],
      };
      Object.keys(add).forEach((k) => {
        if (!CHARGES[k]) CHARGES[k] = add[k];
      });
    } catch (e) {
      warn("charges", e);
    }
  };

  // ------------------------------------------------------------------ trespassing
  const SPOTS = [
    { id: "urbex", t: "Abandoned factory", d: "Urban exploring. Rusty stairs, graffiti and maybe something worth taking.", risk: 0.12 },
    { id: "pool", t: "A rich neighbor's pool", d: "Midnight swim in a pool that is not yours.", risk: 0.28 },
    { id: "roof", t: "A skyscraper rooftop", d: "The city from the edge, with no permission and no harness.", risk: 0.2 },
    { id: "zoo", t: "The zoo after hours", d: "Climb the fence and meet the animals when nobody is looking.", risk: 0.3 },
    { id: "base", t: "A military base", d: "Fences, floodlights, armed guards. The dumbest thing on this list.", risk: 0.55 },
  ];
  function trespass() {
    snd("choice");
    const x = X();
    card({
      iconSrc: "crime/trespass.png",
      title: "Trespassing",
      lead: "Pick a place you are definitely not allowed to be.",
      rows: [["Times caught", String(x.trespassCaught || 0)]],
      choices: [
        ...SPOTS.map((s) => [s.t, () => goTrespass(s)]),
        ["Back out", () => back()],
      ],
    });
  }
  function goTrespass(s) {
    const x = X();
    const risk = s.risk - (state.stats && state.stats.Smarts > 70 ? 0.05 : 0);
    if (ch(risk)) {
      x.trespassCaught = (x.trespassCaught || 0) + 1;
      const base = s.id === "base";
      return caught(base ? "trespassing on a military base" : s.id === "urbex" || s.id === "pool" ? "trespassing" : "criminal trespass", base ? "Floodlights, dogs and a very angry sergeant. You are on the ground with a rifle pointed at your head." : "Someone saw you and called the police. The patrol car is already there.");
    }
    const roll = rnd();
    if (s.id === "urbex") {
      if (roll < 0.1) {
        stat("Health", -ri(5, 15));
        sayIt("I fell through a rotten floor while exploring an abandoned factory.");
        return note("Rotten floor", "A board gives way and you drop one level. Bruised, you limp out.", back);
      }
      if (roll < 0.4) {
        const g = price(ri(60, 900));
        addMoney(g);
        stat("Happiness", ri(3, 6));
        sayIt("I found something worth selling while exploring an abandoned factory.");
        return note("Scrap and a surprise", `You come out with copper and an old toolbox. ${money(g)} at the scrapyard.`, back);
      }
      stat("Happiness", ri(4, 8));
      sayIt("I explored an abandoned factory.");
      return note("Ghost town", "You walk through decades of dust and leave with the best photos of your life.", back);
    }
    if (s.id === "pool") {
      stat("Happiness", ri(6, 10));
      sayIt("I broke into a rich neighbor's pool for a midnight swim.");
      return note("Midnight swim", "The water is perfect and the city lights shine on it. Nobody notices.", back);
    }
    if (s.id === "roof") {
      if (roll < 0.06) {
        stat("Health", -ri(20, 45));
        sayIt("I slipped on a rooftop ledge.");
        return note("Slipped", "Your foot slides on the ledge. You catch the railing, barely, and tear your shoulder.", back);
      }
      stat("Happiness", ri(8, 13));
      sayIt("I snuck onto a skyscraper rooftop to watch the sunrise.");
      return note("Top of the world", "You watch the sun come up over the whole city from the roof. Worth it.", back);
    }
    if (s.id === "zoo") {
      if (roll < 0.12) {
        stat("Health", -ri(8, 20));
        sayIt("I got bitten after sneaking into the zoo.");
        return note("Too close", "You reach over the rail and something with teeth takes your hand. You run bleeding to the fence.", back);
      }
      stat("Happiness", ri(8, 12));
      sayIt("I snuck into the zoo after hours.");
      return note("After hours", "The zoo is silent and the animals are awake. A lion stares at you through the dark.", back);
    }
    if (roll < 0.25) {
      stat("Happiness", ri(12, 18));
      sayIt("I walked around a military base and saw something I was not supposed to see.");
      return note("You saw it", "You slip between two hangars and see what is parked inside. You leave before anyone sees you. You will never tell anyone.", back);
    }
    stat("Happiness", ri(5, 9));
    sayIt("I snuck onto a military base and got away with it.");
    note("Nobody noticed", "Your heart is trying to leave your chest. You get over the fence and sprint to the road.", back);
  }

  // ------------------------------------------------------------------ street racing
  const TIERS = [
    { t: "Rookie race", stake: 600, tough: 0 },
    { t: "Local crew", stake: 4000, tough: 1 },
    { t: "Pro circuit", stake: 20000, tough: 2 },
    { t: "King of the street", stake: 90000, tough: 3 },
  ];
  const bestCar = () => (Array.isArray(state.cars) ? state.cars.slice().sort((a, b) => (b.cond || 0) - (a.cond || 0))[0] : null);
  const carName = (c) => `${c.make || ""} ${c.model || ""}`.trim() || "your car";
  const carPower = (c) => {
    let tn = "";
    try {
      tn = String((CAR_TYPE_NAME && CAR_TYPE_NAME[c.type]) || c.type || "");
    } catch {}
    const fast = /sport|super|muscle|race|coupe|hyper/i.test(tn) ? 0.28 : /sedan|hatch|compact/i.test(tn) ? 0.1 : /truck|van|suv/i.test(tn) ? 0.04 : 0.1;
    return cl((c.cond || 50) / 100, 0.1, 1) * 0.5 + fast;
  };
  function race() {
    snd("choice");
    const c = bestCar();
    if (state.age < 16) return note("Too young", "You can't enter a street race at your age.", back);
    if (!c) return note("No car", "You need a car to race. Buy or steal one first.", back);
    card({
      iconSrc: "crime/streetrace.png",
      title: "Street Racing",
      lead: `Midnight, an empty industrial road and a crowd with phones. You roll up in your ${carName(c)} (condition ${Math.round(c.cond || 0)}%).`,
      rows: [["Record", `${X().race.wins} wins · ${X().race.losses} losses`]],
      choices: [
        ...TIERS.map((t) => [`${t.t} (stake ${money(price(t.stake))})`, () => goRace(t, c)]),
        ["Back out", () => back()],
      ],
    });
  }
  function goRace(t, c) {
    const x = X();
    const stake = price(t.stake);
    if (cash() < stake) return note("Not enough money", `They want ${money(stake)} on the table.`, race);
    const p = cl(0.28 + carPower(c) * 0.55 - t.tough * 0.07, 0.1, 0.82);
    addMoney(-stake);
    const finish = () => {
      if (ch(p)) {
        sfx(true);
        x.race.wins++;
        addMoney(stake * 2);
        stat("Happiness", ri(6, 12));
        sayIt(`I won a street race in my ${carName(c)} and took ${money(stake)}.`);
        note("You won", `You cross the line first. The crowd goes crazy and you take home ${money(stake * 2)}.`, back);
      } else {
        sfx(false);
        x.race.losses++;
        stat("Happiness", -ri(1, 4));
        sayIt("I lost a street race.");
        note("You lost", `Taillights in front of you the whole way. Your ${money(stake)} stake is gone.`, back);
      }
    };
    const r = rnd();
    if (r < 0.11) {
      sfx(false);
      x.race.crashes++;
      c.cond = Math.max(1, (c.cond || 50) - ri(15, 45));
      stat("Health", -ri(8, 30));
      sayIt("I crashed my car in a street race.");
      return note("Crash", `You lose the back end in a corner and hit the barrier. ${carName(c)} is badly damaged. You lose the ${money(stake)} stake.`, back);
    }
    if (r < 0.27) {
      return card({
        iconSrc: "crime/police-car.png",
        title: "Sirens",
        lead: "Blue lights come around the corner right in the middle of the race. Everyone scatters.",
        choices: [
          ["Pull over and take it", () => {
            addMoney(stake);
            caught(ch(0.5) ? "street racing" : "reckless driving", "You pull over, hands on the wheel. The officer is not amused.");
          }],
          ["Floor it", () => {
            if (ch(0.5 + carPower(c) * 0.3)) {
              stat("Happiness", ri(6, 10));
              sayIt("I outran the police after a street race.");
              return note("Gone", "You take three turns on two wheels and kill the lights. They never find you. Stake lost, adrenaline gained.", back);
            }
            c.cond = Math.max(1, (c.cond || 50) - ri(5, 20));
            caught("evading police", "They box you in on the highway ramp. The chase ends in handcuffs.");
          }],
        ],
      });
    }
    finish();
  }

  // ------------------------------------------------------------------ illegal betting
  const GAMES = [
    { t: "Underground fight night", p: 0.42, m: 2.2 },
    { t: "Street dice", p: 0.46, m: 2 },
    { t: "Backroom poker", p: 0.28, m: 3.2 },
    { t: "The bookie (longshot)", p: 0.12, m: 7 },
  ];
  function bet() {
    snd("choice");
    const x = X();
    if (state.age < 16) return note("Too young", "No underground ring will take your bets at your age.", back);
    card({
      iconSrc: "crime/betting.png",
      title: "Illegal Betting",
      lead: "No licenses, no limits and no refunds. Cash only.",
      rows: [["Won", money(x.bet.won)], ["Lost", money(x.bet.lost)], ["Owed to the shark", money(x.bet.debt)]],
      choices: [
        ...GAMES.map((g) => [g.t, () => stakes(g)]),
        [x.bet.debt > 0 ? `Pay back the shark (${money(Math.min(x.bet.debt, cash()))})` : `Borrow from a loan shark (${money(price(3000))})`, () => shark()],
        ["Walk away", () => back()],
      ],
    });
  }
  function shark() {
    const x = X();
    if (x.bet.debt > 0) {
      const pay = Math.min(x.bet.debt, cash());
      if (pay <= 0) return note("No money", "You have nothing to pay with.", bet);
      addMoney(-pay);
      x.bet.debt -= pay;
      return note("Payment", x.bet.debt > 0 ? `You hand over ${money(pay)}. You still owe ${money(x.bet.debt)}.` : "You are clean with the shark. For now.", bet);
    }
    const n = price(3000);
    addMoney(n);
    x.bet.debt = Math.round(n * 1.1);
    note("Loan", `A man with a thin smile counts out ${money(n)}. It grows every year. Do not be late.`, bet);
  }
  function stakes(g) {
    const m = cash();
    const opts = [0.05, 0.2, 0.5].map((f) => Math.max(price(100), Math.round((m * f) / 10) * 10)).filter((v, i, a) => a.indexOf(v) === i);
    card({
      iconSrc: "crime/betting.png",
      title: g.t,
      lead: `Pays x${g.m} if you win. Your money: ${money(m)}.`,
      choices: [...opts.map((v) => [`Bet ${money(v)}`, () => play2(g, v)]), ["Back", () => bet()]],
    });
  }
  function play2(g, v) {
    const x = X();
    if (cash() < v) return note("Not enough money", "You can't cover that bet.", bet);
    if (ch(0.07)) {
      addMoney(-v);
      x.bet.lost += v;
      return caught("illegal gambling", "The ring gets raided mid-bet. Cops come through every door and your cash is evidence.");
    }
    addMoney(-v);
    const rigged = ch(0.08);
    if (!rigged && ch(g.p)) {
      sfx(true);
      const w = Math.round(v * g.m);
      addMoney(w);
      x.bet.won += w - v;
      stat("Happiness", ri(5, 10));
      sayIt(`I won ${money(w - v)} in an underground bet.`);
      note("You win", `${g.t}: ${money(w)} on the table, all yours.`, bet);
    } else {
      sfx(false);
      x.bet.lost += v;
      stat("Happiness", -ri(2, 6));
      sayIt(`I lost ${money(v)} in an underground bet.`);
      note(rigged ? "Rigged" : "You lose", rigged ? "The game was fixed from the start. You find out when it's too late." : `${g.t}: gone. ${money(v)} lighter.`, bet);
    }
  }

  // ------------------------------------------------------------------ train robbery
  const CARGO = [
    { t: "Freight cars (electronics)", base: 0.42, lo: 150000, hi: 600000 },
    { t: "Armored cash car", base: 0.28, lo: 500000, hi: 2000000 },
    { t: "Gold bullion shipment", base: 0.18, lo: 1500000, hi: 6000000 },
  ];
  const HOW = [
    { t: "Hop aboard at a slow curve", mod: 0.03 },
    { t: "Block the tracks and board", mod: -0.05 },
    { t: "Drop from a bridge onto the roof", mod: 0.06, hurt: 0.2 },
  ];
  function train() {
    snd("choice");
    const x = X();
    if (state.age < 16) return note("Too young", "You can't pull off a train robbery at your age.", back);
    const scouted = x.rail.scout === state.age;
    card({
      iconSrc: "crime/locomotive.png",
      title: "Train Robbery",
      lead: "A cargo train is passing through town. Pick the cargo, then how you get on.",
      rows: [["Jobs pulled", String(x.rail.jobs)], ["Scouted this year", scouted ? "Yes (+ odds)" : "No"]],
      choices: [
        [scouted ? "Already scouted this year" : "Scout the line first (safe)", () => {
          if (!scouted) {
            x.rail.scout = state.age;
            stat("Smarts", 1);
            note("Scouted", "You time the schedule, find the blind curve and count the guards. You know where the cars are.", train);
          } else train();
        }],
        ...CARGO.map((c) => [c.t, () => how(c)]),
        ["Back out", () => back()],
      ],
    });
  }
  function how(c) {
    const x = X();
    card({
      iconSrc: "crime/locomotive.png",
      title: c.t,
      lead: "How do you get on the train?",
      choices: [
        ...HOW.map((h) => [h.t, () => crew(c, h)]),
        ["Back", () => train()],
      ],
    });
  }
  function crew(c, h) {
    card({
      iconSrc: "crime/locomotive.png",
      title: "Crew",
      lead: "Solo means you keep it all. A crew helps, but takes a quarter and any of them can talk.",
      choices: [
        ["Go alone", () => run(c, h, false)],
        ["Bring a crew (+ odds, 25% cut)", () => run(c, h, true)],
        ["Back", () => how(c)],
      ],
    });
  }
  function run(c, h, crewOn) {
    const x = X();
    const scouted = x.rail.scout === state.age;
    const p = cl(c.base + h.mod + (crewOn ? 0.14 : 0) + (scouted ? 0.12 : 0) + ((state.stats && state.stats.Smarts) || 50) / 1000, 0.05, 0.8);
    if (h.hurt && ch(h.hurt)) {
      stat("Health", -ri(15, 40));
      sayIt("I broke bones jumping onto a moving train.");
      return note("Bad landing", "The jump goes wrong. You hit the roof wrong and roll, and the train rolls on without you. Everything hurts.", back);
    }
    if (ch(p)) {
      sfx(true);
      let g = ri(c.lo, c.hi);
      g = price(g);
      if (crewOn) g = Math.round(g * 0.75);
      addMoney(g);
      x.rail.jobs++;
      x.rail.loot += g;
      x.rail.heat = ch(0.5) ? 2 : 1;
      stat("Happiness", ri(8, 15));
      sayIt(`I robbed a train and got away with ${money(g)}.`);
      if (!crewOn || !ch(0.12)) return note("Clean getaway", `You clear the cars before the next station. ${money(g)} in the bag. The feds will be looking.`, back);
      return note("Clean getaway", `${money(g)} in the bag, but someone in your crew has a big mouth.`, () => (x.rail.heat = 3, back()));
    }
    if (ch(0.3)) {
      stat("Health", -ri(20, 45));
      const g = price(Math.round(ri(c.lo, c.hi) * 0.3));
      addMoney(g);
      sayIt("I got shot during a train robbery.");
      return note("Shot", `The guards open fire. You get out with ${money(g)} and a bullet in your side.`, () => caught("assaulting a rail guard", "Hospital, then handcuffs. The cops were waiting."));
    }
    caught("train robbery", "The guards were ready. A federal agent was riding in the second car and you walk straight into him.");
  }

  // ------------------------------------------------------------------ yearly: shark, feds
  function yearly() {
    if (!state || state.dead) return;
    const x = X();
    if (x.year === state.age) return;
    x.year = state.age;
    if (x.bet.debt > 0) {
      x.bet.debt = Math.round(x.bet.debt * 1.35);
      if (cash() >= x.bet.debt) {
        addMoney(-x.bet.debt);
        x.bet.debt = 0;
        setTimeout(() => note("The shark collected", "Two men picked up what you owed, with interest. At least it is over."), 600);
      } else if (x.bet.debt > price(1500)) {
        stat("Health", -ri(8, 20));
        stat("Happiness", -ri(6, 12));
        sayIt("Loan sharks beat me up over my gambling debt.");
        setTimeout(() => note("The shark's men", `You owe ${money(x.bet.debt)}. They break two of your ribs to make the point.`), 600);
      }
    }
    if (x.rail.heat > 0) {
      x.rail.heat--;
      if (ch(0.18) && !state.prison) setTimeout(() => caught("train robbery", "Federal agents trace the loot back to you. They are at your door at dawn."), 800);
    }
  }

  // ------------------------------------------------------------------ hooks
  function boot() {
    if (typeof state === "undefined" || typeof jCard !== "function" || typeof notice !== "function" || typeof openCrime !== "function" || typeof crimeEvent !== "function" || typeof arrest !== "function" || typeof CRIMES_OFF === "undefined" || typeof sList === "undefined" || !document.getElementById("ageBtn")) return setTimeout(boot, 80);
    addCharges();
    try {
      CRIMES_OFF.delete("train");
    } catch (e) {
      warn("train", e);
    }
    const origEvent = crimeEvent;
    window.crimeEvent = function (t) {
      try {
        const k = t && t[0];
        if (k === "train") return train();
        if (k === "betting") return bet();
        if (k === "trespass") return trespass();
        if (k === "streetrace") return race();
      } catch (e) {
        warn("event", e);
      }
      return origEvent.apply(this, arguments);
    };
    const origCrime = openCrime;
    window.openCrime = function () {
      const r = origCrime.apply(this, arguments);
      try {
        [["betting", bet], ["trespass", trespass], ["streetrace", race]].forEach(([k, fn]) => {
          const el = sList.querySelector(`[data-cr="${k}"]`);
          if (el && !el.classList.contains("dis")) el.onclick = () => (snd("choice"), fn());
        });
      } catch (e) {
        warn("rows", e);
      }
      return r;
    };
    document.getElementById("ageBtn").addEventListener("click", () =>
      setTimeout(() => {
        try {
          yearly();
        } catch (e) {
          warn("year", e);
        }
      }, 700),
    );
    console.log("[crime-extra] loaded");
  }

  window.FL_CRIMEX = { trespass, race, bet, train, state: X, yearly };
  boot();
})();
