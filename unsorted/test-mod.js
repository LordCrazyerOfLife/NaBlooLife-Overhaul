/* [mod] Test Mod — diagnostic only mod. Confirms the mod-loading mechanism works end to end:
 * that this script was injected and executed, and that it can see the base game's top-level
 * globals (state, notice, COUNTRIES, CURRENCY, PRICE_LVL, WAGE_LVL, CAR_TAX, NAMES_FOR) the
 * same way gang.js does. Makes no permanent changes to game data.
 */
(() => {
  "use strict";

  function boot() {
    // wait until the base game has finished its own top-level script execution
    if (typeof window.COUNTRIES === "undefined" || typeof state === "undefined" || typeof notice !== "function")
      return setTimeout(boot, 60);

    try {
      const checks = {
        "window.COUNTRIES": typeof window.COUNTRIES !== "undefined",
        "window.CITIES": typeof window.CITIES !== "undefined",
        "state": typeof state !== "undefined",
        "CURRENCY": typeof CURRENCY !== "undefined",
        "PRICE_LVL": typeof PRICE_LVL !== "undefined",
        "WAGE_LVL": typeof WAGE_LVL !== "undefined",
        "CAR_TAX": typeof CAR_TAX !== "undefined",
        "NAMES_FOR": typeof NAMES_FOR === "function",
        "notice": typeof notice === "function",
      };

      const lines = Object.entries(checks)
        .map(([k, ok]) => `${ok ? "✅" : "❌"} ${k}`)
        .join("<br>");

      console.log("[test-mod] boot OK", checks);
      notice("Test Mod Loaded", `test-mod.js ran successfully.<br><br>${lines}`, null, !0);
    } catch (e) {
      console.warn("[test-mod]", e);
    }
  }
  boot();
})();
