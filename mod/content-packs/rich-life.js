/* [mod] Rich Life for NaBlooLife (local mod).
 *
 * What happens when you get rich:
 *  - Money requests: family and friends text you for a loan; say no and they get angry (relationship drops).
 *  - Paparazzi: buying a mansion or a supercar when you are famous (or very rich) hits the news ticker.
 *  - Envy and scams: fake investments, romance and "prince" scams, and a break-in when you show off too much.
 *  - Police heat: showing off things you cannot explain with your job raises it; detectives knock at 45+.
 *  - Fans vs. critics: comments change with your fame and how much people like you.
 *  - Taxes: a tax season every year you earn a lot (declare it all, declare half, or hire an accountant) and
 *    audits when you cheat and show off.
 *
 * State lives in state.richlife. Texts are kept static (people, amounts and items go in rows) so ES/PT can translate.
 * API: FL_RICH.state(), FL_RICH.yearly(true) to force the yearly events for testing.
 */
(() => {
  "use strict";
  if (window.FL_RICH) return;

  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const cl = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const warn = (w, e) => console.warn("[rich-life] " + w, e);
  const usdf = (n) => {
    try {
      return usd(n);
    } catch {
      return "$" + Math.round(n).toLocaleString("en-US");
    }
  };
  const roundAmt = (n) => (n >= 20000 ? Math.round(n / 1000) * 1000 : Math.round(n / 500) * 500);

  // ------------------------------------------------------------------ state
  const R = () => {
    if (!state.richlife || typeof state.richlife !== "object") state.richlife = {};
    const s = state.richlife;
    s.love ??= 55; // how much people like you (0-100)
    s.flaunt ??= 0; // how much you show off (0-100)
    s.heat ??= 0; // police attention (0-100)
    s.undeclared ??= 0; // income you hid from the tax office
    s.lastNW ??= null;
    s.seenProps ??= null;
    s.seenCars ??= null;
    s.loans ??= [];
    s.asked ??= {};
    s.auditAge ??= -9;
    s.yearDone ??= -1;
    return s;
  };
  const bank = () => (typeof bankTotal === "function" ? bankTotal() : Number(state.money) || 0);
  const propsVal = () => (state.props || []).reduce((s, p) => s + Math.round((p.price || 0) * (0.8 + (p.cond || 0) / 250)), 0);
  const carsVal = () => (state.cars || []).reduce((s, c) => s + (c.price || 0), 0);
  const worth = () => bank() + propsVal() + carsVal();
  const refresh = () => {
    try {
      renderStats();
    } catch {}
  };
  const stat = (k, d) => {
    if (state.stats) state.stats[k] = cl((Number(state.stats[k]) || 0) + d);
    refresh();
  };
  // takes money from cash first, then from bank accounts. false if you cannot cover it
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
  const fameNow = () => {
    let best = 0;
    try {
      for (const k of Object.keys(state)) {
        const o = state[k];
        if (!o || typeof o !== "object" || Array.isArray(o)) continue;
        if (typeof o.fame === "number" && o.fame >= 0 && o.fame <= 100) best = Math.max(best, o.fame);
      }
    } catch {}
    return Math.round(best);
  };
  const myName = () => `${state.first || "Someone"} ${typeof SURNAME !== "undefined" ? SURNAME : ""}`.trim();
  const who = () => {
    const f = state.futbol,
      n = state.nba;
    if (f && f.active && !f.retired && f.pro) return "Footballer";
    if (n && n.active && !n.retired && n.stage === "pro") return "NBA player";
    if (fameNow() >= 35) return "Celebrity";
    if (worth() >= 50e6) return "Tycoon";
    return "Local millionaire";
  };
  const enabled = () => !state.dead && state.era !== "1800s" && state.age >= 16;
  const later = (fn, ms = 1700) => setTimeout(() => (typeof whenClear === "function" ? whenClear(fn) : fn()), ms);
  const card = (o) => {
    try {
      jCard({ tag: "Rich Life", ...o });
    } catch (e) {
      warn("card", e);
    }
  };
  const note = (t, m, cb) => notice(t, m, cb || null, true);
  const logLine = (s) => {
    try {
      say(s);
    } catch {}
  };
  const news = (text) => {
    try {
      window.FL_JUICE2 && FL_JUICE2.addNews && FL_JUICE2.addNews(text);
    } catch {}
  };
  const banner = (kind, name, text) => {
    try {
      window.FL_JUICE2 && FL_JUICE2.say({ kind, name, p: null }, text);
    } catch {}
  };

  // ------------------------------------------------------------------ people
  const people = () => {
    const out = [];
    const ok = (p) => p && !p.dead;
    (state.parents || []).filter(ok).forEach((p) => out.push({ role: p.role === "Mother" ? "Mom" : "Dad", name: p.role === "Mother" ? "Mom" : "Dad", p, close: true }));
    (state.family || []).filter((f) => f.kind === "sibling" && ok(f)).slice(0, 4).forEach((p) => out.push({ role: "Sibling", name: p.first, p }));
    (state.family || []).filter((f) => f.kind === "child" && ok(f) && (f.age || 0) >= 18).slice(0, 3).forEach((p) => out.push({ role: "Child", name: p.first, p }));
    (state.friends || []).filter(ok).slice(0, 6).forEach((p) => out.push({ role: "Friend", name: p.first, p }));
    return out;
  };
  const nudge = (c, d) => {
    try {
      if (c.p && typeof c.p.rel === "number") c.p.rel = cl(c.p.rel + d);
    } catch {}
  };

  // ------------------------------------------------------------------ 1. money requests
  const REASONS = [
    "My car broke down and I cannot get to work. Can you help me out?",
    "I am a little short on rent this month. I will pay you back, I swear.",
    "I have a business idea that cannot fail. I only need a small push.",
    "I got into some trouble and I need money fast. Please do not tell anyone.",
    "Medical bills are crushing me. You are the only one I can ask.",
    "I saw you are doing great. Could you spare something for me?",
  ];
  function requestEvent(done) {
    const s = R();
    const c = pick(people().filter((x) => (s.asked[x.name + x.role] ?? -9) < state.age - 1));
    if (!c) return done();
    s.asked[c.name + c.role] = state.age;
    const total = bank();
    const amt = Math.max(1500, roundAmt(total * (ri(2, 8) / 100)));
    const half = roundAmt(amt / 2);
    const reason = pick(REASONS);
    card({
      iconSrc: "emoji/1f4b8.png",
      title: "Can you lend me money?",
      lead: `"${reason}"`,
      rows: [
        ["From", c.name === c.role ? c.name : `${c.name} (${c.role})`],
        ["They ask for", usdf(amt)],
        ["Bank", usdf(bank())],
      ],
      choices: [
        [
          "Lend it",
          () => {
            if (!spend(amt)) {
              note("Not enough money", "You cannot cover that right now.");
            } else {
              nudge(c, ri(3, 8));
              s.love = cl(s.love + 3);
              if (rnd() < 0.55) s.loans.push({ name: c.name, role: c.role, amt, due: state.age + ri(1, 3) });
              logLine(`I lent ${c.name} some money.`);
            }
            done();
          },
        ],
        [
          "Give half",
          () => {
            if (!spend(half)) note("Not enough money", "You cannot cover that right now.");
            else {
              nudge(c, ri(1, 4));
              s.love = cl(s.love + 2);
              logLine(`I gave ${c.name} some money.`);
            }
            done();
          },
        ],
        [
          "Say no",
          () => {
            nudge(c, -ri(6, 18));
            s.love = cl(s.love - 3);
            stat("Happiness", -ri(0, 2));
            logLine(`I refused to lend ${c.name} money.`);
            if (rnd() < 0.6) {
              const ang = {
                Mom: "I did not raise you to be like this.",
                Dad: "Money changed you. Do not call me.",
                Sibling: "You have everything and you cannot help your own family? Wow.",
                Child: "I will remember this.",
                Friend: "Real friends do not forget who was there. Bye.",
              };
              setTimeout(() => banner("friend", c.name, ang[c.role] || "Fine. Forget I asked."), 2500);
            }
            done();
          },
          "gray",
        ],
      ],
    });
  }
  function settleLoans() {
    const s = R();
    const due = s.loans.filter((l) => l.due <= state.age);
    s.loans = s.loans.filter((l) => l.due > state.age);
    for (const l of due) {
      if (rnd() < 0.55) {
        const back = Math.round(l.amt * 1.1);
        state.money += back;
        refresh();
        setTimeout(() => banner("friend", l.name, "I paid you back, with a little extra. Thank you for believing in me."), 2200);
      } else {
        s.love = cl(s.love - 1);
        setTimeout(() => banner("friend", l.name, "About that money... things are still tight. Soon, I promise."), 2200);
      }
    }
  }

  // ------------------------------------------------------------------ 2. paparazzi + showing off
  const EXOTIC = /bugatti|ferrari|lambo|rolls|mclaren|porsche|bentley|maserati|aston|koenigsegg|pagani/i;
  function onPurchase(kind, item) {
    const s = R();
    const price = item.price || 0;
    const thing = kind === "car" ? `${item.make || ""} ${item.model || item.name || "car"}`.trim() : item.name || "house";
    const big = kind === "car" ? price >= 150000 || EXOTIC.test(thing) : price >= 1e6;
    if (!big) return;
    const pay = state.job && state.job.pay > 0 ? state.job.pay : 0;
    const unexplained = price > Math.max(50000, pay * 12);
    const f = kind === "car" ? (price >= 400000 ? 12 : 8) : price >= 5e6 ? 14 : 8;
    s.flaunt = cl(s.flaunt + f);
    s.heat = cl(s.heat + (unexplained ? 10 : 3));
    s.love = cl(s.love - (price >= 5e6 ? 2 : 1));
    if (fameNow() >= 20 || worth() >= 5e6) {
      news(`${who()} ${myName()} buys a ${thing} worth ${usdf(price)}`);
      if (fameNow() >= 20 && rnd() < 0.5) {
        const h = "@" + pick(["maria", "juan", "carlos", "ana", "dani", "luis", "sofi"]) + ri(10, 99);
        setTimeout(
          () =>
            banner(
              "fan",
              h,
              s.love >= 55 ? "Seeing you buy that makes me proud. You earned it!" : "Must be nice to buy that while the rest of us pay rent.",
            ),
          2500,
        );
      }
    }
  }
  function watchPurchases() {
    const s = R();
    const np = (state.props || []).length,
      nc = (state.cars || []).length;
    if (s.seenProps == null || s.seenCars == null) {
      s.seenProps = np;
      s.seenCars = nc;
      return;
    }
    if (np > s.seenProps) state.props.slice(s.seenProps).forEach((p) => onPurchase("prop", p));
    if (nc > s.seenCars) state.cars.slice(s.seenCars).forEach((c) => onPurchase("car", c));
    s.seenProps = np;
    s.seenCars = nc;
  }

  // ------------------------------------------------------------------ 3. scams + envy
  const SCAMS = [
    { who: "Brad, 'private fund manager'", pitch: "Guaranteed 300% returns in six months. Only for exclusive clients like you. The spot closes tonight." },
    { who: "A distant 'relative' abroad", pitch: "I need to move a huge inheritance out of my country. Help me and you keep 20% of it." },
    { who: "Valentina, someone you matched with online", pitch: "I want to fly to meet you, but my card is blocked. Could you send me the money for the ticket?" },
    { who: "A 'luxury contractor'", pitch: "I can redo your whole house at half price, but I need the full payment up front." },
  ];
  function scamEvent(done) {
    const s = R();
    const sc = pick(SCAMS);
    const amt = Math.max(10000, roundAmt(Math.min(bank() * (ri(5, 14) / 100), 2e6)));
    const fee = Math.max(2000, roundAmt(amt * 0.05));
    card({
      iconSrc: "emoji/1f4b3.png",
      title: "Investment opportunity",
      lead: `"${sc.pitch}"`,
      rows: [
        ["From", sc.who],
        ["They want", usdf(amt)],
      ],
      choices: [
        [
          "Invest",
          () => {
            if (!spend(amt)) {
              note("Not enough money", "You cannot cover that right now.");
              return done();
            }
            const r = rnd();
            if (r < 0.78) {
              stat("Happiness", -ri(4, 9));
              logLine("I got scammed out of a lot of money.");
              note("Scammed", "The number is disconnected and the website is gone. That money is never coming back.", done);
              if (fameNow() >= 20) news(`${who()} ${myName()} falls for a fake investment scam`);
            } else if (r < 0.9) {
              state.money += amt;
              refresh();
              note("Phew", "It was slow and boring, but you got your money back.", done);
            } else {
              state.money += Math.round(amt * 1.6);
              refresh();
              logLine("A risky investment paid off.");
              note("It paid off", "Against all odds, it was real. You made a nice profit.", done);
            }
          },
        ],
        [
          "Have a lawyer check it",
          () => {
            if (!spend(fee)) {
              note("Not enough money", "You cannot cover that right now.");
              return done();
            }
            if (rnd() < 0.88) {
              stat("Happiness", ri(1, 3));
              note("Dodged it", "Your lawyer confirms it is a scam. The fee was cheap compared to what you almost lost.", done);
            } else {
              state.money += Math.round(amt * 0.4);
              refresh();
              note("It was real", "Your lawyer says it is legitimate, and a small profit comes in.", done);
            }
          },
        ],
        ["Ignore it", () => done(), "gray"],
      ],
    });
  }
  function breakIn(done) {
    const s = R();
    const loss = Math.min(Math.round((Number(state.money) || 0) * (ri(1, 4) / 100)), 300000);
    if (loss < 1000) return done();
    state.money -= loss;
    s.flaunt = cl(s.flaunt - 10);
    stat("Happiness", -ri(3, 7));
    refresh();
    logLine("Someone broke into my house while I was away.");
    card({
      iconSrc: "emoji/1f6a8.png",
      title: "Break-in",
      lead: "Somebody saw you in the news and decided you could afford to share. They broke in while you were out.",
      rows: [["Stolen", usdf(loss)]],
      ok: () => done(),
    });
  }

  // ------------------------------------------------------------------ 4. police heat
  function detectives(done) {
    const s = R();
    const fee = Math.max(5000, roundAmt(worth() * 0.01));
    card({
      iconSrc: "emoji/1f575-fe0f.png",
      title: "Detectives at the door",
      lead: "Two detectives want to know how you can afford all this. They are polite. That is the scary part.",
      rows: [
        ["Police attention", `${Math.round(s.heat)}%`],
        ["Lawyer fee", usdf(fee)],
      ],
      choices: [
        [
          "Show your records",
          () => {
            const clean = s.undeclared < Math.max(100000, worth() * 0.02);
            if (rnd() < (clean ? 0.9 : 0.3)) {
              s.heat = 15;
              note("Cleared", "Your records check out. They apologize for the trouble.", done);
            } else {
              s.heat = 30;
              const fine = Math.round(Math.min(bank() * 0.05, 1e6));
              spend(fine);
              note("Questions", `They find gaps in your papers and fine you ${usdf(fine)}.`, done);
            }
          },
        ],
        [
          "Call your lawyer",
          () => {
            if (!spend(fee)) {
              note("Not enough money", "You cannot cover that right now.");
              return done();
            }
            s.heat = 20;
            note("Lawyered up", "Your lawyer does the talking. The detectives leave with nothing.", done);
          },
        ],
        [
          "Say nothing",
          () => {
            if (rnd() < 0.5) {
              s.heat = 25;
              note("They leave", "They leave a card on the table. They will be back.", done);
            } else {
              s.heat = 30;
              done();
              typeof arrest === "function" ? arrest("money laundering", [2, 6]) : note("Arrested", "They take you in for questioning.");
            }
          },
          "gray",
        ],
      ],
    });
  }

  // ------------------------------------------------------------------ 5. fans vs. critics
  const FAN_UP = ["You are the reason I never gave up. Thank you.", "Best in the game, and a good person too.", "You deserve every penny.", "Just got your autograph. Best day ever!"];
  const FAN_DOWN = ["Overrated and overpaid.", "Must be nice to buy a mansion while the rest of us pay rent.", "Never gave a cent to anyone. Typical.", "Another rich person who forgot where they came from."];
  const FAN_MIX = ["Love your work, but the show-off posts are a bit much.", "Great player, wish you were more humble.", "Some say you are a legend, some say a fraud. I just watch."];
  function fanComment() {
    const s = R();
    if (fameNow() < 15 && worth() < 5e6) return;
    if (rnd() > 0.5) return;
    const up = s.love >= 60,
      down = s.love <= 38;
    const text = pick(up ? FAN_UP : down ? FAN_DOWN : FAN_MIX);
    const h = "@" + pick(["maria", "juan", "carlos", "ana", "dani", "luis", "sofi", "pepe"]) + ri(10, 99);
    stat("Happiness", up ? ri(1, 3) : down ? -ri(1, 3) : 0);
    setTimeout(() => banner("fan", h, text), 1500);
  }

  // ------------------------------------------------------------------ 6. taxes + audits
  const RATE = 0.2;
  function taxSeason(base, done) {
    const s = R();
    const honest = Math.round(base * RATE);
    const half = Math.round(base * RATE * 0.5);
    const acct = Math.round(base * 0.15);
    const payCap = (n) => Math.min(n, Math.floor(bank() * 0.9));
    const finish = () => {
      s.lastNW = worth();
      done();
    };
    card({
      iconSrc: "emoji/1f9fe.png",
      title: "Tax season",
      lead: "The tax office wants to know what you earned this year. How do you want to file?",
      rows: [
        ["Income this year", usdf(base)],
        ["Declare everything", usdf(honest)],
        ["Declare half", usdf(half)],
        ["With an accountant", usdf(acct)],
      ],
      choices: [
        [
          "Declare everything",
          () => {
            spend(payCap(honest));
            s.heat = cl(s.heat - 8);
            s.love = cl(s.love + 2);
            logLine("I paid my taxes in full.");
            finish();
          },
        ],
        [
          "Declare half",
          () => {
            spend(payCap(half));
            s.undeclared += Math.round(base * 0.5);
            s.heat = cl(s.heat + 4);
            logLine("I declared less than I earned.");
            finish();
          },
          "gray",
        ],
        [
          "Hire an accountant",
          () => {
            spend(payCap(acct));
            s.heat = cl(s.heat - 3);
            logLine("My accountant filed my taxes.");
            finish();
          },
        ],
      ],
    });
  }
  function auditCheck(done) {
    const s = R();
    const w = worth();
    const risk = 0.02 + Math.min(0.45, (s.undeclared / Math.max(200000, w * 0.5)) * 0.5) + s.flaunt / 400 + s.heat / 300;
    if (w < 200000 || state.age - s.auditAge < 5 || rnd() > risk) return done();
    s.auditAge = state.age;
    const back = Math.round(s.undeclared * RATE);
    if (back <= 0) {
      stat("Happiness", -1);
      s.flaunt = cl(s.flaunt - 10);
      if (fameNow() >= 20) news(`${who()} ${myName()} is audited by the tax office`);
      return card({
        iconSrc: "emoji/1f9fe.png",
        title: "Tax audit",
        lead: "The tax office went through every receipt you have. They found nothing wrong and apologize for the trouble.",
        ok: () => done(),
      });
    }
    const lawyerFee = Math.max(5000, roundAmt(back * 0.1));
    if (fameNow() >= 20) news(`${who()} ${myName()} is audited by the tax office`);
    card({
      iconSrc: "emoji/1f9fe.png",
      title: "Tax audit",
      lead: "The tax office found income you never declared. They want it back, and they want a penalty too.",
      rows: [
        ["Back taxes", usdf(back)],
        ["With penalty", usdf(back * 2)],
        ["Tax lawyer", usdf(lawyerFee)],
      ],
      choices: [
        [
          "Pay back taxes and penalty",
          () => {
            spend(Math.min(back * 2, bank()));
            s.undeclared = 0;
            s.heat = cl(s.heat - 10);
            logLine("I paid the tax office everything I owed.");
            done();
          },
        ],
        [
          "Hire a tax lawyer",
          () => {
            if (!spend(lawyerFee)) {
              note("Not enough money", "You cannot cover that right now.");
              return done();
            }
            s.undeclared = 0;
            if (rnd() < 0.55) {
              spend(Math.min(back, bank()));
              note("Settled", "Your lawyer gets the penalty dropped. You only pay the back taxes.", done);
            } else {
              spend(Math.min(back * 2, bank()));
              note("Lawyer failed", "The penalty stands. You pay everything and the lawyer's fee too.", done);
            }
          },
        ],
        [
          "Fight it",
          () => {
            if (rnd() < 0.3) {
              s.undeclared = 0;
              s.heat = cl(s.heat + 8);
              note("You won", "The case collapses. The tax office is furious, but you walk.", done);
            } else {
              s.undeclared = 0;
              spend(Math.min(back * 2, bank()));
              done();
              typeof arrest === "function" ? arrest("tax evasion", [1, 4]) : note("Arrested", "You are charged with tax evasion.");
            }
          },
          "gray",
        ],
      ],
    });
  }

  // ------------------------------------------------------------------ yearly driver
  function yearly(force) {
    try {
      if (!enabled()) return;
      const s = R();
      if (!force && s.yearDone === state.age) return;
      s.yearDone = state.age;
      const flaunted = s.flaunt; // read before cooling down
      s.flaunt = cl(s.flaunt - 6);
      // heat: hidden income and showing off raise it, time cools it down
      s.heat = cl(s.heat - 4 + (s.undeclared > 0 ? Math.min(10, 2 + (s.undeclared / Math.max(1, worth())) * 60) : 0) + (flaunted >= 20 ? 4 : 0));
      s.love = cl(s.love + (s.love > 55 ? -1 : s.love < 55 ? 1 : 0)); // drifts back to normal
      watchPurchases();
      settleLoans();
      fanComment();
      const w = worth();
      const queue = [];
      if (s.lastNW == null) s.lastNW = w;
      const base = Math.max(0, w - s.lastNW);
      if (state.age >= 18 && base >= 250000) queue.push(taxSeason.bind(null, base));
      else s.lastNW = w;
      const extra = [];
      if (w >= 100000 && rnd() < (w >= 1e6 ? 0.28 : 0.18)) extra.push(requestEvent);
      if (w >= 300000 && rnd() < 0.12) extra.push(scamEvent);
      if (w >= 200000) extra.push(auditCheck);
      if (s.heat >= 45 && rnd() < 0.4) extra.push(detectives);
      if (w >= 1e6 && flaunted >= 15 && rnd() < 0.15) extra.push(breakIn);
      extra.sort(() => rnd() - 0.5);
      // detectives and audits come first, then at most one more popup
      const pri = extra.filter((f) => f === detectives || f === auditCheck);
      const rest = extra.filter((f) => f !== detectives && f !== auditCheck);
      queue.push(...pri.slice(0, 1), ...rest.slice(0, 1));
      const run = () => {
        const f = queue.shift();
        if (!f || state.dead) return;
        try {
          f(() => later(run, 500));
        } catch (e) {
          warn("event", e);
          later(run, 500);
        }
      };
      later(run);
    } catch (e) {
      warn("yearly", e);
    }
  }

  // ------------------------------------------------------------------ boot
  function boot() {
    if (typeof state === "undefined" || typeof renderStats !== "function" || typeof jCard !== "function" || !document.getElementById("ageBtn")) return setTimeout(boot, 150);
    const orig = renderStats;
    renderStats = function () {
      const r = orig.apply(this, arguments);
      try {
        if (state && !state.dead && state.props) watchPurchases();
      } catch {}
      return r;
    };
    document.getElementById("ageBtn").addEventListener("click", () => setTimeout(() => yearly(false), 1700));
    console.log("[rich-life] loaded");
  }
  window.FL_RICH = { state: R, yearly, worth, requestEvent, scamEvent, detectives, taxSeason, auditCheck, breakIn };
  boot();
})();
