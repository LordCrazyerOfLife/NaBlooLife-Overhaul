      function hurt() {
        "f" === PG() ? crimeSnd("DamageFemale") : play("damage");
        const e = document.querySelector(".phone");
        e.classList.remove("hurt"),
          e.offsetWidth,
          e.classList.add("hurt"),
          setTimeout(() => e.classList.remove("hurt"), 1e3);
      }
      let pendingHit = null;
      function suitAssault(e) {
        const t = e.match(
          /^(?:My ([a-z -]+), )?([A-Z][\w'-]+(?: [A-Z][\w'-]+)?),? (?:[^.!?]*? )?(?:beat me up|attacked me|punched me)/,
        );
        t &&
          !/^(I|He|She|They|It|The|A|An)$/.test(t[2]) &&
          addSuit({
            name: t[2],
            who: t[1] ? capFirst(t[1]) : "Assailant",
            reason: "assault",
            strength: /\b(caught me|after I|when I)\b/.test(e) ? 0.25 : 0.45,
            scale: localPrice(1e3 * rint(10, 60)),
          });
      }
      const hitTitle = (e) =>
          /\bbit\b|bites/i.test(e)
            ? "Chomp"
            : /burn|fryer|fire/i.test(e)
              ? "Hot hot hot"
              : /crash|forklift|rear-ended/i.test(e)
                ? "Crash"
                : /push|shove|slam|trampl/i.test(e)
                  ? any(["Shoved", "Watch it!", "Ouch!"])
                  : any(["Ouch!", "That hurt", "Owie"]),
        dmgBar = (e) =>
          `<div class="ev-bars nb"><b>Damage</b><i><u style="width:${e}%;background:#b3261e"></u></i></div>`;
      function showHit(e, t) {
        state.dead || notice(hitTitle(e.text), e.text, t || null, !1, dmgBar(e.dmg));
      }
      const runFx = (e, t) => {
        if (
          (e && e.cut && newHaircut(),
          e && e.dye && dyeHair(e.dye),
          e &&
            e.hit &&
            /^I (attacked|fought|punched|slapped|kicked)\b/i.test(t || "") &&
            !/\bme\b/.test(t || ""))
        )
          hurt();
        else if (e && e.hit) {
          hurt(), suitAssault(t || "");
          const a = (pendingHit = {
            text: toYou(t || ""),
            dmg: Math.max(15, Math.min(95, 7 * Math.abs(e.he || 5) + rint(0, 15))),
          });
          setTimeout(() => {
            pendingHit === a && ((pendingHit = null), showHit(a));
          }, 0);
        }
        return fx(toFx(e), t);
      };
      function newHaircut() {
        const e = state.look.hairCut;
        do {
          state.look.hairCut = rint(0, 999);
        } while (state.look.hairCut === e);
        delete state.look.xHair, (state.mod.xHair = null), renderAvatar();
      }
      const DYES = {
        blue: "#2f6fe0",
        pink: "#ff5fae",
        green: "#33c45a",
        purple: "#8c4fd6",
        red: "#e3262b",
        platinum: "#ece4cf",
        orange: "#ff8a1f",
        teal: "#1fc2c2",
      };
      function dyeHair(e) {
        "random" === e && (e = pickR(Object.keys(DYES))),
          null == state.dyeAge && (state.dyeRevert = state.mod.color),
          (state.mod.color = DYES[e] || e),
          (state.dyeAge = state.age),
          renderAvatar();
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        null == state.dyeAge ||
          state.age <= state.dyeAge ||
          ((state.mod.color = state.dyeRevert),
          (state.dyeAge = null),
          (state.dyeRevert = null),
          say("My hair dye washed out."),
          renderAvatar());
      });
      const frLive = (e = 0) => state.friends.filter((t) => (t.rel ?? 50) >= e && !t.away),
        frCard = (e) => ({
          who: `${e.first} ${e.last}`,
          av: "m" === e.g ? "1f466" : "1f467",
          person: { look: e.look, g: e.g, age: friendAge(e) },
          table: [
            ["Name", `${e.first} ${e.last}`],
            ["Relationship", e.best ? "Best Friend" : "Friend"],
            ["Age", friendAge(e)],
          ],
          bars: [["Relationship", e.rel ?? 50]],
        }),
        frRel = (e, t) => {
          e.rel = clamp((e.rel ?? 50) + t);
        },
        frEnd = (e) => {
          const t = state.friends.indexOf(e);
          t >= 0 && state.friends.splice(t, 1);
        },
        frPr = (e) =>
          "m" === e.g
            ? { him: "him", he: "he", his: "his", He: "He" }
            : { him: "her", he: "she", his: "her", He: "She" },
        FEV = (e, t, a, o, n, s) =>
          EVENTS.push({
            min: e,
            max: t,
            kind: "Friend",
            src: "friend",
            t: o,
            ok: n,
            make: () => ({ iconSrc: `kidev/${a}.png`, title: o, ...s() }),
          });
      function unfriendCard(e) {
        if (!state.friends.includes(e)) return;
        const t = frPr(e);
        openEvent({
          kind: "Friend",
          make: () => ({
            ...frCard(e),
            table: null,
            bars: null,
            icon: "1f62c",
            title: "Unfriended",
            feedback: !0,
            desc: `Your friend, ${e.first}, has unfriended you.<br><br>What will you do?`,
            choices: [
              [
                `Insult ${t.him} one last time`,
                () => (
                  frEnd(e),
                  fx({ Happiness: -Math.round(0.5 * hit("unfriended")) }, ""),
                  `I insulted ${e.first} one last time after ${t.he} unfriended me.`
                ),
              ],
              [
                `Let ${t.him} go`,
                () => (
                  frEnd(e),
                  fx({ Happiness: -Math.round(0.8 * hit("unfriended")) }, ""),
                  `${e.first} unfriended me, and I let ${t.him} go.`
                ),
              ],
              [
                "Try to salvage our friendship",
                () =>
                  chance(0.25 + (e.rel ?? 0) / 200)
                    ? ((e.rel = rint(25, 40)), (e.lowYears = 0), `I salvaged my friendship with ${e.first}.`)
                    : (frEnd(e),
                      fx({ Happiness: -hit("unfriended") }, ""),
                      `I tried to salvage my friendship with ${e.first}, but ${t.he} wanted nothing to do with me.`),
              ],
            ],
          }),
        });
      }
      function openVacation() {
        if (state.age < 18)
          return notice("Too Young", "You must be at least 18 to go on vacation.", null, !0);
        if (state.vacationAt === state.age)
          return notice("Vacation", "You already went on vacation this year.", null, !0);
        const e = Object.keys(COUNTRIES)
            .filter((e) => e !== state.country)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((e) => ({ c: e, name: COUNTRIES[e][0], cost: localPrice(100 * rint(15, 60)) })),
          t = { cruise: !0, name: "a cruise", cost: localPrice(100 * rint(25, 80)) };
        jCard({
          tag: "Vacation",
          iconSrc: LEV + "vacation.png",
          title: "Vacation",
          lead: "Where would you like to go?",
          close: !0,
          choices: [
            ...e.map((e) => [`${e.name} (${usd(e.cost)})`, () => takeTrip(e)]),
            [`Take a cruise (${usd(t.cost)})`, () => takeTrip(t)],
          ],
        });
      }
      function takeTrip(e) {
        if (state.money < e.cost)
          return notice(
            "Not enough",
            `You need another ${usd(e.cost - state.money)} for that trip.`,
            null,
            !0,
          );
        (state.money -= e.cost),
          (state.vacationAt = state.age),
          screen.classList.remove("open"),
          (state.stats.Happiness = clamp(state.stats.Happiness + rint(6, 14))),
          (state.stats.Health = clamp(state.stats.Health + rint(0, 3))),
          renderStats(),
          say(e.cruise ? "I went on a cruise." : `I went on vacation to ${e.name}.`);
        const t = e.cruise
            ? ["contest", "scavenger", "transport", "disconnected"]
            : ["accent", "disconnected"],
          a = (state.tripSeen ||= {}),
          o = t.filter((e) => !a[e] || state.age - a[e] >= 8);
        if (!o.length || !chance(0.65))
          return notice(
            e.cruise ? "Bon voyage" : "Wish you were here",
            e.cruise ? "You had a relaxing time on your cruise." : `You had a great time in ${e.name}.`,
            null,
            !0,
          );
        const n = any(o);
        (a[n] = state.age), setTimeout(() => tripMoment(n, e), 120);
      }
      function tripMoment(e, t) {
        const a = (e, t, a, o) =>
            jCard({
              tag: "Vacation",
              iconSrc: LEV + e,
              title: t,
              lead: `${a}<br><br>What will you do?`,
              surprise: !0,
              choices: o,
            }),
          o = (e, t, a, o = {}) => {
            fx(o, ""), say(a), renderStats(), notice(e, t, null, !0);
          },
          n = t.cruise ? "the cruise ship" : t.name;
        if ("accent" === e)
          return a("accent.png", "What Accent?", `A local in ${t.name} keeps making fun of your accent.`, [
            [
              "Mock their accent back",
              () =>
                chance(0.5)
                  ? o(
                      "Touché",
                      "They laughed and bought you a drink.",
                      `I mocked a local's accent back in ${t.name}, and we became friends.`,
                      { Happiness: 3 },
                    )
                  : o(
                      "Bad move",
                      "They got really offended.",
                      `I mocked a local's accent in ${t.name}, and it didn't go well.`,
                      { Happiness: -3 },
                    ),
            ],
            [
              "Ignore it",
              () =>
                o(
                  "Moving on",
                  "You ignored them and kept enjoying your trip.",
                  `I ignored someone making fun of my accent in ${t.name}.`,
                ),
            ],
            [
              "Insult them",
              () =>
                o(
                  "Heated",
                  "It turned into a shouting match in the street.",
                  `I got into a shouting match with a local in ${t.name}.`,
                  { Happiness: -2 },
                ),
            ],
          ]);
        if ("disconnected" === e)
          return a("disconnected.png", "Disconnected", `Your room on ${n} has no TV and no cell reception.`, [
            [
              "Read a book",
              () =>
                o(
                  "Bookworm",
                  "You finally finished that book you brought.",
                  "I read a book on vacation since there was no TV.",
                  { Smarts: 2 },
                ),
            ],
            [
              "Complain to the front desk",
              () => {
                if (chance(0.4)) {
                  const e = localPrice(100 * rint(1, 5));
                  return (
                    (state.money += e),
                    o(
                      "Refund",
                      `They refunded you ${usd(e)}.`,
                      `I complained about my room on vacation and got ${usd(e)} back.`,
                    )
                  );
                }
                o(
                  "No luck",
                  "The front desk shrugged.",
                  "I complained about my room on vacation, but nothing happened.",
                  { Happiness: -1 },
                );
              },
            ],
            [
              "Go explore instead",
              () =>
                o(
                  "Adventure",
                  "You spent the day exploring and loved it.",
                  "I went exploring on vacation instead of sitting in my room.",
                  { Happiness: 4 },
                ),
            ],
          ]);
        if ("contest" === e)
          return a("contest.png", "Contest Time", "The cruise is holding contests on the deck today.", [
            [
              "Limbo",
              () =>
                chance(0.3 + state.stats.Health / 300)
                  ? o(
                      "Limbo champion",
                      "You won the limbo contest!",
                      "I won the limbo contest on my cruise.",
                      { Happiness: 6 },
                    )
                  : o("Ouch", "You fell flat on your back.", "I lost the limbo contest on my cruise.", {
                      Happiness: -1,
                    }),
            ],
            [
              "Singing",
              () =>
                chance(0.35)
                  ? o("Star", "You won the singing contest!", "I won the singing contest on my cruise.", {
                      Happiness: 6,
                    })
                  : o("Off key", "The crowd was not impressed.", "I lost the singing contest on my cruise."),
            ],
            [
              "Trivia",
              () =>
                chance(0.2 + state.stats.Smarts / 200)
                  ? o("Genius", "You won the trivia contest!", "I won the trivia contest on my cruise.", {
                      Happiness: 6,
                    })
                  : o("So close", "You came in second.", "I lost the trivia contest on my cruise."),
            ],
            [
              "None of them",
              () => o("Spectator", "You watched from a deck chair.", "I skipped the contests on my cruise."),
            ],
          ]);
        if ("scavenger" === e) {
          const e = any([
            "a rubber duck",
            "a captain's hat",
            "a seashell",
            "a souvenir keychain",
            "a flamingo float",
          ]);
          return a(
            "scavenger.png",
            "Scavenger Hunt",
            `The cruise scavenger hunt says you need to find ${e}.`,
            [
              [
                "Ask other passengers",
                () =>
                  chance(0.5)
                    ? o(
                        "Found it",
                        `Another passenger gave you ${e}. You won the scavenger hunt!`,
                        "I won the scavenger hunt on my cruise.",
                        { Happiness: 5 },
                      )
                    : o("No luck", "Nobody had one.", `I couldn't find ${e} for the cruise scavenger hunt.`),
              ],
              [
                "Buy one at the gift shop",
                () => {
                  const t = localPrice(rint(20, 80));
                  (state.money = Math.max(0, state.money - t)),
                    o(
                      "Winner",
                      `You bought ${e} for ${usd(t)} and won the scavenger hunt!`,
                      "I bought my way to winning the cruise scavenger hunt.",
                      { Happiness: 4 },
                    );
                },
              ],
              [
                "Steal one",
                () =>
                  chance(0.6)
                    ? o(
                        "Sneaky",
                        `You swiped ${e} and won the scavenger hunt.`,
                        "I stole an item to win the cruise scavenger hunt.",
                        { Happiness: 4 },
                      )
                    : o(
                        "Caught",
                        "Security caught you and disqualified you.",
                        "I got caught stealing during the cruise scavenger hunt.",
                        { Happiness: -4 },
                      ),
              ],
            ],
          );
        }
        if ("transport" === e) {
          const e = any(["Cozumel", "Nassau", "St. Thomas", "Barcelona", "Santorini", "Juneau"]);
          return a(
            "transport.png",
            "Transportation",
            `Your cruise has docked in ${e}. How will you get around?`,
            [
              [
                "Scooter",
                () =>
                  chance(0.8)
                    ? o("Zoom", `You zipped around ${e} on a scooter.`, `I rode a scooter around ${e}.`, {
                        Happiness: 4,
                      })
                    : o(
                        "Wipeout",
                        "You crashed the scooter into a fruit stand.",
                        `I crashed a scooter in ${e}.`,
                        { Health: -rint(2, 6) },
                      ),
              ],
              [
                "Bicycle",
                () =>
                  o("Scenic", `You biked along the coast of ${e}.`, `I biked around ${e}.`, {
                    Happiness: 3,
                    Health: 2,
                  }),
              ],
              [
                "Rent a car",
                () => {
                  const t = localPrice(rint(60, 150));
                  (state.money = Math.max(0, state.money - t)),
                    o(
                      "Road trip",
                      `You rented a car for ${usd(t)} and saw the whole island.`,
                      `I rented a car in ${e}.`,
                      { Happiness: 4 },
                    );
                },
              ],
              [
                "Walk",
                () =>
                  o("On foot", `You explored ${e} on foot.`, `I walked around ${e}.`, {
                    Happiness: 2,
                    Health: 1,
                  }),
              ],
            ],
          );
        }
      }
      FEV(6, 90, "f-hug", "New Friend Request", null, () => {
        const e = person(Math.max(6, state.age - 2), state.age + 2),
          t =
            state.school && state.age < 18
              ? "at school"
              : state.job && chance(0.4)
                ? "at work"
                : any(["at the gym", "at a coffee shop", "in your neighborhood", "at the park"]);
        return {
          ...personCard(e),
          desc: `${e.first}, someone you met ${t}, wants to be your friend.`,
          choices: [
            [
              `Accept ${e.him}`,
              () => (addFriend(e, rint(50, 75)), fx({ Happiness: 4 }, `I became friends with ${e.full}.`)),
            ],
            [`Reject ${e.him}`, () => `I turned down ${e.first}'s friendship.`],
          ],
        };
      }),
        FEV(
          5,
          90,
          "f-bff",
          "Best Friends",
          () => frLive(65).some((e) => !e.best),
          () => {
            const e = any(frLive(65).filter((e) => !e.best)),
              t = frPr(e);
            return {
              ...frCard(e),
              desc: `${e.first} says you're the best friend ${t.he}'s ever had and wants to be best friends.`,
              choices: [
                [
                  "Be best friends",
                  () => (
                    state.friends.forEach((e) => {
                      e.best = !1;
                    }),
                    (e.best = !0),
                    frRel(e, 10),
                    fx({ Happiness: 5 }, ""),
                    `I became best friends with ${e.first}!`
                  ),
                ],
                [
                  "Just stay friends",
                  () => (frRel(e, -8), `I told ${e.first} I'd rather just stay friends.`),
                ],
              ],
            };
          },
        ),
        FEV(
          6,
          90,
          "f-ear",
          "Friend Needs Advice",
          () => frLive().length,
          () => {
            const e = any(frLive()),
              t = frPr(e),
              a = any(
                state.age < 13
                  ? ["a bully at school", "a fight with their sibling", "a bad grade", "a crush"]
                  : state.age < 18
                    ? ["a crush", "their parents", "a failing class", "a friend who betrayed them"]
                    : ["their relationship", "their boss", "money problems", "whether to move cities"],
              );
            return {
              ...frCard(e),
              desc: `${e.first} is having trouble with ${a.replace("their", t.his)} and is asking for your advice.`,
              choices: [
                [
                  "Give good advice",
                  () => (frRel(e, 7), fx({ Smarts: 1 }, ""), `I gave ${e.first} some great advice.`),
                ],
                [
                  "Give bad advice",
                  () =>
                    chance(0.4)
                      ? (frRel(e, 2), `I gave ${e.first} terrible advice, and somehow it worked.`)
                      : (frRel(e, -8), `I gave ${e.first} bad advice and it backfired on ${t.him}.`),
                ],
                ["Refuse to help", () => (frRel(e, -5), `I refused to help ${e.first}.`)],
                ["Ignore " + t.him, () => (frRel(e, -8), `I ignored ${e.first} when ${t.he} needed advice.`)],
              ],
            };
          },
        ),
        FEV(
          10,
          70,
          "f-mic",
          "Concert",
          () => frLive(30).length,
          () => {
            const e = any(frLive(30)),
              t = prOf(e.g),
              a = any([
                "Britney Spears",
                "Taylor Swift",
                "Coldplay",
                "Bad Bunny",
                "BTS",
                "Ed Sheeran",
                "Beyoncé",
                "Drake",
                "Billie Eilish",
                "The Weeknd",
                "Imagine Dragons",
                "Metallica",
                "Lady Gaga",
              ]);
            return {
              ...frCard(e),
              table: [["Concert", a]],
              bars: null,
              iconSrc: "emoji/1f3a4.png",
              desc: `Your friend, ${e.first}, has tickets to a ${a} concert and invites you to go with ${t.him}.<br><br>What will you do?`,
              choices: [
                [
                  "Let's go!",
                  () => {
                    const o = rint(15, 100),
                      n = rint(15, 100);
                    return (
                      frRel(e, Math.round((o + n) / 25)),
                      fx({ Happiness: Math.round(o / 15) }, ""),
                      {
                        msg: `I went to the ${a} concert with my friend, ${e.first}.`,
                        title: o >= 35 ? "Hands in the air!" : "Off key",
                        bars: joyBars(o, n, t),
                        text: `You and your friend, ${e.first}, went to the ${a} concert.`,
                      }
                    );
                  },
                ],
                [
                  "I don't feel like it",
                  () => (
                    frRel(e, -3), `I turned down my friend, ${e.first}'s, invitation to the ${a} concert.`
                  ),
                ],
              ],
            };
          },
        ),
        FEV(
          6,
          90,
          "f-mad",
          "Friend Insults You",
          () => frLive().length,
          () => {
            const e = any(frLive()),
              t = frPr(e),
              a = any([
                "your haircut",
                "your clothes",
                "your laugh",
                "how you talk",
                "your taste in music",
                "your cooking",
              ]);
            return {
              ...frCard(e),
              angry: !0,
              desc: `${e.first} made fun of ${a} in front of everyone.`,
              choices: [
                [
                  "Confront " + t.him,
                  () =>
                    chance(0.55)
                      ? (frRel(e, 3), `I confronted ${e.first} and ${t.he} apologized.`)
                      : (frRel(e, -6), `I confronted ${e.first}, and ${t.he} doubled down.`),
                ],
                [
                  "Insult " + t.him + " back",
                  () => (frRel(e, -8), fx({ Happiness: 2 }, ""), `I insulted ${e.first} right back.`),
                ],
                [
                  "Forgive " + t.him,
                  () => (
                    frRel(e, 3), fx({ Happiness: -2 }, ""), `I forgave ${e.first} for making fun of me.`
                  ),
                ],
                ["End the friendship", () => (frEnd(e), `I ended my friendship with ${e.first}.`)],
              ],
            };
          },
        ),
        document.getElementById("ageBtn").addEventListener("click", () => {
          if (state.dead || !state.friends || !state.friends.length) return;
          let e = null;
          for (const t of state.friends)
            t.away || (t.rel = clamp((t.rel ?? 50) - rint(0, 4))),
              (t.lowYears = (t.rel ?? 50) < 20 ? (t.lowYears || 0) + 1 : 0),
              (t.unfriendAfter ??= rint(2, 4)),
              !e && t.lowYears >= t.unfriendAfter && (e = t);
          e && queuePopup(() => unfriendCard(e));
        }),
        document.getElementById("ageBtn").addEventListener("click", () => {
          if (state.dead || !state.friends || !state.friends.length) return;
          const e = state.friends.find((e) => friendAge(e) >= 40 && chance(relDeathChance(friendAge(e))));
          if (!e) return;
          const t = friendAge(e);
          frEnd(e),
            say(`My friend, ${e.first} ${e.last}, passed away at the age of ${t}.`),
            deathQueue.push({
              name: `${e.first} ${e.last}`,
              title: e.best ? "Best Friend" : "Friend",
              age: t,
              look: e.look,
              g: e.g,
              rel: e.rel ?? 50,
              parent: !1,
              p: null,
            }),
            setTimeout(showDeaths, 420);
        }),
        document.getElementById("ageBtn").addEventListener("click", () => {
          state.dead ||
            (100 === state.age &&
              setTimeout(() => showAchievement("Centenarian", "Live to be 100 years old"), 700));
        }),
        FEV(
          13,
          60,
          "f-party",
          "Party Invitation",
          () => frLive(25).length,
          () => {
            const e = any(frLive(25));
            frPr(e);
            return {
              ...frCard(e),
              desc: `${e.first} is throwing a party this weekend and invited you!`,
              choices: [
                [
                  "Go to the party",
                  () => (
                    frRel(e, 6),
                    state.age >= 16 && chance(0.25)
                      ? (fx({ Happiness: 3, Health: -3 }, ""),
                        `I went to ${e.first}'s party and got way too drunk.`)
                      : (fx({ Happiness: 6 }, ""), `I had a blast at ${e.first}'s party.`)
                  ),
                ],
                ["Stay home", () => (frRel(e, -3), `I skipped ${e.first}'s party.`)],
              ],
            };
          },
        ),
        FEV(
          16,
          90,
          "f-money",
          "Friend Needs Money",
          () => frLive(20).length && state.money >= 50,
          () => {
            const e = any(frLive(20)),
              t =
                (frPr(e),
                Math.max(
                  20,
                  Math.min(
                    10 * Math.round((0.2 * state.money) / 10),
                    localPrice(any([100, 250, 500, 1e3, 2500])),
                  ),
                ));
            return {
              ...frCard(e),
              desc: `${e.first} is short on cash and is asking you for ${usd(t)}.`,
              choices: [
                [
                  "Lend it",
                  () => (
                    (state.money -= t),
                    (e.debt = (e.debt || 0) + t),
                    frRel(e, 6),
                    renderStats(),
                    `I lent ${e.first} ${usd(t)}.`
                  ),
                ],
                [
                  "Give it as a gift",
                  () => ((state.money -= t), frRel(e, 12), renderStats(), `I gave ${e.first} ${usd(t)}.`),
                ],
                ["Refuse", () => (frRel(e, -6), `I refused to give ${e.first} money.`)],
              ],
            };
          },
        ),
        FEV(
          10,
          90,
          "f-rumor",
          "Friend Spreads Rumor",
          () => frLive().length,
          () => {
            const e = any(frLive()),
              t = frPr(e),
              a = any(
                state.age < 18
                  ? [
                      "you still sleep with a stuffed animal",
                      "you cheated on a test",
                      "you have a secret crush on a teacher",
                      "you got rejected by your crush",
                      "you can't swim",
                      "you still wet the bed",
                    ]
                  : [
                      "you got fired",
                      "you cheated on your partner",
                      "you're broke",
                      "you lied on your resume",
                      "you still live with your parents",
                      "you can't swim",
                    ],
              );
            return {
              ...frCard(e),
              angry: !0,
              desc: `You found out ${e.first} has been telling people that ${a}.`,
              choices: [
                [
                  "Confront " + t.him,
                  () =>
                    chance(0.5)
                      ? (frRel(e, -2), `I confronted ${e.first} about the rumor and ${t.he} apologized.`)
                      : (frRel(e, -10),
                        fx({ Happiness: -2 }, ""),
                        `I confronted ${e.first} about the rumor and we got into a huge fight.`),
                ],
                [
                  "Forgive " + t.him,
                  () => (
                    frRel(e, -2),
                    fx({ Happiness: -3 }, ""),
                    `I forgave ${e.first} for spreading a rumor about me.`
                  ),
                ],
                ["Cut ties", () => (frEnd(e), `I cut ties with ${e.first} for spreading rumors about me.`)],
              ],
            };
          },
        );
      const frCrushes = () =>
        frLive(40).filter(
          (e) =>
            e.g !== PG() &&
            friendAge(e) >= 14 &&
            Math.abs(friendAge(e) - state.age) <= 6 &&
            canDate(friendAge(e)),
        );
      FEV(
        14,
        70,
        "f-heart",
        "Friend Confesses Feelings",
        () => frCrushes().length,
        () => {
          const e = any(frCrushes()),
            t = frPr(e);
          return {
            ...frCard(e),
            desc: `${e.first} admits ${t.he}'s had feelings for you for a long time.`,
            choices: [
              [
                "Start dating " + t.him,
                () => {
                  const t = makeLover({ g: e.g, ages: [friendAge(e), friendAge(e)] });
                  Object.assign(t, {
                    first: e.first,
                    last: e.last,
                    look: e.look,
                    rel: Math.max(60, e.rel ?? 60),
                  }),
                    frEnd(e);
                  const a = addLover(t);
                  return (
                    fx({ Happiness: 8 }, ""),
                    {
                      msg: `I started dating my friend ${e.first}.`,
                      title: "Love is in the air",
                      text: `You are now dating ${e.first} ${e.last}!${a}`,
                    }
                  );
                },
              ],
              ["Let " + t.him + " down gently", () => (frRel(e, -5), `I let ${e.first} down gently.`)],
              [
                "Avoid " + t.him,
                () => (frRel(e, -12), `I avoided ${e.first} after ${t.he} confessed ${t.his} feelings.`),
              ],
            ],
          };
        },
      ),
        FEV(
          8,
          90,
          "f-cry",
          "Friend in Crisis",
          () => frLive().length,
          () => {
            const e = any(frLive()),
              t = frPr(e),
              a = any(
                state.age < 18
                  ? [
                      `${t.his} parents are getting divorced`,
                      `${t.his} dog died`,
                      `${t.he} is being bullied`,
                      `${t.his} grandma passed away`,
                    ]
                  : [
                      `${t.he} just lost ${t.his} job`,
                      `${t.he} went through a bad breakup`,
                      `${t.his} mom is very sick`,
                      `${t.he} is being evicted`,
                    ],
              );
            return {
              ...frCard(e),
              desc: `${e.first} is devastated because ${a}.`,
              choices: [
                ["Comfort " + t.him, () => (frRel(e, 8), `I comforted ${e.first} through a hard time.`)],
                [
                  "Offer to help",
                  () => (
                    frRel(e, 11), fx({ Happiness: 2 }, ""), `I helped ${e.first} get through a hard time.`
                  ),
                ],
                [
                  "Ignore " + t.him,
                  () => (frRel(e, -12), `I ignored ${e.first} when ${t.he} needed me most.`),
                ],
              ],
            };
          },
        ),
        FEV(
          6,
          90,
          "f-luggage",
          "Friend Moving Away",
          () => frLive().length,
          () => {
            const e = any(frLive()),
              t = frPr(e),
              a = state.city || city,
              o = ((window.CITIES || {})[state.country] || []).filter((e) => e !== a),
              n =
                o.length && chance(0.7) ? any(o) : any(["another country", "across the country", "overseas"]),
              s = /^(another|across|overseas)/.test(n) ? n : `to ${n}`;
            return {
              ...frCard(e),
              desc: `${friendAge(e) >= 18 ? `${e.first} is` : `${e.first}'s family is`} moving ${s.replace(/^another/, "to another")}.`,
              choices: [
                [
                  "Promise to keep in touch",
                  () => (
                    (e.away = n),
                    frRel(e, -4),
                    `${e.first} moved ${s.replace(/^another/, "to another")}. We promised to keep in touch.`
                  ),
                ],
                [
                  "Throw a goodbye party",
                  () => (
                    (e.away = n),
                    frRel(e, 6),
                    fx({ Happiness: 2 }, ""),
                    `I threw ${e.first} a goodbye party before ${t.he} moved away.`
                  ),
                ],
                ["Just say goodbye", () => ((e.away = n), frRel(e, -12), `${e.first} moved away.`)],
              ],
            };
          },
        ),
        document.getElementById("ageBtn").addEventListener("click", () =>
          state.friends.forEach((e) => {
            e.debt &&
              !state.dead &&
              chance(0.35) &&
              ((state.money += e.debt),
              say(`${e.first} paid me back the ${usd(e.debt)} I lent ${frPr(e).him}.`),
              (e.debt = 0),
              renderStats());
          }),
        );
      const afford = (e, t) => {
          const a = e && e.m < 0 ? (isOldEra() ? eraCash(-e.m / 100) : -e.m) : 0;
          return a && state.money < a ? fx({ Happiness: -2 }, `I couldn't afford to spend ${usd(a)}.`) : t();
        },
        EXT_RE = /\b(grand(ma|pa|mother|father|parents?)|cousins?|aunts?|uncles?)\b/i,
        extEvent = (e) => EXT_RE.test(`${e.k || ""} ${e.t || ""} ${e.d || ""}`),
        extChoices = (e) => {
          if (mods.extFamily) return e;
          const t = e.filter((e) => !EXT_RE.test(`${e[0]} ${e[2] || ""}`));
          return t.length ? t : e;
        };
      for (const H of [
        ...(window.KID_EVENTS || []),
        ...(window.SPEND_EVENTS || []),
        ...(window.FIGHT_EVENTS || []),
      ])
        EVENTS.push({
          txt: H.d,
          home: "Home" === H.k,
          min: H.a[0],
          max: H.a[1],
          kind: H.k,
          ext: extEvent(H),
          src: (window.KID_EVENTS || []).includes(H)
            ? "kid"
            : (window.SPEND_EVENTS || []).includes(H)
              ? "spend"
              : "fight",
          t: H.t,
          make() {
            let e = H.p ? person(Math.max(2, state.age - 1), state.age + 1) : null;
            for (; e && H.opp && e.g === PG(); ) e = person(Math.max(2, state.age - 1), state.age + 1);
            const t = (t) =>
                e
                  ? t
                      .replace(/\{first\}/g, e.first)
                      .replace(/\{him\}/g, e.him)
                      .replace(/\{his\}/g, "he" === e.he ? "his" : "her")
                      .replace(/\{He\}/g, "he" === e.he ? "He" : "She")
                      .replace(/\{he\}/g, e.he)
                  : t,
              a = H.src ? H.src.replace("{g}", "f" === PG() ? "f" : "m") : null;
            return {
              ...(e ? personCard(e) : { who: H.t, av: H.i, avSrc: a }),
              icon: H.i,
              iconSrc: a,
              title: H.t,
              desc: t(H.d),
              feedback: (window.FIGHT_EVENTS || []).includes(H),
              angry: (window.FIGHT_EVENTS || []).includes(H),
              choices: extChoices(H.c).map(([a, o, n, s, r, i]) => [
                t(a),
                () =>
                  afford(o.m < 0 ? o : r, () =>
                    null == s || chance(ROMANCE_ASK.test(a) ? romanceOdds(e || {}, { base: s }) : s)
                      ? runFx(o, t(n))
                      : runFx(r, t(i)),
                  ),
              ]),
            };
          },
        });
      const PICON = { Mother: "1f469", Father: "1f468" },
        relAge = (e) => state.age + e.ageOffset,
        EXT_KINDS = ["grandparent", "auntuncle", "cousin", "cousinkid"],
        famOn = (e) => !EXT_KINDS.includes(e.kind) || !!mods.extFamily,
        famMember = (e, t, a, o) => {
          const n = Math.max(0, a);
          return {
            kind: e,
            g: t,
            first: uname(t),
            last: o,
            ageOffset: a,
            look: randomLook(t, n),
            rel: rint(55, 90),
          };
        };
      state.family = [
        ...Array.from({ length: rint(2, 4) }, (e, t) =>
          famMember("grandparent", t % 2 ? "f" : "m", rint(48, 72), t < 2 ? SURNAME : any(LAST)),
        ),
        ...Array.from({ length: rint(0, 3) }, () => {
          let e = rint(-8, 8);
          return 0 === e && (e = 2), famMember("sibling", Math.random() < 0.5 ? "m" : "f", e, SURNAME);
        }),
        ...Array.from({ length: rint(1, 4) }, () =>
          famMember("auntuncle", Math.random() < 0.5 ? "m" : "f", rint(22, 42), any(LAST)),
        ),
        ...Array.from({ length: rint(0, 4) }, () =>
          famMember("cousin", Math.random() < 0.5 ? "m" : "f", rint(-5, 6), any(LAST)),
        ),
      ];
      const BIRTH_STORIES = [
        "I was the result of a random Tinder hookup.",
        "I was conceived on a family vacation.",
        "My parents had been trying for a baby for years.",
        "I was an unplanned pregnancy.",
        "I was conceived on my parents' wedding night.",
        "I was a happy accident.",
        "My parents met at a bar and I was the result.",
        "I was born after a long and difficult labor.",
        "I was born in the back of a taxi.",
        "I was born two weeks early.",
      ];
      setTimeout(() => {
        if (0 !== state.age || state.birthInfo || 1 !== log.children.length) return;
        state.birthInfo = !0;
        const e = log.firstElementChild.querySelectorAll("p"),
          t = [
            `My name is ${state.first} ${SURNAME}.`,
            ...["Mother", "Father"].map((e) => {
              const t = ((a = e), state.parents.find((e) => e.role === a));
              var a;
              return t
                ? `My ${e.toLowerCase()} is ${t.first} ${SURNAME}, ${((e) => {
                    const t = (profileOf(e, e.ageAtBirth).job || "Unemployed").split(" at ")[0];
                    return /^(Unemployed|None|Retired|Student)$/.test(t)
                      ? `who is ${"None" === t ? "unemployed" : t.toLowerCase()}`
                      : `${/^[aeiou]/i.test(t) ? "an" : "a"} ${t.toLowerCase()}`;
                  })(t)} (age ${t.ageAtBirth}).`
                : `My ${e.toLowerCase()} is unknown.`;
            }),
            ...state.family
              .filter((e) => "sibling" === e.kind && e.ageOffset > 0)
              .map(
                (e) =>
                  `I have an older ${"m" === e.g ? "brother" : "sister"} named ${e.first} (age ${e.ageOffset}).`,
              ),
          ];
        e[0] && e[0].insertAdjacentHTML("beforeend", ` ${any(BIRTH_STORIES)}`),
          e[1] &&
            (e[1].insertAdjacentHTML("beforeend", " I am a Taurus."),
            e[1].insertAdjacentHTML("afterend", `<p>${t.join("<br>")}</p>`));
      }, 0);
      const relLabel = (e) =>
          ({
            grandparent: "m" === e.g ? "grandpa" : "grandma",
            sibling: "m" === e.g ? "brother" : "sister",
            auntuncle: "m" === e.g ? "uncle" : "aunt",
            cousin: "cousin",
            cousinkid: "cousin",
            nibling: "m" === e.g ? "nephew" : "niece",
            child: "m" === e.g ? "son" : "daughter",
            stepparent: "m" === e.g ? "stepfather" : "stepmother",
            exstepparent: "m" === e.g ? "ex-stepfather" : "ex-stepmother",
            stepsibling: "m" === e.g ? "stepbrother" : "stepsister",
            exstepsibling: "m" === e.g ? "ex-stepbrother" : "ex-stepsister",
            halfsibling: "m" === e.g ? "half-brother" : "half-sister",
          })[e.kind],
        relTitle = (e) =>
          "sibling" === e.kind
            ? `${e.ageOffset > 0 ? "Older" : "Younger"} ${"m" === e.g ? "Brother" : "Sister"}`
            : "cousinkid" === e.kind
              ? "Cousin's " + ("m" === e.g ? "Son" : "Daughter")
              : /^(ex)?step|^half/.test(e.kind)
                ? relLabel(e).replace(/(^|-)([a-z])/g, (e, t, a) => t + a.toUpperCase())
                : relLabel(e)[0].toUpperCase() + relLabel(e).slice(1),
        relDeathChance = (e) =>
          e < 40
            ? 0.001
            : e < 60
              ? 0.004
              : e < 75
                ? 0.02 + 0.004 * (e - 60)
                : e < 90
                  ? 0.08 + 0.012 * (e - 75)
                  : e < 105
                    ? 0.4
                    : 1,
        newBaby = (e, t) => {
          const a = Math.random() < 0.5 ? "m" : "f",
            o = {
              kind: e,
              g: a,
              first: uname(a),
              last: t,
              ageOffset: -state.age,
              look: randomLook(a, 0),
              rel: rint(60, 85),
              announced: !0,
            };
          return state.family.push(o), o;
        },
        deathQueue = [],
        DEATH_CAUSES = [
          "a heart attack",
          "a stroke",
          "cancer",
          "pneumonia",
          "heart disease",
          "kidney failure",
          "liver failure",
          "a car accident",
          "a fall down the stairs",
          "diabetes complications",
          "an aneurysm",
          "the flu",
          "lung disease",
          "sepsis",
          "a drug overdose",
          "a motorcycle crash",
          "drowning",
          "a house fire",
          "leukemia",
          "complications from surgery",
        ];
      function funeralCard(e) {
        const t = e.title.toLowerCase(),
          a = "f" === e.g ? "her" : "him",
          o = "f" === e.g ? "her" : "his";
        (e.fun ||= [
          ["Burial", ep(100 * rint(70, 110)), `Bury ${a}`, `buried ${a}`, "bury"],
          ["Cremation", ep(100 * rint(8, 16)), `Cremate ${a}`, `had ${a} cremated`, "cremate"],
          ["Taxidermy", ep(1e3 * rint(40, 60)), `Have ${a} taxidermied`, `had ${a} taxidermied`, "taxidermy"],
          ["Donate to Science", 0, `Donate ${o} body to science`, `donated ${o} body to science`, "donate"],
        ]),
          jCard({
            tag: e.title,
            person: { name: e.name, look: e.look, g: e.g, age: e.age, mood: "sad" },
            iconSrc: "prison/coffin.png",
            title: "Funeral Planning",
            lead: `It's time to decide what to do with your ${t}'s remains.<br><br>What will you do?`,
            rows: e.fun.map(([e, t]) => [e, usd(t)]),
            choices: e.fun.map(([, a, n, s, r]) => [
              n,
              () => {
                if (state.money < a)
                  return notice(
                    "Flat broke",
                    `You don't have enough money to ${r} your ${t}.<br><br>${state.money ? "You can't afford it." : "You are broke."}`,
                    () => funeralCard(e),
                    !1,
                    brokeRows(a),
                  );
                a && ((state.money -= a), renderStats()),
                  say(`I planned ${o} funeral and ${s}.`),
                  (state.funeralPending = !1),
                  setTimeout(() => {
                    inheritance(e), showDeaths();
                  }, 300);
              },
            ]),
          });
      }
      function inheritance(e) {
        const t = e.p;
        if (!t || e.inherited || state.dead) return;
        e.inherited = !0;
        const a = e.parent ? "parent" : t.kind;
        if (!["parent", "grandparent", "auntuncle"].includes(a) || e.age < 30) return;
        const o = profileOf(t, e.age),
          n = Math.max(0, Math.round((o && o.money) || 0)),
          s = (e.g, "f" === e.g ? "her" : "his");
        if (!chance("parent" === a ? 0.85 : "grandparent" === a ? 0.45 : 0.25) || n < 500)
          return void (
            n >= 500 &&
            (say(`I was left out of my ${e.title.toLowerCase()}'s will.`),
            queuePopup(() =>
              notice("Left out", `You weren't mentioned in your ${e.title.toLowerCase()}'s will.`),
            ))
          );
        const r = "parent" === a && state.parents.some((e) => e !== t && !e.dead),
          i = r ? (n * rint(40, 60)) / 100 : n,
          l = state.family.filter((e) => "sibling" === e.kind && !e.dead && relAge(e) >= 0).length,
          c = "parent" === a ? 1 + l : rint(2, 6),
          d = 10 * Math.round(((i / c) * ("parent" === a ? 1 : 0.5 + Math.random())) / 10);
        d < 100 ||
          ((state.money += d),
          renderStats(),
          say(
            `I inherited ${usd(d)} from my ${e.title.toLowerCase()}${c > 1 ? ", split with " + ("parent" === a ? "my sibling" + (l > 1 ? "s" : "") : "the rest of the family") : ""}.`,
          ),
          queuePopup(() => {
            chaChing(),
              notice(
                "To help the healing",
                `You inherited ${usd(d)}.`,
                null,
                !1,
                c > 1 || r
                  ? `<table class="nt"><tr><td><b>Estate:</b> ${usd(n)}</td></tr>${r ? `<tr><td><b>To ${s} spouse:</b> ${usd(Math.round(n - i))}</td></tr>` : ""}<tr><td><b>Split Between:</b> ${c} heir${c > 1 ? "s" : ""}</td></tr></table>`
                  : "",
              );
          }));
      }
      function showDeaths() {
        const e =
          evWrap.classList.contains("open") ||
          jmWrap.classList.contains("open") ||
          toast.classList.contains("show") ||
          !!document.querySelector(".notice-wrap");
        if (state.dead) return void (deathQueue.length = 0);
        if (!deathQueue.length) return;
        if (e) return void setTimeout(showDeaths, 500);
        const t = deathQueue.shift(),
          a =
            t.p && "child" === t.p.kind
              ? hit("childDeath")
              : state.spouse && t.p === state.spouse
                ? hit("spouseDeath")
                : t.parent
                  ? rint(25, 40)
                  : t.p && /sibling/.test(t.p.kind)
                    ? rint(15, 30)
                    : Math.round(4 + t.rel / 6),
          o = "f" === t.g ? "She" : "He",
          n = "f" === t.g ? "her" : "his",
          s = t.age >= 75 && chance(0.7) ? "complications from old age" : any(DEATH_CAUSES),
          r = (e) => (
            (state.stats.Happiness = clamp(state.stats.Happiness - (e ? Math.max(2, a - 3) : a))),
            renderStats(),
            setTimeout(() => {
              inheritance(t), showDeaths();
            }, 300),
            e
              ? `I attended the funeral of my ${t.title.toLowerCase()}, ${t.name}.`
              : `I skipped the funeral of my ${t.title.toLowerCase()}, ${t.name}.`
          );
        if (t.murdered) {
          const e = t.title.toLowerCase(),
            s =
              (t.parent ||
                (t.p && ("child" === t.p.kind || /sibling/.test(t.p.kind))) ||
                (state.spouse && t.p === state.spouse)) &&
              state.age >= 18,
            r = (e) => (
              setTimeout(() => {
                inheritance(t), showDeaths();
              }, 300),
              e
            );
          return (
            (state.stats.Happiness = clamp(state.stats.Happiness - a)),
            renderStats(),
            openEvent({
              kind: t.title,
              make: () => ({
                who: t.name,
                av: "2620-fe0f",
                icon: "2620-fe0f",
                title: "Death",
                feedback: !0,
                desc: `Your ${e} passed away at the age of ${t.age}.<br><br>${o} was murdered.${s ? `<br><br>It is your responsibility to plan ${n} funeral.` : ""}`,
                person: { look: t.look, g: t.g, age: t.age },
                choices: [
                  ...(s
                    ? [
                        [
                          `Plan ${n} funeral`,
                          () => {
                            state.funeralPending = !0;
                            const a = () => (overlayOpen() ? setTimeout(a, 400) : funeralCard(t));
                            return setTimeout(a, 300), `My ${e} was murdered.`;
                          },
                        ],
                      ]
                    : []),
                  [
                    s ? "Go but let someone else plan it" : `Attend ${n} funeral`,
                    () => r(`I attended the funeral of my ${e}, ${t.name}.`),
                  ],
                  [
                    s ? "Skip it altogether" : "Skip it",
                    () => r(`I skipped the funeral of my ${e}, ${t.name}.`),
                  ],
                ],
              }),
            })
          );
        }
        openEvent({
          kind: t.title,
          make: () => ({
            who: t.name,
            av: "2620-fe0f",
            icon: "2620-fe0f",
            title: "Death",
            desc: `Your ${t.title.toLowerCase()} passed away at the age of ${t.age}.<br><br>${o} died of ${s}.`,
            person: { look: t.look, g: t.g, age: t.age },
            table: [
              ["Name", t.name],
              ["Relation", t.title],
              ["Age", t.age],
            ],
            bars: [["Relationship", t.rel]],
            choices: [
              ...(t.parent && state.age >= 18
                ? [
                    [
                      `Plan ${n} funeral`,
                      () => {
                        (state.funeralPending = !0),
                          (state.stats.Happiness = clamp(state.stats.Happiness - Math.max(2, a - 3))),
                          renderStats();
                        const e = () => (overlayOpen() ? setTimeout(e, 400) : funeralCard(t));
                        return (
                          setTimeout(e, 300),
                          `I planned the funeral of my ${t.title.toLowerCase()}, ${t.name}.`
                        );
                      },
                    ],
                  ]
                : []),
              [`Attend ${n} funeral`, () => r(!0)],
              ["Skip it", () => r(!1)],
            ],
          }),
        });
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead) return;
        const e = (e) => log.lastElementChild.insertAdjacentHTML("beforeend", `<p>${e}</p>`);
        if (
          (state.family
            .filter((e) => "sibling" === e.kind && 0 === relAge(e) && !e.announced)
            .forEach((t) => {
              (t.announced = !0), e(`My mom gave birth to my baby ${relLabel(t)}, ${t.first}.`);
            }),
          state.family.length < 45)
        ) {
          const t = state.parents.find((e) => "Mother" === e.role && !e.dead);
          if (
            t &&
            (!state.pm || "married" === state.pm.status) &&
            t.ageAtBirth + state.age >= 20 &&
            t.ageAtBirth + state.age <= 44 &&
            chance(0.05)
          ) {
            const t = newBaby("sibling", SURNAME);
            e(`My mom gave birth to my baby ${relLabel(t)}, ${t.first}!`);
          }
          for (const t of state.family.filter((e) => !e.dead && relAge(e) >= 0 && famOn(e))) {
            const a = relAge(t);
            if (
              "sibling" === t.kind &&
              t.ageOffset > 0 &&
              "f" === t.g &&
              a >= 20 &&
              a <= 42 &&
              chance(0.06)
            ) {
              const a = FAMILY_FACTS.birth(t);
              e(
                `My older sister ${t.first} had a baby ${a.babyKind}, ${a.baby}. Meet my new ${"boy" === a.babyKind ? "nephew" : "niece"}!`,
              );
            } else if ("auntuncle" === t.kind && a >= 22 && a <= 45 && chance(0.05)) {
              const a = FAMILY_FACTS.birth(t);
              e(`My ${relLabel(t)} ${t.first} had a baby ${a.babyKind}, my new cousin ${a.baby}.`);
            } else if ("cousin" === t.kind && a >= 20 && a <= 42 && chance(0.05)) {
              const a = FAMILY_FACTS.birth(t);
              e(`My cousin ${t.first} had a baby ${a.babyKind}, ${a.baby}.`);
            } else if ("grandparent" === t.kind && "f" === t.g && a <= 52 && mods.extFamily && chance(0.01)) {
              const a = newBaby("auntuncle", t.last);
              e(
                `Surprise! My grandma ${t.first} had a baby ${"m" === a.g ? "boy" : "girl"}, my new ${relLabel(a)} ${a.first}!`,
              );
            }
          }
        }
        const t = (t, a, o, n, s, r, i) => {
          (t.dead = !0),
            (t.diedAt = state.age),
            (t.diedAge = n),
            e(`My ${o.toLowerCase()}, ${a}, passed away at the age of ${n}.`),
            deathQueue.push({ name: a, title: o, age: n, look: s, g: r, rel: t.rel, parent: i, p: t });
        };
        state.parents.forEach((e) => {
          const a = e.ageAtBirth + state.age;
          !e.dead &&
            chance(relDeathChance(a)) &&
            t(e, `${e.first} ${SURNAME}`, e.role, a, e.look, e.gender, !0);
        }),
          state.family.forEach((e) => {
            const a = relAge(e);
            !e.dead &&
              a >= 1 &&
              famOn(e) &&
              chance(relDeathChance(a)) &&
              t(e, `${e.first} ${e.last}`, relTitle(e), a, e.look, e.g, !1);
          }),
          deathQueue.length && setTimeout(showDeaths, 420);
      });
      const famFits = (e, t) =>
        t.kind === e.r &&
        !t.dead &&
        famOn(t) &&
        relAge(t) >= ("sibling" === e.r ? 2 : 0) &&
        !t.away &&
        (!(window.FAMILY_RULES || {})[e.t] || !FAMILY_RULES[e.t].when || FAMILY_RULES[e.t].when(t));
      for (const R of window.FAMILY_EVENTS || [])
        EVENTS.push({
          txt: R.d,
          min: R.a[0],
          max: R.a[1],
          kind: "Family",
          family: !0,
          src: "fam",
          t: `${R.r}:${R.t}`,
          ok: () => state.family.some((e) => famFits(R, e)),
          make() {
            const e = any(state.family.filter((e) => famFits(R, e))),
              t = (window.FAMILY_RULES || {})[R.t] || {},
              a = (t.happen && t.happen(e)) || {},
              o = "f" === e.g ? "she" : "he",
              n = relLabel(e),
              s = (t) =>
                t
                  .replace(/\{(baby|babyKind)\}/g, (e, t) => a[t] ?? e)
                  .replace(/\{name\}/g, e.first)
                  .replace(/\{rel\}/g, n)
                  .replace(/\{Rel\}/g, n[0].toUpperCase() + n.slice(1))
                  .replace(/\{him\}/g, "he" === o ? "him" : "her")
                  .replace(/\{his\}/g, "he" === o ? "his" : "her")
                  .replace(/\{He\}/g, "he" === o ? "He" : "She")
                  .replace(/\{he\}/g, o);
            this.kind = relTitle(e);
            const r = (t, a) => ((t = t || {}).r && (e.rel = clamp(e.rel + t.r)), runFx(t, s(a)));
            return {
              who: `${e.first} ${e.last}`,
              av: R.i,
              icon: R.i,
              title: s(R.t),
              desc: s(R.d),
              person: { look: e.look, g: e.g, age: relAge(e) },
              bars: [["Relationship", e.rel]],
              choices: R.c.map(([a, o, n, i, l, c], d) => [
                s(a),
                () => (
                  t.choice && t.choice[d] && t.choice[d](e),
                  afford(o.m < 0 ? o : l, () => (null == i || chance(i) ? r(o, n) : r(l, c)))
                ),
              ]),
            };
          },
        });
      const aliveParents = (e) =>
        state.parents.filter((t) => !(t.dead || (e && "any" !== e && t.role !== e)));
      for (const B of window.KID_SOCIAL_EVENTS || [])
        EVENTS.push({
          min: B.a[0],
          max: B.a[1],
          kind: "New Friend",
          ext: extEvent(B),
          src: "social",
          t: B.t,
          ok: () => !B.par || aliveParents(B.par).length > 0,
          make() {
            const e = B.par ? any(aliveParents(B.par)) : null,
              t = B.kid ? person(Math.max(2, state.age - 1), state.age + 1) : null,
              a = t && "f" === t.g ? "she" : "he",
              o = e && "f" === e.gender ? "she" : "he",
              n = e ? ("Mother" === e.role ? "mom" : "dad") : "mom",
              s = (e) =>
                e
                  .replace(/\{first\}/g, t ? t.first : "")
                  .replace(/\{kid\}/g, t ? ("m" === t.g ? "boy" : "girl") : "kid")
                  .replace(/\{him\}/g, "he" === a ? "him" : "her")
                  .replace(/\{his\}/g, "he" === a ? "his" : "her")
                  .replace(/\{He\}/g, "he" === a ? "He" : "She")
                  .replace(/\{he\}/g, a)
                  .replace(/\{his_kid\}/g, "their")
                  .replace(/\{his_parent\}/g, "he" === o ? "his" : "her")
                  .replace(/\{him_parent\}/g, "he" === o ? "him" : "her")
                  .replace(/\{he_parent\}/g, o)
                  .replace(/\{mom\}/g, n)
                  .replace(/\{Mom\}/g, n[0].toUpperCase() + n.slice(1));
            this.kind = t ? "New Friend" : e ? e.role : "Family";
            const r = (a, o) => (
              (a = a || {}).f && t && addFriend(t, a.f),
              a.pr && e && (e.rel = clamp(e.rel + a.pr)),
              runFx(a, s(o))
            );
            return {
              ...(t
                ? personCard(t)
                : e
                  ? {
                      who: `${e.first} ${SURNAME}`,
                      av: B.i,
                      person: { look: e.look, g: e.gender, age: e.ageAtBirth + state.age },
                      bars: [["Relationship", e.rel]],
                    }
                  : { who: B.t, av: B.i }),
              icon: B.i,
              title: B.t,
              desc: s(B.d),
              choices: B.c.map(([e, t, a, o, n, i]) => [
                s(e),
                () => afford(t.m < 0 ? t : n, () => (null == o || chance(o) ? r(t, a) : r(n, i))),
              ]),
            };
          },
        });
      for (const O of window.PARENT_EVENTS || [])
        EVENTS.push({
          txt: O.d,
          min: O.a[0],
          max: O.a[1],
          kind: "Family",
          family: !0,
          ext: extEvent(O),
          src: "parent",
          t: O.t,
          ok: () => aliveParents(O.p).length > 0,
          make() {
            const e = any(aliveParents(O.p));
            return (this.kind = e.role), parentMoment(O, e);
          },
        });
      state.featSeen = new Set();
      const sibPhrase = () => {
          const e = state.family.filter((e) => "sibling" === e.kind && !e.dead && relAge(e) >= 0);
          return e.length
            ? e.length > 1
              ? "you and your siblings"
              : `you and your ${e[0].ageOffset > 0 ? "big" : "little"} ${relLabel(e[0])}`
            : "you";
        },
        VACATION_SPOTS = [
          "Madrid",
          "Paris",
          "Rome",
          "London",
          "Tokyo",
          "Cancún",
          "Orlando",
          "Honolulu",
          "Barcelona",
          "Lisbon",
          "Amsterdam",
          "Las Vegas",
          "Sydney",
          "Bali",
          "Dubai",
          "New York",
        ],
        MISCHIEF_WINS = [
          "I egged my neighbor's house!",
          "I toilet-papered the tree in my neighbor's front yard!",
          "I rang my neighbor's doorbell and ran away!",
          "I put salt in the sugar bowl!",
          "I drew a mustache on a sleeping relative!",
          "I let the air out of my neighbor's tires!",
        ],
        parHead = (e) => ({
          who: `${e.first} ${SURNAME}`,
          av: PICON[e.role],
          person: { look: e.look, g: e.gender, age: e.ageAtBirth + state.age },
        }),
        LEV = "lifeev/",
        sibOf = () => state.family.filter((e) => "sibling" === e.kind && !e.dead && relAge(e) >= 3),
        mainLover = () => (state.lovers || []).find((e) => e.main);
      EVENTS.push(
        {
          min: 0,
          max: 1,
          kind: "Mother",
          key: "once:mouth-noises",
          ok: () => aliveParents("Mother").length > 0,
          make() {
            const e = aliveParents("Mother")[0];
            return {
              ...parHead(e),
              iconSrc: LEV + "mouth-noises.png",
              title: "Mouth Noises",
              desc: "Your mother speaks gently to you, encouraging you to make a sound.<br><br>What will you do?",
              choices: [
                [
                  'Say "mama"',
                  () => (
                    (e.rel = clamp(e.rel + 8)),
                    fx({ Happiness: 3 }, 'I said "mama" for the first time. My mom cried happy tears.')
                  ),
                ],
                [
                  "Make another sound",
                  () => (
                    (e.rel = clamp(e.rel + 2)),
                    fx({ Happiness: 1 }, "I blew a raspberry at my mom instead of talking.")
                  ),
                ],
                ["Remain silent", () => "I stared at my mom and said nothing."],
              ],
            };
          },
        },
        {
          min: 2,
          max: 4,
          kind: "Mother",
          key: "once:lunchtime",
          ok: () => aliveParents().length > 0,
          make() {
            const e = aliveParents("Mother")[0] || aliveParents()[0],
              t = "Mother" === e.role ? "mother" : "father";
            return {
              ...parHead(e),
              iconSrc: LEV + "lunchtime.png",
              title: "Lunchtime",
              desc: `You're watching cartoons when your ${t} offers you some lunch.<br><br>What will you eat?`,
              choices: [
                [
                  "Mac and cheese",
                  () =>
                    fx(
                      { Happiness: 4, Health: -1 },
                      "I ate a big bowl of mac and cheese in front of the TV.",
                    ),
                ],
                [
                  "A sandwich",
                  () => fx({ Happiness: 2, Health: 1 }, "I ate a sandwich while watching cartoons."),
                ],
                ["Yogurt and fruit", () => fx({ Health: 3 }, "I ate yogurt and fruit for lunch.")],
                [
                  "Banana and turkey",
                  () => fx({ Health: 2, Happiness: 1 }, "I ate a banana and some turkey for lunch."),
                ],
              ],
            };
          },
        },
        {
          min: 5,
          max: 12,
          kind: "Friend",
          t: "Gross Dinner",
          make() {
            const e = person(state.age, state.age + 1);
            return {
              ...personCard(e),
              table: null,
              bars: null,
              iconSrc: LEV + "gross-dinner.png",
              title: "Gross Dinner",
              desc: `You're having dinner at your friend ${e.first}'s house, and ${e.his || ("m" === e.g ? "his" : "her")} parents serve something you think is disgusting.<br><br>What will you do?`,
              choices: [
                [
                  "Refuse to eat it",
                  () =>
                    fx(
                      { Happiness: -1 },
                      `I refused to eat dinner at ${e.first}'s house. ${"he" === e.he ? "His" : "Her"} parents were offended.`,
                    ),
                ],
                [
                  "Eat it anyway",
                  () =>
                    fx(
                      { Health: 1, Happiness: -2 },
                      `I choked down a gross dinner at ${e.first}'s house to be polite.`,
                    ),
                ],
                [
                  "Sneak it to the dog",
                  () =>
                    chance(0.6)
                      ? fx(
                          { Happiness: 3 },
                          `I fed my dinner to ${e.first}'s dog under the table. Nobody noticed!`,
                        )
                      : fx({ Happiness: -3 }, `I got caught feeding my dinner to ${e.first}'s dog.`),
                ],
              ],
            };
          },
        },
        {
          min: 6,
          max: 12,
          kind: "School",
          t: "Picking Teams",
          ok: () => !!(state.school && state.school.classmates && state.school.classmates.length >= 2),
          make() {
            const [e, t] = [...state.school.classmates].sort(() => Math.random() - 0.5);
            return {
              who: "Gym Class",
              av: "1f3c0",
              iconSrc: LEV + "picking-teams.png",
              title: "Picking Teams",
              plain: !0,
              desc: `You're a team captain in gym class, and it's down to the last pick: ${e.first}, who is great at sports, or ${t.first}, who nobody ever picks.<br><br>Who will you pick?`,
              choices: [
                [
                  `Pick ${e.first}`,
                  () => (
                    (e.rel = clamp(e.rel + 4)),
                    (t.rel = clamp(t.rel - 4)),
                    fx({ Happiness: 2 }, `I picked ${e.first} for my team, and we won.`)
                  ),
                ],
                [
                  `Pick ${t.first}`,
                  () => (
                    (t.rel = clamp(t.rel + 12)),
                    fx(
                      { Happiness: 3 },
                      `I picked ${t.first} for my team. ${"m" === t.g ? "He" : "She"} was so happy to be picked.`,
                    )
                  ),
                ],
                [
                  "Pick nobody",
                  () => (
                    (e.rel = clamp(e.rel - 2)),
                    (t.rel = clamp(t.rel - 2)),
                    "I refused to pick anyone, and the gym teacher picked for me."
                  ),
                ],
              ],
            };
          },
        },
        {
          min: 5,
          max: 17,
          kind: "Sibling",
          t: "Sibling Argument",
          again: 3,
          ok: () => sibOf().length > 0,
          make() {
            const e = any(sibOf()),
              t = relLabel(e),
              a = "m" === e.g ? "him" : "her";
            return {
              who: `${e.first} ${e.last}`,
              av: "1f620",
              person: { look: e.look, g: e.g, age: relAge(e) },
              angry: !0,
              iconSrc: LEV + "sibling-argument.png",
              title: "Family Argument",
              desc: `You and your ${t}, ${e.first}, are arguing over who gets to use the TV.<br><br>What will you do?`,
              choices: [
                [
                  "Apologize",
                  () => (
                    (e.rel = clamp(e.rel + 6)), `I apologized to my ${t}, ${e.first}, and let ${a} watch TV.`
                  ),
                ],
                [
                  "Keep arguing",
                  () => (
                    (e.rel = clamp(e.rel - 6)),
                    fx({ Happiness: -1 }, `My ${t}, ${e.first}, and I argued until we were both in tears.`)
                  ),
                ],
                [
                  `Insult ${a}`,
                  () => ((e.rel = clamp(e.rel - 12)), `I insulted my ${t}, ${e.first}, during an argument.`),
                ],
                [
                  "Complain to my parents",
                  () =>
                    chance(0.5)
                      ? ((e.rel = clamp(e.rel - 8)), `I told on my ${t}, ${e.first}, who got in trouble.`)
                      : fx(
                          { Happiness: -3 },
                          `I complained to my parents about my ${t}, ${e.first}, but they grounded me instead.`,
                        ),
                ],
              ],
            };
          },
        },
        {
          min: 11,
          max: 15,
          kind: "Crush",
          key: "once:first-kiss",
          ok: () => !!state.school,
          make() {
            let e = person(state.age, state.age + 1);
            const t = crushGender();
            for (; t && e.g !== t; ) e = person(state.age, state.age + 1);
            return {
              ...personCard(e),
              table: null,
              bars: [
                [
                  "Attractiveness",
                  e.looks,
                  "",
                  e.looks >= 65 ? "#2fa03b" : e.looks >= 35 ? "#f5a01f" : "#d32f2f",
                ],
              ],
              iconSrc: LEV + "first-kiss.png",
              title: "First Kiss",
              desc: `Your classmate ${e.first} leans in for a kiss behind the bleachers.<br><br>What will you do?`,
              choices: [
                [
                  "Kiss with tongue",
                  () =>
                    chance(0.65)
                      ? fx({ Happiness: 8 }, `I had my first kiss with ${e.first}. It was magical.`)
                      : fx(
                          { Happiness: -4 },
                          `I tried to kiss ${e.first} with tongue, and it was really awkward.`,
                        ),
                ],
                ["Kiss without tongue", () => fx({ Happiness: 6 }, `I had my first kiss with ${e.first}.`)],
                ["Run away", () => fx({ Happiness: -1 }, `I ran away when ${e.first} tried to kiss me.`)],
              ],
            };
          },
        },
        {
          min: 10,
          max: 15,
          kind: "Growing Up",
          key: "once:first-period",
          ok: () => "f" === PG() && !state.firstPeriod,
          make() {
            state.firstPeriod = state.age;
            const e = aliveParents("Mother")[0],
              t = state.family.find(
                (e) => "sibling" === e.kind && "f" === e.g && !e.dead && relAge(e) > state.age,
              );
            return {
              plain: !0,
              iconSrc: LEV + "first-period.png",
              title: "Period",
              desc: "You just got your first period.<br><br>What will you do?",
              choices: [
                ...(e
                  ? [
                      [
                        "Tell my mother",
                        () => (
                          (e.rel = clamp(e.rel + 6)),
                          "I told my mom I got my first period. She helped me with everything."
                        ),
                      ],
                    ]
                  : []),
                ...(t
                  ? [
                      [
                        "Tell my sister",
                        () => (
                          (t.rel = clamp(t.rel + 6)), `I told my sister, ${t.first}, about my first period.`
                        ),
                      ],
                    ]
                  : []),
                ["Tell a friend", () => fx({ Happiness: 2 }, "I told a friend about my first period.")],
                [
                  "Keep it a secret",
                  () => fx({ Happiness: -2 }, "I got my first period and kept it a secret."),
                ],
              ],
            };
          },
        },
        {
          min: 17,
          max: 17,
          kind: "School",
          key: "once:prom-royalty",
          ok: () => !(!state.school || "High School" !== state.school.level),
          make() {
            const e = state.school,
              t = "f" === PG() ? "queen" : "king",
              a = (a) => {
                const o = chance(Math.min(0.85, (e.popularity ?? 40) / 120 + a));
                return (
                  o && (e.popularity = clamp((e.popularity ?? 40) + 10)),
                  o
                    ? fx({ Happiness: 12 }, `I was crowned prom ${t}!`)
                    : fx({ Happiness: -5 }, `I was nominated for prom ${t}, but I lost.`)
                );
              };
            return {
              plain: !0,
              iconSrc: LEV + "prom-royalty.png",
              title: "Prom Royalty",
              desc: `You've been nominated for prom ${t}!<br><br>What will you do?`,
              choices: [
                ["Campaign hard", () => a(0.25)],
                ["Let the votes decide", () => a(0.1)],
                ["Drop out of the race", () => `I dropped out of the race for prom ${t}.`],
              ],
            };
          },
        },
        {
          min: 12,
          max: 17,
          kind: "Classmate",
          t: "School Fight",
          again: 3,
          school: !0,
          ok: () => !!(state.school && state.school.classmates && state.school.classmates.length),
          make() {
            const e = any(state.school.classmates);
            return {
              who: `${e.first} ${e.last}`,
              av: "1f620",
              person: { look: e.look, g: e.g, age: state.age },
              angry: !0,
              iconSrc: LEV + "school-fight.png",
              title: "School Fight",
              desc: `${e.first} shoves you in the hallway and wants to fight.<br><br>What will you do?`,
              choices: [
                [
                  "Fight back",
                  () => (
                    (e.rel = clamp(e.rel - 15)),
                    chance(0.35) && setTimeout(() => schoolTrouble(1, !0, "fighting"), 0),
                    chance(0.55)
                      ? fx({ Happiness: 3 }, `I got into a fight with ${e.first} in the hallway and won.`)
                      : fx(
                          { Health: -rint(5, 12), Happiness: -4 },
                          `I got into a fight with ${e.first} in the hallway and lost.`,
                        )
                  ),
                ],
                [
                  "Walk away",
                  () => fx({ Happiness: -2 }, `I walked away when ${e.first} tried to start a fight.`),
                ],
                [
                  "Report it to a teacher",
                  () => (
                    (e.rel = clamp(e.rel - 8)), `I reported ${e.first} to a teacher for trying to fight me.`
                  ),
                ],
              ],
            };
          },
        },
        {
          min: 15,
          max: 17,
          kind: "Party",
          t: "House Party",
          again: 2,
          ok: () => aliveParents().length > 0,
          make: () => ({
            plain: !0,
            iconSrc: LEV + "house-party.png",
            title: "House Party",
            desc: "Your parents are going out of town for the weekend. You're thinking about throwing a house party.<br><br>What will you do?",
            choices: [
              [
                "Ask for permission",
                () =>
                  chance(0.4)
                    ? (setTimeout(() => partyPlanning(!0), 300),
                      "My parents said I could throw a party while they were away!")
                    : fx({ Happiness: -2 }, "I asked my parents if I could throw a party, and they said no."),
              ],
              [
                "Throw it without asking",
                () => (
                  setTimeout(() => partyPlanning(!1), 300),
                  "I decided to throw a party while my parents were away, without telling them."
                ),
              ],
              ["Don't throw a party", () => "I decided not to throw a party."],
            ],
          }),
        },
        {
          min: 13,
          max: 17,
          kind: "Parents",
          t: "Parents Disapprove",
          ok: () => !!mainLover() && aliveParents().length > 0,
          make() {
            const e = mainLover(),
              t = aliveParents(),
              a = loverTitle(e).toLowerCase(),
              o = "m" === e.g ? "him" : "her";
            return {
              ...parHead(t[0]),
              angry: !0,
              iconSrc: LEV + "parents-disapprove.png",
              title: "Parents Disapprove",
              desc: `Your parents found out your ${a}, ${e.first}, has been sleeping over, and they're not happy about it.<br><br>What will you do?`,
              choices: [
                [
                  "Promise it won't happen again",
                  () => (
                    t.forEach((e) => (e.rel = clamp(e.rel + 3))),
                    `I promised my parents ${e.first} wouldn't sleep over again.`
                  ),
                ],
                [
                  "Argue with them",
                  () => (
                    t.forEach((e) => (e.rel = clamp(e.rel - 8))),
                    fx(
                      { Happiness: -2 },
                      `I argued with my parents about my ${a}, ${e.first}, sleeping over.`,
                    )
                  ),
                ],
                [
                  "Sneak around anyway",
                  () =>
                    chance(0.5)
                      ? fx(
                          { Happiness: 3 },
                          `I kept sneaking my ${a}, ${e.first}, over without my parents knowing.`,
                        )
                      : (t.forEach((e) => (e.rel = clamp(e.rel - 10))),
                        fx(
                          { Happiness: -4 },
                          `My parents caught me sneaking ${e.first} over and grounded me.`,
                        )),
                ],
                [
                  `Break up with ${o}`,
                  () => (
                    toEx(e), fx({ Happiness: -6 }, `My parents made me break up with my ${a}, ${e.first}.`)
                  ),
                ],
              ],
            };
          },
        },
        {
          min: 16,
          max: 60,
          kind: "Love",
          t: "Premarital Relations",
          again: 4,
          ok: () => {
            const e = mainLover();
            return !!e && state.spouse !== e && !e.intimate && !isVirgin();
          },
          make() {
            const e = mainLover(),
              t = loverTitle(e).toLowerCase();
            return {
              who: `${e.first} ${e.last}`,
              av: "1f496",
              person: { look: e.look, g: e.g, age: loverAge(e) },
              iconSrc: LEV + "premarital.png",
              title: "Premarital Relations",
              desc: `Your ${t}, ${e.first}, wants to take your relationship to the next level.<br><br>What will you do?`,
              choices: [
                [
                  "Agree",
                  () => (
                    (e.intimate = !0),
                    (state.notVirgin = !0),
                    (e.rel = clamp(e.rel + 6)),
                    hookupSound(),
                    e.g !== BIO() &&
                      chance(0.08) &&
                      (state.babies ||= []).push({
                        due: state.age + 1,
                        keep: "f" === BIO() || chance(0.7),
                        other: { first: e.first, last: e.last, g: e.g, look: e.look },
                      }),
                    fx(
                      { Happiness: 6 },
                      `My ${t}, ${e.first}, and I took our relationship to the next level.`,
                    )
                  ),
                ],
                [
                  "Wait until marriage",
                  () => (
                    (e.rel = clamp(e.rel - rint(2, 8))),
                    `I told my ${t}, ${e.first}, I want to wait until marriage.`
                  ),
                ],
                [
                  "Not yet",
                  () => ((e.rel = clamp(e.rel - 2)), `I told my ${t}, ${e.first}, I'm not ready yet.`),
                ],
              ],
            };
          },
        },
      );
      const homePets = () =>
        (state.pets || []).filter((e) => "home" === (e.status ?? "home") && "family" !== e.owner);
      EVENTS.push(
        {
          min: 18,
          max: 100,
          kind: "Pets",
          t: "Pet Kidnapping",
          again: 15,
          ok: () => homePets().length > 0,
          make() {
            const e = any(homePets()),
              t = (e.species || "pet").toLowerCase(),
              a = localPrice(100 * rint(5, 40)),
              o = "f" === e.g ? "her" : "him",
              n = (t) => {
                const a = state.pets.indexOf(e);
                return (
                  a >= 0 && state.pets.splice(a, 1),
                  (e.status = "kidnapped"),
                  (e.goneAt = state.age),
                  fx({ Happiness: -rint(8, 15) }, t)
                );
              };
            return {
              who: "Pet Kidnappers",
              av: "1f6a8",
              iconSrc: LEV + "pet-kidnapping.png",
              title: "Pet Kidnapping",
              plain: !0,
              desc: `Criminals kidnapped your ${t}, ${e.name}, and are demanding ${usd(a)} for ${petHis(e)} safe return.<br><br>What will you do?`,
              choices: [
                [
                  `Pay the ransom (${usd(a)})`,
                  () =>
                    state.money < a
                      ? n(`I couldn't afford the ransom for my ${t}, ${e.name}, and never saw ${o} again.`)
                      : ((state.money -= a),
                        renderStats(),
                        chance(0.85)
                          ? fx(
                              { Happiness: 3 },
                              `I paid ${usd(a)} to get my ${t}, ${e.name}, back from kidnappers.`,
                            )
                          : n(`I paid the kidnappers, but they never returned my ${t}, ${e.name}.`)),
                ],
                [
                  "Call the police",
                  () =>
                    chance(0.5)
                      ? fx({ Happiness: 5 }, `The police rescued my ${t}, ${e.name}, from kidnappers!`)
                      : n(`The police couldn't find my kidnapped ${t}, ${e.name}.`),
                ],
                [
                  "Refuse to pay",
                  () =>
                    chance(0.3)
                      ? fx(
                          { Happiness: 4 },
                          `I refused to pay the kidnappers, and my ${t}, ${e.name}, escaped and came home on ${petHis(e)} own!`,
                        )
                      : n(`I refused to pay the kidnappers, and I never saw my ${t}, ${e.name}, again.`),
                ],
              ],
            };
          },
        },
        {
          min: 16,
          max: 80,
          kind: "Emergency",
          t: "Emergency Rescue",
          again: 8,
          make() {
            const e = any([
              "a child drowning in a lake",
              "a man trapped in a burning car",
              "a woman who fell onto the subway tracks",
              "a kid stuck on thin ice",
            ]);
            return {
              who: "Emergency",
              av: "1f6a8",
              iconSrc: LEV + "emergency-rescue.png",
              title: "Emergency Rescue",
              plain: !0,
              desc: `You see ${e}!<br><br>What will you do?`,
              choices: [
                [
                  "Jump in and help",
                  () =>
                    chance(0.75)
                      ? fx(
                          { Happiness: 10 },
                          `I rescued ${e.replace(/^a /, "a ")}. People are calling me a hero!`,
                        )
                      : fx(
                          { Health: -rint(5, 15), Happiness: -3 },
                          `I tried to rescue ${e}, but I got hurt in the process.`,
                        ),
                ],
                [
                  "Call 911",
                  () => fx({ Happiness: 2 }, `I called 911 when I saw ${e}. Help arrived in time.`),
                ],
                ["Ignore it", () => fx({ Happiness: -4 }, `I ignored ${e}. I can't stop thinking about it.`)],
              ],
            };
          },
        },
        {
          min: 14,
          max: 90,
          kind: "Crime",
          t: "Witnessed Crime",
          again: 8,
          make() {
            const e = any([
              "mugging an old woman",
              "breaking into a car",
              "shoplifting from a store",
              "spray painting a wall",
            ]);
            return {
              who: "Witness",
              av: "1f694",
              iconSrc: LEV + "witnessed-crime.png",
              title: "Witnessed Crime",
              plain: !0,
              desc: `You see someone ${e}.<br><br>What will you do?`,
              choices: [
                ["Report it", () => fx({ Happiness: 2 }, `I reported someone I saw ${e} to the police.`)],
                [
                  "Intervene",
                  () =>
                    chance(0.6)
                      ? fx({ Happiness: 6 }, `I stopped someone from ${e}!`)
                      : fx(
                          { Health: -rint(5, 12), Happiness: -3 },
                          `I tried to stop someone from ${e} and got hurt.`,
                        ),
                ],
                ["Avoid it", () => `I saw someone ${e} and walked away.`],
              ],
            };
          },
        },
        {
          min: 3,
          max: 90,
          kind: "Family",
          src: "family",
          t: "Quality Time",
          w: 3,
          again: 3,
          ok: () => qtPool().length > 0,
          make() {
            const e = any(qtPool()),
              t = famRole(e).replace(/-/g, " "),
              a = prOf(e.g || e.gender || ("Father" === e.role ? "m" : "f")),
              [o, n] = any(state.age < 18 ? QT_KID : QT_ADULT);
            return {
              ...famHead(e),
              kindText: capWords(t),
              iconSrc: "emoji/1f570-fe0f.png",
              title: "Quality Time",
              desc: `Your ${t}, ${e.first}, wants to ${o}.<br><br>Will you go with ${a.him}?`,
              choices: [
                [
                  "Of course I will",
                  () => {
                    const o = rint(10, 100),
                      s = Math.max(10, Math.min(100, o + rint(-30, 30)));
                    return (
                      (e.rel = clamp(e.rel + Math.round((o + s) / 25))),
                      (e.seenAt = state.age),
                      fx({ Happiness: Math.round(o / 20) }, ""),
                      {
                        msg: `My ${t}, ${e.first}, and I ${n}.`,
                        title: o >= 35 ? any(["Bonding", "Quality time", "Family fun"]) : "Awkward",
                        bars: joyBars(o, s, a),
                        text: `You and your ${t}, ${e.first}, ${n}.`,
                      }
                    );
                  },
                ],
                [
                  "I'm too busy right now",
                  () => (
                    (e.rel = clamp(e.rel - rint(3, 7))),
                    `I told my ${t}, ${e.first}, I was too busy to spend time with ${a.him}.`
                  ),
                ],
                [
                  `Argue with ${a.him}`,
                  () => (
                    (e.rel = clamp(e.rel - rint(6, 12))),
                    fx(
                      { Happiness: -2 },
                      `My ${t}, ${e.first}, wanted to spend time with me, and we ended up arguing.`,
                    )
                  ),
                ],
              ],
            };
          },
        },
        {
          min: 18,
          max: 90,
          kind: "Family",
          src: "adult",
          t: "Spat",
          w: 3,
          again: 3,
          ok: () => famPool().length > 0,
          make() {
            const e = any(famPool()),
              t = famRole(e),
              a = "m" === e.g || "m" === e.gender || "Father" === e.role ? "him" : "her",
              o = any([
                "money",
                "politics",
                "the holidays",
                "your love life",
                "your career choices",
                "an old family grudge",
                "how you live your life",
              ]);
            return {
              ...famHead(e),
              angry: !0,
              iconSrc: LEV + "spat.png",
              title: "Spat",
              desc: `You and your ${t}, ${e.first}, are having a disagreement about ${o}.<br><br>What will you do?`,
              choices: [
                [
                  "Apologize",
                  () => (
                    (e.rel = clamp(e.rel + rint(3, 8))),
                    `I apologized to my ${t}, ${e.first}, after we disagreed about ${o}.`
                  ),
                ],
                [
                  "Disagree",
                  () => (
                    (e.rel = clamp(e.rel - rint(3, 8))),
                    `My ${t}, ${e.first}, and I agreed to disagree about ${o}.`
                  ),
                ],
                [
                  `Insult ${a}`,
                  () => (
                    (e.rel = clamp(e.rel - rint(10, 18))),
                    fx({ Happiness: -2 }, `I insulted my ${t}, ${e.first}, during an argument about ${o}.`)
                  ),
                ],
                [
                  `Fight ${a}`,
                  () => (
                    (e.rel = clamp(e.rel - rint(15, 25))),
                    chance(0.5)
                      ? fx({ Happiness: 1 }, `I got into a fistfight with my ${t}, ${e.first}, and won.`)
                      : runFx(
                          { he: -rint(4, 10), hit: 1 },
                          `My ${t}, ${e.first}, beat me up during a family fight.`,
                        )
                  ),
                ],
              ],
            };
          },
        },
        {
          min: 21,
          max: 90,
          kind: "Child",
          src: "adult",
          t: "Child Behavior",
          w: 3,
          again: 3,
          ok: () => myKids().length > 0,
          make() {
            const e = any(myKids()),
              t = relLabel(e),
              a = relAge(e),
              o = "m" === e.g ? "him" : "her",
              n = "m" === e.g ? "he" : "she",
              s = any(
                a < 6
                  ? [
                      "threw a tantrum in the grocery store",
                      "drew on the walls with crayons",
                      "bit another kid at daycare",
                      "flushed your keys down the toilet",
                    ]
                  : a < 13
                    ? [
                        "got sent to the principal's office",
                        "lied about finishing homework",
                        "broke a neighbor's window",
                        "stole candy from the store",
                      ]
                    : [
                        "snuck out of the house at night",
                        "got caught skipping school",
                        "came home drunk",
                        "crashed your car",
                        "got caught vaping",
                      ],
              );
            return {
              who: `${e.first} ${e.last}`,
              av: "1f61f",
              person: { look: e.look, g: e.g, age: a },
              angry: !0,
              iconSrc: LEV + "child-behavior.png",
              title: "Child Behavior",
              desc: `Your ${t}, ${e.first}, ${s}.<br><br>What will you do?`,
              choices: [
                [
                  "Ignore it",
                  () => (
                    (e.rel = clamp(e.rel + 1)),
                    (e.brat = (e.brat || 0) + 1),
                    `My ${t}, ${e.first}, ${s}. I ignored it.`
                  ),
                ],
                [
                  `Discipline ${o}`,
                  () => (
                    (e.rel = clamp(e.rel - rint(2, 6))),
                    (e.brat = Math.max(0, (e.brat || 0) - 1)),
                    `I disciplined my ${t}, ${e.first}, after ${n} ${s}.`
                  ),
                ],
                [
                  "Discuss it",
                  () =>
                    chance(0.6)
                      ? ((e.rel = clamp(e.rel + rint(3, 7))),
                        (e.brat = 0),
                        `I had a talk with my ${t}, ${e.first}, after ${n} ${s}. ${"he" === n ? "He" : "She"} promised to do better.`)
                      : `I tried to talk to my ${t}, ${e.first}, after ${n} ${s}, but ${n} didn't listen.`,
                ],
                [
                  `Yell at ${o}`,
                  () => (
                    (e.rel = clamp(e.rel - rint(8, 14))),
                    fx({ Happiness: -1 }, `I yelled at my ${t}, ${e.first}, after ${n} ${s}.`)
                  ),
                ],
              ],
            };
          },
        },
        {
          min: 18,
          max: 70,
          kind: "Love",
          src: "adult",
          t: "Proposal",
          w: 3,
          again: 3,
          ok: () => {
            const e = mainLover();
            return (
              !!e &&
              state.spouse !== e &&
              !e.bride &&
              !e.married &&
              e.rel >= 55 &&
              loverAge(e) >= 18 &&
              state.age - (e.since ?? state.age - 2) >= 1
            );
          },
          make() {
            const e = mainLover(),
              t = loverTitle(e).toLowerCase(),
              a = "m" === e.g ? "him" : "her",
              o = "m" === e.g ? "he" : "she";
            return (
              (e.since ??= state.age),
              {
                who: `${e.first} ${e.last}`,
                av: "1f48d",
                person: { look: e.look, g: e.g, age: loverAge(e) },
                iconSrc: LEV + "proposal.png",
                title: "Proposal",
                desc: `Your ${t}, ${e.first}, got down on one knee and asked you to marry ${a}!<br><br>What will you do?`,
                choices: [
                  [
                    "Accept",
                    () => (
                      (e.bride = !0),
                      (e.rel = clamp(e.rel + rint(8, 15))),
                      fx(
                        { Happiness: +rint(8, 14) },
                        `My ${t}, ${e.first}, proposed to me, and I said yes! We're engaged.`,
                      )
                    ),
                  ],
                  [
                    "Reject",
                    () => (
                      (e.rel = clamp(e.rel - rint(20, 35))),
                      e.rel < 25 || chance(0.35)
                        ? (toEx(e),
                          fx(
                            { Happiness: -rint(5, 10) },
                            `I turned down ${e.first}'s marriage proposal, and ${o} broke up with me.`,
                          ))
                        : fx({ Happiness: -2 }, `I turned down my ${t}, ${e.first}'s marriage proposal.`)
                    ),
                  ],
                ],
              }
            );
          },
        },
        {
          min: 18,
          max: 50,
          kind: "Love",
          src: "adult",
          t: "Pregnancy",
          w: 3,
          again: 4,
          ok: () => {
            const e = mainLover() || (state.spouse && !state.spouse.dead ? state.spouse : null);
            if (
              !e ||
              e.g === BIO() ||
              (!e.intimate && !e.bride && state.spouse !== e) ||
              (window.LOVE && LOVE.onBC(e))
            )
              return !1;
            const t = "f" === BIO() ? state.age : loverAge(e);
            return t >= 18 && t <= 44 && !(state.babies || []).length;
          },
          make() {
            const e = mainLover() || state.spouse,
              t = state.spouse === e ? ("f" === e.g ? "wife" : "husband") : loverTitle(e).toLowerCase(),
              a = "f" === BIO(),
              o = (a) =>
                (state.babies ||= []).push({
                  due: state.age + 1,
                  keep: a,
                  adopt: !a,
                  role: t,
                  other: { first: e.first, last: e.last, g: e.g, look: e.look },
                });
            return {
              who: `${e.first} ${e.last}`,
              av: "1f930",
              person: { look: e.look, g: e.g, age: loverAge(e) },
              iconSrc: LEV + "pregnancy.png",
              title: "Pregnancy",
              desc: a
                ? `You found out you're pregnant with your ${t}, ${e.first}'s baby!<br><br>What will you do?`
                : `Your ${t}, ${e.first}, just told you ${"f" === e.g ? "she" : "he"}'s pregnant!<br><br>What will you do?`,
              choices: [
                [
                  "Keep the baby",
                  () => (
                    o(!0),
                    (e.rel = clamp(e.rel + rint(4, 10))),
                    fx(
                      { Happiness: +rint(5, 10) },
                      a
                        ? `I found out I'm pregnant with ${e.first}'s baby. We're keeping it!`
                        : `My ${t}, ${e.first}, is pregnant with my baby. We're keeping it!`,
                    )
                  ),
                ],
                [
                  "Put it up for adoption",
                  () => (
                    o(!1),
                    (e.rel = clamp(e.rel - rint(3, 10))),
                    a
                      ? `I found out I'm pregnant, and ${e.first} and I decided to put the baby up for adoption.`
                      : `My ${t}, ${e.first}, is pregnant, and we decided to put the baby up for adoption.`
                  ),
                ],
              ],
            };
          },
        },
      );
      const capWords = (e) => e.replace(/(^|\s)([a-z])/g, (e, t, a) => t + a.toUpperCase()),
        prOf = (e) =>
          "m" === e
            ? { he: "he", him: "him", his: "his", He: "He", His: "His" }
            : { he: "she", him: "her", his: "her", He: "She", His: "Her" },
        joyBars = (e, t, a, o) => [
          [o ? "Your enjoyment" : "Your Enjoyment", e],
          [`${a.His} ${o ? "enjoyment" : "Enjoyment"}`, t],
        ],
        isVirgin = () =>
          !state.notVirgin &&
          !(state.lovers || []).some((e) => e.intimate) &&
          !(state.exes || []).some((e) => e.intimate),
        sibsAll = () =>
          state.family.filter(
            (e) => ["sibling", "halfsibling", "stepsibling"].includes(e.kind) && !e.dead && relAge(e) >= 2,
          ),
        qtPool = () =>
          state.age < 18 ? [...aliveParents(), ...sibsAll().filter((e) => relAge(e) >= 10)] : famPool(),
        QT_KID = [
          ["take you to attend a goat yoga class", "attended a goat yoga class"],
          ["take you to the zoo", "went to the zoo"],
          ["take you out for ice cream", "went out for ice cream"],
          ["take you mini golfing", "went mini golfing"],
          ["take you to the aquarium", "went to the aquarium"],
          ["take you to a magic show", "went to a magic show"],
          ["take you to a monster truck rally", "went to a monster truck rally"],
          ["take you to the science museum", "went to the science museum"],
          ["take you to a water park", "went to a water park"],
          ["take you to a pottery class", "took a pottery class"],
          ["take you fishing", "went fishing"],
          ["take you to a petting zoo", "went to a petting zoo"],
          ["take you roller skating", "went roller skating"],
        ],
        QT_ADULT = [
          ["go out for lunch", "went out for lunch"],
          ["watch a movie together", "watched a movie together"],
          ["go for a walk in the park", "went for a walk in the park"],
          ["come over for dinner", "had dinner together"],
          ["go shopping together", "went shopping together"],
          ["play some board games", "played board games"],
          ["take a cooking class together", "took a cooking class"],
          ["go to a baseball game", "went to a baseball game"],
          ["go to a wine tasting", "went to a wine tasting"],
          ["attend a goat yoga class", "attended a goat yoga class"],
        ],
        SLEEP_DID = [
          "got busy baking",
          "built a giant pillow fort",
          "stayed up all night watching scary movies",
          "played video games until sunrise",
          "told ghost stories by flashlight",
          "made prank calls",
        ],
        SLEEP_DARES = [
          "You played truth or dare with {him} and had to eat a spoonful of mustard on a dare.",
          "You played truth or dare with {him} and had to lick the bottom of a shoe.",
          "You had a pillow fight and knocked over a lamp.",
          "You played truth or dare with {him} and had to call your crush.",
          "",
          "",
        ],
        SQ_KID = [
          "{him} not sharing {his} candy with you",
          "who gets to sit in the front seat",
          "whose turn it is on the swing",
          "{him} breaking your favorite toy",
          "who gets the last cookie",
          "{him} hogging the TV remote",
        ],
        SQ_TEEN = [
          "whether or not {he} has been snooping in your room",
          "{him} borrowing your clothes without asking",
          "who has to do the dishes tonight",
          "{him} reading your diary",
          "who gets the bathroom first in the morning",
          "{him} eating your leftovers",
        ],
        SQ_MOVES = [
          ["Bite", "bit"],
          ["Punch", "punched"],
          ["Kick", "kicked"],
          ["Slap", "slapped"],
          ["Scratch", "scratched"],
          ["Pinch", "pinched"],
          ["Headbutt", "headbutted"],
          ["Shove", "shoved"],
        ],
        SQ_TARGETS = [
          "mouth",
          "nose",
          "face",
          "arm",
          "leg",
          "ear",
          "stomach",
          "hand",
          "foot",
          "back",
          "shin",
          "toes",
        ];
      function sqAttack(e, t) {
        const a = prOf(e.g);
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="jm-tag" style="margin-top:12px">Conflict</div><h4><img src="kid/fist.png" alt=""><span>Attack</span></h4>\n      <div class="lead">How will you attack your ${t}, ${e.first}?</div>\n      <label class="hr-lab">Pick your move:</label><div class="hr-sel"><select id="sqMove">${SQ_MOVES.map(([e], t) => `<option value="${t}">${e}</option>`).join("")}</select></div>\n      <label class="hr-lab">Pick your target:</label><div class="hr-sel"><select id="sqTarget">${SQ_TARGETS.map((e) => `<option value="${e}">${a.His} ${e}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="sqGo">Attack ${a.him}</button></div>`),
          evWrap.classList.add("open"),
          (document.getElementById("sqGo").onclick = () => {
            const a = SQ_MOVES[+document.getElementById("sqMove").value][1],
              o = document.getElementById("sqTarget").value,
              n = rint(10, 95);
            evWrap.classList.remove("open"),
              (e.rel = clamp(e.rel - rint(15, 30))),
              say(`I ${a} my ${t}, ${e.first}'s, ${o}.`);
            const s = chance(0.35)
              ? () => {
                  const a = rint(3, 10);
                  fx({ Health: -a }, ""),
                    say(`My ${t}, ${e.first}, fought back.`),
                    hurt(),
                    notice(
                      "Payback",
                      `Your ${t}, ${e.first}, fought back and ${any(KID_HITS)} you!`,
                      null,
                      !1,
                      dmgBar(8 * a),
                    );
                }
              : null;
            notice(
              any(["Try me again", "Take that", "Not today"]),
              `You ${a} your ${t}, ${e.first}'s, ${o}!`,
              s,
              !1,
              dmgBar(n),
            );
          });
      }
      EVENTS.push(
        {
          min: 16,
          max: 40,
          kind: "Love",
          t: "Virginity",
          again: 3,
          ok: () => {
            const e = mainLover();
            return !!e && state.spouse !== e && !e.intimate && isVirgin();
          },
          make() {
            const e = mainLover(),
              t = loverTitle(e).toLowerCase(),
              a = prOf(e.g),
              o = rint(15, 100);
            return {
              who: `${e.first} ${e.last}`,
              av: "1f496",
              person: { look: e.look, g: e.g, age: loverAge(e) },
              kindText: "",
              iconSrc: "hang/cherries.png",
              title: "Virginity",
              desc: `Even though you're a virgin, your ${t}, ${e.first}, wants to take your relationship to the next level.<br><br>How will you react?`,
              choices: [
                [
                  `${a.He} needs to wait until marriage`,
                  () => (
                    (e.rel = clamp(e.rel + (o >= 40 ? 2 : -rint(5, 12)))),
                    {
                      msg: `I told my ${t}, ${e.first}, that I want to wait until marriage.`,
                      title: "The wait will be worth it",
                      bar: [`${a.His} Understanding`, o],
                      text: `You told your ${t}, ${e.first}, that it's important to wait until marriage to consummate your relationship.<br><br>${o >= 40 ? `${a.He} said ${a.he} understands and respects your position.` : `${a.He} said ${a.he} isn't sure ${a.he} can wait that long.`}`,
                    }
                  ),
                ],
                [
                  "Let's do it",
                  () => (
                    (e.intimate = !0),
                    (state.notVirgin = !0),
                    (e.rel = clamp(e.rel + rint(4, 10))),
                    fx({ Happiness: +rint(4, 9) }, ""),
                    hookupSound(),
                    e.g !== BIO() &&
                      chance(0.08) &&
                      (state.babies ||= []).push({
                        due: state.age + 1,
                        keep: "f" === BIO() || chance(0.7),
                        other: { first: e.first, last: e.last, g: e.g, look: e.look },
                      }),
                    {
                      msg: `I lost my virginity to my ${t}, ${e.first}.`,
                      title: "Rite of passage",
                      bars: joyBars(rint(20, 100), rint(20, 100), a),
                      text: `You lost your virginity to your ${t}, ${e.first}.`,
                    }
                  ),
                ],
                [
                  "Hmmm, not yet",
                  () => (
                    (e.rel = clamp(e.rel - (o >= 50 ? 0 : rint(2, 6)))),
                    {
                      msg: `I told my ${t}, ${e.first}, that I'm not ready yet.`,
                      title: "Not ready",
                      bar: [`${a.His} Understanding`, o],
                      text: `You told your ${t}, ${e.first}, that you're not ready yet.<br><br>${o >= 50 ? `${a.He} said ${a.he}'ll wait until you are.` : `${a.He} seemed disappointed.`}`,
                    }
                  ),
                ],
                [
                  `Break up with ${a.him}`,
                  () => (
                    toEx(e),
                    fx({ Happiness: -rint(3, 7) }, ""),
                    {
                      msg: `I broke up with my ${t}, ${e.first}, after ${a.he} wanted to take things to the next level.`,
                      title: "Moving on",
                      text: `You broke up with your ${t}, ${e.first}.`,
                    }
                  ),
                ],
              ],
            };
          },
        },
        {
          min: 3,
          max: 17,
          kind: "Sibling",
          t: "Squabble",
          w: 2,
          again: 2,
          ok: () => sibsAll().length > 0,
          make() {
            const e = any(sibsAll()),
              t = relLabel(e).replace(/-/g, " "),
              a = prOf(e.g),
              o = any(state.age < 11 ? SQ_KID : SQ_TEEN)
                .replace(/\{him\}/g, a.him)
                .replace(/\{his\}/g, a.his)
                .replace(/\{he\}/g, a.he),
              n = aliveParents("Mother")[0] || aliveParents()[0],
              s = n && n.role.toLowerCase(),
              r = n && prOf(n.gender),
              i = [
                ...(n
                  ? [
                      [
                        `Complain to ${s}`,
                        () => {
                          const o = chance(0.45);
                          return (
                            (e.rel = clamp(e.rel - rint(4, 9))),
                            o || fx({ Happiness: -2 }, ""),
                            {
                              msg: `I complained to my ${s} about my ${t}, ${e.first}.`,
                              title: "Snitch",
                              text: `You complained about ${a.him} to your ${s}.<br><br>${r.He} ${o ? `grounded your ${t} for a week.` : `reamed you for bickering with your ${t}.`}`,
                            }
                          );
                        },
                      ],
                    ]
                  : []),
                [
                  `Apologize to ${a.him}`,
                  () => {
                    const o = chance(0.7);
                    return (
                      (e.rel = clamp(e.rel + (o ? rint(5, 10) : 1))),
                      {
                        msg: `I apologized to my ${t}, ${e.first}, for bickering.`,
                        title: o ? "Peacemaker" : "Cold shoulder",
                        text: `You apologized to your ${t}, ${e.first}.<br><br>${o ? `${a.He} accepted your apology.` : `${a.He} refused to accept your apology.`}`,
                      }
                    );
                  },
                ],
                [
                  `Insult ${a.him}`,
                  () => {
                    const a = pickR(INSULTS);
                    return (
                      (e.rel = clamp(e.rel - rint(8, 15))),
                      {
                        msg: `I called my ${t}, ${e.first}, ${a}.`,
                        title: any(["Burn", "Zing", "Oof"]),
                        text: `You called your ${t}, ${e.first}, ${a}.`,
                      }
                    );
                  },
                ],
                [
                  `Attack ${a.him}`,
                  () => (
                    setTimeout(() => sqAttack(e, t), 80), `My ${t}, ${e.first}, and I got into a squabble.`
                  ),
                ],
              ];
            return {
              who: `${e.first} ${e.last}`,
              av: "1f620",
              person: { look: e.look, g: e.g, age: relAge(e) },
              kindText: capWords(t),
              iconSrc: "emoji/1f5e3-fe0f.png",
              title: "Squabble",
              desc: `You and your ${t}, ${e.first}, are ${any(["bickering", "feuding", "arguing"])} about ${o}.<br><br>What will you do?`,
              choices: i.sort(() => Math.random() - 0.5),
            };
          },
        },
        {
          min: 2,
          max: 7,
          kind: "Childhood",
          t: "Canine Courtesy",
          again: 99,
          ok: () => aliveParents().length > 0,
          make() {
            const e = any([
                "a dating coach",
                "a dentist",
                "a mail carrier",
                "a lawyer",
                "a plumber",
                "a magician",
                "a pastry chef",
                "a firefighter",
                "a yoga instructor",
                "a tax accountant",
              ]),
              t = aliveParents("Mother")[0] || aliveParents()[0],
              a = t.role.toLowerCase();
            return {
              plain: !0,
              iconSrc: "hang/newspaper.png",
              title: "Canine Courtesy",
              desc: `You're being taken on a walk when you encounter ${e} walking his dog. You want to pet it, but he says the dog won't like that.<br><br>What will you do?`,
              choices: [
                [
                  "Pet the dog anyway",
                  () => {
                    if (chance(0.45)) {
                      const t = rint(3, 8);
                      return (
                        fx({ Health: -t, Happiness: -3 }, ""),
                        hurt(),
                        {
                          msg: `I tried to pet ${e}'s dog anyway, and it bit me!`,
                          title: "Ouch!",
                          text: "You tried to pet the dog anyway, and it bit you!",
                          bar: ["Damage", 9 * t, "#b3261e"],
                        }
                      );
                    }
                    return (
                      fx({ Happiness: 3 }, ""),
                      {
                        msg: `I pet ${e}'s dog anyway. It licked my face!`,
                        title: "Good doggy",
                        text: "You pet the dog anyway, and it licked your face!<br><br>Its owner was not amused.",
                      }
                    );
                  },
                ],
                [
                  "Scream at him",
                  () => (
                    (t.rel = clamp(t.rel - 3)),
                    {
                      msg: `I screamed at ${e} for not letting me pet his dog.`,
                      title: "Tantrum",
                      text: `You screamed at ${e} for not letting you pet his dog.<br><br>Your ${a} was mortified.`,
                    }
                  ),
                ],
                [
                  "Wave to the dog",
                  () => (
                    fx({ Happiness: 2 }, ""),
                    {
                      msg: `I waved to ${e}'s dog.`,
                      title: "Hi, doggy!",
                      text: "You waved to the dog, and it wagged its tail at you.",
                    }
                  ),
                ],
                [
                  "Shrink back",
                  () => ({
                    msg: `I shrank back from ${e}'s dog.`,
                    title: "Scaredy-cat",
                    text: `You shrank back and hid behind your ${a}.`,
                  }),
                ],
              ],
            };
          },
        },
        {
          min: 3,
          max: 90,
          kind: "Pet",
          t: "Behavior",
          w: 2,
          again: 2,
          ok: () => (state.pets || []).some((e) => "home" === (e.status ?? "home")),
          make() {
            const e = any(state.pets.filter((e) => "home" === (e.status ?? "home"))),
              t = prOf("f" === e.g ? "f" : "m"),
              a = "f" === e.g ? "girl" : "boy",
              o = /mongrel|mixed|mutt/i.test(e.breed || "") ? "mutt" : (e.species || "pet").toLowerCase();
            window.PET_SOUND && PET_SOUND(e);
            const [n, s, r] = any([
                [
                  "While you are relaxing on the couch",
                  "is trying to climb on you to get your attention",
                  "climb on you",
                ],
                ["While you are eating dinner", "is begging for scraps at the table", "beg at the table"],
                ["When you get home", "has chewed up one of your shoes", "chew your shoes"],
                ["In the middle of the night", "keeps waking you up for attention", "wake you up at night"],
                ["While you are watching TV", "knocked a glass off the coffee table", "knock things over"],
                ["When you have guests over", "keeps jumping all over them", "jump on your guests"],
              ]),
              i = any([
                "a couple of large meaty breasts",
                "a juicy bone",
                "a handful of treats",
                "a squeaky toy",
                "a long belly rub",
                "a piece of cheese",
              ]),
              l = (t) => {
                e.rel = clamp((e.rel ?? 50) + t);
              };
            return {
              who: e.name,
              avSrc: petSprite(e),
              kindText: "Pet",
              iconSrc: "hang/grimace.png",
              title: "Behavior",
              desc: `${n}, your ${o}, ${e.name}, ${s}.<br><br>What will you do?`,
              choices: [
                [
                  `Train ${t.him} not to do that`,
                  () => {
                    const n = chance(0.55);
                    return (
                      l(n ? rint(2, 6) : -1),
                      {
                        msg: `I ${n ? "trained" : "tried to train"} my ${o}, ${e.name}, not to ${r}.`,
                        title: n ? `Good ${a}` : "Stubborn",
                        bar: [`${t.His} Obedience`, n ? rint(60, 100) : rint(5, 40)],
                        text: n
                          ? `You trained your ${o}, ${e.name}, not to ${r}.`
                          : `You tried to train your ${o}, ${e.name}, not to ${r}, but ${t.he} ignored you.`,
                      }
                    );
                  },
                ],
                [
                  "Do nothing",
                  () => ({
                    msg: `My ${o}, ${e.name}, ${s}. I let it slide.`,
                    title: "Whatever",
                    text: `You let your ${o}, ${e.name}, ${r}.`,
                  }),
                ],
                [
                  `Yell at ${t.him}`,
                  () => (
                    l(-rint(5, 12)),
                    {
                      msg: `I yelled at my ${o}, ${e.name}.`,
                      title: `Bad ${a}`,
                      text: `You yelled at your ${o}, ${e.name}.<br><br>${t.He} slunk away and hid.`,
                    }
                  ),
                ],
                [
                  `Reward ${t.him}`,
                  () => (
                    l(rint(5, 10)),
                    {
                      msg: `My ${o}, ${e.name}, tried to ${r}, and I rewarded ${t.him} with ${i}.`,
                      title: `Isn't ${t.he} cute?`,
                      bar: [`${t.His} Appreciation`, rint(70, 100)],
                      text: `You rewarded your ${o}, ${e.name}, with ${i}.`,
                    }
                  ),
                ],
              ],
            };
          },
        },
        {
          min: 14,
          max: 15,
          kind: "Education",
          key: "once:extracurricular",
          ok: () => isHS() && !state.school.club,
          make: () => ({
            plain: !0,
            iconSrc: "hang/soccer.png",
            title: "Extracurricular Activity",
            bars: [["Your Athleticism", athleticism()]],
            desc: "Now that you're in high school, you are thinking about participating in an extracurricular activity.<br><br>What will you do?",
            choices: [
              [
                "See what my school offers",
                () => (
                  setTimeout(() => {
                    screen.classList.add("open"), openClubs();
                  }, 60),
                  "I looked into the extracurricular activities at my school."
                ),
                { hi: !0 },
              ],
              [
                "I'm not interested in that",
                () => "I decided I'm not interested in extracurricular activities.",
              ],
            ],
          }),
        },
        {
          min: 16,
          max: 90,
          kind: "Love",
          t: "Date Night",
          w: 2,
          again: 2,
          ok: () => !!(mainLover() || (state.spouse && !state.spouse.dead)),
          make() {
            const e = mainLover() || state.spouse,
              t = state.spouse === e ? ("f" === e.g ? "wife" : "husband") : loverTitle(e).toLowerCase(),
              a = prOf(e.g),
              [o, n] = any([
                ["go out for a romantic dinner", "went out for a romantic dinner"],
                ["go dancing", "went dancing"],
                ["see a movie", "saw a movie together"],
                ["take a walk on the beach at sunset", "took a walk on the beach at sunset"],
                ["have a picnic in the park", "had a picnic in the park"],
                ["go ice skating", "went ice skating"],
                ["take a cooking class together", "took a cooking class together"],
                ["go stargazing", "went stargazing"],
                ["try a new restaurant", "tried a new restaurant"],
              ]);
            return {
              who: `${e.first} ${e.last}`,
              av: "1f496",
              person: { look: e.look, g: e.g, age: loverAge(e) },
              kindText: capWords(t),
              iconSrc: "hang/date.png",
              title: "Date Night",
              desc: `Your ${t}, ${e.first}, wants to ${o}.<br><br>What will you do?`,
              choices: [
                [
                  "Sounds romantic",
                  () => {
                    const o = rint(15, 100),
                      s = Math.max(10, Math.min(100, o + rint(-30, 30)));
                    return (
                      (e.rel = clamp(e.rel + Math.round((o + s) / 20) - 2)),
                      fx({ Happiness: Math.round(o / 15) }, ""),
                      {
                        msg: `My ${t}, ${e.first}, and I ${n}.`,
                        title: o >= 35 ? any(["Love is in the air", "Date night", "Swoon"]) : "Awkward",
                        bars: joyBars(o, s, a),
                        text: `You and your ${t}, ${e.first}, ${n}.`,
                      }
                    );
                  },
                ],
                [
                  "Not tonight",
                  () => (
                    (e.rel = clamp(e.rel - rint(3, 8))),
                    `I told my ${t}, ${e.first}, I wasn't in the mood to go out.`
                  ),
                ],
              ],
            };
          },
        },
      );
      const HANGOUTS = [
        [
          "Movie Night",
          "hang/movie.png",
          [8, 90],
          "wants to see {x} at the movies with you",
          "went to see {x}",
          "Let's go!",
          "Not tonight",
          ["Two thumbs up", "Popcorn party"],
          [
            "{He} spilled popcorn all over you.",
            "You both cried at the ending.",
            "Someone behind you kicked your seat the whole time.",
          ],
          0,
          [
            "the new superhero movie",
            "a horror movie",
            "a romantic comedy",
            "an animated movie",
            "a sci-fi blockbuster",
          ],
        ],
        [
          "Mall Trip",
          "hang/mall.png",
          [10, 40],
          "wants to go shopping at the mall with you",
          "went shopping at the mall",
          "Sure!",
          "I'm broke",
          ["Shop till you drop", "Retail therapy"],
          [
            "You tried on ridiculous hats together.",
            "{He} talked you into buying sunglasses you will never wear.",
          ],
        ],
        [
          "Arcade",
          "hang/arcade.png",
          [7, 30],
          "wants to go to the arcade with you",
          "played games at the arcade",
          "Let's play!",
          "Maybe next time",
          ["High score", "Game on"],
          ["You won enough tickets for a rubber spider.", "{He} beat you at air hockey five times in a row."],
        ],
        [
          "Bowling",
          "hang/bowling.png",
          [8, 85],
          "wants to go bowling with you",
          "went bowling",
          "I'm in!",
          "No thanks",
          ["Strike!", "Right down the middle"],
          ["You bowled a 47.", "{He} rolled three strikes in a row.", "Your ball ended up in the next lane."],
        ],
        [
          "Karaoke Night",
          "emoji/1f3a4.png",
          [16, 70],
          "wants to go to a karaoke bar with you",
          "sang karaoke",
          "Hand me the mic!",
          "I can't sing",
          ["Encore!", "Rock star"],
          ["You belted out a power ballad.", "{He} sang a duet with a total stranger."],
        ],
        [
          "Beach Day",
          "hang/beach.png",
          [6, 80],
          "wants to spend the day at the beach with you",
          "spent the day at the beach",
          "Sounds fun!",
          "Too much sun",
          ["Sun and sand", "Life is a beach"],
          ["You built a huge sandcastle.", "You got a terrible sunburn.", "A seagull stole your sandwich."],
        ],
        [
          "Road Trip",
          "hang/roadtrip.png",
          [17, 60],
          "wants to go on a road trip to {x} with you",
          "went on a road trip to {x}",
          "Road trip!",
          "I can't get away",
          ["On the road again", "Miles of smiles"],
          ["The car broke down halfway there.", "You sang along to the radio the whole way."],
          0,
          ["the Grand Canyon", "Las Vegas", "the coast", "the mountains", "a national park"],
        ],
        [
          "Camping Trip",
          "hang/camping.png",
          [8, 70],
          "wants to go camping with you",
          "went camping",
          "I'll pack the tent",
          "I hate bugs",
          ["Happy camper", "S'more fun"],
          ["A raccoon got into your food.", "You told ghost stories around the campfire."],
        ],
        [
          "Theme Park",
          "emoji/1f3a2.png",
          [8, 60],
          "has passes to {x} and invites you along",
          "went to {x}",
          "Let's ride!",
          "Rides make me sick",
          ["What a rush", "Again! Again!"],
          ["You threw up after the roller coaster.", "You waited two hours for one ride."],
          0,
          ["a theme park", "a water park", "the county fair"],
        ],
        [
          "Game Night",
          "emoji/1f3ae.png",
          [7, 50],
          "wants you to come over and play {x}",
          "played {x} together",
          "I'll be right over",
          "I'm busy",
          ["Game over", "Player two"],
          ["You stayed up way too late.", "{He} accused you of cheating."],
          0,
          ["video games", "board games", "card games", "a new video game"],
        ],
        [
          "Hike",
          "hang/hiking.png",
          [12, 75],
          "wants to go on a hike with you",
          "went on a hike",
          "Let's go!",
          "I'd rather not",
          ["Summit reached", "Breath of fresh air"],
          ["You saw a deer on the trail.", "You both got lost for an hour."],
          2,
        ],
        [
          "Big Game",
          "hang/stadium.png",
          [10, 85],
          "has tickets to a {x} game and wants you to come",
          "went to a {x} game",
          "Go team!",
          "I don't like sports",
          ["Home team wins", "What a game"],
          ["You caught a foul ball!", "You ended up on the kiss cam."],
          0,
          ["baseball", "basketball", "football", "hockey", "soccer"],
        ],
        [
          "Coffee Catch-Up",
          "hang/coffee.png",
          [16, 95],
          "wants to grab coffee and catch up",
          "grabbed coffee and caught up",
          "Sounds good",
          "I don't have time",
          ["Spill the tea", "Good chat"],
          ["You talked for three hours.", "{He} told you some juicy gossip."],
        ],
        [
          "Laser Tag",
          "hang/lasertag.png",
          [7, 30],
          "wants to play laser tag with you",
          "played laser tag",
          "Pew pew!",
          "No thanks",
          ["Target acquired", "Direct hit"],
          ["You came in first place.", "A ten-year-old destroyed you both."],
        ],
        [
          "Fishing Trip",
          "hang/fishing.png",
          [6, 90],
          "wants to go fishing with you",
          "went fishing",
          "Grab the poles",
          "Too boring",
          ["Big catch", "Reel good time"],
          ["You caught a huge bass.", "You caught nothing but an old boot."],
        ],
        [
          "Pizza Party",
          "hang/pizza.png",
          [6, 40],
          "is throwing a pizza party and invites you",
          "went to a pizza party",
          "I'm there!",
          "Pass",
          ["Slice of life", "Extra cheese"],
          ["You ate eight slices.", "Someone ordered pineapple pizza and started a debate."],
        ],
        [
          "Zoo Trip",
          "hang/zoo.png",
          [5, 80],
          "wants to go to the zoo with you",
          "went to the zoo",
          "Wild!",
          "Not today",
          ["Animal kingdom", "Wild time"],
          ["A monkey threw something at you.", "You watched the penguins for an hour."],
        ],
        [
          "Golf Outing",
          "hang/golf.png",
          [25, 90],
          "wants to play a round of golf with you",
          "played a round of golf",
          "Fore!",
          "Not my sport",
          ["Hole in one", "On the green"],
          ["You lost six balls in the pond.", "{He} hit a hole in one!"],
        ],
        [
          "Surf Lesson",
          "hang/surf.png",
          [14, 50],
          "wants to take a surfing lesson with you",
          "took a surfing lesson",
          "Cowabunga!",
          "I can barely swim",
          ["Hang ten", "Totally tubular"],
          ["You stood up on your first try!", "You swallowed half the ocean."],
          2,
        ],
      ];
      HANGOUTS.forEach(([e, t, [a, o], n, s, r, i, l, c, d = 0, u]) =>
        EVENTS.push({
          min: a,
          max: o,
          kind: "Friend",
          src: "hangout",
          t: e,
          again: 3,
          ok: () => frLive(25).length > 0,
          make() {
            const a = any(frLive(25)),
              o = prOf(a.g),
              h = u ? any(u) : "",
              p = a.best ? "best friend" : "friend",
              m = (e) =>
                e
                  .replace(/\{x\}/g, h)
                  .replace(/\{He\}/g, o.He)
                  .replace(/\{he\}/g, o.he)
                  .replace(/\{him\}/g, o.him)
                  .replace(/\{his\}/g, o.his);
            return {
              ...frCard(a),
              table: null,
              bars: null,
              iconSrc: t,
              title: e,
              desc: `Your ${p}, ${a.first}, ${m(n)}.<br><br>What will you do?`,
              choices: [
                [
                  r,
                  () => {
                    const e = rint(5, 100),
                      t = Math.max(5, Math.min(100, e + rint(-35, 35)));
                    frRel(a, Math.round((e + t) / 20) - 2),
                      fx({ Happiness: Math.round((e - 30) / 10), ...(d ? { Health: d } : {}) }, "");
                    const n = chance(0.7) ? `<br><br>${m(any(c))}` : "";
                    return {
                      msg: `My ${p}, ${a.first}, and I ${m(s)}.`,
                      title: any(e >= 35 ? l : ["Meh", "Could have been better", "Not my thing"]),
                      bars: joyBars(e, t, o),
                      text: `You and your ${p}, ${a.first}, ${m(s)}.${n}`,
                    };
                  },
                ],
                [
                  i,
                  () => (
                    frRel(a, -rint(2, 5)),
                    `I turned down my ${p}, ${a.first}'s, ${e.toLowerCase()} invitation.`
                  ),
                ],
              ],
            };
          },
        }),
      );
      const OLD_EV_DATA = [
          [
            2,
            4,
            "Rag Doll",
            "1f9f8",
            "Your Mother",
            "Your mother stitched you a rag doll from old flour sacks and buttons.",
            [
              ["Hug it tight", { Happiness: 8 }, "I hugged my new rag doll all day."],
              [
                "Chew on its button eye",
                { Happiness: 3, Health: -3 },
                "I chewed off the doll's button eye.",
                0.5,
                { Happiness: 4 },
                "I gnawed on the doll but the button held fast.",
              ],
            ],
          ],
          [
            2,
            4,
            "Muddy Puddle",
            "1f438",
            "The Weather",
            "A spring rain left a fine big mud puddle right by the porch steps.",
            [
              [
                "Stomp in it",
                { Happiness: 10, Looks: -3 },
                "I stomped in the puddle until Mother hollered.",
                0.6,
                { Happiness: 4, Health: -4 },
                "I splashed in the puddle and caught a chill.",
              ],
              ["Stay on the porch", {}, "I watched the puddle from the porch."],
            ],
          ],
          [
            2,
            5,
            "The Rooster",
            "1f414",
            "The Barnyard",
            "The big red rooster is strutting toward you with his feathers puffed up.",
            [
              [
                "Chase him",
                { Happiness: 6 },
                "I chased the rooster around the yard.",
                0.6,
                { Health: -4, Happiness: -5 },
                "The rooster chased me back and pecked my leg.",
              ],
              ["Run to Mother", { Happiness: -2 }, "I ran crying to Mother's apron."],
              ["Offer him corn", { Happiness: 4 }, "I tossed the rooster some corn and he forgot me."],
            ],
          ],
          [
            2,
            5,
            "New Puppy",
            "1f415",
            "The Barn",
            "The farm dog had puppies in the barn and one keeps licking your face.",
            [
              ["Name the puppy", { Happiness: 10 }, "I named the puppy and followed it everywhere."],
              ["Pull its tail", { Happiness: -3, Health: -2 }, "I pulled the puppy's tail and got nipped."],
            ],
          ],
          [
            3,
            5,
            "Little Cousin",
            "1f476",
            "child",
            "Your baby cousin {n} is visiting and keeps grabbing your toys.",
            [
              [
                "Share with {him}",
                { Happiness: 3, friend: 1 },
                "I let little {n} play with my wooden blocks.",
              ],
              ["Snatch them back", { Happiness: 2, Respect: -2 }, "I snatched my blocks back from {n}."],
            ],
          ],
          [
            3,
            5,
            "Thunderstorm",
            "1f47b",
            "The Weather",
            "A loud thunderstorm is shaking the windows of the farmhouse tonight.",
            [
              ["Hide under the quilt", { Happiness: -2 }, "I hid under the quilt until the thunder passed."],
              ["Climb into Mother's bed", { Happiness: 4 }, "I crawled into Mother's bed and felt safe."],
              [
                "Watch the lightning",
                { Happiness: 3, Smarts: 2 },
                "I watched the lightning flash over the fields.",
              ],
            ],
          ],
          [
            4,
            6,
            "Loose Tooth",
            "1f9b7",
            "Your Father",
            "Your front tooth is wobbly, and Father wants to tie a string to it and the door.",
            [
              [
                "Let him yank it",
                { Health: -2, Happiness: 3 },
                "Father yanked my tooth out with a string and a slammed door.",
              ],
              ["Wiggle it yourself", { Happiness: 1 }, "I wiggled my tooth loose on my own."],
            ],
          ],
          [
            4,
            7,
            "Barn Kittens",
            "1f408",
            "The Hayloft",
            "You found a litter of kittens hidden up in the hayloft.",
            [
              ["Play with them", { Happiness: 8 }, "I spent the afternoon playing with kittens in the hay."],
              [
                "Bring one inside",
                { Happiness: 5 },
                "I snuck a kitten into the house.",
                0.4,
                { Happiness: -4 },
                "I snuck a kitten inside and Mother sent it right back out.",
              ],
            ],
          ],
          [
            5,
            7,
            "First School Day",
            "1f3eb",
            "The Schoolmistress",
            "Today is your first day at the one-room schoolhouse, and the schoolmistress is pointing to the front bench.",
            [
              [
                "Sit up straight",
                { Smarts: 3, Respect: 2 },
                "I sat on the front bench and minded my manners.",
              ],
              ["Cry for Mother", { Happiness: -5 }, "I cried for Mother on my first day of school."],
              ["Wave at the big kids", { Happiness: 3 }, "I waved at the big kids in the back row."],
            ],
          ],
          [
            5,
            8,
            "Gathering Eggs",
            "1f95a",
            "Your Mother",
            "Mother handed you a basket and sent you to gather eggs from the henhouse.",
            [
              [
                "Gather them gently",
                { Respect: 2 },
                "I gathered every egg without cracking one.",
                0.7,
                { Happiness: -3 },
                "I tripped and broke half the eggs.",
              ],
              [
                "Juggle a few",
                { Happiness: 4, Respect: -2 },
                "I tried juggling eggs and made a sticky mess.",
              ],
            ],
          ],
          [
            5,
            9,
            "Hoop Rolling",
            "1f3c3",
            "peer",
            "{n} is racing an iron hoop down the lane with a stick and dares you to keep up.",
            [
              [
                "Race {him}",
                { Happiness: 7, Health: 2, friend: 1 },
                "I raced {n} down the lane rolling hoops.",
              ],
              ["Just watch", {}, "I watched {n} roll {his} hoop by."],
            ],
          ],
          [
            6,
            9,
            "Marbles Match",
            "1f3b2",
            "peer",
            "{n} wants to play marbles for keeps in the schoolyard dirt.",
            [
              [
                "Play for keeps",
                { Happiness: 6 },
                "I won a fine glass marble from {n}.",
                0.5,
                { Happiness: -5 },
                "I lost my best marble to {n}.",
              ],
              ["Play for fun", { Happiness: 4, friend: 1 }, "I shot marbles with {n} just for fun."],
            ],
          ],
          [
            6,
            10,
            "Slate Mishap",
            "1f4dd",
            "The Schoolmaster",
            "You dropped your writing slate and it cracked right down the middle.",
            [
              ["Tell the schoolmaster", { Respect: 2, Happiness: -2 }, "I owned up to cracking my slate."],
              [
                "Hide it in your desk",
                { Happiness: -1 },
                "I hid my cracked slate in my desk.",
                0.5,
                { Respect: -3 },
                "The schoolmaster found my cracked slate and scolded me.",
              ],
            ],
          ],
          [
            6,
            10,
            "Penny Candy",
            "1f36c",
            "The General Store",
            "You have a penny burning a hole in your pocket at the general store candy jar.",
            [
              ["Buy horehound drops", { Happiness: 5, money: -1 }, "I bought horehound drops with my penny."],
              [
                "Buy a licorice whip",
                { Happiness: 6, money: -1 },
                "I bought a licorice whip and made it last all day.",
              ],
              ["Save the penny", { money: 1 }, "I kept my penny in my pocket."],
            ],
          ],
          [
            6,
            11,
            "Spinning Tops",
            "1f3c5",
            "peer",
            "{n} brought a painted wooden top to school and says {his} spins the longest.",
            [
              [
                "Challenge {him}",
                { Happiness: 5 },
                "My top spun longer than {n}'s.",
                0.5,
                { Happiness: -2 },
                "My top wobbled and fell before {n}'s.",
              ],
              ["Ask to borrow it", { Happiness: 3, friend: 1 }, "{n} let me spin {his} top."],
            ],
          ],
          [
            6,
            11,
            "Measles",
            "1f912",
            "The Doctor",
            "You broke out in red spots and a fever, and the doctor says it is the measles.",
            [
              [
                "Rest in a dark room",
                { Health: -5, Happiness: -4 },
                "I lay in a dark room for weeks with the measles.",
              ],
              [
                "Try the peddler's tonic",
                { Health: -8, Happiness: -3 },
                "I drank a foul tonic and felt even worse.",
                0.3,
                { Health: -2 },
                "I drank a tonic and somehow pulled through quickly.",
              ],
            ],
          ],
          [
            6,
            12,
            "McGuffey Reader",
            "1f4da",
            "The Schoolmistress",
            "The schoolmistress wants you to read a lesson aloud from the McGuffey Reader.",
            [
              [
                "Read it proudly",
                { Smarts: 4, Respect: 2 },
                "I read my McGuffey lesson without a stumble.",
                0.6,
                { Happiness: -3 },
                "I stumbled over the big words and the class giggled.",
              ],
              ["Mumble through it", { Smarts: 1, Respect: -1 }, "I mumbled through my reading lesson."],
            ],
          ],
          [
            6,
            12,
            "Hauling Water",
            "1fa99",
            "Your Father",
            "Father says you must haul two buckets of water from the well before breakfast.",
            [
              ["Haul them", { Health: 3, Respect: 2 }, "I hauled water from the well before breakfast."],
              ["Grumble and spill", { Happiness: -3, Respect: -2 }, "I grumbled and spilled half the water."],
            ],
          ],
          [
            6,
            12,
            "Swimming Hole",
            "1f3ca",
            "peer",
            "{n} is heading to the swimming hole at the creek and asks if you want to come.",
            [
              [
                "Jump right in",
                { Happiness: 8, Health: 2, friend: 1 },
                "I swam at the creek with {n} all afternoon.",
                0.8,
                { Health: -6 },
                "I swallowed creek water and came home sick.",
              ],
              ["Stay home and do chores", { Respect: 2 }, "I stayed home and finished my chores."],
            ],
          ],
          [
            6,
            12,
            "Kite Flying",
            "1fa81",
            "The Weather",
            "A good stiff wind is blowing across the meadow, perfect for your paper kite.",
            [
              [
                "Fly it high",
                { Happiness: 7 },
                "I flew my kite high above the meadow.",
                0.7,
                { Happiness: -4 },
                "My kite snagged in an oak tree and tore.",
              ],
              [
                "Make a longer tail",
                { Smarts: 2, Happiness: 4 },
                "I tied a longer rag tail and my kite flew steady.",
              ],
            ],
          ],
          [
            7,
            10,
            "Dunce Cap",
            "1f3a9",
            "The Schoolmaster",
            "You forgot your times tables and the schoolmaster is reaching for the dunce cap.",
            [
              [
                "Wear it quietly",
                { Happiness: -5, Respect: -2 },
                "I sat in the corner wearing the dunce cap.",
              ],
              [
                "Beg for another try",
                { Smarts: 2 },
                "I begged for another try and got the answer right.",
                0.5,
                { Happiness: -6 },
                "I begged for another try, failed, and wore the dunce cap anyway.",
              ],
            ],
          ],
          [
            7,
            11,
            "Jacks Contest",
            "2b50",
            "peer",
            "{n} challenges you to a game of jacks on the schoolhouse steps.",
            [
              [
                "Play your best",
                { Happiness: 5, friend: 1 },
                "I beat {n} at jacks on the steps.",
                0.5,
                { Happiness: 2, friend: 1 },
                "{n} beat me at jacks, but we had fun.",
              ],
              ["Say jacks are silly", { Respect: -2 }, "I told {n} jacks were silly."],
            ],
          ],
          [
            7,
            11,
            "Sunday School",
            "26ea",
            "The Preacher",
            "The preacher asks you to recite a Bible verse in front of the whole Sunday school.",
            [
              [
                "Recite it",
                { Respect: 3, Smarts: 2 },
                "I recited my verse in Sunday school.",
                0.7,
                { Happiness: -3 },
                "I forgot my verse halfway through.",
              ],
              ["Pretend to have a cough", { Respect: -2 }, "I faked a cough to get out of reciting."],
            ],
          ],
          [
            7,
            12,
            "Churning Butter",
            "1f9c8",
            "Your Mother",
            "Mother sets the butter churn in front of you and says not to stop until it turns.",
            [
              ["Churn steadily", { Health: 2, Respect: 2 }, "I churned until the butter came."],
              [
                "Sneak off to play",
                { Happiness: 4, Respect: -3 },
                "I sneaked off from the butter churn.",
                0.4,
                { Happiness: -5 },
                "Mother caught me sneaking off and gave me extra chores.",
              ],
            ],
          ],
          [
            7,
            12,
            "Sick Sister",
            "1f630",
            "Your Mother",
            "Your little sister has scarlet fever, and Mother says to keep away from the sickroom.",
            [
              [
                "Pray for her",
                { Happiness: -3, Respect: 2 },
                "I said my prayers every night for my little sister.",
              ],
              ["Leave her a drawing", { Happiness: -1 }, "I left a drawing outside my sister's door."],
              [
                "Sneak in to see her",
                { Happiness: 2, Health: -6 },
                "I sneaked in to see my sister and caught a fever.",
                0.5,
                { Happiness: 3 },
                "I sneaked in to see my sister and she smiled at me.",
              ],
            ],
          ],
          [
            7,
            12,
            "Schoolyard Bully",
            "1f621",
            "peer",
            "{n} snatched your lunch pail and is laughing about it.",
            [
              [
                "Fight {him}",
                { Respect: 3, Health: -3 },
                "I fought {n} and got my lunch pail back.",
                0.5,
                { Health: -5, Happiness: -4 },
                "I fought {n} and got a bloody nose.",
              ],
              ["Tell the schoolmistress", { Respect: -1 }, "I told on {n} to the schoolmistress."],
              ["Let {him} have it", { Happiness: -4, Health: -1 }, "I went hungry while {n} ate my lunch."],
            ],
          ],
          [
            7,
            12,
            "Traveling Peddler",
            "1f48a",
            "Traveling Peddler",
            "A peddler with a painted wagon offers you a bottle of miracle tonic for ten cents.",
            [
              [
                "Buy a bottle",
                { money: -10, Health: -3 },
                "I bought the peddler's tonic and it tasted like turpentine.",
              ],
              [
                "Buy a tin whistle instead",
                { money: -5, Happiness: 5 },
                "I bought a tin whistle from the peddler.",
              ],
              ["Walk on by", {}, "I walked past the peddler's wagon."],
            ],
          ],
          [
            7,
            13,
            "Sledding Hill",
            "1f6f7",
            "peer",
            "Fresh snow covers the big hill, and {n} has a homemade sled built for two.",
            [
              [
                "Ride with {him}",
                { Happiness: 8, friend: 1 },
                "I flew down the hill on {n}'s sled.",
                0.75,
                { Health: -6 },
                "We crashed into a fence post at the bottom.",
              ],
              ["Build a snow fort instead", { Happiness: 5 }, "I built a snow fort by the hill."],
            ],
          ],
          [
            7,
            13,
            "Fishing Trip",
            "1f3a3",
            "Your Grandfather",
            "Grandfather is going down to the river with cane poles and a can of worms.",
            [
              [
                "Go fishing",
                { Happiness: 6, Smarts: 1 },
                "I caught a fat catfish with Grandfather.",
                0.5,
                { Happiness: 3 },
                "I caught nothing but enjoyed Grandfather's stories.",
              ],
              ["Stay and play", {}, "I stayed home instead of fishing."],
            ],
          ],
          [
            8,
            11,
            "Haunted House",
            "1f383",
            "peer",
            "{n} dares you to touch the door of the old abandoned house on the hill at dusk.",
            [
              [
                "Take the dare",
                { Happiness: 5, Respect: 3 },
                "I touched the old house door and ran like the wind.",
                0.7,
                { Happiness: -5 },
                "Something moaned inside and I ran home crying.",
              ],
              ["Refuse", { Respect: -2 }, "I refused the dare and {n} called me a chicken."],
            ],
          ],
          [
            8,
            12,
            "Spelling Bee",
            "1f41d",
            "The Schoolmaster",
            'The schoolhouse spelling bee is down to you and one other pupil, and your word is "rhinoceros."',
            [
              [
                "Spell it slowly",
                { Smarts: 4, Happiness: 6, Respect: 3 },
                "I spelled rhinoceros and won the spelling bee.",
                0.5,
                { Happiness: -3 },
                "I missed one letter and lost the spelling bee.",
              ],
              [
                "Guess quickly",
                { Smarts: 1 },
                "I rattled it off and hoped for the best.",
                0.3,
                { Happiness: -4 },
                "I guessed wrong and sat down red-faced.",
              ],
            ],
          ],
          [
            8,
            12,
            "Chopping Kindling",
            "1fa93",
            "Your Father",
            "Father hands you the hatchet and points at the woodpile for kindling.",
            [
              ["Chop with care", { Health: 2, Respect: 2 }, "I chopped a fine pile of kindling."],
              [
                "Hurry through it",
                { Respect: 1 },
                "I hurried through the woodpile.",
                0.6,
                { Health: -6 },
                "I hurried and nicked my thumb with the hatchet.",
              ],
            ],
          ],
          [
            8,
            12,
            "County Fair",
            "1f3aa",
            "The County Fair",
            "The county fair is in town with prize pigs, pie contests, and a man who swallows fire.",
            [
              [
                "See the fire swallower",
                { Happiness: 7, money: -5 },
                "I paid five cents to watch the fire swallower.",
              ],
              [
                "Enter the sack race",
                { Happiness: 5, Health: 2 },
                "I won a ribbon in the sack race.",
                0.4,
                { Happiness: 2, Looks: -2 },
                "I tumbled in the sack race but laughed anyway.",
              ],
              ["Look at the livestock", { Smarts: 2 }, "I studied the prize hogs and cattle."],
            ],
          ],
          [
            8,
            12,
            "Fourth of July",
            "1f386",
            "The Town Square",
            "The town is celebrating the Fourth of July with a brass band, speeches, and firecrackers.",
            [
              [
                "Light a firecracker",
                { Happiness: 7 },
                "I lit a firecracker and it popped grand.",
                0.75,
                { Health: -5 },
                "A firecracker went off too soon and singed my fingers.",
              ],
              [
                "Listen to the speeches",
                { Smarts: 2, Respect: 1 },
                "I listened to the long patriotic speeches.",
              ],
              [
                "Eat at the picnic",
                { Happiness: 5, Health: 1 },
                "I ate fried chicken and pie at the picnic.",
              ],
            ],
          ],
          [
            8,
            13,
            "Milking Time",
            "1f404",
            "The Barn",
            "Old Bessie the cow is mooing to be milked, and it is your turn.",
            [
              [
                "Milk her",
                { Respect: 2 },
                "I milked Bessie and filled the pail.",
                0.7,
                { Happiness: -3 },
                "Bessie kicked over the pail and splashed me.",
              ],
              [
                "Squirt milk at the cat",
                { Happiness: 5 },
                "I squirted milk at the barn cat and it lapped it up.",
              ],
            ],
          ],
          [
            8,
            13,
            "Railroad Arrives",
            "1f682",
            "The Town",
            "The new railroad line has reached town, and the first locomotive is chugging into the depot.",
            [
              [
                "Run to see it",
                { Happiness: 8, Smarts: 2 },
                "I ran to the depot and saw the first train come in.",
              ],
              [
                "Put a penny on the rail",
                { Happiness: 5, money: -1 },
                "I put a penny on the rail and the train flattened it.",
              ],
              ["Stay away from the noise", {}, "I stayed home while the whole town went to the depot."],
            ],
          ],
          [
            8,
            13,
            "The Switch",
            "1f4cf",
            "The Schoolmaster",
            "The schoolmaster caught you dipping a girl's braid in the inkwell and is reaching for his switch.",
            [
              [
                "Take your punishment",
                { Health: -3, Respect: 1 },
                "I took my licks from the schoolmaster's switch.",
              ],
              [
                "Blame the boy behind you",
                { Respect: -3 },
                "I blamed the boy behind me.",
                0.4,
                { Health: -4, Respect: -4 },
                "Nobody believed me and I got double the licks.",
              ],
              [
                "Apologize to her",
                { Respect: 2, Health: -2 },
                "I apologized and still got a light switching.",
              ],
            ],
          ],
          [
            9,
            13,
            "Harvest Time",
            "1f33e",
            "Your Father",
            "It is harvest time and every hand is needed in the wheat fields from sunup to sundown.",
            [
              [
                "Work the whole day",
                { Health: 2, Respect: 3, Happiness: -2 },
                "I worked the harvest from dawn to dusk.",
              ],
              [
                "Sneak a nap in the shade",
                { Happiness: 4, Respect: -3 },
                "I napped under a haystack during harvest.",
              ],
            ],
          ],
          [
            9,
            13,
            "Hard Winter",
            "1f525",
            "The Weather",
            "A brutal winter has buried the farm in snow, and the family is burning the last of the firewood.",
            [
              [
                "Help chop more wood",
                { Health: 2, Respect: 3 },
                "I helped chop wood through the hard winter.",
              ],
              ["Huddle by the stove", { Happiness: -3, Health: -2 }, "I huddled by the stove all winter."],
            ],
          ],
          [
            9,
            13,
            "Telegram Boy",
            "1f4dc",
            "The Telegraph Office",
            "The telegraph clerk needs a quick boy or girl to run a telegram across town for two cents.",
            [
              ["Run it", { money: 2, Health: 1 }, "I ran a telegram across town and earned two cents."],
              [
                "Read it on the way",
                { money: 2, Smarts: 1, Respect: -2 },
                "I peeked at the telegram before delivering it.",
              ],
            ],
          ],
          [
            9,
            14,
            "Steamboat",
            "1f6a2",
            "The River Landing",
            "A big paddlewheel steamboat has docked at the landing, blowing its whistle.",
            [
              [
                "Sneak aboard",
                { Happiness: 7 },
                "I snuck aboard the steamboat and explored the decks.",
                0.5,
                { Respect: -3, Happiness: -3 },
                "A deckhand caught me and tossed me off the boat.",
              ],
              ["Wave from the dock", { Happiness: 4 }, "I waved at the steamboat passengers from the dock."],
            ],
          ],
          [
            9,
            14,
            "Recitation Day",
            "1f3ad",
            "The Schoolmistress",
            "Parents are coming to the schoolhouse to hear each pupil recite a poem.",
            [
              [
                "Recite with feeling",
                { Respect: 4, Smarts: 2 },
                "I recited my poem and the parents clapped.",
                0.6,
                { Happiness: -4 },
                "My voice cracked and I forgot the last verse.",
              ],
              ["Recite it fast", { Smarts: 1 }, "I rattled off my poem as fast as I could."],
            ],
          ],
          [
            9,
            14,
            "Orchard Raid",
            "1f34e",
            "peer",
            "{n} wants to sneak into Farmer Brown's orchard and fill your shirts with apples.",
            [
              [
                "Go with {him}",
                { Happiness: 6, friend: 1 },
                "I raided Farmer Brown's orchard with {n}.",
                0.6,
                { Respect: -4, Happiness: -4 },
                "Farmer Brown chased us off with a pitchfork.",
              ],
              ["Say no", { Respect: 1 }, "I told {n} stealing apples was wrong."],
            ],
          ],
          [
            10,
            14,
            "Newsboy Work",
            "1f4f0",
            "The Newspaper Office",
            "The newspaper office is hiring newsboys to hawk the evening edition on the street corner.",
            [
              ["Sell papers", { money: 15, Health: -1 }, 'I hollered "Extra!" and sold a stack of papers.'],
              ["Turn it down", {}, "I passed on selling newspapers."],
            ],
          ],
          [
            10,
            15,
            "Barn Dance",
            "1f3bb",
            "The Neighbors",
            "The neighbors are throwing a barn dance with a fiddler and lanterns hung from the rafters.",
            [
              ["Dance a reel", { Happiness: 8, Looks: 1 }, "I danced a reel at the barn dance."],
              ["Stand by the cider", { Happiness: 3 }, "I stood by the cider barrel and watched."],
              [
                "Ask the fiddler to teach you",
                { Smarts: 2, Happiness: 4 },
                "The fiddler showed me a few notes.",
              ],
            ],
          ],
          [
            11,
            15,
            "Mill Work",
            "1f9f5",
            "The Mill Foreman",
            "The cotton mill foreman says he will pay you a dollar a week to tend the spindles.",
            [
              [
                "Take the job",
                { money: 100, Health: -5, Happiness: -3 },
                "I worked long hours at the cotton mill.",
              ],
              ["Stay in school", { Smarts: 3 }, "I turned down the mill and stayed in school."],
            ],
          ],
          [
            12,
            15,
            "Love Letter",
            "1f48c",
            "peer",
            '{n} slipped a folded letter into your McGuffey Reader that says "Will you walk with me after church?"',
            [
              ["Write back yes", { Happiness: 8, friend: 1 }, "I wrote {n} back and said yes."],
              [
                "Show it to your friends",
                { Respect: -3, Happiness: 3 },
                "I showed {n}'s letter around and {he} was mortified.",
              ],
              ["Pretend you never saw it", {}, "I tucked {n}'s letter away and said nothing."],
            ],
          ],
          [
            12,
            16,
            "Apprenticeship Offer",
            "1f528",
            "The Blacksmith",
            "The village blacksmith says he needs an apprentice and thinks you have strong arms.",
            [
              ["Take it", { Health: 3, Smarts: 2, Respect: 3 }, "I became the blacksmith's apprentice."],
              [
                "Ask for pay",
                { money: 25, Respect: 1 },
                "I asked for wages and the blacksmith agreed.",
                0.5,
                { Respect: -2 },
                "The blacksmith laughed at my asking for wages.",
              ],
              ["Decline", {}, "I turned down the blacksmith."],
            ],
          ],
          [
            12,
            16,
            "Sewing Circle",
            "1f457",
            "Your Aunt",
            "Your aunt invites you to her quilting and sewing circle with the ladies of the church.",
            [
              [
                "Join the circle",
                { Smarts: 2, Respect: 2 },
                "I stitched quilt squares with the church ladies.",
              ],
              ["Listen for gossip", { Happiness: 4 }, "I heard all the town gossip at the sewing circle."],
              ["Make an excuse", { Respect: -1 }, "I made an excuse to skip the sewing circle."],
            ],
          ],
          [
            12,
            16,
            "Tobacco Dare",
            "1f480",
            "peer",
            "{n} has a plug of chewing tobacco and dares you to take a bite behind the woodshed.",
            [
              [
                "Take a chaw",
                { Health: -4, Respect: 2 },
                "I chewed tobacco and turned green as a frog.",
                0.4,
                { Respect: 4 },
                "I chewed tobacco without flinching and {n} was impressed.",
              ],
              ["Refuse", { Respect: -1, Health: 1 }, "I refused {n}'s tobacco."],
            ],
          ],
          [
            13,
            17,
            "Church Social",
            "1f967",
            "The Church",
            "The church is holding a pie social, and the pies are auctioned so bidders can share them with the bakers.",
            [
              [
                "Bid on a pie",
                { money: -20, Happiness: 7 },
                "I won a pie at auction and shared it with its baker.",
              ],
              [
                "Bake a pie yourself",
                { Smarts: 1, Respect: 3 },
                "I baked a pie for the church social.",
                0.6,
                { Happiness: -3 },
                "My pie came out burnt on the bottom.",
              ],
              ["Just enjoy the singing", { Happiness: 3 }, "I listened to the hymn singing at the social."],
            ],
          ],
          [
            13,
            17,
            "Sweetheart",
            "1f483",
            "peer",
            "{n} asked to escort you home from the singing school, carrying a lantern.",
            [
              ["Walk with {him}", { Happiness: 9, friend: 1 }, "I walked home with {n} under the stars."],
              [
                "Bring your brother along",
                { Happiness: 3, Respect: 2 },
                "I let {n} walk me home, with my brother tagging along.",
              ],
              ["Turn {him} down", {}, "I politely turned {n} down."],
            ],
          ],
          [
            14,
            17,
            "Run Away West",
            "1f40e",
            "peer",
            "{n} wants to run away out West and join a cattle drive, and asks you to come.",
            [
              ["Talk {him} out of it", { Respect: 2, friend: 1 }, "I talked {n} out of running away."],
              [
                "Pack your bag",
                { Happiness: 5, Respect: -4 },
                "I packed a bag to run away with {n}.",
                0.3,
                { Happiness: -6 },
                "Father caught me at the crossroads and marched me home.",
              ],
            ],
          ],
          [
            14,
            17,
            "Store Clerk",
            "1f3ea",
            "The Storekeeper",
            "The general store owner needs help stocking shelves and weighing out flour and sugar.",
            [
              [
                "Work the counter",
                { money: 50, Smarts: 2 },
                "I clerked at the general store for the season.",
              ],
              ["Ask for a discount instead", { Happiness: 3 }, "I traded my work for store goods."],
              ["Decline", {}, "I turned down the storekeeper."],
            ],
          ],
          [
            15,
            17,
            "Teaching School",
            "1f514",
            "The School Board",
            "The school board needs someone to teach the little ones at the country schoolhouse for the summer term.",
            [
              [
                "Take the post",
                { Smarts: 4, Respect: 4, money: 300 },
                "I taught the summer term at the country schoolhouse.",
                0.7,
                { Happiness: -5, Respect: -2 },
                "The big boys ran wild and I quit within a month.",
              ],
              ["Decline", {}, "I turned down the teaching post."],
            ],
          ],
          [
            18,
            30,
            "Barn Raising",
            "1f528",
            "peer",
            "{full} is swinging a hammer beside you at the neighbor's barn raising and keeps cracking jokes between beams.",
            [
              [
                "Share your lunch pail",
                { Happiness: 5, friend: 1 },
                "I shared my cornbread with {n} and we laughed until the foreman hollered.",
              ],
              ["Keep to your work", { Respect: 3 }, "I kept my head down and drove nails until sundown."],
            ],
          ],
          [
            18,
            35,
            "Church Supper",
            "26ea",
            "peer",
            "At the church social, {full} sits beside you on the bench and asks if you made the peach pie.",
            [
              [
                "Strike up a talk",
                { Happiness: 6, friend: 1 },
                "I talked with {n} through two hymns and a plate of pie.",
                0.8,
                { Happiness: -2 },
                "I tried talking with {n}, but the parson's wife kept interrupting.",
              ],
              ["Nod politely", {}, "I nodded politely and went back to my pie."],
            ],
          ],
          [
            20,
            45,
            "Saloon Stranger",
            "1f37a",
            "adult",
            "A traveling man named {full} buys you a whiskey at the saloon and asks where a fellow can find honest work.",
            [
              [
                "Point the way",
                { Happiness: 4, friend: 1, Respect: 2 },
                "I told {n} about the mill hiring hands and we drank to {his} luck.",
              ],
              ["Drink and leave", { Health: -2 }, "I drank the whiskey and left without a word."],
              ["Refuse the drink", { Respect: 1 }, "I refused the whiskey and went home sober."],
            ],
          ],
          [
            25,
            60,
            "Quilting Bee",
            "1f9f5",
            "peer",
            "{full} pulls up a chair at the quilting bee and admires your stitching.",
            [
              [
                "Swap patterns",
                { Happiness: 5, Smarts: 2, friend: 1 },
                "I swapped quilt patterns with {n} and promised to visit {him} come spring.",
              ],
              [
                "Gossip instead",
                { Happiness: 3, Respect: -2 },
                "I spent the bee gossiping about the miller's daughter.",
              ],
            ],
          ],
          [
            18,
            40,
            "Stagecoach Seat",
            "1f40e",
            "peer",
            "{full} shares a cramped stagecoach seat with you on the long road east.",
            [
              [
                "Pass the miles talking",
                { Happiness: 6, friend: 1 },
                "I talked with {n} for three hundred bumpy miles and made a true friend.",
              ],
              ["Pretend to sleep", { Health: 2 }, "I pretended to sleep the whole way."],
            ],
          ],
          [
            40,
            80,
            "Old Veteran",
            "1f396-fe0f",
            "elder",
            "{full}, an old soldier with a wooden leg, sits on the porch of the general store telling war stories.",
            [
              [
                "Listen a while",
                { Smarts: 4, friend: 1 },
                "I listened to {n} tell of old battles and came back the next day for more.",
              ],
              [
                "Buy him tobacco",
                { money: -25, Happiness: 4, friend: 1, Respect: 3 },
                "I bought {n} a plug of tobacco and earned a friend for life.",
              ],
              ["Walk on by", {}, "I tipped my hat and walked on."],
            ],
          ],
          [
            30,
            70,
            "Horse Trader",
            "1f40e",
            "adult",
            "{full}, a horse trader with a silver tooth, offers to sell you a fine mare cheap.",
            [
              [
                "Buy the mare",
                { money: -3e3, Happiness: 8, friend: 1 },
                "I bought the mare from {n} and she proved a fine animal.",
                0.5,
                { money: -3e3, Happiness: -8 },
                "I bought the mare from {n} and she went lame within a week.",
              ],
              [
                "Haggle all day",
                { Smarts: 2, friend: 1 },
                "I haggled with {n} until dark, bought nothing, and we parted friends.",
              ],
              ["Send him off", {}, "I sent the horse trader on his way."],
            ],
          ],
          [
            18,
            50,
            "Boarding House",
            "1f3e8",
            "peer",
            "A new boarder, {full}, moves into the room across the hall and knocks to borrow a candle.",
            [
              [
                "Lend the candle",
                { Happiness: 4, friend: 1 },
                "I lent {n} a candle and we talked by its light until midnight.",
              ],
              ["Keep the door shut", {}, "I pretended not to hear the knock."],
            ],
          ],
          [
            50,
            95,
            "Rocking Chairs",
            "1fa91",
            "elder",
            "{full} rocks in the chair beside yours on the porch of the general store.",
            [
              [
                "Talk about old times",
                { Happiness: 6, friend: 1 },
                "I rocked with {n} all afternoon talking about the old days.",
              ],
              ["Doze off", { Health: 2 }, "I dozed off in my rocking chair."],
            ],
          ],
          [
            20,
            55,
            "Railroad Crew",
            "1f682",
            "peer",
            "{full} works beside you laying railroad track and saves you from a falling tie.",
            [
              [
                "Thank {him} properly",
                { Happiness: 5, friend: 1, Respect: 2 },
                "I bought {n} supper to thank {him} and we have been friends ever since.",
              ],
              ["Grunt your thanks", {}, "I grunted my thanks and kept swinging the hammer."],
            ],
          ],
          [
            25,
            70,
            "Revival Tent",
            "1f64f",
            "adult",
            "At the revival meeting, {full} weeps beside you and grabs your hand when the preacher shouts.",
            [
              [
                "Pray with {him}",
                { Happiness: 4, Respect: 3, friend: 1 },
                "I prayed with {n} and walked {him} home after the meeting.",
              ],
              [
                "Slip out the back",
                { Respect: -2 },
                "I slipped out of the tent before the collection plate came round.",
              ],
            ],
          ],
          [
            30,
            75,
            "Fishing Hole",
            "1f3a3",
            "peer",
            "{full} is already sitting at your favorite fishing hole when you arrive.",
            [
              [
                "Share the bank",
                { Happiness: 5, friend: 1 },
                "I fished beside {n} all morning and we split a fine string of catfish.",
              ],
              ["Find another spot", {}, "I grumbled and found another spot downstream."],
            ],
          ],
          [
            18,
            28,
            "Courting Call",
            "1f490",
            "Local Suitor",
            "A nervous young suitor arrives at your door with wildflowers, hat in hand, asking permission to call on you.",
            [
              [
                "Allow the visit",
                { Happiness: 8 },
                "I allowed the suitor to sit with me in the parlor, chaperoned of course.",
              ],
              ["Send them off", { Respect: 2 }, "I sent the suitor away with polite regrets."],
            ],
          ],
          [
            18,
            30,
            "Harvest Dance",
            "1f3bb",
            "The Fiddler",
            "The fiddler strikes up a reel at the harvest barn dance and everyone grabs a partner.",
            [
              [
                "Dance the reel",
                { Happiness: 8, Health: 2 },
                "I danced the Virginia reel until my feet ached.",
              ],
              [
                "Stand by the wall",
                { Happiness: -2 },
                "I stood by the wall drinking cider while others danced.",
              ],
            ],
          ],
          [
            20,
            35,
            "Wedding Banns",
            "1f492",
            "The Parson",
            "The parson reads the wedding banns of your childhood sweetheart to another person.",
            [
              [
                "Object loudly",
                { Respect: -6, Happiness: -3 },
                "I stood up and objected in church, and the whole town talked of it for months.",
              ],
              [
                "Hold your tongue",
                { Happiness: -5 },
                "I held my tongue and wished them well through gritted teeth.",
              ],
            ],
          ],
          [
            18,
            40,
            "Factory Shift",
            "1f3ed",
            "The Foreman",
            "The mill foreman demands you work a fourteen-hour shift with no extra pay.",
            [
              ["Work the shift", { money: 150, Health: -6 }, "I worked the long shift until my hands bled."],
              [
                "Refuse",
                { Respect: 3 },
                "I refused the extra shift.",
                0.5,
                { money: -200, Respect: 3 },
                "I refused the extra shift and was docked a week's wages.",
              ],
            ],
          ],
          [
            20,
            50,
            "Mill Strike",
            "270a",
            "Union Men",
            "The mill hands are walking out on strike for a ten-hour day and want you to join them.",
            [
              [
                "Join the strike",
                { Respect: 5, money: -400 },
                "I walked out with the strikers and went hungry for the cause.",
                0.6,
                { Respect: 3, money: -1200 },
                "I joined the strike, and the owners locked us out for a month.",
              ],
              [
                "Cross the line",
                { money: 300, Respect: -8 },
                "I crossed the picket line and was called a scab.",
              ],
            ],
          ],
          [
            18,
            45,
            "Gold Fever",
            "26cf-fe0f",
            "Gold Seeker",
            "Word comes of gold in California, and a wagon party is leaving at dawn.",
            [
              [
                "Join the rush",
                { money: 5e3, Happiness: 10 },
                "I struck a fine vein of gold in the hills.",
                0.2,
                { money: -2e3, Health: -10 },
                "I went West for gold and came back thin and broke.",
              ],
              ["Stay home", {}, "I stayed home and minded my work."],
            ],
          ],
          [
            20,
            50,
            "Wagon West",
            "1f6de",
            "Wagon Master",
            "A wagon master is gathering families for the Oregon Trail and has one berth left.",
            [
              [
                "Sign on",
                { Happiness: 8, Health: -5 },
                "I signed on for the long trail West and saw the great plains.",
              ],
              ["Decline", {}, "I declined and stayed in the settled country."],
            ],
          ],
          [
            25,
            60,
            "Snake Oil",
            "1f9ea",
            "Medicine Show",
            "A medicine show man swears his elixir cures rheumatism, baldness and heartache.",
            [
              [
                "Buy a bottle",
                { money: -100, Health: -3 },
                "I bought a bottle of snake oil and it tasted of turpentine.",
                0.3,
                { money: -100, Happiness: 5 },
                "I bought the elixir and somehow felt better for a week.",
              ],
              [
                "Heckle him",
                { Respect: 3, Happiness: 3 },
                "I heckled the snake-oil man off his wagon to the crowd's delight.",
              ],
            ],
          ],
          [
            18,
            70,
            "Circus Comes",
            "1f3aa",
            "Traveling Circus",
            "A traveling circus has pitched its tent outside town, with an elephant and a strongman.",
            [
              [
                "Buy a ticket",
                { money: -50, Happiness: 8 },
                "I saw the elephant and the strongman at the circus.",
              ],
              [
                "Peek under the tent",
                { Happiness: 4, Respect: -2 },
                "I peeked under the tent flap until a clown chased me off.",
              ],
            ],
          ],
          [
            20,
            80,
            "Cholera Outbreak",
            "1f912",
            "Town Doctor",
            "Cholera has broken out in town and the doctor warns everyone to boil their water.",
            [
              [
                "Boil every drop",
                { Health: 3, Smarts: 2 },
                "I boiled every drop of water and stayed well through the outbreak.",
              ],
              [
                "Drink from the well",
                { Health: -12 },
                "I drank from the town well and fell terribly ill.",
                0.5,
                {},
                "I drank from the well and somehow came through untouched.",
              ],
            ],
          ],
          [
            30,
            90,
            "Leeches",
            "1f48a",
            "Town Doctor",
            "The doctor says your fever calls for a good bleeding with leeches.",
            [
              [
                "Allow the leeches",
                { Health: -4, money: -100 },
                "I let the doctor apply leeches and felt weaker for it.",
              ],
              ["Refuse and rest", { Health: 3 }, "I refused the leeches and rested in bed with broth."],
            ],
          ],
          [
            25,
            70,
            "Yellow Fever",
            "1f912",
            "The Weather",
            "A hot, wet summer brings yellow fever up the river from the port towns.",
            [
              [
                "Flee to the hills",
                { money: -500, Health: 4 },
                "I fled to the hills until the fever season passed.",
              ],
              [
                "Stay and nurse the sick",
                { Respect: 8, Health: -8 },
                "I stayed and nursed the sick, and the town will not forget it.",
              ],
            ],
          ],
          [
            20,
            75,
            "A Telegram",
            "2709-fe0f",
            "Telegraph Office",
            "A boy runs up from the telegraph office with a telegram addressed to you.",
            [
              [
                "Open it at once",
                { Happiness: 6 },
                "I opened the telegram and it was good news from my cousin back East.",
                0.6,
                { Happiness: -8 },
                "I opened the telegram and it told of a death in the family.",
              ],
              [
                "Tip the boy",
                { money: -10, Respect: 2 },
                "I tipped the telegraph boy a dime before reading.",
              ],
            ],
          ],
          [
            18,
            90,
            "Letter by Post",
            "1f48c",
            "The Postmaster",
            "The postmaster hands you a letter, the first in months, with postage due.",
            [
              [
                "Pay the postage",
                { money: -25, Happiness: 5 },
                "I paid the postage and read the letter by the stove three times over.",
              ],
              [
                "Refuse it",
                { Happiness: -3 },
                "I refused to pay the postage and the letter went back unread.",
              ],
            ],
          ],
          [
            25,
            65,
            "Stagecoach Robbery",
            "1f52b",
            "Road Agents",
            "Masked road agents stop your stagecoach and demand every passenger's valuables.",
            [
              [
                "Hand over your purse",
                { money: -1500, Health: 0 },
                "I handed over my purse to the bandits and was glad to keep my life.",
              ],
              [
                "Hide your money in your boot",
                { money: -200, Smarts: 3 },
                "I hid my money in my boot and the robbers only got my pocket change.",
                0.6,
                { money: -2e3, Health: -8 },
                "The robbers found my boot money and roughed me up for the trick.",
              ],
            ],
          ],
          [
            30,
            70,
            "Bank Panic",
            "1f3e6",
            "The Bank",
            "Rumors of a panic send a crowd running to the bank to withdraw their savings.",
            [
              [
                "Join the run",
                { money: 500 },
                "I pushed through the crowd and got my savings out in time.",
                0.5,
                { money: -3e3, Happiness: -10 },
                "I reached the window just as the bank shut its doors for good.",
              ],
              [
                "Trust the bank",
                { money: -2e3, Happiness: -6 },
                "I trusted the bank, and it failed with my savings inside.",
                0.5,
                { Respect: 3 },
                "I trusted the bank, and it weathered the panic.",
              ],
            ],
          ],
          [
            25,
            65,
            "Land Deed",
            "1f4dc",
            "Land Office",
            "The land office has a quarter section of prairie for sale at a fair price.",
            [
              [
                "Buy the land",
                { money: -4e3, Happiness: 8, Respect: 4 },
                "I bought a quarter section and signed my name on the deed.",
              ],
              ["Keep your money", {}, "I kept my money in the coffee tin."],
            ],
          ],
          [
            18,
            60,
            "Faro Table",
            "2660-fe0f",
            "Riverboat Gambler",
            "A gambler on the riverboat invites you to a game of faro.",
            [
              [
                "Play a few hands",
                { money: 800, Happiness: 6 },
                "I won big at faro on the riverboat.",
                0.35,
                { money: -800, Happiness: -6 },
                "I lost a month's pay at the faro table.",
              ],
              ["Decline", { Respect: 2 }, "I declined the gambler's invitation."],
            ],
          ],
          [
            30,
            70,
            "Stump Speech",
            "1f5e3-fe0f",
            "The Candidate",
            "A candidate for Congress climbs a tree stump in the square and asks for your vote.",
            [
              ["Cheer him on", { Happiness: 3 }, "I cheered the candidate and drank his free cider."],
              [
                "Heckle him",
                { Respect: 4 },
                "I heckled the candidate about the tariff until the crowd roared.",
                0.6,
                { Health: -5 },
                "I heckled the candidate and his supporters gave me a black eye.",
              ],
            ],
          ],
          [
            21,
            90,
            "Election Day",
            "1f5f3-fe0f",
            "Election Judges",
            "It is election day, and the polling place is a tavern full of shouting men.",
            [
              ["Cast your vote", { Respect: 3 }, "I pushed through the crowd and cast my vote."],
              ["Stay home", {}, "I stayed home and let others decide."],
            ],
          ],
          [
            25,
            85,
            "Town Gossip",
            "1f5e3-fe0f",
            "The Town Gossip",
            "The town gossip has been spreading tales that you were seen leaving the saloon at dawn.",
            [
              [
                "Confront her",
                { Respect: 4 },
                "I confronted the gossip in front of the dry goods store.",
                0.5,
                { Respect: -4 },
                "I confronted the gossip and only made the tale juicier.",
              ],
              ["Ignore it", { Happiness: -3 }, "I ignored the gossip and it slowly died out."],
            ],
          ],
          [
            18,
            70,
            "Rent Day",
            "1f3e0",
            "Your Landlord",
            "Your landlord knocks to say the rent is going up by a dollar a month.",
            [
              ["Pay up", { money: -100 }, "I paid the higher rent without complaint."],
              [
                "Argue",
                { Respect: 2 },
                "I argued with the landlord and he backed down.",
                0.4,
                { money: -300, Happiness: -5 },
                "I argued with the landlord and he raised it even more.",
              ],
            ],
          ],
          [
            18,
            80,
            "Pickpocket",
            "1f45b",
            "The Market",
            "In the crowded market square, you feel a hand slip into your coat pocket.",
            [
              [
                "Grab the thief",
                { Respect: 5 },
                "I caught the pickpocket by the wrist and hauled him to the constable.",
                0.5,
                { money: -300 },
                "I grabbed for the thief but he slipped away with my purse.",
              ],
              [
                "Check your purse",
                { money: -300, Happiness: -4 },
                "I checked my purse too late; it was gone.",
              ],
            ],
          ],
          [
            20,
            50,
            "Duel Challenge",
            "2694-fe0f",
            "An Offended Gentleman",
            "An offended gentleman slaps your face with his glove and demands satisfaction at dawn.",
            [
              [
                "Accept the duel",
                { Respect: 8 },
                "I fired into the air at dawn and honor was satisfied.",
                0.6,
                { Health: -15, Respect: 5 },
                "I met him at dawn and took a ball in the shoulder.",
              ],
              ["Apologize", { Respect: -6 }, "I apologized and was called a coward in the newspaper."],
            ],
          ],
          [
            18,
            90,
            "Town Fire",
            "1f525",
            "Fire Brigade",
            "The fire bell rings; a blaze has broken out on Main Street.",
            [
              [
                "Join the bucket line",
                { Respect: 6, Health: -3 },
                "I passed buckets in the line until the fire was out.",
              ],
              ["Save your own goods", { Respect: -3 }, "I ran home to drag my own goods into the street."],
            ],
          ],
          [
            20,
            90,
            "Spring Flood",
            "1f30a",
            "The Weather",
            "The river has burst its banks and water is rising toward your door.",
            [
              [
                "Move to the loft",
                { Health: -2 },
                "I hauled what I could to the loft and waited out the flood.",
              ],
              [
                "Save the livestock",
                { Respect: 4, Health: -6 },
                "I waded out to save the livestock and nearly drowned.",
              ],
            ],
          ],
          [
            20,
            90,
            "Blizzard",
            "2744-fe0f",
            "The Weather",
            "A howling blizzard has buried the road and the woodpile is running low.",
            [
              [
                "Burn the furniture",
                { Health: 2, Happiness: -4 },
                "I burned two chairs to keep warm through the blizzard.",
              ],
              [
                "Trek to the woodpile",
                { Health: -6 },
                "I tied a rope to the door and trekked to the woodpile in the storm.",
              ],
            ],
          ],
          [
            20,
            75,
            "Wolves at Night",
            "1f415",
            "The Weather",
            "Wolves have been howling near the pasture and a lamb went missing.",
            [
              [
                "Sit up with the rifle",
                { Health: -2, Respect: 3 },
                "I sat up all night with my rifle and drove the wolves off.",
              ],
              ["Bar the barn door", {}, "I barred the barn door and hoped for the best."],
            ],
          ],
          [
            20,
            75,
            "Thrown Shoe",
            "1f40e",
            "Your Horse",
            "Your horse has thrown a shoe halfway to market.",
            [
              [
                "Walk to the smithy",
                { money: -50, Health: -2 },
                "I led my horse three miles to the blacksmith.",
              ],
              ["Ride on anyway", { money: -500 }, "I rode on and my horse came up lame."],
            ],
          ],
          [
            25,
            60,
            "Good Harvest",
            "1f33e",
            "The Harvest",
            "The wheat stands tall and golden; this year's harvest looks to be the best in memory.",
            [
              ["Sell it all", { money: 2500, Happiness: 6 }, "I sold the whole harvest at a fine price."],
              [
                "Store some for winter",
                { money: 1200, Smarts: 2 },
                "I sold half the harvest and filled the root cellar with the rest.",
              ],
            ],
          ],
          [
            25,
            70,
            "Locust Year",
            "1f41b",
            "The Weather",
            "Clouds of grasshoppers descend on the fields and strip the crops bare.",
            [
              [
                "Fight them with fire",
                { Health: -4, money: -500 },
                "I burned smudge fires all week and saved a few rows.",
              ],
              [
                "Pray for rain",
                { money: -1500, Happiness: -6 },
                "I prayed while the locusts ate every last stalk.",
              ],
            ],
          ],
          [
            30,
            75,
            "Debtor's Notice",
            "1f4dd",
            "The Sheriff",
            "The sheriff serves you notice of an unpaid debt to the general store.",
            [
              ["Pay it off", { money: -1e3 }, "I paid my debt in full at the store."],
              ["Skip town", { Respect: -6, Happiness: -4 }, "I skipped town by night to escape the debt."],
            ],
          ],
          [
            40,
            80,
            "Inheritance Squabble",
            "2696-fe0f",
            "The Lawyer",
            "Your late uncle's will has left the farm to be split, and your cousins are already quarreling.",
            [
              [
                "Take your share",
                { money: 3e3, Respect: -3 },
                "I took my share of the farm money and my cousins stopped writing.",
              ],
              [
                "Give it up",
                { Respect: 6, Happiness: 3 },
                "I signed away my share for the sake of family peace.",
              ],
            ],
          ],
          [
            40,
            95,
            "Mourning Clothes",
            "26b0-fe0f",
            "The Undertaker",
            "A dear neighbor has died, and custom says you should wear black and sit with the body.",
            [
              [
                "Sit the wake",
                { Respect: 5, Happiness: -3 },
                "I sat up all night at the wake and wore black for a month.",
              ],
              ["Send flowers only", { money: -50 }, "I sent a wreath and kept my distance."],
            ],
          ],
          [
            50,
            95,
            "Grandchildren Visit",
            "1f476",
            "Your Grandchildren",
            "Your grandchildren arrive by wagon and beg you for a story.",
            [
              [
                "Tell a tall tale",
                { Happiness: 8 },
                "I told the grandchildren about the bear I once wrestled.",
              ],
              [
                "Give them pennies",
                { money: -20, Happiness: 5 },
                "I gave each grandchild a penny for candy.",
              ],
            ],
          ],
          [
            65,
            100,
            "Ear Trumpet",
            "1f442",
            "The Doctor",
            "The doctor says you have grown hard of hearing and suggests an ear trumpet.",
            [
              [
                "Buy the trumpet",
                { money: -200, Happiness: 3 },
                "I bought a brass ear trumpet and heard the birds again.",
              ],
              ["Refuse it", { Happiness: -3 }, "I refused the ear trumpet and nodded along to everything."],
            ],
          ],
          [
            60,
            100,
            "A Cane",
            "1f474",
            "The Whittler",
            "The carpenter offers to carve you a handsome hickory cane.",
            [
              ["Buy it", { money: -100, Health: 3 }, "I bought a hickory cane and walked steadier for it."],
              ["Make do", { Health: -3 }, "I refused the cane and took a tumble on the porch steps."],
            ],
          ],
          [
            60,
            100,
            "Pension Letter",
            "1f4e8",
            "The Pension Office",
            "A letter arrives from the pension office about your service years ago.",
            [
              [
                "Fill out the papers",
                { money: 1200, Happiness: 4 },
                "I filled out the pension papers and a check came by post.",
              ],
              ["Ignore it", {}, "I tossed the letter in the stove."],
            ],
          ],
          [
            55,
            100,
            "Writing the Will",
            "1f58b-fe0f",
            "The Lawyer",
            "The family lawyer suggests it is time you put your affairs in order.",
            [
              ["Write the will", { money: -300, Smarts: 2 }, "I wrote my will and divided my land fairly."],
              ["Put it off", {}, "I told the lawyer I had plenty of years left."],
            ],
          ],
          [
            70,
            100,
            "Rheumatism",
            "1f9d3",
            "Your Joints",
            "Your joints ache worse with every cold morning.",
            [
              ["Soak in a hot tub", { Health: 4 }, "I soaked my old bones in a hot tub by the stove."],
              [
                "Rub on liniment",
                { money: -25, Health: 2 },
                "I rubbed horse liniment on my knees and smelled like a stable.",
              ],
            ],
          ],
          [
            60,
            100,
            "Old Portrait",
            "1f4f7",
            "The Photographer",
            "A traveling photographer offers to make a daguerreotype portrait for the family.",
            [
              [
                "Sit for it",
                { money: -200, Happiness: 5 },
                "I sat stiff as a board for the photographer and the portrait came out fine.",
              ],
              ["Decline", {}, "I declined; the family will remember me without it."],
            ],
          ],
          [
            75,
            100,
            "Old Age Birthday",
            "1f382",
            "Your Family",
            "The whole family gathers to mark another birthday, amazed you are still going strong.",
            [
              [
                "Make a speech",
                { Happiness: 8, Respect: 4 },
                "I made a speech at my birthday supper and nobody dared interrupt.",
              ],
              [
                "Eat cake quietly",
                { Happiness: 5 },
                "I ate my cake in my rocking chair and smiled at everyone.",
              ],
            ],
          ],
          [
            30,
            65,
            "Temperance Ladies",
            "1f6ab",
            "Temperance Society",
            "The temperance ladies are marching down Main Street and ask you to sign the pledge against strong drink.",
            [
              [
                "Sign the pledge",
                { Health: 4, Respect: 4, Happiness: -2 },
                "I signed the temperance pledge and poured my jug into the creek.",
              ],
              [
                "Head to the saloon",
                { Happiness: 4, Respect: -4 },
                "I tipped my hat to the ladies and went straight to the saloon.",
              ],
            ],
          ],
          [
            1,
            3,
            "Teething",
            "1f476",
            "Your Mother",
            "Your gums ache with a new tooth, and Mother offers you a rag soaked in cold chamomile tea.",
            [
              [
                "Chew the rag",
                { Happiness: 3 },
                "I gnawed on a cold chamomile rag and my teeth felt better.",
              ],
              [
                "Fuss all night",
                { Happiness: -4, Health: -1 },
                "I fussed all night with a sore tooth and nobody slept.",
              ],
            ],
          ],
          [
            1,
            3,
            "Cradle Song",
            "1f319",
            "Your Grandmother",
            "Grandmother rocks the wooden cradle by the fire and hums an old ballad.",
            [
              [
                "Fall asleep",
                { Happiness: 5, Health: 2 },
                "I fell asleep to Grandmother humming by the fire.",
              ],
              [
                "Kick off the blanket",
                { Happiness: 2, Health: -2 },
                "I kicked off my blanket and caught a chill.",
              ],
            ],
          ],
          [
            2,
            4,
            "Corn Husk Doll",
            "1f33e",
            "Your Sister",
            "Your big sister folded a little doll out of dried corn husks and gave it to you.",
            [
              ["Carry it everywhere", { Happiness: 7 }, "I carried my corn husk doll everywhere I went."],
              ["Feed it to the goat", { Happiness: 3, Respect: -1 }, "I let the goat eat my corn husk doll."],
            ],
          ],
          [
            2,
            4,
            "Wooden Spoon",
            "1f37d-fe0f",
            "The Kitchen",
            "You found a wooden spoon and an empty pot on the kitchen floor.",
            [
              [
                "Bang the pot",
                { Happiness: 6 },
                "I banged on the pot like a drummer until Mother took it away.",
              ],
              [
                "Stir pretend stew",
                { Happiness: 4, Smarts: 1 },
                "I stirred a pretend stew just like Mother.",
              ],
            ],
          ],
          [
            2,
            5,
            "The Goat",
            "1f404",
            "The Barnyard",
            "The nanny goat has her head through the fence and is nibbling at your pinafore.",
            [
              ["Pat her nose", { Happiness: 5 }, "I patted the goat on the nose and she bleated at me."],
              [
                "Pull away",
                { Happiness: -2, Looks: -1 },
                "I pulled away and the goat tore a hole in my pinafore.",
              ],
            ],
          ],
          [
            2,
            5,
            "Lost in the Corn",
            "1f33e",
            "The Cornfield",
            "You wandered into the tall corn and every row looks the same.",
            [
              ["Shout for Father", { Happiness: 2 }, "I hollered until Father found me in the cornfield."],
              [
                "Follow the rows",
                { Smarts: 2 },
                "I followed a row of corn all the way back to the house.",
                0.6,
                { Happiness: -6 },
                "I wandered in circles until dark and cried myself hoarse.",
              ],
            ],
          ],
          [
            3,
            5,
            "Molasses Spill",
            "1f36c",
            "The Pantry",
            "You climbed onto a stool and tipped the molasses jug onto the pantry floor.",
            [
              [
                "Lick your fingers",
                { Happiness: 6, Respect: -2 },
                "I licked molasses off my fingers before anyone saw.",
              ],
              [
                "Run and tell Mother",
                { Respect: 2, Happiness: -2 },
                "I told Mother about the molasses and helped mop it up.",
              ],
            ],
          ],
          [
            3,
            5,
            "Sunday Clothes",
            "1f454",
            "Your Mother",
            "Mother is buttoning you into your stiff Sunday clothes and they itch something terrible.",
            [
              [
                "Sit still",
                { Respect: 2, Happiness: -2 },
                "I sat still in my itchy Sunday clothes all through the sermon.",
              ],
              [
                "Wriggle out of them",
                { Happiness: 3, Respect: -3 },
                "I wriggled out of my Sunday collar during the hymns.",
              ],
            ],
          ],
          [
            3,
            6,
            "Whooping Cough",
            "1f912",
            "The Doctor",
            "You have a cough that ends in a terrible whoop, and the doctor says it is whooping cough.",
            [
              [
                "Breathe the steam",
                { Health: -3 },
                "I breathed steam from a kettle until the whooping cough eased.",
              ],
              [
                "Take the onion syrup",
                { Health: -4, Happiness: -2 },
                "Mother dosed me with onion syrup and I coughed for weeks.",
                0.5,
                { Health: 1 },
                "Mother's onion syrup actually helped my cough.",
              ],
            ],
          ],
          [
            3,
            6,
            "The Baby Arrives",
            "1f476",
            "Your Father",
            "Father says the stork has brought you a new baby brother in the night.",
            [
              ["Peek in the cradle", { Happiness: 5 }, "I peeked at my new baby brother in the cradle."],
              [
                "Ask where the stork went",
                { Smarts: 1, Happiness: 3 },
                "I asked where the stork went and Father changed the subject.",
              ],
            ],
          ],
          [
            3,
            6,
            "Fireflies",
            "2728",
            "The Meadow",
            "The meadow is full of fireflies blinking in the summer dusk.",
            [
              [
                "Catch them in a jar",
                { Happiness: 7 },
                "I caught a jar full of fireflies and set it by my bed.",
              ],
              [
                "Chase them barefoot",
                { Happiness: 6, Health: 1 },
                "I chased fireflies barefoot until it was dark.",
              ],
            ],
          ],
          [
            4,
            6,
            "Sassafras Tea",
            "2615",
            "Your Grandmother",
            "Grandmother says a cup of sassafras tea will thin your blood for spring.",
            [
              ["Drink it down", { Health: 2 }, "I drank Grandmother's sassafras tea without complaint."],
              [
                "Spit it out",
                { Happiness: 1, Respect: -2 },
                "I spat out the sassafras tea and Grandmother tutted.",
              ],
            ],
          ],
          [
            4,
            6,
            "Picture Book",
            "1f4d6",
            "Your Aunt",
            "Your aunt sent a picture book from the city with colored engravings of faraway lands.",
            [
              [
                "Study every page",
                { Smarts: 4, Happiness: 3 },
                "I studied every picture of camels and pyramids in my new book.",
              ],
              [
                "Color in the pictures",
                { Happiness: 5, Respect: -1 },
                "I colored in the engravings with charcoal from the stove.",
              ],
            ],
          ],
          [
            4,
            7,
            "Feeding the Pigs",
            "1f404",
            "Your Father",
            "Father hands you the slop bucket and points at the pigpen.",
            [
              [
                "Pour it in the trough",
                { Respect: 2 },
                "I fed the pigs without spilling a drop.",
                0.7,
                { Looks: -3, Happiness: -2 },
                "I slipped in the pigpen mud and came out filthy.",
              ],
              [
                "Make the pigs race",
                { Happiness: 5 },
                "I made the pigs race for the slop and laughed myself silly.",
              ],
            ],
          ],
          [
            4,
            7,
            "Bedtime Prayers",
            "1f64f",
            "Your Mother",
            "Mother kneels beside your bed and waits for you to say your prayers.",
            [
              [
                "Say them properly",
                { Respect: 2, Happiness: 2 },
                "I said my prayers properly and Mother kissed my head.",
              ],
              ["Pray for a pony", { Happiness: 3 }, "I prayed hard for a pony of my own."],
            ],
          ],
          [
            4,
            7,
            "The Peddler's Cart",
            "1f6d2",
            "A Tin Peddler",
            "The tin peddler's cart rattles up the lane, hung with pots, pans and ribbons.",
            [
              [
                "Beg for a ribbon",
                { Happiness: 4, Looks: 1 },
                "Mother bought me a ribbon from the tin peddler.",
                0.5,
                { Happiness: -2 },
                "I begged for a ribbon but Mother said we could not spare it.",
              ],
              ["Pet his mule", { Happiness: 4 }, "I fed the peddler's mule a carrot."],
            ],
          ],
          [
            4,
            8,
            "Snowball Fight",
            "2744-fe0f",
            "peer",
            "{n} hits you square in the back with a snowball on the way home.",
            [
              [
                "Fire back",
                { Happiness: 7, friend: 1 },
                "I had a grand snowball fight with {n} in the lane.",
              ],
              ["Run home crying", { Happiness: -3 }, "I ran home with snow down my collar."],
            ],
          ],
          [
            4,
            8,
            "Snake in the Woodpile",
            "1f40d",
            "The Woodpile",
            "A snake slithered out of the woodpile right where you were fetching kindling.",
            [
              [
                "Yell for Father",
                { Respect: 1 },
                "I yelled for Father and he dispatched the snake with a hoe.",
              ],
              [
                "Poke it with a stick",
                { Happiness: 3 },
                "I poked the snake with a stick and it slid away.",
                0.7,
                { Health: -8 },
                "I poked the snake and it bit my hand.",
              ],
            ],
          ],
          [
            5,
            7,
            "Making Soap",
            "1f9fc",
            "Your Mother",
            "Mother is boiling lye and fat in the big iron kettle to make soap, and says to stand well back.",
            [
              ["Watch from the porch", { Smarts: 2 }, "I watched Mother make soap from a safe distance."],
              [
                "Stir the kettle",
                { Respect: 2 },
                "I helped stir the soap kettle.",
                0.7,
                { Health: -6 },
                "A splash of lye burned my arm.",
              ],
            ],
          ],
          [
            5,
            7,
            "Primer Lesson",
            "1f4dd",
            "The Schoolmistress",
            "The schoolmistress points to the alphabet chart and asks you to say your letters.",
            [
              ["Recite them all", { Smarts: 3, Respect: 2 }, "I recited my letters from A to Izzard."],
              ["Sing them", { Happiness: 3, Smarts: 2 }, "I sang my letters and the little ones joined in."],
            ],
          ],
          [
            5,
            8,
            "Tin Soldiers",
            "1f482",
            "peer",
            "{n} brought a box of painted tin soldiers to trade.",
            [
              [
                "Trade your marbles",
                { Happiness: 5, friend: 1 },
                "I traded {n} my marbles for two tin soldiers.",
              ],
              [
                "Play war together",
                { Happiness: 6, friend: 1 },
                "I played war with {n} and {his} tin soldiers all afternoon.",
              ],
            ],
          ],
          [
            5,
            8,
            "Chickenpox Season",
            "1f912",
            "Your Mother",
            "Half the children at church have the chickenpox, and Mother wants you to catch it early and be done with it.",
            [
              [
                "Visit the sick cousins",
                { Health: -4, Happiness: -2 },
                "Mother sent me to play with my spotty cousins and I caught it too.",
              ],
              [
                "Hide in the barn",
                { Happiness: 3 },
                "I hid in the barn until the chickenpox visit was over.",
              ],
            ],
          ],
          [
            5,
            8,
            "Grandfather's Watch",
            "231a",
            "Your Grandfather",
            "Grandfather lets you hold his gold pocket watch and listen to it tick.",
            [
              [
                "Hold it gently",
                { Happiness: 4, Respect: 2 },
                "I held Grandfather's watch like it was made of glass.",
              ],
              [
                "Open the back",
                { Smarts: 3 },
                "I opened the back of the watch to see the little wheels.",
                0.5,
                { Respect: -4 },
                "I opened the watch and a tiny spring flew out.",
              ],
            ],
          ],
          [
            5,
            9,
            "Tadpoles",
            "1f438",
            "The Creek",
            "The creek shallows are black with wriggling tadpoles.",
            [
              [
                "Fill a bucket",
                { Happiness: 6, Smarts: 1 },
                "I kept a bucket of tadpoles and watched them grow legs.",
              ],
              [
                "Wade in barefoot",
                { Happiness: 5, Health: -1 },
                "I waded in the creek after tadpoles and cut my foot on a rock.",
              ],
            ],
          ],
          [
            5,
            9,
            "Blackberry Picking",
            "1f9fa",
            "Your Mother",
            "Mother hands you a pail to pick blackberries along the fence rows.",
            [
              [
                "Fill the pail",
                { Respect: 2, Happiness: 3 },
                "I filled the pail with blackberries for Mother's cobbler.",
              ],
              [
                "Eat as you pick",
                { Happiness: 6, Respect: -1 },
                "I ate more blackberries than I picked and came home purple.",
              ],
              [
                "Wander off",
                { Happiness: 2 },
                "I wandered off and got scratched by brambles.",
                0.6,
                { Health: -3 },
                "I wandered into a patch of poison ivy.",
              ],
            ],
          ],
          [
            5,
            9,
            "Christmas Orange",
            "1f34e",
            "Christmas Morning",
            "There is a real orange in the toe of your Christmas stocking, the first you have ever had.",
            [
              ["Eat it slowly", { Happiness: 9 }, "I ate my Christmas orange one slice at a time."],
              [
                "Share it",
                { Happiness: 6, Respect: 3 },
                "I shared my Christmas orange with my little brother.",
              ],
              ["Save the peel", { Happiness: 4 }, "I kept the orange peel to smell for weeks."],
            ],
          ],
          [
            5,
            10,
            "Magic Lantern",
            "1f3aa",
            "The Church Hall",
            "A traveling showman has a magic lantern that throws colored pictures on a sheet in the church hall.",
            [
              [
                "Sit in front",
                { Happiness: 8, Smarts: 2 },
                "I sat right up front for the magic lantern show.",
              ],
              [
                "Try to touch the picture",
                { Happiness: 4, Respect: -1 },
                "I tried to grab the pictures on the sheet and everyone laughed.",
              ],
            ],
          ],
          [
            6,
            8,
            "Copybook",
            "270d-fe0f",
            "The Schoolmaster",
            "The schoolmaster wants a full page of copperplate handwriting in your copybook by noon.",
            [
              [
                "Write it carefully",
                { Smarts: 3, Respect: 2 },
                "I copied a perfect page of copperplate.",
                0.6,
                { Happiness: -3 },
                "I blotted ink all over my copybook.",
              ],
              [
                "Draw in the margins",
                { Happiness: 4, Respect: -2 },
                "I drew horses in the margins of my copybook.",
              ],
            ],
          ],
          [
            6,
            9,
            "Muddy Boots",
            "1f97e",
            "Your Mother",
            "You tracked mud across Mother's freshly scrubbed floor.",
            [
              ["Scrub it yourself", { Respect: 3 }, "I scrubbed the floor on my hands and knees."],
              [
                "Blame the dog",
                { Respect: -2 },
                "I blamed the dog for the muddy floor.",
                0.5,
                { Respect: -4, Happiness: -3 },
                "Mother saw my boot prints and I got a switching.",
              ],
            ],
          ],
          [
            6,
            9,
            "Ghost Story",
            "1f47b",
            "Your Uncle",
            "Your uncle tells a ghost story about a headless horseman by the light of the fire.",
            [
              ["Beg for another", { Happiness: 6 }, "I begged my uncle for another ghost story."],
              [
                "Hide under the table",
                { Happiness: -2 },
                "I hid under the table and could not sleep that night.",
              ],
            ],
          ],
          [
            6,
            9,
            "Mumps",
            "1f912",
            "The Doctor",
            "Your cheeks have swelled up like a chipmunk and the doctor says it is the mumps.",
            [
              ["Eat broth", { Health: -3 }, "I sipped broth through the mumps until the swelling went down."],
              [
                "Sneak a pickle",
                { Health: -5, Happiness: 2 },
                "I sneaked a sour pickle and my swollen jaw ached terribly.",
              ],
            ],
          ],
          [
            6,
            10,
            "Quilt Fort",
            "1f6cf-fe0f",
            "peer",
            "{n} is over and wants to build a fort out of every quilt in the house.",
            [
              [
                "Build it",
                { Happiness: 8, friend: 1 },
                "I built a quilt fort with {n} in the parlor.",
                0.6,
                { Respect: -3 },
                "Mother made us fold every quilt back up.",
              ],
              [
                "Play outside instead",
                { Happiness: 4, friend: 1 },
                "I played tag with {n} in the yard instead.",
              ],
            ],
          ],
          [
            6,
            10,
            "Stone Bruise",
            "1f97e",
            "The Lane",
            "You went barefoot all summer and stepped hard on a sharp stone.",
            [
              ["Hop home", { Health: -2, Happiness: -2 }, "I hopped home on one foot with a stone bruise."],
              ["Walk it off", { Health: -3, Respect: 2 }, "I walked off my stone bruise without a tear."],
            ],
          ],
          [
            6,
            10,
            "Writing a Letter",
            "1f4e8",
            "Your Mother",
            "Mother says you are old enough to write your own letter to Grandmother back East.",
            [
              [
                "Write a long letter",
                { Smarts: 3, Happiness: 3 },
                "I wrote Grandmother a whole page about the farm.",
              ],
              ["Draw her a picture", { Happiness: 4 }, "I drew Grandmother a picture of our cow."],
            ],
          ],
          [
            6,
            10,
            "Tag at Recess",
            "1f3c3",
            "peer",
            "The whole schoolyard is playing tag, and {n} just tagged you.",
            [
              [
                "Chase {him} down",
                { Happiness: 6, Health: 2, friend: 1 },
                "I chased {n} all over the schoolyard.",
              ],
              ["Sit on the steps", {}, "I sat on the schoolhouse steps and watched."],
            ],
          ],
          [
            6,
            11,
            "Croup",
            "1f912",
            "Your Mother",
            "You woke barking like a seal, and Mother says it is the croup.",
            [
              [
                "Sit in the steamy kitchen",
                { Health: -2 },
                "Mother sat me by a steaming kettle until the croup eased.",
              ],
              [
                "Take a spoon of goose grease",
                { Health: -2, Happiness: -3 },
                "Mother rubbed goose grease on my chest and I smelled awful.",
              ],
            ],
          ],
          [
            6,
            11,
            "Flag Day",
            "1f3f3-fe0f",
            "The Schoolmaster",
            "The schoolmaster wants you to carry the flag at the front of the parade.",
            [
              [
                "Carry it proudly",
                { Respect: 4, Happiness: 5 },
                "I carried the flag at the head of the parade.",
              ],
              ["Let someone else", {}, "I let the older boy carry the flag."],
            ],
          ],
          [
            6,
            11,
            "Whittling",
            "1fa93",
            "Your Grandfather",
            "Grandfather hands you his pocketknife and a piece of soft pine to whittle.",
            [
              [
                "Carve a whistle",
                { Smarts: 3, Happiness: 4 },
                "I whittled a willow whistle that actually blew.",
                0.6,
                { Health: -4 },
                "The knife slipped and I cut my thumb.",
              ],
              ["Carve a little dog", { Happiness: 5 }, "I whittled a lumpy little dog for my shelf."],
            ],
          ],
          [
            6,
            11,
            "Corn Shucking",
            "1f33e",
            "The Neighbors",
            "The neighbors are holding a corn-shucking bee, and whoever finds a red ear gets a prize.",
            [
              [
                "Shuck fast",
                { Happiness: 5, Health: 1 },
                "I shucked a mountain of corn at the bee.",
                0.3,
                { Happiness: 9 },
                "I found a red ear of corn and won the prize.",
              ],
              [
                "Eat the doughnuts",
                { Happiness: 6 },
                "I ate doughnuts and cider while the grown-ups shucked.",
              ],
            ],
          ],
          [
            6,
            12,
            "Lame Lamb",
            "1f404",
            "The Pasture",
            "A lamb in the pasture is limping, and its mother has wandered off.",
            [
              [
                "Carry it to the barn",
                { Happiness: 5, Respect: 3 },
                "I carried the lame lamb to the barn and bottle-fed it.",
              ],
              ["Fetch Father", { Respect: 2 }, "I ran to fetch Father about the lame lamb."],
            ],
          ],
          [
            6,
            12,
            "Valentine",
            "1f48c",
            "peer",
            "{n} left a lace paper valentine in your desk at school.",
            [
              ["Make one back", { Happiness: 6, friend: 1 }, "I made {n} a paper valentine in return."],
              ["Blush and hide it", { Happiness: 3 }, "I hid {n}'s valentine in my primer."],
              ["Show the class", { Respect: -3 }, "I showed the valentine around and {n} cried."],
            ],
          ],
          [
            7,
            9,
            "Lice Comb",
            "1f62c",
            "Your Mother",
            "The whole schoolhouse has lice, and Mother is coming at you with a fine-toothed comb and kerosene.",
            [
              [
                "Sit still",
                { Health: 1, Happiness: -3 },
                "I sat still while Mother combed kerosene through my hair.",
              ],
              [
                "Run for the creek",
                { Happiness: 2, Respect: -2 },
                "I ran to the creek, but Mother caught me anyway.",
              ],
            ],
          ],
          [
            7,
            10,
            "Ciphering Match",
            "1f4dd",
            "The Schoolmaster",
            "The schoolmaster is holding a ciphering match at the blackboard, and you are up against the miller's son.",
            [
              [
                "Work it carefully",
                { Smarts: 4, Respect: 2 },
                "I won the ciphering match at the blackboard.",
                0.5,
                { Happiness: -3 },
                "The miller's son beat me at ciphering.",
              ],
              ["Count on your fingers", { Smarts: 1 }, "I counted on my fingers and the class snickered."],
            ],
          ],
          [
            7,
            10,
            "Hen Pecked",
            "1f414",
            "The Henhouse",
            "The broody hen will not let you near her eggs.",
            [
              [
                "Reach under anyway",
                { Respect: 2, Health: -1 },
                "I got the eggs, and a few pecks for my trouble.",
              ],
              [
                "Wait for her to leave",
                { Smarts: 2 },
                "I waited until the hen got up and then took the eggs.",
              ],
            ],
          ],
          [
            7,
            11,
            "Trading Cards",
            "1f0cf",
            "peer",
            "{n} has a stack of colored trade cards from the general store and wants to swap.",
            [
              ["Swap your best one", { Happiness: 5, friend: 1 }, "I swapped trade cards with {n}."],
              ["Keep your collection", {}, "I kept my trade cards to myself."],
            ],
          ],
          [
            7,
            11,
            "Spring Planting",
            "1f331",
            "Your Father",
            "Father wants you to walk behind him and drop seed corn in every furrow.",
            [
              ["Plant every row", { Health: 2, Respect: 3 }, "I planted seed corn behind Father all day."],
              [
                "Throw a handful at the crows",
                { Happiness: 4, Respect: -2 },
                "I threw seed at the crows and Father was not pleased.",
              ],
            ],
          ],
          [
            7,
            11,
            "Lightning Bugs and Lies",
            "1f4ac",
            "peer",
            "{n} swears that a hair from a horse's tail will turn into a snake if you leave it in a rain barrel.",
            [
              [
                "Try it",
                { Happiness: 4, Smarts: 1, friend: 1 },
                "I put a horse hair in the rain barrel with {n} and waited.",
              ],
              ["Call {him} a fibber", { Respect: 1 }, "I told {n} that was the silliest thing I ever heard."],
            ],
          ],
          [
            7,
            11,
            "Ice House",
            "1f9ca",
            "Your Father",
            "Father is cutting blocks of ice from the frozen pond to pack in sawdust in the ice house.",
            [
              ["Help haul ice", { Health: 2, Respect: 3 }, "I helped haul ice blocks to the ice house."],
              [
                "Slide on the pond",
                { Happiness: 6 },
                "I slid across the pond while Father worked.",
                0.7,
                { Health: -5 },
                "I slid onto thin ice and plunged into the freezing water.",
              ],
            ],
          ],
          [
            7,
            12,
            "Diphtheria Scare",
            "1f912",
            "The Doctor",
            "Diphtheria is going round the county, and the doctor has closed the schoolhouse.",
            [
              [
                "Stay home and pray",
                { Health: 2, Happiness: -3 },
                "I stayed home until the diphtheria passed.",
              ],
              [
                "Sneak out to play",
                { Happiness: 3, Health: -8 },
                "I sneaked out to play and came down terribly sick.",
                0.5,
                { Happiness: 4 },
                "I sneaked out to play and somehow stayed well.",
              ],
            ],
          ],
          [
            7,
            12,
            "Peppermint Stick",
            "1f36d",
            "The General Store",
            "The storekeeper offers you a peppermint stick if you sweep his porch.",
            [
              [
                "Sweep the porch",
                { Happiness: 5, Respect: 2 },
                "I swept the store porch and earned a peppermint stick.",
              ],
              ["Ask for a penny instead", { money: 1 }, "I swept the porch for a penny."],
            ],
          ],
          [
            7,
            12,
            "Tree House",
            "1f333",
            "peer",
            "{n} wants to nail boards up the big oak and build a lookout.",
            [
              [
                "Build it together",
                { Happiness: 7, Smarts: 1, friend: 1 },
                "I built a lookout in the big oak with {n}.",
                0.7,
                { Health: -6 },
                "A board gave way and I fell out of the oak.",
              ],
              ["Keep watch below", { Happiness: 3, friend: 1 }, "I handed boards up to {n} from the ground."],
            ],
          ],
          [
            7,
            12,
            "Lamp Chimney",
            "1fa94",
            "Your Mother",
            "It is your job to wash the soot off the kerosene lamp chimneys.",
            [
              ["Polish them clean", { Respect: 2 }, "I polished every lamp chimney until it shone."],
              [
                "Rush it",
                {},
                "I rushed through the lamp chimneys.",
                0.6,
                { Health: -3, Respect: -2 },
                "I dropped a lamp chimney and it shattered.",
              ],
            ],
          ],
          [
            7,
            12,
            "Mud Pies",
            "1f967",
            "peer",
            "{n} has set up a bakery of mud pies along the fence and wants you to buy one with a button.",
            [
              ["Buy a pie", { Happiness: 5, friend: 1 }, "I bought a mud pie from {n} with my best button."],
              [
                "Open a rival bakery",
                { Happiness: 6, Smarts: 1 },
                "I opened a rival mud pie bakery next to {n}.",
              ],
            ],
          ],
          [
            8,
            10,
            "Lost Mitten",
            "1f9e4",
            "Your Mother",
            "You came home from school with only one of the mittens Mother knitted.",
            [
              [
                "Go back and look",
                { Respect: 2, Health: -1 },
                "I trudged back through the snow and found my mitten.",
              ],
              ["Confess", { Happiness: -3 }, "I confessed and Mother sighed and knitted another."],
            ],
          ],
          [
            8,
            11,
            "Rope Swing",
            "1f333",
            "peer",
            "{n} has tied a rope swing to the sycamore over the creek.",
            [
              [
                "Swing out and let go",
                { Happiness: 8, friend: 1 },
                "I swung out over the creek and dropped in with a splash.",
                0.8,
                { Health: -5 },
                "I let go too early and landed on the rocks.",
              ],
              ["Just watch", {}, "I watched {n} swing over the creek."],
            ],
          ],
          [
            8,
            12,
            "Scarlet Fever Quarantine",
            "1f6ab",
            "The Health Officer",
            "The health officer nailed a quarantine sign on your neighbor's door for scarlet fever.",
            [
              [
                "Leave food on the step",
                { Respect: 4 },
                "I left a basket of food on the quarantined neighbor's step.",
              ],
              [
                "Stay far away",
                { Health: 1 },
                "I crossed the road every time I passed the quarantined house.",
              ],
            ],
          ],
          [
            8,
            12,
            "Geography Bee",
            "1f5fa-fe0f",
            "The Schoolmistress",
            "The schoolmistress asks you to point to Constantinople on the big wall map.",
            [
              [
                "Point boldly",
                { Smarts: 3, Respect: 2 },
                "I found Constantinople on the map without hesitating.",
                0.5,
                { Happiness: -3 },
                "I pointed to Spain and the class giggled.",
              ],
              ["Admit you don't know", { Smarts: 1 }, "I admitted I didn't know and learned where it was."],
            ],
          ],
          [
            8,
            12,
            "Plowing Lesson",
            "1f402",
            "Your Father",
            "Father says it is time you learned to handle the plow behind the oxen.",
            [
              [
                "Grip the handles",
                { Health: 3, Respect: 3 },
                "I plowed my first crooked furrow behind the oxen.",
              ],
              ["Ask to drive the team", { Smarts: 2 }, "I drove the oxen while Father held the plow."],
            ],
          ],
          [
            8,
            12,
            "Wasps' Nest",
            "1f41d",
            "peer",
            "{n} dares you to knock down the wasps' nest under the barn eaves.",
            [
              [
                "Knock it down",
                { Respect: 3 },
                "I knocked down the wasps' nest and ran like lightning.",
                0.4,
                { Health: -6, Happiness: -4 },
                "The wasps chased me down and stung me a dozen times.",
              ],
              ["Refuse", { Respect: -1 }, "I told {n} to knock it down {him}self."],
            ],
          ],
          [
            8,
            12,
            "Butchering Day",
            "1f356",
            "Your Father",
            "It is butchering day, and the whole family is making sausage and rendering lard.",
            [
              [
                "Turn the sausage grinder",
                { Respect: 3, Health: 1 },
                "I turned the sausage grinder until my arm ached.",
              ],
              ["Hide in the house", { Happiness: -1 }, "I hid in the house until butchering day was over."],
            ],
          ],
          [
            8,
            12,
            "Penmanship Prize",
            "1f3c6",
            "The Schoolmaster",
            "The schoolmaster is giving a prize for the neatest penmanship in the school.",
            [
              [
                "Practice every night",
                { Smarts: 3, Respect: 3 },
                "I practiced every night and won the penmanship prize.",
                0.5,
                { Happiness: -2 },
                "I practiced hard but the minister's daughter won.",
              ],
              ["Don't bother", {}, "I didn't enter the penmanship contest."],
            ],
          ],
          [
            8,
            13,
            "Pony Ride",
            "1f40e",
            "Your Uncle",
            "Your uncle lets you ride his spotted pony around the pasture.",
            [
              ["Trot along", { Happiness: 7 }, "I rode my uncle's pony around the pasture."],
              [
                "Gallop",
                { Happiness: 9 },
                "I galloped the pony across the pasture.",
                0.7,
                { Health: -6 },
                "The pony bucked and I landed in the thistles.",
              ],
            ],
          ],
          [
            8,
            13,
            "Bee Tree",
            "1f41d",
            "Your Grandfather",
            "Grandfather found a bee tree full of wild honey in the woods.",
            [
              [
                "Help smoke the bees",
                { Happiness: 6, Smarts: 2 },
                "I helped Grandfather smoke out the bees and gather wild honey.",
                0.7,
                { Health: -4 },
                "The bees got me on the nose before we got the honey.",
              ],
              ["Wait at a distance", { Happiness: 4 }, "I waited back while Grandfather got the honey."],
            ],
          ],
          [
            8,
            13,
            "Arithmetic Slate",
            "1f4dd",
            "peer",
            "{n} wants to copy the sums off your slate before the schoolmaster checks them.",
            [
              [
                "Let {him} copy",
                { friend: 1, Respect: -2 },
                "I let {n} copy my sums.",
                0.6,
                { Respect: -5 },
                "The schoolmaster caught us and switched us both.",
              ],
              ["Cover your slate", { Respect: 2 }, "I covered my slate and {n} sulked."],
            ],
          ],
          [
            8,
            13,
            "Thanksgiving Turkey",
            "1f983",
            "Your Father",
            "Father says you may help catch the turkey for Thanksgiving dinner.",
            [
              [
                "Chase it down",
                { Happiness: 6, Health: 2 },
                "I chased the Thanksgiving turkey all over the yard.",
              ],
              ["Let it escape", { Happiness: 4, Respect: -3 }, "I let the turkey slip through the fence."],
            ],
          ],
          [
            8,
            14,
            "Snake Oil Wagon",
            "1f9ea",
            "Medicine Show",
            "The medicine show has a man who claims his liniment will make you grow two inches overnight.",
            [
              [
                "Spend your pennies",
                { money: -5, Happiness: 3 },
                "I spent my pennies on growing liniment and stayed the same height.",
              ],
              ["Laugh at him", { Happiness: 4, Smarts: 1 }, "I laughed at the medicine man and walked off."],
            ],
          ],
          [
            9,
            12,
            "Lyceum Debate",
            "1f5e3-fe0f",
            "The Schoolmaster",
            "The schoolmaster has you debate whether the pen is mightier than the sword in front of the parents.",
            [
              [
                "Argue for the pen",
                { Smarts: 4, Respect: 3 },
                "I argued for the pen and the parents applauded.",
                0.6,
                { Happiness: -3 },
                "I lost my place and the sword side won.",
              ],
              [
                "Argue for the sword",
                { Smarts: 3, Happiness: 3 },
                "I argued for the sword with great bluster.",
              ],
            ],
          ],
          [
            9,
            12,
            "Breaking the Colt",
            "1f40e",
            "Your Uncle",
            "Your uncle is breaking a wild colt and asks you to hold the halter rope.",
            [
              [
                "Hold on tight",
                { Respect: 3, Health: 1 },
                "I held the colt steady while my uncle saddled it.",
                0.6,
                { Health: -6 },
                "The colt yanked me off my feet and dragged me in the dust.",
              ],
              ["Climb the fence", {}, "I watched from the top rail of the fence."],
            ],
          ],
          [
            9,
            12,
            "Fever and Ague",
            "1f912",
            "The Doctor",
            "You have the shakes and a fever every other day, and the doctor calls it the ague.",
            [
              [
                "Take the quinine",
                { Health: 2, money: -10, Happiness: -2 },
                "I took bitter quinine and the ague finally broke.",
              ],
              ["Tough it out", { Health: -6 }, "I shook with the ague for most of the summer."],
            ],
          ],
          [
            9,
            13,
            "Corn Dodgers",
            "1f33e",
            "Your Mother",
            "Mother is teaching you to bake corn dodgers in the hearth.",
            [
              [
                "Bake a batch",
                { Smarts: 2, Respect: 2 },
                "I baked a batch of corn dodgers and they came out golden.",
                0.6,
                { Happiness: -2 },
                "My corn dodgers came out hard as rocks.",
              ],
              ["Eat the batter", { Happiness: 4 }, "I ate half the batter before it reached the pan."],
            ],
          ],
          [
            9,
            13,
            "Caught Fibbing",
            "1f62e",
            "Your Father",
            "Father found out you said you finished your chores when you hadn't.",
            [
              [
                "Own up",
                { Respect: 2, Happiness: -3 },
                "I owned up to fibbing and did my chores twice over.",
              ],
              ["Keep lying", { Respect: -4 }, "I kept lying and Father took me to the woodshed."],
            ],
          ],
          [
            9,
            13,
            "Raccoon Kit",
            "1f99d",
            "The Woods",
            "You found a baby raccoon whose mother was killed on the road.",
            [
              [
                "Raise it",
                { Happiness: 8 },
                "I raised the baby raccoon in a crate behind the barn.",
                0.6,
                { Respect: -2 },
                "The raccoon got loose and raided the henhouse.",
              ],
              ["Leave it be", { Happiness: -2 }, "I left the baby raccoon in the woods."],
            ],
          ],
          [
            9,
            13,
            "Prairie Fire",
            "1f525",
            "The Weather",
            "Smoke on the horizon means a prairie fire is racing toward the farm.",
            [
              [
                "Help plow a firebreak",
                { Respect: 5, Health: -2 },
                "I helped Father plow a firebreak and the fire passed us by.",
              ],
              ["Wet the roof", { Respect: 3 }, "I carried buckets to wet down the roof."],
            ],
          ],
          [
            9,
            14,
            "Fiddle Lessons",
            "1f3bb",
            "Your Grandfather",
            "Grandfather takes his old fiddle down from the wall and offers to teach you a tune.",
            [
              [
                "Learn a reel",
                { Smarts: 3, Happiness: 5 },
                "I learned to saw out a reel on Grandfather's fiddle.",
              ],
              ["Just listen", { Happiness: 4 }, "I listened to Grandfather play until the fire burned low."],
            ],
          ],
          [
            9,
            14,
            "Camp Meeting",
            "26ea",
            "The Preacher",
            "The whole county has gathered at the camp meeting, with preaching from dawn till dark.",
            [
              [
                "Go to the mourners' bench",
                { Respect: 4, Happiness: 2 },
                "I went up to the mourners' bench and the preacher prayed over me.",
              ],
              [
                "Sneak off with the other kids",
                { Happiness: 6, Respect: -2 },
                "I sneaked off to play by the creek during the preaching.",
              ],
            ],
          ],
          [
            9,
            14,
            "Cornet Band",
            "1f941",
            "The Bandmaster",
            "The town cornet band needs a drummer boy for the summer concerts.",
            [
              [
                "Join the band",
                { Happiness: 6, Respect: 3 },
                "I beat the drum for the town cornet band all summer.",
              ],
              ["Decline", {}, "I turned down the cornet band."],
            ],
          ],
          [
            10,
            13,
            "Slingshot",
            "1f52b",
            "peer",
            "{n} has a forked-stick slingshot and wants to show you how to knock tin cans off the fence.",
            [
              [
                "Take a shot",
                { Happiness: 6, friend: 1 },
                "I knocked three cans off the fence with {n}'s slingshot.",
                0.7,
                { Respect: -4 },
                "I missed the can and broke the neighbor's window.",
              ],
              [
                "Aim at birds",
                { Respect: -2, Happiness: 2 },
                "I shot pebbles at the sparrows and missed every one.",
              ],
            ],
          ],
          [
            10,
            13,
            "Smokehouse",
            "1f356",
            "Your Father",
            "Father says you must keep the hickory fire low and smoky in the smokehouse all night.",
            [
              [
                "Tend it all night",
                { Respect: 4, Health: -2 },
                "I tended the smokehouse fire all night and the hams came out perfect.",
              ],
              ["Doze off", { Respect: -3 }, "I dozed off and the smokehouse fire went out."],
            ],
          ],
          [
            10,
            13,
            "Writing to a Pen Pal",
            "1f4e8",
            "The Schoolmistress",
            "The schoolmistress arranged for the class to write letters to children in England.",
            [
              [
                "Write about the farm",
                { Smarts: 3, Happiness: 3 },
                "I wrote a letter to a boy in England about our farm.",
              ],
              ["Tell tall tales", { Happiness: 5 }, "I wrote that I wrestled bears every Sunday."],
            ],
          ],
          [
            10,
            14,
            "Muster Day",
            "1f396-fe0f",
            "The Militia",
            "It is militia muster day, and the men are drilling on the green with old muskets.",
            [
              [
                "March alongside",
                { Happiness: 6 },
                "I marched beside the militia with a broom for a musket.",
              ],
              ["Sell them lemonade", { money: 5, Smarts: 1 }, "I sold lemonade to the thirsty militia men."],
            ],
          ],
          [
            10,
            14,
            "Barn Cat Kittens",
            "1f408",
            "Your Father",
            "Father says there are too many barn kittens and some will have to go.",
            [
              [
                "Find them homes",
                { Respect: 4, Happiness: 3 },
                "I found homes for every barn kitten in the county.",
              ],
              [
                "Hide them in the loft",
                { Happiness: 4, Respect: -2 },
                "I hid the kittens in the loft and Father found them anyway.",
              ],
            ],
          ],
          [
            10,
            14,
            "First Rifle",
            "1f52b",
            "Your Father",
            "Father hands you an old squirrel rifle and says it is time you learned to shoot.",
            [
              ["Shoot at a target", { Smarts: 2, Respect: 3 }, "I hit the target on my third shot."],
              [
                "Go after squirrels",
                { Happiness: 5, Respect: 2 },
                "I brought home two squirrels for supper.",
                0.5,
                { Happiness: -2 },
                "I came home with nothing but a bruised shoulder.",
              ],
            ],
          ],
          [
            10,
            14,
            "Taffy Pull",
            "1f36c",
            "peer",
            "{n} invited you to a taffy pull, where you butter your hands and stretch hot molasses candy.",
            [
              [
                "Pull with {n}",
                { Happiness: 7, friend: 1 },
                "I pulled taffy with {n} until it turned golden.",
              ],
              [
                "Eat it warm",
                { Happiness: 5, Health: -1 },
                "I ate the taffy while it was still warm and burned my tongue.",
              ],
            ],
          ],
          [
            10,
            14,
            "Telegraph Key",
            "2709-fe0f",
            "The Telegraph Office",
            "The telegraph operator lets you tap out your name in Morse code.",
            [
              [
                "Learn the code",
                { Smarts: 4, Happiness: 4 },
                "I learned Morse code from the telegraph operator.",
              ],
              ["Tap nonsense", { Happiness: 3 }, "I tapped out nonsense and the operator chuckled."],
            ],
          ],
          [
            10,
            15,
            "Walking to School",
            "1f97e",
            "The Weather",
            "The snow is up to your knees and the schoolhouse is three miles away.",
            [
              [
                "Trudge through it",
                { Health: 3, Respect: 3, Smarts: 1 },
                "I trudged three miles through the snow to school.",
              ],
              ["Stay home", { Happiness: 3 }, "I stayed home by the fire and missed my lessons."],
            ],
          ],
          [
            10,
            15,
            "Stolen Watermelon",
            "1f34e",
            "peer",
            "{n} wants to sneak into the deacon's melon patch after dark.",
            [
              [
                "Go along",
                { Happiness: 7, friend: 1 },
                "I ate stolen watermelon by the creek with {n}.",
                0.6,
                { Respect: -5 },
                "The deacon caught us and told our parents at church.",
              ],
              ["Refuse", { Respect: 2 }, "I said no to stealing the deacon's melons."],
            ],
          ],
          [
            11,
            14,
            "Corn Shuck Mattress",
            "1f6cf-fe0f",
            "Your Mother",
            "Mother says it is time to restuff the mattresses with fresh corn shucks.",
            [
              [
                "Stuff them full",
                { Respect: 2, Health: 1 },
                "I restuffed the mattresses and slept like a log.",
              ],
              ["Jump on the pile", { Happiness: 6 }, "I jumped in the pile of corn shucks."],
            ],
          ],
          [
            11,
            14,
            "Cousin from the City",
            "1f3a9",
            "child",
            "Your city cousin {n} is visiting the farm and has never seen a cow up close.",
            [
              [
                "Show {him} the barn",
                { Happiness: 5, friend: 1 },
                "I showed {n} the barn and {he} squealed at the cow.",
              ],
              [
                "Trick {him}",
                { Happiness: 6, Respect: -2 },
                "I told {n} the brown cows give chocolate milk.",
              ],
            ],
          ],
          [
            11,
            14,
            "Spelling Book",
            "1f4d6",
            "The Schoolmaster",
            "The schoolmaster says anyone who can spell every word in the blue-backed speller gets out early.",
            [
              [
                "Spell them all",
                { Smarts: 4 },
                "I spelled every word and got out early.",
                0.4,
                { Happiness: -2 },
                'I missed "phthisic" and stayed after.',
              ],
              ["Don't try", {}, "I didn't even try the spelling test."],
            ],
          ],
          [
            11,
            15,
            "Riverboat Whistle",
            "1f6a2",
            "peer",
            "{n} wants to run away and be a cabin boy on a riverboat.",
            [
              [
                "Talk {him} out of it",
                { Respect: 3, friend: 1 },
                "I talked {n} out of running off to the river.",
              ],
              [
                "Dream about it together",
                { Happiness: 5, friend: 1 },
                "I lay in the grass with {n} dreaming about the river.",
              ],
            ],
          ],
          [
            11,
            15,
            "Cattle Drive",
            "1f402",
            "Your Uncle",
            "Your uncle is driving cattle to the railhead and needs a hand to ride drag.",
            [
              [
                "Ride drag",
                { Health: 2, Respect: 4, money: 20 },
                "I rode drag on the cattle drive and ate dust for a week.",
              ],
              ["Stay home", {}, "I stayed home from the cattle drive."],
            ],
          ],
          [
            11,
            15,
            "Typhoid",
            "1f912",
            "The Doctor",
            "You have a fever that will not break, and the doctor fears it is typhoid.",
            [
              ["Rest and pray", { Health: -8, Happiness: -4 }, "I lay abed for weeks with typhoid fever."],
              [
                "Drink only boiled water",
                { Health: -4, Smarts: 1 },
                "I drank only boiled water and pulled through the typhoid.",
              ],
            ],
          ],
          [
            11,
            15,
            "Box Social",
            "1f9fa",
            "peer",
            "At the box social, the boys bid on the girls' supper boxes, and {n} is eyeing yours.",
            [
              [
                "Smile at {him}",
                { Happiness: 7, friend: 1 },
                "I shared my supper box with {n} after {he} won the bid.",
              ],
              ["Pretend not to notice", { Happiness: 2 }, "I pretended not to notice {n} at the box social."],
            ],
          ],
          [
            11,
            15,
            "Haying Season",
            "1f33e",
            "Your Father",
            "The hay is cut and a thunderstorm is coming, and every hand must get it into the barn.",
            [
              [
                "Pitch hay till dark",
                { Health: 3, Respect: 4 },
                "I pitched hay until the last load was in the barn.",
              ],
              ["Ride the hay wagon", { Happiness: 5 }, "I rode on top of the hay wagon to the barn."],
            ],
          ],
          [
            12,
            15,
            "Confirmation",
            "26ea",
            "The Preacher",
            "The preacher says you are old enough to be confirmed into the church.",
            [
              [
                "Study the catechism",
                { Smarts: 2, Respect: 4 },
                "I studied the catechism and was confirmed in the church.",
              ],
              [
                "Ask hard questions",
                { Smarts: 3, Respect: -2 },
                "I asked the preacher questions he could not answer.",
              ],
            ],
          ],
          [
            12,
            15,
            "Mending Fences",
            "1f6a7",
            "Your Father",
            "The cows broke through the split-rail fence, and Father says you must mend it.",
            [
              [
                "Mend it right",
                { Health: 2, Respect: 3 },
                "I mended the fence and not a cow got out all summer.",
              ],
              [
                "Patch it quickly",
                {},
                "I patched the fence quickly.",
                0.5,
                { Respect: -3 },
                "The cows got out again and ate the neighbor's corn.",
              ],
            ],
          ],
          [
            12,
            15,
            "Stealing a Smoke",
            "1f6ac",
            "peer",
            "{n} rolled a cigarette from corn silk and dried leaves behind the barn.",
            [
              [
                "Try a puff",
                { Health: -2, Respect: 1 },
                "I smoked corn silk with {n} and coughed my lungs out.",
              ],
              ["Tell {him} it's foolish", { Respect: 1 }, "I told {n} smoking corn silk was foolish."],
            ],
          ],
          [
            12,
            16,
            "Singing School",
            "1f3b6",
            "The Singing Master",
            "A singing master has come to teach shape-note singing at the schoolhouse in the evenings.",
            [
              [
                "Sing the alto part",
                { Happiness: 6, Smarts: 2 },
                "I learned the alto part at singing school.",
              ],
              ["Sit by your sweetheart", { Happiness: 7 }, "I sat by my sweetheart at singing school."],
            ],
          ],
          [
            12,
            16,
            "Kerosene Lamp Fire",
            "1f525",
            "The Kitchen",
            "You knocked over a kerosene lamp and flames are licking up the curtain.",
            [
              ["Smother it with a rug", { Respect: 4 }, "I smothered the lamp fire with a rag rug."],
              [
                "Run for water",
                {},
                "I ran for water and the curtain burned up.",
                0.5,
                { Health: -6 },
                "I ran back with water and burned my hands on the curtain.",
              ],
            ],
          ],
          [
            12,
            16,
            "Shooting Match",
            "1f52b",
            "The Town",
            "The town is holding a turkey shoot, and the best shot takes home a gobbler.",
            [
              [
                "Enter the match",
                { Happiness: 6, Respect: 3 },
                "I won a turkey at the town shooting match.",
                0.3,
                { Happiness: -2 },
                "I missed the mark at the turkey shoot.",
              ],
              ["Watch", {}, "I watched the grown men shoot for turkeys."],
            ],
          ],
          [
            12,
            16,
            "Hired Girl",
            "1f9f9",
            "A Neighbor",
            "A wealthy neighbor needs a hired hand for the summer to cook, clean and tend the children.",
            [
              ["Take the work", { money: 40, Health: -2 }, "I worked as a hired hand for the summer."],
              ["Stay home", {}, "I stayed home and helped my own family."],
            ],
          ],
          [
            12,
            16,
            "Mail-Order Catalog",
            "1f4d2",
            "The Post Office",
            "The new mail-order catalog arrived, full of pictures of bicycles, dresses and pocketknives.",
            [
              [
                "Wish over every page",
                { Happiness: 5 },
                "I spent the evening wishing over the mail-order catalog.",
              ],
              [
                "Save up for a pocketknife",
                { money: -10, Happiness: 6 },
                "I saved my coins and ordered a pocketknife from the catalog.",
              ],
            ],
          ],
          [
            12,
            16,
            "Graduation Recital",
            "1f393",
            "The Schoolmaster",
            "You finished the eighth reader, and the schoolmaster wants you to give the closing speech.",
            [
              [
                "Give the speech",
                { Smarts: 3, Respect: 5 },
                "I gave the closing speech at the end of term.",
                0.6,
                { Happiness: -4 },
                "I froze halfway through my speech.",
              ],
              ["Let someone else", {}, "I let another pupil give the speech."],
            ],
          ],
          [
            13,
            16,
            "Courting Candle",
            "1f56f-fe0f",
            "peer",
            "{n} has come calling, and your father lit a short candle; the visit lasts only as long as it burns.",
            [
              [
                "Talk fast",
                { Happiness: 7, friend: 1 },
                "I talked with {n} as fast as I could before the candle died.",
              ],
              [
                "Sit in shy silence",
                { Happiness: 3 },
                "I sat in shy silence with {n} until the candle went out.",
              ],
            ],
          ],
          [
            13,
            16,
            "Barn Raising Lunch",
            "1f35e",
            "Your Mother",
            "The neighbors are raising a barn, and the women need help feeding forty men.",
            [
              [
                "Carry the dinner pails",
                { Respect: 4, Health: 1 },
                "I carried dinner pails to the men at the barn raising.",
              ],
              [
                "Climb the frame",
                { Happiness: 6 },
                "I climbed the barn frame until someone yelled at me.",
                0.7,
                { Health: -7 },
                "I fell from the barn frame and hurt my arm.",
              ],
            ],
          ],
          [
            13,
            16,
            "Dance Lessons",
            "1f483",
            "The Dancing Master",
            "A traveling dancing master is giving lessons in the waltz and the quadrille.",
            [
              [
                "Take lessons",
                { Happiness: 6, Looks: 1, money: -5 },
                "I learned the waltz from the dancing master.",
              ],
              [
                "Mock the dancers",
                { Happiness: 3, Respect: -2 },
                "I stood in the corner and mocked the dancers.",
              ],
            ],
          ],
          [
            13,
            16,
            "Normal School",
            "1f4da",
            "The Schoolmaster",
            "The schoolmaster thinks you could go to the normal school in the city and become a teacher.",
            [
              [
                "Study hard for it",
                { Smarts: 5, Happiness: 2 },
                "I studied every night hoping for the normal school.",
              ],
              ["Say the farm needs you", { Respect: 2 }, "I told the schoolmaster the farm needed me."],
            ],
          ],
          [
            13,
            17,
            "Canning Season",
            "1f9fa",
            "Your Mother",
            "The kitchen is steaming with jars of peaches, tomatoes and green beans for winter.",
            [
              [
                "Put up every jar",
                { Respect: 3, Health: 1 },
                "I put up a hundred jars of preserves with Mother.",
              ],
              [
                "Sneak a jar of peaches",
                { Happiness: 6, Respect: -1 },
                "I ate a whole jar of peaches behind the woodshed.",
              ],
            ],
          ],
          [
            13,
            17,
            "Horse Race",
            "1f3c7",
            "peer",
            "{n} challenges you to race horses down the county road to the mill.",
            [
              [
                "Race {him}",
                { Happiness: 8, friend: 1 },
                "I beat {n} to the mill by a length.",
                0.5,
                { Happiness: 3, friend: 1 },
                "{n} beat me to the mill, but it was a grand race.",
              ],
              ["Ride at a walk", {}, "I told {n} my horse was too old to race."],
            ],
          ],
          [
            13,
            17,
            "Lost Calf",
            "1f404",
            "Your Father",
            "A calf wandered off in the night, and Father sends you to find it before the wolves do.",
            [
              [
                "Search the creek bottom",
                { Respect: 4, Health: -1 },
                "I found the lost calf in the creek bottom and led it home.",
              ],
              [
                "Search till dark and give up",
                { Happiness: -3 },
                "I searched until dark but never found the calf.",
              ],
            ],
          ],
          [
            14,
            17,
            "Factory Town",
            "1f3ed",
            "peer",
            "{n} says there is good money working at the shoe factory in town.",
            [
              [
                "Go with {him}",
                { money: 60, Health: -3, friend: 1 },
                "I went with {n} to work at the shoe factory.",
              ],
              ["Stay on the farm", {}, "I stayed on the farm."],
            ],
          ],
          [
            14,
            17,
            "Sparking on the Porch",
            "1f319",
            "peer",
            "{n} is sitting with you on the porch swing while your parents pretend not to watch from the parlor window.",
            [
              ["Hold hands", { Happiness: 8, friend: 1 }, "I held hands with {n} on the porch swing."],
              [
                "Talk about the weather",
                { Happiness: 3 },
                "I talked about the weather with {n} for an hour.",
              ],
            ],
          ],
          [
            14,
            17,
            "Medical Book",
            "1f4d6",
            "The Doctor",
            "The town doctor lets you read his anatomy books and ride along on house calls.",
            [
              ["Ride along", { Smarts: 5, Respect: 2 }, "I rode along with the doctor on his rounds."],
              [
                "Faint at a bloodletting",
                { Smarts: 2, Happiness: -3 },
                "I fainted dead away watching the doctor bleed a patient.",
              ],
            ],
          ],
          [
            14,
            17,
            "County Spelling Match",
            "1f41d",
            "The County Superintendent",
            "You have been chosen to represent your schoolhouse at the county spelling match.",
            [
              [
                "Go and compete",
                { Smarts: 4, Respect: 4 },
                "I won the county spelling match.",
                0.4,
                { Respect: 2 },
                "I placed second at the county spelling match.",
              ],
              [
                "Get nervous and stay home",
                { Happiness: -3 },
                "I got cold feet and stayed home from the spelling match.",
              ],
            ],
          ],
          [
            14,
            17,
            "Logging Camp",
            "1fab5",
            "Your Uncle",
            "Your uncle says the logging camp up north pays good wages for strong young hands.",
            [
              [
                "Go to the camp",
                { money: 80, Health: -4, Respect: 3 },
                "I spent the winter at the logging camp.",
              ],
              ["Stay home", {}, "I passed on the logging camp."],
            ],
          ],
          [
            14,
            17,
            "Bustle and Corset",
            "1f457",
            "Your Mother",
            "Mother says you are old enough for your first proper grown-up outfit.",
            [
              ["Dress up proudly", { Looks: 3, Happiness: 4 }, "I wore my first grown-up outfit to church."],
              [
                "Complain it pinches",
                { Happiness: -2 },
                "I complained my new clothes pinched something awful.",
              ],
            ],
          ],
          [
            15,
            17,
            "Signing On",
            "2693",
            "A Ship's Mate",
            "A ship's mate in the harbor town is looking for young sailors bound for China.",
            [
              [
                "Sign the articles",
                { Happiness: 6, Health: -3, money: 50 },
                "I signed on as a ship's boy bound for China.",
                0.5,
                { Happiness: -4 },
                "Father hauled me off the dock before the ship sailed.",
              ],
              ["Walk away", {}, "I walked away from the harbor."],
            ],
          ],
          [
            15,
            17,
            "Family Bible",
            "1f4d6",
            "Your Grandmother",
            "Grandmother opens the family Bible and shows you the names of every ancestor written inside.",
            [
              [
                "Read the names",
                { Smarts: 2, Happiness: 4 },
                "I read every name in the family Bible with Grandmother.",
              ],
              ["Add your own name", { Respect: 3 }, "Grandmother let me write my name in the family Bible."],
            ],
          ],
          [
            15,
            17,
            "Coming of Age",
            "1f382",
            "Your Father",
            "Father takes you aside and says you are nearly grown, and asks what you mean to do with your life.",
            [
              ["Speak of a trade", { Respect: 4 }, "I told Father I meant to learn a trade."],
              ["Speak of going West", { Happiness: 4 }, "I told Father I dreamed of going West."],
              ["Say you don't know", { Happiness: -1 }, "I told Father I didn't know yet."],
            ],
          ],
        ],
        OLD_HANG = [
          [
            "Barn Dance",
            "freelife/apple/1f3bb.png",
            [12, 90],
            "wants to go to the barn dance with you on Saturday night",
            "went to the barn dance",
            "Grab your boots",
            "Not this time",
            ["Barn Dance", "Fiddle Night"],
            [
              "The fiddler played until his strings snapped.",
              "{He} swung you so hard in the reel you nearly flew into the hay.",
              "You both stamped your feet until the lanterns shook.",
            ],
            2,
          ],
          [
            "Church Social",
            "freelife/apple/26ea.png",
            [5, 100],
            "wants you to come to the church social",
            "went to the church social",
            "Bring a pie",
            "Stay home",
            ["Church Social", "Pie Supper"],
            [
              "{He} ate three slices of the minister's wife's pie.",
              "You both sang hymns until the candles burned low.",
              "{He} won the cake walk and shared the prize with you.",
            ],
          ],
          [
            "County Fair",
            "freelife/apple/1f404.png",
            [5, 100],
            "wants to go to the county fair to see {x}",
            "went to the county fair and saw {x}",
            "Let's go",
            "Maybe next year",
            ["County Fair", "Blue Ribbon Day"],
            [
              "{He} bought you a paper cone of roasted peanuts.",
              "You both guessed the weight of the prize hog.",
              "{He} tried to win a ribbon for {his} pickled beets.",
            ],
            0,
            [
              "the prize hogs",
              "the plowing contest",
              "the pie judging",
              "the biggest pumpkin in the county",
              "the horse pulling contest",
            ],
          ],
          [
            "Traveling Circus",
            "freelife/apple/1f3aa.png",
            [5, 100],
            "wants to go to the traveling circus with you",
            "went to the traveling circus",
            "Buy a ticket",
            "Pass",
            ["Circus Day", "Under the Big Top"],
            [
              "{He} could not stop staring at the elephant.",
              "The tightrope walker made you both hold your breath.",
              "{He} bought you a bag of roasted peanuts.",
            ],
          ],
          [
            "Medicine Show",
            "freelife/apple/2697-fe0f.png",
            [8, 100],
            "wants to watch the medicine show set up on the town green",
            "watched the medicine show on the town green",
            "Have a look",
            "Sounds like a swindle",
            ["Medicine Show", "Miracle Tonic"],
            [
              "The doctor swore his tonic could cure baldness and heartbreak alike.",
              "{He} nearly bought a bottle before you stopped {him}.",
              "A banjo player and a fire eater warmed up the crowd.",
            ],
          ],
          [
            "Ice Skating",
            "freelife/apple/2744-fe0f.png",
            [6, 70],
            "wants to go ice skating on the frozen pond",
            "went ice skating on the frozen pond",
            "Lace up",
            "Too cold",
            ["Skating on the Pond", "Frozen Pond"],
            [
              "{He} fell flat on {his} back and laughed until {he} cried.",
              "You skated arm in arm as the sun went down.",
              "Someone built a bonfire on the bank to warm your hands.",
            ],
            2,
          ],
          [
            "Sleigh Ride",
            "freelife/apple/1f6f7.png",
            [5, 100],
            "wants to take you on a sleigh ride through the snow",
            "went on a sleigh ride through the snow",
            "Bundle up",
            "Stay by the fire",
            ["Sleigh Ride", "Jingle Bells"],
            [
              "The sleigh bells jingled all the way across the valley.",
              "{He} tucked a buffalo robe over your knees.",
              "You both sang carols as the horses trotted along.",
            ],
          ],
          [
            "Picnic",
            "freelife/apple/1f9fa.png",
            [5, 100],
            "wants to have a picnic by the river",
            "had a picnic by the river",
            "Pack a basket",
            "Not today",
            ["River Picnic", "Lazy Afternoon"],
            [
              "{He} brought cold chicken and a jar of lemonade.",
              "You skipped stones until the shadows grew long.",
              "An ant colony helped itself to your bread.",
            ],
          ],
          [
            "Fishing",
            "freelife/apple/1f3a3.png",
            [6, 90],
            "wants to go fishing for {x} at the creek",
            "went fishing for {x} at the creek",
            "Dig some worms",
            "No thanks",
            ["Gone Fishing", "A Fine Catch"],
            [
              "{He} swore the one that got away was as long as {his} arm.",
              "You caught enough for supper.",
              "You both dozed off on the bank with your lines in the water.",
            ],
            2,
            ["trout", "catfish", "perch", "bass", "sunfish"],
          ],
          [
            "Hunting",
            "freelife/apple/1f98c.png",
            [12, 75],
            "wants to go hunting for {x} in the woods",
            "went hunting for {x} in the woods",
            "Fetch your rifle",
            "Not today",
            ["Hunting Trip", "Into the Woods"],
            [
              "{He} tracked the game for miles through the frost.",
              "You came home with something for the stewpot.",
              "{He} sneezed at the worst possible moment.",
            ],
            2,
            ["deer", "wild turkey", "rabbits", "quail", "ducks"],
          ],
          [
            "Hayride",
            "freelife/apple/1f33e.png",
            [8, 80],
            "wants to go on a hayride after the harvest",
            "went on a hayride after the harvest",
            "Climb aboard",
            "Not this time",
            ["Harvest Hayride", "Hayride"],
            [
              "{He} stuffed a handful of hay down the back of your collar.",
              "You sang songs under the harvest moon.",
              "The wagon bumped over every rut in the road.",
            ],
          ],
          [
            "Quilting Bee",
            "freelife/apple/1f9f5.png",
            [12, 100],
            "wants you to come to the quilting bee at the neighbor's house",
            "went to the quilting bee",
            "Thread a needle",
            "Not my sort of thing",
            ["Quilting Bee", "Patchwork"],
            [
              "{He} knew every bit of gossip in the county.",
              "The finished quilt was a proper work of art.",
              "You pricked your finger but nobody noticed the stain.",
            ],
          ],
          [
            "Horseback Ride",
            "freelife/apple/1f40e.png",
            [10, 70],
            "wants to go horseback riding {x}",
            "went horseback riding {x}",
            "Saddle up",
            "Not today",
            ["Horseback Ride", "Gallop"],
            [
              "{He} raced you to the old oak and won by a nose.",
              "Your horse stopped to eat every patch of clover.",
              "The wind in your face felt wonderful.",
            ],
            2,
            [
              "along the river",
              "through the meadows",
              "up into the hills",
              "down the old turnpike",
              "through the woods",
            ],
          ],
          [
            "Cards at the Tavern",
            "freelife/apple/1f0cf.png",
            [18, 100],
            "wants to play {x} at the tavern",
            "played {x} at the tavern",
            "Deal me in",
            "I'll pass",
            ["Card Night", "Lucky Hand"],
            [
              "{He} bluffed the whole table with nothing in {his} hand.",
              "You won a few coins from a sour old peddler.",
              "The tavern keeper threatened to throw you both out for laughing.",
            ],
            0,
            ["poker", "whist", "euchre", "cribbage", "faro"],
          ],
          [
            "Opera House",
            "freelife/apple/1f3ad.png",
            [12, 100],
            "wants to see {x} at the opera house",
            "saw {x} at the opera house",
            "Put on your best",
            "Not interested",
            ["Night at the Theater", "Curtain Call"],
            [
              "{He} wept openly at the final act.",
              "The gaslights dimmed and the whole house went quiet.",
              "{He} fell asleep and snored through the second act.",
            ],
            0,
            ["Hamlet", "Macbeth", "Rip Van Winkle", "The Pirates of Penzance", "Romeo and Juliet"],
          ],
          [
            "Lyceum Lecture",
            "freelife/apple/1f5e3-fe0f.png",
            [14, 100],
            "wants to hear a lecture on {x} at the lyceum hall",
            "heard a lecture on {x} at the lyceum hall",
            "Sounds fascinating",
            "Sounds dull",
            ["Lyceum Lecture", "An Evening of Learning"],
            [
              "{He} asked the speaker a question nobody understood.",
              "You both argued about it all the way home.",
              "The speaker talked for two hours without a sip of water.",
            ],
            0,
            [
              "the wonders of electricity",
              "phrenology",
              "temperance",
              "travels in the Holy Land",
              "astronomy",
              "the steam engine",
            ],
          ],
          [
            "Baseball",
            "freelife/apple/26be.png",
            [8, 45],
            "wants to play baseball in the meadow",
            "played baseball in the meadow",
            "Grab a bat",
            "Not today",
            ["Ball Game", "Home Run"],
            [
              "{He} hit the ball clear into the neighbor's cornfield.",
              "You caught a fly ball barehanded.",
              "The game ended when a cow wandered onto the field.",
            ],
            2,
          ],
          [
            "Regatta",
            "freelife/apple/1f6f6.png",
            [14, 100],
            "wants to watch the rowing regatta on the river",
            "watched the rowing regatta on the river",
            "Let's go",
            "Not interested",
            ["Regatta Day", "On the Riverbank"],
            [
              "{He} cheered so loud {he} lost {his} voice.",
              "A brass band played on the riverbank.",
              "You both made a friendly wager on the losing boat.",
            ],
          ],
        ],
        OLD_KEEP_SRC = new Set(["fam", "parent", "friend", "family", "adult"]),
        OLD_KEEP_KIND = new Set([
          "Love",
          "Romance",
          "Family",
          "Mother",
          "Sibling",
          "Parents",
          "Child",
          "Family Tree",
          "Emergency",
        ]),
        oldEvOk = (e) =>
          isOldEra() ? !!e.old || OLD_KEEP_SRC.has(e.src) || (!e.src && OLD_KEEP_KIND.has(e.kind)) : !e.old,
        OLD_WHO = {
          peer: () => [Math.max(2, state.age - 1), state.age + 2],
          child: () => [3, 10],
          adult: () => [25, 55],
          elder: () => [62, 88],
        },
        oldFill = (e, t) =>
          t
            ? e
                .replace(/\{full\}/g, t.full)
                .replace(/\{n\}/g, t.first)
                .replace(/\{He\}/g, "m" === t.g ? "He" : "She")
                .replace(/\{His\}/g, "m" === t.g ? "His" : "Her")
                .replace(/\{he\}/g, t.he)
                .replace(/\{him\}/g, t.him)
                .replace(/\{his\}/g, "m" === t.g ? "his" : "her")
                .replace(/\{kid\}/g, t.kid)
            : e,
        oldFx = (e, t, a) => {
          const { Respect: o, friend: n, ...s } = e || {};
          return (
            o && (state.respect = clamp((state.respect ?? 40) + o)),
            n && t && addFriend(t, rint(55, 80)),
            fx(s, a)
          );
        };
      OLD_EV_DATA.forEach(([e, t, a, o, n, s, r]) =>
        EVENTS.push({
          min: e,
          max: t,
          t: a,
          old: !0,
          src: "old",
          kind: "Life",
          again: 8,
          make() {
            const e = OLD_WHO[n] ? person(...OLD_WHO[n]()) : null;
            e && ((e.first = pickR(CREW_FIRST[e.g])), (e.last = pickR(CREW_LAST)));
            const t = (t) => oldFill(t, e),
              i = `freelife/apple/${o}.png`;
            return {
              ...(e ? personCard(e) : { who: n, avSrc: i }),
              iconSrc: i,
              title: a,
              desc: `${t(s)}<br><br>What will you do?`,
              feedback: !0,
              choices: r.map(([a, o, n, s, r, i]) => [
                t(a),
                () => {
                  const a = null == s || chance(s);
                  return oldFx(a ? o : r, e, t(a ? n : i));
                },
              ]),
            };
          },
        }),
      ),
        OLD_HANG.forEach(([e, t, [a, o], n, s, r, i, l, c, d = 0, u]) =>
          EVENTS.push({
            min: a,
            max: o,
            kind: "Friend",
            src: "hangout",
            old: !0,
            t: e,
            again: 3,
            ok: () => frLive(25).length > 0,
            make() {
              const a = any(frLive(25)),
                o = prOf(a.g),
                h = u ? any(u) : "",
                p = a.best ? "best friend" : "friend",
                m = (e) =>
                  e
                    .replace(/\{x\}/g, h)
                    .replace(/\{He\}/g, o.He)
                    .replace(/\{he\}/g, o.he)
                    .replace(/\{him\}/g, o.him)
                    .replace(/\{his\}/g, o.his);
              return {
                ...frCard(a),
                table: null,
                bars: null,
                iconSrc: t,
                title: e,
                desc: `Your ${p}, ${a.first}, ${m(n)}.<br><br>What will you do?`,
                choices: [
                  [
                    r,
                    () => {
                      const e = rint(5, 100),
                        t = Math.max(5, Math.min(100, e + rint(-35, 35)));
                      frRel(a, Math.round((e + t) / 20) - 2),
                        fx({ Happiness: Math.round((e - 30) / 10), ...(d ? { Health: d } : {}) }, "");
                      const n = chance(0.7) ? `<br><br>${m(any(c))}` : "";
                      return {
                        msg: `My ${p}, ${a.first}, and I ${m(s)}.`,
                        title: any(e >= 35 ? l : ["Dull", "Could have been better", "Not my cup of tea"]),
                        bars: joyBars(e, t, o),
                        text: `You and your ${p}, ${a.first}, ${m(s)}.${n}`,
                      };
                    },
                  ],
                  [
                    i,
                    () => (
                      frRel(a, -rint(2, 5)),
                      `I turned down my ${p}, ${a.first}'s, ${e.toLowerCase()} invitation.`
                    ),
                  ],
                ],
              };
            },
          }),
        );
      const famHead = (e) =>
          e.role
            ? parHead(e)
            : { who: `${e.first} ${e.last}`, av: "1f46a", person: { look: e.look, g: e.g, age: relAge(e) } },
        famRole = (e) => (e.role ? e.role.toLowerCase() : relLabel(e)),
        famPool = () => [
          ...aliveParents(),
          ...(state.family || []).filter(
            (e) =>
              ("sibling" === e.kind || "child" === e.kind) && !e.dead && !e.adoptedOut && relAge(e) >= 16,
          ),
        ],
        myKids = () =>
          (state.family || []).filter(
            (e) => "child" === e.kind && !e.dead && !e.adoptedOut && relAge(e) >= 3 && relAge(e) <= 17,
          ),
        petHis = (e) => ("f" === e.g ? "her" : "his");
      function partyPlanning(e) {
        jCard({
          tag: "Party",
          iconSrc: LEV + "party-planning.png",
          title: "Party Planning",
          lead: "How big and how wild do you want your party to be?",
          choices: [
            ["Small and calm", () => partyNight(e, 0.05, 4)],
            ["Small and wild", () => partyNight(e, 0.25, 7)],
            ["Big and calm", () => partyNight(e, 0.2, 8)],
            ["Big and wild", () => partyNight(e, 0.5, 12)],
          ],
        });
      }
      function partyNight(e, t, a) {
        const o = state.school;
        if (!chance(t + (e ? 0 : 0.15)))
          return (
            o && (o.popularity = clamp((o.popularity ?? 40) + Math.round(a / 2))),
            say("I threw a house party, and everyone had a great time."),
            renderStats(),
            notice("Party animal", "Your house party was a huge hit!", null, !0)
          );
        setTimeout(
          () =>
            jCard({
              tag: "Party",
              iconSrc: LEV + "party-disturbance.png",
              title: "Party Disturbance",
              lead: "The neighbors called the cops on your party!<br><br>What will you do?",
              surprise: !0,
              choices: [
                [
                  "Turn the music down",
                  () =>
                    chance(0.6)
                      ? (say("I talked the cops out of shutting down my party."),
                        notice("Close call", "The cops let you off with a warning.", null, !0))
                      : (aliveParents().forEach((e) => (e.rel = clamp(e.rel - 8))),
                        fx({ Happiness: -4 }, ""),
                        say("The cops shut down my party and called my parents."),
                        notice("Busted", "The cops shut down your party and called your parents.", null, !0)),
                ],
                [
                  "Hide and hope they leave",
                  () =>
                    chance(0.4)
                      ? (say("I hid until the cops left my party."),
                        notice("Phew", "The cops eventually gave up and left.", null, !0))
                      : (aliveParents().forEach((e) => (e.rel = clamp(e.rel - 10))),
                        fx({ Happiness: -5 }, ""),
                        say("The cops found me hiding during my party and called my parents."),
                        notice("Busted", "The cops found you and called your parents.", null, !0)),
                ],
                [
                  "Sneak out the back",
                  () => {
                    aliveParents().forEach((t) => (t.rel = clamp(t.rel - (e ? 4 : 12)))),
                      fx({ Happiness: -3 }, ""),
                      say("I snuck out the back when the cops showed up to my party."),
                      notice(
                        "Ditched",
                        "You snuck out, but your parents found out about the party anyway.",
                        null,
                        !0,
                      );
                  },
                ],
              ],
            }),
          300,
        );
      }
      const FEATURED = [
        {
          t: "Favorite Drink",
          i: "1f964",
          a: [2, 5],
          plain: "Childhood",
          make: () => ({
            desc: "After playing all morning, your mother says you need to drink something and asks what sounds good.<br><br>What will you choose?",
            choices: [
              ["Water", () => fx({ Health: 3 }, "I asked my mother for a glass of water.")],
              [
                "A glass of milk",
                () => fx({ Health: 2, Happiness: 1 }, "I asked my mother for a glass of milk."),
              ],
              ["Apple juice", () => fx({ Happiness: 3 }, "I asked my mother for some apple juice.")],
              [
                "Prune juice",
                () =>
                  fx(
                    { Happiness: -1, Health: 1 },
                    "I asked my mother for prune juice. I spent the afternoon on the toilet.",
                  ),
              ],
            ],
          }),
        },
        {
          t: "Vaccination",
          i: "1f489",
          a: [1, 5],
          par: "Mother",
          make: (e) => {
            const t = e.role.toLowerCase(),
              a = "Mother" === e.role ? "her" : "him";
            return {
              iconSrc: "health/vaccination.png",
              desc: `Your ${t} is taking you to the doctor's office to get vaccinated.<br><br>How will you behave?`,
              choices: [
                [
                  "Try to stay calm",
                  () => (
                    (e.rel = clamp(e.rel + 4)), fx({ Health: 5 }, "I stayed calm while I got vaccinated.")
                  ),
                ],
                [
                  "Throw a tantrum",
                  () => (
                    (e.rel = clamp(e.rel - 4)),
                    fx({ Health: 5, Happiness: -2 }, "I threw a tantrum while I got vaccinated.")
                  ),
                ],
                [
                  `Bite ${a}`,
                  () => (
                    (e.rel = clamp(e.rel - 10)), fx({ Health: 5 }, `I bit my ${t} while I got vaccinated!`)
                  ),
                ],
              ],
            };
          },
        },
        {
          t: "Integrity",
          i: "1f633",
          a: [13, 17],
          plain: "Childhood",
          ok: () => aliveParents().length > 0,
          make: () => ({
            desc: "You took your parents' car for a joyride and dented the fender.<br><br>What will you do?",
            choices: [
              [
                "Admit that I broke it",
                () => (
                  aliveParents().forEach((e) => (e.rel = clamp(e.rel - 3))),
                  fx({ Happiness: -3 }, "I admitted to my parents that I dented the car's fender.")
                ),
              ],
              [
                "It wasn't me",
                () =>
                  chance(0.5)
                    ? fx({ Happiness: 2 }, "I broke my parents' car and then lied about it.")
                    : (aliveParents().forEach((e) => (e.rel = clamp(e.rel - 12))),
                      fx(
                        { Happiness: -6 },
                        "I lied about denting my parents' car, but they found out and grounded me.",
                      )),
              ],
            ],
          }),
        },
        {
          t: "Cheater",
          i: "1f62e",
          a: [5, 12],
          ok: () => aliveParents("Mother").length && aliveParents("Father").length,
          par: "cheater",
          make: (e) => {
            const t = aliveParents().find((t) => t !== e),
              a = "Father" === e.role,
              o = e.role.toLowerCase(),
              n = t.role.toLowerCase();
            return {
              desc: `You're hiding in your parents' closet during a game of hide-and-seek when suddenly your ${o} enters the bedroom with a mysterious ${a ? "woman" : "man"}, and they begin kissing passionately.<br><br>What will you do?`,
              choices: [
                [
                  "Think nothing of it",
                  () =>
                    fx(
                      { Happiness: -2 },
                      `I saw my ${o} kissing a stranger, but I didn't think anything of it.`,
                    ),
                ],
                [
                  `Tell my ${n}`,
                  () => {
                    (t.rel = clamp(t.rel + 6)), (e.rel = clamp(e.rel - 15));
                    const s = `I reported my ${o}'s cheating to my ${n}.`,
                      r = rint(55, 100);
                    return (
                      window.FAMILY_DIV?.affair(e, r),
                      {
                        msg: s,
                        title: "Bearer of bad news",
                        text: `You reported your ${o}'s cheating to your ${n}.`,
                        bar: [a ? "Her Concern" : "His Concern", r],
                      }
                    );
                  },
                ],
              ],
            };
          },
        },
        {
          t: "Mischief Maker",
          i: "1f608",
          a: [8, 17],
          plain: "Crime",
          make: () => ({
            desc: "You're wondering how much trouble you'll get into if you do something a little bit naughty.<br><br>What will you do?",
            choices: [
              ["Ignore the thought", () => fx({ Smarts: 1 }, "I ignored the urge to cause trouble.")],
              [
                "Cause some trouble",
                () =>
                  chance(0.7)
                    ? fx({ Happiness: 4 }, pickR(MISCHIEF_WINS))
                    : (aliveParents().forEach((e) => (e.rel = clamp(e.rel - 5))),
                      fx({ Happiness: -4 }, "I got caught causing trouble and my parents grounded me.")),
              ],
            ],
          }),
        },
        {
          t: "Skipping School",
          i: "1f92b",
          a: [6, 17],
          kidAge: !0,
          ok: () => !!state.school,
          who: "Classmate",
          make: (e) => ({
            desc: `Your classmate, ${e.first}, wants you to skip class with ${e.him} and go to dinner instead.<br><br>What will you do?`,
            choices: [
              [
                `Refuse to go with ${e.him}`,
                () => fx({ Smarts: 1 }, `I refused to skip class with my classmate, ${e.first}.`),
              ],
              [
                `Go with ${e.him}`,
                () =>
                  chance(0.65)
                    ? (addFriend(e, rint(45, 70), "school"),
                      fx(
                        { Happiness: 5, Smarts: -2 },
                        `I skipped class with my classmate, ${e.first}, and went to dinner.`,
                      ))
                    : (setTimeout(() => schoolTrouble(1, !0, "skipping class", !0), 0),
                      fx(
                        { Happiness: -4 },
                        `I tried to skip class with my classmate, ${e.first}, but I got caught and was sent to the principal's office.`,
                      )),
              ],
              [
                `Report ${e.him} to the headmaster`,
                () =>
                  fx(
                    { Smarts: 1, Happiness: -1 },
                    `I reported my classmate, ${e.first}, to the headmaster for trying to skip class.`,
                  ),
              ],
            ],
          }),
        },
        {
          t: "Family Vacation",
          i: "2708-fe0f",
          a: [4, 16],
          plain: "Parents",
          ok: () => aliveParents().length > 0,
          make: () => {
            const e = pickR(VACATION_SPOTS),
              t = sibPhrase(),
              a = `Your parents took ${t} on a family vacation to ${e}.`,
              o = (o, n, s) => (
                aliveParents().forEach((e) => (e.rel = clamp(e.rel + n))),
                fx({ Happiness: o }, ""),
                {
                  msg: `My parents took ${t.replace(/^you\b/, "me").replace(/\byour\b/g, "my")} on a family vacation to ${e}.`,
                  title: "Vacay",
                  text: a,
                  bar: ["Enjoyment", s],
                }
              );
            return {
              desc: `Your parents want to take ${t} on a family vacation to ${e}.<br><br>How will you behave?`,
              choices: [
                ["Be appreciative", () => o(8, 5, rint(65, 100))],
                ["Complain but go", () => o(3, -3, rint(30, 70))],
                [
                  "Refuse to go",
                  () => (
                    aliveParents().forEach((e) => (e.rel = clamp(e.rel - 8))),
                    fx({ Happiness: -3 }, `I refused to go on a family vacation to ${e}.`)
                  ),
                ],
              ],
            };
          },
        },
        {
          t: "Sleepover Invitation",
          i: "1f4a4",
          a: [6, 13],
          kidAge: !0,
          who: "Friend",
          make: (e) => ({
            desc: `Your classmate, ${e.full}, has invited you to a sleepover at ${"he" === e.he ? "his" : "her"} house.<br><br>What will you do?`,
            choices: [
              [
                "Go",
                () => {
                  addFriend(e, rint(55, 85), "school"), fx({ Happiness: 7 }, "");
                  const t = prOf(e.g),
                    a = any(SLEEP_DARES);
                  return {
                    msg: `I went to a sleepover at ${e.first}'s house.`,
                    title: "Good times",
                    bars: joyBars(rint(25, 100), rint(25, 100), t, !0),
                    text: `You and your classmate, ${e.full}, ${any(SLEEP_DID)} at ${t.his} house.${a ? `<br><br>${a.replace(/\{him\}/g, t.him)}` : ""}`,
                  };
                },
              ],
              [
                "Make up an excuse",
                () => fx({ Happiness: -1 }, `I made up an excuse to get out of ${e.first}'s sleepover.`),
              ],
              [
                "Say I'm not interested",
                () =>
                  fx(
                    { Happiness: -1 },
                    `I told ${e.first} I wasn't interested in ${"he" === e.he ? "his" : "her"} sleepover.`,
                  ),
              ],
            ],
          }),
        },
      ];
      function featuredEvent(e) {
        return {
          kind: e.plain || e.who || "Family",
          make() {
            let t,
              a = { plain: !0 };
            if (e.par) {
              const o =
                "cheater" === e.par ? pickR(aliveParents()) : aliveParents(e.par)[0] || pickR(aliveParents());
              (t = o),
                (this.kind = o.role),
                (a = {
                  who: `${o.first} ${SURNAME}`,
                  av: PICON[o.role],
                  person: { look: o.look, g: o.gender, age: o.ageAtBirth + state.age },
                });
            } else if (e.kidAge) {
              const e = person(Math.max(5, state.age - 1), state.age + 1);
              (t = e), (a = { who: e.full, av: e.av, person: e });
            }
            return { ...a, icon: e.i, title: e.t, feedback: !0, ...e.make(t) };
          },
        };
      }
      function featuredRoll() {
        const e = FEATURED.filter(
          (e) =>
            "Vaccination" !== e.t &&
            !state.featSeen.has(e.t) &&
            state.age >= e.a[0] &&
            state.age <= e.a[1] &&
            (!e.ok || e.ok()) &&
            (!e.par || "cheater" === e.par || aliveParents(e.par).length || aliveParents().length) &&
            ("Cheater" !== e.t || chance(0.12)),
        );
        if (!e.length || !chance(0.45) || !flEventOk("extra")) return !1;
        const t = pickR(e);
        flEventTake("extra");
        return state.featSeen.add(t.t), queueRoll(() => openEvent(featuredEvent(t))), !0;
      }
      function parentMoment(e, t) {
        const a = "Mother" === t.role ? "mom" : "dad",
          o = "m" === t.gender ? "he" : "she",
          n = (e) =>
            e
              .replace(/\{mom\}/g, a)
              .replace(/\{Mom\}/g, a[0].toUpperCase() + a.slice(1))
              .replace(/\{first\}/g, t.first)
              .replace(/\{him\}/g, "he" === o ? "him" : "her")
              .replace(/\{his\}/g, "he" === o ? "his" : "her")
              .replace(/\{He\}/g, "he" === o ? "He" : "She")
              .replace(/\{he\}/g, o),
          s = t.ageAtBirth + state.age,
          r = (e, a) => (e && e.r && (t.rel = clamp(t.rel + e.r)), runFx(e, n(a)));
        return {
          who: `${t.first} ${SURNAME}`,
          av: PICON[t.role],
          icon: e.i || PICON[t.role],
          title: e.t,
          desc: n(e.d),
          person: { look: t.look, g: t.gender, age: s },
          table: [
            ["Name", `${t.first} ${SURNAME}`],
            ["Relation", t.role],
            ["Age", s],
          ],
          bars: [["Relationship", t.rel]],
          choices: e.c.map(([e, t, a, o, s, i]) => [
            n(e),
            () => afford(t.m < 0 ? t : s, () => (null == o || chance(o) ? r(t, a) : r(s, i))),
          ]),
        };
      }
      (state.vaxAge = rnd(4, 5)),
        document.getElementById("ageBtn").addEventListener("click", () => {
          state.dead ||
            state.featSeen.has("Vaccination") ||
            state.age < state.vaxAge ||
            !aliveParents().length ||
            (state.featSeen.add("Vaccination"),
            queuePopup(() => openEvent(featuredEvent(FEATURED.find((e) => "Vaccination" === e.t)))));
        });
      const evWrap = document.getElementById("evWrap"),
        ev = document.getElementById("ev");
      new MutationObserver(() => {
        ev.classList.toggle("ill", !!ev.querySelector("[data-green]")),
          ev.classList.toggle("ghostly", !!ev.querySelector("[data-ghost]"));
      }).observe(ev, { childList: !0 });
      const evSeen = () => (state.evSeen ||= {}),
        evKeyOf = (e) =>
          e.key || (e.t ? `t:${e.src || e.kind}:${e.t}` : e._title ? `title:${e._title}` : null),
        evGap = (e) => e.again ?? ("New Friend Request" === e.t ? 2 : 0),
        seenEv = (e) => {
          const t = e && evKeyOf(e);
          if (!t) return !1;
          const a = evSeen()[t],
            o = evGap(e);
          return null != a && (!o || state.age - a < o);
        },
        FL_EVENT_CAPS = { normal: 3, work: 5, extra: 1 },
        flEventCounts = () => {
          if (!state.flEventCounts || state.flEventCounts.year !== state.age)
            state.flEventCounts = { year: state.age, normal: 0, work: 0, extra: 0 };
          return state.flEventCounts;
        },
        flEventOk = (kind) => flEventCounts()[kind] < (FL_EVENT_CAPS[kind] || 0),
        flEventTake = (kind) => {
          flEventCounts()[kind]++;
        };
      function openEvent(e) {
        if (state.dead) return;
        const t = e.make();
        if (state.prison && !e.jail && (!t || "Death" !== t.title)) return;
        if (
          t &&
          "Death" !== t.title &&
          isModernText([t.title, t.desc, t.who, ...(t.choices || []).map((e) => e[0])].join(" "))
        )
          return;
        !e.t && !e.key && t && t.title && (e._title = t.title);
        const a = evKeyOf(e);
        a && (evSeen()[a] = state.age);
        const o = t.table
            ? `<table><tbody>${t.table.map(([e, t]) => `<tr><td><b>${e}:</b> ${t}</td></tr>`).join("")}</tbody></table>`
            : "",
          n = t.bars
            ? `<div class="ev-bars">${t.bars.map(([e, t, a, o]) => `<b>${e}</b><i><u class="${a || ""}" style="width:${Math.max(t, 3)}%;${a ? "" : `background:${o || barCol(t)}`}"></u></i>`).join("")}</div>`
            : "";
        ev.classList.toggle("death18", "Death" === t.title),
          openEvent.watch ||
            ((openEvent.watch = !0),
            new MutationObserver(() => {
              evWrap.classList.contains("open") || ev.classList.remove("death18");
            }).observe(evWrap, { attributes: !0, attributeFilter: ["class"] })),
          (ev.innerHTML = `\n      ${t.plain ? `<div class="jm-tag" style="margin-top:12px">${e.kind}</div>` : `<div class="ev-tag ${t.tagClass || ""}"><img class="ev-av" src="${t.avSrc || `emoji/${t.av}.png`}"><span class="who">${t.who}</span><span class="kind">${"Death" === t.title && is2018() ? "Death" : (t.kindText ?? e.kind)}</span></div>`}\n      <h4><img src="${t.iconSrc || `emoji/${t.icon}.png`}"><span>${t.title}</span></h4>\n      <div class="lead">${t.desc}</div>${o}${n}\n      ${t.choices.map((e, t) => `<button class="jm-apply ev-btn${e[2] && e[2].hi ? " ev-hi" : ""}" data-c="${t}">${e[0]}</button>`).join("")}\n      <div class="ev-surprise"><img src="emoji/1f3b2.png"><span>Surprise me!</span></div>`);
        const s = (a) => {
          evWrap.classList.remove("open"),
            "Crime" === e.kind && (screen.classList.remove("open"), mischief());
          let o = t.choices[a][1](),
            n = null;
          if (
            (o && "object" == typeof o && ((n = o), (o = n.msg)),
            log.lastElementChild.insertAdjacentHTML("beforeend", `<p>${o}</p>`),
            (log.scrollTop = log.scrollHeight),
            state.dead ||
              e.school ||
              !/\bdetention\b/i.test(o || "") ||
              /\bin detention\b/i.test(o || "") ||
              setTimeout(gotDetention, 0),
            pendingHit)
          ) {
            const e = pendingHit;
            return (pendingHit = null), showHit(e, t.then);
          }
          const s = n && (n.bars || (n.bar ? [n.bar] : null));
          !state.dead && n && n.title
            ? notice(
                n.title,
                n.text || toYou(o),
                t.then,
                !1,
                s
                  ? `<div class="ev-bars nb">${s.map(([e, t, a]) => `<b>${e}</b><i><u style="width:${t}%;background:${a || barCol(t)}"></u></i>`).join("")}</div>`
                  : "",
              )
            : !state.dead && o && (t.feedback || /Friend/.test(e.kind))
              ? notice(t.title, toYou(o), t.then)
              : t.then && t.then();
        };
        t.person &&
          ev
            .querySelector(".ev-av")
            .replaceWith(
              npcFace(
                t.person.look,
                t.person.g,
                t.person.age,
                "Bully" === e.kind || "Street" === e.kind || t.angry ? "angry" : "happy",
                "ev-av",
              ),
            ),
          ev.querySelectorAll("[data-c]").forEach(
            (e) =>
              (e.onclick = () => {
                const a = +e.dataset.c,
                  o = t.choices[a][2];
                if (o && o.confirm) return iosConfirm("Confirm", o.confirm, () => s(a));
                s(a);
              }),
          ),
          (ev.querySelector(".ev-surprise").onclick = () => s(rnd(0, t.choices.length - 1))),
          evWrap.classList.add("open");
      }
      const overlayOpen = () =>
          evWrap.classList.contains("open") ||
          jmWrap.classList.contains("open") ||
          toast.classList.contains("show") ||
          screen.classList.contains("open") ||
          !!document.querySelector(".notice-wrap") ||
          deathWrap.classList.contains("open") ||
          state.dead,
        toYou = (e) =>
          e
            .replace(/\bI'm\b/g, "You're")
            .replace(/\bI've\b/g, "You've")
            .replace(/\bI'd\b/g, "You'd")
            .replace(/\bI'll\b/g, "You'll")
            .replace(/\bmyself\b/g, "yourself")
            .replace(/\bMy\b/g, "Your")
            .replace(/\bmy\b/g, "your")
            .replace(/\bmine\b/g, "yours")
            .replace(/\bme\b/g, "you")
            .replace(/(^|[.!?]\s+)I\b/g, "$1You")
            .replace(/\bI\b/g, "you")
            .replace(/\b(You|you) was\b/g, "$1 were")
            .replace(/\b(You|you) am\b/g, "$1 are");
      document.getElementById("ageBtn").addEventListener(
        "click",
        (e) => {
          (evWrap.classList.contains("open") ||
            jmWrap.classList.contains("open") ||
            toast.classList.contains("show") ||
            document.querySelector(".notice-wrap") ||
            popupQueue.length) &&
            e.stopImmediatePropagation();
        },
        !0,
      ),
        document.getElementById("ageBtn").addEventListener("click", () => {
          if (state.prison) return;
          if (
            (null == state.nextDanger && (state.nextDanger = Math.max(state.age, 18) + rnd(8, 20)),
            state.age >= 18 && state.age >= state.nextDanger && chance(0.3))
          ) {
            const e = window.EVENT_RULES || {},
              t = (window.DANGER_EVENTS || []).filter(
                (t) =>
                  !evSeen()["danger:" + t.t] &&
                  (!e["danger:" + t.t] || !e["danger:" + t.t].when || e["danger:" + t.t].when()),
              );
            if (((state.nextDanger = state.age + rnd(10, 25)), t.length && flEventOk("extra"))) {
              const e = any(t);
              flEventTake("extra");
              return void queueRoll(() => openEvent(dangerEvent(e)), !0);
            }
          }
          if (featuredRoll()) return;
          if (jobReferralRoll()) return;
          if (badGradesSkip()) return;
          if (state.school && chance(0.3)) {
            const e = EVENTS.filter(
              (e) =>
                e.school &&
                oldEvOk(e) &&
                state.age >= e.min &&
                state.age <= e.max &&
                !seenEv(e) &&
                (!e.ok || e.ok()),
            );
            if (e.length && flEventOk("normal")) {
              const t = any(e);
              flEventTake("normal");
              return void queueRoll(() => {
                state.school && openEvent(t);
              }, !0);
            }
          }
          if (!chance(state.age < 18 ? 0.85 : 0.7)) return;
          const e = state.job,
            t = (e && e.group && window.WORK_EVENTS && WORK_EVENTS[e.group]) || [],
            a = (e && "walmart" === e.group && window.WORK_ROLE_EVENTS && WORK_ROLE_EVENTS[e.t]) || [],
            o = (e) => {
              const t = e.key || ((window.COWORKER_EVENTS || []).includes(e) ? "cw:" : "work:") + e.t,
                a = (window.EVENT_RULES || {})[t];
              return !evSeen()[t] && (!a || !a.when || a.when());
            },
            n = e && !isMil() ? careerEvents(e).filter(o) : [],
            s = [...t, ...a, ...a, ...n].filter(o);
          if (s.length && chance(n.length ? 0.45 : 0.35) && flEventOk("work")) {
            flEventTake("work");
            return void queueRoll(() => {
              state.job && openEvent(workEvent(any(s)));
            });
          }
          const r = (window.COWORKER_EVENTS || []).filter(o);
          if (e && e.coworkers && e.coworkers.length && r.length && !isMil() && chance(0.25) && flEventOk("work")) {
            flEventTake("work");
            return void queueRoll(() => {
              state.job && openEvent(workEvent(any(r)));
            });
          }
          const i = EVENTS.filter(
              (e) =>
                oldEvOk(e) &&
                state.age >= e.min &&
                state.age <= e.max &&
                (!e.ext || mods.extFamily) &&
                !seenEv(e) &&
                (!e.ok || e.ok()) &&
                (e.home ? state.age < 18 || ownsHome() : homeOk(e.txt)),
            ),
            l = isOldEra() ? i.filter((e) => e.old) : [],
            c = l.length && chance(0.7) ? any(l) : pickEvent(i);
          c &&
            flEventOk("normal") &&
            (flEventTake("normal"),
            queueRoll(() => {
              (c.ok && !c.ok()) || openEvent(c);
            }, !0));
        });
      const EV_PACKS = ["kid", "social", "parent", "fam", "spend", "fight", "hangout"],
        REQUESTED = new Set([
          "Mouth Noises",
          "Lunchtime",
          "Toy Time",
          "Gross Dinner",
          "Picking Teams",
          "Sibling Argument",
          "10th Birthday",
          "Talent Show",
          "Sleepover",
          "First Kiss",
          "School Dance",
          "School Fight",
          "Class Clown",
          "Bully",
          "House Party",
          "Parents Disapprove",
          "Prom Royalty",
          "Daredevil",
          "Name Calling",
          "Premarital Relations",
          "Best Friends",
          "Friend Needs Advice",
          "Concert",
          "New Friend Request",
          "Pet Kidnapping",
          "Emergency Rescue",
          "Witnessed Crime",
          "Quality Time",
          "Spat",
          "Child Behavior",
          "Proposal",
          "Pregnancy",
          "Squabble",
          "Virginity",
          "Canine Courtesy",
          "Behavior",
          "Date Night",
        ]),
        REQUESTED_INLINE = ["Friend", "Playtime", "Bully", "Animal", "Crush", "Romance"],
        evBucket = (e) =>
          REQUESTED.has(e.t) || (!e.src && REQUESTED_INLINE.includes(e.kind))
            ? "requested"
            : e.school || "school" === e.src
              ? "school"
              : EV_PACKS.includes(e.src)
                ? e.src
                : "story",
        BUCKET_W = {
          requested: 12,
          story: 3,
          school: 1,
          kid: 1,
          social: 1,
          parent: 1,
          fam: 1,
          spend: 1,
          fight: 1,
          hangout: 4,
        };
