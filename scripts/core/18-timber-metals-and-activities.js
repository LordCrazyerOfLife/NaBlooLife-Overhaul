      function openTimber() {
        woodSt();
        const e = bestAxe(),
          t = woodTripsLeft(),
          a = state.logs || [];
        (sTitle.textContent = "WOODCUTTING"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities),
          (sList.innerHTML =
            '<div class="sec">Your Tools</div>' +
            (e
              ? `<div class="row"><img src="${e.ico}" alt=""><div class="t"><b>${e.name}</b><span>${e.desc}</span></div></div>`
              : '<div class="row dis"><img src="timber/axe-felling.png" alt=""><div class="t"><b>No axe</b><span>You can\'t fell a tree without one</span></div></div>') +
            WOOD_TOOLS.filter((e) => !e.axe && hasWT(e.id))
              .map(
                (e) =>
                  `<div class="row"><img src="${e.ico}" alt=""><div class="t"><b>${e.name}</b><span>${e.desc}</span></div></div>`,
              )
              .join("") +
            `<div class="row" data-w="shop"><img src="timber/barrel.png" alt=""><div class="t"><b>Hardware Store</b><span>Axes, saws, mauls, rope and log carts</span></div>${CHEV}</div>` +
            `<div class="sec">Go Cutting · ${t > 0 ? `${t} trip${1 === t ? "" : "s"} left this year` : "no trips left this year"} · you can haul ${haulCap().toLocaleString()} board feet</div>` +
            WOODS()
              .map(
                (e) =>
                  `<div class="row" data-wood="${e.k}"><img src="${TREES[e.mix[0][0]].img}" alt=""><div class="t"><b>${e.name}${e.far ? " <em>(far)</em>" : ""}</b><span>${[...new Set(e.mix.map(([e]) => TREES[e].name))].join(", ")}</span></div>${DOTS}</div>`,
              )
              .join("") +
            (a.length
              ? `<div class="sec">Your Timber</div><div class="row" data-w="assets"><img src="timber/pile.png" alt=""><div class="t"><b>${a.length} load${1 === a.length ? "" : "s"} in your Assets</b><span>Sell to the sawmill, furniture maker, shipyard or firewood dealer</span></div>${CHEV}</div>`
              : "")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-w]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), "shop" === e.dataset.w ? openWoodShop() : openAssets();
              }),
          ),
          sList.querySelectorAll("[data-wood]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), goWoods(WOODS().find((t) => t.k === e.dataset.wood));
              }),
          ),
          screen.classList.add("open");
      }
      function openWoodShop() {
        (sTitle.textContent = "HARDWARE STORE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openTimber),
          (sList.innerHTML = WOOD_TOOLS.map(
            (e) =>
              `<div class="row${hasWT(e.id) ? " dis" : ""}" data-wt="${e.id}"><img src="${e.ico}" alt=""><div class="t"><b>${e.name}${hasWT(e.id) ? " <em>(owned)</em>" : ""}</b><span>${hasWT(e.id) ? e.desc : `${usd(woodCash(e.price))} · ${e.desc}`}</span></div>${hasWT(e.id) ? "" : DOTS}</div>`,
          ).join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-wt]").forEach(
            (e) =>
              (e.onclick = () => {
                const t = WOOD_TOOLS.find((t) => t.id === e.dataset.wt);
                if (hasWT(t.id)) return;
                play("choice");
                const a = woodCash(t.price);
                jCard({
                  tag: "Hardware Store",
                  iconSrc: t.ico,
                  title: t.name,
                  close: !0,
                  lead: `${t.desc}.`,
                  rows: [
                    ["Price", usd(a)],
                    ...(t.power
                      ? [
                          [
                            "Chopping Power",
                            ["Basic", "Good", "Excellent"][WOOD_TOOLS.filter((e) => e.axe).indexOf(t)],
                          ],
                        ]
                      : []),
                    ["Bank Balance", usd(state.money)],
                  ],
                  choices: [
                    [
                      "Buy it",
                      () =>
                        state.age < 12
                          ? notice("Too young", "The storekeeper won't sell an axe to a child.", null, !0)
                          : state.money < a
                            ? notice("Not enough money", `That costs ${usd(a)}.`, null, !0)
                            : ((state.money = cents(state.money - a)),
                              woodSt().tools.push(t.id),
                              renderStats(),
                              play("coins"),
                              say(
                                `I bought ${/^[AEIOU]/.test(t.name) ? "an" : "a"} ${t.name.toLowerCase()}.`,
                              ),
                              void notice(
                                "Bought",
                                `You bought ${/^[AEIOU]/.test(t.name) ? "an" : "a"} ${t.name} for ${usd(a)}.`,
                                openWoodShop,
                                !0,
                              )),
                    ],
                  ],
                });
              }),
          ),
          screen.classList.add("open");
      }
      function goWoods(e) {
        const t = woodSt(),
          a = bestAxe();
        if (state.age < 12)
          return notice("Too young", "You are too young to go cutting trees alone.", null, !0);
        if (!a)
          return notice("No axe", "You need an axe to fell trees. Buy one at the hardware store.", null, !0);
        if (woodTripsLeft() <= 0)
          return notice(
            "No more trips",
            "You have cut all the timber you can this year. Try again next year.",
            null,
            !0,
          );
        if (e.far && !hasHorse("ride"))
          return notice(
            "Too far to walk",
            `${e.name} is days away. You need a riding horse to get there.`,
            null,
            !0,
          );
        t.trip.n++, e.far && play("gallop");
        const o = { F: e, stamina: 45 + Math.round(state.stats.Health / 2), haul: [], bf: 0 },
          n = haulCap(),
          s = () =>
            o.haul.length
              ? o.haul
                  .map((e) =>
                    "firewood" === e.kind
                      ? `${e.cords} cord${1 === e.cords ? "" : "s"} of firewood`
                      : `${e.bf.toLocaleString()} board feet of ${TREES[e.sp].name.toLowerCase()}`,
                  )
                  .join(", ")
              : "nothing",
          r = (a) => {
            evWrap.classList.remove("open"),
              (state.logs ||= []).push(...o.haul),
              (t.skill = Math.min(100, t.skill + 2 + o.haul.length)),
              say(
                o.haul.length
                  ? `I came home from the ${e.name.toLowerCase()} with ${s()}.`
                  : `I came home from the ${e.name.toLowerCase()} empty-handed.`,
              ),
              renderStats(),
              notice(
                e.name,
                `${a ? a + "<br><br>" : ""}${o.haul.length ? `You hauled home ${s()}. It's in your Assets.` : "You came home with nothing."}`,
                openTimber,
                !0,
              );
          },
          i = (e, t, a) => (
            (state.stats.Health = clamp(state.stats.Health - rint(e, t))),
            renderStats(),
            hurt(),
            state.stats.Health <= 0 &&
              (evWrap.classList.remove("open"), (o.haul = []), setTimeout(() => die(a), 400), !0)
          ),
          l = (t) => {
            if (state.dead) return;
            if (o.stamina <= 0) return r("Your arms are spent. You can't swing another blow today.");
            const a = eraRoll(e.mix.map(([e, t]) => [t, e]))[1],
              s = TREES[a],
              i = rint(...s.dia),
              d = Math.round(s.len * (0.75 + 0.4 * Math.random())),
              u = boardFeet(i, d),
              h = { sp: a, dia: i, len: d, bf: u, hp: Math.round(i * i * s.hard * 0.04) },
              p = woodCash("dead" === a ? (2.5 * u) / 500 : (s.price * u) / 1e3);
            jCard({
              tag: e.name,
              iconSrc: s.img,
              title: s.name,
              lead: `<img class="mine-scene" src="${s.img}" alt="">${t ? t + " " : ""}You find ${/^[AEIOU]/.test(s.name) ? "an" : "a"} ${s.name.toLowerCase()}, ${i} inches across and about ${d + rint(15, 30)} feet tall.`,
              rows: [
                ["Timber", "dead" === a ? "Firewood only" : `about ${u.toLocaleString()} board feet`],
                ["Worth", `about ${usd(p)}`],
                ["Your Strength", `${Math.max(0, o.stamina)} swings left`],
                ["Hauled", `${o.bf.toLocaleString()} of ${n.toLocaleString()} board feet`],
              ],
              choices: [
                ["Fell this tree", () => c(h)],
                [
                  "Look for another tree",
                  () => {
                    (o.stamina -= 3), l("You move on through the woods.");
                  },
                ],
                ["Head home", () => r("")],
              ],
            });
          },
          c = (e) => {
            const a = TREES[e.sp],
              n = e.hp,
              s = (t) =>
                jCard({
                  tag: "Felling",
                  iconSrc: a.img,
                  title: a.name,
                  lead: `<img class="mine-scene" src="${a.img}" alt="">${t || `Chips fly as you work into the ${e.dia}-inch trunk.`}`,
                  bars: [
                    ["Cut through", Math.round(100 * (1 - Math.max(0, e.hp) / n)), "#c0632b"],
                    ["Strength", Math.max(0, Math.min(100, o.stamina)), "#4caf50"],
                  ],
                  choices: [
                    ["Swing your axe", () => c(!1)],
                    ...(hasWT("saw") ? [["Saw with the crosscut", () => c(!0)]] : []),
                    ["Give up on this tree", () => l("You leave the half-cut tree standing."), "gray"],
                  ],
                }),
              c = (a) => {
                if (o.stamina <= 0) return r("You were too worn out to finish the tree.");
                if ((play(a ? "sawStroke" : "axeChop"), (o.stamina -= a ? 3 : 1), !a && chance(0.006))) {
                  if (i(6, 18, "an axe accident in the woods")) return;
                  return s("Your axe glances off a knot and bites into your leg!");
                }
                if (chance(0.003)) {
                  if (i(8, 24, "a falling branch in the woods")) return;
                  return s("A dead branch breaks loose high above and comes crashing down on you!");
                }
                if (
                  ((e.hp -= (a ? 4.5 : bestAxe().power) * (0.8 + 0.6 * Math.random()) * (1 + t.skill / 200)),
                  e.hp > 0)
                )
                  return s(
                    pickR([
                      "Thunk!",
                      "Chop!",
                      "Whack!",
                      "The blade bites deep.",
                      "Wood chips fly.",
                      "The trunk shudders.",
                    ]) + (e.hp < 0.25 * n ? " It's starting to creak." : ""),
                  );
                evWrap.classList.remove("open"), play("treeFall");
                const l = chance(hasWT("rope") ? 0.02 : 0.07);
                setTimeout(() => {
                  if (l) {
                    const a = e.dia >= 30;
                    if (i(a ? 25 : 10, a ? 70 : 30, "being crushed by a falling tree")) return;
                    t.skill = Math.min(100, t.skill + 1);
                  }
                  d(
                    e,
                    l
                      ? "The trunk twisted as it fell and came down the wrong way, clipping you as you dove clear!"
                      : pickR([
                          "TIMBER! The tree crashes to the ground.",
                          "With a long groan, the tree topples and hits the ground with a thud.",
                          "Timber! The tree comes down right where you wanted it.",
                        ]),
                  );
                }, 900);
              };
            s();
          },
          d = (e, t) => {
            const a = TREES[e.sp],
              s = n - o.bf,
              r = 500 / (hasWT("maul") ? 1.3 : 1),
              i =
                "spruce" === e.sp
                  ? "stump-snow"
                  : /maple|aspen/.test(e.sp)
                    ? "stump-autumn"
                    : "dead" === e.sp
                      ? pickR(["stump-broken", "stump-hollow"])
                      : pickR(["stump1", "stump2", "stump-moss", "stump-shroom"]),
              c = [];
            "dead" !== e.sp &&
              c.push([
                s >= e.bf
                  ? `Drag the logs out (${e.bf.toLocaleString()} board feet)`
                  : s > 50
                    ? `Drag out what you can (${s.toLocaleString()} board feet)`
                    : "Too much to haul already",
                () => {
                  if (s <= 50)
                    return d(
                      e,
                      "You can't haul any more. " +
                        (hasHorse()
                          ? hasWT("cart")
                            ? ""
                            : "A log cart would help."
                          : "A horse would let you haul far more."),
                    );
                  const t = Math.min(e.bf, s);
                  o.haul.push({
                    kind: "log",
                    sp: e.sp,
                    bf: t,
                    dia: e.dia,
                    at: state.birthYear + state.age,
                    hewn: !1,
                  }),
                    (o.bf += t),
                    l(`You drag ${t.toLocaleString()} board feet of ${a.name.toLowerCase()} to the trail.`);
                },
              ]),
              hasWT("bucksaw")
                ? c.push([
                    "Cut it into firewood",
                    () => {
                      if (o.stamina < 4) return d(e, "You are too tired to saw it into firewood.");
                      (o.stamina -= Math.min(12, 3 + Math.round(e.bf / 400))), play("sawStroke");
                      const t = Math.max(0.25, Math.round((Math.min(e.bf, s) / r) * 4) / 4);
                      if (s < 50) return d(e, "You can't haul any more.");
                      o.haul.push({ kind: "firewood", sp: e.sp, cords: t, at: state.birthYear + state.age }),
                        (o.bf += Math.round(t * r)),
                        l(`You saw and split it into ${t} cord${1 === t ? "" : "s"} of firewood.`);
                    },
                  ])
                : "dead" === e.sp &&
                  c.push([
                    "Break it up for firewood",
                    () => {
                      const t = Math.max(0.25, Math.round((Math.min(e.bf, s) / 500 / 2) * 4) / 4);
                      (o.stamina -= 5),
                        o.haul.push({
                          kind: "firewood",
                          sp: e.sp,
                          cords: t,
                          at: state.birthYear + state.age,
                        }),
                        (o.bf += 500 * t),
                        l(
                          `Without a saw you could only break off ${t} cord${1 === t ? "" : "s"} of firewood.`,
                        );
                    },
                  ]),
              c.push(["Leave it and move on", () => l("You leave the fallen tree where it lies."), "gray"]),
              jCard({
                tag: "Timber!",
                iconSrc: `timber/${i}.png`,
                title: `${a.name} Down`,
                lead: `<img class="mine-scene" src="timber/${i}.png" alt="">${t}`,
                rows: [
                  [
                    "Timber",
                    "dead" === e.sp ? "Rotten wood, firewood only" : `${e.bf.toLocaleString()} board feet`,
                  ],
                  ["Room to Haul", `${Math.max(0, s).toLocaleString()} board feet`],
                ],
                choices: c,
              });
          };
        l(
          e.far
            ? `You ride into the ${e.name}.`
            : `You head into the ${e.name.toLowerCase()} with your ${a.name.toLowerCase()}.`,
        );
      }
      function logRows() {
        const e = state.logs || [],
          t = state.wood,
          a = t ? WOOD_TOOLS.filter((e) => t.tools.includes(e.id)) : [];
        return e.length || a.length
          ? `<div class="sec">Timber${e.length ? ` · about ${usd(cents(e.reduce((e, t) => e + Math.max(...LOG_BUYERS(t).map(([, e]) => buyerPay(t, e))), 0)))}` : ""}</div>` +
              a
                .map(
                  (e) =>
                    `<div class="row"><img src="${e.ico}" alt=""><div class="t"><b>${e.name}</b><span>${e.desc}</span></div></div>`,
                )
                .join("") +
              e
                .map((e, t) => {
                  const a = TREES[e.sp],
                    o = state.birthYear + state.age - e.at;
                  return `<div class="row" data-log="${t}"><img src="${"firewood" === e.kind ? "timber/firewood.png" : e.hewn ? "timber/planks.png" : a.log}" alt=""><div class="t"><b>${"firewood" === e.kind ? `Firewood <em>(${e.cords} cord${1 === e.cords ? "" : "s"})</em>` : `${e.hewn ? "Hewn " : ""}${a.name} Logs <em>(${e.bf.toLocaleString()} bd ft)</em>`}</b><span>${o >= 2 && "firewood" !== e.kind ? '<span style="color:#c62828">Starting to rot</span> · ' : ""}worth up to ${usd(Math.max(...LOG_BUYERS(e).map(([, t]) => buyerPay(e, t))))}</span></div>${DOTS}</div>`;
                })
                .join("")
          : "";
      }
      function logCard(e) {
        const t = (state.logs || [])[e];
        if (!t) return;
        const a = TREES[t.sp],
          o = () => {
            renderStats(), openAssets();
          },
          n =
            "firewood" === t.kind
              ? `${t.cords} cord${1 === t.cords ? "" : "s"} of firewood`
              : `${t.bf.toLocaleString()} board feet of ${t.hewn ? "hewn " : ""}${a.name.toLowerCase()}`,
          s = LOG_BUYERS(t).map(([a, s]) => {
            const r = buyerPay(t, s);
            return [
              `Sell to the ${a.toLowerCase()} (${usd(r)})`,
              () => {
                state.logs.splice(e, 1),
                  (state.money = cents(state.money + r)),
                  play("coins"),
                  /Shipyard|Furniture|Wagon/.test(a) && (state.respect = clamp((state.respect ?? 40) + 1)),
                  say(`I sold ${n} to the ${a.toLowerCase()} for ${usd(r)}.`),
                  o();
              },
            ];
          });
        "log" === t.kind &&
          !t.hewn &&
          hasWT("broad") &&
          s.unshift([
            "Hew it into square timber",
            () => {
              (t.hewn = !0),
                play("axeChop"),
                (state.stats.Health = clamp(state.stats.Health - 2)),
                say(`I hewed ${n} into square timber with my broad axe.`),
                logCard(e);
            },
          ]),
          "firewood" === t.kind &&
            s.push([
              "Burn it to keep warm this winter",
              () => {
                state.logs.splice(e, 1),
                  (state.stats.Health = clamp(state.stats.Health + 3)),
                  (state.stats.Happiness = clamp(state.stats.Happiness + 3)),
                  say(`I burned ${n} to keep my home warm.`),
                  o();
              },
            ]),
          s.push([
            "Throw it away",
            () => {
              state.logs.splice(e, 1), say(`I got rid of ${n}.`), o();
            },
            "gray",
          ]),
          jCard({
            tag: "Timber",
            iconSrc: "firewood" === t.kind ? "timber/firewood.png" : a.log,
            title: "firewood" === t.kind ? "Firewood" : `${a.name} Logs`,
            close: !0,
            lead:
              "firewood" === t.kind
                ? "Seasoned firewood keeps for years."
                : "Sell your logs before they rot. Logs left lying more than two years start to go bad.",
            rows: [
              ["Amount", "firewood" === t.kind ? `${t.cords} cords` : `${t.bf.toLocaleString()} board feet`],
              ...(t.dia ? [["Trunk", `${t.dia} inches across`]] : []),
              ["Cut", t.at],
            ],
            choices: s,
          });
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || !(state.logs || []).length) return;
        const e = state.birthYear + state.age;
        let t = 0;
        (state.logs = state.logs.filter((a) => {
          const o = e - a.at;
          return ("firewood" === a.kind ? o > 6 : o > 3)
            ? (t++, !1)
            : ("log" === a.kind && o >= 2 && (a.bf = Math.round(0.7 * a.bf)), !0);
        })),
          t &&
            say(
              (1 === t ? "A load of my timber" : `${t} loads of my timber`) +
                " rotted away before I could sell it.",
            );
      });
      const GREENBACK = {
          1862: 113,
          1863: 145,
          1864: 203,
          1865: 157,
          1866: 141,
          1867: 138,
          1868: 140,
          1869: 133,
          1870: 115,
          1871: 112,
          1872: 112,
          1873: 114,
          1874: 111,
          1875: 115,
          1876: 111,
          1877: 105,
          1878: 101,
        },
        metalWobble = (e, t) => {
          const a = 43758.5453 * Math.sin(12.9898 * e + 78.233 * t);
          return 0.03 * (a - Math.floor(a) - 0.5);
        },
        paperK = (e) => ("us" === state.country && GREENBACK[e] ? GREENBACK[e] / 100 : 1),
        metalUsd = (e, t) =>
          priceAt(ORE_PRICE[e], t) * paperK(t) * (1 + metalWobble(t, "gold" === e ? 1 : 2)),
        metalMonth = (e, t, a) => {
          const o = metalUsd(e, t);
          return (
            (o + (metalUsd(e, t + 1) - o) * (a / 12)) *
            (1 + 1.4 * metalWobble(12 * t + a, "gold" === e ? 3 : 4))
          );
        },
        metalHist = (e, t) => {
          const a = [];
          for (let o = t - 5; o < t; o++) for (let t = 0; t < 12; t++) a.push(metalCash(metalMonth(e, o, t)));
          return a.push(metalCash(metalUsd(e, t))), a;
        },
        metalChart = (e, t) =>
          window.INVEST && INVEST.chart
            ? INVEST.chart(metalHist(e, t), ("gold" === e ? "Gold" : "Silver") + " · 5-Year Price per Ounce")
            : "",
        metalCash = (e) =>
          isOldEra() ? eraCash(e) : Math.max(1, Math.round(e * (PRICE_LVL[state.country] || 1))),
        METALS = () =>
          ("us" === state.country
            ? [
                ["gdollar", "Gold Dollar", "gold", 0.04837, "coin", 1849, 1889],
                ["qeagle", "Quarter Eagle ($2.50 gold piece)", "gold", 0.12094, "coin", 1800, 1929],
                ["heagle", "Half Eagle ($5 gold piece)", "gold", 0.24187, "coin", 1800, 1929],
                ["eagle", "Eagle ($10 gold piece)", "gold", 0.48375, "coin", 1800, 1933],
                ["deagle", "Double Eagle ($20 gold piece)", "gold", 0.9675, "coin", 1850, 1933],
                ["sdollar", "Silver Dollar", "silver", 0.77344, "coin", 1800, 1935],
              ]
            : [
                ["sov", "Gold Sovereign", "gold", 0.2354, "coin", 1817, 9999],
                ["halfsov", "Half Sovereign", "gold", 0.1177, "coin", 1817, 9999],
                ["guinea", "Gold Guinea", "gold", 0.2462, "coin", 1800, 1816],
                ["crown", "Silver Crown", "silver", 0.8406, "coin", 1800, 9999],
              ]
          )
            .concat([
              ["gbar", "Gold Bar (10 oz)", "gold", 10, "bar", 1800, 9999],
              ["sbar", "Silver Bar (10 oz)", "silver", 10, "bar", 1800, 9999],
              ["sbar100", "Silver Bar (100 oz)", "silver", 100, "bar", 1800, 9999],
            ])
            .map(([e, t, a, o, n, s, r]) => ({
              id: e,
              name: t,
              m: a,
              oz: o,
              kind: n,
              from: s,
              to: r,
              ico:
                "gold" === a
                  ? "bar" === n
                    ? "mining/gold-bar.png"
                    : "mining/gold-rich.png"
                  : "bar" === n
                    ? "mining/silver-bar.png"
                    : "mining/silver.png",
            })),
        metalItem = (e) =>
          METALS().find((t) => t.id === e) || {
            id: e,
            name: e,
            m: /^s/.test(e) ? "silver" : "gold",
            oz: 1,
            kind: "bar",
            ico: "mining/gold-bar.png",
          },
        metalBuy = (e, t) => cents(metalCash(metalUsd(e.m, t) * e.oz * ("bar" === e.kind ? 1.02 : 1.05))),
        goldBanned = (e) => "us" === state.country && e >= 1934 && e <= 1974,
        metalSell = (e, t) =>
          cents(
            metalCash(
              metalUsd(e.m, t) *
                e.oz *
                ("bar" === e.kind ? 0.98 : 0.96) *
                ("gold" === e.m && goldBanned(t) ? 0.8 : 1),
            ),
          ),
        metalsWorth = () =>
          cents(
            (state.metals || []).reduce(
              (e, t) => e + metalSell(metalItem(t.id), state.birthYear + state.age) * t.n,
              0,
            ),
          );
      function openMetals(e) {
        const t = state.birthYear + state.age,
          a = (state.metals ||= []);
        (sTitle.textContent = "PRECIOUS METALS"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = e || openAssets);
        const o = (e) =>
            `<span style="color:${e >= 0 ? "#2e9a45" : "#c62828"};font-weight:800">${e >= 0 ? "▲" : "▼"} ${Math.abs(100 * e).toFixed(1)}%</span>`,
          n = (e) => {
            const a = metalUsd(e, t),
              n = metalUsd(e, t - 1),
              s = metalUsd(e, t - 5);
            return `${usd(cents(metalCash(a)))} an ounce · ${o(a / n - 1)} this year · ${o(a / s - 1)} in 5 years`;
          },
          s = METALS().filter((e) => t >= e.from && t <= e.to && !("gold" === e.m && goldBanned(t)));
        (sList.innerHTML =
          (t >= 1900 && window.OLD_STOCKS
            ? `<div class="sec">Stocks</div><div class="row" data-ostk="1"><img src="freelife/apple/1f4c8.png" alt=""><div class="t"><b>Stock Exchange</b><span>${OLD_STOCKS.worth() ? `Your shares are worth ${usd(cents(OLD_STOCKS.worth()))}` : `Buy shares in ${OLD_STOCKS.listed(t).length} listed companies`}</span></div>${CHEV}</div>`
            : "") +
          `<div class="sec">Prices in ${t}${paperK(t) > 1 ? " · paid in paper money" : ""}</div>` +
          `<div class="row" data-mchart="gold"><img src="mining/gold-bar.png" alt=""><div class="t"><b>Gold</b><span>${n("gold")}</span></div>${CHEV}</div>` +
          `<div class="row" data-mchart="silver"><img src="mining/silver-bar.png" alt=""><div class="t"><b>Silver</b><span>${n("silver")}</span></div>${CHEV}</div>` +
          `<div style="padding:4px 10px 8px">${metalChart("gold", t)}</div>` +
          (goldBanned(t)
            ? '<div class="row"><img src="emoji/1f4dc.png" alt=""><div class="t"><b>Owning gold is against the law</b><span>The government banned private gold in 1933. Dealers won\'t sell it, and only shady buyers will take yours, at a discount.</span></div></div>'
            : "") +
          (paperK(t) > 1
            ? `<div class="row"><img src="emoji/1f4dc.png" alt=""><div class="t"><b>The war has paper money falling</b><span>Gold costs ${Math.round(100 * (paperK(t) - 1))}% more in paper dollars than its face value</span></div></div>`
            : "") +
          (a.length
            ? `<div class="sec">Your Vault · worth ${usd(metalsWorth())}</div>` +
              a
                .map((e, a) => {
                  const n = metalItem(e.id),
                    s = metalSell(n, t) * e.n,
                    r = e.paid || metalBuy(n, e.at) * e.n;
                  return `<div class="row" data-mh="${a}"><img src="${n.ico}" alt=""><div class="t"><b>${n.name} <em>(×${e.n})</em></b><span>Worth ${usd(cents(s))} · ${o(s / r - 1)} since you bought in ${e.at}</span></div>${DOTS}</div>`;
                })
                .join("")
            : "") +
          '<div class="sec">Buy from the Bullion Dealer</div>' +
          s
            .map(
              (e) =>
                `<div class="row" data-mb="${e.id}"><img src="${e.ico}" alt=""><div class="t"><b>${e.name}</b><span>${usd(metalBuy(e, t))} · ${e.oz < 1 ? `${e.oz.toFixed(3)} oz of ${e.m}` : `${e.oz} oz of ${e.m}`}</span></div>${DOTS}</div>`,
            )
            .join("")),
          (sList.scrollTop = 0);
        const r = sList.querySelector("[data-ostk]");
        r &&
          (r.onclick = () => {
            play("choice"), OLD_STOCKS.open(() => openMetals(e));
          }),
          sList.querySelectorAll("[data-mb]").forEach(
            (o) =>
              (o.onclick = () => {
                play("choice");
                const n = metalItem(o.dataset.mb),
                  s = metalBuy(n, t),
                  r = (o) => {
                    if (state.age < 16)
                      return notice("Too young", "The bullion dealer won't sell to a child.", null, !0);
                    if (state.money < s * o)
                      return notice("Not enough money", `That costs ${usd(cents(s * o))}.`, null, !0);
                    state.money = cents(state.money - s * o);
                    const r = a.find((e) => e.id === n.id && e.at === t);
                    r
                      ? ((r.n += o), (r.paid = cents((r.paid || 0) + s * o)))
                      : a.push({ id: n.id, n: o, at: t, paid: cents(s * o) }),
                      (state.metalsLast = metalsWorth()),
                      renderStats(),
                      play("coins"),
                      say(
                        `I bought ${1 === o ? `a ${n.name.toLowerCase()}` : `${o} × ${n.name.toLowerCase()}`} for ${usd(cents(s * o))}.`,
                      ),
                      openMetals(e);
                  };
                jCard({
                  tag: "Bullion Dealer",
                  iconSrc: n.ico,
                  title: n.name,
                  close: !0,
                  lead:
                    ("coin" === n.kind ? "Coins" : "Bars") +
                    " hold their value when banks fail. You can keep them, sell them, or leave them to your children.",
                  rows: [
                    ["Price", usd(s)],
                    [`${n.m[0].toUpperCase() + n.m.slice(1)}`, `${n.oz < 1 ? n.oz.toFixed(3) : n.oz} oz`],
                    ["Bank Balance", usd(state.money)],
                  ],
                  choices: [
                    ["Buy 1", () => r(1)],
                    ["Buy 5", () => r(5)],
                    ["Buy 20", () => r(20)],
                  ],
                });
                const i = ev.querySelector(".ev-btn");
                i && i.insertAdjacentHTML("beforebegin", metalChart(n.m, t));
              }),
          ),
          sList.querySelectorAll("[data-mchart]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice");
                const a = e.dataset.mchart,
                  n = metalUsd(a, t),
                  s = Math.max(...metalHist(a, t)),
                  r = Math.min(...metalHist(a, t));
                jCard({
                  tag: "Precious Metals",
                  iconSrc: `mining/${a}-bar.png`,
                  title: "gold" === a ? "Gold" : "Silver",
                  close: !0,
                  lead: `What an ounce of ${a} has sold for over the last five years.`,
                  rows: [
                    ["Price Now", `${usd(cents(metalCash(n)))} an ounce`],
                    ["This Year", o(n / metalUsd(a, t - 1) - 1)],
                    ["5-Year High", usd(cents(s))],
                    ["5-Year Low", usd(cents(r))],
                  ],
                  ok: () => {},
                });
                const i = ev.querySelector(".ev-btn");
                i && i.insertAdjacentHTML("beforebegin", metalChart(a, t));
              }),
          ),
          sList.querySelectorAll("[data-mh]").forEach(
            (n) =>
              (n.onclick = () => {
                play("choice");
                const s = a[+n.dataset.mh],
                  r = metalItem(s.id),
                  i = metalSell(r, t),
                  l = (t) => {
                    (s.n -= t),
                      s.n <= 0 && a.splice(a.indexOf(s), 1),
                      (state.money = cents(state.money + i * t)),
                      (state.metalsLast = metalsWorth()),
                      renderStats(),
                      play("coins"),
                      say(
                        `I sold ${1 === t ? `a ${r.name.toLowerCase()}` : `${t} × ${r.name.toLowerCase()}`} for ${usd(cents(i * t))}.`,
                      ),
                      openMetals(e);
                  },
                  c = s.paid || metalBuy(r, s.at) * s.n,
                  d = i * s.n;
                jCard({
                  tag: "Your Vault",
                  iconSrc: r.ico,
                  title: r.name,
                  close: !0,
                  lead: `You bought these in ${s.at}.`,
                  rows: [
                    ["You Own", s.n],
                    ["Sells For", `${usd(i)} each`],
                    ["You Paid", usd(cents(c))],
                    ["Worth Now", usd(cents(d))],
                    ["Gain or Loss", `${d >= c ? "+" : "−"}${usd(cents(Math.abs(d - c)))} (${o(d / c - 1)})`],
                  ],
                  choices: [
                    [
                      "Sell 1",
                      () => {
                        (s.paid = cents((c * (s.n - 1)) / s.n)), l(1);
                      },
                    ],
                    ...(s.n > 1 ? [[`Sell all ${s.n}`, () => l(s.n)]] : []),
                  ],
                });
                const u = ev.querySelector(".ev-btn");
                u && u.insertAdjacentHTML("beforebegin", metalChart(r.m, t));
              }),
          ),
          screen.classList.add("open");
      }
      function goldLaw(e) {
        const t = state.metals || [],
          a = t.filter((e) => "gold" === metalItem(e.id).m),
          o = (state.goldLaw ||= {});
        if ("us" !== state.country || (!a.length && !o.hid)) return !1;
        if (e >= 1933 && e <= 1974 && !o.order && a.length) {
          o.order = !0;
          const e = a.reduce((e, t) => e + metalItem(t.id).oz * t.n, 0),
            n = cents(metalCash(20.67 * e));
          return (
            queuePopup(() =>
              jCard({
                tag: "Executive Order 6102",
                iconSrc: "mining/gold-bars.png",
                title: "Turn In Your Gold",
                lead: "President Roosevelt has ordered every American to turn in their gold coins and bars to the Federal Reserve at $20.67 an ounce. Hoarding gold is now a crime punishable by prison.<br><br>Rumor says the government will raise the price of gold to $35 right after.",
                rows: [
                  ["Your Gold", Math.round(100 * e) / 100 + " oz"],
                  ["The Government Pays", usd(n)],
                ],
                choices: [
                  [
                    "Turn it in",
                    () => {
                      a.forEach((e) => t.splice(t.indexOf(e), 1)),
                        (state.money = cents(state.money + n)),
                        (state.metalsLast = metalsWorth()),
                        renderStats(),
                        play("coins"),
                        say(
                          `I turned in my gold to the government for ${usd(n)} under Executive Order 6102.`,
                        );
                    },
                  ],
                  [
                    "Hide it under the floorboards",
                    () => {
                      (o.hid = !0),
                        (state.respect = clamp((state.respect ?? 40) - 2)),
                        say("I hid my gold under the floorboards instead of turning it in.");
                    },
                  ],
                ],
              }),
            ),
            !0
          );
        }
        if (o.hid && e >= 1934 && e <= 1974 && a.length && chance(0.03)) {
          a.forEach((e) => t.splice(t.indexOf(e), 1));
          const e = cents(Math.min(state.money, metalCash(1e4)));
          return (
            (state.money = cents(state.money - e)),
            (state.metalsLast = metalsWorth()),
            renderStats(),
            say(
              `Treasury agents found the gold I had hidden. They seized it all${e ? ` and fined me ${usd(e)}` : ""}.`,
            ),
            queuePopup(() =>
              jCard({
                tag: "Treasury Agents",
                iconSrc: "mining/gold-bars.png",
                title: "Gold Seized",
                lead: `Treasury agents searched your home and found the gold you hid. They seized every ounce${e ? ` and fined you ${usd(e)}` : ""}.`,
                ok: () => {},
              }),
            ),
            (o.hid = !1),
            !0
          );
        }
        return (
          !(!o.hid || 1975 !== e || o.free) &&
          ((o.free = !0),
          (o.hid = !1),
          say("Owning gold became legal again, and I dug my hidden gold out from under the floorboards."),
          queuePopup(() =>
            jCard({
              tag: "Precious Metals",
              iconSrc: "mining/gold-bars.png",
              title: "Gold Is Legal Again",
              lead: "President Ford signed the law making it legal for Americans to own gold again. You pulled your hidden gold out from under the floorboards. It's worth far more than when you hid it.",
              ok: () => {},
            }),
          ),
          !0)
        );
      }
      function metalRows() {
        return !(state.metals || []).length || isOldEra()
          ? ""
          : `<div class="sec">Precious Metals</div><div class="row" data-metals="1"><img src="mining/gold-bars.png" alt=""><div class="t"><b>Your Vault</b><span>Gold and silver worth ${usd(metalsWorth())}</span></div>${CHEV}</div>`;
      }
      function eraRecolor() {
        if (eraRecolor.done) return;
        eraRecolor.done = !0;
        const e = (e, t, a, o) => {
            const [n, s, r] = ((e, t, a) => {
              (e /= 255), (t /= 255), (a /= 255);
              const o = Math.max(e, t, a),
                n = Math.min(e, t, a),
                s = (o + n) / 2,
                r = o - n;
              return r
                ? [
                    (60 * (o === e ? ((t - a) / r) % 6 : o === t ? (a - e) / r + 2 : (e - t) / r + 4) + 360) %
                      360,
                    r / (1 - Math.abs(2 * s - 1)),
                    s,
                  ]
                : [0, 0, s];
            })(e, t, a);
            if (s < 0.15 || n < 165 || n > 270) return null;
            const [i, l, c] = ((e, t, a) => {
                const o = (1 - Math.abs(2 * a - 1)) * t,
                  n = o * (1 - Math.abs(((e / 60) % 2) - 1)),
                  s = a - o / 2,
                  [r, i, l] = e < 60 ? [o, n, 0] : e < 120 ? [n, o, 0] : [o, 0, n];
                return [r, i, l].map((e) => Math.round(255 * (e + s)));
              })(26 + 0.12 * (n - 210), Math.min(0.5, 0.55 * s), 0.96 * r),
              d = Math.round(0.299 * i + 0.587 * l + 0.114 * c),
              u = null == o || 1 === o;
            return `color-mix(in srgb,${u ? `rgb(${i},${l},${c})` : `rgba(${i},${l},${c},${o})`} calc(100% - var(--egp,0%)),${u ? `rgb(${d},${d},${d})` : `rgba(${d},${d},${d},${o})`})`;
          },
          t = (t) => {
            let a = !1;
            const o = t
              .replace(/#([0-9a-f]{3,8})\b/gi, (t, o) => {
                if (![3, 4, 6, 8].includes(o.length)) return t;
                const n = o.length < 5 ? [...o].map((e) => e + e).join("") : o,
                  s = e(
                    parseInt(n.slice(0, 2), 16),
                    parseInt(n.slice(2, 4), 16),
                    parseInt(n.slice(4, 6), 16),
                    8 === n.length ? parseInt(n.slice(6, 8), 16) / 255 : null,
                  );
                return s && (a = !0), s || t;
              })
              .replace(
                /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)/gi,
                (t, o, n, s, r) => {
                  const i = e(+o, +n, +s, null == r ? null : /%$/.test(r) ? parseFloat(r) / 100 : +r);
                  return i && (a = !0), i || t;
                },
              );
            return a ? o : null;
          },
          a = (e) => {
            const t = [];
            let a = 0,
              o = "";
            for (const n of e)
              "(" === n && a++, ")" === n && a--, "," !== n || a ? (o += n) : (t.push(o), (o = ""));
            return (
              t.push(o),
              t
                .map((e) => e.trim())
                .filter(Boolean)
                .map((e) =>
                  /^html\b/.test(e)
                    ? e.replace(/^html/, "html.era1800")
                    : /^:root\b/.test(e)
                      ? e.replace(/^:root/, ":root.era1800")
                      : `html.era1800 ${e}`,
                )
                .join(",")
            );
          },
          o = (e) => {
            let n = "";
            for (const s of e) {
              if (s.cssRules && s.media) {
                const e = o(s.cssRules);
                e && (n += `@media ${s.media.mediaText}{${e}}`);
                continue;
              }
              if (!s.style || !s.selectorText) continue;
              let e = "";
              for (let a = 0; a < s.style.length; a++) {
                const o = s.style[a],
                  n = s.style.getPropertyValue(o),
                  r = n && t(n);
                r && (e += `${o}:${r}${s.style.getPropertyPriority(o) ? "!important" : ""};`);
              }
              e && (n += `${a(s.selectorText)}{${e}}`);
            }
            return n;
          };
        let n = "";
        for (const e of [...document.styleSheets])
          try {
            n += o(e.cssRules);
          } catch {}
        const s = document.createElement("style");
        (s.id = "eraCss"), (s.textContent = n), document.head.append(s);
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        const e = state.metals || [];
        if (state.dead || !e.length) return;
        const t = state.birthYear + state.age;
        if (goldLaw(t) || !e.length) return;
        const a = metalsWorth(),
          o = state.metalsLast ?? a;
        state.metalsLast = a;
        const n = (e) =>
            `<span style="color:${e >= 0 ? "#2e9a45" : "#c62828"};font-weight:800">${e >= 0 ? "▲" : "▼"} ${Math.abs(100 * e).toFixed(1)}%</span>`,
          s = metalUsd("gold", t) / metalUsd("gold", t - 1) - 1,
          r = metalUsd("silver", t) / metalUsd("silver", t - 1) - 1,
          i = o ? a / o - 1 : 0;
        say(
          `My gold and silver ${a >= o ? "gained" : "lost"} ${usd(cents(Math.abs(a - o)))} in value this year.`,
        ),
          setTimeout(
            () =>
              queuePopup(() => {
                jCard({
                  tag: "Precious Metals",
                  iconSrc: "mining/gold-bars.png",
                  title: `Gold & Silver in ${t}`,
                  lead:
                    a >= o
                      ? "Your vault of gold and silver gained value this year."
                      : "Your vault of gold and silver lost value this year.",
                  rows: [
                    ["Gold", `${usd(cents(metalCash(metalUsd("gold", t))))} an ounce · ${n(s)}`],
                    ["Silver", `${usd(cents(metalCash(metalUsd("silver", t))))} an ounce · ${n(r)}`],
                    ["Your Vault", `${usd(a)} · ${n(i)}`],
                  ],
                  ok: () => {},
                });
                const e = ev.querySelector(".ev-btn");
                e && e.insertAdjacentHTML("beforebegin", metalChart("gold", t));
              }),
            300,
          );
      });
      const E19_SMOKE = [
        [455, 140, 0, 7, -260, 480],
        [470, 134, 0, 7.5, -240, 520],
        [627, 122, 0, 9, -150, 380],
        [1195, 100, 0, 6.5, -160, 560],
        [1222, 92, 0, 6, -150, 600],
        [1300, 100, 0, 7, -140, 560],
        [1383, 68, 0, 6.5, -120, 520],
        [1458, 78, 0, 7, -110, 560],
        [1478, 58, 0, 6.2, -100, 600],
        [1505, 62, 0, 6.8, -120, 580],
        [1557, 70, 0, 7.4, -140, 520],
        [1302, 190, 1, 4.2, -320, 260],
      ];
      function e19Smoke() {
        const e = document.querySelector(".phone > .topbar");
        if (!e) return;
        let t = e.querySelector(".e19wrap");
        if (!t) {
          (t = document.createElement("div")),
            (t.className = "e19wrap"),
            (t.innerHTML = '<div class="e19box"></div>'),
            e.prepend(t);
          const a = t.firstChild;
          a.innerHTML = E19_SMOKE.map(([e, t, a, o, n, s]) =>
            Array.from(
              { length: 4 },
              (r, i) =>
                `<i class="${a ? "lt" : ""}" style="left:${e / 16.98}%;top:${t / 2.5}%;--d:${o}s;--w:${(-o / 4) * i - Math.random()}s;--dx:${n}%;--dy:${s}%;--s:${a ? 2.6 : 3.4}"></i>`,
            ).join(""),
          ).join("");
          const o = () => {
            const t = e.clientWidth,
              o = e.clientHeight,
              n = Math.max(t / 1698, o / 250),
              s = 1698 * n,
              r = 250 * n;
            Object.assign(a.style, {
              width: `${s}px`,
              height: `${r}px`,
              left: (t - s) / 2 + "px",
              top: (o - r) / 2 + "px",
            });
          };
          o(), window.ResizeObserver ? new ResizeObserver(o).observe(e) : addEventListener("resize", o);
        }
      }
      function eraTheme() {
        const e = isOldEra(),
          t = document.documentElement,
          a = document.querySelector(".phone");
        e && e19Smoke(), t.classList.contains("era1800") !== e && t.classList.toggle("era1800", e);
        const o = state.birthYear + state.age,
          n = e && o >= 1900 ? "1" : "0",
          s = e && o >= 1900 ? "0.85" : "0";
        t.style.getPropertyValue("--e1900") !== n && t.style.setProperty("--e1900", n),
          t.style.getPropertyValue("--egray") !== s &&
            (t.style.setProperty("--egray", s), t.style.setProperty("--egp", `${Math.round(100 * s)}%`));
        try {
          a &&
            !a.classList.contains("bl-locked") &&
            ("1800s" === localStorage.getItem("fl-era")) !== e &&
            localStorage.setItem("fl-era", e ? "1800s" : "");
        } catch {}
        a && a.classList.toggle("nosnow", e || !(window.blSettings && !1 !== blSettings.snow)),
          e &&
            !eraRecolor.done &&
            ("complete" === document.readyState
              ? eraRecolor()
              : addEventListener("load", eraRecolor, { once: !0 }));
      }
      function openActivities() {
        syncProfile(),
          (sTitle.textContent = "ACTIVITIES"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = X_ICON),
          (sBack.onclick = () => screen.classList.remove("open"));
        const e = {
            hunting: 6,
            timemachine: 1,
            doctor: 4,
            identity: 4,
            mindbody: 6,
            movies: 6,
            pets: 6,
            crime: 8,
            social: 13,
            love: 14,
            salon: 14,
            licenses: driveAge(),
            adoption: 21,
            emigrate: 18,
            fertility: 18,
            fight: 18,
            gamble: 18,
            horse: 18,
            loan: 18,
            lawsuit: 18,
            lottery: 18,
            nightlife: 18,
            pray: 18,
            rehab: 18,
            shopping: 18,
            sweepstakes: 18,
            vacation: 18,
            will: 18,
            surgery: 18,
            therapy: 6,
          },
          t = [
            ["accessories", "Accessories", "Accessorize yourself"],
            ["adoption", "Adoption", "Adopt a child (21+)", 1],
            ["crime", "Crime", "Commit a crime"],
            ["doctor", "Doctor", "Visit the doctor"],
            ["emigrate", "Emigrate", "Move to another country", 1],
            ["fertility", "Fertility", "Visit a fertility clinic"],
            ["fight", "Fight Betting", "Bet on an Ultimate Fighting League match", 1],
            ["gamble", "Gamble", "Visit a local casino"],
            ["horse", "Horse Races", "Go to the horse track", 1],
            ["hunting", "Hunting & Fishing", "Hunt game, fish, and sell what you catch"],
            ["identity", "Identity", "Define your identity"],
            ["lawsuit", "Lawsuit", "Sue someone", 1],
            ["licenses", "Licenses", "Manage your licenses"],
            ["loan", "Loan", "Borrow money", 1],
            ["lottery", "Lottery", "Play the lottery", 1],
            ["love", "Love", "Find someone to love"],
            ["mindbody", "Mind & Body", "Work on self-improvement"],
            ["movies", "Movie Theater", "Go to the movies"],
            ["nightlife", "Nightlife", "Go clubbing", 1],
            ["pets", "Pets", "Get a pet", 1],
            ["surgery", "Plastic Surgery", "Go under the knife"],
            ["pray", "Pray", "Pray to the BitLife devs", 1],
            ["rehab", "Rehab", "Battle your addictions"],
            ["salon", "Salon & Spa", "Take time for yourself"],
            ["shopping", "Shopping", "Go shopping", 1],
            ["social", "Social Media", "Manage your online identity"],
            ["sweepstakes", "Sweepstakes", "Enter the sweepstakes", 1],
            ["therapy", "Therapy", "Work on your mental health", 1],
            ["timemachine", "Time Machine", "Travel back in time", 1],
            ["vacation", "Vacation", "Go on a vacation"],
            ["will", "Will & Testament", "Manage your legacy", 1],
            ["zoo", "Zoo Trip", "Go to the zoo", 1],
          ],
          a = state.royal && !state.royal.abdicated;
        (sList.innerHTML =
          (a
            ? `<div class="sec">Special</div><div class="row" id="actRoyal"><img src="royal/crown.png"><div class="t"><b>Royalty</b><span>Manage your royal life</span></div>${CHEV}</div>`
            : "") +
          (isOldEra()
            ? '<div class="sec">1800s Activities</div>' +
              ERA_ACTS.map((e) => {
                const t = state.age < e.age;
                return `<div class="row${t ? " dis" : ""}" data-era="${e.k}"><img src="${e.ico}"><div class="t"><b>${e.t}</b><span>${e.s}</span></div>${t ? "" : DOTS}</div>`;
              }).join("")
            : "") +
          '<div class="sec">All</div>' +
          t
            .filter(
              (e) =>
                !(
                  ("zoo" === e[0] && document.querySelector(".phone").classList.contains("flui")) ||
                  ("therapy" === e[0] && window.FL_noMH && FL_noMH()) ||
                  (isOldEra() &&
                    /^(social|fertility|surgery|movies|nightlife|fight|therapy|rehab|hunting|licenses)$/.test(
                      e[0],
                    ))
                ),
            )
            .map(
              ([t, a, o, n, s]) =>
                `<div class="row${(s = s || state.age < (e[t] || 0)) ? " dis" : ""}" data-act="${t}"><img src="${"therapy" === t ? "emoji/1f6cb-fe0f" : "hunting" === t ? "2018/emoji/1f98c" : `act/${"emigrate" === t ? "passport" : t}`}.png"><div class="t"><b>${a}</b><span>${o}</span></div>${s ? "" : n ? DOTS : CHEV}</div>`,
            )
            .join("") +
          '<div class="act-surrender" id="actSurrender"><img src="act/surrender.png" alt=""><span>Surrender...</span></div>'),
          a && (document.getElementById("actRoyal").onclick = openRoyalty);
        const o = {
          crime: () => {
            play("choice"), openCrime();
          },
          adoption: () => {
            play("choice"), openAdoption();
          },
          accessories: openAccessories,
          horse: openHorseRaces,
          timemachine: () => {
            screen.classList.remove("open"), openTimeMachine();
          },
          will: willCard,
          licenses: () => drivingLicenseCard(),
          social: () => openSocial(openActivities),
          salon: openSalon,
          pets: openPets,
          love: openLove,
          doctor: openDoctorMenu,
          nightlife: openNightlife,
          gamble: () => {
            play("choice"), openCasinoGames();
          },
          pray: () => {
            snapClose(), prayCard();
          },
          mindbody: openMindBodyAct,
          surgery: () => {
            play("choice"), openSurgery();
          },
          vacation: () => {
            play("choice"), openVacation();
          },
          emigrate: () => {
            play("choice"), openEmigrate();
          },
          fight: () => {
            play("choice"), openFightBetting();
          },
          identity: openIdentity,
          lottery: openLottery,
          rehab: () => {
            play("choice"), openRehab();
          },
          movies: openMovies,
          lawsuit: openLawsuit,
          shopping: () =>
            withLoading(() => {
              syncProfile(),
                (sSub.style.display = "none"),
                openShopping("acts"),
                screen.classList.add("open");
            }),
          fertility: () => {
            play("choice"), openFertility();
          },
          therapy: () => {
            play("choice"), openTherapy();
          },
          hunting: () => {
            play("choice"), openHunting();
          },
        };
        sList.querySelectorAll("[data-era]").forEach(
          (e) =>
            (e.onclick = () => {
              e.classList.contains("dis") ||
                (play("choice"), eraAct(ERA_ACTS.find((t) => t.k === e.dataset.era)));
            }),
        ),
          sList.querySelectorAll("[data-act]").forEach(
            (e) =>
              (e.onclick = () => {
                if (e.classList.contains("dis")) return;
                const a = t.find((t) => t[0] === e.dataset.act);
                (o[a[0]] || comingSoon)();
              }),
          ),
          (document.getElementById("actSurrender").onclick = () => {
            const e = `${state.first} ${SURNAME}`,
              t = idCard(
                `<h4><img src="act/surrender.png" alt=""><span>Surrender</span></h4><div class="lead">Don't give up on ${e}!</div>\n        <button class="jm-apply ev-btn dk" id="srStay">Continue this life</button><button class="jm-apply ev-btn" id="srGo">Surrender</button>`,
                !0,
              );
            (document.getElementById("srStay").onclick = t),
              (document.getElementById("srGo").onclick = () =>
                iosConfirm("Confirm", `Are you sure you want to surrender the life of ${e}?`, () => {
                  t(), screen.classList.remove("open"), die("surrender");
                }));
          }),
          (sList.scrollTop = 0),
          screen.classList.add("open");
      }
      function openEmigrate() {
        document.getElementById("nlm")?.remove();
        const e = document.createElement("div");
        (e.id = "nlm"),
          document.querySelector(".phone").append(e),
          (e.style.opacity = 0),
          e.offsetWidth,
          (e.style.transition = "opacity .25s"),
          (e.style.opacity = 1);
        const t = () => {
            (e.style.opacity = 0), setTimeout(() => e.remove(), 250);
          },
          a = Object.keys(COUNTRIES)
            .filter((e) => e !== state.country)
            .sort((e, t) => COUNTRIES[e][0].localeCompare(COUNTRIES[t][0])),
          o = document.createElement("div");
        (o.className = "nl-page");
        let mode = "legal";
        const hasGold = () =>
            state.goldenPassport ||
            (typeof mktOwned === "function" && mktOwned().includes("passport")),
          legalCost = localPrice(2500),
          illegalCost = localPrice(800),
          goldCost = localPrice(150000);
        (o.innerHTML =
          `<button class="nl-back nl-x" data-close>${X_ICON}</button>\n      <div class="nl-head"><h2><img class="nl-ico" src="act/emigrate.png" alt="">Emigrate</h2><p>Leave legally, illegally, or with a golden passport.</p></div>\n      <div class="lead" id="emgInfo" style="font-size:12px;min-height:48px"></div>\n      <div class="sec">Route</div>\n      <button class="nl-btn c-green" data-mode="legal">Legal route — ${usd(legalCost)}</button>\n      <button class="nl-btn c-orange" data-mode="illegal">Illegal route — ${usd(illegalCost)}</button>\n      <button class="nl-btn c-yellow" data-mode="golden">${hasGold() ? "Golden Passport — ready" : `Buy Golden Passport — ${usd(goldCost)}`}</button>\n      <div class="sec">Destination</div>` +
          a
            .map(
              (e, t) =>
                `<button class="nl-btn c-${NL_COLS[t % NL_COLS.length]}" data-c="${e}"><img class="nl-ico" src="flags/${e}.png" alt="">${COUNTRIES[e][0]}</button>`,
            )
            .join("")),
          e.append(o),
          (o.querySelector("[data-close]").onclick = () => {
            play("dismiss"), t();
          });
        const info = () => {
            const el = document.getElementById("emgInfo");
            el &&
              (el.innerHTML =
                "legal" === mode
                  ? `Legal route: pay ${usd(legalCost)} and apply. About 75% of applications are approved. If denied, the fee is not refunded.`
                  : "illegal" === mode
                    ? `Illegal route: pay ${usd(illegalCost)} and sneak in. About 55% succeed. If caught, you are fined and get a criminal record.`
                    : hasGold()
                      ? "Golden Passport: guaranteed entry to any country, no questions asked."
                      : `Buy a Golden Passport for ${usd(goldCost)} and emigrate anywhere with guaranteed entry.`);
          },
          update = () => {
            o.querySelectorAll("[data-mode]").forEach((e) => {
              const t = e.dataset.mode === mode;
              (e.style.outline = t ? "2px solid #4da3ff" : ""),
                (e.style.opacity = t ? "1" : ".72");
            }),
              info();
          };
        o.querySelectorAll("[data-mode]").forEach(
          (b) =>
            (b.onclick = () => {
              const m = b.dataset.mode;
              if ("golden" === m && !hasGold()) {
                if (state.money < goldCost)
                  return notice("Flat broke", `You can't afford a Golden Passport.`, null, !1, brokeRows(goldCost));
                (state.money -= goldCost),
                  (state.goldenPassport = !0),
                  renderStats(),
                  play("choice"),
                  say("I bought a Golden Passport."),
                  notice(
                    "Golden Passport",
                    "You now have a Golden Passport. You can emigrate to any country with guaranteed entry.",
                    null,
                    !0,
                  ),
                  (b.textContent = "Golden Passport — ready");
              }
              (mode = m), play("choice"), update();
            }),
        ),
          update(),
          o.querySelectorAll("[data-c]").forEach(
            (c) =>
              (c.onclick = () => {
                play("choice");
                const a = c.dataset.c,
                  dest = (window.CITIES && CITIES[a]) || [COUNTRIES[a][1]],
                  fromCountry = state.country;
                if ("legal" === mode) {
                  if (state.money < legalCost)
                    return notice("Flat broke", `You can't afford the legal emigration fee.`, null, !1, brokeRows(legalCost));
                  (state.money -= legalCost), renderStats();
                  if (!chance(0.75))
                    return (
                      t(),
                      screen.classList.remove("open"),
                      say(`My application to emigrate to ${COUNTRIES[a][0]} was denied.`),
                      notice(
                        "Application denied",
                        `Your legal emigration application to ${COUNTRIES[a][0]} was denied. The fee was not refunded.`,
                        null,
                        !0,
                      ),
                      "function" == typeof saveLife && saveLife()
                    );
                } else if ("illegal" === mode) {
                  if (state.money < illegalCost)
                    return notice("Flat broke", `You can't afford the illegal route.`, null, !1, brokeRows(illegalCost));
                  (state.money -= illegalCost), renderStats();
                  if (!chance(0.55)) {
                    const fine = localPrice(5000);
                    return (
                      (state.money = Math.max(0, state.money - fine)),
                      (state.record = (state.record || 0) + 1),
                      renderStats(),
                      t(),
                      screen.classList.remove("open"),
                      say(`I was caught trying to enter ${COUNTRIES[a][0]} illegally and fined ${usd(fine)}.`),
                      notice(
                        "Caught at the border",
                        `You were caught trying to enter ${COUNTRIES[a][0]} illegally. You were fined ${usd(fine)} and now have a criminal record.`,
                        null,
                        !1,
                      ),
                      "function" == typeof saveLife && saveLife()
                    );
                  }
                } else if (!hasGold())
                  return notice(
                    "Golden Passport required",
                    "Buy a Golden Passport to use this route.",
                    null,
                    !0,
                  );
                leaveCountry(keepHousehold),
                  (state.country = a),
                  (state.city = dest[Math.floor(Math.random() * dest.length)]),
                  (state.immigration = { method: mode, from: fromCountry, to: a, at: state.age });
                const n = document.querySelector(".phone > .profile .pflag");
                (n.src = `flags/${a}.png`),
                  (n.alt = COUNTRIES[a][0]),
                  say(
                    `I emigrated to ${state.city}, ${COUNTRIES[a][0]} ${"golden" === mode ? "using my golden passport" : "legal" === mode ? "through the legal route" : "illegally"}.`,
                  ),
                  state.job &&
                    (say(
                      `I lost my job as ${/^[aeiou]/i.test(state.job.t) ? "an" : "a"} ${state.job.t} when I moved away.`,
                    ),
                    state.job.music &&
                      state.music &&
                      Object.assign(state.music, { signed: !1, band: null, former: !0 }),
                    (state.job = null),
                    renderAvatar(),
                    "function" == typeof updateDockTab && updateDockTab()),
                  t(),
                  screen.classList.remove("open"),
                  saveLife();
              }),
          );
      }
      new MutationObserver((e) => {
        isOldEra() &&
          e.forEach((e) =>
            e.addedNodes.forEach((e) => {
              if (1 === e.nodeType && "P" === e.tagName && !e.classList.contains("news"))
                return isModernText(e.textContent)
                  ? e.remove()
                  : void (
                      /elementary school|middle school|high school/i.test(e.textContent) &&
                      (e.innerHTML = e.innerHTML
                        .replace(/Elementary School/g, "Primary School")
                        .replace(/elementary school/g, "primary school")
                        .replace(/Middle School/g, "Grammar School")
                        .replace(/middle school/g, "grammar school")
                        .replace(/ High School/g, " Academy")
                        .replace(/from high school/g, "from the academy")
                        .replace(/high school/g, "the academy"))
                    );
            }),
          );
      }).observe(log, { childList: !0, subtree: !0 });
      const THEATER = {
          comedy: {
            ico: "emoji/1f602.png",
            stat: "Happiness",
            lineup: [2, 4],
            titles: [
              "Peter Poonhound",
              "Dude, Where's My Kidney?",
              "Grandma Got Tased",
              "The Hangunder",
              "Mall Cop 3: Escalation",
              "Step Brothers-in-Law",
              "Superfad",
              "Napoleon Dynamo",
              "Bridesmaids Gone Wild",
              "Meet the Fockingtons",
              "Zoolanderer",
              "Hot Tub Time Machine 4",
              "Anchorman: The Legend Continues Again",
              "Dumb and Dumbest",
              "The 41-Year-Old Virgin",
              "Nacho Libre 2: Extra Cheese",
              "Office Space Invaders",
              "Talladega Knights",
              "Borat Jr.",
              "Weekend at Bernie's Cousin's",
            ],
          },
          documentary: {
            ico: "emoji/1f9e0.png",
            stat: "Smarts",
            lineup: [0, 2],
            titles: [
              "Planet Dirt",
              "The Secret Life of Pigeons",
              "Blackfishing",
              "March of the Accountants",
              "Free Solo Cup",
              "Supersize Meal",
              "Making a Murderer's Sandwich",
              "Tiger Prince",
              "Inside the Mind of a Toaster",
              "Cosmos: Beyond Uranus",
              "My Octopus Landlord",
              "The Last Blockbuster Video",
              "Fyre and Ice",
              "Searching for Sugar Daddy",
              "Jiro Dreams of Pizza",
              "Bowling for Columbus",
            ],
          },
        },
        movieYear = () => {
          const e = state.movies;
          if (e && e.age === state.age) return e;
          const t = {};
          for (const [e, a] of Object.entries(THEATER))
            t[e] = [...a.titles].sort(() => Math.random() - 0.5).slice(0, rint(...a.lineup));
          return (state.movies = { age: state.age, lineup: t });
        };
      function openMovies() {
        (sTitle.textContent = "MOVIE THEATER"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities),
          (sList.innerHTML = [
            ["comedy", "Comedy", "Go see a comedy"],
            ["documentary", "Documentary", "Go see a documentary"],
          ]
            .map(
              ([e, t, a]) =>
                `<div class="row" data-mv="${e}"><img src="${THEATER[e].ico}"><div class="t"><b>${t}</b><span>${a}</span></div>${DOTS}</div>`,
            )
            .join("")),
          sList.querySelectorAll("[data-mv]").forEach((e) => (e.onclick = () => movieCard(e.dataset.mv))),
          (sList.scrollTop = 0),
          screen.classList.add("open");
      }
      function movieCard(e) {
        const t = THEATER[e],
          a = movieYear().lineup[e],
          o = e[0].toUpperCase() + e.slice(1);
        if (!a.length)
          return notice("No luck", `You are unable to find an interesting new ${e} to go see.`, null, !0);
        const n = a[0];
        jCard({
          tag: "Entertainment",
          iconSrc: t.ico,
          title: o,
          close: !0,
          lead: `Boost your ${t.stat.toLowerCase()} by going to see ${"comedy" === e ? "a comedy" : "a documentary"} today!`,
          rows: [
            ["Movie", n],
            ["Genre", o],
          ],
          choices: [
            [
              "Go see it",
              () => {
                a.shift(), screen.classList.remove("open");
                const o = rint(5, 100),
                  s = Math.max(0, Math.round((o - 20) / 12));
                (state.stats[t.stat] = clamp(state.stats[t.stat] + s)),
                  "documentary" === e &&
                    (state.stats.Happiness = clamp(state.stats.Happiness + (o >= 60 ? 1 : 0))),
                  renderStats(),
                  say(`I went to the theater to see '${n}'.`);
                notice(
                  o >= 85
                    ? "5 stars"
                    : o >= 65
                      ? "4 stars"
                      : o >= 45
                        ? "3 stars"
                        : o >= 25
                          ? "2 stars"
                          : "1 star",
                  `You went to the theater to see '${n}'.`,
                  null,
                  !0,
                  `<div class="ev-bars nb"><b>Your Enjoyment</b><i><u style="width:${o}%;background:${barCol(o)}"></u></i></div>`,
                );
              },
            ],
          ],
        });
      }
      function openIdentity() {
        syncProfile(),
          (sTitle.textContent = "IDENTITY"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const e = (e, t, a) =>
          `<div class="row" data-id="${e}"><img src="identity/${e}.png"><div class="t"><b>${t}</b><span>${a}</span></div>${DOTS}</div>`;
        (sList.innerHTML =
          e("gender", "Gender", "Identify your gender") +
          e("name", "Name Change", "Change your name") +
          e("sexuality", "Sexuality", "Declare your sexuality")),
          (sList.scrollTop = 0);
        const t = { gender: genderCard, name: nameChangeCard, sexuality: sexualityCard };
        sList.querySelectorAll("[data-id]").forEach((e) => (e.onclick = () => t[e.dataset.id]())),
          screen.classList.add("open");
      }
      const ID_X =
          '<svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg>',
        idCard = (e, t) => {
          ev.classList.remove("death18"),
            (ev.innerHTML =
              `<div class="jcw"><div class="jm-x" id="idX" style="left:-14px;top:-14px">${ID_X}</div>` +
              (t
                ? `<div class="ev-tag" style="margin-top:12px"><canvas class="ev-av" width="250" height="250"></canvas><span class="who">${state.first} ${SURNAME}</span><span class="kind">You</span></div>`
                : '<div class="jm-tag" style="margin-top:12px">Identity</div>') +
              e +
              "</div>"),
            t &&
              ev
                .querySelector("canvas.ev-av")
                .getContext("2d")
                .drawImage(document.querySelector(".phone > .profile canvas.avatar"), 0, 0),
            (ev.style.overflow = "visible");
          const a = () => {
            evWrap.classList.remove("open"), (ev.style.overflow = "");
          };
          return (
            (document.getElementById("idX").onclick = () => {
              play("dismiss"), a();
            }),
            evWrap.classList.add("open"),
            a
          );
        },
        birthGender = () => state.birthGender || PG(),
        genderLean = () => {
          return (state.genderLean ??=
            (e = Math.random()) < 0.9
              ? "Cisgender"
              : e < 0.94
                ? "Non-Binary"
                : e < 0.97
                  ? "Genderqueer"
                  : "Transgender");
          var e;
        },
        genderIdOf = () => state.genderId || "Cisgender";
      function genderCard() {
        const e = birthGender(),
          t = "Transgender " + ("m" === e ? "Female" : "Male"),
          a = ["Cisgender", "Genderqueer", "Non-Binary", t],
          o = "Transgender" === genderLean() ? t : genderLean(),
          n = genderIdOf(),
          s = idCard(
            `<h4><img src="identity/gender.png" alt=""><span>Gender</span></h4>\n      <div class="lead">You are feeling ${o.replace(/ (Fe)?male$/, "").toLowerCase()} tendencies.<br><br>How do you identify?</div>\n      <table class="jc"><tbody><tr><td><b>Birth Gender:</b> ${"f" === e ? "Female" : "Male"}</td></tr></tbody></table>\n      <label class="hr-lab">Pick your gender identity:</label><div class="hr-sel"><select id="idGender">${a.map((e) => `<option${e === (n.startsWith("Transgender") ? t : n) ? " selected" : ""}>${e}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn dk" id="idYes">That feels right</button><button class="jm-apply ev-btn" id="idNo">I'm not sure</button>`,
          );
        (document.getElementById("idNo").onclick = () => {
          s(), say("I'm still figuring out my gender identity.");
        }),
          (document.getElementById("idYes").onclick = () => {
            const a = document.getElementById("idGender").value;
            if ((s(), a === n || (a === t && n.startsWith("Transgender"))))
              return notice("Gender", `You already identify as ${a.toLowerCase()}.`, null, !0);
            const r = n.startsWith("Transgender"),
              i = a === t;
            (state.birthGender = e),
              (state.genderId = a),
              r !== i && ((state.gender = i ? ("m" === e ? "f" : "m") : e), (faceKey = ""), renderAvatar());
            fx({ Happiness: a === o ? rint(6, 12) : -rint(2, 6) }, ""),
              say(`I came out as ${a.toLowerCase()}.`),
              notice(
                a === o ? "Feels right" : "Hmm",
                `You now identify as ${a.toLowerCase()}.${a === o ? "" : "<br><br>It doesn't feel quite right."}`,
                null,
                !0,
              );
          });
      }
      function nameChangeCard() {
        if (state.age < 18)
          return notice("Name Change", "You must be 18 to legally change your name.", null, !0);
        const e = localPrice(200),
          t = PG(),
          a = idCard(
            `<h4><img src="identity/name.png" alt=""><span>Name Change</span></h4>\n      <div class="lead">File a request to legally change your name today!</div>\n      <table class="jc"><tbody><tr><td><b>Cost:</b> ${usd(e)}</td></tr></tbody></table>\n      <label class="hr-lab">First Name:</label><input class="pet-name-in" id="idFirst" maxlength="20" value="${uname(t)}"><div class="bb-rand" id="idFirstR">Pick Random</div>\n      <label class="hr-lab" style="margin-top:14px">Last Name:</label><input class="pet-name-in" id="idLast" maxlength="20" value="${ulast()}"><div class="bb-rand" id="idLastR">Pick Random</div>\n      <button class="jm-apply ev-btn" id="idFile" style="margin-top:22px">File a request</button>`,
            !0,
          );
        (document.getElementById("idFirstR").onclick = () => {
          document.getElementById("idFirst").value = uname(t);
        }),
          (document.getElementById("idLastR").onclick = () => {
            document.getElementById("idLast").value = ulast();
          }),
          (document.getElementById("idFile").onclick = () => {
            const t = (e) =>
                (e || "")
                  .replace(/[<>"&]/g, "")
                  .trim()
                  .slice(0, 20),
              o = t(document.getElementById("idFirst").value),
              n = t(document.getElementById("idLast").value);
            if (!o || !n) return;
            if ((a(), o === state.first && n === SURNAME))
              return notice("Name Change", "That's already your name!", null, !0);
            if (state.money < e)
              return notice(
                "Flat broke",
                "You can't afford to file a name change request.",
                null,
                !1,
                brokeRows(e),
              );
            (state.money -= e), renderStats(), screen.classList.remove("open");
            const s = `${state.first} ${SURNAME}`;
            (state.first = o),
              (SURNAME = n),
              (document.getElementById("pname").textContent = `${o} ${n}`),
              say(`I legally changed my name from ${s} to ${o} ${n}.`),
              notice(
                "New me",
                `Your request was approved!<br><br>You are now legally known as ${o} ${n}.`,
                null,
                !0,
              );
          });
      }
      const sexLean = () =>
        (state.sexLean ??=
          "Gay" === state.sexuality
            ? rint(70, 100)
            : "Bisexual" === state.sexuality
              ? rint(34, 66)
              : chance(0.9)
                ? rint(0, 20)
                : rint(21, 60));
      function sexualityCard() {
        if (state.age < 13)
          return notice("Sexuality", "You're too young to know your sexuality yet.", null, !0);
        const e = sexLean(),
          t = e <= 33 ? "Straight" : e <= 66 ? "Bisexual" : "Gay",
          a = idCard(
            `<h4><img src="identity/sexuality.png" alt=""><span>Sexuality</span></h4>\n      <div class="lead">You are feeling ${e <= 15 ? "very strong heterosexual" : e <= 33 ? "heterosexual" : e <= 66 ? "bisexual" : e <= 85 ? "homosexual" : "very strong homosexual"} tendencies.<br><br>What are you?</div>\n      ${["Straight", "Bisexual", "Gay"].map((e) => `<button class="jm-apply ev-btn${e === t ? " dk" : ""}" data-s="${e}">I'm ${e.toLowerCase()}</button>`).join("")}`,
          );
        ev.querySelectorAll("[data-s]").forEach(
          (e) =>
            (e.onclick = () => {
              const o = e.dataset.s,
                n = state.sexuality || "Straight";
              if ((a(), o === n))
                return notice("Sexuality", `You already identify as ${o.toLowerCase()}.`, null, !0);
              (state.sexuality = o),
                fx({ Happiness: o === t ? rint(5, 12) : -rint(3, 8) }, ""),
                say(`I came out as ${o.toLowerCase()}.`),
                notice(
                  o === t ? "Out and proud" : "Hmm",
                  `You now identify as ${o.toLowerCase()}.${o === t ? "" : "<br><br>It doesn't feel quite right."}`,
                  null,
                  !0,
                );
            }),
        );
      }
      const UFM = (e) => {
          new Audio(`sounds/a16_SFX_UFM_${e}.wav`).play().catch(() => {});
        },
        UF_X =
          '<svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg>',
        ufFighter = (e) => ({
          g: e,
          first: uname(e),
          last: any(LAST),
          age: rint(21, 36),
          look: null,
          odds: rint(1, 9),
        }),
        SUIT_YEARS = 3;
      function addSuit({ name: e, who: t, reason: a, strength: o = 0.45, scale: n = 2e4, org: s = !1 }) {
        e &&
          !state.dead &&
          ((state.suits = (state.suits || []).filter((t) => !(t.name === e && t.reason === a))),
          state.suits.push({
            name: e,
            who: t,
            reason: a,
            strength: o,
            org: s,
            scale: Math.max(1e3, Math.round(n)),
            until: state.age + SUIT_YEARS,
          }));
      }
      const openSuits = () => (state.suits || []).filter((e) => e.until >= state.age),
        nice = (e) => {
          const t = 10 ** Math.max(0, Math.floor(Math.log10(e)) - 1);
          return Math.max(100, Math.round(e / t) * t);
        },
        SUIT_FIRMS = [
          "Buckley & Associates",
          "Hayes & Associates",
          "Chislehurst & Associates",
          "Goldberg Law Group",
          "Pierce & Pierce",
          "Whitmore Legal",
          "Sterling & Sons",
          "Dewey Cheatham & Howe",
          "Ramirez Law Offices",
          "Kowalski & Partners",
          "Abernathy & Lowe",
          "Blackwood Legal",
        ],
        SUIT_WIN = [
          ["When there's a will...", "Justice!", "Cha-ching", "Case closed"],
          ["Don't catch me in the streets", "Objection!", "Not guilty", "Overruled"],
        ],
        SUIT_REACT = [
          "{n} burst into tears as the verdict was read.",
          "{n} called you a gold digger on the courthouse steps.",
          "{n} laughed at you as you left the courtroom.",
          "{n} threatened to kill you as you left the courtroom.",
          "{n} stormed out of the courtroom.",
          "{n} shook your hand and apologized.",
        ];
      function openLawsuit() {
        const e = openSuits();
        if (!e.length)
          return notice(
            "Lawsuit",
            "You don't have anyone to sue right now.<br><br>When someone wrongs you, you'll have a few years to file a lawsuit against them.",
            null,
            !0,
          );
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="lsX" style="left:-14px;top:-14px">${ID_X}</div><div class="jm-tag" style="margin-top:12px">Legal</div>\n      <h4><img src="act/lawsuit.png" alt=""><span>Lawsuit</span></h4>\n      <div class="lead">File a lawsuit against someone today!</div>\n      <label class="hr-lab">Pick your target:</label><div class="hr-sel"><select id="lsWho">${e.map((e, t) => `<option value="${t}">${e.name} (${e.who})</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="lsGo">Find a law firm</button></div>`),
          (ev.style.overflow = "visible");
        (document.getElementById("lsX").onclick = () => {
          play("dismiss"), evWrap.classList.remove("open"), (ev.style.overflow = "");
        }),
          (document.getElementById("lsGo").onclick = () =>
            lawFirmCard(e[+document.getElementById("lsWho").value])),
          evWrap.classList.add("open");
      }
      function lawFirmCard(e) {
        const t = [0.5, 1, 2, 4, 8].map((t) => localPrice(nice(e.scale * t * (0.9 + 0.2 * Math.random())))),
          a = [...SUIT_FIRMS].sort(() => Math.random() - 0.5).slice(0, 3),
          o = [
            [0.25, 0.35],
            [0.6, 0.8],
            [1.1, 1.3],
          ].map(([e, a]) => localPrice(nice(t[1] * (e + Math.random() * (a - e)))));
        ev.innerHTML = `<div class="jcw"><div class="jm-x" id="lsX" style="left:-14px;top:-14px">${ID_X}</div><div class="jm-tag" style="margin-top:12px">Legal</div>\n      <h4><img src="act/lawsuit.png" alt=""><span>Law Firm</span></h4>\n      <div class="lead">Which local law firm will you hire to sue ${e.name} for ${e.reason}?</div>\n      <table class="jc"><tbody>${a.map((e, t) => `<tr><td><b>${e}:</b> ${usd(o[t])}</td></tr>`).join("")}</tbody></table>\n      <label class="hr-lab">Pick your damages:</label><div class="hr-sel"><select id="lsDmg">${t.map((e, t) => `<option value="${t}"${1 === t ? " selected" : ""}>${usd(e)}</option>`).join("")}</select></div>\n      ${a.map((e, t) => `<button class="jm-apply ev-btn" data-f="${t}">${e}</button>`).join("")}</div>`;
        const n = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("lsX").onclick = () => {
          play("dismiss"), n();
        }),
          ev.querySelectorAll("[data-f]").forEach(
            (s) =>
              (s.onclick = () => {
                const r = +s.dataset.f,
                  i = +document.getElementById("lsDmg").value,
                  l = o[r],
                  c = t[i];
                if ((n(), state.money < l))
                  return notice("Flat broke", `You can't afford to hire ${a[r]}.`, null, !1, brokeRows(l));
                (state.money -= l),
                  renderStats(),
                  screen.classList.remove("open"),
                  (state.suits = state.suits.filter((t) => t !== e));
                const d = Math.max(
                    0.05,
                    Math.min(0.92, e.strength + [0, 0.12, 0.22][r] - [0, 0.05, 0.1, 0.18, 0.28][i]),
                  ),
                  u = `${/^(your|my) /i.test(e.who) ? "" : "your "}${e.who.toLowerCase()}, ${e.name}`;
                if ((say(`I hired ${a[r]} for ${usd(l)} to sue ${e.name} for ${e.reason}.`), !chance(d)))
                  return (
                    say(`I lost my lawsuit against ${e.name}.`),
                    notice(
                      pickR(SUIT_WIN[1]),
                      `You lost your lawsuit against ${u}, for ${e.reason}.`,
                      null,
                      !0,
                      `<table class="nt"><tr><td><b>Legal Fees:</b> ${usd(l)}</td></tr></table>`,
                    )
                  );
                (state.money += c),
                  renderStats(),
                  new Audio("sounds/a16_sndCasinoWin1.wav").play().catch(() => {}),
                  say(`I won my lawsuit against ${e.name} and was awarded ${usd(c)}.`);
                const h = e.org
                  ? `${e.name} ${pickR(["announced it would appeal the verdict.", "refused to comment.", "blamed the ruling on a rogue manager."])}`
                  : pickR(SUIT_REACT).replace("{n}", `Your ${e.who.toLowerCase()}, ${e.name},`);
                notice(
                  pickR(SUIT_WIN[0]),
                  `You won your lawsuit against ${u}, for ${e.reason}!<br><br>${h}`,
                  null,
                  !0,
                  `<table class="nt"><tr><td><b>Legal Fees:</b> ${usd(l)}</td></tr><tr><td><b>Payout:</b> ${usd(c)}</td></tr></table>`,
                );
              }),
          );
      }
      const LOTTO_TEN = 0.01,
        LOTTO_ONE = 0.005,
        lottoPot = () => (
          (state.lotto && state.lotto.age === state.age) ||
            (state.lotto = { age: state.age, pot: localPrice(1e6 * rint(15, 80) + rint(0, 999999)) }),
          state.lotto.pot
        );
      function openLottery() {
        const e = localPrice(5),
          t = lottoPot();
        state.lottoYear !== state.age && ((state.lottoYear = state.age), (state.lottoBought = 0));
        const bought = () => state.lottoBought || 0;
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="ltX" style="left:-14px;top:-14px">${ID_X}</div><div class="jm-tag" style="margin-top:12px">Leisure</div>\n      <h4><img src="emoji/1f4b0.png" alt=""><span>Lottery</span></h4>\n      <div class="lead">Buy a lottery ticket today! The jackpot is life-changing, but the odds are tiny.</div>\n      <table class="jc"><tbody><tr><td><b>Ticket Cost:</b> ${usd(e)}</td></tr><tr><td><b>Jackpot:</b> ${usd(t)}</td></tr><tr><td><b>Tickets this year:</b> ${bought()} / 1000</td></tr></tbody></table>\n      <div class="lead" style="font-size:12px">Odds: 1 ticket = 0.5%, 10+ tickets = 1%. Maximum 1,000 tickets per year.</div>\n      <button class="jm-apply ev-btn" data-n="1">Buy 1 ticket</button><button class="jm-apply ev-btn" data-n="10">Buy 10 tickets</button><button class="jm-apply ev-btn" data-n="50">Buy 50 tickets</button><button class="jm-apply ev-btn" data-n="100">Buy 100 tickets</button></div>`),
          (ev.style.overflow = "visible");
        const a = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("ltX").onclick = () => {
          play("dismiss"), a();
        }),
          ev.querySelectorAll("[data-n]").forEach(
            (o) =>
              (o.onclick = () => {
                const n = +o.dataset.n,
                  s = e * n,
                  remaining = 1000 - bought();
                if (n > remaining)
                  return (
                    a(),
                    notice(
                      "Annual limit",
                      `You can only buy ${remaining} more ticket${1 === remaining ? "" : "s"} this year.`,
                      null,
                      !0,
                    )
                  );
                return (
                  a(),
                  state.money < s
                    ? notice(
                        "Flat broke",
                        `You can't afford ${1 === n ? "a lottery ticket" : `${n} lottery tickets`}.`,
                        null,
                        !1,
                        brokeRows(s),
                      )
                    : ((state.money -= s),
                      (state.lottoBought = bought() + n),
                      renderStats(),
                      screen.classList.remove("open"),
                      say(1 === n ? "I bought a lottery ticket." : `I bought ${n} lottery tickets.`),
                      chance(n >= 10 ? LOTTO_TEN : LOTTO_ONE)
                        ? ((state.money += t),
                          (state.lotto = null),
                          (state.lottoWins = (state.lottoWins || 0) + 1),
                          renderStats(),
                          new Audio("sounds/a16_sndCasinoWin1.wav").play().catch(() => {}),
                          say(`I won the ${usd(t)} lottery jackpot!`),
                          void notice("Oh my god", `You won the ${usd(t)} lottery jackpot!`, null, !0))
                        : notice("Jackpot...not!", "You did not win the lottery jackpot.", null, !0))
                );
              }),
          ),
          evWrap.classList.add("open");
      }
      function openAdoption() {
        if (state.age < 21)
          return notice("Too young", "You must be at least 21 years old to adopt a child.", null, !0);
        const costOf = (age) => localPrice(12000 + age * 800);
        let gender = "f" === PG() ? "f" : "m",
          age = 6,
          selected = 0,
          picks = [],
          name = uname(gender);
        const newPicks = () => {
          picks = [0, 1, 2].map(() => randomLook(gender, age));
          selected = 0;
        };
        const close = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        const draw = () => {
          ev.classList.remove("death18"),
            (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="adX" style="left:-14px;top:-14px">${ID_X}</div><div class="jm-tag" style="margin-top:12px">Family</div>\n      <h4><img src="act/adoption.png" alt=""><span>Adoption</span></h4>\n      <div class="lead">Choose a child to welcome into your family. You can adopt at any age from 0 to 18.</div>\n      <table class="jc"><tbody><tr><td><b>Adoption Cost:</b> ${usd(costOf(age))}</td></tr><tr><td><b>Your Age:</b> ${state.age}</td></tr></tbody></table>\n      <label class="hr-lab">Age</label><div class="hr-sel"><select id="adAge">${Array.from({ length: 19 }, (_, i) => `<option value="${i}"${i === age ? " selected" : ""}>${i} year${1 === i ? "" : "s"} old (${i < 3 ? "Baby" : i < 13 ? "Child" : i < 18 ? "Teen" : "Adult"})</option>`).join("")}</select></div>\n      <label class="hr-lab">Gender</label><div class="hr-sel"><select id="adGender"><option value="f"${gender === "f" ? " selected" : ""}>Girl</option><option value="m"${gender === "m" ? " selected" : ""}>Boy</option></select></div>\n      <label class="hr-lab">Name</label><input class="pet-name-in" id="adName" maxlength="20" value="${name}"><div class="bb-rand" id="adRand">Pick Random</div>\n      <label class="hr-lab">Last Name</label><div class="hr-sel"><select id="adLast"><option>${SURNAME}</option><option>${ulast()}</option><option>${ulast()}</option></select></div>\n      <label class="hr-lab" style="margin-top:14px">Appearance</label><div class="bb-rand" id="adLook">New looks</div>\n      <div class="adopt-faces" style="display:flex;gap:8px;justify-content:center;margin:6px 0 12px">${picks.map((e, t) => `<div class="adopt-face" data-k="${t}" style="cursor:pointer;padding:4px;border:2px solid ${t === selected ? "#4da3ff" : "transparent"};border-radius:12px;background:${t === selected ? "rgba(77,163,255,.18)" : "transparent"}"></div>`).join("")}</div>\n      <button class="jm-apply ev-btn" id="adGo">Adopt ${name}</button></div>`);
          ev.querySelectorAll(".adopt-face").forEach((el, i) => {
            el.replaceWith(npcFace(picks[i], gender, age, "happy", "ev-av"));
            el.dataset && el.classList.add("adopt-face");
          });
          ev.querySelectorAll(".ev-av").forEach((el, i) => {
            (el.dataset.k = i),
              (el.style.cursor = "pointer"),
              (el.style.padding = "4px"),
              (el.style.borderRadius = "12px"),
              (el.style.border = `2px solid ${i === selected ? "#4da3ff" : "transparent"}`),
              (el.onclick = () => {
                selected = i;
                const n = document.getElementById("adName").value;
                draw();
                document.getElementById("adName").value = n;
              });
          });
          (document.getElementById("adX").onclick = () => {
            play("dismiss"), close();
          }),
            (document.getElementById("adAge").onchange = (e) => {
              age = +e.target.value;
              newPicks();
              draw();
            }),
            (document.getElementById("adGender").onchange = (e) => {
              gender = e.target.value;
              name = uname(gender);
              newPicks();
              draw();
            }),
            (document.getElementById("adRand").onclick = () => {
              document.getElementById("adName").value = uname(gender);
            }),
            (document.getElementById("adLook").onclick = () => {
              newPicks();
              draw();
            }),
            (document.getElementById("adGo").onclick = () => {
              const first =
                  (document.getElementById("adName").value || "")
                    .replace(/[<>"&]/g, "")
                    .trim()
                    .slice(0, 20) || uname(gender),
                last = document.getElementById("adLast").value || SURNAME,
                cost = costOf(age);
              if (state.money < cost)
                return notice("Flat broke", `You can't afford the ${usd(cost)} adoption fee.`, null, !1, brokeRows(cost));
              (state.money -= cost),
                state.family.push({
                  kind: "child",
                  g: gender,
                  first,
                  last,
                  ageOffset: age - state.age,
                  look: { ...picks[selected] },
                  rel: rint(70, 100),
                  otherParent: state.spouse ? `${state.spouse.first} ${state.spouse.last}` : "Adoption agency",
                  smarts: rint(20, 100),
                  looks: rint(20, 100),
                  adopted: !0,
                  adoptedAge: age,
                  adoptedAt: state.age,
                }),
                (state.stats.Happiness = clamp(state.stats.Happiness + 12)),
                play("baby"),
                renderStats(),
                close(),
                screen.classList.remove("open"),
                say(`I adopted a ${age}-year-old ${gender === "f" ? "girl" : "boy"} named ${first} ${last}.`),
                notice(
                  "A new family member",
                  `You adopted ${first} ${last}, age ${age}. ${first} is now part of your family.`,
                  null,
                  !0,
                ),
                "function" == typeof saveLife && saveLife();
            });
        };
        newPicks(), (ev.style.overflow = "visible"), draw(), evWrap.classList.add("open");
      }
      function openFightBetting() {
        const e = localPrice(100),
          t = [0, 1].map(() => {
            const e = chance(0.8) ? "m" : "f",
              t = ufFighter(e);
            let a = ufFighter(e);
            for (; a.last === t.last; ) a = ufFighter(e);
            return (t.look = randomLook(e, t.age)), (a.look = randomLook(e, a.age)), [t, a];
          });
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="ufX" style="left:-14px;top:-14px">${UF_X}</div><div class="jm-tag" style="margin-top:12px">Leisure</div>\n      <h4><img src="fight/icon.png" alt=""><span>Fight Betting</span></h4>\n      <div class="lead">Go to an Ultimate Fighting League fight and bet on the outcome today!</div>\n      <table class="jc"><tbody><tr><td><b>Admission:</b> ${usd(e)}</td></tr></tbody></table>\n      ${t.map(([e, t], a) => `<button class="jm-apply ev-btn" data-b="${a}">${e.last} v. ${t.last}</button>`).join("")}</div>`),
          (ev.style.overflow = "visible");
        const a = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("ufX").onclick = () => {
          play("dismiss"), a();
        }),
          ev.querySelectorAll("[data-b]").forEach(
            (o) =>
              (o.onclick = () => {
                const n = t[+o.dataset.b];
                if (state.money < e)
                  return a(), notice("Flat broke", "You can't afford the admission.", null, !1, brokeRows(e));
                (state.money -= e),
                  renderStats(),
                  screen.classList.remove("open"),
                  say(
                    `I went to an Ultimate Fighting League match between ${n[0].first} ${n[0].last} and ${n[1].first} ${n[1].last}.`,
                  ),
                  fightBetCard(n);
              }),
          ),
          evWrap.classList.add("open");
      }
      function fightBetCard(e) {
        const [t, a] = e,
          o = Math.max(1, Math.min(state.money, 1e6));
        (ev.style.overflow = ""),
          (ev.innerHTML = `<div class="jcw"><div class="jm-tag" style="margin-top:12px">Fight</div>\n      <h4><img src="fight/icon.png" alt=""><span>${t.last} vs ${a.last}</span></h4>\n      <div class="lead">This Ultimate Fighting League match is between ${t.last} and ${a.last}.<br><br>Place your bets!</div>\n      <table class="jc"><tbody><tr><td><b>Bank Balance:</b> ${usd(state.money)}</td></tr><tr><td><b>${t.last}'s Odds:</b> ${t.odds}:1</td></tr><tr><td><b>${a.last}'s Odds:</b> ${a.odds}:1</td></tr></tbody></table>\n      <label class="hr-lab">Pick your fighter:</label><div class="hr-sel"><select id="ufPick"><option value="0">${t.last}</option><option value="1">${a.last}</option></select></div>\n      ${state.money >= 1 ? `<div class="gm-row"><span class="hr-lab" style="margin:0">Bet</span><b id="ufAmt">${usd(1)}</b></div>\n      <input type="range" class="gm-range" id="ufRange" min="1" max="${o}" value="1">\n      <button class="jm-apply ev-btn" id="ufBet">Place a bet!</button>` : ""}\n      <button class="jm-apply ev-btn" id="ufWatch">I'll just watch</button></div>`);
        const n = document.getElementById("ufRange");
        if (n) {
          const t = () => Math.max(1, Math.round(((+n.value - 1) / Math.max(1, o - 1)) ** 2 * (o - 1) + 1));
          (n.oninput = () => (document.getElementById("ufAmt").textContent = usd(t()))),
            (document.getElementById("ufBet").onclick = () => {
              const a = t(),
                o = +document.getElementById("ufPick").value;
              (state.money -= a),
                renderStats(),
                UFM("PlaceFightBet"),
                say(`I bet ${usd(a)} that ${e[o].first} ${e[o].last} would win.`),
                fightNight(e, o, a);
            });
        }
        (document.getElementById("ufWatch").onclick = () => fightNight(e, -1, 0)),
          evWrap.classList.add("open");
      }
      function fightNight(e, t, a) {
        const [o, n] = e,
          s = [o, n],
          r = chance(n.odds / (o.odds + n.odds)) ? 0 : 1,
          i = 1 - r;
        (ev.style.overflow = ""),
          (ev.style.overflowX = "hidden"),
          (ev.innerHTML = `<div class="uf-flash"></div><div class="jcw"><div class="jm-tag" style="margin-top:12px">Fight Night</div>\n      <h4><img src="fight/icon.png" alt=""><span>${o.last} vs ${n.last}</span></h4>\n      <table class="jc" style="margin-bottom:6px"><tbody>${t >= 0 ? `<tr><td><b>Your Fighter:</b> ${s[t].last}</td></tr><tr><td><b>Your Bet:</b> ${usd(a)}</td></tr>` : "<tr><td>You're just here to watch.</td></tr>"}</tbody></table>\n      <div class="uf-ring">${s.map((e, t) => `<div class="uf-f" data-f="${t}"><div class="uf-body"><i></i>\n        <img class="uf-g l" src="fight/glove-${t ? "blue" : "red"}-left.png" alt=""><img class="uf-g r" src="fight/glove-${t ? "blue" : "red"}-right.png" alt=""></div></div>`).join("")}</div>\n      <div class="uf-hp">${s.map((e) => `<div>${e.last}<div class="uf-bar"><u></u></div></div>`).join("")}</div>\n      <div class="uf-win" id="ufWin"></div>\n      <button class="jm-apply ev-btn" id="ufGo">Let's get it on!</button></div>`);
        const l = ev.querySelector(".uf-flash"),
          c = [...ev.querySelectorAll(".uf-f")],
          d = [...ev.querySelectorAll(".uf-bar u")];
        c.forEach((e, t) => e.querySelector("i").replaceWith(npcFace(s[t].look, s[t].g, s[t].age, "happy")));
        const u = [
            { x: 0.3, y: 0.4, tx: 0.3, ty: 0.4, hp: 100, rot: 0 },
            { x: 0.7, y: 0.58, tx: 0.7, ty: 0.58, hp: 100, rot: 0 },
          ],
          h = () =>
            u.forEach((e, t) => {
              (c[t].style.left = 100 * e.x + "%"),
                (c[t].style.top = 100 * e.y + "%"),
                (c[t].style.transform = `translate(-50%,-50%) rotate(${e.rot}deg)`);
            }),
          p = (e, t) => {
            const a = e - 0.5,
              o = t - 0.5,
              n = Math.hypot(a, o);
            return n > 0.3 ? [0.5 + (a / n) * 0.3, 0.5 + (o / n) * 0.3] : [e, t];
          };
        h();
        let m = !1;
        (document.getElementById("ufGo").onclick = (e) => {
          e.currentTarget.remove(), UFM("ReadyToRumble");
          let o = performance.now(),
            n = 0.9,
            f = 0,
            g = [0, 0],
            y = null;
          const b = { x: 0.5, y: 0.5 },
            v = () => {
              const e = chance(u[i].hp < 30 ? 0.8 : 0.6) ? r : i,
                t = 1 - e,
                a = u[e],
                o = u[t];
              if (Math.hypot(a.x - o.x, a.y - o.y) > 0.32) return;
              const n = c[e].querySelectorAll(".uf-g")[rint(0, 1)],
                s = o.x - a.x,
                h = o.y - a.y,
                f = Math.hypot(s, h) || 1;
              (n.style.transform = `translate(${(s / f) * 120}%,${(h / f) * 120}%) scale(1.15)`),
                setTimeout(() => {
                  n.style.transform = "";
                }, 140),
                setTimeout(() => {
                  if (m) return;
                  if (chance(0.25)) return UFM(any(["BlockedHit", "BlockedHit_2", "BlockedHit_3"]));
                  const e = t === r ? rint(7, 13) : rint(16, 26);
                  if (
                    ((o.hp = t === r ? Math.max(18, o.hp - e) : o.hp - e),
                    ((e) => {
                      const t = Math.max(0, u[e].hp);
                      (d[e].style.width = t + "%"),
                        (d[e].style.background = t > 50 ? "#2fa03b" : t > 25 ? "#f5841f" : "#d0312d");
                    })(t),
                    UFM(any(["Hit", "Hit_2", "Hit_3", "Hit_4", "HitDouble"])),
                    l.classList.remove("on"),
                    l.offsetWidth,
                    l.classList.add("on"),
                    ([o.x, o.y] = p(o.x + (s / f) * 0.05, o.y + (h / f) * 0.05)),
                    o.hp <= 0)
                  ) {
                    (m = !0), UFM(any(["Knockout", "Knockout_2", "Knockout_3"]));
                    const e = s >= 0 ? 1 : -1;
                    y = { t: 0, x0: o.x, y0: o.y, x1: e > 0 ? 1.35 : -0.35, y1: o.y + (h / f) * 0.25 };
                  }
                }, 80);
            },
            w = (e) => {
              const l = Math.min(50, e - o) / 1e3;
              if (((o = e), (f += l), y)) {
                y.t += l / 0.55;
                const e = u[i],
                  o = 1 - (1 - Math.min(1, y.t)) ** 2;
                (e.x = y.x0 + (y.x1 - y.x0) * o), (e.y = y.y0 + (y.y1 - y.y0) * o), (e.rot += 1100 * l);
                const n = u[r];
                return (
                  (n.x += (0.5 - n.x) * Math.min(1, 1.6 * l)),
                  (n.y += (0.52 - n.y) * Math.min(1, 1.6 * l)),
                  h(),
                  y.t >= 1 &&
                    !y.hit &&
                    ((y.hit = !0), UFM(any(["PostKnockoutWallImpact", "PostKnockoutWallImpact_2"]))),
                  y.t < 3.2
                    ? requestAnimationFrame(w)
                    : (() => {
                        const e = s[r],
                          o = `${e.first} ${e.last}`,
                          n = t === r;
                        (document.getElementById("ufWin").textContent = o),
                          setTimeout(() => {
                            (document.getElementById("ufWin").textContent = `${o} won!`),
                              UFM("BettingFightEnds");
                          }, 900),
                          setTimeout(() => {
                            evWrap.classList.remove("open"),
                              (ev.style.overflow = ""),
                              (ev.style.overflowX = "");
                            const e = a * s[t < 0 ? 0 : t].odds;
                            if (t < 0)
                              return (
                                say(`${o} won the Ultimate Fighting League match.`),
                                notice("Ding DING", `${o} won the match!`, null, !0)
                              );
                            if (n)
                              return (
                                (state.money += a + e),
                                renderStats(),
                                new Audio("sounds/a16_sndCasinoWin1.wav").play().catch(() => {}),
                                say(`I won ${usd(e)} after betting that ${o} would win.`),
                                notice(
                                  "Ding DING",
                                  `${o} won the match!<br><br>You won ${usd(e)} by betting that ${o} would win.`,
                                  null,
                                  !0,
                                )
                              );
                            const r = s[t],
                              i = `${r.first} ${r.last}`;
                            say(`I lost ${usd(a)} after betting that ${i} would win.`),
                              notice(
                                "Ding DING",
                                `${o} won the match!<br><br>You lost ${usd(a)} by betting that ${i} would win.`,
                                null,
                                !0,
                              );
                          }, 4200);
                      })()
                );
              }
              (g[0] -= l) <= 0 &&
                (([b.x, b.y] = p(0.5 + 0.34 * (Math.random() - 0.5), 0.5 + 0.34 * (Math.random() - 0.5))),
                (g[0] = 1 + 1.2 * Math.random())),
                u.forEach((e, t) => {
                  const a = u[1 - t];
                  ((g[1] -= l / 2) <= 0 || null == e.gap) &&
                    ((e.gap = 0.1 + 0.03 * Math.random()),
                    (e.dy = 0.1 * (Math.random() - 0.5)),
                    t && (g[1] = 0.5 + 0.6 * Math.random())),
                    ([e.tx, e.ty] = p(b.x + (t ? 1 : -1) * e.gap, b.y + e.dy)),
                    (e.x += (e.tx - e.x) * Math.min(1, 2.2 * l)),
                    (e.y += (e.ty - e.y) * Math.min(1, 2.2 * l));
                  const o = e.x - a.x,
                    n = e.y - a.y,
                    s = Math.hypot(o, n);
                  s < 0.19 &&
                    s > 0 &&
                    ((e.x += (o / s) * (0.19 - s) * 0.5), (e.y += (n / s) * (0.19 - s) * 0.5)),
                    ([e.x, e.y] = p(e.x, e.y));
                }),
                h(),
                !m && f >= n && (v(), (n = f + 0.45 + 0.5 * Math.random())),
                requestAnimationFrame(w);
            };
          requestAnimationFrame(w);
        }),
          evWrap.classList.add("open");
      }
