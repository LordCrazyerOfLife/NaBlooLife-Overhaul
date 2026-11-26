      function openWar() {
        const e = state.job,
          t = warYearOf(),
          a = (COUNTRIES[state.country] || ["your country"])[0];
        if (e.warYear === state.age)
          return notice("War", "You've already served a combat tour this year.", null, !0);
        const o = activeWars();
        if (!o.length)
          return notice(
            "No active wars",
            `${a} isn't fighting any wars or sending troops anywhere in ${t}.<br><br>Check back in another year. Things can change fast.`,
            null,
            !0,
          );
        jCard({
          tag: "Military",
          iconSrc: "mil/x-fire.png",
          title: `Active Conflicts · ${t}`,
          close: !0,
          lead: `These are the conflicts ${a} is involved in right now. Which one will you volunteer for?`,
          choices: o
            .slice(0, 6)
            .map((e) => [`${warOp(e)} (${e.place})`, () => setTimeout(() => warBrief(e), 60)]),
        });
      }
      function warBrief(e) {
        const t = state.job,
          a = warYearOf(),
          o = (e.years && e.years[state.country]) || [e.from, e.to],
          n = a - o[0],
          s = o[1] >= 2026;
        jCard({
          tag: "Military",
          iconSrc: warIcon(e),
          title: warOp(e),
          close: () => openWar(),
          lead: `${e.desc}${e.volunteer ? "" : "<br><br>" + (0 === n ? "This conflict started this year." : `This has been going on for ${n} year${n > 1 ? "s" : ""}.`)}`,
          rows: [
            ["Conflict", e.name],
            ["Where", e.place],
            ["Fighting", warFoe(e)],
            ["Your role", e.peace ? "UN peacekeeper" : e.role],
            ["Years", `${o[0]}–${s ? "ongoing" : o[1]}`],
            ["Danger", warDanger(e.risk)],
          ],
          choices: [
            [
              e.peace ? "Deploy as a peacekeeper" : e.volunteer ? "Volunteer to fight" : "Deploy",
              () => {
                (t.warYear = state.age),
                  screen.classList.remove("open"),
                  warCampaign([warOp(e), e.place, e.flag || "x", e.risk, e]);
              },
            ],
            ["Back", () => setTimeout(openWar, 60)],
          ],
        });
      }
      function warCampaign([e, t, a, o = 1, n = null]) {
        const s = state.job,
          r = state.stats,
          i = !!s.sf,
          l = mosOf(s),
          c = BATTLES[l ? l[0] : "generic"] || BATTLES.generic,
          d = { battles: 4, k: 0, won: 0, valor: 0, wounded: !1 },
          u = new Set();
        crimeSnd("BugleCharge"), say(`I volunteered for a combat tour in ${t} for ${e}.`);
        const h = () => {
            if (d.k >= d.battles) return p();
            let m;
            if (l && chance(0.25)) {
              const [e, t, a] = pickR(c);
              m = {
                t: e,
                d: t,
                c: a.map((e, t) => ({
                  l: e,
                  b: [1, 0.55, 0.2][t],
                  w: pickR([
                    "Your actions turned the fight.",
                    "The enemy retreated.",
                    "You completed the objective.",
                  ]),
                  f: pickR([
                    "The enemy held their ground.",
                    "Your unit had to fall back.",
                    "The mission failed.",
                  ]),
                })),
              };
            } else {
              const e = WAR_EVENTS.concat(window.WAR_EVENTS_EXTRA || []),
                t = e.filter((e) => !u.has(e.t));
              (m = pickR(t.length ? t : e)), u.add(m.t);
            }
            d.k++;
            const f = (a) => a.replace(/\{country\}/g, t).replace(/\{op\}/g, e),
              g = (e) => {
                "shot" === e
                  ? [0, 140, 330, 520].forEach((e) => setTimeout(() => crimeSnd("Gunshot"), e))
                  : "boom" === e && crimeSnd("MineExplosion");
              };
            g(m.snd),
              jCard({
                tag: "Military",
                iconSrc: "x" === a ? "mil/x-fire.png" : `flags/${a}.png`,
                title: `${m.t} (${d.k}/${d.battles})`,
                surprise: !0,
                lead: `${e} · ${t}${n ? ` · vs ${warFoe(n)}` : ""}<br><br>${f(m.d)}<br><br>What will you do?`,
                choices: m.c.map((e) => [
                  e.l,
                  () => {
                    const a = e.b,
                      n = chance(0.4 + (i ? 0.15 : 0) + (l ? 0.03 * s.mos.step : 0) + 0.15 * (1 - a)),
                      c = a * (n ? 0.1 : 0.32) + 0.03;
                    return (
                      n && (d.won++, (d.valor += 1 + 2 * a), (s.perf = clamp(s.perf + rint(2, 5)))),
                      "shot" === m.snd && setTimeout(() => g("shot"), 150),
                      e.k && m.cause && chance(Math.min(0.5, e.k * o * (i ? 0.7 : 1) * (n ? 0.5 : 1.5)))
                        ? (say(`I was killed in ${t}: ${m.cause}.`),
                          setTimeout(() => die(`${m.cause} in ${t}`), 300))
                        : chance(Math.min(0.9, c * o))
                          ? chance(i ? 0.12 : 0.18)
                            ? (say(`I was killed in action in ${t}.`),
                              setTimeout(() => die(`being killed in action in ${t}`), 300))
                            : ((d.wounded = !0),
                              hurt(),
                              (r.Health = clamp(r.Health - rint(15, 40))),
                              (r.Happiness = clamp(r.Happiness - rint(5, 15))),
                              renderStats(),
                              say(`I was wounded in action in ${t}.`),
                              notice(
                                "Wounded in action",
                                `${f(n ? e.w : e.f)}<br><br>You were wounded in the fighting.`,
                                () => setTimeout(h, 250),
                              ))
                          : (say(
                              f(n ? e.w : e.f)
                                .replace(/\bYou\b/g, "I")
                                .replace(/\byour\b/g, "my")
                                .replace(/\bYour\b/g, "My")
                                .replace(/\byou\b/g, "me"),
                            ),
                            void notice(n ? "Survived" : "Setback", f(n ? e.w : e.f), () =>
                              setTimeout(h, 250),
                            ))
                    );
                  },
                ]),
              });
          },
          p = () => {
            const o = [],
              n = d.valor / d.battles;
            d.wounded && o.push("Purple Heart"),
              d.won === d.battles && n >= 2.7 && d.wounded && chance(0.08)
                ? o.push("Medal of Honor")
                : d.won === d.battles && n >= 2.4 && chance(0.35)
                  ? o.push(chance(0.3) ? "Distinguished Service Cross" : "Silver Star")
                  : n >= 1.8 && d.won >= 2 && chance(0.6)
                    ? o.push("Bronze Star")
                    : d.won && o.push(branchMedal("Achievement Medal", s.c)),
              o.forEach((a) =>
                awardMedal(a, {
                  where: t,
                  why: "Purple Heart" === a ? "wounds received in action" : "valor in combat",
                  op: e,
                }),
              ),
              (s.perf = clamp(s.perf + 3 * d.won)),
              (s.tours = (s.tours || 0) + 1),
              crimeSnd("BugleSuccess"),
              say(`I came home from ${e}${o.length ? ` with the ${o.join(" and the ")}` : ""}.`);
            const r = (a) => {
              if (a >= o.length) return;
              const n = o[a];
              setTimeout(
                () =>
                  jCard({
                    tag: "Award",
                    iconSrc: "mil/x-flag-us.png",
                    title: n,
                    lead: `${"Purple Heart" === n ? `For wounds received in action in ${t}` : `For ${"Medal of Honor" === n ? "conspicuous gallantry above and beyond the call of duty" : "heroism"} during ${e}`}, you have been awarded the ${n}.<div class="award-img"><img src="mil/${MEDALS[n][0]}.png" alt=""></div>`,
                    ok: () => r(a + 1),
                  }),
                300,
              );
            };
            jCard({
              tag: "Military",
              iconSrc: `flags/${a}.png`,
              title: "Tour Complete",
              lead:
                `Your tour in ${t} for ${e} is over. Welcome home!` +
                (o.length
                  ? `<div class="award-row">${o.map((e) => `<img src="mil/${MEDALS[e][0]}.png" alt="" title="${e}">`).join("")}</div>`
                  : ""),
              rows: [
                ["Battles Survived", `${d.k}/${d.battles}`],
                ["Battles Won", `${d.won}/${d.battles}`],
                ["Wounded", d.wounded ? "Yes" : "No"],
                ["Awards", o.length ? o.join(", ") : "None"],
              ],
              ok: () => r(0),
            });
          };
        h();
      }
      const MEV_ICON = {
          fire: "x-fire",
          gun: "x-gun",
          bomb: "x-bomb",
          radio: "x-radio",
          helicopter: "x-helicopter",
          jet: "x-jet",
          satellite: "x-satellite",
          laptop: "x-laptop",
          stethoscope: "x-stethoscope",
          policeman: "x-policeman",
          map: "x-map",
          compass: "x-compass",
          tent: "x-tent",
          skull: "x-skull-and-bones",
          star: "x-star",
          flag: "x-flag-us",
          medal: "medal-silverstar",
          helmet: "x-combat-helmet",
          trident: "x-trident",
          dagger: "x-dagger",
          eagle: "x-eagle",
          swords: "crossed-swords",
          bullseye: "x-bullseye",
          ambulance: "x-ambulance",
          recycle: "x-recycle",
        },
        milTier = (e) =>
          milOfficer(e) ? (e.rank >= 4 ? "senior" : "officer") : e.rank >= 4 ? "nco" : "junior",
        branchMedal = (e, t) =>
          /Achievement|Commendation/.test(e)
            ? "Army" === t
              ? "Army Commendation Medal"
              : "Air Force" === t
                ? "Air Force Achievement Medal"
                : "Navy & Marine Achievement Medal"
            : e;
      function milEventRoll() {
        const e = state.job,
          t = window.MIL_EVENTS || {},
          a = milTier(e),
          o = (e.sf && t[e.sf] && chance(0.7) ? t[e.sf] : t.general || []).filter(
            (t) => (t.tier === a || "any" === t.tier) && !(e.seenEv || []).includes(t.t),
          );
        if (!o.length) return !1;
        const n = pickR(o);
        return (e.seenEv ||= []).push(n.t), setTimeout(() => whenClear(() => runMilEvent(n)), 500), !0;
      }
      function runMilEvent(e) {
        const t = state.job;
        if (!t || !isMil()) return;
        const a = t.coworkers && t.coworkers.length ? pickR(t.coworkers) : null,
          o = t.boss ? t.boss.title || `${t.boss.first} ${t.boss.last}` : "your commanding officer",
          n = (e) =>
            (e || "")
              .replace(/\{name\}/g, document.getElementById("pname").textContent)
              .replace(/\{rank\}/g, t.t)
              .replace(/\{unit\}/g, t.sf || `the ${t.c}`)
              .replace(/\{branch\}/g, t.c)
              .replace(/\{country\}/g, pickR(MIL_COUNTRIES)[0])
              .replace(/\{buddy\}/g, a ? a.title || a.first : "your buddy")
              .replace(/\{co\}/g, o),
          s = (o, s, r) => {
            o = o || {};
            const i = state.stats;
            for (const [e, t] of [
              ["h", "Happiness"],
              ["he", "Health"],
              ["sm", "Smarts"],
              ["lk", "Looks"],
            ])
              o[e] && (i[t] = clamp(i[t] + o[e]));
            o.perf && (t.perf = clamp(t.perf + o.perf)),
              o.money && (state.money = Math.max(0, state.money + o.money)),
              o.rel && a && (a.rel = clamp(a.rel + o.rel));
            const l = [],
              c = [];
            if (
              (o.wound &&
                (hurt(),
                (i.Health = clamp(i.Health - rint(20, 45))),
                awardMedal("Purple Heart", { why: "wounds received in action" }),
                l.push("You were awarded the Purple Heart."),
                c.push(MEDALS["Purple Heart"][0])),
              o.medal)
            ) {
              const a = branchMedal(o.medal, t.c);
              awardMedal(a, { why: e.t.toLowerCase() }),
                l.push(`You were awarded the ${a}.`),
                c.push(MEDALS[a][0]);
            }
            o.njp &&
              ((t.perf = clamp(t.perf - 10)),
              (state.money = Math.max(0, state.money - Math.round(t.pay / 24))),
              l.push("You received an Article 15 and forfeited half a month's pay.")),
              renderStats();
            const d = n(s);
            if (
              (say(
                d
                  .replace(/\bYou\b/g, "I")
                  .replace(/\byou\b/g, "me")
                  .replace(/\bYour\b/g, "My")
                  .replace(/\byour\b/g, "my")
                  .replace(/\bI were\b/g, "I was")
                  .replace(/\bI are\b/g, "I am")
                  .replace(/\bme (were|are)\b/g, "I was"),
              ),
              o.die && chance(o.die))
            )
              return setTimeout(() => die(o.cause || "combat injuries"), 300);
            notice(
              r,
              d + (l.length ? "<br><br>" + l.join("<br>") : ""),
              () => {
                if (o.court) return (state.job = null), renderAvatar(), arrest(o.court);
                if ("honorable" === o.discharge && t.sf && /bell|quit|drop|wash/i.test(s + " " + e.t)) {
                  const e = t.sf;
                  return (
                    (t.sf = null),
                    (t.pay = Math.round(t.pay / 1.25)),
                    renderStats(),
                    say(`I was dropped from the ${e}.`),
                    notice(
                      "Dropped",
                      `You are no longer part of the ${e}. You've been sent back to the regular ${t.c}.`,
                    )
                  );
                }
                if (o.discharge) {
                  const e = t.c;
                  return (
                    (state.job = null),
                    (state.veteran = {
                      ...(state.veteran || {}),
                      branch: e,
                      end: state.age,
                      dishonorable: "dishonorable" === o.discharge,
                    }),
                    renderAvatar(),
                    notice(
                      `${o.discharge[0].toUpperCase() + o.discharge.slice(1)} discharge`,
                      `You received ${"honorable" === o.discharge ? "an" : "a"} ${o.discharge} discharge from the ${e}.`,
                    )
                  );
                }
                return o.promote && t.ladder[t.rank + 1]
                  ? milRankUp()
                  : o.demote && t.rank > 0
                    ? (t.rank--,
                      (t.t = t.ladder[t.rank].t),
                      (t.pay = wage(t.ladder[t.rank].pay)),
                      renderAvatar(),
                      renderStats(),
                      say(`I was demoted to ${t.t}.`),
                      notice("Demoted", `You were reduced in rank to ${t.t}.`))
                    : void 0;
              },
              !1,
              c.length
                ? `<div class="award-row">${c.map((e) => `<img src="mil/${e}.png" alt="">`).join("")}</div>`
                : "",
            );
          };
        jCard({
          tag: t.sf || "Military",
          iconSrc: `mil/${MEV_ICON[e.i] || "x-combat-helmet"}.png`,
          title: n(e.t),
          surprise: !0,
          lead: n(e.d),
          choices: e.c.map((t) => [
            n(t.l),
            () => {
              null == t.p || chance(t.p)
                ? s(t.w, t.wt || "You made it through.", n(e.t))
                : s(t.f, t.ft || "It went badly.", n(e.t));
            },
          ]),
        });
      }
      function medalCard(e) {
        if (((e.value ??= medalValue(e.name)), (e.year ??= state.birthYear + e.age), e.vet))
          return jCard({
            tag: "Medal",
            iconSrc: `mil/${e.ico}.png`,
            title: "Veteran",
            close: !0,
            lead: `You served your country in the ${e.branch} and left with honor in ${e.year}. Thank you for your service.`,
            rows: [
              ["Branch", e.branch],
              ["Earned", `${e.year} (age ${e.age})`],
            ],
            choices: [["Wear it with pride", () => {}]],
          });
        if ("Medal of Honor" === e.name)
          return jCard({
            tag: "Medal",
            iconSrc: `mil/${e.ico}.png`,
            title: e.name,
            close: !0,
            lead: `You earned the nation's highest military honor in ${e.year}${e.where ? ` in ${e.where}` : ""}. It is a federal crime to sell or buy a Medal of Honor.`,
            rows: [
              ["Branch", e.branch],
              ["Earned", `${e.year} (age ${e.age})`],
              ["Estimated Value", `${usd(e.value)} (illegal to sell)`],
            ],
            choices: [
              [
                "Sell it on the black market",
                () => {
                  if (
                    (screen.classList.remove("open"),
                    say("I tried to sell my Medal of Honor on the black market."),
                    chance(0.55))
                  )
                    return arrest("selling a Medal of Honor");
                  const t = 1e3 * Math.round((e.value * (0.25 + 0.2 * Math.random())) / 1e3);
                  state.medals.splice(state.medals.indexOf(e), 1),
                    (state.money += t),
                    renderStats(),
                    chaChing(),
                    say(`I sold my Medal of Honor to a shady collector for ${usd(t)}.`),
                    notice(
                      "Done deal",
                      `A shady private collector paid you ${usd(t)} for your Medal of Honor. Don't tell anyone.`,
                    );
                },
              ],
            ],
          });
        const t = `You earned this ${e.name} in ${e.year}${e.rank ? ` as ${/^[AEIOU]/.test(e.rank) ? "an" : "a"} ${e.rank}` : ""} in the ${e.branch}${e.where ? `, after clearing a minefield in ${e.where}` : ""}${e.why ? `, for your ${e.why}` : ""}.`,
          a = (t, a, o) => {
            state.medals.splice(state.medals.indexOf(e), 1),
              (state.money += t),
              renderStats(),
              chaChing(),
              say(o),
              screen.classList.remove("open"),
              notice("Done deal", `You sold your ${e.name} ${a} for ${usd(t)}.`);
          };
        jCard({
          tag: "Medal",
          iconSrc: `mil/${e.ico}.png`,
          title: e.name,
          close: !0,
          lead: t,
          rows: [
            ["Branch", e.branch],
            ["Earned", `${e.year} (age ${e.age})`],
            ...(e.where ? [["Deployment", e.where]] : []),
            ["Estimated Value", usd(e.value)],
          ],
          choices: [
            [
              "Sell it to a pawn broker",
              () => {
                const t = 10 * Math.round((e.value * (0.3 + 0.3 * Math.random())) / 10);
                a(t, "to a pawn broker", `I sold my ${e.name} to a pawn broker for ${usd(t)}.`);
              },
            ],
            ["Sell it on eBay", () => setTimeout(() => ebayMedal(e, a), 50)],
          ],
        });
      }
      function ebayMedal(e, t) {
        const a = [0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.5].map((t) => 10 * Math.round((e.value * t) / 10));
        (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div>\n      <div class="jm-tag" style="margin-top:12px">Medal</div>\n      <h4><img src="mil/${e.ico}.png" alt=""><span>${e.name}</span></h4>\n      <div class="lead">List your ${e.name} on eBay today!</div>\n      <table class="jc"><tbody><tr><td><b>Earned:</b> ${e.year}</td></tr><tr><td><b>Estimated Value:</b> ${usd(e.value)}</td></tr></tbody></table>\n      <label class="hr-lab">Pick your list price:</label>\n      <div class="hr-sel"><select id="mdList">${a.map((e) => `<option value="${e}"${e === a[3] ? " selected" : ""}>${usd(e)}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="mdGo">Post it on eBay</button></div>`),
          (ev.style.overflow = "visible");
        const o = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = o),
          (document.getElementById("mdGo").onclick = () => {
            const a = +document.getElementById("mdList").value,
              n = a / e.value,
              s = pickR([
                "a military collector",
                "a history teacher",
                "a war museum curator",
                "a fellow veteran",
                "an antiques dealer",
                "a movie prop buyer",
              ]);
            if (
              (o(),
              screen.classList.remove("open"),
              say(`I listed my ${e.name} on eBay for ${usd(a)}.`),
              !chance(Math.max(0.08, Math.min(0.95, 1.45 - n))))
            )
              return notice(
                "No bids",
                `Nobody bid on your ${e.name}${n > 1.15 ? `. ${usd(a)} might be too much` : ""}.`,
              );
            if (chance(0.3 / Math.max(0.6, n)))
              return t(a, `on eBay to ${s}`, `I sold my ${e.name} on eBay to ${s} for ${usd(a)}.`);
            const r = 10 * Math.round((a * (0.7 + 0.2 * Math.random())) / 10);
            jCard({
              tag: "Medal",
              iconSrc: `mil/${e.ico}.png`,
              title: "Offer",
              surprise: !0,
              lead: `${s[0].toUpperCase() + s.slice(1)} on eBay has offered you ${usd(r)} for your ${e.name}.<br><br>What will you do?`,
              rows: [
                ["Offer", usd(r)],
                ["List Price", usd(a)],
              ],
              choices: [
                [
                  "Take the offer",
                  () => t(r, `on eBay to ${s}`, `I sold my ${e.name} on eBay to ${s} for ${usd(r)}.`),
                ],
                [
                  `Insist on ${usd(a)}`,
                  () =>
                    chance(Math.max(0.15, 0.65 - 1.2 * (n - 1)))
                      ? t(a, `on eBay to ${s}`, `I insisted on ${usd(a)} and sold my ${e.name} on eBay.`)
                      : (say(`I insisted on ${usd(a)} for my ${e.name}, but the buyer backed out.`),
                        notice("No deal", `You insisted on ${usd(a)}, but ${s} backed out.`)),
                ],
                ["Never mind, keep it", () => say(`I decided to keep my ${e.name}.`)],
              ],
            });
          }),
          evWrap.classList.add("open");
      }
      function stateMedalEvent(e = pickR(["valor", "heroism", "bravery", "spunk"]), t = null) {
        whenClear(() =>
          jCard({
            tag: "Military",
            iconSrc: "mil/sports-medal.png",
            title: "State Medal",
            surprise: !0,
            lead: "After returning home, you were nominated for the state award for courage and the president wants to reward you!<br><br>What will you do?",
            choices: [
              [
                "Wear it with pride",
                () => {
                  awardMedal("State Medal", { why: e, where: t }),
                    (state.stats.Happiness = clamp(state.stats.Happiness + 8)),
                    renderStats(),
                    say(`I earned a medal for my ${e} and wore it with pride.`),
                    notice("Honored", "You wore your State Medal with pride.");
                },
              ],
              [
                "Refuse the award",
                () => {
                  say("I refused the State Medal."),
                    notice(
                      "Humble",
                      "You refused the award. Some people thought it was noble; others thought it was rude.",
                    );
                },
              ],
              [
                "Pawn it",
                () => {
                  const e = 100 * rint(8, 30);
                  (state.money += e),
                    renderStats(),
                    chaChing(),
                    say(`I pawned my State Medal for ${usd(e)}.`),
                    notice("Pawned", `You pawned your State Medal for ${usd(e)}.`);
                },
              ],
            ],
          }),
        );
      }
      function enemyAttack() {
        const e = state.stats,
          t = state.job;
        crimeSnd("Gunshot"),
          jCard({
            tag: "Military",
            iconSrc: "mil/crossed-swords.png",
            title: "They are coming!",
            surprise: !0,
            lead: "The enemy is attacking your positions! Intelligence reports on the numerical superiority of the enemy.<br><br>What will you do?",
            choices: [
              [
                "Return attack!",
                () => {
                  if (chance(0.5)) {
                    t.perf = clamp(t.perf + 15);
                    const e = chance(0.35);
                    return (
                      say("I led a counterattack against the enemy!"),
                      void notice(
                        "Victory",
                        "Your counterattack drove the enemy back!",
                        e ? () => stateMedalEvent("valor") : null,
                      )
                    );
                  }
                  if ((hurt(), (e.Health = clamp(e.Health - rint(20, 45))), renderStats(), e.Health <= 0))
                    return setTimeout(() => die("wounds sustained in combat"), 300);
                  say("I was wounded in a counterattack."),
                    notice("Wounded", "You were shot during the counterattack.");
                },
              ],
              [
                "Hold positions!",
                () => {
                  (t.perf = clamp(t.perf + 6)),
                    chance(0.25) && (hurt(), (e.Health = clamp(e.Health - rint(5, 20))), renderStats()),
                    say("I held my position against an enemy attack."),
                    notice("Held the line", "Your unit held its positions until reinforcements arrived.");
                },
              ],
              [
                "Fall back!",
                () => {
                  (t.perf = clamp(t.perf - 10)),
                    say("I fell back during an enemy attack."),
                    notice("Retreat", "You fell back. Your commanding officer was not impressed.");
                },
              ],
            ],
          });
      }
      function milRankUp() {
        const e = state.job,
          t = e.ladder[e.rank + 1];
        if (!t) return;
        const a = e.pay;
        Object.assign(e, {
          t: t.t,
          pay: wage(t.pay),
          rank: e.rank + 1,
          yrs: 0,
          promos: (e.promos || 0) + 1,
          perf: Math.max(45, e.perf - 10),
          icon: jobIcon(t),
        }),
          (e.gap = rint(2, 3)),
          say(`I was promoted to ${e.t}.`),
          renderAvatar(),
          renderStats(),
          whenClear(() =>
            notice(
              "Rank up",
              `You have been promoted to ${e.t}.`,
              null,
              !0,
              `<table class="nt"><tr><td><b>New Rank:</b> ${e.t}</td></tr><tr><td><b>New Salary:</b> ${usd(e.pay)} (+${(100 * (e.pay / a - 1)).toFixed(1)}%)</td></tr><tr><td><b>Branch:</b> ${e.c}</td></tr></table>`,
            ),
          );
      }
      function milRetireCard() {
        const e = state.job,
          t = e.c,
          a = e.tenure || 0,
          o = Math.round(0.025 * a * e.pay),
          n = e.boss ? `${e.boss.title || e.boss.first + " " + e.boss.last}` : "your commanding officer";
        whenClear(() =>
          jCard({
            tag: "Military",
            iconSrc: MIL_ICON(t),
            title: t,
            lead: `You have reached the mandatory retirement ${state.age >= 62 ? "age" : "point"} for the ${t}.<br><br>Your commanding officer, ${n}, thanked you for your service.`,
            rows: [
              ["Age", state.age],
              ["Years Served", a],
              ["Rank", e.t],
              ["Promotions", e.promos || 0],
              ["Retirement Pay", `${usd(o)}/year`],
            ],
            choices: [
              [
                `Retire from the ${t}`,
                () => {
                  (state.job = null),
                    (state.retired = { pension: o, emp: `the ${t}` }),
                    (state.veteran = { ...(state.veteran || {}), branch: t, end: state.age }),
                    renderAvatar(),
                    crimeSnd("BugleSuccess"),
                    say(
                      `I retired from the ${t} as ${/^[AEIOU]/.test(e.t) ? "an" : "a"} ${e.t} after ${a} years of service.`,
                    );
                },
                "green",
              ],
            ],
          }),
        );
      }
      function milDishonorable() {
        const e = state.job;
        if (!e || !isMil()) return;
        const t = e.c,
          a = Math.max(1, (e.tenure || 0) + 1),
          o = e.t,
          n = e.boss ? `${e.boss.title || e.boss.first + " " + e.boss.last}` : "your commanding officer";
        (state.job = null),
          (state.veteran = { ...(state.veteran || {}), branch: t, end: state.age, dishonorable: !0 }),
          renderAvatar(),
          say(`I was dishonorably discharged from the ${t}.`),
          jCard({
            tag: "Military",
            iconSrc: "emoji/1f525.png",
            title: "Dishonorable Discharge",
            surprise: !0,
            lead: `You have been dishonorably discharged from the ${t}.`,
            rows: [
              ["Reason", "Performance"],
              ["Rank", o],
              ["Years Served", a],
            ],
            choices: [
              [
                "Insult my commanding officer",
                () => {
                  fx({ Happiness: 2 }, ""),
                    say(`I insulted my commanding officer on my way out of the ${t}.`),
                    notice("Good riddance", `You told ${n} exactly what you think of the ${t}.`);
                },
              ],
              [
                "Wish my commanding officer well",
                () => {
                  say(`I wished my commanding officer well as I left the ${t}.`),
                    notice(
                      "No hard feelings",
                      `You wished ${n} well and left the ${t} with your head held high.`,
                    );
                },
              ],
            ],
          });
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || state.prison || !isMil()) return;
        const e = state.job,
          t = !e.worked;
        if (
          ((e.perf = clamp((e.perf ?? 50) + (t ? -rint(3, 7) : rint(-5, 6)))),
          e.perf < 15 && chance(0.35 + 0.05 * (15 - e.perf)))
        )
          return setTimeout(() => whenClear(milDishonorable), 400);
        if (
          ((e.tenure = (e.tenure || 0) + 1),
          e.yrs++,
          (e.worked = !1),
          (e.asked = !1),
          (state.veteran = {
            ...(state.veteran || {}),
            branch: e.c,
            start: state.veteran && null != state.veteran.start ? state.veteran.start : state.age - e.tenure,
          }),
          state.age >= 62 || (!milOfficer(e) && e.tenure >= 30))
        )
          return setTimeout(milRetireCard, 400);
        if (mods.militaryExpanded && e.mos) {
          const t = mosOf(e);
          if (
            (e.mos.yrs++,
            e.mos.step < t[3].length - 1 && e.mos.yrs >= e.mos.gap && chance(0.6 + e.perf / 250))
          ) {
            e.mos.step++, (e.mos.yrs = 0), (e.mos.gap = rint(2, 3)), (e.pay = Math.round(1.06 * e.pay));
            const a = mosRole(e);
            say(`I was promoted to ${a}.`),
              renderAvatar(),
              setTimeout(
                () =>
                  whenClear(() =>
                    notice(
                      "Promotion",
                      `You are now ${/^[AEIOU]/.test(a) ? "an" : "a"} ${a}!`,
                      null,
                      !0,
                      `<table class="nt"><tr><td><b>New Role:</b> ${a}</td></tr><tr><td><b>MOS:</b> ${t[1]} (${mosCode(e)})</td></tr><tr><td><b>New Salary:</b> ${usd(e.pay)}</td></tr></table>`,
                    ),
                  ),
                700,
              );
          }
        }
        (e.gap ??= rint(2, 3)),
          e.ladder[e.rank + 1] &&
          e.yrs >= e.gap &&
          chance(e.rank < 3 ? 0.9 : Math.max(0.15, (e.perf - 30) / 60))
            ? setTimeout(milRankUp, 300)
            : chance(0.2)
              ? setTimeout(() => whenClear(deployment), 500)
              : (mods.militaryExpanded && chance(0.55) && milEventRoll()) ||
                (chance(0.12) && setTimeout(() => whenClear(enemyAttack), 500));
      }),
        document.getElementById("ageBtn").addEventListener("click", () => {
          const e = state.veteran;
          if (
            state.dead ||
            state.prison ||
            !e ||
            isMil() ||
            !mods.warReunion ||
            state.age < 55 ||
            e.reunion === state.age ||
            !chance(0.15)
          )
            return;
          e.reunion = state.age;
          const t = Math.max(10, 10 * Math.round((state.age - (e.end ?? state.age - 20)) / 10)) || 30;
          setTimeout(
            () =>
              whenClear(() =>
                jCard({
                  tag: "Military",
                  iconSrc: "mil/medal-military.png",
                  title: "War reunion",
                  surprise: !0,
                  lead: `It has been over ${t} years since you bravely served in the ${e.branch}. Would you like to travel to meet other vets?<br><br>What will you do?`,
                  choices: [
                    [
                      "I'll go",
                      () => {
                        (state.stats.Happiness = clamp(state.stats.Happiness + rint(6, 12))),
                          renderStats(),
                          say("I went to a war reunion with the vets from my unit."),
                          notice(
                            "Old friends",
                            "You shared war stories with your old unit late into the night.",
                          );
                      },
                    ],
                    [
                      "I'm too old",
                      () => {
                        say("I skipped the war reunion. I am too old for that."),
                          notice("Maybe next time", "You stayed home. Your knees thanked you.");
                      },
                    ],
                    [
                      "I'll wear my medals there!",
                      () => {
                        const e = state.medals.length;
                        (state.stats.Happiness = clamp(state.stats.Happiness + (e ? rint(10, 16) : 2))),
                          renderStats(),
                          say("I wore my medals to the war reunion."),
                          notice(
                            e ? "Decorated" : "Awkward",
                            e
                              ? `Everyone admired your ${e} medal${e > 1 ? "s" : ""}!`
                              : "You showed up to wear your medals… but you don't have any.",
                          );
                      },
                    ],
                    [
                      "No way!",
                      () => {
                        say("I refused to go to the war reunion."),
                          notice("No thanks", "You want nothing to do with those memories.");
                      },
                    ],
                  ],
                }),
              ),
            500,
          );
        });
      const RELIGIOUS_WORK = /^(Church|Convent|Monastery|Catholic Church)$/;
      function makeCoworkers(e) {
        if (MIL_RANKS[e.c]) {
          const [t, a] = MIL_RANKS[e.c];
          return Array.from({ length: rint(6, 9) }, () => {
            const e = chance(0.8) ? "m" : "f",
              o = rint(19, 50),
              n = chance(0.35),
              s = any(LAST);
            return {
              first: uname(e),
              last: s,
              g: e,
              age: o,
              look: randomLook(e, o),
              rel: rint(5, 70),
              role: n ? "Officer" : "Enlistee",
              title: `${pickR(n ? a.slice(0, 3) : t.slice(0, 6))} ${s}`,
            };
          });
        }
        const t = (e.ladder || [e]).map((e) => e.t);
        return Array.from({ length: rint(4, 8) }, (a, o) => {
          const n = Math.random() < 0.5 ? "m" : "f",
            s = RELIGIOUS_WORK.test(e.c || "") ? (chance(0.8) ? rint(60, 88) : rint(40, 59)) : rint(18, 62);
          return {
            first: uname(n),
            last: any(LAST),
            g: n,
            age: s,
            look: randomLook(n, s),
            rel: rint(35, 75),
            role: 0 === o && t.length > 1 ? t[Math.min(t.length - 1, 1 + rint(0, 1))] : t[0],
          };
        });
      }
      function fireFromJob(e = !0) {
        const t = state.job;
        t &&
          (log.lastElementChild.insertAdjacentHTML(
            "beforeend",
            `<p>I was fired from my job as ${t.t} at ${t.emp}.</p>`,
          ),
          t.emp &&
            addSuit({
              name: t.emp,
              who: "Former Employer",
              reason: "terminating your employment",
              org: !0,
              strength: !1 === e ? 0.3 : 0.2,
              scale: Math.max(5e3, 0.5 * (t.pay || 2e4)),
            }),
          (state.job = null),
          renderAvatar(),
          renderStats(),
          !1 !== e &&
            queuePopup(() =>
              jCard({
                tag: "Career",
                iconSrc: "emoji/1f525.png",
                title: "Fired",
                lead: `Your boss at ${t.emp} has fired you!`,
                rows: [
                  ["Reason", "Misconduct"],
                  ["Job", t.t],
                  ["Years Worked", Math.max(1, t.tenure || 0)],
                ],
                bars: [["Performance", t.perf ?? 50]],
                ok: () => {},
              }),
            ));
      }
      function firedForPerformance() {
        const e = state.job;
        if (!e || state.dead || isMil()) return;
        const t = e.t,
          a = e.emp,
          o = e.perf,
          n = Math.max(1, e.tenure || 0);
        fireFromJob(!1),
          renderStats(),
          jCard({
            tag: "Career",
            iconSrc: "emoji/1f525.png",
            title: "Fired",
            lead: `Your boss at ${a} has fired you for poor performance!`,
            rows: [
              ["Reason", "Performance"],
              ["Job", t],
              ["Years Worked", n],
            ],
            bars: [["Performance", o]],
            ok: () => {},
          });
      }
      const popularity = (e) =>
          e.coworkers && e.coworkers.length
            ? Math.round(e.coworkers.reduce((e, t) => e + t.rel, 0) / e.coworkers.length)
            : 50,
        PENSION_YEARS = 20;
      function openJobScreen() {
        const e = state.job;
        if (!e) return openOccupation();
        syncProfile();
        const t = isMil();
        (sTitle.textContent = t ? "MILITARY" : "JOB"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openOccupation);
        const a = (e, t, a, o, n = DOTS) =>
          `<div class="row" data-j="${e}"><img src="${t}"><div class="t"><b>${a}</b>${o}</div>${n}</div>`;
        (sList.innerHTML = t
          ? a(
              "info",
              mods.militaryExpanded ? rankInsignia(e) : MIL_ICON(e.c),
              e.t,
              sBar("Performance", e.perf ?? 50),
            ) +
            '<div class="sec">Activities</div>' +
            a("cw", "occ/job-coworkers.png", "Co-Workers", sBar("Relationship", popularity(e)), CHEV) +
            (mods.militaryExpanded
              ? a(
                  "sf",
                  "mil/crossed-swords.png",
                  e.sf ? e.sf : "Join Special Forces",
                  `<span>${e.sf ? "Your special operations unit" : "Try out for an elite unit"}</span>`,
                  CHEV,
                ) +
                a(
                  "war",
                  "mil/x-fire.png",
                  "War",
                  `<span>${e.tours ? `${e.tours} combat tour${e.tours > 1 ? "s" : ""}` : "Volunteer for a combat tour"}</span>`,
                ) +
                a(
                  "mos",
                  "mil/x-recycle.png",
                  "Change MOS",
                  `<span>${e.mos ? `${mosRole(e)} (${mosCode(e)})` : "Pick your career field"}</span>`,
                )
              : "") +
            a("desert", "occ/mil-desert.png", "Desert", "<span>Desert your post</span>") +
            a("resign", "occ/job-resign.png", "Discharge", "<span>Request a discharge</span>") +
            a("taxes", "emoji/1f9fe.png", "Taxes", "<span>See your paycheck and taxes</span>") +
            a("hr", "occ/job-hr.png", "Report Misconduct", "<span>File a grievance against someone</span>") +
            a("retire", "occ/job-retire.png", "Retire", "<span>Consider retirement</span>") +
            a("work", "occ/job-work.png", "Work Harder", "<span>Put in some extra effort</span>")
          : a("info", e.icon || "emoji/1f4bc.png", e.t, sBar("Performance", e.perf ?? 50)) +
            '<div class="sec">Activities</div>' +
            (isBountyHunter()
              ? a(
                  "wanted",
                  "jobev/scroll.png",
                  "Wanted Board",
                  `<span>${state.hunt ? `Hunting ${outlawName(state.hunt.o)}` : "Pick an outlaw to hunt"}</span>`,
                  CHEV,
                )
              : "") +
            (isMinerJob()
              ? a(
                  "mineshift",
                  "Coal Miner" === e.t ? "mining/cart-coal.png" : "mining/cart-gold.png",
                  "Company Mine",
                  "<span>Work a shift underground</span>",
                  CHEV,
                ) +
                a(
                  "mining",
                  "mining/pick1.png",
                  "Mining & Prospecting",
                  "<span>Your own caves, claims and ore</span>",
                  CHEV,
                )
              : "") +
            (e.coworkers
              ? a("cw", "occ/job-coworkers.png", "Co-Workers", sBar("Popularity", popularity(e)), CHEV)
              : "") +
            (isOldEra()
              ? ""
              : a("hours", "occ/job-hours.png", "Hours", "<span>Adjust your hours</span>") +
                a("hr", "occ/job-hr.png", "Human Resources", "<span>Report someone to HR</span>")) +
            a("taxes", "emoji/1f9fe.png", "Taxes", "<span>See your paycheck and taxes</span>") +
            a("resign", "occ/job-resign.png", "Resign", "<span>Tender your resignation</span>") +
            a("retire", "occ/job-retire.png", "Retire", "<span>Consider retirement</span>") +
            a("work", "occ/job-work.png", "Work Harder", "<span>Put in some extra effort</span>")),
          (sList.scrollTop = 0);
        const o = (e, t, a) => {
          a && say(a), screen.classList.remove("open"), renderStats(), notice(e, t);
        };
        sList.querySelectorAll("[data-j]").forEach(
          (a) =>
            (a.onclick = () => {
              const n = a.dataset.j;
              if (e.mil1800 && ("resign" === n || "retire" === n)) return mil1800Leave();
              if ("mineshift" === n) return companyMine();
              if ("mining" === n) return openMining();
              if ("wanted" === n) return state.hunt ? openHuntTrack() : openWantedBoard();
              if ("info" === n) return openMyJob();
              if ("taxes" === n) return taxCard();
              if ("cw" === n) return openCoworkers();
              if ("hours" === n) {
                const t = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
                  a = e.hours ?? 40;
                (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div>\n          <div class="jm-tag" style="margin-top:12px">Job</div>\n          <h4><img src="occ/job-hours.png" alt=""><span>Working Hours</span></h4>\n          <div class="lead">Adjust the amount of hours you show up at ${e.emp} today!</div>\n          <table class="jc"><tbody><tr><td><b>Salary:</b> ${usd(e.pay)}</td></tr><tr><td><b>Expected Hours:</b> 40/week</td></tr></tbody></table>\n          <label class="hr-lab">Pick your hours:</label>\n          <div class="hr-sel"><select id="jobHrs">${t.map((e) => `<option value="${e}"${e === a ? " selected" : ""}>${e} hours</option>`).join("")}</select></div>\n          <button class="jm-apply ev-btn" id="hrsGo">Adjust my hours</button></div>`),
                  (ev.style.overflow = "visible");
                const n = () => {
                  evWrap.classList.remove("open"), (ev.style.overflow = "");
                };
                return (
                  (document.getElementById("propX").onclick = n),
                  (document.getElementById("hrsGo").onclick = () => {
                    const t = +document.getElementById("jobHrs").value;
                    n(),
                      (e.hours = t),
                      o(
                        "Working Hours",
                        t > 40
                          ? `You will now work ${t} hours a week at ${e.emp}. Your boss will notice the extra effort.`
                          : t < 40
                            ? `You will now only work ${t} hours a week at ${e.emp}. Your boss might not be happy about it.`
                            : `You will work the normal 40 hours a week at ${e.emp}.`,
                        `I decided to work ${t} hours a week at my job.`,
                      );
                  }),
                  evWrap.classList.add("open")
                );
              }
              if ("hr" === n && t) {
                const t = [e.boss, ...(e.coworkers || [])].filter(Boolean).slice(0, 5);
                return t.length
                  ? jCard({
                      tag: "Military",
                      iconSrc: "occ/job-hr.png",
                      title: "Report Misconduct",
                      close: !0,
                      lead: "Who would you like to file a grievance against?",
                      choices: t.map((t) => [
                        t.title || `${t.first} ${t.last}`,
                        () => {
                          const a = t.title || `${t.first} ${t.last}`,
                            n = pickR([
                              "hazing new recruits",
                              "stealing rations",
                              "sleeping on watch",
                              "abusing their rank",
                              "falsifying reports",
                              "insubordination",
                            ]).replace("their", "f" === t.g ? "her" : "his");
                          return (
                            (t.rel = clamp(t.rel - rint(15, 30))),
                            chance(0.35)
                              ? (t !== e.boss
                                  ? e.coworkers.splice(e.coworkers.indexOf(t), 1)
                                  : (e.boss = null),
                                o(
                                  "Grievance filed",
                                  `${a} was disciplined for ${n} and transferred out of your unit.`,
                                  `I filed a grievance against ${a} for ${n}. ${"f" === t.g ? "She" : "He"} was transferred out.`,
                                ))
                              : chance(0.35)
                                ? ((e.perf = clamp(e.perf - 8)),
                                  o(
                                    "Backfired",
                                    `The investigation cleared ${a}, and now your unit sees you as a snitch.`,
                                    `I filed a grievance against ${a}, but it backfired.`,
                                  ))
                                : void o(
                                    "Grievance filed",
                                    `${a} received a formal reprimand for ${n}.`,
                                    `I filed a grievance against ${a} for ${n}.`,
                                  )
                          );
                        },
                      ]),
                    })
                  : notice("Report Misconduct", "There is nobody to report.", null, !0);
              }
              if ("retire" === n && t) {
                const t = e.tenure || 0,
                  a = Math.max(0, 20 - t),
                  n = Math.round(0.025 * t * e.pay);
                return jCard(
                  a
                    ? {
                        tag: "Military",
                        iconSrc: "occ/job-retire.png",
                        title: "Retirement",
                        close: !0,
                        lead: `You are not currently eligible to retire from the ${e.c}.`,
                        rows: [
                          ["Years Served", t],
                          ["Years Until Eligible", a],
                        ],
                      }
                    : {
                        tag: "Military",
                        iconSrc: "occ/job-retire.png",
                        title: "Retirement",
                        close: !0,
                        lead: `You are eligible to retire from the ${e.c}!`,
                        rows: [
                          ["Years Served", t],
                          ["Rank", e.t],
                          ["Retirement Pay", `${usd(n)}/year`],
                        ],
                        choices: [
                          [
                            `Retire from the ${e.c}`,
                            () => {
                              const a = e.c;
                              (state.job = null),
                                (state.retired = { pension: n, emp: `the ${a}` }),
                                (state.veteran = { ...(state.veteran || {}), branch: a, end: state.age }),
                                renderAvatar(),
                                o(
                                  "Retired",
                                  `You retired from the ${a} after ${t} years of service. Your retirement pay is ${usd(n)} a year.`,
                                  `I retired from the ${a} after ${t} years of service.`,
                                );
                            },
                            "green",
                          ],
                        ],
                      },
                );
              }
              if ("hr" === n) {
                const t = (e.coworkers || []).slice(0, 5);
                return t.length
                  ? jCard({
                      tag: "Job",
                      iconSrc: "occ/job-hr.png",
                      title: "Human Resources",
                      close: !0,
                      lead: "Who would you like to report to HR?",
                      choices: t.map((t) => [
                        `${t.first} ${t.last}`,
                        () => {
                          const a = [
                              "stealing office supplies",
                              `sleeping at ${"f" === t.g ? "her" : "his"} desk`,
                              "microwaving fish in the break room",
                              "harassing coworkers",
                              "taking credit for my work",
                              "showing up late every day",
                            ],
                            n = pickR(a);
                          return (
                            (t.rel = clamp(t.rel - rint(15, 30))),
                            chance(0.35)
                              ? (e.coworkers.splice(e.coworkers.indexOf(t), 1),
                                o(
                                  "Reported",
                                  `HR investigated ${t.first} for ${n.replace("my work", "your work")} and fired ${"f" === t.g ? "her" : "him"}!`,
                                  `I reported my coworker, ${t.first}, to HR for ${n}. ${"f" === t.g ? "She" : "He"} was fired.`,
                                ))
                              : chance(0.3)
                                ? ((e.perf = clamp(e.perf - 8)),
                                  o(
                                    "Backfired",
                                    `HR found nothing on ${t.first}, and now your boss thinks you're a snitch.`,
                                    `I reported ${t.first} to HR, but it backfired on me.`,
                                  ))
                                : void o(
                                    "Reported",
                                    `HR gave ${t.first} a written warning for ${n.replace("my work", "your work")}.`,
                                    `I reported my coworker, ${t.first}, to HR for ${n}.`,
                                  )
                          );
                        },
                      ]),
                    })
                  : notice("Human Resources", "There is nobody at work to report.", null, !0);
              }
              if ("sf" === n) return openSpecialForces();
              if ("war" === n) return openWar();
              if ("mos" === n)
                return e.mosAsked === state.age && e.mos
                  ? notice("Change MOS", "You already requested an MOS change this year.", null, !0)
                  : mosCard(!!e.mos);
              if ("desert" === n)
                return iosConfirm("Desert", `Desert the ${e.c}? Desertion is a crime.`, () => {
                  screen.classList.remove("open"),
                    deployResult("desert", [
                      "Navy" === e.c || "Coast Guard" === e.c ? "your ship" : "your base",
                      "",
                    ]);
                });
              if ("resign" === n && t)
                return iosConfirm("Discharge", `Request a discharge from the ${e.c}?`, () => {
                  const t = (e.tenure || 0) >= 4,
                    a = e.c;
                  (state.job = null),
                    (state.veteran = { ...(state.veteran || {}), branch: a, end: state.age }),
                    renderAvatar(),
                    o(
                      t ? "Honorable discharge" : "Discharged",
                      t
                        ? `You were honorably discharged from the ${a}. Thank you for your service!`
                        : `You were discharged from the ${a} before finishing 4 years of service.`,
                      `I was ${t ? "honorably " : ""}discharged from the ${a}.`,
                    );
                });
              if ("resign" === n)
                return iosConfirm(
                  "Resign",
                  `Are you sure you want to resign from your job as ${/^[aeiou]/i.test(e.t) ? "an" : "a"} ${e.t} at ${e.emp}?`,
                  () => {
                    (state.job = null),
                      renderAvatar(),
                      o(
                        "Resigned",
                        `You resigned from your job as ${/^[aeiou]/i.test(e.t) ? "an" : "a"} ${e.t} at ${e.emp}.`,
                        `I resigned from my job as ${/^[aeiou]/i.test(e.t) ? "an" : "a"} ${e.t} at ${e.emp}.`,
                      );
                  },
                );
              if ("retire" === n) {
                const t = e.tenure || 0,
                  a = Math.max(0, PENSION_YEARS - t),
                  n = 100 * Math.round((e.pay * Math.min(0.7, 0.02 * t + 0.2)) / 100),
                  s = (t) => {
                    (state.job = null),
                      (state.retired = { pension: t ? n : 0, emp: e.emp }),
                      renderAvatar(),
                      o(
                        "Retired",
                        t
                          ? `You retired from ${e.emp}! You will receive a pension of ${usd(n)} a year.`
                          : `You retired from ${e.emp}. You don't get a pension, but you're free!`,
                        `I retired from my job at ${e.emp}${t ? ` with a ${usd(n)}/year pension` : ""}.`,
                      );
                  };
                return jCard(
                  a
                    ? {
                        tag: "Job",
                        iconSrc: "occ/job-retire.png",
                        title: "Retirement",
                        close: !0,
                        lead: `You are not currently eligible for a pension from your employer, ${e.emp}.`,
                        rows: [
                          ["Years at Company", t],
                          ["Years Until Eligible", a],
                        ],
                        choices: state.age >= 60 ? [["Retire without a pension", () => s(!1)]] : [],
                      }
                    : {
                        tag: "Job",
                        iconSrc: "occ/job-retire.png",
                        title: "Retirement",
                        close: !0,
                        lead: `You are eligible for a pension from your employer, ${e.emp}!`,
                        rows: [
                          ["Years at Company", t],
                          ["Yearly Pension", usd(n)],
                        ],
                        choices: [["Retire", () => s(!0)]],
                      },
                );
              }
              return "work" === n ? workHarder() : void 0;
            }),
        ),
          screen.classList.add("open");
      }
      function openCoworkers() {
        const e = state.job;
        if (!e) return openOccupation();
        const t = !!MIL_RANKS[e.c];
        if (("string" == typeof e.boss && ((e.mailBoss = e.boss), (e.boss = null)), !e.boss)) {
          const a = chance(0.5) ? "m" : "f",
            o = RELIGIOUS_WORK.test(e.c || "") ? rint(60, 85) : rint(30, 60),
            n = any(LAST);
          if (
            ((e.boss = {
              first: uname(a),
              last: n,
              g: a,
              age: o,
              look: randomLook(a, o),
              rel: rint(t ? 5 : 35, 70),
              role: t ? "Commanding Officer" : "Supervisor",
            }),
            e.mailBoss)
          ) {
            const [t, ...a] = e.mailBoss.split(" ");
            (e.boss.first = t), a.length && (e.boss.last = a.join(" "));
          }
          t &&
            (e.boss.title = `${MIL_RANKS[e.c][1][Math.min(MIL_RANKS[e.c][1].length - 1, (milOfficer(e) ? e.rank : 1) + 2)]} ${n}`);
        }
        (sTitle.textContent = t ? e.c.toUpperCase() : e.emp.toUpperCase()),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openJobScreen);
        const a = (e, a) =>
          `<div class="row" data-cw="${a}"><i class="face" data-cwf="${a}"></i><div class="t"><b>${e.title || e.first + " " + e.last} <em>(${e.role})</em></b>${sBar("Relationship", e.rel)}</div>${t ? CHEV : ""}</div>`;
        sList.innerHTML =
          a(e.boss, "boss") + '<div class="sec">Team</div>' + e.coworkers.map((e, t) => a(e, t)).join("");
        sList.querySelectorAll("i.face").forEach((t) => {
          const a = "boss" === (o = t.dataset.cwf) ? e.boss : e.coworkers[+o];
          var o;
          t.replaceWith(
            npcFace(a.look, a.g, a.age, a.rel < 25 ? "sad" : a.rel < 40 ? "angry" : "happy", "face"),
          );
        }),
          sList
            .querySelectorAll("[data-cw]")
            .forEach((e) => (e.onclick = () => openCoworkerPerson(e.dataset.cw))),
          (sList.scrollTop = 0);
      }
      function openCoworkerPerson(e) {
        const t = state.job;
        if (!t) return openOccupation();
        const a = "boss" === e ? t.boss : t.coworkers[+e];
        if (!a) return openCoworkers();
        const o = "f" === a.g,
          n = o ? "her" : "him",
          s = o ? "She" : "He",
          r = a.title || `${a.first} ${a.last}`,
          i = () => openCoworkerPerson(e);
        (a.looks ??= rint(5, 100)),
          (a.smarts ??= rint(5, 100)),
          (a.sexuality ??= chance(0.85) ? "Straight" : pickR(["Gay", "Bisexual"])),
          (sTitle.textContent = "CO-WORKER"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openCoworkers);
        const l = (e, t, a, o) =>
          `<div class="row sm" data-a="${e}"><img src="${t}"><div class="t"><b>${a}</b><span>${o}</span></div>${DOTS}</div>`;
        (sList.innerHTML =
          `<div class="row" data-a="prof"><i class="face" id="cwpFace"></i><div class="t"><b>${r}</b>${sBar("Relationship", a.rel)}</div>${DOTS}</div>\n       <div class="row sm" data-a="edit"><img src="school/ui-edit.png"><div class="t"><b>Edit</b><span>Edit ${n}</span></div>${GOD_SEAL}</div>\n       <div class="sec">Activities</div>` +
          l("askout", "occ/cw-askout.png", "Ask Out", `Ask ${n} out`) +
          l("befriend", "school/ui-befriend.png", "Befriend", `Befriend ${n}`) +
          l("compliment", "school/ui-compliment.png", "Compliment", `Pay ${n} a compliment`) +
          l("talk", "school/ui-talk.png", "Conversation", `Have a conversation with ${n}`) +
          l("deal", "school/ui-deal.png", "Deal", `Sell something to ${n}`) +
          l("gift", "school/ui-gift.png", "Gift", `Give ${n} a gift`) +
          l("hookup", "occ/cw-hookup.png", "Hook Up", `Hook up with ${n}`) +
          l("insult", "school/ui-insult.png", "Insult", `Insult ${n}`) +
          l("prank", "school/ui-actup.png", "Prank", `Prank ${n}`) +
          l("rumor", "school/ui-disrespect.png", "Rumor", `Start a rumor about ${n}`) +
          l("time", "rel/time.png", "Spend Time", `Spend time with ${n}`) +
          switchRow(n)),
          document
            .getElementById("cwpFace")
            .replaceWith(Object.assign(npcFace(a.look, a.g, a.age, moodOf(a.rel), "face"), {})),
          (sList.scrollTop = 0);
        const c = { role: "Supervisor" === a.role ? "Supervisor" : "Co-Worker", name: r, g: a.g, age: a.age },
          d = (e, t, a) => {
            a && say(a), screen.classList.remove("open"), renderStats(), notice(e, t, null, !0);
          };
        sList.querySelectorAll("[data-a]").forEach(
          (e) =>
            (e.onclick = () => {
              const n = e.dataset.a;
              if ("edit" === n) return godEdit(a, { role: c.role, age: a.age, g: a.g }, i);
              if ("switch" === n) return confirmSwitch(a, a.age);
              if ("prof" === n) {
                const e = (e, t) =>
                    `<tr><td style="text-align:center;padding-left:0"><b>${e}:</b> ${t}</td></tr>`,
                  t = (e, t) =>
                    `<b>${e}</b><i><u style="width:${Math.max(t, 1)}%;background:${barCol(t)}"></u></i>`;
                return (
                  (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div>\n          <div class="ev-tag" style="margin-top:12px"><canvas class="ev-av" width="250" height="250"></canvas><span class="who">${r}</span><span class="kind">${c.role}</span></div>\n          <h4><img src="act/profile.png"><span>Profile</span></h4>\n          <table><tbody>${e("Name", r)}${e("Job", a.role)}${e("Gender", o ? "Female" : "Male")}${e("Age", a.age)}${e("Sexuality", a.sexuality)}</tbody></table>\n          <div class="ev-bars">${t("Relationship", a.rel)}${t("Looks", a.looks)}${t("Smarts", a.smarts)}</div>`),
                  ev.querySelector(".ev-av").replaceWith(npcFace(a.look, a.g, a.age, moodOf(a.rel), "ev-av")),
                  (ev.style.overflow = "visible"),
                  (document.getElementById("propX").onclick = () => {
                    evWrap.classList.remove("open"), (ev.style.overflow = "");
                  }),
                  evWrap.classList.add("open")
                );
              }
              if (["compliment", "talk", "deal", "gift", "insult", "time"].includes(n))
                return parentAction(a, n, i, c);
              if ("befriend" === n)
                return (!window.SYNDROME || !SYNDROME.shun()) && a.rel >= 40 && chance(0.45 + a.rel / 200)
                  ? ((a.rel = clamp(a.rel + 10)),
                    addFriend({ first: a.first, last: a.last, g: a.g, look: a.look, age: a.age }, a.rel),
                    d(
                      "New Friend",
                      `You are now friends with your co-worker, ${r}!`,
                      `${r} agreed to be my friend!`,
                    ))
                  : ((a.rel = clamp(a.rel - 5)),
                    d(
                      "Rejected",
                      `${r} doesn't want to be your friend.`,
                      `My co-worker, ${r}, didn't want to be my friend.`,
                    ));
              if ("askout" === n || "hookup" === n) {
                if (!canDate(a.age))
                  return d(
                    "Not appropriate",
                    `${r} is ${a.age < 18 ? "a minor" : state.age < 18 ? "an adult" : "not someone you can date"}. That's not happening.`,
                  );
                if (
                  !(
                    ("Straight" !== a.sexuality || "f" === a.g) &&
                    a.rel >= ("hookup" === n ? 30 : 45) &&
                    chance(romanceOdds(a, { base: "hookup" === n ? 0.5 : 0.55, rel: a.rel }))
                  )
                )
                  return (
                    (a.rel = clamp(a.rel - rint(5, 12))),
                    chance(0.2) && (t.perf = clamp(t.perf - 5)),
                    d(
                      "Rejected",
                      `${r} turned you down. Things are a little awkward at work now.`,
                      `I ${"hookup" === n ? "tried to hook up with" : "asked out"} my co-worker, ${r}, but ${o ? "she" : "he"} said no.`,
                    )
                  );
                if ("hookup" === n)
                  return (
                    (a.rel = clamp(a.rel + rint(3, 8))),
                    (state.stats.Happiness = clamp(state.stats.Happiness + rint(4, 9))),
                    hookupSound(),
                    (state.notVirgin = !0),
                    d(
                      "Office romance",
                      `You hooked up with your co-worker, ${r}. Don't let HR find out!`,
                      `I hooked up with my co-worker, ${r}.`,
                    )
                  );
                const e = makeLover({ g: a.g, ages: [a.age, a.age] });
                Object.assign(e, {
                  first: a.first,
                  last: a.last,
                  look: a.look,
                  ageOffset: a.age - state.age,
                  rel: clamp(a.rel + 10),
                  sexuality: a.sexuality,
                });
                const s = addLover(e);
                return (
                  (state.stats.Happiness = clamp(state.stats.Happiness + rint(5, 10))),
                  d(
                    "Office romance",
                    `${r} said yes! You are now dating your co-worker.${s}`,
                    `I asked out my co-worker, ${r}, and ${o ? "she" : "he"} said yes!`,
                  )
                );
              }
              if ("prank" === n) {
                const e = pickR([
                  "taped a photo of a celebrity over their family photo",
                  "filled their desk drawer with packing peanuts",
                  'put a "Kick Me" sign on their back',
                  "swapped their sugar for salt",
                  "wrapped their whole desk in tin foil",
                  "set their computer language to Klingon",
                ]).replace(/their/g, o ? "her" : "his");
                return chance(0.55)
                  ? ((a.rel = clamp(a.rel + 3)),
                    (state.stats.Happiness = clamp(state.stats.Happiness + 4)),
                    d(
                      "Gotcha",
                      `You ${e}. ${s} thought it was hilarious!`,
                      `I pranked my co-worker, ${r}. I ${e}.`,
                    ))
                  : ((a.rel = clamp(a.rel - rint(8, 15))),
                    d(
                      "Not funny",
                      `You ${e}. ${s} was NOT amused.`,
                      `I pranked my co-worker, ${r}, and ${o ? "she" : "he"} was not amused.`,
                    ));
              }
              if ("rumor" === n) {
                const e = pickR([
                  "is secretly dating the boss",
                  "got fired from their last job for stealing",
                  "cheats at the office fantasy league",
                  "eats other people's lunches",
                  "has a secret second family",
                ]).replace(/their/g, o ? "her" : "his");
                return chance(0.3)
                  ? ((a.rel = clamp(a.rel - rint(20, 35))),
                    (t.perf = clamp(t.perf - 6)),
                    d(
                      "Busted",
                      `${r} found out you started the rumor that ${o ? "she" : "he"} ${e}!`,
                      `I started a rumor that my co-worker, ${r}, ${e}. ${s} found out it was me.`,
                    ))
                  : ((a.rel = clamp(a.rel - rint(3, 8))),
                    d(
                      "Rumor mill",
                      `You told everyone at ${t.emp} that ${r} ${e}. The whole office is talking.`,
                      `I started a rumor that my co-worker, ${r}, ${e}.`,
                    ));
              }
            }),
        );
      }
      function coworkerCard(e) {
        const t = "m" === e.g ? "him" : "her";
        (ev.innerHTML = `\n      <div class="jm-x" id="propX">${CARD_X}</div>\n      <div class="jm-tag">Coworker</div>\n      <div class="ev-face" id="cwFace"></div>\n      <h4><span>${e.first} ${e.last}</span></h4>\n      <table><tbody>\n        <tr><td><b>Role:</b> ${e.role}</td></tr><tr><td><b>Age:</b> ${e.age}</td></tr><tr><td><b>Gender:</b> ${"m" === e.g ? "Male" : "Female"}</td></tr>\n      </tbody></table>\n      <div class="ev-bars"><b>Relationship</b><i><u class="${e.rel < 50 ? "o" : ""}" style="width:${e.rel}%"></u></i></div>\n      <button class="jm-apply ev-btn" data-a="talk">Have a conversation</button>\n      <button class="jm-apply ev-btn" data-a="compliment">Compliment ${t}</button>\n      <button class="jm-apply ev-btn" data-a="prank">Prank ${t}</button>\n      <button class="jm-apply ev-btn" data-a="insult" style="background:#c62828">Insult ${t}</button>`),
          document
            .getElementById("cwFace")
            .append(npcFace(e.look, e.g, e.age, e.rel < 25 ? "sad" : e.rel < 40 ? "angry" : "happy"));
        (document.getElementById("propX").onclick = () => {
          evWrap.classList.remove("open"), openCoworkers();
        }),
          ev.querySelectorAll("[data-a]").forEach(
            (t) =>
              (t.onclick = () => {
                const a = t.dataset.a,
                  o = e.first;
                let n;
                if (
                  ("talk" === a &&
                    ((e.rel = clamp(e.rel + rint(3, 8))),
                    (n = `I had a nice conversation with my coworker, ${o}.`),
                    chatNotice(`your coworker, ${o}`)),
                  "compliment" === a &&
                    (chance(0.75)
                      ? ((e.rel = clamp(e.rel + rint(5, 10))),
                        (n = `I complimented my coworker, ${o}. ${"m" === e.g ? "He" : "She"} loved it.`))
                      : ((e.rel = clamp(e.rel - 3)), (n = `I complimented ${o}, but it came off as weird.`))),
                  "prank" === a &&
                    (chance(0.55)
                      ? ((e.rel = clamp(e.rel + 5)),
                        (state.stats.Happiness = clamp(state.stats.Happiness + 4)),
                        (n = `I pranked ${o}. We both laughed.`))
                      : ((e.rel = clamp(e.rel - 10)),
                        (n = `I pranked ${o} and ${"m" === e.g ? "he" : "she"} was NOT amused.`))),
                  "insult" === a)
                )
                  if (((e.rel = clamp(e.rel - rint(10, 18))), chance(0.25))) {
                    (state.stats.Health = clamp(state.stats.Health - 8)),
                      hurt(),
                      (n = `I insulted ${o} and ${"m" === e.g ? "he" : "she"} punched me.`);
                    const t = {
                      text: `You insulted your coworker, ${o}, and ${"m" === e.g ? "he" : "she"} ${any(["punched you in the face", "shoved you into the copy machine", "slapped you across the face"])}!`,
                      dmg: rint(30, 60),
                    };
                    setTimeout(() => {
                      evWrap.classList.remove("open"), showHit(t);
                    }, 0);
                  } else n = `I insulted my coworker, ${o}.`;
                log.lastElementChild.insertAdjacentHTML("beforeend", `<p>${n}</p>`),
                  renderStats(),
                  coworkerCard(e);
              }),
          ),
          evWrap.classList.add("open");
      }
      const jobSlug = (e) =>
          e
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
        careerKey = (e) => {
          const t = e && ((e.ladder && e.ladder[0] && e.ladder[0].t) || e.t);
          return t && isOldEra() ? `1800s:${t}` : t;
        },
        jobEvLoading = {};
      function loadJobEvents(e) {
        const t = careerKey(e);
        if (!t || (window.JOB_EVENTS || {})[t] || jobEvLoading[t]) return;
        jobEvLoading[t] = !0;
        const a = document.createElement("script");
        (a.src = /^1800s:/.test(t)
          ? `jobevents/1800s/${jobSlug(t.slice(6))}.js?v=1`
          : `jobevents/${jobSlug(t)}.js?v=1`),
          document.head.append(a);
      }
      function careerEvents(e) {
        const t = careerKey(e),
          a = (window.JOB_EVENTS || {})[t];
        return a
          ? a.map(
              (e) => e._k || (e._k = { ...e, key: `job:${t}:${e.t}`, src: `jobev/${e.s}.png`, i: "1f4bc" }),
            )
          : (loadJobEvents(e), []);
      }
      function workEvent(e) {
        return {
          min: 0,
          max: 200,
          kind: "Work",
          make() {
            const t = state.job;
            let a = null,
              o = null;
            if ("cw" === e.p && t.coworkers && t.coworkers.length)
              (a = any(t.coworkers)),
                (o = { first: a.first, g: a.g, age: a.age, look: a.look, full: `${a.first} ${a.last}` });
            else if (e.p) {
              const e = person(20, 60);
              o = { first: e.first, g: e.g, age: e.age, look: e.look, full: e.full };
            }
            const n = o && "f" === o.g ? "she" : "he",
              s = (e) =>
                e
                  .replace(/\{emp\}/g, t.emp)
                  .replace(/\{first\}/g, o ? o.first : "")
                  .replace(/\{him\}/g, "he" === n ? "him" : "her")
                  .replace(/\{his\}/g, "he" === n ? "his" : "her")
                  .replace(/\{His\}/g, "he" === n ? "His" : "Her")
                  .replace(/\{himself\}/g, "he" === n ? "himself" : "herself")
                  .replace(/\{He\}/g, "he" === n ? "He" : "She")
                  .replace(/\{he\}/g, n);
            this.kind = t.emp;
            const r = (e, o) => (
              (e = e || {}).w && (t.perf = clamp(t.perf + e.w)),
              e.r && a && (a.rel = clamp(a.rel + e.r)),
              e.fire && setTimeout(fireFromJob, 50),
              runFx(e, s(o))
            );
            return {
              who: o ? o.full : t.emp,
              av: e.i || "1f4bc",
              ...(e.src ? { iconSrc: e.src, avSrc: e.src } : { icon: e.i }),
              title: e.t,
              desc: s(e.d),
              person: o ? { look: o.look, g: o.g, age: o.age } : null,
              ...(a ? { bars: [["Relationship", a.rel]] } : {}),
              choices: e.c.map(([e, t, o, n, i, l]) => [
                s(e),
                () =>
                  afford(t.m < 0 ? t : i, () =>
                    null == n ||
                    chance(ROMANCE_ASK.test(e) ? romanceOdds(a || {}, { base: n, rel: a ? a.rel : null }) : n)
                      ? r(t, o)
                      : r(i, l),
                  ),
              ]),
            };
          },
        };
      }
      function openPlaceholder(e) {
        syncProfile(),
          (sTitle.textContent = e.toUpperCase()),
          (sSub.style.display = "none"),
          (sBack.innerHTML = X_ICON),
          (sBack.onclick = () => screen.classList.remove("open")),
          (sList.innerHTML = '<div class="row"><div class="t"><b>Error</b><span>Error</span></div></div>'),
          screen.classList.add("open");
      }
      setTimeout(() => {
        state.job && loadJobEvents(state.job);
      }, 1500),
        document.getElementById("ageBtn").addEventListener("click", () => {
          const e = state.job;
          if (state.dead || state.prison || !e || isMil() || !chance(0.4)) return;
          const t = careerEvents(e).filter((e) => !evSeen()[e.key]);
          t.length &&
            queueRoll(() => {
              state.job === e && openEvent(workEvent(any(t)));
            });
        }),
        document.getElementById("ageBtn").addEventListener("click", () => {
          const e = state.job;
          if (!e || state.dead || !e.ladder || isMil()) return;
          const t = !e.worked;
          e.yrs++, (e.tenure = (e.tenure || 0) + 1), (e.worked = !1), (e.asked = !1);
          const a = e.hours ?? 40;
          40 !== a &&
            ((e.perf = clamp(e.perf + Math.round((a - 40) / 4))),
            a > 50 &&
              ((state.stats.Happiness = clamp(state.stats.Happiness - rint(2, 5))),
              (state.stats.Health = clamp(state.stats.Health - rint(0, 3))))),
            0 === a && chance(0.6)
              ? setTimeout(fireFromJob, 50)
              : ((e.perf = clamp(
                  e.perf + (t ? -rint(4, 6) : rint(-6, 6) + (state.stats.Smarts > 60 ? 2 : 0)),
                )),
                e.perf < 13 && chance(0.35 + 0.05 * (13 - e.perf))
                  ? setTimeout(() => whenClear(firedForPerformance), 400)
                  : nextRank() &&
                    e.yrs >= 2 &&
                    e.perf >= 65 &&
                    Math.random() < 0.2 + (e.perf - 65) / 100 &&
                    promote());
        });
      let SURNAME = (PICK && PICK.last) || ulast();
      if (
        ((state.first = (PICK && PICK.first) || uname(PG())),
        (document.getElementById("pname").textContent = `${state.first} ${SURNAME}`),
        (state.parents = [
          {
            first: uname("m"),
            role: "Father",
            pron: "him",
            gender: "m",
            look: randomLook("m", 30),
            ageAtBirth: 29 + Math.floor(12 * Math.random()),
            rel: 85 + Math.floor(15 * Math.random()),
          },
          {
            first: uname("f"),
            role: "Mother",
            pron: "her",
            gender: "f",
            look: randomLook("f", 30),
            ageAtBirth: 24 + Math.floor(12 * Math.random()),
            rel: 85 + Math.floor(15 * Math.random()),
          },
        ]),
        isOldEra())
      ) {
        const T = Math.random();
        (state.famClass =
          PICK && (PICK.money >= 1e6 || PICK.famous || PICK.royal)
            ? "rich"
            : T < 0.55
              ? "poor"
              : T < 0.9
                ? "middle"
                : "rich"),
          (state.respect =
            { poor: 20, middle: 40, rich: 60 }[state.famClass] + Math.floor(16 * Math.random()));
        const A = log.firstElementChild,
          M = A.querySelector(".news");
        (M || A).insertAdjacentHTML(
          M ? "beforebegin" : "beforeend",
          `<p>${{ poor: "My family is poor. My parents work long hours for very little.", middle: "My family gets by on an honest trade.", rich: "I was born into a wealthy family." }[state.famClass]}</p>`,
        );
      }
      const relBar = (e) =>
          `<div class="rel">Relationship <i><u style="width:${Math.max(e, 2)}%;background:${barCol(e)}"></u></i></div>`,
        deadRow = (e, t, a) => {
          const o = state.age - a.diedAt;
          return `<div class="row sm locked dead"><img src="ui/skull-and-bones.png" alt=""><div class="t"><b>${e} <em>(${t})</em></b><span>Died ${0 === o ? "this year" : 1 === o ? "1 year ago" : `${o} years ago`}</span></div></div>`;
        };
      function snapNav() {
        if (!screen.classList.contains("open")) return null;
        const e = sList.cloneNode(!0),
          t = screen.getBoundingClientRect(),
          a = sList.getBoundingClientRect();
        return (
          e.removeAttribute("id"),
          e.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id")),
          sList.querySelectorAll("canvas").forEach((t, a) => {
            const o = e.querySelectorAll("canvas")[a];
            o && o.getContext("2d").drawImage(t, 0, 0);
          }),
          {
            ghost: e,
            title: sTitle.textContent,
            top: a.top - t.top,
            height: a.height,
            scroll: sList.scrollTop,
          }
        );
      }
      function navWatch(e, t) {
        let a = null;
        e.addEventListener(
          "click",
          () => {
            a = snapNav();
          },
          !0,
        ),
          e.addEventListener("click", () => {
            a && screen.classList.contains("open") && sTitle.textContent !== a.title && playNav(a, t),
              (a = null);
          });
      }
      function playNav(e, t) {
        playNav.end?.();
        const a = e.ghost;
        Object.assign(a.style, {
          position: "absolute",
          left: 0,
          right: 0,
          top: e.top + "px",
          height: e.height + "px",
          pointerEvents: "none",
          zIndex: t > 0 ? 0 : 2,
          background: getComputedStyle(screen).backgroundColor,
          boxShadow: t > 0 ? "" : "-6px 0 14px rgba(0,0,0,.18)",
        }),
          screen.appendChild(a),
          (a.scrollTop = e.scroll),
          Object.assign(sList.style, {
            position: "relative",
            zIndex: 1,
            background: getComputedStyle(screen).backgroundColor,
          });
        const o = { duration: 300, easing: "cubic-bezier(.22,.8,.3,1)" },
          n = [];
        t > 0
          ? (n.push(a.animate([{ transform: "translateX(0)" }, { transform: "translateX(-30%)" }], o)),
            n.push(
              sList.animate(
                [
                  { transform: "translateX(100%)", boxShadow: "-6px 0 14px rgba(0,0,0,.18)" },
                  { transform: "translateX(0)", boxShadow: "-6px 0 14px rgba(0,0,0,0)" },
                ],
                o,
              ),
            ))
          : (n.push(a.animate([{ transform: "translateX(0)" }, { transform: "translateX(100%)" }], o)),
            n.push(sList.animate([{ transform: "translateX(-30%)" }, { transform: "translateX(0)" }], o))),
          n.push(sTitle.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 }));
        const s = () => {
            clearTimeout(r),
              (playNav.end = null),
              n.forEach((e) => {
                try {
                  e.finish();
                } catch {}
              }),
              a.remove(),
              (sList.style.background = "");
          },
          r = setTimeout(s, 330);
        playNav.end = s;
      }
