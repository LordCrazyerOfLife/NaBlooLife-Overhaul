      function openTaverns() {
        (sTitle.textContent = "TAVERNS"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const e = (state.eraDone ||= {}),
          t = [
            {
              id: "home",
              name: "us" === state.country ? "The Village Saloon" : "The Village Tavern",
              town: "Just down the road",
              kind: "home",
            },
            ...TAVERNS().filter((e) => e.town !== state.city),
          ];
        (sList.innerHTML =
          `<div class="sec">${hasHorse("ride") ? "Riding your own horse" : "By foot or stagecoach"}</div>` +
          t
            .map((t) => {
              const a = e[`tav_${t.id}`] === state.age,
                o = tavernFare(t);
              return `<div class="row${a ? " dis" : ""}" data-tav="${t.id}"><img src="emoji/1f37a.png" alt=""><div class="t"><b>${t.name}</b><span>${t.town}${"home" === t.id ? "" : " · " + (a ? "visited this year" : `trip costs ${usd(eraCash(o))}`)}${"home" === t.id && a ? " · visited this year" : ""}</span></div>${a ? "" : DOTS}</div>`;
            })
            .join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-tav]").forEach(
            (e) =>
              (e.onclick = () => {
                e.classList.contains("dis") ||
                  (play("choice"), visitTavern(t.find((t) => t.id === e.dataset.tav)));
              }),
          ),
          screen.classList.add("open");
      }
      function visitTavern(e) {
        const t = (state.eraDone ||= {}),
          a = tavernFare(e),
          o = "home" === e.id ? "the tavern" : e.name;
        if (a && state.money < eraCash(a) + eraCash(0.05))
          return notice(
            "Not enough money",
            `The trip to ${e.town} costs ${usd(eraCash(a))}, plus money for drinks.`,
            null,
            !0,
          );
        (t[`tav_${e.id}`] = state.age),
          a &&
            (eraFx({ money: -a }),
            hasHorse("ride") && play("gallop"),
            say(`I ${hasHorse("ride") ? "rode" : "took the stagecoach"} to ${e.town} to visit ${e.name}.`)),
          play("tavern");
        const n = e.reg && MINE_REGIONS().find((t) => t.k === e.reg),
          s = "west" === e.kind || ("mining" === e.kind && "us" === state.country),
          r = [
            [
              "Have a pint",
              [[1, `I had a pint of ale at ${o}.`, { Happiness: 5, Health: -1, money: -0.05 }]],
            ],
            [
              "Buy a round for everyone",
              [
                [
                  1,
                  `I bought a round for everyone at ${o}. They cheered my name!`,
                  { Happiness: 8, Respect: 3, money: "city" === e.kind ? -0.8 : -0.5 },
                ],
              ],
            ],
            [
              s ? "Play faro" : "Play cards",
              [
                [1, `I won a game of ${s ? "faro" : "cards"} at ${o}.`, { Happiness: 5, money: s ? 1 : 0.5 }],
                [
                  s ? 2 : 1,
                  `I lost a game of ${s ? "faro" : "cards"} at ${o}.`,
                  { Happiness: -3, money: s ? -1 : -0.5 },
                ],
              ],
            ],
            [
              "Start a brawl",
              [
                [1, `I started a brawl at ${o} and won!`, { Happiness: 6, Health: -3, Respect: -2 }],
                [
                  1,
                  `I started a brawl at ${o} and got knocked out cold.`,
                  { Happiness: -6, Health: -12, Respect: -6 },
                ],
              ],
            ],
          ],
          i = {
            home: "The tavern is warm, loud and smells of ale. What will you do?",
            city: `${e.name} in ${e.town} is packed with merchants, sailors and gentlemen. What will you do?`,
            west: `Spurs jingle and a piano plays as you push through the swinging doors of ${e.name}. What will you do?`,
            mining: `${e.name} in ${e.town} is full of dusty miners swapping stories about rich strikes. What will you do?`,
          }[e.kind];
        jCard({
          tag: "home" === e.id ? "Tavern" : e.town,
          iconSrc: "emoji/1f37a.png",
          title: e.name,
          lead: i,
          close: !0,
          choices: [
            ...r.map(([t, a]) => [
              t,
              () => {
                /pint|round/.test(t) && drankAlcohol(/round/.test(t) ? 2 : 1),
                  eraResult(e.name, "emoji/1f37a.png", eraRoll(a));
              },
            ]),
            ...(n
              ? [
                  [
                    "Buy a miner a drink for a tip",
                    () => {
                      const t = mineSt();
                      if (!chance(0.45) || t.caves.length >= 6)
                        return eraResult(e.name, "emoji/1f37a.png", [
                          1,
                          `I bought an old miner a drink at ${o}, but his stories didn't lead anywhere.`,
                          { Happiness: 2, money: -0.1 },
                        ]);
                      const a = newCave(n);
                      t.caves.push(a),
                        eraResult(e.name, "emoji/1f37a.png", [
                          1,
                          `I bought an old miner a drink at ${o} and he told me where to find ${a.name} in the ${n.name}. I marked it on my map.`,
                          { Happiness: 4, money: -0.1 },
                        ]);
                    },
                  ],
                ]
              : []),
          ],
        });
      }
      function eraExtra() {
        const e = state.job,
          t = (state.eraDone ||= {});
        if (!e) return notice("No job", "You need a job before you can work extra hours.", null, !0);
        if (t.extra === state.age)
          return notice("Not again", "You already worked extra hours this year.", null, !0);
        const a = cents(Math.max(0.01, 0.06 * e.pay)),
          o = cents(Math.max(0.02, 0.15 * e.pay));
        jCard({
          tag: "Activity",
          iconSrc: "emoji/1f528.png",
          title: "Work Extra Hours",
          lead: `Your employer at ${e.emp} could use extra hands. How hard will you work?`,
          close: !0,
          choices: [
            [
              "Stay a few extra hours",
              () => {
                (t.extra = state.age),
                  eraResult("Work Extra Hours", "", [
                    1,
                    `I worked a few extra hours as ${/^[aeiou]/i.test(e.t) ? "an" : "a"} ${e.t.toLowerCase()} and earned ${usd(a)}.`,
                    { cash: a, Health: -2, Respect: 1 },
                  ]);
              },
            ],
            [
              "Work through the night",
              () => {
                (t.extra = state.age),
                  eraResult("Work Extra Hours", "", [
                    1,
                    `I worked through the night and earned ${usd(o)}. I'm exhausted.`,
                    { cash: o, Health: -6, Happiness: -3 },
                  ]);
              },
            ],
          ],
        });
      }
      function eraLetter() {
        const e = (state.eraDone ||= {});
        if (e.letter === state.age)
          return notice("Not again", "You already wrote a letter this year.", null, !0);
        const t = [
          ...state.parents.filter((e) => !e.dead).map((e) => [e, `${e.first} (${e.role})`]),
          ...(state.lovers || []).filter((e) => !e.dead).map((e) => [e, `${e.first} (${loverTitle(e)})`]),
          ...(state.friends || [])
            .filter((e) => !e.dead && e.first)
            .slice(0, 3)
            .map((e) => [e, `${e.first} ${e.last || ""}`.trim()]),
        ].slice(0, 5);
        if (!t.length) return notice("Nobody to write to", "You have no one to write a letter to.", null, !0);
        jCard({
          tag: "Activity",
          iconSrc: "freelife/apple/2709-fe0f.png",
          title: "Write a Letter",
          lead: `Who will you write to? Postage costs ${usd(eraCash(0.03))}.`,
          close: !0,
          choices: t.map(([t, a]) => [
            a,
            () => {
              e.letter = state.age;
              const o = rint(4, 10);
              (t.rel = clamp((t.rel ?? 60) + o)),
                eraResult("Write a Letter", "", [
                  1,
                  `I wrote a heartfelt letter to ${a.replace(/ \(.*\)$/, "")}.`,
                  { Happiness: 4, Respect: 1, money: -0.03 },
                ]);
            },
          ]),
        });
      }
      function eraSociety() {
        const e = (state.eraDone ||= {});
        if (e.society === state.age)
          return notice("Not again", "You already went to a society meeting this year.", null, !0);
        const t = "f" === PG() ? "Ladies' Club" : "Gentlemen's Club";
        if (state.society)
          return jCard({
            tag: "Activity",
            iconSrc: "emoji/1f3a9.png",
            title: state.society,
            lead: `You're a member of the ${state.society}.`,
            close: !0,
            choices: [
              [
                "Attend a meeting",
                () => {
                  (e.society = state.age),
                    eraResult(state.society, "", [
                      1,
                      `I attended a meeting of the ${state.society}.`,
                      { Happiness: 4, Smarts: 2, Respect: 2 },
                    ]);
                },
              ],
              [
                "Resign my membership",
                () => {
                  say(`I resigned from the ${state.society}.`), (state.society = null);
                },
                "gray",
              ],
            ],
          });
        const a = (t, a, o) => () => {
          if (state.money < eraCash(a))
            return notice("Not enough money", `The ${t} charges ${usd(eraCash(a))} to join.`, null, !0);
          (e.society = state.age),
            (state.society = t),
            eraResult("Join a Society", "", [1, `I joined the ${t}.`, { ...o, money: -a }]);
        };
        jCard({
          tag: "Activity",
          iconSrc: "emoji/1f3a9.png",
          title: "Join a Society",
          lead: "Which society will you join?",
          close: !0,
          choices: [
            [`Literary Society (${usd(eraCash(5))})`, a("Literary Society", 5, { Smarts: 5, Respect: 4 })],
            [`${t} (${usd(eraCash(25))})`, a(t, 25, { Happiness: 6, Looks: 2, Respect: 8 })],
            [
              `Temperance Society (${usd(eraCash(1))})`,
              a("Temperance Society", 1, { Health: 4, Respect: 3 }),
            ],
          ],
        });
      }
      function eraCourt() {
        const e = (state.eraDone ||= {});
        if (e.court === state.age)
          return notice("Not again", "You already went courting this year.", null, !0);
        const t = makeLover({
            g:
              "Gay" === state.sexuality || ("Bisexual" === state.sexuality && chance(0.5))
                ? PG()
                : "f" === PG()
                  ? "m"
                  : "f",
          }),
          a = state.age + t.ageOffset;
        (t.prof = null),
          profileOf(t, a),
          (t.job = t.prof.job),
          (t.money = t.prof.money),
          (t.house = "Lives with family");
        const o = 0.35 + state.stats.Looks / 250 + (state.money > 50 ? 0.1 : 0),
          n = (a, n) => () => {
            (e.court = state.age),
              chance(o + a)
                ? (addLover(t),
                  eraResult("Court Someone", "", [
                    1,
                    `I ${n} and ${t.first} ${t.last} agreed to let me court ${herOf(t)}.`,
                    { Happiness: 10, Respect: 2 },
                  ]))
                : eraResult("Court Someone", "", [
                    1,
                    `I ${n}, but ${t.first} ${t.last} turned me down.`,
                    { Happiness: -6 },
                  ]);
          };
        jCard({
          tag: "Courtship",
          iconSrc: "emoji/2764-fe0f.png",
          title: "Court Someone",
          person: { name: `${t.first} ${t.last}`, look: t.look, g: t.g, age: a },
          lead: `You've caught the eye of ${t.first} ${t.last}, a ${a}-year-old ${/^(None|Student|Unemployed|Retired)$/.test(t.job) ? "local" : t.job.toLowerCase()}. How will you win ${herOf(t)} over?`,
          close: !0,
          choices: [
            ...(hasHorse()
              ? [
                  [
                    "Take them for a carriage ride",
                    n(0.12, `took ${t.first} for a carriage ride behind ${state.horses[0].name}`),
                  ],
                ]
              : []),
            ["Send flowers", n(0, `sent flowers to ${t.first}`)],
            ["Take a stroll in the park", n(0.05, `took ${t.first} for a stroll in the park`)],
            [
              "Ask the family for permission",
              n(chance(0.5) ? 0.15 : -0.2, `asked ${t.first}'s family for permission to court ${herOf(t)}`),
            ],
          ],
        });
      }
      const HUNT_GUNS = [
          {
            id: "rifle",
            name: "Bolt-Action Rifle",
            cls: "rifle",
            ico: "hunt/rifle.png?v=2",
            price: [20, 200],
            acc: 60,
            dmg: 70,
            range: 70,
            cap: 5,
            desc: "A reliable rifle for deer, elk, boar, bear and wolves",
          },
          {
            id: "lever",
            name: "Lever-Action Rifle",
            cls: "rifle",
            ico: "hunt/lever.png",
            price: [40, 250],
            acc: 64,
            dmg: 55,
            range: 55,
            cap: 10,
            desc: "A classic frontier rifle that holds plenty of rounds",
          },
          {
            id: "scoped",
            name: "Scoped Rifle",
            cls: "rifle",
            ico: "hunt/scoped.png",
            price: [100, 450],
            acc: 80,
            dmg: 72,
            range: 95,
            cap: 5,
            desc: "A telescopic sight for long-range shots",
          },
          {
            id: "shotgun",
            name: "Double-Barrel Shotgun",
            cls: "shotgun",
            ico: "hunt/shotgun.png?v=2",
            price: [15, 200],
            acc: 70,
            dmg: 50,
            range: 25,
            cap: 2,
            desc: "For ducks, geese, turkeys, pheasants, rabbits and squirrels",
          },
          {
            id: "golden",
            name: "Golden Rifle",
            cls: "rifle",
            ico: "hunt/golden.png",
            price: [500, 5e3],
            acc: 88,
            dmg: 85,
            range: 95,
            cap: 5,
            respect: 5,
            desc: "An engraved, gold-plated rifle with a gold scope",
          },
        ],
        gunBars = (e) => [
          ["Accuracy", e.acc, "#f4c044", `${e.acc}`],
          ["Damage", e.dmg, "#e8572a", `${e.dmg}`],
          ["Range", e.range, "#4caf50", `${e.range}`],
          ["Capacity", 10 * e.cap, "#9b7bd4", `${e.cap}`],
        ],
        gunRange = (e) => Math.round(2.6 * e.range),
        AMMO = [
          {
            id: "pouch",
            name: "Cartridge Pouch",
            cls: "rifle",
            n: 10,
            ico: "hunt/ammo-pouch.png",
            price: [0.5, 15],
          },
          {
            id: "crate",
            name: "Crate of Rifle Cartridges",
            cls: "rifle",
            n: 50,
            ico: "hunt/ammo-crate.png",
            price: [2, 60],
          },
          {
            id: "military",
            name: "Military Ammo Crate",
            cls: "rifle",
            n: 200,
            ico: "hunt/ammo-military.png",
            price: [7, 200],
          },
          {
            id: "shells",
            name: "Box of Shotgun Shells",
            cls: "shotgun",
            n: 25,
            ico: "hunt/ammo-shells.png",
            price: [0.75, 12],
          },
          {
            id: "case",
            name: "Case of Shotgun Shells",
            cls: "shotgun",
            n: 100,
            ico: "hunt/ammo-case.png",
            price: [2.5, 40],
          },
        ],
        AMMO_NAME = { rifle: "rifle cartridges", shotgun: "shotgun shells" },
        AMMO_ICO = { rifle: "hunt/ammo-crate.png", shotgun: "hunt/ammo-shells.png" },
        ammoOf = (e) => (state.ammo || {})[e] || 0,
        gunOf = (e) => HUNT_GUNS.find((t) => t.id === e),
        GAME = Object.fromEntries(
          [
            ["rabbit", "Rabbit", "2018/emoji/1f407.png", "any", 2, 4, 4, 3, 0, 0.2, 0],
            ["squirrel", "Squirrel", "2018/emoji/1f43f.png", "shotgun", 1, 2, 3, 2, 0, 0.3, 0],
            ["pheasant", "Pheasant", "2018/emoji/1f413.png", "shotgun", 2, 3, 8, 5, 0, 0.35, 0],
            ["duck", "Mallard Duck", "emoji/1f986.png", "shotgun", 2, 3, 7, 4, 0, 0.35, 0],
            ["goose", "Canada Goose", "emoji/1f426.png", "shotgun", 7, 12, 6, 8, 0, 0.4, 0],
            ["turkey", "Wild Turkey", "emoji/1f983.png", "shotgun", 12, 24, 5, 10, 60, 0.45, 0],
            ["fox", "Red Fox", "2018/emoji/1f98a.png", "rifle", 8, 15, 0, 60, 150, 0.5, 0],
            ["coyote", "Coyote", "2018/emoji/1f43a.png", "rifle", 25, 40, 0, 45, 100, 0.5, 0],
            ["deer", "Whitetail Deer", "2018/emoji/1f98c.png", "rifle", 100, 220, 8, 40, 350, 0.45, 0],
            ["boar", "Wild Boar", "2018/emoji/1f417.png", "rifle", 100, 250, 7, 25, 250, 0.55, 0.12],
            ["elk", "Elk", "2018/emoji/1f98c.png", "rifle", 400, 700, 9, 80, 3e3, 0.6, 0.03],
            ["bear", "Black Bear", "emoji/1f43b.png", "rifle", 200, 500, 3, 400, 1200, 0.65, 0.25],
            ["wolf", "Gray Wolf", "2018/emoji/1f43a.png", "rifle", 60, 110, 0, 250, 500, 0.65, 0.1],
            ["trout", "Rainbow Trout", "emoji/1f41f.png", "rod", 1, 6, 9, 0, 60, 0.3, 0],
            ["bass", "Largemouth Bass", "emoji/1f420.png", "rod", 1, 8, 7, 0, 80, 0.35, 0],
            ["catfish", "Catfish", "emoji/1f41f.png", "rod", 2, 30, 5, 0, 120, 0.4, 0],
            ["salmon", "Salmon", "emoji/1f41f.png", "rod", 4, 30, 10, 0, 150, 0.45, 0],
          ].map(([e, t, a, o, n, s, r, i, l, c, d]) => [
            e,
            { id: e, name: t, ico: a, gun: o, lo: n, hi: s, meat: r, pelt: i, trophy: l, diff: c, danger: d },
          ]),
        ),
        HUNT_SPOTS = [
          {
            k: "woods",
            name: "Woodland",
            ico: "2018/emoji/1f332.png",
            min: 12,
            pools: {
              rifle: [
                ["deer", 45],
                ["boar", 12],
                ["fox", 15],
                ["rabbit", 20],
                ["wolf", 8],
              ],
              shotgun: [
                ["rabbit", 40],
                ["squirrel", 35],
                ["turkey", 25],
              ],
            },
          },
          {
            k: "fields",
            name: "Open Fields",
            ico: "emoji/1f3de-fe0f.png",
            min: 12,
            pools: {
              rifle: [
                ["rabbit", 35],
                ["coyote", 30],
                ["fox", 15],
                ["deer", 20],
              ],
              shotgun: [
                ["pheasant", 50],
                ["rabbit", 35],
                ["turkey", 15],
              ],
            },
          },
          {
            k: "marsh",
            name: "Marshland",
            ico: "emoji/1f986.png",
            min: 12,
            pools: {
              rifle: [
                ["boar", 60],
                ["deer", 40],
              ],
              shotgun: [
                ["duck", 65],
                ["goose", 35],
              ],
            },
          },
          {
            k: "mountains",
            name: "Mountains",
            ico: "emoji/1f3d4-fe0f.png",
            min: 18,
            pools: {
              rifle: [
                ["elk", 40],
                ["bear", 25],
                ["deer", 25],
                ["wolf", 10],
              ],
              shotgun: [["turkey", 100]],
            },
          },
          {
            k: "river",
            name: "River Fishing",
            ico: "emoji/1f3a3.png",
            min: 6,
            pools: {
              rod: [
                ["trout", 35],
                ["bass", 30],
                ["catfish", 25],
                ["salmon", 10],
              ],
            },
          },
        ],
        HUNT_GRADE = ["Poor", "Fair", "Good", "Excellent", "Trophy"],
        HUNT_MULT = [0.35, 0.65, 1, 1.3, 1.6],
        HUNT_TRIPS = 4,
        gunPrice = (e) => (isOldEra() ? eraCash(e.price[0]) : localPrice(e.price[1])),
        huntIdxAt = (e) => Math.max(0.5, isOldEra() ? Math.pow(1.015, e - 1850) : Math.pow(1.025, e - 2025)),
        huntIdx = () => huntIdxAt(state.birthYear + state.age),
        huntCash = (e) =>
          e <= 0
            ? 0
            : isOldEra()
              ? Math.max(0.01, eraCash(0.01 * e * huntIdx()))
              : Math.max(1, Math.round(e * huntIdx() * (PRICE_LVL[state.country] || 1))),
        licenseCost = () => localPrice(35),
        hasGun = (e) => (state.guns || []).includes(e),
        killVals = (e) => {
          const t = GAME[e.sp],
            a = HUNT_MULT[e.grade],
            o = e.rotten ? 0.35 : 1;
          return {
            meat: e.rotten || !t.meat ? 0 : t.meat * e.lbs * ("rod" === t.gun ? 0.6 : 0.45) * a,
            pelt: t.pelt * a * o,
            trophy:
              e.grade >= 3 && t.trophy
                ? t.trophy *
                  (4 === e.grade ? 1 : 0.45) *
                  (0.5 + (e.lbs - t.lo) / Math.max(1, t.hi - t.lo)) *
                  o
                : 0,
          };
        },
        HUNT_BUYERS = () => [
          {
            k: "market",
            name: isOldEra() ? "Village Market" : "Farmers' Market",
            val: (e) => 0.7 * e.meat + 0.5 * e.pelt,
            note: "Buys the whole animal at a low price",
          },
          {
            k: "butcher",
            name: isOldEra() ? "Butcher" : "Wild Game Processor",
            val: (e, t) => (t.grade >= 1 ? 1.05 * e.meat : 0),
            note: "Pays well for meat, but not for shot-up animals",
          },
          {
            k: "fur",
            name: isOldEra() ? "Fur Trader" : "Fur Buyer",
            val: (e) => e.pelt * (isOldEra() ? 3 : 1.25),
            note: "Only buys the hide or feathers",
          },
          {
            k: "taxi",
            name: "Taxidermist",
            val: (e) => (e.trophy ? e.trophy + e.pelt : 0),
            note: "Pays big for trophy-grade animals",
          },
        ];
      function openHunting() {
        (sTitle.textContent = "HUNTING"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const e =
            state.huntYear && state.huntYear.age === state.age
              ? state.huntYear
              : (state.huntYear = { age: state.age, n: 0 }),
          t = HUNT_TRIPS - e.n,
          a = isOldEra() || state.huntLicense === state.age;
        (sList.innerHTML =
          '<div class="sec">Gear</div>' +
          HUNT_GUNS.filter((e) => hasGun(e.id))
            .map((e) => {
              const t = ammoOf(e.cls);
              return `<div class="row"><img src="${e.ico}" alt=""><div class="t"><b>${e.name}</b><span>${t ? `${t} ${AMMO_NAME[e.cls]} left` : `Out of ${AMMO_NAME[e.cls]}`}</span></div></div>`;
            })
            .join("") +
          `<div class="row" data-h="shop"><img src="hunt/ammo-crate.png" alt=""><div class="t"><b>${isOldEra() ? "Gunsmith" : "Gun Shop"}</b><span>Buy guns and boxes of ammunition</span></div>${CHEV}</div>` +
          (isOldEra()
            ? ""
            : `<div class="row" data-h="license"><img src="emoji/1f4dc.png" alt=""><div class="t"><b>Hunting License</b><span>${a ? "Valid for this year" : `Not licensed · ${usd(licenseCost())} for this year`}</span></div>${a ? "" : DOTS}</div>`) +
          `<div class="sec">Go Out · ${t > 0 ? `${t} trip${1 === t ? "" : "s"} left this year` : "no trips left this year"}</div>` +
          HUNT_SPOTS.map((e) => {
            const t = state.age < e.min;
            return `<div class="row${t ? " dis" : ""}" data-spot="${e.k}"><img src="${e.ico}" alt=""><div class="t"><b>${e.name}</b><span>${
              t
                ? `Age ${e.min}+`
                : ((e) =>
                    [
                      ...new Set(
                        Object.values(e.pools)
                          .flat()
                          .map(([e]) => GAME[e].name),
                      ),
                    ].join(", "))(e)
            }</span></div>${t ? "" : DOTS}</div>`;
          }).join("") +
          `<div class="sec">Selling</div><div class="row" data-h="sell"><img src="emoji/1f969.png" alt=""><div class="t"><b>Sell Your Catch</b><span>${(state.kills || []).length ? `${state.kills.length} in your Assets · ${state.kills.filter((e) => e.rotten).length ? "some have gone bad" : "sell before they go bad"}` : "Nothing to sell yet"}</span></div>${CHEV}</div>`),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-h]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice");
                const t = e.dataset.h;
                "shop" === t
                  ? openGunShop()
                  : "sell" === t
                    ? openGameSeller(openHunting)
                    : "license" !== t || a || buyLicense();
              }),
          ),
          sList.querySelectorAll("[data-spot]").forEach(
            (e) =>
              (e.onclick = () => {
                e.classList.contains("dis") ||
                  (play("choice"), goHunt(HUNT_SPOTS.find((t) => t.k === e.dataset.spot)));
              }),
          ),
          screen.classList.add("open");
      }
      function buyLicense() {
        const e = licenseCost();
        jCard({
          tag: "Hunting",
          iconSrc: "emoji/1f4dc.png",
          title: "Hunting License",
          lead: "A hunting license lets you hunt legally for the rest of this year.",
          close: !0,
          rows: [
            ["Cost", usd(e)],
            ["Bank Balance", usd(state.money)],
          ],
          choices: [
            [
              "Buy a license",
              () => {
                if (state.money < e)
                  return notice("Not enough money", `A hunting license costs ${usd(e)}.`, null, !0);
                (state.money -= e),
                  (state.huntLicense = state.age),
                  renderStats(),
                  say("I bought a hunting license."),
                  openHunting();
              },
            ],
          ],
        });
      }
      function openGunShop() {
        (sTitle.textContent = isOldEra() ? "GUNSMITH" : "GUN SHOP"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openHunting);
        const e = isOldEra() ? 14 : 18;
        (sList.innerHTML =
          '<div class="sec">Guns</div>' +
          HUNT_GUNS.map(
            (e, t) =>
              `<div class="row" data-gun="${t}"><img src="${e.ico}" alt=""><div class="t"><b>${e.name}</b><span>${hasGun(e.id) ? "Owned" : usd(gunPrice(e))} · ${e.desc}</span></div>${hasGun(e.id) ? "" : DOTS}</div>`,
          ).join("") +
          `<div class="sec">Ammunition · ${ammoOf("rifle")} cartridges · ${ammoOf("shotgun")} shells</div>` +
          AMMO.map(
            (e, t) =>
              `<div class="row" data-ammo="${t}"><img src="${e.ico}" alt=""><div class="t"><b>${e.name}</b><span>${usd(gunPrice(e))} · ${e.n} ${AMMO_NAME[e.cls]}</span></div>${DOTS}</div>`,
          ).join("")),
          (sList.scrollTop = 0);
        const t = (t) =>
          state.age < e
            ? (notice("Too young", `You must be at least ${e} to buy guns or ammunition.`, null, !0), !1)
            : !isOldEra() && state.felony
              ? (notice(
                  "Rejected",
                  "The background check flagged your felony conviction. The shop won't sell to you.",
                  null,
                  !0,
                ),
                !1)
              : !(state.money < t) || (notice("Not enough money", `That costs ${usd(t)}.`, null, !0), !1);
        sList.querySelectorAll("[data-gun]").forEach(
          (e) =>
            (e.onclick = () => {
              const a = HUNT_GUNS[+e.dataset.gun],
                o = gunPrice(a);
              hasGun(a.id) ||
                jCard({
                  tag: "Gun Shop",
                  iconSrc: a.ico,
                  title: a.name,
                  lead: `${a.desc}. You'll need ${AMMO_NAME[a.cls]} to use it.`,
                  close: !0,
                  barsTitle: "Stats",
                  bars: gunBars(a),
                  rows: [
                    ["Price", usd(o)],
                    ["Holds", `${a.cap} ${"rifle" === a.cls ? "rounds" : "shells"}`],
                    ["Effective Range", `${gunRange(a)} yards`],
                    ["Bank Balance", usd(state.money)],
                  ],
                  choices: [
                    [
                      "Buy it",
                      () => {
                        t(o) &&
                          ((state.money = cents(state.money - o)),
                          play("gunCock"),
                          (state.guns ||= []).push(a.id),
                          a.respect && (state.respect = clamp((state.respect ?? 40) + a.respect)),
                          renderStats(),
                          say(`I bought a ${a.name.toLowerCase()}.`),
                          notice(
                            "New gun",
                            `You bought a ${a.name.toLowerCase()} for ${usd(o)}.${ammoOf(a.cls) ? "" : ` Don't forget to buy ${AMMO_NAME[a.cls]}.`}`,
                            openGunShop,
                            !0,
                          ));
                      },
                    ],
                  ],
                });
            }),
        ),
          sList.querySelectorAll("[data-ammo]").forEach(
            (e) =>
              (e.onclick = () => {
                const a = AMMO[+e.dataset.ammo],
                  o = gunPrice(a),
                  n = (e) => {
                    t(o * e) &&
                      (play("coins"),
                      (state.money = cents(state.money - o * e)),
                      ((state.ammo ||= {})[a.cls] = ammoOf(a.cls) + a.n * e),
                      renderStats(),
                      say(
                        `I bought ${1 === e ? `a ${a.name.toLowerCase()}` : `${e} × ${a.name.toLowerCase()}`}.`,
                      ),
                      notice(
                        "Ammunition",
                        `You now have ${ammoOf(a.cls)} ${AMMO_NAME[a.cls]}.`,
                        openGunShop,
                        !0,
                      ));
                  };
                jCard({
                  tag: "Gun Shop",
                  iconSrc: a.ico,
                  title: a.name,
                  lead: `${a.n} ${AMMO_NAME[a.cls]}. Every shot you take uses one.`,
                  close: !0,
                  rows: [
                    ["Price", usd(o)],
                    ["You Have", `${ammoOf(a.cls)} ${AMMO_NAME[a.cls]}`],
                    ["Bank Balance", usd(state.money)],
                  ],
                  choices: [
                    ["Buy 1", () => n(1)],
                    ["Buy 5", () => n(5)],
                  ],
                });
              }),
          ),
          screen.classList.add("open");
      }
      function goHunt(e) {
        if (
          (state.huntYear && state.huntYear.age === state.age
            ? state.huntYear
            : (state.huntYear = { age: state.age, n: 0 })
          ).n >= HUNT_TRIPS
        )
          return notice(
            "Season over",
            `You've already been out ${HUNT_TRIPS} times this year. Try again next year.`,
            null,
            !0,
          );
        const t = !!e.pools.rod,
          a = HUNT_GUNS.filter((t) => hasGun(t.id) && e.pools[t.cls]),
          o = isOldEra() ? "gunsmith" : "gun shop",
          n = t ? ["rod"] : a.filter((e) => ammoOf(e.cls) > 0).map((e) => e.id);
        return isOldEra() && "mountains" === e.k && !hasHorse("ride")
          ? notice(
              "Too far to walk",
              "The mountains are days away. You need a riding horse to hunt there.",
              null,
              !0,
            )
          : t || a.length
            ? n.length
              ? t || isOldEra() || state.huntLicense === state.age
                ? void startHunt(e, n, !1)
                : jCard({
                    tag: "Hunting",
                    iconSrc: "emoji/1f4dc.png",
                    title: "No License",
                    close: !0,
                    lead: "You need a hunting license for this year before you can hunt. Hunting without one is poaching.",
                    choices: [
                      ["Buy a license", buyLicense],
                      ["Poach anyway", () => startHunt(e, n, !0), "gray"],
                    ],
                  })
              : jCard({
                  tag: "Hunting",
                  iconSrc: AMMO_ICO[a[0].cls],
                  title: "Out of Ammo",
                  close: !0,
                  lead: `You don't have any ${[...new Set(a.map((e) => AMMO_NAME[e.cls]))].join(" or ")}. Buy a box at the ${o} before you go out.`,
                  choices: [[`Go to the ${o}`, openGunShop]],
                })
            : notice(
                "No gun",
                `You need a gun to hunt in the ${e.name.toLowerCase()}. Guns start at ${usd(Math.min(...HUNT_GUNS.map(gunPrice)))} at the ${o}.`,
                null,
                !0,
              );
      }
      function startHunt(e, t, a) {
        const o = "rod" === t[0],
          n = (t) => {
            const n = gunOf(t),
              s = o ? "rod" : n.cls;
            state.huntYear.n++;
            const r = state.huntSkill || 0,
              i = e.name.toLowerCase();
            if (chance(0.02))
              return eraResult(e.name, e.ico, [
                1,
                `I slipped on a muddy bank in the ${i} and hurt myself.`,
                { Health: -8, Happiness: -4 },
              ]);
            if (!chance(o ? 0.85 : 0.75))
              return (
                (state.huntSkill = Math.min(100, r + 1)),
                eraResult(e.name, e.ico, [
                  1,
                  o
                    ? "I fished all day at the river without a single bite."
                    : `I spent all day in the ${i} and never got a clean look at anything.`,
                  { Happiness: -1 },
                ])
              );
            const l = e.pools[s],
              c = GAME[eraRoll(l.map(([e, t]) => [t, e]))[1]],
              d = rint(c.lo, c.hi),
              u = "shotgun" === s ? rint(15, 60) : rint(30, 260),
              h = /^[AEIOU]/.test(c.name) ? "an" : "a",
              p = c.name.toLowerCase(),
              m = (t, s = 1) => {
                if (t && 1 === s && chance(o ? 0.2 : 0.25))
                  return eraResult(e.name, c.ico, [
                    1,
                    o
                      ? `${h[0].toUpperCase() + h.slice(1)} ${p} slipped the hook while I played it.`
                      : `I waited for a better shot, but the ${p} caught my scent and ran off.`,
                    { Happiness: -2 },
                  ]);
                play(o ? "fishReel" : "gunshot"), o || (state.ammo[n.cls] = Math.max(0, ammoOf(n.cls) - 1));
                const i = o ? 0 : (Math.max(0, u - gunRange(n)) / 50) * 0.1,
                  l = Math.max(
                    0.05,
                    Math.min(
                      0.95,
                      0.45 +
                        0.004 * r +
                        (t ? 0.15 : 0) +
                        (n ? 0.005 * (n.acc - 60) : 0) -
                        0.4 * c.diff -
                        i -
                        (s > 1 ? 0.1 : 0) -
                        (state.stats.Health < 30 ? 0.15 : 0),
                    ),
                  );
                state.huntSkill = Math.min(100, r + rint(2, 4));
                const f = chance(l);
                if (f && !o && !chance(Math.min(1, n.dmg / (110 * c.diff))))
                  return c.danger && chance(1.5 * c.danger)
                    ? eraResult(e.name, c.ico, [
                        1,
                        `My ${n.name.toLowerCase()} only wounded the ${p}, and it charged at me! I was badly hurt.`,
                        { Health: -rint(15, 40), Happiness: -10, Respect: -1 },
                      ])
                    : eraResult(e.name, c.ico, [
                        1,
                        `I hit ${h} ${p}, but my ${n.name.toLowerCase()} didn't have the stopping power and it got away wounded.`,
                        { Happiness: -3, Respect: -1 },
                      ]);
                if (f) {
                  const n = Math.max(
                    0,
                    Math.min(
                      c.trophy ? 4 : 3,
                      Math.floor(
                        2 * Math.random() +
                          r / 50 +
                          (t ? 0.5 : 0) +
                          ((d - c.lo) / Math.max(1, c.hi - c.lo)) * 0.8,
                      ),
                    ),
                  );
                  (state.kills ||= []).push({ sp: c.id, lbs: d, grade: n, at: state.age });
                  const s = {
                    Happiness: n >= 3 ? 10 : 6,
                    Respect: (4 === n ? 3 : 0) + (c.trophy >= 500 ? 3 : 0) + (a ? -4 : 0),
                  };
                  return (
                    a && chance(0.25) && ((s.money = -localPrice(500)), (s.Respect -= 4)),
                    o && setTimeout(() => play("fishSplash"), 700),
                    eraResult(e.name, c.ico, [
                      1,
                      `I ${o ? "caught" : "shot"} ${h} ${c.name.toLowerCase()} weighing ${d} lb. It's ${HUNT_GRADE[n].toLowerCase()} quality.` +
                        (s.money ? ` A game warden caught me poaching and fined me ${usd(-s.money)}.` : ""),
                      s,
                    ])
                  );
                }
                if (!o && c.danger && chance(c.danger))
                  return eraResult(e.name, c.ico, [
                    1,
                    `I missed, and the ${p} charged at me! I was badly hurt.`,
                    { Health: -rint(15, 40), Happiness: -10 },
                  ]);
                const g = o ? 0 : Math.min(n.cap - s, ammoOf(n.cls)),
                  y = n && "rifle" === n.cls ? "round" : "shell";
                return g > 0 && chance(0.6)
                  ? jCard({
                      tag: "Hunting",
                      iconSrc: c.ico,
                      title: "Missed!",
                      lead: `You missed! The ${p} is running. You have ${g} more ${y}${1 === g ? "" : "s"} loaded in your ${n.name.toLowerCase()}.`,
                      choices: [
                        [
                          "Fire again",
                          () => {
                            play("gunCock"), setTimeout(() => m(!1, s + 1), 350);
                          },
                        ],
                        [
                          "Let it go",
                          () =>
                            eraResult(e.name, c.ico, [
                              1,
                              `I missed ${h} ${p} and let it run off.`,
                              { Happiness: -2 },
                            ]),
                        ],
                      ],
                    })
                  : !o && 1 === s && chance(0.35)
                    ? eraResult(e.name, c.ico, [
                        1,
                        `I wounded ${h} ${c.name.toLowerCase()}, but it got away.`,
                        { Happiness: -3, Respect: -1 },
                      ])
                    : void eraResult(e.name, c.ico, [
                        1,
                        o
                          ? `I hooked ${h} ${c.name.toLowerCase()}, but it broke the line.`
                          : `I took a shot at ${h} ${c.name.toLowerCase()} and missed.`,
                        { Happiness: -2 },
                      ]);
              };
            play(
              o
                ? "fishSplash"
                : "wolf" === c.id
                  ? "wolfHowl"
                  : /^(pheasant|duck|goose|turkey)$/.test(c.id)
                    ? "birdCall"
                    : "choice",
            ),
              jCard({
                tag: o ? "Fishing" : "Hunting",
                iconSrc: c.ico,
                title: o ? "Fish On!" : `${c.name} Spotted`,
                lead: o
                  ? `Something big is pulling on your line. It feels like ${h} ${c.name.toLowerCase()}!`
                  : `You spot ${h} ${p} about ${u} yards away. It looks like it weighs around ${10 * Math.round(d / 10) || d} lb.${u > gunRange(n) ? ` That's past the ${gunRange(n)}-yard range of your ${n.name.toLowerCase()}.` : ""}`,
                choices: o
                  ? [
                      ["Reel it in hard", () => m(!1)],
                      ["Play it slowly", () => m(!0)],
                      [
                        "Cut the line",
                        () => eraResult(e.name, c.ico, [1, "I cut the line and let it go.", {}]),
                      ],
                    ]
                  : [
                      ["Take the shot", () => m(!1)],
                      ["Wait for a better shot", () => m(!0)],
                      [
                        "Let it go",
                        () =>
                          eraResult(e.name, c.ico, [
                            1,
                            `I lowered my ${n.name.toLowerCase()} and let the ${c.name.toLowerCase()} go.`,
                            {},
                          ]),
                      ],
                    ],
              });
          };
        if (t.length > 1)
          return jCard({
            tag: "Hunting",
            iconSrc: e.ico,
            title: e.name,
            lead: "Which gun will you take?",
            close: !0,
            choices: t.map((e) => {
              const t = gunOf(e);
              return [`${t.name} (${ammoOf(t.cls)} ${"rifle" === t.cls ? "rounds" : "shells"})`, () => n(e)];
            }),
          });
        n(t[0]);
      }
      function killRows() {
        const e = state.kills || [];
        return e.length || (state.guns || []).length || ammoOf("rifle") || ammoOf("shotgun")
          ? '<div class="sec">Hunting</div>' +
              (state.guns || [])
                .map((e) => {
                  const t = gunOf(e);
                  return t
                    ? `<div class="row"><img src="${t.ico}" alt=""><div class="t"><b>${t.name}</b><span>${t.desc}</span></div></div>`
                    : "";
                })
                .join("") +
              ["rifle", "shotgun"]
                .filter((e) => ammoOf(e))
                .map(
                  (e) =>
                    `<div class="row"><img src="${AMMO_ICO[e]}" alt=""><div class="t"><b>${AMMO_NAME[e][0].toUpperCase() + AMMO_NAME[e].slice(1)} <em>(×${ammoOf(e)})</em></b><span>Used up one per shot</span></div></div>`,
                )
                .join("") +
              e
                .map((e, t) => {
                  const a = GAME[e.sp],
                    o = killVals(e),
                    n = Math.max(...HUNT_BUYERS().map((t) => huntCash(t.val(o, e))));
                  return `<div class="row" data-kill="${t}"><img src="${a.ico}" alt=""><div class="t"><b>${a.name} <em>(${e.lbs} lb)</em></b><span>${killStatus(e)} · ${n ? `worth up to ${usd(n)}` : "worthless now"}</span></div>${DOTS}</div>`;
                })
                .join("")
          : "";
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || !state.kills) return;
        let e = 0,
          t = 0;
        (state.kills = state.kills.filter(
          (a) => a.at >= state.age || (a.rotten ? (t++, !1) : ((a.rotten = !0), e++, !0)),
        )),
          e &&
            say(
              `${1 === e ? "Something I caught" : `${e} things I caught`} went bad because I didn't sell ${1 === e ? "it" : "them"} in time.`,
            ),
          t &&
            say(
              `I threw out ${1 === t ? "a rotten catch" : `${t} rotten catches`} that had been lying around for over a year.`,
            );
      });
      const killStatus = (e) =>
          e.rotten ? '<span style="color:#c62828">Gone bad</span>' : `${HUNT_GRADE[e.grade]} quality · fresh`,
        killBest = (e) => {
          const t = killVals(e);
          return (
            HUNT_BUYERS()
              .map((a) => [a, huntCash(a.val(t, e))])
              .filter(([, e]) => e > 0)
              .sort((e, t) => t[1] - e[1])[0] || null
          );
        },
        sellRespect = (e, t) => Math.max(1, e.grade) + ("taxi" === t.k ? 2 : 0) - (e.rotten ? 1 : 0);
      function openGameSeller(e) {
        (sTitle.textContent = "SELL YOUR CATCH"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = e || openHunting);
        const t = state.birthYear + state.age,
          a = huntIdxAt(t) / huntIdxAt(t - 1) - 1,
          o = state.kills || [],
          n = o.map((e, t) => [e, t, killBest(e)]).filter(([, , e]) => e),
          s = cents(n.reduce((e, [, , t]) => e + t[1], 0));
        (sList.innerHTML =
          `<div class="row dis"><img src="emoji/1f4c8.png" alt=""><div class="t"><b>Game prices in ${t}</b><span>Up ${(100 * a).toFixed(1)}% on last year · sell before your catch goes bad at the end of the year</span></div></div><div class="sec">Buyers</div>` +
          HUNT_BUYERS()
            .map(
              (e) =>
                `<div class="row dis"><img src="emoji/1f6d2.png" alt=""><div class="t"><b>${e.name}</b><span>${e.note}</span></div></div>`,
            )
            .join("") +
          '<div class="sec">Your Catch</div>' +
          (o.length
            ? o
                .map((e, t) => {
                  const a = GAME[e.sp],
                    o = killBest(e);
                  return `<div class="row" data-sell="${t}"><img src="${a.ico}" alt=""><div class="t"><b>${a.name} <em>(${e.lbs} lb)</em></b><span>${killStatus(e)} · ${o ? `best offer ${usd(o[1])} from the ${o[0].name.toLowerCase()}` : "nobody will buy it"}</span></div>${DOTS}</div>`;
                })
                .join("")
            : '<div class="row dis"><div class="t"><b>Nothing to sell</b><span>Go hunting or fishing first</span></div></div>') +
          (n.length > 1
            ? `<div class="row" id="sellAll"><img src="emoji/1f4b0.png" alt=""><div class="t"><b>Sell Everything · ${usd(s)}</b><span>Each piece goes to whoever pays the most</span></div>${DOTS}</div>`
            : "")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-sell]").forEach(
            (t) =>
              (t.onclick = () => {
                play("choice"), killCard(+t.dataset.sell, () => openGameSeller(e));
              }),
          );
        const r = document.getElementById("sellAll");
        r &&
          (r.onclick = () => {
            play("choice"),
              iosConfirm("Sell Everything", `Sell ${n.length} pieces of game for ${usd(s)}?`, () => {
                let t = 0;
                for (const [e, , [a]] of n) t += sellRespect(e, a);
                (state.kills = o.filter((e) => !n.some(([t]) => t === e))),
                  (state.money = cents(state.money + s)),
                  (state.respect = clamp((state.respect ?? 40) + Math.min(10, t))),
                  renderStats(),
                  play("coins"),
                  say(`I sold ${n.length} pieces of game for ${usd(s)}.`),
                  notice(
                    "Sold",
                    `You sold everything to the best buyers for ${usd(s)}. Folks in town are talking about what a fine hunter you are.`,
                    () => openGameSeller(e),
                    !0,
                  );
              });
          }),
          screen.classList.add("open");
      }
      function killCard(e, t) {
        const a = state.kills[e];
        if (!a) return;
        const o = GAME[a.sp],
          n = killVals(a),
          s = HUNT_BUYERS()
            .map((e) => [e, huntCash(e.val(n, a))])
            .filter(([, e]) => e > 0),
          r = `${/^[AEIOU]/.test(o.name) ? "an" : "a"} ${a.rotten ? "spoiled" : HUNT_GRADE[a.grade].toLowerCase()} ${o.name.toLowerCase()}`,
          i = () => {
            state.kills.splice(e, 1), renderStats(), (t || openAssets)();
          };
        jCard({
          tag: "Hunting",
          iconSrc: o.ico,
          title: o.name,
          close: !0,
          lead: a.rotten
            ? "This has gone bad. The meat is rotten and only the hide, feathers or trophy might still be worth something."
            : "Sell it before you age up, or it will go bad.",
          rows: [
            ["Weight", `${a.lbs} lb`],
            ["Quality", HUNT_GRADE[a.grade]],
            ["Condition", a.rotten ? "Gone bad" : "Fresh"],
            ...s.map(([e, t]) => [e.name, usd(t)]),
          ],
          choices: [
            ...s.map(([e, t]) => [
              `Sell to the ${e.name.toLowerCase().replace(/^the /, "")}`,
              () => {
                (state.money = cents(state.money + t)),
                  (state.respect = clamp((state.respect ?? 40) + sellRespect(a, e))),
                  play("coins"),
                  say(`I sold ${r} to the ${e.name.toLowerCase()} for ${usd(t)}.`),
                  i();
              },
            ]),
            ...(!a.rotten && o.meat
              ? [
                  [
                    "Cook it at home",
                    () => {
                      (state.stats.Happiness = clamp(state.stats.Happiness + 6)),
                        (state.stats.Health = clamp(state.stats.Health + 3)),
                        say(`I cooked ${r} at home.`),
                        i();
                    },
                  ],
                ]
              : []),
            [
              "Throw it away",
              () => {
                say(`I threw away ${r}.`), i();
              },
              "gray",
            ],
          ],
        });
      }
      const priceAt = (e, t) => {
          if (t <= e[0][0]) return e[0][1];
          for (let a = 1; a < e.length; a++)
            if (t <= e[a][0]) {
              const [o, n] = e[a - 1],
                [s, r] = e[a];
              return n + ((r - n) * (t - o)) / (s - o);
            }
          return e[e.length - 1][1];
        },
        ORE_PRICE = {
          gold: [
            [1800, 19.39],
            [1833, 19.39],
            [1834, 20.67],
            [1933, 20.67],
            [1934, 35],
            [1967, 35],
            [1968, 39],
            [1969, 41],
            [1970, 36],
            [1971, 41],
            [1972, 58],
            [1973, 97],
            [1974, 154],
            [1975, 161],
            [1976, 125],
            [1977, 148],
            [1978, 193],
            [1979, 306],
            [1980, 615],
            [1981, 460],
            [1982, 376],
            [1983, 424],
            [1984, 361],
            [1985, 317],
            [1986, 368],
            [1987, 447],
            [1988, 437],
            [1989, 381],
            [1990, 383],
            [1991, 362],
            [1992, 344],
            [1993, 360],
            [1994, 384],
            [1995, 384],
            [1996, 388],
            [1997, 331],
            [1998, 294],
            [1999, 279],
            [2e3, 279],
            [2001, 271],
            [2002, 310],
            [2003, 363],
            [2004, 409],
            [2005, 445],
            [2006, 604],
            [2007, 695],
            [2008, 872],
            [2009, 972],
            [2010, 1225],
            [2011, 1572],
            [2012, 1669],
            [2013, 1411],
            [2014, 1266],
            [2015, 1160],
            [2016, 1251],
            [2017, 1257],
            [2018, 1268],
            [2019, 1393],
            [2020, 1770],
            [2021, 1799],
            [2022, 1800],
            [2023, 1943],
            [2024, 2386],
            [2025, 3400],
            [2026, 4e3],
          ],
          silver: [
            [1800, 1.29],
            [1840, 1.3],
            [1850, 1.32],
            [1860, 1.35],
            [1870, 1.33],
            [1873, 1.3],
            [1876, 1.16],
            [1880, 1.15],
            [1885, 1.07],
            [1890, 1.05],
            [1893, 0.78],
            [1895, 0.65],
            [1899, 0.6],
            [1915, 0.51],
            [1919, 1.12],
            [1920, 1],
            [1921, 0.63],
            [1929, 0.53],
            [1932, 0.28],
            [1934, 0.48],
            [1940, 0.35],
            [1946, 0.8],
            [1950, 0.74],
            [1960, 0.91],
            [1964, 1.29],
            [1968, 2.14],
            [1970, 1.77],
            [1972, 1.68],
            [1974, 4.71],
            [1977, 4.62],
            [1979, 11.09],
            [1980, 20.6],
            [1981, 10.52],
            [1982, 7.95],
            [1983, 11.44],
            [1985, 6.14],
            [1987, 7.01],
            [1990, 4.83],
            [1993, 4.31],
            [1996, 5.2],
            [1999, 5.22],
            [2001, 4.37],
            [2004, 6.67],
            [2006, 11.55],
            [2008, 15],
            [2010, 20.2],
            [2011, 35.12],
            [2012, 31.15],
            [2013, 23.79],
            [2015, 15.68],
            [2018, 15.71],
            [2020, 20.5],
            [2021, 25.14],
            [2022, 21.73],
            [2023, 23.35],
            [2024, 28.27],
            [2025, 40],
            [2026, 48],
          ],
          copper: [
            [1800, 0.3],
            [1840, 0.24],
            [1850, 0.22],
            [1860, 0.23],
            [1870, 0.21],
            [1880, 0.21],
            [1890, 0.15],
            [1899, 0.17],
            [1920, 0.18],
            [1950, 0.21],
            [1980, 1],
            [2e3, 0.82],
            [2010, 3.4],
            [2026, 4.3],
          ],
          lead: [
            [1800, 0.06],
            [1850, 0.05],
            [1880, 0.05],
            [1899, 0.045],
            [1950, 0.13],
            [2e3, 0.2],
            [2026, 0.9],
          ],
          zinc: [
            [1800, 0.06],
            [1880, 0.05],
            [1899, 0.058],
            [1950, 0.14],
            [2e3, 0.5],
            [2026, 1.2],
          ],
          tin: [
            [1800, 0.25],
            [1850, 0.3],
            [1880, 0.21],
            [1899, 0.27],
            [1950, 0.95],
            [2e3, 2.5],
            [2026, 14],
          ],
          iron: [
            [1800, 30],
            [1860, 23],
            [1880, 28],
            [1899, 19],
            [1950, 50],
            [2e3, 150],
            [2026, 450],
          ],
          coal: [
            [1800, 9],
            [1830, 11],
            [1840, 8],
            [1860, 5.5],
            [1880, 4.5],
            [1899, 4],
            [1950, 15],
            [2e3, 25],
            [2026, 120],
          ],
          graphite: [
            [1800, 0.08],
            [1899, 0.05],
            [2e3, 0.3],
            [2026, 0.6],
          ],
          sulfur: [
            [1800, 0.02],
            [1899, 0.012],
            [2026, 0.08],
          ],
          quartz: [
            [1800, 0.05],
            [1899, 0.06],
            [2026, 3],
          ],
          limestone: [
            [1800, 1],
            [1899, 1.2],
            [2026, 15],
          ],
          marble: [
            [1800, 0.01],
            [1899, 0.012],
            [2026, 0.3],
          ],
          obsidian: [
            [1800, 0.02],
            [1899, 0.03],
            [2026, 2],
          ],
          diamond: [
            [1800, 15],
            [1870, 10],
            [1899, 12],
            [1950, 60],
            [2e3, 300],
            [2026, 500],
          ],
          ruby: [
            [1800, 8],
            [1899, 10],
            [1950, 50],
            [2026, 400],
          ],
          sapphire: [
            [1800, 6],
            [1899, 8],
            [1950, 40],
            [2026, 250],
          ],
          emerald: [
            [1800, 8],
            [1899, 10],
            [1950, 60],
            [2026, 400],
          ],
          amethyst: [
            [1800, 1],
            [1899, 0.4],
            [2026, 8],
          ],
          turquoise: [
            [1800, 0.3],
            [1899, 0.2],
            [2026, 3],
          ],
        },
        MINERALS = Object.fromEntries(
          [
            [
              "gold",
              "Gold-Bearing Quartz",
              "gold",
              "metal",
              "oz",
              [0.005, 0.2],
              [4, 30],
              "gold-bar",
              "Gold Bar",
              0.03,
            ],
            [
              "placer",
              "Gold Dust & Nuggets",
              "gold-rich",
              "placer",
              "oz",
              null,
              [0.05, 2],
              "gold-bars",
              "Gold Bar",
              0,
            ],
            [
              "silver",
              "Silver Ore",
              "silver",
              "metal",
              "oz",
              [0.3, 6],
              [5, 40],
              "silver-bar",
              "Silver Bar",
              0.03,
            ],
            [
              "copper",
              "Copper Ore",
              "copper",
              "metal",
              "lb",
              [0.02, 0.25],
              [10, 60],
              "copper-bar",
              "Copper Ingot",
              0.012,
            ],
            [
              "lead",
              "Galena (Lead Ore)",
              "lead",
              "metal",
              "lb",
              [0.3, 0.8],
              [10, 60],
              "iron-bars",
              "Lead Pig",
              0.006,
            ],
            [
              "zinc",
              "Zinc Blende",
              "copper-rich",
              "metal",
              "lb",
              [0.1, 0.5],
              [10, 50],
              "tin-bars",
              "Zinc Slab",
              0.008,
            ],
            [
              "tin",
              "Tin Ore (Cassiterite)",
              "graphite",
              "metal",
              "lb",
              [0.02, 0.1],
              [8, 40],
              "tin-bar",
              "Tin Ingot",
              0.012,
            ],
            [
              "iron",
              "Iron Ore",
              "iron",
              "metal",
              "ton",
              [0.25, 0.6],
              [30, 120],
              "iron-bar",
              "Pig Iron",
              0.002,
            ],
            ["coal", "Coal", "coal", "bulk", "ton", null, [40, 150]],
            ["graphite", "Graphite", "zinc", "bulk", "lb", null, [5, 30]],
            ["sulfur", "Sulfur", "sulfur", "bulk", "lb", null, [5, 30]],
            ["quartz", "Quartz Crystal", "quartz", "bulk", "lb", null, [3, 20]],
            ["limestone", "Limestone", "limestone", "bulk", "ton", null, [50, 150]],
            ["marble", "Marble", "marble", "bulk", "lb", null, [50, 200]],
            ["obsidian", "Obsidian", "obsidian", "bulk", "lb", null, [3, 20]],
            ["diamond", "Rough Diamond", "diamond", "gem", "ct", null, [0.5, 8]],
            ["ruby", "Ruby", "ruby", "gem", "ct", null, [0.5, 10]],
            ["sapphire", "Sapphire", "sapphire", "gem", "ct", null, [0.5, 12]],
            ["emerald", "Emerald", "emerald", "gem", "ct", null, [0.5, 10]],
            ["amethyst", "Amethyst", "amethyst", "gem", "ct", null, [2, 40]],
            ["turquoise", "Turquoise", "turquoise", "gem", "ct", null, [5, 80]],
          ].map(([e, t, a, o, n, s, r, i, l, c]) => [
            e,
            {
              id: e,
              name: t,
              ico: `mining/${a}.png`,
              cls: o,
              unit: n,
              content: s,
              amt: r,
              bar: i && `mining/${i}.png`,
              barName: l,
              fee: c,
            },
          ]),
        ),
        ORE_GRADE = ["Poor", "Low Grade", "Average", "Rich", "Bonanza"],
        GEM_GRADE = ["Cloudy", "Fair", "Fine", "Clear", "Flawless"],
        GEM_MULT = [0.25, 0.6, 1, 1.8, 3.5],
        BULK_MULT = [0.5, 0.75, 1, 1.15, 1.3],
        GRADE_FRAC = [0.05, 0.25, 0.45, 0.7, 1],
        MINE_REGIONS = () =>
          "us" === state.country
            ? [
                {
                  k: "pa",
                  name: "Pennsylvania Coalfields",
                  from: 1800,
                  far: !1,
                  kinds: ["drift", "shaft"],
                  hz: "coal",
                  dep: [
                    ["coal", 70],
                    ["iron", 6],
                    ["stone", 24],
                  ],
                },
                {
                  k: "adk",
                  name: "Adirondack Iron Hills",
                  from: 1800,
                  far: !1,
                  kinds: ["drift", "cave"],
                  hz: "rock",
                  dep: [
                    ["iron", 45],
                    ["graphite", 8],
                    ["stone", 47],
                  ],
                },
                {
                  k: "mo",
                  name: "Missouri Lead Belt",
                  from: 1800,
                  far: !1,
                  kinds: ["cave", "drift"],
                  hz: "rock",
                  dep: [
                    ["lead", 40],
                    ["zinc", 15],
                    ["stone", 45],
                  ],
                },
                {
                  k: "vt",
                  name: "Vermont Marble Quarries",
                  from: 1800,
                  far: !1,
                  kinds: ["cave"],
                  hz: "rock",
                  dep: [
                    ["marble", 55],
                    ["limestone", 30],
                    ["stone", 15],
                  ],
                },
                {
                  k: "nc",
                  name: "North Carolina Gem Hills",
                  from: 1800,
                  far: !1,
                  kinds: ["cave", "placer"],
                  hz: "cave",
                  dep: [
                    ["emerald", 3],
                    ["ruby", 3],
                    ["sapphire", 4],
                    ["amethyst", 10],
                    ["placer", 4],
                    ["quartz", 26],
                    ["stone", 50],
                  ],
                },
                {
                  k: "mi",
                  name: "Lake Superior Copper Country",
                  from: 1845,
                  far: !0,
                  kinds: ["shaft", "drift"],
                  hz: "rock",
                  dep: [
                    ["copper", 40],
                    ["silver", 3],
                    ["stone", 57],
                  ],
                },
                {
                  k: "ca",
                  name: "California Goldfields",
                  from: 1848,
                  far: !0,
                  kinds: ["placer", "drift", "cave"],
                  hz: "rock",
                  dep: [
                    ["placer", 35],
                    ["gold", 8],
                    ["quartz", 10],
                    ["stone", 47],
                  ],
                },
                {
                  k: "nv",
                  name: "Comstock Lode, Nevada",
                  from: 1859,
                  far: !0,
                  kinds: ["shaft", "drift"],
                  hz: "rock",
                  dep: [
                    ["silver", 30],
                    ["gold", 8],
                    ["lead", 10],
                    ["quartz", 12],
                    ["stone", 40],
                  ],
                },
                {
                  k: "az",
                  name: "Arizona Copper Hills",
                  from: 1870,
                  far: !0,
                  kinds: ["drift", "cave"],
                  hz: "rock",
                  dep: [
                    ["copper", 35],
                    ["turquoise", 8],
                    ["gold", 3],
                    ["stone", 54],
                  ],
                },
                {
                  k: "or",
                  name: "Oregon Obsidian Cliffs",
                  from: 1850,
                  far: !0,
                  kinds: ["cave"],
                  hz: "cave",
                  dep: [
                    ["obsidian", 40],
                    ["sulfur", 15],
                    ["stone", 45],
                  ],
                },
                {
                  k: "sd",
                  name: "Black Hills, Dakota",
                  from: 1874,
                  far: !0,
                  kinds: ["placer", "shaft"],
                  hz: "rock",
                  dep: [
                    ["gold", 25],
                    ["placer", 15],
                    ["stone", 60],
                  ],
                },
                {
                  k: "co",
                  name: "Leadville, Colorado",
                  from: 1877,
                  far: !0,
                  kinds: ["shaft", "drift"],
                  hz: "rock",
                  dep: [
                    ["silver", 30],
                    ["lead", 20],
                    ["gold", 5],
                    ["zinc", 5],
                    ["stone", 40],
                  ],
                },
              ]
            : [
                {
                  k: "wal",
                  name: "South Wales Coalfield",
                  from: 1800,
                  far: !1,
                  kinds: ["drift", "shaft"],
                  hz: "coal",
                  dep: [
                    ["coal", 70],
                    ["iron", 8],
                    ["stone", 22],
                  ],
                },
                {
                  k: "cor",
                  name: "Cornish Tin Mines",
                  from: 1800,
                  far: !1,
                  kinds: ["shaft", "drift"],
                  hz: "rock",
                  dep: [
                    ["tin", 35],
                    ["copper", 20],
                    ["stone", 45],
                  ],
                },
                {
                  k: "der",
                  name: "Derbyshire Caverns",
                  from: 1800,
                  far: !1,
                  kinds: ["cave"],
                  hz: "cave",
                  dep: [
                    ["lead", 30],
                    ["limestone", 20],
                    ["amethyst", 4],
                    ["stone", 46],
                  ],
                },
                {
                  k: "cum",
                  name: "Borrowdale Graphite, Cumberland",
                  from: 1800,
                  far: !1,
                  kinds: ["drift", "cave"],
                  hz: "rock",
                  dep: [
                    ["graphite", 30],
                    ["quartz", 10],
                    ["stone", 60],
                  ],
                },
                {
                  k: "dol",
                  name: "Dolgellau Gold Belt, Wales",
                  from: 1844,
                  far: !0,
                  kinds: ["drift", "placer"],
                  hz: "rock",
                  dep: [
                    ["gold", 10],
                    ["placer", 6],
                    ["quartz", 20],
                    ["stone", 64],
                  ],
                },
                {
                  k: "kil",
                  name: "Kildonan Burn, Scotland",
                  from: 1869,
                  far: !0,
                  kinds: ["placer"],
                  hz: "cave",
                  dep: [
                    ["placer", 15],
                    ["stone", 85],
                  ],
                },
                {
                  k: "wic",
                  name: "Wicklow Mountains, Ireland",
                  from: 1800,
                  far: !0,
                  kinds: ["placer", "drift"],
                  hz: "rock",
                  dep: [
                    ["placer", 8],
                    ["copper", 15],
                    ["lead", 10],
                    ["stone", 67],
                  ],
                },
                {
                  k: "dur",
                  name: "Durham Coalfield",
                  from: 1800,
                  far: !0,
                  kinds: ["shaft"],
                  hz: "coal",
                  dep: [
                    ["coal", 75],
                    ["stone", 25],
                  ],
                },
              ],
        regionOf = (e) => MINE_REGIONS().find((t) => t.k === e) || MINE_REGIONS()[0],
        regionsOpen = () => MINE_REGIONS().filter((e) => yearNow() >= e.from),
        CAVE_IMG = { cave: [0, 1, 7, 9], drift: [3, 4, 6, 10], shaft: [3, 6, 10], placer: [2, 5, 8] },
        CAVE_KIND = {
          cave: "Natural Cave",
          drift: "Drift Mine",
          shaft: "Mine Shaft",
          placer: "Creek Diggings",
        },
        MINE_TOOLS = [
          {
            id: "pick1",
            name: "Iron Pickaxe",
            ico: "mining/pick1.png",
            price: 1.25,
            dur: 20,
            power: 1,
            pick: !0,
            desc: "A plain iron pick. Wears out quickly in hard rock",
          },
          {
            id: "pick2",
            name: "Steel Pickaxe",
            ico: "mining/pick2.png",
            price: 2.5,
            dur: 40,
            power: 1.3,
            pick: !0,
            desc: "Tempered steel bites deeper and lasts longer",
          },
          {
            id: "pick3",
            name: "Prospector's Pick",
            ico: "mining/pick3.png",
            price: 5,
            dur: 60,
            power: 1.6,
            pick: !0,
            desc: "A balanced pick that finds more gems and rich ore",
          },
          {
            id: "shovel",
            name: "Shovel & Gold Pan",
            ico: "mining/shovel.png",
            price: 1,
            desc: "Needed to work creek gravel for gold dust",
          },
          {
            id: "drill",
            name: "Hammer & Hand Drill",
            ico: "mining/drill.png",
            price: 2,
            desc: "Drill holes for blasting charges and break hard rock",
          },
          {
            id: "rope",
            name: "Mining Rope",
            ico: "mining/rope.png",
            price: 0.75,
            desc: "Needed to climb deeper than the second level",
          },
          {
            id: "lantern",
            name: "Miner's Lantern",
            ico: "mining/lantern.png",
            price: 1.25,
            light: !0,
            desc: "An oil lantern. No more buying candles",
          },
          {
            id: "davy",
            name: "Davy Safety Lamp",
            ico: "mining/lantern2.png",
            price: 3,
            from: 1816,
            light: !0,
            desc: "Its gauze keeps firedamp from exploding in coal mines",
          },
          {
            id: "barrow",
            name: "Wheelbarrow",
            ico: "mining/barrow.png",
            price: 3,
            carry: 250,
            desc: "Carry up to 250 lb of ore out of the mine",
          },
          {
            id: "cart",
            name: "Ore Cart",
            ico: "mining/cart.png",
            price: 20,
            carry: 800,
            desc: "Carry up to 800 lb of ore out of the mine",
          },
        ],
        MINE_SUPPLY = () => [
          {
            id: "candles",
            name: "Box of Candles",
            ico: "mining/candle.png",
            price: 0.2,
            n: 12,
            desc: "One candle lights one trip underground",
          },
          yearNow() >= 1867
            ? {
                id: "charges",
                name: "Box of Dynamite",
                ico: "mining/dynamite.png",
                price: 3,
                n: 10,
                desc: "10 sticks. Needs a hammer and drill",
              }
            : {
                id: "charges",
                name: "Keg of Black Powder",
                ico: "mining/dynamite.png",
                price: 1.5,
                n: 10,
                desc: "10 blasting charges. Needs a hammer and drill",
              },
        ],
        MINE_TRIPS = 6,
        mineSt = () =>
          (state.mine ||= { picks: [], tools: [], candles: 0, charges: 0, skill: 0, dust: 0, caves: [] }),
        hasMTool = (e) => mineSt().tools.includes(e),
        bestPick = () =>
          mineSt()
            .picks.filter((e) => e.dur > 0)
            .map((e) => ({ ...MINE_TOOLS.find((t) => t.id === e.id), p: e }))
            .sort((e, t) => t.power - e.power)[0] || null,
        hasPick = () => !!bestPick(),
        mineCarry = () =>
          Math.max(100, ...MINE_TOOLS.filter((e) => e.carry && hasMTool(e.id)).map((e) => e.carry)),
        chargeName = (e) =>
          `${yearNow() >= 1867 ? "stick" : "charge"}${1 === e ? "" : "s"} of ${yearNow() >= 1867 ? "dynamite" : "black powder"}`,
        isMinerJob = () => isOldEra() && state.job && /^(Cave|Coal) Miner$/.test(state.job.t),
        mineTripsLeft = () => {
          const e = mineSt();
          return (
            (e.trip && e.trip.age === state.age) || (e.trip = { age: state.age, n: 0 }),
            6 + (isMinerJob() ? 4 : 0) - e.trip.n
          );
        },
        oreCash = (e) =>
          e <= 0
            ? 0
            : isOldEra()
              ? Math.max(0.01, eraCash(e))
              : Math.max(1, Math.round(e * (PRICE_LVL[state.country] || 1))),
        oreAge = (e) => Math.max(0, yearNow() - (e.at || yearNow())),
        oreGrowth = (e) => Math.min(6, Math.pow(1.02, oreAge(e))),
        oreTrue = (e) => {
          const t = MINERALS[e.m],
            a = yearNow(),
            o = priceAt(ORE_PRICE["placer" === e.m ? "gold" : e.m], a);
          return "gem" === t.cls
            ? e.amt * o * GEM_MULT[e.g] * (e.cut ? 4 : 1)
            : "bulk" === t.cls
              ? e.amt * ("ton" === t.unit ? o / 2e3 : o) * BULK_MULT[e.g]
              : e.bar
                ? e.amt * ("ton" === t.unit ? o / 2e3 : o)
                : "placer" === t.cls
                  ? 0.85 * e.amt * o
                  : e.amt * e.c * ("ton" === t.unit ? o / 2e3 : o);
        },
        oreGuess = (e) => {
          const t = MINERALS[e.m];
          if ("metal" !== t.cls || e.bar || e.assayed) return oreTrue(e);
          const a = priceAt(ORE_PRICE[e.m], yearNow()) / ("ton" === t.unit ? 2e3 : 1);
          return ((e.amt * (t.content[0] + t.content[1])) / 2) * 0.45 * a;
        },
        oreName = (e) => {
          const t = MINERALS[e.m];
          return e.bar
            ? t.barName
            : "gem" === t.cls && e.cut
              ? `Cut ${t.name.replace(/^Rough /, "")}`
              : t.name;
        },
        oreIco = (e) => (e.bar ? MINERALS[e.m].bar : MINERALS[e.m].ico),
        oreAmt = (e) => {
          const t = MINERALS[e.m];
          return "gem" === t.cls
            ? +e.amt.toFixed(2) + " carats"
            : "placer" !== t.cls || e.bar
              ? e.amt >= 2e3
                ? +(e.amt / 2e3).toFixed(1) + " tons"
                : e.bar && "oz" === t.unit
                  ? `${e.amt.toFixed(2)} oz`
                  : `${Math.round(e.amt)} lb`
              : `${e.amt.toFixed(2)} oz`;
        },
        oreQual = (e) => {
          const t = MINERALS[e.m];
          return "gem" === t.cls
            ? `${GEM_GRADE[e.g]}${e.cut ? ", cut" : ", uncut"}`
            : e.bar
              ? "Refined"
              : "placer" === t.cls
                ? "Raw gold dust"
                : "metal" !== t.cls || e.assayed
                  ? ORE_GRADE[e.g]
                  : "Not assayed";
        },
        ORE_BUYERS = (e) => {
          const t = MINERALS[e.m],
            a = "us" === state.country;
          if ("gem" === t.cls)
            return [
              ["Jeweler", e.cut ? 0.85 : 0.55],
              ...(state.age >= 18 ? [["Gem Dealer", e.cut ? 0.95 : 0.7]] : []),
              ["Pawnbroker", 0.35],
            ];
          if ("placer" === t.cls && !e.bar)
            return [
              ["General Store", 0.78],
              ["Assay Office", 0.92],
            ];
          if (e.bar)
            return /gold|silver|placer/.test(e.m)
              ? [
                  [a ? "U.S. Mint" : "Bank of England", 0.98],
                  ["Metal Merchant", 0.9],
                ]
              : [
                  ["Foundry", 0.92],
                  ["Metal Merchant", 0.85],
                ];
          if ("metal" === t.cls)
            return e.assayed
              ? [
                  ["Mining Company", 0.6],
                  ["Ore Buyer", 0.45],
                ]
              : [["Ore Buyer", 0.35]];
          return [
            [
              {
                coal: "Coal Yard",
                iron: "Ironworks",
                graphite: "Pencil Maker",
                sulfur: "Chemist",
                quartz: "Curiosity Shop",
                limestone: "Lime Kiln",
                marble: "Stonemason",
                obsidian: "Curiosity Shop",
              }[e.m] || "Merchant",
              0.85,
            ],
            ["Village Market", 0.5],
          ];
        },
        oreSale = (e, t) => oreCash(oreTrue(e) * t * oreGrowth(e)),
        oreWorth = (e) => oreCash(oreGuess(e) * oreGrowth(e)),
        pickDeposit = (e, t, a = {}) => {
          const o = /gold|placer|silver|diamond|ruby|sapphire|emerald/;
          return eraRoll(
            e.dep.map(([e, n]) => [
              "stone" === e
                ? n * (1 - 0.1 * (t - 1))
                : n * (o.test(e) ? 1 + 0.3 * (t - 1) : 1) * (a[MINERALS[e].cls] || 1),
              e,
            ]),
          )[1];
        },
        makeOre = (e, t, a, o = 1) => {
          const n = MINERALS[e];
          let s = Math.max(0, Math.min(4, Math.floor(3 * Math.random() + 0.35 * t + 0.5 * a - 0.6)));
          4 === s && chance(0.5) && (s = 3);
          const r = n.amt[0] + Math.random() * (n.amt[1] - n.amt[0]),
            i = {
              m: e,
              amt:
                "gem" === n.cls || "placer" === n.cls
                  ? Math.round(r * a * o * 100) / 100
                  : Math.max(1, Math.round(r * a * o)),
              g: s,
              at: yearNow(),
            };
          return (
            "metal" === n.cls &&
              ((i.c =
                n.content[0] + (n.content[1] - n.content[0]) * GRADE_FRAC[s] * (0.8 + 0.4 * Math.random())),
              (i.assayed = !1)),
            i
          );
        },
        oreLbs = (e) => {
          const t = MINERALS[e.m];
          return "gem" === t.cls ? 0 : "placer" === t.cls ? e.amt / 14.6 : e.amt;
        },
        newCave = (e) => {
          const t = pickR(e.kinds),
            a =
              "placer" === t
                ? ["Creek", "Gulch", "Bar", "Run", "Bend"]
                : "cave" === t
                  ? ["Cave", "Cavern", "Hollow", "Hole"]
                  : "shaft" === t
                    ? ["Shaft", "Mine", "Diggings"]
                    : ["Drift", "Tunnel", "Mine", "Adit"];
          return {
            id: rint(1, 1e9),
            name: `${pickR(["Lost Man's", "Rattlesnake", "Widow's", "Hidden", "Devil's", "Eagle", "Lucky", "Black", "Bonanza", "Old Man's", "Hangman", "Whiskey", "Bear", "Thunder", "Raven", "Moonlight", "Copperhead", "Dead Mule"])} ${pickR(a)}`,
            reg: e.k,
            kind: t,
            img: `mining/cave${pickR(CAVE_IMG[t])}.png`,
            depth: "placer" === t ? 2 : rint(2, 5),
            rich: Math.round(100 * (0.6 + 0.9 * Math.random())) / 100,
            left: 100,
            workers: 0,
            claim: !1,
          };
        },
        caveSigns = (e) =>
          regionOf(e.reg)
            .dep.filter(([e]) => "stone" !== e)
            .sort((e, t) => t[1] - e[1])
            .slice(0, 2)
            .map(([e]) => MINERALS[e].name.toLowerCase()),
        claimCost = (e) =>
          eraCash(Math.round((10 + 40 * e.rich + 6 * e.depth) * Math.max(0.1, e.left / 100))),
        workerWage = () => eraCash(300),
        mineScene = (e) => `<img class="mine-scene" src="${e.img}" alt="">`;
