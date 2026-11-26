      function pickEvent(e) {
        if (!e.length) return null;
        const t = {};
        e.forEach((e) => (t[evBucket(e)] ||= []).push(e));
        let a = Object.keys(t);
        a.length > 1 && (a = a.filter((e) => e !== state.lastEvBucket || "requested" === e));
        const o = pickW(a.map((e) => [e, (BUCKET_W[e] || 1) * Math.min(1, t[e].length / 4)]));
        let n = t[o];
        const s = n.filter((e) => e.kind !== state.lastEvKind);
        s.length && (n = s);
        const r = pickW(n.map((e) => [e, e.w || 1]));
        return (state.lastEvBucket = o), (state.lastEvKind = r.kind), r;
      }
      function pickW(e) {
        let t = Math.random() * e.reduce((e, [, t]) => e + t, 0);
        for (const [a, o] of e) if ((t -= o) < 0) return a;
        return e[e.length - 1][0];
      }
      state.nextDanger = 18 + rnd(8, 20);
      const dangerEvent = (e) => ({
          min: 18,
          max: 200,
          kind: "Danger",
          key: "danger:" + e.t,
          make() {
            const t = { who: e.t, av: e.i, icon: e.i, title: e.t, desc: e.d, feedback: !0 },
              a = [
                [e.ok[0], () => fx(toFx(e.ok[1]), e.ok[2])],
                ...e.bad.map(([e, a, o]) => [
                  e,
                  () =>
                    chance(state.stats.Health < 30 ? 0.4 : 0.25)
                      ? ((t.then = () => die(a)), o)
                      : (hurt(),
                        fx(
                          { Health: -rint(15, 35), Happiness: -rint(3, 8) },
                          `${o} I was badly hurt, but I survived.`,
                        )),
                ]),
              ];
            return (t.choices = a.sort(() => Math.random() - 0.5)), t;
          },
        }),
        BROKEN_THINGS = [
          "chainsaw",
          "cell phone",
          "TV remote",
          "laptop",
          "flower vase",
          "reading lamp",
          "coffee maker",
          "blender",
          "sunglasses",
          "favorite mug",
          "picture frame",
          "garden hose",
          "lawn mower",
          "leaf blower",
          "tablet",
          "game console",
          "camera",
          "wristwatch",
          "headphones",
          "printer",
          "microwave",
          "toaster",
          "vacuum cleaner",
          "hair dryer",
          "electric drill",
          "bathroom mirror",
          "record player",
          "guitar",
          "keyboard",
          "fishing rod",
          "umbrella",
          "car keys",
          "smoke detector",
          "wall clock",
          "bookshelf",
          "ceiling fan",
          "snow globe",
          "jewelry box",
          "telescope",
          "antique clock",
          "kitchen scale",
          "rice cooker",
          "bicycle",
          "computer monitor",
          "Wi-Fi router",
          "electric kettle",
          "flat-screen TV",
          "hedge trimmer",
          "air fryer",
          "robot vacuum",
        ],
        parentsAlive = () => (state.parents || []).filter((e) => !e.dead),
        kidCard = (e, t, a, o, n) =>
          openEvent({ kind: e, make: () => ({ plain: !0, iconSrc: t, title: a, desc: o, choices: n }) });
      function teethingEvent() {
        const e = parentsAlive().find((e) => "Mother" === e.role);
        kidCard(
          "Childhood",
          "kid/tooth.png",
          "Teething",
          "Your gums hurt, and you're looking for something within reach to chew on to make them feel better.<br><br>What will you grab?",
          [
            [
              e ? "My mother's cell phone" : "My father's cell phone",
              () => {
                const t = e || parentsAlive()[0];
                return (
                  t && (t.rel = clamp(t.rel - rint(1, 3))),
                  fx(
                    { Happiness: 2 },
                    `I chewed on my ${e ? "mother" : "father"}'s cell phone. ${e ? "She" : "He"} was not happy about the drool.`,
                  )
                );
              },
            ],
            [
              "The TV remote",
              () => fx({ Happiness: 2 }, "I chewed on the TV remote until it was covered in drool."),
            ],
            [
              "A Sharpie marker",
              () =>
                fx(
                  { Health: -3, Happiness: -1 },
                  "I chewed on a Sharpie marker and my whole mouth turned black.",
                ),
            ],
            [
              "Rubber chew ring",
              () => fx({ Happiness: 5 }, "I chewed on a rubber chew ring. My gums felt much better."),
            ],
          ],
        );
      }
      function integrityEvent() {
        const e = any(BROKEN_THINGS),
          t = parentsAlive(),
          a = t.length > 1 ? "parents" : t[0] ? ("Mother" === t[0].role ? "mother" : "father") : "parents",
          o = "parents" === a ? "my parents'" : `my ${a}'s`;
        kidCard(
          "Childhood",
          "kid/face-flushed.png",
          "Integrity",
          `You broke ${"parents" === a ? "your parents'" : `your ${a}'s`} ${e} while you were playing.<br><br>What will you do?`,
          [
            [
              "Admit that I broke it",
              () => {
                t.forEach((e) => (e.rel = clamp(e.rel + rint(0, 2))));
                const o = "parents" === a ? "their" : "f" === t[0].gender ? "her" : "his";
                return fx(
                  { Happiness: -2 },
                  `I admitted to ${"parents" === a ? "my parents" : `my ${a}`} that I broke ${o} ${e}. ${"parents" === a ? "They were" : "f" === t[0].gender ? "She was" : "He was"} glad I told the truth.`,
                );
              },
            ],
            [
              "It wasn't me",
              () => {
                const a = chance(0.55);
                return (
                  t.forEach((e) => (e.rel = clamp(e.rel - (a ? rint(8, 15) : rint(2, 5))))),
                  a
                    ? fx(
                        { Happiness: -4 },
                        `I lied about breaking ${o} ${e}, but they figured out it was me. They're disappointed in me.`,
                      )
                    : fx(
                        { Happiness: -1 },
                        `I lied about breaking ${o} ${e}. They didn't believe me and trust me a little less now.`,
                      )
                );
              },
            ],
          ],
        );
      }
      const EYE_PAIRS = [
          ["E", "F"],
          ["O", "Q"],
          ["8", "B"],
          ["P", "R"],
          ["C", "G"],
          ["M", "N"],
          ["5", "S"],
          ["1", "I"],
          ["V", "Y"],
          ["3", "8"],
          ["U", "V"],
          ["0", "O"],
        ],
        healthCard = (e) => {
          ev.classList.remove("death18"),
            (ev.innerHTML = `<div class="jcw"><div class="jm-tag" style="margin-top:12px">Healthcare</div>${e}</div>`),
            evWrap.classList.contains("open") || play("scenario"),
            evWrap.classList.add("open");
        };
      function eyesightIntro() {
        state.eyeExam = state.age;
        const e = parentsAlive().find((e) => "Mother" === e.role),
          t = e || parentsAlive()[0];
        notice(
          "Eyesight",
          `${t ? `Your ${"Mother" === t.role ? "mother" : "father"} is` : "Your teacher is"} concerned with your eyesight and is taking you for an eye exam at the optometrist.`,
          () => setTimeout(eyeExam, 250),
          !0,
        );
      }
      function eyeExam() {
        (state.eyeExam = state.age),
          healthCard(
            `<h4><img src="kid/eye.png" alt=""><span>Eye Exam</span></h4>\n      <div class="lead">Start the test and then tap the letter or number that's different than the others before time runs out!</div>\n      <div class="eye-grid">${"<span>?</span>".repeat(169)}</div><div class="eye-time"></div>\n      <button class="jm-apply ev-btn hr-green" id="eyeGo">Start</button><div class="eye-skip" id="eyeSkip">Forget it, I need glasses</div>`,
          );
        const e = ev.querySelector(".eye-grid"),
          t = [...e.children],
          a = ev.querySelector(".eye-time");
        let o = 0,
          n = !1;
        const s = () => {
            clearInterval(o), evWrap.classList.remove("open");
          },
          r = (a, r) => {
            n ||
              ((n = !0),
              clearInterval(o),
              play(a ? "ding" : "buzzer"),
              e.classList.add("over"),
              t[i].classList.add("right"),
              r && !a && r.classList.add("wrong"),
              setTimeout(
                () => {
                  s(),
                    a
                      ? (say("I passed my eye exam with perfect vision."),
                        notice("Eagle eyes", "You passed your eye exam with flying colors!"))
                      : (say("I failed my eye exam and got a prescription for glasses."),
                        notice(
                          "Blind as a bat",
                          "You failed your eye exam and have been issued a prescription for eyeglasses!",
                          optometrist,
                        ));
                },
                a ? 500 : 1300,
              ));
          };
        let i = 0;
        (document.getElementById("eyeGo").onclick = () => {
          const [n, s] = any(EYE_PAIRS);
          (i = rint(0, 168)),
            t.forEach((e, t) => {
              (e.textContent = t === i ? s : n), (e.onclick = () => r(t === i, e));
            }),
            e.classList.add("live"),
            document.getElementById("eyeGo").remove();
          let l = 5;
          const c = () => {
            a.textContent = `Time remaining: ${l} second${1 === l ? "" : "s"}`;
          };
          c(),
            (o = setInterval(() => {
              --l <= 0 ? ((a.textContent = "Time remaining: 0 seconds"), r(!1)) : c();
            }, 1e3));
        }),
          (document.getElementById("eyeSkip").onclick = () => {
            n ||
              ((n = !0),
              s(),
              say("I gave up on the eye exam and got a prescription for glasses."),
              setTimeout(optometrist, 250));
          });
      }
      function optometrist() {
        const e = stage(state.age),
          t = ("f" === PG() ? FACE_LAYERS_F : FACE_LAYERS)[e].glasses || [];
        if (!t.length) return;
        let a = 0;
        const o = state.stats.Happiness < 25 ? "sad" : state.stats.Happiness < 40 ? "angry" : "happy";
        healthCard(
          '<h4><img src="kid/eye.png" alt=""><span>Optometrist</span></h4><div class="lead">Pick out some glasses today!</div>\n      <div class="acc-prev"><span class="acc-arrow l" id="optL"></span><canvas width="250" height="250" id="optCv"></canvas><span class="acc-arrow r" id="optR"></span></div>\n      <button class="jm-apply ev-btn" id="optGo">Select this look</button>',
        ),
          (ev.style.overflow = "visible");
        const n = document.getElementById("optCv").getContext("2d"),
          s = () => {
            const s = a;
            composeFace(
              e,
              o,
              state.look,
              PG(),
              { ...state.acc, eyewear: null },
              { glasses: t[a], hair: moddedHairNum(e) },
            ).then((e) => {
              a === s && (n.clearRect(0, 0, 250, 250), n.drawImage(e, 0, 0));
            });
          };
        (document.getElementById("optL").onclick = () => {
          (a = (a - 1 + t.length) % t.length), play("choice"), s();
        }),
          (document.getElementById("optR").onclick = () => {
            (a = (a + 1) % t.length), play("choice"), s();
          }),
          (document.getElementById("optGo").onclick = () => {
            evWrap.classList.remove("open"),
              (ev.style.overflow = ""),
              (state.look.glasses = t[a]),
              (state.glasses = !0),
              renderAvatar(),
              say("I picked out some glasses at the optometrist."),
              notice("Should I get transitions?", "You picked out some glasses at the optometrist.");
          }),
          s();
      }
      const CM_ACTIVITY = [
          "Magic Club",
          "Drama Club",
          "Band",
          "Chess Club",
          "Debate Team",
          "Soccer",
          "Basketball",
          "Cheerleading",
          "Student Council",
          "Art Club",
          "Robotics Club",
          "Choir",
          "Yearbook",
          "Track & Field",
          "Swim Team",
          "Science Club",
          "Gaming Club",
          "Volleyball",
        ],
        CM_CLIQUE = {
          f: [
            "Mean Girls",
            "Nerds",
            "Goths",
            "Preps",
            "Band Geeks",
            "Theater Kids",
            "Popular Kids",
            "Artsy Kids",
            "Loners",
          ],
          m: [
            "Jocks",
            "Nerds",
            "Goths",
            "Preps",
            "Band Geeks",
            "Skaters",
            "Theater Kids",
            "Gamers",
            "Popular Kids",
            "Loners",
          ],
        },
        crushGender = () =>
          "Gay" === state.sexuality ? PG() : "Bisexual" === state.sexuality ? null : "m" === PG() ? "f" : "m";
      function loveInterestEvent() {
        const e = state.school,
          t = crushGender();
        if (!e) return;
        const a = e.classmates.filter(
          (e) =>
            (!t || e.g === t) &&
            canDate(personAge(e)) &&
            !state.lovers.some((t) => t.first === e.first && t.last === e.last),
        );
        if (!a.length) return;
        const o = any(a),
          n = personAge(o),
          s = "f" === o.g ? "her" : "him";
        (o.looks ??= rint(5, 100)),
          (o.pop ??= rint(5, 100)),
          (o.grades ??= rint(5, 100)),
          (o.activity ??= any(CM_ACTIVITY)),
          (o.clique ??= any(CM_CLIQUE[o.g])),
          openEvent({
            kind: "Classmate",
            make: () => ({
              who: `${o.first} ${o.last}`,
              av: "1f464",
              person: { look: o.look, g: o.g, age: n },
              iconSrc: "emoji/2764-fe0f.png",
              title: "Love Interest",
              desc: `Your classmate, ${o.first}, has asked you out.`,
              table: [
                ["Name", `${o.first} ${o.last}`],
                ["Gender", "f" === o.g ? "Female" : "Male"],
                ["Age", n],
                ["Activity", o.activity],
                ["Clique", o.clique],
              ],
              bars: [
                ["Looks", o.looks],
                ["Grades", o.grades],
                ["Popularity", o.pop],
              ],
              choices: [
                [
                  `Start going out with ${s}`,
                  () => {
                    const e = {
                      first: o.first,
                      last: o.last,
                      g: o.g,
                      gLabel: o.g,
                      ageOffset: n - state.age,
                      look: o.look,
                      rel: rint(55, 80),
                      sexuality: "Straight",
                      job: "Student",
                      house: "Lives with parents",
                      celeb: !1,
                      looks: o.looks,
                      smarts: rint(5, 100),
                      crazy: rint(0, 100),
                      money: 0,
                      prof: {
                        money: 0,
                        relig: rint(0, 100),
                        gen: rint(0, 100),
                        edu: eduFor(n),
                        job: "Student",
                        marital: "Single",
                      },
                    };
                    o.rel = clamp(o.rel + 15);
                    const t = addLover(e);
                    return {
                      msg: `My classmate, ${o.first}, asked me out. I started going out with ${s}.`,
                      title: "Class mating",
                      text: `You are now going out with your classmate, ${o.first} ${o.last}.${t}`,
                    };
                  },
                ],
                [
                  `Reject ${s}`,
                  () => (
                    (o.rel = clamp(o.rel - rint(5, 15))),
                    fx({ Happiness: -1 }, `My classmate, ${o.first}, asked me out. I rejected ${s}.`)
                  ),
                ],
              ],
            }),
          });
      }
      function breakupEvent(e, t = "") {
        if (!state.lovers.includes(e)) return;
        const a = herOf(e),
          o = sheOf(e),
          n = o.toLowerCase(),
          s = "f" === e.g ? "her" : "his",
          r = loverTitle(e),
          i = Math.max(0.05, Math.min(0.85, 0.2 + 0.005 * e.rel - 0.003 * (e.willpower ?? 50)));
        openEvent({
          kind: r,
          make: () => ({
            who: `${e.first} ${e.last}`,
            av: "1f464",
            person: { look: e.look, g: e.g, age: loverAge(e) },
            iconSrc: "emoji/1f494.png",
            title: "Break Up",
            desc: `Your ${r.toLowerCase()}, ${e.first}, wants to break up with you.${t ? `<br><br>${t}` : ""}<br><br>What will you do?`,
            angry: !0,
            choices: [
              [
                `Wish ${a} well`,
                () => (
                  toEx(e),
                  fx({ Happiness: -hit("breakup") }, ""),
                  {
                    msg: `${e.first} broke up with me. I wished ${a} well.`,
                    title: "Moving on",
                    text: `You wished ${e.first} well.<br><br>You two are no longer together.`,
                  }
                ),
              ],
              [
                `Beg ${a} to stay`,
                () =>
                  chance(i)
                    ? ((e.rel = clamp(e.rel + 5)),
                      (e.neglectYears = 0),
                      {
                        msg: `I begged ${e.first} to stay with me. ${o} changed ${s} mind.`,
                        title: "No shame",
                        text: `You begged ${e.first} to stay with you.<br><br>${o} decided to stay with you.`,
                      })
                    : (toEx(e),
                      fx({ Happiness: -hit("breakup") }, ""),
                      {
                        msg: `I begged ${e.first} to stay with me, but ${n} left me anyway.`,
                        title: "No shame",
                        text: `You begged ${e.first} to stay with you.<br><br>${o} left you anyway.`,
                      }),
              ],
              [
                `Insult ${a} one last time`,
                () => {
                  toEx(e), fx({ Happiness: -Math.round(0.7 * hit("breakup")) }, "");
                  const t = pickR(INSULTS);
                  return {
                    msg: `${e.first} broke up with me. I called ${a} ${t} on the way out.`,
                    title: "Parting words",
                    text: `You called ${e.first} ${t} one last time.`,
                  };
                },
              ],
              [
                `Lunge at ${a}`,
                () => (
                  setTimeout(() => attackPartner(e, r.toLowerCase()), 80),
                  `${e.first} wanted to break up with me.`
                ),
              ],
            ],
          }),
        });
      }
      const ATTACK_MOVES = [
          "Uppercut",
          "Punch",
          "Slap",
          "Kick",
          "Karate kick",
          "Headbutt",
          "Elbow strike",
          "Body slam",
          "Haymaker",
          "Knee strike",
          "Choke slam",
        ],
        ATTACK_TARGETS = [
          "throat",
          "toes",
          "skull",
          "stomach",
          "foot",
          "face",
          "nose",
          "bladder",
          "groin",
          "ribs",
          "back",
          "knee",
          "ear",
          "jaw",
          "shin",
        ],
        ATTACK_FOLLOW = [
          "Then you karate kicked {his} bladder, making {him} pee {himself}!",
          "Then you stomped on {his} toes!",
          "Then you slapped {him} across the face!",
          "Then you shoved {him} into a bookshelf!",
          "Then you pulled {his} hair!",
          "Then you bit {his} arm!",
          "Then you threw a shoe at {him}!",
        ];
      function attackPartner(e, t) {
        const a = herOf(e),
          o = "f" === e.g ? "Her" : "His",
          n = sheOf(e);
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="jm-tag" style="margin-top:12px">Conflict</div><h4><img src="kid/fist.png" alt=""><span>Attack</span></h4>\n      <div class="lead">How will you attack your ${t}, ${e.first}?</div>\n      <label class="hr-lab">Pick your move:</label><div class="hr-sel"><select id="atMove">${ATTACK_MOVES.map((e) => `<option>${e}</option>`).join("")}</select></div>\n      <label class="hr-lab">Pick your target:</label><div class="hr-sel"><select id="atTarget">${ATTACK_TARGETS.map((e) => `<option value="${e}">${o} ${e}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="atGo">Attack ${a}</button></div>`),
          evWrap.classList.add("open"),
          (document.getElementById("atGo").onclick = () => {
            const o = document.getElementById("atMove").value,
              s = document.getElementById("atTarget").value,
              r = rint(35, 100);
            evWrap.classList.remove("open"), toEx(e), fx({ Happiness: -3 }, "");
            const i = /^[aeiou]/i.test(o) ? "an" : "a",
              l = chance(0.6)
                ? " " +
                  any(ATTACK_FOLLOW)
                    .replace(/\{his\}/g, "f" === e.g ? "her" : "his")
                    .replace(/\{him\}/g, a)
                    .replace(/\{himself\}/g, "f" === e.g ? "herself" : "himself")
                : "";
            say(
              `I attacked my ${t}, ${e.first}, after ${"f" === e.g ? "she" : "he"} tried to break up with me.`,
            ),
              notice(
                "More where that came from",
                `You delivered ${i} ${o.toLowerCase()} to your ${t}, ${e.first}'s, ${s}!${l}`,
                () => {
                  chance(0.5) &&
                    (say(`${e.first} called the cops on me.`),
                    notice("What a snitch", `${n} called the cops on you!`, () => arrest("assault")));
                },
                !1,
                `<div class="ev-bars nb"><b>Damage</b><i><u style="width:${r}%;background:#b3261e"></u></i></div>`,
              );
          });
      }
      function illnessCard(e, t, a, o = "Illness") {
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw" data-green><div class="jm-tag" style="margin-top:12px">${o}</div><h4>${e.startsWith("<") ? e : `<img src="${e}" alt="">`}<span>${t}</span></h4>\n      <div class="lead">${a}</div><button class="jm-apply ev-btn hr-green" id="illOk">OK</button></div>`),
          (document.getElementById("illOk").onclick = () => evWrap.classList.remove("open")),
          evWrap.classList.add("open");
      }
      function curedCard(e, t = "Illness") {
        snapClose(), play("boost"), illnessCard("found/dove.png", "Cured", e, t);
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || state.prison) return;
        const e = state.age,
          t = parentsAlive().length,
          a = [];
        e >= 11 &&
          e <= 17 &&
          state.school &&
          isSingle() &&
          e - (state.loveIntAt ?? -9) >= 3 &&
          chance(0.15 * looksDraw()) &&
          a.push(() => {
            isSingle() && ((state.loveIntAt = e), loveInterestEvent());
          }),
          e >= 1 &&
            e <= 3 &&
            null == state.teethed &&
            chance(0.45) &&
            a.push(() => {
              (state.teethed = e), teethingEvent();
            }),
          e >= 4 &&
            e <= 14 &&
            t &&
            null == state.lastIntegrity &&
            chance(0.08) &&
            a.push(() => {
              (state.lastIntegrity = e), integrityEvent();
            }),
          (state.eyeAge ??= chance(0.25) ? rint(6, 17) : -1),
          e !== state.eyeAge || null != state.eyeExam || state.glasses
            ? a.length && queueRoll(() => any(a)())
            : queuePopup(() => {
                state.dead || state.age !== e || eyesightIntro();
              });
      });
      let sadT = null;
      function sadWatch() {
        clearTimeout(sadT),
          (sadT = setTimeout(() => {
            try {
              if (state.dead || state.prison || state.age < 5) return;
              const e = state.stats.Happiness,
                t = mindOf();
              !state.depressed &&
                (e < 20 || t.mh < 15) &&
                state.sadDep !== state.age &&
                ((state.sadDep = state.age),
                chance(0.7) &&
                  ((state.depressed = { since: state.age, famYears: [] }),
                  say("I was diagnosed with depression."),
                  queuePopup(() =>
                    illnessCard("kid/face-crying.png", "Depression", "You are suffering from depression."),
                  ))),
                state.age >= 8 &&
                  !hasIll("Anxiety") &&
                  (e < 25 || t.mh < 20 || t.ins >= 65) &&
                  state.sadAnx !== state.age &&
                  ((state.sadAnx = state.age), chance(0.55) && queuePopup(anxietyEvent));
            } catch {}
          }, 400));
      }
      const depressionCheck = () => {
        if (state.dead || state.age < 5) return;
        const e = Math.min(state.stats.Happiness, mindOf().mh + 5);
        if (state.depressed)
          return e >= 60
            ? recoverDepression("I got my happiness back and recovered from depression.")
            : ((state.stats.Happiness = clamp(state.stats.Happiness - rint(1, 4))), void renderStats());
        (e < 20 || (e < 30 && chance(0.4))) &&
          ((state.depressed = { since: state.age, famYears: [] }),
          say("I was diagnosed with depression."),
          queuePopup(() =>
            illnessCard("kid/face-crying.png", "Depression", "You are suffering from depression."),
          ));
      };
      function recoverDepression(e) {
        (state.depressed = null),
          say(e),
          queuePopup(() => curedCard("You are no longer suffering from depression."));
      }
      document.getElementById("ageBtn").addEventListener("click", () => setTimeout(depressionCheck, 200));
      const ILLS = {
          "Sleep Apnea": 468,
          ADHD: 350,
          Insomnia: 220,
          Bronchitis: 310,
          Pneumonia: 920,
          Allergies: 120,
          "Food Poisoning": 150,
          "Stomach Flu": 180,
          Ulcer: 640,
          Flu: 140,
          Infection: 260,
          Migraines: 290,
          Anxiety: 300,
          Asthma: 240,
          Anemia: 160,
          Tonsillitis: 220,
          "Strep Throat": 180,
          "Common Cold": 60,
          Chickenpox: 120,
          "Ear Infection": 150,
          "Pink Eye": 90,
          Mono: 260,
          Shingles: 380,
          "Kidney Stones": 1200,
          Gout: 450,
          Bronchiolitis: 200,
          Sinusitis: 170,
          Arthritis: 520,
          "High Blood Pressure": 380,
          Osteoporosis: 600,
          Cataracts: 900,
          "Hearing Loss": 700,
          Schizophrenia: 950,
          Depression: 450,
          "Persistent Low Mood": 350,
          "Seasonal Depression": 250,
          "Bipolar Disorder": 900,
          "Mood Swings": 400,
          "Panic Disorder": 380,
          "Social Anxiety": 320,
          "Borderline Personality": 850,
          "Anger Issues": 300,
          OCD: 600,
          Dissociation: 550,
          PTSD: 700,
          "Eating Disorder": 750,
          "Paranoid Personality Disorder": 800,
          "Schizoid Personality Disorder": 750,
          "Schizotypal Personality Disorder": 850,
          "Antisocial Personality Disorder": 900,
          "Histrionic Personality Disorder": 750,
          "Narcissistic Personality Disorder": 800,
          "Avoidant Personality Disorder": 700,
          "Dependent Personality Disorder": 700,
        },
        STDS = {
          Chlamydia: {
            odds: 0.07,
            cost: [75, 350],
            cure: 0.9,
            fatal: 0,
            drain: [1, 2],
            sym: "It burns when you pee.",
          },
          Gonorrhea: {
            odds: 0.05,
            cost: [100, 500],
            cure: 0.85,
            fatal: 0,
            drain: [1, 3],
            sym: "You have a strange discharge and it burns when you pee.",
          },
          Syphilis: {
            odds: 0.025,
            cost: [150, 700],
            cure: 0.8,
            fatal: 0.01,
            drain: [2, 4],
            sym: "You found a painless sore and a rash on your hands.",
          },
          Herpes: {
            odds: 0.04,
            cost: [100, 400],
            cure: 0,
            fatal: 0,
            drain: [0, 1],
            chronic: !0,
            sym: "You have painful blisters down there.",
          },
          "Hepatitis B": {
            odds: 0.015,
            cost: [300, 1500],
            cure: 0.3,
            fatal: 0.02,
            drain: [2, 4],
            chronic: !0,
            sym: "Your skin and eyes have turned a little yellow.",
          },
          HIV: {
            odds: 0.012,
            cost: [500, 2500],
            cure: 0.005,
            fatal: 0.07,
            drain: [2, 5],
            chronic: !0,
            silent: !0,
          },
        },
        MED = {
          "Common Cold": { cost: [20, 100], cure: 0.95 },
          Flu: { cost: [40, 180], cure: 0.9 },
          Acne: { cost: [30, 150], cure: 0.85 },
          "Pink Eye": { cost: [30, 125], cure: 0.9 },
          Tonsillitis: { cost: [75, 250], cure: 0.9 },
          Chickenpox: { cost: [50, 200], cure: 0.9 },
          "Food Poisoning": { cost: [50, 200], cure: 0.9 },
          Diarrhea: { cost: [25, 125], cure: 0.9 },
          Ringworm: { cost: [30, 150], cure: 0.9 },
          "Athlete's Foot": { cost: [25, 120], cure: 0.9 },
          Lice: { cost: [30, 150], cure: 0.9 },
          Hives: { cost: [40, 180], cure: 0.85 },
          "Ear Infection": { cost: [75, 250], cure: 0.9 },
          Bronchitis: { cost: [100, 350], cure: 0.85 },
          Pneumonia: { cost: [200, 900], cure: 0.8, heals: [1, 2] },
          Tuberculosis: { cost: [300, 1200], cure: 0.85, fatal: 0.35, drain: [4, 8], w: 1, ages: [15, 120] },
          "Scarlet Fever": { cost: [150, 600], cure: 0.9, drain: [4, 8], w: 2, ages: [2, 15], heals: [1, 2] },
          Malaria: { cost: [250, 1e3], cure: 0.8, fatal: 0.8, drain: [8, 15], w: 0.6, ages: [1, 120] },
          Measles: { cost: [100, 500], cure: 0.9, drain: [4, 8], w: 3, ages: [1, 14], heals: [1, 2] },
          "Whooping Cough": {
            cost: [150, 600],
            cure: 0.9,
            drain: [3, 7],
            w: 2,
            ages: [1, 12],
            heals: [1, 2],
          },
          "Staph Infection": {
            cost: [200, 1e3],
            cure: 0.8,
            drain: [2, 4],
            w: 1,
            ages: [5, 120],
            heals: [1, 2],
          },
          "Kidney Stones": { cost: [300, 1800], cure: 0.85 },
          "Hepatitis A": { cost: [200, 800], cure: 0.9, drain: [2, 4], w: 1, ages: [5, 120], heals: [1, 3] },
          "Lyme Disease": { cost: [200, 850], cure: 0.8, drain: [2, 5], w: 1, ages: [5, 120], heals: [1, 3] },
          Appendicitis: { cost: [800, 3500], cure: 0.9, fatal: 0.6, drain: [8, 15], w: 2, ages: [8, 45] },
          Ebola: { cost: [1500, 8e3], cure: 0.5, fatal: 0.65, drain: [15, 25], w: 0.15, ages: [1, 120] },
          "Bubonic Plague": {
            cost: [500, 2500],
            cure: 0.85,
            fatal: 0.8,
            drain: [12, 20],
            w: 0.2,
            ages: [1, 120],
          },
          Rabies: { cost: [700, 3500], cure: 0.85, fatal: 0.8, drain: [10, 20], w: 0.3, ages: [3, 120] },
          "Yellow Fever": {
            cost: [1e3, 5e3],
            cure: 0,
            fatal: 0.85,
            drain: [12, 20],
            w: 0.15,
            ages: [1, 120],
          },
          "Mad Cow Disease": {
            cost: [1500, 7500],
            cure: 0.01,
            fatal: 0.8,
            drain: [12, 20],
            w: 0.15,
            ages: [10, 120],
          },
          Lupus: { cost: [600, 3e3], cure: 0.02, fatal: 0.75, drain: [8, 15], w: 0.4, ages: [15, 55] },
          "Heart Disease": {
            cost: [1e3, 6e3],
            cure: 0.45,
            fatal: 0.6,
            drain: [6, 12],
            chronic: !0,
            w: 3,
            ages: [45, 120],
          },
          "Hepatitis C": {
            cost: [750, 4e3],
            cure: 0.45,
            fatal: 0.25,
            drain: [3, 6],
            chronic: !0,
            w: 0.5,
            ages: [18, 120],
          },
          "Sickle Cell Disease": {
            cost: [500, 3e3],
            cure: 0.005,
            fatal: 0.12,
            drain: [3, 6],
            chronic: !0,
            w: 0.1,
            ages: [1, 40],
          },
          Diabetes: {
            cost: [150, 900],
            cure: 0,
            fatal: 0.09,
            drain: [2, 4],
            chronic: !0,
            w: 2,
            ages: [25, 120],
          },
          "Alzheimer's Disease": {
            cost: [500, 3e3],
            cure: 0,
            fatal: 0.16,
            drain: [3, 6],
            chronic: !0,
            w: 3,
            ages: [65, 120],
          },
          "High Blood Pressure": { cost: [100, 600], cure: 0.08, fatal: 0.16, chronic: !0, alt: 0.45 },
          Epilepsy: {
            cost: [300, 1800],
            cure: 0.1,
            fatal: 0.03,
            drain: [1, 3],
            chronic: !0,
            w: 0.5,
            ages: [1, 120],
          },
          Leukemia: { cost: [2e3, 12e3], cure: 0.15, fatal: 0.5, drain: [10, 18], w: 0.5, ages: [2, 120] },
          Cancer: { cost: [2e3, 15e3], cure: 0.12, fatal: 0.55, drain: [8, 16], w: 3, ages: [30, 120] },
          Migraines: { cure: 0.55, alt: 0.45 },
          Insomnia: { cure: 0.55, alt: 0.45 },
          Arthritis: { cure: 0.3, chronic: !0, alt: 0.4 },
        };
      for (const [P, Y] of Object.entries(STDS))
        MED[P] = { cost: Y.cost, cure: Y.cure, fatal: Y.fatal, chronic: Y.chronic };
      const FREE_HEALTHCARE = [
          "au",
          "at",
          "ca",
          "dk",
          "ec",
          "fi",
          "fr",
          "de",
          "gr",
          "hk",
          "ie",
          "il",
          "it",
          "jp",
          "kw",
          "nl",
          "nz",
          "no",
          "pt",
          "sg",
          "kr",
          "es",
          "se",
          "ch",
          "tw",
          "ae",
          "gb",
        ],
        HEALTHCARE = {
          consult: [100, 250],
          er: [400, 1500],
          alt: [80, 300],
          witch: [20, 120],
          doctorRepMult: (e) => 0.75 + e / 200,
        },
        freeCare = () => FREE_HEALTHCARE.includes(state.country),
        parentsPay = () => state.age < 18 && parentsAlive().length > 0,
        ILL_WORDS = {
          HIV: "HIV",
          "Hepatitis A": "hepatitis A",
          "Hepatitis B": "hepatitis B",
          "Hepatitis C": "hepatitis C",
          "Lyme Disease": "Lyme disease",
          "Alzheimer's Disease": "Alzheimer's disease",
          ADHD: "ADHD",
          OCD: "OCD",
          PTSD: "PTSD",
          Mono: "mono",
        },
        illWord = (e) => ILL_WORDS[e] || e.toLowerCase(),
        med = () => (state.med ||= { lifetime: 0, thisYear: 0 });
      function treatmentPrice(e) {
        if (e.gene) return GENE_TREAT[e.gene][1];
        const t = MED[e.name];
        return t && t.cost ? rint(...t.cost) : ILLS[e.name] || 200;
      }
      function payMedical(e, t) {
        return !e || freeCare() || parentsPay()
          ? (e && parentsPay() && !freeCare() && (med().byParents = (med().byParents || 0) + e), 0)
          : ((state.money -= e),
            (med().lifetime += e),
            (med().thisYear += e),
            t && (t.spent = (t.spent || 0) + e),
            renderStats(),
            e);
      }
      const billLabel = (e) => (freeCare() ? "Free (public healthcare)" : usd(e)),
        canPay = (e) => !e || freeCare() || parentsPay() || state.money >= e;
      function cantAffordCard(e, t) {
        say(`I couldn't afford treatment for my ${illWord(e.name)}.`),
          notice(
            "Medical Treatment",
            `Your doctor has recommended treatment for your ${illWord(e.name)}.<br><br><b>Treatment Cost:</b> ${usd(t)}<br><b>Available Balance:</b> ${usd(state.money)}<br><br>You cannot afford this medical treatment.`,
            null,
            !0,
          );
      }
      function seriousIllnessEvent() {
        const e = state.age,
          t = Object.entries(MED).filter(([t, a]) => a.w && e >= a.ages[0] && e <= a.ages[1] && !hasIll(t));
        if (!t.length) return;
        const a = (t, a) => a.w * (/^(Cancer|Heart Disease)$/.test(t) ? 1 + Math.max(0, e - 50) / 15 : 1);
        let o = Math.random() * t.reduce((e, [t, o]) => e + a(t, o), 0);
        const [n, s] = t.find(([e, t]) => (o -= a(e, t)) <= 0) || t[0];
        ills().push({
          name: n,
          drain: rint(...(s.drain || [1, 3])),
          known: !0,
          warned: !0,
          since: e,
          heal: s.heals ? e + rint(...s.heals) : null,
        }),
          (state.stats.Health = clamp(state.stats.Health - rint(3, 10))),
          renderStats(),
          say(`I was diagnosed with ${illWord(n)}.`),
          illnessCard(
            "health/face-sick.png",
            n,
            `You are suffering from ${illWord(n)}.${s.fatal >= 0.5 ? "<br><br>This is serious. You should see a doctor right away." : ""}`,
          );
      }
      function catchSTDs(e) {
        const t = [];
        for (const [a, o] of Object.entries(STDS))
          hasIll(a) ||
            ("HIV" === a && (state.genes || []).includes("hivimmune")) ||
            (chance(o.odds * (e ? 0.05 : 1)) &&
              (ills().push({ name: a, drain: rint(...o.drain), known: !1, std: !0, since: state.age }),
              t.push(a)));
        return t;
      }
      const COMMON_ILLS = [
          ["Common Cold", 1, 120, 10, [0, 1], 1, 60],
          ["Flu", 1, 120, 8, [1, 3], 1, 140],
          ["Strep Throat", 3, 60, 4, [1, 3], 1, 180],
          ["Tonsillitis", 3, 40, 3, [1, 3], 2, 220],
          ["Ear Infection", 1, 12, 5, [1, 2], 1, 150],
          ["Pink Eye", 2, 120, 4, [0, 1], 1, 90],
          ["Chickenpox", 1, 14, 6, [1, 2], 1, 120],
          ["Bronchiolitis", 1, 3, 3, [1, 3], 1, 200],
          ["Croup", 1, 6, 3, [1, 2], 1, 140],
          ["Rotavirus", 1, 5, 3, [1, 3], 1, 160],
          ["Hand, Foot and Mouth Disease", 1, 8, 3, [1, 2], 1, 120],
          ["Impetigo", 2, 12, 2, [0, 1], 1, 110],
          ["Lice", 3, 14, 4, [0, 1], 1, 60],
          ["Pinworms", 3, 12, 2, [0, 1], 1, 70],
          ["Mumps", 2, 14, 1, [1, 3], 1, 200],
          ["Rubella", 1, 12, 1, [1, 2], 1, 180],
          ["Fifth Disease", 2, 12, 2, [0, 1], 1, 90],
          ["Nosebleeds", 4, 14, 2, [0, 1], 1, 50],
          ["Sleepwalking", 4, 14, 1, [0, 1], 3, 150],
          ["Bedwetting", 3, 10, 2, [0, 0], 2, 90],
          ["Acne", 12, 30, 6, [0, 1], 4, 150],
          ["Mono", 13, 30, 2, [2, 4], 2, 260],
          ["Sinusitis", 10, 120, 3, [1, 2], 2, 170],
          ["Norovirus", 1, 120, 4, [1, 3], 1, 120],
          ["Laryngitis", 8, 120, 2, [0, 1], 1, 90],
          ["Cold Sores", 5, 120, 3, [0, 1], 1, 80],
          ["Warts", 5, 60, 3, [0, 0], 2, 120],
          ["Stye", 5, 120, 2, [0, 0], 1, 60],
          ["Hives", 2, 120, 2, [0, 1], 1, 120],
          ["Ringworm", 3, 120, 2, [0, 1], 1, 100],
          ["Athlete's Foot", 10, 120, 3, [0, 0], 1, 70],
          ["Scabies", 5, 120, 1, [0, 1], 1, 140],
          ["Swimmer's Ear", 5, 40, 2, [0, 1], 1, 90],
          ["Motion Sickness", 5, 30, 2, [0, 0], 3, 60],
          ["Sunburn", 5, 120, 3, [0, 1], 1, 40],
          ["Dehydration", 5, 120, 2, [1, 2], 1, 150],
          ["Heat Stroke", 10, 120, 1, [2, 4], 1, 600],
          ["Frostbite", 10, 120, 1, [1, 3], 1, 500],
          ["Sprained Ankle", 8, 80, 3, [0, 1], 1, 200],
          ["Broken Arm", 5, 90, 2, [1, 2], 1, 1500],
          ["Concussion", 6, 90, 1, [1, 3], 1, 800],
          ["Food Allergy", 1, 120, 2, [0, 1], 0, 250],
          ["Hay Fever", 5, 120, 3, [0, 1], 0, 150],
          ["Eczema", 1, 120, 2, [0, 1], 0, 200],
          ["Cavities", 5, 120, 4, [0, 0], 1, 200],
          ["Toothache", 5, 120, 3, [0, 1], 1, 150],
          ["Gingivitis", 15, 120, 2, [0, 1], 2, 180],
          ["Vitamin D Deficiency", 10, 120, 2, [0, 1], 2, 60],
          ["UTI", 15, 120, 3, [1, 2], 1, 120],
          ["Yeast Infection", 15, 80, 2, [0, 1], 1, 90],
          ["Kidney Infection", 18, 120, 1, [2, 4], 1, 700],
          ["Cellulitis", 10, 120, 1, [1, 3], 1, 500],
          ["Acid Reflux", 20, 120, 3, [0, 1], 0, 200],
          ["IBS", 15, 120, 2, [0, 1], 0, 300],
          ["Lactose Intolerance", 5, 120, 2, [0, 0], 0, 80],
          ["Celiac Disease", 5, 120, 1, [0, 1], 0, 400],
          ["Back Pain", 25, 120, 4, [0, 1], 2, 250],
          ["Tendinitis", 20, 120, 2, [0, 1], 2, 300],
          ["Carpal Tunnel", 25, 120, 2, [0, 1], 0, 900],
          ["Sciatica", 30, 120, 2, [1, 2], 2, 600],
          ["Plantar Fasciitis", 30, 120, 2, [0, 1], 2, 300],
          ["Hemorrhoids", 25, 120, 2, [0, 1], 2, 250],
          ["Gallstones", 30, 120, 1, [1, 3], 1, 2500],
          ["Hernia", 30, 120, 1, [1, 2], 0, 3e3],
          ["Psoriasis", 15, 120, 1, [0, 1], 0, 500],
          ["Rosacea", 30, 120, 1, [0, 0], 0, 250],
          ["Migraines", 12, 120, 2, [0, 1], 0, 290],
          ["Insomnia", 15, 120, 2, [1, 2], 2, 220],
          ["Vertigo", 30, 120, 1, [0, 1], 1, 300],
          ["Tinnitus", 20, 120, 1, [0, 0], 0, 400],
          ["Hypothyroidism", 30, 120, 1, [0, 1], 0, 300],
          ["Fibromyalgia", 25, 70, 1, [1, 2], 0, 800],
          ["Varicose Veins", 35, 120, 1, [0, 0], 0, 700],
          ["Bursitis", 35, 120, 1, [0, 1], 2, 300],
          ["Frozen Shoulder", 40, 120, 1, [0, 1], 2, 500],
          ["Restless Leg Syndrome", 40, 120, 1, [0, 1], 0, 250],
          ["Shingles", 50, 120, 2, [2, 4], 1, 380],
          ["Kidney Stones", 25, 120, 2, [3, 6], 1, 1200],
          ["Gout", 40, 120, 2, [1, 3], 0, 450],
          ["Arthritis", 50, 120, 3, [1, 3], 0, 520],
          ["High Blood Pressure", 50, 120, 3, [2, 4], 0, 380],
          ["Osteoporosis", 55, 120, 2, [2, 4], 0, 600],
          ["Cataracts", 60, 120, 2, [1, 2], 0, 900],
          ["Glaucoma", 50, 120, 1, [0, 1], 0, 800],
          ["Dry Eye", 40, 120, 2, [0, 0], 0, 100],
          ["Hearing Loss", 60, 120, 2, [0, 1], 0, 700],
        ],
        ILL_INFO = Object.fromEntries(COMMON_ILLS.map((e) => [e[0], e]));
      function illnessEvent() {
        const e = COMMON_ILLS.filter(
          ([e, t, a]) =>
            state.age >= t && state.age <= a && !hasIll(e) && !("Chickenpox" === e && state.hadPox),
        );
        if (!e.length) return;
        let t = Math.random() * e.reduce((e, t) => e + t[3], 0);
        const [a, , , , [o, n], s] = e.find((e) => (t -= e[3]) <= 0) || e[0],
          r = illWord(a),
          i = rint(o, n);
        ills().push({ name: a, drain: i, known: !0, since: state.age, heal: s ? state.age + s : null }),
          "Chickenpox" === a && ((state.hadPox = !0), renderAvatar()),
          "Pink Eye" === a && renderAvatar(),
          (state.stats.Health = clamp(state.stats.Health - rint(1, 4))),
          renderStats(),
          say(
            s
              ? `I came down with ${r.replace(/^(common cold|flu)$/, (e) => "the " + e)}.`
              : `I developed ${r}.`,
          ),
          illnessCard("health/face-sick.png", a, `You are suffering from ${r}.`);
      }
      COMMON_ILLS.forEach(([e, , , , , t, a]) => {
        (ILLS[e] ??= a),
          MED[e] ||
            (MED[e] = t
              ? { cost: [Math.round(0.6 * a), a], cure: 0.85 }
              : { cost: [Math.round(0.6 * a), a], cure: 0.25, chronic: !0, alt: 0.3 });
      }),
        Object.assign(ILL_WORDS, {
          IBS: "IBS",
          UTI: "a UTI",
          "Vitamin D Deficiency": "vitamin D deficiency",
          "Hand, Foot and Mouth Disease": "hand, foot and mouth disease",
        });
      const SYMPTOMS = [
          [
            "Difficulty Concentrating",
            "health/brain.png",
            "While doing some research, you try to concentrate but just can't seem to stay focused.<br><br>What will you do?",
            ["Sleep Apnea", "ADHD", "Insomnia"],
          ],
          [
            "Persistent Cough",
            "health/cough-syrup.png",
            "You've had a nagging cough for weeks now and it just won't go away.<br><br>What will you do?",
            ["Bronchitis", "Pneumonia", "Allergies"],
          ],
          [
            "Nausea",
            "health/worried.png",
            "You've been feeling queasy and nauseous for days.<br><br>What will you do?",
            ["Food Poisoning", "Stomach Flu", "Ulcer"],
          ],
          [
            "Cold Sweats",
            "health/sweat.png",
            "You keep waking up drenched in cold sweats.<br><br>What will you do?",
            ["Flu", "Infection", "Insomnia"],
          ],
          [
            "Headaches",
            "health/worried.png",
            "You've been getting pounding headaches every afternoon.<br><br>What will you do?",
            ["Migraines", "Sleep Apnea", "Flu"],
          ],
          [
            "Chest Tightness",
            "xc/shocked.png",
            "Your chest has become progressively more tight over the last few days. You've also been struggling with getting a good night's rest lately.<br><br>What will you do?",
            ["Asthma", "Bronchitis", "Pneumonia"],
          ],
          [
            "Dizziness",
            "xc/dizzy.png",
            "You've been feeling dizzy every time you stand up too fast.<br><br>What will you do?",
            ["Anemia", "Flu", "Migraines"],
          ],
          [
            "Upset Stomach",
            "xc/sick.png",
            "Your stomach has been churning for a week and you can barely keep food down.<br><br>What will you do?",
            ["Food Poisoning", "Ulcer", "Stomach Flu"],
          ],
        ],
        DOC_LAST = [
          "Tickle",
          "Patel",
          "Nguyen",
          "Hart",
          "Ramirez",
          "Klein",
          "Okafor",
          "Brooks",
          "Sato",
          "Moreau",
          "Fisher",
          "Lindqvist",
          "Abbott",
          "Cruz",
          "Feldman",
          "Kowalski",
        ],
        ills = () => (state.ills ||= []),
        hasIll = (e) => ills().some((t) => t.name === e),
        ACUTE_HEAL = {
          Bronchitis: [1, 2],
          "Food Poisoning": [1, 1],
          "Stomach Flu": [1, 1],
          Flu: [1, 1],
          Infection: [1, 2],
          Ulcer: [2, 5],
          Pneumonia: [1, 2],
        },
        catchIll = (e) => {
          hasIll(e) ||
            ills().push({
              name: e,
              drain: "Anxiety" === e ? 0 : rint(1, 4),
              known: !1,
              since: state.age,
              heal: ACUTE_HEAL[e] ? state.age + rint(...ACUTE_HEAL[e]) : null,
            });
        },
        MINOR_FLOOR = 25,
        seriousIll = (e) => !(!MED[e.name] || !MED[e.name].fatal),
        INH_ADD = {
          addiction: "alcohol",
          nicotine: "cigarettes",
          vaping: "vaping",
          cannabis: "weed",
          cocaine: "cocaine",
          meth: "meth",
          opioid: "painkillers",
          pills: "pills",
          shrooms: "shrooms",
          lsd: "LSD",
          gambling: "gambling",
          caffeine: "caffeine",
          gaming: "video games",
          internet: "social media",
        },
        INH_ICON = {
          depression: "kid/face-crying.png",
          anxiety: "health/anxious.png",
          insomnia: "health/worried.png",
          adhd: "health/brain.png",
        };
      function inheritedCheck() {
        if (state.dead || state.prison || !mods.familyTree) return;
        if (
          (!state.conds ||
            state.conds.length ||
            state.condsRerolled ||
            ((state.condsRerolled = !0), delete state.conds, delete state.risk),
          !state.conds)
        )
          try {
            ftInheritAll(ftSetup(), ftCtx());
          } catch (e) {
            return;
          }
        const e = (state.inhDone ||= {});
        for (const t of state.conds || []) {
          const a = FT_COND[t.id];
          if (!a || "gene" === a.grp || e[t.id] || state.age < a.onset || !chance(0.35)) continue;
          e[t.id] = !0;
          const o = (t.par || []).filter((e) => e && e.first),
            n = o.length
              ? o.map((e) => `your ${(e.role || "relative").toLowerCase()} ${e.first}`).join(" and ")
              : "your family",
            s = a.img ? ftGenePic(a, 30) : a.spr && FT_SPR[a.spr] ? ftSpr(a.spr, 30) : null,
            r = t.general
              ? `Addiction runs in ${"your family" === n ? "your family" : `the family (${n})`}.`
              : `It runs in the family: you inherited it from ${n}.`;
          if ("add" === a.grp) {
            const e = INH_ADD[t.id] || a.name.toLowerCase();
            addictions().includes(e) || addictions().push(e),
              say(`I became addicted to ${e}, just like ${n.replace(/\byour\b/g, "my")}.`),
              queuePopup(() =>
                illnessCard(
                  s || "vice/brain.png",
                  a.name,
                  `You are now addicted to ${e}.<br><br>${r}`,
                  "Addiction",
                ),
              );
          } else
            "depression" === t.id
              ? (state.depressed || (state.depressed = { since: state.age, famYears: [] }),
                inheritIll(a, t.id),
                (state.stats.Happiness = clamp(state.stats.Happiness - rint(10, 20))),
                renderStats(),
                say("I was diagnosed with depression, which runs in my family."),
                queuePopup(() =>
                  illnessCard(
                    s || INH_ICON.depression,
                    "Depression",
                    `You are suffering from depression.<br><br>${r}`,
                  ),
                ))
              : (inheritIll(a, t.id),
                (state.stats.Happiness = clamp(state.stats.Happiness - rint(4, 12))),
                (state.stats.Health = clamp(state.stats.Health - rint(2, 6))),
                renderStats(),
                say(`I developed ${a.name}, which runs in my family.`),
                queuePopup(() =>
                  illnessCard(
                    s || INH_ICON[t.id] || "health/brain.png",
                    a.name,
                    `You are suffering from ${a.name}.<br><br>${r}`,
                    "Ailment",
                  ),
                ));
        }
      }
      function inheritIll(e, t) {
        hasIll(e.name) || ills().push({ name: e.name, drain: rint(1, 4), known: !0 });
        const a = ills().find((t) => t.name === e.name);
        return (
          Object.assign(a, { known: !0, inherited: !0, mood: rint(1, 4) }),
          "schizophrenia" === t && null == a.cureLeft
            ? (a.cureLeft = rint(20, 40))
            : /pd$/.test(t) && "bpd" !== t && null == a.cureLeft && (a.cureLeft = rint(5, 12)),
          a
        );
      }
      function anxietyEvent() {
        catchIll("Anxiety"),
          (ills().find((e) => "Anxiety" === e.name).known = !0),
          say("I started suffering from anxiety."),
          illnessCard("health/anxious.png", "Anxiety", "You are suffering from anxiety.", "Ailment");
      }
      function symptomEvent() {
        const [e, t, a, o] = any(SYMPTOMS),
          n = any(o),
          s = e.toLowerCase();
        catchIll(n),
          jCard({
            tag: "Symptom",
            green: !0,
            iconSrc: t,
            title: e,
            lead: a,
            bars: [["Your Concern", rint(15, 90), "#b3261e"]],
            surprise: !0,
            choices: [
              ["Go to the doctor", () => setTimeout(doctorCard, 80)],
              ["It doesn't bother me", () => say(`I ignored my ${s}.`)],
              [
                "Chug some water",
                () => {
                  if (chance(0.25))
                    return (
                      (state.ills = ills().filter((e) => e.name !== n)),
                      fx({ Health: 2 }, `I chugged some water and my ${s} went away.`),
                      notice("Hydrated", `You chugged some water and your ${s} went away!`)
                    );
                  say(`I chugged some water, but it didn't help my ${s}.`),
                    notice(
                      "Still there",
                      `You chugged a whole bottle of water, but your ${s} didn't go away.`,
                    );
                },
              ],
              [
                "Search the web",
                () => {
                  const e = chance(0.4)
                    ? n
                    : any(Object.keys(ILLS).filter((e) => e !== n && "Anxiety" !== e));
                  say(`I searched the web about my ${s}.`),
                    notice(
                      "Web search",
                      `According to the internet, your ${s} is a sign of ${e.toLowerCase()}. Or cancer. The internet always says cancer.`,
                    );
                },
              ],
            ],
          });
      }
      function asthmaEvent() {
        catchIll("Asthma");
        const e = ills().find((e) => "Asthma" === e.name);
        (e.known = !0),
          (e.drain = rint(1, 2)),
          say("I started suffering from asthma."),
          illnessCard("xc/grimace.png", "Asthma", "You are suffering from asthma.", "Ailment");
      }
      function doctorCard() {
        const [e, t] = [...DOC_LAST].sort(() => Math.random() - 0.5),
          a = [
            { name: `Dr. ${e}`, rep: rint(10, 100) },
            { name: `Dr. ${t}`, rep: rint(10, 100) },
          ],
          o = ep(rint(...HEALTHCARE.consult));
        jCard({
          tag: "Healthcare",
          iconSrc: "health/doctor.png",
          title: "Doctor",
          lead: "Which local doctor will you schedule an appointment to see?",
          surprise: !0,
          rows: [["Consultation Fee", billLabel(o)]],
          bars: a.map((e) => [`${e.name}'s Reputation`, e.rep, e.rep < 13 ? "#b3261e" : "#2fa03b"]),
          choices: [
            ...a.map((e) => [
              e.name,
              () => {
                if (!canPay(o))
                  return notice(
                    "Flat broke",
                    "You can't afford the consultation fee.",
                    null,
                    !1,
                    brokeRows(o),
                  );
                payMedical(o), setTimeout(() => visitDoctor(e), 80);
              },
            ]),
            ["Actually, never mind", () => {}],
          ],
        });
      }
      document.getElementById("ageBtn").addEventListener("click", () => setTimeout(inheritedCheck, 260));
      const GENE_TREAT = {
        hypertrichosis: [0.55, 2500, "laser hair removal"],
        heterochromia: [0.6, 900, "tinted contact lenses"],
        chimera: [0.3, 6e4, "a separation surgery"],
        rhnull: [0.05, 8e3, "experimental gene therapy"],
        hivimmune: [0.05, 8e3, "experimental gene therapy"],
        lrp5: [0.08, 6e3, "bone-density treatment"],
        tetrachromacy: [0.1, 3e3, "a vision treatment"],
        supertaster: [0.15, 1200, "taste bud therapy"],
        dec2: [0.1, 3500, "a sleep program"],
      };
      function visitDoctor(e) {
        const t = ills(),
          a = btShow
            ? (state.genes || []).filter((e) => BT[e]).map((e) => ({ name: BT[e].name, gene: e, known: !0 }))
            : [],
          o = [...t.filter((t) => t.known || chance(0.4 + e.rep / 180)), ...a];
        if (o.length) return o.forEach((e) => (e.known = !0)), diagnosisCard(e, o);
        say(`I visited ${e.name}, who said I was perfectly healthy.`),
          t.length || fx({ Health: rint(0, 3) }, ""),
          notice("Clean bill of health", `${e.name} says you're as healthy as a horse!`);
      }
      function diagnosisCard(e, t) {
        const a = t.map((e) => illWord(e.name)),
          o = t.map(treatmentPrice),
          n = a.length > 1 ? a.slice(0, -1).join(", ") + " and " + a[a.length - 1] : a[0];
        say(`${e.name} diagnosed me with ${n}.`),
          ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="jm-tag" style="margin-top:12px">Healthcare</div><h4><img src="health/pill-green.png" alt=""><span>Diagnosis</span></h4>\n      <div class="lead">${e.name} has diagnosed you with ${n}. Select a treatment today!</div>\n      <label class="hr-lab">Pick your treatment:</label><div class="hr-sel"><select id="dxSel">${t.map((e, t) => `<option value="${t}">${e.name} (${freeCare() ? "Free" : usd(o[t])})</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="dxGo">Treat me</button><button class="jm-apply ev-btn" id="dxNo">I'll pass for now</button>\n      <div class="ev-surprise"><img src="emoji/1f3b2.png"><span>Surprise me!</span></div></div>`),
          evWrap.classList.add("open");
        const s = (a) => {
          evWrap.classList.remove("open");
          const n = t[a],
            s = o[a],
            r = illWord(n.name);
          if (!canPay(s)) return cantAffordCard(n, s);
          if ((payMedical(s, n), (n.attempts = (n.attempts || 0) + 1), n.gene)) {
            const [t, , a] = GENE_TREAT[n.gene],
              o = BT[n.gene];
            if ("chimera" === n.gene && chance(0.08))
              return (
                say(`I died during ${a} for my chimera body.`),
                setTimeout(() => die("complications from a separation surgery"), 300)
              );
            if (chance(t + e.rep / 1e3)) {
              (state.genes = state.genes.filter((e) => e !== n.gene)),
                (state.conds = (state.conds || []).filter((e) => e.id !== n.gene));
              for (const [e, t] of Object.entries(o.fx || {})) state.stats[e] = clamp(state.stats[e] - t);
              return (
                geneLook(state.look, state.genes),
                renderStats(),
                renderAvatar(),
                say(`${e.name} treated my ${r} with ${a}.`),
                setTimeout(
                  () =>
                    curedCard(`${e.name} treated your ${r} with ${a}. You no longer have ${r}.`, "Ailment"),
                  80,
                )
              );
            }
            return (
              say(`${e.name} tried to treat my ${r} with ${a}, but it didn't work.`),
              notice(
                "Treatment failed",
                `${e.name} tried ${a}, but your ${r} is still there. It's written in your DNA.`,
              )
            );
          }
          if (MED[n.name] && null == n.cureLeft && !n.inherited) {
            const t = MED[n.name],
              a = (t) => (n.history ||= []).push({ age: state.age, doctor: e.name, cost: s, result: t });
            n.treatedAt = state.age;
            const o = {
                Cancer: [0.12, 0.3, 0.5, 0.6],
                Leukemia: [0.15, 0.35, 0.55, 0.65],
                "Heart Disease": [0.45, 0.5, 0.6, 0.65],
                "Hepatitis C": [0.45, 0.45, 0.6, 0.9],
              }[n.name],
              i = state.birthYear + state.age,
              l = o ? o[i < 1970 ? 0 : i < 1995 ? 1 : i < 2015 ? 2 : 3] : t.cure;
            return chance(Math.min(0.95, l * HEALTHCARE.doctorRepMult(e.rep)))
              ? (a("cured"),
                (n.lastResult = "cured"),
                (state.ills = ills().filter((e) => e !== n)),
                "Depression" === n.name && (state.depressed = null),
                (state.medHistory ||= []).push({
                  name: n.name,
                  from: n.since ?? null,
                  cured: state.age,
                  spent: n.spent || 0,
                  attempts: n.attempts,
                }),
                fx({ Health: rint(4, 12) }, `${e.name} successfully treated my ${r}.`),
                setTimeout(() => curedCard(`You are no longer suffering from ${r}.`, "Ailment"), 80))
              : t.chronic || chance(0.4)
                ? (a("improved"),
                  (n.lastResult = "improved"),
                  (n.drain = Math.max(0, (n.drain || 0) - 1)),
                  fx(
                    { Health: rint(2, 6) },
                    `${e.name} treated my ${r}. It's still there, but I feel a bit better.`,
                  ),
                  notice(
                    "Some improvement",
                    `${e.name} couldn't cure your ${r}, but the treatment helped you feel a bit better.${t.chronic ? " Keep up your treatment to slow it down." : ""}`,
                  ))
                : (a("failed"),
                  (n.lastResult = "failed"),
                  say(`${e.name} tried to treat my ${r}, but it didn't work.`),
                  notice("Treatment failed", `${e.name}'s treatment for your ${r} didn't work.`));
          }
          return null != n.cureLeft && --n.cureLeft > 0
            ? (say(`${e.name} treated my ${r}, but I'm still suffering from it.`),
              notice(
                "Treatment failed",
                `${e.name}'s treatment helped a little, but you are still suffering from ${r}. This is going to take a lot more treatment.`,
              ))
            : null != n.cureLeft || chance(Math.min(0.95, 0.55 * HEALTHCARE.doctorRepMult(e.rep)))
              ? ((state.ills = ills().filter((e) => e !== n)),
                "Depression" === n.name && (state.depressed = null),
                fx(
                  "Anxiety" === n.name ? { Health: 2, Happiness: rint(5, 12) } : { Health: rint(4, 12) },
                  `${e.name} successfully treated my ${r}.`,
                ),
                setTimeout(() => curedCard(`You are no longer suffering from ${r}.`, "Ailment"), 80))
              : (say(`${e.name} tried to treat my ${r}, but it didn't work.`),
                void notice("Treatment failed", `${e.name}'s treatment for your ${r} didn't work.`));
        };
        (document.getElementById("dxGo").onclick = () => s(+document.getElementById("dxSel").value)),
          (document.getElementById("dxNo").onclick = () => {
            evWrap.classList.remove("open"), say(`I passed on treatment for my ${n}.`);
          }),
          (ev.querySelector(".ev-surprise").onclick = () =>
            chance(0.5) ? s(rint(0, t.length - 1)) : document.getElementById("dxNo").onclick());
      }
      function openDoctorMenu() {
        (sTitle.textContent = "DOCTOR"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const e = (e, t, a) =>
          `<div class="row" data-dm="${e}"><img src="health/${e}.png"><div class="t"><b>${t}</b><span>${a}</span></div>${DOTS}</div>`;
        (sList.innerHTML =
          e("medical-doctor", "Medical Doctor", "Visit a medical doctor") +
          e("emergency-room", "Emergency Room", "Visit the emergency room") +
          e("alternative-doctor", "Alternative Doctor", "Try an alternative treatment") +
          e("witch-doctor", "Witch Doctor", "Visit the witch doctor")),
          (sList.scrollTop = 0);
        const t = {
          "medical-doctor": doctorCard,
          "emergency-room": emergencyRoom,
          "alternative-doctor": alternativeDoctor,
          "witch-doctor": witchDoctor,
        };
        sList.querySelectorAll("[data-dm]").forEach(
          (e) =>
            (e.onclick = () => {
              play("choice"), t[e.dataset.dm]();
            }),
        ),
          screen.classList.add("open");
      }
      const knownIlls = () => ills().filter((e) => e.known);
      function emergencyRoom() {
        const e = ep(rint(...HEALTHCARE.er));
        jCard({
          tag: "Healthcare",
          iconSrc: "health/emergency-room.png",
          title: "Emergency Room",
          lead: "Rush to the emergency room to get checked out and stabilized?",
          close: !0,
          rows: [["Cost", billLabel(e)]],
          bars: [["Your Health", state.stats.Health]],
          choices: [
            [
              "Go to the ER",
              () => {
                if (!canPay(e))
                  return notice("Flat broke", "You can't afford the emergency room.", null, !1, brokeRows(e));
                payMedical(e), screen.classList.remove("open");
                const t = ills().filter((e) => MED[e.name] && MED[e.name].fatal);
                t.forEach((e) => {
                  (e.known = !0), (e.treatedAt = state.age);
                }),
                  fx(
                    { Health: rint(5, 15) },
                    t.length
                      ? `The ER stabilized my ${illWord(t[0].name)}.`
                      : "I went to the emergency room to get checked out.",
                  ),
                  notice(
                    "Emergency Room",
                    t.length
                      ? `The ER doctors stabilized your ${t.map((e) => illWord(e.name)).join(" and ")} and sent you home. You should still see a medical doctor.`
                      : "The ER doctors checked you over, patched you up and sent you home.",
                    null,
                    !0,
                  );
              },
            ],
          ],
        });
      }
      const ALT_TREATMENTS = ["Acupuncture", "Herbal Medicine", "Chiropractor", "Reiki", "Hypnotherapy"];
      function alternativeDoctor() {
        const e = knownIlls();
        if (!e.length)
          return notice(
            "Alternative Doctor",
            "You don't have any known illnesses to treat. Visit a medical doctor to get diagnosed first.",
            null,
            !0,
          );
        const t = ep(rint(...HEALTHCARE.alt));
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="altX" style="left:-14px;top:-14px">${CARD_X}</div><div class="jm-tag" style="margin-top:12px">Healthcare</div>\n      <h4><img src="health/alternative-doctor.png" alt=""><span>Alternative Doctor</span></h4>\n      <div class="lead">Try an alternative treatment for one of your ailments.</div>\n      <table class="jc"><tbody><tr><td><b>Cost:</b> ${usd(t)}</td></tr></tbody></table>\n      <label class="hr-lab">Pick your ailment:</label><div class="hr-sel"><select id="altIll">${e.map((e, t) => `<option value="${t}">${e.name}</option>`).join("")}</select></div>\n      <label class="hr-lab">Pick your treatment:</label><div class="hr-sel"><select id="altKind">${ALT_TREATMENTS.map((e) => `<option>${e}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="altGo">Try it</button></div>`),
          (ev.style.overflow = "visible");
        const a = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("altX").onclick = a),
          (document.getElementById("altGo").onclick = () => {
            const o = e[+document.getElementById("altIll").value],
              n = document.getElementById("altKind").value,
              s = illWord(o.name);
            if ((a(), !parentsPay() && state.money < t))
              return notice("Flat broke", `You can't afford ${n.toLowerCase()}.`, null, !1, brokeRows(t));
            parentsPay() ||
              ((state.money -= t),
              (med().lifetime += t),
              (med().thisYear += t),
              (o.spent = (o.spent || 0) + t),
              renderStats()),
              screen.classList.remove("open");
            const r = MED[o.name] || {};
            if (chance(r.alt || 0.03))
              return (
                (state.ills = ills().filter((e) => e !== o)),
                fx({ Health: rint(3, 8) }, `I tried ${n.toLowerCase()} and it cured my ${s}!`),
                setTimeout(() => curedCard(`${n} cured your ${s}!`, "Ailment"), 80)
              );
            say(`I tried ${n.toLowerCase()} for my ${s}, but it didn't help.`),
              notice("No improvement", `${n} didn't do anything for your ${s}.`, null, !0);
          }),
          evWrap.classList.add("open");
      }
      function witchDoctor() {
        const e = ep(rint(...HEALTHCARE.witch));
        jCard({
          tag: "Healthcare",
          iconSrc: "health/witch-doctor.png",
          title: "Witch Doctor",
          close: !0,
          lead: "A witch doctor offers to cure whatever ails you with an ancient remedy. Results are not guaranteed.",
          rows: [["Cost", usd(e)]],
          choices: [
            [
              "Let the witch doctor treat me",
              () => {
                if (state.money < e)
                  return notice("Flat broke", "You can't afford the witch doctor.", null, !1, brokeRows(e));
                (state.money -= e),
                  (med().lifetime += e),
                  (med().thisYear += e),
                  renderStats(),
                  screen.classList.remove("open");
                const t = Math.random(),
                  a = ills();
                if (t < 0.03)
                  return (
                    say("I drank a potion from a witch doctor."),
                    setTimeout(() => die("a witch doctor's potion"), 300)
                  );
                if (t < 0.15 && a.length) {
                  const e = any(a);
                  return (
                    (state.ills = a.filter((t) => t !== e)),
                    fx({ Health: rint(2, 8) }, `A witch doctor somehow cured my ${illWord(e.name)}!`),
                    setTimeout(
                      () => curedCard(`Somehow, the witch doctor cured your ${illWord(e.name)}!`, "Ailment"),
                      80,
                    )
                  );
                }
                if (t < 0.45)
                  return (
                    fx({ Health: -rint(5, 20) }, "A witch doctor's remedy made me sick."),
                    notice(
                      "That was a mistake",
                      "The witch doctor's remedy made you violently ill.",
                      null,
                      !0,
                    )
                  );
                say("I visited a witch doctor, but nothing happened."),
                  notice(
                    "Nothing happened",
                    "The witch doctor chanted and waved some feathers around. You feel exactly the same.",
                    null,
                    !0,
                  );
              },
            ],
          ],
        });
      }
      const isSingle = () =>
        !(
          (state.lovers || []).length ||
          (state.spouse && !state.spouse.dead) ||
          (state.exes || []).some((e) => e.exAt === state.age)
        );
      function loveInTheAir() {
        jCard({
          tag: "Love",
          iconSrc: "health/heart.png",
          title: "Love in the Air",
          lead: "You're noticing that everyone you know is coupled up with someone, but you're not.",
          choices: [
            [
              "Help me find a date",
              () =>
                setTimeout(() => {
                  openActivities(), openLove(), screen.classList.add("open");
                }, 80),
            ],
            [
              "I'm okay with that, actually",
              () => {
                fx({ Happiness: 2 }, "I decided I was fine being single.");
              },
            ],
          ],
        });
      }
      function sharkBait() {
        const e = state.job,
          t = `${any(["Petty Officer", "Seaman", "Chief Petty Officer"])} ${any(DOC_LAST)}`;
        jCard({
          tag: "Job",
          iconSrc: "health/boat.png",
          title: "Shark Bait",
          lead: "Your commanding officer informs the team of a life-threatening rescue mission in shark-infested waters and is asking for volunteers. What will you do?",
          choices: [
            [
              "Volunteer a fellow guardsman",
              () => {
                if (((e.perf = clamp((e.perf ?? 50) - 3)), chance(0.35)))
                  return (
                    say(`I volunteered ${t} for a rescue mission. A shark bit them.`),
                    notice(
                      "Shark bait",
                      `You volunteered ${t} for the mission. A shark took a chunk out of their leg, and they haven't spoken to you since.`,
                    )
                  );
                say(`I volunteered ${t} for a rescue mission in shark-infested waters.`),
                  notice(
                    "Volunteered",
                    `You volunteered ${t}. They completed the rescue and got all the credit.`,
                  );
              },
            ],
            [
              "Hide in the latrine",
              () => {
                (e.perf = clamp((e.perf ?? 50) - rint(8, 15))),
                  say("I hid in the latrine to avoid a dangerous rescue mission."),
                  notice(
                    "Caught",
                    "Your commanding officer found you hiding in the latrine. They were not impressed.",
                  );
              },
            ],
            [
              "Volunteer",
              () => {
                const t = Math.random();
                if (t < 0.04)
                  return (
                    say("I volunteered for a rescue mission and was eaten by a shark."), die("shark attack")
                  );
                if (t < 0.25)
                  return (
                    (e.perf = clamp((e.perf ?? 50) + 8)),
                    fx(
                      { Health: -rint(15, 40), Happiness: -5 },
                      "I was bitten by a shark during a rescue mission!",
                    ),
                    notice(
                      "Shark attack!",
                      "A shark bit you during the rescue, but you still got everyone out of the water.",
                    )
                  );
                const a = rint(2, 9);
                (e.perf = clamp((e.perf ?? 50) + rint(10, 18))),
                  fx(
                    { Happiness: 6 },
                    `I volunteered for a rescue mission and saved ${a} people from shark-infested waters.`,
                  ),
                  notice(
                    "Hero",
                    `You rescued ${NUM_WORDS[a] || a} people from shark-infested waters without a scratch!`,
                  );
              },
            ],
          ],
        });
      }
      function depressedFamilyTime() {
        const e = state.depressed;
        if (!e) return null;
        e.timeAt ??= {};
        return (e.timeAt[state.age] = (e.timeAt[state.age] || 0) + 1) > 2
          ? "still down"
          : (e.famYears.includes(state.age) || e.famYears.push(state.age),
            e.famYears.includes(state.age - 1)
              ? (setTimeout(
                  () => recoverDepression("Spending time with my family helped me recover from depression."),
                  600,
                ),
                "cured")
              : "helped");
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || state.prison) return;
        for (const e of ills()) {
          if (
            (null == e.heal && ACUTE_HEAL[e.name] && (e.heal = state.age + rint(...ACUTE_HEAL[e.name])),
            e.drain)
          ) {
            const t = state.stats.Health;
            state.stats.Health = clamp(seriousIll(e) ? t - e.drain : Math.max(Math.min(t, 25), t - e.drain));
          }
          "Anxiety" === e.name
            ? (state.stats.Happiness = clamp(state.stats.Happiness - rint(1, 4)))
            : e.inherited &&
              (state.stats.Happiness = clamp(state.stats.Happiness - (e.mood || 2) - rint(0, 2)));
        }
        const e = ills().filter((e) => null != e.heal && state.age >= e.heal);
        e.length &&
          ((state.ills = ills().filter((t) => !e.includes(t))),
          e.some((e) => "Chickenpox" === e.name || "Pink Eye" === e.name) && renderAvatar(),
          e.forEach((e) =>
            say(
              `I recovered from ${/^(Mono|Gout|Chickenpox)$/.test(e.name) ? e.name : e.name.toLowerCase()}.`,
            ),
          )),
          ills().length && renderStats(),
          (med().thisYear = 0);
        let t = !1;
        for (const e of ills()) {
          const a = MED[e.name];
          if (!a) continue;
          const o = null != e.treatedAt && state.age - e.treatedAt <= 1,
            n = state.stats.Health;
          if (
            ("High Blood Pressure" === e.name || "Heart Disease" === e.name) &&
            e.warned &&
            state.age >= 35 &&
            chance(o ? 0.002 : 0.005)
          ) {
            const e = chance(0.5) ? "a massive heart attack" : "a stroke";
            return say(`I suffered ${e}.`), void setTimeout(() => die(e), 300);
          }
          if (
            (a.heals && null == e.heal && (e.heal = state.age + rint(...a.heals)),
            a.fatal && null == e.heal && state.age > (e.since ?? state.age - 1))
          )
            if ((e.warned && null == e.warnedAt && (e.warnedAt = state.age), e.known && e.warned)) {
              if (
                state.age - (e.warnedAt ?? state.age) >= 2 &&
                (state.age >= 25 || n < 20) &&
                chance(0.25 * a.fatal * (o ? 0.3 : 1) * (n < 30 ? 1.25 : n > 80 ? 0.85 : 1))
              )
                return (
                  say(`My ${illWord(e.name)} got worse.`),
                  void setTimeout(
                    () => die("HIV" === e.name ? "complications from AIDS" : illWord(e.name)),
                    300,
                  )
                );
            } else {
              const a = !e.known;
              (e.known = !0),
                (e.warned = !0),
                (e.warnedAt = state.age),
                a &&
                  (say(`I found out I have ${illWord(e.name)}.`),
                  t ||
                    ((t = !0),
                    queuePopup(() =>
                      illnessCard(
                        "health/face-sick.png",
                        e.name,
                        `You've been feeling awful, and you found out you have ${illWord(e.name)}.<br><br>See a doctor before it gets worse.`,
                      ),
                    )));
            }
          const s = e.std && STDS[e.name];
          s &&
            !e.known &&
            !s.silent &&
            !e.symShown &&
            state.age > e.since &&
            ((e.symShown = !0),
            say("Something didn't feel right down there."),
            queuePopup(() => notice("Something's wrong", `${s.sym}<br><br>You should see a doctor.`)));
        }
        const a = state.age,
          o = [];
        a >= 3 && !hasIll("Asthma") && chance(0.025) && o.push(asthmaEvent);
        const n = state.stats.Health,
          s = 1 + Math.max(0, 50 - n) / 25,
          r = a >= 50 ? Math.min(0.3, 0.006 * (a - 50) + 0.05) : 0,
          i = ills().length < (a >= 50 ? 5 : 3) + (n < 30 ? 2 : 0);
        a >= 6 && i && chance((0.07 + r) * s) && o.push(symptomEvent),
          a >= 1 && i && chance(Math.min(0.6, (0.12 + r) * s)) && o.push(illnessEvent),
          a >= 1 &&
            i &&
            chance((a < 40 ? 0.01 : a < 60 ? 0.02 : 0.04) * (1 + Math.max(0, 50 - n) / 50)) &&
            o.push(seriousIllnessEvent),
          a >= 18 &&
            isSingle() &&
            a - (state.loveAirAt ?? -9) >= 3 &&
            chance(0.05 * looksDraw()) &&
            o.push(() => {
              isSingle() && ((state.loveAirAt = a), loveInTheAir());
            }),
          a >= 18 && isMil() && "Coast Guard" === state.job.c && chance(0.12) && o.push(sharkBait),
          o.length && queueRoll(() => any(o)());
      });
      const SND = {
        age: new Audio("sounds/a16_sndAgeButton.wav"),
        dismiss: new Audio("sounds/a16_sndDismissButton.wav"),
        choice: new Audio("sounds/a16_sndChoiceButton.wav"),
        buzzer: new Audio("sounds/a16_sndSimonIncorrect.wav"),
        ding: new Audio("sounds/a16_sndSimonCorrect.wav"),
        atm: new Audio("freelife/sounds/atm.wav"),
        churchBell: new Audio("sounds/church-bells.wav?v=2"),
        tavern: new Audio("sounds/tavern-chatter.wav?v=2"),
        gunshot: new Audio("sounds/a16_sndGunshot.wav"),
        gunCock: new Audio("sounds/a16_sndGunCock.wav"),
        horseNeigh: new Audio("sounds/a16_sndPetHorse.wav"),
        gallop: new Audio("sounds/gallop.wav?v=2"),
        rockBreak: new Audio("sounds/rock-break.wav"),
        coins: new Audio("sounds/coins-change.mp3"),
        fishReel: new Audio("sounds/fishing-reel.wav"),
        fishSplash: new Audio("sounds/fish-splash.wav"),
        wolfHowl: new Audio("sounds/wolf-howl.wav"),
        birdCall: new Audio("sounds/a16_sndPetBird.wav"),
        axeChop: new Audio("sounds/axe-chop.wav"),
        treeFall: new Audio("sounds/tree-fall.wav"),
        sawStroke: new Audio("sounds/saw-stroke.wav"),
        crowdJeer: new Audio("sounds/crowd-jeer.wav"),
        trapdoor: new Audio("sounds/trapdoor.wav"),
        ropeCreak: new Audio("sounds/rope-creak.wav"),
        fireCrackle: new Audio("sounds/fire-crackle.wav"),
        anvilHammer: new Audio("sounds/anvil-hammer.wav"),
        riot: new Audio("sounds/a16_sndRiot.wav"),
        storeBell: new Audio("sounds/store-bell.mp3"),
      };
      document.addEventListener(
        "click",
        (e) => {
          const t = document.querySelector(".phone").classList.contains("y2018");
          t && e.target.closest("#sList .row:not(.dis)")
            ? old18(e.target.closest("#sList .row").querySelector(".chev") ? "Sublist" : "TableCellButton")
            : e.target.closest(
                '#sList .row:not(.dis):not([data-late]):not([data-k="all"]):not(#ftRow), #jmApply, .ev-btn, .ev-surprise',
              ) && play("choice"),
            e.target.closest(".tab[data-tab]:not(.locked)") && (t && old18("ToolbarButton"), play("toList")),
            t && e.target.closest("a[href], .pet-rand, .ev-surprise") && old18("HyperlinkButton");
        },
        !0,
      ),
        document.addEventListener(
          "pointerdown",
          (e) => {
            e.target.closest(".hr-sel select") &&
              document.querySelector(".phone").classList.contains("y2018") &&
              old18("DropDownMenu");
          },
          !0,
        );
      const old18 = (e) => {
        new Audio(`sounds2018/a16_snd${e}.wav`).play().catch(() => {});
      };
      SND.toList = new Audio("sounds/a16_sndMainScreenToList.wav");
      const OLD_SND = new Set([
          "a16_sndAchievement",
          "a16_sndAgeButton",
          "a16_sndBaby",
          "a16_sndChoiceButton",
          "a16_sndDamageFemale",
          "a16_sndDamageMale",
          "a16_sndDeath",
          "a16_sndDismissButton",
          "a16_sndFeedbackScenarioAppears",
          "a16_sndFeedbackScenarioDismissed",
          "a16_sndMainScreenToList",
          "a16_sndMenuButton",
          "a16_sndScenarioAppears",
        ]),
        SOUND_PACKS = {
          bitlife: {},
          freelife: {
            a16_sndChoiceButton: "freelife/sounds/ui-click.wav",
            a16_sndMainScreenToList: "freelife/sounds/ui-click.wav",
            a16_sndDismissButton: "freelife/sounds/ui-exit.mp3",
            a16_sndMenuButton: "freelife/dry-pop-up-notification-alert.wav",
            a16_sndFeedbackScenarioAppears: "freelife/sounds/dialog-pop.mp3",
            a16_sndScenarioAppears: "freelife/sounds/dialog-pop.mp3",
            a16_sndBaby: "freelife/sounds/baby-cry2.wav",
            a16_sndHookupMale: "freelife/sounds/oh-yeah.wav",
            a16_sndDamageMale: "freelife/sounds/ow.wav",
            a16_sndScream: "freelife/sounds/girl-scream.wav",
            a16_sndBark: "freelife/sounds/dog-bark.wav",
            a16_sndCops: "freelife/sounds/police-siren.wav?v=2",
            a16_sndPetCat: "freelife/sounds/cat-meow.wav",
            a16_sndPetDog: "freelife/sounds/pet-dog.wav",
            a16_sndThunder: "freelife/sounds/thunder.wav",
            a16_sndStopMan: "freelife/kenney/voice-male-hold.ogg",
            "scream-f": "freelife/sounds/girl-scream.wav",
            "scream-m": "freelife/sounds/man-scream.wav",
            "vampire/snd-encounter": "freelife/sounds/monster-growl.wav",
            "vampire/snd-conversion": "freelife/sounds/monster-bite.wav",
            "vampire/snd-bat": "freelife/sounds/bat-chirp.wav",
            a16_SFX_UFM_BettingFightEnds: "freelife/kenney/impact-impactBell_heavy_000.ogg",
            a16_SFX_UFM_ReadyToRumble: "freelife/kenney/fighter-fight.ogg",
            a16_SFX_UFM_BlockedHit: "freelife/kenney/impact-impactSoft_heavy_000.ogg",
            a16_SFX_UFM_BlockedHit_2: "freelife/kenney/impact-impactSoft_heavy_001.ogg",
            a16_SFX_UFM_BlockedHit_3: "freelife/kenney/impact-impactSoft_heavy_002.ogg",
            a16_SFX_UFM_Hit: "freelife/kenney/impact-impactPunch_medium_000.ogg",
            a16_SFX_UFM_Hit_2: "freelife/kenney/impact-impactPunch_medium_001.ogg",
            a16_SFX_UFM_Hit_3: "freelife/kenney/impact-impactPunch_medium_002.ogg",
            a16_SFX_UFM_Hit_4: "freelife/kenney/impact-impactPunch_medium_003.ogg",
            a16_SFX_UFM_HitDouble: "freelife/kenney/impact-impactPunch_heavy_000.ogg",
            a16_SFX_UFM_Knockout: "freelife/kenney/impact-impactPunch_heavy_001.ogg",
            a16_SFX_UFM_Knockout_2: "freelife/kenney/impact-impactPunch_heavy_002.ogg",
            a16_SFX_UFM_Knockout_3: "freelife/kenney/impact-impactPunch_heavy_003.ogg",
            a16_SFX_UFM_PlaceFightBet: "freelife/kenney/casino-chips-stack-1.ogg",
            a16_SFX_UFM_PostKnockoutWallImpact: "freelife/kenney/impact-impactSoft_heavy_003.ogg",
            a16_SFX_UFM_PostKnockoutWallImpact_2: "freelife/kenney/impact-impactPlank_medium_000.ogg",
            a16_sndCasinoCardFlip: "freelife/kenney/casino-card-place-1.ogg",
            a16_sndCasinoCardFlipFast: "freelife/kenney/casino-card-place-2.ogg",
            a16_sndCasinoCardSwap: "freelife/kenney/casino-card-slide-1.ogg",
            a16_sndCasinoDraw: "freelife/kenney/casino-card-shove-1.ogg",
            a16_sndCasinoOpen: "freelife/kenney/casino-chips-handle-1.ogg",
            a16_sndCasinoWin1: "freelife/kenney/jingles-jingles_NES01.ogg",
            a16_sndCasinoWin2: "freelife/kenney/voice-you_win.ogg",
            a16_sndCasinoLose1: "freelife/kenney/digital-lowDown.ogg",
            a16_sndCasinoLose2: "freelife/kenney/voice-you_lose.ogg",
            a16_sndChaChing: "freelife/kenney/rpg-handleCoins.ogg",
            a16_sndLuxuryPurchaseAsset: "freelife/kenney/rpg-handleCoins2.ogg",
            a16_sndPortfolio: "freelife/kenney/casino-chips-handle-2.ogg",
            a16_sndPortfolioUp: "freelife/kenney/digital-powerUp2.ogg",
            a16_sndSuccessfulShakedown: "freelife/kenney/casino-chips-collide-2.ogg",
            a16_sndBankruptcy: "freelife/kenney/digital-phaserDown1.ogg",
            a16_sndClosingBell: "freelife/kenney/impact-impactBell_heavy_001.ogg",
            a16_sndAchievement: "freelife/sounds/achievement.mp3",
            a16_sndAgeButton: "freelife/sounds/age-up.mp3",
            a16_sndBoost: "freelife/kenney/interface-confirmation_001.ogg",
            a16_sndRewardReveal: "freelife/sounds/heirloom-reveal.mp3",
            a16_sndFeedbackScenarioDismissed: "freelife/kenney/interface-drop_001.ogg",
            a16_sndFlashlightOn: "freelife/sounds/flashlight.mp3",
            a16_sndBookPageFlip: "freelife/kenney/rpg-bookFlip1.ogg",
            a16_sndStamp: "freelife/kenney/impact-impactSoft_medium_000.ogg",
            a16_sndFootstep1: "freelife/kenney/impact-footstep_concrete_000.ogg",
            a16_sndFootstep2: "freelife/kenney/impact-footstep_concrete_001.ogg",
            a16_sndAmenityRenovation: "freelife/kenney/impact-impactWood_heavy_000.ogg",
            a16_sndBulldoze: "freelife/kenney/scifi-explosionCrunch_000.ogg",
            a16_sndMineExplosion: "freelife/kenney/scifi-explosionCrunch_001.ogg",
            a16_sndCar: "freelife/sounds/car-horn.wav",
            a16_sndBribeReleaseJailedCartelMember: "freelife/kenney/rpg-doorOpen_1.ogg",
            a16_sndGunCock: "freelife/kenney/rpg-metalLatch.ogg",
            a16_sndJoiningCartelFeedback: "freelife/kenney/jingles-jingles_HIT06.ogg",
            a16_sndDeath: "freelife/kenney/jingles-jingles_SAX07.ogg",
            a16_sndPray: "freelife/kenney/jingles-jingles_STEEL01.ogg",
            a16sfx_Camping_Start: "freelife/kenney/jingles-jingles_PIZZI01.ogg",
            a16_sndGhost: "freelife/kenney/scifi-forceField_000.ogg",
            a16_sndParanormal: "freelife/kenney/scifi-forceField_001.ogg",
            a16_sndCurse: "freelife/kenney/scifi-lowFrequency_explosion_000.ogg",
            a16_sndSimonButton1: "freelife/kenney/digital-pepSound1.ogg",
            a16_sndSimonButton2: "freelife/kenney/digital-pepSound2.ogg",
            a16_sndSimonButton3: "freelife/kenney/digital-pepSound3.ogg",
            a16_sndSimonButton4: "freelife/kenney/digital-pepSound4.ogg",
            a16_sndSimonCorrect: "freelife/kenney/voice-correct.ogg",
            a16_sndSimonIncorrect: "freelife/sounds/buzzer.wav",
            a16_sndSaxophone: "freelife/kenney/jingles-jingles_SAX00.ogg",
            a16_sndHarmonica: "freelife/kenney/jingles-jingles_SAX02.ogg",
            a16_sndTrombone: "freelife/kenney/jingles-jingles_SAX11.ogg",
            a16_sndTuba: "freelife/kenney/jingles-jingles_SAX12.ogg",
            a16_sndSteelDrum: "freelife/kenney/jingles-jingles_STEEL00.ogg",
            a16_sndAccordion: "freelife/kenney/jingles-jingles_PIZZI02.ogg",
            a16_sndBanjo: "freelife/kenney/jingles-jingles_PIZZI05.ogg",
            a16_sndCello: "freelife/kenney/jingles-jingles_PIZZI06.ogg",
            a16_sndGuitarChorus: "freelife/kenney/jingles-jingles_PIZZI07.ogg",
            a16_sndHarp: "freelife/kenney/jingles-jingles_PIZZI08.ogg",
            a16_sndPiano: "freelife/kenney/jingles-jingles_PIZZI09.ogg",
            a16_sndViolin: "freelife/kenney/jingles-jingles_PIZZI10.ogg",
            a16_sndFlute: "freelife/kenney/jingles-jingles_NES06.ogg",
            a16_sndGuitarElectric: "freelife/kenney/jingles-jingles_NES07.ogg",
            a16_sndPanFlute: "freelife/kenney/jingles-jingles_NES08.ogg",
            a16_sndDidgeridoo: "freelife/kenney/scifi-spaceEngineLow_000.ogg",
            a16_sndDrumSet: "freelife/kenney/jingles-jingles_HIT05.ogg",
            a16_sndTrumpet: "freelife/kenney/jingles-jingles_HIT08.ogg",
            a16_sndRoyalTrumpet: "freelife/kenney/jingles-jingles_HIT07.ogg",
            a16_sndBugle: "freelife/kenney/jingles-jingles_HIT01.ogg",
            a16_sndBugleCharge: "freelife/kenney/jingles-jingles_HIT02.ogg",
            a16_sndBugleSuccess: "freelife/kenney/jingles-jingles_HIT03.ogg",
            a16_sndBugleDeath: "freelife/kenney/jingles-jingles_SAX05.ogg",
            "bb-award": "freelife/kenney/jingles-jingles_NES02.ogg",
            "bb-champion": "freelife/kenney/voice-congratulations.ogg",
            "bb-hof": "freelife/kenney/jingles-jingles_STEEL02.ogg",
            "bb-season": "freelife/kenney/jingles-jingles_NES04.ogg",
            SFX_MusicProducer_BangerAward: "freelife/kenney/jingles-jingles_STEEL03.ogg",
            SFX_MusicProducer_ClubTakeover: "freelife/kenney/jingles-jingles_NES05.ogg",
            SFX_MusicProducer_LabelSign: "freelife/kenney/interface-scratch_001.ogg",
            SFX_MusicProducer_MIDIInstrument: "freelife/kenney/digital-threeTone1.ogg",
            SFX_MusicProducer_NewArtist: "freelife/kenney/interface-confirmation_002.ogg",
            SFX_MusicProducer_NewTrack_Collab: "freelife/kenney/interface-confirmation_003.ogg",
            "hack/ComputerAccessFailure": "freelife/kenney/interface-error_001.ogg",
            "hack/ComputerAccessSuccess": "freelife/kenney/interface-confirmation_004.ogg",
            "hack/FirewallBreachFailure": "freelife/kenney/interface-error_002.ogg",
            "hack/FirewallBreachSuccess": "freelife/kenney/digital-powerUp3.ogg",
            "hack/NumberlinkGameLineBroken": "freelife/kenney/interface-glitch_001.ogg",
            "hack/NumberlinkGameLineCompleted": "freelife/kenney/interface-select_001.ogg",
            "hack/NumberlinkGameLineStarted": "freelife/kenney/interface-tick_001.ogg",
            "vampire/snd-contribute": "freelife/kenney/casino-chips-stack-3.ogg",
            "vampire/snd-curse-lifted": "freelife/kenney/digital-powerUp6.ogg",
            "vampire/snd-curse": "freelife/kenney/scifi-lowFrequency_explosion_001.ogg",
            "vampire/snd-hunt": "freelife/kenney/scifi-forceField_002.ogg",
            "vampire/snd-hunter": "freelife/kenney/rpg-drawKnife1.ogg",
            "vampire/snd-hypnotize": "freelife/kenney/digital-phaserUp1.ogg",
            "vampire/snd-kill": "freelife/kenney/rpg-knifeSlice.ogg",
            "vampire/snd-property": "freelife/kenney/rpg-creak1.ogg",
          },
        },
        soundPack = () => {
          const e = window.SETTINGS_UI && SETTINGS_UI.settings.soundPack;
          return SOUND_PACKS[
            "bitlife" === e || "freelife" === e
              ? e
              : document.querySelector(".phone").classList.contains("flui")
                ? "freelife"
                : "bitlife"
          ];
        };
      {
        const N = /Bit[Ll]ife(\+\+)?/g,
          j = /BitLife (Mode|Loading Theme)|classic (red )?BitLife|inspired by BitLife/i,
          D = () => document.querySelector(".phone")?.classList.contains("flui"),
          _ = (e) => {
            if (3 === e.nodeType) {
              const t = e.nodeValue;
              return (
                t && N.test(t) && !j.test(t) && ((N.lastIndex = 0), (e.nodeValue = t.replace(N, "FreeLife"))),
                void (N.lastIndex = 0)
              );
            }
            if (1 !== e.nodeType || /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(e.nodeName)) return;
            const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
            let a;
            for (; (a = t.nextNode()); ) _(a);
          };
        new MutationObserver((e) => {
          if (D()) for (const t of e) "characterData" === t.type ? _(t.target) : t.addedNodes.forEach(_);
        }).observe(document.body, { childList: !0, subtree: !0, characterData: !0 });
        const F = () => {
          D() &&
            (_(document.body),
            /BitLife/.test(document.title) && (document.title = document.title.replace(N, "FreeLife")));
        };
        setTimeout(F, 0),
          new MutationObserver(F).observe(document.querySelector(".phone"), {
            attributes: !0,
            attributeFilter: ["class"],
          });
      }
      const _mediaPlay = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        const e = document.querySelector(".phone"),
          t = (this.getAttribute("src") || this.src || "").match(
            /(?:^|\/)(sounds|vampire|hack)\/([\w-]+)\.(?:wav|mp3)(?:\?|$)/,
          ),
          a =
            t &&
            e &&
            !e.classList.contains("y2018") &&
            soundPack()["sounds" === t[1] ? t[2] : `${t[1]}/${t[2]}`];
        if (a) {
          const e = this.src;
          (this.src = a),
            this.addEventListener(
              "error",
              () => {
                (this.src = e), _mediaPlay.call(this).catch(() => {});
              },
              { once: !0 },
            );
        }
        return _mediaPlay.apply(this, arguments);
      };
      const sndSrc = (e) => {
          const t = e.src.match(/sounds\/(a16_snd\w+)\.wav$/);
          return document.querySelector(".phone").classList.contains("y2018")
            ? t && OLD_SND.has(t[1])
              ? `sounds2018/${t[1]}.wav`
              : e.src
            : (t && soundPack()[t[1]]) || e.src;
        },
        AC = window.AudioContext ? new AudioContext() : null,
        clips = new Map(),
        clip = (e) => (
          clips.has(e) ||
            clips.set(
              e,
              fetch(e)
                .then((e) => {
                  if (!e.ok) throw e.status;
                  return e.arrayBuffer();
                })
                .then((e) => AC.decodeAudioData(e)),
            ),
          clips.get(e)
        ),
        htmlPlay = (e, t) => {
          const a = new Audio(e);
          t &&
            (a.onerror = () => {
              new Audio(t).play().catch(() => {});
            }),
            a.play().catch(() => {});
        },
        play = (e) => {
          const t = sndSrc(SND[e]),
            a = t !== SND[e].src && /^freelife\//.test(t) ? SND[e].src : null;
          if (!AC) return htmlPlay(t, a);
          (window.SETTINGS_UI && !window.SETTINGS_UI.settings.sound) ||
            ("suspended" === AC.state && AC.resume(),
            clip(t).then(
              (e) => {
                const t = AC.createBufferSource();
                (t.buffer = e), t.connect(AC.destination), t.start();
              },
              () => htmlPlay(a || t),
            ));
        },
        warmSounds = () => {
          for (const e in SND) clip(sndSrc(SND[e])).catch(() => {});
        };
      AC &&
        (document.addEventListener(
          "pointerdown",
          () => {
            "suspended" === AC.state && AC.resume(), warmSounds();
          },
          !0,
        ),
        setTimeout(warmSounds, 1500)),
        document.getElementById("ageBtn").addEventListener("click", () => play("age")),
        document.addEventListener(
          "click",
          (e) => {
            const t = e.target.closest("#sBack");
            if (t && t.innerHTML.includes("M2 2l12 12"))
              return play(document.querySelector(".phone").classList.contains("flui") ? "dismiss" : "menu");
            (t || e.target.closest("#jmX, #propX, #toast button")) && play("dismiss");
          },
          !0,
        ),
        (SND.statUp = new Audio("freelife/sounds/stat-up.mp3")),
        (SND.statDown = new Audio("freelife/sounds/stat-down.mp3"));
      {
        let W = null,
          q = null,
          z = 0;
        new MutationObserver(() => {
          const e = document.querySelector(".phone"),
            t = { ...state.stats },
            a = state.age,
            o = W,
            n = a === q;
          if (
            ((W = t),
            (q = a),
            !o ||
              !n ||
              state.dead ||
              !e.classList.contains("flui") ||
              e.classList.contains("y2018") ||
              performance.now() < z)
          )
            return;
          let s = 0,
            r = 0,
            i = 0;
          for (const e in t) {
            const a = (t[e] ?? 0) - (o[e] ?? 0);
            a && i++, a > 0 ? (s += a) : (r -= a);
          }
          (!s && !r) ||
            (i === Object.keys(t).length && s + r > 60) ||
            ((z = performance.now() + 300), play(s >= r ? "statUp" : "statDown"));
        }).observe(stats, { childList: !0 });
      }
      (SND.menu = new Audio("sounds/a16_sndMenuButton.wav")),
        (SND.tattoo = new Audio("sounds/tattoo-buzz.wav")),
        (SND.feedbackIn = new Audio("sounds/a16_sndFeedbackScenarioAppears.wav")),
        (SND.feedbackOut = new Audio("sounds/a16_sndFeedbackScenarioDismissed.wav")),
        (SND.scenario = new Audio("sounds/a16_sndScenarioAppears.wav"));
      for (const U of document.querySelectorAll(".ev-wrap, .jm-wrap")) {
        const V = U.firstElementChild,
          K = U.classList.add.bind(U.classList);
        U.classList.add = (...e) => {
          K(...e),
            e.includes("open") && ((V.style.animation = "none"), V.offsetWidth, (V.style.animation = ""));
        };
      }
      new MutationObserver(() => {
        const e = evWrap.classList.contains("open");
        e && !evWrap.dataset.wasOpen && ev.querySelector(".ev-surprise, #eduOk") && play("scenario"),
          (evWrap.dataset.wasOpen = e ? "1" : "");
      }).observe(evWrap, { attributes: !0, attributeFilter: ["class"] }),
        (SND.achievement = new Audio("sounds/a16_sndAchievement.wav")),
        (SND.damage = new Audio("sounds/a16_sndDamageMale.wav"));
      const ACH_KEY = "bitlifepp-ach",
        achAll = new Set(
          (() => {
            try {
              return JSON.parse(localStorage.getItem(ACH_KEY) || "[]");
            } catch {
              return [];
            }
          })(),
        ),
        saveAchAll = () => {
          try {
            localStorage.setItem(ACH_KEY, JSON.stringify([...achAll]));
          } catch {}
        },
        achSeen = new Set(achAll),
        FIGHT_RX =
          /\bI (got into an? (bar |fist |club |street )?fight|picked a fight|fought|tried to fight|started an? (bar |fist )?fight|knocked out|attacked|punched|beat up|beat [^.!?]{1,40}? (up|in a fight)|won (a|the) fight|lost (a|the) fight)\b|\b(beat me up|punched me)\b/,
        NOT_FIGHT_RX =
          /food fight|snowball|pillow|tickle|water (balloon )?fight|family fight|thanksgiving|break up|broke up|walked away|stop fight|stay(ed)? out|watched|reported|told|lied|cleaned|hid |ducked|who attacked/i,
        isFight = (e) => e.split(/(?<=[.!?])\s+/).some((e) => FIGHT_RX.test(e) && !NOT_FIGHT_RX.test(e)),
        LOG_EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}]/gu,
        stripLogEmoji = (e) => {
          const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT),
            a = (e) => {
              LOG_EMOJI.test(e.nodeValue) &&
                ((LOG_EMOJI.lastIndex = 0),
                (e.nodeValue = e.nodeValue
                  .replace(LOG_EMOJI, "")
                  .replace(/ {2,}/g, " ")
                  .replace(/ ([.,!?])/g, "$1"))),
                (LOG_EMOJI.lastIndex = 0);
            };
          if (3 === e.nodeType) return a(e);
          for (let e = t.nextNode(); e; e = t.nextNode()) a(e);
        };
      new MutationObserver((e) => {
        for (const t of e) t.addedNodes.forEach(stripLogEmoji);
      }).observe(document.getElementById("log"), { childList: !0, subtree: !0 }),
        new MutationObserver((e) => {
          if (!achSeen.has("Fight Club"))
            for (const t of e)
              for (const e of t.addedNodes) {
                const t = 1 === e.nodeType ? e.textContent : "";
                if (t && isFight(t))
                  return void setTimeout(() => {
                    achSeen.has("Fight Club") || showAchievement("Fight Club", "Get into a fight");
                  }, 600);
              }
        }).observe(document.getElementById("log"), { childList: !0, subtree: !0 });
      const achQueue = [];
      function showAchievement(e, t) {
        achSeen.add(e),
          achAll.has(e) ||
            (achAll.add(e),
            saveAchAll(),
            achQueue.push([e, t]),
            1 === achQueue.length && showAchievementNow(e, t));
      }
      function achievementDone() {
        achQueue.shift(), achQueue.length && setTimeout(() => showAchievementNow(...achQueue[0]), 150);
      }
      function showAchievementNow(e, t) {
        const a = document.getElementById("ach");
        (achTitle.textContent = e),
          (achText.textContent = t),
          a.classList.remove("leave", "show"),
          a.offsetWidth,
          a.classList.add("show"),
          (SND.achievement.currentTime = 0),
          SND.achievement.play().catch(() =>
            document.addEventListener(
              "pointerdown",
              () => {
                a.classList.contains("show") && !a.classList.contains("leave") && play("achievement");
              },
              { once: !0 },
            ),
          ),
          clearTimeout(showAchievement.t),
          (showAchievement.t = setTimeout(() => {
            a.classList.add("leave"), setTimeout(achievementDone, 650);
          }, 5e3));
      }
      (() => {
        let e = !0;
        try {
          (e = !!localStorage.getItem("bitlifepp-welcomed")), localStorage.setItem("bitlifepp-welcomed", "1");
        } catch {}
        e ||
          setTimeout(
            () => showAchievement("BITLIFE RECODED", "BitLife Recoded, enjoy and expect bugs!"),
            400,
          );
      })(),
        document.getElementById("ageBtn").addEventListener("click", () => {
          state.dead ||
            achSeen.has("We All Started Somewhere") ||
            setTimeout(() => showAchievement("We All Started Somewhere", "Age up for the first time"), 500);
        }),
        (SND.flashlight = new Audio("sounds/a16_sndFlashlightOn.wav")),
        (SND.reveal = new Audio("sounds/a16_sndRewardReveal.wav")),
        (SND.pray = new Audio("sounds/a16_sndPray.wav")),
        prayBtn.addEventListener("click", () => play("pray")),
        (state.heirlooms = []);
      const hlWrap = document.getElementById("hlWrap"),
        hl = document.getElementById("hl"),
        heirBtn = document.getElementById("heirBtn"),
        HL_RARITY = ["common", "rare", "very rare", "super rare"],
        HL_BADGE = [null, "ui-tableHeirloomRare", "ui-tableHeirloomVeryRare", "ui-tableHeirloomSuperRare"],
        hlImg = (e) => `heirloom/${e.replace(/[^A-Za-z0-9-]/g, "").toLowerCase()}.png`,
        hlMoney = (e) =>
          cur() +
          (e >= 1e9
            ? +(e / 1e9).toFixed(1) + "b"
            : e >= 1e6
              ? +(e / 1e6).toFixed(1) + "M"
              : e >= 1e3
                ? +(e / 1e3).toFixed(1) + "k"
                : e);
      function pickHeirloom() {
        const e = 100 * Math.random(),
          t = e < 72 ? 0 : e < 94 ? 1 : e < 99 ? 2 : 3,
          a = HEIRLOOMS.filter((e) => e[2] === t),
          o = a.map((e) => 1 / Math.sqrt(e[3]));
        let n = Math.random() * o.reduce((e, t) => e + t, 0),
          s = 0;
        for (; (n -= o[s]) > 0 && s < a.length - 1; ) s++;
        const [r, i, l, c] = a[s];
        return { name: r, sprite: i, rarity: l, value: c };
      }
      const HL_HEAD =
          '<div class="jm-x" id="hlX"><svg viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="#e2401f" stroke-width="3" stroke-linecap="round"/></svg></div>\n    <div class="jm-tag">Heirloom</div>\n    <h4 style="justify-content:center"><img src="heirloom/ui-emoji-flashlight.png"><span>Find Heirloom</span></h4>',
        HL_SPOTS = [
          [55, 17.6],
          [64, 17.6],
          [60, 24.7],
          [71, 24.7],
          [88, 39.5],
          [88, 48],
          [88, 56.5],
          [37, 38.8],
          [51, 38.8],
          [19, 50.5],
          [9, 54.3],
          [10, 73.5],
          [44, 62],
          [70, 80],
          [87, 92],
          [30, 91],
          [58, 94],
          [68, 56],
          [36, 57],
          [24, 64],
        ];
      function openHeirloom(e) {
        if (state.dead) return;
        const t = pickHeirloom(),
          [a, o] = any(HL_SPOTS);
        (hl.innerHTML =
          HL_HEAD +
          `<div class="lead">Drag the flashlight around the attic to discover your next heirloom!</div>\n      <div class="hl-scene off" id="hlScene">\n        <img class="bg" src="heirloom/ui-heirloomScene.png">\n        <img class="item" src="${hlImg(t.sprite)}" style="left:${a}%;top:${o}%">\n        <img class="ring" src="heirloom/ui-heirloomRing.png" style="left:50%;top:50%">\n        <div class="dark"></div>\n        <img class="frame" src="heirloom/ui-heirloomFrame.png">      </div>\n      <div class="hl-tray"><img class="hl-torch" id="hlTorch" src="heirloom/ui-heirloomFlashlight.png" draggable="false"></div>`),
          hlWrap.classList.add("open"),
          play("scenario");
        const n = hl.querySelector("#hlScene"),
          s = n.querySelector(".ring");
        let r = !1,
          i = 0,
          l = null;
        const c = (e) => {
            if (r || n.classList.contains("off")) return;
            l = { clientX: e.clientX, clientY: e.clientY };
            const t = n.getBoundingClientRect(),
              c = Math.max(0, Math.min(100, ((e.clientX - t.left) / t.width) * 100)),
              u = Math.max(0, Math.min(100, ((e.clientY - t.top) / t.height) * 100));
            (s.style.left = c + "%"),
              (s.style.top = u + "%"),
              Math.hypot(c - a, u - (o - 6)) < 6 ? i || (i = setTimeout(d, 500)) : (clearTimeout(i), (i = 0));
          },
          d = () => {
            (r = !0),
              (h = !1),
              clearTimeout(i),
              n.classList.add("found"),
              chaChing(),
              l && (u.classList.remove("gone"), u.classList.add("drag", "fall"), p(l)),
              setTimeout(
                () => hlWrap.classList.contains("open") && hl.contains(n) && showHeirloom(t, e, n),
                1650,
              );
          },
          u = hl.querySelector("#hlTorch");
        let h = !1;
        const p = (e) => {
            (u.style.left = e.clientX + "px"), (u.style.top = e.clientY + "px");
          },
          m = (e) => {
            r ||
              (n.classList.contains("off")
                ? (p(e),
                  ((e) => {
                    const t = n.getBoundingClientRect();
                    return (
                      e.clientX >= t.left &&
                      e.clientX <= t.right &&
                      e.clientY >= t.top &&
                      e.clientY <= t.bottom
                    );
                  })(e) && (n.classList.remove("off"), u.classList.add("gone"), play("flashlight"), c(e)))
                : ((e) => e.clientY > n.getBoundingClientRect().bottom)(e)
                  ? (n.classList.add("off"),
                    clearTimeout(i),
                    (i = 0),
                    u.classList.remove("gone"),
                    u.classList.add("drag"),
                    play("flashlight"),
                    p(e))
                  : c(e));
          },
          f = (e, t) => {
            t.preventDefault(), (h = !0), e.setPointerCapture(t.pointerId);
          },
          g = () => {
            h && ((h = !1), u.classList.remove("drag"), (u.style.left = u.style.top = ""));
          },
          y = u.parentElement;
        y.addEventListener("pointerdown", (e) => {
          !r && n.classList.contains("off") && (f(y, e), u.classList.add("drag"), p(e));
        }),
          n.addEventListener("pointerdown", (e) => {
            r || n.classList.contains("off") || (f(n, e), c(e));
          }),
          [y, n].forEach((e) => {
            e.addEventListener("pointermove", (e) => (h ? m(e) : c(e))),
              e.addEventListener("pointerup", g),
              e.addEventListener("pointercancel", g);
          }),
          (hl.querySelector("#hlX").onclick = closeHeirloom);
      }
      function heirHistory(e) {
        const t = state.birthYear + state.age;
        if (
          ((e.found ??= t),
          null == e.since &&
            (e.since =
              e.found -
              rint(
                ...[
                  [5, 60],
                  [20, 110],
                  [40, 160],
                  [80, 300],
                ][e.rarity],
              )),
          !e.from)
        ) {
          const t = e.found - e.since,
            a = chance(0.5);
          e.from =
            t <= 40
              ? a
                ? "grandmother"
                : "grandfather"
              : t <= 70
                ? a
                  ? "great-grandmother"
                  : "great-grandfather"
                : t <= 100
                  ? a
                    ? "great-great-grandmother"
                    : "great-great-grandfather"
                  : "distant ancestors";
        }
        return e;
      }
      const hlName = (e) => e.name[0].toUpperCase() + e.name.slice(1),
        hlRound = (e) => (e >= 100 ? 10 * Math.round(e / 10) : Math.max(1, Math.round(e)));
      function hlSold(e, t, a) {
        const o = state.heirlooms.indexOf(e);
        o >= 0 && state.heirlooms.splice(o, 1),
          (state.money += t),
          renderStats(),
          chaChing(),
          screen.classList.remove("open"),
          say(`I sold my family's ${e.name} ${a} for ${usd(t)}.`),
          notice("Done deal", `You sold your family's ${e.name} ${a} for ${usd(t)}.`);
      }
      const hlTitle = (e) => e.name.replace(/(^|\s)(\S)/g, (e, t, a) => t + a.toUpperCase()),
        hlRemove = (e) => {
          const t = state.heirlooms.indexOf(e);
          t >= 0 && state.heirlooms.splice(t, 1);
        };
      function openHeirloomScreen(e) {
        heirHistory(e),
          (sTitle.textContent = "HEIRLOOM"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openAssets);
        const t = (e, t, a, o) =>
          `<div class="row" data-ha="${o}"><img src="${e}"><div class="t"><b>${t}</b><span>${a}</span></div>${DOTS}</div>`;
        (sList.innerHTML =
          `<div class="row" data-ha="view"><img src="${hlImg(e.sprite)}"><div class="t"><b>${hlTitle(e)}</b><span>View your heirloom</span></div>${DOTS}</div><div class="sec">Activities</div>` +
          t("cars/ui-sign-litter.png", "Discard", "Get rid of it", "discard") +
          t("stat-emoji/face-halo.png", "Donate", "Donate it to charity", "donate") +
          t("job-emoji/juggler.png", "Play", "Play with it", "play") +
          t("cars/ui-hand-waving.png", "Sell", "Sell it", "sell")),
          (sList.scrollTop = 0);
        const a = (e, t, a) => {
          a && say(a), screen.classList.remove("open"), renderStats(), notice(e, t);
        };
        sList.querySelectorAll("[data-ha]").forEach(
          (t) =>
            (t.onclick = () => {
              const o = t.dataset.ha;
              return (
                play("choice"),
                "view" === o
                  ? heirloomCard(e)
                  : "sell" === o
                    ? sellHeirloomCard(e)
                    : "discard" === o
                      ? (hlRemove(e),
                        a(
                          "Discarded",
                          `You threw out your family's ${e.name}. Your ${e.from} would be heartbroken.`,
                          `I threw out my family's ${e.name}.`,
                        ))
                      : "donate" === o
                        ? (hlRemove(e),
                          (state.stats.Happiness = clamp(state.stats.Happiness + rint(3, 8))),
                          a(
                            "Donated",
                            `You donated your family's ${e.name} to charity. It was worth about ${usd(e.value)}.`,
                            `I donated my family's ${e.name} to charity.`,
                          ))
                        : "play" === o
                          ? e.played === state.age
                            ? a("Play", `You already played with your ${e.name} this year.`)
                            : ((e.played = state.age),
                              (state.stats.Happiness = clamp(state.stats.Happiness + rint(2, 6))),
                              a(
                                "Play",
                                `You played with your family's ${e.name}. ${pickR(["You had a great time.", "It brought back old family memories.", "You wondered who else in the family played with it.", "It was more fun than you expected."])}`,
                                `I played with my family's ${e.name}.`,
                              ))
                          : void 0
              );
            }),
        ),
          screen.classList.add("open");
      }
      function heirloomCard(e) {
        heirHistory(e);
        const t = state.birthYear + state.age - e.since,
          a = HL_RARITY[e.rarity];
        jCard({
          tag: "Heirloom",
          iconSrc: hlImg(e.sprite),
          title: hlTitle(e),
          close: !0,
          lead: `This ${a} heirloom has been in your family for ${t} year${1 === t ? "" : "s"}. It was passed down from your ${e.from}, and you found it in the attic in ${e.found}.`,
          rows: [
            ["In the Family Since", e.since],
            ["Years in the Family", t],
            ["Rarity", a[0].toUpperCase() + a.slice(1)],
            ["Estimated Value", usd(e.value)],
          ],
        });
      }
      function sellHeirloomCard(e) {
        jCard({
          tag: "Heirloom",
          iconSrc: hlImg(e.sprite),
          title: hlTitle(e),
          close: !0,
          lead: `Try to sell your family's ${e.name} today!`,
          rows: [
            ["In the Family Since", e.since],
            ["Estimated Value", usd(e.value)],
          ],
          choices: [
            [
              "Sell it to a pawn shop",
              () => hlSold(e, hlRound(e.value * (0.3 + 0.3 * Math.random())), "to a pawn shop"),
            ],
            ["Put it up for auction", () => setTimeout(() => auctionHeirloom(e), 50)],
          ],
        });
      }
      function auctionHeirloom(e) {
        const t = [...new Set([0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.5].map((t) => hlRound(e.value * t)))],
          a = t[Math.min(3, t.length - 1)];
        (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div>\n      <div class="jm-tag" style="margin-top:12px">Heirloom</div>\n      <h4><img src="${hlImg(e.sprite)}" alt=""><span>${hlName(e)}</span></h4>\n      <div class="lead">Put your family's ${e.name} up for auction!</div>\n      <table class="jc"><tbody><tr><td><b>In the Family Since:</b> ${e.since}</td></tr><tr><td><b>Estimated Value:</b> ${usd(e.value)}</td></tr></tbody></table>\n      <label class="hr-lab">Pick your starting price:</label>\n      <div class="hr-sel"><select id="hlList">${t.map((e) => `<option value="${e}"${e === a ? " selected" : ""}>${usd(e)}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="hlGo">Auction it off</button></div>`),
          (ev.style.overflow = "visible");
        const o = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = o),
          (document.getElementById("hlGo").onclick = () => {
            const t = +document.getElementById("hlList").value,
              a = t / e.value,
              n = pickR([
                "an antiques dealer",
                "a wealthy collector",
                "a museum curator",
                "a TV antiques appraiser",
                "a history buff",
                "a celebrity memorabilia hunter",
              ]);
            if (
              (o(),
              screen.classList.remove("open"),
              say(`I put my family's ${e.name} up for auction at ${usd(t)}.`),
              !chance(Math.max(0.08, Math.min(0.95, 1.45 - a))))
            )
              return notice(
                "No bids",
                `Nobody bid on your ${e.name}${a > 1.15 ? `. ${usd(t)} might be too much` : ""}.`,
              );
            if (chance(0.3 / Math.max(0.6, a))) return hlSold(e, t, `at auction to ${n}`);
            const s = hlRound(t * (0.7 + 0.2 * Math.random()));
            jCard({
              tag: "Heirloom",
              iconSrc: hlImg(e.sprite),
              title: "Offer",
              surprise: !0,
              lead: `${n[0].toUpperCase() + n.slice(1)} has offered you ${usd(s)} for your ${e.name}.<br><br>What will you do?`,
              rows: [
                ["Offer", usd(s)],
                ["Starting Price", usd(t)],
              ],
              choices: [
                ["Take the offer", () => hlSold(e, s, `at auction to ${n}`)],
                [
                  `Insist on ${usd(t)}`,
                  () =>
                    chance(Math.max(0.15, 0.65 - 1.2 * (a - 1)))
                      ? hlSold(e, t, `at auction to ${n}`)
                      : (say(`I insisted on ${usd(t)} for my ${e.name}, but the buyer backed out.`),
                        notice("No deal", `You insisted on ${usd(t)}, but ${n} backed out.`)),
                ],
                ["Never mind, keep it in the family", () => say(`I decided to keep my family's ${e.name}.`)],
              ],
            });
          }),
          evWrap.classList.add("open");
      }
      function showHeirloom(e, t, a) {
        state.heirlooms.push(heirHistory(e));
        const o = /^[aeiou]/i.test(e.name) ? "an" : "a";
        log.lastElementChild.insertAdjacentHTML(
          "beforeend",
          `<p>I found ${e.name[0] === e.name[0].toUpperCase() ? "the " + e.name : o + " " + e.name} in the attic!</p>`,
        ),
          (log.scrollTop = log.scrollHeight);
        const n = a && a.querySelector(".item").getBoundingClientRect();
        if (
          ((hl.innerHTML =
            HL_HEAD +
            `<div class="lead">Drag the flashlight around the attic to discover your next heirloom!</div>\n      <div class="hl-stage"><div class="hl-res">\n        <div class="panel"><div class="txt"><b>${e.name[0].toUpperCase() + e.name.slice(1)}</b>\n          <p>The average value for this ${HL_RARITY[e.rarity]} item is ${hlMoney(e.value)}.</p></div></div>\n        <img class="burst" src="heirloom/ui-heirloomResultsBurst.png">\n        <img class="item" src="${hlImg(e.sprite)}">\n        ${HL_BADGE[e.rarity] ? `<img class="badge grow" src="heirloom/${HL_BADGE[e.rarity]}.png">` : ""}\n      </div>\n      <div class="hl-btnrow"><button class="jm-apply hl-more" id="hlMore"><img src="heirloom/ui-video.png"><span>Get another heirloom now!</span></button></div></div>`),
          a)
        ) {
          hl.querySelector(".hl-stage").append(a),
            a.classList.add("shrink"),
            a.querySelector(".bg").addEventListener("animationend", () => a.remove(), { once: !0 });
          const e = hl.querySelector(".hl-res .item"),
            t = e.getBoundingClientRect(),
            o = n.left + n.width / 2 - (t.left + t.width / 2),
            s = n.top + n.height / 2 - (t.top + t.height / 2);
          (e.style.transform = `translate(calc(-50% + ${o}px), calc(-50% + ${s}px)) scale(${n.width / t.width})`),
            e.offsetWidth,
            e.classList.add("fly"),
            (e.style.transform = ""),
            setTimeout(() => play("reveal"), 290);
        }
        (hl.querySelector("#hlX").onclick = closeHeirloom),
          (hl.querySelector("#hlMore").onclick = () => {
            play("choice"), openHeirloom(!0);
          });
      }
      const MODS_KEY = "bitlifepp-mods",
        GITHUB_URL = "https://github.com/",
        mods = Object.assign(
          {
            keepHeirloom: !1,
            expandedJobs: !0,
            modHair: !1,
            hairPack: !0,
            gangTats: !0,
            pardinosTats: !0,
            bloodelTats: !0,
            modSkin: !1,
            allAccessories: !1,
            extFamily: !0,
            familyTree: !0,
            lateAncestors: !0,
            famousLife: !0,
            birthTraits: !0,
            allThemes: !1,
            painting: !1,
            showYear: !1,
            showMoney: !0,
            unlimitedGive: !1,
            exoticMarket: !1,
            infiniteLovers: !1,
            crimeArson: !1,
            crimeKidnap: !1,
            crimeVandal: !1,
            crimeDrugs: !1,
            infiniteGTA: !1,
            militaryExpanded: !0,
            battleScars: !0,
            warReunion: !0,
            showMedals: !0,
            alwaysWinCourt: !1,
            neverCaught: !1,
            accurateCars: !1,
            extendedCars: !1,
            goldenNeko: !1,
            noMentalHealth: !1,
            modLoader: !0,
          },
          (() => {
            try {
              return JSON.parse(localStorage.getItem(MODS_KEY)) || {};
            } catch {
              return {};
            }
          })(),
        );
      btShow && (mods.birthTraits = !0);
      try {
        localStorage.getItem("bitlifepp-expjobs-default") ||
          ((mods.expandedJobs = !0),
          localStorage.setItem("bitlifepp-expjobs-default", "1"),
          localStorage.setItem(MODS_KEY, JSON.stringify(mods)));
      } catch {}
      if (PICK && Array.isArray(PICK.lookMods)) for (const X of PICK.lookMods) X in mods && (mods[X] = !0);
      const lockMods = () => {
        window.BL_MODS?.reapply?.();
      };
      lockMods(), (btShow = !!mods.birthTraits);
      if (mods.modLoader && !window.__modLoaderInjected) {
        window.__modLoaderInjected = !0;
        const _ml = document.createElement("script");
        (_ml.src = "modloader.js?v=28"), document.body.appendChild(_ml);
      }
      const saveMods = () => {
        try {
          localStorage.setItem(MODS_KEY, JSON.stringify(mods));
        } catch {}
        document.querySelector(".phone").classList.toggle("show-year", !!mods.showYear);
      };
      try {
        JSON.parse(localStorage.getItem("bitlifepp-settings") || "{}").bitlifeMode ||
          localStorage.getItem("bitlifepp-showyear-default") ||
          ((mods.showYear = !0), localStorage.setItem("bitlifepp-showyear-default", "1"), saveMods());
      } catch {}
      document.querySelector(".phone").classList.toggle("show-year", !!mods.showYear),
        (window.MOD_FLAGS = {
          get: (e) => !!mods[e],
          set(e, t) {
            for (const a of e)
              (mods[a] = !!t),
                t ||
                  "modHair" !== a ||
                  Object.assign(state.mod, { style: null, xHair: null, effect: "none", color: null });
            if (e.includes("allThemes"))
              try {
                applyTheme(liveTheme());
              } catch {}
            try {
              renderAvatar();
            } catch {}
          },
        });
      const HL_COOKIE = "bitlifepp_heirloom_next",
        HL_COOLDOWN = 864e5,
        heirNext = () =>
          +((document.cookie.match(new RegExp("(?:^|; )" + HL_COOKIE + "=(\\d+)")) || [])[1] || 0);
      function heirReady() {
        return mods.keepHeirloom || Date.now() >= heirNext();
      }
      function syncHeirBtn() {
        state.prayOffer || heirBtn.classList.toggle("hide", !heirReady());
      }
      function closeHeirloom() {
        if ((play("dismiss"), hlWrap.classList.remove("open"), !mods.keepHeirloom)) {
          const e = Date.now() + HL_COOLDOWN;
          (document.cookie = `${HL_COOKIE}=${e}; expires=${new Date(e).toUTCString()}; path=/; SameSite=Lax`),
            heirBtn.classList.add("hide");
        }
      }
