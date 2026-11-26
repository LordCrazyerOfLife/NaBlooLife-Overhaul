// Se evalúa en la página: resuelve un mate en 2 bien, y falla una táctica a propósito.
const w = (ms) => new Promise((r) => setTimeout(r, ms));
const E = FL_ENGINE;
const sq = (s) => [...document.querySelectorAll(".flc-sq")].find((e) => +e.dataset.s === s);
const click = async (m) => { sq(m.from).click(); await w(40); sq(m.to).click(); };
const out = {};

async function run(pz, wrong) {
  document.querySelectorAll(".flc").forEach((e) => e.remove());
  let ended = null;
  const h = FL_CHESS.board({
    mode: "puzzle", title: "t", fen: pz.f, myColor: pz.f.split(" ")[1], puzzle: { k: pz.k, s: pz.s },
    onEnd: (ok, info) => (ended = { ok, info }),
  });
  const g = h.game;
  await w(200);
  for (let i = 0; i < pz.s.length; i += 2) {
    while (g.turn !== (pz.f.split(" ")[1] === "w" ? 0 : E.BLACK)) await w(50);
    await w(100);
    let m = g.find(pz.s[i]);
    if (wrong) m = g.moves().find((x) => g.uci(x) !== pz.s[i]);
    await click(m);
    await w(700);
    if (/Solved|answer/.test(document.getElementById("flcStatus").textContent)) break;
  }
  const status = document.getElementById("flcStatus").textContent;
  const marks = { hint: document.querySelectorAll(".flc-hint").length, bad: document.querySelectorAll(".flc-bad").length };
  [...document.querySelectorAll(".flc-btns button")].find((b) => /Done/.test(b.textContent))?.click();
  await w(200);
  return { status, marks, ended };
}

const P = window.FL_PUZZLES;
out.mate2 = await run(P.find((p) => p.k === "mate2"), false);
out.tacticWrong = await run(P.find((p) => p.k === "tactic"), true);
return JSON.stringify(out);
