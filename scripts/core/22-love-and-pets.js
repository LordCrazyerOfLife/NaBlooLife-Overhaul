      const LOVE_PLACES = [
          "at the gym",
          "at a coffee shop",
          "at the grocery store",
          "at a party",
          "at the park",
          "on the bus",
          "at the library",
          "at a concert",
          "at the beach",
          "at a bar",
          "at the mall",
          "at work",
          "at a wedding",
          "in line at the bank",
        ],
        CELEB_JOBS = [
          "Movie Star",
          "Pop Star",
          "Rapper",
          "Pro Athlete",
          "Supermodel",
          "TV Host",
          "Influencer",
          "Rock Star",
          "Comedian",
          "Reality TV Star",
        ],
        BRIDE_LANDS = [
          "Russia",
          "Ukraine",
          "the Philippines",
          "Thailand",
          "Colombia",
          "Brazil",
          "Vietnam",
          "Moldova",
          "Peru",
          "Belarus",
        ],
        loverAge = (e) => state.age + e.ageOffset,
        genderWord = (e) => ({ m: "Male", f: "Female" })[e.gLabel] || e.gLabel,
        LOOKS_MOD = [
          [10, -0.3],
          [25, -0.2],
          [40, -0.08],
          [60, 0],
          [75, 0.08],
          [89, 0.15],
          [99, 0.22],
          [100, 0.25],
        ],
        SMARTS_MOD = [
          [15, -0.15],
          [30, -0.06],
          [50, 0],
          [70, 0.04],
          [90, 0.1],
          [100, 0.15],
        ],
        statBand = (e, t) => (e.find(([e]) => t <= e) || e[e.length - 1])[1];
      function romanceValues(e) {
        if (!e.values) {
          const t = Math.random();
          e.values = t < 0.45 ? "looks" : t < 0.7 ? "smarts" : "personality";
        }
        return e.values;
      }
      function romanceOdds(e = {}, { base: t = 0.5, rel: a = null } = {}) {
        const o = state.stats.Looks,
          n = state.stats.Smarts,
          s = romanceValues(e),
          r =
            ("looks" === s ? 1.25 : "smarts" === s ? 0.6 : 0.8) *
            (1 - 0.5 * (null == a ? 0 : Math.max(0, Math.min(1, a / 100))));
        let i = t + statBand(LOOKS_MOD, o) * r;
        return (
          null != e.looks && (i += ((o - e.looks) / 400) * r),
          (i += statBand(SMARTS_MOD, n) * ("smarts" === s ? 1 : 0.3)),
          "smarts" === s && (e.smarts ?? 50) >= 75 && n <= 15 && (i -= 0.1),
          null != a && (i += (a - 50) / 250),
          Math.max(0.03, Math.min(0.9, i))
        );
      }
      const looksDraw = () => Math.max(0.3, Math.min(1.5, 1 + 2 * statBand(LOOKS_MOD, state.stats.Looks))),
        ROMANCE_ASK = /^(Ask \{him\} (out|to the dance)|Give it to \{him\})$/,
        canDate = (e) => (state.age >= 18 ? e >= 18 : e < 18 && e >= 12 && Math.abs(e - state.age) <= 2);
      function makeLover(e = {}) {
        let t = e.ages ? e.ages[0] : state.age - 4,
          a = e.ages ? e.ages[1] : state.age + 6;
        state.age < 18
          ? ((t = Math.max(t, state.age - 2, 12)), (a = Math.min(a, state.age + 2, 17)))
          : (t = Math.max(t, 18)),
          (a = Math.max(t, a));
        const o = e.g || (chance(0.5) ? "m" : "f"),
          n = rint(t, a);
        let s = e.celeb ? 1e6 * rint(2, 80) : startMoney(Math.max(n, 18));
        e.minWorth && s < e.minWorth && (s = Math.round(e.minWorth * (1 + 1.5 * Math.random())));
        const r = e.celeb ? pickR(CELEB_JOBS) : n < 18 ? "Student" : jobFor(n),
          i = pickR(
            s > 15e4 ? HOUSES.filter((e) => e[2] >= 15e4 && e[2] < 2e6) : HOUSES.filter((e) => e[2] < 15e4),
          ),
          l =
            n < 21 && s < 2e4
              ? "Lives with parents"
              : `${i[1]} at ${rint(100, 4999)} ${pickR(HOUSE_STREETS)}`;
        return {
          first: uname(o),
          last: any(LAST),
          g: o,
          gLabel: e.label || o,
          ageOffset: n - state.age,
          look: randomLook(o, n),
          rel: rint(40, 70),
          sexuality:
            e.sexuality ||
            (o === PG() ? (chance(0.7) ? "Gay" : "Bisexual") : chance(0.85) ? "Straight" : "Bisexual"),
          job: r,
          house: l,
          celeb: !!e.celeb,
          looks: e.celeb ? rint(70, 100) : rint(5, 100),
          smarts: rint(5, 100),
          crazy: rint(0, 100),
          money: s,
          prof: {
            money: s,
            relig: rint(0, 100),
            gen: rint(0, 100),
            edu: eduFor(n),
            job: r,
            marital: "Single",
          },
        };
      }
      const herOf = (e) => ("f" === e.g ? "her" : "him"),
        sheOf = (e) => ("f" === e.g ? "She" : "He"),
        loverTitle = (e) =>
          e.married
            ? "m" === e.g
              ? "Husband"
              : "Wife"
            : e.main
              ? e.bride
                ? "m" === e.g
                  ? "Fiancé"
                  : "Fiancée"
                : "f" === e.g
                  ? "Girlfriend"
                  : "Boyfriend"
              : "Lover";
      function toEx(e) {
        const t = state.lovers.indexOf(e);
        t >= 0 && state.lovers.splice(t, 1),
          (e.rel = 0),
          (e.main = !1),
          (e.exAt = state.age),
          state.exes.includes(e) || state.exes.push(e);
      }
      function addLover(e) {
        let t = "";
        const a = mods.infiniteLovers ? [] : state.lovers.filter((e) => !e.married);
        a.length &&
          (a.forEach(toEx),
          a.forEach((e) => say(`I broke up with ${e.first} ${e.last}.`)),
          (t = `<br><br>You broke up with ${a.map((e) => e.first).join(" and ")} to be with ${e.first}.`));
        const o = state.friends.findIndex((t) => t.first === e.first && t.last === e.last);
        return (
          o >= 0 && state.friends.splice(o, 1),
          (e.main = !state.lovers.some((e) => e.main)),
          (e.since ??= state.age),
          state.lovers.push(e),
          t
        );
      }
      function loveCard(e, t) {
        (ev.innerHTML =
          `<div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div>\n      <div class="ev-tag" style="margin-top:12px"><canvas class="ev-av" width="250" height="250"></canvas><span class="who">${e.first} ${e.last}</span><span class="kind">Love</span></div>` +
          t),
          ev.querySelector(".ev-av").replaceWith(npcFace(e.look, e.g, loverAge(e), "happy", "ev-av")),
          (ev.style.overflow = "visible");
        const a = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        return (document.getElementById("propX").onclick = a), evWrap.classList.add("open"), a;
      }
      (state.exes = []),
        document.getElementById("ageBtn").addEventListener("click", () => {
          if (!state.dead)
            for (const e of [...(state.lovers || [])]) {
              const t = loverAge(e);
              state.age < 18 != t < 18 &&
                Math.abs(t - state.age) > 2 &&
                (toEx(e), say(`${e.first} ${e.last} and I broke up.`));
            }
        });
      const loveBar = (e, t, a) =>
          `<b>${e}</b><i><u style="width:${Math.max(t, 1)}%;background:${barCol(a ? 100 - t : t)}"></u></i>`,
        loveRows = (e) =>
          `<table class="prof"><tbody>${e.map(([e, t]) => `<tr><td><b>${e}:</b> ${t}</td></tr>`).join("")}</tbody></table>`;
      function loveInterest(e, t) {
        const a = herOf(e),
          o = loveCard(
            e,
            `<h4><img src="love/date.png"><span>Love Interest</span></h4><div class="lead">${t}</div>\n      ${loveRows(
              [
                ["Name", `${e.first} ${e.last}`],
                ["Gender", genderWord(e)],
                ["Age", loverAge(e)],
                ["Sexuality", e.sexuality],
                ["Occupation", e.job],
                ["House", e.house],
              ],
            )}\n      <div class="ev-bars">${loveBar("Looks", e.looks)}${loveBar("Smarts", e.smarts)}${loveBar("Money", moneyPct(e.money))}${loveBar("Craziness", e.crazy, "o")}</div>\n      <button class="jm-apply ev-btn" id="lvYes">Start dating ${a}</button><button class="jm-apply ev-btn" id="lvNo">Reject ${a}</button>`,
          );
        (document.getElementById("lvYes").onclick = () => {
          o(), screen.classList.remove("open");
          const t = () => {
            const t = addLover(e);
            fx({ Happiness: +rint(5, 10) }, ""),
              say(`I started dating ${e.first} ${e.last}.`),
              notice("Love is in the air", `You are now dating ${e.first} ${e.last}!${t}`, null, !0);
          };
          if (window.firstDate) return firstDate(e, t, null);
          t();
        }),
          (document.getElementById("lvNo").onclick = () => {
            o(),
              screen.classList.remove("open"),
              say(`I rejected ${e.first} ${e.last}.`),
              notice("Not my type", `You rejected ${e.first}.`, null, !0);
          });
      }
      const AGE_BANDS = [
          ["18-19", 18, 19],
          ["20-29", 20, 29],
          ["30-39", 30, 39],
          ["40-49", 40, 49],
          ["50-59", 50, 59],
          ["60-69", 60, 69],
          ["70-79", 70, 79],
          ["80+", 80, 95],
        ],
        WORTH = [
          ["It doesn't matter", 0],
          ["$12k+", 12e3],
          ["$25k+", 25e3],
          ["$63k+", 63e3],
          ["$127k+", 127e3],
          ["$319k+", 319e3],
          ["$639k+", 639e3],
          ["$1.3M+", 13e5],
        ],
        APP_GENDERS = [
          ["Male", "m"],
          ["Female", "f"],
          ["Genderqueer", null],
          ["Non-Binary", null],
          ["Transgender Female", "f"],
          ["Transgender Male", "m"],
        ];
      function appCard({ icon: e, title: t, lead: a, cost: o, second: n, onGo: s }) {
        const r = (e, t, a) =>
          `<label class="hr-lab">${t}</label><div class="hr-sel"><select id="${e}">${a.map((e, t) => `<option value="${t}"${"20-29" === e ? " selected" : ""}>${e}</option>`).join("")}</select></div>`;
        (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div><div class="jm-tag" style="margin-top:12px">Love</div>\n      <h4><img src="${e}"><span>${t}</span></h4><div class="lead">${a}</div>\n      <table><tbody><tr><td style="text-align:center;padding-left:0"><b>Cost:</b> ${usd(o)}</td></tr></tbody></table>\n      ${r(
          "lvAge",
          "Pick your desired age:",
          AGE_BANDS.map((e) => e[0]),
        )}${n ? r("lvTwo", n[0], n[1]) : ""}\n      <button class="jm-apply ev-btn" id="lvGo">Let's try it</button>`),
          (ev.style.overflow = "visible");
        const i = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = i),
          (document.getElementById("lvGo").onclick = () => {
            const e = AGE_BANDS[+document.getElementById("lvAge").value],
              a = n ? +document.getElementById("lvTwo").value : 0;
            if ((i(), state.money < o))
              return (
                screen.classList.remove("open"),
                notice("Not enough", `You need ${usd(o)} to use the ${t.toLowerCase()}.`, null, !0)
              );
            (state.money -= o), renderStats(), s([e[1], e[2]], a);
          }),
          evWrap.classList.add("open");
      }
      const CELEB_FEE = 1e5,
        CELEB_TYPES = [
          [
            "Athlete",
            ["Pro Athlete", "Pro Athlete"],
            "Sport",
            ["Basketball", "Football", "Soccer", "Baseball", "Hockey", "Tennis", "Golf", "Boxing", "MMA"],
            [2e6, 5e8],
          ],
          [
            "Actor",
            ["Famous Actor", "Famous Actress"],
            "Genre",
            [
              "Action",
              "Comedy",
              "Drama",
              "Horror",
              "Musical",
              "Romance",
              "Sci-Fi",
              "Thriller",
              "Western",
              "Fantasy",
            ],
            [1e6, 2e9],
          ],
          [
            "Musician",
            ["Famous Musician", "Famous Musician"],
            "Genre",
            ["Pop", "Rock", "Hip Hop", "Country", "R&B", "Jazz", "EDM", "Classical", "Latin", "K-Pop"],
            [1e6, 4e9],
          ],
          [
            "Model",
            ["Supermodel", "Supermodel"],
            "Specialty",
            ["Runway", "Fashion", "Swimsuit", "Fitness", "Commercial"],
            [1e5, 1e8],
          ],
          [
            "Influencer",
            ["Famous Influencer", "Famous Influencer"],
            "Niche",
            ["Beauty", "Gaming", "Lifestyle", "Fitness", "Comedy", "Travel", "Food"],
            [1e5, 25e7],
          ],
          [
            "CEO",
            ["CEO", "CEO"],
            "Industry",
            ["Tech", "Retail", "Energy", "Finance", "Fashion", "Media", "Automotive"],
            [1e6, 3e9],
          ],
          ["Royal", ["Prince", "Princess"], "Title", null, [5e6, 5e9]],
        ],
        celebWorth = ([e, t], a) => {
          const o = Math.random() ** 2.4,
            n = Math.min(1.6, 0.6 + a / 60);
          return 1e3 * Math.round(Math.min(t, e * (t / e) ** o * n) / 1e3);
        },
        fmtWorth = (e) =>
          e >= 1e9
            ? `${cur()}${(e / 1e9).toFixed(1).replace(/\.0$/, "")}B`
            : e >= 1e6
              ? `${cur()}${(e / 1e6).toFixed(1).replace(/\.0$/, "")}M`
              : usd(e);
      function celebApp() {
        if (state.age < 18)
          return notice("Too Young", "You must be at least 18 to use the celebrity dating app.", null, !0);
        const e = CELEB_TYPES.filter((e) => "Royal" !== e[0] || ROYAL_LANDS.includes(state.country)),
          t = (e, t, a) =>
            `<label class="hr-lab">${t}</label><div class="hr-sel"><select id="${e}">${a.map((e, t) => `<option value="${t}">${e}</option>`).join("")}</select></div>`;
        (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div><div class="jm-tag" style="margin-top:12px">Love</div>\n      <h4><img src="love/celeb.png"><span>Celebrity Dating App</span></h4><div class="lead">Use the celebrity dating app to find the celebrity lover of your dreams today!</div>\n      <table><tbody><tr><td style="text-align:center;padding-left:0"><b>Cost:</b> ${usd(1e5)}</td></tr></tbody></table>\n      ${t(
          "ceAge",
          "Pick your desired age:",
          AGE_BANDS.map((e) => e[0]),
        )}${t("ceG", "Pick your desired gender:", ["Male", "Female"])}\n      ${t(
          "ceT",
          "Pick your desired celebrity type:",
          e.map((e) => e[0]),
        )}\n      <button class="jm-apply ev-btn" id="ceGo">Let's try it</button>`),
          (document.getElementById("ceG").value = "m" === PG() ? 1 : 0),
          (document.getElementById("ceT").value = e.findIndex((e) => "Musician" === e[0])),
          (ev.style.overflow = "visible");
        const a = () => {
          cDropClose(), evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = a),
          (document.getElementById("ceGo").onclick = () => {
            const t = AGE_BANDS[+document.getElementById("ceAge").value],
              o = ["m", "f"][+document.getElementById("ceG").value],
              n = e[+document.getElementById("ceT").value];
            return (
              a(),
              state.money < 1e5
                ? (screen.classList.remove("open"),
                  notice("Not enough", `You need ${usd(1e5)} to use the celebrity dating app.`, null, !0))
                : ((state.money -= 1e5),
                  renderStats(),
                  chance(0.1)
                    ? (screen.classList.remove("open"),
                      say(`I paid ${usd(1e5)} for the celebrity dating app, but nobody matched with me.`),
                      notice("No matches", "No celebrities matched with you this time.", null, !0))
                    : void celebMatch(makeCeleb(n, o, [t[1], t[2]])))
            );
          }),
          evWrap.classList.add("open");
      }
      function makeCeleb(e, t, a) {
        const [o, n, s, r, i] = e,
          l = makeLover({ g: t, ages: a }),
          c = loverAge(l),
          d = n["f" === t ? 1 : 0],
          u = "Royal" === o ? `${d} of ${COUNTRIES[state.country][0]}` : pickR(r),
          h = celebWorth(i, c),
          p = "Royal" === o ? rint(60, 100) : Math.round(5 + 95 * Math.random() ** 1.6);
        return (
          Object.assign(l, {
            job: d,
            money: h,
            looks: rint("Model" === o ? 75 : 35, 100),
            celebDate: { type: o, genreLabel: s, genre: u, fame: p, since: null },
            celeb: { career: d, level: p, fans: Math.round(p ** 2.6 * rint(50, 400)) },
          }),
          (l.prof.money = h),
          (l.prof.job = d),
          l
        );
      }
      function celebMatch(e) {
        const t = e.celebDate,
          a = `${e.job
            .replace(/^Famous /, "")
            .replace(/^Pro /, "professional ")
            .toLowerCase()}`,
          o = `<b>Fame</b><i><u style="width:${Math.max(t.fame, 1)}%;background:#f4c044"></u></i>`,
          n = loveCard(
            e,
            `<h4><img src="love/celeb.png"><span>Match</span></h4>\n      <div class="lead">The celebrity dating app has paired you with ${"Royal" === t.type ? `a royal ${a}` : `a famous ${a}`} named ${e.first} ${e.last}.</div>\n      ${loveRows(
              [
                ["Age", loverAge(e)],
                ["Gender", genderWord(e)],
                ["Sexuality", e.sexuality],
                ["Occupation", e.job],
                [t.genreLabel, t.genre],
              ],
            )}\n      <div class="ev-bars">${loveBar("Looks", e.looks)}${loveBar("Smarts", e.smarts)}${loveBar("Money", moneyPct(e.money))}${loveBar("Craziness", e.crazy, "o")}${o}</div>\n      <button class="jm-apply ev-btn" id="ceDate">Go on a date</button><button class="jm-apply ev-btn" id="ceAgain">No, try again</button>`,
          );
        (document.getElementById("ceAgain").onclick = () => {
          n(), setTimeout(celebApp, 80);
        }),
          (document.getElementById("ceDate").onclick = () => {
            n(), screen.classList.remove("open");
            const o = state.art && state.art.fameOn ? state.art.fame : 0,
              s = romanceOdds(e, { base: 0.55 }) + o / 200 - t.fame / 500 - ("Royal" === t.type ? 0.1 : 0);
            if (!chance(Math.max(0.15, Math.min(0.9, s))))
              return (
                fx({ Happiness: -rint(2, 6) }, ""),
                say(
                  `I went on a date with ${e.first} ${e.last}, a famous ${a}, but ${sheOf(e).toLowerCase()} ghosted me afterwards.`,
                ),
                notice("Ghosted", `${e.first} ${e.last} never called you back after your date.`, null, !0)
              );
            const r = addLover(e);
            (t.since = state.age),
              fx({ Happiness: +rint(6, 12) }, ""),
              say(`I started dating ${e.first} ${e.last}, a famous ${a}.`),
              notice(
                "No pictures, please",
                `You are now dating ${e.first} ${e.last}, a ${"Royal" === t.type ? "royal" : "famous"} ${"Royal" === t.type ? a : t.type.toLowerCase()}.${r}`,
                null,
                !0,
              );
          });
      }
      function celebProfile(e, t) {
        const a = e.celebDate,
          o = state.age - (a.since ?? state.age),
          n = loveCard(
            e,
            `<h4><img src="love/date.png"><span>Profile</span></h4>\n      ${loveRows([
              ["Relationship", t],
              ["Age", loverAge(e)],
              ["Years Together", o < 1 ? "&lt;1" : o],
              ["Net Worth", fmtWorth(e.money)],
              ["Occupation", e.job],
              [a.genreLabel, a.genre],
            ])}\n      <div class="ev-bars">${loveBar("Relationship", e.rel)}${loveBar("Looks", e.looks)}${loveBar("Smarts", e.smarts)}${loveBar("Craziness", e.crazy, "o")}<b>Fame</b><i><u style="width:${Math.max(a.fame, 1)}%;background:#f4c044"></u></i></div>`,
          );
        return (ev.querySelector(".ev-tag .kind").textContent = ""), n;
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead) return;
        const e = (state.lovers || []).filter((e) => e.celebDate);
        if (
          (e.forEach((e) => {
            (e.money = Math.max(0, Math.round(e.money * (0.97 + 0.15 * Math.random())))),
              (e.prof.money = e.money);
          }),
          !e.length || !state.art || state.art.fameOn)
        )
          return;
        const t = e.some((e) => "Royal" === e.celebDate.type),
          a = Math.max(...e.map((e) => e.celebDate.fame));
        if (!chance(t ? 0.5 : 0.1 + a / 400)) return;
        (state.art.fameOn = !0),
          (state.art.fame = Math.max(state.art.fame, rint(8, 20))),
          (state.socialite = !0),
          renderStats();
        const o = e.find((e) => e.celebDate.fame === a);
        say(`I became a famous socialite thanks to my relationship with ${o.first} ${o.last}.`),
          setTimeout(
            () =>
              notice(
                "Famous Socialite",
                `Being seen with ${o.first} ${o.last} has made you famous! You're now a famous socialite.`,
              ),
            600,
          );
      });
      const LOVE_OFF = new Set(["bride"]);
      function openLove1800() {
        (sTitle.textContent = "LOVE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const e = eraCash(5),
          t = eraCash(0.5),
          a = (e, t, a, o, n) => {
            const s = state.age < n;
            return `<div class="row${s ? " dis" : ""}" data-lv="${e}"><img src="${t}"><div class="t"><b>${a}</b><span>${o}</span></div>${s ? "" : DOTS}</div>`;
          };
        (sList.innerHTML =
          a("court", "love/date.png", "Go Courting", "Call on a sweetheart and walk out together", 14) +
          a(
            "match",
            "freelife/apple/1f48c.png",
            "Visit the Matchmaker",
            `Pay ${usd(e)} for a respectable introduction`,
            16,
          ) +
          a(
            "ad",
            "emoji/1f4f0.png",
            "Lonely Hearts Notice",
            `Place a ${usd(t)} notice in the newspaper`,
            18,
          )),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-lv]").forEach(
            (a) =>
              (a.onclick = () => {
                if (a.classList.contains("dis")) return;
                const o = a.dataset.lv;
                if ("court" === o) return eraCourt();
                const n = "match" === o ? e : t;
                if (state.money < n) return notice("Not enough money", `That costs ${usd(n)}.`, null, !0);
                (state.money = cents(state.money - n)), renderStats();
                const s = makeLover({
                  g: crushGender() || (chance(0.5) ? "m" : "f"),
                  ages: [Math.max(16, state.age - 6), state.age + 8],
                });
                if (!chance(romanceOdds(s, { base: "match" === o ? 0.85 : 0.6 }))) {
                  screen.classList.remove("open");
                  const e =
                    "match" === o
                      ? "The matchmaker could not find anyone willing to meet me."
                      : "Nobody answered my notice in the newspaper.";
                  return say(e), notice("No luck", e, null, !0);
                }
                loveInterest(
                  s,
                  "match" === o
                    ? `The matchmaker introduced you to a ${"f" === s.g ? "young lady" : "gentleman"} named ${s.first} ${s.last}.`
                    : `${s.first} ${s.last} answered your lonely hearts notice with a letter.`,
                );
              }),
          ),
          screen.classList.add("open");
      }
      function openLove() {
        if (isOldEra()) return openLove1800();
        (sTitle.textContent = "LOVE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const e = (e, t, a, o) =>
          `<div class="row${(o = o || state.age < ("date" === e ? 14 : 18)) ? " dis" : ""}" data-lv="${e}"><img src="love/${e}.png"><div class="t"><b>${t}</b><span>${a}</span></div>${o ? "" : DOTS}</div>`;
        (sList.innerHTML =
          e("celeb", "Celebrity Dating App", "Date the celebrity of your dreams") +
          e("date", "Date", "Find a date") +
          e("app", "Dating App", "Find love on the dating app") +
          e("gay", "Gay Dating App", "Find your ideal LGBTQ lover") +
          e("hookup", "Hook Up", "Find a one night stand") +
          e("bride", "Mail-Order Bride", "Order the bride of your dreams", LOVE_OFF.has("bride")) +
          e("threesome", "Threesome", "Setup a threesome", !0)),
          (sList.scrollTop = 0);
        const t = () => crushGender() || (chance(0.5) ? "m" : "f");
        sList.querySelectorAll("[data-lv]").forEach(
          (e) =>
            (e.onclick = () => {
              const a = e.dataset.lv;
              if (LOVE_OFF.has(a))
                return notice(
                  "Error",
                  `${e.querySelector("b").textContent} is not available right now.`,
                  null,
                  !0,
                );
              if (e.classList.contains("dis")) return;
              const o = "date" !== a;
              if (state.age < (o ? 18 : 14))
                return notice("Too Young", `You must be at least ${o ? 18 : 14} for that.`, null, !0);
              if ("date" === a) {
                const e = makeLover({ g: t(), ages: [Math.max(14, state.age - 5), state.age + 6] });
                return chance(romanceOdds(e, { base: 0.75 }))
                  ? loveInterest(
                      e,
                      `A ${"f" === e.g ? (loverAge(e) < 18 ? "girl" : "woman") : loverAge(e) < 18 ? "boy" : "man"} you met ${pickR(LOVE_PLACES)} has asked you on a date.`,
                    )
                  : (screen.classList.remove("open"),
                    say("I went looking for a date, but nobody was interested."),
                    notice("No luck", "You went looking for a date, but nobody was interested.", null, !0));
              }
              if ("app" === a)
                return appCard({
                  icon: "love/app.png",
                  title: "Dating App",
                  lead: "Use the dating app to find the lover of your dreams today!",
                  cost: 100,
                  second: ["Pick your desired net worth:", WORTH.map((e) => e[0])],
                  onGo: (e, a) => {
                    const o = makeLover({ g: t(), ages: e, minWorth: WORTH[a][1] });
                    if (!chance(romanceOdds(o, { base: 0.85 })))
                      return (
                        screen.classList.remove("open"),
                        say("I paid for the dating app, but nobody swiped right on me."),
                        notice("No matches", "Nobody on the dating app swiped right on you.", null, !0)
                      );
                    loveInterest(
                      o,
                      `The dating app matched you with a ${"f" === o.g ? "woman" : "man"} named ${o.first} ${o.last}.`,
                    );
                  },
                });
              if ("gay" === a)
                return appCard({
                  icon: "love/gay.png",
                  title: "Gay Dating App",
                  lead: "Use the gay dating app to find the lover of your dreams today!",
                  cost: 100,
                  second: ["Pick your desired gender:", APP_GENDERS.map((e) => e[0])],
                  onGo: (e, t) => {
                    const [a, o] = APP_GENDERS[t],
                      n = makeLover({
                        g: o || (chance(0.5) ? "m" : "f"),
                        label: a,
                        ages: e,
                        sexuality: pickR(["Gay", "Lesbian", "Bisexual", "Pansexual", "Queer"]),
                      });
                    if (!chance(romanceOdds(n, { base: 0.85 })))
                      return (
                        screen.classList.remove("open"),
                        say("I paid for the gay dating app, but I got no matches."),
                        notice("No matches", "Nobody on the gay dating app matched with you.", null, !0)
                      );
                    loveInterest(n, `The gay dating app matched you with ${n.first} ${n.last}.`);
                  },
                });
              if ("celeb" === a) return celebApp();
              if ("hookup" === a) {
                const e = makeLover({ g: t(), ages: [18, Math.max(25, state.age + 8)] }),
                  a = loveCard(
                    e,
                    `<h4><img src="love/hookup.png"><span>Hook Up</span></h4>\n          <div class="lead">You have an opportunity to have a one night stand with a ${loverAge(e) < 30 ? "young " : ""}${"f" === e.g ? "woman" : "man"} named ${e.first} ${e.last}.<br><br>What will you do?</div>\n          <table><tbody>${[
                      ["Name", `${e.first} ${e.last}`],
                      ["Gender", genderWord(e)],
                      ["Age", loverAge(e)],
                      ["Sexuality", e.sexuality],
                    ]
                      .map(
                        ([e, t]) =>
                          `<tr><td style="text-align:center;padding-left:0"><b>${e}:</b> ${t}</td></tr>`,
                      )
                      .join(
                        "",
                      )}</tbody></table>\n          <div class="ev-bars">${loveBar("Looks", e.looks)}</div>\n          <button class="jm-apply ev-btn" data-h="1">Get at it</button><button class="jm-apply ev-btn" data-h="0">No, I'm not into that</button>\n          <div class="ev-surprise"><img src="emoji/1f3b2.png"><span>Surprise me!</span></div>`,
                  ),
                  o = (t) => {
                    if ((a(), !t))
                      return (
                        screen.classList.remove("open"),
                        say(`I turned down a one night stand with ${e.first}.`),
                        notice("Maybe next time", `You turned down ${e.first}.`, null, !0)
                      );
                    setTimeout(() => safeSexCard(e), 80);
                  };
                return (
                  ev.querySelectorAll("[data-h]").forEach((e) => (e.onclick = () => o("1" === e.dataset.h))),
                  void (ev.querySelector(".ev-surprise").onclick = () => o(chance(0.5)))
                );
              }
              if ("bride" === a) {
                const e = 25e3;
                return socSelCard({
                  tag: "Love",
                  icon: "love/bride.png",
                  title: "Mail-Order Bride",
                  lead: "Order the bride of your dreams today!",
                  rows: [["Cost", usd(e)]],
                  label: "Pick her home country:",
                  opts: BRIDE_LANDS,
                  btn: "Order her",
                  onGo: (t) => {
                    if (state.money < e)
                      return notice("Not enough", `You need ${usd(e)} to order a bride.`, null, !0);
                    (state.money -= e), renderStats();
                    const a = makeLover({ g: "f", ages: [20, 35] });
                    (a.bride = !0), (a.rel = rint(20, 50));
                    const o = addLover(a);
                    say(`I paid ${usd(e)} for a mail-order bride named ${a.first} from ${BRIDE_LANDS[t]}.`),
                      notice(
                        "Special delivery",
                        `Your mail-order bride, ${a.first} ${a.last}, has arrived from ${BRIDE_LANDS[t]}!${o}`,
                        null,
                        !0,
                      );
                  },
                });
              }
            }),
        );
      }
      function openExes() {
        (sTitle.textContent = "EXES"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openRelationships);
        const e = (e) =>
          e.wasMarried
            ? "m" === e.g
              ? "Ex-Husband"
              : "Ex-Wife"
            : e.bride
              ? "m" === e.g
                ? "Ex-Fiancé"
                : "Ex-Fiancée"
              : "f" === e.g
                ? "Ex-Girlfriend"
                : "Ex-Boyfriend";
        (sList.innerHTML = state.exes
          .map(
            (t, a) =>
              `<div class="row sm" data-ex="${a}"><i class="exf" data-exi="${a}"></i><div class="t"><b>${t.first} ${t.last} <em>(${e(t)})</em></b>${relBar(0)}</div>${DOTS}</div>`,
          )
          .join("")),
          sList.querySelectorAll("i.exf").forEach((e) => {
            const t = state.exes[+e.dataset.exi];
            e.replaceWith(npcFace(t.look, t.g, loverAge(t), "sad", "face"));
          }),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-ex]").forEach(
            (t) =>
              (t.onclick = () => {
                const a = state.exes[+t.dataset.ex];
                profileCard(a, loverAge(a), `${a.first} ${a.last}`, e(a));
              }),
          );
      }
      const CLUB_NAMES = [
          "Acoustic",
          "Black Rock Lounge",
          "The Diversity",
          "Club Neon",
          "Velvet Room",
          "Pulse",
          "The Warehouse",
          "Echo",
          "Skyline",
          "Bassment",
          "Glow",
          "Club Vortex",
          "Afterlife",
          "Sapphire",
        ],
        CLUB_NIGHTS = [
          () => `You drank ${rint(3, 9)} shots of tequila and danced on a table.`,
          () => `You drank ${rint(4, 12)} beers and lost your voice singing along.`,
          () => `You downed ${rint(3, 7)} vodka sodas and made a dozen new best friends.`,
          () => "You split a bottle of champagne at the bar and stayed until closing.",
          () => "A stranger handed you a pill of ecstasy and you danced all night.",
          () => "Someone in the bathroom offered you cocaine and you took a bump.",
          () => "You took some molly with a group you met on the dance floor.",
          () => "You smoked a joint out back with the bouncer.",
          () => "You ate a few magic mushrooms and the lights started talking to you.",
          () => "You mixed Jägerbombs all night and barely remember getting home.",
        ];
      function openNightlife() {
        if (state.age < 18) return notice("Too Young", "You must be at least 18 to go clubbing.", null, !0);
        jCard({
          tag: "Leisure",
          iconSrc: "night/club.png",
          title: "Clubbing",
          lead: "Which local nightclub will you go to?",
          close: !0,
          choices: (state.clubList ||= [...CLUB_NAMES]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .sort()).map((e) => [e, () => goClub(e)]),
        });
      }
      function goClub(e) {
        screen.classList.remove("open"),
          state.clubAge !== state.age && ((state.clubAge = state.age), (state.clubNights = 0)),
          state.clubNights++;
        const t = rint(2, 100);
        fx({ Happiness: Math.round((t - 40) / 10), Health: -rint(0, 2) }, ""),
          say(`I went clubbing at ${e}.`);
        notice(
          any(["Cheers!", "Party animal", "Turn up"]),
          `You went clubbing at ${e}.`,
          () => {
            if (state.clubNights <= 4 && chance(0.5)) {
              const t = makeLover({
                g: crushGender() || (chance(0.5) ? "m" : "f"),
                ages: [18, Math.max(25, state.age + 6)],
              });
              return setTimeout(() => hookupCard(t, e), 120);
            }
            return chance(0.25)
              ? setTimeout(clubArgument, 120)
              : chance(0.85)
                ? setTimeout(() => viceCard(), 120)
                : void 0;
          },
          !0,
          `<div class="ev-bars nb"><b>Enjoyment</b><i><u style="width:${t}%;background:${barCol(t)}"></u></i></div>`,
        );
      }
      const DRINKS = [
          ["Gin and Tonic", "drink1"],
          ["Vodka Soda", "drink2"],
          ["Scotch", "drink3"],
          ["Sake", "drink4"],
          ["Old Fashioned", "drink5"],
          ["Red Wine", "drink6"],
          ["Cognac", "drink7"],
          ["Beer", "drink8"],
          ["Whiskey", "drink9"],
          ["Bourbon", "drink10"],
          ["Brandy", "drink11"],
          ["Mimosa", "drink12"],
          ["Blue Lagoon", "drink13"],
          ["Lager", "drink14"],
          ["Negroni", "drink15"],
          ["Margarita", "drink16"],
          ["Irish Coffee", "drink17"],
          ["Vodka Tonic", "drink18"],
          ["Rum and Coke", "drink19"],
          ["Martini", "drink20"],
          ["Sangria", "drink21"],
          ["Mojito", "drink22"],
          ["Gimlet", "drink23"],
          ["Jägerbomb", "drink24"],
          ["Whiskey Smash", "drink25"],
          ["Moscow Mule", "drink26"],
          ["Cosmopolitan", "drink27"],
          ["Manhattan", "drink28"],
          ["Piña Colada", "drink29"],
          ["Bloody Mary", "drink30"],
          ["Appletini", "drink31"],
          ["Limoncello", "drink32"],
          ["Tequila Sunrise", "drink33"],
          ["Mai Tai", "drink34"],
          ["Aperol Spritz", "drink35"],
          ["Strawberry Daiquiri", "drink36"],
          ["Sea Breeze", "drink37"],
          ["Hurricane", "drink38"],
          ["White Russian", "drink39"],
          ["Long Island Iced Tea", "drink"],
        ],
        DRUGS = [
          ["Weed", "vice/weed", "marijuana", [1, 4], 0],
          ["Ecstasy", "night/pill", "ecstasy", [4, 10], 0.02],
          ["Molly", "night/pill", "ecstasy", [4, 10], 0.02],
          ["Fentanyl", "night/syringe", "fentanyl", [12, 25], 0.18],
          ["Heroin", "night/syringe", "heroin", [10, 20], 0.1],
          ["Meth", "night/syringe", "meth", [8, 18], 0.05],
          ["Magic Mushrooms", "night/mushroom", "mushrooms", [2, 6], 0.005],
          ["Xanax", "night/pill", "Xanax", [3, 9], 0.04],
          ["Oxy", "night/pill", "painkillers", [6, 14], 0.06],
          ["Pills", "night/pill", "pills", [4, 10], 0.04],
          ["Sleeping Pills", "night/pill", "sleeping pills", [3, 8], 0.03],
          ["Cigarette", "vice/cigarette", "nicotine", [1, 3], 0],
        ],
        DRINK_SCENES = [
          [
            "Some ballers invite you to drink some {d}s while you are at the club.",
            "Are you feeling it?",
            "Let's ball!",
            "I'm no baller",
          ],
          [
            "While relaxing at a private table in the club, someone randomly orders your group a round of {d}s.",
            "Will you drink it?",
            "Bottoms up!",
            "Seems shady",
          ],
          [
            "A cocktail waitress at the club is pouring shots of {d} using a funnel.",
            "Will you take a funnel shot?",
            "Pour it down!",
            "That's too crazy for me",
          ],
          [
            "While watching a wet T-shirt contest at the nightclub, your friend brings you a {d}.",
            "Will you drink it?",
            "Don't mind if I do",
            "I'm busy",
          ],
          [
            "The DJ shouts out your name and sends a {d} over to you.",
            "Will you drink it?",
            "Cheers to that!",
            "Pass",
          ],
          [
            "A stranger at the bar bets you can't finish a {d} in one gulp.",
            "Will you take the bet?",
            "Watch me",
            "I'm good",
          ],
        ],
        DRUG_SCENES = [
          [
            "While at the club, the bouncer offers you {d}.",
            "What will you do?",
            "Sure thing beefy",
            "No way buffy",
          ],
          ["Someone in the bathroom line offers you some {d}.", "What will you do?", "I'm in", "Hard pass"],
          [
            "A guy in sunglasses on the dancefloor slips you some {d}.",
            "Will you take it?",
            "Why not",
            "Absolutely not",
          ],
          [
            "Your friend pulls you aside and says they scored some {d}.",
            "Will you try it?",
            "Let's do it",
            "I'll sit this one out",
          ],
        ],
        DRINK_SCENES_OUT = [
          [
            "While at an airport bar, a good looking bartender offers you a {d}.",
            "Will you take it?",
            "I'll sip on that!",
            "Just a water please",
          ],
          [
            "Your neighbor invites you over for a {d} on their porch.",
            "Will you have one?",
            "Pour me one",
            "I'll pass",
          ],
          [
            "At a wedding reception, one of the groomsmen hands you a {d}.",
            "Will you drink it?",
            "Cheers to the couple!",
            "Not tonight",
          ],
          [
            "A coworker pours you a {d} at the office holiday party.",
            "Will you drink it?",
            "Bottoms up!",
            "I'm driving",
          ],
          [
            "On a long flight, the flight attendant offers you a complimentary {d}.",
            "Will you take it?",
            "Don't mind if I do",
            "Just pretzels, thanks",
          ],
        ],
        DRUG_SCENES_OUT = [
          [
            "At a music festival, a stranger in a flower crown offers you some {d}.",
            "What will you do?",
            "Peace and love!",
            "No thanks",
          ],
          [
            "Your cousin pulls you aside at a family barbecue and offers you some {d}.",
            "Will you take it?",
            "Why not",
            "Grandma's watching",
          ],
          [
            "A guy at the bus stop offers to sell you some {d} for cheap.",
            "Will you take it?",
            "I'll take it",
            "Keep walking",
          ],
        ],
        addictions = () => (state.addictions ||= []),
        DRUG_FROM = {
          Weed: 1920,
          Ecstasy: 1985,
          Molly: 1990,
          Fentanyl: 2013,
          Heroin: 1898,
          Meth: 1950,
          "Magic Mushrooms": 1957,
          Xanax: 1981,
          Oxy: 1996,
          Pills: 1955,
          "Sleeping Pills": 1950,
          Cigarette: 1880,
        },
        OLD_DRUGS = [
          ["Laudanum", "vice/sizzurp", "laudanum", [3, 8], 0.02, 1800, 1930],
          ["Opium", "night/pill", "opium", [4, 10], 0.03, 1800, 1925],
          ["Morphine", "night/syringe", "morphine", [6, 14], 0.05, 1855, 1960],
          ["Cocaine", "night/pill", "cocaine", [5, 12], 0.04, 1860, 9999],
          ["Hashish", "vice/weed", "hashish", [1, 4], 0, 1800, 1930],
          ["Chloral Hydrate", "night/pill", "chloral", [3, 8], 0.04, 1869, 1950],
          ["Ether", "vice/sizzurp", "ether", [2, 6], 0.01, 1842, 1920],
          ["Snuff", "vice/cigarette", "nicotine", [1, 2], 0, 1800, 1910],
        ],
        OLD_DRINKS = [
          ["Ale", "drink8"],
          ["Whiskey", "drink9"],
          ["Rum", "drink19"],
          ["Gin", "drink1"],
          ["Brandy", "drink11"],
          ["Port Wine", "drink6"],
          ["Bourbon", "drink10"],
          ["Scotch", "drink3"],
          ["Cognac", "drink7"],
          ["Lager", "drink14"],
          ["Hard Cider", "drink8"],
          ["Moonshine", "drink9"],
        ],
        OLD_DRUG_SCENES = [
          [
            "A traveling medicine man swears his bottle of {d} cures whatever ails you.",
            "Will you try it?",
            "Hand it over",
            "No thank you",
          ],
          [
            "In a smoky den down by the docks, a man offers you some {d}.",
            "What will you do?",
            "Just this once",
            "Walk out",
          ],
          [
            "The apothecary slips you some {d} to calm your nerves.",
            "Will you take it?",
            "For my nerves",
            "I'll manage",
          ],
          [
            "A sailor at the tavern offers you some {d} he brought back from abroad.",
            "Will you try it?",
            "Why not",
            "Not for me",
          ],
        ],
        OLD_DRINK_SCENES = [
          ["A cowhand at the saloon buys you a {d}.", "Will you drink it?", "Much obliged", "I'll pass"],
          [
            "At a barn dance, your neighbor passes you a jug of {d}.",
            "Will you take a swig?",
            "Bottoms up",
            "Not tonight",
          ],
          [
            "At a wedding feast, the bride's father pours you a {d}.",
            "Will you drink it?",
            "To the happy couple!",
            "Just water",
          ],
          [
            "A stranger at the tavern bets you can't down a {d} in one go.",
            "Will you take the bet?",
            "Watch me",
            "I'm no fool",
          ],
        ],
        viceYear = () => state.birthYear + state.age,
        drugPool = () => {
          const e = viceYear();
          return [
            ...DRUGS.filter((t) => e >= (DRUG_FROM[t[0]] || 0)),
            ...OLD_DRUGS.filter((t) => e >= t[5] && e < t[6]),
          ];
        },
        isBooze = (e) => /^(ale|wine|whiskey|rum|gin|brandy|cider|beer|mead|port|sherry|moonshine)/.test(e);
      function drankAlcohol(e = 1) {
        (state.booze && state.booze.age === state.age
          ? state.booze
          : (state.booze = { age: state.age, n: 0, streak: (state.booze || {}).streak || 0 })
        ).n += e;
      }
      function viceCard(e) {
        const t = isOldEra(),
          a = drugPool(),
          o = a.length > 0 && chance(0.4),
          [n, s, r, i, l] = o
            ? any(a)
            : [(c = any(t ? OLD_DRINKS : DRINKS))[0], c[1], "alcohol", [1, 5], 0.006];
        var c;
        const d = o && !t && viceYear() >= 1990 && chance(0.12),
          u = d ? "Cough Syrup" : n,
          h = d ? "sizzurp" : n.toLowerCase().replace("lsd", "LSD"),
          [p, m, f, g] = any(
            t
              ? o
                ? OLD_DRUG_SCENES
                : OLD_DRINK_SCENES
              : o || d
                ? e
                  ? DRUG_SCENES_OUT
                  : DRUG_SCENES
                : e
                  ? DRINK_SCENES_OUT
                  : DRINK_SCENES,
          ),
          y = e || t ? "" : " at the club";
        jCard({
          tag: "Vice",
          iconSrc: d ? "vice/sizzurp.png" : o ? `${s}.png` : `vice/${s}.png`,
          title: u,
          lead: `${p.replace("{d}", h)}<br><br>${m}`,
          surprise: !0,
          choices: [
            [
              f,
              () => {
                if (
                  (fx({ Health: -rint(...(d ? [3, 8] : i)), Happiness: +rint(2, 8) }, ""),
                  say(`I ${o || d ? "took" : "drank"} ${o && !d ? "some " : "a "}${h}${y}.`),
                  chance(d ? 0.03 : l))
                )
                  return (
                    say(`I overdosed on ${h}.`),
                    notice("Overdose", `You overdosed on ${h}.`, () => die(`an overdose of ${h}`), !0)
                  );
                o || d || drankAlcohol();
                const e = d ? "cough syrup" : r,
                  t = !addictions().includes(e) && chance("alcohol" === r ? 0.03 : 0.3);
                notice(
                  any(["Cheers!", "Party animal", "Lit"]),
                  `You ${o || d ? "took" : "drank"} ${o && !d ? "some " : "a "}${h}.`,
                  t
                    ? () => {
                        addictions().push(e),
                          say(`I became addicted to ${e}.`),
                          queuePopup(() =>
                            illnessCard(
                              "vice/brain.png",
                              e[0].toUpperCase() + e.slice(1),
                              `You are now addicted to ${e}.`,
                              "Addiction",
                            ),
                          );
                      }
                    : null,
                  !0,
                );
              },
            ],
            [
              g,
              () => {
                say(`I turned down ${o && !d ? "some " : "a "}${h}${y}.`);
              },
            ],
          ],
        });
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || !state.booze) return;
        const e = state.booze,
          t = e.age === state.age - 1 ? e.n : 0;
        if (
          (t > 0 &&
            (mindBump(-Math.min(3, Math.ceil(t / 3)), Math.min(6, 1 + Math.floor(t / 2))),
            t >= 3 &&
              chance(0.4) &&
              say(
                pickR([
                  "Drinking took the edge off my worries this year.",
                  "A few drinks helped me forget my troubles this year.",
                  "The bottle kept my nerves steady this year.",
                ]),
              )),
          (e.streak = t >= 3 ? (e.streak || 0) + 1 : Math.max(0, (e.streak || 0) - 1)),
          t >= 3 && !addictions().includes("alcohol"))
        ) {
          const a = state.risk && state.risk.addiction ? 1 + state.risk.addiction : 1;
          chance(Math.min(0.65, (0.04 * (t - 2) + 0.08 * e.streak) * a)) &&
            (addictions().push("alcohol"),
            say("I became addicted to alcohol from drinking so heavily, year after year."),
            queuePopup(() =>
              illnessCard(
                "vice/brain.png",
                "Alcohol",
                "Years of heavy drinking have caught up with you. You are now addicted to alcohol.",
                "Addiction",
              ),
            ));
        }
        state.booze = { age: state.age, n: 0, streak: e.streak };
      });
      const REHAB = [
        ["State-funded program", 0, 0.3, "a state-funded rehab program"],
        ["Outpatient clinic", [2e3, 6e3], 0.5, "an outpatient clinic"],
        ["Residential rehab", [15e3, 3e4], 0.72, "a residential rehab center"],
        ["Luxury rehab resort", [6e4, 12e4], 0.9, "a luxury rehab resort"],
      ];
      function openRehab() {
        if (window.DRUG_USE) return DRUG_USE.openRehab();
        const e = addictions();
        if (!e.length) return notice("Rehab", "You aren't addicted to anything right now.", null, !0);
        const t = REHAB.map(([, e]) =>
          e
            ? "1800s" === state.era
              ? ep(rint(...e))
              : 100 * Math.round((rint(...e) * (PRICE_LVL[state.country] || 1)) / 100)
            : 0,
        );
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="rhX" style="left:-14px;top:-14px">${CARD_X}</div><div class="jm-tag" style="margin-top:12px">Rehab</div>\n      <h4><img src="vice/brain.png" alt=""><span>Rehab</span></h4>\n      <div class="lead">Get help beating one of your addictions. Better programs cost more but work more often.</div>\n      <label class="hr-lab">Pick your addiction:</label><div class="hr-sel"><select id="rhAdd">${e.map((e, t) => `<option value="${t}">${capFirst(e)}</option>`).join("")}</select></div>\n      <label class="hr-lab">Pick your program:</label><div class="hr-sel"><select id="rhProg">${REHAB.map(([e], a) => `<option value="${a}">${e} (${t[a] ? usd(t[a]) : "Free"})</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="rhGo">Check in</button></div>`),
          (ev.style.overflow = "visible");
        const a = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("rhX").onclick = a),
          (document.getElementById("rhGo").onclick = () => {
            const o = e[+document.getElementById("rhAdd").value],
              n = +document.getElementById("rhProg").value,
              [, , s, r] = REHAB[n],
              i = t[n];
            return state.money < i
              ? notice("Flat broke", `You can't afford ${r}.`, null, !1, brokeRows(i))
              : (a(),
                screen.classList.remove("open"),
                i && ((state.money -= i), chaChing()),
                chance(Math.min(0.95, s + state.stats.Smarts / 1e3))
                  ? (e.splice(e.indexOf(o), 1),
                    say(
                      fx(
                        { Health: +rint(4, 10), Happiness: +rint(6, 12) },
                        `I completed ${r} and beat my ${o} addiction!`,
                      ),
                    ),
                    notice("Clean", `You completed ${r} and beat your ${o} addiction!`, null, !0))
                  : (say(
                      fx({ Happiness: -rint(1, 4) }, `I went to ${r} for my ${o} addiction, but I relapsed.`),
                    ),
                    void notice(
                      "Relapse",
                      `You went to ${r} for your ${o} addiction, but you relapsed.<br><br>Don't give up. You can try again.`,
                      null,
                      !0,
                    )));
          }),
          evWrap.classList.add("open");
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || !addictions().length) return;
        let e = 0,
          t = 0;
        for (const a of addictions()) (e += rint(1, 4)), (t += rint(0, 3));
        (state.stats.Health = clamp(state.stats.Health - Math.min(e, 7))),
          (state.stats.Happiness = clamp(state.stats.Happiness - Math.min(t, 5)));
        const a = addictions().find(() => chance(0.04));
        a && (addictions().splice(addictions().indexOf(a), 1), say(`I managed to quit ${a} on my own.`)),
          renderStats();
        const o = addictions().find((e) =>
          ["fentanyl", "heroin", "meth", "cocaine", "painkillers"].includes(e),
        );
        o && chance(0.04) && (say(`I overdosed on ${o}.`), setTimeout(() => die(`an overdose of ${o}`), 500));
      });
      const CLUB_FIGHT_MOVES = [
        "Roundhouse Kick",
        "Uppercut",
        "Punch",
        "Slap",
        "Headbutt",
        "Elbow Strike",
        "Body Slam",
        "Haymaker",
        "Karate Chop",
        "Knee Strike",
      ];
      function clubArgument() {
        const e = chance(0.75) ? "m" : "f",
          t = "f" === e ? "her" : "him",
          a = "f" === e ? "She" : "He",
          o = "f" === e ? "Her" : "His";
        jCard({
          tag: "Conflict",
          iconSrc: "emoji/1f92c.png",
          title: "Argument",
          surprise: !0,
          lead: `Someone on the dancefloor started arguing with you because you bumped into ${t}.`,
          choices: [
            [
              `Walk away from ${t}`,
              () => {
                say("I walked away from an argument at the club.");
              },
            ],
            [
              `Attack ${t}`,
              () =>
                setTimeout(() => {
                  ev.classList.remove("death18"),
                    (ev.innerHTML = `<div class="jcw"><div class="jm-tag" style="margin-top:12px">Conflict</div><h4><img src="kid/fist.png" alt=""><span>Attack</span></h4>\n            <div class="lead">How will you attack ${t}?</div>\n            <label class="hr-lab">Pick your move:</label><div class="hr-sel"><select id="cfMove">${CLUB_FIGHT_MOVES.map((e) => `<option>${e}</option>`).join("")}</select></div>\n            <label class="hr-lab">Pick your target:</label><div class="hr-sel"><select id="cfTarget">${ATTACK_TARGETS.map((e) => `<option value="${e}">${o} ${e}</option>`).join("")}</select></div>\n            <button class="jm-apply ev-btn" id="cfGo">Attack ${t}</button></div>`),
                    evWrap.classList.add("open"),
                    (document.getElementById("cfGo").onclick = () => {
                      const t = document.getElementById("cfMove").value.toLowerCase(),
                        o = document.getElementById("cfTarget").value,
                        n = rint(20, 100);
                      evWrap.classList.remove("open"),
                        say("I attacked someone who argued with me at the club."),
                        notice(
                          "Take that",
                          `You delivered a${/^[aeiou]/.test(t) ? "n" : ""} ${t} to ${"f" === e ? "her" : "his"} ${o}!`,
                          () => {
                            chance(0.4) &&
                              (say(`${a} called the cops on me.`),
                              notice(
                                "What a snitch",
                                `${a} called the cops on you!`,
                                () => arrest("assault"),
                                !0,
                              ));
                          },
                          !0,
                          `<div class="ev-bars nb"><b>Damage</b><i><u style="width:${n}%;background:#b3261e"></u></i></div>`,
                        );
                    });
                }, 80),
            ],
            [
              `Argue back to ${t}`,
              () => {
                if (chance(0.3))
                  return (
                    hurt(),
                    fx({ Health: -rint(4, 10) }, ""),
                    say(`I argued with someone at the club and ${"f" === e ? "she" : "he"} punched me.`),
                    notice(
                      "Ouch!",
                      `You argued back and ${"f" === e ? "she" : "he"} punched you in the face!`,
                      null,
                      !0,
                    )
                  );
                say("I argued with someone at the club."),
                  notice(
                    "Heated",
                    "You and the stranger shouted at each other until the bouncer split you up.",
                    null,
                    !0,
                  );
              },
            ],
          ],
        });
      }
      function hookupCard(e, t) {
        const a = state.lovers.find((e) => e.main),
          o = "f" === e.g ? "her" : "him",
          n = "f" === e.g ? "girl" : "guy",
          s = a
            ? "No, I'm a faithful " +
              ("Lover" === loverTitle(a)
                ? "partner"
                : "m" === PG()
                  ? state.spouse === a
                    ? "husband"
                    : "boyfriend"
                  : state.spouse === a
                    ? "wife"
                    : "girlfriend")
            : "No, I'm not into that",
          r = loveCard(
            e,
            `<h4><img src="night/hookup.png"><span>Hook Up</span></h4>\n      <div class="lead">${a ? `Even though you have a ${loverTitle(a).toLowerCase()}, you` : "You"} have an opportunity to have a one night stand with a ${n} named ${e.first} ${e.last}${t ? ` at ${t}` : ""}.<br><br>What will you do?</div>\n      <table><tbody>${[
              ["Name", `${e.first} ${e.last}`],
              ["Gender", genderWord(e)],
              ["Age", loverAge(e)],
              ["Sexuality", e.sexuality],
            ]
              .map(([e, t]) => `<tr><td style="text-align:center;padding-left:0"><b>${e}:</b> ${t}</td></tr>`)
              .join(
                "",
              )}</tbody></table>\n      <div class="ev-bars">${loveBar("Looks", e.looks)}</div>\n      <button class="jm-apply ev-btn" data-h="1">Sleep with ${o}</button><button class="jm-apply ev-btn" data-h="0">${s}</button>\n      <div class="ev-surprise"><img src="emoji/1f3b2.png"><span>Surprise me!</span></div>`,
          ),
          i = (o) => {
            if ((r(), !o))
              return (
                screen.classList.remove("open"),
                say(`I turned down a one night stand with ${e.first}${t ? ` at ${t}` : ""}.`),
                notice("Maybe next time", `You turned down ${e.first}.`, null, !0)
              );
            setTimeout(() => safeSexCard(e, a), 80);
          };
        ev.querySelectorAll("[data-h]").forEach((e) => (e.onclick = () => i("1" === e.dataset.h))),
          (ev.querySelector(".ev-surprise").onclick = () => i(chance(0.5)));
      }
      function safeSexCard(e, t) {
        jCard({
          tag: "Love",
          person: { name: `${e.first} ${e.last}`, look: e.look, g: e.g, age: loverAge(e), mood: "happy" },
          iconSrc: "night/safesex.png",
          title: "Safe Sex",
          lead: `Things are getting hot with ${e.first} ${e.last} and you're thinking about safe sex.<br><br>What will you do?`,
          surprise: !0,
          choices: [
            ["Use a condom", () => hookupResult(e, !0, t)],
            ["Don't use a condom", () => hookupResult(e, !1, t)],
          ],
        });
      }
      function hookupSound() {
        new Audio(sndSrc({ src: `sounds/a16_sndHookup${"f" === PG() ? "Female" : "Male"}.wav` }))
          .play()
          .catch(() => {});
      }
      function hookupResult(e, t, a) {
        screen.classList.remove("open");
        const o = "f" === e.g ? "She" : "He",
          n = o.toLowerCase(),
          s = "f" === e.g ? "Her" : "His",
          r = rint(45, 100),
          i = rint(5, 100);
        fx({ Happiness: +rint(4, 9) }, ""), (state.notVirgin = !0), hookupSound();
        const l = any([
          `${o} tells you ${n} will call you, but never does.`,
          `${o} snuck out before you woke up.`,
          `${o} gave you ${"f" === e.g ? "her" : "his"} number, but it turned out to be fake.`,
          `${o} called you a cab and said it was fun.`,
          `${o} said you should do it again sometime.`,
        ]);
        if (
          (say(
            `I had a one night stand with ${e.first} ${e.last}${t ? "" : " and we didn't use protection"}.`,
          ),
          catchSTDs(t),
          a && window.LOVE && chance(0.25) && queuePopup(() => LOVE.caughtCheating(a, e)),
          notice(
            "Oh yeah",
            `You had a one night stand with ${e.first} ${e.last}.<br><br>${l}`,
            null,
            !0,
            `<div class="ev-bars nb"><b>Your Enjoyment</b><i><u style="width:${r}%;background:${barCol(r)}"></u></i><b>${s} Enjoyment</b><i><u style="width:${i}%;background:${barCol(i)}"></u></i></div>`,
          ),
          e.g === BIO())
        )
          return;
        const c = state.attrs && null != state.attrs.Fertility ? state.attrs.Fertility : 50;
        return chance(Math.min(0.85, (t ? 0.04 : 0.4) * Math.max(0.2, c / 50)))
          ? "f" === BIO() && window.LOVE
            ? queuePopup(() =>
                LOVE.pregnancyCard(
                  { first: e.first, last: e.last, g: e.g, look: e.look },
                  { fling: !0, cheatingOn: a },
                ),
              )
            : void (state.babies ||= []).push({
                due: state.age + 1,
                keep: chance(0.7),
                other: { first: e.first, last: e.last, g: e.g, look: e.look },
              })
          : void 0;
      }
      function miscarriageCard(e) {
        const t = "f" === BIO(),
          a = e.other.first;
        say(
          t
            ? "I suffered a miscarriage and lost the baby."
            : `My ${e.role || "partner"}, ${a}, suffered a miscarriage.`,
        ),
          fx({ Happiness: -rint(10, 20) }, ""),
          jCard({
            tag: "Baby",
            iconSrc: "love2/miscarriage.png",
            title: "Miscarriage",
            ok: () => {},
            lead: t
              ? "You suffered a first-trimester miscarriage and lost the baby!"
              : `Your ${e.role || "partner"}, ${a}, suffered a first-trimester miscarriage and lost the baby!`,
          });
      }
      function mixSkin(e, t) {
        const a = (e) =>
            /^#[0-9a-f]{6}$/i.test(e || "") ? [1, 3, 5].map((t) => parseInt(e.slice(t, t + 2), 16)) : null,
          o = a(e),
          n = a(t);
        if (!o || !n) return o ? e : n ? t : null;
        const s = (e) => 0.3 * e[0] + 0.59 * e[1] + 0.11 * e[2],
          [r, i] = s(o) <= s(n) ? [o, n] : [n, o],
          l = (e) =>
            "#" +
            r
              .map((t, a) =>
                Math.round(t + (i[a] - t) * e)
                  .toString(16)
                  .padStart(2, "0"),
              )
              .join("");
        if (Math.abs(s(o) - s(n)) < 18) return l(Math.random());
        const c = Math.random();
        return l(
          c < 0.35 ? rint(0, 15) / 100 : c < 0.85 ? 0.3 + 0.4 * Math.random() : 0.85 + rint(0, 15) / 100,
        );
      }
      function babyCard(e) {
        const t = chance(0.5) ? "m" : "f",
          a = randomLook(t, 0),
          o = "f" === t ? "girl" : "boy",
          n = "f" === t ? "her" : "him",
          s = "f" === BIO(),
          r = [...new Set([SURNAME, e.other.last])],
          i =
            e.other.look ||
            (
              [state.spouse, ...(state.lovers || []), ...(state.exes || [])].find(
                (t) => t && t.first === e.other.first && t.last === e.other.last,
              ) || {}
            ).look,
          l = mixSkin(state.look.skin, i && i.skin);
        l && (a.skin = l),
          ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="ev-tag" style="margin-top:12px"><i class="bav"></i><span class="who"></span><span class="kind">Baby</span></div>\n      <h4><img src="night/${"f" === t ? "girl" : "boy"}.png" alt=""><span>Baby ${"f" === t ? "Girl" : "Boy"}</span></h4>\n      <div class="lead">${e.surrogate ? `Your surrogate, ${e.surrogate.first}, just gave birth to your baby ${o}!` : s ? `You just gave birth to a baby ${o}!` : `Your ${e.role || "fling"}, ${e.other.first}, just gave birth to a baby ${o}!`}<br><br>What will you name ${n}?</div>\n      <label class="hr-lab">Name:</label><input class="pet-name-in" id="bbName" maxlength="20" value="${uname(t)}"><div class="bb-rand" id="bbRand">Pick Random</div>\n      <label class="hr-lab" style="margin-top:14px">Last Name:</label><div class="hr-sel"><select id="bbLast">${r.map((e) => `<option>${e}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="bbGo">Select name</button></div>`),
          ev.querySelector(".bav").replaceWith(npcFace(a, t, 0, "happy", "ev-av")),
          (document.getElementById("bbRand").onclick = () => {
            document.getElementById("bbName").value = uname(t);
          }),
          (document.getElementById("bbGo").onclick = () => {
            const n =
                (document.getElementById("bbName").value || "")
                  .replace(/[<>"&]/g, "")
                  .trim()
                  .slice(0, 20) || uname(t),
              s = document.getElementById("bbLast").value;
            evWrap.classList.remove("open");
            const r = {
              kind: "child",
              g: t,
              first: n,
              last: s,
              ageOffset: -state.age,
              look: a,
              rel: rint(85, 100),
              otherParent: `${e.other.first} ${e.other.last}`,
              smarts: rint(10, 100),
              looks: rint(10, 100),
            };
            state.family.push(r),
              play("baby"),
              say(`I became the ${"f" === PG() ? "mother" : "father"} of a baby ${o} named ${n} ${s}.`);
            const i = state.royal,
              l = state.spouse && !state.spouse.dead,
              c =
                !i || i.abdicated || l
                  ? null
                  : () =>
                      queuePopup(() =>
                        royalOutrage(
                          `The public is criticizing you for having a child, ${n}, outside of marriage${state.spouse && state.spouse.dead ? " so soon after the death of your spouse" : ""}.`,
                          "baby",
                        ),
                      );
            notice(
              `${n} ${s}`,
              `You are the ${"f" === PG() ? "mother" : "father"} of a baby ${o} named ${n} ${s}.`,
              c,
              !0,
              `<div class="ev-bars nb"><b>Smarts</b><i><u style="width:${r.smarts}%;background:${barCol(r.smarts)}"></u></i><b>Looks</b><i><u style="width:${r.looks}%;background:${barCol(r.looks)}"></u></i></div>`,
            );
          }),
          evWrap.classList.add("open");
      }
      function openLover(e) {
        const t = state.lovers[e];
        if (!t) return openRelationships();
        const a = herOf(t),
          o = loverTitle(t);
        (sTitle.textContent = o.toUpperCase()),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openRelationships),
          (sList.innerHTML =
            `<div class="row sm" data-prof="1"><i class="lvc"></i><div class="t"><b>${t.first} ${t.last} <em>(Age ${loverAge(t)})</em></b>${relBar(t.rel)}</div>${DOTS}</div><div class="row sm" data-a="edit"><img src="rel/edit.png"><div class="t"><b>Edit</b><span>Edit ${a}</span></div>${GOD_SEAL}</div><div class="sec">Activities</div>` +
            relActRows(a, [
              ["date", "love/date.png", "Date", `Go on a date with ${a}`],
              ["breakup", "love/exes.png", "Break Up", `Break up with ${a}`],
            ])),
          sList.querySelector("i.lvc").replaceWith(npcFace(t.look, t.g, loverAge(t), moodOf(t.rel), "face")),
          (sList.scrollTop = 0),
          (sList.querySelector("[data-prof]").onclick = () =>
            t.celebDate ? celebProfile(t, o) : profileCard(t, loverAge(t), `${t.first} ${t.last}`, o)),
          bindRelActs(
            t,
            { role: o, name: `${t.first} ${t.last}`, g: t.g, age: loverAge(t) },
            () => openLover(state.lovers.indexOf(t)),
            {
              edit: () =>
                godEdit(t, { role: o, age: loverAge(t), g: t.g }, () => openLover(state.lovers.indexOf(t))),
              date: () => {
                const e = pickR([
                  "a fancy restaurant",
                  "the movies",
                  "a picnic in the park",
                  "a karaoke bar",
                  "the beach",
                  "a bowling alley",
                  "a comedy club",
                ]);
                (t.rel = clamp(t.rel + relGain(t, 8, 16))),
                  (t.seenAt = state.age),
                  fx({ Happiness: +rint(3, 7) }, ""),
                  say(`I took my ${o.toLowerCase()}, ${t.first}, on a date to ${e}.`),
                  screen.classList.remove("open"),
                  notice("Date night", `You took ${t.first} on a date to ${e}.`, null, !0);
              },
              breakup: () =>
                iosConfirm("Confirm", `Are you sure you want to break up with ${t.first}?`, () => {
                  toEx(t),
                    fx({ Happiness: -rint(2, 8) }, ""),
                    say(`I broke up with ${t.first} ${t.last}.`),
                    screen.classList.remove("open"),
                    notice("Heartbreak", `You broke up with ${t.first}.`, null, !0);
                }),
            },
          );
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || !state.babies || !state.babies.length) return;
        const e = state.babies.filter((e) => e.due <= state.age);
        (state.babies = state.babies.filter((e) => e.due > state.age)),
          e.forEach((e) =>
            e.adopt
              ? say(
                  "f" === BIO()
                    ? "I gave birth and put the baby up for adoption."
                    : `My ${e.role}, ${e.other.first}, gave birth, and we put the baby up for adoption.`,
                )
              : e.surrogate && chance(0.15)
                ? queuePopup(() => {
                    const t = e.surrogate;
                    say(`My surrogate, ${t.first} ${t.last}, gave birth and ran off with my baby!`),
                      fx({ Happiness: -rint(15, 25) }, ""),
                      addSuit({
                        name: `${t.first} ${t.last}`,
                        who: "Surrogate",
                        reason: "running off with your baby",
                        strength: 0.62,
                        scale: localPrice(1e3 * rint(100, 400)),
                      }),
                      notice(
                        "Gone!",
                        `Your surrogate, ${t.first} ${t.last}, gave birth and ran off with your baby!<br><br>Nobody knows where she went.`,
                        null,
                        !0,
                      );
                  })
                : e.keep
                  ? chance(0.08)
                    ? queuePopup(() => miscarriageCard(e))
                    : void queuePopup(() => babyCard(e))
                  : say(
                      `My fling, ${e.other.first}, told me ${"f" === e.other.g ? "she" : "he"} was pregnant, but decided not to keep the baby.`,
                    ),
          );
      });
      const hit = (e) => {
        const t = (window.LifeEvents && LifeEvents.HAPPY_HIT[e]) || 10;
        return Math.max(1, Math.round(t * (0.8 + 0.2 * Math.random())));
      };
      function breakupRisk(e) {
        const t = clamp(e.rel);
        let a = t <= 5 ? 1 : t < 10 ? 0.85 : t < 20 ? 0.6 : t < 30 ? 0.25 : t < 40 ? 0.06 : 0;
        return (
          a &&
            ((a += (clamp(e.crazy ?? 50) / 100) * 0.05),
            (a += 0.02 * Math.min(e.neglectYears || 0, 4)),
            e.unresolvedArgument && (a += 0.05),
            e.discoveredCheating && (a += 0.15)),
          state.prison && (a += 0.14),
          Math.min(t <= 5 ? 1 : 0.9, a)
        );
      }
      function breakupReason(e) {
        const t = sheOf(e);
        return state.prison
          ? `${t} says ${"f" === e.g ? "she" : "he"} can't wait around for someone in prison.`
          : e.discoveredCheating
            ? `${t} can't get over you cheating.`
            : (e.neglectYears || 0) >= 2
              ? `${t} says it's because you never spend time together anymore.`
              : `${t} says ${pickR(["you two have grown apart", "it's time to see other people", "the spark just isn't there anymore", "your habits drive " + herOf(e) + " crazy", "you use way too many hashtags", "you chew too loudly", "you never laugh at " + ("f" === e.g ? "her" : "his") + " jokes", "you snore like a chainsaw", "you talk about yourself too much", "you're too clingy", "your taste in music is terrible", "you take too many selfies"])}.`;
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead) return;
        [...state.lovers].forEach((e) => {
          (e.neglectYears = e.rel <= (e.lastRel ?? e.rel) ? (e.neglectYears || 0) + 1 : 0),
            (e.rel = clamp(e.rel - (e.seenAt >= state.age - 1 ? rint(0, 2) : rint(3, 8)))),
            (e.lastRel = e.rel),
            (e.willpower ??= rint(0, 100));
        });
        const e = [...state.lovers]
          .filter((e) => !e.married)
          .sort((e, t) => t.main - e.main)
          .find((e) => chance(breakupRisk(e)));
        e && queuePopup(() => breakupEvent(e, breakupReason(e)));
      }),
        (state.pets = []);
      const PET_NAMES = [
          "Ryleigh",
          "Panther",
          "Zelda",
          "Moneypenny",
          "Dot",
          "Giovanni",
          "Fender",
          "Amaya",
          "Sheila",
          "Odin",
          "Slim",
          "Juju",
          "Christian",
          "Speck",
          "Oro",
          "Federico",
          "Monte",
          "Felix",
          "Biscuit",
          "Luna",
          "Max",
          "Bella",
          "Charlie",
          "Coco",
          "Rocky",
          "Daisy",
          "Milo",
          "Nala",
          "Simba",
          "Oreo",
          "Pepper",
          "Ziggy",
          "Bruno",
          "Mochi",
          "Peanut",
          "Shadow",
          "Ginger",
          "Buster",
          "Rosie",
          "Loki",
          "Tank",
          "Pickles",
          "Waffles",
          "Noodle",
          "Gizmo",
          "Pumpkin",
          "Snickers",
          "Duke",
          "Sasha",
          "Ace",
          "Bandit",
          "Cleo",
          "Kiwi",
          "Sunny",
          "Pip",
          "Hazel",
          "Rex",
          "Zeus",
          "Apollo",
          "Mittens",
          "Smokey",
          "Toffee",
          "Bubbles",
          "Nemo",
          "Scales",
          "Sir Hiss",
          "Chewie",
          "Kong",
        ],
        PET_COLORS = {
          Dog: ["Brown", "Black", "White", "Tan", "Golden", "Gray", "Brindle", "Spotted", "Red", "Cream"],
          Cat: ["Orange", "Black", "White", "Gray", "Calico", "Cream", "Brown", "Tabby"],
          Bird: ["Green", "Yellow", "Blue", "Red", "White", "Gray"],
          Fish: ["Orange", "Red", "Blue", "Purple", "Gold"],
          Snake: ["Brown", "Orange", "Green", "Yellow", "Black", "Striped"],
        },
        petSprite = (e) => `pets/${e.sprite}.png`,
        petWord = (e) =>
          "Mutt" === e.breed ? "mutt" : ("Dog" === e.species || e.species, e.breed.toLowerCase()),
        petAgeLabel = (e) =>
          e.age > 0
            ? `${e.age}-Year Old ${e.species}`
            : "Dog" === e.species
              ? "Puppy"
              : "Cat" === e.species
                ? "Kitten"
                : `Baby ${e.species}`,
        pHim = (e) => ("m" === e.g ? "him" : "her"),
        pHe = (e) => ("m" === e.g ? "He" : "She");
      function makePet(e, t) {
        let a = e;
        if ("Mutt" === e.n) {
          const o = PETS.filter((e) => "Dog" === e.sp && "Mutt" !== e.n && e.w.includes("b"));
          "shelter" === t && chance(0.3) ? (e = a = pickR(o)) : (a = pickR(o));
        }
        const o = chance(0.5) ? "m" : "f",
          n = "Fish" === e.sp ? rint(0, 1) : rint(0, Math.min(12, Math.round(0.6 * e.life)));
        let s = rint(
          { shelter: 40, store: 120, breeder: 600, exotic: 500 }[t],
          { shelter: 350, store: 1500, breeder: 4500, exotic: 3e3 }[t],
        );
        return (
          "exotic" === t &&
            (s =
              {
                "Big Cat": rint(2e4, 12e4),
                Primate: rint(8e3, 6e4),
                Lizard: rint(15e3, 4e4),
                Pangolin: rint(1e4, 3e4),
                Platypus: rint(15e3, 5e4),
                Zebra: rint(3e3, 12e3),
                Sloth: rint(5e3, 15e3),
                Skunk: rint(300, 800),
                Dog: rint(2e3, 9e3),
                Cat: rint(900, 8e3),
                Snake: rint(500, 3e3),
                Bird: rint(1e3, 4e3),
              }[e.sp] || s),
          {
            breed: e.n,
            species: e.sp,
            sprite: a.s + pickR([...a.v]),
            name: pickR(PET_NAMES),
            g: o,
            age: n,
            life: e.life,
            color: pickR(PET_COLORS[e.sp] || ["Brown", "Gray", "Black", "White"]),
            price: s,
            expense: Math.max(15, Math.min(3e3, Math.round(s * (0.08 + 0.05 * Math.random())))),
            health: rint(50, 100),
            happy: rint(45, 100),
            smarts: rint(5, 100),
            crazy: rint(0, 100),
            rel: rint(5, 30),
            exotic: "exotic" === t,
          }
        );
      }
      const petPool = (e) => PETS.filter((t) => [...e].some((e) => t.w.includes(e))),
        shelterList = () =>
          Array.from({ length: rint(9, 15) }, () => makePet(pickR(petPool("d")), "shelter")),
        storeList = () => Array.from({ length: rint(9, 15) }, () => makePet(pickR(petPool("ds")), "store")),
        dogBreeds = () =>
          [...PETS.filter((e) => "Dog" === e.sp && "b" === e.w)]
            .sort(() => Math.random() - 0.5)
            .slice(0, rint(10, 16))
            .sort((e, t) => e.n.localeCompare(t.n)),
        catBreeds = () =>
          [...PETS.filter((e) => "Cat" === e.sp && e.w.includes("b"))]
            .sort(() => Math.random() - 0.5)
            .slice(0, rint(6, 9))
            .sort((e, t) => e.n.localeCompare(t.n));
      function openPets() {
        state.petShop ||
          (state.petShop = {
            shelter: shelterList(),
            store: storeList(),
            dogs: dogBreeds(),
            cats: catBreeds(),
            exotic: makePet(pickR(petPool("x")), "exotic"),
          }),
          (sTitle.textContent = "PETS"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const e = (e, t, a, o, n, s) =>
          `<div class="row${s ? " dis" : ""}" data-pt="${e}"><img src="pets/${t}.png"><div class="t"><b>${a}</b><span>${o}</span></div>${s ? "" : n}</div>`;
        (sList.innerHTML =
          e("shelter", "ui-shelter", "Animal Shelter", "Rescue an animal in need", CHEV) +
          e("cats", "ui-cat", "Cat Breeders", "Buy a pure bred cat", CHEV) +
          e("dogs", "ui-dog", "Dog Breeders", "Buy a pure bred dog", CHEV) +
          e("exotic", "ui-exotic", "Exotic Pet Dealer", "Look for an exotic pet", DOTS, state.age < 18) +
          (mods.exoticMarket
            ? e(
                "market",
                "ui-exoticpet",
                "Exotic Animal Market",
                "Every exotic animal at real-world prices",
                CHEV,
                state.age < 18,
              )
            : "") +
          e("horse", "ui-horse", "Horse Ranch", "Buy a horse", "", !0) +
          e("store", "ui-store", "Pet Store", "Visit the pet store", CHEV)),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-pt]").forEach(
            (e) =>
              (e.onclick = () => {
                const t = e.dataset.pt;
                if (!e.classList.contains("dis"))
                  return "market" === t
                    ? state.age < 18
                      ? notice(
                          "Exotic Animal Market",
                          "You must be at least 18 to buy an exotic pet.",
                          null,
                          !0,
                        )
                      : openExoticMarket()
                    : "shelter" === t
                      ? petListing("ANIMAL SHELTER", state.petShop.shelter, "shelter")
                      : "store" === t
                        ? petListing("PET STORE", state.petShop.store, "store")
                        : "cats" === t
                          ? breedList("CAT BREEDERS", state.petShop.cats, "This Year's Breeds")
                          : "dogs" === t
                            ? breedList("DOG BREEDERS", state.petShop.dogs, "This Year's Breeds")
                            : "exotic" === t
                              ? state.age < 18
                                ? notice(
                                    "Exotic Pet Dealer",
                                    "You must be at least 18 to buy an exotic pet.",
                                    null,
                                    !0,
                                  )
                                : state.petShop.exotic
                                  ? petBuyCard(state.petShop.exotic, "exotic")
                                  : notice(
                                      "Exotic Pet Dealer",
                                      "The exotic pet dealer doesn't have any more animals this year. Check back next year!",
                                      null,
                                      !0,
                                    )
                              : void 0;
              }),
          );
      }
      (state.petShop = null),
        document.getElementById("ageBtn").addEventListener("click", () => {
          state.dead || (state.petShop = null);
        });
      const EXOTIC_REAL_PRICES = {
        Gorilla: 4e5,
        Platypus: 1e5,
        Chimpanzee: 65e3,
        "Komodo Dragon": 5e4,
        Pangolin: 25e3,
        Lion: 15e3,
        "Black Panther": 15e3,
        Leopard: 1e4,
        Jaguar: 8e3,
        "Bengal Tiger": 7500,
        Sloth: 7500,
        Macaque: 6e3,
        Zebra: 6e3,
        "Squirrel Monkey": 5e3,
        Macaw: 4e3,
        Wolf: 3500,
        "Sphynx Cat": 3e3,
        Wildcat: 3e3,
        Parrot: 2500,
        Bobcat: 2500,
        "Mountain Lion": 2500,
        Dingo: 1e3,
        Coyote: 700,
        Skunk: 350,
        "Boa Constrictor": 300,
        "Burmese Python": 250,
      };
      function openExoticMarket() {
        (sTitle.textContent = "EXOTIC MARKET"), (sBack.innerHTML = BACK_ICON), (sBack.onclick = openPets);
        const e = petPool("x")
          .map((e) => [e, EXOTIC_REAL_PRICES[e.n] || 5e3])
          .sort((e, t) => t[1] - e[1]);
        (sList.innerHTML =
          '<div class="sec">Real-World Prices</div>' +
          e
            .map(
              ([e, t], a) =>
                `<div class="row" data-em="${a}"><img src="pets/${e.s}a.png"><div class="t"><b>${e.n}${e.sp !== e.n ? ` <em>(${e.sp})</em>` : ""}</b><span class="sal">${usd(t)}</span></div>${DOTS}</div>`,
            )
            .join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-em]").forEach(
            (t) =>
              (t.onclick = () => {
                const [a, o] = e[+t.dataset.em],
                  n = makePet(a, "exotic");
                (n.price = o),
                  (n.expense = Math.max(30, Math.min(8e3, Math.round(0.015 * o + rint(20, 200))))),
                  petBuyCard(n, "market");
              }),
          );
      }
      function petListing(e, t, a) {
        (sTitle.textContent = e),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openPets),
          (sList.innerHTML = t
            .map(
              (e, t) =>
                `<div class="row" data-pi="${t}"><img src="${petSprite(e)}"><div class="t"><b>${e.name} <em>(${e.breed})</em></b><span>${petAgeLabel(e)}</span></div>${DOTS}</div>`,
            )
            .join("")),
          (sList.scrollTop = 0),
          sList
            .querySelectorAll("[data-pi]")
            .forEach((e) => (e.onclick = () => petBuyCard(t[+e.dataset.pi], a, t)));
      }
      function breedList(e, t, a) {
        (sTitle.textContent = e),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openPets),
          (sList.innerHTML =
            (a ? `<div class="sec">${a}</div>` : "") +
            t
              .map(
                (e, t) =>
                  `<div class="row" data-bi="${t}"><img src="pets/${e.s}a.png"><div class="t"><b>${e.n}</b></div>${CHEV}</div>`,
              )
              .join("")),
          (sList.scrollTop = 0),
          sList
            .querySelectorAll("[data-bi]")
            .forEach((e) => (e.onclick = () => petBuyCard(makePet(t[+e.dataset.bi], "breeder"), "breeder")));
      }
      const petHead = (e) =>
          `<div class="ev-tag" style="margin-top:12px"><img class="ev-av" src="${petSprite(e)}" style="object-fit:contain"><span class="who">${e.name}</span><span class="kind">${"Dog" === e.species || "Cat" === e.species ? e.species : "Pet"}</span></div>`,
        petBars = (e, t) =>
          `<div class="ev-bars">${(t ? [["Relationship", e.rel]] : [])
            .concat([
              ["Health", e.health],
              ["Happiness", e.happy],
              ["Smarts", e.smarts],
              ["Craziness", e.crazy, "o"],
            ])
            .map(
              ([e, t, a]) =>
                `<b>${e}</b><i><u style="width:${Math.max(t, 1)}%;background:${barCol(a ? 100 - t : t)}"></u></i>`,
            )
            .join("")}</div>`,
        X_CARD =
          '<svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg>';
      function petCard(e) {
        (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px">${X_CARD}</div>` + e),
          (ev.style.overflow = "visible");
        const t = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        return (document.getElementById("propX").onclick = t), evWrap.classList.add("open"), t;
      }
      function petBuyCard(e, t, a) {
        const o = {
            shelter: "animal shelter",
            store: "pet store",
            breeder: "breeder",
            exotic: "exotic pet dealer",
            market: "exotic animal market",
          }[t],
          n =
            "exotic" === t || "market" === t
              ? "pets/ui-exoticpet.png"
              : "shelter" === t
                ? "pets/ui-shelter.png"
                : "store" === t
                  ? "pets/ui-store.png"
                  : `pets/ui-${"Cat" === e.species ? "cat" : "dog"}.png`,
          s = {
            shelter: "Adoption",
            store: "Pet Store",
            breeder: "Breeder",
            exotic: "Exotic Pet",
            market: "Exotic Pet",
          }[t],
          r = petCard(
            petHead(e) +
              `<h4><img src="${n}"><span>${s}</span></h4>\n      <div class="lead">The ${o} has ${/^[aeiou]/i.test(petWord(e)) ? "an" : "a"} ${petWord(e)} named ${e.name} available for ${usd(e.price)}.</div>\n      <table><tbody>${[
                ["Age", e.age ? `${e.age} Year${e.age > 1 ? "s" : ""}` : petAgeLabel(e)],
                ["Gender", "m" === e.g ? "Male" : "Female"],
                ["Color", e.color],
                ["Price", usd(e.price)],
                ["Monthly Expense", usd(e.expense)],
              ]
                .map(
                  ([e, t]) => `<tr><td style="text-align:center;padding-left:0"><b>${e}:</b> ${t}</td></tr>`,
                )
                .join(
                  "",
                )}</tbody></table>\n      ${petBars(e)}<button class="jm-apply ev-btn" id="petBuy">${"shelter" === t ? "Adopt" : "Buy"} ${pHim(e)}</button>`,
          );
        document.getElementById("petBuy").onclick = () => (
          r(),
          state.age < 15
            ? notice("Too Young", "You must be at least 15 to get a pet of your own.", null, !0)
            : e.exotic && state.age < 18
              ? notice("Too Young", "You must be at least 18 to buy an exotic pet.", null, !0)
              : state.money < e.price
                ? notice("Not enough", `You need ${usd(e.price)} to get ${e.name}.`, null, !0)
                : ((state.money -= e.price),
                  renderStats(),
                  screen.classList.remove("open"),
                  a && a.splice(a.indexOf(e), 1),
                  "exotic" === t && state.petShop && (state.petShop.exotic = null),
                  (e.rel = rint(15, 35)),
                  state.pets.push(e),
                  say(
                    `I ${"shelter" === t ? "adopted" : "bought"} ${/^[aeiou]/i.test(petWord(e)) ? "an" : "a"} ${petWord(e)} named ${e.name} from the ${o}. ${pHe(e)} cost ${usd(e.price)}.`,
                  ),
                  void notice(
                    "True love",
                    `You are now the owner of ${/^[aeiou]/i.test(petWord(e)) ? "an" : "a"} ${petWord(e)} named ${e.name}.`,
                    () => petNameCard(e),
                    !0,
                  ))
        );
      }
      function petNameCard(e) {
        const t = petCard(
            petHead(e) +
              `<h4><img src="pets/ui-name.png"><span>Name</span></h4>\n      <div class="lead">You're thinking about changing your new ${"m" === e.g ? "male" : "female"} ${petWord(e)}'s name.<br><br>What will you do?</div>\n      <table><tbody><tr><td style="text-align:center;padding-left:0"><b>Current Name:</b> ${e.name}</td></tr><tr><td style="text-align:center;padding-left:0"><b>New Name:</b> <span id="petNew">?</span></td></tr></tbody></table>\n      <label class="hr-lab">Name:</label><input class="pet-name-in" id="petIn" maxlength="20" value="${e.name}">\n      <a class="pet-rand" id="petRand">Pick Random</a>\n      <button class="jm-apply ev-btn" id="petGo">Select name</button>`,
          ),
          a = document.getElementById("petIn"),
          o = document.getElementById("petNew");
        (a.oninput = () => (o.textContent = a.value.trim() || "?")),
          (document.getElementById("petRand").onclick = () => {
            (a.value = pickR(PET_NAMES)), a.oninput();
          }),
          (document.getElementById("petGo").onclick = () => {
            const o = a.value.trim();
            t(),
              o && o !== e.name && (say(`I renamed my ${petWord(e)} from ${e.name} to ${o}.`), (e.name = o));
          });
      }
      const PET_TREATS = {
          Dog: ["a bone", "some bacon", "a chew toy", "a peanut butter biscuit"],
          Cat: ["some catnip", "a can of tuna", "a toy mouse", "some salmon"],
          Bird: ["some seeds", "a slice of apple", "a millet spray"],
          Fish: ["some fish flakes", "a bloodworm"],
          Snake: ["a frozen mouse", "a juicy rat"],
          "Big Cat": ["a slab of steak", "a whole chicken"],
          Primate: ["a banana", "some grapes"],
        },
        PET_PASTIMES = {
          Dog: [
            "played catch with",
            "played tug-of-war with",
            "cuddled on the couch with",
            "taught a new trick to",
          ],
          Cat: [
            "played with a laser pointer with",
            "brushed",
            "cuddled with",
            "watched birds out the window with",
          ],
          Bird: ["taught a new word to", "let out of the cage to fly around"],
          Fish: ["watched", "cleaned the tank for"],
        },
        WALK_PLACES = [
          "memory lane",
          "the park",
          "the neighborhood",
          "the beach",
          "a hiking trail",
          "the dog park",
          "downtown",
        ],
        petRelTitle = (e) => pickR([" doesn't judge me", "Best buds", "Quality time", "Good times"]);
      function openPet(e) {
        const t = state.pets[e];
        if (!t) return openRelationships();
        (sTitle.textContent = ("Dog" === t.species || "Cat" === t.species ? t.species : "Pet").toUpperCase()),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openRelationships);
        const a = (e, t, a, o) =>
            `<div class="row sm" data-pa="${e}"><img src="pets/ui-${t}.png"><div class="t"><b>${a}</b><span>${o}</span></div>${DOTS}</div>`,
          o = "Dog" === t.species,
          n = [
            "Dog",
            "Cat",
            "Rabbit",
            "Hamster",
            "Gerbil",
            "Guinea Pig",
            "Rat",
            "Primate",
            "Big Cat",
          ].includes(t.species);
        (sList.innerHTML =
          `<div class="row sm" data-pa="prof"><img src="${petSprite(t)}"><div class="t"><b>${t.name} <em>(Age ${t.age})</em></b>${relBar(t.rel)}</div>${DOTS}</div><div class="sec">Activities</div>` +
          (n ? a("bathe", "bathe", "Bathe", `Give ${pHim(t)} a bath`) : "") +
          a("release", "release", "Release", `Release ${pHim(t)} into the wild`) +
          a("sell", "sell", "Sell", `Sell ${pHim(t)}`) +
          a("time", "time", "Spend Time", `Spend time with ${pHim(t)}`) +
          a("treat", "treat", "Treat", `Give ${pHim(t)} a treat`) +
          a("vet", "vet", "Veterinarian", `Take ${pHim(t)} to the vet`) +
          (o ? a("walk", "walk", "Walk", `Take ${pHim(t)} on a walk`) : "")),
          (sList.scrollTop = 0);
        const s = `your ${petWord(t)}, ${t.name}`,
          r =
            (petWord(t),
            t.name,
            (e) =>
              `<div class="ev-bars nb"><b>${"m" === t.g ? "His" : "Her"} Appreciation</b><i><u style="width:${e}%;background:${barCol(e)}"></u></i></div>`),
          i = (e, a) => {
            (t.rel = clamp(t.rel + e)), (t.happy = clamp(t.happy + a));
          },
          l = () => openPet(state.pets.indexOf(t));
        sList.querySelectorAll("[data-pa]").forEach(
          (e) =>
            (e.onclick = () => {
              const a = e.dataset.pa;
              if ("prof" === a) return petProfile(t);
              if ("bathe" === a) {
                const e = clamp(Math.round(80 - 0.6 * t.crazy + rint(-20, 20)));
                return (
                  i(e > 40 ? rint(3, 8) : rint(-3, 2), rint(2, 6)),
                  say(`I gave ${s} a bath.`),
                  void notice("That's better", `You gave ${s}, a bath.`, l, !0, r(e))
                );
              }
              if ("treat" === a) {
                const e = pickR(PET_TREATS[t.species] || ["a tasty snack"]),
                  a = clamp(rint(55, 100));
                return (
                  i(rint(5, 10), rint(4, 9)),
                  say(`I gave ${s}, ${e}.`),
                  void notice("Just for you", `You gave ${s}, ${e}.`, l, !0, r(a))
                );
              }
              if ("time" === a) {
                const e = pickR(PET_PASTIMES[t.species] || ["spent some quality time with"]);
                return (
                  i(rint(5, 12), rint(5, 10)),
                  fx({ Happiness: 3 }, ""),
                  say(`I ${e} ${s}.`),
                  void notice(petRelTitle(t), `You ${e} ${s}.`, l, !0)
                );
              }
              if ("walk" === a) {
                const e = rint(50, 100),
                  a = rint(60, 100);
                return (
                  i(rint(4, 9), rint(5, 10)),
                  (t.health = clamp(t.health + rint(1, 4))),
                  fx({ Health: 2, Happiness: 3 }, ""),
                  say(`I took ${s}, on a walk through ${pickR(WALK_PLACES)}.`),
                  void notice(
                    "We both needed it",
                    `You took ${s}, on a walk through ${pickR(WALK_PLACES)}.`,
                    l,
                    !0,
                    `<div class="ev-bars nb"><b>Your Enjoyment</b><i><u style="width:${e}%;background:${barCol(e)}"></u></i><b>${"m" === t.g ? "His" : "Her"} Enjoyment</b><i><u style="width:${a}%;background:${barCol(a)}"></u></i></div>`,
                  )
                );
              }
              if ("vet" !== a) {
                if ("release" === a)
                  return iosConfirm(
                    "Confirm",
                    `Are you sure you want to release ${s}, into the wild?`,
                    () => {
                      state.pets.splice(state.pets.indexOf(t), 1),
                        say(`I released ${s}, into the wild.`),
                        openRelationships();
                    },
                  );
                if ("sell" !== a);
                else {
                  const e = petCard(
                    petHead(t) +
                      `<h4><img src="pets/ui-sell.png"><span>Sell</span></h4>\n          <div class="lead">You're thinking about ways that you could sell ${s}.<br><br>What will you do?</div>\n          <button class="jm-apply ev-btn" data-s="ad">Post an ad online</button><button class="jm-apply ev-btn" data-s="shelter">Just take ${pHim(t)} to the shelter</button>`,
                  );
                  ev.querySelectorAll("[data-s]").forEach(
                    (a) =>
                      (a.onclick = () => {
                        if ((e(), "shelter" === a.dataset.s))
                          return (
                            state.pets.splice(state.pets.indexOf(t), 1),
                            say(`I took ${s}, to the animal shelter.`),
                            notice("Goodbye", `You dropped ${s}, off at the animal shelter.`, null, !0),
                            openRelationships()
                          );
                        const o = Math.max(5, Math.round(t.price * (0.1 + 0.5 * Math.random()))),
                          n = pickR([
                            "skater",
                            "nurse",
                            "retiree",
                            "college student",
                            "chef",
                            "farmer",
                            "teacher",
                            "trucker",
                          ]),
                          r = uname(chance(0.5) ? "m" : "f");
                        setTimeout(() => {
                          const e = petCard(
                              petHead(t) +
                                `<h4><img src="pets/ui-offer.png"><span>Offer</span></h4>\n            <div class="lead">A ${n} named ${r} responds to your ad and offers to give you ${usd(o)} for ${s}.<br><br>What will you do?</div>\n            <button class="jm-apply ev-btn" data-o="1">Sell ${pHim(t)}</button><button class="jm-apply ev-btn" data-o="0">Never mind</button>\n            <div class="ev-surprise"><img src="emoji/1f3b2.png"><span>Surprise me!</span></div>`,
                            ),
                            a = (a) => {
                              if ((e(), !a)) return say(`I decided not to sell ${s}.`);
                              state.pets.splice(state.pets.indexOf(t), 1),
                                (state.money += o),
                                renderStats(),
                                say(`I sold ${s}, to a ${n} named ${r} for ${usd(o)}.`),
                                notice(
                                  "Sold",
                                  `You sold ${s}, to a ${n} named ${r} for ${usd(o)}.`,
                                  null,
                                  !0,
                                ),
                                openRelationships();
                            };
                          ev
                            .querySelectorAll("[data-o]")
                            .forEach((e) => (e.onclick = () => a("1" === e.dataset.o))),
                            (ev.querySelector(".ev-surprise").onclick = () => a(chance(0.5)));
                        }, 250);
                      }),
                  );
                }
              } else {
                const e = t.exotic ? rint(400, 2e3) : rint(80, 200),
                  a = petCard(
                    `<div class="jm-tag" style="margin-top:12px">Veterinarian</div><h4><img src="pets/ui-vet.png"><span>${`${pickR(["Swank", "Happy Paws", "Sunny Side", "Furry Friends", "Pine Hill", "Oak Tree"])} Veterinary Clinic`}</span></h4>\n          <div class="lead">Take ${s}, to the local vet today!</div><table><tbody><tr><td style="text-align:center;padding-left:0"><b>Consultation Fee:</b> ${usd(e)}</td></tr></tbody></table>\n          <button class="jm-apply ev-btn" id="petVet">Take ${pHim(t)} to the vet</button>`,
                  );
                document.getElementById("petVet").onclick = () => {
                  if ((a(), state.money < e))
                    return notice("Not enough", `You need ${usd(e)} to take ${t.name} to the vet.`, null, !0);
                  (state.money -= e), renderStats();
                  const o = t.health < 50;
                  (t.health = clamp(t.health + rint(15, 35))),
                    i(rint(-2, 3), rint(0, 4)),
                    say(`I took ${s}, to the vet.`),
                    notice(
                      o ? "On the mend" : "Clean bill of health",
                      o
                        ? `The vet treated ${s}. ${pHe(t)} should feel better soon.`
                        : `The vet says ${s}, is perfectly healthy!`,
                      l,
                      !0,
                    );
                };
              }
            }),
        );
      }
      function petProfile(e) {
        petCard(
          petHead(e) +
            `<h4><img src="act/profile.png"><span>Profile</span></h4>\n      <table><tbody>${[
              ["Type", e.breed],
              ["Age", e.age ? `${e.age} Year${e.age > 1 ? "s" : ""}` : petAgeLabel(e)],
              ["Gender", "m" === e.g ? "Male" : "Female"],
              ["Color", e.color],
              ["Monthly Expense", usd(e.expense)],
            ]
              .map(([e, t]) => `<tr><td style="text-align:center;padding-left:0"><b>${e}:</b> ${t}</td></tr>`)
              .join("")}</tbody></table>${petBars(e, !0)}`,
        );
      }
      function iosConfirm(e, t, a) {
        const o = document.createElement("div");
        (o.className = "ios-wrap"),
          (o.innerHTML = `<div class="ios-box"><h4>${e}</h4><p>${t}</p><button data-y="1">Yes</button><button data-y="0"><b>Cancel</b></button></div>`),
          o.querySelectorAll("button").forEach(
            (e) =>
              (e.onclick = () => {
                o.remove(), "1" === e.dataset.y && a();
              }),
          ),
          document.querySelector(".phone").append(o);
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || !state.pets.length || window.PETPLUS) return;
        let e = 0;
        [...state.pets].forEach((t) => {
          t.age++,
            (e += 12 * t.expense),
            (t.happy = clamp(t.happy - rint(0, 8))),
            (t.rel = clamp(t.rel - rint(0, 5))),
            t.age > 0.7 * t.life && (t.health = clamp(t.health - rint(4, 15)));
          const a =
            t.health <= 0
              ? 1
              : t.age >= t.life
                ? 0.35 + 0.15 * (t.age - t.life)
                : t.age > 0.8 * t.life
                  ? 0.06
                  : 0.005;
          chance(a) &&
            (state.pets.splice(state.pets.indexOf(t), 1),
            fx({ Happiness: -rint(5, 12) }, ""),
            say(
              `My ${petWord(t)}, ${t.name}, died of ${t.age >= 0.8 * t.life ? "old age" : pickR(["an illness", "a sudden illness", "heart failure"])}.`,
            ),
            setTimeout(
              () =>
                notice(
                  "Rest in peace",
                  `Your ${petWord(t)}, ${t.name}, has passed away at the age of ${t.age}.`,
                ),
              600,
            ));
        }),
          (state.money = Math.max(0, state.money - e)),
          renderStats();
      });
      const SALON = [
          ["barber", "Barber", "Customize your hairstyle"],
          ["dye", "Dye Job", "Customize your hair color"],
          ["massage", "Massage", "Get a massage"],
          ["nails", "Nail Salon", "Get your nails done"],
          ["shave", "Shave", "Customize your facial hair"],
          ["tanning", "Tanning Salon", "Work on your tan"],
          ["waxing", "Waxing Salon", "Get waxed"],
        ],
        SALON_COLORS = [
          ["Black", "#1c1a1a"],
          ["Dark Brown", "#3b2416"],
          ["Brown", "#6b4226"],
          ["Auburn", "#8c3b1c"],
          ["Ginger", "#c4602a"],
          ["Strawberry Blonde", "#d99a6c"],
          ["Blonde", "#e2c27a"],
          ["Platinum", "#ece4cf"],
          ["Gray", "#9a9a9a"],
          ["White", "#f2f2f2"],
          ["Red", "#e3262b"],
          ["Pink", "#ff5fae"],
          ["Purple", "#8c4fd6"],
          ["Blue", "#2f6fe0"],
          ["Teal", "#1fc2c2"],
          ["Green", "#33c45a"],
          ["Orange", "#ff8a1f"],
        ];
