/* [mod] NBA Career for NaBlooLife (local mod).
 *
 * Occupation -> Special Careers -> Pro Athlete -> NBA Career.
 * High school (14-17) -> college offers (18-21) -> draft lottery and pick -> NBA contract (rookie scale,
 * free agency, max deals) -> playoffs, awards, endorsements, trades, injuries, 30+ events -> retirement and
 * the Hall of Fame. All 30 teams, coaches and rosters come from nba-data.js (generated from nba/jugadores.txt),
 * with the logos in nba/logos. Teammates and opponents are shown by name only; the stories are made up.
 *
 * It is a real job (state.job.nba): the game pays the salary, taxes it and raises it every year. Endorsement
 * money is added on top. It never blocks Age up: each birthday plays the season, then shows a few cards.
 * State: state.nba (JSON only). API: FL_NBA.open(), FL_NBA.state(), FL_NBA.tick(), FL_NBA.eventNow(id).
 */
(() => {
  "use strict";
  if (window.FL_NBA) return;

  // ------------------------------------------------------------------ helpers
  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const cl = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const ch = (p) => rnd() < p;
  const gauss = () => (rnd() + rnd() + rnd() + rnd() - 2) / 0.58;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ifx = () => (typeof window.inflFx === "function" ? window.inflFx() : 1);
  const money = (n) => {
    n = Math.round(n);
    if (n >= 1e6) return (typeof cur === "function" ? cur() : "$") + (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    return typeof usd === "function" ? usd(n) : "$" + n.toLocaleString("en-US");
  };
  const chev = () => (typeof CHEV !== "undefined" ? CHEV : "");
  const snd = (n) => {
    try {
      typeof play === "function" && play(n);
    } catch {}
  };
  const warn = (w, e) => console.warn("[nba] " + w, e);
  const sayIt = (s) => {
    try {
      typeof say === "function" && say(s);
    } catch {}
  };
  const render = () => {
    try {
      renderStats();
    } catch {}
  };
  const stat = (k, d) => {
    if (state.stats) state.stats[k] = cl((Number(state.stats[k]) || 0) + d);
  };
  const addMoney = (n) => {
    state.money = Math.max(0, (Number(state.money) || 0) + n);
    render();
  };
  const yr = () => (Number(state.birthYear) || 2000) + (Number(state.age) || 0);
  const ord = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");
  const note = (title, text, cb) => notice(title, text, cb || null, true);
  const card = (o) => {
    try {
      jCard({ tag: "NBA", ...o });
    } catch (e) {
      warn("card", e);
    }
  };
  const D = () => (window.FL_NBA_DATA && window.FL_NBA_DATA.teams) || [];
  const TEAM = (ab) => D().find((t) => t.abbr === ab) || D()[0];
  const ICON = "bball/ball.png";
  const trophy = (n) => `trophies/nba-${n}.png`;
  const TROPHY = { champ: trophy("01-larry-obrien"), fmvp: trophy("02-finals-mvp"), mvp: trophy("03-mvp"), dpoy: trophy("04-defensive-player"), roy: trophy("05-rookie-of-the-year"), smoy: trophy("06-sixth-man"), asmvp: trophy("08-all-star-mvp"), alld: trophy("09-all-defensive-team"), scorer: trophy("10-scoring-champion") };

  // ------------------------------------------------------------------ data
  const SK = [
    ["shoot", "Shooting"],
    ["finish", "Finishing"],
    ["play", "Playmaking"],
    ["def", "Defense"],
    ["reb", "Rebounding"],
    ["ath", "Athleticism"],
  ];
  const POS = {
    PG: { n: "Point Guard", w: { shoot: 1.1, finish: 0.8, play: 1.6, def: 0.8, reb: 0.4, ath: 1 }, reb: 0.3, ast: 1, sc: 0.95 },
    SG: { n: "Shooting Guard", w: { shoot: 1.6, finish: 1, play: 0.9, def: 0.8, reb: 0.5, ath: 1 }, reb: 0.4, ast: 0.55, sc: 1.05 },
    SF: { n: "Small Forward", w: { shoot: 1.2, finish: 1.2, play: 0.8, def: 1, reb: 0.8, ath: 1.1 }, reb: 0.6, ast: 0.5, sc: 1 },
    PF: { n: "Power Forward", w: { shoot: 0.8, finish: 1.3, play: 0.6, def: 1.1, reb: 1.4, ath: 1 }, reb: 0.85, ast: 0.35, sc: 0.95 },
    C: { n: "Center", w: { shoot: 0.5, finish: 1.5, play: 0.5, def: 1.3, reb: 1.7, ath: 0.9 }, reb: 1.1, ast: 0.3, sc: 0.9 },
  };
  const FOCUS = SK.map(([k, n]) => [k, n]);
  const BRANDS = ["Strideline", "Apex Kicks", "Volt Athletics", "Northpeak", "Hardwood Co."];
  const INJ = [
    ["a sprained ankle", 3, 0], ["a jammed finger", 2, 0], ["a bruised knee", 5, 0], ["a strained hamstring", 8, 0], ["a concussion", 6, 0],
    ["a broken hand", 20, 0], ["a stress fracture", 35, 1], ["a dislocated shoulder", 40, 1], ["a torn meniscus", 30, 1], ["a torn ACL", 82, 2], ["a torn Achilles", 82, 2],
  ];
  const COLLEGES = ["Duke", "Kentucky", "Kansas", "North Carolina", "UCLA", "Gonzaga", "Michigan State", "Arizona", "Houston", "Connecticut", "Villanova", "Baylor", "Purdue", "Texas", "Florida", "Alabama", "Auburn", "Syracuse", "Louisville", "Indiana", "Illinois", "Tennessee", "Virginia", "Arkansas"];
  const PICKSAL = (p) => Math.round(14500000 * Math.pow(0.955, p - 1));
  const FASAL = (ovr) => Math.min(58000000, Math.max(1300000, 1200000 * Math.exp((ovr - 55) * 0.118)));

  // ------------------------------------------------------------------ state
  const N = () => {
    if (!state.nba || typeof state.nba !== "object") state.nba = {};
    const n = state.nba;
    if (n.active == null) n.active = false;
    if (n.retired == null) n.retired = false;
    return n;
  };
  const on = () => !!(state.nba && state.nba.active && !state.nba.retired);
  const ovr = (n) => {
    const w = POS[n.pos].w;
    let s = 0,
      t = 0;
    SK.forEach(([k]) => {
      s += n.sk[k] * w[k];
      t += w[k];
    });
    return Math.round(s / t);
  };
  const tm = (n) => (n.team ? TEAM(n.team) : null);
  const stageName = (n) => (n.stage === "hs" ? "High school" : n.stage === "college" ? n.school || "College" : n.stage === "pro" ? (tm(n) ? tm(n).name : "Free agent") : "Draft");

  // ------------------------------------------------------------------ league sim
  function league() {
    const n = N();
    if (!n.lg) {
      n.lg = {};
      D().forEach((t) => (n.lg[t.abbr] = { str: t.rep + ri(-4, 4), w: 41, rs: 0 }));
    }
    return n.lg;
  }
  function simLeague(yourTeam, yourBoost) {
    const lg = league();
    D().forEach((t) => {
      const e = lg[t.abbr];
      e.str = cl(e.str + (t.rep - e.str) * 0.25 + gauss() * 3.2, 25, 99);
    });
    const eff = (a) => lg[a].str + (a === yourTeam ? yourBoost : 0);
    D().forEach((t) => {
      lg[t.abbr].w = Math.round(82 * cl(0.5 + (eff(t.abbr) - 66) / 80 + gauss() * 0.05, 0.1, 0.9));
    });
    const out = { champ: null, finals: null, rounds: {}, seeds: {} };
    const seed = (conf) =>
      D().filter((t) => t.conf === conf).sort((a, b) => lg[b.abbr].w - lg[a.abbr].w || rnd() - 0.5).slice(0, 8).map((t) => t.abbr);
    const series = (a, b) => {
      const p = 1 / (1 + Math.exp(-(eff(a) - eff(b)) / 11));
      let x = 0,
        y = 0;
      while (x < 4 && y < 4) rnd() < p ? x++ : y++;
      return x === 4 ? [a, b, y] : [b, a, x];
    };
    const runConf = (s) => {
      s.forEach((a, i) => (out.seeds[a] = i + 1));
      let live = s.slice();
      let rd = 0;
      while (live.length > 1) {
        const nx = [];
        for (let i = 0; i < live.length / 2; i++) {
          const [w, l] = series(live[i], live[live.length - 1 - i]);
          out.rounds[w] = (out.rounds[w] || 0) + 1;
          nx.push(w);
        }
        live = nx.sort((a, b) => out.seeds[a] - out.seeds[b]);
        rd++;
      }
      return live[0];
    };
    const e = runConf(seed("E"));
    const w = runConf(seed("W"));
    const [c, l, g] = series(e, w);
    out.champ = c;
    out.finals = l;
    out.rounds[c] = (out.rounds[c] || 0) + 1;
    out.games = 4 + g;
    return out;
  }

  // ------------------------------------------------------------------ player impact and stats
  function role(n) {
    const t = tm(n);
    const rep = t ? league()[t.abbr].str : 60;
    const s = ovr(n) + (n.trust - 50) * 0.2 - (rep - 65) * 0.25 + (n.contract && n.contract.two ? -8 : 0);
    if (n.stage === "hs" || n.stage === "college") return s >= 52 ? "Starter" : s >= 42 ? "Rotation" : "Bench";
    return s >= 64 ? "Starter" : s >= 53 ? "Rotation" : "Bench";
  }
  function lineOf(n, games) {
    const o = ovr(n);
    const r = role(n);
    const mins = r === "Starter" ? ri(30, 36) : r === "Rotation" ? ri(18, 26) : ri(5, 13);
    const p = POS[n.pos];
    const lvl = n.stage === "pro" ? 1 : n.stage === "college" ? 1.12 : 1.25;
    const ppg = cl((o - (n.stage === "pro" ? 33 : 25)) * 0.56 * (mins / 34) * p.sc * lvl + gauss() * 1.4, 0.4, 38);
    const rpg = cl((n.sk.reb / 100) * 13 * p.reb * (mins / 34) * (0.8 + o / 250) + rnd(), 0.3, 17);
    const apg = cl((n.sk.play / 100) * 10.5 * p.ast * (mins / 34) * (0.8 + o / 250) + rnd() * 0.8, 0.2, 13);
    const f = (v) => Math.round(v * 10) / 10;
    return { yr: yr(), age: state.age, team: n.team || n.school || "HS", g: games, mins, ppg: f(ppg), rpg: f(rpg), apg: f(apg), role: r, ovr: o };
  }
  const best = (n) => ({ ppg: Math.max(0, ...n.seasons.map((s) => s.ppg)) });

  // ------------------------------------------------------------------ job
  function syncJob(n) {
    if (!n.active || n.stage !== "pro" || !n.contract) return;
    const t = tm(n);
    state.job = {
      t: n.contract.two ? "Two-way Player" : "NBA Player",
      c: "Basketball",
      emp: t ? t.name : "NBA",
      pay: Math.round(n.contract.sal),
      icon: t ? t.logo : ICON,
      nba: true,
      athlete: true,
      perf: cl(30 + ovr(n) * 0.65, 10, 99),
      yrs: n.contract.yrs,
    };
    render();
  }
  const clearJob = () => {
    if (state.job && state.job.nba) state.job = null;
    render();
  };

  // ------------------------------------------------------------------ flow helper
  function chain(steps) {
    const list = steps.filter(Boolean);
    const next = () => {
      const s = list.shift();
      if (s) {
        try {
          s(next);
        } catch (e) {
          warn("step", e);
          next();
        }
      }
    };
    next();
  }
  const info = (title, lead, rows, icon, bars) => (next) => card({ iconSrc: icon || ICON, title, lead, rows: rows || [], bars: bars || [], ok: next });

  // ------------------------------------------------------------------ start
  function startCareer() {
    const n = N();
    if (n.active && !n.retired) return openNba();
    if (state.prison) return note("NBA Career", "You cannot start from prison.");
    if (state.age < 14) return note("NBA Career", "You need to be 14 or older to join a team.");
    if (state.age > 28) return note("NBA Career", "It is too late to start a playing career.");
    if (window.FL_CAREERS && !window.FL_CAREERS.canStart("Pro Athlete")) return;
    if (state.job && state.job.athlete && !state.job.nba) return note("NBA Career", "You are already a pro athlete.");
    card({
      iconSrc: ICON,
      title: "NBA Career",
      lead: "Pick your position. From here it is high school, college, the draft and, if you are good enough, the league.",
      choices: [...Object.keys(POS).map((k) => [POS[k].n, () => begin(k)]), ["Not now", () => {}]],
    });
  }
  function begin(pos) {
    const old = state.nba && state.nba.retired ? state.nba.legacy : null;
    const past = state.nba && Array.isArray(state.nba.past) ? state.nba.past.slice() : [];
    if (state.nba && state.nba.retired && state.nba.seasons && state.nba.seasons.length)
      past.push({ y: old ? old.y : yr(), pos: state.nba.pos, seasons: state.nba.seasons.length, champs: state.nba.champs, allstar: state.nba.allstar, how: old ? old.how : "retired" });
    state.nba = { active: true, retired: false, pos, stage: "hs", sk: {}, seasons: [], awards: [], champs: 0, allstar: 0, trust: 55, fame: 6, hype: 0, inj: null, trainLeft: 4, last: state.age, yrsPro: 0, contract: null, team: null, endorse: null, legacy: old, past };
    const n = state.nba;
    const hl = (Number(state.stats && state.stats.Health) || 55) / 100;
    const sm = (Number(state.stats && state.stats.Smarts) || 50) / 100;
    const base = 33 + (state.age - 14) * 3.5 + hl * 12 + ri(0, 10);
    n.pot = cl(Math.round(44 + Math.pow(rnd(), 1.9) * 50 + sm * 6 + gauss() * 3), 45, 99);
    SK.forEach(([k]) => (n.sk[k] = cl(Math.round(base + gauss() * 5), 20, 85)));
    n.fit = cl(55 + hl * 35);
    n.hypeStart = 0;
    if (state.age >= 18) {
      n.stage = state.age <= 21 ? "college" : "undrafted";
      n.collegeYr = state.age - 17;
    }
    sayIt("I decided to chase an NBA career.");
    snd("achievement");
    if (n.stage === "college") return collegeOffers(() => open0());
    if (n.stage === "undrafted") return undraftedTryout();
    card({ iconSrc: ICON, title: "Varsity tryouts", lead: `You make the high school varsity team as a ${POS[pos].n.toLowerCase()}. Train hard, play well and the scouts will come.`, ok: () => openNba() });
  }
  const open0 = () => openNba();

  // ------------------------------------------------------------------ college
  const presOf = (c) => {
    const i = COLLEGES.indexOf(c);
    return i < 0 ? 28 : Math.round(96 - i * 2.7);
  };
  // the better you are in high school (overall, hype, fame), the more programs call and the bigger they are
  function collegeOffers(next) {
    const n = N();
    const appeal = ovr(n) + n.hype * 0.4 + n.fame * 0.2;
    const count = appeal < 45 ? 1 : appeal < 58 ? 2 : appeal < 72 ? 3 : appeal < 86 ? 4 : 5;
    const ceil = Math.min(99, 22 + (appeal - 30) * 1.45);
    let pool = COLLEGES.filter((c) => presOf(c) <= ceil && presOf(c) >= ceil - 38);
    if (pool.length < count) pool = COLLEGES.filter((c) => presOf(c) <= ceil + 12);
    let opts = pool.sort(() => rnd() - 0.5).slice(0, count).map((c) => ({ c, pres: presOf(c) }));
    if (appeal < 40 || !opts.length) opts = [{ c: "Metro Community College", pres: 25 }];
    opts.sort((x, y) => y.pres - x.pres);
    card({
      iconSrc: ICON,
      title: "College offers",
      lead: appeal >= 86 ? "Everyone wants you. Blue bloods are sitting in your living room." : appeal >= 58 ? "Several programs have been watching you all season." : appeal >= 40 ? "A couple of schools want you." : "Not many scouts came to your games. A community college is your only offer.",
      rows: [["Your pull", `${Math.round(appeal)}`], ["Offers", String(opts.length)]],
      choices: opts.map((o) => [`${o.c} (prestige ${o.pres})`, () => {
        n.school = o.c;
        n.pres = o.pres;
        n.stage = "college";
        n.collegeYr = n.collegeYr || 1;
        n.trust = 55;
        sayIt(`I committed to play college basketball at ${o.c}.`);
        next();
      }]),
    });
  }
  function undraftedTryout() {
    const n = N();
    const o = ovr(n);
    card({
      iconSrc: ICON,
      title: "Summer league",
      lead: "No college, no draft. You pay your own way to a summer league tryout. A few teams are watching.",
      rows: [["Your overall", String(o)]],
      choices: [["Go for it", () => {
        if (ch(cl((o - 42) / 40, 0.05, 0.8))) {
          const t = pick(D());
          signDeal(n, t, { yrs: 2, sal: Math.round(700000 * ifx()), two: true, kind: "Two-way deal" });
          n.stage = "pro";
          sayIt(`I signed a two-way contract with the ${t.name}.`);
          card({ iconSrc: t.logo, title: "Two-way contract", lead: `The ${t.name} sign you to a two-way deal. It is not much, but it is the NBA.`, ok: () => openNba() });
        } else {
          endCareer(n, "unsigned after college");
          note("No offers", "Nobody called. The dream ends here, for now.");
        }
      }], ["Walk away", () => { endCareer(n, "walked away"); }]],
    });
  }
  // [fix] every way a career can end (no offers, walked away, overseas...) keeps its history in n.legacy; before, only the
  // formal retirement did, so an unsigned player lost everything and came back as a rookie.
  function endCareer(n, how) {
    n.retired = true;
    n.active = false;
    clearJob();
    if (!n.legacy || n.legacy.y !== yr()) {
      const sc = legacy(n);
      n.legacy = { score: sc, hof: false, champs: n.champs, how: how || "retired", seasons: n.seasons.filter((s) => s.w != null).length, allstar: n.allstar, y: yr() };
    }
  }
  function signDeal(n, t, c) {
    n.team = t.abbr;
    n.contract = c;
    n.stage = "pro";
    syncJob(n);
  }

  // ------------------------------------------------------------------ draft
  function runDraft(n, wasHs) {
    const o = ovr(n);
    const score = o + (n.pot - o) * 0.35 + n.hype * 0.25 + (n.fame - 10) * 0.1 + gauss() * 3;
    const cls = Array.from({ length: 80 }, () => 38 + Math.abs(gauss()) * 17 + rnd() * 12);
    const pickNo = 1 + cls.filter((v) => v > score).length;
    const lg = league();
    let order = D().slice().sort((a, b) => lg[a.abbr].w - lg[b.abbr].w);
    const lot = order.slice(0, 14).sort(() => rnd() - 0.5);
    order = [...lot, ...order.slice(14)];
    n.drafted = true;
    n.college = wasHs ? "" : n.school;
    if (pickNo > 60) {
      sayIt("I went undrafted in the NBA draft.");
      return card({
        iconSrc: ICON,
        title: "Draft night",
        lead: "Sixty names are called and yours is not one of them. Your phone is still quiet.",
        choices: [["Sign a two-way deal after the draft", () => {
          if (ovr(n) < 46 && ch(0.5)) { endCareer(n, "no team after the draft"); return note('No team', 'No team picked up your contract. It is over.'); }
          const t = pick(D());
          signDeal(n, t, { yrs: 2, sal: Math.round(650000 * ifx()), two: true, kind: "Two-way deal" });
          n.pickNo = 0;
          sayIt(`I signed a two-way deal with the ${t.name}.`);
          card({ iconSrc: t.logo, title: "Welcome", lead: `The ${t.name} take a chance on you with a two-way deal.`, ok: () => openNba() });
        }], ["Play overseas (retire from the NBA dream)", () => { endCareer(n, "went overseas"); }]],
      });
    }
    const t = pickNo <= 30 ? order[pickNo - 1] : order[60 - pickNo];
    n.pickNo = pickNo;
    const first = pickNo <= 30;
    const sal = Math.round((first ? PICKSAL(pickNo) : 1250000 + (60 - pickNo) * 8000) * ifx());
    signDeal(n, t, { yrs: first ? 4 : 2, sal, kind: first ? "Rookie scale" : "Second-round deal", rookie: true });
    n.fame = cl(n.fame + (first ? Math.max(5, 35 - pickNo) : 4));
    snd("achievement");
    sayIt(`I was drafted ${ord(pickNo)} overall by the ${t.name}.`);
    stat("Happiness", 8);
    card({
      iconSrc: t.logo,
      title: `Pick #${pickNo}`,
      lead: `With the ${ord(pickNo)} pick in the NBA draft, the ${t.name} select you. Your name is on the screen and your family is losing it.`,
      rows: [["Team", t.name], ["Coach", t.coach], ["Contract", `${n.contract.yrs} yr · ${money(sal)}/yr`]],
      ok: () => openNba(),
    });
  }

  // ------------------------------------------------------------------ yearly
  const growth = (n) => {
    const a = state.age;
    const o = ovr(n);
    let g;
    if (a <= 24) g = (n.pot - o) * 0.2 + rnd() * 1.6;
    else if (a <= 28) g = (n.pot - o) * 0.06 + gauss() * 0.7;
    else if (a <= 31) g = -rnd() * 1.4;
    else g = -(1 + rnd() * 2.2);
    if (n.fit < 40) g -= 1;
    SK.forEach(([k]) => {
      let d = g + gauss() * 0.8;
      if (k === "ath" && a >= 28) d -= 1;
      if (k === "shoot" && a >= 30) d += 0.5;
      n.sk[k] = cl(Math.round(n.sk[k] + d), 15, 99);
    });
  };
  function tick() {
    if (!on() || state.dead) return;
    const n = N();
    if (n.last === state.age) return;
    n.last = state.age;
    n.trainLeft = 4;
    const steps = [];
    growth(n);
    n.fit = cl(n.fit + 8 + ((Number(state.stats && state.stats.Health) || 50) - 50) / 6);
    n.hype = Math.max(0, n.hype - 3);
    if (n.stage === "hs") hsSeason(n, steps);
    else if (n.stage === "college") collegeSeason(n, steps);
    else if (n.stage === "pro") proSeason(n, steps);
    chain(steps);
  }

  function injuryRoll(n) {
    if (n.inj) {
      n.inj.left -= 82;
      if (n.inj.left <= 0) n.inj = null;
    }
    const p = 0.12 + (60 - n.fit) / 300;
    if (!n.inj && ch(p)) {
      const i = pick(INJ.filter((x) => x[2] === 0 || ch(0.35)));
      n.inj = { name: i[0], left: i[1] * ri(8, 12) / 10, sev: i[2] };
      n.fit = cl(n.fit - 15);
      if (i[2] >= 1) SK.forEach(([k]) => (n.sk[k] = cl(n.sk[k] - (i[2] === 2 ? ri(1, 3) : ri(0, 1)))));
      return i;
    }
    return null;
  }

  function hsSeason(n, steps) {
    const inj = injuryRoll(n);
    const games = inj ? Math.max(5, 28 - Math.round(n.inj ? n.inj.left / 3 : 0)) : 28;
    const ln = lineOf(n, games);
    n.seasons.push(ln);
    const state_ = ch(0.25 + ovr(n) / 300);
    const hon = [];
    if (ovr(n) >= 66 && ch(0.5)) hon.push("All-State");
    if (n.age >= 17 && ovr(n) >= 74 && ch(0.5)) { hon.push("McDonald's All-American"); n.hype += 14; }
    if (state_) hon.push("State champions");
    n.hype += Math.max(0, (ovr(n) - 50) / 3);
    n.fame = cl(n.fame + (ovr(n) - 40) / 10);
    n.trust = cl(n.trust + ri(-3, 5));
    hon.forEach((h) => n.awards.push({ y: yr(), a: h }));
    steps.push(info(`${yr()} · High school`, `${ln.ppg} points, ${ln.rpg} rebounds and ${ln.apg} assists per game as a ${ln.role.toLowerCase()}.${inj ? ` You missed time with ${inj[0]}.` : ""}${hon.length ? ` ${hon.join(", ")}.` : ""}`, [["Overall", String(ovr(n))], ["Hype", `${Math.round(n.hype)}`]]));
    if (state.age >= 17 || (state.age >= 16 && ovr(n) > 80)) {
      steps.push((next) => {
        if (state.age >= 18) {
          n.stage = "college";
          n.collegeYr = 1;
          return collegeOffers(next);
        }
        next();
      });
    }
    eventsStep(n, steps);
  }

  function collegeSeason(n, steps) {
    const inj = injuryRoll(n);
    const games = inj ? Math.max(6, 35 - Math.round(n.inj ? n.inj.left / 3 : 0)) : 35;
    const ln = lineOf(n, games);
    n.seasons.push(ln);
    const hon = [];
    const tourney = ch(cl(0.01 + (n.pres - 40) / 400 + ovr(n) / 900, 0, 0.35));
    if (tourney) { hon.push("NCAA champions"); n.awards.push({ y: yr(), a: "NCAA champions", k: "ncaa" }); n.fame += 10; }
    if (ovr(n) >= 70 && ch(0.5)) { hon.push("All-American"); n.hype += 12; n.awards.push({ y: yr(), a: "All-American" }); }
    n.hype += Math.max(0, (ovr(n) - 55) / 2.5);
    n.fame = cl(n.fame + (ovr(n) - 45) / 7);
    steps.push(info(`${yr()} · ${n.school}`, `Year ${n.collegeYr}: ${ln.ppg} points, ${ln.rpg} rebounds and ${ln.apg} assists per game${inj ? ` after ${inj[0]}` : ""}.${hon.length ? ` ${hon.join(", ")}.` : ""}`, [["Overall", String(ovr(n))], ["Draft hype", `${Math.round(n.hype)}`]], ICON));
    steps.push((next) => {
      const yrc = n.collegeYr;
      n.collegeYr++;
      const go = () => {
        runDraft(n, false);
      };
      if (yrc >= 4) return go();
      if (state.age >= 19 && state.age >= 18 + yrc - 1) {
        const o = ovr(n);
        const proj = o + (n.pot - o) * 0.35 + n.hype * 0.25;
        return card({
          iconSrc: ICON,
          title: "Declare for the draft?",
          lead: `Scouts have you projected as ${proj >= 78 ? "a lottery pick" : proj >= 66 ? "a first-round pick" : proj >= 56 ? "a second-round pick" : "a long shot"}. One more year of college could raise or hurt your stock.`,
          rows: [["Overall", String(o)], ["Draft hype", `${Math.round(n.hype)}`]],
          choices: [["Declare", go], ["Stay in school", next]],
        });
      }
      next();
    });
    eventsStep(n, steps);
  }

  // ------------------------------------------------------------------ pro season
  function proSeason(n, steps) {
    const t = tm(n);
    const o = ovr(n);
    n.yrsPro++;
    const boost = (o - 62) * (role(n) === "Bench" ? 0.1 : role(n) === "Rotation" ? 0.28 : 0.45);
    const inj = injuryRoll(n);
    let games = ri(66, 80);
    if (n.inj) games = Math.max(0, Math.round(82 - n.inj.left));
    if (n.contract && n.contract.two) games = Math.min(games, 40);
    const res = simLeague(n.team, boost);
    const lg = league();
    const w = lg[n.team].w;
    const ln = lineOf(n, games);
    ln.w = w;
    ln.rounds = res.rounds[n.team] || 0;
    ln.champ = res.champ === n.team;
    n.seasons.push(ln);
    const gain = [];
    // awards
    const noise = gauss() * 2.5;
    const sc = ln.ppg;
    const elite = games >= 55;
    const aw = [];
    const award = (key, label) => {
      n.awards.push({ y: yr(), a: label, k: key });
      aw.push(label);
      if (key === "mvp") n.fame += 20;
    };
    if (elite && ovr(n) + noise >= 77 && sc >= 17) { n.allstar++; award("allstar", "All-Star"); n.fame += 6; if (ovr(n) + noise >= 86 && ch(0.2)) award("asmvp", "All-Star MVP"); }
    if (elite && ovr(n) + noise >= 88) award("allnba", "All-NBA First Team");
    else if (elite && ovr(n) + noise >= 84) award("allnba", "All-NBA Second Team");
    else if (elite && ovr(n) + noise >= 80) award("allnba", "All-NBA Third Team");
    if (elite && ovr(n) + noise >= 92 && w >= 50 && ch(0.45)) award("mvp", "MVP");
    if (elite && n.sk.def >= 82 && ovr(n) + noise >= 78 && ch(0.28)) award("dpoy", "Defensive Player of the Year");
    else if (elite && n.sk.def >= 74 && ovr(n) + noise >= 70 && ch(0.2)) award("alld", "All-Defensive Team");
    if (elite && sc >= 28 && ch(0.5)) award("scorer", "Scoring Champion");
    if (n.yrsPro === 1 && games >= 40 && ovr(n) + noise >= 64 && ch(0.35)) award("roy", "Rookie of the Year");
    if (ln.role === "Rotation" && sc >= 12 && games >= 55 && ch(0.15)) award("smoy", "Sixth Man of the Year");
    if (ln.champ) {
      n.champs++;
      award("champ", "NBA Champion");
      if (ovr(n) + noise >= 76 && games >= 50 && ch(0.3)) award("fmvp", "Finals MVP");
    }
    const lvl = ovr(n);
    n.fame = cl(n.fame + (lvl - 55) / 10 + (ln.champ ? 8 : 0) + (ln.rounds >= 2 ? 2 : 0));
    n.trust = cl(n.trust + (ln.role === "Starter" ? 2 : -1) + ri(-4, 4));
    stat("Happiness", ln.champ ? 10 : w >= 50 ? 2 : -1);
    const seed = res.seeds[n.team];
    const resTxt = ln.champ ? "You won the NBA championship!" : res.finals === n.team ? "You lost in the NBA Finals." : seed ? `Playoffs: eliminated after ${ln.rounds === 0 ? "round 1" : ln.rounds === 1 ? "round 2" : "the conference finals"}.` : "The team missed the playoffs.";
    steps.push(info(`${yr()} · ${t.name}`, `${w}-${82 - w}. ${resTxt}${inj ? ` You missed time with ${inj[0]}.` : ""}`, [
      ["Role", ln.role], ["Games", String(games)], ["Points", String(ln.ppg)], ["Rebounds", String(ln.rpg)], ["Assists", String(ln.apg)], ["Overall", String(ovr(n))], ...aw.map((a) => ["Award", a]),
    ], aw.includes("NBA Champion") ? TROPHY.champ : t.logo));
    if (ln.champ) sayIt(`I won the NBA championship with the ${t.name}.`);
    aw.filter((a) => a !== "NBA Champion").forEach((a) => sayIt(`I was named ${a}.`));
    // endorsements
    if (n.endorse) {
      addMoney(Math.round(n.endorse.pay * ifx()));
    }
    // contract
    if (n.contract) {
      n.contract.yrs--;
      n.contract.sal *= 1.03 > 1 && n.contract.rookie ? 1.04 : 1;
    }
    if (n.contract && n.contract.yrs <= 0) {
      steps.push((next) => freeAgency(n, next));
    } else {
      syncJob(n);
      if (n.contract && !n.contract.rookie && ch(0.12)) steps.push((next) => tradeCard(n, next));
    }
    steps.push((next) => endorseOffer(n, next));
    eventsStep(n, steps);
    steps.push((next) => {
      if (n.retired || !n.active) return;
      if (state.age >= 33 && (ovr(n) < 55 || state.age >= 40 || (state.age >= 36 && ch(0.35)))) return retireCard(n, true);
      next();
    });
  }

  function endorseOffer(n, next) {
    if (n.endorse || n.fame < 35 || !ch(0.45)) return next();
    const pay = Math.round((n.fame - 25) * 70000 * (1 + (ovr(n) - 70) / 40));
    const b = pick(BRANDS);
    card({
      iconSrc: "emoji/1f45f.png",
      title: "Sneaker deal",
      lead: `${b} wants you as the face of their next shoe line.`,
      rows: [["Brand", b], ["Pay", `${money(pay)}/yr`]],
      choices: [["Sign it", () => { n.endorse = { brand: b, pay }; n.fame = cl(n.fame + 3); sayIt(`I signed a shoe deal with ${b}.`); next(); }], ["Decline", next]],
    });
  }

  // ------------------------------------------------------------------ free agency, trades
  function freeAgency(n, next) {
    const o = ovr(n);
    if (o < 52 && (n.contract ? n.contract.yrs <= 0 : true) && (n.contract && (n.contract.two || n.yrsPro >= 3))) {
      return card({ iconSrc: ICON, title: "No offers", lead: "Your contract expires and nobody calls. The league has moved on.", ok: () => { endCareer(n, "no offers in free agency"); sayIt("My NBA career ended when no team offered me a contract."); } });
    }
    const val = FASAL(o) * (1 + (n.fame - 40) / 400);
    const offers = [];
    const cur = tm(n);
    const mk = (t, f, yrs) => ({ t, yrs, sal: Math.round(Math.min(58000000, val * f) * ifx()) });
    if (cur && n.trust >= 30) offers.push(mk(cur, 1.05, ri(2, 4)));
    const pool = D().filter((t) => !cur || t.abbr !== cur.abbr).sort(() => rnd() - 0.5).slice(0, o >= 64 ? 3 : 2);
    pool.forEach((t, i) => offers.push(mk(t, 0.85 + rnd() * 0.5, ri(1, 5))));
    const minSal = Math.round(1300000 * ifx());
    card({
      iconSrc: cur ? cur.logo : ICON,
      title: "Free agency",
      lead: `Your contract is up. Agents are calling. Overall ${o}, fame ${Math.round(n.fame)}%.`,
      choices: [
        ...offers.map((f) => [`${f.t.name} · ${f.yrs} yr · ${money(Math.max(minSal, f.sal))}/yr`, () => {
          const same = cur && f.t.abbr === cur.abbr;
          signDeal(n, f.t, { yrs: f.yrs, sal: Math.max(minSal, f.sal), kind: same ? "Re-signed" : "Free agent deal" });
          n.trust = same ? n.trust : 55;
          sayIt(`I ${same ? "re-signed with" : "signed with"} the ${f.t.name} for ${money(Math.max(minSal, f.sal))} a year.`);
          note("Signed", `${f.yrs} years with the ${f.t.name}.`, next);
        }]),
        ["Retire", () => retireCard(n, false)],
      ],
    });
  }
  function tradeCard(n, next) {
    const cur = tm(n);
    const t = pick(D().filter((x) => x.abbr !== cur.abbr));
    card({
      iconSrc: t.logo,
      title: "You have been traded",
      lead: `The ${cur.name} send you to the ${t.name}. Your phone will not stop buzzing.`,
      choices: [["Accept it", () => {
        n.team = t.abbr;
        n.trust = 55;
        n.contract.sal = n.contract.sal;
        sayIt(`I was traded to the ${t.name}.`);
        syncJob(n);
        next();
      }], ["Demand to stay (risky)", () => {
        if (ch(0.35)) { stat("Happiness", 4); note("It worked", "The front office backs down. You stay.", next); }
        else { n.team = t.abbr; n.trust = 40; syncJob(n); sayIt(`I was traded to the ${t.name} anyway.`); note("Traded anyway", "They did it anyway, and word got around that you are difficult.", next); }
      }]],
    });
  }

  // ------------------------------------------------------------------ retirement
  function legacy(n) {
    const a = (k) => n.awards.filter((x) => x.k === k).length;
    return n.champs * 14 + a("mvp") * 22 + a("fmvp") * 10 + a("dpoy") * 9 + a("allnba") * 4 + n.allstar * 3 + a("scorer") * 5 + Math.round(n.seasons.filter((s) => s.team && s.w != null).reduce((s, x) => s + x.ppg * x.g, 0) / 900);
  }
  function retireCard(n, forced) {
    const go = () => {
      n.retired = true;
      n.active = false;
      clearJob();
      const sc = legacy(n);
      const hof = sc >= 60;
      n.legacy = { score: sc, hof, champs: n.champs };
      sayIt(hof ? "I retired from the NBA and was elected to the Hall of Fame." : "I retired from the NBA.");
      const pro = n.seasons.filter((s) => s.w != null);
      const g = pro.reduce((s, x) => s + x.g, 0) || 1;
      const pts = (pro.reduce((s, x) => s + x.ppg * x.g, 0) / g).toFixed(1);
      if (hof) { n.fame = 100; stat("Happiness", 12); }
      card({
        iconSrc: hof ? "bball/hof.png" : ICON,
        title: hof ? "Hall of Fame" : "Retirement",
        lead: hof ? "A legendary career. Your jersey goes to the rafters and your bust to Springfield." : "The game gave you a lot. Time for what comes next.",
        rows: [["Seasons", String(pro.length)], ["Career points per game", pts], ["Championships", String(n.champs)], ["All-Stars", String(n.allstar)], ["Legacy score", String(sc)]],
        ok: () => {
          if (pro.length >= 3) {
            card({ iconSrc: "emoji/1f3a4.png", title: "TV offer", lead: "A network offers you a seat on the studio panel.", choices: [["Take it", () => { state.job = { t: "Sports Analyst", c: "Media", emp: "Sports Network", pay: Math.round(450000 * ifx()), icon: "emoji/1f3a4.png", perf: 70, yrs: 0 }; render(); }], ["No thanks", () => {}]] });
          }
        },
      });
    };
    if (forced) return card({ iconSrc: ICON, title: "The end of the road", lead: "Your body and the numbers agree: it is time to hang it up.", ok: go });
    card({ iconSrc: ICON, title: "Retire?", lead: "You walk away from the league. You cannot come back.", choices: [["Retire", go], ["Keep playing", () => {}]] });
  }

  // ------------------------------------------------------------------ events
  const bonus = (n) => ({ ppg: n.seasons.length ? n.seasons[n.seasons.length - 1].ppg : 0 });
  const mate = (n) => {
    const t = tm(n);
    return t ? pick(t.players).n : "a teammate";
  };
  const fxApply = (n, fx) => {
    if (!fx) return;
    if (fx.skill) SK.forEach(([k]) => (n.sk[k] = cl(n.sk[k] + fx.skill, 15, 99)));
    if (fx.fame) n.fame = cl(n.fame + fx.fame);
    if (fx.trust) n.trust = cl(n.trust + fx.trust);
    if (fx.fit) n.fit = cl(n.fit + fx.fit);
    if (fx.hype) n.hype = Math.max(0, n.hype + fx.hype);
    if (fx.hap) stat("Happiness", fx.hap);
    if (fx.hea) stat("Health", fx.hea);
    if (fx.money) addMoney(Math.round(fx.money * ifx()));
    if (fx.inj) { n.inj = { name: "a bad injury", left: fx.inj, sev: 1 }; }
  };
  const EV = [
    { id: "agent", st: ["pro"], w: 3, t: "Your agent calls", d: (n) => "Your agent says another agency wants to sign you and promises bigger deals.", c: [
      ["Switch agents", 0.55, { fame: 4, money: 150000 }, { fame: -4, hap: -3 }, "The new agent finds you a few small deals.", "The new agent is all talk and the old one is furious."],
      ["Stay loyal", null, { hap: 2, trust: 2 }, null, "You stay put. The old agent works harder for you."],
    ] },
    { id: "coach", st: ["pro", "college"], w: 4, t: "Words with the coach", d: (n) => `${tm(n) ? tm(n).coach : "The coach"} benches you in the fourth quarter and you did not like it.`, c: [
      ["Talk to him privately", 0.7, { trust: 6 }, { trust: -5, hap: -2 }, "You clear the air. He respects it.", "He takes it as an attack."],
      ["Say it to the media", 0.3, { fame: 4, hype: 2 }, { trust: -14, fame: -3 }, "The fans take your side.", "The coach is livid and so is the front office."],
      ["Swallow it", null, { hap: -2, trust: 1 }, null, "You keep it inside."],
    ] },
    { id: "rival", st: ["pro", "college", "hs"], w: 4, t: "Trash talk", d: (n) => "A rival star talks trash to you during warm-ups and the whole arena sees it.", c: [
      ["Answer on the court", 0.55, { fame: 4, hype: 3, skill: 0 }, { fame: -2, hap: -3 }, "You drop a big night on him. The clip is everywhere.", "He torches you and you hear about it."],
      ["Ignore him", null, { hap: 1 }, null, "You stay quiet."],
    ] },
    { id: "charity", st: ["pro"], w: 3, t: "Charity game", d: (n) => "A kids' hospital asks you to host a charity game.", c: [
      ["Host it and donate", null, { fame: 4, hap: 6, money: -50000, trust: 2 }, null, "The kids remember it forever, and so do you."],
      ["Send a signed jersey", null, { fame: 1, hap: 1 }, null, "A nice gesture, nothing more."],
    ] },
    { id: "dunk", st: ["pro"], w: 2, t: "Dunk contest", d: (n) => "The league invites you to the All-Star Saturday dunk contest.", c: [
      ["Enter", (n) => cl(0.2 + n.sk.ath / 180, 0.2, 0.7), { fame: 8, hype: 3, hap: 4 }, { hea: -6, fame: -2 }, "A perfect fifty. The arena erupts.", "You bang it off the rim and hurt your wrist."],
      ["Pass", null, { fit: 4 }, null, "You rest."],
    ] },
    { id: "party", st: ["pro", "college"], w: 4, t: "A wild night", d: (n) => "Teammates invite you out the night before a big game.", c: [
      ["Go", 0.4, { hap: 6, fame: 1 }, { fit: -12, trust: -6, fame: -2 }, "A great night and no consequences.", "You play like a ghost and the coach noticed."],
      ["Stay in", null, { fit: 5, trust: 3 }, null, "You sleep early and feel it."],
    ] },
    { id: "buzzer", st: ["pro", "college", "hs"], w: 3, t: "Buzzer beater", d: (n) => "Down one, three seconds left. The ball is yours.", c: [
      ["Take the shot", (n) => cl(0.2 + n.sk.shoot / 220, 0.2, 0.6), { fame: 8, hype: 5, hap: 8, trust: 4 }, { hap: -5, fame: -3 }, "Bang! The crowd goes wild.", "It rattles out. You are crushed."],
      ["Pass to the open man", 0.6, { trust: 3, hap: 2 }, { trust: -1 }, "The pass works. Everyone shares the win.", "He misses. You take the blame anyway."],
    ] },
    { id: "social", st: ["pro", "college"], w: 4, t: "A post goes viral", d: (n) => "A rough tweet from your past surfaces and it is trending.", c: [
      ["Apologize publicly", 0.7, { fame: -1, trust: 2 }, { fame: -5 }, "People forgive you.", "The apology makes things worse."],
      ["Say nothing", 0.4, {}, { fame: -6, hap: -4 }, "It blows over.", "It lingers all week."],
    ] },
    { id: "veteran", st: ["pro"], w: 3, t: "A veteran takes you under his wing", d: (n) => `${mate(n)} offers to show you how to prepare like a pro.`, c: [
      ["Listen and learn", null, { skill: 1, trust: 3, fit: 3 }, null, "Everything you pick up is worth it."],
      ["Do it your way", 0.4, { hap: 1 }, { trust: -3 }, "You do alright.", "He drops it, and the room takes his side."],
    ] },
    { id: "ref", st: ["pro", "college"], w: 2, t: "A bad call", d: (n) => "A terrible foul call gives the other team the win.", c: [
      ["Scream at the ref", 0.25, { fame: 3 }, { money: -25000, trust: -2, hap: -2 }, "He ignores you.", "You get ejected and fined."],
      ["Walk away", null, { hap: -1 }, null, "You cool off in the tunnel."],
    ] },
    { id: "sneaker", st: ["pro"], w: 2, t: "Signature shoe", d: (n) => "A brand wants to design a signature shoe with you.", gate: (n) => n.fame >= 55, c: [
      ["Co-design it", null, { fame: 6, money: 1200000, hap: 4 }, null, "The shoe sells out in a weekend."],
      ["Pass", null, {}, null, "You say no."],
    ] },
    { id: "olympics", st: ["pro"], w: 2, t: "National team", d: (n) => "USA Basketball invites you to the national team camp.", gate: (n) => ovr(n) >= 76, c: [
      ["Join", 0.55, { fame: 10, hap: 6, hype: 2 }, { fame: 2, hea: -4 }, "You bring home the gold.", "A hard bronze and a sore back."],
      ["Rest your body", null, { fit: 8, trust: 1 }, null, "A quiet summer."],
    ] },
    { id: "slump", st: ["pro", "college"], w: 4, t: "A shooting slump", d: (n) => "You have missed twenty shots in a row. The crowd is getting restless.", c: [
      ["Extra gym hours", 0.65, { skill: 1, fit: -6 }, { fit: -10, hap: -3 }, "It pays off. The shot comes back.", "You burn yourself out."],
      ["See the team psychologist", null, { hap: 3, trust: 1 }, null, "You talk, you breathe, you move on."],
    ] },
    { id: "fan", st: ["pro", "college"], w: 3, t: "A fan at the airport", d: (n) => "A kid runs up in the airport, almost crying, and asks for a photo.", c: [
      ["Stop and chat", null, { fame: 3, hap: 4 }, null, "You make his year."],
      ["Keep walking", null, { fame: -1 }, null, "A phone catches it."],
    ] },
    { id: "workout", st: ["pro", "college", "hs"], w: 3, t: "Summer workouts", d: (n) => "A famous trainer opens a spot for you at his camp.", c: [
      ["Pay for the camp", (n) => 0.8, { skill: 1, fit: 6, money: -40000 }, { fit: 2 }, "You come back sharper.", "A decent camp, nothing special."],
      ["Work out at home", null, { fit: 3 }, null, "A solid summer."],
    ] },
    { id: "media", st: ["pro"], w: 3, t: "The press room", d: (n) => "A reporter asks about your team's playoff chances.", c: [
      ["Be honest", 0.6, { fame: 2, trust: 2 }, { trust: -4 }, "A mature answer.", "Your honesty hurts feelings in the locker room."],
      ["Stay on script", null, {}, null, "Nobody remembers it."],
    ] },
    { id: "family", st: ["pro", "college", "hs"], w: 2, t: "Family needs help", d: (n) => "A relative asks you for money to cover an emergency.", c: [
      ["Help out", null, { money: -30000, hap: 3 }, null, "Family is family."],
      ["Say no", null, { hap: -3 }, null, "It gets awkward."],
    ] },
    { id: "gym", st: ["pro", "college", "hs"], w: 3, t: "Late-night session", d: (n) => "The gym is empty at midnight and the shot is calling.", c: [
      ["Shoot until dawn", 0.7, { skill: 1, fit: -4 }, { fit: -9 }, "The reps pay off.", "You are wrecked at practice."],
      ["Sleep", null, { fit: 5 }, null, "You take care of yourself."],
    ] },
    { id: "gambling", st: ["pro"], w: 1, t: "Teammates organize a poker night", d: (n) => "The stakes are higher than you thought.", c: [
      ["Play", 0.45, { money: 150000, hap: 4 }, { money: -250000, hap: -4 }, "You clean the table.", "You lose a lot of money."],
      ["Skip", null, {}, null, "You stay out of it."],
    ] },
    { id: "hype", st: ["hs", "college"], w: 4, t: "A scout is watching", d: (n) => "A scout from the league is in the stands tonight.", c: [
      ["Go for the highlights", 0.45, { hype: 8, fame: 3 }, { hype: -3, trust: -3 }, "You throw down a poster dunk.", "You force it and the coach is mad."],
      ["Play your game", null, { hype: 2, trust: 2 }, null, "A clean, smart game."],
    ] },
    { id: "recruit", st: ["hs"], w: 3, t: "Recruiting letters", d: (n) => "Letters from big programs fill your mailbox.", c: [
      ["Answer all of them", null, { hype: 5, fame: 2 }, null, "Coaches start calling your parents."],
      ["Focus on school", null, { skill: 0, hap: 1 }, null, "Your grades stay safe."],
    ] },
    { id: "nil", st: ["college"], w: 3, t: "NIL deal", d: (n) => "A local company offers you money to be their ambassador.", c: [
      ["Take it", null, { money: 80000, fame: 3 }, null, "Easy money."],
      ["Say no", null, { trust: 2 }, null, "You keep your head on the court."],
    ] },
    { id: "fight", st: ["pro", "college"], w: 2, t: "Tempers flare", d: (n) => "A scuffle breaks out on the court and you are right in the middle of it.", c: [
      ["Step in to calm it", 0.6, { trust: 3, fame: 1 }, { money: -30000, trust: -3 }, "You break it up.", "You get fined for being involved."],
      ["Throw a punch", 0.3, { fame: 4 }, { money: -100000, trust: -8, hap: -3 }, "Nobody sees it.", "Suspended for two games and fined."],
    ] },
    { id: "ownership", st: ["pro"], w: 2, t: "Contract extension", d: (n) => `${tm(n) ? tm(n).name : "Your team"} want to talk about an extension.`, gate: (n) => n.contract && !n.contract.two && n.contract.yrs >= 1, c: [
      ["Extend (+2 yrs)", null, { hap: 2 }, null, "You get paid more.", "", (n) => { n.contract.yrs += 2; n.contract.sal = Math.round(n.contract.sal * 1.15); syncJob(n); }],
      ["Wait for free agency", 0.55, { fame: 1 }, { hap: -2 }, "You bet on yourself.", "No improved offer later."],
    ] },
  ];
  const evId = (id) => EV.find((e) => e.id === id);
  function runEvent(n, e, next) {
    const prob = (c) => (typeof c[1] === "function" ? c[1](n) : c[1]);
    card({
      iconSrc: tm(n) ? tm(n).logo : ICON,
      title: e.t,
      lead: e.d(n),
      surprise: true,
      choices: e.c.map((c) => [c[0], () => {
        const p = prob(c);
        const win = p == null ? true : ch(p);
        if (window.FL_SND) FL_SND.result(win);
        fxApply(n, win ? c[2] : c[3]);
        const text = win ? c[4] : c[5] || "It did not go your way.";
        if (c[6] && win) c[6](n);
        syncJob(n);
        render();
        note(e.t, text, next);
      }]),
    });
  }
  function eventsStep(n, steps) {
    const cnt = ch(0.7) ? 1 : 0;
    const stage = n.stage;
    const pool = EV.filter((e) => e.st.includes(stage) && (!e.gate || e.gate(n)));
    for (let i = 0; i < cnt + (ch(0.2) ? 1 : 0); i++) {
      const bag = pool.flatMap((e) => Array(e.w).fill(e));
      if (!bag.length) break;
      const e = pick(bag);
      steps.push((next) => runEvent(n, e, next));
    }
  }

  // ------------------------------------------------------------------ screens
  const barOld = (label, v, color) => `<div style="margin:3px 0"><span style="font-size:12px;opacity:.8">${esc(label)} ${Math.round(v)}%</span><i style="display:block;height:7px;border-radius:4px;background:#0002;overflow:hidden;margin-top:2px"><u style="display:block;height:100%;width:${Math.max(3, v)}%;background:${color}"></u></i></div>`;
  const bar = (label, v, color, hint) => (window.FL_BARS ? FL_BARS.html(label, v, color, hint) : barOld(label, v, color));
  const col = (v) => (v >= 70 ? "#2fa03b" : v >= 45 ? "#f5841f" : "#b3261e");
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
  const row = (id, ic, t, s) => `<div class="row" data-n="${id}"><img src="${ic}" alt="" style="object-fit:contain"><div class="t"><b>${esc(t)}</b><span>${esc(s)}</span></div>${chev()}</div>`;
  const wire = (map) =>
    sList.querySelectorAll("[data-n]").forEach((el) => {
      el.onclick = () => {
        snd("choice");
        const f = map[el.dataset.n];
        if (f) f();
      };
    });

  function openNba() {
    const n = N();
    if (!n.active || n.retired) return openHub0();
    snd("choice");
    if (!openScreen("NBA CAREER", () => (typeof openSpecialCareers === "function" ? openSpecialCareers() : screen.classList.remove("open")))) return;
    const t = tm(n);
    const logo = t ? t.logo : ICON;
    const o = ovr(n);
    let h = `<div class="sec">${esc(stageName(n))}</div><div class="row" style="flex-direction:column;align-items:stretch;height:auto;padding:10px 14px"><div style="display:flex;align-items:center;gap:10px"><img src="${logo}" alt="" style="width:44px;height:44px;object-fit:contain"><div><b>${esc(POS[n.pos].n)} · ${n.stage === "pro" ? role(n) : stageLabel(n)}</b><div style="font-size:12px;opacity:.75">${n.contract ? `${esc(n.contract.kind || "Contract")} · ${money(n.contract.sal)}/yr · ${n.contract.yrs} yr left` : n.stage === "college" ? `Year ${n.collegeYr} of 4` : "Keep working"}</div></div></div>` + bar("Overall", o, col(o)) + bar("Fitness", n.fit, col(n.fit)) + bar("Fame", n.fame, "#6b2f8f") + bar("Coach trust", n.trust, col(n.trust)) + (n.stage !== "pro" ? bar("Draft hype", cl(n.hype), "#2d7dd2") : "") + (n.inj ? `<span style="font-size:12px;color:#b3261e">Injured: ${esc(n.inj.name)} (about ${Math.max(1, Math.round(n.inj.left))} games left)</span>` : "") + `</div>`;
    h += `<div class="sec">Work</div>`;
    h += row("train", "emoji/1f3cb-fe0f.png", "Training", n.trainLeft > 0 ? `${n.trainLeft} sessions left this year` : "No sessions left this year");
    h += row("skills", "bball/ball.png", "Skills", `Overall ${o} · potential is hidden`);
    h += row("stats", "emoji/1f4ca.png", "Stats", `${n.seasons.length} season${n.seasons.length === 1 ? "" : "s"}`);
    if (n.stage === "pro") {
      h += row("roster", logo, "Team roster", t ? `${t.name} · coach ${t.coach}` : "");
      h += row("table", "emoji/1f3c0.png", "League standings", "Wins, conference and your seed");
      h += row("deal", "emoji/1f4b0.png", "Contract and money", n.endorse ? `Endorsement: ${n.endorse.brand} ${money(n.endorse.pay)}/yr` : "No endorsements yet");
    }
    h += row("awards", TROPHY.champ, "Trophy case", `${n.champs} title${n.champs === 1 ? "" : "s"} · ${n.awards.length} honors`);
    h += row("retire", "emoji/1f6aa.png", "Retire", "Hang it up");
    sList.innerHTML = h;
    wire({ train: openTrain, skills: openSkills, stats: openStats, roster: openRoster, table: openTable, deal: openDeal, awards: openAwards, retire: () => retireCard(n, false) });
  }
  const stageLabel = (n) => (n.stage === "hs" ? `High school · age ${state.age}` : n.stage === "college" ? n.school : "Undrafted");
  function openHub0() {
    const n = N();
    if (!openScreen("NBA CAREER", () => (typeof openSpecialCareers === "function" ? openSpecialCareers() : screen.classList.remove("open")))) return;
    let h = `<div class="sec">NBA</div>`;
    if (n.retired && n.legacy) h += row("legacy", n.legacy.hof ? "bball/hof.png" : ICON, "Your last career", n.legacy.hof ? `Hall of Famer · ${n.legacy.champs} titles` : `Legacy score ${n.legacy.score}${n.legacy.how && n.legacy.how !== "retired" ? " · " + n.legacy.how : ""}`);
    if (n.retired && n.seasons && n.seasons.length) h += row("hist", ICON, "Career history", `${n.seasons.length} season${n.seasons.length === 1 ? "" : "s"} on record`);
    h += row("start", ICON, "Start an NBA career", "High school, college, the draft and the league (age 14-28)");
    sList.innerHTML = h;
    wire({ start: () => startCareer(), hist: () => openStats(), legacy: () => note("NBA", n.legacy.hof ? "You are in the Hall of Fame." : "A career worth remembering.") });
  }
  function openTrain() {
    const n = N();
    if (!openScreen("TRAINING", () => openNba())) return;
    let h = `<div class="sec">${n.trainLeft} sessions left</div>`;
    if (n.inj && n.inj.sev > 0) h += `<div class="mm-foot" style="padding:8px 14px">You are injured, so training is lighter.</div>`;
    h += FOCUS.map(([k, nm]) => row(k, "bball/ball.png", `Train ${nm.toLowerCase()}`, `${n.sk[k]}%`)).join("");
    h += row("rest", "emoji/1f4a4.png", "Rest and recovery", `Fitness ${Math.round(n.fit)}%`);
    sList.innerHTML = h;
    const map = {};
    FOCUS.forEach(([k, nm]) => (map[k] = () => {
      if (n.trainLeft <= 0) return note("No sessions left", "You are done for this year. Age up for more.");
      n.trainLeft--;
      n.sk[k] = cl(n.sk[k] + (ch(0.75) ? ri(1, 2) : 0), 15, 99);
      n.fit = cl(n.fit - (n.inj ? 1 : 3));
      stat("Health", 0);
      note("Training", `You put in the work on your ${nm.toLowerCase()}.`, () => openTrain());
    }));
    map.rest = () => {
      if (n.trainLeft <= 0) return note("No sessions left", "You are done for this year.");
      n.trainLeft--;
      n.fit = cl(n.fit + 14);
      note("Rest", "A full week of recovery.", () => openTrain());
    };
    wire(map);
  }
  function openSkills() {
    const n = N();
    if (!openScreen("SKILLS", () => openNba())) return;
    sList.innerHTML = `<div class="sec">${esc(POS[n.pos].n)} · overall ${ovr(n)}</div><div class="row" style="flex-direction:column;align-items:stretch;height:auto;padding:10px 14px">${SK.map(([k, nm]) => bar(nm, n.sk[k], col(n.sk[k]))).join("")}</div>`;
  }
  function openStats() {
    const n = N();
    if (!openScreen("STATS", () => openNba())) return;
    const rows = n.seasons.slice().reverse().map((s) => `<div class="row"><div class="t"><b>${s.yr} · ${esc(s.w != null && TEAM(s.team) ? TEAM(s.team).name : s.team)}</b><span>${s.ppg} pts · ${s.rpg} reb · ${s.apg} ast · ${s.g} g${s.w != null ? ` · ${s.w}-${82 - s.w}` : ""}${s.champ ? " · Champions" : ""}</span></div></div>`).join("");
    sList.innerHTML = `<div class="sec">Seasons</div>` + (rows || `<div class="mm-foot" style="padding:12px 14px">No seasons yet.</div>`);
  }
  function openRoster() {
    const n = N();
    const t = tm(n);
    if (!t || !openScreen("ROSTER", () => openNba())) return;
    const list = t.players.slice().sort((a, b) => b.yrs - a.yrs);
    sList.innerHTML = `<div class="sec">${esc(t.name)} · coach ${esc(t.coach)}</div><div class="row"><img src="${n.contract ? t.logo : ICON}" alt="" style="object-fit:contain"><div class="t"><b>You · ${esc(POS[n.pos].n)}</b><span>${role(n)} · overall ${ovr(n)}</span></div></div>` + list.map((p) => `<div class="row"><div class="t"><b>${esc(p.n)}</b><span>${p.pos} · ${p.age} · ${esc(p.ht)}${p.col ? " · " + esc(p.col) : ""}</span></div></div>`).join("");
  }
  function openTable() {
    const n = N();
    if (!openScreen("STANDINGS", () => openNba())) return;
    const lg = league();
    const mk = (conf) => D().filter((t) => t.conf === conf).sort((a, b) => lg[b.abbr].w - lg[a.abbr].w).map((t, i) => `<div class="row"${t.abbr === n.team ? ' style="background:#2d7dd222"' : ""}><img src="${t.logo}" alt="" style="object-fit:contain"><div class="t"><b>${i + 1}. ${esc(t.name)}</b><span>${lg[t.abbr].w}-${82 - lg[t.abbr].w}</span></div></div>`).join("");
    sList.innerHTML = `<div class="sec">Eastern Conference</div>${mk("E")}<div class="sec">Western Conference</div>${mk("W")}`;
  }
  function openDeal() {
    const n = N();
    if (!openScreen("CONTRACT", () => openNba())) return;
    const c = n.contract;
    sList.innerHTML = `<div class="sec">Contract</div>` + (c ? `<div class="row"><div class="t"><b>${esc(c.kind || "Contract")}</b><span>${money(c.sal)} a year · ${c.yrs} year${c.yrs === 1 ? "" : "s"} left${n.pickNo ? ` · pick #${n.pickNo}` : ""}</span></div></div>` : "") + `<div class="sec">Endorsements</div><div class="row"><div class="t"><b>${n.endorse ? esc(n.endorse.brand) : "None"}</b><span>${n.endorse ? money(n.endorse.pay) + " a year" : "Win games and gain fame to get offers"}</span></div></div>`;
  }
  function openAwards() {
    const n = N();
    if (!openScreen("TROPHY CASE", () => openNba())) return;
    const img = (k) => TROPHY[k] || TROPHY.champ;
    const rows = n.awards.slice().reverse().map((a) => `<div class="row"><img src="${img(a.k)}" alt="" style="object-fit:contain"><div class="t"><b>${esc(a.a)}</b><span>${a.y}</span></div></div>`).join("");
    sList.innerHTML = `<div class="sec">${n.champs} championship${n.champs === 1 ? "" : "s"} · ${n.allstar} All-Star</div>` + (rows || `<div class="mm-foot" style="padding:12px 14px">Nothing yet.</div>`);
  }

  // ------------------------------------------------------------------ hooks
  function boot() {
    if (typeof state === "undefined" || typeof jCard !== "function" || typeof notice !== "function" || typeof sList === "undefined" || typeof openSpecialCareers !== "function" || !document.getElementById("ageBtn") || !window.FL_NBA_DATA) return setTimeout(boot, 80);
    const orig = window.openSpecialCareers;
    window.openSpecialCareers = function () {
      const out = orig.apply(this, arguments);
      try {
        const pack = sList.querySelector('[data-pack="athlete"]');
        if (pack) {
          const prev = pack.classList.contains("dis") ? null : pack.onclick;
          pack.classList.remove("dis");
          if (!pack.querySelector(".chev") && !pack.querySelector("svg")) pack.insertAdjacentHTML("beforeend", chev());
          pack.onclick = function () {
            if (typeof prev !== "function") return openNba();
            prev.apply(this, arguments);
            if (sList.querySelector('[data-n="nba"]')) return;
            const n = N();
            sList.insertAdjacentHTML("beforeend", row("nba", ICON, "NBA Career", on() ? `${stageName(n)} · ${POS[n.pos].n}` : "High school to the league, the draft and the Hall of Fame"));
            const el = sList.querySelector('[data-n="nba"]');
            el.onclick = () => (snd("choice"), openNba());
          };
        }
      } catch (e) {
        warn("menu", e);
      }
      return out;
    };
    const origJob = window.openJobScreen;
    if (typeof origJob === "function")
      window.openJobScreen = function () {
        if (state.job && state.job.nba) return openNba();
        return origJob.apply(this, arguments);
      };
    document.getElementById("ageBtn").addEventListener("click", () =>
      setTimeout(() => {
        try {
          tick();
        } catch (e) {
          warn("tick", e);
        }
      }, 600),
    );
    console.log("[nba] loaded");
  }
  window.FL_NBA = {
    open: () => openNba(),
    start: startCareer,
    state: () => N(),
    tick,
    ovr: () => ovr(N()),
    eventNow: (id) => (evId(id) ? runEvent(N(), evId(id), () => {}) : null),
    draft: () => runDraft(N(), N().stage === "hs"),
  };
  boot();
})();
