/* [mod] Auction House v2 for NaBlooLife (local mod).
 *
 * Entry: Shopping -> Auctions (last section), 18+.
 * BUY: yearly catalogue (collectible hypercars, exotic/used cars, watches & chains, paintings, digital
 *   collectibles during a bubble, seized property). Live bidding against named rivals with private limits,
 *   memory and bidding wars. Reserve prices, variable buyer's premium (10-25%), forgeries unless you pay
 *   for authentication. Optional shell company to launder gang heat through expensive purchases.
 * SELL: consign your cars, jewels and art. Fame multiplies the price ("Owned by ..."); notorious owners
 *   attract macabre-memorabilia collectors. When you die your family auctions the estate.
 * INVEST: collectibles appreciate (~8%/yr for hypercars), markets crash, digital-collectible bubbles
 *   inflate and then go to ~$0.
 * EVENTS: forgotten painting in the attic, garage-sale find, judge bribed with a painting, charity gala.
 *
 * State: state.auction = { year, lots, rivals, mkt, bubble, gala }, state.art = [] (JSON only).
 * Deps (globals from game.html): state, usd, say, notice, jCard, renderStats, chaChing, makeCar, carsOnSale, die.
 */
(() => {
  "use strict";
  if (window.FL_AUCTIONS) return;
  window.FL_AUCTIONS = true;

  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const clampN = (v, a, b) => Math.max(a, Math.min(b, Number(v) || 0));
  const shuffle = (a) => {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  };
  // translate a whole sentence, including the parts the DOM dictionary can't see
  const TR = (s) => (window.FL_I18N ? FL_I18N.t(s) : s);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const money = (n) => (typeof usd === "function" ? usd(Math.round(n)) : "$" + Math.round(n).toLocaleString("en-US"));
  const year = () => (Number(state && state.birthYear) || 2000) + (Number(state && state.age) || 0);
  const ifx = () => (typeof window.inflFx === "function" ? window.inflFx() : 1);
  const chev = () => (typeof CHEV !== "undefined" ? CHEV : "");
  const back = () => (typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;");
  const snd = (n) => typeof play === "function" && play(n);
  const sayIt = (s) => typeof say === "function" && say(s);
  const uid = () => Math.random().toString(36).slice(2);
  const later = (fn) => (typeof queuePopup === "function" ? queuePopup(fn) : setTimeout(fn, 600));
  const ART_IMG = "emoji/1f5bc-fe0f.png";
  const NFT_IMG = "emoji/1f48e.png";

  // ------------------------------------------------------------------ rivals (100% fictional)
  const RIVALS = [
    { id: "hale", n: "Victor Hale", t: "Collector", mult: { car: 1.25, col: 1.5, jew: 1.0, art: 1.1, nft: 0.8 }, aggr: 0.55 },
    { id: "orlov", n: "Madame Orlov", t: "Heiress", mult: { car: 1.15, col: 1.2, jew: 1.35, art: 1.4, nft: 0.7 }, aggr: 0.6 },
    { id: "flip", n: 'Dax "Flip" Moreno', t: "Flipper", mult: { car: 0.95, col: 0.95, jew: 0.95, art: 0.9, nft: 1.3 }, aggr: 0.8 },
    { id: "ingram", n: "Prof. Ingram", t: "Museum buyer", mult: { car: 0.9, col: 1.3, jew: 1.4, art: 1.6, nft: 0.5 }, aggr: 0.4 },
    { id: "aoki", n: "Kenji Aoki", t: "Tech founder", mult: { car: 1.3, col: 1.35, jew: 1.1, art: 1.2, nft: 1.6 }, aggr: 0.7 },
    { id: "agent", n: "Anonymous phone bidder", t: "Private agent", mult: { car: 1.4, col: 1.6, jew: 1.5, art: 1.5, nft: 1.0 }, aggr: 0.5 },
    { id: "delgado", n: "Rosa Delgado", t: "Dealer", mult: { car: 0.88, col: 0.95, jew: 0.9, art: 0.9, nft: 0.7 }, aggr: 0.45 },
    { id: "ferrante", n: "Luca Ferrante", t: "Racer", mult: { car: 1.3, col: 1.1, jew: 0.8, art: 0.7, nft: 0.6 }, aggr: 0.75 },
    { id: "sheikh", n: "An anonymous sheikh", t: "Royal collector", mult: { car: 1.5, col: 1.7, jew: 1.6, art: 1.4, nft: 0.9 }, aggr: 0.6 },
    { id: "swiss", n: "A Swiss collector", t: "Private bank client", mult: { car: 1.1, col: 1.3, jew: 1.5, art: 1.5, nft: 0.6 }, aggr: 0.45 },
  ];
  const GLOAT = ['grins: "Better luck next year."', "taps the paddle and shrugs.", "doesn't even look at you.", 'smiles: "Nice try."'];
  const SULK = ["glares at you across the room.", 'mutters something about "beginner\'s luck".', "is already looking at the next lot."];

  // ------------------------------------------------------------------ catalogue data (fictional artists)
  const JEWELS = [
    { img: "watch-01-datejust-steel", name: "Steel Dress Watch", noun: "watch", metal: "Stainless Steel", lo: 4000, hi: 25000 },
    { img: "watch-02-chrono-gold", name: "Gold Chronograph", noun: "watch", metal: "18K Gold", lo: 20000, hi: 300000 },
    { img: "watch-03-octagon-blue", name: "Octagon Sport Watch", noun: "watch", metal: "Stainless Steel", lo: 30000, hi: 500000 },
    { img: "watch-04-nautilus-rose", name: "Rose Gold Sport Watch", noun: "watch", metal: "18K Rose Gold", lo: 40000, hi: 900000 },
    { img: "watch-05-skeleton-tonneau", name: "Skeleton Tonneau Watch", noun: "watch", metal: "Titanium", lo: 150000, hi: 2500000 },
    { img: "watch-11-daydate-green", name: "Green Dial Gold Watch", noun: "watch", metal: "18K Gold", lo: 30000, hi: 400000 },
    { img: "cuban-09", name: "Iced Cuban Chain", noun: "chain", metal: "18K White Gold", lo: 30000, hi: 900000 },
    { img: "cuban-10", name: "Diamond Clasp Cuban Chain", noun: "chain", metal: "18K Gold", lo: 150000, hi: 2500000 },
    { img: "cuban-02", name: "Heavy Gold Cuban Chain", noun: "chain", metal: "18K Gold", lo: 3000, hi: 60000 },
    { img: "gem-09-diamond-watch", name: "Diamond Pave Watch", noun: "watch", metal: "18K White Gold", lo: 40000, hi: 600000 },
    { img: "anc-01-falcon-collar", name: "Ancient Falcon Collar", noun: "necklace", metal: "24K Gold", lo: 250000, hi: 6000000 },
    { img: "anc-02-royal-crown", name: "Royal Pearl Crown", noun: "crown", metal: "22K Gold", lo: 500000, hi: 12000000 },
    { img: "anc-12-dragon-cuff", name: "Dragon Cuff", noun: "bracelet", metal: "22K Gold", lo: 200000, hi: 5000000 },
  ];
  const ARTISTS = ["Elena Voss", "Tomás Arriaga", "Mireille Castaigne", "Haruto Sen", "Okonkwo Adeyemi", "Inés Valverde", "Bastian Krol", "Priya Raman"];
  const TITLES = ["Blue Study No. ", "Untitled #", "Harbor at Dusk", "The Quiet Hour", "Red Field", "Portrait of a Stranger", "Nocturne in Gold", "Fault Lines"];
  const NFTS = ["Pixel Primates #", "Cosmic Cats #", "Moon Punks #", "Ghost Pandas #"];

  // ------------------------------------------------------------------ state
  const A = () => {
    if (!state.auction || typeof state.auction !== "object") state.auction = {};
    const a = state.auction;
    if (!Array.isArray(a.lots)) a.lots = [];
    if (!a.rivals || typeof a.rivals !== "object") a.rivals = {};
    if (!a.mkt || typeof a.mkt !== "object") a.mkt = { art: 1 };
    if (typeof a.year !== "number") a.year = -1;
    return a;
  };
  const ART = () => (Array.isArray(state.art) ? state.art : (state.art = []));
  const rv = (id) => (A().rivals[id] ||= { heat: 0, beat: 0, lost: 0 });

  // ------------------------------------------------------------------ fame / infamy / provenance
  const fameOf = () => {
    const c = [
      state.futbol && state.futbol.fame,
      state.acting && state.acting.fame,
      state.musician && state.musician.fame,
      state.fighter && state.fighter.fame,
      state.serial && state.serial.fame,
      state.chess && state.chess.champion ? 60 : 0,
      state.gangLife && state.gangLife.rep ? Math.min(40, state.gangLife.rep / 4) : 0,
    ].map((x) => clampN(x, 0, 100));
    return Math.max(...c);
  };
  const infamyOf = () => {
    const s = state.serial;
    if (!s || !(s.on || s.kills > 0) || !(s.kills > 0)) return 0;
    return Math.min(3, (s.kills || 0) * 0.2 + (s.fame || 0) / 50);
  };
  // returns { mult, text }
  function provenance() {
    const f = fameOf();
    const fm = f >= 20 ? 1 + Math.min(1.5, f / 60) : 1;
    const im = 1 + infamyOf();
    const who = `${state.first || "A celebrity"}${state.last ? " " + state.last : ""}`.trim();
    if (im > fm && im > 1.2) return { mult: im, text: `Notorious provenance: macabre-memorabilia collectors are circling (x${im.toFixed(1)}).` };
    if (fm > 1.1) return { mult: fm, text: `"Owned by ${who}" - fame multiplies the price (x${fm.toFixed(1)}).` };
    return { mult: 1, text: "" };
  }

  // ------------------------------------------------------------------ lots
  const premiumFor = (v) => (v < 50000 * ifx() ? 0.1 : v < 250000 * ifx() ? 0.15 : v < 1500000 * ifx() ? 0.2 : 0.25);

  function carLot(row, isNew, label) {
    const c = makeCar(row, isNew);
    const nm = `${c.make} ${c.model}`;
    const col = (window.COLLECTIBLE_CARS || []).includes(nm);
    const tn = (window.CAR_TYPE_NAME && window.CAR_TYPE_NAME[c.type]) || c.type;
    return {
      id: uid(), cat: "car", col, label, name: nm, img: typeof carImg === "function" ? carImg(c) : `cars/${c.sprite}.png`,
      desc: `${c.isNew ? "Brand new" : `${c.age}-year old`} ${c.color} ${tn}`, value: c.price, car: c,
      fake: col && rnd() < 0.06,
    };
  }
  function jewelLot(label) {
    const j = pick(JEWELS);
    const value = Math.round(((j.lo + (j.hi - j.lo) * Math.random() ** 2.2) * ifx()) / 100) * 100;
    return {
      id: uid(), cat: "jew", col: j.hi >= 900000, label, name: j.name, img: `jewelry/${j.img}.png`, desc: `${j.metal} ${j.noun}`,
      value, fake: rnd() < 0.1,
      item: { id: uid(), quality: ri(60, 100), cond: 100, fake: false, img: j.img, name: j.name, noun: j.noun, plural: false, metal: j.metal, gem: null, ct: 0, claim: value },
    };
  }
  function artPiece(unappraised) {
    const tier = rnd();
    const [lo, hi] = tier < 0.6 ? [5000, 60000] : tier < 0.92 ? [60000, 600000] : [600000, 8000000];
    const base = Math.round((lo + (hi - lo) * Math.random() ** 2) * ifx() * (A().mkt.art || 1) / 100) * 100;
    const artist = pick(ARTISTS);
    const t = pick(TITLES);
    const name = /[#.]$/.test(t) ? `${t}${ri(1, 40)}` : t;
    return { id: uid(), kind: "art", name, artist, img: ART_IMG, value: base, col: true, fake: false, unappr: !!unappraised };
  }
  function artLot(label) {
    const p = artPiece(false);
    return { id: uid(), cat: "art", col: p.value >= 600000 * ifx(), label, name: p.name, img: ART_IMG, desc: `Oil on canvas by ${p.artist}`, value: p.value, fake: rnd() < 0.14, art: p };
  }
  function nftLot(b) {
    const base = Math.round((1000 + 39000 * Math.random() ** 2) * ifx() * (b.mult || 1));
    const name = `${pick(NFTS)}${ri(100, 9999)}`;
    return {
      id: uid(), cat: "nft", col: false, label: "Digital collectibles", name, img: NFT_IMG, desc: "Digital token, hot market",
      value: Math.max(100, base), fake: rnd() < 0.2,
      art: { id: uid(), kind: "nft", name, artist: "On-chain", img: NFT_IMG, value: Math.max(100, base), col: false, fake: false },
    };
  }

  function buildLots() {
    const a = A();
    const lots = [];
    const rows = typeof carsOnSale === "function" ? carsOnSale() : window.CARS || [];
    const all = [...rows, ...(window.LUXURY_CARS || [])];
    const colNames = window.COLLECTIBLE_CARS || [];
    const isCol = (r) => colNames.includes(`${r[0]} ${r[1]}`);
    const colRows = all.filter(isCol);
    const exo = all.filter((r) => !isCol(r) && r[3] >= 100000);
    const cheap = rows.filter((r) => r[3] < 70000);
    if (colRows.length) lots.push(carLot(pick(colRows), true, "Collector's lot"));
    if (exo.length) lots.push(carLot(pick(exo), rnd() < 0.5, "Exotic"));
    if (exo.length) lots.push(carLot(pick(exo), false, "Estate sale"));
    if (cheap.length) lots.push(carLot(pick(cheap), false, "Surplus"));
    lots.push(jewelLot("Fine watches & jewels"), jewelLot("Fine watches & jewels"));
    lots.push(artLot("Modern & contemporary"), artLot("Modern & contemporary"));
    if (a.bubble && a.bubble.active) lots.push(nftLot(a.bubble), nftLot(a.bubble));
    // seized property: the FBI/Marshals clear out criminals' assets (more likely if you run with a gang)
    const gang = state.gangLife && state.gangLife.member;
    if (gang || rnd() < 0.25) {
      const l = rnd() < 0.5 && exo.length ? carLot(pick(exo), false, "US Marshals seizure") : jewelLot("US Marshals seizure");
      l.seized = true;
      l.fake = false;
      lots.push(l);
    }
    for (const l of lots) {
      l.reserve = Math.round(l.value * (l.seized ? 0.4 : 0.55));
      l.premium = premiumFor(l.value);
      l.status = "open";
      l.authentic = null;
    }
    return lots;
  }
  function ensureLots() {
    const a = A();
    if (a.year !== year() || !a.lots.length) {
      a.year = year();
      a.lots = buildLots();
    }
    return a;
  }

  // ------------------------------------------------------------------ live bidding
  let S = null;
  const niceInc = (v) => {
    const raw = Math.max(50, v * 0.025);
    const step = raw >= 50000 ? 5000 : raw >= 10000 ? 1000 : raw >= 2000 ? 500 : raw >= 400 ? 100 : 50;
    return Math.max(step, Math.round(raw / step) * step);
  };
  const minBid = () => (S.leader ? S.price + S.inc : S.price);
  const feeMult = () => 1 + S.lot.premium + (S.launder ? 0.2 : 0);
  const afford = (amount) => state.money >= Math.round(amount * feeMult());

  function startSession(lot) {
    const key = lot.col ? "col" : lot.cat;
    const picks = shuffle(RIVALS).slice(0, ri(3, 5));
    S = {
      lot, inc: niceInc(lot.value), price: lot.reserve, leader: null, prev: null, scare: 1, war: 0, launder: false, log: [],
      rivals: picks.map((r) => {
        const st = rv(r.id);
        return { r, st, max: lot.value * (r.mult[key] || r.mult[lot.cat] || 1) * (0.85 + 0.3 * rnd()) * (1 + st.heat), aggr: Math.min(0.95, r.aggr + st.heat), active: true };
      }),
    };
    rivalsRespond(S);
  }

  function rivalRaise(s, b, mult, tag) {
    const bid = Math.min(Math.floor(b.max), s.price + Math.round(s.inc * mult));
    if (bid <= s.price) return false;
    s.prev = s.leader;
    s.price = bid;
    s.leader = b;
    s.log.push(`${tag || ""}${b.r.n} bids ${money(bid)}.`);
    return true;
  }

  function rivalsRespond(s) {
    let raised = false;
    for (const b of shuffle(s.rivals.filter((x) => x.active && s.leader !== x))) {
      if (s.price + s.inc > b.max) {
        b.active = false;
        continue;
      }
      const room = 1 - 0.6 * Math.pow(Math.min(1, s.price / b.max), 2);
      if (rnd() < b.aggr * room * s.scare) {
        raised = rivalRaise(s, b, rnd() < 0.25 ? 2 : 1);
        if (raised) break;
      }
    }
    // bidding war: two rivals want the same lot and the price explodes
    if (raised) {
      let rounds = 0;
      while (rounds < 3) {
        const duel = shuffle(s.rivals.filter((x) => x.active && x !== s.leader && s.price + s.inc <= x.max));
        if (!duel.length || rnd() > 0.5 + 0.1 * rounds) break;
        const b = duel[0];
        if (!rivalRaise(s, b, 1.5 + rnd() * 1.5, rounds === 0 ? "BIDDING WAR! " : "")) break;
        s.war++;
        rounds++;
      }
    }
    s.scare = 1;
    return raised;
  }

  function lotInfoRows(lot) {
    const rows = [["Estimate", money(lot.value)], ["Reserve", money(lot.reserve)], ["Buyer's premium", `${Math.round(lot.premium * 100)}%`]];
    if (lot.authentic === true) rows.push(["Authentication", "Certified authentic"]);
    return rows;
  }

  function bidCard() {
    const lot = S.lot;
    const m = minBid();
    const alive = S.rivals.filter((x) => x.active).length;
    const choices = [];
    for (const [amt, label, scare] of [
      [m, `Bid ${money(m)}`, 1],
      [m + 3 * S.inc, `Jump bid ${money(m + 3 * S.inc)}`, 0.6],
      [m + 8 * S.inc, `Statement bid ${money(m + 8 * S.inc)}`, 0.3],
    ]) {
      if (afford(amt)) choices.push([label, () => playerBid(amt, scare)]);
    }
    if (state.gangLife && state.gangLife.member && state.gangLife.heat > 0 && lot.cat !== "nft") {
      choices.push([
        `Shell company: ${S.launder ? "ON (+20% fee, cools the heat)" : "off - launder this purchase"}`,
        () => {
          S.launder = !S.launder;
          bidCard();
        },
      ]);
    }
    if (lot.authentic === null && lot.status === "open" && !S.leader) {
      const fee = Math.round(lot.value * 0.03);
      if (state.money >= fee) choices.push([`Pay for authentication (${money(fee)})`, () => authenticate(fee)]);
    }
    choices.push([choices.length ? "Pass (walk away)" : "You can't cover the next bid - walk away", () => passLot()]);
    const lead =
      `${esc(lot.label)}.<br>${esc(lot.desc)}.` +
      (S.log.length ? `<br><br>${S.log.slice(-4).map(esc).join("<br>")}` : `<br><br>${S.leader ? "" : "Opening bid is on the floor. Nobody has bid yet."}`) +
      (lot.seized ? "<br><br>Seized by the authorities. Cheaper, but the room is full of dealers." : "");
    jCard({
      tag: "Auction",
      iconSrc: lot.img,
      title: lot.name,
      lead,
      rows: [
        ...lotInfoRows(lot),
        ["Current bid", S.leader ? money(S.price) : `${money(S.price)} (reserve)`],
        ["Leading", S.leader ? S.leader.r.n : "No one"],
        ["Bidders in the room", String(alive)],
        ["Your cash", money(state.money)],
      ],
      choices,
    });
  }

  function authenticate(fee) {
    const lot = S.lot;
    state.money -= fee;
    if (typeof renderStats === "function") renderStats();
    if (lot.fake) {
      lot.status = "withdrawn";
      return notice("FORGERY", `The experts say the ${lot.name} is a fake. The house withdraws the lot. Your ${money(fee)} fee bought you a good escape.`, () => openAuctions(), true);
    }
    lot.authentic = true;
    bidCard();
  }

  function playerBid(amount, scare) {
    S.prev = S.leader;
    S.price = amount;
    S.leader = "you";
    S.log = [`You bid ${money(amount)}.`];
    S.scare = scare;
    if (rivalsRespond(S)) return bidCard();
    return sold(true);
  }

  function passLot() {
    let guard = 0;
    while (rivalsRespond(S) && guard++ < 60);
    if (S.leader && S.leader !== "you") return sold(false);
    S.lot.status = "passed";
    notice("No sale", `The ${S.lot.name} didn't reach its reserve and was withdrawn.`, () => openAuctions(), true);
  }

  function deliver(lot) {
    let extra = "";
    const forged = lot.fake && lot.authentic !== true;
    if (lot.cat === "car") {
      const c = lot.car;
      if (forged) {
        c.price = Math.round(c.price * 0.3);
        c.model = `${c.model} (replica)`;
        c.collectible = false;
        extra = "Bad news: it turned out to be a convincing replica.";
      } else if (!lot.col && rnd() < 0.18) {
        c.cond = ri(45, 70);
        extra = "After the gavel, the inspection found hidden problems: it needs work.";
      }
      c.paid = lot.paid;
      state.cars.push(c);
    } else if (lot.cat === "jew") {
      if (forged) {
        lot.item.fake = true;
        lot.item.claim = Math.round(lot.item.claim * 0.05);
        extra = "Bad news: the stones and the hallmarks are fake.";
      }
      (state.jewelry ||= []).push(lot.item);
    } else {
      const p = lot.art;
      if (forged) {
        p.fake = true;
        p.value = Math.round(p.value * (lot.cat === "nft" ? 0 : 0.03));
        extra = lot.cat === "nft" ? "It was a copy-mint: worthless." : "An expert spotted it: it's a forgery.";
      }
      p.paid = lot.paid;
      ART().push(p);
    }
    return extra;
  }

  function sold(youWon) {
    const lot = S.lot;
    const hammer = S.price;
    if (youWon) {
      const premium = Math.round(hammer * lot.premium);
      const shell = S.launder ? Math.round(hammer * 0.2) : 0;
      const total = hammer + premium + shell;
      if (state.money < total) {
        lot.status = "lost";
        return notice("Payment failed", "You couldn't cover the hammer price and the fees. The lot goes to the next bidder.", () => openAuctions(), true);
      }
      state.money -= total;
      lot.paid = hammer;
      const extra = deliver(lot);
      lot.status = "won";
      let cool = "";
      if (S.launder && state.gangLife) {
        const g = state.gangLife;
        const cut = clampN(Math.round(hammer / ifx() / 25000), 3, 20);
        g.heat = Math.max(0, (g.heat || 0) - cut);
        cool = `The shell company washed the money: police heat -${cut}.`;
      }
      if (S.prev && S.prev !== "you") {
        S.prev.st.heat = Math.min(0.3, S.prev.st.heat + 0.06);
        S.prev.st.lost++;
      }
      if (typeof chaChing === "function") chaChing();
      if (typeof renderStats === "function") renderStats();
      sayIt(`I won the ${lot.name} at auction for ${money(total)}.`);
      const rival = S.prev && S.prev !== "you" ? S.prev.r : null;
      const base = shell
        ? TR(`The ${lot.name} is yours for ${money(hammer)} + ${money(premium)} premium + ${money(shell)} shell fee = ${money(total)}.`)
        : TR(`The ${lot.name} is yours for ${money(hammer)} + ${money(premium)} premium = ${money(total)}.`);
      const tail = [
        extra.trim() ? `<span>${extra.trim()}</span>` : "",
        cool.trim() ? `<span>${cool.trim()}</span>` : "",
        S.war ? "<span>What a bidding war.</span>" : "",
        rival ? `${esc(rival.n)} <span>${pick(SULK)}</span>` : "",
      ]
        .filter(Boolean)
        .join(" ");
      return notice("SOLD!", base + (tail ? " " + tail : ""), () => openAuctions(), true);
    }
    lot.status = "lost";
    const w = S.leader.r;
    S.leader.st.beat++;
    sayIt(`I lost the ${lot.name} at auction.`);
    notice(
      "Sold to another bidder",
      TR(`${w.n} (${w.t}) took the ${lot.name} for ${money(hammer)}.`) + ` ${esc(w.n)} <span>${pick(GLOAT)}</span>`,
      () => openAuctions(),
      true,
    );
  }

  // ------------------------------------------------------------------ your collection / selling
  const carValue = (c) => Math.round((c.price || c.base || 0) * (c.collectible ? 1 : 0.6 + (0.4 * (c.cond == null ? 100 : c.cond)) / 100));
  function collection() {
    const out = [];
    for (const c of state.cars || [])
      out.push({ type: "car", ref: c, name: `${c.make} ${c.model}`, img: typeof carImg === "function" ? carImg(c) : `cars/${c.sprite}.png`, est: carValue(c), loan: c.loanYears > 0 });
    for (const j of state.jewelry || [])
      if (j && j.claim > 0 && j.img) out.push({ type: "jew", ref: j, name: j.name, img: `jewelry/${j.img}.png`, est: Math.round(j.claim) });
    for (const p of ART()) out.push({ type: "art", ref: p, name: p.name, img: p.img || ART_IMG, est: Math.round(p.value), unappr: p.unappr, col: p.col });
    return out;
  }

  function simulateSale(est) {
    const picks = shuffle(RIVALS).slice(0, ri(3, 5));
    const maxes = picks.map((r) => ({ r, max: est * (0.7 + 0.55 * rnd()) * (1 + rv(r.id).heat * 0.3) })).sort((a, b) => b.max - a.max);
    const inc = niceInc(est);
    const reserve = est * 0.5;
    if (maxes[0].max < reserve) return { sold: false };
    const second = maxes[1] ? maxes[1].max : reserve;
    const hammer = Math.round(Math.max(reserve, Math.min(maxes[0].max, second + inc)));
    return { sold: true, hammer, winner: maxes[0].r, bidders: picks.length };
  }

  function consign(it) {
    if (it.loan) return notice("Auction House", "Pay off the car loan before you consign it.", () => openAuctions(), true);
    const pv = provenance();
    const base = it.est * pv.mult;
    const res = simulateSale(base);
    snd("choice");
    if (!res.sold) {
      return notice(
        "Reserve not met",
        TR(`${it.name}: nobody reached the reserve. You keep it.`) + (pv.text ? ` <span>${pv.text}</span>` : ""),
        () => openAuctions(),
        true,
      );
    }
    const net = Math.round(res.hammer * 0.88);
    if (it.type === "car") state.cars.splice(state.cars.indexOf(it.ref), 1);
    else if (it.type === "jew") state.jewelry.splice(state.jewelry.indexOf(it.ref), 1);
    else ART().splice(ART().indexOf(it.ref), 1);
    state.money += net;
    if (typeof chaChing === "function") chaChing();
    if (typeof renderStats === "function") renderStats();
    sayIt(`I sold my ${it.name} at auction for ${money(net)}.`);
    notice(
      "SOLD!",
      TR(`${res.winner.n} took the ${it.name} for ${money(res.hammer)}. After the 12% commission you receive ${money(net)}.`) +
        (it.unappr ? ` <span>The house appraised it at ${money(it.est)}.</span>` : "") +
        (pv.text ? ` <span>${pv.text}</span>` : ""),
      () => openAuctions(),
      true,
    );
  }

  // ------------------------------------------------------------------ charity gala
  function gala() {
    const a = A();
    if (a.gala === year()) return notice("Charity gala", "You already attended this year's gala.", () => openAuctions(), true);
    const k = ifx();
    const tiers = [5000, 25000, 100000, 500000].map((n) => Math.round(n * k));
    const choices = tiers
      .filter((n) => state.money >= n)
      .map((n, i) => [
        `Donate ${money(n)}`,
        () => {
          state.money -= n;
          a.gala = year();
          const hap = [3, 5, 8, 12][i];
          if (state.stats) state.stats.Happiness = clampN((Number(state.stats.Happiness) || 50) + hap, 0, 100);
          const f = state.futbol;
          if (f && f.active) f.fame = clampN((f.fame || 0) + [1, 2, 4, 7][i], 0, 100);
          if (i >= 1) ART().push({ id: uid(), kind: "art", name: "Gala donor piece", artist: pick(ARTISTS), img: ART_IMG, value: Math.round(n * 0.4), col: false, fake: false });
          if (typeof renderStats === "function") renderStats();
          sayIt(`I paid ${money(n)} at a charity gala auction.`);
          notice(
            "Charity gala",
            TR("You overpaid on purpose. The room applauds.") +
              (i >= 1 ? " <span>You take home a piece worth about 40% of what you gave.</span>" : "") +
              ` <span>Happiness +${hap}.</span>`,
            () => openAuctions(),
            true,
          );
        },
      ]);
    choices.push(["Leave early", () => openAuctions()]);
    jCard({ tag: "Charity", iconSrc: "emoji/1f3a9.png", title: "Charity Gala", lead: "A black-tie benefit auction. Everybody pays far more than things are worth, and everybody wants to be seen doing it.", choices });
  }

  // ------------------------------------------------------------------ $SILLY, the memecoin that always rugs
  const SILLY = () => (Array.isArray(state.silly) ? state.silly : (state.silly = []));
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const ordinal = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");
  const randomDate = () => `${pick(MONTHS)} ${ordinal(ri(1, 28))}`;

  function sillyCard() {
    const k = ifx();
    const tiers = [1000, 5000, 50000, 250000].map((n) => Math.round(n * k));
    const held = SILLY().reduce((s, p) => s + p.amt, 0);
    const choices = tiers
      .filter((n) => state.money >= n)
      .map((n) => [
        `Ape in with ${money(n)}`,
        () => {
          state.money -= n;
          SILLY().push({ amt: n, year: year() });
          if (typeof renderStats === "function") renderStats();
          sayIt(`I invested ${money(n)} in $SILLY.`);
          notice("$SILLY", `You bought ${money(n)} of $SILLY. The chart is vertical and the group chat is losing it. To the moon.`, () => openAuctions(), true);
        },
      ]);
    choices.push(["Don't be silly", () => openAuctions()]);
    jCard({
      tag: "Memecoin",
      iconSrc: "freelife/penguin1.png",
      title: "$SILLY - Silly Penguin",
      lead: "A cartoon penguin with a crown made of fish. Up 1,240% this week. The whitepaper is one emoji. Not financial advice.",
      rows: [
        ["24h change", "+1,240%"],
        ["Holders", "412,000"],
        ["Dev team", "1 anonymous penguin"],
        ["Your bag", held ? money(held) : "none"],
      ],
      choices,
    });
  }

  function sillyRug() {
    const bags = SILLY().filter((p) => p.year < year());
    if (!bags.length) return;
    state.silly = SILLY().filter((p) => p.year >= year());
    const amt = bags.reduce((s, p) => s + p.amt, 0);
    const date = randomDate();
    sayIt(`My $SILLY investment went to zero.`);
    later(() =>
      jCard({
        tag: "Memecoin",
        iconSrc: "freelife/penguin1.png",
        title: "$SILLY",
        lead: `You invested ${money(amt)} in $SILLY. The developer stopped updating it on ${date}. Your investment is now worth $0.00.`,
        rows: [
          ["Invested", money(amt)],
          ["Change", "-999%"],
          ["Now worth", "$0.00"],
        ],
        choices: [["Ouch", () => {}]],
      }),
    );
  }

  // ------------------------------------------------------------------ screens
  function claimBoard() {
    const a = A();
    if (state.chess && state.chess.champion && !a.board) {
      a.board = true;
      ART().push({ id: uid(), kind: "board", name: "World Championship board", artist: "Chess", img: "emoji/265f-fe0f.png", value: Math.round(150000 * ifx()), col: true, fake: false });
      sayIt("The board from my World Championship match was added to my auction collection.");
    }
  }

  function openAuctions() {
    if (typeof screen === "undefined" || typeof sList === "undefined") return;
    if (state.prison) return notice("Auction House", "You can't attend an auction from prison.", null, true);
    claimBoard();
    const a = ensureLots();
    snd("choice");
    sTitle.textContent = "AUCTIONS";
    if (typeof sSub !== "undefined" && sSub && sSub.style) sSub.style.display = "none";
    sBack.innerHTML = back();
    sBack.onclick = () => typeof openShopping === "function" && openShopping();
    const status = { open: "Open for bids", won: "Won", lost: "Lost", passed: "Withdrawn", withdrawn: "Withdrawn" };
    const col = collection();
    const pv = provenance();
    const rivalRows = RIVALS.filter((r) => rv(r.id).beat || rv(r.id).lost)
      .map((r) => {
        const s = rv(r.id);
        return `<div class="row dis"><img src="emoji/1f528.png" alt=""><div class="t"><b>${esc(r.n)}</b><span>${esc(r.t)} · beat you ${s.beat}x · you beat ${s.lost}x${s.heat >= 0.12 ? " · wants revenge" : ""}</span></div></div>`;
      })
      .join("");
    sList.innerHTML =
      `<div class="sec">${year()} catalogue</div>` +
      a.lots
        .map(
          (l, i) =>
            `<div class="row${l.status === "open" ? "" : " dis"}" data-auc="${i}"><img src="${l.img}" alt=""><div class="t"><b>${esc(l.name)}</b><span>${esc(l.label)} · est. ${money(l.value)} · ${status[l.status] || ""}</span></div>${l.status === "open" ? chev() : ""}</div>`,
        )
        .join("") +
      `<div class="sec">Your collection (sell at auction)</div>` +
      (col.length
        ? col
            .map(
              (c, i) =>
                `<div class="row" data-sell="${i}"><img src="${c.img}" alt=""><div class="t"><b>${esc(c.name)}</b><span>${c.unappr ? "Unappraised" : "est. " + money(c.est)}${c.est && pv.mult > 1.1 ? ` · with provenance ~${money(c.est * pv.mult)}` : ""}</span></div>${chev()}</div>`,
            )
            .join("")
        : `<div class="row dis"><img src="${ART_IMG}" alt=""><div class="t"><b>Nothing to consign</b><span>Cars, jewels and art you own show up here</span></div></div>`) +
      `<div class="sec">Hot tokens</div>` +
      `<div class="row" id="flSilly"><img src="freelife/penguin1.png" alt=""><div class="t"><b>$SILLY - Silly Penguin</b><span>Memecoin · up 1,240% this week${SILLY().length ? ` · your bag: ${money(SILLY().reduce((s, p) => s + p.amt, 0))}` : ""}</span></div>${chev()}</div>` +
      `<div class="sec">Events</div>` +
      `<div class="row" id="flGala"><img src="emoji/1f3a9.png" alt=""><div class="t"><b>Charity gala</b><span>${a.gala === year() ? "Attended this year" : "Pay too much for a good cause"}</span></div>${chev()}</div>` +
      (rivalRows ? `<div class="sec">Rivals</div>${rivalRows}` : "") +
      `<div class="mm-foot" style="padding:10px 14px;text-align:left">New catalogue every year. Buyer's premium 10-25%. Fakes are real: authenticate expensive lots. Collectibles move with the market (and bubbles pop).</div>`;
    sList.querySelectorAll("[data-auc]").forEach((el) => {
      if (el.classList.contains("dis")) return;
      el.onclick = () => {
        const lot = a.lots[Number(el.dataset.auc)];
        if (!lot || lot.status !== "open") return;
        snd("choice");
        startSession(lot);
        bidCard();
      };
    });
    sList.querySelectorAll("[data-sell]").forEach((el) => {
      el.onclick = () => {
        const it = col[Number(el.dataset.sell)];
        if (it) consign(it);
      };
    });
    const g = document.getElementById("flGala");
    if (g) g.onclick = () => gala();
    const sl = document.getElementById("flSilly");
    if (sl) sl.onclick = () => sillyCard();
    sList.scrollTop = 0;
    screen.classList.add("open");
  }

  // ------------------------------------------------------------------ yearly market, bubbles, events
  function appraise(kind) {
    // forgotten painting / garage find: mostly worthless, sometimes a fortune
    const r = rnd();
    const k = ifx();
    const v = kind === "garage"
      ? r < 0.7 ? ri(10, 400) : r < 0.93 ? ri(1500, 20000) : ri(30000, 400000)
      : r < 0.7 ? ri(20, 300) : r < 0.88 ? ri(2000, 40000) : r < 0.97 ? ri(200000, 2000000) : ri(2000000, 20000000);
    return Math.round(v * (v > 1000 ? k : 1));
  }

  function yearlyTick() {
    if (!state || state.dead || (typeof isOldEra === "function" && isOldEra())) return;
    const a = A();
    const y = year();
    // market events
    const r = rnd();
    let artMove = 1 + 0.05 + (rnd() - 0.5) * 0.24;
    let carMove = 1.08;
    if (r < 0.05) {
      artMove *= 0.65;
      carMove = 0.78;
      sayIt("A financial crisis hit the collectibles market: art and hypercars dropped hard.");
    } else if (r < 0.09) {
      artMove *= 0.8;
      sayIt("An art-world scandal dragged auction prices down.");
    } else if (r < 0.14) {
      carMove = 1.25;
      sayIt("A hypercar boom pushed collectible prices up.");
    }
    a.mkt.art = Math.max(0.3, (a.mkt.art || 1) * artMove);
    for (const c of state.cars || []) if (c.collectible) c.price = Math.round(c.price * carMove);
    for (const j of state.jewelry || []) if (j && j.claim >= 900000 * ifx() && !j.fake) j.claim = Math.round(j.claim * (1.05 + (rnd() - 0.5) * 0.06));
    // bubble lifecycle
    const b = a.bubble;
    let factor = 1;
    if (b && b.active) {
      if (y >= b.pop) {
        b.active = false;
        b.done = y;
        factor = 0.02;
        b.mult = 0.02;
        sayIt("The digital-collectibles bubble burst. Everything is worth almost nothing.");
      } else {
        factor = 1.6 + rnd() * 1.0;
        b.mult = (b.mult || 1) * factor;
        if (y === b.start + 1) sayIt("Digital collectibles are going crazy: prices doubled again.");
      }
    } else if (!(b && b.done && y - b.done < 10) && rnd() < 0.05) {
      a.bubble = { active: true, start: y, pop: y + ri(2, 4), mult: 1 };
      sayIt("Everybody is talking about digital collectibles. The auction house is listing them.");
    }
    for (const p of ART()) {
      if (p.kind === "nft") p.value = Math.round(p.value * factor);
      else if (!p.fake) p.value = Math.round(p.value * artMove);
    }
    a.lots = [];
    sillyRug();
    // rare events
    if ((state.age || 0) >= 21 && rnd() < 0.02) later(() => atticEvent());
    if ((state.age || 0) >= 16 && rnd() < 0.03) later(() => garageEvent());
    if (state.job && state.job.judge && rnd() < 0.12) later(() => judgeEvent());
    if (typeof renderStats === "function") renderStats();
  }

  function atticEvent() {
    const p = { id: uid(), kind: "art", name: "Painting from the attic", artist: "Unknown", img: ART_IMG, value: appraise("attic"), col: true, fake: false, unappr: true };
    ART().push(p);
    sayIt("A distant relative left me a painting in the attic.");
    notice("A painting in the attic", "A distant relative left you an old painting. Nobody knows if it's a masterpiece or a flea-market special. Take it to the Auction House for an appraisal.", null, true);
  }
  function garageEvent() {
    const p = { id: uid(), kind: "art", name: "Garage sale find", artist: "Unknown", img: ART_IMG, value: appraise("garage"), col: true, fake: false, unappr: true };
    ART().push(p);
    sayIt("I found something odd at a garage sale.");
    notice("Garage sale find", "You bought a strange old piece for a few dollars. The Auction House can tell you what it's really worth.", null, true);
  }
  function judgeEvent() {
    const value = Math.round(ri(40000, 250000) * ifx());
    jCard({
      tag: "Court",
      iconSrc: ART_IMG,
      title: "A very generous litigant",
      lead: "A litigant in front of your bench sends a painting to your chambers 'as a gift'. It is worth a fortune and it is obviously not a gift.",
      rows: [["Painting value", money(value)]],
      choices: [
        [
          "Accept the painting",
          () => {
            ART().push({ id: uid(), kind: "art", name: "The generous gift", artist: pick(ARTISTS), img: ART_IMG, value, col: true, fake: false, bribe: true });
            sayIt("I accepted a painting from a litigant.");
            if (rnd() < 0.25) {
              if (state.stats) state.stats.Happiness = clampN((Number(state.stats.Happiness) || 50) - 12, 0, 100);
              notice("Scandal", "A reporter noticed the painting. The press is asking questions and your nights are no longer calm.", null, true);
            }
            if (typeof renderStats === "function") renderStats();
          },
        ],
        ["Send it back", () => sayIt("I returned a painting a litigant tried to give me.")],
      ],
    });
  }

  // ------------------------------------------------------------------ death: the family auctions the estate
  function estate() {
    const a = A();
    if (a.estateDone) return null;
    a.estateDone = true;
    const items = collection().filter((c) => !c.loan);
    if (!items.length) return null;
    const pv = provenance();
    let total = 0;
    for (const it of items) total += it.est * pv.mult * 0.85 * 0.9;
    total = Math.round(total);
    state.money += total;
    return { total, n: items.length, pv };
  }

  const origDie = window.die;
  if (typeof origDie === "function") {
    window.die = function () {
      const r = origDie.apply(this, arguments);
      try {
        if (state.dead) {
          const e = estate();
          if (e && typeof log !== "undefined" && log.lastElementChild) {
            log.lastElementChild.insertAdjacentHTML(
              "beforeend",
              `<p>My family put ${e.n} of my things up for auction and raised ${money(e.total)}.${e.pv.mult > 1.1 ? " My name made everything sell for more." : ""}</p>`,
            );
          }
        }
      } catch (err) {
        console.warn("[auctions] estate", err);
      }
      return r;
    };
  }

  // ------------------------------------------------------------------ hooks
  function addShoppingRow() {
    if (typeof sList === "undefined" || (typeof isOldEra === "function" && isOldEra())) return;
    if (document.getElementById("flAucRow")) return;
    const locked = (state.age || 0) < 18;
    const n = locked ? 0 : ensureLots().lots.filter((l) => l.status === "open").length;
    sList.insertAdjacentHTML(
      "beforeend",
      `<div class="sec">Auctions</div><div class="row${locked ? " dis" : ""}" id="flAucRow"><img src="emoji/1f528.png" alt=""><div class="t"><b>Auction House</b><span>${locked ? "You must be 18 to bid" : `${n} lots this year · bid, sell, invest`}</span></div>${locked ? "" : chev()}</div>`,
    );
    const row = document.getElementById("flAucRow");
    if (row && !locked) row.onclick = () => openAuctions();
  }

  const shopping = window.openShopping;
  if (typeof shopping === "function") {
    window.openShopping = function () {
      const result = shopping.apply(this, arguments);
      try {
        if (typeof sTitle !== "undefined" && sTitle.textContent === "SHOPPING") addShoppingRow();
      } catch (e) {
        console.warn("[auctions] shopping", e);
      }
      return result;
    };
  }

  const ageBtn = document.getElementById("ageBtn");
  if (ageBtn)
    ageBtn.addEventListener("click", () => {
      try {
        yearlyTick();
      } catch (e) {
        console.warn("[auctions] year", e);
      }
    });

  window.FL_AUCTIONS_API = { open: openAuctions, lots: () => ensureLots().lots, tick: yearlyTick, estate };
})();
