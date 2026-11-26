/*
 * hairfit.js: keeps pack hair on the head.
 *
 * The hair PNGs in hair/ are full-canvas layers that sit over the face. Some sets (nh01..nh24, and anything added later)
 * were drawn with a deeper crown, so their hairline lands on the eyes instead of the forehead. composeFace() calls
 * FL_HAIRFIT(v, k, stage) after the layers load. For every hair/ layer it:
 *   1. measures the head (top of the stage base layer) and the eyes (top of the stage eye layer) of the CURRENT face
 *      (stage and gender change both), so it always follows the real head position;
 *   2. measures the hair: top row and hairline (where the forehead opening starts in the centre columns);
 *   3. if the hairline is below where a forehead hairline belongs, squashes the crown (top -> hairline) so the hairline
 *      lands there and moves the rest of the hair (sides, long strands) up by the same amount.
 * Hair that is already fine (hairline high enough) is returned untouched, so old hairstyles do not change.
 * The geometry is in plan() (pure, no DOM) so it can be tested in Node.
 */
(() => {
  const HAIRLINE_AT = 0.63; // hairline target: head top + 63% of the way down to the eyes
  const TOLERANCE = 0.17; // leave it alone unless it is more than 17% of that span too low
  const MIN_SCALE = 0.55; // never squash the crown below this

  // first row with at least `min` pixels above `thr`
  function firstRow(alpha, w, h, thr, min) {
    for (let y = 0; y < h; y++) {
      let n = 0;
      for (let x = 0; x < w; x++) if (alpha[y * w + x] > thr && ++n >= min) return y;
    }
    return null;
  }

  function lastRow(alpha, w, h, thr, min) {
    for (let y = h - 1; y >= 0; y--) {
      let n = 0;
      for (let x = 0; x < w; x++) if (alpha[y * w + x] > thr && ++n >= min) return y;
    }
    return null;
  }

  // hairline: first row, below the crown, where the centre columns are mostly empty (the forehead opening)
  function hairlineOf(alpha, w, h, top) {
    const x0 = Math.round(w * 0.42),
      x1 = Math.round(w * 0.58);
    for (let y = top + Math.round(h * 0.08); y < Math.round(h * 0.88); y++) {
      let n = 0;
      for (let x = x0; x < x1; x++) if (alpha[y * w + x] > 60) n++;
      if (n / (x1 - x0) < 0.25) return y;
    }
    return null;
  }

  /**
   * plan({hair, hw, hh, base, bw, bh, eye, ew, eh}) -> null (leave as is) or {top, hl, topT, s, hlT}
   * hair/base/eye are alpha channels (Uint8 arrays). Head metrics are scaled to the hair canvas.
   */
  function plan(o) {
    const headTop = firstRow(o.base, o.bw, o.bh, 40, 3),
      eyeTop = firstRow(o.eye, o.ew, o.eh, 40, 3);
    if (headTop == null || eyeTop == null || eyeTop <= headTop) return null;
    const k = o.hh / o.bh,
      headTopH = headTop * k,
      span = (eyeTop - headTop) * k,
      top = firstRow(o.hair, o.hw, o.hh, 60, 4);
    if (top == null) return null;
    const hl = hairlineOf(o.hair, o.hw, o.hh, top);
    if (hl == null) return null;
    const hlT = headTopH + HAIRLINE_AT * span;
    if (hl <= hlT + TOLERANCE * span) return null;
    const topT = Math.max(2, Math.min(top, Math.round(headTopH - 0.08 * span)));
    const s = Math.max(MIN_SCALE, Math.min(1, (hlT - topT) / (hl - top))),
      hl2 = topT + (hl - top) * s;
    // hair that runs off the bottom of the canvas (long hair) must keep reaching the bottom, otherwise moving it up
    // leaves a flat cut across the face: stretch the part below the hairline instead of just moving it
    const bot = lastRow(o.hair, o.hw, o.hh, 60, 4),
      ls = bot != null && bot >= o.hh - 3 ? Math.min(1.7, (o.hh - hl2) / (o.hh - hl)) : 1;
    return { top, hl, topT, s, hlT: hl2, ls };
  }

  // ---------------------------------------------------------------- browser side
  const alphaCache = new WeakMap();
  function alphaOf(img) {
    let a = alphaCache.get(img);
    if (a) return a;
    const w = img.naturalWidth || img.width,
      h = img.naturalHeight || img.height,
      c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, w, h).data,
      out = new Uint8Array(w * h);
    for (let i = 0; i < out.length; i++) out[i] = d[i * 4 + 3];
    a = { a: out, w, h };
    alphaCache.set(img, a);
    return a;
  }

  const planCache = new WeakMap(); // hair base img -> Map(headKey -> plan|null)
  const outCache = new WeakMap(); // layer img -> Map(planKey -> canvas)

  function planFor(hairBase, baseImg, eyeImg) {
    const H = alphaOf(hairBase),
      B = alphaOf(baseImg),
      E = alphaOf(eyeImg),
      key = baseImg.src + "|" + eyeImg.src;
    let m = planCache.get(hairBase);
    if (!m) planCache.set(hairBase, (m = new Map()));
    if (!m.has(key)) m.set(key, plan({ hair: H.a, hw: H.w, hh: H.h, base: B.a, bw: B.w, bh: B.h, eye: E.a, ew: E.w, eh: E.h }));
    return m.get(key);
  }

  function apply(img, p, key) {
    let m = outCache.get(img);
    if (!m) outCache.set(img, (m = new Map()));
    if (m.has(key)) return m.get(key);
    const w = img.naturalWidth || img.width,
      h = img.naturalHeight || img.height,
      c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d");
    g.drawImage(img, 0, p.top, w, p.hl - p.top, 0, p.topT, w, (p.hl - p.top) * p.s); // crown, squashed
    g.drawImage(img, 0, p.hl, w, h - p.hl, 0, p.hlT, w, (h - p.hl) * p.ls); // rest: moved up (stretched if it reaches the bottom)
    m.set(key, c);
    return c;
  }

  /** v = layer list [[name, color], ...], k = loaded images (same order), stage = life stage number. Edits k in place. */
  function fit(v, k, stage) {
    try {
      const bi = v.findIndex((x) => x[0].endsWith(`stage${stage}-base`)),
        ei = v.findIndex((x) => x[0].endsWith(`stage${stage}-eye-base`));
      if (bi < 0 || ei < 0 || !k[bi] || !k[ei]) return;
      v.forEach(([name], r) => {
        if (!/^hair\/.+-hair-(base|lighting)$/.test(name) || !k[r]) return;
        const baseName = name.replace(/-hair-lighting$/, "-hair-base"),
          bi2 = baseName === name ? r : v.findIndex((x) => x[0] === baseName);
        if (bi2 < 0 || !k[bi2]) return;
        const p = planFor(k[bi2], k[bi], k[ei]);
        if (p) k[r] = apply(k[r], p, k[bi].src + "|" + k[ei].src);
      });
    } catch (e) {
      console.warn("[hairfit]", e);
    }
  }

  if (typeof window !== "undefined") {
    window.FL_HAIRFIT = fit;
    window.FL_HAIRFIT_PLAN = plan; // tests
  }
  if (typeof module !== "undefined" && module.exports) module.exports = { plan };
})();
