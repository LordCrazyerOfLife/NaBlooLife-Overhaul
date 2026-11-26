/*! Custom Mod Sources — a Settings screen for adding your own mods by picking
 *  a .js file from this device. Works in the browser (including the GitHub
 *  Pages site and the installed web app).
 *
 * Loaded straight from game.html, next to mods.js. It does not need
 * modloader.js or mods.js: it adds its own <script> tags and keeps its own on/off state.
 * It needs mod-switch.js to be loaded first.
 *
 * Switching a mod on and off without a reload
 * -------------------------------------------
 * A browser can't unload code that has already run, so a mod has to say how to
 * switch itself off. It does that by calling this once, at the top level of the
 * file (not inside a timer, promise or event handler):
 *
 *   MOD_SOURCES.register({
 *     on()  { ...add your buttons, styles, timers, event listeners... },
 *     off() { ...remove every one of them again... },
 *   });
 *
 * on() runs right away if the mod is enabled, and both then run when the player
 * flips the switch. This is the reliable way.
 *
 * Mods that don't register get an automatic off switch: their timers, listeners,
 * page watchers, new elements and replaced game functions are paused, hidden or
 * bypassed. It can't undo changes to game data, the save, or things that were
 * already on screen (including handlers set like button.onclick = ...).
 *
 * Sources are stored in a localStorage list ("modloader-custom-sources") as:
 *   { kind:"file", id, name, code64 } — the full text of a .js file picked
 *   on-device, kept base64-encoded. At load time it's decoded, wrapped in a
 *   Blob and turned into a fresh blob: URL (blob: URLs don't survive an app
 *   restart, so this has to happen every boot, not just once at pick time)
 *   and handed to the loader exactly like a remote src would be.
 *
 * (An earlier version of this file also supported adding a source by pasting
 * a direct https://.../file.js URL. That option has been removed — only the
 * on-device file picker remains. asModList() below still understands a
 * leftover "url"-kind entry from that era purely so it keeps showing up and
 * can be removed with the × button; there's no way to add a new one.)
 *
 * The file picker is the browser's own <input type="file">. The file is read
 * on the device and is not uploaded by this screen.
 *
 * Safety note, for anyone reading this file rather than the in-game warning:
 * a custom source picked from a file is run with full, unsandboxed access to
 * the page and the save on every launch, exactly like any other mod. Nothing
 * here reviews or restricts what it can do. Only add sources you trust.
 */
(() => {
  "use strict";

  const CUSTOM_KEY = "modloader-custom-sources";
  const readCustom = () => {
    try {
      const s = JSON.parse(localStorage.getItem(CUSTOM_KEY) || "[]");
      return Array.isArray(s) ? s : [];
    } catch {
      return [];
    }
  };
  const writeCustom = (list) => {
    try {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      console.warn("[modsources] could not save (storage full or blocked)", e);
      typeof notice === "function" &&
        notice(
          "Couldn't Save",
          "That source wasn't saved — local storage may be full. Try removing an old source first.",
          null,
          !0,
        );
      return false;
    }
  };
  function newId() {
    return `custom:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  }
  function addFileSource(name, code64) {
    const list = readCustom(),
      id = newId();
    list.push({ kind: "file", id, name: name || "Custom Mod", code64 });
    return writeCustom(list) ? id : null;
  }
  // on/off is stored on the source itself. Sources switched off by the earlier,
  // modloader.js based version keep that setting.
  const wasOffBefore = (id) => {
    try {
      return JSON.parse(localStorage.getItem("modloader-enabled") || "{}")[id] === false;
    } catch {
      return false;
    }
  };
  const isOn = (id) => {
    const c = readCustom().find((x) => x.id === id);
    if (!c) return false;
    return typeof c.on === "boolean" ? c.on : !wasOffBefore(id);
  };
  const setOn = (id, on) => writeCustom(readCustom().map((c) => (c.id === id ? { ...c, on } : c)));

  // One blob: URL per source for as long as the page is open, and one <script> tag per source,
  // so a mod's file never runs twice.
  const blobUrls = new Map();
  const started = new Set();
  const hooks = new Map(); // id -> { on, off, active }, for mods that registered

  // Same way mods.js starts a mod: add a <script> tag.
  function start(id) {
    if (started.has(id)) return true;
    const m = asModList().find((x) => x.id === id);
    if (!m || !m.src) return false;
    started.add(id);
    MOD_SWITCH.watch(m.src, id);
    const el = document.createElement("script");
    (el.src = m.src), (el.async = !1);
    el.onload = el.onerror = () => MOD_SWITCH.end(id); // runs right after the mod's top-level code
    document.head.append(el);
    return true;
  }

  // Runs a registered mod's on() or off(). Returns false if it can't be done without a reload.
  function setActive(id, active) {
    const h = hooks.get(id);
    if (!h) return false;
    if (h.active === active) return true;
    try {
      active ? h.on() : h.off();
      h.active = active;
      return true;
    } catch (e) {
      console.warn(`[modsources] the mod's ${active ? "on" : "off"}() failed`, e);
      return false;
    }
  }

  function register(mod) {
    const src = document.currentScript && document.currentScript.src;
    const id = [...blobUrls].find(([, url]) => url === src)?.[0];
    if (!id || !mod || typeof mod.on !== "function" || typeof mod.off !== "function") {
      console.warn("[modsources] register() needs on() and off(), called at the top level of the mod file");
      return false;
    }
    hooks.set(id, { on: () => mod.on(), off: () => mod.off(), active: false });
    MOD_SWITCH.ignore(id);
    if (isOn(id)) setActive(id, true);
    return true;
  }

  // Switch a source on or off now. Returns "on", "off", "auto" (switched off automatically),
  // "reload" (its own off() failed) or "failed".
  function toggle(id, on) {
    setOn(id, on);
    if (on) {
      if (hooks.has(id)) return setActive(id, true) ? "on" : "failed";
      if (!started.has(id)) return start(id) ? "on" : "failed";
      MOD_SWITCH.set(id, true);
      return "on";
    }
    if (hooks.has(id)) return setActive(id, false) ? "off" : "reload";
    if (!started.has(id)) return "off";
    MOD_SWITCH.set(id, false);
    return "auto";
  }

  function removeSource(id) {
    const result = toggle(id, false);
    writeCustom(readCustom().filter((c) => c.id !== id));
    hooks.delete(id);
    return result;
  }

  const statusText = (id) => {
    if (isOn(id)) return "Enabled";
    const h = hooks.get(id);
    return h && h.active ? "Off after reload" : "Disabled";
  };

  // Builds the list of {id,name,icon,src,desc} for the saved sources.
  // For file-kind entries, src is a blob: URL made from the saved text. These
  // don't survive a reload, so they are rebuilt on every boot.
  function asModList() {
    return readCustom().map((c) => {
      if (c.kind === "file") {
        let src = blobUrls.get(c.id) || "";
        if (!src)
          try {
          const bytes = Uint8Array.from(atob(c.code64 || ""), (ch) => ch.charCodeAt(0));
          const text = new TextDecoder("utf-8").decode(bytes);
          src = URL.createObjectURL(new Blob([`window.MOD_SOURCES&&MOD_SOURCES._begin(${JSON.stringify(c.id)});${text}`], { type: "text/javascript" }));
          blobUrls.set(c.id, src);
        } catch (e) {
          console.warn("[modsources] couldn't rebuild file source", c.name, e);
        }
        return { id: c.id, name: c.name || "Custom Mod", icon: "ui/gear.png", src, desc: "Custom source · picked file" };
      }
      return {
        id: c.id,
        name: c.name || c.src,
        icon: "ui/gear.png",
        src: c.src,
        desc: `Custom source · ${c.src}`,
      };
    });
  }

  function boot() {
    if (
      typeof openMainMenu !== "function" ||
      typeof sList === "undefined" ||
      !sList ||
      typeof modBox !== "function" ||
      !document.querySelector(".phone")
    )
      return setTimeout(boot, 60);
    try {
      init();
    } catch (e) {
      console.warn("[modsources]", e);
    }
  }

  const escapeHtml = (v) =>
    String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const readBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  function init() {
    function openSources() {
      typeof play === "function" && play("choice");
      (sTitle.textContent = "CUSTOM MOD SOURCES"), (sSub.style.display = "none");
      (sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;"),
        (sBack.onclick = () => openMainMenu());

      const list = asModList();
      const row = (m) =>
        `<div class="row" data-ms="${escapeHtml(m.id)}"><img src="${m.icon}"><div class="t"><b>${escapeHtml(m.name)}</b>` +
        `<span>${statusText(m.id)} · ${escapeHtml(m.desc)}</span></div>` +
        `<span class="ms-del" data-ms-del="${escapeHtml(m.id)}" style="padding:6px 10px;font-weight:700;opacity:.7">&times;</span>` +
        `<img class="ck" src="${modBox(isOn(m.id))}"></div>`;

      const pickRow =
        '<div class="row" id="msPick"><img src="ui/gear.png"><div class="t"><b>+ Pick a .js File From This Device</b>' +
        "<span>Load a mod straight from your device's storage</span></div></div>";

      sList.innerHTML =
        '<div class="mm-foot" style="padding:8px 14px; text-align:left">Add your own mods by picking a .js file from this device' +
        ". They load and toggle on/off alongside the built-in mods.</div>" +
        '<div class="sec">Your Sources</div>' +
        (list.length
          ? list.map(row).join("")
          : '<div class="row"><div class="t"><b>No custom sources yet</b><span>Add one below</span></div></div>') +
        pickRow;

      sList.querySelectorAll("[data-ms]").forEach((el) => {
        el.onclick = (ev) => {
          if (ev.target.closest("[data-ms-del]")) return;
          typeof play === "function" && play("choice");
          const m = list.find((x) => x.id === el.dataset.ms),
            nowOn = !isOn(m.id),
            result = toggle(m.id, nowOn);
          el.querySelector(".ck").src = modBox(nowOn);
          const sub = el.querySelector(".t span");
          if (sub) sub.textContent = `${statusText(m.id)} · ${m.desc}`;
          const label = escapeHtml(m.name);
          typeof notice === "function" &&
            notice(
              nowOn ? "Source Enabled" : "Source Disabled",
              {
                on: `${label} is on.`,
                off: `${label} is off.`,
                auto: `${label} is off. If it changed your save or things already on screen, those changes stay until you reload.`,
                reload: `${label} couldn't switch itself off, so it may keep running until you reload the game.`,
                failed: `${label} couldn't be started. Try reloading the game.`,
              }[result],
              null,
              !0,
            );
        };
      });

      sList.querySelectorAll("[data-ms-del]").forEach((el) => {
        el.onclick = (ev) => {
          ev.stopPropagation();
          typeof play === "function" && play("choice");
          const id = el.dataset.msDel,
            m = list.find((x) => x.id === id);
          if (!m) return;
          const ok = typeof confirm !== "function" || confirm(`Remove "${m.name}" from your custom sources?`);
          if (ok) {
            const result = removeSource(id);
            openSources();
            (result === "reload" || result === "auto") &&
              typeof notice === "function" &&
              notice("Source Removed", `${escapeHtml(m.name)} was removed. Reload to clear anything it left behind.`, null, !0);
          }
        };
      });

      const pick = document.getElementById("msPick");
      if (pick) pick.onclick = pickFile;
    }

    const warnAndContinue = () =>
      typeof confirm !== "function" ||
      confirm(
        "This will run that JavaScript automatically every time you play, with no sandboxing or review — it can do anything a mod can do, including things you wouldn't want. Only add sources from people you actually trust.\n\nAdd this source?",
      );

    function pickFile() {
      typeof play === "function" && play("choice");
      // no "accept" filter: some Android pickers grey out .js files when one is set
      const input = document.createElement("input");
      input.type = "file";
      input.id = "msFile";
      input.style.display = "none";
      input.onchange = () => {
        const file = input.files && input.files[0];
        input.remove();
        if (file) addPicked(file);
      };
      document.getElementById("msFile")?.remove(); // left over from a cancelled pick
      document.body.appendChild(input);
      input.click(); // must run directly from the tap
    }

    async function addPicked(file) {
      const pickedName = file.name || "";
      if (pickedName && !/\.js$/i.test(pickedName)) {
        const proceedAnyway =
          typeof confirm !== "function" ||
          confirm(`"${pickedName}" doesn't look like a .js file. Try loading it as a mod anyway?`);
        if (!proceedAnyway) return;
      }
      if (!warnAndContinue()) return;
      const defaultName = (pickedName || "Custom Mod").replace(/\.js$/i, "");
      let code64 = "";
      try {
        code64 = await readBase64(file);
      } catch (e) {
        console.warn("[modsources] could not read file", e);
      }
      if (!code64) {
        typeof notice === "function" &&
          notice("No File Loaded", "Couldn't read that file. Try a different one.", null, !0);
        return;
      }
      const name = ((typeof prompt === "function" ? prompt("Name this source:", defaultName) : "") || defaultName).trim();
      const id = addFileSource(name, code64);
      if (id) {
        const ran = start(id);
        openSources();
        typeof notice === "function" &&
          notice(
            "Source Added",
            ran
              ? `"${escapeHtml(name)}" has been started. If nothing changes, the file may have an error or need a reload.`
              : `"${escapeHtml(name)}" was saved. Reload the game to try running it.`,
            null,
            !0,
          );
      }
    }

    // NOTE: openMainMenu rebuilds sList's whole contents from scratch every
    // time it's called (that's how the stock menu and modloader.js's own
    // "Mod Loader" row both work), so this re-inserts the row on every call
    // rather than gating on a one-time "already hooked" flag — a previous
    // version of this file only inserted it the first time, so the row
    // looked like it vanished as soon as you left Settings and came back.
    const orig = openMainMenu;
    openMainMenu = function () {
      const r = orig.apply(this, arguments);
      try {
        MOD_SWITCH.menuRow("msRow", 3, "Custom Mod Sources", "Add your own mods from a file on this device", openSources);
      } catch (e) {
        console.warn("[modsources] menu", e);
      }
      return r;
    };

    Object.assign(window.MOD_SOURCES, { open: openSources });

    // start every enabled source
    readCustom().forEach((c) => isOn(c.id) && start(c.id));
    console.log("[modsources] loaded");
  }

  window.MOD_SOURCES = {
    register,
    _begin: (id) => MOD_SWITCH.begin(id),
    toggle,
    isOn,
    list: asModList,
    addFile: addFileSource,
    remove: removeSource,
  };
  boot();
})();
