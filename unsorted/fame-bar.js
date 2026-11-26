/* [mod] Fame bar for NaBlooLife (local mod).
 *
 * Adds a "Fame" bar under Looks on the main screen. The base game only shows one for artists; this one follows any
 * career that tracks fame (football, NBA, zoo...): it shows the highest fame found in your state (0-100).
 * Nothing is shown twice: when the game already draws its own Fame bar (artist mode), this one steps aside.
 */
(() => {
  "use strict";
  if (window.FL_FAMEBAR) return;

  const fameNow = () => {
    let best = 0;
    try {
      for (const k of Object.keys(state)) {
        const o = state[k];
        if (!o || typeof o !== "object" || Array.isArray(o)) continue;
        if (typeof o.fame === "number" && o.fame >= 0 && o.fame <= 100) best = Math.max(best, o.fame);
      }
    } catch {}
    return Math.round(best);
  };

  function draw() {
    try {
      if (state.dead || !document.getElementById("stats")) return;
      if (state.art && state.art.fameOn) return; // the game's own Fame bar is already there
      if (typeof statBar !== "function") return;
      const v = Math.max(0, Math.min(100, fameNow()));
      const el = document.getElementById("stats");
      el.insertAdjacentHTML(
        "beforeend",
        `<div class="stat-l" id="flFameL">Fame<span class="e"><img src="stat-emoji/star.png" alt="" style="width:24px;height:24px;vertical-align:middle"></span></div>${statBar(v, "fame")}`,
      );
    } catch (e) {
      console.warn("[fame-bar]", e);
    }
  }

  function boot() {
    if (typeof state === "undefined" || typeof renderStats !== "function" || typeof statBar !== "function" || !document.getElementById("stats")) return setTimeout(boot, 120);
    const orig = renderStats;
    renderStats = function () {
      const r = orig.apply(this, arguments);
      draw();
      return r;
    };
    try {
      renderStats();
    } catch {}
    console.log("[fame-bar] loaded");
  }
  window.FL_FAMEBAR = { fame: fameNow };
  boot();
})();
