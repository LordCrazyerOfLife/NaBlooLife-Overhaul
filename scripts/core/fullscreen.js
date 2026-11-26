// Full screen: the top-bar button turns it on and off. The game also goes full screen on the first
// tap or key press (browsers don't allow it without one). That happens only once per page load,
// so leaving full screen is respected.
(() => {
  const root = document.documentElement;
  const request = root.requestFullscreen || root.webkitRequestFullscreen;
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  const button = document.getElementById("fsBtn");
  if (!request) {
    if (button) button.hidden = true;
    return;
  }
  const active = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  const quietly = (fn) => {
    try {
      const p = fn();
      if (p) p.catch(() => {});
    } catch {}
  };
  const enter = () => quietly(() => request.call(root, { navigationUI: "hide" }));

  const events = ["click", "keydown"];
  const first = (e) => {
    if (e.key === "Escape") return;
    events.forEach((t) => document.removeEventListener(t, first, true));
    if (button && button.contains(e.target)) return; // the button handles its own tap
    if (!active()) enter();
  };
  events.forEach((t) => document.addEventListener(t, first, true));

  if (!button) return;
  button.addEventListener("click", () => {
    if (!active()) enter();
    else if (exit) quietly(() => exit.call(document));
  });
  const label = () => {
    button.querySelector("b").textContent = active() ? "EXIT FULL" : "FULL SCREEN";
  };
  ["fullscreenchange", "webkitfullscreenchange"].forEach((t) => document.addEventListener(t, label));
  label();
})();
