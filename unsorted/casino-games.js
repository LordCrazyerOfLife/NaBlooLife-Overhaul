/* [mod] Casino Games for NaBlooLife (local mod).
 *
 * Unlocks the "Premium Casino Games" that the game lists but never shipped (they all open "coming soon"):
 * Roulette, Slots, High-Low, Craps, Keno, Sports Betting and Texas Hold'em.
 *
 * Built on the SAME pieces as the game's blackjack so they feel identical:
 *  - same modal (ev / evWrap, .jcw), same bet screen (range slider, session + lifetime earnings),
 *  - same 40x56 cards (.bj-card) that fly in from the right edge in 70 ms and flip with a 135 ms squeeze,
 *  - same "pop" buttons (.bj-pop), result line (.bj-result), casino sounds, Golden Neko luck (+20% on profit),
 *    random casino + named dealer with a face, flavor notices and the loop back to the bet screen.
 *
 * Entry: Activities -> Gamble -> Casino Games. Deps: globals from game.html (ev, evWrap, sfx, usd, state, ...).
 */
(() => {
  "use strict";
  if (window.FL_CASINO) return;
  window.FL_CASINO = true;

  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const $ = (id) => document.getElementById(id);
  const money = (n) => (typeof usd === "function" ? usd(Math.round(n)) : "$" + Math.round(n).toLocaleString("en-US"));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  // translate a whole HTML string (bold tags split text nodes, so the DOM dictionary can't see it)
  const TR = (s) => (window.FL_I18N ? FL_I18N.t(s) : s);
  const sfx2 = (n) => {
    try {
      if (typeof sfx === "function") sfx(n);
    } catch {}
  };
  const lucky = () => {
    try {
      return typeof nekoLuck === "function" && nekoLuck();
    } catch {
      return false;
    }
  };
  const wait = (ms, fn) => setTimeout(fn, ms);

  // ------------------------------------------------------------------ css (extends the blackjack look)
  const css = `
  .cg-txt{color:#3d1515;text-align:center;font-size:15px;line-height:1.35;margin:8px 0}
  .phone.dark .cg-txt{color:#f1f2f4}
  .cg-txt b{font-weight:900}
  .cg-sel{width:100%;margin:10px 0 0;padding:9px 10px;border-radius:10px;border:2px solid #d9c9c9;font:inherit;font-weight:700;background:#fff;color:#3d1515}
  .phone.dark .cg-sel{background:#23262c;color:#f1f2f4;border-color:#3a3f48}
  .cg-btns{display:flex;flex-direction:column;gap:2px}
  .rl-win{position:relative;width:100%;height:46px;overflow:hidden;border-radius:10px;margin:10px 0;background:#0f3d24}
  .rl-win:after{content:"";position:absolute;left:50%;top:0;bottom:0;width:3px;margin-left:-1px;background:#ffd23f;box-shadow:0 0 6px #ffd23f;z-index:2}
  .rl-strip{display:flex;height:100%;will-change:transform}
  .rl-c{flex:none;width:40px;height:100%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;color:#fff;border-right:1px solid rgba(0,0,0,.25)}
  .rl-c.r{background:#c4161c}.rl-c.b{background:#171717}.rl-c.g{background:#0b8a3c}
  .rl-res{display:inline-block;min-width:34px;padding:2px 8px;border-radius:8px;color:#fff;font-weight:900}
  .rl-res.r{background:#c4161c}.rl-res.b{background:#171717}.rl-res.g{background:#0b8a3c}
  .sl-row{display:flex;justify-content:center;gap:8px;margin:12px 0}
  .sl-reel{position:relative;width:58px;height:132px;overflow:hidden;border-radius:10px;background:#fff;border:3px solid #b8860b;box-shadow:inset 0 0 8px rgba(0,0,0,.25)}
  .sl-reel:before{content:"";position:absolute;left:0;right:0;top:44px;height:44px;border-top:2px solid #d4141c;border-bottom:2px solid #d4141c;z-index:2;pointer-events:none}
  .sl-strip{will-change:transform}
  .sl-sym{width:100%;height:44px;display:flex;align-items:center;justify-content:center}
  .sl-sym img{width:34px;height:34px}
  .sl-win{animation:bjPop .08s ease-out;box-shadow:0 0 12px #ffd23f,inset 0 0 8px rgba(0,0,0,.25)}
  .cp-row{display:flex;justify-content:center;gap:14px;margin:12px 0}
  .cp-die{width:62px;height:62px;box-sizing:border-box;border-radius:14px;background:#fff;border:3px solid #3d1515;box-shadow:0 3px 0 rgba(0,0,0,.25);display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);padding:7px;gap:2px}.cp-die i{border-radius:50%;margin:auto;width:11px;height:11px}.cp-die i.on{background:#111}
  .cp-die.roll{transition:transform .055s linear}
  .kn-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;margin:10px 0}
  .kn-n{min-height:34px;border-radius:8px;border:1px solid #d9c9c9;background:#fff;color:#3d1515;font:inherit;font-size:14px;font-weight:800;padding:0;cursor:pointer;touch-action:manipulation}
  .phone.dark .kn-n{background:#23262c;color:#f1f2f4;border-color:#3a3f48}
  .kn-n.pk{background:#ffd23f;color:#3d1515;border-color:#b8860b}
  .kn-n.dr{background:#d9d9d9}
  .kn-n.hit{background:#0b8a3c;color:#fff;border-color:#0b8a3c;animation:bjPop .08s ease-out}
  .sp-board{display:flex;align-items:center;justify-content:space-between;margin:10px 0;color:#3d1515;font-weight:900}
  .phone.dark .sp-board{color:#f1f2f4}
  .sp-board .tm{flex:1;text-align:center;font-size:13px;line-height:1.2}
  .sp-board .sc{font-size:30px;padding:0 10px}
  .sp-feed{min-height:46px;font-size:13px;color:#3d1515;text-align:center}
  .phone.dark .sp-feed{color:#f1f2f4}
  .sp-match{border:2px solid #e3d6d6;border-radius:12px;padding:8px;margin:8px 0;color:#3d1515}
  .phone.dark .sp-match{border-color:#3a3f48;color:#f1f2f4}
  .sp-match b{display:block;text-align:center;margin-bottom:6px;font-size:14px}
  .sp-odds{display:flex;gap:6px}
  .sp-odds button{flex:1;padding:8px 2px;border-radius:10px;border:0;background:#0d4f9a;color:#fff;font:inherit;font-weight:800;font-size:12px}
  .tx-board .bj-hand{height:60px}
  .cg-modal button{touch-action:manipulation}
  .cg-modal .jm-apply.ev-btn{min-height:46px}
  .cg-sel{min-height:46px;font-size:16px}
  .sp-odds button{min-height:50px;font-size:13px;cursor:pointer}
  .cg-kb{font-size:11px;opacity:.55;text-align:center;margin-top:6px}
  @media (max-height:700px){.sl-row{margin:6px 0}.cp-row{margin:6px 0}.bj-table{margin:4px 0 14px}}
  @media (min-width:700px){.cg-kb{display:block}}
  @media (hover:none){.cg-kb{display:none}}
  `;
  const st = document.createElement("style");
  st.id = "flCasinoCss";
  st.textContent = css;
  document.head.appendChild(st);

  // ------------------------------------------------------------------ shared toolkit
  const newDeck = () => {
    const d = [];
    for (let s = 0; s < 4; s++) for (let r = 0; r < 13; r++) d.push({ s, r });
    return d.sort(() => rnd() - 0.5);
  };
  const cardEl = (c, back) => {
    const a = document.createElement("div");
    a.className = "bj-card" + (back ? " back" : "");
    a.innerHTML = `<img class="rk" src="casino/${c.s === 1 || c.s === 2 ? "red" : "black"}${c.r}.png" alt=""><img class="st" src="casino/suit${c.s}.png" alt="">`;
    return a;
  };
  // card flies in from the right edge of the table (same 70 ms flight as blackjack)
  const dealCard = (tbl, hand, c, back) => {
    const r = tbl.getBoundingClientRect();
    const l = hand.getBoundingClientRect();
    const last = hand.lastElementChild;
    const left = last ? last.getBoundingClientRect().left - r.left + 29 : (r.width - 40) / 2;
    const u = cardEl(c, back);
    u.classList.add("bj-fly");
    Object.assign(u.style, { left: r.width - 44 + "px", top: l.top - r.top + (l.height - 56) / 2 + "px", opacity: 0.5 });
    tbl.append(u);
    u.offsetWidth;
    Object.assign(u.style, { left: `${left}px`, opacity: 1 });
    sfx2("CardFlipFast");
    wait(70, () => {
      u.remove();
      hand.append(cardEl(c, back));
    });
  };
  const flipCard = (node, cb) => {
    sfx2("CardFlip");
    node.classList.add("squeeze");
    wait(135, () => {
      node.classList.remove("back");
      node.classList.remove("squeeze");
      if (cb) cb();
    });
  };

  const closeModal = () => {
    evWrap.classList.remove("open");
    ev.style.overflow = "";
  };
  const openModal = (html, then) => {
    evWrap.classList.remove("open");
    ev.style.overflow = "";
    wait(160, () => {
      ev.classList.remove("death18");
      ev.innerHTML = html;
      evWrap.classList.add("open");
      // two frames so the browser has laid the popup out before anything measures or animates
      if (then) requestAnimationFrame(() => requestAnimationFrame(then));
    });
  };

  const dealerOf = (e) => {
    e.dealer ||= typeof any === "function" && typeof DEALERS !== "undefined" ? any(DEALERS) : ["Marco", "m"];
    return e.dealer;
  };

  // modal with the dealer's face, lead text, a body and an #cgEnd area (like blackjackTable)
  function table(e, title, lead, body, after) {
    const [name, g] = dealerOf(e);
    openModal(
      `<div class="jcw cg-modal"><div class="jm-tag" style="margin-top:12px">${esc(title)}</div>
      <h4><i class="bj-face"></i><span>${esc(name)} (Dealer)</span></h4>
      <div class="lead">${TR(lead)}</div>${body}<div id="cgEnd"></div></div>`,
      () => {
        try {
          e.dealerLook ||= randomLook(g, (e.dealerAge ||= rint(24, 55)));
          ev.querySelector("i.bj-face").replaceWith(npcFace(e.dealerLook, g, e.dealerAge, "happy", "bj-face"));
        } catch {}
        if (after) after();
      },
    );
  }

  function setButtons(list) {
    const end = $("cgEnd");
    if (!end) return;
    end.innerHTML = `<div class="cg-btns">${list.map(([label, , id]) => `<button class="jm-apply ev-btn bj-pop" id="${id}">${label}</button>`).join("")}</div>`;
    list.forEach(([, fn, id]) => {
      const b = $(id);
      if (b) b.onclick = () => {
        end.innerHTML = "";
        fn();
      };
    });
  }

  // ------------------------------------------------------------------ bet screen (same as blackjackBet)
  function betScreen(game, e) {
    if (state.dead) return;
    if (state.money < 10) return typeof leaveCasino === "function" ? leaveCasino(e, true) : 0;
    const t = Math.max(10, Math.min(state.money, 1e7));
    const a = t >= 1e6 ? 1e3 : t >= 1e4 ? 100 : 10;
    const o = Math.max(a, Math.min(t, e.last || Math.round((0.1 * t) / a) * a));
    const life = state.casinoLife ? `You have lifetime casino ${state.casinoLife > 0 ? "earnings" : "losses"} of ${money(Math.abs(state.casinoLife))}.<br><br>` : "";
    ev.classList.remove("death18");
    ev.innerHTML = `<div class="jcw cg-modal"><div class="jm-x" id="cgX" style="left:-14px;top:-14px">${typeof CARD_X !== "undefined" ? CARD_X : "x"}</div><div class="jm-tag" style="margin-top:12px">Casino</div>
      <h4><img src="casino/casino-${game.icon}.png" alt=""><span>${esc(e.casino)}</span></h4>
      <div class="lead">${life}${game.lead}</div>
      <table class="jc"><tbody><tr><td><b>Bank Balance:</b> ${money(state.money)}</td></tr><tr><td><b>Session Earnings:</b> ${e.earned < 0 ? `-${money(-e.earned)}` : money(e.earned)}</td></tr></tbody></table>
      <div class="gm-row" style="margin-top:18px"><span class="hr-lab" style="margin:0">Bet</span><b id="cgAmt">${money(o)}</b></div>
      <input type="range" class="gm-range" id="cgRange" min="${a}" max="${Math.floor(t / a) * a || a}" step="${a}" value="${o}">
      ${game.extra ? game.extra(e) : ""}
      <button class="jm-apply ev-btn" id="cgPlay">${game.cta}</button><button class="jm-apply ev-btn" id="cgLeave">Leave the casino</button><div class="cg-kb">Enter = play &middot; Esc = leave &middot; &larr; &rarr; = bet</div></div>`;
    ev.style.overflow = "visible";
    if (game.bind) game.bind();
    const n = $("cgRange");
    n.oninput = () => {
      $("cgAmt").textContent = money(+n.value);
    };
    const leave = () => {
      closeModal();
      if (typeof leaveCasino === "function") leaveCasino(e);
    };
    $("cgX").onclick = () => {
      if (typeof play === "function") play("dismiss");
      leave();
    };
    $("cgLeave").onclick = leave;
    $("cgPlay").onclick = () => {
      const b = Math.min(+n.value, state.money);
      e.last = b;
      if (game.read) game.read(e);
      game.play(e, b);
    };
    evWrap.classList.add("open");
  }

  // ------------------------------------------------------------------ settle (same flow as blackjack's end of hand)
  const FLAVOR = {
    win: ["High roller", "Winner winner", "Lady luck", "Hot streak"],
    lose: ["What was I thinking", "House always wins", "Easy come, easy go", "Maybe next time"],
  };
  function settle(ctx, payout, label, game) {
    const { e } = ctx;
    let l = Math.max(0, Math.round(payout));
    if (l > ctx.bet && lucky()) l += Math.round(0.2 * (l - ctx.bet));
    const c = l - ctx.bet;
    state.money += l;
    e.earned += c;
    state.casinoLife = (state.casinoLife || 0) + c;
    if (typeof renderStats === "function") renderStats();
    if (c > 0) sfx2("CasinoWin2");
    else if (c < 0) sfx2("CasinoLose2");
    if (typeof say === "function") {
      say(c > 0 ? `I won ${money(c)} at ${game.say} at ${e.casino}.` : c < 0 ? `I lost ${money(-c)} at ${game.say} at ${e.casino}.` : `I broke even at ${game.say} at ${e.casino}.`);
    }
    const end = $("cgEnd");
    if (!end) return;
    const again = state.money >= (ctx.base || ctx.bet) && state.money >= 10;
    end.innerHTML = `<div class="bj-result">${label}</div><div class="cg-btns">${again ? `<button class="jm-apply ev-btn bj-pop" id="cgAgain">Again (${money(ctx.base || ctx.bet)})</button>` : ""}<button class="jm-apply ev-btn bj-pop" id="cgCont">Continue</button></div>`;
    if (again)
      $("cgAgain").onclick = () => {
        closeModal();
        wait(80, () => game.play(e, ctx.base || ctx.bet));
      };
    $("cgCont").onclick = () => {
      closeModal();
      const [t, a] =
        c > 0
          ? [pick(FLAVOR.win), `You won ${money(c)} at ${game.say}!`]
          : c < 0
            ? [pick(FLAVOR.lose), `You lost ${money(-c)} at ${game.say}.`]
            : ["Push", `You broke even at ${game.say}.`];
      if (typeof notice === "function") notice(t, a, () => wait(80, () => betScreen(game, e)), true);
      else betScreen(game, e);
    };
  }

  const G = {};

  // ================================================================== ROULETTE
  const RL_ORDER = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
  const RL_RED = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
  const rlCol = (n) => (n === 0 ? "g" : RL_RED.has(n) ? "r" : "b");
  const RL_BETS = {
    red: ["Red", (n) => n && RL_RED.has(n), 2],
    black: ["Black", (n) => n && !RL_RED.has(n), 2],
    odd: ["Odd", (n) => n && n % 2 === 1, 2],
    even: ["Even", (n) => n && n % 2 === 0, 2],
    low: ["1-18", (n) => n >= 1 && n <= 18, 2],
    high: ["19-36", (n) => n >= 19, 2],
    d1: ["1st dozen (1-12)", (n) => n >= 1 && n <= 12, 3],
    d2: ["2nd dozen (13-24)", (n) => n >= 13 && n <= 24, 3],
    d3: ["3rd dozen (25-36)", (n) => n >= 25, 3],
    num: ["Single number", null, 36],
  };
  G.roulette = {
    icon: "roulette", name: "Roulette", say: "the roulette table", cta: "Spin the wheel!",
    lead: "Place your roulette bets! Single zero, so the house keeps 2.7%.",
    extra: () =>
      `<select class="cg-sel" id="cgBet">${Object.entries(RL_BETS).map(([k, v]) => `<option value="${k}">${v[0]} (pays ${v[2] - 1}:1)</option>`).join("")}</select>
       <select class="cg-sel" id="cgNum" style="display:none">${RL_ORDER.slice().sort((a, b) => a - b).map((n) => `<option value="${n}">Number ${n}</option>`).join("")}</select>
       `,
    bind: () => {
      const sel = $("cgBet");
      const num = $("cgNum");
      if (sel && num) sel.onchange = () => (num.style.display = sel.value === "num" ? "" : "none");
    },
    read: (e) => {
      e.rlBet = $("cgBet").value;
      e.rlNum = +$("cgNum").value;
    },
    play(e, bet) {
      const key = e.rlBet || "red";
      const def = RL_BETS[key];
      state.money -= bet;
      if (typeof renderStats === "function") renderStats();
      const ctx = { e, bet, base: bet };
      const what = key === "num" ? `number ${e.rlNum}` : def[0].toLowerCase();
      table(e, "Roulette", `You have ${money(bet)} on <b>${esc(what)}</b>.`, `<div class="rl-win"><div class="rl-strip" id="rlS"></div></div><div class="cg-txt" id="rlR">No more bets...</div>`, () => {
        const strip = $("rlS");
        const reps = 6;
        let html = "";
        for (let k = 0; k < reps; k++) for (const n of RL_ORDER) html += `<div class="rl-c ${rlCol(n)}">${n}</div>`;
        strip.innerHTML = html;
        const result = ri(0, 36);
        const idx = RL_ORDER.indexOf(result);
        const win = strip.parentElement.getBoundingClientRect().width || 280;
        strip.style.transform = `translateX(${-(2 * 37 * 40) + win / 2}px)`;
        strip.offsetWidth;
        const target = -((4 * 37 + idx) * 40 + 20 - win / 2 + ri(-10, 10));
        strip.style.transition = "transform 1.9s cubic-bezier(.1,.72,.16,1)";
        strip.style.transform = `translateX(${target}px)`;
        sfx2("CasinoOpen");
        for (let i = 0; i < 20; i++) wait(1900 * (1 - Math.pow(1 - i / 20, 2)), () => sfx2("CardFlipFast"));
        wait(2050, () => {
          let won = key === "num" ? result === e.rlNum : !!def[1](result);
          const mult = def[2];
          $("rlR").innerHTML = `<span class="rl-res ${rlCol(result)}">${result}</span> ${rlCol(result) === "g" ? "Green" : rlCol(result) === "r" ? "Red" : "Black"}`;
          settle(ctx, won ? bet * mult : 0, won ? (mult >= 36 ? "Straight up!" : "You Won!") : "You Lost!", G.roulette);
        });
      });
    },
  };

  // ================================================================== SLOTS
  const SL = [
    ["lemon", "emoji/1f34b.png", 30, 7],
    ["banana", "emoji/1f34c.png", 24, 14],
    ["bell", "emoji/1f514.png", 16, 27],
    ["star", "emoji/2b50.png", 10, 55],
    ["gem", "emoji/1f48e.png", 5, 130],
    ["jackpot", "emoji/1f4b0.png", 2, 500],
  ];
  const slPick = () => {
    let r = rnd() * SL.reduce((s, x) => s + x[2], 0);
    for (let i = 0; i < SL.length; i++) if ((r -= SL[i][2]) < 0) return i;
    return 0;
  };
  G.slots = {
    icon: "slots", name: "Slots", say: "the slot machine", cta: "Pull the lever!",
    lead: "Line up three symbols. Two lemons on the left still pay.",
    play(e, bet) {
      state.money -= bet;
      if (typeof renderStats === "function") renderStats();
      const ctx = { e, bet, base: bet };
      const res = [slPick(), slPick(), slPick()];
      table(e, "Slots", `You have ${money(bet)} on the line.`, `<div class="sl-row">${[0, 1, 2].map((i) => `<div class="sl-reel" id="slR${i}"><div class="sl-strip" id="slS${i}"></div></div>`).join("")}</div><div class="cg-txt" id="slT">Paytable: lemon x7, banana x14, bell x27, star x55, gem x130, jackpot x500</div>`, () => {
        const img = (k) => `<div class="sl-sym"><img src="${SL[k][1]}" alt=""></div>`;
        const stops = [650, 950, 1250];
        res.forEach((r, i) => {
          const strip = $("slS" + i);
          const seq = Array.from({ length: 22 }, () => slPick());
          seq.push(slPick(), r, slPick());
          strip.innerHTML = seq.map(img).join("");
          strip.style.transform = "translateY(0)";
          strip.offsetWidth;
          strip.style.transition = `transform ${stops[i]}ms cubic-bezier(.2,.7,.2,1)`;
          strip.style.transform = `translateY(${-(seq.length - 3) * 44}px)`;
          for (let k = 1; k <= 6; k++) wait((stops[i] * k) / 7, () => sfx2("CardFlipFast"));
          wait(stops[i] + 20, () => sfx2("CardFlip"));
        });
        sfx2("CasinoOpen");
        wait(1350, () => {
          let mult = 0;
          let label = "You Lost!";
          if (res[0] === res[1] && res[1] === res[2]) {
            mult = SL[res[0]][3];
            label = res[0] === 5 ? "JACKPOT!" : `Three ${SL[res[0]][0]}s!`;
            [0, 1, 2].forEach((i) => $("slR" + i).classList.add("sl-win"));
          } else if (res[0] === 0 && res[1] === 0) {
            mult = 1;
            label = "Two lemons: money back";
            [0, 1].forEach((i) => $("slR" + i).classList.add("sl-win"));
          } else if (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) {
            label = "So close...";
          }
          settle(ctx, bet * mult, label, G.slots);
        });
      });
    },
  };

  // ================================================================== HIGH-LOW
  G["high-low"] = {
    icon: "high-low", name: "High-Low", say: "the high-low table", cta: "Deal the first card!",
    lead: "Guess higher or lower. Every right guess multiplies your pot. Ties go to the house.",
    play(e, bet) {
      state.money -= bet;
      if (typeof renderStats === "function") renderStats();
      const ctx = { e, bet, base: bet };
      let deck = newDeck();
      let cur = deck.pop();
      let pot = bet;
      let streak = 0;
      table(e, "High-Low", `You have ${money(bet)} riding on this bet.`, `<div class="bj-table"><div class="bj-hand" id="hlH"></div><div class="cg-txt" id="hlS"></div></div>`, () => {
        const tbl = ev.querySelector(".bj-table");
        const hand = $("hlH");
        const score = () => {
          $("hlS").innerHTML = TR(`Pot: <b>${money(pot)}</b> &middot; Streak: <b>${streak}</b>`);
        };
        score();
        wait(70, () => dealCard(tbl, hand, cur, false));
        const showChoices = () => {
          if (deck.length < 4) deck = newDeck().filter((c) => !(c.r === cur.r && c.s === cur.s));
          const hi = deck.filter((c) => c.r > cur.r).length;
          const lo = deck.filter((c) => c.r < cur.r).length;
          const mH = Math.max(1.05, 0.96 / (hi / deck.length || 1));
          const mL = Math.max(1.05, 0.96 / (lo / deck.length || 1));
          const list = [];
          if (hi) list.push([`Higher (x${mH.toFixed(2)})`, () => guess("hi", mH), "hlHi"]);
          if (lo) list.push([`Lower (x${mL.toFixed(2)})`, () => guess("lo", mL), "hlLo"]);
          if (streak > 0) list.push([`Cash out ${money(pot)}`, () => settle(ctx, pot, "Cashed out!", G["high-low"]), "hlCash"]);
          setButtons(list);
        };
        const guess = (dir, mult) => {
          const nx = deck.pop();
          dealCard(tbl, hand, nx, true);
          wait(190, () => {
            const node = hand.lastElementChild;
            flipCard(node, () => {
              const ok = dir === "hi" ? nx.r > cur.r : nx.r < cur.r;
              cur = nx;
              while (hand.children.length > 6) hand.firstElementChild.remove();
              if (ok) {
                pot = Math.round(pot * mult);
                streak++;
                score();
                wait(200, showChoices);
              } else {
                $("hlS").innerHTML = `<b style="color:#d4141c">Wrong!</b>`;
                wait(500, () => settle(ctx, 0, "You Lost!", G["high-low"]));
              }
            });
          });
        };
        wait(420, showChoices);
      });
    },
  };

  // ================================================================== CRAPS
  const PIPS = [[4], [0, 8], [0, 4, 8], [0, 2, 6, 8], [0, 2, 4, 6, 8], [0, 2, 3, 5, 6, 8]];
  const dieHtml = (n) => Array.from({ length: 9 }, (_, i) => `<i class="${PIPS[n - 1].includes(i) ? "on" : ""}"></i>`).join("");
  G.craps = {
    icon: "craps", name: "Craps", say: "the craps table", cta: "Grab the dice!",
    lead: "Bet on the shooter. Pass line wins on 7 or 11, loses on 2, 3 or 12; otherwise the number rolled is the point.",
    extra: () => `<select class="cg-sel" id="cpSide"><option value="pass">Pass line (with the shooter)</option><option value="dont">Don't pass (against the shooter)</option></select>`,
    read: (e) => {
      e.cpSide = $("cpSide").value;
    },
    play(e, bet) {
      const dont = e.cpSide === "dont";
      state.money -= bet;
      if (typeof renderStats === "function") renderStats();
      const ctx = { e, bet, base: bet };
      let point = 0;
      table(e, "Craps", `You have ${money(bet)} on the <b>${dont ? "don't pass" : "pass"} line</b>.`, `<div class="cp-row"><div class="cp-die" id="cpA">${dieHtml(1)}</div><div class="cp-die" id="cpB">${dieHtml(2)}</div></div><div class="cg-txt" id="cpT">Come-out roll</div>`, () => {
        const roll = () => {
          const a = ri(1, 6);
          const b = ri(1, 6);
          const dA = $("cpA");
          const dB = $("cpB");
          dA.classList.add("roll");
          dB.classList.add("roll");
          let i = 0;
          const iv = setInterval(() => {
            dA.innerHTML = dieHtml(ri(1, 6));
            dB.innerHTML = dieHtml(ri(1, 6));
            dA.style.transform = `rotate(${ri(-16, 16)}deg)`;
            dB.style.transform = `rotate(${ri(-16, 16)}deg)`;
            sfx2("CardFlipFast");
            if (++i >= 9) {
              clearInterval(iv);
              dA.innerHTML = dieHtml(a);
              dB.innerHTML = dieHtml(b);
              dA.style.transform = dB.style.transform = "none";
              wait(150, () => resolve(a + b));
            }
          }, 60);
        };
        const resolve = (sum) => {
          const T = $("cpT");
          if (!point) {
            if (sum === 7 || sum === 11) {
              T.innerHTML = `<b>${sum}!</b> Natural.`;
              return settle(ctx, dont ? 0 : bet * 2, dont ? "You Lost!" : "You Won!", G.craps);
            }
            if (sum === 2 || sum === 3 || sum === 12) {
              T.innerHTML = `<b>${sum}</b> Craps.`;
              if (dont && sum === 12) return settle(ctx, bet, "Push (bar 12)", G.craps);
              return settle(ctx, dont ? bet * 2 : 0, dont ? "You Won!" : "You Lost!", G.craps);
            }
            point = sum;
            T.innerHTML = TR(`The point is <b>${point}</b>. Roll it again before a 7.`);
            return setButtons([["Roll the dice", roll, "cpRoll"]]);
          }
          if (sum === point) {
            T.innerHTML = `<b>${sum}!</b> The point is made.`;
            return settle(ctx, dont ? 0 : bet * 2, dont ? "You Lost!" : "You Won!", G.craps);
          }
          if (sum === 7) {
            T.innerHTML = `<b>Seven out.</b>`;
            return settle(ctx, dont ? bet * 2 : 0, dont ? "You Won!" : "You Lost!", G.craps);
          }
          T.innerHTML = TR(`Rolled <b>${sum}</b>. Point is <b>${point}</b>.`);
          setButtons([["Roll again", roll, "cpRoll"]]);
        };
        setButtons([["Roll the dice", roll, "cpRoll"]]);
      });
    },
  };

  // ================================================================== KENO
  const KN_PAY = {
    1: { 1: 3.7 }, 2: { 2: 15.5 }, 3: { 2: 1.3, 3: 53.5 }, 4: { 2: 1.4, 3: 4.3, 4: 142 },
    5: { 3: 2.2, 4: 13.5, 5: 888 }, 6: { 3: 2.4, 4: 5.9, 5: 70.5, 6: 1766 },
    7: { 3: 1.5, 4: 4.4, 5: 29.5, 6: 147, 7: 2938 }, 8: { 4: 3.5, 5: 17.5, 6: 87.5, 7: 525, 8: 5252 },
    9: { 4: 2.8, 5: 7, 6: 35, 7: 210, 8: 1397, 9: 5589 }, 10: { 0: 4.8, 5: 3.2, 6: 24, 7: 95.5, 8: 638, 9: 3191, 10: 15955 },
  };
  G.keno = {
    icon: "keno", name: "Keno", say: "the keno table", cta: "Pick my numbers",
    lead: "Pick up to 10 numbers from 80. Twenty balls get drawn. The more you match, the more it pays.",
    play(e, bet) {
      const picks = new Set();
      table(e, "Keno", `Pick 1 to 10 numbers. Bet: <b>${money(bet)}</b>.`, `<div class="kn-grid" id="knG">${Array.from({ length: 80 }, (_, i) => `<button class="kn-n" data-n="${i + 1}">${i + 1}</button>`).join("")}</div><div class="cg-txt" id="knT"></div>`, () => {
        const info = () => {
          const k = picks.size;
          const top = k ? Math.max(...Object.values(KN_PAY[k])) : 0;
          $("knT").innerHTML = k ? TR(`Picked <b>${k}</b>/10 &middot; top prize <b>x${top}</b>`) : "Tap numbers to pick them";
          setButtons([
            ["Quick pick 8", () => quick(), "knQ"],
            ...(k ? [[`Draw! (${money(bet)})`, () => draw(), "knD"]] : []),
          ]);
        };
        const quick = () => {
          picks.clear();
          while (picks.size < 8) picks.add(ri(1, 80));
          sync();
        };
        const sync = () => {
          ev.querySelectorAll(".kn-n").forEach((b) => b.classList.toggle("pk", picks.has(+b.dataset.n)));
          info();
        };
        ev.querySelectorAll(".kn-n").forEach((b) => {
          b.onclick = () => {
            const n = +b.dataset.n;
            if (picks.has(n)) picks.delete(n);
            else if (picks.size < 10) picks.add(n);
            sfx2("CardFlipFast");
            sync();
          };
        });
        const draw = () => {
          state.money -= bet;
          if (typeof renderStats === "function") renderStats();
          const ctx = { e, bet, base: bet };
          ev.querySelectorAll(".kn-n").forEach((b) => (b.onclick = null));
          const balls = [];
          while (balls.length < 20) {
            const n = ri(1, 80);
            if (!balls.includes(n)) balls.push(n);
          }
          let hits = 0;
          let i = 0;
          const iv = setInterval(() => {
            const n = balls[i++];
            const b = ev.querySelector(`.kn-n[data-n="${n}"]`);
            if (b) {
              if (picks.has(n)) {
                hits++;
                b.classList.add("hit");
                sfx2("CardFlip");
              } else {
                b.classList.add("dr");
                sfx2("CardFlipFast");
              }
            }
            $("knT").innerHTML = TR(`Ball <b>${i}</b>/20 &middot; hits: <b>${hits}</b>`);
            if (i >= 20) {
              clearInterval(iv);
              const mult = KN_PAY[picks.size][hits] || 0;
              wait(350, () => settle(ctx, bet * mult, mult ? `${hits} hits! x${mult}` : `${hits} hit${hits === 1 ? "" : "s"}. No prize`, G.keno));
            }
          }, 95);
        };
        info();
      });
    },
  };

  // ================================================================== SPORTS BETTING (fictional leagues)
  const TEAMS = ["Harbor Sharks", "Metro Falcons", "Iron Wolves", "Coastal Kings", "Desert Vipers", "Northern Lights", "Riverside Rangers", "Crimson Bulls", "Golden Bears", "Valley United", "Capital City", "Steel Rovers", "Lakeside Owls", "Summit Eagles", "Bay Pirates", "Thunder Hawks"];
  const poisson = (l, k) => (Math.exp(-l) * Math.pow(l, k)) / (k < 2 ? 1 : Array.from({ length: k }, (_, i) => i + 1).reduce((a, b) => a * b, 1));
  const poissonSample = (l) => {
    let L = Math.exp(-l);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= rnd();
    } while (p > L && k < 12);
    return k - 1;
  };
  function makeMatch() {
    const [a, b] = [...TEAMS].sort(() => rnd() - 0.5).slice(0, 2);
    const sa = 0.7 + rnd() * 0.8;
    const sb = 0.7 + rnd() * 0.8;
    const lh = 1.35 * Math.sqrt(sa / sb) + 0.15;
    const la = 1.15 * Math.sqrt(sb / sa);
    let ph = 0, pd = 0, pa = 0;
    for (let i = 0; i <= 9; i++) for (let j = 0; j <= 9; j++) {
      const p = poisson(lh, i) * poisson(la, j);
      if (i > j) ph += p; else if (i === j) pd += p; else pa += p;
    }
    const tot = ph + pd + pa;
    const odd = (p) => Math.max(1.05, Math.round((0.94 / (p / tot)) * 100) / 100);
    return { a, b, lh, la, odds: [odd(ph), odd(pd), odd(pa)] };
  }
  G["sports-betting"] = {
    icon: "sports-betting", name: "Sports Betting", say: "the sportsbook", cta: "See today's matches",
    lead: "Pick a match and who wins. The book keeps about 6%.",
    play(e, bet) {
      const matches = [makeMatch(), makeMatch(), makeMatch()];
      table(e, "Sportsbook", `Your stake: <b>${money(bet)}</b>. Pick a result.`, matches.map((m, i) => `<div class="sp-match"><b>${esc(m.a)} vs ${esc(m.b)}</b><div class="sp-odds"><button data-m="${i}" data-r="0">${esc(m.a.split(" ")[0])}<br>x${m.odds[0].toFixed(2)}</button><button data-m="${i}" data-r="1">Draw<br>x${m.odds[1].toFixed(2)}</button><button data-m="${i}" data-r="2">${esc(m.b.split(" ")[0])}<br>x${m.odds[2].toFixed(2)}</button></div></div>`).join(""), () => {
        ev.querySelectorAll(".sp-odds button").forEach((btn) => {
          btn.onclick = () => start(matches[+btn.dataset.m], +btn.dataset.r);
        });
      });
      const start = (m, pickR) => {
        state.money -= bet;
        if (typeof renderStats === "function") renderStats();
        const ctx = { e, bet, base: bet };
        const gh = poissonSample(m.lh);
        const ga = poissonSample(m.la);
        const ev_ = [];
        for (let i = 0; i < gh; i++) ev_.push({ t: ri(1, 90), side: "h" });
        for (let i = 0; i < ga; i++) ev_.push({ t: ri(1, 90), side: "a" });
        ev_.sort((x, y) => x.t - y.t);
        table(e, "Sportsbook", `${esc(m.a)} vs ${esc(m.b)}<br>Your pick: <b>${pickR === 0 ? esc(m.a) : pickR === 2 ? esc(m.b) : "Draw"}</b> at x${m.odds[pickR].toFixed(2)}.`, `<div class="sp-board"><div class="tm">${esc(m.a)}</div><div class="sc" id="spS">0 - 0</div><div class="tm">${esc(m.b)}</div></div><div class="cg-txt"><b id="spM">0'</b></div><div class="sp-feed" id="spF">Kick-off!</div>`, () => {
          let min = 0, h = 0, a = 0, idx = 0;
          sfx2("CasinoOpen");
          const iv = setInterval(() => {
            min++;
            $("spM").textContent = `${min}'`;
            while (idx < ev_.length && ev_[idx].t <= min) {
              const g = ev_[idx++];
              if (g.side === "h") h++; else a++;
              $("spS").textContent = `${h} - ${a}`;
              $("spF").innerHTML = `<b>GOAL!</b> ${esc(g.side === "h" ? m.a : m.b)} (${g.t}')`;
              sfx2("CardFlip");
            }
            if (min >= 90) {
              clearInterval(iv);
              const res = h > a ? 0 : h === a ? 1 : 2;
              $("spF").innerHTML = TR(`Full time: <b>${h} - ${a}</b>`);
              wait(450, () => settle(ctx, res === pickR ? bet * m.odds[pickR] : 0, res === pickR ? "Your bet landed!" : "You Lost!", G["sports-betting"]));
            }
          }, 42);
        });
      };
    },
  };

  // ================================================================== TEXAS HOLD'EM (heads-up vs the dealer)
  const RANKN = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const HANDN = ["High card", "Pair", "Two pair", "Three of a kind", "Straight", "Flush", "Full house", "Four of a kind", "Straight flush"];
  function score5(c) {
    const r = c.map((x) => x.r).sort((a, b) => b - a);
    const flush = c.every((x) => x.s === c[0].s);
    const cnt = {};
    r.forEach((x) => (cnt[x] = (cnt[x] || 0) + 1));
    const groups = Object.entries(cnt).map(([k, v]) => [v, +k]).sort((a, b) => b[0] - a[0] || b[1] - a[1]);
    let straight = false;
    let hi = r[0];
    const u = [...new Set(r)];
    if (u.length === 5 && r[0] - r[4] === 4) straight = true;
    else if (u.length === 5 && r[0] === 12 && r[1] === 3) {
      straight = true;
      hi = 3;
    }
    const k = groups.map((g) => g[1]);
    if (straight && flush) return [8, hi];
    if (groups[0][0] === 4) return [7, ...k];
    if (groups[0][0] === 3 && groups[1][0] === 2) return [6, ...k];
    if (flush) return [5, ...r];
    if (straight) return [4, hi];
    if (groups[0][0] === 3) return [3, ...k];
    if (groups[0][0] === 2 && groups[1][0] === 2) return [2, ...k];
    if (groups[0][0] === 2) return [1, ...k];
    return [0, ...r];
  }
  const cmpScore = (a, b) => {
    for (let i = 0; i < Math.max(a.length, b.length); i++) if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) - (b[i] || 0);
    return 0;
  };
  function best7(cards) {
    let best = null;
    for (let i = 0; i < cards.length; i++) for (let j = i + 1; j < cards.length; j++) {
      const h = cards.filter((_, k) => k !== i && k !== j);
      if (h.length !== 5) continue;
      const s = score5(h);
      if (!best || cmpScore(s, best) > 0) best = s;
    }
    return best;
  }
  function equity(hole, board, sims = 110) {
    const used = new Set([...hole, ...board].map((c) => c.s * 13 + c.r));
    const rest = newDeck().filter((c) => !used.has(c.s * 13 + c.r));
    let w = 0;
    for (let n = 0; n < sims; n++) {
      const d = rest.slice().sort(() => rnd() - 0.5);
      const opp = [d[0], d[1]];
      const full = board.concat(d.slice(2, 2 + (5 - board.length)));
      const a = cmpScore(best7([...hole, ...full]), best7([...opp, ...full]));
      w += a > 0 ? 1 : a === 0 ? 0.5 : 0;
    }
    return w / sims;
  }

  G.texas = {
    icon: "texas", name: "Texas Hold'em", say: "Texas Hold'em", cta: "Ante up!",
    lead: "Heads-up against the dealer. Your bet is the ante; on every street you can check, bet one ante or fold.",
    play(e, ante) {
      state.money -= ante;
      if (typeof renderStats === "function") renderStats();
      const ctx = { e, bet: ante, base: ante };
      const deck = newDeck();
      const me = [deck.pop(), deck.pop()];
      const dl = [deck.pop(), deck.pop()];
      const board = [];
      let pot = ante * 2;
      let street = 0;
      const invest = (n) => {
        state.money -= n;
        ctx.bet += n;
        pot += n;
        if (typeof renderStats === "function") renderStats();
      };
      table(e, "Texas Hold'em", `Ante <b>${money(ante)}</b>. Pot: <b id="txP">${money(pot)}</b>`, `<div class="bj-table tx-board"><div class="bj-hand" id="txD"></div><div class="bj-hand" id="txB"></div><div class="cg-txt" id="txT">Hole cards dealt</div><div class="bj-hand" id="txM"></div></div>`, () => {
        const tbl = ev.querySelector(".bj-table");
        const H = { d: $("txD"), b: $("txB"), m: $("txM") };
        const pt = () => {
          const p = $("txP");
          if (p) p.textContent = money(pot);
        };
        const say2 = (t) => {
          $("txT").innerHTML = t;
        };
        wait(70, () => dealCard(tbl, H.d, dl[0], true));
        wait(220, () => dealCard(tbl, H.m, me[0], false));
        wait(370, () => dealCard(tbl, H.d, dl[1], true));
        wait(520, () => dealCard(tbl, H.m, me[1], false));
        const showdown = () => {
          [...H.d.children].forEach((n, i) => wait(i * 160, () => flipCard(n)));
          wait(420, () => {
            const mine = best7([...me, ...board]);
            const theirs = best7([...dl, ...board]);
            const c = cmpScore(mine, theirs);
            say2(TR(`You: <b>${HANDN[mine[0]]}</b> &middot; Dealer: <b>${HANDN[theirs[0]]}</b>`));
            wait(650, () => settle(ctx, c > 0 ? pot : c === 0 ? pot / 2 : 0, c > 0 ? "You Won!" : c === 0 ? "Split pot" : "You Lost!", G.texas));
          });
        };
        const nextStreet = () => {
          street++;
          if (street > 3) return showdown();
          const n = street === 1 ? 3 : 1;
          for (let i = 0; i < n; i++) {
            const c = deck.pop();
            board.push(c);
            wait(i * 150, () => dealCard(tbl, H.b, c, false));
          }
          say2(street === 1 ? "The flop" : street === 2 ? "The turn" : "The river");
          wait(n * 150 + 250, act);
        };
        const dealerAct = (facing) => {
          const q = equity(dl, board);
          if (facing) {
            const call = q >= 0.36 || rnd() < 0.12;
            return call ? "call" : "fold";
          }
          return q > 0.64 || rnd() < 0.1 ? "bet" : "check";
        };
        const act = () => {
          pt();
          const list = [["Check", onCheck, "txCk"]];
          if (state.money >= ante) list.push([`Bet ${money(ante)}`, onBet, "txBt"]);
          list.push(["Fold", () => settle(ctx, 0, "You folded", G.texas), "txFd"]);
          setButtons(list);
        };
        const onCheck = () => {
          if (dealerAct(false) === "bet") {
            pot += ante;
            pt();
            say2(TR(`The dealer bets <b>${money(ante)}</b>.`));
            const list = [];
            if (state.money >= ante)
              list.push([`Call ${money(ante)}`, () => {
                invest(ante);
                wait(150, nextStreet);
              }, "txCl"]);
            list.push(["Fold", () => settle(ctx, 0, "You folded", G.texas), "txFd"]);
            return setButtons(list);
          }
          say2("The dealer checks.");
          wait(300, nextStreet);
        };
        const onBet = () => {
          invest(ante);
          const r = dealerAct(true);
          if (r === "fold") {
            say2("The dealer folds!");
            [...H.d.children].forEach((n) => n.classList.add("back"));
            return wait(500, () => settle(ctx, pot, "Dealer folds!", G.texas));
          }
          pot += ante;
          pt();
          say2("The dealer calls.");
          wait(350, nextStreet);
        };
        wait(900, act);
      });
    },
  };

  // ------------------------------------------------------------------ starting a game from the casino list
  const ROWS = [
    ["craps", "Craps", "Play at a craps table"],
    ["high-low", "High-Low", "Play at a high-low table"],
    ["keno", "Keno", "Play at a keno table"],
    ["roulette", "Roulette", "Play at a roulette table"],
    ["slots", "Slots", "Play at a slot machine"],
    ["sports-betting", "Sports Betting", "Participate in sports betting"],
    ["texas", "Texas Hold'em", "Play heads-up Texas hold'em"],
  ];

  function startGame(key) {
    const game = G[key];
    if (!game) return;
    if (state.age < 18) return notice("Too Young", "You must be at least 18 to gamble at a casino.", null, true);
    jCard({
      tag: "Leisure",
      iconSrc: "casino/spade-suit.png",
      title: game.name,
      close: true,
      lead: `Which local casino will you visit to play ${game.name.toLowerCase()}?`,
      choices: (state.casinos ||= [...CASINO_NAMES].sort(() => rnd() - 0.5).slice(0, 2)).map((c) => [
        c,
        () => {
          if (typeof snapClose === "function") snapClose();
          sfx2("CasinoOpen");
          wait(120, () => betScreen(game, { casino: c, earned: 0, dealer: typeof any === "function" ? any(DEALERS) : ["Marco", "m"] }));
        },
      ]),
    });
  }

  function decorate() {
    if (typeof sTitle === "undefined" || sTitle.textContent !== "CASINO GAMES") return;
    const dots = typeof DOTS !== "undefined" ? DOTS : "";
    if (!sList.querySelector('[data-cg="roulette"]')) {
      sList.insertAdjacentHTML("beforeend", '<div class="sec">Premium Casino Games</div>');
      for (const [k, n, d] of ROWS) {
        sList.insertAdjacentHTML("beforeend", `<div class="row" data-cg="${k}"><img src="casino/casino-${k}.png"><div class="t"><b>${n}</b><span>${d}</span></div>${dots}</div>`);
      }
    }
    for (const [k] of ROWS) {
      const row = sList.querySelector(`[data-cg="${k}"]`);
      if (!row) continue;
      const seal = row.querySelector("img.seal");
      if (seal) seal.outerHTML = dots;
      const badge = row.querySelector("img.free-badge");
      if (badge) badge.remove();
      row.onclick = () => startGame(k);
    }
  }

  document.addEventListener("keydown", (k) => {
    if (!evWrap.classList.contains("open") || !ev.querySelector(".cg-modal")) return;
    if (k.target && (k.target.tagName === "SELECT" || k.target.tagName === "TEXTAREA")) return;
    const end = [...ev.querySelectorAll("#cgEnd button")];
    const click = (b) => {
      if (b) {
        k.preventDefault();
        b.click();
      }
    };
    if (k.key === "Escape") return click($("cgLeave") || $("cgX"));
    if (k.key === "Enter" || k.key === " ") {
      if (k.target && k.target.tagName === "BUTTON") return;
      return click($("cgPlay") || $("cgCont") || $("cgAgain") || end[0]);
    }
    if (/^[1-9]$/.test(k.key) && end.length) return click(end[Number(k.key) - 1]);
    const r = $("cgRange");
    if (r && (k.key === "ArrowLeft" || k.key === "ArrowRight") && k.target !== r) {
      k.preventDefault();
      r.stepUp && (k.key === "ArrowRight" ? r.stepUp(1) : r.stepDown(1));
      r.dispatchEvent(new Event("input"));
    }
  });

  const orig = window.openCasinoGames;
  if (typeof orig === "function") {
    window.openCasinoGames = function () {
      const r = orig.apply(this, arguments);
      try {
        decorate();
      } catch (err) {
        console.warn("[casino-games]", err);
      }
      return r;
    };
  }
  window.FL_CASINO_API = { start: startGame, games: Object.keys(G) };
})();
