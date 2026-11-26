/* [mod] Family genetics for NaBlooLife (local mod).
 *
 * The base game rolls skin color separately for you, your parents, siblings, grandparents, cousins and some babies,
 * so a white player could have black parents or a black baby with a white partner. This keeps families coherent:
 *  - parents, siblings, grandparents, aunts/uncles and cousins get a tone next to yours (one shade either way)
 *  - your own (non-adopted) children are checked against both parents: if the skin falls outside the range of
 *    the two parents' tones, it is re-rolled between them
 * Adopted kids, spouses and friends are never touched. State: a `_g` flag on each fixed person (JSON only).
 */
(() => {
  "use strict";
  if (window.FL_GENES) return;
  const PAL = ["#f6d3b3", "#eebd94", "#d9a274", "#b97c50", "#8a5a3a", "#5e3d27"];
  const HEX = /^#[0-9a-f]{6}$/i;
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const lum = (h) => {
    const c = rgb(h);
    return 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];
  };
  const hexOk = (h) => typeof h === "string" && HEX.test(h);
  const nearest = (h) => PAL.reduce((b, p, i) => (Math.abs(lum(p) - lum(h)) < Math.abs(lum(PAL[b]) - lum(h)) ? i : b), 0);
  const shade = (h, spread) => {
    if (!hexOk(h)) return null;
    const i = nearest(h);
    const d = spread ? [-1, 0, 0, 1][Math.floor(Math.random() * 4)] : 0;
    // keep the exact color when we stay on the same step, so a mod/custom tone is respected
    return d === 0 ? h : PAL[Math.max(0, Math.min(PAL.length - 1, i + d))];
  };
  const mine = () => (state.mod && hexOk(state.mod.skinColor) ? state.mod.skinColor : state.look && hexOk(state.look.skin) ? state.look.skin : null);
  const blend = (a, b, t) => {
    const x = rgb(a),
      y = rgb(b);
    return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("");
  };
  const skinOf = (p) => (p && p.look && hexOk(p.look.skin) ? p.look.skin : null);

  function findPartner(c) {
    const op = c.otherParent;
    if (!op || typeof op !== "string") return null;
    const pool = [state.spouse, ...(state.lovers || []), ...(state.exes || [])].filter(Boolean);
    return pool.find((x) => `${x.first} ${x.last}` === op) || null;
  }

  function fix() {
    if (typeof state === "undefined" || state.dead || !state.look) return;
    const me = mine();
    if (!me) return;
    // parents
    (state.parents || []).forEach((p) => {
      if (p._g || !p.look) return;
      const s = shade(me, true);
      if (s) p.look.skin = s;
      p._g = 1;
    });
    // extended family + siblings: one shade around you
    (state.family || []).forEach((f) => {
      if (f._g || !f.look || f.kind === "child" || f.adopted) return;
      if (["sibling", "grandparent", "auntuncle", "cousin", "cousinkid", "nibling"].includes(f.kind)) {
        const s = shade(me, true);
        if (s) f.look.skin = s;
      }
      f._g = 1;
    });
    // own children: must sit between the two parents
    (state.family || []).forEach((f) => {
      if (f._g || f.kind !== "child" || f.adopted || !f.look) return;
      f._g = 1;
      const a = me;
      const partner = findPartner(f);
      const b = skinOf(partner) || a;
      const lo = Math.min(lum(a), lum(b)) - 12,
        hi = Math.max(lum(a), lum(b)) + 12;
      const cur = skinOf(f);
      if (cur && lum(cur) >= lo && lum(cur) <= hi) return;
      const [dark, light] = lum(a) <= lum(b) ? [a, b] : [b, a];
      f.look.skin = blend(dark, light, Math.random());
    });
  }

  function boot() {
    const btn = document.getElementById("ageBtn");
    if (typeof state === "undefined" || !state.parents || !state.look || !btn) return setTimeout(boot, 120);
    try {
      fix();
    } catch (e) {
      console.warn("[genetics]", e);
    }
    btn.addEventListener("click", () =>
      setTimeout(() => {
        try {
          fix();
        } catch (e) {
          console.warn("[genetics]", e);
        }
      }, 700),
    );
    // new babies show up on the baby card, then land in state.family: catch them as soon as the player acts
    document.addEventListener("click", () => setTimeout(() => { try { fix(); } catch {} }, 250), true);
    console.log("[genetics] loaded");
  }
  window.FL_GENES = { fix };
  boot();
})();
