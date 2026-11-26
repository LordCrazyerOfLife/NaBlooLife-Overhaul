/* [mod] Mental Health for NaBlooLife (local mod).
 *
 * A serious mental-health layer on top of the game's own mood system (state.mind, state.depressed, the
 * Anxiety / ADHD / PTSD illnesses). It does NOT make jokes out of anything and it never glamorizes harm.
 *
 * Conditions: major depression, generalized anxiety, ADHD, bipolar disorder (I / II) and PTSD.
 *  - Symptoms can start HIDDEN: the life gets harder before anyone names it. A professional evaluation finds
 *    them (and can miss them; bipolar is often labelled depression first, like in real life).
 *  - Each condition has a symptom load (0-100) that moves with stress, support, treatment and luck, and costs
 *    stats, job performance (or grades at school) and the people close to you.
 *  - Treatment: one therapy plan (weekly / every two weeks / monthly / support group) with a clinician you pick,
 *    plus medication per condition from a psychiatrist (response differs per person, side effects, adherence,
 *    stopping on your own backfires, antidepressants alone can tip bipolar into mania). Self-care, telling a
 *    trusted person, telling your employer and a crisis flow.
 *  - Military Expanded: combat events (IED, ambush, mortars, a buddy killed...) are trauma exposures that can
 *    become PTSD. Active duty and veterans get their care at no charge.
 *
 * Sadism is NOT a disorder here: it is a personality trait (state.mhx.sad). Violent acts feel rewarding to
 * someone with the trait: Happiness goes up, the guilt the game normally charges (state.mind) is refunded and a
 * "Remorse" meter stays low. It feeds Melon (brutality up, disguise down) and Infamous Killers / serial killer
 * (police notice up). It builds an urge you can resist, redirect, treat or act on.
 *
 * State: state.mhx (JSON only). API: FL_MH.open(), FL_MH.state(), FL_MH.give(id), FL_MH.trauma(kind, sev),
 * FL_MH.tick().
 */
(() => {
  "use strict";
  if (window.FL_MH) return;

  // ------------------------------------------------------------------ helpers
  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const cl = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const ch = (p) => rnd() < p;
  const pick = (a) => a[Math.floor(rnd() * a.length)];
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
  const warn = (where, e) => console.warn("[mental-health] " + where, e);
  const own = new Set(); // lines this mod wrote to the life log (so its own log watcher ignores them)
  const sayIt = (s) => {
    own.add(s);
    try {
      typeof say === "function" && say(s);
    } catch {}
  };
  const stats = () => state.stats || (state.stats = { Happiness: 60, Health: 80, Smarts: 50, Looks: 50 });
  const fxStats = (d) => {
    const st = stats();
    const map = { hap: "Happiness", hea: "Health", sma: "Smarts", loo: "Looks" };
    for (const k in d) if (d[k] && map[k]) st[map[k]] = cl((Number(st[map[k]]) || 0) + d[k]);
    try {
      typeof renderStats === "function" && renderStats();
    } catch {}
  };
  const era1800 = () => {
    try {
      return typeof isOldEra === "function" && isOldEra();
    } catch {
      return false;
    }
  };
  const alive = () => !!(typeof state === "object" && state && !state.dead);
  const active = () => alive() && !era1800() && !(window.FL_noMH && FL_noMH());
  const famHas = (id) => Array.isArray(state.conds) && state.conds.some((c) => c && c.id === id);
  const minor = () => state.age < 18 && typeof parentsAlive === "function" && parentsAlive().length > 0;
  const costFree = () => {
    try {
      if (typeof freeCare === "function" && freeCare()) return true;
    } catch {}
    try {
      if (typeof isMil === "function" && isMil()) return true;
    } catch {}
    return !!(state.veteran && !state.veteran.dishonorable);
  };
  const canAfford = (n) => {
    if (!n || costFree()) return true;
    try {
      return typeof canPay === "function" ? canPay(n) : (Number(state.money) || 0) >= n;
    } catch {
      return (Number(state.money) || 0) >= n;
    }
  };
  const pay = (n) => {
    if (!n || costFree()) return;
    try {
      if (typeof payMedical === "function") return payMedical(n);
    } catch {}
    state.money = Math.max(0, (Number(state.money) || 0) - n);
    try {
      renderStats();
    } catch {}
  };
  const feeTxt = (n) => (costFree() ? "No charge" : money(n));
  const LAST = ["Alvarez", "Brennan", "Okafor", "Lindqvist", "Moreau", "Tanaka", "Haddad", "Kowalski", "Ferreira", "Nakamura", "Schultz", "Rahman", "Dubois", "Castillo", "Novak"];
  const lastName = () => {
    try {
      if (typeof ulast === "function" && state.country) return ulast(state.country);
    } catch {}
    return pick(LAST);
  };

  // ------------------------------------------------------------------ state
  const S = () => {
    if (!state.mhx || typeof state.mhx !== "object") state.mhx = {};
    const m = state.mhx;
    if (!m.c || typeof m.c !== "object") m.c = {};
    if (m.stress == null) m.stress = 25;
    if (!Array.isArray(m.hist)) m.hist = [];
    if (!m.th || typeof m.th !== "object") m.th = { on: false, mode: "weekly", pro: null };
    if (!m.team || typeof m.team !== "object") m.team = { ps: null };
    if (!m.ev || typeof m.ev !== "object") m.ev = {};
    if (!Array.isArray(m.recent)) m.recent = [];
    if (!m.disc || typeof m.disc !== "object") m.disc = {};
    if (!m.sad || typeof m.sad !== "object") m.sad = { v: 0, known: false, urge: 0, guilt: 30, acts: 0, init: false };
    if (m.last == null) m.last = -1;
    if (m.care == null) m.care = -1;
    return m;
  };
  const SD = () => S().sad;
  const note = (t) => {
    const m = S();
    m.hist.unshift({ a: state.age, t });
    if (m.hist.length > 40) m.hist.length = 40;
  };

  // ------------------------------------------------------------------ catalogues
  const COND = {
    depression: {
      name: "Major depression",
      icon: "kid/face-crying.png",
      minAge: 8,
      start: [30, 65],
      therPow: 15,
      vague: "For weeks nothing has felt enjoyable. You are tired all the time, small things take huge effort and you keep cancelling plans.",
      info: "Major depression is far more than sadness. It means weeks of low mood or lost interest, exhaustion, trouble sleeping and concentrating, and sometimes thoughts of not wanting to be alive. It is common, and it is treatable: talk therapy, medication or both help most people, and it often takes a few tries to find what works.",
    },
    anxiety: {
      name: "Generalized anxiety",
      icon: "health/anxious.png",
      minAge: 6,
      start: [28, 62],
      therPow: 16,
      vague: "Your mind will not stop running worst-case scenarios. Your chest is tight most mornings and sleep comes in pieces.",
      info: "Generalized anxiety is constant worry that is hard to switch off, along with muscle tension, poor sleep and a feeling of being on edge. It drains work and relationships quietly. Cognitive behavioral therapy and SSRI medication are the first-line treatments, and both work well for many people.",
    },
    adhd: {
      name: "ADHD",
      icon: "health/brain.png",
      minAge: 5,
      start: [35, 85],
      therPow: 3,
      vague: "You cannot finish what you start, you lose things constantly, and sitting still feels almost painful. People call it laziness. It does not feel like laziness.",
      info: "ADHD is a neurodevelopmental condition: trouble sustaining attention, impulsivity and restlessness that begin in childhood and often continue into adulthood. It is not a character flaw. Stimulant medication is the best-studied treatment, and coaching, structure and behavioral therapy add to it. Without help it costs people grades, jobs and relationships.",
    },
    bipolar: {
      name: "Bipolar disorder",
      icon: "emoji/1f3ad.png",
      minAge: 14,
      start: [40, 80],
      therPow: 4,
      vague: "For days you barely slept and felt unstoppable. Lately you keep crashing hard, and people close to you look worried.",
      info: "Bipolar disorder swings between depressive episodes and manic (or milder hypomanic) episodes: very little sleep, racing thoughts, reckless decisions, then a deep crash. It is lifelong and takes years to be diagnosed correctly, because people usually seek help during the low. Mood stabilizers plus therapy and a steady routine work best. Antidepressants alone can trigger mania.",
    },
    ptsd: {
      name: "PTSD",
      icon: "emoji/1f6e1-fe0f.png",
      minAge: 4,
      start: [30, 70],
      therPow: 20,
      vague: "Since what happened, you flinch at sudden noises, you sleep badly and you steer around anything that reminds you of it.",
      info: "Post-traumatic stress disorder can follow a terrifying, violent or life-threatening event: nightmares, flashbacks, being constantly on guard, avoiding reminders and feeling cut off from people. It is not weakness. Trauma-focused therapy works for many people, some medications help, and avoiding the subject usually makes it last longer.",
    },
  };
  const ORDER = ["depression", "anxiety", "adhd", "bipolar", "ptsd"];

  const MEDS = {
    // generic fallbacks (hidden from the lists; kept so older saves still resolve)
    ssri: { hide: true, cls: "SSRI antidepressant", eg: "sertraline", power: 16, cost: [200, 700], minAge: 10, ant: true, for: { depression: 1, anxiety: 1, ptsd: 0.7 }, sides: ["nausea", "sleep", "blunting"], note: "" },
    atyp: { hide: true, cls: "Atypical antidepressant", eg: "bupropion", power: 14, cost: [250, 800], minAge: 14, ant: true, for: { depression: 0.9 }, sides: ["jitter", "sleep"], note: "" },
    // antidepressants: one entry per box in meds/ (split from the grid by _art-src/split_meds.py)
    zoloft: {
      brand: "Zoloft", cls: "SSRI", eg: "sertraline", icon: "meds/zoloft.png", power: 16, cost: [200, 600], minAge: 10, ant: true,
      for: { depression: 1, anxiety: 1, ptsd: 0.85 }, sides: ["nausea", "sleep", "libido"], tags: ["anx", "ptsd", "kid"],
      note: "The most prescribed first choice. Also treats anxiety and PTSD.",
    },
    lexapro: {
      brand: "Lexapro", cls: "SSRI", eg: "escitalopram", icon: "meds/lexapro.png", power: 16, cost: [220, 700], minAge: 12, ant: true,
      for: { depression: 1, anxiety: 1, ptsd: 0.6 }, sides: ["nausea", "blunting", "libido"], tags: ["anx"],
      note: "Well tolerated. A common pick when depression comes with anxiety.",
    },
    prozac: {
      brand: "Prozac", cls: "SSRI", eg: "fluoxetine", icon: "meds/prozac.png", power: 15, cost: [120, 450], minAge: 8, ant: true,
      for: { depression: 0.95, anxiety: 0.8, ptsd: 0.6 }, sides: ["sleep", "jitter", "nausea"], tags: ["kid", "energy"],
      note: "Long-acting, so missed doses matter less. Approved for children and teens.",
    },
    cymbalta: {
      brand: "Cymbalta", cls: "SNRI", eg: "duloxetine", icon: "meds/cymbalta.png", power: 16, cost: [350, 1100], minAge: 18, ant: true,
      for: { depression: 1, anxiety: 0.95, ptsd: 0.5 }, sides: ["nausea", "drowsy", "dry"], tags: ["anx", "severe"],
      note: "Works on two brain chemicals. Also helps nerve pain.",
    },
    effexor: {
      brand: "Effexor XR", cls: "SNRI", eg: "venlafaxine", icon: "meds/effexor.png", power: 17, cost: [250, 900], minAge: 18, ant: true,
      for: { depression: 1, anxiety: 0.9, ptsd: 0.4 }, sides: ["bp", "nausea", "sleep"], tags: ["severe", "anx"],
      note: "Strong for severe depression, but it can raise blood pressure and is hard to stop.",
    },
    wellbutrin: {
      brand: "Wellbutrin XL", cls: "Atypical (NDRI)", eg: "bupropion", icon: "meds/wellbutrin.png", power: 14, cost: [220, 800], minAge: 18, ant: true,
      for: { depression: 0.9 }, sides: ["jitter", "sleep", "nausea"], tags: ["energy", "nosex"],
      note: "No sexual side effects or weight gain, and it helps energy. Can feel activating.",
    },
    remeron: {
      brand: "Remeron", cls: "Atypical (tetracyclic)", eg: "mirtazapine", icon: "meds/remeron.png", power: 15, cost: [150, 600], minAge: 18, ant: true,
      for: { depression: 0.95, anxiety: 0.6 }, sides: ["weight", "drowsy"], tags: ["sleep", "severe"],
      note: "Helps sleep and appetite when depression has taken both. Weight gain is common.",
    },
    desyrel: {
      brand: "Desyrel", cls: "SARI", eg: "trazodone", icon: "meds/desyrel.png", power: 11, cost: [60, 300], minAge: 18, ant: true,
      for: { depression: 0.7 }, sides: ["drowsy", "dizzy"], tags: ["sleep"],
      note: "A weaker antidepressant, mostly used at low doses to help sleep.",
    },
    paxil: {
      brand: "Paxil", cls: "SSRI", eg: "paroxetine", icon: "meds/paxil.png", power: 16, cost: [150, 550], minAge: 18, ant: true,
      for: { depression: 0.95, anxiety: 1, ptsd: 0.85 }, sides: ["weight", "blunting", "libido", "drowsy"], tags: ["anx", "ptsd"],
      note: "Strong for anxiety and PTSD. The hardest SSRI to come off.",
    },
    celexa: {
      brand: "Celexa", cls: "SSRI", eg: "citalopram", icon: "meds/celexa.png", power: 15, cost: [90, 400], minAge: 12, ant: true,
      for: { depression: 0.95, anxiety: 0.85 }, sides: ["nausea", "drowsy", "libido"], tags: ["anx", "cheap"],
      note: "Effective and inexpensive. Similar to Lexapro.",
    },
    elavil: {
      brand: "Elavil", cls: "Tricyclic (TCA)", eg: "amitriptyline", icon: "meds/elavil.png", power: 17, cost: [40, 220], minAge: 18, ant: true,
      for: { depression: 1, anxiety: 0.5 }, sides: ["drowsy", "dry", "weight", "dizzy"], tags: ["severe", "sleep", "cheap"],
      note: "Old but powerful, and cheap. Many side effects, and dangerous in overdose, so it is monitored closely.",
    },
    trintellix: {
      brand: "Trintellix", cls: "Multimodal", eg: "vortioxetine", icon: "meds/trintellix.png", power: 15, cost: [900, 2600], minAge: 18, ant: true,
      for: { depression: 0.95, anxiety: 0.6 }, sides: ["nausea"], tags: ["nosex"],
      note: "Newer, with fewer sexual side effects and better concentration. Expensive.",
    },
    benzo: {
      cls: "Benzodiazepine (short-term)", eg: "lorazepam", power: 15, cost: [60, 240], minAge: 18,
      for: { anxiety: 1 }, sides: ["drowsy", "blunting"], addict: true,
      note: "Fast relief, but tolerance and dependence build with regular use.",
    },
    stim: {
      cls: "Stimulant", eg: "methylphenidate", power: 100, cost: [500, 1900], minAge: 5,
      for: { adhd: 1 }, sides: ["appetite", "sleep", "jitter"],
      note: "The best-studied ADHD treatment. Works within hours.",
    },
    nonstim: {
      cls: "Non-stimulant", eg: "atomoxetine, guanfacine", power: 100, cost: [400, 1500], minAge: 6,
      for: { adhd: 0.65 }, sides: ["drowsy", "nausea"],
      note: "Slower and gentler. An option when stimulants do not suit you.",
    },
    lithium: {
      cls: "Mood stabilizer", eg: "lithium", power: 100, cost: [250, 900], minAge: 12, stab: true, labs: true,
      for: { bipolar: 1 }, sides: ["tremor", "thirst", "weight", "blunting"],
      note: "The classic. Needs regular blood tests.",
    },
    lamo: {
      cls: "Mood stabilizer", eg: "lamotrigine, valproate", power: 100, cost: [250, 900], minAge: 12, stab: true,
      for: { bipolar: 0.9 }, sides: ["nausea", "drowsy", "weight"],
      note: "Strong against relapse, especially into depression.",
    },
    aps: {
      cls: "Atypical antipsychotic", eg: "quetiapine, lurasidone", power: 100, cost: [400, 1600], minAge: 12, stab: true,
      for: { bipolar: 1 }, sides: ["drowsy", "weight", "blunting"],
      note: "Calms mania quickly. Often paired with a mood stabilizer.",
    },
    praz: {
      cls: "Nightmare medication", eg: "prazosin", power: 12, cost: [60, 300], minAge: 14,
      for: { ptsd: 0.75 }, sides: ["dizzy"],
      note: "Cuts trauma nightmares. Use it alongside trauma therapy.",
    },
  };
  const SIDE = {
    nausea: { t: "stomach upset", hea: -1 },
    sleep: { t: "disturbed sleep", hap: -1, hea: -1 },
    blunting: { t: "feeling emotionally flat", hap: -2 },
    libido: { t: "a lower sex drive", hap: -1 },
    weight: { t: "weight gain", loo: -1, hea: -1 },
    appetite: { t: "a suppressed appetite", hea: -1 },
    jitter: { t: "jitteriness", hap: -1 },
    tremor: { t: "a hand tremor", hea: -1 },
    thirst: { t: "constant thirst", hea: -1 },
    drowsy: { t: "daytime drowsiness", perf: -3 },
    dizzy: { t: "dizziness", hea: -1 },
    dry: { t: "dry mouth", hea: -1 },
    bp: { t: "raised blood pressure", hea: -1 },
  };
  const medName = (id) => (MEDS[id].brand ? `${MEDS[id].brand} (${MEDS[id].eg})` : `${MEDS[id].cls} (${MEDS[id].eg})`);
  const medIcon = (id) => MEDS[id].icon || "emoji/1f48a.png";
  const MODES = {
    weekly: { n: "Weekly sessions", s: 40, pow: 1 },
    biweekly: { n: "Every two weeks", s: 20, pow: 0.75 },
    monthly: { n: "Monthly check-ins", s: 10, pow: 0.45 },
    group: { n: "Support group", s: 40, pow: 0.35, flat: true },
  };

  // ------------------------------------------------------------------ conditions: create / read
  const conds = () => ORDER.map((id) => S().c[id]).filter(Boolean);
  const dxOk = (r) => r.dx === true || r.dx === "wrong";
  const treatAs = (r) => (r.dx === "wrong" ? r.dxAs || "depression" : r.id);
  const dispName = (r) => COND[treatAs(r)].name;
  const sevLabel = (r) => (r.rem ? "In remission" : load(r) >= 60 ? "Severe" : load(r) >= 30 ? "Moderate" : "Mild");
  const sevColor = (v) => (v >= 60 ? "#b3261e" : v >= 30 ? "#f5841f" : "#2fa03b");
  const meds = (r) => (r.meds || []).filter((x) => x.on);

  function newCond(id, o = {}) {
    const m = S();
    if (m.c[id]) return m.c[id];
    const d = COND[id];
    const r = { id, since: state.age, lvl: o.lvl != null ? o.lvl : ri(d.start[0], d.start[1]), dx: o.dx ? true : false, rem: false, meds: [], ignored: 0 };
    if (id === "bipolar") {
      r.type = ch(0.45) ? "I" : "II";
      r.sus = ri(35, 80);
      r.phase = "stable";
      r.misdx = ch(0.45);
    }
    if (o.cause) r.cause = o.cause;
    m.c[id] = r;
    // the base game's flag means "diagnosed": only set it once somebody has named it
    if (id === "depression" && r.dx && !state.depressed) state.depressed = { since: state.age, famYears: [] };
    return r;
  }

  // adopt what the base game already decided (it keeps diagnosing depression, anxiety, ADHD and PTSD on its own)
  function adopt() {
    const m = S();
    const has = (n) => {
      try {
        return typeof hasIll === "function" && hasIll(n);
      } catch {
        return false;
      }
    };
    if (state.depressed) {
      const r = m.c.depression;
      if (!r) newCond("depression", { dx: true, lvl: ri(35, 60) });
      else if (r.rem) {
        r.rem = false;
        r.lvl = Math.max(r.lvl, 30);
      } else if (!r.dx) r.dx = true;
    }
    for (const [n, id] of [["Anxiety", "anxiety"], ["ADHD", "adhd"], ["PTSD", "ptsd"]]) {
      if (!has(n)) continue;
      let it = null;
      try {
        it = ills().find((x) => x.name === n);
      } catch {}
      const known = !it || it.known !== false; // an ill the base game has not revealed yet stays undiagnosed
      if (!m.c[id]) newCond(id, { dx: known, lvl: ri(COND[id].start[0], COND[id].start[1]) });
      else if (known && !m.c[id].dx) m.c[id].dx = true;
      if (it) {
        it.drain = 0; // this mod owns the effects now: no double drain
        if ("mood" in it) it.mood = 0;
      }
    }
  }

  // ------------------------------------------------------------------ symptom load and effects
  function mgmt(r) {
    // how much of an ADHD load is managed by treatment (0-0.85)
    let a = 0;
    meds(r).forEach((x) => (a += (MEDS[x.id].for.adhd || 0) * x.resp * 0.65));
    const m = S();
    if (m.th.on && !m.th.lapsed) a += ((m.th.pro ? m.th.pro.eff : 50) / 100) * MODES[m.th.mode].pow * 0.2;
    return Math.min(0.85, a);
  }
  function load(r) {
    if (r.rem) return Math.min(r.lvl, 8);
    if (r.id === "adhd") return r.lvl * (1 - mgmt(r));
    if (r.id === "bipolar") return r.phase === "stable" ? r.lvl * 0.3 : r.lvl;
    return r.lvl;
  }
  function therBenefit(r) {
    const m = S();
    if (!m.th.on || m.th.lapsed) return 0;
    const eff = m.th.pro ? m.th.pro.eff : 50;
    return (eff / 100) * MODES[m.th.mode].pow * COND[r.id].therPow;
  }
  function medBenefit(r) {
    let a = 0;
    meds(r).forEach((x) => (a += (MEDS[x.id].for[r.id] || 0) * x.resp * MEDS[x.id].power));
    return a;
  }
  function protection(r) {
    // bipolar: how much of the relapse risk is covered
    let a = 0;
    meds(r).forEach((x) => {
      if (MEDS[x.id].stab) a += (MEDS[x.id].for.bipolar || 0.8) * x.resp * 0.75;
    });
    const m = S();
    if (m.th.on && !m.th.lapsed) a += ((m.th.pro ? m.th.pro.eff : 50) / 100) * MODES[m.th.mode].pow * 0.15;
    return Math.min(0.85, a);
  }
  const antidepOnly = (r) => meds(r).some((x) => MEDS[x.id].ant) && !meds(r).some((x) => MEDS[x.id].stab);
  const supportCount = () => closeOnes().filter((p) => p.rel >= 70).length;

  function closeOnes() {
    const out = [];
    (state.parents || []).forEach((p) => p && !p.dead && out.push(p));
    (state.lovers || []).forEach((p) => p && out.push(p));
    (state.friends || []).forEach((p) => p && !p.away && out.push(p));
    (state.family || []).forEach((p) => p && !p.dead && (p.kind === "child" || p.kind === "sibling") && out.push(p));
    return out.filter((p) => typeof p.rel === "number");
  }

  const FX = {
    depression: (L) => ({ hap: -Math.round(12 * L), hea: -Math.round(4 * L), sma: L > 0.6 && ch(0.5) ? -1 : 0, loo: L > 0.5 && ch(0.4) ? -1 : 0, perf: Math.round(20 * L), rel: Math.round(8 * L) }),
    anxiety: (L) => ({ hap: -Math.round(8 * L), hea: -Math.round(5 * L), sma: 0, loo: 0, perf: Math.round(14 * L), rel: Math.round(4 * L) }),
    adhd: (L) => ({ hap: -Math.round(4 * L), hea: -Math.round(1.5 * L), sma: state.age >= 6 && state.age <= 21 ? -Math.round(2 * L) : 0, loo: 0, perf: Math.round(18 * L), rel: Math.round(3 * L) }),
    ptsd: (L) => ({ hap: -Math.round(9 * L), hea: -Math.round(6 * L), sma: 0, loo: 0, perf: Math.round(16 * L), rel: Math.round(9 * L) }),
    bipolar: (L, r) =>
      r.phase === "manic"
        ? { hap: Math.round(5 * L), hea: -Math.round(6 * L), sma: 0, loo: 0, perf: Math.round(12 * L), rel: Math.round(12 * L) }
        : r.phase === "depressed"
          ? { hap: -Math.round(13 * L), hea: -Math.round(4 * L), sma: L > 0.6 ? -1 : 0, loo: 0, perf: Math.round(20 * L), rel: Math.round(9 * L) }
          : { hap: 0, hea: 0, sma: 0, loo: 0, perf: Math.round(2 * L), rel: Math.round(1 * L) },
  };

  function applyAll() {
    const m = S();
    const tot = { hap: 0, hea: 0, sma: 0, loo: 0, perf: 0, rel: 0 };
    let maxL = 0;
    for (const r of conds()) {
      const L = cl(load(r), 0, 100) / 100;
      maxL = Math.max(maxL, L);
      const e = FX[r.id](L, r);
      for (const k in tot) tot[k] += e[k] || 0;
      if (r.id === "depression" && state.depressed) tot.hap += 2; // the base game already charges 1-4 a year for this
      meds(r).forEach((x) =>
        (x.side || []).forEach((s) => {
          const f = SIDE[s];
          if (!f) return;
          tot.hap += f.hap || 0;
          tot.hea += f.hea || 0;
          tot.loo += f.loo || 0;
          tot.perf += -(f.perf || 0);
        }),
      );
    }
    if (m.th.on && !m.th.lapsed) tot.hap += ri(2, 4);
    tot.hap = Math.max(-12, tot.hap); // [easy] was -22
    tot.hea = Math.max(-6, tot.hea); // [easy] was -12
    fxStats({ hap: tot.hap, hea: tot.hea, sma: Math.max(-3, tot.sma), loo: Math.max(-2, tot.loo) });

    // job performance (or grades at school)
    const acc = state.job && m.disc[jobKey()] === "ok" ? 0.6 : 1;
    const pen = Math.round(Math.max(0, tot.perf) * acc);
    if (pen) {
      try {
        if (state.job && typeof state.job.perf === "number") state.job.perf = cl(state.job.perf - pen);
        else if (state.age <= 22 && state.school && typeof state.school.grades === "number") state.school.grades = cl(state.school.grades - Math.round(pen * 0.7));
      } catch {}
    }
    // the people close to you pay for it too
    if (tot.rel > 0 && maxL >= 0.25) {
      const ones = closeOnes();
      const n = Math.min(3, 1 + Math.floor(maxL * 3));
      const calm = m.th.on && !m.th.lapsed ? 0.6 : 1;
      for (let i = 0; i < n && ones.length; i++) {
        const p = ones.splice(ri(0, ones.length - 1), 1)[0];
        if (ch(0.6)) p.rel = cl(p.rel - ri(1, Math.max(1, Math.round(tot.rel * calm))));
      }
    }
  }
  const jobKey = () => (state.job ? `${state.job.emp || state.job.c || "job"}|${state.job.t || ""}` : "");

  // [mod] the game's own Mental Health bar: when it is high, the disorder events and onsets should be rare
  const mhBar = () => {
    let v = NaN;
    try {
      if (typeof mindOf === "function") v = Number(mindOf().mh); // the "Mental Health" bar of the base game
    } catch {}
    if (!Number.isFinite(v)) v = Number(stats()["Mental Health"]);
    return Number.isFinite(v) ? v : 50;
  };
  const mhCalm = () => (mhBar() >= 85 ? 0.1 : mhBar() >= 70 ? 0.35 : mhBar() >= 55 ? 0.7 : 1);

  // ------------------------------------------------------------------ stress
  function updateStress() {
    const m = S();
    let t = 16; // [easy] was 25
    const st = stats();
    t += (60 - (Number(st.Happiness) || 60)) * 0.22;
    if (state.prison) t += 18;
    if (!state.job && state.age >= 25 && state.age < 62) t += 6;
    if (state.age >= 20 && (Number(state.money) || 0) < 1000 * ifx()) t += 8;
    t -= Math.min(15, supportCount() * 4);
    if (state.age >= 14 && closeOnes().length === 0) t += 8;
    try {
      t += Math.min(8, (typeof ills === "function" ? ills() : []).filter((x) => !/Depression|Anxiety|ADHD|PTSD/.test(x.name)).length * 2);
    } catch {}
    try {
      if (typeof isMil === "function" && isMil()) t += 6;
    } catch {}
    m.recent = m.recent.filter((x) => state.age - x.a <= 3);
    m.recent.forEach((x) => (t += (x.s / 100) * 9 * (1 - (state.age - x.a) / 4)));
    if (m.th.on && !m.th.lapsed) t -= 6;
    t -= Math.max(0, mhBar() - 50) * 0.35; // a healthy mind lowers stress
    t = cl(t);
    m.stress = Math.round(cl(m.stress + (t - m.stress) * 0.5));
  }

  // ------------------------------------------------------------------ onset
  function onsets() {
    const m = S();
    const age = state.age;
    const hasOne = (id) => !!m.c[id];
    if (!m.adhdRoll && age >= 5) {
      m.adhdRoll = true;
      if (age <= 16 && !hasOne("adhd") && ch(0.06 + (famHas("adhd") ? 0.12 : 0))) newCond("adhd", { dx: false });
    }
    let pDep = 0.6 * (0.008 + 0.0012 * Math.max(0, m.stress - 40) + ((Number(stats().Happiness) || 60) < 35 ? 0.03 : 0) + (famHas("depression") ? 0.04 : 0));
    if (m.recent.some((x) => x.k === "loss" || x.k === "violence" || x.k === "abuse")) pDep += 0.05;
    if (m.c.ptsd) pDep += 0.05;
    if (SD().guilt >= 70) pDep += 0.04;
    if (age < 12) pDep *= 0.3;
    if (age >= COND.depression.minAge && !hasOne("depression") && !state.depressed && ch(cl(pDep * mhCalm(), 0, 0.35))) newCond("depression", { dx: false });

    let pAnx = 0.6 * (0.01 + 0.0015 * Math.max(0, m.stress - 35) + (famHas("anxiety") || famHas("panic") ? 0.04 : 0) + (m.c.adhd ? 0.03 : 0));
    if (age < 10) pAnx *= 0.5;
    if (age >= COND.anxiety.minAge && !hasOne("anxiety") && ch(cl(pAnx * mhCalm(), 0, 0.3))) newCond("anxiety", { dx: false });

    if (age >= 15 && age <= 38 && !hasOne("bipolar")) {
      const pBi = 0.6 * (0.0025 + (m.stress > 60 ? 0.002 : 0) + (famHas("bipolar") ? 0.02 : 0));
      if (ch(pBi * mhCalm())) newCond("bipolar", { dx: false });
    }
  }

  // trauma exposure (combat events, violence, abuse, loss, accidents...) can become PTSD
  function trauma(kind, sev) {
    if (!active() || state.age < 3) return;
    const m = S();
    sev = cl(Number(sev) || 30, 5, 100);
    m.stress = cl(m.stress + sev * 0.35);
    m.recent.push({ a: state.age, k: kind, s: sev });
    m.trauma = (m.trauma || 0) + 1;
    if (kind === "combat") m.combat = (m.combat || 0) + 1;
    fxStats({ hap: -Math.round(sev / 14) });
    let p = 0.07 + sev / 180 + (m.stress > 60 ? 0.06 : 0) + (m.c.depression ? 0.04 : 0) + (famHas("ptsd") ? 0.07 : 0) + (supportCount() === 0 ? 0.08 : 0);
    if (kind === "combat" && m.combat >= 3) p += 0.08;
    if (kind === "loss") p *= 0.4;
    p = cl(p, 0.04, 0.6);
    const r = m.c.ptsd;
    if (r) {
      r.lvl = cl(r.lvl + (sev * ri(15, 35)) / 100);
      if (r.rem) r.rem = false;
    } else if (ch(p) && m.ptsdYear !== state.age) {
      m.ptsdYear = state.age;
      newCond("ptsd", { dx: false, lvl: cl((sev * ri(70, 115)) / 100, 25, 90), cause: kind });
    }
  }

  // ------------------------------------------------------------------ yearly progression
  function stepConds() {
    const m = S();
    for (const r of conds()) {
      const push = Math.max(0, m.stress - 45) * 0.2;
      const wasRem = r.rem;
      if (r.id === "depression") {
        r.lvl = cl(r.lvl + push - 4 + ri(-2, 3) - therBenefit(r) - medBenefit(r));
        if (r.ignored) r.lvl = cl(r.lvl + Math.min(6, r.ignored));
      } else if (r.id === "anxiety") {
        r.lvl = cl(r.lvl + push * 1.2 - 1 + ri(-2, 3) - therBenefit(r) - medBenefit(r));
      } else if (r.id === "ptsd") {
        const treated = therBenefit(r) + medBenefit(r) > 0;
        r.lvl = cl(r.lvl + push - (r.avoid ? 1 : 4) + ri(-2, 3) - therBenefit(r) - medBenefit(r));
        if (!treated && state.age - r.since >= 3) r.lvl = Math.max(r.lvl, 18);
      } else if (r.id === "adhd") {
        r.lvl = cl(r.lvl + ri(-1, 1));
      } else if (r.id === "bipolar") {
        stepBipolar(r);
      }
      // remission / relapse (adhd and bipolar are lifelong)
      if (r.id !== "adhd" && r.id !== "bipolar") {
        if (!r.rem && r.lvl < 10 && state.age - r.since >= 1) {
          r.rem = true;
          if (r.id === "depression") state.depressed = null;
          if (r.id === "anxiety" || r.id === "ptsd") dropIll(r.id === "anxiety" ? "Anxiety" : "PTSD");
          if (dxOk(r)) {
            sayIt(`My ${COND[r.id].name.toLowerCase()} went into remission.`);
            note(`${COND[r.id].name} went into remission.`);
            remissionCard(r);
          }
        } else if (r.rem && r.lvl >= 25) {
          r.rem = false;
          if (dxOk(r)) {
            if (r.id === "depression" && !state.depressed) state.depressed = { since: state.age, famYears: [] };
            sayIt(`My ${COND[r.id].name.toLowerCase()} came back.`);
            note(`${COND[r.id].name} relapsed.`);
            card({ iconSrc: COND[r.id].icon, title: "Symptoms are back", lead: `Your ${COND[r.id].name.toLowerCase()} has returned after a stretch of feeling better. Relapse is common and it is not a failure. Getting back into treatment early makes a big difference.`, ok: () => {} });
          }
        }
      }
      if (wasRem && r.rem) r.lvl = Math.min(r.lvl, 8);
      // medication bookkeeping
      meds(r).forEach((x) => {
        x.yrs = (x.yrs || 0) + 1;
        if (MEDS[x.id].addict && x.yrs >= 2 && !x.warned && ch(0.25)) {
          x.warned = true;
          try {
            if (typeof addictions === "function" && !addictions().includes("pills")) {
              addictions().push("pills");
              sayIt("I realized I could not get through the week without my pills.");
              card({ iconSrc: "emoji/1f48a.png", title: "Dependence", lead: "Benzodiazepines work fast, but taking them regularly builds tolerance and dependence. You have found out the hard way. Talk to your psychiatrist about tapering safely; stopping suddenly can be dangerous.", ok: () => {} });
            }
          } catch {}
        }
      });
    }
  }
  function stepBipolar(r) {
    const m = S();
    const prot = protection(r);
    let p = cl(0.1 + r.sus / 220 + Math.max(0, m.stress - 45) / 250, 0.05, 0.6) * (1 - prot);
    const ao = antidepOnly(r);
    if (ao) p += 0.22;
    if (r.relapseBoost) {
      p += r.relapseBoost;
      r.relapseBoost = 0;
    }
    if (ch(cl(p, 0, 0.9))) {
      const manicP = (r.type === "I" ? 0.55 : 0.3) + (ao ? 0.25 : 0);
      r.phase = ch(manicP) ? "manic" : "depressed";
      r.lvl = cl(ri(45, 90) * (1 - prot * 0.5) * (r.type === "II" && r.phase === "manic" ? 0.6 : 1), 15, 95);
      r.eps = (r.eps || 0) + 1;
      if (r.phase === "manic" && ao) r.switched = true;
      note(r.phase === "manic" ? "A manic episode." : "A depressive episode.");
    } else {
      r.phase = "stable";
      r.lvl = Math.max(6, r.lvl * 0.4);
    }
    if (r.phase === "depressed") meds(r).forEach((x) => MEDS[x.id].ant && (r.lvl = cl(r.lvl - x.resp * 6)));
  }
  function dropIll(name) {
    try {
      if (typeof ills === "function") state.ills = ills().filter((x) => x.name !== name);
    } catch {}
  }

  // ------------------------------------------------------------------ yearly cost of care
  function annualCost() {
    const m = S();
    let total = 0;
    if (m.th.on && !m.th.lapsed) {
      const md = MODES[m.th.mode];
      total += md.s * (md.flat ? price(12) : m.th.pro ? m.th.pro.fee : price(120));
    }
    let any = false;
    conds().forEach((r) =>
      meds(r).forEach((x) => {
        any = true;
        total += x.cost || 0;
        if (MEDS[x.id].labs) total += price(150);
      }),
    );
    if (any) total += 4 * (m.team.ps ? m.team.ps.fee : price(400));
    return total;
  }
  function payCare() {
    const m = S();
    const total = annualCost();
    if (!total) return;
    if (state.prison) {
      m.th.lapsed = true;
      return;
    }
    if (!canAfford(total)) {
      m.th.lapsed = true;
      conds().forEach((r) => meds(r).forEach((x) => (x.on = false)));
      note("Could not afford treatment.");
      card({ iconSrc: "emoji/1f4b8.png", title: "Treatment lapsed", lead: `Your care this year would have cost ${money(total)} and you could not cover it. Therapy and medication stopped. Stopping abruptly can set symptoms back; restart treatment from the Mental Health screen once you can.`, ok: () => {} });
      return;
    }
    pay(total);
    m.th.lapsed = false;
  }

  // ------------------------------------------------------------------ cards
  const card = (o) => {
    const run = () => {
      try {
        jCard({ tag: "Mental Health", ...o });
      } catch (e) {
        warn("card", e);
      }
    };
    if (typeof queuePopup === "function") queuePopup(run);
    else setTimeout(run, 300);
  };
  const now = (o) => {
    try {
      jCard({ tag: "Mental Health", ...o });
    } catch (e) {
      warn("now", e);
    }
  };
  function remissionCard(r) {
    card({ iconSrc: "found/dove.png", title: "In remission", lead: `Your ${COND[r.id].name.toLowerCase()} has eased enough that you are in remission. Staying in treatment for a while longer lowers the risk of it returning.`, ok: () => {} });
  }

  // ------------------------------------------------------------------ professionals
  function candidates(kind) {
    const base = kind === "ps" ? [160, 340] : [90, 190];
    return [
      { tier: "clinic", label: kind === "ps" ? "Community clinic psychiatrist" : "Community clinic counselor", fee: price(Math.round(ri(base[0], base[1]) * 0.35)), eff: ri(15, 62) },
      { tier: "private", label: kind === "ps" ? "Private practice psychiatrist" : "Private practice therapist", fee: price(ri(base[0], base[1])), eff: ri(30, 88) },
      { tier: "specialist", label: kind === "ps" ? "Specialist in mood and trauma" : "Specialist in trauma and ADHD", fee: price(Math.round(ri(base[0], base[1]) * 1.8)), eff: ri(55, 98) },
    ].map((c) => ({ ...c, kind, name: (kind === "ps" ? "Dr. " : "") + lastName() }));
  }
  function pickPro(kind, cb, back) {
    const cur = kind === "ps" ? S().team.ps : S().th.pro;
    const cs = candidates(kind);
    const choices = cs.map((c) => [`${c.label} · ${feeTxt(c.fee)}/visit`, () => cb(c)]);
    if (cur) choices.unshift([`Keep ${cur.name}`, () => cb(cur)]);
    choices.push(["Not now", back || (() => {})]);
    now({
      iconSrc: "emoji/1fa7a.png",
      title: kind === "ps" ? "Find a psychiatrist" : "Find a therapist",
      lead: kind === "ps" ? "A psychiatrist can diagnose and prescribe. Fit matters as much as credentials; a better fit means better results." : "The relationship with your therapist is one of the strongest predictors of progress. Specialists cost more and tend to help more.",
      rows: cs.map((c) => [c.label, `${c.name} · ${feeTxt(c.fee)}/visit`]),
      choices,
    });
  }
  const parentsAgree = () => {
    const m = S();
    if (!minor()) return true;
    if (m.denied === state.age) {
      now({ iconSrc: "emoji/1f6cb-fe0f.png", title: "Not this year", lead: "Your parents already said no this year. You can ask again next year.", ok: () => {} });
      return false;
    }
    if (ch(0.28)) {
      m.denied = state.age;
      sayIt("I asked my parents for help, but they said I was fine.");
      now({ iconSrc: "emoji/1f6cb-fe0f.png", title: "Turned down", lead: "Your parents do not think anything is wrong and said no. A school counselor is a place to try next, and you can ask again next year.", ok: () => {} });
      return false;
    }
    return true;
  };

  // ------------------------------------------------------------------ evaluation (diagnosis)
  function openEvaluation() {
    const m = S();
    if (!parentsAgree()) return;
    const cs = candidates("th");
    const ps = candidates("ps")[1];
    ps.label = "Psychiatric evaluation (psychiatrist)";
    const all = [cs[0], cs[1], ps];
    now({
      iconSrc: "emoji/1fa7a.png",
      title: "Get evaluated",
      lead: "A professional assessment can name what is going on, and it can also miss things. Psychiatrists are the most reliable for mood disorders, but they are not cheap.",
      rows: all.map((c) => [c.label, `${c.name} · ${feeTxt(c.fee)}`]),
      choices: [
        ...all.map((c) => [`${c.label} · ${feeTxt(c.fee)}`, () => runEval(c)]),
        ["Not now", () => {}],
      ],
    });
  }
  function runEval(c) {
    const m = S();
    if (!canAfford(c.fee)) return notice("Can't afford it", "You cannot pay for this visit right now.", null, true);
    pay(c.fee);
    const hidden = conds().filter((r) => !dxOk(r));
    const p = cl(0.45 + c.eff / 200 + (c.kind === "ps" ? 0.12 : 0), 0.3, 0.97);
    const found = [];
    hidden.forEach((r) => {
      if (!ch(p)) return;
      if (r.id === "bipolar" && r.misdx && !(c.kind === "ps" && ch(0.4 + c.eff / 250))) {
        r.dx = "wrong";
        r.dxAs = "depression";
      } else r.dx = true;
      if (r.id === "depression" && r.dx === true && !state.depressed) state.depressed = { since: state.age, famYears: [] };
      found.push(r);
      sayIt(`I was diagnosed with ${dispName(r).toLowerCase()}.`);
      note(`Diagnosed: ${dispName(r)}.`);
    });
    snd("choice");
    if (found.length) {
      now({
        iconSrc: COND[treatAs(found[0])].icon,
        title: "Diagnosis",
        lead: `${c.name} went through your history and symptoms. Having a name for it is the first step: you can now plan treatment.`,
        rows: found.map((r) => ["Diagnosis", dispName(r)]),
        choices: [["Open Mental Health", () => openMH()], ["Later", () => {}]],
      });
    } else if (hidden.length) {
      m.stress = cl(m.stress - 3);
      now({ iconSrc: "emoji/1f6cb-fe0f.png", title: "Nothing conclusive", lead: `${c.name} found nothing definite and suggested watching how things go. Symptoms that keep affecting your life are worth a second look.`, ok: () => {} });
    } else {
      m.stress = cl(m.stress - 5);
      now({ iconSrc: "emoji/1f6cb-fe0f.png", title: "No disorder found", lead: `${c.name} found no mental health condition. What you are feeling fits stress and a hard stretch, and it is real and worth looking after.`, ok: () => {} });
    }
  }
  function secondOpinion(r) {
    const m = S();
    const go = (ps) => {
      m.team.ps = ps;
      if (!canAfford(ps.fee)) return notice("Can't afford it", "You cannot pay for this visit right now.", null, true);
      pay(ps.fee);
      if (r.dx === "wrong" && ch(0.3 + ps.eff / 250 + (r.switched ? 0.5 : 0))) {
        r.dx = true;
        delete r.dxAs;
        sayIt("I was re-diagnosed with bipolar disorder.");
        note("Re-diagnosed: bipolar disorder.");
        now({
          iconSrc: COND.bipolar.icon,
          title: "A different diagnosis",
          lead: `${ps.name} looked at the whole picture, including the high periods you had not thought to mention. This is bipolar disorder, not depression alone. It explains why antidepressants did not hold, and treatment changes: a mood stabilizer matters most.`,
          choices: [["Review treatment", () => openCond(r)], ["Later", () => {}]],
        });
      } else {
        now({ iconSrc: "emoji/1f6cb-fe0f.png", title: "Second opinion", lead: `${ps.name} agrees with the current diagnosis for now. Tell your clinicians about any periods of very little sleep, racing thoughts or reckless spending; those change the picture.`, ok: () => {} });
      }
    };
    if (m.team.ps) go(m.team.ps);
    else pickPro("ps", go, () => openCond(r));
  }

  // ------------------------------------------------------------------ therapy
  function openTherapy() {
    const m = S();
    const th = m.th;
    const md = MODES[th.mode] || MODES.weekly;
    const costOf = (mode, pro) => {
      const x = MODES[mode];
      return x.s * (x.flat ? price(12) : pro ? pro.fee : price(120));
    };
    const rows = th.on
      ? [["Plan", md.n], ["Therapist", th.pro ? `${th.pro.name} (${th.pro.label})` : "Support group"], ["Yearly cost", feeTxt(costOf(th.mode, th.pro))], ...(th.lapsed ? [["Status", "Paused (could not pay)"]] : [])]
      : [["Plan", "No therapy right now"]];
    const start = (mode) => {
      if (mode === "group") return begin(mode, null);
      if (th.pro) return begin(mode, th.pro);
      pickPro("th", (pro) => begin(mode, pro), openTherapy);
    };
    const begin = (mode, pro) => {
      if (!parentsAgree()) return;
      const cost = costOf(mode, pro);
      if (!canAfford(cost)) return notice("Can't afford it", `A year of this costs ${money(cost)}. You cannot cover it right now.`, null, true);
      th.on = true;
      th.mode = mode;
      th.pro = pro;
      th.lapsed = false;
      sayIt(pro ? `I started seeing ${pro.name} for therapy.` : "I joined a support group.");
      note(pro ? `Started therapy with ${pro.name}.` : "Joined a support group.");
      snd("choice");
      notice("Therapy", pro ? `You start seeing ${pro.name}. Progress is gradual; the first sessions are often the hardest.` : "You join a peer support group. It will not replace treatment, but it helps to hear you are not alone.", () => openMH(), true);
    };
    const choices = Object.keys(MODES).map((k) => [`${MODES[k].n} · ${feeTxt(costOf(k, th.pro))}/yr`, () => start(k)]);
    if (th.pro && th.mode !== "group") choices.push([`Change therapist`, () => pickPro("th", (pro) => begin(th.mode, pro), openTherapy)]);
    if (th.on) choices.push(["Stop therapy", () => {
      th.on = false;
      note("Stopped therapy.");
      sayIt("I stopped going to therapy.");
      openMH();
    }]);
    choices.push(["Back", () => openMH()]);
    now({
      iconSrc: "emoji/1f6cb-fe0f.png",
      title: "Therapy",
      lead: "Talk therapy works for depression, anxiety and trauma, and it supports every other treatment. More frequent sessions and a better-matched therapist help more. Costs are per year.",
      rows,
      choices,
    });
  }

  // ------------------------------------------------------------------ medication
  function eligibleMeds(r) {
    const t = treatAs(r);
    return Object.keys(MEDS).filter((k) => {
      const d = MEDS[k];
      if (d.hide || state.age < d.minAge) return false;
      if (r.dx === "wrong") return !!d.for[t] && !d.stab;
      return !!d.for[r.id] && !meds(r).some((x) => x.id === k);
    });
  }
  function openMeds(r) {
    const m = S();
    if (!m.team.ps) return pickPro("ps", (ps) => ((m.team.ps = ps), openMeds(r)), () => openCond(r));
    if (!parentsAgree()) return;
    const list = eligibleMeds(r);
    if (!list.length) return now({ iconSrc: "emoji/1f48a.png", title: "Medication", lead: "There is nothing more to add for you right now.", ok: () => openCond(r) });
    openMedList(r, list);
  }

  // The psychiatrist's pick: weighs your other conditions, age, what already failed you and why. A weaker
  // clinician gets noisier (they can recommend something that fits you less well).
  function recommend(r, list) {
    const m = S();
    const t = treatAs(r);
    const ps = m.team.ps || { eff: 50 };
    const act = (id) => m.c[id] && !m.c[id].rem;
    const bad = r.bad || [];
    const tried = r.tried || [];
    let best = null;
    list.forEach((k) => {
      const d = MEDS[k];
      const tg = d.tags || [];
      const why = [];
      let s = (d.for[t] || 0) * 10 + (d.power || 0) / 20;
      if (act("anxiety") && tg.includes("anx")) (s += 3), why.push("it also treats your anxiety");
      if (act("ptsd") && tg.includes("ptsd")) (s += 3), why.push("it helps with trauma symptoms");
      if (act("adhd") && tg.includes("energy")) (s += 2), why.push("it helps energy and focus");
      if ((m.stress >= 60 || load(r) >= 60) && tg.includes("sleep")) (s += 2.5), why.push("it helps sleep and appetite");
      if (load(r) >= 60 && tg.includes("severe")) (s += 2), why.push("your depression is severe and this is a stronger option");
      if (state.age < 18) tg.includes("kid") ? ((s += 4), why.push("it is the usual choice for young people")) : (s -= 3);
      if (tried.includes(k)) s -= 6;
      const clash = d.sides.filter((x) => bad.includes(x)).length;
      if (clash) (s -= 2 * clash), why.push("");
      if (bad.includes("libido") && tg.includes("nosex")) (s += 3), why.push("it avoids the sexual side effects that bothered you before");
      if (bad.includes("weight") && tg.includes("nosex")) s += 1;
      if (!costFree() && tg.includes("cheap")) (s += 1), why.push("it is affordable");
      s += rnd() * ((100 - ps.eff) / 22);
      if (!best || s > best.s) best = { id: k, s, why: why.filter(Boolean).slice(0, 2) };
    });
    return best;
  }
  function openMedList(r, list) {
    const m = S();
    const rec = recommend(r, list);
    m.recMed = rec ? rec.id : null;
    snd("choice");
    sTitle.textContent = "MEDICATION";
    if (typeof sSub !== "undefined" && sSub && sSub.style) sSub.style.display = "none";
    sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;";
    sBack.onclick = () => openCond(r);
    const row = (k, star) => {
      const d = MEDS[k];
      return `<div class="row" data-med="${k}"><img src="${medIcon(k)}" alt="" style="object-fit:contain;width:64px;height:48px"><div class="t"><b>${esc(d.brand || d.cls)}${star ? " · Recommended" : ""}</b><span>${esc(d.cls)} · ${esc(d.eg)}<br>${esc(d.note)}</span></div>${chev()}</div>`;
    };
    let h = "";
    if (rec) {
      h += `<div class="sec">${esc(m.team.ps.name)} recommends</div>` + row(rec.id, true);
      h += `<div class="mm-foot" style="padding:6px 14px;text-align:left">${rec.why.length ? "Why: " + esc(rec.why.join(" and ")) + "." : "A sensible first step for you."} How well any drug works still varies from person to person.</div>`;
    }
    h += `<div class="sec">All options for ${esc(dispName(r).toLowerCase())}</div>` + list.filter((k) => !rec || k !== rec.id).map((k) => row(k, false)).join("");
    sList.innerHTML = h;
    sList.querySelectorAll("[data-med]").forEach((el) => (el.onclick = () => medDetail(r, el.dataset.med)));
    sList.scrollTop = 0;
    screen.classList.add("open");
  }
  function medDetail(r, k) {
    const d = MEDS[k];
    const m = S();
    const isRec = m.recMed === k;
    now({
      iconSrc: medIcon(k),
      title: d.brand || d.cls,
      lead: `${d.cls} · ${d.eg}. ${d.note}${isRec ? ` ${m.team.ps.name} recommends this one for you.` : ""}`,
      rows: [
        ["Common side effects", d.sides.map((s) => SIDE[s].t).join(", ")],
        ["Treats", Object.keys(d.for).map((c) => COND[c].name).join(", ")],
        ["Typical yearly cost", feeTxt(Math.round(price(Math.round((d.cost[0] + d.cost[1]) / 2))))],
      ],
      choices: [[`Start ${d.brand || d.cls}`, () => startMed(r, k)], ["Back to the list", () => openMeds(r)]],
    });
  }
  function startMed(r, k) {
    const d = MEDS[k];
    const bonus = S().recMed === k ? 0.1 * ((S().team.ps ? S().team.ps.eff : 50) / 100) : 0; // a better match responds a bit better
    const x = { id: k, resp: Math.min(0.95, 0.25 + rnd() * 0.65 + bonus), on: true, yrs: 0, side: [], cost: price(ri(d.cost[0], d.cost[1])), since: state.age };
    (r.tried = r.tried || []).includes(k) || r.tried.push(k);
    d.sides.forEach((s) => x.side.length < 2 && ch(0.24) && x.side.push(s));
    if (!r.meds) r.meds = [];
    r.meds.push(x);
    const m = S();
    const cost = annualCost();
    if (!canAfford(cost)) {
      r.meds.pop();
      return notice("Can't afford it", `Your total yearly care would come to ${money(cost)}. You cannot cover it right now.`, null, true);
    }
    sayIt(`I started taking ${d.brand || d.eg.split(",")[0]}.`);
    note(`Started ${d.brand || d.cls}.`);
    snd("choice");
    now({
      iconSrc: medIcon(k),
      title: "Medication started",
      lead: `${m.team.ps.name} prescribes ${medName(k)}, a ${d.cls}. ${d.note} Take it as directed and do not stop suddenly without talking to your psychiatrist.`,
      rows: [["Yearly cost (with visits)", feeTxt(annualCost())]],
      ok: () => openCond(r),
    });
  }
  function reviewMed(r, x, why) {
    const d = MEDS[x.id];
    const sideTxt = (x.side || []).map((s) => SIDE[s].t).join(" and ");
    now({
      iconSrc: medIcon(x.id),
      title: "Medication review",
      lead: why || `Time to review your medication (${medName(x.id)}). ${sideTxt ? `You have noticed ${sideTxt}.` : "You are not noticing side effects."}`,
      rows: [["Medication", `${medName(x.id)} · ${d.cls}`], ["Taking it for", `${x.yrs || 0} year${x.yrs === 1 ? "" : "s"}`], ["Side effects", sideTxt || "None noticed"]],
      choices: [
        ["Keep taking it", () => {
          x.asked = state.age;
        }],
        ["Switch with my psychiatrist", () => {
          x.on = false;
          rememberBad(r, x);
          note("Switched medication.");
          sayIt("My psychiatrist and I changed my medication.");
          openMeds(r);
        }],
        ["Taper off with my psychiatrist", () => stopMed(r, x, "taper")],
        ["Stop on my own", () => stopMed(r, x, "cold")],
      ],
    });
  }
  // side effects that made you drop a drug: the psychiatrist avoids them next time
  function rememberBad(r, x) {
    r.bad = r.bad || [];
    (x.side || []).forEach((s) => r.bad.includes(s) || r.bad.push(s));
  }
  function stopMed(r, x, how) {
    const d = MEDS[x.id];
    x.on = false;
    rememberBad(r, x);
    note(how === "taper" ? "Tapered off medication." : "Stopped medication abruptly.");
    if (how === "cold") {
      r.lvl = cl(r.lvl + ri(10, 25));
      if (r.id === "bipolar") r.relapseBoost = 0.25;
      if (d.ant) fxStats({ hap: -3 });
      sayIt("I stopped taking my medication on my own.");
      card({ iconSrc: "emoji/1f48a.png", title: "Stopping suddenly", lead: "Coming off medication abruptly often brings symptoms back harder, plus withdrawal-like effects. Feeling better usually means the medication is working, not that it is no longer needed.", ok: () => {} });
    } else {
      r.lvl = cl(r.lvl + ri(0, 6));
      sayIt("I tapered off my medication with my psychiatrist.");
    }
    if (typeof sTitle !== "undefined" && sTitle.textContent === "MENTAL HEALTH") openMH();
  }

  // ------------------------------------------------------------------ condition card
  function openCond(r) {
    const m = S();
    const L = Math.round(load(r));
    const ms = meds(r);
    const choices = [];
    if (!r.rem || ms.length) choices.push([m.th.on ? "Therapy plan" : "Start therapy", () => openTherapy()]);
    if (eligibleMeds(r).length) choices.push(["Start medication", () => openMeds(r)]);
    ms.forEach((x) => choices.push([`Review: ${MEDS[x.id].brand || MEDS[x.id].cls}`, () => reviewMed(r, x)]));
    if (r.dx === "wrong" || (r.id === "bipolar" && dxOk(r)) || (r.id === "depression" && ms.length && !ms.some((x) => x.resp > 0.5))) choices.push(["Ask for a second opinion", () => secondOpinion(r)]);
    choices.push(["Learn about it", () => now({ iconSrc: COND[treatAs(r)].icon, title: dispName(r), lead: COND[treatAs(r)].info, ok: () => openCond(r) })]);
    choices.push(["Back", () => openMH()]);
    now({
      iconSrc: COND[treatAs(r)].icon,
      title: dispName(r),
      lead: r.id === "bipolar" && r.dx === true ? `Bipolar ${r.type}. ${r.phase === "manic" ? "You are in a manic phase." : r.phase === "depressed" ? "You are in a depressive phase." : "You are stable at the moment."}` : r.rem ? "In remission. Staying in treatment lowers the risk of relapse." : "Symptoms respond to treatment. Keep at it.",
      rows: [
        ["Severity", sevLabel(r)],
        ["Since", `age ${r.since}`],
        ["Therapy", m.th.on && !m.th.lapsed ? `${MODES[m.th.mode].n}${m.th.pro ? " with " + m.th.pro.name : ""}` : "None"],
        ["Medication", ms.length ? ms.map((x) => MEDS[x.id].brand || MEDS[x.id].cls).join(", ") : "None"],
      ],
      bars: [["Symptoms", Math.max(3, L), sevColor(L)]],
      choices,
    });
  }

  // ------------------------------------------------------------------ self care, support
  function selfCare() {
    const m = S();
    if (m.care === state.age) return now({ iconSrc: "emoji/1f9d8.png", title: "Self-care", lead: "You already made time for yourself this year. Small habits matter, and they work through repetition over the years.", ok: () => {} });
    const done = (txt, st, extra) => {
      m.care = state.age;
      m.stress = cl(m.stress - st);
      conds().forEach((r) => (r.id === "depression" || r.id === "anxiety" ? (r.lvl = cl(r.lvl - 2)) : 0));
      if (extra) extra();
      snd("choice");
      notice("Self-care", txt, () => openMH(), true);
    };
    now({
      iconSrc: "emoji/1f9d8.png",
      title: "Self-care",
      lead: "Once a year you can commit to one habit. It does not replace treatment, but it makes everything else work better.",
      choices: [
        ["Exercise regularly", () => done("You build a routine of regular exercise. Your body and your mood thank you.", 6, () => fxStats({ hea: ri(2, 4) }))],
        ["Fix my sleep", () => done("Consistent bedtimes and less screen time. Your days feel less heavy.", 6, () => fxStats({ hap: ri(1, 3) }))],
        ["Mindfulness and journaling", () => done("A few quiet minutes a day to sort your thoughts. It helps you notice patterns before they spiral.", 5, () => conds().forEach((r) => r.id === "ptsd" && (r.lvl = cl(r.lvl - 2))))],
        ["Reconnect with someone", () => {
          const ones = closeOnes();
          done("You make time for someone who matters. Being seen and heard is protective.", 5, () => ones.length && (pick(ones).rel = cl(pick(ones).rel + ri(4, 10))));
        }],
        ["Back", () => {}],
      ],
    });
  }
  function talkToSomeone(next) {
    const ones = closeOnes();
    if (!ones.length) return notice("Nobody close", "You do not have anyone close enough to talk to right now. A support group or a crisis line are good places to start.", null, true);
    const p = ones.sort((a, b) => b.rel - a.rel)[0];
    p.rel = cl(p.rel + ri(3, 8));
    const m = S();
    m.stress = cl(m.stress - 6);
    conds().forEach((r) => ((r.id === "depression" || r.id === "anxiety") && (r.lvl = cl(r.lvl - 3))));
    notice("You opened up", "You finally told someone close to you how bad things have been. They listened, and they did not judge you. It does not fix everything, but the weight is lighter.", next || null, true);
  }

  // ------------------------------------------------------------------ the Mental Health screen
  function barOld(label, v, color) {
    return `<div style="margin:3px 0"><span style="font-size:12px;opacity:.8">${esc(label)} ${Math.round(v)}%</span><i style="display:block;height:7px;border-radius:4px;background:#0002;overflow:hidden;margin-top:2px"><u style="display:block;height:100%;width:${Math.max(3, v)}%;background:${color}"></u></i></div>`;
  }
  function bar(label, v, color) {
    return window.FL_BARS ? FL_BARS.html(label, v, color) : barOld(label, v, color);
  }
  function openMH() {
    if (typeof screen === "undefined" || typeof sList === "undefined") return;
    const m = S();
    snd("choice");
    sTitle.textContent = "MENTAL HEALTH";
    if (typeof sSub !== "undefined" && sSub && sSub.style) sSub.style.display = "none";
    sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;";
    sBack.onclick = () => (typeof openActivities === "function" ? openActivities() : screen.classList.remove("open"));
    const mind = typeof mindOf === "function" ? mindOf() : null;
    const row = (id, ic, t, s, dis) => `<div class="row${dis ? " dis" : ""}" data-mh="${id}"><img src="${ic}" alt="" style="object-fit:contain"><div class="t"><b>${esc(t)}</b><span>${s}</span></div>${dis ? "" : chev()}</div>`;
    let h = `<div class="sec">How you are doing</div><div class="row" style="flex-direction:column;align-items:stretch;height:auto;padding:10px 14px">` +
      bar("Stress", m.stress, sevColor(m.stress)) +
      (mind ? bar("Mental health", mind.mh, mind.mh >= 60 ? "#2fa03b" : mind.mh >= 35 ? "#f5841f" : "#b3261e") : "") +
      `</div>`;
    const known = conds().filter(dxOk);
    const hidden = conds().filter((r) => !dxOk(r) && load(r) >= 20);
    h += `<div class="sec">Conditions</div>`;
    if (!known.length && !hidden.length) h += row("", "emoji/1f9e0.png", "Nothing diagnosed", "No conditions on record. Evaluations are open to anyone.", true);
    known.forEach((r) => {
      const L = Math.round(load(r));
      h += row(`c:${r.id}`, COND[treatAs(r)].icon, dispName(r), `${sevLabel(r)}${meds(r).length ? " · on medication" : ""}<i style="display:block;height:6px;border-radius:3px;background:#0002;overflow:hidden;margin-top:4px"><u style="display:block;height:100%;width:${Math.max(3, L)}%;background:${sevColor(L)}"></u></i>`);
    });
    if (hidden.length) h += row("eval", "emoji/2753.png", "Something feels off", "You have symptoms that nobody has named yet. An evaluation can help.");
    h += `<div class="sec">Care</div>`;
    h += row("eval", "emoji/1fa7a.png", "Get evaluated", "A professional assessment for symptoms or a diagnosis");
    h += row("therapy", "emoji/1f6cb-fe0f.png", "Therapy", m.th.on ? `${MODES[m.th.mode].n}${m.th.lapsed ? " (paused)" : ""}` : "Talk therapy and support groups");
    h += row("selfcare", "emoji/1f9d8.png", "Self-care", m.care === state.age ? "Done for this year" : "One healthy habit per year");
    h += row("talk", "emoji/1f4ac.png", "Talk to someone close", "Open up to the people who matter");
    const s = SD();
    if (s.known) {
      h += `<div class="sec">Personality</div><div class="row" data-mh="sad" style="flex-direction:column;align-items:stretch;height:auto;padding:10px 14px"><b>Sadistic streak</b>${bar("Intensity", s.v, "#6b2f8f")}${bar("Urge", s.urge, s.urge >= 60 ? "#b3261e" : "#f5841f")}${bar("Remorse", s.guilt, "#3d7ea6")}<span style="font-size:12px;opacity:.75">Not a diagnosis. A trait that makes cruelty feel rewarding and guilt faint. It builds an urge you can resist, redirect, or act on.</span></div>`;
    }
    if (m.hist.length) {
      h += `<div class="sec">Recent</div>` + m.hist.slice(0, 6).map((x) => `<div class="row sm dis"><div class="t"><b style="font-weight:600">${esc(x.t)}</b><span>Age ${x.a}</span></div></div>`).join("");
    }
    sList.innerHTML = h;
    sList.querySelectorAll("[data-mh]").forEach((el) => {
      const k = el.dataset.mh;
      if (!k || el.classList.contains("dis")) return;
      el.onclick = () => {
        if (k.startsWith("c:")) return openCond(m.c[k.slice(2)]);
        if (k === "eval") return openEvaluation();
        if (k === "therapy") return openTherapy();
        if (k === "selfcare") return selfCare();
        if (k === "talk") return talkToSomeone(() => openMH());
        if (k === "sad") return sadCard();
      };
    });
    sList.scrollTop = 0;
    screen.classList.add("open");
  }

  // ------------------------------------------------------------------ events (a couple a year at most)
  const hiddenConds = () => conds().filter((r) => !dxOk(r));
  const loadedConds = (min) => conds().filter((r) => load(r) >= min && !r.rem);
  const EVENTS = [
    {
      id: "aware",
      w: () => (hiddenConds().some((r) => load(r) >= 30) && state.age >= 8 ? 4 : 0),
      run: () => {
        const r = pick(hiddenConds().filter((x) => load(x) >= 30));
        card({
          iconSrc: COND[r.id].icon,
          title: "Something is wrong",
          lead: COND[r.id].vague,
          choices: [
            ["Get evaluated", () => openEvaluation()],
            ["Talk to someone I trust", () => talkToSomeone()],
            ["Push through it", () => {
              r.ignored = (r.ignored || 0) + 1;
              S().stress = cl(S().stress + 3);
              sayIt("I told myself to just push through it.");
            }],
          ],
        });
      },
    },
    {
      id: "panic",
      w: () => (S().c.anxiety && !S().c.anxiety.rem && load(S().c.anxiety) >= 30 ? 3 : 0),
      run: () => {
        const r = S().c.anxiety;
        card({
          iconSrc: "health/anxious.png",
          title: "Panic attack",
          lead: "Your heart pounds, your hands go numb and for a few minutes it feels like something terrible is about to happen. It passes, but it is terrifying.",
          choices: [
            ["Ground myself and breathe slowly", () => {
              r.lvl = cl(r.lvl - 3);
              notice("It passed", "You name five things you can see and breathe slowly. The wave crests and falls. Next time you will know it will pass.", null, true);
            }],
            ["Leave and avoid that place from now on", () => {
              r.lvl = cl(r.lvl + 3);
              fxStats({ hap: -2 });
              sayIt("I started avoiding places that make me panic.");
            }],
            ["Go to the emergency room", () => {
              const c = price(ri(400, 1400));
              if (canAfford(c)) pay(c);
              fxStats({ hea: 1 });
              notice("All clear", "Doctors rule out a heart problem and explain what a panic attack is. Knowing what it is takes some of its power away.", null, true);
            }],
          ],
        });
      },
    },
    {
      id: "flash",
      w: () => (S().c.ptsd && !S().c.ptsd.rem && load(S().c.ptsd) >= 25 ? 3 : 0),
      run: () => {
        const r = S().c.ptsd;
        const vet = !!(state.veteran || (typeof isMil === "function" && isMil()));
        card({
          iconSrc: "emoji/1f6e1-fe0f.png",
          title: vet ? "Back there again" : "A flashback",
          lead: vet ? "A sound like the one you will never forget, and for a moment you are back there. Your body reacts before your mind catches up." : "A smell, a sound, a song, and it is happening again. Your body does not know it is over.",
          choices: [
            ["Use the grounding skills I learned", () => {
              r.lvl = cl(r.lvl - (S().th.on ? 4 : 1));
              notice("Back in the present", S().th.on ? "Your therapist taught you to anchor yourself in the room. It works, mostly." : "You manage to get through it, shaken.", null, true);
            }],
            ["Reach out to someone", () => talkToSomeone()],
            ["Numb it with a drink", () => {
              r.lvl = cl(r.lvl + 5);
              fxStats({ hea: -2, hap: -2 });
              sayIt("I drank to quiet the memories.");
              notice("It does not last", "The drink dulls it for a night. The next morning the memories are louder and you feel worse.", null, true);
            }],
          ],
        });
      },
    },
    {
      id: "mania",
      w: () => (S().c.bipolar && S().c.bipolar.phase === "manic" ? 5 : 0),
      run: () => {
        const r = S().c.bipolar;
        const spree = Math.round((Number(state.money) || 0) * (ri(3, 10) / 100));
        card({
          iconSrc: "emoji/1f3ad.png",
          title: "Running hot",
          lead: "You have not needed sleep in days. Ideas are coming faster than you can write them down, and every decision feels brilliant. People who care about you are worried.",
          choices: [
            ["Ride it. I feel amazing", () => {
              state.money = Math.max(0, (Number(state.money) || 0) - spree);
              r.lvl = cl(r.lvl + 5);
              fxStats({ hea: -3 });
              sayIt("I went on a spending spree I could not explain.");
              notice("The crash is coming", `You spend ${money(spree)} on things you will not remember wanting. The high ends, and the crash after it is hard.`, null, true);
            }],
            ["Call my psychiatrist", () => {
              r.lvl = cl(r.lvl - (S().team.ps ? 18 : 6));
              notice("Reined in", S().team.ps ? `${S().team.ps.name} adjusts your plan and you start sleeping again.` : "Without a psychiatrist it is harder, but telling someone you trust helps you slow down.", null, true);
            }],
            ["Let a trusted person hold my cards", () => {
              r.lvl = cl(r.lvl - 8);
              talkToSomeone();
            }],
          ],
        });
      },
    },
    {
      id: "withdraw",
      w: () => (S().c.depression && !S().c.depression.rem && load(S().c.depression) >= 30 && closeOnes().length ? 3 : 0),
      run: () => {
        const p = pick(closeOnes());
        const r = S().c.depression;
        card({
          iconSrc: "kid/face-crying.png",
          title: "Pulling away",
          lead: "You have stopped answering calls and canceling plans. Someone close to you shows up at your door anyway.",
          choices: [
            ["Let them in", () => {
              p.rel = cl(p.rel + ri(4, 9));
              r.lvl = cl(r.lvl - 4);
              notice("You are not alone", "You do not have to explain anything. They sit with you for an hour. It helps more than you thought.", null, true);
            }],
            ["Turn them away", () => {
              p.rel = cl(p.rel - ri(6, 14));
              r.lvl = cl(r.lvl + 3);
              sayIt("I turned away someone who came to check on me.");
            }],
          ],
        });
      },
    },
    {
      id: "missed",
      w: () => (state.job && loadedConds(45).length ? 3 : 0),
      run: () => {
        const e = state.job;
        const pay1 = Number.isFinite(e.pay) ? Math.round(e.pay / 12) : 0;
        card({
          iconSrc: "emoji/1f4bc.png",
          title: "Struggling at work",
          lead: "You have been missing days, losing track of tasks and running on empty. Your manager has noticed.",
          choices: [
            ["Take unpaid leave to get help", () => {
              if (pay1) state.money = Math.max(0, (Number(state.money) || 0) - pay1);
              S().stress = cl(S().stress - 6);
              loadedConds(1).forEach((r) => (r.lvl = cl(r.lvl - 4)));
              fxStats({});
              sayIt("I took leave from work to get my health in order.");
            }],
            ["Power through", () => {
              if (typeof e.perf === "number") e.perf = cl(e.perf - 8);
              fxStats({ hap: -2 });
              sayIt("I kept working while barely holding it together.");
            }],
          ],
        });
      },
    },
    {
      id: "disclose",
      w: () => (state.job && conds().some((r) => dxOk(r) && !r.rem && load(r) >= 30) && !S().disc[jobKey()] ? 3 : 0), // only when a diagnosed condition is active and at least moderate
      run: () => {
        const k = jobKey();
        card({
          iconSrc: "emoji/1f4bc.png",
          title: "Tell your employer?",
          lead: "Your condition affects your work. Telling your employer can get you reasonable accommodations such as flexible hours or time for appointments, but there is a chance of stigma.",
          choices: [
            ["Ask for accommodations", () => {
              if (ch(0.78)) {
                S().disc[k] = "ok";
                notice("Understood", "Your manager is supportive and agrees to flexible hours and time for appointments. The pressure eases.", null, true);
              } else {
                S().disc[k] = "bad";
                if (state.job && typeof state.job.perf === "number") state.job.perf = cl(state.job.perf - 8);
                fxStats({ hap: -3 });
                sayIt("I told my boss about my condition and it did not go well.");
                notice("Not everyone is kind", "Your manager is cold about it and starts treating you differently. This is unfair, and it is not your fault.", null, true);
              }
            }],
            ["Keep it private", () => {
              S().disc[k] = "no";
            }],
          ],
        });
      },
    },
    {
      id: "side",
      w: () => (allMeds().some((x) => x.med.side.length && x.med.asked !== state.age) ? 2 : 0),
      run: () => {
        const x = pick(allMeds().filter((y) => y.med.side.length));
        x.med.asked = state.age;
        reviewMedCard(x);
      },
    },
    {
      id: "stopmeds",
      w: () => (allMeds().some((x) => load(x.r) < 22 && x.med.yrs >= 1 && x.med.asked !== state.age && x.r.id !== "adhd") ? 3 : 0),
      run: () => {
        const x = pick(allMeds().filter((y) => load(y.r) < 22 && y.med.yrs >= 1 && y.r.id !== "adhd"));
        x.med.asked = state.age;
        reviewMed(x.r, x.med, "You have been feeling much better, and a voice in your head says you do not need the medication anymore. Feeling better is usually a sign it is working. How do you want to handle it?");
      },
    },
    {
      id: "adhdwork",
      w: () => (S().c.adhd && load(S().c.adhd) >= 35 ? 2 : 0),
      run: () => {
        const r = S().c.adhd;
        const kid = state.age <= 17;
        card({
          iconSrc: "health/brain.png",
          title: kid ? "Can't sit still" : "Dropped the ball",
          lead: kid ? "Your teacher says you are bright but cannot stay in your seat, and your homework keeps disappearing. It is not for lack of trying." : "A deadline slipped past, again. You were sure you wrote it down. You did not.",
          choices: [
            [kid ? "Ask for help" : "Build a system and ask for structure", () => {
              r.lvl = cl(r.lvl - 3);
              notice("It helps", kid ? "A counselor suggests short work blocks, breaks to move and a planner. Structure makes a visible difference." : "Alarms, checklists and an accountability buddy. It is not a cure, but it keeps the wheels on.", null, true);
            }],
            ["Just try harder", () => {
              fxStats({ hap: -2 });
              if (kid && state.school && typeof state.school.grades === "number") state.school.grades = cl(state.school.grades - 4);
              else if (state.job && typeof state.job.perf === "number") state.job.perf = cl(state.job.perf - 4);
              notice("It does not work like that", "Willpower alone does not fix a brain that struggles with attention. Trying harder without support mostly leaves you exhausted.", null, true);
            }],
          ],
        });
      },
    },
    {
      id: "breakthrough",
      w: () => (S().th.on && !S().th.lapsed && conds().length ? 1 : 0),
      run: () => {
        loadedConds(1).forEach((r) => (r.lvl = cl(r.lvl - 4)));
        card({ iconSrc: "emoji/1f6cb-fe0f.png", title: "A breakthrough", lead: "In a session you finally say out loud something you have never said to anyone. You leave drained, and lighter.", ok: () => {} });
      },
    },
    {
      id: "urge",
      w: () => (SD().known && SD().urge >= 60 ? 6 : 0),
      run: () => urgeCard(),
    },
  ];
  function allMeds() {
    const out = [];
    conds().forEach((r) => meds(r).forEach((x) => out.push({ r, med: x })));
    return out;
  }
  const reviewMedCard = (x) => card({
    iconSrc: medIcon(x.med.id),
    title: "Side effects",
    lead: `Your medication (${medName(x.med.id)}) is helping, but you have noticed ${x.med.side.map((s) => SIDE[s].t).join(" and ")}. Many people give up here without telling anyone, and that is when relapses happen. What do you do?`,
    choices: [
      ["Ask my psychiatrist to switch", () => {
        x.med.on = false;
        rememberBad(x.r, x.med);
        note("Switched medication for side effects.");
        sayIt("I asked my psychiatrist to change my medication.");
        openMeds(x.r);
      }],
      ["Live with it for now", () => {
        x.med.asked = state.age;
      }],
      ["Stop on my own", () => stopMed(x.r, x.med, "cold")],
    ],
  });
  function crisisEvent() {
    const worst = conds().sort((a, b) => load(b) - load(a))[0];
    const free = costFree();
    card({
      iconSrc: "emoji/1f4de.png",
      title: "A crisis point",
      lead: "Things have gotten very dark. You have been feeling like you cannot go on, and it is frightening. This is the kind of moment where telling someone matters most.",
      choices: [
        ["Call a crisis line", () => {
          S().stress = cl(S().stress - 10);
          if (worst) worst.lvl = cl(worst.lvl - 12);
          notice("Someone answered", "A trained counselor talks you through the worst of it. You are not alone, and they help you plan the next step.", null, true);
        }],
        ["Tell someone close to me", () => {
          if (worst) worst.lvl = cl(worst.lvl - 10);
          talkToSomeone();
        }],
        [`Go to the hospital${free ? "" : " (emergency care)"}`, () => {
          const c = price(ri(1500, 6000));
          if (canAfford(c)) pay(c);
          if (worst) worst.lvl = cl(worst.lvl - 25);
          S().stress = cl(S().stress - 12);
          fxStats({ hea: 2 });
          sayIt("I spent some days in the hospital getting stable.");
          note("Hospital stay for a crisis.");
          notice("Safe and supported", "You are admitted for a few days. It is not easy, but you are safe and you leave with a care plan and follow-ups.", null, true);
        }],
        ["Push through alone", () => {
          if (worst) worst.lvl = cl(worst.lvl + 8);
          fxStats({ hea: -4, hap: -4 });
          sayIt("I did not tell anyone how bad things had gotten.");
          notice("It gets heavier", "Carrying it alone makes it heavier. Reaching out is not weakness, and you can still do it today.", null, true);
        }],
      ],
    });
  }

  // ------------------------------------------------------------------ sadism (a personality trait, not a disorder)
  const VIOLENT = /\bI (?:attacked and )?(?:murdered|killed|assassinated|strangled|poisoned|executed|stabbed|choked|tortured|slashed|bludgeoned|beheaded|brutalized)\b|\bI shot (?:and killed |at )?(?:him|her|them|someone|a (?:man|woman|stranger|cop|guard|clerk|person))\b|\bI beat (?:up |him|her|them|someone|a (?:man|woman|stranger))|\bI knocked out\b|\bI (?:stabbed|shot|beat) .+ to death\b/i;
  const NOT_VIOLENT = /\b(?:deer|elk|duck|rabbit|bird|fish|boar|animal|bug|spider|mosquito|insect|enemy|combat|battle|deployed|training|zombie)\b|\bkilled (?:time|it)\b/i;
  const LOSS = /\bmy (?:mother|father|mom|dad|son|daughter|wife|husband|child|twin|brother|sister|best friend|partner)\b.*\b(?:died|passed away|was killed|was murdered)\b/i;
  const HARM = /\bI was (?:mugged|robbed|carjacked|stabbed|shot|assaulted|attacked|beaten|kidnapped|held at gunpoint)\b/i;
  const ABUSE = /\b(?:abused me|molested|sexually assaulted me|raped)\b/i;
  const CRASH = /\b(?:car (?:crash|accident)|plane crash|nearly drowned|house fire)\b/i;
  const FIRED = /\b(?:I was|I got) (?:fired|laid off)\b|\bfired me\b/i;
  const SPLIT = /\bI (?:got divorced|was divorced)\b|\bmy (?:wife|husband|partner) left me\b|\bbroke up with me\b/i;
  const JAIL = /\bwent to prison\b|\bI was sentenced\b/i;

  function onViolence(line) {
    if (!active() || state.age < 12) return;
    const s = SD();
    const m = S();
    if (s.v < 10 && ch(0.22)) s.v = ri(10, 20); // discovers they enjoy it
    const f = s.v / 100;
    if (s.v >= 10) {
      fxStats({ hap: ri(2, 5) + Math.round(f * 10) });
      try {
        if (typeof mindBump === "function") mindBump(-Math.round(10 * f), Math.round(9 * (0.25 + f))); // refund what the base game charged
      } catch {}
      s.guilt = cl(s.guilt + Math.round((1 - f) * ri(2, 6)) - ri(3, 8));
      s.urge = cl(s.urge - ri(25, 45));
    } else {
      s.guilt = cl(s.guilt + ri(10, 18));
      m.stress = cl(m.stress + 8);
      trauma("moral", 30); // moral injury: doing something you cannot live with
    }
    s.v = cl(s.v + (s.v >= 10 ? ri(1, 3) : 0));
    s.acts++;
    s.lastAct = state.age;
    try {
      if (state.melon) {
        state.melon.brutality = cl((Number(state.melon.brutality) || 0) + ri(1, 3) + Math.round(f * 4));
        if (s.v >= 45) state.melon.disguise = cl((Number(state.melon.disguise) || 0) - ri(0, 3));
      }
    } catch {}
    try {
      if (state.serial && state.serial.on && s.v >= 50 && ch(0.5)) state.serial.notice = Math.min(100, (Number(state.serial.notice) || 0) + ri(1, 4));
    } catch {}
    if (!s.known && s.v >= 25) {
      s.known = true;
      note("Noticed a sadistic streak.");
      card({
        iconSrc: "emoji/1f9e0.png",
        title: "Something about you",
        lead: "You catch yourself smiling afterward. It is not rage, and it is not fear: it is enjoyment. Somewhere along the way you learned that hurting someone feels good, and that the guilt other people describe barely reaches you. It is not a diagnosis. It is a trait, and what you do with it is a choice.",
        choices: [["Look into it", () => openMH()], ["Ignore it", () => {}]],
      });
    }
  }
  function sadTick() {
    const s = SD();
    const m = S();
    if (!s.init && state.age >= 10) {
      s.init = true;
      if (ch(0.06 + (famHas("antisocialpd") ? 0.08 : 0) + (state.melon && state.melon.disgraced ? 0.03 : 0))) s.v = ri(6, 20);
    }
    if (!s.init) return;
    if (s.v >= 10) {
      s.urge = cl(s.urge + Math.round(s.v * 0.18) + ri(0, 4) - (m.th.on && !m.th.lapsed ? 4 : 0));
      if (m.th.on && !m.th.lapsed && s.known && ch(0.5)) s.v = cl(s.v - ri(0, 2));
    }
    s.guilt = cl(s.guilt - ri(2, 5));
    if (s.v < 10 && s.guilt >= 70) fxStats({ hap: -3 });
    if (!s.known && s.v >= 25 && s.acts === 0 && ch(0.4)) {
      s.known = true;
      note("Noticed a dark side.");
      card({ iconSrc: "emoji/1f9e0.png", title: "A dark side", lead: "You have always been drawn to the idea of other people's pain, in a way that does not feel right. You have never acted on it. Knowing yourself is the first step to deciding what you will do about it.", ok: () => {} });
    }
  }
  function urgeCard() {
    const s = SD();
    const m = S();
    card({
      iconSrc: "emoji/1f9e0.png",
      title: "The urge",
      lead: "It has been building for a while: a restless itch to hurt someone and watch it land. It will not go away on its own. How do you handle it?",
      rows: [["Urge", `${Math.round(s.urge)}%`], ["Intensity", `${Math.round(s.v)}%`]],
      choices: [
        ["Resist it", () => {
          s.urge = cl(s.urge - 18 - (m.th.on ? 8 : 0));
          m.stress = cl(m.stress + 3);
          sayIt("I held myself back, again.");
        }],
        ["Find a legal outlet (a combat sport gym)", () => {
          const c = price(ri(60, 140));
          if (canAfford(c)) pay(c);
          s.urge = cl(s.urge - 30);
          fxStats({ hea: 2 });
          sayIt("I took the urge to a boxing gym.");
        }],
        ["Talk to a professional about it", () => {
          if (m.th.on) {
            s.urge = cl(s.urge - 25);
            s.v = cl(s.v - ri(1, 3));
            notice("It helps", "You finally say it out loud to someone trained to hear it. There is no cure, but you learn to recognize the pattern and to put distance between the urge and the act.", null, true);
          } else openTherapy();
        }],
        ["Act on it", () => actOnUrge()],
      ],
    });
  }
  function actOnUrge() {
    const s = SD();
    const line = "I picked a fight with a stranger and left him bleeding.";
    own.add(line);
    sayIt(line);
    onViolence(line);
    if (ch(0.3)) fxStats({ hea: -ri(3, 10) });
    if (ch(0.3) && typeof arrest === "function") setTimeout(() => arrest("assault", [1, 4]), 400);
    else notice("It felt good", "For a few minutes everything is quiet and clear. Then you walk away. It will build again.", null, true);
  }
  function sadCard() {
    const s = SD();
    now({
      iconSrc: "emoji/1f9e0.png",
      title: "Sadistic streak",
      lead: "A trait, not a disorder. Violent acts feel rewarding: Happiness rises, remorse stays low, and the guilt the game normally charges is softened. It feeds Melon (more brutality, less disguise) and raises police attention for serial killers. The urge grows when you do not act, and therapy can help you manage it.",
      rows: [["Intensity", `${Math.round(s.v)}%`], ["Urge", `${Math.round(s.urge)}%`], ["Remorse", `${Math.round(s.guilt)}%`], ["Violent acts", String(s.acts)]],
      choices: [["Therapy", () => openTherapy()], ["Back", () => openMH()]],
    });
  }

  // ------------------------------------------------------------------ yearly tick and event picking
  function pickEvents() {
    const m = S();
    const hot = conds().some((r) => (r.id === "bipolar" ? r.phase !== "stable" && r.lvl >= 75 : load(r) >= 75 && !r.rem) && r.id !== "adhd");
    if (hot && mhBar() < 70 && ch(0.4 + (supportCount() === 0 ? 0.15 : 0) - (m.th.on ? 0.1 : 0))) {
      m.ev.crisis = state.age;
      return crisisEvent();
    }
    const calm = mhCalm();
    let slots = ch(0.6 * calm) ? 1 : 0;
    if (ch(0.25 * calm)) slots++;
    for (let i = 0; i < slots; i++) {
      const pool = EVENTS.map((e) => ({ e, w: m.ev[e.id] != null && state.age - m.ev[e.id] < 2 ? 0 : e.w() })).filter((x) => x.w > 0);
      if (!pool.length) return;
      let t = pool.reduce((a, x) => a + x.w, 0);
      let r = rnd() * t;
      let chosen = pool[0].e;
      for (const x of pool) {
        r -= x.w;
        if (r <= 0) {
          chosen = x.e;
          break;
        }
      }
      m.ev[chosen.id] = state.age;
      try {
        chosen.run();
      } catch (e) {
        warn("event " + chosen.id, e);
      }
    }
  }
  function tick() {
    if (!active()) return;
    const m = S();
    if (m.last === state.age) return;
    m.last = state.age;
    for (const f of [adopt, updateStress, onsets, payCare, stepConds, applyAll, sadTick, pickEvents]) {
      try {
        f();
      } catch (e) {
        warn(f.name, e);
      }
    }
    try {
      adopt();
    } catch {}
  }

  // ------------------------------------------------------------------ hooks
  let readyOnce = false;
  function boot() {
    if (
      typeof state === "undefined" ||
      typeof jCard !== "function" ||
      typeof notice !== "function" ||
      typeof sList === "undefined" ||
      typeof openActivities !== "function" ||
      typeof queuePopup !== "function" ||
      !document.getElementById("ageBtn") ||
      !document.getElementById("log")
    )
      return setTimeout(boot, 80);
    if (readyOnce) return;
    readyOnce = true;
    try {
      init();
    } catch (e) {
      warn("init", e);
    }
  }
  function init() {
    // age up: after the base game's own mental-health checks have run (they fire at +200 ms)
    document.getElementById("ageBtn").addEventListener("click", () => setTimeout(() => {
      try {
        tick();
      } catch (e) {
        warn("tick", e);
      }
    }, 450));

    // Activities row
    const origAct = window.openActivities;
    window.openActivities = function () {
      const r = origAct.apply(this, arguments);
      try {
        if (active() && state.age >= 5 && sTitle.textContent === "ACTIVITIES" && !document.getElementById("flMhRow")) {
          const n = conds().filter(dxOk).length;
          const html = `<div class="row" id="flMhRow"><img src="emoji/1f9e0.png" alt="" style="object-fit:contain"><div class="t"><b>Mental Health</b><span>${n ? `${n} condition${n === 1 ? "" : "s"} on record · ` : ""}Therapy, medication, support</span></div>${chev()}</div>`;
          const sur = document.getElementById("actSurrender");
          if (sur) sur.insertAdjacentHTML("beforebegin", html);
          else sList.insertAdjacentHTML("beforeend", html);
          document.getElementById("flMhRow").onclick = openMH;
        }
      } catch (e) {
        warn("activities", e);
      }
      return r;
    };

    // the base game cures depression on a single good year; keep it while this mod's record says it is still active
    if (typeof recoverDepression === "function") {
      const origRec = recoverDepression;
      window.recoverDepression = function () {
        try {
          const r = S().c.depression;
          if (active() && r && !r.rem && r.lvl >= 15) return;
        } catch {}
        return origRec.apply(this, arguments);
      };
    }

    // Military Expanded: combat events are trauma exposures
    if (typeof runMilEvent === "function") {
      const origMil = runMilEvent;
      const COMBAT = [
        [/buddy killed/i, 70], [/casualty carry/i, 60], [/ambush|\bied\b|mortar|rocket attack|grenade|sniper|firefight|first real raid/i, 52],
        [/medevac/i, 40], [/interpreter/i, 25], [/wrong way bombing/i, 25], [/drunk brawl overseas/i, 20],
      ];
      window.runMilEvent = function (e) {
        try {
          const t = e && e.t ? String(e.t) : "";
          const hit = COMBAT.find(([re]) => re.test(t));
          if (hit && active() && !/exercise|drill|training|school/i.test(t)) trauma("combat", hit[1] + ri(-6, 8));
        } catch {}
        return origMil.apply(this, arguments);
      };
    }

    // Crime screen: Remorse / Sadistic streak next to Melon's meters
    if (typeof openCrime === "function") {
      const origCrime = openCrime;
      window.openCrime = function () {
        const r = origCrime.apply(this, arguments);
        try {
          const s = SD();
          if (active() && (s.known || s.acts > 0)) {
            const html =
              `<div class="sec">Personality</div><div class="row" style="flex-direction:column;align-items:stretch;height:auto;padding:10px 14px">` +
              (s.known ? bar("Sadistic streak", s.v, "#6b2f8f") : "") +
              bar("Remorse", s.guilt, "#3d7ea6") +
              `<span style="font-size:12px;opacity:.75;margin-top:2px">${s.v >= 10 ? "Violence feels rewarding and guilt barely lands." : "Violence weighs on you."}</span></div>`;
            const melon = Array.from(sList.querySelectorAll(".sec")).find((x) => x.textContent.trim() === "Melon");
            const anchor = melon && melon.nextElementSibling;
            if (anchor) anchor.insertAdjacentHTML("afterend", html);
            else sList.insertAdjacentHTML("afterbegin", html);
          }
        } catch (e) {
          warn("crime screen", e);
        }
        return r;
      };
    }

    // life log watcher: violence the player commits, and the events that hurt people
    const logEl = document.getElementById("log");
    let live = false;
    setTimeout(() => (live = true), 2500);
    new MutationObserver((muts) => {
      if (!live || !active() || window.FL_RESTORING) return;
      let last = "";
      for (const mu of muts)
        for (const n of mu.addedNodes) {
          const txt = (1 === n.nodeType || 3 === n.nodeType ? n.textContent : "").trim();
          if (!txt || txt.length > 400 || txt === last) continue;
          last = txt;
          if (own.has(txt)) {
            own.delete(txt);
            continue;
          }
          try {
            if (LOSS.test(txt)) trauma("loss", 30);
            else if (HARM.test(txt)) trauma("violence", 45);
            else if (ABUSE.test(txt)) trauma("abuse", 60);
            else if (CRASH.test(txt)) trauma("accident", 35);
            else if (VIOLENT.test(txt) && !NOT_VIOLENT.test(txt) && !LOSS.test(txt)) onViolence(txt);
            if (FIRED.test(txt)) S().stress = cl(S().stress + 12);
            if (SPLIT.test(txt)) S().stress = cl(S().stress + 10);
            if (JAIL.test(txt)) trauma("prison", 25);
          } catch (e) {
            warn("log", e);
          }
        }
    }).observe(logEl, { childList: true, subtree: true });

    console.log("[mental-health] loaded");
  }

  window.FL_MH = {
    open: () => (typeof openMH === "function" ? openMH() : null),
    state: () => S(),
    give: (id, lvl) => (COND[id] ? newCond(id, { dx: true, lvl: lvl != null ? lvl : undefined }) : null),
    trauma,
    tick,
    violence: onViolence,
    sad: SD,
    eventNow: (id) => {
      const e = EVENTS.find((x) => x.id === id);
      return e ? e.run() : null;
    },
    crisis: crisisEvent,
  };
  boot();
})();
