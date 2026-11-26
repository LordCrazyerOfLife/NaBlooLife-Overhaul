(function () {
  function boot() {
    if (!document.body) {
      setTimeout(boot, 50);
      return;
    }
    init();
  }

  function init() {
    if (document.getElementById("topSafeBar")) return; // already injected

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

    var phone = document.querySelector(".phone");
    if (!phone) {
      setTimeout(init, 100);
      return;
    }

    var bar = document.createElement("div");
    bar.id = "topSafeBar";
    bar.className = "top-safe-mod";
    phone.insertBefore(bar, phone.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
