/* [mod] Special career "Drift Boy" for YourLife (local mod, id "drift-boy" in modloader.js).
 * Shows up in Occupation > Special Careers. It does not touch game.html: it wraps openSpecialCareers and hooks #ageBtn.
 * State: state.drift (plain JSON, per life). Cars are the normal state.cars; tuning lives on each car (car.dt).
 * Path: illegal street runs -> local tournaments -> pro league, with sponsors on the way. Tandem battles are the
 * "key matches": you lead and you chase, the judges score Angle, Speed and Line.
 * Rule: text inside the code is plain English strings (no i18n yet).
 */
(() => {
  "use strict";
  if (window.FL_DRIFT) return;
  const CAREER = "Drift Boy";
  const ICON = "emoji/1f3ce-fe0f.png";
  const E = (c) => `emoji/${c}.png`;
  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const clampN = (v, a, b) => Math.max(a, Math.min(b, v));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const money = (n) => (typeof usd === "function" ? usd(n) : "$" + Math.round(n).toLocaleString("en-US"));
  const price = (n) => (!n ? 0 : typeof localPrice === "function" ? localPrice(n) : n);
  const say = (t) => typeof window.say === "function" && window.say(t);
  const chev = () => (typeof CHEV !== "undefined" ? CHEV : "");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // ------------------------------------------------------------------ world
  const STAGES = [
    { t: "Street Racer", sub: "Illegal runs after midnight" },
    { t: "Local Circuit Driver", sub: "Local tournaments and sponsors" },
    { t: "Pro Drift Driver", sub: "The pro league" },
    { t: "Drift King", sub: "The name everyone knows" },
  ];
  // judges weigh Angle / Speed / Line differently at every place
  const VENUES = [
    { id: "lot", n: "Abandoned Port Lot", ico: E("1f697"), stage: 0, w: [1.2, 1, 1], risk: 0, ease: 0.04, heat: 14, street: true, txt: "Concrete, cranes and one very tired security guard." },
    { id: "tokyo", n: "Tokyo · Daikoku & the Shuto", ico: E("1f5fc"), stage: 0, w: [1.4, 1, 1], risk: 0.1, ease: 0, heat: 18, street: true, txt: "Neon, tunnels and a parking area full of legends." },
    { id: "local", n: "Local Circuit", ico: E("1f3c1"), stage: 1, w: [1, 1, 1.2], risk: 0.02, ease: 0.03, heat: 0, street: false, txt: "A small track with real judges and real tyre walls." },
    { id: "hakone", n: "Hakone Turnpike", ico: E("26f0-fe0f"), stage: 1, w: [1, 0.9, 1.5], risk: 0.2, ease: -0.04, heat: 0, street: false, txt: "Mountain hairpins in the mist. One mistake and the guardrail wins." },
    { id: "fuji", n: "Fuji Speedway", ico: E("1f3ce-fe0f"), stage: 2, w: [1, 1.5, 1], risk: 0.08, ease: -0.02, heat: 0, street: false, txt: "Long straights, huge crowds and the mountain watching." },
  ];
  const venueById = (id) => VENUES.find((v) => v.id === id) || VENUES[0];

  // Japanese classics and the three best cars to start with (sprites are the JDM sheet in cars/)
  const STARTERS = [
    { make: "Nissan", model: "Silvia S15", sprite: "jdm-49", color: "white", price: 24000, dbonus: 15, note: "Balanced, tuneable and the drift car everyone dreams about." },
    { make: "Toyota", model: "AE86 Trueno", sprite: "jdm-08", color: "white", price: 18000, dbonus: 14, note: "Light, tail-happy and legendary in the mountains." },
    { make: "Mazda", model: "RX-7 FD", sprite: "jdm-15", color: "yellow", price: 32000, dbonus: 13, note: "Rotary scream and perfect weight balance." },
  ];
  const CLASSICS = [
    { make: "Nissan", model: "Skyline 2000GT", sprite: "jdm-01", color: "white", price: 21000, dbonus: 8 },
    { make: "Nissan", model: "Laurel C33", sprite: "jdm-02", color: "black", price: 9000, dbonus: 6 },
    { make: "Toyota", model: "Chaser JZX90", sprite: "jdm-03", color: "red", price: 11000, dbonus: 9 },
    { make: "Nissan", model: "Cefiro A31", sprite: "jdm-04", color: "white", price: 7500, dbonus: 7 },
    { make: "Mazda", model: "Savanna RX-7 FC", sprite: "jdm-06", color: "yellow", price: 14000, dbonus: 10 },
    { make: "Nissan", model: "Silvia S13", sprite: "jdm-09", color: "red", price: 12000, dbonus: 12 },
    { make: "Nissan", model: "Silvia S14", sprite: "jdm-10", color: "white", price: 15000, dbonus: 12 },
    { make: "Toyota", model: "Soarer", sprite: "jdm-13", color: "blue", price: 13000, dbonus: 8 },
    { make: "Nissan", model: "180SX", sprite: "jdm-14", color: "white", price: 16000, dbonus: 13 },
    { make: "Toyota", model: "Mark II JZX100", sprite: "jdm-17", color: "silver", price: 12500, dbonus: 9 },
    { make: "Nissan", model: "Skyline GT-R R32", sprite: "jdm-18", color: "red", price: 38000, dbonus: 11 },
    { make: "Toyota", model: "Cresta", sprite: "jdm-07", color: "silver", price: 8000, dbonus: 6 },
  ];
  const TYPE_BASE = { coupe: 56, convertible: 50, sedan: 46, hatchback: 46, wagon: 40, "4x4": 26, suv: 28, truck: 20, van: 14 };
  const JDM_MAKES = /nissan|toyota|mazda|subaru|mitsubishi|honda|lexus|infiniti|acura/i;
  const PARTS = [
    { id: "tires", n: "Tires", ico: E("1f6de"), base: 600, text: "Grip you can slide on" },
    { id: "susp", n: "Suspension", ico: E("1f527"), base: 1200, text: "Coilovers and a lower stance" },
    { id: "diff", n: "Differential", ico: E("1f527"), base: 1800, text: "A locked rear that kicks the tail out on demand" },
    { id: "turbo", n: "Turbo", ico: E("1f4a8"), base: 3000, text: "More boost, more smoke" },
  ];
  const SPONSORS = [
    { n: "Kaze Tires", min: 0 }, { n: "Ryu Engine Oil", min: 0 }, { n: "Hanabi Energy Drink", min: 10 }, { n: "Torque Garage", min: 15 },
    { n: "Sakura Audio", min: 20 }, { n: "Tetsu Performance Parts", min: 30 }, { n: "Mizu Mineral Water", min: 20 }, { n: "Koga Racing Wear", min: 35 },
    { n: "Aoi Streetwear", min: 25 }, { n: "Fuji Auto Finance", min: 45 }, { n: "Raijin Turbochargers", min: 55 }, { n: "Yamato Motors", min: 70 },
  ];
  const FIRST = ["Kenji", "Daichi", "Ryo", "Takumi", "Haruto", "Sota", "Kaito", "Yuma", "Ren", "Itsuki", "Shin", "Naoki", "Hiro", "Jun", "Taro", "Akira"];
  const LAST = ["Tanaka", "Sato", "Mori", "Hayashi", "Kondo", "Ishii", "Fujita", "Nakano", "Okada", "Kimura", "Inoue", "Aoki", "Matsuda", "Abe", "Ota", "Endo"];
  const NICK = ["Ghost", "Smoke", "Viper", "Drift God", "Midnight", "Rocket", "Tofu", "Sakura", "Raijin", "Oni", "Kamikaze", "Fox", "Shadow", "Storm"];

  // ------------------------------------------------------------------ state
  const D = () => {
    const d = (state.drift ||= {});
    if (!d.v) Object.assign(d, { v: 1, active: false, stage: 0, rep: 0, heat: 0, ctl: 15, ref: 15, phy: 15, wins: 0, losses: 0, titles: 0, fol: 0, sponsors: [], co: null, mech: null, car: 0, years: 0, earned: 0, japan: 0, evDone: {}, classics: null });
    if (!d.yr || d.yr.age !== state.age) d.yr = { age: state.age, acts: 0, wins: 0, tour: 0, trained: 0 };
    return d;
  };
  const MAX_ACTS = 7;
  const cars = () => (Array.isArray(state.cars) ? state.cars : (state.cars = []));
  const car = () => {
    const d = D();
    const l = cars();
    if (!l.length) return null;
    if (!l[d.car]) d.car = 0;
    return l[d.car];
  };
  const carName = (c) => (c ? `${c.make || ""} ${c.model || ""}`.trim() : "no car");
  const carImg = (c) => (c && c.sprite ? `cars/${c.sprite}.png` : `cars/${(c && c.type) || "coupe"}-${(c && c.color) || "black"}.png`);
  const tune = (c) => (c.dt ||= { tires: 0, susp: 0, diff: 0, turbo: 0 });
  const carRating = (c) => {
    if (!c) return 0;
    const t = tune(c);
    const base = TYPE_BASE[String(c.type || "").toLowerCase()] ?? 44;
    const val = Math.min(14, (Number(c.price) || Number(c.base) || 0) / 18000);
    const jdm = JDM_MAKES.test(c.make || "") ? 6 : 0;
    const shop = Math.min(40, (c.parts || []).reduce((a, p) => a + (Number(p.bonus) || 0), 0)); // parts bought at JDM Mods
    const parts = (t.tires + t.susp + t.diff + t.turbo) * 2.2 + shop;
    const cond = Number.isFinite(Number(c.cond)) ? Number(c.cond) : 90;
    return clampN((base + val + jdm + (c.dbonus || 0) + parts) * (0.6 + cond / 250), 5, 100);
  };
  const skill = () => {
    const d = D();
    const c = car();
    const team = (d.co ? 4 : 0) + (d.mech ? 2 : 0);
    const hap = state.stats && Number.isFinite(state.stats.Happiness) ? (state.stats.Happiness - 50) / 12 : 0;
    return clampN(0.4 * carRating(c) + 0.35 * d.ctl + 0.1 * d.ref + 0.05 * d.phy + 0.1 * (50 + team * 3 + hap * 2), 5, 99);
  };
  const stageName = (d) => STAGES[d.stage].t;

  // ------------------------------------------------------------------ effects
  function fx(d, f) {
    const rows = [];
    const sg = (n) => (n > 0 ? "+" : "") + n;
    const stat = (k, name) => {
      if (!f[k]) return;
      const b = d[k];
      d[k] = clampN(d[k] + f[k], 0, 100);
      if (d[k] !== b) rows.push([name, sg(d[k] - b)]);
    };
    if (f.money) {
      const m = price(Math.abs(f.money)) * Math.sign(f.money);
      state.money = (state.money || 0) + m;
      if (m > 0) {
        d.earned += m;
        if (typeof chaChing === "function") chaChing();
      }
      rows.push(["Money", `${m > 0 ? "+" : "-"}${money(Math.abs(m))}`]);
    }
    stat("ctl", "Control");
    stat("ref", "Reflexes");
    stat("phy", "Fitness");
    stat("rep", "Reputation");
    stat("heat", "Police heat");
    if (f.fol) {
      d.fol = Math.max(0, d.fol + f.fol);
      rows.push(["Followers", sg(f.fol)]);
    }
    for (const [k, name] of [["hp", "Health"], ["hap", "Happiness"]]) {
      if (!f[k] || !state.stats) continue;
      state.stats[name] = clampN((state.stats[name] || 0) + f[k], 0, 100);
      rows.push([name, sg(f[k])]);
    }
    if (f.cond) {
      const c = car();
      if (c) {
        const b = Number.isFinite(Number(c.cond)) ? Number(c.cond) : 90;
        c.cond = clampN(b + f.cond, 1, 100);
        rows.push(["Car condition", sg(Math.round(c.cond - b))]);
      }
    }
    if (f.mech && d.mech) d.mech.rel = clampN(d.mech.rel + f.mech, 0, 100);
    if (typeof renderStats === "function") renderStats();
    return rows;
  }

  const card = (title, lead, rows, after, icon) =>
    jCard({ tag: CAREER, iconSrc: icon || ICON, title, lead, rows: rows || [], choices: [["OK", after || (() => {})]] });
  const ask = (title, lead, choices, rows, icon) => jCard({ tag: CAREER, iconSrc: icon || ICON, title, lead, rows: rows || [], choices });
  const q = (fn) => (typeof queuePopup === "function" ? queuePopup(fn) : setTimeout(fn, 400));

  // police: heat makes street activities risky
  function police(d, base, after) {
    const done = after || (() => {});
    if (rnd() >= base + d.heat / 350) return done();
    ask("Blue lights", "Sirens behind you. The officer is not in a good mood and neither is your tyre pressure.", [
      ["Floor it and drift away", () => {
        if (rnd() < clampN(0.35 + skill() / 160, 0.2, 0.85)) {
          const rows = fx(d, { rep: 4, heat: -10, cond: -4 });
          card("Gone", "You slide through the last junction sideways and the lights vanish in your mirror. Legends are made of nights like this.", rows, done);
        } else {
          d.heat = 0;
          fx(d, { cond: -18 });
          if (typeof arrest === "function") arrest("reckless driving", [1, 3]);
          else card("Busted", "They boxed you in. It is over.", [], done);
        }
      }],
      ["Pull over and talk", () => {
        const fine = price(ri(300, 1400));
        state.money = Math.max(0, (state.money || 0) - fine);
        d.heat = Math.max(0, d.heat - 25);
        if (typeof renderStats === "function") renderStats();
        say("I got stopped by the police after a night of drifting.");
        card("A long lecture", `You get a ticket and a speech about your future. Fine: ${money(fine)}.`, [["Police heat", "reset a bit"]], done);
      }],
    ]);
  }

  // ------------------------------------------------------------------ tandem battle
  const DECISIONS = [
    { n: "Entry", lead: "The first corner is coming up fast.", o: ["Huge angle on the entry", "Match their speed", "Take the clean line in"] },
    { n: "Mid-corner", lead: "You are sideways in the middle of the bend.", o: ["Add more throttle and stay sideways", "Hold the drift steady", "Straighten up a little and stay smooth"] },
    { n: "Transition", lead: "A fast change of direction is next.", o: ["Flick it as hard as you can", "Time the weight transfer", "Slow transition, perfect line"] },
    { n: "Clipping point", lead: "The inside clipping point is right there.", o: ["Kiss the wall", "Aim for the clipping point", "Leave a metre and stay safe"] },
    { n: "Exit", lead: "The exit opens onto the straight.", o: ["Full power, tail hanging out", "Catch it and go", "Straighten early"] },
    { n: "Final corner", lead: "The last corner decides everything.", o: ["Throw it in with everything", "Commit to the line", "Don't risk it, bring it home"] },
  ];
  // reward, ease (higher = easier) and crash chance of the three choices
  const OPTS = [{ r: 3, e: -0.18, c: 0.1, cat: 0 }, { r: 2, e: 0, c: 0.03, cat: 1 }, { r: 1, e: 0.18, c: 0, cat: 2 }];
  const CATS = ["Angle", "Speed", "Line"];

  function makeOpp(d, base) {
    const lvl = d.stage === 0 ? [24, 50] : d.stage === 1 ? [44, 70] : d.stage === 2 ? [64, 92] : [78, 97];
    const s = clampN(ri(lvl[0], lvl[1]) + (base || 0), 10, 98);
    return { name: `${pick(FIRST)} ${pick(LAST)}`, nick: pick(NICK), skill: s };
  }

  /* opts: { venue, opp, perRun, label, onDone(res) } -> res: { win, crash, margin, omt } */
  function tandem(d, o) {
    const V = venueById(o.venue);
    const per = o.perRun || 2;
    const opp = o.opp;
    const me = { cat: [0, 0, 0], total: 0 };
    const them = { cat: [0, 0, 0], total: 0 };
    let run = 0;
    let step = 0;
    const order = DECISIONS.slice().sort(() => rnd() - 0.5).slice(0, per);
    const fin = (crash) => {
      const w = V.w;
      const score = (s) => s.cat.reduce((a, v, i) => a + v * w[i], 0);
      const a = Math.round(score(me) * 10) / 10;
      const b = Math.round(score(them) * 10) / 10;
      const margin = Math.round((a - b) * 10) / 10;
      const rows = [
        ["Angle", `${me.cat[0]} vs ${them.cat[0]}`],
        ["Speed", `${me.cat[1]} vs ${them.cat[1]}`],
        ["Line", `${me.cat[2]} vs ${them.cat[2]}`],
        ["Judges' score", `${a} vs ${b}`],
      ];
      if (crash) return o.onDone({ win: false, crash: true, margin: -9, rows });
      if (Math.abs(margin) <= 1.5) {
        // One More Time
        return ask("One More Time!", `The judges cannot split you and ${opp.name}. Both cars go again, one corner, winner takes it.`, [
          ["Go all in", () => omt(0.28)],
          ["Drive your line", () => omt(0.1)],
          ["Stay calm", () => omt(0)],
        ], rows);
      }
      o.onDone({ win: margin > 0, crash: false, margin, rows });
      function omt(bias) {
        const p = clampN(0.5 + (skill() - opp.skill) / 160 + (bias ? (rnd() < 0.5 ? bias : -bias) * 0.5 : 0.04), 0.15, 0.85);
        const win = rnd() < p;
        o.onDone({ win, crash: false, margin: win ? 0.5 : -0.5, omt: true, rows });
      }
    };
    const next = () => {
      if (step >= per) {
        step = 0;
        run++;
        if (run >= 2) return fin(false);
      }
      const dec = order[step];
      const lead = run === 0;
      ask(
        `${lead ? "Lead run" : "Chase run"} · ${dec.n}`,
        `${o.label ? o.label + "<br>" : ""}${lead ? "You lead and set the pace." : "You chase " + opp.name + " as close as you can."} ${dec.lead}`,
        dec.o.map((txt, i) => [txt, () => choose(i)]),
        [["Venue", V.n], ["Opponent", `${opp.name} "${opp.nick}"`], ["Your run", `${step + 1}/${per}`]],
      );
    };
    const choose = (i) => {
      const op = OPTS[i];
      const p = clampN(0.5 + (skill() - opp.skill) / 150 + op.e + V.ease, 0.12, 0.95);
      const crashP = op.c * (1 + V.risk) * clampN(1.25 - skill() / 150, 0.4, 1.3);
      if (rnd() < crashP) {
        return crashCard(d, V, () => fin(true));
      }
      const ok = rnd() < p;
      if (ok) {
        me.cat[op.cat] += op.r;
      }
      // the other driver
      const po = clampN(0.5 + (opp.skill - skill()) / 150 + (rnd() - 0.5) * 0.3, 0.1, 0.95);
      const oi = rnd() < 0.3 ? 0 : rnd() < 0.6 ? 1 : 2;
      if (rnd() < po) them.cat[OPTS[oi].cat] += OPTS[oi].r;
      step++;
      const txt = ok ? pick(["Clean. The crowd noise says it all.", "Smoke everywhere and the car obeys.", "You nail it.", "Perfect, the tail follows your hands."]) : pick(["A little wide. You lose some points.", "The tyres let go a bit too early.", "Not your best, but you stay on the road.", "You lose the angle and get it back."]);
      ask(ok ? "Nailed it" : "Messy", txt, [["Next", next]], null);
    };
    next();
  }

  function crashCard(d, V, after) {
    const cc = car();
    const dmg = Math.round(ri(14, 42) * (cc && cc.cage ? 0.7 : 1)); // a roll cage saves the car
    const hurt = rnd() < (cc && cc.harness ? 0.15 : 0.3) ? ri(4, 18) : 0; // a harness saves you
    const rows = fx(d, { cond: -dmg, hp: -hurt, rep: V.street ? 0 : -3, heat: V.street ? 12 : 0 });
    say("I crashed my car in a drift battle.");
    ask("Crash!", "You lose the car and hit the wall. Glass, dust, silence. Then the crowd starts breathing again.", [["Get out of the car", after]], rows);
  }

  // ------------------------------------------------------------------ battles, tournaments
  function streetBattle() {
    const d = D();
    const c = car();
    if (!c) return needCar();
    if (d.yr.acts >= MAX_ACTS) return tired();
    d.yr.acts++;
    const venue = d.stage === 0 ? pick(["lot", "tokyo"]) : pick(["lot", "tokyo", "local"]);
    const opp = makeOpp(d);
    const V = venueById(venue);
    ask("Challenge", `${opp.name} "${opp.nick}" flashes his lights at the meet: tandem battle at ${V.n}.<br><br>${V.txt}`, [
      ["Accept the battle", () => tandem(d, { venue, opp, perRun: d.stage === 0 ? 2 : 3, label: V.n, onDone: (r) => battleResult(d, r, opp, V, { prize: ri(300, 1500) * (1 + d.stage), rep: ri(3, 7) }) })],
      ["Not tonight", () => {}],
    ], [["Opponent skill", `${opp.skill >= skill() + 10 ? "Higher than yours" : opp.skill <= skill() - 10 ? "Lower than yours" : "About even"}`]]);
  }

  function battleResult(d, r, opp, V, rew) {
    const heat = V.street ? V.heat : 0;
    let f;
    let title;
    let lead;
    if (r.win) {
      d.wins++;
      d.yr.wins++;
      f = { rep: rew.rep, money: rew.prize, fol: ri(20, 120) * (1 + d.stage), heat, hap: 3, cond: -ri(0, 5) };
      title = "You win!";
      lead = `${opp.name} flashes his hazards in respect. ${r.omt ? "It took a One More Time and you were the one still sliding." : "The judges did not need a second look."}`;
      say(`I won a tandem battle against ${opp.name} at ${V.n}.`);
    } else {
      d.losses++;
      f = { rep: r.crash ? -2 : -1, heat: Math.round(heat / 2), hap: -3, fol: ri(0, 25) };
      title = r.crash ? "Out" : "You lose";
      lead = r.crash ? "A crash is a loss. The car goes on a trailer." : `${opp.name} takes it. The crowd cheers for him and you walk back to the car.`;
      say(`I lost a tandem battle against ${opp.name}.`);
    }
    const rows = [...r.rows, ...fx(d, f)];
    checkStage(d, () => {});
    card(title, lead, rows, () => {
      if (V.street) police(d, 0.1);
    });
  }

  function tournament() {
    const d = D();
    const c = car();
    if (!c) return needCar();
    if (d.stage < 1) return card("Not yet", "Local tournaments want a name first. Win some street battles and build a reputation.", [["Wins needed", "4"], ["Reputation needed", "20%"]]);
    if (d.yr.tour >= 1) return card("Already entered", "You already ran a tournament this year. The next one is next season.");
    if (d.yr.acts >= MAX_ACTS) return tired();
    d.yr.tour++;
    d.yr.acts++;
    const venue = d.stage >= 2 ? pick(["hakone", "fuji"]) : pick(["local", "hakone"]);
    const V = venueById(venue);
    const rounds = [{ n: "Round of 8", per: 2, bonus: -4 }, { n: "Semi-final", per: 3, bonus: 2 }, { n: "Final", per: 3, bonus: 8 }];
    let r = 0;
    const play = () => {
      const R = rounds[r];
      const opp = makeOpp(d, R.bonus);
      ask(`${d.stage >= 2 ? "Pro league" : "Local tournament"} · ${R.n}`, `${V.n}. ${V.txt}<br><br>${opp.name} "${opp.nick}" is waiting at the top of the course.`, [
        ["Start the battle", () => tandem(d, { venue, opp, perRun: R.per, label: `${R.n} · ${V.n}`, onDone: (res) => {
          if (!res.win) {
            d.losses++;
            const rows = [...res.rows, ...fx(d, { rep: -2, hap: -4, fol: ri(10, 60) })];
            return card(res.crash ? "Crashed out" : `Out in the ${R.n}`, res.crash ? "Your run ends against the wall." : "The bracket closes. Next year is another chance.", rows, () => {});
          }
          d.wins++;
          d.yr.wins++;
          r++;
          if (r >= rounds.length) {
            d.titles++;
            const pr = price(ri(6000, 14000) * (1 + d.stage * 2.2));
            state.money = (state.money || 0) + pr;
            d.earned += pr;
            const rows = [...res.rows, ["Prize", money(pr)], ...fx(d, { rep: ri(10, 18), fol: ri(800, 2500) * (1 + d.stage), hap: 8, cond: -ri(2, 8) })];
            if (typeof chaChing === "function") chaChing();
            say(`I won a drift tournament at ${V.n}.`);
            checkStage(d, () => {});
            return card("CHAMPION!", `You win the tournament at ${V.n}. The trophy is bigger than the passenger seat.`, rows);
          }
          const rows = [...res.rows, ...fx(d, { rep: 2, fol: ri(30, 150) })];
          card(`Through to the ${rounds[r].n.toLowerCase()}`, `You beat ${opp.name}. The next battle starts soon.`, rows, play);
        } }) ],
      ]);
    };
    play();
  }

  // ------------------------------------------------------------------ progression
  function checkStage(d, after) {
    let s = d.stage;
    if (s === 0 && d.wins >= 4 && d.rep >= 20) s = 1;
    if (s === 1 && d.wins >= 12 && d.rep >= 50 && (d.sponsors.length || d.wins >= 16)) s = 2;
    if (s === 2 && d.titles >= 2 && d.rep >= 85) s = 3;
    if (s !== d.stage) {
      d.stage = s;
      refreshJob(d);
      say(`I am now a ${STAGES[s].t}.`);
      q(() => card("Promotion", `You are now a ${STAGES[s].t}. ${s === 1 ? "Local tournaments and sponsors open up." : s === 2 ? "The pro league wants you, and Japan wants to see you." : "Everybody knows the name."}`, [["Rank", STAGES[s].t]], after));
    } else after();
  }
  function refreshJob(d) {
    if (state.job && !state.job.drift) return; // never replace a real job
    state.job = { t: STAGES[d.stage].t, c: "Motorsport", emp: "Drift scene", pay: 0, icon: ICON, drift: true, perf: clampN(40 + d.rep / 2, 0, 100) };
    if (typeof renderAvatar === "function") renderAvatar();
    if (typeof renderStats === "function") renderStats();
  }
  function needCar() {
    return ask("No car", "You need a car to drift. Visit the garage section to pick one.", [["Choose a car", () => carMenu()], ["Later", () => {}]]);
  }
  function tired() {
    card("Rest a bit", "You already drove your tyres off this year. Give the body and the car a break until next year.");
  }

  // ------------------------------------------------------------------ activities (5 outcomes each)
  // [text, effects]   money values are in base dollars (price() localises them)
  const ACT = {
    parking: {
      t: "Parking lot practice", s: "Free. Cones, tyre smoke and patience", ico: E("1f697"), cost: 0, group: "Train",
      out: [
        ["You run figure-eights until the cones scream. Your hands start to understand the car.", { ctl: 4, hap: 2 }],
        ["A perfect donut and a clean transition. You finally feel the weight shift.", { ctl: 5, cond: -1 }],
        ["The security guard chases you out, but you got a good hour of practice first.", { ctl: 3, heat: 5 }],
        ["You spin out twice and nearly hit a shopping cart, then you nail the next one.", { ctl: 3, cond: -2 }],
        ["Somebody films the whole session and tags you. Free clips.", { ctl: 3, fol: 60 }],
      ],
    },
    track: {
      t: "Track day", s: "A real circuit. Tyres are not cheap", ico: E("1f3c1"), cost: 400, group: "Train",
      out: [
        ["An instructor rides along and fixes your entry in three laps.", { ctl: 7, cond: -2 }],
        ["Clean laps all day. The lap time falls and so does your fear.", { ctl: 6, hap: 3 }],
        ["You push too hard and put a wheel in the gravel. Dirty car, clean lesson.", { ctl: 5, cond: -6 }],
        ["Another driver lets you follow him for a session. You copy every move.", { ctl: 8 }],
        ["A tyre goes on lap nine. Expensive, but you learned to catch a slide.", { ctl: 6, cond: -4, money: -350 }],
      ],
    },
    sim: {
      t: "Simulator", s: "Cheap. Small gains, zero crashes", ico: E("1f3ae"), cost: 60, group: "Train",
      out: [
        ["Two hours on a rig. Your inputs get smoother.", { ctl: 2 }],
        ["A friend's wheel and pedals. You beat his ghost lap and nothing breaks.", { ctl: 2, hap: 2 }],
        ["You learn a new line and spend an hour telling people about it.", { ctl: 2, hap: 1 }],
        ["The rig has a lot of lag, but you get your reflexes up a bit.", { ctl: 1, ref: 1 }],
        ["A virtual Hakone run. You wake up with hands full of cramps.", { ctl: 2, phy: 1 }],
      ],
    },
    replays: {
      t: "Study replays & pros", s: "Free. Watch how the best slide", ico: E("1f4fa"), cost: 0, group: "Train",
      out: [
        ["You watch a legend's onboard fifty times. His hands are always calm.", { ctl: 2 }],
        ["You pause on every transition and finally see the weight transfer.", { ctl: 3 }],
        ["A pro tells you in a comment which line you were missing.", { ctl: 2, fol: 25 }],
        ["You study tandem battles frame by frame and spot how the chaser stays close.", { ctl: 2, ref: 1 }],
        ["You watch until 4 AM. You learn a lot and sleep none.", { ctl: 3, hap: -2 }],
      ],
    },
    reflex: {
      t: "Reflexes & fitness", s: "Gym, reaction drills and neck work", ico: E("1f4aa"), cost: 30, group: "Train",
      out: [
        ["Reaction ball and neck training. The G-forces start to feel smaller.", { ref: 4, phy: 3 }],
        ["A sensei makes you catch falling sticks for an hour. Your hands wake up.", { ref: 5, phy: 1 }],
        ["Intense cardio and core work. Your back hurts, your stamina does not.", { ref: 2, phy: 5, hp: 1 }],
        ["You overtrain and pull a muscle, but your reflexes are better than ever.", { ref: 4, phy: 2, hp: -3 }],
        ["A morning run, a strong breakfast and a very focused day.", { ref: 3, phy: 3, hap: 2 }],
      ],
    },
    meet: {
      t: "Car meet", s: "Free. Sponsors, rivals and senseis show up", ico: E("1f465"), cost: 0, group: "Street & Community",
      out: [
        ["A sponsor scout hands you a card. He liked how you parked.", { rep: 3, fol: 80 }, "sponsor"],
        ["A rival laughs at your car. You answer on the next run.", { rep: 2, fol: 40 }, "rival"],
        ["An old driver watches you leave. He nods and says you have the hands.", { ctl: 3, rep: 2 }, "sensei"],
        ["Pizza, music and car talk until sunrise. Nothing happens. Perfect night.", { hap: 5, rep: 1 }],
        ["Somebody calls the police and everybody scatters.", { heat: 10, rep: 1 }, "police"],
      ],
    },
    takeover: {
      t: "Street takeover", s: "Fast fame. The heat comes with it", ico: E("1f4a8"), cost: 0, group: "Street & Community", min: 16,
      out: [
        ["You block the intersection and burn a perfect donut. Phones everywhere.", { rep: 6, heat: 18, fol: 400 }],
        ["The crowd goes wild. It is the best night of your life so far.", { rep: 7, heat: 20, fol: 600, hap: 5 }],
        ["The cops show up early and everybody runs, but the clip goes viral.", { rep: 4, heat: 25, fol: 900 }],
        ["A bystander gets mad about the noise. The night ends early and you get a bit of fame.", { rep: 3, heat: 12, fol: 150 }],
        ["A drift train of six cars and you right in the middle. Huge.", { rep: 8, heat: 22, fol: 700, hap: 4 }],
      ],
    },
    clips: {
      t: "Post your clips", s: "Followers, a bit of money, a bit of drama", ico: E("1f4f1"), cost: 0, group: "Street & Community",
      out: [
        ["A clip of your best slide goes around. Followers pour in.", { fol: 600, rep: 3 }],
        ["A big page reposts you. Your phone does not stop for a day.", { fol: 1500, rep: 4, hap: 3 }],
        ["The clip flops, but one comment gives you good advice.", { fol: 40, ctl: 1 }],
        ["A brand notices the video and pays you for a short ad.", { fol: 350, money: 600 }],
        ["A hater comments on every post. You keep posting.", { fol: 200, rep: 1, hap: -2 }],
      ],
    },
    mechanic: {
      t: "Visit your mechanic", s: "Repairs, advice and the occasional scam", ico: E("1f527"), cost: 0, group: "Car",
    },
    tuning: { t: "Tuning shop", s: "Tires, suspension, differential, turbo", ico: E("1f6de"), cost: 0, group: "Car" },
    chassis: { t: "Garage & chassis", s: "Change your drift car or find a classic", ico: E("1f697"), cost: 0, group: "Car" },
    sponsors: { t: "Meet sponsors", s: "Negotiate a contract", ico: E("1f4bc"), cost: 0, group: "Career", min: 1 },
    team: { t: "Build your team", s: "Hire a co-driver or a mechanic", ico: E("1f91d"), cost: 0, group: "Career" },
    japan: { t: "Travel to Japan", s: "Compete or train in the mountains", ico: E("2708-fe0f"), cost: 0, group: "Career" },
  };

  function doSimpleAct(id) {
    const d = D();
    const a = ACT[id];
    if (!car()) return needCar();
    if (state.age < (a.min || 0)) return card(a.t, "You are too young for this.");
    if (d.yr.acts >= MAX_ACTS) return tired();
    const cost = price(a.cost);
    if (cost && (state.money || 0) < cost) return card("Not enough money", `${a.t} costs ${money(cost)}.`);
    d.yr.acts++;
    if (cost) state.money -= cost;
    d.yr.trained += a.group === "Train" ? 1 : 0;
    const [text, f, special] = pick(a.out);
    const rows = fx(d, f);
    if (cost) rows.unshift(["Cost", "-" + money(cost)]);
    say(`${a.t}: ${text}`);
    const after = () => {
      checkStage(d, () => {});
      if (special === "police") police(d, 0.35);
      else if (id === "takeover") police(d, 0.4);
    };
    if (special === "sponsor") {
      return card(a.t, text, rows, () => {
        if (d.stage >= 1) offerSponsor(d, true);
        else after();
      });
    }
    if (special === "rival") {
      return card(a.t, text, rows, () => {
        const opp = makeOpp(d, 4);
        const V = venueById(d.stage === 0 ? "lot" : "local");
        ask("A rival appears", `${opp.name} "${opp.nick}" wants to settle it. Tandem battle, no prize but pride.`, [
          ["Accept", () => tandem(d, { venue: V.id, opp, perRun: 2, label: V.n, onDone: (r) => battleResult(d, r, opp, V, { prize: 0, rep: 5 }) })],
          ["Walk away", () => fx(d, { rep: -1 })],
        ]);
      });
    }
    if (special === "sensei") {
      d.sensei = true;
      return card(a.t, text + " You now have a sensei, and he will answer when you ask.", rows, after);
    }
    card(a.t, text, rows, after);
  }

  // ----- mechanic and tuning
  function ensureMech(d) {
    if (!d.mech) d.mech = { name: `${pick(["Ryo", "Goro", "Ken", "Tetsu", "Sam", "Joji"])} ${pick(LAST)}`, rel: 40, hired: false };
    return d.mech;
  }
  function mechanicMenu() {
    const d = D();
    const c = car();
    if (!c) return needCar();
    const m = ensureMech(d);
    const cond = Number.isFinite(Number(c.cond)) ? Math.round(c.cond) : 90;
    const full = Math.round(price((100 - cond) * 40 * (m.hired ? 0.7 : 1)));
    ask(`${m.name}'s garage`, `Your mechanic knows your car and your bad habits. Trust: ${Math.round(m.rel)}%.`, [
      [`Repair the car (${money(full)})`, () => {
        if (cond >= 99) return card("Nothing to fix", "The car is in perfect shape.");
        if ((state.money || 0) < full) return card("Not enough money", `The repair costs ${money(full)}.`);
        d.yr.acts += 0;
        const roll = rnd();
        if (roll < 0.12 + (60 - m.rel) / 500 && m.rel < 70 && !m.hired) {
          state.money -= Math.round(full * 1.4);
          m.rel = clampN(m.rel - 8, 0, 100);
          c.cond = Math.min(100, cond + Math.round((100 - cond) * 0.5));
          if (typeof renderStats === "function") renderStats();
          return card("Overcharged", "The bill has parts you cannot find on the car. You paid anyway. Trust drops.", [["Trust", "-8"]]);
        }
        const discount = roll > 0.82 && m.rel >= 50;
        state.money -= discount ? Math.round(full * 0.7) : full;
        c.cond = 100;
        m.rel = clampN(m.rel + 4, 0, 100);
        if (typeof renderStats === "function") renderStats();
        card(discount ? "Friends and family price" : "Fixed", discount ? "He knocks 30% off. 'For the legend,' he says." : "Good as new, and the paint even matches.", [["Car condition", "100%"]]);
      }],
      ["Ask for advice", () => {
        if (d.yr.acts >= MAX_ACTS) return tired();
        d.yr.acts++;
        const ev = pick([
          ["He shows you how to read the tyre wear. Your entries get cleaner.", { ctl: 3, mech: 3 }],
          ["He tells you the diff setup of a pro champion. You keep notes.", { ctl: 2, mech: 3 }],
          ["He only wants to talk about his divorce. You listen for an hour.", { hap: -1, mech: 6 }],
          ["He lets you work on the car with him. Greasy hands, happy face.", { ctl: 2, hap: 3, mech: 4 }],
          ["He warns you your suspension needs love. He is right.", { mech: 2 }],
        ]);
        card("Mechanic talk", ev[0], fx(d, ev[1]));
      }],
      [m.hired ? "Your mechanic is on the team" : "Offer him a team job", () => {
        if (m.hired) return card("On the team", "He already works for you.");
        teamMenu();
      }, "gray"],
      ["Back", () => openDrift(), "gray"],
    ], [["Car condition", `${cond}%`], ["Trust", `${Math.round(m.rel)}%`]], carImg(c));
  }

  function partCost(c, p, d) {
    const lvl = tune(c)[p.id];
    const m = ensureMech(d);
    return Math.round(price(p.base * (lvl + 1) ** 1.4 * (m.hired ? 0.8 : 1)));
  }
  function tuningMenu() {
    const d = D();
    const c = car();
    if (!c) return needCar();
    const t = tune(c);
    ask(`Tuning · ${carName(c)}`, `Rating ${Math.round(carRating(c))}/100. Every level adds grip, control or power, up to 5.`, [
      ...PARTS.map((p) => [`${p.n} ${t[p.id]}/5 — ${t[p.id] >= 5 ? "maxed" : money(partCost(c, p, d))}`, () => buyPart(d, c, p)]),
      ["Back", () => openDrift(), "gray"],
    ], PARTS.map((p) => [p.n, "▮".repeat(t[p.id]) + "▯".repeat(5 - t[p.id])]), carImg(c));
  }
  function buyPart(d, c, p) {
    const t = tune(c);
    if (t[p.id] >= 5) return card(p.n, "This part is already maxed.", [], tuningMenu);
    if (d.yr.acts >= MAX_ACTS) return tired();
    const cost = partCost(c, p, d);
    if ((state.money || 0) < cost) return card("Not enough money", `${p.n} level ${t[p.id] + 1} costs ${money(cost)}.`, [], tuningMenu);
    const m = ensureMech(d);
    d.yr.acts++;
    const roll = rnd();
    let paid = cost;
    let txt;
    let up = 1;
    let f = {};
    if (roll < 0.1 && !m.hired && m.rel < 60) {
      paid = cost;
      up = 0;
      txt = "He took the money and fitted the cheap part from the other box. It is not what you asked for. Nothing improves.";
      f = { mech: -10 };
    } else if (roll < 0.28 && m.rel >= 45) {
      paid = Math.round(cost * 0.75);
      txt = "He gives you the friends price: 25% off.";
      f = { mech: 3 };
    } else if (roll < 0.4) {
      txt = "The part fits perfectly and he aligns the car for free. You feel it right away.";
      f = { ctl: 2, mech: 3 };
    } else if (roll < 0.5) {
      txt = "He upsells you a bonus tweak. You pay a little more and the car feels sharper.";
      paid = Math.round(cost * 1.12);
      f = { ctl: 1 };
    } else {
      txt = `${p.n} level ${t[p.id] + 1} installed. ${p.text}.`;
      f = { mech: 1 };
    }
    state.money -= paid;
    t[p.id] += up;
    const rows = [["Paid", "-" + money(paid)], ...fx(d, f)];
    if (typeof renderStats === "function") renderStats();
    say(`I upgraded my ${carName(c)}: ${p.n}.`);
    card("Tuning", txt, rows, tuningMenu);
  }

  // ----- chassis
  function newCar(def, d) {
    const c = { make: def.make, model: def.model, type: "coupe", color: def.color, price: def.price, base: def.price, age: ri(8, 30), cond: ri(55, 92), sprite: def.sprite, dbonus: def.dbonus, cls: "Drift", dt: { tires: 0, susp: 0, diff: 0, turbo: 0 }, id: "drift" + Math.random().toString(36).slice(2, 7) };
    cars().push(c);
    d.car = cars().length - 1;
    return c;
  }
  function chassisMenu() {
    const d = D();
    const l = cars();
    ask("Garage & chassis", "Pick the car you drive, buy a new one or hunt for a Japanese classic.", [
      ...l.slice(0, 6).map((c, i) => [`${i === d.car ? "● " : ""}${carName(c)} (rating ${Math.round(carRating(c))})`, () => { d.car = i; card("Drive this one", `${carName(c)} is now your drift car.`, [["Rating", Math.round(carRating(c)) + "/100"]], chassisMenu); }]),
      ["Start-up cars: Silvia, AE86, RX-7", () => starterShop(d)],
      ["Hunt a Japanese classic", () => classicShop(d)],
      ...(window.FL_JDMMODS ? [["Visit the JDM Mods shop", () => FL_JDMMODS.open()]] : []),
      ["Back", () => openDrift(), "gray"],
    ], [["Cars in garage", String(l.length)]]);
  }
  function starterShop(d, forced) {
    ask("The three best to start", "These are the cars every drifter wants first. Pick yours.", [
      ...STARTERS.map((s) => [`${s.make} ${s.model} — ${money(price(s.price))}`, () => buyDef(d, s, forced)]),
      forced ? ["Borrow your cousin's old hatchback", () => borrowCar(d)] : ["Back", () => chassisMenu(), "gray"],
    ], STARTERS.map((s) => [`${s.make} ${s.model}`, s.note]));
  }
  function borrowCar(d) {
    const c = { make: "Toyota", model: "Corolla Hatchback", type: "hatchback", color: "silver", price: 3500, base: 3500, age: 18, cond: 60, cls: "Drift", dt: { tires: 0, susp: 0, diff: 0, turbo: 0 }, dbonus: 0 };
    cars().push(c);
    d.car = cars().length - 1;
    card("A borrowed car", "Your cousin lets you take the old hatchback. It is slow, light and every bit of drifting starts here.", [], () => joinDone(d));
  }
  function buyDef(d, def, forced) {
    const cost = price(def.price);
    if ((state.money || 0) < cost) return card("Not enough money", `The ${def.make} ${def.model} costs ${money(cost)}.`, [], () => (forced ? starterShop(d, true) : chassisMenu()));
    state.money -= cost;
    const c = newCar(def, d);
    say(`I bought a ${carName(c)} to start drifting.`);
    if (typeof renderStats === "function") renderStats();
    card("New drift car", `The ${carName(c)} is yours. The tyres are already scared.`, [["Paid", "-" + money(cost)]], () => (forced ? joinDone(d) : chassisMenu()), carImg(c));
  }
  function classicShop(d) {
    if (!d.classics || d.classics.year !== state.age) d.classics = { year: state.age, list: CLASSICS.slice().sort(() => rnd() - 0.5).slice(0, 4).map((c) => ({ ...c, price: Math.round(c.price * (0.8 + rnd() * 0.5)), roll: rnd() })) };
    ask("Japanese classics for sale", "A broker has four to show you this year. Condition matters.", [
      ...d.classics.list.map((s) => [`${s.make} ${s.model} — ${money(price(s.price))}${s.roll < 0.25 ? " (rough)" : s.roll > 0.8 ? " (clean)" : ""}`, () => {
        const cost = price(s.price);
        if ((state.money || 0) < cost) return card("Not enough money", `It costs ${money(cost)}.`, [], () => classicShop(d));
        state.money -= cost;
        const c = newCar(s, d);
        c.cond = s.roll < 0.25 ? ri(30, 50) : s.roll > 0.8 ? ri(88, 99) : ri(60, 82);
        d.classics.list = d.classics.list.filter((x) => x !== s);
        if (typeof renderStats === "function") renderStats();
        say(`I found a ${carName(c)}.`);
        card("Classic found", `${carName(c)} is in the garage. ${s.roll < 0.25 ? "It needs a lot of love." : s.roll > 0.8 ? "It is almost mint." : "A decent car, a decent price."}`, [["Condition", Math.round(c.cond) + "%"]], chassisMenu, carImg(c));
      }]),
      ["Back", () => chassisMenu(), "gray"],
    ]);
  }
  function carMenu() {
    chassisMenu();
  }

  // ----- sponsors and team
  function offerSponsor(d, fromMeet) {
    const used = new Set(d.sponsors.map((s) => s.n));
    const pool = SPONSORS.filter((s) => d.rep >= s.min && !used.has(s.n));
    if (!pool.length || d.sponsors.length >= 2) return card("Sponsors", d.sponsors.length >= 2 ? "You already have two sponsors. That is all the stickers the car can take." : "Nobody new wants to talk right now.");
    const s = pick(pool);
    const need = 1 + Math.floor(d.stage);
    const pay = Math.round((1500 + d.rep * 90 + d.stage * 4000) * (0.8 + rnd() * 0.5) / 100) * 100;
    const bonus = Math.round(pay * 0.25 / 100) * 100;
    ask(`${s.n}`, `${s.n} wants your logo on the car. They want at least ${need} win${need > 1 ? "s" : ""} per year.`, [
      ["Sign the contract", () => sign(d, s, pay, bonus, need)],
      ["Negotiate for more", () => {
        if (rnd() < 0.5 + d.rep / 400) sign(d, s, Math.round(pay * 1.3 / 100) * 100, bonus, need, true);
        else card("They walk", `${s.n} did not like the attitude and left. Maybe next year.`);
      }],
      ["Decline", () => {}, "gray"],
    ], [["Yearly pay", money(price(pay))], ["Signing bonus", money(price(bonus))], ["Wins per year", String(need)]]);
  }
  function sign(d, s, pay, bonus, need, better) {
    d.sponsors.push({ n: s.n, pay, need });
    d.yr.acts++;
    const rows = fx(d, { money: bonus, rep: 2, fol: 300 });
    say(`I signed with ${s.n}.`);
    card("Contract signed", `${s.n} ${better ? "agrees to your price." : "welcomes you to the family."} Yearly pay: ${money(price(pay))}.`, rows);
  }
  function sponsorsMenu() {
    const d = D();
    if (d.stage < 1) return card("Not yet", "Sponsors only look at drivers with a name. Win a few battles first.", [["Wins needed", "4"], ["Reputation needed", "20%"]]);
    if (d.yr.acts >= MAX_ACTS) return tired();
    ask("Sponsors", d.sponsors.length ? "Your current contracts:" : "You have no sponsors yet.", [
      ["Meet a new sponsor", () => offerSponsor(d)],
      ...d.sponsors.map((s, i) => [`Drop ${s.n}`, () => { d.sponsors.splice(i, 1); card("Dropped", `You parted ways with ${s.n}.`, [], sponsorsMenu); }, "gray"]),
      ["Back", () => openDrift(), "gray"],
    ], d.sponsors.map((s) => [s.n, `${money(price(s.pay))}/yr · ${s.need} win${s.need > 1 ? "s" : ""}`]));
  }
  function teamMenu() {
    const d = D();
    const m = ensureMech(d);
    const coCost = Math.round(price(2500 + d.stage * 1500));
    const mCost = Math.round(price(2000 + d.stage * 1200));
    ask("Your team", "A co-driver rides along and calls the course. A mechanic keeps the car alive. Both cost salary every year.", [
      [d.co ? `Co-driver: ${d.co.name} (fire)` : `Hire a co-driver (${money(coCost)}/yr)`, () => {
        if (d.co) { d.co = null; return card("Fired", "Your co-driver leaves the team.", [], teamMenu); }
        if ((state.money || 0) < coCost) return card("Not enough money", "You cannot pay his first year.", [], teamMenu);
        d.co = { name: `${pick(FIRST)} ${pick(LAST)}`, pay: coCost };
        card("Hired", `${d.co.name} joins as co-driver. Your battles get a little easier.`, [["Salary", money(coCost) + "/yr"]], teamMenu);
      }],
      [m.hired ? `Mechanic: ${m.name} (fire)` : `Hire ${m.name} as team mechanic (${money(mCost)}/yr)`, () => {
        if (m.hired) { m.hired = false; return card("Let go", "Your mechanic goes back to the shop.", [], teamMenu); }
        if ((state.money || 0) < mCost) return card("Not enough money", "You cannot pay his first year.", [], teamMenu);
        m.hired = true;
        m.pay = mCost;
        card("Hired", `${m.name} joins the team: repairs and parts get cheaper.`, [["Salary", money(mCost) + "/yr"]], teamMenu);
      }],
      ["Back", () => openDrift(), "gray"],
    ], [["Co-driver", d.co ? d.co.name : "none"], ["Mechanic", m.hired ? m.name : "none"]]);
  }

  // ----- Japan
  function japanMenu() {
    const d = D();
    if (d.stage < 1 && d.rep < 20) return card("Not yet", "Japan is for drivers with a name. Build your reputation first.", [["Reputation needed", "20%"]]);
    if (d.yr.acts >= MAX_ACTS) return tired();
    const cost = price(3500);
    ask("Travel to Japan", `A plane ticket, a hotel and a rental trailer: ${money(cost)}. Where to?`, [
      ["Hakone: train in the mountains", () => trip(d, cost, "hakone", false)],
      ["Tokyo: compete at the Shuto", () => trip(d, cost, "tokyo", true)],
      ["Fuji Speedway: compete", () => trip(d, cost, "fuji", true)],
      ["Back", () => openDrift(), "gray"],
    ]);
  }
  function trip(d, cost, venue, compete) {
    if ((state.money || 0) < cost) return card("Not enough money", `The trip costs ${money(cost)}.`);
    if (!car()) return needCar();
    state.money -= cost;
    d.yr.acts++;
    d.japan++;
    const V = venueById(venue);
    if (!compete) {
      const out = pick([
        ["You spend a week in the Hakone mountains with locals who drift at dawn. The line starts to make sense.", { ctl: 9, hap: 4 }],
        ["A touge legend lets you follow his car for three days. You come home different.", { ctl: 10, rep: 2 }],
        ["Rain and fog for six days. You learn to drive on the edge of nothing.", { ctl: 8, ref: 2, cond: -3 }],
        ["The guardrail gets close once. You also get your best week of practice ever.", { ctl: 8, cond: -8, hap: 2 }],
        ["Great food, great roads and a new friend who tells everyone about you.", { ctl: 7, fol: 500, rep: 2, hap: 5 }],
      ]);
      say(`I trained at ${V.n}.`);
      return card("Hakone", out[0], [["Trip", "-" + money(cost)], ...fx(d, out[1])]);
    }
    const opp = makeOpp(d, 6);
    ask(V.n, `${V.txt}<br><br>${opp.name} "${opp.nick}" is the best driver here this week.`, [
      ["Battle him", () => tandem(d, { venue, opp, perRun: 3, label: V.n, onDone: (r) => battleResult(d, r, opp, V, { prize: ri(2000, 7000) * (1 + d.stage), rep: ri(7, 12) }) })],
      ["Just watch", () => card("Spectator", "You watch from the grass and take notes.", fx(d, { ctl: 3 }))],
    ]);
  }

  // ------------------------------------------------------------------ random events (40+)
  // [id, title, lead, [[choice, effects, message, riskChance, riskEffects, riskMessage], ...], when(d)]
  const EV = [
    ["scout", "A scout in the crowd", "A man in a jacket without any logo has been watching you all night. He walks up after the last run.", [["Hear him out", { rep: 3, fol: 150 }, "He works for a team and gives you a contact. Doors start to open."], ["Ignore him", { hap: -1 }, "He leaves. You never find out who he worked for."]], (d) => d.stage >= 1],
    ["rival_tires", "Flat tyres", "You come back to the car after a meet and all four tyres are cut.", [["Replace them", { money: -800, hap: -2 }, "Four new tyres. Expensive, but the scene will see you came back stronger."], ["Ask around", { rep: 2, money: -300 }, "A friend finds who did it. He apologises in public and pays half."]]],
    ["drone", "A drone over the hill", "A video team wants to film your next run from a drone.", [["Say yes", { fol: 900, rep: 2 }, "The footage looks cinematic. It gets millions of views."], ["Say no", {}, "You keep it private. The rumour grows anyway."]]],
    ["oil_leak", "Oil on the tarmac", "The car leaves a trail of oil in the parking lot. The mechanic says it is a seal.", [["Fix it now", { money: -500, cond: 8 }, "It stops. The car feels healthier."], ["Ignore it", { cond: -6 }, "It gets worse before it gets better.", 0.4, { cond: -14, money: -900 }, "The seal blows on the next run."]]],
    ["old_driver", "A veteran offers a ride", "A veteran who drifted in the nineties invites you for a ride in his old car.", [["Accept", { ctl: 4, hap: 3 }, "He teaches you a trick that took him ten years to learn."], ["Decline", {}, "Maybe next time."]]],
    ["insurance", "The insurance letter", "Your insurance company has noticed the new tyre brand and a lot of sideways pictures.", [["Argue", { money: -400 }, "You pay a smaller fine than they asked for."], ["Pay and move on", { money: -900, hap: -2 }, "The bill hurts. The premium never comes back down."]]],
    ["pro_invite", "Invitation to a pro event", "A pro event has an empty spot and the organizers think of you.", [["Take the spot", { rep: 4, fol: 400 }, "You do not win, but the cameras like you.", 0.3, { cond: -15, rep: -2 }, "You hit a barrier on the second run."], ["Not ready", {}, "You are not ready, and you know it."]], (d) => d.stage >= 1],
    ["motor_failure", "Engine trouble", "A knock from the engine on the way to the meet. Not a good sound.", [["Rebuild it", { money: -2200, cond: 20 }, "A rebuild fixes everything and adds a little bit of confidence."], ["Keep driving", { ctl: 1 }, "You keep driving.", 0.5, { cond: -30, money: -3500 }, "The engine gives up on a long straight."]]],
    ["fan_gift", "A fan sends a package", "A fan from another country sends you a hand-painted helmet.", [["Wear it", { fol: 200, hap: 3 }, "You wear it in the next clip. It looks great."], ["Frame it", { hap: 2 }, "It goes on the garage wall."]]],
    ["bad_review", "An article trashes you", "A magazine calls you 'a kid with a car and no style'.", [["Reply with a clip", { fol: 500, rep: 2 }, "You answer with a perfect run. The internet picks a side."], ["Stay quiet", { hap: -3 }, "It stings for a week."]]],
    ["sensei_talk", "Words from the sensei", "Your sensei says you are fast but not calm.", [["Practice calm", { ctl: 3, hap: 2 }, "A week of breathing and slow drives. It works."], ["Ignore him", { rep: 1 }, "You keep driving the old way."]], (d) => d.sensei],
    ["girlfriend", "Your partner is tired of the garage", "Your partner asks how many weekends the car will take this year.", [["Make time", { hap: 4, ctl: -1 }, "You hand over a whole Saturday. It was a good Saturday."], ["Keep driving", { ctl: 2, hap: -4 }, "You win a battle and lose an argument."]]],
    ["tow", "Towed from a meet", "Somebody called the tow trucks. Yours is already on the hook.", [["Pay the fee", { money: -450 }, "It costs money, not much pride."], ["Run to the truck", { rep: 2 }, "You catch it at the light, jump in and drive away. People film it.", 0.4, { heat: 15, money: -900 }, "The police were also watching."]]],
    ["snow", "A snow day", "A cold front hits the mountain. The road is closed and all the good drivers are home.", [["Take it out anyway", { ctl: 5, cond: -4 }, "Snow drifting teaches you more than a year of dry asphalt.", 0.2, { cond: -20 }, "You slide into a snow bank."], ["Stay home", { hap: 2 }, "A quiet day for once."]]],
    ["sponsor_complaint", "Your sponsor is not happy", "Your sponsor calls: the logo is hidden behind the wing.", [["Move the sticker", { rep: 1 }, "They calm down."], ["Argue", { money: -300 }, "They cut a small part of your payment."]], (d) => d.sponsors.length > 0],
    ["new_tyres", "A tire shop wants you", "A small tire shop offers free tyres for a clip.", [["Take the deal", { money: 500, fol: 120 }, "Free tyres and a little pocket money."], ["Pass", {}, "You keep your independence."]]],
    ["street_race", "A random street race", "A stranger at a red light revs his engine.", [["Race him", { rep: 3, heat: 12 }, "You win by half a car. A passer-by cheers.", 0.35, { cond: -15, heat: 15, rep: -2 }, "He was faster than he looked."], ["Let him go", {}, "You wait for the green."]], (d) => d.stage < 2],
    ["crowdfund", "A crowdfunding idea", "Fans ask if you want a donation page.", [["Open it", { money: 1200, fol: 100 }, "It makes more than you expected."], ["No thanks", {}, "You keep it simple."]], (d) => d.fol > 1500],
    ["injury_neck", "A stiff neck", "Hard drifting week after week leaves a stiff neck.", [["See a physio", { money: -200, hp: 3 }, "It gets better."], ["Ignore it", {}, "It gets worse.", 0.4, { hp: -8 }, "A muscle gives up on the next run."]]],
    ["wing", "A tuned wing", "A fab shop offers you a custom carbon wing in exchange for photos.", [["Accept", { ctl: 1, fol: 200 }, "It looks ridiculous and perfect."], ["Refuse", {}, "You keep it stock."]]],
    ["quit_rumour", "A rumour about you", "People say you will quit after the last crash.", [["Prove them wrong", { rep: 3 }, "You show up to the next meet with a smile."], ["Laugh it off", { hap: 1 }, "It dies out."]]],
    ["event_ticket", "A ticket to a pro event", "A friend gives you a ticket to the pro league finale.", [["Go", { ctl: 3, hap: 3 }, "You watch the champions all night."], ["Sell it", { money: 400 }, "A little cash for tyres."]]],
    ["wet", "Rain at the meet", "The road is wet and everyone looks at their tyres.", [["Drive anyway", { ctl: 3, cond: -4 }, "You learn rain control.", 0.25, { cond: -18 }, "The back end goes first."], ["Wait", {}, "The rain stops by midnight."]]],
    ["scam_part", "A cheap part online", "A seller offers you a turbo for a third of the price.", [["Buy it", { money: -400 }, "The turbo is genuine. You got lucky.", 0.5, { money: -400, cond: -10 }, "It fails on the first run."], ["Walk away", {}, "If it looks too good, it is."]]],
    ["kid", "A kid asks for a ride", "A kid from the neighbourhood asks you to take him for a ride.", [["Take him", { hap: 5, rep: 1 }, "He screams the whole time and begs for more."], ["Say no", {}, "Safety first."]]],
    ["magazine", "A magazine cover", "A car magazine wants you for the cover.", [["Do the shoot", { fol: 1500, rep: 4, hap: 4 }, "The cover shows you drifting the Hakone hairpin."], ["Decline", {}, "Not your thing."]], (d) => d.stage >= 2],
    ["bet", "A side bet", "A wealthy fan bets you cash that you cannot beat his car.", [["Take the bet", { money: 2500, rep: 2 }, "You win and he pays.", 0.45, { money: -1800, rep: -2 }, "He wins and you pay."], ["Decline", {}, "You keep your money."]]],
    ["alignment", "Tyre alignment", "The car pulls slightly to the left.", [["Fix it", { money: -150, ctl: 1 }, "Straight again."], ["Drive on", {}, "You adjust your hands."]]],
    ["police_warning", "A friendly warning", "A police officer who watches your clips warns you to be careful.", [["Listen", { heat: -10, hap: 1 }, "You promise to take the mountain from now on."], ["Laugh", { rep: 1, heat: 8 }, "He writes your plate down."]], (d) => d.stage === 0 || d.heat > 20],
    ["festival", "A drift festival", "A festival wants a demo from you.", [["Perform", { money: 1500, fol: 600, rep: 3 }, "Thousands cheer and you leave with a trophy and tired arms."], ["Skip", {}, "You stay home."]], (d) => d.stage >= 1],
    ["friend_crash", "A friend crashes", "Your best drift friend crashes badly. He is okay, but shaken.", [["Visit him", { hap: -2, mech: 0, ctl: 0, rep: 1 }, "You sit with him all afternoon. He is back in a month."], ["Send a message", {}, "A short message. He answers in two days."]]],
    ["track_owner", "A track owner's offer", "A track owner offers you free sessions if you teach his students.", [["Teach", { ctl: 2, money: 800, rep: 2 }, "Teaching makes you better too."], ["Say no", {}, "No time."]], (d) => d.stage >= 1],
    ["fuel", "Fuel prices", "Fuel is expensive this month.", [["Drive less", { hap: -1 }, "You skip two meets."], ["Pay it", { money: -400 }, "Burning cash and rubber."]]],
    ["trophy_pawn", "An old trophy", "A collector wants to buy a trophy you won.", [["Sell it", { money: 1500, rep: -1 }, "The shelf looks empty."], ["Keep it", { hap: 2 }, "You keep it."]], (d) => d.titles > 0],
    ["spotter", "A spotter volunteers", "A girl from the crowd volunteers to be your spotter on touge nights.", [["Accept", { ctl: 1, hap: 2 }, "She calls the danger from the corner. It helps."], ["Decline", {}, "You drive alone."]]],
    ["dyno", "A dyno day", "A shop offers a free dyno day.", [["Do it", { ctl: 1, cond: 3 }, "The numbers are better than you expected."], ["Skip", {}, "You keep the money."]]],
    ["hater_crash", "A hater cuts you off", "A hater squeezes you into a guardrail on purpose.", [["Report him", { rep: 1, heat: 5 }, "He gets banned from the events."], ["Pay him back on track", { rep: 3, cond: -5 }, "You pass him on the next hairpin and he never looks you in the eye again.", 0.3, { cond: -20 }, "You touch and both cars get hurt."]]],
    ["tokyo_night", "A night in Tokyo", "A friend takes you to Daikoku parking area at night.", [["Go", { rep: 2, fol: 350, hap: 4 }, "A hundred legends and a thousand lights. You come home inspired."], ["Stay", {}, "You stay."]]],
    ["clip_stolen", "Someone stole your clip", "A big page posts your best clip without credit.", [["Demand credit", { fol: 400 }, "They credit you and tag you."], ["Let it go", { fol: 100 }, "It gets views anyway."]]],
    ["rookie", "A rookie wants to learn", "A rookie asks you to teach him.", [["Teach him", { rep: 2, hap: 3 }, "You see yourself in him."], ["No time", {}, "Maybe next year."]]],
    ["weather_forecast", "A storm is coming", "A storm warning for the weekend's event.", [["Prepare the car", { money: -200, ctl: 1 }, "You change the tyres and tune the suspension."], ["Trust your skill", {}, "You wing it.", 0.3, { cond: -12 }, "The wet road bites."]]],
    ["bank", "Your money gets tight", "Your account is running low after the last few months.", [["Take a part-time job", { money: 600, hap: -2, ctl: -1 }, "It pays the bills."], ["Sell parts", { money: 900, cond: -3 }, "It hurts, but it pays."]], (d) => (state.money || 0) < 3000],
    ["documentary", "A documentary crew", "A small crew wants to film a documentary about you.", [["Say yes", { fol: 2000, rep: 4, hap: 3 }, "It premieres to a full room."], ["Say no", {}, "You prefer privacy."]], (d) => d.stage >= 2],
  ];
  // 40+ events
  function randomEvent(d) {
    const ok = EV.filter((e) => {
      const last = d.evDone[e[0]];
      return (last == null || state.age - last >= 3) && (!e[4] || e[4](d));
    });
    if (!ok.length) return;
    const e = pick(ok);
    d.evDone[e[0]] = state.age;
    q(() =>
      ask(e[1], e[2], e[3].map((c) => [c[0], () => {
        const risky = c[3] && rnd() < c[3];
        const rows = fx(d, risky ? c[4] : c[1]);
        card(e[1], risky ? c[5] : c[2], rows);
      }])),
    );
  }

  // ------------------------------------------------------------------ yearly tick
  function yearTick() {
    const d = state.drift;
    if (!d || !d.active || state.dead) return;
    D();
    const last = d.yr || { acts: 0 };
    // contracts
    let pay = 0;
    d.sponsors = d.sponsors.filter((s) => {
      if (last.wins >= s.need) {
        pay += s.pay;
        return true;
      }
      q(() => card("Sponsor unhappy", `${s.n} wanted ${s.need} win${s.need > 1 ? "s" : ""} and you did not deliver. They cut the contract.`, []));
      return false;
    });
    if (pay) {
      const rows = fx(d, { money: pay });
      q(() => card("Sponsor payments", "Your sponsors paid for the year.", rows));
    }
    // salaries
    const m = d.mech;
    let cost = 0;
    if (d.co) cost += d.co.pay || 0;
    if (m && m.hired) cost += m.pay || 0;
    if (cost) state.money = Math.max(0, (state.money || 0) - cost);
    // heat cools, skills rust without practice
    d.heat = Math.max(0, d.heat - 12);
    if ((last.trained || 0) < 2) d.ctl = Math.max(0, d.ctl - 2);
    if (!last.acts) d.rep = Math.max(0, d.rep - 2);
    d.years++;
    if (rnd() < 0.8) randomEvent(d);
    if (state.stats) {
      d.fol = Math.round(d.fol * 1.03);
    }
    checkStage(d, () => {});
    refreshJob(d);
  }

  // ------------------------------------------------------------------ screens
  const row = (id, icon, t, s, dis) =>
    `<div class="row${dis ? " dis" : ""}" data-d="${id}"><img src="${icon}" alt="" style="object-fit:contain"><div class="t"><b>${t}</b><span>${s}</span></div>${dis ? "" : chev()}</div>`;
  const sec = (t) => `<div class="sec">${t}</div>`;
  const bar = (label, v, col) => `<div class="rel">${label} <i><u style="width:${Math.max(2, Math.round(v))}%;background:${col || (typeof barCol === "function" ? barCol(v) : "#3a8f3f")}"></u></i></div>`;
  function openScreen(title, back, html) {
    sTitle.textContent = title;
    if (typeof sSub !== "undefined" && sSub && sSub.style) sSub.style.display = "none";
    sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;";
    sBack.onclick = back;
    sList.innerHTML = html;
    sList.scrollTop = 0;
    screen.classList.add("open");
  }
  function bind(map) {
    sList.querySelectorAll("[data-d]").forEach((el) => {
      el.onclick = () => {
        if (el.classList.contains("dis")) return;
        if (typeof play === "function") play("choice");
        const f = map[el.dataset.d];
        if (f) f();
      };
    });
  }

  function intro() {
    openScreen("DRIFT BOY", () => (typeof openSpecialCareers === "function" ? openSpecialCareers() : screen.classList.remove("open")),
      `<div class="row" style="cursor:default"><img src="${ICON}" alt=""><div class="t"><b>${CAREER}</b><span>From illegal street runs to the pro league</span></div></div>` +
      sec("How it works") +
      `<div class="row" style="cursor:default"><img src="${E("1f3c1")}" alt=""><div class="t"><b>Tandem battles</b><span>You lead, you chase, and the judges score Angle, Speed and Line</span></div></div>` +
      `<div class="row" style="cursor:default"><img src="${E("1f697")}" alt=""><div class="t"><b>Any car can drift</b><span>A Silvia, an AE86 and an RX-7 are the best to start. Tuning counts.</span></div></div>` +
      `<div class="row" style="cursor:default"><img src="${E("1f6a8")}" alt=""><div class="t"><b>The risk</b><span>Crash your car, or let the police heat climb on the street</span></div></div>` +
      `<div class="row" style="cursor:default"><img src="${E("1f5fc")}" alt=""><div class="t"><b>Japan</b><span>Tokyo, Hakone and Fuji</span></div></div>` +
      sec("Join") +
      row("join", ICON, "Become a Drift Boy", "You need to be at least 16", state.age < 16));
    bind({ join });
  }
  function join() {
    const d = D();
    if (state.age < 16) return notice(CAREER, "You are too young to drive, let alone drift.", null, true);
    if (window.FL_CAREERS && !window.FL_CAREERS.canStart(CAREER)) return;
    d.active = true;
    d.stage = 0;
    d.car = 0;
    if (!cars().length) return starterShop(d, true);
    joinDone(d);
  }
  function joinDone(d) {
    d.active = true;
    refreshJob(d);
    say("I became a drift boy.");
    card("Welcome to the scene", "Midnight, a quiet parking lot and a car that wants to slide. Win battles, build a name and see where it goes.", [["Your car", carName(car())]], openDrift, carImg(car()));
  }

  function openDrift() {
    const d = D();
    if (!d.active) return intro();
    const c = car();
    const back = () => (typeof openSpecialCareers === "function" ? openSpecialCareers() : screen.classList.remove("open"));
    const left = Math.max(0, MAX_ACTS - d.yr.acts);
    const html =
      `<div class="row" style="cursor:default"><img src="${c ? carImg(c) : ICON}" alt="" style="object-fit:contain"><div class="t"><b>${stageName(d)}</b><span>${esc(carName(c))} · rating ${Math.round(carRating(c))} · ${d.wins}W/${d.losses}L · ${d.titles} title${d.titles === 1 ? "" : "s"}</span></div></div>` +
      `<div class="row" style="cursor:default;flex-direction:column;align-items:stretch;height:auto;padding:10px 14px">${bar("Control", d.ctl)}${bar("Reflexes", d.ref)}${bar("Fitness", d.phy)}${bar("Reputation", d.rep, "#e2a31f")}${bar("Police heat", d.heat, "#b3261e")}<span style="font-size:12px;opacity:.7;margin-top:2px">${left} activities left this year · ${d.fol.toLocaleString("en-US")} followers · skill ${Math.round(skill())}</span></div>` +
      sec("Compete") +
      row("battle", E("1f3c1"), "Tandem battle", d.stage === 0 ? "Challenge someone on the street" : "A battle at a venue near you") +
      row("tour", E("1f3c6"), "Enter a tournament", d.stage >= 1 ? (d.yr.tour ? "Already entered this year" : (d.stage >= 2 ? "Pro league event: Hakone or Fuji" : "Local bracket: three battles")) : "Needs a reputation first", d.stage < 1 || !!d.yr.tour) +
      row("japan", E("2708-fe0f"), "Travel to Japan", "Tokyo, Hakone and Fuji") +
      sec("Train") +
      ["parking", "track", "sim", "replays", "reflex"].map((id) => row(id, ACT[id].ico, ACT[id].t, ACT[id].s + (ACT[id].cost ? ` · ${money(price(ACT[id].cost))}` : ""))).join("") +
      sec("Your car") +
      row("tuning", ACT.tuning.ico, ACT.tuning.t, ACT.tuning.s) +
      row("mechanic", ACT.mechanic.ico, ACT.mechanic.t, ACT.mechanic.s) +
      row("chassis", ACT.chassis.ico, ACT.chassis.t, ACT.chassis.s) +
      sec("Street & community") +
      ["meet", "takeover", "clips"].map((id) => row(id, ACT[id].ico, ACT[id].t, ACT[id].s, id === "takeover" && state.age < 16)).join("") +
      sec("Career") +
      row("sponsors", ACT.sponsors.ico, ACT.sponsors.t, d.sponsors.length ? d.sponsors.map((s) => s.n).join(", ") : ACT.sponsors.s) +
      row("team", ACT.team.ico, ACT.team.t, `${d.co ? "Co-driver" : "no co-driver"} · ${d.mech && d.mech.hired ? "mechanic" : "no mechanic"}`) +
      row("quit", E("1f6aa"), "Quit drifting", "Hang up the keys", false);
    openScreen("DRIFT BOY", back, html);
    const mk = (id) => () => doSimpleAct(id);
    bind({
      battle: streetBattle, tour: tournament, japan: japanMenu,
      parking: mk("parking"), track: mk("track"), sim: mk("sim"), replays: mk("replays"), reflex: mk("reflex"),
      tuning: tuningMenu, mechanic: mechanicMenu, chassis: chassisMenu,
      meet: mk("meet"), takeover: mk("takeover"), clips: mk("clips"),
      sponsors: sponsorsMenu, team: teamMenu,
      quit: () => ask("Quit drifting?", "Your sponsors, team and ranking go away. The car stays in the garage.", [
        ["Quit", () => {
          d.active = false;
          d.sponsors = [];
          d.co = null;
          if (d.mech) d.mech.hired = false;
          if (state.job && state.job.drift) state.job = null;
          if (typeof renderStats === "function") renderStats();
          say("I quit drifting.");
          back();
        }],
        ["Stay in the scene", () => {}, "gray"],
      ]),
    });
  }

  // ------------------------------------------------------------------ boot
  function boot() {
    if (typeof openSpecialCareers !== "function" || !document.getElementById("ageBtn") || typeof sList === "undefined") return setTimeout(boot, 60);
    const orig = openSpecialCareers;
    const wrapped = function () {
      const r = orig.apply(this, arguments);
      try {
        const d = state.drift && state.drift.active ? state.drift : null;
        const sub = d ? `${STAGES[d.stage].t} · ${d.wins} wins` : "From illegal street runs to the pro league.";
        const html = `<div class="row sp-pack" id="spDrift"><img src="${ICON}" alt=""><div class="t"><b>${CAREER}</b><span>${sub}</span></div>${chev()}</div>`;
        if (!document.getElementById("spDrift")) {
          const first = sList.querySelector(".sp-pack");
          first ? first.insertAdjacentHTML("beforebegin", html) : sList.insertAdjacentHTML("beforeend", html);
        }
        document.getElementById("spDrift").onclick = () => (typeof play === "function" && play("choice"), openDrift());
      } catch (e) {
        console.warn("[drift] menu", e);
      }
      return r;
    };
    window.openSpecialCareers = wrapped;
    try {
      openSpecialCareers = wrapped;
    } catch {}
    const job = window.openJobScreen;
    if (typeof job === "function") {
      window.openJobScreen = function () {
        if (state.job && state.job.drift) return openDrift();
        return job.apply(this, arguments);
      };
    }
    document.getElementById("ageBtn").addEventListener("click", () =>
      setTimeout(() => {
        try {
          yearTick();
        } catch (e) {
          console.warn("[drift] yearTick", e);
        }
      }, 0),
    );
    window.FL_DRIFT = { open: openDrift, state: () => state.drift, tick: yearTick, battle: tandem, skill, carRating };
  }
  boot();
})();
