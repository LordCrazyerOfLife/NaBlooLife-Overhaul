/* [mod] Barbershop prices for NaBlooLife (local mod).
 *
 * In the base game the Salon & Spa is free. With this mod the barber, hair stylist, dye job and shave
 * charge you when you actually change something: the price shows under the preview, and if you pick the look
 * you already have (or can't pay) nothing is charged and nothing changes.
 *
 * It wraps SALON_OPEN[barber|barberx|dye|shave] and salonPreview, so the base game code is not edited.
 */
(() => {
  "use strict";
  if (window.FL_BARBER) return;

  // base prices in USD (the game's usd() already handles the currency text)
  const PRICES = { barber: 25, barberx: 45, dye: 60, shave: 15 };

  const price = (kind) => {
    let p = PRICES[kind] || 20;
    try {
      if ("f" === PG() && (kind === "barber" || kind === "barberx")) p = Math.round(p * 1.6); // stylist
    } catch {}
    return p;
  };
  const money = (n) => {
    try {
      return usd(n);
    } catch {
      return "$" + n.toLocaleString("en-US");
    }
  };

  let ctx = null; // kind of the salon screen being opened right now

  const install = () => {
    if (typeof SALON_OPEN !== "object" || typeof salonPreview !== "function") return false;
    if (window.FL_BARBER) return true;

    const origPreview = salonPreview;
    // eslint-disable-next-line no-global-assign
    salonPreview = function (opts) {
      const kind = ctx;
      ctx = null;
      if (!kind || !opts || typeof opts.onPick !== "function") return origPreview(opts);
      const cost = price(kind);
      const start = opts.start;
      const origPick = opts.onPick;
      opts.onPick = (h) => {
        if (h === start) return; // same look as before: no charge, no change
        if ((Number(state.money) || 0) < cost) {
          return notice("Not enough money", `This costs ${money(cost)} and you don't have it.`, null, true);
        }
        state.money -= cost;
        try {
          renderStats();
        } catch {}
        origPick(h);
        try {
          say(`It cost me ${money(cost)}.`);
        } catch {}
      };
      const r = origPreview(opts);
      // price tag right above the button
      try {
        const btn = document.getElementById("accPick");
        if (btn && !document.getElementById("flBarberPrice")) {
          const d = document.createElement("div");
          d.id = "flBarberPrice";
          d.textContent = `Cost: ${money(cost)}`;
          d.style.cssText = "text-align:center;font-weight:800;margin:6px 0 2px;opacity:.85";
          btn.parentNode.insertBefore(d, btn);
        }
      } catch {}
      return r;
    };

    for (const kind of Object.keys(PRICES)) {
      const orig = SALON_OPEN[kind];
      if (typeof orig !== "function") continue;
      SALON_OPEN[kind] = function (...a) {
        ctx = kind;
        try {
          return orig.apply(this, a);
        } finally {
          ctx = null; // shave can bail out with a notice before opening the preview
        }
      };
    }
    window.FL_BARBER = { PRICES, price };
    return true;
  };

  if (!install()) {
    let n = 0;
    const t = setInterval(() => {
      if (install() || ++n > 60) clearInterval(t);
    }, 500);
  }
})();
