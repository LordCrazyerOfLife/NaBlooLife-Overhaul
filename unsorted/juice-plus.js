/* [mod] Juice Plus for NaBlooLife (local mod). Extends Event Juice.
 *
 *  - Vibration (navigator.vibrate, Android / the APK): a short buzz for arrests and big wins, a long one for death,
 *    a double pulse for a jackpot, picked from what the popup says.
 *  - Rolling numbers: your bank balance counts up or down ($1,000 -> $1,094,688 rolling) instead of jumping, with a
 *    green or red flash and a coin sound when you gain a good amount.
 *  - Confetti: a burst of confetti and a fanfare for big moments (jackpot, titles, Ballon d'Or, the Hall of Fame, a
 *    wedding, a #1 pick...). FL_JUICE2.confetti() to fire it from any mod.
 *  - A world-news ticker under the top bar: headlines for the year (sports, markets, weird news) that have nothing to
 *    do with you. Tap it to read the list.
 *  - Messages from people: some years your mom, your ex, your partner, a friend, a sibling or your agent texts you.
 *    A banner slides in; tap it to read and answer.
 * Respects "reduce motion" and the game's sound setting. State: state.juice2 (JSON only).
 */
(() => {
  "use strict";
  if (window.FL_JUICE2) return;

  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const cl = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const reduce = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const soundOn = () => !(window.SETTINGS_UI && window.SETTINGS_UI.settings && window.SETTINGS_UI.settings.sound === false);
  const warn = (w, e) => console.warn("[juice-plus] " + w, e);

  // ------------------------------------------------------------------ vibration
  const vib = (p) => {
    try {
      if (navigator.vibrate && !localStorage.getItem("fl-vibrate-off")) navigator.vibrate(p);
    } catch {}
  };
  const sfx = (src, vol = 0.7) => {
    try {
      if (!soundOn()) return;
      const a = new Audio(src);
      a.volume = vol;
      a.play().catch(() => {});
    } catch {}
  };

  // ------------------------------------------------------------------ confetti
  let cv = null;
  function confetti(opts = {}) {
    if (reduce()) return;
    try {
      const n = opts.n || 130;
      if (!cv) {
        cv = document.createElement("canvas");
        cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2147483100";
        document.body.appendChild(cv);
      }
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = (cv.width = innerWidth * dpr);
      const H = (cv.height = innerHeight * dpr);
      const g = cv.getContext("2d");
      if (!g) return;
      const colors = opts.gold ? ["#ffd23f", "#ffb703", "#fff1a8", "#f4a300"] : ["#ff4d6d", "#ffd23f", "#3ddc97", "#4dabf7", "#b388ff", "#ffffff"];
      const ps = Array.from({ length: n }, () => ({
        x: W / 2 + (rnd() - 0.5) * W * 0.3,
        y: H * 0.38,
        vx: (rnd() - 0.5) * 14 * dpr,
        vy: (-6 - rnd() * 12) * dpr,
        s: (5 + rnd() * 6) * dpr,
        r: rnd() * 6.28,
        vr: (rnd() - 0.5) * 0.4,
        c: pick(colors),
        coin: !!opts.coins && rnd() < 0.35,
      }));
      let t0 = performance.now();
      const frame = (t) => {
        const dt = Math.min(2, (t - t0) / 16.7);
        t0 = t;
        g.clearRect(0, 0, W, H);
        let alive = 0;
        ps.forEach((p) => {
          p.vy += 0.38 * dpr * dt;
          p.vx *= 0.995;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.r += p.vr * dt;
          if (p.y < H + 40) alive++;
          g.save();
          g.translate(p.x, p.y);
          g.rotate(p.r);
          g.fillStyle = p.c;
          if (p.coin) {
            g.beginPath();
            g.arc(0, 0, p.s * 0.7, 0, 6.28);
            g.fill();
          } else g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
          g.restore();
        });
        if (alive) requestAnimationFrame(frame);
        else g.clearRect(0, 0, W, H);
      };
      requestAnimationFrame(frame);
    } catch (e) {
      warn("confetti", e);
    }
  }
  function celebrate(big) {
    confetti({ n: big ? 170 : 110, coins: !!big, gold: !!big });
    sfx("sounds/a16_sndAchievement.wav", 0.6);
    vib(big ? [50, 40, 50, 40, 160] : [60, 40, 90]);
  }

  // popups -> feelings. Only strong phrases, so it does not fire all the time.
  const RULES = [
    { re: /\b(jackpot|you won!|blackjack!|ballon d['’]or|hall of fame|world record)\b|won the (nba|league|title|championship|world cup|cup|champions league)|nba champion|drafted .*(#1|1st overall)|got married|you.?re engaged|you.?ve won/i, run: () => celebrate(true) },
    { re: /\b(you were promoted|you.?re promoted|new record|you made it)\b/i, run: () => celebrate(false) },
    { re: /\b(arrested|busted|under arrest|handcuff)/i, run: () => vib([250, 90, 250]) },
    { re: /\b(you died|has died|passed away|killed you|rest in peace)\b/i, run: () => vib([500, 120, 300]) },
    { re: /\b(shot|stabbed|crash(ed)?|car accident|injur(y|ed)|broke your)\b/i, run: () => vib([140, 60, 140]) },
  ];
  let lastFx = 0;
  const seen = new WeakSet();
  function scan(node) {
    try {
      if (!node || node.nodeType !== 1 || seen.has(node)) return;
      const box = node.matches && node.matches(".notice-wrap, .jcw, .bj-result, #ev, .jm") ? node : node.querySelector && node.querySelector(".notice, .jcw, .bj-result");
      if (!box) return;
      seen.add(node);
      const txt = (box.textContent || "").slice(0, 600);
      const now = Date.now();
      if (now - lastFx < 900) return;
      for (const r of RULES)
        if (r.re.test(txt)) {
          lastFx = now;
          r.run();
          return;
        }
    } catch {}
  }

  // ------------------------------------------------------------------ rolling money
  let shown = null;
  let raf = 0;
  let lastCoin = 0;
  const fmt = (v) => (typeof cur === "function" ? cur() : "$") + Math.round(v).toLocaleString("en-US");
  const bank = () => (typeof bankTotal === "function" ? bankTotal() : Number(state.money) || 0);
  function rollMoney() {
    try {
      const el = document.getElementById("money");
      if (!el || state.era === "1800s") return (shown = null);
      const target = bank();
      if (shown === null) return (shown = target);
      if (target === shown && !raf) return;
      const from = shown;
      const diff = target - from;
      if (!diff) return;
      cancelAnimationFrame(raf);
      if (reduce() || Math.abs(diff) < 2) {
        shown = target;
        raf = 0;
        return;
      }
      const dur = cl(500 + Math.log10(Math.abs(diff) + 1) * 150, 600, 1700);
      const t0 = performance.now();
      el.style.transition = "color .2s";
      el.style.color = diff > 0 ? "#22b04a" : "#e0402b";
      if (diff > 0 && diff >= Math.max(100, from * 0.01) && Date.now() - lastCoin > 1400) {
        lastCoin = Date.now();
        sfx("sounds/coins-change.mp3", 0.55);
      }
      const step = (t) => {
        const k = cl((t - t0) / dur, 0, 1);
        const e = 1 - Math.pow(1 - k, 3);
        shown = from + diff * e;
        el.textContent = fmt(shown);
        if (k < 1) raf = requestAnimationFrame(step);
        else {
          raf = 0;
          shown = target;
          el.textContent = fmt(target);
          setTimeout(() => (el.style.color = ""), 250);
        }
      };
      raf = requestAnimationFrame(step);
    } catch (e) {
      warn("money", e);
    }
  }

  // ------------------------------------------------------------------ world news ticker
  const J = () => {
    if (!state.juice2 || typeof state.juice2 !== "object") state.juice2 = {};
    state.juice2.news ||= [];
    state.juice2.msgYear ??= -1;
    state.juice2.newsYear ??= -1;
    return state.juice2;
  };
  const COINS = ["$SILLY", "$MOONPIG", "$BREADCOIN", "$NOODL", "$FROGGO", "$ZZZ", "$WAFFLE"];
  const WEIRD = [
    "Man claims to have found the world's largest potato, refuses to share",
    "Town votes to rename itself after a beloved goat",
    "Viral video of a dog driving a golf cart breaks the internet",
    "Scientists confirm: pigeons are not on strike",
    "Restaurant serves a 4 kg burrito, nobody finishes it",
    "Heatwave leaves millions asking: who turned the sun up?",
    "A giant inflatable duck escapes from a harbor",
    "Study finds people still do not read terms and conditions",
    "Global shortage of socks reported, cause unknown",
    "Local cat elected honorary mayor for the third time",
    "Mysterious 'Wednesday' meme takes over social media",
    "Weather forecasters apologize for the fourth time this week",
  ];
  const TECH = [
    "New phone sells out in 12 minutes",
    "App that turns your photos into oil paintings tops the charts",
    "Airline cancels hundreds of flights after software glitch",
    "Electric car maker announces a car that is 'definitely not a toaster'",
    "Streaming service raises prices again, subscribers sigh",
    "Robot vacuum company recalls vacuum that learned to flee",
  ];
  const WORLD = [
    "Storm hits the coast, thousands told to stay home",
    "Two countries sign a new trade deal after a very long dinner",
    "Heavy rains break a decade-old record",
    "Rare comet visible to the naked eye this weekend",
    "City opens the world's tallest slide",
    "Airports brace for the busiest holiday weekend in years",
    "Marathon runner finishes while dressed as a banana, sets record",
  ];
  function headlines() {
    const out = [];
    const yr = (state.birthYear || 2000) + (state.age || 0);
    // football
    try {
      const lg = (window.FL_FUTBOL_DATA && window.FL_FUTBOL_DATA.leagues) || [];
      const cands = lg.filter((l) => l.continental && l.clubs && l.clubs.length);
      if (cands.length) {
        const l = pick(cands.slice(0, 4));
        const top = l.clubs.slice().sort((a, b) => b.rep - a.rep).slice(0, 5);
        out.push(`${pick(top).name} win the ${l.continental}`);
      }
      const l2 = pick(lg.filter((x) => x.clubs && x.clubs.length) || [null]);
      if (l2) out.push(`${pick(l2.clubs.slice().sort((a, b) => b.rep - a.rep).slice(0, 4)).name} clinch the ${l2.name} title`);
    } catch {}
    // basketball
    try {
      const teams = (window.FL_NBA_DATA && window.FL_NBA_DATA.teams) || [];
      if (teams.length) out.push(`${pick(teams.slice().sort((a, b) => b.rep - a.rep).slice(0, 8)).name} win the NBA championship`);
    } catch {}
    // markets
    const pct = ri(2, 9);
    out.push(rnd() < 0.5 ? `Stocks tumble ${pct}% as investors panic` : `Stocks rally ${pct}% to a record high`);
    const c = pick(COINS);
    out.push(rnd() < 0.5 ? `${c} crashes to $0, holders in shock` : `${c} surges ${ri(40, 900)}% after a viral post`);
    if (rnd() < 0.4) out.push(`Gas prices ${rnd() < 0.5 ? "jump" : "drop"} ${ri(3, 14)}% overnight`);
    out.push(pick(TECH));
    out.push(pick(WORLD));
    out.push(pick(WEIRD));
    if (rnd() < 0.5) out.push(pick(WEIRD));
    return out.sort(() => rnd() - 0.5).slice(0, 7).map((t) => ({ y: yr, t }));
  }
  function ensureNews() {
    const j = J();
    if (j.newsYear === state.age) return;
    j.newsYear = state.age;
    j.news = headlines().concat(j.news || []).slice(0, 28);
    draw();
  }
  function draw() {
    try {
      let bar = document.getElementById("flTicker");
      const j = J();
      if (!bar) {
        const prof = document.querySelector(".phone > .profile");
        if (!prof) return;
        bar = document.createElement("div");
        bar.id = "flTicker";
        bar.innerHTML = `<span class="tk-tag">NEWS</span><div class="tk-win"><div class="tk-track"></div></div>`;
        prof.parentNode.insertBefore(bar, prof);
        bar.onclick = openNews;
      }
      const items = j.news.slice(0, 7);
      const html = items.map((n) => `<span>${esc(n.t)}</span>`).join("");
      const tr = bar.querySelector(".tk-track");
      tr.innerHTML = html + html; // twice, for a seamless loop
      const len = items.reduce((s, n) => s + n.t.length, 0);
      tr.style.animationDuration = Math.max(30, Math.round(len / 4.5)) + "s";
    } catch (e) {
      warn("ticker", e);
    }
  }
  function openNews() {
    try {
      const j = J();
      const rows = j.news.slice(0, 24).map((n) => [String(n.y), n.t]);
      jCard({ tag: "News", iconSrc: "emoji/1f4f0.png", title: "World news", lead: "What is happening out there. None of it is about you, probably.", rows, ok: () => {} });
    } catch (e) {
      warn("news", e);
    }
  }

  // ------------------------------------------------------------------ messages from people
  const alive = (p) => p && !p.dead;
  const MSG = {
    mom: ["Did you eat today? I made too much food again.", "I saw something online and thought of you. Call me when you can.", "Your dad says hi. He will not say it to you himself.", "Are you wearing a jacket? It is cold where I am.", "I am so proud of you. That is all. Bye."],
    dad: ["Car is making that noise again. Anyway, how are you?", "Saw your name somewhere. Proud of you, kid.", "Call your mother. She worries. So do I, I guess.", "Remember the fishing trip? I found the photos."],
    sib: ["Mom told me something about you. I need the full story.", "I just beat you at that old game. Rematch?", "Can you lend me some money? Kidding. Mostly.", "Remember when we hid from dad in the garage? I miss that."],
    ex: ["Hey. I know I should not text. How have you been?", "I just saw our song. Thought about you. Sorry.", "Do you still have my hoodie?", "I heard you are doing well. I am happy for you. Really."],
    partner: ["Dinner tonight? I will cook. You do not have to do anything.", "Thinking about you. That is the whole message.", "Do not forget we have that thing on Saturday.", "Just wanted to say thanks for being you."],
    friend: ["Dude, you will not believe what happened to me today.", "We should hang out. It has been forever.", "Remember that old inside joke? It is still the funniest thing ever.", "Are you free this weekend? I have a bad idea."],
    agent: ["Got a call about you. Interesting people. Call me.", "Sponsors are asking about you. Keep playing like that.", "Do not post anything dumb this week. I mean it.", "A club's scouts were asking about you. Quietly. Keep it between us."],
  };
  function candidates() {
    const out = [];
    (state.parents || []).filter(alive).forEach((p) => out.push({ kind: p.role === "Mother" ? "mom" : "dad", name: p.role === "Mother" ? "Mom" : "Dad", p }));
    (state.family || []).filter((f) => f.kind === "sibling" && alive(f) && !f.away).slice(0, 3).forEach((f) => out.push({ kind: "sib", name: f.first, p: f }));
    (state.exes || []).filter(alive).slice(0, 3).forEach((p) => out.push({ kind: "ex", name: p.first, p }));
    if (alive(state.spouse)) out.push({ kind: "partner", name: state.spouse.first, p: state.spouse });
    (state.friends || []).filter(alive).slice(0, 4).forEach((p) => out.push({ kind: "friend", name: p.first, p }));
    const ag = (state.futbol && state.futbol.active && !state.futbol.retired && state.futbol.pro) || (state.nba && state.nba.active && !state.nba.retired && state.nba.stage === "pro");
    if (ag) out.push({ kind: "agent", name: "Your agent", p: null });
    return out;
  }
  function maybeMessage() {
    try {
      if (state.dead || state.age < 9) return;
      const j = J();
      if (j.msgYear === state.age) return;
      j.msgYear = state.age;
      if (rnd() > 0.42) return;
      const c = pick(candidates());
      if (!c) return;
      const text = pick(MSG[c.kind]);
      setTimeout(() => banner(c, text), 1400);
    } catch (e) {
      warn("msg", e);
    }
  }
  function banner(c, text) {
    if (state.dead) return;
    document.getElementById("flMsg")?.remove();
    const b = document.createElement("div");
    b.id = "flMsg";
    b.innerHTML = `<b>${esc(c.name)}</b><span>${esc(text)}</span>`;
    const phone = document.querySelector(".phone") || document.body;
    phone.appendChild(b);
    sfx("sounds/a16_sndMenuButton.wav", 0.5);
    vib([40, 30, 40]);
    const kill = setTimeout(() => b.remove(), 7000);
    b.onclick = () => {
      clearTimeout(kill);
      b.remove();
      reply(c, text);
    };
  }
  function nudge(c, d) {
    try {
      if (c.p && typeof c.p.rel === "number") c.p.rel = cl(c.p.rel + d);
    } catch {}
  }
  function stat(k, d) {
    if (state.stats) state.stats[k] = cl((Number(state.stats[k]) || 0) + d);
    try {
      renderStats();
    } catch {}
  }
  function reply(c, text) {
    const done = (log, fn) => () => {
      fn && fn();
      try {
        say(log);
      } catch {}
    };
    const good = c.kind === "ex" ? ["Reply politely", () => { stat("Happiness", ri(0, 3)); }] : ["Reply warmly", () => { nudge(c, ri(2, 6)); stat("Happiness", ri(2, 5)); }];
    const choices = [
      [good[0], done(c.kind === "ex" ? `My ex ${c.name} texted me and I answered politely.` : `${c.name} texted me and I wrote back.`, good[1])],
      ["Leave it on read", done(`I left ${c.name}'s message on read.`, () => nudge(c, -ri(1, 4)))],
    ];
    if (c.kind === "ex") choices.push(["Block them", done(`I blocked my ex ${c.name}.`, () => stat("Happiness", ri(0, 4)))]);
    if (c.kind === "friend" || c.kind === "sib") choices.splice(1, 0, ["Make plans", done(`${c.name} and I made plans.`, () => { nudge(c, ri(4, 8)); stat("Happiness", ri(3, 6)); })]);
    try {
      jCard({ tag: "Message", iconSrc: "emoji/1f4ac.png", title: c.name, lead: `"${esc(text)}"`, choices });
    } catch (e) {
      warn("reply", e);
    }
  }

  // ------------------------------------------------------------------ boot
  const css = `
#flTicker{display:flex;align-items:center;gap:8px;height:24px;padding:0 10px;background:#101820;color:#e9f1f7;font:800 12.5px/24px "Avenir Next","Mulish","Nunito",system-ui,sans-serif;overflow:hidden;cursor:pointer;flex:0 0 auto}
#flTicker .tk-tag{background:#e2401f;color:#fff;padding:0 7px;border-radius:4px;font-size:10.5px;letter-spacing:.8px;line-height:17px;flex:0 0 auto}
#flTicker .tk-win{overflow:hidden;flex:1;min-width:0}
#flTicker .tk-track{display:inline-flex;white-space:nowrap;animation:flTk 60s linear infinite}
#flTicker .tk-track span{padding-right:46px}
#flTicker .tk-track span::before{content:"\\25CF";color:#e2401f;margin-right:8px;font-size:8px;vertical-align:middle}
@keyframes flTk{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media (prefers-reduced-motion: reduce){#flTicker .tk-track{animation:none}}
#flMsg{position:absolute;left:10px;right:10px;top:10px;z-index:60;background:rgba(245,246,248,.97);color:#111;border-radius:14px;padding:10px 14px;box-shadow:0 6px 20px rgba(0,0,0,.35);cursor:pointer;animation:flMsgIn .3s cubic-bezier(.2,1.2,.3,1);font:700 14px/1.3 "Avenir Next","Mulish","Nunito",system-ui,sans-serif}
#flMsg b{display:block;font-size:12.5px;color:#1a6fd1;margin-bottom:2px}
#flMsg span{display:block}
@keyframes flMsgIn{from{transform:translateY(-120%);opacity:0}to{transform:none;opacity:1}}
`;
  const st = document.createElement("style");
  st.id = "flJuice2Css";
  st.textContent = css;
  document.head.appendChild(st);

  function boot() {
    if (typeof state === "undefined" || typeof renderStats !== "function" || typeof jCard !== "function" || !document.getElementById("money") || !document.querySelector(".phone > .profile")) return setTimeout(boot, 150);
    const orig = renderStats;
    renderStats = function () {
      const r = orig.apply(this, arguments);
      rollMoney();
      return r;
    };
    shown = bank();
    new MutationObserver((muts) => {
      for (const m of muts) m.addedNodes.forEach(scan);
    }).observe(document.querySelector(".phone") || document.body, { childList: true, subtree: true });
    document.getElementById("ageBtn")?.addEventListener("click", () =>
      setTimeout(() => {
        try {
          ensureNews();
          maybeMessage();
        } catch (e) {
          warn("year", e);
        }
      }, 1100),
    );
    ensureNews();
    draw();
    console.log("[juice-plus] loaded");
  }
  window.FL_JUICE2 = { addNews: (t) => { const j = J(); j.news.unshift({ y: (state.birthYear || 2000) + (state.age || 0), t }); j.news = j.news.slice(0, 28); draw(); }, confetti, celebrate, vibrate: vib, news: () => J().news, message: () => maybeMessage(), headlines, say: (c, t) => banner(c, t) };
  boot();
})();
