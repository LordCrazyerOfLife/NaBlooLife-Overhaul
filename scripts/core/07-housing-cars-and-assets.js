      function makeListing([e, t, a, o, n], s) {
        const r = n && Math.random() < 0.1,
          i = HOUSE_CLASSES.find((e) => a <= e.max),
          l = a * (0.75 + 0.5 * Math.random()) * (r ? n : 1) * (s ? 0.7 : 1),
          c = Math.round(
            l < i.min
              ? i.min * (1 + 0.35 * Math.random())
              : l > i.max
                ? i.max * (0.75 + 0.25 * Math.random())
                : l,
          ),
          d = goodsLvl("house"),
          u = Math.max(100, Math.round((c * d) / (d < 0.3 ? 10 : 100)) * (d < 0.3 ? 10 : 100));
        return {
          sprite: s ? e + "-haunted" : e,
          name: s ? "Haunted " + t : t,
          price: u,
          tier: c,
          addr: `${rint(100, 4999)} ${pickR(HOUSE_STREETS)}`,
          br: o,
          ba: Math.max(1, o - rint(0, 2)),
          built: rint(1, 120),
          cond: s ? rint(15, 60) : rint(35, 100),
          expense: Math.round(9e-4 * u),
          mortgage: mortgageMonthly(u),
        };
      }
      const hauntedSet = new Set([
          "house1",
          "house2",
          "house4",
          "house5",
          "house6",
          "house9",
          "house10",
          "house12",
          "house13",
          "house14",
          "house15",
          "house16",
          "house17",
          "house20",
          "house21",
          "house22",
          "house23",
          "house25",
          "house27",
          "vampire-castle",
        ]),
        HOUSES_1800 = [
          [0, "Greek Revival Mansion", 4e4, 9, 1800],
          [1, "Victorian Mansion", 35e3, 8, 1870],
          [2, "Federal Brick Townhouse", 12e3, 5, 1800],
          [3, "Plantation House", 3e4, 8, 1800],
          [4, "Georgian Brick House", 15e3, 6, 1800],
          [5, "Colonial Farmhouse", 3500, 5, 1800],
          [6, "Painted Clapboard House", 2500, 4, 1800],
          [7, "Town House with Dormers", 4e3, 5, 1800],
          [8, "Farmhouse with Porch", 1800, 4, 1800],
          [9, "Stone Cottage", 1200, 3, 1800],
          [10, "Two-Story Cottage", 1500, 3, 1800],
          [11, "Clapboard Cottage", 800, 2, 1800],
          [12, "Small Frame House", 600, 2, 1800],
          [13, "Log Cabin", 250, 2, 1800],
          [14, "Thatched Cottage", 300, 2, 1800],
          [15, "Tin-Roof Shack", 120, 1, 1800],
          [16, "Mud-Brick Hut", 60, 1, 1800],
          [17, "Fieldstone Shack", 150, 1, 1800],
          [18, "Ramshackle Shed", 40, 1, 1800],
          [19, "Lean-To Shelter", 10, 1, 1800],
        ],
        OLD_STREETS = [
          "Main Street",
          "Church Street",
          "Mill Road",
          "Market Street",
          "High Street",
          "River Road",
          "Elm Street",
          "Bridge Street",
          "Water Street",
          "Front Street",
          "Orchard Lane",
          "Turnpike Road",
          "Chestnut Street",
          "Broad Street",
          "Union Street",
          "Meeting House Lane",
        ],
        OLD_RURAL = [
          "the county road",
          "the creek bank",
          "the edge of town",
          "the old mill pond",
          "the wagon trail",
          "the hollow",
        ],
        hRound = (e) => (isOldEra() ? (e < 20 ? cents(e) : Math.round(e)) : 1e3 * Math.round(e / 1e3) || 1e3),
        HOME_MARKET = [
          [1869, 1.5],
          [1872, 2],
          [1878, -2],
          [1892, 1.5],
          [1896, -1.5],
          [1915, 2],
          [1925, 5],
          [1928, 2],
          [1933, -6],
          [1945, 3],
          [1970, 5],
          [1980, 9],
          [1989, 6],
          [1996, 2],
          [2006, 7],
          [2011, -6],
          [2021, 6],
          [9999, 4],
        ],
        homePrem = (e) =>
          Math.round(
            100 *
              (e >= 9e3
                ? 0.5 + 0.7 * Math.random()
                : e >= 500
                  ? 0.4 * Math.random()
                  : 0.8 * Math.random() - 0.8),
          ) / 100,
        oldHomeGrow = (e) => {
          const t = state.birthYear + state.age,
            a = HOME_MARKET.find(([e]) => t <= e)[1];
          null == e.prem && (e.prem = homePrem(e.tier || 1e3));
          const o = e.price * (1 + (a + e.prem + (4 * Math.random() - 2)) / 100);
          return Math.max(0.5, o < 20 ? cents(o) : Math.round(o));
        },
        homeIndex = (e) => {
          let t = 1;
          for (let a = Math.min(e, 1860); a < 1860; a++) t /= 1.015;
          for (let a = 1861; a <= e; a++) t *= 1 + HOME_MARKET.find(([e]) => a <= e)[1] / 100;
          return t;
        },
        HOUSE_1800_TO = {
          "Plantation House": 1865,
          "Greek Revival Mansion": 1920,
          "Federal Brick Townhouse": 1915,
          "Georgian Brick House": 1915,
          "Thatched Cottage": 1915,
          "Log Cabin": 1930,
          "Mud-Brick Hut": 1925,
          "Fieldstone Shack": 1930,
          "Lean-To Shelter": 1935,
          "Town House with Dormers": 1935,
          "Victorian Mansion": 1935,
          "Colonial Farmhouse": 1940,
          "Two-Story Cottage": 1940,
          "Clapboard Cottage": 1940,
          "Painted Clapboard House": 1945,
          "Stone Cottage": 1950,
          "Farmhouse with Porch": 1950,
          "Small Frame House": 1950,
          "Tin-Roof Shack": 1955,
          "Ramshackle Shed": 1955,
        };
      HOUSES_1800.forEach((e) => {
        (e[5] = HOUSE_1800_TO[e[1]] || 1950), (e[6] = "houses1800");
      });
      const HOUSES_1900 = [
        ["Ramshackle Shanty", 70, 1],
        ["Plank Shack", 140, 1],
        ["Worker's Cottage", 350, 2],
        ["Whitewashed Cottage", 600, 2],
        ["Brick Cottage", 900, 2],
        ["Porch Bungalow", 1200, 2],
        ["Craftsman Bungalow", 1500, 3],
        ["Gabled Bungalow", 1800, 3],
        ["Queen Anne Rowhouse", 2300, 3],
        ["Mission-Style House", 2700, 3],
        ["Farmhouse with Veranda", 3100, 3],
        ["American Foursquare", 3600, 4],
        ["Colonial Revival House", 4200, 4],
        ["Brick Queen Anne", 5e3, 4],
        ["Stone Foursquare", 5800, 4],
        ["Brick Colonial Revival", 6800, 5],
        ["Shingle-Style Victorian", 8e3, 5],
        ["Tudor Revival", 9500, 5],
        ["Gothic Revival Stone House", 11e3, 5],
        ["Spanish Revival Villa", 13e3, 5],
        ["Queen Anne Mansion", 16e3, 6],
        ["Stone Gothic Manor", 19e3, 7],
        ["Greek Revival Mansion", 23e3, 7],
        ["Beaux-Arts Mansion", 28e3, 8],
        ["Georgian Revival Mansion", 33e3, 8],
        ["Mediterranean Villa", 4e4, 8],
        ["Chateau Mansion", 5e4, 10],
        ["Second Empire Estate", 6e4, 10],
        ["Art Deco Mansion", 75e3, 9],
        ["Gilded Age Estate", 9e4, 12],
      ].map(([e, t, a], o) => [
        o,
        e,
        t,
        a,
        "Art Deco Mansion" === e
          ? 1925
          : "Mission-Style House" === e || "Spanish Revival Villa" === e
            ? 1905
            : 1900,
        9999,
        "houses1900",
      ]);
      let houses1900Ready = !1;
      {
        const L = new Image();
        (L.onload = () => {
          houses1900Ready = !0;
        }),
          (L.src = "houses1900/house0.png");
      }
      const houseWeight = (e) => {
          const t = state.birthYear + state.age;
          return t < e[4] || t > e[5]
            ? 0
            : Math.min(1, (t - e[4] + 1) / 8) * Math.min(1, (e[5] - t + 1) / 12);
        },
        pickOldHouse = () => {
          const e = [...HOUSES_1800, ...(houses1900Ready ? HOUSES_1900 : [])]
            .map((e) => [e, houseWeight(e)])
            .filter(([, e]) => e > 0);
          if (!e.length) return HOUSES_1800[18];
          let t = Math.random() * e.reduce((e, [, t]) => e + t, 0);
          return (e.find(([, e]) => (t -= e) <= 0) || e[0])[0];
        };
      function makeListing1800([e, t, a, o, , , n = "houses1800"]) {
        const s = state.birthYear + state.age,
          r = homePrem(a),
          i = Math.round(a * (0.75 + 0.5 * Math.random())),
          l = a < 200,
          c = Math.max(0.5, eraCash(i * homeIndex(s) * Math.pow(1 + r / 100, Math.max(0, s - 1860)))),
          d = 0.005,
          u = cents((0.8 * c * d * (1 + d) ** 360) / ((1 + d) ** 360 - 1));
        return {
          sprite: `../${n}/house${e}`,
          name: t,
          price: c,
          tier: i,
          old: !0,
          prem: r,
          addr: l ? `Out by ${pickR(OLD_RURAL)}` : `${rint(1, 300)} ${pickR(OLD_STREETS)}`,
          br: o,
          ba: a >= 1e4 ? rint(1, 2) : 0,
          built: rint(1, a >= 1e4 ? 60 : 40),
          cond: l ? rint(10, 55) : rint(35, 100),
          expense: cents(Math.max(0.01, 8e-4 * c)),
          mortgage: u,
        };
      }
      const newListings = () =>
        isOldEra()
          ? Array.from({ length: 60 }, () => makeListing1800(pickOldHouse()))
          : Array.from({ length: 200 }, () => {
              const e = pickR(HOUSES);
              return makeListing(e, hauntedSet.has(e[0]) && Math.random() < 0.2);
            });
      (state.listings = newListings()),
        (window.HOME_KIT = {
          makeListing: makeListing,
          HOUSES: () => HOUSES,
          giftCar: (...e) => giftCar(...e),
          carValue: (e) => carValue(e),
          propValue: (e) => Math.round(e.price * (0.8 + e.cond / 250)),
        }),
        document.getElementById("ageBtn").addEventListener("click", () => {
          state.dead || (state.listings = newListings());
        }),
        document.getElementById("ageBtn").addEventListener("click", () => {
          const e = state.birthYear + state.age;
          if (state.dead || !isOldEra() || e < 1900 || state.newCentury) return;
          state.newCentury = !0;
          const t = (t) => usd(eraCash(t * homeIndex(e) * Math.pow(1.006, e - 1860))),
            a = (state.props || []).filter((e) => e.old && !e.royal);
          say("The twentieth century has arrived. Smokestacks and electric lights are changing the world."),
            queuePopup(() =>
              jCard({
                tag: "A New Century",
                iconSrc: "freelife/apple/1f3d9-fe0f.png",
                title: `${e}`,
                lead: "The twentieth century has arrived. Smokestacks crowd the skyline, streetcars rattle down the avenues and the first motorcars sputter past the horses. Land and houses cost more than ever.",
                rows: [
                  ["Cottage", t(1500)],
                  ["Town House", t(4e3)],
                  ["Brick House", t(15e3)],
                  ["Mansion", t(4e4)],
                  ...(a.length
                    ? [
                        [
                          "Your Home" + (a.length > 1 ? "s" : ""),
                          `worth ${usd(cents(a.reduce((e, t) => e + t.price, 0)))}`,
                        ],
                      ]
                    : []),
                ],
                ok: () => {},
              }),
            );
        });
      const BROKERS = [
          ["Budget Homes Realty", "1f3e0", (e) => (e.tier ?? e.price) < 15e4],
          ["Sunbeam Realtors", "1f3e1", (e) => (e.tier ?? e.price) >= 15e4 && (e.tier ?? e.price) < 1e6],
          ["Shamrock Luxury Estates", "1f3f0", (e) => (e.tier ?? e.price) >= 1e6],
        ],
        OLD_BROKERS = [
          ["County Land Office", "1f3da-fe0f", (e) => e.tier < 500],
          ["Town Land Agent", "1f3e0", (e) => e.tier >= 500 && e.tier < 5e3],
          ["Gentlemen's Estate Agent", "1f3db-fe0f", (e) => e.tier >= 5e3],
        ],
        brokers = () => (isOldEra() ? OLD_BROKERS : BROKERS),
        brokerSub = (e) =>
          (isOldEra()
            ? [
                "Shacks, huts and log cabins",
                "Cottages, farmhouses and town houses",
                "Brick houses and grand mansions",
              ]
            : ["Shop for affordable homes", "Shop for family homes", "Shop for luxury properties"])[e],
        greyRow = (e, t, a) =>
          `<div class="row dis"><img src="emoji/${e}.png"><div class="t"><b>${t}</b><span>${a}</span></div></div>`,
        houseRowImg = (e) => `<img src="houses/${e.sprite}.png" alt="">`;
      function openAssets2018() {
        syncProfile(),
          (sTitle.textContent = "ASSETS"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = X_ICON),
          (sBack.onclick = () => screen.classList.remove("open")),
          (sList.innerHTML = `<div class="row" data-a18="cars"><img src="2018/emoji/1f698.png"><div class="t"><b>Cars</b><span>View your cars</span></div>${CHEV}</div><div class="row" data-a18="homes"><img src="emoji/1f3e1.png"><div class="t"><b>Real Estate</b><span>View your real estate</span></div>${CHEV}</div>`),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-a18]").forEach(
            (e) =>
              (e.onclick = () => {
                const t = "cars" === e.dataset.a18;
                (sTitle.textContent = t ? "CARS" : "REAL ESTATE"),
                  (sBack.innerHTML = BACK_ICON),
                  (sBack.onclick = openAssets2018),
                  (sList.innerHTML = t
                    ? (state.cars.length
                        ? '<div class="sec">Your Cars</div>' +
                          state.cars
                            .map(
                              (e, t) =>
                                `<div class="row" data-car="${t}"><img src="${carImg(e)}"><div class="t"><b>${e.make} ${e.model}</b><span>${e.color} ${CAR_TYPE_NAME[e.type]}</span></div>${CHEV}</div>`,
                            )
                            .join("")
                        : "") +
                      '<div class="sec">Car Dealers</div>' +
                      state.carDealers
                        .map(
                          (e, t) =>
                            `<div class="row" data-dealer="${t}"><img src="cars/${e.icon}.png"><div class="t"><b>${e.name}</b><span>${e.brand ? "Official dealership" : "Shop for cars"}</span></div>${CHEV}</div>`,
                        )
                        .join("") +
                      (isOldEra()
                        ? ""
                        : `<div class="sec">Luxury Car Dealers</div><div class="row" data-dealer="lux"><img src="dealers/rolls-royce.png"><div class="t"><b>${luxuryDealer().name}</b><span>Shop for luxury and exotic cars</span></div>${CHEV}</div>`)
                    : (state.props.length
                        ? '<div class="sec">Your Real Estate</div>' +
                          state.props
                            .map(
                              (e, t) =>
                                `<div class="row" data-own="${t}">${houseRowImg(e)}<div class="t"><b>${e.name}</b><span>${e.addr}</span></div>${CHEV}</div>`,
                            )
                            .join("")
                        : "") +
                      '<div class="sec">Real Estate Brokers</div>' +
                      brokers()
                        .map(
                          ([e, t], a) =>
                            `<div class="row" data-broker="${a}"><img src="emoji/${t}.png"><div class="t"><b>${e}</b><span>${brokerSub(a)}</span></div>${CHEV}</div>`,
                        )
                        .join("")),
                  (sList.scrollTop = 0),
                  sList
                    .querySelectorAll("[data-car]")
                    .forEach((e) => (e.onclick = () => openCar(state.cars[+e.dataset.car]))),
                  sList
                    .querySelectorAll("[data-dealer]")
                    .forEach(
                      (e) =>
                        (e.onclick = () =>
                          openDealer("lux" === e.dataset.dealer ? "lux" : +e.dataset.dealer)),
                    ),
                  sList
                    .querySelectorAll("[data-own]")
                    .forEach((e) => (e.onclick = () => propertyCard(state.props[+e.dataset.own], !0))),
                  sList
                    .querySelectorAll("[data-broker]")
                    .forEach((e) => (e.onclick = () => openBroker(+e.dataset.broker)));
              }),
          ),
          screen.classList.add("open");
      }
      function openAssets() {
        if (document.querySelector(".phone").classList.contains("y2018")) return openAssets2018();
        syncProfile(),
          (sTitle.textContent = "ASSETS"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = X_ICON),
          (sBack.onclick = () => screen.classList.remove("open"));
        const e = state.props.length
            ? (isOldEra()
                ? ""
                : '<div class="row" data-soon="Landlord"><img src="houses/house3.png"><div class="t"><b>Landlord</b><span>Manage tenants, unlock exclusive homes, and more!</span></div><img class="seal" src="cars/ui-tableLandlordSeal.png" alt=""></div>') +
              `<div class="row" id="propsRow">${houseRowImg(state.props[0])}<div class="t"><b>Properties</b><span>Manage your properties</span></div>${CHEV}</div>`
            : "",
          t = (e, t, a, o) =>
            `<div class="row" data-soon="${t}"><img src="${e}"><div class="t"><b>${t}</b><span>${a}</span></div><img class="seal" src="cars/ui-${o}.png" alt=""></div>`,
          a = (isOldEra() && state.birthYear + state.age < 1901 ? [] : state.cars)
            .map(
              (e, t) =>
                `<div class="row" data-car="${t}"><img src="${carImg(e)}"><div class="t"><b>${e.make} ${e.model} <em>(${CAR_TYPE_NAME[e.type]})</em></b><div class="rel">Condition <i><u style="width:${Math.max(2, e.cond)}%;background:${barCol(e.cond)}"></u></i></div></div>${CHEV}</div>`,
            )
            .join(""),
          o = !(!window.SETTINGS_UI || !SETTINGS_UI.settings.bitlifeMode);
        sList.innerHTML =
          (bankOpen()
            ? `<div class="row" id="assetBank">${bankLogo(bankFile(bankFor()))}<div class="t"><b>Bank</b><span>${bankFor()} · ${isOldEra() ? `passbook savings of ${usd(state.money)}` : "your paychecks and purchases"}</span></div>${CHEV}</div>`
            : `<div class="row" id="assetBank"><img src="emoji/1f3e6.png"><div class="t"><b>Bank</b><span>${state.age < 13 ? "No account yet · apply when you turn 13" : "No account yet · apply for one"}</span></div>${CHEV}</div>`) +
          (isOldEra()
            ? ""
            : `<div class="row" id="assetPay"><img src="emoji/1f4b3.png"><div class="t"><b>Payment Apps</b><span>PayPal, Venmo, Cash App and more</span></div>${CHEV}</div>`) +
          (o
            ? t("cars/ui-race-car.png", "Race Car Garage", "Purchase a race car garage", "tableRacingSeal") +
              t("cars/ui-lion.png", "Zoo", "Purchase a zoo", "tableZooSeal") +
              '<div class="sec">Collectibles</div>' +
              t("emoji/1f392.png", "Belongings", "View your possessions", "tableBlackmarketSeal")
            : "") +
          (e ? '<div class="sec">Real Estate</div>' + e : "") +
          (a ? '<div class="sec">Vehicles</div>' + a : "") +
          (state.paintings.length
            ? '<div class="sec">Art</div>' +
              state.paintings
                .map(
                  (e, t) =>
                    `<div class="row" data-art="${t}"><img src="${artImg(e)}"><div class="t"><b>"${e.title}" <em>(${e.medium} ${e.subject})</em></b><div class="rel">Quality <i><u style="width:${Math.max(2, e.quality)}%;background:${barCol(e.quality)}"></u></i></div></div>${CHEV}</div>`,
                )
                .join("")
            : "") +
          ((state.heirlooms ||= []).length
            ? '<div class="sec">Heirlooms</div>' +
              state.heirlooms
                .map(
                  (e, t) =>
                    `<div class="row" data-heir="${t}"><img src="${hlImg(e.sprite)}"><div class="t"><b>${e.name[0].toUpperCase() + e.name.slice(1)}</b><span>${HL_RARITY[e.rarity][0].toUpperCase() + HL_RARITY[e.rarity].slice(1)} · worth ${usd(e.value)}</span></div>${DOTS}</div>`,
                )
                .join("")
            : "") +
          ((mods.showMedals || mods.militaryExpanded || state.medals.some((e) => e.vet)) &&
          state.medals.length
            ? '<div class="sec">Medals</div>' +
              state.medals
                .map(
                  (e, t) =>
                    `<div class="row" data-medal="${t}"><img src="mil/${e.ico}.png"><div class="t"><b>${e.name}</b><span>${e.branch} · earned at age ${e.age}</span></div>${DOTS}</div>`,
                )
                .join("")
            : "") +
          (mods.familyTree
            ? `<div class="sec">Family</div><div class="row" id="ftRow"><img src="emoji/1f333.png"><div class="t"><b>View Family Tree</b><span>Your bloodline, back to your great-great-great-grandparents</span></div>${CHEV}</div>`
            : "") +
          pantryRows() +
          horseRows() +
          farmRows() +
          bizRows() +
          killRows() +
          mineRows() +
          logRows() +
          metalRows() +
          (isOldEra()
            ? ""
            : '<div class="sec">Misc.</div>' +
              emailAssetRow() +
              `<div class="row" id="assetSocial"><img src="cars/ui-users.png"><div class="t"><b>Social Media</b><span>Manage your online identity</span></div>${CHEV}</div>` +
              `<div class="row" id="assetGaming"><img class="cyc" data-cat="gaming" src="${socIcon("steam")}"><div class="t"><b>Gaming Platforms</b><span>Manage your gaming accounts</span></div>${CHEV}</div>` +
              `<div class="row" id="assetSubs"><img class="cyc" data-cat="subs" src="${socIcon("netflix")}"><div class="t"><b>Subscription Services</b><span>Manage your streaming subscriptions</span></div>${CHEV}</div>`) +
          '<div class="shopbtn" id="goShop"><img src="cars/ui-shopping-bags.png" alt=""><span>Go Shopping...</span></div>';
        const n = document.getElementById("propsRow");
        n && (n.onclick = openProperties),
          (document.getElementById("assetBank").onclick = () => {
            play("choice"), openBank();
          }),
          isOldEra() ||
            (document.getElementById("assetEmail").onclick = () => {
              play("choice"), openEmail();
            }),
          isOldEra() ||
            (document.getElementById("assetPay").onclick = () => {
              play("choice"), openPayApps();
            }),
          sList.querySelectorAll("[data-car]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), openCar(state.cars[+e.dataset.car]);
              }),
          ),
          sList
            .querySelectorAll("[data-art]")
            .forEach((e) => (e.onclick = () => artCard(state.paintings[+e.dataset.art], openAssets))),
          sList
            .querySelectorAll("[data-medal]")
            .forEach((e) => (e.onclick = () => medalCard(state.medals[+e.dataset.medal]))),
          sList.querySelectorAll("[data-heir]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), openHeirloomScreen(state.heirlooms[+e.dataset.heir]);
              }),
          ),
          sList.querySelectorAll("[data-pantry]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), pantryCard(e.dataset.pantry);
              }),
          ),
          sList.querySelectorAll("[data-kill]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), killCard(+e.dataset.kill);
              }),
          ),
          sList.querySelectorAll("[data-ore]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), oreCard(+e.dataset.ore);
              }),
          ),
          sList.querySelectorAll("[data-metals]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), openMetals(openAssets);
              }),
          ),
          sList.querySelectorAll("[data-log]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), logCard(+e.dataset.log);
              }),
          ),
          sList.querySelectorAll("[data-bizrow]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), (bizBack = openAssets), openBizDetail(state.biz[+e.dataset.bizrow]);
              }),
          ),
          sList.querySelectorAll("[data-patrow]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), openInventing(), (sBack.onclick = openAssets);
              }),
          ),
          sList.querySelectorAll("[data-farmrow]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), openFarm(), (sBack.onclick = openAssets);
              }),
          ),
          sList.querySelectorAll("[data-claim]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), claimCard(state.mine.caves[+e.dataset.claim]);
              }),
          ),
          sList.querySelectorAll("[data-horse]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), horseCard(+e.dataset.horse);
              }),
          ),
          sList.querySelectorAll("[data-soon]").forEach((e) => (e.onclick = () => comingSoon())),
          (document.getElementById("goShop").onclick = () => {
            play("choice"), withLoading(() => openShopping("assets"));
          }),
          isOldEra() ||
            ((document.getElementById("assetSocial").onclick = () => {
              play("choice"), openSocial(openAssets);
            }),
            (document.getElementById("assetGaming").onclick = () => {
              play("choice"), openSocial(openAssets, "gaming");
            }),
            (document.getElementById("assetSubs").onclick = () => {
              play("choice"), openSocial(openAssets, "subs");
            })),
          cycleCatIcons();
        const s = document.getElementById("ftRow");
        s &&
          (s.onclick = () => {
            play("toList"), openFamilyTree();
          });
        const r = (e) => Math.min(...SOCIALS.filter((t) => socCat(t[0]) === e).map((e) => e[5] || 0)),
          i = (e) =>
            Object.keys(state.social || {}).some((t) => socCat(t) === e && !state.social[t].stranger),
          l = [
            ["assetBank", 13, !1],
            ["assetPay", Math.min(...PAY_APPS.map((e) => e.age)), Object.keys(state.payApps || {}).length],
            ["assetEmail", Math.min(r("social"), r("gaming"), r("subs")), (state.emails || []).length],
            ["assetSocial", r("social"), i("social")],
            ["assetGaming", r("gaming"), i("gaming")],
            ["assetSubs", r("subs"), i("subs")],
          ];
        for (const [e, t, a] of l)
          state.age < t && !a && document.getElementById(e) && lockAssetRow(document.getElementById(e));
        screen.classList.add("open");
      }
      function lockAssetRow(e) {
        e && (e.classList.add("dis", "alock"), (e.onclick = null), e.querySelector(".chev")?.remove());
      }
      window.lockAssetRow = lockAssetRow;
      let shopFromActs = !1;
      function openShopping(e) {
        "string" == typeof e && (shopFromActs = "acts" === e),
          (sTitle.textContent = "SHOPPING"),
          shopFromActs
            ? ((sBack.innerHTML = X_ICON), (sBack.onclick = () => screen.classList.remove("open")))
            : ((sBack.innerHTML = BACK_ICON), (sBack.onclick = openAssets));
        const t = (e, t, a, o = CHEV, n = `data-soon="${t}"`) =>
          `<div class="row" ${n}><img src="${e}"><div class="t"><b>${t}</b><span>${a}</span></div>${o}</div>`;
        if (isOldEra())
          return (
            (sList.innerHTML =
              '<div class="sec">Houses &amp; Land</div>' +
              brokers()
                .map(([e, a], o) => t(`emoji/${a}.png`, e, brokerSub(o), CHEV, `data-broker="${o}"`))
                .join("") +
              '<div class="sec">Livestock</div>' +
              t(
                "pets/horse3c.png",
                "Horse Market",
                "Buy, ride, race and care for horses",
                CHEV,
                'data-horses="1"',
              ) +
              (carsOnSale().length
                ? '<div class="sec">Motor Car Dealers</div>' +
                  state.carDealers
                    .map((e, a) =>
                      t(`cars/${e.icon}.png`, e.name, "Shop for motor cars", CHEV, `data-dealer="${a}"`),
                    )
                    .join("")
                : "")),
            (sList.scrollTop = 0),
            sList.querySelectorAll("[data-dealer]").forEach(
              (e) =>
                (e.onclick = () => {
                  if (state.age < 16)
                    return notice("Too young", "You must be at least 16 to buy a motor car.", null, !0);
                  play("choice"), openDealer(+e.dataset.dealer);
                }),
            ),
            sList.querySelectorAll("[data-broker]").forEach(
              (e) =>
                (e.onclick = () => {
                  if (state.age < 18)
                    return notice("Too young", "You must be at least 18 to buy property.", null, !0);
                  openBroker(+e.dataset.broker);
                }),
            ),
            void (sList.querySelector("[data-horses]").onclick = () => {
              play("choice"), openHorseMarket();
            })
          );
        (sList.innerHTML =
          '<div class="sec">Bicycles</div>' +
          t("cars/ui-bicycle.png", state.shops.bike, "Shop for bicycles") +
          '<div class="sec">Car Dealers</div>' +
          (document.querySelector(".phone").classList.contains("flui")
            ? ""
            : t(
                "cars/ui-race-car.png",
                state.shops.race,
                "Shop for race cars",
                '<img class="seal" src="cars/ui-tableRacingSeal.png" alt="">',
              )) +
          state.carDealers
            .map((e, a) => t(`cars/${e.icon}.png`, e.name, e.brand ? "Official dealership" : "Shop for cars", CHEV, `data-dealer="${a}"`))
            .join("") +
          '<div class="sec">Luxury Car Dealers</div>' +
          t(
            "dealers/rolls-royce.png",
            luxuryDealer().name,
            "Shop for luxury and exotic cars",
            CHEV,
            'data-dealer="lux"',
          ) +
          '<div class="sec">Jewelers</div>' +
          t("cars/ui-diamond.png", state.shops.jewel, "Shop for jewelry") +
          t("cars/ui-diamond-black.png", state.shops.fake, "Shop for fake jewelry") +
          '<div class="sec">Music Stores</div>' +
          t("instruments/trumpet.png", state.shops.music, "Shop for instruments") +
          '<div class="sec">Real Estate Brokers</div>' +
          brokers()
            .map(
              ([e, t], a) =>
                `<div class="row" data-broker="${a}"><img src="emoji/${t}.png"><div class="t"><b>${e}</b><span>${brokerSub(a)}</span></div>${CHEV}</div>`,
            )
            .join("") +
          '<div class="sec">Specialty Vehicle Dealers</div>' +
          greyRow("1f6e9-fe0f", "Skyline Aircraft Sales", "Shop for airplanes") +
          greyRow("1f681", "Discount Aviation Dealer", "Shop for specialty aircraft") +
          greyRow("26f5", "Jones Boat Sales", "Shop for boats & more")),
          (sList.scrollTop = 0),
          sList
            .querySelectorAll("[data-broker]")
            .forEach((e) => (e.onclick = () => openBroker(+e.dataset.broker))),
          sList.querySelectorAll("[data-dealer]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), openDealer("lux" === e.dataset.dealer ? "lux" : +e.dataset.dealer);
              }),
          ),
          sList.querySelectorAll("[data-soon]").forEach((e) => (e.onclick = () => comingSoon())),
          queueMicrotask(() => {
            if ("SHOPPING" !== sTitle.textContent) return;
            const e = {
              Bicycles: 8,
              "Music Stores": 8,
              Jewelers: 16,
              "Car Dealers": 18,
              "Luxury Car Dealers": 18,
              "Real Estate Brokers": 18,
              "Specialty Vehicle Dealers": 18,
            };
            let t = 0;
            for (const a of [...sList.children])
              a.classList.contains("sec")
                ? (t = e[a.textContent.trim()] || 0)
                : a.classList.contains("row") && state.age < t && lockAssetRow(a);
          });
      }
      state.cars = [];
      const carImg = (e) => (e.sprite ? `cars/${e.sprite}.png` : `cars/${e.type}-${e.color}.png`),
        carName = (e) => `${e.make} ${e.model}`,
        carAgeWord = (e) => (0 === e.age ? "brand new" : `${e.age}-year old`),
        carDesc = (e) => `${carAgeWord(e)} ${e.color} ${carName(e)}`,
        racingClass = (e) => (e >= 15e4 ? "A" : e >= 35e3 ? "B" : e >= 2e4 ? "C" : "D"),
        modOn = (e) => {
          try {
            return !!(JSON.parse(localStorage.getItem("bitlifepp-mods")) || {})[e];
          } catch {
            return !1;
          }
        },
        accurateCars = () => modOn("accurateCars"),
        carYearNow = () => state.birthYear + state.age,
        carOut = (e) => {
          const t = carYearNow(),
            a = (window.CAR_FROM || {})[e[0] + " " + e[1]];
          return null != a && t < a;
        },
        earlyCars = () => {
          const e = carYearNow();
          return (window.EARLY_CARS || [])
            .filter((t) => t[4] <= e && e <= t[5] + 12)
            .map(([e, t, a, o, n, s]) => Object.assign([e, t, a, o], { from: n, to: s }));
        },
        yearPick = (e, k) => {
          if (!e[4] || "string" != typeof e[4] || null == state.birthYear) return !0;
          let h = 2166136261;
          for (const c of `${e[0]} ${e[1]}|${carYearNow()}|${k || ""}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
          return (h >>> 0) % 100 < 55;
        },
        carsOnSale = () => {
          const e = CARS.filter((e) => !carOut(e) && yearPick(e)),
            t = earlyCars();
          if (!modOn("extendedCars")) return [...e, ...t];
          const a = new Set(EXTENDED_CARS.map((e) => e[0] + " " + e[1])),
            o = EXTENDED_CARS.filter((e) => !carOut(e));
          return [...e.filter((e) => !a.has(e[0] + " " + e[1])), ...o, ...o, ...t];
        },
        carPool = () => {
          const e = carsOnSale();
          return e.length ? e : [...CARS];
        };
      function carUpkeep(b) {
        // monthly cost of insurance + service + tires; annual = 5.63 * price^0.637 (2026 dollars)
        const k = inflFx();
        return Math.max(20, Math.round((5.63 * Math.pow(Math.max(1, b) / k, 0.637) * k) / 12));
      }
      // [mod] price classes (2026 dollars, scaled by inflation): modest 1k-150k, upper-mid 150k-550k, luxury 550k-20M.
      // The class comes from the model's catalogue price; any depreciation stops at the floor of its class.
      function tierClamp(d, b, coll) {
        const k = inflFx(coll ? 1.08 : 1.03),
          [lo, hi] = d < 15e4 ? [1e3, 15e4] : d < 55e4 ? [15e4, 55e4] : [55e4, 2e7];
        return Math.round(Math.max(lo * k, Math.min(hi * k, b)));
      }
      function makeCar(e, t, untouched) {
        const [a, o, n, s, r, i] = e,
          l = r ? s : accurateCars() && REAL_CAR_PRICES[`${a} ${o}`],
          c = isOldEra() ? eraLvl() / (ERA_FX[cur()] || 1) : 1,
          d = l || s,
          legacy = !untouched && !isOldEra(),
          ovr = legacy ? (window.PRICE_OVERRIDES || {})[`${a} ${o}`] : null,
          coll = ((window.COLLECTIBLE_CARS || []).includes(`${a} ${o}`)),
          u = isOldEra()
            ? Math.max(1, Math.round(d * goodsLvl("car") * c))
            : null != ovr
              ? Math.max(50, Math.round(ovr))
              : legacy
                ? Math.max(50, 10 * Math.round((d * goodsLvl("car") * 2.25 * inflFx(coll ? 1.08 : 1.03)) / 10))
                : Math.max(50, 10 * Math.round((d * goodsLvl("car")) / 10)),
          h = carYearNow(),
          p = e.from ?? (window.CAR_FROM || {})[`${a} ${o}`] ?? 0,
          m = !(null != e.to && h > e.to) && (null != t ? t : Math.random() < 0.35),
          f = m ? 0 : Math.max(1, Math.min(rint(1, 15), h - p || 1)),
          g = i || pickR(CAR_COLORS),
          y = m ? 100 : Math.max(8, Math.min(97, rint(95, 100) - f * rint(3, 6))),
          b0 = Math.round(
            m
              ? null != ovr
                ? u
                : u * (0.97 + 0.08 * Math.random())
              : legacy
                ? coll
                  ? u * (0.92 + 0.16 * Math.random())
                  : u * 0.85 ** f
                : l
                ? 0.8 * u * 0.88 ** (f - 1) * (0.45 + (0.55 * y) / 100) * (0.95 + 0.1 * Math.random())
                : u * 0.86 ** f * (0.85 + 0.3 * Math.random()),
          ),
          b = legacy && null == ovr ? tierClamp(d, b0, coll) : b0;
        return {
          make: a,
          model: o,
          type: n,
          base: u,
          color: g,
          age: f,
          price: b,
          cond: y,
          isNew: m,
          collectible: coll,
          sprite: r,
          expense: isOldEra() ? Math.max(Math.min(25, Math.round(0.02 * b) || 1), Math.round(0.008 * b)) : carUpkeep(b),
          cls: racingClass(d),
        };
      }
      const DEALER_FIRST = [
          "Emily",
          "Phoebe",
          "Maurice",
          "Carl",
          "Dolores",
          "Gus",
          "Wanda",
          "Rocco",
          "Brenda",
          "Earl",
          "Lorraine",
          "Vince",
          "Trudy",
          "Hank",
        ],
        DEALER_LAST = [
          "Cockfield",
          "Butterworth",
          "Pennypacker",
          "Higginbottom",
          "Fairbanks",
          "Lockhart",
          "Whitmore",
          "Crumbleton",
          "Ashby",
          "Kettering",
        ],
        DEALER_FORMS = [(e) => `${e}'s Autos`, (e) => `${e}'s Auto Emporium`, (e) => `${e}'s Motor World`],
        pickUnique = (e, t) => [...e].sort(() => Math.random() - 0.5).slice(0, t);
      state.shops = {
        bike: `${pickR(DEALER_FIRST)}'s ${state.city || COUNTRIES[state.country][1]} Bicycle Shop`,
        race: DEALER_FORMS[2](pickR(DEALER_FIRST)),
        jewel: `${pickR(DEALER_FIRST)}'s Jewelers`,
        fake: `${pickR(DEALER_FIRST)} Faux Jewelry`,
        music: `${pickR(DEALER_FIRST)} Guitar & Drum`,
      };
      const dn = pickUnique(DEALER_FIRST, 2),
        dl = pickR(DEALER_LAST);
      state.carDealers = [`${dl} Autos`, DEALER_FORMS[1](dn[0]), DEALER_FORMS[0](dn[1])].map((e) => ({
        name: e,
        icon: `../dealers/${pickR(["toyota", "ford", "chevrolet", "honda"])}`,
        stock: [],
      }));
      const BRAND_DEALERS = [
          { key: "toyota", label: "Toyota", makes: ["Toyota"], p: 0.9 },
          { key: "ford", label: "Ford", makes: ["Ford"], p: 0.9 },
          { key: "chevrolet", label: "Chevrolet", makes: ["Chevrolet"], p: 0.85 },
          { key: "honda", label: "Honda", makes: ["Honda", "Acura"], p: 0.85 },
          { key: "audi", label: "Audi", makes: ["Audi"], p: 0.6 },
          { key: "bmw", label: "BMW", makes: ["BMW"], p: 0.6 },
          { key: "mercedes", label: "Mercedes-Benz", makes: ["Mercedes-Benz"], p: 0.6 },
          { key: "porsche", label: "Porsche", makes: ["Porsche"], p: 0.5 },
          { key: "tesla", label: "Tesla", makes: ["Tesla", "Rivian"], p: 0.5 },
          { key: "ferrari", label: "Ferrari", makes: ["Ferrari"], p: 0.35 },
          { key: "lamborghini", label: "Lamborghini", makes: ["Lamborghini", "McLaren", "Koenigsegg", "Pagani"], p: 0.3 },
          { key: "rolls-royce", label: "Rolls-Royce", makes: ["Rolls-Royce", "Bentley"], p: 0.3 },
        ],
        brandHash = (k) => {
          let h = 2166136261;
          for (const c of `${k}|${state.birthYear}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
          return h >>> 0;
        },
        brandStock = (b) => {
          const seen = new Set(),
            pool = [...carsOnSale(), ...(window.LUXURY_CARS || []).filter((e) => yearPick(e, "bd"))].filter(
              (e) => b.makes.includes(e[0]) && !seen.has(e[0] + e[1]) && seen.add(e[0] + e[1]),
            );
          return pool.length
            ? Array.from({ length: rint(10, 18) }, () => makeCar(pickR(pool), null, !0)).sort((e, t) => t.price - e.price)
            : [];
        },
        restockCars = () => {
          (state.carDealers = state.carDealers.filter((e) => !e.brand)),
            state.carDealers.forEach((e) => {
              (e.stock = Array.from({ length: rint(50, 60) }, () => makeCar(pickR(carPool())))),
                modOn("extendedCars") && e.stock.push(...EXTENDED_CARS.map((e) => makeCar(e))),
                e.stock.sort((e, t) => t.price - e.price);
            }),
            isOldEra() ||
              BRAND_DEALERS.forEach((b) => {
                if (brandHash(`${b.key}|${carYearNow()}`) % 100 >= 100 * b.p) return;
                const stock = brandStock(b);
                stock.length >= 3 &&
                  state.carDealers.push({
                    name: `${DEALER_LAST[brandHash(b.key) % DEALER_LAST.length]} ${b.label}`,
                    icon: `../dealers/${b.key}`,
                    brand: b.key,
                    stock,
                  });
              });
        };
      (window.inflFx = inflFx),
        restockCars(),
        document.getElementById("ageBtn").addEventListener("click", () => {
          state.dead || restockCars();
        });
      const luxuryDealer = () => {
        const e = (state.luxDealer ||= { name: `${pickR(DEALER_LAST)} Luxury Motors`, stock: [] });
        return (
          (e.at === state.age && e.stock.length) ||
            ((e.at = state.age),
            (e.stock = (window.LUXURY_CARS || [])
              .filter((e) => yearPick(e, "lux"))
              .map((e) => makeCar(e, !0))
              .sort((e, t) => t.price - e.price))),
          e
        );
      };
      function openDealer(e) {
        const t = "lux" === e ? luxuryDealer() : state.carDealers[e];
        (sTitle.textContent = t.name.toUpperCase()),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openShopping),
          (sList.innerHTML = t.stock
            .map(
              (e, t) =>
                `<div class="row" data-c="${t}"><img src="${carImg(e)}"><div class="t"><b>${carName(e)} <em>(${e.isNew ? "New" : "Used"} ${CAR_TYPE_NAME[e.type]})</em></b><span class="sal">${usd(e.price)}</span></div>${DOTS}</div>`,
            )
            .join("")),
          (sList.scrollTop = 0),
          sList
            .querySelectorAll("[data-c]")
            .forEach((a) => (a.onclick = () => carCard(t.stock[+a.dataset.c], !1, () => openDealer(e))));
      }
      function carCard(e, t, a) {
        const o = Math.round(e.base * 0.86 ** e.age * (0.5 + e.cond / 200));
        ev.innerHTML = `\n      <div class="jm-x" id="propX"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="jm-tag">Car</div>\n      <h4><img src="${carImg(e)}" alt="" style="width:34px;height:auto"><span>${carName(e)}</span></h4>\n      <div class="lead">${t ? `Your ${carDesc(e)}.` : `Buy this ${e.isNew ? "brand new" : "used"} ${carName(e)} today!`}</div>\n      <table><tbody>\n        <tr><td><b>${t ? "Value" : "Price"}:</b> ${usd(t ? o : e.price)}</td></tr>\n        <tr><td><b>Status:</b> ${e.isNew && !t ? "New" : "Used"}</td></tr>\n        <tr><td><b>Age:</b> ${0 === e.age ? "Brand new" : `${e.age} Year${e.age > 1 ? "s" : ""}`}</td></tr>\n        <tr><td><b>Color:</b> ${e.color[0].toUpperCase() + e.color.slice(1)}</td></tr>\n        <tr><td><b>Type:</b> ${CAR_TYPE_NAME[e.type]}</td></tr>\n        <tr><td><b>Racing Class:</b> ${e.cls}</td></tr>\n        <tr><td><b>Monthly Expense:</b> ${usd(e.expense)}</td></tr>\n        ${t && e.loanYears ? `<tr><td><b>Car Loan:</b> ${usd(e.loanPay)}/mo (${e.loanYears} yrs left)</td></tr>` : ""}\n      </tbody></table>\n      <div class="ev-bars"><b>Condition</b><i><u style="width:${Math.max(2, e.cond)}%;background:${barCol(e.cond)}"></u></i></div>\n      ${t ? '<button class="jm-apply ev-btn" data-p="sell">Sell it</button>' : '<button class="jm-apply ev-btn" data-p="loan">Apply for a car loan</button><button class="jm-apply ev-btn" data-p="cash">Buy it with cash</button>'}`;
        const n = () => evWrap.classList.remove("open");
        (document.getElementById("propX").onclick = n),
          ev.querySelectorAll("[data-p]").forEach(
            (t) =>
              (t.onclick = () => {
                const a = t.dataset.p;
                if ((n(), "sell" === a)) return setTimeout(() => sellCarCard(e), 50);
                if (state.age < 18)
                  return notice("Too young", "You must be at least 18 years old to buy a car.");
                if (!state.license) return setTimeout(() => drivingLicenseCard(), 50);
                const o = (e, t) =>
                  notice(
                    "Not enough",
                    `You don't have enough money ${t}.<br><br>You are ${usd(e - state.money)} short.<table class="nt"><tr><td><b>Cost:</b> ${usd(e)}</td></tr><tr><td><b>Bank Balance:</b> ${usd(state.money)}</td></tr></table>`,
                  );
                if ("cash" === a) {
                  if (state.money < e.price)
                    return o(e.price, `to buy the ${carAgeWord(e)} ${e.color} ${carName(e)}`);
                  state.money -= e.price;
                } else {
                  const t = Math.round(0.1 * e.price);
                  if (state.money < t) return o(t, `for the 10% down payment on the ${carName(e)}`);
                  if (!chance(state.job ? 0.85 : 0.3))
                    return notice(
                      "Loan denied",
                      `The bank rejected your car loan application${state.job ? "" : " because you have no income"}.`,
                    );
                  (state.money -= t),
                    (e.loanYears = 5),
                    (e.loanPay = Math.round((1.07 * (e.price - t)) / 60));
                }
                const s = [...state.carDealers, ...(state.luxDealer ? [state.luxDealer] : [])].find((t) =>
                  t.stock.includes(e),
                );
                s && s.stock.splice(s.stock.indexOf(e), 1),
                  state.cars.push(e),
                  say(
                    `I bought a ${carDesc(e)} for ${usd(e.price)}${"cash" === a ? "" : " with a car loan"}.`,
                  ),
                  renderStats(),
                  evWrap.classList.remove("open"),
                  screen.classList.remove("open"),
                  notice("Windows down, cruisin'", `You are now the owner of a ${carDesc(e)}.`);
              }),
          ),
          evWrap.classList.add("open");
      }
      const ROAD_SIGNS = [
          [1, "No U-Turn", "U-Turns Only", "Magnet Ahead"],
          [2, "Circular Intersection", "Recycling Center", "Merry-Go-Round"],
          [3, "Farm Machinery Crossing", "Tractors Only", "Wild Farmers"],
          [4, "Deer Crossing", "Reindeer Games", "Hunting Season"],
          [5, "Road Narrows", "Hourglass Road", "Bridge Out"],
          [6, "Slippery When Wet", "Drift Zone", "Car Wash Ahead"],
          [7, "No Pedestrians", "No Walking Allowed Ever", "Zombie Zone"],
          [8, "4 Way Stop", "Go 4 Ways", "Square Dance"],
          [9, "Right Lane Ends", "Lanes Get Wiggly", "Pick a Lane"],
          [10, "Signal Ahead", "Christmas Lights", "Rave Ahead"],
          [11, "T Intersection", "Either Way Works", "Wide Load"],
          [12, "Side Road", "Dead End", "Half Plus Sign"],
          [13, "Two Way Traffic", "Elevator Ahead", "Up and Down Hills"],
          [14, "Yield Ahead", "Pizza Slice Zone", "Go Faster"],
          [15, "Divided Highway", "Lava Lamp Lane", "Road Fork Ahead"],
          [16, "Hill Ahead", "Trucks Falling", "Ski Slope"],
          [17, "Snowmobile Crossing", "Jet Ski Crossing", "Santa Crossing"],
          [18, "Sharp Turn", "Go Back", "Pac-Man Ahead"],
          [19, "Y-Intersection", "Why Intersection", "Slingshot Range"],
          [20, "Cattle Crossing", "Burger Ahead", "Cow Tipping Zone"],
          [21, "Truck Crossing", "Moving Day", "Ice Cream Truck"],
          [22, "Added Lane", "Drag Race Lane", "Twin Roads"],
          [23, "No Parking", "No Pirates", "Parking Lot Full"],
          [24, "Route Marker", "Speed Limit 95", "Exit 95"],
          [25, "Playground Ahead", "Seesaw Factory", "Kids Only Road"],
          [26, "Flagger Ahead", "Surrender Zone", "Hitchhikers Ahead"],
          [27, "Fire Station", "Fire Truck Parade", "Ladder Store"],
          [28, "Cross Road", "Hospital Ahead", "Angry Road"],
          [29, "Handicapped Crossing", "Wheelchair Racing", "Office Chair Lane"],
          [30, "Stop", "Slow Down a Bit", "Stop Sign Store"],
        ],
        honk = () => crimeSnd("Car");
      document.getElementById("ageBtn").addEventListener(
        "click",
        () => {
          isOldEra() && (state.cars || []).length && (state.cars = []);
        },
        !0,
      );
      const DRIVE_AGE = { us: 16, ca: 16, nz: 16, pr: 16, gb: 17, ie: 17, au: 17, sv: 15 },
        driveAge = () => Math.min(DRIVE_AGE[state.country] || 16, 16);
      function drivingLicenseCard(e) {
        if (isOldEra()) return oldEraNo("driving license");
        if (state.license)
          return notice("Driving License", "You already have your driving license.", null, !0);
        if (state.age < driveAge())
          return notice(
            "Driving License",
            `You must be at least ${driveAge()} years old to take the driving test.`,
            null,
            !0,
          );
        if (state.prison)
          return notice("Driving License", "You can't take the driving test from prison.", null, !0);
        const t = state.drivingTries ? 10 * rint(4, 9) : 0;
        honk(),
          jCard({
            tag: "License",
            iconSrc: "cars/ui-license-car.png",
            title: "Driving License",
            close: !0,
            lead: "Take the driving test today!" + (t ? `<br><br>Retaking the test costs ${usd(t)}.` : ""),
            choices: [
              [
                "Take the test",
                () => {
                  if (state.money < t)
                    return notice(
                      "Flat broke",
                      "You can't afford to retake the driving test.",
                      null,
                      !0,
                      brokeRows(t),
                    );
                  t && ((state.money -= t), renderStats()),
                    (state.drivingTries = (state.drivingTries || 0) + 1);
                  const [a, o, ...n] = pickR(ROAD_SIGNS),
                    s = [o, ...n].sort(() => Math.random() - 0.5);
                  screen.classList.remove("open"),
                    jCard({
                      tag: "License",
                      iconSrc: "cars/ui-license-car.png",
                      title: "Driving Test",
                      lead: `What does this road sign mean?<div class="sign-q"><img src="cars/signs/${a}.png" alt=""></div>`,
                      choices: s.map((t) => [
                        t,
                        () => {
                          if (t === o)
                            return (
                              (state.license = !0),
                              honk(),
                              say("I passed my driving test!"),
                              notice(
                                "Done & done",
                                "You passed your driving test!",
                                () => {
                                  e ? e() : setTimeout(parentCarGift, 120);
                                },
                                !0,
                              )
                            );
                          (state.stats.Happiness = clamp(state.stats.Happiness - hit("drivingTestFail"))),
                            renderStats(),
                            say("I failed my driving test."),
                            notice(
                              "Failed",
                              `You failed your driving test! That sign means "${o}".`,
                              null,
                              !0,
                            );
                        },
                      ]),
                    });
                },
              ],
            ],
          });
      }
      const parentMoney = (e) => profileOf(e, e.ageAtBirth + state.age).money;
      function giftCar(e, t = 0.2) {
        const a = carPool().filter((e) => !/Hearse|Limo|F-[345]50|Bus|Van\b|Ambulance|Tow/i.test(e[1])),
          o = Array.from({ length: 240 }, () => makeCar(pickR(a))),
          n = o.filter((a) => a.price <= e && a.price >= e * t);
        return n.length ? pickR(n) : o.sort((e, t) => e.price - t.price)[0];
      }
      function parentCarGift() {
        if (state.dead || state.prison || state.age > 19 || state.carGiftAsked || (state.cars || []).length)
          return;
        const e = aliveParents().filter((e) => e.rel >= 30);
        if (!e.length) return;
        state.carGiftAsked = !0;
        const t = pickR(e),
          a = e.reduce((e, t) => e + parentMoney(t), 0);
        if (a < 1500 && chance(0.6)) return;
        const o = Math.max(2500, Math.min(22e4, 0.18 * a + rint(1e3, 4e3))),
          n = giftCar(o),
          s = "Mother" === t.role ? "mother" : "father",
          r = "f" === t.gender ? "she" : "he",
          i = r[0].toUpperCase() + r.slice(1),
          l = `${t.first} ${SURNAME}`,
          c = (e) => {
            t.rel = clamp(t.rel + e);
          };
        honk();
        const d = (e) => {
          (e.gift = !0),
            (e.loanYears = 0),
            (state.cars ||= []).push(e),
            renderStats(),
            say(`My ${s} bought me a ${carDesc(e)}.`),
            notice("New whip", `Your ${s} bought you the ${carDesc(e)}.`);
        };
        jCard({
          tag: t.role,
          person: { name: l, look: t.look, g: t.gender, age: t.ageAtBirth + state.age, mood: "happy" },
          iconSrc: carImg(n),
          title: carName(n),
          surprise: !0,
          lead: `Now that you've passed your driving test, your ${s} wants to buy you a ${carDesc(n)}.<br><br>How will you react?`,
          choices: [
            [
              "Accept it gratefully",
              () => {
                c(rint(4, 8)), d(n);
              },
            ],
            [
              "Turn it down",
              () => {
                c(-rint(2, 6)),
                  say(`I turned down the ${carName(n)} my ${s} wanted to buy me.`),
                  notice(
                    "No thanks",
                    `You told your ${s} you didn't want the ${carName(n)}. ${i} looked a little hurt.`,
                  );
              },
            ],
            [
              "Ask for a more expensive car",
              () => {
                const e = Math.min(0.75, 0.1 + (t.rel - 50) / 200 + Math.min(0.4, a / 6e5));
                if (chance(e)) {
                  const e = giftCar((o * rint(18, 30)) / 10, 0.55);
                  if ((c(-rint(0, 3)), e.price > n.price))
                    return say(`I talked my ${s} into a pricier car.`), d(e);
                }
                if ((c(-rint(8, 15)), chance(0.5)))
                  return (
                    say(
                      `My ${s} was offended when I asked for a more expensive car and took back the offer.`,
                    ),
                    notice(
                      "Spoiled brat",
                      `Your ${s} was offended that you asked for something more expensive. ${i} decided not to buy you a car at all.`,
                    )
                  );
                say(`My ${s} refused to buy me a more expensive car.`),
                  notice(
                    "Ungrateful",
                    `Your ${s} refused to spend more money on you. ${i} bought you the ${carName(n)} anyway, but ${r} is not happy about it.`,
                    () => d(n),
                  );
              },
            ],
          ],
        });
        const u = ev.querySelector(".jcw h4 img");
        u && (u.style.cssText = "width:38px;height:auto");
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        state.dead ||
          state.prison ||
          state.license ||
          state.drivePrompted ||
          state.age < driveAge() ||
          state.age > driveAge() + 1 ||
          setTimeout(() => {
            overlayOpen() ||
              state.drivePrompted ||
              state.license ||
              state.dead ||
              ((state.drivePrompted = !0), drivingLicenseCard());
          }, 343);
      });
      const CAR_BUYERS = [
          "a famous author",
          "a retired dentist",
          "a college student",
          "a used car dealer",
          "a soccer mom",
          "a pizza delivery guy",
          "a nervous teenager",
          "a wealthy collector",
          "a local pastor",
          "a construction worker",
          "a TikTok influencer",
          "a grumpy grandpa",
          "an Uber driver",
          "a real estate agent",
        ],
        carValue = (e) => Math.round(e.base * 0.86 ** e.age * (0.5 + e.cond / 200));
      function removeCar(e) {
        const t = state.cars.indexOf(e);
        t >= 0 && state.cars.splice(t, 1);
      }
      function sellCarCard(e) {
        const t = carValue(e),
          a = [0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4].map((e) => 10 * Math.round((t * e) / 10));
        (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="jm-tag" style="margin-top:12px">Car</div>\n      <h4><img src="${carImg(e)}" alt="" style="width:34px;height:auto"><span>${carName(e)}</span></h4>\n      <div class="lead">Try to sell your ${e.color} ${carName(e)} today!</div>\n      <table class="jc"><tbody><tr><td><b>Age:</b> ${0 === e.age ? "Brand new" : `${e.age} Year${e.age > 1 ? "s" : ""}`}</td></tr><tr><td><b>Estimated Value:</b> ${usd(t)}</td></tr></tbody></table>\n      <div class="ev-bars"><b>Condition</b><i><u style="width:${Math.max(3, e.cond)}%;background:${barCol(e.cond)}"></u></i></div>\n      <label class="hr-lab">Pick your list price:</label>\n      <div class="hr-sel"><select id="carList">${a.map((e) => `<option value="${e}"${e === a[3] ? " selected" : ""}>${usd(e)}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" data-s="ad">Post an ad online</button><button class="jm-apply ev-btn" data-s="black">Sell it on the black market</button></div>`),
          (ev.style.overflow = "visible");
        const o = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = o),
          ev.querySelectorAll("[data-s]").forEach(
            (a) =>
              (a.onclick = () => {
                const n = +document.getElementById("carList").value;
                if ((o(), screen.classList.remove("open"), "black" === a.dataset.s)) {
                  const a = 10 * Math.round((t * (0.35 + 0.25 * Math.random())) / 10);
                  return (
                    removeCar(e),
                    (state.money += a),
                    renderStats(),
                    chaChing(),
                    say(`I sold my ${e.color} ${carName(e)} on the black market for ${usd(a)}.`),
                    notice(
                      "Done deal",
                      `You sold your ${e.color} ${carName(e)} on the black market for ${usd(a)}.`,
                    )
                  );
                }
                const s = n / t,
                  r = pickR(CAR_BUYERS),
                  i = chance(0.5) ? "his" : "her";
                if (
                  (say(`I posted an ad to sell my ${e.color} ${carName(e)} for ${usd(n)}.`),
                  !chance(Math.max(0.08, Math.min(0.95, 1.45 - s))))
                )
                  return notice(
                    "No bites",
                    `Nobody responded to your ad for the ${carName(e)}${s > 1.15 ? `. ${usd(n)} might be too much` : ""}.`,
                  );
                if (chance(0.3 / Math.max(0.6, s)))
                  return (
                    removeCar(e),
                    (state.money += n),
                    renderStats(),
                    chaChing(),
                    say(`I sold my ${e.color} ${carName(e)} to ${r} for ${usd(n)}.`),
                    notice("Done deal", `You sold your ${e.color} ${carName(e)} to ${r} for ${usd(n)}.`)
                  );
                const l = 100 * Math.round((n * (0.72 + 0.2 * Math.random())) / 100);
                jCard({
                  tag: "Car",
                  iconSrc: carImg(e),
                  title: "Offer",
                  surprise: !0,
                  lead: `${r[0].toUpperCase() + r.slice(1)} has offered you ${usd(l)} for your ${carName(e)}.<br><br>What will you do?`,
                  rows: [
                    ["Offer", usd(l)],
                    ["List Price", usd(n)],
                  ],
                  choices: [
                    [
                      `Take ${i} offer`,
                      () => {
                        removeCar(e),
                          (state.money += l),
                          renderStats(),
                          chaChing(),
                          say(`I sold my ${e.color} ${carName(e)} to ${r} for ${usd(l)}.`),
                          notice(
                            "Done deal",
                            `You sold your ${e.color} ${carName(e)} to ${r} for ${usd(l)}.`,
                          );
                      },
                    ],
                    [
                      `Insist on ${usd(n)}`,
                      () => {
                        if (chance(Math.max(0.15, 0.65 - 1.2 * (s - 1))))
                          return (
                            removeCar(e),
                            (state.money += n),
                            renderStats(),
                            chaChing(),
                            say(`I insisted on ${usd(n)} for my ${carName(e)}, and ${r} agreed!`),
                            notice(
                              "Done deal",
                              `${r[0].toUpperCase() + r.slice(1)} agreed to pay your asking price! You sold your ${e.color} ${carName(e)} for ${usd(n)}.`,
                            )
                          );
                        say(`I insisted on ${usd(n)} for my ${carName(e)}, but ${r} walked away.`),
                          notice("No deal", `You insisted on ${usd(n)}, but ${r} walked away from the deal.`);
                      },
                    ],
                    [
                      "Never mind, keep it",
                      () => {
                        say(`I decided to keep my ${carName(e)}.`);
                      },
                    ],
                  ],
                });
              }),
          ),
          evWrap.classList.add("open");
      }
      function openCar(e) {
        (sTitle.textContent = CAR_TYPE_NAME[e.type].toUpperCase()),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openAssets);
        const t = (e, t, a, o, n = DOTS, s) =>
          `<div class="row${s ? " dis locked" : ""}" data-ca="${o}"><img src="${e}"><div class="t"><b>${t}</b><span>${a}</span></div>${s ? "" : n}</div>`;
        (sList.innerHTML =
          `<div class="row" data-ca="view"><img src="${carImg(e)}"><div class="t"><b>${carName(e)}</b><span>View your ${0 === e.age ? "brand new" : `${e.age}-year old`} ${CAR_TYPE_NAME[e.type].toLowerCase()}</span></div>${DOTS}</div><div class="sec">Activities</div>` +
          t("cars/ui-sign-litter.png", "Abandon", "Leave it somewhere", "abandon") +
          t("cars/ui-drive-car.png", "Drive", "Take it out for a spin", "drive") +
          t(
            "cars/ui-tire.png",
            "Garage",
            "Store it in your race car garage",
            "garage",
            '<img class="seal" src="cars/ui-tableRacingSeal.png" alt="">',
          ) +
          t("cars/ui-gift.png", "Gift", "Give it to someone", "gift") +
          t("cars/ui-mechanic.png", "Maintenance", "Schedule maintenance", "fix") +
          t("cars/ui-money-bag.png", "Pay Off", "Pay off your loan", "payoff", DOTS, !e.loanYears) +
          t("cars/ui-tools.png", "Repair", "Repair it", "repair") +
          t("cars/ui-hand-waving.png", "Sell", "Sell it", "sell") +
          t("cars/ui-magnet.png", "Scrap", "Scrap it", "scrap")),
          (sList.scrollTop = 0);
        const a = (e, t, a) => {
          a && say(a), screen.classList.remove("open"), renderStats(), notice(e, t);
        };
        sList.querySelectorAll("[data-ca]").forEach(
          (t) =>
            (t.onclick = () => {
              const o = t.dataset.ca;
              if (!t.classList.contains("dis")) {
                if ("view" === o) return carCard(e, !0);
                if ("sell" === o) return sellCarCard(e);
                if ("abandon" === o)
                  return (
                    removeCar(e),
                    a(
                      "Abandoned",
                      `You left your ${carDesc(e)} on the side of the road.`,
                      `I abandoned my ${e.color} ${carName(e)}.`,
                    )
                  );
                if ("drive" === o)
                  return state.license || e.stolen
                    ? e.driven === state.age
                      ? a("Drive", `You already took your ${carName(e)} for a drive this year.`)
                      : ((e.driven = state.age),
                        (e.cond = Math.max(0, e.cond - rint(0, 2))),
                        (state.stats.Happiness = clamp(state.stats.Happiness + rint(3, 7))),
                        honk(),
                        a(
                          "Drive",
                          `You took your ${carName(e)} out for a spin. ${pickR(["The open road felt amazing.", "You blasted your favorite songs the whole way.", "You cruised around town with the windows down."])}`,
                          `I took my ${carName(e)} for a drive.`,
                        ))
                    : drivingLicenseCard();
                if ("garage" === o) return comingSoon();
                if ("gift" === o) {
                  const t = victims()
                    .filter((e) => e.age >= 16)
                    .slice(0, 4);
                  return t.length
                    ? jCard({
                        tag: "Car",
                        iconSrc: carImg(e),
                        title: "Gift",
                        close: !0,
                        lead: `Who will you give your ${carName(e)} to?`,
                        choices: t.map((t) => [
                          `${t.name.split(" ")[0]} (${t.title})`,
                          () => {
                            removeCar(e),
                              a(
                                "Generous",
                                `You gave your ${carDesc(e)} to ${t.rel}, ${t.name.split(" ")[0]}. ${"f" === t.g ? "She" : "He"} loved it!`,
                                `I gave my ${e.color} ${carName(e)} to ${t.rel.replace("your ", "my ")}, ${t.name.split(" ")[0]}.`,
                              );
                          },
                        ]),
                      })
                    : notice("Gift", "There is nobody to give your car to.", null, !0);
                }
                if ("fix" === o) {
                  const t = Math.max(150, Math.round(0.02 * e.base));
                  return e.cond >= 100
                    ? notice("Maintenance", `Your ${carName(e)} is already in perfect condition.`, null, !0)
                    : state.money < t
                      ? notice(
                          "Not enough",
                          `You need ${usd(t)} to get your ${carName(e)} serviced.`,
                          null,
                          !0,
                          brokeRows(t),
                        )
                      : ((state.money -= t),
                        (e.cond = Math.min(100, e.cond + rint(10, 20))),
                        a(
                          "Maintenance",
                          `The mechanic serviced your ${carName(e)} for ${usd(t)}.`,
                          `I paid ${usd(t)} to get my ${carName(e)} serviced.`,
                        ));
                }
                if ("repair" === o) {
                  const t = Math.max(400, Math.round((e.base * (100 - e.cond)) / 1e3));
                  return e.cond >= 100
                    ? notice("Repair", `Your ${carName(e)} doesn't need any repairs.`, null, !0)
                    : state.money < t
                      ? notice(
                          "Not enough",
                          `You need ${usd(t)} to repair your ${carName(e)}.`,
                          null,
                          !0,
                          brokeRows(t),
                        )
                      : ((state.money -= t),
                        (e.cond = 100),
                        a(
                          "Good as new",
                          `The body shop fully repaired your ${carName(e)} for ${usd(t)}.`,
                          `I paid ${usd(t)} to repair my ${carName(e)}.`,
                        ));
                }
                if ("payoff" === o) {
                  const t = 12 * e.loanPay * e.loanYears;
                  return state.money < t
                    ? notice(
                        "Not enough",
                        "You don't have enough money to pay off your car loan.",
                        null,
                        !0,
                        brokeRows(t),
                      )
                    : ((state.money -= t),
                      (e.loanYears = 0),
                      a(
                        "Paid off",
                        `You paid off the ${usd(t)} left on your ${carName(e)} loan!`,
                        `I paid off my ${carName(e)} loan.`,
                      ));
                }
                return "scrap" === o
                  ? iosConfirm("Scrap it", `Scrap your ${carName(e)} for parts?`, () => {
                      const t = Math.max(100, 10 * Math.round((0.08 * carValue(e)) / 10));
                      removeCar(e),
                        (state.money += t),
                        a(
                          "Scrapped",
                          `The scrapyard paid you ${usd(t)} for your ${carDesc(e)}.`,
                          `I scrapped my ${e.color} ${carName(e)} for ${usd(t)}.`,
                        );
                    })
                  : void 0;
              }
            }),
        );
      }
      function openBroker(e) {
        isOldEra() !== !!(state.listings[0] || {}).old && (state.listings = newListings());
        const [t, , a] = brokers()[e];
        (sTitle.textContent = t.toUpperCase()), (sBack.innerHTML = BACK_ICON), (sBack.onclick = openShopping);
        const o = state.listings.filter(a).sort((e, t) => t.price - e.price);
        (sList.innerHTML = o
          .map(
            (e, t) =>
              `<div class="row" data-l="${t}">${houseRowImg(e)}<div class="t"><b>${e.name} <em>(${e.addr})</em></b><span class="sal">${usd(e.price)}</span></div>${DOTS}</div>`,
          )
          .join("")),
          (sList.scrollTop = 0),
          sList
            .querySelectorAll("[data-l]")
            .forEach((t) => (t.onclick = () => propertyCard(o[+t.dataset.l], !1, () => openBroker(e))));
      }
      function propertyCard(e, t, a) {
        const o = Math.round(e.price * (0.8 + e.cond / 250));
        e.yearsLeft && Math.round(((e.loan || 0.8 * e.price) * e.yearsLeft) / 30);
        ev.innerHTML = `\n      <div class="jm-x" id="propX"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="jm-tag">Property</div>\n      <h4><img src="houses/${e.sprite}.png" alt=""><span>${e.title || e.name}</span></h4>\n      <div class="lead">${t ? `Your ${e.br}br/${e.ba}ba ${e.name.toLowerCase()}.` : `Buy this ${e.br}br/${e.ba}ba ${e.name.toLowerCase()} today!`}</div>\n      <table><tbody>\n        <tr><td><b>${t ? "Value" : "Price"}:</b> ${usd(t ? o : e.price)}</td></tr>\n        <tr><td><b>Address:</b> ${e.addr}</td></tr>\n        <tr><td><b>Size:</b> ${e.br}br/${e.ba}ba</td></tr>\n        <tr><td><b>Age:</b> ${e.built} Years</td></tr>\n        <tr><td><b>Monthly Expense:</b> ${usd(e.expense)}</td></tr>\n        <tr><td><b>Monthly Mortgage:</b> ${t ? (e.yearsLeft ? `${usd(e.mortgage)} (${e.yearsLeft} yrs left)` : "Paid off") : usd(e.mortgage)}</td></tr>\n      </tbody></table>\n      <div class="ev-bars"><b>Condition</b><i><u class="${e.cond < 50 ? "o" : ""}" style="width:${e.cond}%"></u></i></div>\n      ${t ? `<button class="jm-apply ev-btn" data-p="sell">${e.forSale ? `Listed for ${usd(e.forSale.price)}` : "Sell it"}</button>` : '<button class="jm-apply ev-btn" data-p="mortgage">Apply for a mortgage</button><button class="jm-apply ev-btn" data-p="cash">Buy it with cash</button>'}`;
        const n = () => evWrap.classList.remove("open");
        (document.getElementById("propX").onclick = n),
          ev.querySelectorAll("[data-p]").forEach(
            (t) =>
              (t.onclick = () => {
                const a = t.dataset.p;
                if ((n(), "sell" === a)) return setTimeout(() => sellHouseCard(e), 50);
                if (state.age < 18) return show("Too Young", "You must be at least 18 to buy property.");
                if ("mortgage" === a && isOldEra() && e.price < eraCash(300))
                  return show(
                    "No Mortgage",
                    "No bank will lend money on a place this cheap. You will have to pay cash.",
                  );
                const o = state.spouse;
                if (o && o.married && !o.dead && window.MARRIAGE && MARRIAGE.askHouse)
                  return MARRIAGE.askHouse(e, s);
                function s(t) {
                  if ("cash" === a) {
                    if (state.money < e.price)
                      return show(
                        "Insufficient Funds",
                        `You need ${usd(e.price)} to buy this ${e.name.toLowerCase()} with cash.`,
                      );
                    (state.money -= e.price), (e.yearsLeft = 0);
                  } else {
                    const t = Math.round(0.2 * e.price);
                    if (state.money < t)
                      return show("Insufficient Funds", `You need ${usd(t)} for the 20% down payment.`);
                    if (!chance(state.job ? 0.8 : 0.3))
                      return show(
                        "Mortgage Denied",
                        `The bank rejected your mortgage application${state.job ? "" : " because you have no income"}.`,
                      );
                    (state.money -= t), (e.yearsLeft = 30), (e.loan = e.price - t);
                  }
                  return (
                    (e.paid = e.price),
                    state.listings.splice(state.listings.indexOf(e), 1),
                    state.props.push(e),
                    log.lastElementChild.insertAdjacentHTML(
                      "beforeend",
                      `<p>I bought a ${e.name.toLowerCase()} at ${e.addr} for ${usd(e.price)}${"cash" === a ? "" : " with a mortgage"}.</p>`,
                    ),
                    renderStats(),
                    screen.classList.remove("open"),
                    setTimeout(
                      () =>
                        notice(
                          "Congratulations!",
                          `You bought a ${e.name.toLowerCase()} at ${e.addr}!`,
                          "function" == typeof t ? t : null,
                          !0,
                        ),
                      350,
                    ),
                    e.price >= 1e7 &&
                      !achSeen.has("Real Estate Tycoon") &&
                      setTimeout(
                        () => showAchievement("Real Estate Tycoon", "Purchase real estate worth $10m"),
                        900,
                      ),
                    !0
                  );
                }
                s();
              }),
          ),
          evWrap.classList.add("open");
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || !state.cars.length) return;
        let e = 0;
        for (const t of state.cars)
          t.age++,
            (t.cond = Math.max(0, t.cond - rint(3, 8))),
            isOldEra() || (t.expense = carUpkeep(t.price || t.base || 1)),
            (e += 12 * t.expense),
            t.loanYears > 0 && ((e += 12 * t.loanPay), t.loanYears--);
        (state.money = Math.max(0, state.money - e)), renderStats();
      });
      // [mod] lifestyle creep: the more you own, the more fixed costs you carry (staff, security, memberships)
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || isOldEra() || typeof netWorth !== "function") return;
        const k = inflFx(),
          sc = Math.max(0.1, Math.pow(wageLvl(), 0.5)),
          A = Math.max(0, netWorth() - state.money) / k / sc,
          tiers = [[25e4, 0], [1e6, 0.005], [5e6, 0.012], [1 / 0, 0.02]];
        let cost = 0,
          lo = 0;
        for (const [hi, r] of tiers) {
          A > lo && (cost += (Math.min(A, hi) - lo) * r), (lo = hi);
        }
        cost = Math.round((cost * k * sc) / 100) * 100;
        state.lifestyleCost = cost;
        cost > 0 &&
          ((state.money = Math.max(0, state.money - cost)),
          say(`Keeping up my lifestyle cost me ${usd(cost)} this year (staff, security, memberships).`),
          renderStats());
      });
      const PROF_JOBS = [
          ["Store Manager", ["Brothers Jewelers", "Supermarket", "Department Store", "Hardware"]],
          ["Accountant", ["& Associates", "Group", "Accounting"]],
          ["Nurse", ["General Hospital", "Medical Center", "Clinic"]],
          ["Teacher", ["Elementary School", "High School", "Academy"]],
          ["Electrician", ["Electric", "& Sons"]],
          ["Plumber", ["Plumbing", "& Sons"]],
          ["Mechanic", ["Motors", "Auto Repair"]],
          ["Software Developer", ["Technologies", "Software", "Labs"]],
          ["Cashier", ["Supermarket", "Grocery", "Pharmacy"]],
          ["Chef", ["Bistro", "Steakhouse", "Trattoria"]],
          ["Police Officer", ["Police Department"]],
          ["Firefighter", ["Fire Department"]],
          ["Dentist", ["Dental"]],
          ["Lawyer", ["Law Firm", "& Partners"]],
          ["Real Estate Agent", ["Realty"]],
          ["Truck Driver", ["Logistics", "Freight"]],
          ["Hairstylist", ["Salon"]],
          ["Barista", ["Café", "Coffee Co."]],
          ["Pharmacist", ["Pharmacy"]],
          ["Architect", ["Architects", "Design Studio"]],
          ["Bank Teller", ["Bank", "Savings & Loan"]],
          ["Construction Worker", ["Construction", "Builders"]],
          ["Marketing Manager", ["Media", "Group", "Advertising"]],
          ["Receptionist", ["Hotel", "Dental", "Law Firm"]],
          ["Doctor", ["General Hospital", "Medical Center"]],
          ["Janitor", ["Elementary School", "Office Park", "Mall"]],
          ["Pilot", ["Airlines"]],
          ["Graphic Designer", ["Design Studio", "Media"]],
          ["Baker", ["Bakery", "& Sons"]],
          ["Librarian", ["Public Library"]],
        ],
        startMoney = (e) =>
          e < 13
            ? 0
            : e < 18
              ? chance(0.6)
                ? 0
                : rint(5, 800)
              : e < 25
                ? rint(0, 8e3)
                : e < 40
                  ? rint(500, 6e4) * (chance(0.08) ? rint(5, 20) : 1)
                  : e < 65
                    ? rint(5e3, 25e4) * (chance(0.1) ? rint(4, 15) : 1)
                    : rint(2e4, 5e5) * (chance(0.1) ? rint(3, 10) : 1),
        eduFor = (e) =>
          e < 5
            ? "None"
            : e < 11
              ? "Elementary School"
              : e < 14
                ? "Middle School"
                : e < 18
                  ? "High School"
                  : pickR([
                      "Secondary School",
                      "Secondary School",
                      "Secondary School",
                      "University",
                      "University",
                      "Graduate School",
                      "None",
                    ]),
        jobFor = (e) =>
          e < 5
            ? "None"
            : e < 18
              ? "Student"
              : e >= 65
                ? "Retired"
                : chance(0.85)
                  ? (([e, t]) => `${e} at ${any(LAST)} ${pickR(t)}`)(pickR(PROF_JOBS))
                  : "Unemployed",
        oldClassOf = (e) =>
          state.parents.includes(e) || (state.family || []).includes(e)
            ? state.famClass || "poor"
            : (e.famClass ||= pickR(["poor", "poor", "poor", "middle", "middle", "rich"])),
        oldJobFor = (e, t) =>
          t < 8
            ? "None"
            : t < 14
              ? "poor" === oldClassOf(e)
                ? pickR(["Chimney Sweep", "Farm Hand", "Factory Worker", "None"])
                : "Student"
              : t >= 70
                ? "Retired"
                : pickR(
                    OLD_CLASS_JOBS[oldClassOf(e)].filter((t) =>
                      (!e.gender && !e.g) || "f" === (e.gender || e.g)
                        ? !/Soldier|Constable|Priest|Coal Miner|Lumberjack|Dock Worker|Blacksmith/.test(t)
                        : !/Washerwoman|Seamstress|Housemaid/.test(t),
                    ),
                  );
      function profileOf(e, t) {
        if (
          (isOldEra() &&
            !e.prof &&
            (e.prof = {
              money: t < 13 ? 0 : OLD_CLASS_MONEY[oldClassOf(e)](),
              relig: rint(40, 100),
              gen: rint(0, 100),
              edu:
                "rich" === oldClassOf(e)
                  ? "University"
                  : "middle" === oldClassOf(e)
                    ? "Grammar School"
                    : "None",
              job: oldJobFor(e, t),
              marital:
                t < 18
                  ? "Single"
                  : chance(0.75)
                    ? `Married to ${uname("f" === (e.gender || e.g) ? "m" : "f")} ${any(LAST)}`
                    : "Single",
              old: !0,
            }),
          e.prof && e.prof.old)
        )
          return (
            t < 14 || "None" === e.prof.job || "Student" === e.prof.job
              ? (e.prof.job = oldJobFor(e, t))
              : t >= 70 && "Retired" !== e.prof.job && !e.royal && chance(0.4) && (e.prof.job = "Retired"),
            e.prof
          );
        if (!e.prof && e.job) {
          const knownJob = "object" == typeof e.job ? e.job.t : e.job;
          e.prof = {
            money: startMoney(t),
            relig: rint(0, 100),
            gen: rint(0, 100),
            edu: e.edu || eduFor(t),
            job: knownJob,
            marital: e.marital || (t < 18 ? "Single" : state.spouse === e ? "Married" : "Single"),
          };
        }
        if (!e.prof) {
          const a = "f" === (e.gender || e.g) ? "m" : "f";
          e.prof = {
            money: startMoney(t),
            relig: rint(0, 100),
            gen: rint(0, 100),
            edu: eduFor(t),
            job: jobFor(t),
            marital:
              t < 18
                ? "Single"
                : chance(t >= 30 ? 0.6 : 0.3)
                  ? `Married to ${uname(a)} ${any(LAST)}`
                  : t >= 70 && chance(0.4)
                    ? "Widowed"
                    : chance(0.2)
                      ? "Divorced"
                      : "Single",
          };
        }
        return (
          t < 18
            ? ((e.prof.edu = eduFor(t)), (e.prof.job = jobFor(t)))
            : "Student" === e.prof.job || "None" === e.prof.job
              ? ((e.prof.job = jobFor(t)), (e.prof.edu = eduFor(t)))
              : t >= 65 &&
                "Retired" !== e.prof.job &&
                !e.royal &&
                !e.prof.milJob &&
                chance(0.5) &&
                (e.prof.job = "Retired"),
          e.prof
        );
      }
      function growMoney(e, t) {
        const a = e.prof;
        if (a)
          if (a.old) {
            const o = oldClassOf(e),
              n = OLD_JOBS.find((e) => e.t === a.job);
            t >= 13 &&
              (a.money = Math.max(
                0,
                cents(
                  "rich" === o
                    ? a.money * (1 + 0.06 * Math.random() - 0.01) + eraCash(rint(200, 2e3))
                    : a.money +
                        eraCash(
                          (n ? n.pay * ("poor" === o ? 0.15 : 0.35) : 0) - rint(0, "poor" === o ? 10 : 40),
                        ),
                ),
              ));
          } else
            t < 13
              ? (a.money = 0)
              : t < 18
                ? chance(0.35) && (a.money += rint(0, 400))
                : (a.money = Math.max(
                    0,
                    Math.round(
                      a.money * (0.13 * Math.random() - 0.05 + 1) +
                        (/ at /.test(a.job) ? rint(1e3, 12e3) : rint(-2e3, 1500)),
                    ),
                  ));
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        state.dead ||
          (state.parents.forEach((e) => {
            e.dead || (profileOf(e, e.ageAtBirth + state.age), growMoney(e, e.ageAtBirth + state.age));
          }),
          state.family.forEach((e) => {
            const t = relAge(e);
            !e.dead && t >= 0 && (profileOf(e, t), growMoney(e, t));
          }),
          state.friends.forEach((e) => {
            const t = friendAge(e);
            profileOf(e, t), growMoney(e, t);
          }));
      });
      const moneyPct = (e) => (e <= 0 ? 0 : clamp(Math.round((Math.log10(Math.max(1, e)) / 9) * 100))),
        GOD_ATTRS = [
          "Craziness",
          "Fertility",
          "Happiness",
          "Health",
          "Looks",
          "Sexuality",
          "Smarts",
          "Willpower",
        ],
        PARENT_GOD_ATTRS = [
          "Craziness",
          "Fertility",
          "Generosity",
          "Happiness",
          "Health",
          "Looks",
          "Sexuality",
          "Smarts",
          "Wealth",
          "Willpower",
        ],
        wealthMoney = (e) => (e <= 0 ? 0 : Math.round(10 ** ((e / 100) * 9))),
        GOD_SEAL = '<img class="god-seal" src="rel/godmode-seal.png" alt="God Mode">';
      function godEdit(e, { role: t, age: a, g: o }, n) {
        (e.crazy ??= rint(0, 100)),
          (e.fertility ??= rint(20, 100)),
          (e.happy ??= rint(30, 100)),
          (e.health ??= rint(40, 100)),
          (e.looks ??= rint(5, 100)),
          (e.smarts ??= rint(5, 100)),
          (e.willpower ??= rint(0, 100)),
          (e.sexuality ??= "Straight");
        const s = {
            Craziness: e.crazy,
            Fertility: e.fertility,
            Happiness: e.happy,
            Health: e.health,
            Looks: e.looks,
            Sexuality: { Straight: 15, Bisexual: 50, Gay: 85 }[e.sexuality] ?? 15,
            Smarts: e.smarts,
            Willpower: e.willpower,
          },
          r = state.parents.includes(e),
          i = r ? profileOf(e, a) : null;
        r && Object.assign(s, { Generosity: i.gen, Wealth: moneyPct(i.money) });
        const l = "last" in e ? e.last : r ? SURNAME : "";
        openNewLifeMenu({
          edit: {
            p: e,
            role: t,
            age: a,
            g: o,
            attrs: s,
            last: l,
            attrList: r ? PARENT_GOD_ATTRS : null,
            save: (a) => {
              (e.first = a.first), "last" in e && (e.last = a.last);
              const { wantBeard: n, accRoll: l, hatRoll: c, ...d } = a.look;
              e.look = { ...e.look, ...d, beard: ("m" === o && n) || 0 };
              const u = a.attrs;
              Object.assign(e, {
                crazy: u.Craziness,
                fertility: u.Fertility,
                happy: u.Happiness,
                health: u.Health,
                looks: u.Looks,
                sexuality: sexualityOf(u.Sexuality),
                smarts: u.Smarts,
                willpower: u.Willpower,
              }),
                r &&
                  null != u.Generosity &&
                  ((i.gen = u.Generosity), u.Wealth !== s.Wealth && (i.money = wealthMoney(u.Wealth))),
                say(`I'm not sure what's gotten into my ${t.toLowerCase()} lately.`),
                screen.classList.remove("open"),
                renderStats();
            },
          },
        });
      }
      function profileCard(e, t, a, o) {
        const n = profileOf(e, t),
          s = e.gender || e.g;
        let r = n.marital;
        if (state.parents.includes(e)) {
          const t = state.parents.find((t) => t !== e),
            a = state.family.find((t) => "stepparent" === t.kind && t.of === e.role && !t.dead);
          r = a
            ? `Married to ${a.first} ${a.last}`
            : state.pm && "divorced" === state.pm.status
              ? "Divorced"
              : t && !t.dead
                ? `Married to ${relName(t, SURNAME)}`
                : t
                  ? "Widowed"
                  : n.marital;
        }
        if (
          (/stepparent$/.test(e.kind) &&
            (r =
              "stepparent" === e.kind
                ? `Married to ${(state.parents.find((t) => t.role === e.of) || {}).first || "your parent"} ${SURNAME}`
                : "Divorced"),
          (state.lovers || []).includes(e))
        ) {
          const t = `${state.first} ${SURNAME}`;
          r = e.married ? `Married to ${t}` : e.bride ? `Engaged to ${t}` : `Dating ${t}`;
        }
        const i = (e, t) =>
          `<b>${e}</b><i><u style="width:${Math.max(t, 1)}%;background:${barCol(t)}"></u></i>`;
        (ev.innerHTML = `\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div>\n      <div class="ev-tag" style="margin-top:12px"><canvas class="ev-av" width="250" height="250"></canvas><span class="who">${a}</span><span class="kind">${o}</span></div>\n      <h4><img src="act/profile.png"><span>Profile</span></h4>\n      <table class="prof"><tbody>\n        ${e.royal ? `<tr><td><b>Name:</b> ${e.first} ${state.parents.includes(e) ? SURNAME : e.last}</td></tr><tr><td><b>Title:</b> ${e.royal.title}</td></tr>` : ""}\n        <tr><td><b>Relationship:</b> ${o}</td></tr><tr><td><b>Age:</b> ${t}</td></tr>\n        <tr><td><b>Marital Status:</b> ${r}</td></tr><tr><td><b>Education:</b> ${n.edu}</td></tr>\n        <tr><td><b>Occupation:</b> ${e.celeb ? e.celeb.career : n.job}</td></tr>${e.celeb ? `<tr><td><b>Famous:</b> ${e.celeb.career} · Fame ${e.celeb.level}% · ${ftFmt(e.celeb.fans)} followers</td></tr>` : ""}${mods.showMoney ? `<tr><td><b>Money:</b> ${usd(n.money)}</td></tr>` : ""}</tbody></table>\n      <div class="ev-bars">${i("Relationship", e.rel)}${null != e.kindness ? i("Kindness", e.kindness) : i("Religiousness", n.relig) + i("Generosity", n.gen)}${i("Money", moneyPct(n.money))}</div>`),
          ev.querySelector(".ev-av").replaceWith(npcFace(e.look, s, t, moodOf(e.rel), "ev-av")),
          (ev.style.overflow = "visible"),
          (document.getElementById("propX").onclick = () => {
            evWrap.classList.remove("open"), (ev.style.overflow = "");
          }),
          evWrap.classList.add("open");
      }
      function parentsHouseOffer() {
        if (state.houseOffered || state.age < 18 || !aliveParents().length || state.dead) return;
        const e = aliveParents().filter((e) => (e.rel ?? 60) >= 50),
          t = aliveParents().reduce((e, t) => e + (t.rel ?? 60), 0) / aliveParents().length;
        if (!e.length || t < 55 || (state.pressure && state.pressure.n >= 4) || state.homeless) return;
        state.houseOffered = !0;
        const a =
            e.reduce((e, t) => e + profileOf(t, t.ageAtBirth + state.age).money, 0) *
            (0.25 + 0.45 * Math.random()),
          o = HOUSES.filter((e) => e[2] <= a && !e[4])
            .sort((e, t) => t[2] - e[2])
            .slice(0, 5),
          n = makeListing(o.length ? pickR(o) : ["house18", "Practical Studio", 38e3, 1]);
        o.length || ((n.name = "Practical Studio"), (n.br = 1), (n.ba = 1)), (n.yearsLeft = 0);
        const s = `${n.br}br/${n.ba}ba ${n.name.toLowerCase()}`;
        queuePopup(() =>
          openEvent({
            kind: "Parents",
            make: () => ({
              plain: !0,
              iconSrc: `houses/${n.sprite}.png`,
              title: n.name,
              feedback: !0,
              desc: `Now that you have a job, your parents want to buy you a ${s}.<br><br>How will you react?`,
              table: [
                ["Address", n.addr],
                ["Size", `${n.br}br/${n.ba}ba`],
                ["Age", `${n.built} Years`],
                ["Monthly Expense", usd(n.expense)],
              ],
              bars: [["Condition", n.cond]],
              choices: [
                [
                  "Accept it gratefully",
                  () => (
                    state.props.push(n),
                    e.forEach((t) => {
                      (t.rel = clamp(t.rel + rint(4, 8))),
                        (t.prof.money = Math.max(0, t.prof.money - Math.round(n.price / e.length)));
                    }),
                    fx({ Happiness: 8 }, `My parents bought me a ${s} at ${n.addr}.`)
                  ),
                ],
                [
                  "Turn it down",
                  () => (
                    e.forEach((e) => (e.rel = clamp(e.rel - rint(1, 4)))),
                    `I turned down my parents' offer to buy me a ${n.name.toLowerCase()}.`
                  ),
                ],
              ],
            }),
          }),
        );
      }
      const netWorth = () =>
        state.money +
        state.props.reduce((e, t) => e + Math.round(t.price * (0.8 + t.cond / 250)), 0) +
        state.cars.reduce((e, t) => e + (t.price || 0), 0) +
        (state.heirlooms || []).reduce((e, t) => e + t.value, 0);
      function willCard() {
        if (state.age < 18) return notice("Will & Testament", "You're too young to write a will.", null, !0);
        const children = (state.family || []).filter((e) => "child" === e.kind && !e.dead),
          people = [
            ...(state.spouse && !state.spouse.dead
              ? [`${state.spouse.first} ${state.spouse.last} (Spouse)`]
              : []),
            ...children.map((e) => `${e.first} ${e.last} (${"m" === e.g ? "Son" : "Daughter"})`),
          ],
          options = [
            ["none", "Nobody (the state takes it)"],
            ["split", "Split evenly among my children"],
            ["charity", "Charity"],
            ["animal", "Animal Shelter"],
            ["university", "University"],
            ["church", "Church"],
            ...people.map((e) => [`p:${e.replace(/ \(.*\)$/, "")}`, e]),
          ],
          current = state.willPlan
            ? state.willPlan.key
            : "Charity" === state.will
              ? "charity"
              : state.will
                ? `p:${state.will.replace(/ \(.*\)$/, "")}`
                : "none",
          a = document.getElementById("pname").textContent;
        (ev.innerHTML = `\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div>\n      <div class="jm-tag" style="margin-top:12px">Legal</div>\n      <h4><img src="act/will.png" alt=""><span>Will &amp; Testament</span></h4>\n      <div class="lead">Leave your money and property to family, charity, an organization, split it, or leave it to nobody.</div>\n      <table><tbody><tr><td style="text-align:center;padding-left:0"><b>Name:</b> ${a}</td></tr>\n        <tr><td style="text-align:center;padding-left:0"><b>Net Worth:</b> ${usd(netWorth())}</td></tr></tbody></table>\n      <label class="hr-lab">Pick your beneficiaries:</label>\n      <div class="hr-sel"><select id="willWho">${options.map(([e, t]) => `<option value="${e}"${current === e ? " selected" : ""}>${t}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="willGo">Execute will</button>`),
          (ev.style.overflow = "visible");
        const o = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = o),
          (document.getElementById("willGo").onclick = () => {
            const key = document.getElementById("willWho").value;
            let plan;
            if ("none" === key) plan = { mode: "none", key, label: "nobody" };
            else if ("split" === key) {
              if (!children.length)
                return notice("No children", "You don't have any children to split your estate between.", null, !0);
              plan = {
                mode: "split",
                key,
                label: "my children, split evenly",
                heirs: children.map((e) => `${e.first} ${e.last}`),
              };
            } else if (key.startsWith("p:")) {
              const name = key.slice(2);
              plan = { mode: "one", key, name, label: name };
            } else
              plan = {
                mode: "charity",
                key,
                label: { charity: "charity", animal: "the animal shelter", university: "the university", church: "the church" }[key] || key,
              };
            o(), (state.willPlan = plan), (state.will = "one" === plan.mode ? plan.name : plan.label);
            say(`I executed my will, leaving my estate to ${plan.label}.`),
              notice(
                "Will & Testament",
                `You executed your will. When you die, your estate will go to ${plan.label}.`,
              );
          }),
          evWrap.classList.add("open");
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || !state.props.length) return;
        let e = 0;
        for (const t of state.props)
          (e += 12 * t.expense),
            t.yearsLeft > 0 && ((e += 12 * t.mortgage), t.yearsLeft--),
            (t.cond = Math.max(0, t.cond - rint(1, 4)));
        (state.money = Math.max(0, state.money - e)), renderStats();
      });
