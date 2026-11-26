/*! Custom Mod Sources — a Settings screen for adding your own mods by picking
 *  a .js file from this device. Works in the browser (including the GitHub
 *  Pages site and the installed web app).
 *
 * This is a plain add-on mod, loaded the same way as any other entry in
 * modloader.js's MODS list (it does not require editing that file beyond the
 * one entry that points to this file). It reuses modloader.js's own public
 * API (window.MOD_LOADER.load/isOn/setOn) rather than re-implementing script
 * injection or the enabled/disabled store, so a custom source behaves exactly
 * like a built-in one: same toggle persistence, same loading mechanism.
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
  function removeSource(id) {
    writeCustom(readCustom().filter((c) => c.id !== id));
    const ML = window.MOD_LOADER;
    if (ML && typeof ML.setOn === "function") ML.setOn({ id }, !0); // clear any stored off-state for the removed id
  }

  // Builds the list of {id,name,icon,src,desc} the core loader understands.
  // For file-kind entries, src is a brand-new blob: URL made from the saved
  // text — these can't be reused across app restarts, so this has to be
  // called fresh every boot rather than cached.
  function asModList() {
    return readCustom().map((c) => {
      if (c.kind === "file") {
        let src = "";
        try {
          const bytes = Uint8Array.from(atob(c.code64 || ""), (ch) => ch.charCodeAt(0));
          const text = new TextDecoder("utf-8").decode(bytes);
          src = URL.createObjectURL(new Blob([text], { type: "text/javascript" }));
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
    const ML = window.MOD_LOADER;
    if (
      !ML ||
      typeof ML.isOn !== "function" ||
      typeof ML.setOn !== "function" ||
      typeof ML.load !== "function" ||
      typeof openMainMenu !== "function" ||
      typeof sList === "undefined" ||
      !sList ||
      typeof modBox !== "function" ||
      !document.querySelector(".phone")
    )
      return setTimeout(boot, 60);
    try {
      init(ML);
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

  function init(ML) {
    // Load every enabled custom source right away, through the core loader's
    // own loadOne(), so it's gated by the same on/off store and injected the
    // same way as a built-in mod. Each file-kind entry gets a fresh blob URL
    // built from its saved text (see asModList above).
    asModList().forEach((m) => m.src && ML.load(m));

    function openSources() {
      typeof play === "function" && play("choice");
      (sTitle.textContent = "CUSTOM MOD SOURCES"), (sSub.style.display = "none");
      (sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;"),
        (sBack.onclick = () => openMainMenu());

      const list = asModList();
      const row = (m) =>
        `<div class="row" data-ms="${escapeHtml(m.id)}"><img src="${m.icon}"><div class="t"><b>${escapeHtml(m.name)}</b>` +
        `<span>${ML.isOn(m) ? "Enabled" : "Disabled"} · ${escapeHtml(m.desc)}</span></div>` +
        `<span class="ms-del" data-ms-del="${escapeHtml(m.id)}" style="padding:6px 10px;font-weight:700;opacity:.7">&times;</span>` +
        `<img class="ck" src="${modBox(ML.isOn(m))}"></div>`;

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
            nowOn = !ML.isOn(m);
          ML.setOn(m, nowOn);
          el.querySelector(".ck").src = modBox(nowOn);
          const sub = el.querySelector(".t span");
          if (sub) sub.textContent = `${nowOn ? "Enabled" : "Disabled"} · ${m.desc}`;
          typeof notice === "function" &&
            notice(
              nowOn ? "Source Enabled" : "Source Disabled",
              `${escapeHtml(m.name)} will be ${nowOn ? "loaded" : "skipped"} the next time NaBlooLife loads.`,
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
            removeSource(id);
            openSources();
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
      if (addFileSource(name, code64)) {
        typeof notice === "function" &&
          notice("Source Added", `"${escapeHtml(name)}" will load the next time NaBlooLife loads.`, null, !0);
        openSources();
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
        if (document.getElementById("msRow")) return r;
        const mlRow = document.getElementById("mlRow");
        const html =
          '<div class="row" id="msRow"><img src="ui/gear.png">' +
          '<div class="t"><b>Custom Mod Sources</b><span>Add your own mods from a file on this device</span></div>' +
          (typeof CHEV !== "undefined" ? CHEV : "") +
          "</div>";
        if (mlRow) mlRow.insertAdjacentHTML("afterend", html);
        else sList.insertAdjacentHTML("afterbegin", '<div class="sec">Mods</div>' + html);
        document.getElementById("msRow").onclick = openSources;
      } catch (e) {
        console.warn("[modsources] menu", e);
      }
      return r;
    };

    window.MOD_SOURCES = {
      list: asModList,
      addFile: addFileSource,
      remove: removeSource,
      open: openSources,
    };
    console.log("[modsources] loaded");
  }

  boot();
})();
