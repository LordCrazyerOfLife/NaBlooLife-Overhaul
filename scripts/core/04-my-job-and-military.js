      function openMilitary1800() {
        (sTitle.textContent = "MILITARY"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openOccupation);
        const e = mil1800Branches();
        (sList.innerHTML =
          `<div class="sec">${inConfederacy() ? "Confederate States" : "United States"} · ${yearNow()}</div>` +
          e
            .map(
              (e, t) =>
                `<div class="row logo-row" data-m18="${t}"><img src="${e.ico}" alt=""><div class="t"><b>${e.name}</b><span>${e.desc} · from ${usd(e.en[0][1])} a month</span></div>${DOTS}</div>`,
            )
            .join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-m18]").forEach(
            (t) =>
              (t.onclick = () => {
                if ((play("choice"), state.job && state.job.mil1800))
                  return notice(
                    "Already serving",
                    `You're already serving in the ${state.job.mil1800.name}.`,
                    null,
                    !0,
                  );
                mil1800Recruit(e[+t.dataset.m18]);
              }),
          ),
          screen.classList.add("open");
      }
      function mil1800Leave() {
        const e = state.job,
          t = e.mil1800,
          a = t.end - state.age;
        if (a <= 0)
          return (
            say(`I was honorably discharged from the ${t.name}.`),
            (state.job = null),
            (state.veteran1800 = t.name),
            (state.respect = clamp((state.respect ?? 40) + 3)),
            renderStats(),
            notice("Discharged", `You were honorably discharged from the ${t.name}.`, openOccupation, !0)
          );
        jCard({
          tag: "Military",
          iconSrc: e.icon,
          title: "Desert?",
          close: !0,
          lead: `Your enlistment has ${a} more year${1 === a ? "" : "s"} to run. Leaving now is desertion, and deserters can be flogged, branded or thrown in the stockade.`,
          choices: [
            [
              "Desert",
              () => {
                if (((state.job = null), screen.classList.remove("open"), chance(0.35)))
                  return (
                    say(`I tried to desert the ${t.name}, but I was caught and punished in the stockade.`),
                    eraFx({ Health: -12, Happiness: -10, Respect: -15 }),
                    notice(
                      "Caught",
                      `You were caught deserting and punished. The ${t.name} dismissed you in disgrace.`,
                      null,
                      !0,
                    )
                  );
                say(`I deserted the ${t.name} and slipped away in the night.`),
                  eraFx({ Happiness: -4, Respect: -10 }),
                  notice("Deserted", `You deserted the ${t.name}. Keep your head down.`, null, !0);
              },
              "gray",
            ],
            ["Finish my service", () => {}],
          ],
        });
      }
      function openMilitary() {
        if (isOldEra() && "us" === state.country) return openMilitary1800();
        (sTitle.textContent = "MILITARY"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openOccupation),
          (sList.innerHTML = MIL_BRANCHES.filter(
            ([e]) => !isOldEra() || !/Air Force|Space|Coast Guard/.test(e),
          )
            .map(
              ([e, t, a]) =>
                `<div class="row${mods.militaryExpanded ? " logo-row" : ""}" data-mil="${e}"><img src="${milLogo(e)}"><div class="t"><b>${e}</b><span>${a}</span></div>${DOTS}</div>`,
            )
            .join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-mil]").forEach(
            (e) =>
              (e.onclick = () => {
                const t = e.dataset.mil,
                  [a, o] = [milLadder(t, !1)[0], milLadder(t, !0)[0]];
                MIL_BRANCHES.find((e) => e[0] === t)[1];
                jCard({
                  tag: "Military",
                  iconSrc: milLogo(t),
                  title: t,
                  close: !0,
                  lead: `Join the ${t} today!`,
                  rows: [
                    ["Enlisted Salary", usd(wage(a.pay))],
                    ["Officer Salary", usd(wage(o.pay))],
                  ],
                  choices: [
                    [
                      `Enlist in the ${t}`,
                      () =>
                        state.age < 18
                          ? show("Too Young", `You must be at least 18 to join the ${t}.`)
                          : hireJob(a, "military", a.emp),
                    ],
                    [
                      "Apply as an officer",
                      () =>
                        state.age < 18
                          ? show("Too Young", `You must be at least 18 to join the ${t}.`)
                          : state.degree
                            ? hireJob(o, "military", o.emp)
                            : notice(
                                "Rejected",
                                `Your application to join the ${t} as an officer has been rejected.`,
                                null,
                                !0,
                                '<table class="nt"><tr><td><b>Reason:</b> No College Degree</td></tr></table>',
                              ),
                    ],
                  ],
                });
              }),
          );
      }
      function workHarder() {
        const e = state.job;
        e &&
          (e.worked ||
            ((e.worked = !0),
            (e.perf = Math.min(100, (e.perf ?? 50) + rint(8, 15))),
            (state.stats.Happiness = Math.max(0, state.stats.Happiness - 2)),
            say(`I began working harder at ${e.emp || "my job"}.`)),
          screen.classList.remove("open"),
          renderStats(),
          notice("Hard worker", `You began working harder at ${e.emp || "your job"}.`, null, !0));
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || !isOldEra() || "us" !== state.country || state.prison) return;
        const e = state.job,
          t = e && e.mil1800,
          a = yearNow();
        if (
          (t &&
            state.age >= t.end &&
            queuePopup(() =>
              jCard({
                tag: "Military",
                iconSrc: e.icon,
                title: "Enlistment Over",
                lead: `Your ${t.term}-year enlistment in the ${t.name} is up. Will you re-enlist?`,
                choices: [
                  [
                    "Re-enlist",
                    () => {
                      (t.end = state.age + t.term),
                        (e.perf = Math.min(100, (e.perf ?? 50) + 5)),
                        say(`I re-enlisted in the ${t.name} for another ${t.term} years.`);
                    },
                  ],
                  ["Take my discharge", () => mil1800Leave()],
                ],
              }),
            ),
          t && 1898 === a && !state.war1898 && /army|navy|marines|revenue/.test(t.k))
        ) {
          state.war1898 = !0;
          const a = {
            army: [
              "Your regiment ships out to Cuba to fight the Spanish.",
              "Charge up the San Juan Heights",
              "Guard the supply lines",
            ],
            navy: [
              "Your ship steams into Manila Bay to attack the Spanish fleet.",
              "Man the guns",
              "Keep the engines running",
            ],
            marines: [
              "Your battalion lands at Guantánamo Bay under Spanish fire.",
              "Take the heights",
              "Hold the beach",
            ],
            revenue: [
              "Your cutter is attached to the navy blockading Cuba.",
              "Tow a crippled torpedo boat under fire",
              "Patrol the blockade",
            ],
          }[t.k];
          queuePopup(() =>
            jCard({
              tag: "War",
              iconSrc: e.icon,
              title: "War with Spain!",
              lead: `The United States has declared war on Spain. ${a[0]}<br><br>What will you do?`,
              choices: [
                [
                  a[1],
                  () =>
                    chance(0.15)
                      ? eraResult("War with Spain", e.icon, [
                          1,
                          "I was wounded during the war with Spain.",
                          { Health: -30, Happiness: -8 },
                        ])
                      : eraResult("War with Spain", e.icon, [
                          1,
                          "I was commended for bravery in the war with Spain.",
                          { Respect: 8, Happiness: 6 },
                          () => {
                            e.perf = Math.min(100, (e.perf ?? 50) + 15);
                          },
                        ]),
                ],
                [
                  a[2],
                  () =>
                    chance(0.2)
                      ? eraResult("War with Spain", e.icon, [
                          1,
                          "I caught yellow fever during the war with Spain.",
                          { Health: -20 },
                        ])
                      : eraResult("War with Spain", e.icon, [
                          1,
                          "I served steadily through the war with Spain.",
                          { Respect: 3 },
                        ]),
                ],
              ],
            }),
          );
        }
        if (t || "m" !== PG()) return;
        const o = inConfederacy(),
          n = !o && a >= 1863 && a <= 1865 && state.age >= 20 && state.age <= 45,
          s = o && a >= 1862 && state.age >= (a >= 1864 ? 17 : 18) && state.age <= (a >= 1864 ? 50 : 35);
        if ((!n && !s) || state.draftYear === a || !chance(0.35)) return;
        state.draftYear = a;
        const r = mil1800Branches()[0],
          i = rint(400, 1e3),
          l =
            /Blacksmith|Railway|Clergyman|Priest|Doctor|Surgeon|Schoolteacher|Printer|Pharmacist|Midwife|Professor/;
        queuePopup(() =>
          jCard({
            tag: "Military",
            iconSrc: r.ico,
            title: "Drafted!",
            lead: o
              ? `The Confederate conscription act has caught up with you. You have been ordered to report for service in the ${r.name}.`
              : `Your name was drawn in the federal draft. You have been ordered to report for service in the ${r.name}.`,
            choices: [
              ["Report for duty", () => mil1800Join(r, !1, "Infantry", !1, !0)],
              ...(!o && a <= 1864
                ? [
                    [
                      `Pay the ${usd(300)} commutation fee`,
                      () =>
                        state.money < 300
                          ? notice(
                              "Not enough money",
                              `You don't have ${usd(300)}.`,
                              () => mil1800Join(r, !1, "Infantry", !1, !0),
                              !0,
                            )
                          : ((state.money -= 300),
                            eraResult("Drafted", r.ico, [
                              1,
                              `I paid the ${usd(300)} commutation fee to avoid the draft.`,
                              { Respect: -2 },
                            ])),
                    ],
                  ]
                : []),
              ...(o && state.job && l.test(state.job.t)
                ? [
                    [
                      "Claim an exemption",
                      () =>
                        eraResult("Drafted", r.ico, [
                          1,
                          `I was exempted from the draft because the army needs me as ${/^[AEIOU]/.test(state.job.t) ? "an" : "a"} ${state.job.t.toLowerCase()}.`,
                          {},
                        ]),
                    ],
                  ]
                : []),
              ...(!o || a <= 1863
                ? [
                    [
                      `Hire a substitute (${usd(i)})`,
                      () =>
                        state.money < i
                          ? notice(
                              "Not enough money",
                              `A substitute wants ${usd(i)}.`,
                              () => mil1800Join(r, !1, "Infantry", !1, !0),
                              !0,
                            )
                          : ((state.money -= i),
                            eraResult("Drafted", r.ico, [
                              1,
                              `I paid ${usd(i)} for a substitute to serve in my place.`,
                              { Respect: -3 },
                            ])),
                    ],
                  ]
                : []),
              [
                o ? "Hide from the conscription officers" : "Dodge the draft",
                () =>
                  chance(0.4)
                    ? (say("I was caught dodging the draft and marched off to the army."),
                      eraFx({ Respect: -8 }),
                      mil1800Join(r, !1, "Infantry", !1, !0))
                    : eraResult("Drafted", r.ico, [
                        1,
                        "I dodged the draft and kept out of sight.",
                        { Respect: -6, Happiness: -3 },
                      ]),
              ],
            ],
          }),
        );
      }),
        document.getElementById("ageBtn").addEventListener("click", () => {
          const e = state.job,
            t = e && e.mil1800;
          if (state.dead || state.prison || !t || !e.ladder) return;
          const a = yearNow(),
            o = civilWar() || 1898 === a || (a >= 1846 && a <= 1848) || (a >= 1812 && a <= 1815);
          (e.milYrs = (e.milYrs || 0) + 1), (e.perf = clamp((e.perf ?? 50) + rint(-3, 6) + (o ? 2 : 0)));
          const n = e.ladder[(e.rank || 0) + 1],
            s = e.milYrs - (e.lastPromo || 0);
          if (
            n &&
            s >= (o ? 1 : 2) &&
            chance(
              Math.min(0.85, 0.2 + (e.perf - 40) / 120 + (o ? 0.2 : 0) + (state.stats.Smarts || 50) / 1e3),
            )
          )
            return (
              (e.rank = (e.rank || 0) + 1),
              (e.t = n.t),
              (e.pay = eraCash(n.pay)),
              (e.lastPromo = e.milYrs),
              (e.promos = (e.promos || 0) + 1),
              (e.perf = Math.max(45, e.perf - 8)),
              (state.respect = clamp((state.respect ?? 40) + 2)),
              renderAvatar(),
              renderStats(),
              say(`I was promoted to ${e.t} in the ${t.name}.`),
              void queuePopup(() =>
                notice(
                  "Promoted!",
                  `Your commanding officer has promoted you to ${e.t}. You now earn ${usd(n.monthly)} a month.`,
                  null,
                  !0,
                ),
              )
            );
          if (!n && !t.officer && o && e.perf >= 75 && chance(0.2)) {
            const a = mil1800Branches().find((e) => e.k === t.k);
            if (!a) return;
            const o = mil1800Ladder(a, !0, !1, !1),
              n = o[0];
            Object.assign(e, {
              t: n.t,
              pay: eraCash(n.pay),
              ladder: o,
              rank: 0,
              lastPromo: e.milYrs,
              promos: (e.promos || 0) + 1,
            }),
              (t.officer = !0),
              (state.respect = clamp((state.respect ?? 40) + 6)),
              renderAvatar(),
              renderStats(),
              say(
                `I was given a battlefield commission as ${/^[AEIOU]/.test(n.t) ? "an" : "a"} ${n.t} for my courage under fire.`,
              ),
              queuePopup(() =>
                notice(
                  "Battlefield Commission",
                  `For your courage under fire, you've been commissioned as ${/^[AEIOU]/.test(n.t) ? "an" : "a"} ${n.t}. You now earn ${usd(n.monthly)} a month.`,
                  null,
                  !0,
                ),
              );
          }
        }),
        (jmX.onclick = () => jmWrap.classList.remove("open")),
        (jmWrap.onclick = (e) => {
          e.target === jmWrap && jmWrap.classList.remove("open");
        });
      const CARD_X =
          '<svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg>',
        nextRank = () => state.job && state.job.ladder[state.job.rank + 1];
      function openMyJob() {
        const e = state.job,
          t = nextRank();
        (ev.innerHTML = `\n      <div class="jm-x" id="propX">${CARD_X}</div>\n      <div class="jm-tag">Job</div>\n      <h4><img src="${e.icon}" alt=""><span>${e.t}</span></h4>\n      <div class="lead">${e.emp}</div>\n      <table><tbody>\n        <tr><td><b>Salary:</b> ${e.mil1800 ? `${usd(Math.round(e.pay / 12))} a month` : `${usd(e.pay)}/yr`}</td></tr>\n        <tr><td><b>Employer:</b> ${e.emp}</td></tr>\n        ${e.mil1800 ? `<tr><td><b>Enlistment ends:</b> ${e.mil1800.end > state.age ? `age ${e.mil1800.end}` : "This year"}</td></tr>` : ""}\n        <tr><td><b>Years in this role:</b> ${e.yrs}</td></tr>\n        <tr><td><b>Career:</b> Rank ${e.rank + 1} of ${e.ladder.length}</td></tr>\n        <tr><td><b>Next promotion:</b> ${t ? `${t.t} (${e.mil1800 ? `${usd(t.monthly || Math.round(yearlyOf(t) / 12))} a month` : `${usd(yearlyOf(t))}/yr`})` : "Top of the ladder!"}</td></tr>\n      </tbody></table>\n      <div class="ev-bars"><b>Performance</b><i><u class="${e.perf < 50 ? "o" : ""}" style="width:${e.perf}%"></u></i></div>\n      ${t ? `<button class="jm-apply ev-btn" data-w="promo">${e.asked ? "Already asked this year" : "Ask for a Promotion"}</button>` : ""}`),
          (document.getElementById("propX").onclick = () => evWrap.classList.remove("open")),
          ev.querySelectorAll("[data-w]").forEach(
            (t) =>
              (t.onclick = () => {
                const a = t.dataset.w;
                if ("work" === a) return evWrap.classList.remove("open"), workHarder();
                if ("promo" === a) {
                  if (e.asked) return;
                  e.asked = !0;
                  const t =
                    e.yrs < 1 ? 0.05 : e.perf >= 80 ? 0.75 : e.perf >= 65 ? 0.45 : e.perf >= 50 ? 0.2 : 0.05;
                  return Math.random() < t
                    ? (evWrap.classList.remove("open"), promote())
                    : ((e.perf = Math.max(0, e.perf - 5)),
                      log.lastElementChild.insertAdjacentHTML(
                        "beforeend",
                        "<p>I asked for a promotion and was turned down.</p>",
                      ),
                      evWrap.classList.remove("open"),
                      show(
                        "Promotion Denied",
                        e.yrs < 1
                          ? "Your boss says you just started. Put in more time first."
                          : "Your boss says your performance isn't there yet. Keep working hard!",
                      ));
                }
                evWrap.classList.remove("open"),
                  log.lastElementChild.insertAdjacentHTML("beforeend", `<p>I quit my job as a ${e.t}.</p>`),
                  (state.job = null),
                  renderAvatar(),
                  openOccupation();
              }),
          ),
          evWrap.classList.add("open");
      }
      function promote() {
        const e = state.job,
          t = nextRank();
        if (!t) return;
        const a = { t: e.t, pay: e.pay };
        Object.assign(e, {
          t: t.t,
          pay: yearlyOf(t),
          rank: e.rank + 1,
          yrs: 0,
          perf: Math.max(40, e.perf - 15),
          icon: jobIcon(t),
        }),
          log.lastElementChild.insertAdjacentHTML("beforeend", `<p>I was promoted to ${e.t}!</p>`),
          renderAvatar(),
          renderStats();
        const o = () =>
          evWrap.classList.contains("open") ||
          jmWrap.classList.contains("open") ||
          toast.classList.contains("show") ||
          state.dead
            ? setTimeout(o, 500)
            : promotionCard(a);
        o();
      }
      function promotionCard(e) {
        const t = state.job;
        play("achievement"),
          (ev.innerHTML = `\n      <div class="jm-x" id="propX">${CARD_X}</div>\n      <div class="jm-tag">Promotion</div>\n      <h4><img src="emoji/1f389.png" alt=""><span>Promoted!</span></h4>\n      <div class="lead">Your hard work paid off! You are now a <b>${t.t}</b> at ${t.emp}.</div>\n      <table><tbody>\n        <tr><td><b>Old Title:</b> ${e.t}</td></tr>\n        <tr><td><b>New Title:</b> ${t.t}</td></tr>\n        <tr><td><b>Salary:</b> ${usd(e.pay)} → ${usd(t.pay)}</td></tr>\n        <tr><td><b>Rank:</b> ${t.rank + 1} of ${t.ladder.length}</td></tr>\n      </tbody></table>\n      <button class="jm-apply ev-btn" id="promoOk">Awesome!</button>`),
          (document.getElementById("propX").onclick = document.getElementById("promoOk").onclick =
            () => evWrap.classList.remove("open")),
          evWrap.classList.add("open");
      }
      const isMil = () => !(!state.job || !MIL_RANKS[state.job.c]),
        MIL_SEA = (e) => "Navy" === e || "Coast Guard" === e,
        MEDALS = {
          "Purple Heart": ["medal-purpleheart", "Wounded in action"],
          "Bronze Star": ["medal-bronzestar", "Heroic service in a combat zone"],
          "Silver Star": ["medal-silverstar", "Gallantry in action"],
          "Medal of Honor": ["medal-first", "Conspicuous gallantry above and beyond the call of duty"],
          "State Medal": ["sports-medal", "The state award for courage"],
          "Distinguished Service Cross": ["medal-first", "Extraordinary heroism in combat"],
          "Army Commendation Medal": ["medal-army-com", "Sustained meritorious service or acts of courage"],
          "Navy & Marine Achievement Medal": [
            "medal-navy-ach",
            "Outstanding achievement or meritorious service",
          ],
          "Air Force Achievement Medal": ["medal-af-ach", "Outstanding achievement or meritorious service"],
          "Good Conduct Medal": ["medal-third", "Exemplary behavior and efficiency"],
        },
        MEDAL_VALUE = {
          "Purple Heart": [800, 3500],
          "Bronze Star": [500, 2500],
          "Silver Star": [2500, 12e3],
          "Medal of Honor": [25e4, 15e5],
          "Distinguished Service Cross": [8e3, 45e3],
          "Army Commendation Medal": [60, 250],
          "Navy & Marine Achievement Medal": [50, 200],
          "Air Force Achievement Medal": [50, 180],
          "State Medal": [150, 900],
          "Good Conduct Medal": [30, 120],
        },
        medalValue = (e) => {
          const [t, a] = MEDAL_VALUE[e] || [100, 600],
            o = rint(t, a);
          return o >= 1e4 ? 1e3 * Math.round(o / 1e3) : 10 * Math.round(o / 10);
        };
      function awardMedal(e, t = {}) {
        const [a] = MEDALS[e];
        return (
          state.medals.push({
            name: e,
            ico: a,
            age: state.age,
            year: state.birthYear + state.age,
            branch: state.job ? state.job.c : "Military",
            rank: state.job ? state.job.t : "",
            value: medalValue(e),
            ...t,
          }),
          play("achievement"),
          e
        );
      }
      (state.medals = []),
        (MEDALS.Veteran = ["medal-military", "Served six or more years and left the military honorably"]),
        (MEDAL_VALUE.Veteran = [0, 0]);
      const inService = () => !(!state.job || (!MIL_RANKS[state.job.c] && !state.job.mil1800));
      function vetCheck() {
        if (state.dead || inService() || (state.milYears || 0) < 6 || state.medals.some((e) => e.vet)) return;
        const e = state.veteran,
          t =
            e && !e.dishonorable
              ? e.branch
              : !state.veteran1800 || (e && e.dishonorable)
                ? null
                : state.veteran1800;
        t &&
          (state.medals.push({
            name: "Veteran",
            ico: "medal-military",
            vet: !0,
            age: state.age,
            year: state.birthYear + state.age,
            branch: t,
            rank: "",
            value: 0,
          }),
          play("achievement"),
          say(`I earned my Veteran badge after ${state.milYears} years of service in the ${t}.`),
          queuePopup(() =>
            notice(
              "Veteran",
              `You served ${state.milYears} years in the ${t} and left with honor.<br><br>You earned the Veteran badge. You can find it with your medals in Assets.`,
              null,
              !0,
              '<img src="mil/medal-military.png" alt="" style="width:64px;margin-top:12px">',
            ),
          ));
      }
      function minefieldGame(e, t) {
        const a = MIL_SEA(state.job.c) ? "Sea" : "Land",
          o = Array.from({ length: 64 }, () => ({ mine: !1, open: !1, flag: !1, n: 0 }));
        let n = !1,
          s = !1,
          r = 0,
          i = !0,
          l = !1;
        const c = (e) => {
            const t = Math.floor(e / 8),
              a = e % 8,
              o = [];
            for (let e = -1; e <= 1; e++)
              for (let n = -1; n <= 1; n++) {
                const s = t + e,
                  r = a + n;
                (e || n) && s >= 0 && r >= 0 && s < 8 && r < 8 && o.push(8 * s + r);
              }
            return o;
          },
          d = (e) => {
            const t = new Set([e, ...c(e)]);
            let a = 0;
            for (; a < 10; ) {
              const e = rint(0, 63);
              o[e].mine || t.has(e) || ((o[e].mine = !0), a++);
            }
            o.forEach((e, t) => (e.n = c(t).filter((e) => o[e].mine).length)), (n = !0);
          };
        (ev.innerHTML = `<div class="jcw mine">\n      <div class="jm-tag" style="margin-top:12px">Military</div>\n      <h4><img src="flags/${e[1]}.png" alt="" style="border-radius:50%"><span>Deployment</span></h4>\n      <div class="lead">Clear the squares that don't have mines and flag the ones that do! The number in a square indicates how many mines that square is touching, including corners.</div>\n      <div class="mine-flags"><img src="mil/FlagNotice.png" alt=""><div><b>Mines flagged: <span id="mfN">0</span>/10</b><span>Long press on a square to flag it</span></div></div>\n      <div class="mine-board" style="background-image:url(mil/Background${a}.png)"><div class="mine-grid" id="mineGrid"></div></div>\n      <button class="jm-apply ev-btn gd" id="mDet">Use a metal detector</button>\n      <button class="jm-apply ev-btn" id="mDesert">Desert my post</button></div>`),
          ev.classList.remove("death18"),
          (ev.style.overflow = "");
        const u = document.getElementById("mineGrid");
        u.innerHTML = o.map((e, t) => `<div class="mc" data-i="${t}"></div>`).join("");
        const h = ["", "#f4e000", "#2ec4f0", "#ff4b4b", "#c86bff", "#ff9a2e", "#2ee0a0", "#fff", "#ccc"],
          p = (e = -1) =>
            u.querySelectorAll(".mc").forEach((t) => {
              const n = +t.dataset.i,
                r = o[n];
              let i = r.open ? "RevealedSpot" : r.flag ? "FlaggedSpot" : "CoveredSpot",
                c = "";
              s &&
                r.mine &&
                !r.flag &&
                ((i = n === e ? "ExplodedMine" : "RevealedSpot"),
                n !== e && (c = `<img class="mm" src="mil/RevealedMine${a}.png">`)),
                s && r.flag && !r.mine && (i = "RevealedIncorrectlyFlaggedMine"),
                !l || s || r.open
                  ? (t.innerHTML = `<img src="mil/${i}${a}.png" alt="">${c}${r.open && r.n && !r.mine ? `<b style="color:${h[r.n]}">${r.n}</b>` : ""}`)
                  : (t.innerHTML = `<img src="mil/RevealedSpot${a}.png" alt="">${r.mine ? `<img class="mm" src="mil/RevealedMine${a}.png" alt="">` : ""}<img class="xr" src="mil/${i}${a}.png" alt="">`);
            }),
          m = (e) => {
            const t = [e];
            for (; t.length; ) {
              const e = t.pop(),
                a = o[e];
              a.open ||
                a.flag ||
                ((a.open = !0),
                a.n ||
                  c(e).forEach((e) => {
                    o[e].open || o[e].mine || t.push(e);
                  }));
            }
          },
          f = (e, a) => {
            (s = !0),
              p(a),
              setTimeout(
                () => {
                  evWrap.classList.remove("open"), t(e ? "cleared" : "boom");
                },
                e ? 600 : 1100,
              );
          },
          g = (e) => {
            s ||
              o[e].open ||
              ((o[e].flag = !o[e].flag),
              (r += o[e].flag ? 1 : -1),
              (document.getElementById("mfN").textContent = r),
              p());
          };
        u.querySelectorAll(".mc").forEach((e) => {
          const t = +e.dataset.i;
          let a = null,
            r = !1;
          e.addEventListener("pointerdown", () => {
            (r = !1),
              (a = setTimeout(() => {
                (r = !0), g(t);
              }, 400));
          }),
            e.addEventListener("pointerup", () => {
              clearTimeout(a),
                r ||
                  ((e) => {
                    if (s) return;
                    const t = o[e];
                    if (!t.flag) {
                      if (t.open) {
                        if (!t.n || c(e).filter((e) => o[e].flag).length !== t.n) return;
                        const a = c(e).find((e) => !o[e].flag && !o[e].open && o[e].mine);
                        return null != a
                          ? (crimeSnd("MineExplosion"), hurt(), f(!1, a))
                          : (c(e).forEach((e) => {
                              o[e].flag || o[e].open || m(e);
                            }),
                            play("choice"),
                            p(),
                            void (
                              o.every((e) => e.mine || e.open) &&
                              (o.forEach((e) => {
                                e.mine && (e.flag = !0);
                              }),
                              f(!0))
                            ));
                      }
                      if ((n || d(e), t.mine)) return crimeSnd("MineExplosion"), hurt(), f(!1, e);
                      m(e),
                        play("choice"),
                        p(),
                        o.every((e) => e.mine || e.open) &&
                          (o.forEach((e) => {
                            e.mine && (e.flag = !0);
                          }),
                          f(!0));
                    }
                  })(t);
            }),
            e.addEventListener("pointerleave", () => clearTimeout(a)),
            e.addEventListener("contextmenu", (e) => {
              e.preventDefault(), clearTimeout(a), (r = !0), g(t);
            });
        }),
          (document.getElementById("mDet").onclick = () => {
            i &&
              !s &&
              (n || d(rint(0, 63)),
              (i = !1),
              (l = !0),
              p(),
              (document.getElementById("mDet").style.opacity = 0.5));
          }),
          (document.getElementById("mDesert").onclick = () => {
            s || ((s = !0), evWrap.classList.remove("open"), t("desert"));
          }),
          p(),
          evWrap.classList.add("open");
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        !state.dead && inService() && (state.milYears = (state.milYears || 0) + 1), setTimeout(vetCheck, 400);
      }),
        setInterval(vetCheck, 2e3);
      const MIL_ENL_PAY = [24200, 27100, 28500, 33800, 38800, 46700, 6e4, 70500, 86e3],
        MIL_ENL_YRS = [0, 1, 1.5, 2.5, 4.5, 8, 13, 17, 20],
        MIL_OFF_PAY = [45900, 56500, 73e3, 96e3, 118e3, 146e3, 176e3, 199e3, 218e3, 221900],
        MIL_OFF_YRS = [0, 2, 4, 10, 16, 22, 26, 29, 31, 33],
        milOfficer = (e) => e.ladder && e.ladder[0] && "University" === e.ladder[0].edu,
        MIL_PLACES = [
          "a deadly rebel encampment in",
          "a war-torn outpost inside",
          "a dangerous militant sector of",
          "terrorist-controlled wilderness in",
          "an unstable war zone in",
          "an unstable guerilla-controlled region in",
        ],
        MIL_SEA_PLACES = ["the waters off", "nasty ocean channels off", "a contested shipping lane off"],
        MIL_COUNTRIES = [
          ["Afghanistan", "af"],
          ["Iraq", "iq"],
          ["Syria", "sy"],
          ["Jordan", "jo"],
          ["China", "cn"],
          ["India", "in"],
          ["Iran", "ir"],
          ["Pakistan", "pk"],
          ["Ukraine", "ua"],
          ["Lebanon", "lb"],
          ["Vietnam", "vn"],
          ["Russia", "ru"],
          ["Egypt", "eg"],
          ["Colombia", "co"],
        ],
        MIL_ICON = (e) => milLogo(e);
      {
        const I = {
          Army: "Lieutenant General",
          "Air Force": "Lieutenant General",
          Marines: "Lieutenant General",
          Navy: "Vice Admiral",
          "Coast Guard": "Vice Admiral",
        };
        Object.entries(MIL_RANKS).forEach(([e, [, t]]) => {
          t.includes(I[e]) || t.splice(t.length - 1, 0, I[e]);
        });
      }
      const _milLadder = milLadder;
      function marchSnd() {
        const e = new Audio("sounds/marching-boots.mp3");
        (e.volume = 0.9),
          e.play().catch(() => {}),
          setTimeout(() => {
            const t = setInterval(() => {
              (e.volume = Math.max(0, e.volume - 0.09)), e.volume <= 0 && (clearInterval(t), e.pause());
            }, 80);
          }, 3400);
      }
      function deployment() {
        const e = state.job,
          t = e.c,
          a = MIL_SEA(t),
          o = pickR(MIL_COUNTRIES),
          n = pickR(a ? MIL_SEA_PLACES : MIL_PLACES);
        marchSnd(),
          jCard({
            tag: "Military",
            iconSrc: MIL_ICON(t),
            title: "Deployment",
            surprise: !0,
            lead: `Your commanding officer has ordered you to deploy to ${n} ${o[0]} to clear a minefield.<br><br>How will you react?`,
            choices: [
              [
                pickR(["Sir, yes sir", "Hoo-rah"]),
                () => {
                  say(`I eagerly accepted a deployment to ${n} ${o[0]}.`),
                    minefieldGame(o, (e) => deployResult(e, o));
                },
              ],
              [
                "Refuse to go",
                () => {
                  if ((say(`I refused to deploy to ${o[0]}.`), chance(0.85))) {
                    const e = t;
                    return (
                      (state.job = null),
                      (state.veteran = {
                        ...(state.veteran || {}),
                        branch: e,
                        end: state.age,
                        dishonorable: !0,
                      }),
                      renderAvatar(),
                      notice(
                        "Court-martialed",
                        `You were court-martialed for refusing orders and dishonorably discharged from the ${e}.`,
                      )
                    );
                  }
                  (e.perf = clamp(e.perf - 20)),
                    notice(
                      "Insubordination",
                      "Your commanding officer wrote you up for refusing orders. Your performance took a big hit.",
                    );
                },
              ],
            ],
          });
      }
      function deployResult(e, t) {
        const a = state.job,
          o = state.stats,
          n = a ? a.c : "military";
        if ("desert" === e)
          return (
            say(`I deserted my post in ${t[0]}.`),
            (state.job = null),
            (state.veteran = { ...(state.veteran || {}), branch: n, end: state.age, dishonorable: !0 }),
            renderAvatar(),
            chance(0.35)
              ? (notice(
                  "Deserter",
                  `You deserted your post in ${t[0]} and were dishonorably discharged from the ${n}!`,
                ),
                setTimeout(() => arrest("desertion"), 600))
              : notice(
                  "Deserter",
                  `You deserted your post in ${t[0]} and were dishonorably discharged from the ${n}.`,
                )
          );
        if ("boom" === e)
          return chance(0.6)
            ? (say(`I stepped on a landmine in ${t[0]} and was blown to smithereens.`),
              setTimeout(() => die(`stepping on a landmine in ${t[0]}`), 300))
            : ((o.Health = rint(2, 12)),
              (o.Happiness = rint(2, 10)),
              (o.Looks = Math.round(0.25 * o.Looks)),
              (o.Smarts = Math.round(0.6 * o.Smarts)),
              renderStats(),
              (a.perf = clamp(a.perf + 5)),
              say(
                `I stepped on a landmine in ${t[0]}. I suffered ${pickR(["a seared ear, split lips and a charred nostril", "a fried eyelid and an incinerated cheek, and lost an arm", "a seared kneecap and a mutilated chest", "a severed fist and a shattered jaw"])}.`,
              ),
              notice(
                "Wounded in action",
                `You stepped on a landmine in ${t[0]} and barely survived!`,
                null,
                !0,
              ));
        crimeSnd("BugleSuccess"),
          (a.perf = clamp(a.perf + rint(12, 22))),
          (o.Happiness = clamp(o.Happiness + rint(5, 10))),
          (a.deployed = (a.deployed || 0) + 1),
          renderStats(),
          (state.minesCleared = (state.minesCleared || 0) + 1);
        const s = pickR(["valor", "heroism", "bravery", "spunk"]);
        say(`I served my country by successfully completing a deployment to ${t[0]}.`),
          stateMedalEvent(s, t[0]);
      }
      function rankInsignia(e) {
        if (isOldEra()) return milLogo(e.c);
        const t = {
          Army: "army",
          Navy: "navy",
          "Air Force": "af",
          Marines: "marines",
          "Coast Guard": "navy",
        }[e.c];
        if (t) {
          const a = milOfficer(e);
          if (!a && 0 === e.rank) return `mil/${MIL_LOGO[e.c]}.png`;
          const o = `${t}-${a ? "o" : "e"}${e.rank + 1}`;
          return `mil/rank/${o}.${"navy-e4" === o || "navy-e5" === o ? "webp" : "png"}`;
        }
        const a = milOfficer(e),
          o = e.rank,
          n = MIL_SEA(e.c),
          s = (e) =>
            "data:image/svg+xml;utf8," +
            encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${e}</svg>`),
          r = "#e7b93c",
          i = "#c9ced6",
          l = "#6b4f12";
        if (!a) {
          if (0 === o)
            return s(
              `<rect x="14" y="14" width="36" height="36" rx="6" fill="${n ? "#1d3b6e" : "#3f4a2e"}"/><text x="32" y="39" font-family="Arial" font-weight="900" font-size="12" fill="${r}" text-anchor="middle">${n ? "SR" : "PVT"}</text>`,
            );
          const e = Math.min(3, 1 === o || 2 === o ? 1 : 3 === o ? 2 : 3),
            t = 2 === o ? 1 : o >= 5 ? Math.min(3, o - 4) : 0;
          let a = `<rect width="64" height="64" rx="10" fill="${n ? "#1d3b6e" : "#3f4a2e"}"/>`;
          for (let t = 0; t < e; t++)
            a += `<path d="M10 ${22 + 8 * t} L32 ${10 + 8 * t} L54 ${22 + 8 * t}" stroke="${r}" stroke-width="5.5" fill="none" stroke-linejoin="round"/>`;
          for (let e = 0; e < t; e++)
            a += `<path d="M12 ${40 + 7 * e} Q32 ${52 + 7 * e} 52 ${40 + 7 * e}" stroke="${r}" stroke-width="5" fill="none"/>`;
          return (
            o >= 8 &&
              (a += `<path d="M32 27l2.3 4.7 5.2.8-3.8 3.6.9 5.1L32 38.8l-4.6 2.4.9-5.1-3.8-3.6 5.2-.8z" fill="${r}"/>`),
            s(a)
          );
        }
        const c = (e, t) =>
            `<rect x="${e}" y="14" width="12" height="36" rx="2" fill="${t}" stroke="${l}" stroke-width="1"/>`,
          d = (e) =>
            `<path d="M32 8c10 8 16 16 12 28-2 6-7 9-12 12-5-3-10-6-12-12-4-12 2-20 12-28z" fill="${e}" stroke="${l}" stroke-width="1.2"/><path d="M32 14v40" stroke="${l}" stroke-width="1.5"/>`,
          u = [c(26, r), c(26, i), c(17, i) + c(35, i), d(r), d(i)];
        if (o < 5) return s(u[o]);
        if (5 === o)
          return s(
            `<path d="M6 30c8-4 14-4 18 2l8-14 8 14c4-6 10-6 18-2-6 6-12 10-18 10l-2 12h-12l-2-12c-6 0-12-4-18-10z" fill="${i}" stroke="#7b818b" stroke-width="1.2"/>`,
          );
        const h = Math.min(4, o - 5),
          p = 64 / (h + 0.4);
        return s(
          Array.from(
            { length: h },
            (e, t) =>
              `<path transform="translate(${p * (t + 0.7)} ${32}) scale(${h > 3 ? 0.95 : h > 2 ? 1.15 : 1.6})" d="M0-10l2.9 6 6.6.9-4.8 4.6 1.2 6.5L0 4.9l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z" fill="${i}" stroke="#7b818b" stroke-width=".8"/>`,
          ).join(""),
        );
      }
      milLadder = (e, t) => {
        const a = _milLadder(e, t),
          o = t ? MIL_OFF_PAY : MIL_ENL_PAY;
        return a.forEach((e, t) => (e.pay = o[Math.min(t, o.length - 1)])), a;
      };
      const milX = () => !(!mods.militaryExpanded || !isMil()),
        MOS = [
          [
            "rifleman",
            "Rifleman",
            "x-gun",
            [
              "Rifleman",
              "Automatic Rifleman",
              "Fire Team Leader",
              "Squad Leader",
              "Platoon Sergeant",
              "First Sergeant",
              "Sergeant Major",
            ],
            { Army: "11B", Marines: "0311", Navy: "MA", "Air Force": "3P0", "Coast Guard": "ME" },
          ],
          [
            "sniper",
            "Sniper",
            "x-bullseye",
            [
              "Sniper Candidate (PIG)",
              "Spotter (HOG)",
              "Sniper",
              "Sniper Team Leader",
              "Sniper Section Leader",
              "Sniper Instructor",
              "Master Sniper",
            ],
            { Army: "11B-B4", Marines: "0322", "Air Force": "1Z1" },
          ],
          [
            "sapper",
            "Sapper",
            "x-bomb",
            [
              "Combat Engineer",
              "Demolitions Specialist",
              "Breacher",
              "Sapper Team Leader",
              "Sapper Squad Leader",
              "Master Breacher",
            ],
            { Army: "12B", Marines: "1371", Navy: "EOD", "Air Force": "3E8" },
          ],
          [
            "radioman",
            "Radioman",
            "x-radio",
            [
              "Radio Operator (RTO)",
              "Senior RTO",
              "Commo Team Leader",
              "Signal Section Chief",
              "Communications Chief",
              "Signal Sergeant Major",
            ],
            { Army: "25C", Marines: "0621", Navy: "IT", "Air Force": "1D7", "Coast Guard": "OS" },
          ],
          [
            "tanker",
            "Tanker",
            "x-combat-helmet",
            [
              "Loader",
              "Driver",
              "Gunner",
              "Tank Commander",
              "Section Leader",
              "Tank Platoon Sergeant",
              "Master Gunner",
            ],
            { Army: "19K" },
          ],
          [
            "police",
            "Policeman",
            "x-policeman",
            [
              "Patrolman",
              "Desk Sergeant",
              "Team Leader",
              "Squad Leader",
              "Provost NCO",
              "CID Special Agent",
              "Provost Sergeant Major",
            ],
            { Army: "31B", Marines: "5811", Navy: "MA", "Air Force": "3P0", "Coast Guard": "ME" },
          ],
          [
            "medic",
            "Field Medic",
            "x-stethoscope",
            [
              "Medic Trainee",
              "Line Medic",
              "Senior Line Medic",
              "Platoon Medic",
              "Aid Station NCOIC",
              "Medical Platoon Sergeant",
              "Senior Medical NCO",
            ],
            { Army: "68W", Navy: "HM", "Air Force": "4N0", "Coast Guard": "HS" },
          ],
          [
            "intel",
            "Military Intelligence",
            "x-satellite",
            [
              "Junior Analyst",
              "Analyst",
              "Senior Analyst",
              "Intel Section NCOIC",
              "All-Source Fusion Chief",
              "Intelligence Sergeant Major",
            ],
            { Army: "35F", Marines: "0231", Navy: "IS", "Air Force": "1N0", "Coast Guard": "IS" },
          ],
          [
            "cyber",
            "Cyber Operations",
            "x-laptop",
            [
              "Cyber Operator Trainee",
              "Cyber Operator",
              "Senior Operator",
              "Team Lead",
              "Mission Element Lead",
              "Cyber Protection Team NCOIC",
            ],
            { Army: "17C", Marines: "1721", Navy: "CTN", "Air Force": "1B4", "Coast Guard": "CYB" },
          ],
          [
            "pilot",
            "Pilot",
            "x-helicopter",
            [
              "Student Pilot",
              "Copilot",
              "Aircraft Commander",
              "Flight Lead",
              "Instructor Pilot",
              "Squadron Commander",
              "Wing Commander",
            ],
            { Army: "153A", Marines: "7565", Navy: "1310", "Air Force": "11F", "Coast Guard": "1500" },
            !0,
          ],
        ],
        mosOf = (e) => e.mos && MOS.find((t) => t[0] === e.mos.key),
        mosRole = (e) => {
          const t = mosOf(e);
          return t ? t[3][Math.min(e.mos.step, t[3].length - 1)] : null;
        },
        mosCode = (e) => {
          const t = mosOf(e);
          return t ? t[4][e.c] : "";
        };
      function mosCard(e) {
        const t = state.job,
          a = MOS.filter((e) => e[4][t.c] && (!e[5] || milOfficer(t) || "Army" === t.c));
        (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div>\n      <div class="jm-tag" style="margin-top:12px">Military</div>\n      <h4><img src="mil/x-combat-helmet.png" alt=""><span>MOS</span></h4>\n      <div class="lead">${e ? "You can request to retrain into a new MOS." + (t.mos ? `<br><br>Your current MOS is ${mosOf(t)[1]} (${mosCode(t)}).` : "") : "You have an opportunity to choose your MOS!"}</div>\n      <label class="hr-lab">Pick your career type:</label>\n      <div class="hr-sel"><select id="mosPick">${a.map((e) => `<option value="${e[0]}"${t.mos && t.mos.key === e[0] ? " selected" : ""}>${e[1]} (${e[4][t.c]})</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="mosGo">${e ? "Request retraining" : "Choose my MOS"}</button></div>`),
          (ev.style.overflow = "visible");
        const o = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = o),
          (document.getElementById("mosGo").onclick = () => {
            const a = document.getElementById("mosPick").value,
              n = MOS.find((e) => e[0] === a);
            if ((o(), screen.classList.remove("open"), t.mos && t.mos.key === a))
              return notice(
                "MOS",
                `You are already ${/^[AEIOU]/.test(n[1]) ? "an" : "a"} ${n[1].toLowerCase()}.`,
                null,
                !0,
              );
            if (e && !chance(0.6 + t.perf / 250))
              return (
                (t.mosAsked = state.age),
                say(
                  `My request to retrain as ${/^[AEIOU]/.test(n[1]) ? "an" : "a"} ${n[1].toLowerCase()} was denied.`,
                ),
                notice("Request denied", "Your commanding officer denied your request to change MOS.")
              );
            if ("sniper" === a || "pilot" === a) {
              if (!chance((state.stats.Smarts + state.stats.Health) / 260 + 0.15))
                return (
                  say(`I failed ${"sniper" === a ? "sniper school" : "flight school"}.`),
                  notice(
                    "sniper" === a ? "Washed out" : "Grounded",
                    `You washed out of ${"sniper" === a ? "sniper school" : "flight school"}. You'll keep your current job for now.`,
                  )
                );
            }
            (t.mos = { key: a, step: 0, gap: rint(2, 3), yrs: 0 }),
              (t.mosAsked = state.age),
              renderAvatar(),
              say(
                `I ${e ? "retrained" : "was assigned"} as ${/^[AEIOU]/.test(n[1]) ? "an" : "a"} ${n[1].toLowerCase()} (MOS ${n[4][t.c]}).`,
              ),
              notice(
                "MOS",
                `You are now ${/^[AEIOU]/.test(n[3][0]) ? "an" : "a"} ${n[3][0]}!`,
                null,
                !0,
                `<table class="nt"><tr><td><b>MOS:</b> ${n[1]} (${n[4][t.c]})</td></tr><tr><td><b>Branch:</b> ${t.c}</td></tr></table>`,
              );
          }),
          evWrap.classList.add("open");
      }
      const SOF = [
        [
          "Green Berets",
          "Army",
          "sf-greenberets",
          "Special Forces Assessment & Selection",
          ["SFAS", "Robin Sage", "Q Course"],
          2,
          0.23,
        ],
        [
          "75th Ranger Regiment",
          "Army",
          "sf-rangers",
          "Ranger Assessment & Selection Program",
          ["RASP Phase 1", "RASP Phase 2", "Ranger School"],
          0,
          0.4,
        ],
        [
          "Delta Force",
          "Army",
          "x-skull-and-bones",
          "Delta Assessment & Selection",
          ["Land navigation", "The Long Walk", "Operator Training Course"],
          3,
          0.1,
        ],
        [
          "Navy SEALs",
          "Navy",
          "sf-seals",
          "BUD/S",
          ["First Phase", "Hell Week", "Dive Phase", "Land Warfare"],
          0,
          0.22,
        ],
        [
          "Marine Raiders",
          "Marines",
          "sf-raiders",
          "Assessment & Selection",
          ["A&S Phase 1", "A&S Phase 2", "Individual Training Course"],
          2,
          0.35,
        ],
        [
          "Pararescue",
          "Air Force",
          "sf-pararescue",
          "Pararescue Indoctrination",
          ["Indoc", "Combat Dive", "Paramedic Course"],
          0,
          0.2,
        ],
        [
          "Rescue Swimmers",
          "Coast Guard",
          "logo-coastguard",
          'AST "A" School',
          ["Pool Phase", "Open Water", "EMT Training"],
          0,
          0.3,
        ],
      ];
      function sofCard(e, t, a, o, n, s) {
        const r = state.job,
          i = s.req,
          l = state.stats,
          c = [
            [
              `Age ${i.age[0]}–${i.age[1]}`,
              state.age >= i.age[0] && state.age <= i.age[1],
              `you're ${state.age}`,
            ],
            [
              `Rank: ${r.ladder[o].t} or higher`,
              r.rank >= o,
              `you're ${((d = r.ladder[r.rank].t), /^[AEIOU]/i.test(d) ? "an" : "a")} ${r.ladder[r.rank].t}`,
            ],
            ...(i.yrs
              ? [
                  [
                    `${i.yrs}+ year${i.yrs > 1 ? "s" : ""} in service`,
                    Math.max(r.yrs || 0, r.payYears || 0) >= i.yrs,
                    `you have ${Math.max(r.yrs || 0, r.payYears || 0)}`,
                  ],
                ]
              : []),
            [i.test, l.Health >= i.health, `fitness ${l.Health}%, need ${i.health}%`],
            ["Aptitude score", l.Smarts >= i.smarts, `smarts ${l.Smarts}%, need ${i.smarts}%`],
            ...(i.prior
              ? [
                  [
                    `Come from ${i.prior.join(" or ")}`,
                    i.prior.includes(r.sf),
                    r.sf ? `you're in the ${r.sf}` : "you're regular military",
                  ],
                ]
              : []),
            ["Haven't tried out this year", r.sfTry !== state.age, "you already tried this year"],
          ];
        var d;
        const u = c.every((e) => e[1]);
        jCard({
          tag: "Military",
          iconSrc: `mil/${t}.png`,
          title: e,
          close: !0,
          lead: `${s.how}<br><br>About ${Math.round(100 * n)}% of candidates make it through.${u ? "" : "<br><br><b>You don't meet all the requirements yet.</b>"}`,
          rows: c.map(([e, t, a]) => [t ? "✅" : "❌", `${e}${t ? "" : ` <small>(${a})</small>`}`]),
          choices: u
            ? [
                ["Volunteer for selection", () => sofRun(e, t, a, n, s)],
                ["Not now", () => {}],
              ]
            : [["OK", () => {}]],
        });
      }
      function sofRun(e, t, a, o, n) {
        const s = state.job,
          r = state.stats,
          i = n.req;
        (s.sfTry = state.age),
          screen.classList.remove("open"),
          say(`I volunteered for ${a} to try out for the ${e}.`);
        const l = (r.Health - i.health) / 120 + (r.Smarts - i.smarts) / 240 + ((s.perf ?? 50) - 50) / 300,
          c = Math.pow(Math.max(0.05, o), 1 / n.stages.length);
        let d = 0;
        const u = () => {
          const o = n.stages[d];
          jCard({
            tag: e,
            iconSrc: `mil/${t}.png`,
            title: `${o.t} (${d + 1}/${n.stages.length})`,
            surprise: !0,
            lead: `${o.d}<br><br>What will you do?`,
            bars: [
              ["Health", r.Health],
              ["Happiness", r.Happiness],
            ],
            choices: [
              ...o.c.map(([i, h, p, m]) => [
                i,
                () => {
                  (r.Health = clamp(r.Health - rint(3, 9))),
                    (r.Happiness = clamp(r.Happiness - rint(0, 4))),
                    renderStats();
                  const i = /pool|surf|indoc|dive|open water|hell week/i.test(o.t),
                    f = /ruck|walk|land nav|forge|crucible/i.test(o.t);
                  if ((i || f) && chance((i ? 0.006 : 0.004) * (r.Health < 40 ? 2.5 : 1)))
                    return (
                      say(`I died during ${o.t} in ${a}.`),
                      setTimeout(
                        () => die(i ? `drowning during ${e} training` : `heat stroke during ${e} selection`),
                        300,
                      )
                    );
                  if (chance(0.05))
                    return (
                      say(`I got injured during ${o.t} and was medically dropped from ${a}.`),
                      setTimeout(
                        () =>
                          notice(
                            "Medical drop",
                            `${pickR(["A stress fracture in your shin", "A torn ligament in your knee", "Severe heat exhaustion", "Hypothermia"])} ended your selection during ${o.t}.<br><br>It's not your fault. You can try again next year.`,
                            null,
                            !0,
                          ),
                        60,
                      )
                    );
                  const g = Math.max(0.05, Math.min(0.97, c + 0.5 * l + h));
                  return chance(g)
                    ? ++d < n.stages.length
                      ? setTimeout(() => notice("Still in", p, () => setTimeout(u, 200), !0), 60)
                      : ((s.sf = e),
                        (s.pay = Math.round(1.25 * s.pay)),
                        (s.perf = clamp(s.perf + 15)),
                        crimeSnd("BugleSuccess"),
                        renderStats(),
                        say(`I made it through ${a} and joined the ${e}.`),
                        void setTimeout(
                          () =>
                            notice(
                              "Welcome to the team",
                              `${p}<br><br>${n.pass}`,
                              null,
                              !0,
                              `<img src="mil/${t}.png" alt="" style="width:64px;margin-top:12px">`,
                            ),
                          60,
                        ))
                    : (say(`I washed out of ${e} selection during ${o.t}.`),
                      setTimeout(
                        () =>
                          notice(
                            "Washed out",
                            `${m}<br><br>You were dropped from ${a}. You can try again next year.`,
                            null,
                            !0,
                          ),
                        60,
                      ));
                },
              ]),
              [
                n.quit,
                () =>
                  ((t) => {
                    (r.Happiness = clamp(r.Happiness - rint(3, 8))),
                      renderStats(),
                      say(`I quit ${e} selection during ${t.t}.`),
                      setTimeout(
                        () =>
                          notice(
                            n.quit,
                            `You chose to ${n.quit.toLowerCase()} during ${t.t}. ${"Navy SEALs" === e ? "Three rings of the bell, and it was over." : "Your selection is over."}<br><br>You can try again next year.`,
                            null,
                            !0,
                          ),
                        60,
                      );
                  })(o),
              ],
            ],
          });
        };
        setTimeout(u, 200);
      }
      function openSpecialForces() {
        const e = state.job;
        (sTitle.textContent = "MILITARY"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openJobScreen),
          (sList.innerHTML = SOF.map(([t, a, o], n) => {
            const s = a === e.c;
            return `<div class="row logo-row${s ? "" : " dis locked"}" data-sf="${n}"><img src="mil/${o}.png"><div class="t"><b>${t}</b><span>${e.sf === t ? "Your unit" : s ? a : `${a} only`}</span></div>${s ? DOTS : ""}</div>`;
          }).join("")),
          sList.querySelectorAll("[data-sf]").forEach(
            (t) =>
              (t.onclick = () => {
                if (t.classList.contains("dis")) return;
                const [a, o, n, s, r, i, l] = SOF[+t.dataset.sf];
                if (e.sf === a) return notice(a, `You are already a member of the ${a}.`, null, !0);
                const c = (window.SOF_DATA || {})[a];
                if (c) return sofCard(a, n, s, i, l, c);
                jCard({
                  tag: "Military",
                  iconSrc: `mil/${n}.png`,
                  title: a,
                  close: !0,
                  lead: `Try out for the ${a}! Only the toughest make it through ${s}.`,
                  rows: [
                    ["Selection", s],
                    ["Pass Rate", `${Math.round(100 * l)}%`],
                    ["Minimum Rank", e.ladder[i].t],
                  ],
                  bars: [
                    ["Your Health", state.stats.Health],
                    ["Performance", e.perf],
                  ],
                  choices: [
                    [
                      "Try out",
                      () => {
                        if (e.rank < i)
                          return notice(
                            "Not eligible",
                            `You must be at least ${/^[AEIOU]/.test(e.ladder[i].t) ? "an" : "a"} ${e.ladder[i].t} to try out for the ${a}.`,
                            null,
                            !0,
                          );
                        if (e.sfTry === state.age)
                          return notice("Not eligible", "You already tried out this year.", null, !0);
                        (e.sfTry = state.age), screen.classList.remove("open");
                        const t = Math.pow(
                          Math.min(0.97, l * (0.6 + state.stats.Health / 120 + e.perf / 300)),
                          1 / r.length,
                        );
                        let o = 0;
                        const c = () =>
                          jCard({
                            tag: "Military",
                            iconSrc: `mil/${n}.png`,
                            title: r[o],
                            surprise: !0,
                            lead: `${s}: ${r[o]}.<br><br>${pickR(["Your body is screaming at you to stop.", "Half your class has already quit.", "The instructors are trying to break you.", "You haven't slept in days."])}<br><br>What will you do?`,
                            choices: [
                              [
                                "Push through",
                                () => (
                                  (state.stats.Health = clamp(state.stats.Health - rint(2, 8))),
                                  renderStats(),
                                  chance(t)
                                    ? ++o < r.length
                                      ? setTimeout(c, 300)
                                      : ((e.sf = a),
                                        (e.pay = Math.round(1.25 * e.pay)),
                                        (e.perf = clamp(e.perf + 15)),
                                        crimeSnd("BugleSuccess"),
                                        renderStats(),
                                        say(`I made it through ${s} and joined the ${a}!`),
                                        void notice(
                                          "Welcome to the team",
                                          `You made it through ${s}! You are now a member of the ${a}.`,
                                          null,
                                          !0,
                                          `<img src="mil/${n}.png" alt="" style="width:64px;margin-top:12px">`,
                                        ))
                                    : (say(`I washed out of ${a} selection during ${r[o]}.`),
                                      notice(
                                        "Washed out",
                                        `You couldn't make it through ${r[o]} and were dropped from ${s}.`,
                                      ))
                                ),
                              ],
                              [
                                "Navy SEALs" === a ? "Ring the bell" : "Quit",
                                () => {
                                  say(`I quit ${a} selection during ${r[o]}.`),
                                    notice(
                                      "Quit",
                                      `You ${"Navy SEALs" === a ? "rang the bell" : "quit"} during ${r[o]}.`,
                                    );
                                },
                              ],
                            ],
                          });
                        c();
                      },
                    ],
                  ],
                });
              }),
          ),
          (sList.scrollTop = 0);
      }
      const WARS = [
          ["Operation Enduring Freedom", "Afghanistan", "af"],
          ["Operation Iraqi Freedom", "Iraq", "iq"],
          ["Operation Inherent Resolve", "Syria", "sy"],
          ["Operation Freedom's Sentinel", "Afghanistan", "af"],
          ["Operation Desert Storm", "Kuwait", "kw"],
          ["Operation Gothic Serpent", "Somalia", "et"],
          ["Operation Iron Vigil", "Ukraine", "ua"],
          ["Operation Desert Lantern", "Jordan", "jo"],
          ["Operation Pacific Trident", "Philippines", "ph"],
        ].filter((e) => "et" !== e[2]),
        BATTLES = {
          sniper: [
            [
              "Overwatch",
              "An enemy commander is 900 meters out and the wind is gusting.",
              ["Take the shot", "Wait for the wind to die", "Call it in to command"],
            ],
          ],
          medic: [
            [
              "Man down!",
              "A soldier in your squad is down in the open and bleeding badly.",
              ["Sprint to him under fire", "Wait for covering fire", "Call for a medevac"],
            ],
          ],
          sapper: [
            [
              "IED",
              "Your convoy has stopped. There is a suspected IED buried in the road ahead.",
              ["Disarm it yourself", "Blow it in place", "Find another route"],
            ],
          ],
          tanker: [
            [
              "Armor ambush",
              "Enemy anti-tank teams are dug in along a ridge.",
              ["Charge the ridge", "Fire from cover", "Pull back and call artillery"],
            ],
          ],
          radioman: [
            [
              "Danger close",
              "Your platoon is pinned down. You can call in an airstrike, but it would be very close.",
              ["Call it in, danger close", "Call in artillery further out", "Relay a retreat order"],
            ],
          ],
          police: [
            [
              "Detainees",
              "You are guarding a compound full of detainees when a riot breaks out.",
              ["Restore order by force", "Negotiate", "Lock it down and wait"],
            ],
          ],
          intel: [
            [
              "Intercept",
              "You intercepted chatter about an ambush on a friendly patrol.",
              ["Warn the patrol", "Track the source", "Report it up the chain"],
            ],
          ],
          cyber: [
            [
              "Network attack",
              "The enemy is jamming your unit's communications.",
              ["Hack back", "Reroute the network", "Shut it all down"],
            ],
          ],
          pilot: [
            [
              "Close air support",
              "Troops in contact are calling for air support under heavy anti-aircraft fire.",
              ["Make a low strafing run", "Drop from high altitude", "Abort and return to base"],
            ],
          ],
          rifleman: [
            [
              "Ambush",
              "Your patrol walks straight into an ambush in a narrow valley.",
              ["Return fire and push forward", "Take cover and hold", "Fall back"],
            ],
          ],
        };
      BATTLES.generic = BATTLES.rifleman;
      const WAR_EVENTS = [
          {
            t: "Mortar Rain",
            d: "Mortar rounds start landing inside the wire at 0300. The bunker is 40 meters away.",
            c: [
              {
                l: "Sprint for the bunker",
                b: 0.5,
                w: "You dove into the bunker as a round hit where you had been standing.",
                f: "You tripped over a tent stake and ate dirt while shrapnel whistled overhead.",
              },
              {
                l: "Drag the new guy with you",
                b: 0.9,
                w: "You hauled the frozen private into the bunker with you. He owes you his life.",
                f: "You both got caught in the open and had to crawl the last 20 meters.",
              },
              {
                l: "Stay flat in your cot",
                b: 0.2,
                w: "You stayed low and the barrage walked past your tent.",
                f: "A round landed close enough to shred your tent and your nerves.",
              },
            ],
          },
          {
            t: "Sniper in the Minaret",
            d: "A sniper has your squad pinned behind a low wall. Rounds keep chipping the stone above your head.",
            c: [
              {
                l: "Throw smoke and rush him",
                b: 1,
                w: "You cleared the stairwell and the shooting stopped for good.",
                f: "The smoke drifted the wrong way and you had to dive back behind the wall.",
              },
              {
                l: "Call in a gun team",
                b: 0.4,
                w: "The machine gun suppressed the window long enough to call it in.",
                f: "The gun team got pinned down too. It took hours to get out.",
              },
              {
                l: "Wait for dark",
                b: 0.1,
                w: "You slipped away after sunset. Everyone made it.",
                f: "Night came slow. The sniper kept everyone pinned until dawn.",
              },
            ],
          },
          {
            t: "Ambush at the Bridge",
            d: "Your convoy is stopped on a narrow bridge when RPG fire hits the lead truck.",
            c: [
              {
                l: "Push through the kill zone",
                b: 0.9,
                w: "Your driver floored it and the convoy punched through.",
                f: "The burning truck blocked the road and the convoy had to fight its way out.",
              },
              {
                l: "Dismount and return fire",
                b: 0.7,
                w: "Your squad flanked the ambush and the enemy scattered.",
                f: "The enemy had the high ground. You traded fire for an hour.",
              },
              {
                l: "Reverse off the bridge",
                b: 0.3,
                w: "You backed out before the second volley hit.",
                f: "The rear truck stalled and you were stuck in the open.",
              },
            ],
          },
          {
            t: "Sandstorm Patrol",
            d: "A sandstorm rolls in during a foot patrol. Visibility drops to five feet and the radio is crackling.",
            c: [
              {
                l: "Keep moving to the objective",
                b: 0.7,
                w: "You navigated by compass and hit the objective on time.",
                f: "You got turned around and walked straight toward enemy territory.",
              },
              {
                l: "Circle up and wait it out",
                b: 0.2,
                w: "The squad huddled together until it passed. Nobody got lost.",
                f: "Two soldiers wandered off and the whole squad had to search for them.",
              },
              {
                l: "Head back to the vehicles",
                b: 0.4,
                w: "You found the trucks by the sound of their idling engines.",
                f: "The vehicles had moved. You spent the night in a ditch.",
              },
            ],
          },
          {
            t: "Village Standoff",
            d: "Armed men block the road into a village. They say they are local militia, not the enemy.",
            c: [
              {
                l: "Talk to their leader",
                b: 0.5,
                w: "You shared tea and learned where the enemy was hiding.",
                f: "The talks broke down and someone fired a warning shot.",
              },
              {
                l: "Demand they disarm",
                b: 0.8,
                w: "They lowered their weapons and let your patrol through.",
                f: "They refused, and a tense standoff lasted for hours.",
              },
              {
                l: "Go around the village",
                b: 0.2,
                w: "You avoided the confrontation entirely.",
                f: "The detour led you straight into a minefield marker. You backed out slowly.",
              },
            ],
          },
          {
            t: "Downed Helicopter",
            d: "A helicopter went down two kilometers away. The crew is alive and enemy fighters are closing in.",
            c: [
              {
                l: "Lead the rescue team",
                b: 1,
                w: "You reached the crash site first and held it until the extraction bird landed.",
                f: "Enemy fire forced your team into a building halfway there.",
              },
              {
                l: "Set up a blocking position",
                b: 0.6,
                w: "Your squad held the road and stopped the enemy from reaching the crash.",
                f: "The enemy found another route. The fight got close.",
              },
              {
                l: "Guide the drone overhead",
                b: 0.2,
                w: "You talked the drone onto the enemy fighters before they got close.",
                f: "The drone lost its link at the worst possible moment.",
              },
            ],
          },
          {
            t: "IED on the Main Road",
            d: "Your lead vehicle spots a suspicious mound of dirt and a wire running into the brush.",
            c: [
              {
                l: "Follow the wire",
                b: 0.9,
                w: "You found the trigger man and he surrendered without a fight.",
                f: "The wire led to a booby trap. You froze just in time.",
              },
              {
                l: "Call EOD and wait",
                b: 0.2,
                w: "EOD blew it in place. The road was clear by noon.",
                f: "The wait took six hours in the sun and the convoy took sniper fire.",
              },
              {
                l: "Detour through the field",
                b: 0.5,
                w: "The detour was clean. You reached the outpost on time.",
                f: "One truck bogged down in the mud and you had to dig it out under fire.",
              },
            ],
          },
          {
            t: "Night Raid",
            d: "Intel says a high-value target is sleeping in a compound tonight. Your team is stacked on the door.",
            c: [
              {
                l: "Be the first through",
                b: 1,
                w: "You cleared the first room in seconds. The target was captured alive.",
                f: "The door was barricaded and you lost the element of surprise.",
              },
              {
                l: "Cover the windows",
                b: 0.5,
                w: "Two fighters tried to flee out the back. You stopped them.",
                f: "Someone slipped out a side window you could not see.",
              },
              {
                l: "Hold the perimeter",
                b: 0.2,
                w: "The perimeter stayed quiet. The raid went off cleanly.",
                f: "A truck full of fighters showed up and your perimeter got lit up.",
              },
            ],
          },
          {
            t: "Friendly Fire",
            d: "A nearby friendly unit mistakes your patrol for the enemy and opens fire.",
            c: [
              {
                l: "Pop a recognition flare",
                b: 0.6,
                w: "The firing stopped instantly. A very embarrassed lieutenant apologized.",
                f: "The flare was a dud. You had to crawl to cover.",
              },
              {
                l: "Scream into the radio",
                b: 0.3,
                w: "Your call got through and the guns went quiet.",
                f: "Everyone was on a different frequency. It took far too long to stop.",
              },
              {
                l: "Run toward them waving",
                b: 1,
                w: "They recognized your uniform. You may have saved several lives.",
                f: "A round snapped past your ear before they figured it out.",
              },
            ],
          },
          {
            t: "Outpost Overrun",
            d: "Dozens of fighters are breaching the walls of your remote outpost.",
            c: [
              {
                l: "Man the heavy machine gun",
                b: 1,
                w: "You held the breach alone until reinforcements arrived.",
                f: "The gun jammed at the worst moment and you fell back to the inner wall.",
              },
              {
                l: "Call danger-close artillery",
                b: 0.7,
                w: "The rounds landed right on the wall. The attack collapsed.",
                f: "The artillery took too long. The fight went hand to hand.",
              },
              {
                l: "Fall back to the keep",
                b: 0.3,
                w: "You consolidated in the strongest building and held.",
                f: "The fall back turned into chaos and two soldiers got separated.",
              },
            ],
          },
          {
            t: "Water Running Out",
            d: "Resupply is three days late. Your platoon has one day of water left in 115-degree heat.",
            c: [
              {
                l: "Raid the enemy well",
                b: 0.9,
                w: "You took the well and filled every canteen.",
                f: "The well was guarded better than you thought.",
              },
              {
                l: "Ration it hard",
                b: 0.2,
                w: "Everyone stayed hydrated enough until the helicopter showed up.",
                f: "Two soldiers collapsed from heat stroke before resupply came.",
              },
              {
                l: "Trade with the locals",
                b: 0.4,
                w: "A farmer traded you water for cigarettes and MREs.",
                f: "The water was contaminated. Half the platoon got sick.",
              },
            ],
          },
          {
            t: "Hostages in the School",
            d: "Insurgents have taken a school full of children. Command wants an assault plan within the hour.",
            c: [
              {
                l: "Volunteer for the breach",
                b: 1,
                w: "You breached through the roof. Every child got out alive.",
                f: "The breach went loud early. The rescue took far longer than planned.",
              },
              {
                l: "Snipe from the water tower",
                b: 0.6,
                w: "You took out the guard at the door at the exact right moment.",
                f: "The angle was wrong. You could not get a clean shot.",
              },
              {
                l: "Help negotiate",
                b: 0.2,
                w: "The negotiator got half the kids released before the assault.",
                f: "The insurgents stopped answering the phone.",
              },
            ],
          },
          {
            t: "Chemical Alarm",
            d: "The chemical alarm screams. Someone shouts GAS GAS GAS. Your mask is in your pack.",
            c: [
              {
                l: "Mask up in 9 seconds",
                b: 0.3,
                w: "You sealed your mask in record time. It was a false alarm.",
                f: "Your mask fogged and you panicked for a few long seconds.",
              },
              {
                l: "Mask a buddy first",
                b: 0.9,
                w: "You got your buddy masked before yourself. Nobody was hurt.",
                f: "You breathed in a whiff of something awful before sealing up.",
              },
              {
                l: "Hold your breath and run",
                b: 0.6,
                w: "You got upwind of the cloud. Smart thinking.",
                f: "You ran straight into the cloud.",
              },
            ],
          },
          {
            t: "Ammo Depot Fire",
            d: "A fire breaks out in the ammunition depot. Rounds are cooking off like popcorn.",
            c: [
              {
                l: "Fight the fire",
                b: 1,
                w: "You got the fire under control before the main stockpile went up.",
                f: "A crate exploded nearby and knocked you off your feet.",
              },
              {
                l: "Evacuate the area",
                b: 0.3,
                w: "You cleared everyone out before the big blast.",
                f: "The evacuation was slow and the blast shattered every window on base.",
              },
              {
                l: "Move the fuel truck",
                b: 0.8,
                w: "You drove the fuel truck away from the fire just in time.",
                f: "The truck stalled halfway. You ran for your life.",
              },
            ],
          },
          {
            t: "Lost Patrol",
            d: "Another squad went silent six hours ago. Their last position was near a cave network.",
            c: [
              {
                l: "Search the caves",
                b: 1,
                w: "You found them trapped by a rockfall and dug them out.",
                f: "The caves were a maze. You barely found your way back out.",
              },
              {
                l: "Search from the air",
                b: 0.3,
                w: "The helicopter spotted their signal mirror.",
                f: "Clouds rolled in and the search was called off for the night.",
              },
              {
                l: "Interrogate a captured fighter",
                b: 0.5,
                w: "He told you where they were. Everyone got home.",
                f: "He lied. You wasted a day in the wrong valley.",
              },
            ],
          },
          {
            t: "Suicide Vehicle",
            d: "A car is speeding toward the checkpoint and ignoring every warning signal.",
            c: [
              {
                l: "Shoot the engine block",
                b: 0.7,
                w: "The car rolled to a stop 50 meters out. It was packed with explosives.",
                f: "Your shots missed the engine. Everyone dove for cover.",
              },
              {
                l: "Lower the barrier spikes",
                b: 0.4,
                w: "The spikes shredded its tires. The driver bailed out.",
                f: "The spikes jammed half-raised.",
              },
              {
                l: "Clear the civilians",
                b: 0.9,
                w: "You pushed the crowd back seconds before the car detonated.",
                f: "The blast threw you into a wall.",
              },
            ],
          },
          {
            t: "Prisoner Escape",
            d: "Three detainees overpowered a guard and are running for the perimeter fence.",
            c: [
              {
                l: "Tackle the leader",
                b: 0.8,
                w: "You brought him down before he reached the fence.",
                f: "He was bigger than you thought. You took an elbow to the face.",
              },
              {
                l: "Fire warning shots",
                b: 0.3,
                w: "They froze and put their hands up.",
                f: "They kept running. One escaped into the night.",
              },
              {
                l: "Sound the alarm",
                b: 0.2,
                w: "The quick reaction force rounded them up in minutes.",
                f: "The alarm was broken. Chaos followed.",
              },
            ],
          },
          {
            t: "Flash Flood",
            d: "A flash flood is roaring down the dry riverbed where your vehicles are parked.",
            c: [
              {
                l: "Drive them out",
                b: 0.8,
                w: "You got every truck up the bank as the water hit.",
                f: "One truck got swept downstream with all your gear.",
              },
              {
                l: "Climb to high ground",
                b: 0.2,
                w: "Everyone made it up the cliff safely.",
                f: "The climb was brutal and someone broke an ankle.",
              },
              {
                l: "Save the radio gear",
                b: 0.6,
                w: "You grabbed the radios just before the water arrived.",
                f: "You got knocked down by the current and lost your rifle.",
              },
            ],
          },
          {
            t: "Drone Strike Request",
            d: "You spot fighters loading weapons into a truck, but there is a house full of people right next to it.",
            c: [
              {
                l: "Call the strike anyway",
                b: 0.7,
                w: "The precision strike hit only the truck. The house was spared.",
                f: "The strike damaged the house. There will be an investigation.",
              },
              {
                l: "Wait for the truck to move",
                b: 0.3,
                w: "The truck drove into the open and the strike was clean.",
                f: "The truck disappeared into the city.",
              },
              {
                l: "Lead a ground team instead",
                b: 1,
                w: "You seized the weapons without firing a shot at the house.",
                f: "The fighters spotted you coming and opened fire.",
              },
            ],
          },
          {
            t: "Wounded Enemy",
            d: "An enemy fighter lies wounded in the road, begging for help. His friends could be watching.",
            c: [
              {
                l: "Treat him",
                b: 0.7,
                w: "You saved his life. He later gave up his whole cell.",
                f: "His friends opened fire while you were treating him.",
              },
              {
                l: "Call the medic up",
                b: 0.4,
                w: "The medic stabilized him and he was taken prisoner.",
                f: "It took too long. He did not make it.",
              },
              {
                l: "Leave him and push on",
                b: 0.2,
                w: "You kept the patrol moving. Nobody else was hurt.",
                f: "It turned out to be bait. The ambush came anyway.",
              },
            ],
          },
          {
            t: "Rooftop Firefight",
            d: "Your squad is on a rooftop when fighters start shooting from three directions at once.",
            c: [
              {
                l: "Throw grenades over the edge",
                b: 0.8,
                w: "The grenades silenced two positions.",
                f: "One grenade bounced back. Everyone hit the deck.",
              },
              {
                l: "Jump to the next roof",
                b: 1,
                w: "You leapt the gap and flanked the third position.",
                f: "You came up short and hung off the ledge.",
              },
              {
                l: "Stay low and call air",
                b: 0.3,
                w: "Helicopters arrived and ended the fight.",
                f: "Air support was tied up somewhere else.",
              },
            ],
          },
          {
            t: "Food Poisoning",
            d: "Half your platoon got food poisoning from local goat meat the night before a big operation.",
            c: [
              {
                l: "Go out anyway",
                b: 0.7,
                w: "You toughed it out and completed the mission. Legendary.",
                f: "You threw up on your own boots during the briefing.",
              },
              {
                l: "Ask to postpone",
                b: 0.2,
                w: "Command agreed. Everyone recovered by morning.",
                f: "Command said no. It was a miserable night.",
              },
              {
                l: "Blame the cook",
                b: 0.4,
                w: "The cook got reassigned. The food got better.",
                f: "It was actually your fault. You bought the goat.",
              },
            ],
          },
          {
            t: "Tank Column",
            d: "An enemy tank column is rolling toward your position. You have two anti-tank missiles left.",
            c: [
              {
                l: "Fire on the lead tank",
                b: 1,
                w: "You knocked out the lead tank and the column stalled.",
                f: "The missile hit a decoy. The column kept coming.",
              },
              {
                l: "Call the jets",
                b: 0.4,
                w: "Jets arrived and turned the column into scrap.",
                f: "The jets were twenty minutes out.",
              },
              {
                l: "Blow the bridge",
                b: 0.7,
                w: "The bridge collapsed and the tanks were stuck on the far side.",
                f: "The charge only cracked the bridge.",
              },
            ],
          },
          {
            t: "Mail Call",
            d: "In the middle of a firefight lull, a helicopter drops off mail. There is a letter from home.",
            c: [
              {
                l: "Read it right now",
                b: 0.5,
                w: "It was good news from home. It got you through the rest of the tour.",
                f: "Bad news. You had to keep fighting with a heavy heart.",
              },
              {
                l: "Save it for later",
                b: 0.2,
                w: "You read it that night. Perfect timing.",
                f: "It got soaked in the rain before you could read it.",
              },
              {
                l: "Read it to the squad",
                b: 0.7,
                w: "Your mom's cookies recipe made everyone laugh.",
                f: "It was a breakup letter. Everyone heard it.",
              },
            ],
          },
          {
            t: "Last Day of the Tour",
            d: "It is your last day before going home. A final patrol is scheduled through the worst part of {country}.",
            c: [
              {
                l: "Lead the patrol",
                b: 0.9,
                w: "You led one last patrol and brought every soldier home.",
                f: "It turned into a firefight on your last day. Of course it did.",
              },
              {
                l: "Volunteer for base duty",
                b: 0.2,
                w: "You spent the day packing. Nobody blamed you.",
                f: "The base got rocketed anyway.",
              },
              {
                l: "Ask the new guys to go",
                b: 0.4,
                w: "The new guys handled it fine.",
                f: "They got lost. You had to go get them.",
              },
            ],
          },
        ],
        warYearOf = () => state.birthYear + state.age;
      function activeWars() {
        const e = warYearOf(),
          t = state.country;
        return (window.WAR_TIMELINE || []).filter((a) => {
          const o = (a.years && a.years[t]) || [a.from, a.to];
          return (
            !(e < o[0] || e > o[1]) && ("any" === a.who ? !(a.not || []).includes(t) : a.who.includes(t))
          );
        });
      }
      const warOp = (e) => (e.op && (e.op[state.country] || e.op.default)) || e.name,
        warFoe = (e) => (e.enemy && (e.enemy[state.country] || e.enemy.default)) || "enemy forces",
        warIcon = (e) => (e.flag ? `flags/${e.flag}.png` : "mil/x-fire.png"),
        warDanger = (e) =>
          e >= 1.3 ? "Extreme" : e >= 1 ? "High" : e >= 0.7 ? "Moderate" : e >= 0.4 ? "Low" : "Very low";
