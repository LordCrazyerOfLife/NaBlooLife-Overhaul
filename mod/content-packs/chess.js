/* [mod] Chess Career — carrera de ajedrez para NaBlooLife (mod local).
 * Fase 1: rating FIDE (Elo real), títulos con normas, torneos simulados, coach, clases, Pawnder (online simulado).
 * Diseño: ver AJEDREZ.md. Se carga como mod (mods.js, código 64646464) y no toca game.html.
 * Estado: state.chess (JSON puro, se crea perezosamente; cada vida tiene el suyo).
 */
(() => {
  "use strict";

  // Puede cargarse desde mods.js o desde modloader.js. El guard evita que se
  // enganche dos veces y duplique la fila de Chess Career.
  if (window.FL_CHESS || window.__FL_CHESS_LOADING) return;
  window.__FL_CHESS_LOADING = true;

  // ---------------------------------------------------------------- utilidades
  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const clampN = (v, a, b) => Math.max(a, Math.min(b, v));
  const gauss = () => {
    let u = 0, v = 0;
    while (!u) u = rnd();
    while (!v) v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const ord = (n) => {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  const money = (n) => (typeof usd === "function" ? usd(n) : "$" + Math.round(n).toLocaleString("en-US"));
  // localPrice() del juego tiene un mínimo de $5, así que el 0 se maneja aparte
  const price = (n) => (!n ? 0 : typeof localPrice === "function" ? localPrice(n) : n);
  const ICON = {
    pawn: "emoji/265f-fe0f.png",
    trophy: "emoji/1f3c6.png",
    brain: "emoji/1f9e0.png",
    pc: "emoji/1f4bb.png",
    teacher: "emoji/1f9d1-200d-1f3eb.png",
    money: "emoji/1f4b0.png",
    stream: "emoji/1f3a5.png",
    medal: "emoji/1f3c5.png",
    chart: "emoji/1f4c8.png",
    deal: "emoji/1f91d.png",
    fire: "emoji/1f525.png",
    tv: "emoji/1f4fa.png",
    clock: "emoji/23f1-fe0f.png",
    puzzle: "emoji/1f9e9.png",
  };
  const SITE = "Pawnder";

  // ---------------------------------------------------------------- estado
  const C = () => {
    const c = (state.chess ||= {});
    if (!c.v) {
      const smarts = (state.stats && state.stats.Smarts) || 50;
      Object.assign(c, {
        v: 1,
        talent: +clampN(0.55 + smarts / 160 + gauss() * 0.18, 0.4, 1.6).toFixed(2), // oculto
        str: 0, // fuerza real oculta (Elo "verdadero")
        fide: null, // rating publicado (null = sin rating)
        unrated: { n: 0, opp: 0, score: 0 }, // partidas para el primer rating
        rgames: 0, // partidas rateadas jugadas
        peak: 0,
        everK10: false,
        title: null,
        wtitle: null,
        norms: { IM: 0, GM: 0 },
        coach: 0, // 0 nadie, 1 club, 2 IM, 3 GM
        online: null, // {bullet, blitz, rapid, n}
        followers: 0,
        earned: 0,
        events: 0,
        best: null, // mejor resultado {name, place, age}
        champion: false,
        yr: null,
      });
      c.str = startStrength();
    }
    if (!c.yr || c.yr.age !== state.age) c.yr = { age: state.age, train: 0, tourneys: 0, online: 0, lessons: 0, stream: 0 };
    return c;
  };

  function startStrength() {
    const smarts = (state.stats && state.stats.Smarts) || 50;
    // un principiante adulto ronda 700–1000; un niño de 6 arranca más bajo pero crece rápido
    const base = 500 + smarts * 4 + Math.min(state.age, 25) * 12;
    return Math.round(clampN(base + gauss() * 80, 400, 1400));
  }

  // ---------------------------------------------------------------- Elo / títulos
  const expected = (ra, rb) => 1 / (1 + Math.pow(10, clampN(rb - ra, -400, 400) / 400));

  function kFactor(c) {
    if (c.everK10) return 10;
    if (c.rgames < 30) return 40;
    if (state.age < 18 && c.fide < 2300) return 40;
    return 20;
  }

  const TITLES = [
    ["GM", 2500, "GM"],
    ["IM", 2400, "IM"],
    ["FM", 2300, null],
    ["CM", 2200, null],
  ];
  const WTITLES = [
    ["WGM", 2300],
    ["WIM", 2200],
    ["WFM", 2100],
    ["WCM", 2000],
  ];
  const TITLE_NAME = {
    GM: "Grandmaster",
    IM: "International Master",
    FM: "FIDE Master",
    CM: "Candidate Master",
    WGM: "Woman Grandmaster",
    WIM: "Woman International Master",
    WFM: "Woman FIDE Master",
    WCM: "Woman Candidate Master",
  };
  const rank = (t) => ["CM", "FM", "IM", "GM"].indexOf(t);

  function checkTitles(c) {
    const got = [];
    if (c.fide == null) return got;
    for (const [t, min, normKey] of TITLES) {
      if (rank(t) <= rank(c.title)) break;
      if (c.peak >= min && (!normKey || c.norms[normKey] >= 3)) {
        c.title = t;
        got.push(t);
        break;
      }
    }
    if (state.gender === "f") {
      const wr = (t) => ["WCM", "WFM", "WIM", "WGM"].indexOf(t);
      for (const [t, min] of WTITLES) {
        if (wr(t) <= wr(c.wtitle)) break;
        const normOk = t === "WGM" ? c.norms.IM >= 3 : t === "WIM" ? c.norms.IM >= 2 : true;
        if (c.peak >= min && normOk) {
          c.wtitle = t;
          got.push(t);
          break;
        }
      }
    }
    return got;
  }

  const titleTag = (c) => c.title || c.wtitle || "";
  const ratingTxt = (c) => (c.fide == null ? "Unrated" : String(c.fide));

  // ---------------------------------------------------------------- torneos
  // field: [min, max] del rating de los rivales; topField: rating de las mesas de arriba (suizo)
  const TOURNEYS = [
    { id: "club", name: "Local Club Open", rounds: 5, fee: 20, field: [900, 1700], top: 1850, pool: 600, minAge: 6 },
    { id: "youth", name: "National Youth Championship", rounds: 7, fee: 40, field: [1300, 2000], top: 2250, pool: 3000, maxAge: 18, minFide: 1400 },
    { id: "regional", name: "Regional Open", rounds: 7, fee: 60, field: [1400, 2100], top: 2300, pool: 5000, minAge: 8 },
    { id: "national", name: "National Championship", rounds: 9, fee: 100, field: [2050, 2400], top: 2550, pool: 25000, minFide: 2100, norms: true },
    { id: "intl", name: "International Open", rounds: 9, fee: 150, field: [1900, 2450], top: 2680, pool: 80000, minFide: 2000, norms: true, abroad: true },
    { id: "elite", name: "Super Grandmaster Invitational", rounds: 9, fee: 0, field: [2680, 2780], top: 2780, pool: 450000, minFide: 2680, invite: true, rr: true },
    { id: "candidates", name: "Candidates Tournament", rounds: 14, fee: 0, field: [2700, 2790], top: 2790, pool: 800000, minFide: 2730, invite: true, rr: true },
  ];
  const MAX_TOURNEYS = 4;

  function titleFor(r) {
    if (r >= 2500) return rnd() < 0.85 ? "GM" : "IM";
    if (r >= 2400) return rnd() < 0.7 ? "IM" : rnd() < 0.5 ? "GM" : "FM";
    if (r >= 2300) return rnd() < 0.7 ? "FM" : "IM";
    if (r >= 2200) return rnd() < 0.5 ? "CM" : "FM";
    return null;
  }

  function simGame(myStr, oppStr) {
    const e = expected(myStr + gauss() * 60, oppStr);
    const lvl = (myStr + oppStr) / 2;
    const drawBase = clampN(0.08 + (lvl - 1200) / 2600, 0.08, 0.55);
    const d = drawBase * (1 - Math.abs(2 * e - 1));
    const w = clampN(e - d / 2, 0, 1);
    const x = rnd();
    return x < w ? 1 : x < w + d ? 0.5 : 0;
  }

  function pairOpp(t, c, r, score) {
    const [lo, hi] = t.field;
    if (t.rr) return ri(lo, hi);
    // suizo: si vas bien, te emparejan con las mesas de arriba
    const lead = score - r / 2; // + vas arriba, - vas abajo
    const center = clampN((c.fide || c.str) + lead * 90, lo, t.top);
    return Math.round(clampN(center + gauss() * 90, lo - 100, t.top + 60));
  }

  function runTournament(t, c, rounds = t.rounds) {
    const games = [];
    let score = 0;
    for (let r = 0; r < rounds; r++) {
      const opp = pairOpp(t, c, r, score);
      const res = simGame(c.str, opp);
      score += res;
      games.push({ opp, res, title: titleFor(opp) });
    }
    return { games, score };
  }

  const SURNAMES = [
    "Petrov", "Novak", "Kowalski", "Garcia", "Rossi", "Nakamura", "Ivanov", "Silva", "Müller", "Kumar", "Chen", "Haddad",
    "Okafor", "Larsen", "Dubois", "Moreno", "Horvath", "Sato", "Kaya", "Lindqvist", "Popescu", "Rahimov", "Tanaka", "Ortega",
    "Nguyen", "Kim", "Andersen", "Vargas", "Yilmaz", "Mensah", "Bauer", "Costa", "Fischer", "Rao", "Sokolov", "Haas",
  ];
  const oppName = (title) => `${title ? title + " " : ""}${"ABCDEFGHIJKLMNOPRSTVYZ"[ri(0, 21)]}. ${pick(SURNAMES)}`;

  function performance(games) {
    const n = games.length;
    const avg = games.reduce((s, g) => s + g.opp, 0) / n;
    const pts = games.reduce((s, g) => s + g.res, 0);
    return Math.round(avg + 800 * (pts / n - 0.5));
  }

  function placeFor(t, score) {
    // posición aproximada según puntos/rounds (los mejores con 75%+ pelean el primer puesto)
    const pct = score / t.rounds;
    if (t.rr) {
      if (pct >= 0.68) return 1;
      if (pct >= 0.6) return ri(2, 3);
      if (pct >= 0.5) return ri(3, 5);
      return ri(5, 8);
    }
    if (pct >= 0.86) return 1;
    if (pct >= 0.78) return ri(1, 3);
    if (pct >= 0.7) return ri(3, 8);
    if (pct >= 0.6) return ri(8, 20);
    return ri(20, 80);
  }

  function prizeFor(t, place) {
    const share = [0, 0.25, 0.15, 0.1, 0.07, 0.05, 0.04, 0.03, 0.025];
    if (place <= 8) return Math.round(t.pool * share[place]);
    if (place <= 15 && !t.rr) return Math.round(t.pool * 0.01);
    return t.rr ? Math.round(t.pool * 0.03) : 0;
  }

  function applyRating(c, games) {
    const before = c.fide;
    if (c.fide == null) {
      // primer rating: 5+ partidas contra rivales con rating, más 2 rivales imaginarios de 1800 que hacen tablas
      for (const g of games) {
        c.unrated.n++;
        c.unrated.opp += g.opp;
        c.unrated.score += g.res;
      }
      if (c.unrated.n >= 5) {
        const n = c.unrated.n + 2;
        const avg = (c.unrated.opp + 3600) / n;
        const p = (c.unrated.score + 1) / n;
        const r = Math.round(Math.min(2200, avg + clampN(800 * (p - 0.5), -800, 800)));
        if (r >= 1400) {
          c.fide = r;
          c.rgames = c.unrated.n;
        } else {
          c.unrated = { n: 0, opp: 0, score: 0 }; // no llegó al piso: sigue sin rating
        }
      }
      return { before, after: c.fide };
    }
    const k = kFactor(c);
    let delta = 0;
    for (const g of games) delta += k * (g.res - expected(c.fide, g.opp));
    c.fide = Math.max(1400, Math.round(c.fide + delta));
    c.rgames += games.length;
    return { before, after: c.fide };
  }

  function checkNorm(t, c, games) {
    if (!t.norms || games.length < 9) return null;
    const perf = performance(games);
    const titled = games.filter((g) => g.title).length;
    const gms = games.filter((g) => g.title === "GM").length;
    const ims = games.filter((g) => g.title === "IM" || g.title === "GM").length;
    if (titled < games.length / 2) return null;
    if (rank(c.title) < rank("GM") && perf >= 2600 && gms >= 3) return "GM";
    if (rank(c.title) < rank("IM") && perf >= 2450 && ims >= 3) return "IM";
    return null;
  }

  function enterTournament(t) {
    const c = C();
    if (c.banUntil > state.age) return notice("Banned", `FIDE suspended you until age ${c.banUntil}.`, null, !0);
    if (c.yr.tourneys >= MAX_TOURNEYS)
      return notice("Too many tournaments", `You've already played ${MAX_TOURNEYS} tournaments this year. Rest up!`, null, !0);
    const fee = price(t.fee) + (t.abroad ? price(900) : 0);
    const parentsPay = state.age < 18; // a los menores les pagan la inscripción los padres
    if (!parentsPay && state.money < fee)
      return notice("Not enough money", `You need ${money(fee)} to enter (fee${t.abroad ? " + travel" : ""}).`, null, !0);
    if (!parentsPay) state.money -= fee;
    c.yr.tourneys++;
    c.events++;

    // Todas las rondas menos la última se simulan; la última es la "partida clave".
    const { games, score } = runTournament(t, c, t.rounds - 1);
    const r = t.rounds - 1;
    const opp = pairOpp(t, c, r, score);
    const oppTitle = titleFor(opp);
    const name = oppName(oppTitle);
    const close = (res) => {
      games.push({ opp, res, title: oppTitle });
      finishTournament(t, c, games, score + res);
    };
    const simulate = () => close(simGame(c.str, opp));
    if (c.autoSim || !window.FL_ENGINE) return simulate();
    jCard({
      tag: "Chess",
      iconSrc: ICON.pawn,
      title: "Final Round",
      lead: `${t.name}: you have ${score}/${r} going into the last round.<br><br>Your opponent is ${name} (${opp}).`,
      rows: [
        ["Your rating", ratingTxt(c)],
        ["Opponent", `${name} (${opp})`],
      ],
      choices: [
        ["Play the game", () => playBoard({
          mode: "game",
          title: `${t.name} · Round ${t.rounds}`,
          myColor: rnd() < 0.5 ? "w" : "b",
          oppElo: opp,
          oppName: name,
          myLabel: `${titleTag(c) ? titleTag(c) + " " : ""}${state.first || "You"} (${ratingTxt(c)})`,
          clock: { base: 10 * 60000, inc: 5000 },
          canSimulate: true,
          onSimulate: (evalCp) => close(simGame(c.str + clampN(evalCp, -400, 400), opp)),
          onEnd: (res) => close(res),
        })],
        ["Simulate it", simulate],
      ],
    });
  }

  function finishTournament(t, c, games, score) {
    const perf = performance(games);
    const place = placeFor(t, score);
    const prize = price(prizeFor(t, place));
    const { before, after } = applyRating(c, games);
    if (after != null) {
      c.peak = Math.max(c.peak, after);
      if (after >= 2400) c.everK10 = true;
    }
    const norm = checkNorm(t, c, games);
    if (norm) c.norms[norm]++;
    const newTitles = checkTitles(c);
    if (prize) {
      state.money += prize;
      c.earned += prize;
      typeof chaChing === "function" && chaChing();
    }
    if (!c.best || place < c.best.place || (place === c.best.place && t.pool > c.best.pool))
      c.best = { name: t.name, place, pool: t.pool, age: state.age };
    if (place === 1) c.wins = (c.wins || 0) + 1;
    c.recent = (c.recent || []).concat([{ name: t.name, place, score, rounds: t.rounds, age: state.age }]).slice(-6);
    if (t.id === "candidates" && place === 1) c.candWin = state.age;
    typeof renderStats === "function" && renderStats();

    const delta = before == null ? (after == null ? "Still unrated" : `First rating: ${after}`) : `${before} → ${after} (${after - before >= 0 ? "+" : ""}${after - before})`;
    say(
      `I played the ${t.name} and scored ${score}/${t.rounds}, finishing ${ord(place)}.` +
        (prize ? ` I won ${money(prize)}.` : ""),
    );
    if (norm) say(`I earned an ${norm} norm!`);
    for (const nt of newTitles) say(`I earned the title of ${TITLE_NAME[nt]}!`);

    const rows = [
      ["Score", `${score}/${t.rounds}`],
      ["Place", ord(place)],
      ["Performance", perf],
      ["Rating", delta],
    ];
    if (prize) rows.push(["Prize", money(prize)]);
    if (norm) rows.push(["Norm", `${norm} norm (${c.norms[norm]}/3)`]);

    const after_ = () => {
      if (newTitles.length) return titlePopup(newTitles, 0);
      if (t.id === "candidates" && place === 1) return worldMatchOffer();
    };
    jCard({
      tag: "Chess",
      iconSrc: place === 1 ? ICON.trophy : ICON.pawn,
      title: place === 1 ? "Champion!" : t.name,
      lead:
        place === 1
          ? `You won the ${t.name}!`
          : score / t.rounds >= 0.5
            ? `A solid tournament at the ${t.name}.`
            : `A rough tournament at the ${t.name}.`,
      rows,
      choices: [["OK", after_]],
    });
  }

  function titlePopup(list, i) {
    if (i >= list.length) return;
    const t = list[i];
    typeof play === "function" && play("choice");
    jCard({
      tag: "Chess",
      iconSrc: ICON.medal,
      title: "New Title!",
      lead: `FIDE has awarded you the title of ${TITLE_NAME[t]} (${t}).<br><br>Titles are for life.`,
      choices: [["Awesome", () => titlePopup(list, i + 1)]],
    });
  }

  // ---------------------------------------------------------------- campeonato del mundo
  function worldMatchOffer() {
    jCard({
      tag: "Chess",
      iconSrc: ICON.trophy,
      title: "World Championship Match",
      lead: "You won the Candidates! You've earned the right to challenge the World Champion in a 14-game match.",
      choices: [
        ["Play the match", worldMatch],
        ["Decline", () => say("I declined my World Championship match. People think I'm crazy.")],
      ],
    });
  }

  function worldMatch() {
    const c = C();
    const champ = 2800 + ri(-25, 25);
    const champName = pick(["M. Carlsen-Reyes", "A. Volkov", "D. Nakashima", "I. Karimov", "H. Tanaka"]);
    const st = { me: 0, them: 0, wins: 0, g: 0, tb: false, auto: !!c.autoSim || !window.FL_ENGINE, first: rnd() < 0.5 ? "w" : "b" };
    const MAX = 14;

    const finish = () => {
      let tb = "";
      const won = st.me > st.them;
      if (st.tb) tb = " after tiebreaks";
      const prize = price(200000 * st.wins + (won ? 600000 : 500000));
      state.money += prize;
      c.earned += prize;
      if (won) {
        c.champion = true;
        c.wins = (c.wins || 0) + 1;
      }
      c.recent = (c.recent || [])
        .concat([{ name: "World Championship", place: won ? 1 : 2, score: st.me, rounds: st.g, age: state.age }])
        .slice(-6);
      typeof chaChing === "function" && chaChing();
      typeof renderStats === "function" && renderStats();
      say(won ? `I became the World Chess Champion${tb}! I earned ${money(prize)}.` : `I lost the World Championship match${tb}. I still earned ${money(prize)}.`);
      jCard({
        tag: "Chess",
        iconSrc: ICON.trophy,
        title: won ? "World Champion!" : "So close",
        lead: won ? "You are the new World Chess Champion!" : "The champion kept the crown.",
        rows: [
          ["Final score", `${st.me} – ${st.them}${tb}`],
          ["Prize", money(prize)],
        ],
        choices: [["OK", () => {}]],
      });
    };

    const record = (r) => {
      st.me += r;
      st.them += 1 - r;
      if (r === 1) st.wins++;
      st.g++;
      next();
    };

    const next = () => {
      if (st.g < MAX) return st.me >= 7.5 || st.them >= 7.5 ? finish() : playOne();
      st.tb = true; // 7-7 tras 14: desempate rapido, de a 2 partidas
      const t = st.g - MAX;
      if (t > 0 && t % 2 === 0 && st.me !== st.them) return finish();
      if (t >= 6) {
        if (st.me === st.them) st.them += 0.5; // el campeon conserva la corona
        return finish();
      }
      playOne();
    };

    const playOne = () => {
      const n = st.g + 1;
      const rapid = st.g >= MAX;
      const color = (st.g % 2 === 0) === (st.first === "w") ? "w" : "b";
      const simOne = () => record(simGame(c.str + (rapid ? 30 : 0), champ));
      if (st.auto) return simOne();
      const label = rapid ? `Tiebreak game ${n - MAX}` : `Game ${n}`;
      jCard({
        tag: "Chess",
        iconSrc: ICON.trophy,
        title: label,
        lead: `World Championship match vs ${champName} (${champ}).<br><br>You have the ${color === "w" ? "white" : "black"} pieces.`,
        rows: [
          ["Match score", `${st.me} – ${st.them}`],
          ["Games played", `${st.g}${rapid ? "" : "/" + MAX}`],
          ["Your rating", ratingTxt(c)],
        ],
        choices: [
          ["Play the game", () => playBoard({
            mode: "game",
            title: `World Championship · ${label}`,
            sub: `Match score: ${st.me} – ${st.them}`,
            myColor: color,
            oppElo: champ,
            oppName: champName,
            myLabel: `${titleTag(c) ? titleTag(c) + " " : ""}${state.first || "You"} (${ratingTxt(c)})`,
            clock: rapid ? { base: 15 * 60000, inc: 10000 } : { base: 30 * 60000, inc: 30000 },
            canSimulate: true,
            onSimulate: (evalCp) => record(simGame(c.str + clampN(evalCp, -400, 400), champ)),
            onEnd: (res) => record(res),
          })],
          ["Simulate this game", simOne],
          ["Simulate the rest", () => ((st.auto = true), simOne())],
        ],
      });
    };

    playOne();
  }

  // ---------------------------------------------------------------- entrenamiento / coach / clases
  const COACH = [
    { name: "No coach", fee: 0, mult: 1 },
    { name: "Club coach", fee: 1500, mult: 1.25 },
    { name: "IM coach", fee: 6000, mult: 1.5 },
    { name: "GM coach", fee: 15000, mult: 1.8 },
  ];

  function train() {
    const c = C();
    if (c.yr.train >= 3) return notice("Burned out", "You've already studied a lot this year.", null, !0);
    c.yr.train++;
    const s = state.stats;
    if (s) s.Smarts = Math.min(100, s.Smarts + ri(0, 2));
    typeof renderStats === "function" && renderStats();
    const what = pick([
      "studied endgames",
      "solved tactics puzzles",
      "went over grandmaster games",
      "worked on my openings",
      "analyzed my losses",
      "practiced calculation",
    ]);
    say(`I ${what}.`);
    notice("Study session", `You ${what.replace("my", "your")}. Your chess is improving.`, openChess, !0);
  }

  function coachMenu() {
    const c = C();
    socSelCard({
      tag: "Chess",
      icon: ICON.teacher,
      title: "Hire a Coach",
      lead: `A good coach makes you improve much faster. Paid every year.<br><br>Current: ${COACH[c.coach].name}`,
      label: "Coach:",
      opts: COACH.map((k, i) => `${k.name}${k.fee ? ` (${money(price(k.fee))}/yr)` : ""}${i === c.coach ? " (current)" : ""}`),
      btn: "Confirm",
      onGo: (i) => {
        const fee = price(COACH[i].fee);
        if (fee && state.money < fee)
          return notice(
            "Not enough money",
            `You need ${money(fee)} a year to hire a chess coach. You have ${money(state.money)}.`,
            null,
            !0,
          );
        c.coach = i;
        say(i ? `I hired a new chess coach (${COACH[i].name}).` : "I stopped working with my chess coach.");
      },
    });
  }

  function lessonRate(c) {
    const t = c.title || "";
    if (c.champion || (c.fide || 0) >= 2700) return 220;
    if (t === "GM") return 150;
    if (t === "IM") return 90;
    if (t === "FM" || c.wtitle === "WGM" || c.wtitle === "WIM") return 60;
    if (t === "CM" || c.wtitle) return 45;
    return 25;
  }

  function giveLessons() {
    const c = C();
    if ((c.fide || 0) < 1800 && !c.title && !c.wtitle)
      return notice("Not yet", "You need at least an 1800 rating to give chess lessons.", null, !0);
    if (c.yr.lessons) return notice("Booked", "You already have your students for this year.", null, !0);
    if (state.age < 14) return notice("Too young", "Parents won't hire a kid as a chess coach.", null, !0);
    c.yr.lessons = 1;
    const hours = ri(60, 220);
    const pay = price(lessonRate(c) * hours);
    state.money += pay;
    c.earned += pay;
    typeof chaChing === "function" && chaChing();
    typeof renderStats === "function" && renderStats();
    say(`I gave ${hours} hours of chess lessons and earned ${money(pay)}.`);
    notice("Chess lessons", `You taught ${hours} hours of lessons this year and earned ${money(pay)}.`, null, !0);
  }

  // ---------------------------------------------------------------- Pawnder (online)
  const MODES = { bullet: -120, blitz: -40, rapid: 60 }; // fuerza online relativa a la fuerza real

  function pawnderJoin() {
    const c = C();
    if (state.age < 8) return notice(SITE, "You're too young to make an account.", null, !0);
    c.online = { bullet: 800, blitz: 800, rapid: 800, n: 0 };
    say(`I made an account on ${SITE}.`);
    notice(SITE, `Welcome to ${SITE}! Your ratings start at 800 and move fast at first.`, null, !0);
    openChess();
  }

  function pawnderPlay(mode) {
    const c = C();
    if (c.yr.online >= 3) return notice(SITE, "You've played enough online this year.", null, !0);
    c.yr.online++;
    const o = c.online;
    const before = o[mode];
    const myStr = c.str + MODES[mode];
    let w = 0, d = 0, l = 0;
    const n = mode === "bullet" ? 40 : mode === "blitz" ? 25 : 12;
    for (let i = 0; i < n; i++) {
      const opp = o[mode] + ri(-80, 80);
      const r = simGame(myStr, opp);
      r === 1 ? w++ : r ? d++ : l++;
      const k = o.n < 20 ? 48 : 16; // provisional: se mueve fuerte
      o[mode] = Math.max(100, Math.round(o[mode] + k * (r - expected(o[mode], opp))));
      o.n++;
    }
    const delta = o[mode] - before;
    say(`I played ${n} ${mode} games on ${SITE} (${w}W ${d}D ${l}L).`);
    jCard({
      tag: SITE,
      iconSrc: ICON.pc,
      title: `${mode[0].toUpperCase() + mode.slice(1)} session`,
      lead: `You played ${n} ${mode} games.`,
      rows: [
        ["Result", `${w}W ${d}D ${l}L`],
        ["Rating", `${before} → ${o[mode]} (${delta >= 0 ? "+" : ""}${delta})`],
      ],
      choices: [["OK", openChess]],
    });
  }

  function titledTuesday() {
    const c = C();
    if (!c.title && !c.wtitle) return notice(SITE, "Only titled players can play Titled Tuesdays.", null, !0);
    if (c.yr.online >= 3) return notice(SITE, "You've played enough online this year.", null, !0);
    c.yr.online++;
    let score = 0;
    for (let r = 0; r < 11; r++) {
      const opp = clampN(2450 + (score - r / 2) * 70 + gauss() * 90, 2250, 3150);
      score += simGame(c.str - 40, opp);
    }
    const pay = [0, 2500, 1500, 1000, 700, 400, 400, 250, 250, 250, 250];
    const place = score >= 10 ? 1 : score >= 9.5 ? ri(1, 3) : score >= 9 ? ri(2, 6) : score >= 8 ? ri(5, 20) : ri(20, 300);
    const prize = place <= 10 ? price(pay[place]) : 0;
    if (prize) {
      state.money += prize;
      c.earned += prize;
      typeof chaChing === "function" && chaChing();
    }
    c.followers += Math.round((score >= 9 ? 3000 : 400) * (1 + rnd()));
    typeof renderStats === "function" && renderStats();
    say(`I played ${SITE} Titled Tuesday and scored ${score}/11${prize ? `, winning ${money(prize)}` : ""}.`);
    jCard({
      tag: SITE,
      iconSrc: ICON.clock,
      title: "Titled Tuesday",
      lead: "11 rounds of 5-minute blitz against the best titled players online.",
      rows: [["Score", `${score}/11`], ["Place", `#${place}`], ...(prize ? [["Prize", money(prize)]] : [])],
      choices: [["OK", openChess]],
    });
  }

  function stream() {
    const c = C();
    const best = c.online ? Math.max(c.online.bullet, c.online.blitz, c.online.rapid) : 0;
    if (!c.title && best < 1800) return notice(SITE, "Nobody watches a stream from an unknown player. Get to 1800 online or earn a title first.", null, !0);
    if (c.yr.stream) return notice(SITE, "You've already done your streaming for this year.", null, !0);
    c.yr.stream = 1;
    const appeal = (c.title === "GM" ? 3 : c.title ? 1.8 : 1) * (1 + (state.stats.Looks || 50) / 200);
    const gain = Math.round(ri(300, 2500) * appeal * (c.followers < 1000 ? 1 : 1 + Math.log10(c.followers) / 4));
    c.followers += gain;
    say(`I streamed chess on ${SITE} and gained ${gain.toLocaleString("en-US")} followers.`);
    notice(SITE + " stream", `You gained ${gain.toLocaleString("en-US")} followers. You have ${c.followers.toLocaleString("en-US")} now.`, null, !0);
  }

  // ---------------------------------------------------------------- tablero (fase 3)
  const CSS = `
  .flc{position:absolute;inset:0;z-index:9000;background:#13213a;display:flex;flex-direction:column;align-items:center;
    color:#eaf2ff;padding:10px 8px 14px;box-sizing:border-box;overflow-y:auto;font-family:inherit}
  .flc *{box-sizing:border-box}
  .flc-title{font-weight:900;font-size:16px;letter-spacing:.5px;text-align:center;margin:2px 0 4px}
  .flc-sub{font-size:13px;opacity:.85;text-align:center;margin-bottom:4px}
  .flc-player{width:100%;max-width:420px;display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.07);
    border-radius:10px;padding:6px 10px;margin:6px 0}
  .flc-player .nm{flex:1;font-weight:800;font-size:14px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
  .flc-player img{width:22px;height:22px}
  .flc-clock{font-variant-numeric:tabular-nums;font-weight:900;background:#0b1424;padding:4px 10px;border-radius:8px;min-width:66px;text-align:center}
  .flc-clock.on{background:#eaf2ff;color:#0b1424}.flc-clock.low{background:#d0342c;color:#fff}
  .flc-board{display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);width:min(100%,420px);aspect-ratio:1/1;flex:none;border-radius:6px;overflow:hidden;
    box-shadow:0 6px 18px rgba(0,0,0,.45);touch-action:manipulation;user-select:none}
  .flc-sq{position:relative;display:flex;align-items:center;justify-content:center;cursor:pointer}
  .flc-l{background:#eed9b6}.flc-d{background:#b58863}
  .flc-last{background-image:linear-gradient(rgba(255,226,70,.42),rgba(255,226,70,.42))}
  .flc-sel{box-shadow:inset 0 0 0 4px rgba(255,214,0,.9)}
  .flc-hint{box-shadow:inset 0 0 0 4px rgba(60,200,90,.95)}
  .flc-bad{box-shadow:inset 0 0 0 4px rgba(230,50,50,.95)}
  .flc-chk{background-image:radial-gradient(circle,rgba(255,40,40,.9) 0,rgba(255,40,40,.35) 55%,transparent 72%)}
  .flc-dot::after{content:"";position:absolute;width:28%;height:28%;border-radius:50%;background:rgba(20,30,20,.33)}
  .flc-cap::after{content:"";position:absolute;inset:5%;border-radius:50%;border:4px solid rgba(20,30,20,.33)}
  .flc-sq svg{width:96%;height:96%;pointer-events:none;position:relative;z-index:1}
  .flc-co{position:absolute;font-size:9px;font-weight:900;opacity:.75;pointer-events:none}
  .flc-co.f{right:2px;bottom:0}.flc-co.r{left:2px;top:0}
  .flc-l .flc-co{color:#b58863}.flc-d .flc-co{color:#eed9b6}
  .flc-status{min-height:22px;margin:6px 0 8px;font-weight:800;text-align:center;font-size:14px}
  .flc-btns{display:flex;gap:8px;width:100%;max-width:420px}
  .flc-btns button{flex:1;border:0;border-radius:10px;padding:11px 6px;font:inherit;font-weight:900;color:#fff;background:#1a6fd1;cursor:pointer}
  .flc-btns .red{background:#d0342c}.flc-btns .gray{background:#4b5a72}.flc-btns .green{background:#2e9e4f}
  .flc-modal{position:absolute;inset:0;background:rgba(5,10,20,.72);display:flex;align-items:center;justify-content:center;z-index:5}
  .flc-card{background:#1d2f4f;border:2px solid #3fa7ff;border-radius:14px;padding:18px 16px;width:86%;max-width:340px;text-align:center}
  .flc-card h3{margin:0 0 8px;font-size:22px}.flc-card p{margin:0 0 14px;opacity:.9}
  .flc-promo{display:flex;gap:6px;justify-content:center}.flc-promo div{width:62px;height:62px;background:#eed9b6;border-radius:8px;cursor:pointer}
  .flc-promo svg{width:100%;height:100%}`;

  const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <linearGradient id="flc-gB" x1="18" x2="82" y1="0" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#050505"/><stop offset=".28" stop-color="#4b4b4f"/><stop offset=".45" stop-color="#26262a"/>
      <stop offset=".8" stop-color="#0d0d0f"/><stop offset="1" stop-color="#000"/></linearGradient>
    <linearGradient id="flc-gW" x1="18" x2="82" y1="0" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#b9ae98"/><stop offset=".28" stop-color="#fffdf6"/><stop offset=".5" stop-color="#efe6d3"/>
      <stop offset=".85" stop-color="#cbbfa6"/><stop offset="1" stop-color="#a69a82"/></linearGradient>
    <radialGradient id="flc-gloss" cx=".35" cy=".25" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <g id="flc-base"><rect x="22" y="84" width="56" height="10" rx="4"/><ellipse cx="50" cy="84" rx="28" ry="3.6"/><rect x="27" y="77" width="46" height="8" rx="3.5"/></g>
    <g id="flc-p"><use href="#flc-base"/><path d="M36 78 C38 66 44 62 44.5 57 L55.5 57 C56 62 62 66 64 78 Z"/><ellipse cx="50" cy="56" rx="13" ry="3.6"/><circle cx="50" cy="41" r="12.5"/></g>
    <g id="flc-r"><use href="#flc-base"/><path d="M34 78 L37.5 48 L62.5 48 L66 78 Z"/><rect x="33" y="44" width="34" height="6" rx="2.5"/>
      <path d="M31 45 L31 25 L39.5 25 L39.5 31.5 L45.5 31.5 L45.5 25 L54.5 25 L54.5 31.5 L60.5 31.5 L60.5 25 L69 25 L69 45 Z"/></g>
    <g id="flc-b"><use href="#flc-base"/><path d="M35 78 C39 67 44 61 44.5 53 L55.5 53 C56 61 61 67 65 78 Z"/><ellipse cx="50" cy="52" rx="12.5" ry="3.4"/>
      <path d="M50 19 C37 29 37.5 44 42 50 L58 50 C62.5 44 63 29 50 19 Z"/><circle cx="50" cy="15.5" r="4.2"/></g>
    <g id="flc-n"><use href="#flc-base"/><path d="M33 78 C33 67 39 61 44 55 C39 53 32 51 29.5 47 C27.5 43.5 29.5 39 34 37.5 L44 34.5 C45.5 29 44 23 47.5 15.5 L52.5 22 C61 22.5 69 31 69 45 C69 59 64.5 67 67 78 Z"/></g>
    <g id="flc-q"><use href="#flc-base"/><path d="M34 78 C39 65 43 57 43 47 L57 47 C57 57 61 65 66 78 Z"/><ellipse cx="50" cy="46.5" rx="14.5" ry="3.8"/>
      <path d="M36 43 L31 23 L40 33 L41.5 18 L46.5 31 L50 14 L53.5 31 L58.5 18 L60 33 L69 23 L64 43 Z"/>
      <circle cx="31" cy="21.5" r="3.4"/><circle cx="41.5" cy="16.5" r="3.4"/><circle cx="50" cy="12.5" r="3.6"/><circle cx="58.5" cy="16.5" r="3.4"/><circle cx="69" cy="21.5" r="3.4"/></g>
    <g id="flc-k"><use href="#flc-base"/><path d="M34 78 C39 65 43 57 43 47 L57 47 C57 57 61 65 66 78 Z"/><ellipse cx="50" cy="46.5" rx="14.5" ry="3.8"/>
      <path d="M37 43 C32 31 39 25 50 27 C61 25 68 31 63 43 Z"/><rect x="47" y="7" width="6" height="21" rx="1.5"/><rect x="41.5" y="11.5" width="17" height="6" rx="1.5"/></g>
  </defs></svg>`;

  const DETAIL = {
    b: (c) => `<path d="M54 29 L46 40" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`,
    n: (c) => `<circle cx="48.5" cy="31" r="2.2" fill="${c}"/><path d="M33.5 43 L37 43" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
      <path d="M56 25 C62 31 64 40 63 50 M60 27 C66 34 67 45 65.5 56" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>`,
  };
  function pieceSvg(kind, white) {
    return `<svg viewBox="6 4 88 92"><g fill="url(#flc-g${white ? "W" : "B"})" stroke="${white ? "#7d725e" : "#000"}" stroke-width="1.4" stroke-linejoin="round"><use href="#flc-${kind}"/></g>
      <g fill="url(#flc-gloss)" opacity="${white ? 0.6 : 0.9}"><use href="#flc-${kind}"/></g>${DETAIL[kind] ? DETAIL[kind](white ? "#8a7f69" : "#5a5a60") : ""}</svg>`;
  }

  // El bot piensa en un Web Worker si se puede (la UI y el reloj siguen andando); si no, en el hilo principal.
  let worker = null, wid = 0;
  const wwait = new Map();
  function botAsk(g, elo) {
    const E = window.FL_ENGINE;
    if (worker) {
      return new Promise((res) => {
        const id = ++wid;
        const timer = setTimeout(() => (wwait.delete(id), res(E.botMove(g, elo))), 15000);
        wwait.set(id, (data) => {
          clearTimeout(timer);
          res((data.uci && g.find(data.uci)) || E.botMove(g, elo));
        });
        worker.postMessage({ id, fen: g.fen(), elo });
      });
    }
    return new Promise((res) => setTimeout(() => res(E.botMove(g, elo)), 30));
  }

  const fmtClock = (ms) => {
    ms = Math.max(0, ms);
    const s = Math.ceil(ms / 1000);
    return s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : `0:${String(s).padStart(2, "0")}${ms < 10000 ? "." + Math.floor((ms % 1000) / 100) : ""}`;
  };

  /* opts: { mode: "game"|"puzzle", title, sub, fen, myColor "w"|"b", oppElo, oppName, myLabel,
             clock: {base, inc}|null, canSimulate, onSimulate(evalCp), onEnd(result), puzzle: {k, s} } */
  function playBoard(opts) {
    const E = window.FL_ENGINE;
    const phone = document.querySelector(".phone") || document.body;
    if (!document.getElementById("flc-style")) {
      const st = document.createElement("style");
      st.id = "flc-style";
      st.textContent = CSS;
      document.head.append(st);
    }
    const g = new E.Game(opts.fen || E.START);
    const me = opts.myColor === "b" ? E.BLACK : 0;
    const flip = me === E.BLACK;
    const wrap = document.createElement("div");
    wrap.className = "flc";
    const puzzle = opts.mode === "puzzle";
    wrap.innerHTML =
      DEFS +
      `<div class="flc-title">${opts.title || "Chess"}</div>${opts.sub ? `<div class="flc-sub">${opts.sub}</div>` : ""}` +
      (puzzle ? "" : `<div class="flc-player"><img src="${ICON.pawn}"><div class="nm">${opts.oppName} (${opts.oppElo})</div><div class="flc-clock" id="flcOppClk"></div></div>`) +
      `<div class="flc-board" id="flcBoard"></div>` +
      (puzzle ? "" : `<div class="flc-player"><img src="${ICON.brain}"><div class="nm">${opts.myLabel || "You"}</div><div class="flc-clock" id="flcMyClk"></div></div>`) +
      `<div class="flc-status" id="flcStatus"></div><div class="flc-btns" id="flcBtns"></div>`;
    phone.append(wrap);
    if (getComputedStyle(phone).position === "static") phone.style.position = "relative";

    const boardEl = wrap.querySelector("#flcBoard");
    const statusEl = wrap.querySelector("#flcStatus");
    const btns = wrap.querySelector("#flcBtns");
    let sel = -1, targets = [], last = null, over = false, thinking = false, mark = null, badSq = -1;
    const clk = opts.clock ? { me: opts.clock.base, opp: opts.clock.base, inc: opts.clock.inc } : null;
    let tickAt = Date.now(), timer = null, lastDraw = -99;
    let pIdx = 0, hinted = false;

    const status = (t) => (statusEl.innerHTML = t);
    const sqAt = (i) => {
      const r = Math.floor(i / 8), f = i % 8;
      return (flip ? 7 - r : r) * 16 + (flip ? 7 - f : f);
    };

    function render() {
      let html = "";
      const kSq = g.inCheck() ? g.kings[g.turn ? 1 : 0] : -1;
      for (let i = 0; i < 64; i++) {
        const s = sqAt(i), p = g.b[s];
        const dark = ((s >> 4) + (s & 7)) & 1;
        const cls = ["flc-sq", dark ? "flc-d" : "flc-l"];
        if (last && (s === last.from || s === last.to)) cls.push("flc-last");
        if (s === sel) cls.push("flc-sel");
        if (s === kSq) cls.push("flc-chk");
        if (mark && mark.sqs.includes(s)) cls.push(mark.cls);
        if (s === badSq) cls.push("flc-bad");
        const t = targets.find((m) => m.to === s);
        if (t) cls.push(p ? "flc-cap" : "flc-dot");
        const r = Math.floor(i / 8), f = i % 8;
        const co =
          (f === 0 ? `<span class="flc-co r">${8 - (s >> 4)}</span>` : "") + (r === 7 ? `<span class="flc-co f">${"abcdefgh"[s & 7]}</span>` : "");
        html += `<div class="${cls.join(" ")}" data-s="${s}">${co}${p ? pieceSvg(" pnbrqk"[E.type(p)], !E.col(p)) : ""}</div>`;
      }
      boardEl.innerHTML = html;
      if (clk) {
        const mc = wrap.querySelector("#flcMyClk"), oc = wrap.querySelector("#flcOppClk");
        mc.textContent = fmtClock(clk.me);
        oc.textContent = fmtClock(clk.opp);
        mc.className = "flc-clock" + (!over && g.turn === me ? " on" : "") + (clk.me < 20000 ? " low" : "");
        oc.className = "flc-clock" + (!over && g.turn !== me ? " on" : "") + (clk.opp < 20000 ? " low" : "");
      } else if (!puzzle) {
        wrap.querySelector("#flcMyClk").textContent = "";
        wrap.querySelector("#flcOppClk").textContent = "";
      }
    }

    function buttons(list) {
      btns.innerHTML = list.map(([label, cls], i) => `<button class="${cls || ""}" data-b="${i}">${label}</button>`).join("");
      btns.querySelectorAll("button").forEach((b) => (b.onclick = () => list[+b.dataset.b][2]()));
    }

    function close() {
      over = true;
      clearInterval(timer);
      wrap.remove();
    }

    function modal(html, list) {
      const m = document.createElement("div");
      m.className = "flc-modal";
      m.innerHTML = `<div class="flc-card">${html}<div class="flc-btns" style="margin-top:6px"></div></div>`;
      wrap.append(m);
      const b = m.querySelector(".flc-btns");
      b.innerHTML = list.map(([label, cls], i) => `<button class="${cls || ""}" data-b="${i}">${label}</button>`).join("");
      b.querySelectorAll("button").forEach((x) => (x.onclick = () => (m.remove(), list[+x.dataset.b][2]())));
      return m;
    }

    // ---- fin de partida (modo game)
    function endGame(result, reason) {
      if (over) return;
      over = true;
      clearInterval(timer);
      render();
      typeof play === "function" && play("choice");
      const t = result === 1 ? "You won!" : result === 0.5 ? "It's a draw" : "You lost";
      modal(`<h3>${t}</h3><p>${reason}</p>`, [["Continue", "", () => (close(), opts.onEnd && opts.onEnd(result))]]);
    }

    function checkOver() {
      const st = g.status();
      if (!st.over) return false;
      const res = st.result === "1/2-1/2" ? 0.5 : (st.result === "1-0") === (me === 0) ? 1 : 0;
      endGame(res, st.reason === "checkmate" ? (res ? "Checkmate!" : "You got checkmated.") : `Draw by ${st.reason}.`);
      return true;
    }

    // ---- reloj
    if (clk) {
      timer = setInterval(() => {
        if (over) return;
        const now = Date.now(), dt = now - tickAt;
        tickAt = now;
        if (g.turn === me && !thinking) {
          clk.me -= dt;
          if (clk.me <= 0) {
            clk.me = 0;
            return endGame(0, "You ran out of time.");
          }
        }
        const mc = wrap.querySelector("#flcMyClk");
        mc && (mc.textContent = fmtClock(clk.me), mc.classList.toggle("low", clk.me < 20000));
      }, 100);
    }

    // ---- turno del bot
    async function botTurn() {
      if (over || g.turn === me) return;
      thinking = true;
      status("Opponent is thinking…");
      const started = Date.now();
      const m = await botAsk(g, opts.oppElo);
      const wait = 450 - (Date.now() - started);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      if (over) return;
      if (clk) {
        // el bot "usa" tiempo simulado proporcional a su reloj
        const used = Math.min(clk.opp - 200, clk.opp / 35 + rnd() * 2500);
        clk.opp = Math.max(100, clk.opp - Math.max(300, used)) + clk.inc;
      }
      if (m) {
        last = g.play(m);
        typeof play === "function" && play("choice");
      }
      thinking = false;
      tickAt = Date.now();
      render();
      if (!checkOver()) status(g.inCheck() ? "Check! Your move." : "Your move.");
    }

    // ---- puzzles
    function puzzleNext() {
      // tras una jugada correcta del jugador: responde el rival o se resuelve
      pIdx++;
      const sol = opts.puzzle.s;
      if (pIdx >= sol.length || g.status().over) return puzzleDone(true);
      thinking = true;
      setTimeout(() => {
        last = g.play(sol[pIdx]);
        pIdx++;
        thinking = false;
        render();
        status("Correct! Keep going.");
        if (pIdx >= sol.length) puzzleDone(true);
      }, 500);
    }

    function puzzleDone(ok, why) {
      over = true;
      render();
      const sol = opts.puzzle.s;
      if (!ok) {
        // mostrar la jugada correcta
        const g2 = new E.Game(opts.fen);
        for (let i = 0; i < pIdx; i++) g2.play(sol[i]);
        const m = g2.find(sol[pIdx]);
        if (m) mark = { sqs: [m.from, m.to], cls: "flc-hint" };
        render();
        status(`${why || "Not quite."} The answer was ${m ? g2.san(m) : sol[pIdx]}.`);
      } else status(hinted ? "Solved (with a hint)." : "Solved!");
      typeof play === "function" && play("choice");
      buttons([
        ["Next puzzle", "green", () => (close(), opts.onEnd && opts.onEnd(ok, { next: true, hinted }))],
        ["Done", "gray", () => (close(), opts.onEnd && opts.onEnd(ok, { next: false, hinted }))],
      ]);
    }

    // ---- jugada del jugador
    function tryMove(m) {
      const doIt = (mv) => {
        sel = -1;
        targets = [];
        if (puzzle) {
          const want = opts.puzzle.s[pIdx];
          const uci = g.uci(mv);
          last = g.play(mv);
          render();
          const mateOk = opts.puzzle.k !== "tactic" && g.status().over && g.inCheck();
          if (uci === want || mateOk) return puzzleNext();
          badSq = mv.from; // la pieza que moviste mal queda en rojo; la respuesta, en verde
          g.unmake();
          last = null;
          return puzzleDone(false, "Wrong move.");
        }
        if (clk) clk.me += clk.inc;
        last = g.play(mv);
        typeof play === "function" && play("choice");
        render();
        if (!checkOver()) botTurn();
      };
      const promos = targets.filter((t) => t.to === m.to && t.from === m.from && t.promo);
      if (promos.length > 1) {
        const white = me === 0;
        const md = modal(
          `<h3>Promote to</h3><div class="flc-promo">${["q", "r", "b", "n"].map((k) => `<div data-k="${k}">${pieceSvg(k, white)}</div>`).join("")}</div>`,
          [],
        );
        md.querySelectorAll("[data-k]").forEach(
          (d) =>
            (d.onclick = () => {
              md.remove();
              doIt(promos.find((p) => " pnbrqk"[E.type(p.promo)] === d.dataset.k));
            }),
        );
        return;
      }
      doIt(m);
    }

    boardEl.addEventListener("click", (ev) => {
      const el = ev.target.closest(".flc-sq");
      if (!el || over || thinking || g.turn !== me) return;
      const s = +el.dataset.s;
      const t = targets.find((m) => m.to === s);
      if (sel >= 0 && t) return tryMove(t);
      const p = g.b[s];
      if (p && E.col(p) === me && s !== sel) {
        sel = s;
        targets = g.moves().filter((m) => m.from === s);
      } else {
        sel = -1;
        targets = [];
      }
      mark = null;
      render();
    });

    // ---- botones
    if (puzzle) {
      const side = g.turn ? "Black" : "White";
      const goal = opts.puzzle.k === "mate1" ? "Checkmate in 1." : opts.puzzle.k === "mate2" ? "Checkmate in 2." : "Find the best move.";
      status(`${side} to move. ${goal}`);
      buttons([
        ["Hint", "", () => {
          if (over) return;
          hinted = true;
          const m = g.find(opts.puzzle.s[pIdx]);
          if (m) (mark = { sqs: [m.from], cls: "flc-hint" }), render();
        }],
        ["Give up", "red", () => !over && puzzleDone(false, "")],
      ]);
    } else {
      const list = [
        ["Resign game", "red", () => !over && modal("<h3>Resign?</h3><p>This counts as a loss.</p>", [
          ["Resign game", "red", () => endGame(0, "You resigned.")],
          ["Keep playing", "gray", () => {}],
        ])],
        ["Offer draw", "gray", () => {
          if (over || g.turn !== me || thinking) return;
          if (g.full - lastDraw < 8) return status("You just offered a draw. Wait a few moves.");
          lastDraw = g.full;
          const a = E.analyze(g, 2, 30000);
          const botView = a ? -a.scores[0].s : 0; // la evaluación es del bando que mueve (tú)
          if ((g.full >= 20 && Math.abs(botView) <= 40) || botView <= -150) endGame(0.5, "Your opponent accepted the draw.");
          else status("Your opponent declined the draw.");
        }],
      ];
      if (opts.canSimulate)
        list.push(["Simulate", "", () => {
          if (over) return;
          const a = E.analyze(g, 1, 20000);
          const mine = a ? (g.turn === me ? a.scores[0].s : -a.scores[0].s) : 0;
          close();
          opts.onSimulate && opts.onSimulate(mine);
        }]);
      buttons(list);
      status(me === 0 ? "You have the white pieces. Your move." : "You have the black pieces.");
    }
    render();
    if (!puzzle && g.turn !== me) botTurn();
    return { close, game: g };
  }

  // ---------------------------------------------------------------- puzzles (fase 2)
  function puzzlePick(c) {
    const all = window.FL_PUZZLES || [];
    if (!all.length) return null;
    const seen = new Set(c.pseen || []);
    let best = null, bd = 1e9;
    for (let i = 0; i < all.length; i++) {
      if (seen.has(i)) continue;
      const d = Math.abs(all[i].r - c.puzzle) + rnd() * 120;
      if (d < bd) (bd = d), (best = i);
    }
    if (best == null) {
      c.pseen = [];
      return puzzlePick(c);
    }
    return best;
  }

  function startPuzzle() {
    const c = C();
    if (!window.FL_ENGINE || !window.FL_PUZZLES) return notice("Loading", "The chess board is still loading. Try again in a second.", null, !0);
    if (c.puzzle == null) c.puzzle = 800;
    const i = puzzlePick(c);
    if (i == null) return notice("Puzzles", "No puzzles available.", null, !0);
    const pz = window.FL_PUZZLES[i];
    playBoard({
      mode: "puzzle",
      title: `Puzzle · rated ${pz.r}`,
      sub: `Your puzzle rating: ${c.puzzle}`,
      fen: pz.f,
      myColor: pz.f.split(" ")[1],
      puzzle: { k: pz.k, s: pz.s },
      onEnd: (ok, info) => {
        (c.pseen ||= []).push(i);
        if (c.pseen.length > 150) c.pseen.shift();
        const k = info.hinted && ok ? 16 : 32;
        const before = c.puzzle;
        c.puzzle = Math.max(100, Math.round(c.puzzle + k * ((ok ? 1 : 0) - expected(c.puzzle, pz.r))));
        c.psolved = (c.psolved || 0) + (ok ? 1 : 0);
        c.yr.puzzles = (c.yr.puzzles || 0) + 1;
        if (c.yr.puzzles === 1) say("I spent some time solving chess puzzles.");
        if (info.next) startPuzzle();
        else {
          notice("Puzzles", `Puzzle rating: ${before} → ${c.puzzle}`, null, !0);
          openChess();
        }
      },
    });
  }

  // ---------------------------------------------------------------- Pawnder: partida en vivo
  function pawnderLive() {
    const c = C();
    if (!window.FL_ENGINE) return notice("Loading", "The chess board is still loading. Try again in a second.", null, !0);
    const o = c.online;
    const oppElo = Math.max(250, o.rapid + ri(-60, 60));
    const user = pick(["knightrider", "pawnstar", "e4enjoyer", "blunderbuss", "gambitgoblin", "rookie_mistake", "zugzwanged", "castlequeen", "forkinghell", "mateinone"]) + ri(1, 999);
    playBoard({
      mode: "game",
      title: `${SITE} · Rapid 5+3`,
      myColor: rnd() < 0.5 ? "w" : "b",
      oppElo,
      oppName: user,
      myLabel: `${state.first || "You"} (${o.rapid})`,
      clock: { base: 5 * 60000, inc: 3000 },
      onEnd: (res) => {
        const before = o.rapid;
        const k = o.n < 20 ? 48 : 16;
        o.rapid = Math.max(100, Math.round(o.rapid + k * (res - expected(o.rapid, oppElo))));
        o.n++;
        c.yr.live = (c.yr.live || 0) + 1;
        if (c.yr.live === 1) say(`I played live rapid games on ${SITE}.`);
        notice(SITE, `Rapid rating: ${before} → ${o.rapid}`, null, !0);
        openChess();
      },
    });
  }

  // ---------------------------------------------------------------- menú
  function row(id, icon, title, sub, cls = "", tail = typeof DOTS !== "undefined" ? DOTS : "") {
    return `<div class="row ${cls}" id="${id}"><img src="${icon}"><div class="t"><b>${title}</b><span>${sub}</span></div>${/\bdis\b/.test(cls) ? "" : tail}</div>`;
  }

  function chessProfile() {
    const c = C();
    const rows = [
      ["Rating", ratingTxt(c) + (c.peak && c.peak !== c.fide ? ` · peak ${c.peak}` : "")],
      ["Title", [c.title, c.wtitle].filter(Boolean).join(" ") || "None"],
      ["Rated games", String(c.rgames)],
      ["Tournaments", String(c.events)],
      ["Titles won", String(c.wins || 0)],
      ["Best result", c.best ? `${c.best.name} · ${ord(c.best.place)} (age ${c.best.age})` : "None"],
      ["Prize money", money(c.earned)],
    ];
    if (c.norms.IM || c.norms.GM) rows.push(["Norms", `IM ${c.norms.IM}/3 · GM ${c.norms.GM}/3`]);
    if (c.online) rows.push([SITE, `Bullet ${c.online.bullet} · Blitz ${c.online.blitz} · Rapid ${c.online.rapid}`]);
    for (const r of (c.recent || []).slice().reverse())
      rows.push([`Age ${r.age}`, `${r.name} · ${ord(r.place)} · ${r.score}/${r.rounds}`]);
    jCard({
      tag: "Chess",
      iconSrc: ICON.chart,
      title: `${titleTag(c) ? titleTag(c) + " " : ""}${state.first || "My chess"}`.trim(),
      lead: c.recent && c.recent.length ? "Your recent results." : "No tournaments played yet.",
      rows,
      choices: [["OK", openChess]],
    });
  }

  function openChess() {
    const c = C();
    typeof syncProfile === "function" && syncProfile();
    sTitle.textContent = "CHESS";
    sSub.style.display = "none";
    sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "‹";
    sBack.onclick = () => openSpecialCareers();
    const tt = titleTag(c);
    const head =
      '<div class="sec">My Chess</div>' +
      row(
        "chStat",
        ICON.chart,
        `${tt ? tt + " " : ""}${state.first || ""}`.trim() || "My rating",
        // cada pieza en su propio nodo de texto para que el i18n la traduzca con una regla simple
        [
          `FIDE: ${ratingTxt(c)}`,
          c.peak && c.peak !== c.fide ? `peak ${c.peak}` : "",
          c.fide == null && c.unrated.n ? `${c.unrated.n}/5 games for a rating` : "",
          c.norms.IM || c.norms.GM ? `Norms IM ${c.norms.IM}/3 GM ${c.norms.GM}/3` : "",
        ]
          .filter(Boolean)
          .map((p) => `<em style="font-style:normal">${p}</em>`)
          .join(" · "),
        "",
        typeof CHEV !== "undefined" ? CHEV : "",
      ) +
      row("chAuto", ICON.clock, "Final Rounds", c.autoSim ? "Always simulate" : "Ask me to play them");
    const learn =
      '<div class="sec">Improve</div>' +
      row("chTrain", ICON.brain, "Study", `Work on your chess (${3 - c.yr.train} left this year)`) +
      row("chPuzzle", ICON.puzzle, "Puzzles", c.puzzle == null ? "Train your tactics" : `Puzzle rating ${c.puzzle} · ${c.psolved || 0} solved`) +
      row("chCoach", ICON.teacher, "Coach", COACH[c.coach].name, "", typeof CHEV !== "undefined" ? CHEV : "");
    const tours =
      '<div class="sec">Tournaments</div>' +
      TOURNEYS.map((t) => {
        const why =
          c.banUntil > state.age
            ? `Banned until age ${c.banUntil}`
            : t.minAge && state.age < t.minAge
            ? `Age ${t.minAge}+`
            : t.maxAge && state.age > t.maxAge
              ? `Under ${t.maxAge + 1} only`
              : t.minFide && (c.fide || 0) < t.minFide
                ? t.invite
                  ? `Invitation only (${t.minFide}+)`
                  : `Rating ${t.minFide}+`
                : "";
        const sub =
          why ||
          `${t.rounds} rounds · ${!t.fee ? "invited" : state.age < 18 ? "parents pay the fee" : `fee ${money(price(t.fee))}${t.abroad ? " + travel" : ""}`}`;
        return row(`chT_${t.id}`, t.invite ? ICON.trophy : ICON.pawn, t.name, sub, why ? "dis" : "");
      }).join("");
    const work =
      '<div class="sec">Work</div>' + row("chLessons", ICON.money, "Give Lessons", `Earn ${money(price(lessonRate(c)))}/hour`);
    const o = c.online;
    const online =
      `<div class="sec">${SITE}</div>` +
      (o
        ? row("chLive", ICON.pawn, "Play Live", `Rapid 5+3 vs a real opponent · ${o.rapid}${o.n < 20 ? "?" : ""}`) +
          row("chBullet", ICON.clock, "Bullet", `Rating ${o.bullet}${o.n < 20 ? "?" : ""}`) +
          row("chBlitz", ICON.fire, "Blitz", `Rating ${o.blitz}${o.n < 20 ? "?" : ""}`) +
          row("chRapid", ICON.pc, "Rapid", `Rating ${o.rapid}${o.n < 20 ? "?" : ""}`) +
          row("chTT", ICON.trophy, "Titled Tuesday", "Titled players only", c.title || c.wtitle ? "" : "dis") +
          row("chStream", ICON.stream, "Stream", `${c.followers.toLocaleString("en-US")} followers`)
        : row("chJoin", ICON.pc, `Join ${SITE}`, "Play chess online", state.age < 8 ? "dis" : ""));
    sList.innerHTML = head + learn + tours + work + online;

    const on = (id, fn) => {
      const el = document.getElementById(id);
      el && !el.classList.contains("dis") && (el.onclick = () => (typeof play === "function" && play("choice"), fn()));
    };
    on("chStat", chessProfile);
    on("chTrain", train);
    on("chPuzzle", startPuzzle);
    on("chLive", pawnderLive);
    on("chAuto", () => {
      c.autoSim = !c.autoSim;
      openChess();
    });
    on("chCoach", coachMenu);
    for (const t of TOURNEYS) on(`chT_${t.id}`, () => enterTournament(t));
    on("chLessons", giveLessons);
    on("chJoin", pawnderJoin);
    on("chBullet", () => pawnderPlay("bullet"));
    on("chBlitz", () => pawnderPlay("blitz"));
    on("chRapid", () => pawnderPlay("rapid"));
    on("chTT", titledTuesday);
    on("chStream", stream);
    sList.scrollTop = 0;
  }

  // ---------------------------------------------------------------- eventos (chess-events.js)
  const STAT = { H: "Happiness", He: "Health", S: "Smarts", L: "Looks" };

  function applyFx(c, fx) {
    const rows = [];
    const sign = (n) => (n > 0 ? "+" : "") + n;
    if (fx.str) c.str = Math.round(clampN(c.str + fx.str, 300, 2900));
    if (fx.fide && c.fide != null) {
      const before = c.fide;
      c.fide = Math.max(1400, c.fide + fx.fide);
      c.peak = Math.max(c.peak, c.fide);
      if (c.fide >= 2400) c.everK10 = true;
      rows.push(["Rating", `${before} → ${c.fide} (${sign(c.fide - before)})`]);
    }
    if (fx.money) {
      const m = price(Math.abs(fx.money)) * Math.sign(fx.money);
      state.money += m;
      if (m > 0) c.earned += m;
      rows.push(["Money", `${m > 0 ? "+" : "-"}${money(Math.abs(m))}`]);
      m > 0 && typeof chaChing === "function" && chaChing();
    }
    for (const k of ["H", "He", "S", "L"]) {
      if (!fx[k] || !state.stats) continue;
      const name = STAT[k];
      state.stats[name] = clampN((state.stats[name] || 0) + fx[k], 0, 100);
      rows.push([name, sign(fx[k])]);
    }
    if (fx.followers) {
      const before = c.followers;
      c.followers = Math.max(0, c.followers + fx.followers);
      if (c.followers !== before) rows.push(["Followers", sign(c.followers - before).replace(/\d+/, (d) => (+d).toLocaleString("en-US"))]);
    }
    if (fx.online && c.online) {
      for (const k of ["bullet", "blitz", "rapid"]) c.online[k] = Math.max(100, c.online[k] + fx.online);
      rows.push(["Online rating", sign(fx.online)]);
    }
    if (fx.ban) {
      c.banUntil = Math.max(c.banUntil || 0, state.age + fx.ban);
      rows.push(["Banned", `${fx.ban} years`]);
    }
    if (fx.onlineBan) (c.onlineBan = true), rows.push(["Banned", "Account closed"]);
    if ("sponsor" in fx) {
      c.sponsor = fx.sponsor;
      rows.push(["Sponsor", fx.sponsor ? `${money(price(fx.sponsor))} per year` : "Ended"]);
    }
    if ("league" in fx) {
      c.league = fx.league;
      rows.push(["League contract", fx.league ? `${money(price(fx.league))} per year` : "Ended"]);
    }
    typeof renderStats === "function" && renderStats();
    return rows;
  }

  function eventCtx(c, last) {
    const best = c.online ? Math.max(c.online.bullet, c.online.blitz, c.online.rapid) : 0;
    const X = {
      c,
      yr: { train: 0, tourneys: 0, online: 0, lessons: 0, stream: 0, puzzles: 0, live: 0, ...last },
      age: state.age,
      fide: c.fide || 0,
      title: c.title || c.wtitle || null,
      online: best,
      chance: (p) => rnd() < p,
      beats: (elo) => simGame(c.str, elo) === 1,
      out(text, fx, log) {
        const rows = applyFx(c, fx || {});
        if (log) say(log);
        const newTitles = checkTitles(c);
        jCard({
          tag: "Chess",
          iconSrc: X._icon || ICON.pawn,
          title: X._title || "Chess Life",
          lead: text,
          rows,
          choices: [["OK", () => newTitles.length && titlePopup(newTitles, 0)]],
        });
      },
    };
    return X;
  }

  function runEvent(ev, X) {
    X._icon = ev.icon;
    X._title = ev.title;
    jCard({
      tag: "Chess",
      iconSrc: ev.icon,
      title: ev.title,
      lead: ev.lead,
      choices: ev.choices.map(([label, fn]) => [label, () => fn(X)]),
    });
  }

  function rollEvent(c, last) {
    const list = window.FL_CHESS_EVENTS;
    if (!list || !list.length || state.dead || state.prison) return;
    const active = (last.tourneys || 0) + (last.train || 0) + (last.online || 0) + (last.lessons || 0) + (last.live || 0) + (last.puzzles ? 1 : 0) > 0;
    if (rnd() > (active ? 0.55 : 0.12)) return;
    const X = eventCtx(c, last);
    const done = (c.evDone ||= {});
    const ok = list.filter((ev) => {
      const lastAge = done[ev.id];
      if (lastAge != null && (ev.once || state.age - lastAge < 5)) return false;
      try {
        return !!ev.when(X);
      } catch {
        return false;
      }
    });
    if (!ok.length) return;
    const ev = pick(ok);
    done[ev.id] = state.age;
    const show = () => runEvent(ev, X);
    typeof queuePopup === "function" ? queuePopup(show) : setTimeout(show, 600);
  }

  // ---------------------------------------------------------------- age up
  const AGE_CURVE = (a) => (a <= 12 ? 120 : a <= 19 ? 90 : a <= 29 ? 40 : a <= 38 ? 10 : a <= 50 ? -10 : -25);

  function yearTick() {
    const c = state.chess;
    if (!c || !c.v || state.dead) return;
    const last = c.yr || { train: 0, tourneys: 0, online: 0, lessons: 0 };
    const activity =
      last.train * 0.15 +
      last.tourneys * 0.12 +
      last.online * 0.05 +
      Math.min(last.puzzles || 0, 30) * 0.01 +
      Math.min(last.live || 0, 10) * 0.02 +
      (last.stream || 0) * 0.05;
    // Potencial: el techo de cada uno. Talento promedio (~0.86) ≈ 2050; GM pide talento alto + coach;
    // la élite (2750+) solo con talento máximo, coach GM y dedicación completa.
    const potential = 1000 + c.talent * 1200 + c.coach * 60;
    let g = AGE_CURVE(state.age);
    if (g > 0) {
      const effort = Math.min(1.3, 0.3 + activity * 1.5 + (c.coach ? 0.2 : 0)); // sin jugar ni estudiar casi no subes
      const room = clampN((potential - c.str) / 600, 0, 1.2); // cerca del techo, crecimiento ~0
      g = g * c.talent * COACH[c.coach].mult * effort * room;
      if (last.lessons) g *= 0.85;
    }
    c.str = Math.round(clampN(c.str + g + gauss() * 15, 300, 2900));
    // el coach se paga
    if (c.coach) {
      const fee = price(COACH[c.coach].fee);
      if (state.money >= fee) {
        state.money -= fee;
      } else {
        say(`I couldn't afford my chess coach anymore.`);
        c.coach = 0;
      }
    }
    // streaming: ingresos pasivos
    if (c.followers > 500) {
      const inc = price(Math.round(c.followers * 0.6));
      state.money += inc;
      c.earned += inc;
      c.followers = Math.round(c.followers * (last.stream ? 1.05 : 0.85));
    }
    // patrocinio y liga: pagan cada año (la liga te suelta si bajas de 2200)
    if (c.sponsor) {
      const inc = price(c.sponsor);
      state.money += inc;
      c.earned += inc;
    }
    if (c.league) {
      if ((c.fide || 0) < 2200) {
        c.league = 0;
        say("My chess league team released me.");
      } else {
        const inc = price(c.league);
        state.money += inc;
        c.earned += inc;
      }
    }
    typeof renderStats === "function" && renderStats();
    rollEvent(c, last);
    // yearTick no pasa por C(), que era el único que reiniciaba el contador del año. Sin esto
    // `c.yr` quedaba congelado en el último año con actividad y los eventos seguían disparándose
    // para siempre (torneos, stream, clases) aunque no hicieras nada.
    c.yr = { age: state.age, train: 0, tourneys: 0, online: 0, lessons: 0, stream: 0, puzzles: 0, live: 0 };
  }

  // ---------------------------------------------------------------- arranque
  // carga el motor y los puzzles (mismo directorio que chess.js)
  const BASE = (() => {
    const s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/chess\.js(\?.*)?$/, "") : "";
  })();
  function loadAssets() {
    const add = (file) => {
      const el = document.createElement("script");
      el.src = BASE + file;
      el.async = false;
      document.head.append(el);
    };
    if (!window.FL_ENGINE) add("chess-engine.js?v=1");
    if (!window.FL_PUZZLES) add("chess-puzzles.js?v=1");
    if (!window.FL_CHESS_EVENTS) add("chess-events.js?v=1");
    try {
      worker = new Worker(BASE + "chess-engine.js?v=1");
      worker.onmessage = (e) => {
        const f = wwait.get(e.data && e.data.id);
        if (f) wwait.delete(e.data.id), f(e.data);
      };
      worker.onerror = () => (worker = null); // sin worker: el bot piensa en el hilo principal
    } catch {
      worker = null;
    }
  }

  function boot() {
    if (typeof openSpecialCareers !== "function" || !document.getElementById("ageBtn") || typeof sList === "undefined")
      return setTimeout(boot, 50);
    const orig = openSpecialCareers;
    openSpecialCareers = function () {
      const r = orig.apply(this, arguments);
      try {
        const c = state.chess && state.chess.v ? state.chess : null;
        const sub = state.age < 6
          ? "Available from age 6"
          : c
            ? `${titleTag(c) ? titleTag(c) + " · " : ""}FIDE ${ratingTxt(c)}`
            : "Play, train and compete";
        const html = `<div class="row sp-pack${state.age < 6 ? " dis" : ""}" id="spChess"><img src="${ICON.pawn}" alt=""><div class="t"><b>Chess Career</b><span>${sub}</span></div>${typeof CHEV !== "undefined" ? CHEV : ""}</div>`;
        const first = sList.querySelector(".sp-pack");
        first ? first.insertAdjacentHTML("beforebegin", html) : sList.insertAdjacentHTML("beforeend", html);
        const el = document.getElementById("spChess");
        if (el && state.age >= 6) el.onclick = () => (typeof play === "function" && play("choice"), openChess());
      } catch (e) {
        console.warn("[chess] menu", e);
      }
      return r;
    };
    document.getElementById("ageBtn").addEventListener("click", () =>
      setTimeout(() => {
        try {
          yearTick();
        } catch (e) {
          console.warn("[chess] yearTick", e);
        }
      }, 0),
    );
    window.FL_CHESS = {
      open: openChess, board: playBoard, puzzle: startPuzzle, world: worldMatch, state: () => state.chess,
      // debug: dispara un evento por id (o devuelve los que aplican ahora si no le pasas id)
      event: (id) => {
        const c = C(), X = eventCtx(c, c.yr);
        const list = window.FL_CHESS_EVENTS || [];
        if (!id) return list.filter((e) => { try { return e.when(X); } catch { return false; } }).map((e) => e.id);
        const ev = list.find((e) => e.id === id);
        return ev ? (runEvent(ev, X), true) : false;
      }, _sim: { runTournament, applyRating, expected, checkTitles } };
  }
  loadAssets();
  boot();
})();
