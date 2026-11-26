/*! Copyright (c) 2026 Free Life. All rights reserved. */
/* VIP Everything: desbloquea todos los packs y objetos premium de BitLife.
 * Es un mod con interruptor propio; no requiere códigos de 8 dígitos.
 */
(() => {
  "use strict";
  if (window.FL_VIP) return;
  window.FL_VIP = true;

  const KEY = "fl-vip-all";
  const BASE_KEY = "fl-vip-base-owned";
  const ADDED_KEY = "fl-vip-added";
  const IDS = [
    // Core
    "bitizen",
    "godmode",
    "boss",
    "pacifier",
    "hollywood",
    "passport",
    "timemachine",
    "jailcard",
    "blade",
    "potion",
    "luxury",
    "outdoor",
    "investor",
    "cult",
    "superstar",
    "vault",
    // Careers
    "actor",
    "astronaut",
    "business",
    "dealer",
    "mafia",
    "model",
    "producer",
    "musician",
    "politician",
    "athlete",
    "hustler",
    "fighter",
    "vampire",
    "director",
    // Expansions & bundles
    "landlord",
    "casino",
    "racing",
    "agent",
    "blackmarket",
    "zoo",
    "fame",
    "crimepays",
    "party",
    "resume",
    "diploma",
    "bracelet",
    "aura",
    "pixie",
    "neko",
    "piggy",
    "wrench",
    "streak",
  ];

  const GROUPS = [
    {
      title: "Core & VIP Items",
      ids: [
        ["bitizen", "Bitizenship", "Premium features and extra content"],
        ["godmode", "God Mode", "Customize characters and start royal lives"],
        ["pacifier", "Golden Pacifier", "Extra control over your children"],
        ["hollywood", "Hollywood Star", "Instant fame in entertainment careers"],
        ["passport", "Golden Passport", "Choose any country when emigrating"],
        ["timemachine", "Time Machine", "Travel back to earlier years"],
        ["jailcard", "Get Out of Jail Free Card", "Walk out of prison"],
        ["blade", "Assassin's Blade", "A special item from the shop"],
        ["potion", "Promiscuity Potion", "Protection from in-game diseases"],
      ],
    },
    {
      title: "Careers & Job Packs",
      ids: [
        ["boss", "Boss Mode", "All current and future Job Packs"],
        ["actor", "Actor", "Become a TV or movie star"],
        ["astronaut", "Astronaut", "Explore the cosmos"],
        ["business", "Business", "Start, acquire or lead a company"],
        ["dealer", "Dealer", "Join a drug cartel"],
        ["mafia", "Mafia", "Join an organized crime syndicate"],
        ["model", "Model", "Become a famous supermodel"],
        ["producer", "Music Producer", "Produce music and build an empire"],
        ["musician", "Musician", "Join a band or go solo"],
        ["politician", "Politician", "Run for political office"],
        ["athlete", "Pro Athlete", "Become a professional athlete"],
        ["hustler", "Street Hustler", "Hit the streets and hustle"],
        ["fighter", "Ultimate Fighter", "Fight your way to the top"],
        ["vampire", "Vampire Mode", "Live a very long, very pale life"],
        ["director", "Movie Director", "Become a famous director"],
      ],
    },
    {
      title: "Expansions & Bundles",
      ids: [
        ["luxury", "Luxury Lifestyle", "The VIP lifestyle perks"],
        ["outdoor", "Outdoor Lifestyle", "Spend time with nature"],
        ["investor", "Investor Expansion", "Stocks, bonds, crypto and more"],
        ["cult", "CULT Expansion", "Start a commune and lead followers"],
        ["landlord", "Landlord Expansion", "Tenants, exclusive homes and more"],
        ["casino", "Casino Expansion", "Start your own casino"],
        ["racing", "Racing Expansion", "Street races, F1 races and more"],
        ["agent", "Secret Agent Expansion", "Start a spy agency"],
        ["blackmarket", "Black Market Expansion", "Museums and contraband"],
        ["zoo", "Zoo Expansion", "Open your own zoo"],
        ["fame", "Fame & Fortune", "A life of pure luxury"],
        ["crimepays", "Crime Pays", "Become a wealthy crime lord"],
        ["party", "Party Animal", "Take a walk on the wild side"],
      ],
    },
    {
      title: "Extra Items",
      ids: [
        ["resume", "Golden Resume", "Get that dream job"],
        ["diploma", "Golden Diploma", "Become an overnight expert"],
        ["bracelet", "Friendship Bracelet", "Become everyone's favorite person"],
        ["aura", "Aura Ring", "Generate swag without trying"],
        ["pixie", "Dab of Pixie Dust", "Take the trip of a lifetime"],
        ["neko", "Golden Neko Statue", "Make it rain"],
        ["piggy", "Golden Piggy Bank", "Get rich quick"],
        ["wrench", "Golden Wrench", "Auto-maintain every vehicle"],
        ["streak", "Streak Savers (x5)", "Keep your streak alive"],
        ["vault", "Challenge Vault", "Access past challenges"],
        ["superstar", "Superstar", "Unlock an exclusive theme"],
      ],
    },
  ];

  // Islands: art is ready (islands/), the feature is not. Listed as "Soon": shown greyed, never unlocked or owned.
  const ISLAND = (file, name, desc) => ["island-" + file, name, desc, `islands/${file}.png`];
  const ISLANDS = {
    logo: "islands/island-01-modern-villa.png",
    private: [
      ISLAND("island-01-modern-villa", "Modern Villa Island", "A glass-and-pool villa with its own dock"),
      ISLAND("island-02-spanish-villa", "Spanish Villa Island", "Terracotta roofs on a rocky hill"),
      ISLAND("island-03-tiki-huts", "Tiki Huts Island", "Stilt huts, loungers and a beach umbrella"),
      ISLAND("island-04-manor-house", "Manor Island", "A grand manor with gardens and a gazebo"),
      ISLAND("island-05-farm-water-tower", "Farm Island", "Cottages, crops and a water tower"),
      ISLAND("island-06-jungle-cabin", "Jungle Cabin Island", "One cabin hidden under the palms"),
      ISLAND("island-07-lighthouse", "Lighthouse Island", "A working lighthouse and keeper's home"),
      ISLAND("island-08-pool-house", "Pool House Island", "A flat-roof house with a big pool"),
      ISLAND("island-09-windmill-farm", "Windmill Island", "A windmill, farm and vegetable fields"),
      ISLAND("island-10-cliff-house", "Cliff House Island", "A modern house carved into the rock"),
      ISLAND("island-11-village-shop", "Village Island", "A tiny town with a shop and water tower"),
      ISLAND("island-12-golf-course", "Golf Island", "Your own private golf course"),
    ],
    wild: [
      ISLAND("wild-01-lagoon-hill", "Lagoon Hill", "An untouched island with a hidden lagoon"),
      ISLAND("wild-02-rocky-peak", "Rocky Peak", "A steep rocky peak above the beach"),
      ISLAND("wild-03-meadow", "Meadow Isle", "Green meadows and a quiet shore"),
      ISLAND("wild-04-yacht-villa", "Yacht Villa", "A villa on the rocks with a yacht moored"),
      ISLAND("wild-05-cave-island", "Cave Island", "Sea caves under a tall cliff"),
      ISLAND("wild-06-flat-meadow", "Flat Meadow", "A low, wide island ready to build on"),
      ISLAND("wild-07-lighthouse", "Lighthouse Isle", "A lighthouse on a wild rocky shore"),
      ISLAND("wild-08-lagoon-cave", "Lagoon Cave", "A turquoise pool inside a rock arch"),
      ISLAND("wild-09-stilt-hut", "Stilt Hut", "A lone hut on stilts by the water"),
      ISLAND("wild-10-white-villa", "White Villa", "A white villa with a pool on the shore"),
      ISLAND("wild-11-palm-meadow", "Palm Meadow", "Palm trees and open grass"),
      ISLAND("wild-12-arch-cave", "Arch Cave", "A natural stone arch over the sand"),
    ],
  };

  const readJson = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value == null ? fallback : value;
    } catch {
      return fallback;
    }
  };
  const writeJson = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };
  const readOwned = () => {
    const value = readJson("bitlifepp-owned", []);
    return Array.isArray(value) ? value.filter((x) => typeof x === "string") : [];
  };
  const writeOwned = (ids) => writeJson("bitlifepp-owned", [...new Set(ids)]);
  const isOn = () => {
    try {
      return localStorage.getItem(KEY) !== "0";
    } catch {
      return true;
    }
  };
  const setFlag = (on) => {
    try {
      localStorage.setItem(KEY, on ? "1" : "0");
    } catch {}
  };

  const marketBase =
    typeof MKT_OWNED !== "undefined" && Array.isArray(MKT_OWNED) ? MKT_OWNED.slice() : null;
  const setMarket = (on) => {
    if (!marketBase || typeof MKT_OWNED === "undefined") return;
    MKT_OWNED.splice(0, MKT_OWNED.length);
    if (on) MKT_OWNED.push(...marketBase);
  };

  function apply() {
    const before = readOwned();
    const savedBase = readJson(BASE_KEY, null);
    const base = Array.isArray(savedBase) ? savedBase : before;
    if (!Array.isArray(savedBase)) writeJson(BASE_KEY, base);
    // Calculamos los añadidos contra la base original, no contra el estado
    // actual: así el interruptor sigue funcionando después de recargar.
    const added = IDS.filter((id) => !base.includes(id));
    writeJson(ADDED_KEY, added);
    writeOwned([...before, ...IDS]);
    setFlag(true);
    // MKT_OWNED contiene los packs que el Marketplace pinta como propios;
    // se restaura para que Bitizenship, God Mode y compañía sigan visibles.
    setMarket(true);
  }

  function remove() {
    const owned = readOwned();
    const added = readJson(ADDED_KEY, []);
    const base = readJson(BASE_KEY, []);
    const next = owned.filter((id) => !added.includes(id));
    // Lo que ya estaba desbloqueado antes de activar VIP se conserva.
    for (const id of base) if (!next.includes(id)) next.push(id);
    writeOwned(next);
    setFlag(false);
    setMarket(false);
    try {
      localStorage.removeItem(ADDED_KEY);
      localStorage.removeItem(BASE_KEY);
    } catch {}
  }

  function setVip(on) {
    if (on) apply();
    else remove();
    if (typeof notice === "function")
      notice(
        on ? "VIP Everything enabled" : "VIP Everything disabled",
        on
          ? "Every premium pack, career and item is now unlocked."
          : "The packs added by this mod were locked again. Anything you already owned is still yours.",
        () => openVip(),
        true,
      );
  }

  function openVip(opts) {
    if (typeof play === "function") play("choice");
    sTitle.textContent = "VIP EVERYTHING";
    sSub.style.display = "none";
    sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "&larr;";
    sBack.onclick = () => openMainMenu();
    const on = isOn();
    const check = typeof modBox === "function" ? modBox(on) : on ? "mkt/owned.png" : "mkt/owned.png";
    const row = (id, name, desc) =>
      `<div class="row"><img src="mkt/${id}.png" alt=""><div class="t"><b>${name}</b><span>${desc}</span></div>` +
      `${on ? '<img class="mkt-owned" src="mkt/owned.png" alt="Unlocked">' : ""}</div>`;
    // Islands are on sale in Shopping (Archipelago Estates): these rows open that showroom
    const soonRow = (name, desc, img) =>
      `<div class="row" data-vipisland="1"><img src="${img}" alt="" style="object-fit:contain"><div class="t"><b>${name}</b><span>${desc}</span></div>` +
      `<div class="mkt-price">SHOP</div></div>`;
    const islands =
      `<div class="sec" id="vipIslandsSec">Islands · Now in Shopping</div>` +
      soonRow("Archipelago Estates", "Buy a private or wild island in Shopping", ISLANDS.logo) +
      `<div class="sec">Private Islands</div>` +
      ISLANDS.private.map(([, name, desc, img]) => soonRow(name, desc, img)).join("") +
      `<div class="sec">Wild Islands</div>` +
      ISLANDS.wild.map(([, name, desc, img]) => soonRow(name, desc, img)).join("");
    sList.innerHTML =
      `<div class="sec">${on ? "All VIP unlocked" : "VIP locked"}</div>` +
      `<div class="row" id="vipToggle" style="background:${on ? "#eef8e8" : "#fbe6e6"}"><img src="mkt/bitizen.png" alt="">` +
      `<div class="t"><b>VIP Everything</b><span>${on ? "Every premium pack is active. Tap to lock it again." : "Tap to unlock every premium pack, career and item."}</span></div>` +
      `<img class="ck" src="${check}" alt=""></div>` +
      GROUPS.map(
        (group) =>
          `<div class="sec">${group.title}</div>` +
          group.ids.map(([id, name, desc]) => row(id, name, desc)).join(""),
      ).join("") +
      islands +
      `<div class="mm-foot" style="padding:10px 14px;text-align:left">VIP Everything is a mod. The switch works immediately and the setting is saved in this browser.</div>`;
    const toggle = document.getElementById("vipToggle");
    if (toggle) toggle.onclick = () => setVip(!isOn());
    sList.querySelectorAll("[data-vipisland]").forEach((el) => {
      el.onclick = () => {
        if (window.FL_ELITE_LIFE && FL_ELITE_LIFE.openVehicleStore) FL_ELITE_LIFE.openVehicleStore("islands");
        else if (typeof openShopping === "function") openShopping();
      };
    });
    sList.scrollTop = 0;
    screen.classList.add("open");
    if (opts && opts.islands) {
      const sec = document.getElementById("vipIslandsSec");
      if (sec && sec.scrollIntoView) sec.scrollIntoView({ block: "start" });
    }
  }

  const PREMIUM = [
    ["bitizen", "Bitizenship", "Premium features and extra content"],
    ["godmode", "God Mode", "Customize characters and start royal lives"],
    ["investor", "Investor Expansion Pack", "Stocks, bonds, crypto and more"],
    ["cult", "CULT Expansion Pack", "Start a commune and lead followers"],
    ["hollywood", "Hollywood Star", "Skyrocket your way to stardom"],
    ["actor", "Actor", "Become a famous TV or movie star"],
    ["astronaut", "Astronaut", "Explore the cosmos"],
    ["business", "Business", "Start, acquire or lead a company"],
    ["dealer", "Dealer", "Join a drug cartel"],
    ["mafia", "Mafia", "Join an organized crime syndicate"],
    ["model", "Model", "Become a famous supermodel"],
    ["producer", "Music Producer", "Become a famous music producer"],
    ["musician", "Musician", "Join a band or go solo"],
    ["politician", "Politician", "Run for political office"],
    ["athlete", "Pro Athlete", "Become a professional athlete"],
    ["hustler", "Street Hustler", "Hit the streets and hustle"],
    ["timemachine", "Unlimited Time Machine", "Go back in time as much as you want"],
  ];

  // Con VIP apagado, el Marketplace base oculta estos packs porque no están
  // en MKT (solo en MKT_OWNED). game.html llama a este hook al terminar de
  // pintar el Marketplace para volver a mostrarlos como comprables.
  function decorateMarket() {
    try {
      if (isOn() || typeof sTitle === "undefined" || sTitle.textContent !== "BITLIFE++ MARKETPLACE") return;
      if (document.getElementById("vipPremiumPacks")) return;
      const owned = readOwned();
      sList.insertAdjacentHTML(
        "afterbegin",
        '<div class="sec" id="vipPremiumPacks">Premium Packs</div>' +
          PREMIUM.map(
            ([id, name, desc]) =>
              `<div class="row" data-vipbuy="${id}"><img src="mkt/${id}.png" alt=""><div class="t"><b>${name}</b><span>${owned.includes(id) ? "Owned" : desc}</span></div>` +
              `${owned.includes(id) ? '<img class="mkt-owned" src="mkt/owned.png" alt="Owned">' : '<div class="mkt-price">FREE ZOMG!</div>'}</div>`,
          ).join(""),
      );
      sList.querySelectorAll("[data-vipbuy]").forEach((row) => {
        row.onclick = () => {
          const id = row.dataset.vipbuy;
          const current = readOwned();
          if (current.includes(id))
            return notice("Already owned", `You already own ${id}.`, null, true);
          writeOwned([...current, id]);
          new Audio("sounds/a16_sndLuxuryPurchaseAsset.wav").play().catch(() => {});
          openMarketplace();
          notice("Thank you!", "That pack is now yours. Enjoy!", null, true);
        };
      });
    } catch (e) {
      console.warn("[vip] marketplace", e);
    }
  }

  const mainMenu = window.openMainMenu;
  if (typeof mainMenu === "function") {
    window.openMainMenu = function () {
      const result = mainMenu.apply(this, arguments);
      try {
        if (document.getElementById("vipRow")) return result;
        const on = isOn();
        sList.insertAdjacentHTML(
          "afterbegin",
          `<div class="sec">Account</div><div class="row" id="vipRow"><img src="mkt/bitizen.png" alt="">` +
            `<div class="t"><b>VIP Everything</b><span>${on ? "All premium packs unlocked" : "Premium packs locked · tap to unlock"}</span></div>` +
            `${typeof CHEV !== "undefined" ? CHEV : ""}</div>`,
        );
        const row = document.getElementById("vipRow");
        if (row) row.onclick = () => openVip();
        // Islands: not built yet, so it is a SOON row with an island as its icon (it jumps to the Islands list in VIP)
        row &&
          row.insertAdjacentHTML(
            "afterend",
            `<div class="row" id="vipIslandsRow"><img src="${ISLANDS.logo}" alt="" style="object-fit:contain">` +
              `<div class="t"><b>Islands</b><span>Buy your own island in Shopping</span></div>` +
              `${typeof CHEV !== "undefined" ? CHEV : ""}</div>`,
          );
        const isl = document.getElementById("vipIslandsRow");
        if (isl)
          isl.onclick = () => {
            if (window.FL_ELITE_LIFE && FL_ELITE_LIFE.openVehicleStore) FL_ELITE_LIFE.openVehicleStore("islands");
            else openVip({ islands: true });
          };
        // "My Stuff" had no screen behind it and fell into the placeholder: it is the account-wide perks, i.e. this VIP page
        const stuff = sList.querySelector('[data-mm="stuff"]');
        if (stuff) stuff.onclick = () => openVip();
      } catch (e) {
        console.warn("[vip] menu", e);
      }
      return result;
    };
  }

  // Si la última vez se apagó, limpiamos cualquier resto de una sesión anterior.
  if (isOn()) apply();
  else {
    setMarket(false);
    const added = readJson(ADDED_KEY, []);
    if (added.length) remove();
  }

  window.FL_VIP = {
    isOn,
    set: setVip,
    open: openVip,
    decorateMarket,
    ids: IDS.slice(),
    islands: ISLANDS,
  };
})();
