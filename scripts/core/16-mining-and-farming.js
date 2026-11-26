      function openMining() {
        const e = mineSt();
        (sTitle.textContent = "MINING"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const t = mineTripsLeft(),
          a = bestPick(),
          o = hasMTool("lantern") || hasMTool("davy");
        (sList.innerHTML =
          '<div class="sec">Gear</div>' +
          (a
            ? `<div class="row"><img src="${a.ico}" alt=""><div class="t"><b>${a.name}</b><span>${a.p.dur} swings before it wears out</span></div></div>`
            : '<div class="row"><img src="mining/pick1.png" alt=""><div class="t"><b>No pickaxe</b><span>You can\'t mine without one</span></div></div>') +
          `<div class="row"><img src="${o ? MINE_TOOLS.find((e) => e.id === (hasMTool("davy") ? "davy" : "lantern")).ico : "mining/candle.png"}" alt=""><div class="t"><b>${o ? (hasMTool("davy") ? "Davy Safety Lamp" : "Miner's Lantern") : `${e.candles} candle${1 === e.candles ? "" : "s"}`}</b><span>${o ? "Lights every trip" : e.candles ? "One candle per trip" : "You need light to go underground"}</span></div></div>` +
          (e.charges
            ? `<div class="row"><img src="mining/dynamite.png" alt=""><div class="t"><b>${e.charges} ${chargeName(e.charges)}</b><span>${hasMTool("drill") ? "Ready for blasting" : "You need a hammer and drill to use them"}</span></div></div>`
            : "") +
          `<div class="row" data-m="shop"><img src="mining/chest.png" alt=""><div class="t"><b>Mining Supply Store</b><span>Pickaxes, lamps, candles, rope, blasting powder</span></div>${CHEV}</div>` +
          `<div class="sec">Your Map · ${t > 0 ? `${t} trip${1 === t ? "" : "s"} left this year` : "no trips left this year"}</div>` +
          `<div class="row" data-m="find"><img src="mining/rope.png" alt=""><div class="t"><b>Search for a Cave</b><span>Explore the hills for caves and mineral signs</span></div>${DOTS}</div>` +
          e.caves
            .map(
              (e, t) =>
                `<div class="row" data-cave="${t}"><img src="${e.img}" alt=""><div class="t"><b>${e.name}${e.claim ? " <em>(your claim)</em>" : ""}</b><span>${CAVE_KIND[e.kind]} · ${regionOf(e.reg).name}${e.left <= 0 ? " · worked out" : ""}</span></div>${DOTS}</div>`,
            )
            .join("") +
          ((state.ore || []).length
            ? `<div class="sec">Your Ore</div><div class="row" data-m="assets"><img src="mining/sack.png" alt=""><div class="t"><b>${state.ore.length} lot${1 === state.ore.length ? "" : "s"} in your Assets</b><span>Assay, smelt, cut, sell, or keep them in the family</span></div>${CHEV}</div>`
            : "")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-m]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice");
                const t = e.dataset.m;
                "shop" === t ? openMineShop() : "assets" === t ? openAssets() : "find" === t && prospect();
              }),
          ),
          sList.querySelectorAll("[data-cave]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), caveCard(+e.dataset.cave);
              }),
          ),
          screen.classList.add("open");
      }
      function openMineShop() {
        const e = mineSt();
        (sTitle.textContent = "SUPPLY STORE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openMining);
        const t = MINE_TOOLS.filter((e) => !e.from || yearNow() >= e.from);
        (sList.innerHTML =
          '<div class="sec">Tools</div>' +
          t
            .map((e) => {
              const t = !e.pick && hasMTool(e.id);
              return `<div class="row" data-tool="${e.id}"><img src="${e.ico}" alt=""><div class="t"><b>${e.name}</b><span>${t ? "Owned" : usd(eraCash(e.price))} · ${e.desc}</span></div>${t ? "" : DOTS}</div>`;
            })
            .join("") +
          `<div class="sec">Supplies · ${e.candles} candles · ${e.charges} ${chargeName(e.charges)}</div>` +
          MINE_SUPPLY()
            .map(
              (e) =>
                `<div class="row" data-sup="${e.id}"><img src="${e.ico}" alt=""><div class="t"><b>${e.name}</b><span>${usd(eraCash(e.price))} · ${e.desc}</span></div>${DOTS}</div>`,
            )
            .join("")),
          (sList.scrollTop = 0);
        const a = (e) =>
          state.age < 12
            ? (notice("Too young", "The storekeeper won't sell mining gear to a child.", null, !0), !1)
            : !(state.money < e) || (notice("Not enough money", `That costs ${usd(e)}.`, null, !0), !1);
        sList.querySelectorAll("[data-tool]").forEach(
          (t) =>
            (t.onclick = () => {
              const o = MINE_TOOLS.find((e) => e.id === t.dataset.tool),
                n = eraCash(o.price);
              if (!o.pick && hasMTool(o.id)) return;
              const s = o.pick && e.picks.find((e) => e.id === o.id && e.dur > 0);
              jCard({
                tag: "Supply Store",
                iconSrc: o.ico,
                title: o.name,
                lead: `${o.desc}.`,
                close: !0,
                rows: [
                  ["Price", usd(n)],
                  ...(o.pick
                    ? [
                        ["Lasts", `${o.dur} swings`],
                        [
                          "Digging Power",
                          ["Basic", "Good", "Excellent"][MINE_TOOLS.filter((e) => e.pick).indexOf(o)],
                        ],
                      ]
                    : []),
                  ...(s ? [["You Have", `${s.dur} swings left`]] : []),
                  ["Bank Balance", usd(state.money)],
                ],
                choices: [
                  [
                    "Buy it",
                    () => {
                      a(n) &&
                        ((state.money = cents(state.money - n)),
                        o.pick ? e.picks.push({ id: o.id, dur: o.dur }) : e.tools.push(o.id),
                        renderStats(),
                        say(
                          `I bought ${/^[AEIOU]/.test(o.name) ? "an" : "a"} ${o.name.toLowerCase().replace(/^prospector/, "prospector")}.`,
                        ),
                        notice(
                          "Bought",
                          `You bought ${/^[AEIOU]/.test(o.name) ? "an" : "a"} ${o.name} for ${usd(n)}.`,
                          openMineShop,
                          !0,
                        ));
                    },
                  ],
                ],
              });
            }),
        ),
          sList.querySelectorAll("[data-sup]").forEach(
            (t) =>
              (t.onclick = () => {
                const o = MINE_SUPPLY().find((e) => e.id === t.dataset.sup),
                  n = eraCash(o.price),
                  s = (t) => {
                    a(n * t) &&
                      ((state.money = cents(state.money - n * t)),
                      (e[o.id] += o.n * t),
                      renderStats(),
                      say(
                        `I bought ${1 === t ? `a ${o.name.toLowerCase()}` : `${t} × ${o.name.toLowerCase()}`}.`,
                      ),
                      notice(
                        "Supplies",
                        `You now have ${e[o.id]} ${"candles" === o.id ? "candles" : chargeName(e[o.id])}.`,
                        openMineShop,
                        !0,
                      ));
                  };
                jCard({
                  tag: "Supply Store",
                  iconSrc: o.ico,
                  title: o.name,
                  lead: `${o.desc}.`,
                  close: !0,
                  rows: [
                    ["Price", usd(n)],
                    ["Bank Balance", usd(state.money)],
                  ],
                  choices: [
                    ["Buy 1", () => s(1)],
                    ["Buy 5", () => s(5)],
                  ],
                });
              }),
          ),
          screen.classList.add("open");
      }
      const mineBack = (e, t, a, o) => {
        screen.classList.remove("open"), eraFx(o || {}), say(a), notice(e, a, openMining, !0);
      };
      function prospect() {
        const e = mineSt();
        return state.age < 12
          ? notice("Too young", "You are too young to go exploring caves alone.", null, !0)
          : mineTripsLeft() <= 0
            ? notice(
                "No more trips",
                "You have explored enough for this year. Try again next year.",
                null,
                !0,
              )
            : e.caves.length >= 6
              ? notice(
                  "Map is full",
                  "Your map already has six caves marked. Forget one before you search for another.",
                  null,
                  !0,
                )
              : void jCard({
                  tag: "Prospecting",
                  iconSrc: "mining/rope.png",
                  title: "Search for a Cave",
                  lead: "Where will you go looking? Faraway diggings are days away and need a riding horse.",
                  close: !0,
                  choices: regionsOpen().map((t) => [
                    `${t.name}${t.far ? " (far)" : ""}`,
                    () => {
                      if (t.far && !hasHorse("ride"))
                        return notice(
                          "Too far to walk",
                          `${t.name} is days away. You need a riding horse to get there.`,
                          null,
                          !0,
                        );
                      const a = t.far ? 2 : 0.25;
                      if (state.money < eraCash(a))
                        return notice(
                          "Not enough money",
                          `You need ${usd(eraCash(a))} for provisions.`,
                          null,
                          !0,
                        );
                      if (
                        (e.trip.n++,
                        eraFx({ money: -a }),
                        t.far && play("gallop"),
                        !chance(0.6 + 0.003 * e.skill))
                      )
                        return (
                          (e.skill = Math.min(100, e.skill + 1)),
                          mineBack(
                            "Prospecting",
                            "mining/rope.png",
                            pickR([
                              `I spent days searching the ${t.name} and found nothing but snakes and scrub.`,
                              `I searched the ${t.name}, but every cave I found had already been worked out.`,
                              `I got caught in a storm in the ${t.name} and came home with nothing.`,
                            ]),
                            { Happiness: -2 },
                          )
                        );
                      const o = newCave(t),
                        n = caveSigns(o);
                      (e.skill = Math.min(100, e.skill + 2)),
                        jCard({
                          tag: "Prospecting",
                          iconSrc: o.img,
                          title: o.name,
                          close: !0,
                          lead: `${mineScene(o)}You found ${/^[AEIOU]/.test(CAVE_KIND[o.kind]) ? "an" : "a"} ${CAVE_KIND[o.kind].toLowerCase()} in the ${t.name}. ${chance(0.75) ? `You spot traces of ${n[0]} near the entrance.` : "You can't make out any mineral signs from the entrance."}`,
                          rows: [
                            ["Type", CAVE_KIND[o.kind]],
                            ["Depth", "placer" === o.kind ? "Creek bed" : `${o.depth} levels`],
                            ["Region", t.name],
                            ["Known for", n.join(", ") || "stone"],
                          ],
                          choices: [
                            [
                              "Mark it on my map",
                              () => {
                                e.caves.push(o),
                                  say(`I found ${o.name} in the ${t.name} and marked it on my map.`),
                                  notice(
                                    "Marked",
                                    `${o.name} is on your map. Go down whenever you're ready.`,
                                    openMining,
                                    !0,
                                  );
                              },
                            ],
                            [
                              "Leave it",
                              () => {
                                say(`I found a cave in the ${t.name} but decided it wasn't worth my time.`),
                                  openMining();
                              },
                              "gray",
                            ],
                          ],
                        });
                    },
                  ]),
                });
      }
      function caveCard(e) {
        const t = mineSt(),
          a = t.caves[e];
        if (!a) return;
        const o = regionOf(a.reg),
          n = [];
        a.left > 0 && n.push(["placer" === a.kind ? "Work the creek" : "Go down", () => descend(a)]),
          !a.claim &&
            a.left > 0 &&
            n.push([
              `Stake a claim (${usd(claimCost(a))})`,
              () => {
                const e = claimCost(a);
                return state.age < 18
                  ? notice("Too young", "You must be 18 to file a mining claim.", null, !0)
                  : state.money < e
                    ? notice("Not enough money", `Filing and buying the claim costs ${usd(e)}.`, null, !0)
                    : ((state.money = cents(state.money - e)),
                      (a.claim = !0),
                      renderStats(),
                      (state.respect = clamp((state.respect ?? 40) + 2)),
                      say(`I staked a mining claim on ${a.name}.`),
                      void notice(
                        "Claim filed",
                        `${a.name} is now your claim. You can hire miners to work it for you, and it passes to your heirs.`,
                        openMining,
                        !0,
                      ));
              },
            ]),
          a.claim && n.push(["Manage my claim", () => claimCard(a)]),
          n.push([
            "Forget this cave",
            () =>
              iosConfirm(
                "Forget Cave",
                `Remove ${a.name} from your map?${a.claim ? " You will give up your claim." : ""}`,
                () => {
                  t.caves.splice(e, 1), openMining();
                },
              ),
            "gray",
          ]),
          jCard({
            tag: a.claim ? "Your Claim" : "Your Map",
            iconSrc: a.img,
            title: a.name,
            close: !0,
            lead: mineScene(a),
            rows: [
              ["Type", CAVE_KIND[a.kind]],
              ["Region", o.name],
              ["Depth", "placer" === a.kind ? "Creek bed" : `${a.depth} levels`],
              ["Known for", caveSigns(a).join(", ")],
              [
                "Worked",
                a.left <= 0
                  ? "Worked out"
                  : a.left > 75
                    ? "Untouched"
                    : a.left > 40
                      ? "Partly worked"
                      : "Nearly worked out",
              ],
              ...(a.claim ? [["Miners", `${a.workers}`]] : []),
            ],
            choices: n,
          });
      }
      function claimCard(e) {
        const t = cents(claimCost(e) * (1 + e.rich) * (0.8 + 0.8 * Math.random()));
        jCard({
          tag: "Your Claim",
          iconSrc: "mining/cart-gold.png",
          title: e.name,
          close: !0,
          lead: `You own the claim on ${e.name}. Hired miners dig all year and add their ore to your Assets. Each miner costs ${usd(workerWage())} a year.`,
          rows: [
            ["Miners", `${e.workers}`],
            ["Yearly Wages", usd(cents(workerWage() * e.workers))],
            ["Bank Balance", usd(state.money)],
            ["Buyer Offer", usd(t)],
          ],
          choices: [
            ...(e.workers < 8 && e.left > 0
              ? [
                  [
                    "Hire a miner",
                    () => {
                      if (state.money < workerWage())
                        return notice(
                          "Not enough money",
                          `You need ${usd(workerWage())} to pay a miner's first year.`,
                          null,
                          !0,
                        );
                      e.workers++, say(`I hired a miner to work my claim on ${e.name}.`), claimCard(e);
                    },
                  ],
                ]
              : []),
            ...(e.workers
              ? [
                  [
                    "Let a miner go",
                    () => {
                      e.workers--, say(`I let a miner go from ${e.name}.`), claimCard(e);
                    },
                  ],
                ]
              : []),
            [
              `Sell the claim (${usd(t)})`,
              () =>
                iosConfirm("Sell Claim", `Sell ${e.name} for ${usd(t)}?`, () => {
                  const a = mineSt();
                  a.caves.splice(a.caves.indexOf(e), 1),
                    (state.money = cents(state.money + t)),
                    renderStats(),
                    say(`I sold my claim on ${e.name} for ${usd(t)}.`),
                    notice("Claim sold", `You sold ${e.name} for ${usd(t)}.`, openMining, !0);
                }),
            ],
          ],
        });
      }
      function descend(e) {
        const t = mineSt(),
          a = regionOf(e.reg),
          o = "placer" === e.kind,
          n = bestPick(),
          s = hasMTool("davy") ? "davy" : hasMTool("lantern") ? "lantern" : t.candles > 0 ? "candle" : null;
        if (state.age < 12) return notice("Too young", "You are too young to go into a mine.", null, !0);
        if (mineTripsLeft() <= 0)
          return notice(
            "No more trips",
            "You have been down enough times this year. Try again next year.",
            null,
            !0,
          );
        if (a.far && !hasHorse("ride"))
          return notice(
            "Too far to walk",
            `${a.name} is days away. You need a riding horse to get there.`,
            null,
            !0,
          );
        if (o && !hasMTool("shovel"))
          return notice(
            "No shovel",
            "You need a shovel and gold pan to work creek gravel. Buy them at the supply store.",
            null,
            !0,
          );
        if (!o && !n)
          return notice("No pickaxe", "You need a pickaxe to mine. Buy one at the supply store.", null, !0);
        if (!o && !s)
          return notice(
            "Too dark",
            "It is pitch black down there. Buy candles or a lantern first.",
            null,
            !0,
          );
        t.trip.n++, o || "candle" !== s || t.candles--;
        const r = {
            lvl: 1,
            swings: 0,
            max: 4 + (state.stats.Health > 60 ? 1 : 0) + (t.skill > 50 ? 1 : 0),
            haul: [],
            lbs: 0,
          },
          i = o ? 2 : hasMTool("rope") ? e.depth : Math.min(2, e.depth),
          l = mineCarry(),
          c = "coal" === a.hz,
          d = () =>
            r.haul.length
              ? r.haul.map((e) => `${oreAmt(e)} of ${oreName(e).toLowerCase()}`).join(", ")
              : "Nothing yet",
          u = (a, n = e.name) => {
            evWrap.classList.remove("open"),
              (state.ore ||= []).push(...r.haul),
              (t.skill = Math.min(100, t.skill + 2 + r.lvl)),
              o || (t.dust = (t.dust || 0) + r.lvl);
            const s = r.haul.length
              ? `I came out of ${e.name} with ${d()}.`
              : `I came out of ${e.name} empty-handed.`;
            say(s),
              renderStats(),
              notice(
                n,
                `${a ? a + "<br><br>" : ""}${r.haul.length ? `You carried out ${d()}. It's in your Assets.` : "You came out with nothing to show for it."}`,
                openMining,
                !0,
              );
          },
          h = (e) => {
            evWrap.classList.remove("open"), (r.haul = []), setTimeout(() => die(e), 400);
          },
          p = (e, t, a) => (
            (state.stats.Health = clamp(state.stats.Health - rint(e, t))),
            renderStats(),
            hurt(),
            state.stats.Health <= 0 && (h(a), !0)
          ),
          m = (n) => {
            r.swings++, n ? (t.charges--, crimeSnd("MineExplosion")) : play("rockBreak");
            const i = bestPick();
            if (
              !o &&
              !n &&
              i &&
              (i.p.dur--, i.p.dur <= 0 && ((t.picks = t.picks.filter((e) => e.dur > 0)), !bestPick()))
            )
              return u(`Your ${i.name.toLowerCase()} snapped in two!`);
            const d = ((t) => {
              const a = 1 + 0.35 * (r.lvl - 1),
                n = t ? 2 : 1,
                i = o
                  ? [
                      ["cold", 0.03],
                      ["flood", 0.012],
                    ]
                  : c
                    ? [
                        ["roof", 0.035],
                        ["firedamp", "davy" === s ? 0.004 : "candle" === s ? 0.018 : 0.014],
                        ["badair", 0.02],
                      ]
                    : "cave" === e.kind
                      ? [
                          ["fall", 0.03],
                          ["lost", 0.02],
                          ["flood", 0.015],
                        ]
                      : [
                          ["rock", 0.035],
                          ["flood", 0.015],
                          ["badair", 0.015],
                          ...("shaft" === e.kind ? [["collapse", 0.012]] : []),
                        ];
              t && i.push(["misfire", 0.04]);
              for (const [e, t] of i) if (chance(t * a * ("misfire" === e ? 1 : n))) return e;
              return null;
            })(n);
            if (d)
              return ((t) => {
                if ("cold" === t)
                  return (
                    (state.stats.Health = clamp(state.stats.Health - 3)),
                    g("Standing in the icy creek all day leaves you shivering and numb.")
                  );
                if ("lost" === t)
                  return (
                    r.swings++,
                    g(
                      "Your light gutters and you lose your way in the twisting passages. It takes ages to find the way back.",
                    )
                  );
                if ("fall" === t) {
                  if (p(6, 22, "a fall in a cave")) return;
                  return state.stats.Health < 25
                    ? u("You slipped on wet rock and fell into a crevice. You barely dragged yourself out.")
                    : g("You slipped on wet rock and fell hard. You pick yourself up, bruised.");
                }
                if ("rock" === t || "roof" === t) {
                  if (
                    (crimeSnd("MineExplosion"),
                    p(8, 28, c ? "a roof fall in a coal mine" : "falling rock in a mine"))
                  )
                    return;
                  return state.stats.Health < 25
                    ? u(
                        (c ? "Part of the roof" : "A slab of rock") +
                          " came down on you. You crawled out badly hurt.",
                      )
                    : g(
                        (c ? "A chunk of the roof" : "A slab of loose rock") +
                          " crashes down and clips your shoulder. You're hurt, but you can keep going.",
                      );
                }
                if ("badair" === t) {
                  if (p(4, 14, "choking on bad air in a mine")) return;
                  return u(
                    "The air turned foul and your light dimmed. Dizzy and gasping, you scrambled out before it was too late.",
                  );
                }
                if ("firedamp" === t) {
                  if ((crimeSnd("MineExplosion"), p(35, 80, "a firedamp explosion in a coal mine"))) return;
                  return (
                    (r.haul = []),
                    u(
                      `Firedamp gas met your ${"candle" === s ? "candle flame" : "lamp"} and the tunnel exploded! You were burned and thrown into the dark.`,
                      "Explosion!",
                    )
                  );
                }
                if ("misfire" === t) {
                  if ((crimeSnd("MineExplosion"), p(15, 45, "a blasting accident in a mine"))) return;
                  return u(
                    "Your charge went off early while you were still too close. The blast threw you against the wall.",
                    "Misfire!",
                  );
                }
                return "flood" === t
                  ? (evWrap.classList.remove("open"),
                    setTimeout(
                      () =>
                        jCard({
                          tag: "Mining",
                          iconSrc: "mining/bucket.png",
                          title: "Flooding!",
                          lead: `You hit a pocket of water and it's pouring into the ${o ? "diggings" : "tunnel"} fast!`,
                          choices: [
                            [
                              "Drop everything and run",
                              () => {
                                (r.haul = []),
                                  u("You dropped your haul and ran. The water filled the level behind you.");
                              },
                            ],
                            [
                              "Grab your haul and run",
                              () =>
                                chance(0.55)
                                  ? u("You grabbed your haul and splashed out just ahead of the water.")
                                  : ((r.haul = []),
                                    r.lvl >= 3 && chance(0.25)
                                      ? h("drowning in a flooded mine")
                                      : void (
                                          p(10, 30, "drowning in a flooded mine") ||
                                          u(
                                            "The water knocked you off your feet and swept your haul away. You barely made it out.",
                                          )
                                        )),
                            ],
                          ],
                        }),
                      60,
                    ))
                  : "collapse" === t
                    ? (crimeSnd("MineExplosion"),
                      evWrap.classList.remove("open"),
                      setTimeout(
                        () =>
                          jCard({
                            tag: "Mining",
                            iconSrc: e.img,
                            title: "Cave-In!",
                            lead: "With a roar, the tunnel behind you collapses. You are trapped in the dark.",
                            choices: [
                              [
                                "Dig your way out",
                                () => {
                                  const e = bestPick();
                                  if ((e && (e.p.dur = Math.max(0, e.p.dur - 4)), chance(0.6)))
                                    return u(
                                      "You dug through the rubble for hours and finally broke through.",
                                      "Dug out",
                                    );
                                  p(20, 45, "being trapped in a cave-in") ||
                                    u(
                                      "More rock came down while you dug, but you squeezed through a gap at last.",
                                      "Dug out",
                                    );
                                },
                              ],
                              [
                                "Wait for rescue",
                                () => {
                                  if (chance(e.claim && e.workers ? 0.85 : 0.5))
                                    return u(
                                      e.claim && e.workers
                                        ? "Your miners dug through to you by morning."
                                        : "Other miners heard you shouting and dug you out.",
                                      "Rescued",
                                    );
                                  p(25, 55, "being trapped in a cave-in") ||
                                    u(
                                      "Nobody came for two days. You finally clawed your way out, starving and weak.",
                                      "Survived",
                                    );
                                },
                              ],
                              [
                                "Pray",
                                () => {
                                  if (chance(0.4))
                                    return u(
                                      "You prayed in the dark, and a draft of air led you to a crack you could squeeze through.",
                                      "A way out",
                                    );
                                  p(25, 60, "being trapped in a cave-in") ||
                                    u(
                                      "You prayed for hours before you found a way out, half-dead.",
                                      "Survived",
                                    );
                                },
                              ],
                            ],
                          }),
                        60,
                      ))
                    : void g();
              })(d);
            if (e.left <= 0) return g("This place is worked out. There is nothing left worth digging.");
            const m = o ? 1 : (bestPick() || i || { power: 1 }).power;
            if (!n && !chance(0.55 + 0.12 * m + 0.002 * t.skill))
              return g(
                pickR(
                  o
                    ? [
                        "Your pan comes up with nothing but sand.",
                        "Nothing but mud and pebbles in this gravel.",
                      ]
                    : [
                        "You chip away at the wall, but find nothing but worthless rock.",
                        "Hours of digging, and nothing but stone.",
                        "The rock here is barren.",
                      ],
                ),
              );
            const y = { gem: i && "pick3" === i.id ? 1.5 : 1, metal: hasMTool("drill") ? 1.2 : 1 },
              b = pickDeposit(a, r.lvl, y);
            if ("stone" === b)
              return g(
                pickR([
                  "You break loose a big chunk of rock, but it's just plain stone.",
                  "You follow what looked like a vein, but it's only stained rock.",
                ]),
              );
            if (
              o &&
              ![
                "placer",
                "quartz",
                "amethyst",
                "emerald",
                "ruby",
                "sapphire",
                "diamond",
                "turquoise",
              ].includes(b)
            )
              return g("You sift the gravel, but there's nothing valuable in this stretch of creek.");
            const v = makeOre(b, r.lvl, e.rich, n ? 2.5 : 1),
              w = oreLbs(v);
            e.left = Math.max(0, e.left - rint(1, 4));
            let k = "";
            if (r.lbs + w > l) {
              const e = l - r.lbs;
              if (e < 5 || "placer" === MINERALS[b].cls)
                return g(
                  `You found ${MINERALS[b].name.toLowerCase()}, but you can't carry any more. ${l < 250 ? "A wheelbarrow or ore cart would help." : ""}`,
                );
              (v.amt = Math.round(e)), (k = ` You can only carry ${Math.round(e)} lb of it.`);
            }
            r.haul.push(v), (r.lbs += oreLbs(v));
            const $ =
                (("metal" === MINERALS[b].cls || "placer" === MINERALS[b].cls) &&
                  v.g >= 3 &&
                  /gold|placer|silver/.test(b)) ||
                ("gem" === MINERALS[b].cls && v.g >= 3 && !/amethyst|turquoise/.test(b)),
              S = `${n ? "The blast rips open the wall! " : ""}You found ${oreAmt(v)} of ${MINERALS[b].name.toLowerCase()}!${k}`;
            if ($) return f(v, S);
            g(S);
          },
          f = (a, o) => {
            evWrap.classList.remove("open"), (state.respect = clamp((state.respect ?? 40) + 2));
            const n = cents(claimCost(e) * (2 + 2 * e.rich) * (0.8 + 0.6 * Math.random())),
              s = MINERALS[a.m];
            setTimeout(
              () =>
                jCard({
                  tag: "Mining",
                  iconSrc: oreIco(a),
                  title:
                    "gem" === s.cls
                      ? "Gem Strike!"
                      : /gold|placer/.test(a.m)
                        ? "Gold Discovery!"
                        : "Silver Strike!",
                  lead: `${o} ${"gem" === s.cls ? "It sparkles even in the dim light." : "It glitters in your lamplight."} Word travels fast, and a local prospector offers to buy ${e.claim ? "your claim" : "the location of the cave"}. What will you do?`,
                  rows: [["Offer", usd(n)]],
                  choices: [
                    [
                      e.claim ? "Sell your claim" : "Sell the location",
                      () => {
                        const a = t.caves.indexOf(e);
                        a >= 0 && t.caves.splice(a, 1),
                          (state.money = cents(state.money + n)),
                          say(`I sold ${e.name} to a prospector for ${usd(n)} after a rich strike.`),
                          u(`You sold ${e.name} for ${usd(n)}.`, "Sold");
                      },
                    ],
                    ["Continue mining", () => g("You wave the prospector off and keep digging.")],
                    [
                      `Hire an assayer (${usd(eraCash(2))})`,
                      () => {
                        if (state.money < eraCash(2)) return g("You can't afford an assayer right now.");
                        (state.money = cents(state.money - eraCash(2))),
                          r.haul.forEach((e) => {
                            !1 === e.assayed && (e.assayed = !0);
                          }),
                          renderStats(),
                          g(
                            "The assayer tested your haul on the spot. " +
                              ("metal" === MINERALS[a.m].cls
                                ? `Your ${MINERALS[a.m].name.toLowerCase()} is ${ORE_GRADE[a.g].toLowerCase()} ore.`
                                : "He whistles at the quality."),
                          );
                      },
                    ],
                  ],
                }),
              60,
            );
          },
          g = (a) => {
            if (state.dead) return;
            const n = r.swings >= r.max,
              s = n ? [] : [[o ? "Pan the gravel" : "Swing your pickaxe", () => m(!1)]];
            !n &&
              !o &&
              t.charges > 0 &&
              hasMTool("drill") &&
              s.push([`Blast it (${t.charges} left)`, () => m(!0)]),
              !n &&
                r.lvl < i &&
                s.push([
                  o ? "Dig into the bank" : `Go down to level ${r.lvl + 1}`,
                  () => {
                    r.lvl++,
                      g(
                        o
                          ? "You dig into the bank where the old gravel lies deeper."
                          : pickR([
                              "You climb down a rickety ladder into the next level.",
                              "You squeeze down a narrow passage into the dark below.",
                              "The air grows warmer and damper as you climb down.",
                            ]),
                      );
                  },
                ]),
              s.push(["Climb back out", () => u(n ? "You were too exhausted to keep going." : "")]);
            const c =
              (a ? a + " " : "") +
              (n
                ? "You're exhausted and can't swing another blow."
                : r.lvl === i && i < e.depth
                  ? "The shaft goes deeper, but you need a rope to climb down."
                  : "");
            jCard({
              tag: o ? "Creek Diggings" : `Level ${r.lvl} of ${e.depth}`,
              iconSrc: e.img,
              title: e.name,
              lead:
                mineScene(e) +
                (c ||
                  (o
                    ? "Cold water rushes over the gravel bed."
                    : pickR([
                        "Your light flickers on the damp stone walls.",
                        "Water drips somewhere in the dark.",
                        "The timbers creak above your head.",
                      ]))),
              rows: [
                ["Haul", d()],
                ["Carrying", `${Math.round(r.lbs)} of ${l} lb`],
              ],
              choices: s,
            });
          };
        screen.classList.remove("open"),
          a.far && play("gallop"),
          g(
            o
              ? `You wade into the creek at ${e.name} with your pan.`
              : `You ${"candle" === s ? "light a candle" : "light your lamp"} and climb down into ${e.name}.`,
          );
      }
      function mineRows() {
        const e = state.ore || [],
          t = state.mine,
          a = t
            ? [
                ...t.picks.filter((e) => e.dur > 0).map((e) => MINE_TOOLS.find((t) => t.id === e.id)),
                ...t.tools.map((e) => MINE_TOOLS.find((t) => t.id === e)),
              ].filter(Boolean)
            : [],
          o = t ? t.caves.filter((e) => e.claim) : [];
        if (!e.length && !a.length && !o.length) return "";
        const n = cents(e.reduce((e, t) => e + oreWorth(t), 0));
        return (
          (a.length || o.length ? '<div class="sec">Mining</div>' : "") +
          o
            .map(
              (e) =>
                `<div class="row" data-claim="${t.caves.indexOf(e)}"><img src="${e.img}" alt=""><div class="t"><b>${e.name} <em>(claim)</em></b><span>${regionOf(e.reg).name} · ${e.workers} miner${1 === e.workers ? "" : "s"}</span></div>${DOTS}</div>`,
            )
            .join("") +
          [...new Set(a)]
            .map(
              (e) =>
                `<div class="row"><img src="${e.ico}" alt=""><div class="t"><b>${e.name}</b><span>${e.desc}</span></div></div>`,
            )
            .join("") +
          (e.length
            ? `<div class="sec">Ore &amp; Minerals · about ${usd(n)}</div>` +
              e
                .map(
                  (e, t) =>
                    `<div class="row" data-ore="${t}"><img src="${oreIco(e)}" alt=""><div class="t"><b>${oreName(e)} <em>(${oreAmt(e)})</em></b><span>${oreQual(e)} · ${"metal" !== MINERALS[e.m].cls || e.bar || e.assayed ? "worth about" : "worth roughly"} ${usd(oreWorth(e))}${oreAge(e) >= 10 ? " · old family stock" : ""}</span></div>${DOTS}</div>`,
                )
                .join("")
            : "")
        );
      }
      function oreCard(e) {
        const t = (state.ore || [])[e];
        if (!t) return;
        const a = MINERALS[t.m],
          o = () => {
            renderStats(), openAssets();
          },
          n = ORE_BUYERS(t).map(([e, a]) => [e, oreSale(t, a)]),
          s = [];
        if ("metal" === a.cls && !t.bar && !t.assayed) {
          const o = eraCash(0.5);
          s.push([
            `Have it assayed (${usd(o)})`,
            () => {
              if (state.money < o)
                return notice("Not enough money", `The assayer charges ${usd(o)}.`, null, !0);
              (state.money = cents(state.money - o)),
                (t.assayed = !0),
                say(`I had my ${a.name.toLowerCase()} assayed. It's ${ORE_GRADE[t.g].toLowerCase()} ore.`),
                notice(
                  "Assay Office",
                  `The assayer crushed a sample and tested it. Your ${a.name.toLowerCase()} is <b>${ORE_GRADE[t.g].toLowerCase()}</b> ore, worth about ${usd(oreWorth(t))} as it is.`,
                  () => oreCard(e),
                  !0,
                ),
                renderStats();
            },
          ]);
        }
        if (("metal" === a.cls || "placer" === a.cls) && !t.bar) {
          const o = cents(
            Math.max(eraCash(0.25), eraCash("placer" === a.cls ? 20.67 * t.amt * 0.01 : t.amt * a.fee)),
          );
          s.push([
            `${"placer" === a.cls ? "Melt it into a bar" : "Send it to the smelter"} (${usd(o)})`,
            () => {
              if (state.money < o) return notice("Not enough money", `That costs ${usd(o)}.`, null, !0);
              state.money = cents(state.money - o);
              const n = oreAmt(t);
              (t.amt =
                "placer" === a.cls
                  ? Math.round(0.85 * t.amt * 100) / 100
                  : "oz" === a.unit
                    ? Math.round(t.amt * t.c * (0.8 + 0.15 * Math.random()) * 100) / 100
                    : Math.max(1, Math.round(t.amt * t.c * (0.8 + 0.15 * Math.random())))),
                (t.bar = !0),
                delete t.assayed,
                say(
                  `I had ${n} of ${a.name.toLowerCase()} refined into ${oreAmt(t)} of ${"ton" === a.unit ? "pig iron" : a.barName.toLowerCase().replace(/ (bar|ingot|pig|slab)$/, "")}.`,
                ),
                notice(
                  "placer" === a.cls ? "Assay Office" : "Smelter",
                  `Your ${n} of ${a.name.toLowerCase()} came out as <b>${oreAmt(t)}</b> of refined metal.`,
                  () => oreCard(e),
                  !0,
                ),
                renderStats();
            },
          ]);
        }
        if ("gem" === a.cls && !t.cut) {
          const o = eraCash(Math.max(0.5, 0.4 * t.amt));
          s.push([
            `Have it cut (${usd(o)})`,
            () => {
              if (state.money < o)
                return notice("Not enough money", `The gem cutter charges ${usd(o)}.`, null, !0);
              (state.money = cents(state.money - o)), (t.cut = !0);
              const n = chance(0.15);
              (t.amt = Math.round(t.amt * (n ? 0.3 : 0.6) * 100) / 100),
                n && (t.g = Math.max(0, t.g - 1)),
                say(
                  n
                    ? `My ${a.name.toLowerCase()} cracked while it was being cut.`
                    : `I had my ${a.name.toLowerCase().replace(/^rough /, "")} cut and polished.`,
                ),
                notice(
                  "Gem Cutter",
                  n
                    ? `The stone cracked on the wheel! The cutter saved ${oreAmt(t)} of it.`
                    : `The cutter polished it into a ${oreAmt(t)} ${GEM_GRADE[t.g].toLowerCase()} gem.`,
                  () => oreCard(e),
                  !0,
                ),
                renderStats();
            },
          ]);
        }
        n.forEach(([a, n]) =>
          s.push([
            `Sell to the ${a.replace(/^the /i, "").replace(/^U\.S\./, "U.S.")} (${usd(n)})`,
            () => {
              state.ore.splice(e, 1),
                (state.money = cents(state.money + n)),
                say(`I sold ${oreAmt(t)} of ${oreName(t).toLowerCase()} to the ${a} for ${usd(n)}.`),
                play("coins"),
                o();
            },
          ]),
        ),
          s.push([
            "Throw it away",
            () => {
              state.ore.splice(e, 1), say(`I threw away ${oreAmt(t)} of ${oreName(t).toLowerCase()}.`), o();
            },
            "gray",
          ]);
        const r = oreAge(t);
        jCard({
          tag: "Ore & Minerals",
          iconSrc: oreIco(t),
          title: oreName(t),
          close: !0,
          lead:
            r >= 10
              ? `This has been in the family since ${t.at}. Old, well-documented stock fetches more every year it's kept.`
              : "Keep it and it gains value every year, and it passes to your children when you die.",
          rows: [
            ["Amount", oreAmt(t)],
            ["Quality", oreQual(t)],
            ["Found", `${t.at}${t.from ? `, ${t.from}` : ""}`],
            ["Estimated Value", usd(oreWorth(t))],
          ],
          choices: s,
        });
      }
      function companyMine() {
        const e = state.job,
          t = mineSt(),
          a = "Coal Miner" === e.t;
        if (((t.shift && t.shift.age === state.age) || (t.shift = { age: state.age, n: 0 }), t.shift.n >= 3))
          return notice(
            "Shift over",
            "You have already worked every extra shift you can this year.",
            null,
            !0,
          );
        const o =
            (e.mineReg && MINE_REGIONS().find((t) => t.k === e.mineReg)) ||
            ((e.mineReg = (
              a
                ? MINE_REGIONS().find((e) => "coal" === e.hz)
                : pickR(regionsOpen().filter((e) => "coal" !== e.hz)) || MINE_REGIONS()[0]
            ).k),
            regionOf(e.mineReg)),
          n = (t) => {
            e.perf = clamp((e.perf ?? 50) + t);
          },
          s = (e, a) => {
            t.shift.n++,
              (t.dust = (t.dust || 0) + 2),
              renderStats(),
              eraFx(a),
              say(e),
              notice("Company Mine", e, null, !0);
          };
        jCard({
          tag: e.emp,
          iconSrc: a ? "mining/cart-coal.png" : "mining/cart-gold.png",
          title: "Company Mine",
          close: !0,
          lead: `The shift whistle blows at ${e.emp} in the ${o.name}. How will you spend your shift?`,
          choices: [
            [
              "Work a hard shift",
              () => {
                if ((play("rockBreak"), n(rint(4, 8)), chance(0.06)))
                  return (
                    crimeSnd("MineExplosion"),
                    hurt(),
                    s(
                      "A timber gave way during my shift and rock fell on me. The foreman sent me home hurt.",
                      { Health: -rint(10, 25) },
                    )
                  );
                s("I worked a hard shift in the company mine. The foreman noticed.", {
                  Health: -2,
                  Respect: 1,
                });
              },
            ],
            [
              "Look for a new vein",
              () => {
                if ((play("rockBreak"), chance(0.3 + 0.003 * t.skill))) {
                  const e = eraCash(rint(5, 20));
                  return (
                    n(10),
                    (t.skill = Math.min(100, t.skill + 3)),
                    s(
                      `I found a new ${a ? "seam" : "vein"} for the company! The owners paid me a ${usd(e)} bonus.`,
                      { cash: e, Happiness: 6, Respect: 3 },
                    )
                  );
                }
                n(-2),
                  s(`I spent my shift searching for a new ${a ? "seam" : "vein"} and found nothing.`, {
                    Happiness: -2,
                  });
              },
            ],
            [
              "Pocket some high-grade ore",
              () => {
                if ((play("rockBreak"), chance(0.25)))
                  return (
                    (t.shift.n = 3),
                    say(`I was caught stealing ore from ${e.emp} and fired on the spot.`),
                    (state.job = null),
                    renderStats(),
                    (state.respect = clamp((state.respect ?? 40) - 6)),
                    notice(
                      "Caught!",
                      `The shift boss searched your lunch pail and found the ore. You're fired from ${e.emp}.`,
                      null,
                      !0,
                    )
                  );
                const n = a ? "coal" : pickDeposit({ dep: o.dep.filter(([e]) => "stone" !== e) }, 3),
                  r = makeOre(n, 3, 1.2);
                (r.from = e.emp),
                  (state.ore ||= []).push(r),
                  s(
                    `I smuggled ${oreAmt(r)} of ${MINERALS[n].name.toLowerCase()} out of the company mine in my lunch pail.`,
                    { Happiness: 3, Respect: -1 },
                  );
              },
            ],
            [
              "Take it easy",
              () => {
                n(-5), s("I took it easy during my shift in the mine.", { Happiness: 2 });
              },
            ],
          ],
        });
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || !state.mine) return;
        const e = state.mine;
        e.caves
          .filter((e) => e.claim && e.workers)
          .forEach((e) => {
            const t = cents(workerWage() * e.workers);
            if (state.money < t)
              return say(`I couldn't pay the miners on ${e.name}, so they all quit.`), void (e.workers = 0);
            state.money = cents(state.money - t);
            const a = regionOf(e.reg);
            let o = 0;
            state.ore ||= [];
            for (let t = 0; t < 4 * e.workers && e.left > 0; t++) {
              const n = pickDeposit(a, rint(1, e.depth));
              if ("stone" === n || !chance(0.6)) continue;
              const s = MINERALS[n].cls,
                r = makeOre(
                  n,
                  rint(1, e.depth),
                  e.rich,
                  "ton" === MINERALS[n].unit ? 1500 : { bulk: 400, metal: 6, placer: 4, gem: 1 }[s],
                );
              (r.from = e.name), o++, (e.left = Math.max(0, e.left - (t % 2)));
              const i =
                "gem" !== s &&
                state.ore.find(
                  (t) => t.from === e.name && t.at === r.at && t.m === n && !t.bar && !0 !== t.assayed,
                );
              i
                ? (r.c && (i.c = (i.c * i.amt + r.c * r.amt) / (i.amt + r.amt)),
                  (i.g = Math.round((i.g * i.amt + r.g * r.amt) / (i.amt + r.amt))),
                  (i.amt = Math.round(100 * (i.amt + r.amt)) / 100))
                : state.ore.push(r);
            }
            e.left <= 0
              ? (say(`My claim on ${e.name} is worked out.`), (e.workers = 0))
              : say(
                  o
                    ? `My miners worked ${e.name} all year and brought up ore for me to sell.`
                    : `My miners on ${e.name} found nothing worth keeping this year.`,
                ),
              chance(0.06 * e.workers) &&
                (say(`One of my miners was hurt in an accident on ${e.name}.`),
                (state.respect = clamp((state.respect ?? 40) - 1)));
          }),
          (e.dust || 0) > 25 &&
            chance(Math.min(0.5, e.dust / 150)) &&
            ((state.stats.Health = clamp(state.stats.Health - rint(3, 8))),
            e.cough ||
              ((e.cough = !0), say("I've developed a miner's cough from years of breathing rock dust."))),
          (e.dust = Math.max(0, (e.dust || 0) - 3));
      });
      const FARM_KINDS = [
          { k: "small", name: "Small Farm", acres: [15, 30], perAcre: 14, sprite: 13 },
          { k: "family", name: "Family Farm", acres: [60, 100], perAcre: 16, sprite: 8 },
          { k: "large", name: "Large Farm", acres: [140, 200], perAcre: 17, sprite: 5 },
          { k: "estate", name: "Country Estate", acres: [400, 700], perAcre: 20, sprite: 3 },
        ],
        CROPS = () => [
          {
            id: "wheat",
            name: "Wheat",
            ico: "jobev/wheat.png",
            unit: "bushels",
            yld: 13,
            price: 1.1,
            seed: 1.65,
            labor: 1,
          },
          {
            id: "corn",
            name: "Corn",
            ico: "jobev/corn.png",
            unit: "bushels",
            yld: 28,
            price: 0.5,
            seed: 0.25,
            labor: 1.2,
          },
          {
            id: "oats",
            name: "Oats",
            ico: "jobev/seedling.png",
            unit: "bushels",
            yld: 28,
            price: 0.35,
            seed: 0.9,
            labor: 1,
          },
          {
            id: "potatoes",
            name: "Potatoes",
            ico: "jobev/potato.png",
            unit: "bushels",
            yld: 90,
            price: 0.45,
            seed: 4.5,
            labor: 3.5,
          },
          {
            id: "hay",
            name: "Hay",
            ico: "jobev/falling-leaf.png",
            unit: "tons",
            yld: 1.3,
            price: 8,
            seed: 1,
            labor: 0.8,
          },
          ...("us" === state.country
            ? [
                {
                  id: "cotton",
                  name: "Cotton",
                  ico: "emoji/1f9f6.png",
                  unit: "lb",
                  yld: 170,
                  price: 0.11,
                  seed: 0.3,
                  labor: 2.2,
                },
                {
                  id: "tobacco",
                  name: "Tobacco",
                  ico: "jobev/maple-leaf.png",
                  unit: "lb",
                  yld: 650,
                  price: 0.09,
                  seed: 0.5,
                  labor: 5,
                },
              ]
            : [
                {
                  id: "barley",
                  name: "Barley",
                  ico: "jobev/wheat.png",
                  unit: "bushels",
                  yld: 26,
                  price: 0.7,
                  seed: 1.4,
                  labor: 1,
                },
                {
                  id: "turnips",
                  name: "Turnips",
                  ico: "jobev/potato.png",
                  unit: "bushels",
                  yld: 160,
                  price: 0.12,
                  seed: 0.2,
                  labor: 2,
                },
              ]),
        ],
        ANIMALS = [
          {
            id: "cow",
            name: "Milk Cow",
            ico: "jobev/cow.png",
            price: 25,
            feed: 5,
            makes: "milk and butter",
            val: 18,
            breed: 0.25,
            litter: [1, 1],
            labor: 0.8,
          },
          {
            id: "pig",
            name: "Hog",
            ico: "jobev/pig.png",
            price: 6,
            feed: 2,
            makes: "pork",
            val: 0,
            breed: 0.6,
            litter: [2, 6],
            labor: 0.3,
          },
          {
            id: "chicken",
            name: "Chicken",
            ico: "jobev/chicken.png",
            price: 0.25,
            feed: 0.3,
            makes: "eggs",
            val: 0.8,
            breed: 0.35,
            litter: [1, 4],
            labor: 0.02,
          },
          {
            id: "sheep",
            name: "Sheep",
            ico: "jobev/sheep.png",
            price: 3,
            feed: 0.7,
            makes: "wool",
            val: 1.6,
            breed: 0.4,
            litter: [1, 2],
            labor: 0.15,
          },
          {
            id: "ox",
            name: "Ox",
            ico: "emoji/1f402.png",
            price: 40,
            feed: 6,
            makes: "plowing",
            val: 0,
            breed: 0,
            litter: [0, 0],
            labor: 0.2,
          },
        ],
        FARM_UPGRADES = [
          {
            id: "barn",
            name: "Barn",
            ico: "houses1800/house17.png",
            price: 150,
            desc: "Keeps animals alive through hard winters and stores more of the harvest",
          },
          {
            id: "well",
            name: "Well",
            ico: "emoji/1f6b0.png",
            price: 40,
            desc: "Water for the fields. Droughts hurt far less",
          },
          {
            id: "fence",
            name: "Fence",
            ico: "emoji/1fa93.png",
            price: 60,
            desc: "Keeps wolves and foxes away from your chickens and sheep",
          },
        ],
        FARM_WEATHER = [
          [30, "good", "A fine growing year with sun and rain at the right times.", 1.25],
          [40, "fair", "An ordinary year for the crops.", 1],
          [12, "dry", "A dry summer stunted the crops.", 0.75],
          [6, "drought", "A terrible drought scorched the fields.", 0.4],
          [6, "hail", "A hailstorm flattened part of the crop.", 0.6],
          [4, "locusts", "A plague of grasshoppers ate through the fields.", 0.3],
          [2, "flood", "Floods drowned the low fields.", 0.5],
        ],
        farmYear = () => state.birthYear + state.age,
        cropIdx = () => Math.max(0.6, Math.pow(1.012, farmYear() - 1860)),
        farmCash = (e) => (isOldEra() ? eraCash(e * cropIdx()) : Math.round(e * cropIdx() * 60)),
        landPrice = (e, t, a) => eraCash(e * t * (0.6 + a / 125) * homeIndex(farmYear())),
        farmCap = (e) => {
          const t = state.age < 14 ? 0 : state.job && "Farmer" !== state.job.t ? 10 : 30,
            a = hasHorse("work") || (e.animals.ox || 0) > 0;
          return Math.round((t + 30 * (e.hands || 0)) * (a ? 1 : 0.5));
        },
        farmPlanted = (e) => Object.values(e.plan || {}).reduce((e, t) => e + t, 0),
        farmNeed = (e) =>
          Math.round(
            CROPS().reduce((t, a) => t + (e.plan[a.id] || 0) * a.labor, 0) +
              ANIMALS.reduce((t, a) => t + (e.animals[a.id] || 0) * a.labor, 0),
          ),
        laborWord = (e) =>
          e <= 0.9 ? "Light work" : e <= 1.3 ? "Normal work" : e <= 3.5 ? "Heavy work" : "Back-breaking work",
        farmValue = (e) =>
          cents(
            landPrice(e.acres, e.perAcre, e.soil) +
              FARM_UPGRADES.filter((t) => e[t.id]).reduce((e, t) => e + eraCash(0.7 * t.price), 0) +
              ANIMALS.reduce((t, a) => t + (e.animals[a.id] || 0) * farmCash(a.price) * 0.8, 0),
          ),
        farmListings = () => {
          const e = farmYear();
          return (
            state.farmMarket && state.farmMarket.y === e
              ? state.farmMarket
              : (state.farmMarket = {
                  y: e,
                  list: FARM_KINDS.flatMap((e) =>
                    Array.from({ length: "estate" === e.k ? 1 : 2 }, () => {
                      const t = rint(...e.acres),
                        a = rint(30, 95);
                      return {
                        kind: e.k,
                        name: e.name,
                        acres: t,
                        soil: a,
                        perAcre: e.perAcre,
                        sprite: `houses1800/house${e.sprite}.png`,
                        addr: `${rint(1, 9)} miles out on ${pickR(OLD_RURAL)}`,
                      };
                    }),
                  ),
                })
          ).list;
        },
        homesteadOpen = () => "us" === state.country && farmYear() >= 1862;
      function openFarm() {
        const e = state.farm;
        if (!e) return openFarmMarket();
        (sTitle.textContent = e.name.toUpperCase()),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const t = farmCap(e),
          a = farmPlanted(e),
          o = farmNeed(e),
          n = CROPS();
        (sList.innerHTML =
          `<div class="row"><img src="${e.sprite}" alt=""><div class="t"><b>${e.name} <em>(${e.acres} acres)</em></b><div class="rel">Soil <i><u style="width:${e.soil}%;background:${barCol(e.soil)}"></u></i></div></div></div>` +
          (e.last
            ? `<div class="row" data-f="report"><img src="jobev/${"good" === e.last.wx || "fair" === e.last.wx ? "sun" : "locusts" === e.last.wx ? "grasshopper" : "cloud-rain"}.png" alt=""><div class="t"><b>Last Harvest · ${e.last.year}</b><span>${e.last.net >= 0 ? `Cleared ${usd(e.last.net)}` : `Lost ${usd(-e.last.net)}`} after costs</span></div>${CHEV}</div>`
            : "") +
          `<div class="sec">Fields · ${a} of ${e.acres} acres planted · work ${o} of ${t}</div>` +
          (!a && e.lastPlan && Object.keys(e.lastPlan).length
            ? `<div class="row" data-f="replant"><img src="jobev/seedling.png" alt=""><div class="t"><b>Replant Last Year's Fields</b><span>Buy ${usd(replantCost(e))} of seed and plant ${Object.entries(
                e.lastPlan,
              )
                .map(
                  ([e, t]) =>
                    `${t} acres of ${
                      CROPS()
                        .find((t) => t.id === e)
                        ?.name.toLowerCase() || e
                    }`,
                )
                .join(", ")}</span></div>${DOTS}</div>`
            : "") +
          (a
            ? ""
            : '<div class="row dis"><img src="freelife/apple/1f331.png" alt=""><div class="t"><b>Your fields are bare</b><span>Buy seed and plant before the harvest, or nothing will grow this year</span></div></div>') +
          n
            .map(
              (t) =>
                `<div class="row" data-crop="${t.id}"><img src="${t.ico}" alt=""><div class="t"><b>${t.name}${e.plan[t.id] ? ` <em>(${e.plan[t.id]} acres planted)</em>` : ""}</b><span>${laborWord(t.labor)} · seed ${usd(farmCash(t.seed))} an acre · sells for ${usd(farmCash(t.price))} a ${"lb" === t.unit ? "lb" : t.unit.replace(/s$/, "")}</span></div>${DOTS}</div>`,
            )
            .join("") +
          (o > t
            ? `<div class="row dis"><img src="emoji/26a0-fe0f.png" alt=""><div class="t"><b>Not enough hands</b><span>Only ${Math.round((t / o) * 100)}% of the work will get done. Hire hands${hasHorse("work") || e.animals.ox ? "" : " or buy a workhorse or ox to pull the plow"}</span></div></div>`
            : "") +
          '<div class="sec">Livestock</div>' +
          ANIMALS.map(
            (t) =>
              `<div class="row" data-ani="${t.id}"><img src="${t.ico}" alt=""><div class="t"><b>${t.name}${e.animals[t.id] ? ` <em>(×${e.animals[t.id]})</em>` : ""}</b><span>${usd(farmCash(t.price))} each · ${"ox" === t.id ? "pulls the plow" : "pig" === t.id ? "raised for pork" : `gives ${t.makes}`}</span></div>${DOTS}</div>`,
          ).join("") +
          '<div class="sec">Workers &amp; Buildings</div>' +
          `<div class="row" data-f="hands"><img src="emoji/1f9fa.png" alt=""><div class="t"><b>Hired Hands <em>(×${e.hands || 0})</em></b><span>${usd(eraCash(150))} a year each · each works 30 acres</span></div>${DOTS}</div>` +
          FARM_UPGRADES.map(
            (t) =>
              `<div class="row${e[t.id] ? " dis" : ""}" data-up="${t.id}"><img src="${t.ico}" alt=""><div class="t"><b>${t.name}${e[t.id] ? " <em>(built)</em>" : ""}</b><span>${e[t.id] ? t.desc : `${usd(eraCash(t.price))} · ${t.desc}`}</span></div>${e[t.id] ? "" : DOTS}</div>`,
          ).join("") +
          '<div class="sec">This Year</div>' +
          `<div class="row" data-f="work"><img src="jobev/seedling.png" alt=""><div class="t"><b>Work the Farm</b><span>${e.worked === state.age ? "You already put in the work this year" : "Pitch in with the chores for a better harvest"}</span></div>${e.worked === state.age ? "" : DOTS}</div>` +
          `<div class="row" data-f="sell"><img src="pets/ui-sell.png" alt=""><div class="t"><b>Sell the Farm</b><span>Worth about ${usd(farmValue(e))}${e.homestead && !e.proved ? " · homestead not proved up yet" : ""}</span></div>${DOTS}</div>`),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-crop]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), cropCard(e.dataset.crop);
              }),
          ),
          sList.querySelectorAll("[data-ani]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), animalCard(e.dataset.ani);
              }),
          ),
          sList.querySelectorAll("[data-up]").forEach(
            (t) =>
              (t.onclick = () => {
                const a = FARM_UPGRADES.find((e) => e.id === t.dataset.up);
                if (e[a.id]) return;
                play("choice");
                const o = eraCash(a.price);
                if (state.money < o)
                  return notice(
                    "Not enough money",
                    `Building a ${a.name.toLowerCase()} costs ${usd(o)}.`,
                    null,
                    !0,
                  );
                iosConfirm(a.name, `Build a ${a.name.toLowerCase()} for ${usd(o)}?`, () => {
                  (state.money = cents(state.money - o)),
                    (e[a.id] = !0),
                    play("rockBreak"),
                    renderStats(),
                    say(`I built a ${a.name.toLowerCase()} on my farm.`),
                    openFarm();
                });
              }),
          );
        const s = {
          report: () => harvestCard(e.last),
          hands: handsCard,
          work: workFarm,
          sell: sellFarm,
          replant: () => {
            const t = replantCost(e);
            if (!farmPlanted(e)) {
              if (state.money < t) return notice("Not enough money", `The seed costs ${usd(t)}.`, null, !0);
              (state.money = cents(state.money - t)),
                (e.plan = { ...e.lastPlan }),
                renderStats(),
                play("coins"),
                say(`I bought ${usd(t)} of seed and replanted my fields.`),
                openFarm();
            }
          },
        };
        sList.querySelectorAll("[data-f]").forEach(
          (e) =>
            (e.onclick = () => {
              play("choice"), s[e.dataset.f]();
            }),
        ),
          screen.classList.add("open");
      }
      function openFarmMarket() {
        (sTitle.textContent = "BUY A FARM"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const e = farmListings();
        (sList.innerHTML =
          (homesteadOpen()
            ? `<div class="sec">Homestead Act</div><div class="row" data-home="1"><img src="houses1800/house13.png" alt=""><div class="t"><b>Claim a Homestead <em>(160 acres)</em></b><span>${usd(eraCash(18))} filing fee · free land out west if you live on it and farm it for 5 years</span></div>${DOTS}</div>`
            : "") +
          `<div class="sec">Farms for Sale in ${farmYear()}</div>` +
          e
            .map(
              (e, t) =>
                `<div class="row" data-farm="${t}"><img src="${e.sprite}" alt=""><div class="t"><b>${e.name} <em>(${e.acres} acres)</em></b><span>${usd(landPrice(e.acres, e.perAcre, e.soil))} · ${e.soil >= 75 ? "rich" : e.soil >= 50 ? "decent" : "poor"} soil · ${e.addr}</span></div>${DOTS}</div>`,
            )
            .join("")),
          (sList.scrollTop = 0);
        const t = (t, a, o) =>
            state.age < 18
              ? notice("Too young", "You must be 18 to own a farm.", null, !0)
              : state.money < a
                ? notice("Not enough money", `That costs ${usd(a)}.`, null, !0)
                : ((state.money = cents(state.money - a)),
                  (state.farm = {
                    name: o
                      ? `${SURNAME} Homestead`
                      : `${SURNAME} ${"estate" === t.kind ? "Estate" : "Farm"}`,
                    kind: t.kind,
                    acres: t.acres,
                    soil: t.soil,
                    perAcre: t.perAcre,
                    sprite: t.sprite,
                    plan: {},
                    animals: {},
                    hands: 0,
                    since: farmYear(),
                    paid: a,
                    homestead: !!o,
                    proved: !o,
                  }),
                  o ? (state.farmMarket = null) : e.splice(e.indexOf(t), 1),
                  (state.respect = clamp((state.respect ?? 40) + ("estate" === t.kind ? 8 : 3))),
                  renderStats(),
                  play("horseNeigh"),
                  say(
                    o
                      ? "I filed a homestead claim on 160 acres of land."
                      : `I bought a ${t.acres}-acre ${t.name.toLowerCase()} for ${usd(a)}.`,
                  ),
                  void notice(
                    o ? "Homestead claimed" : "You own a farm!",
                    `${state.farm.name} is yours. Plant your fields and buy some livestock.${o ? " Live on it and farm it for 5 years to prove up and own it outright." : ""}`,
                    openFarm,
                    !0,
                  )),
          a = sList.querySelector("[data-home]");
        a &&
          (a.onclick = () => {
            play("choice"),
              jCard({
                tag: "Homestead Act",
                iconSrc: "houses1800/house13.png",
                title: "Claim a Homestead",
                close: !0,
                lead: "The government will give you 160 acres of untamed land for a small filing fee. You must build a home, live on it and farm it for 5 years before it is truly yours.",
                rows: [
                  ["Filing Fee", usd(eraCash(18))],
                  ["Land", "160 acres"],
                  ["Soil", "Unknown, often poor"],
                ],
                choices: [
                  [
                    "File the claim",
                    () =>
                      t(
                        {
                          kind: "family",
                          acres: 160,
                          soil: rint(25, 70),
                          perAcre: 10,
                          sprite: "houses1800/house13.png",
                          name: "Homestead",
                        },
                        eraCash(18),
                        !0,
                      ),
                  ],
                ],
              });
          }),
          sList.querySelectorAll("[data-farm]").forEach(
            (a) =>
              (a.onclick = () => {
                const o = e[+a.dataset.farm],
                  n = landPrice(o.acres, o.perAcre, o.soil);
                play("choice"),
                  jCard({
                    tag: "Land Agent",
                    iconSrc: o.sprite,
                    title: o.name,
                    close: !0,
                    lead: `${o.acres} acres with a farmhouse, ${o.addr}.`,
                    rows: [
                      ["Price", usd(n)],
                      ["Acres", o.acres],
                      ["Soil", o.soil >= 75 ? "Rich" : o.soil >= 50 ? "Decent" : "Poor"],
                      ["Bank Balance", usd(state.money)],
                    ],
                    choices: [["Buy the farm", () => t(o, n, !1)]],
                  });
              }),
          ),
          screen.classList.add("open");
      }
      const replantCost = (e) =>
        cents(
          Object.entries(e.lastPlan || {}).reduce((e, [t, a]) => {
            const o = CROPS().find((e) => e.id === t);
            return e + (o ? farmCash(o.seed) * a : 0);
          }, 0),
        );
      function cropCard(e) {
        const t = state.farm,
          a = CROPS().find((t) => t.id === e),
          o = t.plan[e] || 0,
          n = t.acres - farmPlanted(t),
          s = farmCash(a.seed),
          r = [...new Set([5, 10, 20, 40, 80, Math.min(n, farmCap(t)), n].filter((e) => e > 0 && e <= n))]
            .sort((e, t) => e - t)
            .slice(-3);
        jCard({
          tag: t.name,
          iconSrc: a.ico,
          title: a.name,
          close: !0,
          lead: `Buy seed and plant ${a.name.toLowerCase()}. It grows through the summer and is harvested and sold when you age up. Next year you'll need to buy seed again.`,
          rows: [
            ["Planted Now", `${o} acres`],
            ["Free Acres", `${n}`],
            ["Seed", `${usd(s)} an acre`],
            ["Labor", laborWord(a.labor)],
            ["Yield", `about ${a.yld} ${a.unit} an acre`],
            ["Sells For", `${usd(farmCash(a.price))} a ${"lb" === a.unit ? "lb" : a.unit.replace(/s$/, "")}`],
          ],
          choices: [
            ...r.map((n) => [
              `Plant ${n} more acres (${usd(cents(s * n))})`,
              () =>
                ((n) => {
                  const r = cents(s * n);
                  if (state.money < r)
                    return notice(
                      "Not enough money",
                      `Seed for ${n} acres of ${a.name.toLowerCase()} costs ${usd(r)}.`,
                      null,
                      !0,
                    );
                  (state.money = cents(state.money - r)),
                    (t.plan[e] = o + n),
                    renderStats(),
                    play("coins"),
                    say(`I bought ${usd(r)} of ${a.name.toLowerCase()} seed and planted ${n} acres.`),
                    openFarm();
                })(n),
            ]),
            ...(o
              ? [
                  [
                    "Plow it under",
                    () => {
                      delete t.plan[e], say(`I plowed under my ${a.name.toLowerCase()} field.`), openFarm();
                    },
                    "gray",
                  ],
                ]
              : []),
          ],
        });
      }
      function animalCard(e) {
        const t = state.farm,
          a = ANIMALS.find((t) => t.id === e),
          o = t.animals[e] || 0,
          n = farmCash(a.price),
          s = Math.max(4, Math.round(t.acres * ("chicken" === e ? 2 : 0.6))),
          r = (r) =>
            o + r > s
              ? notice(
                  "No room",
                  `Your ${t.acres} acres can't keep more than ${s} ${a.name.toLowerCase()}s.`,
                  null,
                  !0,
                )
              : state.money < n * r
                ? notice("Not enough money", `That costs ${usd(n * r)}.`, null, !0)
                : ((state.money = cents(state.money - n * r)),
                  (t.animals[e] = o + r),
                  renderStats(),
                  play("coins"),
                  say(
                    `I bought ${r} ${1 === r ? a.name.toLowerCase() : `${a.name.toLowerCase()}s`} for my farm.`,
                  ),
                  void openFarm()),
          i = (s) => {
            const r = cents(n * s * ("pig" === e ? 1.6 : 0.85));
            (t.animals[e] = o - s),
              (state.money = cents(state.money + r)),
              renderStats(),
              play("coins"),
              say(
                `I sold ${s} ${1 === s ? a.name.toLowerCase() : `${a.name.toLowerCase()}s`} for ${usd(r)}.`,
              ),
              openFarm();
          };
        jCard({
          tag: t.name,
          iconSrc: a.ico,
          title: a.name,
          close: !0,
          lead:
            "ox" === a.id
              ? "An ox pulls the plow, so you can work twice the land without a workhorse."
              : "pig" === a.id
                ? "Hogs breed fast and sell well at market once they are fattened."
                : `Each one gives you ${a.makes} to sell every year.`,
          rows: [
            ["You Have", o],
            ["Price", usd(n)],
            ["Feed", `${usd(farmCash(a.feed))} a year each`],
            ...(a.val ? [["Earns", `about ${usd(farmCash(a.val))} a year each`]] : []),
          ],
          choices: [
            ["Buy 1", () => r(1)],
            ["Buy 5", () => r(5)],
            ...(o ? [[`Sell 1 (${usd(cents(n * ("pig" === e ? 1.6 : 0.85)))})`, () => i(1)]] : []),
            ...(o >= 5 ? [["Sell 5", () => i(5)]] : []),
          ],
        });
      }
      function handsCard() {
        const e = state.farm,
          t = eraCash(150);
        jCard({
          tag: e.name,
          iconSrc: "emoji/1f9fa.png",
          title: "Hired Hands",
          close: !0,
          lead: `Each hand works 30 acres and costs ${usd(t)} a year, paid at harvest.`,
          rows: [
            ["Hands", e.hands || 0],
            ["Work You Can Do", farmCap(e)],
            ["Work Needed", farmNeed(e)],
          ],
          choices: [
            [
              "Hire a hand",
              () => {
                if ((e.hands || 0) >= Math.max(1, Math.ceil(e.acres / 4)))
                  return notice("Enough hands", "You have more hands than your land needs.", null, !0);
                (e.hands = (e.hands || 0) + 1), say("I hired a farm hand."), openFarm();
              },
            ],
            ...(e.hands
              ? [
                  [
                    "Let a hand go",
                    () => {
                      e.hands--, say("I let a farm hand go."), openFarm();
                    },
                  ],
                ]
              : []),
          ],
        });
      }
      function workFarm() {
        const e = state.farm;
        if (e.worked === state.age)
          return notice("Done for the year", "You already put in the work this year.", null, !0);
        jCard({
          tag: e.name,
          iconSrc: "jobev/seedling.png",
          title: "Work the Farm",
          close: !0,
          lead: "There is always something to do on a farm. What will you work on?",
          choices: [
            [
              "Plow and plant from dawn to dusk",
              () => {
                (e.worked = state.age),
                  (e.boost = 1.12),
                  eraResult(e.name, "jobev/seedling.png", [
                    1,
                    "I plowed and planted from dawn to dusk. The fields look promising.",
                    { Health: -3, Happiness: 2 },
                  ]);
              },
            ],
            [
              "Mend the fences and the barn",
              () => {
                (e.worked = state.age),
                  (e.boost = 1.05),
                  (e.soil = Math.min(100, e.soil + 1)),
                  eraResult(e.name, "jobev/seedling.png", [
                    1,
                    "I spent the week mending fences and patching the barn.",
                    { Health: -1, Happiness: 3 },
                  ]);
              },
            ],
            [
              "Spread manure on the fields",
              () => {
                (e.worked = state.age),
                  (e.soil = Math.min(100, e.soil + rint(3, 6))),
                  eraResult(e.name, "jobev/seedling.png", [
                    1,
                    "I spread manure across the fields. It stank, but the soil will thank me.",
                    { Happiness: -2, Looks: -1 },
                  ]);
              },
            ],
            [
              "Tend the animals",
              () => {
                (e.worked = state.age),
                  (e.tend = state.age),
                  eraResult(e.name, "jobev/cow.png", [
                    1,
                    "I fed, milked and brushed down the animals.",
                    { Happiness: 4 },
                  ]);
              },
            ],
          ],
        });
      }
      function sellFarm() {
        const e = state.farm,
          t = farmValue(e);
        if (e.homestead && !e.proved)
          return notice(
            "Not yours yet",
            `You have to live on your homestead until ${e.since + 5} to prove up before you can sell it.`,
            null,
            !0,
          );
        const a = cents(t * (0.85 + 0.3 * Math.random()));
        iosConfirm(
          "Sell the Farm",
          `A buyer offers ${usd(a)} for ${e.name}, its land, animals and buildings. Sell?`,
          () => {
            (state.money = cents(state.money + a)),
              (state.farm = null),
              renderStats(),
              play("coins"),
              say(`I sold ${e.name} for ${usd(a)}.`),
              notice("Farm sold", `You sold ${e.name} for ${usd(a)}.`, openActivities, !0);
          },
        );
      }
      function harvestCard(e) {
        e &&
          jCard({
            tag: `Harvest of ${e.year}`,
            iconSrc: "jobev/wheat.png",
            title: "Harvest Report",
            close: !0,
            lead: e.wxText,
            rows: [
              ...e.lines,
              ...(e.costs ? [["Animal Feed", `−${usd(e.costs)}`]] : []),
              ...(e.wages ? [["Hands' Wages", `−${usd(e.wages)}`]] : []),
              [e.net >= 0 ? "Cleared" : "Lost", usd(Math.abs(e.net))],
            ],
            ok: () => {},
          });
      }
      function farmRows() {
        const e = state.farm;
        return e
          ? `<div class="sec">Farm</div><div class="row" data-farmrow="1"><img src="${e.sprite}" alt=""><div class="t"><b>${e.name} <em>(${e.acres} acres)</em></b><span>Worth about ${usd(farmValue(e))}${e.last ? ` · last harvest ${e.last.net >= 0 ? "cleared" : "lost"} ${usd(Math.abs(e.last.net))}` : ""}</span></div>${CHEV}</div>`
          : "";
      }
      function farmHarvest(e) {
        const t = state.farm,
          a = farmYear(),
          o = CROPS(),
          n = farmCap(t),
          s = farmPlanted(t),
          r = farmNeed(t),
          i = r ? Math.min(1, n / r) : 1;
        let l = eraRoll(
          FARM_WEATHER.map(([e, t, o, n]) => [
            e * ("locusts" === t && "us" === state.country && a >= 1873 && a <= 1877 ? 6 : 1),
            t,
            o,
            n,
          ]),
        );
        "us" !== state.country &&
          a >= 1845 &&
          a <= 1849 &&
          t.plan.potatoes &&
          chance(0.7) &&
          (l = [0, "blight", "The potato blight rotted the crop in the ground.", 0.8]);
        let c = l[3];
        !t.well || ("dry" !== l[1] && "drought" !== l[1]) || (c = Math.min(1, c + 0.3));
        const d = [];
        let u = 0,
          h = 0;
        for (const e of o) {
          const a = t.plan[e.id];
          if (!a) continue;
          const o =
              "blight" === l[1]
                ? "potatoes" === e.id
                  ? 0.1
                  : 1
                : "locusts" === l[1] && "potatoes" === e.id
                  ? 0.9
                  : c,
            n =
              Math.round(
                a * i * e.yld * (0.4 + t.soil / 116) * o * (t.boost || 1) * (0.85 + 0.3 * Math.random()) * 10,
              ) / 10,
            s = cents(n * farmCash(e.price));
          (u += s), d.push([`${e.name} (${a} acres)`, `${n.toLocaleString()} ${e.unit} · ${usd(s)}`]);
        }
        i < 1 && d.push(["Short-handed", `Only ${Math.round(100 * i)}% of the work got done`]);
        const p = [],
          m = [];
        for (const e of ANIMALS) {
          let a = t.animals[e.id] || 0;
          if (a) {
            if (((h += farmCash(e.feed) * a), !t.barn && chance(0.25))) {
              const t = Math.max(1, Math.round(0.1 * a));
              (a -= t), m.push(`${t} ${e.name.toLowerCase()}${t > 1 ? "s" : ""} died in the winter`);
            }
            if (!t.fence && /chicken|sheep/.test(e.id) && chance(0.2)) {
              const t = Math.max(1, Math.round(a * (0.1 + 0.2 * Math.random())));
              (a -= t),
                m.push(
                  `${"sheep" === e.id ? "Wolves" : "Foxes"} took ${t} ${e.name.toLowerCase()}${t > 1 ? "s" : ""}`,
                );
            }
            if (e.val && a > 0) {
              const o = cents(
                farmCash(e.val) * a * i * (t.tend === state.age - 1 ? 1.15 : 1) * (t.barn ? 1.1 : 1),
              );
              (u += o),
                d.push([
                  `${e.makes[0].toUpperCase() + e.makes.slice(1)} (${a} ${e.name.toLowerCase()}${a > 1 ? "s" : ""})`,
                  usd(o),
                ]);
            }
            if (e.breed && a >= 2 && chance(e.breed)) {
              const t = rint(...e.litter) * Math.max(1, Math.floor(a / 4));
              (a += t), p.push(`${t} new ${e.name.toLowerCase()}${t > 1 ? "s" : ""}`);
            }
            t.animals[e.id] = Math.max(0, a);
          }
        }
        p.length && d.push(["Born", p.join(", ")]), m.length && d.push(["Losses", m.join("; ")]);
        let f = cents(eraCash(150) * (t.hands || 0));
        f &&
          state.money + u - h < f &&
          (d.push(["Hands", "Your hands quit because you couldn't pay them"]), (t.hands = 0), (f = 0));
        const g = cents(u - h - f);
        return (
          (state.money = cents(Math.max(0, state.money + g))),
          (t.soil = Math.max(
            10,
            Math.min(
              100,
              t.soil +
                (s > 0.8 * t.acres ? -2 : 1) +
                Math.min(
                  3,
                  Math.floor(((t.animals.cow || 0) + (t.animals.pig || 0) + (t.animals.sheep || 0)) / 6),
                ),
            ),
          )),
          (t.boost = 1),
          s && (t.lastPlan = { ...t.plan }),
          (t.plan = {}),
          t.homestead &&
            !t.proved &&
            a - t.since >= 5 &&
            ((t.proved = !0),
            d.push(["Homestead", "You proved up! The land is yours outright"]),
            (state.respect = clamp((state.respect ?? 40) + 5))),
          g > 0 && (state.respect = clamp((state.respect ?? 40) + (g > eraCash(300) ? 2 : 1))),
          (t.last = { year: a - 1, wx: l[1], wxText: l[2], lines: d, costs: cents(h), wages: f, net: g }),
          e ||
            (!s && !Object.values(t.animals).some(Boolean)) ||
            (say(`${l[2]} My farm ${g >= 0 ? `cleared ${usd(g)}` : `lost ${usd(-g)}`} this year.`),
            state.age >= 14 && queuePopup(() => harvestCard(t.last))),
          g
        );
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        !state.dead && state.farm && farmHarvest();
      });
      const BIZ_LV = [1, 2, 3.5, 5],
        BIZ_EMOJI = {
          store: "1f9fa",
          smithy: "1f528",
          bakery: "1f35e",
          tailor: "1f454",
          dress: "1f457",
          saloon: "1f37b",
          eating: "1f37d-fe0f",
          hotel: "1f3e8",
          photo: "1f4f7",
          jewel: "1f48d",
          paper: "1f4f0",
          brewery: "1f37a",
          still: "1f943",
          tannery: "1f45e",
          cigar: "1f6ac",
          tonic: "1f48a",
          sawmill: "1fa9a",
          logging: "1fab5",
          textile: "1f9f6",
          works: "1f3ed",
          foundry: "1f6e0-fe0f",
          coal: "26cf-fe0f",
          gold: "1fa99",
          tin: "1faa8",
          oil: "1f6e2-fe0f",
          ranch: "1f404",
          fish: "1f3a3",
          freight: "1f4e6",
          stage: "1f40e",
          ships: "1f6a2",
          theater: "1f3ad",
          circus: "1f3aa",
          bank: "1f3e6",
          insure: "1f6e1-fe0f",
          rail: "1f682",
          inv: "1f3ed",
        },
        BIZ = Object.fromEntries(
          [
            [
              "store",
              "General Store",
              "store",
              1800,
              "",
              1500,
              3,
              "clerks",
              300,
              0.7,
              0.22,
              0.02,
              0,
              0.15,
              "Sell flour, cloth, tools and sundries to the townsfolk",
            ],
            [
              "smithy",
              "Blacksmith Shop",
              "smithy",
              1800,
              "",
              600,
              2,
              "smiths",
              420,
              0.4,
              0.25,
              0.03,
              0,
              0.12,
              "Shoe horses, mend wagons and forge tools",
            ],
            [
              "bakery",
              "Bakery",
              "bakery",
              1800,
              "",
              800,
              3,
              "bakers",
              300,
              0.55,
              0.2,
              0.035,
              0,
              0.12,
              "Bake bread and pies for the whole town",
            ],
            [
              "tailor",
              "Tailor's Shop",
              "tailor",
              1800,
              "",
              700,
              3,
              "tailors",
              330,
              0.5,
              0.2,
              0.02,
              0,
              0.15,
              "Cut and sew suits for gentlemen",
            ],
            [
              "dress",
              "Dressmaker's Shop",
              "dressmaker",
              1800,
              "",
              600,
              4,
              "seamstresses",
              200,
              0.5,
              0.2,
              0.02,
              0,
              0.15,
              "Make gowns and dresses for the ladies of the town",
            ],
            [
              "saloon",
              "Saloon",
              "saloon",
              1800,
              "",
              1200,
              3,
              "barkeeps",
              300,
              0.45,
              0.28,
              0.04,
              0,
              0.2,
              "Pour whiskey and beer for thirsty customers",
            ],
            [
              "eating",
              "Eating House",
              "restaurant",
              1820,
              "",
              1500,
              4,
              "cooks and waiters",
              280,
              0.55,
              0.2,
              0.03,
              0,
              0.18,
              "Serve hot meals to travelers and workers",
            ],
            [
              "hotel",
              "Hotel",
              "hotel",
              1800,
              "",
              12e3,
              15,
              "staff",
              250,
              0.4,
              0.14,
              0.025,
              0.02,
              0.2,
              "Rent rooms to travelers, drummers and newcomers",
            ],
            [
              "photo",
              "Photography Studio",
              "camera",
              1841,
              "",
              500,
              2,
              "assistants",
              350,
              0.35,
              0.3,
              0.02,
              0,
              0.3,
              "Take portraits with the newest marvel of the age",
            ],
            [
              "jewel",
              "Jewelry Shop",
              "jeweler",
              1800,
              "",
              4e3,
              3,
              "craftsmen",
              450,
              0.65,
              0.18,
              0.01,
              0,
              0.25,
              "Sell rings, watches and necklaces to the wealthy",
            ],
            [
              "paper",
              "Newspaper",
              "newspaper",
              1800,
              "",
              3500,
              12,
              "printers and reporters",
              420,
              0.35,
              0.15,
              0.04,
              0.03,
              0.25,
              "Print the news and sell advertising",
            ],
            [
              "brewery",
              "Brewery",
              "brewery",
              1800,
              "",
              9e3,
              15,
              "brewers",
              380,
              0.5,
              0.17,
              0.04,
              0.03,
              0.2,
              "Brew lager and ale for the saloons",
            ],
            [
              "still",
              "Distillery",
              "distillery",
              1800,
              "",
              6e3,
              10,
              "distillers",
              380,
              0.5,
              0.2,
              0.06,
              0.02,
              0.25,
              "Distill whiskey by the barrel",
            ],
            [
              "tannery",
              "Tannery",
              "tannery",
              1800,
              "",
              4e3,
              12,
              "tanners",
              340,
              0.55,
              0.15,
              0.02,
              0.04,
              0.15,
              "Turn hides into leather for boots and saddles",
            ],
            [
              "cigar",
              "Cigar Factory",
              "cigar",
              1820,
              "",
              5e3,
              30,
              "cigar rollers",
              280,
              0.5,
              0.17,
              0.03,
              0.06,
              0.2,
              "Roll cigars by hand for the tobacco shops",
            ],
            [
              "tonic",
              "Patent Medicine Company",
              "medicine",
              1830,
              "",
              2500,
              6,
              "bottlers",
              260,
              0.3,
              0.3,
              0.02,
              0.01,
              0.45,
              "Bottle a miracle tonic and sell it in every town",
            ],
            [
              "sawmill",
              "Sawmill",
              "sawmill",
              1800,
              "",
              7e3,
              20,
              "mill hands",
              320,
              0.45,
              0.15,
              0.06,
              0.04,
              0.2,
              "Saw logs into lumber for the growing towns",
            ],
            [
              "logging",
              "Logging Camp",
              "logging",
              1800,
              "",
              3e3,
              25,
              "lumberjacks",
              300,
              0.25,
              0.14,
              0.03,
              0.05,
              0.25,
              "Fell whole forests and float the logs downriver",
            ],
            [
              "textile",
              "Textile Mill",
              "textile",
              1814,
              "",
              6e4,
              200,
              "mill hands",
              210,
              0.55,
              0.13,
              0.05,
              0.07,
              0.2,
              "Spin cotton and weave cloth on hundreds of looms",
            ],
            [
              "works",
              "Manufacturing Works",
              "factory",
              1820,
              "",
              3e4,
              100,
              "factory hands",
              330,
              0.5,
              0.14,
              0.045,
              0.07,
              0.2,
              "Make plows, stoves and tools by the thousand",
            ],
            [
              "foundry",
              "Iron Foundry",
              "foundry",
              1800,
              "",
              4e4,
              120,
              "ironworkers",
              400,
              0.55,
              0.14,
              0.05,
              0.08,
              0.25,
              "Cast iron for rails, engines and cannon",
            ],
            [
              "coal",
              "Coal Mine",
              "coal-mine",
              1800,
              "",
              15e3,
              80,
              "miners",
              380,
              0.2,
              0.14,
              0.02,
              0.1,
              0.2,
              "Dig coal to fuel the railroads and factories",
              "mine",
            ],
            [
              "gold",
              "Gold Mine",
              "gold-mine",
              1829,
              "us",
              2e4,
              50,
              "miners",
              450,
              0.2,
              0.3,
              0.015,
              0.07,
              0.5,
              "Work a gold vein. It could make you rich, until it runs out",
              "vein",
            ],
            [
              "tin",
              "Tin Mine",
              "tin-mine",
              1800,
              "uk",
              12e3,
              70,
              "miners",
              300,
              0.2,
              0.16,
              0.015,
              0.08,
              0.35,
              "Mine tin and copper deep under Cornwall",
              "vein",
            ],
            [
              "oil",
              "Oil Well",
              "oil",
              1859,
              "us",
              2500,
              6,
              "drillers",
              450,
              0.15,
              0.5,
              0.07,
              0.02,
              0.6,
              "Drill for rock oil. A gusher makes you rich, a dry hole makes you broke",
              "oil",
            ],
            [
              "ranch",
              "Cattle Ranch",
              "ranch",
              1840,
              "us",
              1e4,
              10,
              "cowboys",
              300,
              0.2,
              0.16,
              0.015,
              0.02,
              0.35,
              "Run longhorns on the open range and drive them to market",
              "ranch",
            ],
            [
              "fish",
              "Fishing Fleet",
              "fishing",
              1800,
              "",
              4e3,
              12,
              "fishermen",
              300,
              0.3,
              0.16,
              0.01,
              0.03,
              0.35,
              "Send boats out for cod, herring and mackerel",
              "boat",
            ],
            [
              "freight",
              "Freight Wagon Line",
              "freight",
              1800,
              "",
              3e3,
              8,
              "teamsters",
              320,
              0.35,
              0.18,
              0.01,
              0.02,
              0.2,
              "Haul goods between towns by wagon",
            ],
            [
              "stage",
              "Stagecoach Line",
              "stagecoach",
              1800,
              "",
              8e3,
              12,
              "drivers and hostlers",
              340,
              0.35,
              0.18,
              0.01,
              0.02,
              0.2,
              "Carry passengers and mail between towns",
              "stage",
            ],
            [
              "ships",
              "Shipping Line",
              "shipping",
              1800,
              "",
              8e4,
              120,
              "sailors",
              300,
              0.4,
              0.14,
              0.015,
              0.04,
              0.35,
              "Carry cargo and passengers across the ocean",
              "ship",
            ],
            [
              "theater",
              "Theater",
              "theater",
              1800,
              "",
              15e3,
              25,
              "actors and stagehands",
              360,
              0.3,
              0.14,
              0.06,
              0.02,
              0.4,
              "Put on plays, operas and minstrel shows",
            ],
            [
              "circus",
              "Traveling Circus",
              "circus",
              1825,
              "",
              8e3,
              30,
              "performers",
              300,
              0.35,
              0.18,
              0.03,
              0.02,
              0.45,
              "Tour the country with acrobats, clowns and an elephant",
            ],
            [
              "bank",
              "Private Bank",
              "bank",
              1800,
              "",
              3e4,
              6,
              "clerks",
              500,
              0.1,
              0.12,
              0.01,
              0,
              0.15,
              "Take deposits and lend money at interest",
              "bank",
            ],
            [
              "insure",
              "Fire Insurance Company",
              "insurance",
              1800,
              "",
              25e3,
              8,
              "clerks",
              500,
              0.1,
              0.14,
              0,
              0,
              0.2,
              "Sell fire policies and pray nothing burns",
              "ins",
            ],
            [
              "rail",
              "Railroad",
              "railroad",
              1830,
              "",
              4e5,
              600,
              "railroad men",
              420,
              0.45,
              0.09,
              0.01,
              0.06,
              0.3,
              "Lay track, run trains and carry the nation",
              "rail",
            ],
            [
              "inv",
              "Manufacturing Company",
              "factory",
              9999,
              "none",
              2e4,
              60,
              "factory hands",
              380,
              0.5,
              0.28,
              0.04,
              0.06,
              0.3,
              "Make and sell your own patented invention",
              "inv",
            ],
          ].map(([e, t, a, o, n, s, r, i, l, c, d, u, h, p, m, f]) => [
            e,
            {
              id: e,
              name: t,
              ico: `freelife/apple/${BIZ_EMOJI[e]}.png`,
              from: o,
              only: n,
              cost: s,
              max: r,
              staff: i,
              wage: l,
              mat: c,
              roi: d,
              fire: u,
              strike: h,
              vol: p,
              desc: m,
              kind: f,
            },
          ]),
        ),
        bizYear = () => state.birthYear + state.age,
        lvlAt = (e) => {
          const t = ERA_LVL;
          if (e <= t[0][0]) return t[0][1] / 0.006;
          for (let a = 1; a < t.length; a++)
            if (e <= t[a][0]) {
              const [o, n] = t[a - 1],
                [s, r] = t[a];
              return (n + ((r - n) * (e - o)) / (s - o)) / 0.006;
            }
          return t[t.length - 1][1] / 0.006;
        },
        wageIdx = (e) => lvlAt(e) * Math.pow(1.008, e - 1860),
        revIdx = (e) => wageIdx(e) * Math.pow(1.002, Math.max(0, e - 1860)),
        BIZ_SLUMPS = () =>
          "us" === state.country
            ? [
                [1819, 1821, "the Panic of 1819"],
                [1837, 1842, "the Panic of 1837"],
                [1857, 1858, "the Panic of 1857"],
                [1873, 1878, "the Long Depression"],
                [1884, 1885, "the Panic of 1884"],
                [1893, 1896, "the Panic of 1893"],
                [1907, 1908, "the Panic of 1907"],
                [1920, 1921, "the Depression of 1920"],
                [1929, 1939, "the Great Depression"],
              ]
            : [
                [1825, 1826, "the Panic of 1825"],
                [1837, 1839, "the Panic of 1837"],
                [1847, 1848, "the Commercial Crisis of 1847"],
                [1857, 1858, "the Panic of 1857"],
                [1866, 1867, "the Overend Gurney crash"],
                [1873, 1879, "the Long Depression"],
                [1890, 1891, "the Baring Crisis"],
                [1920, 1921, "the Depression of 1920"],
                [1929, 1935, "the Great Depression"],
              ],
        slumpAt = (e) => BIZ_SLUMPS().find(([t, a]) => e >= t && e <= a) || null,
        demandAt = (e) => {
          const t = slumpAt(e);
          return t ? (e === t[0] ? 0.8 : 0.9) : 1;
        },
        bizDry = (e) => "us" === state.country && e >= 1920 && e <= 1933,
        BIZ_PAY = {
          low: ["Low", 0.85, 0.94, "Cheaper, but workers quit and go on strike"],
          fair: ["Fair", 1, 1, "The going rate in town"],
          good: ["Good", 1.1, 1.06, "Workers stay loyal and work harder"],
        },
        bizT = (e) => BIZ[e.type],
        bizA = (e) => (/^[aeiou]/i.test(e) ? "an" : "a"),
        cap1 = (e) => e[0].toUpperCase() + e.slice(1),
        bizName = (e) => ("saloon" === e.id && "us" !== state.country ? "Public House" : e.name),
        bizIco = (e) => ("inv" === e.type && INVENTIONS.find((t) => t.id === e.inv)?.ico) || bizT(e).ico,
        bizMax = (e) => Math.round(bizT(e).max * BIZ_LV[e.lvl - 1]),
        bizWage = (e, t = bizYear()) => bizT(e).wage * wageIdx(t) * BIZ_PAY[e.pay][1],
        bizRevPer = (e) => (e.wage + (e.cost * (e.roi + 0.04)) / e.max) / (1 - e.mat),
        bizBaseU = (e, t = bizYear()) => e.cost * revIdx(t),
        bizValueU = (e) => {
          const t = bizT(e);
          let a = bizBaseU(t) * BIZ_LV[e.lvl - 1];
          return (
            e.last &&
              (a *= Math.max(
                0.5,
                Math.min(2.2, 0.75 + (e.last.u / (t.cost * revIdx(e.last.year) * BIZ_LV[e.lvl - 1])) * 2.5),
              )),
            (e.dry || (("vein" === t.kind || "oil" === t.kind) && e.reserve < 0)) && (a *= 0.12),
            a
          );
        },
        bizValue = (e) => eraCash(bizValueU(e)),
        bizPremU = (e) => 0.015 * bizValueU(e),
        bizOpenTypes = () => {
          const e = bizYear();
          return Object.values(BIZ).filter(
            (t) =>
              t.from <= e &&
              (!t.only || t.only === state.country) &&
              !(bizDry(e) && /saloon|brewery|still/.test(t.id)),
          );
        };
