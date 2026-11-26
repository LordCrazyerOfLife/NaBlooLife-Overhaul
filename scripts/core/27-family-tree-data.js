      function openMarketplace() {
        (sTitle.textContent = "BITLIFE++ MARKETPLACE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          screen.classList.add("mkt"),
          (sBack.onclick = () => {
            play("choice"),
              slideList(() => {
                screen.classList.remove("mkt"), openMainMenu();
              }, -1);
          });
        const e = mktOwned(),
          t = document.querySelector(".phone").classList.contains("dark"),
          a = ([e, a, o, n, s], r, i) =>
            `<div class="row mkt-row" data-mkt="${e}" style="background:${i}"><img src="mkt/${e}.png" alt=""><div class="t"><b>${a}</b><span>${o}</span></div>` +
            (r
              ? `<img class="mkt-owned" src="mkt/${t ? "owned-dm" : "owned"}.png" alt="Owned">`
              : `<div class="mkt-price">${s ? `<s>${s}</s>` : ""}FREE ZOMG!</div>`) +
            (!r && n ? `<i class="mkt-badge ${"NEW" === n ? "new" : ""}">${n}</i>` : "") +
            "</div>",
          o = MKT.flatMap((e) => e[3]),
          n = (e, a) => (t ? `color-mix(in srgb, ${e} 16%, #26282c)` : a);
        (sList.innerHTML =
          MKT.map(([t, o, s, r]) => {
            const i = r.filter((t) => !e.includes(t[0]));
            return i.length
              ? `<div class="sec" style="background:${o}">${t}</div>` +
                  i.map((e) => a(e, !1, n(o, s))).join("")
              : "";
          }).join("") +
          '<div class="sec">Owned</div>' +
          [...MKT_OWNED, ...e.map((e) => o.find((t) => t[0] === e)).filter(Boolean)]
            .map((e) => a(e, !0, n("#3f9a4c", "#eef8e8")))
            .join("") +
          '<div class="mkt-restore"><img src="mkt/restore.png" alt=""><span>Restore Earlier Purchase...</span></div>'),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-mkt]").forEach(
            (e) =>
              (e.onclick = () => {
                const t =
                  o.find((t) => t[0] === e.dataset.mkt) || MKT_OWNED.find((t) => t[0] === e.dataset.mkt);
                if (mktOwned().includes(t[0]) || MKT_OWNED.includes(t))
                  return notice(t[1], `You already own ${t[1]}!`, null, !0);
                try {
                  localStorage.setItem("bitlifepp-owned", JSON.stringify([...mktOwned(), t[0]]));
                } catch {}
                new Audio("sounds/a16_sndLuxuryPurchaseAsset.wav").play().catch(() => {}),
                  notice("Thank you!", `${t[1]} is now yours. Enjoy!`, null, !0);
                const a = sList.scrollTop;
                openMarketplace(), (sList.scrollTop = a);
              }),
          ),
          (sList.querySelector(".mkt-restore").onclick = () => {
            play("choice"),
              notice(
                "Restore Earlier Purchase",
                "All of your earlier purchases have been restored!",
                null,
                !0,
              );
          });
        window.FL_VIP && FL_VIP.decorateMarket && FL_VIP.decorateMarket();
      }
      function lifeLoading(e) {
        if (document.getElementById("lifeLoad")) return;
        const t = document.createElement("div");
        t.id = "lifeLoad";
        const a = document.querySelector(".phone"),
          o = a.classList.contains("flui") && !a.classList.contains("y2018");
        if (o) {
          (t.className = "ll-fl"), (t.innerHTML = window.FL_LOADER_HTML || "");
          try {
            sessionStorage.setItem("bitlifepp-fl-fadein", "1");
          } catch {}
        }
        a.append(t), o && (t.offsetWidth, t.classList.add("on")), setTimeout(e, o ? 5400 : rint(900, 1300));
      }
      function switchLife(e) {
        const t = () => {
            try {
              localStorage.setItem(ACTIVE_KEY, e);
            } catch {}
            blReload();
          },
          a = document.querySelector(".phone");
        a.classList.contains("flui") && !a.classList.contains("y2018")
          ? lifeLoading(() => saveLife().then(t, t))
          : saveLife().then(t, t);
      }
      async function restoreLife(e) {
        const t = await dbDo("readonly", (t) => t.get(e));
        if (!t || !t.state || (t.summary && t.summary.dead)) throw new Error("no playable save");
        const a = t.state,
          o = new Set();
        void 0 === a.bankOpen && (a.bankOpen = (a.age || 0) >= 13 || "custodial"),
          a.bankOpen || (a.bankOpen = "custodial");
        for (const e of Object.keys(state)) delete state[e];
        Object.assign(state, a);
        const n = (e) => {
          if (e && "object" == typeof e && !o.has(e)) {
            if ((o.add(e), e instanceof Set)) {
              const t = [...e].map((e) => (e === a || (e && e.__isState) ? state : e));
              return (
                e.clear(),
                void t.forEach((t) => {
                  e.add(t), n(t);
                })
              );
            }
            if (e instanceof Map)
              e.forEach((t, o) => {
                t === a || (t && t.__isState) ? e.set(o, state) : n(t);
              });
            else
              for (const t of Object.keys(e)) {
                const o = e[t];
                o === a || (o && o.__isState) ? (e[t] = state) : n(o);
              }
          }
        };
        n(state), Number.isFinite(state.money) || (state.money = 0), (SURNAME = t.surname || SURNAME);
        for (const e of Object.keys(mods)) mods[e] = !1;
        if ((Object.assign(mods, t.mods || {}), (t.modsV || 0) < 2))
          for (const e of ["showMoney", "hairPack", "gangTats", "pardinosTats", "bloodelTats"]) mods[e] = !0;
        if ((t.modsV || 0) < 3)
          for (const e of [
            "famousLife",
            "birthTraits",
            "militaryExpanded",
            "battleScars",
            "warReunion",
            "showMedals",
          ])
            mods[e] = !0;
        if ((t.modsV || 0) < 4) for (const e of ["extFamily", "familyTree", "lateAncestors"]) mods[e] = !0;
        lockMods(),
          saveMods(),
          (btShow = !!mods.birthTraits),
          (t.ach || []).forEach((e) => achAll.add(e)),
          saveAchAll(),
          achSeen.clear(),
          achAll.forEach((e) => achSeen.add(e));
        for (const e of [faceCache, previewCache]) for (const t of Object.keys(e)) delete e[t];
        (faceKey = ""),
          (log.innerHTML = t.log || ""),
          (log.scrollTop = log.scrollHeight),
          (document.getElementById("pname").textContent = `${state.first} ${SURNAME}`);
        const s = document.querySelector(".phone > .profile .pflag");
        (s.src = `flags/${state.country}.png`),
          (s.alt = (COUNTRIES[state.country] || [""])[0]),
          applyTheme(liveTheme()),
          jailUI(),
          (lifeLive = !0),
          window.dispatchEvent(new Event("bl-life-ready"));
      }
      RESUME_ID &&
        (document.querySelector(".phone").classList.add("picking"),
        restoreLife(RESUME_ID)
          .catch((e) => {
            console.warn("Saved life not found, starting a new one", e);
            try {
              localStorage.removeItem(ACTIVE_KEY);
            } catch {}
            return showStartScreen(), "new";
          })
          .then((e) => {
            "new" !== e && document.querySelector(".phone").classList.remove("picking");
          })),
        document.getElementById("ageBtn").addEventListener("click", () => setTimeout(saveLife, 900)),
        setInterval(() => {
          document.hidden || saveLife();
        }, 2e4),
        document.addEventListener("visibilitychange", () => {
          document.hidden && saveLife();
        }),
        window.addEventListener("pagehide", () => {
          saveLife();
        });
      let slideDone = null;
      function slideList(e, t) {
        slideDone?.();
        const a = [...sList.childNodes],
          o = sList.scrollTop;
        e();
        const n = document.createElement("div"),
          s = document.createElement("div");
        (n.className = "sl-pane"),
          (s.className = "sl-pane"),
          n.append(...sList.childNodes),
          s.append(...a),
          (s.style.marginTop = -o + "px");
        const r = getComputedStyle(screen).background,
          i = sList.clientHeight + "px";
        for (const e of [s, n]) (e.style.background = r), (e.style.minHeight = i);
        (s.style.minHeight = sList.clientHeight + o + "px"),
          sList.classList.add("sl-run"),
          sList.append(s, n),
          (sList.scrollTop = 0),
          (n.style.transform = `translateX(${100 * t}%)`),
          n.offsetWidth,
          (n.style.transform = ""),
          (s.style.transform = `translateX(${100 * -t}%)`);
        const l = () => {
            clearTimeout(d),
              (slideDone = null),
              sList.classList.remove("sl-run"),
              c.disconnect(),
              n.parentNode === sList && (s.remove(), sList.append(...n.childNodes), n.remove());
          },
          c = new MutationObserver(() => {
            n.parentNode !== sList && l();
          });
        c.observe(sList, { childList: !0 });
        const d = setTimeout(l, 340);
        slideDone = l;
      }
      function openPastLives(e) {
        if (!0 !== e) return play("choice"), slideList(() => openPastLives(!0), 1);
        e || play("choice"),
          (sTitle.textContent = "LIVES"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON);
        const t = livesIndex(),
          a = state.lifeId,
          o = lifeLive && a && !state.dead ? t.find((e) => e.id === a) || lifeSummary() : null,
          n = t.filter((e) => e.id !== a),
          s = `<img class="pl-trash" src="menu/${document.querySelector(".phone").classList.contains("dark") ? "trash-dm" : "trash"}.png" alt="Delete">`,
          r = (e, t, a) =>
            `<div class="row pl-row" data-${t}><i class="pl-face"></i><div class="t"><b>${e.first} ${e.last}</b><span>${((e) => `Last played ${new Date(e.savedAt || Date.now()).toLocaleDateString("en-US", { month: "long", day: "numeric" })}`)(e)}</span></div>${a}</div>`;
        sList.innerHTML =
          `<div class="sec">Start New Life</div><div class="row" data-new><img src="menu/bang.png"><div class="t"><b>New Life</b><span>Save this life and start a new one</span></div>${DOTS}</div>` +
          (o ? '<div class="sec">Current Life</div>' + r(o, "cur", DOTS) : "") +
          (n.length
            ? '<div class="sec">Lives on This Device</div>' + n.map((e, t) => r(e, `life="${t}"`, s)).join("")
            : "");
        const i = (e, t) => {
          const a = npcFace(
            { ...t.look, accRoll: 1, hatRoll: 1 },
            t.g,
            Math.max(0, t.age),
            t.dead ? "sad" : "happy",
            "pl-face",
          );
          t.dead && (a.style.filter = "grayscale(1)"), e.querySelector(".pl-face").replaceWith(a);
        };
        if (
          ((sBack.onclick = () => {
            play("choice"), slideList(openMainMenu, -1);
          }),
          (sList.querySelector("[data-new]").onclick = () => {
            const e = () => {
              screen.classList.remove("open"), startNewLife();
            };
            if (!o) return e();
            iosConfirm("Confirm", "Do you want to save your current life and start a new life?", e);
          }),
          o)
        ) {
          const e = sList.querySelector("[data-cur]");
          i(e, o), (e.onclick = () => pastLifeCard(o, !0));
        }
        sList.querySelectorAll("[data-life]").forEach((e) => {
          const t = n[+e.dataset.life];
          i(e, t),
            (e.onclick = (e) => {
              if (e.target.closest(".pl-trash"))
                return iosConfirm(
                  "Delete Life",
                  `Are you sure you want to delete ${t.first} ${t.last}? This can't be undone.`,
                  () => {
                    dbDo("readwrite", (e) => e.delete(t.id)).catch(() => {}),
                      setLivesIndex(livesIndex().filter((e) => e.id !== t.id)),
                      openPastLives(!0);
                  },
                );
              pastLifeCard(t);
            });
        }),
          (sList.scrollTop = 0);
      }
      function pastLifeCard(e, t) {
        const [a] = COUNTRIES[e.country] || ["Unknown"];
        (ev.innerHTML = `<div class="jm-x" id="plX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="ev-tag" style="margin-top:12px"><i class="pl-av"></i><span class="who">${e.first} ${e.last}</span><span class="kind">${e.dead ? "Past Life" : "Saved Life"}</span></div>\n      <h4><img src="menu/users.png" alt=""><span>${e.first} ${e.last}</span></h4>\n      <table><tbody><tr><td style="text-align:center;padding-left:0"><b>Age:</b> ${e.age}${e.dead ? " (deceased)" : ""}</td></tr>\n        <tr><td style="text-align:center;padding-left:0"><b>Gender:</b> ${"f" === e.g ? "Female" : "Male"}</td></tr>\n        <tr><td style="text-align:center;padding-left:0"><b>Born:</b> ${e.born} in ${a}</td></tr>\n        <tr><td style="text-align:center;padding-left:0"><b>Bank Balance:</b> ${usd(e.money || 0)}</td></tr>\n        <tr><td style="text-align:center;padding-left:0"><b>Last Played:</b> ${new Date(e.savedAt).toLocaleDateString()}</td></tr></tbody></table>\n      ${e.dead || t ? "" : '<button class="jm-apply ev-btn" id="plGo">Switch to this life</button>'}\n      ${t ? "" : '<button class="jm-apply ev-btn" id="plDel" style="background:#c62828;border-bottom-color:#8e1b1b;margin-top:10px">Delete this life</button>'}`),
          ev
            .querySelector(".pl-av")
            .replaceWith(
              npcFace({ ...e.look, accRoll: 1, hatRoll: 1 }, e.g, Math.max(0, e.age), "happy", "ev-av"),
            ),
          (ev.style.overflow = "visible");
        const o = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        document.getElementById("plX").onclick = o;
        const n = document.getElementById("plGo");
        n &&
          (n.onclick = () =>
            iosConfirm(
              "Switch Lives",
              `Leave this life and continue as ${e.first} ${e.last}? This life is saved first.`,
              () => {
                o(), switchLife(e.id);
              },
            ));
        const s = document.getElementById("plDel");
        s &&
          (s.onclick = () =>
            iosConfirm(
              "Delete Life",
              `Are you sure you want to delete ${e.first} ${e.last}? This can't be undone.`,
              () => {
                o(),
                  dbDo("readwrite", (t) => t.delete(e.id)).catch(() => {}),
                  setLivesIndex(livesIndex().filter((t) => t.id !== e.id)),
                  openPastLives(!0);
              },
            )),
          evWrap.classList.add("open");
      }
      function showPicker() {
        const e = document.createElement("div");
        (e.id = "picker"),
          document.querySelector(".phone").append(e),
          document.querySelector(".phone").classList.add("picking");
        const t = (t) => {
            e.classList.remove("in"),
              (e.innerHTML = `<div class="pk-box">${t}</div>`),
              requestAnimationFrame(() => e.classList.add("in"));
          },
          a = (a) => {
            const o = ((e) => {
              const t = new Set();
              return [0, 1, 2].map(() => {
                let a;
                do {
                  a = uname(e);
                } while (t.has(a));
                t.add(a);
                const o = randomLook(e, 25);
                return (o.beard = 0), (o.accRoll = o.hatRoll = 1), { g: e, first: a, last: ulast(), look: o };
              });
            })(a);
            t(
              '<p class="pk-q">Now, pick someone to become.</p>' +
                o
                  .map(
                    (e, t) =>
                      `<button class="pk-btn pk-c${t}" data-i="${t}"><i class="pk-face"></i>${e.first} ${e.last}</button>`,
                  )
                  .join(""),
            ),
              e.querySelectorAll("[data-i]").forEach((t) => {
                const n = o[+t.dataset.i];
                t.querySelector(".pk-face").replaceWith(npcFace(n.look, a, 25, "happy", "pk-face")),
                  (t.onclick = () =>
                    ((t) => {
                      play("choice");
                      try {
                        localStorage.setItem(
                          "bitlifepp-pick",
                          JSON.stringify({
                            g: t.g,
                            first: t.first,
                            last: t.last,
                            look: {
                              skin: t.look.skin,
                              eyes: t.look.eyes,
                              hair: t.look.hair,
                              seed: t.look.seed,
                            },
                          }),
                        ),
                          lifeLoading(() => blReload());
                      } catch {
                        e.remove();
                      }
                    })(n));
              });
          };
        t(
          '<p class="pk-q"><img src="emoji/1f30e.png" alt="">Become someone else in BitLife.</p><p class="pk-q">Start by picking a gender.</p>\n      <button class="pk-btn pk-m" data-g="m"><span class="pk-sym">&#9794;</span>Male</button>\n      <button class="pk-btn pk-f" data-g="f"><span class="pk-sym">&#9792;</span>Female</button>',
        ),
          e.querySelectorAll("[data-g]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), a(e.dataset.g);
              }),
          );
      }
      const firstTimer = () => {
        try {
          return !localStorage.getItem("bitlifepp-tut-age") && !livesIndex().length;
        } catch {
          return !0;
        }
      };
      function showStartScreen() {
        if (firstTimer()) return showPicker();
        document.querySelector(".phone").classList.add("picking"), openNewLifeMenu({ closable: !1 });
      }
      PICKING && !RESUME_ID && showStartScreen();
      const tutDone = (() => {
        try {
          return !!localStorage.getItem("bitlifepp-tut-age");
        } catch {
          return !0;
        }
      })();
      PICK &&
        !tutDone &&
        setTimeout(() => {
          try {
            localStorage.setItem("bitlifepp-tut-age", "1");
          } catch {}
          const e = document.querySelector(".phone"),
            t = document.createElement("div");
          (t.id = "tut"),
            (t.innerHTML = '<div class="tut-hole"></div><div class="tut-text"></div>'),
            e.append(t),
            e.classList.add("tut-on");
          const a = t.querySelector(".tut-hole"),
            o = t.querySelector(".tut-text"),
            n = (n, s, r, i, l, c = n.t) => {
              Object.assign(a.style, {
                left: n.l + "px",
                top: n.t + "px",
                width: n.w + "px",
                height: n.h + "px",
                borderRadius: s,
              }),
                t.querySelector(".tut-x")?.remove(),
                l &&
                  t.insertAdjacentHTML(
                    "beforeend",
                    `<div class="tut-x" style="left:${Math.min(n.l + n.w - 22, e.clientWidth - 36)}px;top:${Math.min(n.t + n.h - 22, e.clientHeight - 36)}px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg></div>`,
                  ),
                o.classList.remove("in"),
                (o.innerHTML = r),
                Object.assign(
                  o.style,
                  i
                    ? { top: n.t + n.h + 28 + "px", bottom: "" }
                    : { top: "", bottom: e.clientHeight - c + 26 + "px" },
                ),
                requestAnimationFrame(() => o.classList.add("in"));
            },
            s = (...t) => {
              const a = e.getBoundingClientRect(),
                o = t.filter(Boolean).map((e) => e.getBoundingClientRect()),
                n = Math.min(...o.map((e) => e.left)),
                s = Math.min(...o.map((e) => e.top)),
                r = Math.max(...o.map((e) => e.right)),
                i = Math.max(...o.map((e) => e.bottom));
              return { l: n - a.left + 4, t: s - a.top + 2, w: r - n - 8, h: i - s + 6 };
            },
            r = state.stats,
            i = (e) =>
              e.length < 3 ? e.join(" and ") : e.slice(0, -1).join(", ") + ", and " + e[e.length - 1],
            l = [
              r.Health >= 70 && "healthy",
              r.Smarts >= 70 && "intelligent",
              r.Looks >= 70 && "attractive",
            ].filter(Boolean),
            c = [
              r.Health < 35 && "unhealthy",
              r.Smarts < 35 && "unintelligent",
              r.Looks < 35 && "unattractive",
            ].filter(Boolean),
            d = `You're ${r.Happiness >= 70 ? "quite happy" : r.Happiness >= 40 ? "fairly content" : "quite miserable"}${l.length ? ` and you're ${i(l)}` : ""}${c.length ? `${l.length ? ", but" : " as sadly"} you're rather ${i(c)}` : ""}.`,
            u = [
              () => {
                return n(
                  ((e = s(
                    document.querySelector(".phone > .profile"),
                    document.querySelector("#log .year h3"),
                  )),
                  { ...e, h: e.h + 16 }),
                  "12px",
                  '<img src="emoji/2705.png" alt="">Your new life has begun!',
                  !0,
                );
                var e;
              },
              () =>
                n(
                  s(document.getElementById("stats")),
                  "12px",
                  `<img src="splash/seedling.png" alt="">${d}`,
                  !1,
                  !0,
                  s(document.querySelector(".dock")).t,
                ),
              () => {
                const t = document.getElementById("ageBtn").getBoundingClientRect(),
                  a = e.getBoundingClientRect(),
                  r = Math.max(t.width, t.height) + 14;
                n(
                  {
                    l: t.left - a.left + t.width / 2 - r / 2,
                    t: t.top - a.top + t.height / 2 - r / 2,
                    w: r,
                    h: r,
                  },
                  "50%",
                  '<p><img src="splash/point-up.png" alt="">Press <b>Age</b> to grow older one year at a time.</p><p class="more">Make choices as you go.</p><p class="more">Live your best (or worst) life.</p>',
                  !1,
                  !1,
                  s(document.querySelector(".dock")).t - 40,
                ),
                  o
                    .querySelectorAll(".more")
                    .forEach((e, t) => setTimeout(() => e.classList.add("in"), 900 + 900 * t));
                try {
                  localStorage.setItem("bitlifepp-tut-age", "1");
                } catch {}
              },
            ];
          let h = 0;
          u[0](),
            (t.onclick = () => {
              play("choice"),
                ++h < u.length
                  ? u[h]()
                  : ((t.style.transition = "opacity .3s"),
                    (t.style.opacity = 0),
                    e.classList.remove("tut-on"),
                    setTimeout(() => t.remove(), 300));
            });
        }, 350);
      const FT_ARCHIVE = {
          ancestor_discovered: ["act/profile.png", "Archive Discovery"],
          fame_revealed: ["1f3c5", "Fame Record"],
          death_revealed: ["ui/skull-and-bones.png", "Death Record"],
          ancestor_quote: ["1f4dc", "In Their Own Words"],
        },
        FT_SCENE = {
          missing_birth_record: ["1f4dc", "Missing Birth Record"],
          famous_ancestor: ["2b50", "Famous Ancestor"],
          old_portrait: ["1f3a8", "An Old Portrait"],
          forgotten_occupation: ["1f528", "A Forgotten Trade"],
          death_record: ["1f56f-fe0f", "Death Record"],
          lost_letter: ["1f4dc", "A Lost Letter"],
          family_reunion: ["1f46a", "Family Reunion"],
          treasured_artifact: ["1f3fa", "A Treasured Heirloom"],
          surname_mystery: ["1f4d6", "Surname Mystery"],
          old_newspaper: ["1f4f0", "An Old Newspaper"],
          repaired_headstone: ["1f56f-fe0f", "A Repaired Headstone"],
          inheritance_note: ["1f4b0", "An Inheritance Note"],
          old_schoolbook: ["1f393", "An Old Schoolbook"],
          village_story: ["1f3e0", "A Village Story"],
          unknown_sibling: ["1f46a", "An Unknown Sibling"],
          fame_rivalry: ["1f3c5", "A Famous Rivalry"],
          charity_ledger: ["1f4b0", "A Charity Ledger"],
          flooded_archive: ["1f4dc", "A Flooded Archive"],
          family_song: ["1f3bb", "The Family Song"],
          farewell_note: ["1f4dc", "A Farewell Note"],
          trade_union: ["1f454", "The Trade Union"],
          travel_diary: ["1f5fa-fe0f", "A Travel Diary"],
          medicine_chest: ["1f489", "A Medicine Chest"],
          lost_engraving: ["1f3a8", "A Lost Engraving"],
          first_apprentice: ["1f528", "The First Apprentice"],
          anniversary: ["1f48d", "An Anniversary"],
          missing_census: ["1f4dc", "Missing Census Page"],
          public_speech: ["1f3db-fe0f", "A Public Speech"],
          portrait_restoration: ["1f3a8", "Portrait Restoration"],
          legend_vs_fact: ["1f4d6", "Legend vs. Fact"],
        },
        ftIcoAttr = (e) => (e.includes("/") ? { iconSrc: e } : { icon: e });
      function ftArchive(e, t, a) {
        const o = e.src,
          n = o.pack[20][t],
          [s, r] = FT_ARCHIVE[n[0]] || ["1f4dc", "Record"],
          i = (e) => ftPackText(o, e),
          l = (e) => (((o.dlgSeen ||= {})[t] = 1), i(e));
        openEvent({
          kind: "Family Tree",
          jail: !0,
          make: () => ({
            who: `${e.first} ${e.last}`,
            av: "1f4dc",
            ...ftIcoAttr(s),
            title: r,
            feedback: !0,
            then: a,
            desc: `<b>${n[1]}:</b> ${i(n[2])}`,
            person: { look: o.look, g: e.g, age: e.age },
            choices: [
              [n[3], () => l(n[5])],
              [n[4], () => l(n[6])],
            ],
          }),
        });
      }
      function ftLocalCard(e) {
        const t = e.src.localFame,
          a = e.src.pack,
          o = (t) => ftPackText(e.src, t);
        ftEvCard(
          e,
          `<img src="emoji/${FT_FAME_ICO[t.cat] || "1f3c5"}.png">`,
          "Local Legend",
          `<table class="prof"><tbody><tr><td><b>Fame:</b> ${FT_FAME_LVL[t.level]}</td></tr><tr><td><b>Known For:</b> ${ftCap(t.reason)}</td></tr><tr><td><b>Year:</b> ${t.year}</td></tr><tr><td><b>Field:</b> ${ftCap(t.cat)}</td></tr><tr><td><b>Keepsake:</b> ${ftCap(a[12])}</td></tr></tbody></table><div class="lead">${o(a[18])} ${o(a[19])}</div>`,
        );
      }
      function ftRelOf(e) {
        const t = state.ft;
        if (t.gp.includes(e)) return "m" === e.g ? "Grandfather" : "Grandmother";
        for (const a of [t.p, t.m]) {
          const t = a.findIndex((t) => t.includes(e));
          if (t >= 0) return `${t ? ftOrd(t + 1) + " " : ""}Great-Grand${"m" === e.g ? "father" : "mother"}`;
        }
        return "Ancestor";
      }
      const ftSceneEvent = {
        min: 8,
        max: 120,
        kind: "Family Tree",
        ok: () =>
          mods.familyTree &&
          !!state.ft &&
          ftPackSlots(state.ft).some(([e]) => e.pack && e.pack[21].some((t, a) => !(e.scnSeen || {})[a])),
        make() {
          const e = ftPackSlots(state.ft).flatMap(([e]) =>
              e.pack ? e.pack[21].map((t, a) => [e, t, a]).filter(([, , t]) => !(e.scnSeen || {})[t]) : [],
            ),
            [t, a, o] = any(e),
            [n, s] = FT_SCENE[a[0]] || ["1f4dc", "Family History"],
            r = (e) => ftPackText(t, e),
            i = () => (((t.scnSeen ||= {})[o] = 1), `${r(a[5])}`);
          return {
            who: `${t.first} ${t.last} (${ftRelOf(t)})`,
            av: "1f4dc",
            ...ftIcoAttr(n),
            title: s,
            feedback: !0,
            desc: `<b>${a[1]}:</b> ${r(a[2])}`,
            person: { look: t.look, g: t.g, age: t.life },
            choices: [
              [a[3], i],
              [a[4], i],
            ],
          };
        },
      };
      EVENTS.push(ftSceneEvent);
      const FT_CELEB = [
        ["Pop Star", "1f3a4", [3e4, 5e4], "chart-topping songs and sold-out world tours"],
        ["Movie Star", "1f3ac", [25e3, 45e3], "blockbuster movies and red-carpet premieres"],
        ["Rapper", "1f3a7", [25e3, 45e3], "platinum albums and viral music videos"],
        ["Social Media Influencer", "1f4f1", [3e4, 5e4], "viral posts and millions of followers"],
        ["Rock Musician", "1f3b8", [15e3, 35e3], "stadium tours and legendary albums"],
        ["Pro Athlete", "26bd", [15e3, 3e4], "championship wins and record-breaking seasons"],
        ["Reality TV Star", "1f4fa", [15e3, 3e4], "a hit reality show and endless headlines"],
        ["Supermodel", "1f457", [1e4, 25e3], "magazine covers and runway shows"],
        ["Tech Billionaire", "1f4b0", [8e3, 15e3], "founding a famous tech company"],
        ["Celebrity Chef", "1f373", [5e3, 12e3], "TV cooking shows and best-selling cookbooks"],
        ["News Anchor", "1f4f0", [5e3, 1e4], "anchoring the evening news"],
        ["Politician", "1f3db-fe0f", [5e3, 1e4], "high office and televised speeches"],
        ["Bestselling Author", "1f4d6", [3e3, 8e3], "best-selling novels turned into movies"],
      ];
      function ftOn() {
        return !(isOldEra() || (!mods.famousLife && !state.famousStart));
      }
      const FT_MEGA_JOBS = ["Pop Star", "Movie Star", "Rapper", "Social Media Influencer"],
        ftStar = (e) =>
          e.celeb && ftOn()
            ? ` <img src="stat-emoji/star.png" alt="" title="${e.celeb.career}" style="width:16px;height:16px;vertical-align:-2px">`
            : "",
        ftFmt = (e) =>
          e >= 1e9
            ? (e / 1e9).toFixed(1).replace(/\.0$/, "") + "B"
            : e >= 1e6
              ? (e / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
              : e >= 1e3
                ? Math.round(e / 1e3) + "K"
                : "" + e;
      function ftMakeCeleb(e, t, a) {
        const o = a ? FT_CELEB.find((e) => e[0] === any(FT_MEGA_JOBS)) : any(FT_CELEB),
          [n, s, r, i] = o,
          l = a
            ? chance(0.35)
              ? rint(700, 1e3)
              : rint(150, 699)
            : chance(0.15)
              ? rint(85, 100)
              : chance(0.45)
                ? rint(60, 84)
                : rint(30, 59),
          c = ftBornOf(e),
          d = Math.min(ftNow(), c + rint(18, 30)),
          u = Math.round((a ? 10 ** (8 + l / 1e3) : 10 ** (3 + l / 20)) * (0.7 + 0.6 * Math.random())),
          h = "f" === t ? { he: "she", He: "She", his: "her" } : { he: "he", He: "He", his: "his" },
          p =
            l >= 700
              ? "Global megastar"
              : l > 100
                ? "Superstar"
                : l >= 85
                  ? "A-list"
                  : l >= 60
                    ? "Famous"
                    : "Well-known";
        e.celeb = { career: n, ico: s, range: r, level: l, fans: u, mega: l > 100 };
        const m = profileOf(e, null != e.ageAtBirth ? e.ageAtBirth + state.age : relAge(e)),
          f =
            l > 100
              ? 1e6 * rint(50, 900)
              : l >= 85
                ? 1e6 * rint(10, 80)
                : l >= 60
                  ? 1e6 * rint(2, 15)
                  : 1e3 * rint(500, 3e3);
        (m.money = Math.max(m.money || 0, localPrice("Tech Billionaire" === n ? Math.max(1e9, 20 * f) : f))),
          (m.job = n),
          (e.famous = {
            t: n,
            ico: s,
            year: d,
            stars: Math.min(5, Math.max(1, Math.ceil(l / 20))),
            modern: !0,
            hl: `${p} ${n.toLowerCase().replace(/\btv\b/, "TV")} · Fame ${l}%`,
            story: [
              `${e.first} became famous in ${d} for ${i}.`,
              l > 100
                ? `${h.He} is one of the most famous people on Earth, with ${ftFmt(u)} followers; ${h.his} face is on billboards in every country.`
                : `Today ${h.he} has ${ftFmt(u)} followers, and paparazzi follow the whole family around.`,
            ],
            feats: [
              `${ftFmt(u)} followers`,
              `Fame ${l}%`,
              l > 100
                ? "Known in every country on Earth"
                : l >= 85
                  ? "A household name worldwide"
                  : l >= 60
                    ? "Recognized everywhere they go"
                    : "Well known in their field",
            ],
            legacy:
              l > 100
                ? "Being part of this family means the whole world knows your name."
                : "The family name opens doors everywhere.",
          });
      }
      function ftRollCelebs() {
        if (state.celebRolled) return;
        state.celebRolled = !0;
        if (PICK && PICK.heir) return;
        const e = !(!PICK || !PICK.famous);
        if ((e && (state.famousStart = !0), e || chance(0.2))) {
          if (chance(e ? 0.25 : 0.05)) {
            const [e, t] = [...state.parents].sort(() => Math.random() - 0.5);
            ftMakeCeleb(e, e.gender, !0), chance(0.25) && ftMakeCeleb(t, t.gender, !0);
          }
          if (
            (state.parents.forEach((e) => {
              !e.celeb && chance(0.14) && ftMakeCeleb(e, e.gender);
            }),
            state.family.forEach((e) => {
              const t =
                { grandparent: 0.06, auntuncle: 0.06, sibling: e.ageOffset > 0 ? 0.04 : 0 }[e.kind] || 0;
              t && relAge(e) >= 18 && chance(t) && ftMakeCeleb(e, e.g);
            }),
            !state.parents.some((e) => e.celeb) && state.parents.length)
          ) {
            const e = any(state.parents);
            ftMakeCeleb(e, e.gender);
          }
        }
      }
      const FT_FAME_W = { parent: 1, sibling: 0.5, grandparent: 0.4, auntuncle: 0.35 };
      function ftFamousRel() {
        return [
          ...state.parents.map((e) => [e, FT_FAME_W.parent]),
          ...state.family.map((e) => [e, FT_FAME_W[e.kind] || 0]),
        ]
          .filter(([e, t]) => e.celeb && t)
          .map(([e, t]) => [e, t * (e.dead ? 0.5 : 1)]);
      }
      function ftFamilyFame() {
        const e = ftFamousRel(),
          t = e.reduce((e, [t, a]) => e + t.celeb.level * a, 0);
        return { score: Math.min(1e3, Math.round(t)), who: e.map(([e]) => e) };
      }
      const ftFameFloor = () => {
        const e = ftFamilyFame().score;
        return Math.min(100, Math.round(e * (e > 100 ? 0.9 : 0.5)));
      };
      function ftApplyFloor() {
        const e = ftFameFloor(),
          t = state.art;
        e < 3 ||
          ((t.fameOn = !0),
          (state.fameFloor = e),
          (t.fame = Math.max(t.fame, Math.min(100, e))),
          renderStats());
      }
      const ftNepoFollowers = () =>
        Math.round(
          ftFamousRel().reduce((e, [t, a]) => {
            const [o, n] = t.celeb.range || [5e3, 15e3];
            return e + (o + Math.random() * (n - o)) * (t.celeb.level / 100) * a;
          }, 0),
        );
      function ftNepoSignup(e) {
        if (!ftOn()) return;
        const t = state.social[e],
          a = socReach(e, 2 * ftNepoFollowers());
        a &&
          t &&
          ((t.subs += a),
          say(
            `Fans of my famous family instantly gave my new account ${a.toLocaleString("en-US")} followers.`,
          ));
      }
      function ftTrustFund(e, t) {
        if ("1800s" === state.era) return;
        const a = socYear(),
          o = ACCT_TYPES.filter((e) => a >= e.y).sort((e, t) => t.rate(a) - e.rate(a))[0],
          n = localPrice(t ? 1e5 * rint(5, 50) : 1e4 * rint(2, 40)),
          s = String(rint(1e3, 9999));
        accts().push({
          type: o.id,
          num: s,
          bal: n,
          opened: a,
          hist: [{ y: a, bal: n }],
          earned: 0,
          trust: !0,
        }),
          sideTx(s, n, "Deposit", `TRUST DEPOSIT FROM ${e.first.toUpperCase()} ${SURNAME.toUpperCase()}`),
          say(
            `My ${e.role.toLowerCase()} opened a ${o.name.toLowerCase()} account in my name with ${usd(n)} in it.`,
          ),
          queuePopup(() =>
            notice(
              "Trust Fund",
              `Your ${e.role.toLowerCase()}, ${e.first}, opened a ${o.name} account in your name at ${bankFor()} and put ${usd(n)} in it.<br><br>It earns ${(100 * o.rate(a)).toFixed(2)}% APY, and you'll see how much it grows every year. You can see it in the Bank tab.`,
              null,
              !0,
            ),
          );
      }
      setTimeout(() => {
        if (!(mods.famousLife || (PICK && PICK.famous))) return;
        if (document.querySelector(".phone").classList.contains("picking")) return;
        ftRollCelebs();
        const { score: e, who: t } = ftFamilyFame();
        if (!e) return;
        const a = t.filter((e) => state.parents.includes(e)),
          o = (e) => ftAn(e.celeb.career.toLowerCase().replace(/\btv\b/, "TV")),
          n = t.some((e) => e.celeb.mega);
        (state.age > 0 || state.famousBornSaid) ||
          ((state.famousBornSaid = !0),
        say(
          a.length
            ? `I was born into ${n ? "one of the most famous families on Earth" : "a famous family"}: my ${a.map((e) => `${e.role.toLowerCase()}, ${e.first}, is ${e.celeb.mega ? "a global megastar " + e.celeb.career.toLowerCase() : o(e)}`).join(", and my ")}. ` +
                (n
                  ? "News helicopters circled the hospital and my first photo sold for millions."
                  : "Paparazzi waited outside the hospital.")
            : `I was born into a famous family: my ${relTitle(t[0]).toLowerCase()}, ${t[0].first}, is ${o(t[0])}.`,
        )),
          ftApplyFloor(),
          state.trustRolled ||
            0 !== state.age ||
            ((state.trustRolled = !0), a.length && chance(n ? 0.85 : 0.55) && ftTrustFund(a[0], n));
      }, 700),
        document.getElementById("ageBtn").addEventListener("click", () => {
          if (state.dead || !ftOn()) return;
          const { score: e } = ftFamilyFame();
          if (!e) return;
          ftApplyFloor(), chance(0.25) && (state.art.fame = clamp(state.art.fame + 1));
          let t = 0;
          for (const e in state.social) {
            const a = state.social[e];
            if (a.banned || notSocial(e)) continue;
            const o = ftNepoFollowers();
            (a.subs += o), (t += o);
          }
          t && say(`My famous family helped me gain ${t.toLocaleString("en-US")} new followers this year.`),
            renderStats();
        }),
        document.getElementById("ageBtn").addEventListener("click", () => {
          state.dead ||
            state.age < 8 ||
            !chance(0.12) ||
            !ftSceneEvent.ok() ||
            setTimeout(() => {
              overlayOpen() || openEvent(ftSceneEvent);
            }, 950);
        });
      const FT_WARS = [
          ["the American Revolutionary War", 1775, 1783],
          ["the French Revolution", 1789, 1799],
          ["the Napoleonic Wars", 1803, 1815],
          ["the War of 1812", 1812, 1815],
          ["the Crimean War", 1853, 1856],
          ["the American Civil War", 1861, 1865],
          ["the Franco-Prussian War", 1870, 1871],
          ["the Second Boer War", 1899, 1902],
          ["World War I", 1914, 1918],
          ["World War II", 1939, 1945],
          ["the Korean War", 1950, 1953],
          ["the Vietnam War", 1965, 1973],
        ],
        FT_OLYMPICS = {
          1896: "Athens",
          1900: "Paris",
          1904: "St. Louis",
          1908: "London",
          1912: "Stockholm",
          1920: "Antwerp",
          1924: "Paris",
          1928: "Amsterdam",
          1932: "Los Angeles",
          1936: "Berlin",
          1948: "London",
          1952: "Helsinki",
          1956: "Melbourne",
          1960: "Rome",
          1964: "Tokyo",
          1968: "Mexico City",
          1972: "Munich",
        },
        FT_RUSHES = [
          ["the California Gold Rush", 1848, 1855, "Sacramento"],
          ["the Victorian Gold Rush", 1851, 1860, "Ballarat"],
          ["the Klondike Gold Rush", 1896, 1899, "Dawson City"],
        ],
        ftBook = () =>
          `The ${any(["Silent", "Crimson", "Last", "Forgotten", "Golden", "Broken", "Wandering", "Hollow", "Midnight", "Winter"])} ${any(["Harbor", "Orchard", "Lantern", "Crown", "River", "Letter", "Lighthouse", "Garden", "Daughter", "Road"])}`,
        FT_FAMES = [
          {
            t: "War Hero",
            ico: "1f396-fe0f",
            when: FT_WARS,
            make: (e, t, a, [o, , n]) =>
              "m" === e.g
                ? {
                    hl: `Decorated hero of ${o}`,
                    story: [
                      `${e.first} enlisted in ${a} at just ${a - e.born} years old. During a brutal battle in ${Math.min(n, a + 1)}, ${t.he} ran back into enemy fire ${rint(3, 9)} times and carried ${rint(6, 21)} wounded soldiers to safety.`,
                      `${t.He} was awarded ${e.medal || ftMedal(a)} and came home to a parade in ${e.city}. Newspapers called ${t.him} "the bravest ${e.last} who ever lived."`,
                    ],
                    feats: [
                      `Saved ${rint(6, 21)} lives on the battlefield`,
                      `Promoted to ${any(["Sergeant", "Lieutenant", "Captain", "Major"])} in the field`,
                      `A statue of ${t.him} stands in ${e.city}`,
                    ],
                    legacy: `${t.His} medal is still passed down through the ${SURNAME} family.`,
                  }
                : {
                    hl: `Legendary battlefield nurse of ${o}`,
                    story: [
                      `${e.first} volunteered as a nurse in ${a}, working in field hospitals just behind the front lines.`,
                      `When the hospital was shelled, ${t.he} refused to leave and kept ${rint(30, 140)} patients alive through the night by lantern light. Soldiers called ${t.him} "the Angel of the Trenches."`,
                    ],
                    feats: [
                      "Decorated for bravery under fire",
                      `Trained over ${100 * rint(2, 9)} new nurses after the war`,
                      "Founded a hospital that still exists today",
                    ],
                    legacy: "Nursing schools still teach the story of that night.",
                  },
          },
          {
            t: "Court Composer",
            ico: "1f3bb",
            when: [[null, 1720, 1890]],
            make: (e, t, a) => {
              const o = `${any(["Symphony", "Concerto", "Sonata", "Requiem", "Serenade"])} No. ${rint(2, 41)} in ${any(["D minor", "E-flat major", "G major", "C minor", "A major"])}`;
              return {
                hl: "Composer to the royal court",
                story: [
                  `${e.first} was playing the harpsichord by age ${rint(4, 7)}. In ${a}, a duke heard ${t.him} perform and hired ${t.him} as composer to the royal court.`,
                  `${t.His} "${o}" was performed in every great concert hall of the age, and audiences reportedly wept at its premiere.`,
                ],
                feats: [
                  `Composed ${rint(40, 600)} works`,
                  `"${o}" (${a + rint(1, 8)})`,
                  `Played for ${any(["an emperor", "a king and queen", "the Pope", "a tsar"])}`,
                ],
                legacy: `${t.His} original handwritten scores are kept in a national library.`,
              };
            },
          },
          {
            t: "Pirate Captain",
            ico: "2620-fe0f",
            when: [
              [null, 1700, 1730],
              [null, 1780, 1830],
            ],
            make: (e, t, a) => {
              const o = `the ${any(["Black", "Crimson", "Silent", "Golden", "Wicked"])} ${any(["Gull", "Serpent", "Widow", "Revenge", "Fortune"])}`;
              return {
                hl: `Infamous captain of ${o}`,
                story: [
                  `${e.first} stole a merchant ship in ${a} and renamed it ${o}. Within a year ${t.he} commanded a crew of ${rint(40, 180)}.`,
                  `"Captain ${e.last}" raided ${rint(20, 90)} ships, had a ${usd(100 * rint(5, 50))} bounty on ${t.his} head, and was never caught.`,
                ],
                feats: [
                  `Captured ${rint(20, 90)} ships`,
                  `A ${usd(100 * rint(5, 50))} bounty (a fortune back then)`,
                  "Buried treasure that has never been found",
                ],
                legacy: `The family still has an old map that supposedly leads to ${t.his} treasure.`,
              };
            },
          },
          {
            t: "Inventor",
            ico: "1f4a1",
            when: [[null, 1840, 2e3]],
            make: (e, t, a) => {
              const o = any([
                "the spring-loaded mousetrap",
                "a hand-cranked washing machine",
                "the folding ironing board",
                "a waterproof match",
                "the paper drinking straw",
                "a bicycle brake design still used today",
                "a crank-powered radio",
                "the automatic potato peeler",
                "a new kind of bottle cap",
                "the self-wringing mop",
                "a pocket-sized camera",
                "the first electric hair curler",
              ]);
              return {
                hl: `Invented ${o}`,
                story: [
                  `Working out of a cramped shed in ${e.city}, ${e.first} spent ${rint(3, 12)} years tinkering before patenting ${o} in ${a}.`,
                  `Within a decade it was in homes all over ${ftCountryName(e.country)}. ${t.He} famously turned down a buyout offer of ${usd(1e4 * rint(2, 40))} because "it's my baby."`,
                ],
                feats: [
                  `Patent granted in ${a}`,
                  `Held ${rint(4, 31)} patents in total`,
                  `Featured in ${any(["Scientific American", "Popular Mechanics", "the World's Fair"])}`,
                ],
                legacy: "Somebody in the family still has the original prototype in a box in the attic.",
              };
            },
          },
          {
            t: "Movie Star",
            ico: "1f3ac",
            when: [
              ["silent", 1908, 1929],
              ["golden", 1930, 1962],
            ],
            make: (e, t, a, [o]) => {
              const n = ftBook();
              return {
                hl: ("silent" === o ? "Silent film" : "Golden Age Hollywood") + " star",
                story: [
                  `${e.first} was discovered ${any(["selling flowers on a street corner", "waiting tables at a diner", "singing at a church fair", "working in a dry-goods store"])} and starred in ${t.his} first picture in ${a}.`,
                  `${t.His} role in "${n}" made ${t.him} one of the most recognizable faces ${"silent" === o ? "of the silent screen" : "in Hollywood"}. Fans mobbed ${t.him} at every premiere.`,
                ],
                feats: [
                  `Appeared in ${rint(12, 64)} films`,
                  `"${n}" (${a + rint(1, 5)})`,
                  "silent" === o ? 'Made the leap to "talkies" in 1929' : "Has a star on a walk of fame",
                ],
                legacy: `Old reels of ${t.his} films still play at classic cinema nights.`,
              };
            },
          },
          {
            t: "Jazz Legend",
            ico: "1f3a4",
            when: [[null, 1917, 1958]],
            make: (e, t, a) => {
              const o = any(["trumpet", "saxophone", "piano", "clarinet", "double bass", "voice"]);
              return {
                hl: `Jazz ${"voice" === o ? "singer" : o + " player"} of the ${10 * Math.floor(a / 10)}s`,
                story: [
                  `${e.first} played ${"voice" === o ? "smoky late-night sets" : "the " + o} in the clubs of ${e.city} until a talent scout heard ${t.him} in ${a}.`,
                  `${t.His} record "${ftBook().replace("The ", "")} Blues" sold over ${1e5 * rint(2, 9)} copies, and ${t.he} toured the world with ${t.his} own big band.`,
                ],
                feats: [
                  `${rint(9, 40)} recorded albums`,
                  `Played to a crowd of ${rint(10, 60)},000 people`,
                  "Inducted into a jazz hall of fame",
                ],
                legacy: `${t.His} old ${"voice" === o ? "microphone" : o} hangs on a wall in a museum.`,
              };
            },
          },
          {
            t: "Olympic Champion",
            ico: "1f3c5",
            when: Object.keys(FT_OLYMPICS).map((e) => [FT_OLYMPICS[e], +e, +e]),
            make: (e, t, a, [o]) => {
              const n = any([
                "the 100 meters",
                "the marathon",
                "swimming",
                "fencing",
                "wrestling",
                "gymnastics",
                "rowing",
                "the long jump",
                "cycling",
                "archery",
              ]);
              return {
                hl: `Gold medalist at the ${a} ${o} Olympics`,
                story: [
                  `${e.first} trained every morning before sunrise and was picked for ${ftCountryName(e.country)}'s Olympic team at ${a - e.born}.`,
                  `At the ${a} Games in ${o}, ${t.he} won gold in ${n}${chance(0.5) ? ", setting a world record that stood for " + rint(4, 20) + " years" : " in a stunning upset"}.`,
                ],
                feats: [
                  "Olympic gold medal",
                  `${rint(2, 9)} national titles`,
                  "Carried the flag at the closing ceremony",
                ],
                legacy: "The gold medal is the most treasured thing the family owns.",
              };
            },
          },
          {
            t: "Explorer",
            ico: "1f5fa-fe0f",
            when: [[null, 1870, 1935]],
            make: (e, t, a) => {
              const o = any([
                "the South Pole",
                "the Arctic Circle",
                "the source of the Nile",
                "the heart of the Amazon",
                "the Himalayas",
                "the Gobi Desert",
              ]);
              return {
                hl: `Led a famous expedition to ${o}`,
                story: [
                  `In ${a}, ${e.first} set off with ${rint(6, 30)} companions on a journey to ${o} that most people said would kill them.`,
                  `After ${rint(8, 26)} months, frostbite, starvation and ${any(["a mutiny", "a shipwreck", "a sandstorm", "an avalanche"])}, ${t.he} made it home and became a household name.`,
                ],
                feats: [
                  `A ${any(["glacier", "mountain pass", "river bend", "bay"])} is named after ${t.him}`,
                  "Wrote a bestselling travel diary",
                  "Lectured to royalty",
                ],
                legacy: `${t.His} compass and journals were donated to a national museum.`,
              };
            },
          },
          {
            t: "Notorious Bootlegger",
            ico: "1f943",
            when: [[null, 1920, 1933]],
            make: (e, t, a) => ({
              hl: "Infamous Prohibition-era bootlegger",
              story: [
                `When alcohol was banned, ${e.first} turned a ${any(["bakery", "funeral parlor", "barber shop", "church basement"])} into the busiest speakeasy in town around ${a}.`,
                `${t.He} smuggled whiskey in ${any(["coffins", "milk bottles", "hollowed-out Bibles", "a fake fire truck"])}, was arrested ${rint(3, 11)} times and never convicted once.`,
              ],
              feats: [
                `Ran ${rint(4, 22)} hidden speakeasies`,
                `Earned an estimated ${usd(1e5 * rint(2, 30))}`,
                "Had a secret tunnel under the house",
              ],
              legacy: "The family still argues about whether the hidden money was ever found.",
            }),
          },
          {
            t: "Gold Rush Millionaire",
            ico: "1f4b0",
            when: FT_RUSHES,
            make: (e, t, a, [o, , , n]) => ({
              hl: `Struck it rich in ${o}`,
              story: [
                `${e.first} sold everything ${t.he} owned and headed for ${n} in ${a} with nothing but a shovel and a mule named ${any(["Biscuit", "Duchess", "Moses", "Old Pete", "Clover"])}.`,
                `${t.He} hit a vein of gold worth ${usd(1e6 * rint(1, 9))} in today's money, built a mansion, and lost half of it in a single poker game.`,
              ],
              feats: [
                `Found a ${rint(3, 18)}-pound gold nugget`,
                "Built the first hotel in town",
                "Funded a school and a church",
              ],
              legacy: "One small gold nugget has been handed down to the eldest child ever since.",
            }),
          },
          {
            t: "Bestselling Author",
            ico: "1f4d6",
            when: [[null, 1820, 2005]],
            make: (e, t, a) => {
              const o = ftBook();
              return {
                hl: `Wrote the bestselling novel "${o}"`,
                story: [
                  `${e.first} wrote ${t.his} first novel by candlelight after long days working as ${ftAn(e.job.toLowerCase())}.`,
                  `"${o}" was published in ${a} and sold millions of copies. It has been translated into ${rint(8, 40)} languages and was ${chance(0.6) ? "made into a movie" : "banned in three countries"}.`,
                ],
                feats: [
                  `${rint(4, 22)} published books`,
                  `"${o}" (${a})`,
                  `Won ${any(["a national literary prize", "the Golden Quill award", "a prize for fiction"])}`,
                ],
                legacy: "A signed first edition sits on the family bookshelf.",
              };
            },
          },
          {
            t: "Beloved Mayor",
            ico: "1f3db-fe0f",
            when: [[null, 1850, 2005]],
            make: (e, t, a) => ({
              hl: `Mayor of ${e.city} for ${rint(8, 24)} years`,
              story: [
                `${e.first} was elected mayor of ${e.city} in ${a}, beating the favorite by just ${rint(3, 90)} votes.`,
                `${t.He} built ${any(["the town's first hospital", "a new bridge", "the public library", "the first electric streetlights"])} and was re-elected again and again.`,
              ],
              feats: [
                `Elected ${rint(3, 6)} times`,
                `A street is named ${e.last} Avenue`,
                "Gave a famous speech still quoted today",
              ],
              legacy: `${t.His} portrait still hangs in the town hall.`,
            }),
          },
          {
            t: "Pioneer Aviator",
            ico: "2708-fe0f",
            when: [[null, 1910, 1950]],
            make: (e, t, a) => ({
              hl: "Record-breaking pilot",
              story: [
                `${e.first} saw ${t.his} first airplane at a county fair and learned to fly in a rickety biplane in ${a}.`,
                `${t.He} became the first person to fly nonstop ${any(["across the mountains", "over the ocean at night", "from coast to coast", "across the desert"])}, landing to a crowd of thousands.`,
              ],
              feats: [
                `Set ${rint(2, 7)} flying records`,
                `Logged ${rint(4, 18)},000 hours in the air`,
                "Taught hundreds of pilots to fly",
              ],
              legacy: `${t.His} leather flying cap is still in the family.`,
            }),
          },
          {
            t: "Circus Legend",
            ico: "1f3ad",
            when: [[null, 1850, 1945]],
            make: (e, t, a) => {
              const o = any([
                "trapeze artist",
                "lion tamer",
                "tightrope walker",
                "human cannonball",
                "knife thrower",
              ]);
              return {
                hl: `World-famous ${o}`,
                story: [
                  `${e.first} ran away from home to join a traveling circus at ${a - e.born}.`,
                  `As "The Great ${e.last}," ${t.he} became the most famous ${o} in the world and performed for ${any(["a king", "a queen", "two presidents", "an emperor"])}.`,
                ],
                feats: [
                  `Performed in ${rint(20, 60)} countries`,
                  "Never once used a safety net",
                  `Had ${t.his} own poster in every town`,
                ],
                legacy: "The old circus posters hang in the family hallway.",
              };
            },
          },
          {
            t: "Heroic Doctor",
            ico: "1f489",
            when: [[null, 1850, 2005]],
            make: (e, t, a) => ({
              hl: `Stopped a deadly outbreak in ${e.city}`,
              story: [
                `When ${any(["cholera", "typhoid", "scarlet fever", "yellow fever", "a mystery fever"])} swept through ${e.city} in ${a}, ${e.first} worked ${rint(18, 22)}-hour days for months.`,
                `${t.He} traced the outbreak to ${any(["a poisoned well", "a contaminated river", "a tainted batch of milk"])} and is credited with saving thousands of lives.`,
              ],
              feats: [
                "Saved thousands of lives",
                `Published ${rint(10, 70)} medical papers`,
                "A hospital wing bears the family name",
              ],
              legacy: `Medical students still learn about ${t.his} work.`,
            }),
          },
          {
            t: "Railroad Tycoon",
            ico: "1f3a9",
            when: [[null, 1850, 1915]],
            make: (e, t, a) => ({
              hl: "Built a railroad empire",
              story: [
                `${e.first} started as a ticket clerk and by ${a} owned ${t.his} own railroad line.`,
                `${t.He} laid ${rint(300, 2400)} miles of track, became one of the richest people in ${ftCountryName(e.country)}, and lost it all in a stock market crash.`,
              ],
              feats: [
                `${rint(300, 2400)} miles of track`,
                `Once worth ${usd(1e6 * rint(5, 90))}`,
                "A train station is named after the family",
              ],
              legacy: "If you ever hear the family say 'we were almost rich,' this is why.",
            }),
          },
          {
            t: "Famous Painter",
            ico: "1f3a8",
            when: [[null, 1850, 1990]],
            make: (e, t, a) => ({
              hl: "Celebrated painter",
              story: [
                `${e.first} painted on scraps of wood because ${t.he} couldn't afford canvas. ${t.His} first gallery show in ${a} sold out in an hour.`,
                `One of ${t.his} paintings, "${ftBook()}," sold at auction for ${usd(1e5 * rint(2, 45))} decades later.`,
              ],
              feats: [
                `${rint(200, 900)} paintings`,
                "Shown in national galleries",
                `Painted a portrait of ${any(["a president", "a queen", "a famous poet"])}`,
              ],
              legacy: `There's a small painting of ${t.his} in the family that might be worth a fortune.`,
            }),
          },
          {
            t: "Sea Captain",
            ico: "2693",
            when: [[null, 1700, 1900]],
            make: (e, t, a) => {
              const o = `the ${any(["Northern", "Silver", "Morning", "Brave", "Endless"])} ${any(["Star", "Gull", "Horizon", "Promise", "Tide"])}`;
              return {
                hl: `Legendary captain of ${o}`,
                story: [
                  `${e.first} went to sea as a cabin ${"f" === e.g ? "girl disguised as a boy" : "boy"} and took command of ${o} by ${a}.`,
                  `${t.He} sailed ${ftAn(any(["record-breaking", "storm-wrecked", "famous", "treacherous"]))} route around ${any(["Cape Horn", "the Cape of Good Hope", "the Arctic ice", "the Spice Islands"])} and brought every crew member home alive.`,
                ],
                feats: [
                  `Crossed the ocean ${rint(20, 90)} times`,
                  "Never lost a single sailor",
                  `A harbor light is named after ${t.him}`,
                ],
                legacy: `${t.His} brass spyglass still sits on the family mantelpiece.`,
              };
            },
          },
          {
            t: "Famous Photographer",
            ico: "1f4f7",
            when: [[null, 1850, 2005]],
            make: (e, t, a) => ({
              hl: "Took one of the most famous photographs of the era",
              story: [
                `${e.first} saved for years to buy ${t.his} first camera and started photographing ordinary people in ${e.city}.`,
                `In ${a}, one of ${t.his} photographs ran on newspaper front pages around the world and became the defining image of its time.`,
              ],
              feats: [
                "A photograph in a national museum",
                `${rint(2, 9)},000 negatives in ${t.his} archive`,
                "Exhibitions on three continents",
              ],
              legacy: "A box of original prints is still in the family attic.",
            }),
          },
          {
            t: "Boxing Champion",
            ico: "1f94a",
            when: [[null, 1880, 1995]],
            make: (e, t, a) => ({
              hl: ("f" === e.g ? "Pioneering women's" : "Heavyweight") + " boxing champion",
              story: [
                `${e.first} learned to fight in the back streets of ${e.city} and turned pro at ${a - e.born}.`,
                `${t.He} won the title in ${a} with a knockout people still argue about, and defended it ${rint(3, 12)} times.`,
              ],
              feats: [
                `${rint(30, 70)} wins, ${rint(0, 6)} losses`,
                `${rint(15, 50)} knockouts`,
                "Inducted into a boxing hall of fame",
              ],
              legacy: `${t.His} championship belt hangs in a cousin's living room.`,
            }),
          },
          {
            t: "Rock Star",
            ico: "1f3b8",
            when: [[null, 1955, 2005]],
            make: (e, t, a) => {
              const o = `The ${any(["Electric", "Midnight", "Velvet", "Wild", "Neon"])} ${any(["Foxes", "Riders", "Echoes", "Saints", "Comets"])}`;
              return {
                hl: `Frontman of ${o}`,
                story: [
                  `${e.first} formed ${o} in a garage in ${a} with ${rint(2, 4)} friends from school.`,
                  `Their second album went multi-platinum, and ${t.he} spent a decade touring stadiums around the world.`,
                ],
                feats: [
                  `${rint(5, 40)} million records sold`,
                  "A number-one single",
                  `Played to ${rint(50, 250)},000 people in one night`,
                ],
                legacy: `${t.His} signed guitar is the family's most fought-over heirloom.`,
              };
            },
          },
          {
            t: "Astronaut",
            ico: "1f680",
            when: [[null, 1961, 2020]],
            make: (e, t, a) => ({
              hl: `Flew to space in ${a}`,
              story: [
                `${e.first} was a test pilot and engineer before being picked from thousands of applicants for the astronaut corps.`,
                `In ${a}, ${t.he} launched into orbit and spent ${rint(5, 180)} days in space, seeing ${ftCountryName(e.country)} from ${rint(250, 420)} km up.`,
              ],
              feats: [
                `${rint(1, 4)} space missions`,
                `${rint(1, 6)} spacewalks`,
                `A school is named after ${t.him}`,
              ],
              legacy: "The family has a patch that actually went to space.",
            }),
          },
          {
            t: "Tech Founder",
            ico: "1f4bb",
            when: [[null, 1975, 2020]],
            make: (e, t, a) => {
              const o = `${any(["Nova", "Bright", "Pixel", "Quantum", "Loop"])}${any(["ly", "soft", "labs", "works", "base"])}`;
              return {
                hl: `Founded the tech company ${o}`,
                story: [
                  `${e.first} started ${o} in ${a} from a spare bedroom with a borrowed computer.`,
                  `Within ten years it had millions of users and ${t.he} was on magazine covers as one of the most influential people in tech.`,
                ],
                feats: [
                  `${o} valued at ${usd(1e8 * rint(2, 90))}`,
                  `${rint(5, 60)},000 employees`,
                  "Gave a famous keynote speech",
                ],
                legacy: `${t.His} first prototype sits in a glass case at the family home.`,
              };
            },
          },
          {
            t: "Civil Rights Leader",
            ico: "270a",
            when: [[null, 1890, 1995]],
            make: (e, t, a) => ({
              hl: "Led a movement for equal rights",
              story: [
                `${e.first} organized ${t.his} first protest in ${e.city} in ${a} after seeing injustice up close.`,
                `${t.He} was arrested ${rint(2, 14)} times, gave speeches to crowds of thousands, and helped change the law.`,
              ],
              feats: [
                "Helped pass a landmark law",
                `Led a march of ${rint(10, 250)},000 people`,
                "Received a national honor",
              ],
              legacy: `A mural of ${t.him} covers a wall in ${e.city}.`,
            }),
          },
          {
            t: "Wartime Codebreaker",
            ico: "1f575-fe0f",
            when: [[null, 1939, 1945]],
            make: (e, t, a) => ({
              hl: "Secret codebreaker in World War II",
              story: [
                `In ${a}, ${e.first} was quietly recruited to a top-secret codebreaking unit because of ${t.his} gift for puzzles.`,
                `${t.He} helped crack enemy messages that saved countless lives, and wasn't allowed to tell anyone about it for 30 years.`,
              ],
              feats: [
                'Broke an "unbreakable" enemy code',
                "Sworn to secrecy for decades",
                "Honoured once the files were declassified",
              ],
              legacy: `The family only found out when ${t.his} medal arrived in the mail.`,
            }),
          },
          {
            t: "Chess Grandmaster",
            ico: "265f-fe0f",
            when: [[null, 1850, 2015]],
            make: (e, t, a) => ({
              hl: "Chess champion of the country",
              story: [
                `${e.first} learned chess from a neighbor at ${rint(5, 9)} and was beating adults by ${rint(10, 13)}.`,
                `In ${a}, ${t.he} won the national championship and went on to play ${any(["the world champion", "a famous exhibition match", "twenty opponents blindfolded at once"])}.`,
              ],
              feats: [
                "National champion",
                `A chess opening named after ${t.him}`,
                "Wrote a classic chess book",
              ],
              legacy: `${t.His} old chess set is still used at family gatherings.`,
            }),
          },
          {
            t: "Celebrity Chef",
            ico: "1f373",
            when: [[null, 1890, 2020]],
            make: (e, t, a) => ({
              hl: "Famous chef and restaurant owner",
              story: [
                `${e.first} cooked for the family from the age of ${rint(8, 12)} and opened ${t.his} first restaurant in ${e.city} in ${a}.`,
                `${t.His} signature dish became a national favorite, and ${t.his} cookbook was in every kitchen.`,
              ],
              feats: [
                `${rint(2, 12)} restaurants`,
                "A best-selling cookbook",
                `A dish still known by ${t.his} name`,
              ],
              legacy: "The secret family recipe is only passed to the eldest child.",
            }),
          },
          {
            t: "Fashion Designer",
            ico: "1f457",
            when: [[null, 1900, 2020]],
            make: (e, t, a) => ({
              hl: "Designer whose style swept the world",
              story: [
                `${e.first} started sewing clothes for neighbors and opened a small studio in ${a}.`,
                `${t.His} designs were soon worn by film stars and royalty, and ${t.his} label became world-famous.`,
              ],
              feats: [
                "Dressed film stars and royalty",
                "A signature look named after the label",
                `Shows in ${rint(3, 9)} fashion capitals`,
              ],
              legacy: `One original dress from ${t.his} first collection hangs in the family wardrobe.`,
            }),
          },
          {
            t: "Voting Rights Campaigner",
            ico: "1f4e2",
            when: [[null, 1880, 1930]],
            make: (e, t, a) => ({
              hl: "Campaigned for women's right to vote",
              story: [
                `${e.first} ${"f" === e.g ? "chained herself to railings" : "marched alongside his sisters"} in ${a} demanding votes for women.`,
                `${t.He} gave speeches in town squares across ${ftCountryName(e.country)} and lived to see women vote for the first time.`,
              ],
              feats: [
                `Arrested ${rint(1, 9)} times for protesting`,
                "Spoke to crowds across the country",
                "Saw the vote won in their lifetime",
              ],
              legacy: `${t.His} protest sash is framed in the family hallway.`,
            }),
          },
        ];
      function ftFame(e) {
        const t = ftPron(e);
        (e.city ??= COUNTRIES[e.country] ? COUNTRIES[e.country][1] : "their hometown"),
          (e.job ??= ftJob(e.born, 40));
        const a = e.born + Math.min(e.life || 99, 60),
          o = [];
        for (const t of FT_FAMES)
          for (const n of t.when) {
            const s = Math.max(n[1], e.born + 18),
              r = Math.min(n[2], a - 1);
            s <= r && o.push([t, n, rint(s, r)]);
          }
        if (!o.length) return null;
        const [n, s, r] = any(o);
        return { t: n.t, ico: n.ico, year: r, stars: rint(3, 5), ...n.make(e, t, r, s) };
      }
      const FT_MEDALS = [
          ["the Victoria Cross", 1856],
          ["the Medal of Honor", 1862],
          ["the Military Cross", 1914],
          ["the Croix de Guerre", 1915],
          ["the Distinguished Service Cross", 1918],
          ["the Silver Star", 1932],
          ["the Bronze Star", 1944],
        ],
        ftMedal = (e) =>
          e < 1856
            ? any(["a ceremonial sword from the commanding general", "a gold medal for gallantry"])
            : any(FT_MEDALS.filter((t) => t[1] <= e))[0];
      function ftServe(e) {
        if (!e || e === state || e.cave || e.milRolled) return e && e.mil;
        e.milRolled = !0;
        const t = "m" === (e.g || e.gender),
          [a, o] = ftYears(e);
        if (o - a < 18) return null;
        const n = FT_WARS.filter(([, e, t]) => a + 17 <= t && a + 40 >= e && o > e),
          s = n.length ? any(n) : null;
        if (!chance(t ? (s ? (/World War/.test(s[0]) ? 0.65 : 0.4) : 0.12) : s && s[1] >= 1939 ? 0.06 : 0))
          return null;
        const r = s
            ? rint(Math.max(s[1], a + 17), Math.max(Math.max(s[1], a + 17), Math.min(s[2], a + 40, o - 1)))
            : rint(a + 18, Math.max(a + 18, Math.min(a + 30, o - 1))),
          i = (e.mil = {
            war: s ? s[0] : null,
            y: r,
            years: s ? Math.max(1, Math.min(s[2], o) - r + 1) : rint(2, 6),
            scar: null,
            hero: null,
            branch: any(
              t
                ? r < 1900
                  ? ["Army", "Army", "Navy", "Cavalry"]
                  : r < 1918
                    ? ["Army", "Army", "Navy", "Marines"]
                    : ["Army", "Army", "Navy", "Marines", "Air Force"]
                : ["Army Nurse Corps", "Navy"],
            ),
            rank: any(
              t
                ? ["Private", "Private", "Corporal", "Sergeant", "Sergeant", "Lieutenant", "Captain"]
                : ["Nurse", "Nurse", "Lieutenant"],
            ),
          });
        if (
          (t &&
            chance(s ? 0.35 : 0.08) &&
            (i.scar = ACCESSORIES.scar[rint(0, ACCESSORIES.scar.length - 1)].id),
          s && chance(0.1) && ((i.hero = ftMedal(r)), !e.famous && chance(0.3)))
        ) {
          const o = FT_FAMES.find((e) => "War Hero" === e.t),
            n = e.city || (COUNTRIES[e.country || state.country] || [])[1] || "their hometown",
            l = {
              first: e.first,
              last: e.last || SURNAME,
              born: a,
              g: t ? "m" : "f",
              city: n,
              medal: i.hero,
            };
          e.famous = {
            t: o.t,
            ico: o.ico,
            year: r,
            stars: rint(3, 5),
            milHero: !0,
            ...o.make(l, ftPron(l), r, s),
          };
        }
        return e.look && i.scar && (e.look.milScar = i.scar), i;
      }
      function ftServeNow(e) {
        if (null != state.ftMilNow) return;
        const t = ftNow(),
          a = [...e.cousins, ...e.aus, ...e.sibs, e.dad, e.mom].filter((e) => {
            if (!e || e.dead || e.mil) return !1;
            const a = t - ftYears(e)[0];
            return a >= 18 && a <= 55;
          });
        if (!a.length) return;
        if (((state.ftMilNow = !1), !chance(0.3))) return;
        const o = (e) => ("m" === (e.g || e.gender) ? 5 : 1);
        let n = Math.random() * a.reduce((e, t) => e + o(t), 0),
          s = a[0];
        for (const e of a)
          if ((n -= o(e)) < 0) {
            s = e;
            break;
          }
        const r = ftYears(s)[0],
          i = rint(r + 18, Math.max(r + 18, Math.min(t, r + 26)));
        (s.milRolled = !0),
          (state.ftMilNow = !0),
          (s.mil = {
            war: null,
            active: !0,
            y: i,
            years: t - i + 1,
            scar: chance(0.05) ? ACCESSORIES.scar[rint(0, ACCESSORIES.scar.length - 1)].id : null,
            hero: null,
            branch: any(["Army", "Army", "Navy", "Marines", "Air Force"]),
            rank:
              t - i >= 8
                ? any(["Sergeant", "Staff Sergeant", "Captain"])
                : t - i >= 3
                  ? any(["Corporal", "Sergeant", "Lieutenant"])
                  : "Private",
          }),
          s.look && ((s.look.milHat = !0), s.mil.scar && (s.look.milScar = s.mil.scar));
      }
      function ftMilLine(e, t) {
        const a = e.src.mil;
        if (!a) return "";
        const o = `as ${ftAn(a.rank.toLowerCase())} in the ${a.branch}`;
        return a.active
          ? ` ${t.He} is serving ${o} right now, on active duty since ${a.y}${a.scar ? ", and already has a scar from training" : ""}.`
          : " " +
              (a.war
                ? `${t.He} served in ${a.war} ${o}`
                : `${t.He} served ${a.years} years ${o} in peacetime`) +
              `${a.hero ? ` and came home a hero, awarded ${a.hero}` : ""}${a.scar ? `${a.hero ? ", with" : ", coming home with"} a scar ${t.he} carried for the rest of ${t.his} life` : ""}.`;
      }
      const ftPron = (e) =>
          "f" === e.g
            ? { he: "she", He: "She", his: "her", His: "Her", him: "her" }
            : { he: "he", He: "He", his: "his", His: "His", him: "him" },
        FT_JOBS = [
          [
            0,
            [
              "Blacksmith",
              "Farmer",
              "Cobbler",
              "Seamstress",
              "Coal Miner",
              "Sailor",
              "Schoolteacher",
              "Shopkeeper",
              "Carpenter",
              "Railroad Worker",
              "Midwife",
              "Baker",
              "Telegraph Operator",
              "Lamplighter",
              "Stable Hand",
            ],
          ],
          [
            1890,
            [
              "Factory Worker",
              "Seamstress",
              "Mechanic",
              "Switchboard Operator",
              "Farmer",
              "Steelworker",
              "Nurse",
              "Postman",
              "Milkman",
              "Typist",
              "Dock Worker",
              "Barber",
              "Bus Conductor",
            ],
          ],
          [
            1935,
            [
              "Accountant",
              "Nurse",
              "Electrician",
              "Teacher",
              "Truck Driver",
              "Secretary",
              "Engineer",
              "Salesman",
              "Police Officer",
              "Homemaker",
              "Mechanic",
              "Pharmacist",
              "Plumber",
            ],
          ],
          [
            1965,
            [
              "Software Engineer",
              "Graphic Designer",
              "Real Estate Agent",
              "Teacher",
              "Nurse",
              "Accountant",
              "Chef",
              "Marketing Manager",
              "Paramedic",
              "Lawyer",
              "Dentist",
              "Electrician",
              "Barista",
            ],
          ],
        ],
        ftJob = (e, t) =>
          t < 5
            ? "None"
            : t < 18
              ? "Student"
              : (t >= 67 ? "Retired " : "") + any(FT_JOBS.filter(([t]) => e + 20 >= t).pop()[1]),
        FT_OLD_CAUSES = [
          "tuberculosis",
          "cholera",
          "the Spanish flu",
          "pneumonia",
          "a mining accident",
          "scarlet fever",
          "heart failure",
          "a stroke",
          "a fall from a horse",
          "typhoid",
          "a fever",
          "a carriage accident",
          "consumption",
        ],
        FT_TRAITS = [
          "Stubborn",
          "Kind-hearted",
          "Hot-tempered",
          "Generous",
          "Mischievous",
          "Devout",
          "Adventurous",
          "Thrifty",
          "Charming",
          "Quiet",
          "Hard-working",
          "Witty",
          "Grumpy",
          "Loyal",
          "Superstitious",
          "Romantic",
          "Proud",
          "Funny",
          "Brave",
          "Gossipy",
        ],
        FT_FACTS = [
          (e) => "Could recite the family recipe book from memory",
          (e) =>
            `Won first prize for ${any(["apple pie", "a giant pumpkin", "a prize pig", "quilting"])} at the county fair`,
          (e) => `Spoke ${rint(2, 5)} languages`,
          (e) => `Kept a diary every single day for ${rint(8, 50)} years`,
          (e) => "Never learned how to swim",
          (e) => `Had a dog named ${any(["Rex", "Biscuit", "Duke", "Pepper", "Max", "Lady"])}`,
          (e) => "Was left-handed",
          (e) => "Survived a shipwreck",
          (e) => "Lost a small fortune at the racetrack",
          (e) => "Built the family home by hand",
          (e) => "Was famous for a booming laugh",
          (e) => "Hid money in the walls of the house",
          (e) => "Met their spouse at a dance hall",
          (e) => "Was a champion at checkers",
          (e) => "Once shook hands with a president",
          (e) => `Owned ${rint(9, 40)} cats over the years`,
          (e) => "Never once missed church on Sunday",
          (e) => "Sang in the town choir",
        ],
        MONTHS = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        FT_CAVE_FACTS = [
          "Left a red ochre handprint on the cave wall that may still be there",
          "Once scared off a cave bear with a burning torch",
          "Could start a fire with flint and pyrite in under a minute",
          "Knew which mushrooms were safe to eat (and which were not)",
          "Carved a tiny mammoth out of bone",
          "Survived the coldest winter anyone in the clan could remember",
          "Wore a necklace of cave lion teeth",
          "Could track a reindeer herd from a single hoofprint",
          "Played a flute made from a vulture bone",
          "Helped paint the horses on the cave wall",
        ];
      function ftInfo(e) {
        const t = e.src,
          a = e.born < 1945;
        if (t.ftInfo) return t.ftInfo;
        const o = [];
        for (; o.length < 3; ) {
          const e = any(FT_TRAITS);
          o.includes(e) || o.push(e);
        }
        if (t.cave)
          return (t.ftInfo = {
            city: `a limestone cave in ${t.where}`,
            traits: o,
            cause: t.cause,
            kids: t.kidsCount || 0,
            fact:
              e.age < 3
                ? any([
                    "Was carried everywhere in a reindeer-hide sling",
                    "Had a tiny shell-bead necklace made for them by the clan",
                    "Was named after the river the clan camped beside",
                    "Was sung to sleep by the whole clan around the fire",
                  ])
                : e.age < 14
                  ? any([
                      "Collected shiny river stones",
                      "Loved watching the elders paint animals on the cave wall",
                      "Had a pet wolf pup that followed them everywhere",
                      "Learned to throw a spear before age 6",
                      "Was the fastest runner of all the clan kids",
                    ])
                  : any(FT_CAVE_FACTS),
            height:
              e.age < 14
                ? `${rint(52 + 7 * e.age, 60 + 7 * e.age)} cm`
                : `${"f" === e.g ? rint(148, 166) : rint(158, 180)} cm`,
            job:
              e.age < 5
                ? "None"
                : e.age < 14
                  ? "Berry gatherer (child)"
                  : e.age >= 40
                    ? "Clan elder & storyteller"
                    : any([
                        "Mammoth hunter",
                        "Spear maker",
                        "Flint knapper",
                        "Tracker",
                        "Fire keeper",
                        "Fisher",
                        "Cave painter",
                        "Shaman",
                        "Gatherer",
                        "Herbal healer",
                        "Hide scraper",
                      ]),
          });
        const n = t.city || (COUNTRIES[e.country] || [, "a small town"])[1];
        if (
          ((t.ftInfo = {
            month: any(MONTHS),
            day: rint(1, 28),
            city:
              t.city || chance(0.55)
                ? n
                : `a ${any(["small village", "farm town", "fishing town", "mining town", "river town"])} outside ${n}`,
            job: e.you ? (state.job ? state.job.t : ftJob(e.born, e.age)) : t.job || ftJob(e.born, e.age),
            traits: o,
            height: `${"f" === e.g ? rint(150, 175) : rint(162, 192)} cm`,
            kids: null != e.kids ? e.kids : e.age < 20 ? 0 : rint(e.anc ? 1 : 0, a ? 9 : 4),
            cause:
              e.age >= 75 && chance(0.6) ? "old age" : e.died < 1950 ? any(FT_OLD_CAUSES) : any(DEATH_CAUSES),
            fact: any(FT_FACTS)(e),
          }),
          t.pack &&
            Object.assign(t.ftInfo, {
              cause: t.pack[13],
              fact: `The family still keeps ${t.pack[12]} that belonged to ${"f" === e.g ? "her" : "him"}.`,
            }),
          t.past)
        ) {
          const e = t.past;
          Object.assign(t.ftInfo, {
            city: e.city || t.ftInfo.city,
            job: e.job || t.ftInfo.job,
            kids: e.kids ?? t.ftInfo.kids,
            ...(e.cause ? { cause: e.cause } : {}),
          });
        }
        return t.ftInfo;
      }
      const FT_ANY = -6e4,
        ftC = (e, t, a, o, n, s, r, i, l, c, d, u, h, p = {}) => ({
          id: e,
          grp: t,
          name: a,
          col: o,
          h: n,
          pass: Math.min(0.85, (n / 100) * 0.95),
          base: s,
          onset: r,
          from: i,
          spr: l,
          old: c,
          treat: d,
          desc: u,
          life: h,
          ...p,
        }),
        FT_CONDS = [
          ftC(
            "depression",
            "mind",
            "Depression",
            "#7f8c9b",
            35,
            0.09,
            13,
            -6e4,
            "darkface",
            "melancholia",
            ["therapy", "antidepressants", "exercise", "selfcare"],
            "Long stretches of low mood, low energy and losing interest in things.",
            [
              "went through long, grey winters where getting out of bed was hard",
              "found that long walks and close friends helped on the hard days",
              "kept it hidden from almost everyone",
              "had good years and bad years, but never let it define them",
            ],
          ),
          ftC(
            "dysthymia",
            "mind",
            "Persistent Low Mood",
            "#c9a227",
            32,
            0.05,
            15,
            -6e4,
            "sad",
            "a gloomy temperament",
            ["therapy", "journal"],
            "A milder low mood that lasts for years: never quite happy, rarely in crisis.",
            [
              "always seemed a little sad, even on good days",
              "was known for a dry, gloomy sense of humor",
              'said they had "never been a happy person"',
            ],
          ),
          ftC(
            "sad",
            "mind",
            "Seasonal Depression",
            "#4f7fc4",
            29,
            0.05,
            15,
            -6e4,
            "rain",
            "the winter blues",
            ["sunlight", "therapy"],
            "Depression that comes back every dark winter and lifts in the spring.",
            [
              "dreaded the first frost every single year",
              "came alive every spring and went quiet every winter",
              "spent winters close to the fire, barely speaking",
            ],
          ),
          ftC(
            "bipolar",
            "mind",
            "Bipolar Disorder",
            "#e53935",
            70,
            0.03,
            18,
            -6e4,
            "angry",
            "manic depression",
            ["psychiatrist", "meds", "sleep"],
            "Swings between manic highs (huge energy, little sleep, big risks, quick temper) and deep depressive lows.",
            [
              "once gave away a whole season's food stores in a single wild week",
              "had bursts of brilliant, sleepless creativity followed by crashes",
              "was the life of every gathering, until the lows came",
              "learned to spot the warning signs before a high",
            ],
          ),
          ftC(
            "cyclothymia",
            "mind",
            "Mood Swings",
            "#8e6cd8",
            50,
            0.04,
            15,
            -6e4,
            "halfface",
            "a changeable temper",
            ["therapy", "meditation"],
            "Milder ups and downs that come and go: bright and sunny one week, dark and flat the next.",
            [
              "was sunshine one week and a storm cloud the next",
              "kept the family guessing which mood they would wake up in",
              "was wonderful company on good days",
            ],
          ),
          ftC(
            "anxiety",
            "mind",
            "Anxiety",
            "#ffb300",
            30,
            0.09,
            8,
            -6e4,
            "worried",
            "a case of nerves",
            ["therapy", "meditation", "pills"],
            "Constant worry, a racing heart and restlessness that is hard to switch off.",
            [
              "was always first to spot danger, and could never stop watching for it",
              "worried about everyone in the family, constantly",
              "was calm on the outside and racing on the inside",
            ],
          ),
          ftC(
            "panic",
            "mind",
            "Panic Disorder",
            "#ff7043",
            43,
            0.04,
            15,
            -6e4,
            "panic",
            "fits of terror",
            ["therapy", "yoga"],
            "Sudden attacks of overwhelming fear: pounding heart, shaking, sure something terrible is happening.",
            [
              "had panic attacks before big moments",
              "once fled a crowded market in sheer terror",
              "learned to breathe through the attacks",
            ],
          ),
          ftC(
            "social",
            "mind",
            "Social Anxiety",
            "#f2c14e",
            40,
            0.05,
            11,
            -6e4,
            "disappointed",
            "painful shyness",
            ["therapy", "journal"],
            "Intense fear of being judged, embarrassed or watched by other people.",
            [
              "hid at the back of every gathering",
              "rehearsed every conversation in their head first",
              "had a few very close friends and avoided everyone else",
            ],
          ),
          ftC(
            "bpd",
            "mind",
            "Borderline Personality",
            "#3fa7e0",
            46,
            0.02,
            16,
            -6e4,
            "crying",
            "a stormy nature",
            ["therapy", "psychiatrist"],
            "Very intense, fast-changing emotions, fear of being abandoned and stormy relationships.",
            [
              "loved fiercely and fought just as fiercely",
              "felt everything ten times harder than everyone else",
              "found real calm later in life",
            ],
          ),
          ftC(
            "anger",
            "mind",
            "Anger Issues",
            "#ff5722",
            44,
            0.04,
            12,
            -6e4,
            "firehead",
            "a hot temper",
            ["therapy", "exercise"],
            "Explosive outbursts of rage that are way out of proportion to what set them off.",
            [
              "was famous for a temper that could clear a room",
              "once punched a hole in the wall and regretted it for years",
              "worked the anger off by chopping wood",
            ],
          ),
          ftC(
            "adhd",
            "mind",
            "ADHD",
            "#2ecc71",
            75,
            0.06,
            5,
            -6e4,
            "storm",
            "restlessness",
            ["pills", "exercise"],
            "Trouble focusing and sitting still, impulsive, and full of energy and ideas.",
            [
              "started a hundred projects and finished a few brilliant ones",
              "could never sit still for long",
              "could focus on one thing they loved for days on end",
            ],
          ),
          ftC(
            "ocd",
            "mind",
            "OCD",
            "#e2453c",
            45,
            0.03,
            10,
            -6e4,
            "cycle",
            "scrupulosity",
            ["therapy", "antidepressants"],
            "Unwanted, intrusive thoughts and repeated rituals (checking, counting, cleaning) to quiet them.",
            [
              "checked the same things over and over every night",
              "kept everything they owned in perfect order",
              "counted steps everywhere they walked",
            ],
          ),
          ftC(
            "schizophrenia",
            "mind",
            "Schizophrenia",
            "#9e9e9e",
            79,
            0.012,
            18,
            -6e4,
            "swirl",
            "dementia praecox",
            ["hospital", "meds", "psychcare"],
            "Can cause hallucinations, hearing voices and confused thinking, usually starting in early adulthood.",
            [
              "heard voices that nobody else could hear",
              "was misunderstood by the people around them",
              "had long stretches of being well between episodes",
            ],
          ),
          ftC(
            "dissociation",
            "mind",
            "Dissociation",
            "#c49a6c",
            48,
            0.03,
            14,
            -6e4,
            "blankhead",
            "spells of absence",
            ["therapy", "yoga"],
            "Feeling detached from yourself or the world, like watching your life from outside, with gaps in memory.",
            [
              "would go blank and stare into the distance",
              "lost whole afternoons with no memory of them",
              "said life sometimes felt like a dream",
            ],
          ),
          ftC(
            "insomnia",
            "mind",
            "Insomnia",
            "#78909c",
            38,
            0.08,
            14,
            -6e4,
            "sleepy",
            "sleeplessness",
            ["sleep", "meditation", "rest"],
            "Trouble falling or staying asleep, night after night.",
            [
              "lay awake most nights watching the fire (or the ceiling)",
              "was always the one keeping watch at night",
              "got by on three or four hours of sleep for years",
            ],
            { gray: 1 },
          ),
          ftC(
            "migraine",
            "mind",
            "Migraines",
            "#7cb342",
            42,
            0.07,
            12,
            -6e4,
            "sick",
            "sick headaches",
            ["meds", "rest"],
            "Crushing headaches with nausea, dizziness and sensitivity to light that can last for days.",
            [
              "spent whole days lying in the dark",
              "could feel a storm coming in their head",
              "kept a cold cloth by the bed for the bad days",
            ],
          ),
          ftC(
            "ptsd",
            "mind",
            "PTSD",
            "#e53950",
            35,
            0.04,
            10,
            -6e4,
            "heartbreak",
            "shell shock",
            ["therapy", "journal"],
            "Flashbacks, nightmares and being constantly on edge after a terrifying event. Genes affect how strongly someone reacts to trauma.",
            [
              "never spoke about what they had seen",
              "jumped at every sudden noise for the rest of their life",
              "had nightmares for decades after",
            ],
          ),
          ftC(
            "eating",
            "mind",
            "Eating Disorder",
            "#9e9e9e",
            56,
            0.02,
            13,
            1700,
            "plate",
            "a wasting illness",
            ["therapy", "meals"],
            "An unhealthy relationship with food and body image, such as anorexia or bulimia.",
            [
              "hid how little they were eating from everyone",
              "spent years recovering, with the family by their side",
            ],
          ),
          ftC(
            "paranoidpd",
            "mind",
            "Paranoid Personality Disorder",
            "#e0a526",
            28,
            0.03,
            18,
            1921,
            null,
            "a suspicious nature",
            ["therapy", "psychiatrist"],
            "Deep, constant distrust and suspicion of other people, reading hidden threats into innocent things.",
            [
              "was sure the neighbors were plotting against them",
              "trusted almost nobody outside the family",
              'kept every letter and receipt "just in case"',
            ],
            { img: "ft/pd-paranoid.png" },
          ),
          ftC(
            "schizoidpd",
            "mind",
            "Schizoid Personality Disorder",
            "#b0a080",
            29,
            0.03,
            18,
            1908,
            null,
            "a solitary nature",
            ["therapy"],
            "Detached from relationships and happiest alone, with little interest in closeness or other people's praise.",
            [
              "lived alone and liked it that way",
              "was polite but distant with everyone",
              "spent decades on quiet hobbies nobody else understood",
            ],
            { img: "ft/pd-schizoid.png" },
          ),
          ftC(
            "schizotypalpd",
            "mind",
            "Schizotypal Personality Disorder",
            "#9c6ade",
            61,
            0.03,
            18,
            1980,
            null,
            "an odd manner",
            ["therapy", "psychiatrist"],
            "Odd beliefs and magical thinking, unusual perceptions and great discomfort with close relationships.",
            [
              "believed they could read omens in everyday things",
              "dressed and spoke in their own unusual way",
              "had a few close relatives and no friends",
            ],
            { img: "ft/pd-schizotypal.png" },
          ),
          ftC(
            "antisocialpd",
            "mind",
            "Antisocial Personality Disorder",
            "#8d8f93",
            50,
            0.03,
            18,
            1941,
            null,
            "a callous streak",
            ["therapy", "psychiatrist"],
            "Disregard for other people's rights and feelings: lying, recklessness, aggression and little remorse.",
            [
              "was in and out of trouble with the law",
              "charmed people and then used them",
              "never seemed sorry for anything",
            ],
            { img: "ft/pd-antisocial.png" },
          ),
          ftC(
            "histrionicpd",
            "mind",
            "Histrionic Personality Disorder",
            "#ef5f8f",
            63,
            0.018,
            18,
            1968,
            null,
            "a dramatic temperament",
            ["therapy"],
            "Always needing to be the center of attention, with big, fast-changing emotions and dramatic behavior.",
            [
              "turned every family dinner into a performance",
              "cried, laughed and raged all in one afternoon",
              "was impossible to ignore",
            ],
            { img: "ft/pd-histrionic.png" },
          ),
          ftC(
            "narcissisticpd",
            "mind",
            "Narcissistic Personality Disorder",
            "#f2b705",
            77,
            0.03,
            18,
            1968,
            null,
            "great vanity",
            ["therapy"],
            "A grand sense of self-importance, a hunger for admiration and little empathy for others.",
            [
              "talked about their own achievements at every chance",
              "could not stand being criticized",
              "expected everyone to treat them as special",
            ],
            { img: "ft/pd-narcissistic.png" },
          ),
          ftC(
            "avoidantpd",
            "mind",
            "Avoidant Personality Disorder",
            "#4f8fd6",
            28,
            0.025,
            18,
            1969,
            null,
            "crippling shyness",
            ["therapy", "journal"],
            "Extreme shyness and fear of rejection, avoiding people and new things despite wanting connection.",
            [
              "turned down every invitation, then regretted it",
              "stayed in the same safe job for forty years",
              "was terrified of being laughed at",
            ],
            { img: "ft/pd-avoidant.png" },
          ),
          ftC(
            "dependentpd",
            "mind",
            "Dependent Personality Disorder",
            "#d99a5b",
            57,
            0.01,
            18,
            1952,
            null,
            "a clinging nature",
            ["therapy"],
            "A strong need to be taken care of: clinging, struggling to make decisions alone and fearing separation.",
            [
              "never made a big decision without asking someone first",
              "moved from their parents' home straight into a spouse's",
              "fell apart whenever they were left alone",
            ],
            { img: "ft/pd-dependent.png" },
          ),
          ftC(
            "addiction",
            "add",
            "Alcohol Addiction",
            "#d9853b",
            55,
            0.07,
            16,
            -8e3,
            "beer",
            "a weakness for drink",
            ["therapy", "relapse", "recovery"],
            "A tendency toward depending on alcohol that runs strongly in families.",
            [
              "struggled with drinking for years",
              "got sober and stayed that way",
              "lost a job (and nearly a marriage) to the bottle",
              "never touched a drop after seeing what it did to a parent",
            ],
            {
              form: (e, t) => {
                const a =
                  e < 1650
                    ? [
                        ["ale", "beer"],
                        ["wine", "bottle"],
                      ]
                    : e < 1800
                      ? [
                          ["rum", "rum"],
                          ["gin", "bottle"],
                          ["wine", "bottle"],
                        ]
                      : e < 1920
                        ? [
                            ["whiskey", "whiskey"],
                            ["wine", "wine"],
                          ]
                        : e < 1990
                          ? [
                              ["beer", "beer"],
                              ["vodka", "vodka"],
                              ["whiskey", "whiskey"],
                            ]
                          : [
                              ["beer", "beer"],
                              ["wine", "wine"],
                              ["champagne", "champagne"],
                              ["vodka", "vodka"],
                            ];
                return a[Math.floor(t * a.length)];
              },
            },
          ),
          ftC(
            "nicotine",
            "add",
            "Smoking Addiction",
            "#a1887f",
            50,
            0.08,
            14,
            1600,
            "cigarette",
            "a tobacco habit",
            ["relapse", "recovery"],
            "Getting hooked on tobacco and finding it very hard to quit.",
            [
              "smoked from their teens until the day they died",
              "quit cold turkey after many tries",
              "was never seen without one",
            ],
            {
              form: (e) =>
                e < 1720
                  ? ["pipe tobacco", "pipe"]
                  : e < 1830
                    ? ["snuff and pipe tobacco", "pipe"]
                    : e < 1900
                      ? ["chewing tobacco and cigars", "cigar"]
                      : ["cigarettes", "cigarette"],
            },
          ),
          ftC(
            "vaping",
            "add",
            "Vaping Addiction",
            "#607d8b",
            50,
            0.07,
            13,
            2007,
            "vape",
            "vaping",
            ["relapse", "recovery"],
            "Hooked on nicotine vapes: hitting it all day and feeling anxious without it.",
            [
              "was never without a vape in their hand",
              "hid vapes all over the house",
              "quit after it wrecked their lungs",
            ],
          ),
          ftC(
            "cannabis",
            "add",
            "Weed Addiction",
            "#43a047",
            55,
            0.05,
            15,
            -3e3,
            "leaf",
            "a hashish habit",
            ["therapy", "recovery"],
            "Becoming dependent on weed, using more and more just to feel normal.",
            [
              "lost a few years to it in their twenties",
              "quit when their first child was born",
              "smoked every single day for years",
            ],
            { form: (e) => (e < 1900 ? ["hashish", "leaf"] : ["weed", "joint"]) },
          ),
          ftC(
            "cocaine",
            "add",
            "Cocaine Addiction",
            "#b0bec5",
            60,
            0.015,
            17,
            1860,
            "cocaine",
            "a cocaine habit",
            ["therapy", "relapse", "recovery"],
            "Dependence on cocaine, one of the most heritable drug addictions.",
            [
              "burned through a fortune on it",
              "got clean after a scare",
              "hid it behind a busy, successful life",
            ],
            { form: (e) => (e < 1914 ? ['"cocaine tonic" medicine', "cocaine"] : ["cocaine", "cocaine"]) },
          ),
          ftC(
            "meth",
            "add",
            "Meth Addiction",
            "#4fc3f7",
            55,
            0.012,
            16,
            1940,
            "meth",
            "speed",
            ["hospital", "relapse", "recovery"],
            "Dependence on methamphetamine, which hits hard and fast.",
            [
              "lost everything to it and slowly rebuilt",
              "went days without sleeping",
              "got clean in a rehab program",
            ],
            {
              form: (e) =>
                e < 1970
                  ? ['"pep pill" amphetamines', "pillRed"]
                  : e < 1985
                    ? ["speed", "meth"]
                    : ["crystal meth", "meth"],
            },
          ),
          ftC(
            "opioid",
            "add",
            "Opioid Addiction",
            "#7e57c2",
            40,
            0.02,
            17,
            1800,
            "prescription",
            "opium eating",
            ["hospital", "relapse", "recovery"],
            "Dependence on opioids, from Victorian laudanum to heroin to modern painkillers.",
            [
              "started after a doctor prescribed it for an injury",
              "fought it for years and finally got clean",
              "kept it a family secret",
            ],
            {
              form: (e) =>
                e < 1898
                  ? ["laudanum (opium)", "prescription"]
                  : e < 1990
                    ? ["heroin", "syringe"]
                    : ["painkillers", "pillBlue"],
            },
          ),
          ftC(
            "pills",
            "add",
            "Prescription Pill Addiction",
            "#ef5350",
            40,
            0.025,
            17,
            1955,
            "pillRed",
            "a pill habit",
            ["psychiatrist", "recovery"],
            "Getting hooked on prescription pills like sleeping pills, tranquilizers or stimulants.",
            [
              "needed pills to sleep and pills to wake up",
              "doctor-shopped for more prescriptions",
              "tapered off slowly with a doctor's help",
            ],
          ),
          ftC(
            "shrooms",
            "add",
            "Magic Mushroom Habit",
            "#d84315",
            39,
            0.02,
            16,
            -1e4,
            "mushroom",
            "the sacred mushroom",
            ["therapy"],
            "Repeatedly chasing hallucinogenic mushroom trips. Ancient people used them in rituals too.",
            [
              "saw visions they talked about for the rest of their life",
              'was the clan\'s go-to for "spirit journeys"',
              "had one trip too many and stopped for good",
            ],
          ),
          ftC(
            "lsd",
            "add",
            "LSD Habit",
            "#ab47bc",
            39,
            0.012,
            16,
            1950,
            "lsd",
            "acid",
            ["therapy"],
            "Repeatedly taking LSD, a powerful hallucinogen that took off in the 1960s.",
            [
              'spent the late sixties "finding themselves"',
              "still talked about the trips decades later",
              "had a bad trip and never touched it again",
            ],
          ),
          ftC(
            "gambling",
            "add",
            "Gambling Addiction",
            "#ffca28",
            49,
            0.025,
            18,
            -3e3,
            "dizzy",
            "a gaming fever",
            ["therapy", "relapse", "recovery"],
            "Not being able to stop betting, even when it costs everything.",
            [
              "lost the family farm on a single bet",
              "won big once and spent years chasing that feeling",
              "always had one more bet in them",
            ],
            {
              form: (e) =>
                e < 1900
                  ? ["dice and cards", "dizzy"]
                  : e < 1995
                    ? ["horse racing and casinos", "dizzy"]
                    : ["online betting", "dizzy"],
            },
          ),
          ftC(
            "caffeine",
            "add",
            "Caffeine Dependence",
            "#8d5b3a",
            40,
            0.06,
            14,
            1600,
            "caffeine",
            "a coffee habit",
            [],
            "Needing caffeine to function, with headaches and crashes without it.",
            [
              "drank a whole pot of coffee before breakfast",
              "could not start the day without it",
              "tried to cut back every new year",
            ],
          ),
          ftC(
            "gaming",
            "add",
            "Gaming Addiction",
            "#00bcd4",
            39,
            0.05,
            9,
            1980,
            null,
            "gaming addiction",
            ["therapy", "exercise"],
            "Playing video games compulsively, at the cost of sleep, school, work and friends.",
            [
              "stayed up all night gaming for years",
              "turned it into a streaming career",
              "had to delete every game to break the habit",
            ],
          ),
          ftC(
            "internet",
            "add",
            "Internet & Social Media Addiction",
            "#29b6f6",
            48,
            0.07,
            10,
            1995,
            null,
            "internet addiction",
            ["meditation", "journal"],
            "Compulsive internet and social media use that is very hard to put down.",
            [
              "checked their phone hundreds of times a day",
              "doom-scrolled until 3am most nights",
              "did a digital detox and felt like a new person",
            ],
          ),
          ...BIRTH_TRAITS.map((e) =>
            ftC(e.id, "gene", e.name, e.col, e.h, e.base, 0, -6e4, null, e.old, [], e.desc, e.life, {
              pass: e.pass,
              img: btIcon(e.id),
              fOnly: e.fOnly,
            }),
          ),
        ],
        FT_COND = Object.fromEntries(FT_CONDS.map((e) => [e.id, e])),
        ftConds = (e) => (e.conds || []).filter((e) => btShow || "gene" !== FT_COND[e.id].grp),
        ftList = () => FT_CONDS.filter((e) => btShow || "gene" !== e.grp),
        FT_SHEETS = { n: ["cave/icons-sheet.webp", 1536, 1024], o: ["cave/traits-sheet.webp", 1125, 750] },
        FT_SPR = (() => {
          const e = {};
          return (
            [
              [
                "happy sad crying angry worried panic disappointed sick dizzy rain storm heartbreak darkface halfface swirl blankhead sleepy firehead",
                [
                  [15, 665, 65, 66],
                  [91, 664, 66, 68],
                  [168, 664, 66, 68],
                  [246, 664, 67, 68],
                  [325, 664, 67, 68],
                  [404, 664, 68, 68],
                  [484, 664, 67, 67],
                  [563, 664, 68, 67],
                  [643, 664, 68, 68],
                  [728, 653, 68, 82],
                  [812, 652, 68, 86],
                  [896, 670, 65, 60],
                  [981, 666, 63, 74],
                  [1069, 666, 67, 72],
                  [1160, 650, 48, 87],
                  [1232, 662, 64, 76],
                  [1324, 654, 85, 84],
                  [1441, 652, 61, 86],
                ],
              ],
              [
                "bottle beer wine champagne whiskey vodka rum cigarette joint vape cocaine meth pillRed pillBlue leaf mushroom lsd prescription",
                [
                  [27, 754, 36, 100],
                  [86, 767, 68, 85],
                  [172, 766, 49, 86],
                  [249, 754, 37, 100],
                  [312, 753, 55, 102],
                  [392, 752, 39, 101],
                  [459, 752, 56, 102],
                  [541, 763, 104, 94],
                  [648, 785, 54, 62],
                  [723, 763, 29, 91],
                  [770, 789, 81, 54],
                  [865, 775, 83, 79],
                  [965, 772, 66, 70],
                  [1040, 778, 47, 73],
                  [1107, 770, 82, 86],
                  [1208, 764, 96, 90],
                  [1324, 770, 81, 81],
                  [1445, 765, 58, 87],
                ],
              ],
              [
                "brain hospital psychiatrist armchair bed meditation dumbbell sleepbed shower plate book lotus sun cycle check",
                [
                  [15, 886, 81, 73],
                  [111, 879, 89, 81],
                  [223, 875, 64, 92],
                  [307, 888, 82, 77],
                  [407, 893, 97, 65],
                  [529, 881, 91, 88],
                  [631, 899, 95, 57],
                  [748, 898, 83, 62],
                  [849, 896, 71, 64],
                  [947, 892, 92, 71],
                  [1065, 897, 87, 61],
                  [1173, 898, 84, 59],
                  [1276, 887, 74, 75],
                  [1364, 895, 69, 63],
                  [1445, 888, 75, 77],
                ],
              ],
            ].forEach(([t, a]) =>
              t.split(" ").forEach((t, o) => {
                e[t] = ["n", ...a[o]];
              }),
            ),
            (e.caffeine = ["o", 204, 658, 49, 44]),
            e
          );
        })(),
        FT_TREAT = {
          therapy: ["Therapy", "armchair"],
          meds: ["Medication", "prescription"],
          antidepressants: ["Antidepressants", "pillBlue"],
          pills: ["Prescribed pills", "pillRed"],
          hospital: ["Hospital care", "hospital"],
          psychiatrist: ["Psychiatrist", "psychiatrist"],
          psychcare: ["Brain scans & psychiatric care", "brain"],
          exercise: ["Exercise", "dumbbell"],
          sleep: ["Sleep routine", "sleepbed"],
          rest: ["Rest", "bed"],
          meditation: ["Meditation", "lotus"],
          yoga: ["Yoga & breathing", "meditation"],
          journal: ["Journaling", "book"],
          meals: ["Meal plan", "plate"],
          sunlight: ["More sunlight", "sun"],
          selfcare: ["Daily self-care", "shower"],
          relapse: ["Relapse prevention", "cycle"],
          recovery: ["Recovery", "check"],
        };
