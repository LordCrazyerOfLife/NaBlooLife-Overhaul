/*
 * devtools.js: Ctrl+Shift+Alt+S toggles DevTools inside the game.
 *
 * Plain Ctrl+Shift+S is NOT touched on purpose: browsers and screenshot tools use it for region captures, and this
 * file must never swallow it. The extra Alt makes this shortcut its own.
 *
 * A web page cannot open the browser's own DevTools (F12) from JavaScript, so this loads Eruda (an in-page DevTools:
 * Console, Elements, Network, Resources, Storage, Sources...) from dev/eruda.js the first time the shortcut is used
 * and shows/hides it after that. Nothing is loaded until you press the keys. dev/ is not copied into the mobile build,
 * so on the APK/IPA the shortcut just says the tools are not there.
 */
(() => {
  if (window.FL_DEVTOOLS) return;
  const SRC = "dev/eruda.js?v=3.4.1";
  let loading = null,
    ready = false,
    shown = false;

  const note = (msg) => {
    try {
      if (typeof notice === "function") notice("DevTools", msg, null, true);
      else console.warn("[devtools]", msg);
    } catch {
      console.warn("[devtools]", msg);
    }
  };

  const load = () =>
    (loading ||= new Promise((resolve, reject) => {
      if (window.eruda) return resolve(window.eruda);
      const s = document.createElement("script");
      s.src = SRC;
      s.onload = () => (window.eruda ? resolve(window.eruda) : reject(new Error("eruda did not load")));
      s.onerror = () => reject(new Error("dev/eruda.js not found"));
      document.head.appendChild(s);
    }).catch((e) => {
      loading = null; // allow another try
      throw e;
    }));

  async function toggle() {
    try {
      const eruda = await load();
      if (!ready) {
        // no floating gear button: the shortcut is the way in
        const css = document.createElement("style");
        css.textContent = ".eruda-entry-btn{display:none!important}";
        document.head.appendChild(css);
        eruda.init({ useShadowDom: false, defaults: { displaySize: 55, transparency: 0.97, theme: "Dark" } });
        ready = true;
        shown = false;
      }
      shown ? eruda.hide() : eruda.show();
      shown = !shown;
    } catch (e) {
      note("DevTools are not available in this build (" + e.message + ").");
    }
  }

  addEventListener(
    "keydown",
    (e) => {
      // Ctrl+Shift+Alt+S only. Ctrl+Shift+S (screenshots) passes through untouched.
      if (!(e.ctrlKey || e.metaKey) || !e.shiftKey || !e.altKey || e.code !== "KeyS") return;
      e.preventDefault();
      e.stopImmediatePropagation();
      toggle();
    },
    true,
  );

  window.FL_DEVTOOLS = { toggle };
})();
