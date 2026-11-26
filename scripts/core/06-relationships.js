      function openRelationships() {
        var e;
        syncProfile(),
          (sTitle.textContent = "RELATIONSHIPS"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = X_ICON),
          (sBack.onclick = () => screen.classList.remove("open")),
          (sList.innerHTML =
            (document.querySelector(".phone").classList.contains("flui")
              ? ""
              : '<div class="sec">Special</div>\n       <div class="row sm dis"><img src="emoji/1f56f-fe0f.png"><div class="t"><b>Commune</b><span>Start a cult</span></div></div>') +
            '<div class="sec">Parents</div>' +
            state.parents
              .map((e, t) =>
                e.dead
                  ? deadRow(`${e.first} ${SURNAME}`, e.role, e)
                  : `<div class="row sm${e.celeb && ftOn() ? " ft-famous" : ""}" data-p="${t}"><i class="face" data-face="${t}"></i><div class="t"><b>${relName(e, SURNAME)} <em>(${e.role}${state.pm && state.pm.custody === e.role && state.age < 18 ? ", Custody" : ""}${e.jail && e.jail.until > state.age ? ", In prison" : ""})</em>${ftStar(e)}</b>${relBar(e.rel)}</div>${CHEV}</div>`,
              )
              .join("") +
            [
              [["stepparent", "exstepparent"], "Stepparents"],
              [["sibling"], "Siblings"],
              [["halfsibling"], "Half-Siblings"],
              [["stepsibling", "exstepsibling"], "Stepsiblings"],
              [["nibling"], "Nieces & Nephews"],
              [["grandparent"], "Grandparents"],
              [["auntuncle"], "Aunts & Uncles"],
              [["cousin", "cousinkid"], "Cousins"],
              [["child"], "Children"],
            ]
              .map(([e, t]) => {
                const a = state.family.filter((t) => e.includes(t.kind) && relAge(t) >= 0 && famOn(t));
                return a.length
                  ? `<div class="sec">${t}</div>` +
                      a
                        .map((e) => {
                          const t = state.family.indexOf(e);
                          return e.dead
                            ? deadRow(`${e.first} ${e.last}`, relTitle(e), e)
                            : `<div class="row sm${e.celeb && ftOn() ? " ft-famous" : ""}" data-fam="${t}"><i class="fmc" data-fm="${t}"></i><div class="t"><b>${relName(e, e.last)} <em>(${relTitle(e)})</em>${ftStar(e)}</b>${relBar(e.rel)}</div>${CHEV}</div>`;
                        })
                        .join("")
                  : "";
              })
              .join("") +
            (state.lovers.length || state.exes.length
              ? '<div class="sec">Love</div>' +
                [...state.lovers]
                  .sort((e, t) => t.main - e.main)
                  .map((e) => {
                    const t = state.lovers.indexOf(e);
                    return `<div class="row sm" data-lover="${t}"><i class="lvf" data-lvi="${t}"></i><div class="t"><b>${e.first} ${e.last} <em>(${loverTitle(e)})</em></b>${relBar(e.rel)}</div>${CHEV}</div>`;
                  })
                  .join("") +
                (state.exes.length
                  ? `<div class="row" data-exes="1"><img src="love/exes.png"><div class="t"><b>Exes</b><span>View your exes</span></div>${CHEV}</div>`
                  : "")
              : "") +
            ((e = window.petExtraRows ? window.petExtraRows() : ""),
            state.pets.length || e
              ? '<div class="sec">Pets</div>' +
                state.pets
                  .map(
                    (e, t) =>
                      `<div class="row sm" data-pet="${t}"><img src="${petSprite(e)}"><div class="t"><b>${e.name} <em>(${"family" === e.owner ? "Family " : ""}${e.breed})</em></b>${relBar(e.rel)}</div>${CHEV}</div>`,
                  )
                  .join("") +
                e
              : "") +
            (state.friends.length
              ? '<div class="sec">Friends</div>' +
                state.friends
                  .map(
                    (e, t) =>
                      `<div class="row sm" data-fr="${t}"><i class="ffc" data-ff="${t}"></i><div class="t"><b>${e.first} ${e.last} <em>(${e.best ? "Best Friend" : "Friend"}${e.away ? ", moved away" : ""})</em></b>${relBar(e.rel)}</div>${CHEV}</div>`,
                  )
                  .join("")
              : "") +
            ftLateRows() +
            (state.age >= 13
              ? '<div class="shopbtn" id="spendAll"><img src="emoji/1f570-fe0f.png" alt="" style="width:44px;height:44px"><span>Spend Time With All...</span></div>'
              : "")),
          fillParentFaces(),
          fillFriendFaces(),
          fillFamilyFaces(),
          ftBindLate();
        const t = document.getElementById("spendAll");
        t &&
          (t.onclick = () => {
            play("choice"), spendTimeWithAll();
          }),
          sList.querySelectorAll("[data-p]").forEach((e) => (e.onclick = () => openParent(+e.dataset.p))),
          sList
            .querySelectorAll("[data-fam]")
            .forEach((e) => (e.onclick = () => openRelative(+e.dataset.fam))),
          sList.querySelectorAll("[data-fr]").forEach((e) => (e.onclick = () => openFriend(+e.dataset.fr))),
          sList.querySelectorAll("[data-pet]").forEach((e) => (e.onclick = () => openPet(+e.dataset.pet))),
          sList.querySelectorAll("i.lvf").forEach((e) => {
            const t = state.lovers[+e.dataset.lvi];
            e.replaceWith(npcFace(t.look, t.g, loverAge(t), moodOf(t.rel), "face"));
          }),
          sList
            .querySelectorAll("[data-lover]")
            .forEach((e) => (e.onclick = () => openLover(+e.dataset.lover)));
        const a = sList.querySelector("[data-exes]");
        a && (a.onclick = openExes), screen.classList.add("open");
      }
      navWatch(sList, 1), navWatch(sBack.parentElement, -1);
      const livesAbroad = (e) => !!e && !!e.livesIn && e.livesIn !== state.country;
      function leaveCountry(e = () => !1) {
        const t = state.country;
        (state.props || []).forEach((e) => {
          e.country ||= t;
        }),
          [
            ...(state.parents || []),
            ...(state.family || []),
            ...(state.friends || []),
            ...(state.lovers || []),
          ].forEach((a) => {
            a.dead || (e(a) ? delete a.livesIn : (a.livesIn ||= t));
          });
      }
      const keepHousehold = (e) => e === state.spouse || e.married || ("child" === e.kind && relAge(e) < 18);
      function spendTimeWithAll() {
        const e = [
          ...state.parents
            .filter((e) => !e.dead && !livesAbroad(e))
            .map((e) => [e, "your " + ("Mother" === e.role ? "mother" : "father")]),
          ...state.lovers
            .filter((e) => !livesAbroad(e))
            .map((e) => [e, `your ${loverTitle(e).toLowerCase()}, ${e.first}`]),
          ...state.family
            .filter((e) => !e.dead && famOn(e) && relAge(e) >= 0 && !livesAbroad(e))
            .map((e) => [e, `your ${relTitle(e).toLowerCase()}, ${e.first}`]),
          ...state.friends.filter((e) => !livesAbroad(e)).map((e) => [e, `your friend, ${e.first}`]),
        ];
        jCard({
          tag: "Family",
          iconSrc: "emoji/1f570-fe0f.png",
          title: "Spend Time",
          lead: "Spend time with each of your relationships!",
          rows: [["Relationships", e.length]],
          close: !0,
          choices: [
            [
              "Spend time with them",
              () => {
                if ((screen.classList.remove("open"), !e.length))
                  return notice(
                    "Nobody around",
                    "You don't have anyone to spend time with right now.",
                    null,
                    !0,
                  );
                if (state.spentAllAt === state.age)
                  return notice("Already done", "You already spent time with everyone this year.", null, !0);
                state.spentAllAt = state.age;
                const t = [],
                  a = [];
                e.forEach(([e, o]) => {
                  e.seenAt = state.age;
                  e.rel < 25 || (e.rel < 40 && chance(0.5))
                    ? ((e.rel = clamp(e.rel - rint(0, 2))), a.push(o))
                    : ((e.rel = clamp(e.rel + rint(3, 8))), t.push(o));
                });
                const o = (e) =>
                    e.length < 2
                      ? e.join("")
                      : 2 === e.length
                        ? e[0] + (e[0].includes(",") ? ", and " : " and ") + e[1]
                        : e.slice(0, -1).join(", ") + ", and " + e[e.length - 1],
                  n = t.length ? depressedFamilyTime() : null;
                fx(
                  {
                    Happiness:
                      t.length && "still down" !== n ? (n ? +rint(6, 12) : Math.min(10, 2 + t.length)) : 0,
                  },
                  "",
                );
                const s = (e) => e.charAt(0).toUpperCase() + e.slice(1);
                t.length && say(`I spent time with ${o(t).replace(/\byour\b/g, "my")}.`),
                  a.length && say(`${s(o(a).replace(/\byour\b/g, "my"))} refused to spend time with me.`),
                  notice(
                    t.length ? "Time well spent" : "Nobody showed up",
                    (t.length ? `You spent time with ${o(t)}.` : "") +
                      (a.length
                        ? `${t.length ? "<br><br>" : ""}${s(o(a))} refused to spend time with you.`
                        : ""),
                    null,
                    !0,
                  );
              },
            ],
          ],
        });
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || state.age < 5) return;
        const e = ["sibling", "halfsibling", "stepsibling"],
          t = [
            ...state.parents.filter((e) => !e.dead),
            ...state.family.filter((t) => !t.dead && e.includes(t.kind) && relAge(t) >= 3),
          ];
        for (const e of t) {
          e.seenAt ??= state.age - 1;
          const t = state.age - e.seenAt;
          t < 2 || (e.rel = clamp(e.rel - Math.min(6, rint(1, 3) + Math.floor(t / 3))));
        }
      }),
        (state.friends = []);
      const friendAge = (e) => Math.max(0, state.age + e.ageOffset),
        moodOf = (e) => (e < 25 ? "sad" : e < 40 ? "angry" : "happy"),
        relGain = (e, t, a) => Math.max(1, Math.round(rint(t, a) * (1 + (55 - clamp(e.rel)) / 90)));
      function fillFriendFaces() {
        sList.querySelectorAll("i.ffc").forEach((e) => {
          const t = state.friends[+e.dataset.ff];
          e.replaceWith(npcFace(t.look, t.g, friendAge(t), moodOf(t.rel), "face"));
        });
      }
      function fillFamilyFaces() {
        sList.querySelectorAll("i.fmc").forEach((e) => {
          const t = state.family[+e.dataset.fm];
          e.replaceWith(npcFace(t.look, t.g, relAge(t), moodOf(t.rel), "face"));
        });
      }
      function openRelative(e) {
        if (state.family[e] && "child" === state.family[e].kind) return openChild(e);
        const t = state.family[e],
          a = "m" === t.g ? "him" : "her",
          o = relLabel(t),
          n = relAge(t),
          s = /stepsibling$/.test(t.kind),
          r = state.age >= 18 && n >= 18,
          i = s
            ? [
                ["cut", "love/exes.png", "Cut Ties", `Stop having anything to do with ${a}`],
                ...(state.age >= 12 && canDate(n)
                  ? [["askout", "occ/cw-askout.png", "Ask Out", `Ask ${a} out`]]
                  : []),
                ...(r ? [["hookup", "occ/cw-hookup.png", "Hook Up", `Hook up with ${a}`]] : []),
              ]
            : [];
        (sTitle.textContent = relTitle(t).toUpperCase()),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openRelationships),
          (sList.innerHTML =
            `<div class="row sm" data-prof="1"><i class="fmc" data-fm="${e}"></i><div class="t"><b>${relName(t, t.last)} <em>(Age ${n})</em></b>${relBar(t.rel)}</div>${DOTS}</div>\n       <div class="row sm" data-a="edit"><img src="rel/edit.png"><div class="t"><b>Edit</b><span>Edit ${a}</span></div>${GOD_SEAL}</div>\n       <div class="sec">Activities</div>` +
            relActRows(a, i)),
          fillFamilyFaces(),
          (sList.querySelector("[data-prof]").onclick = () =>
            profileCard(t, n, relName(t, t.last), relTitle(t)));
        const l = `${t.first} ${t.last}`,
          c = "f" === t.g ? "she" : "he";
        bindRelActs(t, { role: relTitle(t), name: l, g: t.g, age: n }, () => openRelative(e), {
          edit: () => godEdit(t, { role: relTitle(t), age: n, g: t.g }, () => openRelative(e)),
          hookup: () => hookUpWith(t, l, o, n),
          askout: () => {
            t.sexuality ??= chance(0.85) ? "Straight" : pickR(["Gay", "Bisexual"]);
            const e = "Straight" === t.sexuality ? t.g !== PG() : "Gay" !== t.sexuality || t.g === PG();
            if (
              (screen.classList.remove("open"),
              e && t.rel >= 40 && chance(romanceOdds(t, { base: 0.45, rel: t.rel })))
            ) {
              const e = makeLover({ g: t.g, ages: [n, n] });
              Object.assign(e, {
                first: t.first,
                last: t.last,
                look: t.look,
                ageOffset: n - state.age,
                rel: Math.max(60, t.rel),
                sexuality: t.sexuality,
              }),
                state.family.splice(state.family.indexOf(t), 1);
              const a = addLover(e);
              return (
                (state.stats.Happiness = clamp(state.stats.Happiness + rint(5, 10))),
                renderStats(),
                say(`I asked out my ${o}, ${l}, and ${c} said yes!`),
                notice(
                  "Love is in the air",
                  `You asked out your ${o}, ${l}, and ${c} said yes! You are now dating.${a}`,
                  null,
                  !0,
                )
              );
            }
            (t.rel = clamp(t.rel - rint(6, 14))),
              renderStats(),
              say(`I asked out my ${o}, ${l}, but ${c} said no.`),
              notice("Awkward", `${l} said no. Family dinners are going to be weird for a while.`, null, !0);
          },
          cut: () =>
            iosConfirm("Confirm", `Are you sure you want to cut ties with ${t.first}?`, () => {
              state.family.splice(state.family.indexOf(t), 1),
                say(`I cut ties with my ${o}, ${t.first}.`),
                openRelationships();
            }),
        });
      }
      function openChild(e) {
        const t = state.family[e],
          a = "m" === t.g ? "him" : "her",
          o = "m" === t.g ? "He" : "She",
          n = relLabel(t),
          s = relAge(t);
        (sTitle.textContent = n.toUpperCase()),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openRelationships);
        const r = (e, t, a, o, n, s = DOTS) =>
            `<div class="row sm${n ? "" : " dis"}"${n ? ` data-ca="${e}"` : ""}><img src="${t}"><div class="t"><b>${a}</b><span>${o}</span></div>${n ? s : ""}</div>`,
          i = GOD_SEAL;
        let l;
        if (t.abandoned) {
          const e = document.createElement("div");
          (e.innerHTML = relActRows(a)),
            e.querySelectorAll("[data-a]").forEach((e) => {
              "gift" !== e.dataset.a &&
                (e.removeAttribute("data-a"), e.classList.add("dis"), e.querySelector(".dots")?.remove());
            }),
            (l =
              e.innerHTML +
              r("reconnect", "night/reconnect.png", "Reconnect", `Try to reconnect with ${a}`, !0));
        } else
          l =
            (s < 18
              ? r("abandon", "night/abandon.png", "Abandon", `Abandon ${a}`, !0) +
                r("adoptout", "night/adoptout.png", "Adopt Out", `Put ${a} up for adoption`, s < 18)
              : "") +
            r("doctor", "night/doctor.png", "Doctor", `Take ${a} to the doctor`, !0) +
            (s >= 4
              ? relActRows(a)
              : r("recruit", "rel/recruit.png", "Recruit", `Recruit ${a} for your cult`, !1) +
                r("spy", "rel/spy.png", "Spy", `Spy on ${a}`, !1));
        (sList.innerHTML =
          `<div class="row sm" data-prof="1"><i class="fmc" data-fm="${e}"></i><div class="t"><b>${t.first} ${t.last} <em>(Age ${s})</em></b>${relBar(t.rel)}</div>${DOTS}</div>` +
          r("edit", "rel/edit.png", "Edit", `Edit ${a}`, !0, i) +
          '<div class="sec">Activities</div>' +
          l +
          (s < 4 && !t.abandoned ? r("switch", "night/switch.png", "Switch Lives", `Play as ${a}`, !0) : "")),
          fillFamilyFaces(),
          (sList.querySelector("[data-prof]").onclick = () =>
            profileCard(t, s, `${t.first} ${t.last}`, relTitle(t)));
        const c = (e, t) => {
            screen.classList.remove("open"), renderStats(), notice(e, t, null, !0);
          },
          d = {
            edit: () => godEdit(t, { role: n, age: s, g: t.g }, () => openChild(e)),
            switch: () => confirmSwitch(t, s),
            abandon: () =>
              iosConfirm("Confirm", `Are you sure you want to abandon your ${n}, ${t.first}?`, () => {
                (t.abandoned = !0),
                  (t.rel = 0),
                  say(`I abandoned my ${n}, ${t.first}.`),
                  c("Adios", `You abandoned your ${n}, ${t.first}.`);
              }),
            adoptout: () =>
              iosConfirm(
                "Confirm",
                `Are you sure you want to put your ${n}, ${t.first}, up for adoption?`,
                () => {
                  (t.adoptedOut = !0),
                    state.family.splice(state.family.indexOf(t), 1),
                    say(`I put my ${n}, ${t.first}, up for adoption.`),
                    c("Goodbye", `You put your ${n}, ${t.first}, up for adoption.`);
                },
              ),
            doctor: () => {
              const e = chance(0.15);
              e && (state.stats.Happiness = clamp(state.stats.Happiness - 2)),
                say(`I took my ${n}, ${t.first}, to the doctor.`),
                c(
                  "Checkup",
                  e
                    ? `The doctor found a mild ear infection and prescribed ${t.first} some antibiotics.`
                    : `The doctor says your ${n}, ${t.first}, is perfectly healthy!`,
                );
            },
            reconnect: () => {
              if (chance(0.3 + Math.min(0.3, s / 60)))
                return (
                  (t.abandoned = !1),
                  (t.rel = rint(15, 35)),
                  say(`I reconnected with my ${n}, ${t.first}.`),
                  c(
                    "Reunited",
                    `You reconnected with your ${n}, ${t.first}. ${o}'s willing to give you another chance.`,
                  )
                );
              say(
                `I tried to reconnect with my ${n}, ${t.first}, but ${chHe(t)} wants nothing to do with me.`,
              ),
                c("Rejected", `Your ${n}, ${t.first}, wants nothing to do with you.`);
            },
          };
        sList
          .querySelectorAll("[data-ca]")
          .forEach((e) => (e.onclick = () => d[e.dataset.ca] && d[e.dataset.ca]())),
          bindRelActs(
            t,
            { role: relTitle(t), name: `${t.first} ${t.last}`, g: t.g, age: s },
            () => openChild(e),
            d,
          );
      }
      const chHis = (e) => ("m" === e.g ? "his" : "her"),
        chHe = (e) => ("m" === e.g ? "he" : "she");
      function addFriend(e, t, a) {
        const o = state.friends.find((t) => t.first === e.first && t.last === e.last);
        o
          ? "school" === a && (o.school = !0)
          : state.friends.push({
              first: e.first,
              last: e.last,
              g: e.g,
              look: e.look,
              ageOffset: e.age - state.age,
              rel: t,
              ...("school" === a ? { school: !0 } : {}),
            });
      }
      const schoolPal = (e) =>
        !!e.school ||
        !(
          !state.school ||
          !(state.school.classmates || []).some((t) => t.first === e.first && t.last === e.last)
        );
      function openFriend(e) {
        const t = state.friends[e],
          a = "m" === t.g ? "him" : "her";
        t.g;
        (sTitle.textContent = "FRIEND"), (sBack.innerHTML = BACK_ICON), (sBack.onclick = openRelationships);
        const o = state.age >= 18 && friendAge(t) >= 18;
        (sList.innerHTML =
          `<div class="row sm" data-prof="1"><i class="ffc" data-ff="${e}"></i><div class="t"><b>${t.first} ${t.last} <em>(Age ${friendAge(t)})</em></b>${relBar(t.rel)}</div>${DOTS}</div>\n       <div class="row sm" data-a="edit"><img src="rel/edit.png"><div class="t"><b>Edit</b><span>Edit ${a}</span></div>${GOD_SEAL}</div>\n       <div class="sec">Activities</div>` +
          relActRows(a, [
            ["end", "love/exes.png", "End Friendship", `Stop being friends with ${a}`],
            ...(state.age >= 12 && canDate(friendAge(t))
              ? [["askout", "occ/cw-askout.png", "Ask Out", `Ask ${a} out`]]
              : []),
            ...(o ? [["hookup", "occ/cw-hookup.png", "Hook Up", `Hook up with ${a}`]] : []),
          ])),
          fillFriendFaces(),
          (sList.querySelector("[data-prof]").onclick = () =>
            profileCard(t, friendAge(t), `${t.first} ${t.last}`, "Friend")),
          bindRelActs(
            t,
            { role: "Friend", name: `${t.first} ${t.last}`, g: t.g, age: friendAge(t) },
            () => openFriend(e),
            {
              edit: () => godEdit(t, { role: "Friend", age: friendAge(t), g: t.g }, () => openFriend(e)),
              hookup: () => hookUpWith(t, `${t.first} ${t.last}`, "friend", friendAge(t)),
              askout: () => askOutFriend(t),
              end: () =>
                iosConfirm("Confirm", `Are you sure you want to end your friendship with ${t.first}?`, () => {
                  state.friends.splice(state.friends.indexOf(t), 1),
                    say(`I ended my friendship with ${t.first}.`),
                    openRelationships();
                }),
            },
          );
        window.FL_FEMBOY && window.FL_FEMBOY.decorate(t, e, () => openFriend(e));
      }
      function hookUpWith(e, t, a, o, n) {
        e.sexuality ??= chance(0.85) ? "Straight" : pickR(["Gay", "Bisexual"]);
        const s = "Straight" === e.sexuality ? e.g !== PG() : "Gay" !== e.sexuality || e.g === PG(),
          r = "f" === e.g ? "she" : "he";
        if (
          (screen.classList.remove("open"),
          !(s && e.rel >= 30 && chance(romanceOdds(e, { base: 0.5, rel: e.rel }))))
        )
          return (
            (e.rel = clamp(e.rel - rint(5, 12))),
            renderStats(),
            say(`I tried to hook up with my ${a}, ${t}, but ${r} said no.`),
            notice("Rejected", `${t} turned you down. Things are a little awkward between you now.`, null, !0)
          );
        (e.rel = clamp(e.rel + rint(3, 8))), n && n();
        const i = state.lovers.find((e) => e.main);
        safeSexCard(
          {
            first: e.first,
            last: e.last,
            g: e.g,
            look: e.look,
            ageOffset: o - state.age,
            sexuality: e.sexuality,
            looks: e.looks,
          },
          i,
        );
      }
      function askOutFriend(e) {
        const t = `${e.first} ${e.last}`,
          a = friendAge(e),
          o = "f" === e.g ? "she" : "he",
          n = "f" === e.g ? "She" : "He";
        e.sexuality ??= chance(0.85) ? "Straight" : pickR(["Gay", "Bisexual"]);
        const s = "Straight" === e.sexuality ? e.g !== PG() : "Gay" !== e.sexuality || e.g === PG();
        if (
          (screen.classList.remove("open"),
          s && e.rel >= 40 && chance(romanceOdds(e, { base: 0.55, rel: e.rel })))
        ) {
          const n = makeLover({ g: e.g, ages: [a, a] });
          Object.assign(n, {
            first: e.first,
            last: e.last,
            look: e.look,
            ageOffset: a - state.age,
            rel: Math.max(60, e.rel),
            sexuality: e.sexuality,
          }),
            frEnd(e);
          const s = addLover(n);
          return (
            (state.stats.Happiness = clamp(state.stats.Happiness + rint(5, 10))),
            renderStats(),
            say(`I asked out my friend ${t}, and ${o} said yes!`),
            notice(
              "Love is in the air",
              `You asked out your friend ${t}, and ${o} said yes! You are now dating.${s}`,
              null,
              !0,
            )
          );
        }
        if (((e.dateNo = (e.dateNo || 0) + 1), (e.rel = clamp(e.rel - rint(5, 12))), e.dateNo >= 3))
          return (
            frEnd(e),
            renderStats(),
            say(`I kept asking my friend ${t} out, so ${o} ended our friendship.`),
            notice(
              "Unfriended",
              `You kept asking ${t} out even after ${o} said no. ${n} doesn't want to be friends anymore.`,
              null,
              !0,
            )
          );
        renderStats(),
          say(`I asked out my friend ${t}, but ${o} said no.`),
          notice(
            "Rejected",
            2 === e.dateNo
              ? `${t} said no again and told you to stop asking.`
              : `${t} said ${o} only sees you as a friend.`,
            null,
            !0,
          );
      }
      function relActRows(e, t = []) {
        return [
          ...[
            ["askmoney", "rel/askmoney.png", "Ask for Money", `Ask ${e} for money`, 1],
            ["compliment", "rel/compliment.png", "Compliment", `Pay ${e} a compliment`, 1],
            ["talk", "rel/talk.png", "Conversation", `Have a conversation with ${e}`, 1],
            ["deal", "rel/deal.png", "Deal", `Sell something to ${e}`, 1],
            ["gift", "rel/gift.png", "Gift", `Give ${e} a gift`, 1],
            ["givemoney", "rel/givemoney.png", "Give Money", `Give ${e} some money`, 1],
            ["insult", "rel/insult.png", "Insult", `Insult ${e}`, 1],
            ["movie", "rel/movie.png", "Movie Theater", `Go to the movies with ${e}`, 1],
            ["recruit", "rel/recruit.png", "Recruit", `Recruit ${e} for your cult`, 0],
            ["time", "rel/time.png", "Spend Time", `Spend time with ${e}`, 1],
            ["spy", "rel/spy.png", "Spy", `Spy on ${e}`, 0],
            ["switch", "night/switch.png", "Switch Lives", `Play as ${e}`, 1],
          ],
          ...t.map((e) => [...e, 1]),
        ]
          .sort((e, t) => e[2].localeCompare(t[2]))
          .map(
            ([e, t, a, o, n]) =>
              `<div class="row sm ${n ? "" : "dis"}" ${n ? `data-a="${e}"` : ""}><img src="${t}"><div class="t"><b>${a}</b><span>${o}</span></div>${n ? DOTS : ""}</div>`,
          )
          .join("");
      }
      function bindRelActs(e, t, a, o = {}) {
        sList.querySelectorAll("[data-a]").forEach(
          (n) =>
            (n.onclick = () => {
              const s = n.dataset.a;
              return o[s] ? o[s]() : "switch" === s ? confirmSwitch(e, t.age) : void parentAction(e, s, a, t);
            }),
        );
      }
      function fillParentFaces() {
        sList.querySelectorAll("i.face").forEach((e) => {
          const t = state.parents[+e.dataset.face];
          e.replaceWith(
            npcFace(
              t.look,
              t.gender,
              t.ageAtBirth + state.age,
              t.rel < 25 ? "sad" : t.rel < 40 ? "angry" : "happy",
              "face",
            ),
          );
        });
      }
      function openParent(e) {
        const t = state.parents[e];
        (sTitle.textContent = t.role.toUpperCase()),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openRelationships);
        const a = (e, t, a, o, n) =>
            `<div class="row sm ${o ? "" : "dis"}" ${n ? `data-a="${n}"` : ""}><img src="rel/${e}.png"><div class="t"><b>${t}</b><span>${a}</span></div>${o ? DOTS : ""}</div>`,
          o = "f" === t.gender ? "her" : "him";
        (sList.innerHTML =
          `<div class="row sm" data-prof="1"><i class="face" data-face="${e}"></i><div class="t"><b>${relName(t, SURNAME)} <em>(Age ${t.ageAtBirth + state.age})</em></b>${relBar(t.rel)}</div>${DOTS}</div>\n       <div class="row sm" data-a="edit"><img src="rel/edit.png"><div class="t"><b>Edit</b><span>Edit ${o}</span></div>${GOD_SEAL}</div>\n       <div class="sec">Activities</div>` +
          a("askmoney", "Ask for Money", `Ask ${o} for money`, !0, "askmoney") +
          a("compliment", "Compliment", `Pay ${o} a compliment`, !0, "compliment") +
          a("talk", "Conversation", `Have a conversation with ${o}`, !0, "talk") +
          a("deal", "Deal", `Sell something to ${o}`, !0, "deal") +
          a("gift", "Gift", `Give ${o} a gift`, !0, "gift") +
          a("givemoney", "Give Money", `Give ${o} some money`, !0, "givemoney") +
          a("insult", "Insult", `Insult ${o}`, !0, "insult") +
          a("movie", "Movie Theater", `Go to the movies with ${o}`, !0, "movie") +
          a("recruit", "Recruit", `Recruit ${o} for your cult`, !1) +
          a("time", "Spend Time", `Spend time with ${o}`, !0, "time") +
          a("spy", "Spy", `Spy on ${o}`, !1) +
          (t.dead ? "" : switchRow(o))),
          fillParentFaces(),
          (sList.querySelector("[data-prof]").onclick = () =>
            profileCard(t, t.ageAtBirth + state.age, relName(t, SURNAME), t.role)),
          sList.querySelectorAll("[data-a]").forEach(
            (a) =>
              (a.onclick = () => {
                const o = a.dataset.a;
                return "edit" === o
                  ? godEdit(t, { role: t.role, age: t.ageAtBirth + state.age, g: t.gender }, () =>
                      openParent(e),
                    )
                  : "switch" === o
                    ? confirmSwitch(t, t.ageAtBirth + state.age)
                    : void parentAction(t, o, () => openParent(e));
              }),
          );
      }
      const DEAL_ITEMS = [
          "A Homemade Flamethrower",
          "A Portable Speaker",
          "A Stolen Library Book",
          "A Jar Of Nutmeg",
          "A Reusable Water Bottle",
          "Some Used Gym Socks",
          "A Signed Baseball",
          "A Lava Lamp",
          "A Broken Toaster",
          "A Pet Rock",
          "A Vintage Lunchbox",
          "A Knockoff Rolex",
          "A Bag Of Marbles",
          "A Haunted Doll",
        ],
        GIFT_ITEMS = [
          ["Can opener", 5],
          ["Poker set", 36],
          ["Box of mismatched socks", 3],
          ["Vase of orchids", 45],
          ["Bouquet of tulips", 36],
          ["Scented candles", 15],
          ["Coffee mug", 8],
          ["Box of chocolates", 20],
          ["Bottle of wine", 30],
          ["Silk tie", 40],
          ["Leather wallet", 60],
          ["Gold watch", 450],
        ],
        MOVIES = [
          ["My Budding Flower", "Indie"],
          ["Explosion Street 4", "Action"],
          ["The Last Laugh", "Comedy"],
          ["Whispers in the Attic", "Horror"],
          ["Love in Lisbon", "Romance"],
          ["Galaxy Raiders", "Sci-Fi"],
          ["The Quiet Orchard", "Drama"],
          ["Pocket Dragons", "Animation"],
          ["Case Closed", "Thriller"],
        ],
        TALK_TOPICS = [
          "the secret ribbons on BitLife",
          "the weather",
          "politics",
          "your future",
          "the good old days",
          "sports",
          "their work",
          "a TV show",
          "family drama",
          "the news",
        ],
        INSULTS = [
          "a chump",
          "a loser",
          "a buffoon",
          "a dingbat",
          "a nincompoop",
          "a dork",
          "lazy",
          "ugly",
          "stupid",
        ],
        COMPLIMENTS = ["money", "smart", "beautiful", "hilarious", "a great cook", "kind", "stylish", "wise"],
        PARK_PLACES = [
          ["go to the park", "went to the park"],
          ["go for a walk", "went for a walk"],
          ["get ice cream", "got ice cream"],
          ["go fishing", "went fishing"],
          ["go bowling", "went bowling"],
          ["play mini golf", "played mini golf"],
          ["go to the beach", "went to the beach"],
        ],
        chaChing = () => {
          new Audio("sounds/a16_sndChaChing.wav").play().catch(() => {});
        };
      function parentAction(e, t, a, o) {
        if (
          ((o = o || {
            role: e.role,
            name: `${e.first} ${SURNAME}`,
            g: e.gender,
            age: e.ageAtBirth + state.age,
          }),
          ("time" === t || "movie" === t) && livesAbroad(e))
        ) {
          const a = (COUNTRIES[e.livesIn] || [e.livesIn])[0];
          return (
            screen.classList.remove("open"),
            notice(
              "Too far away",
              `Your ${o.role.toLowerCase()} lives in ${a}. You'll have to travel there to ${"movie" === t ? "go to the movies with" : "spend time with"} ${"f" === o.g ? "her" : "him"}.`,
              null,
              !0,
            )
          );
        }
        ["time", "movie", "talk", "gift"].includes(t) && (e.seenAt = state.age);
        const n = o.role.toLowerCase(),
          s = "f" === o.g,
          r = s ? "her" : "him",
          i = s ? "she" : "he",
          l = s ? "Her" : "His",
          c = o.age,
          d = profileOf(e, c),
          u = (e, t) =>
            `<div class="ev-bars nb"><b>${e}</b><i><u style="width:${Math.max(t, 1)}%;background:${barCol(t)}"></u></i></div>`,
          h = (e) =>
            `<div class="ev-bars nb">${e.map(([e, t]) => `<b>${e}</b><i><u style="width:${Math.max(t, 1)}%;background:${barCol(t)}"></u></i>`).join("")}</div>`,
          p = null,
          m = (...e) => {
            screen.classList.remove("open"), renderStats(), notice(...e);
          },
          f = () => e.rel < 20 && chance(0.7 - e.rel / 30),
          g = (t) => {
            (ev.innerHTML =
              `<div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div>\n        <div class="ev-tag" style="margin-top:12px"><canvas class="ev-av" width="250" height="250"></canvas><span class="who">${o.name}</span><span class="kind">${o.role}</span></div>` +
              t),
              ev.querySelector(".ev-av").replaceWith(npcFace(e.look, o.g, c, moodOf(e.rel), "ev-av")),
              (ev.style.overflow = "visible");
            const a = () => {
              evWrap.classList.remove("open"), (ev.style.overflow = "");
            };
            return (document.getElementById("propX").onclick = a), evWrap.classList.add("open"), a;
          };
        if ("askmoney" === t)
          return iosConfirm("Confirm", `Are you sure you want to ask your ${n} for money?`, () => {
            const t = (e.moneyAsks =
                e.moneyAsks && e.moneyAsks.age === state.age ? e.moneyAsks : { age: state.age, n: 0 }).n++,
              a = moneyPct(d.money),
              o = d.gen ?? 50,
              s = capFirst(i);
            if (t >= 4 && !chance(0.08)) {
              const t = rint(5, 10);
              return (
                (e.rel = clamp(e.rel - t)),
                say(`My ${n} told me to stop treating ${r} like an ATM.`),
                m(
                  "Stop Begging!",
                  `Your ${n} is getting annoyed by how frequently you ask ${r} for money!<br><br>${s} told you to stop treating ${r} like an ATM.`,
                  p,
                  !0,
                )
              );
            }
            const l = Math.max(
              0.02,
              Math.min(0.9, (o / 100) * (0.45 + a / 400 + e.rel / 500) + 0.03 - 0.13 * t),
            );
            if (d.money <= 0 || !chance(l)) {
              t && (e.rel = clamp(e.rel - rint(0, 3)));
              const a =
                pickR(
                  [
                    d.money < 1e3 && ` ${s} said ${i} can't afford it right now.`,
                    state.age >= 18 && ` ${s} told you to go find a job.`,
                    e.rel < 30 && ` ${s}'s still upset with you.`,
                    t && ` ${s} said ${i} already gave you money recently.`,
                    "",
                  ].filter((e) => !1 !== e),
                ) || "";
              return (
                say(`I asked my ${n} for money, but ${i} refused.`),
                m(
                  "No Money!",
                  `You asked your ${n} for some money, but ${i} refused to give you anything.${a}`,
                  p,
                  !0,
                )
              );
            }
            const [, c, u, h] = [
                [10, 1, 10, 20],
                [25, 5, 30, 60],
                [40, 15, 75, 150],
                [60, 30, 200, 500],
                [75, 75, 500, 1e3],
                [90, 150, 1500, 4e3],
                [99, 500, 4e3, 1e4],
                [100, 1e3, 6e3, 2e4],
              ].find((e) => a <= e[0]),
              f = chance(0.06) ? rint(u, h) : Math.round(c + (u - c) * Math.random() ** (1.6 - o / 100)),
              g = isOldEra()
                ? Math.max(0.05, Math.min(eraCash(f / 100), cents(0.1 * d.money)))
                : Math.max(
                    1,
                    Math.min(
                      Math.round(f * (PRICE_LVL[state.country] || 1)),
                      Math.max(1, Math.round(0.25 * d.money)),
                    ),
                  );
            (d.money -= g),
              (state.money += g),
              chaChing(),
              say(`My ${n} gave me ${usd(g)}.`),
              m("Money!", `You asked your ${n} for some money and ${i} gave you ${usd(g)}!`, p, !0);
          });
        if ("compliment" === t) {
          const t = pickR(COMPLIMENTS),
            a = clamp(rint(25, 95));
          return (
            (e.rel = clamp(e.rel + relGain(e, 3, 7))),
            say(`I called my ${n} ${t}.`),
            m("Big fan", `You called your ${n} ${t}.`, p, !0, u(`${l} Appreciation`, a))
          );
        }
        if ("talk" === t) {
          if (f())
            return (
              say(`I tried to talk to my ${n}, but ${i} ignored me.`),
              m("Denied", `Your ${n} didn't want to talk to you.`, p, !0)
            );
          const t = clamp(rint(20, 100));
          e.rel = clamp(e.rel + (t > 35 ? relGain(e, 4, 9) : rint(-2, 1)));
          const a = pickR(TALK_TOPICS);
          return (
            say(`My ${n} and I had a chat about ${a}.`),
            m("Let's talk", `You and your ${n} had a chat about ${a}.`, p, !0, u("Agreement", t))
          );
        }
        if ("time" === t) {
          if (f()) {
            const e = pickR(PARK_PLACES)[0];
            return (
              say(`I asked my ${n} to ${e}, but ${i} refused.`),
              m("Denied", `You asked your ${n} to ${e} but ${i} refused.`, p, !0)
            );
          }
          const [, t] = pickR(PARK_PLACES),
            a = rint(30, 100),
            o = rint(20, 100);
          e.rel = clamp(e.rel + relGain(e, 6, 14));
          const s = depressedFamilyTime();
          return (
            fx({ Happiness: "still down" === s ? 0 : s ? +rint(6, 12) : +rint(1, 4) }, ""),
            say(
              `My ${n} and I ${t}.${"still down" === s ? " I still felt down afterwards." : s ? " It really lifted my spirits." : ""}`,
            ),
            m(
              "Quality time",
              `You and your ${n} ${t}.${"still down" === s ? " It was nice, but you're still feeling down." : s ? " It really lifted your spirits." : ""}`,
              p,
              !0,
              h([
                ["Your Enjoyment", "still down" === s ? Math.min(a, 25) : a],
                [`${l} Enjoyment`, o],
              ]),
            )
          );
        }
        if ("insult" === t)
          return iosConfirm("Confirm", `Are you sure you want to insult your ${n}?`, () => {
            const t = pickR(INSULTS);
            if (
              ((e.rel = clamp(e.rel - rint(5, 12))),
              say(`I called my ${n} ${t}.`),
              m("Stay classy", `You called your ${n} ${t}!`, p, !0),
              chance(0.05))
            ) {
              const e = any(KID_HITS);
              return (
                say(`Things got heated and I ${e} my ${n}.`),
                queuePopup(() =>
                  notice(
                    "Things got heated",
                    `After you called your ${n} ${t}, things got heated and you ${e} ${r}!`,
                    () => {
                      if (!chance(0.6)) return o.onInsult && o.onInsult();
                      say(`My ${n} called the cops on me.`),
                        notice(
                          "What a snitch",
                          `Your ${n} called the cops on you!`,
                          () => arrest("assault"),
                          !0,
                        );
                    },
                    !0,
                  ),
                )
              );
            }
            o.onInsult && o.onInsult();
          });
        if ("deal" !== t)
          if ("gift" !== t) {
            if ("givemoney" === t) {
              const t = Math.max(1, mods.unlimitedGive ? state.money : Math.min(state.money, 1e4));
              if (state.money < 1) return m("Not enough", "You don't have any money to give.", null, !0);
              const a = g(
                  `<h4><img src="rel/givemoney.png"><span>Give Money</span></h4><div class="lead">Give your ${n} some money today!</div>\n        <table><tbody><tr><td style="text-align:center;padding-left:0"><b>Bank Balance:</b> ${usd(state.money)}</td></tr></tbody></table>\n        <div class="gm-row"><span class="hr-lab" style="margin:0">Amount</span><b id="gmAmt">${usd(t)}</b></div>\n        <input type="range" class="gm-range" id="gmRange" min="1" max="${t}" value="${t}">\n        <button class="jm-apply ev-btn" id="gmGo">Give it to ${r}</button>`,
                ),
                o = document.getElementById("gmRange");
              return (
                (o.oninput = () => (document.getElementById("gmAmt").textContent = usd(+o.value))),
                void (document.getElementById("gmGo").onclick = () => {
                  const t = +o.value;
                  a(), (state.money -= t), (d.money += t);
                  const s = clamp(Math.round(15 + 0.8 * Math.sqrt(t)));
                  (e.rel = clamp(e.rel + Math.max(2, Math.round(s / 6)))),
                    say(`I gave my ${n} ${usd(t)}.`),
                    m("Generous", `You gave your ${n} ${usd(t)}.`, p, !0, u(`${l} Appreciation`, s));
                })
              );
            }
            if ("movie" !== t);
            else {
              const [t, a] = pickR(MOVIES),
                o = g(
                  `<h4><img src="rel/movie.png"><span>Movie Theater</span></h4><div class="lead">Take your ${n} to the theater today!</div>\n        <table><tbody><tr><td style="text-align:center;padding-left:0"><b>Movie:</b> ${t}</td></tr><tr><td style="text-align:center;padding-left:0"><b>Genre:</b> ${a}</td></tr></tbody></table>\n        <button class="jm-apply ev-btn" id="mvGo">Take ${r} to the theater</button>`,
                );
              document.getElementById("mvGo").onclick = () => {
                if ((o(), screen.classList.remove("open"), f()))
                  return (
                    say(`I asked my ${n} to see a movie, but ${i} refused.`),
                    m("Denied", `You asked your ${n} to see a movie but ${i} refused.`, null, !0)
                  );
                const a = rint(10, 100),
                  s = rint(5, 100);
                (e.rel = clamp(e.rel + (s > 40 ? relGain(e, 5, 12) : rint(1, 4)))),
                  fx({ Happiness: +rint(2, 6) }, ""),
                  say(`I took my ${n} to the theater to see '${t}'.`),
                  m(
                    "Bravo",
                    `You took your ${n} to the theater to see '${t}'.`,
                    null,
                    !0,
                    h([
                      ["Your Enjoyment", a],
                      [`${l} Enjoyment`, s],
                    ]),
                  ),
                  achSeen.has("Moviegoer") || showAchievement("Moviegoer", "Go to a movie");
              };
            }
          } else {
            const t = g(
              `<h4><img src="rel/gift.png"><span>Gift</span></h4><div class="lead">Give your ${n} a gift today!</div>\n        <label class="hr-lab">Pick your gift:</label><div class="hr-sel"><select id="giftSel">${GIFT_ITEMS.map(([e, t], a) => `<option value="${a}">${e} (${usd(t)})</option>`).join("")}</select></div>\n        <button class="jm-apply ev-btn" id="giftGo">Give it to ${r}</button>`,
            );
            document.getElementById("giftGo").onclick = () => {
              const [a, o] = GIFT_ITEMS[+document.getElementById("giftSel").value];
              if ((t(), state.money < o))
                return m("Not enough", `You need ${usd(o)} for that gift.`, null, !0);
              state.money -= o;
              const s = clamp(Math.round(10 + 4 * Math.sqrt(o) + rint(-10, 20)));
              (e.rel = clamp(e.rel + Math.max(2, Math.round(s / 6)))),
                say(`I gave my ${n} a ${a.toLowerCase()}.`),
                m(
                  "Should I gift wrap it?",
                  `You gave your ${n} a ${a.toLowerCase()}.`,
                  p,
                  !0,
                  u(`${l} Appreciation`, s),
                );
            };
          }
        else {
          const t = g(
            `<h4><img src="rel/deal.png"><span>Deal</span></h4><div class="lead">Sell your ${n} something today!</div>\n        <label class="hr-lab">Pick an item:</label><div class="hr-sel"><select id="dealSel">${DEAL_ITEMS.map((e, t) => `<option value="${t}">${e}</option>`).join("")}</select></div>\n        <button class="jm-apply ev-btn" id="dealGo">Make ${r} an offer</button>`,
          );
          document.getElementById("dealGo").onclick = () => {
            const a = DEAL_ITEMS[+document.getElementById("dealSel").value];
            iosConfirm("Confirm", `Are you sure you want to try to sell something to your ${n}?`, () => {
              if ((t(), e.rel < 25 && chance(0.6)))
                return (
                  say(`I tried to sell ${a.toLowerCase()} to my ${n}, but ${i} wasn't interested.`),
                  m("No sale", `Your ${n} wasn't interested in buying ${a.toLowerCase()}.`, p, !0)
                );
              const o = rint(5, 120),
                s = clamp(Math.round(o / 1.4));
              (state.money += o),
                (d.money = Math.max(0, d.money - o)),
                chaChing(),
                say(`I sold ${a.toLowerCase()} to my ${n} for ${usd(o)}.`),
                m(
                  "The family discount",
                  `You sold ${a.toLowerCase()} to your ${n} for ${usd(o)}.`,
                  p,
                  !0,
                  u("Dealing", s),
                );
            });
          };
        }
      }
      state.props = [];
      const rint = (e, t) => e + Math.floor(Math.random() * (t - e + 1)),
        mortgageMonthly = (e) => {
          const t = 0.055 / 12,
            a = 0.8 * e;
          return Math.round((a * t * (1 + t) ** 360) / ((1 + t) ** 360 - 1));
        };
