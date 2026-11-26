// Genera puzzles originales con el motor del mod: autojuego con errores y extracción de posiciones
// con solución única. Uso: node gen-puzzles.js <salida.js> [minutos]
const fs = require("fs");
const E = require("C:/Users/Mxzzy/Downloads/FreeLife/chess-engine.js");
const OUT = process.argv[2];
const MINUTES = +(process.argv[3] || 8);
const WANT = { mate1: 90, mate2: 90, tactic: 170 };
const got = { mate1: [], mate2: [], tactic: [] };
const seen = new Set();
const deadline = Date.now() + MINUTES * 60000;
const MATE = E.MATE;

const mates1 = (g) =>
  g.moves().filter((m) => {
    g.make(m, false);
    const mate = g.inCheck() && g.moves().length === 0;
    g.unmake();
    return mate;
  });

function tryPuzzle(g) {
  const fenKey = g.fen().split(" ").slice(0, 4).join(" ");
  if (seen.has(fenKey)) return null;
  const legal = g.moves();
  if (legal.length < 2) return null;

  // mate en 1 (uno solo, para que sea limpio)
  const m1 = mates1(g);
  if (m1.length === 1 && got.mate1.length < WANT.mate1) {
    seen.add(fenKey);
    const quiet = !m1[0].cap;
    return { kind: "mate1", fen: g.fen(), sol: [g.uci(m1[0])], r: 750 + (quiet ? 200 : 0) + Math.round(Math.random() * 150) };
  }
  if (m1.length) return null;

  // filtro barato antes de la búsqueda cara
  const stat = E.evaluate(g);
  const quick = E.analyze(g, 1, 40000);
  if (!quick) return null;
  const quickGain = quick.scores[0].s - stat;
  const deep = E.analyze(g, 3, 200000);
  if (!deep || deep.depth < 3) return null;
  const [b1, b2] = deep.scores;

  // mate en 2: exactamente una primera jugada que lo fuerza
  if (b1.s === MATE - 3) {
    const forcing = deep.scores.filter((x) => x.s >= MATE - 3);
    if (forcing.length !== 1 || got.mate2.length >= WANT.mate2) return null;
    g.make(b1.m, false);
    const replies = g.moves();
    // la defensa: la que más alarga o deja el mate más difícil (primera de la lista ordenada)
    let reply = replies[0];
    for (const r of replies) {
      g.make(r, false);
      const mm = mates1(g);
      g.unmake();
      if (mm.length === 1) {
        reply = r;
        break;
      }
    }
    g.make(reply, false);
    const fin = mates1(g);
    const line = fin.length ? [g.uci(b1.m), g.uci(reply), g.uci(fin[0])] : null;
    // reconstruimos la notación desde la posición original
    g.unmake();
    g.unmake();
    if (!line) return null;
    seen.add(fenKey);
    const quiet = !b1.m.cap && !(function () {
      g.make(b1.m, false);
      const c = g.inCheck();
      g.unmake();
      return c;
    })();
    return { kind: "mate2", fen: g.fen(), sol: line, r: 1350 + (quiet ? 350 : 0) + Math.round(Math.random() * 200) };
  }

  // táctica: gana material claro, una sola movida buena, la posición no estaba ya decidida
  if (got.tactic.length < WANT.tactic && Math.abs(stat) < 250 && b1.s < MATE - 100 && b1.s - stat >= 250 && b1.s <= 1600 && b2 && b1.s - b2.s >= 200) {
    seen.add(fenKey);
    const found1 = quick.scores[0].m.from === b1.m.from && quick.scores[0].m.to === b1.m.to && quickGain >= 200;
    const d2 = found1 ? null : E.analyze(g, 2, 80000);
    const found2 = d2 && d2.scores[0].m.from === b1.m.from && d2.scores[0].m.to === b1.m.to;
    const base = found1 ? 1050 : found2 ? 1400 : 1750;
    return { kind: "tactic", fen: g.fen(), sol: [g.uci(b1.m)], r: base + Math.round(Math.random() * 200) };
  }
  return null;
}

let games = 0;
while (Date.now() < deadline && (got.mate1.length < WANT.mate1 || got.mate2.length < WANT.mate2 || got.tactic.length < WANT.tactic)) {
  games++;
  const g = new E.Game();
  const elo = 1100 + Math.floor(Math.random() * 700);
  let fromThisGame = 0, lastAt = -10;
  for (let ply = 0; ply < 160 && Date.now() < deadline; ply++) {
    if (g.status().over) break;
    if (ply >= 12 && fromThisGame < 3 && ply - lastAt >= 6) {
      const p = tryPuzzle(g);
      if (p) {
        got[p.kind].push(p);
        fromThisGame++;
        lastAt = ply;
      }
    }
    const m = E.botMove(g, ply < 8 ? 700 : elo);
    g.play(m);
  }
  if (games % 5 === 0) console.log(`partidas ${games} | mate1 ${got.mate1.length} mate2 ${got.mate2.length} tactic ${got.tactic.length}`);
}

const all = [...got.mate1, ...got.mate2, ...got.tactic].sort((a, b) => a.r - b.r);
fs.writeFileSync(
  OUT,
  "/* [mod] Puzzles originales del mod Chess Career, generados con chess-engine.js (autojuego + solución única). */\n" +
    "window.FL_PUZZLES = " + JSON.stringify(all.map(({ kind, fen, sol, r }) => ({ k: kind, f: fen, s: sol, r }))) + ";\n",
);
console.log(`listo: ${all.length} puzzles (mate1 ${got.mate1.length}, mate2 ${got.mate2.length}, tactic ${got.tactic.length}) en ${games} partidas`);
