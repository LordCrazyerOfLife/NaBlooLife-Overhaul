      function openOccupation() {
        syncProfile(),
          (sTitle.textContent = "OCCUPATION"),
          (sSub.style.display = ""),
          (sBack.innerHTML = X_ICON),
          (sBack.onclick = () => screen.classList.remove("open"));
        const e = state.job,
          t = state.partJob,
          a = state.school && state.school.college ? state.school : null,
          o = a
            ? `<div class="sec">You</div><div class="row" data-go="college"><img src="edu/${EDU_PROGS[a.prog].ico}.png"><div class="t"><b>${a.level}</b>${sBar("Grades", a.grades)}</div>${CHEV}</div><div class="row" data-go="schedule"><img src="edu/schedule.png"><div class="t"><b>Schedule</b><div class="rel">Stress <i><u style="width:${Math.max(a.stress, 2)}%;background:${a.stress > 60 ? "#b3261e" : a.stress > 40 ? "#f5841f" : "#2fa03b"}"></u></i></div></div>${DOTS}</div>`
            : "";
        sList.innerHTML =
          o +
          (e
            ? `<div class="sec">Your Job</div><div class="row" data-go="myjob"><img src="${e.icon || "emoji/1f4bc.png"}"><div class="t"><b>${e.t}</b><div class="rel">Performance <i><u style="width:${e.perf ?? 50}%"></u></i></div></div>${CHEV}</div>`
            : "") +
          (t
            ? `<div class="sec">Part-Time Job</div><div class="row" data-go="partjob"><img src="${t.icon || "occ/parttime.png"}"><div class="t"><b>${t.t}</b><span>${t.emp} · ${usd(t.pay)}/year</span></div>${DOTS}</div>`
            : "") +
          (e || t ? '<div class="sec">Find a Job</div>' : a ? '<div class="sec">All</div>' : "") +
          OCC.filter(
            (e) =>
              (mods.painting || "painting" !== e[4]) &&
              !(isOldEra() && ("restaurants" === e[4] || "employers" === e[4])),
          )
            .map((e) =>
              isOldEra() && "fulltime" === e[4]
                ? ["occ/jobs.png", "1800s Jobs", "Find honest work in town", CHEV, "old"]
                : e,
            )
            .map(
              ([e, t, a, o, n, s]) =>
                `<div class="row ${s || ""}" data-go="${n || ""}"><img src="${e.includes("/") ? e : `emoji/${e}.png`}"><div class="t"><b>${t}</b><span>${a}</span></div>${o}</div>`,
            )
            .join("");
        sList.querySelectorAll(".row").forEach(
          (e) =>
            (e.onclick = () =>
              "myjob" === e.dataset.go
                ? openJobScreen()
                : "partjob" === e.dataset.go
                  ? jCard({
                      tag: "Part-Time Job",
                      iconSrc: t.icon || "occ/parttime.png",
                      title: t.t,
                      close: !0,
                      rows: [
                        ["Employer", t.emp],
                        ["Salary", `${usd(t.pay)}/year`],
                        ["Years Worked", t.payYears || 0],
                      ],
                      choices: [
                        [
                          "Quit",
                          () =>
                            iosConfirm(
                              "Confirm",
                              `Are you sure you want to quit your part-time job as ${/^[aeiou]/i.test(t.t) ? "an" : "a"} ${t.t}?`,
                              () => {
                                (state.partJob = null),
                                  say(
                                    `I quit my part-time job as ${/^[aeiou]/i.test(t.t) ? "an" : "a"} ${t.t}.`,
                                  ),
                                  openOccupation();
                              },
                            ),
                        ],
                      ],
                    })
                  : "coworkers" === e.dataset.go
                    ? openCoworkers()
                    : "restaurants" === e.dataset.go
                      ? openRestaurants()
                      : "employers" === e.dataset.go
                        ? openEmployers()
                        : "painting" === e.dataset.go
                          ? (play("choice"), openPainting(openOccupation))
                          : "military" === e.dataset.go
                            ? openMilitary()
                            : "recruiter" === e.dataset.go
                              ? openRecruiter()
                              : "education" === e.dataset.go
                                ? (play("choice"), openEducation())
                                : "college" === e.dataset.go
                                  ? (play("choice"), openCollege())
                                  : "schedule" === e.dataset.go
                                    ? scheduleCard()
                                    : LISTS[e.dataset.go]
                                      ? openJobs(e.dataset.go)
                                      : comingSoon()),
        ),
          screen.classList.add("open");
      }
      const ROLE_TYPES = {
          fast: [
            ["Cashier", 1],
            ["Crew Member (Cook)", 1.04],
            ["Drive-Thru Operator", 1.02],
            ["Janitor", 0.97],
            ["Shift Manager", 1.25],
            ["General Manager", 1.9, !0],
          ],
          coffee: [
            ["Barista", 1],
            ["Shift Supervisor", 1.22],
            ["Janitor", 0.97],
            ["Store Manager", 2, !0],
          ],
          pizza: [
            ["Pizza Maker", 1],
            ["Delivery Driver", 1.08],
            ["Cashier", 0.98],
            ["Shift Manager", 1.25],
            ["General Manager", 1.9, !0],
          ],
          casual: [
            ["Host", 0.95],
            ["Server", 1],
            ["Line Cook", 1.15],
            ["Dishwasher", 0.97],
            ["Bartender", 1.1],
            ["Kitchen Manager", 2.1, !0],
          ],
        },
        restaurantRoles = ([e, t, a, o]) =>
          attachRoleLadder(
            ROLE_TYPES[a].map(([n, s, r]) =>
              r
                ? {
                    t: n,
                    c: e,
                    emp: e,
                    e: t,
                    pay: 100 * Math.round((o * s * 2080) / 100),
                    edu: "High School",
                    group: "fast" === a ? "fast" : null,
                  }
                : {
                    t: n,
                    c: e,
                    emp: e,
                    e: t,
                    pay: Math.round(o * s * 4) / 4,
                    hourly: !0,
                    edu: "None",
                    group: "fast" === a ? "fast" : null,
                  },
            ),
            /Shift Manager|Shift Supervisor/,
            /General Manager|Store Manager|Kitchen Manager/,
          );
      function openRestaurants() {
        (sTitle.textContent = "RESTAURANTS"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openOccupation);
        const e = [...RESTAURANTS].sort((e, t) => t[3] - e[3]);
        (sList.innerHTML = e
          .map(
            (e, t) =>
              `<div class="row" data-r="${t}"><img src="emoji/${e[1]}.png" loading="lazy"><div class="t"><b>${e[0]}</b><span class="sal">Crew from ${hrLabel(e[3])}/hr</span></div>${CHEV}</div>`,
          )
          .join("")),
          (sList.scrollTop = 0),
          sList
            .querySelectorAll("[data-r]")
            .forEach((t) => (t.onclick = () => openRestaurant(e[+t.dataset.r])));
      }
      function openRestaurant(e) {
        (sTitle.textContent = e[0].toUpperCase()),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openRestaurants);
        const t = restaurantRoles(e).sort(
          (e, t) => (t.hourly ? 2e3 * t.pay : t.pay) - (e.hourly ? 2e3 * e.pay : e.pay),
        );
        (sList.innerHTML = t
          .map(
            (e, t) =>
              `<div class="row" data-j="${t}"><img src="emoji/${e.e}.png"><div class="t"><b>${e.t}</b><span class="sal">${payLabel(e, "restaurant")}</span></div>${rowEnd(e)}</div>`,
          )
          .join("")),
          (sList.scrollTop = 0),
          sList
            .querySelectorAll("[data-j]")
            .forEach((e) => (e.onclick = () => openJob(t[+e.dataset.j], "restaurant")));
      }
      const EMP_GROUP = {
          Amazon: "amazon",
          Walmart: "walmart",
          DoorDash: "delivery",
          "Uber Eats": "delivery",
        },
        employerRoles = (e) =>
          attachRoleLadder(
            e.roles.map(([t, a, o]) =>
              a > 1e3
                ? {
                    t: t,
                    c: e.name,
                    emp: e.name,
                    logo: e.logo,
                    pay: a,
                    minAge: o,
                    edu: e.needUni ? "University" : "High School",
                    needUni: !!e.needUni,
                    group: EMP_GROUP[e.name],
                  }
                : {
                    t: t,
                    c: e.name,
                    emp: e.name,
                    logo: e.logo,
                    pay: a,
                    minAge: o,
                    hourly: !0,
                    edu: "None",
                    group: EMP_GROUP[e.name],
                  },
            ),
            /Department Manager/,
            /Area Manager|Store Manager/,
          );
      function openEmployers() {
        (sTitle.textContent = "BIG EMPLOYERS"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openOccupation),
          (sList.innerHTML = EMPLOYERS.map((e, t) =>
            e.since && state.birthYear + state.age < e.since
              ? ""
              : `<div class="row" data-emp="${t}"><img src="${e.logo}" alt=""><div class="t"><b>${e.name}</b><span>${e.sub}</span></div>${CHEV}</div>`,
          ).join("")),
          (sList.scrollTop = 0),
          sList
            .querySelectorAll("[data-emp]")
            .forEach((e) => (e.onclick = () => openEmployer(EMPLOYERS[+e.dataset.emp])));
      }
      function openEmployer(e) {
        (sTitle.textContent = e.name.toUpperCase()),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openEmployers);
        const t = employerRoles(e).sort(
          (e, t) => (t.hourly ? 2e3 * t.pay : t.pay) - (e.hourly ? 2e3 * e.pay : e.pay),
        );
        (sList.innerHTML = t
          .map(
            (e, t) =>
              `<div class="row" data-j="${t}"><img src="${e.logo}" alt=""><div class="t"><b>${e.t}</b><span class="sal">${payLabel(e, "employer")}${e.minAge > 16 ? ` · ${e.minAge}+` : ""}</span></div>${rowEnd(e)}</div>`,
          )
          .join("")),
          (sList.scrollTop = 0),
          sList
            .querySelectorAll("[data-j]")
            .forEach((e) => (e.onclick = () => openJob(t[+e.dataset.j], "employer")));
      }
      let jobNow = null;
      const jobLatest = (e) => {
          if (!jobNow) {
            jobNow = new Map();
            for (const e of ["fulltime", "parttime", "freelance"])
              for (const t of JOB_DATA[e]) jobNow.has(t.t) || jobNow.set(t.t, t);
          }
          return jobNow.get(e.t) || e;
        },
        jobIcon = (e) =>
          e.img
            ? e.img
            : e.logo
              ? e.logo
              : jobLatest(e).s || e.s
                ? `job-emoji/${jobLatest(e).s || e.s}.png`
                : `emoji/${e.e}.png`,
        jobBoard = () => {
          const e = [...JOB_DATA.fulltime].sort(() => Math.random() - 0.5),
            t = e.slice(0, Math.round(e.length * (0.6 + 0.1 * Math.random())));
          for (let e = 5 + Math.floor(8 * Math.random()); e > 0; e--)
            t.push(t[Math.floor(Math.random() * t.length)]);
          return t.map((e) => ({ ...e, pay: Math.round(e.pay * (0.85 + 0.3 * Math.random())) }));
        };
      (state.jobBoard = jobBoard()),
        document.getElementById("ageBtn").addEventListener("click", () => {
          state.dead || (state.jobBoard = jobBoard());
        });
      let jobIndex = [];
      const SPECIAL_PACKS = [
          ["actor", "Actor", "Become a famous TV or movie star!", (e) => /Television|Film Studio/.test(e.c)],
          ["astronaut", "Astronaut", "Explore the cosmos!", (e) => "Space Agency" === e.c],
          ["business", "Business", "Start up, acquire, or lead a company!", (e) => "Own Business" === e.c],
          ["dealer", "Dealer", "Join a drug cartel!", (e) => "Cartel" === e.c, !0],
          ["fighter", "Fighter", "Fight your way to a world title!", (e) => e.fighter, !0],
          ["mafia", "Mafia", "Join an organized crime syndicate!", (e) => "Mafia" === e.c],
          ["model", "Model", "Become a famous supermodel!", (e) => "Modeling Agency" === e.c],
          [
            "producer",
            "Music Producer",
            "Become a famous music producer!",
            (e) => /Music Producer/.test(e.t),
          ],
          [
            "musician",
            "Musician",
            "Join a band or go for a solo career!",
            (e) => "Record Label" === e.c && !/Music Producer/.test(e.t),
          ],
          [
            "politician",
            "Politician",
            "Run for a political office!",
            (e) => "Government" === e.c || "President" === e.t,
          ],
          ["pope", "Pope", "Lead the Catholic Church!", null, !0],
          ["athlete", "Pro Athlete", "Become a professional athlete!", (e) => "Pro Sports" === e.c],
          ["hustler", "Street Hustler", "Hit the streets and get your hustle on!", (e) => "Streets" === e.c],
        ],
        SPECIAL_LOCKED = !0;
      function openSpecialCareers() {
        (sTitle.textContent = "SPECIAL CAREERS"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openOccupation);
        const e = SPECIAL_PACKS.filter((e) => "pope" !== e[0] || (window.PAPAL && PAPAL.ON()));
        (sList.innerHTML =
          '<div class="sec">Your Job Packs</div>' +
          e
            .map(
              ([e, t, a, , o]) =>
                `<div class="row sp-pack dis" data-pack="${e}"><img src="${"pope" === e ? "church/rank-pope.png" : `special/${e}.png`}" alt=""><div class="t"><b>${t}</b><span>${a}</span></div></div>`,
            )
            .join("")),
          (sList.scrollTop = 0),
          sList
            .querySelectorAll("[data-pack]")
            .forEach(
              (e) =>
                (e.onclick = () =>
                  notice(
                    "Error",
                    `The ${e.querySelector("b").textContent} job pack is not available right now.`,
                    null,
                    !0,
                  )),
            );
      }
      function openJobs(e) {
        if ("special" === e) return openSpecialCareers();
        const t =
          "parttime" === e && isOldEra()
            ? {
                title: "PART-TIME WORK",
                secs: [{ items: OLD_PART.filter((e) => state.birthYear + state.age >= e.from) }],
              }
            : "old" === e
              ? {
                  title: state.birthYear + state.age >= 1900 ? "1900s JOBS" : "1800s JOBS",
                  secs: [{ items: oldJobsNow() }],
                }
              : LISTS[e];
        (sTitle.textContent = t.title),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openOccupation),
          (jobIndex = []);
        const a = (
          "fulltime" === e
            ? [
                {
                  items: state.jobBoard
                    .map((e) => ({ ...e, c: jobLatest(e).c || e.c }))
                    .filter((e) => "Military" !== e.c),
                },
              ]
            : t.secs
        )
          .map((e) => ({ ...e, items: e.items.filter(eraJobOk) }))
          .filter((e) => e.items.length);
        (sList.innerHTML = a
          .map(
            (t) =>
              (t.sec ? `<div class="sec">${t.sec}</div>` : "") +
              [...t.items]
                .sort((e, t) => t.pay - e.pay)
                .map(
                  (t) =>
                    `<div class="row jl" data-i="${jobIndex.push(t) - 1}"><img src="${jobIcon(t)}" loading="lazy"><div class="t"><b>${t.t}${"freelance" === e || "old" === e || t.t.includes(`(${t.c})`) ? "" : ` <em>(${t.c})</em>`}</b><span class="sal">${payLabel(t, e)}</span></div>${rowEnd(t)}</div>`,
                )
                .join(""),
          )
          .join("")),
          (sList.scrollTop = 0),
          fitJobTitles(),
          sList
            .querySelectorAll(".row")
            .forEach(
              (t) =>
                (t.onclick = () =>
                  "freelance" === e ? gigCard(jobIndex[+t.dataset.i]) : openJob(jobIndex[+t.dataset.i], e)),
            );
      }
      function fitJobTitles() {
        sList.querySelectorAll(".row.jl .t b").forEach((e) => {
          e.style.fontSize = "";
          let t = parseFloat(getComputedStyle(e).fontSize);
          for (; e.scrollWidth > e.clientWidth + 1 && t > 12; ) (t -= 1), (e.style.fontSize = t + "px");
        });
      }
      const MANUAL_LADDERS = [
        [
          "Engineer I",
          "Engineer II",
          "Engineer III",
          "Assistant Engineering Manager",
          "Engineering Manager",
          "Director of Engineering",
          "Vice President of Engineering",
        ],
        [
          "Assistant Vice President",
          "Vice President",
          "First Vice President",
          "Senior Vice President",
          "Executive Vice President",
          "Managing Director",
          "President",
          "Chief Executive Officer (CEO)",
        ],
        ["Foot Model", "Hand Model", "Catalog Model", "Lingerie Model", "Runway Model", "Superstar Model"],
        ["Pilot Trainee", "Co-Pilot", "Pilot", "Chief Pilot"],
        ["Associate Nurse", "Clinical Nurse", "Advanced Clinician", "Clinical Nurse Specialist"],
        [
          "Magistrate",
          "Magistrate Court Judge",
          "District Court Judge",
          "Associate Chief Justice",
          "Chief Justice",
        ],
        [
          "Teacher",
          "Tech Teacher",
          "Head Tech Teacher",
          "Assistant Principal",
          "Principal",
          "Assistant Superintendent",
          "Superintendent",
          "School President",
        ],
        ["Law Clerk", "Junior Associate", "Associate", "Junior Partner", "Partner"],
        ["Legal Secretary", "Legal Records Manager", "Paralegal"],
        [
          "Busser",
          "Food Runner",
          "Host",
          "Server",
          "Head Waiter",
          "Expeditor",
          "Assistant Manager",
          "General Manager",
        ],
        ["Introductory Sommelier", "Certified Sommelier", "Advanced Sommelier", "Master Sommelier"],
        [
          "Dishwasher",
          "Line Cook",
          "Short Order Cook",
          "Apprentice Chef",
          "Chef Tournant",
          "Chef Garde Manger",
          "Junior Sous Chef",
          "Saucier",
          "Sous Chef",
          "Chef de Cuisine",
          "Executive Chef",
        ],
        [
          "Cadet (Police)",
          "Patrolman",
          "Trooper",
          "Corporal",
          "Sergeant",
          "Inspector",
          "Lieutenant",
          "Chief of Police",
        ],
        ["Crime Scene Technician", "Forensic Investigator", "Jr. Detective", "Detective"],
        [
          "Probationary Firefighter",
          "Firefighter",
          "Fire Equipment Operator",
          "Lieutenant (Fire Department)",
          "Captain (Fire Department)",
          "Battalion Chief",
          "Assistant Chief",
          "Fire Chief",
        ],
        ["Mortician", "Funeral Director"],
        ["Background Vocalist", "Lounge Singer", "Singer", "Lead Singer"],
        ["Exhibit Associate", "Assistant Curator", "Curator"],
        ["Travel Associate", "Agency Operator", "Regional Manager"],
        ["Library Clerk", "Library Aide", "Librarian", "Sr. Librarian"],
        [
          "Greenhorn (Fishery)",
          "Deck Hand (Fishery)",
          "Deck Boss (Fishery)",
          "Engineer (Fishery)",
          "Captain (Fishery)",
        ],
        [
          "Crew Member (Fast Food)",
          "Shift Manager (Fast Food)",
          "Restaurant Manager (Fast Food)",
          "General Manager (Fast Food)",
        ],
      ];
      function setLadder(e) {
        for (let t = 1; t < e.length; t++)
          e[t].pay = Math.max(
            e[t].pay,
            e[t - 1].hourly
              ? Math.round(1.18 * e[t - 1].pay * 4) / 4
              : 100 * Math.round((1.18 * e[t - 1].pay) / 100),
          );
        e.forEach((t, a) => {
          (t.ladder = e), (t.rank = a);
        });
      }
      {
        const $ = Object.fromEntries(JOB_DATA.fulltime.map((e) => [e.t, e]));
        MANUAL_LADDERS.forEach((e) => {
          const t = e.map((e) => $[e]).filter((e) => e && !e.ladder);
          t.length > 1 && setLadder(t);
        });
        const S = (e) =>
            e
              .replace(/^(jr\.|junior|apprentice|sr\.|senior|chief|head|lead|master|trainee)\s+/i, "")
              .replace(/\s+(trainee|i{1,3})$/i, ""),
          x = (e) =>
            /^(jr\.|junior|apprentice|trainee)/i.test(e)
              ? 0
              : /^(sr\.|senior|chief|head|lead|master)/i.test(e)
                ? 2
                : 1,
          C = {};
        JOB_DATA.fulltime.forEach((e) => {
          e.ladder || (C[S(e.t)] ||= []).push(e);
        }),
          Object.values(C).forEach((e) => {
            e.length > 1 && setLadder(e.sort((e, t) => x(e.t) - x(t.t) || e.pay - t.pay));
          }),
          JOB_DATA.military.forEach((e) => setLadder(e.items));
      }
      function attachRoleLadder(e, t, a) {
        const o = e.find((e) => t.test(e.t)),
          n = e.find((e) => a.test(e.t)),
          s = e.filter((e) => e !== o && e !== n);
        s.forEach((e) => {
          (e.ladder = [e, o, n].filter(Boolean)), (e.rank = 0);
        });
        const r = [s[0], o, n].filter(Boolean);
        return (
          o && ((o.ladder = r), (o.rank = r.indexOf(o))), n && ((n.ladder = r), (n.rank = r.indexOf(n))), e
        );
      }
      const lockTag = () => "",
        rowEnd = () => DOTS,
        yearlyOf = (e) => (e.old ? oldWage(e.pay) : wage(e.hourly ? 2e3 * e.pay : e.pay));
      function openJob(e, t) {
        const { e: a, t: o, pay: n } = e,
          s = employerFor(e);
        (jmIc.src = jobIcon(e)),
          (jmTitle.textContent = o),
          (jmTable.innerHTML = [
            ["Title", o],
            ["Employer", s],
            ["Salary", payLabel(e, t)],
            ["Education", e.edu],
            ...(e.ladder && e.ladder.length > 1
              ? [["Career", `Rank ${e.rank + 1} of ${e.ladder.length}`]]
              : []),
          ]
            .map(([e, t]) => `<tr><td><b>${e}:</b> ${t}</td></tr>`)
            .join("")),
          (jmApply.textContent = "Apply for this position"),
          (jmApply.onclick = () => {
            jmWrap.classList.remove("open");
            const a = e.minAge
              ? e.minAge
              : "freelance" === t
                ? 12
                : "parttime" === t
                  ? 14
                  : "restaurant" === t && e.hourly
                    ? 16
                    : 18;
            if (state.age < a)
              return notice("Too Young", `You must be at least ${a} to apply for this.`, null, !0);
            if (e.old && e.req) {
              const t = oldReqWhy(e);
              if (t) return notice("Not qualified", t, null, !0);
            }
            if (e.needUni && !degrees().some((e) => "uni" === e.prog))
              return notice("Degree required", `${s} only hires people with a university degree.`, null, !0);
            if ((screen.classList.remove("open"), "freelance" === t)) {
              const e = 2 + Math.floor(7 * Math.random()),
                t = Math.max(1, Math.round(e * wageHr(n) * (1 + 0.4 * Math.random())));
              return (
                (state.money += t),
                renderStats(),
                log.lastElementChild.insertAdjacentHTML(
                  "beforeend",
                  `<p>I worked a ${e}-hour gig as a ${o.toLowerCase()} and earned ${usd(t)}.</p>`,
                ),
                notice(
                  "Gig Complete",
                  `You worked ${e} hours as a ${o.toLowerCase()} and earned ${usd(t)}.`,
                  null,
                  !0,
                )
              );
            }
            if (Math.random() < 0.25 - 0.0015 * state.stats.Smarts)
              return (
                (state.stats.Happiness = clamp(
                  state.stats.Happiness - hit("parttime" === t ? "partTimeRejection" : "fullTimeRejection"),
                )),
                renderStats(),
                say(`${s} decided not to hire me.`),
                notice("Rejected", `${s} decided not to hire you.`, null, !0)
              );
            hireJob(e, t, s);
          }),
          jmWrap.classList.add("open");
      }
      const FELON_FRIENDLY = new Set([
          "Restaurant",
          "Fast Food",
          "Construction",
          "Logging Company",
          "Fishery",
          "Farm",
          "Moving Company",
          "Cleaning Service",
          "Auto Shop",
          "Butcher Shop",
          "Small Business",
          "Mafia",
          "Cartel",
          "Streets",
          "Circus",
          "Adult Entertainment",
          "Strip Club",
          "Nightclub",
          "Freelance",
          "Own Business",
          "Distillery",
          "Pizzeria",
          "Sandwich Shop",
          "Donut Shop",
          "Coffee Shop",
          "Ice Cream Shop",
          "Bait Shop",
          "Hotel",
          "Record Label",
          "Entertainment",
          "Pro Sports",
          "Television",
          "Film Studio",
          "Studio",
          "Car Wash",
          "Swimming Pool",
          "Arcade",
          "Bowling Alley",
          "Amusement Park",
          "Water Park",
          "Movie Theater",
          "Deodorant Lab",
          "Salon",
          "Gym",
          "Modeling Agency",
        ]),
        FELON_BANNED = {
          Army: "The military does not accept recruits with a felony conviction.",
          Navy: 0,
          "Air Force": 0,
          Marines: 0,
          "Coast Guard": 0,
          Military: 0,
          "Police Department": "Law enforcement agencies do not hire convicted felons.",
          Investigations: 0,
          "Fire Department": "Fire departments require a clean criminal record.",
          "Security Company": "Security guards need a state license, which felons cannot get.",
          Casino: "Casino jobs need a gaming license, which felons cannot get.",
          Government: "Government jobs require a background check that felons cannot pass.",
          "Space Agency": 0,
          "Postal Service": 0,
          Municipal: 0,
          School: "Schools do not hire felons to work with children.",
          "School District": 0,
          University: 0,
          "University District": 0,
        },
        FELON_LICENSED = {
          "Law School": "Felons cannot get a license to practice law.",
          "Medical School": "The medical board will not license a felon.",
          "Nursing School": "The nursing board will not license a felon.",
          "Pharmacy School": "The pharmacy board will not license a felon.",
          "Dental School": "The dental board will not license a felon.",
          "Veterinary School": "The veterinary board will not license a felon.",
        },
        THEFT_CRIME = /robbery|burglary|embezzle|shoplift|hacking|grand theft/i,
        VIOLENT_CRIME = /murder|killing|riot/i;
      function felonCheck(e, t) {
        const a = state.felony;
        if (!a) return null;
        const o = e.c || "",
          n = state.age - a.age;
        let s =
          FELON_BANNED[o] ||
          FELON_BANNED[
            {
              Navy: "Army",
              "Air Force": "Army",
              Marines: "Army",
              "Coast Guard": "Army",
              Military: "Army",
              Investigations: "Police Department",
              "Space Agency": "Government",
              "Postal Service": "Government",
              Municipal: "Government",
              "School District": "School",
              University: "School",
              "University District": "School",
            }[o]
          ] ||
          null;
        return (
          !s && FELON_LICENSED[e.edu] && (s = FELON_LICENSED[e.edu]),
          !s &&
            /\b(bus|truck|tractor|taxi|cab|limo|limousine|delivery) driver\b|trucker|chauffeur/i.test(e.t) &&
            !(state.licenses && state.licenses.cdl) &&
            (s = "This job needs a commercial driver's license (CDL). Get one at the License Office in Activities."),
          !s &&
            /teacher|counselor|babysit|nanny|tutor|caretaker|lifeguard|swim instructor|school bus|principal|superintendent/i.test(
              e.t,
            ) &&
            (s = "They do not hire felons to work with children."),
          !s &&
            /Bank|Insurance Agency/.test(o) &&
            THEFT_CRIME.test(a.crime) &&
            (s =
              "Federal law (FDIC Section 19) bars people convicted of dishonesty crimes from working there."),
          !s &&
            /Trucking Company|Transit Authority|Airline/.test(o) &&
            n < 7 &&
            (s = `Their insurance won't cover anyone with a felony in the last 7 years. (Yours was ${yrs(n)} ago.)`),
          !s &&
            THEFT_CRIME.test(a.crime) &&
            (/Retail|Retailer|Mall|Jeweler|Jewelry Store|Car Dealer/.test(o) ||
              /bookkeeper|accountant|cashier|teller|valet|collections/i.test(e.t)) &&
            (s = `They won't trust someone convicted of ${a.crime} around cash and merchandise.`),
          !s &&
            VIOLENT_CRIME.test(a.crime) &&
            /Hospital|Clinic|Mental Health Center|Veterinary Clinic|Dental Office|Pharmacy/.test(o) &&
            (s = "They do not hire people convicted of violent crimes to work with patients."),
          s ? { why: s } : FELON_FRIENDLY.has(o) ? null : { odds: Math.min(0.8, 0.35 + 0.05 * n) }
        );
      }
      function felonReject(e, t) {
        if (
          (say(`I was rejected by ${e} because of my criminal record.`),
          screen.classList.remove("open"),
          t.why)
        )
          return notice(
            "Rejected",
            `${e} doesn't hire felons.`,
            null,
            !0,
            `<table class="nt"><tr><td><b>Reason:</b> ${t.why}</td></tr><tr><td><b>Conviction:</b> ${capFirst(state.felony.crime)}</td></tr></table>`,
          );
        notice(
          "Rejected",
          `${e} ran a background check and decided not to hire you because of your felony conviction.`,
          null,
          !0,
          `<table class="nt"><tr><td><b>Conviction:</b> ${capFirst(state.felony.crime)}</td></tr></table>`,
        );
      }
      const INK_BANNED = {
          Army: "The military disqualifies recruits with gang-related tattoos, and face tattoos break uniform regulations.",
          Navy: 0,
          "Air Force": 0,
          Marines: 0,
          "Coast Guard": 0,
          Military: 0,
          "Police Department":
            "Police departments disqualify applicants with gang-related tattoos, no matter where they are.",
          Investigations: 0,
          "Fire Department":
            "Fire departments follow the same tattoo rules as the police, and gang tattoos are disqualifying.",
          Government:
            "Government jobs require a background check, and gang tattoos flag you as a gang member.",
          "Space Agency": 0,
          "Postal Service": 0,
          Municipal: 0,
          "Law Firm":
            "Courts and law firms will not put someone with gang tattoos on their face in front of a judge or client.",
          School: "Schools will not hire someone with gang tattoos to work around children.",
          "School District": 0,
          University: 0,
          "University District": 0,
          Airline: "Airlines ban visible face tattoos for crew, even where other tattoos are allowed.",
          Bank: "Banks will not trust someone with gang tattoos with customers' money.",
          "Investment Bank": 0,
          "Insurance Agency": 0,
          Casino: "Casino jobs need a gaming license, and suspected gang ties get it denied.",
          Hospital: "Hospitals will not hire someone with gang tattoos on their face to work with patients.",
          Clinic: 0,
          "Medical Office": 0,
          "Mental Health Center": 0,
          "Dental Office": 0,
          Pharmacy: 0,
          "Veterinary Clinic": 0,
          Church: "The church will not ordain someone with gang tattoos on their face.",
          Convent: 0,
          Monastery: 0,
        },
        INK_SAME_AS = {
          Navy: "Army",
          "Air Force": "Army",
          Marines: "Army",
          "Coast Guard": "Army",
          Military: "Army",
          Investigations: "Police Department",
          "Space Agency": "Government",
          "Postal Service": "Government",
          Municipal: "Government",
          "School District": "School",
          University: "School",
          "University District": "School",
          "Investment Bank": "Bank",
          "Insurance Agency": "Bank",
          Clinic: "Hospital",
          "Medical Office": "Hospital",
          "Mental Health Center": "Hospital",
          "Dental Office": "Hospital",
          Pharmacy: "Hospital",
          "Veterinary Clinic": "Hospital",
          Convent: "Church",
          Monastery: "Church",
        },
        INK_FRIENDLY = new Set([
          "Cartel",
          "Mafia",
          "Streets",
          "Construction",
          "Logging Company",
          "Fishery",
          "Farm",
          "Moving Company",
          "Cleaning Service",
          "Auto Shop",
          "Car Dealer",
          "Small Business",
          "Own Business",
          "Distillery",
          "Record Label",
          "Pro Sports",
          "Nightclub",
          "Strip Club",
          "Adult Entertainment",
          "Adult Film Studio",
          "Circus",
          "Entertainment",
          "Car Wash",
          "Bait Shop",
          "Airport",
          "Trucking Company",
          "Ride Sharing App",
          "Swimming Pool",
          "Arcade",
          "Design Studio",
          "Animation Studio",
          "Deodorant Lab",
          "Salon",
          "Gym",
          "Butcher Shop",
        ]);
      function gangInkCheck(e) {
        if (!myTats(state.look)) return null;
        const t = e.c || "";
        let a = INK_BANNED[t] || INK_BANNED[INK_SAME_AS[t]] || null;
        return (
          !a &&
            /teacher|counselor|babysit|nanny|tutor|caretaker|lifeguard|swim instructor|school bus|principal|superintendent|santa/i.test(
              e.t,
            ) &&
            (a = "Parents will not trust someone with gang tattoos on their face around their kids."),
          !a &&
            /judge|justice|magistrate|politician|mayor|governor|prime minister|lobbyist/i.test(e.t) &&
            (a = "Nobody will trust someone with gang tattoos on their face with public office."),
          a
            ? { why: a }
            : INK_FRIENDLY.has(t) ||
                /fast food|dishwasher|busser|line cook|prep cook|kitchen/i.test(e.t + " " + t)
              ? null
              : {
                  odds: /Corporate|Engineering Firm|Real Estate|Travel Agency|Modeling Agency|Fashion House|Jeweler|Jewelry Store|Golf Club|Hotel|Funeral Home|Mortuary/.test(
                    t,
                  )
                    ? 0.15
                    : 0.4,
                }
        );
      }
      function gangInkReject(e, t) {
        if (
          (say(`I was rejected by ${e} because of my gang tattoos.`), screen.classList.remove("open"), t.why)
        )
          return notice(
            "Rejected",
            `${e} won't hire someone with gang tattoos on their face.`,
            null,
            !0,
            `<table class="nt"><tr><td><b>Reason:</b> ${t.why}</td></tr></table>`,
          );
        notice(
          "Rejected",
          `The hiring manager at ${e} took one look at the gang tattoos on your face and ended the interview.`,
          null,
          !0,
        );
      }
      function hireJob(e, t, a) {
        const { t: o, pay: n } = e;
        if (((a = a || employerFor(e)), state.homeless && !chance(0.3)))
          return (
            say(`${a} wouldn't hire me because I'm homeless.`),
            notice(
              "Rejected",
              `${a} decided not to hire you.`,
              null,
              !0,
              '<table class="nt"><tr><td><b>Reason:</b> No permanent address</td></tr></table>',
            )
          );
        if (window.DRUG_USE && DRUG_USE.rejects())
          return (
            say(`${a} wouldn't hire me because of my drug use.`),
            notice(
              "Rejected",
              `${a} decided not to hire you.`,
              null,
              !0,
              `<table class="nt"><tr><td><b>Reason:</b> ${pickR(["Failed the drug test", "The interviewer noticed you were high", "Your references mentioned your drug use"])}</td></tr></table>`,
            )
          );
        {
          const t = gangInkCheck(e);
          if (t && (t.why || !chance(t.odds))) return gangInkReject(a, t);
        }
        if (state.felony) {
          const t = felonCheck(e, a);
          if (t && (t.why || !chance(t.odds))) return felonReject(a, t);
        }
        const s = e.old ? oldWage(n) : wage(e.hourly ? 2e3 * n : "parttime" === t ? 1e3 * n : n),
          r = (e) => (/^[aeiou]/i.test(e) ? "an" : "a");
        if ("parttime" === t && ((state.job && "parttime" !== state.job.kind) || state.partJob)) {
          const n = state.partJob,
            i = state.job;
          return (
            n && say(`I quit my part-time job as ${r(n.t)} ${n.t}.`),
            (state.partJob = {
              t: o,
              c: e.c,
              pay: s,
              emp: a,
              icon: jobIcon(e),
              kind: t,
              startMonths: rint(1, 12),
            }),
            say(
              `I got a part-time job as ${r(o)} ${o} at ${a}${i ? `, on top of my job as ${r(i.t)} ${i.t}` : ""}.`,
            ),
            screen.classList.remove("open"),
            notice(
              "Side hustle",
              `You got a part-time job as ${r(o)} ${o} at ${a}!${i ? `<br><br>You're keeping your job as ${r(i.t)} ${i.t}.` : ""}${n ? `<br><br>You quit your old part-time job as ${r(n.t)} ${n.t}.` : ""}`,
              null,
              !0,
            )
          );
        }
        if ("parttime" !== t && state.job && "parttime" === state.job.kind && !state.partJob) {
          const e = state.job;
          state.partJob = {
            t: e.t,
            c: e.c,
            pay: e.pay,
            emp: e.emp,
            icon: e.icon,
            kind: "parttime",
            startMonths: e.startMonths,
            payYears: e.payYears,
          };
        }
        (state.job = {
          t: o,
          c: e.c,
          pay: s,
          emp: a,
          icon: jobIcon(e),
          ladder: e.ladder || [e],
          rank: e.rank || 0,
          perf: 50,
          yrs: 0,
          worked: !1,
          asked: !1,
          startMonths: rint(1, 12),
          group: e.group || null,
          coworkers: makeCoworkers(e),
          kind: t,
        }),
          renderAvatar(),
          loadJobEvents(state.job),
          log.lastElementChild.insertAdjacentHTML("beforeend", `<p>I got a job as a ${o} at ${a}.</p>`),
          screen.classList.remove("open");
        const i =
            e.career ||
            o.replace(/^(Apprentice|Junior|Senior|Jr\.|Sr\.|Head|Assistant|Trainee|Lead|Chief)\s+/i, ""),
          l = "military" === t && mods.militaryExpanded,
          c = () => (l ? setTimeout(() => mosCard(!1), 250) : parentsHouseOffer());
        if ("military" === t) {
          const t = () =>
            notice(
              "Welcome aboard",
              `Welcome to the ${e.c}!`,
              c,
              !0,
              `<table class="nt"><tr><td><b>Country:</b> ${(COUNTRIES[state.country] || ["Unknown"])[0]}</td></tr><tr><td><b>Status:</b> ${milOfficer(state.job) ? "Officer" : "Enlisted"}</td></tr><tr><td><b>Rank:</b> ${o}</td></tr><tr><td><b>Salary:</b> ${usd(s)}</td></tr></table>`,
            );
          return window.BOOTCAMP ? BOOTCAMP.start({ branch: e.c, done: t }) : t();
        }
        notice(
          "When can you start?",
          `Welcome to ${a}!`,
          c,
          !0,
          `<table class="nt"><tr><td><b>Title:</b> ${o}</td></tr><tr><td><b>Career:</b> ${i}</td></tr><tr><td><b>Employer:</b> ${a}</td></tr><tr><td><b>Salary:</b> ${usd(s)}</td></tr></table>`,
        );
      }
      const GIG_CLIENTS = [
          "cyclist",
          "accountant",
          "retiree",
          "single mom",
          "nurse",
          "college student",
          "landlord",
          "chef",
          "businessman",
          "teacher",
          "mechanic",
          "florist",
          "firefighter",
          "dentist",
          "yoga instructor",
          "lawyer",
          "plumber",
          "grandmother",
          "pilot",
          "barista",
          "photographer",
          "farmer",
        ],
        GIG_RULES = { Tutor: { min: 14 }, Handyman: { hard: 0.55, adult: 30, young: 0.12 } };
      function gigCard(e) {
        const t = GIG_RULES[e.t] || e.gig || {},
          a = t.min || 12;
        if (state.age < a)
          return show("Too Young", `You must be at least ${a} to work as a ${e.t.toLowerCase()}.`);
        const o = wageHr(e.pay),
          n = [
            ...new Set(
              [1, 1.07, 1.14, 1.2, 1.33, ...Array.from({ length: 8 }, (e, t) => 1.5 + 0.25 * t)].map((e) => {
                return Math.max(0.01, (t = o * e) >= 10 ? Math.round(t) : Math.round(100 * t) / 100);
                var t;
              }),
            ),
          ],
          s = (e) => cur() + (e % 1 ? e.toFixed(2) : e.toLocaleString("en-US"));
        (ev.innerHTML = `\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="jm-tag" style="margin-top:12px">Job</div>\n      <h4><img src="${jobIcon(e)}" alt=""><span>${e.t}</span></h4>\n      <div class="lead">Offer your services as a ${e.t.toLowerCase()} today!</div>\n      <label class="hr-lab">Pick your rate:</label>\n      <div class="hr-sel"><select id="gigRate">${n.map((e) => `<option value="${e}">${s(e)}/hour</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="gigGo">Post an ad</button>`),
          (ev.style.overflow = "visible");
        const r = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = r),
          (document.getElementById("gigGo").onclick = () => {
            const a = +document.getElementById("gigRate").value;
            r(),
              screen.classList.remove("open"),
              state.gigYear !== state.age &&
                ((state.gigYear = state.age), (state.gigPosts = 0), (state.gigUse = {})),
              state.gigPosts++;
            const n = ((state.gigUse ||= {})[e.t] ||= { n: 0, cap: rint(10, 20) });
            if (n.n >= n.cap) {
              const t = e.t.toLowerCase();
              return (
                say(`I couldn't find any more clients for ${t} work this year.`),
                notice(
                  "All booked out",
                  `You've done ${n.n} ${t} gigs this year and nobody else needs one. Try again next year.`,
                  null,
                  !0,
                )
              );
            }
            const i = /Tutor|Pet Sitter|Dog Walker|Babysitter|Plant Sitter|House Sitter/.test(e.t),
              l = (state.gigExp ||= {})[e.t] || 0;
            let c = Math.max(
              0,
              Math.min(0.92, 0.85 - 0.8 * (a / o - 1)) - n.n * (i ? 0.005 : 0.02) + Math.min(0.2, 0.01 * l),
            );
            !i && state.age < 18 && (c *= Math.min(1, 0.35 + 0.05 * l)), t.hard && (c *= t.hard);
            const d = t.adult && state.age < t.adult;
            d && (c *= t.young);
            const u = e.t.toLowerCase();
            if (state.felony) {
              if (/Babysitter|Tutor|Caretaker/.test(e.t) || t.bg)
                return (
                  say(`I posted an ad offering my services as a ${u}, but nobody wanted to hire a felon.`),
                  notice(
                    "No takers",
                    `Nobody wants to hire a felon as a ${u}.`,
                    null,
                    !1,
                    `<table class="nt"><tr><td><b>Reason:</b> ${"House Sitter" === e.t ? "Homeowners run background checks before handing over their keys." : `Families run background checks before letting anyone near their ${"Caretaker" === e.t ? "loved ones" : "kids"}.`}</td></tr></table>`,
                  )
                );
              /Pet Sitter|Dog Walker/.test(e.t) && (c *= 0.35);
            }
            if (!chance(c))
              return d
                ? (say(
                    `I posted an ad offering my services as a ${u}, but nobody wanted to hire someone so young.`,
                  ),
                  notice(
                    "No takers",
                    `Nobody wanted to hire a ${state.age}-year-old ${u}. People usually want someone with more experience.`,
                  ))
                : (say(
                    `I posted an ad offering my services as a ${u} for ${s(a)}/hour, but nobody hired me.`,
                  ),
                  notice(
                    "No takers",
                    a > 1.4 * o
                      ? `Nobody wanted to pay ${s(a)}/hour for a ${u}. Try a lower rate.`
                      : !i && state.age < 18
                        ? `People want someone older or more experienced for ${u} work.`
                        : `Nobody responded to your ad for a ${u}.`,
                  ));
            n.n++, (state.gigExp[e.t] = l + 1);
            const h = rint(3, 40),
              p = Math.max(1, Math.round(h * a)),
              m = pickR(GIG_CLIENTS),
              f = uname(chance(0.5) ? "m" : "f");
            (state.money += p),
              renderStats(),
              say(`A ${m} named ${f} hired me as a ${u} for ${h} hours. I earned ${usd(p)}.`),
              notice(
                "Racks on racks",
                `A ${m} named ${f} hired you as a ${u} for ${h} hours.`,
                null,
                !1,
                `<table class="nt"><tr><td><b>Earnings:</b> ${usd(p)}</td></tr><tr><td><b>Hours:</b> ${h}</td></tr><tr><td><b>Hourly Rate:</b> ${s(a)}</td></tr></table>`,
              );
          }),
          evWrap.classList.add("open");
      }
      const REF_ADJ = [
          "Handy",
          "Golden",
          "Sunny",
          "Rapid",
          "Royal",
          "Green",
          "Silver",
          "Happy",
          "Lucky",
          "Blue",
          "Prime",
          "Maple",
          "River",
          "Summit",
        ],
        REF_NOUN = [
          "Pastures",
          "Works",
          "Industries",
          "Enterprises",
          "Solutions",
          "Supply",
          "Partners",
          "Farms",
          "Group",
          "Co.",
          "Services",
          "Outfitters",
        ];
      function jobReferralRoll() {
        if (
          state.age < 18 ||
          state.job ||
          state.school ||
          state.age - (state.referralAt ?? -9) < 4 ||
          !chance(0.25)
        )
          return !1;
        if (state.royal && !state.royal.abdicated) return !1;
        const e = state.family.filter(
            (e) =>
              !e.dead &&
              famOn(e) &&
              relAge(e) >= 25 &&
              ["grandparent", "auntuncle", "sibling"].includes(e.kind),
          ),
          t = [
            ...aliveParents().map((e) => ({
              p: e,
              role: e.role,
              name: `${e.first} ${SURNAME}`,
              g: e.gender,
              age: e.ageAtBirth + state.age,
              av: PICON[e.role],
            })),
            ...e.map((e) => ({
              p: e,
              role: relTitle(e),
              name: `${e.first} ${e.last}`,
              g: e.g,
              age: relAge(e),
              av: "1f9d1",
            })),
          ];
        if (!t.length) return !1;
        const a = pickR(t),
          o = JOB_DATA.fulltime.filter((e) => "None" === e.edu || "High School" === e.edu),
          n = { ...pickR(o) };
        n.pay = Math.round(n.pay * (0.9 + 0.2 * Math.random()));
        const s = `${pickR(REF_ADJ)} ${pickR(REF_NOUN)}`,
          r = n.t.replace(/^(Apprentice|Junior|Senior|Jr\.|Sr\.|Head|Assistant|Trainee|Lead|Chief)\s+/i, ""),
          i = a.role.toLowerCase();
        return (
          (state.referralAt = state.age),
          queueRoll(() =>
            openEvent({
              kind: a.role,
              make: () => ({
                who: a.name,
                av: a.av,
                person: { look: a.p.look, g: a.g, age: a.age },
                iconSrc: jobIcon(n),
                title: "Job Referral",
                desc: `Your ${i} has a friend who works at ${s} and can get you a job there as ${/^[AEIOU]/.test(n.t) ? "an" : "a"} ${n.t}.`,
                table: [
                  ["Title", n.t],
                  ["Career", r],
                  ["Employer", s],
                  ["Salary", usd(wage(n.pay))],
                ],
                choices: [
                  [
                    "Take the job",
                    () => (
                      (a.p.rel = clamp(a.p.rel + rint(2, 5))),
                      setTimeout(() => hireJob(n, "fulltime", s), 0),
                      `My ${i} got me a job as ${/^[AEIOU]/.test(n.t) ? "an" : "a"} ${n.t} at ${s}.`
                    ),
                  ],
                  [
                    "That's not for me",
                    () => (
                      (a.p.rel = clamp(a.p.rel - rint(0, 2))),
                      `I turned down my ${i}'s offer to get me a job at ${s}.`
                    ),
                  ],
                ],
              }),
            }),
          ),
          !0
        );
      }
      function openRecruiter() {
        if (state.age < 18) return show("Too Young", "You must be at least 18 to use a job recruiter.");
        const e = Math.max(5, wage(1200));
        tagCard({
          tag: "Job",
          iconSrc: "occ/recruiter.png",
          title: "Job Recruiter",
          surprise: !1,
          lead: "Let the job recruiter find the best possible full-time position for your skill set today!",
          rows: [["Cost", usd(e)]],
          choices: [
            [
              "Let's try it",
              () => {
                if (state.money < e)
                  return notice(
                    "Not enough",
                    `You need ${usd(e)} to hire a job recruiter.<br><br>You are ${usd(e - state.money)} short.`,
                  );
                (state.money -= e), renderStats(), say(`I paid a job recruiter ${usd(e)}.`);
                const t = { ...pickR(JOB_DATA.fulltime.filter(eraJobOk)) };
                t.pay = Math.round(t.pay * (0.9 + 0.25 * Math.random()));
                const a = `The ${any(LAST)} Group`;
                setTimeout(
                  () =>
                    openEvent({
                      kind: "Job",
                      make: () => ({
                        plain: !0,
                        iconSrc: jobIcon(t),
                        title: "Job Recruiter",
                        desc: `The job recruiter has identified the position of ${t.t} at ${a} as a good fit for your skill set and has already arranged an interview for you.`,
                        table: [
                          ["Title", t.t],
                          ["Employer", a],
                          ["Salary", usd(wage(t.pay))],
                        ],
                        choices: [
                          [
                            "Attend the interview",
                            () =>
                              chance(0.8)
                                ? (setTimeout(() => hireJob(t, "fulltime", a), 0),
                                  `I attended a job interview for ${t.t} at ${a}.`)
                                : (setTimeout(
                                    () =>
                                      notice("Rejected", `${a} decided not to hire you after the interview.`),
                                    0,
                                  ),
                                  `I attended a job interview for ${t.t} at ${a}, but they didn't hire me.`),
                          ],
                          ["Turn it down", () => `I turned down the interview for ${t.t} at ${a}.`],
                        ],
                      }),
                    }),
                  250,
                );
              },
            ],
          ],
        });
      }
      const MIL_RANKS = {
          Army: [
            [
              "Private",
              "Private Second Class",
              "Private First Class",
              "Specialist",
              "Sergeant",
              "Staff Sergeant",
              "Sergeant First Class",
              "Master Sergeant",
              "Sergeant Major",
            ],
            [
              "Second Lieutenant",
              "First Lieutenant",
              "Captain",
              "Major",
              "Lieutenant Colonel",
              "Colonel",
              "Brigadier General",
              "Major General",
              "General",
            ],
          ],
          "Air Force": [
            [
              "Airman Basic",
              "Airman",
              "Airman First Class",
              "Senior Airman",
              "Staff Sergeant",
              "Technical Sergeant",
              "Master Sergeant",
              "Senior Master Sergeant",
              "Chief Master Sergeant",
            ],
            [
              "Second Lieutenant",
              "First Lieutenant",
              "Captain",
              "Major",
              "Lieutenant Colonel",
              "Colonel",
              "Brigadier General",
              "Major General",
              "General",
            ],
          ],
          Navy: [
            [
              "Seaman Recruit",
              "Seaman Apprentice",
              "Seaman",
              "Petty Officer Third Class",
              "Petty Officer Second Class",
              "Petty Officer First Class",
              "Chief Petty Officer",
              "Senior Chief Petty Officer",
              "Master Chief Petty Officer",
            ],
            [
              "Ensign",
              "Lieutenant Junior Grade",
              "Lieutenant",
              "Lieutenant Commander",
              "Commander",
              "Captain",
              "Rear Admiral",
              "Vice Admiral",
              "Admiral",
            ],
          ],
          Marines: [
            [
              "Private",
              "Private First Class",
              "Lance Corporal",
              "Corporal",
              "Sergeant",
              "Staff Sergeant",
              "Gunnery Sergeant",
              "Master Sergeant",
              "Sergeant Major",
            ],
            [
              "Second Lieutenant",
              "First Lieutenant",
              "Captain",
              "Major",
              "Lieutenant Colonel",
              "Colonel",
              "Brigadier General",
              "Major General",
              "General",
            ],
          ],
          "Coast Guard": [
            [
              "Seaman Recruit",
              "Seaman Apprentice",
              "Seaman",
              "Petty Officer Third Class",
              "Petty Officer Second Class",
              "Petty Officer First Class",
              "Chief Petty Officer",
              "Senior Chief Petty Officer",
              "Master Chief Petty Officer",
            ],
            [
              "Ensign",
              "Lieutenant Junior Grade",
              "Lieutenant",
              "Lieutenant Commander",
              "Commander",
              "Captain",
              "Rear Admiral",
              "Vice Admiral",
              "Admiral",
            ],
          ],
        },
        MIL_BRANCHES = [
          ["Army", "shield", "Defend the land"],
          ["Air Force", "airplane", "Defend the air"],
          ["Navy", "anchor", "Defend the sea"],
          ["Marines", "crossed-swords", "Attack the beach"],
          ["Coast Guard", "boat", "Defend the homeland"],
        ],
        MIL_LOGO = {
          Army: "logo-army",
          Navy: "logo-navy",
          "Air Force": "logo-airforce",
          Marines: "logo-marines",
          "Coast Guard": "logo-coastguard",
        },
        OLD_MIL_LOGO = {
          Army: "2694-fe0f",
          Navy: "2693",
          Marines: "1f6e1-fe0f",
          "Air Force": "1f396-fe0f",
          "Coast Guard": "26f5",
        },
        milLogo = (e) =>
          isOldEra()
            ? `freelife/apple/${OLD_MIL_LOGO[e] || "1f396-fe0f"}.png`
            : mods.militaryExpanded
              ? `mil/${MIL_LOGO[e]}.png`
              : `job-emoji/${MIL_BRANCHES.find((t) => t[0] === e)[1]}.png`;
      let milLadder = (e, t) => {
        const a = MIL_BRANCHES.find((t) => t[0] === e)[1],
          o = MIL_RANKS[e][t ? 1 : 0].map((o, n) => ({
            t: o,
            c: e,
            emp: `U.S. ${e}`,
            s: a,
            edu: t ? "University" : "High School",
            pay: 100 * Math.round(((t ? 35200 : 22e3) * (t ? 1.28 : 1.1) ** n) / 100),
          }));
        return (
          o.forEach((e, t) => {
            (e.ladder = o), (e.rank = t);
          }),
          o
        );
      };
      const CSA_CITIES =
          /^(Atlanta|Austin|Biloxi|Charlotte|Dallas|Houston|Jacksonville|Memphis|Miami|Nashville|New Orleans|Orlando|San Antonio|Tampa)$/,
        civilWar = () => yearNow() >= 1861 && yearNow() <= 1865,
        inConfederacy = () => "us" === state.country && civilWar() && CSA_CITIES.test(state.city || ""),
        OFFICER_1861 = [
          ["Second Lieutenant", 105],
          ["First Lieutenant", 108],
          ["Captain", 118],
          ["Major", 169],
          ["Lieutenant Colonel", 181],
          ["Colonel", 212],
        ],
        ENLISTED_1861 = [
          ["Private", 13],
          ["Corporal", 14],
          ["Sergeant", 17],
          ["First Sergeant", 20],
          ["Sergeant Major", 21],
        ];
      function mil1800Branches() {
        const e = yearNow(),
          t = civilWar();
        if (inConfederacy())
          return [
            {
              k: "csa",
              name: "Confederate States Army",
              ico: "freelife/apple/2694-fe0f.png",
              desc: "Serve in the Confederate army",
              min: e >= 1864 ? 17 : 18,
              max: e >= 1864 ? 50 : 35,
              term: 3,
              assign: ["Infantry", "Cavalry", "Artillery"],
              en: [
                ["Private", e >= 1864 ? 18 : 11],
                ["Corporal", 13],
                ["Sergeant", 17],
                ["First Sergeant", 20],
                ["Sergeant Major", 21],
              ],
              off: [
                ["Second Lieutenant", 80],
                ["First Lieutenant", 90],
                ["Captain", 130],
                ["Major", 150],
                ["Lieutenant Colonel", 170],
                ["Colonel", 195],
              ],
            },
            {
              k: "csn",
              name: "Confederate States Navy",
              ico: "emoji/2693.png",
              desc: "Run the Union blockade at sea",
              min: 18,
              max: 45,
              term: 3,
              assign: ["Deck"],
              en: [
                ["Landsman", 12],
                ["Ordinary Seaman", 14],
                ["Seaman", 18],
                ["Boatswain's Mate", 25],
              ],
              off: [
                ["Midshipman", 40],
                ["Lieutenant", 125],
                ["Commander", 175],
                ["Captain", 290],
              ],
            },
          ];
        return [
          {
            k: "army",
            name: t ? "Union Army" : "United States Army",
            ico: e < 1880 ? "mil1800/army-1778.png" : "mil1800/army-seal.png",
            min: 18,
            max: t ? 45 : 35,
            term: t ? 3 : 5,
            desc: t
              ? "Join a volunteer regiment and fight for the Union"
              : e >= 1866
                ? "Garrison the western frontier"
                : "Defend the nation",
            assign: ["Infantry", e < 1855 ? "Dragoons" : "Cavalry", "Artillery"],
            en: ENLISTED_1861,
            off: OFFICER_1861,
          },
          {
            k: "navy",
            name: "United States Navy",
            ico: "mil1800/navy-1879.png",
            min: 18,
            max: 35,
            boy: e >= 1875,
            term: 3,
            desc: e >= 1870 ? "Serve aboard steam and sail warships" : "Sail aboard the nation's warships",
            assign: e >= 1870 ? ["Deck", "Engine room"] : ["Deck"],
            en: [
              ["Landsman", 12],
              ["Ordinary Seaman", 14],
              ["Seaman", 18],
              ["Boatswain's Mate", 25],
              [e >= 1893 ? "Chief Boatswain's Mate" : "Master-at-Arms", e >= 1893 ? 40 : 30],
            ],
            eng: [
              ["Coal Heaver", 22],
              ["Fireman Second Class", 30],
              ["Fireman First Class", 35],
              ["Water Tender", 38],
              ["Machinist", 70],
            ],
            off: [
              ["Midshipman", 40],
              e >= 1862 ? ["Ensign", 100] : ["Passed Midshipman", 62],
              ["Lieutenant", 150],
              ...(e >= 1862 ? [["Lieutenant Commander", 200]] : []),
              ["Commander", 230],
              ["Captain", 290],
            ],
          },
          {
            k: "marines",
            name: "United States Marine Corps",
            ico: e >= 1868 ? "mil1800/marines-1868.png?v=2" : "mil1800/marines-early.png",
            desc: "Serve ashore and afloat",
            min: 18,
            max: 35,
            term: 4,
            assign: ["Ship's detachment", "Navy yard guard"],
            en: ENLISTED_1861,
            off: OFFICER_1861,
          },
          {
            k: "revenue",
            name: e >= 1894 ? "Revenue Cutter Service" : "Revenue Marine",
            ico: e < 1867 ? "mil1800/revenue-1799.png" : "mil1800/revenue-1867.png",
            desc: "Chase smugglers and enforce customs laws at sea",
            min: 18,
            max: 40,
            term: 3,
            assign: ["Cutter crew"],
            en: [
              ["Ordinary Seaman", 16],
              ["Seaman", 20],
              ["Coxswain", 25],
              ["Boatswain's Mate", 30],
            ],
            off: [
              ["Third Lieutenant", 60],
              ["Second Lieutenant", 70],
              ["First Lieutenant", 85],
              ["Captain", 135],
            ],
          },
        ];
      }
      function mil1800Ladder(e, t, a, o) {
        const n = (t ? e.off : a ? e.eng : o ? [["Apprentice Boy", 9], ...e.en] : e.en).map(([a, o]) => ({
          t: a,
          c: e.name,
          emp: e.name,
          pay: 12 * o,
          monthly: o,
          edu: t ? "Commission" : "None",
          old: !0,
          img: e.ico,
          mil1800: e.k,
        }));
        return (
          n.forEach((e, t) => {
            (e.ladder = n), (e.rank = t);
          }),
          n
        );
      }
      const ordinalN = (e) =>
        e + (e % 100 >= 11 && e % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][e % 10] || "th");
      function mil1800Unit(e, t) {
        const a = `Company ${"ABCDEFGHIK"[rint(0, 9)]}`,
          o = ordinalN(rint(1, 40)),
          n = pickR([
            "Constitution",
            "Hartford",
            "Kearsarge",
            "Brooklyn",
            "Lancaster",
            "Monongahela",
            "Olympia",
            "Raleigh",
            "Wabash",
            "Susquehanna",
          ]);
        return "army" === e.k
          ? civilWar()
            ? `${a}, ${o} Volunteer ${t}`
            : `${a}, ${o} U.S. ${t}`
          : "csa" === e.k
            ? `${a}, ${o} Confederate ${t}`
            : "navy" === e.k
              ? `USS ${n}`
              : "csn" === e.k
                ? `CSS ${pickR(["Alabama", "Virginia", "Shenandoah", "Florida", "Tennessee"])}`
                : "marines" === e.k
                  ? "Navy yard guard" === t
                    ? `Marine Barracks, ${pickR(["Brooklyn", "Philadelphia", "Boston", "Norfolk", "Washington"])} Navy Yard`
                    : `Marine Detachment, USS ${n}`
                  : `Revenue Cutter ${pickR(["Harriet Lane", "Gallatin", "Hudson", "McCulloch", "Manning", "Bear", "Rush", "Corwin"])}`;
      }
      function mil1800Join(e, t, a, o, n) {
        const s = mil1800Ladder(e, t, "Engine room" === a, o)[0],
          r = mil1800Unit(e, a),
          i = () => {
            hireJob(s, "mil1800", r),
              state.job &&
                state.job.t === s.t &&
                ((state.job.mil1800 = {
                  k: e.k,
                  name: e.name,
                  end: state.age + e.term,
                  term: e.term,
                  officer: t,
                }),
                (state.respect = clamp((state.respect ?? 40) + 3)),
                say(
                  `I ${n ? "was drafted into" : "swore the oath and joined"} the ${e.name} as ${/^[AEIOU]/.test(s.t) ? "an" : "a"} ${s.t} for ${usd(s.monthly)} a month. My enlistment runs ${e.term} years.`,
                ));
          };
        if (state.job && !state.job.mil1800 && !n)
          return iosConfirm(
            "Confirm",
            `Joining the ${e.name} means leaving your job as ${state.job.t}. Continue?`,
            () => {
              say(`I quit my job as ${state.job.t}.`), (state.job = null), i();
            },
          );
        state.job && n && (say(`I had to leave my job as ${state.job.t}.`), (state.job = null)), i();
      }
      function mil1800Recruit(e) {
        const t = state.city || (COUNTRIES[state.country] || [, "town"])[1],
          a = (a) => {
            if ("m" !== PG())
              return notice("Turned away", `The ${e.name} only enlists men in ${yearNow()}.`, null, !0);
            let o = !1;
            if (state.age < e.min) {
              if (!(e.boy && !a && state.age >= 14))
                return notice(
                  "Too young",
                  `The ${e.name} won't take recruits younger than ${e.min}.`,
                  null,
                  !0,
                );
              o = !0;
            }
            if (state.age > e.max)
              return notice("Too old", `The ${e.name} doesn't enlist men older than ${e.max}.`, null, !0);
            if (a && !hasUni() && !((state.respect ?? 0) >= 65 && "rich" === state.famClass))
              return notice(
                "No commission",
                `Commissions go to ${/navy|csn/.test(e.k) ? "Naval Academy" : "West Point"} graduates, university men, or gentlemen with powerful friends. You need a university degree or high standing.`,
                null,
                !0,
              );
            if (
              (say(`I went to a recruiting office in ${t} to join the ${e.name}.`),
              state.stats.Health < 40 || (state.stats.Health < 60 && chance(0.4)))
            )
              return (
                say("The army surgeon examined me and found me unfit for service."),
                notice(
                  "Failed the physical",
                  "The surgeon examined you and found you unfit for service.",
                  null,
                  !0,
                  `<table class="nt"><tr><td><b>Health:</b> ${state.stats.Health}%</td></tr></table>`,
                )
              );
            if (state.felony || (state.record || 0) > 1)
              return (
                say(`The ${e.name} turned me away because of my criminal record.`),
                notice(
                  "Rejected",
                  "The recruiting officer refused to enlist a man with a criminal record.",
                  null,
                  !0,
                )
              );
            if ((state.respect ?? 40) < 15 && chance(0.5))
              return (
                say("The recruiter had heard about my reputation and turned me away."),
                notice(
                  "Rejected",
                  "The recruiter had heard about your reputation and sent you away.",
                  null,
                  !0,
                )
              );
            jCard({
              tag: "Military",
              iconSrc: e.ico,
              title: a ? "Commission Granted" : "Fit for Service",
              close: !0,
              lead: a
                ? `Your commission in the ${e.name} has been approved. Raise your right hand and swear the officer's oath.`
                : `You passed the physical examination${o ? " and will train as a naval apprentice" : ""}. Raise your right hand and swear the oath of enlistment. You'll serve for ${e.term} years.`,
              choices: [
                [
                  "Take the oath",
                  () =>
                    e.assign.length > 1 && !a
                      ? jCard({
                          tag: "Military",
                          iconSrc: e.ico,
                          title: "Assignment",
                          lead: "Where would you like to serve?",
                          choices: e.assign.map((t) => [
                            o && "Engine room" === t ? `${t} (when older)` : t,
                            () => mil1800Join(e, a, o && "Engine room" === t ? "Deck" : t, o),
                          ]),
                        })
                      : mil1800Join(e, a, e.assign[0], o),
                ],
                ["Walk away", () => say("I walked out of the recruiting office before taking the oath.")],
              ],
            });
          };
        jCard({
          tag: "Military",
          iconSrc: e.ico,
          title: e.name,
          close: !0,
          lead: `You visit a recruiting office in ${t} to enlist in the ${e.name}. The recruiting sergeant asks whether you are prepared to undergo a physical examination.<br><br>What will you do?`,
          choices: [
            ["Take the examination", () => a(!1)],
            [
              "Ask about military pay",
              () =>
                notice(
                  `${e.name} Pay`,
                  "Monthly pay, plus food, clothing and lodging. Equipment and other deductions come out of your wages.",
                  () => mil1800Recruit(e),
                  !0,
                  `<table class="nt">${[...e.en, ...(e.eng || []).slice(0, 2), ...e.off.slice(0, 3)].map(([e, t]) => `<tr><td><b>${e}:</b> ${usd(t)} a month</td></tr>`).join("")}</table>`,
                ),
            ],
            ["Apply for a commission", () => a(!0)],
            ["Change my mind", () => say(`I changed my mind about joining the ${e.name}.`), "gray"],
          ],
        });
      }
