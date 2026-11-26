      function openSpirits(e) {
        const t = ensureGhosts(e);
        (sTitle.textContent = "SPIRITS"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => openPropertyScreen(e)),
          (sList.innerHTML = t
            .map(
              (e, t) =>
                `<div class="row sm" data-gh="${t}"><i class="ghf" data-gi="${t}"></i><div class="t"><b>${e.name} <em>(Ghost)</em></b><div class="rel">Activeness <i><u style="width:${Math.max(2, e.active)}%;background:#f5841f"></u></i></div></div>${DOTS}</div>`,
            )
            .join("")),
          sList.querySelectorAll("i.ghf").forEach((e) => {
            const a = t[+e.dataset.gi];
            e.replaceWith(npcFace(a.look, a.g, a.age, "happy", "face"));
          }),
          sList.querySelectorAll("[data-gh]").forEach(
            (a) =>
              (a.onclick = () => {
                play("ghost"), ghostCard(e, t[+a.dataset.gh]);
              }),
          ),
          (sList.scrollTop = 0);
      }
      function ghostCard(e, t) {
        const a = (e, t, a) => `<b>${e}</b><i><u style="width:${Math.max(t, 2)}%;background:${a}"></u></i>`;
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div data-ghost><div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div>\n      <div class="ev-tag" style="margin-top:12px"><canvas class="ev-av" width="250" height="250"></canvas><span class="who">${t.name}</span><span class="kind">Ghost</span></div>\n      <h4><img src="act/profile.png"><span>Profile</span></h4>\n      <table class="prof"><tbody><tr><td><b>Name:</b> ${t.name}</td></tr><tr><td><b>Entity:</b> Ghost</td></tr></tbody></table>\n      <div class="ev-bars">${a("Friendliness", t.friend, barCol(t.friend))}${a("Activeness", t.active, "#f5841f")}</div>\n      <button class="jm-apply ev-btn" data-gc="exorcise">Exorcise it</button><button class="jm-apply ev-btn" data-gc="summon">Try to summon it</button></div>`),
          ev.querySelector(".ev-av").replaceWith(npcFace(t.look, t.g, t.age, "happy", "ev-av")),
          (ev.style.overflow = "visible");
        const o = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = () => {
          play("dismiss"), o();
        }),
          (ev.querySelector('[data-gc="exorcise"]').onclick = () => {
            o(), setTimeout(() => exorcismCard(e, t), 80);
          }),
          (ev.querySelector('[data-gc="summon"]').onclick = () =>
            iosConfirm("Confirm", `Are you sure you want to try to summon ${t.name}?`, () => {
              o(), summonGhost(e, t);
            })),
          evWrap.classList.add("open");
      }
      function exorcismCard(e, t) {
        const a = ep(10 * rint(15, 60)),
          o = e.name.toLowerCase();
        jCard({
          tag: "Ghost",
          person: { name: t.name, look: t.look, g: t.g, age: t.age },
          iconSrc: "ghost/exorcism.png",
          title: "Exorcism",
          close: !0,
          lead: `Hire your local exorcist to perform an exorcism on ${t.name} today!`,
          rows: [["Cost", usd(a)]],
          choices: [
            [
              "Hire the exorcist",
              () =>
                state.money < a
                  ? notice("Flat broke", "You can't afford the exorcist.", null, !0, brokeRows(a))
                  : ((state.money -= a),
                    renderStats(),
                    snapClose(),
                    chance(0.25 + (100 - t.active) / 160)
                      ? (e.ghosts.splice(e.ghosts.indexOf(t), 1),
                        say(`I hired an exorcist who banished ${t.name} from my ${o}.`),
                        e.ghosts.length
                          ? notice("The power compels you", `The exorcist banished ${t.name} from your ${o}.`)
                          : ((e.sprite = e.sprite.replace(/-haunted$/, "")),
                            (e.name = e.name.replace(/^Haunted /, "")),
                            (e.price = Math.round(e.price / 0.7)),
                            notice(
                              "The power compels you",
                              `The exorcist banished ${t.name}. Your ${e.name.toLowerCase()} is no longer haunted!`,
                            )))
                      : ((t.active = clamp(t.active + rint(3, 10))),
                        say(`I tried to have ${t.name} exorcised from my ${o}, but it failed.`),
                        void notice(
                          "The power is uncompelling",
                          `Your attempt to exorcise ${t.name} failed.`,
                        ))),
            ],
          ],
        });
      }
      function summonGhost(e, t) {
        snapClose();
        const a = null;
        return chance(0.15 + t.active / 200)
          ? (play("ghost"),
            t.friend >= 50
              ? ((t.friend = clamp(t.friend + rint(2, 6))),
                fx({ Happiness: +rint(3, 8) }, ""),
                say(`I summoned ${t.name}. We had a pleasant chat.`),
                notice(
                  "Spooky encounter",
                  `${t.name} appeared before you, smiled, and floated around the room for a while.`,
                  a,
                  !0,
                ))
              : ((t.friend = clamp(t.friend - rint(1, 4))),
                (e.cond = Math.max(0, e.cond - rint(2, 6))),
                fx({ Happiness: -rint(3, 8), Health: -rint(1, 5) }, ""),
                say(`I summoned ${t.name}, who trashed my ${e.name.toLowerCase()}.`),
                void notice(
                  "Poltergeist!",
                  `${t.name} appeared in a rage and hurled furniture across the room!`,
                  a,
                  !0,
                )))
          : (say(`I tried to summon ${t.name}, but nothing happened.`),
            notice("No luck", `You were unable to summon ${t.name}.`, a, !0));
      }
      function fansWantSocial() {
        const e = SOCIALS.filter(
          ([e, , , , , t]) =>
            !state.social[e] && state.age >= t && "onlyfans" !== e && socLive(e) && !NON_SOCIAL.has(e),
        ).map((e) => socOf(e[0]));
        if (!e.length) return;
        const [t, a] = any(e),
          o = /^[AEIOU]/.test(a) ? "an" : "a";
        jCard({
          tag: "Social",
          iconSrc: `social/${t}.png`,
          title: a,
          surprise: !0,
          lead: `Your fans are demanding that you join ${a}.<br><br>What will you do?`,
          choices: [
            [
              `Sign up for ${a}`,
              () =>
                pickEmail(a, (e) =>
                  signUpWithPw(t, a, e, () =>
                    notice(
                      pickR(["Need...followers...", "Building a community", "Hello, world"]),
                      `You signed up for ${o} ${a} account on ${e}.`,
                    ),
                  ),
                ),
            ],
            [
              "Stay away from it",
              () => {
                say(`I ignored my fans' demands to join ${a}.`),
                  chance(0.3) && (state.art.fame = clamp(state.art.fame - rint(1, 3))),
                  renderStats();
              },
            ],
          ],
        });
      }
      ageBtnEl.addEventListener("click", () => {
        if (!state.dead)
          for (const e of state.props)
            for (const t of e.ghosts || [])
              (t.active = clamp(t.active + rint(-6, 6))),
                chance(t.active / 900) &&
                  (say(`${t.name} kept me up all night in my ${e.name.toLowerCase()}.`),
                  fx({ Happiness: -rint(1, 4) }, ""),
                  queuePopup(() => {
                    play("ghost"),
                      notice(
                        "Things that go bump",
                        `${t.name} rattled chains and moaned all night long in your ${e.name.toLowerCase()}.`,
                      );
                  }));
      }),
        ageBtnEl.addEventListener("click", () => {
          const e = state.art;
          if (state.dead || !e || !e.fameOn) return;
          const t = chance(0.12) ? rint(8, 15) * (chance(0.5) ? 1 : -1) : rint(-5, 5);
          (e.fame = Math.max(1, Math.min(100, e.fame + t))), renderStats();
          let a = 0;
          for (const t in state.social) {
            const o = state.social[t];
            if (o.banned || notSocial(t)) continue;
            const n = Math.round(e.fame ** 2 * rint(8, 45) * (1 + 0.1 * o.momentum));
            (o.subs += n), (a += n);
          }
          a && say(`My fame earned me ${fmtN(a)} new followers on social media.`), socialStarCheck();
        });
      const FOUND_ITEMS = [
          ["Man Purse", "man purse", "emoji/1f45c.png"],
          ["Wallet", "wallet", "emoji/1f45b.png"],
          ["Purse", "purse", "emoji/1f45c.png"],
          ["Briefcase", "briefcase", "emoji/1f4bc.png"],
          ["Backpack", "backpack", "found/backpack.png"],
          ["Gold Watch", "gold watch", "found/watch-gold.png"],
          ["Cell Phone", "cell phone", "emoji/1f4f1.png"],
        ],
        FOUND_DRUGS = [
          ["Pills", "bag of pills", "found/pill.png", "pills"],
          ["Weed", "bag of weed", "found/weed.png", "weed"],
          ["Syringe", "used syringe", "found/syringe.png", "heroin"],
          ["Mushrooms", "bag of mushrooms", "found/mushroom.png", "shrooms"],
          ["White Powder", "bag of white powder", "found/pill.png", "cocaine"],
        ],
        FOUND_OLD = [
          ["Rifle", "lever-action rifle", "hunt/lever.png", "gun", "lever", 250],
          ["Shotgun", "double-barrel shotgun", "hunt/shotgun.png", "gun", "shotgun", 200],
          ["Revolver", "loaded revolver", "freelife/apple/1f52b.png", "cash", null, 300],
          ["Bowie Knife", "bowie knife", "freelife/apple/1f52a.png", "cash", null, 60],
          ["Pocket Watch", "gold pocket watch", "found/watch-gold.png", "cash", null, 900],
          ["Coin Purse", "leather coin purse", "freelife/apple/1f45b.png", "cash", null, 400],
          ["Carpetbag", "carpetbag", "freelife/apple/1f45c.png", "cash", null, 300],
          ["Gold Nugget", "gold nugget", "freelife/apple/1faa8.png", "cash", null, 1500],
          ["Greenbacks", "roll of greenbacks", "freelife/apple/1f4b5.png", "cash", null, 700],
          ["Money Sack", "sack of silver dollars", "freelife/apple/1f4b0.png", "cash", null, 2e3],
          ["Brooch", "jeweled brooch", "freelife/apple/1f48e.png", "cash", null, 1200],
          ["Top Hat", "silk top hat", "freelife/apple/1f3a9.png", "cash", null, 80],
          ["Spectacles", "pair of gold spectacles", "freelife/apple/1f453.png", "cash", null, 150],
          ["Fiddle", "fiddle in a case", "freelife/apple/1f3bb.png", "cash", null, 250],
          ["Family Bible", "family Bible", "freelife/apple/1f4d6.png", "cash", null, 40],
          ["Land Deed", "land deed", "freelife/apple/1f4dc.png", "cash", null, 0],
          ["Love Letter", "sealed love letter", "freelife/apple/1f48c.png", "letter", null, 0],
          ["Rag Doll", "lost rag doll", "freelife/apple/1f9f8.png", "cash", null, 0],
          ["Loaded Dice", "pair of loaded dice", "freelife/apple/1f3b2.png", "cash", null, 20],
          ["Crystal Ball", "fortune teller's crystal ball", "freelife/apple/1f52e.png", "cash", null, 350],
        ],
        FOUND_OLD_VICE = [
          ["Whiskey Jug", "jug of whiskey", "freelife/apple/1f943.png", "whiskey"],
          ["Laudanum", "bottle of laudanum", "freelife/apple/1f9ea.png", "laudanum"],
          ["Opium Tin", "tin of opium", "freelife/apple/1fa94.png", "opium"],
          ["Tobacco Plug", "plug of chewing tobacco", "freelife/apple/1f6ac.png", "tobacco"],
        ];
      function foundItemOld() {
        const e = state.age >= 13 && chance(0.3),
          t = chance(0.5) ? "sheriff" : "constable",
          a = any([
            "On the way home from the general store",
            "Walking along the wagon road",
            "Down by the creek",
            "Behind the livery stable",
            "Along the railroad tracks",
            "In the tall grass by the churchyard",
            "Under the boardwalk on Main Street",
            "Near the old mill",
          ]);
        if (e) {
          const [e, o, n, s] = any(FOUND_OLD_VICE),
            r = /^[aeiou]/.test(o) ? "an" : "a";
          return jCard({
            tag: "Citizen",
            iconSrc: n,
            title: e,
            surprise: !0,
            lead: `${a}, you find ${r} ${o}.<br><br>What will you do?`,
            choices: [
              [
                `Take it to the ${t}`,
                () => {
                  fx({ Happiness: +rint(1, 3) }, ""),
                    (state.respect = clamp((state.respect ?? 40) + 2)),
                    say(`I took ${r} ${o} I found to the ${t}.`),
                    notice(
                      "Upstanding citizen",
                      `You handed the ${o} over to the ${t}, who tipped his hat to you.`,
                    );
                },
              ],
              [
                "tobacco" === s ? "Take a chaw" : "Take a swig",
                () => {
                  if (("laudanum" === s || "opium" === s) && chance(0.08))
                    return (
                      say(`I took ${r} ${o} I found.`),
                      setTimeout(
                        () => die("opium" === s ? "an opium overdose" : "an overdose of laudanum"),
                        300,
                      )
                    );
                  if (state.age < 18 && chance(0.35))
                    return (
                      (state.respect = clamp((state.respect ?? 40) - 3)),
                      fx({ Happiness: -rint(2, 5) }, ""),
                      say(`I got caught with ${r} ${o} I found and was marched to the woodshed.`),
                      notice(
                        "Caught red-handed",
                        `Your ${chance(0.5) ? "father" : "mother"} caught you with the ${o} and took you straight to the woodshed.`,
                      )
                    );
                  const e = {
                    whiskey: [
                      "You drank until the stars spun.",
                      "You sang loud enough to wake the whole county.",
                    ],
                    laudanum: [
                      "A warm, heavy dream settled over you for hours.",
                      "You floated through the afternoon like a cloud.",
                    ],
                    opium: [
                      "Strange, slow dreams carried you through the night.",
                      "You lost a whole day to sweet, foggy dreams.",
                    ],
                    tobacco: [
                      "You turned green as a frog and spat for an hour.",
                      "Your head spun but you kept it down.",
                    ],
                  }[s];
                  fx({ Happiness: +rint(2, 8), Health: -rint(2, "tobacco" === s ? 4 : 8) }, ""),
                    say(`I ${"tobacco" === s ? "chewed" : "drank"} ${r} ${o} I found.`),
                    notice(any(["Feeling queer", "Woozy", "Head spinning"]), any(e));
                },
              ],
              [
                "tobacco" === s ? "Toss it in the creek" : "Pour it out",
                () => say(`I found ${r} ${o} and got rid of it.`),
              ],
            ],
          });
        }
        const [o, n, s, r, i, l] = any(FOUND_OLD),
          c = /^[aeiou]/.test(n) ? "an" : "a";
        jCard({
          tag: "Citizen",
          iconSrc: s,
          title: o,
          surprise: !0,
          lead: `${a}, you find ${c} ${n}.<br><br>What will you do?`,
          choices: [
            [
              `Take it to the ${t}`,
              () => {
                const e = l && chance(0.6) ? ep(25 * rint(1, 4)) : 0;
                e && ((state.money += e), renderStats()),
                  fx({ Happiness: +rint(1, 4) }, ""),
                  (state.respect = clamp((state.respect ?? 40) + 2)),
                  say(
                    `I turned in ${c} ${n} I found to the ${t}.${e ? ` The owner gave me a ${usd(e)} reward.` : ""}`,
                  ),
                  notice(
                    "Honest as the day is long",
                    `You turned the ${n} in to the ${t}.${e ? `<br><br>The owner came by and gave you a ${usd(e)} reward for your honesty!` : " He thanked you kindly."}`,
                  );
              },
            ],
            [
              { gun: "Keep it", letter: "Read it", cash: "Keep it" }[r],
              () => {
                if ("letter" === r)
                  return (
                    fx({ Happiness: +rint(2, 5) }, ""),
                    say("I found a sealed love letter and read it."),
                    notice(
                      "Scandalous!",
                      any([
                        "It was from the parson's wife, and it was not addressed to the parson.",
                        "It was a heartfelt proposal of marriage, signed only with an initial.",
                        "It was full of poetry so bad you laughed until you cried.",
                      ]),
                    )
                  );
                if ("gun" === r) {
                  if (state.age < 12)
                    return (
                      say(`I found ${c} ${n}, but Father took it away from me.`),
                      notice(
                        "Not for children",
                        `Father took the ${n} away and hung it over the fireplace until you're older.`,
                      )
                    );
                  if (!hasGun(i)) {
                    (state.guns ||= []).push(i);
                    const e = gunOf(i).cls;
                    return (
                      ((state.ammo ||= {})[e] = ammoOf(e) + rint(3, 10)),
                      play("gunCock"),
                      say(`I found ${c} ${n} and kept it.`),
                      notice("Finders keepers", `The ${n} is yours now, along with a few rounds still in it.`)
                    );
                  }
                  const e = ep(l);
                  return (
                    (state.money += e),
                    renderStats(),
                    say(`I found ${c} ${n} and sold it to the gunsmith for ${usd(e)}.`),
                    notice(
                      "Sold to the gunsmith",
                      `You already have one, so you sold the ${n} to the gunsmith for ${usd(e)}.`,
                    )
                  );
                }
                const e = l ? ep(rint(Math.round(0.4 * l), l)) : 0;
                e && ((state.money += e), renderStats()),
                  say(`I kept ${c} ${n} I found.${e ? ` It fetched ${usd(e)}.` : ""}`),
                  notice(
                    "Finders keepers",
                    e
                      ? `You sold the ${n} for ${usd(e)}.`
                      : "Land Deed" === o
                        ? "The deed was for a swamp three counties over. Worthless."
                        : `The ${n} wasn't worth a plugged nickel, but you kept it anyway.`,
                  );
              },
            ],
            ["Leave it alone", () => say(`I found ${c} ${n} and left it alone.`)],
          ],
        });
      }
      function foundItem() {
        if (isOldEra()) return foundItemOld();
        const e = state.age >= 13 && chance(0.35),
          [t, a, o, n] = any(e ? FOUND_DRUGS : FOUND_ITEMS),
          s = /^[aeiou]/.test(a) ? "an" : "a",
          r = any(["On your walk", "While on your walk", "Walking through the park", "On your way home"]),
          i = () => {
            const t = e ? 100 * rint(1, 5) : 50 * rint(0, 4);
            t && ((state.money += t), renderStats()),
              fx({ Happiness: +rint(1, 4) }, ""),
              say(
                `I turned in ${s} ${a} I found to the police.${t ? ` They gave me a ${usd(t)} reward.` : ""}`,
              ),
              notice(
                e ? "Model citizen" : "Good Samaritan",
                `You turned the ${a} in to the police.${t ? `<br><br>They thanked you with a ${usd(t)} reward for your honesty!` : " They thanked you for your honesty."}`,
              );
          };
        jCard({
          tag: "Citizen",
          iconSrc: "found/eyes.png",
          title: t,
          surprise: !0,
          lead: `${r}, you find ${s} ${a}.<br><br>What will you do?`,
          choices: e
            ? [
                ["Turn it in", i],
                [
                  "Consume it",
                  () => {
                    const e = Math.random();
                    return e < 0.12
                      ? (say(`I consumed ${s} ${a} I found on the street.`),
                        setTimeout(
                          () =>
                            die(
                              {
                                pills: "a pill overdose",
                                weed: "a drug overdose",
                                heroin: "a heroin overdose",
                                shrooms: "a bad mushroom trip",
                                cocaine: "a cocaine overdose",
                              }[n],
                            ),
                          300,
                        ))
                      : e < 0.32 && state.age >= 13
                        ? (say(`I was caught consuming ${s} ${a} I found on the street.`),
                          setTimeout(() => arrest("drug possession"), 300))
                        : (fx({ Happiness: +rint(3, 10), Health: -rint(2, 8) }, ""),
                          say(`I consumed ${s} ${a} I found on the street.`),
                          void notice(
                            any(["Trippy", "What a rush", "Seeing colors"]),
                            `You consumed the ${a}. ${any(["The walls started breathing.", "You felt amazing for a few hours.", "Everything was hilarious for a while."])}`,
                          ));
                  },
                ],
                ["Leave it alone", () => say(`I found ${s} ${a} and left it alone.`)],
              ]
            : [
                ["Turn it in", i],
                [
                  "Keep it, it's mine now",
                  () => {
                    const e =
                      "Gold Watch" === t ? rint(200, 3e3) : "Cell Phone" === t ? rint(50, 400) : rint(0, 500);
                    e && ((state.money += e), renderStats()),
                      say(
                        `I kept ${s} ${a} I found.${e ? ` It ${/Watch|Phone/.test(t) ? "was worth" : "contained"} ${usd(e)}.` : ""}`,
                      ),
                      notice(
                        "I saw it, I wanted it, I took it",
                        e
                          ? `The ${a} ${/Watch|Phone/.test(t) ? "was worth" : "contained"} ${usd(e)}.`
                          : `The ${a} was empty.`,
                      );
                  },
                ],
                ["Leave it alone", () => say(`I found ${s} ${a} and left it alone.`)],
              ],
        });
      }
      const FEUD_JOBS = [
          "rapper",
          "actor",
          "pop star",
          "supermodel",
          "reality star",
          "comedian",
          "talk show host",
          "rock star",
          "YouTuber",
        ],
        FEUD_INSULTS = [
          "an untalented pumpkinhead",
          "a washed-up nobody",
          "a walking participation trophy",
          "a human sleeping pill",
          "a glorified potato",
          "the human version of a wet sock",
          "a total clown",
          "a one-hit wonder",
        ],
        FEUD_PLACES = [
          "in a radio interview",
          "on a late-night talk show",
          "in a viral tweet",
          "during a red carpet interview",
          "on a podcast",
        ],
        FEUD_BACK = [
          "an overpaid cockalorum",
          "a talentless hack",
          "a thirsty clout chaser",
          "a has-been",
          "a walking airhorn",
          "a bargain-bin celebrity",
        ];
      function celebrityFeud() {
        const e = person(25, 60),
          t = any(FEUD_JOBS),
          a = "m" === e.g ? "him" : "her",
          o = state.art,
          n = (e) => {
            (o.fame = clamp(o.fame + e)), renderStats();
          };
        jCard({
          tag: "Fame",
          iconSrc: "emoji/1f92c.png",
          title: "Celebrity Feud",
          surprise: !0,
          lead: `The famous ${t}, ${e.full}, mentioned you were ${any(FEUD_INSULTS)} ${any(FEUD_PLACES)}.<br><br>What will you do?`,
          choices: [
            [
              "Return the insult",
              () => {
                const o = any(FEUD_BACK),
                  s = any([
                    "in an award acceptance speech",
                    "on live TV",
                    "in a diss track",
                    "on social media",
                  ]);
                chance(0.5) ? n(-rint(6, 15)) : n(+rint(4, 10)),
                  say(`The famous ${t}, ${e.full}, called me names, so I called ${a} ${o} ${s}.`),
                  notice("Oh yeah?", `You called ${a} ${o} ${s}.`);
              },
            ],
            [
              `Ignore ${a}`,
              () => {
                const a = Math.random();
                a < 0.15 ? n(-rint(1, 4)) : a < 0.3 && n(+rint(1, 4)),
                  say(`I ignored the famous ${t}, ${e.full}, who insulted me.`);
              },
            ],
          ],
        });
      }
      ageBtnEl.addEventListener("click", () =>
        setTimeout(() => {
          if (state.dead || state.age < 8) return;
          const e = state.stats.Happiness;
          if (hasIll("Anxiety")) {
            if (e < 60 || ills().find((e) => "Anxiety" === e.name).inherited) return;
            return (
              (state.ills = ills().filter((e) => "Anxiety" !== e.name)),
              say("I got my happiness back and recovered from anxiety."),
              queuePopup(() => curedCard("You are no longer suffering from anxiety."))
            );
          }
          (e < 30 ? chance(0.6) : e < 45 && chance(0.2)) && queuePopup(anxietyEvent);
        }, 250),
      ),
        ageBtnEl.addEventListener("click", () => {
          if (state.dead || state.prison) return;
          const e = state.art && state.art.fameOn && state.art.fame >= 20,
            t = [];
          e && state.age >= 13 && chance(0.2) && t.push(fansWantSocial),
            e && state.age >= 16 && chance(0.12) && t.push(celebrityFeud),
            state.age >= 8 && chance(0.07) && t.push(foundItem),
            t.length && queuePopup(any(t));
        }),
        (SND.curse = new Audio("sounds/a16_sndCurse.wav"));
      const PRAY_WISHES = ["Wealth", "General", "Happiness", "Health", "Love", "Fertility"],
        heirIco = heirBtn.querySelector("img"),
        heirTxt = heirBtn.querySelector("span"),
        prayShown = () => !prayBtn.classList.contains("hide");
      function showPrayOffer(e) {
        if (e && prayShown()) state.prayOffer && showPrayOffer(!1);
        else if (e)
          state.prayOffer || (state.prayOffer = { hid: heirBtn.classList.contains("hide") }),
            heirBtn.classList.remove("hide"),
            heirBtn.classList.add("praying"),
            (heirIco.src = "ui/rightButtonPrayIcon.png"),
            (heirTxt.textContent = "Pray");
        else {
          state.prayOffer;
          (state.prayOffer = null),
            heirBtn.classList.remove("praying"),
            (heirIco.src = "heirloom/ui-multiPurposeHeirloomIcon.png"),
            (heirTxt.textContent = "New Heirloom!"),
            heirBtn.classList.toggle("hide", !heirReady());
        }
      }
      function prayCard() {
        if (state.dead || overlayOpen()) return;
        jCard({
          tag: "You",
          person: {
            name:
              state.royal && !state.royal.abdicated
                ? state.royal.title
                : document.getElementById("pname").textContent,
            look: state.look,
            g: PG(),
            age: state.age,
          },
          iconSrc: "act/pray.png",
          title: "Pray",
          close: !0,
          lead: `Pray to the BitLife devs today!<label class="hr-lab" style="text-align:left;margin-top:16px">Pick your wish:</label><div class="hr-sel"><select id="praySel">${PRAY_WISHES.map((e) => `<option>${e}</option>`).join("")}</select></div>`,
          choices: [
            [
              '<img src="heirloom/ui-video.png" alt="" style="height:20px;vertical-align:-4px;margin-right:8px">Pray to the BitLife devs',
              () => answerPrayer(document.getElementById("praySel")?.value || "General"),
              "dark",
            ],
            [
              "Curse them instead",
              () => iosConfirm("Confirm", "Are you sure you want to curse the BitLife devs?", curseDevs),
            ],
          ],
        });
        const e = ev.querySelector('[data-c="0"]');
        e && e.classList.add("pray-dev");
      }
      function answerPrayer(e) {
        if ((showPrayOffer(!1), state.prayedAt === state.age))
          return (
            say("I prayed to the BitLife devs again, but they were done listening for the year."),
            notice("Unanswered prayers", "The BitLife devs already answered your prayers this year.")
          );
        if (
          ((state.prayedAt = state.age),
          say(`I prayed to the BitLife devs for ${"General" === e ? "a better life" : e.toLowerCase()}.`),
          !chance(0.7))
        )
          return notice("Unanswered prayers", "The BitLife devs didn't answer your prayers.");
        const t = state.stats,
          a = () => rint(10, 25),
          o = {
            Wealth: () => {
              const e = rint(5, 50) * (state.age >= 18 ? 1e3 : 100);
              return (state.money += e), `The BitLife devs blessed you with ${usd(e)}!`;
            },
            General: () => {
              for (const e in t) t[e] = clamp(t[e] + rint(3, 8));
              return "You feel better about everything.";
            },
            Happiness: () => (
              (t.Happiness = clamp(t.Happiness + a())), "You feel a wave of happiness wash over you."
            ),
            Health: () => ((t.Health = clamp(t.Health + a())), "You feel healthier than you have in years."),
            Love: () => {
              const e = state.lovers.find((e) => e.main) || state.lovers[0];
              return e
                ? ((e.rel = clamp(e.rel + a())), `You and ${e.first} feel closer than ever.`)
                : ((t.Happiness = clamp(t.Happiness + rint(3, 8))),
                  "You feel like love is just around the corner.");
            },
            Fertility: () => (
              (state.attrs = state.attrs || {}),
              (state.attrs.Fertility = clamp((state.attrs.Fertility ?? 50) + a())),
              "You feel more fertile than ever."
            ),
          }[e]();
        renderStats(), notice("Answered prayers", o);
      }
      function devStrike() {
        (SND.curse.currentTime = 0), SND.curse.play().catch(() => {});
        const e = document.createElement("div");
        (e.className = "tm-strike"),
          (e.innerHTML =
            '<img class="b1" src="ui/tm-lightning1.png" alt=""><img class="b2" src="ui/tm-lightning2.png" alt="">');
        const t = document.querySelector(".phone");
        t.append(e),
          t.classList.remove("tm-shake"),
          t.offsetWidth,
          t.classList.add("tm-shake"),
          setTimeout(() => t.classList.remove("tm-shake"), 1550),
          setTimeout(() => e.classList.add("out"), 1700),
          setTimeout(() => e.remove(), 2200);
      }
      function curseDevs() {
        showPrayOffer(!1),
          say(
            any([
              "I cursed the BitLife devs and spat at the ground.",
              "I cursed the BitLife devs at the top of my lungs.",
              "While at a hockey game, I thought about the BitLife devs and spat at the ground.",
            ]),
          ),
          devStrike();
        const e = Math.random();
        let t = "";
        if (e < 0.35 && state.money > 0) {
          const e = Math.round(state.money * (0.3 + 0.7 * Math.random()));
          (state.money -= e),
            say(`The BitLife devs took ${usd(e)} from me.`),
            (t = `<br><br>The devs took ${usd(e)} from your bank account.`);
        } else if (e < 0.6) {
          for (const e in state.stats) state.stats[e] = rint(0, 12);
          say("The BitLife devs wrecked my life."),
            (t = "<br><br>The devs struck back and wrecked all of your stats.");
        }
        renderStats(),
          setTimeout(() => notice("How the turns have tabled", `You cursed the BitLife devs!${t}`), 1900);
      }
      heirBtn.addEventListener(
        "click",
        (e) => {
          state.prayOffer && (e.stopImmediatePropagation(), overlayOpen() || (play("pray"), prayCard()));
        },
        !0,
      ),
        ageBtnEl.addEventListener("click", () => {
          if (state.dead) return;
          const e = Object.values(state.stats).some((e) => e < 20);
          !state.prayOffer && e && chance(0.4)
            ? showPrayOffer(!0)
            : state.prayOffer && !e && showPrayOffer(!1);
        }),
        setTimeout(() => {
          state.prayOffer && showPrayOffer(!0);
        }, 1500),
        new MutationObserver(() => {
          prayShown() && state.prayOffer && showPrayOffer(!1);
        }).observe(prayBtn, { attributes: !0, attributeFilter: ["class"] }),
        (SND.paranormal = new Audio("sounds/a16_sndParanormal.wav")),
        (SND.scream = new Audio("sounds/a16_sndScream.wav"));
      const ghostlyCard = () => {
          ev.querySelector(".jcw")?.setAttribute("data-ghost", ""), ev.classList.add("ghostly");
        },
        PHENOMENA = [
          "While heading to bed after your nightly routine, you sense an icy chill running up the back of your neck. Your hair follicles sharpen as the room gets noticeably colder.",
          "You hear slow footsteps pacing the hallway outside your bedroom, but nobody else is home.",
          "Every door in the house slams shut at the same time while you are eating dinner.",
          "The rocking chair in the corner of your living room starts rocking on its own.",
          "You wake up at 3 AM to the sound of someone humming a lullaby in the attic.",
          'Your bathroom mirror fogs up and the words "GET OUT" appear on the glass.',
        ],
        APPARITIONS = [
          "A raven-haired female specter thinly cloaked in diaphanous lace suddenly appears, tiptoeing toward you with a seductive gaze.",
          "A headless figure in a tattered suit drifts through the wall and points at you.",
          "A pale little girl clutching a doll appears at the foot of your bed and giggles.",
          "A translucent old man in a nightgown floats down the staircase, moaning your name.",
          "A shadowy monk with glowing eyes rises out of the floorboards in front of you.",
        ],
        hauntedHome = () => state.props.find((e) => isHaunted(e) && ensureGhosts(e).length);
      function phenomena() {
        const e = hauntedHome();
        e &&
          !state.dead &&
          ((SND.paranormal.currentTime = 0),
          SND.paranormal.play().catch(() => {}),
          jCard({
            tag: "Paranormal",
            iconSrc: "found/cold-face.png",
            title: "Phenomena",
            surprise: !0,
            lead: `${any(PHENOMENA)}<br><br>What will you do?`,
            choices: [
              [
                "Hide",
                () => {
                  fx({ Happiness: -rint(1, 3) }, ""),
                    say("I hid under the covers until morning after something creepy happened in my house.");
                },
              ],
              ["Investigate", () => setTimeout(() => encounter(e), 120)],
              [
                "Think nothing of it",
                () => {
                  if (chance(0.4)) return setTimeout(() => encounter(e), 120);
                  say("Something creepy happened in my house, but I thought nothing of it.");
                },
              ],
            ],
          }),
          ghostlyCard());
      }
      function encounter(e) {
        if (state.dead) return;
        (SND.scream.currentTime = 0),
          SND.scream.play().catch(() => {}),
          (state.paraCount = (state.paraCount || 0) + 1);
        const t = rint(30, 95),
          a = (e, t, a, o) => {
            fx(o, ""), say(a), notice(e, t, schizoCheck);
          };
        jCard({
          tag: "Paranormal",
          iconSrc: "ghost/ghost.png",
          title: "Encounter",
          surprise: !0,
          lead: `${any(APPARITIONS)}<br><br>What will you do?`,
          bars: [["Your Terror", t, "#b3261e"]],
          choices: [
            [
              "Ask it to leave me alone",
              () =>
                a(
                  "To the Boohamas with you",
                  "You begged it to leave you alone.<br><br>It vanished as quickly as it appeared.",
                  "I encountered a ghost and begged it to leave me alone.",
                  { Happiness: -rint(1, 4) },
                ),
            ],
            [
              "Insult it",
              () =>
                chance(0.5)
                  ? a(
                      "Poltergeist!",
                      "You insulted the ghost. It shrieked and hurled a lamp at your head!",
                      "I insulted a ghost and it threw a lamp at me.",
                      { Health: -rint(3, 10), Happiness: -rint(2, 5) },
                    )
                  : a(
                      "Ghosted",
                      "You insulted the ghost. It looked hurt and faded away.",
                      "I insulted a ghost until it faded away.",
                      { Happiness: +rint(1, 3) },
                    ),
            ],
            [
              "Run for my life",
              () =>
                a(
                  "Run, Forrest, run!",
                  "You ran screaming out of the house and spent the night in your car.",
                  "I ran for my life from a ghost.",
                  { Health: -rint(0, 3), Happiness: -rint(2, 6) },
                ),
            ],
            [
              "Try to stay calm",
              () =>
                chance(0.55)
                  ? a(
                      "Nerves of steel",
                      "You stayed perfectly calm. The ghost got bored and disappeared.",
                      "I stayed calm during a ghost encounter.",
                      { Happiness: +rint(0, 2) },
                    )
                  : a(
                      "Lost it",
                      "You tried to stay calm, but you fainted the moment it touched your shoulder.",
                      "I fainted during a ghost encounter.",
                      { Health: -rint(2, 6), Happiness: -rint(3, 6) },
                    ),
            ],
          ],
        }),
          ghostlyCard();
      }
      function schizoCheck() {
        state.dead ||
          hasIll("Schizophrenia") ||
          (state.paraCount || 0) < 3 ||
          state.stats.Health >= 50 ||
          !chance(0.35) ||
          (ills().push({ name: "Schizophrenia", drain: rint(2, 4), known: !0, cureLeft: rint(20, 40) }),
          (state.stats.Happiness = clamp(state.stats.Happiness - rint(5, 12))),
          renderStats(),
          say("I was diagnosed with schizophrenia."),
          queuePopup(() =>
            illnessCard("found/brain.png", "Schizophrenia", "You are suffering from schizophrenia."),
          ));
      }
      ageBtnEl.addEventListener("click", () => {
        state.dead ||
          state.prison ||
          (hauntedHome() && chance(0.22)
            ? queuePopup(phenomena)
            : state.age >= 18 && chance(0.04) && queuePopup(() => viceCard(!0)));
      });
      for (const Be of ["CardFlip", "CardFlipFast", "CasinoDraw", "CasinoWin2", "CasinoLose2", "CasinoOpen"])
        SND[Be] = new Audio(`sounds/a16_snd${/^Casino/.test(Be) ? Be : "Casino" + Be}.wav`);
      const sfx = (e) => {
          const t = SND[e];
          t && ((t.currentTime = 0), t.play().catch(() => {}));
        },
        CASINO_NAMES = [
          "Secret Hotel & Casino",
          "Aurora Resort & Gaming",
          "Golden Horseshoe Casino",
          "Lucky Seven Lounge",
          "The Grand Royale",
          "Silver Spur Casino",
          "Neon Palms Resort",
          "Diamond Dunes Casino",
          "The Velvet Room",
          "High Roller Hotel & Casino",
        ],
        DEALERS = [
          ["Felicity", "f"],
          ["Marco", "m"],
          ["Destiny", "f"],
          ["Vince", "m"],
          ["Gloria", "f"],
          ["Tony", "m"],
          ["Candice", "f"],
          ["Rocco", "m"],
          ["Bianca", "f"],
          ["Sal", "m"],
        ];
      function openCasinoGames() {
        syncProfile(),
          (sTitle.textContent = "CASINO GAMES"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const e = (e, t, a) =>
            `<div class="row" data-cg="${e}"><img src="casino/casino-${e}.png"><div class="t"><b>${t}</b><span>${a}</span></div><img class="seal" src="casino/seal.png" alt=""></div>`,
          t = document.querySelector(".phone"),
          a = t.classList.contains("flui") && !t.classList.contains("y2018");
        (sList.innerHTML =
          `<div class="row" data-cg="blackjack"><img src="casino/casino-blackjack.png"><div class="t"><b>Blackjack</b><span>Play blackjack</span></div>${DOTS}</div>` +
          (a
            ? ""
            : '<div class="sec">Premium Casino Games</div>' +
              e("craps", "Craps", "Play at a craps table") +
              e("high-low", "High-Low", "Play at a high-low table") +
              e("keno", "Keno", "Play at a keno table") +
              e("roulette", "Roulette", "Play at a roulette table") +
              e("slots", "Slots", "Play at a slot machine") +
              e("sports-betting", "Sports Betting", "Participate in sports betting") +
              '<div class="row" data-cg="texas"><img src="casino/casino-texas.png"><div class="t"><b>Texas Hold\'em</b><span>Play Texas hold\'em</span></div><img class="free-badge" src="casino/free.png" alt="FREE!"></div>')),
          sList.querySelectorAll("[data-cg]").forEach(
            (e) =>
              (e.onclick = () => {
                if ("blackjack" !== e.dataset.cg) return comingSoon();
                if (state.age < 18)
                  return notice("Too Young", "You must be at least 18 to gamble at a casino.", null, !0);
                jCard({
                  tag: "Leisure",
                  iconSrc: "casino/spade-suit.png",
                  title: "Blackjack",
                  close: !0,
                  lead: "Which local casino will you visit to play blackjack?",
                  choices: (state.casinos ||= [...CASINO_NAMES]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 2)).map((e) => [
                    e,
                    () => {
                      snapClose(),
                        sfx("CasinoOpen"),
                        setTimeout(() => blackjackBet({ casino: e, earned: 0, dealer: any(DEALERS) }), 120);
                    },
                  ]),
                });
              }),
          ),
          (sList.scrollTop = 0),
          screen.classList.add("open");
      }
      function blackjackBet(e) {
        if (state.dead) return;
        if (state.money < 10) return leaveCasino(e, !0);
        const t = Math.max(10, Math.min(state.money, 1e7)),
          a = t >= 1e6 ? 1e3 : t >= 1e4 ? 100 : 10,
          o = Math.max(a, Math.min(t, e.last || Math.round((0.1 * t) / a) * a));
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="bjX" style="left:-14px;top:-14px">${CARD_X}</div><div class="jm-tag" style="margin-top:12px">Casino</div>\n      <h4><img src="casino/spade-suit.png" alt=""><span>${e.casino}</span></h4>\n      <div class="lead">${state.casinoLife ? `You have lifetime casino ${state.casinoLife > 0 ? "earnings" : "losses"} of ${usd(Math.abs(state.casinoLife))}.<br><br>` : ""}Place your blackjack bets!</div>\n      <table class="jc"><tbody><tr><td><b>Bank Balance:</b> ${usd(state.money)}</td></tr><tr><td><b>Session Earnings:</b> ${e.earned < 0 ? `-${usd(-e.earned)}` : usd(e.earned)}</td></tr></tbody></table>\n      <div class="gm-row" style="margin-top:18px"><span class="hr-lab" style="margin:0">Bet</span><b id="bjAmt">${usd(o)}</b></div>\n      <input type="range" class="gm-range" id="bjRange" min="${a}" max="${Math.floor(t / a) * a || a}" step="${a}" value="${o}">\n      <button class="jm-apply ev-btn" id="bjDeal">Deal them!</button><button class="jm-apply ev-btn" id="bjLeave">Leave the casino</button></div>`),
          (ev.style.overflow = "visible");
        const n = document.getElementById("bjRange");
        n.oninput = () => {
          document.getElementById("bjAmt").textContent = usd(+n.value);
        };
        const s = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("bjX").onclick = () => {
          play("dismiss"), s(), leaveCasino(e);
        }),
          (document.getElementById("bjLeave").onclick = () => {
            s(), leaveCasino(e);
          }),
          (document.getElementById("bjDeal").onclick = () => {
            const t = Math.min(+n.value, state.money);
            (e.last = t), blackjackTable(e, t);
          }),
          evWrap.classList.add("open");
      }
      function leaveCasino(e, t) {
        if (t) return notice("Flat broke", `You ran out of money at ${e.casino}.`, null, !0);
        nekoLuck() || setTimeout(nekoOffer, 150);
      }
      const nekoLuck = () => !(!state.neko && !mods.goldenNeko);
      function nekoOffer() {
        if (state.dead || nekoLuck() || overlayOpen()) return;
        jCard({
          tag: "Casino",
          iconSrc: "casino/neko.png",
          title: "Golden Neko Statue",
          surprise: !0,
          lead: "Just as you're leaving the casino, you see a little old lady counting the biggest pile of coins you've ever seen.<br><br>She tells you that ever since she bought a Golden Neko Statue, her casino winnings have increased by 20%.<br><br>What will you do?",
          choices: [
            [
              "Get one of my own",
              () => {
                (state.neko = !0),
                  say("I got my own Golden Neko Statue for luck at the casino."),
                  notice(
                    "Lucky cat",
                    "You got your very own Golden Neko Statue!<br><br>You now have luck at gambling. Your winnings will be 20% bigger.",
                    null,
                    !0,
                  );
              },
            ],
            ["Leave the casino", () => {}],
          ],
        });
        const e = ev.querySelector("h4");
        e.querySelector("img").remove(),
          e.insertAdjacentHTML("afterend", '<img class="neko-big" src="casino/neko.png" alt="">'),
          ev.querySelector('[data-c="0"]').classList.add("pray-dev", "neko-get");
      }
      const bjValue = (e) => {
        let t = 0,
          a = 0;
        for (const o of e) 12 === o.r ? (a++, (t += 11)) : (t += o.r >= 8 ? 10 : o.r + 2);
        for (; t > 21 && a; ) (t -= 10), a--;
        return t;
      };
      function blackjackTable(e, t) {
        (state.money -= t), renderStats();
        const a = [];
        for (let e = 0; e < 4; e++) for (let t = 0; t < 13; t++) a.push({ s: e, r: t });
        a.sort(() => Math.random() - 0.5);
        const o = [],
          n = [],
          [s, r] = e.dealer;
        (e.dealerLook ||= randomLook(r, (e.dealerAge ||= rint(24, 55)))),
          evWrap.classList.remove("open"),
          (ev.style.overflow = ""),
          setTimeout(() => {
            ev.classList.remove("death18"),
              (ev.innerHTML = `<div class="jcw"><div class="jm-tag" style="margin-top:12px">Blackjack</div>\n      <h4><i class="bj-face"></i><span>${s} (Dealer)</span></h4>\n      <div class="lead">Get as close as possible to 21 without going over!<br><br>You have ${usd(t)} riding on this bet.</div>\n      <div class="bj-table"><div class="bj-hand" id="bjD"></div>\n        <div class="bj-score"><span class="dl" id="bjDl">${s}: <b id="bjDs">0</b></span><br><span id="bjPl">You: <b id="bjPs">0</b></span></div>\n        <div class="bj-hand" id="bjP"></div></div>\n      <div id="bjEnd"><button class="jm-apply ev-btn" id="bjHit">Hit me</button><button class="jm-apply ev-btn" id="bjStand">I'll stand</button></div></div>`),
              ev
                .querySelector("i.bj-face")
                .replaceWith(npcFace(e.dealerLook, r, e.dealerAge, "happy", "bj-face"));
            const i = ev.querySelector(".bj-table"),
              l = document.getElementById("bjD"),
              c = document.getElementById("bjP"),
              d = document.getElementById("bjEnd");
            let u = !1,
              h = !1;
            const p = (e, t) => {
                const a = document.createElement("div");
                return (
                  (a.className = "bj-card" + (t ? " back" : "")),
                  (a.innerHTML = ((e) =>
                    `<img class="rk" src="casino/${1 === e.s || 2 === e.s ? "red" : "black"}${e.r}.png" alt=""><img class="st" src="casino/suit${e.s}.png" alt="">`)(
                    e,
                  )),
                  a
                );
              },
              m = (e, t, a) => {
                (t.textContent = a),
                  a > 21 &&
                    setTimeout(() => {
                      (t.textContent = "Bust!"), e.classList.add("bust");
                    }, 300);
              },
              f = () => m(document.getElementById("bjPl"), document.getElementById("bjPs"), bjValue(o)),
              g = () => {
                (document.getElementById("bjDl").style.visibility = "visible"),
                  m(
                    document.getElementById("bjDl"),
                    document.getElementById("bjDs"),
                    bjValue(u ? n : n.slice(1)),
                  );
              },
              y = (e, t, n) => {
                const s = a.pop();
                e.push(s);
                const r = i.getBoundingClientRect(),
                  l = t.getBoundingClientRect(),
                  c = t.lastElementChild,
                  d = c ? c.getBoundingClientRect().left - r.left + 29 : (r.width - 40) / 2,
                  u = p(s, n);
                u.classList.add("bj-fly"),
                  Object.assign(u.style, {
                    left: r.width - 40 - 4 + "px",
                    top: l.top - r.top + (l.height - 56) / 2 + "px",
                    opacity: 0.5,
                  }),
                  i.append(u),
                  u.offsetWidth,
                  Object.assign(u.style, { left: `${d}px`, opacity: 1 }),
                  sfx("CardFlipFast"),
                  setTimeout(() => {
                    u.remove(), t.append(p(s, n));
                  }, 70),
                  setTimeout(e === o ? f : g, 190);
              };
            function b(e) {
              (() => {
                const e = l.firstElementChild;
                sfx("CardFlip"),
                  e.classList.add("squeeze"),
                  setTimeout(() => {
                    e.classList.remove("back"), (u = !0), g(), e.classList.remove("squeeze");
                  }, 135);
              })();
              const t = () => {
                !e && bjValue(n) < 17
                  ? (y(n, l), setTimeout(t, 630))
                  : setTimeout(v, bjValue(n) > 21 ? 1e3 : 700);
              };
              setTimeout(t, 420);
            }
            function v() {
              const a = bjValue(o),
                s = bjValue(n),
                r = 21 === a && 2 === o.length && !(21 === s && 2 === n.length),
                i = a > 21 ? "lose" : r ? "blackjack" : s > 21 || a > s ? "win" : a === s ? "push" : "lose";
              let l = "blackjack" === i ? Math.round(2.5 * t) : "win" === i ? 2 * t : "push" === i ? t : 0;
              l > t && nekoLuck() && (l += Math.round(0.2 * (l - t)));
              const c = l - t;
              (state.money += l),
                (e.earned += c),
                (state.casinoLife = (state.casinoLife || 0) + c),
                renderStats(),
                c > 0 ? sfx("CasinoWin2") : c < 0 && sfx("CasinoLose2"),
                say(
                  c > 0
                    ? `I won ${usd(c)} on a hand of blackjack at ${e.casino}.`
                    : c < 0
                      ? `I lost ${usd(-c)} on a hand of blackjack at ${e.casino}.`
                      : `I broke even on a hand of blackjack at ${e.casino}.`,
                ),
                (d.innerHTML = `<div class="bj-result">${"blackjack" === i ? "Blackjack!" : "win" === i ? "You Won!" : "push" === i ? "Push!" : "You Lost!"}</div>\n        <button class="jm-apply ev-btn bj-pop" id="bjCont">Continue</button>`),
                (document.getElementById("bjCont").onclick = () => {
                  evWrap.classList.remove("open"), (ev.style.overflow = "");
                  const [t, a] =
                    c > 0
                      ? [
                          "blackjack" === i
                            ? "Blackjack!"
                            : any(["High roller", "Winner winner", "Lady luck"]),
                          `You won ${usd(c)} on the hand of blackjack!`,
                        ]
                      : c < 0
                        ? [
                            any(["What was I thinking", "House always wins", "Easy come, easy go"]),
                            `You lost ${usd(-c)} on the hand of blackjack.`,
                          ]
                        : ["Push", "You broke even on the hand of blackjack."];
                  notice(t, a, () => setTimeout(() => blackjackBet(e), 80), !0);
                });
            }
            o.push(a.pop()),
              c.append(p(o[0])),
              f(),
              setTimeout(() => y(n, l, !0), 70),
              setTimeout(() => y(o, c), 280),
              setTimeout(() => y(n, l), 480),
              setTimeout(() => {
                if (21 === bjValue(o)) return (d.innerHTML = ""), b(!0);
                h = !0;
              }, 760),
              (document.getElementById("bjHit").onclick = () => {
                if (h) {
                  if (((h = !1), nekoLuck() && chance(0.35) && bjValue([...o, a[a.length - 1]]) > 21)) {
                    const e = a.findIndex((e) => bjValue([...o, e]) <= 21);
                    e >= 0 && a.push(a.splice(e, 1)[0]);
                  }
                  y(o, c),
                    setTimeout(() => {
                      const e = bjValue(o);
                      e > 21
                        ? ((d.innerHTML = ""), setTimeout(v, 1e3))
                        : 21 === e
                          ? ((d.innerHTML = ""), b())
                          : (h = !0);
                    }, 300);
                }
              }),
              (document.getElementById("bjStand").onclick = () => {
                h && ((h = !1), (d.innerHTML = ""), b());
              }),
              evWrap.classList.add("open");
          }, 160);
      }
      const curFix = (e) => {
        const t = cur();
        if ("$" === t) return;
        const a = (e) => {
          3 !== e.nodeType
            ? 1 !== e.nodeType ||
              e.matches("script, style, input, textarea, .news") ||
              e.childNodes.forEach(a)
            : /(?<![A-Za-z$])\$\d/.test(e.nodeValue) &&
              !e.parentElement?.closest(".news, script, style") &&
              (e.nodeValue = e.nodeValue.replace(/(?<![A-Za-z$])\$(?=\d)/g, t));
        };
        a(e);
      };
      new MutationObserver((e) => {
        for (const t of e) "characterData" === t.type ? curFix(t.target) : t.addedNodes.forEach(curFix);
      }).observe(document.querySelector(".phone"), { childList: !0, subtree: !0, characterData: !0 }),
        curFix(document.querySelector(".phone"));
      const GL_ALIAS = {
          cd: "Dem. Rep. Congo",
          cz: "Czechia",
          do: "Dominican Rep.",
          us: "United States of America",
        },
        GL_POINTS = {
          ad: [1.52, 42.51],
          aw: [-69.97, 12.52],
          hk: [114.17, 22.32],
          mc: [7.42, 43.74],
          sg: [103.82, 1.35],
          ws: [-172.1, -13.76],
          fr: [2.4, 46.6],
          us: [-98, 39],
          no: [9, 61],
          ru: [90, 60],
          nl: [5.3, 52.2],
          gb: [-2, 53.5],
          dk: [9.5, 56],
          cl: [-71, -33],
          nz: [172, -41],
        },
        GL_CAVE = {
          "the Dordogne Valley (France)": [1, 45],
          "the Swabian Jura (Germany)": [9.6, 48.4],
          "the Altai Mountains (Siberia)": [86, 50],
          "the Zagros Mountains (Iran)": [47, 33.5],
          "the Great Rift Valley (East Africa)": [36.5, -0.5],
          "the Cantabrian coast (Spain)": [-4.5, 43.3],
          "the Carpathian Mountains (Romania)": [25, 46],
        };
      let glReady = null,
        glFeat = null,
        glByName = null;
      const glLoad = () =>
          (glReady ||= ["globe/d3.min.js", "globe/topojson-client.min.js", "globe/countries-110m.js"]
            .reduce(
              (e, t) =>
                e.then(
                  () =>
                    new Promise((e, a) => {
                      const o = document.createElement("script");
                      (o.src = t), (o.onload = e), (o.onerror = a), document.head.append(o);
                    }),
                ),
              Promise.resolve(),
            )
            .then(() => {
              (glFeat = topojson.feature(WORLD_TOPO, WORLD_TOPO.objects.countries).features),
                (glByName = Object.fromEntries(glFeat.map((e) => [e.properties.name, e])));
              for (const e of Object.keys(COUNTRIES)) {
                const t = glFeatureOf(e);
                t && (t.code = e);
              }
            })),
        glFeatureOf = (e) => glByName[GL_ALIAS[e] || (COUNTRIES[e] || [""])[0]],
        glPointOf = (e) => GL_POINTS[e] || (glFeatureOf(e) ? d3.geoCentroid(glFeatureOf(e)) : null),
        glImgs = {},
        glImg = (e) => {
          const t = (glImgs[e] ||= Object.assign(new Image(), { src: e }));
          return t.complete && t.naturalWidth ? t : null;
        };
      function glCaveFace(e) {
        const t = e.life,
          a = t < 3 ? "baby" : t < 14 ? "kid" : t < 40 ? "adult" : "elder",
          o = FT_CAVE_SPRITES.filter((t) => t[5] === a && (t[4] === e.g || "x" === t[4])),
          n = o.length ? o : FT_CAVE_SPRITES.filter((e) => e[5] === a),
          s = a + e.g;
        (e.sprites ??= {}), (e.sprites[s] ??= rint(0, n.length - 1));
        const [r, i, l, c] = n[e.sprites[s] % n.length],
          [d] = FT_CAVE_SHEETS[r],
          u = document.createElement("canvas");
        u.width = u.height = 250;
        const h = new Image();
        return (
          (h.onload = () => u.getContext("2d").drawImage(h, i - c / 2, l - c / 2, c, c, 0, 0, 250, 250)),
          (h.src = d),
          u
        );
      }
      function glFace(e) {
        if (e.face) return e.face;
        const t = e.p;
        if (t.cave) return (e.face = glCaveFace(t));
        if (t === state) return (e.face = npcFace(state.look, PG(), state.age, "happy"));
        const [a, o] = ftYears(t),
          n = Math.max(0, Math.min(o - a, 90));
        return (e.face = t.look ? npcFace(t.look, t.g || t.gender || "m", n, "happy") : null);
      }
      function glPeople() {
        const e = ftSetup(),
          t = ftCtx();
        try {
          ftInheritAll(e, t);
        } catch (e) {}
        const a = [],
          o = (e) =>
            0 === e
              ? "Great-grandparent"
              : 1 === e
                ? "Great-great-grandparent"
                : `${e + 1}× great-grandparent`,
          n = (e, o, n, s) => {
            if (!e) return;
            const r = e.cave ? null : ftYears(e);
            a.push({
              p: e,
              rel: o,
              side: n,
              order: s,
              name:
                e === state
                  ? `${state.first} ${SURNAME}`
                  : `${e.first} ${e.anc ? e.last || "" : e === t.dad || e === t.mom ? SURNAME : e.last || SURNAME}`.trim(),
              born: r ? r[0] : e.born,
              died: e.cave ? e.born + e.life : r && (e.anc || e.dead) ? r[1] : null,
              country: e.cave ? null : e.country || state.country,
              moved: e.movedTo || null,
              where: e.cave ? e.where : null,
              conds: e.cave ? [] : ftConds(e),
            });
          };
        n(state, "You", "Y", 0),
          n(t.dad, "Father", "P", 1),
          n(t.mom, "Mother", "M", 1),
          e.gp.forEach((e, t) =>
            n(
              e,
              `${t % 2 ? "Grandmother" : "Grandfather"} (${t < 2 ? "dad's" : "mom's"} side)`,
              t < 2 ? "P" : "M",
              2,
            ),
          ),
          e.p.forEach((e, t) => e.forEach((e) => n(e, `${o(t)} (dad's side)`, "P", 3 + t))),
          e.m.forEach((e, t) => e.forEach((e) => n(e, `${o(t)} (mom's side)`, "M", 3 + t)));
        const s = e.cave;
        return s && [s.elder, s.dad, s.mom, ...s.kids].forEach((e) => n(e, `${s.clan}, Ice Age`, "C", 99)), a;
      }
      function glPlaces(e) {
        const t = new Map();
        for (const a of e) {
          const e = a.where ? "cave" : a.country;
          e &&
            (t.has(e) ||
              t.set(e, {
                key: e,
                cave: !!a.where,
                name: a.where ? a.where : ftCountryName(e),
                short: a.where ? "Ice Age clan" : ftCountryName(e),
                pt: a.where ? GL_CAVE[a.where] || [36.5, -0.5] : glPointOf(e),
                people: [],
              }),
            t.get(e).people.push(a));
        }
        return [...t.values()].filter((e) => e.pt).sort((e, t) => t.people.length - e.people.length);
      }
      const glEl = document.getElementById("glWrap"),
        glCv = document.getElementById("glCanvas"),
        glInfo = document.getElementById("glInfo"),
        glChipsEl = document.getElementById("glChips"),
        G = {
          mode: "anc",
          trait: "",
          side: "all",
          sel: null,
          focus: null,
          rot: [0, -20],
          vel: [0, 0],
          drag: null,
          idle: 0,
          raf: 0,
          people: [],
          places: [],
          hits: [],
        };
      async function openGlobe(e = "anc") {
        glEl.classList.add("open"), (glInfo.innerHTML = '<div class="gl-empty">Loading the world map…</div>');
        try {
          await glLoad();
        } catch (e) {
          return void (glInfo.innerHTML =
            '<div class="gl-empty">The world map files (globe/) are missing.</div>');
        }
        (G.people = glPeople()),
          (G.places = glPlaces(G.people)),
          (G.sel = G.focus = null),
          G.people.forEach(glFace);
        const t = glPointOf(state.country) || [0, 20];
        (G.rot = [-t[0], -Math.max(-50, Math.min(50, t[1]))]),
          (G.vel = [0, 0]),
          glSetMode(e),
          cancelAnimationFrame(G.raf),
          (G.last = performance.now()),
          (G.raf = requestAnimationFrame(glTick));
      }
      function glSetMode(e) {
        if (
          ((G.mode = e),
          (G.sel = G.focus = null),
          glEl.querySelectorAll("[data-gm]").forEach((t) => t.classList.toggle("on", t.dataset.gm === e)),
          "traits" === e)
        ) {
          const e = FT_CONDS.map((e) => [
            e,
            G.people.filter((t) => t.conds.some((t) => t.id === e.id)).length,
          ]).filter(([, e]) => e);
          G.trait && !e.some(([e]) => e.id === G.trait) && (G.trait = ""),
            (glChipsEl.innerHTML =
              `<button data-gt="" class="${G.trait ? "" : "on"}">All traits</button>` +
              e
                .map(
                  ([e, t]) =>
                    `<button data-gt="${e.id}" style="--cc:${e.col}" class="${G.trait === e.id ? "on" : ""}">${ftIco(e.id)}${e.name} <b>${t}</b></button>`,
                )
                .join("")),
            glChipsEl.querySelectorAll("[data-gt]").forEach(
              (e) =>
                (e.onclick = () => {
                  play("choice"),
                    (G.trait = e.dataset.gt),
                    (G.focus = null),
                    glChipsEl.querySelectorAll("[data-gt]").forEach((t) => t.classList.toggle("on", t === e)),
                    glPanel();
                }),
            );
        } else {
          const e = [
            ["all", "Everyone", "#3e8ee8"],
            ["P", "Dad's side", "#2f7fd8"],
            ["M", "Mom's side", "#e05a9c"],
            ["C", "Ice Age", "#8d6e63"],
          ];
          (glChipsEl.innerHTML = e
            .map(
              ([e, t, a]) =>
                `<button data-gs="${e}" style="--cc:${a}" class="${G.side === e ? "on" : ""}">${t}</button>`,
            )
            .join("")),
            glChipsEl.querySelectorAll("[data-gs]").forEach(
              (e) =>
                (e.onclick = () => {
                  play("choice"),
                    (G.side = e.dataset.gs),
                    (G.focus = null),
                    (G.sel = null),
                    glChipsEl.querySelectorAll("[data-gs]").forEach((t) => t.classList.toggle("on", t === e)),
                    glPanel();
                }),
            );
        }
        glChipsEl.classList.add("on"), glPanel();
      }
      const glHas = (e) =>
          "traits" === G.mode
            ? G.trait
              ? e.conds.some((e) => e.id === G.trait)
              : e.conds.length > 0
            : "all" === G.side || e.side === G.side || ("Y" === e.side && "C" !== G.side),
        glFlag = (e) => `flags/${e}.png`,
        glPlacePic = (e, t) =>
          e.cave
            ? `<i class="${t} gl-cavepic" data-fc="${G.people.indexOf(e.people[0])}"></i>`
            : `<img class="${t}" src="${glFlag(e.key)}" alt="">`;
      function glFillFaces(e) {
        e.querySelectorAll("i[data-fc]").forEach((e) => {
          const t = glFace(G.people[+e.dataset.fc]),
            a = document.createElement("canvas");
          (a.width = a.height = 120), (a.className = e.className);
          const o = () => {
            const e = a.getContext("2d");
            e.clearRect(0, 0, 120, 120), t && e.drawImage(t, 0, 0, 120, 120);
          };
          o(), setTimeout(o, 300), setTimeout(o, 900), e.replaceWith(a);
        });
      }
      const glLife = (e) =>
        e.where
          ? `c. ${(-e.born).toLocaleString("en-US")} BC`
          : e.died
            ? `${ftY(e.born)} – ${ftY(e.died)}`
            : `born ${ftY(e.born)}`;
      function glPanel() {
        const e = (G.sel ? [G.sel] : G.places)
            .map((e) => [e, e.people.filter(glHas).sort((e, t) => e.order - t.order)])
            .filter(([, e]) => e.length || G.sel),
          t = e.reduce((e, [, t]) => e + t.length, 0),
          a =
            "traits" === G.mode
              ? `Where ${G.trait ? FT_COND[G.trait].name : "the family's traits"} came from`
              : G.sel
                ? G.sel.name
                : `The ${SURNAME} family around the world`;
        (glInfo.innerHTML =
          `<h4>${G.sel ? glPlacePic(G.sel, "gl-hpic") : '<img class="gl-hpic" src="emoji/1f30e.png" alt="">'}${a}<small class="gl-cnt">${t} ${1 === t ? "person" : "people"}</small></h4>` +
          (G.sel ? '<button class="gl-all" id="glAll">‹ Whole family</button>' : "") +
          (e.length
            ? e
                .map(
                  ([e, t]) =>
                    `<div class="gl-grp${e.cave ? " cave" : ""}"><div class="gl-gh" data-pl="${e.key}">${glPlacePic(e, "gl-gpic")}<b>${e.name}</b><span class="n">${t.length}</span></div>` +
                    (t.length
                      ? t
                          .map((e) => {
                            const t = G.people.indexOf(e);
                            return `<div class="gl-row${G.focus === e ? " on" : ""}" data-pp="${t}"><i class="gl-fc" data-fc="${t}"></i><div class="t"><b>${e.name}</b><small>${e.rel}</small><small>${glLife(e)}${e.moved ? ` · moved to <img class="mini" src="flags/${e.moved}.png" alt="">${ftCountryName(e.moved)}` : ""}</small></div><span class="gl-tr">${e.conds
                              .slice(0, 4)
                              .map((e) => ftIco(e.id))
                              .join("")}</span></div>`;
                          })
                          .join("")
                      : '<div class="gl-empty">Nobody from here.</div>') +
                    "</div>",
                )
                .join("")
            : `<div class="gl-empty">${"traits" === G.mode ? `Nobody in the bloodline has ${G.trait ? FT_COND[G.trait].name : "a hereditary trait"}.` : "Nobody here."}</div>`)),
          glFillFaces(glInfo),
          glInfo.querySelectorAll("[data-pp]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), glFocus(G.people[+e.dataset.pp]);
              }),
          ),
          glInfo.querySelectorAll("[data-pl]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), glSelect(G.places.find((t) => t.key === e.dataset.pl));
              }),
          );
        const o = document.getElementById("glAll");
        o &&
          (o.onclick = () => {
            play("choice"), glSelect(null);
          });
      }
      const glPlaceOf = (e) => G.places.find((t) => t.people.includes(e)),
        glTurnTo = (e) => {
          (G.target = [-e[0], -Math.max(-60, Math.min(60, e[1]))]), (G.vel = [0, 0]);
        };
      function glSelect(e) {
        (G.sel = e), (G.focus = null), e && e.pt && glTurnTo(e.pt), glPanel(), (glInfo.scrollTop = 0);
      }
      function glFocus(e) {
        G.focus = G.focus === e ? null : e;
        const t = glPlaceOf(e);
        t && glTurnTo(t.pt),
          glInfo
            .querySelectorAll("[data-pp]")
            .forEach((e) => e.classList.toggle("on", G.people[+e.dataset.pp] === G.focus));
      }
      function glTick(e) {
        if (!glEl.classList.contains("open")) return;
        const t = Math.min(50, e - (G.last || e));
        (G.last = e),
          G.drag ||
            (G.target
              ? ((G.rot[0] += 0.12 * (((((G.target[0] - G.rot[0]) % 360) + 540) % 360) - 180)),
                (G.rot[1] += 0.12 * (G.target[1] - G.rot[1])),
                Math.abs(G.target[1] - G.rot[1]) < 0.1 &&
                  Math.abs(((((G.target[0] - G.rot[0]) % 360) + 540) % 360) - 180) < 0.1 &&
                  (G.target = null))
              : Math.abs(G.vel[0]) + Math.abs(G.vel[1]) > 0.01
                ? ((G.rot[0] += G.vel[0]),
                  (G.rot[1] = Math.max(-80, Math.min(80, G.rot[1] + G.vel[1]))),
                  (G.vel = G.vel.map((e) => 0.94 * e)))
                : !G.sel && !G.focus && (G.idle += t) > 2500 && (G.rot[0] += 0.005 * t)),
          glDraw(),
          (G.raf = requestAnimationFrame(glTick));
      }
      const glProj = (e) => {
        const t = e / glCv.clientWidth;
        return d3
          .geoOrthographic()
          .scale(e / 2 - 10 * t)
          .translate([e / 2, e / 2])
          .rotate([G.rot[0], G.rot[1]])
          .clipAngle(90);
      };
      function glDisc(e, t, a, o, n, s, r) {
        e.save(),
          e.beginPath(),
          e.arc(a, o, n, 0, 7),
          e.closePath(),
          (e.fillStyle = "#dfe8f5"),
          e.fill(),
          e.clip(),
          t && e.drawImage(t, a - n, o - n, 2 * n, 2 * n),
          e.restore(),
          (e.lineWidth = s * r),
          (e.strokeStyle = "#fff"),
          e.beginPath(),
          e.arc(a, o, n, 0, 7),
          e.stroke();
      }
      function glDraw() {
        const e = Math.min(2, window.devicePixelRatio || 1),
          t = glCv.clientWidth,
          a = Math.round(t * e);
        glCv.width !== a && (glCv.width = glCv.height = a);
        const o = glCv.getContext("2d"),
          n = a / 2 - 10 * e,
          s = glProj(a),
          r = d3.geoPath(s, o);
        o.clearRect(0, 0, a, a);
        const i = o.createRadialGradient(a / 2, a / 2, 0.96 * n, a / 2, a / 2, 1.09 * n);
        i.addColorStop(0, "rgba(120,190,255,.55)"),
          i.addColorStop(1, "rgba(120,190,255,0)"),
          (o.fillStyle = i),
          o.beginPath(),
          o.arc(a / 2, a / 2, 1.09 * n, 0, 7),
          o.fill();
        const l = o.createRadialGradient(a / 2 - 0.35 * n, a / 2 - 0.4 * n, 0.1 * n, a / 2, a / 2, n);
        l.addColorStop(0, "#4fb3f5"),
          l.addColorStop(0.7, "#1a6fc2"),
          l.addColorStop(1, "#0b3f7e"),
          (o.fillStyle = l),
          o.beginPath(),
          r({ type: "Sphere" }),
          o.fill(),
          (o.strokeStyle = "rgba(255,255,255,.09)"),
          (o.lineWidth = 0.6 * e),
          o.beginPath(),
          r(d3.geoGraticule10()),
          o.stroke();
        const c = new Map(G.places.map((e) => [e.key, e.people.filter(glHas).length])),
          d = Math.max(1, ...c.values()),
          u = "traits" === G.mode ? (G.trait ? FT_COND[G.trait].col : "#e0533d") : "#f4c044";
        for (const t of glFeat) {
          const a = (t.code && c.get(t.code)) || 0,
            n = G.sel && G.sel.key === t.code;
          o.beginPath(),
            r(t),
            (o.fillStyle = a
              ? d3.interpolateRgb("#9ccf7c", u)(0.45 + (0.55 * a) / d)
              : "Antarctica" === t.properties.name
                ? "#eef4f8"
                : "#8cc47a"),
            o.fill(),
            (o.strokeStyle = n ? "#ffffff" : "rgba(40,70,40,.55)"),
            (o.lineWidth = (n ? 2.4 : 0.6) * e),
            o.stroke();
        }
        const h = o.createRadialGradient(a / 2 - 0.4 * n, a / 2 - 0.45 * n, 0.2 * n, a / 2, a / 2, n);
        h.addColorStop(0, "rgba(255,255,255,.12)"),
          h.addColorStop(1, "rgba(0,10,40,.35)"),
          (o.fillStyle = h),
          o.beginPath(),
          r({ type: "Sphere" }),
          o.fill();
        const p = [-G.rot[0], -G.rot[1]],
          m = 13 * e,
          f = 11 * e,
          g = 40 * e,
          y = G.places
            .map((t) => {
              const a = t.people.filter(glHas).sort((e, t) => e.order - t.order);
              if (!a.length || d3.geoDistance(t.pt, p) > Math.PI / 2 - 0.05) return null;
              const [o, n] = s(t.pt),
                r = Math.min(3, a.length),
                i = 2 * m + r * f * 1.45 + (a.length > 3 ? 1.6 * f : 0) + 4 * e;
              return { P: t, ppl: a, x0: o, y0: n, x: o - m, y: n - m, w: i, k: r };
            })
            .filter(Boolean)
            .sort((e, t) => e.y0 - t.y0);
        for (const t of y)
          (t.x = Math.max(4 * e, Math.min(a - t.w - 6 * e, t.x))),
            (t.y = Math.max(4 * e, Math.min(a - g, t.y)));
        for (let e = 0; e < 6; e++)
          for (let e = 0; e < y.length; e++)
            for (let t = e + 1; t < y.length; t++) {
              const a = y[e],
                o = y[t];
              a.x < o.x + o.w && o.x < a.x + a.w && a.y < o.y + g && o.y < a.y + g && (o.y = a.y + g);
            }
        G.hits = [];
        for (const t of y) {
          const { P: a, ppl: n, x0: s, y0: r, k: i } = t,
            l = t.x + m,
            c = t.y + m,
            d = G.sel === a;
          Math.hypot(l - s, c - r) > 4 * e &&
            ((o.strokeStyle = "rgba(255,255,255,.8)"),
            (o.lineWidth = 1.2 * e),
            o.beginPath(),
            o.moveTo(s, r),
            o.lineTo(l, c),
            o.stroke(),
            (o.fillStyle = "#fff"),
            o.beginPath(),
            o.arc(s, r, 2.4 * e, 0, 7),
            o.fill()),
            (o.fillStyle = d ? "rgba(255,255,255,.95)" : "rgba(6,20,48,.72)"),
            o.beginPath(),
            o.roundRect(t.x - 2 * e, t.y - 2 * e, t.w + 2 * e, 2 * m + 4 * e, m + 2 * e),
            o.fill(),
            glDisc(o, a.cave ? glFace(a.people[0]) : glImg(glFlag(a.key)), l, c, m, 2, e),
            a.cave &&
              ((o.strokeStyle = "#a1887f"),
              (o.lineWidth = 2.5 * e),
              o.beginPath(),
              o.arc(l, c, m + 1.5 * e, 0, 7),
              o.stroke());
          const h = a.cave ? n.filter((e) => e !== a.people[0]) : n;
          if (
            (h
              .slice(0, 3)
              .forEach((t, a) => glDisc(o, glFace(t), l + m + 0.9 * f + a * f * 1.45, c, f, 1.5, e)),
            h.length > 3)
          ) {
            const t = l + m + 0.9 * f + 3 * f * 1.45 - 0.2 * f;
            (o.fillStyle = u),
              o.beginPath(),
              o.arc(t, c, 0.85 * f, 0, 7),
              o.fill(),
              (o.fillStyle = "#1b2430"),
              (o.font = `900 ${Math.round(0.9 * f)}px Nunito, sans-serif`),
              (o.textAlign = "center"),
              (o.textBaseline = "middle"),
              o.fillText("+" + (h.length - 3), t, c + 0.5 * e);
          }
          (o.font = `900 ${Math.round(10 * e)}px Nunito, sans-serif`),
            (o.textAlign = "left"),
            (o.textBaseline = "top"),
            (o.lineWidth = 3 * e),
            (o.strokeStyle = "rgba(0,0,0,.75)"),
            o.strokeText(a.short, t.x, t.y + 2 * m + 3 * e),
            (o.fillStyle = "#fff"),
            o.fillText(a.short, t.x, t.y + 2 * m + 3 * e),
            G.hits.push({ P: a, x: t.x - 2 * e, y: t.y - 2 * e, w: t.w + 2 * e, h: g });
        }
        const b = G.focus,
          v = b && glPlaceOf(b);
        if (v && d3.geoDistance(v.pt, p) < Math.PI / 2) {
          const [t, a] = s(v.pt),
            n = 30 * e,
            r = a - n - 26 * e;
          (o.fillStyle = "rgba(0,0,0,.3)"),
            o.beginPath(),
            o.arc(t + 2 * e, r + 3 * e, n, 0, 7),
            o.fill(),
            (o.strokeStyle = "#fff"),
            (o.lineWidth = 2 * e),
            o.beginPath(),
            o.moveTo(t, a),
            o.lineTo(t, r + n),
            o.stroke(),
            glDisc(o, glFace(b), t, r, n, 3, e),
            (o.font = `900 ${Math.round(12 * e)}px Nunito, sans-serif`),
            (o.textAlign = "center"),
            (o.textBaseline = "bottom"),
            (o.lineWidth = 4 * e),
            (o.strokeStyle = "rgba(0,0,0,.8)"),
            o.strokeText(b.name, t, r - n - 4 * e),
            (o.fillStyle = "#fff"),
            o.fillText(b.name, t, r - n - 4 * e);
        }
      }
      glCv.addEventListener("pointerdown", (e) => {
        glCv.setPointerCapture(e.pointerId),
          glCv.classList.add("drag"),
          (G.drag = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY }),
          (G.vel = [0, 0]),
          (G.target = null),
          (G.idle = 0);
      }),
        glCv.addEventListener("pointermove", (e) => {
          if (!G.drag) return;
          const t = 120 / glCv.clientWidth,
            a = (e.clientX - G.drag.x) * t,
            o = (e.clientY - G.drag.y) * t;
          (G.rot[0] += a),
            (G.rot[1] = Math.max(-80, Math.min(80, G.rot[1] - o))),
            (G.vel = [a, -o]),
            (G.drag.x = e.clientX),
            (G.drag.y = e.clientY);
        }),
        glCv.addEventListener("pointerup", (e) => {
          const t = G.drag;
          if (((G.drag = null), glCv.classList.remove("drag"), !t)) return;
          if (Math.hypot(e.clientX - t.x0, e.clientY - t.y0) > 6) return;
          G.vel = [0, 0];
          const a = glCv.getBoundingClientRect(),
            o = glCv.width / a.width,
            n = [(e.clientX - a.left) * o, (e.clientY - a.top) * o],
            s = [...G.hits]
              .reverse()
              .find((e) => n[0] >= e.x && n[0] <= e.x + e.w && n[1] >= e.y && n[1] <= e.y + e.h),
            r = glProj(glCv.width).invert(n),
            i = !s && r && glFeat.find((e) => d3.geoContains(e, r)),
            l = i && i.code;
          play("choice"),
            glSelect(
              s
                ? s.P
                : l
                  ? G.places.find((e) => e.key === l) || {
                      key: l,
                      name: ftCountryName(l),
                      short: ftCountryName(l),
                      pt: glPointOf(l),
                      people: [],
                    }
                  : null,
            );
        }),
        glEl.querySelectorAll("[data-gm]").forEach(
          (e) =>
            (e.onclick = () => {
              play("choice"), glSetMode(e.dataset.gm);
            }),
        ),
        (document.getElementById("glX").onclick = () => {
          play("choice"), glEl.classList.remove("open"), cancelAnimationFrame(G.raf);
        }),
        (document.getElementById("ftGlobeBtn").onclick = () => {
          play("choice"), openGlobe("anc");
        }),
        blScroll(glInfo, "light"),
        (SND.simon1 = new Audio("sounds/a16_sndSimonButton1.wav")),
        (SND.simon2 = new Audio("sounds/a16_sndSimonButton2.wav")),
        (SND.simon3 = new Audio("sounds/a16_sndSimonButton3.wav")),
        (SND.simon4 = new Audio("sounds/a16_sndSimonButton4.wav")),
        (SND.pageFlip = new Audio("sounds/a16_sndBookPageFlip.wav")),
        (SND.footstep = new Audio("sounds/a16_sndFootstep1.wav")),
        (SND.guitar = new Audio("sounds/a16_sndGuitarChorus.wav")),
        Object.assign(ILLS, {
          "Athlete's Foot": 80,
          Ringworm: 110,
          "Staph Infection": 420,
          "E. coli Infection": 380,
        });
      const MB = () =>
          (state.mb ||= {
            gym: null,
            lib: { last: -9, streak: 0, year: -1 },
            did: {},
            instr: {},
            martial: {},
            model: 0,
          }),
        mbFirst = (e) => {
          const t = MB().did;
          return t[e] !== state.age && ((t[e] = state.age), !0);
        },
        mbBar = (e, t, a) =>
          `<b>${e}</b><i><u style="width:${Math.max(t, 2)}%;background:${a || barCol(t)}"></u></i>`;
      function mbRes(e, t, { rows: a = [], bars: o = [], log: n, after: s } = {}) {
        // [mod] come back to where you were: when an activity opened from Mind & Body ends (and has no follow-up of its
        // own), keep the Mind & Body list open and reopen the same activity card on OK (Activities > Mind & Body > Martial Arts).
        const mbKey = window.__mbKey,
          stay =
            !s &&
            mbKey &&
            "function" == typeof MB_DO[mbKey] &&
            screen.classList.contains("open") &&
            "MIND & BODY" === sTitle.textContent;
        stay || snapClose(), renderStats(), n && say(n);
        notice(
          e,
          t,
          stay
            ? () => {
                state.dead || ("MIND & BODY" === sTitle.textContent && screen.classList.contains("open") && MB_DO[mbKey]());
              }
            : s,
          !0,
          (a.length
            ? `<table class="nt"><tbody>${a.map(([e, t]) => `<tr><td><b>${e}:</b> ${t}</td></tr>`).join("")}</tbody></table>`
            : "") + (o.length ? `<div class="ev-bars nb">${o.map((e) => mbBar(...e)).join("")}</div>` : ""),
        );
      }
      function mbCard({ icon: e, title: t, lead: a, rows: o = [], sels: n = [], btn: s, onGo: r }) {
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div><div class="jm-tag" style="margin-top:12px">Mind &amp; Body</div>\n      <h4><img src="${e}" alt=""><span>${t}</span></h4><div class="lead">${a}</div>\n      ${o.length ? `<table><tbody>${o.map(([e, t]) => `<tr><td style="text-align:center;padding-left:0"><b>${e}:</b> ${t}</td></tr>`).join("")}</tbody></table>` : ""}\n      ${n.map(([e, t, a = 0], o) => `<label class="hr-lab">${e}</label><div class="hr-sel"><select id="mbS${o}">${t.map((e, t) => `<option value="${t}"${t === a ? " selected" : ""}>${e}</option>`).join("")}</select></div>`).join("")}\n      <button class="jm-apply ev-btn" id="mbGo">${s}</button>`),
          (ev.style.overflow = "visible");
        const i = () => {
          cDropClose(), evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = i),
          (document.getElementById("mbGo").onclick = () => {
            const e = n.map((e, t) => +document.getElementById(`mbS${t}`).value);
            i(), r(e);
          }),
          evWrap.classList.add("open");
      }
      const mbPay = (e, t) => {
          if (state.money < e)
            return snapClose(), notice("Not enough", `You need ${usd(e)} for that.`, null, !0);
          (state.money -= e), renderStats(), t();
        },
        MB_LIST = [
          ["book", "Book", "Find a good book", 6],
          ["diet", "Diet", "Go on a diet", 18],
          ["garden", "Garden", "Plant something", 12],
          ["gym", "Gym", "Go to the gym", 12],
          ["instrument", "Instruments", "Practice an instrument", 6],
          ["library", "Library", "Visit the public library", 12],
          ["martial", "Martial Arts", "Practice a martial art", 8],
          ["meditate", "Meditation", "Clear your mind", 12],
          ["memory", "Memory Test", "Test your memory", 6],
          ["model", "Modeling Lessons", "Take modeling lessons", 13],
          ["space", "Space Camp", "Go to space camp", 8, 17],
          ["walk", "Walk", "Go for a walk", 8],
        ];
      function openMindBodyAct() {
        (sTitle.textContent = "MIND & BODY"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        (sList.innerHTML = MB_LIST.map(([e, t, a, o, n = 999]) => {
          const s = state.age < o || state.age > n;
          return `<div class="row${s ? " dis" : ""}" data-mb="${e}"><img src="${((e) => ("gym" === e ? `mind/gym-${"f" === PG() ? "f" : "m"}.png` : "diet" === e ? "mind/salad.png" : `mind/${e}.png`))(e)}"><div class="t"><b>${t}</b><span>${a}</span></div>${s ? "" : DOTS}</div>`;
        }).join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-mb]").forEach(
            (e) =>
              (e.onclick = () => {
                e.classList.contains("dis") || ((window.__mbKey = e.dataset.mb), MB_DO[e.dataset.mb]());
              }),
          );
      }
      const GYM_ILLS = [
        ["Athlete's Foot", "mind/foot.png", "athlete's foot", 2],
        ["Ringworm", "mind/microbe.png", "ringworm", 2],
        ["Staph Infection", "mind/petri.png", "a staph infection", 0],
        ["Common Cold", "mind/mask.png", "the common cold", 1],
        ["E. coli Infection", "mind/vomit.png", "an E. coli infection", 1],
      ];
      function gymGerms(e) {
        if (!chance(0.08)) return null;
        const t = GYM_ILLS.filter((e) => !hasIll(e[0]));
        if (!t.length) return null;
        const [a, o, n, s] = any(t);
        return (
          ills().push({
            name: a,
            drain: "Staph Infection" === a ? rint(2, 4) : rint(1, 2),
            known: !0,
            heal: s ? state.age + s : null,
          }),
          (state.stats.Health = clamp(state.stats.Health - rint(1, 4))),
          renderStats(),
          say(`I caught ${n} at the gym.`),
          () => illnessCard(o, a, `You are suffering from ${n}. You must have picked it up at ${e}.`)
        );
      }
      const DIETS = {
          Mediterranean: { h: [2, 4], hap: [1, 2], long: 0.75 },
          "Weight Watchers": { h: [1, 3], hap: [1, 2] },
          "Jenny Craig": { h: [1, 3], hap: [1, 2] },
          Nutrisystem: { h: [1, 3], keep: 1 },
          "South Beach": { h: [1, 3], lk: [0, 1] },
          Keto: { h: [1, 3], hap: [-1, 0] },
          Paleo: { h: [1, 3], hap: [-2, -1], lk: [0, 1] },
          Vegetarian: { h: [1, 3], mal: 0.1 },
          Vegan: { h: [1, 3], hap: [-2, 0], mal: 0.12 },
          "Hot Cheetos": { h: [-12, -7], bad: "eating nothing but Hot Cheetos" },
          Tapeworm: { h: [-10, -6], lk: [-6, -3], bad: "the tapeworm diet" },
          Liquid: {
            h: [-5, -2],
            hap: [-2, -1],
            lk: [-2, -1],
            mal: 0.15,
            bad: "malnutrition from the liquid diet",
          },
          "High Calorie": { h: [-5, -2], hap: [1, 3], lk: [-2, -1], bad: "complications from obesity" },
          Atkins: { h: [-2, 0] },
          Whole30: { h: [1, 3], hap: [-1, 0] },
          "Graham Diet": { h: [1, 3], hap: [-2, -1], y: 1830 },
          "Water Cure": { h: [0, 2], hap: [-1, 1], y: 1843 },
          "Vinegar Diet": {
            h: [-4, -2],
            lk: [0, 2],
            mal: 0.15,
            bad: "starving on the vinegar diet",
            y: 1820,
          },
          "Banting Diet": { h: [1, 3], lk: [0, 1], y: 1863 },
          "Battle Creek Diet": { h: [1, 3], hap: [-1, 0], y: 1876 },
          "Salisbury Diet": { h: [0, 2], hap: [-2, -1], y: 1888 },
          Fletcherism: { h: [0, 2], hap: [-1, 0], y: 1895 },
          "Beef Tea Diet": { h: [0, 1], keep: 1, y: 1800 },
          "Arsenic Wafers": {
            h: [-7, -3],
            lk: [1, 3],
            bad: "arsenic poisoning from slimming wafers",
            y: 1850,
          },
          "Plain Living": { h: [1, 2], hap: [-1, 1], y: 1800 },
          "Sanitarium Rest Cure": { h: [2, 4], hap: [0, 2], long: 0.5, y: 1866 },
        },
        OLD_DIETS = new Set([
          "Graham Diet",
          "Water Cure",
          "Vinegar Diet",
          "Banting Diet",
          "Battle Creek Diet",
          "Salisbury Diet",
          "Fletcherism",
          "Beef Tea Diet",
          "Arsenic Wafers",
          "Plain Living",
          "Sanitarium Rest Cure",
          "Vegetarian",
          "Tapeworm",
        ]),
        dietNames = () =>
          Object.keys(DIETS).filter((e) =>
            isOldEra()
              ? OLD_DIETS.has(e) &&
                ("Tapeworm" === e ? 1895 : "Vegetarian" === e ? 1847 : DIETS[e].y) <= yearNow()
              : !OLD_DIETS.has(e) || "Vegetarian" === e || "Tapeworm" === e,
          ),
        DIET_USD = {
          Mediterranean: 250,
          "Weight Watchers": 350,
          "Jenny Craig": 400,
          Nutrisystem: 500,
          "South Beach": 325,
          Keto: 320,
          Paleo: 350,
          Vegetarian: 225,
          Vegan: 275,
          Atkins: 275,
          Whole30: 330,
          "High Calorie": 400,
          "Hot Cheetos": 200,
          Liquid: 175,
          Tapeworm: 150,
          "Graham Diet": 180,
          "Water Cure": 300,
          "Vinegar Diet": 60,
          "Banting Diet": 260,
          "Battle Creek Diet": 340,
          "Salisbury Diet": 320,
          Fletcherism: 90,
          "Beef Tea Diet": 150,
          "Arsenic Wafers": 120,
          "Plain Living": 80,
          "Sanitarium Rest Cure": 900,
        },
        dietPrice = (e) => localPrice(DIET_USD[e]);
      function dietYear() {
        "string" == typeof state.diet && (state.diet = null);
        const e = state.diet;
        if (!e || state.dead || state.age === e.since) return;
        const t = DIETS[e.name];
        if (!t) return void (state.diet = null);
        if (state.prison) return;
        const a = e.cost * (!1 === e.firstYear ? 12 : 11);
        if (state.money < a)
          return (state.diet = null), say(`I couldn't afford the ${e.name} diet anymore and quit.`);
        (state.money -= a), (e.firstYear = !1);
        const o = state.stats,
          n = (e) => (e ? rint(e[0], e[1]) : 0);
        let s = n(t.h);
        t.mal && chance(t.mal) && (s -= rint(2, 5)),
          t.keep && o.Health < 60 && (s += 1),
          (o.Health = clamp(o.Health + s)),
          (o.Happiness = clamp(o.Happiness + n(t.hap))),
          (o.Looks = clamp(o.Looks + n(t.lk))),
          renderStats();
      }
      ageBtnEl.addEventListener("click", () => setTimeout(dietYear, 0));
      const KM = () => "us" !== state.country,
        MB_DO = {
          book: () => {
            const e = [
              "Mystery",
              "Romance",
              "Science Fiction",
              "Fantasy",
              "Biography",
              "Self-Help",
              "History",
              "Horror",
              "Poetry",
              "Thriller",
            ];
            mbCard({
              icon: "mind/book.png",
              title: "Book",
              lead: "Find a good book to read today!",
              sels: [["Pick a genre:", e]],
              btn: "Read a book",
              onGo: ([t]) => {
                play("pageFlip");
                const a = mbFirst("book"),
                  o = ftBook ? ftBook() : "a good book",
                  n = rint(10, 100);
                a && fx({ Smarts: +rint(1, 3), Happiness: +rint(1, 4) }, ""),
                  mbRes(
                    any(["Page turner", "Bookworm", "Couldn't put it down", "Story time"]),
                    `You read a ${e[t].toLowerCase()} book called <i>${o}</i>.`,
                    { bars: [["Enjoyment", n]], log: `I read a ${e[t].toLowerCase()} book called ${o}.` },
                  );
              },
            });
          },
          diet: () => {
            state.diet && !state.diet.cost && (state.diet = null);
            const e = MB(),
              t = (
                e.dietPrices &&
                e.dietPrices.age === state.age &&
                e.dietPrices.country === state.country &&
                3 === e.dietPrices.v
                  ? e.dietPrices
                  : (e.dietPrices = {
                      v: 3,
                      age: state.age,
                      country: state.country,
                      list: dietNames()
                        .sort(() => Math.random() - 0.5)
                        .slice(0, rint(7, 9))
                        .map((e) => [e, dietPrice(e)]),
                    })
              ).list.filter(([e]) => !state.diet || e !== state.diet.name),
              a = t.map(([e, t]) => `${e} (${usd(t)}/mo)`).concat(state.diet ? ["Stop dieting"] : []);
            mbCard({
              icon: "mind/salad.png",
              title: "Diet",
              lead: "Start a diet today!",
              rows: state.diet ? [["Current Diet", `${state.diet.name} (${usd(state.diet.cost)}/mo)`]] : [],
              sels: [["Pick your diet:", a]],
              btn: "Start this diet",
              onGo: ([e]) => {
                if (e >= t.length) {
                  const e = state.diet.name;
                  return (
                    (state.diet = null),
                    mbRes("Back to normal", `You stopped the ${e} diet.`, { log: `I stopped the ${e} diet.` })
                  );
                }
                const [a, o] = t[e];
                mbPay(o, () => {
                  (state.diet = { name: a, cost: o, since: state.age }),
                    mbRes(any(["New me", "Eating right", "Fresh start"]), `You started the ${a} diet.`, {
                      log: `I started the ${a} diet.`,
                    });
                });
              },
            });
          },
          garden: () => {
            const e = (state.props || [])[0],
              t = any([
                "kale",
                "tomatoes",
                "carrots",
                "tulips",
                "roses",
                "sunflowers",
                "potatoes",
                "strawberries",
                "basil",
                "lettuce",
                "peppers",
                "zucchini",
              ]),
              a = e
                ? `the garden of your ${e.name.toLowerCase()} at ${e.addr}`
                : state.age < 18
                  ? "your parents' garden"
                  : "a community garden";
            mbFirst("garden") && fx({ Happiness: +rint(2, 5), Health: +rint(0, 2) }, ""),
              mbRes(
                any(["Planting for tomorrow", "Green thumb", "Getting my hands dirty"]),
                `You planted some ${t} in ${a}.`,
                { bars: [["Relaxation", rint(5, 100)]], log: `I planted some ${t} in ${a}.` },
              );
          },
          gym: () => {
            const e = MB();
            e.gym ||= `${any(["Silicon", "Iron", "Titan", "Summit", "Golden", "Pulse", "Apex", "Core", "Elite", "Liberty", "Anytime", "Peak"])} Fitness Center`;
            const t = state.age < 18 ? 0 : 15;
            mbCard({
              icon: `mind/gym-${"f" === PG() ? "f" : "m"}.png`,
              title: "Gym",
              lead: "Go to your local gym and workout today!",
              rows: [
                ["Gym", e.gym],
                ["Cost", t ? usd(t) : "Free"],
              ],
              btn: "Go to the gym",
              onGo: () =>
                (t ? (e) => mbPay(t, e) : (e) => e())(() => {
                  const t = rint(5, 100);
                  mbFirst("gym") &&
                    fx({ Health: +rint(2, 5), Looks: +rint(0, 2), Happiness: t > 60 ? +rint(1, 3) : 0 }, "");
                  const a = gymGerms(e.gym);
                  mbRes(
                    any(["Pure gains", "Feel the burn", "Beast mode", "No pain, no gain"]),
                    `You worked out at ${e.gym}.`,
                    { bars: [["Enjoyment", t]], log: `I worked out at ${e.gym}.`, after: a },
                  );
                }),
            });
          },
          instrument: () => {
            const e = [
                "Guitar",
                "Piano",
                "Violin",
                "Drums",
                "Bass",
                "Flute",
                "Saxophone",
                "Cello",
                "Trumpet",
                "Harp",
                "Clarinet",
                "Ukulele",
              ],
              t = MB();
            mbCard({
              icon: "mind/instrument.png",
              title: "Instruments",
              lead: "Practice an instrument today!",
              sels: [["Pick your instrument:", e, t.lastInstr || 0]],
              btn: "Practice",
              onGo: ([a]) => {
                const o = e[a];
                (t.lastInstr = a), /Guitar|Bass|Ukulele/.test(o) && play("guitar");
                const n = (t.instr[o] = Math.min(
                  100,
                  (t.instr[o] || 0) +
                    (mbFirst("instr" + o) ? rint(4, 9) : rint(0, 2)) * ("music" === state.talent ? 2 : 1),
                ));
                fx({ Happiness: +rint(0, 3), Smarts: chance(0.4) ? 1 : 0 }, ""),
                  mbRes(
                    any(["Practice makes perfect", "Making music", "Hitting the right notes"]),
                    `You practiced the ${o.toLowerCase()}.`,
                    { bars: [["Skill", n]], log: `I practiced the ${o.toLowerCase()}.` },
                  );
              },
            });
          },
          library: () => {
            const e = MB().lib,
              t = `${state.city || city} Public Library`;
            let a = 0;
            e.year !== state.age &&
              ((e.streak = e.last === state.age - 1 ? e.streak + 1 : 1),
              (e.last = e.year = state.age),
              (a = 1 === e.streak ? 1 : Math.min(7, rint(1, 2) + e.streak)),
              fx({ Smarts: +a, Happiness: +rint(0, 2) }, ""));
            const o = any([
              `enjoying the scent of old books at ${t}`,
              `browsing the shelves at ${t}`,
              `reading in a quiet corner of ${t}`,
              `studying at ${t}`,
            ]);
            let n = null;
            if (state.age >= 14 && chance(0.14)) {
              const e = makeLover({
                  g: crushGender() || (chance(0.5) ? "m" : "f"),
                  ages: [Math.max(14, state.age - 5), state.age + 6],
                }),
                t = loverAge(e) < 18 ? ("f" === e.g ? "girl" : "boy") : "f" === e.g ? "woman" : "man";
              n = () =>
                loveInterest(
                  e,
                  `A ${t} you met while ${o.replace(/^enjoying the scent of old books/, "looking for a book")} has asked you on a date.`,
                );
            }
            mbRes(
              any(["Walking encyclopedia", "Bookworm", "Knowledge is power", "Shhh!"]),
              `You spent some time ${o}.`,
              {
                bars: [["Enjoyment", rint(5, 100)]],
                log: `I visited ${t}.${e.streak > 1 && a ? ` That's ${e.streak} years in a row.` : ""}`,
                after: n,
              },
            );
          },
          martial: () => {
            const e = [
                "Karate",
                "Judo",
                "Taekwondo",
                "Kung Fu",
                "Jiu-Jitsu",
                "Krav Maga",
                "Muay Thai",
                "Aikido",
                "Kickboxing",
              ],
              t = MB();
            mbCard({
              icon: "mind/martial.png",
              title: "Martial Arts",
              lead: "Practice a martial art today!",
              sels: [["Pick a martial art:", e, t.lastMartial || 0]],
              btn: "Practice",
              onGo: ([a]) => {
                const o = e[a];
                if (((t.lastMartial = a), chance(0.05)))
                  return (
                    fx({ Health: -rint(4, 10) }, ""),
                    mbRes("Ouch!", `You got hurt practicing ${o.toLowerCase()}.`, {
                      bars: [["Damage", rint(20, 80), "#b3261e"]],
                      log: `I got hurt practicing ${o}.`,
                    })
                  );
                const n = (t.martial[o] = Math.min(
                  100,
                  (t.martial[o] || 0) + (mbFirst("mart" + o) ? rint(4, 9) : rint(0, 2)),
                ));
                fx({ Health: +rint(0, 3), Happiness: +rint(0, 2) }, ""),
                  mbRes(
                    any(["Hi-yah!", "Discipline", "Wax on, wax off"]),
                    `You practiced ${o.toLowerCase()}.`,
                    { bars: [["Skill", n]], log: `I practiced ${o}.` },
                  );
              },
            });
          },
          meditate: () => {
            const e = any([5, 10, 15, 20, 30, 45, 60]);
            mbFirst("meditate") && fx({ Happiness: +rint(2, 6), Health: +rint(0, 2) }, ""),
              mbRes(any(["Inner peace", "Zen", "Om"]), `You meditated for ${e} minutes.`, {
                bars: [["Relaxation", rint(10, 100)]],
                log: `I meditated for ${e} minutes.`,
              });
          },
          memory: () => memoryTest(),
          model: () => {
            mbCard({
              icon: "mind/model.png",
              title: "Modeling Lessons",
              lead: "Take modeling lessons today!",
              rows: [["Cost", usd(250)]],
              btn: "Take lessons",
              onGo: () =>
                mbPay(250, () => {
                  const e = MB();
                  (e.model = Math.min(100, e.model + (mbFirst("model") ? rint(5, 10) : rint(0, 3)))),
                    fx({ Looks: +rint(0, 2), Happiness: +rint(0, 2) }, ""),
                    mbRes(any(["Strike a pose", "Work it", "Catwalk"]), "You took modeling lessons.", {
                      bars: [["Skill", e.model]],
                      log: "I took modeling lessons.",
                    });
                }),
            });
          },
          space: () => {
            mbCard({
              icon: "mind/space.png",
              title: "Space Camp",
              lead: "Go to space camp today!",
              rows: [["Cost", usd(1500)]],
              btn: "Go to space camp",
              onGo: () =>
                mbPay(1500, () => {
                  mbFirst("space") && fx({ Smarts: +rint(2, 5), Happiness: +rint(3, 6) }, ""),
                    mbRes(
                      any(["To infinity", "Houston, we have a problem", "Ground control"]),
                      `You spent a week at space camp and ${any(["rode the multi-axis trainer", "built a model rocket", "tried on a real space suit", "ate astronaut ice cream", "launched a rocket"])}.`,
                      { bars: [["Enjoyment", rint(30, 100)]], log: "I went to space camp." },
                    );
                }),
            });
          },
          walk: () => {
            const e = [
                ["Stroll", 3.2, "stroll"],
                ["Normal", 4.8, "walk"],
                ["Brisk", 6, "brisk walk"],
                ["Speed walk", 7.4, "speed walk"],
              ],
              t = [
                ["5 minutes", 5],
                ["15 minutes", 15],
                ["30 minutes", 30],
                ["45 minutes", 45],
                ["1 hour", 60],
                ["2 hours", 120],
              ];
            mbCard({
              icon: "mind/walk.png",
              title: "Walk",
              lead: "Go for a walk today!",
              sels: [
                ["Pick your pace:", e.map((e) => e[0]), 1],
                ["Pick your time:", t.map((e) => e[0]), 1],
              ],
              btn: "Do it",
              onGo: ([a, o]) => {
                play("footstep");
                const [, n, s] = e[a],
                  r = t[o][1],
                  i = ((n * r) / 60) * (0.85 + 0.3 * Math.random()),
                  l = rint(5, 100);
                mbFirst("walk") &&
                  fx({ Health: +Math.max(1, Math.round(r / 30 + a)), Happiness: +rint(0, 3) }, "");
                const c = KM() ? `${i.toFixed(2)} kilometers` : `${(i / 1.609).toFixed(2)} miles`,
                  d = l > 80 ? "magnificent" : l > 55 ? "lovely" : l > 30 ? "pleasant" : "boring";
                mbRes(
                  any(
                    a >= 2
                      ? ["Blood pumping", "Working up a sweat"]
                      : ["Fresh air", "Stretching my legs", "Nice and easy"],
                  ),
                  `You went for ${"boring" === d ? "a boring" : `a ${d}`} ${s} along ${any(["a scenic vista", "the river", "a quiet trail", "the beach", "the old town", "a park path", "the harbor"])}.`,
                  { rows: [["Distance", c]], bars: [["Enjoyment", l]], log: `I went for a ${s} (${c}).` },
                );
              },
            });
          },
        };
      function memoryTest() {
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="jm-tag" style="margin-top:12px">Mind &amp; Body</div>\n      <h4><img src="mind/memory.png" alt=""><span>Memory Test</span></h4><div class="lead">Start the test and then repeat back each sequence of lights and colors!</div>\n      <div class="simon" id="smB"><img src="mind/simonBoard.png" alt="">${[1, 2, 3, 4].map((e) => `<img class="lit" data-q="${e}" src="mind/simonLit${e}.png" alt="">`).join("")}<img class="sc" id="smC" alt=""></div>\n      <div class="simon-msg" id="smM"></div><button class="jm-apply ev-btn hr-green" id="smGo">Start</button>\n      <div class="simon-n" id="smN">Sequences: 0</div><span class="simon-quit" id="smQ">Never mind</span></div>`);
        const e = document.getElementById("smB"),
          t = document.getElementById("smC"),
          a = document.getElementById("smM"),
          o = document.getElementById("smGo"),
          n = document.getElementById("smQ"),
          s = [];
        let r = 0,
          i = 0,
          l = !0,
          c = !1,
          d = [];
        const u = (e, t) => d.push(setTimeout(() => l && e(), t)),
          h = (e) => {
            (t.style.display = e ? "" : "none"),
              e && ((t.src = `mind/simon${e}.png`), (t.className = `sc ${e.toLowerCase()}`));
          },
          p = (t, a) => {
            const o = e.querySelector(`[data-q="${t}"]`);
            play("simon" + t), o.classList.add("on"), u(() => o.classList.remove("on"), a);
          };
        h(null);
        const m = () => {
            (c = !1),
              (i = 0),
              h("Eye"),
              (a.textContent = "Watch the pattern!"),
              (a.className = "simon-msg"),
              s.push(rint(1, 4));
            const e = Math.max(260, 520 - 20 * s.length),
              t = Math.max(120, 220 - 8 * s.length);
            s.forEach((a, o) => u(() => p(a, e), 650 + o * (e + t))),
              u(
                () => {
                  (c = !0), h("Hand"), (a.textContent = "Your turn!"), (a.className = "simon-msg go");
                },
                650 + s.length * (e + t),
              );
          },
          f = () => {
            (l = !1), d.forEach(clearTimeout), evWrap.classList.remove("open");
            mbFirst("memory") && r && fx({ Smarts: +Math.min(6, Math.ceil(r / 2)) }, "");
            mbRes(
              0 === r
                ? "Maybe I should read a book..."
                : r < 4
                  ? "Not bad"
                  : r < 8
                    ? "Sharp as a tack"
                    : r < 12
                      ? "Impressive!"
                      : "Photographic memory",
              `You scored ${r} on your memory test.`,
              { log: `I scored ${r} on a memory test.` },
            );
          };
        e.addEventListener("pointerdown", (t) => {
          if (!c || !l) return;
          const o = e.getBoundingClientRect(),
            n = (t.clientX - o.left) / o.width,
            d = (t.clientY - o.top) / o.height;
          if (Math.hypot(n - 0.5, d - 0.5) < 0.15 || n < 0.04 || n > 0.96 || d < 0.04 || d > 0.96) return;
          const g = d < 0.5 ? (n < 0.5 ? 1 : 2) : n < 0.5 ? 4 : 3;
          if ((p(g, 220), g !== s[i]))
            return (c = !1), h("Face"), (a.textContent = ""), play("buzzer"), u(f, 1300);
          ++i === s.length &&
            ((c = !1),
            r++,
            (document.getElementById("smN").textContent = `Sequences: ${r}`),
            (a.textContent = ""),
            u(() => play("ding"), 260),
            u(m, 900));
        }),
          (o.onclick = () => {
            (o.style.display = "none"), (n.textContent = "Give up"), m();
          }),
          (n.onclick = () => {
            if (!s.length)
              return (l = !1), d.forEach(clearTimeout), play("dismiss"), evWrap.classList.remove("open");
            f();
          }),
          evWrap.classList.add("open");
      }
      let cDrop = null;
      const cDropClose = () => {
        cDrop && (cDrop.remove(), (cDrop = null));
      };
      function cDropOpen(e) {
        cDropClose();
        const t = document.querySelector(".phone"),
          a = t.getBoundingClientRect(),
          o = e.getBoundingClientRect(),
          n = a.bottom - o.bottom - 12,
          s = Math.max(87, Math.min(29 * e.options.length + 2, 29 * 5.6, n)),
          r = document.createElement("div");
        (r.className = "cdrop"),
          Object.assign(r.style, {
            left: o.left - a.left + "px",
            top: o.bottom - a.top + "px",
            width: `${o.width}px`,
            height: `${s}px`,
          }),
          (r.innerHTML = `<div class="cdrop-list" style="height:${s}px">${[...e.options].map((t, a) => `<div data-i="${a}" class="${a === e.selectedIndex ? "on" : ""}">${t.textContent}</div>`).join("")}</div>`),
          t.append(r),
          (cDrop = r);
        const i = r.firstElementChild,
          l = i.querySelector(".on");
        l && (i.scrollTop = Math.max(0, l.offsetTop - (s - l.offsetHeight) / 2)),
          i.addEventListener("click", (t) => {
            const a = t.target.closest("[data-i]");
            a &&
              ((e.selectedIndex = +a.dataset.i),
              play("choice"),
              e.dispatchEvent(new Event("input", { bubbles: !0 })),
              e.dispatchEvent(new Event("change", { bubbles: !0 })),
              cDropClose());
          });
      }
      const cDropSel = (e) =>
        e.target.closest && e.target.closest(".phone .jm select, .phone .ev select, .phone .jcw select");
      ["pointerdown", "mousedown"].forEach((e) =>
        document.addEventListener(
          e,
          (t) => {
            const a = cDropSel(t);
            if (a) {
              if ((t.preventDefault(), "pointerdown" === e)) {
                if (cDrop && cDrop._sel === a) return cDropClose();
                cDropOpen(a), (cDrop._sel = a);
              }
            } else cDrop && !t.target.closest(".cdrop") && cDropClose();
          },
          !0,
        ),
      ),
        document.addEventListener(
          "keydown",
          (e) => {
            const t = cDropSel(e);
            "Escape" === e.key
              ? cDropClose()
              : t &&
                (" " === e.key || "Enter" === e.key || ("ArrowDown" === e.key && e.altKey)) &&
                (e.preventDefault(), cDropOpen(t), (cDrop._sel = t));
          },
          !0,
        ),
        window.addEventListener("resize", cDropClose),
        renderAvatar(),
        renderStats(),
        (log.scrollTop = log.scrollHeight),
        updateDockTab(),
        snapLife();
