(() => {
  "use strict";

  // Built from the same base as cheat.js (floating draggable button + a
  // draggable popup panel, plus the styled ask() prompt that replaces
  // window.prompt), stripped down to a single thing: a dev/testing
  // control to set your character's age directly, ahead of that being
  // an official in-game option.

  function boot() {
    if (
      typeof window.COUNTRIES === "undefined" ||
      typeof state === "undefined" ||
      typeof renderStats !== "function" ||
      typeof say !== "function"
    )
      return setTimeout(boot, 60);
    try {
      init();
    } catch (e) {
      console.warn("[debugmenu]", e);
    }
  }

  function init() {
    if (document.getElementById("dbgFab")) return; // already injected

    // ---------------------------------------------------------------- styles
    const style = document.createElement("style");
    style.textContent = `
      #dbgFab {
        position: fixed; z-index: 2147483000; right: 14px; bottom: 150px;
        width: 50px; height: 50px; border-radius: 50%; border: none;
        background: linear-gradient(145deg,#2b2f3a,#1a1d24); color: #fff;
        font-size: 22px; line-height: 50px; text-align: center; padding: 0;
        cursor: grab; box-shadow: 0 3px 14px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.08);
        touch-action: none; user-select: none; transition: transform .12s ease;
      }
      #dbgFab:active { transform: scale(.92); }
      #dbgBackdrop {
        position: fixed; inset: 0; z-index: 2147483001; background: rgba(0,0,0,.5);
        display: none; backdrop-filter: blur(1px);
      }
      #dbgPanel {
        position: fixed; z-index: 2147483002; left: 50%; top: 50%;
        transform: translate(-50%,-50%); width: min(320px, 92vw);
        max-height: 80vh; display: none; flex-direction: column;
        background: #1b1e26; color: #fff; border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,.6); overflow: hidden;
        font-family: system-ui, sans-serif;
      }
      #dbgPanel .cp-head {
        display: flex; align-items: center; justify-content: space-between;
        padding: 14px 16px 10px; background: #20242e;
        border-bottom: 1px solid #2d323d; cursor: grab; touch-action: none;
      }
      #dbgPanel .cp-head:active { cursor: grabbing; }
      #dbgPanel .cp-title { font-weight: 800; font-size: 16px; letter-spacing: .02em; }
      #dbgPanel .cp-close {
        width: 28px; height: 28px; border-radius: 50%; border: none;
        background: #2d323d; color: #fff; font-size: 15px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
      }
      #dbgPanel .cp-body { padding: 14px 16px 16px; overflow-y: auto; }
      #dbgPanel .cp-current {
        font-size: 13px; color: #9aa0ab; margin-bottom: 12px;
      }
      #dbgPanel .cp-current b { color: #fff; }
      #dbgPanel .cp-btn {
        display: block; width: 100%; padding: 11px 9px; border-radius: 9px;
        border: none; background: #2a2f3b; color: #fff; cursor: pointer;
        font-size: 13px; text-align: center; font-weight: 600;
        transition: background .12s ease;
      }
      #dbgPanel .cp-btn:hover, #dbgPanel .cp-btn:active { background: #3a4257; }
      #dbgPanel .cp-note {
        font-size: 11px; color: #8b919c; margin-top: 10px; line-height: 1.4;
      }
      #dbgAskBackdrop {
        position: fixed; inset: 0; z-index: 2147483002; background: rgba(0,0,0,.5);
        display: none; backdrop-filter: blur(1px);
      }
      #dbgAsk {
        position: fixed; z-index: 2147483003; left: 50%; top: 50%;
        transform: translate(-50%,-50%); width: min(280px, 85vw);
        background: #20242e; color: #fff; border-radius: 14px; padding: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,.6); font-family: system-ui, sans-serif;
        display: none;
      }
      #dbgAsk .ca-label { font-size: 13px; font-weight: 700; margin-bottom: 8px; }
      #dbgAsk input {
        width: 100%; box-sizing: border-box; padding: 9px 10px; border-radius: 9px;
        border: 1px solid #3a4257; background: #151821; color: #fff; font-size: 14px;
        margin-bottom: 10px;
      }
      #dbgAsk .ca-row { display: flex; gap: 8px; }
      #dbgAsk .ca-row button {
        flex: 1; padding: 9px; border-radius: 9px; border: none; cursor: pointer;
        font-size: 13px; font-weight: 700;
      }
      #dbgAsk .ca-cancel { background: #2a2f3b; color: #fff; }
      #dbgAsk .ca-ok { background: #4c7cf0; color: #fff; }
    `;
    document.head.appendChild(style);

    // ---------------------------------------------------------------- tiny styled prompt (replaces window.prompt)
    const askBackdrop = document.createElement("div");
    askBackdrop.id = "dbgAskBackdrop";
    const askBox = document.createElement("div");
    askBox.id = "dbgAsk";
    askBox.innerHTML = `
      <div class="ca-label"></div>
      <input type="text" inputmode="decimal" />
      <div class="ca-row">
        <button class="ca-cancel" type="button">Cancel</button>
        <button class="ca-ok" type="button">OK</button>
      </div>
    `;
    document.body.appendChild(askBackdrop);
    document.body.appendChild(askBox);
    const askLabel = askBox.querySelector(".ca-label");
    const askInput = askBox.querySelector("input");
    let askResolve = null;
    function closeAsk(value) {
      askBox.style.display = "none";
      askBackdrop.style.display = "none";
      if (askResolve) {
        const r = askResolve;
        askResolve = null;
        r(value);
      }
    }
    askBox.querySelector(".ca-cancel").addEventListener("click", () => closeAsk(null));
    askBox.querySelector(".ca-ok").addEventListener("click", () => closeAsk(askInput.value));
    askInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") closeAsk(askInput.value);
      if (e.key === "Escape") closeAsk(null);
    });
    askBackdrop.addEventListener("click", () => closeAsk(null));
    function ask(label, defVal) {
      askLabel.textContent = label;
      askInput.value = defVal == null ? "" : String(defVal);
      askBackdrop.style.display = "block";
      askBox.style.display = "block";
      setTimeout(() => {
        askInput.focus();
        askInput.select();
      }, 10);
      return new Promise((res) => (askResolve = res));
    }

    // ---------------------------------------------------------------- fab trigger
    const fab = document.createElement("button");
    fab.id = "dbgFab";
    fab.type = "button";
    fab.textContent = "\u{1F41B}"; // 🐛
    fab.setAttribute("aria-label", "Debugging menu");

    // ---------------------------------------------------------------- panel
    const backdrop = document.createElement("div");
    backdrop.id = "dbgBackdrop";

    const panel = document.createElement("div");
    panel.id = "dbgPanel";
    panel.innerHTML = `
      <div class="cp-head">
        <div class="cp-title">\u{1F41B} Debug Menu</div>
        <button class="cp-close" type="button" aria-label="Close">✕</button>
      </div>
      <div class="cp-body">
        <div class="cp-current">Current age: <b class="cp-age-val">-</b></div>
        <button class="cp-btn" type="button" data-act="set-age">Set age…</button>
        <div class="cp-note">For testing/development, ahead of this being an official option. Drag the \u{1F41B} button or this panel's header to move them.</div>
      </div>
    `;
    const ageVal = panel.querySelector(".cp-age-val");

    function refresh() {
      ageVal.textContent = state && typeof state.age === "number" ? state.age : "-";
    }

    function openPanel() {
      refresh();
      backdrop.style.display = "block";
      panel.style.display = "flex";
    }
    function closePanel() {
      backdrop.style.display = "none";
      panel.style.display = "none";
    }
    panel.querySelector(".cp-close").addEventListener("click", closePanel);
    backdrop.addEventListener("click", closePanel);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.style.display !== "none") closePanel();
    });

    panel.querySelector('[data-act="set-age"]').addEventListener("click", async () => {
      const raw = await ask("Set age to:", state.age);
      if (raw === null) return;
      const age = Math.round(parseFloat(raw));
      if (!Number.isFinite(age) || age < 0) return;
      state.age = age;
      renderStats();
      refresh();
      say(`I suddenly feel like I'm ${age}.`);
    });

    // -------------------------------------------------------- drag the panel by its header
    const panelHead = panel.querySelector(".cp-head");
    const PANEL_DRAG_THRESHOLD = 8;
    let panelTracking = false,
      panelDragging = false,
      panelStartX = 0,
      panelStartY = 0,
      panelOffX = 0,
      panelOffY = 0;
    panelHead.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".cp-close")) return;
      panelTracking = true;
      panelDragging = false;
      panelStartX = e.clientX;
      panelStartY = e.clientY;
      const r = panel.getBoundingClientRect();
      (panelOffX = e.clientX - r.left), (panelOffY = e.clientY - r.top);
      panelHead.setPointerCapture(e.pointerId);
    });
    panelHead.addEventListener("pointermove", (e) => {
      if (!panelTracking) return;
      if (!panelDragging) {
        const dx = e.clientX - panelStartX,
          dy = e.clientY - panelStartY;
        if (dx * dx + dy * dy < PANEL_DRAG_THRESHOLD * PANEL_DRAG_THRESHOLD) return;
        panelDragging = true;
        const r = panel.getBoundingClientRect();
        panel.style.transform = "none";
        panel.style.left = `${r.left}px`;
        panel.style.top = `${r.top}px`;
      }
      const w = panel.offsetWidth,
        h = panel.offsetHeight,
        x = e.clientX - panelOffX,
        y = e.clientY - panelOffY,
        left = Math.max(4, Math.min(innerWidth - w - 4, x)),
        top = Math.max(4, Math.min(innerHeight - h - 4, y));
      (panel.style.left = `${left}px`), (panel.style.top = `${top}px`);
    });
    panelHead.addEventListener("pointerup", () => {
      panelTracking = false;
      panelDragging = false;
    });
    panelHead.addEventListener("pointercancel", () => {
      panelTracking = false;
      panelDragging = false;
    });

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    document.body.appendChild(fab);

    fab.addEventListener("click", () => {
      if (fab.dataset.dragged === "1") {
        fab.dataset.dragged = "0";
        return;
      }
      if (panel.style.display === "none" || !panel.style.display) openPanel();
      else closePanel();
    });

    const DRAG_THRESHOLD = 8;
    let tracking = false,
      dragging = false,
      startX = 0,
      startY = 0,
      offX = 0,
      offY = 0;
    fab.addEventListener("pointerdown", (e) => {
      tracking = true;
      dragging = false;
      fab.dataset.dragged = "0";
      startX = e.clientX;
      startY = e.clientY;
      const r = fab.getBoundingClientRect();
      (offX = e.clientX - r.left), (offY = e.clientY - r.top);
      fab.setPointerCapture(e.pointerId);
    });
    fab.addEventListener("pointermove", (e) => {
      if (!tracking) return;
      if (!dragging) {
        const dx = e.clientX - startX,
          dy = e.clientY - startY;
        if (dx * dx + dy * dy < DRAG_THRESHOLD * DRAG_THRESHOLD) return;
        dragging = true;
        fab.dataset.dragged = "1";
        fab.style.cursor = "grabbing";
      }
      const x = e.clientX - offX,
        y = e.clientY - offY,
        left = Math.max(4, Math.min(innerWidth - 54, x)),
        top = Math.max(4, Math.min(innerHeight - 54, y));
      (fab.style.left = `${left}px`), (fab.style.top = `${top}px`);
      (fab.style.right = "auto"), (fab.style.bottom = "auto");
    });
    fab.addEventListener("pointerup", () => {
      tracking = false;
      dragging = false;
      fab.style.cursor = "grab";
    });
    fab.addEventListener("pointercancel", () => {
      tracking = false;
      dragging = false;
      fab.style.cursor = "grab";
    });

    console.log("[debugmenu] loaded");
  }

  boot();
})();
