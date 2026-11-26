/*! North Korea Mod — country-specific life events for characters born in North Korea.
 * Original code. Models a few well-documented, real aspects of life there (not
 * editorializing, not glorifying it): the hereditary songbun social-class system,
 * uneven food distribution, mandatory ideology/self-criticism sessions, the risk
 * of being reported by an informant, a fictionalized "ruling family" birth option
 * with its own succession to "Supreme Leader", and the real-world danger of
 * attempting to leave the country without permission.
 *
 * No real living person is named, depicted or quoted anywhere in this file. The
 * ruling-family option is a generic, game-only stand-in — "the Leader" / "the
 * ruling family" / "the Party" — not any specific real individual or their actual
 * family, the same way this project's existing Royal Status feature uses generic
 * titles (Duke, Prince, King) rather than any real reigning monarch.
 *
 * The ruling-family path actually plugs into that same Royal Status system
 * (state.royal / ROY_RANKS) rather than faking its own look-alike: a ruling-
 * family character gets a real state.royal record, so the game's existing
 * royal yearly salary, respect, avatar crown, arrest "royal power" escape and
 * honorific events all apply to them too, just with North-Korea-flavored
 * text instead of British monarchy text. The one deliberate difference: ranks
 * are drawn from "earl"/"duke"/"monarch", never "prince" — the game auto-
 * crowns a "prince" to monarch the instant they have no living royal parent
 * (normal succession-on-death logic), which would misfire immediately here
 * since this character's parents are ordinary people, not royalty.
 *
 * Only ever activates for state.country === "kp", and only between life events —
 * it never changes a character's country or blocks normal play, and a character
 * who is already in state.prison is left alone until their current sentence
 * resolves.
 *
 * Install: this file sits at the project root next to game.html, like melon.js and
 * gang.js. Auto-loaded by modloader.js's MODS list — no 8-digit code needed, and it
 * can be turned off from Settings -> Mod Workshop -> Mod Loader.
 */
(() => {
  "use strict";

  function boot() {
    if (
      typeof window.COUNTRIES === "undefined" ||
      typeof state === "undefined" ||
      typeof notice !== "function" ||
      typeof jCard !== "function" ||
      typeof chance !== "function" ||
      typeof say !== "function" ||
      typeof renderStats !== "function" ||
      typeof goToPrison !== "function" ||
      typeof ageBtnEl === "undefined" ||
      typeof ROY_RANKS === "undefined" ||
      typeof relName !== "function" ||
      typeof log === "undefined"
    )
      return setTimeout(boot, 60);
    try {
      init();
    } catch (e) {
      console.warn("[nk]", e);
    }
  }

  function init() {
    const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
    const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const isNK = () => "kp" === state.country && !state.dead;

    // ---------------------------------------------------------------- songbun + loyalty + ruling family
    function nk() {
      if (!state.nk) {
        if (state.nkHeir) {
          // Picked "Child of the Leader" at creation: a fictional, game-only
          // ruling-family birth. Treated as the most-trusted songbun class by
          // definition, and exempt from the rationing/informant risk below the
          // same way a head of state's own household would be in practice.
          state.nk = {
            songbun: "Core",
            loyalty: 95,
            heir: true,
            rank: "heir",
            lastSession: -1,
            defected: false,
            caughtOnce: false,
          };
          // Give this character a real Royal Status record so the game's own
          // royal mechanics (yearly salary, respect, avatar crown, the arrest
          // "royal power" escape, honorific events) switch on for them too.
          if (!state.royal) {
            const R = ROY_RANKS.earl;
            state.royal = {
              rank: "earl",
              title: "Child of the Leader",
              nkTitle: !0, // ours, not a real monarchy — see relName patch below
              place: "Pyongyang",
              estate: "the State Residence",
              respect: rnd(60, 80),
              honorific: "Your excellency",
              acquired: "Birth",
              years: 0,
              salary: Math.round(R.pay * (0.9 + 0.2 * Math.random())),
              activeAt: -1,
              lawAt: -1,
              celebAt: -1,
              svcAt: -1,
              svcN: 0,
              abdicated: !1,
            };
            state.money = (state.money || 0) + state.royal.salary * rnd(2, 4);

            // Everywhere else in the game, a family member's name is shown
            // with a generic rank word from ROY_RANKS ("King"/"Duke"/etc, via
            // relName()). We want OUR custom titles shown instead ("Supreme
            // Leader", not "King") without touching how real monarchy
            // characters elsewhere in the game are displayed, so patch
            // relName() to prefer royal.title whenever royal.nkTitle is set.
            if (typeof relName === "function" && !relName.__nkPatched) {
              const _relName = relName;
              relName = function (e, t) {
                return e && e.royal && e.royal.nkTitle && !e.dead
                  ? `${e.royal.title} ${e.first}`
                  : _relName(e, t);
              };
              relName.__nkPatched = !0;
            }

            // The player is "Child of the Leader" precisely because a parent
            // holds (or co-holds) that position — so make the parents royal
            // too, one titled as the Leader and the other as their spouse.
            if (Array.isArray(state.parents)) {
              const leaderIsFather = Math.random() < 0.5;
              const giveRoyal = (p, rank, title) => {
                if (!p || p.royal) return;
                const oldJob = p.job;
                p.royal = { rank, title, nkTitle: !0 };
                p.job = "Royalty";
                if (p.look) {
                  try {
                    p.look.crown = ROY_RANKS[rank].crown["f" === p.gender ? 1 : 0];
                  } catch {}
                }
                // The birth-intro line ("My father is X, a librarian (age
                // 30).") was already written to the log before this mod ran,
                // using the old random job — patch that one sentence so it
                // doesn't contradict the title shown everywhere else.
                try {
                  if (log && null != p.ageAtBirth) {
                    const esc = (p.first || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    const re = new RegExp(`(is ${esc}[^,<]*,\\s*)([^()<]+?)(\\s*\\(age ${p.ageAtBirth}\\))`);
                    if (re.test(log.innerHTML)) log.innerHTML = log.innerHTML.replace(re, `$1the ${title}$3`);
                  }
                } catch {}
              };
              const father = state.parents.find((p) => "Father" === p.role) || state.parents[0];
              const mother = state.parents.find((p) => "Mother" === p.role) || state.parents[1];
              giveRoyal(father, leaderIsFather ? "monarch" : "duke", leaderIsFather ? "Supreme Leader" : "Spouse of the Leader");
              giveRoyal(mother, leaderIsFather ? "duke" : "monarch", leaderIsFather ? "Spouse of the Leader" : "Supreme Leader");
            }
          }
          notice(
            "Child of the Leader",
            "You were born into the ruling family at the top of North Korea's political system. The Party treats your household as untouchable, and leadership may one day pass to you.",
            null,
            !0,
          );
        } else {
          // Rough real-world proportions for North Korea's hereditary songbun
          // classification (core / wavering / hostile), used only as flavor and
          // as a light modifier on a few odds below.
          const roll = Math.random();
          const songbun = roll < 0.15 ? "Core" : roll < 0.7 ? "Wavering" : "Hostile";
          const startLoyalty = songbun === "Core" ? rnd(55, 75) : songbun === "Wavering" ? rnd(35, 55) : rnd(15, 35);
          state.nk = {
            songbun,
            loyalty: startLoyalty,
            heir: false,
            rank: "citizen",
            lastSession: -1,
            defected: false,
            caughtOnce: false,
          };
          notice(
            `Songbun: ${songbun}`,
            songbun === "Core"
              ? "Your family's background is politically trusted. Doors open a little easier for you, and people assume your loyalty before you've shown it."
              : songbun === "Wavering"
                ? "Your family's background is politically unremarkable &mdash; neither trusted nor suspect. You get by, as long as you don't draw attention."
                : "Your family's background is politically suspect, for reasons that may go back generations and have nothing to do with anything you've done. People watch you a little more closely for it.",
            null,
            !0,
          );
        }
      }
      return state.nk;
    }

    function adjustLoyalty(delta) {
      const m = nk();
      m.loyalty = clamp(m.loyalty + delta);
    }

    // Set songbun/ruling-family status up front, at birth — not lazily on the
    // player's first age-up click. Starting a new life always does a full page
    // reload (blReload() -> location.reload()), so this file runs fresh for
    // every life and this only ever fires once per life, right as it begins.
    if (isNK()) nk();

    // ---------------------------------------------------------------- yearly hook: ordinary life
    ageBtnEl.addEventListener("click", () => {
      if (!isNK() || state.prison) return;
      const m = nk();
      const age = state.age;

      // The ruling family doesn't face rationing or informant risk like ordinary
      // citizens do — skip straight past it; the succession hook below is separate.
      if (m.heir) return;

      // -- food distribution: a bad year hits everyone, but unevenly by songbun class,
      //    reflecting how the public distribution system has historically been rationed
      //    unevenly by political classification.
      if (chance(0.1)) {
        const hit = m.songbun === "Hostile" ? rnd(4, 9) : m.songbun === "Wavering" ? rnd(2, 6) : rnd(1, 4);
        state.stats.Health = clamp(state.stats.Health - hit);
        state.stats.Happiness = clamp(state.stats.Happiness - Math.ceil(hit / 2));
        renderStats();
        say("Rations were short again this year.");
      }

      // -- mandatory weekly ideology sessions apply once you're old enough to work
      if (age >= 14 && m.lastSession !== age && chance(0.22)) {
        m.lastSession = age;
        jCard({
          tag: "Weekly Session",
          iconSrc: "emoji/1f4e3.png",
          title: "Self-Criticism Session",
          lead: "Once a week, your work unit gathers to criticize their own shortcomings and each other's, then reaffirm loyalty to the Party. It's your turn to speak.",
          choices: [
            [
              "Throw yourself into it",
              () => {
                adjustLoyalty(rnd(4, 8));
                state.stats.Happiness = clamp(state.stats.Happiness - rnd(2, 5));
                renderStats();
                say("I gave an enthusiastic self-criticism at the weekly session.");
              },
            ],
            [
              "Go through the motions",
              () => {
                adjustLoyalty(rnd(0, 2));
                say("I said what was expected of me at the weekly session, nothing more.");
              },
            ],
            [
              "Stay quiet and hope it passes",
              () => {
                adjustLoyalty(-rnd(3, 7));
                say("I kept my head down at the weekly session instead of speaking up.");
              },
            ],
          ],
        });
        return; // don't also roll the informant check the same year
      }

      // -- informant risk: scaled down by loyalty and up for the Hostile class
      const base = m.songbun === "Hostile" ? 0.05 : m.songbun === "Wavering" ? 0.03 : 0.015;
      const riskChance = Math.max(0.005, base - m.loyalty / 2500);
      if (age >= 12 && chance(riskChance)) {
        jCard({
          tag: "State Security",
          iconSrc: "emoji/1f575-fe0f.png",
          title: "A Report Has Been Filed",
          lead: "A neighbor reported something you said or did as disloyal. Two officers from State Security want to talk to you about it.",
          choices: [
            [
              "Deny everything",
              () => {
                if (chance(0.35 + m.loyalty / 300)) {
                  say("I talked my way out of the report from State Security.");
                  adjustLoyalty(-rnd(2, 5));
                } else sendToCamp(m, "anti-state agitation");
              },
            ],
            [
              "Confess and beg forgiveness",
              () => {
                if (chance(0.55 + m.loyalty / 250)) {
                  adjustLoyalty(rnd(3, 6));
                  state.stats.Happiness = clamp(state.stats.Happiness - rnd(5, 10));
                  say("I confessed and was let off with a warning, for now.");
                  renderStats();
                } else sendToCamp(m, "anti-state agitation");
              },
            ],
          ],
        });
        return;
      }
    });

    function sendToCamp(m, crime) {
      m.caughtOnce = true;
      adjustLoyalty(-rnd(10, 20));
      const years = rnd(3, 15);
      say(`I was sent to a political prison camp for ${crime}.`);
      goToPrison({
        crime,
        name: "a remote political prison camp",
        sec: "Maximum",
        years,
        served: 0,
        juv: state.age < 18,
        death: false,
      });
    }

    // ---------------------------------------------------------------- rare: attempt to leave
    ageBtnEl.addEventListener("click", () => {
      if (!isNK() || state.prison || state.age < 16) return;
      const m = nk();
      if (m.defected || m.heir) return; // the ruling family has no reason to flee

      if (!chance(0.02)) return;

      jCard({
        tag: "A Way Out",
        iconSrc: "emoji/1f512.png",
        title: "The Border",
        lead: "You've heard of a route across the river into China, used by a handful of people from your town. Guards patrol it, and getting caught means a camp sentence, maybe worse. Getting through means never coming back.",
        choices: [
          [
            "Attempt the crossing",
            () => {
              const oddsOfSuccess = 0.08 + (100 - m.loyalty) / 1500; // lower loyalty/suspicion, marginally easier to slip away unmissed
              if (chance(oddsOfSuccess)) {
                m.defected = true;
                say("I made it across the border. I'm not going back.");
                notice(
                  "Out",
                  "You crossed into China and, eventually, out of North Korea for good. You'll spend years rebuilding a life from nothing, but you're out.",
                  null,
                  !0,
                );
                state.stats.Happiness = clamp(state.stats.Happiness + rnd(10, 20));
                renderStats();
              } else {
                sendToCamp(m, "attempting to flee the country");
              }
            },
            "tred",
          ],
          [
            "Not worth the risk",
            () => {
              say("I thought about the border crossing, but I couldn't bring myself to try it.");
            },
          ],
        ],
      });
    });

    // ---------------------------------------------------------------- ruling-family succession
    // Mirrors the existing Royal Status system's precedent in spirit (a title you
    // can be born an heir to, but normally inherit rather than start holding) while
    // staying fully separate code so it can never collide with that system's own
    // state.royal subsystem. Only reachable by a character who picked "Child of
    // the Leader" at creation — never by an ordinary North Korean citizen.
    //
    // Modeled loosely on how real state titles there stack rather than transfer
    // all at once: an heir is first appointed Chairman (a senior state-commission
    // title) before later ascending to Supreme Leader. Generic titles only — no
    // real person is named.
    ageBtnEl.addEventListener("click", () => {
      if (!isNK() || state.prison) return;
      const m = nk();
      if (!m.heir || state.age < 20) return;

      if (m.rank === "heir" && chance(0.05)) {
        jCard({
          tag: "Succession",
          iconSrc: "emoji/1f4dc.png",
          title: "Appointed Chairman",
          lead: "The Party has appointed you Chairman of the State Affairs Commission &mdash; the country's top state body. It's widely seen as the step before full leadership.",
          choices: [
            [
              "Accept the appointment",
              () => {
                m.rank = "chairman";
                if (state.royal) {
                  const R = ROY_RANKS.duke;
                  state.royal.rank = "duke";
                  state.royal.title = "Chairman";
                  state.royal.honorific = "Your grace";
                  state.royal.acquired = "Appointment";
                  state.royal.years = 0;
                  state.royal.salary = Math.round(R.pay * (0.9 + 0.2 * Math.random()));
                }
                state.money = (state.money || 0) + 2e6;
                state.stats.Happiness = clamp(state.stats.Happiness + rnd(3, 10));
                renderStats();
                typeof renderAvatar === "function" && renderAvatar();
                say("I was appointed Chairman of the State Affairs Commission.");
                notice(
                  "Chairman",
                  "You now sit at the head of the country's top state body, one rung below the Supreme Leader. Officials who barely acknowledged you before now wait on your word.",
                  null,
                  !0,
                );
              },
            ],
          ],
        });
        return;
      }

      if (m.rank === "chairman" && chance(0.06)) {
        jCard({
          tag: "Succession",
          iconSrc: "emoji/1f451.png",
          title: "A New Leader",
          lead: "The Party has announced that supreme leadership is passing to you. State media is already rehearsing the broadcast.",
          choices: [
            [
              "Accept the leadership",
              () => {
                m.rank = "leader";
                if (state.royal) {
                  const R = ROY_RANKS.monarch;
                  state.royal.rank = "monarch";
                  state.royal.title = "Supreme Leader";
                  state.royal.honorific = "Your majesty";
                  state.royal.acquired = "Succession";
                  state.royal.years = 0;
                  state.royal.salary = R.pay;
                }
                state.money = (state.money || 0) + 1e7;
                state.stats.Happiness = clamp(state.stats.Happiness + rnd(5, 15));
                renderStats();
                typeof renderAvatar === "function" && renderAvatar();
                say("I became the Supreme Leader of North Korea.");
                notice(
                  "Supreme Leader",
                  "Portraits of you now hang in every home and office in the country. Every decision &mdash; the economy, the military, who gets fed first &mdash; is yours to make, and yours to answer for.",
                  null,
                  !0,
                );
              },
            ],
          ],
        });
      }
    });

    console.log("[nk] loaded");
  }

  boot();
})();
