/* [mod] Licenses & license tests for NaBlooLife (local mod).
 *
 * License Office: Activities -> Licenses. Seven licenses, each with its own rules:
 *   car (the game's own driving test), motorcycle, commercial (CDL), boat captain,
 *   private pilot, helicopter pilot and a firearm permit.
 * Every new license has a WRITTEN EXAM (random multiple-choice questions, pass mark) and a PRACTICAL TEST
 * (a timing mini-game: stop the marker inside the green zone, a few rounds). Fees, minimum ages,
 * prerequisites, retake fees and a felony background check apply.
 * What they unlock: sport bikes (motorcycle), boats (boat), planes (pilot), helicopters (heli),
 * legal gun purchases (firearm) and bus/truck/taxi driver jobs (CDL).
 *
 * State: state.licenses = { id: { year } }, state.licProg = { id: { written, tries, pracFails } } (JSON only).
 * API: FL_LICENSES.has(id), FL_LICENSES.need(id), FL_LICENSES.open().
 */
(() => {
  "use strict";
  if (window.FL_LICENSES) return;

  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const shuffle = (a) => {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const $ = (id) => document.getElementById(id);
  const ifx = () => (typeof window.inflFx === "function" ? window.inflFx() : 1);
  const money = (n) => (typeof usd === "function" ? usd(Math.round(n)) : "$" + Math.round(n).toLocaleString("en-US"));
  const chev = () => (typeof CHEV !== "undefined" ? CHEV : "");
  const snd = (n) => typeof play === "function" && play(n);
  const sayIt = (s) => typeof say === "function" && say(s);
  const hit = (n) => {
    if (state.stats) state.stats.Happiness = Math.max(0, Math.min(100, (Number(state.stats.Happiness) || 50) + n));
    if (typeof renderStats === "function") renderStats();
  };

  // ------------------------------------------------------------------ definitions
  const LIC = [
    {
      id: "car", name: "Driver's License", icon: "cars/ui-license-car.png", builtin: true,
      uses: "Buy and drive cars.",
    },
    {
      id: "motorcycle", name: "Motorcycle License", icon: "emoji/1f3cd-fe0f.png", age: 16, fee: 150, req: ["car"],
      written: { n: 8, pass: 6 }, uses: "Buy sport bikes.",
      prac: { title: "Emergency braking", text: "Stop the bike inside the green zone. Three runs, two clean stops to pass.", rounds: 3, need: 2, zone: 0.28, speed: 0.9 },
    },
    {
      id: "cdl", name: "Commercial License (CDL)", icon: "emoji/1f69a.png", age: 21, fee: 400, req: ["car"],
      written: { n: 10, pass: 8 }, uses: "Bus, truck, taxi and limo driver jobs.",
      prac: { title: "Reverse parking", text: "Back the rig into the bay: stop the marker in the green zone. Four attempts, three to pass.", rounds: 4, need: 3, zone: 0.22, speed: 1.0 },
    },
    {
      id: "boat", name: "Boat Captain License", icon: "emoji/1f6a4.png", age: 16, fee: 300, req: [],
      written: { n: 8, pass: 6 }, uses: "Buy boats and yachts.",
      prac: { title: "Docking", text: "Slide the boat into the slip without touching the pier. Three tries, two to pass.", rounds: 3, need: 2, zone: 0.26, speed: 0.8 },
    },
    {
      id: "pilot", name: "Private Pilot License", icon: "emoji/2708-fe0f.png", age: 17, fee: 12000, req: [],
      written: { n: 12, pass: 10 }, uses: "Buy airplanes.",
      prac: { title: "Landing", text: "Touch down in the green zone. Five landings, four must be good.", rounds: 5, need: 4, zone: 0.18, speed: 1.1 },
    },
    {
      id: "heli", name: "Helicopter License", icon: "emoji/1f681.png", age: 18, fee: 20000, req: ["pilot"],
      written: { n: 10, pass: 8 }, uses: "Buy helicopters.",
      prac: { title: "Hover & land", text: "Hold the hover and settle on the pad. Five attempts, four must be good.", rounds: 5, need: 4, zone: 0.16, speed: 1.2 },
    },
    {
      id: "firearm", name: "Firearm Permit", icon: "emoji/1f52b.png", age: 21, fee: 350, req: [], felony: true,
      written: { n: 8, pass: 7 }, uses: "Buy guns legally at the gun store.",
      prac: { title: "Range test", text: "Hit the target as it sweeps past. Five shots, four must land.", rounds: 5, need: 4, zone: 0.24, speed: 1.1 },
    },
  ];
  const byId = (id) => LIC.find((l) => l.id === id);

  // [question, correct answer, ...wrong answers]
  const Q = {
    motorcycle: [
      ["Which gear should you wear for the best protection?", "A helmet, gloves, jacket and boots", "A helmet only", "Sunglasses and a t-shirt"],
      ["In the rain, you should...", "Brake earlier and smoother", "Brake harder", "Ride faster to get out of it"],
      ["Which brake gives most of the stopping power?", "The front brake", "The rear brake", "Both are exactly the same"],
      ["How do you take a curve safely?", "Slow down before it, then accelerate through", "Brake hard in the middle of it", "Lean as little as possible and go fast"],
      ["The safest lane position is usually...", "Where drivers can see you in their mirrors", "Right on the white line", "Hiding behind a big truck"],
      ["What is a blind spot?", "An area the driver cannot see in the mirrors", "A broken light", "A tunnel"],
      ["Before every ride you should...", "Check tires, brakes, lights and chain", "Only fill the tank", "Warm the engine for an hour"],
      ["Another driver cuts in front of you. You should...", "Stay calm and increase your distance", "Chase them", "Honk for a full minute"],
      ["When is it safe to ride with no helmet?", "Never", "In your own street", "At low speed"],
      ["Gravel on a corner is dangerous because...", "Tires lose grip", "It makes noise", "It is too bright"],
    ],
    cdl: [
      ["A loaded truck needs a stopping distance that is...", "Much longer than a car's", "The same as a car's", "Shorter than a car's"],
      ["Before a long trip you must...", "Do a pre-trip inspection", "Skip it if you are late", "Only check the radio"],
      ["Driving hours are limited to...", "Prevent fatigue", "Save fuel", "Reduce paperwork"],
      ["What is the 'no zone' around a truck?", "Blind spots where cars cannot be seen", "A parking area", "A speed trap"],
      ["On a long downhill you should...", "Use a lower gear and engine braking", "Ride the brakes the whole way", "Shift to neutral"],
      ["When turning right with a long trailer...", "Swing wide so the trailer clears the corner", "Turn as tight as a car", "Use the left lane"],
      ["Air brakes need to be checked for...", "Pressure and leaks", "Colour", "Noise from the radio"],
      ["Overloading a truck...", "Increases braking distance and is illegal", "Saves trips and is fine", "Only matters on highways"],
      ["Placing warning triangles after a breakdown is meant to...", "Warn other drivers", "Mark your parking spot", "Cool the engine"],
      ["Cargo should be secured because...", "Loose loads shift and cause crashes", "It looks professional", "It lowers fuel use"],
    ],
    boat: [
      ["Two boats meet head-on. Each should...", "Steer to starboard (right)", "Steer to port (left)", "Stop and wait"],
      ["The color of the starboard navigation light is...", "Green", "Red", "White"],
      ["Everyone on board should wear...", "A life jacket", "A rain coat", "Gloves"],
      ["Anchoring in a strong current, you should...", "Let out plenty of rope for the depth", "Use as little rope as possible", "Tie it to the engine"],
      ["Who has the right of way, a sailboat or a motorboat?", "Usually the sailboat", "Always the motorboat", "Whoever is faster"],
      ["Fuel fumes are dangerous because...", "They can explode", "They smell bad", "They corrode the paint"],
      ["A red flag with a white diagonal stripe means...", "A diver is in the water", "A race is starting", "Free fish"],
      ["When approaching a dock you should...", "Go slowly and use fenders", "Hit it at speed", "Cut the engine far away"],
      ["What is your wake?", "The waves your boat leaves behind", "A boat race", "The fog"],
      ["Before you leave the dock you should check...", "The weather and the fuel", "The latest news", "Only the radio"],
    ],
    pilot: [
      ["What generates lift?", "Air flowing over the wings", "The engine alone", "The tail"],
      ["The three axes of an aircraft are...", "Pitch, roll and yaw", "Up, down and sideways", "Speed, weight and fuel"],
      ["A stall happens when...", "The wing exceeds its critical angle of attack", "The engine stops", "You fly too low"],
      ["What do you do first in an engine failure?", "Fly the airplane: set best glide speed", "Call your family", "Climb at full power"],
      ["Which has the right of way in flight?", "The aircraft with less maneuverability", "The faster aircraft", "The larger aircraft always"],
      ["The runway number 27 means a heading of about...", "270 degrees", "27 degrees", "2.7 degrees"],
      ["Cold dense air makes an airplane...", "Perform better", "Perform worse", "Fly slower in all cases"],
      ["Carburetor ice is more likely when...", "It is humid and cool", "It is dry and hot", "It is very windy"],
      ["Before takeoff you must always...", "Do a pre-flight inspection and checklist", "Warm up for an hour", "Skip the checklist"],
      ["What does ATC stand for?", "Air traffic control", "Automatic turn compass", "Airport tax collector"],
      ["Which instrument shows height above sea level?", "The altimeter", "The airspeed indicator", "The compass"],
      ["If lost, the first thing to do is...", "Stay calm, climb and ask for help on the radio", "Turn off the radio", "Fly in circles quietly"],
    ],
    heli: [
      ["The main rotor mainly provides...", "Lift and thrust", "Only noise", "Only steering"],
      ["The tail rotor is there to...", "Counter torque and steer", "Cool the engine", "Make it quieter"],
      ["What is the collective control?", "It changes the pitch of all blades together", "It turns the tail", "It starts the engine"],
      ["Autorotation is used when...", "The engine fails", "You want to climb faster", "You need to refuel"],
      ["A hover requires...", "Constant small corrections", "No input at all", "Full forward speed"],
      ["Near the ground, in ground effect, the helicopter needs...", "Less power to hover", "More power to hover", "No rotor"],
      ["Dynamic rollover can happen if...", "One skid stays on the ground while you roll", "You land on grass", "You fly too high"],
      ["The best way to approach a landing zone is...", "Into the wind", "With the wind behind", "Straight down from high"],
      ["Wires are dangerous because they are...", "Hard to see", "Always electrified", "Only at night"],
      ["Before starting the rotor you must...", "Check that the area around the rotor is clear", "Wave at the crowd", "Let passengers push it"],
    ],
    firearm: [
      ["The first rule of gun safety is...", "Treat every gun as if it were loaded", "Point it at the target only when angry", "Only load it at home"],
      ["Where should your finger be until you are ready to shoot?", "Outside the trigger guard", "On the trigger", "On the hammer"],
      ["Where do you keep a gun at home?", "Unloaded and locked, away from children", "Under the pillow", "In the kitchen drawer"],
      ["Before cleaning a firearm you must...", "Make sure it is unloaded", "Load it for safety", "Spray it with water"],
      ["You should never point a gun at...", "Anything you don't intend to shoot", "Anything farther than 10 meters", "Anything made of metal"],
      ["Alcohol and shooting...", "Never mix", "Mix well in small amounts", "Help you aim"],
      ["Knowing your target means also knowing...", "What is behind it", "How much it costs", "Who owns it"],
      ["When transporting a gun in a car it should be...", "Unloaded and stored securely", "On the dashboard", "On the passenger seat loaded"],
      ["A permit can be taken away if you...", "Commit a violent crime", "Move to another city", "Go to the gym"],
      ["Eye and ear protection at the range is...", "Mandatory", "Optional for experts", "Only for rifles"],
    ],
  };

  // ------------------------------------------------------------------ state helpers
  const lic = () => (state.licenses && typeof state.licenses === "object" ? state.licenses : (state.licenses = {}));
  const prog = (id) => ((state.licProg ||= {})[id] ||= { written: false, tries: 0, pracFails: 0 });
  const has = (id) => (id === "car" ? !!state.license : !!lic()[id]);
  const fee = (l) => Math.round((l.fee || 0) * ifx());
  const retake = (l) => Math.round(fee(l) * 0.4);
  const pracRetake = (l) => Math.round(fee(l) * 0.2);
  const felony = () => !!state.felony;
  const ageOf = (l) => (l.id === "car" && typeof driveAge === "function" ? driveAge() : l.age || 16);

  function blocker(l) {
    if (typeof isOldEra === "function" && isOldEra()) return "Licenses did not exist back then.";
    if (state.prison) return "You can't take a license test from prison.";
    if (state.age < ageOf(l)) return `You must be at least ${ageOf(l)} years old.`;
    for (const r of l.req || []) if (!has(r)) return `You need the ${byId(r).name} first.`;
    if (l.felony && felony()) return "A felony conviction blocks this permit.";
    return null;
  }

  // ------------------------------------------------------------------ styles
  const st = document.createElement("style");
  st.id = "flLicenseCss";
  st.textContent = `
  .lc-txt{color:#3d1515;text-align:center;font-size:15px;line-height:1.35;margin:8px 0}
  .phone.dark .lc-txt{color:#f1f2f4}
  .lc-bar{position:relative;height:52px;border-radius:12px;background:#3a3f48;margin:12px 0;overflow:hidden;border:3px solid #3a3f48}
  .lc-bar.ok{border-color:#2ecc71}.lc-bar.bad{border-color:#d4141c}
  .lc-zone{position:absolute;top:0;bottom:0;background:#2ecc71;opacity:.9}
  .lc-mark{position:absolute;top:0;bottom:0;width:8px;margin-left:-4px;background:#ffd23f;box-shadow:0 0 10px #ffd23f}
  .lc-modal .jm-apply.ev-btn{min-height:50px;font-size:18px}
  `;
  document.head.appendChild(st);

  // ------------------------------------------------------------------ written exam (jCard, one question at a time)
  function written(l, done) {
    const pool = shuffle(Q[l.id] || []).slice(0, l.written.n);
    let i = 0;
    let right = 0;
    const ask = () => {
      if (i >= pool.length) return done(right >= l.written.pass, right, pool.length);
      const [q, ans, ...wrong] = pool[i];
      jCard({
        tag: "License",
        iconSrc: l.icon,
        title: `${l.name} - written exam`,
        lead: `Question ${i + 1} of ${pool.length}<br><br>${esc(q)}`,
        rows: [["Correct so far", `${right}/${i}`], ["To pass", `${l.written.pass}/${pool.length}`]],
        choices: shuffle([ans, ...wrong]).map((o) => [
          o,
          () => {
            if (o === ans) right++;
            i++;
            ask();
          },
        ]),
      });
    };
    ask();
  }

  // ------------------------------------------------------------------ practical test (timing mini-game, same popup as the casino)
  function practical(l, done) {
    const c = l.prac;
    let round = 0;
    let hits = 0;
    let raf = 0;
    let p = 0;
    let dir = 1;
    let zoneC = 0.5;
    let t0 = 0;
    let locked = false;
    const stop = () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", key, true);
    };
    const key = (k) => {
      if (k.key === " " || k.key === "Enter") {
        k.preventDefault();
        k.stopPropagation();
        tap();
      }
    };
    const newRound = () => {
      zoneC = 0.18 + rnd() * 0.64;
      const z = $("lcZone");
      if (z) {
        z.style.left = `${(zoneC - c.zone / 2) * 100}%`;
        z.style.width = `${c.zone * 100}%`;
      }
      $("lcInfo").innerHTML = `Attempt <b>${round + 1}</b> of ${c.rounds} &middot; good: <b>${hits}</b> (need ${c.need})`;
      p = rnd() < 0.5 ? 0 : 1;
      dir = p === 0 ? 1 : -1;
      t0 = performance.now();
      locked = false;
      const loop = (now) => {
        const dt = Math.min(0.05, (now - t0) / 1000);
        t0 = now;
        p += dir * c.speed * (1 + round * 0.06) * dt;
        if (p >= 1) {
          p = 1;
          dir = -1;
        } else if (p <= 0) {
          p = 0;
          dir = 1;
        }
        const m = $("lcMark");
        if (m) m.style.left = `${p * 100}%`;
        raf = requestAnimationFrame(loop);
      };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };
    const tap = () => {
      if (locked) return;
      locked = true;
      cancelAnimationFrame(raf);
      const ok = Math.abs(p - zoneC) <= c.zone / 2;
      if (ok) hits++;
      const bar = $("lcBar");
      if (bar) bar.classList.add(ok ? "ok" : "bad");
      snd(ok ? "choice" : "dismiss");
      setTimeout(() => {
        if (bar) bar.classList.remove("ok", "bad");
        round++;
        if (round >= c.rounds) {
          stop();
          if (typeof evWrap !== "undefined") evWrap.classList.remove("open");
          if (typeof ev !== "undefined") ev.style.overflow = "";
          return done(hits >= c.need, hits, c.rounds);
        }
        newRound();
      }, 450);
    };
    if (typeof evWrap !== "undefined") evWrap.classList.remove("open");
    setTimeout(() => {
      ev.classList.remove("death18");
      ev.innerHTML = `<div class="jcw lc-modal"><div class="jm-tag" style="margin-top:12px">License</div>
        <h4><img src="${l.icon}" alt=""><span>${esc(c.title)}</span></h4>
        <div class="lead">${esc(c.text)}<br><br>Tap STOP (or press Space) when the marker is inside the green zone.</div>
        <div class="lc-txt" id="lcInfo"></div>
        <div class="lc-bar" id="lcBar"><div class="lc-zone" id="lcZone"></div><div class="lc-mark" id="lcMark"></div></div>
        <div><button class="jm-apply ev-btn bj-pop" id="lcStop">STOP!</button></div></div>`;
      evWrap.classList.add("open");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          $("lcStop").onclick = tap;
          $("lcBar").onclick = tap;
          document.addEventListener("keydown", key, true);
          newRound();
        }),
      );
    }, 160);
  }

  // ------------------------------------------------------------------ flow
  function grant(l) {
    lic()[l.id] = { year: (state.birthYear || 2000) + (state.age || 0) };
    prog(l.id).written = true;
    hit(5);
    sayIt(`I got my ${l.name.toLowerCase()}!`);
    notice("License earned!", `You are now licensed: ${l.name}. ${l.uses}`, () => openLicenses(), true);
  }

  function takeWritten(l) {
    const pr = prog(l.id);
    const cost = pr.tries ? retake(l) : fee(l);
    if (state.money < cost) return notice("Flat broke", `The exam costs ${money(cost)} and you can't afford it.`, null, true);
    state.money -= cost;
    pr.tries++;
    if (typeof renderStats === "function") renderStats();
    written(l, (ok, right, total) => {
      if (ok) {
        pr.written = true;
        notice("Written exam passed", `${right}/${total} correct. Now the practical test.`, () => takePractical(l, true), true);
      } else {
        hit(-3);
        sayIt(`I failed the written exam for my ${l.name.toLowerCase()}.`);
        notice("Failed", `You got ${right}/${total}. You needed ${l.written.pass}. Retaking costs ${money(retake(l))}.`, () => openLicenses(), true);
      }
    });
  }

  function takePractical(l, free) {
    const pr = prog(l.id);
    const cost = free ? 0 : pracRetake(l);
    if (state.money < cost) return notice("Flat broke", `The practical retake costs ${money(cost)}.`, null, true);
    if (cost) {
      state.money -= cost;
      if (typeof renderStats === "function") renderStats();
    }
    practical(l, (ok, h, total) => {
      if (ok) return grant(l);
      pr.pracFails++;
      hit(-3);
      sayIt(`I failed the practical test for my ${l.name.toLowerCase()}.`);
      notice("Failed the practical", `${h}/${total} good attempts, ${l.prac.need} needed. Your written exam is still valid. A retake costs ${money(pracRetake(l))}.`, () => openLicenses(), true);
    });
  }

  function licenseCard(l) {
    snd("choice");
    if (l.builtin) {
      if (typeof drivingLicenseCard === "function") return drivingLicenseCard();
      return;
    }
    if (has(l.id)) return notice(l.name, `You already have this license.`, () => openLicenses(), true);
    const why = blocker(l);
    const pr = prog(l.id);
    const choices = [];
    if (!why) {
      if (pr.written) choices.push([`Take the practical test${pr.pracFails ? ` (${money(pracRetake(l))})` : ""}`, () => takePractical(l, !pr.pracFails)]);
      else choices.push([`Take the written exam (${money(pr.tries ? retake(l) : fee(l))})`, () => takeWritten(l)]);
    }
    choices.push(["Back", () => openLicenses()]);
    jCard({
      tag: "License",
      iconSrc: l.icon,
      title: l.name,
      close: () => openLicenses(),
      lead: why ? `<b>${esc(why)}</b>` : "Pass a written exam, then a practical test.",
      rows: [
        ["Minimum age", String(ageOf(l))],
        ["Fee", money(fee(l))],
        ...(l.req && l.req.length ? [["Requires", l.req.map((r) => byId(r).name).join(", ")]] : []),
        ["Written exam", `${l.written.pass}/${l.written.n} correct`],
        ["Practical test", `${l.prac.title}: ${l.prac.need}/${l.prac.rounds}`],
        ["Unlocks", l.uses],
        ...(pr.written ? [["Written exam", "Passed"]] : []),
      ],
      choices,
    });
  }

  function openLicenses() {
    if (typeof screen === "undefined" || typeof sList === "undefined") return;
    snd("choice");
    sTitle.textContent = "LICENSES";
    if (typeof sSub !== "undefined" && sSub && sSub.style) sSub.style.display = "none";
    sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;";
    sBack.onclick = () => (typeof openActivities === "function" ? openActivities() : screen.classList.remove("open"));
    sList.innerHTML =
      `<div class="sec">License Office</div>` +
      LIC.map((l) => {
        const got = has(l.id);
        const why = got ? null : blocker(l);
        const sub = got ? `Licensed${lic()[l.id] && lic()[l.id].year ? ` in ${lic()[l.id].year}` : ""} · ${l.uses}` : why ? why : `${money(fee(l))} · ${l.uses}`;
        const pr = (state.licProg || {})[l.id];
        return `<div class="row${got ? " dis" : ""}" data-lic="${l.id}"><img src="${l.icon}" alt="" style="object-fit:contain"><div class="t"><b>${esc(l.name)}</b><span>${esc(sub)}${!got && pr && pr.written ? " · written exam passed" : ""}</span></div>${got ? "" : chev()}</div>`;
      }).join("") +
      `<div class="mm-foot" style="padding:10px 14px;text-align:left">Each license needs a written exam and a practical test. Failing costs money and mood; the written result is kept if you only fail the practical.</div>`;
    sList.querySelectorAll("[data-lic]").forEach((el) => {
      if (el.classList.contains("dis")) return;
      el.onclick = () => licenseCard(byId(el.dataset.lic));
    });
    sList.scrollTop = 0;
    screen.classList.add("open");
  }

  // send the player to the license office when a purchase needs a license
  function need(id) {
    const l = byId(id);
    if (!l) return;
    jCard({
      tag: "License",
      iconSrc: l.icon,
      title: "License required",
      lead: `You need a <b>${esc(l.name)}</b> for that. ${l.uses}`,
      choices: [["Go to the License Office", () => openLicenses()], ["Not now", () => {}]],
    });
  }

  // ------------------------------------------------------------------ Activities entry
  const origAct = window.openActivities;
  if (typeof origAct === "function") {
    window.openActivities = function () {
      const r = origAct.apply(this, arguments);
      try {
        if (typeof sTitle !== "undefined" && sTitle.textContent === "ACTIVITIES" && !document.getElementById("flLicRow")) {
          const owned = LIC.filter((l) => has(l.id)).length;
          // a normal activity row, placed right above the "Surrender..." button
          const html = `<div class="row" id="flLicRow"><img src="cars/ui-license.png" alt="" style="object-fit:contain"><div class="t"><b>Licenses</b><span>${owned}/${LIC.length} licenses: driving, boats, planes, guns</span></div>${chev()}</div>`;
          const sur = document.getElementById("actSurrender");
          if (sur) sur.insertAdjacentHTML("beforebegin", html);
          else sList.insertAdjacentHTML("beforeend", html);
          $("flLicRow").onclick = openLicenses;
        }
      } catch (e) {
        console.warn("[licenses] activities", e);
      }
      return r;
    };
  }

  window.FL_LICENSES = { has, need, open: openLicenses, list: () => LIC.map((l) => ({ id: l.id, name: l.name, has: has(l.id) })) };
})();
