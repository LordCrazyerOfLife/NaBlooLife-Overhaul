/* [base] Landlord for NaBlooLife.
 *
 * Assets -> Landlord (replaces the old "coming soon" row). Rent out the houses you own:
 *  - Every property has a yearly switch: rent it out or leave it empty. You can flip it any time.
 *  - Applicants show up at Age up (credit checks, accept or reject), a tenant has a lease, satisfaction and a type.
 *  - Rent is paid monthly, lost months when a tenant is late or leaves; rent too high/low changes demand and mood.
 *  - Maintenance: yearly issues (roof, boiler, mold, wiring...), hidden ones only an inspection finds; contractor,
 *    cheap handyman or DIY; ignoring them drops condition, mood and can end in a lawsuit.
 *  - Tenant activities: chat, inspect, change rent, evict, cash for keys. Optional property manager and insurance.
 *  - ~18 random events (late rent, party, noise, pets, burst pipe, fire, burglary, illegal activity, squatters...).
 *
 * State: p.ll = { mode:"rent"|"off", rent, tenant, issues[], mgr, ins, lost, vacYears, earned } on every property;
 * state.landlord = { tickAge, total }. Debug: FL_LAND.open(), FL_LAND.tick(), FL_LAND.event(p, "late"), FL_LAND.EVENTS.
 */
(() => {
  "use strict";
  if (window.FL_LAND) return;

  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const cl = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const warn = (w, e) => console.warn("[landlord] " + w, e);
  const usdf = (n) => {
    try {
      return usd(n);
    } catch {
      return "$" + Math.round(n).toLocaleString("en-US");
    }
  };
  const r10 = (n) => Math.max(10, Math.round(n / 10) * 10);
  const r50 = (n) => Math.max(50, Math.round(n / 50) * 50);

  // ------------------------------------------------------------------ data
  const FIRST = ["Marcus", "Elena", "Tyrone", "Priya", "Jake", "Sofia", "Dmitri", "Aaliyah", "Carlos", "Mei", "Brandon", "Fatima", "Liam", "Nia", "Hector", "Grace", "Omar", "Chloe", "Wei", "Jasmine", "Tomas", "Ingrid", "Andre", "Yuki", "Rosa", "Kofi", "Hannah", "Luca", "Imani", "Sam"];
  const LAST = ["Alvarez", "Nguyen", "Brooks", "Patel", "Kowalski", "Okafor", "Reyes", "Sullivan", "Tanaka", "Moreau", "Dubois", "Haddad", "Whitaker", "Castillo", "Lindqvist", "Foster", "Bianchi", "Mensah", "Park", "Rivera", "Novak", "Hughes", "Santos", "Adeyemi"];
  const KINDS = [
    { k: "young professional", rely: 72, tidy: 65, w: 3, claim: "Works in tech" },
    { k: "family with kids", rely: 68, tidy: 55, w: 3, claim: "Two incomes" },
    { k: "college student", rely: 48, tidy: 42, w: 2, claim: "Parents co-sign" },
    { k: "retiree", rely: 86, tidy: 82, w: 1.5, claim: "Pension and savings" },
    { k: "couple", rely: 72, tidy: 70, w: 2.5, claim: "Both employed" },
    { k: "group of roommates", rely: 52, tidy: 46, w: 2, claim: "Splitting the rent" },
    { k: "remote worker", rely: 76, tidy: 72, w: 2, claim: "Fully remote job" },
    { k: "shady tenant", rely: 28, tidy: 28, w: 0.7, claim: "Self-employed, cash only", disguise: true },
  ];
  // [name, base cost, severity 1-3]
  const ISSUES = [
    ["Leaky roof", 4500, 3],
    ["Broken water heater", 1400, 2],
    ["Clogged plumbing", 600, 1],
    ["Broken air conditioning", 3200, 2],
    ["Mold in the bathroom", 2200, 3],
    ["Pest infestation", 700, 2],
    ["Faulty wiring", 2800, 3],
    ["Dead appliance", 800, 1],
    ["Cracked windows", 900, 1],
    ["Foundation crack", 7500, 3],
    ["Broken garage door", 1200, 1],
    ["Sewer backup", 3500, 3],
    ["Heater failure", 2600, 2],
    ["Rotting deck", 3000, 2],
  ];

  // ------------------------------------------------------------------ state
  const G = () => {
    if (!state.landlord || typeof state.landlord !== "object") state.landlord = {};
    state.landlord.tickAge ??= -1;
    state.landlord.total ??= 0;
    return state.landlord;
  };
  const enabled = () => !state.dead && state.era !== "1800s" && typeof state !== "undefined" && (state.props || []).some((p) => !p.old && !p.royal);
  const props = () => (state.props || []).filter((p) => !p.old && !p.royal);
  const LL = (p) => {
    p.ll ||= {};
    const L = p.ll;
    L.mode ??= "off";
    L.tenant ??= null;
    L.issues ||= [];
    L.lost ??= 0;
    L.vacYears ??= 0;
    L.earned ??= 0;
    L.mgr ??= false;
    L.ins ??= false;
    return L;
  };
  const value = (p) => Math.round(p.price * (0.8 + p.cond / 250));
  const market = (p) => r10(value(p) * 0.0055 * (0.8 + p.cond / 500));
  const rentOf = (p) => LL(p).rent || market(p);
  const scale = (p) => Math.pow(cl(value(p) / 200000, 0.35, 8), 0.78);
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
  const earn = (n) => {
    state.money = (Number(state.money) || 0) + Math.round(n);
    refresh();
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
  const mood = (n, txt) => {
    try {
      if (typeof fx === "function") fx({ Happiness: n }, txt || "");
    } catch {}
  };
  const addr = (p) => esc(p.addr || p.name);
  const nm = (p) => esc(p.name || "property");
  // insurance covers most of the damage
  const dmg = (p, n) => Math.round(LL(p).ins ? n * 0.25 : n);

  // ------------------------------------------------------------------ tenants
  function makeTenant(p, careful) {
    let pool = KINDS;
    if (careful) pool = KINDS.filter((k) => !k.disguise || rnd() < 0.2);
    const tot = pool.reduce((s, k) => s + k.w, 0);
    let x = rnd() * tot;
    let kind = pool[0];
    for (const k of pool) {
      x -= k.w;
      if (x <= 0) {
        kind = k;
        break;
      }
    }
    const rely = cl(kind.rely + ri(-14, 14));
    return {
      name: `${pick(FIRST)} ${pick(LAST)}`,
      kind: kind.k,
      claim: kind.claim,
      shady: !!kind.disguise,
      rely,
      tidy: cl(kind.tidy + ri(-14, 14)),
      sat: ri(55, 75),
      lease: ri(1, 3),
      since: state.age,
      chat: -1,
      pet: false,
      extra: 0,
      income: Math.round(rentOf(p) * (1.8 + (rely / 100) * 2.6 + rnd() * 0.5)),
    };
  }
  const credit = (r) => (r >= 78 ? "Excellent" : r >= 62 ? "Good" : r >= 45 ? "Fair" : "Poor");
  const satLabel = (s) => (s >= 75 ? "Happy" : s >= 55 ? "Content" : s >= 35 ? "Annoyed" : "Furious");
  const tdesc = (t) => `${esc(t.name)} (${esc(t.kind === "shady tenant" ? "self-employed" : t.kind)})`;

  // ------------------------------------------------------------------ UI helpers
  const chev = () => (typeof CHEV !== "undefined" ? CHEV : "");
  const imgOf = (p) => `houses/${p.sprite}.png`;
  const row = (data, ic, t, s) =>
    `<div class="row" ${data}>${ic ? `<img src="${ic}" alt="" style="object-fit:contain">` : ""}<div class="t"><b>${t}</b><span>${s}</span></div>${chev()}</div>`;
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
      jCard({ tag: "Landlord", ...o });
    } catch (e) {
      warn("card", e);
    }
  };
  const pcard = (p, o) => card({ iconSrc: imgOf(p), ...o, rows: [["Property", addr(p)], ...(o.rows || [])] });
  const noFunds = (p, back) => note("Not enough money", "You cannot cover that right now.", back);

  // ------------------------------------------------------------------ screens
  function status(p) {
    const L = LL(p);
    const iss = L.issues.filter((i) => !i.hidden).length;
    const tail = iss ? ` · ${iss} issue${iss > 1 ? "s" : ""}` : "";
    if (L.mode !== "rent") return `Not renting${tail}`;
    if (!L.tenant) return `Listed at ${usdf(rentOf(p))}/mo · vacant${tail}`;
    return `${esc(L.tenant.name)} · ${usdf(rentOf(p))}/mo · ${satLabel(L.tenant.sat)}${tail}`;
  }

  function openMain() {
    if (typeof screen === "undefined" || typeof sList === "undefined") return;
    const ps = props();
    const renting = ps.filter((p) => LL(p).mode === "rent");
    const occ = renting.filter((p) => LL(p).tenant);
    const monthly = occ.reduce((s, p) => s + rentOf(p), 0);
    let h = `<div class="sec">Portfolio</div>`;
    h += `<div class="row sm" style="cursor:default"><div class="t"><b style="font-weight:600">${ps.length} propert${ps.length === 1 ? "y" : "ies"} · ${renting.length} listed · ${occ.length} occupied</b><span>Rent coming in: ${usdf(monthly)}/mo · ${usdf(monthly * 12)}/yr · earned so far ${usdf(G().total)}</span></div></div>`;
    h += `<div class="sec">Your properties</div>`;
    if (!ps.length) h += `<div class="row" style="cursor:default"><div class="t"><b>No properties</b><span>Buy a house first.</span></div></div>`;
    ps.forEach((p, i) => (h += row(`data-ll="${i}"`, imgOf(p), esc(typeof propLabel === "function" ? propLabel(p) : p.name), status(p))));
    h += `<div class="mm-foot" style="padding:10px 14px;text-align:left">Each year you decide to rent a house or not. Tenants pay monthly, break things, complain and sometimes stop paying. Keep the house in shape and the rent fair.</div>`;
    openScreen("LANDLORD", () => (typeof openAssets === "function" ? openAssets() : screen.classList.remove("open")), h);
    sList.querySelectorAll("[data-ll]").forEach((el) => (el.onclick = () => openProp(ps[+el.dataset.ll])));
  }

  function openProp(p) {
    if (!state.props.includes(p)) return openMain();
    const L = LL(p);
    const t = L.tenant;
    const vis = L.issues.filter((i) => !i.hidden);
    let h = `<div class="sec">${nm(p)} · ${addr(p)}</div>`;
    h += `<div class="row sm" style="cursor:default"><div class="t"><b style="font-weight:600">Value ${usdf(value(p))} · Condition ${Math.round(p.cond)}%</b><span>Market rent ${usdf(market(p))}/mo · ${p.br}br/${p.ba}ba</span></div></div>`;
    h += `<div class="sec">Renting</div>`;
    h += row(`data-a="mode"`, "", L.mode === "rent" ? "Renting: ON" : "Renting: OFF", L.mode === "rent" ? "Tap to stop renting it out" : "Tap to put it up for rent");
    h += row(`data-a="rent"`, "", `Rent: ${usdf(rentOf(p))}/mo`, `Market ${usdf(market(p))} · ${Math.round((rentOf(p) / market(p)) * 100)}% of market`);
    h += row(`data-a="tenant"`, "", t ? `Tenant: ${esc(t.name)}` : "Tenant: none", t ? `${esc(t.kind)} · ${satLabel(t.sat)} · lease ${t.lease}y left` : L.mode === "rent" ? "Looking for tenants at the next Age up" : "Not rented");
    h += `<div class="sec">Upkeep</div>`;
    h += row(`data-a="repairs"`, "", `Repairs${vis.length ? ` (${vis.length})` : ""}`, vis.length ? vis.map((i) => esc(i.name)).join(", ") : "Nothing broken that you know of");
    h += row(`data-a="reno"`, "", "Renovate", "Raise condition and what it can rent for");
    h += row(`data-a="mgr"`, "", L.mgr ? "Property manager: hired" : "Property manager: none", L.mgr ? "Takes 10% of rent, screens tenants, fixes small things" : "Hire one to skip the hassle");
    h += row(`data-a="ins"`, "", L.ins ? "Landlord insurance: on" : "Landlord insurance: off", L.ins ? `${usdf(Math.round(value(p) * 0.0035))}/yr, covers 75% of damage` : `${usdf(Math.round(value(p) * 0.0035))}/yr, covers 75% of damage`);
    openScreen("LANDLORD", openMain, h);
    sList.querySelectorAll("[data-a]").forEach((el) => {
      el.onclick = () => {
        const a = el.dataset.a;
        if (a === "mode") toggleMode(p);
        else if (a === "rent") rentCard(p);
        else if (a === "tenant") (L.tenant ? tenantCard(p) : note("No tenant", L.mode === "rent" ? "Applicants show up at the next Age up." : "Turn renting on first.", () => openProp(p)));
        else if (a === "repairs") openRepairs(p);
        else if (a === "reno") renoCard(p);
        else if (a === "mgr") {
          L.mgr = !L.mgr;
          logLine(L.mgr ? `I hired a property manager for my ${p.name.toLowerCase()}.` : `I fired the property manager at my ${p.name.toLowerCase()}.`);
          openProp(p);
        } else if (a === "ins") {
          L.ins = !L.ins;
          openProp(p);
        }
      };
    });
  }

  function toggleMode(p) {
    const L = LL(p);
    if (L.mode === "rent") {
      const stop = () => {
        L.mode = "off";
        if (L.tenant) {
          logLine(`I gave ${L.tenant.name} notice and stopped renting my ${p.name.toLowerCase()}.`);
          L.tenant = null;
        }
        openProp(p);
      };
      if (L.tenant)
        return pcard(p, {
          title: "Stop renting?",
          lead: `${tdesc(L.tenant)} lives here. They get a notice and move out.`,
          choices: [["Give notice", stop], ["Keep renting", () => openProp(p), "gray"]],
        });
      return stop();
    }
    L.mode = "rent";
    L.rent ||= market(p);
    L.vacYears = 0;
    logLine(`I put my ${p.name.toLowerCase()} up for rent.`);
    openProp(p);
  }

  function rentCard(p) {
    const L = LL(p);
    const m = market(p);
    const set = (v) => () => {
      L.rent = r10(v);
      if (L.tenant) L.tenant.sat = cl(L.tenant.sat + (L.rent > rentOf(p) ? 0 : 4));
      openProp(p);
    };
    const cur = rentOf(p);
    const up = (f) => () => {
      const nr = r10(cur * f);
      if (L.tenant && f > 1) {
        L.tenant.sat = cl(L.tenant.sat - Math.round((f - 1) * 90));
        if (L.tenant.sat < 15 && rnd() < 0.5) {
          const nme = L.tenant.name;
          L.tenant = null;
          L.rent = nr;
          logLine(`${nme} moved out after I raised the rent on my ${p.name.toLowerCase()}.`);
          return note("They left", `${nme} refused the new rent and moved out.`, () => openProp(p));
        }
      }
      L.rent = nr;
      openProp(p);
    };
    pcard(p, {
      title: "Set the rent",
      lead: "Rent above the market makes tenants unhappy and hard to find. Below it, they stay and applicants line up.",
      rows: [
        ["Current", `${usdf(cur)}/mo`],
        ["Market", `${usdf(m)}/mo`],
      ],
      choices: [
        ["Market rate", set(m)],
        ["Raise 10%", up(1.1)],
        ["Raise 25%", up(1.25)],
        ["Lower 10%", set(cur * 0.9)],
        ["Lower 25%", set(cur * 0.75)],
        ["Back", () => openProp(p), "gray"],
      ],
    });
  }

  function renoCard(p) {
    const v = value(p);
    const small = Math.round((v * 0.02) / 10) * 10;
    const big = Math.round((v * 0.06) / 10) * 10;
    const go = (cost, gain, label) => () => {
      if (!spend(cost)) return noFunds(p, () => openProp(p));
      p.cond = cl(p.cond + gain);
      const L = LL(p);
      if (L.tenant) L.tenant.sat = cl(L.tenant.sat + (gain > 12 ? 10 : 5));
      logLine(`I ${label} my ${p.name.toLowerCase()}.`);
      note("Done", `The work is finished. The place looks much better (+${gain} condition).`, () => openProp(p));
    };
    pcard(p, {
      title: "Renovate",
      lead: "Better condition means a higher value, higher rent and happier tenants.",
      rows: [
        ["Condition", `${Math.round(p.cond)}%`],
        ["Bank", usdf(bank())],
      ],
      choices: [
        [`Cosmetic refresh (${usdf(small)})`, go(small, 8, "repainted and refreshed")],
        [`Major renovation (${usdf(big)})`, go(big, 20, "renovated")],
        ["Back", () => openProp(p), "gray"],
      ],
    });
  }

  // ------------------------------------------------------------------ repairs
  function newIssue(p, hidden) {
    const [name, base, sev] = pick(ISSUES);
    return { name, cost: r50(base * scale(p) * (0.75 + rnd() * 0.6)), sev, age: 0, hidden: !!hidden };
  }

  function openRepairs(p) {
    const L = LL(p);
    const vis = L.issues.filter((i) => !i.hidden);
    let h = `<div class="sec">Repairs</div>`;
    if (!vis.length) h += `<div class="row" style="cursor:default"><div class="t"><b>All good</b><span>Nothing broken that you know of. An inspection might find hidden problems.</span></div></div>`;
    vis.forEach((i, k) => (h += row(`data-r="${k}"`, "", esc(i.name), `${usdf(i.cost)} · ${["", "minor", "serious", "dangerous"][i.sev]}${i.age ? ` · ${i.age}y unfixed` : ""}`)));
    openScreen("REPAIRS", () => openProp(p), h);
    sList.querySelectorAll("[data-r]").forEach((el) => (el.onclick = () => repairCard(p, vis[+el.dataset.r])));
  }

  function fixIssue(p, i, how) {
    const L = LL(p);
    const done = () => {
      L.issues = L.issues.filter((x) => x !== i);
      i.hidden = false;
      if (L.tenant) L.tenant.sat = cl(L.tenant.sat + 8);
      p.cond = cl(p.cond + 2 + i.sev * 2);
    };
    if (how === "pro") {
      if (!spend(i.cost)) return noFunds(p, () => openRepairs(p));
      done();
      logLine(`I paid a contractor to fix the ${i.name.toLowerCase()} at my ${p.name.toLowerCase()}.`);
      return note("Fixed", `A contractor fixed the ${i.name.toLowerCase()} properly.`, () => openRepairs(p));
    }
    if (how === "cheap") {
      const c = Math.round(i.cost * 0.6);
      if (!spend(c)) return noFunds(p, () => openRepairs(p));
      if (rnd() < 0.7) {
        done();
        return note("Fixed", "The handyman got it done for less.", () => openRepairs(p));
      }
      i.cost = Math.round(i.cost * 1.3);
      return note("Botched", "The handyman made it worse. It will cost more to fix now.", () => openRepairs(p));
    }
    // diy
    if (rnd() < 0.5) {
      done();
      return note("You did it", "A weekend, some swearing and a video tutorial. It works.", () => openRepairs(p));
    }
    const c = Math.round(i.cost * 0.25);
    spend(Math.min(c, bank()));
    i.cost = Math.round(i.cost * 1.15);
    note("It got worse", "You bought the wrong parts and made a mess. Call someone.", () => openRepairs(p));
  }

  function repairCard(p, i) {
    if (!i) return openRepairs(p);
    pcard(p, {
      title: i.name,
      lead: i.sev === 3 ? "This one is dangerous. Leaving it can end in a lawsuit." : i.sev === 2 ? "This will keep getting worse until it is fixed." : "Small, but tenants notice.",
      rows: [
        ["Contractor", usdf(i.cost)],
        ["Cheap handyman", `${usdf(Math.round(i.cost * 0.6))} (70% works)`],
        ["Do it yourself", "Free (50% works)"],
      ],
      choices: [
        [`Hire a contractor`, () => fixIssue(p, i, "pro")],
        ["Cheap handyman", () => fixIssue(p, i, "cheap")],
        ["Do it yourself", () => fixIssue(p, i, "diy")],
        ["Back", () => openRepairs(p), "gray"],
      ],
    });
  }

  // ------------------------------------------------------------------ tenant card and activities
  function tenantCard(p) {
    const L = LL(p);
    const t = L.tenant;
    if (!t) return openProp(p);
    pcard(p, {
      title: t.name,
      lead: `A ${esc(t.kind === "shady tenant" ? "self-employed" : t.kind)} living here since age ${t.since}.${t.pet ? " Has a pet." : ""}`,
      rows: [
        ["Mood", satLabel(t.sat)],
        ["Rent", `${usdf(rentOf(p))}/mo`],
        ["Lease", `${t.lease} year${t.lease === 1 ? "" : "s"} left`],
        ["Pays", credit(t.rely) + " history"],
      ],
      choices: [
        ["Chat with them", () => chat(p)],
        ["Inspect the property", () => inspect(p)],
        ["Evict", () => evictCard(p)],
        ["Cash for keys", () => keysCard(p)],
        ["Back", () => openProp(p), "gray"],
      ],
    });
  }

  const CHATS = [
    "They show you the plants they put on the balcony.",
    "They ask if the neighbors' dog is going to keep barking all night.",
    "They tell you about their new job and thank you for being fair.",
    "They mention the kitchen faucet drips a little, nothing urgent.",
    "They talk about the neighborhood. You learn where the good tacos are.",
    "They complain about parking, then laugh about it.",
    "They invite you for coffee. It is the best coffee you have had this month.",
  ];
  function chat(p) {
    const t = LL(p).tenant;
    if (!t) return openProp(p);
    if (t.chat === state.age) return note("Already talked", "You already caught up with them this year.", () => tenantCard(p));
    t.chat = state.age;
    t.sat = cl(t.sat + ri(4, 9));
    t.rely = cl(t.rely + 2);
    if (rnd() < 0.25) {
      const i = newIssue(p, false);
      i.cost = Math.round(i.cost * 0.4);
      i.name = "Small " + i.name.toLowerCase();
      i.sev = 1;
      LL(p).issues.push(i);
      return note("Heads up", `${t.name} mentions a ${i.name.toLowerCase()}. It is on your repair list now.`, () => tenantCard(p));
    }
    mood(2);
    note("Good chat", pick(CHATS), () => tenantCard(p));
  }

  function inspect(p) {
    const L = LL(p);
    const t = L.tenant;
    if (L.inspected === state.age) return note("Already inspected", "You checked this year already.", () => (t ? tenantCard(p) : openProp(p)));
    L.inspected = state.age;
    const found = L.issues.filter((i) => i.hidden);
    found.forEach((i) => (i.hidden = false));
    let msg = found.length ? `You found: ${found.map((i) => i.name.toLowerCase()).join(", ")}. They are on your repair list now.` : "Everything looks fine.";
    if (t) {
      t.sat = cl(t.sat - 3);
      if (t.pet === false && rnd() < 0.12 && t.rely < 70) {
        t.pet = true;
        msg += " There is a cat living here that was not in the lease.";
      }
      if (t.tidy < 38 && rnd() < 0.5) {
        msg += " It is messy, and you can smell it.";
        t.sat = cl(t.sat - 2);
      }
    }
    note("Inspection", msg, () => (t ? tenantCard(p) : openProp(p)));
  }

  function evictCard(p) {
    const L = LL(p);
    const t = L.tenant;
    if (!t) return openProp(p);
    const fee = r50(rentOf(p) * 2.2 + 500);
    pcard(p, {
      title: "Evict " + t.name,
      lead: "Lawyers, a court date and a lot of paperwork. It is not guaranteed.",
      rows: [
        ["Legal fees", usdf(fee)],
        ["Bank", usdf(bank())],
      ],
      choices: [
        [
          "File the eviction",
          () => {
            if (!spend(fee)) return noFunds(p, () => tenantCard(p));
            if (rnd() < (t.rely < 40 ? 0.9 : 0.78)) {
              L.tenant = null;
              L.lost += ri(1, 2);
              logLine(`I evicted ${t.name} from my ${p.name.toLowerCase()}.`);
              note("Evicted", "The court sided with you. They are gone by the end of the month.", () => openProp(p));
            } else {
              t.sat = cl(t.sat - 25);
              note("Case lost", "The judge sided with the tenant. You pay the fees and they stay.", () => tenantCard(p));
            }
          },
        ],
        ["Never mind", () => tenantCard(p), "gray"],
      ],
    });
  }

  function keysCard(p) {
    const L = LL(p);
    const t = L.tenant;
    if (!t) return openProp(p);
    const c = r50(rentOf(p) * 2);
    pcard(p, {
      title: "Cash for keys",
      lead: "Pay them to leave quietly. No court, no drama.",
      rows: [["Offer", usdf(c)]],
      choices: [
        [
          "Make the offer",
          () => {
            if (!spend(c)) return noFunds(p, () => tenantCard(p));
            L.tenant = null;
            L.lost += 1;
            logLine(`I paid ${t.name} to move out of my ${p.name.toLowerCase()}.`);
            note("Keys returned", "They take the money and are out in a week.", () => openProp(p));
          },
        ],
        ["Never mind", () => tenantCard(p), "gray"],
      ],
    });
  }

  // ------------------------------------------------------------------ applicants
  function applicants(p, done) {
    const L = LL(p);
    const careful = L.mgr;
    const n = ri(1, 3);
    const list = Array.from({ length: n }, () => makeTenant(p, careful));
    let k = 0;
    const next = () => {
      if (k >= list.length) {
        L.vacYears++;
        logLine(`I could not find a tenant for my ${p.name.toLowerCase()} this year.`);
        return done(false);
      }
      show(list[k++]);
    };
    const show = (t) => {
      let checked = L.mgr;
      const draw = () =>
        pcard(p, {
          title: "Applicant",
          lead: `${esc(t.name)}, ${esc(t.kind === "shady tenant" ? "self-employed" : t.kind)}. "${esc(t.claim)}."`,
          rows: [
            ["Monthly income", usdf(t.income)],
            ["Rent", `${usdf(rentOf(p))}/mo`],
            ["Credit", checked ? credit(t.rely) : "Not checked"],
          ],
          choices: [
            ["Accept", () => accept(t)],
            ...(checked ? [] : [["Background check ($60)", () => (spend(60) ? ((checked = true), draw()) : noFunds(p, draw))]]),
            ["Reject", next, "gray"],
            ["Reject all", () => {
              L.vacYears++;
              done(false);
            }, "gray"],
          ],
        });
      draw();
    };
    const accept = (t) => {
      const r = rentOf(p) / market(p);
      const gap = r < 0.95 ? ri(0, 1) : r > 1.1 ? ri(2, 5) : ri(0, 3);
      L.tenant = t;
      L.vacYears = 0;
      const months = Math.max(0, 12 - gap);
      const pay = rentOf(p) * months * (L.mgr ? 0.9 : 1);
      earn(pay);
      L.earned += pay;
      G().total += pay;
      logLine(`${t.name} moved into my ${p.name.toLowerCase()}. Rent ${usdf(rentOf(p))}/mo.`);
      note("New tenant", `${t.name} signs a ${t.lease}-year lease. Rent this year: ${usdf(pay)}${gap ? ` (${gap} month${gap > 1 ? "s" : ""} empty first)` : ""}.`, () => done(true));
    };
    next();
  }

  // ------------------------------------------------------------------ random events
  // each: id, w(p, t) = weight (0 = impossible), run(p, t, done)
  const rentLoss = (p, m) => (LL(p).lost += m);
  const EVENTS = [
    {
      id: "late",
      w: (p, t) => 1.2 + (100 - t.rely) / 35,
      run: (p, t) => {
        const r = rentOf(p);
        pcard(p, {
          title: "Rent is late",
          lead: `${esc(t.name)} says they lost their hours at work and cannot pay this month.`,
          rows: [["Rent", `${usdf(r)}/mo`]],
          choices: [
            ["Give a grace period", () => (t.sat = cl(t.sat + 6), t.rely = cl(t.rely + 3), rnd() < 0.6 ? note("They paid", "They catch up the next month and thank you.") : (rentLoss(p, 1), note("No luck", "They could not make it up. You lose a month.")))],
            ["Payment plan", () => (rentLoss(p, 0.5), t.sat = cl(t.sat + 2), note("Agreed", "You lose half a month, but they stay."))],
            ["Threaten them", () => (t.sat = cl(t.sat - 10), rnd() < 0.7 ? note("They pay", "They scrape it together and glare at you from then on.") : (rentLoss(p, 1), note("Nothing", "They have nothing to give. You lose a month.")))],
            ["Start an eviction", () => evictCard(p), "gray"],
          ],
        });
      },
    },
    {
      id: "party",
      w: (p, t) => (t.tidy < 60 ? 1.4 : 0.35),
      run: (p, t) => {
        const c = dmg(p, r50(1500 * scale(p)));
        pcard(p, {
          title: "Wild party",
          lead: "Neighbors send photos. The tenant had a party and the living room paid for it.",
          rows: [["Repair cost", usdf(c)]],
          choices: [
            ["Bill the tenant", () => (t.sat = cl(t.sat - 12), rnd() < 0.55 ? (earn(c * 0.6), note("They pay up", `They hand over ${usdf(c * 0.6)} toward the damage.`)) : note("They refuse", "They say it was already like that."))],
            ["Pay and move on", () => (spend(Math.min(c, bank())), p.cond = cl(p.cond - 3), t.sat = cl(t.sat + 3), note("Fixed", "You swallow it and fix the walls."))],
            ["Warn them", () => (t.sat = cl(t.sat - 4), p.cond = cl(p.cond - 4), note("Warned", "They promise it will not happen again."))],
          ],
        });
      },
    },
    {
      id: "noise",
      w: (p, t) => (t.tidy < 55 || t.kind === "college student" || t.kind === "group of roommates" ? 1.3 : 0.5),
      run: (p, t) =>
        pcard(p, {
          title: "Noise complaints",
          lead: "The neighbors say loud music keeps them awake. They are threatening to call the city.",
          choices: [
            ["Warn the tenant", () => (t.sat = cl(t.sat - 5), note("Quiet for a while", "It is quiet for a few weeks."))],
            ["Ignore it", () => (rnd() < 0.5 ? (spend(Math.min(bank(), r50(500 * scale(p)))), note("City fine", "The city fines you for repeated complaints.")) : note("It blows over", "Nothing happens."))],
            ["Threaten a fine", () => (t.sat = cl(t.sat - 10), t.rely = cl(t.rely + 2), note("Message received", "The tenant quiets down, annoyed."))],
          ],
        }),
    },
    {
      id: "pet",
      w: (p, t) => (t.pet ? 0 : 1),
      run: (p, t) =>
        pcard(p, {
          title: "Can I get a pet?",
          lead: `${esc(t.name)} wants to adopt a dog.`,
          rows: [["Pet fee", "$40/mo"]],
          choices: [
            ["Allow it (+$40/mo)", () => (t.pet = true, LL(p).rent = rentOf(p) + 40, t.sat = cl(t.sat + 8), rnd() < 0.25 && (p.cond = cl(p.cond - 3)), note("Approved", "The dog is a good boy. The carpet is not so lucky."))],
            ["Say no", () => (t.sat = cl(t.sat - 6), note("Denied", "They are not happy but accept it."))],
          ],
        }),
    },
    {
      id: "upgrade",
      w: () => 0.7,
      run: (p, t) => {
        const c = r50(1800 * scale(p));
        pcard(p, {
          title: "Request: repaint",
          lead: `${esc(t.name)} asks to repaint and replace the old kitchen fixtures. It would make the place nicer.`,
          rows: [["Cost", usdf(c)]],
          choices: [
            ["Pay for it", () => (spend(c) ? (p.cond = cl(p.cond + 6), t.sat = cl(t.sat + 10), note("Nice", "The place looks better.")) : noFunds(p))],
            ["Let them do it", () => (t.sat = cl(t.sat + 5), rnd() < 0.4 ? (p.cond = cl(p.cond - 2), note("Questionable", "The color is... a choice.")) : (p.cond = cl(p.cond + 2), note("Not bad", "They did a decent job for free.")))],
            ["Refuse", () => (t.sat = cl(t.sat - 5), note("Refused", "They shrug."))],
          ],
        });
      },
    },
    {
      id: "leaveearly",
      w: (p, t) => (t.lease > 1 ? 0.8 : 0.3),
      run: (p, t) =>
        pcard(p, {
          title: "Job transfer",
          lead: `${esc(t.name)} got a job in another city and wants out of the lease early.`,
          choices: [
            ["Let them go", () => (LL(p).tenant = null, rentLoss(p, ri(1, 3)), logLine(`${t.name} moved out of my ${p.name.toLowerCase()} early.`), note("Gone", "They leave the place clean and the keys on the counter."))],
            ["Charge a break fee", () => (earn(rentOf(p) * 2), LL(p).tenant = null, rentLoss(p, ri(1, 3)), note("Fee paid", `They pay ${usdf(rentOf(p) * 2)} and leave.`))],
            ["Hold them to the lease", () => (t.sat = cl(t.sat - 25), note("Stuck", "They stay, unhappy."))],
          ],
        }),
    },
    {
      id: "prepay",
      w: (p, t) => (t.rely >= 70 && t.sat >= 60 ? 0.8 : 0),
      run: (p, t) => {
        const r = rentOf(p);
        pcard(p, {
          title: "Pay the year up front?",
          lead: `${esc(t.name)} got a bonus. They offer next year's rent in one payment if you take 5% off.`,
          rows: [["Lump sum", usdf(r * 12 * 0.95)]],
          choices: [
            ["Accept", () => (earn(r * 12 * 0.95), LL(p).prepaid = state.age, G().total += r * 12 * 0.95, t.sat = cl(t.sat + 5), note("Cash in hand", `You get ${usdf(r * 12 * 0.95)} now.`))],
            ["No thanks", () => note("Fine", "They shrug and keep paying monthly.")],
          ],
        });
      },
    },
    {
      id: "burglary",
      w: () => 0.55,
      run: (p, t) => {
        const c = dmg(p, r50(2500 * scale(p)));
        pcard(p, {
          title: "Break-in",
          lead: "The back door was forced. Things are missing and the lock is wrecked.",
          rows: [["Cost", usdf(c)]],
          choices: [
            ["Fix and replace everything", () => (spend(Math.min(c, bank())), t && (t.sat = cl(t.sat - 5)), p.cond = cl(p.cond - 2), note("Fixed", "New locks, new door. The tenant feels uneasy."))],
            ["Cheap lock", () => (spend(Math.min(bank(), Math.round(c * 0.3))), t && (t.sat = cl(t.sat - 12)), note("Barely fixed", "It will do. The tenant is not impressed."))],
          ],
        });
      },
    },
    {
      id: "pipe",
      w: (p) => 0.4 + (100 - p.cond) / 140,
      run: (p, t) => {
        const c = dmg(p, r50(4000 * scale(p)));
        pcard(p, {
          title: "Burst pipe",
          lead: "A pipe burst overnight. Water is everywhere, floors and walls included.",
          rows: [["Cost", usdf(c)]],
          choices: [
            ["Emergency repair", () => (spend(Math.min(c, bank())), p.cond = cl(p.cond - 6), t && (t.sat = cl(t.sat - 4)), note("Handled", "A plumber fixes it fast. Everything is drying out."))],
            ["Wait for the plumber", () => (spend(Math.min(bank(), Math.round(c * 0.6))), p.cond = cl(p.cond - 14), t && (t.sat = cl(t.sat - 14)), LL(p).issues.push({ name: "Mold in the bathroom", cost: r50(2200 * scale(p)), sev: 3, age: 0 }), note("Worse", "It gets worse before it gets fixed, and mold starts to grow."))],
          ],
        });
      },
    },
    {
      id: "fire",
      w: () => 0.12,
      run: (p, t) => {
        const c = dmg(p, r50(18000 * scale(p)));
        pcard(p, {
          title: "Fire!",
          lead: "A kitchen fire. Nobody is hurt, but the damage is serious.",
          rows: [["Damage", usdf(c)]],
          choices: [
            ["Rebuild", () => {
              if (!spend(c)) return note("Not enough money", "You cannot cover the repair. It stays damaged.", () => (p.cond = cl(p.cond - 30)));
              p.cond = cl(p.cond - 10);
              if (t && LL(p).tenant) {
                LL(p).tenant = null;
                rentLoss(p, ri(3, 6));
              }
              note("Rebuilt", LL(p).ins ? "Insurance picked up most of it. The tenant moved out." : "It costs you dearly. The tenant moved out.");
            }],
          ],
        });
      },
    },
    {
      id: "shady",
      w: (p, t) => (t.shady ? 3 : t.rely < 35 ? 0.5 : 0),
      run: (p, t) =>
        pcard(p, {
          title: "Something is off",
          lead: "Weird smells, visitors at night, blacked-out windows. Your tenant is running something illegal in there.",
          choices: [
            ["Call the police", () => (LL(p).tenant = null, p.cond = cl(p.cond - 8), heat(-3), rentLoss(p, 2), logLine(`I reported my tenant at my ${p.name.toLowerCase()}.`), note("Raid", "The police shut it down. The place smells like a chemistry lab."))],
            ["Look the other way", () => (earn(rentOf(p) * 3), heat(8), rnd() < 0.3 ? (note("Raided", "A raid hits the house, and the police ask questions about you."), typeof arrest === "function" && rnd() < 0.4 && arrest("renting to a criminal operation", [1, 2])) : note("Bonus", `They slide you ${usdf(rentOf(p) * 3)} extra to keep quiet.`))],
            ["Evict them", () => evictCard(p), "gray"],
          ],
        }),
    },
    {
      id: "neighbor",
      w: () => 0.6,
      run: (p, t) => {
        const c = r50(3000 * scale(p));
        pcard(p, {
          title: "Neighbor dispute",
          lead: `A neighbor says ${esc(t.name)} damaged their fence and wants money. They are threatening to sue you as the owner.`,
          rows: [["Settlement", usdf(c)]],
          choices: [
            ["Settle", () => (spend(Math.min(c, bank())), note("Settled", "It ends with a handshake."))],
            ["Fight it", () => (rnd() < 0.5 ? note("You win", "The judge dismisses it.") : (spend(Math.min(bank(), c + 2000)), note("You lose", "You pay the neighbor and the legal fees.")))],
            ["Make the tenant pay", () => (t.sat = cl(t.sat - 12), rnd() < 0.5 ? (note("They pay", "The tenant covers it, furious.")) : (spend(Math.min(bank(), c)), note("They refuse", "You end up paying anyway.")))],
          ],
        });
      },
    },
    {
      id: "code",
      w: (p) => 0.2 + (100 - p.cond) / 120,
      run: (p, t) => {
        const c = r50(1200 * scale(p));
        pcard(p, {
          title: "City code violation",
          lead: "An inspector flagged the exterior of the property. Fix it or pay a fine.",
          rows: [["Fix cost", usdf(c)], ["Fine", usdf(c * 2)]],
          choices: [
            ["Fix it", () => (spend(Math.min(c, bank())), p.cond = cl(p.cond + 4), note("Compliant", "The inspector signs off."))],
            ["Pay the fine", () => (spend(Math.min(bank(), c * 2)), p.cond = cl(p.cond - 2), note("Fined", "The issue is still there. Next year they will be back."))],
          ],
        });
      },
    },
    {
      id: "baby",
      w: (p, t) => (t.kind === "couple" || t.kind === "young professional" ? 0.8 : 0.2),
      run: (p, t) =>
        pcard(p, {
          title: "A new baby",
          lead: `${esc(t.name)} is having a baby and the apartment will be tight. They ask if the rent can stay the same.`,
          choices: [
            ["Keep the rent", () => (t.sat = cl(t.sat + 12), t.lease = Math.max(t.lease, 2), note("Nice gesture", "They sign for another year or two."))],
            ["Raise 5% for the extra person", () => (LL(p).rent = r10(rentOf(p) * 1.05), t.sat = cl(t.sat - 8), note("Fair enough", "They pay it, a bit hurt."))],
          ],
        }),
    },
    {
      id: "skip",
      w: (p, t) => (t.rely < 45 ? 1.2 : 0.1),
      run: (p, t) => {
        rentLoss(p, 2);
        LL(p).tenant = null;
        p.cond = cl(p.cond - ri(3, 9));
        logLine(`${t.name} skipped out on my ${p.name.toLowerCase()} owing rent.`);
        pcard(p, {
          title: "They skipped",
          lead: `${esc(t.name)} vanished overnight. The keys are on the counter and two months of rent are missing.`,
          choices: [["Ugh", () => openProp(p)]],
        });
      },
    },
    {
      id: "lawsuit",
      w: (p) => (LL(p).issues.some((i) => i.sev === 3 && i.age >= 1 && !i.hidden) ? 4 : 0),
      run: (p, t) => {
        const c = r50(9000 * scale(p));
        pcard(p, {
          title: "Habitability lawsuit",
          lead: `${esc(t.name)} sued because you never fixed a dangerous problem.`,
          rows: [["Judgment", usdf(c)]],
          choices: [
            ["Settle and fix it", () => (spend(Math.min(c * 0.6, bank())), LL(p).issues.forEach((i) => i.sev === 3 && (i.age = 0)), t.sat = cl(t.sat + 6), note("Settled", "You pay and promise to fix the issues."))],
            ["Fight it", () => (rnd() < 0.3 ? note("Won", "The judge rules for you.") : (spend(Math.min(c * 1.3, bank())), t.sat = cl(t.sat - 15), note("Lost", "The judge was not kind.")))],
          ],
        });
      },
    },
    {
      id: "referral",
      w: (p, t) => (t.sat >= 70 ? 0.7 : 0),
      run: (p, t) => {
        const o = props().filter((x) => x !== p && LL(x).mode === "rent" && !LL(x).tenant)[0];
        if (!o) {
          t.sat = cl(t.sat + 4);
          return note("Great tenant", `${t.name} tells everybody what a good landlord you are.`);
        }
        const nt = makeTenant(o, true);
        nt.rely = cl(nt.rely + 15);
        pcard(o, {
          title: "A friend of the tenant",
          lead: `${esc(t.name)} recommended you to ${esc(nt.name)}, who needs a place. ${esc(nt.name)} wants this one.`,
          rows: [["Rent", `${usdf(rentOf(o))}/mo`]],
          choices: [
            ["Accept", () => {
              const L2 = LL(o);
              L2.tenant = nt;
              const pay = rentOf(o) * 10 * (L2.mgr ? 0.9 : 1);
              earn(pay);
              L2.earned += pay;
              G().total += pay;
              logLine(`${nt.name} moved into my ${o.name.toLowerCase()}.`);
              note("New tenant", `${nt.name} moves in right away. Rent so far: ${usdf(pay)}.`);
            }],
            ["Pass", () => {}, "gray"],
          ],
        });
      },
    },
    {
      id: "tax",
      w: () => 0.4,
      run: (p) => {
        const c = r50(value(p) * 0.004);
        pcard(p, {
          title: "Property tax reassessed",
          lead: "The county reassessed the property. The tax bill went up.",
          rows: [["Extra tax", usdf(c)]],
          choices: [
            ["Pay it", () => (spend(Math.min(c, bank())), note("Paid", "Part of owning property."))],
            ["Appeal ($300)", () => (spend(Math.min(300, bank())), rnd() < 0.45 ? note("Appeal won", "The county reduces the bill.") : (spend(Math.min(c, bank())), note("Appeal lost", "You pay the bill and the fee.")))],
          ],
        });
      },
    },
    {
      id: "squat",
      vacant: true,
      w: (p) => (LL(p).vacYears >= 1 ? 1.5 : 0.4),
      run: (p) => {
        const c = r50(3500 * scale(p));
        pcard(p, {
          title: "Squatters",
          lead: "Somebody broke in and moved into your empty property. They say they have the right to stay.",
          rows: [["Lawyer", usdf(c)]],
          choices: [
            ["Hire a lawyer", () => (spend(Math.min(c, bank())) && (p.cond = cl(p.cond - 7)), note("Cleared", "It takes months, but they are out. The house is a wreck."))],
            ["Pay them to leave", () => (spend(Math.min(bank(), Math.round(c * 0.4))), p.cond = cl(p.cond - 4), note("Gone", "A grudging deal. They are out by Friday."))],
          ],
        });
      },
    },
    {
      id: "breakin_empty",
      vacant: true,
      w: () => 0.8,
      run: (p) => {
        const c = dmg(p, r50(1800 * scale(p)));
        pcard(p, {
          title: "Vacant property vandalized",
          lead: "Windows broken and graffiti on the walls. An empty house attracts trouble.",
          rows: [["Cost", usdf(c)]],
          choices: [["Clean it up", () => (spend(Math.min(c, bank())), p.cond = cl(p.cond - 4), note("Cleaned", "Boarded up and repainted."))]],
        });
      },
    },
  ];

  function pickEvent(p, vacant) {
    const t = LL(p).tenant;
    const opts = EVENTS.filter((e) => !!e.vacant === vacant)
      .map((e) => ({ e, w: vacant ? e.w(p) : t ? e.w(p, t) : 0 }))
      .filter((o) => o.w > 0);
    const tot = opts.reduce((s, o) => s + o.w, 0);
    if (!tot) return null;
    let x = rnd() * tot;
    for (const o of opts) {
      x -= o.w;
      if (x <= 0) return o.e;
    }
    return opts[0].e;
  }

  // ------------------------------------------------------------------ the yearly tick
  const queue = [];
  let running = false;
  const later = (fn) => {
    queue.push(fn);
    pump();
  };
  function pump() {
    if (running) return;
    running = true;
    const step = () => {
      const fn = queue.shift();
      if (!fn) {
        running = false;
        return;
      }
      const go = () => {
        try {
          fn();
        } catch (e) {
          warn("queue", e);
        }
        setTimeout(step, 900);
      };
      typeof whenClear === "function" ? whenClear(go) : go();
    };
    setTimeout(step, 700);
  }

  function yearProp(p, out) {
    const L = LL(p);
    // insurance premium
    if (L.ins) {
      const prem = Math.round(value(p) * 0.0035);
      if (spend(prem)) out.cost += prem;
      else L.ins = false;
    }
    // issues age and escalate
    for (const i of L.issues) {
      i.age++;
      if (i.hidden) {
        p.cond = cl(p.cond - 1);
        if (rnd() < 0.15) {
          i.hidden = false;
          i.cost = Math.round(i.cost * 1.5);
        }
      } else {
        p.cond = cl(p.cond - i.sev);
        if (i.age >= 2 && rnd() < 0.3) i.cost = Math.round(i.cost * 1.25);
      }
    }
    if (L.mode !== "rent") {
      L.vacYears++;
      L.tenant = null;
      if (rnd() < 0.1) {
        const e = pickEvent(p, true);
        e && later(() => e.run(p));
      }
      return;
    }
    const t = L.tenant;
    if (!t) {
      later(() => applicants(p, (ok) => ok && null));
      return;
    }
    // ---------- occupied
    const r = rentOf(p) / market(p);
    const open = L.issues.filter((i) => !i.hidden).reduce((s, i) => s + 4 + i.sev * 3, 0);
    t.sat = cl(t.sat + (r <= 1 ? (1 - r) * 25 : -(r - 1) * 55) - open + ri(-4, 5) + (L.mgr ? 2 : 0) - (t.pet && p.cond < 40 ? 2 : 0));
    t.tidy = cl(t.tidy + ri(-3, 2));
    p.cond = cl(p.cond - Math.round((100 - t.tidy) / 35) * (rnd() < 0.5 ? 1 : 0));
    if (L.prepaid === state.age - 1) L.prepaid = null;
    let months = 12 - Math.floor(L.lost);
    L.lost = 0;
    const lost = t.sat < 22 && rnd() < 0.7;
    if (lost) months -= ri(0, 2);
    const prepaid = L.prepaid === state.age;
    let pay = prepaid ? 0 : rentOf(p) * Math.max(0, months) * (L.mgr ? 0.9 : 1);
    pay = Math.round(pay);
    if (pay) {
      earn(pay);
      out.income += pay;
      L.earned += pay;
      G().total += pay;
    }
    t.lease--;
    // leaves?
    const wantsOut = (t.sat < 25 && rnd() < 0.7) || (t.sat < 45 && rnd() < 0.18) || (t.lease <= 0 && t.sat < 55 && rnd() < 0.5);
    if (wantsOut) {
      L.tenant = null;
      logLine(`${t.name} moved out of my ${p.name.toLowerCase()}.`);
      if (t.tidy < 40) {
        const i = newIssue(p, false);
        i.name = "Move-out damage";
        i.sev = 2;
        i.cost = r50(1500 * scale(p));
        L.issues.push(i);
      }
      later(() => note("Tenant left", `${t.name} moved out${t.sat < 40 ? " unhappy" : ""}${t.tidy < 40 ? " and left a mess" : ""}. Next year you can list it again.`));
      L.vacYears = 1;
      return;
    }
    // lease renewal
    if (t.lease <= 0) {
      if (L.mgr) {
        t.lease = ri(1, 3);
      } else
        later(() =>
          pcard(p, {
            title: "Lease renewal",
            lead: `${esc(t.name)}'s lease is up. ${t.sat >= 65 ? "They would like to stay." : "They are on the fence."}`,
            rows: [["Rent", `${usdf(rentOf(p))}/mo`], ["Mood", satLabel(t.sat)]],
            choices: [
              ["Renew, same rent", () => ((t.lease = ri(1, 3)), (t.sat = cl(t.sat + 4)), note("Renewed", "They sign again."))],
              ["Renew, +5% rent", () => ((L.rent = r10(rentOf(p) * 1.05)), (t.lease = ri(1, 3)), (t.sat = cl(t.sat - 8)), rnd() < 0.2 ? ((L.tenant = null), note("They left", "They refuse the increase and move out.")) : note("Renewed", "They sign, with a sigh."))],
              ["Do not renew", () => ((L.tenant = null), logLine(`I did not renew ${t.name}'s lease.`), note("Ended", "They have 60 days to move out."))],
            ],
          }),
        );
    }
    // new problems
    const pi = 0.16 + (100 - p.cond) / 260 + (100 - t.tidy) / 600;
    if (rnd() < pi) {
      const hidden = rnd() < 0.3;
      const i = newIssue(p, hidden);
      if (L.mgr && !hidden && i.cost <= r50(1500 * scale(p))) {
        if (spend(i.cost)) {
          out.cost += i.cost;
          p.cond = cl(p.cond + 2);
          out.mgr.push(i.name);
        } else L.issues.push(i);
      } else L.issues.push(i);
      if (!hidden && L.issues.includes(i)) later(() => pcard(p, { title: "Maintenance request", lead: `${esc(t.name)} reports: ${esc(i.name.toLowerCase())}.`, rows: [["Estimated cost", usdf(i.cost)]], choices: [["Handle it", () => repairCard(p, i)], ["Later", () => {}, "gray"]] }));
    }
    // events
    const evChance = L.mgr ? 0.35 : 0.55;
    if (rnd() < evChance) {
      const e = pickEvent(p, false);
      if (e) later(() => e.run(p, LL(p).tenant || t));
    }
  }

  function tick(force) {
    if (!enabled()) return;
    const g = G();
    if (g.tickAge === state.age && !force) return;
    g.tickAge = state.age;
    const out = { income: 0, cost: 0, mgr: [] };
    for (const p of props()) {
      try {
        yearProp(p, out);
      } catch (e) {
        warn("yearProp", e);
      }
    }
    if (out.income || out.cost) {
      logLine(`Rent collected this year: ${usdf(out.income)}${out.cost ? ` (insurance and small fixes ${usdf(out.cost)})` : ""}.`);
      later(() => note("Rental income", `${usdf(out.income)} came in from your tenants this year.${out.cost ? ` Insurance and small repairs cost ${usdf(out.cost)}.` : ""}${out.mgr.length ? ` Your manager handled: ${out.mgr.join(", ").toLowerCase()}.` : ""}`));
    }
  }

  // ------------------------------------------------------------------ boot
  function boot() {
    if (typeof state === "undefined" || typeof openAssets !== "function" || typeof jCard !== "function" || !document.getElementById("ageBtn") || typeof sList === "undefined") return setTimeout(boot, 150);
    const origAssets = window.openAssets;
    window.openAssets = function () {
      const r = origAssets.apply(this, arguments);
      try {
        const row = sList.querySelector('[data-soon="Landlord"]');
        if (row) {
          const ps = props();
          const occ = ps.filter((p) => LL(p).tenant).length;
          const sp = row.querySelector("span");
          if (sp && ps.length) sp.textContent = occ ? `${occ} tenant${occ === 1 ? "" : "s"} · ${usdf(ps.reduce((s, p) => s + (LL(p).tenant ? rentOf(p) : 0), 0))}/mo` : "Rent out your houses, manage tenants and repairs";
          row.removeAttribute("data-soon");
          row.onclick = () => {
            try {
              play("choice");
            } catch {}
            openMain();
          };
        }
      } catch (e) {
        warn("assets", e);
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
      }, 1100),
    );
    console.log("[landlord] loaded");
  }

  window.FL_LAND = {
    open: openMain,
    tick: () => tick(true),
    EVENTS,
    event: (p, id) => {
      const e = EVENTS.find((x) => x.id === id);
      const L = LL(p);
      if (!L.tenant) L.tenant = makeTenant(p, false);
      if (e) e.run(p, L.tenant);
    },
    LL,
    market,
    props,
  };
  boot();
})();
