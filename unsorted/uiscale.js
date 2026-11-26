(function () {
  // Change this to taste: 1 = no change, 0.85 = 15% smaller, 0.75 = 25% smaller, etc.
  var SCALE = 0.85;

  function boot() {
    if (!document.head) {
      setTimeout(boot, 50);
      return;
    }
    init();
  }

  function init() {
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
