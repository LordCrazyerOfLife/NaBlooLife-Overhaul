/* [mod] Football Career for NaBlooLife (local mod).
 *
 * A full BitLife-style football life: high-school team, academy, first team,
 * yearly training, league/cup/continental/national-team competitions, key
 * match decisions, 44 random events, transfers, loans, contracts and a
 * permanent trophy cabinet.
 *
 * Entry: Occupation -> Special Careers -> Football Career.
 * State: state.futbol (JSON only, per life).
 * Rule: never advances a season by itself. Every year waits for the player's
 * decisions before the next age-up is allowed.
 *
 * Loaded by modloader.js. Deps: futbol-data.js, futbol-events.js.
 */
(() => {
  "use strict";

  if (window.FL_FUTBOL || window.__FL_FUTBOL_LOADING) return;
  window.__FL_FUTBOL_LOADING = true;

  const T = (en) => en;
  const CAREER = T("Football Career");
  const ICON = "emoji/26bd.png";
  const E = (code) => `emoji/${code}.png`;
  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const clampN = (v, a, b) => Math.max(a, Math.min(b, Number(v) || 0));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const money = (n) => (typeof usd === "function" ? usd(n) : "$" + Math.round(n).toLocaleString("en-US"));
  const year = () => (Number(state && state.birthYear) || 2000) + (Number(state && state.age) || 0);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const pickN = (arr, n) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  };
  // The game's SND table has no "chaChing" or "achievement": play() would throw on them and kill the callback.
  const SND_ALIAS = { chaChing: "coins", achievement: "ding" };
  const playSnd = (n) => {
    try {
      return typeof play === "function" && play(SND_ALIAS[n] || n);
    } catch {
      return false;
    }
  };
  const sayIt = (s) => typeof say === "function" && say(s);
  // [mod] the life log used to say "Event title: choice". Now it tells what happened, in the first person.
  const firstPerson = (txt) => {
    let t = String(txt || "").trim();
    const R = [
      [/\bYou're\b/gi, "I'm"],
      [/\bYou are\b/gi, "I am"],
      [/\bYou were\b/gi, "I was"],
      [/\bYou have\b/gi, "I have"],
      [/\bYou've\b/gi, "I've"],
      [/\bYou'll\b/gi, "I'll"],
      [/\b(tell|tells|told|give|gives|gave|hand|hands|handed|ask|asks|asked|offer|offers|offered|call|calls|called|show|shows|showed|send|sends|sent|see|sees|saw|hit|hits|ignore|ignores|follow|follows|followed|let|lets|make|makes|made|force|forces|forced|thank|thanks|thanked|warn|warns|warned|promise|promises|promised|to|for|with|at|about|without|from|behind|on|by) you\b/gi, "$1 me"],
      [/\bYou\b/g, "I"],
      [/\byou\b/g, "I"],
      [/\bYour\b/g, "My"],
      [/\byours\b/gi, "mine"],
      [/\byourself\b/gi, "myself"],
      [/\byour\b/g, "my"],
    ];
    R.forEach(([a, b]) => (t = t.replace(a, b)));
    if (t && !/[.!?]$/.test(t)) t += ".";
    return t;
  };
  const noticeIt = (t, b, cb, one = true) => typeof notice === "function" && notice(t, b, cb, one);
  const renderAll = () => typeof renderStats === "function" && renderStats();
  const chev = () => (typeof CHEV !== "undefined" ? CHEV : "");
  const dots = () => (typeof DOTS !== "undefined" ? DOTS : "");

  // ------------------------------------------------------------------ positions
  const POSITIONS = [
    { id: "ST", n: T("Striker"), goal: 1.55, assist: 0.75, def: 0.15, gk: false },
    { id: "LW", n: T("Left Winger"), goal: 1.05, assist: 1.25, def: 0.35, gk: false },
    { id: "RW", n: T("Right Winger"), goal: 1.0, assist: 1.2, def: 0.35, gk: false },
    { id: "CAM", n: T("Attacking Midfielder"), goal: 0.9, assist: 1.45, def: 0.4, gk: false },
    { id: "CM", n: T("Central Midfielder"), goal: 0.55, assist: 1.0, def: 0.85, gk: false },
    { id: "CDM", n: T("Defensive Midfielder"), goal: 0.25, assist: 0.5, def: 1.35, gk: false },
    { id: "FB", n: T("Full Back"), goal: 0.22, assist: 0.95, def: 1.25, gk: false },
    { id: "CB", n: T("Center Back"), goal: 0.24, assist: 0.25, def: 1.55, gk: false },
    { id: "GK", n: T("Goalkeeper"), goal: 0.02, assist: 0.05, def: 1.8, gk: true },
  ];

  // ------------------------------------------------------------------ attributes
  const ATTRS = [
    { id: "shooting", n: T("Shooting"), ico: E("26bd") },
    { id: "passing", n: T("Passing"), ico: E("1f91d") },
    { id: "reaction", n: T("Reaction"), ico: E("26a1") },
    { id: "touch", n: T("First touch"), ico: E("1f4a5") },
    { id: "dribbling", n: T("Dribbling"), ico: E("1f3c3") },
    { id: "defending", n: T("Defending"), ico: E("1f6e1-fe0f") },
    { id: "physical", n: T("Physical"), ico: E("1f4aa") },
    { id: "pace", n: T("Pace"), ico: E("1f4a8") },
    { id: "vision", n: T("Vision"), ico: E("1f441-fe0f") },
  ];

  const TRAININGS = [
    { id: "shooting", n: T("Shooting drills"), ico: E("26bd") },
    { id: "passing", n: T("Passing patterns"), ico: E("1f91d") },
    { id: "reaction", n: T("Reaction training"), ico: E("26a1") },
    { id: "touch", n: T("First-touch work"), ico: E("1f4a5") },
    { id: "dribbling", n: T("Dribbling sessions"), ico: E("1f3c3") },
    { id: "defending", n: T("Defensive work"), ico: E("1f6e1-fe0f") },
    { id: "physical", n: T("Gym and strength"), ico: E("1f4aa") },
    { id: "pace", n: T("Sprint and speed"), ico: E("1f4a8") },
    { id: "vision", n: T("Video and vision"), ico: E("1f441-fe0f") },
    { id: "recovery", n: T("Recovery and rest"), ico: E("1f634") },
  ];

  const attrAvg = (f) => {
    const a = ATTRS.map((x) => Number(f.attrs && f.attrs[x.id]) || 0);
    return a.reduce((n, v) => n + v, 0) / Math.max(1, a.length);
  };

  // ------------------------------------------------------------------ leagues
  const FALLBACK_DATA = {
    leagues: [
      {
        id: "epl",
        name: "Premier League",
        country: "England",
        flag: "gb",
        rep: 92,
        logo: "",
        cup: "FA Cup",
        cupLogo: "",
        continental: "Champions League",
        conf: "UEFA",
        clubs: [
          { id: "manchester-city", name: "Manchester City", rep: 97, logo: "" },
          { id: "arsenal", name: "Arsenal", rep: 94, logo: "" },
          { id: "liverpool", name: "Liverpool", rep: 94, logo: "" },
          { id: "chelsea", name: "Chelsea", rep: 92, logo: "" },
          { id: "tottenham", name: "Tottenham", rep: 87, logo: "" },
          { id: "newcastle", name: "Newcastle", rep: 86, logo: "" },
          { id: "aston-villa", name: "Aston Villa", rep: 85, logo: "" },
          { id: "brighton", name: "Brighton", rep: 82, logo: "" },
          { id: "everton", name: "Everton", rep: 76, logo: "" },
          { id: "fulham", name: "Fulham", rep: 74, logo: "" },
          { id: "crystal-palace", name: "Crystal Palace", rep: 73, logo: "" },
          { id: "brentford", name: "Brentford", rep: 71, logo: "" },
          { id: "nottingham-forest", name: "Nottingham Forest", rep: 70, logo: "" },
          { id: "bournemouth", name: "Bournemouth", rep: 69, logo: "" },
          { id: "sunderland", name: "Sunderland", rep: 66, logo: "" },
          { id: "leeds-united", name: "Leeds United", rep: 65, logo: "" },
          { id: "ipswich", name: "Ipswich", rep: 62, logo: "" },
          { id: "hull-city", name: "Hull City", rep: 58, logo: "" },
          { id: "coventry-city", name: "Coventry City", rep: 57, logo: "" },
        ],
        tier2: [],
      },
    ],
  };

  const LEAGUES = ((window.FL_FUTBOL_DATA && window.FL_FUTBOL_DATA.leagues) || FALLBACK_DATA.leagues)
    .filter((l) => l && Array.isArray(l.clubs) && l.clubs.length)
    .map((l) => ({
      ...l,
      flag: l.flag || "",
      logo: l.logo || "",
      cup: l.cup || `${l.name} Cup`,
      cupLogo: l.cupLogo || "",
      continental: l.continental || "Continental Cup",
      conf: l.conf || "UEFA",
      tier2: Array.isArray(l.tier2) ? l.tier2 : [],
    }));

  const BIG_LEAGUES = new Set(["epl", "laliga", "seriea", "bundesliga", "ligue1"]);

  const LOWER_POOL = {
    England: ["Birmingham City", "Blackburn Rovers", "Middlesbrough", "Sheffield United", "Norwich City", "West Bromwich Albion", "Coventry City", "Stoke City", "Swansea City", "Watford", "Preston North End", "Bristol City"],
    Spain: ["Real Zaragoza", "Sporting Gijón", "Racing Santander", "Deportivo La Coruña", "Real Oviedo", "UD Las Palmas", "Granada CF", "Cádiz CF", "Levante UD", "Almería", "Huesca", "Eibar"],
    Italy: ["Palermo", "Parma", "Sampdoria", "Genoa", "Bari", "Cagliari", "Empoli", "Lecce", "Verona", "Pisa", "Spezia", "Modena"],
    Germany: ["Hamburger SV", "Schalke 04", "Hertha BSC", "Werder Bremen", "1. FC Köln", "Fortuna Düsseldorf", "Hannover 96", "Nürnberg", "Kaiserslautern", "Karlsruher SC", "Paderborn", "Greuther Fürth"],
    France: ["Saint-Étienne", "Bordeaux", "Nantes", "Metz", "Guingamp", "Caen", "Bastia", "Amiens", "Troyes", "Lorient", "Clermont", "Ajaccio"],
  };

  function secondDivisionOf(l) {
    if (!l) return [];
    let arr = [];
    if (l.tier2 && l.tier2.length) {
      arr = l.tier2.map((c) => ({
        id: String(c.id || c.name || "club").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: String(c.name || c.id || "Unknown"),
        rep: clampN(c.rep || l.rep - 28, 34, 72),
        logo: c.logo || l.tier2Logo || l.logo || "",
      }));
    }
    if (BIG_LEAGUES.has(l.id)) {
      const pool = LOWER_POOL[l.country] || [];
      for (const name of pool) {
        if (arr.length >= 18) break;
        if (arr.some((c) => c.name === name)) continue;
        arr.push({
          id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name,
          rep: clampN(l.rep - 25 - arr.length, 34, 70),
          logo: l.tier2Logo || l.logo || "",
        });
      }
    }
    if (arr.length) return arr;
    // Fallback: bottom half of the league becomes the second division.
    return l.clubs
      .slice(-Math.max(4, Math.floor(l.clubs.length / 2)))
      .map((c) => ({ ...c, id: `${c.id}-2`, name: `${c.name} II`, rep: Math.max(32, c.rep - 14) }));
  }

  const ALL_CLUBS = [];
  LEAGUES.forEach((l) => {
    l.clubs.forEach((c) => ALL_CLUBS.push({ l, c, division: 1 }));
    secondDivisionOf(l).forEach((c) => ALL_CLUBS.push({ l, c, division: 2 }));
  });

  const POS_BY_ID = {};
  POSITIONS.forEach((p, i) => (POS_BY_ID[p.id] = i));

  function tableRank(l, c) {
    if (!l || !c) return 99;
    const sorted = l.clubs.slice().sort((a, b) => b.rep - a.rep);
    return sorted.findIndex((x) => x.id === c.id || x.name === c.name) + 1;
  }

  function interestBand(f) {
    if (f.skill >= 80) return T("Elite clubs (top 4 of the big leagues)");
    if (f.skill >= 60) return T("Upper mid-table clubs (5th-8th)");
    if (f.skill >= 50) return T("Lower-table clubs and second divisions");
    return T("Second divisions and smaller leagues");
  }

  function interestClubs(f, count) {
    const cur = f.club;
    const skill = f.skill;
    const pool = [];
    for (const x of ALL_CLUBS) {
      const rank = tableRank(x.l, x.c);
      const last = x.l.clubs.length;
      let hit = false;
      if (x.division === 1) {
        if (skill >= 80 && rank >= 1 && rank <= 4) hit = true;
        else if (skill >= 60 && skill < 80 && rank >= 5 && rank <= 8) hit = true;
        else if (skill >= 50 && skill < 60 && rank > last - 5) hit = true;
        else if (skill < 50 && BIG_LEAGUES.has(x.l.id) && rank > last - 3) hit = true;
      } else if (skill < 65 && BIG_LEAGUES.has(x.l.id)) {
        hit = true;
      }
      if (!hit) continue;
      if (cur && x.c.name === cur.name && x.l.id === cur.lId) continue;
      pool.push(x);
    }
    if (!pool.length) {
      for (const x of ALL_CLUBS) {
        if (cur && x.c.name === cur.name && x.l.id === cur.lId) continue;
        pool.push(x);
      }
    }
    pool.sort((a, b) => {
      const da = Math.abs(a.c.rep - (skill + 8)) + rnd() * 5;
      const db = Math.abs(b.c.rep - (skill + 8)) + rnd() * 5;
      return da - db;
    });
    const out = [];
    for (const x of pool) {
      const c = clubRef(x.l, x.c, x.division);
      if (out.some((o) => clubKey(o) === clubKey(c))) continue;
      out.push(c);
      if (out.length >= count) break;
    }
    return out;
  }

  function leagueById(id) {
    return LEAGUES.find((l) => l.id === id) || null;
  }

  function leagueForCountry(country) {
    const c = String(country || "").toLowerCase().trim();
    const direct = LEAGUES.filter((l) => String(l.country || "").toLowerCase() === c);
    if (direct.length) return pick(direct);
    const partial = LEAGUES.filter(
      (l) =>
        String(l.country || "").toLowerCase().includes(c) ||
        c.includes(String(l.country || "").toLowerCase()),
    );
    if (partial.length) return pick(partial);
    return pick(LEAGUES.slice().sort((a, b) => b.rep - a.rep).slice(0, 8));
  }

// ------------------------------------------------------------------ countries selector (Europe + America)
  const CONTINENTS = {
    europe: [
      "England", "Spain", "Germany", "Italy", "France", "Portugal", "Netherlands",
      "Belgium", "Scotland", "Netherlands", "Russia", "Ukraine", "Turkey", "Greece",
      "Austria", "Switzerland", "Sweden", "Norway", "Denmark", "Czech Republic",
      "Poland", "Romania", "Croatia", "Serbia", "Finland", "Greece", "Hungary",
      "Ukraine", "Portugal", "Belgium", "Austria", "Turkey", "Croatia", "Denmark",
    ],
    america: [
      "United States", "Mexico", "Canada", "Argentina", "Brazil", "Colombia",
      "Chile", "Peru", "Ecuador", "Venezuela", "Uruguay", "Paraguay", "Bolivia",
      "Costa Rica", "Jamaica", "Honduras", "Panama", "El Salvador", "Guatemala",
    ],
  };

  function getContinentalLeagues(continent) {
    const countries = CONTINENTS[continent] || [];
    const leagues = [];
    LEAGUES.forEach((l) => {
      const country = l.country || "";
      if (countries.some((c) => String(c).toLowerCase() === String(country).toLowerCase())) {
        leagues.push(l);
      }
    });
    return leagues;
  }

  function showCountriesCard(continent) {
    const leagues = getContinentalLeagues(continent);
    const countryNames = CONTINENTS[continent];
    const countryFilter = countryNames
      .map((c) => String(c).toLowerCase())
      .filter((c) => leagues.some((l) => String(l.country || "").toLowerCase() === c));

    card({
      iconSrc: ICON,
      title: continent === "europe" ? T("European Leagues") : T("American Leagues"),
      lead: `${
        continent === "europe"
          ? T("Select a European country to see its football leagues")
          : T("Select an American country to see its football leagues")
      }<br><br>${T("Countries available:")} ${countryFilter.join(", ")}`,
      rows: leagues.map((l) => [
        T(l.country),
        `${l.clubs ? l.clubs.length : 0} ${T("clubs")}`,
      ]),
      buttons: [
        [
          T("Select"),
          () => {
            // This will be handled by the country click
          },
        ],
      ],
      ok: () => {},
    });
  }

  function showLeagueCard(countryName) {
    const leagues = leagueForCountry(countryName);
    card({
      iconSrc: ICON,
      title: `${T(countryName)} ${T("Leagues")}`,
      lead: `${T("Select a league from ${countryName}")}<br><br>${leagues
        .map((l) => `- ${l.name} (${l.clubs ? l.clubs.length : 0} clubs)`)
        .join("<br>")}`,
      rows: leagues.map((l) => [
        T(l.name),
        `${l.id}`,
      ]),
      buttons: [
        [
          T("Select League"),
          () => {
            // League selected - will be handled
          },
        ],
      ],
      ok: () => {},
    });
  }

  // Export for use by other modules
  window.FL_FUTBOL_COUNTRIES = {
    showCountriesCard,
    showLeagueCard,
    CONTINENTS,
    getContinentalLeagues,
    leagueForCountry,
  };

  function clubRef(l, c, division) {
    const div = division || 1;
    return {
      id: String((c && c.id) || ""),
      name: String((c && c.name) || "Unknown FC"),
      logo: (c && c.logo) || (div === 2 ? l.tier2Logo : l.logo) || ICON,
      rep: clampN((c && c.rep) || 60, 25, 99),
      division: div,
      lId: l.id,
      lName: div === 2 ? l.tier2Name || `${l.name} 2` : l.name,
      lLogo: l.logo || "",
      country: l.country || "",
      flag: l.flag || "",
      cup: l.cup,
      cupLogo: l.cupLogo || l.logo || "",
      continental: l.continental,
      conf: l.conf,
    };
  }

  function clubKey(c) {
    return `${(c && c.lId) || ""}|${(c && c.id) || (c && c.name) || ""}|${(c && c.division) || 1}`;
  }

  function clubLabel(c) {
    if (!c) return T("Free agent");
    return c.division === 2 ? `${c.name} (${T("2nd Division")})` : c.name;
  }

  function youthClubFor(l) {
    const pool = l.clubs.filter((c) => c.rep <= Math.max(64, l.rep - 12));
    const chosen = pick(pool.length ? pool : l.clubs);
    return clubRef(l, chosen, 1);
  }

  function randomClubs(count, opts = {}) {
    const out = [];
    const used = new Set(opts.exclude || []);
    const min = opts.min == null ? 30 : opts.min;
    const max = opts.max == null ? 99 : opts.max;
    const div = opts.division || 0;
    const pool = ALL_CLUBS.filter(
      (x) => x.c.rep >= min && x.c.rep <= max && (!div || x.division === div) && !used.has(clubKey(clubRef(x.l, x.c, x.division))),
    );
    const shuffled = pickN(pool, Math.max(count * 4, count));
    for (const x of shuffled) {
      if (out.length >= count) break;
      const c = clubRef(x.l, x.c, x.division);
      const k = clubKey(c);
      if (used.has(k)) continue;
      used.add(k);
      out.push(c);
    }
    return out;
  }

  function findLeagueOfClub(c) {
    return leagueById(c && c.lId) || leagueForCountry(c && c.country);
  }

  // ------------------------------------------------------------------ state
  function F() {
    if (!state.futbol || typeof state.futbol !== "object") state.futbol = {};
    const f = state.futbol;
    if (f.v !== 1) f.v = 1;
    if (typeof f.active !== "boolean") f.active = false;
    if (typeof f.pro !== "boolean") f.pro = false;
    if (typeof f.youth !== "boolean") f.youth = true;
    if (!f.club || typeof f.club !== "object") f.club = null;
    if (!Number.isInteger(f.pos) || !POSITIONS[f.pos]) f.pos = 0;
    f.skill = clampN(f.skill == null ? 52 : f.skill, 1, 99);
    if (!f.attrs || typeof f.attrs !== "object") f.attrs = {};
    ATTRS.forEach((a) => {
      f.attrs[a.id] = clampN(f.attrs[a.id] == null ? f.skill + ri(-7, 7) : f.attrs[a.id], 1, 99);
    });
    f.fit = clampN(f.fit == null ? 70 : f.fit, 1, 99);
    f.fatigue = clampN(f.fatigue == null ? 20 : f.fatigue, 0, 100);
    if (!INTENSITY[f.plan]) f.plan = "normal";
    f.fame = clampN(f.fame == null ? 0 : f.fame, 0, 100);
    f.form = clampN(f.form == null ? 50 : f.form, 0, 100);
    f.coachRel = clampN(f.coachRel == null ? 55 : f.coachRel, 0, 100);
    f.clubRel = clampN(f.clubRel == null ? 55 : f.clubRel, 0, 100);
    f.hype = clampN(f.hype == null ? 0 : f.hype, 0, 100);
    f.wage = Math.max(0, Number(f.wage) || 0);
    f.potential = clampN(f.potential == null ? ri(72, 96) : f.potential, 55, 99);
    f.gifted = !!f.gifted;
    f.scouted = !!f.scouted;
    f.seasonAge = Number.isFinite(f.seasonAge) ? f.seasonAge : -1;
    f.trainYear = Number.isFinite(f.trainYear) ? f.trainYear : -1;
    f.seasonNo = Math.max(0, Number(f.seasonNo) || 0);
    f.pending = !!f.pending;
    f.flowDone = !!f.flowDone;
    f.mods = f.mods && typeof f.mods === "object" ? f.mods : { atk: 0, def: 0, luck: 0 };
    f.contract = f.contract && typeof f.contract === "object" ? f.contract : { wage: 0, years: 0, release: 0 };
    f.nat = f.nat && typeof f.nat === "object" ? f.nat : { called: false, caps: 0, goals: 0, debut: 0, hist: [] };
    if (!Array.isArray(f.nat.hist)) f.nat.hist = [];
    f.trophies = Array.isArray(f.trophies) ? f.trophies : [];
    f.history = Array.isArray(f.history) ? f.history : [];
    f.recent = Array.isArray(f.recent) ? f.recent : [];
    f.highlights = Array.isArray(f.highlights) ? f.highlights : [];
    f.lastSeason = f.lastSeason && typeof f.lastSeason === "object" ? f.lastSeason : null;
    f.injury = f.injury && typeof f.injury === "object" ? f.injury : null;
    f.ban = Math.max(0, Number(f.ban) || 0);
    f.career = f.career && typeof f.career === "object" ? f.career : { apps: 0, goals: 0, assists: 0, seasons: 0 };
    f.captain = !!f.captain;
    f.obj = f.obj && typeof f.obj === "object" ? f.obj : null;
    f.memLog = Array.isArray(f.memLog) ? f.memLog : [];
    f.trainLeft = Number.isFinite(f.trainLeft) ? f.trainLeft : 0;
    f.tab = ["today", "career", "club"].includes(f.tab) ? f.tab : "today";
    f.retired = !!f.retired;
    return f;
  }

  function posOf(f) {
    return POSITIONS[f.pos] || POSITIONS[0];
  }

  function posName(f) {
    return posOf(f).n;
  }

  function clubPower(f) {
    const m = f.mods || {};
    const inj = f.injury ? 8 : 0;
    return clampN(
      (f.club ? f.club.rep : 55) +
        (f.skill - 55) * 0.38 +
        (f.fit - 60) * 0.12 +
        (f.form - 50) * 0.1 +
        (m.atk || 0) * 0.6 +
        (m.def || 0) * 0.6 -
        inj,
      25,
      120,
    );
  }

  function wageFor(club, skill, fame) {
    const rep = clampN(club && club.rep, 30, 99);
    const base = 90000 * Math.pow(1.085, rep - 60);
    const skillF = 0.45 + clampN(skill, 40, 99) / 55;
    const fameF = 1 + clampN(fame, 0, 100) / 70;
    // [mod] superstar premium: the elite earn far more than the flat curve gave them
    const star = 1 + (Math.max(0, skill - 85) / 10) * (rep >= 85 ? 1 : 0.35) + (fame > 70 ? (fame - 70) / 100 : 0) * (rep >= 85 ? 1 : 0);
    const infl = typeof window.inflFx === "function" ? window.inflFx() : 1; // same 3%/yr as job salaries
    return Math.max(45000, Math.round((base * skillF * fameF * star * infl) / 10000) * 10000);
  }

  function syncJob(f) {
    if (!f.active || !f.club) return;
    const title = f.youth ? T("Youth Player") : f.pro ? T("Professional Footballer") : T("Footballer");
    state.job = {
      t: title,
      c: T("Football"),
      emp: f.club.name,
      pay: f.wage || 0,
      icon: f.club.logo || ICON,
      football: true,
      perf: clampN(35 + f.skill * 0.45 + f.form * 0.2, 10, 99),
      yrs: Math.max(0, Number(f.contract && f.contract.years) || 0),
    };
    renderAll();
  }

  function clearFootballJob() {
    if (state.job && state.job.football) state.job = null;
    renderAll();
  }

  // ------------------------------------------------------------------ effects
  function effectRows(obj) {
    const rows = [];
    const add = (label, v, suffix = "") => {
      if (!v) return;
      rows.push([label, `${v > 0 ? "+" : ""}${v}${suffix}`]);
    };
    add(T("Skill"), obj.skill, "%");
    add(T("Fitness"), obj.fit, "%");
    add(T("Fame"), obj.fame, "%");
    add(T("Form"), obj.form, "%");
    add(T("Happiness"), obj.hap);
    add(T("Coach relationship"), obj.coach);
    add(T("Club relationship"), obj.club);
    add(T("Hype"), obj.hype);
    if (obj.money) rows.push([T("Money"), `${obj.money > 0 ? "+" : ""}${money(obj.money)}`]);
    if (obj.injury) rows.push([T("Injury"), `${obj.injury} ${T("weeks")}`]);
    if (obj.ban) rows.push([T("Ban"), `${obj.ban} ${T("matches")}`]);
    return rows;
  }

  function applyEffects(f, obj, rows) {
    if (!obj) return rows || [];
    const out = rows || [];
    if (obj.attrs) {
      const before = attrAvg(f);
      for (const [k, v] of Object.entries(obj.attrs)) {
        if (f.attrs && f.attrs[k] != null) {
          f.attrs[k] = clampN(f.attrs[k] + v, 1, 99);
          out.push([ATTRS.find((a) => a.id === k)?.n || k, `${v > 0 ? "+" : ""}${v}`]);
        }
      }
      // [fix] move skill by the change in the attribute average. Overwriting it with the average made the
      // overall jump (e.g. 70% -> 54%) after any training, since skill also moves on its own (matches, age).
      f.skill = clampN(Math.round(f.skill + (attrAvg(f) - before)), 1, 99);
    }
    if (obj.skill) f.skill = clampN(f.skill + obj.skill, 1, 99);
    if (obj.fit) f.fit = clampN(f.fit + obj.fit, 1, 99);
    if (obj.fame) f.fame = clampN(f.fame + obj.fame, 0, 100);
    if (obj.form) f.form = clampN(f.form + obj.form, 0, 100);
    if (obj.coach) f.coachRel = clampN(f.coachRel + obj.coach, 0, 100);
    if (obj.club) f.clubRel = clampN(f.clubRel + obj.club, 0, 100);
    if (obj.hype) f.hype = clampN(f.hype + obj.hype, 0, 100);
    if (obj.wagePct && f.wage) {
      const next = Math.max(45000, Math.round((f.wage * (1 + obj.wagePct / 100)) / 1000) * 1000);
      f.wage = next;
      if (f.contract) f.contract.wage = next;
    }
    if (obj.money) {
      state.money = Math.max(0, (Number(state.money) || 0) + obj.money);
      if (obj.money > 0) playSnd("chaChing");
    }
    if (obj.hap && state.stats) {
      state.stats.Happiness = clampN((Number(state.stats.Happiness) || 60) + obj.hap, 0, 100);
    }
    if (obj.injury) f.injury = { weeks: Math.max(1, Math.round(obj.injury)), year: year() };
    if (obj.ban) f.ban = Math.max(0, f.ban) + Math.max(1, Math.round(obj.ban));
    out.push(...effectRows(obj));
    renderAll();
    return out;
  }

  // ------------------------------------------------------------------ cards
  function card(o) {
    if (typeof jCard !== "function") return;
    jCard({ tag: CAREER, ...o });
  }

  function statusCard(f, next, extraRows) {
    const rows = [
      [T("Age"), String(state.age)],
      [T("Club"), f.club ? `${clubLabel(f.club)} · ${f.youth ? T("Youth") : T("First team")}` : T("No club")],
      [T("Position"), posName(f)],
      [T("Skill"), `${Math.round(f.skill)}%`],
      [T("Fitness"), `${Math.round(f.fit)}%`],
      [T("Fame"), `${Math.round(f.fame)}%`],
      [T("Money"), money(state.money)],
      [T("Trophies"), String(f.trophies.length)],
    ];
    if (f.injury) rows.push([T("Injury"), `${f.injury.weeks} ${T("weeks left")}`]);
    if (f.ban) rows.push([T("Suspension"), `${f.ban} ${T("matches")}`]);
    if (f.contract && f.contract.years) rows.push([T("Contract"), `${f.contract.years} ${f.contract.years === 1 ? T("year") : T("years")} · ${money(f.wage)}/${T("yr")}`]);
    if (extraRows && extraRows.length) rows.push(...extraRows);
    card({
      iconSrc: (f.club && f.club.logo) || ICON,
      title: `${year()} · ${f.club ? f.club.name : T("Football Career")}`,
      lead: f.youth
        ? T("Another year in the youth setup. The first team is watching, and so is everyone else.")
        : T("A new season starts. The club expects, the fans demand, and your body has opinions."),
      rows,
      bars: [
        [T("Skill"), f.skill],
        [T("Fitness"), f.fit],
        ...ATTRS.map((a) => [a.n, Math.round(f.attrs[a.id])]),
      ],
      ok: next,
    });
  }
  // ------------------------------------------------------------------ moments
  // Every choice is a real football decision. The success chance comes from
  // your skill, fitness, form and position, so a 55-rated kid cannot chip the
  // keeper like a 90-rated star.
  const MOMENTS = {
    youth: [
      {
        title: T("The trial match"),
        text: () =>
          "The academy coach puts you on for the last twenty minutes of a trial match. There are scouts by the corner flag and your legs feel like paper.",
        choices: [
          {
            t: T("Demand the ball"),
            p: (f) => 0.35 + f.skill / 190 + f.form / 400,
            good: { skill: 2, coach: 6, fame: 2, form: 5, mods: { atk: 2 } },
            bad: { coach: -4, form: -4, hap: -2 },
            gm: "You demand it, beat your man twice and set up the winner. The coach writes your name down.",
            bm: "You demand it, lose it twice, and the coach tells you to keep it simple.",
          },
          {
            t: T("Keep it simple"),
            p: (f) => 0.55 + f.skill / 300,
            good: { coach: 4, club: 4, fit: 2, mods: { def: 1 } },
            bad: { coach: -1, hype: -1 },
            gm: "You keep possession, win a tackle and do nothing wrong. The coach notices the maturity.",
            bm: "You play safe and invisible. Nothing goes wrong, nothing goes right.",
          },
          {
            t: T("Try the spectacular"),
            p: (f) => 0.15 + f.skill / 210,
            good: { skill: 3, fame: 5, hype: 8, coach: 2, mods: { atk: 3 } },
            bad: { coach: -6, fame: -1, hap: -2 },
            gm: "You try a rabona cross and it lands on the striker's head. The corner flag scouts are writing.",
            bm: "The rabona does not come off, but the coach likes that you tried. 'Keep that bravery, fix the timing,' he says.",
          },
        ],
      },
      {
        title: T("The captain's test"),
        text: () =>
          "The youth captain is injured and the coach hands you the armband for the derby. The loudest kid in the dressing room says you do not deserve it.",
        choices: [
          {
            t: T("Give a team talk"),
            p: (f) => 0.4 + f.coachRel / 250,
            good: { coach: 6, club: 5, hap: 4, form: 4, mods: { def: 1 } },
            bad: { coach: -3, club: -3, hap: -3 },
            gm: "You speak for thirty seconds and the room goes quiet. They run through a wall for you.",
            bm: "Your speech is not your best, but the room respects that you stood up. It gets better next time.",
          },
          {
            t: T("Lead by example"),
            p: (f) => 0.45 + f.fit / 260,
            good: { coach: 5, club: 6, fit: 3, form: 3 },
            bad: { fit: -3, coach: -2 },
            gm: "You tackle everything and win the derby. The loud kid claps you off the pitch.",
            bm: "You run yourself into the ground and cramp up after an hour. Not the statement you wanted.",
          },
          {
            t: T("Refuse the armband"),
            p: () => 0.95,
            good: { coach: -2, hap: 3, club: 2 },
            bad: { coach: -4 },
            gm: "You say you are not ready. The coach respects it, but gives it to someone else.",
            bm: "You refuse. The coach decides you lack ambition.",
          },
        ],
      },
      {
        title: T("The growth spurt"),
        text: () =>
          "You grow five centimetres in four months. Suddenly your knees ache, your coordination is gone and the ball keeps bouncing off your shins.",
        choices: [
          {
            t: T("Work with the fitness coach"),
            p: () => 0.8,
            good: { fit: 5, skill: 2, coach: 3, hap: 2 },
            bad: { fit: -2, skill: -1 },
            gm: "You spend six weeks on coordination and core work. Your body catches up with your legs.",
            bm: "The exercises do not help much this time. Progress is slow, but the physio adjusts your plan.",
          },
          {
            t: T("Play through it"),
            p: (f) => 0.45 + f.fit / 260,
            good: { fit: 3, skill: 1, coach: 4, form: 2 },
            bad: { injury: 5, fit: -6, hap: -3 },
            gm: "You adapt quickly. By the end of the month the gangly phase is behind you.",
            bm: "You pull a hamstring chasing a ball you used to reach easily. Six weeks out.",
          },
          {
            t: T("Change position"),
            p: () => 0.7,
            good: { skill: 2, coach: 3, hap: 3 },
            bad: { skill: -1, coach: -2 },
            gm: "The coach tries you deeper. The extra height helps and you see the game differently.",
            bm: "The new position does not fit. You spend weeks unsure where to stand.",
          },
        ],
      },
    ],
    league: [
      {
        title: T("89th minute, 1-1"),
        text: (f) =>
          `The ball drops to you in the box in the 89th minute. ${f.club.name} needs a win. The defender is closing, the keeper is off his line.`,
        choices: [
          {
            t: T("Shoot first time"),
            p: (f) => 0.18 + f.skill / 150 + posOf(f).goal * 0.12,
            good: { fame: 5, coach: 7, club: 5, form: 6, mods: { atk: 2 } },
            bad: { coach: -3, hap: -4, form: -3 },
            gm: "You hit it across the keeper and into the bottom corner. The stadium explodes.",
            bm: "You snatch at it and send it into the third tier. The manager turns away.",
          },
          {
            t: T("Square it"),
            p: (f) => 0.4 + f.skill / 260 + posOf(f).assist * 0.1,
            good: { coach: 5, club: 4, fame: 3, form: 4, mods: { atk: 1 } },
            bad: { coach: -2, hap: -3 },
            gm: "You slide it across and your strike partner taps it in. Assist of the season.",
            bm: "The pass is behind everyone and the chance dies. The manager wanted you to shoot.",
          },
          {
            t: T("Hold it up"),
            p: (f) => 0.5 + f.fit / 280,
            good: { coach: 3, fit: 2, form: 2, mods: { def: 1 } },
            bad: { coach: -4, hap: -2 },
            gm: "You hold it, draw the defender and win a corner. From the corner, you score the winner.",
            bm: "You hold it too long and get dispossessed. The whistle goes and the points are gone.",
          },
        ],
      },
      {
        title: T("Derby day"),
        text: () =>
          "It is the derby. The away end has been singing about your family for ninety minutes. A rival midfielder stamps on your ankle off the ball.",
        choices: [
          {
            t: T("Retaliate"),
            p: (f) => 0.25 + f.fame / 300,
            good: { fame: 5, hap: 5, club: 2, mods: { atk: 1 } },
            bad: { coach: -8, club: -5, ban: 2, hap: -2 },
            gm: "You shove him, he swings, and he gets the red card. The crowd loves you.",
            bm: "You swing and connect. Both of you go off. The manager is waiting in the tunnel.",
          },
          {
            t: T("Ignore him and play"),
            p: (f) => 0.5 + f.skill / 260,
            good: { coach: 6, club: 5, form: 5, mods: { atk: 1 } },
            bad: { fit: -2, form: -2 },
            gm: "You say nothing and score the opener. He gets booked trying to kick you again.",
            bm: "You ignore him, but the ankle swells up and you are half a yard off it all game.",
          },
          {
            t: T("Ask the referee to watch him"),
            p: () => 0.7,
            good: { club: 3, coach: 2, hap: 2 },
            bad: { club: -3, hap: -2 },
            gm: "The referee warns him. He spends the rest of the game on a yellow card and disappears.",
            bm: "The referee tells you to stop complaining. The treatment continues.",
          },
        ],
      },
      {
        title: T("The open goal"),
        text: () =>
          "The keeper is stranded. The goal is empty. Your teammate is screaming for a square ball, but you are the one with the angle.",
        choices: [
          {
            t: T("Shoot from distance"),
            p: (f) => 0.32 + f.skill / 190,
            good: { fame: 6, skill: 2, form: 5, mods: { atk: 2 } },
            bad: { coach: -5, hap: -4, club: -2 },
            gm: "You shoot from thirty yards and it dips under the bar. Goal of the month.",
            bm: "You shoot, it hits the post, and the rebound goes wide. The teammate is furious.",
          },
          {
            t: T("Square it"),
            p: (f) => 0.62 + posOf(f).assist * 0.1,
            good: { coach: 5, club: 6, fame: 2, mods: { atk: 1 } },
            bad: { coach: -3, club: -2 },
            gm: "You square it and your teammate rolls it in. The team goal is the highlight of the week.",
            bm: "The pass is too heavy and the defender clears it off the line.",
          },
          {
            t: T("Take it around the keeper"),
            p: (f) => 0.2 + f.skill / 170 + posOf(f).goal * 0.08,
            good: { fame: 8, skill: 3, coach: 4, mods: { atk: 3 } },
            bad: { fame: -3, coach: -4, hap: -5 },
            gm: "You go around him and walk it in. The stadium cannot believe it.",
            bm: "The keeper reads it and takes the ball off your toe. It was a bold try.",
          },
        ],
      },
      {
        title: T("Half-time, 2-0 down"),
        text: () =>
          "The manager is out of ideas and the dressing room is silent. The captain looks at you. Someone has to say something.",
        choices: [
          {
            t: T("Give the team talk"),
            p: (f) => 0.38 + f.coachRel / 240 + f.fame / 400,
            good: { coach: 6, club: 6, form: 5, hap: 3, mods: { atk: 1, def: 1 } },
            bad: { coach: -4, club: -3, hap: -2 },
            gm: "You tell them to play without fear. The team comes out flying and wins 3-2.",
            bm: "Your speech is met with blank stares. The second half is worse than the first.",
          },
          {
            t: T("Take responsibility yourself"),
            p: (f) => 0.4 + f.skill / 220,
            good: { skill: 2, fame: 3, form: 4, mods: { atk: 2 } },
            bad: { form: -4, coach: -2 },
            gm: "You demand the ball and drag the team back into it. Two goals and a point.",
            bm: "You try to do it alone and lose the ball every time. The manager hooks you.",
          },
          {
            t: T("Let the captain handle it"),
            p: () => 0.6,
            good: { coach: 2, hap: 1, club: 1 },
            bad: { club: -2, coach: -2 },
            gm: "The captain gives the speech. You chip in with one sentence and it lands.",
            bm: "Nobody says anything. The team comes out flat and loses 4-0.",
          },
        ],
      },
      {
        title: T("The relegation six-pointer"),
        text: (f) =>
          `${f.club.name} is one point above the drop. The opponents are fighting for the same thing. The pitch is a swamp.`,
        choices: [
          {
            t: T("Battle for everything"),
            p: (f) => 0.42 + f.fit / 250,
            good: { fit: 2, coach: 6, club: 6, form: 4, mods: { def: 2 } },
            bad: { fit: -6, injury: 3, coach: -2 },
            gm: "You win every second ball. It is ugly, and it is exactly what the club needed.",
            bm: "You put your body in and come off limping. The match ends in a draw.",
          },
          {
            t: T("Play your football"),
            p: (f) => 0.35 + f.skill / 200,
            good: { skill: 2, coach: 4, fame: 3, mods: { atk: 1 } },
            bad: { coach: -6, club: -4, hap: -3 },
            gm: "You keep the ball on the floor and score a goal that deserves a better pitch.",
            bm: "You try to play out and lose it for their winner. The fans let you know.",
          },
          {
            t: T("Time-waste from minute one"),
            p: () => 0.5,
            good: { club: 5, coach: 3, hap: 1 },
            bad: { fame: -2, coach: -3, ban: 1 },
            gm: "You take every throw slowly and kill the game. Horrible to watch, vital point.",
            bm: "You get booked for time-wasting after ten minutes and have to play the rest on eggshells.",
          },
        ],
      },
    ],
    cup: [
      {
        title: T("The cup final penalty"),
        text: () =>
          "It is 1-1 in the cup final and the referee points to the spot in the 94th minute. The captain is on the floor with cramp. The ball is yours if you want it.",
        choices: [
          {
            t: T("Take it"), pen: true,
            p: (f) => 0.5 + f.skill / 250 + f.form / 400,
            good: { fame: 12, skill: 3, hap: 8, coach: 8, mods: { atk: 2 } },
            bad: { fame: -8, hap: -10, form: -6 },
            gm: "You send the keeper the wrong way and win the cup. The picture will hang in the club museum.",
            bm: "You put it wide. The cup goes to the other dressing room and it hurts, but your teammates pick you up.",
          },
          {
            t: T("Give it to the striker"),
            p: (f) => 0.72 + posOf(f).goal * 0.05,
            good: { club: 6, coach: 4, hap: 4, mods: { atk: 1 } },
            bad: { coach: -4, hap: -6 },
            gm: "The striker buries it. You made the right call and the team wins the cup.",
            bm: "The striker misses. Everyone wonders why you did not take it.",
          },
          {
            t: T("Panenka"), pen: true, panenka: true,
            p: (f) => 0.12 + f.skill / 220 + f.fame / 250,
            good: { fame: 18, hap: 10, skill: 2, coach: 5 },
            bad: { fame: -12, hap: -12, coach: -8 },
            gm: "You chip it down the middle. The keeper dives. The cup is yours and the clip breaks the internet.",
            bm: "The keeper stays up and catches it. A tough miss, and the dressing room tells you to shake it off.",
          },
        ],
      },
      {
        title: T("Giant-killing"),
        text: () =>
          "A fourth-tier team is holding you to 0-0 in the cup. Their keeper is having the game of his life. Their fans are singing about it.",
        choices: [
          {
            t: T("Keep knocking"),
            p: (f) => 0.42 + f.skill / 260 + f.fit / 500,
            good: { skill: 1, coach: 4, form: 3, mods: { atk: 1 } },
            bad: { coach: -3, form: -2 },
            gm: "You keep going and finally bundle one in. Professional job, no drama.",
            bm: "You knock and knock and it never opens. Extra time and penalties.",
          },
          {
            t: T("Try to win it alone"),
            p: (f) => 0.22 + f.skill / 180,
            good: { fame: 5, skill: 2, hype: 6, mods: { atk: 2 } },
            bad: { coach: -6, club: -4 },
            gm: "You beat four players and score. The fourth-tier keeper is still applauded off.",
            bm: "Nothing falls for you today and the attacks fizzle out. The manager wants you to pick your moments.",
          },
          {
            t: T("Win a penalty"),
            p: (f) => 0.3 + f.fame / 300,
            good: { coach: 3, club: 3, form: 2 },
            bad: { fame: -3, coach: -2 },
            gm: "You draw the foul, win the penalty and the tie is won from the spot.",
            bm: "The referee waves play on and books you for diving. The giant-killing is on.",
          },
        ],
      },
      {
        title: T("Semi-final nerves"),
        text: () =>
          "The semi-final is at your own stadium and the dressing room is tense. The manager asks who wants to take the first penalty if it goes to a shootout.",
        choices: [
          {
            t: T("Put your hand up first"), pen: true,
            p: (f) => 0.55 + f.skill / 240 + f.fame / 400,
            good: { coach: 6, fame: 4, hap: 4, mods: { atk: 1 } },
            bad: { fame: -5, hap: -5, coach: -3 },
            gm: "You take the first penalty and bury it. The shootout is won and the final is booked.",
            bm: "You take the first and miss. The team loses the shootout, and your teammates hug you anyway.",
          },
          {
            t: T("Take the fifth"), pen: true,
            p: (f) => 0.6 + f.skill / 260,
            good: { fame: 5, coach: 4, hap: 4 },
            bad: { fame: -4, hap: -4 },
            gm: "It goes to five and you score the winner. Ice in your veins.",
            bm: "It never reaches you. The fourth penalty is missed and the tie is over.",
          },
          {
            t: T("Stay out of it"),
            p: () => 0.8,
            good: { hap: 2, fit: 1 },
            bad: { coach: -3, club: -2 },
            gm: "The shootout is won without you. You dance with everyone else.",
            bm: "The team loses and the manager remembers who did not volunteer.",
          },
        ],
      },
    ],
    continental: [
      {
        title: T("European night"),
        text: (f) =>
          `The anthem plays, the lights go down, and the away side is a European giant. ${f.club.name} has never gone further than this.`,
        choices: [
          {
            t: T("Attack them from the start"),
            p: (f) => 0.28 + f.skill / 170 + posOf(f).goal * 0.08,
            good: { fame: 8, skill: 3, coach: 6, form: 5, mods: { atk: 2 } },
            bad: { coach: -5, club: -4, form: -4 },
            gm: "You press them high, score in the first ten minutes and the stadium turns into a wall of noise.",
            bm: "They pick you apart on the counter. Three goals before half-time.",
          },
          {
            t: T("Stay compact and counter"),
            p: (f) => 0.42 + f.skill / 230 + f.fit / 400,
            good: { coach: 7, club: 6, fit: 2, mods: { def: 1 } },
            bad: { coach: -3, hap: -2 },
            gm: "You defend as a unit and nick it late. The giant leaves in silence.",
            bm: "You defend for ninety minutes and concede in the last minute. So close.",
          },
          {
            t: T("Target their weakest defender"),
            p: (f) => 0.36 + f.skill / 210,
            good: { skill: 2, coach: 5, fame: 4, mods: { atk: 1 } },
            bad: { coach: -4, fame: -2 },
            gm: "You run at the rookie full-back all night and he is substituted at half-time.",
            bm: "Their full-back reads everything and you end up on the wing, anonymous.",
          },
        ],
      },
      {
        title: T("Away goals, 2-0 down"),
        text: () =>
          "The second leg is away from home and you are 2-0 down from the first. The manager tells you to score first or forget it.",
        choices: [
          {
            t: T("Shoot on sight"),
            p: (f) => 0.32 + f.skill / 190,
            good: { fame: 6, coach: 6, form: 4, mods: { atk: 2 } },
            bad: { coach: -4, hap: -4 },
            gm: "You shoot from everywhere and one goes in. The comeback is on.",
            bm: "Your long shots do not drop and the tie slips away by half-time. Lesson learned.",
          },
          {
            t: T("Feed the striker"),
            p: (f) => 0.48 + posOf(f).assist * 0.12 + f.skill / 300,
            good: { coach: 5, club: 4, fame: 3, mods: { atk: 1 } },
            bad: { coach: -2, club: -2 },
            gm: "You set up two and the tie turns. The captain says you played like a veteran.",
            bm: "Your final ball keeps letting you down. The striker gets nothing.",
          },
          {
            t: T("Win the midfield first"),
            p: (f) => 0.5 + f.fit / 260,
            good: { coach: 3, fit: 2, mods: { def: 2 } },
            bad: { coach: -3, form: -2 },
            gm: "You win the middle and the game settles. The goals come from the pressure you built.",
            bm: "You play safe and need three goals in twenty minutes. It does not happen.",
          },
        ],
      },
      {
        title: T("The continental final"),
        text: () =>
          "It is the final. The score is level. Extra time is coming. The manager asks who is fit enough to take a penalty.",
        choices: [
          {
            t: T("Take the fifth"), pen: true,
            p: (f) => 0.58 + f.skill / 260,
            good: { fame: 14, hap: 10, coach: 8, skill: 2 },
            bad: { fame: -8, hap: -10 },
            gm: "You take the fifth and score. The continental trophy is in your hands and the confetti is stuck to your hair.",
            bm: "You miss the fifth. The trophy is handed to the other captain.",
          },
          {
            t: T("Take the first"),
            p: (f) => 0.6 + f.skill / 300,
            good: { coach: 5, fame: 6, hap: 5 },
            bad: { fame: -4, hap: -5 },
            gm: "You take the first and set the tone. The team is perfect from the spot.",
            bm: "You miss the first. The team chases the shootout from the start and loses.",
          },
          {
            t: T("Let the captain decide"),
            p: () => 0.7,
            good: { club: 3, coach: 2, hap: 3 },
            bad: { coach: -2, hap: -2 },
            gm: "The captain picks the takers and it works. You are the first to hug the keeper.",
            bm: "The captain picks badly. The shootout is lost and the dressing room is silent.",
          },
        ],
      },
    ],
    national: [
      {
        title: T("National debut"),
        text: () =>
          "You are on the bench for your national debut. Twenty minutes to go, the score is level, and the manager turns to you.",
        choices: [
          {
            t: T("Play safe"),
            p: (f) => 0.58 + f.fit / 300,
            good: { fame: 4, caps: 1, coach: 3, hap: 5 },
            bad: { fame: -1, caps: 1, hap: 2 },
            gm: "You keep the ball, win a free kick and help see the game out. The manager trusts you.",
            bm: "You do nothing wrong and nothing special. A cap is a cap.",
          },
          {
            t: T("Take the game on"),
            p: (f) => 0.3 + f.skill / 180 + f.fame / 400,
            good: { fame: 9, caps: 1, skill: 2, hap: 8, mods: { atk: 1 } },
            bad: { fame: -3, caps: 1, hap: -2, coach: -2 },
            gm: "You run at them, win the penalty and score the winner. Your family is crying in the stand.",
            bm: "You try to win it alone and lose the ball. The manager calls you back to the bench.",
          },
          {
            t: T("Shoot from distance"),
            p: (f) => 0.14 + f.skill / 190,
            good: { fame: 14, caps: 1, hap: 10, skill: 3 },
            bad: { caps: 1, fame: -2, hap: -3 },
            gm: "You shoot from thirty-five yards and it flies in. Your first touch in international football.",
            bm: "You shoot from thirty-five yards and it lands in the car park.",
          },
        ],
      },
      {
        title: T("The national manager's plan"),
        text: () =>
          "The national manager wants you to play a role you have never played before. He says it is for the team. Your club manager disagrees.",
        choices: [
          {
            t: T("Do what your country asks"),
            p: (f) => 0.5 + f.skill / 260,
            good: { coach: 6, caps: 2, fame: 4, skill: 2 },
            bad: { coach: -2, caps: 1, hap: -2 },
            gm: "You adapt and the national team wins. The country notices you.",
            bm: "You look lost in the new role. The national manager subs you at half-time.",
          },
          {
            t: T("Call your club manager"),
            p: (f) => 0.55 + f.club / 300,
            good: { club: 6, coach: 4, hap: 3, caps: 1 },
            bad: { caps: 1, coach: -4, club: -3 },
            gm: "Your club manager backs you. The national manager agrees to a compromise.",
            bm: "The two managers argue publicly. You are caught in the middle and play badly.",
          },
          {
            t: T("Ask to play your real position"),
            p: (f) => 0.35 + f.coachRel / 260,
            good: { coach: 4, fame: 3, caps: 2, skill: 1 },
            bad: { coach: -5, caps: 1, fame: -2 },
            gm: "The national manager listens and plays you where you belong. You reward him with a goal.",
            bm: "He tells you the national team is not a place for preferences. You sit out.",
          },
        ],
      },
      {
        title: T("World Cup knockout"),
        text: () =>
          "It is the World Cup quarter-final. The country is watching. The game is going to extra time and your legs are gone.",
        choices: [
          {
            t: T("Keep going"),
            p: (f) => 0.4 + f.fit / 260 + f.skill / 400,
            good: { fame: 10, caps: 1, hap: 7, mods: { atk: 1 } },
            bad: { fit: -8, injury: 4, caps: 1, hap: -4 },
            gm: "You find a second wind and score in extra time. The country is in the semi-final.",
            bm: "Your legs give out. You come off and watch the penalties from the touchline.",
          },
          {
            t: T("Make way for fresh legs"),
            p: () => 0.72,
            good: { club: 3, hap: 2, caps: 1 },
            bad: { coach: -3, hap: -3, caps: 1 },
            gm: "The substitute scores the winner. The manager calls it the right decision.",
            bm: "The substitute misses the decisive penalty. You are left wondering.",
          },
          {
            t: T("Take the last penalty"), pen: true,
            p: (f) => 0.55 + f.skill / 240,
            good: { fame: 16, hap: 12, caps: 1, skill: 2 },
            bad: { fame: -12, hap: -14, caps: 1 },
            gm: "You take the last penalty and send your country to the semi-final.",
            bm: "You take the last penalty and miss. The silence at home is worse than the stadium.",
          },
        ],
      },
      {
        title: T("The flag incident"),
        text: () =>
          "A politician uses your face in a campaign without asking. Half the country loves it, half is furious, and the federation says nothing.",
        choices: [
          {
            t: T("Ask them to stop"),
            p: () => 0.7,
            good: { hap: 4, fame: 3, club: 2 },
            bad: { hap: -3, fame: -2 },
            gm: "You release a calm statement and the campaign pulls the advert.",
            bm: "The campaign ignores you and doubles down. The story runs for weeks.",
          },
          {
            t: T("Stay out of politics"),
            p: () => 0.85,
            good: { club: 3, hap: 3 },
            bad: { fame: -2, hap: -2 },
            gm: "You say nothing. The story dies and you keep everyone happy.",
            bm: "Your silence is read as support. Some fans never forgive it.",
          },
          {
            t: T("Use it to campaign for something"),
            p: (f) => 0.45 + f.fame / 250,
            good: { fame: 8, hap: 5, club: 2 },
            bad: { fame: -6, club: -5, hap: -4 },
            gm: "You turn it into a campaign for youth sport. The country rallies behind you.",
            bm: "It backfires. You are accused of playing politics and the federation is unhappy.",
          },
        ],
      },
    ],
  };

  const momentUsed = (f, id) => {
    if (!Array.isArray(f.momentsUsed)) f.momentsUsed = [];
    return f.momentsUsed.includes(id);
  };

  function pickMoment(area, f) {
    const pool = (MOMENTS[area] || []).filter((m) => !momentUsed(f, m.title));
    const m = pool.length ? pick(pool) : pick(MOMENTS[area] || MOMENTS.league);
    if (!Array.isArray(f.momentsUsed)) f.momentsUsed = [];
    f.momentsUsed.push(m.title);
    return m;
  }

  function momentStep(area, f) {
    return (next) => {
      const m = pickMoment(area, f);
      if (!m) return next();
      card({
        iconSrc: (f.club && f.club.logo) || ICON,
        title: m.title,
        lead: `${typeof m.text === "function" ? m.text(f) : m.text}<br><br>${T("What do you do?")}`,
        rows: [
          [T("Club"), f.club ? f.club.name : "—"],
          [T("Competition"), area === "youth" ? T("Academy match") : area === "national" ? T("International") : area === "cup" ? T("Cup tie") : area === "continental" ? f.club.continental : T("League match")],
        ],
        bars: [
          [T("Skill"), f.skill],
          [T("Fitness"), f.fit],
        ],
        choices: m.choices.map((ch) => [
          ch.t,
          () => {
            const p = clampN(ch.p(f) + 0.14 + (f.mods && f.mods.luck ? f.mods.luck * 0.01 : 0), 0.3, 0.95); // [mod] +14%, never below 30%
            const resolve = (good) => {
            if (window.FL_SND) FL_SND.result(good);
            const eff = good ? ch.good : ch.bad;
            const rows = applyEffects(f, eff);
            const msg = good ? ch.gm : ch.bm;
            if (eff.mods) {
              if (!f.mods) f.mods = { atk: 0, def: 0, luck: 0 };
              f.mods.atk += eff.mods.atk || 0;
              f.mods.def += eff.mods.def || 0;
              f.mods.luck += eff.mods.luck || 0;
              rows.push([T("Season momentum"), `${(eff.mods.atk || 0) + (eff.mods.def || 0) > 0 ? "+" : ""}${(eff.mods.atk || 0) + (eff.mods.def || 0)}`]);
            }
            f.highlights.push(msg);
            sayIt(msg ? firstPerson(msg) : good ? `${m.title}: ${T("it worked.")}` : `${m.title}: ${T("it did not work.")}`);
            card({
              iconSrc: good ? E("1f525") : E("1f4c9"),
              title: good ? T("It comes off") : T("Not this time"),
              lead: msg,
              rows,
              ok: next,
            });
            };
            // [mod] when the choice is a penalty, you take it yourself
            if (ch.pen && window.FL_PEN) {
              FL_PEN.kick({
                ...penaltyBase(f, f.club && f.club.name), title: m.title, subtitle: ch.panenka ? T("Panenka: the keeper may dive, aim down the middle") : T("The whole stadium is watching"),
                pressure: 0.85, keeper: clampN(0.45 + (f.club ? (f.club.rep - 60) / 200 : 0), 0.3, 0.75), panenka: !!ch.panenka,
                onDone: (r) => resolve(!!r.goal),
              });
            } else resolve(rnd() < p);
          },
        ]),
      });
    };
  }

  // ------------------------------------------------------------------ training
  // ------------------------------------------------------------------ weekly training blocks
  // A season is 3-4 blocks of weeks. Each block: pick a focus; intensity comes from
  // the season plan (Light / Normal / Hard). Hard work grows attributes faster but
  // piles up fatigue; high fatigue hurts form/fitness and raises injury risk.
  const INTENSITY = {
    light: { n: "Light", mult: 0.6, fat: 6, inj: 0.02, fit: 1, note: "Safe and steady. Slow progress." },
    normal: { n: "Normal", mult: 1, fat: 14, inj: 0.05, fit: 0, note: "Balanced work." },
    hard: { n: "Hard", mult: 1.5, fat: 26, inj: 0.11, fit: -2, note: "Fast progress, heavy fatigue, injury risk." },
  };
  const LINKED = {
    shooting: "vision", passing: "vision", pace: "physical", physical: "pace", dribbling: "touch",
    defending: "physical", reaction: "pace", touch: "dribbling", vision: "passing",
  };
  const BLOCKS = {
    pre: { n: "Pre-season", weeks: "Weeks 1-6", story: ["Two-a-days in the heat. Everyone is chasing a shirt.", "The new season starts in the gym, not on the pitch.", "Friendlies, running drills and early mornings."] },
    early: { n: "Early season", weeks: "Weeks 7-18", story: ["The league is on. Training squeezes in between matches.", "Midweek sessions after the first matches.", "The rhythm of the season sets in."] },
    mid: { n: "Mid-season", weeks: "Weeks 19-30", story: ["Winter. Fixtures pile up and legs get heavy.", "Cold mornings, packed calendar.", "The cups take over the schedule."] },
    run: { n: "Run-in", weeks: "Weeks 31-42", story: ["Everything is decided now. Every session counts.", "The final stretch of the season.", "Titles and relegations are settled in these weeks."] },
  };
  const fatigueLabel = (v) => (v >= 80 ? T("Exhausted") : v >= 60 ? T("Tired") : v >= 35 ? T("Fine") : T("Fresh"));
  const roundP = (x) => Math.floor(x) + (rnd() < x - Math.floor(x) ? 1 : 0);

  function weekBlockStep(f, key, optional) {
    const blk = BLOCKS[key];
    return (next) => {
      const show = () => {
        const age = state.age;
        const inten = INTENSITY[f.plan] || INTENSITY.normal;
        const youthBoost = f.youth ? 1.35 : 1;
        const ageFx = age < 24 ? 1.2 : age > 30 ? 0.55 : 1;
        const choices = TRAININGS.map((tr) => [
          tr.n,
          () => {
            const rows = [];
            if (tr.id === "recovery") {
              f.fatigue = clampN(f.fatigue - 30, 0, 100);
              applyEffects(f, { fit: ri(3, 6), form: ri(2, 4), hap: 1, coach: f.pro ? -1 : 0 }, rows);
              sayIt(`I took ${blk.weeks.toLowerCase()} to recover.`);
            } else {
              const risk = inten.inj + Math.max(0, f.fatigue - 55) / 250 - (f.fit - 60) / 600;
              const hurt = rnd() < Math.max(0.005, risk);
              if (hurt) {
                const weeks = ri(3, 14) + (f.fatigue > 75 ? 3 : 0);
                applyEffects(f, { injury: weeks, fit: -4, form: -3 }, rows);
                f.fatigue = clampN(f.fatigue + 8, 0, 100);
                sayIt(`I got hurt during ${blk.n.toLowerCase()} training.`);
              } else {
                const room = clampN((f.potential - f.attrs[tr.id]) / 22, 0.4, 1.3); // [mod] was 0.15..1.25 /25
                const coach = 1 + (f.coachRel - 50) / 200;
                const tired = f.fatigue >= 70 ? 0.6 : 1;
                const base = ri(2, 4) * 0.5 * inten.mult * youthBoost * ageFx * room * coach * tired; // [mod] about 2x faster
                let gain = roundP(base);
                if (!gain && inten.mult >= 1 && f.fatigue < 70 && rnd() < 0.5) gain = 1; // a normal block almost always moves something
                const attrs = {};
                if (gain) attrs[tr.id] = gain;
                if (LINKED[tr.id] && rnd() < 0.15 * inten.mult) attrs[LINKED[tr.id]] = 1;
                applyEffects(f, { attrs, fit: inten.fit, form: f.fatigue < 60 ? 2 : 0 }, rows);
                if (!gain) rows.push([T("Progress"), T("Nothing this block")]);
                f.fatigue = clampN(f.fatigue + inten.fat, 0, 100);
                sayIt(`I trained ${tr.n.toLowerCase()} in ${blk.n.toLowerCase()}.`);
              }
              if (f.fatigue >= 80) applyEffects(f, { form: -4, fit: -3 }, rows);
              else if (f.fatigue >= 65) applyEffects(f, { form: -2 }, rows);
            }
            f.lastTraining = tr.id;
            card({
              iconSrc: tr.ico,
              title: `${blk.n}: ${tr.n}`,
              lead: pick(blk.story),
              rows: [[T("Weeks"), T(blk.weeks)], [T("Intensity"), T(inten.n)], [T("Fatigue"), `${Math.round(f.fatigue)}% (${fatigueLabel(f.fatigue)})`], ...rows],
              bars: ATTRS.map((a) => [a.n, Math.round(f.attrs[a.id])]),
              ok: next,
            });
          },
        ]);
        choices.push([
          `${T("Intensity")}: ${T(inten.n)} - ${T("change")}`,
          () => {
            f.plan = f.plan === "light" ? "normal" : f.plan === "normal" ? "hard" : "light";
            show();
          },
        ]);
        if (optional) choices.push([T("Not now"), () => openFutbol()]);
        card({
          tag: CAREER,
          iconSrc: E("1f4aa"),
          title: `${T(blk.n)} · ${T(blk.weeks)}`,
          lead: `${T(inten.note)} ${f.fatigue >= 70 ? T("Your body is screaming for rest.") : ""}`.trim(),
          rows: [
            [T("Age"), String(age)],
            [T("Potential"), f.potential >= 90 ? T("Extraordinary") : f.potential >= 80 ? T("High") : T("Solid")],
            [T("Overall"), `${Math.round(f.skill)}%`],
            [T("Fitness"), `${Math.round(f.fit)}%`],
            [T("Fatigue"), `${Math.round(f.fatigue)}% (${fatigueLabel(f.fatigue)})`],
            [T("Intensity"), T(inten.n)],
          ],
          bars: ATTRS.map((a) => [a.n, Math.round(f.attrs[a.id])]),
          choices,
        });
      };
      show();
    };
  }

  // ------------------------------------------------------------------ scouting
  function scoutAppeal(f) {
    return f.skill * 0.65 + (Number(f.fame) || 0) * 0.2 + (Number(f.hype) || 0) * 0.15 + (f.gifted ? 6 : 0);
  }
  function scoutOffers(f) {
    const home = findLeagueOfClub(f.club) || LEAGUES[0];
    const top = home.clubs.slice().sort((a, b) => b.rep - a.rep);
    const elite = top[0] || home.clubs[0];
    const mid = top.find((c) => c.rep <= home.rep - 2 && c.rep >= 62) || top[Math.min(4, top.length - 1)];
    const div2 = secondDivisionOf(home).sort((a, b) => b.rep - a.rep)[0];
    const foreignLeague = pick(LEAGUES.filter((l) => l.id !== home.id).sort((a, b) => b.rep - a.rep).slice(0, 6));
    const foreign = foreignLeague && pick(foreignLeague.clubs.filter((c) => c.rep <= foreignLeague.rep + 2) || foreignLeague.clubs);

    const offers = [];
    const pushOffer = (l, c, division, tag) => {
      if (!l || !c) return;
      const club = clubRef(l, c, division);
      if (offers.some((o) => clubKey(o.club) === clubKey(club))) return;
      offers.push({ club, tag });
    };
    // [mod] the better you are at school, the more clubs call and the bigger they are
    const appeal = scoutAppeal(f);
    const foreignTop = pick(LEAGUES.filter((l) => l.id !== home.id).sort((a, b) => b.rep - a.rep).slice(0, 4));
    const topForeign = foreignTop && foreignTop.clubs.slice().sort((a, b) => b.rep - a.rep)[pick([0, 1, 2])];
    if (appeal >= 85) {
      top.slice(0, 3).forEach((c) => pushOffer(home, c, 1, T("Elite academy")));
      pushOffer(foreignTop, topForeign, 1, T("Foreign elite academy"));
    } else if (appeal >= 72) {
      pushOffer(home, pick(top.slice(0, 4)), 1, T("First division academy"));
      pushOffer(home, mid, 1, T("First division academy"));
      pushOffer(foreignLeague, foreign, 1, T("Foreign academy"));
    } else if (appeal >= 55) {
      pushOffer(home, mid, 1, T("First division academy"));
      pushOffer(home, div2, 2, T("Second division academy"));
      pushOffer(foreignLeague, foreign, 1, T("Foreign academy"));
    } else {
      pushOffer(home, div2, 2, T("Second division academy"));
    }
    while (offers.length < (appeal >= 55 ? 2 : 1)) {
      const lo = appeal >= 55 ? 55 : 35;
      const c = randomClubs(1, { min: lo, max: appeal >= 55 ? 78 : 62, exclude: f.club ? [clubKey(f.club)] : [] })[0];
      if (!c) break;
      const l2 = findLeagueOfClub(c);
      pushOffer(l2, { id: c.id, name: c.name, rep: c.rep, logo: c.logo }, c.division, T("Academy offer"));
    }
    return offers;
  }

  function scoutStep(f) {
    return (next) => {
      const offers = scoutOffers(f);
      const rows = offers.map((o, i) => [
        `${String.fromCharCode(65 + i)}. ${o.club.name}`,
        `${o.tag} · ${T("Reputation")} ${o.club.rep}`,
      ]);
      const choices = offers.map((o) => [
        T("Sign for") + ` ${o.club.name}`,
        () => {
          // [mod] a trial, not a gift: the bigger the club, the harder it is to be chosen
          const pTrial = clampN(0.5 + (f.skill - (o.club.rep - 15)) / 120 + (f.gifted ? 0.1 : 0), 0.3, 0.95);
          if (rnd() > pTrial) {
            f.scouted = false;
            f.waitAcademy = (f.waitAcademy || 0) + 1;
            applyEffects(f, { hap: -3, skill: 1 });
            sayIt(`I failed my trial at ${o.club.name}.`);
            return card({
              iconSrc: o.club.logo,
              title: T("Trial failed"),
              lead: `${o.club.name} ${T("watched you for three days and decided to pass. The scouts will be back if you keep improving.")}`,
              rows: [[T("Chance you had"), `${Math.round(pTrial * 100)}%`], [T("Next chance"), String(year() + 1)]],
              ok: next,
            });
          }
          f.club = o.club;
          f.youth = true;
          f.pro = false;
          f.academy = true;
          f.academyYear = year();
          f.scouted = true;
          f.skill = clampN(f.skill + 3, 1, 99);
          f.fame = clampN(f.fame + 4, 0, 100);
          f.coachRel = 55;
          f.clubRel = 55;
          f.hype = clampN(f.hype + 10, 0, 100);
          syncJob(f);
          sayIt(`I signed for the ${o.club.name} academy.`);
          playSnd("achievement");
          card({
            iconSrc: o.club.logo,
            title: T("Academy signed"),
            lead: `You are now a ${o.club.name} academy player. The first team is a long way up, but the door is open.`,
            rows: [
              [T("Club"), o.club.name],
              [T("Division"), o.club.division === 2 ? T("Second division") : T("First division")],
              [T("Reputation"), String(o.club.rep)],
              [T("Coach"), `${Math.round(f.coachRel)}%`],
            ],
            ok: next,
          });
        },
      ]);
      choices.push([
        T("Wait for a bigger club or university"),
        () => {
          f.scouted = false;
          f.waitAcademy = (f.waitAcademy || 0) + 1;
          applyEffects(f, { skill: 2, fame: 2, hap: 2 });
          sayIt("I turned down the academy offers to wait for a bigger opportunity.");
          card({
            iconSrc: E("1f393"),
            title: T("You wait"),
            lead: T("You stay where you are. The scouts will come back, but only if you keep improving."),
            rows: [
              [T("Academy offers refused"), String(f.waitAcademy)],
              [T("Next chance"), String(year() + 1)],
            ],
            ok: next,
          });
        },
      ]);
      card({
        iconSrc: E("1f440"),
        title: T("Scouts at the school gate"),
        lead: T(
          scoutAppeal(f) >= 72 ? "Your name is on every academy list. The big clubs want to sign you before someone else does. This is the meeting that decides your life." : "Your name is on the academy lists. A club wants to sign you before someone else does. This is the meeting that decides your life.",
        ),
        rows: [[T("Your level"), `${Math.round(f.skill)}%`], ...rows],
        choices,
      });
    };
  }

  // ------------------------------------------------------------------ promotion
  function youthScore(f) {
    if (f.lastYouth && Number.isFinite(f.lastYouth.score)) return f.lastYouth.score;
    return clampN(f.skill * 0.55 + f.fit * 0.2 + f.form * 0.15 + f.coachRel * 0.1 + ri(0, 10), 0, 100);
  }

  function promotionStep(f) {
    return (next) => {
      const age = state.age;
      const score = youthScore(f);
      const need = 58 + (f.club ? f.club.rep : 60) * 0.12 - f.coachRel * 0.08;
      const ready = score >= need || f.skill >= (f.club ? f.club.rep - 3 : 60);
      if (!ready && age < 21) {
        card({
          iconSrc: (f.club && f.club.logo) || ICON,
          title: T("Not yet"),
          lead: T("The coach says you are close, but close does not get you a first-team shirt. Another year in the youth team."),
          rows: [
            [T("Youth score"), `${Math.round(score)}%`],
            [T("Needed"), `${Math.round(need)}%`],
            [T("Advice"), T("Train, stay fit and keep your head down.")],
          ],
          ok: next,
        });
        return;
      }
      if (!ready && age >= 21) {
        const curLeague = findLeagueOfClub(f.club);
        const curRep = curLeague ? curLeague.rep : 75;
        const lowerLeagues = LEAGUES.filter((l) => l.rep <= curRep).sort((a, b) => b.rep - a.rep);
        const l2 = lowerLeagues[0] || LEAGUES[LEAGUES.length - 1];
        const club = clubRef(l2, pick(l2.clubs.slice(-Math.max(4, Math.floor(l2.clubs.length / 2)))), 1);
        card({
          iconSrc: E("1f4c9"),
          title: T("Released"),
          lead: `${f.club ? f.club.name : T("The academy")} will not offer you a professional contract. Your agent finds a trial at ${club.name}.`,
          rows: [
            [T("Youth score"), `${Math.round(score)}%`],
            [T("Offer"), `${club.name} · ${T("Reputation")} ${club.rep}`],
          ],
          choices: [
            [
              T("Take the trial"),
              () => {
                f.club = club;
                f.youth = false;
                f.pro = true;
                f.academy = false;
                f.wage = Math.round(wageFor(club, f.skill, f.fame) * 0.45);
                f.contract = { wage: f.wage, years: 1, release: f.wage * 4 };
                f.coachRel = 50;
                f.clubRel = 50;
                syncJob(f);
                sayIt(`I signed a one-year deal with ${club.name} after being released.`);
                card({
                  iconSrc: club.logo,
                  title: T("Professional at last"),
                  lead: `It is not the fairytale, but it is a contract. ${club.name} believes in you enough to give you a year.`,
                  rows: [
                    [T("Club"), club.name],
                    [T("Wage"), `${money(f.wage)}/${T("yr")}`],
                    [T("Contract"), `1 ${T("year")}`],
                  ],
                  ok: next,
                });
              },
            ],
            [
              T("Try a trial abroad"),
              () => {
                const abroad = randomClubs(1, { min: 45, max: 68, exclude: f.club ? [clubKey(f.club)] : [] })[0] || club;
                f.club = abroad;
                f.youth = false;
                f.pro = true;
                f.academy = false;
                f.wage = Math.round(wageFor(abroad, f.skill, f.fame) * 0.4);
                f.contract = { wage: f.wage, years: 1, release: f.wage * 4 };
                syncJob(f);
                sayIt(`I moved abroad to start my career at ${abroad.name}.`);
                card({
                  iconSrc: abroad.logo,
                  title: T("New country"),
                  lead: `You pack one suitcase and sign for ${abroad.name}. Nobody here knows your name yet.`,
                  rows: [[T("Club"), abroad.name], [T("Wage"), `${money(f.wage)}/${T("yr")}`]],
                  ok: next,
                });
              },
            ],
            [
              T("Quit football"),
              () => {
                f.active = false;
                f.retired = true;
                clearFootballJob();
                sayIt("I walked away from football.");
                noticeIt(T("The dream ends"), T("You leave football behind and start again."), null, true);
                next();
              },
            ],
          ],
        });
        return;
      }

      const wage = Math.max(45000, Math.round(wageFor(f.club, f.skill, f.fame) * (f.youth ? 0.55 : 1)));
      const loanClub = randomClubs(1, { min: 48, max: Math.max(55, f.club.rep - 8), division: 2 })[0];
      card({
        iconSrc: (f.club && f.club.logo) || ICON,
        title: T("First-team offer"),
        lead: `${f.club.name} wants to promote you to the first team. Your agent has the paperwork. Your body has opinions.`,
        rows: [
          [T("Youth score"), `${Math.round(score)}%`],
          [T("Offer"), `${money(wage)}/${T("yr")}`],
          [T("Contract"), `3 ${T("years")}`],
          [T("Position"), posName(f)],
        ],
        choices: [
          [
            T("Sign the first-team contract"),
            () => {
              f.youth = false;
              f.pro = true;
              f.academy = false;
              f.wage = wage;
              f.contract = { wage, years: 3, release: wage * 8 };
              f.coachRel = clampN(f.coachRel + 10, 0, 100);
              f.clubRel = clampN(f.clubRel + 10, 0, 100);
              f.fame = clampN(f.fame + 5, 0, 100);
              syncJob(f);
              sayIt(`I signed my first professional contract with ${f.club.name}.`);
              playSnd("achievement");
              card({
                iconSrc: f.club.logo,
                title: T("Professional"),
                lead: `You are a first-team footballer. The academy kids are already asking for your shirt.`,
                rows: [
                  [T("Club"), f.club.name],
                  [T("Wage"), `${money(f.wage)}/${T("yr")}`],
                  [T("Contract"), `3 ${T("years")}`],
                ],
                ok: next,
              });
            },
          ],
          [
            T("Ask for a loan") + (loanClub ? ` · ${loanClub.name}` : ""),
            () => {
              f.youth = false;
              f.pro = true;
              f.academy = false;
              f.wage = Math.max(45000, Math.round(wage * 0.7));
              f.contract = { wage: f.wage, years: 2, release: f.wage * 6 };
              if (loanClub) {
                f.loan = { name: loanClub.name, rep: loanClub.rep, years: 1 };
                f.clubRel = clampN(f.clubRel + 4, 0, 100);
              }
              syncJob(f);
              sayIt(loanClub ? `I signed pro terms and went on loan to ${loanClub.name}.` : "I signed pro terms and asked for playing time.");
              card({
                iconSrc: loanClub ? loanClub.logo : f.club.logo,
                title: T("Loan move"),
                lead: loanClub
                  ? `You sign for ${f.club.name} and immediately join ${loanClub.name} on loan. Regular minutes are the plan.`
                  : "The club cannot find a loan in time. You stay and fight for minutes.",
                rows: [
                  [T("Parent club"), f.club.name],
                  [T("Loan club"), loanClub ? loanClub.name : "—"],
                  [T("Wage"), `${money(f.wage)}/${T("yr")}`],
                ],
                ok: next,
              });
            },
          ],
          [
            T("Stay one more year in the youth team"),
            () => {
              f.coachRel = clampN(f.coachRel + 6, 0, 100);
              f.skill = clampN(f.skill + 2, 1, 99);
              sayIt("I turned down the first-team offer to develop one more year.");
              card({
                iconSrc: f.club.logo,
                title: T("One more year"),
                lead: T("You stay with the youth team. The coach promises the first team will come back for you."),
                rows: [[T("Coach"), `${Math.round(f.coachRel)}%`], [T("Skill"), `${Math.round(f.skill)}%`]],
                ok: next,
              });
            },
          ],
        ],
      });
    };
  }
  // ------------------------------------------------------------------ helpers
  function ordinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function countryCode(name) {
    if (typeof COUNTRIES === "undefined") return "";
    const key = Object.keys(COUNTRIES).find((k) => COUNTRIES[k] && COUNTRIES[k][0] === name);
    return key || "";
  }

  // [fix] you can only play for the country you were born in. state.country is where you live NOW (and a 2-letter code),
  // and the club's flag is the club's country: neither is your national team.
  function bornCode() {
    if (!state.birthCountry) state.birthCountry = (state.immigration && state.immigration.from) || state.country || "";
    return state.birthCountry;
  }
  const NAT_ALIAS = { "United Kingdom": "England", USA: "United States" };
  function bornName() {
    const c = bornCode();
    const n = (typeof COUNTRIES !== "undefined" && COUNTRIES[c] && COUNTRIES[c][0]) || String(c || "");
    return NAT_ALIAS[n] || n;
  }
  function flagFor(f) {
    const code = bornCode();
    return code ? `flags/${code}.png` : E("1f5fa-fe0f");
  }

  // trophy pictures (trophies/*.png): the competition or award decides the art, the club logo is only the fallback
  const TROPHY_ART = [
    [/ballon d.?or|golden ball/i, "award-01-ballon-dor"], [/golden boot/i, "award-04-golden-boot"], [/golden glove/i, "award-05-golden-glove"],
    [/yashin/i, "award-07-yashin-trophy"], [/kopa/i, "award-06-kopa-trophy"], [/fair play/i, "award-12-fair-play"],
    [/young player/i, "award-10-uefa-young-player"], [/player of the season/i, "award-02-the-best"],
    [/conference league/i, "uefa-03-conference-league"], [/europa league/i, "uefa-02-europa-league"], [/super cup/i, "uefa-04-super-cup"],
    [/concacaf/i, "intl-06-club-world-cup"], [/libertadores/i, "intl-05-libertadores"], [/champions league/i, "uefa-01-champions-league"],
    [/women.*world cup/i, "intl-12-womens-world-cup"], [/world cup/i, "intl-01-world-cup"], [/european championship|\beuro\b/i, "intl-02-euro"],
    [/copa am|gold cup/i, "intl-03-copa-america"], [/africa/i, "intl-04-africa-cup"], [/olympic/i, "intl-08-olympic"], [/nations league/i, "intl-09-nations-league"],
  ];
  const trophyArt = (name) => {
    const n = String(name || "");
    const hit = TROPHY_ART.find(([re]) => re.test(n));
    return hit ? `trophies/${hit[1]}.png` : null;
  };
  const contChampName = (f) => {
    const l = f && f.club && findLeagueOfClub(f.club);
    const c = l && l.conf;
    return c === "UEFA" ? T("European Championship") : c === "CONMEBOL" ? T("Copa América") : c === "CONCACAF" ? T("Gold Cup") : T("Continental Championship");
  };

  function addTrophy(f, name, kind, icon, sub) {
    if (!Array.isArray(f.trophies)) f.trophies = [];
    if (f.trophies.length >= 400) f.trophies.shift();
    f.trophies.push({ n: name, k: kind, y: year(), c: sub || "", i: trophyArt(name) || icon || ICON });
    f.fame = clampN(f.fame + (kind === "individual" ? 3 : 2), 0, 100);
  }

  function hasTrophy(f, name, y) {
    return f.trophies.some((t) => t.n === name && t.y === y);
  }

  function isWorldCupYear() {
    return (year() - 2026) % 4 === 0;
  }

  function isContinentalYear() {
    return (year() - 2028) % 4 === 0;
  }

  function nationalStrength(f) {
    const l = findLeagueOfClub(f.club);
    const base = l ? 58 + l.rep * 0.28 : 70;
    return clampN(base + (f.skill - 70) * 0.28 + (f.nat.called ? 2 : 0), 52, 97);
  }

  // ------------------------------------------------------------------ national team
  function simulateNational(f, out) {
    const nat = f.nat;
    const age = state.age;
    if (!nat.called && f.pro && age >= 19 && f.skill >= 68 && f.fame >= 12) {
      nat.called = true;
      nat.debut = year();
      nat.caps = Math.max(1, nat.caps + 1);
      nat.goals = Math.max(0, nat.goals);
      f.fame = clampN(f.fame + 6, 0, 100);
      f.hype = clampN(f.hype + 8, 0, 100);
      out.push([T("National team"), T("Called up for the first time")]);
      sayIt("I was called up to the national team for the first time.");
    }
    if (!nat.called) return null;

    const caps = ri(1, 4);
    nat.caps += caps;
    const nGoals = posOf(f).gk ? 0 : Math.round(ri(0, 2) * (0.4 + f.skill / 160) * posOf(f).goal);
    nat.goals += nGoals;

    const tournament =
      f.natCup || f.natDeclined === year() || f.natDone === year() || f.natHandled === year()
        ? null
        : isWorldCupYear() && age >= 20
        ? { name: T("World Cup"), rounds: 4, prestige: 3 }
        : isContinentalYear() && age >= 20
          ? { name: contChampName(f), rounds: 3, prestige: 2 }
          : null;
    if (!tournament) return { caps, goals: nGoals, tournament: null };

    const strength = nationalStrength(f);
    const roundNames = [T("Round of 16"), T("Quarter-final"), T("Semi-final"), T("Final")];
    const contNames = [T("Group stage"), T("Quarter-final"), T("Semi-final"), T("Final")];
    const names = tournament.rounds === 4 ? roundNames : contNames;
    let won = true;
    let reached = 0;
    for (let r = 0; r < tournament.rounds; r++) {
      reached = r;
      const opp = clampN(strength + ri(-14, 14), 50, 99);
      const p = clampN(0.48 + (strength - opp) / 100 + f.skill / 800, 0.12, 0.9);
      if (rnd() >= p) {
        won = false;
        break;
      }
    }
    const champion = won;
    const result = champion ? `${T("Won the")} ${tournament.name}` : `${T("Eliminated in the")} ${names[Math.min(reached, names.length - 1)]}`;
    const tGoals = champion ? ri(1, 4) : ri(0, 3);
    nat.goals += tGoals;
    nat.caps += tournament.rounds;
    f.fame = clampN(f.fame + (champion ? 16 : 5) + tournament.prestige, 0, 100);
    f.hype = clampN(f.hype + (champion ? 12 : 4), 0, 100);
    out.push([T("National team"), result + (tGoals ? ` · ${tGoals} ${T("goals")}` : "")]);
    nat.hist.push({ y: year(), t: tournament.name, r: result, g: tGoals });
    if (nat.hist.length > 16) nat.hist.shift();
    if (champion) {
      addTrophy(f, `${bornName() || T("National team")} · ${tournament.name}`, "nation", flagFor(f), T("National team"));
      sayIt(`I won the ${tournament.name} with my country.`);
      if (tGoals >= 4 && rnd() < 0.55) {
        addTrophy(f, `${tournament.name} Golden Boot`, "individual", E("1f3c5"), T("National team"));
        out.push([T("Award"), `${tournament.name} ${T("Golden Boot")}`]);
      }
      if (tGoals >= 3 && rnd() < 0.4) {
        addTrophy(f, `${tournament.name} Golden Ball`, "individual", E("1f3c6"), T("National team"));
        out.push([T("Award"), `${tournament.name} ${T("Golden Ball")}`]);
      }
    }
    return { caps, goals: nGoals + tGoals, tournament: result };
  }

  // ------------------------------------------------------------------ [mod] national team tournament, week by week
  // Every four years (the World Cup, and the continental championship two years later) the national team calls you up.
  // If you accept, Age is locked until the tournament ends: you advance with the 1 Week button and every week
  // is a match (group stage, then knockout rounds).
  const NATIONS = [
    ["Argentina", 93], ["France", 92], ["Brazil", 92], ["Spain", 91], ["England", 90], ["Germany", 89], ["Portugal", 88], ["Netherlands", 87], ["Italy", 86],
    ["Belgium", 85], ["Croatia", 84], ["Uruguay", 84], ["Colombia", 83], ["Morocco", 82], ["Mexico", 80], ["United States", 79], ["Japan", 79], ["Senegal", 79],
    ["Switzerland", 78], ["Denmark", 78], ["South Korea", 77], ["Poland", 75], ["Nigeria", 75], ["Ecuador", 74], ["Chile", 72], ["Serbia", 74], ["Turkey", 74],
    ["Canada", 70], ["Australia", 70], ["Egypt", 70], ["Peru", 70], ["Ghana", 68], ["Costa Rica", 66], ["Jamaica", 62], ["Dominican Republic", 52],
  ];
  const NAT_KO = { world: ["r16", "qf", "sf", "final"], cont: ["qf", "sf", "final"] };
  const natPower = (f) => {
    const own = NATIONS.find(([n]) => n === bornName());
    return Math.round(clampN((own ? own[1] : 68) * 0.7 + f.skill * 0.3, 50, 97));
  };
  const natBlocking = (f) => {
    if (f && f.natCup && f.natCup.year !== year()) f.natCup = null; // stale camp from another year
    return !!(f && f.active && !f.retired && !state.dead && !state.prison && f.natCup && !f.natCup.done);
  };

  // [mod] the continental run blocks Age like the national-team camp does: every 1 Week is a match you play
  const contBlocking = (f) => {
    const c = f && f.cont;
    if (!c || c.done || !f.active || f.retired || state.dead || state.prison) return false;
    if (c.year !== year()) {
      // an old run that was never finished (older saves): settle it quietly so nobody is stuck
      let guard = 0;
      while (f.cont && !f.cont.done && guard++ < 12) contPlay(f);
      return false;
    }
    if (state.weekNo && state.weekNo.age === state.age && state.weekNo.n >= 52) return false; // no weeks left this year
    return true;
  };

  // [mod] penalty minigame (penalty.js): you take the kicks yourself; falls back to a coin flip if it is not loaded
  const hashHue = (s) => {
    let h = 7;
    for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h % 360;
  };
  function penaltyBase(f, team) {
    if (!f.shirt) f.shirt = pick([7, 8, 9, 10, 11, 17, 19, 21]);
    const sh = f.attrs && f.attrs.shooting ? f.attrs.shooting : f.skill;
    return { name: String(state.last || state.first || "Player"), number: f.shirt, kit: hashHue(team || (f.club && f.club.name) || "x"), skill: Math.round(clampN(sh * 0.6 + f.skill * 0.4, 20, 99)) };
  }
  function penaltyShootout(f, myTeam, oppTeam, myPower, oppPower, cb) {
    if (!window.FL_PEN) return cb(rnd() < 0.5);
    FL_PEN.shootout({
      ...penaltyBase(f, myTeam), myTeam, oppTeam,
      oppRate: clampN(0.72 + (oppPower - myPower) / 250, 0.55, 0.88),
      keeper: clampN((oppPower - 40) / 80, 0.25, 0.8),
      onDone: (r) => cb(!!r.won),
    });
  }
  function penaltyPractice(f) {
    if (!window.FL_PEN) return noticeIt(T("Penalty practice"), T("The penalty game is not available right now."), null, true);
    FL_PEN.practice({
      ...penaltyBase(f),
      onDone: (r) => {
        if (r.quit && !r.scored) return openFutbol();
        f.penBest = Math.max(f.penBest || 0, r.scored);
        const eff = r.scored >= 3 ? { form: 2, hap: 2, fit: -1 } : { fit: -1 };
        const rows = applyEffects(f, eff);
        sayIt(`I scored ${r.scored} out of ${r.total} in penalty practice.`);
        card({
          iconSrc: ICON, title: T("Penalty practice"),
          lead: r.scored >= 5 ? T("Five out of five. The keeper does not want to see you again.") : r.scored >= 3 ? T("A solid session. You would take one in a final.") : T("Not your day. The keeper had your number."),
          rows: [[T("Scored"), `${r.scored}/${r.total}`], [T("Best"), `${f.penBest}/${r.total}`], ...rows],
          ok: () => openFutbol(),
        });
      },
    });
  }

  function makeNatCup(f) {
    const world = isWorldCupYear();
    const myName = bornName() || T("Your country");
    const me = { name: myName, power: natPower(f), me: true, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
    const pool = NATIONS.filter(([n]) => n !== myName && !(myName === "USA" && n === "United States"));
    const group = [me];
    const used = new Set();
    while (group.length < 4) {
      const [n, pw] = pick(pool);
      if (used.has(n)) continue;
      used.add(n);
      group.push({ name: n, power: clampN(pw + ri(-3, 3), 45, 97), me: false, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
    }
    return {
      key: world ? "world" : "cont",
      name: world ? T("World Cup") : contChampName(f),
      year: year(), prestige: world ? 3 : 2,
      stage: "group", week: 0, koIndex: 0, group, results: [],
      done: false, champion: false, goals: 0, assists: 0, caps: 0, rounds: 0,
    };
  }

  // who gets named in the squad: skill, form, fame, past caps and a bit of the coach's trust
  const natSelectP = (f) => {
    const score = f.skill * 0.55 + f.form * 0.12 + f.fame * 0.18 + (f.nat.caps > 0 ? 8 : 0) + (f.coachRel - 50) * 0.06;
    return clampN((score - 52) / 34, 0.04, 0.97);
  };
  function natCallStep(f) {
    return (next) => {
      const world = isWorldCupYear();
      if (!(world || isContinentalYear()) || state.prison || f.natCup || f.natHandled === year() || state.age < 18) return next();
      f.natHandled = year(); // from here on this year's tournament is decided by the squad announcement, never auto-simulated
      const tname = world ? T("World Cup") : contChampName(f);
      if (rnd() >= natSelectP(f)) {
        if (!f.nat.called) return next(); // never capped: nobody was expecting you
        const eff = applyEffects(f, { hap: -4, fame: -1, hype: -2 });
        sayIt(`I was left out of the national squad for the ${tname}.`);
        return card({
          tag: T("National team"), iconSrc: flagFor(f), title: `${tname}: ${T("left out")}`,
          lead: T("The national manager announced the squad and your name is not on the list. You will watch it from the sofa."),
          rows: [[T("Tournament"), tname], ...eff], ok: next,
        });
      }
      if (!f.nat.called) {
        f.nat.called = true;
        f.nat.debut = year();
        f.nat.caps = Math.max(1, f.nat.caps + 1);
        f.fame = clampN(f.fame + 6, 0, 100);
        sayIt("I was called up to the national team for the first time.");
      }
      const c = makeNatCup(f);
      const bench = f.skill < nationalStrength(f) - 6 && rnd() < 0.4;
      card({
        tag: T("National team"), iconSrc: flagFor(f), title: `${c.name}: ${T("the call-up")}`,
        lead: `${T("The national manager has named you in the squad for the")} ${c.name}. ${T("Once you join the camp, the season is over for you: you advance week by week, one match at a time, until the tournament ends.")}`,
        rows: [[T("Tournament"), c.name], [T("Group"), c.group.filter((g) => !g.me).map((g) => g.name).join(", ")], [T("Your country"), c.group[0].name]],
        choices: [
          [T("Join the squad"), () => {
            c.bench = bench;
            f.natCup = c;
            window.FL_FUT_SYNC && FL_FUT_SYNC();
            sayIt(`I joined the national squad for the ${c.name}.`);
            card({
              iconSrc: flagFor(f), title: T("Welcome to camp"),
              lead: `${T("Press the 1 Week button to play each matchday. Age is locked until the tournament is over.")}${bench ? ` ${T("You start on the bench.")}` : ""}`,
              rows: [[T("Group stage"), `3 ${T("matches")}`], [T("Then"), T("Knockout rounds")]], ok: next,
            });
          }],
          [T("Turn it down (stay with your club)"), () => {
            f.natDeclined = year();
            applyEffects(f, { fame: -3, hype: -3, club: 2, coach: 1 });
            sayIt(`I turned down the national team call-up for the ${c.name}.`);
            noticeIt(T("National team"), T("Fans and the press do not forgive easily, but your club is happy to have you."), next, true);
          }, "gray"],
        ],
      });
    };
  }

  function natMatchGoals(f, c, a, b, tactic) {
    // team score, then your share of it
    const ga = tableGoals(a.power + 2, b.power);
    const gb = tableGoals(b.power, a.power + 2);
    const P = posOf(f);
    const starter = !(c.bench && c.rounds < 2) && rnd() < clampN(0.62 + (f.skill - 70) / 80 + (tactic === "lead" ? 0.1 : 0), 0.3, 0.96);
    let myG = 0, myA = 0;
    if (starter && !P.gk) {
      for (let i = 0; i < ga; i++) {
        const r = rnd();
        const pg = clampN(0.18 * P.goal * (f.skill / 78) * (tactic === "lead" ? 1.5 : tactic === "team" ? 0.8 : 1), 0, 0.6);
        const pa = clampN(0.16 * P.assist * (f.skill / 78) * (tactic === "team" ? 1.6 : 1), 0, 0.5);
        if (r < pg) myG++;
        else if (r < pg + pa) myA++;
      }
    }
    return { ga, gb, starter, myG, myA };
  }

  function natTable(c) {
    c.group.sort((a, b) => b.pts - a.pts || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf || a.name.localeCompare(b.name));
  }

  function natMatchStep(f) {
    const c = f.natCup;
    if (!c || c.done) return;
    const me = c.group.find((r) => r.me);
    const koList = NAT_KO[c.key];
    let opp, stageName;
    const order = c.group.filter((r) => !r.me);
    if (c.stage === "group") {
      opp = order[Math.min(c.week, order.length - 1)];
      stageName = `${T("Group stage")} · ${T("Match")} ${Math.min(3, c.week + 1)}/3`;
    } else {
      const st = koList[c.koIndex];
      const pw = clampN(me.power + ri(-10, 12) + c.koIndex * 2, 52, 97);
      const pool = NATIONS.filter(([n]) => n !== me.name && !(me.name === "USA" && n === "United States"));
      const pr = pick(pool);
      opp = { name: pr[0], power: clampN((pr[1] + pw) / 2 + 3 * (c.koIndex + 1), 55, 97), me: false };
      stageName = st === "final" ? T("Final") : st === "sf" ? T("Semi-final") : st === "qf" ? T("Quarter-final") : T("Round of 16");
    }
    const play = (tactic) => {
      const r = natMatchGoals(f, c, me, opp, tactic);
      let ga = r.ga, gb = r.gb;
      let pens = null;
      if (c.stage === "group") {
        me.p++; opp.p++; me.gf += ga; me.ga += gb; opp.gf += gb; opp.ga += ga;
        if (ga > gb) { me.w++; opp.l++; me.pts += 3; } else if (gb > ga) { opp.w++; me.l++; opp.pts += 3; } else { me.d++; opp.d++; me.pts++; opp.pts++; }
        const rest = order.filter((x) => x !== opp);
        if (rest.length >= 2) {
          const x = tableGoals(rest[0].power, rest[1].power), y = tableGoals(rest[1].power, rest[0].power);
          rest[0].p++; rest[1].p++; rest[0].gf += x; rest[0].ga += y; rest[1].gf += y; rest[1].ga += x;
          if (x > y) { rest[0].w++; rest[1].l++; rest[0].pts += 3; } else if (y > x) { rest[1].w++; rest[0].l++; rest[1].pts += 3; } else { rest[0].d++; rest[1].d++; rest[0].pts++; rest[1].pts++; }
        }
        c.week++;
        natTable(c);
      }
      const settle = () => {
      c.results.push(`${stageName} · ${me.name} ${ga}-${gb} ${opp.name}${pens !== null ? (pens ? ` (${T("won on penalties")})` : ` (${T("lost on penalties")})`) : ""}`);
      c.goals += r.myG; c.assists += r.myA; c.caps += r.starter ? 1 : 0; c.rounds++;
      let win = ga > gb || pens === true;
      let line = "";
      let finished = false;
      if (c.stage === "group") {
        if (c.week >= 3) {
          const pos = c.group.findIndex((x) => x.me) + 1;
          if (pos <= 2) { c.stage = "ko"; c.koIndex = 0; line = `${T("You finished")} ${ordinal(pos)} ${T("in the group and go through to the knockout rounds.")}`; }
          else { finished = true; c.done = true; line = `${T("You finished")} ${ordinal(pos)}. ${T("The group stage is the end of the road.")}`; }
        } else line = `${T("You are")} ${ordinal(c.group.findIndex((x) => x.me) + 1)} ${T("in the group.")}`;
      } else if (win) {
        c.koIndex++;
        if (c.koIndex >= koList.length) { finished = true; c.done = true; c.champion = true; line = `${T("CHAMPIONS!")} ${me.name} ${T("win the")} ${c.name}.`; }
        else line = `${T("Through to the")} ${koList[c.koIndex] === "final" ? T("final") : koList[c.koIndex] === "sf" ? T("semi-final") : T("quarter-final")}.`;
      } else { finished = true; c.done = true; line = T("Knocked out. The dream ends here.") ; }
      if (finished) natFinish(f, c, stageName);
      const rows = [
        [T("Result"), `${me.name} ${ga}-${gb} ${opp.name}${pens !== null ? ` (${pens ? T("pens: won") : T("pens: lost")})` : ""}`],
        [T("You"), r.starter ? `${r.myG} ${T("goals")} · ${r.myA} ${T("assists")}` : T("Used as a substitute")],
      ];
      if (c.stage === "group" && !c.done) c.group.forEach((x, i) => rows.push([`${i + 1}. ${x.name}${x.me ? ` (${T("You")})` : ""}`, `${x.pts} ${T("pts")} · ${x.gf}:${x.ga}`]));
      playSnd(win || ga > gb ? "ding" : ga === gb ? "ding" : "buzzer");
      card({
        tag: T("National team"), iconSrc: flagFor(f), title: `${stageName}`, lead: `${line}${c.done ? "" : ` ${T("Press 1 Week for the next match.")}`}`, rows, ok: () => {},
      });
      };
      if (c.stage !== "group" && ga === gb) {
        penaltyShootout(f, me.name, opp.name, me.power, opp.power, (won) => {
          pens = won;
          settle();
        });
      } else settle();
    };
    card({
      tag: T("National team"), iconSrc: flagFor(f), title: `${stageName}: ${me.name} ${T("vs")} ${opp.name}`,
      lead: `${c.bench && c.rounds < 2 ? `${T("You are on the bench.")} ` : ""}${T("Matchday. How do you want to play it?")}`,
      rows: [[T("Tournament"), c.name], [T("Opponent"), `${opp.name}`], [T("Fitness"), `${Math.round(f.fit)}%`]],
      choices: [
        [T("Play for the team"), () => play("team")],
        [T("Take the game by the throat"), () => play("lead")],
        [T("Play it safe"), () => play("safe")],
      ],
    });
  }

  function natFinish(f, c, stageName) {
    const nat = f.nat;
    nat.caps += Math.max(1, c.rounds);
    nat.goals += c.goals;
    f.fame = clampN(f.fame + (c.champion ? 16 : 5) + c.prestige, 0, 100);
    f.hype = clampN(f.hype + (c.champion ? 12 : 4), 0, 100);
    const result = c.champion ? `${T("Won the")} ${c.name}` : `${T("Eliminated in the")} ${c.stage === "group" ? T("Group stage") : stageName}`;
    nat.hist.push({ y: year(), t: c.name, r: result, g: c.goals });
    if (nat.hist.length > 16) nat.hist.shift();
    sayIt(c.champion ? `I won the ${c.name} with my country.` : `My ${c.name} ended in the ${(c.stage === "group" ? "group stage" : stageName).toLowerCase()}.`);
    if (c.champion) {
      addTrophy(f, `${bornName() || T("National team")} · ${c.name}`, "nation", flagFor(f), T("National team"));
      if (c.goals >= 4 && rnd() < 0.6) addTrophy(f, `${c.name} Golden Boot`, "individual", E("1f3c5"), T("National team"));
      if (c.goals + c.assists >= 5 && rnd() < 0.45) addTrophy(f, `${c.name} Golden Ball`, "individual", E("1f3c6"), T("National team"));
    }
    f.natDone = year();
    setTimeout(() => {
      f.natCup = null;
      window.FL_FUT_SYNC && FL_FUT_SYNC();
      noticeIt(T("National team"), T("The tournament is over. Age is unlocked again."), null, true);
    }, 300);
  }

  // ------------------------------------------------------------------ youth season
  function simulateYouth(f) {
    const P = posOf(f);
    const score = clampN(f.skill * 0.52 + f.fit * 0.22 + f.form * 0.16 + f.coachRel * 0.1 + ri(0, 12), 0, 100);
    const apps = ri(16, 28);
    const goals = P.gk ? 0 : Math.max(0, Math.round(apps * (0.08 + f.skill / 300) * P.goal + ri(-2, 4)));
    const assists = P.gk ? 0 : Math.max(0, Math.round(apps * (0.05 + f.skill / 420) * P.assist + ri(-2, 3)));
    const rating = Math.round(clampN(5.8 + (score - 55) / 28 + rnd() * 0.8, 4.5, 9.8) * 10) / 10;
    const growth = score >= 82 ? ri(2, 4) : score >= 68 ? ri(1, 3) : score >= 55 ? ri(0, 2) : -1;
    f.skill = clampN(f.skill + growth, 1, 99);
    f.fit = clampN(f.fit + (score >= 65 ? ri(0, 3) : -1), 1, 99);
    f.form = clampN(f.form + ri(-3, 5), 0, 100);
    f.fame = clampN(f.fame + (score >= 86 ? ri(1, 3) : 0), 0, 100);
    f.lastYouth = { year: year(), score, apps, goals, assists, rating, growth };
    f.history.push({ y: year(), club: f.club ? f.club.name : "Youth", league: T("Youth"), pos: "—", apps, goals, assists, rating, youth: true });
    if (f.history.length > 90) f.history.shift();
    if (score >= 90 && !hasTrophy(f, T("Youth MVP"), year())) {
      addTrophy(f, T("Youth MVP"), "individual", E("1f3c5"), f.club ? f.club.name : T("Youth"));
      f.highlights.push(T("Named Youth MVP of the academy."));
    }
    return f.lastYouth;
  }

  // ------------------------------------------------------------------ league tables
  function tableGoals(attack, defence) {
    const x = clampN(0.55 + (attack - defence) / 24, -0.9, 3.8);
    return Math.max(0, Math.round(x + rnd() * 1.9 - 0.55));
  }

  function ensureTables(f) {
    if (!f.tables || typeof f.tables !== "object") f.tables = {};
    return f.tables;
  }

  function buildLeagueTable(l, division, y, f) {
    const div = division || 1;
    const tables = ensureTables(f);
    const key = `${l.id}:${div}:${y}`;
    if (tables[key]) return tables[key];
    const clubs = div === 2 ? secondDivisionOf(l) : l.clubs.slice();
    const rows = clubs.map((c) => ({
      id: String(c.id || c.name),
      name: String(c.name),
      logo: c.logo || (div === 2 ? l.tier2Logo : l.logo) || "",
      rep: c.rep,
      p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0,
    }));
    for (let i = 0; i < rows.length; i++) {
      for (let j = i + 1; j < rows.length; j++) {
        for (let leg = 0; leg < 2; leg++) {
          const a = leg ? rows[j] : rows[i];
          const b = leg ? rows[i] : rows[j];
          const ga = tableGoals(a.rep + 2.5, b.rep);
          const gb = tableGoals(b.rep, a.rep + 2.5);
          a.p++; b.p++;
          a.gf += ga; a.ga += gb;
          b.gf += gb; b.ga += ga;
          if (ga > gb) { a.w++; b.l++; a.pts += 3; }
          else if (gb > ga) { b.w++; a.l++; b.pts += 3; }
          else { a.d++; b.d++; a.pts++; b.pts++; }
        }
      }
    }
    rows.sort((a, b) => b.pts - a.pts || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf || a.name.localeCompare(b.name));
    const table = {
      y,
      league: div === 2 ? l.tier2Name || `${l.name} 2` : l.name,
      leagueId: l.id,
      division: div,
      logo: div === 2 ? l.tier2Logo || l.logo || "" : l.logo || "",
      rows,
    };
    tables[key] = table;
    return table;
  }

  function currentTable(f) {
    const l = f.club && leagueById(f.club.lId);
    if (!l) return null;
    return buildLeagueTable(l, (f.club && f.club.division) || 1, year(), f);
  }

  // ------------------------------------------------------------------ squads
  const STARS = {
    "manchester-city": [["Erling Haaland", "ST", 92], ["Rodri", "CDM", 91], ["Phil Foden", "CAM", 88], ["Bernardo Silva", "CM", 87], ["Rúben Dias", "CB", 88], ["Joško Gvardiol", "LB", 85]],
    "manchester-united": [["Bruno Fernandes", "CAM", 88], ["Kobbie Mainoo", "CM", 82], ["Lisandro Martínez", "CB", 84], ["André Onana", "GK", 82], ["Rasmus Højlund", "ST", 81], ["Mason Mount", "CM", 79]],
    "liverpool": [["Mohamed Salah", "RW", 90], ["Virgil van Dijk", "CB", 89], ["Alisson", "GK", 89], ["Dominik Szoboszlai", "CM", 84], ["Alexis Mac Allister", "CM", 85], ["Luis Díaz", "LW", 86]],
    "arsenal": [["Bukayo Saka", "RW", 88], ["Martin Ødegaard", "CAM", 88], ["Declan Rice", "CDM", 87], ["William Saliba", "CB", 86], ["Gabriel Magalhães", "CB", 85], ["Kai Havertz", "ST", 83]],
    "chelsea": [["Cole Palmer", "CAM", 88], ["Enzo Fernández", "CM", 84], ["Moisés Caicedo", "CDM", 84], ["Reece James", "RB", 84], ["Nicolas Jackson", "ST", 80], ["Marc Cucurella", "LB", 81]],
    "real-madrid": [["Kylian Mbappé", "ST", 92], ["Vinícius Júnior", "LW", 91], ["Jude Bellingham", "CAM", 90], ["Rodrygo", "RW", 86], ["Thibaut Courtois", "GK", 89], ["Federico Valverde", "CM", 87]],
    "barcelona": [["Lamine Yamal", "RW", 88], ["Pedri", "CM", 87], ["Robert Lewandowski", "ST", 87], ["Raphinha", "LW", 86], ["Gavi", "CM", 84], ["Marc-André ter Stegen", "GK", 87]],
    "atletico-madrid": [["Antoine Griezmann", "CAM", 86], ["Julián Álvarez", "ST", 85], ["Jan Oblak", "GK", 87], ["Koke", "CM", 82], ["Samuel Lino", "LW", 80], ["José María Giménez", "CB", 83]],
    "bayern-munchen": [["Harry Kane", "ST", 89], ["Jamal Musiala", "CAM", 87], ["Joshua Kimmich", "CM", 86], ["Manuel Neuer", "GK", 86], ["Leroy Sané", "RW", 84], ["Alphonso Davies", "LB", 84]],
    "borussia-dortmund": [["Julian Brandt", "CAM", 83], ["Karim Adeyemi", "LW", 80], ["Gregor Kobel", "GK", 85], ["Serhou Guirassy", "ST", 83], ["Nico Schlotterbeck", "CB", 82], ["Marcel Sabitzer", "CM", 80]],
    "paris-saint-germain": [["Ousmane Dembélé", "RW", 86], ["Gianluigi Donnarumma", "GK", 87], ["Achraf Hakimi", "RB", 85], ["Vitinha", "CM", 84], ["Khvicha Kvaratskhelia", "LW", 86], ["Marquinhos", "CB", 84]],
    "inter": [["Lautaro Martínez", "ST", 88], ["Nicolò Barella", "CM", 86], ["Alessandro Bastoni", "CB", 85], ["Yann Sommer", "GK", 83], ["Marcus Thuram", "ST", 83], ["Hakan Çalhanoğlu", "CDM", 85]],
    "milan": [["Rafael Leão", "LW", 86], ["Mike Maignan", "GK", 86], ["Theo Hernández", "LB", 85], ["Christian Pulisic", "RW", 82], ["Tijjani Reijnders", "CM", 82], ["Fikayo Tomori", "CB", 82]],
    "juventus": [["Dušan Vlahović", "ST", 83], ["Kenan Yıldız", "CAM", 81], ["Gleison Bremer", "CB", 84], ["Michele Di Gregorio", "GK", 80], ["Manuel Locatelli", "CM", 81], ["Andrea Cambiaso", "LB", 80]],
    "napoli": [["Romelu Lukaku", "ST", 84], ["Giovanni Di Lorenzo", "RB", 83], ["Alex Meret", "GK", 80], ["André-Frank Zambo Anguissa", "CM", 82], ["Alessandro Buongiorno", "CB", 82], ["Matteo Politano", "RW", 80]],
    "benfica": [["Ángel Di María", "RW", 83], ["Nicolás Otamendi", "CB", 81], ["Anatoliy Trubin", "GK", 80], ["Fredrik Aursnes", "CM", 79], ["Vangelis Pavlidis", "ST", 79]],
    "sporting-cp": [["Viktor Gyökeres", "ST", 85], ["Pedro Gonçalves", "CAM", 82], ["Morten Hjulmand", "CDM", 80], ["Gonçalo Inácio", "CB", 80], ["Rui Silva", "GK", 79]],
    "ajax": [["Jordan Henderson", "CM", 78], ["Kenneth Taylor", "CM", 78], ["Jorrel Hato", "CB", 79], ["Remko Pasveer", "GK", 75], ["Bertrand Traoré", "RW", 77]],
  };

  const SQUAD_FIRST = ["Lucas", "Mateo", "Diego", "Andrés", "Thiago", "Rafael", "Bruno", "Leon", "Milan", "Noah", "Ethan", "Omar", "Youssef", "Ivan", "Marco", "Paulo", "Samir", "Kabir", "Jonas", "Luka"];
  const SQUAD_LAST = ["Silva", "Costa", "Mendes", "García", "Fernández", "Rossi", "Bianchi", "Müller", "Schmidt", "Dubois", "Martin", "Smith", "Brown", "Williams", "Kovač", "Petrović", "Diallo", "Traoré", "Nakamura", "Haddad"];
  const SQUAD_POS = ["GK", "CB", "CB", "LB", "RB", "CDM", "CM", "CM", "CAM", "LW", "RW", "ST", "ST", "CB", "CM", "LW"];

  const CONT_KO = ["r16", "qf", "sf", "final"];

  function contOpponent(f, minRep) {
    const pool = ALL_CLUBS.filter(
      (x) => x.division === 1 && x.c.rep >= (minRep || 70) && x.l.rep >= 80 && (!f.club || x.c.name !== f.club.name),
    );
    const x = pick(pool.length ? pool : ALL_CLUBS);
    return {
      name: x.c.name,
      logo: x.c.logo || x.l.logo || "",
      power: clampN(x.c.rep + ri(-3, 4), 55, 96),
      me: false,
      p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0,
    };
  }

  function makeContinental(f) {
    const me = {
      name: f.club ? f.club.name : T("Your club"),
      logo: (f.club && f.club.logo) || "",
      power: Math.round(((f.club ? f.club.rep : 60) + f.skill) / 2 + (f.form - 50) / 8),
      me: true,
      p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0,
    };
    const group = [me];
    let guard = 0;
    while (group.length < 4 && guard++ < 40) {
      const o = contOpponent(f, 82);
      if (group.some((r) => r.name === o.name)) continue;
      group.push(o);
    }
    return {
      name: (f.club && f.club.continental) || T("Continental Cup"),
      year: year(),
      stage: "group",
      week: 0,
      group,
      order: group.slice(),
      koIndex: 0,
      results: [],
      done: false,
      champion: false,
    };
  }

  function contSort(rows) {
    rows.sort((a, b) => b.pts - a.pts || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf || a.name.localeCompare(b.name));
  }

  function contMatch(f, c, a, b) {
    const ga = tableGoals(a.power + 2, b.power);
    const gb = tableGoals(b.power, a.power + 2);
    a.p++; b.p++;
    a.gf += ga; a.ga += gb;
    b.gf += gb; b.ga += ga;
    if (ga > gb) { a.w++; b.l++; a.pts += 3; }
    else if (gb > ga) { b.w++; a.l++; b.pts += 3; }
    else { a.d++; b.d++; a.pts++; b.pts++; }
    return [ga, gb];
  }

  // [mod] How many decisions each continental match has: 3 in the group, 4 in the quarter-finals, 6 in semis and final.
  const CONT_MOMENTS = { group: 3, r16: 3, qf: 4, sf: 6, final: 6 };
  const contStageLabel = (st) => (st === "final" ? T("Final") : st === "sf" ? T("Semi-final") : st === "qf" ? T("Quarter-final") : T("Round of 16"));

  // The match you are about to play (kept in f.cont.cur so the opponent does not change if you look at it twice).
  function contFixture(f) {
    const c = f.cont;
    if (!c || c.done) return null;
    const me = c.group.find((r) => r.me);
    if (!me) return null;
    c.results = c.results || [];
    if (c.stage === "group") {
      const order = c.order && c.order.length ? c.order : c.group;
      const others = order.filter((r) => !r.me);
      const opp = others[Math.min(c.week, others.length - 1)];
      return { c, me, opp, others, group: true, stage: "group", n: CONT_MOMENTS.group, label: `${T("Group stage")} · ${T("Match")} ${Math.min(3, c.week + 1)}/3` };
    }
    const stage = CONT_KO[c.koIndex] || "final";
    if (!c.cur || c.cur.stage !== stage) {
      const minRep = stage === "final" ? 88 : stage === "sf" ? 85 : stage === "qf" ? 81 : 76;
      c.cur = { stage, opp: contOpponent(f, minRep) };
    }
    return { c, me, opp: c.cur.opp, group: false, stage, n: CONT_MOMENTS[stage] || 6, label: contStageLabel(stage) };
  }

  // Applies a finished match (the score you played) to the table / bracket.
  function contSettle(f, fx, ga, gb, pens) {
    const { c, me, opp } = fx;
    if (fx.group) {
      me.p++; opp.p++;
      me.gf += ga; me.ga += gb;
      opp.gf += gb; opp.ga += ga;
      if (ga > gb) { me.w++; opp.l++; me.pts += 3; }
      else if (gb > ga) { opp.w++; me.l++; opp.pts += 3; }
      else { me.d++; opp.d++; me.pts++; opp.pts++; }
      const rest = fx.others.filter((r) => r !== opp);
      if (rest.length >= 2) contMatch(f, c, rest[0], rest[1]);
      c.week++;
      c.results.push(`${T("Group")} · ${me.name} ${ga}-${gb} ${opp.name}`);
      contSort(c.group);
      const pos = c.group.findIndex((r) => r.me) + 1;
      if (c.week >= 3) {
        if (pos <= 2) {
          c.stage = "r16";
          c.koIndex = 0;
        } else {
          c.done = true;
          c.eliminated = true;
        }
      }
      return { ga, gb, opp: opp.name, pos, group: true, done: c.done };
    }
    const stage = fx.stage;
    const win = ga > gb || pens === true;
    c.results.push(`${stage === "final" ? T("Final") : stage.toUpperCase()} · ${me.name} ${ga}-${gb}${pens !== null && pens !== undefined ? (pens ? ` (${T("won on penalties")})` : ` (${T("lost on penalties")})`) : ""} ${opp.name}`);
    c.cur = null;
    if (win) {
      c.koIndex++;
      if (c.koIndex >= CONT_KO.length) {
        c.done = true;
        c.champion = true;
        addTrophy(f, c.name, "continental", f.club.logo, f.club.name);
        state.money = (Number(state.money) || 0) + 8000000;
        playSnd("chaChing");
        sayIt(`We won the ${c.name}!`);
      }
    } else {
      c.done = true;
      c.eliminated = true;
    }
    return { ga, gb, opp: opp.name, stage, pens: pens === undefined ? null : pens, win, champion: c.champion, done: c.done };
  }

  // Quick simulation (kept for old saves that left a run unfinished, and as a fallback).
  function contPlay(f) {
    const fx = contFixture(f);
    if (!fx) return null;
    const { me, opp } = fx;
    const ga = tableGoals(me.power + 2, opp.power);
    const gb = tableGoals(opp.power, me.power + 2);
    const pens = !fx.group && ga === gb ? rnd() < 0.5 : null;
    return contSettle(f, fx, ga, gb, pens);
  }

  // You play the match: decisions, penalties and free kicks, then the table / bracket moves.
  function contMatchStep(f, after) {
    const fx = contFixture(f);
    if (!fx) return;
    const { c, me, opp } = fx;
    keyMatchStep(f, {
      tag: `${c.name} · ${fx.label}`,
      name: c.name,
      opp: { name: opp.name, rep: opp.power, logo: opp.logo },
      lead: `${T("Matchday.")} ${fx.n} ${T("key moments will decide it, and the decisions are yours.")}`,
      n: fx.n,
      variety: true,
      group: fx.group,
      onFinish: (r, next) => {
        const koPens = !fx.group && r.pens ? r.res === "win" : null;
        const out = contSettle(f, fx, r.my, r.op, koPens);
        const win = r.res === "win";
        const eff = applyEffects(f, win ? { fame: fx.stage === "final" ? 5 : 2, form: 4, club: 3, hype: 3 } : r.res === "draw" ? { form: 1 } : { form: -4, club: -2, hype: -2 });
        playSnd(win || r.res === "draw" ? "ding" : "buzzer");
        sayIt(`${c.name}: ${me.name} ${r.my}-${r.op} ${opp.name}${koPens !== null ? (koPens ? " (won on penalties)" : " (lost on penalties)") : ""}.`);
        const pos = c.group.findIndex((x) => x.me) + 1;
        let line;
        if (c.done && c.champion) line = T("CHAMPIONS! The trophy is yours and the whole city is awake.");
        else if (c.done && fx.group) line = `${T("You finished")} ${ordinal(pos)}. ${T("The group stage is the end of the road.")}`;
        else if (c.done) line = T("Knocked out. There is always next season.");
        else if (fx.group) line = c.week >= 3 ? `${T("You finished")} ${ordinal(pos)} ${T("in the group and go through to the knockout rounds.")}` : `${T("You are")} ${ordinal(pos)} ${T("in the group.")}`;
        else line = `${T("Through to the")} ${contStageLabel(CONT_KO[c.koIndex]).toLowerCase()}.`;
        const rows = [
          [T("Result"), `${me.name} ${r.my}-${r.op} ${opp.name}${koPens !== null ? ` (${koPens ? T("pens: won") : T("pens: lost")})` : ""}`],
          [T("Your goals"), String(r.goals)],
          [T("Your assists"), String(r.assists)],
        ];
        if (fx.group && !c.done) c.group.forEach((x, i) => rows.push([`${i + 1}. ${x.name}${x.me ? ` (${T("You")})` : ""}`, `${x.pts} ${T("pts")} · ${x.gf}:${x.ga}`]));
        rows.push(...eff);
        card({
          tag: c.name, iconSrc: (f.club && f.club.logo) || ICON, title: c.done ? (c.champion ? T("Champions") : T("Eliminated")) : fx.label,
          lead: `${line}${c.done ? ` ${T("Age up is unlocked again.")}` : ` ${T("Press 1 Week for the next match.")}`}`, rows,
          ok: () => { if (window.FL_FUT_SYNC) FL_FUT_SYNC(); next(); if (after) after(); },
        });
      },
    })(() => {});
  }

  function contScreen(f) {
    const c = f.cont;
    if (!c) {
      card({
        iconSrc: E("1f3c6"),
        title: T("Continental Cup"),
        lead: T("Finish in the top four (or win the cup) to qualify for next season's continental competition."),
        rows: [[T("Last season"), f.lastSeason ? `${ordinal(f.lastSeason.position)}` : T("No season yet")], [T("Qualified"), f.qualified ? T("Yes") : T("Not yet")]],
        ok: () => openFutbol(),
      });
      return;
    }
    const me = c.group.find((r) => r.me);
    const pos = c.group.findIndex((r) => r.me) + 1;
    const stageName =
      c.stage === "group"
        ? `${T("Group stage")} · ${T("Match")} ${Math.min(3, c.week + 1)}/3`
        : CONT_KO[c.koIndex] === "final"
          ? T("Final")
          : CONT_KO[c.koIndex] === "sf"
            ? T("Semi-final")
            : CONT_KO[c.koIndex] === "qf"
              ? T("Quarter-final")
              : T("Round of 16");
    const rows = c.group
      .slice()
      .sort((a, b) => b.pts - a.pts || b.gf - b.ga - (a.gf - a.ga))
      .map((r, i) => [`${i + 1}. ${r.name}${r.me ? ` (${T("You")})` : ""}`, `${r.pts} ${T("pts")} · ${r.gf}:${r.ga}`]);
    const lead = c.done
      ? c.champion
        ? T("Champions of the continent. The trophy is yours.")
        : T("Knocked out. There is always next season.")
      : c.stage === "group"
        ? `${T("You are")} ${ordinal(pos)} ${T("in the group")}. ${T("Top two advance. Three points for a win.")}`
        : `${T("Win or go home. One match this week.")} ${T("Press 1 Week (or the button below) to play it.")}`;
    const buttons = [];
    if (!c.done) buttons.push([T("Play this week's match"), () => contMatchStep(f, () => contScreen(f))]);
    buttons.push([T("Back"), () => openFutbol()]);
    card({
      iconSrc: (f.club && f.club.logo) || E("1f3c6"),
      title: c.name,
      lead,
      rows: [[T("Stage"), stageName], ...rows, ...(c.results || []).slice(-3).map((r) => [T("Result"), r])],
      choices: buttons,
    });
  }

  function seededRandom(seed) {
    let t = seed >>> 0;
    return () => {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function squadFor(f) {
    const club = f.club || { id: "free", name: T("Free agent"), rep: 55 };
    const key = String(club.id || club.name);
    const seed = key.split("").reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
    const rng = seededRandom(seed);
    const out = [];
    const stars = STARS[club.id] || [];
    stars.forEach(([n, p, r]) => out.push({ name: n, pos: p, rating: r }));
    let guard = 0;
    while (out.length < 20 && guard++ < 100) {
      const name = `${SQUAD_FIRST[Math.floor(rng() * SQUAD_FIRST.length)]} ${SQUAD_LAST[Math.floor(rng() * SQUAD_LAST.length)]}`;
      if (out.some((p) => p.name === name)) continue;
      const pos = SQUAD_POS[Math.floor(rng() * SQUAD_POS.length)];
      const rating = clampN(Math.round((club.rep || 60) - 8 + rng() * 22), 45, 92);
      out.push({ name, pos, rating, generated: true });
    }
    out.sort((a, b) => b.rating - a.rating);
    const meName = `${state.first || ""} ${state.last || ""}`.trim() || T("You");
    out.unshift({ name: meName, pos: posName(f), rating: Math.round(f.skill), me: true });
    return out;
  }

  // ------------------------------------------------------------------ pro season
  function simulatePro(f) {
    const league = findLeagueOfClub(f.club) || LEAGUES[0];
    const P = posOf(f);
    const games = 38;
    const out = [];
    let playRate = clampN(0.22 + (f.skill - (f.club ? f.club.rep : 60) + 14) / 52 + (f.coachRel - 50) / 260, 0.1, 1); // [mod] the coach picks his players
    if (f.coachRel < 20) playRate *= 0.65; // frozen out
    if (f.loan) playRate = clampN(playRate + 0.3, 0.25, 1);
    if (f.injury) playRate *= 0.3;
    if (f.ban) playRate *= Math.max(0.15, 1 - f.ban / 9);
    const apps = Math.max(2, Math.round(games * playRate));

    const power = clubPower(f);
    let wins = 0;
    let draws = 0;
    let losses = 0;
    for (let i = 0; i < games; i++) {
      const opp = clampN((f.club ? f.club.rep : 60) + ri(-18, 18), 35, 99);
      const pWin = clampN(0.38 + (power - opp) / 100, 0.07, 0.86);
      const roll = rnd();
      if (roll < pWin) wins++;
      else if (roll < pWin + 0.24) draws++;
      else losses++;
    }
    const points = wins * 3 + draws;
    const gf = Math.max(0, wins * 2 + draws + ri(0, 12));
    const ga = Math.max(0, losses * 2 + draws + ri(0, 10));

    const table = currentTable(f);
    let position = 1;
    if (table) {
      const my = table.rows.find((r) => f.club && r.name === f.club.name);
      if (my) {
        my.p = wins + draws + losses;
        my.w = wins;
        my.d = draws;
        my.l = losses;
        my.gf = gf;
        my.ga = ga;
        my.pts = points;
        table.rows.sort((a, b) => b.pts - a.pts || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf || a.name.localeCompare(b.name));
        position = table.rows.findIndex((r) => r.name === my.name) + 1;
      } else {
        position = 1 + table.rows.filter((r) => r.pts > points).length;
      }
      table.rows.forEach((r) => (r.me = f.club && r.name === f.club.name));
    }

    let goals = 0;
    let assists = 0;
    let cleanSheets = 0;
    if (P.gk) {
      cleanSheets = Math.round(apps * clampN(0.14 + ((f.club ? f.club.rep : 60) - 55) / 180, 0.08, 0.5));
      assists = Math.round(rnd() * 2);
    } else {
      goals = Math.max(0, Math.round(apps * (0.1 + f.skill / 300) * P.goal * (0.85 + f.form / 250) + ri(-2, 4) + (f.mods.atk || 0) * 0.3));
      assists = Math.max(0, Math.round(apps * (0.06 + f.skill / 400) * P.assist * (0.9 + f.form / 300) + ri(-2, 3) + (f.mods.def || 0) * 0.2));
    }
    const rating = Math.round(
      clampN(6.1 + (f.skill - 60) / 38 + (f.form - 50) / 190 + ((f.mods.atk || 0) + (f.mods.def || 0)) * 0.03 + rnd() * 0.5, 4.2, 10) * 10,
    ) / 10;

    // Domestic cup
    const cupNames = [T("Third round"), T("Round of 16"), T("Quarter-final"), T("Semi-final"), T("Final")];
    let cupWon = false;
    let cupRound = -1;
    for (let r = 0; r < cupNames.length; r++) {
      const opp = clampN((f.club ? f.club.rep : 60) + ri(-22, 16), 35, 98);
      const p = clampN(0.55 + (power - opp) / 110, 0.08, 0.9);
      if (rnd() >= p) {
        cupRound = r;
        break;
      }
      cupRound = r;
      if (r === cupNames.length - 1) cupWon = true;
    }
    const cupResult = cupWon ? `${T("Won the")} ${f.club.cup}` : `${T("Out in the")} ${cupNames[Math.max(0, cupRound)]}`;

    // Continental: qualification is decided here, but the run is played week by week.
    const qualified = f.qualified || (f.lastSeason && f.lastSeason.qualified) || f.club.rep >= 87;
    let contWon = false;
    let contResult = T("Did not qualify");
    if (qualified) {
      f.cont = makeContinental(f);
      contResult = `${T("Qualified for the")} ${f.club.continental} · ${T("every 1 Week is a match you play (Age is locked until it ends)")}`;
    } else {
      f.cont = null;
    }

    // National team
    const natOut = [];
    const nat = simulateNational(f, natOut);

    // Awards
    const awards = [];
    const leagueWon = position === 1;
    if (leagueWon) {
      addTrophy(f, league.name, "club", f.club.lLogo || f.club.logo, f.club.name);
      awards.push(`${league.name} ${T("title")}`);
    }
    if (cupWon) {
      addTrophy(f, f.club.cup, "cup", f.club.cupLogo || f.club.logo, f.club.name);
      awards.push(f.club.cup);
    }
    if (contWon) {
      addTrophy(f, f.club.continental, "continental", f.club.logo, f.club.name);
      awards.push(f.club.continental);
    }
    if (!P.gk && goals >= 17 + ri(0, 8) && position <= 6 && rnd() < 0.62) {
      addTrophy(f, T("Golden Boot"), "individual", E("1f3c5"), league.name);
      awards.push(T("Golden Boot"));
    }
    if (P.gk && cleanSheets >= 13 && rnd() < 0.55) {
      addTrophy(f, T("Golden Glove"), "individual", E("1f9e4"), league.name);
      awards.push(T("Golden Glove"));
    }
    if (rating >= 8.25 && (leagueWon || cupWon || contWon) && rnd() < 0.45) {
      addTrophy(f, T("Player of the Season"), "individual", E("1f3c6"), league.name);
      awards.push(T("Player of the Season"));
    }
    if (state.age <= 21 && rating >= 7.5 && rnd() < 0.5) {
      addTrophy(f, T("Young Player of the Season"), "individual", E("1f31f"), league.name);
      awards.push(T("Young Player of the Season"));
    }
    if (state.age <= 21 && rating >= 8.0 && (leagueWon || contWon) && rnd() < 0.3) {
      addTrophy(f, T("Kopa Trophy"), "individual", E("1f3c6"), T("World football"));
      awards.push(T("Kopa Trophy"));
    }
    if (P.gk && rating >= 8.1 && cleanSheets >= 14 && rnd() < 0.3) {
      addTrophy(f, T("Yashin Trophy"), "individual", E("1f9e4"), T("World football"));
      awards.push(T("Yashin Trophy"));
    }
    if (rating >= 7.8 && rnd() < 0.4) {
      addTrophy(f, T("Team of the Season"), "individual", E("1f4dc"), league.name);
      awards.push(T("Team of the Season"));
    }
    const ballon =
      rating >= 8.55 &&
      goals + assists >= 30 &&
      (contWon || leagueWon) &&
      f.fame >= 76 &&
      state.age >= 20 &&
      state.age <= 34 &&
      rnd() < 0.32;
    if (ballon) {
      addTrophy(f, T("Ballon d'Or"), "individual", E("1f3c6"), T("World football"));
      awards.push(T("Ballon d'Or"));
      f.fame = clampN(f.fame + 14, 0, 100);
      sayIt("I won the Ballon d'Or.");
      playSnd("achievement");
    }

    // Money
    const bonuses = goals * 3000 + assists * 1500 + apps * 900 + (leagueWon ? 150000 : 0) + (cupWon ? 90000 : 0) + (contWon ? 220000 : 0);
    const gross = (f.wage || 0) + bonuses;
    const net = Math.round(gross * 0.58);
    state.money = Math.max(0, (Number(state.money) || 0) + net);

    // Reputation / relationships
    f.fame = clampN(f.fame + (goals * 0.4 + assists * 0.2 + Math.max(0, rating - 6.6) * 3 + (leagueWon ? 4 : 0) + (contWon ? 6 : 0)) * 0.7 - (rating < 6 ? 1.5 : 0), 0, 100);
    f.hype = clampN(f.hype + Math.max(0, rating - 6.8) * 4 + goals * 0.3, 0, 100);
    f.coachRel = clampN(f.coachRel + (rating >= 7.3 ? ri(1, 4) : rating < 6.2 ? -ri(2, 5) : 0), 0, 100);
    f.clubRel = clampN(f.clubRel + (rating >= 7.3 ? ri(0, 3) : rating < 6.2 ? -ri(2, 4) : 0), 0, 100);
    f.form = clampN(rating * 10 - 10, 0, 100);

    // Injury / suspension recovery
    if (f.injury) {
      f.injury.weeks = Math.max(0, f.injury.weeks - 6);
      if (f.injury.weeks <= 0) {
        f.injury = null;
        out.push([T("Recovery"), T("Finally fit again")]);
      } else {
        out.push([T("Injury"), `${f.injury.weeks} ${T("weeks left")}`]);
      }
    }
    if (f.ban > 0) {
      f.ban = Math.max(0, f.ban - 5);
      if (f.ban > 0) out.push([T("Suspension"), `${f.ban} ${T("matches left")}`]);
    }

    // Age decline
    if (state.age >= 30) {
      const drop = state.age >= 35 ? ri(3, 5) : ri(1, 3);
      f.skill = clampN(f.skill - drop, 1, 99);
      f.fit = clampN(f.fit - ri(1, 4), 1, 99);
    }

    // Contract
    if (f.contract && f.contract.years > 0) f.contract.years--;
    f.qualified = position <= 4 || cupWon || (f.club.rep >= 85 && position <= 6);
    f.seasonNo = (f.seasonNo || 0) + 1;
    f.career.apps += apps;
    f.career.goals += goals;
    f.career.assists += assists;
    f.career.seasons += 1;

    const summary = {
      y: year(),
      club: f.club.name,
      league: league.name,
      position,
      points,
      wins,
      draws,
      losses,
      gf,
      ga,
      apps,
      goals,
      assists,
      cleanSheets,
      rating,
      cupResult,
      contResult,
      qualified,
      natOut,
      nat,
      awards,
      salary: net,
      expired: !f.contract || f.contract.years <= 0,
      ballon,
    };
    f.lastSeason = summary;
    f.history.push({
      y: year(),
      club: f.club.name,
      league: league.name,
      pos: ordinal(position),
      apps,
      goals,
      assists,
      rating,
    });
    if (f.history.length > 90) f.history.shift();
    return summary;
  }
  // ------------------------------------------------------------------ transfers
  function transferOffers(f, count) {
    return interestClubs(f, count || 3);
  }

  function joinClub(f, c) {
    f.club = c;
    f.wage = Math.round(wageFor(c, f.skill, f.fame) * (1 + f.fame / 220));
    f.contract = { wage: f.wage, years: 4, release: f.wage * 12 };
    f.clubRel = 55;
    f.coachRel = 55;
    f.hype = 0;
    f.joinedYear = year(); // [fix] the agent stops calling for two seasons
    f.clubTrack = c.name;
    f.loan = null;
    f.qualified = false;
    f.fame = clampN(f.fame + 3, 0, 100);
    state.money = Math.max(0, (Number(state.money) || 0) + Math.round(f.wage * 0.12));
    syncJob(f);
  }

  function retire(f, reason) {
    f.active = false;
    f.retired = true;
    f.retiredYear = year();
    f.pending = false;
    f.flowDone = true;
    clearFootballJob();
    sayIt("I retired from professional football.");
    const rows = [
      [T("Seasons"), String(f.career.seasons)],
      [T("Appearances"), String(f.career.apps)],
      [T("Goals"), String(f.career.goals)],
      [T("Assists"), String(f.career.assists)],
      [T("Trophies"), String(f.trophies.length)],
    ];
    card({
      iconSrc: E("1f3c1"),
      title: T("Retired"),
      lead: reason || T("The boots come off. The stands keep singing for a while, then they move on."),
      rows,
      ok: () => {
        if (typeof openFutbol === "function") openFutbol();
      },
    });
  }

  // ------------------------------------------------------------------ [mod] welcome at a big club
  // Joining a big club (reputation 82+) always comes with a welcome, and it is never the same one: a stadium
  // presentation, an airport crowd, the press, the dressing room, a legend's shirt number, your old fans...
  // The league colours the scene (rain in England, flares in Italy, a barra in Argentina...).
  const WELCOME_FLAVOR = [
    [/premier|championship|efl/i, "It is raining, of course. The supporters stand in it anyway, scarves up."],
    [/la ?liga|primera divisi|spanish/i, "The sun, the flags and a stadium that is never quiet."],
    [/serie a|italian/i, "Flares, scarves and the whole curva singing like it is a final."],
    [/bundesliga/i, "A wall of noise from the standing terraces, and a surprising amount of sausages."],
    [/ligue 1|french/i, "A loud, stubborn crowd that wants a statement signing to mean something."],
    [/eredivisie|dutch/i, "Orange everywhere, and a crowd that expects you to play beautiful football."],
    [/portug|primeira/i, "Drums, flags and a fan base that has seen a lot of stars arrive and leave."],
    [/brasil|brazil|argentin|liga profesional|libertad|uruguay|colombia|mexic|liga mx/i, "Drums, banners and a barra that never sits down. The whole street is shaking."],
    [/mls|major league|usa|united states/i, "A stage show with smoke, fireworks and a DJ. This is America."],
    [/saudi|pro league|arab/i, "A glossy ceremony with fireworks, sheikhs in the front row and a lot of cameras."],
  ];
  const welcomeFlavor = (c) => {
    const n = `${c.lName || ""} ${c.name || ""}`;
    const hit = WELCOME_FLAVOR.find(([re]) => re.test(n));
    return hit ? hit[1] : "";
  };
  const WELCOMES = [
    {
      id: "stadium", title: "The presentation",
      text: (f, c, o, fans) => `${fans.toLocaleString("en-US")} fans fill the stadium just to see you hold the shirt up. The speaker is waiting for you to say something.`,
      choices: [
        { t: "Kiss the badge", e: { fame: 3, club: 4, hype: 4, hap: 4 }, msg: "The place explodes. You are theirs.", risk: 0.2, riskE: { club: -1, hype: -3 }, riskMsg: "Your old fans see the video. It does not go down well." },
        { t: "Juggle the ball for the cameras", e: { fame: 3, hype: 5, hap: 2 }, msg: "Twelve touches, no drop, one viral clip.", risk: 0.25, riskE: { hype: -2, hap: -2 }, riskMsg: "It drops on the third touch. The clip is already online." },
        { t: "Keep it short and humble", e: { club: 3, coach: 2, hap: 1 }, msg: "Two sentences, a wave. The manager nods in the tunnel." },
      ],
    },
    {
      id: "airport", title: "The airport crowd",
      text: (f, c) => `You land and the whole terminal is full of ${c.name} shirts. Security is losing the argument with the fans.`,
      choices: [
        { t: "Sign autographs for hours", e: { fame: 3, club: 3, fit: -2, hap: 2 }, msg: "You leave with a sore hand and a lot of friends." },
        { t: "Slip out the back", e: { hype: -2, hap: 1, fame: -1 }, msg: "Safe and quiet. The fans notice that you were not there." },
        { t: "Climb on the car and sing", e: { fame: 4, hype: 6, hap: 4 }, msg: "The video is everywhere before you reach the hotel.", risk: 0.3, riskE: { club: -3, coach: -2 }, riskMsg: "The club did not want that photo. A phone call follows." },
      ],
    },
    {
      id: "press", title: "The press conference",
      text: (f, c) => `Forty cameras and one question that everyone wants to ask: is a ${c.name} player really worth that fee?`,
      choices: [
        { t: "Answer with confidence", e: { hype: 4, fame: 2, club: 2 }, msg: "You say you came here to win. The headlines love it.", risk: 0.3, riskE: { hype: -3, coach: -2 }, riskMsg: "It sounds like a promise you cannot keep. The press keeps the quote." },
        { t: "Let the football do the talking", e: { coach: 3, club: 2 }, msg: "Short answers, calm face. The staff like you already." },
        { t: "Joke about your old club", e: { fame: 3, hype: 4, club: -1 }, msg: "A laugh in the room, a storm online.", risk: 0.5, riskE: { club: -3, hap: -2 }, riskMsg: "Your old fans do not find it funny." },
      ],
    },
    {
      id: "dressing", title: "The dressing room",
      text: (f, c) => `The captain says there is a tradition at ${c.name}: every new signing sings in front of everybody.`,
      choices: [
        { t: "Sing, badly and proudly", e: { coach: 3, club: 2, hap: 3 }, msg: "You are terrible. They love you anyway.", risk: 0.2, riskE: { hap: -2 }, riskMsg: "A teammate films it. It is already a meme." },
        { t: "Laugh and take the jokes", e: { coach: 2, hap: 2 }, msg: "You take the joke on the chin. Good start." },
        { t: "Refuse politely", e: { coach: -3, club: -2, hap: -1 }, msg: "Awkward silence, then someone changes the subject." },
      ],
    },
    {
      id: "number", title: "Whose shirt is this?",
      text: (f, c) => `The number you wanted belonged to a ${c.name} legend. The shirt has been in a glass case since he retired.`,
      choices: [
        { t: "Ask the club to give it to you", e: { fame: 2, hype: 4, club: -1 }, msg: "They say yes, with a face that says no.", risk: 0.4, riskE: { club: -4, hype: -2 }, riskMsg: "The fans are furious. You are not touching that shirt." },
        { t: "Take another number", e: { club: 3, coach: 1 }, msg: "The supporters see it as respect." },
        { t: "Call the legend and ask for his blessing", e: { fame: 2, club: 4, hap: 3 }, msg: "He laughs, tells you to earn it, and posts a photo with you." },
      ],
    },
    {
      id: "oldfans", title: "Your old fans react",
      when: (f, c, o) => !!o,
      text: (f, c, o) => `Banners are going up outside ${o.name}'s stadium. Half the fans are thanking you, the other half are burning your shirt.`,
      choices: [
        { t: "Post a thank-you to the old fans", e: { fame: 1, hype: 2, club: 1, hap: 1 }, msg: "A classy goodbye. Even some of the angry ones soften." },
        { t: "Ignore it", e: { hap: -1 }, msg: "You keep scrolling. It stings anyway." },
        { t: "Reply to the trolls", e: { hype: 3, fame: 2, club: -2 }, msg: "It is fun for an hour.", risk: 0.5, riskE: { hype: -3, hap: -3 }, riskMsg: "It becomes a story, and not a good one." },
      ],
    },
    {
      id: "derby", title: "Booed by your old fans",
      when: (f, c, o) => !!o && o.lName === c.lName,
      text: (f, c, o) => `You moved inside the same league. ${o.name}'s fans will not forget it, and the derby is already circled in your calendar.`,
      choices: [
        { t: "Promise to score against them", e: { hype: 5, fame: 3, club: 2 }, msg: "A bold promise. Both sets of fans remember it.", risk: 0.4, riskE: { hype: -4, hap: -2 }, riskMsg: "You do not score. They never let you forget it." },
        { t: "Respect them, nothing more", e: { club: 1, hap: 1 }, msg: "You keep it classy. The press calls it mature." },
        { t: "Wind them up", e: { fame: 4, hype: 6, club: 2, hap: 1 }, msg: "A gesture, a headline, a lot of noise.", risk: 0.35, riskE: { club: -2, coach: -2 }, riskMsg: "The league sends a letter. So does your manager." },
      ],
    },
    {
      id: "owner", title: "Dinner with the owner",
      when: (f, c) => c.rep >= 88,
      text: (f, c) => `The owner of ${c.name} invites you to dinner at a place with no menu prices. He wants to know what you really want.`,
      choices: [
        { t: "Ask for a share of the shirt sales", e: { money: 120000, club: -1 }, msg: "He laughs, then he signs. You leave with a bigger bonus.", risk: 0.35, riskE: { money: -60000, club: -3 }, riskMsg: "He calls it greedy and cuts your signing bonus." },
        { t: "Say you want trophies, not money", e: { club: 4, coach: 2, hap: 2 }, msg: "He tells the manager. The club loves the answer." },
        { t: "Bring your family along", e: { hap: 4, club: 2 }, msg: "A warm, loud dinner. Everyone is charming." },
      ],
    },
    {
      id: "manager", title: "The manager's plan",
      text: (f, c) => `The ${c.name} manager shows you a screen with your name in the middle of his plan for the season. "No pressure," he says, with a smile that says the opposite.`,
      choices: [
        { t: "Say you will deliver", e: { coach: 3, hype: 3, hap: 1 }, msg: "He likes the attitude.", risk: 0.3, riskE: { coach: -2, hap: -2 }, riskMsg: "You start slowly, and he reminds you of the promise." },
        { t: "Ask for time to settle in", e: { hap: 2, coach: 1 }, msg: "He gives you a month. Not a day more." },
        { t: "Ask for a guaranteed starting place", e: { coach: -3, hap: 1 }, msg: "He shakes your hand and writes it on a list. It is not the list you hoped for." },
      ],
    },
    {
      id: "kids", title: "The academy kids",
      text: (f, c) => `The first visit the club organizes is to the ${c.name} academy. Two hundred kids are wearing your name on their backs, which was printed this morning.`,
      choices: [
        { t: "Stay with the kids for the whole afternoon", e: { club: 4, fame: 2, hap: 3, fit: -1 }, msg: "A kid gives you a drawing. You keep it." },
        { t: "Take a quick photo", e: { club: 1, fame: 1 }, msg: "A few smiles, a few autographs, and you are gone." },
        { t: "Play a game with them", e: { club: 3, fame: 3, hap: 4 }, msg: "You lose to a ten-year-old. It goes on the club's social media.", risk: 0.2, riskE: { fit: -2 }, riskMsg: "You twist your ankle trying a rabona. The kids cheer anyway." },
      ],
    },
  ];

  function welcomeStep(f, c, old, next) {
    if (!c || (c.rep || 0) < 82) return next();
    const pool = WELCOMES.filter((w) => (!w.when || w.when(f, c, old)) && w.id !== f.lastWelcome);
    const w = pick(pool.length ? pool : WELCOMES);
    f.lastWelcome = w.id;
    const fans = ri(30, 55) * 1000 + (c.rep >= 90 ? ri(15, 30) * 1000 : 0);
    const flavor = welcomeFlavor(c);
    card({
      tag: T("Welcome"), iconSrc: c.logo || ICON, title: w.title,
      lead: `${w.text(f, c, old, fans)}${flavor ? `<br><br><i>${esc(flavor)}</i>` : ""}<br><br>${T("What do you do?")}`,
      rows: [[T("Club"), c.name], [T("League"), c.lName || ""], [T("Wage"), `${money(f.wage)}/${T("yr")}`]],
      choices: w.choices.map((ch) => [
        ch.t,
        () => {
          let rows = applyEffects(f, ch.e || {});
          let msg = ch.msg || "";
          if (ch.risk && rnd() < ch.risk) {
            rows = applyEffects(f, ch.riskE || {}, rows);
            msg = ch.riskMsg || msg;
          }
          sayIt(`${w.title}: ${ch.t.toLowerCase()}.`);
          card({ iconSrc: E("1f4ac"), title: w.title, lead: msg || T("You settle in."), rows, ok: next });
        },
      ]),
    });
  }

  function transferStep(f) {
    return (next) => {
      if (!f.pro) return next();
      const expired = !f.contract || f.contract.years <= 0;
      if (state.age >= 36) {
        card({
          iconSrc: (f.club && f.club.logo) || ICON,
          title: T("The end is close"),
          lead: T("Your body is sending invoices. The club wants to know your plans. So does your family."),
          rows: [
            [T("Age"), String(state.age)],
            [T("Contract"), expired ? T("Expired") : `${f.contract.years} ${T("years")}`],
            [T("Trophies"), String(f.trophies.length)],
          ],
          choices: [
            [
              T("Retire now"),
              () => {
                retire(f, T("You choose to leave on your own terms, with the stadium singing your name."));
                next();
              },
            ],
            [
              T("Play one more year"),
              () => {
                f.wage = Math.max(45000, Math.round(f.wage * 0.7));
                if (f.contract) {
                  f.contract.years = 1;
                  f.contract.wage = f.wage;
                }
                sayIt("I decided to play one more year.");
                card({
                  iconSrc: f.club.logo,
                  title: T("One more"),
                  lead: T("The club gives you another year. The legs are heavier, but the brain is sharper."),
                  rows: [[T("Wage"), `${money(f.wage)}/${T("yr")}`]],
                  ok: next,
                });
              },
            ],
            [
              T("Drop to a smaller league"),
              () => {
                const small = ALL_CLUBS.filter((x) => x.division === 1 && x.c.rep <= Math.max(55, (f.club ? f.club.rep : 70) - 12));
                if (!small.length) return next();
                const c = clubRef(small[0].l, small[0].c, 1);
                joinClub(f, c);
                sayIt(`I moved to ${c.name} to keep playing.`);
                card({
                  iconSrc: c.logo,
                  title: T("New chapter"),
                  lead: `You join ${c.name}. Less pressure, more minutes, and a chance to finish properly.`,
                  rows: [[T("Club"), c.name], [T("Wage"), `${money(f.wage)}/${T("yr")}`]],
                  ok: next,
                });
              },
            ],
          ],
        });
        return;
      }

      const last = f.lastSeason;
      const interest =
        (f.hype || 0) + (last ? Math.max(0, last.rating - 6.4) * 18 : 0) + f.fame * 0.35 + f.skill - (f.club ? f.club.rep : 60) * 0.55;
      const tenure = f.joinedYear != null ? year() - f.joinedYear : 9;
      const unhappy = f.clubRel < 25 && f.coachRel < 25;
      if (!expired && tenure < 2 && !unhappy) return next(); // [fix] just signed: no offers for two seasons
      const shouldTalk = expired || interest >= 26 || rnd() < 0.35 || unhappy;
      if (!shouldTalk) return next();

      const offers = transferOffers(f, 2);
      const unwanted = f.clubRel < 25 && (expired || f.coachRel < 25);
      const choices = [
        [
          expired ? T("Re-sign with the club") : T("Stay and sign a new deal"),
          () => {
            const bump = Math.round((expired ? ri(5, 15) : ri(18, 38)) * clampN(0.4 + f.clubRel / 80, 0.4, 1.4)); // [mod] a happy club pays more
            f.wage = Math.max(45000, Math.round((f.wage * (1 + bump / 100)) / 1000) * 1000);
            f.contract = { wage: f.wage, years: 4, release: f.wage * 12 };
            f.clubRel = clampN(f.clubRel + 8, 0, 100);
            f.coachRel = clampN(f.coachRel + 5, 0, 100);
            state.money = Math.max(0, (Number(state.money) || 0) + Math.round(f.wage * 0.15));
            syncJob(f);
            sayIt(`I signed a new contract with ${f.club.name}.`);
            card({
              iconSrc: f.club.logo,
              title: T("New contract"),
              lead: `You stay at ${f.club.name}. The wage goes up ${bump}% and the release clause goes with it.`,
              rows: [
                [T("Wage"), `${money(f.wage)}/${T("yr")}`],
                [T("Contract"), `4 ${T("years")}`],
                [T("Signing bonus"), money(Math.round(f.wage * 0.15))],
              ],
              ok: next,
            });
          },
        ],
      ];
      offers.forEach((c) => {
        choices.push([
          `${T("Join")} ${c.name} · ${money(Math.round(wageFor(c, f.skill, f.fame) * (1 + f.fame / 220)))}`,
          () => {
            const old = f.club;
            joinClub(f, c);
            sayIt(`I transferred from ${old ? old.name : "free agency"} to ${c.name}.`);
            playSnd("achievement");
            card({
              iconSrc: c.logo,
              title: T("Transfer complete"),
              lead: `You are a ${c.name} player. New city, new dressing room, same hunger.`,
              rows: [
                [T("From"), old ? old.name : T("Free agent")],
                [T("To"), c.name],
                [T("League"), c.lName],
                [T("Wage"), `${money(f.wage)}/${T("yr")}`],
                [T("Contract"), `4 ${T("years")}`],
              ],
              ok: () => welcomeStep(f, c, old, next),
            });
          },
        ]);
      });
      if (choices.length < 3) {
        choices.push([
          T("Let your agent keep looking"),
          () => {
            f.hype = clampN(f.hype + 8, 0, 100);
            sayIt("I told my agent to keep looking for the right move.");
            card({
              iconSrc: E("1f4e2"),
              title: T("Waiting for the right offer"),
              lead: T("You stay where you are for now. Your agent has a list and a plan."),
              rows: [[T("Hype"), `${Math.round(f.hype)}%`]],
              ok: next,
            });
          },
        ]);
      }
      if (unwanted && choices.length > 1) choices.shift(); // [mod] a club that does not like you will not offer a new deal
      card({
        iconSrc: (f.club && f.club.logo) || ICON,
        title: expired ? T("Your contract has expired") : T("Transfer window"),
        lead: unwanted
          ? "The club made it clear: there will be no new deal. Your relationship with the coach and the board has gone cold, and your agent is already on the phone."
          : expired
            ? "You are a free agent. Every club in this list can sign you without a fee. Choose carefully."
            : "Your agent has been busy. These clubs want to talk, and your current club wants to keep you.",
        rows: [
          [T("Current club"), f.club ? f.club.name : "—"],
          [T("Wage"), `${money(f.wage)}/${T("yr")}`],
          [T("Contract"), expired ? T("Expired") : `${f.contract.years} ${T("years")}`],
          [T("Interest"), `${Math.round(Math.min(100, Math.max(0, interest)))}%`],
        ],
        choices: choices.slice(0, 3),
      });
    };
  }

  // ------------------------------------------------------------------ random events
  function pickEvent(f) {
    const all = window.FL_FUTBOL_EVENTS || [];
    const due = FOLLOWUPS.filter((x) => !f.recent.includes(x.id) && !f.memLog.some((m) => m.id === x.id) && x.when(f));
    if (due.length && rnd() < 0.6) return pick(due);
    if (!all.length) return null;
    // [mod] about 45% of the random events are life outside football (ev.life), the rest are football stories
    const wantLife = rnd() < 0.45;
    const hasLife = all.some((x) => x && x.life);
    const pool = all.filter((ev) => {
      if (!ev || !ev.choices || ev.choices.length < 2) return false;
      if (hasLife && !!ev.life !== wantLife) return false;
      if (ev.min && state.age < ev.min) return false;
      if (ev.max && state.age > ev.max) return false;
      if (ev.tier === "pro" && !f.pro) return false;
      if (ev.tier === "youth" && !f.youth) return false;
      if (f.recent.slice(-8).includes(ev.id)) return false;
      return true;
    });
    if (!pool.length) return null;
    const total = pool.reduce((n, ev) => n + (ev.w || 4), 0);
    let roll = rnd() * total;
    for (const ev of pool) {
      roll -= ev.w || 4;
      if (roll <= 0) return ev;
    }
    return pool[pool.length - 1];
  }

  // At most MAX_EVENTS "event" cards per season (decision moments + random events). Exceptions that never count and
  // are never skipped: follow-ups of your past choices, the special events below, the derby, the national team,
  // continental nights (Champions League and the like), cups, the World Cup and other national-team tournaments,
  // transfers/contracts, results and objectives. Only the regular league/youth moments and random events count.
  const MAX_EVENTS = 6;
  const SPECIAL_EVENTS = new Set(["injury", "callup", "retirement", "firstteam", "clause", "scouts", "captain"]);
  const isSpecialEvent = (ev) => !!ev && (ev.special === true || SPECIAL_EVENTS.has(ev.id) || String(ev.id || "").startsWith("fu_"));
  const counted = (f, fn) => (next) => {
    if ((f.evCount || 0) >= MAX_EVENTS) return next();
    f.evCount = (f.evCount || 0) + 1;
    return fn(next);
  };

  function eventStep(f) {
    return (next) => {
      if (state.prison) return next(); // no football decisions behind bars
      const ev = pickEvent(f);
      if (!ev) return next();
      if (!isSpecialEvent(ev)) {
        if ((f.evCount || 0) >= MAX_EVENTS) return next(); // the season already had its 6 events
        f.evCount = (f.evCount || 0) + 1;
      }
      f.recent.push(ev.id);
      if (f.recent.length > 14) f.recent.shift();
      const text = typeof ev.text === "function" ? ev.text(f) : ev.text;
      card({
        tag: ev.life ? T("Life") : T("Football Life"),
        iconSrc: ev.life ? E(ev.icon || "1f9d1") : E("1f4f0"),
        title: ev.title,
        lead: `${text}<br><br>${T("What do you do?")}`,
        rows: ev.life
          ? [[T("Age"), String(state.age)], [T("Money"), money(state.money)]]
          : [
              [T("Club"), f.club ? f.club.name : "—"],
              [T("Age"), String(state.age)],
            ],
        choices: ev.choices.map((ch, ci) => [
          ch.t,
          () => {
            f.memLog.push({ id: ev.id, c: ci, y: year() });
            if (f.memLog.length > 40) f.memLog.shift();
            let rows = [];
            let msg = ch.msg || "";
            if (typeof ch.run === "function") {
              const api = {
                f,
                state,
                ri,
                pick,
                chance: (p) => rnd() < p,
                money,
                apply: (o) => applyEffects(f, o),
                addTrophy: (n, k, i, s) => addTrophy(f, n, k || "individual", i, s),
                say: sayIt,
              };
              const res = ch.run(f, api);
              if (res && typeof res === "object") {
                rows = res.rows || rows;
                msg = res.msg || msg;
              }
            } else {
              rows = applyEffects(f, ch.e || {});
              if (ch.risk && rnd() < ch.risk) {
                rows = applyEffects(f, ch.riskE || {}, rows);
                msg = ch.riskMsg || msg;
              }
            }
            if (!rows.length && ch.e) rows = effectRows(ch.e);
            sayIt(msg ? firstPerson(msg) : `${ev.title}: ${ch.t}.`);
            card({
              iconSrc: E("1f4ac"),
              title: ev.title,
              lead: msg || T("You live with the decision."),
              rows,
              ok: next,
            });
          },
        ]),
      });
    };
  }

  // ------------------------------------------------------------------ season objectives
  // The club sets 2-3 goals at the start of the year; at the season review they are checked and pay
  // (or cost) money, hype and relationships. Targets scale with the club's weight and your position.
  function makeObjectives(f) {
    const list = [];
    const pos = posOf(f);
    if (f.pro) {
      const l = f.club && findLeagueOfClub(f.club);
      let target = 8;
      if (l && Array.isArray(l.clubs) && f.club) {
        const rank = 1 + l.clubs.filter((c) => (c.rep || 0) > (f.club.rep || 0)).length;
        target = clampN(Math.round(rank * 0.85), 1, 18);
      } else if (f.club) {
        target = clampN(Math.round((99 - f.club.rep) / 3), 1, 16);
      }
      list.push({ kind: "pos", target, label: target === 1 ? "Win the league" : `Finish in the top ${target}` });
    } else {
      // [mod] realistic for a youth player: what the academy score formula gives an average year, minus a little
      const exp = f.skill * 0.52 + f.fit * 0.22 + f.form * 0.16 + f.coachRel * 0.1 + 6;
      const t = clampN(Math.round(exp - 3), 45, 80);
      list.push({ kind: "score", target: t, label: `Youth score of ${t}% or more` });
    }
    // [mod] targets come from what you can really expect to play and produce at your age and level
    const rep = f.club ? f.club.rep || 60 : 60;
    const expApps = f.pro ? Math.max(2, Math.round(38 * clampN(0.22 + (f.skill - rep + 14) / 52, 0.1, 1))) : 22;
    const ageF = state.age >= 34 ? 0.8 : state.age >= 32 ? 0.9 : 1;
    if (pos.gk) {
      if (f.pro) {
        const t = Math.max(1, Math.round(expApps * clampN(0.14 + (rep - 55) / 180, 0.08, 0.5) * 0.85 * ageF));
        list.push({ kind: "clean", target: t, label: `Keep ${t} clean sheet${t === 1 ? "" : "s"}` });
      } else {
        const t = f.skill >= 60 ? 6.7 : 6.3; // the youth sim does not count clean sheets, so judge a keeper on rating
        list.push({ kind: "rating", target: t, label: `Average rating ${t} or better` });
        return { year: year(), list };
      }
    } else {
      const per = f.pro ? 0.1 + f.skill / 300 : 0.08 + f.skill / 300;
      const t = Math.max(1, Math.round(expApps * per * pos.goal * 0.8 * ageF));
      list.push({ kind: "goals", target: t, label: `Score ${t} goal${t === 1 ? "" : "s"}` });
    }
    const third = pick(["fit", "rating", "health"]);
    if (third === "fit") list.push({ kind: "fit", target: 65, label: "Finish the season fit (65%+)" });
    else if (third === "rating") {
      const r = f.pro ? (f.skill >= rep + 8 ? 7.0 : f.skill >= rep - 8 ? 6.7 : 6.4) : f.skill >= 60 ? 6.7 : 6.3;
      list.push({ kind: "rating", target: r, label: `Average rating ${r.toFixed(1)} or better` });
    } else list.push({ kind: "health", target: 0, label: "Stay injury-free" });
    return { year: year(), list };
  }

  function objectiveStep(f) {
    return (next) => {
      f.obj = makeObjectives(f);
      card({
        tag: CAREER,
        iconSrc: E("1f3c6"),
        title: T("Season objectives"),
        lead: f.pro
          ? T("The board has set the targets for this season. Hit them and the club notices; miss them and it remembers.")
          : T("The academy director lists what he expects from you this year."),
        rows: f.obj.list.map((o, i) => [`${T("Goal")} ${i + 1}`, T(o.label)]),
        ok: next,
      });
    };
  }

  function testObjective(f, s, o) {
    if (!s) return false;
    switch (o.kind) {
      case "pos": return s.position <= o.target;
      case "goals": return s.goals >= o.target;
      case "clean": return (s.cleanSheets || 0) >= o.target;
      case "rating": return s.rating >= o.target;
      case "score": return s.score >= o.target;
      case "fit": return f.fit >= o.target;
      case "health": return !f.injury;
      default: return false;
    }
  }

  function objectiveReview(f, s, next) {
    const ob = f.obj;
    if (!ob || ob.year !== year() || ob.reviewed) return next();
    ob.reviewed = true;
    let met = 0;
    const rows = ob.list.map((o) => {
      const ok = testObjective(f, s, o);
      if (ok) met++;
      return [T(o.label), ok ? T("Achieved") : T("Missed")];
    });
    const missed = ob.list.length - met;
    const fx = { club: met * 3 - missed * 3, coach: met * 2 - missed * 2, hype: met * 2 - missed };
    if (met) fx.money = Math.round((f.wage || 50000) * 0.05 * met);
    if (met === ob.list.length && f.pro) fx.wagePct = 4;
    const extra = applyEffects(f, fx);
    sayIt(met === ob.list.length ? "I hit every objective the club set for me." : met ? "I hit some of the objectives the club set for me." : "I missed all my objectives this season.");
    card({
      iconSrc: E("1f3c6"),
      title: T("Objectives review"),
      lead:
        met === ob.list.length
          ? T("Every target hit. The board is happy and the numbers show it.")
          : met
            ? T("A mixed report. Some boxes ticked, some not.")
            : T("The board expected more. They will not forget it."),
      rows: [...rows, ...extra],
      ok: next,
    });
  }

  // ------------------------------------------------------------------ playable key match (derby day)
  // [mod] A lesser cup (league cup, super cup...) that sometimes takes the place of the derby. You play the rounds
  // with a rotated squad; if you reach the final you play it yourself, six moments, like the derby.
  const SEC_CUPS = [
    [/premier league/i, "EFL Cup"], [/la ?liga|primera/i, "Supercopa de España"], [/serie a/i, "Supercoppa Italiana"], [/bundesliga/i, "DFB Super Cup"],
    [/ligue 1/i, "Trophée des Champions"], [/eredivisie/i, "Johan Cruyff Shield"], [/portug|primeira/i, "Taça da Liga"],
  ];
  const secondaryCupName = (f) => {
    const l = findLeagueOfClub(f.club);
    const n = (l && l.name) || "";
    const hit = SEC_CUPS.find(([re]) => re.test(n));
    return hit ? hit[1] : `${n || T("League")} ${T("League Cup")}`.trim();
  };
  function secondaryCupStep(f) {
    return (next) => {
      if (!f.pro || !f.club) return next();
      const cup = secondaryCupName(f);
      const rounds = [T("Second round"), T("Quarter-final"), T("Semi-final"), T("Final")];
      const power = clubPower(f) - 4; // rotation squad
      let out = -1;
      for (let r = 0; r < rounds.length - 1; r++) {
        const opp = clampN((f.club.rep || 60) + ri(-22, 14), 35, 98);
        if (rnd() >= clampN(0.58 + (power - opp) / 110, 0.1, 0.9)) {
          out = r;
          break;
        }
      }
      const rows = [[T("Cup"), cup], [T("Club"), f.club.name]];
      if (out >= 0) {
        const eff = applyEffects(f, { form: -1, hap: -1 });
        sayIt(`We went out of the ${cup} in the ${rounds[out].toLowerCase()}.`);
        return card({
          tag: T("Cup tie"), iconSrc: (f.club && f.club.cupLogo) || ICON, title: `${cup}: ${T("knocked out")}`,
          lead: T("The manager rested half the team for the league. The cup run ended early, and nobody is losing sleep over it."),
          rows: [...rows, [T("Out in the"), rounds[out]], ...eff], ok: next,
        });
      }
      const l = findLeagueOfClub(f.club);
      const pool = ((l && l.clubs) || []).filter((c) => c && c.name && c.name !== f.club.name);
      const opp = pool.length ? pick(pool) : { name: "Rival FC", rep: f.club.rep };
      card({
        tag: T("Cup tie"), iconSrc: (f.club && f.club.cupLogo) || ICON, title: `${cup}: ${T("reaching the final")}`,
        lead: T("You get through the early rounds with a rotated squad. The final is next, and this time the manager wants you on the pitch."),
        rows: [...rows, [T("Final against"), opp.name]],
        ok: () => keyMatchStep(f, { tag: cup, name: cup, opp, lead: `${T("A cup final. Six moments will decide it, and the decisions are yours.")}` })(next),
      });
    };
  }

  function keyMatchStep(f, cfg) {
    return (next) => {
      if (!f.pro || !f.club) return next();
      const TAG = cfg ? cfg.tag : T("Derby day");
      const l = findLeagueOfClub(f.club);
      const pool = ((l && l.clubs) || []).filter((c) => c && c.name && c.name !== f.club.name);
      const opp = cfg && cfg.opp ? cfg.opp : pool.length ? pick(pool) : { name: "Rival FC", rep: f.club.rep };
      const pos = posOf(f);
      const tm = f.club.rep * 0.6 + f.skill * 0.4;
      const to = (opp.rep || f.club.rep) * 0.6 + 55 * 0.4;
      const lm = Math.max(0.3, 1.25 * (1 + (tm - to) / 90));
      const lo = Math.max(0.3, 1.05 * (1 - (tm - to) / 130));
      // [mod] cfg.n = number of decisions (derby/cups: 6; the continental cup uses 3 / 4 / 6 by round)
      const nMoments = cfg && cfg.n ? cfg.n : 6;
      const minutes = nMoments === 6 ? [11, 26, 41, 57, 72, 86] : nMoments === 4 ? [12, 36, 60, 82] : nMoments === 3 ? [15, 48, 80] : Array.from({ length: nMoments }, (_, i) => Math.round(8 + (i * 78) / Math.max(1, nMoments - 1)));
      const m = { my: 0, op: 0, goals: 0, assists: 0, i: 0, note: T("The stadium is full and loud. Everybody knows what this one means.") };
      const poisson = (lam) => {
        let L = Math.exp(-lam), k = 0, p = 1;
        do { k++; p *= rnd(); } while (p > L && k < 10);
        return k - 1;
      };
      const A = (id) => f.attrs[id] || 50;
      const formFx = (f.form - 50) / 500;
      // [mod] extra kinds of decisions for the continental nights: a penalty you take yourself and a free kick
      const advance = () => { m.i++; (m.i >= minutes.length ? finish : moment)(); };
      const penMoment = () => {
        const min = minutes[m.i];
        const tag = `${min}'`;
        m.pens = (m.pens || 0) + 1;
        const rows = [[T("Score"), `${f.club.name} ${m.my} - ${m.op} ${opp.name}`], [T("Minute"), tag]];
        const done = (goal, personal) => {
          if (goal) { m.my++; if (personal) m.goals++; m.note = personal ? T("You send the keeper the wrong way. GOAL!") : T("The captain steps up and scores.") }
          else m.note = personal ? T("The keeper guesses right and the penalty is saved.") : T("The captain misses. The stadium groans.");
          advance();
        };
        if (pos.gk) {
          // goalkeepers face the penalty instead
          card({
            tag: TAG, iconSrc: ICON, title: `${tag} - ${T("Penalty against")}`,
            lead: `${m.note}<br><br>${T("The referee points to the spot. The whole stadium goes quiet.")}`, rows,
            choices: [T("Dive left"), T("Dive right"), T("Stay in the middle")].map((txt, k) => [txt, () => {
              if (rnd() < (k === 2 ? 0.14 : 0.24) + A("reaction") / 350) m.note = T("You guess right and push it away! The save of the night.");
              else { m.op++; m.note = T("You guess wrong. It is in the net."); }
              advance();
            }]),
          });
          return;
        }
        card({
          tag: TAG, iconSrc: ICON, title: `${tag} - ${T("Penalty!")}`,
          lead: `${m.note}<br><br>${T("The referee points to the spot. The captain looks at you.")}`, rows,
          choices: [
            [T("Take it yourself"), () => {
              if (window.FL_PEN)
                FL_PEN.kick({
                  ...penaltyBase(f, f.club && f.club.name), title: `${TAG} · ${tag}`, subtitle: T("The whole stadium is watching"),
                  pressure: 0.9, keeper: clampN(0.45 + ((opp.rep || 70) - 60) / 200, 0.3, 0.8),
                  onDone: (r) => done(!!r.goal, true),
                });
              else done(rnd() < 0.62 + A("shooting") / 500, true);
            }],
            [T("Let the captain take it"), () => done(rnd() < 0.72, false)],
          ],
        });
      };
      const fkMoment = () => {
        const min = minutes[m.i];
        const tag = `${min}'`;
        const rows = [[T("Score"), `${f.club.name} ${m.my} - ${m.op} ${opp.name}`], [T("Minute"), tag]];
        const go2 = (txt, fn) => [txt, () => { fn(); advance(); }];
        card({
          tag: TAG, iconSrc: ICON, title: `${tag} - ${T("Free kick")}`,
          lead: `${m.note}<br><br>${T("A free kick, 25 metres out, right in front of goal. The ball is yours.")}`, rows,
          choices: [
            go2(T("Shoot at goal"), () => {
              if (rnd() < 0.07 + A("shooting") / 320 + formFx) { m.my++; m.goals++; m.note = T("It bends over the wall and into the corner. GOAL!"); }
              else m.note = T("It clips the wall and runs out for a corner.");
            }),
            go2(T("Cross it in"), () => {
              if (rnd() < 0.22 + A("passing") / 320 + formFx && rnd() < 0.6) { m.my++; m.assists++; m.note = T("Your delivery is perfect and a teammate heads it in. ASSIST!"); }
              else m.note = T("The keeper punches it clear.");
            }),
            go2(T("Play it short"), () => { m.note = T("A quick one-two keeps the move alive, but nothing comes of it."); }),
          ],
        });
      };
      const pickKind = () => {
        if (!(cfg && cfg.variety)) return null;
        const r = rnd();
        if ((m.pens || 0) < 1 && r < 0.2) return "pen";
        if (!pos.gk && r < 0.38) return "fk";
        return null;
      };
      const moment = () => {
        const kind = pickKind();
        if (kind === "pen") return penMoment();
        if (kind === "fk") return fkMoment();
        const min = minutes[m.i];
        const attack = pos.gk ? false : rnd() < 0.5 + pos.goal * 0.08 - pos.def * 0.06;
        const tag = `${min}'`;
        const rows = [[T("Score"), `${f.club.name} ${m.my} - ${m.op} ${opp.name}`], [T("Minute"), tag]];
        const go = (txt, fn) => [txt, () => { fn(); m.i++; (m.i >= minutes.length ? finish : moment)(); }];
        if (attack) {
          card({
            tag: TAG, iconSrc: ICON, title: `${tag} - ${T("Your chance")}`,
            lead: `${m.note}<br><br>${T("The ball falls to you at the edge of the box. What do you do?")}`, rows,
            choices: [
              go(T("Shoot"), () => {
                if (rnd() < 0.1 + A("shooting") / 260 + formFx) { m.my++; m.goals++; m.note = T("You hit it clean. GOAL! The stadium erupts."); }
                else m.note = T("You get it away, but the keeper dives and stops it.");
              }),
              go(T("Play the through ball"), () => {
                if (rnd() < 0.3 + A("passing") / 300 + formFx && rnd() < 0.55) { m.my++; m.assists++; m.note = T("A perfect pass. Your teammate scores. ASSIST!"); }
                else m.note = T("The pass is just too long. It runs out for a goal kick.");
              }),
              go(T("Take him on"), () => {
                if (rnd() < 0.35 + A("dribbling") / 250 + formFx) {
                  if (rnd() < 0.3) { m.my++; m.goals++; m.note = T("You skin him and finish. GOAL!"); }
                  else m.note = T("You beat your man, but the shot is blocked.");
                } else { if (rnd() < 0.12) { m.op++; m.note = T("You lose it and they break away. They score."); } else m.note = T("You lose the ball but the team recovers."); }
              }),
            ],
          });
        } else {
          card({
            tag: TAG, iconSrc: ICON, title: `${tag} - ${T("Danger")}`,
            lead: `${m.note}<br><br>${pos.gk ? T("A shot is coming at you from close range.") : T("They break forward and you are the last line.")}`, rows,
            choices: pos.gk
              ? [
                  go(T("Dive left"), () => { if (rnd() < 0.5 + A("reaction") / 300) m.note = T("Great save! You tip it round the post."); else { m.op++; m.note = T("Wrong way. It's in."); } }),
                  go(T("Dive right"), () => { if (rnd() < 0.5 + A("reaction") / 300) m.note = T("Great save! You tip it round the post."); else { m.op++; m.note = T("Wrong way. It's in."); } }),
                  go(T("Stay big and wait"), () => { if (rnd() < 0.45 + A("physical") / 400) m.note = T("You make yourself big and the shot hits you."); else { m.op++; m.note = T("It goes through you. Goal."); } }),
                ]
              : [
                  go(T("Slide in"), () => { if (rnd() < 0.45 + A("defending") / 260) m.note = T("Clean tackle. The crowd roars."); else if (rnd() < 0.45) { m.op++; m.note = T("You miss the ball. They score."); } else m.note = T("You miss it, but the keeper saves."); }),
                  go(T("Read the pass"), () => { if (rnd() < 0.4 + A("vision") / 300 + A("reaction") / 600) m.note = T("You step in and cut it out."); else if (rnd() < 0.35) { m.op++; m.note = T("You guessed wrong. They score."); } else m.note = T("Wrong read, but the shot goes wide."); }),
                  go(T("Drop and hold the line"), () => { if (rnd() < 0.2) { m.op++; m.note = T("They find a gap anyway. Goal."); } else m.note = T("The line holds. They have nothing."); }),
                ],
          });
        }
      };
      const finish = () => {
        m.my += poisson(lm * (1 - 0.1 * minutes.length));
        m.op += poisson(lo * (1 - 0.1 * minutes.length));
        let res = m.my > m.op ? "win" : m.my === m.op ? "draw" : "loss";
        let pens = false;
        const restDefault = () => {
        f.career.goals += m.goals;
        f.career.assists += m.assists;
        const fx = res === "win" ? { fame: 3, form: 6, club: 5, hype: 4, money: Math.round((f.wage || 50000) * 0.02) } : res === "draw" ? { form: 1, club: 1 } : { form: -5, club: -3, coach: -2, hype: -2 };
        const eff = applyEffects(f, fx);
        const text = `${f.club.name} ${m.my} - ${m.op} ${opp.name}${pens ? ` (${res === "win" ? T("won on penalties") : T("lost on penalties")})` : ""}`;
        if (cfg && res === "win") {
          addTrophy(f, cfg.name, "cup", f.club.cupLogo || f.club.logo, f.club.name);
          state.money = (Number(state.money) || 0) + Math.round((f.wage || 50000) * 0.5);
          sayIt(`We won the ${cfg.name}!`);
          playSnd("chaChing");
        }
        sayIt(res === "win" ? `I helped beat ${opp.name} ${m.my}-${m.op} in a derby.` : res === "draw" ? `We drew ${m.my}-${m.op} with ${opp.name}.` : `We lost ${m.my}-${m.op} to ${opp.name}.`);
        card({
          tag: TAG, iconSrc: ICON, title: cfg ? (res === "win" ? `${cfg.name}: ${T("winners")}` : `${cfg.name}: ${T("runners-up")}`) : res === "win" ? T("Derby won") : res === "draw" ? T("Derby drawn") : T("Derby lost"),
          lead: cfg ? (res === "win" ? T("A trophy is a trophy. The dressing room is a mess of champagne and noise.") : T("So close. A final lost, and the medals are the wrong colour.")) : res === "win" ? T("The whole city is singing. This is why you play.") : res === "draw" ? T("A point each. Nobody is happy and nobody is crushed.") : T("A quiet bus ride home and a long night."),
          rows: [[T("Final"), text], [T("Your goals"), String(m.goals)], [T("Your assists"), String(m.assists)], ...eff],
          ok: next,
        });
        };
        // [mod] cfg.onFinish takes over the ending (the continental cup updates its own table and bracket)
        const rest =
          cfg && cfg.onFinish
            ? () => {
                f.career.goals += m.goals;
                f.career.assists += m.assists;
                cfg.onFinish({ my: m.my, op: m.op, goals: m.goals, assists: m.assists, res, pens }, next);
              }
            : restDefault;
        if (cfg && res === "draw" && !cfg.group) {
          pens = true;
          penaltyShootout(f, f.club.name, opp.name, tm, to, (won) => {
            res = won ? "win" : "loss";
            rest();
          });
        } else rest();
      };
      card({
        tag: TAG, iconSrc: (f.club && f.club.logo) || ICON, title: `${f.club.name} vs ${opp.name}`,
        lead: cfg ? cfg.lead : T("The biggest match of your season. Six moments will decide it, and the decisions are yours."),
        rows: [[T("Opponent"), opp.name], [T("Your form"), `${Math.round(f.form)}%`], [T("Fitness"), `${Math.round(f.fit)}%`]],
        choices: [[T("Kick off"), moment]],
      });
    };
  }

  // ------------------------------------------------------------------ events with memory
  // Past choices (f.memLog) come back later: follow-up events fire when an earlier event is still hanging around.
  const FOLLOWUPS = [
    {
      id: "fu_medical", title: "The medical file leaks",
      when: (f) => f.memLog.some((m) => m.id === "injury" && m.c === 2 && year() - m.y <= 4),
      text: () => "A journalist has your medical file from the time you hid your injury. The club wants to know what else you kept quiet.",
      choices: [
        { t: "Admit it publicly", e: { fame: -1, club: 3, coach: 3, hap: -3 }, msg: "You face the cameras and say it straight. The storm passes faster than you thought." },
        { t: "Deny everything", e: { club: -4, hap: -2 }, msg: "You deny it. Then a second source appears.", risk: 0.5, riskE: { fame: -3, club: -6, coach: -5, hype: -4 }, riskMsg: "Nobody believes you and the club fines you for lying." },
        { t: "Blame the club doctor", e: { club: -6, coach: -2 }, msg: "It works for a week. Then the doctor talks to the press." },
      ],
    },
    {
      id: "fu_photos", title: "The photos resurface",
      when: (f) => f.memLog.some((m) => m.id === "party" && year() - m.y <= 3),
      text: () => "Photos from that party are back on social media, now with a headline attached. Your sponsors are calling.",
      choices: [
        { t: "Post an apology", e: { fame: -1, club: 2, hap: -2 }, msg: "The apology lands well enough. The story fades in two days." },
        { t: "Ignore it", e: { hype: -3, club: -2 }, msg: "Silence works until it doesn't.", risk: 0.4, riskE: { money: -45000, hype: -4 }, riskMsg: "A sponsor drops you over it." },
        { t: "Call a lawyer", e: { money: -12000, hap: -1 }, msg: "The photos come down. The story does not." },
      ],
    },
    {
      id: "fu_rival", title: "The rivalry boils over",
      when: (f) => f.memLog.some((m) => m.id === "rival" && year() - m.y <= 4),
      text: () => "Your old rival is back in the headlines and the press is selling it as a war between the two of you.",
      choices: [
        { t: "Fuel the fire", e: { fame: 3, hype: 5, club: -1, coach: -2 }, msg: "Everyone talks about you. The manager is not delighted." },
        { t: "Shake hands in public", e: { fame: 1, club: 3, hap: 3 }, msg: "A calm photo, a calm week. Fans call it class." },
        { t: "Settle it on the pitch", e: { form: 5, fit: -3 }, msg: "You train like it is a final. It shows.", risk: 0.25, riskE: { injury: 4 }, riskMsg: "You push too hard and pull something." },
      ],
    },
    {
      id: "fu_manager", title: "The manager remembers",
      when: (f) => f.memLog.some((m) => (m.id === "disrespect" || m.id === "coach" || m.id === "criticism") && year() - m.y <= 3),
      text: () => "The manager has not forgotten what happened between you two. The team sheet on Saturday says it all.",
      choices: [
        { t: "Ask for a private talk", e: { coach: 5, hap: 1 }, msg: "He listens, grudgingly. You are back in the squad by Saturday." },
        { t: "Prove it in training", e: { form: 3, fit: -2, coach: 2 }, msg: "You win every drill. He looks at you differently." },
        { t: "Ask your agent to find another club", e: { coach: -4, club: -3 }, msg: "Word gets out. The atmosphere gets heavier." },
      ],
    },
    {
      id: "fu_agent", title: "Your agent calls in a favor",
      when: (f) => f.memLog.some((m) => m.id === "agent" && year() - m.y <= 4),
      text: () => "The agent who made things happen for you now wants something back: a favor, a signature and no questions.",
      choices: [
        { t: "Do the favor", e: { money: 25000, club: -2, hype: 2 }, msg: "He keeps his side. You keep your mouth shut.", risk: 0.3, riskE: { fame: -3, club: -6, hype: -4 }, riskMsg: "It turns out to be shady and it comes back on you." },
        { t: "Refuse politely", e: { hap: 1 }, msg: "He takes it badly but you sleep fine." },
        { t: "Fire him", e: { money: -30000, hap: 2 }, msg: "A clean break. Finding a new one costs you." },
      ],
    },
    {
      id: "fu_sponsor", title: "The sponsor wants a favor",
      when: (f) => f.memLog.some((m) => m.id === "sponsor" && year() - m.y <= 4),
      text: () => "The brand that signed you wants you in a campaign that is a little more than you agreed to.",
      choices: [
        { t: "Do the campaign", e: { money: 60000, fame: 2, fit: -2 }, msg: "A long shoot, a big check and your face on a billboard." },
        { t: "Stick to the contract", e: { hap: 1 }, msg: "They grumble and respect it." },
        { t: "Renegotiate", e: { money: 25000 }, msg: "You squeeze a bit more out of them.", risk: 0.3, riskE: { money: -20000, hype: -2 }, riskMsg: "They walk away from the table. Ouch." },
      ],
    },
  ];

  // ------------------------------------------------------------------ season flow
  function resultsStep(f) {
    return (next) => {
      if (f.simulatedAge === state.age) return next();
      let summary = null;
      let youth = null;
      if (f.pro) {
        summary = simulatePro(f);
      } else {
        youth = simulateYouth(f);
      }
      f.simulatedAge = state.age;
      renderAll();

      if (!f.pro) {
        const rows = [
          [T("Season"), `${year()} · ${T("Youth")}`],
          [T("Club"), f.club ? f.club.name : T("Academy")],
          [T("Youth score"), `${Math.round(youth.score)}%`],
          [T("Appearances"), String(youth.apps)],
          [T("Goals"), String(youth.goals)],
          [T("Assists"), String(youth.assists)],
          [T("Average rating"), youth.rating.toFixed(1)],
          [T("Development"), `${youth.growth > 0 ? "+" : ""}${youth.growth} ${T("skill")}`],
          [T("Money"), money(state.money)],
        ];
        if (f.injury) rows.push([T("Injury"), `${f.injury.weeks} ${T("weeks left")}`]);
        if (hasTrophy(f, T("Youth MVP"), year())) rows.push([T("Awards"), T("Youth MVP")]);
        card({
          iconSrc: (f.club && f.club.logo) || ICON,
          title: T("Youth season review"),
          lead:
            youth.score >= 82
              ? T("The coaches are talking about you. The first team staff came to watch twice.")
              : youth.score >= 65
                ? T("A solid year. You are moving in the right direction.")
                : T("A difficult year. The coaches want more, and so do you."),
          rows,
          bars: [
            [T("Skill"), f.skill],
            [T("Fitness"), f.fit],
            [T("Fame"), f.fame],
          ],
          ok: () => objectiveReview(f, youth, next),
        });
        return;
      }

      const rows = [
        [T("Club"), `${f.club.name} · ${summary.league}`],
        [T("Finish"), `${ordinal(summary.position)} · ${summary.points} ${T("pts")}`],
        [T("Record"), `${summary.wins}W ${summary.draws}D ${summary.losses}L`],
        [T("Appearances"), String(summary.apps)],
        [T("Goals"), String(summary.goals)],
        [T("Assists"), String(summary.assists)],
      ];
      if (posOf(f).gk) rows.push([T("Clean sheets"), String(summary.cleanSheets)]);
      rows.push([T("Average rating"), summary.rating.toFixed(1)]);
      rows.push([T("Cup"), summary.cupResult]);
      rows.push([T("Continental"), summary.contResult]);
      if (summary.natOut && summary.natOut.length) rows.push(...summary.natOut);
      if (summary.awards.length) rows.push([T("Awards"), summary.awards.join(", ")]);
      rows.push([T("Season earnings"), money(summary.salary)]);
      rows.push([T("Contract"), summary.expired ? T("Expired") : `${f.contract.years} ${T("years")}`]);
      card({
        iconSrc: (f.club && f.club.logo) || ICON,
        title: `${year()} · ${T("Season review")}`,
        lead:
          summary.position === 1
            ? T("Champions. The city is going to remember this one.")
            : summary.position <= 4
              ? T("A strong finish. European nights are coming.")
              : summary.position <= 10
                ? T("Mid-table. Safe, forgettable, and not what you want.")
                : T("A relegation fight. Nobody enjoyed that, least of all you."),
        rows,
        bars: [
          [T("Skill"), f.skill],
          [T("Fitness"), f.fit],
          ...ATTRS.map((a) => [a.n, Math.round(f.attrs[a.id])]),
        ],
        ok: () => objectiveReview(f, summary, next),
      });
    };
  }

  function buildSeasonSteps(f) {
    const steps = [];
    steps.push((next) => statusCard(f, next));
    steps.push(objectiveStep(f));
    const age = state.age;
    const scouted = f.scouted || f.academy;
    if (!f.pro && !scouted && age >= 15 && (f.skill >= 85 || f.gifted || (f.waitAcademy || 0) > 0 || age >= 18 || (age >= 16 && rnd() < Math.max(0, (scoutAppeal(f) - 60) / 110)))) {
      steps.push(scoutStep(f));
    }
    f.fatigue = Math.max(10, (f.fatigue || 0) - 45); // off-season rest
    f.trainLeft = f.pro ? 4 : 3; // training blocks you can use this season, whenever you want (see trainNow)
    if (!f.pro) {
      steps.push(counted(f, momentStep("youth", f)));
      if (age >= 17) steps.push(promotionStep(f));
    } else {
      steps.push(counted(f, momentStep("league", f)));
      steps.push(momentStep("cup", f)); // competitions never count toward the event cap
      steps.push(rnd() < 0.4 ? secondaryCupStep(f) : keyMatchStep(f)); // [mod] sometimes a lesser cup instead of the derby
      const qualified = f.qualified || (f.lastSeason && f.lastSeason.qualified) || (f.club && f.club.rep >= 87);
      if (qualified) steps.push(momentStep("continental", f));
      if (f.nat.called && (isWorldCupYear() || isContinentalYear())) steps.push(natCallStep(f)); // [mod] the tournament is played week by week
    }
    steps.push(resultsStep(f));
    if (f.pro) steps.push(transferStep(f));
    const slots = 2 + (rnd() < 0.6 ? 1 : 0) + (rnd() < 0.35 ? 1 : 0) + (rnd() < 0.15 ? 1 : 0);
    for (let i = 0; i < slots; i++) steps.push(eventStep(f));
    return steps;
  }

  function runSteps(f, steps, done) {
    let i = 0;
    let ended = false;
    const finish = () => {
      if (ended) return;
      ended = true;
      resumeFlow = null;
      done();
    };
    const next = () => {
      stepAt = Date.now();
      resumeFlow = next;
      if (state.dead || !f.active || state.prison) {
        f.pending = false;
        f.flowDone = true;
        return finish();
      }
      if (i >= steps.length) return finish();
      const step = steps[i++];
      const open = () => {
        try {
          step(next);
        } catch (err) {
          console.warn("[futbol] step", err);
          next();
        }
      };
      if (typeof queuePopup === "function") queuePopup(open);
      else setTimeout(open, 350);
    };
    next();
  }

  let flowActive = false;
  // [fix] the season flow is a chain of popups. If one gets dropped (jCard returns early, another event
  // replaces the card...) `next` is never called and flowActive stays true: age up was blocked until reload.
  let stepAt = 0;
  let resumeFlow = null;
  function flowStalled() {
    if (!flowActive || !resumeFlow) return false;
    if (Date.now() - stepAt < 2500) return false;
    const evOpen = typeof evWrap !== "undefined" && evWrap && evWrap.classList.contains("open");
    const queued = typeof popupQueue !== "undefined" && popupQueue.length > 0;
    return !evOpen && !queued && !document.querySelector(".notice-wrap");
  }
  function beginSeason(force) {
    const f = F();
    if (!f.active || state.dead) return;
    if (state.prison) {
      f.pending = false;
      noticeIt(T("Football Career"), T("You cannot play football from prison."), null, true);
      return;
    }
    if (f.pending && !flowActive) f.pending = false; // stale flag (the page was reloaded mid-season)
    if (f.pending) {
      noticeIt(T("Season in progress"), T("Answer the current football decision first."), null, true);
      return;
    }
    if (f.seasonAge === state.age && !force) return;
    if (f.simulatedAge === state.age) return;
    f.pending = true;
    f.pendingAt = Date.now();
    f.flowDone = false;
    f.seasonAge = state.age;
    // [mod] inflation: the held contract keeps pace (3%/yr, same as every other job)
    if (typeof window.inflFx === "function" && f.wage) {
      const gap = f.lastInflYear != null ? year() - f.lastInflYear : 0;
      if (gap > 0) {
        const k = Math.pow(1.03, gap);
        f.wage = Math.round((f.wage * k) / 1000) * 1000;
        if (f.contract && f.contract.wage) f.contract.wage = f.wage;
      }
    }
    f.lastInflYear = year();
    if (f.club && f.clubTrack !== f.club.name) {
      f.joinedYear = f.clubTrack === undefined ? year() - 5 : year(); // old saves: assume a long stay
      f.clubTrack = f.club.name;
    }
    f.evCount = 0;
    f.mods = { atk: 0, def: 0, luck: 0 };
    f.momentsUsed = [];
    f.highlights = [];
    const steps = buildSeasonSteps(f);
    syncJob(f);
    flowActive = true;
    runSteps(f, steps, () => {
      flowActive = false;
      f.pending = false;
      f.flowDone = true;
      f.pendingAt = 0;
      renderAll();
    });
  }

  function yearTick() {
    const f = state.futbol;
    if (!f || !f.active || f.retired || state.dead) return;
    if (state.prison) {
      f.pending = false;
      return;
    }
    if (f.pending && !flowActive) f.pending = false;
    if (f.pending) return;
    if (f.seasonAge === state.age) return;
    beginSeason(false);
  }
  // ------------------------------------------------------------------ ui helpers
  const backIcon = () => (typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;");
  const row = (id, icon, title, sub, dis, tail) =>
    `<div class="row${dis ? " dis" : ""}"${id ? ` id="${id}"` : ""}><img src="${icon}" alt=""><div class="t"><b>${esc(title)}</b><span>${esc(sub)}</span></div>${dis ? "" : tail === undefined ? chev() : tail}</div>`;
  const section = (t) => `<div class="sec">${esc(t)}</div>`;
  const tap = (id, fn) => {
    const el = document.getElementById(id);
    if (el && !el.classList.contains("dis"))
      el.onclick = () => {
        playSnd("choice");
        fn();
      };
  };
  const openScreen = (title, fn) => {
    if (typeof screen === "undefined" || typeof sList === "undefined" || typeof sTitle === "undefined") return false;
    screen.classList.add("open");
    sTitle.textContent = String(title).toUpperCase();
    if (typeof sSub !== "undefined" && sSub && sSub.style) sSub.style.display = "none";
    if (typeof sBack !== "undefined" && sBack) {
      sBack.innerHTML = backIcon();
      sBack.onclick = typeof fn === "function" ? fn : () => typeof openSpecialCareers === "function" && openSpecialCareers();
    }
    sList.scrollTop = 0;
    return true;
  };

  // ------------------------------------------------------------------ hub
  function ageOk(f) {
    return f.active && !f.retired;
  }

  function clubBanner(f) {
    if (!f.club) return T("No club");
    return `${f.club.name} · ${f.club.lName || ""}`;
  }

  // ------------------------------------------------------------------ train when YOU decide
  function trainNow(f) {
    const order = f.pro ? ["pre", "early", "mid", "run"] : ["pre", "mid", "run"];
    const left = f.trainLeft || 0;
    if (state.prison) return noticeIt(T("Training"), T("You cannot train from prison."), null, true);
    if (left <= 0)
      return noticeIt(T("Training"), T("You have used all the training blocks of this season. New ones open when the next season starts."), () => openFutbol(), true);
    if (f.injury)
      return noticeIt(T("Training"), T("You are injured. Let it heal or pay for rehab before you train."), () => openFutbol(), true);
    const key = order[Math.min(order.length - 1, Math.max(0, order.length - left))];
    weekBlockStep(f, key, true)(() => {
      f.trainLeft = Math.max(0, (f.trainLeft || 0) - 1);
      openFutbol();
    });
  }

  // ------------------------------------------------------------------ hub tabs
  if (!document.getElementById("flFbCss")) {
    const st = document.createElement("style");
    st.id = "flFbCss";
    st.textContent = ".fb-tabs{display:flex;gap:6px;padding:8px 12px 4px}.fb-tabs button{flex:1;min-height:42px;border-radius:999px;border:2px solid #1a6fd1;background:transparent;color:#1a6fd1;font:inherit;font-weight:800;cursor:pointer;touch-action:manipulation}.fb-tabs button.on{background:#1a6fd1;color:#fff}";
    document.head.appendChild(st);
  }
  function applyTabs(f) {
    const tab = f.tab || "today";
    const groups = [];
    let g = -1;
    [...sList.children].forEach((k) => {
      if (k.classList.contains("sec")) g++;
      (groups[Math.max(g, 0)] ||= []).push(k);
    });
    const keep = { today: [0, 2], career: [1], club: [3] }[tab] || [0, 2];
    groups.forEach((arr, i) => {
      if (!keep.includes(i)) arr.forEach((n) => (n.style.display = "none"));
    });
    const play = document.getElementById("fbPlay");
    if (tab === "today") {
      const st = document.getElementById("fbStatus");
      const col = (v) => (v >= 35 ? "#2fa03b" : v >= 15 ? "#f5841f" : "#b3261e");
      const bar = (label, v, hint, color) => (window.FL_BARS ? FL_BARS.html(label, v, color, hint) : `<div style="margin:5px 0"><b>${esc(label)}</b> ${Math.round(v)}% ${esc(hint)}</div>`);
      const coachTxt = f.coachRel >= 75 ? T("He trusts you") : f.coachRel >= 45 ? T("Fine") : f.coachRel >= 20 ? T("On thin ice") : T("Frozen out");
      const clubTxt = f.clubRel >= 75 ? T("They want you") : f.clubRel >= 45 ? T("Fine") : f.clubRel >= 25 ? T("Cooling") : T("They want you gone");
      if (st)
        st.insertAdjacentHTML(
          "afterend",
          `<div class="row" style="flex-direction:column;align-items:stretch;height:auto;padding:8px 14px">${bar(T("Coach relationship"), f.coachRel, coachTxt, col(f.coachRel))}${bar(T("Club relationship"), f.clubRel, clubTxt, col(f.clubRel))}${bar(T("Fitness"), f.fit, f.injury ? T("Injured") : fatigueLabel(f.fatigue || 0), col(f.fit))}${bar(T("Fame"), f.fame || 0, T("Fans"), "fame")}<div style="font-size:11px;opacity:.65;margin-top:2px">${esc(T("The coach decides your minutes. The club decides your contract and your next move."))}</div></div>`,
        );
    }
    if (play && tab === "today") {
      const ob = f.obj && f.obj.year === year() ? f.obj : null;
      play.insertAdjacentHTML("afterend", row("fbObj", E("1f3c6"), T("Season objectives"), ob ? ob.list.map((o) => T(o.label)).join(" · ") : T("Set when the season starts")));
      tap("fbObj", () => {
        if (!ob) return noticeIt(T("Season objectives"), T("The club sets your goals when the season starts."), null, true);
        card({ tag: CAREER, iconSrc: E("1f3c6"), title: T("Season objectives"), lead: T("What the club expects from you this year."), rows: ob.list.map((o, i) => [`${T("Goal")} ${i + 1}`, `${T(o.label)}${ob.reviewed ? "" : ""}`]), ok: () => openFutbol() });
      });
    }
    if (play && tab === "today") {
      const total = f.pro ? 4 : 3;
      const left = f.trainLeft || 0;
      play.insertAdjacentHTML(
        "afterend",
        row("fbTrainNow", E("1f4aa"), T("Training"), f.injury ? T("Injured: you cannot train right now") : `${left}/${total} ${T("blocks left this season")} · ${T("Fatigue")} ${Math.round(f.fatigue || 0)}%`, !left || !!f.injury),
      );
      tap("fbTrainNow", () => trainNow(f));
    }
    const labels = [["today", T("Today")], ["career", T("Career")], ["club", T("Club")]];
    sList.insertAdjacentHTML("afterbegin", `<div class="fb-tabs">${labels.map(([k, n]) => `<button data-tab="${k}" class="${k === tab ? "on" : ""}">${esc(n)}</button>`).join("")}</div>`);
    sList.querySelectorAll(".fb-tabs button").forEach((b) => {
      b.onclick = () => {
        f.tab = b.dataset.tab;
        playSnd("choice");
        openFutbol();
      };
    });
  }

  function openFutbol() {
    const f = F();
    playSnd("choice");
    openScreen(CAREER, () => typeof openSpecialCareers === "function" && openSpecialCareers());

    if (!ageOk(f)) {
      const retired = f.retired;
      sList.innerHTML =
        section(retired ? T("Career finished") : T("Football")) +
        (retired
          ? row("fbSummary", E("1f3c1"), T("Career summary"), `${f.career.apps} ${T("apps")} · ${f.career.goals} ${T("goals")} · ${f.trophies.length} ${T("trophies")}`) +
            row("fbTrophies", E("1f3c6"), T("Trophy cabinet"), `${f.trophies.length} ${T("pieces of silverware")}`) +
            row("fbHistory", E("1f4d6"), T("Season history"), `${f.history.length} ${T("seasons")}`)
          : row("fbStart", ICON, T("Start a Football Career"), T("High school team, academy, first team, the world")) +
            row("fbAbout", E("1f4d6"), T("How it works"), T("Training, scouts, contracts, cups and the Ballon d'Or")));
      if (retired) {
        tap("fbSummary", () => careerSummaryCard(f));
        tap("fbTrophies", () => trophyScreen(f));
        tap("fbHistory", () => historyScreen(f));
      } else {
        tap("fbStart", () => startCareer());
        tap("fbAbout", () => aboutCard());
      }
      const foot = document.createElement("div");
      foot.className = "mm-foot";
      foot.style.padding = "10px 14px";
      foot.style.textAlign = "left";
      foot.textContent = retired
        ? "A football life ends, but the record stays. Start a new life to do it again."
        : "You can start a football career from age 10. The school team is where every story begins.";
      sList.appendChild(foot);
      return;
    }

    const last = f.lastSeason;
    const pendingTxt = f.pending ? T("Decision waiting") : f.seasonAge === state.age && f.simulatedAge === state.age ? T("Season played") : T("Ready to play");
    sList.innerHTML =
      section(T("Status")) +
      row("fbStatus", (f.club && f.club.logo) || ICON, f.youth ? T("Youth Player") : T("Professional Footballer"), `${clubBanner(f)} · ${posName(f)} · ${Math.round(f.skill)}% ${T("skill")}`) +
      row("fbPlay", E("26bd"), f.pending ? T("Resume the season") : T("Play this season"), `${year()} · ${pendingTxt}`) +
      section(T("Career")) +
      row("fbTrophies", E("1f3c6"), T("Trophy cabinet"), `${f.trophies.length} ${T("trophies")} · ${f.career.goals} ${T("career goals")}`) +
      row("fbStats", E("1f4ca"), T("Career numbers"), `${f.career.apps} ${T("apps")} · ${f.career.goals} ${T("goals")} · ${f.career.assists} ${T("assists")}`) +
      row("fbNat", flagFor(f), T("National team"), f.nat.called ? `${f.nat.caps} ${T("caps")} · ${f.nat.goals} ${T("goals")}` : T("Not called up yet")) +
      row("fbHistory", E("1f4d6"), T("Season history"), `${f.history.length} ${T("seasons")}${last ? ` · ${T("last")}: ${ordinal(last.position)}` : ""}`) +
      row("fbTable", E("1f4ca"), T("League tables"), currentTable(f) ? `${T("Position")}: ${currentTable(f).rows.findIndex((r) => r.me) + 1} · ${T("all leagues")}` : T("All leagues, updated every year")) +
      row("fbSquad", E("1f465"), T("Squad and teammates"), f.club ? `${f.club.name} · ${T("see who you play with")}` : T("No club yet")) +
      row("fbCont", E("1f3c6"), f.cont ? f.cont.name : T("Continental Cup"), f.cont ? (f.cont.done ? (f.cont.champion ? T("Champions") : T("Knocked out")) : `${T("Week")} ${Math.min(7, f.cont.week + 1)}`) : f.qualified ? T("Qualified for next season") : T("Not qualified")) +
      section(T("Actions")) +
      row("fbTrain", E("1f4aa"), T("Extra training session"), f.extraYear === year() ? T("Already done this year") : `${money(15000)} · +${T("skill and fitness")}`, f.extraYear === year()) +
      row("fbPen", E("26bd"), T("Penalty practice"), f.penBest != null ? `${T("Best")}: ${f.penBest}/5` : T("Aim with the mouse and beat the keeper")) +
      row("fbAgent", E("1f4bc"), T("Ask your agent for offers"), T("Test the transfer market now")) +
      row("fbRehab", E("1f3e5"), T("Intensive rehab"), f.injury ? `${money(20000)} · ${T("cut the injury short")}` : T("No injury right now"), !f.injury) +
      section(T("Contract")) +
      row("fbContract", E("1f4dd"), T("Contract and wages"), `${money(f.wage)}/${T("yr")} · ${f.contract && f.contract.years ? `${f.contract.years} ${T("years")}` : T("no contract")}`) +
      row("fbRetire", E("1f3c1"), T("Retire"), T("Hang up the boots and look back"));

    applyTabs(f);
    tap("fbStatus", () => {
      statusCard(f, () => openFutbol(), [["Hype", `${Math.round(f.hype)}%`], ["Coach", `${Math.round(f.coachRel)}%`]]);
    });
    tap("fbPlay", () => {
      if (f.pending) {
        noticeIt(T("Season in progress"), T("Answer the question on screen to continue the season."), null, true);
        return;
      }
      if (f.simulatedAge === state.age) {
        card({
          iconSrc: E("1f4c5"),
          title: T("Already played"),
          lead: T("You have played this season. Age up to start the next one. Football waits for nobody, but it does wait for your birthday."),
          rows: [
            [T("Season"), `${year()}`],
            [T("Next"), String(year() + 1)],
          ],
          ok: () => openFutbol(),
        });
        return;
      }
      beginSeason(true);
    });
    tap("fbTrophies", () => trophyScreen(f));
    tap("fbStats", () => careerSummaryCard(f));
    tap("fbNat", () => nationalScreen(f));
    tap("fbHistory", () => historyScreen(f));
    tap("fbTable", () => tablesScreen(f));
    tap("fbSquad", () => squadScreen(f));
    tap("fbCont", () => contScreen(f));
    tap("fbTrain", () => extraTraining(f));

tap("fbCountryLeague", () => {
    if (!state.job || !state.job.football) return;
    card({
      iconSrc: ICON,
      title: T("Select Country/League"),
      lead: T("Choose a continent to see football leagues"),
      rows: [
        [T("Europe"), ""],
        [T("America"), ""],
      ],
      buttons: [
        [
          T("Europe"),
          () => showCountriesCard("europe"),
        ],
        [
          T("America"),
          () => showCountriesCard("america"),
        ],
      ],
      ok: () => {},
    });
  });
    tap("fbAgent", () => agentCard(f));
    tap("fbPen", () => penaltyPractice(f));
    tap("fbRehab", () => rehabCard(f));
    tap("fbContract", () => contractCard(f));
    tap("fbRetire", () => retireCard(f));
    sList.scrollTop = 0;
  }

  function aboutCard() {
    card({
      iconSrc: E("1f4d6"),
      title: T("How the football life works"),
      lead:
        T("You start in your high school team at 10 or older.") +
        "<br><br>" +
        T("Every year you pick a training focus, play a key match moment, live through events and get a season review. Nothing advances without you.") +
        "<br><br>" +
        T("At 15, if your skill is 85% or your potential is extraordinary, the scouts come. You can sign for an academy or wait for a bigger club.") +
        "<br><br>" +
        T("From 17 to 20 you can earn a first-team contract. Then come transfers, loans, cups, continental nights, the national team and the Ballon d'Or."),
      rows: [
        [T("Entry"), T("Occupation → Special Careers → Football Career")],
        [T("Trophies"), T("Kept forever in your cabinet")],
        [T("Rule"), T("One season per year of age")],
      ],
      ok: () => openFutbol(),
    });
  }

  // ------------------------------------------------------------------ start
  function schoolClub() {
    const home = leagueForCountry(state.country) || LEAGUES[0];
    const city = String(state.city || state.country || "").trim();
    const name = `${city || T("Home")} ${T("High School")}`;
    return {
      id: "school",
      name,
      logo: ICON,
      rep: 34,
      division: 1,
      lId: home.id,
      lName: home.name,
      lLogo: home.logo || "",
      country: home.country || "",
      flag: home.flag || "",
      cup: home.cup,
      cupLogo: home.cupLogo || home.logo || "",
      continental: home.continental,
      conf: home.conf,
    };
  }

  function startCareer() {
    if (state.prison) return noticeIt(CAREER, T("You cannot start a football career from prison."), null, true);
    if (state.dead) return;
    const f = F();
    if (f.active && !f.retired) return openFutbol();
    if (window.FL_CAREERS && !window.FL_CAREERS.canStart("Footballer")) return;
    if (state.age < 10) return noticeIt(CAREER, T("You need to be at least 10 years old to join a team."), null, true);
    if (state.age > 34) return noticeIt(CAREER, T("It is too late to start a playing career, but you can still watch."), null, true);

    const health = Number(state.stats && state.stats.Health) || 60;
    const smarts = Number(state.stats && state.stats.Smarts) || 50;
    f.v = 1;
    f.active = true;
    f.retired = false;
    f.pro = false;
    f.youth = true;
    f.academy = false;
    f.scouted = false;
    f.club = schoolClub();
    f.pos = -1;
    f.skill = clampN(30 + health * 0.25 + smarts * 0.05 + ri(0, 10), 28, 68);
    f.fit = clampN(55 + health * 0.3 + ri(0, 10), 45, 90);
    f.fame = 0;
    f.form = 50;
    f.coachRel = 55;
    f.clubRel = 55;
    f.potential = rnd() < 0.1 ? ri(91, 99) : rnd() < 0.28 ? ri(83, 92) : ri(66, 84);
    f.gifted = f.potential >= 90;
    f.wage = 0;
    f.contract = { wage: 0, years: 0, release: 0 };
    f.trophies = [];
    f.history = [];
    f.highlights = [];
    f.career = { apps: 0, goals: 0, assists: 0, seasons: 0 };
    f.nat = { called: false, caps: 0, goals: 0, debut: 0, hist: [] };
    f.lastSeason = null;
    f.lastYouth = null;
    f.injury = null;
    f.ban = 0;
    f.mods = { atk: 0, def: 0, luck: 0 };
    f.recent = [];
    f.momentsUsed = [];
    f.seasonAge = -1;
    f.simulatedAge = -1;
    f.seasonNo = 0;
    f.flowDone = false;
    f.pending = false;
    syncJob(f);
    positionScreen(f);
  }

  function positionScreen(f) {
    const groups = [
      [T("Attack"), ["ST", "LW", "RW"]],
      [T("Midfield"), ["CAM", "CM", "CDM"]],
      [T("Defence"), ["FB", "CB"]],
      [T("Goalkeeper"), ["GK"]],
    ];
    const lines = groups
      .map(
        ([g, ids]) =>
          section(g) +
          ids
            .map((id) => {
              const i = POS_BY_ID[id];
              const p = POSITIONS[i];
              const hint = p.gk
                ? T("Saves, clean sheets and a different kind of pressure")
                : p.goal > 1
                  ? T("Goals, glory and the blame when you miss")
                  : p.assist > 1
                    ? T("Chances created, assists and the number ten role")
                    : p.def > 1.2
                      ? T("Duels, tackles and the least glamorous job on the pitch")
                      : T("The engine room: running, passing and covering");
              return row(`pos${i}`, E(p.gk ? "1f9e4" : "26bd"), p.n, hint);
            })
            .join(""),
      )
      .join("");
    openScreen(T("Choose your position"), () => openFutbol());
    sList.innerHTML =
      `<div class="mm-foot" style="padding:8px 14px;text-align:left">${esc(T("Your position decides how you score, how you assist and what the coach expects from you. You can change it later in your career."))}</div>` +
      lines;
    POSITIONS.forEach((p, i) => tap(`pos${i}`, () => confirmPosition(f, i)));
    sList.scrollTop = 0;
  }

  function confirmPosition(f, i) {
    const p = POSITIONS[i];
    const boost = p.gk ? { fit: 2 } : p.goal > 1 ? { skill: 1 } : p.def > 1.2 ? { fit: 2 } : { skill: 1 };
    f.pos = i;
    applyEffects(f, boost);
    syncJob(f);
    const quit = () => {
      f.active = false;
      f.retired = false;
      clearFootballJob();
      sayIt("I was cut from my school football team and gave up on it for now.");
      if (typeof openSpecialCareers === "function") openSpecialCareers();
    };
    // [mod] the school coach does not take everyone: tryout chance from skill and fitness, one retry after training
    const tryout = (chance, attempt) => {
      if (rnd() < chance) return showTeam();
      card({
        iconSrc: E("1f61e"),
        title: T("Cut from the team"),
        lead: attempt === 0
          ? T("The coach reads the list out loud and your name is not on it. 'Not ready yet,' he says. 'Work on it.'")
          : T("Second tryout, same result. The coach shakes his head and points at the door."),
        rows: [[T("Your skill"), `${Math.round(f.skill)}%`], [T("Chance you had"), `${Math.round(chance * 100)}%`]],
        choices:
          attempt === 0
            ? [
                [T("Train hard and try again"), () => {
                  applyEffects(f, { skill: 2, fit: 2 });
                  tryout(clampN(chance + 0.14, 0, 0.95), 1);
                }],
                [T("Give up for now"), quit],
              ]
            : [[T("Give up for now"), quit]],
      });
    };
    const showTeam = () => {
    sayIt(`I started my football career as a ${p.n.toLowerCase()}.`);
    card({
      iconSrc: "emoji/26bd.png",
      title: `${p.n}`,
      lead: `${T("You walk into the school changing room and take the shirt.")} ${T("The coach writes your name on the team sheet in the position you wanted.")}`,
      rows: [
        [T("Position"), p.n],
        [T("Club"), f.club ? f.club.name : T("School team")],
        [T("Skill"), `${Math.round(f.skill)}%`],
        [T("Potential"), f.potential >= 90 ? T("Extraordinary") : f.potential >= 83 ? T("High") : T("Solid")],
      ],
      bars: [
        [T("Skill"), f.skill],
        [T("Fitness"), f.fit],
      ],
      choices: [[T("Play the first season"), () => beginSeason(true)]],
      ok: () => openFutbol(),
    });
    };
    tryout(clampN(0.2 + f.skill / 110 + ((Number(state.stats && state.stats.Health) || 55) - 55) / 500, 0.3, 0.9), 0);
  }

  // ------------------------------------------------------------------ cabinets & stats
  function trophyScreen(f) {
    openScreen(T("Trophy cabinet"), () => openFutbol());
    if (!f.trophies.length) {
      sList.innerHTML =
        section(T("Empty")) +
        row("", E("1f3c6"), T("No trophies yet"), T("Win a league, a cup or an award and it lands here forever"));
      sList.scrollTop = 0;
      return;
    }
    const groups = [
      ["club", T("League titles")],
      ["cup", T("Domestic cups")],
      ["continental", T("Continental trophies")],
      ["nation", T("National team")],
      ["individual", T("Individual awards")],
    ];
    let html = `<div class="mm-foot" style="padding:8px 14px;text-align:left">${esc(
      T("Everything you have won, in order. The cabinet never empties."),
    )}</div>`;
    groups.forEach(([k, label]) => {
      const list = f.trophies.filter((t) => t.k === k);
      if (!list.length) return;
      html += section(`${label} · ${list.length}`);
      list
        .slice()
        .sort((a, b) => b.y - a.y)
        .forEach((t) => {
          html += row("", trophyArt(t.n) || t.i || ICON, t.n, `${t.y}${t.c ? ` · ${t.c}` : ""}`, true, "");
        });
    });
    sList.innerHTML = html;
    sList.scrollTop = 0;
  }

  function careerSummaryCard(f) {
    const troph = f.trophies;
    const byKind = (k) => troph.filter((t) => t.k === k).length;
    const rows = [
      [T("Seasons played"), String(f.career.seasons)],
      [T("Appearances"), String(f.career.apps)],
      [T("Goals"), String(f.career.goals)],
      [T("Assists"), String(f.career.assists)],
      [T("Club trophies"), String(byKind("club") + byKind("cup") + byKind("continental"))],
      [T("National team titles"), String(byKind("nation"))],
      [T("Individual awards"), String(byKind("individual"))],
      [T("National caps"), String(f.nat.caps)],
      [T("National goals"), String(f.nat.goals)],
      [T("Current club"), f.club ? f.club.name : "—"],
      [T("Fame"), `${Math.round(f.fame)}%`],
      [T("Money"), money(state.money)],
    ];
    if (f.captain) rows.push([T("Captain"), T("Yes")]);
    card({
      iconSrc: E("1f4ca"),
      title: T("Career numbers"),
      lead: T("The cold numbers. They do not mention the ice baths, the missed penalties or the nights you could not sleep."),
      rows,
      bars: [
        [T("Skill"), f.skill],
        [T("Fitness"), f.fit],
        ...ATTRS.map((a) => [a.n, Math.round(f.attrs[a.id])]),
      ],
      ok: () => openFutbol(),
    });
  }

  function historyScreen(f) {
    openScreen(T("Season history"), () => openFutbol());
    if (!f.history.length) {
      sList.innerHTML = section(T("History")) + row("", E("1f4d6"), T("Nothing yet"), T("Your first season review will appear here"));
      sList.scrollTop = 0;
      return;
    }
    const html = f.history
      .slice()
      .reverse()
      .map((h) =>
        row(
          "",
          h.youth ? E("1f393") : E("26bd"),
          `${h.y} · ${h.club}`,
          h.youth
            ? `${h.apps} ${T("apps")} · ${h.goals} ${T("goals")} · ${h.rating} ${T("rating")}`
            : `${h.league} · ${h.pos} · ${h.apps} ${T("apps")} · ${h.goals}G ${h.assists}A · ${h.rating}`,
          true,
          "",
        ),
      )
      .join("");
    sList.innerHTML = section(`${T("Seasons")} · ${f.history.length}`) + html;
    sList.scrollTop = 0;
  }

  function squadScreen(f) {
    openScreen(T("Squad and teammates"), () => openFutbol());
    const squad = squadFor(f);
    sList.innerHTML =
      section(`${f.club ? f.club.name : T("Club")} · ${squad.length} ${T("players")}`) +
      squad
        .map(
          (p) =>
            `<div class="row${p.me ? " dis" : ""}"><img src="${E("1f464")}" alt=""><div class="t"><b>${esc(p.name)}${p.me ? ` (${T("You")})` : ""}</b><span>${esc(p.pos)} · ${p.rating} OVR${p.generated ? "" : ` · ${T("Real player")}`}</span></div></div>`,
        )
        .join("");
    sList.scrollTop = 0;
  }

  function tableScreen(f, leagueId, division) {
    const l = leagueById(leagueId);
    if (!l) return openFutbol();
    openScreen(T("League table"), () => tablesScreen(f));
    const table = buildLeagueTable(l, division || 1, year(), f);
    sList.innerHTML =
      section(`${table.league} · ${year()}`) +
      table.rows
        .map(
          (r, i) =>
            `<div class="row${r.me ? " dis" : ""}"><img src="${r.logo || ICON}" alt=""><div class="t"><b>${i + 1}. ${esc(r.name)}${r.me ? ` (${T("You")})` : ""}</b><span>${r.p} ${T("played")} · ${r.w}W ${r.d}D ${r.l}L · ${r.gf}:${r.ga} · ${r.pts} ${T("pts")}</span></div></div>`,
        )
        .join("");
    sList.scrollTop = 0;
  }

  function tablesScreen(f) {
    openScreen(T("League tables"), () => openFutbol());
    const list = LEAGUES.slice().sort((a, b) => b.rep - a.rep);
    const items = list
      .map(
        (l) =>
          `<div class="row" data-lt="${l.id}" data-div="1"><img src="${l.logo || ICON}" alt=""><div class="t"><b>${esc(l.name)}</b><span>${l.country} · ${T("First division")}${f.club && f.club.lId === l.id ? ` · ${T("Your league")}` : ""}</span></div>${chev()}</div>` +
          (BIG_LEAGUES.has(l.id)
            ? `<div class="row" data-lt="${l.id}" data-div="2"><img src="${l.tier2Logo || l.logo || ICON}" alt=""><div class="t"><b>${esc(l.tier2Name || l.name + " 2")}</b><span>${T("Second division")} · ${T("Invented squads")}</span></div>${chev()}</div>`
            : ""),
      )
      .join("");
    sList.innerHTML = section(T("Every league, every season")) + items;
    sList.querySelectorAll("[data-lt]").forEach((el) => {
      el.onclick = () => {
        playSnd("choice");
        tableScreen(f, el.dataset.lt, Number(el.dataset.div));
      };
    });
    sList.scrollTop = 0;
  }

  function nationalScreen(f) {
    openScreen(T("National team"), () => openFutbol());
    const rows = f.nat.hist
      .slice()
      .reverse()
      .map((h) => row("", flagFor(f), `${h.y} · ${h.t}`, `${h.r}${h.g ? ` · ${h.g} ${T("goals")}` : ""}`, true, ""))
      .join("");
    sList.innerHTML =
      section(T("International career")) +
      (f.natCup ? row("", flagFor(f), f.natCup.name, `${f.natCup.done ? T("Finished") : T("In camp: press 1 Week for the next match")} · ${(f.natCup.results || []).length} ${T("played")}`, true, "") : "") +
      row("", flagFor(f), bornName() || T("National team"), f.nat.called ? `${f.nat.caps} ${T("caps")} · ${f.nat.goals} ${T("goals")}${f.nat.debut ? ` · ${T("debut")} ${f.nat.debut}` : ""}` : T("Not called up yet"), true, "") +
      (f.nat.hist.length ? section(T("Tournaments")) + rows : "");
    sList.insertAdjacentHTML(
      "beforeend",
      `<div class="mm-foot" style="padding:10px 14px 0;text-align:left">${esc(T("You can only play for the country you were born in:"))} ${esc(bornName())}.</div>`,
    );
    if (!f.nat.called) {
      sList.insertAdjacentHTML(
        "beforeend",
        `<div class="mm-foot" style="padding:10px 14px;text-align:left">${esc(
          T("Get your skill above 68 and your fame above 12, and the call will come."),
        )}</div>`,
      );
    }
    sList.scrollTop = 0;
  }

  // ------------------------------------------------------------------ extra actions
  function extraTraining(f) {
    const cost = 15000;
    if (f.extraYear === year()) return noticeIt(CAREER, T("You already hired extra training this year."), null, true);
    if ((Number(state.money) || 0) < cost) return noticeIt(T("Too expensive"), `${T("You need")} ${money(cost)}.`, null, true);
    state.money -= cost;
    const rows = applyEffects(f, {
      skill: ri(1, 3),
      fit: ri(1, 3),
      form: ri(2, 5),
      coach: 2,
    });
    f.extraYear = year();
    rows.push([T("Cost"), money(cost)]);
    sayIt("I paid for extra training sessions with a private coach.");
    card({
      iconSrc: E("1f4aa"),
      title: T("Extra sessions"),
      lead: T("Two weeks of double sessions with a specialist. Your legs are angry and your touch is better."),
      rows,
      ok: () => openFutbol(),
    });
  }

  function rehabCard(f) {
    const cost = 20000;
    if (!f.injury) return noticeIt(CAREER, T("You are not injured."), null, true);
    if ((Number(state.money) || 0) < cost) return noticeIt(T("Too expensive"), `${T("You need")} ${money(cost)}.`, null, true);
    const weeks = Math.min(f.injury.weeks, ri(2, 5));
    card({
      iconSrc: E("1f3e5"),
      title: T("Intensive rehab"),
      lead: `${T("A private clinic can take")} ${weeks} ${T("weeks off your recovery for")} ${money(cost)}. ${T("Your body, your money.")}`,
      rows: [
        [T("Injury"), `${f.injury.weeks} ${T("weeks")}`],
        [T("After treatment"), `${Math.max(0, f.injury.weeks - weeks)} ${T("weeks")}`],
        [T("Cost"), money(cost)],
      ],
      choices: [
        [
          T("Pay for the clinic"),
          () => {
            state.money -= cost;
            if (typeof renderStats === "function") renderStats();
            f.injury.weeks = Math.max(0, f.injury.weeks - weeks);
            if (f.injury.weeks <= 0) f.injury = null;
            playSnd("chaChing");
            sayIt("I paid for private rehab to come back faster.");
            card({
              iconSrc: E("1f3e5"),
              title: T("Back sooner"),
              lead: f.injury ? T("The treatment works. You are closer to fitness.") : T("The physio signs you off. You are fit again."),
              rows: [[T("Injury"), f.injury ? `${f.injury.weeks} ${T("weeks left")}` : T("Recovered")]],
              ok: () => openFutbol(),
            });
          },
        ],
        [T("Not now"), () => openFutbol()],
      ],
    });
  }

  function contractCard(f) {
    const c = f.contract || {};
    card({
      iconSrc: E("1f4dd"),
      title: T("Contract and wages"),
      lead: f.youth
        ? T("Youth players do not get rich. You get a bus pass, boots and a chance.")
        : T("Your agent keeps a copy in his bag. So does the club lawyer."),
      rows: [
        [T("Club"), f.club ? f.club.name : "—"],
        [T("Wage"), `${money(f.wage)}/${T("yr")}`],
        [T("Years left"), String(Math.max(0, c.years || 0))],
        [T("Release clause"), c.release ? money(c.release) : "—"],
        [T("Agent"), f.agent ? f.agent : T("Family")],
        [T("Bank"), money(state.money)],
      ],
      choices: f.pro
        ? [
            [
              T("Ask for a raise"),
              () => {
                const ok = f.coachRel > 55 && f.clubRel > 55 && (f.lastSeason ? f.lastSeason.rating >= 7 : false);
                if (ok && rnd() < 0.7) {
                  f.wage = Math.round((f.wage * 1.25) / 1000) * 1000;
                  if (f.contract) f.contract.wage = f.wage;
                  applyEffects(f, { club: -2 });
                  syncJob(f);
                  sayIt("I asked for a raise and got it.");
                  card({
                    iconSrc: E("1f4b5"),
                    title: T("Raise agreed"),
                    lead: T("The board grumbles, then signs. Your wage goes up 25%."),
                    rows: [[T("New wage"), `${money(f.wage)}/${T("yr")}`]],
                    ok: () => openFutbol(),
                  });
                } else {
                  applyEffects(f, { club: -5, coach: -3, hap: -2 });
                  card({
                    iconSrc: E("1f4c9"),
                    title: T("Not now"),
                    lead: T("The sporting director says the club is watching the budget. He also says he is watching you."),
                    rows: [[T("Wage"), `${money(f.wage)}/${T("yr")}`]],
                    ok: () => openFutbol(),
                  });
                }
              },
            ],
            [T("Back"), () => openFutbol()],
          ]
        : [[T("Back"), () => openFutbol()]],
    });
  }

  function agentCard(f) {
    if (!f.pro) return noticeIt(CAREER, T("You do not have an agent yet. Get a professional contract first."), null, true);
    const tenureNow = f.joinedYear != null ? year() - f.joinedYear : 9;
    if (f.contract && f.contract.years > 1 && (f.clubRel > 70 || (tenureNow < 2 && !(f.clubRel < 25 && f.coachRel < 25)))) {
      return noticeIt(T("The club says no"), T("You just signed. Nobody is negotiating a move this year."), null, true);
    }
    transferStep(f)(() => openFutbol());
  }

  function retireCard(f) {
    card({
      iconSrc: E("1f3c1"),
      title: T("Hang up the boots?"),
      lead: T("The body is the first to know. If you retire now you cannot come back, but the trophies stay forever."),
      rows: [
        [T("Age"), String(state.age)],
        [T("Seasons"), String(f.career.seasons)],
        [T("Goals"), String(f.career.goals)],
        [T("Trophies"), String(f.trophies.length)],
      ],
      choices: [
        [
          T("Retire"),
          () => retire(f, T("You choose the moment. Not every player gets that.")),
          "gold",
        ],
        [T("Keep playing"), () => openFutbol()],
      ],
    });
  }

  // ------------------------------------------------------------------ Pro Athlete
  function openAthleteHub() {
    playSnd("choice");
    openScreen(T("Pro Athlete"), () => typeof openSpecialCareers === "function" && openSpecialCareers());
    sList.innerHTML =
      section(T("Pro Athlete")) +
      row("faFootball", ICON, T("Football Career"), T("Play football from youth leagues to the professional top"), state.age < 10) +
      row("faAbout", E("1f4d6"), T("How football works"), T("Training, scouts, contracts, cups and the Ballon d'Or"));
    tap("faFootball", () => openFutbol());
    tap("faAbout", () => aboutCard());
    sList.scrollTop = 0;
  }

  const origSpecial = window.openSpecialCareers;
  if (typeof origSpecial === "function") {
    window.openSpecialCareers = function () {
      const out = origSpecial.apply(this, arguments);
      try {
        const pack = sList.querySelector('[data-pack="athlete"]');
        if (pack) {
          pack.classList.remove("dis");
          if (!pack.querySelector(".chev")) pack.insertAdjacentHTML("beforeend", chev());
          pack.onclick = () => openAthleteHub();
        }
      } catch (e) {
        console.warn("[futbol] special menu", e);
      }
      return out;
    };
  }

  const origJobScreen = window.openJobScreen;
  if (typeof origJobScreen === "function") {
    window.openJobScreen = function () {
      if (state.job && state.job.football) return openFutbol();
      return origJobScreen.apply(this, arguments);
    };
  }

  window.FL_FUTBOL = {
    open: openFutbol,
    hub: openAthleteHub,
    start: startCareer,
    state: () => state.futbol,
    career: CAREER,
    cont: { make: makeContinental, play: contMatchStep, fixture: contFixture, blocking: contBlocking, MOMENTS: CONT_MOMENTS },
  };

  // ------------------------------------------------------------------ age-up hook (was missing: //__PART4__)
  const ageBtn = document.getElementById("ageBtn");
  if (ageBtn) {
    // one season at a time: while the football decisions are on screen, the year cannot advance
    ageBtn.addEventListener(
      "click",
      (ev) => {
        const f = state && state.futbol;
        if (natBlocking(f) && !flowActive) {
          ev.stopImmediatePropagation();
          ev.preventDefault();
          noticeIt(T("National team duty"), T("You are in camp with the national team. You can only advance week by week (1 Week button) until the tournament ends."), null, true);
          return;
        }
        if (contBlocking(f) && !flowActive) {
          ev.stopImmediatePropagation();
          ev.preventDefault();
          noticeIt(f.cont.name, T("Your club is in the continental cup. You can only advance week by week (1 Week button): every week is a match you play, until the run ends."), null, true);
          return;
        }
        if (f && f.active && !f.retired && !state.dead && flowActive && flowStalled()) {
          // nothing on screen belongs to the season anymore: skip the lost step and finish the flow
          const r = resumeFlow;
          ev.stopImmediatePropagation();
          ev.preventDefault();
          try {
            r();
          } catch (e) {
            console.warn("[futbol] resume", e);
            flowActive = false;
            f.pending = false;
            f.flowDone = true;
          }
          return;
        }
        if (f && f.active && !f.retired && !state.dead && flowActive) {
          ev.stopImmediatePropagation();
          ev.preventDefault();
          noticeIt(T("Season in progress"), T("Answer the current football decision first."), null, true);
        }
      },
      true,
    );
    ageBtn.addEventListener("click", () =>
      setTimeout(() => {
        try {
          yearTick();
        } catch (e) {
          console.warn("[futbol] yearTick", e);
        }
      }, 0),
    );
  }

  // the 1 Week button (week.js) plays the next tournament match while the squad is in camp
  (function hookWeek() {
    const wb = document.getElementById("weekBtn");
    if (!wb) return void setTimeout(hookWeek, 500);
    let before = 0;
    const wk = () => (state.weekNo && state.weekNo.age === state.age ? state.weekNo.n : 0);
    wb.addEventListener("click", () => { before = wk(); }, true);
    wb.addEventListener("click", () => {
      const f = state && state.futbol;
      if (wk() <= before) return;
      let run = null;
      if (natBlocking(f)) run = () => natMatchStep(f);
      else if (contBlocking(f)) run = () => contMatchStep(f);
      if (!run) return;
      if (typeof queuePopup === "function") queuePopup(run);
      else setTimeout(run, 400);
    });
  })();

  // [mod] the Age button looks greyed out while the squad is in camp (only 1 Week works)
  (function ageLockLook() {
    if (!document.getElementById("flNatLockCss")) {
      const st = document.createElement("style");
      st.id = "flNatLockCss";
      st.textContent = "#ageBtn.fl-natlock{filter:grayscale(1) brightness(.78);opacity:.55;cursor:not-allowed}#ageBtn.fl-natlock *{cursor:not-allowed}";
      document.head.appendChild(st);
    }
    const sync = () => {
      if (state && state.country && !state.birthCountry && !state.dead) bornCode();
      const b = document.getElementById("ageBtn");
      if (!b) return;
      const on = natBlocking(state && state.futbol) || contBlocking(state && state.futbol);
      b.classList.toggle("fl-natlock", on);
      b.setAttribute("aria-disabled", on ? "true" : "false");
    };
    window.FL_FUT_SYNC = sync;
    setInterval(sync, 400);
    sync();
  })();
  window.FL_FUTBOL.tick = yearTick;
})();
