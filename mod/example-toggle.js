/* Example custom mod that can be switched on and off without a reload.
 * Add it from Custom Mod Sources: it shows a small badge while it is on.
 * The wrapper keeps this mod's names from clashing with the game's.
 */
(() => {
  let badge = null;

  // must be called at the top level of the file, not inside a timer or event
  MOD_SOURCES.register({
    on() {
      badge = document.createElement("div");
      badge.id = "exampleModBadge";
      badge.textContent = "Example mod is ON";
      badge.style.cssText =
        "position:fixed;right:8px;bottom:8px;z-index:2147483000;padding:6px 10px;border-radius:10px;" +
        "background:#1d3a6b;color:#fff;font:800 12px system-ui,sans-serif;pointer-events:none";
      document.body.appendChild(badge);
    },
    off() {
      badge?.remove(); // undo everything on() did
      badge = null;
    },
  });
})();
