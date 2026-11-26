const w = (ms) => new Promise((r) => setTimeout(r, ms));
const errs = [];
window.addEventListener("error", (e) => errs.push(e.message));
const close = async () => {
  for (let i = 0; i < 10; i++) {
    const p = document.querySelector(".notice-wrap") || document.querySelector("#evWrap.open [data-c]");
    if (!p) break;
    p.click();
    await w(180);
  }
};
const out = {};
await close();
state.gangLife = undefined; // vida limpia de pandilla
openSpecialCareers(); screen.classList.add("open"); await w(200);
document.getElementById("spGang").click(); await w(250);
out.opciones = [...document.querySelectorAll("#socSel option")].map((o) => o.textContent);
document.getElementById("socSel").value = "1"; // Black Disciples
document.getElementById("socGo").click(); await w(250);
ev.querySelector('[data-c="0"]').click(); await w(250);
await close();
const g = state.gangLife;
out.pandilla = g.gang; out.gente = g.crew.map((m) => `${m.nick} (${m.role}, ${m.age})`);
FL_GANG.open(); await w(150);
document.getElementById("gCrew").click(); await w(200);
out.filasCrew = document.querySelectorAll('[id^="gM_"]').length;
const ogIdx = g.crew.findIndex((m) => m.role === "og");
document.getElementById("gM_" + ogIdx).click(); await w(200);
out.botonesOG = [...ev.querySelectorAll("[data-c]")].map((b) => b.textContent.trim());
ev.querySelector('[data-c="1"]').click(); await w(250); // pedir consejo
await close();
for (let y = 0; y < 5; y++) { g.yr.acts = 1; FL_GANG.tick(); await w(700); await close(); }
out.genteDespues = g.crew.map((m) => `${m.nick} (${m.role}, ${m.age})`);
out.errs = errs;
return JSON.stringify(out, null, 1);
