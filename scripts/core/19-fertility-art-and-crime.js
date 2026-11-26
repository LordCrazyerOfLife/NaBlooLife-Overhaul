      function openFertility() {
        (sTitle.textContent = "FERTILITY"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const e = "f" === BIO(),
          t = (e, t, a) =>
            `<div class="row" data-fe="${e}"><img src="fertility/${e}.png"><div class="t"><b>${t}</b><span>${a}</span></div>${DOTS}</div>`;
        (sList.innerHTML =
          t(
            "donate",
            e ? "Donate Eggs" : "Donate Sperm",
            `Give your ${e ? "eggs" : "sperm"} to someone in need`,
          ) +
          t("ivf", "IVF", "Get in-vitro fertilization") +
          t("surrogate", e ? "Sperm Donor" : "Surrogate", e ? "Find a sperm donor" : "Hire a surrogate") +
          t("sterilize", e ? "Tubal Ligation" : "Vasectomy", "Get sterilized")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-fe]").forEach(
            (e) =>
              (e.onclick = () => {
                if ((play("choice"), "surrogate" !== e.dataset.fe)) return comingSoon();
                screen.classList.remove("open"), withLoading(openSurrogates);
              }),
          ),
          screen.classList.add("open");
      }
      function openSurrogates() {
        syncProfile();
        const e = "f" === BIO();
        (sTitle.textContent = e ? "SPERM DONORS" : "SURROGATES"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = X_ICON),
          (sBack.onclick = () => screen.classList.remove("open"));
        const t = Array.from({ length: 6 }, () => {
          const t = makeLover({ g: e ? "m" : "f", ages: e ? [21, 45] : [21, 38] });
          return (
            (t.cost = localPrice(
              e ? 1e3 * rint(2, 25) + 100 * rint(0, 9) : 1e3 * rint(45, 125) + 100 * rint(0, 9),
            )),
            (t.edu = t.prof.edu),
            t
          );
        });
        (sList.innerHTML = t
          .map(
            (e, t) =>
              `<div class="row" data-sg="${t}"><i class="face" data-sgf="${t}"></i><div class="t"><b>${e.first} ${e.last} <em>(Age ${loverAge(e)})</em></b><span>${usd(e.cost)}</span></div>${DOTS}</div>`,
          )
          .join("")),
          sList.querySelectorAll("i[data-sgf]").forEach((e) => {
            const a = t[+e.dataset.sgf];
            e.replaceWith(npcFace(a.look, a.g, loverAge(a), "happy", "face"));
          }),
          sList.querySelectorAll("[data-sg]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), surrogateCard(t[+e.dataset.sg]);
              }),
          ),
          (sList.scrollTop = 0),
          screen.classList.add("open");
      }
      const sgFace = (e, t) =>
          t.querySelector("img").replaceWith(npcFace(e.look, e.g, loverAge(e), "happy", "sg-face")),
        sgRole = (e) => ("m" === e.g ? "sperm donor" : "surrogate");
      function surrogateCard(e) {
        jCard({
          tag: "Fertility",
          iconSrc: "emoji/1f469.png",
          title: `${e.first} ${e.last}`,
          close: !0,
          lead: `Approach ${e.first} ${e.last} to be your ${sgRole(e)} today!`,
          rows: [
            ["Cost", usd(e.cost)],
            ["Age", loverAge(e)],
            ["Education", e.edu],
            ["Occupation", e.job],
          ],
          bars: [
            ["Looks", e.looks],
            ["Smarts", e.smarts],
            ["Craziness", e.crazy, barCol(100 - e.crazy)],
          ],
          choices: [[`Select ${herOf(e)}`, () => setTimeout(() => surrogateDonors(e), 80)]],
        }),
          sgFace(e, ev.querySelector("h4"));
      }
      const fertPartner = () =>
        (state.spouse && !state.spouse.dead ? state.spouse : null) || mainLover() || null;
      function surrogateDonors(e) {
        const t = fertPartner(),
          a = { first: state.first, last: SURNAME, g: PG(), you: !0 },
          o = "m" === e.g,
          n = sgRole(e),
          s = herOf(e),
          r = o ? [a] : [...("f" === BIO() ? [a] : []), ...(t && "f" === t.g ? [t] : []), e],
          i = o ? [e] : [...("m" === BIO() ? [a] : []), ...(t && "m" === t.g ? [t] : [])];
        i.length || i.push({ first: "Anonymous", last: "Donor", g: "m", anon: !0 });
        const l = (t) =>
          t
            .map(
              (t, a) =>
                `<option value="${a}">${t.first} ${t.last} (${((t) => (t.you ? "You" : t === e ? capWords(n) : t.anon ? "Anonymous" : loverTitle(t)))(t)})</option>`,
            )
            .join("");
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="sgX" style="left:-14px;top:-14px">${CARD_X}</div><div class="jm-tag" style="margin-top:12px">Fertility</div>\n      <h4><img src="emoji/1f469.png" alt=""><span>${e.first} ${e.last}</span></h4>\n      <div class="lead">Ask ${e.first} ${e.last} to be your ${n} today!</div>\n      <table class="jc"><tbody><tr><td><b>Cost:</b> ${usd(e.cost)}</td></tr></tbody></table>\n      <label class="hr-lab">Pick your egg donor:</label><div class="hr-sel"><select id="sgEgg">${l(r)}</select></div>\n      <label class="hr-lab">Pick your sperm donor:</label><div class="hr-sel"><select id="sgSperm">${l(i)}</select></div>\n      <button class="jm-apply ev-btn" data-c="1">Ask ${s}</button><button class="jm-apply ev-btn" data-c="0">Actually, never mind</button>\n      <div class="ev-surprise"><img src="emoji/1f3b2.png"><span>Surprise me!</span></div></div>`),
          sgFace(e, ev.querySelector("h4")),
          (ev.style.overflow = "visible");
        const c = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        document.getElementById("sgX").onclick = () => {
          play("dismiss"), c();
        };
        const d = (a) => {
          const o = r[+document.getElementById("sgEgg").value],
            s = i[+document.getElementById("sgSperm").value];
          if ((c(), !a)) return;
          if (state.money < e.cost)
            return notice(
              "Flat broke",
              `You can't afford to hire ${e.first} as your ${n}.`,
              null,
              !1,
              brokeRows(e.cost),
            );
          screen.classList.remove("open");
          const l = () => askSurrogate(e, o, s);
          if (!t || chance(clamp(t.rel) / 160)) return l();
          const d = loverTitle(t).toLowerCase(),
            u = "f" === t.g ? "She" : "He",
            h = "f" === t.g ? "her" : "him";
          setTimeout(
            () =>
              jCard({
                tag: loverTitle(t),
                person: { name: `${t.first} ${t.last}`, look: t.look, g: t.g, age: loverAge(t) },
                iconSrc: "fertility/surrogate.png",
                title: "Surrogate",
                lead: `Your ${d}, ${t.first}, is not interested in using a ${n}.<br><br>What will you do?`,
                surprise: !0,
                choices: [
                  [
                    `Argue with ${h}`,
                    () => {
                      if (((t.rel = clamp(t.rel - rint(5, 12))), chance(0.4)))
                        return (
                          say(
                            `I argued with my ${d}, ${t.first}, about using a ${n}. ${u} eventually came around.`,
                          ),
                          l()
                        );
                      say(`I argued with my ${d}, ${t.first}, about using a ${n}.`),
                        notice(
                          "Shut down",
                          `You argued with ${t.first}, but ${u.toLowerCase()} still doesn't want a ${n}.`,
                          null,
                          !0,
                        );
                    },
                  ],
                  [
                    "Proceed anyway",
                    () => {
                      (t.rel = clamp(t.rel - rint(10, 20))), (t.sgGrudge = !0), l();
                    },
                  ],
                  [
                    "Never mind then",
                    () => say(`I decided not to use a ${n} because my ${d}, ${t.first}, wasn't interested.`),
                  ],
                ],
              }),
            80,
          );
        };
        ev.querySelectorAll("[data-c]").forEach((e) => (e.onclick = () => d("1" === e.dataset.c))),
          (ev.querySelector(".ev-surprise").onclick = () => d(chance(0.5))),
          evWrap.classList.add("open");
      }
      const SG_NO = {
        health: [
          ["Not a chance", "{She}'s worried you won't live long enough to raise a child."],
          ["Bad omen", "{She} thinks you look way too sickly to be a parent."],
        ],
        age: [
          ["Too old", "{She} thinks you're too old to be starting a family."],
          ["No way", "{She} says you'd be mistaken for the kid's great-grandparent."],
        ],
        looks: [
          ["{She} was weird anyways", "{She} thinks you're a little too creepy to be parenting a child."],
          ["Rude", "{She} took one look at you and laughed."],
        ],
        any: [
          ["No money for you then", "{She} doesn't like your attitude."],
          ["Changed {her} mind", "{She} decided {she} isn't ready to help you have a child."],
          ["Not happening", "{She} got a bad vibe from you."],
        ],
      };
      function askSurrogate(e, t, a) {
        const o = state.stats.Health,
          n = state.stats.Looks,
          s = state.age,
          r = `${e.first} ${e.last}`,
          i = Math.max(
            0.05,
            Math.min(
              0.92,
              0.55 + (o - 50) / 160 + (n - 50) / 180 - 0.018 * Math.max(0, s - 40) - e.crazy / 600,
            ),
          );
        if (!chance(i)) {
          const t =
              o < 35 && chance(0.6)
                ? "health"
                : s > 55 && chance(0.6)
                  ? "age"
                  : n < 35 && chance(0.6)
                    ? "looks"
                    : "any",
            a = prOf(e),
            i = (e) =>
              e
                .replace(/\{She\}/g, a.He)
                .replace(/\{she\}/g, a.he)
                .replace(/\{her\}/g, a.his),
            [l, c] = pickR(SG_NO[t]).map(i);
          return (
            say(`I asked ${r} to be my ${sgRole(e)}, but ${a.he} refused.`),
            setTimeout(
              () => notice(l, `${r} has refused to be your ${sgRole(e)}.<br><br>${c}`, sgGrudge, !0),
              80,
            )
          );
        }
        if (((state.money -= e.cost), renderStats(), "m" === e.g))
          return (
            (state.babies ||= []).push({
              due: state.age + 1,
              keep: !0,
              role: "sperm donor",
              other: { first: e.first, last: e.last, g: "m", look: e.look },
            }),
            say(`I paid ${r} ${usd(e.cost)} to be my sperm donor. I'm now pregnant!`),
            fx({ Happiness: +rint(4, 9) }, ""),
            setTimeout(
              () =>
                notice(
                  "Pregnant!",
                  `${r} agreed to be your sperm donor.<br><br>You are now pregnant!`,
                  sgGrudge,
                  !0,
                ),
              80,
            )
          );
        const l = t.you || t === e ? (a.you || a.anon ? e : a) : t;
        (state.babies ||= []).push({
          due: state.age + 1,
          keep: !0,
          surrogate: { first: e.first, last: e.last },
          role: "surrogate",
          other: { first: l.first, last: l.last, g: l.g, look: l.look },
        }),
          say(`I paid ${r} ${usd(e.cost)} to be my surrogate. She's now pregnant with my baby!`),
          fx({ Happiness: +rint(4, 9) }, ""),
          setTimeout(
            () =>
              notice(
                "Pregnant!",
                `${r} agreed to be your surrogate and is now pregnant with your baby!`,
                sgGrudge,
                !0,
              ),
            80,
          );
      }
      function sgGrudge() {
        const e = fertPartner();
        if (!e || !e.sgGrudge) return;
        delete e.sgGrudge;
        const t = loverTitle(e).toLowerCase(),
          a = "f" === e.g ? "her" : "him",
          o = "f" === e.g ? "her" : "his",
          n = "f" === e.g ? "She" : "He";
        queuePopup(() =>
          jCard({
            tag: loverTitle(e),
            person: { name: `${e.first} ${e.last}`, look: e.look, g: e.g, age: loverAge(e), mood: "angry" },
            iconSrc: "emoji/1f92c.png",
            title: "Argument",
            lead: `Your ${t}, ${e.first}, is arguing with you because you went to a fertility clinic against ${o} wishes.<br><br>What will you do?`,
            surprise: !0,
            choices: [
              [
                `Apologize to ${a}`,
                () => {
                  (e.rel = clamp(e.rel + rint(3, 8))),
                    say(
                      `I apologized to my ${t}, ${e.first}, for going to a fertility clinic against ${o} wishes.`,
                    );
                },
              ],
              [
                `Argue back to ${a}`,
                () => {
                  if (((e.rel = clamp(e.rel - rint(8, 15))), e.rel < 20 && chance(0.5)))
                    return (
                      toEx(e),
                      say(
                        `My ${t}, ${e.first}, broke up with me after we argued about the fertility clinic.`,
                      ),
                      notice("Dumped", `${n} broke up with you!`, null, !0)
                    );
                  say(`I argued with my ${t}, ${e.first}, about the fertility clinic.`);
                },
              ],
            ],
          }),
        );
      }
      const modLooksName = () =>
          mods.modHair && mods.modSkin ? "Modded Looks" : mods.modSkin ? "Modded Skin & Eyes" : "Modded Hair",
        ART_SUBJECTS = {
          Landscape: [401, 411, 428, 429, 430, 431, 435, 439],
          Portrait: [403, 404, 405, 409, 410, 412, 416, 418, 425, 433],
          "Still Life": [400, 402, 421, 426, 427, 436],
          Abstract: [414, 417, 419, 423, 424, 434, 437, 438, 440],
          Animal: [413, 420, 422],
        },
        ART_MEDIUMS = {
          Oil: [60, 1.3],
          Acrylic: [30, 1],
          Watercolor: [25, 0.9],
          Charcoal: [10, 0.7],
          "Spray Paint": [40, 0.85],
        },
        ART_WORDS = {
          Landscape: [
            ["Sunset", "Morning", "Silent", "Golden", "Misty", "Distant", "Autumn", "Frozen"],
            ["Hills", "Harbor", "Valley", "Meadow", "Shore", "Forest", "Lake", "Fields"],
          ],
          Portrait: [
            ["Lady", "Old Man", "Stranger", "Dancer", "Sailor", "Girl", "Boy", "Widow"],
            [
              "in Blue",
              "with a Hat",
              "at the Window",
              "Smiling",
              "in Red",
              "Dreaming",
              "with Pearls",
              "Alone",
            ],
          ],
          "Still Life": [
            ["Bowl of", "Vase of", "Plate of", "Basket of", "Jar of", "Table of"],
            ["Lemons", "Sunflowers", "Pears", "Roses", "Apples", "Shells", "Candles", "Grapes"],
          ],
          Abstract: [
            ["Fractured", "Electric", "Silent", "Infinite", "Broken", "Liquid", "Neon", "Burning"],
            ["Thoughts", "Noise", "Geometry", "Echoes", "Memory", "Chaos", "Rhythm", "Static"],
          ],
          Animal: [
            ["Sleeping", "Wild", "Lonely", "Proud", "Curious", "Old", "Little", "Midnight"],
            ["Fox", "Dog", "Wolf", "Horse", "Cat", "Owl", "Stag", "Rabbit"],
          ],
        };
      state.art = {
        skill: rint(0, 12),
        fame: 0,
        fans: 0,
        sold: 0,
        fameOn: !1,
        made: {},
        classAge: -1,
        showAge: -1,
      };
      const FAME_AT = 100;
      function addFans(e) {
        const t = state.art;
        (t.fans += e),
          !t.fameOn &&
            t.fans >= FAME_AT &&
            ((t.fameOn = !0),
            (t.fame = Math.max(t.fame, 5)),
            renderStats(),
            say("People are starting to recognize me for my paintings."),
            setTimeout(
              () =>
                notice("Fame unlocked!", "So many people love your paintings that you are becoming famous!"),
              0,
            ));
      }
      const PRICE_TIERS = [
        [1, 0, "Market value"],
        [1.25, 25, "+25%"],
        [1.5, 100, "+50%"],
        [2, 300, "Double"],
        [3, 1e3, "Triple"],
      ];
      state.paintings = [];
      const artValue = (e) => {
          const t = Math.max(0, state.age - e.made),
            [, a] = ART_MEDIUMS[e.medium],
            o =
              (40 + (e.quality / 100) ** 2 * 9e3) *
              (1 + state.art.fame / 12) *
              (1 + Math.min(state.art.fans, 2e3) / 2e3) *
              a *
              1.07 ** t *
              (e.quality >= 95 ? 3 : 1);
          return 10 * Math.round(o / 10);
        },
        artStars = (e) => (e >= 95 ? "Masterpiece" : e >= 70 ? "High" : e >= 40 ? "Medium" : "Low"),
        artImg = (e) => `art/art-${e.sprite}.png`;
      let paintBack = null;
      function openPainting(e) {
        e && (paintBack = e);
        const t = state.art,
          a = t.made[state.age] || 0;
        (sTitle.textContent = "PAINTING"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = paintBack || openOccupation);
        const o = (e, t, a, o, n = DOTS, s) =>
          `<div class="row${s ? " dis" : ""}" data-pa="${e}"><img src="${t}"><div class="t"><b>${a}</b><span>${o}</span></div>${s ? "" : n}</div>`;
        (sList.innerHTML =
          `<div class="row"><img src="art/ui-palette.png"><div class="t"><b>${t.fame >= 60 ? "Famous Painter" : t.fameOn ? "Known Painter" : "Painter"} <em>(${t.fans.toLocaleString("en-US")} fans)</em></b>${sBar("Painting Skill", t.skill)}${t.fameOn ? sBar("Fame", t.fame) : sBar(`Fans (${Math.min(t.fans, FAME_AT)}/${FAME_AT} to Fame)`, Math.min(100, t.fans))}</div></div><div class="sec">Activities</div>` +
          o(
            "paint",
            "art/ui-palette.png",
            "Paint",
            `Create a new painting (${a}/3 this year)`,
            DOTS,
            a >= 3,
          ) +
          o(
            "class",
            "emoji/1f9d1-200d-1f3eb.png",
            "Art Class",
            t.classAge === state.age ? "Already took one this year" : `Improve your technique (${usd(150)})`,
            DOTS,
            t.classAge === state.age,
          ) +
          o(
            "show",
            "art/art-411.png",
            "Exhibition",
            t.showAge === state.age ? "Already held one this year" : "Show your paintings at a gallery",
            DOTS,
            t.showAge === state.age,
          ) +
          (state.paintings.length
            ? '<div class="sec">Your Paintings</div>' +
              state.paintings
                .map(
                  (e, t) =>
                    `<div class="row" data-art="${t}"><img src="${artImg(e)}"><div class="t"><b>"${e.title}" <em>(${e.medium} ${e.subject})</em></b><span class="sal">${usd(artValue(e))}</span></div>${CHEV}</div>`,
                )
                .join("")
            : "")),
          (sList.scrollTop = 0),
          sList
            .querySelectorAll("[data-art]")
            .forEach(
              (e) => (e.onclick = () => artCard(state.paintings[+e.dataset.art], () => openPainting())),
            ),
          sList.querySelectorAll("[data-pa]").forEach(
            (e) =>
              (e.onclick = () => {
                if (e.classList.contains("dis")) return;
                const a = e.dataset.pa;
                if ((play("choice"), "paint" === a)) return paintCard();
                if ("class" === a) {
                  const e = state.age < 18;
                  if (!e && state.money < 150)
                    return notice("Not enough", `You need ${usd(150)} for an art class.`);
                  e || (state.money -= 150);
                  const a = rint(4, 9);
                  return (
                    (t.skill = clamp(t.skill + a)),
                    (t.classAge = state.age),
                    renderStats(),
                    say(`I took an art class${e ? " (my parents paid for it)" : ""}.`),
                    notice(
                      "Art Class",
                      `You took an art class and learned new techniques.<br><br>Painting skill +${a}`,
                    ),
                    openPainting()
                  );
                }
                if ("show" === a) {
                  const e = state.paintings;
                  if (!e.length)
                    return notice("Exhibition", "You need at least one painting to hold an exhibition.");
                  const a = e.reduce((e, t) => e + t.quality, 0) / e.length,
                    o = a < 30 ? rint(0, 5) : Math.round(a / 2 + rint(5, 30)),
                    n = `${pickR(["The Velvet", "Blue Door", "Northside", "Gilded Frame", "Little Brick", "Modern Muse"])} Gallery`,
                    s = t.fameOn && a >= 30 ? rint(1, 4) : 0;
                  return (
                    (t.showAge = state.age),
                    (t.fame = clamp(t.fame + s)),
                    (state.stats.Happiness = clamp(state.stats.Happiness + (a >= 30 ? 6 : -3))),
                    renderStats(),
                    say(`I held an art exhibition at ${n}.`),
                    notice(
                      "Exhibition",
                      (a < 30
                        ? `Critics hated your exhibition at ${n}.`
                        : `Your exhibition at ${n} drew a big crowd!`) +
                        `<br><br>+${o} fans${s ? ` · Fame +${s}` : ""}`,
                    ),
                    addFans(o),
                    openPainting()
                  );
                }
              }),
          );
      }
      function paintCard() {
        (ev.innerHTML = `\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="jm-tag" style="margin-top:12px">Art</div>\n      <h4><img src="art/ui-palette.png" alt=""><span>Paint</span></h4>\n      <div class="lead">What do you want to paint?</div>\n      <label class="hr-lab">Pick your subject:</label>\n      <div class="hr-sel"><select id="pSubj">${Object.keys(
          ART_SUBJECTS,
        )
          .map((e) => `<option>${e}</option>`)
          .join(
            "",
          )}</select></div>\n      <label class="hr-lab">Pick your medium:</label>\n      <div class="hr-sel"><select id="pMed">${Object.entries(
          ART_MEDIUMS,
        )
          .map(([e, [t]]) => `<option value="${e}">${e}${state.age >= 18 ? ` (${usd(t)})` : ""}</option>`)
          .join("")}</select></div>\n      <button class="jm-apply ev-btn" id="pGo">Start painting</button>`),
          (ev.style.overflow = "visible");
        const e = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = e),
          (document.getElementById("pGo").onclick = () => {
            const t = document.getElementById("pSubj").value,
              a = document.getElementById("pMed").value,
              o = state.age >= 18 ? ART_MEDIUMS[a][0] : 0;
            if ((e(), state.money < o))
              return notice("Not enough", `You need ${usd(o)} for ${a.toLowerCase()} supplies.`);
            state.money -= o;
            const n = state.art,
              s = clamp(Math.round(0.75 * n.skill + rint(-15, 25) + state.stats.Smarts / 10));
            (n.skill = clamp(n.skill + (n.skill > 80 ? rint(0, 2) : rint(1, 4)))),
              (n.made[state.age] = (n.made[state.age] || 0) + 1);
            const [r, i] = ART_WORDS[t],
              l = `${pickR(r)} ${pickR(i)}`,
              c = {
                title: l,
                subject: t,
                medium: a,
                quality: s,
                made: state.age,
                sprite: pickR(ART_SUBJECTS[t]),
              };
            state.paintings.push(c), renderStats();
            const d = `${/^[aeiou]/i.test(a) ? "an" : "a"} ${a.toLowerCase()} ${t.toLowerCase()}`;
            say(`I painted "${l}", ${d}.`),
              notice(
                s >= 95 ? "Masterpiece!" : "New Painting",
                `You painted "${l}", ${d}.<br><br>Quality: ${artStars(s)}<br>Worth about ${usd(artValue(c))}`,
              ),
              openPainting();
          }),
          evWrap.classList.add("open");
      }
      function artCard(e, t) {
        const a = artValue(e),
          o = state.age - e.made;
        ev.innerHTML = `\n      <div class="jm-x" id="propX"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="jm-tag">Art</div>\n      <h4><img src="${artImg(e)}" alt=""><span>"${e.title}"</span></h4>\n      <div class="lead">Your ${e.medium.toLowerCase()} ${e.subject.toLowerCase()} painting.</div>\n      <table><tbody>\n        <tr><td><b>Value:</b> ${usd(a)}</td></tr>\n        <tr><td><b>Quality:</b> ${artStars(e.quality)}</td></tr>\n        <tr><td><b>Subject:</b> ${e.subject}</td></tr>\n        <tr><td><b>Medium:</b> ${e.medium}</td></tr>\n        <tr><td><b>Painted:</b> ${0 === o ? "This year" : `${o} year${o > 1 ? "s" : ""} ago`}</td></tr>\n        <tr><td><b>Your Fans:</b> ${state.art.fans.toLocaleString("en-US")}${state.art.fameOn ? ` · Fame ${state.art.fame}%` : ""}</td></tr>\n      </tbody></table>\n      <div class="ev-bars"><b>Quality</b><i><u style="width:${Math.max(2, e.quality)}%;background:${barCol(e.quality)}"></u></i></div>\n      <label class="hr-lab">Pick your list price:</label>\n      <div class="hr-sel"><select id="artPrice">${PRICE_TIERS.map(([e], t) => `<option value="${t}">${usd(10 * Math.round((a * e) / 10))}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" data-p="sell">${e.triedAge === state.age ? "No buyers until next year" : "Sell it"}</button>`;
        const n = () => evWrap.classList.remove("open");
        (document.getElementById("propX").onclick = n),
          (ev.querySelector('[data-p="sell"]').onclick = () => {
            if (e.triedAge === state.age) return;
            const o = +document.getElementById("artPrice").value,
              [s, r] = PRICE_TIERS[o];
            n();
            const i = 0 === o ? 0.95 : Math.min(0.9, 0.2 + (0.7 * state.art.fans) / r);
            if (!chance(i))
              return (
                (e.triedAge = state.age),
                say(
                  `I tried to sell my painting "${e.title}" for ${usd(10 * Math.round((a * s) / 10))}, but nobody bought it.`,
                ),
                notice(
                  "No buyers",
                  `Nobody was willing to pay ${usd(10 * Math.round((a * s) / 10))} for "${e.title}".<br><br>Try again next year. It'll be worth more by then.`,
                ),
                void (t && t())
              );
            const l = 10 * Math.round((a * s * (0.97 + 0.06 * Math.random())) / 10),
              c = Math.max(1, Math.round(e.quality / 4 + rint(0, 10))),
              d = state.art.fameOn ? Math.max(1, Math.round(e.quality / 30)) : 0;
            (state.money += l),
              state.art.sold++,
              (state.art.fame = clamp(state.art.fame + d)),
              state.paintings.splice(state.paintings.indexOf(e), 1),
              renderStats(),
              say(`I sold my painting "${e.title}" for ${usd(l)}.`),
              notice(
                "Sold!",
                `A collector bought your painting "${e.title}" for ${usd(l)}!<br><br>+${c} fans${d ? ` · Fame +${d}` : ""}`,
              ),
              addFans(c),
              t && t();
          }),
          evWrap.classList.add("open");
      }
      function sellPainting(e) {
        const t = artValue(e),
          a = Math.max(1, Math.round(e.quality / 2 + rint(5, 15)));
        return (
          (state.money += t),
          state.art.sold++,
          state.art.fameOn &&
            (state.art.fame = clamp(state.art.fame + Math.max(1, Math.round(e.quality / 30)))),
          state.paintings.splice(state.paintings.indexOf(e), 1),
          addFans(a),
          t
        );
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        const e = state.art;
        !state.dead &&
          e.fameOn &&
          ((e.fame = clamp(e.fame + rint(1, 3) + Math.floor(e.fans / 500))), renderStats());
      });
      const CRIMES = [
        ["arson", "fire", "Arson", "Light up a fire", 12],
        ["bank", "bank", "Bank Robbery", "Rob a bank", 16],
        ["burglary", "raccoon", "Burglary", "Burgle a home", 10],
        ["buydrugs", "pill", "Buy Drugs", "Buy drugs for yourself", 14],
        ["embezzle", "money-flying", "Embezzle", "Embezzle funds from work", 16],
        ["gta", "car-front", "Grand Theft Auto", "Steal a car", 14],
        ["hack", "laptop", "Hack", "Hack into someone's computer", 13],
        ["hitman", "hitman", "Hitman", "Arrange a contract killing", 18],
        ["kidnap", "chains", "Kidnapping", "Kidnap someone", 18],
        ["mischief", "mischief", "Mischief", "Engage in some mischief", 8],
        ["murder", "knife", "Murder", "Kill someone", 14],
        ["pickpocket", "jeans", "Pickpocket", "Pickpocket a stranger", 8],
        ["porch", "jolly-roger", "Porch Pirate", "Steal a neighbor's mail", 8],
        ["shoplift", "shopbags", "Shoplifting", "Steal merchandise from a store", 8],
        ["vandal", "palette", "Vandalism", "Deface someone's property", 8],
        ["jewel", "jewel", "Jewel Heist", "Attempt a jewelry store heist", 16],
        ["art", "artframe", "Art Theft", "Steal a valuable masterpiece", 18],
        ["counterfeit", "counterfeit", "Counterfeiting", "Deal in fake currency", 0],
        ["identity", "idcard.png", "Identity Theft", "Assume a stolen identity", 16],
        ["fraud", "fraud", "Fraud", "Run a dishonest scheme", 0],
        ["smuggle", "smuggle", "Smuggling", "Move forbidden goods", 0],
        ["launder", "launder", "Money Laundering", "Conceal illicit profits", 0],
        ["betting", "betting", "Illegal Betting", "Wager in an underground ring", 0],
        ["trespass", "trespass", "Trespassing", "Enter a restricted property", 0],
        ["streetrace", "streetrace", "Street Racing", "Enter an illegal street race", 0],
        ["drugs", "pill", "Sell Drugs", "Sell drugs on the black market", 13],
        ["train", "locomotive", "Train Robbery", "Rob a train", 16],
      ];
      state.record = 0;
      const CRIMES_OFF = new Set(["train"]),
        CRIMES_TAB_ONLY = new Set(["fraud", "launder", "betting", "trespass", "streetrace"]),
        CRIME_MODS = { drugs: "crimeDrugs" };
      function openCrime() {
        (sTitle.textContent = "CRIME"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities),
          (sList.innerHTML = CRIMES.filter(
            ([e]) =>
              (!CRIME_MODS[e] || mods[CRIME_MODS[e]]) && !(isOldEra() && ("gta" === e || "streetrace" === e)),
          )
            .map(([e, t, a, o, n]) => {
              const s =
                CRIMES_OFF.has(e) ||
                state.age < n ||
                ("embezzle" === e && !state.job) ||
                (isOldEra() && /^(launder|identity|art|counterfeit|jewel)$/.test(e));
              return `<div class="row${s ? " dis" : ""}" data-cr="${e}"><img src="crime/${/\.(png|svg|webp)$/.test(t) ? t : t + ".png"}"><div class="t"><b>${a}</b><span>${o}</span></div>${s ? "" : DOTS}</div>`;
            })
            .join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-cr]").forEach(
            (e) =>
              (e.onclick = () => {
                if (isOldEra() && /^(launder|identity|art|counterfeit|jewel)$/.test(e.dataset.cr))
                  return notice(
                    "Not available",
                    `${CRIMES.find((t) => t[0] === e.dataset.cr)[2]} isn't available in the 1800s.`,
                    null,
                    !0,
                  );
                if (CRIMES_OFF.has(e.dataset.cr))
                  return notice(
                    "Error",
                    `${CRIMES.find((t) => t[0] === e.dataset.cr)[2]} is not available right now.`,
                    null,
                    !0,
                  );
                if (e.classList.contains("dis") || CRIMES_TAB_ONLY.has(e.dataset.cr)) return;
                const t = CRIMES.find((t) => t[0] === e.dataset.cr);
                return "buydrugs" === t[0] && state.age >= t[4] && window.DRUG_USE
                  ? (play("choice"), DRUG_USE.open())
                  : state.age < t[4]
                    ? notice(t[2], `You're too young to ${t[3][0].toLowerCase() + t[3].slice(1)}.`)
                    : (play("choice"), void crimeEvent(t));
              }),
          );
      }
      function busted(e) {
        state.record++, arrest(e);
      }
      const attempt = (e, t, a, o) =>
          chance(e) ? t() : (busted(a, o), `I tried to commit ${a}, but I got caught.`),
        victims = () => [
          ...state.parents
            .filter((e) => !e.dead)
            .map((e) => ({
              name: `${e.first} ${SURNAME}`,
              rel: `your ${e.role.toLowerCase()}`,
              title: e.role,
              g: e.gender,
              look: e.look,
              age: e.ageAtBirth + state.age,
              love: e.rel,
              parent: !0,
              kill: () => {
                (e.dead = !0), (e.diedAt = state.age);
              },
            })),
          ...state.family
            .filter((e) => !e.dead && relAge(e) >= 1 && famOn(e))
            .map((e) => ({
              name: `${e.first} ${e.last}`,
              rel: `your ${relLabel(e)}`,
              title: relTitle(e),
              g: e.g,
              look: e.look,
              age: relAge(e),
              love: e.rel,
              kill: () => {
                (e.dead = !0), (e.diedAt = state.age), (e.diedAge = relAge(e));
              },
            })),
          ...state.friends.map((e) => ({
            name: `${e.first} ${e.last}`,
            rel: "your friend",
            title: "Friend",
            g: e.g,
            look: e.look,
            age: friendAge(e),
            love: e.rel,
            kill: () => state.friends.splice(state.friends.indexOf(e), 1),
          })),
        ],
        MURDER_METHODS = [
          ["Drive-By", "performed a drive-by shooting on {v}"],
          ["Electrocute Them", "electrocuted {v}"],
          ["Burn Them", "set {v} on fire"],
          ["Push Down Stairs", "pushed {v} down the stairs"],
          ["Bear Trap", "caught {v} in a bear trap"],
          ["Strangle Them", "strangled {v}"],
          ["Poison Them", "poisoned {v}"],
          ["Stab Them", "stabbed {v}"],
          ["Drown Them", "drowned {v}"],
          ["Run Them Over", "ran over {v} with a car"],
          ["Hit Them With a Bat", "beat {v} with a baseball bat"],
        ];
      function victimDies(e, t) {
        return (
          e.kill(),
          [...state.parents, ...state.family, ...state.friends].forEach((e) => {
            e.dead || (e.rel = rint(0, 3));
          }),
          renderStats(),
          deathQueue.push({
            name: e.name,
            title: e.title,
            age: e.age,
            look: e.look,
            g: e.g,
            rel: e.love,
            parent: e.parent,
            murdered: !0,
          }),
          setTimeout(showDeaths, 400),
          t
        );
      }
      function tagCard({
        tag: e = "Crime",
        iconSrc: t,
        title: a,
        lead: o,
        rows: n = [],
        choices: s,
        surprise: r = !0,
      }) {
        ev.innerHTML = `<div class="jcw"><div class="jm-tag" style="margin-top:12px">${e}</div>\n      <h4><img src="${t}" alt=""><span>${a}</span></h4>\n      <div class="lead">${o}</div>\n      ${n.length ? `<table class="jc"><tbody>${n.map(([e, t]) => `<tr><td><b>${e}:</b> ${t}</td></tr>`).join("")}</tbody></table>` : ""}\n      ${s.map((e, t) => `<button class="jm-apply ev-btn" data-c="${t}">${e[0]}</button>`).join("")}\n      ${r ? '<div class="ev-surprise"><img src="emoji/1f3b2.png"><span>Surprise me!</span></div>' : ""}</div>`;
        const i = (e) => {
          evWrap.classList.remove("open"), s[e][1]();
        };
        ev.querySelectorAll("[data-c]").forEach((e) => (e.onclick = () => i(+e.dataset.c)));
        const l = ev.querySelector(".ev-surprise");
        l && (l.onclick = () => i(rint(0, s.length - 1))), evWrap.classList.add("open");
      }
      const HITMEN = [
          ["Al Capone", "m"],
          ["Shao Kahn", "m"],
          ["Jango Fett", "m"],
          ["Arya Stark", "f"],
          ["Jane Smith", "f"],
          ["John Wick", "m"],
          ["Agent 47", "m"],
          ["Boba Fett", "m"],
          ["Anton Chigurh", "m"],
          ["Elektra", "f"],
          ["The Bride", "f"],
          ["Leon", "m"],
          ["Mr. Smith", "m"],
          ["Villanelle", "f"],
          ["Hanzo", "m"],
          ["La Femme Nikita", "f"],
          ["Deadshot", "m"],
          ["Black Widow", "f"],
        ],
        HIT_WEAPONS = [
          "a bow & arrow",
          "a sniper rifle",
          "a sickle",
          "a poison dart",
          "a katana",
          "piano wire",
          "a car bomb",
          "a crossbow",
          "a chainsaw",
          "a pencil",
          "a frying pan",
          "a pillow",
          "a nail gun",
          "a garden hoe",
          "a golf club",
        ];
      function hitmanCard(e) {
        (ev.innerHTML = `\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="jm-tag" style="margin-top:12px">Crime</div>\n      <h4><img src="crime/hitman.png" alt=""><span>Hitman</span></h4>\n      <div class="lead">You're thinking about hiring a hitman to take care of someone.</div>\n      <label class="hr-lab">Pick your victim:</label>\n      <div class="hr-sel"><select id="hVictim">${e.map((e, t) => `<option value="${t}">${e.name} (${e.title})</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="hGo">Look for a hitman</button>`),
          (ev.style.overflow = "visible");
        const t = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = t),
          (document.getElementById("hGo").onclick = () => {
            const a = e[+document.getElementById("hVictim").value];
            t(), screen.classList.remove("open");
            const [o, n] = pickR(HITMEN),
              s = "f" === n ? "She" : "He",
              r = "f" === n ? "her" : "him",
              i = 1e3 * rint(10, 45) + 100 * rint(0, 9),
              l = a.name.split(" ")[0],
              c = a.rel.replace("your ", "my ");
            say(
              `I contacted a hitman named ${o} to explore the possibility of whacking out ${c}, ${l}. ${s} quoted me ${usd(i)} to get the job done.`,
            ),
              setTimeout(
                () =>
                  tagCard({
                    iconSrc: "crime/hitman.png",
                    title: o,
                    lead: `You found a hitman going by the name of ${o} who is willing to pull off the hit on ${a.rel}, ${l}.<br><br>What will you do?`,
                    rows: [["Cost", usd(i)]],
                    choices: [
                      [`Hire ${r}`, () => hireHitman(a, o, n, i)],
                      ["Actually, never mind", () => say(`I decided not to hire ${o}.`)],
                    ],
                  }),
                250,
              );
          }),
          evWrap.classList.add("open");
      }
      function hireHitman(e, t, a, o) {
        if (state.money < o)
          return (
            say(`I couldn't afford to hire ${t}.`),
            notice(
              "Not enough",
              `You don't have enough money to hire ${t}.<br><br>You are ${usd(o - state.money)} short.`,
            )
          );
        (state.money -= o), renderStats(), say("I agreed to go through with it.");
        const n = "f" === a ? "her" : "him",
          s = "f" === a ? "Her" : "His",
          r = Math.random();
        if (r < 0.55) {
          const a = pickR(HIT_WEAPONS);
          return (
            say(`${t} pulled off the hit on ${e.rel.replace("your ", "my ")} using ${a}!`),
            victimDies(e, ""),
            chance(0.12) && setTimeout(() => arrest("arranging a contract killing"), 900),
            notice("Job done", `Your hitman, ${t}, pulled off the hit on ${e.rel} using ${a}!`)
          );
        }
        if (r < 0.7)
          return (
            say(`${t} ran off with my money!`),
            notice(
              "Call the cops!",
              `Your hitman, ${t}, ran off with your money without pulling off the hit on ${e.rel}!`,
            )
          );
        if (r < 0.85)
          return (
            say(`${t} turned out to be an undercover cop!`),
            notice("Killer cop", `Your hitman, ${t}, turned out to be an undercover cop!`),
            busted("conspiracy to commit murder", 4)
          );
        const i = 1e3 * rint(3, 12) + 100 * rint(0, 9),
          l = pickR(HIT_WEAPONS);
        setTimeout(
          () =>
            tagCard({
              iconSrc: "crime/hitman.png",
              title: t,
              lead: `Your hitman, ${t}, is now threatening to kill you with ${l} too unless you pay ${n} another ${usd(i)}!<br><br>What will you do?`,
              choices: [
                [
                  `Tell ${n} a deal is a deal`,
                  () => {
                    if (chance(0.5))
                      return (
                        say(`I told ${t} a deal is a deal. ${s} threat was a bluff.`),
                        victimDies(e, ""),
                        notice("Job done", `${t} backed down and pulled off the hit on ${e.rel}!`)
                      );
                    (state.stats.Health = clamp(state.stats.Health - rint(20, 40))),
                      renderStats(),
                      hurt(),
                      say(`${t} attacked me with ${l}!`),
                      notice("Attacked!", `${t} attacked you with ${l}! You barely escaped with your life.`);
                  },
                ],
                [
                  "Call the police",
                  () => {
                    say(`I called the police on my hitman, ${t}.`),
                      notice("Call the cops!", `The police arrested ${t}… and questioned you about the hit.`),
                      chance(0.5) && busted("arranging a contract killing", 4);
                  },
                ],
                [
                  "Run for my life",
                  () => {
                    say(`I ran for my life from my hitman, ${t}.`),
                      notice(
                        "Run!",
                        `You ran for your life and ${t} lost track of you. ${She2(a)} also kept your money.`,
                      );
                  },
                ],
                [
                  `Pay ${n} the extra ${usd(i)}`,
                  () => {
                    if (state.money < i)
                      return notice("Not enough", `You can't afford to pay ${t} ${usd(i)}!`);
                    (state.money -= i), renderStats();
                    const a = pickR(HIT_WEAPONS);
                    say(`I paid ${t} another ${usd(i)}. ${t} pulled off the hit using ${a}!`),
                      victimDies(e, ""),
                      notice("Job done", `Your hitman, ${t}, pulled off the hit on ${e.rel} using ${a}!`);
                  },
                ],
              ],
            }),
          250,
        );
      }
      const She2 = (e) => ("f" === e ? "She" : "He"),
        ATTACK_WEAPONS = [
          "a baseball bat",
          "a kitchen knife",
          "a hammer",
          "a frying pan",
          "a crowbar",
          "a golf club",
          "a lamp",
          "a wrench",
          "a broken bottle",
          "a chair",
          "a fire poker",
          "a shovel",
          "their bare hands",
          "a tire iron",
        ];
      function survivorAttack(e) {
        const t = pickR(ATTACK_WEAPONS),
          a = (e.g, e.rel.replace("your ", "my ")),
          o = () => (
            hurt(),
            chance(0.5)
              ? (setTimeout(() => die(`injuries from being attacked by ${a}, ${e.name}, with ${t}`), 900),
                `${e.name} attacked me with ${t}.`)
              : ((state.stats.Health = clamp(state.stats.Health - rint(35, 60))),
                (state.stats.Happiness = clamp(state.stats.Happiness - 10)),
                renderStats(),
                `${e.name} attacked me with ${t}! I was seriously injured.`)
          );
        openEvent({
          kind: e.title,
          make: () => ({
            who: e.name,
            av: "1f4a5",
            icon: "1f4a5",
            title: "Attacked!",
            feedback: !0,
            angry: !0,
            person: { look: e.look, g: e.g, age: e.age },
            desc: `${e.rel[0].toUpperCase() + e.rel.slice(1)}, ${e.name.split(" ")[0]}, survived your attack and is coming after you with ${t}!<br><br>What will you do?`,
            choices: [
              ["Fight back", o],
              ["Try to run", o],
              ["Beg for mercy", o],
            ],
          }),
        });
      }
      function murderCard(e) {
        (ev.innerHTML = `\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="jm-tag" style="margin-top:12px">Crime</div>\n      <h4><img src="crime/knife.png" alt=""><span>Murder</span></h4>\n      <div class="lead">You're really feeling like you shouldn't be doing this.</div>\n      <label class="hr-lab">Pick your victim:</label>\n      <div class="hr-sel"><select id="mVictim">${e.map((e, t) => `<option value="${t}">${e.name} (${e.title})</option>`).join("")}</select></div>\n      <label class="hr-lab">Pick your method:</label>\n      <div class="hr-sel"><select id="mMethod">${MURDER_METHODS.map(([e], t) => `<option value="${t}">${e}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="mGo">Commit the murder</button>`),
          (ev.style.overflow = "visible");
        const t = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = t),
          (document.getElementById("mGo").onclick = () => {
            const a = e[+document.getElementById("mVictim").value],
              [, o] = MURDER_METHODS[+document.getElementById("mMethod").value],
              n = "f" === a.g ? "She" : "He",
              s = a.rel.replace("your ", "my ");
            t(), screen.classList.remove("open"), mischief();
            const r = mods.neverCaught ? 0.85 * Math.random() : Math.random();
            return r < 0.45
              ? (say(`I ${o.replace("{v}", s)}! ${n} died.`),
                (state.stats.Happiness = clamp(state.stats.Happiness - 8)),
                victimDies(a, ""),
                !mods.neverCaught && chance(0.3) && setTimeout(() => arrest("murder"), 900),
                notice("Don't tell a soul", `You ${o.replace("{v}", a.rel)}!<br><br>${n} died.`))
              : r < 0.85
                ? (say(`I tried to murder ${s}, ${a.name}, but ${n.toLowerCase()} survived.`),
                  notice("Botched", `You ${o.replace("{v}", a.rel)}, but ${n.toLowerCase()} survived!`),
                  queuePopup(() => survivorAttack(a)))
                : (say(`I tried to murder ${s}, ${a.name}.`), void busted("attempted murder", 4));
          }),
          evWrap.classList.add("open");
      }
      const CHARGES = {
          murder: [15, 40, !0],
          "attempted murder": [6, 18],
          "arranging a contract killing": [12, 30, !0],
          "conspiracy to commit murder": [8, 20],
          "bank robbery": [5, 15],
          "train robbery": [6, 16],
          "grand theft auto": [2, 6],
          burglary: [1, 5],
          embezzlement: [2, 8],
          hacking: [1, 4],
          shoplifting: [1, 2],
          arson: [2, 10],
          kidnapping: [8, 25],
          "drug dealing": [2, 10],
          vandalism: [1, 2],
          "identity theft": [1, 6],
          pickpocketing: [1, 2],
          "mail theft": [1, 2],
          trespassing: [1, 1],
          "making prank calls": [1, 1],
          extortion: [1, 5],
          racketeering: [5, 20],
          "escaping prison": [3, 8],
          assault: [1, 6],
          desertion: [2, 5],
          "selling a Medal of Honor": [1, 1],
          "dereliction of duty": [1, 3],
          "disobeying orders": [1, 4],
          "starting a prison riot": [2, 5],
          "account theft": [1, 4],
          "drug possession": [1, 2],
          "making threats": [1, 4],
          "making terroristic threats": [2, 10],
          "wire fraud": [1, 5],
          bribery: [1, 5],
          blackmail: [1, 6],
          robbery: [2, 8],
          "solicitation of murder": [5, 20],
        },
        CHARGES_1800 = {
          murder: [20, 40, "cap"],
          "attempted murder": [5, 15],
          "arranging a contract killing": [15, 30, "cap"],
          "conspiracy to commit murder": [7, 20],
          "solicitation of murder": [5, 15],
          "bank robbery": [10, 25, "west"],
          "train robbery": [10, 30, "west"],
          robbery: [5, 15, "west"],
          burglary: [2, 10],
          embezzlement: [3, 10],
          shoplifting: [1, 2],
          arson: [5, 20, "rare"],
          kidnapping: [10, 30, "rare"],
          vandalism: [1, 1],
          pickpocketing: [1, 3],
          "mail theft": [2, 5],
          trespassing: [1, 1],
          extortion: [2, 7],
          blackmail: [2, 7],
          bribery: [1, 5],
          "escaping prison": [3, 8],
          assault: [1, 5],
          desertion: [2, 5, "mil"],
          "disobeying orders": [1, 4, "mil"],
          "dereliction of duty": [1, 3],
          "horse theft": [5, 15, "west"],
          "cattle rustling": [3, 10, "west"],
          counterfeiting: [5, 15],
          "starting a prison riot": [2, 6],
          "making threats": [1, 3],
        },
        DP_ODDS_1800 = { cap: 0.5, west: 0.07, mil: 0.15, rare: 0.04 },
        PRISONS_1800 = () =>
          "us" === state.country
            ? [
                ["Eastern State Penitentiary", 1829],
                ["Sing Sing Prison", 1826],
                ["Auburn State Prison", 1817],
                ["Joliet Penitentiary", 1858],
                ["San Quentin State Prison", 1852],
                ["Yuma Territorial Prison", 1876],
                ["Huntsville State Penitentiary", 1849],
                ["Newgate State Prison", 1800],
              ]
            : [
                ["Newgate Prison", 1800],
                ["Pentonville Prison", 1842],
                ["Dartmoor Prison", 1809],
                ["Millbank Penitentiary", 1816],
                ["Wandsworth Prison", 1851],
              ],
        LAW_FIRMS = [
          "Wright & Associates",
          "Phelps & Associates",
          "Lukes & Williamson",
          "Ito & Matsuda",
          "Castillo Law Group",
          "Hammond & Pierce",
          "Goldberg Legal",
        ],
        PRISON_WORDS = [
          "Glacier",
          "Iron Ridge",
          "Blackwater",
          "Red Rock",
          "Stonegate",
          "Pine Hollow",
          "Dusty Creek",
          "Granite Falls",
          "Shadow Valley",
          "Coldwater",
          "Riverbend",
          "Eagle Peak",
        ],
        EXEC_METHODS = ["Electric Chair", "Lethal Injection", "Firing Squad", "Gas Chamber", "Hanging"],
        NUM_WORDS = [
          "No",
          "One",
          "Two",
          "Three",
          "Four",
          "Five",
          "Six",
          "Seven",
          "Eight",
          "Nine",
          "Ten",
          "Eleven",
          "Twelve",
        ],
        ordN = (e) => e + (e % 100 >= 11 && e % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][e % 10] || "th"),
        capFirst = (e) => e[0].toUpperCase() + e.slice(1),
        yrs = (e) => `${e} year${1 === e ? "" : "s"}`,
        X_RED =
          '<svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg>',
        whenClear = (e) =>
          overlayOpen() || deathQueue.length || state.funeralPending
            ? setTimeout(() => whenClear(e), 450)
            : e();
      function jCard({
        tag: e = "Justice",
        brick: t,
        green: a,
        person: o,
        iconSrc: n,
        title: s,
        lead: r,
        rows: i = [],
        barsTitle: l,
        bars: c = [],
        choices: d = [],
        surprise: u,
        close: h,
        ok: p,
      }) {
        if (state.dead) return;
        if (runPopupQueue.auto && isModernText([e, s, r, ...d.map((e) => e[0])].join(" "))) return;
        const m = o
          ? `<div class="ev-tag${t ? " brick" : ""}" style="margin-top:12px"><img class="ev-av" src="emoji/1f464.png"><span class="who">${o.name}</span><span class="kind">${e}</span></div>`
          : `<div class="jm-tag${t ? " brick" : ""}" style="margin-top:12px">${e}</div>`;
        (ev.innerHTML = `<div class="jcw"${a ? " data-green" : ""}>${h ? `<div class="jm-x" id="jcX" style="left:-14px;top:-14px">${X_RED}</div>` : ""}${m}\n      <h4><img src="${n}" alt=""><span>${s}</span></h4>\n      ${r ? `<div class="lead">${r}</div>` : ""}\n      ${i.length ? `<table class="jc"><tbody>${i.map(([e, t]) => `<tr><td><b>${e}:</b> ${t}</td></tr>`).join("")}</tbody></table>` : ""}\n      ${l ? `<div class="ev-bars-h">${l}</div>` : ""}\n      ${c.length ? `<div class="ev-bars${c.some((e) => e[3]) ? " pct" : ""}">${c.map(([e, t, a, o]) => `<b>${e}</b><i><u style="width:${Math.max(t, 3)}%;background:${a || barCol(t)}"></u></i>${o ? `<em>${o}</em>` : ""}`).join("")}</div>` : ""}\n      ${d.map((e, t) => `<button class="jm-apply ev-btn${"gold" === e[2] ? " gd" : "green" === e[2] ? " hr-green" : "dark" === e[2] ? " dk" : "gray" === e[2] ? " gy" : "tgreen" === e[2] ? " tg" : "tyellow" === e[2] ? " ty" : "tred" === e[2] ? " tr" : ""}" data-c="${t}">${e[0]}</button>`).join("")}\n      ${p ? '<button class="jm-apply ev-btn hr-green" data-c="ok">OK</button>' : ""}\n      ${u ? '<div class="ev-surprise"><img src="emoji/1f3b2.png"><span>Surprise me!</span></div>' : ""}</div>`),
          o &&
            ev.querySelector(".ev-av").replaceWith(npcFace(o.look, o.g, o.age, o.mood || "happy", "ev-av")),
          ev.classList.remove("death18"),
          (ev.style.overflow = h ? "visible" : "");
        const f = () => {
            evWrap.classList.remove("open"), (ev.style.overflow = "");
          },
          g = (t) => {
            f(),
              "ok" !== t &&
                d[t] &&
                window.noteChoice &&
                noteChoice({ tag: e, title: s, lead: r, person: o, choice: d[t][0] }),
              ("ok" === t ? p : d[t][1])();
          };
        ev.querySelectorAll("[data-c]").forEach(
          (e) => (e.onclick = () => g("ok" === e.dataset.c ? "ok" : +e.dataset.c)),
        );
        const y = ev.querySelector(".ev-surprise");
        y && (y.onclick = () => g(rint(0, d.length - 1))),
          h &&
            (document.getElementById("jcX").onclick = () => {
              play("dismiss"), f(), "function" == typeof h && h();
            }),
          evWrap.classList.add("open"),
          h &&
            queueMicrotask(() => {
              const e = document.getElementById("jcX");
              !e ||
                ev.scrollHeight <= ev.clientHeight + 2 ||
                (ev.style.setProperty("overflow", "auto", "important"),
                (e.style.left = "6px"),
                (e.style.top = "6px"));
            });
      }
      const brokeRows = (e) =>
          `<div class="brk"><div><b>Cost:</b> ${usd(e)}</div><div><b>Bank Balance:</b> ${usd(state.money)}</div></div>`,
        mischief = () => {
          achSeen.has("Mischief Managed") ||
            setTimeout(() => showAchievement("Mischief Managed", "Commit a crime"), 700);
        };
      function arrest(e, t) {
        if (state.dead || state.prison) return;
        const a = isOldEra(),
          [o, n, s] = t || (a && CHARGES_1800[e]) || CHARGES[e] || [1, 4],
          r = a ? (!0 === s ? "cap" : s || null) : null,
          i = {
            crime: e,
            lo: o,
            hi: n,
            dp: a
              ? !!r && ("west" !== r || "us" === state.country) && state.age >= 16
              : !!s && state.age >= 18,
            dpKind: r,
            lean: 0,
          };
        state.age < 18 && ((i.hi = Math.min(i.hi, 3)), (i.lo = Math.min(i.lo, i.hi))),
          say(`I was arrested for ${e}!`),
          whenClear(() => {
            a ? play("gunCock") : crimeSnd("Cops");
            const t = rint(2, 12),
              o = rint(0, 6),
              n = rint(25, 95),
              s = "us" === state.country ? "sheriff" : "constable",
              r = `${o} detective${o > 1 ? "s" : ""}`,
              l = i.dp
                ? `${NUM_WORDS[t]} police officers${o ? `, ${r}, ` : " "}and the chief of police are all on the scene.`
                : `${NUM_WORDS[t]} police officers${o ? ` and ${r}` : ""} are all on the scene.`,
              c = a
                ? pickR([
                    `The ${s} levels a revolver at you and tells you to raise your hands.`,
                    `The ${s} clamps a pair of iron shackles on your wrists.`,
                    `Two deputies drag you toward the ${"sheriff" === s ? "jailhouse" : "lockup"}.`,
                    `A crowd gathers to watch the ${s} haul you off.`,
                  ])
                : i.dp && chance(0.5)
                  ? l
                  : pickR([
                      "An officer tells you to put your hands behind your back.",
                      "An officer slaps a pair of handcuffs on your wrists.",
                      "Two officers pin you against the squad car.",
                      l,
                    ]),
              d = () =>
                jCard({
                  iconSrc: "prison/police.png",
                  title: a ? `The ${capFirst(s)}` : "Police",
                  surprise: !0,
                  lead: a
                    ? `You are being arrested by the ${s}!<br><br>${c}<br><br>How will you behave?`
                    : `You are being arrested by the police!<br><br>${c}<br><br>How will you behave?`,
                  rows: [["Crime", capFirst(e)]],
                  bars: [["Their Professionalism", n]],
                  choices: [
                    [
                      "Cooperate with them",
                      () => {
                        say("I cooperated with the police during my arrest."), (i.lean += 0.08), charges(i);
                      },
                    ],
                    [
                      "Flirt with them",
                      () => {
                        if (chance((100 - n) / 300))
                          return (
                            say("I flirted with the arresting officer, who let me go!"),
                            notice(
                              "Smooth criminal",
                              "You flirted with the arresting officer, who decided to let you go!",
                            )
                          );
                        say("I flirted with the police during my arrest. It did not work."),
                          (i.lean -= 0.04),
                          notice("Not amused", "The officers were not amused by your flirting.", () =>
                            charges(i),
                          );
                      },
                    ],
                    [
                      "Run for it",
                      () => {
                        if (chance(0.18))
                          return (
                            say("I ran from the police and got away!"),
                            notice("Got away!", "You outran the police and got away!")
                          );
                        say("I tried to run from the police, but they tackled me."),
                          (i.lean -= 0.08),
                          i.lo++,
                          (i.hi += 2),
                          notice(
                            "Tackled",
                            "You tried to run, but the officers tackled you to the ground. Resisting arrest won't look good in court.",
                            () => charges(i),
                          );
                      },
                    ],
                    ["Try to bribe them", () => setTimeout(u, 50)],
                    ...(state.royal && !state.royal.abdicated
                      ? [
                          [
                            "Disregard with royal power",
                            () => {
                              const t = state.royal;
                              say(`I used my royal power to get out of being arrested for ${e}.`);
                              const a = chance(i.dp ? 0.4 : 0.15);
                              a &&
                                (royRespect(-rint(2, 5)),
                                royFame(-rint(1, 3)),
                                say("The story of my royal get-out-of-jail card leaked to the press.")),
                                notice(
                                  "Royal privilege",
                                  `"${t.honorific || "Your highness"}," the officer says, stepping back. The police recognized the ${t.title} and let you go.${a ? "<br><br>Word of it leaked to the press, and people are not impressed." : ""}`,
                                  null,
                                  !0,
                                );
                            },
                            "gold",
                          ],
                        ]
                      : []),
                  ],
                }),
              u = () => {
                const e = a ? 1 : 100,
                  t = a
                    ? Math.max(eraCash(300), Math.ceil(state.money))
                    : Math.max(5e4, 100 * Math.round(state.money / 100)),
                  o = a
                    ? Math.max(1, Math.min(Math.round(state.money / 2), t) || eraCash(20))
                    : Math.max(100, Math.min(100 * Math.round(state.money / 2 / 100), t) || 5e3);
                ev.innerHTML = `<div class="jcw"><div class="jm-tag" style="margin-top:12px">Justice</div>\n          <h4><img src="prison/bribe.png" alt=""><span>Bribe</span></h4>\n          <div class="lead">How much will you offer the police as a bribe to let you go?</div>\n          <div class="gm-row"><span class="hr-lab" style="margin:0">Bribe</span><b id="brAmt">${usd(o)}</b></div>\n          <input type="range" class="gm-range" id="brRange" min="${e}" max="${t}" step="${e}" value="${o}">\n          <button class="jm-apply ev-btn" id="brGo">Offer the bribe</button><button class="jm-apply ev-btn" id="brNo">Actually, never mind</button>\n          <div class="ev-surprise"><img src="emoji/1f3b2.png"><span>Surprise me!</span></div></div>`;
                const s = document.getElementById("brRange");
                s.oninput = () => (document.getElementById("brAmt").textContent = usd(+s.value));
                const r = () => evWrap.classList.remove("open"),
                  l = (e) => {
                    r();
                    const t =
                      (a ? eraCash(i.dp ? 600 : 40 * i.hi) : i.dp ? 6e4 : 4e3 * i.hi) * (0.4 + n / 100);
                    return state.money < e
                      ? (say("I tried to bribe the police with money I didn't have."),
                        (i.lean -= 0.06),
                        notice(
                          "Broke",
                          "You don't have that kind of money. The officers laughed at you.",
                          () => charges(i),
                        ))
                      : chance(Math.min(0.85, (e / t) * (1.1 - n / 100)))
                        ? ((state.money -= e),
                          renderStats(),
                          chaChing(),
                          say(`I bribed the police ${usd(e)} to let me go.`),
                          notice("Money talks", `You bribed the police ${usd(e)}. They let you go!`))
                        : (say(`I tried to bribe the police ${usd(e)}, but they arrested me anyway.`),
                          (i.lean -= 0.1),
                          void notice(
                            "Now they wanna be righteous",
                            `You tried to bribe the police ${usd(e)}!<br><br>They arrested you anyway!`,
                            () => charges(i),
                          ));
                  };
                (document.getElementById("brGo").onclick = () => l(+s.value)),
                  (document.getElementById("brNo").onclick = () => {
                    r(), setTimeout(d, 50);
                  }),
                  (ev.querySelector(".ev-surprise").onclick = () =>
                    chance(0.5) ? l(rint(1, Math.max(1, t / e)) * e) : (r(), setTimeout(d, 50))),
                  evWrap.classList.add("open");
              };
            d();
          });
      }
      function charges(e) {
        if (!e.opts && isOldEra()) {
          const t = e.dp ? 150 : 10 + 6 * e.hi,
            a = ulast(state.country),
            o = ulast(state.country),
            n = ulast(state.country);
          e.opts = [
            [`Squire ${a}, Country Lawyer`, eraCash(t * (0.6 + 0.4 * Math.random())), 0.3],
            [`${o} & ${n}, Trial Lawyers`, eraCash(t * (4 + 3 * Math.random())), 0.58],
            e.dp ? ["Court-Appointed Counsel", 0, 0.14] : ["Defend yourself", 0, 0.07],
          ];
        }
        if (!e.opts) {
          const [t, a] = [...LAW_FIRMS].sort(() => Math.random() - 0.5),
            o = e.dp ? 45e3 : 1200 * e.hi,
            n = 10 * Math.round((o * (0.8 + 0.6 * Math.random())) / 10),
            s = 10 * Math.round((n * (5 + 6 * Math.random())) / 10);
          e.opts = [
            [t, ep(n), 0.33],
            [a, ep(s), 0.6],
            ["Public Defender", 0, 0.12],
          ];
        }
        const t = state.fugitive;
        e.said ||
          ((e.said = !0),
          say(`I was charged with ${e.crime}!`),
          t && say(`The police identified me as an escaped convict from ${t.from}.`));
        const a = isOldEra()
            ? e.dp
              ? "could " + ("mil" === e.dpKind ? "face a firing squad" : "hang for it")
              : `are facing up to ${yrs(e.hi)} of hard labor in ${state.age < 18 ? "a reform school" : "the penitentiary"}`
            : e.dp
              ? "are facing the death penalty"
              : `are facing up to ${yrs(e.hi)} in ${state.age < 18 ? "juvenile detention" : "prison"}`,
          o = t
            ? `<br><br>The police also identified you as an escaped convict. ${t.death ? "You still have a death sentence" : `You still owe ${yrs(t.left)}`} for ${t.crime}, plus extra time for escaping.`
            : "";
        jCard({
          iconSrc: "prison/scale.png",
          title: "Criminal Charges",
          lead: `You've been charged with ${e.crime} and ${a}!${o}<br><br>${isOldEra() ? "Who will speak for you before the judge and a jury of twelve?" : "Which local law firm will you hire to defend you in court?"}`,
          rows: e.opts.map(([e, t]) => [e, usd(t)]),
          choices: e.opts.map(([t, a, o]) => [
            t,
            () => {
              if (state.money < a)
                return notice(
                  "Flat broke",
                  `You don't have enough money to hire ${t}.<br><br>${state.money ? "You can't afford them." : "You are broke."}`,
                  () => charges(e),
                  !1,
                  brokeRows(a),
                );
              a && ((state.money -= a), renderStats(), chaChing()),
                (e.q = o),
                (e.pd = !a),
                say(
                  a
                    ? `I hired ${t} to represent me in court.`
                    : "Defend yourself" === t
                      ? "I decided to defend myself in court."
                      : isOldEra()
                        ? "The court appointed a lawyer to defend me."
                        : "I hired a public defender to represent me in court.",
                ),
                plea(e);
            },
          ]),
        });
      }
      function plea(e) {
        jCard({
          iconSrc: "prison/scale.png",
          title: "Plea",
          surprise: !0,
          lead: `The judge has asked you to make a plea surrounding your charge for ${e.crime}. If you plead guilty, you may receive a shorter sentence than if you are convicted in a trial.<br><br>How will you plea?`,
          rows: [
            ["Possible Sentence", e.dp ? "Death" : yrs(e.hi)],
            ...(state.fugitive
              ? [["Escaped Sentence", state.fugitive.death ? "Death" : yrs(state.fugitive.left)]]
              : []),
          ],
          choices: [
            ["Guilty", () => verdict(e, "guilty")],
            ["Not guilty", () => verdict(e, "not")],
            ["No contest", () => verdict(e, "nc")],
          ],
        });
      }
      function verdict(e, t) {
        say("guilty" === t ? "I plead guilty." : "nc" === t ? "I plead no contest." : "I plead not guilty."),
          crimeSnd("Stamp");
        const a = state.fugitive,
          o = a ? rint(2, 5) : 0;
        let n = null;
        if (mods.alwaysWinCourt || ("not" === t && chance(Math.max(0.03, Math.min(0.85, e.q + e.lean))))) {
          const o = "not" !== t;
          if (
            (say(o ? `The judge dismissed my ${e.crime} case!` : `I was found not guilty of ${e.crime}!`), !a)
          )
            return setTimeout(
              () =>
                jCard({
                  iconSrc: "prison/gavel.png",
                  title: o ? "Case Dismissed" : "Not Guilty",
                  lead: o
                    ? `The judge threw out your ${e.crime} case and dropped all charges!<br><br>You are free to go.`
                    : `The jury found you not guilty of ${e.crime}!<br><br>You are free to go.`,
                  ok: () => {},
                }),
              350,
            );
          n = o ? "Case Dismissed" : "Not Guilty";
        }
        let s = 0,
          r = !1;
        const i = state.age < 18;
        n ||
          ((s = rint(e.lo, e.hi)),
          "guilty" === t ? (s *= 0.6) : "nc" === t && (s *= 0.75),
          (s = Math.max(1, Math.round(s * (1 - 0.35 * e.q - e.lean)))),
          (r =
            e.dp &&
            chance(
              (isOldEra()
                ? (DP_ODDS_1800[e.dpKind] || 0.05) * ("not" === t ? 1 : "nc" === t ? 0.8 : 0.6)
                : "not" === t
                  ? 0.08
                  : "nc" === t
                    ? 0.06
                    : 0.05) *
                (e.pd ? 1.4 : 1) *
                (1 - 0.5 * e.q),
            )),
          i && (s = Math.min(s, rint(1, 3))));
        const l = s;
        a && ((s = Math.min(99, s + a.left + o)), a.death && (r = !0));
        const c = r || s >= 15 ? "Maximum" : s >= 5 || a ? "Medium" : "Minimum",
          d = state.birthYear + state.age,
          u = isOldEra(),
          h = u
            ? i
              ? d >= 1825
                ? `${state.city || "the County"} House of Refuge`
                : "the County Workhouse"
              : s <= 1 && !r
                ? `the ${ulast(state.country)} County ${"us" === state.country ? "Jail" : "Gaol"}`
                : pickR(
                    PRISONS_1800()
                      .filter(([, e]) => d >= e)
                      .map(([e]) => e),
                  )
            : i
              ? `${state.city || any(PRISON_WORDS)} Juvenile Detention Facility`
              : `${any(PRISON_WORDS)} ${"Maximum" === c ? "Max" : c} Security Prison`,
          p = u
            ? "mil" === e.dpKind || ("us" === state.country && chance(0.1))
              ? "Firing Squad"
              : "Hanging"
            : any(EXEC_METHODS),
          m = {
            crime: a ? `${n ? a.crime : e.crime} and escaping prison` : e.crime,
            years: s,
            served: 0,
            name: h,
            sec: c,
            juv: i,
            behavior: rint(a ? 20 : 45, a ? 45 : 70),
            respect: rint(4, 20),
            gang: null,
            job: null,
            recap: !!n,
            death: r
              ? a && a.death
                ? { age: Math.max(state.age + 1, a.death.age), how: a.death.how }
                : { age: state.age + (u ? 1 : rint(2, 6)), how: p }
              : null,
            did: {},
          },
          f = ["zero", "one", "two", "three", "four", "five"],
          g = r
            ? u
              ? "Hanging" === m.death.how
                ? "hang by the neck until dead"
                : "death by firing squad"
              : `death by ${m.death.how.toLowerCase()}`
            : i
              ? u
                ? `${f[s] || s} year${s > 1 ? "s" : ""} in ${h}`
                : `${f[s] || s} year${s > 1 ? "s" : ""} at a juvenile detention center`
              : u
                ? `${yrs(s)} of hard labor at ${h}`
                : `${yrs(s)} in prison`;
        say(
          n
            ? `As an escaped convict, I was sent back to prison to serve ${g}.`
            : `I have been convicted of ${e.crime} and sentenced to ${g}!`,
        );
        const y = r
          ? [
              ["Execution Date", `${ordN(m.death.age)} Birthday`],
              ["Sentence", `Death (${m.death.how})`],
            ]
          : [["Sentence", i ? `${s} Year${s > 1 ? "s" : ""}` : yrs(s)]];
        a &&
          !r &&
          (n || y.push([capFirst(e.crime), yrs(l)]),
          y.push(["Escaped Sentence", yrs(a.left)], ["Escape Penalty", yrs(o)])),
          y.push(["Prison", h]),
          i || y.push(["Prison Security", c]);
        const b = state.school ? state.school.level.toLowerCase() : null,
          v = a
            ? "<br><br>" +
              (a.death
                ? `Your death sentence for ${a.crime} still stands.`
                : `That includes the ${yrs(a.left)} you still owed for ${a.crime} and ${yrs(o)} for escaping prison.`)
            : "",
          w = n
            ? `${"Case Dismissed" === n ? `The judge threw out your ${e.crime} case` : `The jury found you not guilty of ${e.crime}`}, but you're still an escaped convict from ${a.from}.<br><br>You've been sent back to serve ${g}.${v}`
            : `You have been convicted of ${e.crime} and sentenced to ${g}!${v}`;
        setTimeout(
          () =>
            jCard({
              brick: !0,
              iconSrc: n ? "prison/gavel.png" : "prison/sentence.png",
              title: n ? "Back to Prison" : "Guilty",
              lead: `${w}${b ? `<br><br>You have been forced to drop out of ${b}.` : ""}`,
              rows: y,
              ok: () => {
                goToPrison(m), window.crimeFamily && crimeFamily(e.crime, m);
              },
            }),
          350,
        );
      }
      function executionScene(e) {
        const t = "Hanging" === e.death.how,
          a = e.name.replace(/^the /, ""),
          o = (e, a) => {
            say(e),
              evWrap.classList.remove("open"),
              t
                ? (play("trapdoor"),
                  setTimeout(() => play("ropeCreak"), 250),
                  setTimeout(() => play("crowdJeer"), 1100))
                : [0, 60, 110, 170, 240, 330].forEach((e) => setTimeout(() => play("gunshot"), e)),
              setTimeout(
                () => {
                  (state.prison = null), die(a);
                },
                t ? 3200 : 1600,
              );
          };
        if (t)
          return (
            play("crowdJeer"),
            jCard({
              brick: !0,
              tag: "The Gallows",
              iconSrc: "prison/sentence.png",
              title: "Hanging Day",
              lead: `A crowd has packed the yard at ${a} to watch you hang. Pie sellers shout over the noise, children sit on their fathers' shoulders, and the hangman checks the knot on the noose.<br><br>You climb the thirteen steps to the trapdoor.`,
              choices: [
                [
                  "Say your last words",
                  () => o(`I said my last words on the gallows at ${a} as the crowd jeered.`, "hanging"),
                ],
                [
                  "Pray for forgiveness",
                  () => o(`I prayed for forgiveness on the gallows at ${a}.`, "hanging"),
                ],
                ["Curse the crowd", () => o(`I cursed the crowd from the gallows at ${a}.`, "hanging")],
                ["Stand in silence", () => o(`I stood in silence on the gallows at ${a}.`, "hanging")],
              ],
            })
          );
        play("gunCock"),
          jCard({
            brick: !0,
            tag: "Firing Squad",
            iconSrc: "prison/sentence.png",
            title: "Execution at Dawn",
            lead: `At dawn you are marched into the yard at ${a} and tied to a wooden post. Six riflemen stand in a line. One of them has a blank, so none of them will ever know who fired the fatal shot.<br><br>"Ready! Aim!"`,
            choices: [
              [
                "Refuse the blindfold",
                () => o(`I refused the blindfold and faced the firing squad at ${a}.`, "a firing squad"),
              ],
              [
                "Accept the blindfold",
                () => o(`I was blindfolded and shot by a firing squad at ${a}.`, "a firing squad"),
              ],
              [
                "Shout your last words",
                () => o(`I shouted my last words at the firing squad at ${a}.`, "a firing squad"),
              ],
            ],
          });
      }
      function murderCount(e) {
        const t = String(e || "");
        if (/attempted murder/i.test(t) && !/\d+ counts? of murder/i.test(t)) return 0;
        const a = t.match(/(\d+) counts? of murder/i);
        return a ? +a[1] : /murder|contract killing/i.test(t) ? 1 : 0;
      }
      function infamyFromConviction(e) {
        const t = murderCount(e);
        if (!mods.infamousKillers || !t) return;
        const a = (state.infamy ||= { kills: 0, level: 0, hold: 0, floor: 0 });
        a.kills += t;
        const o = a.kills,
          n = Math.min(100, o <= 2 ? 16 + 4 * o : 24 + 6 * (o - 2));
        (a.level = Math.max(a.level, n)),
          (a.floor = Math.max(a.floor, Math.min(35, 4 + 2 * o))),
          o >= 15
            ? (a.hold = Math.max(a.hold, state.age + rint(3, 5)))
            : o >= 8 && (a.hold = Math.max(a.hold, state.age + rint(1, 2)));
        const s = state.art,
          r = !s.fameOn;
        (s.fameOn = !0),
          (a.extra = r
            ? Math.max(0, (s.fame || 0) - a.level)
            : Math.max(0, (a.extra || 0) + (s.fame - (a.shown ?? s.fame)))),
          (s.fame = clamp(a.level + (a.extra || 0))),
          (a.shown = s.fame),
          renderStats(),
          say(
            r
              ? "My murder conviction made headlines and I became infamous."
              : "My latest murder conviction made me even more infamous.",
          ),
          setTimeout(
            () =>
              whenClear(() =>
                notice(
                  "Infamous",
                  r
                    ? "Your murder conviction made headlines across the country.<br><br>Everyone knows your name now."
                    : "Your latest conviction put your name back in every headline.",
                  null,
                  !0,
                ),
              ),
            900,
          );
      }
