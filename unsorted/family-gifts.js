/* [base] Family gifts for NaBlooLife.
 *
 * Relationships -> a family member -> Gift: besides buying a present, you can now GIVE SOMETHING YOU OWN to your
 * family: jewelry, cars and houses. The base game already let you give a car or a piece of jewelry from the item's own
 * screen, but only to a short list of people and never a house; this adds it to the person's Gift menu and to houses.
 *
 * It wraps parentAction(person, "gift", back, info). The person must be a parent, a relative or your spouse; anyone else
 * (friends, classmates) and people you have nothing to give keep the normal Gift screen untouched.
 *
 * Rules: the item leaves your assets for good. A house takes its mortgage with it, a car takes its loan. The relationship
 * grows with the item's value (more for pricey things); a fake piece of jewelry can be spotted and backfire.
 * Debug: FL_FGIFT.items() lists what you could give.
 */
(() => {
  "use strict";
  if (window.FL_FGIFT) return;

  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const cl = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const usdf = (n) => {
    try {
      return usd(n);
    } catch {
      return "$" + Math.round(n).toLocaleString("en-US");
    }
  };
  const warn = (w, e) => console.warn("[family-gifts] " + w, e);
  const fn = (name) => {
    try {
      return typeof window[name] === "function" ? window[name] : null;
    } catch {
      return null;
    }
  };

  // ------------------------------------------------------------------ who and what
  const isFamily = (p) => {
    try {
      return !!p && ((state.parents || []).includes(p) || (state.family || []).includes(p) || state.spouse === p);
    } catch {
      return false;
    }
  };

  // what it looks worth: the claimed value, unless you already know it is a fake
  const jewelValue = (j) => Math.max(0, Math.round(Number(j.fake && j.known ? j.value : j.claim) || Number(j.claim) || Number(j.value) || 0));
  const carVal = (c) => {
    try {
      return typeof carValue === "function" ? carValue(c) : Number(c.price) || 0;
    } catch {
      return Number(c.price) || 0;
    }
  };
  const houseVal = (h) => {
    try {
      return typeof homeValue === "function" ? homeValue(h) : Number(h.price) || 0;
    } catch {
      return Number(h.price) || 0;
    }
  };
  const houseOwe = (h) => {
    try {
      return typeof homeOwe === "function" ? homeOwe(h) : 0;
    } catch {
      return 0;
    }
  };

  function items() {
    const out = { jew: [], car: [], house: [] };
    try {
      for (const j of state.jewelry || []) {
        if (!j) continue;
        out.jew.push({
          kind: "jew",
          ref: j,
          name: window.JEWELRY && JEWELRY.lc ? JEWELRY.lc(j) : String(j.name || "jewelry").toLowerCase(),
          value: jewelValue(j),
          img: window.JEWELRY && JEWELRY.itemImg ? JEWELRY.itemImg(j) : "emoji/1f48e.png",
        });
      }
      for (const c of state.cars || []) {
        if (!c) continue;
        out.car.push({
          kind: "car",
          ref: c,
          name: typeof carName === "function" ? carName(c) : `${c.make} ${c.model}`,
          value: carVal(c),
          debt: c.loanYears && c.loanPay ? Math.round(12 * c.loanPay * c.loanYears) : 0,
          img: typeof carImg === "function" ? carImg(c) : "emoji/1f697.png",
        });
      }
      for (const h of state.props || []) {
        if (!h) continue;
        out.house.push({
          kind: "house",
          ref: h,
          name: `${String(h.name || "house").toLowerCase()}${h.addr ? " at " + h.addr : ""}`,
          value: houseVal(h),
          debt: houseOwe(h),
          img: "emoji/1f3e0.png",
        });
      }
    } catch (e) {
      warn("items", e);
    }
    for (const k of Object.keys(out)) out[k].sort((a, b) => b.value - a.value);
    return out;
  }
  const countAll = (it) => it.jew.length + it.car.length + it.house.length;

  // ------------------------------------------------------------------ the cards
  const card = (o) => {
    try {
      jCard({ tag: "Gift", ...o });
    } catch (e) {
      warn("card", e);
    }
  };
  const info = (t, m, cb) => notice(t, m, cb || null, true);

  function giveAway(it) {
    if (it.kind === "jew") {
      if (window.JEWELRY && JEWELRY.lose) JEWELRY.lose(it.ref);
      else {
        const i = (state.jewelry || []).indexOf(it.ref);
        if (i >= 0) state.jewelry.splice(i, 1);
      }
    } else if (it.kind === "car") {
      if (fn("removeCar")) removeCar(it.ref);
      else {
        const i = (state.cars || []).indexOf(it.ref);
        if (i >= 0) state.cars.splice(i, 1);
      }
    } else {
      const i = (state.props || []).indexOf(it.ref);
      if (i >= 0) {
        state.props.splice(i, 1);
        it.ref.forSale = null;
      }
    }
  }

  function confirmGift(it, person, back, orig, info_) {
    const first = String((info_ && info_.name) || person.first || "them").split(" ")[0];
    const role = String((info_ && info_.role) || "relative").toLowerCase();
    const rows = [
      ["Item", it.name],
      ["Value", usdf(it.value)],
    ];
    if (it.debt) rows.push([it.kind === "house" ? "Mortgage" : "Loan", usdf(it.debt)]);
    card({
      iconSrc: it.img,
      title: "Give it away?",
      lead: "It leaves your assets for good. Think about it.",
      rows,
      choices: [
        [
          "Give it",
          () => {
            const exp = it.kind === "jew" && it.ref.fake && rnd() < (it.ref.known ? 0.5 : 0.25);
            giveAway(it);
            const s = cl(Math.round(10 + 4 * Math.sqrt(Math.max(0, it.value)) + ri(-10, 20)));
            person.rel = cl((person.rel ?? 50) + (exp ? -ri(10, 20) : Math.max(5, Math.round(s / 4))));
            person.seenAt = state.age;
            if (!exp && state.stats) state.stats.Happiness = cl((Number(state.stats.Happiness) || 0) + ri(1, 4));
            try {
              renderStats();
            } catch {}
            try {
              say(`I gave my ${it.name} to my ${role}, ${first}.${exp ? " They realized it was fake." : ""}`);
            } catch {}
            const extra = it.debt ? `<br><br>The ${it.kind === "house" ? "mortgage" : "loan"} goes with it.` : "";
            if (exp) info("Busted", `You gave ${first} your ${it.name}, and they realized it was fake!${extra}`);
            else info("Generous", `You gave your ${it.name} to ${first}. They loved it!${extra}`);
          },
        ],
        ["Never mind", () => {}, "gray"],
      ],
    });
  }

  function pickItem(kind, all, person, back, orig, info_) {
    const list = all[kind].slice(0, 8);
    card({
      iconSrc: list[0] ? list[0].img : "rel/gift.png",
      title: kind === "jew" ? "Jewelry" : kind === "car" ? "Cars" : "Houses",
      lead: "What do you want to give?",
      choices: [
        ...list.map((it) => [`${it.name} (${usdf(it.value)})`, () => confirmGift(it, person, back, orig, info_)]),
        ["Back", () => chooseKind(person, back, orig, info_), "gray"],
      ],
    });
  }

  function chooseKind(person, back, orig, info_) {
    const all = items();
    const choices = [];
    if (all.jew.length) choices.push([`Jewelry (${all.jew.length})`, () => pickItem("jew", all, person, back, orig, info_)]);
    if (all.car.length) choices.push([`Cars (${all.car.length})`, () => pickItem("car", all, person, back, orig, info_)]);
    if (all.house.length) choices.push([`Houses (${all.house.length})`, () => pickItem("house", all, person, back, orig, info_)]);
    choices.push(["Back", () => start(person, back, orig, info_), "gray"]);
    card({ iconSrc: "rel/gift.png", title: "Give something you own", lead: "Pick the kind of gift.", choices });
  }

  function start(person, back, orig, info_) {
    card({
      iconSrc: "rel/gift.png",
      title: "Gift",
      lead: "What kind of gift?",
      choices: [
        ["Buy a gift", () => orig(person, "gift", back, info_)],
        ["Give something I own", () => chooseKind(person, back, orig, info_)],
        ["Never mind", () => {}, "gray"],
      ],
    });
  }

  // ------------------------------------------------------------------ hook
  function boot() {
    if (typeof state === "undefined" || typeof parentAction !== "function" || typeof jCard !== "function") return setTimeout(boot, 200);
    const orig = window.parentAction;
    if (orig.__flFamilyGifts) return;
    const wrapped = function (e, t, a, o) {
      try {
        if (t === "gift" && isFamily(e) && !state.dead && countAll(items()) > 0) return start(e, a, orig, o);
      } catch (err) {
        warn("gift", err);
      }
      return orig.apply(this, arguments);
    };
    wrapped.__flFamilyGifts = true;
    window.parentAction = wrapped;
    console.log("[family-gifts] loaded");
  }
  window.FL_FGIFT = { items, isFamily };
  boot();
})();
