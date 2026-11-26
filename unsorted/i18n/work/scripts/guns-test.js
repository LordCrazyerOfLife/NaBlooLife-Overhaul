const w = (ms) => new Promise((r) => setTimeout(r, ms));
const errs = [];
window.addEventListener("error", (e) => errs.push(e.message));
const close = async () => {
  for (let i = 0; i < 8; i++) {
    const p = document.querySelector(".notice-wrap") || document.querySelector("#evWrap.open [data-c]");
    if (!p) break;
    p.click();
    await w(180);
  }
};
const out = {};
await close();
const g = state.gangLife;
if (!g || !g.member) return "no estás en una pandilla";
state.money += 50000;
g.rank = Math.max(g.rank, 2); g.guns = []; g.carry = null;
FL_GANG.open(); await w(200);
out.filas = WEAPONS_IDS = ["glock", "switch", "arp", "draco"].map((id) => {
  const el = document.getElementById("gW_" + id);
  return `${id}: ${el ? (el.classList.contains("dis") ? "bloqueada" : "ok") : "no existe"}`;
});
// comprar glock
document.getElementById("gW_glock").click(); await w(250); await close();
// comprar switch azul
FL_GANG.open(); await w(150);
document.getElementById("gW_switch").click(); await w(250);
document.getElementById("socSel").value = "1"; document.getElementById("socGo").click(); await w(250); await close();
// comprar draco
FL_GANG.open(); await w(150);
document.getElementById("gW_draco").click(); await w(250); await close();
out.armas = g.guns.map((x) => x.id + (x.color ? "/" + x.color : ""));
out.llevaDespuesDeComprar = g.guns[g.carry].id;
// cambiar a la glock
FL_GANG.open(); await w(150);
document.getElementById("gW_glock").click(); await w(200);
out.llevaDespuesDeCambiar = g.guns[g.carry].id;
out.iconoSwitch = document.querySelector("#gW_switch img").getAttribute("src");
// calor extra al actuar armado
g.heat = 0; g.yr.acts = 0;
FL_GANG.open(); await w(150);
document.getElementById("gA_tag").click(); await w(250); await close();
out.calorTrasGrafitearArmado = g.heat;
// arresto con arma (interceptado)
const calls = []; const orig = window.arrest; window.arrest = (c, y) => calls.push([c, y]);
for (let i = 0; i < 40 && g.guns.length; i++) {
  g.yr.acts = 0; g.heat = 100; if (g.carry == null) g.carry = 0;
  FL_GANG.open(); await w(30);
  document.getElementById("gA_hustle").click(); await w(120); await close();
}
window.arrest = orig;
out.arrestos = calls;
out.armasAlFinal = g.guns.length;
// guardar el arma
g.guns = [{ id: "arp" }]; g.carry = 0;
FL_GANG.open(); await w(150);
document.getElementById("gHolster").click(); await w(150);
out.trasGuardar = g.carry;
out.errs = errs;
return JSON.stringify(out, null, 1);
