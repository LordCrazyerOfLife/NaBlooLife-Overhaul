(function () {
  // Change this to taste: 1 = no change, 0.85 = 15% smaller, 0.75 = 25% smaller, etc.
  var SCALE = 0.85;

  function boot() {
    if (!document.body) {
      setTimeout(boot, 50);
      return;
    }
    init();
  }

  function init() {
    addScaleStyle();
    addTopSafeBar();
  }

  function addScaleStyle() {
    if (document.getElementById("uiScaleStyle")) return; // already injected

    var style = document.createElement("style");
    style.id = "uiScaleStyle";
    // "zoom" (Chromium/Android WebView) shrinks the rendered size, but it
    // also shrinks anything sized in viewport units (like .phone's
    // height: 100vh), so without compensating, the phone frame ends up
    // smaller than the real screen and leaves blank space / a wrong
    // aspect ratio. The fix (same trick this game already uses for its
    // own PC/desktop zoom mode): pre-inflate the height by 1 / scale so
    // that after the zoom shrink it lands back on exactly 100% of the
    // real screen height.
    style.textContent =
      ":root { --ui-scale: " +
      SCALE +
      "; }" +
      ".phone {" +
      "zoom: var(--ui-scale) !important;" +
      "height: calc(100vh / var(--ui-scale)) !important;" +
      "}";
    document.head.appendChild(style);
  }

  // Every full-screen menu (Activities, Occupation, Market, Relationships,
  // etc.) is actually the same single #screen element, reused and
  // restyled with extra classes, and the Family Tree screen is its own
  // #ftWrap overlay. Both sit on top of .phone (position:absolute;
  // inset:0) so a safe-area bar only on .phone itself gets covered up by
  // them. Giving each of these containers its own bar covers every menu.
  var BAR_HOSTS = [
    { id: "topSafeBar", selector: ".phone" },
    { id: "topSafeBarScreen", selector: "#screen" },
    { id: "topSafeBarFt", selector: "#ftWrap" },
  ];

  function addTopSafeBar() {
    ensureTopSafeStyle();

    var allDone = true;
    BAR_HOSTS.forEach(function (host) {
      if (document.getElementById(host.id)) return; // already injected

      var container = document.querySelector(host.selector);
      if (!container) {
        allDone = false;
        return;
      }

      var bar = document.createElement("div");
      bar.id = host.id;
      bar.className = "top-safe-mod";
      container.insertBefore(bar, container.firstChild);
    });

    if (!allDone) setTimeout(addTopSafeBar, 100);
  }

  function ensureTopSafeStyle() {
    if (document.getElementById("topSafeStyle")) return;

    var style = document.createElement("style");
    style.id = "topSafeStyle";
    style.textContent =
      ".phone .top-safe-mod {" +
      "flex: none;" +
      "background: #000;" +
      "height: env(safe-area-inset-top, 0px);" +
      "}" +
      "html.pc .phone .top-safe-mod {" +
      "display: none;" +
      "}";
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
