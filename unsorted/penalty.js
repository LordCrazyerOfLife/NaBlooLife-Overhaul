/* [base] Penalty kicks for NaBlooLife: a canvas minigame.
 *
 * You see your player from behind, the keeper in the goal and the crowd all around. Click (or tap) where you want the
 * ball to go. Your skill decides how far the ball strays from where you aimed; corners are safer from the keeper but
 * can hit the post or go wide. The keeper guesses (a good one reads you a little) and dives, and may or may not save it.
 *
 *   FL_PEN.kick({ name, number, kit, skill, keeper, pressure, title, onDone({goal, saved, post, wide}) })
 *   FL_PEN.shootout({ name, number, kit, skill, myTeam, oppTeam, oppRate, keeper, onDone({won, my, opp}) })
 *   FL_PEN.practice({ name, number, kit, skill, onDone({scored, total}) })
 *
 * skill 0-100, keeper 0-1 (0.5 = average), kit = hue 0-360 for the shirt, oppRate = chance the other team scores.
 */
(() => {
  "use strict";
  if (window.FL_PEN) return;

  const W = 960, H = 600;
  const rnd = Math.random;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const tr = (s) => {
    try {
      return window.FL_I18N ? FL_I18N.t(s) : s;
    } catch {
      return s;
    }
  };
  const gauss = () => {
    let u = 0, v = 0;
    while (!u) u = rnd();
    while (!v) v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const snd = (n) => {
    try {
      if (typeof play === "function") play(n);
    } catch {}
  };
  const hash = (s) => {
    let h = 7;
    for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return h;
  };

  // goal frame, spot and shooter, in the 960x600 scene
  const G = { x: 340, y: 150, w: 280, h: 105 };
  const SPOT = { x: 480, y: 430 };
  const KEEPER_BASE = { x: 480, y: 226 };

  // ------------------------------------------------------------------ stadium geometry
  // the grass starts at PT; t is depth (0 far, 1 at the camera); side stands are rows that climb away from the pitch
  const PT = 128;
  const yAt = (t) => PT + t * (H - PT);
  const pe = (t) => lerp(232, 135, t); // left pitch edge; the right one mirrors
  const pp = (t) => lerp(0.6, 1.7, t); // perspective scale
  const sideXY = (t, off, lift, right) => {
    const p = pp(t);
    const x = pe(t) - off * p;
    return [right ? W - x : x, yAt(t) - lift * p];
  };
  const SK = 24; // side stand rows
  const FAR_AISLES = [150, 330, 630, 810];
  const SIDE_AISLES = [0.12, 0.32, 0.6];
  const SKIN = ["#f3cfb0", "#e7b48d", "#cf966c", "#b07650", "#8a5a3c", "#62402b"];
  const HAIR = ["#1b1410", "#2e1f15", "#4a2e1b", "#7a4a24", "#b98a4a", "#d8c08a", "#8c2f1a"];
  const OL = "#14161c";
  const seeded = (seed) => {
    let t = seed >>> 0;
    return () => ((t = (t * 1664525 + 1013904223) >>> 0) / 4294967296);
  };

  // ------------------------------------------------------------------ the game object
  let ov = null, cv = null, cx = null, raf = 0, scale = 1;
  let S = null; // current screen state

  function ensureDom() {
    if (ov) return;
    ov = document.createElement("div");
    ov.id = "flPen";
    ov.style.cssText = "position:fixed;inset:0;z-index:100050;background:#05080d;display:none;align-items:center;justify-content:center;touch-action:none;user-select:none";
    cv = document.createElement("canvas");
    cv.style.cssText = "display:block;cursor:crosshair;max-width:100%;max-height:100%;touch-action:none";
    ov.appendChild(cv);
    const x = document.createElement("div");
    x.id = "flPenX";
    x.style.cssText = "position:absolute;top:10px;right:12px;padding:8px 14px;border-radius:99px;background:rgba(0,0,0,.55);color:#fff;font:800 14px system-ui,sans-serif;cursor:pointer;border:2px solid rgba(255,255,255,.35)";
    ov.appendChild(x);
    document.body.appendChild(ov);
    cx = cv.getContext("2d");
    window.addEventListener("resize", fit);
    cv.addEventListener("pointermove", (e) => {
      if (!S) return;
      S.mouse = pos(e);
    });
    cv.addEventListener("pointerdown", (e) => {
      if (!S) return;
      S.mouse = pos(e);
      click(S.mouse);
    });
    x.addEventListener("click", () => S && S.onClose && S.onClose());
  }
  function pos(e) {
    const r = cv.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  }
  function fit() {
    if (!cv) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    scale = Math.min(vw / W, vh / H);
    const dpr = window.devicePixelRatio || 1;
    cv.style.width = W * scale + "px";
    cv.style.height = H * scale + "px";
    cv.width = Math.round(W * scale * dpr);
    cv.height = Math.round(H * scale * dpr);
    cx.setTransform((scale * dpr), 0, 0, (scale * dpr), 0, 0);
  }
  function open(state) {
    ensureDom();
    S = state;
    ov.style.display = "flex";
    document.getElementById("flPenX").textContent = S.closeLabel || tr("Skip");
    fit();
    cancelAnimationFrame(raf);
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }
  function close() {
    S = null;
    cancelAnimationFrame(raf);
    if (ov) ov.style.display = "none";
  }

  // ------------------------------------------------------------------ one kick
  function newKick(S0) {
    return Object.assign(S0, {
      phase: "aim", t: 0, aim: null, target: null, outcome: null, keeperK: null, kicked: false, banner: null, ripple: null, bannerT: 0,
    });
  }
  function noiseFor(S0) {
    const skill = cl(S0.skill ?? 65, 10, 99);
    return (0.55 + (100 - skill) / 55) * 12 + (S0.pressure || 0) * 5;
  }
  function decide(S0, aim) {
    const sg = noiseFor(S0);
    const T = { x: aim.x + gauss() * sg, y: aim.y + gauss() * sg * 0.8 };
    const out = { x: T.x, y: T.y, result: "goal" };
    const gx0 = G.x, gx1 = G.x + G.w, gy0 = G.y, gy1 = G.y + G.h;
    const nearPost = (T.x > gx0 - 7 && T.x < gx0 + 7 && T.y > gy0 - 6 && T.y < gy1) || (T.x > gx1 - 7 && T.x < gx1 + 7 && T.y > gy0 - 6 && T.y < gy1);
    const nearBar = T.y > gy0 - 8 && T.y < gy0 + 5 && T.x > gx0 && T.x < gx1;
    if (T.x < gx0 - 7 || T.x > gx1 + 7 || T.y < gy0 - 8 || T.y > gy1 + 30) out.result = T.y < gy0 - 8 ? "over" : "wide";
    else if (nearPost || nearBar) out.result = "post";
    // the keeper
    const k = cl(S0.keeper ?? 0.5, 0, 1);
    const reads = !S0.panenka && rnd() < 0.05 + 0.2 * k;
    let K;
    if (S0.panenka) {
      // a panenka beats a keeper who dives; one who stays put catches it
      const stays = rnd() < 0.28;
      K = stays ? { x: 480 + gauss() * 8, y: G.y + 62 + gauss() * 8 } : { x: rnd() < 0.5 ? G.x + 40 + rnd() * 50 : G.x + G.w - 40 - rnd() * 50, y: G.y + 60 + rnd() * 25 };
    } else if (reads) K = { x: T.x + gauss() * 22, y: T.y + gauss() * 14 };
    else {
      const side = rnd();
      K = { x: side < 0.44 ? gx0 + 20 + rnd() * 90 : side < 0.56 ? 480 + gauss() * 14 : gx1 - 20 - rnd() * 90, y: rnd() < 0.7 ? gy0 + 55 + rnd() * 40 : gy0 + 10 + rnd() * 35 };
    }
    K.x = cl(K.x, gx0 + 14, gx1 - 14);
    K.y = cl(K.y, gy0 + 10, gy1 - 6);
    out.K = K;
    if (out.result === "goal") {
      const edge = Math.min(T.x - gx0, gx1 - T.x, T.y - gy0);
      const R = (30 + 20 * k) * (edge < 22 ? 0.6 : 1);
      if (Math.hypot(T.x - K.x, (T.y - K.y) * 1.15) < R) out.result = "saved";
    }
    return out;
  }
  function click(p) {
    if (!S || S.phase !== "aim") return;
    S.aim = { x: p.x, y: p.y };
    S.outcome = decide(S, S.aim);
    S.target = { x: S.outcome.x, y: S.outcome.y };
    S.phase = "run";
    S.t = 0;
    snd("choice");
  }

  // ------------------------------------------------------------------ timeline
  const RUN = 0.5, FLY = 0.55;
  let last = 0;
  function loop(now) {
    if (!S) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt);
    if (!S) return; // the last kick closed the overlay
    draw();
    raf = requestAnimationFrame(loop);
  }
  function update(dt) {
    S.clock = (S.clock || 0) + dt;
    if (S.phase === "run") {
      S.t += dt;
      if (S.t >= RUN) {
        S.phase = "fly";
        S.t = 0;
        snd("dismiss");
      }
    } else if (S.phase === "fly") {
      S.t += dt;
      if (S.t >= FLY) {
        S.phase = "result";
        S.t = 0;
        reveal();
      }
    } else if (S.phase === "result") {
      S.t += dt;
      if (S.t >= (S.hold || 1.5)) next();
    } else if (S.phase === "opp") {
      S.t += dt;
      if (S.t >= 1.5) nextAfterOpp();
    }
    if (S && S.ripple) S.ripple.t += dt;
  }
  function reveal() {
    const r = S.outcome.result;
    S.banner = { goal: tr("GOAL!"), saved: tr("SAVED!"), post: tr("OFF THE POST!"), over: tr("OVER THE BAR!"), wide: tr("WIDE!") }[r];
    S.bannerCol = r === "goal" ? "#5df07e" : r === "saved" ? "#ffd54a" : "#ff7a6b";
    if (r === "goal") {
      S.ripple = { x: S.target.x, y: S.target.y, t: 0 };
      snd("ding");
      snd("achievement");
    } else snd("buzzer");
    S.cheer = r === "goal" ? 1 : 0;
    S.cheerT = 0;
    S.hold = 1.5;
    S.onKick && S.onKick(r);
  }

  // mode handlers set these
  function next() {
    S.nextFn && S.nextFn();
  }
  function nextAfterOpp() {
    S.afterOpp && S.afterOpp();
  }

  // ------------------------------------------------------------------ drawing
  const hsl = (h, s, l, a = 1) => `hsla(${h},${s}%,${l}%,${a})`;
  function rr(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.lineTo(x + w - r, y);
    g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r);
    g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h);
    g.quadraticCurveTo(x, y + h, x, y + h - r);
    g.lineTo(x, y + r);
    g.quadraticCurveTo(x, y, x + r, y);
    g.closePath();
  }
  function poly(g, pts) {
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.closePath();
  }
  // a limb: dark outline, then the colour on top
  function limb(g, pts, w, col, ow = 1.8) {
    g.lineCap = "round";
    g.lineJoin = "round";
    g.beginPath();
    g.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);
    if (ow) {
      g.strokeStyle = OL;
      g.lineWidth = w + ow;
      g.stroke();
    }
    g.strokeStyle = col;
    g.lineWidth = w;
    g.stroke();
    g.lineCap = "butt";
  }
  function disc(g, x, y, r, col, ow = 1.2) {
    g.beginPath();
    g.arc(x, y, r, 0, 6.2832);
    g.fillStyle = col;
    g.fill();
    if (ow) {
      g.strokeStyle = OL;
      g.lineWidth = ow;
      g.stroke();
    }
  }

  // ---------------- the crowd: positions and looks are seeded, painted once into two offscreen frames
  function genCrowd(kit, kit2) {
    const r = seeded(9137);
    const out = [];
    const neutral = ["#eef0f4", "#2a3040", "#f5c242", "#27c3d1", "#fa6f00", "#e2401f", "#5b6b8a", "#36b34a"];
    const mkFan = (away) => {
      const hue = away ? kit2 : kit;
      let c1, c2;
      if (r() < 0.7) {
        c1 = hsl(hue, 72, 50);
        c2 = r() < 0.5 ? "#f4f5f8" : hsl(hue, 70, 28);
      } else {
        c1 = neutral[Math.floor(r() * neutral.length)];
        c2 = hsl(hue, 72, 50);
      }
      const u = r();
      return {
        skin: SKIN[Math.floor(r() * SKIN.length)], hair: HAIR[Math.floor(r() * HAIR.length)], c1, c2,
        kind: u < 0.4 ? 0 : u < 0.6 ? 1 : u < 0.85 ? 2 : 3, cap: r() < 0.14, bald: r() < 0.07,
        r1: r(), r2: r(), r3: r(),
      };
    };
    // far stand, back rows first
    for (let j = 11; j >= 0; j--) {
      const by = 107 - j * 7.4, s = 0.64 - j * 0.012, step = 9.6 * s;
      for (let x = -4 + (j % 2) * step * 0.5; x < W + 6; x += step) {
        if (FAR_AISLES.some((a) => Math.abs(x - a) < 7)) continue;
        if (r() < 0.04) continue;
        out.push({ x: x + (r() - 0.5) * 1.4, y: by + (r() - 0.5) * 0.8, s: s * (0.92 + r() * 0.16), f: mkFan(x > 700) });
      }
    }
    // side stands, outer (higher) rows first, far to near
    for (let k = SK; k >= 0; k--) {
      for (const right of [false, true]) {
        let t = 0;
        while (t <= 1.03) {
          const p = pp(t), s = 0.7 * p;
          const [x, y] = sideXY(t, 30 + k * 15, 15 + k * 8, right);
          const [x2, y2] = sideXY(t + 0.01, 30 + k * 15, 15 + k * 8, right);
          const len = Math.hypot(x2 - x, y2 - y) / 0.01;
          if (y > 16 && x > -12 && x < W + 12 && !SIDE_AISLES.some((a) => Math.abs(t - a) < 0.014) && r() > 0.04) {
            out.push({ x: x + (r() - 0.5) * s, y, s: s * (0.92 + r() * 0.16), f: mkFan(right && t < 0.45) });
          }
          t += (9.6 * s) / len;
        }
      }
    }
    return out;
  }
  function drawFan(g, x, y, s, f, party) {
    const arms = party ? (f.r1 < 0.72 ? 2 : f.r1 < 0.86 ? 1 : 0) : f.r1 < 0.05 ? 2 : f.r1 < 0.09 ? 1 : 0;
    const flag = party ? f.r2 < 0.16 : f.r2 < 0.045;
    const ow = Math.max(0.5, 0.5 * s);
    // raised arms sit behind the body
    if (arms) {
      const hx = (5.6 + f.r3 * 1.6) * s, hy = y - (14.5 + f.r3 * 2) * s;
      for (const sd of arms === 2 ? [-1, 1] : [1]) {
        limb(g, [x + sd * 3.6 * s, y - 6.5 * s, x + sd * hx, hy], 1.6 * s, f.c1, ow * 1.6);
        disc(g, x + sd * hx, hy, 0.95 * s, f.skin, 0);
      }
      if (flag) {
        const px = x + hx;
        limb(g, [px, hy, px, hy - 9 * s], 0.5 * s, "#d8d8d8", 0);
        g.fillStyle = f.c1;
        g.fillRect(px - 8 * s, hy - 9 * s, 8 * s, 2.5 * s);
        g.fillStyle = f.c2;
        g.fillRect(px - 8 * s, hy - 6.5 * s, 8 * s, 2.5 * s);
      }
    }
    // torso
    g.beginPath();
    g.moveTo(x - 5 * s, y);
    g.lineTo(x - 5 * s, y - 5 * s);
    g.quadraticCurveTo(x - 5 * s, y - 8 * s, x - 2 * s, y - 8 * s);
    g.lineTo(x + 2 * s, y - 8 * s);
    g.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 5 * s, y - 5 * s);
    g.lineTo(x + 5 * s, y);
    g.closePath();
    g.fillStyle = f.c1;
    g.fill();
    g.strokeStyle = OL;
    g.lineWidth = ow;
    g.stroke();
    g.fillStyle = f.c2;
    if (f.kind === 1) g.fillRect(x - 1.3 * s, y - 7.9 * s, 2.6 * s, 7.9 * s);
    else if (f.kind === 3) g.fillRect(x - 4.6 * s, y - 4.6 * s, 9.2 * s, 1.9 * s);
    g.fillStyle = "rgba(0,0,0,.2)";
    g.fillRect(x + 2.4 * s, y - 6.6 * s, 2.3 * s, 6.6 * s);
    if (f.kind === 2) {
      g.fillStyle = f.c2;
      g.fillRect(x - 4.4 * s, y - 8.3 * s, 8.8 * s, 2 * s);
      g.fillRect(x + 1.2 * s, y - 7 * s, 1.8 * s, 4.6 * s);
    }
    // head
    const hy = y - 11.2 * s;
    disc(g, x, hy, 3.3 * s, f.skin, ow);
    if (f.cap) {
      g.fillStyle = f.c1;
      g.beginPath();
      g.arc(x, hy - 0.4 * s, 3.4 * s, Math.PI, 0);
      g.fill();
      g.fillRect(x - 3.4 * s, hy - 0.8 * s, 6.8 * s, 1 * s);
    } else if (!f.bald) {
      g.fillStyle = f.hair;
      g.beginPath();
      g.arc(x, hy - 0.3 * s, 3.45 * s, Math.PI * 1.05, Math.PI * 1.95);
      g.closePath();
      g.fill();
    }
    if (s > 0.85) {
      g.fillStyle = "rgba(20,16,14,.85)";
      g.fillRect(x - 1.5 * s, hy + 0.1 * s, 0.8 * s, 0.9 * s);
      g.fillRect(x + 0.7 * s, hy + 0.1 * s, 0.8 * s, 0.9 * s);
    }
  }
  function paintCrowd(g, fans, party) {
    for (const c of fans) drawFan(g, c.x, c.y, c.s, c.f, party);
    // depth: the back of the stands sits in shadow
    g.globalCompositeOperation = "source-atop";
    const d = g.createLinearGradient(0, 0, 0, H);
    d.addColorStop(0, "rgba(6,10,24,.6)");
    d.addColorStop(0.2, "rgba(6,10,24,.28)");
    d.addColorStop(0.6, "rgba(6,10,24,.08)");
    d.addColorStop(1, "rgba(6,10,24,0)");
    g.fillStyle = d;
    g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = "source-over";
  }

  // ---------------- static background: stand structure, pitch and markings
  function paintBg(g) {
    g.fillStyle = "#0b1226";
    g.fillRect(0, 0, W, H);
    // far stand
    const fs = g.createLinearGradient(0, 14, 0, 112);
    fs.addColorStop(0, "#10172a");
    fs.addColorStop(1, "#232d47");
    g.fillStyle = fs;
    g.fillRect(0, 14, W, 98);
    for (let j = 0; j < 12; j++) {
      const by = 107 - j * 7.4;
      g.fillStyle = "rgba(0,0,0,.22)";
      g.fillRect(0, by - 3, W, 3);
      g.fillStyle = "rgba(150,170,210,.13)";
      g.fillRect(0, by + 0.4, W, 1);
    }
    for (const a of FAR_AISLES) {
      g.fillStyle = "#2c3651";
      g.fillRect(a - 6, 16, 12, 94);
      g.fillStyle = "rgba(255,255,255,.1)";
      for (let j = 0; j < 12; j++) g.fillRect(a - 6, 107 - j * 7.4 - 3.7, 12, 0.8);
    }
    g.fillStyle = "#1a2237";
    g.fillRect(0, 108, W, 12);
    // side stands
    for (const right of [false, true]) {
      const pts = [];
      for (let t = 0; t <= 1.0001; t += 0.05) pts.push(sideXY(t, 18, 12, right));
      const ex = right ? W + 20 : -20;
      pts.push([pts[pts.length - 1][0], H + 5], [ex, H + 5], [ex, 0], sideXY(0, 30 + SK * 15, 15 + SK * 8, right));
      const sg = g.createLinearGradient(right ? W - 240 : 240, 0, right ? W : 0, 0);
      sg.addColorStop(0, "#252f4a");
      sg.addColorStop(1, "#111829");
      g.fillStyle = sg;
      poly(g, pts);
      g.fill();
      // steps
      g.lineWidth = 1;
      for (let k = 0; k <= SK; k++) {
        g.beginPath();
        for (let t = 0; t <= 1.0001; t += 0.05) {
          const [x, y] = sideXY(t, 30 + k * 15 - 7.5, 15 + k * 8 - 3, right);
          if (t === 0) g.moveTo(x, y);
          else g.lineTo(x, y);
        }
        g.strokeStyle = "rgba(150,170,210,.14)";
        g.stroke();
      }
      // aisles
      for (const a of SIDE_AISLES) {
        const L = [], R = [];
        for (let k = -1; k <= SK + 1; k++) {
          L.push(sideXY(a - 0.012, 30 + k * 15, 15 + k * 8, right));
          R.unshift(sideXY(a + 0.012, 30 + k * 15, 15 + k * 8, right));
        }
        g.fillStyle = "#2c3651";
        poly(g, L.concat(R));
        g.fill();
        g.strokeStyle = "rgba(255,255,255,.12)";
        g.beginPath();
        for (let k = 0; k <= SK; k++) {
          const p0 = sideXY(a - 0.012, 30 + k * 15 - 7.5, 15 + k * 8 - 3, right), p1 = sideXY(a + 0.012, 30 + k * 15 - 7.5, 15 + k * 8 - 3, right);
          g.moveTo(p0[0], p0[1]);
          g.lineTo(p1[0], p1[1]);
        }
        g.stroke();
      }
    }
    // grass surround (out to the boards)
    const sur = [];
    for (let t = 0; t <= 1.0001; t += 0.05) sur.push(sideXY(t, 12, 0, false));
    sur.push([-40, H], [W + 40, H]);
    for (let t = 1; t >= -0.0001; t -= 0.05) sur.push(sideXY(t, 12, 0, true));
    g.fillStyle = "#2b8f3d";
    poly(g, sur);
    g.fill();
    // mowed stripes
    for (let i = 0; i < 13; i++) {
      const t0 = Math.pow(i / 13, 1.45), t1 = Math.pow((i + 1) / 13, 1.45);
      g.fillStyle = i % 2 ? "#33a545" : "#3cb751";
      poly(g, [[pe(t0), yAt(t0)], [W - pe(t0), yAt(t0)], [W - pe(t1), yAt(t1)], [pe(t1), yAt(t1)]]);
      g.fill();
    }
    // behind the goal line the grass is not cut in stripes
    g.fillStyle = "rgba(10,40,20,.16)";
    g.fillRect(0, PT, W, 256 - PT);
    // grass texture
    const r = seeded(77);
    for (let i = 0; i < 2600; i++) {
      const t = Math.pow(r(), 0.8), p = pp(t), y = yAt(t);
      const x = lerp(pe(t) - 10 * p, W - pe(t) + 10 * p, r());
      g.fillStyle = i % 2 ? "rgba(255,255,255,.06)" : "rgba(0,40,10,.1)";
      g.fillRect(x, y, 0.8 * p, 2.2 * p);
    }
    // floodlight pool
    const lp = g.createRadialGradient(480, 330, 20, 480, 330, 520);
    lp.addColorStop(0, "rgba(255,255,225,.14)");
    lp.addColorStop(1, "rgba(255,255,225,0)");
    g.fillStyle = lp;
    g.fillRect(0, PT, W, H - PT);
    // goal shadow on the grass
    g.fillStyle = "rgba(0,20,10,.22)";
    poly(g, [[G.x - 4, 257], [G.x + G.w + 4, 257], [G.x + G.w - 10, G.y + G.h - 10], [G.x + 10, G.y + G.h - 10]]);
    g.fill();
    // markings
    const tl = (y) => pe(cl((y - PT) / (H - PT), 0, 1)) + 6 * pp(cl((y - PT) / (H - PT), 0, 1));
    g.strokeStyle = "rgba(255,255,255,.88)";
    g.lineCap = "round";
    g.lineJoin = "round";
    g.lineWidth = 2.2;
    g.beginPath();
    g.moveTo(tl(256), 256);
    g.lineTo(W - tl(256), 256);
    g.moveTo(395, 256); g.lineTo(375, 292); g.lineTo(585, 292); g.lineTo(565, 256);
    g.stroke();
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(300, 256); g.lineTo(240, 372); g.lineTo(720, 372); g.lineTo(660, 256);
    for (const sd of [0, 1]) {
      for (let y = 256; y <= H + 1; y += 8) {
        const x = sd ? W - tl(y) : tl(y);
        if (y === 256) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
    }
    g.stroke();
    g.lineWidth = 3.4;
    g.beginPath();
    g.ellipse(480, 372, 84, 24, 0, 0.13 * Math.PI, 0.87 * Math.PI);
    g.stroke();
    g.lineCap = "butt";
    g.fillStyle = "#fff";
    g.beginPath();
    g.ellipse(SPOT.x, SPOT.y + 6, 7, 3.2, 0, 0, 6.3);
    g.fill();
  }

  // ---------------- static foreground of the stands: boards, dugouts, railings, roof, lights
  function paintMid(g) {
    // railings in front of the stands
    g.fillStyle = "rgba(150,200,255,.1)";
    g.fillRect(187, 102, W - 374, 6);
    g.strokeStyle = "rgba(200,220,250,.5)";
    g.lineWidth = 1.2;
    g.beginPath();
    g.moveTo(187, 102);
    g.lineTo(W - 187, 102);
    for (let x = 200; x < W - 187; x += 40) {
      g.moveTo(x, 102);
      g.lineTo(x, 108);
    }
    g.stroke();
    // banners on the far wall
    const bc = [["#f5c242", "#0b1226"], ["#e2401f", "#ffffff"], ["#27c3d1", "#0b1226"]];
    [[262, 60], [452, 56], [650, 60]].forEach(([x, w], i) => {
      g.fillStyle = bc[i][0];
      g.fillRect(x, 108, w, 9);
      g.fillStyle = bc[i][1];
      for (let k = 0; k < w; k += 10) g.fillRect(x + k, 108, 5, 9);
      g.strokeStyle = OL;
      g.lineWidth = 0.8;
      g.strokeRect && g.strokeRect(x, 108, w, 9);
    });
    for (const right of [false, true]) {
      g.strokeStyle = "rgba(200,220,250,.45)";
      g.lineWidth = 1.2;
      g.beginPath();
      for (let t = 0; t <= 1.0001; t += 0.05) {
        const [x, y] = sideXY(t, 22, 22, right);
        if (t === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      for (let t = 0; t <= 1.0001; t += 0.05) {
        const a = sideXY(t, 22, 22, right), b = sideXY(t, 22, 14, right);
        g.moveTo(a[0], a[1]);
        g.lineTo(b[0], b[1]);
      }
      g.stroke();
    }
    // far ad boards
    const ads = [["FREE LIFE", "#27c3d1", "#0b1226"], ["PLAY FAIR", "#0b1226", "#f5c242"], ["GOAL TV", "#e2401f", "#fff"], ["SPORT 24", "#0b1226", "#36b34a"], ["ENERGY+", "#f5c242", "#0b1226"]];
    const bx0 = sideXY(0, 12, 0, false)[0], bw = (W - 2 * bx0) / 5;
    g.textAlign = "center";
    g.font = "900 9px system-ui,sans-serif";
    ads.forEach(([txt, bgc, fg], i) => {
      g.fillStyle = bgc;
      g.fillRect(bx0 + i * bw, 117, bw - 1, 11);
      g.fillStyle = fg;
      g.fillText(txt, bx0 + i * bw + bw / 2, 126);
    });
    g.fillStyle = "rgba(255,255,255,.25)";
    g.fillRect(bx0, 117, W - 2 * bx0, 1);
    // side ad boards
    const sc = ["#27c3d1", "#0b1226", "#f5c242", "#e2401f", "#0b1226", "#36b34a", "#fa6f00"];
    for (const right of [false, true]) {
      let n = right ? 3 : 0;
      for (let t = 0; t < 1; t += 0.085) {
        const t1 = Math.min(1.02, t + 0.085);
        const a = sideXY(t, 12, 0, right), b = sideXY(t1, 12, 0, right), c = sideXY(t1, 12, 14, right), d = sideXY(t, 12, 14, right);
        g.fillStyle = sc[n++ % sc.length];
        poly(g, [a, b, c, d]);
        g.fill();
        g.strokeStyle = "rgba(0,0,0,.45)";
        g.lineWidth = 1;
        g.stroke();
        // a simple light swoosh as a "logo"
        const m0 = sideXY(t + 0.02, 12, 4, right), m1 = sideXY(t1 - 0.02, 12, 9, right);
        g.strokeStyle = "rgba(255,255,255,.55)";
        g.lineWidth = 1.2 * pp(t);
        g.beginPath();
        g.moveTo(m0[0], m0[1]);
        g.lineTo(m1[0], m1[1]);
        g.stroke();
      }
    }
    // dugouts
    for (const right of [false, true]) {
      const t0 = 0.3, t1 = 0.46, at = (t, o, l) => sideXY(t, o, l, right);
      g.fillStyle = "#222b40";
      poly(g, [at(t0, 14, 0), at(t1, 14, 0), at(t1, 14, 24), at(t0, 14, 24)]);
      g.fill();
      g.strokeStyle = OL;
      g.lineWidth = 1.2;
      g.stroke();
      g.fillStyle = "#e2401f";
      poly(g, [at(t0 + 0.01, 13, 5), at(t1 - 0.01, 13, 5), at(t1 - 0.01, 13, 9), at(t0 + 0.01, 13, 9)]);
      g.fill();
      for (let i = 0; i < 5; i++) {
        const tt = lerp(t0 + 0.025, t1 - 0.025, i / 4), p = pp(tt);
        const [x, y] = at(tt, 10, 8);
        const f = { skin: SKIN[(i * 3 + (right ? 1 : 0)) % SKIN.length], hair: HAIR[i % 4], c1: right ? "#3a4560" : "#5a6a90", c2: "#fff", kind: 0, cap: false, bald: false, r1: 1, r2: 1, r3: 0 };
        drawFan(g, x, y, 0.85 * p, f, false);
      }
      // curved plexi roof
      g.fillStyle = "rgba(39,195,209,.28)";
      poly(g, [at(t0, 15, 24), at(t1, 15, 24), at(t1, 2, 19), at(t0, 2, 19)]);
      g.fill();
      g.strokeStyle = "rgba(190,240,250,.7)";
      g.stroke();
      g.strokeStyle = OL;
      g.lineWidth = 1.4;
      g.beginPath();
      for (const tt of [t0, t1]) {
        const a = at(tt, 2, 19), b = at(tt, 2, 0);
        g.moveTo(a[0], a[1]);
        g.lineTo(b[0], b[1]);
      }
      g.stroke();
    }
    // corner flags
    for (const sd of [-1, 1]) {
      const x = 480 + sd * (480 - pe((256 - PT) / (H - PT)) - 6 * pp((256 - PT) / (H - PT)));
      limb(g, [x, 256, x, 240], 1.2, "#f4f6f8", 1);
      g.fillStyle = "#f5c242";
      poly(g, [[x, 240], [x + sd * 8, 243], [x, 246]]);
      g.fill();
    }
    // roof and its visor
    g.fillStyle = "#070c1a";
    g.fillRect(0, 0, W, 15);
    g.fillStyle = "#16223d";
    g.fillRect(0, 13, W, 6);
    g.fillStyle = "#2b3a5c";
    g.fillRect(0, 19, W, 1.5);
    g.strokeStyle = "rgba(60,80,120,.5)";
    g.lineWidth = 1;
    g.beginPath();
    for (let x = 0; x < W; x += 30) {
      g.moveTo(x, 0);
      g.lineTo(x + 15, 13);
      g.lineTo(x + 30, 0);
    }
    g.stroke();
    // lamps under the visor and corner light banks
    g.globalCompositeOperation = "lighter";
    const halo = (x, y, r, a) => {
      const h = g.createRadialGradient(x, y, 0, x, y, r);
      h.addColorStop(0, `rgba(255,248,215,${a})`);
      h.addColorStop(1, "rgba(255,248,215,0)");
      g.fillStyle = h;
      g.fillRect(x - r, y - r, 2 * r, 2 * r);
    };
    for (let x = 24; x < W; x += 48) halo(x, 18, 22, 0.28);
    halo(58, 30, 170, 0.32);
    halo(W - 58, 30, 170, 0.32);
    g.globalCompositeOperation = "source-over";
    for (let x = 24; x < W; x += 48) {
      g.fillStyle = "#fff6d6";
      g.fillRect(x - 4, 16.5, 8, 2.5);
    }
    for (const x0 of [22, W - 94]) {
      rr(g, x0, 18, 72, 26, 4);
      g.fillStyle = "#1a2440";
      g.fill();
      g.strokeStyle = OL;
      g.lineWidth = 1.5;
      g.stroke();
      for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) disc(g, x0 + 11 + i * 16.5, 25 + j * 11, 4.4, "#fffbe8", 0.8);
    }
    // vignette
    const v = g.createRadialGradient(480, 330, 260, 480, 330, 640);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,4,14,.55)");
    g.fillStyle = v;
    g.fillRect(0, 0, W, H);
  }

  // offscreen layers, rebuilt when the canvas size or the kits change
  let LY = null;
  function layers() {
    const key = `${cv.width}x${cv.height}|${S.kit}|${S.kit2}`;
    if (LY && LY.key === key) return LY;
    const k = Math.max(1, cv.width) / W;
    const mk = () => {
      const c = document.createElement("canvas");
      c.width = Math.max(1, cv.width);
      c.height = Math.max(1, cv.height);
      const g = c.getContext("2d");
      g.setTransform(k, 0, 0, k, 0, 0);
      return { c, g };
    };
    const fans = genCrowd(S.kit ?? 210, S.kit2 ?? 350);
    const bg = mk(), a = mk(), b = mk(), mid = mk();
    paintBg(bg.g);
    paintCrowd(a.g, fans, false);
    paintCrowd(b.g, fans, true);
    paintMid(mid.g);
    LY = { key, k, bg: bg.c, a: a.c, b: b.c, mid: mid.c };
    return LY;
  }

  // the crowd moves in horizontal bands over the static stands
  function drawCrowd(L) {
    const t = S.clock || 0;
    const cheer = S.cheer ? Math.max(0.25, 1 - (S.cheerT || 0) / 3) : 0;
    const sad = S.phase === "result" && S.outcome && !S.cheer && S.outcome.result !== "goal" ? cl(S.t * 3, 0, 1) : 0;
    const img = cheer ? (Math.floor(t * 6) % 2 ? L.b : L.a) : L.a;
    const BH = 20, k = L.k;
    if (sad) cx.globalAlpha = 1 - 0.22 * sad;
    for (let y = 0; y < H; y += BH) {
      const h = Math.min(BH + 1, H - y);
      let dy = Math.sin(t * 2.2 + y * 0.03) * 0.7;
      if (cheer) dy = -Math.abs(Math.sin(t * 9 + y * 0.02)) * (2 + 6 * cheer) * (0.5 + y / H);
      dy += sad * (1.5 + 3 * (y / H));
      cx.drawImage(img, 0, y * k, img.width, h * k, 0, y + dy, W, h);
    }
    cx.globalAlpha = 1;
  }

  // confetti and flares when you score
  const conf = [];
  let fxClock = 0;
  function drawFx() {
    const t = S.clock || 0, dt = cl(t - fxClock, 0, 0.05);
    fxClock = t;
    if (!S.cheer) {
      S._fx = false;
      conf.length = 0;
      return;
    }
    if (!S._fx) {
      S._fx = true;
      conf.length = 0;
      const cols = ["#27c3d1", "#36b34a", "#f5c242", "#fa6f00", "#e2401f", "#ffffff", hsl(S.kit ?? 210, 75, 55)];
      for (let i = 0; i < 150; i++) conf.push({ x: rnd() * W, y: -rnd() * 140 - 6, vx: (rnd() - 0.5) * 50, vy: 80 + rnd() * 120, r: rnd() * 6, vr: (rnd() - 0.5) * 12, c: cols[i % cols.length], w: 4 + rnd() * 4 });
    }
    const fade = Math.max(0, 1 - (S.cheerT || 0) / 3);
    // flares in the stands
    for (const [fx, fy] of [[90, 300], [870, 320], [250, 62], [710, 66]]) {
      const fl = 0.75 + 0.25 * Math.sin(t * 31 + fx);
      const r = (fy < 100 ? 26 : 46) * fl;
      const gr = cx.createRadialGradient(fx, fy, 0, fx, fy, r);
      gr.addColorStop(0, `rgba(255,240,200,${0.95 * fade})`);
      gr.addColorStop(0.25, `rgba(255,90,40,${0.75 * fade})`);
      gr.addColorStop(1, "rgba(226,64,31,0)");
      cx.fillStyle = gr;
      cx.fillRect(fx - r, fy - r, 2 * r, 2 * r);
    }
    for (const c of conf) {
      c.x += c.vx * dt + Math.sin(t * 3 + c.r) * 0.5;
      c.y += c.vy * dt;
      c.r += c.vr * dt;
      if (c.y > H + 10) continue;
      cx.fillStyle = c.c;
      cx.fillRect(c.x, c.y, c.w * Math.abs(Math.cos(c.r)) + 0.6, c.w * 0.55);
    }
  }

  function drawGoal(frontOnly) {
    const { x, y, w, h } = G;
    const dep = 14; // how far the net's back frame sits in from the posts
    if (!frontOnly) {
      // inside of the goal, side nets and roof net
      cx.fillStyle = "rgba(6,14,22,.42)";
      cx.fillRect(x, y, w, h);
      cx.fillStyle = "rgba(220,235,245,.07)";
      poly(cx, [[x, y], [x + dep, y - 12], [x + dep, y + h - 14], [x, y + h]]);
      cx.fill();
      poly(cx, [[x + w, y], [x + w - dep, y - 12], [x + w - dep, y + h - 14], [x + w, y + h]]);
      cx.fill();
      poly(cx, [[x, y], [x + dep, y - 12], [x + w - dep, y - 12], [x + w, y]]);
      cx.fill();
      cx.strokeStyle = "rgba(255,255,255,.28)";
      cx.lineWidth = 1;
      cx.beginPath();
      for (let i = 0; i <= 6; i++) {
        const q = i / 6;
        cx.moveTo(x, y + h * q);
        cx.lineTo(x + dep, lerp(y - 12, y + h - 14, q));
        cx.moveTo(x + w, y + h * q);
        cx.lineTo(x + w - dep, lerp(y - 12, y + h - 14, q));
      }
      for (let i = 0; i <= 20; i++) {
        const q = i / 20;
        cx.moveTo(x + w * q, y);
        cx.lineTo(lerp(x + dep, x + w - dep, q), y - 12);
      }
      cx.moveTo(x + dep, y - 12);
      cx.lineTo(x + w - dep, y - 12);
      cx.stroke();
      // back net (this one ripples)
      cx.strokeStyle = "rgba(255,255,255,.42)";
      const rp = S && S.ripple;
      const amp = rp ? 14 * Math.exp(-rp.t * 2.6) * Math.cos(rp.t * 22) : 0;
      const dx = (px, py) => (rp ? amp * Math.exp(-(((px - rp.x) ** 2 + (py - rp.y) ** 2) / 4000)) : 0);
      for (let i = 0; i <= 28; i++) {
        cx.beginPath();
        for (let j = 0; j <= 10; j++) {
          const px = x + (w * i) / 28, py = y + (h * j) / 10;
          if (j === 0) cx.moveTo(px, py + dx(px, py));
          else cx.lineTo(px, py + dx(px, py));
        }
        cx.stroke();
      }
      for (let j = 0; j <= 10; j++) {
        cx.beginPath();
        for (let i = 0; i <= 28; i++) {
          const px = x + (w * i) / 28, py = y + (h * j) / 10;
          if (i === 0) cx.moveTo(px, py + dx(px, py));
          else cx.lineTo(px, py + dx(px, py));
        }
        cx.stroke();
      }
      // back stanchions
      limb(cx, [x + dep, y + h - 14, x + dep, y - 12, x + w - dep, y - 12, x + w - dep, y + h - 14], 2, "#c9d2dc", 1.2);
      return;
    }
    // posts and bar in front of the keeper
    limb(cx, [x, y + h + 2, x, y, x + w, y, x + w, y + h + 2], 7, "#f4f6f8", 3);
    cx.strokeStyle = "#c3ccd6";
    cx.lineWidth = 2;
    cx.beginPath();
    cx.moveTo(x + 2.2, y + h + 1);
    cx.lineTo(x + 2.2, y + 2.2);
    cx.lineTo(x + w - 2.2, y + 2.2);
    cx.moveTo(x + w + 2.2, y + 3);
    cx.lineTo(x + w + 2.2, y + h + 1);
    cx.stroke();
  }

  function drawKeeper() {
    const k2 = S.kit2 ?? 95;
    const clk = S.clock || 0;
    let x = KEEPER_BASE.x + Math.sin(clk * 1.6) * 4, y = KEEPER_BASE.y, rot = 0, air = 0;
    let crouch = 3 + Math.sin(clk * 3) * 1.5;
    if (S.phase !== "aim" && S.phase !== "opp" && S.outcome) {
      const K = S.outcome.K;
      // dive begins as the ball is kicked and lasts ~0.45s
      let p;
      if (S.phase === "run") p = 0;
      else if (S.phase === "fly") p = cl(S.t / (FLY * 0.85), 0, 1);
      else p = 1;
      p = ease(p);
      x = lerp(KEEPER_BASE.x, K.x, p);
      y = lerp(KEEPER_BASE.y, K.y, p) - Math.sin(p * Math.PI) * 14;
      rot = cl((K.x - KEEPER_BASE.x) / 120, -1, 1) * 1.15 * p;
      air = p;
      crouch = S.phase === "run" ? 5 : lerp(5, 0, p);
      if (S.phase === "result") {
        // and down he goes
        const q = ease(cl(S.t / 0.45, 0, 1));
        const dir = K.x < KEEPER_BASE.x - 25 ? -1 : K.x > KEEPER_BASE.x + 25 ? 1 : 0;
        if (dir) {
          y = lerp(y, 244, q);
          rot = lerp(rot, dir * 1.45, q);
        } else {
          y = lerp(y, KEEPER_BASE.y, q);
          air = 1 - q * 0.7;
          crouch = 4 * q;
        }
      }
    }
    // shadow on the grass
    const lift = cl((260 - (y + 34)) / 60, 0, 1);
    cx.fillStyle = `rgba(0,20,10,${0.3 - 0.15 * lift})`;
    cx.beginPath();
    cx.ellipse(x, 261, 24 - 8 * lift + Math.abs(rot) * 14, 5, 0, 0, 6.3);
    cx.fill();
    cx.save();
    cx.translate(x, y);
    cx.rotate(rot);
    const c = crouch, a = air;
    const shirt = hsl(k2, 78, 52), shade = hsl(k2, 72, 38), shorts = hsl(k2, 40, 18), skin = SKIN[(hash(S.name) >> 4) % 4 + 1];
    // legs
    for (const sd of [-1, 1]) {
      const kx = sd * lerp(11 + c * 0.6, 7, a), ky = lerp(19 + c * 0.3, 20, a), ax = sd * lerp(11, 6 + (sd > 0 ? 5 : 0), a), ay = lerp(33, 35, a) - (sd > 0 ? 6 * a : 0);
      limb(cx, [sd * 6, 6 + c, kx, ky, ax, ay], 7.5, skin, 2.4);
      limb(cx, [lerp(kx, ax, 0.25), lerp(ky, ay, 0.25), ax, ay], 7, shirt, 2.4);
      cx.fillStyle = "#fff";
      cx.fillRect(lerp(kx, ax, 0.25) - 3.5, lerp(ky, ay, 0.25) - 1, 7, 2);
      cx.beginPath();
      cx.ellipse(ax + sd * 1.5, ay + 3, 5.5, 3.4, 0, 0, 6.3);
      cx.fillStyle = "#16171d";
      cx.fill();
      cx.strokeStyle = OL;
      cx.lineWidth = 1;
      cx.stroke();
    }
    // shorts
    rr(cx, -13, -1 + c, 26, 15, 4);
    cx.fillStyle = shorts;
    cx.fill();
    cx.strokeStyle = OL;
    cx.lineWidth = 1.4;
    cx.stroke();
    // torso
    const ty = c;
    cx.beginPath();
    cx.moveTo(-11, -30 + ty);
    cx.quadraticCurveTo(-16, -30 + ty, -15, -22 + ty);
    cx.lineTo(-13, 2 + ty);
    cx.lineTo(13, 2 + ty);
    cx.lineTo(15, -22 + ty);
    cx.quadraticCurveTo(16, -30 + ty, 11, -30 + ty);
    cx.closePath();
    cx.fillStyle = shirt;
    cx.fill();
    cx.save();
    cx.clip && cx.clip();
    cx.fillStyle = shade;
    cx.fillRect(6, -32 + ty, 12, 36);
    cx.fillStyle = hsl(k2, 85, 66);
    cx.beginPath();
    cx.moveTo(-15, -18 + ty); cx.lineTo(0, -8 + ty); cx.lineTo(15, -18 + ty); cx.lineTo(15, -13 + ty); cx.lineTo(0, -3 + ty); cx.lineTo(-15, -13 + ty);
    cx.closePath();
    cx.fill();
    cx.restore();
    cx.beginPath();
    cx.moveTo(-11, -30 + ty);
    cx.quadraticCurveTo(-16, -30 + ty, -15, -22 + ty);
    cx.lineTo(-13, 2 + ty);
    cx.lineTo(13, 2 + ty);
    cx.lineTo(15, -22 + ty);
    cx.quadraticCurveTo(16, -30 + ty, 11, -30 + ty);
    cx.closePath();
    cx.strokeStyle = OL;
    cx.lineWidth = 1.6;
    cx.stroke();
    cx.fillStyle = shade;
    cx.fillRect(-5, -31 + ty, 10, 3);
    // head
    const hy = -40 + ty;
    limb(cx, [0, -31 + ty, 0, hy + 4], 6, skin, 2);
    disc(cx, 0, hy, 9, skin, 1.6);
    cx.fillStyle = "#1d1713";
    cx.beginPath();
    cx.arc(0, hy - 1, 9.4, Math.PI * 1.02, Math.PI * 1.98);
    cx.quadraticCurveTo(4, hy - 6, 0, hy - 5);
    cx.quadraticCurveTo(-5, hy - 6, -9.3, hy - 2);
    cx.closePath();
    cx.fill();
    cx.fillStyle = "#1a1410";
    cx.fillRect(-4.5, hy + 0.2, 2.2, 2.6);
    cx.fillRect(2.3, hy + 0.2, 2.2, 2.6);
    cx.fillStyle = "rgba(0,0,0,.35)";
    cx.fillRect(-2.5, hy + 5, 5, 1.2);
    // arms and gloves: ready low and wide, stretched over the head in the dive
    for (const sd of [-1, 1]) {
      const sx = sd * 13, sy = -26 + ty;
      const gx = sd * lerp(27, 9, a), gy = lerp(-4 + ty, -66, a);
      const ex = sd * lerp(23, 14, a), ey = lerp(-17 + ty, -46, a);
      limb(cx, [sx, sy, ex, ey, gx, gy], 6.5, shirt, 2.4);
      cx.save();
      cx.translate(gx, gy);
      cx.rotate(Math.atan2(gy - ey, gx - ex) - Math.PI / 2);
      rr(cx, -5.5, -1, 11, 11, 4);
      cx.fillStyle = "#d4f53c";
      cx.fill();
      cx.strokeStyle = OL;
      cx.lineWidth = 1.3;
      cx.stroke();
      cx.fillStyle = "#6f9a10";
      cx.fillRect(-5.5, -1, 11, 3);
      cx.restore();
    }
    cx.restore();
  }

  function drawShooter() {
    const hs = hash(S.name || "x");
    const skin = SKIN[hs % SKIN.length], hair = HAIR[(hs >> 3) % HAIR.length], style = (hs >> 7) % 3;
    const hue = S.kit ?? 210;
    let x = 408, y = 584, sc = 1.72, lean = 0, st = 0, kick = 0, follow = 0, pose = null;
    if (S.phase === "run") {
      const p = cl(S.t / RUN, 0, 1), e = lerp(p, ease(p), 0.5);
      x = lerp(408, 444, e);
      y = lerp(584, 528, e);
      sc = lerp(1.72, 1.52, e);
      st = p < 0.7 ? Math.sin(p * Math.PI * 4.3) : 0;
      kick = p > 0.66 ? (p - 0.66) / 0.34 : 0;
      lean = 0.04 * e;
    } else if (S.phase === "fly" || S.phase === "result") {
      x = 444;
      y = 528;
      sc = 1.52;
      lean = 0.06;
      follow = S.phase === "fly" ? ease(cl(S.t / 0.22, 0, 1)) : Math.max(0, 1 - S.t * 3);
      if (S.phase === "result" && S.t > 0.25 && S.outcome) pose = S.outcome.result === "goal" ? "up" : "head";
    }
    const bob = -Math.abs(st) * 3;
    // shadow
    cx.fillStyle = "rgba(0,20,10,.3)";
    cx.beginPath();
    cx.ellipse(x, y + 1, 26 * sc, 6 * sc, 0, 0, 6.3);
    cx.fill();
    cx.save();
    cx.translate(x, y);
    cx.scale(sc, sc);
    cx.rotate(lean);
    cx.translate(0, bob);
    const shirt = hsl(hue, 72, 48), shade = hsl(hue, 70, 36), shortC = hsl(hue, 35, 16);
    // legs: lift raises the heel (we see the sole), follow swings the kicking leg through
    const leg = (sd, L, F) => {
      const hx = sd * 6.5, hy = -44;
      let kx = sd * 7, ky = -23 + 2 * L, ax = sd * 7, ay = -5 - 15 * L;
      kx = lerp(kx, 9, F);
      ky = lerp(ky, -36, F);
      ax = lerp(ax, 17, F);
      ay = lerp(ay, -42, F);
      limb(cx, [hx, hy, kx, ky, ax, ay], 7.6, skin, 1.8);
      const s0x = lerp(kx, ax, 0.28), s0y = lerp(ky, ay, 0.28);
      limb(cx, [s0x, s0y, ax, ay], 7, shirt, 1.8);
      limb(cx, [s0x, s0y, lerp(kx, ax, 0.38), lerp(ky, ay, 0.38)], 7, "#f4f5f8", 0);
      // boot
      cx.beginPath();
      cx.ellipse(ax, ay + 3 - L * 1.5, 4.6, 3.4 + L * 1.2, 0, 0, 6.3);
      cx.fillStyle = L > 0.35 || F > 0.3 ? "#3a3d48" : "#15161c";
      cx.fill();
      cx.strokeStyle = OL;
      cx.lineWidth = 0.9;
      cx.stroke();
      cx.fillStyle = L > 0.35 ? "#d8dbe2" : "#f5c242";
      if (L > 0.35) for (const [dx, dy] of [[-2, 1], [2, 1], [-1.5, 5], [1.5, 5]]) cx.fillRect(ax + dx - 0.6, ay + dy - 0.6 - L * 1.5, 1.2, 1.2);
      else cx.fillRect(ax - 3, ay + 1, 6, 1.3);
    };
    leg(-1, Math.max(0, st), 0);
    leg(1, Math.max(Math.max(0, -st), kick * (1 - follow)), follow);
    // arms
    const arm = (sd) => {
      const sx = sd * 15.5, sy = -71;
      let hx = sd * 19, hy = -44 + sd * st * 6;
      if (kick || follow) {
        const kk = Math.max(kick, follow);
        hx = lerp(hx, sd < 0 ? -33 : 24, kk);
        hy = lerp(hy, sd < 0 ? -62 : -50, kk);
      }
      if (pose === "up") {
        hx = sd * 24;
        hy = -106;
      } else if (pose === "head") {
        hx = sd * 7;
        hy = -96;
      }
      const ex = (sx + hx) / 2 + sd * (pose === "head" ? 12 : 4), ey = (sy + hy) / 2;
      limb(cx, [sx, sy, ex, ey, hx, hy], 6, skin, 1.8);
      disc(cx, hx, hy, 3.4, skin, 0.9);
    };
    if (pose !== "head") {
      arm(-1);
      arm(1);
    }
    // shorts
    cx.beginPath();
    cx.moveTo(-14.5, -48);
    cx.lineTo(14.5, -48);
    cx.lineTo(15.5, -33);
    cx.lineTo(1.5, -33);
    cx.lineTo(0, -37);
    cx.lineTo(-1.5, -33);
    cx.lineTo(-15.5, -33);
    cx.closePath();
    cx.fillStyle = shortC;
    cx.fill();
    cx.strokeStyle = OL;
    cx.lineWidth = 1;
    cx.stroke();
    cx.fillStyle = shirt;
    cx.fillRect(-15, -46, 2, 12);
    cx.fillRect(13, -46, 2, 12);
    // jersey from behind, with short sleeves
    const torso = () => {
      cx.beginPath();
      cx.moveTo(-6, -79);
      cx.quadraticCurveTo(-15, -79, -18, -74);
      cx.lineTo(-22, -63);
      cx.lineTo(-16, -60);
      cx.lineTo(-14.5, -45);
      cx.lineTo(14.5, -45);
      cx.lineTo(16, -60);
      cx.lineTo(22, -63);
      cx.lineTo(18, -74);
      cx.quadraticCurveTo(15, -79, 6, -79);
      cx.closePath();
    };
    torso();
    cx.fillStyle = shirt;
    cx.fill();
    cx.save();
    torso();
    cx.clip && cx.clip();
    cx.fillStyle = shade;
    cx.fillRect(9, -80, 14, 36);
    cx.fillRect(-23, -66, 8, 8);
    cx.fillStyle = "rgba(255,255,255,.12)";
    cx.fillRect(-14, -78, 4, 33);
    cx.restore();
    torso();
    cx.strokeStyle = OL;
    cx.lineWidth = 1.1;
    cx.stroke();
    cx.fillStyle = shade;
    cx.beginPath();
    cx.ellipse(0, -79, 6.5, 2.2, 0, 0, Math.PI);
    cx.fill();
    // name and number
    const nm = String(S.name || "PLAYER").toUpperCase().slice(0, 12);
    cx.textAlign = "center";
    cx.fillStyle = "rgba(255,255,255,.95)";
    cx.font = `800 ${Math.min(6, 44 / Math.max(1, nm.length)).toFixed(2)}px system-ui,sans-serif`;
    cx.fillText(nm, 0, -67);
    cx.font = "900 18px system-ui,sans-serif";
    cx.lineWidth = 1.6;
    cx.strokeStyle = shade;
    cx.strokeText(String(S.number ?? 10), 0, -49);
    cx.fillText(String(S.number ?? 10), 0, -49);
    // neck and head from behind
    limb(cx, [0, -80, 0, -84], 7, skin, 1.4);
    for (const sd of [-1, 1]) {
      cx.beginPath();
      cx.ellipse(sd * 9.2, -88, 2.2, 3.2, 0, 0, 6.3);
      cx.fillStyle = skin;
      cx.fill();
      cx.strokeStyle = OL;
      cx.lineWidth = 0.9;
      cx.stroke();
    }
    disc(cx, 0, -89, 9.5, skin, 1.1);
    cx.fillStyle = hair;
    cx.strokeStyle = OL;
    cx.lineWidth = 1.1;
    cx.beginPath();
    if (style === 2) cx.arc(0, -91, 12, Math.PI * 0.82, Math.PI * 2.18);
    else cx.arc(0, -89.6, style === 1 ? 9.7 : 10, Math.PI * (style === 1 ? 0.9 : 0.85), Math.PI * (style === 1 ? 2.1 : 2.15));
    cx.closePath();
    cx.fill();
    cx.stroke();
    cx.fillStyle = "rgba(255,255,255,.14)";
    cx.beginPath();
    cx.ellipse(-3.5, -95, 3.5, 2, -0.5, 0, 6.3);
    cx.fill();
    if (pose === "head") {
      arm(-1);
      arm(1);
    }
    cx.restore();
  }

  function drawBall() {
    let x = SPOT.x, y = SPOT.y, s = 1, rot = 0;
    if (S.phase === "fly" || S.phase === "result") {
      const o = S.outcome;
      const p = S.phase === "fly" ? cl(S.t / FLY, 0, 1) : 1;
      const e = ease(p);
      let tx = S.target.x, ty = S.target.y;
      if (S.phase === "result") {
        // after reaching the goal: saved balls drop and roll, posts bounce back, goals sit in the net
        const q = cl(S.t / 0.5, 0, 1);
        if (o.result === "saved") {
          tx = S.target.x + (o.K.x < S.target.x ? 1 : -1) * 20 * q;
          ty = S.target.y + 36 * q * q;
        } else if (o.result === "post") {
          tx = S.target.x + (S.target.x < 480 ? -1 : 1) * 40 * q;
          ty = S.target.y + 10 * q + 12 * q * q;
        } else if (o.result === "goal") ty = Math.min(G.y + G.h, S.target.y + 22 * q * q);
      }
      x = lerp(SPOT.x, tx, e);
      y = lerp(SPOT.y, ty, e) - Math.sin(p * Math.PI) * 38 * (S.phase === "fly" ? 1 : 0);
      s = lerp(1, o.result === "over" || o.result === "wide" ? 0.3 : 0.4, e);
      rot = S.clock * 14;
    }
    const r = 15 * s;
    // shadow on pitch (only before it leaves the ground line)
    cx.fillStyle = "rgba(0,20,10,.3)";
    cx.beginPath();
    cx.ellipse(lerp(SPOT.x, x, 0.9), lerp(SPOT.y + 8, y + r + 6, 0.8), r * 0.9, r * 0.35, 0, 0, 6.3);
    cx.fill();
    cx.save();
    cx.translate(x, y);
    cx.rotate(rot);
    disc(cx, 0, 0, r, "#fafafa", 0);
    cx.fillStyle = "#1a1a1a";
    cx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * 6.283 - 1.57;
      cx.lineTo(Math.cos(a) * r * 0.45, Math.sin(a) * r * 0.45);
    }
    cx.closePath();
    cx.fill();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * 6.283 - 1.57;
      cx.beginPath();
      cx.arc(Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8, r * 0.18, 0, 6.3);
      cx.fill();
    }
    cx.restore();
    // shading stays put while the ball spins
    cx.fillStyle = "rgba(20,30,50,.18)";
    cx.beginPath();
    cx.arc(x, y, r, -0.6, 2.2);
    cx.quadraticCurveTo(x + r * 0.2, y + r * 0.2, x + Math.cos(-0.6) * r, y + Math.sin(-0.6) * r);
    cx.fill();
    cx.strokeStyle = OL;
    cx.lineWidth = Math.max(0.8, 1.4 * s);
    cx.beginPath();
    cx.arc(x, y, r, 0, 6.3);
    cx.stroke();
  }

  function drawHud() {
    cx.textAlign = "center";
    const tb = cx.createLinearGradient(0, 0, 0, 56);
    tb.addColorStop(0, "rgba(11,18,38,.92)");
    tb.addColorStop(1, "rgba(30,31,34,.82)");
    cx.fillStyle = tb;
    cx.fillRect(0, 0, W, 54);
    cx.fillStyle = "#27c3d1";
    cx.fillRect(0, 54, W, 2);
    cx.fillStyle = "#fff";
    cx.font = "900 22px system-ui,sans-serif";
    cx.fillText(S.title || tr("Penalty kick"), W / 2, 25);
    cx.font = "700 14px system-ui,sans-serif";
    cx.fillStyle = "#9fe8ef";
    cx.fillText(S.subtitle || "", W / 2, 45);
    if (S.board) drawBoard();
    if (S.phase === "aim") {
      rr(cx, W / 2 - 165, 64, 330, 32, 16);
      cx.fillStyle = "rgba(11,18,38,.78)";
      cx.fill();
      cx.strokeStyle = "rgba(245,194,66,.85)";
      cx.lineWidth = 2;
      cx.stroke();
      cx.fillStyle = "#fff";
      cx.font = "800 16px system-ui,sans-serif";
      cx.fillText(tr("Click where you want to shoot"), W / 2, 86);
      // aim reticle and the area your shot may stray into
      const m = S.mouse;
      if (m) {
        const r = noiseFor(S) * 1.9;
        cx.strokeStyle = "rgba(0,0,0,.45)";
        cx.lineWidth = 4;
        cx.beginPath();
        cx.arc(m.x, m.y, 9, 0, 6.3);
        cx.stroke();
        cx.strokeStyle = "rgba(255,255,255,.95)";
        cx.lineWidth = 2;
        cx.beginPath();
        cx.arc(m.x, m.y, 9, 0, 6.3);
        cx.moveTo(m.x - 16, m.y); cx.lineTo(m.x + 16, m.y);
        cx.moveTo(m.x, m.y - 16); cx.lineTo(m.x, m.y + 16);
        cx.stroke();
        cx.strokeStyle = "rgba(245,194,66,.8)";
        cx.setLineDash([5, 5]);
        cx.beginPath();
        cx.arc(m.x, m.y, r, 0, 6.3);
        cx.stroke();
        cx.setLineDash([]);
      }
    }
    if (S.banner && (S.phase === "result" || S.phase === "opp")) {
      const a = cl(S.t * 5, 0, 1);
      cx.save();
      cx.translate(W / 2, 330);
      cx.scale(0.8 + 0.2 * a + (S.phase === "result" ? Math.sin(S.t * 8) * 0.01 : 0), 0.8 + 0.2 * a);
      cx.globalAlpha = a;
      cx.font = "900 84px system-ui,sans-serif";
      cx.lineJoin = "round";
      cx.lineWidth = 12;
      cx.strokeStyle = "rgba(11,18,38,.85)";
      cx.strokeText(S.banner, 0, 0);
      cx.fillStyle = S.bannerCol || "#fff";
      cx.fillText(S.banner, 0, 0);
      if (S.bannerSub) {
        cx.font = "800 24px system-ui,sans-serif";
        cx.lineWidth = 6;
        cx.strokeText(S.bannerSub, 0, 40);
        cx.fillStyle = "#fff";
        cx.fillText(S.bannerSub, 0, 40);
      }
      cx.restore();
    }
  }
  function drawBoard() {
    const b = S.board;
    const row = (label, arr, y, total) => {
      cx.textAlign = "left";
      cx.font = "800 13px system-ui,sans-serif";
      cx.fillStyle = "#fff";
      cx.fillText(label.slice(0, 14), 18, y + 4);
      for (let i = 0; i < Math.max(total, arr.length); i++) {
        const v = arr[i];
        cx.beginPath();
        cx.arc(130 + i * 22, y, 8, 0, 6.3);
        cx.fillStyle = v === true ? "#36b34a" : v === false ? "#e2401f" : "rgba(255,255,255,.18)";
        cx.fill();
        cx.strokeStyle = "rgba(0,0,0,.5)";
        cx.lineWidth = 1.5;
        cx.stroke();
      }
    };
    rr(cx, 8, 62, 300, 62, 10);
    cx.fillStyle = "rgba(11,18,38,.78)";
    cx.fill();
    cx.strokeStyle = "rgba(39,195,209,.6)";
    cx.lineWidth = 1.5;
    cx.stroke();
    row(b.myName, b.my, 82, 5);
    row(b.oppName, b.opp, 108, 5);
    cx.textAlign = "center";
  }

  function draw() {
    const L = layers();
    cx.clearRect(0, 0, W, H);
    cx.drawImage(L.bg, 0, 0, W, H);
    drawCrowd(L);
    cx.drawImage(L.mid, 0, 0, W, H);
    drawGoal(false);
    drawKeeper();
    drawGoal(true);
    drawBall();
    drawShooter();
    if (S.cheer) S.cheerT = (S.cheerT || 0) + 0.016;
    drawFx();
    drawHud();
  }

  // ------------------------------------------------------------------ public modes
  const baseState = (o) => ({
    name: o.name || "PLAYER", number: o.number ?? 10, kit: o.kit ?? (hash(o.name || "x") % 360), kit2: ((o.kit ?? 0) + 140) % 360,
    skill: o.skill ?? 65, keeper: o.keeper ?? 0.5, pressure: o.pressure ?? 0, clock: 0, mouse: null,
  });

  function kick(o = {}) {
    const st = baseState(o);
    st.panenka = !!o.panenka;
    st.title = o.title || tr("Penalty kick");
    st.subtitle = o.subtitle || "";
    st.closeLabel = tr("Skip");
    newKick(st);
    st.onKick = null;
    const finish = (r) => {
      const res = { goal: r === "goal", saved: r === "saved", post: r === "post", wide: r === "wide" || r === "over" };
      close();
      o.onDone && o.onDone(res);
    };
    st.onKick = (r) => (st._r = r);
    st.nextFn = () => finish(st._r);
    st.onClose = () => {
      // skipping simulates the kick
      const r = rnd() < 0.55 + (st.skill - st.keeper * 50) / 250 ? "goal" : "saved";
      finish(r);
    };
    open(st);
  }

  function practice(o = {}) {
    const st = baseState(o);
    let i = 0, scored = 0;
    const total = o.total || 5;
    st.title = tr("Penalty practice");
    st.closeLabel = tr("Quit");
    const board = { myName: tr("Score"), my: [], oppName: "", opp: [] };
    const begin = () => {
      newKick(st);
      st.keeper = cl(0.35 + rnd() * 0.4, 0, 1);
      st.subtitle = `${tr("Kick")} ${i + 1}/${total}`;
      st.banner = null;
      st.cheer = 0;
      st.ripple = null;
      board.opp = [];
    };
    st.board = board;
    st.onKick = (r) => {
      if (r === "goal") scored++;
      board.my.push(r === "goal");
    };
    st.nextFn = () => {
      i++;
      if (i >= total) {
        close();
        return o.onDone && o.onDone({ scored, total });
      }
      begin();
    };
    st.onClose = () => {
      close();
      o.onDone && o.onDone({ scored, total, quit: true });
    };
    begin();
    open(st);
  }

  function shootout(o = {}) {
    const st = baseState(o);
    const my = [], opp = [];
    const oppRate = o.oppRate ?? 0.74;
    st.title = tr("Penalty shootout");
    st.closeLabel = tr("Skip (simulate)");
    const board = { myName: o.myTeam || tr("You"), my, oppName: o.oppTeam || tr("Opponent"), opp };
    st.board = board;
    let round = 0;
    const decided = () => {
      const left = (arr) => Math.max(0, 5 - arr.length);
      if (my.length <= 5 || opp.length <= 5) {
        const ms = my.filter(Boolean).length, os = opp.filter(Boolean).length;
        if (ms > os + left(opp)) return "me";
        if (os > ms + left(my)) return "opp";
        if (my.length >= 5 && opp.length >= 5 && ms !== os) return ms > os ? "me" : "opp";
      }
      if (my.length === opp.length && my.length > 5) {
        const ms = my.filter(Boolean).length, os = opp.filter(Boolean).length;
        if (ms !== os) return ms > os ? "me" : "opp";
      }
      return null;
    };
    const end = (w) => {
      const res = { won: w === "me", my: my.filter(Boolean).length, opp: opp.filter(Boolean).length };
      st.banner = res.won ? tr("YOU WIN!") : tr("YOU LOSE");
      st.bannerCol = res.won ? "#5df07e" : "#ff7a6b";
      st.bannerSub = `${res.my} - ${res.opp}`;
      st.phase = "result";
      st.t = 0;
      st.hold = 2.2;
      st.cheer = res.won ? 1 : 0;
      st.cheerT = 0;
      st.nextFn = () => {
        close();
        o.onDone && o.onDone(res);
      };
      st.onKick = null;
    };
    const beginKick = () => {
      newKick(st);
      st.keeper = cl(o.keeper ?? 0.5, 0, 1);
      st.pressure = my.length >= 4 ? 0.7 : 0.25;
      st.subtitle = `${tr("Kick")} ${my.length + 1}${my.length >= 5 ? ` (${tr("sudden death")})` : ""}`;
      st.banner = null;
      st.cheer = 0;
      st.ripple = null;
      st.bannerSub = "";
    };
    st.onKick = (r) => my.push(r === "goal");
    st.nextFn = () => {
      const d = decided();
      if (d) return end(d);
      // opponent's kick
      const ok = rnd() < oppRate;
      opp.push(ok);
      st.banner = ok ? `${board.oppName.slice(0, 12)}: ${tr("scores")}` : `${tr("Saved by your keeper!")}`;
      st.bannerCol = ok ? "#ff9e7a" : "#5df07e";
      st.bannerSub = "";
      st.phase = "opp";
      st.t = 0;
      snd(ok ? "buzzer" : "ding");
      st.afterOpp = () => {
        const d2 = decided();
        if (d2) return end(d2);
        round++;
        beginKick();
      };
    };
    st.onClose = () => {
      // simulate whatever is left
      let guard = 0;
      while (!decided() && guard++ < 40) {
        my.push(rnd() < 0.55 + (st.skill - 50) / 250);
        opp.push(rnd() < oppRate);
      }
      const d = decided() || (rnd() < 0.5 ? "me" : "opp");
      close();
      o.onDone && o.onDone({ won: d === "me", my: my.filter(Boolean).length, opp: opp.filter(Boolean).length });
    };
    beginKick();
    open(st);
  }

  window.FL_PEN = { kick, shootout, practice, G, W, H, _decide: decide };
})();
