      function openTimeMachine(e) {
        const t = tmOptions();
        if (!t.length && !e && !state.dead && window.blLoadSnaps)
          return window.blLoadSnaps().then(() => {
            tmOptions().length && openTimeMachine(!0);
          });
        if (!t.length || state.dead || overlayOpen()) return;
        play("choice");
        let a = t[0];
        const o = document.createElement("div");
        (o.className = "tm-wrap"),
          (o.id = "tmWrap"),
          (o.innerHTML = `\n      <div class="tm-x" id="tmX"><svg viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="tm-panel">\n        <h3><img src="ui/tm-tornado.png" alt=""><span>Time Machine</span></h3>\n        <p>Travel back in time today!</p>\n        ${t.map((e) => `<div class="tm-row" data-n="${e}"><i class="tm-box"></i><span><b>${e} year${e > 1 ? "s" : ""} ago</b> (Age ${state.age - e})</span></div>`).join("")}\n      </div>\n      <button class="tm-go" id="tmGo"><img src="ui/tm-infinity.png" alt=""><span>Do it!</span></button>`),
          document.querySelector(".phone").append(o);
        const n = () =>
          o.querySelectorAll(".tm-row").forEach((e) => e.classList.toggle("on", +e.dataset.n === a));
        o.querySelectorAll(".tm-row").forEach(
          (e) =>
            (e.onclick = () => {
              (a = +e.dataset.n), play("choice"), n();
            }),
        ),
          n(),
          (document.getElementById("tmX").onclick = () => {
            play("dismiss"), o.remove();
          }),
          (document.getElementById("tmGo").onclick = () => {
            o.remove(), timeTravel(state.age - a);
          });
      }
      function timeTravel(e) {
        const t = tmSnaps[e];
        if (!t) return;
        (SND.thunder.currentTime = 0), SND.thunder.play().catch(() => {});
        const a = document.createElement("div");
        (a.className = "tm-strike"),
          (a.innerHTML =
            '<img class="b1" src="ui/tm-lightning1.png" alt=""><img class="b2" src="ui/tm-lightning2.png" alt="">');
        const o = document.querySelector(".phone");
        o.append(a),
          o.classList.remove("tm-shake"),
          o.offsetWidth,
          o.classList.add("tm-shake"),
          setTimeout(() => o.classList.remove("tm-shake"), 1550);
        const n = any([
          "I fell through a wormhole and ended up back in the past!",
          "I found a time machine and traveled back to the past!",
          "I was struck by lightning and woke up in the past!",
          "I stumbled through a glowing portal and came out in the past!",
        ]);
        setTimeout(() => {
          const a = { mod: state.mod, acc: state.acc };
          for (const e of Object.keys(state)) delete state[e];
          Object.assign(state, structuredClone(t.state), a),
            (window.FL_RESTORING = !0),
            setTimeout(() => (window.FL_RESTORING = !1), 800),
            (log.innerHTML = t.log),
            (deathQueue.length = 0),
            (popupQueue.length = 0),
            evWrap.classList.remove("open"),
            document.querySelectorAll(".notice-wrap").forEach((e) => e.remove());
          for (const t in tmSnaps) +t > e && delete tmSnaps[t];
          log.lastElementChild.insertAdjacentHTML("beforeend", `<p>${n}</p>`),
            screen.classList.remove("open"),
            jailUI(),
            (log.scrollTop = log.scrollHeight),
            tmBtn.classList.toggle("off", !tmOptions().length),
            "function" == typeof saveLife && saveLife(),
            window.blSaveSnaps?.();
        }, 900),
          setTimeout(() => a.classList.add("out"), 1700),
          setTimeout(() => a.remove(), 2200);
      }
      function royalFanfare() {
        new Audio(SND.royal.src)
          .play()
          .catch(() =>
            document.addEventListener("pointerdown", () => new Audio(SND.royal.src).play().catch(() => {}), {
              once: !0,
            }),
          );
      }
      (tmBtn.id = "tmBtn"),
        ageBtnEl.addEventListener("click", () => setTimeout(snapLife, 0)),
        document.addEventListener(
          "click",
          (e) => {
            e.target.closest && e.target.closest("#ageBtn") && !state.dead && snapLife();
          },
          !0,
        ),
        tmBtn.addEventListener("click", openTimeMachine),
        (SND.royal = new Audio("sounds/a16_sndRoyalTrumpet.wav"));
      const ROY_PLACES = [
          "Crocker",
          "Hamilton",
          "Ashford",
          "Bexley",
          "Wexford",
          "Kingsbury",
          "Ravenscroft",
          "Thornbury",
          "Aldridge",
          "Belmont",
          "Coldwater",
          "Dunmore",
          "Easton",
          "Fairhaven",
          "Glenmore",
          "Harrowgate",
          "Ivybridge",
          "Lockwood",
          "Marlow",
          "Northcliffe",
          "Oakhurst",
          "Pembroke",
          "Queensbury",
          "Redcliffe",
          "Somerton",
          "Tewkesbury",
          "Umberleigh",
          "Westmoor",
          "Yarmouth",
          "Ellesmere",
          "Brackley",
          "Stanmore",
        ],
        ROY_HONORIFICS = [
          "Your excellency",
          "Your grace",
          "Your highness",
          "Your majesty",
          "Your royal highness",
        ],
        theLand = () => {
          const e = COUNTRIES[state.country][0];
          return /^(United|Netherlands)/.test(e) ? `the ${e}` : e;
        },
        royTitle = (e, t, a) =>
          `${royWord(e, t)} of ${"monarch" === e ? ("gb" === state.country ? "England" : theLand()) : a}`;
      function relName(e, t) {
        return e.royal && !e.dead
          ? `${royWord(e.royal.rank, e.gender || e.g)} ${e.first}`
          : `${e.first} ${t}`;
      }
      function ennoble(e, t, a, o) {
        const n = e.gender || e.g;
        if (((e.royal = { rank: t, title: royTitle(t, n, a) }), (e.look.crown = royCrown(t, n)), o >= 18)) {
          const a = profileOf(e, o);
          (a.money = Math.max(a.money, ROY_RANKS[t].pay * rint(3, 8))), (a.job = "Royalty");
        }
      }
      const sibRank = () => {
        const e = ROY_ORDER[Math.max(0, ROY_ORDER.indexOf(state.royal.rank) - rint(0, 2))];
        return "monarch" === e ? "prince" : e;
      };
      if (PICK && PICK.royal && ROY_RANKS[PICK.royal] && ROYAL_LANDS.includes(state.country)) {
        const ae = PICK.royal,
          oe = ROY_RANKS[ae],
          ne = pickR(ROY_PLACES),
          se = PG(),
          re = `${pickR(ROY_PLACES.filter((e) => e !== ne))} ${"prince" === ae || "duke" === ae ? "Palace" : pickR(["Castle", "Manor", "Hall", "House"])}`;
        state.royal = {
          rank: ae,
          place: ne,
          title: royTitle(ae, se, ne),
          respect: rint(55, 75),
          honorific:
            "prince" === ae ? "Your royal highness" : "duke" === ae ? "Your grace" : "Your excellency",
          acquired: "Birth",
          years: 0,
          salary: Math.round(oe.pay * (0.9 + 0.2 * Math.random())),
          estate: re,
          activeAt: -1,
          lawAt: -1,
          celebAt: -1,
          svcAt: -1,
          svcN: 0,
          abdicated: !1,
        };
        const [ie, le] = state.parents,
          ce = "prince" === ae ? "monarch" : ae;
        ennoble(ie, ce, ne, ie.ageAtBirth),
          ennoble(le, ce, ne, le.ageAtBirth),
          state.family
            .filter((e) => "sibling" === e.kind)
            .forEach((e) => ennoble(e, sibRank(), pickR(ROY_PLACES), Math.max(0, relAge(e)))),
          (state.money += state.royal.salary * rint(2, 4));
        const [de, ue, he, pe, me, fe] =
            "prince" === ae || "duke" === ae
              ? ["house22", "Palace", 15, 80, 28, 40]
              : "earl" === ae || "marquess" === ae
                ? ["house21", "Grand Estate", 6, 25, 14, 22]
                : ["house14", "Victorian Manor", 2.5, 10, 8, 14],
          ge = chance(0.35),
          ye = 1e3 * Math.round((1e6 * (he + Math.random() * (pe - he))) / 1e3),
          be = rint(me, fe);
        state.props.push({
          sprite: ge ? de + "-haunted" : de,
          name: ge ? "Haunted " + ue : ue,
          title: re,
          price: ye,
          royal: !0,
          addr: `${rint(100, 4999)} ${pickR(HOUSE_STREETS)}`,
          br: be,
          ba: be + rint(-2, 3),
          built: rint(150, 700),
          cond: rint(30, 95),
          expense: Math.round(2e-4 * ye),
          mortgage: 0,
          yearsLeft: 0,
        }),
          (state.art.fameOn = !0),
          (state.art.fame = Math.max(state.art.fame, Math.min(100, oe.fame + rint(-3, 3))));
        const ve = log.firstElementChild,
          we = ve.querySelector(".news");
        (we || ve).insertAdjacentHTML(
          we ? "beforebegin" : "beforeend",
          `<p>I was born into royalty as the ${state.royal.title}.</p><p>My parents are ${relName(ie, SURNAME)} and ${relName(le, SURNAME)}.</p>`,
        ),
          setTimeout(royalFanfare, 700);
      }
      if (PICK && PICK.heir) {
        const ke = PICK.heir;
        if (((state.age = ke.age), (state.birthYear = ke.birthYear), (state.birthInfo = !0), ke.parents)) {
          (state.parents = ke.parents.map((e) => {
            const t = e.diedAgo || 0;
            return {
              first: e.first,
              role: "f" === e.g ? "Mother" : "Father",
              pron: "f" === e.g ? "her" : "him",
              gender: e.g,
              look: { ...randomLook(e.g, 30), ...(e.look || {}) },
              ageAtBirth: e.ageAtBirth,
              rel: e.rel,
              ...(e.prof ? { prof: { ...e.prof } } : {}),
              ...(e.job ? { job: e.job } : {}),
              ...(e.edu ? { edu: e.edu } : {}),
              ...(e.past
                ? { past: e.past, ...(e.past.city ? { city: e.past.city } : {}), job: e.past.job }
                : {}),
              ...(e.dead ? { dead: !0, diedAt: ke.age - t, diedAge: e.ageAtBirth + ke.age - t } : {}),
            };
          })),
            (state.family = state.family.filter(
              (e) =>
                !(e.kind === "child" && e.first === PICK.first && e.last === PICK.last) &&
                !["sibling", "grandparent", "auntuncle", "cousin", "cousinkid", "nibling"].includes(
                  e.kind,
                ),
            ));
          const Se = (e, t) => ({
            kind: e,
            g: t.g,
            first: t.first,
            last: t.last,
            ageOffset: t.age - ke.age,
            look: { ...randomLook(t.g, Math.max(1, t.age)), ...(t.look || {}) },
            rel: t.rel,
            job: t.job || (t.prof && t.prof.job),
            edu: t.edu,
            prof: t.prof ? { ...t.prof } : null,
            ...(t.dead
              ? { dead: !0, diedAt: ke.age - (t.diedAgo || 0), diedAge: t.age - (t.diedAgo || 0) }
              : {}),
          });
          (ke.grand || []).forEach((e) => state.family.push(Se("grandparent", e))),
            (ke.aunts || []).forEach((e) => state.family.push(Se("auntuncle", e))),
            (ke.cousins || []).forEach((e) => state.family.push(Se("cousin", e))),
            (ke.nibs || []).forEach((e) => state.family.push(Se("nibling", e)));
        }
        if (
          (ke.sibs &&
            (state.family = [
              ...state.family.filter((e) => "sibling" !== e.kind),
              ...ke.sibs.map((e) => ({
                kind: "sibling",
                g: e.g,
                first: e.first,
                last: e.last,
                ageOffset: e.off,
                look: e.look,
                rel: e.rel,
                job: e.job || (e.prof && e.prof.job),
                edu: e.edu,
                prof: e.prof ? { ...e.prof } : null,
              })),
            ]),
          ke.spouse)
        ) {
          const xe = ke.spouse,
            Ce = makeLover();
          Object.assign(Ce, {
            first: xe.first,
            last: xe.last,
            g: xe.g,
            gLabel: xe.g,
            ageOffset: xe.age - ke.age,
            look: { ...Ce.look, ...(xe.look || {}) },
            rel: xe.rel,
            job: xe.job || (xe.prof && xe.prof.job),
            edu: xe.edu,
            prof: xe.prof ? { ...xe.prof } : null,
            since: ke.age,
            main: !0,
            intimate: !0,
          }),
            xe.married && ((Ce.married = Ce.wasMarried = !0), (state.spouse = Ce)),
            state.lovers.push(Ce);
        }
        ke.friends &&
          ke.friends.forEach((e) =>
            (state.friends ||= []).push({
              first: e.first,
              last: e.last,
              g: e.g,
              look: e.look,
              ageOffset: e.age - ke.age,
              rel: e.rel,
            }),
          ),
          ke.kids &&
          ke.kids.forEach((e) =>
            state.family.push({
              kind: "child",
              g: e.g,
              first: e.first,
              last: e.last,
              ageOffset: e.age - ke.age,
              look: e.look,
              rel: e.rel,
              otherParent: e.otherParent,
              smarts: null != e.smarts ? e.smarts : rint(10, 100),
              looks: null != e.looks ? e.looks : rint(10, 100),
              job: e.job || (e.prof && e.prof.job),
              edu: e.edu,
              prof: e.prof ? { ...e.prof } : null,
            }),
          );
        const $e = (e, t, a) => {
          e &&
            t &&
            ROY_RANKS[t.rank] &&
            ((e.royal = { rank: t.rank, title: t.title || royTitle(t.rank, a, pickR(ROY_PLACES)) }),
            ((e.look ||= {}).crown = royCrown(t.rank, a)));
        };
        if (
          (ke.parents && ke.parents.forEach((e, t) => $e(state.parents[t], e.royal, e.g)),
          ke.sibs &&
            ke.sibs.forEach((e) =>
              $e(
                state.family.find(
                  (t) => "sibling" === t.kind && t.first === e.first && t.ageOffset === e.off,
                ),
                e.royal,
                e.g,
              ),
            ),
          ke.spouse &&
            ke.spouse.royal &&
            $e(state.lovers[state.lovers.length - 1], ke.spouse.royal, ke.spouse.g),
          ke.kids &&
            ke.kids.forEach((e) =>
              $e(
                state.family.find(
                  (t) => "child" === t.kind && t.first === e.first && t.ageOffset === e.age - ke.age,
                ),
                e.royal,
                e.g,
              ),
            ),
          null != ke.smarts && (state.stats.Smarts = clamp(ke.smarts)),
          null != ke.looks && (state.stats.Looks = clamp(ke.looks)),
          ke.grief && (state.stats.Happiness = clamp(state.stats.Happiness - rint(15, 30))),
          (state.money = ke.money || 0),
          ke.ore && (state.ore = ke.ore),
          ke.claims && (mineSt().caves = ke.claims),
          ke.homes && state.props.push(...ke.homes),
          ke.farm && (state.farm = ke.farm),
          ke.metals && (state.metals = ke.metals),
          ke.biz && (state.biz = ke.biz),
          ke.patents &&
            (state.invent = {
              shop: !1,
              fame: 0,
              work: {},
              patents: ke.patents,
              done: ke.patents.map((e) => e.id),
            }),
          ke.alcParent)
        ) {
          const Ie = state.parents.find((e) => e.first === ke.alcParent);
          Ie && (Ie.conds = [{ id: "addiction", par: [], general: !1 }]);
        }
        if (ke.royal && ROY_RANKS[ke.royal.rank]) {
          const Te = ke.royal.rank,
            Ae = ROY_RANKS[Te],
            Me = PG(),
            Le = (ke.royal.title || "").split(" of ").slice(1).join(" of ") || pickR(ROY_PLACES);
          (state.royal = {
            rank: Te,
            place: Le,
            title: ke.royal.title || royTitle(Te, Me, Le),
            respect: rint(55, 75),
            honorific:
              "monarch" === Te
                ? "Your majesty"
                : "prince" === Te
                  ? "Your royal highness"
                  : "duke" === Te
                    ? "Your grace"
                    : "Your excellency",
            acquired: "Birth",
            years: 0,
            salary: Math.round(Ae.pay * (0.9 + 0.2 * Math.random())),
            estate: `${pickR(ROY_PLACES.filter((e) => e !== Le))} ${pickR(["Castle", "Manor", "Hall", "House", "Palace"])}`,
            activeAt: -1,
            lawAt: -1,
            celebAt: -1,
            svcAt: -1,
            svcN: 0,
            abdicated: !1,
          }),
            (state.art.fameOn = !0),
            (state.art.fame = Math.min(100, Math.max(state.art.fame || 0, Ae.fame)));
        }
        if (
          (ke.acc &&
            (state.acc = {
              ...state.acc,
              ...Object.fromEntries(Object.entries(ke.acc).filter(([, e]) => e)),
            }),
          ke.faceTat && (state.look.faceTat = ke.faceTat),
          ke.celeb &&
            ke.celeb.level &&
            ((state.art.fameOn = !0),
            (state.art.fame = Math.min(100, Math.max(state.art.fame || 0, ke.celeb.level)))),
          levelFor(state.age) && (state.school = newSchool()),
          (log.innerHTML = `<div class="year"><h3>Age: ${ke.age} years<span class="yr"> (${state.birthYear + ke.age})</span></h3></div>`),
          say(`My name is ${state.first} ${SURNAME}. I am ${ke.age} years old.`),
          (ke.intro || []).forEach(say),
          state.school && say(`I attend ${state.school.name}.`),
          renderStats(),
          renderAvatar(),
          ke.notice)
        ) {
          const Ee = () =>
            document.getElementById("tut")
              ? setTimeout(Ee, 500)
              : notice(ke.notice[0], ke.notice[1], null, !0);
          setTimeout(Ee, 1400);
        }
      }
      {
        const He = (e) => {
            const t = document.getElementById(e);
            return t && !t.classList.contains("out");
          },
          Re = () => {
            if (
              ["introVideo", "splash", "penguin", "tut"].some(He) ||
              phoneEl.classList.contains("bl-locked") ||
              phoneEl.classList.contains("picking") ||
              document.querySelector(".notice-wrap")
            )
              return setTimeout(Re, 400);
            notice(
              "WELCOME TO YOURLIFE!",
              "NaBlooLife is a <b>FREE</b> life simulator with no in-game purchases, made for entertainment and heavily inspired by BitLife. It was recoded from scratch by a single person. NaBlooLife isn't made for profit: it's entirely self-funded by one person.<br><br>NaBlooLife will never charge you for in-game features or show ads. If you'd like to support the project and get your name on the site and in the Discord, click the button below. You may also get early access to features being tested.",
              null,
              !0,
              '<button class="jm-apply ev-btn" id="flSupport" style="margin-top:20px;width:100%">Support NaBlooLife</button>',
            );
            const e = document.getElementById("flSupport");
            e &&
              (e.onclick = (e) => {
                e.stopPropagation(), play("choice");
              });
          };
        !1 && setTimeout(Re, 900);
      }
      function crownMe() {
        const e = state.royal,
          t = PG(),
          a = state.parents
            .filter((e) => e.royal && "monarch" === e.royal.rank)
            .sort((e, t) => (t.diedAt ?? -1) - (e.diedAt ?? -1))[0];
        (e.rank = "monarch"),
          (e.title = royTitle("monarch", t, e.place)),
          (e.acquired = "Inheritance"),
          (e.salary = ROY_RANKS.monarch.pay),
          (e.years = 0),
          (state.art.fameOn = !0),
          (state.art.fame = Math.max(state.art.fame, ROY_RANKS.monarch.fame));
        const o = a ? ("Mother" === a.role ? "mother" : "father") : "parent";
        say(`I succeeded my ${o} and became the ${e.title}.`),
          renderAvatar(),
          queuePopup(() => {
            royalFanfare(),
              jCard({
                tag: "You",
                person: { name: e.title, look: state.look, g: t, age: state.age },
                iconSrc: "royal/monarch.png",
                title: "Royal Succession",
                lead: `You have succeeded your ${o} and become the ${e.title}.`,
                rows: [
                  ["Coronation Viewers", (1e6 * rint(8, 60) + 500 * rint(0, 999)).toLocaleString("en-US")],
                ],
                ok: () => {
                  achSeen.has("Monarch") ||
                    setTimeout(() => showAchievement("Monarch", "Become a monarch"), 400);
                },
              });
          });
      }
      ageBtnEl.addEventListener("click", () => {
        const e = state.royal;
        if (!e || e.abdicated || state.dead) return;
        e.years++,
          (state.money += e.salary),
          state.age > 7 && e.activeAt < state.age - 1 && (e.respect = clamp(e.respect - rint(1, 3))),
          state.family
            .filter((e) => "sibling" === e.kind && !e.royal && !e.dead)
            .forEach((e) => ennoble(e, sibRank(), pickR(ROY_PLACES), Math.max(0, relAge(e)))),
          e.trust === state.age - 1 && chance(0.5) && royRespect(rint(1, 3)),
          (e.lowYears = "monarch" === e.rank && e.respect <= 3 ? (e.lowYears || 0) + 1 : 0);
        const t = (e.executions || 0) + (e.defiance || 0),
          a =
            "monarch" === e.rank &&
            ((0 === e.respect && e.lowYears >= 2) ||
              (t >= 3 && e.respect <= 3 * t && chance(Math.min(0.6, 0.1 * t))));
        "prince" !== e.rank || state.parents.some((e) => e.royal && "monarch" === e.royal.rank && !e.dead)
          ? a
            ? queuePopup(royalRevolt)
            : e.backlash === state.age - 1 && chance(Math.min(0.85, 0.4 + 0.1 * (e.defiance || 0)))
              ? queuePopup(() => royalOutrage(e.backlashFor || "denouncing your critics"))
              : state.age >= 6 && state.age <= 18 && state.school && !state.school.college && chance(0.2)
                ? queuePopup(royalClassmate)
                : state.age >= 10 && chance(0.25)
                  ? queuePopup(royalNews)
                  : state.age >= 10 && chance(0.18)
                    ? queuePopup(royalPraise)
                    : state.age >= 12 && chance(0.15) && queuePopup(royalHonorificSlip)
          : crownMe(),
          renderStats(),
          renderAvatar();
      });
      const _rsRich = renderStats;
      renderStats = function () {
        if ((_rsRich(), !lifeLive || state.dead || achSeen.has("Rich"))) return;
        state.money + (state.props || []).reduce((e, t) => e + (t.price || 0), 0) >= 2e7 &&
          setTimeout(() => {
            achSeen.has("Rich") || showAchievement("Rich", "Achieve a net worth of $20m");
          }, 700);
      };
      const ROY_ACTS = [
          ["abdicate", "royal/abdicate.png", "Abdicate", "Relinquish your title", 18],
          ["celebrity", "royal/celebrity.png", "Celebrity", "Mingle with the stars", 13],
          ["execute", "royal/execute.png", "Execute", "Have someone executed", 18],
          ["honorific", "royal/honorific.png", "Honorific", "Choose how to be addressed", 7],
          ["law", "royal/law.png", "Law Review", "Support a new law", 7],
          ["shoot", "royal/photoshoot.png", "Photo Shoot", "Pose for a magazine", 18],
          ["disservice", "royal/disservice.png", "Public Disservice", "Cause some chaos", 7],
          ["service", "royal/service.png", "Public Service", "Perform royal duties", 7],
          ["talk", "royal/talkshow.png", "Talk Show", "Appear on a talk show", 16],
          ["book", "royal/book.png", "Write a Book", "Become a royal author", 16],
        ],
        ROY_MOVIES = [
          "Attack of the Killer Tomatoes",
          "The Room",
          "Sharknado",
          "Cats",
          "Plan 9 from Outer Space",
          "Battlefield Earth",
          "Gigli",
          "The Love Guru",
        ],
        ROY_LAWS = [
          ["Protect Bigfoot from being killed if he is ever discovered", "s", "normal"],
          ["Ban editing job application photos with Photoshop", "s", "normal"],
          ["Require airline passengers to applaud every safe landing", "s", "minor"],
          ["Ban parents from giving their children unusual or ridiculous names", "d", "normal"],
          ["Require government permission before reincarnating", "d", "normal"],
          ["Ban camouflage-patterned clothing", "d", "minor"],
          ["Require criminals to notify the police 24 hours before committing a crime", "d", "normal"],
          ["Ban profanity among children younger than eight", "d", "normal"],
          ["Tax children's lemonade stands", "d", "normal", 1],
          ["Ban sharing streaming service passwords", "d", "normal"],
          ["Ban certain facial hair on Sundays", "d", "minor"],
          ["Make forgetting an immediate family member's birthday a crime", "d", "normal"],
          ["Require coffee shops to serve only decaf after 8 PM", "d", "normal"],
          ["Limit virtual reality gaming sessions to six consecutive hours", "d", "normal"],
          [
            "Require every citizen to donate at least one body part after death, where possible",
            "d",
            "major",
            1,
          ],
          ["Legalize recreational drugs", "d", "major", 1],
          ["Require adult children to visit their parents every week", "d", "normal"],
          [() => `Ban the movie "${pickR(ROY_MOVIES)}" nationwide`, "d", "normal", 1],
        ],
        royFame = (e) => {
          const t = state.art;
          t && t.fameOn && (t.fame = clamp(t.fame + e));
        },
        ROY_SERVICE = [
          [
            "Good karma",
            "You decreed that all living mothers be honored by all living children no less than once per week.",
          ],
          ["A warm welcome", "You visited a children's hospital and read bedtime stories to the patients."],
          ["Ribbon cutting", "You officially opened a brand new public library."],
          ["Feeding the masses", "You served soup at a homeless shelter for the afternoon."],
          ["Green thumb", "You planted the first tree in a new national forest."],
          ["Royal visit", "You toured a retirement home and shook hands with every resident."],
          ["Good karma", "You donated a royal painting to be auctioned for charity."],
          ["Honoring heroes", "You presented medals to the nation's bravest firefighters."],
          ["A royal decree", "You decreed that every school gets a free ice cream day."],
          ["Patron saint", "You became the royal patron of an animal rescue charity."],
          ["Champion of the people", "You gave a moving speech at a veterans' memorial."],
          ["Smile for the cameras", "You christened a new ship at the docks with a bottle of champagne."],
        ],
        ROY_CHAOS = [
          [
            "You officially cut the ribbon at a sperm bank's grand opening, helping it get off to an explosive start. So many people came!",
            "cutting the ribbon at a new sperm bank's grand opening",
          ],
          [
            "You knighted your pet goldfish in a lavish ceremony paid for by taxpayers.",
            "knighting a goldfish with taxpayer money",
          ],
          [
            "You showed up to a state funeral wearing a clown nose.",
            "wearing a clown nose to a state funeral",
          ],
          [
            "You declared a national holiday for your own hangover.",
            "declaring a national holiday for a hangover",
          ],
          [
            "You rode a horse through a five-star restaurant during dinner service.",
            "riding a horse through a crowded restaurant",
          ],
          [
            "You challenged a foreign ambassador to an arm-wrestling match on live TV.",
            "challenging an ambassador to arm-wrestling on live TV",
          ],
          [
            "You had the palace guards do the macarena for tourists.",
            "making the palace guards dance for tourists",
          ],
          [
            'You sold the crown jewels on an online auction site as a "joke".',
            "listing the crown jewels for sale online",
          ],
          [
            "You replaced the national anthem with a song about yourself for a day.",
            "replacing the national anthem with a song about yourself",
          ],
        ],
        ROY_CELEB_JOBS = [
          "actor",
          "pop star",
          "rapper",
          "supermodel",
          "pro athlete",
          "movie director",
          "TV host",
          "reality star",
          "rock star",
          "YouTuber",
        ],
        ROY_CELEB_OUTINGS = [
          ["go pop off some rounds at a shooting range", "went to a shooting range"],
          ["go yachting off the coast", "went yachting"],
          ["a private screening of their new movie", "went to a private movie screening"],
          ["go skydiving", "went skydiving"],
          ["a charity polo match", "went to a charity polo match"],
          ["play a round of golf", "played a round of golf"],
          ["an exclusive rooftop party", "went to a rooftop party"],
          ["go deep-sea fishing", "went deep-sea fishing"],
          ["a five-star dinner", "had a five-star dinner"],
          ["go to a music festival", "went to a music festival"],
          ["go go-karting", "went go-karting"],
          ["a ski trip in the Alps", "went skiing in the Alps"],
        ];
      function royalNews() {
        const e = state.royal;
        if (!e || e.abdicated || state.dead) return;
        const t = `${state.city || COUNTRIES[state.country][1]} Today`,
          a = person(30, 70),
          o = "m" === a.g ? "him" : "her",
          n = "m" === a.g ? "his" : "her",
          s = pickR([
            `suggests that ${a.full}, author of a bestselling vampire romance series, is your favorite author, and you intend to grant ${o} the nation's highest honor for ${n} contribution to literature`,
            "claims that you secretly sleep in a coffin in the palace basement",
            "suggests that you plan to replace the national anthem with a polka",
            `claims that you were spotted buying ${pickR(["300 rubber ducks", "a lifetime supply of glitter", "a pet alligator", "a gold-plated toilet"])} with taxpayer money`,
            "alleges that you still can't tie your own shoes",
            `suggests that you are secretly engaged to ${a.full}, a reality TV star`,
            "claims that you have the palace corgis taste your food for poison",
            "suggests that you cheated your way through school",
          ]);
        jCard({
          tag: "Royalty",
          iconSrc: "royal/newspaper.png",
          title: t,
          surprise: !0,
          lead: `The ${t} published an outrageous story which ${s}.<br><br>What will you do?`,
          choices: [
            [
              "Find and punish the writer",
              () => {
                royRespect(-rint(1, 3)),
                  say(`I had the writer of a story in the ${t} punished.`),
                  notice(
                    "Lesson learned",
                    "You had the writer of the story thrown in the dungeon for a week.",
                    royRefresh,
                  );
              },
            ],
            ...("monarch" === e.rank
              ? [
                  [
                    "Find and execute the writer",
                    () => {
                      royRespect(-rint(6, 12)),
                        say(`I had the writer of a story in the ${t} executed.`),
                        notice(
                          "Off with their head!",
                          "You had the writer of the story executed. The press is terrified of you now.",
                          () => {
                            royRefresh(), royalExecuted(`a journalist from the ${t}`);
                          },
                        );
                    },
                  ],
                ]
              : []),
            [
              "Ignore it",
              () => {
                royRespect(rint(0, 1)),
                  notice(
                    "Water off a duck's back",
                    "You ignored the story. It was forgotten within a week.",
                    royRefresh,
                  );
              },
            ],
            [
              "Insult the writer",
              () => {
                royRespect(-rint(0, 2)),
                  fx({ Happiness: 2 }, ""),
                  say(`I publicly insulted the writer of a story in the ${t}.`),
                  notice(
                    "Pen is mightier",
                    `You called the writer ${pickR(["a talentless hack", "a gutter rat with a keyboard", "the worst writer in the kingdom"])} in front of the cameras.`,
                    royRefresh,
                  );
              },
            ],
            [
              "Denounce the newspaper",
              () => {
                const e = chance(0.5);
                royRespect(e ? rint(1, 3) : -rint(1, 3)),
                  say(`I publicly denounced the ${t}.`),
                  notice(
                    e ? "Fake news" : "Streisand effect",
                    e
                      ? `The public sided with you against the ${t}.`
                      : `Denouncing the ${t} only made more people read the story.`,
                    royRefresh,
                  );
              },
            ],
          ],
        });
      }
      function snapClose() {
        screen.classList.add("snap"),
          screen.classList.remove("open"),
          screen.offsetWidth,
          screen.classList.remove("snap");
      }
      const royRefresh = snapClose;
      function royalPraise() {
        const e = state.royal;
        if (!e || e.abdicated || state.dead) return;
        const t = chance(0.5) ? "f" : "m",
          a = "f" === t ? "her" : "him",
          o = "f" === t ? "she" : "he",
          n = "f" === t ? "woman" : "man",
          s = royWord(e.rank, PG()).toLowerCase(),
          r = state.art,
          i = (e) => {
            r && r.fameOn && (r.fame = clamp(r.fame + e)), renderStats();
          },
          l = any([
            "While watching a premiere showing at a historic theater",
            "While touring a children's hospital",
            "During a royal parade",
            "While cutting the ribbon at a new bridge",
            "While leaving a state banquet",
            "While waving from the palace balcony",
          ]),
          c = `shouted out that you are the greatest ${s} of all time`;
        jCard({
          tag: "Royalty",
          iconSrc: "found/mouse.png",
          title: "Respect",
          surprise: !0,
          lead: `${l}, a common ${n} ${c}.<br><br>What will you do?`,
          choices: [
            [
              `Compliment ${a}`,
              () => {
                if (chance(0.85))
                  return (
                    royRespect(rint(1, 3)),
                    say(`I complimented a commoner who called me the greatest ${s} of all time.`),
                    notice("Charming", "You complimented the commoner, who nearly fainted.")
                  );
                royRespect(-rint(1, 3)),
                  i(-rint(1, 3)),
                  say("My compliment to a commoner was taken the wrong way."),
                  notice(
                    "Awkward",
                    "Your compliment came out wrong, and the press says you were flirting with a commoner.",
                  );
              },
            ],
            [
              `Punish ${a}`,
              () => {
                royRespect(-rint(4, 8)),
                  i(chance(0.5) ? -rint(1, 4) : rint(1, 3)),
                  say(`I had a commoner punished for calling me the greatest ${s} of all time.`),
                  notice(
                    "Off to the dungeon",
                    "You had the commoner thrown in the dungeon for speaking out of turn.",
                  );
              },
            ],
            [
              `Ignore ${a}`,
              () => {
                chance(0.7)
                  ? say("I ignored a commoner who sang my praises.")
                  : (royRespect(-rint(2, 5)),
                    i(-rint(1, 4)),
                    say("I ignored a commoner who praised me, and the press called me heartless."),
                    notice(
                      "Cold shoulder",
                      "The press caught you ignoring an adoring commoner and called you cold and heartless.",
                    ));
              },
            ],
            [
              `Reward ${a}`,
              () => {
                if (chance(0.7))
                  return (
                    royRespect(rint(2, 5)),
                    i(rint(1, 3)),
                    say(`I rewarded a commoner who ${c.replace("you are", "I am")}.`),
                    notice(
                      "You shall be rewarded",
                      `You rewarded a commoner with ${any(["a giant bear hug", "a bag of gold coins", "a royal knighthood", "a tour of the palace"])} after ${o} ${c}.`,
                    )
                  );
                royRespect(-rint(3, 8)),
                  i(-rint(3, 8)),
                  say("A commoner I rewarded turned out to be a tabloid reporter."),
                  notice(
                    "Played for a fool",
                    "The commoner you rewarded turned out to be a tabloid reporter, and the story made you look like a fool.",
                  );
              },
            ],
          ],
        });
      }
      const royRespect = (e) => {
        state.royal.respect = clamp(state.royal.respect + e);
      };
      function openRoyalty() {
        const e = state.royal;
        if (!e || e.abdicated) return openActivities();
        syncProfile(),
          (sTitle.textContent = "ROYALTY"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities),
          (sList.innerHTML =
            `<div class="row" data-rinfo="1"><img src="${ROY_RANKS[e.rank].ico}"><div class="t"><b>${e.title}</b>${sBar("Respect", e.respect)}</div>${DOTS}</div>\n      <div class="sec">Activities</div>` +
            ROY_ACTS.map(([e, t, a, o, n]) => {
              const s = state.age >= n && !state.prison;
              return `<div class="row${s ? "" : " dis"}"${s ? ` data-ra="${e}"` : ""}><img src="${t}"><div class="t"><b>${a}</b><span>${o}</span></div>${s ? DOTS : ""}</div>`;
            }).join("")),
          (sList.querySelector("[data-rinfo]").onclick = royalInfo),
          sList.querySelectorAll("[data-ra]").forEach((e) => (e.onclick = () => ROY_DO[e.dataset.ra]())),
          (sList.scrollTop = 0),
          screen.classList.add("open");
      }
      function royalInfo() {
        const e = state.royal;
        jCard({
          tag: "You",
          person: { name: e.title, look: state.look, g: PG(), age: state.age },
          iconSrc: ROY_RANKS[e.rank].ico,
          title: e.title,
          close: !0,
          rows: [
            ["Title", e.title],
            ["Country", COUNTRIES[state.country][0]],
            ["Acquired", e.acquired],
            ["Royal Salary", usd(e.salary)],
            ["Years Served", e.years],
            ["Estate", e.estate],
          ],
          bars: [["Respect", e.respect]],
        });
      }
      const ROY_DO = {
          book: () => royalBook(),
          shoot: () => royalMagazine(),
          talk: () => royalTalkShow(),
          honorific() {
            const e = state.royal;
            jCard({
              tag: "Royalty",
              iconSrc: "royal/honorific.png",
              title: "Honorific",
              close: !0,
              lead: `Choose how you want to be addressed today!<div class="roy-pick"><label>Pick your honorific:</label><select id="royHon">${ROY_HONORIFICS.map((t) => `<option${t === e.honorific ? " selected" : ""}>${t}</option>`).join("")}</select></div>`,
              choices: [
                [
                  "That sounds right",
                  () => {
                    const t = (document.getElementById("royHon") || {}).value || e.honorific,
                      a = "Your majesty" === t && "monarch" !== e.rank;
                    (e.honorific = t),
                      a && royRespect(-rint(1, 3)),
                      say(`I asked to be addressed as "${t}".`),
                      notice(
                        a ? "Delusions of grandeur" : "As you wish",
                        a
                          ? `You demanded to be called "${t}". People are rolling their eyes.`
                          : `From now on, everyone will address you as "${t}".`,
                        royRefresh,
                        !0,
                      );
                  },
                ],
              ],
            });
          },
          law() {
            const e = state.royal;
            if (e.lawAt === state.age)
              return notice("Law Review", "You've already weighed in on a proposed law this year.", null, !0);
            const [t, a, o, n] = pickR(ROY_LAWS),
              s = "function" == typeof t ? t() : t,
              r = (t) => {
                e.lawAt = e.activeAt = state.age;
                const r = t === ("s" === a);
                royRespect(
                  "minor" === o
                    ? r
                      ? rint(0, 4)
                      : -rint(0, 6)
                    : r
                      ? rint(3, 10)
                      : "major" === o
                        ? -rint(10, 25)
                        : -rint(5, 15),
                ),
                  !r && n && chance(0.5) && royFame(-rint(2, 8)),
                  renderStats(),
                  royRefresh(),
                  say(
                    `I ${t ? "supported" : "denounced"} a proposed law to ${s[0].toLowerCase() + s.slice(1)}. ${r ? "The public agreed with me." : "The public disagreed with me."}`,
                  );
              };
            jCard({
              tag: "Royalty",
              iconSrc: "royal/law.png",
              title: "Law",
              close: !0,
              lead: `Offer your support for a new law that has been proposed in ${theLand()}.<br><br>What will you do?`,
              rows: [["Proposed Law", s]],
              choices: [
                ["Support it", () => r(!0)],
                ["Denounce it", () => r(!1)],
              ],
            });
          },
          service() {
            const e = state.royal,
              [t, a] = pickR(ROY_SERVICE);
            e.svcAt !== state.age && ((e.svcAt = state.age), (e.svcN = 0)),
              e.svcN++,
              (e.activeAt = state.age),
              royRespect(1 === e.svcN ? rint(2, 4) : e.svcN <= 3 ? rint(0, 2) : 0),
              fx({ Happiness: +rint(1, 4) }, ""),
              say(a.replace(/^You /, "I ").replace(/\byour\b/g, "my")),
              notice(t, a, royRefresh, !0);
          },
          disservice() {
            iosConfirm("Confirm", "Are you sure you want to perform a public disservice?", () => {
              const [e, t] = pickR(ROY_CHAOS);
              royRespect(-rint(3, 8)),
                fx({ Happiness: +rint(2, 6) }, ""),
                say(
                  e
                    .split(". ")[0]
                    .replace(/^You /, "I ")
                    .replace(/\byour\b/g, "my")
                    .replace(/\.?$/, "."),
                ),
                notice(
                  "Watching the world burn",
                  e,
                  () => {
                    royRefresh(), chance(0.65) && queuePopup(() => royalOutrage(t));
                  },
                  !0,
                );
            });
          },
          celebrity() {
            const e = state.royal;
            if (e.celebAt === state.age)
              return notice("Celebrity", "You've already mingled with the stars this year.", null, !0);
            e.celebAt = state.age;
            const t = person(25, 70),
              a = t.full,
              o = "m" === t.g ? "His" : "Her",
              [n, s] = pickR(ROY_CELEB_OUTINGS);
            state.art;
            jCard({
              tag: "Royalty",
              iconSrc: "royal/celebrity.png",
              title: a,
              surprise: !0,
              lead: `${a} invites you to ${n}.<br><br>What will you say?`,
              choices: [
                [
                  "I'd love to",
                  () => {
                    const e = rint(15, 100),
                      t = rint(15, 100);
                    fx({ Happiness: Math.round((e - 40) / 10) }, ""),
                      say(`I ${s} with the ${pickR(ROY_CELEB_JOBS)} ${a}.`),
                      notice(
                        pickR([
                          "No autographs, okay?",
                          "Star-studded",
                          "Paparazzi everywhere",
                          "Living the dream",
                          "Brush with fame",
                        ]),
                        `You ${s} with ${a}.`,
                        royRefresh,
                        !0,
                        `<div class="ev-bars nb">${[
                          ["Your Enjoyment", e],
                          [`${o} Enjoyment`, t],
                        ]
                          .map(
                            ([e, t]) =>
                              `<b>${e}</b><i><u style="width:${Math.max(t, 1)}%;background:${barCol(t)}"></u></i>`,
                          )
                          .join("")}</div>`,
                      );
                  },
                ],
                [
                  "Absolutely not",
                  () => {
                    chance(0.3) && fx({ Happiness: -1 }, ""),
                      say(`I bluntly turned down an invitation from ${a}.`),
                      notice("Hard pass", `You turned down ${a}'s invitation.`, royRefresh, !0);
                  },
                ],
                [
                  "Maybe some other time",
                  () => {
                    notice("Rain check", `You told ${a} you'd love to some other time.`, royRefresh, !0);
                  },
                ],
              ],
            });
          },
          execute() {
            const e = [
              ...state.family
                .filter((e) => !e.dead && famOn(e) && relAge(e) >= 0)
                .map((e) => ({ p: e, name: `${e.first} ${e.last}`, label: relTitle(e).toLowerCase() })),
              ...state.friends.map((e) => ({
                p: e,
                name: `${e.first} ${e.last}`,
                label: "friend",
                friend: !0,
              })),
            ].slice(0, 8);
            if (!e.length)
              return notice("Execute", "There's nobody you can have executed right now.", null, !0);
            jCard({
              tag: "Royalty",
              iconSrc: "royal/execute.png",
              title: "Execute",
              close: !0,
              lead: "Who would you like to have executed?",
              choices: e.map((e) => [
                `${e.name} (${capFirst(e.label)})`,
                () =>
                  iosConfirm("Confirm", `Are you sure you want to have ${e.name} executed?`, () => {
                    e.friend
                      ? state.friends.splice(state.friends.indexOf(e.p), 1)
                      : ((e.p.dead = !0), (e.p.diedAt = state.age), (e.p.diedAge = relAge(e.p))),
                      royRespect(-rint(12, 25)),
                      state.parents.forEach((e) => {
                        e.dead || (e.rel = clamp(e.rel - rint(5, 15)));
                      }),
                      say(`I had my ${e.label}, ${e.name}, executed.`),
                      notice(
                        "Off with their head!",
                        `${e.name} was executed by order of the crown.`,
                        () => {
                          royRefresh(), royalExecuted(`your own ${e.label}, ${e.name},`, !0);
                        },
                        !0,
                      );
                  }),
              ]),
            });
          },
          abdicate() {
            iosConfirm("Confirm", "Are you sure you want to abdicate your title?", () => {
              const e = state.royal;
              say(`I abdicated my title as the ${e.title}.`),
                (e.abdicated = !0),
                (e.respect = 0),
                (e.salary = 0),
                notice(
                  "Abdicated",
                  `You relinquished your title. You are no longer the ${e.title}.`,
                  royRefresh,
                  !0,
                ),
                renderAvatar(),
                renderStats();
            });
          },
        },
        OUTRAGE = {
          base: [
            [2, 6],
            [0, 2],
            [6, 12],
            [1, 4],
          ],
          book: [
            [3, 8],
            [1, 3],
            [10, 20],
            [3, 8],
          ],
          baby: [
            [3, 8],
            [1, 3],
            [10, 20],
            [3, 8],
          ],
          magazine: [
            [5, 10],
            [1, 4],
            [10, 25],
            [4, 10],
          ],
          execution: [
            [3, 10],
            [2, 5],
            [10, 20],
            [5, 12],
          ],
        };
      function royalOutrage(e, t) {
        const a = state.royal;
        if (!a || a.abdicated || state.dead) return;
        const o = rint(25, 85) + ("execution" === t || "magazine" === t ? 10 : 0),
          [n, s, r, i] = OUTRAGE["string" == typeof t ? t : "base"],
          l = "string" == typeof t,
          c = !0 === t;
        jCard({
          tag: "Royalty",
          iconSrc: "emoji/1f92c.png",
          title: "Public Outrage",
          surprise: !0,
          lead: `${l ? e : c ? `The public is denouncing you for ${e}.` : `Journalists across the country have spoken out about you for ${e}.`}<br><br>What will you do?`,
          bars: [["Their Anger", Math.min(100, o), "#b3261e"]],
          choices: [
            [
              l || c ? "Apologize" : "Apologize for my actions",
              () => {
                const e = chance(o < 50 ? 0.65 : 0.35),
                  t = rint(...n);
                royRespect(-(e ? Math.ceil(t / 2) : t)),
                  royFame(-rint(...s)),
                  renderStats(),
                  e
                    ? ((a.trust = state.age),
                      say("I publicly apologized, and the public began to forgive me."),
                      notice(
                        "Apology accepted",
                        "The public accepted your apology, but some damage has been done.",
                        royRefresh,
                        !0,
                      ))
                    : (say("I publicly apologized, but nobody bought it."),
                      notice("Too little, too late", "Nobody believed your apology.", royRefresh, !0));
              },
            ],
            [
              "Denounce the criticism",
              () => {
                royRespect(-rint(...r)),
                  royFame(-rint(...i)),
                  fx({ Happiness: 2 }, ""),
                  (a.defiance = (a.defiance || 0) + 1),
                  (o >= 45 || a.defiance >= 3) &&
                    ((a.backlash = state.age),
                    (a.backlashFor = "denouncing the people who criticized you" + (l ? "" : ` for ${e}`))),
                  say("I publicly denounced my critics."),
                  notice(
                    "Nobody asked what you thought",
                    "You publicly denounced your critics. The public is angrier than ever.",
                    royRefresh,
                    !0,
                  );
              },
            ],
          ],
        });
      }
      const ROY_BOOKS = {
          memoir: [
            "Behind the Palace Doors",
            "Crowned and Confused",
            "My Royal Life",
            "The Spare Heir",
            "Tiaras and Tears",
            "Off With Their Heads",
          ],
          kids: [
            "The Little Corgi Who Wanted a Crown",
            "Princess Pickle Goes to School",
            "The Royal Bedtime Book",
            "Teddy Bears at the Palace",
          ],
          cook: ["Fit for a King", "The Palace Kitchen", "Royal Roasts", "Tea Time at the Castle"],
        },
        royPay = (e, t) =>
          1e3 * Math.round((rint(e, t) * (1 + (state.art.fameOn ? state.art.fame : 0) / 50)) / 1e3),
        once = (e, t) => {
          const a = state.royal;
          return a[e] === state.age
            ? (notice(t, "You've already done that this year.", null, !0), !1)
            : ((a[e] = state.age), (a.activeAt = state.age), !0);
        };
      function royalBook() {
        state.royal;
        if (!once("bookAt", "Write a Book")) return;
        const e = (e, t, a) => {
          const o = pickR(ROY_BOOKS[e]),
            n = royPay(t, a),
            s = "memoir" === e ? "tell-all memoir" : "kids" === e ? "children's book" : "cookbook";
          (state.money += n),
            royFame("memoir" === e ? rint(3, 6) : rint(1, 2)),
            "kids" === e && royRespect(rint(1, 3)),
            renderStats(),
            say(`I published a ${s}, "${o}", and earned ${usd(n)}.`);
          const r = "memoir" === e && chance(0.8);
          notice(
            "memoir" === e ? "Bestseller" : "Published",
            `Your ${s}, "${o}", was published and earned you ${usd(n)}.`,
            () => {
              royRefresh(),
                r &&
                  queuePopup(() =>
                    royalOutrage(
                      `Journalists across the country have condemned you for profiting from your royal celebrity with your new book, "${o}".`,
                      "book",
                    ),
                  );
            },
            !0,
          );
        };
        jCard({
          tag: "Royalty",
          iconSrc: "royal/book.png",
          title: "Write a Book",
          close: !0,
          lead: "Publishers are lining up to sign a royal author.<br><br>What kind of book will you write?",
          choices: [
            ["A tell-all memoir", () => e("memoir", 2e5, 2e6)],
            ["A children's book", () => e("kids", 2e4, 15e4)],
            ["A royal cookbook", () => e("cook", 3e4, 25e4)],
          ],
        });
      }
      const ROY_MAGS = ["Playboy", "Vanity Fair", "Rolling Stone", "GQ", "Esquire", "Vogue", "Tatler"];
      function royalMagazine() {
        if (!once("shootAt", "Photo Shoot")) return;
        const e = pickR(ROY_MAGS.filter((e) => "Playboy" !== e)),
          t = pickR(["Playboy", e]),
          a = (a) => {
            const o = royPay(...("nude" === a ? [1e5, 15e5] : "swim" === a ? [4e4, 4e5] : [1e4, 12e4])),
              n = "nude" === a ? t : e;
            (state.money += o),
              royFame("nude" === a ? rint(4, 9) : "swim" === a ? rint(2, 5) : rint(1, 3)),
              "classy" === a && royRespect(rint(0, 2)),
              renderStats();
            const s =
              "nude" === a
                ? "a nude photo shoot"
                : "swim" === a
                  ? "a swimsuit photo shoot"
                  : "a royal portrait";
            say(`I posed for ${s} in ${n} and was paid ${usd(o)}.`);
            const r = "nude" === a || ("swim" === a && chance(0.25));
            notice(
              "Cover star",
              `You posed for ${s} in ${n} and were paid ${usd(o)}.`,
              () => {
                royRefresh(),
                  r &&
                    queuePopup(() =>
                      royalOutrage(
                        "nude" === a
                          ? `The public is outraged that a member of the royal family posed nude in ${n}.`
                          : `The public thinks your swimsuit shoot in ${n} was beneath a member of the royal family.`,
                        "magazine",
                      ),
                    );
              },
              !0,
            );
          };
        jCard({
          tag: "Royalty",
          iconSrc: "royal/photoshoot.png",
          title: "Photo Shoot",
          close: !0,
          lead: `${e} wants you for a photo shoot.<br><br>What kind of shoot will you do?`,
          choices: [
            ["A classy royal portrait", () => a("classy")],
            ["A swimsuit shoot", () => a("swim")],
            ["A nude shoot", () => a("nude")],
          ],
        });
      }
      const ROY_SHOWS = [
        "Late Night Live",
        "The Morning Couch",
        "Tonight with Tyler",
        "The Chat Show",
        "Weekend Gossip Hour",
        "Sunday Night Talk",
      ];
      function royalTalkShow() {
        if (!once("talkAt", "Talk Show")) return;
        const e = pickR(ROY_SHOWS);
        jCard({
          tag: "Royalty",
          iconSrc: "royal/talkshow.png",
          title: e,
          close: !0,
          lead: `You've been invited to appear on ${e}.<br><br>What will you talk about?`,
          choices: [
            [
              "Your charity work",
              () => {
                royRespect(rint(1, 3)),
                  royFame(rint(1, 3)),
                  renderStats(),
                  say(`I talked about my charity work on ${e}.`),
                  notice(
                    "Good press",
                    "You talked about your charity work. Viewers loved it.",
                    royRefresh,
                    !0,
                  );
              },
            ],
            [
              "Embarrassing royal stories",
              () => {
                royFame(rint(2, 5)),
                  royRespect(-rint(0, 3)),
                  renderStats(),
                  say(`I told embarrassing royal stories on ${e}.`),
                  notice(
                    "Ratings gold",
                    "You told embarrassing stories about the royal family. The audience howled, but the palace is not amused.",
                    royRefresh,
                    !0,
                  );
              },
            ],
            [
              "Promote your royal agenda",
              () => {
                royFame(rint(1, 3)),
                  renderStats(),
                  say(`I promoted my royal agenda on ${e}.`),
                  notice(
                    "Soapbox",
                    `You used your time on ${e} to push your royal agenda.`,
                    () => {
                      royRefresh(),
                        chance(0.7) &&
                          queuePopup(() => royalOutrage("promoting your royal agenda on a talk show", !0));
                    },
                    !0,
                  );
              },
            ],
          ],
        });
      }
      function royalExecuted(e, t) {
        const a = state.royal;
        a &&
          ((a.executions = (a.executions || 0) + 1),
          (t || chance(0.6)) &&
            queuePopup(() =>
              royalOutrage(
                `The public is horrified that you had ${e} executed${a.executions > 1 ? `. It is the ${["", "", "second", "third", "fourth", "fifth"][a.executions] || `${a.executions}th`} execution you have ordered` : ""}.`,
                "execution",
              ),
            ));
      }
      function royalRevolt() {
        const e = state.royal;
        if (!e || e.abdicated || state.dead || "monarch" !== e.rank) return;
        const t = (1e3 * rint(20, 400)).toLocaleString("en-US"),
          a = theLand(),
          o = (t) => {
            (e.respect = clamp(e.respect + rint(8, 15))),
              (e.lowYears = 0),
              say(t),
              notice(
                "Long live the crown",
                `${t.replace(/^I /, "You ").replace(/\bmy\b/g, "your")}`,
                royRefresh,
                !0,
              );
          },
          n = (t, o) => {
            say(`I was overthrown as the ${e.title}${t ? ` and exiled from ${a}` : ""}.`),
              (e.abdicated = !0),
              (e.deposed = !0),
              (e.exiled = !!t),
              (e.respect = 0),
              (e.salary = 0),
              (state.money = Math.round(state.money * (t ? 0.03 : 0.1))),
              (state.props = state.props.filter((e) => !e.royal)),
              (state.art.fame = clamp(state.art.fame - rint(10, 25))),
              renderAvatar(),
              renderStats(),
              notice(
                t ? "Exiled" : "Overthrown",
                t
                  ? `${o} You were stripped of your title and fortune and sent into exile.`
                  : `${o} You were stripped of your title and most of your fortune.`,
                royRefresh,
                !0,
              );
          },
          s = (e) => {
            say(e),
              notice(
                "Off with your head!",
                e.replace(/^I /, "You ").replace(/\bmy\b/g, "your"),
                () => die("an angry mob"),
                !0,
              );
          };
        jCard({
          tag: "Royalty",
          iconSrc: "emoji/1f451.png",
          title: "Royal Revolt",
          surprise: !0,
          lead: `A crowd of ${t} angry citizens has surrounded the palace. They are demanding that you surrender power immediately.<br><br>What will you do?`,
          bars: [
            ["Respect", e.respect],
            ["Their Anger", rint(80, 100), "#b3261e"],
          ],
          choices: [
            [
              "Apologize",
              () => {
                const e = Math.random();
                return e < 0.35
                  ? o("I apologized to my people from the palace balcony, and the crowd went home.")
                  : e < 0.9
                    ? n(chance(0.4), "Your apology fell on deaf ears.")
                    : void s("I apologized to the mob, but they stormed the palace anyway.");
              },
            ],
            [
              "Insult the people",
              () => {
                const e = Math.random();
                return e < 0.12
                  ? o("I insulted the mob from the balcony, and they were too scared to stay.")
                  : e < 0.55
                    ? n(!0, "Your insults only made the crowd angrier.")
                    : void s("I insulted the angry mob, and they stormed the palace.");
              },
            ],
            [
              "Accept your fate",
              () => {
                if (chance(0.92)) return n(chance(0.5), "You gave up the throne without a fight.");
                s("I surrendered to the mob, but they showed me no mercy.");
              },
            ],
          ],
        });
      }
      function royalHonorificSlip() {
        const e = state.royal;
        if (!e || e.abdicated || state.dead) return;
        const t = person(18, 75),
          a = t.him,
          o = pickR(ROY_HONORIFICS.filter((t) => t !== e.honorific)),
          n = pickR([
            `a waiter named ${t.full}`,
            `a palace guard named ${t.full}`,
            `a reporter named ${t.full}`,
            `a tourist named ${t.full}`,
            `a shopkeeper named ${t.full}`,
            `the mayor, ${t.full}`,
          ]);
        jCard({
          tag: "Royalty",
          iconSrc: "emoji/1f621.png",
          title: "Incorrect Honorific",
          surprise: !0,
          lead: `${pickR(["At a state banquet", "During a ribbon-cutting ceremony", "While touring a local factory", "On a royal walkabout", "At a charity gala"])}, ${n} addressed you as "${o}" instead of "${e.honorific}".<br><br>What will you do?`,
          choices: [
            [
              "Ignore it",
              () => {
                royRespect(rint(0, 2)),
                  say(`I let it slide when someone called me "${o}".`),
                  notice(
                    "Gracious",
                    `You let the mistake slide. ${capFirst(t.he)} was very relieved.`,
                    royRefresh,
                    !0,
                  );
              },
            ],
            [
              `Insult ${a}`,
              () => {
                royRespect(-rint(1, 3)),
                  say(`I insulted ${t.full} for calling me "${o}".`),
                  notice(
                    "Royal tantrum",
                    `You told ${t.full} that ${t.he} ${pickR(["has the manners of a goat", "should go back to school", "is a disgrace to the kingdom"])}.`,
                    royRefresh,
                    !0,
                  );
              },
            ],
            [
              `Have ${a} imprisoned`,
              () => {
                royRespect(-rint(4, 8)),
                  say(`I had ${t.full} imprisoned for calling me "${o}".`),
                  notice(
                    "To the dungeon",
                    `You had ${t.full} thrown in the dungeon for getting your title wrong. People think you're a tyrant.`,
                    royRefresh,
                    !0,
                  );
              },
            ],
            ...("monarch" === e.rank
              ? [
                  [
                    `Have ${a} executed`,
                    () => {
                      royRespect(-rint(10, 18)),
                        say(`I had ${t.full} executed for calling me "${o}".`),
                        notice(
                          "Off with their head!",
                          `${t.full} was executed for getting your title wrong. The whole kingdom is horrified.`,
                          () => {
                            royRefresh(), royalExecuted(`${t.full} for getting your title wrong`, !0);
                          },
                          !0,
                        );
                    },
                  ],
                ]
              : []),
          ],
        });
      }
      function royalClassmate() {
        const e = state.royal;
        if (!e || e.abdicated || state.dead || !state.school) return;
        const t = person(Math.max(5, state.age - 1), state.age + 1),
          a = t.him,
          o = t.he,
          n = royWord(e.rank, PG()).toLowerCase(),
          s = pickR([
            `you are the coolest ${n} in the whole world`,
            `you have the nicest crown ${o} has ever seen`,
            `it must be amazing being a real ${n}`,
            `you are ${"m" === t.g ? "his" : "her"} favorite member of the royal family`,
            "you are way smarter than everyone else in class",
          ]);
        jCard({
          tag: "Classmate",
          person: { name: t.full, look: t.look, g: t.g, age: t.age, mood: "happy" },
          iconSrc: "emoji/1f3eb.png",
          title: "Royal Classmate",
          surprise: !0,
          lead: `Your classmate ${t.full} told you that ${s}.<br><br>What will you do?`,
          choices: [
            [
              `Compliment ${a}`,
              () => {
                royRespect(rint(1, 2)),
                  fx({ Happiness: 2 }, ""),
                  say(`I complimented my classmate ${t.full}.`),
                  notice(
                    "Friendly royal",
                    `You told ${t.full} that ${o} ${pickR(["has great taste", "is very kind", "is the best in class at art"])}. ${capFirst(o)} beamed all day.`,
                    royRefresh,
                    !0,
                  );
              },
            ],
            [
              `Ignore ${a}`,
              () => {
                if (chance(0.6)) return say(`I ignored my classmate ${t.full}.`);
                royRespect(-rint(1, 2)),
                  say(`I ignored my classmate ${t.full}, and the whole school called me stuck-up.`),
                  notice(
                    "Stuck-up",
                    `You ignored ${t.full}. Now the whole school thinks you're stuck-up.`,
                    royRefresh,
                    !0,
                  );
              },
            ],
            [
              `Reward ${a}`,
              () => {
                royRespect(rint(2, 5)),
                  say(
                    `I rewarded my classmate ${t.full} with ${pickR(["a tour of the palace", "a ride in the royal carriage", "a signed royal portrait"])}.`,
                  ),
                  notice(
                    "Royal favor",
                    `You rewarded ${t.full}. ${capFirst(o)} told everyone at school how generous you are.`,
                    royRefresh,
                    !0,
                  );
              },
            ],
            [
              `Punish ${a}`,
              () => {
                royRespect(-rint(3, 6)),
                  fx({ Happiness: 1 }, ""),
                  say(`I had my classmate ${t.full} punished for sucking up to me.`),
                  notice(
                    "Teacher's pet",
                    `You had ${t.full} sent to detention for "flattering the royal family". The other kids are scared of you now.`,
                    royRefresh,
                    !0,
                  );
              },
            ],
          ],
        });
      }
      SND.ghost = new Audio("sounds/a16_sndGhost.wav");
      const isHaunted = (e) => /-haunted$/.test(e.sprite),
        propLabel = (e) => (e.title ? `${e.title} <em>(${e.name})</em>` : e.name);
      function openProperties() {
        syncProfile(),
          (sTitle.textContent = "PROPERTIES"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openAssets),
          (sList.innerHTML =
            '<div class="sec">Owned</div>' +
            (state.props.length
              ? state.props
                  .map(
                    (e, t) =>
                      `<div class="row" data-own="${t}">${houseRowImg(e)}<div class="t"><b>${propLabel(e)}</b><div class="rel">Condition <i><u style="width:${Math.max(2, e.cond)}%;background:${barCol(e.cond)}"></u></i></div></div>${CHEV}</div>`,
                  )
                  .join("")
              : '<div class="row dis"><div class="t"><b>No properties</b><span>You don\'t own any real estate</span></div></div>')),
          sList
            .querySelectorAll("[data-own]")
            .forEach((e) => (e.onclick = () => openPropertyScreen(state.props[+e.dataset.own]))),
          (sList.scrollTop = 0),
          screen.classList.add("open");
      }
      function openPropertyScreen(e) {
        if (!state.props.includes(e)) return openProperties();
        ensureGhosts(e);
        const t = (e, t, a, o, n = DOTS) =>
          `<div class="row" data-pa="${e}"><img src="${t}"><div class="t"><b>${a}</b>${o}</div>${n}</div>`;
        (sTitle.textContent = e.name.toUpperCase()),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openProperties),
          (sList.innerHTML =
            `<div class="row" data-pa="card">${houseRowImg(e)}<div class="t"><b>${e.title || e.name}</b><span>View your ${e.br}br/${e.ba}ba ${e.name.toLowerCase()}</span></div>${DOTS}</div>\n      <div class="sec">Activities</div>` +
            (isPenthouse(e)
              ? t(
                  "amenities",
                  "amenity/amenities.png",
                  "Amenities",
                  "<span>Enjoy your penthouse amenities</span>",
                  CHEV,
                )
              : "") +
            t("party", "ghost/party.png", "Party", "<span>Throw a house party</span>") +
            t("renovate", "ghost/renovate.png", "Renovate", "<span>Undertake a renovation project</span>") +
            (isHaunted(e)
              ? t("spirits", "ghost/ghost.png", "Spirits", sBar("Hauntedness", haunt(e)), CHEV)
              : "") +
            t(
              "sell",
              "pets/ui-sell.png",
              e.forSale ? "For Sale" : "Sell",
              `<span>${e.forSale ? `Listed for ${usd(e.forSale.price)}` : "Put it on the market"}</span>`,
            ));
        const a = {
          card: () => propertyCard(e, !0),
          party: () => houseParty(e),
          renovate: () => renovateCard(e),
          spirits: () => openSpirits(e),
          sell: () => sellHouseCard(e),
          amenities: () => {
            play("choice"), openAmenities(e);
          },
        };
        sList.querySelectorAll("[data-pa]").forEach((e) => (e.onclick = () => a[e.dataset.pa]())),
          (sList.scrollTop = 0),
          screen.classList.add("open");
      }
      const isPenthouse = (e) => /penthouse/i.test(e.name || "") || /^house24\b/.test(e.sprite || ""),
        AMENITIES = [
          [
            "firepit",
            "Fire Pit",
            "Get toasty next to open flames",
            [
              "You roasted marshmallows by the fire pit under the stars.",
              "You sat by the fire pit and watched the flames dance.",
            ],
          ],
          [
            "gym",
            "Gym",
            "Work out in your home gym",
            ["You crushed a workout in your home gym.", "You hit a new personal record on the bench press."],
            { Health: [2, 5] },
          ],
          [
            "patio",
            "Patio",
            "Enjoy the outside on your patio",
            ["You sipped lemonade on your patio and soaked up the view.", "You had brunch out on the patio."],
          ],
          [
            "hottub",
            "Hot Tub",
            "Sit and soak in your hot tub",
            [
              "You soaked in the hot tub until your fingers wrinkled.",
              "You relaxed in the bubbling hot tub.",
            ],
            { Health: [1, 2] },
          ],
          [
            "theater",
            "Home Theater",
            "Watch a movie at home",
            [
              "You watched a blockbuster on the big screen in your home theater.",
              "You had a movie marathon in your home theater.",
            ],
          ],
          [
            "yoga",
            "Yoga Studio",
            "Get zen in your yoga studio",
            [
              "You found your inner peace in your yoga studio.",
              "You held a perfect tree pose for five whole minutes.",
            ],
            { Health: [1, 3] },
          ],
          [
            "pool",
            "Swimming Pool",
            "Take a dip in your swimming pool",
            [
              "You swam laps in your swimming pool.",
              "You floated around your pool on an inflatable flamingo.",
            ],
            { Health: [1, 3] },
          ],
          [
            "studio",
            "Recording Studio",
            "Lay down tracks in your home studio",
            [
              "You laid down a fresh track in your recording studio.",
              "You spent the night freestyling in your home studio.",
            ],
          ],
          [
            "gameroom",
            "Game Room",
            "Challenge friends to your favorite games",
            [
              "You challenged your friends in the game room and won.",
              "You spent hours playing video games in your game room.",
            ],
          ],
          [
            "basketball",
            "Basketball Court",
            "Shoot hoops on your private court",
            ["You shot hoops on your private court.", "You sank a buzzer-beater on your own court."],
            { Health: [1, 3] },
          ],
          [
            "tennis",
            "Tennis Court",
            "Practice your serve at home",
            ["You practiced your serve on your tennis court.", "You aced a friendly match on your court."],
            { Health: [1, 3] },
          ],
          [
            "bowling",
            "Bowling Alley",
            "Roll a strike in your own lane",
            [
              "You rolled a strike in your private bowling alley!",
              "You bowled a few games in your own lane.",
            ],
          ],
          [
            "sauna",
            "Sauna",
            "Unwind in your private sauna",
            ["You sweated out your stress in the sauna.", "You unwound in your private sauna."],
            { Health: [1, 2] },
          ],
          [
            "library",
            "Library",
            "Get lost in a good book",
            [
              "You got lost in a good book in your library.",
              "You read a classic novel cover to cover in your library.",
            ],
            { Smarts: [1, 3] },
          ],
          [
            "wine",
            "Wine Cellar",
            "Store your favorite vintage wines",
            [
              "You uncorked a vintage bottle from your wine cellar.",
              "You added a rare bottle to your wine cellar.",
            ],
          ],
          [
            "rooftop",
            "Rooftop Lounge",
            "Relax above it all",
            [
              "You watched the sunset from your rooftop lounge.",
              "You relaxed above the city lights in your rooftop lounge.",
            ],
          ],
          [
            "greenhouse",
            "Greenhouse",
            "Grow plants all year round",
            [
              "You tended to the plants in your greenhouse.",
              "You harvested fresh tomatoes from your greenhouse.",
            ],
          ],
          [
            "aquarium",
            "Aquarium",
            "Enjoy your own underwater world",
            ["You watched the fish swim around your aquarium.", "You fed the fish in your aquarium."],
          ],
          [
            "spa",
            "Private Spa",
            "Treat yourself to a day of relaxation",
            [
              "You treated yourself to a full day at your private spa.",
              "You got a massage in your private spa.",
            ],
            { Looks: [1, 2] },
          ],
        ];
      function openAmenities(e) {
        if (!state.props.includes(e)) return openProperties();
        (e.amen ||= AMENITIES.map((e) => e[0])), (e.amenUsed ||= {});
        const t = AMENITIES.filter((t) => e.amen.includes(t[0]));
        (sTitle.textContent = "AMENITIES"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => openPropertyScreen(e)),
          (sList.innerHTML =
            (t.length
              ? t
                  .map(
                    ([e, t, a]) =>
                      `<div class="row" data-am="${e}"><img src="amenity/${e}.png"><div class="t"><b>${t}</b><span>${a}</span></div>${DOTS}</div>`,
                  )
                  .join("")
              : '<div class="row dis"><div class="t"><b>No amenities</b><span>You demolished all of your amenities</span></div></div>') +
            (t.length
              ? '<div class="amen-demo" data-demo><img src="amenity/demolish.png" alt=""><span>Demolish Amenity...</span></div>'
              : "")),
          sList.querySelectorAll("[data-am]").forEach(
            (t) =>
              (t.onclick = () => {
                play("choice"),
                  useAmenity(
                    e,
                    AMENITIES.find((e) => e[0] === t.dataset.am),
                  );
              }),
          );
        const a = sList.querySelector("[data-demo]");
        a &&
          (a.onclick = () => {
            play("choice"), demolishCard(e);
          }),
          (sList.scrollTop = 0),
          screen.classList.add("open");
      }
      function useAmenity(e, [t, a, , o, n = {}]) {
        if (e.amenUsed[t] === state.age)
          return notice(
            a,
            `You already enjoyed your ${a.toLowerCase()} this year. Try again next year!`,
            null,
            !0,
          );
        e.amenUsed[t] = state.age;
        const s = rint(4, 10),
          r = rint(55, 100),
          i = { Happiness: s };
        for (const e in n) i[e] = rint(...n[e]);
        fx(i, "");
        const l = any(o);
        say(
          l
            .replace(/^You /, "I ")
            .replace(/\byour\b/g, "my")
            .replace(/\byou\b/g, "I"),
        );
        var c, d;
        notice(
          a,
          l,
          () => openAmenities(e),
          !0,
          `<div class="ev-bars nb">${((c = "Enjoyment"), (d = r), `<b>${c}</b><i><u style="width:${Math.max(3, d)}%;background:${barCol(d)}"></u></i>`)}</div>`,
        );
      }
      function demolishCard(e) {
        const t = AMENITIES.filter((t) => e.amen.includes(t[0]));
        jCard({
          tag: "Property",
          iconSrc: "amenity/demolish.png",
          title: "Demolish Amenity",
          close: () => openAmenities(e),
          lead: `Which amenity do you want to tear out of your ${e.name.toLowerCase()}?`,
          choices: t.map(([t, a]) => [
            a,
            () =>
              iosConfirm(
                "Demolish",
                `Are you sure you want to demolish your ${a.toLowerCase()}? This can't be undone.`,
                () => {
                  e.amen = e.amen.filter((e) => e !== t);
                  new Audio("sounds/a16_sndAmenityRenovation.wav").play().catch(() => {}),
                    say(`I demolished the ${a.toLowerCase()} in my ${e.name.toLowerCase()}.`),
                    notice(
                      "Demolished",
                      `You demolished the ${a.toLowerCase()} in your ${e.name.toLowerCase()}.`,
                      () => openAmenities(e),
                      !0,
                    );
                },
              ),
          ]),
        });
      }
      const OLD_HOUSE_BUYERS = [
          "a retired sea captain",
          "a young farming couple",
          "a railroad man",
          "a widow with five children",
          "a wealthy merchant",
          "a schoolteacher",
          "a banker",
          "a blacksmith",
          "a newlywed couple",
          "a gold rush millionaire",
          "an immigrant family",
          "a country doctor",
          "a cattle baron",
          "a riverboat gambler",
          "a parson and his family",
          "a mill owner",
          "a land speculator",
          "a retired colonel",
        ],
        houseBuyer = () => pickR(isOldEra() ? OLD_HOUSE_BUYERS : HOUSE_BUYERS),
        HOUSE_BUYERS = [
          "a crypto trader",
          "a retired old man",
          "a mafia boss",
          "a family of 5",
          "a young couple",
          "a famous rapper",
          "a tech startup founder",
          "a divorced dentist",
          "a pro wrestler",
          "a widow and her 3 cats",
          "a real estate flipper",
          "a professional poker player",
          "a soap opera actress",
          "a newlywed couple",
          "an eccentric billionaire",
          "a retired NFL player",
          "a group of college roommates",
          "a heavy metal drummer",
          "a nervous first-time buyer",
          "a TikTok influencer",
          "a doomsday prepper",
          "a family of 8",
          "a Hollywood stuntman",
          "a mysterious woman who paid in cash",
          "a retired schoolteacher",
          "a reality TV star",
          "a single dad of twins",
          "a foreign prince",
          "a lottery winner",
          "a cult leader",
          "a surgeon",
          "a pastor and his family",
        ],
        homeValue = (e) => Math.round(e.price * (0.8 + e.cond / 250)),
        homeOwe = (e) => (e.yearsLeft ? Math.round(((e.loan || 0.8 * e.price) * e.yearsLeft) / 30) : 0),
        saleOdds = (e, t) => {
          const a = t / homeValue(e),
            o = 0.25 + (0.75 * Math.min(100, e.cond)) / 100;
          return Math.max(0.03, Math.min(0.92, (1.55 - a) * o * (isHaunted(e) ? 0.6 : 1)));
        };
      function soldHome(e, t, a) {
        const o = homeOwe(e),
          n = Math.max(0, t - o),
          s = state.props.indexOf(e);
        s < 0 ||
          (state.props.splice(s, 1),
          (e.forSale = null),
          (state.money += n),
          renderStats(),
          chaChing(),
          say(`I sold my ${e.name.toLowerCase()} at ${e.addr} to ${a} for ${usd(t)}.`),
          notice(
            "Sold!",
            `You sold your ${e.name.toLowerCase()} at ${e.addr} to ${a} for ${usd(t)}!${o ? `<br><br>${usd(o)} went to paying off the mortgage.` : ""}`,
            null,
            !0,
          ));
      }
      function sellHouseCard(e) {
        if (e.forSale)
          return iosConfirm(
            "For Sale",
            `Your ${e.name.toLowerCase()} is listed for ${usd(e.forSale.price)}. Take it off the market?`,
            () => {
              (e.forSale = null),
                say(`I took my ${e.name.toLowerCase()} off the market.`),
                openPropertyScreen(e);
            },
          );
        const t = homeValue(e),
          a = homeOwe(e),
          o = [0.8, 0.9, 1, 1.1, 1.2, 1.35, 1.5, 1.75].map((e) => hRound(t * e));
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div>\n      <div class="jm-tag" style="margin-top:12px">Property</div>\n      <h4><img src="houses/${e.sprite}.png" alt=""><span>${e.addr}</span></h4>\n      <div class="lead">Sell your ${e.br}br/${e.ba}ba ${e.name.toLowerCase()} today!</div>\n      <table><tbody><tr><td><b>Type:</b> ${e.name}</td></tr><tr><td><b>Purchase Price:</b> ${usd(e.paid || e.price)}</td></tr>\n        <tr><td><b>Estimated Value:</b> ${usd(t)}</td></tr>${a ? `<tr><td><b>Mortgage Owed:</b> ${usd(a)}</td></tr>` : ""}</tbody></table>\n      <div class="ev-bars"><b>Condition</b><i><u style="width:${Math.max(2, e.cond)}%;background:${barCol(e.cond)}"></u></i></div>\n      <label class="hr-lab">Pick your asking price:</label><div class="hr-sel"><select id="hsSel">${o.map((e, t) => `<option value="${t}"${2 === t ? " selected" : ""}>${usd(e)}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="hsGo">List it for sale</button>`);
        const n = () => evWrap.classList.remove("open");
        (document.getElementById("propX").onclick = n),
          (document.getElementById("hsGo").onclick = () => {
            const t = o[+document.getElementById("hsSel").value];
            if (
              (n(),
              (e.forSale = { price: t, since: state.age }),
              say(`I listed my ${e.name.toLowerCase()} at ${e.addr} for ${usd(t)}.`),
              chance(0.45 * saleOdds(e, t)))
            )
              return screen.classList.remove("open"), soldHome(e, t, houseBuyer());
            notice(
              "Listed",
              `You listed your ${e.name.toLowerCase()} for ${usd(t)}.<br><br>You'll hear from your realtor when a buyer comes along.`,
              () => openPropertyScreen(e),
              !0,
            );
          }),
          evWrap.classList.add("open");
      }
      function houseParty(e) {
        const t = () => openPropertyScreen(e),
          a = e.name.toLowerCase();
        if (state.age < 16) return notice("Too young", "You're too young to throw a house party.", null, !0);
        if (e.partyAt === state.age)
          return notice("Party", `You already threw a party at your ${a} this year.`, null, !0);
        const o = isOldEra()
          ? eraCash(0.2 * rint(5, 20) * Math.max(1, e.br / 3))
          : Math.round(100 * rint(5, 20) * Math.max(1, e.br / 3));
        if (state.money < o)
          return notice("Flat broke", "You can't afford to throw a party right now.", null, !0, brokeRows(o));
        (e.partyAt = state.age), (state.money -= o);
        const n = ensureGhosts(e).filter((e) => e.active > 40);
        if (n.length && chance(0.35)) {
          const e = any(n);
          return (
            fx({ Happiness: -rint(2, 6) }, ""),
            say(`${e.name} haunted my house party and scared everyone away.`),
            notice(
              "Uninvited guest",
              `${e.name} crashed your party at your ${a}, and your guests ran out screaming!`,
              t,
              !0,
            )
          );
        }
        if (chance(0.75)) {
          const o = rint(12, 40 + 6 * e.br);
          return (
            fx({ Happiness: +rint(4, 10) }, ""),
            state.friends.forEach((e) => (e.rel = clamp(e.rel + rint(1, 5)))),
            say(`I threw a party at my ${a}. ${o} people came!`),
            notice(
              pickR(["Party animal", "Raging success", "What a night"]),
              `You threw a party at your ${a}. ${o} people showed up and had a blast!`,
              t,
              !0,
            )
          );
        }
        fx({ Happiness: -rint(1, 4) }, ""),
          say(`I threw a party at my ${a}, but hardly anyone came.`),
          notice("Party pooper", `You threw a party at your ${a}, but hardly anyone showed up.`, t, !0);
      }
      function renovateCard(e) {
        if (state.age < 18)
          return notice("Too young", "You must be at least 18 to renovate a property.", null, !0);
        const t = Math.round(e.price * (0.8 + e.cond / 250)),
          a = hRound,
          o = [0.0326, 0.0978, 0.163, 0.228, 0.326].map((e) => a(t * e));
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div>\n      <div class="jm-tag" style="margin-top:12px">Property</div>\n      <h4><img src="houses/${e.sprite}.png" alt=""><span>${e.addr}</span></h4>\n      <div class="lead">Renovate your ${e.name.toLowerCase()} today!</div>\n      <table><tbody><tr><td><b>Type:</b> ${e.name}</td></tr><tr><td><b>Size:</b> ${e.br}br/${e.ba}ba</td></tr><tr><td><b>Age:</b> ${e.built} Years</td></tr>\n        <tr><td><b>Estimated Value:</b> ${usd(t)}</td></tr></tbody></table>\n      <div class="ev-bars"><b>Condition</b><i><u style="width:${Math.max(2, e.cond)}%;background:${barCol(e.cond)}"></u></i></div>\n      <label class="hr-lab">Pick your budget:</label><div class="hr-sel"><select id="renoSel">${o.map((e, t) => `<option value="${t}">${usd(e)}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="renoGo">Renovate it</button>`),
          (ev.style.overflow = "visible");
        const n = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = () => {
          play("dismiss"), n();
        }),
          (document.getElementById("renoGo").onclick = () => {
            const t = +document.getElementById("renoSel").value,
              a = o[t];
            if ((n(), state.money < a))
              return notice("Flat broke", `You can't afford a ${usd(a)} renovation.`, null, !0, brokeRows(a));
            (state.money -= a), renderStats();
            const [s, r] = [
                [4, 10],
                [8, 18],
                [14, 28],
                [22, 38],
                [32, 55],
              ][t],
              i = e.cond;
            (e.cond = Math.min(100, e.cond + rint(s, r))),
              say(`I spent ${usd(a)} renovating my ${e.name.toLowerCase()}.`),
              notice(
                e.cond >= 95 ? "Good as new" : "Renovated",
                `Your renovation of your ${e.name.toLowerCase()} is complete. Its condition went from ${i}% to ${e.cond}%.`,
                () => openPropertyScreen(e),
                !0,
              );
          }),
          evWrap.classList.add("open");
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (!state.dead) {
          for (const e of state.props)
            e.paid || (e.paid = e.price),
              (e.price = e.old
                ? oldHomeGrow(e)
                : hRound(e.price * (chance(0.85) ? 1.01 + 0.06 * Math.random() : 1 - 0.04 * Math.random())) ||
                  e.price),
              (e.expense = e.old ? cents(Math.max(0.01, 8e-4 * e.price)) : Math.round(9e-4 * e.price));
          if (!state.prison)
            for (const e of state.props.filter((e) => e.forSale)) {
              const t = e.forSale,
                a = state.age - t.since,
                o = Math.min(0.95, saleOdds(e, t.price) + 0.05 * a),
                n = houseBuyer();
              if (chance(o)) queuePopup(() => soldHome(e, t.price, n));
              else if (chance(0.45)) {
                const o = 0.7 + 0.22 * Math.random();
                queuePopup(() => {
                  if (!state.props.includes(e) || e.forSale !== t) return;
                  const s = isOldEra()
                    ? hRound(t.price * o)
                    : Math.max(1e3, 1e3 * Math.round((t.price * o) / 1e3));
                  jCard({
                    tag: "Property",
                    iconSrc: `houses/${e.sprite}.png`,
                    title: "Offer",
                    surprise: !0,
                    lead: `${n[0].toUpperCase() + n.slice(1)} has offered you ${usd(s)} for your ${e.name.toLowerCase()} at ${e.addr}.<br><br>What will you do?`,
                    rows: [
                      ["Offer", usd(s)],
                      ["Asking Price", usd(t.price)],
                      ["Time on Market", `${a} Year${1 === a ? "" : "s"}`],
                    ],
                    choices: [
                      ["Accept the offer", () => soldHome(e, s, n)],
                      [
                        `Counter at ${usd(t.price)}`,
                        () => {
                          if (chance(Math.max(0.12, 0.55 - (t.price / homeValue(e) - 1))))
                            return soldHome(e, t.price, n);
                          say(
                            `I countered ${n}'s offer on my ${e.name.toLowerCase()}, and they walked away.`,
                          ),
                            notice(
                              "No deal",
                              `${n[0].toUpperCase() + n.slice(1)} walked away from the deal.`,
                              null,
                              !0,
                            );
                        },
                      ],
                      [
                        "Reject it",
                        () => say(`I rejected an offer of ${usd(s)} for my ${e.name.toLowerCase()}.`),
                      ],
                      [
                        "Take it off the market",
                        () => {
                          (e.forSale = null), say(`I took my ${e.name.toLowerCase()} off the market.`);
                        },
                      ],
                    ],
                  });
                });
              } else a >= 2 && say(`My ${e.name.toLowerCase()} is still on the market.`);
            }
        }
      });
      const GHOST_NAMES = [
        "The Grey Lady",
        "Bloody Mary",
        "The Headless Horseman",
        "The Weeping Widow",
        "Old Man Withers",
        "The Phantom Butler",
        "Little Agnes",
        "Sir Reginald the Restless",
        "The Hooded Monk",
        "Captain Blackwood",
        "Lady Ashworth",
        "The Drummer Boy",
        "The Lady in White",
        "Mad Jack the Miller",
        "The Screaming Skull",
        "Countess Vespera",
        "The Cellar Dweller",
        "Brother Ambrose",
        "The Chimney Sweep",
        "Ethel the Unseen",
      ];
      function makeGhost(e) {
        const t = any(GHOST_NAMES.filter((t) => !e.includes(t))),
          a = /Lady|Mary|Widow|Agnes|Countess|Ethel/.test(t)
            ? "f"
            : /Sir|Old Man|Butler|Horseman|Monk|Captain|Boy|Jack|Brother|Sweep/.test(t) || chance(0.5)
              ? "m"
              : "f",
          o = /Little|Boy|Sweep/.test(t) ? rint(8, 12) : rint(25, 80),
          n = randomLook(a, o);
        return (
          Object.assign(n, {
            skin: "#8fb2d8",
            hair: "#5d7fae",
            eyes: "#2e4d7c",
            accRoll: 1,
            hatRoll: 1,
            beard: 0,
          }),
          { name: t, g: a, age: o, look: n, friend: rint(5, 95), active: rint(25, 95) }
        );
      }
      function ensureGhosts(e) {
        if (!isHaunted(e)) return [];
        if (!e.ghosts) {
          e.ghosts = [];
          for (let t = rint(1, 3); t > 0; t--) e.ghosts.push(makeGhost(e.ghosts.map((e) => e.name)));
        }
        return e.ghosts;
      }
      const haunt = (e) => {
        const t = ensureGhosts(e);
        return t.length ? Math.round(t.reduce((e, t) => e + t.active, 0) / t.length) : 0;
      };
