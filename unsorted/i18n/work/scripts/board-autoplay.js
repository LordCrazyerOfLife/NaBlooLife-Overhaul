// Se evalúa dentro de la página: juega una partida completa en el tablero del mod,
// tocando las casillas como un jugador (las jugadas del "jugador" las elige el motor a nivel 2400).
const w = (ms) => new Promise((r) => setTimeout(r, ms));
document.querySelectorAll(".flc").forEach((e) => e.remove());
window.__res = "pending";
const h = FL_CHESS.board({
  mode: "game", title: "Autoplay", myColor: "b", oppElo: 800, oppName: "Weak bot",
  clock: { base: 600000, inc: 5000 }, onEnd: (r) => (window.__res = r),
});
const E = FL_ENGINE, g = h.game;
const sq = (s) => [...document.querySelectorAll(".flc-sq")].find((e) => +e.dataset.s === s);
let plies = 0;
for (let i = 0; i < 3000 && window.__res === "pending"; i++) {
  await w(60);
  const modal = document.querySelector(".flc-modal");
  if (modal) {
    const txt = modal.textContent;
    const btn = modal.querySelector("button");
    if (btn && /Continue/.test(btn.textContent)) {
      const summary = txt;
      btn.click();
      await w(200);
      return JSON.stringify({ result: window.__res, summary, plies, fen: g.fen() });
    }
    // modal de promoción: elegir dama
    const q = modal.querySelector('[data-k="q"]');
    if (q) { q.click(); continue; }
  }
  if (g.turn !== E.BLACK) continue;
  const st = document.getElementById("flcStatus").textContent;
  if (!/Your move|Check!|black pieces/.test(st)) continue;
  const m = E.botMove(g, 2400);
  if (!m) continue;
  sq(m.from).click();
  await w(30);
  sq(m.to).click();
  plies++;
}
return JSON.stringify({ result: window.__res, plies, note: "terminó sin modal" });
