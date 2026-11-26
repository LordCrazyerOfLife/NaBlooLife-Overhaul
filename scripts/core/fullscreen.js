// Full screen: the top-bar button turns it on and off. Nothing goes full screen on its own.
(() => {
  const root = document.documentElement;
  const request = root.requestFullscreen || root.webkitRequestFullscreen;
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  const button = document.getElementById("fsBtn");
  if (!button) return;
  if (!request) {
    button.hidden = true;
    return;
  }
  const active = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  const quietly = (fn) => {
    try {
      const p = fn();
      if (p) p.catch(() => {});
    } catch {}
  };
  button.addEventListener("click", () => {
    if (!active()) quietly(() => request.call(root, { navigationUI: "hide" }));
    else if (exit) quietly(() => exit.call(document));
  });
  const label = () => {
    button.querySelector("b").textContent = active() ? "EXIT FULL" : "FULL SCREEN";
  };
  ["fullscreenchange", "webkitfullscreenchange"].forEach((t) => document.addEventListener(t, label));
  label();
})();
