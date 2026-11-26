/* NaBlooLife Verified Mods (modloader.js)
 *
 * Cargado desde game.html despues de mod-switch.js. No usa mods.js.
 * Each entry in MODS is { id, name, icon, src, desc, deps? }; `deps` load before `src`.
 * Paths are relative to unsorted/. To add a mod, add an entry: game.html needs no change.
 * Choices are saved in localStorage["modloader-enabled"] (mods are on by default).
 */
(() => {
  "use strict";

  if (window.MOD_LOADER) return;

  const MODS = [
    {
      id: "cheat",
      name: "Cheat Menu",
      icon: "emoji/1f4b0.png",
      src: "cheat.js?v=1",
      desc: "Adds a small draggable button floating on screen. Tap it to open a panel of cheats: add money, set cash to $0, max or min all four stats, full heal, and age up on demand.",
    },
    {
      id: "displayfix",
      name: "Display Fix (Scale + Safe Area)",
      icon: "emoji/1f4cf.png",
      src: "displayfix.js?v=1",
      desc: "Shrinks the whole phone screen down (default 85%, edit --ui-scale in game.html's style block to adjust). Turning this off takes effect the next time NaBlooLife loads. The notch / status-bar safe-area bar is always on now, built into the page itself.",
    },
  ];

  // ---------------------------------------------------------------- on/off por mod
  const STORE_KEY = "modloader-enabled";
  const readState = () => {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      return s && typeof s === "object" ? s : {};
    } catch {
      return {};
    }
  };
  const writeState = (s) => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(s));
    } catch {}
  };
  const isOn = (m) => {
    const s = readState();
    if (typeof s[m.id] === "boolean") return s[m.id];
    if (typeof s[m.src] === "boolean") return s[m.src]; // formato viejo, por src
    return true; // por defecto: encendido
  };
  const setOn = (m, on) => {
    const s = readState();
    (s[m.id] = on), writeState(s);
  };

  // ---------------------------------------------------------------- carga de scripts
  const loaded = new Set();
  const order = [];
  const addScript = (src, done) => {
    const s = document.createElement("script");
    (s.src = src), (s.async = !1); // async=false keeps the order the tags were added in
    if (done) s.onload = s.onerror = done;
    document.head.append(s);
  };
  function inject(src, id) {
    if (!src || loaded.has(src)) return;
    loaded.add(src);
    order.push(src);
    try {
      MOD_SWITCH.watch(new URL(src, document.baseURI).href, id);
      // runs just before the mod's file, to note the game's functions as they are
      const marker = URL.createObjectURL(new Blob([`MOD_SWITCH.begin(${JSON.stringify(id)})`], { type: "text/javascript" }));
      addScript(marker, () => URL.revokeObjectURL(marker));
      addScript(src, () => MOD_SWITCH.end(id));
      console.log(`[modloader] loaded "${src}"`);
    } catch (e) {
      console.warn("[modloader] failed to load", src, e);
    }
  }
  function loadOne(m) {
    if (!m || !m.src || !isOn(m)) return false;
    [...(m.deps || []), m.src].forEach((s) => inject(s, m.id));
    return true;
  }
  const loadAll = () => MODS.forEach(loadOne);
  // switch a mod on or off now, without a reload
  function toggle(m, on) {
    setOn(m, on);
    MOD_SWITCH.set(m.id, on);
    if (on) loadOne(m);
  }

  // ---------------------------------------------------------------- filas con alto flexible
  (() => {
    const css = document.createElement("style");
    css.textContent =
      "[data-ml]{height:auto;min-height:76px;padding:10px 14px;align-items:flex-start}" +
      "[data-ml] img{margin-top:2px}" +
      "[data-ml] .ck{margin-top:2px}";
    document.head.append(css);
  })();

  // ---------------------------------------------------------------- pantalla del loader (standalone, no toca el Workshop)
  function openModLoader() {
    typeof play === "function" && play("choice");
    sList.innerHTML = "";
    (sTitle.textContent = "VERIFIED MODS"), (sSub.style.display = "none");
    (sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;"),
      (sBack.onclick = () => (typeof openMainMenu === "function" ? openMainMenu() : screen.classList.remove("open")));

    const row = (attr, m, on) =>
      `<div class="row" ${attr}><img src="${m.icon || "ui/gear.png"}" style="object-fit:contain"><div class="t"><b>${m.name || m.src}</b>` +
      `<span>${on ? "Enabled" : "Disabled"}${m.desc ? ` · ${m.desc}` : ""}</span></div>` +
      `<img class="ck" src="${modBox(on)}"></div>`;
    sList.innerHTML =
      '<div class="mm-foot" style="padding:8px 14px; text-align:left">Switch mods on or off. It takes effect straight away.</div>' +
      '<div class="sec">Verified Mods</div>' +
      MODS.map((m) => row(`data-ml="${m.id}" data-mlr="1"`, m, isOn(m))).join("");
    const click = (el, fn) =>
      (el.onclick = () => {
        typeof play === "function" && play("choice");
        fn();
      });

    sList.querySelectorAll("[data-ml]").forEach((el) => {
      click(el, () => {
        const m = MODS.find((x) => x.id === el.getAttribute("data-ml")),
          nowOn = !isOn(m);
        toggle(m, nowOn);
        el.querySelector(".ck").src = modBox(nowOn);
        const sub = el.querySelector(".t span");
        if (sub) sub.textContent = `${nowOn ? "Enabled" : "Disabled"}${m.desc ? ` · ${m.desc}` : ""}`;
        typeof notice === "function" &&
          notice(
            nowOn ? "Mod Enabled" : "Mod Disabled",
            nowOn
              ? `${m.name || m.src} is on.`
              : `${m.name || m.src} is off. Changes it already made to your life, save or things on screen may stay until you reload.`,
            null,
            !0,
          );
      });
    });
    sList.scrollTop = 0;
  }

  // ---------------------------------------------------------------- menú principal + arranque
  let hooked = false;
  function hookMenu() {
    if (hooked) return;
    hooked = true;
    const orig = openMainMenu;
    openMainMenu = function () {
      const r = orig.apply(this, arguments);
      try {
        MOD_SWITCH.menuRow("mlRow", 1, "Verified Mods", "Switch the verified mods on or off", openModLoader);
      } catch (e) {
        console.warn("[modloader] menu", e);
      }
      return r;
    };
  }

  function ready() {
    return (
      !!window.MOD_SWITCH &&
      typeof openMainMenu === "function" &&
      typeof sList !== "undefined" &&
      !!sList &&
      typeof modBox === "function" &&
      !!document.querySelector(".phone")
    );
  }
  function boot() {
    if (!ready()) return setTimeout(boot, 60);
    // the game's "Mods" setting (Mod Workshop) turns this whole screen off
    if (typeof mods !== "undefined" && mods && mods.modLoader === false) return;
    hookMenu();
    loadAll();
  }

  window.MOD_LOADER = {
    MODS,
    load: loadOne,
    reload: loadAll,
    open: openModLoader,
    loaded: () => order.slice(),
    isOn,
    setOn,
    toggle,
  };
  // loaded from game.html: wait for the rest of the page's scripts first
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
