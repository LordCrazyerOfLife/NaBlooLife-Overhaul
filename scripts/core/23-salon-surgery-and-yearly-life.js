      function updateDockTab() {
        const e = document.querySelector('.tab[data-tab="Occupation"]');
        if (!e || state.dead) return;
        const t = !state.school && state.age < 6,
          a = !!state.school || t || !!state.expelled,
          o = !!state.prison,
          n = !o && !a && !!state.job,
          s = o ? "prison" : t ? "locked" : a ? "school" : n ? "work" : "job",
          r = isOldEra() ? "-west" : "";
        if (e.dataset.mode === s && (e.dataset.west || "") === r) return;
        (e.dataset.mode = s),
          (e.dataset.west = r),
          e.dataset.jobIc || (e.dataset.jobIc = e.querySelector(".ic").innerHTML);
        const i = e.querySelector(".ic");
        i.classList.toggle("img", a || o || n),
          (i.innerHTML = o
            ? `<img src="prison/${state.prison.juv ? "tab-juv" : "tab"}${r}.png" alt="">`
            : n
              ? `<img src="occ/tab-job${r}.png" alt="">`
              : t
                ? `<img src="school/tab-infant${r}.png" alt="">`
                : a
                  ? `<img src="school/tab-school${r}.png" alt="">`
                  : e.dataset.jobIc),
          (e.querySelector("span").textContent = o
            ? state.prison.juv
              ? "Juvie"
              : "Prison"
            : n
              ? "Job"
              : t
                ? "Infant"
                : a
                  ? "School"
                  : "Occupation"),
          e.classList.remove("locked");
      }
      function openSalon() {
        (sTitle.textContent = "SALON & SPA"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities);
        const e = {
            barber: 14,
            nails: 14,
            shave: 16,
            dye: 18,
            massage: 18,
            tanning: 18,
            waxing: 18,
            surgery: 18,
            facetats: 18,
          },
          t = [
            SALON[0],
            [
              "barberx",
              "Barber Expanded",
              hairPackOn() ? "Try the Hair Pack styles" : "Try the shaggy styles",
              "barber",
            ],
            ...(gangTatsOn()
              ? [
                  [
                    "gangtats",
                    gangModOn() ? "Gang Tattoos" : "Tattoo Parlor",
                    tatGangsOn()
                      .map((e) => e.name)
                      .join(" · "),
                    "tattoo/teardrop",
                  ],
                ]
              : []),
            ["facetats", "Face Tattoos", "Full face ink", "tattoo/teardrop"],
            ...SALON.slice(1),
          ];
        (sList.innerHTML = t
          .map(([t, a, o, n]) => {
            const s = state.age < (e[t] ?? e[n || t] ?? 0);
            return `<div class="row${s ? " dis" : ""}" data-sal="${t}"><img src="${(n || t).includes("/") ? n : "salon/" + (n || t)}.png"><div class="t"><b>${"barber" === t && "f" === PG() ? "Hair Stylist" : a}</b><span>${o}</span></div>${s ? "" : DOTS}</div>`;
          })
          .join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-sal]").forEach(
            (e) =>
              (e.onclick = () => {
                e.classList.contains("dis") || SALON_OPEN[e.dataset.sal]();
              }),
          );
      }
      const SURGERIES = [
          {
            id: "botox",
            name: "Botox",
            desc: "Smooth out the wrinkles",
            price: [500, 1500],
            gain: [2, 6],
            loss: [3, 15],
            ok: "Wrinkle free",
            fail: "Your expression is now uneven.",
          },
          {
            id: "eyelid",
            name: "Eyelid Surgery",
            desc: "Reveal your beautiful eyes",
            price: [2500, 6e3],
            gain: [4, 10],
            loss: [10, 35],
            ok: "Bright eyed",
            fail: "Your eyelids healed unevenly.",
          },
          {
            id: "facelift",
            name: "Face Lift",
            desc: "Look years younger",
            price: [6e3, 18e3],
            gain: [8, 20],
            loss: [20, 70],
            ok: "Feeling a little stiff",
            fail: "Your features are uneven and pulled too tight.",
          },
          {
            id: "gender",
            name: "Gender Reassignment",
            desc: "Your body and identity become one",
            price: [15e3, 4e4],
            gain: [0, 4],
            loss: [5, 25],
            ok: "A new you",
            fail: "There were complications that need follow-up care.",
            identity: !0,
          },
          {
            id: "lipo",
            name: "Liposuction",
            desc: "Remove unwanted body fat",
            price: [3500, 1e4],
            gain: [4, 12],
            loss: [10, 35],
            ok: "Slimmed down",
            fail: "It left your body lumpy and uneven.",
          },
          {
            id: "nose",
            name: "Nose Job",
            desc: "Refine your facial aesthetic",
            price: [4e3, 12e3],
            gain: [6, 18],
            loss: [15, 60],
            ok: "Nice nose",
            fail: "Your nose is now noticeably crooked.",
          },
          {
            id: "penis",
            name: "Penis Enlargement Surgery",
            desc: "Feel better about your manhood",
            price: [6e3, 14e3],
            gain: [0, 8],
            loss: [8, 30],
            ok: "Feeling bigger",
            fail: "It caused an injury and the result is disappointing.",
            only: "m",
          },
          {
            id: "breast",
            name: "Breast Augmentation",
            desc: "Enhance your figure",
            price: [5e3, 12e3],
            gain: [5, 15],
            loss: [10, 40],
            ok: "Looking full",
            fail: "The result is noticeably uneven.",
            only: "f",
          },
          {
            id: "bbl",
            name: "Brazilian Butt Lift",
            desc: "Get a fuller figure",
            price: [7e3, 18e3],
            gain: [5, 15],
            loss: [15, 45],
            ok: "Turning heads",
            fail: "It left an uneven shape.",
            only: "f",
          },
          {
            id: "tummy",
            name: "Tummy Tuck",
            desc: "Contour your abdomen",
            price: [6e3, 15e3],
            gain: [5, 15],
            loss: [15, 45],
            ok: "Flat stomach",
            fail: "It left you uneven with visible scarring.",
          },
        ],
        surgOdds = (e) => ({ fatal: 0.002 * (1 - e / 100), success: 0.55 + 0.004 * e }),
        SURG_TIERS = {
          disappointing: [0, [0, 3], [3, 10]],
          minor: [0.25, [2, 8], [8, 15]],
          serious: [0.65, [10, 30], [15, 40]],
          catastrophic: [1, [30, 70], [35, 70]],
        },
        surgLow = (e) => e.name.toLowerCase(),
        banSurgeon = (e) => {
          const t = (state.surgeonBans ||= []);
          t.includes(e.name) || t.push(e.name);
        };
      function openSurgery() {
        (sTitle.textContent = "PLASTIC SURGERY"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities),
          (sList.innerHTML = SURGERIES.map((e) => {
            const t = e.only && e.only !== PG();
            return `<div class="row sg${t ? " dis" : ""}" data-sg="${e.id}"><img src="surgery/${e.id}.png"><div class="t"><b>${e.name}</b><span>${e.desc}</span></div>${t ? "" : DOTS}</div>`;
          }).join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-sg]").forEach(
            (e) =>
              (e.onclick = () => {
                e.classList.contains("dis") ||
                  (play("choice"), surgeonCard(SURGERIES.find((t) => t.id === e.dataset.sg)));
              }),
          ),
          screen.classList.add("open");
      }
      function surgeonCard(e) {
        if (state.age < 18)
          return notice("Too Young", "You must be at least 18 to book this procedure.", null, !0);
        if ((state.surgeryRecover ?? -1) >= state.age)
          return notice(
            "Still Recovering",
            "You are still recovering from your previous procedure.",
            null,
            !0,
          );
        const t = (state.surgeonBans ||= []),
          a = [...DOC_LAST, "Alexander", "Campbell", "Vale", "Flint", "Sterling", "Monroe"]
            .sort(() => Math.random() - 0.5)
            .filter((e) => !t.includes(`Dr. ${e}`))
            .slice(0, 2)
            .map((t) => ({ name: `Dr. ${t}`, rep: rint(5, 100), quote: localPrice(rint(...e.price)) }));
        jCard({
          tag: "Surgery",
          iconSrc: "surgery/surgeon.png",
          title: "Plastic Surgeon",
          close: !0,
          lead: `Which local plastic surgeon will you consult for ${/^[aeiou]/i.test(e.name) ? "an" : "a"} ${surgLow(e)} procedure?`,
          bars: a.map((e) => [`${e.name}'s Reputation`, e.rep, e.rep < 25 ? "#b3261e" : "#2fa03b"]),
          choices: a.map((t) => [t.name, () => setTimeout(() => surgeryConfirm(e, t), 80)]),
        });
      }
      function surgeryConfirm(e, t) {
        const a = surgLow(e);
        jCard({
          tag: "Surgery",
          iconSrc: `surgery/${e.id}.png`,
          title: e.name,
          surprise: !0,
          lead: `${t.name} has inspected you closely and determined that you are eligible for ${/^[aeiou]/i.test(e.name) ? "an" : "a"} ${a}.`,
          rows: [["Cost", usd(t.quote)]],
          choices: [
            [
              "Get the surgery",
              () => {
                if (state.money < t.quote)
                  return notice(
                    "Not enough",
                    `You need another ${usd(t.quote - state.money)} to afford this operation.`,
                    null,
                    !0,
                  );
                (state.money -= t.quote),
                  (state.surgeryRecover = state.age),
                  renderStats(),
                  screen.classList.remove("open"),
                  resolveSurgery(e, t);
              },
            ],
            [
              "No way I'm doing that",
              () => {
                say(`I decided not to get ${/^[aeiou]/i.test(e.name) ? "an" : "a"} ${a}.`);
              },
            ],
          ],
        });
      }
      function resolveSurgery(e, t) {
        const a = surgLow(e),
          o = surgOdds(t.rep);
        if (
          ((state.surgeries ||= []).push({ id: e.id, age: state.age, surgeon: t.name, cost: t.quote }),
          chance(o.fatal))
        )
          return (
            say(`I went in for ${/^[aeiou]/i.test(e.name) ? "an" : "a"} ${a} with ${t.name}.`),
            setTimeout(() => die(`complications from ${/^[aeiou]/i.test(e.name) ? "an" : "a"} ${a}`), 300)
          );
        if (chance(o.success)) {
          if (e.identity) {
            const from = state.gender;
            (state.birthGender ||= from),
              (state.gender = "f" === from ? "m" : "f"),
              (state.genderId = `Transgender ${"f" === state.gender ? "Female" : "Male"}`),
              (state.look.beard = 0),
              (faceKey = ""),
              renderAvatar();
          }
          LifeEvents.applyEffects(state, {
            looks: rint(...e.gain),
            happiness: rint(e.identity ? 10 : 0, e.identity ? 20 : 8),
            confidence: rint(4, 8),
          });
          return (
            say(
              `I had ${/^[aeiou]/i.test(e.name) ? "an" : "a"} ${a} done by ${t.name}, and it was a success.`,
            ),
            notice(
              e.ok,
              `Your ${a} was successful.`,
              null,
              !0,
              `<div class="ev-bars nb"><b>Results</b><i><u style="width:${rint(70, 100)}%;background:#2fa03b"></u></i></div>`,
            )
          );
        }
        const n = Math.random(),
          s = n < 0.4 ? "disappointing" : n < 0.75 ? "minor" : n < 0.95 ? "serious" : "catastrophic",
          [r, i, l] = SURG_TIERS[s],
          c = { looks: state.stats.Looks, health: state.stats.Health, happiness: state.stats.Happiness },
          d = r ? Math.round(rint(...e.loss) * r) : -rint(0, 2),
          u = LifeEvents.applyEffects(state, {
            looks: -d,
            health: -rint(...i),
            happiness: -rint(...l),
            confidence: -rint(3, 12),
          });
        if ("disappointing" === s)
          return (
            say(
              `I had ${/^[aeiou]/i.test(e.name) ? "an" : "a"} ${a} done by ${t.name}, but I'm not happy with how it turned out.`,
            ),
            notice(
              "Disappointing",
              `Your ${a} healed, but you don't like how it looks.`,
              () => surgeryFollowUp(e, t),
              !0,
              `<div class="ev-bars nb"><b>Results</b><i><u style="width:${rint(25, 50)}%;background:#e8a317"></u></i></div>`,
            )
          );
        "minor" !== s && banSurgeon(t),
          say(`${t.name} botched my ${a}.`),
          addSuit({
            name: t.name,
            who: "Plastic Surgeon",
            reason: `botching your ${a}`,
            strength: { minor: 0.5, serious: 0.62, catastrophic: 0.72 }[s],
            scale: { minor: 15e4, serious: 6e5, catastrophic: 2e6 }[s],
          });
        const h = "minor" === s ? rint(25, 45) : "serious" === s ? rint(55, 80) : rint(85, 100),
          p = (e, t) =>
            u[e] ? `<tr><td><b>${t}:</b> ${c[e]}% &rarr; ${c[e] + u[e]}% (${u[e]})</td></tr>` : "";
        hurt(),
          setTimeout(
            () =>
              notice(
                `Botched ${e.name}`,
                `${t.name} botched your ${a}.<br><br>${e.fail}`,
                () => surgeryAftermath(e, t),
                !0,
                `<div class="ev-bars nb"><b>Damage</b><i><u style="width:${h}%;background:#b3261e"></u></i></div><table class="nt">${p("looks", "Looks")}${p("health", "Health")}${p("happiness", "Happiness")}<tr><td><b>Procedure cost:</b> ${usd(t.quote)}</td></tr></table>`,
              ),
            950,
          );
      }
      function surgeryFollowUp(e, t) {
        const a = surgLow(e),
          o = Math.round(t.quote / 2);
        jCard({
          tag: "Surgery",
          iconSrc: `surgery/${e.id}.png`,
          title: "Not What You Wanted",
          lead: `You aren't happy with how your ${a} turned out.<br><br>What will you do?`,
          surprise: !0,
          choices: [
            [
              "Get a second opinion",
              () => {
                LifeEvents.applyEffects(state, { confidence: 3, happiness: 2 });
                say(`Another doctor told me my ${a} just needs more time to heal.`),
                  notice(
                    "Second opinion",
                    "Another doctor said it just needs more time to settle. You feel a bit better.",
                    null,
                    !0,
                  );
              },
            ],
            [
              `Ask for corrective treatment (${usd(o)})`,
              () => {
                if (state.money < o)
                  return notice(
                    "Not enough",
                    `You need another ${usd(o - state.money)} for corrective treatment.`,
                    null,
                    !0,
                  );
                if (((state.money -= o), renderStats(), chance(0.6))) {
                  LifeEvents.applyEffects(state, { looks: rint(3, 8), confidence: 5, happiness: 4 });
                  return (
                    say(`${t.name} fixed my ${a}.`),
                    notice("Fixed", `${t.name} corrected your ${a}. Much better!`, null, !0)
                  );
                }
                LifeEvents.applyEffects(state, { happiness: -4, confidence: -3 });
                say(`Corrective treatment on my ${a} didn't help.`),
                  notice("No change", "The corrective treatment didn't make a difference.", null, !0);
              },
            ],
            [
              "File a complaint",
              () => {
                if (chance(0.4))
                  return (
                    (state.money += o),
                    renderStats(),
                    say(`I got ${usd(o)} back after complaining about my ${a}.`),
                    notice("Partial refund", `${t.name}'s clinic refunded you ${usd(o)}.`, null, !0)
                  );
                say(`I complained about my ${a}, but the clinic wouldn't budge.`),
                  notice("Denied", "The clinic rejected your complaint.", null, !0);
              },
            ],
            [
              "Accept it",
              () => {
                LifeEvents.applyEffects(state, { happiness: -2, confidence: -2 });
                say(`I learned to live with my ${a}.`),
                  notice("Accepted", "You decided to live with it.", null, !0);
              },
            ],
          ],
        });
      }
      function surgeryAftermath(e, t) {
        const a = surgLow(e),
          o = freeCare() ? 0 : localPrice(rint(500, 2e3));
        jCard({
          tag: "Surgery",
          iconSrc: `surgery/${e.id}.png`,
          title: "Surgery Aftermath",
          lead: "What would you like to do?",
          choices: [
            [
              "Seek follow-up care" + (o ? ` (${usd(o)})` : ""),
              () => {
                if (state.money < o)
                  return notice(
                    "Not enough",
                    `You need another ${usd(o - state.money)} for follow-up care.`,
                    null,
                    !0,
                  );
                state.money -= o;
                LifeEvents.applyEffects(state, { health: rint(5, 15) });
                say(`I got follow-up care after my botched ${a}.`),
                  notice(
                    "Follow-up care",
                    "The doctors treated your injuries. Your looks are still damaged, but you are healing.",
                    null,
                    !0,
                  );
              },
            ],
            [
              "Ask about corrective surgery",
              () => {
                (state.surgeryRecover = state.age - 1), setTimeout(() => surgeonCard(e), 80);
              },
            ],
            [
              `Sue ${t.name} for malpractice`,
              () => {
                if ((banSurgeon(t), chance(0.35 + (100 - t.rep) / 250))) {
                  const e = Math.max(2 * t.quote, 1e3 * rint(5, 60));
                  state.money += e;
                  LifeEvents.applyEffects(state, { happiness: 8 });
                  return (
                    say(`I sued ${t.name} for botching my ${a} and won ${usd(e)}.`),
                    notice(
                      "Lawsuit won",
                      `The jury awarded you ${usd(e)}. ${t.name} will never treat you again.`,
                      null,
                      !0,
                    )
                  );
                }
                const e = localPrice(1e3 * rint(2, 15));
                state.money = Math.max(0, state.money - e);
                LifeEvents.applyEffects(state, { happiness: -6, stress: 8 });
                say(`I sued ${t.name} over my ${a} and lost.`),
                  notice(
                    "Lawsuit lost",
                    `You lost your lawsuit against ${t.name} and paid ${usd(e)} in legal fees.`,
                    null,
                    !0,
                  );
              },
            ],
            ["Return to my life", () => say(`I decided to live with my botched ${a}.`)],
          ],
        });
      }
      const salonPay = (e, t) => {
        if (state.money < e) return notice("Not enough", `You need ${usd(e)} for that.`, null, !0);
        (state.money -= e), renderStats(), t();
      };
      function salonPreview({
        icon: e,
        title: t,
        lead: a,
        btn: o,
        count: n,
        start: s,
        faceFor: r,
        onPick: i,
        nameFor: l,
      }) {
        const c = stage(state.age),
          d = state.stats.Happiness,
          u = d < 25 ? "sad" : d < 40 ? "angry" : "happy";
        let h = s;
        (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div><div class="jm-tag" style="margin-top:12px">Salon &amp; Spa</div>\n      <h4><img src="${e}" alt=""><span>${t}</span></h4><div class="lead">${a}</div>\n      <div class="acc-prev"><span class="acc-arrow l" id="accL"></span><canvas width="250" height="250" id="accCv"></canvas><span class="acc-arrow r" id="accR"></span></div>\n      ${l ? '<div class="acc-name" id="accName"></div>' : ""}\n      <button class="jm-apply ev-btn" id="accPick">${o}</button>`),
          (ev.style.overflow = "visible");
        const p = document.getElementById("accCv").getContext("2d"),
          m = () => {
            const e = h;
            l && (document.getElementById("accName").textContent = l(h)),
              r(h, c, u).then((t) => {
                h === e && (p.clearRect(0, 0, 250, 250), p.drawImage(t, 0, 0));
              });
          };
        (document.getElementById("accL").onclick = () => {
          (h = (h - 1 + n) % n), play("choice"), m();
        }),
          (document.getElementById("accR").onclick = () => {
            (h = (h + 1) % n), play("choice"), m();
          });
        const f = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = f),
          (document.getElementById("accPick").onclick = () => {
            f(), screen.classList.remove("open"), i(h);
          }),
          m(),
          evWrap.classList.add("open");
      }
      function faceTatFame() {
        const e = state.art;
        if (!e || !e.fameOn) return "";
        const t =
            state.music &&
            state.music.signed &&
            ("Rapper" === state.music.role || "Rap" === state.music.genre),
          a = t ? rint(5, 10) : rint(2, 5);
        return (
          (e.fame = clamp((e.fame || 0) + a)),
          renderStats(),
          `<br><br>The internet went crazy over it. Your fame went up${t ? " a lot" : ""}!`
        );
      }
      (window.faceTatPicker = (e) => {
        const t = () => myTats(state.look) || { fh: null, cl: null, cr: null, td: 0 },
          a = TAT_SLOTS.flatMap(([e, t]) =>
            tatOpts(e)
              .filter((e) => e[0])
              .map((a) => [e, a[0], `${t}: ${a[1]}`]),
          );
        a.length &&
          salonPreview({
            icon: "tattoo/teardrop.png",
            title: "Face Tattoo",
            lead: "Pick your ink today!",
            btn: "Get this tattoo",
            count: a.length,
            start: 0,
            nameFor: (e) => `${a[e][2]} (${e + 1} of ${a.length})`,
            faceFor: (e, o, n) => {
              const s = { ...t(), [a[e][0]]: a[e][1] },
                r =
                  "tat" + o + n + JSON.stringify(s) + JSON.stringify(state.acc) + state.look.beard + dyeKey();
              return (previewCache[r] ||= composeFace(o, n, state.look, PG(), state.acc, {
                hair: moddedHairNum(o),
                tats: s,
              }));
            },
            onPick: (o) => {
              const [n, s, r] = a[o];
              (state.look.tats = { ...t(), [n]: s }),
                renderAvatar(),
                play("tattoo"),
                say("I got a tattoo on my face."),
                e && e(),
                notice(
                  "Fresh ink",
                  `You got a new face tattoo (${r.split(": ")[1]}).${faceTatFame()}`,
                  null,
                  !0,
                ),
                gangInkArgument();
            },
          });
      }),
        (faceTatPicker.available = () => gangTatsOn());
      const SALON_OPEN = {
          barber: () => {
            const e = hairList(stage(state.age));
            salonPreview({
              icon: "salon/scissors.png",
              title: "f" === PG() ? "Hair Stylist" : "Barber",
              lead: "Pick a new hairstyle today!",
              btn: "Select this style",
              count: e.length + 1,
              start: null == state.mod.style ? 0 : (state.mod.style % e.length) + 1,
              faceFor: (t, a, o) => {
                const n = 0 === t ? null : e[t - 1],
                  s = "barb" + a + o + n + JSON.stringify(state.acc) + state.look.beard + dyeKey();
                return (previewCache[s] ||= composeFace(a, o, state.look, PG(), state.acc, { hair: n }));
              },
              onPick: (e) => {
                const t = "f" === PG() ? "hair salon" : "barber";
                (state.mod.style = 0 === e ? null : e - 1),
                  (state.mod.xHair = null),
                  renderAvatar(),
                  say(`I got a new haircut at the ${t}.`),
                  notice("Fresh cut", `You got a new haircut at the ${t}.`, null, !0);
              },
            });
          },
          barberx: () => {
            const e = hairPackList().map((e) => e[0]);
            salonPreview({
              icon: "salon/scissors.png",
              title: "Barber Expanded",
              lead: "Pick a new hairstyle today!",
              btn: "Select this style",
              count: e.length + 1,
              start: e.indexOf(myXHair()) + 1,
              nameFor: (t) =>
                `${0 === t ? "Your normal hair" : packHairName(e[t - 1])} (${t + 1} of ${e.length + 1})`,
              faceFor: (t, a, o) => {
                const n = 0 === t ? null : e[t - 1],
                  s = n ? null : moddedHairNum(a),
                  r = "barbx" + a + o + n + s + JSON.stringify(state.acc) + state.look.beard + dyeKey();
                return (previewCache[r] ||= composeFace(a, o, state.look, PG(), state.acc, {
                  hair: s,
                  xHair: n,
                }));
              },
              onPick: (t) => {
                const a = "f" === PG() ? "hair salon" : "barber";
                (state.mod.xHair = 0 === t ? null : e[t - 1]),
                  0 === t && delete state.look.xHair,
                  renderAvatar(),
                  say(`I got a new haircut at the ${a}.`),
                  notice("Fresh cut", `You got a new haircut at the ${a}.`, null, !0);
              },
            });
          },
          gangtats: () => {
            (sTitle.textContent = gangModOn() ? "GANG TATTOOS" : "TATTOO PARLOR"),
              (sBack.onclick = openSalon);
            const e = () => myTats(state.look) || { fh: null, cl: null, cr: null, td: 0 };
            (sList.innerHTML = TAT_SLOTS.map(
              ([t, a]) =>
                `<div class="row" data-tat="${t}"><img src="tattoo/teardrop.png"><div class="t"><b>${a}</b><span>${tatLabel(t, e()[t])}</span></div>${DOTS}</div>`,
            ).join("")),
              (sList.scrollTop = 0),
              sList.querySelectorAll("[data-tat]").forEach(
                (t) =>
                  (t.onclick = () => {
                    const a = t.dataset.tat,
                      o = tatOpts(a).map((e) => e[0]),
                      [, n] = TAT_SLOTS.find((e) => e[0] === a),
                      s = (e) =>
                        (
                          TAT_GANGS.find((t) =>
                            ["fh", "cl", "cr"].some((a) => t[a].some((t) => t[0] === e)),
                          ) || {}
                        ).name;
                    salonPreview({
                      icon: "tattoo/teardrop.png",
                      title: n,
                      lead: "Pick your ink today!",
                      btn: "Get this tattoo",
                      count: o.length,
                      nameFor: (e) =>
                        `${tatLabel(a, o[e])}${s(o[e]) ? " · " + s(o[e]) : ""} (${e + 1} of ${o.length})`,
                      start: Math.max(0, o.indexOf(e()[a])),
                      faceFor: (t, n, s) => {
                        const r = { ...e(), [a]: o[t] },
                          i =
                            "tat" +
                            n +
                            s +
                            JSON.stringify(r) +
                            JSON.stringify(state.acc) +
                            state.look.beard +
                            dyeKey();
                        return (previewCache[i] ||= composeFace(n, s, state.look, PG(), state.acc, {
                          hair: moddedHairNum(n),
                          tats: r,
                        }));
                      },
                      onPick: (t) => {
                        const n = e()[a];
                        if (((state.look.tats = { ...e(), [a]: o[t] }), renderAvatar(), o[t] !== n)) {
                          if (!o[t])
                            return (
                              say("I had one of my face tattoos removed."),
                              notice(
                                "Tattoo removed",
                                "You had one of your face tattoos lasered off.",
                                null,
                                !0,
                              )
                            );
                          play("tattoo"),
                            say("I got a gang tattoo on my face."),
                            notice(
                              "Fresh ink",
                              `You got a new tattoo on your face. Everyone knows where you stand now.${faceTatFame()}`,
                              null,
                              !0,
                            ),
                            gangInkArgument();
                        }
                      },
                    });
                  }),
              );
          },
          facetats: () => {
            const e = FULL_FACE_TATS;
            salonPreview({
              icon: "tattoo/teardrop.png",
              title: "Face Tattoos",
              lead: "Pick your ink today!",
              btn: "Get this tattoo",
              count: e.length,
              start: Math.max(
                0,
                e.findIndex((e) => e[0] === (state.look.faceTat || null)),
              ),
              nameFor: (t) => `${e[t][1]} (${t + 1} of ${e.length})`,
              faceFor: (t, a, o) => {
                const n = "ftat" + a + o + e[t][0] + JSON.stringify(state.acc) + state.look.beard + dyeKey();
                if (previewCache[n]) return previewCache[n];
                const s = state.look.faceTat;
                return (
                  (state.look.faceTat = e[t][0] || void 0),
                  (previewCache[n] = composeFace(a, o, state.look, PG(), state.acc, {
                    hair: moddedHairNum(a),
                  }).finally(() => {
                    state.look.faceTat = s;
                  }))
                );
              },
              onPick: (t) => {
                const a = state.look.faceTat || null,
                  o = e[t][0];
                if ((o ? (state.look.faceTat = o) : delete state.look.faceTat, renderAvatar(), o !== a)) {
                  if (!o)
                    return (
                      say("I had my face tattoo removed."),
                      notice("Tattoo removed", "You had your face tattoo lasered off.", null, !0)
                    );
                  play("tattoo"),
                    say(`I got a ${e[t][1]} face tattoo.`),
                    notice("Fresh ink", `You got a new face tattoo (${e[t][1]}).${faceTatFame()}`, null, !0),
                    gangInkArgument();
                }
              },
            });
          },
          dye: () => {
            const e = [[null, "natural"], ...SALON_COLORS.map(([e, t]) => [t, e])];
            salonPreview({
              icon: "salon/dye.png",
              title: "Dye Job",
              lead: "Pick a new hair color today!",
              btn: "Select this color",
              count: e.length,
              start: Math.max(
                0,
                e.findIndex((e) => e[0] === state.mod.color),
              ),
              faceFor: (t, a, o) => {
                const n = state.mod.color;
                state.mod.color = e[t][0];
                const s =
                    "sdye" +
                    a +
                    o +
                    moddedHairNum(a) +
                    JSON.stringify(state.acc) +
                    state.look.beard +
                    dyeKey(),
                  r = (previewCache[s] ||= composeFace(a, o, state.look, PG(), state.acc, {
                    hair: moddedHairNum(a),
                  }));
                return (state.mod.color = n), r;
              },
              onPick: (t) => {
                (state.mod.color = e[t][0]), (state.dyeAge = null), (state.dyeRevert = null), renderAvatar();
                const a = e[t][1].toLowerCase();
                say(0 === t ? "I dyed my hair back to its natural color." : `I dyed my hair ${a}.`),
                  notice(
                    "New look",
                    0 === t ? "You dyed your hair back to its natural color." : `You dyed your hair ${a}.`,
                    null,
                    !0,
                  );
              },
            });
          },
          shave: () => {
            if (state.age < 16)
              return notice("Shave", "You don't have any facial hair to shave yet.", null, !0);
            if ("f" === PG()) return notice("Shave", "You don't have any facial hair to shave.", null, !0);
            salonPreview({
              icon: "salon/shave.png",
              title: "Shave",
              lead: "Pick a new facial hair style today!",
              btn: "Select this style",
              count: Array.from({ length: 14 }, (e, t) => t).length,
              start: state.look.beard || 0,
              faceFor: (e, t, a) => {
                const o = "shave" + t + a + e + moddedHairNum(t) + JSON.stringify(state.acc) + dyeKey();
                return (previewCache[o] ||= composeFace(t, a, { ...state.look, beard: e }, PG(), state.acc, {
                  hair: moddedHairNum(t),
                  xHair: myXHair(),
                }));
              },
              onPick: (e) => {
                (state.look.beard = e),
                  renderAvatar(),
                  say(e ? "I got my facial hair styled." : "I shaved off my facial hair."),
                  notice(
                    "Smooth",
                    e ? "You got your facial hair styled." : "You shaved off all your facial hair.",
                    null,
                    !0,
                  );
              },
            });
          },
          massage: () => {
            if (state.age < 16)
              return notice("Massage", "You must be at least 16 to get a massage.", null, !0);
            const e = ["Deep Tissue", "Shiatsu", "Swedish", "Thai"];
            socSelCard({
              tag: "Salon &amp; Spa",
              icon: "salon/massage.png",
              title: "Massage",
              lead: "Get a massage today!",
              rows: [["Cost", usd(155)]],
              label: "Pick your massage:",
              opts: e,
              btn: "Get a massage",
              onGo: (t) =>
                salonPay(155, () => {
                  const a = e[t].toLowerCase();
                  if (chance(0.06))
                    return (
                      fx({ Health: -6 }, ""),
                      say(`I got a ${a} massage, but the masseuse pulled a muscle in my back.`),
                      notice(
                        "Ouch",
                        `Your ${a} massage went wrong and the masseuse pulled a muscle in your back.`,
                        null,
                        !0,
                      )
                    );
                  fx({ Happiness: +rint(5, 10), Health: +rint(2, 6) }, ""),
                    say(`I got a ${a} massage.`),
                    notice("So relaxing", `You got a ${a} massage. You feel amazing!`, null, !0);
                }),
            });
          },
          nails: () => {
            const e = [
              ["Manicure", 35],
              ["Pedicure", 60],
              ["Manicure & Pedicure", 85],
            ];
            socSelCard({
              tag: "Salon &amp; Spa",
              icon: "salon/nails.png",
              title: "Nail Salon",
              lead: "Get a nail treatment today!",
              rows: e.map(([e, t]) => [e, usd(t)]),
              label: "Pick your service:",
              opts: e.map((e) => e[0]),
              btn: "Visit the nail salon",
              onGo: (t) =>
                salonPay(e[t][1], () => {
                  fx({ Looks: +(t + 1), Happiness: +rint(2, 5) }, "");
                  const a = e[t][0].toLowerCase();
                  say(`I got a ${a} at the nail salon.`),
                    notice("Nailed it", `You got a ${a} at the nail salon.`, null, !0);
                }),
            });
          },
          tanning: () => {
            if (state.age < 16)
              return notice("Tanning Salon", "You must be at least 16 to visit the tanning salon.", null, !0);
            const e = [
              ["Spray Tan", 35],
              ["Tanning Bed", 15],
            ];
            socSelCard({
              tag: "Salon &amp; Spa",
              icon: "salon/tanning.png",
              title: "Tanning Salon",
              lead: "Get a tanning treatment today!",
              rows: e.map(([e, t]) => [e, usd(t)]),
              label: "Pick your service:",
              opts: e.map((e) => e[0]),
              btn: "Visit the tanning salon",
              onGo: (t) =>
                salonPay(e[t][1], () => {
                  if (1 === t && chance(0.08))
                    return (
                      fx({ Health: -8, Looks: -2 }, ""),
                      say("I got badly burned in a tanning bed."),
                      notice("Ouch", "You fell asleep in the tanning bed and got badly burned.", null, !0)
                    );
                  fx({ Looks: +rint(2, 4), Happiness: 2 }, "");
                  const a = e[t][0].toLowerCase();
                  say(`I got a ${a} at the tanning salon.`),
                    notice("Sun-kissed", `You got a ${a}. You're looking golden!`, null, !0);
                }),
            });
          },
          waxing: () => {
            if (state.age < 16)
              return notice("Waxing Studio", "You must be at least 16 to get waxed.", null, !0);
            const e = [
              ["Full Back", 35],
              ["Chest & Back", 50],
              ['"Bro"zilian Package', 55],
              ["Face Wax", 40],
            ];
            socSelCard({
              tag: "Salon &amp; Spa",
              icon: "salon/waxing.png",
              title: "Waxing Studio",
              lead: "Get a wax treatment today!",
              rows: e.map(([e, t]) => [e, usd(t)]),
              label: "Pick your service:",
              opts: e.map((e) => e[0]),
              btn: "Get waxed",
              onGo: (t) =>
                salonPay(e[t][1], () => {
                  fx({ Looks: +rint(1, 3), Happiness: -rint(1, 4) }, "");
                  const e = [
                    "got your back waxed",
                    "got your chest and back waxed",
                    'got the "Bro"zilian Package',
                    "got your face waxed",
                  ][t];
                  say(`I ${e}.`), notice("That stung", `You ${e}. It hurt, but you look great!`, null, !0);
                }),
            });
          },
        },
        accModOnly = (e) => ("scar" === e || "patch" === e) && !modFlag("allAccessories"),
        ACC_CATS = [
          ["eyewear", "1f576-fe0f", "Eyewear", "Put on some eyewear", "Pick out some eyewear today!"],
          ["scar", "1fa79", "Scars", "Get a scar on your face", "Pick out a scar today!"],
          ["patch", "2620-fe0f", "Eye Patch", "Put on an eye patch", "Pick out an eye patch today!"],
          ["headwear", "1f9e2", "Headwear", "Put on some headwear", "Pick out some headwear today!"],
          ["mask", "1f383", "Mask", "Put on a halloween mask", "Pick out a halloween mask today!"],
        ];
      function openAccessories() {
        if (noAccLife() && !isOldEra())
          return notice(
            "Not available",
            isOldEra()
              ? "Accessories aren't available in the 1800s."
              : "Accessories aren't available while you're in the cartel or the mafia.",
            null,
            !0,
          );
        (sTitle.textContent = "ACCESSORIES"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openActivities),
          (sList.innerHTML =
            ACC_CATS.map(([e, t, a, o], n) => {
              if ("mask" === e && !phoneEl.classList.contains("halloween")) return "";
              if (isOldEra() && "headwear" !== e) return "";
              if (accModOnly(e))
                return `<div class="row dis" data-cat="${n}"><img src="emoji/${t}.png"><div class="t"><b>${a}</b><span>${o}</span></div></div>`;
              const s = state.acc[e] && ACCESSORIES[e].find((t) => t.id === state.acc[e]);
              return `<div class="row" data-cat="${n}"><img src="emoji/${t}.png"><div class="t"><b>${a}</b><span>${s ? "Wearing: " + s.name : o}</span></div>${DOTS}</div>`;
            }).join("") +
            (mods.modHair || mods.modSkin
              ? `<div class="row" id="accMod"><img src="emoji/${mods.modHair ? "2699-fe0f" : "270b"}.png"><div class="t"><b>${modLooksName()}</b><span>${mods.modHair ? (HAIR_FX.find((e) => e[0] === state.mod.effect) || [, "Normal"])[1] + " · " + (null == state.mod.style ? "own hair" : "style " + (state.mod.style + 1)) : "Eyes & skin"}</span></div>${CHEV}</div>`
              : "")),
          sList.querySelectorAll("[data-cat]").forEach(
            (e) =>
              (e.onclick = () => {
                const [t, , a] = ACC_CATS[+e.dataset.cat];
                if (accModOnly(t))
                  return notice(
                    "Error",
                    `${a} are only available with the Unlock All Hats & Sunglasses mod enabled.`,
                    null,
                    !0,
                  );
                accessoryPicker(+e.dataset.cat);
              }),
          );
        const e = document.getElementById("accMod");
        e && (e.onclick = () => openModHair(openAccessories));
      }
      const previewCache = {},
        FREE_ACC = { headwear: (e) => /^cowboy\d+$/.test(e.id), eyewear: () => !1 },
        accUnlocked = (e, t) => mods.allAccessories || !FREE_ACC[e] || FREE_ACC[e](t);
      function accessoryPicker(e) {
        const [t, a, o, , n] = ACC_CATS[e],
          s = [
            { id: null, name: "" },
            ...ACCESSORIES[t].filter(
              (e) =>
                (!isOldEra() || /^cowboy\d+$/.test(e.id)) &&
                (mods.allAccessories || !FREE_ACC[t] || accUnlocked(t, e)),
            ),
          ];
        let r = Math.max(
          0,
          s.findIndex((e) => e.id === state.acc[t]),
        );
        ev.innerHTML = `\n      <div class="jm-x" id="propX"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="jm-tag">Accessories</div>\n      <h4><img src="emoji/${a}.png" alt=""><span>${o}</span></h4>\n      <div class="lead">${n}</div>\n      <div class="acc-prev"><span class="acc-arrow l" id="accL"></span><canvas width="250" height="250" id="accCv"></canvas><span class="acc-arrow r" id="accR"></span></div>\n      <div class="acc-name" id="accName"></div>\n      <button class="jm-apply ev-btn" id="accPick">Select this look</button>`;
        const i = document.getElementById("accCv").getContext("2d"),
          l = state.stats.Happiness,
          c = l < 25 ? "sad" : l < 40 ? "angry" : "happy",
          d = stage(state.age),
          u = () => {
            const e = moddedHairNum(d),
              a = s[r],
              n = { ...state.acc, [t]: a.id },
              l = d + c + state.look.beard + JSON.stringify(n) + dyeKey() + "|" + e;
            (document.getElementById("accName").textContent = a.id ? a.name : `No ${o.toLowerCase()}`),
              (previewCache[l] ||= composeFace(d, c, state.look, PG(), n, e ? { hair: e } : {})).then((e) => {
                s[r] === a && (i.clearRect(0, 0, 250, 250), i.drawImage(e, 0, 0));
              });
          },
          h = () => s.length < 2;
        (document.getElementById("accL").onclick = () => {
          h() || ((r = (r - 1 + s.length) % s.length), play("choice"), u());
        }),
          (document.getElementById("accR").onclick = () => {
            h() || ((r = (r + 1) % s.length), play("choice"), u());
          }),
          (document.getElementById("propX").onclick = () => evWrap.classList.remove("open")),
          (document.getElementById("accPick").onclick = () => {
            (s[r].id && !accUnlocked(t, s[r])) ||
              ((state.acc[t] = s[r].id),
              evWrap.classList.remove("open"),
              s[r].id &&
                log.lastElementChild.insertAdjacentHTML(
                  "beforeend",
                  `<p>${"scar" === t ? "I got a scar on my face." : "patch" === t ? "I started wearing an eye patch." : `I started wearing ${"eyewear" === t ? "" : "a "}${s[r].name.toLowerCase()}.`}</p>`,
                ),
              renderAvatar(),
              openAccessories());
          }),
          u(),
          evWrap.classList.add("open");
      }
      document.querySelectorAll(".tab[data-tab]").forEach((e) => {
        const t = e.cloneNode(!0);
        e.replaceWith(t),
          t.addEventListener("click", (e) => {
            state.prison && (e.stopImmediatePropagation(), "Occupation" === t.dataset.tab && openPrison());
          }),
          (t.onclick =
            "Occupation" === t.dataset.tab
              ? () =>
                  state.school
                    ? is2018()
                      ? school2018Card()
                      : openSchool()
                    : state.expelled
                      ? eduCard({
                          icon: "1f97e",
                          title: "Expelled",
                          lead: `You were expelled from ${state.expelled.from}. You'll start at a new school next year.`,
                          rows: [["Back At School", "Next year"]],
                        })
                      : state.age < 6
                        ? openProfile()
                        : openOccupation()
              : "Activities" === t.dataset.tab
                ? () => window.openActivities()
                : "Relationships" === t.dataset.tab
                  ? () => window.openRelationships()
                  : "Assets" === t.dataset.tab
                    ? () => window.openAssets()
                    : () => openPlaceholder(t.dataset.tab));
      }),
        (() => {
          const e = document.querySelector(".nav"),
            t = document.createElement("div");
          (t.className = "back-tab"), (t.innerHTML = "<i></i><span>Back</span>"), e.append(t);
          let a = null,
            o = screen.classList.contains("open");
          const n = () => t.classList.remove("on");
          /* [mod] Back remembers the exact screen: we keep the trail of rows you tapped to get from the tab root to the
             sub-screen you were on (Activities > Salon & Spa...), and replay it when you press Back. Only taps that
             changed the screen title count, so buy/toggle rows that re-render the same screen are never replayed. */
          const trail = [],
            CANDS = ".row,[data-act],[data-mb],button,[role=button]",
            rowTxt = (x) => ((x.querySelector(".t b") || x).textContent || "").trim().slice(0, 80);
          let pend = null,
            replaying = !1;
          const findRow = (l) => {
              const all = [...sList.querySelectorAll(CANDS)],
                hasDs = Object.keys(l.ds).length > 0,
                key = JSON.stringify(l.ds),
                pool = hasDs ? all.filter((x) => JSON.stringify({ ...x.dataset }) === key) : all;
              return pool.find((x) => rowTxt(x) === l.txt) || (hasDs ? pool[0] : null) || all.find((x) => rowTxt(x) === l.txt) || null;
            },
            wait = (ms) => new Promise((r) => setTimeout(r, ms)),
            replay = async (steps) => {
              for (const st of steps) {
                let el = null;
                for (let i = 0; i < 20 && !el; i++) {
                  await wait(50);
                  screen.classList.contains("open") && (el = findRow(st));
                }
                if (!el || el.classList.contains("dis")) return;
                const before = sTitle.textContent;
                el.click();
                for (let i = 0; i < 15 && sTitle.textContent === before; i++) await wait(40);
              }
            };
          sList.addEventListener(
            "click",
            (ev) => {
              if (replaying) return;
              const row = ev.target.closest(CANDS);
              row &&
                sList.contains(row) &&
                (pend = {
                  loc: {
                    ds: { ...row.dataset },
                    txt: rowTxt(row),
                  },
                  title: sTitle.textContent,
                  t: Date.now(),
                });
            },
            !0,
          ),
            sBack.addEventListener(
              "click",
              () => {
                replaying || (pend = { back: !0, title: sTitle.textContent, t: Date.now() });
              },
              !0,
            ),
            new MutationObserver(() => {
              if (replaying || !pend || !screen.classList.contains("open")) return;
              const p = pend;
              (pend = null),
                Date.now() - p.t > 1500 || sTitle.textContent === p.title || (p.back ? trail.pop() : trail.push(p.loc));
            }).observe(sList, { childList: !0 });
          e.addEventListener(
            "click",
            (e) => {
              const t = e.target.closest(".tab[data-tab]");
              t && ((a = t.dataset.tab), replaying || (trail.length = 0), n());
            },
            !0,
          ),
            document.addEventListener(
              "click",
              (e) => {
                e.target.closest("#ageBtn,.week-btn,.minus") && (n(), (a = null), (trail.length = 0));
              },
              !0,
            ),
            new MutationObserver(() => {
              const s = screen.classList.contains("open");
              s
                ? n()
                : o &&
                  a &&
                  (() => {
                    const o = e.querySelector('.tab[data-tab="Activities"]');
                    if (!a || !o || state.dead) return;
                    const n = Math.max(0, o.offsetLeft + o.offsetWidth - 112);
                    (t.style.left = `${n}px`), t.classList.remove("on"), t.offsetWidth, t.classList.add("on");
                  })(),
                (o = s);
            }).observe(screen, { attributes: !0, attributeFilter: ["class"] }),
            (t.onclick = () => {
              if (!a) return;
              play("choice"), n();
              const t = e.querySelector(`.tab[data-tab="${a}"]`);
              if (!t) return;
              const steps = trail.slice();
              (replaying = !0), t.click();
              replay(steps).finally(() => (replaying = !1));
            });
        })();
      const _renderAvatar = renderAvatar;
      function renderJobLine() {
        const e = state.age,
          t = (e) => `emoji/${e}.png`,
          [a, o] = state.prison
            ? [
                "prison/sentence.png",
                state.prison.death
                  ? "Death Row Inmate"
                  : state.prison.juv
                    ? "Juvenile Delinquent"
                    : "Prisoner",
              ]
            : state.royal && !state.royal.abdicated
              ? [ROY_RANKS[state.royal.rank].ico, state.royal.title]
              : state.job && isOldEra() && MIL_RANKS[state.job.c]
                ? [milLogo(state.job.c), state.job.t]
                : state.job && mods.militaryExpanded && MIL_RANKS[state.job.c]
                  ? [rankInsignia(state.job), mosRole(state.job) || state.job.t]
                  : state.uni
                    ? ["emoji/1f393.png", "University Student"]
                    : !state.job && state.retired
                      ? ["occ/job-retire.png", "Retired"]
                      : state.job
                        ? [state.job.icon || jobIcon(state.job), state.job.t]
                        : state.school && state.school.college
                          ? ["school/apple.png", `${state.school.level} Student`]
                          : e < 6
                            ? ["kid/baby-bottle.png", "Infant"]
                            : e < 18 && !state.school && state.poor && state.poor.noSchool
                              ? [t("1f3e0"), "Not in School"]
                              : e < 11
                                ? ["school/apple.png", "Elementary School Student"]
                                : e < 14
                                  ? ["school/apple.png", "Middle School Student"]
                                  : e < 18
                                    ? ["school/apple.png", "High School Student"]
                                    : state.money > 1e6
                                      ? [t("1f4b0"), "Independently Wealthy"]
                                      : [t("1f62c"), "Unemployed"];
        document.querySelectorAll("#pjobIco").forEach((e) => {
          e.src.endsWith(a) || (e.src = a);
        }),
          document.querySelectorAll("#pjob").forEach((e) => (e.textContent = o)),
          updateDockTab();
      }
      (renderAvatar = function () {
        _renderAvatar(), renderJobLine();
      }),
        renderJobLine();
      const LIFE_G = {
          friend: () => {
            const e = (state.friends || []).filter((e) => !e.away);
            return e.length ? any(e) : null;
          },
          partner: () => {
            const e = (state.lovers || []).find((e) => e.main);
            return e ? ((e.title = loverTitle(e).toLowerCase()), e) : null;
          },
          classmate: () => {
            const e = state.school;
            return e && !e.college && e.classmates && e.classmates.length ? any(e.classmates) : null;
          },
          boss: () => {
            const e = state.job;
            if (!e || isMil()) return null;
            const t = (e.boss && e.boss.g) || (chance(0.5) ? "m" : "f");
            return (e.boss ||= { first: uname(t), g: t, rel: rint(35, 75) }), (e.boss.emp = e.emp), e.boss;
          },
          casting: () =>
            (state.job && /actor|actress|singer|musician|dancer|model|performer/i.test(state.job.t)) ||
            (state.school && state.school.club && /drama|theater|choir|band/i.test(state.school.club.id)) ||
            chance(0.15)
              ? {
                  first: "The casting director",
                  g: "f",
                  rel: 50,
                  role: any([
                    "a TV commercial",
                    "the school play",
                    "a movie",
                    "a music video",
                    "a stage musical",
                  ]),
                }
              : null,
          anyone: () => {
            const e = [
              ...((state.school && state.school.classmates) || []),
              ...((state.job && state.job.coworkers) || []),
              ...(state.friends || []),
            ];
            return e.length ? any(e) : null;
          },
        },
        LIFE_NAMES = {
          happiness: "Happiness",
          health: "Health",
          looks: "Looks",
          smarts: "Smarts",
          confidence: "Confidence",
          stress: "Stress",
          relationship: "Relationship",
          perf: "Job Performance",
          money: "Money",
        },
        lifeChanges = (e) => {
          const t = Object.entries(e).filter(([, e]) => e);
          return t.length
            ? `<table class="nt">${t.map(([e, t]) => `<tr><td><b>${LIFE_NAMES[e] || e}:</b> ${"money" === e ? (t > 0 ? "+" : "-") + usd(Math.abs(t)) : (t > 0 ? "+" : "") + t}</td></tr>`).join("")}</table>`
            : "";
        },
        firstPerson = (e) =>
          e
            .replace(/\bYou were\b/g, "I was")
            .replace(/\byou were\b/g, "I was")
            .replace(/\bYou are\b/g, "I am")
            .replace(/\byou are\b/g, "I am")
            .replace(/\bYou'll\b/g, "I'll")
            .replace(/\bYou're\b/g, "I'm")
            .replace(/\bYour\b/g, "My")
            .replace(/\byour\b/g, "my")
            .replace(/\bYou\b/g, "I")
            .replace(/(\w) you\b/g, "$1 me")
            .replace(/\byou\b/g, "I");
      function runLifeEvent(e) {
        if (state.dead || !window.LifeEvents) return;
        const t = LifeEvents.begin(state, LIFE_G, Math.random, e);
        if (!t) return;
        const { event: a, npc: o } = t;
        renderStats();
        const n = a.choices(o).map((e) => e[0]);
        jCard({
          tag: "Life",
          ...(o.look
            ? {
                person: {
                  name: o.last ? `${o.first} ${o.last}` : o.first,
                  look: o.look,
                  g: o.g,
                  age: o.age ?? state.age,
                  mood: "angry",
                },
              }
            : {}),
          iconSrc: a.icon,
          title: a.title,
          lead: `${a.text(o)}<br><br>What will you do?`,
          surprise: !0,
          choices: n.map((e, o) => [
            e,
            () => {
              const e = LifeEvents.choose(state, t, o);
              e && (renderStats(), say(firstPerson(e.text)), notice(a.title, e.text, null, !0));
            },
          ]),
        });
      }
      function lifeYear() {
        if (state.dead || !window.LifeEvents) return;
        const e = LifeEvents.mind(state);
        LifeEvents.tickConditions(state, state.birthYear + state.age, (e) => say(firstPerson(e))),
          e.stress > 70 &&
            ((state.stats.Health = clamp(state.stats.Health - rint(1, 3))),
            (state.stats.Happiness = clamp(state.stats.Happiness - rint(1, 3)))),
          (e.stress = clamp(e.stress - rint(3, 8))),
          (e.confidence = clamp(Math.round(e.confidence + 0.1 * (55 - e.confidence)))),
          !state.prison && state.age >= 8 && chance(0.15) && queuePopup(() => runLifeEvent());
      }
      document.getElementById("ageBtn").addEventListener("click", () => setTimeout(lifeYear, 150));
      const TIP_JOBS =
          /waiter|waitress|bartender|server|barista|valet|delivery|busser|host|hairstylist|barber|bellhop|dancer|taxi|driver/i,
        COMMISSION_JOBS = /sales|real estate|agent|broker|recruiter|loan officer/i;
      function taxJobs() {
        const e = state.job,
          t = [];
        if (e) {
          const a = e.pay,
            o = e.hours ?? 40,
            n = e.perf ?? 50,
            s = e.payYears ? 12 : (e.startMonths ?? 12),
            r = s / 12;
          t.push({
            title: e.t,
            annualSalary: a,
            months: s,
            overtime: o > 40 ? Math.round(50 * (o - 40) * (a / 2e3) * 1.5 * r) : 0,
            tips: TIP_JOBS.test(e.t) ? Math.round(((a * rint(10, 25)) / 100) * r) : 0,
            commission: COMMISSION_JOBS.test(e.t) ? Math.round(((a * n) / 400) * r) : 0,
            bonus: n >= 85 && chance(0.5) ? Math.round((a * rint(5, 15)) / 100) : 0,
          });
        } else
          state.retired &&
            state.retired.pension &&
            !state.prison &&
            t.push({ title: "Pension", annualSalary: state.retired.pension, payType: "pension" });
        const a = state.partJob;
        return (
          a &&
            !state.prison &&
            t.push({
              title: a.t,
              annualSalary: a.pay,
              months: a.payYears ? 12 : (a.startMonths ?? 12),
              tips: TIP_JOBS.test(a.t) ? Math.round((a.pay * rint(10, 25)) / 100) : 0,
            }),
          t
        );
      }
      function taxCard() {
        const e = state.job,
          t = window.BitLifeTaxEngine;
        if (!e || !t) return;
        const a = (state.family || []).filter((e) => "child" === e.kind && !e.dead && relAge(e) < 17).length,
          o = t.calculate({
            country: state.country,
            usState: t.stateFor(state.city),
            kids: a,
            jobs: [{ title: e.t, annualSalary: e.pay }],
            pretax: "us" === state.country && e.pay > 2e4 ? t.PROFILES.us.healthPremium : 0,
          }),
          n = (state.taxHistory || []).slice(-5).reverse(),
          s = [
            ["Annual Salary", usd(o.gross)],
            ["Income Tax", `-${usd(o.incomeTax)}`],
            ...(o.regionalName
              ? [[o.usState ? `State Tax (${o.usState})` : o.regionalName, `-${usd(o.regionalTax)}`]]
              : []),
            ...o.payrollLines.filter((e) => e.amount).map((e) => [e.name, `-${usd(e.amount)}`]),
            ...(o.pretax ? [["Health Insurance", `-${usd(o.pretax)}`]] : []),
            ...(o.credits ? [["Child Tax Credit", `+${usd(o.credits)}`]] : []),
            ["Take-Home Pay", `<b>${usd(o.net)}</b>`],
            ["Effective Tax Rate", `${(100 * o.effective).toFixed(1)}%`],
          ];
        jCard({
          tag: "Job",
          iconSrc: "emoji/1f9fe.png",
          title: "Taxes",
          close: !0,
          lead:
            `Your estimated yearly paycheck as ${/^[aeiou]/i.test(e.t) ? "an" : "a"} ${e.t} in ${(COUNTRIES[state.country] || ["your country"])[0]}, before any tips, overtime or bonuses.` +
            (n.length
              ? `<br><br><b>Past years</b><br>${n.map((e) => `Age ${e.age}: earned ${usd(e.gross)}, paid ${usd(e.tax)}, kept ${usd(e.net)}`).join("<br>")}`
              : ""),
          rows: s,
        });
      }
      function payAnnualIncome() {
        const e = taxJobs();
        if (!e.length || !window.BitLifeTaxEngine) return;
        const t = (state.family || []).filter((e) => "child" === e.kind && !e.dead && relAge(e) < 17).length,
          a = {
            country: state.country,
            city: state.city,
            age: state.age,
            money: state.money,
            jobs: e,
            taxHistory: (state.taxHistory ||= []),
          },
          o = BitLifeTaxEngine.settleAnnualJobPay(a, state.birthYear + state.age, {
            pretax:
              "us" === state.country && state.job && state.job.pay > 2e4
                ? BitLifeTaxEngine.PROFILES.us.healthPremium
                : 0,
            kids: t,
          });
        if (o.skipped) return;
        const n = state.job ? state.job.emp || state.job.c || state.job.t : "EMPLOYER";
        void 0 !== txNote &&
          (txNote = {
            memo: "payroll",
            type: "Payroll",
            desc: `DIRECT DEP ${String(n)
              .toUpperCase()
              .replace(/[^A-Z0-9 ]/g, "")
              .slice(0, 18)} PAYROLL`,
          });
        const s = a.money - state.money,
          r = state.weekPaid;
        (state.money = a.money),
          (state.lastTax = o),
          r && r.age === state.age - 1 && r.net > 0 && (state.money -= Math.min(r.net, Math.max(0, s))),
          (state.weekPaid = null),
          state.job && (state.job.payYears = (state.job.payYears || 0) + 1),
          state.partJob && (state.partJob.payYears = (state.partJob.payYears || 0) + 1),
          "1800s" !== state.era &&
            [state.job, state.partJob].forEach((j) => {
              j && j.pay > 0 && (j.pay = Math.round(j.pay * 1.03 * 100) / 100);
            });
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        state.dead || payAnnualIncome(), renderStats(), renderAvatar();
      });
      const LAST = NAME_POOL.last,
        rnd = (e, t) => e + Math.floor(Math.random() * (t - e + 1)),
        any = (e) => e[Math.floor(Math.random() * e.length)];
      function person(e, t) {
        const a = Math.random() < 0.5 ? "m" : "f",
          o = rnd(e, t);
        return {
          g: a,
          age: o,
          av:
            o < 4
              ? "1f476"
              : o < 13
                ? "m" === a
                  ? "1f466"
                  : "1f467"
                : o < 60
                  ? "m" === a
                    ? "1f468"
                    : "1f469"
                  : "m" === a
                    ? "1f474"
                    : "1f475",
          look: randomLook(a, o),
          first: uname(a),
          name: "",
          he: "m" === a ? "he" : "she",
          him: "m" === a ? "him" : "her",
          kid: o < 13 ? ("m" === a ? "boy" : "girl") : "m" === a ? "man" : "woman",
          get full() {
            return this.first + " " + this.last;
          },
          last: any(LAST),
          looks: rnd(5, 100),
          smarts: rnd(5, 100),
          crazy: rnd(5, 100),
        };
      }
      function fx(e, t) {
        for (const t in e)
          "money" === t
            ? (state.money = Math.max(
                0,
                isOldEra() ? cents(state.money + eraCash(e[t] / 100)) : state.money + e[t],
              ))
            : (state.stats[t] = clamp(state.stats[t] + e[t]));
        return renderStats(), t;
      }
      const chance = (e) => Math.random() < e,
        personCard = (e) => ({
          who: e.full,
          av: e.av,
          person: e,
          table: [
            ["Name", e.full],
            ["Gender", "m" === e.g ? "Male" : "Female"],
            ["Age", e.age],
          ],
          bars: [
            ["Looks", e.looks],
            ["Smarts", e.smarts],
            ["Craziness", e.crazy, "o"],
          ],
        }),
        EVENTS = [
          {
            min: 2,
            max: 12,
            kind: "Friend",
            make() {
              const e = person(Math.max(2, state.age - 1), state.age + 1);
              return {
                ...personCard(e),
                icon: "1f917",
                title: "New Friend",
                desc: `A little ${e.kid} named ${e.first} wants to become your friend.`,
                choices: [
                  [
                    `Become friends with ${e.him}`,
                    () => (
                      addFriend(e, rint(55, 80)), fx({ Happiness: 6 }, `I became friends with ${e.full}.`)
                    ),
                  ],
                  [`Reject ${e.him}`, () => fx({ Happiness: -1 }, `I rejected ${e.first}'s friendship.`)],
                ],
              };
            },
          },
          {
            min: 2,
            max: 6,
            kind: "Playtime",
            make() {
              const e = person(2, 6);
              return {
                who: e.full,
                av: e.av,
                person: e,
                icon: "1f9f8",
                title: "Toy Trouble",
                desc: `${e.first} is playing with a toy you really want.`,
                choices: [
                  [
                    "Ask nicely to share",
                    () =>
                      chance(0.6)
                        ? fx({ Happiness: 4 }, `${e.first} shared the toy with me.`)
                        : fx({ Happiness: -3 }, `${e.first} refused to share.`),
                  ],
                  [
                    "Snatch it",
                    () =>
                      fx(
                        { Happiness: 2, Looks: -1 },
                        `I snatched a toy from ${e.first}. ${e.he[0].toUpperCase() + e.he.slice(1)} cried.`,
                      ),
                  ],
                  ["Throw a tantrum", () => fx({ Happiness: -4 }, "I threw a tantrum in front of everyone.")],
                ],
              };
            },
          },
          {
            min: 4,
            max: 10,
            kind: "Stranger",
            make() {
              person(35, 60);
              return {
                who: "Stranger",
                av: "1f9d4",
                icon: "1f36d",
                title: "Free Candy",
                desc: "A creepy stranger in a van offers you free candy.",
                choices: [
                  [
                    "Take the candy",
                    () =>
                      fx(
                        { Health: -6, Happiness: -8 },
                        "I took candy from a stranger. It tasted weird and I felt sick.",
                      ),
                  ],
                  ["Run away", () => fx({ Happiness: 2 }, "I ran away from a creepy stranger.")],
                  [
                    "Tell my parents",
                    () =>
                      fx({ Smarts: 2 }, "I told my parents about a creepy stranger. They called the police."),
                  ],
                ],
              };
            },
          },
          {
            min: 6,
            max: 15,
            kind: "Bully",
            make() {
              const e = person(state.age, state.age + 2);
              return (
                (e.crazy = rnd(60, 100)),
                {
                  ...personCard(e),
                  iconSrc: "found/hand-fist.png",
                  title: "Bully",
                  desc: `${e.first} cornered you and demanded your lunch money.`,
                  choices: [
                    [
                      "Hand it over",
                      () => fx({ Happiness: -6 }, `I gave my lunch money to the bully, ${e.first}.`),
                    ],
                    [
                      "Fight back",
                      () =>
                        chance(0.5)
                          ? fx({ Happiness: 8 }, `I beat up the bully, ${e.first}!`)
                          : fx({ Health: -10, Looks: -3 }, `${e.first} beat me up.`),
                    ],
                    ["Tell a teacher", () => fx({ Happiness: 1 }, `I reported ${e.first} to a teacher.`)],
                  ],
                }
              );
            },
          },
          {
            min: 5,
            max: 85,
            kind: "Animal",
            make: () => ({
              who: "Stray Puppy",
              av: "1f436",
              icon: "1f436",
              title: "Lost Puppy",
              desc: "A scruffy, lost puppy is following you home.",
              choices: [
                ["Keep it", () => fx({ Happiness: 10 }, "I adopted a stray puppy and named it Biscuit.")],
                [
                  "Take it to a shelter",
                  () => fx({ Happiness: 3 }, "I brought a lost puppy to the animal shelter."),
                ],
                ["Shoo it away", () => fx({ Happiness: -3 }, "I shooed away a lost puppy.")],
              ],
            }),
          },
          {
            min: 3,
            max: 10,
            kind: "Treat",
            make: () => ({
              who: "Ice Cream Truck",
              av: "1f368",
              icon: "1f368",
              title: "Ice Cream Truck",
              desc: "The ice cream truck is driving down your street!",
              choices: [
                [
                  "Beg for ice cream",
                  () =>
                    chance(0.6)
                      ? fx({ Happiness: 6 }, "My parents bought me ice cream!")
                      : fx({ Happiness: -4 }, "My parents said no to ice cream."),
                ],
                [
                  "Chase the truck",
                  () => fx({ Health: 2, Happiness: 2 }, "I chased the ice cream truck down the street."),
                ],
              ],
            }),
          },
          {
            min: 7,
            max: 12,
            kind: "School",
            make: () => ({
              who: "Your Teacher",
              av: "1f469",
              icon: "1f4da",
              title: "Spelling Bee",
              desc: "Your school is holding a spelling bee. Do you want to compete?",
              choices: [
                [
                  "Compete",
                  () =>
                    state.stats.Smarts > 55 && chance(0.6)
                      ? fx({ Happiness: 10, Smarts: 3 }, "I won the school spelling bee!")
                      : fx({ Happiness: -5 }, "I was eliminated from the spelling bee in the first round."),
                ],
                ["Sit this one out", () => "I skipped the spelling bee."],
              ],
            }),
          },
          {
            min: 8,
            max: 17,
            kind: "Classmate",
            make() {
              const e = person(state.age, state.age);
              return {
                ...personCard(e),
                icon: "1f4da",
                title: "Copy Homework",
                desc: `Your classmate ${e.first} wants to copy your homework.`,
                choices: [
                  [
                    "Let them copy",
                    () =>
                      chance(0.25)
                        ? fx(
                            { Happiness: -6 },
                            `We got caught copying homework. ${e.first} and I got detention.`,
                          )
                        : fx({ Happiness: 3 }, `I let ${e.first} copy my homework.`),
                  ],
                  ["Refuse", () => fx({ Smarts: 1 }, `I refused to let ${e.first} copy my homework.`)],
                ],
              };
            },
          },
          {
            min: 12,
            max: 17,
            kind: "Crush",
            make() {
              const e = person(state.age, state.age + 1);
              return (
                (e.looks = rnd(50, 100)),
                {
                  ...personCard(e),
                  icon: "1f48c",
                  title: "Secret Admirer",
                  desc: `${e.first} slipped a note into your locker saying ${e.he} likes you.`,
                  choices: [
                    [
                      `Ask ${e.him} out`,
                      () =>
                        chance(romanceOdds(e, { base: 0.7, rel: 70 }))
                          ? fx({ Happiness: 12 }, `I started dating ${e.full}.`)
                          : fx({ Happiness: -8 }, `${e.first} said it was a prank.`),
                    ],
                    ["Ignore the note", () => "I ignored a love note."],
                  ],
                }
              );
            },
          },
          {
            min: 13,
            max: 30,
            kind: "Peer Pressure",
            make() {
              const e = person(state.age, state.age + 3);
              return (
                (e.crazy = rnd(50, 100)),
                {
                  ...personCard(e),
                  icon: "1f6ac",
                  title: "Cigarette",
                  desc: `${e.first} offers you a cigarette ${state.school && !state.school.college ? "behind the gym" : state.school ? "outside the campus library" : state.job ? "on a smoke break at work" : any(["outside a bar", "at a party", "at the bus stop", "in a parking lot"])}.`,
                  choices: [
                    [
                      "Smoke it",
                      () => fx({ Health: -5, Happiness: 2 }, `I smoked a cigarette with ${e.first}.`),
                    ],
                    ["No thanks", () => fx({ Health: 1 }, `I turned down a cigarette from ${e.first}.`)],
                  ],
                }
              );
            },
          },
          {
            min: 14,
            max: 25,
            kind: "Party",
            make() {
              const e = person(state.age, state.age + 2);
              return {
                ...personCard(e),
                icon: "1f389",
                title: "House Party",
                desc: `${e.first} is throwing a huge party while ${"he" === e.he ? "his" : "her"} parents are away.`,
                choices: [
                  [
                    "Go to the party",
                    () =>
                      chance(0.2)
                        ? fx({ Happiness: -5 }, "The cops busted the party. I ran home.")
                        : fx({ Happiness: 10 }, `I went to ${e.first}'s party and had a blast.`),
                  ],
                  ["Stay home", () => fx({ Smarts: 1 }, "I stayed home instead of partying.")],
                ],
              };
            },
          },
          {
            min: 16,
            max: 28,
            kind: "Peer Pressure",
            make() {
              const e = person(state.age, state.age + 3);
              return {
                ...personCard(e),
                icon: "1f37a",
                title: "Shotgun a Beer",
                desc: `${e.first} dares you to shotgun a beer.`,
                choices: [
                  [
                    "Chug it",
                    () => fx({ Health: -3, Happiness: 5 }, `I shotgunned a beer on a dare from ${e.first}.`),
                  ],
                  ["Decline", () => "I declined a beer."],
                ],
              };
            },
          },
          {
            min: 8,
            max: 95,
            kind: "Found Item",
            make() {
              const e = rnd(20, 400);
              return {
                who: "A Wallet",
                av: "1f45b",
                icon: "1f45b",
                title: "Found Wallet",
                desc: `You found a wallet on the sidewalk with ${cur()}${e} inside.`,
                choices: [
                  [
                    "Keep the cash",
                    () => fx({ money: +e, Happiness: 3 }, `I kept ${cur()}${e} from a wallet I found.`),
                  ],
                  [
                    "Return it",
                    () => fx({ Happiness: 6 }, "I returned a lost wallet to its owner. They thanked me."),
                  ],
                ],
              };
            },
          },
          {
            min: 18,
            max: 60,
            kind: "Romance",
            make() {
              const e = person(Math.max(18, state.age - 5), state.age + 5);
              return {
                ...personCard(e),
                icon: "1f48c",
                title: "Date Request",
                desc: `${e.first} asked for your number at the coffee shop.`,
                choices: [
                  [
                    "Give my number",
                    () =>
                      chance(0.75)
                        ? fx({ Happiness: 10 }, `I went on a date with ${e.full}.`)
                        : fx({ Happiness: -3 }, `${e.first} never called me.`),
                  ],
                  [`Reject ${e.him}`, () => `I rejected ${e.first}.`],
                ],
              };
            },
          },
          {
            min: 18,
            max: 85,
            kind: "Car Trouble",
            make() {
              const e = rnd(200, 1500);
              return {
                who: "Mechanic",
                av: "1f468",
                icon: "1f697",
                title: "Breakdown",
                desc: `Your car broke down on the highway. A mechanic quotes ${cur()}${e} for repairs.`,
                choices: [
                  [
                    `Pay ${cur()}${e}`,
                    () =>
                      state.money >= e
                        ? fx({ money: -e }, `I paid ${cur()}${e} to fix my car.`)
                        : fx({ Happiness: -6 }, "I couldn't afford to fix my car."),
                  ],
                  [
                    "Try fixing it myself",
                    () =>
                      chance(0.4)
                        ? fx({ Smarts: 3, Happiness: 5 }, "I fixed my own car!")
                        : fx({ Health: -4 }, "I hurt my hand trying to fix my car."),
                  ],
                ],
              };
            },
          },
          {
            min: 18,
            max: 95,
            kind: "Gamble",
            make: () => ({
              who: "Gas Station",
              av: "1f9d1",
              icon: "1f3b0",
              title: "Scratch Ticket",
              desc: "The cashier asks if you want a $5 scratch-off ticket.",
              choices: [
                [
                  "Buy one",
                  () =>
                    chance(0.08)
                      ? fx({ money: 5e3, Happiness: 20 }, "I won $5,000 on a scratch ticket!")
                      : fx({ money: -5 }, "I lost $5 on a scratch ticket."),
                ],
                ["No thanks", () => "I passed on a lottery ticket."],
              ],
            }),
          },
          {
            min: 18,
            max: 70,
            kind: "Work",
            make() {
              const e = person(25, 55);
              return {
                ...personCard(e),
                icon: "1f494",
                title: "Credit Thief",
                desc: `Your coworker ${e.first} took credit for your hard work in a meeting.`,
                choices: [
                  [
                    "Confront them",
                    () => fx({ Happiness: 3 }, `I confronted ${e.first} for stealing credit.`),
                  ],
                  [
                    "Report to the boss",
                    () =>
                      chance(0.5)
                        ? fx({ Happiness: 6 }, `The boss sided with me against ${e.first}.`)
                        : fx({ Happiness: -5 }, "The boss ignored my complaint."),
                  ],
                  ["Let it go", () => fx({ Happiness: -4 }, "I let a coworker steal credit for my work.")],
                ],
              };
            },
          },
          {
            min: 18,
            max: 90,
            kind: "Neighbor",
            make() {
              const e = person(20, 80);
              return {
                ...personCard(e),
                icon: "1f62d",
                title: "Noisy Neighbor",
                desc: `Your neighbor ${e.first} has been blasting music at 3 AM.`,
                choices: [
                  [
                    "Knock on their door",
                    () => fx({ Happiness: 2 }, `I asked ${e.first} to turn the music down.`),
                  ],
                  [
                    "Call the police",
                    () => fx({ Happiness: 1 }, `I called the police on my neighbor, ${e.first}.`),
                  ],
                  [
                    "Bang on the wall",
                    () => fx({ Happiness: -2 }, "I banged on the wall. The music got louder."),
                  ],
                ],
              };
            },
          },
          {
            min: 18,
            max: 70,
            kind: "Fitness",
            make: () => ({
              who: "Gym Salesman",
              av: "1f468",
              icon: "1f3cb-fe0f",
              title: "Gym Membership",
              desc: "A gym is offering you a year-long membership for $300.",
              choices: [
                [
                  "Sign up ($300)",
                  () =>
                    state.money >= 300
                      ? fx({ money: -300, Health: 8, Looks: 4 }, "I signed up for a gym membership.")
                      : "I couldn't afford a gym membership.",
                ],
                ["Pass", () => "I passed on a gym membership."],
              ],
            }),
          },
          {
            min: 40,
            max: 100,
            kind: "Health",
            make() {
              const e = rnd(500, 4e3);
              return {
                who: "Your Doctor",
                av: "1f469",
                icon: "1f912",
                title: "Health Scare",
                desc: `Your doctor found something worrying and recommends a ${cur()}${e} procedure.`,
                choices: [
                  [
                    `Get the procedure (${cur()}${e})`,
                    () => fx({ money: -e, Health: 15 }, "I had a medical procedure. I feel much better."),
                  ],
                  ["Ignore it", () => fx({ Health: -12 }, "I ignored my doctor's advice.")],
                ],
              };
            },
          },
          {
            min: 50,
            max: 100,
            kind: "Scam",
            make: () => ({
              who: "Unknown Caller",
              av: "1f4de",
              icon: "1f4f1",
              title: "Suspicious Call",
              desc: "Someone claiming to be from your bank asks for your account PIN.",
              choices: [
                [
                  "Give them the PIN",
                  () => {
                    const e = Math.round(0.3 * state.money);
                    return fx(
                      { money: -e, Happiness: -15 },
                      `I was scammed out of ${cur()}${e.toLocaleString()}.`,
                    );
                  },
                ],
                ["Hang up", () => fx({ Smarts: 2 }, "I hung up on a scam caller.")],
              ],
            }),
          },
          {
            min: 20,
            max: 85,
            kind: "Invitation",
            make() {
              const e = person(20, 40);
              return {
                ...personCard(e),
                icon: "1f492",
                title: "Wedding Invite",
                desc: `Your old friend ${e.first} invited you to ${"he" === e.he ? "his" : "her"} wedding.`,
                choices: [
                  ["Attend", () => fx({ Happiness: 7, money: -100 }, `I attended ${e.full}'s wedding.`)],
                  ["Make an excuse", () => fx({ Happiness: -2 }, `I skipped ${e.first}'s wedding.`)],
                ],
              };
            },
          },
          {
            min: 8,
            max: 40,
            kind: "Spooky",
            make() {
              const e = person(state.age, state.age + 2);
              return {
                ...personCard(e),
                icon: "1f47b",
                title: "Haunted House",
                desc: `${e.first} dares you to spend the night in the abandoned house down the road.`,
                choices: [
                  [
                    "Accept the dare",
                    () =>
                      chance(0.5)
                        ? fx({ Happiness: 8 }, "I survived a night in a haunted house!")
                        : fx({ Happiness: -10 }, "I saw a ghost and ran home screaming."),
                  ],
                  ["Chicken out", () => fx({ Happiness: -2 }, `I chickened out of ${e.first}'s dare.`)],
                ],
              };
            },
          },
          {
            min: 2,
            max: 6,
            kind: "Babysitter",
            make() {
              const e = person(16, 22);
              return (
                (e.crazy = rnd(40, 100)),
                {
                  ...personCard(e),
                  icon: "1f63f",
                  title: "Mean Babysitter",
                  desc: `Your babysitter ${e.first} won't let you watch cartoons.`,
                  choices: [
                    ["Cry", () => fx({ Happiness: -3 }, "I cried until my babysitter gave up.")],
                    ["Bite them", () => fx({ Happiness: 3 }, `I bit my babysitter, ${e.first}.`)],
                    ["Behave", () => fx({ Smarts: 1 }, "I behaved for my babysitter.")],
                  ],
                }
              );
            },
          },
          {
            min: 55,
            max: 100,
            kind: "Family",
            make() {
              const e = person(5, 12);
              return {
                ...personCard(e),
                icon: "1f381",
                title: "Grandkid Visit",
                desc: `A neighborhood ${e.kid}, ${e.first}, asks if you have any stories from the old days.`,
                choices: [
                  ["Tell a story", () => fx({ Happiness: 6 }, `I told ${e.first} stories about my youth.`)],
                  ["Give them $20", () => fx({ money: -20, Happiness: 4 }, `I gave ${e.first} $20.`)],
                  [
                    "Shoo them off my lawn",
                    () => fx({ Happiness: -1 }, "I yelled at a kid to get off my lawn."),
                  ],
                ],
              };
            },
          },
          {
            min: 16,
            max: 45,
            kind: "Street",
            make() {
              const e = person(18, 35);
              return (
                (e.crazy = rnd(70, 100)),
                {
                  ...personCard(e),
                  icon: "1f94a",
                  title: "Bar Fight",
                  desc: `${e.first} bumped into you at a bar and is looking for a fight.`,
                  choices: [
                    [
                      "Fight",
                      () =>
                        chance(0.5)
                          ? fx({ Happiness: 6 }, `I knocked out ${e.first} in a bar fight.`)
                          : fx({ Health: -12, Looks: -5 }, `${e.first} beat me up in a bar.`),
                    ],
                    ["Walk away", () => "I walked away from a bar fight."],
                    [
                      "Buy them a drink",
                      () =>
                        fx({ money: -10, Happiness: 3 }, `I bought ${e.first} a drink. We became friends.`),
                    ],
                  ],
                }
              );
            },
          },
          {
            min: 17,
            max: 19,
            kind: "College",
            make: () => ({
              who: "Admissions",
              av: "1f393",
              icon: "1f393",
              title: "College Letter",
              desc: "A university sent you a scholarship offer letter!",
              choices: [
                ["Accept", () => fx({ Smarts: 8, Happiness: 8 }, "I accepted a university scholarship.")],
                ["Decline", () => "I declined a university scholarship."],
              ],
            }),
          },
        ],
        FX_KEYS = { h: "Happiness", he: "Health", s: "Smarts", l: "Looks", m: "money" },
        toFx = (e) =>
          Object.fromEntries(
            Object.entries(e || {})
              .filter(([e]) => FX_KEYS[e])
              .map(([e, t]) => [FX_KEYS[e], t]),
          );
