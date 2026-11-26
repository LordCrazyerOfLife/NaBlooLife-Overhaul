/* NaBlooLife Mod Menu (verified mod, built on the ideas and look of cheat.js).
 *
 *  Quick   - money, main stats, relationships, health and legal shortcuts.
 *  Career  - every stat your current job and careers keep in the save (football, NBA, chess, gang,
 *            drift, politics, zoo and so on), read from the save itself so new fields show up too.
 *  Odds    - change how the game's chance() rolls come out: boost, always pass or always fail.
 *  Hiring  - skip the checks that stop you getting regular jobs.
 *  Data    - search and edit anything in the saved life.
 *
 * Edits can be undone from the menu until the page is reloaded. Odds and hiring settings are not
 * saved: they are back to normal after a reload, and have no effect while the mod is switched off.
 */
(() => {
  "use strict";
  if (window.MOD_MENU) return;

  function boot() {
    if (
      typeof state === "undefined" ||
      typeof renderStats !== "function" ||
      typeof openJob !== "function" ||
      typeof hireJob !== "function" ||
      !document.querySelector(".phone")
    )
      return setTimeout(boot, 60);
    try {
      init();
    } catch (e) {
      console.warn("[mod-menu]", e);
    }
  }

  // saved-life keys that hold a career, in the order they are listed
  const CAREERS = [
    ["job", "Current job"],
    ["partJob", "Part-time job"],
    ["school", "School"],
    ["futbol", "Football career"],
    ["nba", "NBA career"],
    ["chess", "Chess career"],
    ["gangLife", "Gang"],
    ["drift", "Drift career"],
    ["racing", "Street racing"],
    ["judge", "Judge"],
    ["artCareer", "Artist"],
    ["art", "Painting"],
    ["politics", "Politics"],
    ["zoo", "Zoo"],
    ["acting", "Acting"],
    ["music", "Music"],
    ["musician", "Musician"],
    ["fighter", "Fighting"],
    ["cartel", "Cartel"],
    ["mafia", "Mafia"],
    ["drugEmpire", "Drug empire"],
    ["biz", "Business"],
    ["empire", "Business empire"],
    ["royal", "Royalty"],
    ["bootCamp", "Boot camp"],
    ["veteran", "Military record"],
  ];
  // "Max good stats" only touches 0-100 numbers with a name like these, and never names like BAD
  const GOOD =
    /(perf|skill|rel$|^rel|rep|fame|respect|popular|morale|fitness|energy|health|happiness|smarts|looks|talent|form|rating|ovr|trust|loyal|charisma|prestige|discipline|confidence|chemistry|approval|support|stamina|speed|strength|shoot|pass|dribbl|defen|control|angle|line)/i;
  const BAD =
    /(heat|suspic|stress|injur|debt|wanted|addict|ban|fatigue|enemy|risk|anger|damage|penalt|warn|strike|loss|cost|age|year|month|week|count|num|idx|index|id$)/i;
  const LIMIT = 150; // most entries listed at once

  function init() {
    const el = (tag, cls, text) => {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text; // names from the save are never treated as HTML
      return n;
    };

    const style = el("style");
    style.textContent = `
      #modMenuFab { position:fixed; z-index:2147482990; left:14px; bottom:90px; width:50px; height:50px; border:0; border-radius:50%;
        background:linear-gradient(145deg,#6a2bd9,#2b1260); color:#fff; font-size:22px; padding:0; cursor:grab; touch-action:none;
        user-select:none; box-shadow:0 3px 14px rgba(0,0,0,.5); }
      #modMenuBack { position:fixed; inset:0; z-index:2147482991; background:rgba(0,0,0,.5); display:none; }
      #modMenu { position:fixed; z-index:2147482992; left:50%; top:50%; transform:translate(-50%,-50%); width:min(390px,95vw);
        height:min(620px,84vh); display:none; flex-direction:column; background:#1b1e26; color:#fff; border-radius:16px; overflow:hidden;
        box-shadow:0 10px 40px rgba(0,0,0,.6); font-family:system-ui,sans-serif; text-align:left; }
      #modMenu button { font-family:inherit; cursor:pointer; }
      #modMenu .mm-head { display:flex; align-items:center; gap:8px; padding:12px 14px; background:#20242e; border-bottom:1px solid #2d323d; }
      #modMenu .mm-title { flex:1; font-weight:800; font-size:16px; }
      #modMenu .mm-small { border:0; border-radius:8px; background:#2d323d; color:#fff; font-size:12px; font-weight:700; padding:7px 10px; }
      #modMenu .mm-small:disabled { opacity:.4; }
      #modMenu .mm-tabs { display:flex; gap:4px; padding:8px; border-bottom:1px solid #2d323d; }
      #modMenu .mm-tab { flex:1; border:0; border-radius:9px; background:transparent; color:#9aa0ab; font-size:12px; font-weight:800;
        padding:7px 2px; text-transform:uppercase; }
      #modMenu .mm-tab.on { background:#4a2f8f; color:#fff; }
      #modMenu .mm-body { flex:1; overflow-y:auto; padding:10px 12px 16px; overscroll-behavior:contain; }
      #modMenu .mm-btn { display:block; width:100%; margin:0 0 7px; padding:11px 10px; border:0; border-radius:9px; background:#2a2f3b;
        color:#fff; font-size:13px; font-weight:700; text-align:left; }
      #modMenu .mm-btn.on { background:#2e7d46; }
      #modMenu .mm-grid { display:grid; grid-template-columns:1fr 1fr; gap:0 7px; }
      #modMenu .mm-grid .mm-btn { text-align:center; }
      #modMenu .mm-note { font-size:11.5px; line-height:1.45; color:#9aa0ab; margin:2px 0 10px; }
      #modMenu .mm-group { margin:0 0 7px; border:1px solid #2d323d; border-radius:10px; }
      #modMenu .mm-group > .mm-btn { margin:0; background:#262b36; }
      #modMenu .mm-inner { padding:6px 8px 2px; }
      #modMenu .mm-row { display:flex; align-items:center; gap:6px; padding:4px 0; border-bottom:1px solid #262a33; }
      #modMenu .mm-name { flex:1; min-width:0; font-size:12.5px; overflow-wrap:anywhere; }
      #modMenu .mm-row input { width:108px; box-sizing:border-box; padding:7px 8px; border:1px solid #3a4257; border-radius:8px;
        background:#151821; color:#fff; font-size:13px; }
      #modMenu input.mm-search, #modMenu input.mm-wide { width:100%; box-sizing:border-box; padding:10px; margin:0 0 8px;
        border:1px solid #3a4257; border-radius:9px; background:#151821; color:#fff; font-size:14px; }
    `;
    document.head.appendChild(style);

    // ------------------------------------------------------------------ window and button
    const fab = el("button", "", "\u{1F6E0}\u{FE0F}");
    (fab.id = "modMenuFab"), (fab.type = "button"), fab.setAttribute("aria-label", "Mod Menu");
    const back = el("div");
    back.id = "modMenuBack";
    const panel = el("div");
    panel.id = "modMenu";
    const head = el("div", "mm-head");
    const undoBtn = el("button", "mm-small", "Undo");
    const closeBtn = el("button", "mm-small", "✕");
    head.append(el("div", "mm-title", "\u{1F6E0}\u{FE0F} Mod Menu"), undoBtn, closeBtn);
    const tabs = el("div", "mm-tabs");
    const body = el("div", "mm-body");
    panel.append(head, tabs, body);

    // the mod switch takes the button off the page when the mod is turned off
    const enabled = () => fab.isConnected;

    // ------------------------------------------------------------------ changing the save, with undo
    const undoStack = [];
    function refresh() {
      for (const fn of ["renderStats", "renderJobLine", "updateDockTab"])
        try {
          typeof window[fn] === "function" && window[fn]();
        } catch (e) {
          console.warn("[mod-menu]", fn, e);
        }
      try {
        window.blSaveLife && Promise.resolve(window.blSaveLife()).catch(() => {});
      } catch {}
      undoBtn.disabled = !undoStack.length;
    }
    // changes: [[object, key, newValue], ...] undone together
    function apply(changes) {
      const done = [];
      for (const [obj, key, value] of changes) {
        if (!obj || Object.is(obj[key], value)) continue;
        done.push([obj, key, obj[key], Object.prototype.hasOwnProperty.call(obj, key)]);
        obj[key] = value;
      }
      if (done.length) undoStack.push(done);
      refresh();
      return done.length;
    }
    function undo() {
      const last = undoStack.pop();
      if (!last) return;
      for (const [obj, key, old, had] of last.reverse()) had ? (obj[key] = old) : delete obj[key];
      refresh();
      show(current);
    }

    // ------------------------------------------------------------------ widgets
    const note = (parent, text) => parent.appendChild(el("div", "mm-note", text));
    function button(parent, label, fn, cls) {
      const b = el("button", "mm-btn" + (cls ? " " + cls : ""), label);
      b.type = "button";
      b.addEventListener("click", () => fn(b));
      parent.appendChild(b);
      return b;
    }
    function group(parent, label, fill, open) {
      const box = el("div", "mm-group");
      const inner = el("div", "mm-inner");
      let filled = false;
      const set = (on) => {
        if (on && !filled) (filled = true), fill(inner);
        inner.style.display = on ? "block" : "none";
        title.textContent = `${on ? "▾" : "▸"} ${label}`;
      };
      const title = button(box, "", () => set(inner.style.display === "none"));
      box.appendChild(inner);
      parent.appendChild(box);
      set(!!open);
      return box;
    }

    const isObj = (v) => v !== null && typeof v === "object";
    const titleOf = (key, v) => {
      const name = isObj(v) && (v.name || v.t || v.title || (v.first && `${v.first} ${v.last || ""}`));
      const size = Array.isArray(v) ? ` [${v.length}]` : "";
      return typeof name === "string" ? `${key} · ${name}` : `${key}${size}`;
    };

    // one editable value
    function valueRow(parent, obj, key, label) {
      const v = obj[key];
      const row = el("div", "mm-row");
      row.appendChild(el("div", "mm-name", label || String(key)));
      if (typeof v === "boolean") {
        const b = el("button", "mm-small", v ? "Yes" : "No");
        b.type = "button";
        b.addEventListener("click", () => {
          apply([[obj, key, !obj[key]]]);
          b.textContent = obj[key] ? "Yes" : "No";
        });
        row.appendChild(b);
      } else {
        const input = el("input");
        input.type = "text";
        if (typeof v === "number") input.inputMode = "decimal";
        const text = (x) => (x === null ? "null" : x === undefined ? "" : String(x));
        input.value = text(v);
        input.addEventListener("change", () => {
          const old = obj[key],
            raw = input.value;
          let next;
          if (typeof old === "number") {
            next = Number(raw.replace(/[,\s$]/g, ""));
            if (!raw.trim() || !Number.isFinite(next)) return void (input.value = text(old));
          } else if (typeof old === "string") next = raw;
          else {
            // empty values: accept a number, true, false, null or "text"
            try {
              next = JSON.parse(raw);
            } catch {
              next = raw;
            }
            if (isObj(next)) return void (input.value = text(old));
          }
          apply([[obj, key, next]]);
          input.value = text(obj[key]);
        });
        row.appendChild(input);
      }
      parent.appendChild(row);
    }

    // every field of an object; nested objects open on demand
    function fields(parent, obj, depth) {
      const keys = Object.keys(obj).filter((k) => typeof obj[k] !== "function");
      const plain = keys.filter((k) => !isObj(obj[k]));
      const nested = keys.filter((k) => isObj(obj[k]));
      plain.slice(0, LIMIT).forEach((k) => valueRow(parent, obj, k));
      if (depth < 7)
        nested.slice(0, LIMIT).forEach((k) => group(parent, titleOf(k, obj[k]), (inner) => fields(inner, obj[k], depth + 1)));
      if (!keys.length) note(parent, "Nothing stored here yet.");
      if (plain.length > LIMIT || nested.length > LIMIT) note(parent, `Only the first ${LIMIT} are listed. Use the Data tab search.`);
    }

    function goodStats(obj, out = [], depth = 0, seen = new Set()) {
      if (depth > 3 || seen.has(obj) || Array.isArray(obj)) return out; // lists hold other people
      seen.add(obj);
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (isObj(v)) goodStats(v, out, depth + 1, seen);
        else if (typeof v === "number" && v >= 0 && v < 100 && GOOD.test(k) && !BAD.test(k)) out.push([obj, k, 100]);
      }
      return out;
    }

    // ------------------------------------------------------------------ Quick tab
    function quickTab() {
      note(body, "Money");
      const money = el("div", "mm-grid");
      body.appendChild(money);
      for (const amt of [1e3, 1e5, 1e6, 1e9])
        button(money, `+$${amt.toLocaleString("en-US")}`, () => apply([[state, "money", (state.money || 0) + amt]]));
      if (state.stats) {
        group(
          body,
          "Main stats and money",
          (inner) => {
            valueRow(inner, state, "money", "Money");
            valueRow(inner, state, "age", "Age");
            Object.keys(state.stats).forEach((k) => valueRow(inner, state.stats, k));
            if (typeof state.respect === "number") valueRow(inner, state, "respect", "Respect");
          },
          true,
        );
        button(body, "Max all main stats", () => {
          apply(Object.keys(state.stats).map((k) => [state.stats, k, 100]));
          show("Quick");
        });
      }
      button(body, "Max all relationships", () => {
        const people = [state.spouse, ...(state.lovers || []), ...(state.exes || []), ...(state.family || []), ...(state.friends || [])];
        apply(people.filter((p) => p && typeof p.rel === "number").map((p) => [p, "rel", 100]));
      });
      button(body, "Heal: clear illnesses, conditions, depression", () =>
        apply([
          [state, "ills", []],
          [state, "conds", []],
          [state, "depressed", null],
        ]),
      );
      button(body, "Clean slate: record, charges, expulsion, homeless", () =>
        apply([
          [state, "record", 0],
          [state, "felony", null],
          [state, "expelled", null],
          [state, "homeless", null],
        ]),
      );
      button(body, "Get out of prison", () => state.prison && apply([[state, "prison", null]]));
      if (typeof ageBtnEl !== "undefined") button(body, "Age up (+1 year)", () => (close(), ageBtnEl.click()));
    }

    // ------------------------------------------------------------------ Career tab
    function careerTab() {
      const found = CAREERS.filter(([k]) => isObj(state[k]) && Object.keys(state[k]).length);
      note(
        body,
        found.length
          ? "Stats your careers have saved. Type a new value, then tap outside the box. A career lists a stat only once the game has created it."
          : "No career data yet. Start a job or a career, then come back.",
      );
      found.forEach(([k, label], i) =>
        group(
          body,
          titleOf(label, state[k]),
          (inner) => {
            if (goodStats(state[k]).length)
              button(inner, "Max good stats (0-100 only)", () => {
                const n = apply(goodStats(state[k]));
                show("Career");
                note(body, `${label}: set ${n} stats to 100. Tap Undo to reverse.`);
                body.scrollTop = body.scrollHeight;
              });
            fields(inner, state[k], 1);
          },
          i === 0,
        ),
      );
    }

    // ------------------------------------------------------------------ Odds tab
    const odds = { mode: "normal", min: 90, scope: "taps" };
    let tapping = false,
      forced = 0,
      burst = false;
    window.rollHook = (p) => {
      const real = () => Math.random() < p;
      if (!enabled() || odds.mode === "normal" || (odds.scope === "taps" && !tapping)) return real();
      // 50/50 rolls are mostly coin flips (gender, looks, wording), and sure things are left alone
      if (typeof p !== "number" || p === 0.5 || p <= 0 || p >= 1) return real();
      if (!burst) (burst = true), (forced = 0), setTimeout(() => (burst = false), 0);
      if (++forced > 300) return real(); // never let a "repeat while lucky" loop run forever
      if (odds.mode === "yes") return true;
      if (odds.mode === "no") return false;
      return Math.random() < Math.max(p, odds.min / 100);
    };
    // a tap counts until its handlers have run. Age Up is left out so yearly events stay normal.
    document.addEventListener(
      "click",
      (e) => {
        const t = e.target;
        if (!t || !t.closest || t.closest("#ageBtn, #modMenu, #modMenuFab, #modMenuBack")) return;
        tapping = true;
        setTimeout(() => (tapping = false), 0);
      },
      true,
    );

    function oddsTab() {
      note(
        body,
        "Changes the game's chance rolls. A roll can decide something good OR bad: 'Always pass' can get you accepted, but can also get you caught. Switch back to Normal when you're done.",
      );
      for (const [mode, label] of [
        ["normal", "Normal odds"],
        ["boost", "Boost: at least the chance below"],
        ["yes", "Always pass (roll comes out yes)"],
        ["no", "Always fail (roll comes out no)"],
      ])
        button(body, label, () => ((odds.mode = mode), paintFab(), show("Odds")), odds.mode === mode ? "on" : "");
      const row = el("div", "mm-row");
      const input = el("input");
      (input.type = "text"), (input.inputMode = "numeric"), (input.value = String(odds.min));
      input.addEventListener("change", () => {
        const n = Math.round(Number(input.value));
        if (Number.isFinite(n)) odds.min = Math.max(1, Math.min(99, n));
        input.value = String(odds.min);
      });
      row.append(el("div", "mm-name", "Boost chance (%)"), input);
      body.appendChild(row);
      note(body, "Applies to:");
      button(body, "Only what happens when I tap (not Age Up)", () => ((odds.scope = "taps"), show("Odds")), odds.scope === "taps" ? "on" : "");
      button(body, "Everything, including yearly events", () => ((odds.scope = "all"), show("Odds")), odds.scope === "all" ? "on" : "");
      note(
        body,
        "Covers rolls made with the game's chance() helper: many applications, auditions, parole, loans and more. It does not change mini-games, 50/50 rolls, results that arrive after a delay (in tap mode), requirements, or code that rolls its own numbers. For regular jobs use the Hiring tab.",
      );
    }

    // ------------------------------------------------------------------ Hiring tab
    const hire = { checks: false, rules: false };
    const wrap = (name, make) => {
      const original = window[name];
      if (typeof original === "function") window[name] = make(original);
    };
    // the reasons an employer turns you down after you apply
    wrap("hireJob", (original) => function (...args) {
      if (!enabled() || !hire.checks) return original.apply(this, args);
      const kept = { homeless: state.homeless, felony: state.felony };
      const drugs = window.DRUG_USE,
        rejects = drugs && drugs.rejects;
      (state.homeless = null), (state.felony = null), (checking = true);
      if (drugs) drugs.rejects = () => false;
      try {
        return original.apply(this, args);
      } finally {
        (checking = false), (state.homeless = kept.homeless), (state.felony = kept.felony);
        if (drugs) drugs.rejects = rejects;
      }
    });
    let checking = false;
    wrap("gangInkCheck", (original) => function (...args) {
      return checking ? null : original.apply(this, args);
    });
    // the listing's own rules: age, degree and the random interview rejection
    wrap("openJob", (original) => function (listing, kind, ...rest) {
      const result = original.call(this, listing, kind, ...rest);
      if (enabled() && hire.rules && kind !== "freelance") {
        const normal = jmApply.onclick;
        jmApply.onclick = function (...args) {
          if (!enabled() || !hire.rules) return normal.apply(this, args);
          const cell = [...jmTable.querySelectorAll("td")].find((td) => td.textContent.startsWith("Employer:"));
          jmWrap.classList.remove("open");
          screen.classList.remove("open");
          hireJob(listing, kind, cell ? cell.textContent.slice("Employer:".length).trim() : undefined);
        };
      }
      return result;
    });

    function hiringTab() {
      note(body, "For regular job listings. Turn these on, then open the job and tap Apply.");
      const toggle = (key, label) =>
        button(body, `${hire[key] ? "ON" : "OFF"} · ${label}`, () => ((hire[key] = !hire[key]), paintFab(), show("Hiring")), hire[key] ? "on" : "");
      toggle("rules", "Skip listing rules: age, degree, interview rejection");
      toggle("checks", "Skip background checks: homeless, drugs, face tattoos, felony");
      note(
        body,
        "Your record isn't erased. Special careers (sports, music, acting, the content packs and so on) have their own tryouts and rules: use the Odds tab for their rolls, or raise the stats they look at in the Career and Quick tabs.",
      );
    }

    // ------------------------------------------------------------------ Data tab
    function search(term) {
      const hits = [],
        seen = new Set(),
        queue = [[state, ""]];
      let visited = 0;
      while (queue.length && hits.length < LIMIT && visited < 20000) {
        const [obj, path] = queue.shift();
        if (seen.has(obj)) continue;
        seen.add(obj);
        for (const k of Object.keys(obj)) {
          const v = obj[k],
            p = path ? `${path}.${k}` : k;
          visited++;
          if (isObj(v)) queue.push([v, p]);
          else if (typeof v !== "function" && p.toLowerCase().includes(term) && hits.length < LIMIT) hits.push([obj, k, p]);
        }
      }
      return hits;
    }
    let lastSearch = "";
    function dataTab() {
      note(body, "Everything in the saved life. Search a name such as fame, rating or salary, or browse. Wrong values can break a save: use Undo right away.");
      const box = el("input", "mm-search");
      (box.type = "search"), (box.placeholder = "Search the save…"), (box.value = lastSearch);
      const results = el("div");
      const run = () => {
        lastSearch = box.value;
        results.replaceChildren();
        const term = box.value.trim().toLowerCase();
        if (term.length < 2) return fields(results, state, 0);
        const hits = search(term);
        hits.forEach(([obj, k, path]) => valueRow(results, obj, k, path));
        note(results, hits.length ? `${hits.length}${hits.length === LIMIT ? "+" : ""} matches` : "No matches.");
      };
      box.addEventListener("input", run);
      body.append(box, results);
      run();
    }

    // ------------------------------------------------------------------ tabs, open, close
    const TABS = { Quick: quickTab, Career: careerTab, Odds: oddsTab, Hiring: hiringTab, Data: dataTab };
    let current = "Quick";
    function show(name) {
      const same = name === current,
        scroll = body.scrollTop;
      current = name;
      body.replaceChildren();
      [...tabs.children].forEach((t) => t.classList.toggle("on", t.textContent === name));
      try {
        TABS[name]();
      } catch (e) {
        console.warn("[mod-menu]", name, e);
        note(body, "This tab couldn't be shown for this life.");
      }
      body.scrollTop = same ? scroll : 0;
      undoBtn.disabled = !undoStack.length;
    }
    for (const name of Object.keys(TABS)) {
      const t = el("button", "mm-tab", name);
      t.type = "button";
      t.addEventListener("click", () => show(name));
      tabs.appendChild(t);
    }
    // a ring on the button is a reminder that odds or hiring changes are on
    function paintFab() {
      fab.style.outline = odds.mode !== "normal" || hire.checks || hire.rules ? "3px solid #ffd21f" : "";
    }
    function open() {
      (back.style.display = "block"), (panel.style.display = "flex");
      show(current);
    }
    function close() {
      (back.style.display = "none"), (panel.style.display = "none");
    }
    closeBtn.type = undoBtn.type = "button";
    closeBtn.addEventListener("click", close);
    back.addEventListener("click", close);
    undoBtn.addEventListener("click", undo);
    // keys typed in the menu must not trigger game shortcuts
    panel.addEventListener("keydown", (e) => (e.key === "Escape" ? close() : e.stopPropagation()));

    // drag the button; small movements still count as a tap
    let from = null,
      moved = false;
    fab.addEventListener("pointerdown", (e) => {
      const r = fab.getBoundingClientRect();
      from = { x: e.clientX, y: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top };
      moved = false;
      fab.setPointerCapture && fab.setPointerCapture(e.pointerId);
    });
    fab.addEventListener("pointermove", (e) => {
      if (!from || (!moved && Math.hypot(e.clientX - from.x, e.clientY - from.y) < 8)) return;
      moved = true;
      fab.style.left = `${Math.max(4, Math.min(innerWidth - 54, e.clientX - from.dx))}px`;
      fab.style.top = `${Math.max(4, Math.min(innerHeight - 54, e.clientY - from.dy))}px`;
      fab.style.bottom = "auto";
    });
    for (const type of ["pointerup", "pointercancel"]) fab.addEventListener(type, () => (from = null));
    fab.addEventListener("click", () => {
      if (moved) return void (moved = false);
      panel.style.display === "flex" ? close() : open();
    });

    document.body.append(back, panel, fab);
    window.MOD_MENU = { open, close };
    console.log("[mod-menu] loaded");
  }

  boot();
})();
