      let bizBack = null;
      function openBusiness() {
        (bizBack = null),
          (sTitle.textContent = "BUSINESS"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const e = bizYear(),
          t = (state.biz ||= []),
          a = slumpAt(e),
          o = bizOpenTypes();
        (sList.innerHTML =
          `<div class="row"><img src="freelife/apple/${a ? "1f4c9" : "1f4c8"}.png" alt=""><div class="t"><b>${a ? `Hard Times · ${cap1(a[2])}` : `Good Times in ${e}`}</b><span>A common laborer earns about ${usd(eraCash(300 * wageIdx(e)))} a year${a ? " · trade is slow and banks are failing" : " · trade is brisk"}</span></div></div>` +
          (t.length
            ? '<div class="sec">Your Businesses</div>' +
              t
                .map(
                  (e, t) =>
                    `<div class="row" data-biz="${t}"><img src="${bizIco(e)}" alt=""><div class="t"><b>${e.name}</b><span>${e.n} ${bizT(e).staff}${e.last ? ` · last year ${e.last.net >= 0 ? "cleared" : "lost"} ${usd(Math.abs(e.last.net))}` : " · just opened"}</span></div>${CHEV}</div>`,
                )
                .join("")
            : "") +
          `<div class="sec">Start or Buy a Business in ${e}</div>` +
          o
            .map(
              (e) =>
                `<div class="row" data-new="${e.id}"><img src="${e.ico}" alt=""><div class="t"><b>${bizName(e)}</b><span>${usd(eraCash(bizBaseU(e)))} · ${e.desc}</span></div>${DOTS}</div>`,
            )
            .join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-biz]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), openBizDetail(t[+e.dataset.biz]);
              }),
          ),
          sList.querySelectorAll("[data-new]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), bizBuy(BIZ[e.dataset.new]);
              }),
          ),
          screen.classList.add("open");
      }
      function bizBuy(e) {
        const t = bizYear(),
          a = eraCash(bizBaseU(e)),
          o = (state.biz ||= []);
        jCard({
          tag: "Business",
          iconSrc: e.ico,
          title: bizName(e),
          close: !0,
          lead: `${e.desc}. You'll have to hire ${e.staff} before it earns a penny.`,
          rows: [
            ["Price", usd(a)],
            ["Workers", `up to ${e.max} ${e.staff}`],
            ["Wages", `${usd(eraCash(e.wage * wageIdx(t)))} a year each`],
            ["Fire Risk", e.fire >= 0.05 ? "High" : e.fire >= 0.03 ? "Moderate" : "Low"],
            ["Strikes", e.strike ? (e.strike >= 0.06 ? "Common" : "Occasional") : "Rare"],
            ["Bank Balance", usd(state.money)],
          ],
          choices: [
            [
              `Buy it (${usd(a)})`,
              () => {
                if (state.age < 18) return notice("Too young", "You must be 18 to own a business.", null, !0);
                if (o.some((t) => t.type === e.id))
                  return notice(
                    "Already own one",
                    `You already own ${bizA(bizName(e))} ${bizName(e).toLowerCase()}.`,
                    null,
                    !0,
                  );
                if (o.length >= 6)
                  return notice("Too many businesses", "You can only run six businesses at once.", null, !0);
                if (state.money < a) return notice("Not enough money", `That costs ${usd(a)}.`, null, !0);
                state.money = cents(state.money - a);
                const n = {
                  type: e.id,
                  name: `${SURNAME} ${bizName(e)}`,
                  n: 0,
                  lvl: 1,
                  pay: "fair",
                  since: t,
                  paid: a,
                  ins: !1,
                };
                "vein" === e.kind && (n.reserve = "gold" === e.id ? rint(2, 22) : rint(8, 35)),
                  "oil" === e.kind &&
                    ((n.dry = chance(0.35)), (n.gusher = !n.dry && chance(0.12)), (n.reserve = rint(3, 14))),
                  o.push(n),
                  (state.respect = clamp((state.respect ?? 40) + (e.cost >= 2e4 ? 6 : 2))),
                  renderStats(),
                  play(
                    /vein|mine|oil/.test(e.kind || "")
                      ? "rockBreak"
                      : /store|jewel|bakery|tailor|dress|photo/.test(e.id)
                        ? "storeBell"
                        : "coins",
                  ),
                  say(
                    `I bought ${bizA(bizName(e))} ${bizName(e).toLowerCase()} for ${usd(a)} and named it ${n.name}.`,
                  );
                const s =
                  "oil" === e.kind
                    ? (n.dry
                        ? "The drill came up dry. There is no oil here, unless you drill deeper."
                        : n.gusher
                          ? "A gusher! Oil sprayed high over the derrick. This well is rich!"
                          : "The drill struck oil. It looks like a steady well.") +
                      ` Hire some ${e.staff} to start pumping.`
                    : `${n.name} is yours. Hire some ${e.staff} to get it running.`;
                notice(
                  "oil" === e.kind
                    ? n.dry
                      ? "Dry hole"
                      : n.gusher
                        ? "Gusher!"
                        : "Oil!"
                    : "You own a business!",
                  s,
                  () => openBizDetail(n),
                  !0,
                );
              },
            ],
          ],
        });
      }
      function openBizDetail(e) {
        if (!(state.biz || []).includes(e)) return openBusiness();
        const t = bizT(e),
          a = bizMax(e),
          o = eraCash(bizWage(e)),
          n = BIZ_PAY[e.pay],
          s = bizValue(e),
          r = eraCash(bizPremU(e));
        (sTitle.textContent = e.name.toUpperCase()),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = bizBack || openBusiness);
        const i = "vein" === t.kind || "oil" === t.kind,
          l = e.dry
            ? "Dry hole"
            : i
              ? e.reserve > 10
                ? "Still rich"
                : e.reserve > 4
                  ? "Thinning out"
                  : e.reserve >= 0
                    ? "Nearly played out"
                    : "Played out"
              : "",
          c = "oil" === t.kind ? "Drill Deeper" : "Sink a New Shaft";
        (sList.innerHTML =
          `<div class="row"><img src="${bizIco(e)}" alt=""><div class="t"><b>${e.name}</b><span>${bizName(t)} · owned since ${e.since}${l ? ` · ${l}` : ""}</span></div></div>` +
          (e.last
            ? `<div class="row" data-b="report"><img src="freelife/apple/${e.last.net >= 0 ? "1f4c8" : "1f4c9"}.png" alt=""><div class="t"><b>Last Year · ${e.last.year}</b><span>${e.last.net >= 0 ? `Cleared ${usd(e.last.net)}` : `Lost ${usd(-e.last.net)}`} after wages and costs</span></div>${CHEV}</div>`
            : "") +
          `<div class="sec">Workers · ${e.n} of ${a}</div>` +
          (e.n
            ? ""
            : `<div class="row dis"><img src="freelife/apple/26a0-fe0f.png" alt=""><div class="t"><b>Nobody is working here</b><span>Hire ${t.staff} or the business earns nothing</span></div></div>`) +
          (e.n
            ? `<div class="row" data-b="crew"><img src="occ/job-coworkers.png" alt=""><div class="t"><b>Workers</b>${sBar("Relationship", e.crew && e.crew.length ? Math.round(e.crew.reduce((e, t) => e + (t.rel ?? 50), 0) / e.crew.length) : 50)}</div>${CHEV}</div>`
            : "") +
          `<div class="row" data-b="hire"><img src="freelife/apple/1f477.png" alt=""><div class="t"><b>Hire ${cap1(t.staff)}</b><span>${usd(o)} a year each at ${n[0].toLowerCase()} pay</span></div>${DOTS}</div>` +
          (e.n
            ? `<div class="row" data-b="let"><img src="freelife/apple/1f6aa.png" alt=""><div class="t"><b>Let Workers Go</b><span>Cut your wage bill</span></div>${DOTS}</div>`
            : "") +
          `<div class="row" data-b="pay"><img src="freelife/apple/1f4b5.png" alt=""><div class="t"><b>Wages · ${n[0]} Pay</b><span>${n[3]}</span></div>${DOTS}</div><div class="sec">Running the Business</div>` +
          `<div class="row" data-b="over"><img src="freelife/apple/1f4cb.png" alt=""><div class="t"><b>Oversee the Business</b><span>${e.over === state.age ? "You already put in the time this year" : "Spend the year keeping a close eye on things"}</span></div>${e.over === state.age ? "" : DOTS}</div>` +
          `<div class="row" data-b="ins"><img src="freelife/apple/1f6e1-fe0f.png" alt=""><div class="t"><b>Fire Insurance</b><span>${e.ins ? `Insured · ${usd(r)} a year` : `Not insured · ${usd(r)} a year to be paid ${usd(cents(0.8 * s))} if it burns`}</span></div>${DOTS}</div>` +
          (e.dry || (i && e.reserve < 0)
            ? `<div class="row" data-b="deep"><img src="${"oil" === t.kind ? "freelife/apple/1f6e2-fe0f.png" : "freelife/apple/26cf-fe0f.png"}" alt=""><div class="t"><b>${c}</b><span>${usd(eraCash(0.35 * bizBaseU(t)))} · it might strike more, or might not</span></div>${DOTS}</div>`
            : "") +
          (e.lvl < 4
            ? `<div class="row" data-b="grow"><img src="freelife/apple/1f3d7-fe0f.png" alt=""><div class="t"><b>Expand the Business</b><span>${usd(eraCash(bizBaseU(t) * (BIZ_LV[e.lvl] - BIZ_LV[e.lvl - 1]) * 0.85))} · room for ${Math.round(t.max * BIZ_LV[e.lvl])} ${t.staff}</span></div>${DOTS}</div>`
            : "") +
          `<div class="row" data-b="sell"><img src="pets/ui-sell.png" alt=""><div class="t"><b>Sell the Business</b><span>Worth about ${usd(s)}</span></div>${DOTS}</div>`),
          (sList.scrollTop = 0);
        const d = {
          report: () => bizReport(e),
          crew: () => openBizCrew(e),
          hire: () => bizHire(e),
          let: () => bizLetGo(e),
          pay: () => bizPayCard(e),
          over: () => bizOversee(e),
          ins: () => bizInsure(e),
          deep: () => bizDeeper(e),
          grow: () => bizExpand(e),
          sell: () => bizSell(e),
        };
        sList.querySelectorAll("[data-b]").forEach(
          (e) =>
            (e.onclick = () => {
              play("choice"), d[e.dataset.b]();
            }),
        ),
          screen.classList.add("open");
      }
      const bizRole = (e, t, a) => {
          if (0 === t && a >= 10) return "Foreman";
          const o = e.staff.split(" and "),
            n = o[t % o.length];
          return cap1(
            "staff" === n
              ? "staff member"
              : /men$/.test(n)
                ? n.replace(/men$/, "man")
                : /sses$/.test(n)
                  ? n.slice(0, -2)
                  : n.replace(/s$/, ""),
          );
        },
        bizFem = (e) =>
          "dress" === e.id
            ? 0.95
            : /textile|cigar|tonic/.test(e.id)
              ? 0.55
              : /hotel|eating|bakery|theater/.test(e.id)
                ? 0.3
                : 0.04,
        CREW_FIRST = {
          m: [
            "John",
            "William",
            "James",
            "George",
            "Charles",
            "Thomas",
            "Henry",
            "Joseph",
            "Samuel",
            "Patrick",
            "Michael",
            "Frederick",
            "Albert",
            "Abraham",
            "Isaac",
            "Jacob",
            "Daniel",
            "Edward",
            "Hans",
            "Otto",
            "Silas",
            "Amos",
            "Elijah",
            "Josiah",
            "Walter",
            "Horace",
            "Ezra",
            "Moses",
            "Peter",
            "Owen",
          ],
          f: [
            "Mary",
            "Anna",
            "Margaret",
            "Sarah",
            "Elizabeth",
            "Catherine",
            "Bridget",
            "Emma",
            "Martha",
            "Ellen",
            "Nora",
            "Lucy",
            "Hannah",
            "Abigail",
            "Harriet",
            "Agnes",
            "Ida",
            "Bertha",
            "Clara",
            "Rose",
            "Julia",
            "Alice",
            "Edith",
            "Louisa",
          ],
        },
        CREW_LAST = [
          "Smith",
          "Johnson",
          "Brown",
          "Miller",
          "Davis",
          "Wilson",
          "Taylor",
          "Clark",
          "Walker",
          "Wright",
          "Baker",
          "Cooper",
          "Turner",
          "Carter",
          "Mitchell",
          "Hughes",
          "Murphy",
          "O'Brien",
          "Kelly",
          "Sullivan",
          "Schmidt",
          "Mueller",
          "Becker",
          "Fischer",
          "Wagner",
          "Hoffman",
          "Olsen",
          "Larsen",
          "Fletcher",
          "Porter",
          "Fuller",
          "Mason",
          "Thatcher",
          "Sawyer",
          "Webb",
          "Barnes",
          "Reed",
          "Morgan",
          "Price",
          "Ward",
          "Doyle",
          "Byrne",
          "Walsh",
          "Lynch",
          "Burke",
          "Evans",
          "Jones",
          "Griffiths",
        ];
      function bizCrew(e) {
        const t = bizT(e),
          a = (e.crew ||= []),
          o = bizYear(),
          n = { low: 30, fair: 45, good: 60 }[e.pay];
        for (; a.length > e.n; ) a.splice(rint(0, a.length - 1), 1);
        for (; a.length < e.n; ) {
          const e = chance(bizFem(t)) ? "f" : "m";
          a.push({
            first: pickR(CREW_FIRST[e]),
            last: pickR(CREW_LAST),
            g: e,
            born: o - rint(/textile|cigar/.test(t.id) ? 12 : 16, 55),
            since: o,
          });
        }
        return (
          a.forEach((e) => {
            (e.look ||= randomLook(e.g, o - e.born)), (e.rel ??= clamp(n + rint(-12, 15)));
          }),
          a
        );
      }
      const crewMood = (e) => {
        const t = e.crew || [];
        if (!t.length) return 1;
        const a = t.reduce((e, t) => e + (t.rel ?? 50), 0) / t.length;
        return a < 35 ? 1.6 : a > 65 ? 0.5 : 1;
      };
      function openBizCrew(e) {
        if (!e.n) return openBizDetail(e);
        const t = bizT(e),
          a = bizCrew(e),
          o = bizYear(),
          n = a.slice(0, 120);
        (sTitle.textContent = e.name.toUpperCase()),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => openBizDetail(e)),
          (sList.innerHTML =
            `<div class="sec">${a.length} ${t.staff} · ${BIZ_PAY[e.pay][0].toLowerCase()} pay</div>` +
            n
              .map(
                (e, o) =>
                  `<div class="row" data-w="${o}"><i class="face" data-wf="${o}"></i><div class="t"><b>${e.first} ${e.last} <em>(${bizRole(t, o, a.length)})</em></b>${sBar("Relationship", e.rel)}</div>${CHEV}</div>`,
              )
              .join("") +
            (a.length > n.length
              ? `<div class="row dis"><img src="occ/job-coworkers.png" alt=""><div class="t"><b>And ${a.length - n.length} more</b><span>Too many to know them all by name</span></div></div>`
              : "")),
          sList.querySelectorAll("i.face").forEach((e) => {
            const t = a[+e.dataset.wf];
            e.replaceWith(npcFace(t.look, t.g, o - t.born, moodOf(t.rel), "face"));
          }),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-w]").forEach(
            (t) =>
              (t.onclick = () => {
                play("choice"), openCrewPerson(e, +t.dataset.w);
              }),
          ),
          screen.classList.add("open");
      }
      function openCrewPerson(e, t) {
        const a = bizT(e),
          o = bizCrew(e),
          n = o[t];
        if (!n) return openBizCrew(e);
        const s = bizYear(),
          r = s - n.born,
          i = "f" === n.g,
          l = i ? "her" : "him",
          c = `${n.first} ${n.last}`,
          d = bizRole(a, t, o.length),
          u = () => openCrewPerson(e, t),
          h = eraCash(0.1 * bizWage(e)),
          p = { role: d, name: c, g: n.g, age: r };
        (sTitle.textContent = "WORKER"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => openBizCrew(e));
        const m = (e, t, a, o) =>
          `<div class="row sm" data-a="${e}"><img src="${t}"><div class="t"><b>${a}</b><span>${o}</span></div>${DOTS}</div>`;
        (sList.innerHTML =
          `<div class="row"><i class="face" id="crwFace"></i><div class="t"><b>${c} <em>(${d})</em></b>${sBar("Relationship", n.rel)}<span>Age ${r} · ${s > n.since ? `${s - n.since} year${s - n.since > 1 ? "s" : ""} with you` : "new hire"} · ${usd(eraCash(bizWage(e)))} a year</span></div></div><div class="sec">Interactions</div>` +
          m("compliment", "school/ui-compliment.png", "Compliment", `Praise ${crewHis(i)} work`) +
          m("talk", "school/ui-talk.png", "Conversation", `Have a conversation with ${l}`) +
          m("gift", "school/ui-gift.png", "Gift", `Give ${l} a gift`) +
          m("time", "rel/time.png", "Spend Time", `Spend time with ${l}`) +
          m("insult", "school/ui-insult.png", "Insult", `Insult ${l}`) +
          '<div class="sec">Management</div>' +
          m("bonus", "freelife/apple/1f4b5.png", "Give a Bonus", `${usd(h)} for a job well done`) +
          (t > 0 && o.length >= 10
            ? m(
                "foreman",
                "occ/job-coworkers.png",
                "Make Foreman",
                `Put ${l} in charge of the other ${a.staff}`,
              )
            : "") +
          m("fire", "freelife/apple/1f6aa.png", "Let Go", `Fire ${l} from ${e.name}`)),
          document.getElementById("crwFace").replaceWith(npcFace(n.look, n.g, r, moodOf(n.rel), "face")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-a]").forEach(
            (a) =>
              (a.onclick = () => {
                const s = a.dataset.a;
                return (
                  play("choice"),
                  ["compliment", "talk", "gift", "time", "insult"].includes(s)
                    ? parentAction(n, s, u, p)
                    : "bonus" === s
                      ? state.money < h
                        ? notice("Not enough money", `A bonus costs ${usd(h)}.`, null, !0)
                        : ((state.money = cents(state.money - h)),
                          (n.rel = clamp(n.rel + rint(8, 15))),
                          renderStats(),
                          play("coins"),
                          say(`I gave ${c} at ${e.name} a bonus of ${usd(h)}.`),
                          notice("Bonus", `${c} couldn't stop thanking you.`, u, !0))
                      : "foreman" === s
                        ? (o.splice(t, 1),
                          o.unshift(n),
                          (n.rel = clamp(n.rel + 10)),
                          say(`I made ${c} the foreman at ${e.name}.`),
                          notice(
                            "New foreman",
                            `${c} is now the foreman at ${e.name}.`,
                            () => openCrewPerson(e, 0),
                            !0,
                          ))
                        : void (
                            "fire" === s &&
                            iosConfirm("Let Go", `Fire ${c} from ${e.name}?`, () => {
                              o.splice(t, 1), e.n--, say(`I let ${c} go from ${e.name}.`), openBizCrew(e);
                            })
                          )
                );
              }),
          ),
          screen.classList.add("open");
      }
      const crewHis = (e) => (e ? "her" : "his");
      function bizReport(e) {
        const t = e.last;
        t &&
          jCard({
            tag: e.name,
            iconSrc: bizIco(e),
            title: `The Books for ${t.year}`,
            close: !0,
            lead: t.notes.length ? `${t.notes.join(". ")}.` : "An ordinary year of trade.",
            rows: [
              ["Sales", usd(Math.max(0, t.rev))],
              ...(t.rev < 0 ? [["Claims Paid", `−${usd(-t.rev)}`]] : []),
              ["Materials", `−${usd(t.mat)}`],
              ["Wages", `−${usd(t.wages)}`],
              ["Rent & Upkeep", `−${usd(t.up)}`],
              ...(t.prem ? [["Insurance", `−${usd(t.prem)}`]] : []),
              [t.net >= 0 ? "Cleared" : "Lost", usd(Math.abs(t.net))],
            ],
            ok: () => {},
          });
      }
      function bizHire(e) {
        const t = bizT(e),
          a = bizMax(e) - e.n,
          o = bizYear();
        if (a <= 0)
          return notice(
            "No room",
            `${e.name} has no room for more ${t.staff}. Expand the business first.`,
            null,
            !0,
          );
        const n = "us" === state.country && o >= 1861 && o <= 1865,
          s = [
            ...new Set(
              [1, 5, 25, 100]
                .filter((e) => e < a)
                .slice(-2)
                .concat(a),
            ),
          ];
        jCard({
          tag: e.name,
          iconSrc: "freelife/apple/1f477.png",
          title: `Hire ${cap1(t.staff)}`,
          close: !0,
          lead: `You post a notice in the window and in the newspaper. Each one costs ${usd(eraCash(bizWage(e)))} a year at ${BIZ_PAY[e.pay][0].toLowerCase()} pay, paid at the end of the year.`,
          rows: [
            ["Working Now", e.n],
            ["Room For", a],
          ],
          choices: s.map((o) => [
            o === a && o > 1 ? `Fill every place (${o})` : `Hire ${o}`,
            () =>
              ((a) => {
                const o = n ? Math.max(1, Math.round(0.6 * a)) : a;
                if (
                  ((e.n += o),
                  play("coins"),
                  say(
                    `I hired ${o} ${1 === o ? t.staff.replace(/s$/, "").replace(/s and /, " and ") : t.staff} at ${e.name}.`,
                  ),
                  o < a)
                )
                  return notice(
                    "Few answered",
                    `With so many men away at the war, only ${o} answered your notice.`,
                    () => openBizDetail(e),
                    !0,
                  );
                openBizDetail(e);
              })(o),
          ]),
        });
      }
      function bizLetGo(e) {
        const t = bizT(e),
          a = (a) => {
            (e.n = Math.max(0, e.n - a)), say(`I let ${a} ${t.staff} go at ${e.name}.`), openBizDetail(e);
          };
        jCard({
          tag: e.name,
          iconSrc: "freelife/apple/1f6aa.png",
          title: "Let Workers Go",
          close: !0,
          lead: `You have ${e.n} ${t.staff}. How many will you let go?`,
          choices: [...new Set([1, 5, 25].filter((t) => t < e.n))]
            .map((e) => [`Let ${e} go`, () => a(e)])
            .concat([[`Let all ${e.n} go`, () => a(e.n), "gray"]]),
        });
      }
      function bizPayCard(e) {
        const t = bizT(e),
          a = bizYear();
        jCard({
          tag: e.name,
          iconSrc: "freelife/apple/1f4b5.png",
          title: "Set the Wages",
          close: !0,
          lead: "Pay too little and your workers drift away or walk out on strike. Pay well and they stay loyal and work harder.",
          choices: Object.entries(BIZ_PAY).map(([o, n]) => [
            `${n[0]} pay (${usd(eraCash(t.wage * wageIdx(a) * n[1]))} a year)`,
            () => {
              (e.pay = o), say(`I set ${n[0].toLowerCase()} wages at ${e.name}.`), openBizDetail(e);
            },
            o === e.pay ? "gray" : void 0,
          ]),
        });
      }
      function bizOversee(e) {
        if (e.over === state.age)
          return notice("Done for the year", "You already put in the time this year.", null, !0);
        const t = bizT(e),
          a = (t, a) => {
            (e.over = state.age), eraResult(e.name, bizIco(e), [1, t, a]);
          };
        jCard({
          tag: e.name,
          iconSrc: bizIco(e),
          title: "Oversee the Business",
          close: !0,
          lead: "A business does better when the owner is watching. How will you spend your time?",
          choices: [
            [
              "Work alongside the hands",
              () =>
                a(`I rolled up my sleeves and worked alongside my ${t.staff} at ${e.name}.`, {
                  Health: -2,
                  Respect: 1,
                }),
            ],
            [
              "Go over the books",
              () =>
                a(`I went over the books at ${e.name} line by line and found where money was leaking.`, {
                  Smarts: 2,
                }),
            ],
            [
              "Court new customers",
              () =>
                a(`I shook hands all over town and brought new customers to ${e.name}.`, {
                  Respect: 2,
                  Happiness: 2,
                }),
            ],
          ],
        });
      }
      function bizInsure(e) {
        const t = bizValue(e),
          a = eraCash(bizPremU(e));
        if (e.ins)
          return iosConfirm(
            "Cancel Insurance",
            `Stop paying ${usd(a)} a year for fire insurance on ${e.name}?`,
            () => {
              (e.ins = !1), say(`I canceled the fire insurance on ${e.name}.`), openBizDetail(e);
            },
          );
        iosConfirm(
          "Fire Insurance",
          `Insure ${e.name} for ${usd(a)} a year? If it burns down, you'll be paid ${usd(cents(0.8 * t))}.`,
          () => {
            (e.ins = !0), play("coins"), say(`I bought fire insurance for ${e.name}.`), openBizDetail(e);
          },
        );
      }
      function bizDeeper(e) {
        const t = bizT(e),
          a = eraCash(0.35 * bizBaseU(t));
        if (state.money < a) return notice("Not enough money", `That costs ${usd(a)}.`, null, !0);
        iosConfirm(
          "oil" === t.kind ? "Drill Deeper" : "Sink a New Shaft",
          `Spend ${usd(a)} trying to find more ${"oil" === t.kind ? "oil" : "ore"}?`,
          () => {
            if (((state.money = cents(state.money - a)), renderStats(), play("rockBreak"), chance(0.4)))
              return (
                (e.dry = !1),
                (e.reserve = rint(3, 12)),
                "oil" === t.kind && (e.gusher = chance(0.1)),
                say(`I spent ${usd(a)} and struck ${"oil" === t.kind ? "oil" : "a new vein"} at ${e.name}!`),
                notice(
                  "Struck it!",
                  "oil" === t.kind
                    ? `The drill hit oil deeper down${e.gusher ? " and it came up as a gusher" : ""}!`
                    : "Your miners broke into a fresh vein of ore!",
                  () => openBizDetail(e),
                  !0,
                )
              );
            say(`I spent ${usd(a)} at ${e.name} and found nothing.`),
              notice("Nothing", "All that money, and nothing but rock.", () => openBizDetail(e), !0);
          },
        );
      }
      function bizExpand(e) {
        const t = bizT(e),
          a = eraCash(bizBaseU(t) * (BIZ_LV[e.lvl] - BIZ_LV[e.lvl - 1]) * 0.85);
        if (state.money < a) return notice("Not enough money", `Expanding costs ${usd(a)}.`, null, !0);
        iosConfirm(
          "Expand",
          `Spend ${usd(a)} to expand ${e.name}, with room for ${Math.round(t.max * BIZ_LV[e.lvl])} ${t.staff}?`,
          () => {
            (state.money = cents(state.money - a)),
              e.lvl++,
              (state.respect = clamp((state.respect ?? 40) + 2)),
              renderStats(),
              play("rockBreak"),
              say(`I spent ${usd(a)} expanding ${e.name}.`),
              openBizDetail(e);
          },
        );
      }
      function bizSell(e) {
        const t = cents(bizValue(e) * (e.last ? 0.85 + 0.25 * Math.random() : 0.65 + 0.2 * Math.random()));
        iosConfirm("Sell the Business", `A buyer offers ${usd(t)} for ${e.name}. Sell?`, () => {
          state.biz.splice(state.biz.indexOf(e), 1),
            (state.money = cents(state.money + t)),
            renderStats(),
            play("coins"),
            say(`I sold ${e.name} for ${usd(t)}.`),
            notice("Business sold", `You sold ${e.name} for ${usd(t)}.`, bizBack || openBusiness, !0);
        });
      }
      function bizRun(e, t) {
        const a = bizT(e),
          o = BIZ_PAY[e.pay],
          n = [],
          s = a.kind;
        let r =
          demandAt(t) *
          o[2] *
          (1 + Math.min(0.1, 0.004 * (t - e.since))) *
          (0.97 + (state.stats.Smarts || 50) / 1500) *
          (1 + (2 * Math.random() - 1) * a.vol * 0.5);
        if (
          (e.over === state.age - 1 && (r *= 1.1),
          e.lockout && ((r *= 0.6), n.push("The lockout cut production"), (e.lockout = !1)),
          "vein" === s &&
            (e.reserve--,
            e.reserve < 0
              ? ((r *= 0.15), n.push("The vein is played out"))
              : chance(0.05) && ((r *= 2), n.push("Your miners struck a rich pocket of ore"))),
          "oil" === s &&
            (e.dry
              ? ((r = 0), n.push("The well is a dry hole"))
              : ((r *=
                  (t < 1861
                    ? 2.5
                    : t <= 1862
                      ? 0.35
                      : t <= 1865
                        ? 1.6
                        : t <= 1873
                          ? 1
                          : t <= 1880
                            ? 0.8
                            : 0.9) * (e.gusher ? 3 : 1)),
                t >= 1861 && t <= 1862 && n.push("So many wells came in that the price of oil collapsed"),
                e.reserve--,
                e.reserve < 0 && ((r *= 0.25), n.push("The well is running dry")))),
          "ranch" === s &&
            (1886 === t || 1887 === t
              ? ((r *= 0.3), n.push("The terrible winter killed most of the herd"))
              : chance(0.08) && ((r *= 0.6), n.push("A hard winter killed part of the herd"))),
          "stage" === s &&
            ("us" === state.country ? t >= 1869 : t >= 1845) &&
            ((r *= 0.65), n.push("The railroad is taking your passengers")),
          "rail" === s && slumpAt(t) && (r *= 0.7),
          ("boat" !== s && "ship" !== s) ||
            !chance(0.05) ||
            ((r *= 0.55),
            n.push(
              "ship" === s
                ? "One of your ships went down in a storm"
                : "A boat was lost at sea with all hands",
            )),
          "ins" === s)
        ) {
          const e = (
            "us" === state.country
              ? {
                  1835: "the Great Fire of New York",
                  1845: "the Great Fire of New York",
                  1871: "the Great Chicago Fire",
                  1872: "the Great Boston Fire",
                  1889: "the Great Seattle Fire",
                  1906: "the San Francisco earthquake and fire",
                }
              : { 1861: "the Tooley Street fire", 1897: "the Cripplegate fire" }
          )[t];
          e
            ? ((r = -2.5), n.push(`The claims from ${e} were enormous`))
            : chance(0.08) && ((r *= 0.3), n.push("A string of fires brought in heavy claims"));
        }
        if ("inv" === s) {
          ((state.invent || {}).patents || []).find((t) => t.id === e.inv) ||
            ((r *= 0.6), n.push("Without a patent, rivals copy your product"));
        }
        "tonic" === a.id &&
          "us" === state.country &&
          t >= 1906 &&
          ((r *= 0.5), n.push("The Pure Food and Drug Act hurt sales")),
          bizDry(t) && /saloon|brewery|still/.test(a.id) && ((r = 0), n.push("Prohibition shut you down")),
          slumpAt(t) && n.push(`${cap1(slumpAt(t)[2])} hurt trade, so you cut wages and hours`),
          e.n || n.push(`You had no ${a.staff} working`);
        const i = e.n * bizRevPer(a) * revIdx(t) * r,
          l = Math.max(0, i) * a.mat,
          c = e.n * bizWage(e, t) * (slumpAt(t) ? 0.92 : 1),
          d = 0.04 * a.cost * revIdx(t) * BIZ_LV[e.lvl - 1],
          u = e.ins ? bizPremU(e) : 0,
          h = i - l - c - d - u;
        return {
          year: t,
          rev: eraCash(i),
          mat: eraCash(l),
          wages: eraCash(c),
          up: eraCash(d),
          prem: eraCash(u),
          net: eraCash(h),
          u: h,
          notes: n,
        };
      }
      function bizAgeUp() {
        const e = bizYear() - 1,
          t = [],
          a = [],
          o = (e) => state.biz.splice(state.biz.indexOf(e), 1);
        let n = 0;
        for (const s of [...state.biz]) {
          const r = bizT(s),
            i = bizRun(s, e);
          if (((s.last = i), state.money + i.net < 0)) {
            o(s),
              (state.money = 0),
              (state.respect = clamp((state.respect ?? 40) - 8)),
              say(`I couldn't pay the debts of ${s.name}. My creditors seized it and I went bankrupt.`),
              t.push(() =>
                jCard({
                  tag: s.name,
                  iconSrc: bizIco(s),
                  title: "Bankrupt!",
                  lead: `${s.name} lost ${usd(-i.net)} this year and you couldn't cover it. Your creditors seized the business and everything in it.`,
                  ok: () => {},
                }),
              );
            continue;
          }
          (state.money = cents(state.money + i.net)),
            (n += i.net),
            a.push([s.name, `${i.net >= 0 ? "Cleared" : "Lost"} ${usd(Math.abs(i.net))}`]),
            (s.losses = i.net < 0 ? (s.losses || 0) + 1 : 0);
          const l = slumpAt(e),
            c = l && l[0] === e,
            d = (e, a, n, r) => {
              const i = cents(bizValue(s) * r);
              o(s),
                (state.money = cents(state.money + i)),
                (state.respect = clamp((state.respect ?? 40) - 5)),
                say(n),
                t.push(() =>
                  jCard({
                    tag: s.name,
                    iconSrc: bizIco(s),
                    title: e,
                    lead: `${a}${i ? ` You salvaged ${usd(i)}.` : ""}`,
                    ok: () => {},
                  }),
                );
            };
          if (s.losses >= 3 && chance(0.35)) {
            d(
              "Out of Business",
              `${s.name} lost money ${s.losses} years running. Your creditors called in their loans and the doors closed for good.`,
              `${s.name} failed after losing money year after year.`,
              0.25,
            );
            continue;
          }
          if ("bank" === r.kind && c && chance(0.3)) {
            d(
              "Run on the Bank!",
              `When ${l[2]} struck, depositors lined up around the block demanding their money. ${s.name} ran out of cash and closed its doors.`,
              `${l[2]} caused a run on ${s.name} and it collapsed.`,
              0.1,
            );
            continue;
          }
          if ("rail" === r.kind && c && chance(0.2)) {
            d(
              "Receivership",
              `${cap1(l[2])} left ${s.name} unable to pay its bondholders. A court handed the railroad to a receiver.`,
              `${s.name} went into receivership during ${l[2]}.`,
              0.3,
            );
            continue;
          }
          if ("low" === s.pay && s.n > 2 && chance(0.5)) {
            const e = Math.max(1, Math.round(s.n * (0.1 + 0.15 * Math.random())));
            (s.n -= e), i.notes.push(`${e} ${r.staff} quit over the low pay`);
          }
          if (s.crew && s.crew.length) {
            const t = s.crew.filter((t) => e - t.born >= 65 && chance(0.35));
            t.length &&
              ((s.crew = s.crew.filter((e) => !t.includes(e))),
              (s.n = Math.max(0, s.n - t.length)),
              i.notes.push(
                (1 === t.length ? `${t[0].first} ${t[0].last}` : `${t.length} ${r.staff}`) + " retired",
              ));
          }
          if (("mine" === r.kind || "vein" === r.kind) && s.n >= 5 && chance(0.04)) {
            const e = rint(1, Math.max(2, Math.round(0.08 * s.n)));
            (s.n -= e),
              (state.respect = clamp((state.respect ?? 40) - 3)),
              i.notes.push(`${e} ${1 === e ? "miner" : "miners"} died in an accident`),
              t.push(() => {
                crimeSnd("MineExplosion"),
                  notice(
                    "Mine Disaster",
                    `${"mine" === r.kind ? "A firedamp explosion" : "A cave-in"} at ${s.name} killed ${e} ${1 === e ? "miner" : "miners"}. Their widows are waiting at your door.`,
                    null,
                    !0,
                  );
              });
          }
          const u =
            s.n >= 5 && r.strike
              ? Math.min(
                  0.6,
                  r.strike *
                    { low: 3, fair: 1, good: 0.25 }[s.pay] *
                    (e >= 1870 ? 1.6 : 1) *
                    (l ? 1.5 : 1) *
                    crewMood(s),
                )
              : 0;
          chance(u) && t.push(() => bizStrike(s)),
            chance(r.fire * ("us" === state.country && 1871 === e ? 3 : 1)) &&
              (o(s), t.push(() => bizFire(s, e)));
        }
        if ((renderStats(), a.length)) {
          say(
            `My business${a.length > 1 ? "es" : ""} ${n >= 0 ? "cleared" : "lost"} ${usd(Math.abs(n))} this year.`,
          );
          const t = slumpAt(e);
          queuePopup(() =>
            jCard({
              tag: `Business in ${e}`,
              iconSrc: "freelife/apple/1f4bc.png",
              title: "Year-End Books",
              lead: t ? `Hard times. ${cap1(t[2])} hurt trade everywhere.` : "Trade was steady this year.",
              rows: a,
              ok: () => {},
            }),
          );
        }
        t.forEach((e) => queuePopup(e));
      }
      function bizStrike(e) {
        if (!state.biz.includes(e) || !e.n) return;
        const t = bizT(e),
          a = eraCash(e.n * bizWage(e) * 0.2);
        play("crowdJeer");
        const o = (t, a) => eraResult(e.name, bizIco(e), [1, t, a]);
        jCard({
          tag: e.name,
          iconSrc: bizIco(e),
          title: "Strike!",
          lead: `Your ${t.staff} at ${e.name} have walked off the job${"low" === e.pay ? ". They say they cannot feed their families on what you pay" : " and are demanding higher wages"}. The place stands silent.`,
          rows: [
            ["Workers Out", e.n],
            ["Their Pay", BIZ_PAY[e.pay][0]],
          ],
          choices: [
            [
              "Give them a raise",
              () => {
                (e.pay = "low" === e.pay ? "fair" : "good"),
                  o(`I gave my ${t.staff} at ${e.name} a raise and they went back to work.`, { Respect: 3 });
              },
            ],
            [
              `Hire strikebreakers (${usd(a)})`,
              () =>
                state.money < a
                  ? notice("Not enough money", `Strikebreakers cost ${usd(a)}.`, () => bizStrike(e), !0)
                  : ((state.money = cents(state.money - a)),
                    chance(0.35)
                      ? (play("riot"),
                        (e.n = Math.round(0.7 * e.n)),
                        o(
                          `I brought in strikebreakers at ${e.name}. A riot broke out at the gates and men were hurt on both sides.`,
                          { Respect: -7, Happiness: -5 },
                        ))
                      : void o(`I brought in strikebreakers and broke the strike at ${e.name}.`, {
                          Respect: -3,
                        })),
            ],
            [
              "Lock them out",
              () => {
                (e.lockout = !0),
                  o(`I locked my striking ${t.staff} out of ${e.name} until they come crawling back.`, {
                    Respect: -2,
                  });
              },
            ],
            [
              "Fire them all",
              () => {
                (e.n = 0),
                  o(`I fired every striking worker at ${e.name}. I'll have to hire all new ${t.staff}.`, {
                    Respect: -4,
                  });
              },
              "gray",
            ],
          ],
        });
      }
      function bizFire(e, t) {
        const a = bizT(e),
          o = bizValue(e),
          n = e.ins ? cents(0.8 * o) : 0,
          s =
            "us" === state.country && 1871 === t
              ? "The Great Chicago Fire swept through the city."
              : pickR([
                  "A lamp tipped over in the night.",
                  "Sparks from the boiler caught the roof.",
                  "A careless worker dropped a lit match.",
                  "Lightning struck the roof during a storm.",
                  "Someone set the place alight in the night.",
                ]);
        play("fireCrackle"),
          n && (state.money = cents(state.money + n)),
          (state.stats.Happiness = clamp(state.stats.Happiness - 10)),
          renderStats(),
          say(
            `${s} ${e.name} burned to the ground${n ? `. My insurance paid ${usd(n)}` : ", and I had no insurance"}.`,
          ),
          jCard({
            tag: e.name,
            iconSrc: "freelife/apple/1f525.png",
            title: "Fire!",
            lead: `${s} ${e.name} burned to the ground. ${n ? `Your insurance company paid you ${usd(n)}.` : "You had no insurance. Everything is lost."}`,
            choices: [
              [
                `Rebuild it (${usd(o)})`,
                () => {
                  if (state.money < o)
                    return notice("Not enough money", `Rebuilding costs ${usd(o)}.`, null, !0);
                  (state.money = cents(state.money - o)),
                    state.biz.push({ ...e, last: null, n: 0, losses: 0, lockout: !1, crew: [] }),
                    renderStats(),
                    play("coins"),
                    say(`I rebuilt ${e.name} from the ashes.`),
                    notice(
                      "Rebuilt",
                      `${e.name} rises from the ashes. You'll need to hire your ${a.staff} again.`,
                      null,
                      !0,
                    );
                },
              ],
              ["Walk away", () => {}, "gray"],
            ],
          });
      }
      function bizRows() {
        const e = state.biz || [],
          t = (state.invent || {}).patents || [];
        return e.length || t.length
          ? (e.length
              ? '<div class="sec">Businesses</div>' +
                e
                  .map(
                    (e, t) =>
                      `<div class="row" data-bizrow="${t}"><img src="${bizIco(e)}" alt=""><div class="t"><b>${e.name}</b><span>Worth about ${usd(bizValue(e))}${e.last ? ` · last year ${e.last.net >= 0 ? "cleared" : "lost"} ${usd(Math.abs(e.last.net))}` : ""}</span></div>${CHEV}</div>`,
                  )
                  .join("")
              : "") +
              (t.length
                ? `<div class="sec">Patents</div><div class="row" data-patrow="1"><img src="freelife/apple/1f4dc.png" alt=""><div class="t"><b>${t.length} Patent${t.length > 1 ? "s" : ""}</b><span>${t.map((e) => INVENTIONS.find((t) => t.id === e.id).name).join(", ")}</span></div>${CHEV}</div>`
                : "")
          : "";
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        !state.dead && (state.biz || []).length && bizAgeUp();
      });
      const INV_EMOJI = {
          steamboat: "1f6a2",
          matches: "1f525",
          locomotive: "1f682",
          mower: "1f33f",
          reaper: "1f33e",
          revolver: "1f52b",
          plow: "1f331",
          telegraph: "1f4e8",
          rubber: "1f97e",
          sewing: "1f9f5",
          elevator: "1f6d7",
          kerosene: "1fa94",
          watch: "1f570-fe0f",
          dynamite: "1f9e8",
          typewriter: "2328-fe0f",
          barbed: "1f517",
          telephone: "260e-fe0f",
          phonograph: "1f3b6",
          refrig: "1f9ca",
          bulb: "1f4a1",
          cashreg: "1f4b5",
          pen: "1f58b-fe0f",
          bicycle: "1f6b2",
          dishwasher: "1f37d-fe0f",
          camera: "1f4f7",
          tire: "1f6de",
          motor: "2699-fe0f",
          movie: "1f3a5",
          zipper: "1f456",
          wireless: "1f4fb",
          aircon: "2744-fe0f",
          airplane: "2708-fe0f",
        },
        INVENTIONS = [
          ["steamboat", "Steamboat", "biz/shipping.png", 1807, 8e3, 40],
          ["matches", "Friction Match", "freelife/apple/1f525.png", 1826, 2e3, 3, 0.08],
          ["locomotive", "Steam Locomotive", "biz/train.png", 1829, 12e3, 60, 0.06],
          ["mower", "Lawn Mower", "biz/gears.png", 1830, 1500, 10],
          ["reaper", "Mechanical Reaper", "jobev/wheat.png", 1831, 6e3, 15],
          ["revolver", "Revolving Pistol", "biz/gunsmith.png", 1836, 5e3, 20],
          ["plow", "Steel Plow", "biz/plow.png", 1837, 3e3, 8],
          ["telegraph", "Electric Telegraph", "freelife/apple/1f50c.png", 1837, 8e3, 25],
          ["rubber", "Vulcanized Rubber", "biz/boot.png", 1844, 5e3, 10],
          ["sewing", "Sewing Machine", "biz/sewing.png", 1846, 1e4, 25],
          ["elevator", "Safety Elevator", "biz/gears.png", 1852, 4e3, 30],
          ["kerosene", "Kerosene Lamp", "biz/lamp.png", 1853, 3e3, 6],
          ["watch", "Machine-Made Watch", "biz/watch.png", 1854, 3e3, 18],
          ["dynamite", "Dynamite", "mining/dynamite.png", 1867, 9e3, 20, 0.15],
          ["typewriter", "Typewriter", "freelife/apple/1f4cb.png", 1868, 4e3, 22],
          ["barbed", "Barbed Wire", "biz/ranch.png", 1874, 6e3, 5],
          ["telephone", "Telephone", "freelife/apple/260e-fe0f.png", 1876, 2e4, 25],
          ["phonograph", "Phonograph", "biz/phonograph.png", 1877, 6e3, 20],
          ["refrig", "Refrigerated Railcar", "biz/train.png", 1878, 5e3, 40],
          ["bulb", "Electric Light Bulb", "freelife/apple/1f4a1.png", 1879, 15e3, 30, 0.06],
          ["cashreg", "Cash Register", "biz/store.png", 1879, 5e3, 20],
          ["pen", "Fountain Pen", "freelife/apple/1f58b-fe0f.png", 1884, 3e3, 6],
          ["bicycle", "Safety Bicycle", "freelife/apple/1f6b2.png", 1885, 6e3, 18],
          ["dishwasher", "Dishwasher", "freelife/apple/1f37d-fe0f.png", 1886, 3e3, 20],
          ["camera", "Roll-Film Camera", "biz/camera.png", 1888, 8e3, 15],
          ["tire", "Pneumatic Tire", "freelife/apple/1f6de.png", 1888, 7e3, 12],
          ["motor", "Electric Motor", "biz/gears.png", 1888, 12e3, 30, 0.06],
          ["movie", "Motion Picture Camera", "freelife/apple/1f3a5.png", 1891, 9e3, 35],
          ["zipper", "Zipper", "biz/tailor.png", 1893, 4e3, 8],
          ["wireless", "Wireless Telegraph", "freelife/apple/1f50c.png", 1896, 15e3, 40, 0.06],
          ["aircon", "Air Conditioner", "freelife/apple/2744-fe0f.png", 1902, 8e3, 35],
          ["airplane", "Flying Machine", "freelife/apple/2708-fe0f.png", 1903, 15e3, 60, 0.15],
        ].map(([e, t, a, o, n, s, r]) => ({
          id: e,
          name: t,
          ico: `freelife/apple/${INV_EMOJI[e]}.png`,
          y: o,
          roy: n,
          mat: s,
          danger: r || 0.04,
        })),
        invSt = () => (state.invent ||= { shop: !1, fame: 0, work: {}, patents: [], done: [] }),
        invTries = () => {
          const e = invSt();
          return (
            (e.tries && e.tries.age === state.age) || (e.tries = { age: state.age, n: 0 }), 4 - e.tries.n
          );
        },
        invIdeas = () => {
          const e = bizYear(),
            t = invSt();
          return INVENTIONS.filter((a) => e >= a.y - 12 && e <= a.y + 3 && !t.done.includes(a.id));
        },
        fameWord = (e) =>
          e >= 80
            ? "World-Famous Inventor"
            : e >= 50
              ? "Famous Inventor"
              : e >= 25
                ? "Known Inventor"
                : e > 0
                  ? "Local Tinkerer"
                  : "Unknown Tinkerer",
        patentFee = (e) => eraCash("us" === state.country ? (e >= 1861 ? 35 : 30) : e >= 1852 ? 122 : 487);
      function openInventing() {
        const e = invSt(),
          t = bizYear(),
          a = invIdeas(),
          o = eraCash(40 * lvlAt(t));
        if (
          ((sTitle.textContent = "INVENTING"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities),
          !e.shop)
        )
          return (
            (sList.innerHTML = `<div class="row" data-i="shop"><img src="freelife/apple/1f9ea.png" alt=""><div class="t"><b>Set Up a Workshop</b><span>${usd(o)} for a bench, tools, wire and chemicals. Every inventor needs one</span></div>${DOTS}</div><div class="row dis"><img src="freelife/apple/1f4dc.png" alt=""><div class="t"><b>How it works</b><span>Tinker on ideas whose time is coming, patent them before your rivals do, and earn royalties for years</span></div></div>`),
            (sList.querySelector("[data-i]").onclick = () => {
              if ((play("choice"), state.money < o))
                return notice("Not enough money", `A workshop costs ${usd(o)}.`, null, !0);
              (state.money = cents(state.money - o)),
                (e.shop = !0),
                renderStats(),
                play("anvilHammer"),
                say("I set up an inventor's workshop in the shed."),
                openInventing();
            }),
            screen.classList.add("open")
          );
        const n = invTries();
        (sList.innerHTML =
          `<div class="row"><img src="freelife/apple/1f9ea.png" alt=""><div class="t"><b>${fameWord(e.fame)}</b><div class="rel">Fame <i><u style="width:${Math.max(e.fame, 2)}%;background:#c9a227"></u></i></div></div></div><div class="sec">Ideas in ${t} · ${n > 0 ? `${n} workshop session${n > 1 ? "s" : ""} left this year` : "no time left this year"}</div>` +
          (a.length
            ? a
                .map((a) => {
                  const o = e.work[a.id] || 0;
                  return `<div class="row" data-idea="${a.id}"><img src="${a.ico}" alt=""><div class="t"><b>${a.name}</b>${o ? `<div class="rel">Progress <i><u style="width:${o}%;background:#2fa03b"></u></i></div>` : `<span>${t < a.y ? "Ahead of its time. Hard, but you could beat history" : "Rival inventors are racing you to the patent office"}</span>`}</div>${DOTS}</div>`;
                })
                .join("")
            : '<div class="row dis"><img src="freelife/apple/1f4a1.png" alt=""><div class="t"><b>No new ideas right now</b><span>Keep reading the papers. New ideas come with the times</span></div></div>') +
          (e.patents.length
            ? '<div class="sec">Your Patents</div>' +
              e.patents
                .map((e, t) => {
                  const a = INVENTIONS.find((t) => t.id === e.id);
                  return `<div class="row" data-pat="${t}"><img src="${a.ico}" alt=""><div class="t"><b>${a.name}</b><span>Patented ${e.y} · expires ${e.exp} · earned ${usd(e.earned || 0)}</span></div>${DOTS}</div>`;
                })
                .join("")
            : "")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-idea]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), ideaCard(INVENTIONS.find((t) => t.id === e.dataset.idea));
              }),
          ),
          sList.querySelectorAll("[data-pat]").forEach(
            (t) =>
              (t.onclick = () => {
                play("choice"), patentCard(e.patents[+t.dataset.pat]);
              }),
          ),
          screen.classList.add("open");
      }
      function ideaCard(e) {
        const t = invSt(),
          a = bizYear(),
          o = eraCash(e.mat * lvlAt(a));
        jCard({
          tag: "Workshop",
          iconSrc: e.ico,
          title: e.name,
          close: !0,
          lead:
            a < e.y
              ? `Nobody has built a working ${e.name.toLowerCase()} yet. If you crack it first, your name could go down in history.`
              : `Other inventors are working on a ${e.name.toLowerCase()} right now. Whoever reaches the patent office first wins.`,
          rows: [
            ["Materials", `${usd(o)} a session`],
            ["Sessions Left", `${Math.max(0, invTries())} this year`],
          ],
          choices: [
            ["Tinker with it", () => invWork(e)],
            ...(t.work[e.id]
              ? [
                  [
                    "Give up on it",
                    () => {
                      delete t.work[e.id], say(`I gave up on my ${e.name.toLowerCase()}.`), openInventing();
                    },
                    "gray",
                  ],
                ]
              : []),
          ],
        });
      }
      function invWork(e) {
        const t = invSt(),
          a = bizYear(),
          o = eraCash(e.mat * lvlAt(a));
        if (invTries() <= 0)
          return notice(
            "Worn out",
            "You have spent all your time in the workshop this year. Age up to keep working.",
            null,
            !0,
          );
        if (state.money < o) return notice("Not enough money", `The materials cost ${usd(o)}.`, null, !0);
        if (
          ((state.money = cents(state.money - o)),
          t.tries.n++,
          renderStats(),
          play("anvilHammer"),
          chance(e.danger))
        )
          return (
            "dynamite" === e.id ? crimeSnd("MineExplosion") : play("fireCrackle"),
            eraResult("Workshop Accident", e.ico, [
              1,
              "dynamite" === e.id
                ? "The nitroglycerin went off in my workshop. I was lucky to survive."
                : "airplane" === e.id
                  ? "My flying machine crashed on its test flight and I was thrown into a field."
                  : "A fire broke out in my workshop while I was tinkering. I got burned putting it out.",
              { Health: -rint(8, 25), Happiness: -5 },
            ])
          );
        const n = Math.max(
          2,
          rint(5, 12) + Math.round((state.stats.Smarts || 50) / 10) - Math.round(0.6 * Math.max(0, e.y - a)),
        );
        if (((t.work[e.id] = Math.min(100, (t.work[e.id] || 0) + n)), t.work[e.id] >= 100)) return eureka(e);
        const s = pickR([
          `I worked late into the night on my ${e.name.toLowerCase()}. It is starting to come together.`,
          `My ${e.name.toLowerCase()} failed again, but I learned something.`,
          `I redrew the plans for my ${e.name.toLowerCase()} from scratch.`,
          `I built a new model of my ${e.name.toLowerCase()}. It almost works.`,
        ]);
        say(s), notice("Workshop", s, openInventing, !0);
      }
      function invFame(e) {
        const t = invSt(),
          a = t.fame;
        return (t.fame = Math.min(100, t.fame + e)), a < 50 && t.fame >= 50;
      }
      function eureka(e) {
        const t = invSt(),
          a = bizYear(),
          o = patentFee(a),
          n = a < e.y,
          s = eraCash(1.5 * e.roy * revIdx(a) * (n ? 1.3 : 1)),
          r = () =>
            notice(
              "Famous Inventor!",
              `Newspapers everywhere are writing about ${state.first} ${SURNAME}, inventor of the ${e.name.toLowerCase()}. You're famous!`,
              openInventing,
              !0,
            );
        jCard({
          tag: "Eureka!",
          iconSrc: e.ico,
          title: e.name,
          lead: `It works! Your ${e.name.toLowerCase()} is finished${n ? ", years before anyone else thought of it" : ""}. Patent it and earn royalties for years, or sell the idea outright.`,
          rows: [
            ["Patent Fee", usd(o)],
            ["A Manufacturer Offers", usd(s)],
          ],
          choices: [
            [
              `Patent it (${usd(o)})`,
              () => {
                if (state.money < o)
                  return notice("Not enough money", `The patent fee is ${usd(o)}.`, () => eureka(e), !0);
                (state.money = cents(state.money - o)), t.done.push(e.id), delete t.work[e.id];
                const s = a + ("us" === state.country && a >= 1861 ? 17 : 14);
                t.patents.push({ id: e.id, y: a, exp: s, early: n, earned: 0 });
                const i = invFame(n ? 30 : 18);
                (state.respect = clamp((state.respect ?? 40) + (n ? 8 : 5))),
                  renderStats(),
                  play("coins"),
                  say(`I was granted a patent for my ${e.name.toLowerCase()}!`),
                  notice(
                    "Patent granted",
                    `The patent office granted you a patent on the ${e.name.toLowerCase()}. You'll earn royalties every year until ${s}.`,
                    i ? r : openInventing,
                    !0,
                  );
              },
            ],
            [
              `Sell the idea (${usd(s)})`,
              () => {
                t.done.push(e.id), delete t.work[e.id], (state.money = cents(state.money + s));
                const a = invFame(8);
                renderStats(),
                  play("coins"),
                  say(`I sold my ${e.name.toLowerCase()} to a manufacturer for ${usd(s)}.`),
                  notice(
                    "Idea sold",
                    `A manufacturer paid you ${usd(s)} for the rights to your ${e.name.toLowerCase()}.`,
                    a ? r : openInventing,
                    !0,
                  );
              },
            ],
          ],
        });
      }
      function patentCard(e) {
        const t = invSt(),
          a = INVENTIONS.find((t) => t.id === e.id),
          o = bizYear(),
          n = (state.biz || []).some((t) => "inv" === t.type && t.inv === e.id),
          s = BIZ.inv,
          r = eraCash(bizBaseU(s)),
          i = eraCash(a.roy * revIdx(o) * Math.max(1, e.exp - o) * 0.5);
        jCard({
          tag: "Patent",
          iconSrc: "freelife/apple/1f4dc.png",
          title: a.name,
          close: !0,
          lead: `Your patent on the ${a.name.toLowerCase()} pays royalties every year until it expires in ${e.exp}.`,
          rows: [
            ["Patented", e.y],
            ["Expires", e.exp],
            ["Earned So Far", usd(e.earned || 0)],
          ],
          choices: [
            ...(n
              ? []
              : [
                  [
                    `Build a factory (${usd(r)})`,
                    () => {
                      if (state.age < 18)
                        return notice("Too young", "You must be 18 to own a business.", null, !0);
                      if ((state.biz ||= []).length >= 6)
                        return notice(
                          "Too many businesses",
                          "You can only run six businesses at once.",
                          null,
                          !0,
                        );
                      if (state.money < r)
                        return notice("Not enough money", `A factory costs ${usd(r)}.`, null, !0);
                      state.money = cents(state.money - r);
                      const e = {
                        type: "inv",
                        inv: a.id,
                        ico: a.ico,
                        name: `${SURNAME} ${a.name} Company`,
                        n: 0,
                        lvl: 1,
                        pay: "fair",
                        since: o,
                        paid: r,
                        ins: !1,
                      };
                      state.biz.push(e),
                        (state.respect = clamp((state.respect ?? 40) + 5)),
                        renderStats(),
                        play("coins"),
                        say(`I built a factory to make my ${a.name.toLowerCase()} and named it ${e.name}.`),
                        (bizBack = openInventing),
                        notice(
                          "Factory built",
                          `${e.name} is ready. Hire factory hands to start making your ${a.name.toLowerCase()}.`,
                          () => openBizDetail(e),
                          !0,
                        );
                    },
                  ],
                ]),
            [
              `Sell the patent (${usd(i)})`,
              () => {
                t.patents.splice(t.patents.indexOf(e), 1),
                  (state.money = cents(state.money + i)),
                  renderStats(),
                  play("coins"),
                  say(`I sold my patent on the ${a.name.toLowerCase()} for ${usd(i)}.`),
                  notice("Patent sold", `You sold the patent for ${usd(i)}.`, openInventing, !0);
              },
              "gray",
            ],
          ],
        });
      }
      function invAgeUp() {
        const e = state.invent,
          t = bizYear() - 1;
        let a = 0;
        for (const o of [...e.patents]) {
          const n = INVENTIONS.find((e) => e.id === o.id);
          if (t > o.exp) {
            e.patents.splice(e.patents.indexOf(o), 1),
              say(`My patent on the ${n.name.toLowerCase()} expired. Anyone can make it now.`);
            continue;
          }
          const s = t - o.y,
            r = eraCash(
              n.roy *
                revIdx(t) *
                Math.min(1, (s + 1) / 4) *
                (o.early ? 1.3 : 1) *
                (o.cut || 1) *
                (0.7 + 0.6 * Math.random()) *
                (slumpAt(t) ? 0.75 : 1),
            );
          (o.earned = cents((o.earned || 0) + r)),
            (a += r),
            s >= 1 && chance(0.08) && queuePopup(() => suitCard(o, n));
        }
        a &&
          ((state.money = cents(state.money + a)),
          renderStats(),
          say(`My patents earned ${usd(a)} in royalties this year.`));
      }
      function suitCard(e, t) {
        const a = bizYear(),
          o = eraCash(250 * lvlAt(a)),
          n = eraCash(t.roy * revIdx(a));
        jCard({
          tag: "Patent Infringement",
          iconSrc: "freelife/apple/1f4dc.png",
          title: "Stolen Invention",
          lead: `${pickR(["A rival manufacturer", "A big company back East", "A former partner of yours", "A crafty inventor"])} is selling copies of your ${t.name.toLowerCase()} without paying you a cent.`,
          choices: [
            [
              `Sue them (${usd(o)})`,
              () =>
                state.money < o
                  ? notice("Not enough money", `The lawyers want ${usd(o)}.`, () => suitCard(e, t), !0)
                  : ((state.money = cents(state.money - o)),
                    crimeSnd("Stamp"),
                    chance(0.55 + (state.stats.Smarts || 50) / 400)
                      ? ((state.money = cents(state.money + n)),
                        eraResult("Court", "freelife/apple/1f4dc.png", [
                          1,
                          `I won my patent lawsuit over the ${t.name.toLowerCase()}. The court awarded me ${usd(n)} in damages.`,
                          { Happiness: 6, Respect: 3 },
                        ]))
                      : void eraResult("Court", "freelife/apple/1f4dc.png", [
                          1,
                          `I lost my patent lawsuit over the ${t.name.toLowerCase()}. The judge sided with the copycats.`,
                          { Happiness: -6 },
                        ])),
            ],
            [
              "Let it go",
              () => {
                (e.cut = 0.75 * (e.cut || 1)),
                  eraResult("Patent", "freelife/apple/1f4dc.png", [
                    1,
                    `I let the copycats sell my ${t.name.toLowerCase()}. My royalties will suffer.`,
                    { Happiness: -3 },
                  ]);
              },
              "gray",
            ],
          ],
        });
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        const e = state.invent;
        !state.dead && e && e.patents.length && invAgeUp();
      });
      const TREES = Object.fromEntries(
          [
            ["pine", "White Pine", "pine", "log-brown", 4, 0.6, [12, 30], 48],
            ["spruce", "Spruce", "spruce", "log-brown", 4, 0.55, [10, 24], 40],
            ["oak", "White Oak", "oak", "log-dark", 8, 1, [16, 36], 32],
            ["maple", "Sugar Maple", "maple", "log-brown", 7, 0.9, [12, 28], 32],
            ["birch", "Birch", "birch", "log-birch", 5, 0.75, [8, 18], 24],
            ["hickory", "Hickory", "hickory", "log-dark", 9, 1.15, [12, 26], 32],
            ["cherry", "Black Cherry", "cherry", "log-red", 15, 0.85, [10, 22], 24],
            ["walnut", "Black Walnut", "walnut", "log-dark", 35, 0.9, [14, 32], 32],
            ["redwood", "Redwood", "redwood", "log-red", 6, 0.5, [30, 80], 80],
            ["willow", "Willow", "willow", "log-brown", 2, 0.5, [12, 30], 16],
            ["aspen", "Aspen", "aspen", "log-birch", 3, 0.5, [8, 16], 24],
            ["dead", "Dead Tree", "dead", "firewood", 0, 0.4, [10, 24], 16],
          ].map(([e, t, a, o, n, s, r, i]) => [
            e,
            {
              id: e,
              name: t,
              img: `timber/${a}.png`,
              log: `timber/${o}.png`,
              price: n,
              hard: s,
              dia: r,
              len: i,
            },
          ]),
        ),
        WOODS = () =>
          [
            {
              k: "lot",
              name: "us" === state.country ? "Home Woodlot" : "Village Copse",
              far: !1,
              from: 1800,
              mix: [
                ["pine", 30],
                ["oak", 25],
                ["maple", 15],
                ["birch", 10],
                ["hickory", 10],
                ["dead", 10],
              ],
            },
            {
              k: "hard",
              name: "Hardwood Forest",
              far: !1,
              from: 1800,
              mix: [
                ["oak", 30],
                ["hickory", 20],
                ["walnut", 12],
                ["cherry", 12],
                ["maple", 16],
                ["dead", 10],
              ],
            },
            {
              k: "river",
              name: "River Bottoms",
              far: !1,
              from: 1800,
              mix: [
                ["willow", 35],
                ["walnut", 12],
                ["aspen", 20],
                ["oak", 23],
                ["dead", 10],
              ],
            },
            {
              k: "north",
              name: "us" === state.country ? "Northern Pinery" : "Highland Pinewood",
              far: !0,
              from: 1800,
              mix: [
                ["pine", 55],
                ["spruce", 30],
                ["birch", 15],
              ],
            },
            ...("us" === state.country
              ? [
                  {
                    k: "coast",
                    name: "Redwood Coast, California",
                    far: !0,
                    from: 1850,
                    mix: [
                      ["redwood", 70],
                      ["spruce", 20],
                      ["dead", 10],
                    ],
                  },
                ]
              : []),
          ].filter((e) => state.birthYear + state.age >= e.from),
        WOOD_TOOLS = [
          {
            id: "axe1",
            name: "Felling Axe",
            ico: "timber/axe-felling.png",
            price: 1.25,
            power: 1,
            axe: !0,
            desc: "A plain single-bit axe for felling trees",
          },
          {
            id: "axe2",
            name: "Kelly Axe",
            ico: "timber/axe-kelly.png",
            price: 1.75,
            power: 1.25,
            axe: !0,
            desc: "A sharper, better-balanced axe that bites deeper",
          },
          {
            id: "axe3",
            name: "Double-Bit Axe",
            ico: "timber/axe-double.png",
            price: 3,
            power: 1.6,
            axe: !0,
            desc: "Two edges, twice as long between sharpenings. The logger's favorite",
          },
          {
            id: "broad",
            name: "Broad Axe",
            ico: "timber/axe-broad.png",
            price: 2.5,
            desc: "Hew logs into square timber. Sawmills and shipyards pay more for hewn logs",
          },
          {
            id: "bucksaw",
            name: "Bucksaw",
            ico: "timber/bucksaw.png",
            price: 1,
            desc: "Cut fallen trees into firewood lengths",
          },
          {
            id: "maul",
            name: "Splitting Maul",
            ico: "timber/maul.png",
            price: 1.5,
            desc: "Split firewood faster, so each tree makes more of it",
          },
          {
            id: "saw",
            name: "Crosscut Saw",
            ico: "timber/crosssaw.png",
            price: 5,
            desc: "Saw through big trunks far faster than any axe",
          },
          {
            id: "rope",
            name: "Felling Rope",
            ico: "timber/rope.png",
            price: 0.75,
            desc: "Pull trees down where you want them. Far fewer accidents",
          },
          {
            id: "cart",
            name: "Log Cart",
            ico: "timber/cart.png",
            price: 15,
            desc: "Haul far more timber home. Needs a horse to pull it",
          },
        ],
        WOOD_TRIPS = 6,
        CORD_BF = 500,
        firewoodPrice = 2.5,
        woodSt = () => (state.wood ||= { tools: [], skill: 0 }),
        hasWT = (e) => woodSt().tools.includes(e),
        bestAxe = () =>
          WOOD_TOOLS.filter((e) => e.axe && hasWT(e.id)).sort((e, t) => t.power - e.power)[0] || null,
        woodIdx = () => Math.max(0.6, Math.pow(1.015, state.birthYear + state.age - 1860)),
        woodCash = (e) => (isOldEra() ? eraCash(e * woodIdx()) : Math.round(e * woodIdx() * 60)),
        isLogger = () => isOldEra() && state.job && "Lumberjack" === state.job.t,
        woodTripsLeft = () => {
          const e = woodSt();
          return (
            (e.trip && e.trip.age === state.age) || (e.trip = { age: state.age, n: 0 }),
            6 + (isLogger() ? 6 : 0) - e.trip.n
          );
        },
        haulCap = () => (hasHorse() ? (hasWT("cart") ? 4e3 : 1500) : 400),
        boardFeet = (e, t) => Math.max(10, Math.round((((e - 4) * (e - 4)) / 16) * t)),
        logValue = (e, t = 1) =>
          "firewood" === e.kind
            ? woodCash(2.5 * e.cords * t)
            : woodCash(((TREES[e.sp].price * e.bf) / 1e3) * (e.hewn ? 1.25 : 1) * t),
        LOG_BUYERS = (e) => {
          if ("firewood" === e.kind)
            return [
              ["Firewood Dealer", 1],
              ["Village Market", 0.7],
            ];
          const t = TREES[e.sp],
            a = [["Sawmill", 1]];
          return (
            /walnut|cherry|maple|oak|birch|hickory/.test(t.id) &&
              a.push(["Furniture Maker", "walnut" === t.id || "cherry" === t.id ? 1.45 : 1.25]),
            /oak|pine|spruce|redwood/.test(t.id) && e.dia >= 22 && a.push(["Shipyard", 1.6]),
            "hickory" === t.id && a.push(["Wagon Maker", 1.4]),
            a.push(["Firewood Dealer", -1]),
            a
          );
        },
        buyerPay = (e, t) => (t < 0 ? woodCash(((2.5 * e.bf) / 500) * 0.8) : logValue(e, t));
