
(() => {
  "use strict";

  function boot() {
    if (
      typeof window.COUNTRIES === "undefined" ||
      typeof state === "undefined" ||
      typeof renderStats !== "function" ||
      typeof usd !== "function" ||
      typeof say !== "function"
    )
      return setTimeout(boot, 60);
    try {
      init();
    } catch (e) {
      console.warn("[cheat]", e);
    }
  }

  function init() {
    if (document.getElementById("cheatFab")) return; // already injected

    const STATS = ["Happiness", "Health", "Smarts", "Looks"];

    // ---------------------------------------------------------------- styles
    const style = document.createElement("style");
    style.textContent = `
      #cheatFab {
        position: fixed; z-index: 2147483000; right: 14px; bottom: 90px;
        width: 50px; height: 50px; border-radius: 50%; border: none;
        background: linear-gradient(145deg,#2b2f3a,#1a1d24); color: #fff;
        font-size: 22px; line-height: 50px; text-align: center; padding: 0;
        cursor: grab; box-shadow: 0 3px 14px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.08);
        touch-action: none; user-select: none; transition: transform .12s ease;
      }
      #cheatFab:active { transform: scale(.92); }
      #cheatBackdrop {
        position: fixed; inset: 0; z-index: 2147483001; background: rgba(0,0,0,.5);
        display: none; backdrop-filter: blur(1px);
      }
      #cheatPanel {
        position: fixed; z-index: 2147483002; left: 50%; top: 50%;
        transform: translate(-50%,-50%); width: min(340px, 92vw);
        max-height: 80vh; display: none; flex-direction: column;
        background: #1b1e26; color: #fff; border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,.6); overflow: hidden;
        font-family: system-ui, sans-serif;
      }
      #cheatPanel .cp-head {
        display: flex; align-items: center; justify-content: space-between;
        padding: 14px 16px 10px; background: #20242e;
        border-bottom: 1px solid #2d323d; cursor: grab; touch-action: none;
      }
      #cheatPanel .cp-head:active { cursor: grabbing; }
      #cheatPanel .cp-title { font-weight: 800; font-size: 16px; letter-spacing: .02em; }
      #cheatAskBackdrop {
        position: fixed; inset: 0; z-index: 2147483002; background: rgba(0,0,0,.5);
        display: none; backdrop-filter: blur(1px);
      }
      #cheatPanel .cp-close {
        width: 28px; height: 28px; border-radius: 50%; border: none;
        background: #2d323d; color: #fff; font-size: 15px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
      }
      #cheatPanel .cp-tabs {
        display: flex; gap: 4px; padding: 8px 10px; background: #1b1e26;
        border-bottom: 1px solid #2d323d; overflow-x: auto;
      }
      #cheatPanel .cp-tab {
        flex: 1 0 auto; border: none; cursor: pointer; padding: 7px 10px;
        border-radius: 9px; background: transparent; color: #9aa0ab;
        font-size: 12px; font-weight: 700; text-transform: uppercase;
        letter-spacing: .03em; white-space: nowrap;
      }
      #cheatPanel .cp-tab.active { background: #323849; color: #fff; }
      #cheatPanel .cp-body { padding: 10px 14px 14px; overflow-y: auto; }
      #cheatPanel .cp-section { display: none; }
      #cheatPanel .cp-section.active { display: block; }
      #cheatPanel .cp-grid {
        display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-bottom: 10px;
      }
      #cheatPanel .cp-btn {
        display: block; width: 100%; padding: 10px 9px; border-radius: 9px;
        border: none; background: #2a2f3b; color: #fff; cursor: pointer;
        font-size: 12.5px; text-align: center; font-weight: 600;
        transition: background .12s ease;
      }
      #cheatPanel .cp-btn:hover, #cheatPanel .cp-btn:active { background: #3a4257; }
      #cheatPanel .cp-btn.wide { grid-column: 1 / -1; text-align: left; }
      #cheatPanel .cp-note {
        font-size: 11px; color: #8b919c; margin: 2px 0 10px; line-height: 1.4;
      }
      #cheatAsk {
        position: fixed; z-index: 2147483003; left: 50%; top: 50%;
        transform: translate(-50%,-50%); width: min(280px, 85vw);
        background: #20242e; color: #fff; border-radius: 14px; padding: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,.6); font-family: system-ui, sans-serif;
        display: none;
      }
      #cheatAsk .ca-label { font-size: 13px; font-weight: 700; margin-bottom: 8px; }
      #cheatAsk input {
        width: 100%; box-sizing: border-box; padding: 9px 10px; border-radius: 9px;
        border: 1px solid #3a4257; background: #151821; color: #fff; font-size: 14px;
        margin-bottom: 10px;
      }
      #cheatAsk .ca-row { display: flex; gap: 8px; }
      #cheatAsk .ca-row button {
        flex: 1; padding: 9px; border-radius: 9px; border: none; cursor: pointer;
        font-size: 13px; font-weight: 700;
      }
      #cheatAsk .ca-cancel { background: #2a2f3b; color: #fff; }
      #cheatAsk .ca-ok { background: #4c7cf0; color: #fff; }
    `;
    document.head.appendChild(style);

    // ---------------------------------------------------------------- tiny styled prompt (replaces window.prompt)
    const askBackdrop = document.createElement("div");
    askBackdrop.id = "cheatAskBackdrop";
    const askBox = document.createElement("div");
    askBox.id = "cheatAsk";
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
    fab.id = "cheatFab";
    fab.type = "button";
    fab.textContent = "\u{1F4B0}";
    fab.setAttribute("aria-label", "Cheat menu");

    // ---------------------------------------------------------------- panel
    const backdrop = document.createElement("div");
    backdrop.id = "cheatBackdrop";

    const panel = document.createElement("div");
    panel.id = "cheatPanel";
    panel.innerHTML = `
      <div class="cp-head">
        <div class="cp-title">\u{1F4B0} Cheats</div>
        <button class="cp-close" type="button" aria-label="Close">✕</button>
      </div>
      <div class="cp-tabs"></div>
      <div class="cp-body"></div>
    `;
    const tabsEl = panel.querySelector(".cp-tabs");
    const bodyEl = panel.querySelector(".cp-body");

    function openPanel() {
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
        // Switch from centered (transform-based) positioning to an
        // explicit pixel position, anchored at the panel's current spot,
        // so it doesn't jump when the drag starts.
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

    let sectionCount = 0;
    function section(label) {
      sectionCount++;
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "cp-tab" + (sectionCount === 1 ? " active" : "");
      tab.textContent = label;
      tabsEl.appendChild(tab);

      const sec = document.createElement("div");
      sec.className = "cp-section" + (sectionCount === 1 ? " active" : "");
      bodyEl.appendChild(sec);

      tab.addEventListener("click", () => {
        tabsEl.querySelectorAll(".cp-tab").forEach((t) => t.classList.remove("active"));
        bodyEl.querySelectorAll(".cp-section").forEach((s) => s.classList.remove("active"));
        tab.classList.add("active");
        sec.classList.add("active");
      });

      return sec;
    }

    function btn(parent, label, fn, wide) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cp-btn" + (wide ? " wide" : "");
      b.textContent = label;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        fn();
      });
      parent.appendChild(b);
      return b;
    }

    function grid(parent) {
      const g = document.createElement("div");
      g.className = "cp-grid";
      parent.appendChild(g);
      return g;
    }

    function note(parent, text) {
      const n = document.createElement("div");
      n.className = "cp-note";
      n.textContent = text;
      parent.appendChild(n);
    }

    // ------------------------------------------------------------------ Money tab
    const moneySec = section("Money");
    const moneyGrid = grid(moneySec);
    [
      [1000, "+$1,000"],
      [10000, "+$10,000"],
      [100000, "+$100,000"],
      [1000000, "+$1,000,000"],
    ].forEach(([amt, label]) => {
      btn(moneyGrid, label, () => {
        state.money = (state.money || 0) + amt;
        renderStats();
        say(`I found ${usd(amt)}... from somewhere.`);
      });
    });
    btn(moneySec, "Custom amount…", async () => {
      const raw = await ask("Add how much money? (negative to remove)", "0");
      if (raw === null) return;
      const amt = Math.round(parseFloat(raw));
      if (!Number.isFinite(amt) || !amt) return;
      state.money = Math.max(0, (state.money || 0) + amt);
      renderStats();
      say(amt > 0 ? `I found ${usd(amt)}... from somewhere.` : `I lost ${usd(-amt)} somehow.`);
    }, true);
    btn(moneySec, "Set cash to…", async () => {
      const raw = await ask("Set cash to:", state.money || 0);
      if (raw === null) return;
      const amt = Math.round(parseFloat(raw));
      if (!Number.isFinite(amt) || amt < 0) return;
      state.money = amt;
      renderStats();
    }, true);
    btn(moneySec, "Set cash to $0", () => {
      state.money = 0;
      renderStats();
    }, true);

    // ------------------------------------------------------------------ Stats tab
    const statsSec = section("Stats");
    const statsGrid = grid(statsSec);
    btn(statsGrid, "Max all (100%)", () => {
      STATS.forEach((k) => (state.stats[k] = 100));
      renderStats();
    });
    btn(statsGrid, "Min all (0%)", () => {
      STATS.forEach((k) => (state.stats[k] = 0));
      renderStats();
    });
    STATS.forEach((k) => {
      btn(statsGrid, `Max ${k}`, () => {
        state.stats[k] = 100;
        renderStats();
      });
    });

    // ------------------------------------------------------------------ Relationships tab
    const relSec = section("Relations");
    btn(relSec, "Max relationship: Spouse/Partner", () => {
      const p =
        (state.spouse && !state.spouse.dead && state.spouse) ||
        (state.lovers || []).find((e) => e && !e.dead);
      if (p && "number" == typeof p.rel) (p.rel = 100), renderStats();
    }, true);
    btn(relSec, "Max all relationships", () => {
      const all = [
        state.spouse,
        ...(state.lovers || []),
        ...(state.exes || []),
        ...(state.family || []),
        ...(state.friends || []),
      ];
      all.forEach((e) => e && "number" == typeof e.rel && (e.rel = 100));
      renderStats();
    }, true);

    // ------------------------------------------------------------------ Career & School tab
    const careerSec = section("Career");
    btn(careerSec, "Max job performance", () => {
      if (!state.job) return say("I don't have a job right now.");
      state.job.perf = 100;
      renderStats();
    }, true);
    btn(careerSec, "Boost salary x5", () => {
      if (!state.job) return say("I don't have a job right now.");
      state.job.pay = Math.round((state.job.pay || 0) * 5);
      renderStats();
    }, true);
    btn(careerSec, "Set salary to $1,000,000/yr", () => {
      if (!state.job) return say("I don't have a job right now.");
      state.job.pay = 1000000;
      renderStats();
    }, true);
    btn(careerSec, "Clear expulsion record", () => {
      state.expelled = null;
      renderStats();
    }, true);
    btn(careerSec, "Max respect", () => {
      state.respect = 100;
      renderStats();
    }, true);
    btn(careerSec, "Min respect", () => {
      state.respect = 0;
      renderStats();
    }, true);

    // ------------------------------------------------------------------ Health & Legal tab
    const healthSec = section("Health");
    btn(healthSec, "Cure depression", () => {
      state.depressed = null;
      renderStats();
    }, true);
    btn(healthSec, "Clear all illnesses", () => {
      state.ills = [];
      renderStats();
    }, true);
    btn(healthSec, "Clear all conditions", () => {
      state.conds = [];
      renderStats();
    }, true);
    btn(healthSec, "End homelessness", () => {
      state.homeless = null;
      renderStats();
    }, true);
    btn(healthSec, "Clear criminal record", () => {
      state.record = 0;
      renderStats();
    }, true);
    btn(healthSec, "Drop pending felony charge", () => {
      state.felony = null;
      renderStats();
    }, true);

    // ------------------------------------------------------------------ Misc tab
    const miscSec = section("Misc");
    if (typeof mindOf === "function")
      btn(miscSec, "Max Mental Health", () => {
        const m = mindOf();
        (m.mh = 100), (m.ins = 0);
        renderStats();
      }, true);
    btn(miscSec, "Get out of prison", () => {
      if (!state.prison) return;
      (state.prison = null), renderStats(), say("Somehow, I'm out of prison.");
    }, true);
    btn(miscSec, "Set age…", async () => {
      const raw = await ask("Set age to:", state.age);
      if (raw === null) return;
      const age = Math.round(parseFloat(raw));
      if (!Number.isFinite(age) || age < 0) return;
      (state.age = age), renderStats();
    }, true);
    if (typeof ageBtnEl !== "undefined")
      btn(miscSec, "Age up (+1 year)", () => ageBtnEl.click(), true);
    note(miscSec, "Drag the \u{1F4B0} button or this panel's header to move them. Tap the button to open/close this menu.");

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

    // ------------------------------------------------------------ drag the button around
    // A real drag only starts once the pointer has moved past DRAG_THRESHOLD
    // pixels from where it went down. Below that, it's treated as a tap --
    // touchscreens virtually never keep a finger perfectly still, so without
    // this threshold almost every tap picked up a pixel or two of movement,
    // got flagged as "dragged", and the click handler silently swallowed it
    // instead of opening the menu.
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

    console.log("[cheat] loaded");
  }

  boot();
})();
