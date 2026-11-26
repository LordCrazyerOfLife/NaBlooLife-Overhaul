/* [mod] Adoption agency for NaBlooLife (local mod).
 *
 * Replaces the game's adoption popup (huge faces, "Flat broke" popping up over and over) with a menu:
 * Activities -> Adoption lists children waiting at the agency, each with an age, a nationality, a short
 * background, a personality and a price. Filter by age group, open a child to see the details, adopt with your
 * surname or keep the birth surname, or ask the agency for a new batch.
 *
 * Origins change the price and how fast the child trusts you: a relative who could not keep them (cheap, warm),
 * domestic foster care (cheap, guarded), a domestic newborn (expensive), an international children's home
 * (expensive, and the older the child the more time it takes to bond).
 *
 * State: state.adoptPool = { year, kids[] } (JSON only). Adopted kids are added to state.family like the base game
 * does (kind "child", adopted: true) plus adoptedFrom / nat.
 * API: FL_ADOPT.open(), FL_ADOPT.pool().
 */
(() => {
  "use strict";
  if (window.FL_ADOPT) return;

  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const cl = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ifx = () => (typeof window.inflFx === "function" ? window.inflFx() : 1);
  const price = (n) => Math.max(1, Math.round((typeof localPrice === "function" ? localPrice(n) : n) * ifx()));
  const money = (n) => (typeof usd === "function" ? usd(Math.round(n)) : "$" + Math.round(n).toLocaleString("en-US"));
  const chev = () => (typeof CHEV !== "undefined" ? CHEV : "");
  const snd = (n) => {
    try {
      typeof play === "function" && play(n);
    } catch {}
  };

  // ------------------------------------------------------------------ where children come from
  const GROUPS = {
    af: "dz ao bj bw bf bi cm cv cf td km cd cg ci dj eg gq er sz et ga gm gh gn gw ke ls lr ly mg mw ml mr mu ma mz na ne ng rw st sn sc sl so za ss sd tz tg tn ug zm zw",
    ea: "cn jp kr kp mn tw hk mo vn th la kh mm my sg id ph bn tl",
    sa: "in pk bd lk np bt mv af",
    me: "sa ae qa kw bh om ye iq ir sy jo lb il tr ps",
    la: "mx gt hn sv ni cr pa co ve ec pe bo br py uy ar cl cu do ht jm tt bb bs bz gy sr",
  };
  const groupOf = (code) => {
    for (const g in GROUPS) if (GROUPS[g].split(" ").includes(code)) return g;
    return "eu";
  };
  const LOOK = {
    af: { skin: ["#8a5a3a", "#5e3d27", "#b97c50", "#5e3d27"], hair: ["#2a201b"], eyes: ["#4a2c17", "#6b4226"] },
    ea: { skin: ["#f6d3b3", "#eebd94", "#d9a274"], hair: ["#2a201b"], eyes: ["#4a2c17", "#6b4226"] },
    sa: { skin: ["#d9a274", "#b97c50", "#8a5a3a"], hair: ["#2a201b", "#3a2a1f"], eyes: ["#4a2c17", "#6b4226"] },
    me: { skin: ["#eebd94", "#d9a274", "#b97c50"], hair: ["#2a201b", "#3a2a1f", "#5b3a22"], eyes: ["#4a2c17", "#6b4226", "#8a6a3a"] },
    la: { skin: ["#eebd94", "#d9a274", "#b97c50", "#f6d3b3"], hair: ["#2a201b", "#5b3a22"], eyes: ["#6b4226", "#4a2c17", "#8a6a3a"] },
    eu: { skin: ["#f6d3b3", "#eebd94", "#d9a274", "#f6d3b3"], hair: ["#2a201b", "#5b3a22", "#8a5a2c", "#d8b26a", "#a8471f"], eyes: ["#6b4226", "#3f7fbf", "#4f8a4b", "#8a6a3a", "#5b6b7a"] },
  };
  const TRAITS = [
    ["Curious", { sm: 12 }, "Asks why about everything."],
    ["Shy", { sm: 4 }, "Takes time to open up, then it is all in."],
    ["Energetic", { lk: 4 }, "Cannot sit still for ten minutes."],
    ["Artistic", { lk: 6 }, "Draws on everything, walls included."],
    ["Athletic", { lk: 8 }, "Lives for any game with a ball."],
    ["Gentle", { sm: 4, lk: 4 }, "Gives away half of every snack."],
    ["Stubborn", {}, "Has opinions, and shares them."],
    ["Funny", { lk: 5 }, "Always has a joke ready."],
    ["Bookish", { sm: 15 }, "Reads under the covers with a flashlight."],
    ["Fearless", { lk: 2 }, "Has a lot of band-aids and no regrets."],
  ];
  const ORIGINS = {
    relative: { n: "A relative could not keep them", base: 1200, rel: [62, 88], story: (k) => `${k.first} lived with family who could no longer care for them. A familiar face would mean a lot.` },
    foster: { n: "Foster care", base: 2500, rel: [40, 75], story: (k) => `${k.first} has moved between foster homes and has learned not to get too comfortable. They need stability more than anything.` },
    infant: { n: "Private domestic adoption", base: 24000, rel: [78, 100], story: (k) => `${k.first} was placed with the agency at birth. A birth family chose adoption and asked for a loving home.` },
    home: { n: "Children's home abroad", base: 19000, rel: [45, 80], story: (k) => `${k.first} grew up in a children's home in ${k.cn}. A new country, a new language and a new family are a lot to take in, and it takes time.` },
  };

  // ------------------------------------------------------------------ state and pool
  const homeName = () => state.country || "United States";
  const countries = () => Object.entries(window.COUNTRIES || {}).map(([code, v]) => ({ code, name: v[0] }));
  const codeOf = (name) => {
    const c = countries().find((x) => x.name === name);
    return c ? c.code : "";
  };
  const ageGroup = (a) => (a <= 2 ? "baby" : a <= 12 ? "child" : "teen");
  const pickAge = () => {
    const r = rnd();
    return r < 0.2 ? ri(0, 2) : r < 0.5 ? ri(3, 7) : r < 0.75 ? ri(8, 12) : ri(13, 17);
  };
  const costOf = (k) => {
    const o = ORIGINS[k.origin];
    const young = k.age <= 2 ? 1.25 : k.age >= 13 ? 0.8 : 1;
    return price(Math.round(o.base * young));
  };
  function makeKid(id) {
    const g = rnd() < 0.5 ? "f" : "m";
    const age = pickAge();
    const home = homeName();
    const intl = rnd() < 0.5;
    const all = countries();
    const dest = intl && all.length ? pick(all.filter((c) => c.name !== home)) : null;
    const cn = dest ? dest.name : home;
    const code = dest ? dest.code : codeOf(home);
    const origin = dest ? "home" : age <= 1 && rnd() < 0.6 ? "infant" : rnd() < 0.25 ? "relative" : "foster";
    let first = "Sam";
    let last = "Doe";
    try {
      first = uname(g, cn);
      last = ulast(cn);
    } catch {
      try {
        first = uname(g);
        last = ulast();
      } catch {}
    }
    const L = LOOK[groupOf(code)] || LOOK.eu;
    const look = typeof randomLook === "function" ? randomLook(g, age) : {};
    look.skin = pick(L.skin);
    look.hair = pick(L.hair);
    look.eyes = pick(L.eyes);
    const tr = TRAITS[ri(0, TRAITS.length - 1)];
    const o = ORIGINS[origin];
    const guard = age >= 8 && (origin === "home" || origin === "foster") ? -ri(5, 15) : 0; // older children bond slower
    const kid = {
      id,
      g,
      age,
      first,
      last,
      cn,
      code,
      origin,
      trait: tr[0],
      traitNote: tr[2],
      smarts: cl(ri(25, 85) + (tr[1].sm || 0)),
      looks: cl(ri(25, 85) + (tr[1].lk || 0)),
      rel: cl(ri(o.rel[0], o.rel[1]) + guard),
      look,
    };
    kid.story = o.story(kid);
    return kid;
  }
  function pool(force) {
    let p = state.adoptPool;
    if (force || !p || !Array.isArray(p.kids) || p.year !== state.age) {
      p = state.adoptPool = { year: state.age, seq: 0, kids: [] };
      for (let i = 0; i < 10; i++) p.kids.push(makeKid(++p.seq));
      p.kids.sort((a, b) => a.age - b.age);
    }
    return p;
  }

  // ------------------------------------------------------------------ screens
  let filter = "all";
  const FILTERS = [["all", "All"], ["baby", "Babies"], ["child", "Kids"], ["teen", "Teens"]];
  const faceUrl = (k) => {
    try {
      return npcFace(k.look, k.g, k.age, "happy", "").toDataURL("image/png");
    } catch {
      return "emoji/1f9f8.png";
    }
  };
  const kidLine = (k) => `${k.age} year${k.age === 1 ? "" : "s"} old · ${k.g === "f" ? "girl" : "boy"} · ${esc(k.trait)}`;

  function openAgency() {
    if (typeof screen === "undefined" || typeof sList === "undefined") return;
    if (state.age < 21) return notice("Too young", "You must be at least 21 years old to adopt a child.", null, true);
    if (state.prison) return notice("Not possible", "The agency will not work with someone in prison.", null, true);
    const p = pool();
    snd("choice");
    sTitle.textContent = "ADOPTION";
    if (typeof sSub !== "undefined" && sSub && sSub.style) sSub.style.display = "none";
    sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;";
    sBack.onclick = () => (typeof openActivities === "function" ? openActivities() : screen.classList.remove("open"));
    const list = p.kids.filter((k) => filter === "all" || ageGroup(k.age) === filter);
    const chips = FILTERS.map(([id, label]) => `<b data-f="${id}" style="display:inline-block;padding:7px 12px;margin:0 6px 6px 0;border-radius:16px;cursor:pointer;font-size:13px;background:${filter === id ? "#4da3ff" : "#0002"};color:${filter === id ? "#fff" : "inherit"}">${label}</b>`).join("");
    let h =
      `<div class="sec">Adoption agency</div><div class="row" style="flex-direction:column;align-items:stretch;height:auto;padding:10px 14px"><span style="font-size:13px;opacity:.8">These children are waiting for a family. Tap one to read their story. The agency refreshes its list every year.</span><div style="margin-top:8px">${chips}</div><span style="font-size:12px;opacity:.7">Your money: ${money(state.money)}</span></div>` +
      `<div class="sec">Children waiting${list.length ? ` (${list.length})` : ""}</div>`;
    if (!list.length) h += `<div class="row dis"><div class="t"><b>Nobody in this group right now</b><span>Try another age group or ask for a new batch.</span></div></div>`;
    h += list
      .map((k) => `<div class="row" data-k="${k.id}"><span class="adf" data-k="${k.id}" style="width:56px;height:56px;flex:none;margin-right:10px;border-radius:50%;overflow:hidden;display:inline-block"></span><div class="t"><b>${esc(k.first)} ${esc(k.last)}</b><span>${kidLine(k)}<br>${k.code ? `<img src="flags/${esc(k.code)}.png" alt="" style="width:16px;height:12px;vertical-align:-1px;margin-right:4px">` : ""}${esc(k.cn)} · ${money(costOf(k))}</span></div>${chev()}</div>`)
      .join("");
    h += `<div class="row" id="adNew"><img src="emoji/1f504.png" alt="" style="object-fit:contain"><div class="t"><b>Ask for a new batch</b><span>See different children</span></div>${chev()}</div>`;
    sList.innerHTML = h;
    sList.querySelectorAll(".adf").forEach((el) => {
      const k = p.kids.find((x) => String(x.id) === el.dataset.k);
      if (!k) return;
      try {
        const c = npcFace(k.look, k.g, k.age, "happy", "");
        c.style.width = c.style.height = "56px";
        c.style.display = "block";
        el.appendChild(c);
      } catch {}
    });
    sList.querySelectorAll("[data-f]").forEach((el) => (el.onclick = () => ((filter = el.dataset.f), openAgency())));
    sList.querySelectorAll(".row[data-k]").forEach((el) => (el.onclick = () => kidCard(Number(el.dataset.k))));
    const nb = document.getElementById("adNew");
    if (nb) nb.onclick = () => (pool(true), openAgency());
    sList.scrollTop = 0;
    screen.classList.add("open");
  }

  function kidCard(id) {
    const p = pool();
    const k = p.kids.find((x) => x.id === id);
    if (!k) return openAgency();
    const cost = costOf(k);
    const o = ORIGINS[k.origin];
    jCard({
      tag: "Adoption",
      iconSrc: faceUrl(k),
      title: `${k.first} ${k.last}`,
      lead: `${k.story}<br><br><i>${esc(k.trait)}: ${esc(k.traitNote)}</i>`,
      rows: [
        ["Age", `${k.age} year${k.age === 1 ? "" : "s"} old`],
        ["From", k.cn],
        ["Background", o.n],
        ["Adoption cost", money(cost)],
        ["Your money", money(state.money)],
      ],
      choices: [
        [`Adopt ${k.first} (my surname)`, () => adopt(k, true)],
        [`Adopt ${k.first} (keep ${k.last})`, () => adopt(k, false)],
        ["Back to the list", () => openAgency()],
      ],
    });
  }

  function adopt(k, mine) {
    const cost = costOf(k);
    if ((Number(state.money) || 0) < cost) {
      // one clear notice, then straight back to the menu (no stacking popups)
      return notice("Not enough money", `The adoption of ${k.first} costs ${money(cost)} and you have ${money(state.money)}.`, () => openAgency(), true);
    }
    const last = mine && typeof SURNAME !== "undefined" ? SURNAME : k.last;
    state.money -= cost;
    (state.family ||= []).push({
      kind: "child",
      g: k.g,
      first: k.first,
      last,
      ageOffset: k.age - state.age,
      look: { ...k.look },
      rel: k.rel,
      otherParent: state.spouse ? `${state.spouse.first} ${state.spouse.last}` : "Adoption agency",
      smarts: k.smarts,
      looks: k.looks,
      adopted: true,
      adoptedAge: k.age,
      adoptedAt: state.age,
      adoptedFrom: k.cn,
      nat: k.code,
    });
    state.adoptPool.kids = state.adoptPool.kids.filter((x) => x.id !== k.id);
    state.stats.Happiness = cl((Number(state.stats.Happiness) || 0) + (k.age >= 13 ? 8 : 12));
    snd("baby");
    try {
      renderStats();
    } catch {}
    screen.classList.remove("open");
    say(`I adopted a ${k.age}-year-old ${k.g === "f" ? "girl" : "boy"} from ${k.cn} named ${k.first} ${last}.`);
    notice("A new family member", `You adopted ${k.first} ${last}, age ${k.age}, from ${k.cn}. ${k.first} is now part of your family.${k.age >= 8 && k.origin !== "relative" ? " Trust will take time. Be patient." : ""}`, null, true);
    if (typeof saveLife === "function") saveLife();
  }

  // ------------------------------------------------------------------ hook
  window.FL_ADOPT = { open: () => openAgency(), pool: () => pool() };
  // wait for the base game to define its own openAdoption, then replace it (Activities calls it by name)
  function boot() {
    if (typeof state === "undefined" || typeof jCard !== "function" || typeof sList === "undefined" || typeof npcFace !== "function" || typeof window.openAdoption !== "function") return setTimeout(boot, 80);
    window.openAdoption = openAgency;
    console.log("[adoption] loaded");
  }
  boot();
})();
