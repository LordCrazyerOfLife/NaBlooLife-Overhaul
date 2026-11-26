/* [mod] Easier Life for NaBlooLife (local mod).
 *
 * Keeping Happiness, Health and mental health up was a grind. Every birthday this gives a small push back
 * toward "okay": a few points of Happiness and Health when they are low, a little less when they are fine, and
 * nothing when they are already high. It also lowers the Mental Health mod's stress a bit each year.
 * It never touches the Smarts or Looks bars and never pushes anything above 90.
 */
(() => {
  "use strict";
  if (window.FL_EASY) return;
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const cl = (v) => Math.max(0, Math.min(100, v));
  let last = -1;
  function boost() {
    if (typeof state === "undefined" || state.dead || !state.stats || state.age === last) return;
    last = state.age;
    ["Happiness", "Health"].forEach((k) => {
      const v = Number(state.stats[k]);
      if (!Number.isFinite(v) || v >= 90) return;
      const d = v < 40 ? ri(3, 6) : v < 65 ? ri(2, 4) : ri(0, 2);
      state.stats[k] = cl(Math.min(90, v + d));
    });
    try {
      if (state.mh && typeof state.mh.stress === "number") state.mh.stress = cl(state.mh.stress - ri(2, 5));
      else if (window.FL_MH) {
        const m = FL_MH.state();
        if (m && typeof m.stress === "number") m.stress = cl(m.stress - ri(2, 5));
      }
    } catch {}
    try {
      renderStats();
    } catch {}
  }
  function boot() {
    const btn = document.getElementById("ageBtn");
    if (typeof state === "undefined" || typeof renderStats !== "function" || !btn) return setTimeout(boot, 100);
    btn.addEventListener("click", () => setTimeout(boost, 900));
    console.log("[easy-stats] loaded");
  }
  window.FL_EASY = { boost };
  boot();
})();
