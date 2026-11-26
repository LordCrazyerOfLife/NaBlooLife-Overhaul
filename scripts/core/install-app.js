// Registers the service worker so the game can be installed as an app.
// The path is relative to <base href="unsorted/">, so it points at the sw.js next to game.html.
if ("serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("../sw.js").catch((e) => console.warn("app install setup failed:", e));
  });
}
