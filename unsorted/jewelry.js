/*! Copyright (c) 2026 Free Life. All rights reserved. Unauthorized copying, re-hosting or redistribution of this code is prohibited. */
(() => {
  const e = (e) => `jewelry/${e}.png`,
    a = (e) => Math.max(5, 5 * Math.round((e * goodsLvl("jewel")) / 5));
  Object.assign(CHARGES, { fraud: [1, 5] });
  const n = 1.85,
    t = {
      Diamond: ["clear", 8e3],
      Emerald: ["green", 6500],
      Ruby: ["red", 5e3],
      Sapphire: ["indigo", 4200],
      Aquamarine: ["blue", 1500],
      Amethyst: ["purple", 700],
      Pearl: ["pearl", 1200],
      "Black Diamond": ["black", 3500],
    },
    i = {
      blue: ["Sapphire", 4200],
      orange: ["Fire Opal", 1800],
      pink: ["Pink Diamond", 11e3],
      red: ["Ruby", 5e3],
      turquoise: ["Paraiba Tourmaline", 7e3],
      yellow: ["Yellow Diamond", 7500],
    },
    o = [
      ["Platinum", "white", 1.15],
      ["18K White Gold", "white", 1.08],
      ["18K Gold", "yellow", 1.05],
      ["14K Gold", "yellow", 1],
      ["14K White Gold", "white", 1],
      ["Sterling Silver", "white", 0.8],
    ],
    l = [
      ["ring", "ring", !1, 12, 1, (e) => `${e} Ring`],
      ["earrings", "earrings", !0, 7, 0.9, (e) => `${e} Earrings`],
      ["pendant", "necklace", !1, 7, 0.8, (e) => `${e} Pendant Necklace`],
      ["bracelet", "bracelet", !1, 6, 1.1, (e) => `${e} Tennis Bracelet`],
    ],
    r = "Luxury Gems",
    s = [
      ["The Polar Star", "ring", "Platinum", "Diamond", 42, 38e6],
      ["Crimson Empress", "ring", "18K Gold", "Ruby", 28, 62e6],
      ["Verdant Throne", "ring", "18K Gold", "Emerald", 31, 45e6],
      ["Midnight Regent", "ring", "Platinum", "Sapphire", 35, 29e6],
      ["Blushing Teardrop", "ring", "18K Rose Gold", "Pink Diamond", 18, 85e6],
      ["Heart of Scarlet", "ring", "18K Gold", "Ruby", 22, 48e6],
      ["Glacier Crown", "ring", "Platinum", "Diamond", 40, 34e6],
      ["Imperial Violet", "ring", "18K Gold", "Purple Diamond", 12, 55e6],
      ["Obsidian Night", "ring", "Blackened Platinum", "Black Diamond", 88, 12e6],
      ["Moon of Persia", "ring", "18K Gold", "Natural Pearl", 60, 9e6],
      ["Aurora Opal", "ring", "18K Gold", "Black Opal", 45, 85e5],
      ["Silver Comet", "ring", "Platinum", "Diamond", 33, 27e6],
      ["Forest Tear", "ring", "18K Gold", "Emerald", 26, 39e6],
      ["Ceylon Sovereign", "ring", "Platinum", "Sapphire", 48, 31e6],
      ["Burma Flame", "ring", "18K Gold", "Ruby", 25, 7e7],
      ["Sakura Dream", "ring", "18K Rose Gold", "Pink Diamond", 20, 95e6],
      ["Golden Sun", "ring", "18K Gold", "Yellow Diamond", 55, 22e6],
      ["Paraiba Lagoon", "ring", "Platinum", "Paraiba Tourmaline", 30, 18e6],
      ["Raven's Tear", "ring", "18K White Gold", "Black Diamond", 70, 11e6],
      ["Rose Heart", "ring", "18K Rose Gold", "Pink Diamond", 16, 78e6],
      ["Ice Palace", "ring", "Platinum", "Diamond", 52, 49e6],
      ["Colombian Queen", "ring", "18K Gold", "Emerald", 29, 36e6],
      ["Violet Majesty", "ring", "Platinum", "Purple Diamond", 14, 64e6],
      ["Sunburst Ruby", "ring", "18K Gold", "Ruby", 24, 57e6],
      ["Trinity Eternal", "ring", "18K Gold", "Diamond", 30, 26e6],
      ["Triple Crossover", "ring", "Tri-Color Gold", "Diamond", 12, 8e6],
      ["Pavé Imperial", "ring", "18K Gold", "Diamond", 15, 1e7],
      ["Ocean Eternity", "ring", "Platinum", "Sapphire", 18, 14e6],
      ["Coronation Ring", "ring", "18K Gold", "Diamond", 20, 21e6],
      ["Blossom Ruby", "ring", "18K Gold", "Ruby", 19, 33e6],
      ["Sapphire of the Seas", "necklace", "18K Gold", "Sapphire", 60, 42e6],
      ["Emerald Monarch", "necklace", "18K Gold", "Emerald", 50, 47e6],
      ["Star of the North", "necklace", "Platinum", "Diamond", 75, 88e6],
      ["Dragon's Blood", "necklace", "18K Gold", "Ruby", 40, 11e7],
      ["Heart of the Deep", "necklace", "Platinum", "Sapphire", 65, 15e7],
      ["The Pink Legacy", "necklace", "18K Rose Gold", "Pink Diamond", 30, 25e7],
      ["The Goliath Link", "chain", "24K Gold", null, 0, 6e6],
      ["Glacier Tennis Chain", "chain", "Platinum", "Diamond", 120, 28e6],
      ["Frozen Cuban", "chain", "18K White Gold", "Diamond", 95, 19e6],
      ["Rosé Monarch Link", "chain", "18K Rose Gold", null, 0, 55e5],
      ["Golden Rope of Midas", "chain", "24K Gold", null, 0, 7e6],
      ["Emerald-Cut Avalanche", "chain", "Platinum", "Diamond", 160, 46e6],
      ["Chandelier Drip", "chain", "18K Gold", "Diamond", 85, 24e6],
      ["Triple Crown Cuban", "chain", "18K Gold", "Diamond", 25, 12e6],
      ["Ruby Royale Collar", "chain", "18K Gold", "Ruby", 110, 58e6],
      ["King of the Jungle", "chain", "18K Gold", "Diamond", 60, 16e6],
      ["Midnight Clover", "chain", "18K Gold", "Black Onyx", 40, 45e5],
      ["Holy Ice Cross", "chain", "Platinum", "Diamond", 90, 22e6],
      ["Two-Tone Avalanche", "chain", "Two-Tone Gold", "Diamond", 130, 26e6],
      ["Sapphire Riviera", "chain", "Platinum", "Sapphire", 140, 51e6],
      ["Rose Vault Pendant", "chain", "18K Rose Gold", "Pink Diamond", 25, 9e7],
      ["The Money Bag", "chain", "18K Gold", "Diamond", 70, 15e6],
      ["Diamond Monarch Butterfly", "chain", "Platinum", "Diamond", 80, 2e7],
      ["Emerald Serpent Cuban", "chain", "18K Gold", "Emerald", 150, 44e6],
      ["Waterfall of Light", "chain", "Platinum", "Diamond", 200, 12e7],
      ["Colombian Riviera", "chain", "18K Gold", "Emerald", 170, 67e6],
      ["Solid Gold Cuban", "chain", "24K Gold", null, 0, 35e5],
      ["Silver Bullet Cuban", "chain", "Platinum", null, 0, 28e5],
      ["Iced Out Cuban", "chain", "18K White Gold", "Diamond", 75, 14e6],
      ["Golden Frost Cuban", "chain", "18K Gold", "Diamond", 70, 13e6],
      ["Pink Lemonade Cuban", "chain", "18K Rose Gold", "Pink Diamond", 65, 72e6],
      ["Rainbow Road", "chain", "18K Gold", "Rainbow Sapphire", 80, 18e6],
      ["Pear Avalanche", "chain", "Platinum", "Diamond", 140, 38e6],
      ["Glacier Lock", "chain", "Platinum", "Diamond", 150, 41e6],
      ["Gilded Lock", "chain", "18K Gold", "Diamond", 145, 39e6],
      ["Thorn Crown Collar", "chain", "Platinum", "Diamond", 90, 23e6],
      ["Golden Faith Cross", "chain", "18K Gold", "Diamond", 20, 4e6],
      ["Iced Cross", "chain", "Platinum", "Diamond", 24, 5e6],
      ["Blood Cross", "chain", "18K Gold", "Ruby", 18, 9e6],
      ["Guardian Angel", "chain", "18K Gold", "Diamond", 30, 65e5],
      ["Ghost Rider Skull", "chain", "18K White Gold", "Diamond", 35, 7e6],
      ["Lion King Crest", "chain", "18K Gold", "Diamond", 40, 85e5],
      ["Ruby Slab", "chain", "18K Gold", "Ruby", 45, 34e6],
      ["Emerald Slab", "chain", "18K Gold", "Emerald", 45, 3e7],
      ["Sapphire Slab", "chain", "18K Gold", "Sapphire", 45, 25e6],
      ["Diamond Slab", "chain", "18K Gold", "Diamond", 50, 55e6],
      ["Big Money Sign", "chain", "18K Gold", "Diamond", 32, 6e6],
      ["Keep It 100", "chain", "Platinum", "Diamond", 38, 75e5],
      ["Praying Hands", "chain", "18K Gold", "Diamond", 28, 55e5],
      ["Iced Panda", "chain", "18K Gold", "Diamond", 42, 8e6],
      ["Bag Secured", "chain", "18K Gold", "Diamond", 36, 68e5],
      ["The World Is Yours", "chain", "Platinum", "Sapphire", 55, 21e6],
      ["Royal Crown", "chain", "18K Gold", "Ruby", 48, 17e6],
      ["Superstar", "chain", "18K Gold", "Diamond", 26, 5e6],
      ["Frostbite Snowflake", "chain", "Platinum", "Diamond", 30, 6e6],
      ["Sky Monarch", "chain", "18K Gold", "Aquamarine", 34, 48e5],
      ["Royal Fleury Cross", "chain", "18K Gold", "Diamond", 22, 45e5],
      ["The Serpent", "chain", "18K White Gold", "Diamond", 25, 52e5],
      ["Emerald Leaf", "chain", "18K Gold", "Emerald", 30, 11e6],
      ["Black Widow", "chain", "18K Gold", "Ruby", 20, 78e5],
      ["Saturn Rising", "chain", "Platinum", "Diamond", 50, 12e6],
      ["Heartbreaker", "chain", "18K Gold", "Ruby", 35, 19e6],
      ["Ice Fang Collar", "chain", "18K White Gold", "Diamond", 110, 29e6],
      ["Diamond Rain Collar", "chain", "Platinum", "Diamond", 125, 37e6],
      ["Golden Garden Collar", "chain", "18K Gold", "Diamond", 95, 22e6],
      ["Asscher Royale", "chain", "18K Gold", "Diamond", 180, 63e6],
    ];
  function c() {
    const e = (() => {
      const e = state.luxStock;
      if (e && e.age === state.age && e.v === s.length) return e.list;
      const n = s
        .map(([e, n, t, i, o, l], r) => {
          const s = d(a(l * (0.9 + 0.2 * Math.random())), 1e4);
          return {
            id: m(),
            img: `lux-${String(r + 1).padStart(2, "0")}`,
            name: e,
            proper: !0,
            noun: n,
            plural: !1,
            metal: t,
            gem: i,
            ct: o,
            quality: rint(92, 100),
            cond: 100,
            fake: !1,
            claim: s,
            value: s,
            price: s,
          };
        })
        .filter((e) => !G().some((a) => a.name === e.name))
        .sort((e, a) => a.price - e.price);
      return (state.luxStock = { age: state.age, v: s.length, list: n }), n;
    })();
    (sTitle.textContent = r.toUpperCase()),
      (sBack.innerHTML = BACK_ICON),
      (sBack.onclick = openShopping),
      (sList.innerHTML = e.length
        ? e
            .map(
              (e, a) =>
                `<div class="row" data-lx="${a}"><img src="${y(e)}" style="object-fit:contain"><div class="t"><b>${e.name}${S(e)}</b><span>${usd(e.price)}</span></div>${DOTS}</div>`,
            )
            .join("")
        : '<div class="row"><div class="t"><b>Sold out</b><span>Come back next year</span></div></div>'),
      sList.querySelectorAll("[data-lx]").forEach((a) => (a.onclick = () => R(e[+a.dataset.lx], !1, r, e))),
      (sList.scrollTop = 0),
      screen.classList.add("open");
  }
  const d = (e, a = 100) => Math.max(a, Math.round(e / a) * a),
    u = () => {
      const e = Math.random();
      return +(
        e < 0.6
          ? 0.25 + 3.75 * Math.random()
          : e < 0.87
            ? 4 + 12 * Math.random()
            : 16 + Math.random() ** 1.5 * 54
      ).toFixed(2);
    },
    h = [
      ...l.map((e) => ({ type: "gem", k: e, w: e[3] })),
      ...[
        ["cocktail-ring", "ring", !1, 3, 1, (e) => `${e} Cocktail Ring`],
        ["chandelier-earrings", "earrings", !0, 3, 1.2, (e) => `${e} Chandelier Earrings`],
        ["choker", "necklace", !1, 3, 1.3, (e) => `${e} Choker`],
        ["encrusted-necklace", "necklace", !1, 3, 1.5, (e) => `${e} Statement Necklace`],
      ].map((e) => ({ type: "color", k: e, w: e[3] })),
      ...[
        ["ring-yellow", "Gold Ring", "ring", "18K Gold", [400, 2500], 2],
        ["ring-white", "Platinum Ring", "ring", "Platinum", [700, 4e3], 2],
        ["ring-white", "Titanium Ring", "ring", "Titanium", [150, 900], 1],
        ["earrings-yellow", "Gold Hoop Earrings", "earrings", "18K Gold", [250, 3e3], 2],
        ["earrings-white", "Silver Drop Earrings", "earrings", "Sterling Silver", [60, 600], 2],
        ["pendant-yellow", "Gold Pendant Necklace", "necklace", "18K Gold", [300, 6e3], 2],
        ["pendant-white", "Silver Pendant Necklace", "necklace", "Sterling Silver", [80, 900], 2],
        ["bracelet-yellow", "Gold Link Bracelet", "bracelet", "18K Gold", [900, 18e3], 2],
        ["bracelet-white", "Silver Link Bracelet", "bracelet", "Sterling Silver", [120, 1500], 2],
        ["chains", "Cuban Link Chain", "chain", "Sterling Silver", [300, 45e3], 3],
        ["charm-yellow-pearl", "Gold Pearl Charm", "charm", "18K Gold", [150, 2500], 1],
        ["charm-white-pearl", "Silver Pearl Charm", "charm", "Sterling Silver", [60, 800], 1],
        ["grillz-gold", "Gold Grillz", "grillz", "18K Gold", [900, 14000], 1],
        ["grillz-silver", "Silver Grillz", "grillz", "Sterling Silver", [250, 3000], 1],
        ["grillz-diamond", "Diamond Grillz", "grillz", "18K White Gold", [12000, 450000], 0.5],
        ["grill1", "Gold Grillz No. 1", "grillz", "18K Gold", [1200, 25000], 1.3],
        ["grill2", "Iced Gold Grillz No. 2", "grillz", "18K Gold", [25000, 450000], 0.9],
        ["grill3", "Silver Grillz No. 3", "grillz", "Sterling Silver", [300, 4000], 1.2],
        ["grill4", "Two-Tone Grillz No. 4", "grillz", "14K Gold", [3000, 60000], 1.0],
        ["grill5", "Silver Grillz No. 5", "grillz", "Sterling Silver", [300, 4000], 1.2],
        ["grill6", "Two-Tone Grillz No. 6", "grillz", "14K Gold", [3000, 60000], 1.0],
        ["grill7", "Silver Grillz No. 7", "grillz", "Sterling Silver", [300, 4000], 1.2],
        ["grill8", "Silver Grillz No. 8", "grillz", "Sterling Silver", [300, 4000], 1.2],
        ["grill9", "Two-Tone Grillz No. 9", "grillz", "14K Gold", [3000, 60000], 1.0],
        ["grill10", "Gold Grillz No. 10", "grillz", "18K Gold", [1200, 25000], 1.3],
        ["grill11", "Gold Grillz No. 11", "grillz", "18K Gold", [1200, 25000], 1.3],
        ["grill12", "Two-Tone Grillz No. 12", "grillz", "14K Gold", [3000, 60000], 1.0],
        ["grill13", "Gold Grillz No. 13", "grillz", "18K Gold", [1200, 25000], 1.3],
        ["grill14", "Iced Gold Grillz No. 14", "grillz", "18K Gold", [25000, 450000], 0.9],
        ["grill15", "Gold Grillz No. 15", "grillz", "18K Gold", [1200, 25000], 1.3],
        ["grill16", "Two-Tone Grillz No. 16", "grillz", "14K Gold", [3000, 60000], 1.0],
        ["grill17", "Iced Gold Grillz No. 17", "grillz", "18K Gold", [25000, 450000], 0.9],
        ["grill18", "Silver Grillz No. 18", "grillz", "Sterling Silver", [300, 4000], 1.2],
        ["grill19", "Black Diamond Grillz No. 19", "grillz", "18K White Gold", [60000, 900000], 0.5],
        ["grill20", "Gold Grillz No. 20", "grillz", "18K Gold", [1200, 25000], 1.3],
        ["grill21", "Iced Gold Grillz No. 21", "grillz", "18K Gold", [25000, 450000], 0.9],
        ["grill22", "Silver Grillz No. 22", "grillz", "Sterling Silver", [300, 4000], 1.2],
        ["grill23", "Iced Gold Grillz No. 23", "grillz", "18K Gold", [25000, 450000], 0.9],
        ["grill24", "Ruby & Sapphire Grillz No. 24", "grillz", "18K White Gold", [60000, 900000], 0.4],
        ["grill25", "Emerald Gold Grillz No. 25", "grillz", "18K Gold", [40000, 600000], 0.5],
        ["grill26", "Diamond Grillz No. 26", "grillz", "18K White Gold", [15000, 500000], 0.8],
        ["grill27", "Two-Tone Grillz No. 27", "grillz", "14K Gold", [3000, 60000], 1.0],
        ["grill28", "Diamond Grillz No. 28", "grillz", "18K White Gold", [15000, 500000], 0.8],
        ["grill29", "Silver Grillz No. 29", "grillz", "Sterling Silver", [300, 4000], 1.2],
        ["grill30", "Ruby Grillz No. 30", "grillz", "18K White Gold", [40000, 700000], 0.5],
        ["grill31", "Iced Gold Grillz No. 31", "grillz", "18K Gold", [25000, 450000], 0.9],
        ["grill32", "Emerald Grillz No. 32", "grillz", "18K White Gold", [40000, 600000], 0.5],
        ["grill33", "Gold Grillz No. 33", "grillz", "18K Gold", [1200, 25000], 1.3],
        ["watch", "Basic Watch", "watch", "Plastic", [20, 150], 1],
        ["watch-white", "Two-Tone Watch", "watch", "Stainless Steel", [500, 9e3], 2],
        ["watch-gold", "Gold Watch", "watch", "18K Gold", [2500, 6e4], 2],
        ["watch-blue", "Blue Dial Watch", "watch", "Stainless Steel", [150, 4e3], 1],
        ["watch-red", "Red Dial Watch", "watch", "Stainless Steel", [150, 4e3], 1],
        ["watch-turquoise", "Turquoise Dial Watch", "watch", "Stainless Steel", [150, 4e3], 1],
        ["watch-pink", "Pink Dial Watch", "watch", "Stainless Steel", [150, 4e3], 1],
        ["watch-orange", "Orange Dial Watch", "watch", "Stainless Steel", [150, 4e3], 1],
        ["watch-yellow", "Yellow Dial Watch", "watch", "Stainless Steel", [150, 4e3], 1],
        ["watch-cyril-kongo", "Graffiti Art Watch", "watch", "Titanium", [4e4, 35e4], 1],
        ["watch-big-bang", "Diamond Sport Watch", "watch", "18K Gold", [3e4, 15e5], 1],
        ["watch-daytona-unicorn", "White Gold Chronograph", "watch", "18K White Gold", [25e4, 6e6], 1],
        [
          "watch-paul-newman-daytona",
          "Vintage Racing Chronograph",
          "watch",
          "Stainless Steel",
          [4e5, 18e6],
          0.6,
        ],
        ["watch-marie-antoinette", "Antique Royal Pocket Watch", "watch", "18K Gold", [2e6, 3e7], 0.3],
        ["watch-hallucination", "Rainbow Diamond Watch", "watch", "Platinum", [5e6, 55e6], 0.3],
        ["watch-01-datejust-steel", "Steel Dress Watch", "watch", "Stainless Steel", [4000, 25000], 1],
        ["watch-02-chrono-gold", "Gold Chronograph", "watch", "18K Gold", [20000, 300000], 1],
        ["watch-03-octagon-blue", "Octagon Sport Watch", "watch", "Stainless Steel", [30000, 500000], 1],
        ["watch-04-nautilus-rose", "Rose Gold Sport Watch", "watch", "18K Rose Gold", [40000, 900000], 1],
        ["watch-05-skeleton-tonneau", "Skeleton Tonneau Watch", "watch", "Titanium", [150000, 2500000], 1],
        ["watch-06-square-roman", "Square Roman Watch", "watch", "Stainless Steel", [3000, 20000], 1],
        ["watch-07-diver-black", "Diver Watch", "watch", "Stainless Steel", [5000, 30000], 1],
        ["watch-08-prx-blue", "Blue Dial Dress Watch", "watch", "Stainless Steel", [500, 3000], 1],
        ["watch-09-pilot-chrono", "Pilot Chronograph", "watch", "Stainless Steel", [4000, 25000], 1],
        ["watch-10-speed-chrono", "Moonwatch Chronograph", "watch", "Stainless Steel", [5000, 40000], 1],
        ["watch-11-daydate-green", "Green Dial Gold Watch", "watch", "18K Gold", [30000, 400000], 1],
        ["watch-12-tank-leather", "Leather Strap Watch", "watch", "Stainless Steel", [3000, 30000], 1],
        ["watch-13-submariner-black", "Black Diver Watch", "watch", "Stainless Steel", [8000, 60000], 1],
        ["watch-14-royaloak-blue", "Blue Octagon Luxury Watch", "watch", "Stainless Steel", [30000, 600000], 0.8],
        ["watch-15-nautilus-grey", "Grey Dial Sport Watch", "watch", "Stainless Steel", [80000, 1500000], 0.6],
        ["watch-16-speedmaster-black", "Black Chronograph Watch", "watch", "Stainless Steel", [5000, 40000], 1],
        ["watch-17-santos-square", "Square Steel Watch", "watch", "Stainless Steel", [6000, 40000], 1],
        ["watch-18-carrera-chrono", "Racing Chronograph Watch", "watch", "Stainless Steel", [4000, 25000], 1],
        ["watch-19-rm-skeleton", "Skeleton Racing Watch", "watch", "Titanium", [150000, 2500000], 0.5],
        ["watch-20-hublot-black", "Black Ceramic Chronograph", "watch", "Ceramic", [10000, 90000], 0.9],
        ["watch-21-datejust-silver", "Silver Fluted Watch", "watch", "Stainless Steel", [5000, 30000], 1],
        ["watch-22-tank-roman", "Roman Dial Leather Watch", "watch", "Stainless Steel", [3000, 30000], 1],
        ["watch-23-navitimer-pilot", "Aviator Chronograph", "watch", "Stainless Steel", [5000, 35000], 1],
        ["watch-24-seiko-dark", "Dark Dial Dress Watch", "watch", "Stainless Steel", [300, 3000], 1.4],
        ["tooth-01-gold-pave", "Iced Gold Tooth Cap", "grillz", "18K Gold", [8000, 90000], 0.8],
        ["tooth-02-gold-cross", "Gold Cross Tooth Cap", "grillz", "18K Gold", [500, 6000], 1.2],
        ["tooth-03-silver-pave", "Iced Silver Tooth Cap", "grillz", "Sterling Silver", [3000, 40000], 0.9],
        ["tooth-04-gold-flames", "Flame Tooth Cap", "grillz", "18K Gold", [900, 9000], 1],
        ["tooth-05-silver-star", "Diamond Star Tooth Cap", "grillz", "Sterling Silver", [1500, 20000], 1],
        ["tooth-06-gold-dollar", "Dollar Sign Tooth Cap", "grillz", "18K Gold", [700, 8000], 1.1],
        ["tooth-07-silver-bunny", "Black Enamel Bunny Tooth Cap", "grillz", "Sterling Silver", [400, 5000], 1],
        ["tooth-08-gold-drip", "Gold Drip Tooth Cap", "grillz", "18K Gold", [600, 7000], 1.1],
        ["tooth-09-gold-smiley", "Smiley Tooth Cap", "grillz", "18K Gold", [600, 7000], 1.1],
        ["tooth-10-silver-pave-grid", "Diamond Grid Tooth Cap", "grillz", "18K White Gold", [5000, 60000], 0.8],
        ["tooth-11-gold-crown", "Gold Crown Tooth Cap", "grillz", "18K Gold", [900, 10000], 1],
        ["tooth-12-silver-diamond", "Big Diamond Tooth Cap", "grillz", "Platinum", [20000, 400000], 0.5],
        ["cuban-01", "Gold Cuban Chain", "chain", "18K Gold", [800, 12000], 1.5],
        ["cuban-02", "Heavy Gold Cuban Chain", "chain", "18K Gold", [3000, 60000], 1],
        ["cuban-03", "Iced Cuban Chain", "chain", "18K White Gold", [30000, 900000], 0.6],
        ["cuban-04", "Heavy Gold Cuban Chain", "chain", "18K Gold", [3000, 60000], 1],
        ["cuban-05", "Gold Cuban Chain", "chain", "18K Gold", [800, 12000], 1.5],
        ["cuban-06", "Iced Cuban Chain", "chain", "18K White Gold", [30000, 900000], 0.6],
        ["cuban-07", "Box Clasp Cuban Chain", "chain", "18K Gold", [2000, 30000], 1],
        ["cuban-08", "Heavy Gold Cuban Chain", "chain", "18K Gold", [3000, 60000], 1],
        ["cuban-09", "Iced Cuban Chain", "chain", "18K White Gold", [30000, 900000], 0.6],
        ["cuban-10", "Diamond Clasp Cuban Chain", "chain", "18K Gold", [150000, 2500000], 0.4],
        ["cuban-11", "Heavy Gold Cuban Chain", "chain", "18K Gold", [3000, 60000], 1],
        ["cuban-12", "Iced Cuban Chain", "chain", "18K White Gold", [30000, 900000], 0.6],
        ["cuban-13", "Box Clasp Cuban Chain", "chain", "18K Gold", [2000, 30000], 1],
        ["cuban-14", "Heavy Gold Cuban Chain", "chain", "18K Gold", [3000, 60000], 1],
        ["cuban-15", "Iced Cuban Chain", "chain", "18K White Gold", [30000, 900000], 0.6],
        ["cuban-16", "Gold Cuban Chain", "chain", "18K Gold", [800, 12000], 1.5],
        ["cuban-17", "Diamond Clasp Cuban Chain", "chain", "18K Gold", [150000, 2500000], 0.4],
        ["cuban-18", "Gold Cuban Chain", "chain", "18K Gold", [800, 12000], 1.5],
        ["cuban-19", "Iced Cuban Chain", "chain", "18K White Gold", [30000, 900000], 0.6],
        ["cuban-20", "Heavy Gold Cuban Chain", "chain", "18K Gold", [3000, 60000], 1],
        ["gem-01-solitaire-ring", "Diamond Solitaire Ring", "ring", "Platinum", [4000, 90000], 1.2],
        ["gem-02-emerald-pendant", "Emerald Pendant Necklace", "necklace", "18K Gold", [3000, 60000], 1],
        ["gem-03-tennis-bracelet", "Diamond Tennis Bracelet", "bracelet", "18K Gold", [6000, 150000], 1],
        ["gem-04-sapphire-studs", "Sapphire Stud Earrings", "earrings", "18K Gold", [1500, 40000], 1],
        ["gem-05-lion-signet", "Lion Signet Ring", "ring", "18K Gold", [900, 12000], 1],
        ["gem-06-ruby-halo-ring", "Ruby Halo Ring", "ring", "Platinum", [5000, 120000], 0.9],
        ["gem-07-pearl-bracelet", "Pearl Bracelet", "bracelet", "18K White Gold", [800, 15000], 1],
        ["gem-08-heart-pendant", "Pink Heart Pendant", "necklace", "18K Gold", [600, 9000], 1],
        ["gem-09-diamond-watch", "Diamond Pave Watch", "watch", "18K White Gold", [40000, 600000], 0.6],
        ["gem-10-sapphire-gold-ring", "Sapphire Gold Ring", "ring", "18K Gold", [3500, 80000], 0.9],
        ["gem-11-drop-earrings", "Diamond Drop Earrings", "earrings", "Platinum", [8000, 200000], 0.8],
        ["gem-12-gold-bangle", "Gold Bangle", "bracelet", "18K Gold", [700, 18000], 1.2],
        ["anc-01-falcon-collar", "Ancient Falcon Collar", "necklace", "24K Gold", [250000, 6000000], 0.25],
        ["anc-02-royal-crown", "Royal Pearl Crown", "crown", "22K Gold", [500000, 12000000], 0.15],
        ["anc-03-lapis-seal-ring", "Lapis Seal Ring", "ring", "22K Gold", [60000, 1500000], 0.3],
        ["anc-04-jade-mask-pendant", "Jade Mask Pendant", "necklace", "Jade", [80000, 2000000], 0.25],
        ["anc-05-lion-cuff", "Lion Cuff", "bracelet", "22K Gold", [120000, 3000000], 0.25],
        ["anc-06-ruby-pearl-brooch", "Ruby Pearl Brooch", "brooch", "Silver", [90000, 2500000], 0.25],
        ["anc-07-coin-necklace", "Ancient Coin Necklace", "necklace", "22K Gold", [40000, 900000], 0.3],
        ["anc-08-emerald-ring", "Emerald Seal Ring", "ring", "22K Gold", [150000, 3500000], 0.2],
        ["anc-09-pearl-collar", "Pearl Collar", "necklace", "Pearl", [120000, 3000000], 0.25],
        ["anc-10-lion-bangle", "Lion Bangle", "bracelet", "22K Gold", [70000, 1800000], 0.3],
        ["anc-11-ruby-brooch", "Ruby Cross Brooch", "brooch", "22K Gold", [100000, 2200000], 0.25],
        ["anc-12-dragon-cuff", "Dragon Cuff", "bracelet", "22K Gold", [200000, 5000000], 0.2],
      ].map((e) => ({ type: "plain", p: e, w: e[5] })),
    ],
    m = () => Math.random().toString(36).slice(2);
  function p(e, r) {
    const s = r
        ? { type: "gem", k: l[0] }
        : ((e) => {
            let a = Math.random() * e.reduce((e, a) => e + a.w, 0);
            for (const n of e) if ((a -= n.w) < 0) return n;
            return e[0];
          })(h),
      c = rint(30, 100),
      p = { id: m(), quality: c, cond: 100, fake: !!e };
    let g;
    if ("plain" === s.type) {
      const [e, n, t, i, [o, l]] = s.p,
        r = a(d(o + (l - o) * Math.random() ** 2.2, 10));
      g = { ...p, img: e, name: n, noun: t, plural: "earrings" === t, metal: i, gem: null, ct: 0, claim: r };
    } else if ("gem" === s.type) {
      const [e, i, l, , h, m] = s.k,
        y = 2 === r,
        $ = y
          ? "Diamond"
          : r
            ? pickR(["Diamond", "Diamond", "Emerald", "Ruby", "Sapphire"])
            : pickR(Object.keys(t)),
        [w, f, k] = y ? pickR(o.slice(0, 3)) : pickR(o),
        b = y
          ? +(50 + 25 * Math.random()).toFixed(2)
          : r
            ? +(20 + Math.random() ** 1.3 * 50).toFixed(2)
            : u();
      g = {
        ...p,
        img: `${e}-${f}-${t[$][0]}`,
        name: m($),
        noun: i,
        plural: l,
        metal: w,
        gem: $,
        ct: b,
        claim: a(d(t[$][1] * b ** n * h * k * (0.75 + c / 400))),
      };
    } else {
      const [e, t, o, , l, r] = s.k,
        h = pickR(Object.keys(i)),
        [m, y] = i[h],
        $ = pickR(["18K Gold", "Platinum", "18K White Gold"]),
        w = u();
      g = {
        ...p,
        img: `${e}-${h}`,
        name: r(m),
        noun: t,
        plural: o,
        metal: $,
        gem: m,
        ct: w,
        claim: a(d(y * w ** n * l * (0.75 + c / 400))),
      };
    }
    return (g.value = e ? a(rint(10, 120)) : g.claim), g;
  }
  const g = (e) => (
      e.img || (e.img = `ring-${e.tone || "white"}${e.gem && t[e.gem] ? "-" + t[e.gem][0] : ""}`),
      (e.noun ||= "ring"),
      e
    ),
    y = (a) => e(g(a).img),
    $ = (e) => `${e.fake && e.known ? "Fake " : ""}${e.name}`,
    w = (e) => (e.proper ? $(e) : $(e).toLowerCase()),
    f = (e) => g(e).noun,
    k = (e) => (e.plural ? "are" : "is"),
    b = (e) => (e.plural ? "they" : "it"),
    S = (e) => (e.ct ? ` <em>(${e.ct}ct)</em>` : ""),
    G = () => (state.jewelry ||= []),
    v = (e) => {
      const a = e ? "fakeStock" : "jewelStock",
        n = state[a];
      if (n && n.age === state.age && 6 === n.v) return n.list;
      const t = e
        ? Array.from({ length: rint(55, 64) }, C)
        : [
            p(!1, 2),
            ...Array.from({ length: rint(4, 6) }, () => p(!1, !0)),
            ...Array.from({ length: rint(50, 58) }, () => p(!1)),
          ];
      return (
        t.forEach((e) => {
          (e.price = D(e)), e.fake && (e.value = K(e.price));
        }),
        t.sort((e, a) => a.price - e.price),
        (state[a] = { age: state.age, v: 6, list: t }),
        t
      );
    };
  function C() {
    for (let e = 0; e < 25; e++) {
      const e = p(!0);
      if (e.ct) {
        const a = +(0.4 + Math.random() ** 1.5 * 2.1).toFixed(2);
        (e.claim = d(e.claim * (a / e.ct) ** n, 10)), (e.ct = a);
      }
      if (e.claim <= a(6e4)) return e;
    }
    return p(!0);
  }
  const D = (e) => {
      return e.fake
        ? ((a = ((e) =>
            Math.min(
              65,
              Math.max(
                10,
                Math.round(4 + 8 * Math.log10(Math.max(10, e.claim)) + 10 * (Math.random() - 0.5)),
              ),
            ))(e)),
          Math.max(1, Math.round(a * goodsLvl("jewel"))))
        : e.claim;
      var a;
    },
    K = (e) => Math.max(1, Math.round(e * (0.6 + 0.2 * Math.random())));
  function M(e) {
    const a = e ? state.shops.fake : state.shops.jewel,
      n = v(e);
    (sTitle.textContent = a.toUpperCase()),
      (sBack.innerHTML = BACK_ICON),
      (sBack.onclick = openShopping),
      n.forEach((e) => (e.price ??= D(e))),
      (sList.innerHTML = n
        .map(
          (a, n) =>
            `<div class="row" data-jw="${n}"><img src="${y(a)}" style="object-fit:contain"><div class="t"><b>${e ? "Fake " : ""}${a.name}${S(a)}</b><span>${usd(a.price)}</span></div>${DOTS}</div>`,
        )
        .join("")),
      sList.querySelectorAll("[data-jw]").forEach((t) => (t.onclick = () => R(n[+t.dataset.jw], e, a))),
      (sList.scrollTop = 0),
      screen.classList.add("open");
  }
  function R(e, a, n, t) {
    const i = `${a ? "Fake " : ""}${e.name}`,
      o = e.proper ? i : i.toLowerCase(),
      l = e.plural || e.proper ? "" : /^[aeiou]/i.test(o) ? "an " : "a ";
    jCard({
      tag: "Jewel",
      iconSrc: y(e),
      title: i,
      close: !0,
      lead: `Buy ${e.proper ? "" : e.plural ? "these " : "this "}${o} today!`,
      rows: [
        ["Price", usd(e.price)],
        ...(e.gem ? [["Gemstone", `${a ? "Fake " : ""}${e.gem}`], ...(e.ct ? [["Carats", e.ct]] : [])] : []),
        ["Metal", `${a ? "Fake " : ""}${e.metal}`],
      ],
      bars: [["Quality", e.quality]],
      choices: [
        [
          "Buy it",
          () => {
            if (state.money < e.price) return notice("Not enough", `You can't afford the ${o}.`, null, !0);
            (state.money -= e.price), renderStats(), chaChing();
            const i = t || v(a),
              r = i.indexOf(e);
            r >= 0 && i.splice(r, 1),
              G().push({ ...e, known: a, from: n, acquired: state.age, price: void 0, paid: e.price }),
              say(`I bought ${l}${o}${e.ct ? ` (${e.ct}ct)` : ""} from ${n} for ${usd(e.price)}.`),
              screen.classList.remove("open"),
              notice("VVS only", `You are now the owner of ${l}${o}.`, null, !0);
          },
        ],
      ],
    });
  }
  function P() {
    if (!G().length) return openAssets();
    (sTitle.textContent = "JEWELRY"),
      (sBack.innerHTML = BACK_ICON),
      (sBack.onclick = openAssets),
      (sList.innerHTML =
        G()
          .map(
            (e, a) =>
              `<div class="row" data-my="${a}"><img src="${y(e)}" style="object-fit:contain"><div class="t"><b>${$(e)}${S(e)}</b>${sBar("Condition", e.cond)}</div>${CHEV}</div>`,
          )
          .join("") +
        `<div class="shopbtn" id="cleanAll" style="background:#14d6d6"><img src="${e("clean")}" alt=""><span>Clean All Jewelry...</span></div>`),
      sList.querySelectorAll("[data-my]").forEach(
        (e) =>
          (e.onclick = () => {
            play("choice"), T(G()[+e.dataset.my]);
          }),
      ),
      (document.getElementById("cleanAll").onclick = () => {
        play("choice"),
          G().forEach((e) => (e.cond = 100)),
          say("I cleaned all of my jewelry."),
          P(),
          notice("Sparkling", "You cleaned all of your jewelry. It looks brand new!", null, !0);
      }),
      (sList.scrollTop = 0),
      screen.classList.add("open");
  }
  function T(n) {
    const t = f(n),
      i = `your ${t}`;
    (sTitle.textContent = t.toUpperCase()),
      (sSub.style.display = "none"),
      (sBack.innerHTML = BACK_ICON),
      (sBack.onclick = P);
    const o = "it" === b(n) ? "it" : "them",
      l = {
        appraise: e("appraise"),
        clean: e("clean"),
        discard: "cars/ui-sign-litter.png",
        donate: "stat-emoji/face-halo.png",
        gift: e("gift"),
        sell: "cars/ui-hand-waving.png",
        wear: "emoji/1f48e.png",
      },
      r = (e, a, n) =>
        `<div class="row" data-ra="${e}"><img src="${l[e]}" style="object-fit:contain"><div class="t"><b>${a}</b><span>${n}</span></div>${DOTS}</div>`;
    (sList.innerHTML =
      `<div class="row jv" data-ra="view"><img src="${y(n)}" style="object-fit:contain"><div class="t"><b>${$(n)}${S(n)}</b><span>View ${i}</span></div>${DOTS}</div><div class="sec">Activities</div>` +
      (window.FL_JEWEL_WEAR && FL_JEWEL_WEAR.slot(n)
        ? r("wear", FL_JEWEL_WEAR.worn(n) ? "Take off" : "Wear", `Wear ${o} on your ${FL_JEWEL_WEAR.slot(n)}`)
        : "") +
      r("appraise", "Appraise", `Get ${o} appraised`) +
      r("clean", "Clean", `Get ${o} cleaned`) +
      r("discard", "Discard", `Get rid of ${o}`) +
      r("donate", "Donate", `Donate ${o} to charity`) +
      r("gift", "Gift", `Give ${o} to someone`) +
      r("sell", "Sell", `Sell ${o}`)),
      sList.querySelectorAll("[data-ra]").forEach(
        (t) =>
          (t.onclick = () =>
            ({
              view: () =>
                (function (e) {
                  jCard({
                    tag: "Jewel",
                    iconSrc: y(e),
                    title: $(e),
                    close: !0,
                    rows: [
                      ["Significance", e.sig || `Purchased from ${e.from || "a jeweler"}`],
                      ...(e.gem
                        ? [
                            ["Gemstone", e.fake && e.known ? `Imitation ${e.gem}` : e.gem],
                            ["Carats", e.ct],
                          ]
                        : []),
                      ["Metal", e.metal],
                      ["Years in Family", Math.max(0, state.age - (e.acquired ?? state.age))],
                      ["Estimated Value", usd(e.fake && e.known ? e.value : e.claim)],
                    ],
                    bars: [
                      ["Quality", e.fake && e.known ? Math.min(e.quality, 35) : e.quality],
                      ["Condition", e.cond],
                    ],
                  });
                })(n),
              appraise: () =>
                (function (e) {
                  const n = a(100);
                  if (state.money < n) return L("Not enough", `An appraisal costs ${usd(n)}.`, null, !1);
                  state.money -= n;
                  const t = `${e.ct ? `${e.ct}-carat ` : ""}${e.name.toLowerCase()}`;
                  if (e.fake)
                    return (
                      (e.known = !0),
                      (e.appraised = !0),
                      L(
                        "Appraisal Results",
                        `You had your ${t} appraised by a professional jeweler.<br><br>Unfortunately, the jeweler discovered that your ${f(e)} ${k(e)} counterfeit, made from inexpensive materials!<br><br>Estimated value: ${usd(e.value)}<br>Appraisal fee: ${usd(n)}`,
                        `I found out my ${t} ${k(e)} fake.`,
                      )
                    );
                  (e.appraised = !0),
                    (e.claim = d(e.claim * (0.9 + 0.2 * Math.random()), 10)),
                    (e.value = e.claim),
                    L(
                      "Appraisal Results",
                      `You had your ${t} appraised by a professional jeweler.<br><br>The jeweler confirmed ${b(e)} ${e.plural ? "are" : "is"} genuine!<br><br>Estimated value: ${usd(Math.round(e.claim * (0.5 + e.cond / 200)))}<br>Appraisal fee: ${usd(n)}`,
                      `I had my ${t} appraised.`,
                    );
                })(n),
              sell: () =>
                (function (e) {
                  const n = Math.round(e.claim * (0.5 + e.cond / 200));
                  Math.max(5, Math.round(e.value * (0.4 + e.cond / 200)));
                  if (e.fake && e.known)
                    return (function (e) {
                      const n = w(e),
                        t = Math.max(50, e.claim),
                        i = Math.max(1, Math.round((e.value || 20) * (0.4 + e.cond / 200))),
                        o = [
                          50, 100, 250, 500, 1e3, 2e3, 5e3, 1e4, 25e3, 5e4, 1e5, 25e4, 5e5, 1e6, 25e5, 5e6,
                          1e7,
                        ].map(a),
                        l = [...new Set(o.filter((e) => e <= Math.min(1.6 * t, a(5e4))))].slice(-10);
                      l.length || l.push(a(50));
                      const r = Math.min(0.6 * t, a(2e3)),
                        s = l.reduce((e, a) => (Math.abs(a - r) < Math.abs(e - r) ? a : e), l[0]);
                      jCard({
                        tag: "Jewel",
                        iconSrc: y(e),
                        title: $(e),
                        close: !0,
                        lead: `Try to sell your ${n} today!`,
                        rows: [
                          ...(e.gem ? [["Gemstone", `Fake ${e.gem}`]] : []),
                          ["Metal", `Fake ${e.metal}`],
                          ["Years in Family", Math.max(0, state.age - (e.acquired ?? state.age))],
                          ["Estimated Value", usd(i)],
                        ],
                        bars: [
                          ["Quality", e.quality],
                          ["Condition", e.cond],
                        ],
                        choices: [
                          [
                            "Sell it to someone as real",
                            () =>
                              (function (e, n) {
                                const t = w(e),
                                  i = n / Math.max(50, e.claim),
                                  o = n <= a(500) ? 1 : Math.max(0.15, 1 - 0.35 * Math.log10(n / a(500)));
                                if (
                                  !chance(
                                    (i <= 0.3
                                      ? 0.85
                                      : i <= 0.7
                                        ? 0.7
                                        : i <= 1
                                          ? 0.55
                                          : i <= 1.5
                                            ? 0.3
                                            : 0.12) * o,
                                  )
                                )
                                  return L(
                                    "No bites",
                                    `Nobody wanted to buy your ${t}.`,
                                    `I tried to sell my ${t} as real, but nobody bit.`,
                                  );
                                const l = pickR(E),
                                  r = chance(0.5) ? "m" : "f",
                                  s = "m" === r ? "him" : "her",
                                  c = "m" === r ? "He" : "She",
                                  d = /^[aeio]/.test(l) ? "An" : "A",
                                  u = Math.max(
                                    1,
                                    Math.round((n * (0.55 + 0.45 * Math.random())) / (n >= 1e3 ? 100 : 10)) *
                                      (n >= 1e3 ? 100 : 10),
                                  );
                                setTimeout(
                                  () =>
                                    jCard({
                                      tag: "Jewel",
                                      iconSrc: y(e),
                                      title: $(e),
                                      surprise: !0,
                                      lead: `${d} ${l} has agreed to give you ${usd(u)} for your ${t}.<br><br>What will you do?`,
                                      choices: [
                                        [
                                          `Sell it to ${s}`,
                                          () => {
                                            const n = Math.min(
                                              0.5,
                                              Math.max(0, 0.22 * Math.log10(u / Math.max(1, a(500)))),
                                            );
                                            if (
                                              !chance(
                                                Math.min(
                                                  0.9,
                                                  0.25 +
                                                    n +
                                                    (e.quality < 50 ? 0.15 : 0) +
                                                    (i > 1 ? 0.2 : 0) +
                                                    (e.cond < 50 ? 0.1 : 0),
                                                ),
                                              )
                                            )
                                              return (
                                                A(e),
                                                (state.money += u),
                                                chaChing(),
                                                L(
                                                  "Stuffing my pockets",
                                                  `You sold your ${t} to ${d.toLowerCase()} ${l} for ${usd(u)}.`,
                                                  `I sold my ${t} to ${d.toLowerCase()} ${l} for ${usd(u)}.`,
                                                  !1,
                                                )
                                              );
                                            A(e),
                                              say(
                                                `I tried to pass off my ${t} as real, but the buyer figured it out and called the police.`,
                                              ),
                                              screen.classList.remove("open"),
                                              notice(
                                                "It's real I tell ya",
                                                `${c} identified that the ${t} you sold ${s} was a fake and turned you into the police!`,
                                                () => busted("fraud"),
                                                !0,
                                              );
                                          },
                                        ],
                                        ["Never mind, keep it", () => say(`I decided to keep my ${t}.`)],
                                      ],
                                    }),
                                  60,
                                );
                              })(e, +document.getElementById("fkPrice").value),
                          ],
                        ],
                      }),
                        ev
                          .querySelector(".ev-btn")
                          .insertAdjacentHTML(
                            "beforebegin",
                            `<label class="hr-lab">Pick your list price:</label>\n      <div class="hr-sel"><select id="fkPrice">${l.map((e) => `<option value="${e}"${e === s ? " selected" : ""}>${usd(e)}</option>`).join("")}</select></div>`,
                          );
                    })(e);
                  jCard({
                    tag: "Jewel",
                    iconSrc: y(e),
                    title: "Sell Jewelry",
                    close: !0,
                    lead: `A buyer is interested in your ${w(e)}.<br><br>What will you do?`,
                    rows: [["Offer", usd(n)]],
                    choices: [
                      [
                        "Sell it",
                        () => {
                          if (e.fake)
                            return (function (e, a, n) {
                              const t = chance(n ? 0.5 : 0.45),
                                i = e.name.toLowerCase();
                              if (!t)
                                return (
                                  A(e),
                                  (state.money += a),
                                  chaChing(),
                                  L(
                                    n ? "Sold" : "Fraud Succeeds",
                                    n
                                      ? `You sold your ${i} for ${usd(a)}.`
                                      : `The buyer paid ${usd(a)}, unaware that the ${f(e)} ${e.plural ? "were" : "was"} counterfeit.`,
                                    n
                                      ? `I sold my ${i} for ${usd(a)}.`
                                      : `I passed off a fake ${i} as genuine and sold ${"they" === b(e) ? "them" : "it"} for ${usd(a)}.`,
                                  )
                                );
                              if (((e.known = !0), n || chance(0.5)))
                                return L(
                                  "Buyer Detects Fake",
                                  `The buyer realized the ${f(e)} ${e.plural ? "were" : "was"} fake and refused to purchase ${e.plural ? "them" : "it"}.${n ? `<br><br>Your ${f(e)} ${k(e)} counterfeit!` : ""}`,
                                  n
                                    ? `A buyer told me my ${i} ${k(e)} fake.`
                                    : `A buyer caught on that my ${i} ${e.plural ? "were" : "was"} fake.`,
                                );
                              say(`I tried to sell a fake ${i} as genuine, and the buyer called the police.`),
                                screen.classList.remove("open"),
                                notice(
                                  "Buyer Reports Fraud",
                                  "The buyer discovered the counterfeit and contacted the police.",
                                  () => busted("fraud"),
                                  !0,
                                );
                            })(e, n, !0);
                          A(e),
                            (state.money += n),
                            chaChing(),
                            L(
                              "Sold",
                              `You sold your ${e.name.toLowerCase()} for ${usd(n)}.`,
                              `I sold my ${e.name.toLowerCase()} for ${usd(n)}.`,
                            );
                        },
                      ],
                      ["Never mind", () => {}],
                    ],
                  });
                })(n),
              wear: () => (FL_JEWEL_WEAR.toggle(n), T(n)),
              clean: () =>
                (function (e) {
                  if (e.cond >= 100)
                    return L("Clean", `Your ${w(e)} ${e.plural ? "are" : "is"} already spotless.`, null);
                  (e.cond = 100),
                    L(
                      "Sparkling",
                      `You cleaned your ${w(e)}. ${e.plural ? "They look" : "It looks"} brand new!`,
                      `I cleaned my ${w(e)}.`,
                    );
                })(n),
              gift: () =>
                (function (a) {
                  const n = j();
                  if (!n.length) return L("Gift", `There is nobody to give your ${f(a)} to.`, null);
                  jCard({
                    tag: "Jewel",
                    iconSrc: e("gift"),
                    title: "Gift",
                    close: !0,
                    lead: `Who will you give your ${w(a)} to?`,
                    choices: n.slice(0, 6).map(([e, n, t]) => [
                      `${n} (${t})`,
                      () => {
                        A(a);
                        const t = a.fake && chance(a.known ? 0.5 : 0.25);
                        (e.rel = clamp((e.rel ?? 50) + (t ? -rint(10, 20) : rint(10, 20)))),
                          L(
                            t ? "Busted" : "Generous",
                            t
                              ? `You gave ${n} your ${f(a)}, and ${"f" === e.g || "f" === e.gender ? "she" : "he"} realized ${a.plural ? "they were" : "it was"} fake!`
                              : `You gave your ${w(a)} to ${n}. They loved ${a.plural ? "them" : "it"}!`,
                            `I gave my ${w(a)} to ${n}.${t ? ` They realized ${a.plural ? "they were" : "it was"} fake.` : ""}`,
                          );
                      },
                    ]),
                  });
                })(n),
              donate: () =>
                (function (e) {
                  iosConfirm("Confirm", `Donate your ${w(e)} to charity?`, () => {
                    A(e),
                      (state.stats.Happiness = clamp(state.stats.Happiness + rint(2, 6))),
                      L(
                        "Donated",
                        `You donated your ${w(e)} to charity.`,
                        `I donated my ${w(e)} to charity.`,
                      );
                  });
                })(n),
              discard: () =>
                (function (e) {
                  iosConfirm("Confirm", `Are you sure you want to throw away your ${w(e)}?`, () => {
                    A(e), L("Discarded", `You threw away your ${w(e)}.`, `I threw away my ${w(e)}.`);
                  });
                })(n),
            })[t.dataset.ra]()),
      ),
      (sList.scrollTop = 0),
      screen.classList.add("open");
  }
  const L = (e, a, n, t = !0) => {
      n && say(n),
        renderStats(),
        screen.classList.remove("open"),
        notice(e, a, t ? () => G().length && (screen.classList.add("open"), P()) : null, !0);
    },
    A = (e) => {
      const a = G().indexOf(e);
      a >= 0 && G().splice(a, 1);
    };
  const E = [
    "bounty hunter",
    "pawn shop owner",
    "tourist",
    "socialite",
    "rapper",
    "retired dentist",
    "wedding planner",
    "pastor",
    "high school teacher",
    "used car salesman",
  ];
  const j = () => [
    ...(state.lovers || []).map((e) => [e, `${e.first} ${e.last}`, loverTitle(e)]),
    ...(state.spouse && !state.spouse.dead
      ? [[state.spouse, `${state.spouse.first} ${state.spouse.last}`, "Spouse"]]
      : []),
    ...state.parents.filter((e) => !e.dead).map((e) => [e, `${e.first} ${SURNAME}`, e.role]),
    ...(state.friends || []).map((e) => [e, `${e.first} ${e.last}`, "Friend"]),
  ];
  const B = window.openShopping;
  window.openShopping = function () {
    const a = B.apply(this, arguments);
    [
      [state.shops.jewel, !1],
      [state.shops.fake, !0],
    ].forEach(([e, a]) => {
      const n = sList.querySelector(`[data-soon="${CSS.escape(e)}"]`);
      n &&
        (n.removeAttribute("data-soon"),
        (n.onclick = () => {
          play("choice"), M(a);
        }));
    });
    const n = [...sList.querySelectorAll(".row")].find(
      (e) => e.querySelector("b")?.textContent === state.shops.fake,
    );
    return (
      n &&
        (n.insertAdjacentHTML(
          "afterend",
          `<div class="sec">Luxury Jewelers</div><div class="row" id="luxGems"><img src="${e("lux-33")}" style="object-fit:contain"><div class="t"><b>${r}</b><span>Shop for rare, priceless gems</span></div>${CHEV}</div>`,
        ),
        (document.getElementById("luxGems").onclick = () => {
          play("choice"), c();
        })),
      a
    );
  };
  const x = window.openAssets;
  (window.openAssets = function () {
    const e = x.apply(this, arguments);
    if ("ASSETS" !== sTitle.textContent || !G().length) return e;
    const a = [...sList.querySelectorAll(".sec")].find((e) => "Misc." === e.textContent),
      n = [...G()].sort((e, a) => a.claim - e.claim)[0];
    a &&
      a.insertAdjacentHTML(
        "beforebegin",
        `<div class="sec">Jewelry</div><div class="row" id="jewelRow"><img src="${y(n)}" style="object-fit:contain"><div class="t"><b>Jewelry</b><span>${G().length} piece${1 === G().length ? "" : "s"} of jewelry</span></div>${CHEV}</div>`,
      );
    const t = document.getElementById("jewelRow");
    return (
      t &&
        (t.onclick = () => {
          play("choice"), P();
        }),
      e
    );
  }),
    ageBtnEl.addEventListener("click", () => {
      state.dead || G().forEach((e) => (e.cond = clamp(e.cond - rint(1, 4))));
    }),
    (window.JEWELRY = {
      itemImg: y,
      lc: w,
      lose: A,
      makeItem: p,
      makeRing: p,
      openJeweler: M,
      openJewelry: P,
      openRing: T,
      openItem: T,
      give: (e) => G().push({ acquired: state.age, cond: 100, ...e }),
    });
})();
