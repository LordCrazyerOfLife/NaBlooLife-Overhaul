      const academics = () => (state.academics ||= { studyYears: 0, clubYears: 0, history: [] });
      function recordSchool(e) {
        academics().history.push({
          level: e.level,
          school: e.name,
          grades: e.grades,
          endAge: state.age,
          college: !!e.college,
          major: e.major || null,
        });
      }
      const effortBonus = () =>
        Math.min(0.08, 0.01 * academics().studyYears) + Math.min(0.1, 0.02 * academics().clubYears);
      function meritScholarship(e) {
        const t = academics();
        if (t.scholarshipRolled) return;
        t.scholarshipRolled = !0;
        const a = Math.min(
          0.6,
          Math.max(0, (e.grades - 75) / 100) +
            Math.min(0.15, 0.03 * t.clubYears) +
            Math.min(0.1, 0.015 * t.studyYears),
        );
        e.grades >= 70 &&
          chance(a) &&
          ((state.scholarship = !0),
          (t.meritScholarship = !0),
          say("I earned an academic scholarship for university!"),
          queuePopup(() =>
            eduCard({
              icon: "1f393",
              title: "Scholarship",
              lead: "Your grades and hard work earned you an academic scholarship! It will cover your university tuition.",
              rows: [
                ["Final Grades", `${e.grades}%`],
                ["Extracurricular Years", t.clubYears],
                ["Years Studying Harder", t.studyYears],
              ],
            }),
          ));
      }
      const UNI_WORDS = [
          "State University",
          "University",
          "College",
          "Institute of Technology",
          "Polytechnic University",
        ],
        MAJORS = [
          "Biology",
          "Business",
          "Chemistry",
          "Computer Science",
          "Economics",
          "Engineering",
          "English",
          "History",
          "Mathematics",
          "Nursing",
          "Philosophy",
          "Physics",
          "Political Science",
          "Psychology",
          "Sociology",
          "Graphic Design",
          "Journalism",
          "Music",
          "Theater",
          "Criminal Justice",
          "Religious Studies",
          "Theology",
        ];
      function graduationCard() {
        if (state.dead || state.prison || state.uni) return;
        const e = [];
        state.goldenDiploma ||
          e.push([
            "Golden diploma",
            () => {
              (state.goldenDiploma = !0),
                (state.stats.Smarts = 100),
                renderStats(),
                play("achievement"),
                say("I received a golden diploma!"),
                notice(
                  "Golden diploma",
                  "You received a golden diploma! Your Smarts are now maxed out.",
                  () => whenClear(graduationCard),
                  !0,
                  '<img src="school/golden-diploma.png" alt="" style="width:64px;height:64px;margin-top:14px">',
                );
            },
            "gold",
          ]),
          e.push(
            ["Apply to university", applyUniversity],
            [
              "Look for a job",
              () => {
                say("I decided to look for a job."), screen.classList.add("open"), openOccupation();
              },
            ],
            [
              "Take some time off",
              () => {
                (state.stats.Happiness = clamp(state.stats.Happiness + rint(3, 8))),
                  renderStats(),
                  say("I decided to take some time off after high school."),
                  notice(
                    "Time off",
                    "You decided to take some time off to figure out what to do next.",
                    null,
                    !0,
                  );
              },
            ],
          ),
          jCard({
            tag: "Education",
            iconSrc: "school/grad-cap.png",
            title: "Graduation",
            surprise: !0,
            lead: "You graduated from high school.<br><br>What will you do now?",
            choices: e,
          });
      }
      function applyUniversity() {
        return uniCard();
      }
      function applyUniversityOld() {
        const e = `${chance(0.5) ? any(SCHOOL_WORDS) : any(LAST)} ${any(UNI_WORDS)}`,
          t = any(MAJORS),
          a = Math.max(0.15, Math.min(0.97, (state.stats.Smarts + (state.goldenDiploma ? 60 : 0)) / 110));
        if ((say(`I applied to ${e}.`), !chance(a)))
          return (
            say(`I was rejected by ${e}.`),
            notice("Rejected", `Your application to ${e} was rejected.`, () => whenClear(graduationCard), !0)
          );
        const o = 1e3 * rint(15, 45),
          n = aliveParents().filter((e) => e.rel >= 40);
        jCard({
          tag: "Education",
          iconSrc: "school/grad-cap.png",
          title: "Accepted!",
          lead: `You were accepted to ${e}!<br><br>How will you pay for your education?`,
          rows: [
            ["University", e],
            ["Major", t],
            ["Tuition", `${usd(o)}/yr`],
          ],
          choices: [
            [
              "Ask my parents to pay",
              () => {
                if (n.length && chance(0.65))
                  return (
                    say(`My parents agreed to pay for my education at ${e}.`),
                    enroll(e, t, "Your parents agreed to pay your tuition!")
                  );
                say("My parents refused to pay for my education."),
                  notice(
                    "No way",
                    "Your parents refused to pay for your education.",
                    () => applyUniversity.pay(e, t, o),
                    !0,
                  );
              },
            ],
            [
              "Take out student loans",
              () => {
                say(`I took out ${usd(4 * o)} in student loans.`),
                  enroll(e, t, `You took out ${usd(4 * o)} in student loans.`);
              },
            ],
            [
              "Pay for it myself",
              () => {
                if (state.money < 4 * o)
                  return notice(
                    "Flat broke",
                    "You don't have enough money to pay for university yourself.",
                    () => applyUniversity.pay(e, t, o),
                    !0,
                    brokeRows(4 * o),
                  );
                (state.money -= 4 * o),
                  renderStats(),
                  chaChing(),
                  enroll(e, t, `You paid ${usd(4 * o)} for university yourself.`);
              },
            ],
          ],
        });
      }
      function enroll(e, t, a) {
        (state.uni = { name: e, major: t, start: state.age }),
          say(`I started studying ${t} at ${e}.`),
          renderAvatar(),
          notice("University", `${a}<br><br>You are now studying ${t} at ${e}.`, null, !0);
      }
      applyUniversity.pay = (e, t, a) =>
        jCard({
          tag: "Education",
          iconSrc: "school/grad-cap.png",
          title: "Tuition",
          lead: `How will you pay for ${e}?`,
          rows: [["Tuition", `${usd(a)}/yr`]],
          choices: [
            [
              "Take out student loans",
              () => {
                say(`I took out ${usd(4 * a)} in student loans.`),
                  enroll(e, t, `You took out ${usd(4 * a)} in student loans.`);
              },
            ],
            [
              "Never mind",
              () => {
                say(`I decided not to go to ${e}.`);
              },
            ],
          ],
        });
      const EDU_PROGS = {
          cc: {
            name: "Community College",
            ico: "college",
            sub: "Take some local classes",
            years: 2,
            cost: 0,
            verb: "Enroll in community college today!",
          },
          uni: {
            name: "University",
            ico: "university",
            sub: "Get a college degree",
            years: 4,
            major: !0,
            verb: "Apply to university today!",
            tuition: [15, 45],
          },
          grad: {
            name: "Graduate School",
            ico: "grad-cap",
            sub: "Continue your university focus",
            years: 2,
            needsUni: !0,
            verb: "Apply to graduate school today!",
            tuition: [20, 50],
            degree: "Master's Degree",
          },
          business: {
            name: "Business School",
            ico: "business",
            sub: "Study to be a business leader",
            years: 2,
            needsUni: !0,
            verb: "Apply to business school today!",
            tuition: [40, 75],
            degree: "MBA",
          },
          dental: {
            name: "Dental School",
            ico: "dental",
            sub: "Study to be a dentist",
            years: 4,
            needsUni: !0,
            verb: "Apply to dental school today!",
            tuition: [45, 80],
            degree: "Dental Degree",
          },
          law: {
            name: "Law School",
            ico: "law",
            sub: "Study to be a lawyer",
            years: 3,
            needsUni: !0,
            verb: "Apply to law school today!",
            tuition: [40, 70],
            degree: "Law Degree",
          },
          medical: {
            name: "Medical School",
            ico: "medical",
            sub: "Study to be a doctor",
            years: 4,
            needsUni: !0,
            verb: "Apply to medical school today!",
            tuition: [50, 90],
            degree: "Medical Degree",
          },
          nursing: {
            name: "Nursing School",
            ico: "nursing",
            sub: "Study to be a nurse",
            years: 2,
            needsUni: !0,
            verb: "Apply to nursing school today!",
            tuition: [20, 40],
            degree: "Nursing Degree",
          },
          pharmacy: {
            name: "Pharmacy School",
            ico: "pharmacy",
            sub: "Study to be a pharmacist",
            years: 4,
            needsUni: !0,
            verb: "Apply to pharmacy school today!",
            tuition: [35, 60],
            degree: "Pharmacy Degree",
          },
          vet: {
            name: "Veterinary School",
            ico: "vet",
            sub: "Study to be a veterinarian",
            years: 4,
            needsUni: !0,
            verb: "Apply to veterinary school today!",
            tuition: [35, 65],
            degree: "Veterinary Degree",
          },
          normal: {
            name: "Teacher Training",
            ico: "college",
            sub: "Train to be a schoolteacher",
            years: 2,
            era: !0,
            verb: "Train to be a teacher!",
            degree: "Teaching Certificate",
          },
        },
        UNI_MAJORS = [
          "Finance",
          "Accounting",
          "Marketing",
          "Mathematics",
          "Communications",
          "Information Systems",
          "Nursing",
          "Graphic Design",
          "Psychology",
          "Biology",
          "Chemistry",
          "Computer Science",
          "Criminal Justice",
          "Economics",
          "Education",
          "Engineering",
          "English",
          "Film",
          "History",
          "Journalism",
          "Music",
          "Philosophy",
          "Physics",
          "Political Science",
          "Sociology",
          "Theater",
          "Dance",
          "Art",
          "Architecture",
          "Business",
          "Religious Studies",
          "Theology",
        ],
        degrees = () => (state.degrees ||= state.degree ? [{ prog: "uni", major: state.degree }] : []),
        hasUni = () => degrees().some((e) => "uni" === e.prog) || !!state.degree,
        COLLEGE_WORDS = [
          "Community College",
          "State University",
          "University",
          "College",
          "Institute of Technology",
          "Polytechnic University",
        ];
      function newCollege(e, t, a) {
        const o = EDU_PROGS[e],
          n = chance(0.5) ? any(SCHOOL_WORDS) : any(LAST),
          s = (e, t = chance(0.5) ? "m" : "f") => {
            const a = schoolPerson(rint(30, 68), t);
            return {
              ...a,
              role: e,
              rel: rint(40, 90),
              title: `${"Dean" === e || chance(0.5) ? "Dr." : "Professor"} ${a.last}`,
            };
          },
          r = {
            college: !0,
            prog: e,
            major: t || null,
            name:
              a ||
              ("cc" === e
                ? `${n} Community College`
                : "uni" === e
                  ? `${n} ${any(COLLEGE_WORDS.slice(1))}`
                  : `${n} ${o.name}`),
            type: "Public",
            level: o.name,
            start: state.age,
            years: o.years,
            schedule: "Full-Time",
            grades: rint(35, 75),
            popularity: rint(10, 45),
            stress: rint(20, 45),
            studied: 0,
            skipped: 0,
            faculty: [s("Professor"), s("Professor"), s("Teaching Assistant"), s("Dean")],
            classmates: Array.from({ length: rint(10, 14) }, () => schoolPerson(state.age + rint(-1, 3))),
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
      const cantEnroll = (e) =>
          state.school && state.school.college
            ? `You're already enrolled in ${state.school.level.toLowerCase()}.`
            : state.school || state.age < 17
              ? "You need to finish high school first."
              : state.graduated || state.goldenDiploma
                ? e.needsUni && !hasUni()
                  ? "You need a university degree first."
                  : ""
                : "You need a high school diploma to do that.",
        UNIS_1800 = {
          us: [
            ["Harvard University", 1800, 90, 200, null, 72],
            ["Yale College", 1800, 45, 150, null, 70],
            ["Princeton (College of New Jersey)", 1800, 40, 120, null, 66],
            ["University of Pennsylvania", 1800, 50, 150, null, 62],
            ["University of Virginia", 1825, 75, 140, null, 58],
            ["New York University", 1832, 50, 130, null, 52],
            ["Oberlin College", 1833, 20, 90, 1837, 42],
            ["University of Michigan", 1837, 10, 75, 1870, 48],
            ["Massachusetts Institute of Technology", 1865, 100, 200, 1870, 68],
            ["Cornell University", 1868, 30, 150, 1872, 56],
            ["Johns Hopkins University", 1876, 75, 200, null, 72],
            ["Stanford University", 1891, 0, 0, 1891, 58],
          ],
          gb: [
            ["University of Oxford", 1800, 80, 250, 1920, 74],
            ["University of Cambridge", 1800, 80, 250, 1948, 74],
            ["University of Edinburgh", 1800, 10, 40, 1892, 58],
            ["University of Glasgow", 1800, 4, 20, 1892, 48],
            ["University of St Andrews", 1800, 5, 30, 1892, 50],
            ["University College London", 1828, 15, 50, 1878, 54],
            ["King's College London", 1831, 20, 60, 1878, 54],
            ["Durham University", 1832, 30, 90, 1895, 52],
          ],
          ie: [["Trinity College Dublin", 1800, 20, 80, 1904, 62]],
        },
        UNI_NO_DEGREE = { "University of Oxford": 1920, "University of Cambridge": 1948 },
        SUBJECTS_1800 = [
          ["Medicine", 4, 1.3, 1800, "Physician, Surgeon"],
          ["Law", 3, 1.1, 1800, "Lawyer"],
          ["Theology", 4, 0.7, 1800, "Clergyman, Priest"],
          ["Engineering", 4, 1.15, 1824, "Civil Engineer, Surveyor"],
          ["Natural Philosophy", 4, 1, 1800, "Scientist, Lecturer"],
          ["Mathematics", 4, 0.9, 1800, "Surveyor, Lecturer"],
          ["Literature", 4, 0.8, 1800, "Tutor, Lecturer, Schoolteacher"],
          ["Philosophy", 4, 0.9, 1800, "Professor, Lecturer"],
          ["History", 4, 0.85, 1800, "Historian, Schoolteacher"],
          ["Agriculture", 3, 0.65, 1855, "Agricultural Specialist"],
          ["Chemistry", 4, 1.1, 1800, "Chemist, Pharmacist, Scientist"],
          ["Architecture", 4, 1, 1865, "Architect"],
          ["Dentistry", 3, 1, 1840, "Dentist"],
          ["Pharmacy", 3, 0.75, 1821, "Pharmacist"],
          ["Classical Studies", 4, 0.8, 1800, "Tutor, Professor"],
          ["Veterinary Medicine", 4, 0.9, 1800, "Veterinary Surgeon"],
        ].map(([e, t, a, o, n]) => ({ name: e, years: t, k: a, from: o, jobs: n })),
        APPRENTICESHIPS = [
          ["Blacksmith", "emoji/1f528.png", 12, 16, 4, "Forge"],
          ["Carpenter", "job-emoji/hammer.png", 12, 16, 4, "Workshop"],
          ["Tailor", "emoji/2702-fe0f.png", 12, 16, 4, "Tailoring Shop"],
          ["Cobbler", "emoji/1f9f5.png", 12, 16, 3, "Boot Shop"],
          ["Printer", "emoji/1f4f0.png", 13, 17, 5, "Print Works"],
          ["Baker", "job-emoji/croissant.png", 12, 16, 3, "Bakery"],
          ["Midwife", "freelife/apple/1f469-200d-2695-fe0f.png", 16, 30, 2, "Parish", "f"],
        ].map(([e, t, a, o, n, s, r]) => ({ t: e, ico: t, lo: a, hi: o, years: n, shop: s, g: r })),
        yearNow = () => state.birthYear + state.age;
      function unisHere() {
        const e = yearNow();
        return (
          UNIS_1800[state.country] || [
            [`University of ${(COUNTRIES[state.country] || [, "the Capital"])[1]}`, 1800, 10, 40, 1880, 52],
          ]
        )
          .filter((t) => e >= t[1])
          .map(([t, a, o, n, s, r]) => ({
            name: t,
            from: a,
            women: s,
            prestige: r,
            cost: Math.round(o + (n - o) * Math.max(0, Math.min(1, (e - 1800) / 100))),
          }));
      }
      const subjectsNow = () => SUBJECTS_1800.filter((e) => yearNow() >= e.from),
        subjectCost = (e, t) => (e.cost ? Math.max(1, Math.round(e.cost * t.k)) : 0),
        hasSubject = (e) => degrees().some((t) => "uni" === t.prog && e.includes(t.major)),
        trained = (e) => (state.trained || []).includes(e),
        uniBlock = (e) =>
          "f" !== PG()
            ? ""
            : UNI_NO_DEGREE[e.name] && yearNow() < UNI_NO_DEGREE[e.name]
              ? `${e.name.replace(/^University of /, "")} won't award degrees to women until ${UNI_NO_DEGREE[e.name]}.`
              : !e.women || yearNow() < e.women
                ? e.women
                  ? `${e.name} doesn't admit women until ${e.women}.`
                  : `${e.name} doesn't admit women.`
                : "";
      function oldReqWhy(e) {
        const t = e.req;
        return t
          ? t.deg && !hasSubject(t.deg)
            ? `To work as ${/^[AEIOU]/.test(e.t) ? "an" : "a"} ${e.t.toLowerCase()} you need a university degree in ${t.deg.length > 2 ? "an academic subject" : t.deg.join(" or ")}. Apply through Occupation → Education.`
            : !t.teach || degrees().some((e) => "normal" === e.prog) || hasUni()
              ? t.horse && !hasHorse(t.horse)
                ? "ride" === t.horse
                  ? `You can't work as ${/^[AEIOU]/.test(e.t) ? "an" : "a"} ${e.t.toLowerCase()} without a riding horse. Buy one at the horse market.`
                  : "You can't farm without a workhorse to pull the plow. Buy a draft horse, mustang or Morgan at the horse market."
                : t.pick && !hasPick()
                  ? "No mining company hires a miner who turns up without a pickaxe. Buy one under Activities → Mining & Prospecting."
                  : t.appr && !trained(t.appr)
                    ? `Nobody hires ${/^[AEIOU]/.test(t.appr) ? "an" : "a"} ${t.appr.toLowerCase()} who hasn't served an apprenticeship. Find a master under Occupation → Education.`
                    : ""
              : "Schools only hire teachers who finished teacher training or hold a university degree. Look under Occupation → Education."
          : "";
      }
      function openEducation1800() {
        (sTitle.textContent = "EDUCATION"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openOccupation);
        const e = unisHere(),
          t = (COUNTRIES[state.country] || ["your country"])[0],
          a = state.appr,
          o = [
            ...degrees()
              .filter((e) => "uni" === e.prog)
              .map((e) => `${e.major} degree`),
            ...(degrees().some((e) => "normal" === e.prog) ? ["Teaching certificate"] : []),
            ...(state.trained || []).map((e) => `${e} apprenticeship`),
          ];
        (sList.innerHTML =
          (o.length
            ? `<div class="sec">Your Qualifications</div><div class="row"><img src="emoji/1f393.png" alt=""><div class="t"><b>${o.join(", ")}</b><span>Completed</span></div></div>`
            : "") +
          `<div class="sec">Universities in ${t} · ${yearNow()}</div>` +
          e
            .map((e, t) => {
              const a = uniBlock(e);
              return `<div class="row${a ? " dis" : ""}" data-uni="${t}"><img src="edu/university.png" alt=""><div class="t"><b>${e.name}</b><span>${a || `${e.cost ? `From ${usd(e.cost)} a year` : "No tuition"} · since ${1800 === Math.max(e.from, 1800) ? "before 1800" : e.from}`}</span></div>${a ? "" : DOTS}</div>`;
            })
            .join("") +
          `<div class="sec">Teacher Training</div><div class="row" data-normal="1"><img src="edu/college.png" alt=""><div class="t"><b>${"us" === state.country ? "Normal School" : "Teacher Training College"}</b><span>${yearNow() < 1839 ? "Opens in 1839" : `2 years · ${usd(teachCost())} a year · qualifies you to teach`}</span></div>${yearNow() < 1839 ? "" : DOTS}</div><div class="sec">Apprenticeships</div>` +
          APPRENTICESHIPS.map((e, t) => {
            const o = trained(e.t),
              n = a && a.trade === e.t;
            return `<div class="row${o ? " dis" : ""}" data-appr="${t}"><img src="${e.ico}" alt=""><div class="t"><b>${e.t}</b><span>${o ? "Completed" : n ? `In progress · ${e.years - (state.age - a.start)} year${e.years - (state.age - a.start) == 1 ? "" : "s"} left` : `Ages ${e.lo}–${e.hi}${"f" === e.g ? ", women only" : ""} · ${e.years} years`}</span></div>${o || n ? "" : DOTS}</div>`;
          }).join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-uni]").forEach(
            (t) =>
              (t.onclick = () => {
                play("choice");
                const a = e[+t.dataset.uni],
                  o = uniBlock(a);
                if (o) return notice(a.name, o, null, !0);
                uniApply1800(a);
              }),
          );
        const n = sList.querySelector("[data-normal]");
        n &&
          (n.onclick = () => {
            play("choice"), teacherTraining();
          }),
          sList.querySelectorAll("[data-appr]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), apprenticeCard(APPRENTICESHIPS[+e.dataset.appr]);
              }),
          ),
          screen.classList.add("open");
      }
      const teachCost = () => ("us" === state.country ? 5 : 2),
        eduBusy = () =>
          state.school && state.school.college
            ? `You're already studying at ${state.school.name}.`
            : state.appr
              ? `You're in the middle of a ${state.appr.trade.toLowerCase()} apprenticeship.`
              : "";
      function uniApply1800(e) {
        const t = eduBusy();
        if (t) return notice(e.name, t, null, !0);
        if (state.age < 15)
          return notice(e.name, "You must be at least 15 to apply to university.", null, !0);
        const a = subjectsNow();
        eduSelectCard({
          ico: "edu/university.png",
          title: e.name,
          lead: `Apply to ${e.name}! Fees depend on the subject.`,
          selects: [
            [
              "Pick your subject:",
              a.map(
                (t) =>
                  `${t.name} · ${t.years} yrs · ${e.cost ? `${usd(subjectCost(e, t))}/yr` : "free"} → ${t.jobs}`,
              ),
            ],
          ],
          btn: "Apply",
          go: (t) => {
            const o = a[t],
              n = subjectCost(e, o),
              s = state.famClass || "poor";
            say(`I applied to ${e.name} to study ${o.name}.`);
            const r = Math.max(
              0.05,
              Math.min(
                0.95,
                0.5 +
                  (state.stats.Smarts - e.prestige) / 50 +
                  ("rich" === s ? 0.12 : "middle" === s ? 0.04 : -0.06) +
                  ((state.respect ?? 40) - 40) / 400,
              ),
            );
            if (!chance(r))
              return (
                say(`I was rejected by ${e.name}.`),
                notice(
                  "Rejected",
                  `${e.name} rejected your application to study ${o.name}.${state.stats.Smarts < e.prestige ? "<br><br>The examiners thought you weren't learned enough." : ""}`,
                  null,
                  !0,
                )
              );
            payFor1800({
              name: e.name,
              prog: "uni",
              major: o.name,
              years: o.years,
              cost: n,
              title: "Accepted!",
              lead: `${e.name} accepted you to study ${o.name}!`,
            });
          },
        });
      }
      function teacherTraining() {
        const e = eduBusy();
        if (e) return notice("Teacher Training", e, null, !0);
        if (yearNow() < 1839)
          return notice(
            "Teacher Training",
            "There are no teacher-training schools yet. The first opens in 1839.",
            null,
            !0,
          );
        if (state.age < 15)
          return notice("Teacher Training", "You must be at least 15 to train as a teacher.", null, !0);
        const t =
          "us" === state.country
            ? `${any(LAST)} State Normal School`
            : `${any(LAST)} Teacher Training College`;
        payFor1800({
          name: t,
          prog: "normal",
          major: null,
          years: 2,
          cost: teachCost(),
          title: "Teacher Training",
          lead: `${t} has a place for you. Two years of training will qualify you to teach.`,
        });
      }
      function payFor1800({ name: e, prog: t, major: a, years: o, cost: n, title: s, lead: r }) {
        const i = aliveParents().filter(
            (e) => e.rel >= 30 && profileOf(e, e.ageAtBirth + state.age).money >= n * o,
          ),
          l = (s, r) => {
            state.school && !state.school.college && say(`I left ${state.school.name} early to go to ${e}.`),
              enrollCollege(t, a, r, e);
            const i = state.school;
            i &&
              ((i.years = o),
              (i.fee = n),
              (i.payer = s),
              (i.era1800 = !0),
              "normal" === t && (i.level = "Teacher Training"));
          },
          c = [];
        n || c.push(["Enroll (no tuition)", () => l("free", `${e} charges no tuition.`)]),
          n &&
            state.stats.Smarts >= 85 &&
            c.push([
              "Apply for a scholarship",
              () =>
                chance(0.45)
                  ? (say(`I won a scholarship to ${e}.`),
                    l("free", "You won a scholarship! Your fees are paid."))
                  : notice(
                      "No scholarship",
                      "The scholarship went to someone else.",
                      () => payFor1800({ name: e, prog: t, major: a, years: o, cost: n, title: s, lead: r }),
                      !0,
                    ),
            ]),
          n &&
            "Theology" === a &&
            (state.respect ?? 0) >= 55 &&
            c.push([
              "Ask the church to sponsor me",
              () => {
                say(`The church agreed to sponsor my studies at ${e}.`),
                  l("free", "The church will pay your fees in return for your service.");
              },
            ]),
          n &&
            i.length &&
            c.push([
              "Ask my family to pay",
              () => {
                const c = i.sort((e, t) => t.prof.money - e.prof.money)[0];
                chance("rich" === state.famClass ? 0.9 : 0.55)
                  ? ((c.prof.money -= n),
                    say(`My family agreed to pay for my studies at ${e}.`),
                    l("family", "Your family agreed to pay your fees each year."))
                  : notice(
                      "No",
                      "Your family refused to pay.",
                      () => payFor1800({ name: e, prog: t, major: a, years: o, cost: n, title: s, lead: r }),
                      !0,
                    );
              },
            ]),
          n &&
            c.push([
              `Pay it myself (${usd(n)} a year)`,
              () => {
                if (state.money < n)
                  return notice(
                    "Not enough money",
                    `The first year costs ${usd(n)}. You have ${usd(state.money)}.`,
                    null,
                    !0,
                  );
                (state.money -= n),
                  renderStats(),
                  l("self", `You paid the first year's fees of ${usd(n)}. You'll pay each year after.`);
              },
            ]),
          c.push(["Never mind", () => say(`I decided not to go to ${e}.`), "gray"]),
          jCard({
            tag: "Education",
            iconSrc: "normal" === t ? "edu/college.png" : "edu/university.png",
            title: s,
            lead: r,
            rows: [
              ["School", e],
              ...(a ? [["Subject", a]] : []),
              ["Length", `${o} years`],
              ["Fees", n ? `${usd(n)} a year` : "None"],
            ],
            choices: c,
          });
      }
      function apprenticeCard(e) {
        if (trained(e.t))
          return notice(e.t, `You've already finished your ${e.t.toLowerCase()} apprenticeship.`, null, !0);
        if (state.appr)
          return notice(
            e.t,
            `You're already apprenticed as ${/^[AEIOU]/.test(state.appr.trade) ? "an" : "a"} ${state.appr.trade.toLowerCase()}.`,
            null,
            !0,
          );
        if (state.school && state.school.college)
          return notice(e.t, `You're studying at ${state.school.name}.`, null, !0);
        if (e.g && PG() !== e.g)
          return notice(e.t, "Only women are taken on as apprentice midwives.", null, !0);
        if (state.age < e.lo || state.age > e.hi)
          return notice(
            e.t,
            `Masters only take on ${e.t.toLowerCase()} apprentices aged ${e.lo} to ${e.hi}.`,
            null,
            !0,
          );
        const t = `${uname(e.g || "m")} ${ulast(state.country)}`,
          a = eraCash("rich" === state.famClass ? 30 : "middle" === state.famClass ? 15 : 5),
          o = "Midwife" === e.t ? `under ${t}` : `at ${t.split(" ").pop()}'s ${e.shop}`,
          n = () => {
            state.school &&
              !state.school.college &&
              (say("I left school to become an apprentice."),
              (state.school = null),
              renderJobLine(),
              updateDockTab()),
              hireJob(
                { t: `Apprentice ${e.t}`, c: "Trade", pay: 20, old: !0, img: e.ico },
                "apprentice",
                "Midwife" === e.t ? `${t} (Midwife)` : `${t.split(" ").pop()}'s ${e.shop}`,
              ),
              state.job &&
                state.job.t === `Apprentice ${e.t}` &&
                ((state.appr = { trade: e.t, start: state.age, years: e.years, master: t }),
                say(`I became an apprentice ${e.t.toLowerCase()} ${o}.`));
          },
          s = () => {
            if (state.money >= a) return (state.money = cents(state.money - a)), renderStats(), n();
            const e = aliveParents().find((e) => profileOf(e, e.ageAtBirth + state.age).money >= a);
            return e
              ? ((e.prof.money = cents(e.prof.money - a)),
                say(`My ${e.role.toLowerCase()} paid the premium for my apprenticeship.`),
                n())
              : chance(0.5)
                ? (say(`${t} waived the premium for my apprenticeship.`), n())
                : void notice(
                    "Turned away",
                    `${t} won't take you on without the ${usd(a)} premium.`,
                    null,
                    !0,
                  );
          };
        jCard({
          tag: "Apprenticeship",
          iconSrc: e.ico,
          title: `Apprentice ${e.t}`,
          close: !0,
          lead: `${t} will take you on as an apprentice ${e.t.toLowerCase()}. You'll learn the trade over ${e.years} years for room, board and a tiny wage.`,
          rows: [
            ["Master", t],
            ["Length", `${e.years} years`],
            ["Premium", usd(a)],
            ["Wage", `${usd(eraCash(20))} a year`],
          ],
          choices: [
            [
              "Become an apprentice",
              () =>
                state.job && !state.job.appr
                  ? iosConfirm(
                      "Confirm",
                      `Becoming an apprentice means leaving your job as ${state.job.t}. Continue?`,
                      s,
                    )
                  : s(),
            ],
          ],
        });
      }
      function openEducation() {
        if (isOldEra()) return openEducation1800();
        (sTitle.textContent = "EDUCATION"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openOccupation);
        const e = degrees().some((e) => "cc" === e.prog || "uni" === e.prog) || hasUni(),
          t = (t) => ("cc" === t || "uni" === t ? e : degrees().some((e) => e.prog === t)),
          a = (e, a, o, n) =>
            t(e)
              ? `<div class="row dis" data-ed="${e}"><img src="${a}"><div class="t"><b>${o}</b><span>Already graduated</span></div></div>`
              : `<div class="row" data-ed="${e}"><img src="${a}"><div class="t"><b>${o}</b><span>${n}</span></div>${DOTS}</div>`,
          o = Object.keys(EDU_PROGS);
        (sList.innerHTML =
          (window.POOR ? POOR.gedRow() : "") +
          a("cc", "edu/college.png", "Community College", EDU_PROGS.cc.sub) +
          a("uni", "edu/university.png", "University", EDU_PROGS.uni.sub) +
          a(
            "golden",
            "school/golden-diploma.png",
            "Golden Diploma",
            "Become an overnight expert in the field of your dreams!",
          ) +
          o
            .slice(2)
            .filter((e) => !EDU_PROGS[e].era)
            .map((e) => a(e, `edu/${EDU_PROGS[e].ico}.png`, EDU_PROGS[e].name, EDU_PROGS[e].sub))
            .join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-ed]").forEach(
            (e) =>
              (e.onclick = () => {
                const a = e.dataset.ed;
                if ((play("choice"), "golden" === a)) return goldenDiplomaCard();
                if ("ged" === a) return window.POOR && POOR.gedCard();
                if (t(a))
                  return notice(
                    EDU_PROGS[a].name,
                    "cc" === a || "uni" === a
                      ? "You've already been to college."
                      : `You already graduated from ${EDU_PROGS[a].name.toLowerCase()}.`,
                    null,
                    !0,
                  );
                const o = cantEnroll(EDU_PROGS[a]);
                if (o) return notice(EDU_PROGS[a].name, o, null, !0);
                "cc" === a ? ccCard() : "uni" === a ? uniCard() : gradCard(a);
              }),
          ),
          screen.classList.add("open");
      }
      function eduSelectCard({ ico: e, title: t, lead: a, selects: o, btn: n, go: s }) {
        ev.classList.remove("death18"),
          (ev.innerHTML = `<div class="jcw"><div class="jm-x" id="edX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div><div class="jm-tag" style="margin-top:12px">Education</div>\n      <h4><img src="${e}" alt=""><span>${t}</span></h4><div class="lead">${a}</div>\n      ${o.map(([e, t], a) => `<label class="hr-lab">${e}</label><div class="hr-sel"><select data-sel="${a}">${t.map((e, t) => `<option value="${t}">${e}</option>`).join("")}</select></div>`).join("")}\n      <button class="jm-apply ev-btn" id="edGo">${n}</button></div>`),
          (ev.style.overflow = "visible");
        const r = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("edX").onclick = () => {
          play("dismiss"), r();
        }),
          (document.getElementById("edGo").onclick = () => {
            const e = [...ev.querySelectorAll("[data-sel]")].map((e) => +e.value);
            r(), s(...e);
          }),
          evWrap.classList.add("open");
      }
      function enrollCollege(e, t, a, o) {
        const n = newCollege(e, t, o);
        (state.school = n),
          say(`I enrolled at ${n.name}${t ? ` to study ${t}` : ""}.`),
          renderJobLine(),
          updateDockTab(),
          renderAvatar(),
          screen.classList.remove("open"),
          notice(
            "Scholar",
            `${a ? a + "<br><br>" : ""}You are now enrolled in ${"uni" === e ? `university, studying ${t}` : n.level.toLowerCase()}.`,
            null,
            !0,
          );
      }
      function ccCard() {
        jCard({
          tag: "Education",
          iconSrc: "edu/college.png",
          title: "Community College",
          lead: "Enroll in community college today!",
          close: !0,
          rows: [["Cost", usd(0)]],
          choices: [["Sign me up", () => enrollCollege("cc")]],
        });
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || !isOldEra()) return;
        const e = state.school;
        if (e && e.era1800 && state.age - e.start < e.years && e.fee && "free" !== e.payer) {
          const t =
            "family" === e.payer &&
            aliveParents()
              .map((e) => [e, profileOf(e, e.ageAtBirth + state.age)])
              .sort((e, t) => t[1].money - e[1].money)[0];
          t && t[1].money >= e.fee
            ? (t[1].money -= e.fee)
            : state.money >= e.fee
              ? ("family" === e.payer &&
                  ((e.payer = "self"),
                  say("My family could no longer pay my fees, so I started paying them myself.")),
                (state.money -= e.fee))
              : (say(`I couldn't pay my fees and had to leave ${e.name}.`),
                (state.school = null),
                renderJobLine(),
                updateDockTab(),
                queuePopup(() =>
                  notice(
                    "Left school",
                    `You couldn't afford the ${usd(e.fee)} fees, so you had to leave ${e.name}.`,
                    null,
                    !0,
                  ),
                ));
        }
        const t = state.appr;
        if (t)
          if (state.job && state.job.t === `Apprentice ${t.trade}`) {
            if (state.age - t.start >= t.years) {
              (state.trained ||= []).push(t.trade), (state.appr = null);
              const e = OLD_JOBS.find((e) => e.t === t.trade),
                a = state.job;
              e && ((a.t = e.t), (a.pay = eraCash(e.pay)), (a.icon = e.img), (a.ladder = [e]), (a.appr = !1)),
                say(`I finished my apprenticeship and became a ${t.trade.toLowerCase()}!`),
                (state.respect = clamp((state.respect ?? 40) + 4)),
                queuePopup(() =>
                  notice(
                    "Apprenticeship complete",
                    `You served your time under ${t.master} and are now a qualified ${t.trade.toLowerCase()}.${e ? ` Your wage is now ${usd(eraCash(e.pay))} a year.` : ""}`,
                    null,
                    !0,
                  ),
                );
            }
          } else say(`I gave up my ${t.trade.toLowerCase()} apprenticeship.`), (state.appr = null);
      });
      const accepted = (e, t) => {
        if (null != t && t < 25 && !state.goldenDiploma) return !1;
        const a = null == t ? 0 : (t - 50) / 120;
        return chance(
          Math.max(
            0.08,
            Math.min(
              0.97,
              (state.stats.Smarts + (state.goldenDiploma ? 50 : 0) - e + 40) / 90 + a + effortBonus(),
            ),
          ),
        );
      };
      function payFor(e, t, a, o = { gone: [] }) {
        const n = EDU_PROGS[e],
          s = (o.tuition ||= 1e3 * rint(...n.tuition)),
          r = s * n.years,
          i = aliveParents().filter((e) => e.rel >= 40),
          l = (n) => () => {
            o.gone.push(n), payFor(e, t, a, o);
          },
          c = [];
        "uni" === e &&
          state.scholarship &&
          c.push([
            "Use my scholarship",
            () => {
              (state.scholarship = !1),
                say(`My scholarship paid for my education at ${a}.`),
                enrollCollege(e, t, "Your scholarship covers your tuition!", a);
            },
          ]),
          i.length &&
            state.age < 26 &&
            !o.gone.includes("parents") &&
            c.push([
              "Ask my parents to pay",
              () => {
                if (chance(0.6))
                  return (
                    say(`My parents agreed to pay for my education at ${a}.`),
                    enrollCollege(e, t, "Your parents agreed to pay your tuition!", a)
                  );
                say("My parents refused to pay for my education."),
                  notice("No way", "Your parents refused to pay for your education.", l("parents"), !0);
              },
            ]),
          c.push([
            "Take out student loans",
            () => {
              (state.studentLoans = (state.studentLoans || 0) + r),
                say(`I took out ${usd(r)} in student loans.`),
                enrollCollege(e, t, `You took out ${usd(r)} in student loans.`, a);
            },
          ]),
          o.gone.includes("self") ||
            c.push([
              "Pay for it myself",
              () => {
                if (state.money < r)
                  return notice(
                    "Flat broke",
                    `You can't afford ${n.name.toLowerCase()}.`,
                    l("self"),
                    !0,
                    brokeRows(r),
                  );
                (state.money -= r),
                  renderStats(),
                  enrollCollege(e, t, `You paid ${usd(r)} for ${n.name.toLowerCase()} yourself.`, a);
              },
            ]),
          c.push(["Never mind", () => say(`I decided not to go to ${a}.`)]),
          jCard({
            tag: "Education",
            iconSrc: `edu/${n.ico}.png`,
            title: "Accepted!",
            lead: `You were accepted to ${a}!<br><br>How will you pay for your education?`,
            rows: [[n.name, a], ...(t ? [["Major", t]] : []), ["Tuition", `${usd(s)}/yr`]],
            choices: c,
          });
      }
      function uniCard() {
        if (isOldEra()) return screen.classList.add("open"), openEducation1800();
        const e = cantEnroll(EDU_PROGS.uni);
        if (e) return notice("University", e, null, !0);
        eduSelectCard({
          ico: "edu/university.png",
          title: "University",
          lead: "Apply to university today!",
          selects: [["Pick your major:", UNI_MAJORS]],
          btn: "Apply to university",
          go: (e) => {
            const t = UNI_MAJORS[e],
              a = newCollege("uni", t).name;
            if ((say(`I applied to ${a} to study ${t}.`), !accepted(25, state.hsGrades)))
              return (
                say(`I was rejected by ${a}.`),
                notice(
                  "Rejected",
                  `Your application to ${a} was rejected.${null != state.hsGrades && state.hsGrades < 40 ? "<br><br>Your high school grades were too low." : ""}`,
                  null,
                  !0,
                )
              );
            payFor("uni", t, a);
          },
        });
      }
      function gradCard(e) {
        const t = EDU_PROGS[e],
          a = degrees().find((e) => "uni" === e.prog),
          o = "grad" === e ? (a ? a.major : state.degree) : null;
        jCard({
          tag: "Education",
          iconSrc: `edu/${t.ico}.png`,
          title: t.name,
          close: !0,
          lead: "grad" === e && o ? `Apply to graduate school to continue studying ${o}!` : t.verb,
          rows: [["Length", `${t.years} years`]],
          choices: [
            [
              `Apply to ${t.name.toLowerCase()}`,
              () => {
                const t = newCollege(e, o).name;
                if (
                  (say(`I applied to ${t}.`),
                  !accepted(
                    { medical: 45, law: 40, dental: 40, vet: 35, pharmacy: 35, business: 30 }[e] || 25,
                    state.collegeGrades,
                  ))
                )
                  return (
                    say(`I was rejected by ${t}.`),
                    notice("Rejected", `Your application to ${t} was rejected.`, null, !0)
                  );
                payFor(e, o, t);
              },
            ],
          ],
        });
      }
      function goldenDiplomaCard() {
        const e = Object.keys(EDU_PROGS).filter((e) => !EDU_PROGS[e].era);
        eduSelectCard({
          ico: "school/golden-diploma.png",
          title: "Golden Diploma",
          lead: "Become an overnight expert in the field of your dreams!",
          selects: [
            ["Pick your degree:", e.map((e) => EDU_PROGS[e].name)],
            ["Pick your major:", UNI_MAJORS],
          ],
          btn: "Get my diploma",
          go: (t, a) => {
            const o = e[t],
              n = "uni" === o || "grad" === o ? UNI_MAJORS[a] : null;
            degrees().push({ prog: o, major: n }),
              "uni" !== o || state.degree || (state.degree = n),
              (state.goldenDiploma = !0),
              (state.graduated = !0),
              (state.stats.Smarts = 100),
              renderStats(),
              play("achievement");
            const s = n
              ? `${EDU_PROGS[o].name.toLowerCase()} degree in ${n}`
              : (EDU_PROGS[o].degree || EDU_PROGS[o].name).toLowerCase();
            say(`I received a golden diploma: a ${s}!`),
              notice(
                "Golden diploma",
                `You received a golden diploma! You now have a ${s}.`,
                null,
                !0,
                '<img src="school/golden-diploma.png" alt="" style="width:64px;height:64px;margin-top:14px">',
              );
          },
        });
      }
      function openCollege() {
        const e = state.school;
        if (!e || !e.college) return openOccupation();
        syncProfile(),
          (sTitle.textContent = "SCHOOL"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = X_ICON),
          (sBack.onclick = () => screen.classList.remove("open"));
        const t = (e, t, a, o, n) =>
            `<div class="row" data-cs="${e}"><img src="${t}"><div class="t"><b>${a}</b>${o}</div>${n}</div>`,
          a = `<div class="rel">Stress <i><u style="width:${Math.max(e.stress, 2)}%;background:${e.stress > 60 ? "#b3261e" : e.stress > 40 ? "#f5841f" : "#2fa03b"}"></u></i></div>`;
        (sList.innerHTML =
          t("info", `edu/${EDU_PROGS[e.prog].ico}.png`, e.level, sBar("Grades", e.grades), DOTS) +
          (e.club
            ? t(
                "myclub",
                `xc/${clubBy(e.club.id)[2]}.png`,
                clubBy(e.club.id)[1],
                "<span>View your extracurricular activity</span>",
                DOTS,
              )
            : "") +
          t("schedule", "edu/schedule.png", "Schedule", a, DOTS) +
          t(
            "golden",
            "school/golden-diploma.png",
            "Golden Diploma",
            "<span>Become an overnight expert in the field of your dreams!</span>",
            DOTS,
          ) +
          '<div class="sec">Activities</div>' +
          t("clubs", "xc/soccer.png", "Activities", "<span>Join an extracurricular activity</span>", CHEV) +
          t("class", "edu/pencil.png", "Class", sBar("Popularity", e.popularity), CHEV) +
          t("drop", "edu/drop.png", "Drop Out", `<span>Drop out of ${e.level.toLowerCase()}</span>`, DOTS) +
          t("faculty", "edu/faculty.png", "Faculty", "<span>Interact with your teachers</span>", CHEV) +
          t("nurse", "school/woman-doctor.png", "Nurse", "<span>Visit the school nurse</span>", DOTS) +
          t("skip", "edu/skip.png", "Skip School", "<span>Skip class and do something else</span>", DOTS) +
          t("study", "edu/study.png", "Study Harder", "<span>Put in some extra effort</span>", DOTS)),
          sList.querySelectorAll("[data-cs]").forEach((e) => (e.onclick = () => collegeAction(e.dataset.cs))),
          (sList.scrollTop = 0),
          screen.classList.add("open");
      }
      function collegeAction(e) {
        const t = state.school;
        if (t) {
          if ("class" === e) return openClass();
          if ("faculty" === e) return openFaculty();
          if ("golden" === e) return goldenDiplomaCard();
          if ("clubs" === e) return openClubs();
          if ("myclub" === e) return t.club ? myClubCard() : openCollege();
          if ("schedule" === e) return scheduleCard();
          if ("nurse" === e) return schoolAction("nurse");
          if ("info" === e) return schoolCard();
          if ("study" === e) {
            const e = t.level.toLowerCase();
            return (
              t.studied ||
                ((t.studied = 1),
                (t.grades = clamp(t.grades + rint(3, 9))),
                (t.stress = clamp(t.stress + rint(3, 8))),
                (state.stats.Smarts = clamp(state.stats.Smarts + rint(1, 3))),
                renderStats(),
                say(`I began studying harder for ${e}.`)),
              screen.classList.remove("open"),
              void notice("Nose in the books", `You began studying harder for ${e}.`, null, !0)
            );
          }
          return "skip" === e
            ? skipSchool()
            : "drop" === e
              ? iosConfirm(
                  "Confirm",
                  `Are you sure you want to drop out of ${t.level.toLowerCase()}?`,
                  () => {
                    say(`I dropped out of ${t.name}.`),
                      (state.school = null),
                      renderJobLine(),
                      updateDockTab(),
                      renderAvatar(),
                      notice("Dropped out", `You dropped out of ${t.name}.`, null, !0),
                      openOccupation();
                  },
                )
              : void 0;
        }
      }
      function scheduleCard() {
        const e = state.school;
        jCard({
          tag: "Education",
          iconSrc: "edu/schedule.png",
          title: "Schedule",
          close: !0,
          lead: "Pick your class schedule.",
          rows: [["Current", e.schedule]],
          bars: [["Stress", e.stress, e.stress > 60 ? "#b3261e" : "#2fa03b"]],
          choices: [
            [
              "Full-time student",
              () => {
                "Part-Time" === e.schedule &&
                  (e.years = Math.max(state.age - e.start + 1, Math.round(e.years / 1.5))),
                  (e.schedule = "Full-Time"),
                  say("I switched to a full-time class schedule."),
                  openCollege();
              },
            ],
            [
              "Part-time student",
              () => {
                "Full-Time" === e.schedule && (e.years = Math.round(1.5 * e.years)),
                  (e.schedule = "Part-Time"),
                  (e.stress = clamp(e.stress - 15)),
                  say("I switched to a part-time class schedule."),
                  openCollege();
              },
            ],
          ],
        });
      }
      function collegeYear(e) {
        if (
          ((e.studied = 0),
          (e.skipped = 0),
          (e.grades = clamp(
            Math.round(
              e.grades + 0.2 * (state.stats.Smarts - e.grades) + rint(-6, 6) - (e.stress > 75 ? 5 : 0),
            ),
          )),
          (e.popularity = clamp(Math.round(e.popularity + (state.stats.Looks - 50) / 12 + rint(-6, 6)))),
          (e.stress = clamp(
            Math.round(
              e.stress + ("Full-Time" === e.schedule ? rint(-4, 8) : rint(-10, 2)) + (state.job ? 6 : 0),
            ),
          )),
          e.classmates.forEach((e) => (e.rel = clamp(e.rel + rint(-4, 4)))),
          state.age - e.start < e.years)
        )
          return;
        const t = EDU_PROGS[e.prog];
        if (e.grades < 15 && chance(0.5))
          return say(`I failed my final year at ${e.name} and had to repeat it.`), void e.years++;
        degrees().push({ prog: e.prog, major: e.major }),
          "uni" === e.prog && (state.degree = e.major),
          (state.collegeGrades = e.grades),
          recordSchool(e),
          (state.graduated = !0),
          (state.school = null),
          (state.stats.Smarts = clamp(state.stats.Smarts + rint(3, 8))),
          renderStats(),
          renderJobLine();
        const a = e.major
          ? `a degree in ${e.major}`
          : t.degree
            ? `a ${t.degree.replace(/ Degree$/, " degree")}`
            : "an associate's degree";
        say(`I graduated from ${e.name} with ${a}!`),
          setTimeout(
            () =>
              whenClear(() =>
                jCard({
                  tag: "Education",
                  iconSrc: "edu/grad-cap.png",
                  title: "Graduation",
                  lead: `You graduated from ${e.name} with ${a}!`,
                  rows: [
                    ["School", e.name],
                    ...(e.major ? [["Major", e.major]] : []),
                    ["GPA", (1.6 + e.grades / 40).toFixed(2)],
                  ],
                  ok: () => {},
                }),
              ),
            380,
          );
      }
      (SND.race = new Audio("sounds/a16_sndRace.wav")),
        (SND.casinoWin = new Audio("sounds/a16_sndCasinoWin1.wav")),
        (SND.casinoLose = new Audio("sounds/a16_sndCasinoLose1.wav"));
      const TRACKS = [
          "Dilligent Downs",
          "Churchill Meadows",
          "Saratoga Park",
          "Belmont Fields",
          "Pimlico Run",
          "Santa Anita Oaks",
          "Keeneland Green",
          "Del Mar Downs",
          "Aqueduct Acres",
          "Gulfstream Park",
          "Ascot Heath",
          "Epsom Ridge",
          "Longchamp Lane",
          "Flemington Flats",
          "Royal Randwick",
        ],
        HORSE_NAMES = [
          "Red Rum",
          "Old Sol",
          "Atlas",
          "Phony Pony",
          "Dasher",
          "Seabiscuit",
          "Thunder Hoof",
          "Lucky Strike",
          "Midnight Run",
          "Gallop Poll",
          "Hay Girl",
          "Neigh Sayer",
          "Sir Trots-a-Lot",
          "Mane Event",
          "Usain Colt",
          "Pony Soprano",
          "Secretariat Jr.",
          "Black Beauty",
          "Whinny the Pooh",
          "Hoof Hearted",
          "Nacho Horse",
          "Furious Fred",
          "Silver Bullet",
          "Lightning Bolt",
          "Buttercup",
          "Big Brown",
          "Rocket Man",
          "Clip Clop",
          "Stable Genius",
          "Spirit",
        ],
        LANE_COLORS = ["#e60000", "#f0711f", "#038a1c", "#0b46ff", "#6c0a8d"],
        LANE_Y = [0.17, 0.35, 0.53, 0.705, 0.88],
        ordinal = (e) => e + (["th", "st", "nd", "rd"][e] || "th"),
        HX =
          '<svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg>',
        closeCard = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
      function openHorseRaces() {
        if (state.age < 18) return show("Horse Races", "You must be 18 to go to the horse races.");
        const e = any(TRACKS);
        (ev.innerHTML = `\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px">${HX}</div>\n      <div class="jm-tag" style="margin-top:12px">Leisure</div>\n      <h4><img src="horse/jockey.png"><span>${e}</span></h4>\n      <div class="lead">Go to the horse races today!</div>\n      <table class="hr-one"><tbody><tr><td><b>Admission:</b> $10</td></tr></tbody></table>\n      <button class="jm-apply ev-btn" id="hrGo">Let's go!</button>`),
          (ev.style.overflow = "visible"),
          (document.getElementById("propX").onclick = closeCard),
          (document.getElementById("hrGo").onclick = () => {
            if (state.money < 10)
              return closeCard(), notice("Not enough money", "You can't afford the $10 admission.");
            (state.money -= 10), renderStats(), say(`I went to the horse races at ${e}.`), horseBets(e);
          }),
          evWrap.classList.add("open");
      }
      function horseBets(e) {
        const t = [...HORSE_NAMES].sort(() => Math.random() - 0.5).slice(0, 5),
          a = [10, 50, 100, 250, 500, 1e3, 2500, 5e3, 1e4, 25e3, 5e4, 1e5, 25e4, 5e5, 1e6].filter(
            (e) => e <= state.money,
          );
        (ev.innerHTML = `\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px">${HX}</div>\n      <div class="jm-tag" style="margin-top:12px">Track</div>\n      <h4><img src="horse/face-horse.png"><span>${e}</span></h4>\n      <div class="lead">Place your bets!</div>\n      <table class="hr-one"><tbody><tr><td><b>Bank Balance:</b> ${usd(state.money)}</td></tr></tbody></table>\n      <label class="hr-lab">Pick your horse:</label>\n      <div class="hr-sel"><select id="hrHorse">${t.map((e, t) => `<option value="${t}">${e}</option>`).join("")}</select></div>\n      ${a.length ? `<label class="hr-lab">Bet amount:</label>\n      <div class="hr-sel"><select id="hrAmt">${a.map((e) => `<option value="${e}">${usd(e)}</option>`).join("")}</select></div>\n      <button class="jm-apply ev-btn" id="hrBet">Place bet</button>` : ""}\n      <button class="jm-apply ev-btn" id="hrWatch">I just want to watch</button>`),
          (document.getElementById("propX").onclick = closeCard);
        const o = document.getElementById("hrBet");
        o &&
          (o.onclick = () =>
            horseRace(
              e,
              t,
              +document.getElementById("hrHorse").value,
              +document.getElementById("hrAmt").value,
            )),
          (document.getElementById("hrWatch").onclick = () => horseRace(e, t, -1, 0));
      }
      function horseRace(e, t, a, o) {
        (ev.style.overflow = ""),
          (ev.innerHTML = `\n      <div class="jm-tag" style="margin-top:12px">Track</div>\n      <h4><img src="horse/face-horse.png"><span>${e}</span></h4>\n      <div class="hr-track">${t.map((e, t) => `<i class="hr-trail" style="top:${100 * LANE_Y[t]}%;background:${LANE_COLORS[t]}"></i><img class="hr-horse" src="horse/racehorse${t + 1}.png" style="top:${100 * LANE_Y[t]}%;animation-delay:-${(0.07 * t).toFixed(2)}s">`).join("")}</div>\n      <div class="hr-list">${t.map((e, t) => `<div class="hr-item">${t === a ? '<img class="hr-cash" src="horse/dollar-bill.png">' : ""}<span class="hr-bar" style="background:${LANE_COLORS[t]}">${e}</span><span class="hr-place" data-p="${t}"></span></div>`).join("")}</div>\n      <div class="hr-msg" id="hrMsg">${a >= 0 ? `You have ${usd(o)}<br>riding on ${t[a]} to win.` : "You're just here to watch."}</div>\n      <button class="jm-apply ev-btn hr-green" id="hrStart">Start the race!</button>`),
          a >= 0 && ((state.money -= o), renderStats());
        const n = [...ev.querySelectorAll(".hr-horse")],
          s = [...ev.querySelectorAll(".hr-trail")],
          r = 88.5,
          i = t.map(() => 2.5),
          l = [],
          c = () =>
            n.forEach((e, t) => {
              (e.style.left = i[t] + "%"), (s[t].style.width = Math.max(0, i[t] + 5 - 7) + "%");
            });
        c(),
          (document.getElementById("hrStart").onclick = (e) => {
            e.currentTarget.remove(),
              (SND.race.currentTime = 0),
              SND.race.play().catch(() => {}),
              n.forEach((e) => e.classList.add("run"));
            const s = t.map(() => 0.94 + 0.12 * Math.random()),
              d = t.map(() => 0.3),
              u = t.map(() => 1),
              h = t.map(() => 0),
              p = t.map(() => 0);
            let m = 1 + Math.random(),
              f = 0,
              g = performance.now();
            const y = (e) => {
              const b = Math.min(50, e - g) / 1e3;
              g = e;
              const v = t.map((e, t) => t).filter((e) => !l.includes(e)),
                w = Math.max(...v.map((e) => i[e])),
                k = (w - 2.5) / 86,
                $ = k > 0.72 && !l.length,
                S = b * ($ ? 0.5 : l.length ? 1.6 : 1);
              if (((f += S), f >= m && v.length > 1)) {
                const e = v.filter((e) => i[e] < w - 1 && p[e] <= 0);
                e.length && (p[any(e)] = 0.9 + 0.8 * Math.random()),
                  (m = f + (k > 0.6 ? 0.5 + 0.7 * Math.random() : 1 + 1.3 * Math.random()));
              }
              if (
                (v.forEach((e) => {
                  (h[e] -= S) <= 0 &&
                    ((u[e] = 0.75 + 0.5 * Math.random()), (h[e] = 0.5 + 0.8 * Math.random()));
                  const t = k < 0.7 ? 1 + Math.min(0.35, 0.045 * (w - i[e])) : 1,
                    a = (p[e] > 0 ? 1.65 : u[e]) * t;
                  (d[e] += (a - d[e]) * Math.min(1, 3 * S)),
                    p[e] > 0 && (p[e] -= S),
                    (i[e] = Math.min(r, i[e] + 9.5 * S * s[e] * d[e]));
                  const o =
                    (Math.round((0.5 / Math.max(0.7, d[e]) / ($ ? 0.5 : 1)) * 10) / 10).toFixed(1) + "s";
                  n[e].style.animationDuration !== o && (n[e].style.animationDuration = o),
                    i[e] >= r && (l.push(e), n[e].classList.remove("run"));
                }),
                c(),
                l.length < t.length)
              )
                return setTimeout(() => y(performance.now()), 16);
              !(function () {
                l.forEach((e, t) => {
                  ev.querySelector(`.hr-place[data-p="${e}"]`).innerHTML =
                    0 === t ? '<img src="horse/trophy.png">' : ordinal(t + 1);
                });
                const e = t[l[0]],
                  n = a >= 0 && l[0] === a,
                  s = Math.round(4 * o * (nekoLuck() ? 1.2 : 1)),
                  r = document.getElementById("hrMsg");
                (r.className = "hr-result"),
                  (r.innerHTML =
                    a < 0
                      ? `<img src="horse/trophy.png"><span>${e} Won!</span>`
                      : n
                        ? '<img src="emoji/1f911.png"><span>You Won!</span>'
                        : '<img src="emoji/1f631.png"><span>You Lost!</span>'),
                  a >= 0 &&
                    (((n ? SND.casinoWin : SND.casinoLose).currentTime = 0),
                    (n ? SND.casinoWin : SND.casinoLose).play().catch(() => {}));
                n && (state.money += s);
                a >= 0
                  ? ((state.stats.Happiness = clamp(state.stats.Happiness + (n ? rint(6, 12) : -rint(3, 8)))),
                    say(
                      n
                        ? `I bet ${usd(o)} on ${t[a]} and won ${usd(s)}!`
                        : `I bet ${usd(o)} on ${t[a]} and lost.`,
                    ))
                  : say(`I watched ${e} win the race.`);
                renderStats(),
                  ev.insertAdjacentHTML(
                    "beforeend",
                    '<button class="jm-apply ev-btn hr-green" id="hrDone">Continue</button>',
                  ),
                  (document.getElementById("hrDone").onclick = () => {
                    closeCard(),
                      a < 0 ||
                        (n
                          ? notice(
                              "Winner winner!",
                              `${e} won the race!<br><br>You won ${usd(s)} by betting on ${t[a]}.`,
                            )
                          : notice(
                              any(["Damn horse", "Glue factory", "So close", "Should have known"]),
                              `${e} won the race!<br><br>You lost ${usd(o)} by betting on ${t[a]}.`,
                            ));
                  });
              })();
            };
            setTimeout(() => y(performance.now()), 16);
          });
      }
      SND.thunder = new Audio("sounds/a16_sndThunder.wav");
      const tmSnaps = {},
        snapLife = () => {
          if (!state.dead) {
            try {
              tmSnaps[state.age] = { state: structuredClone(state), log: log.innerHTML };
              for (const e in tmSnaps) +e < state.age - 15 && delete tmSnaps[e];
            } catch (e) {
              console.warn("time machine snapshot failed", e);
            }
            tmBtn.classList.toggle("off", !tmOptions().length);
          }
        },
        tmOptions = () => [1, 3, 5].filter((e) => tmSnaps[state.age - e]),
        tmBtn = document.querySelector(".minus");
