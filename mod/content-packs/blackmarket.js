/* [mod] Black Market for NaBlooLife (local mod).
 *
 * Activities -> Black Market (18+). Four dealers with their own stock, drawn from the art in blackmarket/
 * (cut from GRIDS/BLACK MARKET*.png with _art-src/split_grid.py):
 *   Antique Peddler, Arms Dealer, Art Thief and Jewel Fencer.
 * Ideas taken from the original: each dealer has an attitude toward you (affects prices and haggling), goods can be
 * fakes until you pay for an appraisal, and everything here is contraband, so the police can raid you.
 * It ties into Rich Life: buying raises your police heat, and a high heat makes raids more likely.
 *
 * State: state.bmarket = { att:{vendor:0-100}, stock:{vendor:{age,list}}, items:[...], raidAge }.
 * Debug: FL_BM.open(), FL_BM.state(), FL_BM.raid(true), FL_BM.tick().
 */
(() => {
  "use strict";
  if (window.FL_BM) return;

  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const cl = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const warn = (w, e) => console.warn("[blackmarket] " + w, e);
  const usdf = (n) => {
    try {
      return usd(n);
    } catch {
      return "$" + Math.round(n).toLocaleString("en-US");
    }
  };
  const img = (f) => `blackmarket/${f}.png`;

  // ------------------------------------------------------------------ catalog
  const VENDORS = {
    antique: { name: "Antique Peddler", blurb: "Old things with a story. Some of it is true.", fake: 0.25, icon: "bm-07-oni-mask", stolen: true },
    arms: { name: "Arms Dealer", blurb: "Blades and pieces, no questions and no receipts.", fake: 0.08, icon: "bm-05-dragon-pistol", stolen: false },
    art: { name: "Art Thief", blurb: "Museum pieces that were never supposed to leave.", fake: 0.35, icon: "bm-04-royal-crown", stolen: true },
    jewel: { name: "Jewel Fencer", blurb: "Watches, chains and bags with a very flexible past.", fake: 0.3, icon: "bm-02-rolex-submariner", stolen: true },
  };
  // [file, name, vendor, true value, weapon?]
  const CAT = [
    ["bm-01-katana-black", "Black Lacquer Katana", "antique", 6000, true],
    ["bm-07-oni-mask", "Oni Samurai Mask", "antique", 5000],
    ["bm-12-knight-helmet", "Knight's Helmet", "antique", 28000],
    ["bm-09-roman-bust", "Marble Roman Bust", "antique", 150000],
    ["bm-05-dragon-pistol", "Gilded Dragon Pistol", "arms", 24000, true],
    ["bm-11-dragon-nunchucks", "Dragon Nunchucks", "arms", 900, true],
    ["bm-13-katana-gold-dragon", "Gold Dragon Katana", "arms", 14000, true],
    ["bm-19-karambit", "Galaxy Karambit", "arms", 1800, true],
    ["bm-24-diamond-glock", "Diamond Pistol", "arms", 60000, true],
    ["bm-04-royal-crown", "Royal Crown", "art", 2800000],
    ["bm-16-pharaoh-mask", "Pharaoh's Death Mask", "art", 6500000],
    ["bm-23-diamond-crown", "Diamond Crown", "art", 9000000],
    ["bm-22-dragon-statue", "Golden Dragon Statue", "art", 120000],
    ["bm-02-rolex-submariner", "Rolex Submariner, Black Dial", "jewel", 16000],
    ["bm-14-rolex-submariner-steel", "Rolex Submariner, Steel", "jewel", 15000],
    ["bm-03-jesus-piece-chain", "Gold Jesus Piece Chain", "jewel", 90000],
    ["bm-15-panther-chain", "Panther Pendant Chain", "jewel", 130000],
    ["bm-18-diamond-cross-chain", "Diamond Cross Chain", "jewel", 210000],
    ["bm-06-ap-diamond-watch", "Royal Oak, Diamond Set", "jewel", 480000],
    ["bm-17-ap-royal-oak", "Royal Oak, Steel", "jewel", 65000],
    ["bm-20-patek-nautilus-gold", "Patek Philippe Nautilus, Gold", "jewel", 520000],
    ["bm-10-scorpion-ring", "Scorpion Signet Ring", "jewel", 70000],
    ["bm-08-lv-duffel-brown", "Louis Vuitton Duffel, Monogram", "jewel", 4500],
    ["bm-21-lv-duffel-black", "Louis Vuitton Duffel, Eclipse", "jewel", 5500],
  ].map(([file, name, vendor, value, weapon]) => ({ file, name, vendor, value, weapon: !!weapon }));
  const BY_FILE = Object.fromEntries(CAT.map((c) => [c.file, c]));

  // ------------------------------------------------------------------ state
  const S = () => {
    if (!state.bmarket || typeof state.bmarket !== "object") state.bmarket = {};
    const b = state.bmarket;
    b.att ||= {};
    for (const v of Object.keys(VENDORS)) b.att[v] ??= 50;
    b.stock ||= {};
    b.items ||= [];
    b.raidAge ??= -9;
    b.tickAge ??= -1;
    return b;
  };
  const enabled = () => !state.dead && state.era !== "1800s" && state.age >= 18;
  const bank = () => (typeof bankTotal === "function" ? bankTotal() : Number(state.money) || 0);
  const refresh = () => {
    try {
      renderStats();
    } catch {}
  };
  const spend = (n) => {
    n = Math.round(n);
    if (n <= 0) return true;
    if (bank() < n) return false;
    let left = n;
    const cash = Math.min(Number(state.money) || 0, left);
    state.money -= cash;
    left -= cash;
    for (const a of state.bankAccts || []) {
      if (left <= 0) break;
      const t = Math.min(a.bal || 0, left);
      a.bal -= t;
      left -= t;
    }
    refresh();
    return true;
  };
  const note = (t, m, cb) => notice(t, m, cb || null, true);
  const logLine = (s) => {
    try {
      say(s);
    } catch {}
  };
  const heat = (d) => {
    try {
      if (window.FL_RICH) {
        const r = FL_RICH.state();
        r.heat = cl((r.heat || 0) + d);
      }
    } catch {}
  };
  const heatNow = () => {
    try {
      return window.FL_RICH ? FL_RICH.state().heat || 0 : 0;
    } catch {
      return 0;
    }
  };
  const attLabel = (a) => (a >= 70 ? "Friendly" : a >= 40 ? "Neutral" : a >= 20 ? "Cold" : "Hostile");
  const trueValue = (it) => Math.round(it.fake ? it.base * 0.04 : it.value);

  // ------------------------------------------------------------------ stock
  function restock(v, force) {
    const b = S();
    const cur = b.stock[v];
    if (cur && cur.age === state.age && !force) return cur;
    const owned = new Set(b.items.map((i) => i.file));
    const pool = CAT.filter((c) => c.vendor === v && !owned.has(c.file));
    const n = Math.min(pool.length, ri(3, 4));
    const list = pool
      .sort(() => rnd() - 0.5)
      .slice(0, n)
      .map((c) => {
        const att = b.att[v];
        const ask = Math.round((c.value * (0.62 + rnd() * 0.25) * (1.15 - att / 333)) / 10) * 10;
        const fake = rnd() < VENDORS[v].fake * (1 - att / 150);
        return { file: c.file, ask: Math.max(50, ask), fake, hag: false };
      });
    b.stock[v] = { age: state.age, list };
    return b.stock[v];
  }

  // ------------------------------------------------------------------ screens
  const chev = () => (typeof CHEV !== "undefined" ? CHEV : "");
  const row = (data, ic, t, s) =>
    `<div class="row" ${data}><img src="${ic}" alt="" style="object-fit:contain"><div class="t"><b>${esc(t)}</b><span>${s}</span></div>${chev()}</div>`;
  const openScreen = (title, back, html) => {
    sTitle.textContent = title;
    if (typeof sSub !== "undefined" && sSub && sSub.style) sSub.style.display = "none";
    sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;";
    sBack.onclick = back;
    sList.innerHTML = html;
    sList.scrollTop = 0;
    screen.classList.add("open");
  };
  const card = (o) => {
    try {
      jCard({ tag: "Black Market", ...o });
    } catch (e) {
      warn("card", e);
    }
  };

  function openBM() {
    if (typeof screen === "undefined" || typeof sList === "undefined") return;
    const b = S();
    let h = `<div class="sec">Dealers</div>`;
    for (const [k, v] of Object.entries(VENDORS)) {
      const a = b.att[k];
      h += row(`data-bm="v:${k}"`, img(v.icon), v.name, `${esc(v.blurb)}<br><i>Attitude: ${attLabel(a)}</i>`);
    }
    const total = b.items.reduce((s, i) => s + (i.appraised ? trueValue(i) : 0), 0);
    h += `<div class="sec">You</div>`;
    h += row(`data-bm="mine"`, img("bm-21-lv-duffel-black"), "Your collection", `${b.items.length} item${b.items.length === 1 ? "" : "s"}${total ? ` · ${usdf(total)} appraised` : ""}`);
    h += `<div class="mm-foot" style="padding:10px 14px;text-align:left">Everything here is stolen, smuggled or both. Fakes are common, and the police can raid you.</div>`;
    openScreen("BLACK MARKET", () => (typeof openActivities === "function" ? openActivities() : screen.classList.remove("open")), h);
    sList.querySelectorAll("[data-bm]").forEach((el) => {
      const k = el.dataset.bm;
      el.onclick = () => (k === "mine" ? openMine() : openVendor(k.slice(2)));
    });
  }

  function openVendor(v) {
    const b = S();
    const st = restock(v);
    const V = VENDORS[v];
    let h = `<div class="sec">${esc(V.name)}</div><div class="row dis sm"><div class="t"><b style="font-weight:600">Attitude: ${attLabel(b.att[v])}</b><span>${esc(V.blurb)}</span></div></div><div class="sec">For sale</div>`;
    if (!st.list.length) h += `<div class="row dis"><div class="t"><b>Nothing left</b><span>Come back next year.</span></div></div>`;
    st.list.forEach((s, i) => {
      const c = BY_FILE[s.file];
      h += row(`data-bm="${i}"`, img(s.file), c.name, `${usdf(s.ask)}${s.hag ? " · haggled" : ""}`);
    });
    openScreen(V.name.toUpperCase(), openBM, h);
    sList.querySelectorAll("[data-bm]").forEach((el) => (el.onclick = () => offerCard(v, +el.dataset.bm)));
  }

  function offerCard(v, i) {
    const b = S();
    const st = restock(v);
    const s = st.list[i];
    if (!s) return openVendor(v);
    const c = BY_FILE[s.file];
    const choices = [
      [
        "Buy it",
        () => {
          if (!spend(s.ask)) {
            note("Not enough money", "You cannot cover that right now.", () => openVendor(v));
            return;
          }
          b.items.push({ file: s.file, vendor: v, paid: s.ask, base: c.value, value: c.value, fake: s.fake, appraised: false, age: state.age, weapon: c.weapon });
          st.list.splice(i, 1);
          b.att[v] = cl(b.att[v] + 3);
          heat(c.weapon ? 6 : 3);
          logLine(`I bought a ${c.name.toLowerCase()} on the black market.`);
          note("Deal done", "It changes hands in a parking garage. Nobody says a word.", () => openVendor(v));
        },
      ],
    ];
    if (!s.hag)
      choices.push([
        "Haggle",
        () => {
          s.hag = true;
          if (rnd() < 0.25 + (b.att[v] / 100) * 0.5) {
            s.ask = Math.round((s.ask * 0.85) / 10) * 10;
            b.att[v] = cl(b.att[v] + 4);
            note("He gives in", "The dealer grumbles, then knocks something off the price.", () => offerCard(v, i));
          } else {
            b.att[v] = cl(b.att[v] - 8);
            if (rnd() < 0.35) {
              st.list.splice(i, 1);
              note("Insulted", "The dealer takes the piece back. It is not for sale to you anymore.", () => openVendor(v));
            } else note("No discount", "He does not like being pushed. The price stays.", () => offerCard(v, i));
          }
        },
        "gray",
      ]);
    choices.push(["Walk away", () => openVendor(v), "gray"]);
    card({
      iconSrc: img(s.file),
      title: c.name,
      lead: "The dealer swears it is the real thing. He would say that either way.",
      rows: [
        ["Price", usdf(s.ask)],
        ["Attitude", attLabel(b.att[v])],
        ["Bank", usdf(bank())],
      ],
      choices,
    });
  }

  function openMine() {
    const b = S();
    let h = `<div class="sec">Your collection</div>`;
    if (!b.items.length) h += `<div class="row dis"><div class="t"><b>Nothing yet</b><span>Buy something from a dealer.</span></div></div>`;
    b.items.forEach((it, i) => {
      const c = BY_FILE[it.file];
      h += row(`data-bm="${i}"`, img(it.file), c.name, it.appraised ? `${it.fake ? "Fake" : "Authentic"} · worth ${usdf(trueValue(it))}` : `Paid ${usdf(it.paid)} · not appraised`);
    });
    openScreen("YOUR COLLECTION", openBM, h);
    sList.querySelectorAll("[data-bm]").forEach((el) => (el.onclick = () => itemCard(+el.dataset.bm)));
  }

  function itemCard(i) {
    const b = S();
    const it = b.items[i];
    if (!it) return openMine();
    const c = BY_FILE[it.file];
    const fee = Math.max(150, Math.round(it.base * 0.04));
    const offer = () => Math.round(trueValue(it) * (0.3 + rnd() * 0.12 + b.att[it.vendor] / 1000));
    const choices = [];
    if (!it.appraised)
      choices.push([
        "Get it appraised",
        () => {
          if (!spend(fee)) return note("Not enough money", "You cannot cover that right now.", () => itemCard(i));
          it.appraised = true;
          if (it.fake) {
            logLine("An appraiser told me my black market purchase was a fake.");
            note("It is a fake", "The expert smiles politely. It is a convincing copy, and worth almost nothing.", () => itemCard(i));
          } else note("It is real", "The appraiser confirms the real thing. Keep it somewhere safe.", () => itemCard(i));
        },
      ]);
    choices.push([
      "Sell to a fence",
      () => {
        const o = offer();
        card({
          iconSrc: img(it.file),
          title: "The fence's offer",
          lead: it.appraised || !it.fake ? "He looks it over twice and names a number." : "He laughs, then names a number. It is lower than you hoped.",
          rows: [
            ["Offer", usdf(o)],
            ["You paid", usdf(it.paid)],
          ],
          choices: [
            [
              "Take the money",
              () => {
                state.money += o;
                refresh();
                b.items.splice(i, 1);
                b.att[it.vendor] = cl(b.att[it.vendor] + 1);
                logLine(`I sold a ${c.name.toLowerCase()} to a fence.`);
                openMine();
              },
            ],
            ["Keep it", () => itemCard(i), "gray"],
          ],
        });
      },
    ]);
    choices.push(["Back", () => openMine(), "gray"]);
    card({
      iconSrc: img(it.file),
      title: c.name,
      lead: it.weapon ? "Illegal to own, and you know it." : "Stolen, smuggled or both. You know it.",
      rows: [
        ["You paid", usdf(it.paid)],
        ["Status", it.appraised ? (it.fake ? "Fake" : "Authentic") : "Not appraised"],
        ["Worth", it.appraised ? usdf(trueValue(it)) : "Unknown"],
      ],
      choices,
    });
  }

  // ------------------------------------------------------------------ yearly: values, attitudes, raids
  function raid(force) {
    const b = S();
    if (!b.items.length) return;
    const total = b.items.reduce((s, i) => s + trueValue(i), 0);
    const fee = Math.max(2000, Math.round(total * 0.25));
    const lawyer = Math.max(3000, Math.round(total * 0.05));
    b.raidAge = state.age;
    const lose = (arrestChance) => {
      const n = b.items.length;
      b.items = [];
      b.att.antique = cl(b.att.antique - 10);
      for (const v of Object.keys(VENDORS)) b.att[v] = cl(b.att[v] - 5);
      logLine("The police raided my house and took everything I bought on the black market.");
      if (typeof arrest === "function" && rnd() < arrestChance) arrest("possession of stolen property", [1, 4]);
      return n;
    };
    card({
      iconSrc: "emoji/1f6a8.png",
      title: "Police raid",
      lead: "Officers show up with a warrant. They have been told what you keep in the house.",
      rows: [
        ["Items at risk", String(b.items.length)],
        ["Value", usdf(total)],
        ["Bribe", usdf(fee)],
        ["Lawyer", usdf(lawyer)],
      ],
      choices: [
        [
          "Bribe the officers",
          () => {
            if (!spend(fee)) {
              note("Not enough money", "You do not have enough to make this go away.");
              lose(0.5);
              return;
            }
            if (rnd() < 0.7) {
              heat(-5);
              note("They look away", "The officers find nothing worth writing down.");
            } else {
              note("Wrong cop", "One of them was not for sale. They take it all.");
              lose(0.7);
            }
          },
        ],
        [
          "Call your lawyer",
          () => {
            if (!spend(lawyer)) {
              note("Not enough money", "You cannot cover that right now.");
              lose(0.5);
              return;
            }
            if (rnd() < 0.6) note("Thrown out", "Your lawyer finds a hole in the warrant. The case dies in court.");
            else {
              note("It sticks", "The warrant holds. They take everything.");
              lose(0.4);
            }
          },
        ],
        [
          "Hand it over",
          () => {
            lose(total > 200000 ? 0.5 : 0.2);
          },
          "gray",
        ],
      ],
    });
  }

  function tick() {
    if (!enabled()) return;
    const b = S();
    if (b.tickAge === state.age) return;
    b.tickAge = state.age;
    for (const v of Object.keys(VENDORS)) b.att[v] = cl(b.att[v] + (b.att[v] > 50 ? -2 : b.att[v] < 50 ? 2 : 0));
    for (const it of b.items) if (!it.fake) it.value = Math.round(it.value * (1 + ri(-4, 9) / 100));
    if (b.items.length && state.age - b.raidAge >= 4) {
      const risk = 0.01 + 0.01 * Math.min(6, b.items.length) + heatNow() / 600 + (b.items.some((i) => i.weapon) ? 0.015 : 0);
      if (rnd() < risk) setTimeout(() => (typeof whenClear === "function" ? whenClear(() => raid(false)) : raid(false)), 1800);
    }
  }

  // ------------------------------------------------------------------ boot
  function boot() {
    if (typeof state === "undefined" || typeof openActivities !== "function" || typeof jCard !== "function" || !document.getElementById("ageBtn") || typeof sList === "undefined") return setTimeout(boot, 150);
    const origAct = window.openActivities;
    window.openActivities = function () {
      const r = origAct.apply(this, arguments);
      try {
        if (enabled() && sTitle.textContent === "ACTIVITIES" && !document.getElementById("flBmRow")) {
          const n = S().items.length;
          const html = `<div class="row" id="flBmRow"><img src="${img("bm-07-oni-mask")}" alt="" style="object-fit:contain"><div class="t"><b>Black Market</b><span>${n ? `${n} item${n === 1 ? "" : "s"} in your collection · ` : ""}Dealers, loot and no receipts</span></div>${chev()}</div>`;
          const sur = document.getElementById("actSurrender");
          if (sur) sur.insertAdjacentHTML("beforebegin", html);
          else sList.insertAdjacentHTML("beforeend", html);
          document.getElementById("flBmRow").onclick = openBM;
        }
      } catch (e) {
        warn("activities", e);
      }
      return r;
    };
    document.getElementById("ageBtn").addEventListener("click", () =>
      setTimeout(() => {
        try {
          tick();
        } catch (e) {
          warn("tick", e);
        }
      }, 900),
    );
    console.log("[blackmarket] loaded");
  }
  window.FL_BM = { open: openBM, state: S, raid, tick, restock, CAT, VENDORS, offerCard, itemCard };
  boot();
})();
