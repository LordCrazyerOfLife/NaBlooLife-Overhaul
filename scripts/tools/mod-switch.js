/*! Mod Switch — the shared on/off engine for the three mod screens: Verified Mods
 * (modloader.js), Content Packs (content-packs.js) and Custom Mod Sources (modsources.js).
 * It must load before them. It does not use mods.js.
 */
(() => {
  "use strict";
  if (window.MOD_SWITCH) return;

  // ------------------------------------------------------------ automatic off switch
  // For mods without register(). While a custom mod's code runs, we note what it adds: timers,
  // event listeners, page watchers, new elements and replaced game functions. Switching the mod
  // off pauses, hides or bypasses those. Changes to game data and to things that were already on
  // screen are NOT tracked, so they stay until a reload.
  const autoOff = new Set(); // ids currently switched off
  const records = new Map(); // id -> { nodes: Set, hidden: [], waiting: Map }
  let context = null; // the mod whose callback is running
  const snapshots = new Map(); // id -> game functions as they were before one of its files ran
  const urls = new Map(); // script address -> mod id
  const ignored = new Set(); // mods that switch themselves with their own on() and off()

  const record = (id) => {
    if (!records.has(id)) records.set(id, { nodes: new Set(), hidden: [], waiting: new Map() });
    return records.get(id);
  };
  // which tracked mod is running right now
  function owner() {
    const script = !context && urls.size && document.currentScript;
    const id = context || (script && urls.get(script.src));
    return id && !ignored.has(id) ? id : null;
  }

  const gameFunctions = () => {
    const found = new Map();
    for (const name of Object.getOwnPropertyNames(window)) {
      const d = Object.getOwnPropertyDescriptor(window, name);
      if (d && d.writable && typeof d.value === "function") found.set(name, d.value);
    }
    return found;
  };
  // swap each function the mod replaced for a switch between its version and the previous one
  function gateReplaced(id, before) {
    if (ignored.has(id)) return;
    for (const [name, previous] of before) {
      const next = window[name];
      if (next === previous || typeof next !== "function") continue;
      const gate = function (...args) {
        const fn = autoOff.has(id) ? previous : next;
        return new.target ? Reflect.construct(fn, args) : fn.apply(this, args);
      };
      window[name] = Object.assign(gate, next);
    }
  }
  // Run a mod callback, still tracking whatever it adds. Looking for replaced functions is the
  // slow part, so it is only done for one-off timers (how mods wait for the game to be ready),
  // not for events, repeating timers or page watchers, which can fire many times a second.
  function runAs(id, fn, self, args, checkFunctions) {
    if (context === id) return fn.apply(self, args);
    const outer = context,
      before = checkFunctions && gameFunctions();
    context = id;
    try {
      return fn.apply(self, args);
    } finally {
      context = outer;
      before && gateReplaced(id, before);
    }
  }
  function begin(id) {
    snapshots.set(id, gameFunctions());
  }
  function end(id) {
    const before = snapshots.get(id);
    snapshots.delete(id);
    before && gateReplaced(id, before);
  }

  function autoSwitch(id, on) {
    const r = record(id);
    if (!on) {
      autoOff.add(id);
      for (const node of r.nodes) {
        if (!node.isConnected) continue;
        const marker = document.createComment("mod off");
        node.replaceWith(marker);
        r.hidden.push([marker, node]);
      }
      return;
    }
    autoOff.delete(id);
    for (const [marker, node] of r.hidden.splice(0).reverse()) marker.isConnected && marker.replaceWith(node);
    const waiting = [...r.waiting.values()];
    r.waiting.clear();
    waiting.forEach((resume) => resume());
  }

  function installTracking() {
    const nativeTimeout = window.setTimeout,
      nativeClear = window.clearTimeout;

    // timers: a one-off that comes due while the mod is off waits until it is back on
    window.setTimeout = function (fn, delay, ...rest) {
      const id = owner();
      if (!id || typeof fn !== "function") return nativeTimeout.call(window, fn, delay, ...rest);
      let handle;
      const fire = () => {
        if (autoOff.has(id)) record(id).waiting.set(handle, fire);
        else runAs(id, fn, window, rest, true);
      };
      return (handle = nativeTimeout.call(window, fire, delay));
    };
    window.clearTimeout = function (handle) {
      records.forEach((r) => r.waiting.delete(handle));
      return nativeClear.call(window, handle);
    };
    // repeating timers and animation frames
    const nativeInterval = window.setInterval;
    window.setInterval = function (fn, delay, ...rest) {
      const id = owner();
      if (!id || typeof fn !== "function") return nativeInterval.call(window, fn, delay, ...rest);
      return nativeInterval.call(window, () => autoOff.has(id) || runAs(id, fn, window, rest), delay);
    };
    const nativeFrame = window.requestAnimationFrame;
    if (nativeFrame)
      window.requestAnimationFrame = function (fn) {
        const id = owner();
        if (!id) return nativeFrame.call(window, fn);
        const fire = (time) => {
          if (autoOff.has(id)) record(id).waiting.set(fire, () => nativeFrame.call(window, fire));
          else runAs(id, fn, window, [time]);
        };
        return nativeFrame.call(window, fire);
      };

    // event listeners
    const target = window.EventTarget.prototype,
      add = target.addEventListener,
      remove = target.removeEventListener,
      wrapped = new WeakMap();
    target.addEventListener = function (type, listener, options) {
      const id = owner();
      if (!id || !listener) return add.call(this, type, listener, options);
      if (!wrapped.has(listener))
        wrapped.set(listener, function (event) {
          if (autoOff.has(id)) return;
          return typeof listener === "function"
            ? runAs(id, listener, this, [event])
            : runAs(id, listener.handleEvent, listener, [event]);
        });
      return add.call(this, type, wrapped.get(listener), options);
    };
    target.removeEventListener = function (type, listener, options) {
      if (listener && wrapped.has(listener)) remove.call(this, type, wrapped.get(listener), options);
      return remove.call(this, type, listener, options);
    };

    // page watchers
    const NativeObserver = window.MutationObserver;
    window.MutationObserver = class extends NativeObserver {
      constructor(callback) {
        const id = owner();
        super(id ? (list, observer) => autoOff.has(id) || runAs(id, callback, observer, [list, observer]) : callback);
      }
    };

    // new elements: only ones that weren't already on the page, so moving game UI isn't tracked
    const track = (proto, name, pick) => {
      const native = proto && proto[name];
      if (!native) return;
      proto[name] = function (...args) {
        const id = owner();
        const fresh = id
          ? pick(args).flatMap((n) =>
              !(n instanceof window.Node) || n.isConnected ? [] : n.nodeType === 11 ? [...n.childNodes] : [n],
            )
          : [];
        const result = native.apply(this, args);
        fresh.forEach((n) => n.isConnected && record(id).nodes.add(n));
        return result;
      };
    };
    track(window.Node.prototype, "appendChild", (a) => [a[0]]);
    track(window.Node.prototype, "insertBefore", (a) => [a[0]]);
    track(window.Node.prototype, "replaceChild", (a) => [a[0]]);
    for (const proto of [window.Element.prototype, window.Document.prototype, window.DocumentFragment.prototype])
      for (const name of ["append", "prepend"]) track(proto, name, (a) => a);
    for (const name of ["before", "after"]) track(window.Element.prototype, name, (a) => a);
    track(window.Element.prototype, "insertAdjacentElement", (a) => [a[1]]);

    const nativeHTML = window.Element.prototype.insertAdjacentHTML;
    window.Element.prototype.insertAdjacentHTML = function (where, html) {
      const id = owner();
      if (!id) return nativeHTML.call(this, where, html);
      const parent = /^(beforebegin|afterend)$/i.test(where) ? this.parentNode : this;
      const old = new Set(parent ? parent.childNodes : []);
      nativeHTML.call(this, where, html);
      if (parent) for (const n of parent.childNodes) !old.has(n) && n.isConnected && record(id).nodes.add(n);
    };
  }
  installTracking();

  // The three screens get their Main Menu rows in one "Mods" section, always in the same order.
  function menuRow(rowId, order, title, text, onClick) {
    if (document.getElementById(rowId)) return;
    let box = document.getElementById("modScreens");
    if (!box) {
      sList.insertAdjacentHTML("afterbegin", '<div id="modScreens"><div class="sec">Mods</div></div>');
      box = document.getElementById("modScreens");
    }
    const holder = document.createElement("div");
    holder.innerHTML =
      `<div class="row" id="${rowId}" data-order="${order}"><img src="ui/gear.png"><div class="t"><b>${title}</b><span>${text}</span></div>` +
      (typeof CHEV !== "undefined" ? CHEV : "") +
      "</div>";
    const row = holder.firstChild;
    row.onclick = onClick;
    box.insertBefore(row, [...box.querySelectorAll("[data-order]")].find((el) => +el.dataset.order > order) || null);
  }

  window.MOD_SWITCH = {
    watch: (url, id) => urls.set(url, id), // track what the script at this address adds
    ignore: (id) => ignored.add(id),
    begin,
    end,
    set: autoSwitch, // set(id, false) switches a mod off, set(id, true) back on
    menuRow,
  };
})();
