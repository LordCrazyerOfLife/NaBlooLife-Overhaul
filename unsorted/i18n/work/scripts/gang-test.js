// Se evalúa en la página: une a una pandilla, hace todas las acciones, pasa años y corre eventos.
const w = (ms) => new Promise((r) => setTimeout(r, ms));
const errs = [];
window.addEventListener("error", (e) => errs.push(e.message));
const close = async () => {
  for (let i = 0; i < 10; i++) {
    const p = document.querySelector(".notice-wrap") || document.querySelector("#evWrap.open [data-c]");
    if (!p) break;
    p.click();
    await w(200);
  }
};
const out = [];
if (state.prison) return "en la cárcel, no se puede probar";
// 1) Special Careers con la fila nueva
openSpecialCareers();
screen.classList.add("open");
await w(200);
out.push("fila en Special Careers: " + !!document.getElementById("spGang"));
// 2) unirse: elegir pandilla 2 (Red Ravens) y "aguantar la golpiza"
document.getElementById("spGang").click();
await w(250);
const sel = document.getElementById("socSel");
if (sel) { sel.value = "2"; document.getElementById("socGo").click(); }
await w(250);
ev.querySelector('[data-c="0"]')?.click();
await w(250);
out.push("miembro: " + state.gangLife.member + " pandilla " + state.gangLife.gang);
await close();
// 3) subir rango a mano para probar todas las acciones
const g = state.gangLife;
g.rank = 5; g.rep = 96; g.heat = 0;
let arrested = false;
for (const id of ["hustle", "tag", "protection", "rob", "rumble", "recruit", "operation", "laylow"]) {
  if (state.prison) { arrested = true; break; }
  FL_GANG.open();
  await w(120);
  g.yr.acts = 0; g.heat = 0;
  FL_GANG.open();
  await w(120);
  const el = document.getElementById("gA_" + id);
  if (!el || el.classList.contains("dis")) { out.push(id + ": deshabilitado"); continue; }
  el.click();
  await w(250);
  out.push(id + ": ok");
  await close();
}
// 4) años: tick + eventos
for (let y = 0; y < 6 && !state.prison; y++) {
  g.yr.acts = 1;
  FL_GANG.tick();
  await w(900);
  await close();
}
return JSON.stringify({ errs, out, arrested, prison: !!state.prison, rank: g.rank, rep: g.rep, heat: g.heat, earned: g.earned, events: g.evDone }, null, 1);
