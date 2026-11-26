      function openMarket() {
        play("choice"),
          (sTitle.textContent = "MARKET"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const e = MARKET.filter((e) => !e.wild);
        (sList.innerHTML =
          '<div class="sec">Food & Drink</div>' +
          e
            .map(
              (e, t) =>
                `<div class="row" data-mk="${t}"><img src="${e.ico}" alt=""><div class="t"><b>${e.name}</b><span>${usd(eraCash(e.price))} · ${keepsTxt(e.keeps)}</span></div>${DOTS}</div>`,
            )
            .join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-mk]").forEach(
            (t) =>
              (t.onclick = () => {
                const a = e[+t.dataset.mk],
                  o = (e) => {
                    const t = eraCash(a.price * e);
                    if (state.money < t)
                      return notice(
                        "Not enough money",
                        `You need ${usd(t)} to buy ${1 === e ? "that" : "those"}.`,
                        null,
                        !0,
                      );
                    (state.money = cents(state.money - t)),
                      pantryAdd(a.id, e),
                      renderStats(),
                      say(`I bought ${1 === e ? "some" : e} ${a.name.toLowerCase()} at the market.`),
                      notice(
                        "Bought",
                        `You bought ${e} × ${a.name} for ${usd(t)}. You'll find ${1 === e ? "it" : "them"} in your Pantry under Assets.`,
                        null,
                        !0,
                      );
                  };
                jCard({
                  tag: "Market",
                  iconSrc: a.ico,
                  title: a.name,
                  close: !0,
                  rows: [
                    ["Price", usd(eraCash(a.price))],
                    ["Shelf Life", keepsTxt(a.keeps)],
                    ["Bank Balance", usd(state.money)],
                  ],
                  choices: [
                    ["Buy 1", () => o(1)],
                    ["Buy 5", () => o(5)],
                  ],
                });
              }),
          ),
          screen.classList.add("open");
      }
      function pantryRows() {
        const e = state.pantry || [];
        if (!e.length) return "";
        return (
          '<div class="sec">Pantry</div>' +
          [...new Set(e.map((e) => e.id))]
            .map((t) => {
              const a = marketItem(t),
                o = e.filter((e) => e.id === t).length;
              return `<div class="row" data-pantry="${t}"><img src="${a.ico}" alt=""><div class="t"><b>${a.name} <em>(×${o})</em></b><span>Tap to eat · ${keepsTxt(a.keeps).toLowerCase()}</span></div>${DOTS}</div>`;
            })
            .join("")
        );
      }
      function pantryCard(e) {
        const t = marketItem(e),
          a = state.pantry || [],
          o = a.findIndex((t) => t.id === e);
        o < 0 ||
          jCard({
            tag: "Pantry",
            iconSrc: t.ico,
            title: t.name,
            close: !0,
            rows: [
              ["In Pantry", a.filter((t) => t.id === e).length],
              ["Shelf Life", keepsTxt(t.keeps)],
            ],
            choices: [
              [
                /ale|wine|whiskey|coffee|milk/.test(e) ? "Drink one" : "Eat one",
                () => {
                  a.splice(o, 1),
                    isBooze(e) && drankAlcohol(),
                    (state.stats.Happiness = clamp(state.stats.Happiness + t.h)),
                    t.he && (state.stats.Health = clamp(state.stats.Health + t.he)),
                    say(
                      `I ${/ale|wine|whiskey|coffee|milk/.test(e) ? "drank" : "ate"} some ${t.name.toLowerCase()}.`,
                    ),
                    renderStats(),
                    openAssets();
                },
              ],
              [
                "Throw one away",
                () => {
                  a.splice(o, 1), say(`I threw away some ${t.name.toLowerCase()}.`), openAssets();
                },
                "gray",
              ],
            ],
          });
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        !state.dead &&
          state.pantry &&
          (state.pantry = state.pantry.filter((e) => {
            const t = marketItem(e.id);
            return t && state.age - e.at < t.keeps;
          }));
      });
      const HORSE_BREEDS = [
          {
            k: "draft",
            name: "Draft Horse",
            set: 5,
            price: 110,
            work: !0,
            speed: 20,
            desc: "A big, strong workhorse for the plow and the wagon",
          },
          {
            k: "mustang",
            name: "Mustang",
            set: 4,
            price: 90,
            ride: !0,
            work: !0,
            speed: 50,
            desc: "A tough, sure-footed horse from the open range",
          },
          {
            k: "morgan",
            name: "Morgan",
            set: 3,
            price: 175,
            ride: !0,
            work: !0,
            speed: 55,
            desc: "A versatile American breed, good under saddle or in harness",
          },
          {
            k: "thoroughbred",
            name: "Thoroughbred",
            set: 1,
            price: 400,
            ride: !0,
            speed: 90,
            desc: "A fast, high-strung racehorse",
          },
          {
            k: "arabian",
            name: "Arabian",
            set: 2,
            price: 800,
            ride: !0,
            speed: 80,
            desc: "A rare, beautiful horse with great stamina",
          },
        ],
        HORSE_COATS = {
          a: "Grey",
          b: "Palomino",
          c: "Chestnut",
          d: "Black",
          e: "Cremello",
          f: "White",
          g: "Pinto",
          h: "Piebald",
          i: "Appaloosa",
        },
        STABLE_NAMES = [
          "Duke",
          "Maggie",
          "Old Paint",
          "Buck",
          "Daisy",
          "Thunder",
          "Chester",
          "Bess",
          "Major",
          "Ginger",
          "Prince",
          "Belle",
          "Dusty",
          "Pepper",
          "Jack",
          "Molly",
          "Sultan",
          "Comet",
          "Blaze",
          "Nellie",
          "Ranger",
          "Sally",
          "Captain",
          "Lady",
          "Shadow",
          "Copper",
          "Dolly",
          "Rebel",
        ],
        breedOf = (e) => HORSE_BREEDS.find((t) => t.k === e.breed) || HORSE_BREEDS[0],
        horseImg = (e) => `pets/horse${breedOf(e).set}${e.coat}.png`,
        horseUpkeep = (e) => eraCash("draft" === e.breed ? 40 : 30),
        horseValue = (e) => {
          const t = e.age < 4 ? 0.8 : e.age <= 12 ? 1 : Math.max(0.1, 1 - 0.08 * (e.age - 12));
          return eraCash(Math.max(5, breedOf(e).price * t * (0.4 + e.health / 166)));
        },
        hasHorse = (e) => (state.horses || []).some((t) => !e || breedOf(t)[e]),
        horseDesc = (e) => `${HORSE_COATS[e.coat]} ${breedOf(e).name.toLowerCase()}`;
      function newHorse() {
        const e = pickR(
            HORSE_BREEDS.flatMap((e) => (e.price > 500 ? [e] : e.price > 300 ? [e, e] : [e, e, e])),
          ),
          t = Object.keys(HORSE_COATS).slice(0, 2 === e.set ? 7 : 9);
        return {
          name: pickR(STABLE_NAMES),
          breed: e.k,
          coat: pickR(t),
          age: rint(3, 14),
          health: rint(55, 100),
        };
      }
      function openHorseMarket() {
        play("choice"),
          (sTitle.textContent = "HORSE MARKET"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const e =
          state.horseMarket && state.horseMarket.age === state.age
            ? state.horseMarket
            : (state.horseMarket = { age: state.age, list: Array.from({ length: 6 }, newHorse) });
        e.list.forEach((e) => {
          e.price ??= Math.max(1, Math.round((horseValue(e) * rint(95, 115)) / 100));
        });
        const t = state.horses || [];
        (sList.innerHTML =
          (t.length
            ? '<div class="sec">Your Stable</div>' +
              t
                .map(
                  (e, t) =>
                    `<div class="row" data-myh="${t}"><img src="${horseImg(e)}" alt=""><div class="t"><b>${e.name} <em>(${e.age} yrs)</em></b><span>${horseDesc(e)} · health ${e.health}%</span></div>${DOTS}</div>`,
                )
                .join("")
            : "") +
          `<div class="sec">For Sale · feed and stabling ${usd(eraCash(30))}+ a year each</div>` +
          e.list
            .map(
              (e, t) =>
                `<div class="row" data-buyh="${t}"><img src="${horseImg(e)}" alt=""><div class="t"><b>${e.name} <em>(${breedOf(e).name})</em></b><span>${usd(e.price)} · ${HORSE_COATS[e.coat]} · ${e.age} yrs · health ${e.health}%</span></div>${DOTS}</div>`,
            )
            .join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-myh]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), horseCard(+e.dataset.myh, openHorseMarket);
              }),
          ),
          sList.querySelectorAll("[data-buyh]").forEach(
            (t) =>
              (t.onclick = () => {
                play("choice");
                const a = e.list[+t.dataset.buyh],
                  o = breedOf(a);
                jCard({
                  tag: "Horse Market",
                  iconSrc: horseImg(a),
                  title: a.name,
                  close: !0,
                  lead: `${o.desc}.`,
                  bars: [
                    ["Health", a.health],
                    ["Speed", o.speed, "#f4c044"],
                  ],
                  rows: [
                    ["Breed", o.name],
                    ["Coat", HORSE_COATS[a.coat]],
                    ["Age", `${a.age} years`],
                    ["Good for", [o.ride && "riding", o.work && "farm work"].filter(Boolean).join(" and ")],
                    ["Price", usd(a.price)],
                    ["Upkeep", `${usd(horseUpkeep(a))} a year`],
                  ],
                  choices: [
                    [
                      "Buy this horse",
                      () =>
                        state.age < 12
                          ? notice("Too young", "You must be at least 12 to buy a horse.", null, !0)
                          : state.money < a.price
                            ? notice("Not enough money", `${a.name} costs ${usd(a.price)}.`, null, !0)
                            : ((state.money = cents(state.money - a.price)),
                              (state.horses ||= []).push({
                                name: a.name,
                                breed: a.breed,
                                coat: a.coat,
                                age: a.age,
                                health: a.health,
                              }),
                              e.list.splice(e.list.indexOf(a), 1),
                              renderStats(),
                              say(`I bought a ${horseDesc(a)} named ${a.name}.`),
                              void notice(
                                "New horse",
                                `You bought ${a.name}, a ${horseDesc(a)}, for ${usd(a.price)}.`,
                                openHorseMarket,
                                !0,
                              )),
                    ],
                  ],
                });
              }),
          ),
          screen.classList.add("open");
      }
      function horseCard(e, t) {
        const a = (state.horses || [])[e];
        if (!a) return;
        const o = breedOf(a),
          n = a.done && a.done.age === state.age ? a.done : (a.done = { age: state.age }),
          s = (e, t) => () => {
            if (n[e]) return notice("Not again", `You already did that with ${a.name} this year.`, null, !0);
            (n[e] = 1), t();
          },
          r = [];
        o.ride &&
          r.push([
            "Go for a ride",
            s("ride", () => {
              horseAccident(
                a,
                0.02,
                "stepped in a gopher hole on our ride, broke a leg and had to be put down",
              ) ||
                ((a.health = clamp(a.health + 2)),
                eraResult(a.name, horseImg(a), [
                  1,
                  `I went for a long ride on ${a.name}.`,
                  { Happiness: 5, Health: 2 },
                ]));
            }),
          ]),
          r.push([
            "Groom and care for",
            s("groom", () => {
              (a.health = clamp(a.health + rint(5, 10))),
                eraResult(a.name, horseImg(a), [
                  1,
                  `I spent the afternoon grooming ${a.name}.`,
                  { Happiness: 3 },
                ]);
            }),
          ]),
          o.ride &&
            state.age >= 14 &&
            r.push([
              `Enter the county race (${usd(eraCash(2))})`,
              s("race", () => {
                if (state.money < eraCash(2))
                  return notice("Not enough money", "You can't afford the entry fee.", null, !0);
                const e = Math.min(
                    0.8,
                    ((o.speed / 100) * 0.5 * a.health) / 100 + (state.stats.Health > 70 ? 0.05 : 0),
                  ),
                  t = eraCash(rint(20, 80));
                chance(e)
                  ? eraResult("County Race", horseImg(a), [
                      1,
                      `${a.name} won the county race! I took home ${usd(t)}.`,
                      { money: 0, cash: t - eraCash(2), Happiness: 10, Respect: 4 },
                    ])
                  : chance(0.06)
                    ? ((state.money = cents(state.money - eraCash(2))),
                      horseDies(
                        a,
                        "fell at a turn in the county race, broke a leg and had to be put down",
                        !0,
                      ))
                    : eraResult("County Race", horseImg(a), [
                        1,
                        `${a.name} finished ${ordinalN(rint(2, 8))} in the county race.`,
                        { cash: -eraCash(2), Happiness: -2 },
                      ]);
              }),
            ]),
          r.push([
            `Sell (${usd(horseValue(a))})`,
            () =>
              iosConfirm("Confirm", `Sell ${a.name} for ${usd(horseValue(a))}?`, () => {
                const o = horseValue(a);
                state.horses.splice(e, 1),
                  (state.money = cents(state.money + o)),
                  renderStats(),
                  say(`I sold my horse ${a.name} for ${usd(o)}.`),
                  (t || openAssets)();
              }),
            "gray",
          ]),
          jCard({
            tag: "Stable",
            iconSrc: horseImg(a),
            title: a.name,
            close: !0,
            lead: `Your ${horseDesc(a)}.`,
            bars: [
              ["Health", a.health],
              ["Speed", o.speed, "#f4c044"],
            ],
            rows: [
              ["Age", `${a.age} years`],
              ["Value", usd(horseValue(a))],
              ["Upkeep", `${usd(horseUpkeep(a))} a year`],
            ],
            choices: r,
          });
      }
      function horseRows() {
        const e = state.horses || [];
        return e.length
          ? '<div class="sec">Stable</div>' +
              e
                .map(
                  (e, t) =>
                    `<div class="row" data-horse="${t}"><img src="${horseImg(e)}" alt=""><div class="t"><b>${e.name} <em>(${e.age} yrs)</em></b><span>${horseDesc(e)} · worth ${usd(horseValue(e))}</span></div>${DOTS}</div>`,
                )
                .join("")
          : "";
      }
      function horseDies(e, t, a) {
        const o = (state.horses || []).indexOf(e);
        if (o < 0) return !1;
        state.horses.splice(o, 1),
          (state.stats.Happiness = clamp(state.stats.Happiness - rint(6, 14))),
          renderStats(),
          say(`My horse ${e.name} ${t}.`);
        const n = () => notice(`Farewell, ${e.name}`, `Your ${horseDesc(e)} ${e.name} ${t}.`, null, !0);
        return (
          a ? n() : queuePopup(n),
          state.hunt && !hasHorse("ride") && say("I had to carry on the hunt on foot."),
          !0
        );
      }
      const horseAccident = (e, t, a) => !(!e || !chance(t)) && horseDies(e, a, !0),
        HORSE_ILLS = [
          {
            k: "colic",
            name: "Colic",
            w: 5,
            lead: (e) =>
              `${e.name} is rolling on the ground, kicking at their belly and sweating. It's colic, and it can kill a horse in a night.`,
            opts: [
              ["Send for the horse doctor", 3, 0.78],
              ["Walk them through the night", 0, 0.5],
            ],
            die: "died of colic",
          },
          {
            k: "strangles",
            name: "Strangles",
            w: 3,
            lead: (e) =>
              `${e.name} has a fever and swollen glands under the jaw. It looks like strangles, and it spreads.`,
            opts: [
              ["Send for the horse doctor", 3, 0.9],
              ["Keep them apart and nurse them", 0, 0.72],
            ],
            die: "died of strangles",
          },
          {
            k: "lockjaw",
            name: "Lockjaw",
            w: 1,
            lead: (e) =>
              `${e.name} stepped on a rusty nail, and now their jaw is locked stiff. It's lockjaw.`,
            opts: [
              ["Send for the horse doctor", 4, 0.3],
              ["Keep them in a dark, quiet stall", 0, 0.15],
            ],
            die: "died of lockjaw",
          },
          {
            k: "glanders",
            name: "Glanders",
            w: 1,
            lead: (e) =>
              `The horse doctor says ${e.name} has glanders. There is no cure, it can spread to people, and the law says the horse must be destroyed.`,
            opts: [["Hide it and try to nurse them", 0, 0.08]],
            die: "had glanders and died",
            spread: !0,
          },
          {
            k: "founder",
            name: "Founder",
            w: 2,
            old: 12,
            lead: (e) =>
              `${e.name} is standing rocked back on their heels, too sore to walk. The hooves have foundered.`,
            opts: [
              ["Send for the farrier", 3, 0.65],
              ["Rest them in soft straw", 0, 0.4],
            ],
            die: "foundered so badly they had to be put down",
          },
          {
            k: "leg",
            name: "Broken Leg",
            w: 2,
            lead: (e) => `${e.name} stepped in a gopher hole in the pasture and you heard the bone snap.`,
            opts: [["Try to splint it", 2, 0.12]],
            die: "broke a leg and had to be put down",
          },
        ];
      function horseIll(e) {
        const t = HORSE_ILLS.filter((t) => !t.old || e.age > t.old),
          a = eraRoll(t.map((e) => [e.w, e]))[1];
        jCard({
          tag: "Stable",
          iconSrc: horseImg(e),
          title: `${e.name}: ${a.name}`,
          lead: a.lead(e),
          choices: [
            ...a.opts.map(([t, o, n]) => [
              o ? `${t} (${usd(eraCash(o))})` : t,
              () => {
                if (
                  ((t) => {
                    const o = eraCash(t);
                    return (
                      !t ||
                      (state.money < o
                        ? (notice(
                            "Not enough money",
                            `The horse doctor wants ${usd(o)}.`,
                            () => horseIll.again(e, a),
                            !0,
                          ),
                          !1)
                        : ((state.money = cents(state.money - o)), renderStats(), !0))
                    );
                  })(o)
                ) {
                  if (chance(n))
                    return (
                      (e.health = clamp(e.health - rint(10, 25))),
                      say(`My horse ${e.name} pulled through a bout of ${a.name.toLowerCase()}.`),
                      notice(
                        "Pulled through",
                        `${e.name} survived the ${a.name.toLowerCase()}, though it took a lot out of them.`,
                        null,
                        !0,
                      )
                    );
                  if ((horseDies(e, a.die, !0), a.spread)) {
                    const t = state.horses.find((t) => t !== e);
                    t &&
                      chance(0.4) &&
                      (horseDies(t, "caught glanders and had to be destroyed"),
                      (state.respect = clamp((state.respect ?? 40) - 4)));
                  }
                }
              },
            ]),
            [
              "Put them down",
              () =>
                horseDies(
                  e,
                  "glanders" === a.k
                    ? "had glanders and was destroyed"
                    : "was put down after " +
                        ("Broken Leg" === a.name ? "breaking a leg" : `a bout of ${a.name.toLowerCase()}`),
                  !0,
                ),
              "gray",
            ],
          ],
        });
      }
      (horseIll.again = (e, t) => {
        (state.horses || []).includes(e) && horseIll(e);
      }),
        document.getElementById("ageBtn").addEventListener("click", () => {
          if (state.dead || !(state.horses || []).length) return;
          const e = state.horses,
            t = cents(e.reduce((e, t) => e + horseUpkeep(t), 0)),
            a = state.money >= t,
            o = state.farm,
            n = !(!o || !o.barn);
          a
            ? (state.money = cents(state.money - t))
            : say(`I couldn't afford feed and stabling for my horse${e.length > 1 ? "s" : ""}.`);
          let s = !1;
          for (const t of [...e]) {
            if (
              (t.age++,
              (t.hungry = a ? 0 : (t.hungry || 0) + 1),
              (t.health = clamp(t.health - rint(0, 5) - (t.age > 18 ? rint(3, 10) : 0) - (a ? 0 : 20))),
              t.hungry >= 2)
            ) {
              horseDies(t, "starved to death because I couldn't afford to feed them");
              continue;
            }
            if (t.health <= 0) {
              horseDies(t, `died of poor health at the age of ${t.age}`);
              continue;
            }
            if (t.age > 22 && chance(0.12 * (t.age - 22))) {
              horseDies(t, `died of old age at ${t.age}`);
              continue;
            }
            const o = [
              [0.003, "was struck by lightning out in the pasture"],
              ["us" === state.country ? 0.007 : 0.002, "was bitten by a rattlesnake and died"],
              [n ? 0.002 : 0.007, "was dragged down and killed by wolves in the night"],
              [0.006, "ate poisonous weeds in the pasture and died"],
              [0.004, "drowned crossing a flooded river"],
              [0.003, "died in a stable fire"],
              [n ? 0.001 : 0.005, "froze to death in a winter blizzard"],
              [e.length > 1 ? 0.004 : 0, "was kicked by another horse, broke a leg and had to be put down"],
            ].find(([e]) => chance(e));
            if (o) horseDies(t, o[1]);
            else if (chance(0.012)) {
              const e = state.horses.indexOf(t);
              state.horses.splice(e, 1),
                say(`Horse thieves stole my horse ${t.name} in the night.`),
                queuePopup(() =>
                  notice(
                    "Horse stolen!",
                    `Horse thieves broke into the stable and rode off with ${t.name}. You never saw them again.`,
                    null,
                    !0,
                  ),
                );
            } else
              !s &&
                chance(0.07 + (t.age > 15 ? 0.04 : 0) + (a ? 0 : 0.08)) &&
                ((s = !0),
                queuePopup(() => {
                  (state.horses || []).includes(t) && horseIll(t);
                }));
          }
        });
      const OUTLAW_NICKS = [
          "Black Jack",
          "Dutch",
          "The Kid",
          "Two-Gun",
          "Snake-Eye",
          "Rattler",
          "Whiskey",
          "Red",
          "Lefty",
          "Doc",
          "Dead-Eye",
          "Mad Dog",
          "Smiley",
          "Gentleman",
          "Iron",
          "Coyote",
          "Preacher",
          "Lucky",
          "Scar",
          "Long Tom",
          "Big Nose",
          "Cherokee",
          "Curly",
          "Deacon",
        ],
        OUTLAW_CRIMES = [
          ["horse theft", 1, 40],
          ["cattle rustling", 1, 50],
          ["claim jumping", 1, 40],
          ["counterfeiting", 2, 100],
          ["stagecoach robbery", 2, 150],
          ["a jailbreak", 2, 120],
          ["arson", 2, 100],
          ["bank robbery", 3, 300],
          ["train robbery", 3, 400],
          ["murder", 4, 500],
          ["killing a lawman", 5, 1e3],
        ],
        bountyTowns = () =>
          "us" === state.country
            ? [
                "Dodge City",
                "Tombstone",
                "Deadwood",
                "Abilene",
                "El Paso",
                "Cheyenne",
                "Santa Fe",
                "Virginia City",
              ]
            : [
                "the mining camp",
                "the river port",
                "the market town",
                "the mountain pass",
                "the border village",
                "the logging camp",
                "the coal town",
                "the fishing harbor",
              ],
        capTown = (e) => e.replace(/^the /, "The ");
      function newOutlaw() {
        const e = chance(0.9) ? "m" : "f",
          t = rint(19, 55),
          a = [...new Set(Array.from({ length: rint(1, 3) }, () => pickR(OUTLAW_CRIMES)))],
          o = Math.min(5, Math.max(...a.map((e) => e[1])) + (a.length > 2 ? 1 : 0)),
          n = bountyTowns(),
          s = a.reduce((e, t) => e + t[2], 0) * (0.8 + 0.6 * Math.random()),
          r = pickR(n);
        return {
          id: rint(1, 1e9),
          first: uname(e),
          last: ulast(state.country),
          nick: pickR(OUTLAW_NICKS),
          g: e,
          age: t,
          look: randomLook(e, t),
          crimes: a.map((e) => e[0]),
          danger: o,
          reward: 5 * Math.round(s / 5),
          deadOk: chance(o >= 3 ? 0.75 : 0.2),
          seen: r,
          hide: chance(0.35) ? r : pickR(n),
          speed: rint(30, 90),
        };
      }
      const outlawName = (e) => `${e.first} "${e.nick}" ${e.last}`,
        outlawReward = (e) => eraCash(e.reward),
        crimeList = (e) =>
          e.crimes.length > 1
            ? `${e.crimes.slice(0, -1).join(", ")} and ${e.crimes[e.crimes.length - 1]}`
            : e.crimes[0],
        isBountyHunter = () => isOldEra() && state.job && "Bounty Hunter" === state.job.t,
        bestGun = () =>
          (state.guns || [])
            .map(gunOf)
            .filter(Boolean)
            .sort((e, t) => t.acc - e.acc)[0] || { name: "revolver", acc: 62 };
      function bountyBoard() {
        return (
          state.bounties && state.bounties.age === state.age
            ? state.bounties
            : (state.bounties = {
                age: state.age,
                list: Array.from({ length: rint(5, 7) }, newOutlaw).sort((e, t) => t.reward - e.reward),
              })
        ).list;
      }
      function openWantedBoard() {
        play("choice"),
          (sTitle.textContent = "WANTED"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openJobScreen);
        const e = bountyBoard(),
          t = state.hunt;
        sList.innerHTML =
          (t
            ? `<div class="sec">Your Hunt</div><div class="row" data-hunt="1"><canvas class="wb-face" width="250" height="250"></canvas><div class="t"><b>${outlawName(t.o)}</b><span>Day ${t.day + 1} of ${t.days} · in ${t.town}</span></div>${CHEV}</div>`
            : "") +
          `<div class="sec">Wanted Posters · ${state.bountyCount || 0} caught · ${Math.max(0, 4 - (state.bountyYear && state.bountyYear.age === state.age ? state.bountyYear.n : 0))} hunts left this year</div>` +
          e
            .map(
              (e, t) =>
                `<div class="row" data-wo="${t}"><canvas class="wb-face" width="250" height="250"></canvas><div class="t"><b>${outlawName(e)}</b><span>${usd(outlawReward(e))} · ${e.deadOk ? "Dead or alive" : "Alive only"} · ${crimeList(e)}</span></div>${DOTS}</div>`,
            )
            .join("");
        const a = [...sList.querySelectorAll(".wb-face")],
          o = [...(t ? [t.o] : []), ...e];
        a.forEach((e, t) => e.replaceWith(npcFace(o[t].look, o[t].g, o[t].age, "angry", "wb-face"))),
          (sList.scrollTop = 0);
        const n = sList.querySelector("[data-hunt]");
        n &&
          (n.onclick = () => {
            play("choice"), openHuntTrack();
          }),
          sList.querySelectorAll("[data-wo]").forEach(
            (t) =>
              (t.onclick = () => {
                play("choice"), wantedPoster(e[+t.dataset.wo]);
              }),
          ),
          screen.classList.add("open");
      }
      function wantedPoster(e) {
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="wpX" style="left:-14px;top:-14px">${X_RED}</div>\n      <div class="wp"><div class="wp-h">WANTED</div><div class="wp-sub">${e.deadOk ? "DEAD OR ALIVE" : "ALIVE"}</div><div class="wp-pic"></div>\n        <div class="wp-name">${outlawName(e)}</div><div class="wp-crime">For ${crimeList(e)}</div>\n        <div class="wp-rew">${usd(outlawReward(e))} REWARD</div><div class="wp-seen">Last seen near ${e.seen} · Danger ${"★".repeat(e.danger)}${"☆".repeat(5 - e.danger)}</div></div>\n      <button class="jm-apply ev-btn" id="wpGo">${state.hunt ? (state.hunt.o.id === e.id ? "Continue the hunt" : "Already on a hunt") : "Take the bounty"}</button></div>`),
          ev.querySelector(".wp-pic").append(npcFace(e.look, e.g, e.age, "angry", "wp-face")),
          (ev.style.overflow = "visible");
        const t = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("wpX").onclick = () => {
          play("dismiss"), t();
        }),
          (document.getElementById("wpGo").onclick = () => {
            if ((t(), state.hunt && state.hunt.o.id !== e.id))
              return notice("Already hunting", `Finish hunting ${outlawName(state.hunt.o)} first.`, null, !0);
            const a =
              state.bountyYear && state.bountyYear.age === state.age
                ? state.bountyYear
                : (state.bountyYear = { age: state.age, n: 0 });
            if (!state.hunt && a.n >= 4)
              return notice(
                "Enough for one year",
                "Each hunt takes weeks on the trail. You've taken all the bounties you can manage this year. More posters go up next year.",
                null,
                !0,
              );
            if (!state.hunt) {
              a.n++;
              const t = bountyTowns();
              (state.hunt = {
                o: e,
                day: 0,
                days: 8,
                town: e.seen === t[0] ? t[1] : t[0],
                clues: [],
                asked: {},
              }),
                say(`I took the bounty on ${outlawName(e)}, wanted for ${crimeList(e)}.`);
            }
            openHuntTrack();
          }),
          evWrap.classList.add("open");
      }
      function huntDay(e) {
        if ((e.day++, e.day >= e.days)) {
          const t = e.o;
          return (
            (state.hunt = null),
            (state.job.perf = clamp(state.job.perf - 4)),
            say(`The trail of ${outlawName(t)} went cold.`),
            notice(
              "Trail gone cold",
              `You lost the trail of ${outlawName(t)}. Maybe another time.`,
              openWantedBoard,
              !0,
            ),
            !1
          );
        }
        return !0;
      }
      function huntClue(e, t, a) {
        const o = bountyTowns(),
          n = chance(t) ? e.o.hide : pickR(o.filter((t) => t !== e.o.hide)),
          s = pickR([
            `${a} says ${e.o.first} was seen riding toward ${n}.`,
            `${a} heard ${e.o.first} is holed up near ${n}.`,
            `According to ${a.toLowerCase()}, ${e.o.first} has friends in ${n}.`,
          ]);
        return e.clues.unshift(s), e.clues.length > 6 && e.clues.pop(), s;
      }
      function openHuntTrack() {
        const e = state.hunt;
        if (!e) return openWantedBoard();
        (sTitle.textContent = "TRACKING"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openWantedBoard);
        const t = e.o,
          a = (e.asked[e.town] ||= {}),
          o = (e, t, a, o, n) =>
            `<div class="row${n ? " dis" : ""}" data-ht="${e}"><img src="${t}" alt=""><div class="t"><b>${a}</b><span>${o}</span></div>${n ? "" : DOTS}</div>`;
        (sList.innerHTML =
          `<div class="row" data-ht="poster"><canvas class="wb-face" width="250" height="250"></canvas><div class="t"><b>${outlawName(t)}</b><span>${usd(outlawReward(t))} · ${t.deadOk ? "Dead or alive" : "Alive only"} · day ${e.day + 1} of ${e.days}</span></div>${DOTS}</div><div class="sec">You're in ${e.town}</div>` +
          o(
            "saloon",
            "jobev/beer-mugs.png",
            "Ask at the saloon",
            `Buy a drink for ${usd(eraCash(0.1))} and ask around`,
            a.saloon,
          ) +
          o(
            "sheriff",
            "jobev/policeman.png",
            "Question the sheriff",
            "The law usually knows something",
            a.sheriff,
          ) +
          o(
            "livery",
            "pets/horse3c.png",
            "Check the livery stable",
            "Stablehands remember every rider",
            a.livery,
          ) +
          o(
            "informant",
            "jobev/money-bag.png",
            "Pay an informant",
            `${usd(eraCash(5))} for reliable word`,
            a.informant,
          ) +
          o("search", "jobev/magnifier.png", `Search ${e.town}`, `Look for ${t.first}'s hideout here`) +
          o(
            "ride",
            state.horses && state.horses.length ? horseImg(state.horses[0]) : "jobev/boot.png",
            "Ride to another town",
            state.horses && state.horses.length
              ? `Takes a day on ${state.horses[0].name}`
              : "No horse, so walking takes two days",
          ) +
          o("quit", "jobev/scroll.png", "Give up the hunt", "Let someone else collect this bounty") +
          (e.clues.length
            ? '<div class="sec">Clues</div>' +
              e.clues
                .map(
                  (e) =>
                    `<div class="row"><img src="jobev/notebook.png" alt=""><div class="t"><span>${e}</span></div></div>`,
                )
                .join("")
            : "")),
          sList.querySelector(".wb-face").replaceWith(npcFace(t.look, t.g, t.age, "angry", "wb-face")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-ht]").forEach(
            (e) =>
              (e.onclick = () => {
                e.classList.contains("dis") || (play("choice"), huntAction(e.dataset.ht));
              }),
          ),
          screen.classList.add("open");
      }
      function huntAction(e) {
        const t = state.hunt,
          a = t.o,
          o = (t.asked[t.town] ||= {});
        if ("poster" === e) return wantedPoster(a);
        if ("quit" === e)
          return iosConfirm("Give up", `Give up hunting ${outlawName(a)}?`, () => {
            (state.hunt = null), say(`I gave up hunting ${outlawName(a)}.`), openWantedBoard();
          });
        if ("ride" === e)
          return jCard({
            tag: "Tracking",
            iconSrc: "jobev/map.png",
            title: "Ride to...",
            close: !0,
            lead: "Where will you ride?",
            choices: bountyTowns()
              .filter((e) => e !== t.town)
              .map((e) => [
                capTown(e),
                () => {
                  const o = state.horses && state.horses.length ? 1 : 2;
                  for (let e = 0; e < o; e++) if (!huntDay(t)) return;
                  if (
                    ((t.town = e),
                    state.horses && state.horses.length && play("gallop"),
                    chance(0.08 + 0.02 * a.danger))
                  ) {
                    const t = (state.horses || []).find((e) => breedOf(e).ride);
                    return (
                      t &&
                        chance(0.25) &&
                        horseDies(t, `was shot out from under me when ${a.first}'s gang ambushed me`),
                      bountyHurt(
                        `${a.first}'s gang ambushed me on the road to ${e}.`,
                        rint(8, 20),
                        openHuntTrack,
                      )
                    );
                  }
                  openHuntTrack();
                },
              ]),
          });
        if ("search" === e) {
          if (!huntDay(t)) return;
          return t.town === a.hide
            ? confrontOutlaw(t)
            : (chance(0.25) &&
                ((a.hide = pickR(bountyTowns())),
                t.clues.unshift(`Word is ${a.first} heard someone was asking questions and moved on.`)),
              notice(
                "Nothing here",
                `You searched ${t.town} from end to end, but there was no sign of ${a.first}.`,
                openHuntTrack,
                !0,
              ));
        }
        const n = {
          saloon: [0.55, "A drunk at the saloon", eraCash(0.1)],
          sheriff: [0.75, "The sheriff", 0],
          livery: [0.6, "The stablehand", 0],
          informant: [0.92, "Your informant", eraCash(5)],
        }[e];
        if (n[2] && state.money < n[2]) return notice("Not enough money", `You need ${usd(n[2])}.`, null, !0);
        if (!huntDay(t)) return;
        if (
          ((o[e] = 1),
          n[2] && (state.money = cents(state.money - n[2])),
          renderStats(),
          "saloon" === e && chance(0.12))
        )
          return bountyHurt(
            `A friend of ${a.first} started a fight with me at the saloon.`,
            rint(5, 14),
            openHuntTrack,
          );
        const s = chance("sheriff" === e ? 0.85 : 0.9)
          ? huntClue(t, n[0], n[1])
          : `${n[1]} didn't know anything useful.`;
        notice(capTown(t.town), s, openHuntTrack, !0);
      }
      function bountyHurt(e, t, a) {
        if (
          ((state.stats.Health = clamp(state.stats.Health - t)),
          renderStats(),
          say(e),
          hurt(),
          state.stats.Health <= 0)
        )
          return (
            (state.hunt = null),
            screen.classList.remove("open"),
            setTimeout(() => die("being shot while hunting an outlaw"), 400)
          );
        notice("Wounded", e, a, !0);
      }
      function confrontOutlaw(e) {
        const t = e.o,
          a = bestGun(),
          o = state.huntSkill || 0;
        screen.classList.remove("open"), play("gunCock");
        const n = () => {
          play("gunshot"),
            state.ammo && state.ammo.rifle && (state.ammo.rifle = Math.max(0, state.ammo.rifle - rint(1, 3)));
          const n = Math.max(
            0.1,
            Math.min(
              0.92,
              0.45 +
                0.003 * o +
                0.006 * (a.acc - 60) +
                (state.stats.Health > 60 ? 0.05 : 0) -
                0.06 * t.danger,
            ),
          );
          return chance(n)
            ? t.deadOk
              ? bountyWin(e, !0)
              : chance(0.5)
                ? bountyWin(e, !1, !0)
                : bountyKilledAliveOnly(e)
            : chance(0.4)
              ? outlawChase(
                  e,
                  `${t.first} winged you and bolted for ${"f" === t.g ? "her" : "his"} horse!`,
                  rint(5, 12),
                )
              : (bountyHurt(`${outlawName(t)} shot me in a gunfight.`, rint(15, 25) + 6 * t.danger, () => {
                  (state.hunt = null), openOccupation();
                }),
                void say(`${outlawName(t)} got away after shooting me.`));
        };
        jCard({
          tag: "Showdown",
          iconSrc: "jobev/gun.png",
          title: `${t.first} Found!`,
          person: { name: outlawName(t), look: t.look, g: t.g, age: t.age, mood: "angry" },
          lead: `You find ${outlawName(t)} hiding out in ${e.town}. ${"f" === t.g ? "She" : "He"} spots you and ${"f" === t.g ? "her" : "his"} hand drifts toward ${"f" === t.g ? "her" : "his"} gun.<br><br>What will you do?`,
          choices: [
            ["Draw your gun", n],
            [
              "Order a surrender",
              () =>
                chance(Math.max(0.05, 0.25 + (state.respect ?? 40) / 200 - 0.06 * t.danger))
                  ? bountyWin(e, !1)
                  : chance(0.5)
                    ? n()
                    : outlawChase(e, `${t.first} laughed and ran for ${"f" === t.g ? "her" : "his"} horse!`),
            ],
            [
              "Sneak up and tie them up",
              () =>
                chance(Math.max(0.08, 0.42 + 0.002 * o - 0.06 * t.danger))
                  ? bountyWin(e, !1)
                  : outlawChase(e, `${t.first} heard you coming and fled on horseback!`),
            ],
          ],
        });
      }
      function bountyKilledAliveOnly(e) {
        const t = e.o;
        (state.hunt = null),
          (state.respect = clamp((state.respect ?? 40) - 6)),
          (state.job.perf = clamp(state.job.perf - 6)),
          removeOutlaw(t),
          say(`I killed ${outlawName(t)}, but the bounty was alive only, so I got nothing.`),
          notice(
            "No reward",
            `${outlawName(t)} is dead, but the poster said <b>alive</b>. The sheriff refused to pay.`,
            null,
            !0,
          );
      }
      function removeOutlaw(e) {
        state.bounties && (state.bounties.list = state.bounties.list.filter((t) => t.id !== e.id));
      }
      function bountyWin(e, t, a) {
        const o = e.o,
          n = outlawReward(o);
        (state.hunt = null),
          removeOutlaw(o),
          (state.money = cents(state.money + n)),
          (state.bountyCount = (state.bountyCount || 0) + 1),
          (state.huntSkill = Math.min(100, (state.huntSkill || 0) + 3)),
          (state.respect = clamp((state.respect ?? 40) + 2 + o.danger)),
          (state.job.perf = clamp(state.job.perf + 6 + 2 * o.danger)),
          (state.stats.Happiness = clamp(state.stats.Happiness + 8)),
          renderStats(),
          play("casinoWin");
        const s = t
          ? `shot ${outlawName(o)} dead`
          : a
            ? `wounded and captured ${outlawName(o)}`
            : `captured ${outlawName(o)} alive`;
        say(`I ${s} and collected the ${usd(n)} bounty.`),
          notice("Bounty Collected", `You ${s}.<br><br>The sheriff paid you the ${usd(n)} reward.`, null, !0);
      }
      function outlawChase(e, t, a = 0) {
        const o = e.o;
        if (
          (play("gunshot"),
          a &&
            ((state.stats.Health = clamp(state.stats.Health - a)),
            renderStats(),
            hurt(),
            state.stats.Health <= 0))
        )
          return (state.hunt = null), setTimeout(() => die("being shot by an outlaw"), 400);
        const n = (state.horses || [])
          .filter((e) => breedOf(e).ride)
          .sort((e, t) => breedOf(t).speed - breedOf(e).speed)[0];
        if (!n)
          return (
            say(`${outlawName(o)} escaped on horseback while I was on foot.`),
            (o.hide = pickR(bountyTowns())),
            notice(
              "Escaped",
              `${t}<br><br>You have no riding horse, so ${o.first} got away.`,
              openHuntTrack,
              !0,
            )
          );
        const s = { gap: 40, stamina: Math.round(60 + 0.4 * n.health), round: 0 },
          r = breedOf(n).speed,
          i = `pets/horse${rint(1, 5)}${pickR(["a", "b", "c", "d"])}.png`,
          l = (e) => {
            ev.classList.remove("death18"),
              (ev.innerHTML = `<div class="jcw"><div class="jm-tag" style="margin-top:12px">Chase</div><h4><img src="${horseImg(n)}" alt=""><span>Chase!</span></h4>\n        <div class="lead">${e}</div>\n        <div class="ch-track"><img class="ch-him" src="${i}" style="left:${Math.min(80, 30 + 0.55 * s.gap)}%"><img class="ch-me" src="${horseImg(n)}" style="left:${Math.max(0, 22 - 0.2 * s.gap)}%"></div>\n        <div class="ev-bars pct"><b>Gap</b><i><u style="width:${Math.max(2, s.gap)}%;background:#c0632b"></u></i><em>${Math.round(s.gap)}</em><b>${n.name}'s wind</b><i><u style="width:${Math.max(2, s.stamina)}%"></u></i><em>${Math.round(s.stamina)}</em></div>\n        <button class="jm-apply ev-btn" data-ch="spur">Spur ${n.name} on</button><button class="jm-apply ev-btn" data-ch="cut">Cut through the brush</button><button class="jm-apply ev-btn" data-ch="shoot">Fire at ${o.first}</button></div>`),
              ev.querySelectorAll("[data-ch]").forEach((e) => (e.onclick = () => c(e.dataset.ch))),
              evWrap.classList.add("open");
          },
          c = (t) => {
            s.round++, play("gallop");
            let a = "";
            if ("spur" === t) {
              if (s.stamina <= 5 && chance(0.3))
                return (
                  evWrap.classList.remove("open"),
                  (o.hide = pickR(bountyTowns())),
                  void horseDies(n, "was ridden past exhaustion in a chase and collapsed dead under me", !0)
                );
              (s.gap -= 0.32 * r * (s.stamina > 20 ? 1 : 0.4) * (0.7 + 0.6 * Math.random())),
                (s.stamina -= rint(14, 22)),
                (a = `You spur ${n.name} on and close in.`);
            }
            if ("cut" === t)
              if (chance(0.55)) (s.gap -= 28), (a = "You cut through the brush and gain ground!");
              else {
                const e = rint(10, 22);
                if (
                  ((state.stats.Health = clamp(state.stats.Health - e)),
                  renderStats(),
                  hurt(),
                  (s.gap += 15),
                  (a = `${n.name} stumbled in the brush and you were thrown!`),
                  chance(0.2) &&
                    (evWrap.classList.remove("open"),
                    (o.hide = pickR(bountyTowns())),
                    state.stats.Health > 0))
                )
                  return void horseDies(
                    n,
                    "broke a leg in the brush during a chase and had to be put down",
                    !0,
                  );
                if (state.stats.Health <= 0)
                  return (
                    evWrap.classList.remove("open"),
                    (state.hunt = null),
                    setTimeout(() => die("a fall from a horse during a chase"), 400)
                  );
              }
            if ("shoot" === t) {
              play("gunshot");
              const t = Math.max(0.08, 0.22 + 0.006 * (bestGun().acc - 60) - 0.003 * s.gap);
              if (chance(t))
                return (
                  evWrap.classList.remove("open"),
                  say(`I shot ${outlawName(o)} off ${"f" === o.g ? "her" : "his"} horse during a chase.`),
                  o.deadOk || chance(0.5) ? bountyWin(e, o.deadOk, !o.deadOk) : bountyKilledAliveOnly(e)
                );
              (s.gap -= 4), (a = "Your shot went wide!");
            }
            if (
              ((s.gap += 0.22 * o.speed * (0.6 + 0.8 * Math.random())),
              (s.stamina = Math.max(0, s.stamina + 4)),
              o.danger >= 3 && chance(0.15))
            ) {
              const e = rint(6, 15);
              if (
                ((state.stats.Health = clamp(state.stats.Health - e)),
                renderStats(),
                hurt(),
                play("gunshot"),
                (a += ` ${o.first} fires back and grazes you!`),
                state.stats.Health <= 0)
              )
                return (
                  evWrap.classList.remove("open"),
                  (state.hunt = null),
                  setTimeout(() => die(`being shot by ${outlawName(o)}`), 400)
                );
            }
            return s.gap <= 0
              ? (evWrap.classList.remove("open"),
                play("horseNeigh"),
                say(`I ran down ${outlawName(o)} on horseback.`),
                bountyWin(e, !1))
              : s.gap >= 100 || s.round >= 7
                ? (evWrap.classList.remove("open"),
                  (o.hide = pickR(bountyTowns())),
                  e.clues.unshift(`${o.first} escaped your chase and fled to parts unknown.`),
                  say(`${outlawName(o)} outran me on horseback.`),
                  notice(
                    "Got away",
                    `${o.first} outran you and disappeared over the hills.`,
                    openHuntTrack,
                    !0,
                  ))
                : void l(a);
          };
        evWrap.classList.remove("open"),
          setTimeout(() => l(`${t} You leap onto ${n.name} and give chase!`), 60);
      }
      const eraFx = (e) => {
          for (const [t, a] of Object.entries(e || {}))
            "money" === t
              ? (state.money = cents(Math.max(0, state.money + eraCash(a))))
              : "cash" === t
                ? (state.money = cents(Math.max(0, state.money + a)))
                : "Respect" === t
                  ? (state.respect = clamp((state.respect ?? 40) + a))
                  : t in state.stats && (state.stats[t] = clamp(state.stats[t] + a));
          renderStats();
        },
        eraRoll = (e) => {
          let t = Math.random() * e.reduce((e, t) => e + t[0], 0);
          for (const a of e) if ((t -= a[0]) < 0) return a;
          return e[0];
        },
        eraResult = (e, t, [, a, o, n]) => {
          screen.classList.remove("open"), eraFx(o), say(a), n && n(), notice(e, a, null, !0);
        },
        ERA_ACTS = [
          {
            k: "market",
            t: "Visit the Market",
            s: "Buy goods, food, and necessities",
            ico: "emoji/1f9fa.png",
            age: 6,
            go: openMarket,
          },
          {
            k: "horses",
            t: "Visit the Horse Market",
            s: "Buy, ride, race and care for horses",
            ico: "pets/horse3c.png",
            age: 10,
            go: () => openHorseMarket(),
          },
          {
            k: "church",
            t: "Attend Church",
            s: "Pray, seek guidance, improve respect",
            ico: "emoji/26ea.png",
            age: 4,
            lead: "The church bells ring across the village. How will you spend the service?",
            ch: [
              [
                "Pray quietly",
                [[1, "I prayed quietly at church and felt at peace.", { Happiness: 5, Respect: 3 }]],
              ],
              [
                "Sing the hymns",
                [
                  [
                    3,
                    "I sang the hymns at church and the congregation smiled at me.",
                    { Happiness: 6, Respect: 4 },
                  ],
                  [1, "I sang the hymns so badly that the vicar winced.", { Happiness: -2 }],
                ],
              ],
              [
                "Confess my sins",
                [[1, "I confessed my sins to the priest and felt lighter.", { Happiness: 8, Respect: 2 }]],
              ],
              [
                "Gossip in the pews",
                [
                  [1, "I whispered gossip in the pews during the sermon.", { Happiness: 4 }],
                  [
                    1,
                    "I was caught gossiping in church and scolded in front of everyone.",
                    { Happiness: -6, Respect: -5 },
                  ],
                ],
              ],
            ],
          },
          {
            k: "ride",
            t: "Go Horseback Riding",
            s: "Ride for leisure or skill",
            ico: "pets/horse1c.png",
            age: 8,
            needHorse: "ride",
            lead: "The stable boy saddles a horse for you. How will you ride?",
            ch: [
              [
                "Take a gentle ride",
                [[1, "I took a gentle ride through the countryside.", { Happiness: 5, Health: 2 }]],
              ],
              [
                "Gallop across the fields",
                [
                  [3, "I galloped across the fields with the wind in my hair!", { Happiness: 9, Health: 3 }],
                  [
                    1,
                    "I was thrown from my horse while galloping and hurt my back.",
                    { Happiness: -6, Health: -12 },
                  ],
                ],
              ],
              [
                "Practice jumping fences",
                [
                  [
                    2,
                    "I practiced jumping fences on horseback and got much better at it.",
                    { Happiness: 5, Smarts: 2 },
                  ],
                  [1, "My horse refused a fence and I tumbled into the mud.", { Happiness: -3, Looks: -2 }],
                ],
              ],
            ],
          },
          {
            k: "court",
            t: "Court Someone",
            s: "Pursue a romantic relationship",
            ico: "emoji/2764-fe0f.png",
            age: 16,
            go: () => eraCourt(),
          },
          {
            k: "paper",
            t: "Read the Newspaper",
            s: "Stay informed about local and world events",
            ico: "emoji/1f4f0.png",
            age: 8,
            lead: () =>
              `The paper boy is shouting "${pickR(["Railway to reach the county by spring!", "Cholera outbreak in the city!", "Grain prices fall again!", "New steamship crosses the ocean in record time!", "Bank robbers still at large!", "Factory workers strike for better pay!", "Telegraph line opens to the capital!"])}" A copy costs ${usd(eraCash(0.02))}.`,
            ch: [
              [
                "Read the front page",
                [
                  [
                    1,
                    "I read the front page of the newspaper and learned about the world.",
                    { Smarts: 3, money: -0.02 },
                  ],
                ],
              ],
              [
                "Read the society pages",
                [
                  [
                    1,
                    "I read the society pages and laughed at the scandals.",
                    { Happiness: 3, Smarts: 1, money: -0.02 },
                  ],
                ],
              ],
              [
                "Read the classifieds",
                [
                  [
                    1,
                    "I read the classifieds and saw a few jobs I might apply for.",
                    { Smarts: 2, money: -0.02 },
                  ],
                ],
              ],
            ],
          },
          {
            k: "extra",
            t: "Work Extra Hours",
            s: "Earn more money",
            ico: "emoji/1f528.png",
            age: 8,
            go: () => eraExtra(),
          },
          {
            k: "tavern",
            t: "Visit a Tavern",
            s: "Drink, socialize, and meet people near or far",
            ico: "emoji/1f37a.png",
            age: 16,
            go: () => openTaverns(),
          },
          {
            k: "timber",
            t: "Woodcutting",
            s: "Fell trees and sell the timber",
            ico: "timber/axe-felling.png",
            age: 12,
            go: () => openTimber(),
          },
          {
            k: "farm",
            t: "Farm",
            s: "Buy land, plant crops and raise livestock",
            ico: "jobev/wheat.png",
            age: 16,
            go: () => openFarm(),
          },
          {
            k: "biz",
            t: "Business & Industry",
            s: "Start a company, hire workers and build a fortune",
            ico: "freelife/apple/1f4bc.png",
            age: 18,
            go: () => openBusiness(),
          },
          {
            k: "invent",
            t: "Inventing",
            s: "Tinker in your workshop and patent your inventions",
            ico: "freelife/apple/1f9ea.png",
            age: 12,
            go: () => openInventing(),
          },
          {
            k: "mine",
            t: "Mining & Prospecting",
            s: "Find caves, dig ore, and sell what you find",
            ico: "mining/pick1.png",
            age: 12,
            go: () => openMining(),
          },
          {
            k: "hunt",
            t: "Hunting & Fishing",
            s: "Hunt game, fish, and sell what you catch",
            ico: "2018/emoji/1f98c.png",
            age: 6,
            go: () => openHunting(),
          },
          {
            k: "sew",
            t: "Sew",
            s: "Make or repair clothing",
            ico: "emoji/1f9f5.png",
            age: 8,
            lead: "You fetch your needle and thread. What will you sew?",
            ch: [
              [
                "Mend my clothes",
                [[1, "I mended the holes in my clothes. I look much tidier.", { Looks: 3, Happiness: 2 }]],
              ],
              [
                "Sew something to sell",
                [
                  [2, "I sewed a shirt and sold it at the market.", { money: 0.75, Happiness: 2 }],
                  [1, "I sewed a shirt but nobody wanted to buy it.", { Happiness: -2 }],
                ],
              ],
              [
                "Embroider a sampler",
                [[1, "I embroidered a pretty sampler to hang on the wall.", { Happiness: 4, Smarts: 1 }]],
              ],
            ],
          },
          {
            k: "fair",
            t: "Attend a Town Fair",
            s: "Enjoy food, games, and entertainment",
            ico: "freelife/apple/1f3aa.png",
            age: 4,
            lead: () => `The town fair has come to the village! Entry costs ${usd(eraCash(0.1))}.`,
            ch: [
              [
                "Ride the carousel",
                [[1, "I rode the carousel at the town fair.", { Happiness: 6, money: -0.1 }]],
              ],
              [
                "Enter the pie contest",
                [
                  [1, "I won the pie contest at the town fair!", { Happiness: 10, Respect: 4, money: 2 }],
                  [
                    3,
                    "I entered the pie contest at the town fair but didn't place.",
                    { Happiness: 2, money: -0.1 },
                  ],
                ],
              ],
              [
                "Watch the strongman",
                [
                  [
                    1,
                    "I watched the strongman bend an iron bar at the town fair.",
                    { Happiness: 4, money: -0.1 },
                  ],
                ],
              ],
              [
                "Visit the fortune teller",
                [
                  [
                    1,
                    "The fortune teller at the fair said I will cross the ocean one day.",
                    { Happiness: 3, money: -0.1 },
                  ],
                  [
                    1,
                    "The fortune teller at the fair said great riches are in my future.",
                    { Happiness: 5, money: -0.1 },
                  ],
                  [
                    1,
                    "The fortune teller at the fair warned me of a dark stranger.",
                    { Happiness: -2, money: -0.1 },
                  ],
                ],
              ],
            ],
          },
          {
            k: "letter",
            t: "Write a Letter",
            s: "Keep in touch with family and friends",
            ico: "freelife/apple/2709-fe0f.png",
            age: 7,
            go: () => eraLetter(),
          },
          {
            k: "society",
            t: "Join a Society",
            s: "Accumulate knowledge or status",
            ico: "emoji/1f3a9.png",
            age: 18,
            go: () => eraSociety(),
          },
          {
            k: "music",
            t: "Play an Instrument",
            s: "Practice a musical instrument",
            ico: "emoji/1f3bb.png",
            age: 6,
            lead: "You pick up an instrument. What will you play?",
            ch: [
              ["Practice the piano", [[1, "I practiced the piano for hours.", { Happiness: 4, Smarts: 3 }]]],
              [
                "Play the violin",
                [
                  [2, "I played the violin beautifully.", { Happiness: 5, Smarts: 2 }],
                  [1, "I played the violin so badly the neighbors complained.", { Happiness: -2 }],
                ],
              ],
              [
                "Fiddle at the tavern for coins",
                [
                  [
                    2,
                    "I fiddled at the tavern and people threw coins in my hat.",
                    { Happiness: 4, money: 0.25 },
                  ],
                  [1, "I fiddled at the tavern but nobody paid me a penny.", { Happiness: -2 }],
                ],
              ],
            ],
          },
          {
            k: "volunteer",
            t: "Volunteer",
            s: "Help in your community",
            ico: "emoji/1f91d.png",
            age: 10,
            lead: "The parish is always looking for helping hands. Where will you help?",
            ch: [
              [
                "Help at the orphanage",
                [[1, "I helped look after the children at the orphanage.", { Happiness: 6, Respect: 5 }]],
              ],
              [
                "Feed the poor",
                [[1, "I handed out bread and soup to the poor.", { Happiness: 5, Respect: 5 }]],
              ],
              [
                "Nurse the sick",
                [
                  [5, "I helped nurse the sick at the infirmary.", { Happiness: 6, Smarts: 1, Respect: 6 }],
                  [1, "I helped nurse the sick and caught a fever myself.", { Happiness: -4, Health: -10 }],
                ],
              ],
            ],
          },
        ];
      function eraAct(e) {
        const t = (state.eraDone ||= {});
        return e.needHorse && !hasHorse(e.needHorse)
          ? notice("No horse", "You need a riding horse for that. Buy one at the horse market.", null, !0)
          : ("church" === e.k && play("churchBell"),
            e.go
              ? e.go()
              : t[e.k] === state.age
                ? notice("Not again", "You already did that this year.", null, !0)
                : void jCard({
                    tag: "Activity",
                    iconSrc: e.ico,
                    title: e.t,
                    lead: "function" == typeof e.lead ? e.lead() : e.lead,
                    close: !0,
                    choices: e.ch.map(([a, o]) => [
                      a,
                      () => {
                        if (((t[e.k] = state.age), "ride" === e.k && /Gallop|jumping/.test(a))) {
                          const e = (state.horses || []).find((e) => breedOf(e).ride);
                          if (
                            horseAccident(
                              e,
                              0.03,
                              /jumping/.test(a)
                                ? "caught a hoof on a fence, fell and broke a leg, and had to be put down"
                                : "stepped in a gopher hole at a full gallop, broke a leg and had to be put down",
                            )
                          )
                            return;
                        }
                        eraResult(e.t, e.ico, eraRoll(o));
                      },
                    ]),
                  }));
      }
      const TAVERNS = () =>
          ("us" === state.country
            ? [
                ["fraunces", "Fraunces Tavern", "New York", 1800, "city", null],
                ["absinthe", "The Old Absinthe House", "New Orleans", 1807, "city", null],
                ["planters", "The Planter's House", "St. Louis", 1817, "city", null],
                ["eldorado", "The El Dorado", "San Francisco", 1849, "mining", "ca"],
                ["bucket", "The Bucket of Blood", "Virginia City", 1860, "mining", "nv"],
                ["alamo", "The Alamo Saloon", "Abilene", 1867, "west", null],
                ["longbranch", "The Long Branch Saloon", "Dodge City", 1874, "west", null],
                ["gem", "The Gem Saloon", "Deadwood", 1876, "mining", "sd"],
                ["silverdollar", "The Silver Dollar Saloon", "Leadville", 1879, "mining", "co"],
                ["crystal", "The Crystal Palace", "Tombstone", 1879, "west", null],
              ]
            : [
                ["george", "The George Inn", "London", 1800, "city", null],
                ["brazen", "The Brazen Head", "Dublin", 1800, "city", null],
                ["sheep", "The Sheep Heid Inn", "Edinburgh", 1800, "city", null],
                ["adelphi", "The Adelphi", "Liverpool", 1826, "city", null],
                ["miners", "The Miners Arms", "Merthyr Tydfil", 1800, "mining", "wal"],
                ["star", "The Star Inn", "St Just, Cornwall", 1800, "mining", "cor"],
                ["bell", "The Old Bell", "Derby", 1800, "mining", "der"],
              ]
          )
            .filter((e) => yearNow() >= e[3])
            .map(([e, t, a, , o, n]) => ({ id: e, name: t, town: a, kind: o, reg: n })),
        tavernFare = (e) =>
          "home" === e.id
            ? 0
            : hasHorse("ride")
              ? 0.4
              : "city" === e.kind
                ? 1
                : "us" === state.country
                  ? 3
                  : 1.5;
