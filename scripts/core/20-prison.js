      function goToPrison(e) {
        (state.prison = e),
          (e.inmates = null),
          (state.fugitive = null),
          e.recap || infamyFromConviction(e.crime),
          (state.felony ||= { crime: e.crime, age: state.age }),
          state.job &&
            (say(`I lost my job as ${/^[aeiou]/i.test(state.job.t) ? "an" : "a"} ${state.job.t}.`),
            (state.job = null)),
          state.partJob &&
            (say(
              `I lost my part-time job as ${/^[aeiou]/i.test(state.partJob.t) ? "an" : "a"} ${state.partJob.t}.`,
            ),
            (state.partJob = null)),
          state.school &&
            ((e.prevSchool = { type: state.school.type, grades: state.school.grades }),
            (state.school = null)),
          say(
            `They sent me to ${e.name}, a ${e.sec.toLowerCase()} security ${e.juv ? "facility" : "prison"}.`,
          ),
          phoneEl.classList.contains("flui") &&
            setTimeout(() => new Audio("freelife/sounds/jail-bars.wav").play().catch(() => {}), 150),
          jailUI();
      }
      function jailUI() {
        phoneEl.classList.toggle("jailed", !!state.prison), updateDockTab(), renderAvatar(), renderStats();
      }
      function release(e, t = "Released") {
        const a = state.prison;
        a && (state.prisonYears = (state.prisonYears || 0) + (a.served || 0)),
          a &&
            /Escap/i.test(t) &&
            (state.fugitive = {
              crime: a.crime.replace(/ and escaping prison$/i, ""),
              left: Math.max(1, a.years - a.served),
              death: a.death,
              from: a.name,
            }),
          (state.prison = null),
          say(e);
        let o = "";
        if (state.age < 18 && !state.school && !state.droppedOut && levelFor(state.age)) {
          const e = newSchool(a && a.prevSchool ? a.prevSchool.type : null);
          e &&
            ((state.school = e),
            a && a.prevSchool && (e.grades = clamp(a.prevSchool.grades - rint(3, 10))),
            say(`I went back to school at ${e.name}.`),
            (o = `<br><br>You're back in school at ${e.name}.`));
        }
        jailUI(), screen.classList.remove("open"), notice(t, toYou(e) + o);
      }
      document.getElementById("ageBtn").addEventListener("click", () =>
        setTimeout(() => {
          const e = state.infamy,
            t = state.art;
          if (state.dead || !e || !mods.infamousKillers || !t.fameOn) return;
          state.age >= e.hold && (e.level = Math.max(e.floor, e.level - rint(2, 5)));
          const a = t.fame - (e.shown ?? t.fame);
          a > 6 && (e.extra = (e.extra || 0) + a),
            (t.fame = clamp(e.level + (e.extra || 0))),
            (e.shown = t.fame),
            renderStats();
        }, 60),
      );
      const PRISON_JOBS = [
          ["Boiler Room Maintenance", "j-wrench", 4],
          ["Commissary Stocker", "j-can", 3],
          ["Highway Sign Maker", "j-sign", 3],
          ["License Plate Maker", "j-car", 3],
          ["Line Server", "j-plate", 3],
          ["Military Shoe Maker", "j-boot", 3],
          ["Military Uniform Maker", "j-guard", 3],
          ["Plumber", "j-toilet", 4],
          ["Sanitation Worker", "j-trash", 3],
          ["Tutor", "j-tutor", 4],
        ],
        GANGS = [
          [
            "Bitizen Mafia",
            "gang-1mf",
            "An elite gang",
            92,
            "You must be extremely well-respected to join this gang.",
          ],
          [
            "Killbillies",
            "gang-3m",
            "A violent gang",
            85,
            "You must have a proven track record of violence to join this gang.",
            () => state.prison.fights >= 2,
          ],
          [
            "Hecks Angels",
            "gang-9m",
            "A feared gang",
            78,
            "You must be well-respected and feared to join this gang.",
          ],
          [
            "Cash Money Wreckers",
            "gang-7mf",
            "A wealthy gang",
            68,
            "You must be rich to join this gang.",
            () => state.money >= 1e5,
          ],
          ["Blue Ball Bulls", "gang-8m", "A vicious gang", 60, "You must be vicious to join this gang."],
          [
            "Illegal Jailiens",
            "gang-6m",
            "A foreigner gang",
            50,
            "You must be from another country to join this gang.",
          ],
          [
            "Brain Brothas",
            "gang-5m",
            "An intelligent gang",
            42,
            "You must be smart to join this gang.",
            () => state.stats.Smarts >= 70,
          ],
          [
            "Beefcake Bandits",
            "gang-4m",
            "A good-looking gang",
            34,
            "You must be good-looking to join this gang.",
            () => state.stats.Looks >= 70,
          ],
          [
            "Wrinkly Sneaks",
            "gang-2m",
            "A senior gang",
            20,
            "You must be a senior citizen to join this gang.",
            () => state.age >= 60,
          ],
          [
            "Tattletale Squad",
            "gang-10m",
            "An unfeared gang",
            5,
            "Anyone can join this gang. Nobody wants to.",
          ],
        ],
        INMATE_ADJ = [
          "Jizzy",
          "Fresh",
          "Simple",
          "Eager",
          "Lil",
          "Big",
          "Crazy",
          "Slim",
          "Smooth",
          "Dirty",
          "Sleepy",
          "Mad",
          "Shady",
          "Lucky",
          "Quiet",
          "Tiny",
        ],
        INMATE_NICK = [
          "Loads",
          "Snoop",
          "Crash",
          "Pierre",
          "Cameron",
          "Bones",
          "Tank",
          "Chopper",
          "Rocco",
          "Ghost",
          "Spider",
          "Biscuit",
          "Moose",
          "Knuckles",
          "Dice",
          "Razor",
        ],
        SEXUALITIES = ["Straight", "Straight", "Straight", "Gay", "Bisexual"],
        JUV_CRIMES = [
          "Keying a Car",
          "Shoplifting",
          "Vandalism",
          "Graffiti",
          "Assault",
          "Underage Drinking",
          "Joyriding",
          "Arson",
          "Burglary",
          "Pickpocketing",
          "Breaking and Entering",
          "Petty Theft",
          "Car Theft",
          "Bullying",
          "Trespassing",
          "Possession",
          "Setting Off Fireworks",
          "Egging a Police Car",
        ],
        inmateAge = (e) =>
          e.juv ? Math.max(12, Math.min(17, state.age + e.ageOffset)) : Math.max(18, state.age + e.ageOffset);
      function newInmate() {
        if (state.prison && state.prison.juv) {
          const e = "m",
            t = Math.max(12, Math.min(17, state.age + rint(-3, 3)));
          return {
            name: `${uname(e)} ${ulast()}`,
            g: e,
            juv: !0,
            ageOffset: t - state.age,
            look: randomLook(e, t),
            rel: rint(0, 10),
            crazy: rint(5, 98),
            size: rint(10, 80),
            respect: rint(5, 70),
            sexuality: any(SEXUALITIES),
            gang: null,
            crime: any(JUV_CRIMES),
          };
        }
        const e = Math.max(18, state.age + rint(-12, 25)),
          t = uname("m");
        return {
          name: chance(0.35) ? any(INMATE_NICK) : chance(0.5) ? `${any(INMATE_ADJ)} ${t}` : t,
          g: "m",
          ageOffset: e - state.age,
          look: randomLook("m", e),
          rel: rint(2, 12),
          crazy: rint(5, 98),
          size: rint(10, 95),
          respect: rint(5, 90),
          sexuality: any(SEXUALITIES),
          gang: chance(0.6) ? any(GANGS.filter((t) => e >= 60 || "Wrinkly Sneaks" !== t[0]))[0] : null,
          crime: capFirst(
            any([
              "voluntary manslaughter",
              "armed robbery",
              "murder",
              "arson",
              "drug trafficking",
              "grand theft auto",
              "burglary",
              "assault",
              "fraud",
              "kidnapping",
              "tax evasion",
              "extortion",
            ]),
          ),
        };
      }
      const yardCrowd = () => {
        const e = [];
        for (; e.length < 11; ) {
          const t = newInmate();
          e.some((e) => e.name === t.name) || e.push(t);
        }
        return e;
      };
      function openPrison() {
        const e = state.prison;
        if (!e) return;
        syncProfile(),
          (sTitle.textContent = e.juv ? "JUVIE" : "PRISON"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = X_ICON),
          (sBack.onclick = () => screen.classList.remove("open"));
        const t = (state.lovers || []).find((e) => !e.dead),
          a = (e, t, a, o, n = DOTS, s) =>
            `<div class="row${s ? " dis locked" : ""}" data-p="${e}"><img src="prison/${t}.png"><div class="t"><b>${a}</b>${o}</div>${s ? "" : n}</div>`,
          o = (e) => `<span>${e}</span>`;
        (sList.innerHTML =
          a("sentence", "sentence", "Sentence", sBar("Behavior", e.behavior)) +
          (state.jailCardUsed
            ? ""
            : a("card", "card", "Get Out Of Jail Free Card", o("Get out of jail whenever you want!"))) +
          '<div class="sec">Activities</div>' +
          a("appeal", "appeal", "Appeal", o("Appeal your sentence")) +
          a("bribe", "bribe", "Bribe", o("Bribe the guards")) +
          (e.juv
            ? ""
            : a("conjugal", "conjugal", "Conjugal Visit", o("Arrange a conjugal visit"), DOTS, !t)) +
          a("cry", "cry", "Cry", o("Let it all out")) +
          a("escape", "escape", "Escape", o("Attempt to escape")) +
          a("gangs", "gangs", "Gangs", o(e.gang ? `Member of the ${e.gang}` : "Join a gang"), CHEV) +
          a("infirmary", "infirmary", "Infirmary", o("Seek medical attention")) +
          a("letter", "letter", "Letter", o("Send someone a letter"), CHEV) +
          a("mind", "mind", "Mind & Body", o("Pass some time productively"), CHEV) +
          a("jobs", "jobs", "Prison Jobs", o(e.job ? e.job[0] : "Get a prison job"), CHEV) +
          a("yard", "yard", "Prison Yard", sBar("Respect", e.respect), CHEV) +
          a("riot", "riot", "Riot", o("Start a riot")) +
          a("tm", "tm", "Time Machine", o("Travel back in time")) +
          '<div class="act-surrender" id="prSurrender"><img src="prison/surrender.png" alt=""><span>Surrender...</span></div>'),
          sList.querySelectorAll("[data-p]").forEach(
            (e) =>
              (e.onclick = () => {
                e.classList.contains("dis") || prisonAction(e.dataset.p);
              }),
          ),
          (document.getElementById("prSurrender").onclick = () =>
            tagCard({
              tag: "Surrender",
              iconSrc: "prison/surrender.png",
              title: "Surrender",
              lead: "Are you sure you want to give up on this life?",
              surprise: !1,
              choices: [
                [
                  "Surrender",
                  () => {
                    screen.classList.remove("open"), die("surrender");
                  },
                ],
                ["Never mind", () => {}],
              ],
            })),
          (sList.scrollTop = 0),
          screen.classList.add("open");
      }
      const prRes = (e, t, a) => {
        a && say(a), screen.classList.remove("open"), renderStats(), notice(e, t);
      };
      function prisonAction(e) {
        const t = state.prison,
          a = state.stats,
          o = (e) => t.did[e] !== state.age && ((t.did[e] = state.age), !0);
        if ("sentence" === e)
          return jCard({
            tag: "Prison",
            brick: !0,
            iconSrc: "prison/sentence.png",
            title: "Sentence",
            close: !0,
            rows: [
              ["Crime", capFirst(t.crime)],
              ["Sentence", t.death ? `Death (${t.death.how})` : yrs(t.years)],
              ["Time Served", yrs(t.served)],
              t.death
                ? ["Execution Date", `${ordN(t.death.age)} Birthday`]
                : ["Time Left", yrs(Math.max(1, t.years - t.served))],
              ["Prison", t.name],
              ["Prison Security", t.sec],
            ],
            bars: [["Behavior", t.behavior]],
          });
        if ("card" === e)
          return iosConfirm(
            "Get Out Of Jail Free",
            "Use your Get Out Of Jail Free Card to walk out of prison right now?",
            () => {
              (state.jailCardUsed = !0),
                release("I used my Get Out Of Jail Free Card and walked out of prison!", "Freedom!");
            },
          );
        if ("appeal" === e) {
          if (t.did.appeal === state.age)
            return prRes("Appeal", "You've already appealed your sentence this year.");
          const e = Math.max(1e3, 400 * (t.death ? 30 : t.years)),
            a = [...LAW_FIRMS].sort(() => Math.random() - 0.5).slice(0, 3),
            o = [
              [a[0], ep(Math.round(e * (0.8 + 0.4 * Math.random()))), 0.1],
              [a[1], ep(Math.round(e * (3 + Math.random()))), 0.2],
              [a[2], ep(Math.round(e * (20 + 10 * Math.random()))), 0.38],
            ];
          return jCard({
            tag: "Prison",
            brick: !0,
            iconSrc: "prison/appeal.png",
            title: "Appeal",
            close: !0,
            lead: "Which local law firm will you hire to appeal your sentence?",
            rows: o.map(([e, t]) => [e, usd(t)]),
            choices: o.map(([e, a, o]) => [
              e,
              () =>
                state.money < a
                  ? notice(
                      "Flat broke",
                      `You don't have enough money to hire ${e}.<br><br>${state.money ? "You can't afford them." : "You are broke."}`,
                      null,
                      !1,
                      brokeRows(a),
                    )
                  : ((state.money -= a),
                    (t.did.appeal = state.age),
                    chaChing(),
                    crimeSnd("Stamp"),
                    chance(o + (t.behavior - 50) / 400)
                      ? t.death
                        ? ((t.death = null),
                          (t.years = t.served + rint(15, 30)),
                          (t.sec = "Maximum"),
                          prRes(
                            "Sentence commuted",
                            `${e} got your death sentence commuted to ${yrs(t.years - t.served)} in prison!`,
                            "My death sentence was commuted on appeal.",
                          ))
                        : (addSuit({
                            name: `${state.city || COUNTRIES[state.country][1]} Police Department`,
                            who: "Police Department",
                            reason: "wrongful imprisonment",
                            org: !0,
                            strength: 0.5,
                            scale: localPrice(Math.max(5e4, 6e4 * t.served)),
                          }),
                          void release(
                            `I hired ${e} to appeal my sentence, and my conviction was overturned!`,
                            "Appeal granted",
                          ))
                      : prRes(
                          "Appeal denied",
                          `${e} appealed your sentence, but the judge denied it.`,
                          `I hired ${e} to appeal my sentence. It was denied.`,
                        )),
            ]),
          });
        }
        if ("bribe" === e) {
          if (t.death)
            return prRes(
              "Bribe",
              "The guards on death row laughed at your bribe.",
              "I tried to bribe a guard on death row. He laughed at me.",
            );
          const e = Math.max(5e4, 100 * Math.round(state.money / 100)),
            a = Math.max(100, Math.min(100 * Math.round(state.money / 2 / 100), e) || 5e3);
          ev.innerHTML = `<div class="jcw"><div class="jm-tag brick" style="margin-top:12px">Prison</div>\n        <h4><img src="prison/bribe.png" alt=""><span>Bribe</span></h4>\n        <div class="lead">How much will you offer the guards as a bribe to let you go?</div>\n        <div class="gm-row"><span class="hr-lab" style="margin:0">Bribe</span><b id="brAmt">${usd(a)}</b></div>\n        <input type="range" class="gm-range" id="brRange" min="100" max="${e}" step="100" value="${a}">\n        <button class="jm-apply ev-btn" id="brGo">Offer the bribe</button><button class="jm-apply ev-btn" id="brNo">Actually, never mind</button>\n        <div class="ev-surprise"><img src="emoji/1f3b2.png"><span>Surprise me!</span></div></div>`;
          const o = document.getElementById("brRange");
          o.oninput = () => (document.getElementById("brAmt").textContent = usd(+o.value));
          const n = () => evWrap.classList.remove("open"),
            s = (e) => {
              if ((n(), state.money < e))
                return prRes(
                  "Broke",
                  "You don't have that kind of money. The guards laughed at you.",
                  "I tried to bribe a prison guard with money I didn't have.",
                );
              const a = { Minimum: 5e3, Medium: 4e4, Maximum: 2e5 }[t.sec] * (t.years / 5 + 0.5);
              if (chance(0.7 * Math.min(0.85, e / a)))
                return (
                  (state.money -= e),
                  chaChing(),
                  crimeSnd("BribeReleaseJailedCartelMember"),
                  release(`I bribed a guard with ${usd(e)} and walked out of prison!`, "Bribe accepted")
                );
              (t.behavior = clamp(t.behavior - 15)),
                (t.years += chance(0.5) ? 1 : 0),
                prRes(
                  "Now they wanna be righteous",
                  `You tried to bribe the guards ${usd(e)}!<br><br>They reported you to the warden!`,
                  `I tried to bribe a prison guard with ${usd(e)}, but I was reported.`,
                );
            };
          return (
            (document.getElementById("brGo").onclick = () => s(+o.value)),
            (document.getElementById("brNo").onclick = n),
            (ev.querySelector(".ev-surprise").onclick = () =>
              chance(0.5) ? s(100 * rint(1, Math.max(1, e / 100))) : n()),
            evWrap.classList.add("open")
          );
        }
        if ("conjugal" === e) {
          const e = (state.lovers || []).find((e) => !e.dead);
          return o("conjugal")
            ? ((a.Happiness = clamp(a.Happiness + rint(8, 15))),
              prRes(
                "Conjugal Visit",
                `You had a conjugal visit with ${e.first}. You feel a lot better.`,
                `I had a conjugal visit with ${e.first}.`,
              ))
            : prRes("Conjugal Visit", "You've already had a conjugal visit this year.");
        }
        if ("cry" === e)
          return (
            (a.Happiness = clamp(a.Happiness + rint(1, 4))),
            (t.respect = clamp(t.respect - rint(0, 4))),
            prRes(
              "Cry",
              any([
                "You cried yourself to sleep in your cell.",
                "You sobbed into your pillow. A few inmates heard you.",
                "You let it all out. You feel a little better.",
              ]),
              "I cried in my prison cell.",
            )
          );
        if ("escape" === e)
          return o("escape")
            ? escapeGame()
            : prRes(
                "Escape",
                "You've already tried to escape this year. The guards are watching you closely.",
              );
        if ("gangs" === e) return openGangs();
        if ("infirmary" === e) {
          const e = a.Health < 80;
          return (
            e && (a.Health = clamp(a.Health + rint(5, 15))),
            prRes(
              "Infirmary",
              e
                ? "The prison doctor patched you up. You feel a little better."
                : "The prison doctor said there is nothing wrong with you and sent you back to your cell.",
              "I went to the prison infirmary.",
            )
          );
        }
        return "letter" === e
          ? openLetter()
          : "mind" === e
            ? openMindBody()
            : "jobs" === e
              ? openPrisonJobs()
              : "yard" === e
                ? openYard()
                : "riot" === e
                  ? iosConfirm("Confirm", "Are you sure you want to try to start a riot?", () => {
                      if (!o("riot"))
                        return prRes("Riot", "The prison is still on lockdown from your last riot.");
                      riotGame();
                    })
                  : "tm" === e
                    ? (screen.classList.remove("open"), openTimeMachine())
                    : void 0;
      }
      function makeMaze(e) {
        for (let t = 0; t < 400; t++) {
          const t = Array.from({ length: e }, () => Array(e).fill(!1)),
            a = Array.from({ length: e }, () => Array(e).fill(!1)),
            o = Math.round(e * e * (0.3 + 0.12 * Math.random()));
          for (let n = 0; n < o; n++) {
            const o = chance(0.5),
              n = rint(1, 3);
            let s = rint(0, e - 1),
              r = rint(0, e - 1);
            for (let i = 0; i < n; i++)
              o ? (r < e - 1 && s < e && (t[s][r] = !0), s++) : (s < e - 1 && r < e && (a[s][r] = !0), r++);
          }
          const n = rint(0, 3),
            s = chance(0.5) ? 0 : e - 1,
            r =
              0 === n
                ? { r: 0, c: s, dr: -1, dc: 0 }
                : 1 === n
                  ? { r: e - 1, c: s, dr: 1, dc: 0 }
                  : 2 === n
                    ? { r: s, c: 0, dr: 0, dc: -1 }
                    : { r: s, c: e - 1, dr: 0, dc: 1 },
            i = { N: e, vW: t, hW: a, ex: r },
            l = { r: rint(0, e - 1), c: rint(0, e - 1) },
            c = { r: rint(0, e - 1), c: rint(0, e - 1) };
          if (
            Math.abs(l.r - r.r) + Math.abs(l.c - r.c) < e - 1 ||
            Math.abs(l.r - c.r) + Math.abs(l.c - c.c) < 3
          )
            continue;
          const d = solveMaze(i, l, c);
          if (d && d >= e + 1 && d <= 4 * e) return { ...i, p: l, g: c };
        }
        return null;
      }
      const mzBlocked = (e, t, a, o, n) => {
          const s = t + o,
            r = a + n;
          return (
            s < 0 || r < 0 || s >= e.N || r >= e.N || (n ? e.vW[t][Math.min(a, r)] : e.hW[Math.min(t, s)][a])
          );
        },
        guardStep = (e, t, a) => {
          if (t.c !== a.c) {
            const o = a.c > t.c ? 1 : -1;
            if (!mzBlocked(e, t.r, t.c, 0, o)) return { r: t.r, c: t.c + o };
          }
          if (t.r !== a.r) {
            const o = a.r > t.r ? 1 : -1;
            if (!mzBlocked(e, t.r, t.c, o, 0)) return { r: t.r + o, c: t.c };
          }
          return t;
        };
      function solveMaze(e, t, a) {
        const o = (e, t) => `${e.r},${e.c},${t.r},${t.c}`,
          n = new Set([o(t, a)]);
        let s = [[t, a]],
          r = 0;
        for (; s.length && r < 80; ) {
          r++;
          const t = [];
          for (const [a, i] of s)
            for (const [s, l] of [
              [-1, 0],
              [1, 0],
              [0, -1],
              [0, 1],
            ]) {
              if (a.r === e.ex.r && a.c === e.ex.c && s === e.ex.dr && l === e.ex.dc) return r;
              if (mzBlocked(e, a.r, a.c, s, l)) continue;
              const c = { r: a.r + s, c: a.c + l };
              if (c.r === i.r && c.c === i.c) continue;
              let d = guardStep(e, i, c);
              if (d.r === c.r && d.c === c.c) continue;
              if (((d = guardStep(e, d, c)), d.r === c.r && d.c === c.c)) continue;
              const u = o(c, d);
              n.has(u) || (n.add(u), t.push([c, d]));
            }
          s = t;
        }
        return 0;
      }
      function escapeGame() {
        const e = state.prison,
          t = e.juv ? 6 : { Minimum: 6, Medium: 7, Maximum: 8 }[e.sec] + (e.death, 0),
          a = makeMaze(t);
        if (!a) return prRes("Escape", "The guards are on high alert. There is no way out this year.");
        let o = { ...a.p },
          n = { ...a.g },
          s = !1,
          r = !1;
        screen.classList.remove("open");
        const i = phoneEl.classList.contains("dark");
        (ev.innerHTML = `<div class="jcw esc">\n      <div class="jm-tag brick" style="margin-top:12px">Prison</div>\n      <h4><img src="prison/sentence.png" alt=""><span>Escape</span></h4>\n      <div class="lead">The guard moves twice for every move you make! He will only make moves towards you and will try to walk horizontally first.</div>\n      <canvas class="esc-board" width="640" height="640"></canvas>\n      <div class="esc-pad" style="background-image:url(prison/esc/${i ? "pad-dm" : "pad"}.png)">\n        <img data-d="up" src="prison/esc/btn-up.png" alt="Up"><img data-d="left" src="prison/esc/btn-left.png" alt="Left">\n        <img data-d="right" src="prison/esc/btn-right.png" alt="Right"><img data-d="down" src="prison/esc/btn-down.png" alt="Down"></div>\n      <div class="esc-give">Surrender</div></div>`),
          ev.classList.remove("death18"),
          (ev.style.overflow = "");
        const l = ev.querySelector(".esc-board").getContext("2d"),
          c = 640 / (t + 1.9),
          d = 0.95 * c,
          u = { exit: new Image(), guard: new Image() };
        (u.exit.src = "prison/esc/Exit.png"), (u.guard.src = "prison/police.png");
        const h = document.querySelector(".phone > .profile canvas.avatar"),
          p = (e) => d + e * c,
          m = (e) => d + e * c;
        function f(e) {
          l.clearRect(0, 0, 640, 640);
          const s = a.ex,
            r = p(s.c) + s.dc * c,
            i = m(s.r) + s.dr * c;
          (l.fillStyle = "#b4c8d3"),
            l.fillRect(r + (s.dc ? 0 : 4), i + (s.dr ? 0 : 4), c - (s.dc ? 0 : 8), c - (s.dr ? 0 : 8));
          for (let e = 0; e < t; e++)
            for (let a = 0; a < t; a++)
              (l.fillStyle = (e + a) % 2 ? "#7f8d9a" : "#b4c8d3"), l.fillRect(p(a), m(e), c, c);
          (l.strokeStyle = "rgba(255,255,255,.75)"), (l.lineWidth = 2);
          for (let e = 1; e < t; e++)
            l.beginPath(),
              l.moveTo(p(e), m(0)),
              l.lineTo(p(e), m(t)),
              l.stroke(),
              l.beginPath(),
              l.moveTo(p(0), m(e)),
              l.lineTo(p(t), m(e)),
              l.stroke();
          (l.strokeStyle = "#111"), (l.lineWidth = 6), (l.lineCap = "square");
          const d = (e, t, a, o) => {
            l.beginPath(), l.moveTo(e, t), l.lineTo(a, o), l.stroke();
          };
          for (let e = 0; e < t; e++)
            (-1 === s.dr && s.c === e) || d(p(e), m(0), p(e + 1), m(0)),
              (1 === s.dr && s.c === e) || d(p(e), m(t), p(e + 1), m(t)),
              (-1 === s.dc && s.r === e) || d(p(0), m(e), p(0), m(e + 1)),
              (1 === s.dc && s.r === e) || d(p(t), m(e), p(t), m(e + 1));
          if (((l.lineWidth = 3), s.dr)) {
            const e = s.dr < 0 ? m(0) - c : m(t) + c;
            d(p(s.c) + 4, m(s.dr < 0 ? 0 : t), p(s.c) + 4, e),
              d(p(s.c + 1) - 4, m(s.dr < 0 ? 0 : t), p(s.c + 1) - 4, e),
              d(p(s.c) + 4, e, p(s.c + 1) - 4, e);
          } else {
            const e = s.dc < 0 ? p(0) - c : p(t) + c;
            d(p(s.dc < 0 ? 0 : t), m(s.r) + 4, e, m(s.r) + 4),
              d(p(s.dc < 0 ? 0 : t), m(s.r + 1) - 4, e, m(s.r + 1) - 4),
              d(e, m(s.r) + 4, e, m(s.r + 1) - 4);
          }
          l.lineWidth = 6;
          for (let e = 0; e < t; e++)
            for (let o = 0; o < t; o++)
              o < t - 1 && a.vW[e][o] && d(p(o + 1), m(e), p(o + 1), m(e + 1)),
                e < t - 1 && a.hW[e][o] && d(p(o), m(e + 1), p(o + 1), m(e + 1));
          u.exit.complete && l.drawImage(u.exit, r + 0.18 * c, i + 0.18 * c, 0.64 * c, 0.64 * c),
            (l.fillStyle = e ? "#d9372b" : "#3fb549"),
            l.fillRect(p(o.c) + 3, m(o.r) + 3, c - 6, c - 6),
            h && l.drawImage(h, p(o.c) + 0.1 * c, m(o.r) + 0.1 * c, 0.8 * c, 0.8 * c),
            u.guard.complete &&
              l.drawImage(u.guard, p(n.c) + 0.14 * c, m(n.r) + 0.14 * c, 0.72 * c, 0.72 * c);
        }
        (u.exit.onload = u.guard.onload = () => f()), f();
        const g = (t) => {
            (r = !0),
              document.removeEventListener("keydown", b),
              setTimeout(
                () => {
                  if ((evWrap.classList.remove("open"), t))
                    return (
                      (e.respect = clamp(e.respect + 30)),
                      crimeSnd("Footstep1"),
                      release(`I escaped from ${e.name}! I'm free.`, "Escaped!")
                    );
                  crimeSnd("Cops"),
                    (e.years += rint(1, 3)),
                    (e.behavior = clamp(e.behavior - 25)),
                    prRes(
                      "Caught",
                      "The guard caught you trying to escape! Your sentence has been extended.",
                      "I tried to escape from prison, but a guard caught me. My sentence was extended.",
                    );
                },
                t ? 250 : 650,
              );
          },
          y = (e) => {
            if (s || r) return;
            const [t, i] = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] }[e];
            if (o.r === a.ex.r && o.c === a.ex.c && t === a.ex.dr && i === a.ex.dc)
              return (o = { r: o.r + t, c: o.c + i }), f(), g(!0);
            if (!mzBlocked(a, o.r, o.c, t, i)) {
              if (((o = { r: o.r + t, c: o.c + i }), play("choice"), o.r === n.r && o.c === n.c))
                return f(!0), g(!1);
              (s = !0),
                f(),
                setTimeout(() => {
                  if (((n = guardStep(a, n, o)), f(n.r === o.r && n.c === o.c), n.r === o.r && n.c === o.c))
                    return (s = !1), g(!1);
                  setTimeout(() => {
                    n = guardStep(a, n, o);
                    const e = n.r === o.r && n.c === o.c;
                    f(e), (s = !1), e && g(!1);
                  }, 170);
                }, 170);
            }
          },
          b = (e) => {
            const t = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" }[e.key];
            t && evWrap.classList.contains("open") && (e.preventDefault(), y(t));
          };
        document.addEventListener("keydown", b),
          ev.querySelectorAll(".esc-pad img").forEach((e) => (e.onclick = () => y(e.dataset.d))),
          (ev.querySelector(".esc-give").onclick = () => {
            r ||
              ((r = !0),
              document.removeEventListener("keydown", b),
              evWrap.classList.remove("open"),
              prRes(
                "Surrendered",
                "You gave up on your escape and went back to your cell.",
                "I tried to escape from prison, but I gave up.",
              ));
          }),
          evWrap.classList.add("open");
      }
      function openGangs() {
        const e = state.prison;
        (sTitle.textContent = "GANGS"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openPrison),
          (sList.innerHTML = GANGS.map(
            ([t, a, o], n) =>
              `<div class="row" data-g="${n}"><img class="gang" src="prison/${a}.png"><div class="t"><b>${t}</b><span>${e.gang === t ? "Your gang" : o}</span></div>${DOTS}</div>`,
          ).join("")),
          sList.querySelectorAll("[data-g]").forEach(
            (t) =>
              (t.onclick = () => {
                const [a, o, , n, s, r] = GANGS[+t.dataset.g];
                if (e.gang === a)
                  return jCard({
                    tag: "Prison",
                    brick: !0,
                    iconSrc: `prison/${o}.png`,
                    title: a,
                    close: !0,
                    lead: `You are a member of the ${a}.`,
                    choices: [
                      [
                        `Leave the ${a}`,
                        () => {
                          (e.gang = null),
                            (e.respect = clamp(e.respect - 10)),
                            prRes("Left", `You left the ${a}.`, `I left the ${a} prison gang.`);
                        },
                      ],
                    ],
                  });
                jCard({
                  tag: "Prison",
                  brick: !0,
                  iconSrc: `prison/${o}.png`,
                  title: a,
                  close: !0,
                  lead: `Attempt to join the ${a} today!<br><br>${s}`,
                  bars: [["Notoriety", n, barCol(100 - n)]],
                  choices: [
                    [
                      `Join the ${a}`,
                      () => {
                        if (e.respect + rint(-4, 4) < n || (r && !r()))
                          return prRes(
                            "Rejected",
                            `The ${a} rejected you. You aren't ${n >= 60 ? "respected" : "impressive"} enough to join.`,
                            `I tried to join the ${a} prison gang, but they rejected me.`,
                          );
                        (e.gang = a),
                          (e.respect = clamp(e.respect + 8)),
                          crimeSnd("GangWar"),
                          prRes(
                            "Welcome",
                            `You are now a member of the ${a}!`,
                            `I joined the ${a} prison gang.`,
                          );
                      },
                    ],
                  ],
                });
              }),
          ),
          (sList.scrollTop = 0);
      }
      function openPrisonJobs() {
        const e = state.prison;
        (sTitle.textContent = "PRISON JOBS"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openPrison),
          (sList.innerHTML = PRISON_JOBS.map(
            ([t, a, o], n) =>
              `<div class="row" data-j="${n}"><img src="prison/${a}.png"><div class="t"><b>${t}</b><span class="pj-pay">${e.job && e.job[0] === t ? "Your job · " : ""}${cur()}${o}/day</span></div>${DOTS}</div>`,
          ).join("")),
          sList.querySelectorAll("[data-j]").forEach(
            (t) =>
              (t.onclick = () => {
                const a = PRISON_JOBS[+t.dataset.j];
                if (e.job && e.job[0] === a[0])
                  return jCard({
                    tag: "Prison",
                    brick: !0,
                    iconSrc: `prison/${a[1]}.png`,
                    title: a[0],
                    close: !0,
                    rows: [["Salary", `${cur()}${a[2]}/day`]],
                    choices: [
                      [
                        "Quit",
                        () => {
                          (e.job = null),
                            prRes(
                              "Quit",
                              `You quit your prison job as ${/^[aeiou]/i.test(a[0]) ? "an" : "a"} ${a[0].toLowerCase()}.`,
                              "I quit my prison job.",
                            );
                        },
                      ],
                    ],
                  });
                jCard({
                  tag: "Prison",
                  brick: !0,
                  iconSrc: `prison/${a[1]}.png`,
                  title: a[0],
                  close: !0,
                  lead: `Apply for a job as ${/^[aeiou]/i.test(a[0]) ? "an" : "a"} ${a[0].toLowerCase()}?`,
                  rows: [["Salary", `${cur()}${a[2]}/day`]],
                  choices: [
                    [
                      "Apply",
                      () =>
                        "Tutor" === a[0] && state.stats.Smarts < 60
                          ? prRes("Rejected", "You aren't smart enough to tutor other inmates.")
                          : chance(0.35 + e.behavior / 160)
                            ? ((e.job = a),
                              (e.behavior = clamp(e.behavior + 5)),
                              void prRes(
                                "Hired",
                                `You got the job! You are now a prison ${a[0].toLowerCase()}.`,
                                `I got a prison job as ${/^[aeiou]/i.test(a[0]) ? "an" : "a"} ${a[0].toLowerCase()}.`,
                              ))
                            : prRes(
                                "Rejected",
                                `The warden rejected your application for the ${a[0].toLowerCase()} job.`,
                                `I applied to be a prison ${a[0].toLowerCase()}, but I was rejected.`,
                              ),
                    ],
                  ],
                });
              }),
          ),
          (sList.scrollTop = 0);
      }
      function openMindBody() {
        (sTitle.textContent = "MIND & BODY"), (sBack.innerHTML = BACK_ICON), (sBack.onclick = openPrison);
        (sList.innerHTML = [
          ["library", "m-book", "Library", "Read a book"],
          ["gym", "m-weights", "Workout", "Lift weights in the yard"],
          ["meditate", "mind", "Meditate", "Find inner peace"],
          ["pray", "m-pray", "Pray", "Talk to a higher power"],
        ]
          .map(
            ([e, t, a, o]) =>
              `<div class="row" data-m="${e}"><img src="prison/${t}.png"><div class="t"><b>${a}</b><span>${o}</span></div>${DOTS}</div>`,
          )
          .join("")),
          sList.querySelectorAll("[data-m]").forEach(
            (e) =>
              (e.onclick = () => {
                const t = state.stats,
                  a = state.prison,
                  o = e.dataset.m;
                return a.did["m" + o] === state.age
                  ? prRes(e.querySelector("b").textContent, "You've already done that this year.")
                  : ((a.did["m" + o] = state.age),
                    "library" === o
                      ? ((t.Smarts = clamp(t.Smarts + rint(2, 6))),
                        prRes(
                          "Library",
                          `You read ${any(["a mystery novel", "a law textbook", "a book about birds", "an encyclopedia", "a self-help book"])} in the prison library.`,
                          "I read a book in the prison library.",
                        ))
                      : "gym" === o
                        ? ((t.Health = clamp(t.Health + rint(2, 6))),
                          (t.Looks = clamp(t.Looks + rint(0, 3))),
                          (a.respect = clamp(a.respect + rint(1, 5))),
                          prRes(
                            "Workout",
                            "You pumped iron in the prison yard. The other inmates noticed.",
                            "I worked out in the prison yard.",
                          ))
                        : "meditate" === o
                          ? ((t.Happiness = clamp(t.Happiness + rint(3, 8))),
                            prRes(
                              "Meditate",
                              "You meditated in your cell and found a little peace.",
                              "I meditated in my prison cell.",
                            ))
                          : ((t.Happiness = clamp(t.Happiness + rint(1, 5))),
                            void prRes(
                              "Pray",
                              "You prayed in your cell. You feel a little more at peace.",
                              "I prayed in my prison cell.",
                            )));
              }),
          ),
          (sList.scrollTop = 0);
      }
      function openLetter() {
        (sTitle.textContent = "LETTER"), (sBack.innerHTML = BACK_ICON), (sBack.onclick = openPrison);
        const e = victims();
        (sList.innerHTML = e.length
          ? e
              .map(
                (e, t) =>
                  `<div class="row" data-l="${t}"><img src="prison/letter.png"><div class="t"><b>${e.name}</b><span>${e.title}</span></div>${DOTS}</div>`,
              )
              .join("")
          : '<div class="row"><div class="t"><b>Nobody to write to</b><span>You have no one left on the outside.</span></div></div>'),
          sList.querySelectorAll("[data-l]").forEach(
            (t) =>
              (t.onclick = () => {
                const a = e[+t.dataset.l];
                (state.stats.Happiness = clamp(state.stats.Happiness + rint(1, 3))),
                  prRes(
                    "Letter",
                    `You sent a letter from prison to ${a.rel}, ${a.name.split(" ")[0]}.`,
                    `I sent a letter to ${a.rel.replace("your ", "my ")}, ${a.name.split(" ")[0]}.`,
                  );
              }),
          ),
          (sList.scrollTop = 0);
      }
      function openYard() {
        const e = state.prison;
        (e.inmates ||= yardCrowd()),
          (sTitle.textContent = "PRISON YARD"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openPrison);
        const t = inmateAge;
        (sList.innerHTML = e.inmates
          .map(
            (e, t) =>
              `<div class="row" data-y="${t}"><div class="inmate" data-f="${t}"><img src="prison/bars.png" alt=""></div><div class="t"><b>${e.name}</b>${sBar("Relationship", e.rel)}</div>${DOTS}</div>`,
          )
          .join("")),
          sList.querySelectorAll(".inmate").forEach((a) => {
            const o = e.inmates[+a.dataset.f];
            a.prepend(npcFace(o.look, o.g, t(o), moodOf(o.rel)));
          }),
          sList
            .querySelectorAll("[data-y]")
            .forEach((t) => (t.onclick = () => inmateCard(e.inmates[+t.dataset.y]))),
          (sList.scrollTop = 0);
      }
      function inmateCard(e) {
        const t = state.prison,
          a = state.stats,
          o = inmateAge(e),
          n = "f" === e.g ? "her" : "him",
          s = "f" === e.g ? "She" : "He",
          r = e.juv
            ? [
                ["Name", e.name],
                ["Age", o],
                ["Crime", e.crime],
              ]
            : [
                ["Name", e.name],
                ["Age", o],
                ["Sexuality", e.sexuality],
              ];
        e.juv || (e.gang && r.push(["Gang", e.gang]), r.push(["Crime", e.crime]));
        const i = (e, t, a) => {
          prRes(e, t, a);
        };
        jCard({
          tag: "Prisoner",
          brick: !0,
          person: { name: e.name, look: e.look, g: e.g, age: o, mood: moodOf(e.rel) },
          iconSrc: "prison/profile.png",
          title: "Profile",
          close: !0,
          rows: r,
          bars: e.juv
            ? [
                ["Relationship", e.rel],
                ["Craziness", e.crazy, barCol(100 - e.crazy)],
                ["Respect", e.respect],
              ]
            : [
                ["Relationship", e.rel],
                ["Craziness", e.crazy, barCol(100 - e.crazy)],
                ["Size", e.size],
                ["Respect", e.respect],
              ],
          choices: [
            [
              `Mess with ${n}`,
              () => {
                if (chance(e.crazy / 140))
                  return (
                    (a.Health = clamp(a.Health - rint(5, 20))),
                    hurt(),
                    (e.rel = Math.max(0, e.rel - 10)),
                    i(
                      "Bad idea",
                      `You messed with ${e.name}, who snapped and beat you up!`,
                      `I messed with ${e.name} in the prison yard. ${s} beat me up.`,
                    )
                  );
                (t.respect = clamp(t.respect + rint(1, 5))),
                  (e.rel = Math.max(0, e.rel - 5)),
                  i(
                    "Gotcha",
                    `You ${any(["stole the pudding off the tray of", "tripped", "spat in the soup of", "hid the slippers of"])} ${e.name}. The other inmates laughed.`,
                    `I messed with ${e.name} in the prison yard.`,
                  );
              },
            ],
            [
              `Compliment ${n}`,
              () => {
                e.rel = Math.min(100, e.rel + rint(4, 12));
                const t = "f" === e.g ? "her" : "his",
                  a = "f" === e.g ? "she" : "he";
                i(
                  "Compliment",
                  `You told ${e.name} that ${any([`${t} tattoos are sick`, `${a} has a nice smile`, `${a} looks strong`, `${a} is a great cellmate`])}.`,
                  `I complimented ${e.name}.`,
                );
              },
            ],
            [
              `Attack ${n}`,
              () =>
                setTimeout(
                  () =>
                    iosConfirm("Confirm", `Are you sure you want to attack ${e.name}?`, () => yardAttack(e)),
                  60,
                ),
            ],
            [
              `Insult ${n}`,
              () => {
                (e.rel = Math.max(0, e.rel - rint(5, 15))),
                  (t.respect = clamp(t.respect + rint(0, 3))),
                  i(
                    "Insult",
                    `You called ${e.name} ${any(["a sad excuse for a criminal", "a snitch", "a waste of space", "a pathetic loser", "ugly"])}.`,
                    `I insulted ${e.name}.`,
                  );
              },
            ],
          ],
        });
      }
      const GANG_HITS = [
        "They snapped your adam's apple.",
        "They whacked your ankle.",
        "They cracked your ribs.",
        "They broke your nose.",
        "They stomped on your hand.",
        "They knocked out two of your teeth.",
        "They slammed your head into the wall.",
        "They kicked you in the kidneys.",
        "They dislocated your shoulder.",
      ];
      function yardAttack(e) {
        const t = state.prison,
          a = state.stats,
          o = "f" === e.g ? "her" : "him",
          n = "f" === e.g ? "Her" : "His",
          s = "f" === e.g ? "she" : "he";
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="jm-tag brick" style="margin-top:12px">Prison</div><h4><img src="kid/fist.png" alt=""><span>Attack</span></h4>\n      <div class="lead">How will you attack ${e.name}?</div>\n      <label class="hr-lab">Pick your move:</label><div class="hr-sel"><select id="yaMove">${CLUB_FIGHT_MOVES.map((e) => `<option>${e}</option>`).join("")}</select></div>\n      <label class="hr-lab">Pick your target:</label><div class="hr-sel"><select id="yaTarget">${ATTACK_TARGETS.map((e) => `<option value="${e}">${n} ${e}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="yaGo">Attack ${o}</button></div>`),
          evWrap.classList.add("open"),
          (document.getElementById("yaGo").onclick = () => {
            const o = document.getElementById("yaMove").value.toLowerCase(),
              n = document.getElementById("yaTarget").value;
            if (
              (evWrap.classList.remove("open"),
              screen.classList.remove("open"),
              crimeSnd("GangWar"),
              (t.fights = (t.fights || 0) + 1),
              (t.behavior = clamp(t.behavior - 8)),
              e.gang && chance(0.35))
            ) {
              const o = [...GANG_HITS].sort(() => Math.random() - 0.5).slice(0, rint(2, 3));
              return (
                (a.Health = clamp(a.Health - rint(30, 60))),
                (t.respect = clamp(t.respect - rint(3, 8))),
                renderStats(),
                [0, 380, 760].forEach((e) => setTimeout(hurt, e)),
                say(`I attacked ${e.name} and got beaten by the ${e.gang} gang.`),
                setTimeout(
                  () =>
                    notice(
                      "Takes a whole gang, huh?",
                      `You have been beaten by the ${e.gang} gang for messing with one of their members!<br><br>${o.join("<br>")}`,
                      () => {
                        (a.Health <= 0 || chance(0.4)) && die(`a beating from the ${e.gang} gang`);
                      },
                      !0,
                    ),
                  900,
                )
              );
            }
            if (chance(0.3))
              return (
                say(`I tried to ${o} ${e.name} but missed.`),
                notice("You missed", `You tried to ${o} ${e.name} but missed!`, null, !0)
              );
            if (chance(Math.max(0.1, Math.min(0.9, 0.5 + (a.Health - e.size) / 200 + (t.gang ? 0.1 : 0))))) {
              const a = rint(30, 100);
              return (
                (t.respect = clamp(t.respect + rint(6, 14) + Math.round(e.respect / 15))),
                (e.rel = 0),
                say(`I attacked ${e.name} in the prison yard and won.`),
                notice(
                  "Take that",
                  `You delivered a${/^[aeiou]/.test(o) ? "n" : ""} ${o} to ${e.name}'s ${n}!`,
                  null,
                  !0,
                  `<div class="ev-bars nb"><b>Damage</b><i><u style="width:${a}%;background:#b3261e"></u></i></div>`,
                )
              );
            }
            (a.Health = clamp(a.Health - rint(10, 30))),
              hurt(),
              (t.respect = clamp(t.respect - rint(3, 8))),
              renderStats(),
              say(`I attacked ${e.name} in the prison yard and lost.`),
              notice("Defeat", `You attacked ${e.name}, but ${s} beat you to a pulp!`, null, !0);
          });
      }
      function riotGame() {
        const e = state.prison;
        screen.classList.remove("open"),
          ev.classList.remove("death18"),
          (ev.innerHTML =
            '<div class="jcw riot"><div class="jm-tag brick" style="margin-top:12px">Prison</div><h4><img src="prison/riot.png" alt=""><span>Prison Riot</span></h4>\n      <div class="lead">Recruit as many prisoners as you can to join the riot! Don\'t run into the walls, the guards, or your chain of prisoners.<br><br>Move your mouse (or swipe) to change directions!</div>\n      <div class="riot-count">Prisoners recruited: <span id="rtN">0</span>/10</div><canvas class="riot-board" width="600" height="600"></canvas></div>'),
          evWrap.classList.add("open");
        const t = ev.querySelector(".riot-board"),
          a = t.getContext("2d"),
          o = 600,
          n = 40,
          s = new Image();
        s.src = "prison/snake-bg.png";
        const r = document.querySelector(".phone > .profile canvas.avatar"),
          i = new Image();
        i.src = `prison/officer-${PG()}.png`;
        const l = () => {
            const e = newInmate();
            return npcFace(e.look, e.g, inmateAge(e), "angry");
          },
          c = (e, t) => ({ x: 20 + (e + 0.5) * n, y: 20 + (t + 0.5) * n });
        let d = [{ c: 7, r: 9 }],
          u = [{ c: 7, r: 9 }],
          h = { c: 0, r: -1 },
          p = null,
          m = !1,
          f = !1,
          g = 0,
          y = 0;
        const b = [],
          v = [],
          w = (e, t) =>
            d.some((a) => a.c === e && a.r === t) ||
            v.some((a) => a.c === e && a.r === t) ||
            ($ && $.c === e && $.r === t),
          k = () => {
            let e;
            do {
              e = { c: rint(1, 12), r: rint(1, 12) };
            } while (w(e.c, e.r) || Math.abs(e.c - d[0].c) + Math.abs(e.r - d[0].r) < 4);
            return e;
          };
        let $ = null;
        ($ = { ...k(), f: l() }), v.push(k());
        const S = (e) => {
          m = !0;
          const a = t.getBoundingClientRect(),
            n = ((e.clientX - a.left) / a.width) * o,
            s = ((e.clientY - a.top) / a.height) * o,
            r = c(d[0].c, d[0].r),
            i = n - r.x,
            l = s - r.y;
          if (Math.abs(i) < 16 && Math.abs(l) < 16) return;
          const u = Math.abs(i) > Math.abs(l) ? { c: Math.sign(i), r: 0 } : { c: 0, r: Math.sign(l) };
          (u.c === -h.c && u.r === -h.r) || (p = u);
        };
        t.addEventListener("pointermove", S),
          t.addEventListener("pointerdown", S),
          (t._riot = {
            get food() {
              return $;
            },
            get got() {
              return g;
            },
            get head() {
              return d[0];
            },
            get snake() {
              return d;
            },
            get over() {
              return f;
            },
            guards: v,
            cell: c,
          });
        const x = (e, t, o, s = 0.92 * n) => a.drawImage(e, t - s / 2, o - s / 2, s, s),
          C = (e) => {
            s.complete ? a.drawImage(s, 0, 0, o, o) : ((a.fillStyle = "#8c8c8c"), a.fillRect(0, 0, o, o));
            for (const e of v) {
              const t = c(e.c, e.r);
              x(i, t.x, t.y);
            }
            const t = c($.c, $.r);
            x($.f, t.x, t.y);
            for (let t = d.length - 1; t >= 0; t--) {
              const o = c(u[t].c, u[t].r),
                s = c(d[t].c, d[t].r),
                i = o.x + (s.x - o.x) * e,
                l = o.y + (s.y - o.y) * e;
              0 === t
                ? ((a.fillStyle = "#21c43a"), a.fillRect(i - 20, l - 20, n, n), r && x(r, i, l))
                : x(b[t - 1], i, l);
            }
          },
          I = (t) => {
            (f = !0),
              C(1),
              hurt(),
              (e.behavior = clamp(e.behavior - 10)),
              say("I tried to start a prison riot, but it failed."),
              setTimeout(() => {
                evWrap.classList.remove("open"), notice("Riot unsuccessful", t, null, !0);
              }, 900);
          },
          T = () => {
            p && ((h = p), (p = null));
            const t = { c: d[0].c + h.c, r: d[0].r + h.r };
            if (((u = d.map((e) => ({ ...e }))), t.c < 0 || t.r < 0 || t.c >= 14 || t.r >= 14))
              return I("You ran into a wall. The guards broke up your riot before it started.");
            if (v.some((e) => e.c === t.c && e.r === t.r))
              return I("You ran right into a guard. The guards broke up your riot before it started.");
            if (d.some((e, a) => a < d.length - 1 && e.c === t.c && e.r === t.r))
              return I("You crashed into your own crew. The guards broke up your riot.");
            if ((d.unshift(t), t.c === $.c && t.r === $.r)) {
              if (
                (b.push($.f),
                u.push({ ...d[d.length - 1] }),
                g++,
                (document.getElementById("rtN").textContent = g),
                g >= 10)
              )
                return (
                  C(1),
                  (() => {
                    (f = !0), crimeSnd("Riot");
                    const t = 300,
                      l = 300,
                      u = d.map((e, t) => c(e.c, e.r)),
                      h = performance.now(),
                      p = setInterval(() => {
                        const e = performance.now() - h;
                        s.complete && a.drawImage(s, 0, 0, o, o);
                        for (const e of v) {
                          const t = c(e.c, e.r);
                          x(i, t.x, t.y);
                        }
                        u.forEach((o, s) => {
                          (o.x += 0.08 * (t - o.x) + (e > 700 ? rint(-6, 6) : 0)),
                            (o.y += 0.08 * (l - o.y) + (e > 700 ? rint(-6, 6) : 0)),
                            0 === s
                              ? ((a.fillStyle = "#21c43a"),
                                a.fillRect(o.x - 20, o.y - 20, n, n),
                                r && x(r, o.x, o.y))
                              : x(b[s - 1], o.x, o.y);
                        }),
                          e > 2600 && (clearInterval(p), m());
                      }, 16),
                      m = () => {
                        evWrap.classList.remove("open"),
                          (e.respect = clamp(e.respect + rint(10, 20))),
                          (e.behavior = clamp(e.behavior - 20)),
                          chance(0.5) && (e.years += 1),
                          say("I started a prison riot!"),
                          notice(
                            "Riot!",
                            "You started a riot in the prison! The other inmates respect you more now.",
                            null,
                            !0,
                          );
                      };
                  })()
                );
              crimeSnd("Riot"), ($ = { ...k(), f: l() }), g % 3 == 0 && v.push(k());
            } else d.pop();
            (u = u.slice(0, d.length)), (u[0] = u[0] || d[0]), (y = performance.now());
          },
          A = setInterval(() => {
            if (f) return clearInterval(A);
            if (!evWrap.classList.contains("open")) return (f = !0), clearInterval(A);
            if (!m) return C(0);
            ((performance.now() - y) / 230 >= 1 && (T(), f)) || C(Math.min(1, (performance.now() - y) / 230));
          }, 16);
      }
      function prisonEvent(e, t) {
        const a = t.juv ? "Juvie" : "Prison",
          o = t.juv ? "juvie" : "prison",
          n = state.stats,
          s = (e) => {
            e.h && (n.Happiness = clamp(n.Happiness + e.h)),
              e.he && ((n.Health = clamp(n.Health + e.he)), e.he < -5 && hurt()),
              e.r && (t.respect = clamp(t.respect + e.r)),
              e.b && (t.behavior = clamp(t.behavior + e.b)),
              e.y && (t.years += e.y),
              renderStats();
          },
          r = (e, t, a) => {
            say(a), notice(e, t, null, !0);
          };
        return "transfer" === e.special
          ? ((t.name = `${any(PRISON_WORDS)} ${"Maximum" === t.sec ? "Max" : t.sec} Security Prison`),
            (t.inmates = null),
            r(
              "Transfer",
              `You have been transferred to ${t.name} to finish your sentence.`,
              `I was transferred to ${t.name}.`,
            ))
          : "deal" === e.special
            ? jCard({
                tag: a,
                brick: !0,
                iconSrc: "emoji/2696-fe0f.png",
                title: "Release Deal",
                lead: "The warden says he will release you if you give him information about another inmate.<br><br>What will you do?",
                surprise: !0,
                choices: [
                  [
                    "Tell him everything",
                    () => {
                      if (((t.respect = clamp(t.respect - 25)), chance(0.45)))
                        return release(
                          "I gave the warden information about another inmate in exchange for my release.",
                          "Released",
                        );
                      r(
                        "Played",
                        "You told the warden everything, but he decided to keep you locked up anyway. Word got around that you talked.",
                        "I snitched to the warden, but he did not release me.",
                      );
                    },
                  ],
                  [
                    "I ain't no snitch",
                    () => {
                      (t.respect = clamp(t.respect + 8)),
                        r(
                          "Loyal",
                          "You refused to say a word. The other inmates respect that.",
                          "I refused to snitch to the warden.",
                        );
                    },
                  ],
                ],
              })
            : void jCard({
                tag: a,
                brick: !0,
                iconSrc: /\//.test(e.ico) ? e.ico : `emoji/${e.ico}.png`,
                title: e.t,
                lead: `${e.d}<br><br>What will you do?`,
                surprise: !0,
                choices: e.c.map(([t, a, n, i, l]) => [
                  t,
                  () => {
                    if (l && chance(l[0])) return s(l[1]), r(e.t, l[2], l[3].replace(/\bprison\b/g, o));
                    s(a), r(e.t, n, i.replace(/\bprison\b/g, o));
                  },
                ]),
              });
      }
      function paroleBoard(e) {
        const t = window.PAROLE_QUESTIONS || [];
        if (!t.length) return;
        const [a, o] = any(t),
          n = o
            .slice()
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
        jCard({
          tag: e.juv ? "Juvie" : "Prison",
          brick: !0,
          iconSrc: "emoji/2696-fe0f.png",
          title: "Parole Board",
          lead: `You are standing in front of the parole board.<br><br>"${a}"`,
          surprise: !0,
          choices: n.map(([t, a]) => [
            t,
            () => {
              const o = Math.max(
                0.03,
                Math.min(0.92, e.behavior / 160 + 0.12 * a + (e.respect > 70 ? -0.05 : 0)),
              );
              if (chance(o)) return release(`I was granted parole after serving ${yrs(e.served)}.`, "Parole");
              say(`I was denied parole after serving ${yrs(e.served)}.`),
                notice(
                  "Parole Denied",
                  `The parole board did not like your answer: "${t}"<br><br>Your parole was denied and your sentence will continue.`,
                  null,
                  !0,
                );
            },
          ]),
        });
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        const e = state.prison;
        if (!e || state.dead) return;
        if (
          (e.served++,
          e.job && ((state.money += 365 * e.job[2]), renderStats()),
          (e.behavior = clamp(e.behavior + rint(-4, 6) + (e.job ? 3 : 0))),
          e.inmates &&
            e.inmates.forEach((t, a) => {
              if (chance(0.15)) {
                const t = newInmate();
                e.inmates.some((e) => e.name === t.name) || (e.inmates[a] = t);
              }
            }),
          e.death)
        ) {
          if (state.age >= e.death.age) {
            const t = e.death.how.toLowerCase();
            return /^(Hanging|Firing Squad)$/.test(e.death.how)
              ? setTimeout(() => whenClear(() => executionScene(e)), 400)
              : (say(`I was executed by ${t} at ${e.name}.`),
                setTimeout(
                  () =>
                    whenClear(() =>
                      jCard({
                        brick: !0,
                        tag: "Prison",
                        iconSrc: "prison/sentence.png",
                        title: "Execution",
                        lead: `Today is your execution date.<br><br>You have been executed by ${t} at ${e.name}.`,
                        ok: () => {
                          (state.prison = null), die(`execution by ${t}`);
                        },
                      }),
                    ),
                  400,
                ));
          }
          if (isOldEra() && !e.death.commuteTried && chance(0.08))
            return (
              (e.death.commuteTried = !0),
              (e.death = null),
              (e.years = Math.max(e.served + 15, 20)),
              say("The governor commuted my death sentence to life at hard labor."),
              void setTimeout(
                () =>
                  whenClear(() =>
                    notice(
                      "Commuted",
                      "The governor has commuted your death sentence. You will spend the rest of your days at hard labor instead.",
                      null,
                      !0,
                    ),
                  ),
                400,
              )
            );
          if (!e.death.postponed && state.age >= e.death.age - 1 && chance(0.25)) {
            const t = rint(1, 4);
            (e.death.age += t),
              (e.death.postponed = !0),
              say(`My execution was postponed by ${yrs(t)}.`),
              setTimeout(
                () =>
                  whenClear(() =>
                    notice(
                      "Postponement",
                      `Your scheduled execution has been postponed by ${yrs(t)}.`,
                      null,
                      !0,
                    ),
                  ),
                400,
              );
          }
          return;
        }
        if (e.served >= e.years)
          return setTimeout(
            () => release(`I was released from ${e.name} after serving ${yrs(e.served)}.`),
            400,
          );
        if (e.served >= Math.ceil(e.years / 2) && e.paroleAt !== state.age && chance(0.4))
          return (e.paroleAt = state.age), setTimeout(() => whenClear(() => paroleBoard(e)), 450);
        if (prisonGift(e)) return;
        const t = (e.evSeen ||= {}),
          a = (window.PRISON_EVENTS || []).filter((t) => !e.juv || t.juv),
          o = [
            ["yard", 1],
            ...a.map((e) => [e.k, 0]),
            ...(e.juv
              ? [
                  ["call", 0],
                  ["bully", 0],
                ]
              : []),
          ].filter(([e, a]) => a || !t[e]);
        if (!chance(0.45) || !o.length) return;
        const [n] = any(o);
        t[n] = state.age;
        const s = a.find((e) => e.k === n);
        return s
          ? setTimeout(() => whenClear(() => prisonEvent(s, e)), 450)
          : "yard" !== n
            ? setTimeout(() => whenClear(() => prisonMoment(n, e)), 450)
            : void setTimeout(
                () =>
                  whenClear(() => {
                    e.inmates ||= yardCrowd();
                    const t = any(e.inmates);
                    jCard({
                      tag: "Prison",
                      brick: !0,
                      person: { name: t.name, look: t.look, g: t.g, age: inmateAge(t), mood: "angry" },
                      iconSrc: "prison/riot.png",
                      title: "Yard Fight",
                      lead: `${t.name} is picking a fight with you in the prison yard!<br><br>What will you do?`,
                      surprise: !0,
                      choices: [
                        [
                          "Fight back",
                          () => {
                            if (chance(0.5 + (state.stats.Health - t.size) / 200))
                              return (
                                (e.respect = clamp(e.respect + rint(6, 12))),
                                say(`${t.name} picked a fight with me. I won.`),
                                notice("Victory", `You beat ${t.name} in the fight!`)
                              );
                            (state.stats.Health = clamp(state.stats.Health - rint(10, 25))),
                              hurt(),
                              renderStats(),
                              say(`${t.name} picked a fight with me and beat me up.`),
                              notice("Defeat", `${t.name} beat you up.`);
                          },
                        ],
                        [
                          "Walk away",
                          () => {
                            (e.respect = clamp(e.respect - rint(3, 8))),
                              say(`I walked away from a fight with ${t.name}.`),
                              notice("Walked away", "You walked away. Some inmates think you are soft.");
                          },
                        ],
                        [
                          "Tell a guard",
                          () => {
                            (e.behavior = clamp(e.behavior + 6)),
                              (e.respect = clamp(e.respect - 12)),
                              say(`I snitched on ${t.name} to a guard.`),
                              notice(
                                "Snitch",
                                `You told a guard about ${t.name}. The other inmates are calling you a snitch.`,
                              );
                          },
                        ],
                      ],
                    });
                  }),
                450,
              );
      });
      const PRISON_GIFTS = [
        "a care package",
        "a stack of books",
        "some homemade cookies",
        "a warm blanket",
        "a photo album",
        "a bag of snacks",
        "some new socks",
        "a crossword puzzle book",
        "a soft pillow",
        "a deck of cards",
        "a family photo",
        "a sketchbook and some pencils",
        "a handwritten letter and some stamps",
        "a box of candy",
      ];
      function prisonGift(e) {
        const t = [
          ...state.parents
            .filter((e) => !e.dead)
            .map((e) => ({
              p: e,
              first: e.first,
              last: SURNAME,
              g: e.gender,
              look: e.look,
              age: e.ageAtBirth + state.age,
              rel: e.role.toLowerCase(),
            })),
          ...state.family
            .filter((e) => !e.dead && /sibling/.test(e.kind || "") && relAge(e) >= 8)
            .map((e) => ({
              p: e,
              first: e.first,
              last: e.last,
              g: e.g,
              look: e.look,
              age: relAge(e),
              rel: relLabel(e).toLowerCase(),
            })),
        ].filter((e) => (e.p.rel ?? 50) >= 25);
        if (!t.length || e.giftAt === state.age || !chance(0.25)) return !1;
        e.giftAt = state.age;
        const a = any(t),
          o = any(PRISON_GIFTS),
          n = `my ${a.rel}, ${a.first}`,
          s = `your ${a.rel}, ${a.first}`,
          r = "f" === a.g ? "She" : "He",
          i = "f" === a.g ? "her" : "him",
          l = (e) => {
            a.p.rel = clamp((a.p.rel ?? 50) + e);
          },
          c = (e, t, a) => {
            say(a), renderStats(), notice(e, t, null, !0);
          },
          d = (t) => {
            if (chance(e.respect < 30 ? 0.25 + (30 - e.respect) / 50 : 0))
              return (
                (state.stats.Happiness = clamp(state.stats.Happiness - rint(5, 10))),
                t && l(rint(3, 6)),
                c(
                  "Confiscated",
                  `The guards confiscated ${o.replace(/^(a|an|some) /, "the ")} from ${s}, at mail call.${t ? `<br><br>You still sent ${i} a thank-you note.` : ""}<br><br>Nobody respects you enough in here to keep it off limits.`,
                  `${capFirst(n)}, sent me ${o} in ${e.juv ? "juvie" : "prison"}, but the guards confiscated it.`,
                )
              );
            (state.stats.Happiness = clamp(state.stats.Happiness + rint(4, 10))),
              l(t ? rint(6, 12) : rint(2, 5)),
              c(
                "Gift",
                `You accepted ${o} from ${s}.${t ? `<br><br>You wrote ${i} a heartfelt thank-you note. ${r} was really touched.` : ""}`,
                `${capFirst(n)}, sent me ${o} in ${e.juv ? "juvie" : "prison"}.${t ? ` I sent ${i} a thank-you note.` : ""}`,
              );
          };
        return (
          setTimeout(
            () =>
              whenClear(() =>
                jCard({
                  tag: e.juv ? "Juvie" : "Prison",
                  brick: !0,
                  person: { name: `${a.first} ${a.last}`, look: a.look, g: a.g, age: a.age },
                  iconSrc: "emoji/1f381.png",
                  title: "Gift",
                  lead: `${capFirst(s)}, sent you ${o}.<br><br>What will you do?`,
                  surprise: !0,
                  choices: [
                    ["Accept it", () => d(!1)],
                    [
                      "Send it back",
                      () => {
                        l(-rint(5, 12)),
                          (state.stats.Happiness = clamp(state.stats.Happiness - rint(0, 2))),
                          c(
                            "Returned",
                            `You sent ${o.replace(/^(a|an|some) /, "the ")} back to ${s}. ${r} was hurt.`,
                            `I sent back ${o} that ${n} mailed me in ${e.juv ? "juvie" : "prison"}.`,
                          );
                      },
                    ],
                    ["Send a thank-you note", () => d(!0)],
                  ],
                }),
              ),
            450,
          ),
          !0
        );
      }
      function prisonMoment(e, t) {
        const a = t.juv ? "juvie" : "prison",
          o = (e, a, o, n) =>
            jCard({
              tag: t.juv ? "Juvie" : "Prison",
              brick: !0,
              iconSrc: LEV + e,
              title: a,
              lead: `${o}<br><br>What will you do?`,
              surprise: !0,
              choices: n,
            }),
          n = (e, t, a) => {
            say(a), renderStats(), notice(e, t, null, !0);
          };
        return "brawl" === e
          ? o(
              "big-brawl.png",
              "Big Brawl",
              `Rival gangs just started a huge brawl in the ${t.juv ? "rec room" : "prison yard"}.`,
              [
                [
                  "Watch",
                  () => {
                    if (chance(0.25))
                      return (
                        (state.stats.Health = clamp(state.stats.Health - rint(4, 10))),
                        hurt(),
                        n(
                          "Caught in it",
                          "You got hit by a flying tray while watching the brawl.",
                          "I got hurt watching a gang brawl.",
                        )
                      );
                    n(
                      "Ringside seat",
                      "You watched the brawl from a safe distance.",
                      `I watched a gang brawl in ${a}.`,
                    );
                  },
                ],
                [
                  "Report it to a guard",
                  () => {
                    (t.behavior = clamp(t.behavior + 6)),
                      (t.respect = clamp(t.respect - 10)),
                      n(
                        "Snitch",
                        "The guards broke up the brawl. Some inmates saw you talking to them.",
                        "I reported a gang brawl to the guards.",
                      );
                  },
                ],
                [
                  "Leave",
                  () =>
                    n(
                      "Walked away",
                      "You slipped away before anyone noticed you.",
                      `I walked away from a gang brawl in ${a}.`,
                    ),
                ],
              ],
            )
          : "fiend" === e
            ? o(
                "fiending.png",
                "Fiending Freakshow",
                `Your ${t.juv ? "roommate" : "cellmate"} is going through withdrawal and acting really disturbing, screaming and clawing at the walls all night.`,
                [
                  [
                    "Cry",
                    () => {
                      (state.stats.Happiness = clamp(state.stats.Happiness - rint(3, 7))),
                        n("Rough night", "You cried yourself to sleep.", `I cried myself to sleep in ${a}.`);
                    },
                  ],
                  [
                    "Help them",
                    () => {
                      (t.respect = clamp(t.respect + 4)),
                        (state.stats.Happiness = clamp(state.stats.Happiness + 2)),
                        n(
                          "Good deed",
                          "You calmed them down and got them some water.",
                          `I helped my ${t.juv ? "roommate" : "cellmate"} through withdrawal.`,
                        );
                    },
                  ],
                  [
                    "Retaliate",
                    () => {
                      (t.respect = clamp(t.respect + 3)),
                        (t.behavior = clamp(t.behavior - 8)),
                        n(
                          "Lights out",
                          "You shoved them back into their bunk. A guard wrote you up.",
                          `I got written up for shoving my ${t.juv ? "roommate" : "cellmate"}.`,
                        );
                    },
                  ],
                ],
              )
            : "call" === e
              ? o("prank-call.png", "Prank Call", "You've been given your weekly phone call.", [
                  [
                    "Prank call someone",
                    () => {
                      if (chance(0.4))
                        return (
                          (t.behavior = clamp(t.behavior - 6)),
                          n(
                            "Busted",
                            "A guard caught you prank calling and took away your phone privileges.",
                            "I got caught making a prank call in juvie.",
                          )
                        );
                      (state.stats.Happiness = clamp(state.stats.Happiness + 4)),
                        n(
                          "Gotcha",
                          "You prank called a pizza place. It was hilarious.",
                          "I made a prank call from juvie.",
                        );
                    },
                  ],
                  [
                    "Report myself missing",
                    () => {
                      (t.behavior = clamp(t.behavior - 10)),
                        n(
                          "Not funny",
                          "The police were not amused. Neither were the guards.",
                          "I called the police and reported myself missing from juvie.",
                        );
                    },
                  ],
                  [
                    "Order food",
                    () => {
                      (state.stats.Happiness = clamp(state.stats.Happiness + 3)),
                        n(
                          "Delivery",
                          "Somehow, a pizza actually showed up.",
                          "I used my phone call to order a pizza to juvie.",
                        );
                    },
                  ],
                ])
              : "bully" === e
                ? o(
                    "breakfast-bully.png",
                    "Breakfast Bully",
                    "A bigger kid in the cafeteria says you have to hand over your breakfast, or else.",
                    [
                      [
                        "Comply",
                        () => {
                          (t.respect = clamp(t.respect - 6)),
                            (state.stats.Happiness = clamp(state.stats.Happiness - 2)),
                            n(
                              "Hungry",
                              "You handed over your breakfast and went hungry.",
                              "I gave my breakfast to a bully in juvie.",
                            );
                        },
                      ],
                      [
                        "Walk away",
                        () => {
                          if (chance(0.35))
                            return (
                              (state.stats.Health = clamp(state.stats.Health - rint(3, 8))),
                              hurt(),
                              n(
                                "Jumped",
                                "The bully jumped you when you walked away.",
                                "A bully jumped me in the juvie cafeteria.",
                              )
                            );
                          (t.respect = clamp(t.respect + 3)),
                            n(
                              "Stood your ground",
                              "You walked away, and the bully left you alone.",
                              "I walked away from a bully in the juvie cafeteria.",
                            );
                        },
                      ],
                    ],
                  )
                : void 0;
      }
      const HACK_RANDOM = [
          ["A random club promoter", 300, 6e3],
          ["A random pimp", 500, 9e3],
          ["A random porn star", 1e3, 15e3],
          ["A random venture capitalist", 5e3, 6e4],
          ["A random drug dealer", 800, 12e3],
          ["A random lawyer", 2e3, 25e3],
          ["A random celebrity", 1e4, 9e4],
        ],
        HACK_COLORS = ["#eb4333", "#37a557", "#4186f5", "#fabd05"],
        hackSnd = (e) => {
          new Audio(`hack/${e}.wav`).play().catch(() => {});
        },
        hackImg = {};
      ["bend", "border", "circle", "cell", "line", "small", "tutorial"].forEach((e) => {
        (hackImg[e] = new Image()), (hackImg[e].src = `hack/${e}.png`);
      });
      const tintCache = {};
      function tinted(e, t) {
        const a = e + t;
        if (tintCache[a]) return tintCache[a];
        const o = hackImg[e],
          n = document.createElement("canvas");
        (n.width = o.naturalWidth), (n.height = o.naturalHeight);
        const s = n.getContext("2d");
        return (
          s.drawImage(o, 0, 0),
          (s.globalCompositeOperation = "source-in"),
          (s.fillStyle = t),
          s.fillRect(0, 0, n.width, n.height),
          (tintCache[a] = n)
        );
      }
