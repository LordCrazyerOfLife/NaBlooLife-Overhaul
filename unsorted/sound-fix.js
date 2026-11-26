/* [mod] Stat sound fix for NaBlooLife (local mod).
 *
 * The base game plays the stat-up or stat-down sound by adding up every stat that moved in the last redraw:
 * a good outcome that also costs some Health, Smarts or Looks used to play the "bad" sound, and the other way around.
 * Now the sound follows Happiness first (it is what makes an outcome feel good or bad), and only falls back to the
 * old sum when Happiness did not move. Mods can also force the sound for a result with FL_SND.result(true|false)
 * right before they apply the stat changes (it lasts one second).
 */
(() => {
  "use strict";
  if (window.FL_SND) return;
  let prev = null;
  let force = null;
  let until = 0;
  let memo = null;
  let memoAt = 0;
  let urlUp = "";
  let urlDown = "";
  const snap = () => (typeof state !== "undefined" && state.stats ? { ...state.stats } : null);

  function good() {
    const now = performance.now();
    if (force !== null && now < until) return force;
    const cur = snap();
    if (!cur || !prev) return null;
    const dh = (Number(cur.Happiness) || 0) - (Number(prev.Happiness) || 0);
    if (dh) return dh > 0;
    let s = 0,
      r = 0;
    for (const k in cur) {
      const d = (Number(cur[k]) || 0) - (Number(prev[k]) || 0);
      d > 0 ? (s += d) : (r -= d);
    }
    return s >= r;
  }
  function decide(name) {
    const now = performance.now();
    if (!memo || now - memoAt > 40) {
      memo = good();
      memoAt = now;
    }
    return memo === null ? (name === "up" ? urlUp : urlDown) : memo ? urlUp : urlDown;
  }

  function boot() {
    if (typeof SND === "undefined" || !SND.statUp || !SND.statDown || typeof state === "undefined" || !state.stats || !document.getElementById("stats")) return setTimeout(boot, 150);
    urlUp = SND.statUp.src;
    urlDown = SND.statDown.src;
    const mk = (name) => ({ get src() { return decide(name); }, set src(v) {}, play() { return Promise.resolve(); }, pause() {}, addEventListener() {}, load() {} });
    SND.statUp = mk("up");
    SND.statDown = mk("down");
    prev = snap();
    // registered after the game's own observer, so it runs after it and keeps the "previous" snapshot one step behind
    new MutationObserver(() => {
      prev = snap();
    }).observe(document.getElementById("stats"), { childList: true });
    console.log("[sound-fix] loaded");
  }
  window.FL_SND = {
    result(isGood) {
      force = !!isGood;
      until = performance.now() + 1000;
      memo = null;
    },
  };
  boot();
})();
