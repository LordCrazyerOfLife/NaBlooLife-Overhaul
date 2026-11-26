/* [base] Accessories+ for NaBlooLife.
 *
 * Activities -> Accessories gets two new sections under the usual eyewear / scars / headwear rows:
 *  - Jewelry: see what you are wearing right now (neck, wrist, grillz, ears), pick any piece you own for each slot
 *    or take it off. It uses jewelry-wear.js (FL_JEWEL_WEAR), so the avatar updates as soon as you choose.
 *  - Barbershop: Barber / Hair Stylist, Dye Job and Shave, with the prices from barbershop.js, plus a link to the full
 *    Salon & Spa.
 * Debug: FL_ACCPLUS.openJewelry(), FL_ACCPLUS.openSlot("neck").
 */
(() => {
  "use strict";
  if (window.FL_ACCPLUS) return;

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const warn = (w, e) => console.warn("[accessories-plus] " + w, e);
  const usdf = (n) => {
    try {
      return usd(n);
    } catch {
      return "$" + Math.round(n).toLocaleString("en-US");
    }
  };
  const dots = () => (typeof DOTS !== "undefined" ? DOTS : "");
  const jw = () => window.FL_JEWEL_WEAR;
  const owned = () => (Array.isArray(state.jewelry) ? state.jewelry.filter(Boolean) : []);
  const pimg = (it) => `jewelry/${it.img}.png`;

  const SLOTS = [
    { id: "neck", title: "Neck", sub: "Chains, necklaces and pendants", icon: "jewelry/chains.png" },
    { id: "wrist", title: "Wrist", sub: "Watches and bracelets", icon: "emoji/231a.png" },
    { id: "mouth", title: "Grillz", sub: "For your teeth", icon: "jewelry/diamond.png" },
    { id: "ears", title: "Ears", sub: "Earrings", icon: "jewelry/diamond.png" },
  ];

  const row = (data, icon, t, s, locked) =>
    `<div class="row${locked ? " dis" : ""}" ${data}><img src="${icon}" alt="" style="object-fit:contain"><div class="t"><b>${t}</b><span>${s}</span></div>${locked ? "" : dots()}</div>`;
  const openScreen = (title, back, html) => {
    sTitle.textContent = title;
    if (typeof sSub !== "undefined" && sSub && sSub.style) sSub.style.display = "none";
    sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;";
    sBack.onclick = back;
    sList.innerHTML = html;
    sList.scrollTop = 0;
    screen.classList.add("open");
  };
  const piecesFor = (slot) => owned().filter((it) => jw() && jw().slot(it) === slot);
  const wornIn = (slot) => {
    try {
      return jw().equipped()[slot] || null;
    } catch {
      return null;
    }
  };

  // ------------------------------------------------------------------ the mirror: a big live copy of your whole look
  // The profile avatar already has everything drawn on it (hair, beard, dye, eyewear, headwear, scars, jewelry), so the
  // mirror just redraws that canvas big, every frame, and follows any change you make on the same screen.
  let mirrorRaf = 0;
  const previewHtml = () =>
    `<div style="display:flex;justify-content:center;padding:12px 12px 4px"><canvas id="flMirrorCv" width="520" height="520" style="width:min(86vw,360px);height:auto;border-radius:22px;border:2px solid rgba(39,195,209,.45);box-shadow:0 6px 18px rgba(0,0,0,.3);background:radial-gradient(circle at 50% 35%,#3a4a63 0%,#1c2433 70%)"></canvas></div>`;
  function startMirror() {
    cancelAnimationFrame(mirrorRaf);
    const tick = () => {
      const cv = document.getElementById("flMirrorCv");
      if (!cv) return; // another screen replaced the list
      const src = document.querySelector(".phone > .profile canvas.avatar") || document.querySelector("canvas.avatar");
      if (src && src.width) {
        const c = cv.getContext("2d");
        c.clearRect(0, 0, cv.width, cv.height);
        c.imageSmoothingEnabled = true;
        c.imageSmoothingQuality = "high";
        c.drawImage(src, 0, 0, cv.width, cv.height);
      }
      mirrorRaf = requestAnimationFrame(tick);
    };
    mirrorRaf = requestAnimationFrame(tick);
  }
  const ACC_ROWS = [
    ["eyewear", "Eyewear", "emoji/1f576-fe0f.png", 0],
    ["scar", "Scars", "emoji/1fa79.png", 1],
    ["patch", "Eye Patch", "emoji/2620-fe0f.png", 2],
    ["headwear", "Headwear", "emoji/1f9e2.png", 3],
  ];
  const accName = (cat) => {
    try {
      const id = state.acc && state.acc[cat];
      const it = id && (typeof ACCESSORIES !== "undefined" ? ACCESSORIES[cat] || [] : []).find((t) => t.id === id);
      return it ? it.name : "";
    } catch {
      return "";
    }
  };
  function openMirror() {
    const nm = [state.first, state.last].filter(Boolean).join(" ");
    const eqNow = jw() ? jw().equipped() : {};
    let h = previewHtml();
    h += `<div class="row sm" style="cursor:default"><div class="t"><b style="font-weight:600">${esc(nm || "You")}</b><span>Age ${state.age} · your full look, live</span></div></div>`;
    h += `<div class="sec">Accessories</div>`;
    ACC_ROWS.forEach(([cat, label, icon, idx]) => {
      const n = accName(cat);
      h += row(`data-mr="acc${idx}"`, icon, label, n ? `Wearing: ${esc(n)}` : "Nothing · tap to choose");
    });
    if (jw()) {
      h += `<div class="sec">Jewelry</div>`;
      SLOTS.forEach((sl) => {
        const it = eqNow[sl.id];
        h += row(`data-mr="slot:${sl.id}"`, it ? pimg(it) : sl.icon, sl.title, it ? esc(it.name) : "Nothing · tap to choose");
      });
    }
    h += `<div class="sec">Hair</div>`;
    h += row(`data-mr="barber"`, "salon/barber.png", (typeof PG === "function" ? PG() : "m") === "f" ? "Hair Stylist" : "Barber", "Change your hairstyle");
    openScreen("MIRROR", () => openAccessories(), h);
    startMirror();
    sList.querySelectorAll("[data-mr]").forEach((el) => {
      el.onclick = () => {
        try {
          play("choice");
        } catch {}
        const k = el.dataset.mr;
        if (k.startsWith("acc")) {
          if (typeof accessoryPicker === "function") accessoryPicker(+k.slice(3));
          return;
        }
        if (k.startsWith("slot:")) return openSlot(k.slice(5));
        if (k === "barber") {
          try {
            SALON_OPEN.barber();
          } catch (e) {
            warn("barber", e);
          }
        }
      };
    });
  }

  // ------------------------------------------------------------------ jewelry
  function openJewelry() {
    if (!jw()) return;
    const all = owned();
    const eqNow = jw().equipped();
    const nWorn = Object.keys(eqNow).length;
    let h = previewHtml() + `<div class="sec">Wearing now</div>`;
    SLOTS.forEach((s) => {
      const it = eqNow[s.id];
      const n = piecesFor(s.id).length;
      h += row(`data-js="${s.id}"`, it ? pimg(it) : s.icon, `${s.title}: ${it ? esc(it.name) : "nothing"}`, n ? `${n} piece${n === 1 ? "" : "s"} to choose from · tap to change` : "You own nothing for this yet");
    });
    if (nWorn) h += row(`data-js="off"`, "cars/ui-sign-litter.png", "Take off everything", "Remove all your jewelry");
    if (!all.length) h += `<div class="mm-foot" style="padding:10px 14px;text-align:left">You do not own any jewelry yet. Buy some in Shopping and it will show up here.</div>`;
    openScreen("JEWELRY", () => openAccessories(), h);
    startMirror();
    sList.querySelectorAll("[data-js]").forEach((el) => {
      el.onclick = () => {
        try {
          play("choice");
        } catch {}
        const k = el.dataset.js;
        if (k === "off") {
          Object.values(jw().equipped()).forEach((it) => jw().toggle(it));
          return openJewelry();
        }
        openSlot(k);
      };
    });
  }

  function openSlot(slot) {
    const S = SLOTS.find((x) => x.id === slot);
    if (!S || !jw()) return openJewelry();
    const list = piecesFor(slot)
      .slice()
      .sort((a, b) => Number(jw().worn(b)) - Number(jw().worn(a)));
    const cur = wornIn(slot);
    let h = previewHtml() + `<div class="sec">${S.title}</div>`;
    if (cur) h += row(`data-sl="off"`, "cars/ui-sign-litter.png", "Take it off", `Stop wearing ${esc(cur.name)}`);
    h += `<div class="sec">Your ${S.title.toLowerCase()} pieces (${list.length})</div>`;
    if (!list.length) h += `<div class="row" style="cursor:default"><img src="${S.icon}" alt="" style="object-fit:contain"><div class="t"><b>Nothing yet</b><span>You do not own anything for this slot</span></div></div>`;
    list.forEach((it, i) => {
      const on = jw().worn(it);
      const bits = [it.metal, it.gem ? `${it.gem} ${it.ct ? it.ct + "ct" : ""}`.trim() : "", it.claim ? usdf(it.claim) : ""].filter(Boolean).map(esc).join(" · ");
      h += row(`data-sl="${i}"`, pimg(it), `${esc(it.name)}${on ? " (wearing)" : ""}`, bits || "Tap to wear it");
    });
    openScreen(S.title.toUpperCase(), openJewelry, h);
    startMirror();
    sList.querySelectorAll("[data-sl]").forEach((el) => {
      el.onclick = () => {
        try {
          play("choice");
        } catch {}
        const k = el.dataset.sl;
        if (k === "off") jw().toggle(cur);
        else jw().toggle(list[+k]);
        openSlot(slot);
      };
    });
  }

  // ------------------------------------------------------------------ barbershop
  const BARBER = [
    { key: "barber", icon: "salon/barber.png", min: 14, title: () => ((typeof PG === "function" ? PG() : "m") === "f" ? "Hair Stylist" : "Barber"), sub: "Change your hairstyle" },
    { key: "dye", icon: "salon/dye.png", min: 18, title: () => "Dye Job", sub: "Change your hair color" },
    { key: "shave", icon: "salon/shave.png", min: 16, title: () => "Shave", sub: "Change your facial hair" },
  ];
  const priceOf = (k) => {
    try {
      return window.FL_BARBER ? usdf(FL_BARBER.price(k)) : "";
    } catch {
      return "";
    }
  };

  function addSections() {
    sList.insertAdjacentHTML("afterbegin", `<div class="sec">Mirror</div>` + row(`data-ap="mirror"`, "emoji/1f464.png", "Mirror", "See your whole face with everything you wear"));
    let h = "";
    if (jw()) {
      const eqNow = jw().equipped();
      const worn = Object.values(eqNow).map((it) => esc(it.name));
      h += `<div class="sec">Jewelry</div>`;
      h += row(`data-ap="jewelry"`, "emoji/1f48d.png", "Jewelry", worn.length ? `Wearing: ${worn.slice(0, 3).join(", ")}${worn.length > 3 ? ` +${worn.length - 3}` : ""}` : owned().length ? "Pick what to wear" : "Neck, wrist, grillz and ears");
    }
    h += `<div class="sec">Barbershop</div>`;
    BARBER.forEach((b) => {
      const locked = state.age < b.min;
      const pr = priceOf(b.key);
      h += row(`data-ap="${b.key}"`, b.icon, b.title(), locked ? `Unlocks at age ${b.min}` : `${b.sub}${pr ? ` · ${pr}` : ""}`, locked);
    });
    h += row(`data-ap="salon"`, "salon/massage.png", "Salon & Spa", "Nails, massage, tanning and more");
    sList.insertAdjacentHTML("beforeend", h);
    sList.querySelectorAll("[data-ap]").forEach((el) => {
      if (el.classList.contains("dis")) return;
      el.onclick = () => {
        try {
          play("choice");
        } catch {}
        const k = el.dataset.ap;
        if (k === "mirror") return openMirror();
        if (k === "jewelry") return openJewelry();
        if (k === "salon") {
          if (typeof openSalon === "function") {
            openSalon();
            sBack.onclick = () => openAccessories();
          }
          return;
        }
        try {
          SALON_OPEN[k]();
        } catch (e) {
          warn("salon " + k, e);
        }
      };
    });
  }

  // ------------------------------------------------------------------ wiring
  function boot() {
    if (typeof state === "undefined" || typeof openAccessories !== "function" || typeof sList === "undefined" || typeof SALON_OPEN === "undefined") return setTimeout(boot, 200);
    const orig = window.openAccessories;
    window.openAccessories = function () {
      const r = orig.apply(this, arguments);
      try {
        if (sTitle.textContent === "ACCESSORIES" && !(typeof isOldEra === "function" && isOldEra())) addSections();
      } catch (e) {
        warn("accessories", e);
      }
      return r;
    };
    console.log("[accessories-plus] loaded");
  }

  window.FL_ACCPLUS = { openJewelry, openSlot, openMirror };
  boot();
})();
