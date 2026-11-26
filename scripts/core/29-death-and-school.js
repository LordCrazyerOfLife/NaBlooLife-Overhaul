      function die(e) {
        (state.dead = !0),
          (state.deathCause = e),
          setTimeout(() => saveLife(), 2e3),
          evWrap.classList.remove("open");
        const t = state.birthYear + state.age,
          a = document.getElementById("pname").textContent;
        log.lastElementChild.insertAdjacentHTML(
          "beforeend",
          `<p>${"surrender" === e ? "I surrendered." : `I died from ${e}.`}</p>`,
        ),
          (log.scrollTop = log.scrollHeight);
        if (!!((state.job && MIL_RANKS[state.job.c]) || state.veteran)) {
          new Audio("sounds/a16_sndBugleDeath.wav").play().catch(() => {});
        } else play("death");
        document.querySelector(".phone").classList.add("died");
        const o = document.querySelector('.tab[data-tab="Occupation"]');
        if (o) {
          o.dataset.mode = "dead";
          const e = o.querySelector(".ic");
          e.classList.add("img"),
            (e.innerHTML = '<img src="ui/toolbarDeathButton.png" alt="">'),
            (o.querySelector("span").textContent = "Death");
        }
        document.getElementById("ageBtn").onclick = () => startNewLife();
        const n = document.getElementById("blood");
        n.classList.add("drop"),
          setTimeout(() => {
            const o = state.stats,
              s = a.split(" ")[0],
              [r, i] = COUNTRIES[state.country],
              l = state.city || i,
              c = state.job
                ? state.job.t
                : state.age >= 65
                  ? "Retired"
                  : state.age >= 18
                    ? "Unemployed"
                    : "Student",
              d =
                state.age < 6
                  ? "None"
                  : state.age < 18
                    ? "Primary School"
                    : o.Smarts >= 70
                      ? "University"
                      : "Secondary School",
              [u, h] =
                state.money >= 1e6
                  ? ["Wealthy", "face-dollar"]
                  : state.age >= 95
                    ? ["Ancient", "face-halo"]
                    : o.Smarts >= 80
                      ? ["Brilliant", "face-nerd"]
                      : o.Looks >= 85
                        ? ["Gorgeous", "face-cool"]
                        : o.Happiness < 25
                          ? ["Miserable", "face-crying"]
                          : o.Health < 20
                            ? ["Sickly", "face-sick"]
                            : state.age < 30
                              ? ["Tragic", "face-sobbing"]
                              : o.Happiness >= 75
                                ? ["Cheerful", "face-xd"]
                                : ["Ordinary", "face-nothing"],
              p =
                "f" === PG()
                  ? { he: "she", his: "her", He: "She", His: "Her" }
                  : { he: "he", his: "his", He: "He", His: "His" },
              m =
                "old age" === e
                  ? `died peacefully in ${p.his} sleep`
                  : "surrender" === e
                    ? "surrendered"
                    : `died from ${e}`,
              f = any(state.parents || [{ role: "Mother" }]),
              g =
                o.Smarts >= 70
                  ? `A sharp mind, ${s} was always the smartest person in the room.`
                  : o.Looks >= 80
                    ? `${s} turned heads everywhere ${p.he} went and knew it.`
                    : o.Happiness < 30
                      ? `${s} never quite found happiness. Friends say ${p.he} carried a quiet sadness all ${p.his} life.`
                      : state.money >= 1e5
                        ? `${s} worked hard and left behind a comfortable fortune.`
                        : `${s} lived a simple life and will be remembered fondly by those who knew him.`,
              y = !!(state.art && state.art.fameOn && state.art.fame >= 25),
              b = state.royal && !state.royal.abdicated ? state.royal : null;
            deathWrap.innerHTML = `\n        <div class="grave">${y ? '<img class="sash" src="ui/sash-famous.png" alt="Famous">' : ""}\n          <div class="txt">\n            <h2>${(b ? `${royWord(b.rank, PG())} ${s}` : a).toUpperCase()}</h2>\n            <h3>AGED ${state.age} ${1 === state.age ? "YEAR" : "YEARS"}</h3>\n            <ul>\n              <li><b>Net Worth:</b> ${cur()}${state.money.toLocaleString("en-US")}</li>\n              <li><b>Residence:</b> ${l === r ? l : `${l}, ${r}`}</li>\n              <li><b>Occupation:</b> ${b ? b.title : c}</li>\n              <li><b>Education:</b> ${d}</li>\n              <li><b>Lived:</b> ${state.birthYear} – ${t}</li>\n            </ul>\n            <p>${a} ${m} at the age of ${state.age}. ${b ? ("f" === PG() ? "Her" : "His") + " royal services were attended by tens of thousands of devoted followers." : state.age < 60 ? `${p.His} ${f.role.toLowerCase()} was devastated.` : `${p.He} is survived by ${p.his} memories.`}</p>\n            <p>${g}</p>\n          </div>\n          <div class="grass"></div>\n        </div>\n        <button class="continue" id="newLife">Continue</button>`;
            const v = (state.family || []).filter((e) => "child" === e.kind && !e.dead);
            (document.getElementById("newLife").onclick = () =>
              v.length
                ? (play("choice"),
                  (deathWrap.innerHTML = `<div class="heir-pick"><h2><img src="emoji/2620-fe0f.png" alt="">${a}</h2><p>Continue as one of your children, or start an all-new life!</p>\n          ${v.map((e, t) => `<button class="heir-btn ${"f" === e.g ? "g" : "b"}" data-k="${t}"><i class="face"></i>Continue as ${e.first} <small>(${Math.max(0, relAge(e))})</small></button>`).join("")}\n          <button class="heir-btn n" data-new>Start a new life!</button></div>`),
                  deathWrap.querySelectorAll("[data-k]").forEach((e) => {
                    const t = v[+e.dataset.k];
                    e
                      .querySelector(".face")
                      .replaceWith(npcFace(t.look, t.g, Math.max(0, relAge(t)), "sad", "face")),
                      (e.onclick = () => {
                        play("choice"), continueAsHeir(t);
                      });
                  }),
                  void (deathWrap.querySelector("[data-new]").onclick = () => startNewLife()))
                : startNewLife()),
              n.classList.add("fade"),
              deathWrap.classList.add("open");
          }, 1900);
      }
      document.addEventListener(
        "pointerdown",
        (e) => {
          const t = e.target.closest(
            "#ageBtn, .ev-btn, .jm-apply, #nlm .nl-btn, .pk-btn, .continue, .tab:not(.locked), .row:not(.dis), .menu-btn, #sBack, .nl-back, .jm-x, .pray, .community, .ev-surprise, .act-surrender",
          );
          t &&
            (t.classList.add("press"),
            clearTimeout(t._pt),
            (t._pt = setTimeout(() => t.classList.remove("press"), 170)));
        },
        !0,
      ),
        ageBtnEl.addEventListener(
          "click",
          (e) => {
            state.dead && e.stopImmediatePropagation();
          },
          !0,
        ),
        ageBtnEl.addEventListener("click", () => {
          (state.zeroHp = state.stats.Health <= 0 ? (state.zeroHp || 0) + 1 : 0),
            !state.dead &&
              chance(deathChance(state.age, state.stats.Health)) &&
              die(causeOfDeath(state.age, state.stats.Health));
        }),
        (SND.baby = new Audio("sounds/a16_sndBaby.wav")),
        PICK &&
          addEventListener(
            "DOMContentLoaded",
            () =>
              new Audio(sndSrc(SND.baby)).play().catch(() =>
                document.addEventListener(
                  "pointerdown",
                  () => {
                    0 === state.age && play("baby");
                  },
                  { once: !0 },
                ),
              ),
            { once: !0 },
          );
      const SCHOOL_LEVELS = [
          { min: 6, max: 10, name: "Elementary School", ico: "elementary-school" },
          { min: 11, max: 13, name: "Middle School", ico: "middle-school", logo: "ms-us" },
          { min: 14, max: 17, name: "High School", ico: "high-school", logo: "hs-us" },
        ],
        levelFor = (e) => SCHOOL_LEVELS.find((t) => e >= t.min && e <= t.max),
        barCol = (e) => (e >= 31 ? "#2fa03b" : e >= 13 ? "#f5841f" : "#b3261e"),
        sBar = (e, t) =>
          `<div class="rel">${e} <i><u style="width:${Math.max(t, 2)}%;background:${barCol(t)}"></u></i></div>`,
        SCHOOL_WORDS = [
          "Lincoln",
          "Washington",
          "Jefferson",
          "Roosevelt",
          "Riverside",
          "Oak Grove",
          "Maple Ridge",
          "Cedar Hill",
          "Lakeview",
          "Hillcrest",
          "Westwood",
          "Pinecrest",
          "Fairview",
          "Sunnydale",
          "Brookside",
          "Kennedy",
          "Franklin",
          "Madison",
          "Highland",
          "Valley View",
          "Eastwood",
          "Willow Creek",
        ];
      function schoolPerson(e, t) {
        return {
          first: uname((t = t || (Math.random() < 0.5 ? "m" : "f"))),
          last: any(LAST),
          g: t,
          ageOffset: e - state.age,
          look: randomLook(t, e),
          rel: rint(5, 60),
        };
      }
      function newSchool(e) {
        const t = levelFor(state.age);
        if (!t) return null;
        const a = "f" === PG() ? "All-Girls" : "All-Boys";
        e =
          "All-Boys" === e || "All-Girls" === e
            ? a
            : e || (chance(0.2) ? (chance(0.5) ? a : "Private") : "Public");
        const o = chance(0.5) ? any(SCHOOL_WORDS) : any(LAST),
          n = (e, t) => `${"m" === e ? "Mr." : chance(0.5) ? "Mrs." : "Ms."} ${t}`,
          s = (e, t = Math.random() < 0.5 ? "m" : "f") => {
            const a = schoolPerson(rint(26, 64), t);
            return {
              ...a,
              role: e,
              rel: rint(45, 95),
              title: "Principal" === e && chance(0.5) ? `Dr. ${a.last}` : n(t, a.last),
            };
          },
          r = {
            name: `${o} ${t.name}`,
            type: e,
            level: t.name,
            ico: t.ico,
            logo: t.logo,
            grades: state.school
              ? state.school.grades
              : clamp(Math.round(0.5 * state.stats.Smarts + rint(10, 40))),
            popularity: rint(10, 50),
            studied: 0,
            faculty: [
              s("Teacher"),
              s("PE Teacher"),
              s("High School" === t.name ? "Science Teacher" : "Music Teacher"),
              s("Principal"),
            ],
            classmates: Array.from({ length: rint(10, 14) }, () =>
              schoolPerson(state.age, "All-Boys" === e ? "m" : "All-Girls" === e ? "f" : null),
            ),
          };
        return (
          setTimeout(
            () =>
              [...r.faculty, ...r.classmates].forEach((e) =>
                npcFace(e.look, e.g, personAge(e), moodOf(e.rel)),
              ),
            50,
          ),
          r
        );
      }
      const yearsLeft = () => levelFor(state.age).max - state.age + 1,
        schoolTitle = (e) => `${"Public" === e.type ? "Public" : e.type} ${e.level}`;
      function school2018Card() {
        const e = state.school,
          t = levelFor(state.age) || SCHOOL_LEVELS[0],
          a = Math.max(0, state.age - t.min),
          o = Math.max(1, t.max - state.age + 1);
        ev.innerHTML = `<div class="jm-x" id="sc18X"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div><div style="height:26px"></div><div class="jm-tag" style="margin-top:12px">School</div>\n      <h4><img src="emoji/1f34e.png" alt=""><span>${e.level}</span></h4>\n      <table class="fin18"><tbody><tr><td><b>Years Completed:</b> ${a}</td></tr><tr><td><b>Years Left:</b> ${o}</td></tr></tbody></table>\n      <button class="jm-apply ev-btn" data-sc="study">Study harder</button><button class="jm-apply ev-btn" data-sc="drop">Drop out of ${e.level.toLowerCase()}</button>\n      <button class="jm-apply ev-btn" data-sc="class">View class</button>`;
        const n = () => evWrap.classList.remove("open");
        (document.getElementById("sc18X").onclick = () => {
          play("dismiss"), n();
        }),
          ev.querySelectorAll("[data-sc]").forEach(
            (t) =>
              (t.onclick = () => {
                const a = t.dataset.sc;
                if ((n(), "class" === a)) return screen.classList.add("open"), openSchool();
                if ("drop" === a)
                  return state.age < 16
                    ? notice(
                        "Drop out",
                        `You must be at least 16 to drop out of ${e.level.toLowerCase()}.`,
                        null,
                        !0,
                      )
                    : schoolAction("drop");
                const o = e.level.toLowerCase();
                e.studied ||
                  ((e.studied = 1),
                  (e.grades = clamp(e.grades + rint(3, 9))),
                  (state.stats.Smarts = clamp(state.stats.Smarts + rint(1, 3))),
                  renderStats(),
                  say(`I began studying harder for ${o}.`)),
                  notice("Nose in the books", `You began studying harder for ${o}.`, null, !0);
              }),
          ),
          evWrap.classList.add("open");
      }
      function openSchool() {
        const e = state.school;
        if (!e) return openOccupation();
        if (e.college) return openCollege();
        syncProfile(),
          (sTitle.textContent = "SCHOOL"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => screen.classList.remove("open"));
        const t = (e, t, a, o, n) =>
            `<div class="row" data-s="${e}"><img src="school/${t}.png"><div class="t"><b>${a}</b>${o}</div>${n}</div>`,
          a = "Public" === e.type ? "private" : "public";
        (sList.innerHTML =
          t("info", e.logo || e.ico, schoolTitle(e), sBar("Grades", e.grades), DOTS) +
          (e.club
            ? t(
                "myclub",
                `../xc/${clubBy(e.club.id)[2]}`,
                clubBy(e.club.id)[1],
                "<span>View your extracurricular activity</span>",
                DOTS,
              )
            : "") +
          '<div class="sec">Activities</div>' +
          t("change", "ledger", "Change Schools", `<span>Ask to go to ${a} school</span>`, DOTS) +
          (/High School|Middle School/.test(e.level)
            ? t("clubs", "../xc/soccer", "Activities", "<span>Join an extracurricular activity</span>", CHEV)
            : "") +
          (state.job
            ? t(
                "myjob",
                `../${(state.job.icon || jobIcon(state.job)).replace(/\.png$/, "")}`,
                state.job.t,
                sBar("Performance", state.job.perf ?? 50),
                CHEV,
              )
            : state.age >= (isOldEra() ? 7 : 14)
              ? t(
                  "parttime",
                  "../occ/parttime",
                  isOldEra() ? "Part-Time Work" : "Part-Time Jobs",
                  `<span>${isOldEra() ? "Earn a few pennies after lessons" : "Browse hourly job listings"}</span>`,
                  CHEV,
                )
              : "") +
          (state.age >= 12
            ? t("gigs", "../occ/freelance", "Freelance Gigs", "<span>Make some quick money</span>", CHEV)
            : "") +
          t("class", "pencil", "Class", sBar("Popularity", e.popularity), CHEV) +
          t("drop", "hand-waving", "Drop Out", `<span>Drop out of ${e.level.toLowerCase()}</span>`, DOTS) +
          t("faculty", "woman-teacher", "Faculty", "<span>Interact with your teachers</span>", CHEV) +
          t("nurse", "woman-doctor", "Nurse", "<span>Visit the school nurse</span>", DOTS) +
          t("skip", "../edu/skip", "Skip School", "<span>Skip class and do something else</span>", DOTS) +
          t("study", "books", "Study Harder", "<span>Put in some extra effort</span>", DOTS) +
          (mods.painting
            ? `<div class="row" data-s="paint"><img src="art/ui-palette.png"><div class="t"><b>Painting</b><span>Paint, exhibit and sell your art</span></div>${CHEV}</div>`
            : "")),
          sList.querySelectorAll("[data-s]").forEach((e) => (e.onclick = () => schoolAction(e.dataset.s))),
          (sList.scrollTop = 0),
          screen.classList.add("open");
      }
      const say = (e) => {
        log.lastElementChild.insertAdjacentHTML("beforeend", `<p>${e}</p>`),
          (log.scrollTop = log.scrollHeight);
      };
      function schoolAction(e) {
        const t = state.school;
        if ("info" === e) return schoolCard();
        if ("clubs" === e) return openClubs();
        if ("parttime" === e) return play("choice"), openJobs("parttime"), void (sBack.onclick = openSchool);
        if ("gigs" === e) return play("choice"), openJobs("freelance"), void (sBack.onclick = openSchool);
        if ("myjob" === e) return play("choice"), openJobScreen(), void (sBack.onclick = openSchool);
        if ("myclub" === e) return t.club ? myClubCard() : openSchool();
        if ("class" === e) return openClass();
        if ("faculty" === e) return openFaculty();
        if ("paint" === e) return play("choice"), openPainting(openSchool);
        if ("study" === e) {
          const e = t.level.toLowerCase();
          return (
            t.studied ||
              ((t.studied = 1),
              (t.grades = clamp(t.grades + rint(3, 9))),
              (state.stats.Smarts = clamp(state.stats.Smarts + rint(1, 3))),
              say(`I began studying harder for ${e}.`),
              renderStats()),
            screen.classList.remove("open"),
            void notice("Nose in the books", `You began studying harder for ${e}.`, null, !0)
          );
        }
        if ("skip" === e) return skipSchool();
        if ("nurse" === e) {
          const e = state.stats.Health < 70;
          return (
            e && (state.stats.Health = clamp(state.stats.Health + rint(3, 8))),
            say(
              e
                ? "I visited the school nurse and felt a little better."
                : "I visited the school nurse, who said I was perfectly healthy.",
            ),
            renderStats(),
            show(
              "School Nurse",
              e
                ? "The nurse gave you a lollipop and an ice pack. You feel a little better."
                : "The nurse checked you out and said you are perfectly healthy. Back to class!",
            )
          );
        }
        return "drop" === e
          ? state.age < 16
            ? show(
                "Drop Out",
                `Your parents would never let you drop out of ${t.level.toLowerCase()} at your age!`,
              )
            : (say(`I dropped out of ${t.level.toLowerCase()}.`),
              (state.school = null),
              (state.droppedOut = !0),
              updateDockTab(),
              renderAvatar(),
              screen.classList.remove("open"),
              show("Dropped Out", `You dropped out of ${t.name}.`))
          : "change" === e
            ? changeSchoolCard()
            : void 0;
      }
      function changeSchoolCard() {
        const e = state.school,
          t = "Public" === e.type ? "Private" : "Public",
          a = any(aliveParents()),
          o = a ? ("Mother" === a.role ? "mother" : "father") : "guardian",
          n = newSchool(t);
        (ev.innerHTML = `\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="jm-tag" style="margin-top:12px">School</div>\n      <h4><img src="emoji/1f514.png"><span>${t} School</span></h4>\n      <div class="lead">Ask your ${o} if you can switch to a ${t.toLowerCase()} school today!</div>\n      <table><tbody><tr><td><b>Current School:</b> ${e.name}</td></tr><tr><td><b>${t} School:</b> ${n.name}</td></tr></tbody></table>\n      <button class="jm-apply ev-btn" id="csGo">Do it</button>`),
          (ev.style.overflow = "visible");
        const s = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = s),
          (document.getElementById("csGo").onclick = () => {
            s();
            const r = a && "f" === a.gender ? "she" : "he",
              i = state.city || (COUNTRIES[state.country] || [])[1] || "town";
            a && chance(0.55)
              ? ((n.grades = e.grades),
                (state.school = n),
                e.club &&
                  (schoolClubs(n).includes(e.club.id) || n.clubs.push(e.club.id),
                  (n.club = { ...e.club, captain: !1 })),
                say(`I asked my ${o} if I could change schools, and ${r} agreed.`),
                say(`I started attending ${n.name}.`),
                notice(
                  "Public" === t ? "No more uniforms" : "Fancy new school",
                  `Your ${o} agreed to switch you to ${n.name}, a ${t.toLowerCase()} school in ${i}.`,
                ))
              : (say(`I asked my ${o} if I could change schools, but ${r} said no.`),
                notice("Request denied", `Your ${o} refused to let you switch to ${n.name}.`)),
              openSchool();
          }),
          evWrap.classList.add("open");
      }
      function notice(e, t, a, o, n = "") {
        if ((runPopupQueue.auto || !/1800s|invented/i.test(`${e} ${t}`)) && isModernText(`${e} ${t}`))
          return a && setTimeout(a, 0);
        if (
          (!o && (evWrap.classList.contains("open") || jmWrap.classList.contains("open"))) ||
          document.querySelector(".notice-wrap")
        )
          return void setTimeout(() => notice(e, t, a, o, n), 300);
        if (state.dead) return;
        const s = document.createElement("div");
        (s.className = "notice-wrap"),
          (s.innerHTML = `<div class="notice"><h4>${e}</h4><p>${t}</p>${n}</div>`),
          play("feedbackIn"),
          phoneEl.classList.contains("flui") && /ev-bars/.test(n) && setTimeout(() => play("age"), 140),
          (s.onclick = () => {
            play("feedbackOut"), s.remove(), a && a();
          }),
          document.querySelector(".phone").append(s),
          setTimeout(() => {
            s.isConnected &&
              s.insertAdjacentHTML("beforeend", '<div class="tap-hint">Tap anywhere to continue</div>');
          }, 5e3);
      }
      const CHAT_TOPICS = [
        "the weather",
        "video games",
        "their weekend",
        "a TV show",
        "their pets",
        "sports",
        "music",
        "food",
        "school",
        "a funny video",
        "their family",
        "the news",
        "a movie",
        "their dreams",
        "aliens",
        "the meaning of life",
        "their favorite snack",
      ];
      function chatNotice(e) {
        notice("Conversation", `You had a conversation with ${e} about ${any(CHAT_TOPICS)}.`, null, !0);
      }
      function schoolCard() {
        const e = state.school,
          t = (e, t) => `<b>${e}</b><i><u style="width:${Math.max(t, 3)}%;background:${barCol(t)}"></u></i>`,
          a = e.college,
          o = a ? Math.max(1, Math.ceil(e.years - (state.age - e.start))) : yearsLeft(),
          n = [
            ["School", e.name],
            ...(a && e.major ? [["Major", e.major]] : []),
            ["Type", e.type],
            ["Level", e.level],
            ["Years Left", o],
          ];
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw">\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="ev-tag" style="margin-top:12px"><canvas class="ev-av" width="250" height="250"></canvas><span class="who">${document.getElementById("pname").textContent}</span><span class="kind">You</span></div>\n      <h4><img src="${a ? `edu/${EDU_PROGS[e.prog].ico}` : `school/${e.logo || e.ico}`}.png"><span>${e.level}</span></h4>\n      <table class="jc jc-left"><tbody>${n.map(([e, t]) => `<tr><td><b>${e}:</b> ${t}</td></tr>`).join("")}</tbody></table>\n      <div class="ev-bars">${t("Grades", e.grades)}${t("Popularity", e.popularity)}${a ? `<b>Stress</b><i><u style="width:${Math.max(e.stress, 3)}%;background:${e.stress > 60 ? "#b3261e" : "#2fa03b"}"></u></i>` : ""}</div></div>`),
          ev
            .querySelector("canvas.ev-av")
            .getContext("2d")
            .drawImage(document.querySelector(".phone > .profile canvas.avatar"), 0, 0),
          (ev.style.overflow = "visible"),
          (document.getElementById("propX").onclick = () => {
            evWrap.classList.remove("open"), (ev.style.overflow = "");
          }),
          evWrap.classList.add("open");
      }
      const personAge = (e) => Math.max(0, state.age + e.ageOffset);
      function personRows(e, t) {
        return e
          .map(
            (e, a) =>
              `<div class="row" data-${t}="${a}"><i class="spf" data-k="${t}" data-i="${a}"></i><div class="t"><b>${e.title || e.first + " " + e.last}${e.role ? ` <em>(${e.role})</em>` : ""}</b>${sBar("Relationship", e.rel)}</div>${CHEV}</div>`,
          )
          .join("");
      }
      function fillSchoolFaces() {
        sList.querySelectorAll("i.spf").forEach((e) => {
          const t = state.school,
            a = "fac" === e.dataset.k ? t.faculty : t.classmates,
            o = "t" === e.dataset.i ? t.faculty[0] : a[+e.dataset.i];
          e.replaceWith(npcFace(o.look, o.g, personAge(o), moodOf(o.rel), "face"));
        });
      }
      function openClass() {
        const e = state.school,
          t = e.faculty[0];
        (sTitle.textContent = "CLASS"), (sBack.innerHTML = BACK_ICON), (sBack.onclick = openSchool);
        const a = e.classmates.map((e, t) => [e, t]).sort((e, t) => e[0].first.localeCompare(t[0].first));
        (sList.innerHTML =
          `<div class="row" data-tch="1"><i class="spf" data-k="fac" data-i="t"></i><div class="t"><b>${t.title} <em>(${t.role || "Teacher"})</em></b>${sBar("Relationship", t.rel)}</div>${CHEV}</div>` +
          a
            .map(
              ([e, t]) =>
                `<div class="row" data-cm="${t}"><i class="spf" data-k="cm" data-i="${t}"></i><div class="t"><b>${e.first} ${e.last}</b>${sBar("Relationship", e.rel)}</div>${CHEV}</div>`,
            )
            .join("")),
          fillSchoolFaces(),
          (sList.querySelector("[data-tch]").onclick = () => openSchoolPerson("fac", 0, openClass)),
          sList
            .querySelectorAll("[data-cm]")
            .forEach((e) => (e.onclick = () => openSchoolPerson("cm", +e.dataset.cm, openClass))),
          (sList.scrollTop = 0);
      }
      function openFaculty() {
        const e = state.school;
        (sTitle.textContent = "FACULTY"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSchool),
          (sList.innerHTML = e.faculty
            .map(
              (e, t) =>
                `<div class="row" data-fac="${t}"><i class="spf" data-k="fac" data-i="${t}"></i><div class="t"><b>${e.title} <em>(${e.role})</em></b>${sBar("Relationship", e.rel)}</div>${CHEV}</div>`,
            )
            .join("")),
          fillSchoolFaces(),
          sList
            .querySelectorAll("[data-fac]")
            .forEach((e) => (e.onclick = () => openSchoolPerson("fac", +e.dataset.fac, openFaculty))),
          (sList.scrollTop = 0);
      }
      function openSchoolPerson(e, t, a) {
        const o = state.school,
          n = ("fac" === e ? o.faculty : o.classmates)[t],
          s = "m" === n.g ? "him" : "her",
          r = n.title || `${n.first} ${n.last}`,
          i = "fac" === e;
        (sTitle.textContent = i ? n.role.toUpperCase() : "CLASSMATE"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = a);
        const l = state.lovers.some((e) => e.first === n.first && e.last === n.last),
          c = !i && state.age >= 13 && state.age <= 17 && personAge(n) >= 13 && personAge(n) <= 17 && !l,
          d = i ? n.role : "Classmate",
          u = i && o.college && state.age >= 18 && personAge(n) >= 18;
        (n.looks ??= rint(5, 100)),
          (n.strict ??= rint(5, 100)),
          (n.pop ??= rint(5, 100)),
          (n.smarts ??= rint(5, 100)),
          (n.sexuality ??= chance(0.85) ? "Straight" : pickR(["Gay", "Bisexual"]));
        const h = i
          ? [
              ["actup", "Act Up", `Act up in ${"m" === n.g ? "his" : "her"} class`],
              ["befriend", "Befriend", `Befriend ${s}`],
              ["compliment", "Compliment", `Pay ${s} a compliment`],
              ["disrespect", "Disrespect", `Disrespect ${s}`],
              ["gift", "Gift", `Give ${s} a gift`],
              ...(u ? [["hookup", "Hook Up", `Hook up with ${s}`]] : []),
              ["insult", "Insult", `Insult ${s}`],
              ["spy", "Spy", `Spy on ${s}`, !1],
              ["suckup", "Suck Up", `Suck up to ${s}`],
            ]
          : [
              ...(c ? [["askout", "Ask Out", `Ask ${s} out`]] : []),
              ["befriend", "Befriend", `Befriend ${s}`],
              ["compliment", "Compliment", `Pay ${s} a compliment`],
              ["talk", "Conversation", `Have a conversation with ${s}`],
              ["deal", "Deal", `Sell something to ${s}`],
              ["flirt", "Flirt", `Flirt with ${s}`],
              ["gift", "Gift", `Give ${s} a gift`],
              ["insult", "Insult", `Insult ${s}`],
              ["mess", "Mess", `Mess with ${s}`],
              ["spy", "Spy", `Spy on ${s}`, !1],
            ];
        (sList.innerHTML =
          `<div class="row" data-a="prof"><i class="spf" data-k="${e}" data-i="${t}"></i><div class="t"><b>${r}${i ? ` <em>(${n.role})</em>` : ""}</b>${sBar("Relationship", n.rel)}</div>${DOTS}</div>\n       <div class="row sm" data-a="edit"><img src="school/ui-edit.png"><div class="t"><b>Edit</b><span>Edit ${s}</span></div>${GOD_SEAL}</div>\n       <div class="sec">Activities</div>` +
          h
            .map(([e, t, a, o]) =>
              ((e, t, a, o = !0) =>
                `<div class="row sm${o ? "" : " dis"}" ${o ? `data-a="${e}"` : ""}><img src="${"hookup" === e ? "occ/cw-hookup.png" : "askout" === e ? "emoji/2764-fe0f.png" : `school/ui-${e}.png`}"><div class="t"><b>${t}</b><span>${a}</span></div>${o ? DOTS : ""}</div>`)(
                e,
                t,
                a,
                o,
              ),
            )
            .join("")),
          fillSchoolFaces();
        const p = {
            role: d,
            name: r,
            g: n.g,
            age: personAge(n),
            onInsult: i ? () => teacherDetention(n, r) : null,
          },
          m = (e, t, a) => {
            screen.classList.remove("open"), renderStats(), notice(e, t, null, !0, a);
          };
        sList.querySelectorAll("[data-a]").forEach(
          (l) =>
            (l.onclick = () => {
              const c = l.dataset.a;
              if ("edit" === c)
                return godEdit(n, { role: d, age: personAge(n), g: n.g }, () => openSchoolPerson(e, t, a));
              if ("hookup" === c)
                return hookUpWith(n, r, n.role.toLowerCase(), personAge(n), () => {
                  chance(0.4) && (o.grades = clamp(o.grades + rint(3, 8)));
                });
              if ("prof" === c) {
                const e =
                    '<svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg>',
                  t = (e, t) =>
                    `<tr><td style="text-align:center;padding-left:0"><b>${e}:</b> ${t}</td></tr>`,
                  a = (e, t) =>
                    `<b>${e}</b><i><u style="width:${Math.max(t, 1)}%;background:${barCol(t)}"></u></i>`;
                return (
                  (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px">${e}</div>\n          <div class="ev-tag" style="margin-top:12px"><canvas class="ev-av" width="250" height="250"></canvas><span class="who">${r}</span><span class="kind">${d}</span></div>\n          <h4><img src="act/profile.png"><span>Profile</span></h4>\n          <table><tbody>${t("Name", `${n.first} ${n.last}`)}${i ? t("Job", n.role) : ""}${t("Gender", "m" === n.g ? "Male" : "Female")}${t("Age", personAge(n))}${personAge(n) >= 13 ? t("Sexuality", n.sexuality) : ""}</tbody></table>\n          <div class="ev-bars">${a("Relationship", n.rel)}${a("Looks", n.looks)}${i ? a("Strictness", n.strict) : a("Smarts", n.smarts)}${a("Popularity", n.pop)}</div>`),
                  ev
                    .querySelector(".ev-av")
                    .replaceWith(npcFace(n.look, n.g, personAge(n), moodOf(n.rel), "ev-av")),
                  (ev.style.overflow = "visible"),
                  (document.getElementById("propX").onclick = () => {
                    evWrap.classList.remove("open"), (ev.style.overflow = "");
                  }),
                  evWrap.classList.add("open")
                );
              }
              if (
                (i &&
                  /Teacher/.test(n.role) &&
                  ("compliment" === c || "insult" === c) &&
                  (o.grades = clamp(
                    o.grades + ("compliment" === c ? (chance(0.5) ? rint(1, 2) : 0) : -rint(1, 3)),
                  )),
                ["compliment", "talk", "deal", "gift", "insult"].includes(c))
              )
                return parentAction(n, "talk" === c ? "talk" : c, () => openSchoolPerson(e, t, a), p);
              if ("askout" === c) {
                const e = "Straight" === n.sexuality ? n.g !== PG() : "Gay" !== n.sexuality || n.g === PG(),
                  t = personAge(n),
                  a = "m" === n.g ? "he" : "she";
                if (e && n.rel >= 30 && chance(romanceOdds(n, { base: 0.55, rel: n.rel }))) {
                  const e = {
                    first: n.first,
                    last: n.last,
                    g: n.g,
                    gLabel: n.g,
                    ageOffset: t - state.age,
                    look: n.look,
                    rel: Math.max(60, n.rel),
                    sexuality: n.sexuality,
                    job: "Student",
                    house: "Lives with parents",
                    celeb: !1,
                    looks: n.looks,
                    smarts: n.smarts ?? rint(5, 100),
                    crazy: rint(0, 100),
                    money: 0,
                    since: state.age,
                    prof: {
                      money: 0,
                      relig: rint(0, 100),
                      gen: rint(0, 100),
                      edu: eduFor(t),
                      job: "Student",
                      marital: "Single",
                    },
                  };
                  (n.rel = clamp(n.rel + rint(5, 12))), (o.popularity = clamp(o.popularity + rint(1, 4)));
                  const i = addLover(e);
                  return (
                    (state.stats.Happiness = clamp(state.stats.Happiness + rint(5, 10))),
                    say(`I asked out my classmate, ${r}, and ${a} said yes!`),
                    m(
                      "Class mating",
                      `You asked out your classmate, ${r}, and ${a} said yes!<br><br>You are now going out with ${s}.${i}`,
                    )
                  );
                }
                return (
                  (n.rel = clamp(n.rel - rint(5, 12))),
                  (o.popularity = clamp(o.popularity - rint(0, 3))),
                  (state.stats.Happiness = clamp(state.stats.Happiness - rint(2, 5))),
                  say(`I asked out my classmate, ${r}, but ${a} said no.`),
                  m("Rejected", `You asked out your classmate, ${r}, but ${a} turned you down.`)
                );
              }
              if ("befriend" === c) {
                return (window.SYNDROME && SYNDROME.shun()) ||
                  !(i
                    ? n.rel >= 70 && chance(0.1 + (n.rel - 70) / 300)
                    : n.rel >= 40 && chance(0.5 + n.rel / 200))
                  ? ((n.rel = clamp(n.rel - (i ? rint(5, 10) : 5))),
                    say(`${r} didn't want to be my friend.`),
                    m(
                      "Rejected",
                      i
                        ? `${r} says it wouldn't be appropriate for a ${n.role.toLowerCase()} to be friends with a student.`
                        : `${r} doesn't want to be your friend.`,
                    ))
                  : ((n.rel = clamp(n.rel + 10)),
                    (o.popularity = clamp(o.popularity + 3)),
                    addFriend(
                      { first: n.first, last: n.last, g: n.g, look: n.look, age: personAge(n) },
                      n.rel,
                      "school",
                    ),
                    say(`${r} agreed to be my friend!`),
                    m("New Friend", `You are now friends with ${r}!`));
              }
              if ("suckup" === c) {
                const e = rint(30, 100);
                return (
                  (n.rel = clamp(n.rel + rint(4, 10))),
                  (o.grades = clamp(o.grades + 1)),
                  say(`I sucked up to ${r}.`),
                  m(
                    "Teacher's pet",
                    `You sucked up to ${r}.`,
                    ((e, t) =>
                      `<div class="ev-bars nb"><b>${e}</b><i><u style="width:${Math.max(t, 1)}%;background:${barCol(t)}"></u></i></div>`)(
                      ("m" === n.g ? "His" : "Her") + " Appreciation",
                      e,
                    ),
                  )
                );
              }
              if ("actup" === c)
                return (
                  (n.rel = clamp(n.rel - rint(5, 12))),
                  (o.popularity = clamp(o.popularity + rint(2, 6))),
                  say(`I acted up in ${r}'s class.`),
                  m("Class clown", `You acted up in ${r}'s class. Your classmates loved it.`),
                  void (chance(0.4) && setTimeout(() => schoolTrouble(1, !1, "acting up in class"), 0))
                );
              if ("disrespect" === c)
                return (
                  (n.rel = clamp(n.rel - rint(10, 18))),
                  say(`I disrespected ${r}.`),
                  m("Rude", `You disrespected ${r}.`),
                  void (chance(0.5) && setTimeout(() => schoolTrouble(1, !1, "disrespecting a teacher"), 0))
                );
              if ("flirt" === c) {
                const e = n.rel >= 35 && chance(0.55);
                return (
                  (n.rel = clamp(n.rel + (e ? rint(5, 10) : -rint(3, 8)))),
                  say(
                    e
                      ? `I flirted with ${r}. ${"m" === n.g ? "He" : "She"} flirted back!`
                      : `I flirted with ${r}, but it was awkward.`,
                  ),
                  m(
                    e ? "Smooth" : "Awkward",
                    e
                      ? `You flirted with ${r}, and ${"m" === n.g ? "he" : "she"} flirted back!`
                      : `You tried to flirt with ${r}, but ${"m" === n.g ? "he" : "she"} wasn't interested.`,
                  )
                );
              }
              if ("mess" === c) {
                const e = pickR([
                  "pulled their chair out",
                  "stuck gum in their hair",
                  "hid their backpack",
                  "flicked their ear",
                  "stole their lunch",
                ]);
                return (
                  (n.rel = clamp(n.rel - rint(6, 14))),
                  (o.popularity = clamp(o.popularity + rint(0, 4))),
                  say(`I messed with ${r}. I ${e.replace(/their/g, "m" === n.g ? "his" : "her")}.`),
                  m(
                    "Gotcha",
                    `You messed with ${r}. You ${e.replace(/their/g, "m" === n.g ? "his" : "her")}.`,
                  )
                );
              }
            }),
        );
      }
      function openProfile() {
        if (overlayOpen()) return;
        const [e, t] = COUNTRIES[state.country],
          a = state.city || t,
          o =
            '<svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg>',
          n = document.getElementById("pname").textContent,
          s = is2018(),
          r = (state.lovers || []).find((e) => e.married) || (state.lovers || []).find((e) => e.main),
          i = r
            ? `${r.married ? "Married to" : r.bride ? "Engaged to" : "Dating"} ${r.first} ${r.last}`
            : "Single",
          l = state.school
            ? state.school.level
            : state.age < 6
              ? "None"
              : state.age < 18
                ? "Primary School"
                : state.stats.Smarts >= 70
                  ? "University"
                  : "High School",
          c = (e, t) => `<tr><td><b>${e}:</b> ${t}</td></tr>`;
        (ev.innerHTML = `<div class="jm-x" id="profX">${o}</div><div style="height:26px"></div>\n      <div class="ev-tag"><img class="ev-av" src="emoji/1f476.png"><span class="who">${n}</span><span class="kind">${s ? "Profile" : "You"}</span></div>\n      <h4>${s ? '<canvas class="prof-face" width="250" height="250"></canvas>' : '<img src="menu/magnifier.png" alt="">'}<span>${s ? n : "Profile"}</span></h4>\n      <table class="prof"><tbody>${c("Gender", state.genderId && "Cisgender" !== state.genderId ? state.genderId : "f" === PG() ? "Female" : "Male")}${c("Species", state.species && "human" !== state.species ? "Hybrid" : "Human")}${c("Age", state.age)}${state.age >= 13 ? c("Sexuality", state.sexuality || "Straight") + c("Marital Status", i) : ""}\n        ${c("Education", l)}${c("Location", a === e ? a : `${a}, ${e}`)}${state.talent && TALENTS[state.talent] ? c("Special Talent", TALENTS[state.talent].name) : ""}</tbody></table>\n      <div class="ev-bars" style="row-gap:9px;margin-top:22px">${Object.entries(
          { ...state.stats, ...(state.attrs || {}) },
        )
          .map(
            ([e, t]) =>
              `<b style="font-size:15px">${e}</b><i style="height:18px"><u style="width:${Math.max(t, 2)}%;background:${barCol(t)}"></u></i>`,
          )
          .join(
            "",
          )}</div>\n      <button class="jm-apply ev-btn" id="profMoney">My finances</button><button class="jm-apply ev-btn" id="profSocial"${isOldEra() ? ' style="display:none"' : ""}>Social media</button>`),
          ev.querySelector(".ev-av").replaceWith(npcFace(state.look, PG(), state.age, "happy", "ev-av"));
        const d = ev.querySelector(".prof-face");
        d &&
          d
            .getContext("2d")
            .drawImage(document.querySelector(".phone > .profile canvas.avatar"), 0, 0, 250, 250);
        const u = () => {
          evWrap.classList.remove("open");
        };
        if (
          ((document.getElementById("profX").onclick = () => {
            play("dismiss"), u();
          }),
          s)
        ) {
          const e = (e, t, a, n) => {
            (ev.innerHTML = `<div class="jm-x" id="f18X">${o}</div><div style="height:26px"></div>\n          <div class="jm-tag" style="margin-top:12px">${e}</div><h4><img src="${t}" alt=""><span>${a}</span></h4>${n}`),
              (document.getElementById("f18X").onclick = () => {
                play("dismiss"), u();
              }),
              evWrap.classList.add("open");
          };
          (document.getElementById("profMoney").onclick = () => {
            const t =
                state.props.reduce(
                  (e, t) => e + (t.yearsLeft ? Math.round((0.8 * t.price * t.yearsLeft) / 30) : 0),
                  0,
                ) + state.cars.reduce((e, t) => e + (t.loanYears ? 12 * t.loanPay * t.loanYears : 0), 0),
              a = netWorth() - state.money,
              o =
                state.props.reduce((e, t) => e + t.expense + (t.yearsLeft ? t.mortgage : 0), 0) +
                state.cars.reduce((e, t) => e + t.expense + (t.loanYears ? t.loanPay : 0), 0) +
                (state.pets || []).reduce((e, t) => e + t.expense, 0);
            e(
              "Finances",
              "2018/emoji/2139-fe0f.png",
              n,
              `<table class="fin18"><tbody>${c("Bank Balance", usd(state.money))}${c("Income", usd(state.job ? state.job.pay : 0))}\n          ${c("Monthly Outflow", usd(o))}${c("Assets", usd(a))}${c("Liabilities", usd(t))}${c("Net Worth", usd(state.money + a - t))}</tbody></table>`,
            );
          }),
            (document.getElementById("profSocial").onclick = () => {
              if (Object.keys(state.social || {}).length)
                return u(), screen.classList.add("open"), syncProfile(), openSocial();
              e(
                "Social",
                "emoji/1f465.png",
                "Social Media",
                '<div class="lead">Your friends are all joining social media.<br><br>Will you join too?</div>\n          <button class="jm-apply ev-btn" id="s18Go">Join social media</button>',
              ),
                (document.getElementById("s18Go").onclick = () => {
                  if ((u(), state.age < 13))
                    return notice("Too young", "You must be at least 13 to join social media.", null, !0);
                  const e = SOCIALS.filter(
                    (e) => e[5] <= state.age && "onlyfans" !== e[0] && socLive(e[0]) && !NON_SOCIAL.has(e[0]),
                  ).map((e) => socOf(e[0]));
                  if (!e.length)
                    return notice("Not yet", "There isn't any social media to join yet.", null, !0);
                  const [t, a] = pickR(e);
                  pickEmail(a, (e) =>
                    signUpWithPw(t, a, e, () =>
                      notice(
                        "Better learn photoshop",
                        `You signed up for ${/^[AEIOU]/.test(a) ? "an" : "a"} ${a} account on ${e}.`,
                        null,
                        !0,
                      ),
                    ),
                  );
                });
            });
        } else
          document.getElementById("profMoney").onclick = () => {
            u();
            const e = netWorth(),
              t = state.job;
            notice(
              "My finances",
              "Here's where you stand financially.",
              null,
              !0,
              `<table class="nt"><tr><td><b>Bank Balance:</b> ${usd(state.money)}</td></tr><tr><td><b>Net Worth:</b> ${usd(e)}</td></tr><tr><td><b>Income:</b> ${t ? usd(t.pay) + "/yr" : "None"}</td></tr><tr><td><b>Properties:</b> ${state.props.length}</td></tr><tr><td><b>Cars:</b> ${state.cars.length}</td></tr></table>`,
            );
          };
        s ||
          (document.getElementById("profSocial").onclick = () => {
            u(), screen.classList.add("open"), syncProfile(), openSocial();
          }),
          play("choice"),
          evWrap.classList.add("open");
      }
      document.querySelector(".phone > .profile .who").addEventListener("click", (e) => {
        e.target.closest(".name") && openProfile();
      }),
        (document.querySelector(".phone > .profile .name").style.cursor = "pointer");
      const popupQueue = [];
      {
        const Q = document.querySelector(".phone");
        Q.addEventListener("scroll", () => {
          (Q.scrollTop || Q.scrollLeft) && ((Q.scrollTop = 0), (Q.scrollLeft = 0));
        }),
          (Q.scrollTop = 0);
      }
      let queueTimer = null,
        uiChangedAt = 0;
      {
        const Z = new MutationObserver(() => {
          uiChangedAt = Date.now();
        });
        [evWrap, jmWrap, toast, screen].forEach(
          (e) => e && Z.observe(e, { attributes: !0, attributeFilter: ["class"] }),
        );
      }
      function queuePopup(e) {
        popupQueue.push(e), queueTimer || (queueTimer = setTimeout(runPopupQueue, 400));
      }
      const rollCounts = {};
      function queueRoll(e, t) {
        const a = state.age;
        queuePopup(() => {
          state.dead ||
            state.prison ||
            (!t && ((rollCounts[a] = (rollCounts[a] || 0) + 1), rollCounts[a] > 2)) ||
            e();
        });
      }
      function runPopupQueue() {
        if (((queueTimer = null), state.dead)) return void (popupQueue.length = 0);
        if (!popupQueue.length) return;
        if (
          document.querySelector(".phone").classList.contains("picking") ||
          document.getElementById("picker") ||
          document.querySelector(".ll-fl") ||
          overlayOpen() ||
          document.getElementById("ios") ||
          Date.now() - uiChangedAt < 450
        )
          return void (queueTimer = setTimeout(runPopupQueue, 300));
        const e = popupQueue.shift();
        runPopupQueue.auto = !0;
        try {
          e();
        } catch (e) {
          console.error("popup failed", e);
        }
        (runPopupQueue.auto = !1), popupQueue.length && (queueTimer = setTimeout(runPopupQueue, 300));
      }
      function eduCard({ icon: e, title: t, lead: a, rows: o }) {
        (ev.innerHTML = `<div class="jm-tag">Education</div>\n      <h4><img src="emoji/${e}.png" alt=""><span>${t}</span></h4>\n      <div class="lead">${a}</div>\n      <table><tbody>${o.map(([e, t]) => `<tr><td style="text-align:center;padding-left:0"><b>${e}:</b> ${t}</td></tr>`).join("")}</tbody></table>\n      <button class="jm-apply hr-green ev-btn" id="eduOk">OK</button>`),
          (document.getElementById("eduOk").onclick = () => evWrap.classList.remove("open")),
          evWrap.classList.add("open");
      }
      const PARENT_HIT = {
        office: [5, 10],
        detention: [3, 8],
        skip: [8, 15],
        suspend: [10, 20],
        expel: [20, 35],
      };
      function parentArgument(e) {
        const t = aliveParents();
        if (!t.length) return;
        const a = any(t),
          o = "Mother" === a.role ? "mom" : "dad",
          n = "f" === a.gender,
          [s, r] = PARENT_HIT[e] || [3, 8];
        t.forEach((e) => {
          const t = rint(s, r);
          e.rel = clamp(e.rel - (e === a ? t : Math.round(t / 2)));
        });
        const i = n ? "her" : "him",
          l = n ? "she" : "he",
          c = n ? "She" : "He",
          d = {
            office: "getting sent to the principal's office",
            detention: "getting detention",
            skip: "skipping school",
            suspend: "getting suspended from school",
            expel: "getting expelled from school",
          }[e],
          u = {
            office: `Your ${o} found out you were sent to the principal's office today and is yelling at you.`,
            detention: `Your ${o} found out you got detention today and is yelling at you.`,
            skip: `The school called your ${o} to say you skipped school, and ${l}'s furious with you.`,
            suspend: `After being suspended from school, your ${o} is screaming at you about how embarrassed ${l} is.`,
            expel: `After you got expelled from school, your ${o} is furious that you'll have to start over at a new school next year.`,
          }[e];
        queuePopup(() =>
          openEvent({
            kind: a.role,
            make: () => ({
              who: `${a.first} ${SURNAME}`,
              av: PICON[a.role],
              icon: "1f92c",
              title: "Argument",
              desc: u + "<br><br>What will you do?",
              angry: !0,
              feedback: !0,
              person: { look: a.look, g: a.gender, age: a.ageAtBirth + state.age },
              bars: [["Relationship", a.rel]],
              choices: [
                [
                  `Apologize to ${i}`,
                  () =>
                    chance(0.65)
                      ? ((a.rel = clamp(a.rel + rint(3, 8))),
                        fx({ Happiness: 2 }, `I apologized to my ${o} for ${d}. ${c} forgave me.`))
                      : ((a.rel = clamp(a.rel - 2)),
                        fx(
                          { Happiness: -2 },
                          `I apologized to my ${o} for ${d}, but ${l} was still furious.`,
                        )),
                ],
                [
                  `Argue back to ${i}`,
                  () => (
                    (a.rel = clamp(a.rel - rint(8, 18))),
                    fx({ Happiness: -4 }, `I argued with my ${o} after ${d}.`)
                  ),
                ],
              ],
            }),
          }),
        );
      }
      const GANG_INK_RANTS = [
        "Your {M} saw the gang tattoo on your face and screamed so loud the neighbors came outside.",
        'Your {M} took one look at your face and started crying. "Who did this to you?"',
        "Your {M} grabbed your chin, stared at the tattoo, and asked if you have completely lost your mind.",
        "Your {M} says {he} didn't raise you to put gang letters on your face.",
        "Your {M} is yelling that nobody will ever give you a job looking like that.",
        "Your {M} says you look like a mugshot now.",
        'Your {M} demands to know which gang you joined and who your new "friends" are.',
        "Your {M} slammed the front door and told you to explain that tattoo right now.",
        "Your {M} says the whole family is going to be ashamed to be seen with you.",
        "Your {M} is furious that you permanently marked your face for a gang.",
        "Your {M} says {he} is calling the tattoo shop to find out who would ink a kid's face.",
        "Your {M} asked if you want to end up in prison or dead, because that is where gang ink leads.",
        "Your {M} says {he} prayed every night that you would never get mixed up with gangs.",
        "Your {M} threw {his} keys across the room when {he} saw your new face tattoo.",
        "Your {M} says your grandparents would be rolling in their graves.",
        "Your {M} is screaming that the police will stop you on sight now.",
        "Your {M} says {he} can't even look at you right now.",
        "Your {M} asked how you plan to explain that tattoo at a job interview.",
        "Your {M} says {he} worked two jobs so you would never have to live like that.",
        "Your {M} says rival gangs will see that tattoo and come after you.",
        "Your {M} is shaking with anger and says you just ruined your whole future.",
        "Your {M} says {he} doesn't recognize the person standing in front of {him}.",
        "Your {M} is yelling that a face tattoo is not a phase you can grow out of.",
        "Your {M} says everyone at church is going to talk about this.",
        "Your {M} told you that tattoo is a target painted on your face.",
        "Your {M} demands you get it lasered off, no matter what it costs.",
        "Your {M} says you embarrassed {him} in front of the entire neighborhood.",
        "Your {M} asked if this is the thanks {he} gets for everything {he} sacrificed.",
        "Your {M} found out from a neighbor before you even got home, and {he} is livid.",
        "Your {M} says no school, bank or hospital will ever hire you now.",
        "Your {M} is crying in the kitchen and won't stop asking why you did it.",
        "Your {M} says {he} will not have gang business brought into {his} house.",
        "Your {M} says your little cousins look up to you, and now this is what they see.",
        "Your {M} yelled that you got a gang tattoo before you even got a real job.",
        "Your {M} says the tattoo is the stupidest decision anyone in the family has ever made.",
        "Your {M} says {he} is taking your phone so you stop talking to those gang members.",
        "Your {M} is pacing the living room, muttering that {he} failed as a parent.",
        "Your {M} asked whether the gang is going to pay your bills when no one hires you.",
        "Your {M} says {he} saw on the news what happens to kids with gang tattoos.",
        "Your {M} told you to scrub it off, then screamed when {he} realized it is permanent.",
        "Your {M} says people will cross the street when they see you coming now.",
        "Your {M} says {he} is never posting a family photo again.",
        "Your {M} says the military won't take you now, so there goes that plan.",
        "Your {M} asked if you have any idea what those letters on your face mean to people.",
        "Your {M} says {he} is grounding you until you are 40.",
        "Your {M} says you are not leaving the house until you cut ties with the gang.",
        'Your {M} called you "a walking billboard for a gang."',
        "Your {M} says {he} should have kept a closer eye on who you were hanging out with.",
        "Your {M} is yelling that ink on your face lasts longer than any gang loyalty.",
        "Your {M} says the cops will think you are a suspect in every crime in town.",
        "Your {M} says {he} is going to have nightmares about that tattoo.",
        "Your {M} told you that real family doesn't need a tattoo to prove anything.",
        "Your {M} says your face used to look just like {his}, and now look at it.",
        "Your {M} says {he} is too old to be visiting you in prison someday.",
        "Your {M} asked if you got the tattoo just to hurt {him}.",
        "Your {M} says you can forget about borrowing the car ever again.",
        "Your {M} says {he} is telling the whole family exactly what you did.",
        "Your {M} says {he} doesn't want that gang name anywhere near the dinner table.",
      ];
      function oldInkReaction() {
        const e = aliveParents();
        if (!e.length) return;
        const t = e.find((e) => "Mother" === e.role) || e[0],
          a = "f" === t.gender || "Mother" === t.role,
          o = t.role.toLowerCase(),
          n = a ? "She" : "He",
          s = a ? "she" : "he",
          r = a ? "her" : "him",
          i = pickR([
            "What in heaven's name is that on your skin? Did you fall face-first into the inkwell?",
            "Is that a drawing? On your FACE? Have you run off and joined the circus?",
            "Only sailors and convicts wear marks like that! What will the neighbors say?",
            "Did a traveling sideshow get hold of you? Scrub it off this instant!",
            "Is that some kind of disease? Should I send for the doctor?",
            "Lord have mercy, has the devil written on you?",
          ]);
        queuePopup(() =>
          openEvent({
            kind: t.role,
            make: () => ({
              who: `${t.first} ${SURNAME}`,
              av: PICON[t.role],
              icon: "1f633",
              title: "What Is That?!",
              desc: `Your ${o}, ${t.first}, grabs your arm and squints at the fresh ink, completely baffled.<br><br>"${i}"<br><br>What will you tell ${r}?`,
              person: { look: t.look, g: t.gender, age: t.ageAtBirth + state.age },
              bars: [["Relationship", t.rel]],
              choices: [
                [
                  "Sailors all have them",
                  () => {
                    (t.rel = clamp(t.rel - rint(2, 6))),
                      fx(
                        { Happiness: 1 },
                        `I told my ${o} that all the sailors have tattoos. ${n} said ${s} didn't raise me to be a sailor.`,
                      );
                  },
                ],
                [
                  "It's for good luck",
                  () =>
                    chance(0.5)
                      ? ((t.rel = clamp(t.rel + rint(1, 3))),
                        fx(
                          { Happiness: 3 },
                          `I told my ${o} my tattoo was a good luck charm. ${n} grudgingly accepted it.`,
                        ))
                      : ((t.rel = clamp(t.rel - rint(4, 8))),
                        fx(
                          { Happiness: -2 },
                          `I told my ${o} my tattoo was for luck. ${n} said it looked like bad luck to ${r}.`,
                        )),
                ],
                [
                  "It's the fashion now",
                  () => {
                    (t.rel = clamp(t.rel - rint(5, 10))),
                      fx(
                        { Happiness: -1 },
                        `I told my ${o} tattoos were the fashion now. ${n} said the fashion was for heathens.`,
                      );
                  },
                ],
                [
                  "Hide it under your sleeve",
                  () => {
                    (t.rel = clamp(t.rel - rint(1, 4))),
                      fx(
                        { Happiness: -3 },
                        `I hid my tattoo from my ${o} under my sleeve. ${n} knows something's going on.`,
                      );
                  },
                ],
              ],
            }),
          }),
        );
      }
      function gangInkArgument() {
        if (isOldEra()) return oldInkReaction();
        const e = aliveParents();
        if (!e.length) return;
        const t = any(e),
          a = "Mother" === t.role ? "mom" : "dad",
          o = "f" === t.gender,
          n = o ? "she" : "he",
          s = o ? "She" : "He",
          r = o ? "her" : "him",
          i = o ? "her" : "his";
        e.forEach((e) => {
          e.rel = clamp(e.rel - (e === t ? rint(25, 40) : rint(15, 25)));
        }),
          (state.stats.Happiness = clamp(state.stats.Happiness - rint(10, 20))),
          renderStats();
        const l = any(GANG_INK_RANTS)
          .replace(/\{M\}/g, a)
          .replace(/\{He\}/g, s)
          .replace(/\{he\}/g, n)
          .replace(/\{him\}/g, r)
          .replace(/\{his\}/g, i);
        queuePopup(() =>
          openEvent({
            kind: t.role,
            make: () => ({
              who: `${t.first} ${SURNAME}`,
              av: PICON[t.role],
              icon: "1f92c",
              title: "Argument",
              desc: l + "<br><br>What will you do?",
              angry: !0,
              feedback: !0,
              person: { look: t.look, g: t.gender, age: t.ageAtBirth + state.age },
              bars: [["Relationship", t.rel]],
              choices: [
                [
                  `Apologize to ${r}`,
                  () =>
                    chance(0.35)
                      ? ((t.rel = clamp(t.rel + rint(2, 6))),
                        fx(
                          { Happiness: -2 },
                          `I apologized to my ${a} for getting a gang tattoo. ${s} is still upset, but ${n} accepted my apology.`,
                        ))
                      : ((t.rel = clamp(t.rel - rint(3, 6))),
                        fx(
                          { Happiness: -4 },
                          `I apologized to my ${a} for getting a gang tattoo, but ${n} said sorry won't wash it off my face.`,
                        )),
                ],
                [
                  `Tell ${r} it's your life`,
                  () => (
                    (t.rel = clamp(t.rel - rint(10, 18))),
                    fx(
                      { Happiness: -3 },
                      `I told my ${a} my face tattoo is my business. ${s} stormed out of the room.`,
                    )
                  ),
                ],
                [
                  `Argue back to ${r}`,
                  () => (
                    (t.rel = clamp(t.rel - rint(15, 25))),
                    fx(
                      { Happiness: -6 },
                      `I screamed at my ${a} after ${n} yelled at me about my gang tattoo.`,
                    )
                  ),
                ],
              ],
            }),
          }),
        );
      }
      function schoolTrouble(e, t, a, o) {
        const n = state.school;
        if (!n || !e) return;
        if (!t && !chance(Math.min(0.9, 0.25 + 0.3 * e)))
          return void say("Luckily, nobody reported me to the principal.");
        const s = n.faculty.find((e) => "Principal" === e.role);
        if (!s) return punish(e, o);
        const r = "f" === s.g ? "she" : "he",
          i = "f" === s.g ? "her" : "him",
          l = "f" === s.g ? "She" : "He";
        queuePopup(() =>
          openEvent({
            kind: "Principal",
            make: () => ({
              who: s.title,
              av: "1f468",
              icon: "1f62e",
              title: "Principal's Office",
              desc: `You have been sent to the principal, ${s.title}'s, office for ${a || "misbehaving"}.<br><br>What will you do?`,
              angry: !0,
              feedback: !0,
              person: { look: s.look, g: s.g, age: personAge(s) },
              choices: [
                [
                  `Argue with ${i}`,
                  () => (
                    (s.rel = clamp(s.rel - rint(8, 14))),
                    setTimeout(() => punish(e + 1, o), 0),
                    `I argued with the principal, ${s.title}.`
                  ),
                ],
                [
                  `Insult ${i}`,
                  () => {
                    if (
                      ((s.rel = clamp(s.rel - rint(15, 25))),
                      (n.trouble = (n.trouble || 0) + e + 1),
                      n.trouble >= 6)
                    )
                      return (
                        setTimeout(() => punish(0, o), 0),
                        fx({ Happiness: 2 }, `I insulted the principal, ${s.title}.`)
                      );
                    const t = rint(2, 5);
                    return (
                      (n.suspended = !0),
                      (n.grades = clamp(n.grades - 6)),
                      fx({ Happiness: 2 }, ""),
                      setTimeout(() => parentArgument("suspend"), 0),
                      {
                        msg: `I insulted the principal, ${s.title}. ${l} suspended me from school for ${t} days.`,
                        title: "Don't gotta tell me twice",
                        text: `The principal, ${s.title}, suspended you from school for ${NUM_WORDS[t].toLowerCase()} days.`,
                      }
                    );
                  },
                  { confirm: `Are you sure you want to insult the principal, ${s.title}?` },
                ],
                [
                  "Apologize for my actions",
                  () => (
                    (s.rel = clamp(s.rel + rint(2, 6))),
                    chance(0.6)
                      ? (o && setTimeout(() => parentArgument("office"), 0),
                        `I apologized to the principal, ${s.title}. ${l} let me off with a warning.`)
                      : (setTimeout(() => punish(e, o), 0),
                        `I apologized to the principal, ${s.title}, but ${r} still punished me.`)
                  ),
                ],
              ],
            }),
          }),
        );
      }
      function gotDetention(e) {
        const t = state.school;
        if (t && !state.dead) {
          if (((t.trouble = (t.trouble || 0) + 1), (t.grades = clamp(t.grades - 2)), t.trouble >= 3))
            return punish(0, !0);
          parentArgument(/skip|leaving school/i.test(e || "") ? "skip" : "detention");
        }
      }
      const SKIP_DOINGS = [
        "go to the mall",
        "play video games all day",
        "go to the beach",
        "see a movie",
        "hang out at the park",
        "go fishing",
        "sleep in",
        "go to the arcade",
        "binge-watch a TV show",
        "go skateboarding",
        "go to the zoo",
        "eat junk food at a diner",
        "go swimming at the lake",
        "go bowling",
        "ride your bike around town",
        "go to a concert",
        "play basketball at the park",
        "go thrift shopping",
        "visit the aquarium",
        "hang out at a friend's house",
      ];
      function skipSchool() {
        const e = state.school;
        if (!e) return;
        (e.skips = (e.skips || 0) + 1),
          e.college ||
            ((e.absent = (e.absent || 0) + 1),
            e.skipYear !== state.age && ((e.skipYear = state.age), (e.yearSkips = 0), (e.skipSeen = [])),
            e.yearSkips++);
        const t = any(SKIP_DOINGS),
          a = e.college ? "class" : "school",
          o = t.replace(/\byour\b/g, "my");
        if ((screen.classList.remove("open"), !e.college)) {
          const e = skipEventPick();
          if (e) return void setTimeout(() => openEvent(e), 120);
        }
        return chance(Math.min(0.6, 0.2 + 0.1 * (e.skips - 1)))
          ? (say(`I skipped ${a} to ${o}, but I got caught.`),
            e.college
              ? ((e.grades = clamp(e.grades - rint(4, 9))),
                notice(
                  "Busted",
                  `You skipped class to ${t}, but your professor noticed. Your grades took a hit.`,
                  null,
                  !0,
                ))
              : void notice(
                  "Busted",
                  `You skipped school to ${t}, but you got caught!`,
                  () => {
                    if (e.skips >= 2 && e.grades < 35)
                      return (e.trouble = Math.max(e.trouble || 0, 2)), punish(1, !0);
                    const t = rint(1, 3);
                    queuePopup(() =>
                      eduCard({
                        icon: "23f0",
                        title: "Detention",
                        lead: "You got detention for skipping school!",
                        rows: [
                          ["Reason", "Skipping school"],
                          ["Length", `${t} hour${t > 1 ? "s" : ""} after school`],
                        ],
                      }),
                    ),
                      gotDetention("skipping school");
                  },
                  !0,
                ))
          : (fx({ Happiness: 3 }, ""),
            (e.grades = clamp(e.grades - rint(0, 3))),
            e.college && (e.stress = clamp(e.stress - rint(5, 12))),
            say(`I skipped ${a} to ${o}.`),
            notice("Playing hooky", `You skipped ${a} to ${t}.`, null, !0));
      }
      const SKIP_EVENTS = [],
        SK = (e, t, a, o, n, s) => SKIP_EVENTS.push({ ico: e, t: t, a: a, cat: o, ok: n, make: s }),
        skPr = (e) =>
          "f" === (e.g || e.gender)
            ? { he: "she", him: "her", his: "her", He: "She" }
            : { he: "he", him: "him", his: "his", He: "He" };
      function skCtx() {
        const e = state.school,
          t = aliveParents(),
          a = t.length ? any(t) : null,
          o = e.faculty.find((e) => "Teacher" === e.role) || e.faculty[0],
          n = e.faculty.find((e) => "Principal" === e.role) || o,
          s = e.classmates.length ? any(e.classmates) : null,
          r = state.friends.filter((e) => !e.away),
          i =
            r.find((e) => e.best) ||
            (r.length ? any(r) : null) ||
            [...e.classmates].sort((e, t) => t.rel - e.rel)[0] ||
            null,
          l = a ? ("Mother" === a.role ? "mom" : "dad") : "parent";
        return {
          S: e,
          par: a,
          tch: o,
          prin: n,
          cm: s,
          fr: i,
          mom: l,
          parName: a ? `your ${l}, ${a.first}` : "your guardian",
        };
      }
      const skWho = (e) =>
          e
            ? {
                who: e.title || `${e.first} ${e.last || SURNAME}`,
                av: "1f464",
                person: {
                  look: e.look,
                  g: e.g || e.gender,
                  age:
                    null != e.ageAtBirth
                      ? e.ageAtBirth + state.age
                      : null != e.ageOffset
                        ? Math.max(1, state.age + e.ageOffset)
                        : null != e.born
                          ? personAge(e)
                          : state.age,
                },
              }
            : {},
        skCaught = (e) => {
          const t = state.school;
          return chance(Math.min(0.95, e + 0.06 * ((t.skips || 1) - 1)));
        },
        skR = (e, t) => {
          e && (e.rel = clamp((e.rel ?? 50) + t));
        },
        skG = (e) => {
          const t = state.school;
          t && (t.grades = clamp(t.grades + e));
        },
        skP = (e) => {
          const t = state.school;
          t && (t.popularity = clamp(t.popularity + e));
        },
        skFx = (e) => fx(e, ""),
        skCash = (e) => {
          (state.money = Math.max(0, state.money + e)), renderStats();
        },
        skAttend = () => {
          const e = state.school;
          (e.absent = Math.max(0, (e.absent || 0) - 1)), (e.skips = Math.max(0, (e.skips || 0) - 1));
        },
        skDet = (e) => {
          const t = rint(1, 3);
          queuePopup(() =>
            eduCard({
              icon: "23f0",
              title: "Detention",
              lead: `You got detention for ${e}!`,
              rows: [
                ["Reason", capFirst(e)],
                ["Length", `${t} hour${t > 1 ? "s" : ""} after school`],
              ],
            }),
          ),
            gotDetention(e);
        },
        skOffice = (e) => schoolTrouble(1, !0, e, !0),
        skSuspend = () => {
          const e = state.school;
          (e.trouble = Math.max(e.trouble || 0, 2)), (e.suspended = !1), punish(1, !0);
        },
        skGradRisk = (e) => {
          const t = state.school;
          t.absent = (t.absent || 0) + e;
        };
      function skipEventPick() {
        const e = state.school,
          t = e.skipSeen || [],
          a = SKIP_EVENTS.filter(
            (a) => state.age >= a.a[0] && state.age <= a.a[1] && !t.includes(a.t) && (!a.ok || a.ok(e)),
          );
        if (!a.length) return null;
        const o = { fun: 0.4, conf: 0.3, disc: 0.2, rare: 0.1 },
          n = Object.keys(o).filter((e) => a.some((t) => t.cat === e));
        let s = Math.random() * n.reduce((e, t) => e + o[t], 0),
          r = n[0];
        for (const e of n)
          if ((s -= o[e]) < 0) {
            r = e;
            break;
          }
        const i = any(a.filter((e) => e.cat === r));
        return t.push(i.t), (e.skipSeen = t), skEvent(i);
      }
      function skEvent(e) {
        return {
          kind: "Skipping School",
          school: !0,
          make() {
            const t = skCtx(),
              a = e.make(t);
            let o = null;
            return {
              ...a,
              iconSrc: `skip/${e.ico}.png`,
              icon: "1f3eb",
              title: e.t,
              feedback: !0,
              ...(a.who ? {} : { who: e.t, av: "1f3eb", avSrc: `skip/${e.ico}.png` }),
              choices: a.choices.map(([e, t]) => [
                e,
                () =>
                  t((e) => {
                    o = e;
                  }),
              ]),
              get then() {
                return o;
              },
            };
          },
        };
      }
      const HAS_PAR = () => aliveParents().length > 0;
      SK("school", "Busted!", [8, 18], "disc", null, (e) => ({
        ...skWho(e.prin),
        angry: !0,
        desc: `You decided to skip school today, but just as you were leaving the school grounds, your principal, ${e.prin.title}, spotted you sneaking through the front gate!`,
        choices: [
          [
            "Run away",
            () =>
              skCaught(0.45)
                ? (skDet("skipping school"),
                  `I tried to run from the principal, ${e.prin.title}, but I got caught.`)
                : (skFx({ Happiness: 4 }), "I outran the principal and escaped from school!"),
          ],
          [
            "Pretend you're sick",
            () =>
              chance(0.4)
                ? (skFx({ Happiness: 2 }),
                  `I pretended to be sick and ${e.prin.title} sent me to the school nurse instead of punishing me.`)
                : (skR(e.prin, -4), skDet("skipping school"), `${e.prin.title} didn't believe I was sick.`),
          ],
          [
            "Tell the truth",
            () => {
              skR(e.prin, 3);
              const t = rint(1, 2);
              queuePopup(() =>
                eduCard({
                  icon: "23f0",
                  title: "Detention",
                  lead: "You got detention for skipping school!",
                  rows: [
                    ["Reason", "Skipping school"],
                    ["Length", `${t} hour${t > 1 ? "s" : ""} after school`],
                  ],
                }),
              );
              const a = state.school;
              return (
                (a.grades = clamp(a.grades - 1)),
                `I told ${e.prin.title} the truth about skipping, so I only got a short detention.`
              );
            },
          ],
          [
            "Insult the principal",
            () => (
              skR(e.prin, -20),
              skSuspend(),
              `I insulted the principal, ${e.prin.title}, when ${skPr(e.prin).he} caught me skipping school.`
            ),
          ],
        ],
      })),
        SK("sick", "Fake Sick", [8, 18], "conf", HAS_PAR, (e) => ({
          ...skWho(e.par),
          desc: `You don't feel like going to school today, so you consider pretending to be sick. ${capFirst(e.parName)}, is standing in your bedroom doorway, waiting for an explanation.`,
          choices: [
            [
              "Pretend to vomit",
              () =>
                chance(0.5)
                  ? (skFx({ Happiness: 4 }), `I pretended to throw up and ${e.par.first} let me stay home.`)
                  : (skAttend(),
                    skR(e.par, -4),
                    `I faked throwing up, but my ${e.mom} saw right through it and drove me to school.`),
            ],
            [
              "Fake a fever",
              () =>
                chance(0.4)
                  ? (skFx({ Happiness: 4 }), "I faked a fever and got to stay home from school.")
                  : (skAttend(), skR(e.par, -3), `My ${e.mom} took my temperature and sent me to school.`),
            ],
            [
              "Admit you don't want to go",
              () =>
                chance(0.45)
                  ? (skR(e.par, 4),
                    skFx({ Happiness: 5 }),
                    `I admitted I didn't want to go to school and my ${e.mom} gave me a mental health day.`)
                  : (skAttend(),
                    skR(e.par, 1),
                    `I told my ${e.mom} I didn't want to go to school. ${skPr(e.par).He} made me go anyway.`),
            ],
            [
              "Sneak out of the house",
              () =>
                skCaught(0.55)
                  ? (skR(e.par, -10),
                    skFx({ Happiness: -4 }),
                    `My ${e.mom} caught me sneaking out of the house to skip school.`)
                  : (skFx({ Happiness: 5 }),
                    "I snuck out of the house and spent the day doing whatever I wanted."),
            ],
          ],
        })),
        SK("phone", "The Attendance Call", [8, 18], "conf", HAS_PAR, (e) => ({
          ...skWho(e.par),
          desc: `You skipped school today and were enjoying your freedom when your phone started ringing. It's ${e.parName}, who just received a call from the school about your absence!`,
          choices: [
            [
              "Ignore the call",
              () => (
                skR(e.par, -10),
                skFx({ Happiness: 1 }),
                `I ignored my ${e.mom}'s calls after the school reported me absent.`
              ),
            ],
            [
              "Make up an excuse",
              () =>
                chance(0.4)
                  ? `I made up an excuse and my ${e.mom} believed me.`
                  : (skR(e.par, -8),
                    skDet("skipping school"),
                    `My ${e.mom} didn't buy my excuse for skipping school.`),
            ],
            [
              "Confess",
              () => (
                skR(e.par, -5),
                skFx({ Happiness: -3 }),
                `I confessed to my ${e.mom} that I skipped school. ${skPr(e.par).He} was very disappointed in me.`
              ),
            ],
            [
              "Blame a teacher",
              () =>
                chance(0.25)
                  ? (skR(e.tch, -6), `I blamed my teacher, ${e.tch.title}, and my ${e.mom} believed me.`)
                  : (skR(e.par, -12),
                    skR(e.tch, -8),
                    skDet("lying about skipping school"),
                    `I tried to blame ${e.tch.title} for my absence. It made everything worse.`),
            ],
          ],
        })),
        SK("burger", "Fast Food Freedom", [10, 18], "conf", null, (e) => ({
          ...skWho(e.tch),
          desc: `After skipping school, you decide to visit a fast-food restaurant. Unfortunately, one of your teachers, ${e.tch.title}, walks in while you're eating a burger!`,
          choices: [
            [
              "Hide behind the counter",
              () =>
                skCaught(0.35)
                  ? (skR(e.tch, -6),
                    skDet("skipping school"),
                    `${e.tch.title} spotted me hiding behind the counter.`)
                  : (skFx({ Happiness: 3 }), `I hid behind the counter until ${e.tch.title} left.`),
            ],
            [
              "Pretend you don't recognize them",
              () =>
                skCaught(0.5)
                  ? (skR(e.tch, -6),
                    skDet("skipping school"),
                    `${e.tch.title} recognized me and reported me to the school.`)
                  : `I pretended not to recognize ${e.tch.title}, and it worked.`,
            ],
            [
              "Offer to buy them food",
              () => {
                const t = localPrice(12);
                return (
                  skCash(-Math.min(t, state.money)),
                  chance(0.3)
                    ? (skR(e.tch, 5),
                      `I bought ${e.tch.title} a burger and ${skPr(e.tch).he} agreed to keep quiet.`)
                    : (skR(e.tch, -8),
                      skDet("skipping school"),
                      `${e.tch.title} refused my bribe and reported me.`)
                );
              },
            ],
            [
              "Run out of the restaurant",
              () =>
                skCaught(0.4)
                  ? (skDet("skipping school"),
                    `I ran out of the restaurant, but ${e.tch.title} saw me anyway.`)
                  : (skFx({ Happiness: 1 }),
                    "I left my burger behind and ran out of the restaurant before my teacher saw me."),
            ],
          ],
        })),
        SK("mall", "Mall Adventure", [10, 18], "conf", null, (e) => ({
          desc: "You skipped school to spend the afternoon at the shopping mall. A security guard approaches you and asks why you're not in class.",
          choices: [
            [
              "Say school ended early",
              () =>
                chance(0.5)
                  ? (skFx({ Happiness: 4 }),
                    "I told the mall security guard that school let out early. He believed me.")
                  : (skDet("skipping school"), "The mall security guard called my school."),
            ],
            [
              "Tell the truth",
              () =>
                chance(0.6)
                  ? (skDet("skipping school"),
                    "I told the mall security guard the truth and he called my school.")
                  : "I told the mall security guard the truth. He just told me to go back to school.",
            ],
            [
              "Walk away",
              () =>
                chance(0.5)
                  ? "I walked away from the mall security guard."
                  : (skFx({ Happiness: -3 }),
                    skP(-2),
                    "Mall security escorted me out of the mall in front of everyone."),
            ],
            [
              "Pretend you're homeschooled",
              () =>
                chance(0.55)
                  ? (skFx({ Happiness: 4 }),
                    "I told the mall security guard I was homeschooled, and he bought it.")
                  : (skDet("skipping school"), "The mall security guard didn't believe I was homeschooled."),
            ],
          ],
        })),
        SK("game", "Gaming All Day", [8, 18], "conf", HAS_PAR, (e) => ({
          ...skWho(e.par),
          desc: `You decided to skip school and spend the entire day playing video games. After several hours, ${e.parName}, suddenly comes home early!`,
          choices: [
            [
              "Turn off the console",
              () =>
                skCaught(0.4)
                  ? (skR(e.par, -8),
                    skDet("skipping school"),
                    `My ${e.mom} felt the warm console and knew I'd skipped school.`)
                  : (skFx({ Happiness: 4 }), `I turned off my console just before my ${e.mom} walked in.`),
            ],
            [
              "Hide under your bed",
              () =>
                skCaught(0.5)
                  ? (skR(e.par, -8), skDet("skipping school"), `My ${e.mom} found me hiding under my bed.`)
                  : `I hid under my bed until my ${e.mom} left again.`,
            ],
            [
              "Pretend you're studying",
              () =>
                chance(0.4)
                  ? (skR(e.par, 3), `I pretended to be studying and my ${e.mom} was impressed.`)
                  : (skR(e.par, -10),
                    skDet("skipping school"),
                    `My ${e.mom} saw the game on the screen behind my textbook.`),
            ],
            [
              "Keep playing",
              () => (
                skR(e.par, -15),
                skFx({ Happiness: 2 }),
                skDet("skipping school"),
                `I kept playing video games in front of my ${e.mom}. ${skPr(e.par).He} took my console away.`
              ),
            ],
          ],
        })),
        SK("police", "Truancy Officer", [8, 18], "disc", null, (e) => ({
          who: "Truancy Officer",
          av: "1f46e",
          iconSrc: "skip/police.png",
          desc: "While wandering around town during school hours, you're approached by a truancy officer who wants to know why you're not at school.",
          choices: [
            [
              "Run away",
              () =>
                skCaught(0.5)
                  ? (skOffice("running from a truancy officer"),
                    "The truancy officer chased me down and took me back to school.")
                  : (skFx({ Happiness: 4 }), "I outran the truancy officer!"),
            ],
            [
              "Give a fake name",
              () =>
                chance(0.35)
                  ? "I gave the truancy officer a fake name and he let me go."
                  : (skSuspend(), "The truancy officer found out I gave him a fake name."),
            ],
            [
              "Cooperate",
              () => (
                skAttend(),
                skDet("skipping school"),
                "I cooperated with the truancy officer and he drove me back to school."
              ),
            ],
            [
              "Claim you're on a school trip",
              () =>
                chance(0.4)
                  ? (skFx({ Happiness: 3 }),
                    "I told the truancy officer I was on a school trip, and he believed me.")
                  : (skDet("skipping school"),
                    'The truancy officer called my school to check on my "school trip".'),
            ],
          ],
        })),
        SK("cool", "The Cool Kids", [11, 18], "fun", null, (e) => ({
          desc: "A group of popular students invites you to skip your next class and hang out behind the school. They promise you'll have more fun than sitting in class.",
          choices: [
            [
              "Join them",
              () => (
                skP(rint(4, 9)),
                skG(-rint(2, 5)),
                skFx({ Happiness: 5 }),
                skCaught(0.3)
                  ? (skDet("skipping class"),
                    "I skipped class with the popular kids, but a teacher caught us.")
                  : "I skipped class to hang out with the popular kids."
              ),
            ],
            ["Refuse", () => (skAttend(), skP(-1), "I turned down the popular kids and went to class.")],
            [
              "Tell a teacher",
              () => (
                skAttend(),
                skR(e.tch, 6),
                skP(-rint(4, 8)),
                `I told ${e.tch.title} that the popular kids were skipping class.`
              ),
            ],
            [
              "Suggest somewhere else",
              () => (
                skP(rint(3, 7)),
                skG(-rint(1, 4)),
                skFx({ Happiness: 4 }),
                skCaught(0.15)
                  ? (skDet("skipping class"),
                    "I talked the popular kids into hiding somewhere else, but we still got caught.")
                  : "I talked the popular kids into skipping somewhere nobody would find us."
              ),
            ],
          ],
        })),
        SK("pizza", "Pizza Party", [10, 18], "fun", null, (e) => {
          const t = e.fr,
            a = t ? t.first : "your best friend";
          return {
            ...skWho(t),
            desc:
              (t ? `Your best friend, ${a},` : "Your best friend") +
              " suggests skipping school to order an enormous pizza and watch movies at their house while their parents are away.",
            choices: [
              [
                "Join the party",
                () => (
                  skFx({ Happiness: 6 }),
                  skR(t, 6),
                  skG(-rint(1, 4)),
                  skCaught(0.25)
                    ? (skDet("skipping school"),
                      `I skipped school for a pizza party at ${a}'s house, but we got caught.`)
                    : `I skipped school to eat pizza and watch movies with ${a}.`
                ),
              ],
              [
                "Decline",
                () => (skAttend(), skR(t, -2), `I turned down ${a}'s pizza party and went to school.`),
              ],
              [
                "Invite more friends",
                () => (
                  skFx({ Happiness: 9 }),
                  skP(4),
                  skR(t, 4),
                  skG(-rint(2, 5)),
                  skCaught(0.5)
                    ? (skDet("skipping school"),
                      `Too many of us skipped for ${a}'s pizza party and the school noticed.`)
                    : `I invited half the class to skip school for ${a}'s pizza party.`
                ),
              ],
              [
                "Tell your friend it's a bad idea",
                () => (skAttend(), skR(t, -6), `I told ${a} that skipping school for pizza was a bad idea.`),
              ],
            ],
          };
        }),
        SK("bus", "Missed the Bus", [6, 18], "fun", null, (e) => ({
          desc: "You missed your school bus this morning. Rather than asking for a ride, you consider taking the entire day off without permission.",
          choices: [
            [
              "Walk to school",
              () => (
                skAttend(),
                skFx({ Health: 1 }),
                chance(0.5)
                  ? (skG(-1), "I walked to school and arrived late.")
                  : "I walked to school and made it just in time."
              ),
            ],
            [
              "Skip school",
              () => (
                skFx({ Happiness: 4 }), skG(-rint(1, 3)), "I missed the bus and skipped school for the day."
              ),
            ],
            [
              "Ask your parent for a ride",
              () => (
                skAttend(), e.par && skR(e.par, chance(0.6) ? 2 : -3), `My ${e.mom} drove me to school.`
              ),
            ],
            [
              "Go back to sleep",
              () => (skFx({ Happiness: 5 }), skG(-rint(1, 3)), "I missed the bus, so I went back to bed."),
            ],
          ],
        })),
        SK(
          "angry",
          "Angry Parent",
          [8, 18],
          "conf",
          (e) => HAS_PAR() && (e.skips || 0) >= 3,
          (e) => ({
            ...skWho(e.par),
            angry: !0,
            desc: `${capFirst(e.parName)}, discovers that you've been secretly skipping classes for several days. ${skPr(e.par).He} demands to know what you've been doing instead.`,
            choices: [
              [
                "Apologize",
                () =>
                  chance(0.6)
                    ? (skR(e.par, 4),
                      `I apologized to my ${e.mom} for skipping school and ${skPr(e.par).he} forgave me.`)
                    : (skR(e.par, -3),
                      `I apologized to my ${e.mom}, but ${skPr(e.par).he} grounded me anyway.`),
              ],
              [
                "Lie about being bullied",
                () =>
                  chance(0.5)
                    ? (skR(e.par, 2),
                      skOffice("a meeting about bullying"),
                      `I told my ${e.mom} I'd been skipping because I was being bullied. ${skPr(e.par).He} called the school.`)
                    : (skR(e.par, -14), `My ${e.mom} found out I lied about being bullied.`),
              ],
              [
                "Argue",
                () => (
                  skR(e.par, -12), skFx({ Happiness: -4 }), `I argued with my ${e.mom} about skipping school.`
                ),
              ],
              [
                "Promise to improve",
                () => (
                  skR(e.par, 2),
                  (state.school.promise = state.age),
                  `I promised my ${e.mom} I'd stop skipping school.`
                ),
              ],
            ],
          }),
        ),
        SK("books", "Surprise Exam", [10, 18], "disc", null, (e) => ({
          ...skWho(e.tch),
          desc: `You skipped school on the same day your teacher, ${e.tch.title}, announced an important surprise exam. Your classmates are now texting you about what you missed.`,
          choices: [
            [
              "Ask for a makeup exam",
              () =>
                chance(0.5)
                  ? (skG(-1), skR(e.tch, 2), `${e.tch.title} let me take a makeup exam.`)
                  : (skG(-6), `${e.tch.title} refused to give me a makeup exam.`),
            ],
            ["Ignore it", () => (skG(-rint(6, 10)), "I got a zero on the surprise exam I skipped.")],
            [
              "Ask a friend for notes",
              () => {
                const t = e.fr;
                return (
                  skR(t, 4),
                  skG(-2),
                  skFx({ Smarts: 1 }),
                  t
                    ? `${t.first} gave me notes from the exam day.`
                    : "A classmate gave me notes from the exam day."
                );
              },
            ],
            [
              "Pretend you were ill",
              () =>
                chance(0.45)
                  ? (skG(-1),
                    `I told ${e.tch.title} I was sick, and ${skPr(e.tch).he} let me retake the exam.`)
                  : (skR(e.tch, -6),
                    skG(-6),
                    skDet("lying about being sick"),
                    `${e.tch.title} knew I was lying about being sick.`),
            ],
          ],
        })),
        SK("movie", "Movie Marathon", [10, 18], "conf", null, (e) => ({
          ...skWho(e.prin),
          desc: `You skipped school to watch movies at a local theater. Halfway through the film, you recognize your principal, ${e.prin.title}, sitting a few rows ahead!`,
          choices: [
            [
              "Sneak out",
              () =>
                skCaught(0.3)
                  ? (skOffice("skipping school"), `${e.prin.title} saw me sneaking out of the theater.`)
                  : "I snuck out of the movie theater before the principal saw me.",
            ],
            [
              "Remain seated",
              () =>
                skCaught(0.45)
                  ? (skOffice("skipping school"), `${e.prin.title} turned around and saw me in the theater.`)
                  : (skFx({ Happiness: 4 }), "I finished the movie without the principal noticing me."),
            ],
            [
              "Hide your face",
              () =>
                skCaught(0.2)
                  ? (skOffice("skipping school"), `${e.prin.title} noticed me hiding my face.`)
                  : (skFx({ Happiness: 3 }),
                    "I hid my face through the whole movie. The principal never noticed me."),
            ],
            [
              "Approach the principal",
              () => (
                skR(e.prin, chance(0.5) ? 3 : -5),
                skOffice("skipping school"),
                `I walked up to ${e.prin.title} in the theater and explained why I wasn't at school.`
              ),
            ],
          ],
        })),
        SK("beach", "Beach Day", [12, 18], "fun", null, (e) => ({
          ...skWho(e.cm),
          desc: `Instead of attending school, you and your friends have decided to spend the afternoon at the beach. Unfortunately, one of your classmates${e.cm ? `, ${e.cm.first},` : ""} posts photos online.`,
          choices: [
            [
              "Enjoy the beach",
              () => (
                skFx({ Happiness: 7, Health: 1 }),
                skCaught(0.35)
                  ? (skDet("skipping school"), "The school saw the beach photos and gave me detention.")
                  : "I spent a day at the beach instead of going to school."
              ),
            ],
            [
              "Ask them to delete the photos",
              () =>
                chance(0.6)
                  ? (skR(e.cm, -2), `${e.cm ? e.cm.first : "My classmate"} deleted the beach photos.`)
                  : (skDet("skipping school"), "The beach photos were already all over school."),
            ],
            [
              "Go home immediately",
              () =>
                skCaught(0.15)
                  ? (skDet("skipping school"), "I left the beach, but I was already in the photos.")
                  : "I left the beach before anyone could tag me.",
            ],
            [
              "Post your own photos",
              () => (
                skP(rint(4, 8)),
                skFx({ Happiness: 5 }),
                skCaught(0.65)
                  ? (skDet("skipping school"), "I posted my own beach photos and the school saw them.")
                  : "I posted my own beach photos. Everyone thought I was so cool."
              ),
            ],
          ],
        })),
        SK("house", "Home Alone", [8, 18], "conf", HAS_PAR, (e) => ({
          ...skWho(e.par),
          desc: `You stayed home from school without telling anyone. Suddenly, you hear ${e.parName}, unlocking the front door much earlier than expected!`,
          choices: [
            [
              "Hide in a closet",
              () =>
                skCaught(0.4)
                  ? (skR(e.par, -8), skDet("skipping school"), `My ${e.mom} found me hiding in the closet.`)
                  : `I hid in the closet until my ${e.mom} left.`,
            ],
            [
              "Pretend you're asleep",
              () =>
                chance(0.45)
                  ? (skFx({ Happiness: 2 }), `I pretended to be asleep and my ${e.mom} thought I was sick.`)
                  : (skR(e.par, -6), skDet("skipping school"), `My ${e.mom} didn't believe I was sick.`),
            ],
            [
              "Explain yourself",
              () => (
                skR(e.par, -4),
                chance(0.5)
                  ? `I told my ${e.mom} I'd skipped school. ${skPr(e.par).He} let it slide this once.`
                  : (skDet("skipping school"),
                    `I told my ${e.mom} I'd skipped school, and ${skPr(e.par).he} called the school.`)
              ),
            ],
            [
              "Escape through another exit",
              () =>
                skCaught(0.5)
                  ? (skR(e.par, -10),
                    skDet("skipping school"),
                    `My ${e.mom} caught me climbing out the window.`)
                  : (skFx({ Happiness: 3 }), "I climbed out the back window before anyone saw me."),
            ],
          ],
        })),
        SK("money", "Money for Lunch", [8, 18], "fun", HAS_PAR, (e) => {
          const t = localPrice(5 * rint(2, 4));
          return {
            ...skWho(e.par),
            desc: `${capFirst(e.parName)}, gave you money for school lunch, but since you skipped school today, you still have the cash.<br><br>Lunch money: ${usd(t)}`,
            choices: [
              ["Keep the money", () => (skCash(t), `I kept the ${usd(t)} lunch money.`)],
              ["Buy snacks", () => (skFx({ Happiness: 4, Health: -1 }), "I spent my lunch money on snacks.")],
              ["Return it", () => (skR(e.par, 6), `I gave my lunch money back to my ${e.mom}.`)],
              [
                "Spend it on games",
                () => (
                  skFx({ Happiness: 5 }),
                  chance(0.35)
                    ? (skR(e.par, -8),
                      `I spent my lunch money at the arcade. My ${e.mom} found out and grounded me.`)
                    : "I spent my lunch money at the arcade."
                ),
              ],
            ],
          };
        }),
        SK("teacher", "Teacher Encounter", [8, 18], "conf", null, (e) => ({
          ...skWho(e.tch),
          desc: `You skipped class to wander around town, but you unexpectedly run into your teacher, ${e.tch.title}, who is out running errands.`,
          choices: [
            [
              "Pretend to be someone else",
              () =>
                chance(0.3)
                  ? `I pretended to be someone else, and ${e.tch.title} bought it.`
                  : (skR(e.tch, -6), skDet("skipping school"), `${e.tch.title} recognized me right away.`),
            ],
            [
              "Explain yourself",
              () => (
                skR(e.tch, 2),
                chance(0.5)
                  ? `I explained myself to ${e.tch.title}, who let me off with a warning.`
                  : (skDet("skipping school"),
                    `I explained myself to ${e.tch.title}, but I still got detention.`)
              ),
            ],
            [
              "Run away",
              () =>
                skCaught(0.45)
                  ? (skR(e.tch, -8),
                    skDet("skipping school"),
                    `I ran from ${e.tch.title}, but ${skPr(e.tch).he} reported me anyway.`)
                  : `I ran away from ${e.tch.title}.`,
            ],
            [
              "Ask them not to tell",
              () =>
                chance((e.tch.rel ?? 50) / 140)
                  ? (skR(e.tch, -2), `${e.tch.title} agreed not to tell anyone.`)
                  : (skDet("skipping school"),
                    `I begged ${e.tch.title} not to tell, but ${skPr(e.tch).he} reported me.`),
            ],
          ],
        })),
        SK("lying", "Fake Doctor's Note", [12, 18], "disc", null, (e) => ({
          ...skWho(e.cm),
          desc: `After skipping school, you realize the attendance office wants written proof that you were sick. A classmate${e.cm ? `, ${e.cm.first},` : ""} suggests using a fake doctor's note.`,
          choices: [
            [
              "Submit the fake note",
              () =>
                chance(0.5)
                  ? (skAttend(), "I handed in a fake doctor's note and the attendance office accepted it.")
                  : (skSuspend(), "The attendance office spotted my fake doctor's note."),
            ],
            [
              "Admit you skipped",
              () => (skDet("skipping school"), "I admitted to the attendance office that I skipped school."),
            ],
            [
              "Ask your parent for help",
              () =>
                e.par && chance(0.4)
                  ? (skR(e.par, -2), skAttend(), `My ${e.mom} wrote a note excusing my absence.`)
                  : (e.par && skR(e.par, -8),
                    skDet("skipping school"),
                    `My ${e.mom} refused to cover for me.`),
            ],
            [
              "Ignore the request",
              () => (
                skGradRisk(1),
                skG(-2),
                "I ignored the attendance office. My unexcused absence stayed on my record."
              ),
            ],
          ],
        })),
        SK(
          "dog",
          "Walking the Dog",
          [8, 18],
          "fun",
          () => state.pets.some((e) => "Dog" === e.species && !e.dead),
          (e) => {
            const t = state.pets.find((e) => "Dog" === e.species && !e.dead);
            return {
              desc: `You decided to skip school and take your dog, ${t.name}, for an unusually long walk. A neighbor recognizes you and asks why you're not in class.`,
              choices: [
                [
                  "Say you're on vacation",
                  () => (
                    skR(t, 6),
                    chance(0.55)
                      ? "I told the neighbor I was on vacation. They believed me."
                      : (e.par && skR(e.par, -6),
                        "The neighbor told my parents they saw me walking the dog during school.")
                  ),
                ],
                [
                  "Tell the truth",
                  () => (
                    skR(t, 6),
                    chance(0.6)
                      ? (e.par && skR(e.par, -7), `The neighbor told my ${e.mom} I was skipping school.`)
                      : "I told the neighbor the truth. They laughed it off."
                  ),
                ],
                ["Quickly leave", () => (skR(t, 4), `I hurried home with ${t.name}.`)],
                [
                  "Ask them to keep quiet",
                  () => (
                    skR(t, 6),
                    chance(0.5)
                      ? "The neighbor promised to keep my secret."
                      : (e.par && skR(e.par, -7), "The neighbor told my parents anyway.")
                  ),
                ],
              ],
            };
          },
        ),
        SK("bike", "Bicycle Escape", [10, 18], "conf", null, (e) => ({
          ...skWho(e.prin),
          desc: `You skipped school and went for a bicycle ride. Suddenly, you spot your principal, ${e.prin.title}, driving down the street toward you!`,
          choices: [
            [
              "Pedal away",
              () => (
                skFx({ Health: 1 }),
                skCaught(0.4)
                  ? (skOffice("skipping school"), `I pedaled away, but ${e.prin.title} recognized my bike.`)
                  : "I pedaled away as fast as I could and escaped."
              ),
            ],
            [
              "Turn onto another street",
              () =>
                skCaught(0.25)
                  ? (skOffice("skipping school"), `${e.prin.title} followed me down the side street.`)
                  : "I turned down a side street before the principal saw me.",
            ],
            [
              "Stop and explain",
              () => (
                skR(e.prin, 2),
                skDet("skipping school"),
                `I stopped my bike and explained myself to ${e.prin.title}.`
              ),
            ],
            [
              "Wave at the principal",
              () => (
                skR(e.prin, -5),
                skOffice("skipping school"),
                `I waved at the principal, ${e.prin.title}, while skipping school.`
              ),
            ],
          ],
        })),
        SK("cake", "Birthday Excuse", [8, 18], "conf", HAS_PAR, (e) => ({
          ...skWho(e.tch),
          desc: `You skipped school because you wanted to celebrate your birthday your own way, but your teacher, ${e.tch.title}, contacts your parents asking where you are.`,
          choices: [
            [
              "Claim your family gave permission",
              () =>
                chance(0.4)
                  ? (skFx({ Happiness: 5 }),
                    "I said my family let me take my birthday off, and everyone believed me.")
                  : (skR(e.par, -6),
                    skDet("skipping school"),
                    `${e.tch.title} called my ${e.mom}, who said I never had permission.`),
            ],
            [
              "Admit you wanted the day off",
              () =>
                chance(0.5)
                  ? (skR(e.par, 2), skFx({ Happiness: 4 }), `My ${e.mom} let my birthday skip slide.`)
                  : (skR(e.par, -5),
                    skDet("skipping school"),
                    `My ${e.mom} wasn't happy I skipped school for my birthday.`),
            ],
            [
              "Ignore everyone",
              () => (
                skGradRisk(1),
                skR(e.par, -6),
                skR(e.tch, -4),
                skFx({ Happiness: 3 }),
                "I ignored everyone and celebrated my birthday my own way."
              ),
            ],
            [
              "Promise to make up missed work",
              () => (
                skR(e.tch, 4),
                skG(-1),
                `I promised ${e.tch.title} I'd make up the work I missed on my birthday.`
              ),
            ],
          ],
        })),
        SK("sleep", "Overslept", [8, 18], "fun", null, (e) => ({
          desc: "You accidentally slept through your alarm and woke up several hours after school started. You now have to decide whether attending is worth the trouble.",
          choices: [
            ["Go to school late", () => (skAttend(), skG(-1), "I overslept and went to school late.")],
            [
              "Sleep all day",
              () => (
                skFx({ Happiness: 5, Health: 1 }),
                skG(-rint(2, 4)),
                "I overslept and decided to sleep the whole day."
              ),
            ],
            [
              "Pretend you're sick",
              () =>
                chance(0.55)
                  ? "I overslept and pretended to be sick. Nobody suspected a thing."
                  : (skDet("skipping school"),
                    "I pretended to be sick after oversleeping, but my school found out."),
            ],
            [
              "Ask your parent what to do",
              () => (
                skAttend(),
                e.par && skR(e.par, 2),
                e.par ? `My ${e.mom} drove me to school.` : "I went to school late."
              ),
            ],
          ],
        })),
        SK(
          "handshake",
          "Best Friend's Idea",
          [10, 18],
          "fun",
          () => state.friends.some((e) => e.best && !e.away),
          (e) => {
            const t = state.friends.find((e) => e.best && !e.away),
              a = skPr(t);
            return {
              ...skWho(t),
              desc: `Your best friend, ${t.first}, begs you to skip class with ${a.him} because ${a.he} doesn't want to be alone. ${a.He} insists you owe ${a.him} a favor.`,
              choices: [
                [
                  "Skip together",
                  () => (
                    skR(t, 8),
                    skFx({ Happiness: 5 }),
                    skG(-2),
                    skCaught(0.3)
                      ? (skDet("skipping class"), `I skipped class with ${t.first}, but we got caught.`)
                      : `I skipped class with my best friend, ${t.first}.`
                  ),
                ],
                [
                  "Refuse politely",
                  () => (skAttend(), skR(t, -2), `I politely told ${t.first} I couldn't skip class.`),
                ],
                ["Argue", () => (skAttend(), skR(t, -10), `I argued with ${t.first} about skipping class.`)],
                [
                  "Suggest meeting after school",
                  () => (skAttend(), skR(t, 3), `I convinced ${t.first} to hang out after school instead.`),
                ],
              ],
            };
          },
        ),
        SK("camera", "Caught on Camera", [12, 18], "disc", null, (e) => ({
          ...skWho(e.prin),
          angry: !0,
          desc: `You thought nobody noticed you leaving school early, but a security camera recorded everything. The principal, ${e.prin.title}, now wants an explanation.`,
          choices: [
            [
              "Admit it",
              () =>
                chance(0.4)
                  ? (skR(e.prin, 2), `I admitted it and ${e.prin.title} let me off with a warning.`)
                  : (skDet("leaving school early"),
                    `I admitted to ${e.prin.title} that I left school early.`),
            ],
            [
              "Deny it",
              () => (
                skR(e.prin, -10),
                chance(0.5)
                  ? (skSuspend(), `I denied it even though ${e.prin.title} had me on camera.`)
                  : (skDet("lying to the principal"),
                    "I denied leaving school, but the camera footage was clear.")
              ),
            ],
            [
              "Blame a misunderstanding",
              () =>
                chance(0.4)
                  ? `I convinced ${e.prin.title} it was all a misunderstanding.`
                  : (skDet("leaving school early"),
                    `${e.prin.title} didn't believe it was a misunderstanding.`),
            ],
            [
              "Apologize",
              () => (
                skR(e.prin, 5),
                skR(e.tch, 3),
                chance(0.5)
                  ? `I apologized to ${e.prin.title}, who let me off with a warning.`
                  : (skDet("leaving school early"),
                    `I apologized to ${e.prin.title}, but still got detention.`)
              ),
            ],
          ],
        })),
        SK("siren", "School Lockdown Confusion", [10, 18], "rare", null, (e) => ({
          desc: "While skipping class outside the campus, you receive a message telling students to remain in their classrooms because of a school safety lockdown.",
          choices: [
            [
              "Follow official safety instructions",
              () => (
                skFx({ Smarts: 1 }),
                "I followed the official safety instructions during the school lockdown. Everyone was safe."
              ),
            ],
            [
              "Contact your parents",
              () =>
                e.par
                  ? (skR(e.par, chance(0.5) ? 5 : -4),
                    `I called my ${e.mom} during the school lockdown. ${skPr(e.par).He} was relieved I was safe, but upset I'd skipped.`)
                  : "I called home during the school lockdown.",
            ],
            [
              "Contact the school office",
              () => (
                skR(e.prin, 3),
                skDet("skipping class"),
                "I called the school office. They told me where to go, and gave me detention for skipping."
              ),
            ],
            [
              "Ignore the message",
              () => (skR(e.prin, -10), skSuspend(), "I ignored the school lockdown message."),
            ],
          ],
        })),
        SK("icecream", "Ice Cream Break", [8, 18], "conf", null, (e) => ({
          ...skWho(e.tch),
          desc: `You skipped school to visit an ice cream shop. As you pay, your teacher, ${e.tch.title}, walks in with another member of the school staff.`,
          choices: [
            [
              "Hide behind the menu",
              () =>
                skCaught(0.35)
                  ? (skDet("skipping school"), `${e.tch.title} spotted me behind the menu.`)
                  : (skFx({ Happiness: 3 }), "I hid behind the menu until my teacher left."),
            ],
            [
              "Leave immediately",
              () =>
                skCaught(0.3)
                  ? (skDet("skipping school"), `${e.tch.title} saw me running out of the ice cream shop.`)
                  : "I left the ice cream shop before my teacher noticed me.",
            ],
            [
              "Offer an explanation",
              () => (
                skR(e.tch, 2),
                chance(0.4)
                  ? `I explained myself to ${e.tch.title}, who let it go.`
                  : (skDet("skipping school"),
                    `I explained myself to ${e.tch.title}, but I still got detention.`)
              ),
            ],
            [
              "Continue eating",
              () => (
                skFx({ Happiness: 5 }),
                skCaught(0.6)
                  ? (skR(e.tch, -6),
                    skDet("skipping school"),
                    `I kept eating my ice cream right in front of ${e.tch.title}.`)
                  : "I kept eating my ice cream. My teacher somehow never noticed."
              ),
            ],
          ],
        })),
        SK("coaster", "Amusement Park Escape", [12, 18], "fun", null, (e) => ({
          ...skWho(e.cm),
          desc: `You and some classmates skipped school to visit an amusement park. One of the students${e.cm ? `, ${e.cm.first},` : ""} wants to upload a group photo with the school's location tagged.`,
          choices: [
            [
              "Let them upload it",
              () => (
                skFx({ Happiness: 6 }),
                skP(5),
                skCaught(0.7)
                  ? (skDet("skipping school"),
                    "The amusement park photo went viral at school and we all got detention.")
                  : "Our amusement park photo got tons of likes."
              ),
            ],
            [
              "Ask them not to",
              () => (
                skR(e.cm, -2),
                skFx({ Happiness: 4 }),
                skCaught(0.15)
                  ? (skDet("skipping school"), "We still got caught skipping school for the amusement park.")
                  : "I talked everyone out of posting our amusement park photo."
              ),
            ],
            ["Leave the group", () => (skR(e.cm, -6), skP(-2), "I left the group at the amusement park.")],
            [
              "Enjoy the rides anyway",
              () => (
                skFx({ Happiness: 8 }),
                skCaught(0.4)
                  ? (skDet("skipping school"),
                    "I rode every ride at the amusement park, but the school found out.")
                  : "I spent the day on roller coasters instead of at school."
              ),
            ],
          ],
        })),
        SK(
          "broom",
          "Detention Disaster",
          [8, 18],
          "disc",
          (e) => (e.trouble || 0) >= 1,
          (e) => ({
            ...skWho(e.tch),
            desc: `Your teacher, ${e.tch.title}, has assigned you detention because of your previous absences. However, you've been invited to hang out with friends at the same time.`,
            choices: [
              [
                "Attend detention",
                () => {
                  skR(e.tch, 4);
                  const t = state.school;
                  return (t.trouble = Math.max(0, (t.trouble || 0) - 1)), "I served my detention.";
                },
              ],
              [
                "Skip detention",
                () => (
                  skFx({ Happiness: 4 }),
                  skR(e.tch, -8),
                  skCaught(0.6)
                    ? (skSuspend(), "I skipped detention to hang out with friends.")
                    : "I skipped detention and nobody noticed."
                ),
              ],
              [
                "Ask to reschedule",
                () =>
                  chance(0.5)
                    ? (skR(e.tch, 1), `${e.tch.title} let me reschedule my detention.`)
                    : (skR(e.tch, -3), `${e.tch.title} refused to reschedule my detention.`),
              ],
              [
                "Refuse punishment",
                () => (
                  skR(e.tch, -12),
                  skOffice("refusing detention"),
                  `I told ${e.tch.title} I wasn't going to detention.`
                ),
              ],
            ],
          }),
        ),
        SK("car", "Parent Drives Past", [10, 18], "conf", HAS_PAR, (e) => ({
          ...skWho(e.par),
          desc: `You were walking through town during school hours when you suddenly saw ${e.parName}'s car approaching an intersection.`,
          choices: [
            [
              "Hide behind a building",
              () =>
                skCaught(0.3)
                  ? (skR(e.par, -8), `My ${e.mom} saw me duck behind a building.`)
                  : `I hid behind a building until my ${e.mom}'s car passed.`,
            ],
            [
              "Act naturally",
              () =>
                skCaught(0.5)
                  ? (skR(e.par, -8), `My ${e.mom} recognized me walking around town.`)
                  : `I acted natural and my ${e.mom} drove right past.`,
            ],
            [
              "Run",
              () =>
                skCaught(0.6)
                  ? (skR(e.par, -10), `My ${e.mom} saw me running away from the car.`)
                  : `I ran before my ${e.mom} could see me.`,
            ],
            [
              "Wave hello",
              () => (
                skR(e.par, -10), skDet("skipping school"), `I waved at my ${e.mom} while skipping school.`
              ),
            ],
          ],
        })),
        SK(
          "chat",
          "Group Chat Leak",
          [12, 18],
          "disc",
          (e) => e.classmates.length > 0,
          (e) => ({
            ...skWho(e.cm),
            desc: `A classmate${e.cm ? `, ${e.cm.first},` : ""} accidentally shared screenshots of your group's plan to skip school. The screenshots have reached several teachers.`,
            choices: [
              [
                "Admit your involvement",
                () => (skDet("skipping school"), "I admitted I was part of the plan to skip school."),
              ],
              [
                "Deny everything",
                () =>
                  chance(0.4)
                    ? "I denied everything and got away with it."
                    : (skSuspend(), "I denied everything, but my messages were in the screenshots."),
              ],
              [
                "Apologize to the group",
                () => (
                  skP(3),
                  S_rel(e),
                  skDet("skipping school"),
                  "I apologized to the group chat for getting everyone in trouble."
                ),
              ],
              [
                "Blame the person who leaked it",
                () => (
                  skR(e.cm, -12),
                  skP(-2),
                  skDet("skipping school"),
                  `I blamed ${e.cm ? e.cm.first : "the leaker"} for leaking our plans.`
                ),
              ],
            ],
          }),
        );
      const S_rel = (e) => {
        (state.school.classmates || []).forEach((e) => {
          e.rel = clamp(e.rel + rint(0, 3));
        });
      };
      SK("basketball", "Basketball Instead", [10, 18], "fun", null, (e) => ({
        who: "Police Officer",
        av: "1f46e",
        desc: "You skipped school to play basketball with friends at a nearby court. A local police officer stops to watch your game and asks whether school is out.",
        choices: [
          [
            "Tell the truth",
            () =>
              chance(0.5)
                ? (skDet("skipping school"), "I told the police officer the truth, and he called my school.")
                : "I told the police officer the truth. He told me to go back to school.",
          ],
          [
            "Pretend it's a holiday",
            () =>
              chance(0.5)
                ? (skFx({ Happiness: 3 }), "I told the police officer it was a holiday. He believed me.")
                : (skDet("skipping school"), "The police officer didn't believe it was a holiday."),
          ],
          [
            "Continue playing",
            () => (
              skFx({ Happiness: 5, Health: 3 }),
              skCaught(0.35)
                ? (skDet("skipping school"), "I kept playing basketball, so the officer called my school.")
                : "I kept playing basketball and the officer left."
            ),
          ],
          ["Leave", () => "I left the basketball court."],
        ],
      })),
        SK("mic", "Street Performer", [12, 18], "fun", null, (e) => ({
          desc: "While skipping school downtown, you find a street performer attracting a large audience. They invite you to join their performance!",
          choices: [
            [
              "Perform with them",
              () =>
                chance(0.6)
                  ? (skFx({ Happiness: 7, Looks: 1 }),
                    skP(3),
                    "I performed with a street performer downtown and the crowd loved it!")
                  : (skFx({ Happiness: -3 }), "I performed with a street performer and completely bombed."),
            ],
            ["Watch quietly", () => (skFx({ Happiness: 2 }), "I watched a street performer downtown.")],
            ["Decline", () => "I declined to perform with a street performer."],
            [
              "Attempt to steal the spotlight",
              () =>
                chance(0.4)
                  ? (skP(6),
                    skFx({ Happiness: 5 }),
                    "I stole the spotlight from a street performer. The crowd went wild!")
                  : (skP(-4),
                    skFx({ Happiness: -4 }),
                    "I tried to steal the spotlight from a street performer and got booed."),
            ],
          ],
        })),
        SK("book", "Library Hideout", [10, 18], "fun", null, (e) => ({
          desc: "You decide to skip school and hide in the public library. A librarian notices that you're supposed to be attending classes.",
          choices: [
            [
              "Explain you're studying independently",
              () =>
                chance(0.55)
                  ? (skFx({ Smarts: 2 }),
                    "I told the librarian I was studying independently. She left me alone.")
                  : (skDet("skipping school"), "The librarian called my school."),
            ],
            [
              "Read books",
              () => (
                skFx({ Smarts: +rint(2, 4) }),
                skCaught(0.25)
                  ? (skDet("skipping school"),
                    "I read books at the library all day, but the librarian reported me.")
                  : "I spent the whole school day reading at the library."
              ),
            ],
            ["Leave", () => "I left the library before the librarian could ask questions."],
            [
              "Lie about your schedule",
              () =>
                chance(0.45)
                  ? "I lied to the librarian about my schedule, and she believed me."
                  : (skDet("skipping school"), "The librarian checked my story and reported me."),
            ],
          ],
        })),
        SK("cupcake", "Bakery Trip", [8, 18], "fun", null, (e) => ({
          desc: "You skipped class to buy pastries from a bakery. The employee recognizes your school uniform and starts asking questions.",
          choices: [
            [
              "Say it's a teacher workday",
              () =>
                chance(0.55)
                  ? (skFx({ Happiness: 3 }),
                    "I told the bakery employee it was a teacher workday. They believed me.")
                  : (skDet("skipping school"), "The bakery employee called my school."),
            ],
            [
              "Tell the truth",
              () =>
                chance(0.4)
                  ? (skDet("skipping school"), "The bakery employee reported me for skipping school.")
                  : "I told the bakery employee the truth. They laughed and gave me a free cookie.",
            ],
            [
              "Buy your pastries and leave",
              () => (
                skCash(-Math.min(state.money, localPrice(6))),
                skFx({ Happiness: 4 }),
                "I bought pastries and left the bakery."
              ),
            ],
            [
              "Ask them not to tell anyone",
              () =>
                chance(0.6)
                  ? "The bakery employee promised not to tell anyone."
                  : (skDet("skipping school"), "The bakery employee told my school anyway."),
            ],
          ],
        })),
        SK(
          "broken",
          "Betrayed by a Friend",
          [10, 18],
          "rare",
          () => !!skCtx().fr,
          (e) => {
            const t = e.fr,
              a = skPr(t),
              o = state.friends.includes(t);
            return {
              ...skWho(t),
              angry: !0,
              desc: `You skipped school with your close friend, ${t.first}, but ${a.he} returned early and told a teacher that you convinced ${a.him} to leave!`,
              choices: [
                ["Confront your friend", () => (skR(t, -10), `I confronted ${t.first} for ratting me out.`)],
                [
                  "Forgive them",
                  () => (
                    skR(t, chance(0.6) ? 4 : -2),
                    skFx({ Happiness: -2 }),
                    `I forgave ${t.first} for betraying me.`
                  ),
                ],
                [
                  "Explain the truth to the principal",
                  () => (
                    skR(e.prin, 3),
                    skDet("skipping school"),
                    `I told ${e.prin.title} the truth about skipping school with ${t.first}.`
                  ),
                ],
                [
                  "End the friendship",
                  () => (o ? frEnd(t) : (t.rel = 0), `I ended my friendship with ${t.first}.`),
                ],
              ],
            };
          },
        ),
        SK(
          "telephone",
          "The Principal Calls",
          [8, 18],
          "disc",
          (e) => (e.skips || 0) >= 3,
          (e) => ({
            ...skWho(e.prin),
            desc: `Your school principal, ${e.prin.title}, personally calls your home because you've been absent without permission several times this year.`,
            choices: [
              [
                "Apologize",
                () => {
                  skR(e.prin, 5);
                  const t = state.school;
                  return (
                    (t.trouble = Math.max(0, (t.trouble || 0) - 1)),
                    `I apologized to ${e.prin.title} for all my absences.`
                  );
                },
              ],
              [
                "Promise to attend regularly",
                () => (
                  (state.school.promise = state.age),
                  skR(e.prin, 3),
                  `I promised ${e.prin.title} I would attend school every day.`
                ),
              ],
              [
                "Argue",
                () => (
                  skR(e.prin, -10),
                  chance(0.5)
                    ? (skSuspend(), `I argued with ${e.prin.title} over the phone.`)
                    : (skDet("arguing with the principal"), `I argued with ${e.prin.title} over the phone.`)
                ),
              ],
              [
                "Refuse to speak",
                () => (
                  e.par && skR(e.par, -10),
                  skR(e.prin, -5),
                  `I refused to talk to ${e.prin.title}, so my ${e.mom} had to.`
                ),
              ],
            ],
          }),
        );
      const skFam = () => [
        ...aliveParents(),
        ...state.family.filter((e) => !e.dead && famOn(e) && relAge(e) >= 1),
      ];
      function badGradesSkip() {
        const e = state.school;
        if (state.dead || state.prison || !e || e.college || e.grades >= 20 || state.age < 6 || !chance(0.35))
          return !1;
        (e.skips = (e.skips || 0) + 1),
          (e.absent = (e.absent || 0) + 1),
          e.skipYear !== state.age && ((e.skipYear = state.age), (e.yearSkips = 0), (e.skipSeen = [])),
          e.yearSkips++;
        const t = skipEventPick();
        return (
          !!t &&
          (setTimeout(() => {
            overlayOpen() || state.school !== e || openEvent(t);
          }, 350),
          !0)
        );
      }
      function teacherDetention(e, t) {
        const a = state.school;
        if (!a || state.dead || !chance(0.2 + (e.strict ?? 50) / 250)) return;
        const o = "m" === e.g ? "him" : "her",
          n = rint(1, 3);
        if (
          ((a.trouble = (a.trouble || 0) + 1),
          (a.grades = clamp(a.grades - 2)),
          a.trouble >= 6 || (a.trouble >= 3 && !a.suspended))
        )
          return punish(0, !0);
        say(`${t} gave me detention for insulting ${o}.`),
          queuePopup(() =>
            eduCard({
              icon: "23f0",
              title: "Detention",
              lead: `${t} gave you detention for insulting ${o}!`,
              rows: [
                ["Reason", "Insulting a teacher"],
                ["Length", `${n} hour${n > 1 ? "s" : ""} after school`],
              ],
            }),
          ),
          parentArgument("detention");
      }
      function punish(e, t) {
        const a = state.school;
        if (a) {
          if (((a.trouble = (a.trouble || 0) + e), a.trouble >= 6))
            return (
              say(`I was expelled from ${a.name}.`),
              queuePopup(() =>
                eduCard({
                  icon: "1f97e",
                  title: "Expelled",
                  lead: `You have been expelled from ${a.name} for disciplinary issues! You'll have to start at a new school next year.`,
                  rows: [
                    ["Reason", "Disciplinary"],
                    ["Back At School", "Next year"],
                  ],
                }),
              ),
              parentArgument("expel"),
              (state.expelled = { from: a.name, type: a.type, grades: clamp(a.grades - 8) }),
              (state.school = null),
              void updateDockTab()
            );
          if (a.trouble >= 3 && !a.suspended)
            return (
              (a.suspended = !0),
              (a.grades = clamp(a.grades - 6)),
              say(`I was suspended from ${a.name}.`),
              queuePopup(() =>
                eduCard({
                  icon: "1f6ab",
                  title: "Suspended",
                  lead: `You have been suspended from ${a.name} for disciplinary issues!`,
                  rows: [
                    ["Reason", "Disciplinary"],
                    ["Length", `${rint(2, 5)} days`],
                  ],
                }),
              ),
              parentArgument("suspend")
            );
          say("I got detention."),
            (a.grades = clamp(a.grades - 2)),
            (t || chance(0.5)) && parentArgument("office");
        }
      }
      SK(
        "hospital",
        "Unexpected Hospital Visit",
        [10, 18],
        "rare",
        () => skFam().length > 0,
        (e) => {
          const t = any(skFam()),
            a = t.role
              ? `${"Mother" === t.role ? "mom" : "dad"}, ${t.first}`
              : `${relTitle(t).toLowerCase()}, ${t.first}`;
          return {
            ...skWho(t),
            desc: `You skipped school, only to learn that your ${a}, was taken to the hospital. You now have to decide whether to visit them.`,
            choices: [
              [
                "Visit the hospital",
                () => (skR(t, 12), skFx({ Happiness: -2 }), `I visited my ${a}, in the hospital.`),
              ],
              ["Call them", () => (skR(t, 5), `I called my ${a}, in the hospital.`)],
              [
                "Continue enjoying your day",
                () => (
                  skR(t, -12),
                  skFx({ Happiness: 2 }),
                  `I kept enjoying my day off instead of visiting my ${a}, in the hospital.`
                ),
              ],
              ["Go home", () => (skR(t, -3), "I went home instead of visiting the hospital.")],
            ],
          };
        },
      ),
        SK(
          "grad",
          "Graduation Warning",
          [14, 18],
          "disc",
          (e) => (e.absent || 0) >= 4,
          (e) => ({
            who: "School Counselor",
            av: "1f9d1",
            desc: "Your school counselor warns you that your repeated absences may prevent you from graduating on time.",
            choices: [
              [
                "Promise to attend school",
                () => (
                  (state.school.promise = state.age),
                  chance(0.6)
                    ? (skGradRisk(-2), "I promised my school counselor I would start attending school.")
                    : "I promised my counselor I'd attend, but she didn't look convinced."
                ),
              ],
              [
                "Ask for extra assignments",
                () => (
                  skG(rint(3, 6)),
                  skGradRisk(-1),
                  skFx({ Smarts: 1, Happiness: -2 }),
                  "I asked my school counselor for extra assignments to catch up."
                ),
              ],
              [
                "Ignore the warning",
                () => (skGradRisk(2), "I ignored my school counselor's warning about graduating."),
              ],
              [
                "Argue with the counselor",
                () => (
                  skGradRisk(1), skR(e.prin, -5), "I argued with my school counselor about my absences."
                ),
              ],
            ],
          }),
        ),
        SK(
          "family",
          "Parent-Teacher Meeting",
          [8, 18],
          "disc",
          (e) => HAS_PAR() && (e.skips || 0) >= 2,
          (e) => ({
            ...skWho(e.par),
            angry: !0,
            desc: `Your school has arranged a meeting with your parents because of your frequent unexplained absences. ${capFirst(e.parName)}, demands to know why you've been skipping.`,
            choices: [
              [
                "Admit everything",
                () => (skR(e.par, -4), skR(e.tch, 4), "I admitted everything at the parent-teacher meeting."),
              ],
              [
                "Blame your classmates",
                () => (
                  skR(e.cm, -8),
                  skR(e.par, -3),
                  chance(0.5)
                    ? `I blamed ${e.cm ? e.cm.first : "my classmates"} for my absences.`
                    : (skDet("skipping school"), "I blamed my classmates, but nobody believed me.")
                ),
              ],
              [
                "Promise to change",
                () => (
                  (state.school.promise = state.age),
                  skR(e.par, 3),
                  `I promised my ${e.mom} and ${e.tch.title} that I would change.`
                ),
              ],
              [
                "Refuse to explain",
                () => (
                  skR(e.par, -10),
                  skR(e.tch, -8),
                  skDet("refusing to explain my absences"),
                  "I refused to explain my absences at the parent-teacher meeting."
                ),
              ],
            ],
          }),
        ),
        SK("busstop", "Wrong Bus", [8, 18], "fun", null, (e) => ({
          desc: "You boarded the wrong bus on your way to school and ended up in an unfamiliar part of town. You're now considering whether to make your way back or skip the day.",
          choices: [
            [
              "Find a bus back to school",
              () => (skAttend(), skG(-1), "I took the wrong bus and arrived at school late."),
            ],
            [
              "Call your parent",
              () => (
                skAttend(),
                e.par && skR(e.par, chance(0.6) ? 3 : -3),
                e.par ? `My ${e.mom} picked me up and drove me to school.` : "I made it back to school."
              ),
            ],
            [
              "Explore the area",
              () => (
                skFx({ Happiness: 5 }),
                skG(-2),
                "I took the wrong bus and spent the day exploring a new part of town."
              ),
            ],
            [
              "Ask someone for directions",
              () =>
                chance(0.65)
                  ? (skAttend(), "A stranger gave me directions and I made it to school.")
                  : (skFx({ Happiness: -2 }),
                    "I asked for directions, but I got even more lost and missed school."),
            ],
          ],
        })),
        SK("cat", "Stray Cat", [8, 18], "fun", null, (e, t) => ({
          desc: "While skipping school, you notice a hungry stray cat sitting outside a convenience store. It follows you down the sidewalk.",
          choices: [
            ["Give it some food", () => (skFx({ Happiness: 4 }), "I bought food for a hungry stray cat.")],
            [
              "Try to adopt it",
              (t) => {
                const a = PETS.filter((e) => "Cat" === e.sp && !/x/.test(e.w));
                if (!a.length) return "I tried to take the stray cat home, but it ran off.";
                if (state.age < 15 && e.par && chance(0.5))
                  return skR(e.par, -2), `My ${e.mom} wouldn't let me keep the stray cat.`;
                const o = makePet(any(a), "shelter");
                return (
                  (o.price = 0),
                  (o.rel = rint(25, 45)),
                  state.pets.push(o),
                  skFx({ Happiness: 8 }),
                  t(() => petNameCard(o)),
                  `I adopted a stray cat and named ${pHim(o)} ${o.name}.`
                );
              },
            ],
            [
              "Pet it",
              () =>
                chance(0.75)
                  ? (skFx({ Happiness: 4 }), "I petted a friendly stray cat.")
                  : (skFx({ Health: -2 }), "I tried to pet a stray cat and it scratched me."),
            ],
            ["Ignore it", () => "I ignored a stray cat."],
          ],
        })),
        SK("joystick", "Arcade Tournament", [10, 18], "fun", null, (e) => {
          const t = localPrice(100);
          return {
            desc: `Your friends tell you about a video game tournament happening at the local arcade during school hours. The grand prize is ${usd(t)}!`,
            choices: [
              [
                "Enter the tournament",
                () => (
                  skG(-2),
                  chance(0.25)
                    ? (skCash(t), skFx({ Happiness: 8 }), `I won the arcade tournament and ${usd(t)}!`)
                    : (skFx({ Happiness: 2 }), "I entered the arcade tournament and lost.")
                ),
              ],
              [
                "Watch your friends",
                () => (
                  skFx({ Happiness: 4 }),
                  skG(-1),
                  "I skipped school to watch my friends at the arcade tournament."
                ),
              ],
              [
                "Return to school",
                () => (skAttend(), "I skipped the arcade tournament and went back to school."),
              ],
              [
                "Decline and go home",
                () => (skFx({ Happiness: 1 }), "I went home instead of going to the arcade tournament."),
              ],
            ],
          };
        }),
        SK("rain", "Rainstorm", [8, 18], "rare", null, (e) => ({
          desc: "You skipped school to spend the day outdoors, but a sudden rainstorm leaves you soaked and stranded far from home.",
          choices: [
            [
              "Run home",
              () =>
                chance(0.35)
                  ? (hasIll("Common Cold") ||
                      ills().push({ name: "Common Cold", drain: rint(0, 1), known: !0, heal: state.age + 1 }),
                    skFx({ Health: -3 }),
                    "I ran home through the rainstorm and caught a cold.")
                  : (skFx({ Health: -1 }), "I ran home through the rainstorm, soaking wet."),
            ],
            ["Find shelter", () => "I found shelter and waited out the rainstorm."],
            [
              "Call your parent",
              () =>
                e.par
                  ? (skR(e.par, -5),
                    `My ${e.mom} picked me up in the rainstorm and found out I skipped school.`)
                  : "I called for a ride home.",
            ],
            [
              "Continue walking",
              () => (
                skFx({ Health: -rint(3, 6), Happiness: -3 }),
                "I kept walking through the rainstorm and got completely drenched."
              ),
            ],
          ],
        })),
        SK("moneyfly", "Suspicious Offer", [14, 18], "rare", null, (e) => {
          const t = localPrice(50);
          return {
            who: "Stranger",
            av: "1f9d4",
            desc: `While wandering around town instead of attending school, a stranger offers to pay you ${usd(t)} to deliver an unopened package to another person.`,
            choices: [
              ["Refuse", () => "I refused to deliver a suspicious package for a stranger."],
              [
                "Ask what's inside",
                () =>
                  chance(0.6)
                    ? "I asked the stranger what was in the package. He walked away."
                    : 'I asked what was in the package. The stranger just said "don\'t worry about it" and left.',
              ],
              [
                "Report the suspicious offer",
                () => (skFx({ Happiness: 2 }), "I reported the suspicious stranger to the police."),
              ],
              [
                "Accept",
                () => (
                  skCash(t),
                  chance(0.35)
                    ? ((state.record = (state.record || 0) + 1),
                      skFx({ Happiness: -8 }),
                      skSuspend(),
                      `I delivered a package for ${usd(t)}. It was full of drugs, and the police questioned me.`)
                    : `I delivered a mysterious package for ${usd(t)}.`
                ),
              ],
            ],
          };
        }),
        SK(
          "trophy",
          "Perfect Attendance Ruined",
          [8, 18],
          "rare",
          (e) => 1 === (e.yearSkips || 0) && !(e.lastYearSkips > 0),
          (e) => ({
            ...skWho(e.tch),
            desc: `You skipped school for the first time this year, completely ruining your perfect attendance record. Your teacher, ${e.tch.title}, expresses disappointment in you.`,
            choices: [
              [
                "Apologize",
                () => (skR(e.tch, 4), `I apologized to ${e.tch.title} for ruining my perfect attendance.`),
              ],
              [
                "Ask for another chance",
                () =>
                  chance(0.5)
                    ? (skAttend(), skR(e.tch, 2), `${e.tch.title} excused my absence.`)
                    : `${e.tch.title} said rules are rules.`,
              ],
              [
                "Say you don't care",
                () => (skR(e.tch, -8), `I told ${e.tch.title} I didn't care about perfect attendance.`),
              ],
              [
                "Promise to improve",
                () => (
                  (state.school.promise = state.age),
                  skR(e.tch, 3),
                  `I promised ${e.tch.title} I wouldn't skip again.`
                ),
              ],
            ],
          }),
        ),
        ageBtnEl.addEventListener("click", () => {
          const e = state.school;
          e &&
            !e.college &&
            (e.skipYear !== state.age &&
              (e.lastYearSkips = (e.skipYear === state.age - 1 && e.yearSkips) || 0),
            e.promise !== state.age - 1 ||
              (e.skipYear === state.age - 1 && e.yearSkips > 1) ||
              ((e.trouble = Math.max(0, (e.trouble || 0) - 1)),
              (e.absent = Math.max(0, (e.absent || 0) - 2))));
        });
      const schoolWho = (e, t) =>
        "tch" === t
          ? e.faculty[0]
          : "prin" === t
            ? e.faculty.find((e) => "Principal" === e.role)
            : "fac" === t
              ? any(e.faculty.filter((e) => "Teacher" !== e.role && "Principal" !== e.role))
              : "bully" === t
                ? [...e.classmates].sort((e, t) => e.rel - t.rel)[rint(0, 2)]
                : any(e.classmates);
      for (const ee of window.SCHOOL_EVENTS || [])
        EVENTS.push({
          min: ee.a[0],
          max: ee.a[1],
          kind: "School",
          school: !0,
          src: "school",
          t: ee.t,
          ok: () => !!state.school,
          make() {
            const e = state.school,
              t = schoolWho(e, ee.who),
              a = !!t.role,
              o = a ? t.title : t.first,
              n = a ? t.title : `${t.first} ${t.last}`,
              s = "f" === t.g ? "she" : "he",
              r = (r) =>
                r
                  .replace(/\{name\}/g, o)
                  .replace(/\{full\}/g, n)
                  .replace(/\{role\}/g, a ? t.role.toLowerCase() : "classmate")
                  .replace(/\{school\}/g, e.name)
                  .replace(/\{him\}/g, "he" === s ? "him" : "her")
                  .replace(/\{his\}/g, "he" === s ? "his" : "her")
                  .replace(/\{He\}/g, "he" === s ? "He" : "She")
                  .replace(/\{he\}/g, s);
            this.kind = "bully" === ee.who ? "Bully" : a ? t.role : "Classmate";
            const i = (o, n) => {
              (o = o || {}).r && (t.rel = clamp(t.rel + o.r)),
                o.g && (e.grades = clamp(e.grades + o.g)),
                o.p && (e.popularity = clamp(e.popularity + o.p));
              const s = runFx(o, r(n));
              return (
                o.t && "prin" === ee.who
                  ? setTimeout(() => punish(o.t), 0)
                  : o.t &&
                    setTimeout(
                      () =>
                        schoolTrouble(
                          o.t,
                          /office|called me in|called my parents|detention|caught/i.test(s),
                          a
                            ? "disrespecting a teacher"
                            : "cm" === ee.who || "bully" === ee.who
                              ? "messing with another student"
                              : "misbehaving",
                        ),
                      0,
                    ),
                s
              );
            };
            return {
              who: n,
              av: "1f466",
              icon: ee.i,
              title: r(ee.t),
              desc: r(ee.d) + "<br><br>What will you do?",
              angry: "bully" === ee.who,
              person: { look: t.look, g: t.g, age: personAge(t) },
              bars: [["Relationship", t.rel]],
              choices: ee.c.map(([e, t, a, o, n, s]) => [
                r(e),
                () => afford(t.m < 0 ? t : n, () => (null == o || chance(o) ? i(t, a) : i(n, s))),
              ]),
            };
          },
        });
      const BULLY_TAUNTS = [
          "tells you every day that your face is just so punchable",
          "keeps telling everyone that you smell like old cheese",
          "trips you in the hallway every single morning",
          "keeps stealing your lunch and eating it in front of you",
          "calls you a loser every time you walk past",
          "keeps flicking your ears during class",
          "tells everyone that you still wet the bed",
          "shoved you into a locker in front of the whole class",
        ],
        DEFEND_HITS = [
          "bashed {his} nostril",
          "gave {him} a black eye",
          "punched {him} in the gut",
          "kicked {him} in the shin",
          "slammed {him} into a locker",
          "threw {him} into a trash can",
          "gave {him} a bloody lip",
          "body slammed {him} on the blacktop",
        ],
        defenders = () =>
          state.family.filter(
            (e) =>
              ("sibling" === e.kind || "cousin" === e.kind) &&
              !e.dead &&
              relAge(e) >= 8 &&
              ("function" != typeof famOn || famOn(e)),
          );
      function bullyMake() {
        const e = state.school,
          t = schoolWho(e, "bully"),
          a = "f" === t.g ? "She" : "He",
          o = "f" === t.g ? "her" : "him",
          n = "f" === t.g ? "her" : "his";
        this.kind = "Classmate";
        const s = any(defenders()),
          r = [];
        if (s) {
          const e = relLabel(s),
            a = "f" === s.g ? "She" : "He";
          r.push([
            `Tell my ${e}`,
            () => {
              if (chance(0.8 + (s.rel ?? 50) / 500 - 0.1)) {
                (t.rel = clamp(t.rel - 15)), (s.rel = clamp((s.rel ?? 50) + 4));
                const r = any(DEFEND_HITS)
                  .replace(/\{him\}/g, o)
                  .replace(/\{his\}/g, n);
                return (
                  fx({ Happiness: 5 }, ""),
                  {
                    msg: `I told my ${e}, ${s.first}, about my bully, ${t.first}. ${a} attacked ${o} and ${r}.`,
                    title: `${a}'s got my back`,
                    text: `Your ${e} attacked ${t.first}!<br><br>${a} ${r}.`,
                  }
                );
              }
              return (
                (s.rel = clamp((s.rel ?? 50) - 3)),
                {
                  msg: `I told my ${e}, ${s.first}, about my bully, ${t.first}, but ${a.toLowerCase()} didn't want to get involved.`,
                  title: "On your own",
                  text: `Your ${e}, ${s.first}, told you to handle ${t.first} yourself.`,
                }
              );
            },
          ]);
        }
        return (
          r.push(
            [
              `Report ${o} to the principal`,
              () => (
                (t.rel = clamp(t.rel - 10)),
                chance(0.5)
                  ? fx(
                      { Happiness: 3 },
                      `I reported my bully, ${t.first}, to the principal. ${a} got detention.`,
                    )
                  : fx(
                      { Happiness: -1 },
                      `I reported my bully, ${t.first}, to the principal, but nothing happened.`,
                    )
              ),
            ],
            ["Do nothing about it", () => fx({ Happiness: -4 }, `I did nothing about my bully, ${t.first}.`)],
            [
              `Attack ${o}`,
              () => (
                (t.rel = clamp(t.rel - 15)),
                setTimeout(
                  () => assaultAfter(t.first, 0.2, () => schoolTrouble(1, !1, "fighting another student")),
                  0,
                ),
                chance(0.5)
                  ? fx({ Happiness: 6 }, `I attacked my bully, ${t.first}, and won the fight!`)
                  : (hurt(),
                    (pendingHit = {
                      text: `You attacked your bully, ${t.first}, but ${a.toLowerCase()} ${any(["punched you right in the nose", "shoved you to the ground", "slammed you into a locker", "kicked you in the shin"])}!`,
                      dmg: rint(35, 75),
                    }),
                    fx(
                      { Health: -8, Happiness: -4 },
                      `I attacked my bully, ${t.first}, but ${a.toLowerCase()} beat me up.`,
                    ))
              ),
            ],
          ),
          {
            who: `${t.first} ${t.last}`,
            av: "1f466",
            iconSrc: "found/hand-fist.png",
            title: "Bully",
            angry: !0,
            desc: `Your classmate, ${t.first}, ${any(BULLY_TAUNTS)}.<br><br>What will you do?`,
            person: { look: t.look, g: t.g, age: personAge(t) },
            choices: r,
          }
        );
      }
      function examMake() {
        const e = state.school,
          t = schoolWho(e, "cm"),
          a = "f" === t.g ? "she" : "he",
          o = "f" === t.g ? "her" : "him",
          n = e.faculty.find((e) => "Teacher" === e.role) || e.faculty[0],
          s = any(["math", "science", "history", "English", "chemistry", "biology"]),
          r = "f" === t.g ? "Her" : "His";
        this.kind = "Classmate";
        const i = (e, o, n, s) => {
          const i = chance(n);
          return {
            msg: `I ${o} my classmate, ${t.first}, ${"Study buddies" === e ? "study for" : "cheat on"} an exam. ${"she" === a ? "She" : "He"} ${i ? "passed" : "still failed"}.`,
            title: e,
            text: `You ${o} your classmate, ${t.first}, ${"Study buddies" === e ? "study for" : "cheat on"} a test.<br><br>${"she" === a ? "She" : "He"} ${i ? "passed the exam!" : "still failed the exam."}`,
            bar: [`${r} Appreciation`, i ? rint(70, 100) : rint(20, 55)],
          };
        };
        return {
          who: `${t.first} ${t.last}`,
          av: "1f466",
          icon: "1f441-fe0f",
          title: "Exam Ethics",
          desc: `Your classmate, ${t.first}, tells you that ${a} is going to fail your ${s} teacher, ${n ? n.title + "'s" : "teacher's"}, class unless you let ${o} cheat off of you on the upcoming exam.<br><br>What will you do?`,
          person: { look: t.look, g: t.g, age: personAge(t) },
          choices: [
            [
              `Refuse to help ${o}`,
              () => ((t.rel = clamp(t.rel - 8)), `I refused to let my classmate, ${t.first}, cheat off me.`),
            ],
            [
              `Report ${o} to the principal`,
              () => (
                (t.rel = clamp(t.rel - 20)),
                fx(
                  { Smarts: 1 },
                  `I reported my classmate, ${t.first}, to the principal for wanting to cheat.`,
                )
              ),
            ],
            [
              `Help ${o} study instead`,
              () => (
                (t.rel = clamp(t.rel + 8)),
                fx({ Smarts: 1 }, ""),
                i("Study buddies", "helped", 0.3 + state.stats.Smarts / 200)
              ),
            ],
            [
              `Let ${o} cheat off me`,
              () => (
                (t.rel = clamp(t.rel + 6)),
                chance(0.4)
                  ? (setTimeout(() => schoolTrouble(1, !0, "helping a classmate cheat on an exam", !0), 0),
                    fx(
                      { Happiness: -3 },
                      `I let my classmate, ${t.first}, cheat off me on an exam, but we got caught and I was sent to the principal's office.`,
                    ))
                  : i("You owe me one", "helped", 0.35 + state.stats.Smarts / 250)
              ),
            ],
          ],
        };
      }
      for (let te = 0; te < 2; te++)
        EVENTS.push(
          { min: 6, max: 17, kind: "Classmate", school: !0, ok: () => !!state.school, make: bullyMake },
          { min: 10, max: 17, kind: "Classmate", school: !0, ok: () => !!state.school, make: examMake },
        );
      function assaultAfter(e, t, a) {
        if (state.prison || state.dead || !chance(t)) return a && a();
        say(`${e}'s parents called the cops on me.`),
          queuePopup(() =>
            notice("What a snitch", `${e}'s parents called the cops on you!`, () => arrest("assault"), !0),
          );
      }
      const KID_HITS = [
          "poked",
          "punched",
          "kicked",
          "slapped",
          "headbutted",
          "elbowed",
          "pinched",
          "karate chopped",
          "shoved",
          "bonked",
        ],
        ANTICS = [
          "writing profanity all over your teacher, {t}'s, dry erase board",
          "putting a whoopee cushion on your teacher, {t}'s, chair",
          "hiding a frog in your teacher, {t}'s, desk drawer",
          "shooting spitballs at the back of your teacher, {t}'s, head",
          "putting thumbtacks on your teacher, {t}'s, chair",
          "setting the classroom clock forward an hour",
          "filling your teacher, {t}'s, coffee mug with salt",
          "balancing a bucket of water on top of the classroom door",
          "hacking the classroom smartboard to play memes",
          "eating glue in front of the whole class",
          "flicking boogers at the kids in the front row",
          "throwing all of the dry erase markers in the trash",
          "stealing the answer key from your teacher, {t}'s, desk",
          "hiding a stink bomb under your teacher, {t}'s, desk",
          "making fart noises every time your teacher, {t}, turns around",
          "replacing the class goldfish with a baby carrot",
          'taping a "kick me" sign to your teacher, {t}\'s, back',
          "drawing rude pictures in all of the library books",
          "locking the substitute teacher out of the classroom",
          "switching the salt and sugar in the cafeteria",
          "unscrewing the legs on your teacher, {t}'s, chair",
          "blasting music from a phone hidden in the ceiling tiles",
        ],
        ANTIC_WHEN = [
          "Before class",
          "During recess",
          "While nobody is looking",
          "Right before the bell rings",
          "During lunch",
        ];
      function anticsMake() {
        const e = state.school,
          t = schoolWho(e, "cm"),
          a = e.faculty.find((e) => /Teacher|Professor/.test(e.role)) || e.faculty[0],
          o = "f" === t.g ? "She" : "He",
          n = "f" === t.g ? "her" : "him",
          s = "f" === t.g ? "her" : "his",
          r = (t.g, e.faculty.find((e) => "Principal" === e.role)),
          i = r ? r.title : "the principal",
          l = r && "f" === r.g ? "she" : "he",
          c = any(ANTICS).replace(/\{t\}/g, a.title);
        return (
          (this.kind = "Classmate"),
          {
            who: `${t.first} ${t.last}`,
            av: "1f466",
            iconSrc: "xc/clown.png",
            title: "Troublemaker",
            angry: !0,
            desc: `${any(ANTIC_WHEN)}, your classmate, ${t.first}, is ${c}.<br><br>What will you do?`,
            person: { look: t.look, g: t.g, age: personAge(t) },
            choices: [
              [
                `Laugh at ${n}`,
                () => (
                  (t.rel = clamp(t.rel + rint(3, 8))),
                  (e.popularity = clamp(e.popularity + rint(0, 3))),
                  chance(0.2)
                    ? (setTimeout(() => schoolTrouble(1, !0, `laughing along with ${t.first}`), 0),
                      fx(
                        { Happiness: 2 },
                        `I laughed at my classmate, ${t.first}'s, antics. My teacher caught me and sent me to the office.`,
                      ))
                    : fx({ Happiness: 3 }, `I laughed at my classmate, ${t.first}'s, antics.`)
                ),
              ],
              [`Ignore ${s} antics`, () => `I ignored my classmate, ${t.first}'s, antics.`],
              [
                `Report ${n} to the principal`,
                () => {
                  if (
                    ((t.rel = clamp(t.rel - rint(10, 20))),
                    (e.popularity = clamp(e.popularity - rint(2, 6))),
                    chance(0.5))
                  ) {
                    const e = rint(1, 5);
                    return {
                      msg: `I reported my classmate, ${t.first}, to the principal. ${o} got suspended.`,
                      title: "Snitch",
                      text: `You visited the principal's office and reported your classmate, ${t.first}, for acting up in class.<br><br>The principal, ${i}, suspended ${n} for ${NUM_WORDS[e].toLowerCase()} day${e > 1 ? "s" : ""}.`,
                    };
                  }
                  return {
                    msg: `I reported my classmate, ${t.first}, to the principal for acting up in class.`,
                    title: "Snitch",
                    text: `You visited the principal's office and reported your classmate, ${t.first}, for acting up in class.<br><br>The principal, ${i}, said ${l} would look into it.`,
                  };
                },
              ],
              [
                `Attack ${n}`,
                () => {
                  t.rel = clamp(t.rel - rint(20, 35));
                  const e = rint(15, 95),
                    a = any(KID_HITS),
                    o = any(ATTACK_TARGETS);
                  return (
                    say(`I attacked my classmate, ${t.first}.`),
                    setTimeout(
                      () =>
                        notice(
                          any(["Try me again", "Take that", "Not today"]),
                          `You ${a} your classmate, ${t.first}'s, ${o}!`,
                          () =>
                            assaultAfter(t.first, 0.3, () =>
                              schoolTrouble(1, !0, "attacking another student"),
                            ),
                          !0,
                          `<div class="ev-bars nb"><b>Damage</b><i><u style="width:${e}%;background:#b3261e"></u></i></div>`,
                        ),
                      0,
                    ),
                    `I ${a} my classmate, ${t.first}'s, ${o}.`
                  );
                },
              ],
            ],
          }
        );
      }
      const CLUBS = [
          ["art", "Art Club", "art", "club"],
          ["astronomy", "Astronomy Club", "telescope", "club"],
          ["badminton", "Badminton Team", "badminton", "team"],
          ["baseball", "Baseball Team", "baseball", "team"],
          ["basketball", "Basketball Team", "basketball", "team"],
          ["cheer", "Cheerleading Team", "megaphone", "team"],
          ["cs", "Computer Science Club", "computer", "club"],
          ["xc", "Cross Country Team", "crosscountry", "team"],
          ["cycling", "Cycling Club", "cycling", "club"],
          ["dance", "Dance Club", "dance", "tryclub"],
          ["drama", "Drama Club", "drama", "tryclub"],
          ["football", "Football Team", "football", "team"],
          ["language", "Foreign Language Club", "language", "club"],
          ["habitat", "Habitat For Humanity", "habitat", "group"],
          ["homeec", "Home Economics Club", "homeec", "club"],
          ["hockey", "Ice Hockey Team", "hockey", "team"],
          ["outdoors", "Outdoors Club", "outdoors", "club"],
          ["rowing", "Rowing Team", "rowing", "team"],
          ["skate", "Skateboarding Club", "skateboard", "club"],
          ["soccer", "Soccer Team", "soccer", "team"],
          ["swim", "Swim Team", "swim", "team"],
          ["tennis", "Tennis Team", "tennis", "team"],
          ["track", "Track Team", "track", "team"],
          ["tutoring", "Tutoring Club", "tutoring", "club"],
          ["volleyball", "Volleyball Team", "volleyball", "team"],
          ["weights", "Weightlifting Club", "weights", "club"],
        ],
        clubBy = (e) => CLUBS.find((t) => t[0] === e),
        athleticism = () => ("sports" === state.talent ? 100 : (state.athl ??= rint(15, 90))),
        teamOdds = (e, t) => (e >= 100 ? 1 : Math.min(0.98, 0.05 + 0.0085 * e + 0.001 * t)),
        clubSub = (e) =>
          "team" === e[3]
            ? `Try out for the ${e[1].replace(/ Team$/, "").toLowerCase()} team`
            : "tryclub" === e[3]
              ? `Try out for the ${e[1]}`
              : "group" === e[3]
                ? `Join ${e[1]}`
                : `Join the ${e[1]}`,
        schoolClubs = (e) => (
          (e.clubs ||= CLUBS.filter((e) => "habitat" === e[0] || chance(0.8)).map((e) => e[0])),
          e.clubs.includes("basketball") || e.clubs.push("basketball"),
          e.clubs
        ),
        isHS = () => state.school && !state.school.college && "High School" === state.school.level;
      function joinClub(e, t) {
        const a = state.school,
          o = clubBy(e);
        (a.club = { id: e, years: 0, hours: "team" === o[3] ? rint(6, 12) : rint(2, 5) }),
          say(
            `I joined ${"team" === o[3] ? "the " : "group" === o[3] ? "" : "the "}${o[1]}${t ? " " + t : ""}.`,
          ),
          screen.classList.remove("open"),
          notice(
            "Everyone needs a hobby",
            `You have joined ${"group" === o[3] ? "" : "the "}${o[1]} at your ${a.college ? ("uni" === a.prog ? "university" : "school") : "high school"}!`,
            null,
            !0,
          );
      }
      function openClubs() {
        const e = state.school;
        if (!(isHS() || (e && e.college) || (e && "Middle School" === e.level))) return openSchool();
        (sTitle.textContent = "ACTIVITIES"), (sBack.innerHTML = BACK_ICON), (sBack.onclick = openSchool);
        const t = schoolClubs(e)
          .map(clubBy)
          .sort((e, t) => e[1].localeCompare(t[1]));
        (sList.innerHTML = t
          .map(
            (e) =>
              `<div class="row" data-club="${e[0]}"><img src="xc/${e[2]}.png"><div class="t"><b>${e[1]}</b><span>${clubSub(e)}</span></div>${DOTS}</div>`,
          )
          .join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-club]").forEach((e) => (e.onclick = () => clubCard(e.dataset.club)));
      }
      function clubCard(e) {
        const t = state.school,
          a = clubBy(e),
          o = "team" === a[3] || "tryclub" === a[3];
        if (t.club)
          return notice(
            "Activities",
            `You're already in ${clubBy(t.club.id)[1]}. Quit it first to join something else.`,
            null,
            !0,
          );
        if (t.clubBan === state.age)
          return notice(
            "Activities",
            "You were kicked out of an activity this year. Bring your grades up first!",
            null,
            !0,
          );
        const n = "team" === a[3],
          s = athleticism(),
          r = state.stats.Health;
        jCard({
          tag: "Education",
          iconSrc: `xc/${a[2]}.png`,
          title: a[1],
          close: !0,
          lead: `${clubSub(a)} today!`,
          bars: n
            ? [
                ["Your Athleticism", s],
                ["Your Health", r],
              ]
            : [],
          choices: [
            [
              n ? "Try out for the team" : o ? "Try out" : "Join",
              () => {
                if (
                  !o ||
                  chance(
                    n
                      ? teamOdds(s, r)
                      : Math.min(0.92, 0.2 + (state.stats.Looks + state.stats.Happiness) / 2 / 130),
                  )
                )
                  return joinClub(e);
                say(`I tried out for the ${a[1]}, but I didn't make it.`),
                  screen.classList.remove("open"),
                  notice(
                    "Cut",
                    `You didn't make the ${a[1].replace(/ (Team|Club)$/, "").toLowerCase()} ${"team" === a[3] ? "team" : "club"}. Better luck next year!`,
                    null,
                    !0,
                  );
              },
            ],
          ],
        });
      }
      function myClubCard() {
        const e = state.school,
          t = e.club,
          a = clubBy(t.id);
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="clX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="ev-tag" style="margin-top:12px"><canvas class="ev-av" width="250" height="250"></canvas><span class="who">${document.getElementById("pname").textContent}</span><span class="kind">You</span></div>\n      <h4><img src="xc/${a[2]}.png"><span>${a[1]}</span></h4>\n      <table class="jc jc-left"><tbody><tr><td><b>Activity:</b> ${a[1]}</td></tr><tr><td><b>Status:</b> ${t.years >= 2 && "team" === a[3] ? "Starter" : "Member"}</td></tr>\n        <tr><td><b>Years in Activity:</b> ${t.years}</td></tr><tr><td><b>Weekly Hours:</b> ${t.hours}</td></tr></tbody></table>\n      <button class="jm-apply ev-btn" id="clQuit">Quit the group</button></div>`),
          ev
            .querySelector("canvas.ev-av")
            .getContext("2d")
            .drawImage(document.querySelector(".phone > .profile canvas.avatar"), 0, 0),
          (ev.style.overflow = "visible");
        const o = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("clX").onclick = () => {
          play("dismiss"), o();
        }),
          (document.getElementById("clQuit").onclick = () => {
            o(),
              iosConfirm(
                "Confirm",
                `Are you sure you want to quit ${"group" === a[3] ? "" : "the "}${a[1]}?`,
                () => {
                  const t = "group" === a[3] ? "" : "the ";
                  (e.club = null),
                    say(`I quit ${t}${a[1]}.`),
                    screen.classList.remove("open"),
                    notice("Quitter", `You quit ${t}${a[1]}.`, null, !0);
                },
              );
          }),
          evWrap.classList.add("open");
      }
      function encourageMake() {
        const e = state.school,
          t = clubBy(any(schoolClubs(e))),
          a = 14 === state.age;
        return {
          plain: !0,
          iconSrc: `xc/${t[2]}.png`,
          title: t[1],
          desc: `Some friends that you ${a ? "are starting high school" : "go to school"} with are encouraging you to ${"team" === t[3] ? "try out for" : "join"} ${"group" === t[3] ? "" : "the "}${t[1]} with them.<br><br>What will you do?`,
          choices: [
            [
              ("team" === t[3] ? "Try out" : "Join the group") + " with them",
              () =>
                "team" !== t[3] || chance(teamOdds(athleticism(), state.stats.Health))
                  ? ((e.club = { id: t[0], years: 0, hours: "team" === t[3] ? rint(6, 12) : rint(2, 5) }),
                    {
                      msg: `I joined ${"group" === t[3] ? "" : "the "}${t[1]} with my friends.`,
                      title: "Everyone needs a hobby",
                      text: `You have joined ${"group" === t[3] ? "" : "the "}${t[1]} at your high school!`,
                    })
                  : {
                      msg: `I tried out for the ${t[1]} with my friends, but I didn't make it.`,
                      title: "Cut",
                      text: `You tried out for the ${t[1]} with your friends, but you didn't make it.`,
                    },
            ],
            [
              "I'm not interested in that",
              () =>
                `I told my friends I wasn't interested in joining ${"group" === t[3] ? "" : "the "}${t[1]}.`,
            ],
          ],
        };
      }
      ageBtnEl.addEventListener("click", () => {
        const e = state.school;
        if (!e || !e.club || state.dead) return;
        if (!e.college && !/High School|Middle School/.test(e.level)) return void (e.club = null);
        const t = clubBy(e.club.id);
        if (e.grades < 30 && chance(0.6))
          return (
            (e.club = null),
            (e.clubBan = state.age),
            say(`I was kicked out of ${"group" === t[3] ? "" : "the "}${t[1]} because of my bad grades.`),
            setTimeout(
              () =>
                queuePopup(() =>
                  notice(
                    "Kicked out",
                    `You were kicked out of ${"group" === t[3] ? "" : "the "}${t[1]} because your grades are too low!`,
                  ),
                ),
              400,
            )
          );
        e.club.years++,
          (e.popularity = clamp(e.popularity + rint(1, 4))),
          "team" === t[3]
            ? (state.stats.Health = clamp(state.stats.Health + rint(1, 4)))
            : (state.stats.Smarts = clamp(state.stats.Smarts + rint(1, 3)));
      });
      const FIELD_TRIPS = [
        [
          "a local art collective that's become famous for its provocative works of art",
          "some people think urinals can be priceless art",
        ],
        ["the natural history museum", "a Tyrannosaurus rex had arms too short to scratch its own nose"],
        ["a dairy farm", "a cow can produce over six gallons of milk a day"],
        ["the city aquarium", "an octopus has three hearts"],
        ["a chocolate factory", "it takes about 400 cocoa beans to make a pound of chocolate"],
        ["the planetarium", "a day on Venus is longer than its year"],
        ["the state capitol building", "laws take a really, really long time to pass"],
        ["a recycling plant", "aluminum cans can be recycled forever"],
        ["the science center", "lightning is five times hotter than the surface of the sun"],
        ["a historic battlefield", "more soldiers died from disease than from battle"],
        ["the local zoo", "flamingos are pink because of what they eat"],
        ["a water treatment plant", "you have probably drunk water a dinosaur once drank"],
      ];
      function fieldTripMake() {
        const e = state.school,
          t = e.faculty.find((e) => "Teacher" === e.role) || e.faculty[0],
          [a, o] = any(FIELD_TRIPS);
        t.g;
        return (
          (this.kind = "School"),
          {
            who: t.title,
            av: "1f469",
            iconSrc: "xc/bus.png",
            title: "Field Trip",
            person: { look: t.look, g: t.g, age: personAge(t) },
            desc: `Your teacher, ${t.title}, is taking the class on a field trip to ${a}.<br><br>What will you do?`,
            choices: [
              [
                "Goof off",
                () => (
                  (e.grades = clamp(e.grades - rint(1, 4))),
                  (t.rel = clamp(t.rel - rint(2, 6))),
                  chance(0.25)
                    ? (setTimeout(() => schoolTrouble(1, !0, "goofing off on a field trip"), 0),
                      fx(
                        { Happiness: 3 },
                        `I goofed off during my class field trip to ${a}, and my teacher sent me to the principal.`,
                      ))
                    : {
                        msg: `I goofed off during my class field trip to ${a}.`,
                        title: "Class clown",
                        text: `You goofed off during your class field trip to ${a}.`,
                      }
                ),
              ],
              [
                "Stay home",
                () => (
                  (e.grades = clamp(e.grades - rint(0, 2))),
                  fx({ Happiness: 2 }, ""),
                  {
                    msg: `I stayed home instead of going on my class field trip to ${a}.`,
                    title: "Day off",
                    text: `You stayed home instead of going on your class field trip to ${a}.`,
                  }
                ),
              ],
              [
                "Pay attention",
                () => (
                  (e.grades = clamp(e.grades + rint(3, 8))),
                  (t.rel = clamp(t.rel + rint(2, 5))),
                  (state.stats.Smarts = clamp(state.stats.Smarts + rint(1, 2))),
                  renderStats(),
                  {
                    msg: `I paid attention during my class field trip to ${a}. I learned that ${o}.`,
                    title: "Learned something new",
                    text: `You paid attention during your class field trip to ${a}.<br><br>You learned that ${o}.`,
                    bar: ["Grades", e.grades],
                  }
                ),
              ],
              [
                "Socialize",
                () => (
                  (e.popularity = clamp(e.popularity + rint(3, 8))),
                  fx({ Happiness: 3 }, ""),
                  {
                    msg: `I socialized with my classmates during our field trip to ${a}.`,
                    title: "Social butterfly",
                    text: `You spent your class field trip to ${a} socializing with your classmates.`,
                    bar: ["Popularity", e.popularity],
                  }
                ),
              ],
            ],
          }
        );
      }
      function educationPopup(e, t) {
        const a = () => {
          state.dead ||
            state.school !== e ||
            (overlayOpen()
              ? setTimeout(a, 500)
              : jCard({
                  tag: "Education",
                  iconSrc: `school/${t.logo || t.ico}.png`,
                  title: t.name,
                  lead: `You are starting ${t.name.toLowerCase()}.`,
                  rows: [
                    ["School", e.name],
                    ["Type", e.type],
                    ["Level", t.name],
                    ["Years", t.max - t.min + 1],
                  ],
                  ok: () => {},
                }));
        };
        setTimeout(a, 380);
      }
      EVENTS.push(
        { min: 6, max: 17, kind: "Classmate", school: !0, make: anticsMake },
        { min: 6, max: 17, kind: "Classmate", school: !0, make: anticsMake },
        { min: 6, max: 17, kind: "School", school: !0, make: fieldTripMake },
        {
          min: 14,
          max: 17,
          kind: "Education",
          school: !0,
          ok: () => isHS() && !state.school.club,
          make: encourageMake,
        },
      ),
        ageBtnEl.addEventListener("click", () => {
          if (state.dead || state.prison) return;
          const e = levelFor(state.age),
            t = state.school;
          if (t && t.college) return collegeYear(t), updateDockTab();
          if (t && e && t.level === e.name) {
            const e = academics();
            t.studied && e.studyYears++, t.club && e.clubYears++;
            const a = state.job ? ((state.job.hours ?? 20) > 20 ? rint(4, 8) : rint(1, 4)) : 0,
              o = t.club ? rint(0, 2) : 0,
              n = a + o + (a && o ? rint(1, 3) : 0);
            n >= 5 &&
              !t.stressNote &&
              ((t.stressNote = !0),
              say(
                `Juggling ${state.job ? "my job" : ""}${state.job && t.club ? " and " : ""}${t.club ? "extracurriculars" : ""} with school stressed me out, and my grades slipped.`,
              )),
              (t.studied = 0),
              (t.grades = clamp(
                Math.round(t.grades + 0.2 * (state.stats.Smarts - t.grades) + rint(-6, 6) - n),
              )),
              (t.popularity = clamp(Math.round(t.popularity + (state.stats.Looks - 50) / 12 + rint(-6, 6)))),
              t.classmates.forEach((e) => (e.rel = clamp(e.rel + rint(-4, 4))));
          } else if (!e || state.droppedOut || (state.poor && state.poor.noSchool))
            !e && state.expelled
              ? (state.expelled = null)
              : t && !e && "High School" === t.level && (t.absent || 0) >= 8 && t.grades < 45 && !t.heldBack
                ? ((t.heldBack = !0),
                  (t.absent = 0),
                  say(`I didn't graduate from ${t.name} on time because I skipped too much school.`),
                  queuePopup(() =>
                    eduCard({
                      icon: "1f393",
                      title: "Held Back",
                      lead: `You missed too much school to graduate from ${t.name} on time. You'll have to finish another year.`,
                      rows: [
                        ["Reason", "Too many absences"],
                        ["Graduation", "Next year"],
                      ],
                    }),
                  ))
                : t &&
                  !e &&
                  (say(`I graduated from ${t.level.toLowerCase()} at ${t.name}!`),
                  (state.graduated = !0),
                  (state.school = null),
                  recordSchool(t),
                  "High School" === t.level && ((state.hsGrades = t.grades), meritScholarship(t)),
                  "High School" === t.level && setTimeout(() => whenClear(graduationCard), 380));
          else {
            const a = state.expelled;
            (state.expelled = null),
              t && (say(`I graduated from ${t.level.toLowerCase()}.`), recordSchool(t)),
              (state.school = newSchool(t ? t.type : a ? a.type : null)),
              t ? (state.school.grades = t.grades) : a && (state.school.grades = a.grades),
              say(
                a
                  ? `After being expelled from ${a.from}, I got a fresh start at ${state.school.name}.`
                  : `I started ${e.name.toLowerCase()} at ${state.school.name}${"Public" === state.school.type ? "" : `, ${"Private" === state.school.type ? "a private" : "All-Girls" === state.school.type ? "an all-girls" : "an all-boys"} school`}.`,
              ),
              educationPopup(state.school, e);
          }
          const a = state.uni;
          a &&
            state.age - a.start >= 4 &&
            ((state.uni = null),
            (state.degree = a.major),
            (state.stats.Smarts = clamp(state.stats.Smarts + rint(3, 8))),
            say(`I graduated from ${a.name} with a degree in ${a.major}!`),
            setTimeout(
              () =>
                whenClear(() =>
                  jCard({
                    tag: "Education",
                    iconSrc: "school/grad-cap.png",
                    title: "Graduation",
                    lead: `You graduated from ${a.name} with a degree in ${a.major}!`,
                    rows: [
                      ["University", a.name],
                      ["Major", a.major],
                    ],
                    ok: () => {},
                  }),
                ),
              380,
            )),
            updateDockTab();
        });
