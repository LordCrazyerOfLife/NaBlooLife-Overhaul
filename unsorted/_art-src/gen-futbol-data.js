// Generates futbol-data.js from the sports/ asset tree. Run: node _art-src/gen-futbol-data.js
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LEAGUES = [
  { id: "epl", name: "Premier League", country: "England", flag: "gb", rep: 93, dir: "europe/england/english-premier-league", cup: "FA Cup", cupLogo: "europe/england/torneos/emirates-fa-cup.png", logo: "europe/england/torneos/english-premier-league.png", continental: "Champions League", conf: "UEFA", tier2: "EFL Championship", tier2Logo: "europe/england/torneos/efl-championship.png" },
  { id: "laliga", name: "La Liga", country: "Spain", flag: "es", rep: 92, dir: "europe/spain/la-liga", cup: "Copa del Rey", cupLogo: "europe/spain/torneos/copa-del-rey.png", logo: "europe/spain/torneos/la-liga.png", continental: "Champions League", conf: "UEFA", tier2: "LaLiga 2", tier2Logo: "europe/spain/torneos/la-liga-2.png" },
  { id: "seriea", name: "Serie A", country: "Italy", flag: "it", rep: 89, dir: "europe/italy/serie-a", cup: "Coppa Italia", cupLogo: "europe/italy/torneos/coppa-italia.png", logo: "europe/italy/torneos/serie-a.png", continental: "Champions League", conf: "UEFA", tier2: "Serie B", tier2Logo: "europe/italy/torneos/serie-b.png" },
  { id: "bundesliga", name: "Bundesliga", country: "Germany", flag: "de", rep: 90, dir: "europe/germany/bundesliga", cup: "DFB-Pokal", cupLogo: "europe/germany/torneos/dfb-pokal.png", logo: "europe/germany/torneos/bundesliga.png", continental: "Champions League", conf: "UEFA", tier2: "2. Bundesliga", tier2Logo: "europe/germany/torneos/2-bundesliga.png" },
  { id: "ligue1", name: "Ligue 1", country: "France", flag: "fr", rep: 86, dir: "europe/france/ligue-1", cup: "Coupe de France", cupLogo: "europe/france/torneos/french-cup.png", logo: "europe/france/torneos/ligue-1.png", continental: "Champions League", conf: "UEFA", tier2: "Ligue 2", tier2Logo: "europe/france/torneos/ligue-2.png" },
  { id: "primeira", name: "Primeira Liga", country: "Portugal", flag: "pt", rep: 82, dir: "europe/portugal/primeira-liga", cup: "Taça de Portugal", cupLogo: "europe/portugal/torneos/taca-de-portugal.png", logo: "europe/portugal/torneos/primeira-liga.png", continental: "Champions League", conf: "UEFA", tier2: "Liga Portugal 2", tier2Logo: "europe/portugal/torneos/liga-portugal-2.png" },
  { id: "eredivisie", name: "Eredivisie", country: "Netherlands", flag: "nl", rep: 80, dir: "europe/netherlands/eredivisie", cup: "KNVB Cup", cupLogo: "europe/netherlands/torneos/knvb-cup.png", logo: "europe/netherlands/torneos/eredivisie.png", continental: "Europa League", conf: "UEFA", tier2: "Eerste Divisie", tier2Logo: "europe/netherlands/torneos/eerste-divisie.png" },
  { id: "superlig", name: "Süper Lig", country: "Turkey", flag: "tr", rep: 78, dir: "europe/turkey/super-lig", cup: "Turkish Cup", cupLogo: "europe/turkey/torneos/turkish-cup.png", logo: "europe/turkey/torneos/super-lig.png", continental: "Europa League", conf: "UEFA", tier2: "1. Lig", tier2Logo: "europe/turkey/torneos/1st-lig.png" },
  { id: "jupiler", name: "Jupiler Pro League", country: "Belgium", flag: "be", rep: 77, dir: "europe/belgium/jupiler-pro-league", cup: "Belgian Cup", cupLogo: "europe/belgium/torneos/belgian-cup.png", logo: "europe/belgium/torneos/jupiler-pro-league.png", continental: "Europa League", conf: "UEFA", tier2: "Challenger Pro League", tier2Logo: "europe/belgium/torneos/challenger-pro-league.png" },
  { id: "scottish", name: "Scottish Premiership", country: "Scotland", flag: "gb-sct", rep: 72, dir: "europe/scotland/scottish-premiership", cup: "Scottish Cup", cupLogo: "europe/scotland/torneos/scottish-premiership.png", logo: "europe/scotland/torneos/scottish-premiership.png", continental: "Europa League", conf: "UEFA", tier2: "Scottish Championship", tier2Logo: "europe/scotland/torneos/scottish-championship.png" },
  { id: "argentina", name: "Liga Profesional", country: "Argentina", flag: "ar", rep: 82, dir: "america/argentina/argentina-primera-division", cup: "Copa Argentina", cupLogo: "america/argentina/torneos/copa-argentina.png", logo: "america/argentina/torneos/argentina-primera-division.png", continental: "Copa Libertadores", conf: "CONMEBOL", tier2: "Primera Nacional", tier2Logo: "america/argentina/torneos/primera-nacional.png" },
  { id: "brazil", name: "Brasileirão Série A", country: "Brazil", flag: "br", rep: 84, dir: "america/brazil/brazilian-serie-a", cup: "Copa do Brasil", cupLogo: "america/brazil/torneos/copa-do-brasil.png", logo: "america/brazil/torneos/brazilian-serie-a.png", continental: "Copa Libertadores", conf: "CONMEBOL", tier2: "Série B", tier2Logo: "america/brazil/torneos/brazilian-serie-b.png" },
  { id: "mexico", name: "Liga MX", country: "Mexico", flag: "mx", rep: 76, dir: "america/mexico/liga-mx", cup: "Copa MX", cupLogo: "america/mexico/torneos/copa-mx.png", logo: "america/mexico/torneos/liga-mx.png", continental: "CONCACAF Champions Cup", conf: "CONCACAF", tier2: "Liga de Expansión MX", tier2Logo: "america/mexico/torneos/liga-de-expansion-mx.png" },
  { id: "mls", name: "Major League Soccer", country: "United States", flag: "us", rep: 73, dir: "america/usa/mls", cup: "U.S. Open Cup", cupLogo: "america/usa/torneos/us-open-cup.png", logo: "america/usa/torneos/mls.png", continental: "CONCACAF Champions Cup", conf: "CONCACAF", tier2: "USL Championship", tier2Logo: "america/usa/torneos/usl-championship.png" },
  { id: "colombia", name: "Categoría Primera A", country: "Colombia", flag: "co", rep: 74, dir: "america/colombia/categoria-primera-a", cup: "Copa Colombia", cupLogo: "", logo: "", continental: "Copa Libertadores", conf: "CONMEBOL", tier2: "Primera B", tier2Logo: "" },
  { id: "chile", name: "Primera División", country: "Chile", flag: "cl", rep: 72, dir: "america/chile/liga-de-primera", cup: "Copa Chile", cupLogo: "", logo: "", continental: "Copa Libertadores", conf: "CONMEBOL", tier2: "Primera B", tier2Logo: "" },
  { id: "uruguay", name: "Liga AUF Uruguaya", country: "Uruguay", flag: "uy", rep: 73, dir: "america/uruguay/liga-auf-uruguaya", cup: "Copa Uruguay", cupLogo: "", logo: "", continental: "Copa Libertadores", conf: "CONMEBOL", tier2: "Segunda División", tier2Logo: "" },
  { id: "ecuador", name: "LigaPro Serie A", country: "Ecuador", flag: "ec", rep: 71, dir: "america/ecuador/liga-pro-serie-a", cup: "Copa Ecuador", cupLogo: "", logo: "", continental: "Copa Libertadores", conf: "CONMEBOL", tier2: "Serie B", tier2Logo: "" },
  { id: "peru", name: "Primera División", country: "Peru", flag: "pe", rep: 68, dir: "america/peru/peruvian-primera-division", cup: "Copa Perú", cupLogo: "", logo: "", continental: "Copa Libertadores", conf: "CONMEBOL", tier2: "Segunda División", tier2Logo: "" },
  { id: "paraguay", name: "Primera División", country: "Paraguay", flag: "py", rep: 69, dir: "america/paraguay/copa-de-primera", cup: "Copa Paraguay", cupLogo: "", logo: "", continental: "Copa Libertadores", conf: "CONMEBOL", tier2: "División Intermedia", tier2Logo: "" },
];

const BIG = {
  "laliga/real-madrid": 99, "laliga/barcelona": 98, "epl/manchester-city": 97,
  "bundesliga/bayern-munich": 97, "bundesliga/bayern-munchen": 97, "ligue1/paris-saint-germain": 96,
  "epl/liverpool": 95, "epl/arsenal": 94, "epl/chelsea": 94, "epl/manchester-united": 93,
  "seriea/juventus": 93, "seriea/inter": 92, "seriea/ac-milan": 92, "laliga/atletico-madrid": 92,
  "bundesliga/borussia-dortmund": 91, "seriea/napoli": 90, "laliga/sevilla": 88, "primeira/benfica": 89,
  "primeira/porto": 89, "eredivisie/ajax": 87, "primeira/sporting-cp": 88, "eredivisie/psv": 84,
  "eredivisie/feyenoord": 84, "superlig/galatasaray": 84, "superlig/fenerbahce": 84,
  "argentina/boca-juniors": 88, "argentina/river-plate": 89, "brazil/flamengo": 89, "brazil/palmeiras": 88,
  "brazil/santos": 84, "brazil/sao-paulo": 85, "mexico/club-america": 82, "mexico/tigres": 82,
  "mexico/monterrey": 82, "mls/la-galaxy": 76, "mls/inter-miami": 76, "mls/lafc": 75,
  "colombia/atletico-nacional": 78, "colombia/millonarios": 76, "chile/colo-colo": 78,
  "chile/universidad-de-chile": 76, "uruguay/penarol": 78, "uruguay/nacional": 79,
  "ecuador/ldu-quito": 74, "argentina/independiente": 80, "argentina/racing-club": 80,
  "paraguay/cerro-porteno": 74, "paraguay/olimpia": 76,
};

function slugToName(slug) {
  const small = new Set(["fc", "cf", "sc", "ac", "as", "ss", "us", "cd", "ca", "sv", "vfl", "vfb", "tsg", "rb", "kv", "rc", "ud", "rcd", "cfc", "bk", "if", "fk", "nk", "sk", "fk", "aik", "if"]);
  const special = {
    "psg": "Paris Saint-Germain", "bvb": "Borussia Dortmund", "inter": "Inter", "ac-milan": "AC Milan",
    "as-roma": "AS Roma", "ss-lazio": "SS Lazio", "juventus": "Juventus", "napoli": "Napoli",
    "real-madrid": "Real Madrid", "barcelona": "Barcelona", "atletico-madrid": "Atlético Madrid",
    "manchester-city": "Manchester City", "manchester-united": "Manchester United", "bayern-munich": "Bayern Munich",
    "borussia-dortmund": "Borussia Dortmund", "paris-saint-germain": "Paris Saint-Germain",
    "sporting-cp": "Sporting CP", "psv": "PSV", "feyenoord": "Feyenoord", "ajax": "Ajax",
    "boca-juniors": "Boca Juniors", "river-plate": "River Plate", "flamengo": "Flamengo", "palmeiras": "Palmeiras",
    "club-america": "Club América", "chivas": "Chivas", "la-galaxy": "LA Galaxy", "inter-miami": "Inter Miami",
    "new-york-city-fc": "New York City FC", "atletico-nacional": "Atlético Nacional", "ldu-quito": "LDU Quito",
    "universidad-de-chile": "Universidad de Chile", "colo-colo": "Colo-Colo", "penarol": "Peñarol",
    "nacional": "Nacional", "olimpia": "Olimpia", "cerro-porteno": "Cerro Porteño",
  };
  if (special[slug]) return special[slug];
  return slug.split("-").map((w) => (small.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1))).join(" ");
}

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}

const out = { generated: new Date().toISOString(), leagues: [] };
for (const L of LEAGUES) {
  const abs = path.join(ROOT, "sports", L.dir);
  if (!fs.existsSync(abs)) { console.warn("missing", L.dir); continue; }
  const files = fs.readdirSync(abs).filter((f) => f.endsWith(".png") && !f.startsWith("ui-"));
  const clubs = files.map((f) => {
    const slug = f.replace(/\.png$/, "");
    const rep = BIG[`${L.id}/${slug}`] != null ? BIG[`${L.id}/${slug}`] : Math.max(38, Math.min(96, L.rep - 16 + (hash(slug) % 15)));
    return { id: slug, name: slugToName(slug), rep, logo: `sports/${L.dir}/${f}` };
  }).sort((a, b) => b.rep - a.rep || a.name.localeCompare(b.name));
  const tier2 = clubs.slice(-6).map((c, i) => ({
    id: `${c.id}-b`, name: `${c.name} ${["B", "Reserves", "II", "Academy", "U21", "Castilla"][i % 6]}`,
    rep: Math.max(30, Math.min(72, L.rep - 22 + (hash(c.id) % 9))), logo: c.logo, parent: c.id,
  }));
  out.leagues.push({
    id: L.id, name: L.name, country: L.country, flag: L.flag, rep: L.rep,
    cup: L.cup, cupLogo: L.cupLogo ? `sports/${L.cupLogo}` : "",
    logo: L.logo ? `sports/${L.logo}` : "",
    continental: L.continental, conf: L.conf,
    tier2Name: L.tier2, tier2Logo: L.tier2Logo ? `sports/${L.tier2Logo}` : "",
    clubs, tier2,
  });
}

const js = "/* Generated by _art-src/gen-futbol-data.js — do not edit by hand. */\nwindow.FL_FUTBOL_DATA = " + JSON.stringify(out, null, 2) + ";\n";
fs.writeFileSync(path.join(ROOT, "futbol-data.js"), js);
console.log("leagues:", out.leagues.length, "clubs:", out.leagues.reduce((n, l) => n + l.clubs.length, 0), "bytes:", js.length);
