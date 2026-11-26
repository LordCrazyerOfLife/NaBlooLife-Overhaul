/* [base] Barber: every hairstyle for your gender, in one list.
 *
 * Before, the Barber only offered the base styles of your life stage, and the Hair Pack styles (hip-hop, short, long,
 * textured, dreads, braids, shaggy...) were hidden behind "Barber Expanded", for every gender mixed together.
 * Now the Barber (and Barber Expanded) show ONE list: your normal hair, all the base styles for your gender and stage,
 * and every Hair Pack style that suits your gender. Men get all the men's and unisex styles, women get all the women's
 * and unisex ones. The price and the "same look, no charge" rule of barbershop.js still apply.
 *
 * It wraps salonPreview (after barbershop.js did) and rewrites the options of the barber previews only.
 * Gender of each pack style: m / f below, everything else is unisex (textured, twists, braids, dreads, shaggy, long).
 */
(() => {
  "use strict";
  if (window.FL_BARBER_ALL) return;
  const warn = (w, e) => console.warn("[barber-all] " + w, e);

  const TAG = {};
  ["hhc1", "hhc2", "hhc3", "hhc4", "hhc5", "short1", "short2", "short3", "short4", "short5", "buzz", "nh01", "nh04", "nh07", "nh09", "nh10", "nh19", "nh23"].forEach((id) => (TAG[id] = "m"));
  ["nh14", "nh16", "nh17", "nh18", "nh21", "nh22", "nh24", "rainbow-long"].forEach((id) => (TAG[id] = "f"));
  const suits = (id, g) => {
    const t = TAG[id] || "u";
    return t === "u" || t === g;
  };

  function unified(opts) {
    const g = PG();
    const base = hairList(stage(state.age));
    const pack = hairPackList().filter((p) => suits(p[0], g));
    const total = 1 + base.length + pack.length;
    const entry = (t) => (t === 0 ? { k: "none" } : t <= base.length ? { k: "base", i: t - 1, hair: base[t - 1] } : { k: "pack", id: pack[t - 1 - base.length][0], name: pack[t - 1 - base.length][1] });
    // where you are now
    const curX = state.mod.xHair || (null == state.mod.style ? state.look.xHair : null);
    let cur = 0;
    if (state.mod.xHair || (null == state.mod.style && state.look.xHair)) {
      const j = pack.findIndex((p) => p[0] === curX);
      cur = j >= 0 ? 1 + base.length + j : 0;
    } else if (null != state.mod.style) cur = 1 + (state.mod.style % base.length);
    const g2 = g === "f" ? "hair salon" : "barber";
    return {
      ...opts,
      count: total,
      start: cur,
      nameFor: (t) => {
        const e = entry(t);
        const label = e.k === "none" ? "Your normal hair" : e.k === "base" ? `Hairstyle ${e.i + 1}` : e.name;
        return `${label} (${t + 1} of ${total})`;
      },
      faceFor: (t, a, o) => {
        const e = entry(t);
        const key = "allh" + a + o + (e.k === "none" ? "n" : e.k === "base" ? "b" + e.hair : "p" + e.id) + JSON.stringify(state.acc) + state.look.beard + dyeKey() + (window.FL_JEWEL_KEY ? FL_JEWEL_KEY() : "");
        const o2 = e.k === "none" ? { hair: null, xHair: state.look.xHair || null } : e.k === "base" ? { hair: e.hair } : { hair: null, xHair: e.id };
        return (previewCache[key] ||= composeFace(a, o, state.look, PG(), state.acc, o2));
      },
      onPick: (t) => {
        const e = entry(t);
        if (e.k === "none") {
          state.mod.style = null;
          state.mod.xHair = null;
        } else if (e.k === "base") {
          state.mod.style = e.i;
          state.mod.xHair = null;
        } else state.mod.xHair = e.id;
        renderAvatar();
        say(`I got a new haircut at the ${g2}.`);
        notice("Fresh cut", `You got a new haircut at the ${g2}.`, null, true);
      },
    };
  }

  function install() {
    if (typeof salonPreview !== "function" || !window.FL_BARBER || typeof hairList !== "function" || typeof hairPackList !== "function") return false;
    const orig = salonPreview;
    // eslint-disable-next-line no-global-assign
    salonPreview = function (opts) {
      if (opts && /^(Barber|Hair Stylist|Barber Expanded)$/.test(String(opts.title || "")) && opts.lead === "Pick a new hairstyle today!") {
        try {
          return orig(unified(opts));
        } catch (e) {
          warn("unified list", e);
        }
      }
      return orig(opts);
    };
    window.FL_BARBER_ALL = { TAG, suits, unified };
    console.log("[barber-all] loaded");
    return true;
  }

  if (!install()) {
    let n = 0;
    const t = setInterval(() => {
      if (install() || ++n > 120) clearInterval(t);
    }, 500);
  }
})();
