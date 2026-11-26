// Se evalúa en la página: corre los 30 eventos (elige una opción al azar en cada uno) y revisa errores,
// textos sin traducir y que el estado quede bien.
const w = (ms) => new Promise((r) => setTimeout(r, ms));
const errs = [];
window.addEventListener("error", (e) => errs.push(e.message));
const visible = (root) => {
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const out = [];
  let n;
  while ((n = tw.nextNode())) { const s = n.data.trim(); if (s) out.push(s); }
  return out;
};
// textos que siguen en inglés (heurística: palabras inglesas comunes)
const EN = /\b(the|you|your|and|with|was|were|they|his|her|it's|you're|have|this|that)\b/i;
const c = state.chess;
c.fide = c.fide || 2400; c.peak = Math.max(c.peak, c.fide); c.title = c.title || "GM"; c.followers = Math.max(c.followers, 40000);
c.online = c.online || { bullet: 2000, blitz: 2000, rapid: 2000, n: 50 };
const ids = FL_CHESS_EVENTS.map((e) => e.id);
const report = [];
for (const id of ids) {
  document.querySelector(".notice-wrap")?.click();
  evWrap.classList.remove("open");
  const moneyBefore = state.money;
  try { FL_CHESS.event(id); } catch (e) { report.push(`${id}: THROW ${e.message}`); continue; }
  await w(150);
  const lead = visible(ev);
  const btns = [...ev.querySelectorAll("[data-c]")];
  if (!btns.length) { report.push(`${id}: sin botones`); continue; }
  btns[Math.floor(Math.random() * btns.length)].click();
  await w(200);
  const res = visible(ev);
  const en = [...lead, ...res].filter((s) => EN.test(s));
  report.push(`${id}: ok${en.length ? " | EN: " + en.slice(0, 2).join(" / ") : ""}`);
  [...ev.querySelectorAll("[data-c]")][0]?.click();
  await w(120);
  document.querySelectorAll("#evWrap.open [data-c]").forEach((b) => b.click());
}
return JSON.stringify({ errs, report, money: state.money, str: c.str, fide: c.fide, ban: c.banUntil || 0 }, null, 1);
