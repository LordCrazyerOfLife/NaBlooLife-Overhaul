      function hackPuzzle() {
        for (let e = 0; e < 500; e++) {
          const e = new Set(),
            t = [];
          let a = !0;
          for (let o = 0; o < 4 && a; o++) {
            const o = [];
            for (let t = 0; t < 25; t++) e.has(t) || o.push(t);
            let n = null;
            for (let t = 0; t < 40 && !n; t++) {
              const t = [pickR(o)],
                a = rint(3, 7),
                s = new Set(t);
              for (; t.length < a; ) {
                const a = t[t.length - 1],
                  o = (a / 5) | 0,
                  n = a % 5,
                  r = [
                    [o - 1, n],
                    [o + 1, n],
                    [o, n - 1],
                    [o, n + 1],
                  ]
                    .filter(([e, t]) => e >= 0 && e < 5 && t >= 0 && t < 5)
                    .map(([e, t]) => 5 * e + t)
                    .filter((t) => !e.has(t) && !s.has(t));
                if (!r.length) break;
                const i = pickR(r);
                t.push(i), s.add(i);
              }
              const r = t[0],
                i = t[t.length - 1];
              t.length >= 3 &&
                Math.abs(((r / 5) | 0) - ((i / 5) | 0)) + Math.abs((r % 5) - (i % 5)) > 1 &&
                (n = t);
            }
            if (!n) {
              a = !1;
              break;
            }
            n.forEach((t) => e.add(t)), t.push([n[0], n[n.length - 1]]);
          }
          if (a) return t;
        }
        return [
          [0, 4],
          [5, 24],
          [10, 13],
          [20, 22],
        ];
      }
      function hackCard() {
        const e = [
          ...victims()
            .slice(0, 6)
            .map((e) => ({ ...e, range: [100, 2500] })),
          ...HACK_RANDOM.map(([e, t, a]) => ({ name: e, random: !0, range: [t, a] })),
        ];
        (ev.innerHTML = `\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="jm-tag" style="margin-top:12px">Crime</div>\n      <h4><img src="crime/laptop.png" alt=""><span>Hack</span></h4>\n      <div class="lead">You're thinking about hacking into someone's bank account.</div>\n      <label class="hr-lab">Pick your victim:</label>\n      <div class="hr-sel"><select id="hkVictim">${e.map((e, t) => `<option value="${t}">${e.random ? e.name : `${e.name} (${e.title})`}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="hkGo">Begin hack</button>`),
          (ev.style.overflow = "visible");
        const t = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = t),
          (document.getElementById("hkGo").onclick = () => {
            const a = e[+document.getElementById("hkVictim").value];
            t(), screen.classList.remove("open"), hackSnd("Keyboard"), setTimeout(() => hackGame(a), 250);
          }),
          evWrap.classList.add("open");
      }
      function hackGame(e) {
        e.__stages = hackStages(e);
        e.__stage = 1;
        ev.innerHTML =
          `<div class="jm-tag" style="margin-top:12px">Crime</div>\n      <h4><span>Hack</span></h4>\n      <div class="lead">You have encountered a firewall!<br><br>Reconfigure the computer\'s logic pathways to bypass it before the system kicks you out.<br><br><b>Stage 1 of ${e.__stages}</b></div>\n      <div class="hk-time" id="hkTime">Time remaining: 15 seconds</div>\n      <canvas class="hk-board" id="hkBoard" width="1010" height="1010"></canvas>`;
        const t = document.getElementById("hkBoard"),
          a = t.getContext("2d"),
          o = document.getElementById("hkTime"),
          n = (e) => [5 + (e % 5) * 200 + 100, 5 + 200 * ((e / 5) | 0) + 100];
        let s = [
            [4, 7],
            [5, 8],
            [0, 13],
            [20, 24],
          ],
          r = [[4, 3, 2, 7], [5, 10, 15, 16, 17, 18, 19, 14, 9, 8], [0, 1, 6, 11], []],
          i = !1,
          l = !1,
          c = 15,
          d = null,
          u = -1;
        const h = (e) => {
            for (let t = 0; t < 4; t++) if (s[t].includes(e)) return t;
            return -1;
          },
          p = (e) => {
            const t = r[e];
            return (
              t.length > 1 &&
              s[e].includes(t[0]) &&
              s[e].includes(t[t.length - 1]) &&
              t[0] !== t[t.length - 1]
            );
          };
        function m() {
          a.clearRect(0, 0, 1010, 1010), (a.fillStyle = "#16171b"), a.fillRect(5, 5, 1e3, 1e3);
          for (let e = 0; e < 25; e++) {
            const [t, o] = n(e);
            a.drawImage(tinted("cell", "#44464a"), t - 100, o - 100, 200, 200);
          }
          a.drawImage(tinted("border", "#444444"), 0, 0, 1010, 1010),
            r.forEach((e, t) => {
              const o = HACK_COLORS[t];
              e.forEach((t, s) => {
                const [r, i] = n(t),
                  l = [e[s - 1], e[s + 1]]
                    .filter((e) => void 0 !== e)
                    .map((e) => (e === t - 5 ? 0 : e === t + 1 ? 1 : e === t + 5 ? 2 : 3));
                if ((a.save(), a.translate(r, i), 2 === l.length)) {
                  const [e, t] = l.sort();
                  if ((e + 2) % 4 === t)
                    a.rotate(e % 2 ? Math.PI / 2 : 0), a.drawImage(tinted("line", o), -35, -100, 70, 200);
                  else {
                    const n = { "01": 0, 12: 1, 23: 2, "03": 3 }[`${e}${t}`];
                    a.rotate((n * Math.PI) / 2), a.drawImage(tinted("bend", o), -35, -100, 135, 135);
                  }
                } else
                  1 === l.length &&
                    (a.rotate((l[0] * Math.PI) / 2),
                    a.drawImage(tinted("line", o), -35, -100, 70, 100),
                    h(t) < 0 && a.drawImage(tinted("small", o), -35, -35, 70, 70));
                a.restore();
              });
            }),
            s.forEach((e, t) =>
              e.forEach((e) => {
                const [o, s] = n(e);
                a.drawImage(tinted("circle", HACK_COLORS[t]), o - 62.5, s - 62.5, 125, 125),
                  (a.fillStyle = "#fff"),
                  (a.font = '900 60px "Avenir Next", Mulish, sans-serif'),
                  (a.textAlign = "center"),
                  (a.textBaseline = "middle"),
                  a.fillText(t + 1, o, s + 3);
              }),
            ),
            i || l || a.drawImage(hackImg.tutorial, 225, 467, 562, 496);
        }
        !(function e() {
          [...Object.values(hackImg)].every((e) => e.complete) ? m() : setTimeout(e, 50);
        })();
        const f = () => {
          o.textContent = `Time remaining: ${c} second${1 === c ? "" : "s"}`;
        };
        function g(t) {
          (l = !0), clearInterval(d), m(), hackSnd(t ? "FirewallBreachSuccess" : "FirewallBreachFailure");
          if (!t) return finishHack(e, false);
          hackNextStage(e);
        }
        const y = (e) => {
          const a = t.getBoundingClientRect(),
            o = ((e.clientX - a.left) / a.width) * 1010 - 5,
            n = ((e.clientY - a.top) / a.height) * 1010 - 5;
          return o < 0 || n < 0 || o >= 1e3 || n >= 1e3 ? -1 : 5 * ((n / 200) | 0) + ((o / 200) | 0);
        };
        function b(e, t) {
          const a = r[e],
            o = a.indexOf(t);
          if (o >= 0) return (a.length = o + 1), !0;
          if (p(e)) return !1;
          const n = h(t);
          if (n >= 0 && n !== e) return !1;
          if (n === e && t === a[0]) return !1;
          for (let a = 0; a < 4; a++) {
            if (a === e) continue;
            const o = r[a].indexOf(t);
            o >= 0 && ((r[a].length = o), hackSnd("NumberlinkGameLineBroken"));
          }
          return (
            a.push(t),
            p(e) && (hackSnd("NumberlinkGameLineCompleted"), r.every((e, t) => p(t)) && ((u = -1), g(!0))),
            !0
          );
        }
        (t.onpointerdown = (e) => {
          if (l) return;
          if (!i)
            return (
              (i = !0),
              (s = hackPuzzle()),
              (r = [[], [], [], []]),
              f(),
              (d = setInterval(() => {
                c--, f(), c <= 0 && ((u = -1), g(!1));
              }, 1e3)),
              m()
            );
          const a = y(e);
          if (a < 0) return;
          const o = h(a);
          if (o >= 0) (r[o] = [a]), (u = o), hackSnd("NumberlinkGameLineStarted");
          else {
            const e = r.findIndex((e) => e.includes(a));
            if (e < 0) return;
            (r[e].length = r[e].indexOf(a) + 1), (u = e);
          }
          t.setPointerCapture(e.pointerId), m();
        }),
          (t.onpointermove = (e) => {
            if (u < 0 || l) return;
            const t = y(e),
              a = r[u];
            if (t < 0 || t === a[a.length - 1]) return;
            let o = 0;
            for (; a[a.length - 1] !== t && o++ < 10; ) {
              const e = a[a.length - 1],
                o = ((t / 5) | 0) - ((e / 5) | 0),
                r = (t % 5) - (e % 5),
                i = Math.abs(o) >= Math.abs(r) ? e + 5 * Math.sign(o) : e + Math.sign(r);
              if (
                ((n = e),
                (s = i),
                (5 !== Math.abs(n - s) && (1 !== Math.abs(n - s) || ((n / 5) | 0) != ((s / 5) | 0))) ||
                  !b(u, i))
              )
                break;
              if (l) break;
            }
            var n, s;
            m();
          }),
          (t.onpointerup = t.onpointercancel =
            () => {
              u = -1;
            }),
          evWrap.classList.add("open");
      }
      function hackStages(e) {
        const max = Number(e && e.range && e.range[1]) || 0;
        return max >= 50000 ? 3 : max >= 12000 ? 2 : 1;
      }
      function hackNextStage(e) {
        if (!e || e.__stage >= e.__stages) return finishHack(e, true);
        e.__stage++;
        evWrap.classList.remove("open");
        setTimeout(() => {
          if (e.__stage === 2) hackDots(e);
          else hackQuestion(e);
        }, 260);
      }
      function finishHack(e, ok) {
        if (!e) return;
        const a = e.random ? "" : e.name.split(" ")[0],
          o = e.random ? `${e.name[0].toLowerCase() + e.name.slice(1)}'s` : `${e.rel}, ${a}'s,`,
          n = o.replace(/^your /, "my ");
        setTimeout(() => {
          evWrap.classList.remove("open");
          if (ok) {
            const stages = Math.max(1, Number(e.__stages) || 1);
            const t = Math.round(rint(...e.range) * (1 + 0.35 * (stages - 1)));
            state.money += t;
            renderStats();
            say(`I hacked into ${n} bank account and stole ${usd(t)}.`);
            hackSnd("ComputerAccessSuccess");
            notice("Access Granted", `You successfully hacked into ${o} bank account and stole ${usd(t)}.`);
          } else {
            say(`I tried to hack into ${n} bank account, but the firewall kicked me out.`);
            hackSnd("ComputerAccessFailure");
            notice("Access Denied", `The system kicked you out before you could get into ${o} bank account.`);
            chance(0.3) && busted("hacking", 2);
          }
        }, 700);
      }
      function hackDots(e) {
        ev.innerHTML =
          `<div class="jm-tag" style="margin-top:12px">Crime</div>\n      <h4><span>Hack</span></h4>\n      <div class="lead">The firewall has a second lock.<br><br>Connect the dots in order, from 1 to ${8}, before the trace completes.<br><br><b>Stage ${e.__stage} of ${e.__stages}</b></div>\n      <div class="hk-time" id="hkDotsTime">Time remaining: 12 seconds</div>\n      <canvas id="hkDots" width="640" height="420" style="display:block;width:100%;max-width:620px;margin:8px auto;border:2px solid #2b2f36;border-radius:8px;background:#16171b;touch-action:none"></canvas>`;
        const cv = document.getElementById("hkDots"),
          g = cv.getContext("2d"),
          tm = document.getElementById("hkDotsTime"),
          pts = [
            [80, 330],
            [165, 120],
            [295, 235],
            [395, 80],
            [545, 175],
            [455, 330],
            [320, 365],
            [225, 255],
          ];
        let at = 0,
          left = 12,
          timer = null,
          done = false;
        const paint = () => {
          g.fillStyle = "#16171b";
          g.fillRect(0, 0, cv.width, cv.height);
          g.strokeStyle = "#5d6673";
          g.lineWidth = 1;
          for (let x = 40; x < cv.width; x += 40) {
            g.beginPath();
            g.moveTo(x, 0);
            g.lineTo(x, cv.height);
            g.stroke();
          }
          for (let y = 40; y < cv.height; y += 40) {
            g.beginPath();
            g.moveTo(0, y);
            g.lineTo(cv.width, y);
            g.stroke();
          }
          g.strokeStyle = "#37d67a";
          g.lineWidth = 4;
          g.beginPath();
          pts.slice(0, at).forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
          g.stroke();
          pts.forEach(([x, y], i) => {
            g.beginPath();
            g.arc(x, y, i === at ? 17 : 11, 0, Math.PI * 2);
            g.fillStyle = i < at ? "#37d67a" : i === at ? "#ffd45a" : "#4186f5";
            g.fill();
            g.strokeStyle = "#fff";
            g.lineWidth = 2;
            g.stroke();
            g.fillStyle = "#fff";
            g.font = '800 14px "Avenir Next", Mulish, sans-serif';
            g.textAlign = "center";
            g.textBaseline = "middle";
            g.fillText(String(i + 1), x, y + 1);
          });
          tm.textContent = `Time remaining: ${left} second${left === 1 ? "" : "s"}`;
        };
        const fail = () => {
          if (done) return;
          done = true;
          clearInterval(timer);
          finishHack(e, false);
        };
        paint();
        evWrap.classList.add("open");
        timer = setInterval(() => {
          left--;
          paint();
          if (left <= 0) fail();
        }, 1000);
        cv.onpointerdown = (evt) => {
          if (done) return;
          const r = cv.getBoundingClientRect(),
            x = ((evt.clientX - r.left) / r.width) * cv.width,
            y = ((evt.clientY - r.top) / r.height) * cv.height;
          const hit = pts.findIndex(([px, py]) => (px - x) ** 2 + (py - y) ** 2 < 38 ** 2);
          if (hit < 0) return;
          if (hit !== at) {
            left = Math.max(0, left - 2);
            hackSnd("NumberlinkGameLineBroken");
            paint();
            if (left <= 0) fail();
            return;
          }
          at++;
          hackSnd("NumberlinkGameLineCompleted");
          paint();
          if (at >= pts.length) {
            done = true;
            clearInterval(timer);
            hackSnd("ComputerAccessSuccess");
            hackNextStage(e);
          }
        };
      }
      function hackQuestion(e) {
        const bank = [
          { q: "Which protocol encrypts traffic between a browser and a website?", a: ["HTTPS", "FTP", "SMTP"], ok: 0 },
          { q: "What does 2FA stand for?", a: ["Two-Factor Authentication", "Second Firewall Access", "Two-File Archive"], ok: 0 },
          { q: "Which port is used by HTTPS by default?", a: ["21", "443", "8080"], ok: 1 },
          { q: "What is the safest way to store a password?", a: ["On a sticky note", "In a password manager", "In a group chat"], ok: 1 },
          { q: "What does a firewall do?", a: ["Filters network traffic", "Makes the CPU faster", "Backs up files"], ok: 0 },
        ];
        const q = bank[Math.floor(Math.random() * bank.length)];
        ev.innerHTML =
          `<div class="jm-tag" style="margin-top:12px">Crime</div>\n      <h4><span>Hack</span></h4>\n      <div class="lead">The last lock is a security question.<br><br><b>${q.q}</b><br><br><b>Stage ${e.__stage} of ${e.__stages}</b></div>\n      <div class="hk-time" id="hkQTime">Time remaining: 12 seconds</div>\n      <div id="hkAnswers" style="display:flex;flex-direction:column;gap:8px;margin:12px 0">${q.a.map((a, i) => `<button class="jm-apply ev-btn gy" data-hkq="${i}">${a}</button>`).join("")}</div>`;
        let left = 12,
          done = false;
        const tm = document.getElementById("hkQTime");
        const timer = setInterval(() => {
          left--;
          tm.textContent = `Time remaining: ${left} second${left === 1 ? "" : "s"}`;
          if (left <= 0) {
            done = true;
            clearInterval(timer);
            finishHack(e, false);
          }
        }, 1000);
        ev.querySelectorAll("[data-hkq]").forEach((b) => {
          b.onclick = () => {
            if (done) return;
            done = true;
            clearInterval(timer);
            if (Number(b.dataset.hkq) === q.ok) {
              hackSnd("ComputerAccessSuccess");
              hackNextStage(e);
            } else finishHack(e, false);
          };
        });
        evWrap.classList.add("open");
      }
      const GTA_WITNESSES = [
          "a construction worker",
          "a jogger",
          "an old lady",
          "a mailman",
          "a nosy neighbor",
          "a security guard",
          "a dog walker",
          "a cab driver",
        ],
        crimeSnd = (e) => {
          if ("MineExplosion" === e) {
            return void new Audio("sounds/explosion-real.ogg#t=0.55").play().catch(() => {});
          }
          new Audio(`sounds/a16_snd${e}.wav`).play().catch(() => {});
        };
      function gtaCard() {
        if (
          (state.gtaYear !== state.age && ((state.gtaYear = state.age), (state.gtaCount = 0)),
          !mods.infiniteGTA && state.gtaCount >= 4)
        )
          return notice(
            "Laying low",
            "You've already stolen 4 cars this year. Every cop in town is looking for you, so lay low until next year.",
            null,
            !0,
          );
        const e = new Set(),
          t = [];
        for (; t.length < 5; ) {
          const a = makeCar(pickR(carPool()), !1);
          e.has(carName(a)) || (e.add(carName(a)), t.push(a));
        }
        (ev.innerHTML = `\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="jm-tag" style="margin-top:12px">Crime</div>\n      <h4><img src="crime/car-front.png" alt=""><span>Grand Theft Auto</span></h4>\n      <div class="lead">You see some vulnerable cars.</div>\n      <label class="hr-lab">Pick your vehicle:</label>\n      <div class="hr-sel"><select id="gtaCar">${t.map((e, t) => `<option value="${t}">${carName(e)}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="gtaGo">Steal it</button>`),
          (ev.style.overflow = "visible");
        const a = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = a),
          (document.getElementById("gtaGo").onclick = () => {
            const e = t[+document.getElementById("gtaCar").value],
              o = carName(e);
            a(), state.gtaCount++, screen.classList.remove("open"), say("I prowled the streets.");
            const n = () => {
                (e.stolen = !0),
                  state.cars.push(e),
                  renderStats(),
                  crimeSnd("Car"),
                  say(`I stole a ${o}!`),
                  notice("Let's go", `You successfully stole the ${o}!`);
              },
              s = () => {
                if (mods.neverCaught) return n();
                crimeSnd("Cops"),
                  say(`I tried to steal a ${o} but the cops arrived before I could get it started!`),
                  notice(
                    "Yikes",
                    `You tried to steal the ${o} but ${pickR(GTA_WITNESSES)} saw you and called the cops before you could get it started!`,
                  ),
                  busted("grand theft auto", 3);
              },
              r = Math.random();
            return r < 0.45
              ? setTimeout(n, 250)
              : r < 0.65
                ? setTimeout(s, 250)
                : void setTimeout(
                    () =>
                      tagCard({
                        iconSrc: "emoji/1f975.png",
                        title: "Grand Theft Auto",
                        lead: `You're having a hard time getting the ${o} started and are beginning to get nervous.<br><br>What will you do?`,
                        choices: [
                          ["Keep trying", () => (chance(0.5) ? n() : s())],
                          [
                            "Flee the scene",
                            () => {
                              say(`I fled the scene before I could steal the ${o}.`),
                                notice(
                                  "Phew",
                                  `You fled the scene before anyone saw you trying to steal the ${o}.`,
                                );
                            },
                          ],
                        ],
                      }),
                    250,
                  );
          }),
          evWrap.classList.add("open");
      }
      const BURGLE_ITEMS = [
          ["TV", "tv", 150, 4e3],
          ["watch", "watch", 60, 25e3],
          ["diamond", "diamond", 800, 6e4],
          ["computer", "imac", 250, 3500],
          ["laptop", "laptop", 200, 3200],
          ["guitar", "guitar", 80, 6e3],
          ["teddy bear", "teddy", 5, 90],
          ["stack of cash", "dollar-bill", 40, 9e3],
        ],
        BURGLE_OWNERS = [
          ["nut picker", 0.2],
          ["DJ", 0.55],
          ["bus driver", 0.25],
          ["hipster", 0.35],
          ["local politician", 0.8],
          ["retired teacher", 0.3],
          ["plastic surgeon", 0.95],
          ["college student", 0.1],
          ["dentist", 0.75],
          ["real estate agent", 0.6],
          ["nurse", 0.45],
          ["construction worker", 0.35],
          ["lawyer", 0.85],
          ["librarian", 0.3],
          ["influencer", 0.65],
          ["tech entrepreneur", 0.9],
          ["pastor", 0.3],
          ["dog walker", 0.2],
          ["mail carrier", 0.3],
          ["pro athlete", 1],
          ["fry cook", 0.15],
          ["stockbroker", 0.9],
          ["yoga instructor", 0.4],
          ["bounty hunter", 0.5],
          ["mime", 0.1],
          ["crossing guard", 0.2],
          ["dermatologist", 0.8],
        ],
        BURGLARY_MAZES = [
          {
            ex: 4,
            rows: [
              ".............",
              ".###.###.###.",
              ".#.........#.",
              ".#.###.###.#.",
              "...#.#.#.#...",
              ".#.#.###.#.#.",
              ".#.........#.",
              ".###.###.###.",
              ".............",
            ],
          },
          {
            ex: 10,
            rows: [
              "...........",
              ".##.###.##.",
              ".#...#...#.",
              "...#...#.#.",
              ".###.#.#.#.",
              "...#.#.#.#.",
              ".#.......#.",
              ".#.#####.#.",
              "...........",
            ],
          },
        ],
        BURGLARY_WALLS = [
          ["#5f5f5f", "#233433"],
          ["#02549d", "#002c53"],
          ["#b3241c", "#5a0d09"],
        ],
        BG_EXIT = new Image();
      BG_EXIT.src = "crime/burglary/Exit.png";
      const listAnd = (e) =>
          e.length < 2
            ? e.join("")
            : 2 === e.length
              ? e.join(" and ")
              : `${e.slice(0, -1).join(", ")}, and ${e[e.length - 1]}`,
        anArt = (e) => (/^[aeiou]/i.test(e) ? "an " : "a ") + e;
      function burgleHomes() {
        if (
          state.burgleHomes &&
          state.burgleHomes.age === state.age &&
          state.burgleHomes.homes.every((e) => e.home && null != e.tier)
        )
          return state.burgleHomes.homes;
        const e = new Set(),
          t = [];
        for (let a = rint(3, 5); a > 0; a--) {
          let a, o;
          do {
            [a, o] = pickR(BURGLE_OWNERS);
          } while (e.has(a));
          e.add(a);
          const n = chance(0.5) ? "m" : "f",
            s = rint(25, 80),
            r = Math.max(0, Math.min(2, Math.floor(3 * o + 0.8 * Math.random() - 0.4)));
          t.push({
            occ: a,
            home: `the ${a}'s home`,
            w: o,
            tier: r,
            owner: r > 0 || chance(0.5),
            g: n,
            age: s,
            look: randomLook(n, s),
            dogs: 2 === r ? 2 : 1,
            maze: rint(0, BURGLARY_MAZES.length - 1),
            wall: r,
            poodle: chance(0.4),
            flip: chance(0.5),
            rot: chance(0.5),
            cops: rint(18, 30),
            cops2: chance(o) ? 2 : 1,
          });
        }
        return (state.burgleHomes = { age: state.age, homes: t }), t;
      }
      function burglaryCard(e) {
        const t = burgleHomes();
        if (!t.length) return notice("Burglary", "You are unable to find any homes to burgle.", null, !0);
        (ev.innerHTML = `\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px">${X_RED}</div>\n      <div class="jm-tag" style="margin-top:12px">Crime</div>\n      <h4><img src="crime/raccoon.png" alt=""><span>Burglary</span></h4>\n      <div class="lead">You're thinking about burgling a home.</div>\n      <label class="hr-lab">Pick a home:</label>\n      <div class="hr-sel"><select id="bgHome">${t.map((e, t) => `<option value="${t}">${capFirst(e.home)}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="bgGo">Burgle the home</button>`),
          ev.classList.remove("death18"),
          (ev.style.overflow = "visible");
        const a = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = a),
          (document.getElementById("bgGo").onclick = () => {
            const o = t[+document.getElementById("bgHome").value];
            a(), setTimeout(() => burglaryGame(o, e), 200);
          }),
          evWrap.classList.add("open");
      }
      function burglaryGame(e, t, a = {}) {
        screen.classList.remove("open");
        const o = state.burgleHomes ? state.burgleHomes.homes : [];
        o.includes(e) && o.splice(o.indexOf(e), 1);
        const n = `I decided to burgle ${e.home}!`,
          s = BURGLARY_MAZES[e.maze],
          [r, i] = BURGLARY_WALLS[e.wall];
        let l = s.rows.slice(),
          c = s.ex;
        const d = l[0].length,
          u = l.length;
        e.flip && ((l = l.map((e) => [...e].reverse().join(""))), (c = d - 1 - c));
        const h = !e.rot;
        e.rot && ((l = l.reverse().map((e) => [...e].reverse().join(""))), (c = d - 1 - c));
        const p = h ? -1 : u,
          m = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] },
          f = (e, t, [a, o]) =>
            ((e, t) => (e === p ? t === c : e >= 0 && t >= 0 && e < u && t < d && "." === l[e][t]))(
              e + a,
              t + o,
            ),
          g = {},
          y = [[p, c]];
        for (g[`${p},${c}`] = 0; y.length; ) {
          const [e, t] = y.shift();
          for (const a of Object.values(m)) {
            const o = `${e + a[0]},${t + a[1]}`;
            f(e, t, a) && !(o in g) && ((g[o] = g[`${e},${t}`] + 1), y.push([e + a[0], t + a[1]]));
          }
        }
        const b = new Set([`${p},${c}`]),
          v = (e) => {
            const t = Object.keys(g).filter((t) => !b.has(t) && e(g[t])),
              a = pickR(t) || pickR(Object.keys(g).filter((e) => !b.has(e)));
            return b.add(a), a.split(",").map(Number);
          },
          w = a.items
            ? a.items.map((e) => {
                const [t, a] = v((e) => e >= 4),
                  o = new Image();
                return (o.src = e.src), { ...e, r: t, c: a, v: 0, im: o };
              })
            : BURGLE_ITEMS.slice()
                .sort(() => Math.random() - 0.5)
                .slice(0, rint(3, 5))
                .map(([t, a, o, n]) => {
                  const [s, r] = v((e) => e >= 4),
                    i = Math.max(5, 5 * Math.round((o + (n - o) * e.w * (0.5 + 0.7 * Math.random())) / 5)),
                    l = new Image();
                  return (l.src = `crime/burglary/${a}.png`), { name: t, r: s, c: r, v: i, im: l };
                }),
          k = document.querySelector(".phone > .profile canvas.avatar"),
          $ = (e, [t, a], o) => ({
            type: e,
            r: t,
            c: a,
            tr: t,
            tc: a,
            t: 1,
            dir: null,
            aware: "cop" === e,
            bark: 0,
            ...o,
          }),
          S = [];
        e.owner &&
          S.push(
            $(
              "owner",
              v((e) => e >= 10),
              { dur: 330, chase: "follow", face: npcFace(e.look, e.g, e.age), home: [h ? u - 1 : 0, 0] },
            ),
          );
        for (let t = 0; t < e.dogs; t++)
          S.push(
            $(
              "dog",
              v((e) => e >= 6),
              { dur: 290, chase: "ambush", home: [h ? u - 1 : 0, d - 1] },
            ),
          );
        const x = new Image();
        x.src = `crime/burglary/${e.poodle ? "poodle" : "dog"}.png`;
        const C = new Image();
        C.src = "crime/burglary/policeman.png";
        const I = { r: p, c: c, tr: p, tc: c, t: 1, dir: null, want: null, dur: 230, out: 0, inside: !1 },
          T = [];
        let A = !1,
          M = !1,
          L = 0,
          E = performance.now(),
          H = 0,
          R = 0,
          B = 0;
        const O = [
          ["scatter", 3],
          ["chase", 9],
          ["scatter", 3],
          ["chase", 12],
          ["scatter", 2],
          ["chase", 1e9],
        ];
        let P = 0,
          Y = 0;
        (ev.innerHTML = `<div class="jcw bgl"><div class="jm-tag" style="margin-top:12px">${a.tag || "Crime"}</div>\n      <h4><img src="${a.icon || "crime/raccoon.png"}" alt=""><span>${a.title || "Burglary"}</span></h4>\n      <div class="lead">${a.lead || `Steal as many items as you can from ${e.home} and escape without being caught!`}<br><br>Swipe to change directions!</div>\n      <canvas class="bgl-board"></canvas>\n      <div class="bgl-got"><b>${a.gotLabel || "Collected items:"}</b><span id="bgGot"></span></div></div>`),
          ev.classList.remove("death18"),
          (ev.style.overflow = "");
        const N = ev.querySelector(".bgl-board"),
          j = N.getContext("2d"),
          D = 60,
          _ = h ? 84 : 6;
        (N.width = d * D + 12), (N.height = u * D + 78 + 12);
        const F = (e) => 6 + e * D,
          G = (e) => _ + e * D,
          W = (e) => {
            const t = Math.min(1, e.t);
            return { x: F(e.c + (e.tc - e.c) * t), y: G(e.r + (e.tr - e.r) * t) };
          },
          q = (e, t, a, o) => {
            e && (e.width || e.naturalWidth) && j.drawImage(e, t + (D - o) / 2, a + (D - o) / 2, o, o);
          },
          z = (e, t, a, o) => {
            j.beginPath(), j.moveTo(e, t), j.lineTo(a, o), j.stroke();
          };
        function U() {
          j.clearRect(0, 0, N.width, N.height);
          const e = F(c),
            t = G(0),
            a = G(u),
            o = F(0),
            n = F(d),
            s = h ? t - 78 : a;
          (j.fillStyle = "#faf8d3"),
            j.fillRect(o, t, d * D, u * D),
            j.fillRect(e, s, D, 78),
            (j.strokeStyle = "#e6e4bd"),
            (j.lineWidth = 2);
          for (let e = 1; e < d; e++) z(F(e), t, F(e), a);
          for (let e = 1; e < u; e++) z(o, G(e), n, G(e));
          z(e, h ? t : a, e + D, h ? t : a), (j.fillStyle = r);
          for (let e = 0; e < u; e++)
            for (let t = 0; t < d; t++) "#" === l[e][t] && j.fillRect(F(t) - 0.5, G(e) - 0.5, 61, 61);
          (j.lineCap = "square"), (j.strokeStyle = "rgba(160,170,168,.6)"), (j.lineWidth = 9);
          const p = () => {
            const r = h ? t : a,
              i = h ? s + 2 : s + 78 - 2;
            j.beginPath(),
              j.moveTo(e, r),
              j.lineTo(o, r),
              j.lineTo(o, h ? a : t),
              j.lineTo(n, h ? a : t),
              j.lineTo(n, r),
              j.lineTo(e + D, r),
              j.lineTo(e + D, i),
              j.stroke(),
              j.beginPath(),
              j.moveTo(e, r),
              j.lineTo(e, i),
              j.stroke();
          };
          p(),
            (j.strokeStyle = i),
            (j.lineWidth = 4),
            p(),
            (j.strokeStyle = "#c9cfcc"),
            (j.lineWidth = 2),
            z(e + 2, h ? s + 2 : s + 78 - 2, e + D - 2, h ? s + 2 : s + 78 - 2),
            BG_EXIT.complete &&
              BG_EXIT.naturalWidth &&
              j.drawImage(BG_EXIT, e + 17.4, h ? s + 0.06 * D : s + 78 - 0.48 * D, 25.2, 25.2);
          for (const e of w) e.got || q(e.im, F(e.c), G(e.r), 37.2);
          const m = W(I);
          q(k, m.x, m.y + I.out * (h ? -60 : D), 48);
          for (const e of S) {
            const t = W(e);
            q(
              "owner" === e.type ? e.face : "dog" === e.type ? x : C,
              t.x,
              t.y,
              D * ("dog" === e.type ? 0.7 : 0.8),
            ),
              e.seen &&
                performance.now() - e.seen < 900 &&
                ((j.fillStyle = "#e2401f"),
                (j.font = "900 25.2px sans-serif"),
                (j.textAlign = "center"),
                j.fillText("!", t.x + 0.82 * D, t.y + 0.34 * D));
          }
          H && ((j.fillStyle = `rgba(217,55,43,${0.45 * H})`), j.fillRect(0, 0, N.width, N.height));
        }
        const V = (e, t) =>
            !f(e.r, e.c, t) || (e.type && "cop" !== e.type && e.r + t[0] === p && e.c + t[1] === c),
          K = (e, t, a) => e.r === t && e.c === a;
        function X() {
          const e = w.find((e) => !e.got && K(I, e.r, e.c));
          if (e) {
            (e.got = !0), T.push(e), a.pickup ? a.pickup(e) : chaChing();
            const t = document.createElement("img");
            (t.src = e.im.src), document.getElementById("bgGot").appendChild(t);
          }
          if (K(I, p, c)) {
            if (I.inside)
              return (
                (A = !0),
                ce(),
                (I.dir = null),
                void oe(
                  260,
                  (e) => {
                    (I.out = e), U();
                  },
                  () => setTimeout(() => se(null), 150),
                )
              );
          } else I.inside = !0;
          const t = I.want && m[I.want];
          if ((t && !V(I, t) && (I.dir = I.want), !I.dir || V(I, m[I.dir]))) return void (I.dir = null);
          const o = m[I.dir];
          (I.tr = I.r + o[0]), (I.tc = I.c + o[1]), (I.t = 0), crimeSnd(B++ % 2 ? "Footstep2" : "Footstep1");
        }
        let J = !1;
        function Q(t) {
          if (
            "cop" === t.type ||
            !((e) => {
              if (e.r !== I.r && e.c !== I.c) return !1;
              const t = e.r === I.r ? [0, Math.sign(I.c - e.c)] : [Math.sign(I.r - e.r), 0];
              let a = e.r,
                o = e.c;
              for (; a !== I.r || o !== I.c; ) {
                if (!f(a, o, t)) return !1;
                (a += t[0]), (o += t[1]);
              }
              return !0;
            })(t)
          )
            return;
          const a = performance.now();
          "dog" === t.type
            ? (a - t.bark > 2500 && ((t.bark = a), crimeSnd("Bark")),
              J ||
                A ||
                ((J = !0),
                R ||
                  setTimeout(() => {
                    R || (te(), e.cops2 > 1 && setTimeout(te, 1600));
                  }, 3500)))
            : t.aware || crimeSnd("Scream"),
            (t.aware = !0),
            (t.seen = a);
        }
        function Z(e) {
          const t = Object.entries(m).filter(([t, a]) => !V(e, a)),
            a = e.dir && Object.keys(m).find((t) => m[t][0] === -m[e.dir][0] && m[t][1] === -m[e.dir][1]);
          let o,
            n = t.filter(([e]) => e !== a);
          n.length || (n = t),
            e.aware
              ? "scatter" === O[P][0] && "cop" !== e.type
                ? (o = e.home)
                : ((o = [I.tr, I.tc]),
                  "ambush" === e.chase && I.dir && (o = [I.tr + 2 * m[I.dir][0], I.tc + 2 * m[I.dir][1]]))
              : (o = null);
          const s = o
            ? n.reduce((t, a) => {
                const n = (e.r + t[1][0] - o[0]) ** 2 + (e.c + t[1][1] - o[1]) ** 2;
                return (e.r + a[1][0] - o[0]) ** 2 + (e.c + a[1][1] - o[1]) ** 2 < n ? a : t;
              })
            : pickR(n);
          (e.dir = s[0]), (e.tr = e.r + s[1][0]), (e.tc = e.c + s[1][1]), (e.t = 0);
        }
        function ee(e, t, a) {
          if (e.t >= 1) return a(e);
          (e.t += t / e.dur), e.t >= 1 && ((e.r = e.tr), (e.c = e.tc), (e.t = 1), a(e));
        }
        const te = () => {
          if (A) return;
          crimeSnd("Cops"), R++;
          const e = $("cop", [p, c], { dur: 250, chase: "follow" });
          (e.dir = h ? "down" : "up"), S.push(e);
        };
        function ae() {
          const t = performance.now();
          if (A) return;
          if (!evWrap.classList.contains("open")) return (A = !0), void ce();
          const a = Math.min(50, t - E);
          if (((E = t), M)) {
            const o = (t - L) / 1e3;
            if (((Y += a / 1e3), Y >= O[P][1])) {
              (Y = 0), (P = Math.min(P + 1, O.length - 1));
              for (const e of S)
                if (e.aware && e.t < 1 && "cop" !== e.type) {
                  ([e.r, e.tr] = [e.tr, e.r]), ([e.c, e.tc] = [e.tc, e.c]), (e.t = 1 - e.t);
                  const t = m[e.dir];
                  e.dir = Object.keys(m).find((e) => m[e][0] === -t[0] && m[e][1] === -t[1]);
                }
            }
            !R && o >= e.cops && (te(), e.cops2 > 1 && setTimeout(te, 1600)), ee(I, a, X);
            for (const e of S) ee(e, a, Z), Q(e);
            const n = W(I),
              s = S.find((e) => {
                const t = W(e);
                return Math.hypot(t.x - n.x, t.y - n.y) < 36;
              });
            if (s)
              return (function (e) {
                (A = !0),
                  ce(),
                  hurt(),
                  oe(
                    700,
                    (e) => {
                      (H = e < 1 ? Math.abs(Math.sin(e * Math.PI * 3)) : 0), U();
                    },
                    () => se(e),
                  );
              })(s);
          }
          U();
        }
        const oe = (e, t, a) => {
          const o = performance.now(),
            n = setInterval(() => {
              const s = Math.min(1, (performance.now() - o) / e);
              t(s), s >= 1 && (clearInterval(n), a());
            }, 16);
        };
        function ne(e) {
          if (A || I.out) return;
          M || ((M = !0), (L = performance.now())), (I.want = e);
          const t = m[e];
          if (I.t < 1 && I.dir && m[I.dir][0] === -t[0] && m[I.dir][1] === -t[1])
            return (
              ([I.r, I.tr] = [I.tr, I.r]), ([I.c, I.tc] = [I.tc, I.c]), (I.t = 1 - I.t), void (I.dir = e)
            );
          I.t >= 1 && X();
        }
        function se(o) {
          if ((evWrap.classList.remove("open"), a.done)) return a.done(o, T, J);
          const s = listAnd(T.map((e) => anArt(e.name))),
            r = T.reduce((e, t) => e + t.v, 0);
          if (!o || mods.neverCaught)
            return T.length
              ? ((state.housesBurgled = (state.housesBurgled || 0) + 1),
                (state.burgleLoot = (state.burgleLoot || 0) + r),
                t
                  ? (say(`${n} I stole ${s}.`), t(r, s, e))
                  : ((state.money += r),
                    renderStats(),
                    say(`${n} I stole ${s}, and the pawn shop gave me ${usd(r)} for it.`),
                    notice(
                      "Burglary",
                      `You burgled ${e.home} and stole ${s}!<br><br>The pawn shop gave you ${usd(r)} for the loot.`,
                      null,
                      !0,
                    )))
              : (say(`${n} I escaped without stealing anything.`),
                notice(
                  "Burglary",
                  `You escaped from ${e.home} without stealing anything or being caught.`,
                  null,
                  !0,
                ));
          if ("dog" === o.type && chance(0.5))
            return (
              (state.stats.Health = clamp(state.stats.Health - rint(4, 12))),
              renderStats(),
              say(`${n} Their dog caught me, but I managed to flee before the cops arrived.`),
              notice(
                "Burglary",
                `The ${e.occ}'s dog caught you!<br><br>You managed to flee before the cops arrived.`,
                null,
                !0,
              )
            );
          const i =
            "owner" === o.type
              ? "The homeowner caught you and turned you into the cops!"
              : "dog" === o.type
                ? `The ${e.occ}'s dog caught you and drew the attention of the cops!`
                : J
                  ? `The ${e.occ}'s dog barked and alerted the police!<br><br>The police officer caught you!`
                  : "The police officer caught you!";
          say(
            `${n} ${"owner" === o.type ? "The homeowner" : "dog" === o.type ? "Their dog" : "A police officer"} caught me in the act.`,
          ),
            notice("Busted!", i, null, !0),
            state.record++,
            arrest("burglary");
        }
        let re = 0,
          ie = 0;
        (N.onpointerdown = (e) => {
          (re = e.clientX), (ie = e.clientY);
        }),
          (N.onpointerup = (e) => {
            const t = e.clientX - re,
              a = e.clientY - ie;
            Math.max(Math.abs(t), Math.abs(a)) < 18 ||
              ne(Math.abs(t) > Math.abs(a) ? (t > 0 ? "right" : "left") : a > 0 ? "down" : "up");
          });
        const le = (e) => {
            const t = {
              ArrowUp: "up",
              ArrowDown: "down",
              ArrowLeft: "left",
              ArrowRight: "right",
              w: "up",
              s: "down",
              a: "left",
              d: "right",
            }[e.key];
            t && evWrap.classList.contains("open") && (e.preventDefault(), ne(t));
          },
          ce = () => document.removeEventListener("keydown", le);
        document.addEventListener("keydown", le),
          (N._bgl = {
            P: I,
            catchers: S,
            items: w,
            steer: ne,
            get over() {
              return A;
            },
            exR: p,
            exC: c,
            exitTop: h,
            open: (e, t, a) => f(e, t, m[a]),
          }),
          evWrap.classList.add("open"),
          (E = performance.now());
        const de = setInterval(() => {
          ae(), A && clearInterval(de);
        }, 16);
      }
      function crimePickCard({ icon: e, title: t, lead: a, picks: o, btn: n, go: s, sel: r = [] }) {
        (ev.innerHTML = `\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px">${X_RED}</div>\n      <div class="jm-tag" style="margin-top:12px">Crime</div>\n      <h4><img src="crime/${/\.(png|svg|webp)$/.test(e) ? e : e + ".png"}" alt=""><span>${t}</span></h4>\n      <div class="lead">${a}</div>\n      ${o.map(([e, t], a) => `<label class="hr-lab">${e}</label>\n      <div class="hr-sel"><select data-pk="${a}">${t.map((e, t) => `<option value="${t}"${r[a] === t ? " selected" : ""}>${e}</option>`).join("")}</select></div>`).join("")}\n      <button class="jm-apply ev-btn" id="cpGo">${n}</button>`),
          ev.classList.remove("death18"),
          (ev.style.overflow = "visible");
        const i = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = i),
          (document.getElementById("cpGo").onclick = () => {
            const e = [...ev.querySelectorAll("[data-pk]")].map((e) => +e.value);
            i(), screen.classList.remove("open"), setTimeout(() => s(...e), 250);
          }),
          evWrap.classList.add("open");
      }
      const ARSON_CAUGHT = [
          "A neighbor saw you setting the {n} on fire and called the cops!",
          "A security camera caught you setting the {n} on fire!",
          "A firefighter spotted you running away from the burning {n}!",
          "A passerby recognized you near the {n} and called the police!",
          "The smell of gasoline on your clothes gave you away when the police arrived at the {n}.",
          "An off-duty cop saw you light up the {n} and tackled you!",
        ],
        ARSON_ODDS = [
          [0.55, 0.1, 0.1],
          [0.5, 0.25, 0.02],
          [0.35, 0.05, 0.05],
        ],
        ARSON_TIER = {
          car: 0,
          dumpster: 0,
          treehouse: 0,
          playground: 0,
          "wheat-field": 0,
          excavator: 0,
          "box-truck": 0,
          apartments: 2,
          school: 2,
          hospital: 2,
          mall: 2,
          hotel: 2,
          subway: 2,
          airplane: 2,
          university: 2,
          "cargo-ship": 2,
          forest: 2,
          helicopter: 2,
          "police-station": 3,
          courthouse: 3,
          lighthouse: 3,
          "power-station": 3,
          stadium: 3,
          prison: 3,
        },
        ARSON_FX = [
          { dmg: [800, 6e4], inj: [0.1, 1], kill: [0.02, 1], noto: [2, 4], odds: 0.1 },
          { dmg: [4e4, 9e5], inj: [0.3, 3], kill: [0.1, 2], noto: [5, 8], odds: 0 },
          { dmg: [5e5, 25e6], inj: [0.7, 25], kill: [0.45, 12], noto: [10, 16], odds: -0.08 },
          { dmg: [5e6, 12e7], inj: [0.6, 15], kill: [0.35, 8], noto: [16, 25], odds: -0.15 },
        ],
        ARSON_OPTIONS = [
          { tier: 0, t: "Small Fire", s: "Torch a car, a dumpster or a field", ico: "trash-can", need: 0 },
          { tier: 1, t: "Building Fire", s: "Burn down a home or a business", ico: "house", need: 0 },
          {
            tier: 2,
            t: "Big Blaze",
            s: "Torch somewhere packed with people",
            ico: "office-building",
            need: 25,
          },
          {
            tier: 3,
            t: "Infamous Landmark",
            s: "Burn a famous landmark to the ground",
            ico: "classical-building",
            need: 60,
          },
          { tier: -1, t: "Random Fire", s: "Let fate pick a target", ico: "fire", need: 0 },
        ],
        ARSON_NICKS = [
          "The Midnight Torch",
          "The Firebug",
          "The Matchstick Menace",
          "The Inferno",
          "The Phantom Arsonist",
          "The Blaze",
          "Captain Kindling",
          "The Human Torch",
        ],
        arsonRec = () =>
          (state.arsonRec ||= {
            fires: 0,
            dmg: 0,
            kills: 0,
            inj: 0,
            arrests: 0,
            noto: 0,
            nick: null,
            pend: { fires: 0, kills: 0, inj: 0 },
          }),
        counts = (e, t) => `${e} ${1 === e ? "count" : "counts"} of ${t}`,
        people = (e, t) => `${e} ${1 === e ? "person" : "people"} ${t}`;
      function openArson() {
        const e = arsonRec();
        (sTitle.textContent = "ARSON"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openCrime);
        const t = (e) => `crime/arson/ui/${e}.png`,
          a = (e, t, a) =>
            `<div class="row arson-stat"><img src="${e}"><div class="t"><b>${t}</b><span>${a}</span></div></div>`;
        (sList.innerHTML =
          `<div class="sec">Reputation</div><div class="row arson-stat"><img src="${t("fire")}"><div class="t"><b>Notoriety</b>${sBar("", e.noto)}</div></div>` +
          a(
            t("newspaper"),
            "Media Nickname",
            e.nick || (e.noto >= 30 ? "" : "The media has not noticed you yet"),
          ) +
          '<div class="sec">Arson Record</div>' +
          a(t("fire-truck"), "Fires Set", e.fires.toLocaleString("en-US")) +
          a(t("money-flying"), "Estimated Damage", usd(e.dmg)) +
          a(t("skull"), "Kills", e.kills.toLocaleString("en-US")) +
          a(t("ambulance"), "Injuries", e.inj.toLocaleString("en-US")) +
          a(t("siren"), "Times Arrested", e.arrests) +
          '<div class="sec">Light a Fire</div>' +
          ARSON_OPTIONS.map((a, o) => {
            const n = e.noto < a.need;
            return `<div class="row${n ? " dis" : ""}" data-ar="${o}"><img src="${t(a.ico)}"><div class="t"><b>${a.t}</b><span>${n ? `Requires ${a.need}% notoriety` : a.s}</span></div>${n ? "" : DOTS}</div>`;
          }).join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-ar]").forEach(
            (e) =>
              (e.onclick = () => {
                e.classList.contains("dis") || (play("choice"), arsonCard(ARSON_OPTIONS[+e.dataset.ar].tier));
              }),
          );
      }
      function arsonArrest() {
        const e = arsonRec(),
          t = e.pend,
          a = Math.max(1, t.fires + 1),
          o = [counts(a, "arson")];
        t.kills && o.push(counts(t.kills, "murder")), t.inj && o.push(counts(t.inj, "aggravated assault"));
        const n = o.length > 2 ? `${o.slice(0, -1).join(", ")}, and ${o[o.length - 1]}` : o.join(" and ");
        (CHARGES[n] = [
          Math.min(60, 1 + a + 12 * t.kills + t.inj),
          Math.min(99, 6 + 3 * a + 25 * t.kills + 3 * t.inj),
          t.kills > 0,
        ]),
          e.arrests++,
          (e.pend = { fires: 0, kills: 0, inj: 0 }),
          (e.noto = Math.max(0, e.noto - 10)),
          state.record++,
          arrest(n);
      }
      function arsonCard(e = -1) {
        const t = window.ARSON_EVENTS || [],
          a = (state.arsonSeen ||= []),
          o = arsonRec(),
          n = t.filter((t) => e < 0 || (ARSON_TIER[t.img] ?? 1) === e),
          s = n.filter((e) => !a.includes(t.indexOf(e))),
          r = pickR(s.length ? s : n),
          i = t.indexOf(r);
        a.push(i), a.length > 40 && a.shift();
        const l = `the ${r.n}`,
          c = ARSON_TIER[r.img] ?? 1,
          d = ARSON_FX[c],
          u = (e) => {
            if (3 === e)
              return (
                say(`I decided not to set ${l} on fire.`),
                notice("Arson", `You decided to leave ${l} alone.`, null, !0)
              );
            crimeSnd("FlashlightOn");
            const [t, a, n] = ARSON_ODDS[e],
              s = Math.max(0.1, t + d.odds - 0.002 * o.noto),
              i = Math.random();
            if (i < s || (mods.neverCaught && i >= s + a + n)) {
              const t = 1 === e ? 1.6 : 1,
                a = 100 * Math.round((rint(d.dmg[0], d.dmg[1]) * t) / 100),
                n = chance(Math.min(0.95, d.inj[0] * t)) ? rint(1, d.inj[1]) : 0,
                s = chance(Math.min(0.9, d.kill[0] * t)) ? rint(1, d.kill[1]) : 0;
              o.fires++,
                (o.dmg += a),
                (o.kills += s),
                (o.inj += n),
                o.pend.fires++,
                (o.pend.kills += s),
                (o.pend.inj += n);
              const i = o.noto;
              (o.noto = clamp(o.noto + rint(...d.noto) + (2 === e ? 3 : 0) + Math.min(10, s))),
                (state.stats.Happiness = clamp(state.stats.Happiness + rint(2, 5) + (2 === e ? 4 : 0))),
                renderStats();
              const u = () => {
                new Audio("sounds/a16sfx_Camping_Start.wav").play().catch(() => {});
              };
              c >= 2 || 1 === e
                ? (setTimeout(() => crimeSnd("MineExplosion"), 120), setTimeout(u, 650))
                : setTimeout(u, 120),
                (s || n) && setTimeout(() => crimeSnd("Scream"), 900);
              const h =
                s && n
                  ? `${people(n, 1 === n ? "was" : "were")} injured and ${people(s, 1 === s ? "was" : "were")} killed in the fire.`
                  : s
                    ? `${people(s, 1 === s ? "was" : "were")} killed in the fire.`
                    : n
                      ? `${people(n, 1 === n ? "was" : "were")} injured in the fire.`
                      : "";
              say(
                `I set ${l} on fire${1 === e ? " and poured more fuel on it" : 2 === e ? " and stayed to watch it burn" : ""}.${h ? " " + h : ""}`,
              );
              const p =
                1 === e
                  ? "<br><br>The extra fuel made the fire even bigger."
                  : 2 === e
                    ? "<br><br>You stayed and watched it burn."
                    : "";
              return (
                openArson(),
                notice(
                  "Arson",
                  `${r.ok}${p}<br><br>The fire caused an estimated ${usd(a)} in damage.${h ? "<br><br>" + h : ""}`,
                  null,
                  !0,
                ),
                void (!o.nick && o.noto >= 30
                  ? ((o.nick = pickR(ARSON_NICKS)),
                    notice(
                      "Breaking News",
                      `The media has started calling you "${o.nick}" after your string of fires.`,
                      () => {
                        crimeSnd("Stamp"), openArson();
                      },
                    ))
                  : ((i < 25 && o.noto >= 25) || (i < 60 && o.noto >= 60)) &&
                    notice(
                      "Notoriety",
                      "Your notoriety as an arsonist is growing. Bigger targets are now within reach.",
                      () => openArson(),
                    ))
              );
            }
            return i < s + a
              ? ((state.stats.Health = clamp(state.stats.Health - rint(15, 35))),
                hurt(),
                renderStats(),
                state.stats.Health <= 0
                  ? (say(`I burned to death trying to set ${l} on fire.`),
                    notice(
                      "Arson",
                      `The flames flared up and engulfed you while you were setting ${l} on fire!`,
                      () => die(`burns from setting ${l} on fire`),
                      !0,
                    ))
                  : (say(`I badly burned myself trying to set ${l} on fire.`),
                    notice(
                      "Ouch",
                      `The flames flared up and you badly burned yourself trying to set ${l} on fire!`,
                      null,
                      !0,
                    )))
              : i < s + a + n
                ? (say(`I tried to set ${l} on fire, but it would not catch.`),
                  notice("Arson", `You tried to set ${l} on fire, but it just would not catch.`, null, !0))
                : (say(`I was caught trying to set ${l} on fire.`),
                  notice("Busted!", pickR(ARSON_CAUGHT).replace("{n}", r.n), null, !0),
                  screen.classList.remove("open"),
                  void arsonArrest());
          };
        tagCard({
          iconSrc: "crime/fire.png",
          title: "Arson",
          lead: `${r.d}<br><br>What will you do?`,
          choices: [
            [`Set ${l} on fire`, () => u(0)],
            ["Pour more fuel on it", () => u(1)],
            ["Watch it burn", () => u(2)],
            ["Leave it alone", () => u(3)],
          ],
        });
      }
      function kidnapCard() {
        const e = victims()
          .filter((e) => e.age >= 1)
          .slice(0, 8);
        crimePickCard({
          icon: "chains",
          title: "Kidnapping",
          lead: "You're thinking about kidnapping someone and holding them for ransom.",
          picks: [["Pick your victim:", [...e.map((e) => `${e.name} (${e.title})`), "A random stranger"]]],
          btn: "Kidnap them",
          go: (t) => {
            const a = e[t],
              o = a ? a.name.split(" ")[0] : "a stranger",
              n = a ? `${a.rel.replace("your ", "my ")}, ${o},` : "a stranger",
              s = a ? `${a.rel}, ${o},` : "a stranger",
              r = a ? a.age : rint(18, 60),
              i = a ? a.g : chance(0.5) ? "m" : "f",
              l = "f" === i ? "She" : "He",
              c = "f" === i ? "her" : "him",
              d = a ? capFirst(s) : "The stranger",
              u = a ? o : "the stranger",
              h = Math.random();
            if (h >= 0.45 && h < 0.75) {
              const e = r >= 16 && r <= 60,
                t = (e ? 0.25 : 0.06) + (state.stats.Health < 40 ? 0.15 : 0);
              if (chance(t))
                return (
                  say(
                    `I tried to kidnap ${n.replace(/,$/, "")}, but ${l.toLowerCase()} fought back and killed me.`,
                  ),
                  notice(
                    "Fought back",
                    `${d} fought back while you tried to kidnap ${c}!<br><br>${l} overpowered you and beat you to death.`,
                    () => die(`a beating from ${u} during a botched kidnapping`),
                    !0,
                  )
                );
              const o = e ? rint(30, 60) : rint(12, 30);
              if (
                ((state.stats.Health = clamp(state.stats.Health - o)),
                hurt(),
                renderStats(),
                state.stats.Health <= 0)
              )
                return (
                  say(
                    `I tried to kidnap ${n.replace(/,$/, "")}, but ${l.toLowerCase()} fought back and killed me.`,
                  ),
                  notice(
                    "Fought back",
                    `${d} fought back and left you with fatal injuries!`,
                    () => die("injuries from a botched kidnapping"),
                    !0,
                  )
                );
              if (a) {
                const e = [...state.parents, ...state.family, ...state.friends].find(
                  (e) => `${e.first} ${e.last || SURNAME}` === a.name,
                );
                e && (e.rel = rint(0, 5));
              }
              return chance(0.5) && !mods.neverCaught
                ? (say(
                    `I tried to kidnap ${n.replace(/,$/, "")}, but ${l.toLowerCase()} fought back, badly injured me, and called the police.`,
                  ),
                  notice(
                    "Fought back",
                    `${d} fought back while you tried to kidnap ${c}!<br><br>${l} badly injured you and called the police.`,
                    null,
                    !0,
                  ),
                  state.record++,
                  arrest("kidnapping"))
                : (say(
                    `I tried to kidnap ${n.replace(/,$/, "")}, but ${l.toLowerCase()} fought back and badly injured me. I fled before the police arrived.`,
                  ),
                  notice(
                    "Fought back",
                    `${d} fought back while you tried to kidnap ${c}!<br><br>${l} badly injured you, but you managed to get away.`,
                    null,
                    !0,
                  ));
            }
            if (h < 0.45 || mods.neverCaught) {
              if (a) {
                const e = [...state.parents, ...state.family, ...state.friends].find(
                  (e) => `${e.first} ${e.last || SURNAME}` === a.name,
                );
                e && (e.rel = rint(0, 10));
              }
              const e = 1e3 * rint(5, 120);
              return chance(0.6)
                ? ((state.money += e),
                  renderStats(),
                  chaChing(),
                  say(`I kidnapped ${n} and collected a ${usd(e)} ransom before letting them go.`),
                  notice(
                    "Kidnapping",
                    `You kidnapped ${s} and demanded ${usd(e)} for their safe return.<br><br>The ransom was paid and you let them go!`,
                    null,
                    !0,
                  ))
                : (say(`I kidnapped ${a ? n : "a stranger,"} but nobody paid the ransom so I let them go.`),
                  notice(
                    "Kidnapping",
                    `You kidnapped ${s} and demanded ${usd(e)}, but nobody paid the ransom.<br><br>You let them go.`,
                    null,
                    !0,
                  ));
            }
            say(`I bungled the kidnapping of ${n.replace(/,$/, "")}.`),
              notice("Busted!", `You bungled the kidnapping of ${s} and the cops showed up!`, null, !0),
              state.record++,
              arrest("kidnapping");
          },
        });
      }
      const STREET_DRUGS = [
        ["weed", 20, 120],
        ["cocaine", 80, 600],
        ["ecstasy", 25, 200],
        ["meth", 60, 450],
        ["heroin", 90, 700],
        ["LSD", 20, 150],
        ["shrooms", 25, 160],
      ];
      function drugsCard() {
        const e = victims()
          .filter((e) => e.age >= 13)
          .slice(0, 8);
        crimePickCard({
          icon: "pill",
          title: "Sell Drugs",
          lead: "You're thinking about selling drugs.",
          picks: [
            ["Pick a buyer:", [...e.map((e) => `${e.name} (${e.title})`), "A stranger on the street"]],
            ["Pick a drug:", STREET_DRUGS.map((e) => capFirst(e[0]))],
          ],
          btn: "Make the deal",
          go: (t, a) => {
            const o = e[t],
              [n, s, r] = STREET_DRUGS[a],
              i = rint(s, r) * rint(1, 5),
              l = o ? `${o.rel}, ${o.name.split(" ")[0]}` : "a stranger",
              c = o ? l + "," : l,
              d = !o && chance(0.25),
              u = Math.random();
            return d && !mods.neverCaught
              ? (say(`I tried to sell ${n} to an undercover cop.`),
                notice("Busted!", `The stranger you tried to sell ${n} to was an undercover cop!`, null, !0),
                state.record++,
                arrest("drug dealing"))
              : u < 0.65 || mods.neverCaught
                ? ((state.money += i),
                  renderStats(),
                  chaChing(),
                  say(`I sold ${n} to ${c.replace("your ", "my ")} for ${usd(i)}.`),
                  notice("Sell Drugs", `You sold some ${n} to ${c} for ${usd(i)}!`, null, !0))
                : u < 0.85 || !o
                  ? (say(
                      `I tried to sell ${n} to ${l.replace("your ", "my ")}, but they weren't interested.`,
                    ),
                    notice(
                      "Sell Drugs",
                      `You offered to sell some ${n} to ${l}, but they weren't interested.`,
                      null,
                      !0,
                    ))
                  : (say(
                      `${capFirst(c.replace("your ", "my "))} reported me to the police for trying to sell them ${n}.`,
                    ),
                    notice(
                      "Busted!",
                      `${capFirst(c)} reported you to the police for trying to sell them ${n}!`,
                      null,
                      !0,
                    ),
                    state.record++,
                    void arrest("drug dealing"));
          },
        });
      }
      const VANDAL_TARGETS = [
          "a convenience store",
          "your school",
          "a neighbor's car",
          "a park bench",
          "a bus stop",
          "a police car",
          "a church",
          "the town hall",
        ],
        VANDAL_METHODS = [
          ["Spray paint graffiti on it", "spray-painted graffiti on", 0.65],
          ["Smash the windows", "smashed the windows of", 0.45],
          ["Egg it", "egged", 0.75],
          ["Toilet paper it", "toilet-papered", 0.7],
          ["Key it", "keyed", 0.55],
          ["Kick it until it breaks", "kicked in", 0.5],
        ];
      function vandalCard() {
        const e = VANDAL_TARGETS.slice()
          .sort(() => Math.random() - 0.5)
          .slice(0, 5);
        crimePickCard({
          icon: "vandalism",
          title: "Vandalism",
          lead: "You're thinking about vandalizing something.",
          picks: [
            ["Pick a target:", e.map(capFirst)],
            ["Pick a method:", VANDAL_METHODS.map((e) => e[0])],
          ],
          btn: "Vandalize it",
          go: (t, a) => {
            const o = e[t],
              [, n, s] = VANDAL_METHODS[a];
            if (chance(s - ("a police car" === o ? 0.3 : 0)) || mods.neverCaught)
              return (
                (state.stats.Happiness = clamp(state.stats.Happiness + rint(2, 6))),
                renderStats(),
                say(`I ${n} ${o.replace("your ", "my ")}.`),
                notice("Vandalism", `You ${n} ${o} and got away with it!`, null, !0)
              );
            say(`I got caught vandalizing ${o.replace("your ", "my ")}.`),
              busted("vandalism", "a police car" === o ? 3 : 1);
          },
        });
      }
      const BANK_WEAPONS = [
          ["Sickle", "a sickle"],
          ["BB gun", "a BB gun"],
          ["Toy gun", "a toy gun"],
          ["Stun gun", "a stun gun"],
          ["Machete", "a machete"],
          ["Katana", "a katana"],
          ["Cleaver", "a cleaver"],
          ["Golf club", "a golf club"],
          ["Molotov cocktail", "a Molotov cocktail"],
          ["Silly string", "silly string"],
          ["Sharp acrylic nails", "sharp acrylic nails"],
          ["Unravelled paperclip", "an unravelled paperclip"],
          ["Pistol", "a pistol"],
          ["Baseball bat", "a baseball bat"],
          ["Banana in my pocket", "a banana in your pocket"],
          ["Fake bomb", "a fake bomb"],
        ],
        BANK_DISGUISES = [
          ["Purge mask", "in a Purge mask"],
          ["Guy Fawkes mask", "in a Guy Fawkes mask"],
          ["Furry suit", "in a furry suit"],
          ["Shrek costume", "in a Shrek costume"],
          ["Willy Wonka costume", "in a Willy Wonka costume"],
          ["Batman suit", "in a Batman suit"],
          ["Santa Claus costume", "as Santa Claus"],
          ["Police officer", "as a police officer"],
          ["Homeless person", "as a homeless person"],
          ["Ski mask", "in a ski mask"],
          ["Clown makeup", "in clown makeup"],
          ["Pantyhose over my face", "with pantyhose over your face"],
        ],
        BANK_GETAWAYS = [
          ["Bus", "on a bus"],
          ["Taxi", "in a taxi"],
          ["Subway", "on the subway"],
          ["Train", "on a train"],
          ["Pogo stick", "on a pogo stick"],
          ["Roller skates", "on roller skates"],
          ["Electric scooter", "on an electric scooter"],
          ["Hoverboard", "on a hoverboard"],
          ["Stolen car", "in a stolen car"],
          ["Bicycle", "on a bicycle"],
          ["On foot", "on foot"],
        ],
        bankLoot = () => {
          const e = Math.random();
          return localPrice(e < 0.85 ? rint(5e3, 25e4) : e < 0.98 ? rint(250001, 2e6) : rint(2000001, 2e7));
        };
      function bankOdds(e) {
        let t = 0.28;
        return (
          "crime" === state.talent && (t += 0.1),
          e && (t += 0.03),
          (t -= Math.min(0.1, 0.02 * (state.bankBusts || 0))),
          Math.max(0.08, Math.min(0.6, t))
        );
      }
      function bankRobberyCard(e) {
        const t = state.city || COUNTRIES[state.country][1],
          a = COUNTRIES[state.country][0],
          o = pickUnique(
            [
              (e) => `${e} Community Bank`,
              () => `${t} Credit Union`,
              (e) => `${e} Savings & Loan`,
              () => `First National Bank of ${t}`,
              (e) => `${e} Trust`,
              () => `Bank of ${a}`,
              (e) => `${e} Federal Credit Union`,
            ],
            4,
          ).map((e) => e(any(LAST))),
          n = pickUnique(BANK_WEAPONS, 5),
          s = pickUnique(BANK_DISGUISES, 5),
          r = (state.cars || []).find((e) => !e.stolen),
          i = [
            ...pickUnique(BANK_GETAWAYS, r ? 4 : 5),
            ...(r ? [[`My ${carName(r)}`, `in your ${carName(r)}`, !0]] : []),
          ];
        crimePickCard({
          icon: "bank",
          title: "Bank Robbery",
          lead: "You are planning a bank robbery. Choose wisely.",
          btn: "Rob it",
          picks: [
            ["Pick your bank:", o],
            ["Pick your weapon:", n.map((e) => e[0])],
            ["Pick your disguise:", s.map((e) => e[0])],
            ["Pick your getaway:", i.map((e) => e[0])],
          ],
          go: (t, a, r, l) => {
            const c = o[t],
              [, d] = n[a],
              [, u] = s[r],
              [, h, p] = i[l];
            if ((mischief(), chance(bankOdds(p)) || mods.neverCaught)) {
              const t = bankLoot();
              return (
                chaChing(),
                say(
                  `I robbed ${c} using ${d.replace("your", "my")} while disguised ${u.replace("your", "my")}, and escaped ${h.replace("your", "my")} with ${usd(t)}!`,
                ),
                notice(
                  "Successful heist!",
                  `You successfully robbed ${c} using ${d} while disguised ${u}!<br><br>You escaped ${h} and made off with ${usd(t)}!`,
                  () => {
                    if (e) return e(t, c);
                    (state.money += t), renderStats();
                  },
                  !0,
                )
              );
            }
            (state.bankBusts = (state.bankBusts || 0) + 1),
              crimeSnd("Cops"),
              say(`I was caught trying to rob ${c}.`),
              notice(
                "Horrible heist",
                `You were caught trying to rob ${c} using ${d} while disguised ${u}!<br><br>The police have arrived to arrest you.`,
                () => busted("bank robbery"),
                !0,
              );
          },
        });
      }
      const ID_JOBS = [
          ["Cashier", "Barista", "Janitor", "Bus Driver", "Student", "Retired Mail Carrier"],
          ["Accountant", "Nurse", "Teacher", "Electrician", "Real Estate Agent", "Retired Teacher"],
          ["Surgeon", "Lawyer", "Investment Banker", "Software Engineer", "Dentist", "Retired CEO"],
        ],
        ID_TAGS = [
          "An ordinary face. An extraordinary risk.",
          "Nobody checks the signature anyway.",
          "Same height, same hair. Close enough?",
          "A spotless credit score, for now.",
          "They never shred their mail.",
          "Their password is probably their dog's name.",
        ],
        riskOf = (e) =>
          e < 35 ? ["Low", "#2fa03b"] : e < 65 ? ["Moderate", "#f5841f"] : ["High", "#d32f2f"],
        idSkill = () =>
          clamp(
            Math.round(
              0.6 * state.stats.Smarts +
                ("crime" === state.talent ? 25 : 0) +
                Math.min(15, 3 * (state.idThefts || 0)),
            ),
          );
      function idCandidates() {
        const e = PG();
        return [0, 1, 2].map(() => {
          const t = any([0, 1, 1, 2]),
            a = 0 === t && chance(0.4) ? rint(65, 80) : rint(20, 62),
            o = any(
              a >= 65
                ? ID_JOBS[t].filter((e) => /Retired/.test(e))
                : ID_JOBS[t].filter((e) => !/Retired/.test(e)),
            ),
            n = [rint(8, 35), rint(35, 70), rint(70, 97)][t],
            s = clamp(Math.round(1.4 * Math.abs(a - state.age) + rint(5, 25)));
          return {
            first: uname(e),
            last: ulast(),
            g: e,
            age: a,
            job: o,
            wealth: n,
            diff: s,
            look: randomLook(e, a),
            edu: 2 === t ? "Graduate School" : t ? "University" : "High School",
            marital: any(["Single", "Married", "Divorced", a > 65 ? "Widowed" : "Married"]),
            tag: any(ID_TAGS),
            risk: clamp(Math.round(0.55 * n + 0.35 * s + rint(0, 12))),
          };
        });
      }
      const idHead = () =>
          `<div class="jm-x" id="idtX" style="left:-14px;top:-14px">${X_RED}</div>\n    <div class="ev-tag" style="margin-top:12px"><i class="idt-me"></i><span class="who">${state.first} ${SURNAME}</span><span class="kind">You</span></div>`,
        idBar = (e, t, a) =>
          `<b>${e}</b><i><u style="width:${Math.max(3, t)}%;background:${a || barCol(t)}"></u></i>`;
      function idOpen(e, t) {
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw idt">${idHead()}${e}</div>`),
          (ev.style.overflow = "visible"),
          ev.querySelector(".idt-me").replaceWith(npcFace(state.look, PG(), state.age, "happy", "ev-av")),
          ev.querySelectorAll("[data-face]").forEach((e) => {
            const t = JSON.parse(e.dataset.face);
            e.replaceWith(npcFace(t.look, t.g, t.age, "happy", e.className));
          });
        const a = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("idtX").onclick = () => {
          play("dismiss"), a();
        }),
          t(a),
          evWrap.classList.add("open"),
          queueMicrotask(() => {
            const e = document.getElementById("idtX");
            !e ||
              ev.scrollHeight <= ev.clientHeight + 2 ||
              (ev.style.setProperty("overflow", "auto", "important"),
              (e.style.left = "6px"),
              (e.style.top = "6px"));
          });
      }
      const faceTag = (e, t) =>
          `<i class="${t}" data-face='${JSON.stringify({ look: e.look, g: e.g, age: e.age }).replace(/'/g, "&#39;")}'></i>`,
        ID_METHODS = [
          ["Phishing email", 0.05, 1],
          ["Steal their mail", 0.02, 0.8],
          ["Dig through their trash", 0.08, 0.6],
          ["Card skimmer at a gas station", -0.03, 1.1],
          ["Pretend to be their bank on the phone", 0.02, 1.2],
          ["Hack their social media", -0.08, 1.4],
        ];
      function identityTheftCard(e = idCandidates(), t = [0, 0]) {
        crimePickCard({
          icon: "idcard.png",
          title: "Identity Theft",
          lead: "You're thinking about stealing someone's identity.",
          btn: "View identity",
          sel: t,
          picks: [
            ["Pick your target:", e.map((e) => `${e.first} ${e.last} (${e.job}, ${e.age})`)],
            ["Pick your method:", ID_METHODS.map((e) => e[0])],
          ],
          go: (t, a) => identityProfile(e, t, a),
        });
      }
      function identityProfile(e, t, a) {
        const o = e[t],
          n = state.city || COUNTRIES[state.country][1],
          [s, r] = riskOf(o.risk);
        idOpen(
          `<h4><img src="act/profile.png" alt=""><span>Identity Profile</span></h4>\n      <div class="idt-who">${faceTag(o, "idt-face")}<div><b>${o.first} ${o.last}</b><span>Risk: <em style="color:${r}">${s}</em></span></div></div>\n      <table class="jc idt-tb"><tbody>${[
            ["Age", o.age],
            ["Occupation", o.job],
            ["Education", o.edu],
            ["Marital status", o.marital],
            ["Location", n],
            ["Method", ID_METHODS[a][0]],
          ]
            .map(([e, t]) => `<tr><td><b>${e}:</b> ${t}</td></tr>`)
            .join(
              "",
            )}</tbody></table>\n      <div class="ev-bars">${idBar("Wealth", o.wealth)}${idBar("Suspicion", o.risk, r)}${idBar("Difficulty", o.diff, riskOf(o.diff)[1])}${idBar("Your crime skill", idSkill(), "#2fa03b")}</div>\n      <div class="idt-tag">${o.tag}</div>\n      <button class="jm-apply ev-btn" id="idtGo">Attempt identity theft</button><button class="jm-apply ev-btn" id="idtBack">Choose someone else</button>`,
          (n) => {
            (document.getElementById("idtGo").onclick = () => {
              play("choice"), n(), identityAttempt(o, a);
            }),
              (document.getElementById("idtBack").onclick = () => {
                play("choice"), n(), setTimeout(() => identityTheftCard(e, [t, a]), 120);
              });
          },
        );
      }
      function identityAttempt(e, t = 0) {
        const [, a, o] = ID_METHODS[t],
          n = `${e.first} ${e.last}`,
          s = Math.max(0.1, Math.min(0.9, 0.85 - e.risk / 120 + idSkill() / 300 + a));
        if ((mischief(), (state.idThefts = (state.idThefts || 0) + 1), chance(s) || mods.neverCaught)) {
          const t = localPrice(
              Math.round((rint(e.wealth * e.wealth * 3, e.wealth * e.wealth * 10) + rint(200, 2e3)) * o),
            ),
            a = rint(1, 6);
          return (
            (state.money += t),
            renderStats(),
            chaChing(),
            say(
              `I stole ${n}'s identity, opened ${a} credit card${a > 1 ? "s" : ""} in ${"f" === e.g ? "her" : "his"} name and took ${usd(t)}.`,
            ),
            idOpen(
              `<h4><img src="crime/idcard.png" alt=""><span>Identity Stolen</span></h4>\n        <div class="idt-who">${faceTag(e, "idt-face")}<b>${n}</b></div>\n        <div class="lead">You passed as ${n}, opened credit cards in ${"f" === e.g ? "her" : "his"} name and drained the accounts. Nobody suspects a thing.</div>\n        <table class="jc idt-tb"><tbody><tr><td><b>Money taken:</b> ${usd(t)}</td></tr><tr><td><b>Credit cards opened:</b> ${a}</td></tr></tbody></table>\n        <button class="jm-apply ev-btn hr-green" id="idtOk">Continue</button>`,
              (e) => {
                document.getElementById("idtOk").onclick = () => {
                  play("choice"), e();
                };
              },
            )
          );
        }
        crimeSnd("Cops"),
          say(`I was caught trying to steal ${n}'s identity.`),
          idOpen(
            `<img class="idt-cop" src="emoji/1f46e.png" alt=""><h4 class="idt-caught"><span>Caught in the Act!</span></h4>\n      <div class="lead">Your attempt to impersonate ${n} raised suspicion at the bank. The police have been notified.</div>\n      <div class="idt-cons"><p>Consequences</p><div class="ev-bars nb">${idBar("Identity attempt: Failed", 85, "#d32f2f")}${idBar("Reputation: Decreased", 60, "#f5841f")}${idBar("Police attention: High", 85, "#d32f2f")}</div></div>\n      <button class="jm-apply ev-btn" id="idtOk">Continue</button>`,
            (e) => {
              document.getElementById("idtOk").onclick = () => {
                play("choice"), e(), screen.classList.remove("open"), busted("identity theft");
              };
            },
          );
      }
      function crimeEvent([e, t, a]) {
        if ("hack" === e) return hackCard();
        if ("identity" === e) return identityTheftCard();
        if ("art" === e && window.ART_THEFT) return ART_THEFT.open();
        if ("jewel" === e && window.ART_THEFT) return ART_THEFT.jewelHeist();
        if ("counterfeit" === e && window.COUNTERFEIT) return COUNTERFEIT.open();
        if ("smuggle" === e && window.SMUGGLING) return SMUGGLING.open();
        if ("arson" === e) return openArson();
        if ("kidnap" === e) return kidnapCard();
        if ("drugs" === e) return window.DRUG_EMPIRE ? DRUG_EMPIRE.open() : drugsCard();
        if ("vandal" === e) return vandalCard();
        const o = (e) =>
            openEvent({
              kind: "Crime",
              make: () => ({ who: a, av: "1f47a", icon: "1f47a", title: a, feedback: !0, ...e }),
            }),
          n = (e, t) => ((state.money += e), renderStats(), t);
        if ("mischief" === e)
          return o({
            desc: "What kind of mischief do you want to get into?",
            choices: [
              [
                "Egg a house",
                () =>
                  attempt(
                    0.75,
                    () => fx({ Happiness: 5 }, "I egged a house in my neighborhood."),
                    "vandalism",
                    1,
                  ),
              ],
              [
                "Make a prank call",
                () =>
                  attempt(
                    0.85,
                    () => fx({ Happiness: 4 }, "I made a prank call to a random number. They fell for it!"),
                    "making prank calls",
                    1,
                  ),
              ],
              [
                "Spray graffiti",
                () =>
                  attempt(
                    0.6,
                    () => fx({ Happiness: 6 }, "I spray-painted graffiti on a wall downtown."),
                    "vandalism",
                    1,
                  ),
              ],
              [
                "Ding dong ditch",
                () =>
                  attempt(
                    0.8,
                    () => fx({ Happiness: 4 }, "I played ding dong ditch on my neighbors."),
                    "trespassing",
                    1,
                  ),
              ],
            ],
          });
        if ("shoplift" === e)
          return o({
            desc: "Which store do you want to steal from?",
            choices: [
              [
                "A grocery store",
                () =>
                  attempt(
                    0.7,
                    () => fx({ Happiness: 3 }, "I shoplifted a candy bar from a grocery store."),
                    "shoplifting",
                    1,
                  ),
              ],
              [
                "A clothing store",
                () =>
                  attempt(
                    0.55,
                    () => n(rint(40, 200), "I shoplifted a jacket from a clothing store and sold it."),
                    "shoplifting",
                    1,
                  ),
              ],
              [
                "An electronics store",
                () =>
                  attempt(
                    0.4,
                    () =>
                      n(
                        rint(300, 1200),
                        "I shoplifted a pair of headphones from an electronics store and sold them.",
                      ),
                    "shoplifting",
                    2,
                  ),
              ],
            ],
          });
        if ("pickpocket" === e) {
          const e = person(18, 80);
          return o({
            who: e.full,
            person: e,
            av: e.av,
            angry: !1,
            desc: `You spot ${e.first}, a ${e.age}-year-old ${e.kid}, with a wallet sticking out of ${"he" === e.he ? "his" : "her"} back pocket.`,
            choices: [
              [
                "Grab the wallet",
                () =>
                  attempt(
                    0.6,
                    () => n(rint(5, 400), `I pickpocketed ${e.first} and got away with some cash.`),
                    "pickpocketing",
                    1,
                  ),
              ],
              ["Back out", () => `I chickened out of pickpocketing ${e.first}.`],
            ],
          });
        }
        if ("porch" === e)
          return o({
            desc: "There's a package sitting on your neighbor's porch.",
            choices: [
              [
                "Steal it",
                () =>
                  attempt(
                    0.75,
                    () => {
                      const [e, t] = pickR([
                        ["a pair of sneakers", 90],
                        ["a phone case", 15],
                        ["a smart speaker", 60],
                        ["a box of dog food", 30],
                        ["a designer handbag", 400],
                        ["a gaming console", 450],
                        ["a bag of socks", 8],
                      ]);
                      return n(t, `I stole a package off my neighbor's porch. It had ${e} inside.`);
                    },
                    "mail theft",
                    1,
                  ),
              ],
              ["Leave it alone", () => "I left my neighbor's package alone."],
            ],
          });
        if ("burglary" === e) return burglaryCard();
        if ("gta" === e) return gtaCard();
        if ("bank" === e) return bankRobberyCard();
        if ("train" === e)
          return o({
            desc: "A cargo train full of valuables is passing through town.",
            choices: [
              [
                "Rob it",
                () =>
                  attempt(
                    0.2,
                    () => n(rint(1e5, 2e6), "I robbed a train and got away with a fortune!"),
                    "train robbery",
                    4,
                  ),
              ],
              ["Back out", () => "I chickened out of robbing a train."],
            ],
          });
        if ("embezzle" === e) {
          const e = state.job.pay || 3e4,
            t = (e, t) =>
              attempt(
                t,
                () => n(e, `I embezzled ${usd(e)} from ${state.job.emp || "work"}.`),
                "embezzlement",
                3,
              );
          return o({
            desc: `How much do you want to embezzle from ${state.job.emp || "your employer"}?`,
            choices: [
              [usd(Math.round(0.05 * e)), () => t(Math.round(0.05 * e), 0.75)],
              [usd(Math.round(0.25 * e)), () => t(Math.round(0.25 * e), 0.5)],
              [usd(Math.round(e)), () => t(Math.round(e), 0.25)],
            ],
          });
        }
        const s = victims().slice(0, 6);
        return s.length
          ? "murder" === e
            ? murderCard(s)
            : "hitman" === e
              ? hitmanCard(s)
              : void 0
          : notice(a, "There is nobody in your life to target.");
      }
      let modHairBack = null;
      function openModHair(e) {
        "function" == typeof e && (modHairBack = e),
          (sTitle.textContent = modLooksName().toUpperCase()),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = modHairBack || openActivities);
        const t = stage(state.age),
          a = hairList(t).length,
          o = (e, t, a, o) =>
            `<div class="row" id="${e}"><img src="emoji/${t}.png"><div class="t"><b>${a}</b><span>${o}</span></div>${CHEV}</div>`;
        sList.innerHTML =
          (mods.modHair
            ? '<div class="sec">Hair</div>' +
              o(
                "modStyle",
                "1f487",
                "Hairstyle",
                packHair(state.mod.xHair)
                  ? packHairName(state.mod.xHair)
                  : null == state.mod.style
                    ? "Your own hair"
                    : `Style ${(state.mod.style % a) + 1} of ${a}`,
              ) +
              o("modColor", "1f3a8", "Hair Color", colorLabel("hair"))
            : "") +
          (mods.modSkin
            ? '<div class="sec">Eyes</div>' +
              o("modEyeColor", "1f441-fe0f", "Eye Color", colorLabel("eye")) +
              o("modEyeFx", "1f308", "Eye Effects", fxName(state.mod.eyeFx)) +
              '<div class="sec">Skin</div>' +
              o("modSkinColor", "270b", "Skin Color", colorLabel("skin")) +
              o("modSkinFx", "1f308", "Skin Effects", fxName(state.mod.skinFx))
            : "") +
          (mods.modHair
            ? '<div class="sec">Hair Effects</div>' +
              HAIR_FX.map(
                ([e, t, a], o) =>
                  (16 === o ? '<div class="sec">Custom Styles (100)</div>' : "") +
                  `<div class="row" data-fx="${e}"><img src="emoji/${e === state.mod.effect ? "2705" : "2728"}.png"><div class="t"><b>${t}</b><span>${a}</span></div>${e === state.mod.effect ? "" : DOTS}</div>`,
              ).join("")
            : "");
        const n = (e, t) => {
          const a = document.getElementById(e);
          a && (a.onclick = t);
        };
        n("modStyle", hairPicker),
          n("modColor", () => colorPicker("hair")),
          n("modEyeColor", () => colorPicker("eye")),
          n("modSkinColor", () => colorPicker("skin")),
          n("modEyeFx", () => {
            play("choice"), openColorFx("eye");
          }),
          n("modSkinFx", () => {
            play("choice"), openColorFx("skin");
          }),
          sList.querySelectorAll("[data-fx]").forEach(
            (e) =>
              (e.onclick = () => {
                (state.mod.effect = e.dataset.fx), renderAvatar(), openModHair();
              }),
          );
      }
      const COLOR_FX_KEYS = [
          "none",
          "rainbow",
          "lava",
          "water",
          "gold",
          "neon",
          "galaxy",
          "frozen",
          "glitch",
        ],
        fxName = (e) => ("none" === e ? "Normal" : (HAIR_FX.find((t) => t[0] === e) || [, e])[1]);
      function openColorFx(e) {
        const t = "eye" === e ? "eyeFx" : "skinFx",
          a = "eye" === e ? "eyes" : "skin";
        (sTitle.textContent = "eye" === e ? "EYE EFFECTS" : "SKIN EFFECTS"),
          (sBack.onclick = () => openModHair());
        const o = HAIR_FX.filter((e) => COLOR_FX_KEYS.includes(e[0]) || e[0].startsWith("c:"));
        (sList.innerHTML = o
          .map(
            ([e, o, n], s) =>
              (s === COLOR_FX_KEYS.length ? '<div class="sec">Custom Styles (100)</div>' : "") +
              `<div class="row" data-cfx="${e}"><img src="emoji/${e === state.mod[t] ? "2705" : "2728"}.png"><div class="t"><b>${o}</b><span>${"none" === e ? `Your normal ${a}` : n.replace(/\bhair(do)?\b/gi, a)}</span></div>${e === state.mod[t] ? "" : DOTS}</div>`,
          )
          .join("")),
          sList.querySelectorAll("[data-cfx]").forEach(
            (a) =>
              (a.onclick = () => {
                (state.mod[t] = a.dataset.cfx), play("choice"), renderAvatar();
                const o = sList.scrollTop;
                openColorFx(e), (sList.scrollTop = o);
              }),
          ),
          (sList.scrollTop = 0);
      }
      const HAIR_COLORS = [
          ["Jet Black", "#0e0b0a"],
          ["Soft Black", "#2a201b"],
          ["Dark Brown", "#3b2416"],
          ["Chocolate", "#5b3a22"],
          ["Chestnut", "#7a4527"],
          ["Light Brown", "#8a5a2c"],
          ["Caramel", "#a8743f"],
          ["Honey", "#c48e48"],
          ["Dirty Blonde", "#b89a62"],
          ["Golden Blonde", "#d8b26a"],
          ["Platinum", "#ece4cf"],
          ["Strawberry", "#c9733f"],
          ["Auburn", "#a8471f"],
          ["Copper", "#c25a1c"],
          ["Ginger", "#d9692a"],
          ["Silver", "#c9c9c9"],
          ["Gray", "#8c8c8c"],
          ["White", "#f4f4f4"],
          ["Cherry Red", "#c1121f"],
          ["Fire Red", "#ff2a1a"],
          ["Burgundy", "#6d1028"],
          ["Hot Pink", "#ff3fa4"],
          ["Pastel Pink", "#ffb3d6"],
          ["Rose Gold", "#e8a08f"],
          ["Magenta", "#d6168f"],
          ["Purple", "#7b2fbe"],
          ["Lavender", "#b79cf0"],
          ["Violet", "#5a1a9c"],
          ["Electric Blue", "#1e6bff"],
          ["Navy", "#1a2a6c"],
          ["Sky Blue", "#7cc6ff"],
          ["Teal", "#119c9c"],
          ["Turquoise", "#2fd8c8"],
          ["Mint", "#8ff0c4"],
          ["Emerald", "#0f9d58"],
          ["Lime", "#9be22d"],
          ["Neon Green", "#39ff14"],
          ["Forest Green", "#2d5a27"],
          ["Yellow", "#ffe14a"],
          ["Lemon", "#fff59a"],
          ["Orange", "#ff8a1f"],
          ["Peach", "#ffb38a"],
          ["Coral", "#ff6f61"],
          ["Gold", "#d4a017"],
          ["Bronze", "#9c6b30"],
        ],
        EYE_COLORS = [
          ["Dark Brown", "#4a2c17"],
          ["Brown", "#6b4226"],
          ["Light Brown", "#8a5a2c"],
          ["Amber", "#c98a1c"],
          ["Hazel", "#8a6a3a"],
          ["Olive", "#6b7a2c"],
          ["Green", "#4f8a4b"],
          ["Emerald", "#0f9d58"],
          ["Jade", "#3fb98a"],
          ["Gray", "#5b6b7a"],
          ["Steel", "#8a9aaa"],
          ["Blue", "#3f7fbf"],
          ["Sky Blue", "#7cc6ff"],
          ["Ice Blue", "#c8ecff"],
          ["Navy", "#1a2a6c"],
          ["Teal", "#119c9c"],
          ["Turquoise", "#2fd8c8"],
          ["Violet", "#7b2fbe"],
          ["Lavender", "#b79cf0"],
          ["Pink", "#ff6fb5"],
          ["Red", "#d01020"],
          ["Blood Red", "#7a0010"],
          ["Orange", "#ff8a1f"],
          ["Gold", "#f5c518"],
          ["Yellow", "#ffe14a"],
          ["Lime", "#9be22d"],
          ["Neon Green", "#39ff14"],
          ["White", "#f4f4f4"],
          ["Silver", "#c9c9c9"],
          ["Black", "#0e0b0a"],
        ],
        SKIN_COLORS = [
          ["Porcelain", "#fde7d6"],
          ["Fair", "#f6d3b3"],
          ["Light", "#f1c6a0"],
          ["Beige", "#eebd94"],
          ["Warm Beige", "#e3a97c"],
          ["Tan", "#d9a274"],
          ["Olive", "#c69564"],
          ["Honey", "#b97c50"],
          ["Caramel", "#a26a40"],
          ["Brown", "#8a5a3a"],
          ["Chestnut", "#714630"],
          ["Dark Brown", "#5e3d27"],
          ["Espresso", "#43291a"],
          ["Ebony", "#2e1c12"],
          ["Sunburnt", "#f08a72"],
          ["Alien Green", "#8fdc6a"],
          ["Hulk Green", "#3f9a2c"],
          ["Smurf Blue", "#5aa8ff"],
          ["Avatar Blue", "#3a7bd5"],
          ["Ice", "#d8f3ff"],
          ["Lavender", "#c7a6ff"],
          ["Purple", "#8e44ad"],
          ["Bubblegum", "#ffb3d6"],
          ["Hot Pink", "#ff5fb0"],
          ["Devil Red", "#d8322a"],
          ["Orange", "#ff9a3c"],
          ["Lemon", "#ffe873"],
          ["Gold", "#e6b422"],
          ["Zombie", "#9aa87a"],
          ["Gray", "#9a9a9a"],
          ["Silver", "#d0d4d9"],
          ["Ghost White", "#f7f7f7"],
          ["Charcoal", "#3a3a3a"],
          ["Midnight", "#1a1f5e"],
          ["Teal", "#1fa3a3"],
        ],
        COLOR_KINDS = {
          hair: {
            prop: "color",
            list: HAIR_COLORS,
            title: "Hair Color",
            ico: "1f3a8",
            lead: "Dye your hair any color you want!",
            btn: "Dye my hair",
            natural: () => state.look.hair,
          },
          eye: {
            prop: "eyeColor",
            list: EYE_COLORS,
            title: "Eye Color",
            ico: "1f441-fe0f",
            lead: "Pick any eye color you want!",
            btn: "Change my eyes",
            natural: () => state.look.eyes,
          },
          skin: {
            prop: "skinColor",
            list: SKIN_COLORS,
            title: "Skin Color",
            ico: "270b",
            lead: "Pick any skin color you want!",
            btn: "Change my skin",
            natural: () => state.look.skin,
          },
        },
        colorLabel = (e) => {
          const t = COLOR_KINDS[e],
            a = state.mod[t.prop];
          return a ? `${(t.list.find((e) => e[1] === a) || ["Custom"])[0]} ${a}` : "Your natural color";
        };
      function colorPicker(e) {
        const t = COLOR_KINDS[e],
          a = stage(state.age),
          o = state.stats.Happiness,
          n = o < 25 ? "sad" : o < 40 ? "angry" : "happy";
        let s = state.mod[t.prop];
        ev.innerHTML = `\n      <div class="jm-x" id="propX"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="jm-tag">Modded Hair</div>\n      <h4><img src="emoji/${t.ico}.png" alt=""><span>${t.title}</span></h4>\n      <div class="lead">${t.lead}</div>\n      <div class="acc-prev"><canvas width="250" height="250" id="accCv"></canvas></div>\n      <div class="acc-name" id="accName"></div>\n      <div class="hc-grid">\n        <button class="hc-sw hc-nat" data-c="" title="Natural">Natural</button>\n        ${t.list.map(([e, t]) => `<button class="hc-sw" data-c="${t}" title="${e}" style="background:${t}"></button>`).join("")}\n        <label class="hc-sw hc-any" title="Any color"><input type="color" id="hcAny" value="${s || t.natural()}"></label>\n      </div>\n      <button class="jm-apply ev-btn" id="accPick">${t.btn}</button>`;
        const r = document.getElementById("accCv").getContext("2d"),
          i = () => {
            ev
              .querySelectorAll(".hc-sw")
              .forEach((e) =>
                e.classList.toggle(
                  "on",
                  null != e.dataset.c ? e.dataset.c === (s || "") : !!s && !t.list.some((e) => e[1] === s),
                ),
              ),
              (document.getElementById("accName").textContent = s
                ? `${(t.list.find((e) => e[1] === s) || ["Custom"])[0]} (${s})`
                : "Your natural color");
            const e = state.mod[t.prop],
              o = s;
            state.mod[t.prop] = s;
            const i =
              "dye" + a + n + moddedHairNum(a) + JSON.stringify(state.acc) + state.look.beard + dyeKey();
            (previewCache[i] ||= composeFace(a, n, state.look, PG(), state.acc, {
              hair: moddedHairNum(a),
            })).then((e) => {
              s === o && (r.clearRect(0, 0, 250, 250), r.drawImage(e, 0, 0));
            }),
              (state.mod[t.prop] = e);
          };
        ev.querySelectorAll(".hc-sw[data-c]").forEach(
          (e) =>
            (e.onclick = () => {
              (s = e.dataset.c || null), play("choice"), i();
            }),
        ),
          (document.getElementById("hcAny").oninput = (e) => {
            (s = e.target.value), i();
          }),
          (document.getElementById("propX").onclick = () => evWrap.classList.remove("open")),
          (document.getElementById("accPick").onclick = () => {
            (state.mod[t.prop] = s), evWrap.classList.remove("open"), renderAvatar(), openModHair();
          }),
          i(),
          evWrap.classList.add("open");
      }
      function hairPicker() {
        const e = stage(state.age),
          t = hairList(e),
          a = hairPackList().map((e) => e[0]),
          o = t.length + 1 + a.length,
          n = state.stats.Happiness,
          s = n < 25 ? "sad" : n < 40 ? "angry" : "happy";
        let r = packHair(state.mod.xHair)
          ? t.length + 1 + a.indexOf(state.mod.xHair)
          : null == state.mod.style
            ? 0
            : (state.mod.style % t.length) + 1;
        ev.innerHTML =
          '\n      <div class="jm-x" id="propX"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="jm-tag">Modded Hair</div>\n      <h4><img src="emoji/2699-fe0f.png" alt=""><span>Hairstyle</span></h4>\n      <div class="lead">Pick any hairstyle in BitLife!</div>\n      <div class="acc-prev"><span class="acc-arrow l" id="accL"></span><canvas width="250" height="250" id="accCv"></canvas><span class="acc-arrow r" id="accR"></span></div>\n      <div class="acc-name" id="accName"></div>\n      <button class="jm-apply ev-btn" id="accPick">Select this look</button>';
        const i = document.getElementById("accCv").getContext("2d"),
          l = () => {
            const o = r > t.length ? a[r - t.length - 1] : null,
              n = 0 === r || o ? null : t[r - 1],
              l = r;
            document.getElementById("accName").textContent =
              0 === r ? "Your own hair" : o ? packHairName(o) : `Style ${r} of ${t.length}`;
            const c = 0 === r ? packHair(state.look.xHair) : o,
              d = "pick" + e + s + n + c + JSON.stringify(state.acc) + state.look.beard + dyeKey();
            (previewCache[d] ||= composeFace(e, s, state.look, PG(), state.acc, { hair: n, xHair: c })).then(
              (e) => {
                r === l && (i.clearRect(0, 0, 250, 250), i.drawImage(e, 0, 0));
              },
            );
          };
        (document.getElementById("accL").onclick = () => {
          (r = (r - 1 + o) % o), play("choice"), l();
        }),
          (document.getElementById("accR").onclick = () => {
            (r = (r + 1) % o), play("choice"), l();
          }),
          (document.getElementById("propX").onclick = () => evWrap.classList.remove("open")),
          (document.getElementById("accPick").onclick = () => {
            const e = r > t.length ? a[r - t.length - 1] : null;
            (state.mod.style = 0 === r || e ? null : r - 1),
              (state.mod.xHair = e),
              evWrap.classList.remove("open"),
              renderAvatar(),
              openModHair();
          }),
          l(),
          evWrap.classList.add("open");
      }
      state.lovers = [];
