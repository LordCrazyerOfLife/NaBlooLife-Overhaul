(() => {
  "use strict";

  function boot() {
    if (
      typeof window.COUNTRIES === "undefined" ||
      typeof state === "undefined" ||
      typeof notice !== "function" ||
      typeof crimeEvent !== "function" ||
      typeof busted !== "function" ||
      typeof openCrime !== "function" ||
      typeof chance !== "function" ||
      typeof say !== "function" ||
      typeof ageBtnEl === "undefined"
    )
      return setTimeout(boot, 60);

    try {
      init();
    } catch (e) {
      console.warn("[melon]", e);
    }
  }

  function init() {
    const clamp = (v) => Math.max(0, Math.min(100, v));
    const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

    const HYBRID_SPECIES = [
      "Wolf",
      "Red Fox",
      "Fennec Fox",
      "Lion",
      "Bengal Tiger",
      "Jaguar",
      "Leopard",
      "Cheetah",
      "Panda Bear",
      "Grizzly Bear",
      "Hyena",
      "Lynx",
      "Snow Leopard",
      "Black Panther",
      "Rabbit",
      "Deer",
      "Owl",
      "Raven",
      "Otter",
      "Komodo Dragon",
    ];

    // ---------------------------------------------------------------- meter state
    function melon() {
      if (!state.melon) {
        const disgraced = Math.random() < 0.15,
          // If the species tab (under Gender, in character creation) was used to pick a
          // hybrid explicitly, honor that instead of re-rolling — and skip the "surprise"
          // intro notice, since the player already chose it and knows.
          chosenSpecies = state.species && state.species !== "human" ? state.species : null,
          hybridSpecies =
            chosenSpecies ||
            (Math.random() < 0.15 ? HYBRID_SPECIES[Math.floor(Math.random() * HYBRID_SPECIES.length)] : null);
        state.melon = {
          brutality: 0,
          disguise: 0,
          disgraced,
          hybridSpecies,
          markedShown: false,
          ghostShown: false,
        };
        if (hybridSpecies && !chosenSpecies)
          notice(
            `${hybridSpecies} Hybrid`,
            `You were born part human, part ${hybridSpecies.toLowerCase()}. Plenty of people are wary of you just for looking the way you do, long before you've ever done anything to earn it.`,
            null,
            !0,
          );
        if (disgraced)
          notice(
            "A Disgraced Name",
            "Your family's name carries a scandal you didn't choose. People assume the worst of you before you've said a word.",
            null,
            !0,
          );
      }
      return state.melon;
    }

    function brutalityThreshold() {
      const m = melon();
      let t = 80;
      if (m.disgraced) t -= 15;
      if (m.hybridSpecies) t -= 15;
      return Math.max(50, t);
    }

    function tier() {
      const m = melon(),
        bThresh = brutalityThreshold();
      if (m.brutality > bThresh && m.disguise > 80) return "ghost";
      if (m.brutality > bThresh && m.disguise < 20) return "marked";
      return "normal";
    }

    function tierColor(v) {
      return v >= 80 ? "#b3261e" : v >= 40 ? "#f5841f" : "#2fa03b";
    }

    // ---------------------------------------------------------------- meter gain on every crime attempt
    function gainFromCrime() {
      const m = melon();
      let bonus = 0;
      if (m.disgraced) bonus += rnd(1, 3);
      if (m.hybridSpecies) bonus += rnd(1, 3);
      m.brutality = clamp(m.brutality + rnd(3, 6) + bonus);
      m.disguise = clamp(m.disguise + rnd(1, 3));

      const t = tier();
      if (t === "marked" && !m.markedShown) {
        m.markedShown = true;
        notice(
          "People Are Scared of You",
          "Word's gotten around about what you're capable of, and you're not hiding it well. The police have started actively hunting you down.",
          null,
          !0,
        );
      }
      if (t === "ghost" && !m.ghostShown) {
        m.ghostShown = true;
        notice(
          "A Ghost in the Dark",
          "You've gotten brutal, and you've gotten good at not being seen. The police keep looking, but they can't find what they can't identify &mdash; unless you slip up.",
          null,
          !0,
        );
      }
      return t;
    }

    // ---------------------------------------------------------------- random event: a human can turn into a hybrid
    ageBtnEl.addEventListener("click", () => {
      if (state.dead) return;
      const m = melon();
      if (m.hybridSpecies) return; // already a hybrid (born one or turned already)
      if ((state.species && "human" !== state.species) || !chance(0.006)) return;
      const species = HYBRID_SPECIES[Math.floor(Math.random() * HYBRID_SPECIES.length)];
      (state.species = species), (m.hybridSpecies = species);
      say("Something changed in me this year. I'm not entirely human anymore.");
      notice(
        `${species} Hybrid`,
        `Nobody can say exactly when or how, but somewhere along the way part of you became ${species.toLowerCase()}. People who knew you before are already starting to keep their distance.`,
        null,
        !0,
      );
    });

    // ---------------------------------------------------------------- hook: every crime attempt
    const origCrimeEvent = crimeEvent;
    crimeEvent = function () {
      const t = gainFromCrime();
      const result = origCrimeEvent.apply(this, arguments);
      // "Marked": even a crime that would otherwise succeed can get you run down separately.
      if (t === "marked" && !state.dead && !state.prison && Math.random() < 0.25) {
        const crimeName = (arguments[0] && arguments[0][2]) || "your latest crime";
        setTimeout(() => {
          if (state.dead || state.prison) return;
          say(`The police finally caught up with me after ${crimeName.toLowerCase()}.`);
          busted(crimeName);
        }, 10);
      }
      return result;
    };

    // ---------------------------------------------------------------- hook: every bust
    const origBusted = busted;
    busted = function (e) {
      if (tier() === "ghost" && Math.random() < 0.55) {
        return say(`I nearly got caught committing ${e}, but slipped away without a trace.`);
      }
      return origBusted.apply(this, arguments);
    };

    // ---------------------------------------------------------------- Crime screen meter display
    const origOpenCrime = openCrime;
    openCrime = function () {
      const r = origOpenCrime.apply(this, arguments);
      try {
        const m = melon(),
          barOld = (label, v) =>
            `<div style="margin:4px 0"><b style="font-size:13px">${label}: ${v}</b>` +
            `<i style="display:block;height:8px;border-radius:4px;background:#0002;overflow:hidden;margin-top:2px">` +
            `<u style="display:block;height:100%;width:${Math.max(3, v)}%;background:${tierColor(v)}"></u></i></div>`;
        const bar = (label, v) => (window.FL_BARS ? FL_BARS.html(label, v, tierColor(v) === "#2fa03b" ? "" : v >= 70 ? "crit" : "low") : barOld(label, v));
        const t = tier(),
          tierLabel =
            t === "ghost"
              ? "Ghost &mdash; the police can't find you unless you slip up"
              : t === "marked"
                ? "Marked &mdash; the police are actively hunting you"
                : "Keep a low profile, or don't";
        const traitBits = [];
        if (m.hybridSpecies) traitBits.push(`${m.hybridSpecies} Hybrid`);
        if (m.disgraced) traitBits.push("Disgraced Name");
        const traitLine = traitBits.length
          ? `<span class="fl-sub" style="font-size:12px;display:block">${traitBits.join(" &middot; ")}</span>`
          : "";
        sList.insertAdjacentHTML(
          "afterbegin",
          `<div class="sec">Melon</div><div class="row" style="flex-direction:column;align-items:stretch;height:auto;padding:10px 14px">` +
            traitLine +
            bar("Brutality", m.brutality) +
            bar("Disguise", m.disguise) +
            `<span class="fl-sub" style="font-size:12px;margin-top:2px">${tierLabel}</span></div>`,
        );
      } catch (e) {
        console.warn("[melon] crime screen", e);
      }
      return r;
    };

    console.log("[melon] loaded", melon());
  }

  boot();
})();
