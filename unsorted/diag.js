(() => {
  "use strict";

  function boot() {
    if (typeof document === "undefined") return setTimeout(boot, 60);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
      init();
    }
  }

  function init() {
    if (document.getElementById("diagFab")) return; // already injected

    const fab = document.createElement("button");
    fab.id = "diagFab";
    fab.type = "button";
    fab.textContent = "\u{1F4D0}"; // triangular ruler
    fab.setAttribute("aria-label", "Scaling diagnostics");
    Object.assign(fab.style, {
      position: "fixed",
      zIndex: 2147483000,
      left: "14px",
      bottom: "90px",
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      border: "none",
      background: "#1b2a3d",
      color: "#fff",
      fontSize: "20px",
      lineHeight: "44px",
      textAlign: "center",
      padding: "0",
      cursor: "grab",
      boxShadow: "0 2px 10px rgba(0,0,0,.45)",
      touchAction: "none",
      userSelect: "none",
    });

    const panel = document.createElement("div");
    panel.id = "diagPanel";
    Object.assign(panel.style, {
      position: "fixed",
      zIndex: 2147483000,
      left: "14px",
      bottom: "144px",
      width: "272px",
      maxHeight: "72vh",
      overflowY: "auto",
      background: "rgba(10, 16, 26, 0.95)",
      color: "#cdeaff",
      font: "11px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      padding: "10px 12px",
      borderRadius: "10px",
      boxShadow: "0 6px 24px rgba(0,0,0,.5)",
      display: "none",
      whiteSpace: "pre-wrap",
    });

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy diagnostics";
    Object.assign(copyBtn.style, {
      display: "block",
      width: "100%",
      marginBottom: "8px",
      padding: "6px 0",
      border: "none",
      borderRadius: "6px",
      background: "#2563eb",
      color: "#fff",
      font: "700 11px ui-monospace, monospace",
      cursor: "pointer",
    });

    const output = document.createElement("div");
    output.id = "diagOutput";

    panel.append(copyBtn, output);
    document.body.append(fab, panel);

    function fmt(n) {
      return typeof n === "number" ? Math.round(n * 100) / 100 : n;
    }

    function collect() {
      const vv = window.visualViewport;
      const phone = document.querySelector(".phone");
      const phoneRect = phone ? phone.getBoundingClientRect() : null;
      const htmlCS = getComputedStyle(document.documentElement);
      const bodyCS = getComputedStyle(document.body);

      const mqList = [330, 360, 380, 400, 420, 480].map((w) => {
        const hit = window.matchMedia(`(max-width: ${w}px)`).matches;
        return `  <= ${w}px : ${hit ? "YES" : "no"}`;
      });

      const lines = [
        `window.innerWidth x innerHeight: ${window.innerWidth} x ${window.innerHeight}`,
        vv
          ? `visualViewport: ${fmt(vv.width)} x ${fmt(vv.height)}  scale=${fmt(vv.scale)}  offset=${fmt(vv.offsetLeft)},${fmt(vv.offsetTop)}`
          : `visualViewport: (not supported)`,
        `document.documentElement.clientWidth x clientHeight: ${document.documentElement.clientWidth} x ${document.documentElement.clientHeight}`,
        `screen.width x height: ${screen.width} x ${screen.height}  (avail ${screen.availWidth} x ${screen.availHeight})`,
        `devicePixelRatio: ${window.devicePixelRatio}`,
        `orientation: ${screen.orientation ? screen.orientation.type : "unknown"}`,
        ``,
        `.phone element rect: ${phoneRect ? `${fmt(phoneRect.width)} x ${fmt(phoneRect.height)}` : "(not found)"}`,
        `.phone classList: ${phone ? phone.className : "(not found)"}`,
        ``,
        `html font-size (computed): ${htmlCS.fontSize}`,
        `body font-size (computed): ${bodyCS.fontSize}`,
        `html -webkit-text-size-adjust: ${htmlCS.webkitTextSizeAdjust || "(n/a)"}`,
        ``,
        `safe-area-inset-top: (measuring...)`,
        ``,
        `matchMedia breakpoints:`,
        ...mqList,
        ``,
        `window.Capacitor present: ${typeof window.Capacitor !== "undefined" ? "YES (compiled app)" : "no (browser)"}`,
        `location.href: ${location.href}`,
        `userAgent: ${navigator.userAgent}`,
      ];

      // Measure env(safe-area-inset-*) directly via a probe element,
      // since it can't be read with getPropertyValue on :root.
      const probe = document.createElement("div");
      probe.style.cssText =
        "position:fixed;top:0;left:0;width:0;height:0;" +
        "padding-top:env(safe-area-inset-top,0px);" +
        "padding-bottom:env(safe-area-inset-bottom,0px);" +
        "visibility:hidden;pointer-events:none;";
      document.body.append(probe);
      const probeCS = getComputedStyle(probe);
      lines[14] =
        `safe-area-inset-top: ${probeCS.paddingTop}   safe-area-inset-bottom: ${probeCS.paddingBottom}`;
      probe.remove();

      return lines.join("\n");
    }

    function render() {
      output.textContent = collect();
    }

    copyBtn.addEventListener("click", () => {
      const text = collect();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            copyBtn.textContent = "Copied!";
            setTimeout(() => (copyBtn.textContent = "Copy diagnostics"), 1200);
          })
          .catch(() => {
            copyBtn.textContent = "Copy failed — select text below";
          });
      } else {
        copyBtn.textContent = "Select text below to copy";
      }
    });

    fab.addEventListener("click", () => {
      if (fab.dataset.dragged === "1") {
        fab.dataset.dragged = "0";
        return;
      }
      const showing = panel.style.display !== "none";
      if (showing) {
        panel.style.display = "none";
      } else {
        render();
        panel.style.display = "block";
      }
    });

    // Keep the panel live while open, through resizes/rotation.
    window.addEventListener("resize", () => panel.style.display !== "none" && render());
    window.addEventListener("orientationchange", () => setTimeout(render, 200));
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", () => panel.style.display !== "none" && render());
    }

    // Dragging, same pattern as the cheat-menu button.
    fab.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      fab.dataset.dragged = "0";
      fab.style.cursor = "grabbing";
      const r = fab.getBoundingClientRect();
      fab._dx = e.clientX - r.left;
      fab._dy = e.clientY - r.top;
      fab.setPointerCapture(e.pointerId);
    });
    fab.addEventListener("pointermove", (e) => {
      if (!fab.hasPointerCapture || !fab.hasPointerCapture(e.pointerId)) return;
      fab.dataset.dragged = "1";
      const left = e.clientX - fab._dx;
      const top = e.clientY - fab._dy;
      (fab.style.left = `${Math.max(0, Math.min(innerWidth - fab.offsetWidth, left))}px`),
        (fab.style.top = `${Math.max(0, Math.min(innerHeight - fab.offsetHeight, top))}px`);
      (fab.style.right = "auto"), (fab.style.bottom = "auto");
      panel.style.left = `${Math.max(4, Math.min(innerWidth - panel.offsetWidth - 4, left))}px`;
      panel.style.top = `${Math.max(4, top - panel.offsetHeight - 10)}px`;
      (panel.style.right = "auto"), (panel.style.bottom = "auto");
    });
    fab.addEventListener("pointerup", () => (fab.style.cursor = "grab"));
    fab.addEventListener("pointercancel", () => (fab.style.cursor = "grab"));
  }

  boot();
})();
