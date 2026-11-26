      function openMainMenu() {
        syncProfile(),
          sProfile.replaceChildren(),
          (sTitle.textContent = "MAIN MENU"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = X_ICON),
          (sBack.onclick = () => screen.classList.remove("open"));
        const e = (e, t, a, o, n = CHEV, s = "") =>
            `<div class="row mm ${s}" data-mm="${e}"><img src="${t}"><div class="t"><b>${a}</b>${o ? `<span>${o}</span>` : ""}</div>${n}</div>`,
          t = (e) => `menu/${e}.png`,
          a = Object.values(state.acc).filter(Boolean).length;
        sList.innerHTML =
          '<div class="sec">Store</div>' +
          e("market", t("cart"), "BitLife++ Marketplace", "Discover new ways to play!", CHEV, "mm-gold") +
          '<div class="sec">My Lives</div>' +
          e("newlife", t("bang"), "New Life", "Save this life and start a new one", DOTS) +
          e("save", t("floppy-disk"), "Save Life", "Save this life in this browser", DOTS) +
          e("lives", t("users"), "View Past Lives", "Switch between your saved lives") +
          '<div class="sec">My Stuff</div>' +
          e("stuff", t("shopping-bags"), "My Stuff", "Use your account-wide perks", DOTS) +
          '<div class="sec">Community</div>' +
          e(
            "community",
            "emoji/1f5e3-fe0f.png",
            "BitLife++ Community",
            "See what other BitLife players are doing",
          ) +
          '<div class="sec">Collectibles</div>' +
          e("acc", t("hat-womens"), `Accessories <em>(${a})</em>`, "Own them all") +
          e("ach", t("trophy"), `Achievements <em>(${achSeen.size}/410)</em>`, "Earn them all") +
          '<div class="sec">Stats</div>' +
          e("cemetery", t("skull-and-bones"), "Cemetery", "Compare your past lives") +
          '<div class="sec">Configure</div>' +
          e("cities", t("cityscape"), "Custom Cities", "Add your hometown to the game!") +
          e("people", t("hand-writing"), "Custom People", "Make your friends appear in the game!") +
          e("sports", t("basketball"), "Edit Sports Teams", "Change team names & more!") +
          e("fav", t("heart-yellow"), "Favorite Activities", "Customize your favorites") +
          e("help", t("help-center"), "Help", "Seek help and/or contact us", DOTS) +
          e("jobpacks", t("top-hat"), "Job Packs", "Collect them all", "", "dis") +
          e("expansion", "emoji/1f4bc.png", "Expansion Packs", "") +
          e("settings", t("gear"), "Settings", "", CHEV, "") +
          e("themes", t("moon-crescent"), "Themes", "") +
          e("redeem", t("star"), "Redeem Code", "Redeem a gift code", DOTS) +
          '<div class="mm-foot">NaBlooLife v0.2<br>99% bug-free. The other 1% is a feature.<span class="solo">Made by Nan089111 and ItzBloodie.dev</span></div>';
        const o = document.querySelector(".phone"),
          n = o.classList.contains("flui") && !o.classList.contains("y2018");
        if (n) {
          const e = new Set([
            "market",
            "community",
            "acc",
            "ach",
            "cities",
            "people",
            "sports",
            "fav",
            "help",
            "jobpacks",
            "expansion",
            "redeem",
          ]);
          sList.querySelectorAll("[data-mm]").forEach((t) => {
            e.has(t.dataset.mm) && t.remove();
          }),
            sList.querySelectorAll(".sec").forEach((e) => {
              const t = e.nextElementSibling;
              (!t || t.classList.contains("sec") || t.classList.contains("mm-foot")) && e.remove();
            });
          const t = sList.querySelector('[data-mm="redeem"] .t span');
          t && (t.textContent = "Redeem a mod code");
        }
        const s = {
          redeem: () => {
            if (!n || !window.BL_MODS || !BL_MODS.portCard) return comingSoon();
            play("choice"), BL_MODS.portCard();
          },
          community: () => {
            play("choice"), openCommunity(openMainMenu);
          },
          leaders: () => {
            play("choice"), openLeaderboards();
          },
          acc: () => {
            syncProfile(), openAccessories(), (sBack.onclick = openMainMenu);
          },
          settings: () => {
            syncProfile(), openModSettings(), (sBack.onclick = openMainMenu);
          },
          jobpacks: () => notice("Error", "Job Packs are not available right now.", null, !0),
          themes: openThemes,
          expansion: comingSoon,
          lives: openPastLives,
          account: () => {
            screen.classList.remove("open"), window.blAccount && window.blAccount.open();
          },
          market: () => {
            play("choice"), slideList(openMarketplace, 1);
          },
          save: () =>
            saveLife().then((e) =>
              e
                ? notice("Success", "You've successfully saved this life in this browser!", null, !0)
                : notice(
                    "Not Saved",
                    "This life couldn't be saved. Your browser may be blocking site storage (private mode) or it's full.",
                    null,
                    !0,
                  ),
            ),
          newlife: () => {
            const e = () => {
              screen.classList.remove("open"), startNewLife();
            };
            if (!lifeLive || state.dead) return e();
            iosConfirm("Confirm", "Do you want to save your current life and start a new life?", e);
          },
        };
        sList.querySelectorAll("[data-mm]").forEach(
          (e) =>
            (e.onclick = () => {
              const t = e.dataset.mm;
              (s[t] || comingSoon)();
            }),
        ),
          (sList.scrollTop = 0),
          screen.classList.add("open");
      }
      function openCommunity(e) {
        syncProfile(),
          sProfile.replaceChildren(),
          (sTitle.textContent = "BITLIFE COMMUNITY"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = e ? BACK_ICON : X_ICON),
          (sBack.onclick = e || (() => screen.classList.remove("open")));
        const t = (e, t, a, o) =>
          `<div class="row cm" data-cm><img src="community/${e}.png"><div class="t"><b>${t}${a ? ` <em>(${a})</em>` : ""}</b><span>${o}</span></div>${DOTS}</div>`;
        (sList.innerHTML =
          '<div class="sec">Social Media</div>' +
          t("social-instagram", "@BitLifeApp", "Instagram", "Enjoy our favorite BitLife memes") +
          t("social-snapchat", "BitLifeApp", "Snapchat", "Get your BitLife news in a Snap") +
          t("social-tiktok", "@BitLifeApp", "TikTok", "Follow our official TikTok account") +
          t("social-twitter", "@BitLifeApp", "Twitter", "Keep up on news from BitLife HQ") +
          t("social-youtube", "/BitLifeApp", "YouTube", "View our favorite BitLife videos") +
          t("help-center", "BitLife Support", "", "Visit our help center") +
          t("help-center", "BitLife Account", "", "Request account deletion") +
          '<div class="act-surrender cm-tell" data-cm><img src="community/shout.png" alt=""><span>Tell a Friend...</span></div>'),
          sList.querySelectorAll("[data-cm]").forEach((e) => (e.onclick = () => comingSoon())),
          (sList.scrollTop = 0),
          screen.classList.add("open");
      }
      heirBtn.addEventListener("click", () => {
        overlayOpen() ||
          hlWrap.classList.contains("open") ||
          heirBtn.classList.contains("hide") ||
          openHeirloom(!1);
      }),
        document.getElementById("ageBtn").addEventListener(
          "click",
          (e) => {
            if (hlWrap.classList.contains("open")) return e.stopImmediatePropagation();
          },
          !0,
        ),
        syncHeirBtn(),
        setInterval(syncHeirBtn, 6e4);
      const LB_SORTS = [
          ["age", "Age"],
          ["networth", "Net Worth"],
          ["children", "Children"],
          ["lovers", "Lovers"],
        ],
        lbEsc = (e) =>
          String(e).replace(
            /[&<>"']/g,
            (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[e],
          ),
        lbScore = (e, t) =>
          "age" === t
            ? `Age ${e.age}`
            : "networth" === t
              ? `${e.net_worth < 0 ? "-" : ""}$${Math.abs(e.net_worth).toLocaleString("en-US")}`
              : "children" === t
                ? `${e.children} ${1 === e.children ? "Child" : "Children"}`
                : `${e.lovers} ${1 === e.lovers ? "Lover" : "Lovers"}`,
        LB_COL = { age: "age", networth: "net_worth", children: "children", lovers: "lovers" };
      function withLoading(e, t = 700) {
        const a = document.createElement("div");
        (a.id = "lbLoad"),
          (a.innerHTML = '<div><img src="splash/sperm0.png" alt=""><span>loading...</span></div>'),
          document.querySelector(".phone").append(a);
        const o = a.querySelector("img");
        let n = 0;
        const s = setInterval(() => {
          (n = (n + 1) % 6), (o.src = `splash/sperm${n}.png`);
        }, 70);
        setTimeout(() => {
          clearInterval(s), a.remove(), e();
        }, t);
      }
      async function openLeaderboards(e = "age", t = !1) {
        let a = null,
          o = 0;
        if (!t) {
          (a = document.createElement("div")),
            (a.id = "lbLoad"),
            (a.innerHTML = '<div><img src="splash/sperm0.png" alt=""><span>loading...</span></div>'),
            document.querySelector(".phone").append(a);
          const e = a.querySelector("img");
          let t = 0;
          o = setInterval(() => {
            (t = (t + 1) % 6), (e.src = `splash/sperm${t}.png`);
          }, 70);
        }
        let n = null;
        try {
          !t && window.blAccount && window.blAccount.sync && (await window.blAccount.sync(!0));
          const [a] = await Promise.all([
            fetch(`/api/leaderboard?sort=${e}`, { credentials: "same-origin" }),
            new Promise((e) => setTimeout(e, t ? 0 : 700)),
          ]);
          a.ok && (n = (await a.json()).rows);
        } catch {}
        if ((clearInterval(o), a && a.remove(), !n)) return notice("Error", "Error", null, !0);
        syncProfile(),
          sProfile.replaceChildren(),
          (sTitle.textContent = "TODAY'S LEADERBOARDS"),
          (sSub.style.display = "none"),
          screen.classList.add("lb"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => {
            screen.classList.remove("lb"), openMainMenu();
          });
        const s = LB_COL[e];
        (sList.innerHTML =
          `<div class="lb-sort"><span>Sort by:</span>${LB_SORTS.map(([t, a]) => `<a data-lb="${t}"${t === e ? ' class="on"' : ""}>${a}</a>`).join("")}</div><div class="sec">Version 0.2</div>` +
          (n.length
            ? n
                .map(
                  (t) =>
                    `<div class="row lb-row cm"><img src="flags/${lbEsc(t.country)}.png" alt=""><div class="t"><b>${((e) => 1 + n.filter((t) => t[s] > e[s]).length)(t)}. ${lbEsc(t.name)} <em>(${lbScore(t, e)})</em></b><span>Played in ${lbEsc(t.city)}</span></div></div>`,
                )
                .join("")
            : '<div class="lb-empty">No scores in the last 24 hours yet.</div>')),
          sList.querySelectorAll("[data-lb]").forEach(
            (t) =>
              (t.onclick = () => {
                t.dataset.lb !== e && (play("choice"), openLeaderboards(t.dataset.lb, !0));
              }),
          ),
          (sList.scrollTop = 0),
          screen.classList.add("open");
      }
      new MutationObserver(() => {
        "TODAY'S LEADERBOARDS" !== sTitle.textContent && screen.classList.remove("lb");
      }).observe(sTitle, { childList: !0, characterData: !0, subtree: !0 }),
        (document.getElementById("sHelp").onclick = () =>
          notice(
            "Today's Leaderboards",
            "These are the top scores in the world over the last 24 hours.<br><br>Each new score lasts for one day on the leaderboard before falling off!<br><br>Net Worth scores are recorded for the first life in a legacy only!",
            null,
            !0,
          ));
      for (const J of ["discordLink"])
        document.getElementById(J).addEventListener("click", (e) => {
          overlayOpen() ? e.preventDefault() : play("choice");
        });
      function openCustomLife() {
        play("choice"),
          (sTitle.textContent = "CUSTOM LIFE"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openMainMenu);
        const e = new Set();
        (sList.innerHTML =
          '<div class="sec">Birth Traits</div>' +
          BIRTH_TRAITS.map(
            (e) =>
              `<div class="row cl-row" data-gene="${e.id}"><img src="${btIcon(e.id)}"><div class="t"><b>${e.name}</b><span>${e.desc}</span></div><img class="ck" src="${modBox(!1)}"></div>`,
          ).join("") +
          '<div class="cl-go"><span>Tick the traits you want to be born with. Leave them all unticked for none.</span><button id="clStart">Start Life</button></div>'),
          sList.querySelectorAll("[data-gene]").forEach(
            (t) =>
              (t.onclick = () => {
                const a = t.dataset.gene;
                e.has(a) ? e.delete(a) : e.add(a), (t.querySelector(".ck").src = modBox(e.has(a)));
              }),
          ),
          (document.getElementById("clStart").onclick = () => {
            try {
              localStorage.setItem("bitlifepp-genes", JSON.stringify([...e]));
            } catch {}
            startNewLife();
          }),
          (sList.scrollTop = 0);
      }
      const phoneEl = document.querySelector(".phone"),
        THEME_KEY = "bitlifepp-theme";
      try {
        localStorage.getItem("bitlifepp-dark-default") ||
          (localStorage.setItem("bitlifepp-dark-default", "1"),
          "light" === (localStorage.getItem(THEME_KEY) || "light") &&
            localStorage.setItem(THEME_KEY, "dark"));
      } catch {}
      const getTheme = () => {
          try {
            return localStorage.getItem(THEME_KEY) || "dark";
          } catch {
            return "dark";
          }
        },
        FREE_THEMES = ["light", "dark"],
        themeOK = (e) => !!mods.allThemes || FREE_THEMES.includes(e),
        liveTheme = () => {
          const e = getTheme();
          return themeOK(e) ? e : /dark/.test(e) ? "dark" : "light";
        };
      let applyTheme = (e) => {
        if (
          (phoneEl.classList.toggle(
            "dark",
            "dark" === e || "halloween-dark" === e || "christmas-dark" === e || "famous-dark" === e,
          ),
          phoneEl.classList.toggle("gold", "superstar" === e),
          phoneEl.classList.toggle("christmas", "christmas" === e || "christmas-dark" === e),
          phoneEl.classList.toggle("rainbow", "rainbow" === e),
          phoneEl.classList.toggle("y2018", "2018" === e),
          phoneEl.classList.toggle("famous-theme", "famous" === e || "famous-dark" === e),
          phoneEl.classList.toggle("halloween", "halloween" === e || "halloween-dark" === e),
          "halloween" !== e && "halloween-dark" !== e && state.acc && state.acc.mask)
        ) {
          state.acc.mask = null;
          try {
            renderAvatar();
          } catch {}
        }
      };
      const OLD_EMOJI = new Set(window.EMOJI_2018 || []),
        JOB2018 = {};
      Object.values(JOB_DATA)
        .flat()
        .forEach((e) =>
          (e.items || [e]).forEach((e) => {
            e.s && e.e && !JOB2018[e.s] && (JOB2018[e.s] = e.e);
          }),
        );
      const swapIcon = (e) => {
          const t = phoneEl.classList.contains("y2018"),
            a = e.getAttribute("src") || "";
          if (t) {
            const t = a.match(/^([a-z0-9-]+\/[\w-]+)\.png$/);
            let o = t && (window.ICON_2018 || {})[t[1]];
            if (!o && t) {
              const [e, a] = t[1].split("/");
              if ("pets" !== e || a.startsWith("ui-"))
                if ("houses" === e)
                  o = /house(1|2|4|5|6|7|12|13|15|16|17|20|26)\b|garden/.test(a) ? "1f3e1" : "1f3e0";
                else if ("cars" !== e || a.startsWith("ui-")) {
                  if ("job-emoji" === e) {
                    const e = JOB2018[a];
                    e && (o = e);
                  }
                } else o = "1f698";
              else o = (window.PET_2018 || {})[a.replace(/[a-z]$/, "")];
            }
            if (
              (o &&
                !OLD_EMOJI.has(o) &&
                OLD_EMOJI.has(o.replace(/-fe0f/g, "")) &&
                (o = o.replace(/-fe0f/g, "")),
              o && !OLD_EMOJI.has(o) && (o = null),
              o)
            )
              return (e.dataset.newSrc = a), void e.setAttribute("src", `2018/emoji/${o}.png`);
            const n = a.match(/^emoji\/([0-9a-f-]+)\.png$/);
            if (!n) return;
            const s = OLD_EMOJI.has(n[1])
              ? n[1]
              : OLD_EMOJI.has(n[1].replace(/-fe0f/g, ""))
                ? n[1].replace(/-fe0f/g, "")
                : null;
            s && ((e.dataset.newSrc = a), e.setAttribute("src", `2018/emoji/${s}.png`));
          } else e.dataset.newSrc && (e.setAttribute("src", e.dataset.newSrc), delete e.dataset.newSrc);
        },
        swapAllIcons = (e) =>
          (e.matches && e.matches("img")
            ? [e]
            : [...(e.querySelectorAll ? e.querySelectorAll("img") : [])]
          ).forEach(swapIcon);
      new MutationObserver((e) => {
        phoneEl.classList.contains("y2018") &&
          e.forEach((e) =>
            "attributes" === e.type
              ? swapIcon(e.target)
              : e.addedNodes.forEach((e) => 1 === e.nodeType && swapAllIcons(e)),
          );
      }).observe(phoneEl, { childList: !0, subtree: !0, attributes: !0, attributeFilter: ["src"] });
      const _applyTheme = applyTheme;
      function styleRows(e, t) {
        const a = window.SETTINGS_UI;
        if (!a) return "";
        const o = !!a.settings.bitlifeMode,
          n = (a, o, n, s, r) =>
            `<div class="row th" data-style="${a}"><img src="${o}"><div class="t"><b>${n}</b><span>${s}</span></div>${((a) => ("superstar" === e ? `<img class="ck" src="gold/tableCheckbox${a ? "Checked" : "Unchecked"}.png">` : `<img class="ck" src="menu/Checkbox${a ? "Checked" : "Unchecked"}${t}.png">`))(r)}</div>`,
          s = "dark" === e;
        return (
          '<div class="sec">Style</div>' +
          n(
            "freelife",
            "freelife/penguin1.png",
            "NaBlooLife Mode",
            "Snowy blue look and the penguin loading screen",
            !o && !s,
          ) +
          n(
            "freelife-dark",
            "freelife/penguin1.png",
            "NaBlooLife Dark Mode",
            "The snowy blue look on a dark background",
            !o && s,
          ) +
          n(
            "bitlife",
            "splash/sperm0.png",
            "BitLife Mode",
            "The classic red BitLife++ look and loading screen",
            o,
          )
        );
      }
      function openThemes() {
        play("choice"),
          (sTitle.textContent = "THEMES"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openMainMenu);
        const e = liveTheme(),
          t = /dark/.test(e) ? "-dm" : "",
          a = (e, t, a, o, n) =>
            `<div class="row th${themeOK(e) ? "" : " locked"}" data-th="${e}"><img src="menu/${t}.png"><div class="t"><b>${a}</b><span>${themeOK(e) ? o : "Locked: needs the Unlock All Themes mod"}</span></div>${n}</div>`,
          o = (a) =>
            "superstar" === e
              ? `<img class="ck" src="gold/tableCheckbox${e === a ? "Checked" : "Unchecked"}.png">`
              : `<img class="ck" src="menu/Checkbox${e === a ? "Checked" : "Unchecked"}${t}.png">`;
        (sList.innerHTML =
          a("dark", "moon-crescent", "Dark Mode", "Go dark", o("dark")) +
          a("light", "sun", "Light Mode", "Go light", o("light")) +
          a("superstar", "star-glowing", "Superstar Mode", "Go superstar", o("superstar")) +
          a("halloween", "ghost", "Halloween Mode", "Go spooky", o("halloween")) +
          a("halloween-dark", "bat", "Halloween Dark Mode", "Go extra spooky", o("halloween-dark")) +
          a("christmas", "xmas-tree", "Christmas Mode", "Go festive", o("christmas")) +
          a("christmas-dark", "snowflake", "Christmas Dark Mode", "Go frosty", o("christmas-dark")) +
          a("famous", "star-plain", "Famous Mode", "Live like a star", o("famous")) +
          a("famous-dark", "star-plain", "Famous Dark Mode", "Star of the night", o("famous-dark")) +
          a("rainbow", "../emoji/1f308", "Rainbow Mode", "Go RGB", o("rainbow")) +
          a("2018", "../2018/sperm1", "2018 BitLife", "Go back to where it all began", o("2018")) +
          styleRows(e, t)),
          sList.querySelectorAll("[data-style]").forEach(
            (e) =>
              (e.onclick = () => {
                const t = e.dataset.style;
                play("choice"), SETTINGS_UI.set("bitlifeMode", "bitlife" === t);
                const a =
                  "freelife-dark" === t
                    ? "dark"
                    : "freelife" === t && "dark" === liveTheme()
                      ? "light"
                      : null;
                if (a) {
                  try {
                    localStorage.setItem(THEME_KEY, a);
                  } catch {}
                  applyTheme(a), syncProfile(), sProfile.replaceChildren();
                }
                openThemes();
              }),
          ),
          sList.querySelectorAll("[data-th]").forEach(
            (e) =>
              (e.onclick = () => {
                const t = e.dataset.th;
                if (!themeOK(t))
                  return show(
                    "Theme Locked",
                    "Turn on Unlock All Themes in Settings → Mod Workshop to use this theme.",
                  );
                try {
                  localStorage.setItem(THEME_KEY, t);
                } catch {}
                applyTheme(t), syncProfile(), sProfile.replaceChildren(), openThemes();
              }),
          ),
          (sList.scrollTop = 0);
      }
      (applyTheme = (e) => {
        if ((_applyTheme(e), swapAllIcons(phoneEl), "function" == typeof renderAvatar))
          try {
            renderAvatar();
          } catch {}
      }),
        applyTheme(liveTheme()),
        document.querySelector(".menu-btn").addEventListener("click", () => {
          state.dead || (play("menu"), openMainMenu());
        });
      const modBox = (e) =>
        phoneEl.classList.contains("gold")
          ? `gold/tableCheckbox${e ? "Checked" : "Unchecked"}.png`
          : `menu/Checkbox${e ? "Checked" : "Unchecked"}${phoneEl.classList.contains("dark") ? "-dm" : ""}.png`;
      function openExpansions() {
        play("choice"),
          (sTitle.textContent = "EXPANSION PACKS"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openMainMenu);
        var e;
        (sList.innerHTML =
          '<div class="sec">Family</div>' +
          `<div class="row" data-mod="${(e = "extFamily")}"><img src="${"emoji/1f46a.png"}"><div class="t"><b>${"Extended Family"}</b><span>${"Grandparents, aunts, uncles & cousins + 150 family events"}</span></div><img class="ck" src="${modBox(mods[e])}"></div>`),
          sList.querySelectorAll("[data-mod]").forEach(
            (e) =>
              (e.onclick = () => {
                const t = e.dataset.mod;
                (mods[t] = !mods[t]), saveMods(), (e.querySelector(".ck").src = modBox(mods[t]));
              }),
          ),
          (sList.scrollTop = 0);
      }
      const WS_SHOW_PAPAL = !1,
        WS_SHOW_SOURCE = !1;
      function openModSettings() {
        play("choice"),
          (sTitle.textContent = "MOD WORKSHOP"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => (window.SETTINGS_UI ? SETTINGS_UI.openSettings() : openActivities()));
        const e = (e, t, a, o) =>
          `<div class="row" data-mod="${e}"><img src="${t}"><div class="t"><b>${a}</b><span>${o}</span></div><img class="ck" src="${modBox(mods[e])}"></div>`;
        (sList.innerHTML =
          '<div class="sec">Mods</div>' +
          e(
            "modLoader",
            "ui/gear.png",
            "Mod Loader",
            "Adds a Mods section to the Main Menu to enable/disable extra mod scripts without a code",
          ) +
          '<div class="sec">Heirlooms</div>' +
          e(
            "keepHeirloom",
            "heirloom/ui-multiPurposeHeirloomIcon.png",
            "Keep Heirloom Button",
            "The Find Heirloom button stays there and never goes away",
          ) +
          '<div class="sec">Gambling</div>' +
          e(
            "goldenNeko",
            "casino/neko.png",
            "Golden Neko Statue",
            "Luck at gambling: 20% bigger casino and horse race winnings, and luckier blackjack hits",
          ) +
          '<div class="sec">Jobs</div>' +
          e(
            "expandedJobs",
            "emoji/1f354.png",
            "Expanded Job Pack",
            "Restaurant Jobs & Big Employers in Occupation",
          ) +
          e(
            "painting",
            "art/ui-palette.png",
            "Painting",
            "Paint, exhibit and sell your art from Occupation and School. Win fans and unlock Fame",
          ) +
          e(
            "strictMajors",
            "edu/university.png",
            "Strict Majors",
            "Degree jobs only accept their main major (e.g. Accountant = Accounting), not the alternative majors players have reported",
          ) +
          e(
            "easyJobs",
            "emoji/1f4bc.png",
            "Skip Job Requirements",
            "Apply for any job without the right degree, major, experience or rank (the old behavior)",
          ) +
          '<div class="sec">Cars</div>' +
          e(
            "accurateCars",
            "cars/suv-red.png",
            "Accurate Car Prices",
            "Real-world prices for every car; worn-out cars sell for less",
          ) +
          e(
            "extendedCars",
            "cars/tesla-model-s.png",
            "Extended Cars",
            "Adds custom cars like the Tesla Model S and Cybertruck to the dealerships",
          ) +
          '<div class="sec">Life Story</div>' +
          e(
            "showYear",
            "emoji/1f4c5.png",
            "Show Year",
            'Show the calendar year next to your age, e.g. "Age: 5 years (2019)"',
          ) +
          '<div class="sec">Family</div>' +
          e(
            "extFamily",
            "emoji/1f46a.png",
            "Extended Family",
            "Grandparents, aunts, uncles & cousins + 150 family events",
          ) +
          e(
            "familyTree",
            "emoji/1f333.png",
            "Family Tree",
            "View Family Tree in Assets: your bloodline back 5 generations, with a famous ancestor",
          ) +
          e(
            "lateAncestors",
            "ui/skull-and-bones.png",
            "Ancestors",
            "Show your late great-ancestors from the Family Tree under Late Relationships in Relationships",
          ) +
          e(
            "famousLife",
            "emoji/1f31f.png",
            "Be Born Into a Famous Life",
            "Your parents & relatives can be celebrities (even megastars): their fame fills your Fame bar (up to 100%) and brings you followers every year",
          ) +
          e(
            "birthTraits",
            "genes/heterochromia.png",
            "Birth Traits",
            "Be born with rare genes like heterochromia, werewolf syndrome or two heads. They run in families, and Custom Life lets you pick them",
          ) +
          e(
            "showMoney",
            "act/lottery.png",
            "Show Their Money",
            "Profiles show exactly how much money each person has",
          ) +
          e(
            "unlimitedGive",
            "rel/givemoney.png",
            "Unlimited Give Money",
            "Give Money has no $10,000 cap. Give anyone as much as you have",
          ) +
          e(
            "infiniteLovers",
            "love/date.png",
            "Infinite Lovers",
            "Date as many people as you want at once, with no limit. Your partner never finds out!",
          ) +
          '<div class="sec">Military</div>' +
          e(
            "militaryExpanded",
            "mil/x-combat-helmet.png",
            "Military Expanded",
            "MOS careers (sniper, medic, pilot…), Special Forces selection, wars, real medals and rank insignia",
          ) +
          e(
            "battleScars",
            "emoji/1fa79.png",
            "Battle Scars",
            "With Military Expanded, some Army & Marines soldiers have scars or an eye patch",
          ) +
          e(
            "warReunion",
            "mil/medal-military.png",
            "War Reunions",
            "Veterans get invited to war reunions decades after they served",
          ) +
          e(
            "showMedals",
            "mil/medal-first.png",
            "Medals in Assets",
            "Show every military medal you have earned in your Assets tab",
          ) +
          (WS_SHOW_PAPAL
            ? '<div class="sec">Religion</div>' +
              e(
                "papal",
                "church/b-church.png",
                "Papal Career Expansion",
                "Follow a career in the Catholic Church, rise through the clergy, become a cardinal, participate in papal conclaves, and potentially become Pope.",
              )
            : "") +
          '<div class="sec">Crime</div>' +
          e("crimeDrugs", "crime/pill.png", "Sell Drugs", "Adds Sell Drugs to Activities → Crime") +
          e(
            "infiniteGTA",
            "crime/car-front.png",
            "Unlimited Car Theft",
            "Steal as many cars as you want each year instead of 4. You can still get caught!",
          ) +
          e(
            "neverCaught",
            "crime/knife.png",
            "Untouchable",
            "You never get caught for murder or car theft. The cops never show up.",
          ) +
          e(
            "alwaysWinCourt",
            "prison/gavel.png",
            "Always Win in Court",
            "Every court case ends in Not Guilty, no matter your lawyer or your plea.",
          ) +
          e(
            "infamousKillers",
            "emoji/1f4f0.png",
            "Infamous Killers",
            "Going to prison for murder makes you famous. More kills means more fame: a huge count stays at 100% for years, then slowly fades but never fully goes away",
          ) +
          '<div class="sec">Mental Health</div>' +
          e(
            "noMentalHealth",
            "emoji/1f9e0.png",
            "Disable Mental Health & Insanity",
            "Turns off the Mental Health and Insanity bars, therapy, conditions, trauma, the psych ward and every Mental Health expansion",
          ) +
          '<div class="sec">Pets</div>' +
          e(
            "exoticMarket",
            "pets/ui-exoticpet.png",
            "Exotic Animal Market",
            "See every exotic animal at once, with real-world prices (Activities → Pets)",
          ) +
          e(
            "petDiseases",
            "pets/ui-vet.png",
            "Expanded Pet Diseases",
            "Over 100 species-specific illnesses for dogs, cats, small mammals, birds, reptiles, fish, horses and exotics (BitLife's own 6 pet illnesses are always on)",
          ) +
          e(
            "petSymptomPopups",
            "emoji/1f4cb.png",
            "Pet Symptom Alerts",
            "When a pet shows signs of illness, a popup tells you as well as the life story",
          ) +
          '<div class="sec">Looks</div>' +
          e(
            "modHair",
            "emoji/1f308.png",
            "Hair Customization",
            "Any hairstyle & color, plus rainbow and 100+ hair effects",
          ) +
          e(
            "hairPack",
            "emoji/1f487.png",
            "Hair Pack",
            "61 new hairstyles (hip-hop, long, short, plus afros, twists, locs and braids) in Barber Expanded",
          ) +
          e(
            "gangTats",
            "tattoo/teardrop.png",
            "Compton Varrio Locos 38St Gang",
            "Gang face tattoos: forehead lettering, 38th St & Street Gang cheek pieces and teardrops. Pick them in New Life → Appearance or Salon & Spa",
          ) +
          e(
            "pardinosTats",
            "tattoo/teardrop.png",
            "Barrio Los Pardinos 13",
            "Gang face tattoos: BLP Trece, Barrio Pardinos X3 & Got Barrio P forehead pieces, BLSP cheek pieces and teardrops",
          ) +
          e(
            "bloodelTats",
            "tattoo/teardrop.png",
            "Bloodel Street Piru",
            "Gang face tattoos: Bloodel Street Piru, Everybody Killa Gangstaz, WBLST & SPY BP forehead pieces, BLST Piru & Bloodel Piru cheek pieces and teardrops",
          ) +
          e(
            "modSkin",
            "emoji/270b.png",
            "Skin Customization",
            "Skin & eye color, plus rainbow and other effects",
          ) +
          e(
            "allAccessories",
            "emoji/1f576-fe0f.png",
            "Unlock All Hats & Sunglasses",
            "Wear any hat, crown or pair of glasses",
          ) +
          '<div class="sec">Themes</div>' +
          e(
            "allThemes",
            "menu/moon-crescent.png",
            "Unlock All Themes",
            "Use every theme in Main Menu → Themes: Superstar, Halloween, Christmas, Famous, Rainbow and 2018 BitLife",
          ) +
          (WS_SHOW_SOURCE
            ? `<div class="sec">Make Your Own</div><a class="row" id="ghMods" href="${GITHUB_URL}" target="_blank" rel="noopener" style="text-decoration:none;height:auto;min-height:76px;padding-top:12px;padding-bottom:12px"><svg viewBox="0 0 16 16" width="38" height="38" style="flex:none;margin:0 4px"><path fill="#181717" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg><div class="t"><b>Make your own mods</b><span>BitLife++ is a fully recoded version, meaning you can download the source code and put it into any AI code editor and get any option you have ever wanted in BitLife. View my source code here!</span></div>${CHEV}</a>`
            : "")),
          sList.querySelectorAll("[data-mod]").forEach(
            (e) =>
              (e.onclick = () => {
                const t = e.dataset.mod;
                if (
                  ((mods[t] = !mods[t]),
                  saveMods(),
                  (e.querySelector(".ck").src = modBox(mods[t])),
                  "keepHeirloom" === t && syncHeirBtn(),
                  "allThemes" === t &&
                    (applyTheme(liveTheme()),
                    sList.querySelectorAll("[data-mod]").forEach((e) => {
                      e.querySelector(".ck").src = modBox(mods[e.dataset.mod]);
                    })),
                  "birthTraits" === t)
                ) {
                  if (((btShow = mods[t]), btShow)) {
                    try {
                      ftInheritAll(ftSetup(), ftCtx());
                    } catch (e) {}
                    revealGenes(!1);
                  }
                  renderStats(), renderAvatar();
                }
                if (
                  (("accurateCars" !== t && "extendedCars" !== t) || restockCars(),
                  "papal" === t && window.PAPAL && PAPAL.toggled(mods[t]),
                  mods[t] ||
                    "modHair" !== t ||
                    Object.assign(state.mod, { style: null, xHair: null, effect: "none", color: null }),
                  mods[t] ||
                    "modSkin" !== t ||
                    Object.assign(state.mod, {
                      eyeColor: null,
                      skinColor: null,
                      eyeFx: "none",
                      skinFx: "none",
                    }),
                  !mods[t] && "allAccessories" === t)
                )
                  for (const e in FREE_ACC) {
                    const t = state.acc[e] && ACCESSORIES[e].find((t) => t.id === state.acc[e]);
                    t && !accUnlocked(e, t) && (state.acc[e] = null);
                  }
                /^(modHair|hairPack|gangTats|pardinosTats|bloodelTats|modSkin|allAccessories|militaryExpanded|battleScars)$/.test(
                  t,
                ) && renderAvatar();
              }),
          ),
          (sList.scrollTop = 0);
      }
      const ftWrap = document.getElementById("ftWrap"),
        ftTree = document.getElementById("ftTree"),
        ftScroll = document.getElementById("ftScroll");
      function dragScrollX(e) {
        let t = null,
          a = !1;
        e.addEventListener("pointerdown", (o) => {
          "mouse" === o.pointerType &&
            0 === o.button &&
            ((t = { x: o.clientX, left: e.scrollLeft }), (a = !1));
        }),
          window.addEventListener("pointermove", (o) => {
            if (!t) return;
            const n = o.clientX - t.x;
            Math.abs(n) > 5 && ((a = !0), e.classList.add("dragging")), a && (e.scrollLeft = t.left - n);
          }),
          window.addEventListener("pointerup", () => {
            (t = null), setTimeout(() => e.classList.remove("dragging"), 0);
          }),
          e.addEventListener(
            "click",
            (e) => {
              a && (e.stopPropagation(), e.preventDefault(), (a = !1));
            },
            !0,
          ),
          e.addEventListener(
            "wheel",
            (t) => {
              e.scrollWidth <= e.clientWidth ||
                !t.deltaY ||
                t.deltaX ||
                ((e.scrollLeft += t.deltaY), t.preventDefault());
            },
            { passive: !1 },
          );
      }
      dragScrollX(document.getElementById("ftTraits"));
      const ftPop = document.getElementById("ftPop"),
        ftDlg = document.getElementById("ftDlg");
      (document.getElementById("ftBack").innerHTML = BACK_ICON),
        (document.getElementById("ftBack").onclick = () => {
          play("choice"),
            ftPop.classList.remove("open"),
            ftWrap.classList.remove("open"),
            document.getElementById("glWrap").classList.remove("open");
        }),
        (ftPop.onclick = (e) => {
          e.target === ftPop && ftPop.classList.remove("open");
        });
      const FT_OLD_NAMES = {
          m: [
            "Ezekiel",
            "Bartholomew",
            "Cornelius",
            "Silas",
            "Ambrose",
            "Thaddeus",
            "Horace",
            "Elijah",
            "Josiah",
            "Augustus",
            "Clarence",
            "Mortimer",
            "Archibald",
            "Wilbur",
            "Otis",
            "Virgil",
            "Jedediah",
            "Leopold",
            "Rufus",
            "Edmund",
            "Harold",
            "Walter",
            "Chester",
            "Ernest",
          ],
          f: [
            "Mildred",
            "Agnes",
            "Gertrude",
            "Beatrice",
            "Eleanor",
            "Florence",
            "Harriet",
            "Josephine",
            "Clementine",
            "Edith",
            "Mabel",
            "Ida",
            "Opal",
            "Winifred",
            "Cordelia",
            "Prudence",
            "Henrietta",
            "Louisa",
            "Matilda",
            "Dorothy",
            "Violet",
            "Hazel",
            "Ethel",
            "Rosalind",
          ],
        },
        ftNow = () => state.birthYear + state.age,
        ftName = (e, t) => (t < 1935 && chance(0.65) ? any(FT_OLD_NAMES[e]) : uname(e)),
        ftAn = (e) => (/^[aeiou]/i.test(e) ? "an " : "a ") + e,
        ftCountryName = (e) => (COUNTRIES[e] || [e])[0];
      function ftAnc(e, t, a, o, n) {
        const s = ftNow();
        let r = Math.max(rint(46, 97), n - a + rint(1, 30));
        return (
          a + r > s && s - a > 96 && (r = Math.max(n - a + 1, s - a - rint(1, 25))),
          {
            anc: !0,
            g: e,
            first: ftName(e, a),
            last: t,
            born: a,
            life: r,
            country: o,
            look: randomLook(e, 70),
          }
        );
      }
      function ftLine(e, t, a, o, n) {
        const s = [];
        for (let r = 0; r < o; r++) {
          const o = t - rint(22, 38),
            r = Math.min(t - 17, o + rint(-7, 3)),
            i = chance(0.2) ? any(Object.keys(COUNTRIES).filter((e) => e !== a)) : null,
            l = i || a,
            c = n ? SURNAME : ulast(),
            d = ftAnc("m", c, o, l, t),
            u = ftAnc("f", c, r, l, t);
          (u.maiden = ulast()),
            (d.spouseOf = u),
            (u.spouseOf = d),
            i && (d.movedTo = u.movedTo = a),
            !n && e.anc && (e.maiden = c),
            s.push([d, u]),
            (e = n ? d : u),
            (t = n ? o : r),
            (a = l);
        }
        return s;
      }
      const ftBornOf = (e) =>
        e.anc
          ? e.born
          : null != e.ageAtBirth
            ? state.birthYear - e.ageAtBirth
            : state.birthYear - e.ageOffset;
      function ftExtend(e) {
        e.cave ??= ftCaveClan();
        for (
          ;
          e.p.length < 7 &&
          Math.max(...[e.p, e.m].map((e) => Math.min(...e[e.length - 1].map((e) => e.born)))) >= 1800;

        ) {
          const t = e.p[e.p.length - 1],
            a = e.m[e.m.length - 1];
          e.p.push(...ftLine(t[0], t[0].born, t[0].country, 1, !0)),
            e.m.push(...ftLine(a[1], a[1].born, a[1].country, 1, !1));
        }
      }
      function ftRoyalDynasty(e) {
        const t = state.royal;
        if (!t || !e.p.length) return;
        if (e.royalDone) {
          for (const t of [...e.p.flat(), ...e.gp])
            t &&
              t.royal &&
              null == t.royal.worth &&
              (t.royal.worth = 1e5 * Math.round((ROY_RANKS[t.royal.rank].pay * rint(18, 90)) / 1e5));
          return ftRoyalSync(e);
        }
        e.royalDone = !0;
        const a = "prince" === t.rank || "monarch" === t.rank ? "monarch" : t.rank,
          o = (COUNTRIES[state.country] || [""])[0],
          n =
            "monarch" === a
              ? "gb" === state.country
                ? "England"
                : /^(United|Netherlands)/.test(o)
                  ? `the ${o}`
                  : o
              : t.place,
          s = rint(Math.min(1, e.p.length - 1), Math.min(4, e.p.length - 1)),
          r = (e) =>
            e + (e % 100 >= 11 && e % 100 <= 13 ? "th" : { 1: "st", 2: "nd", 3: "rd" }[e % 10] || "th"),
          i = () => 1e5 * Math.round((ROY_RANKS[a].pay * rint(18, 90)) / 1e5),
          l = (e, t, o, s, l) => {
            if (
              e &&
              ((e.royal = {
                rank: a,
                nth: o,
                consort: !!s,
                founder: !!l,
                place: n,
                worth: i(),
                title: s ? `${royWord(a, t)} of ${n} (consort)` : `${r(o)} ${royWord(a, t)} of ${n}`,
              }),
              e.look && (e.look.crown = royCrown(a, t)),
              !e.anc)
            ) {
              const t = profileOf(e, ftYears(e)[1] - ftYears(e)[0]);
              (t.money = Math.max(t.money, e.royal.worth)), (t.job = "Royalty");
            }
          };
        for (let t = s, a = 1; t >= 0; t--, a++) {
          const [o, n] = e.p[t];
          l(o, "m", a, !1, t === s), l(n, "f", a, !0);
        }
        (e.p[s][0].royal.founded = e.p[s][0].born + rint(22, 40)),
          l(e.gp[0], "m", s + 2),
          l(e.gp[1], "f", s + 2, !0);
        const c = state.parents.find((e) => "Father" === e.role),
          d = state.parents.find((e) => "Mother" === e.role);
        c &&
          c.royal &&
          Object.assign(
            c.royal,
            { nth: s + 3, place: n },
            c.royal.rank === a ? { title: `${r(s + 3)} ${royWord(a, "m")} of ${n}` } : {},
          ),
          d && d.royal && Object.assign(d.royal, { nth: s + 3, consort: !0, place: n });
        for (const e of [c, d])
          if (e && e.royal) {
            e.royal.worth = i();
            const t = profileOf(e, e.ageAtBirth + state.age);
            t.money = Math.max(t.money, e.royal.worth);
          }
        (t.dynasty = { nth: s + 4, rank: a, place: n }), ftRoyalSync(e);
      }
      function ftRoyalSync(e) {
        const t = state.parents.find((e) => "Father" === e.role),
          a = state.parents.find((e) => "Mother" === e.role),
          o = state.family.filter((e) => "sibling" === e.kind && e.royal),
          n = [[e.gp[0], e.gp[1]], [e.gp[2], e.gp[3]], [t, a], ...e.p, ...e.m],
          s = (e) => {
            for (const [t, a] of n) {
              if (t === e) return a;
              if (a === e) return t;
            }
            return e.spouseOf || null;
          };
        for (const n of [...e.p.flat(), ...e.m.flat(), ...e.gp, t, a, ...o]) {
          if (!n || !n.royal) continue;
          const e = n.g || n.gender || "m",
            t = n.royal,
            [a, o] = ftYears(n);
          if (
            (null == t.worth && (t.worth = 1e5 * Math.round((ROY_RANKS[t.rank].pay * rint(18, 90)) / 1e5)),
            !n.anc)
          ) {
            const e = profileOf(n, o - a);
            (e.money = Math.max(e.money, t.worth)), (e.job = "Royalty");
            const r = s(n);
            r &&
              r.royal &&
              (e.marital = r.dead
                ? "Widowed"
                : `Married to ${royWord(r.royal.rank, r.g || r.gender)} ${r.first}`);
          }
          if (!n.famous) {
            const s = royWord(t.rank, e),
              r = t.consort ? `${"monarch" === t.rank ? "Queen" : s} consort of ${t.place}` : t.title,
              i = Math.min(o - 1, a + (t.consort ? rint(20, 30) : rint(24, 44))),
              l = {
                He: "f" === e ? "She" : "He",
                his: "f" === e ? "her" : "his",
                him: "f" === e ? "her" : "him",
              };
            n.famous = {
              t: t.consort ? `${"monarch" === t.rank ? "Queen" : s} Consort` : s,
              ico: "1f451",
              year: i,
              royal: !0,
              stars: "monarch" === t.rank ? 5 : "prince" === t.rank || "duke" === t.rank ? 4 : 3,
              hl: t.founder
                ? `Founded the royal line as the ${t.title}`
                : t.consort
                  ? `Married into the royal family and became ${r}`
                  : `Reigned as the ${t.title}`,
              story: [
                t.founder
                  ? `In ${i}, ${n.first} became the very first ${s} of ${t.place}, founding the dynasty every ${SURNAME} royal descends from.`
                  : t.consort
                    ? `${n.first} married into the royal family and from ${i} reigned beside ${l.his} spouse as ${r}.`
                    : `${n.first} inherited the title in ${i} and reigned as the ${t.title}.`,
                `${l.He} was one of the most recognized people in ${"monarch" === t.rank ? t.place : "the kingdom"}, with ${l.his} portrait on ${"monarch" === t.rank ? "coins, stamps and banknotes" : "the walls of every grand house"}.`,
              ],
              feats: [
                t.consort
                  ? "Royal wedding watched by " + ("monarch" === t.rank ? "the whole nation" : "thousands")
                  : `Crowned in ${i}`,
                `A fortune of ${usd(t.worth)}`,
                "monarch" === t.rank ? "Head of state" : "Member of the nobility",
              ],
              legacy: `${l.His} ${t.consort ? "tiara" : "crown"} is still kept in the family vault.`,
            };
          }
        }
      }
      function ftSetup() {
        if (state.ft) return ftExtend(state.ft), ftRoyalDynasty(state.ft), state.ft;
        const e = state.family.filter((e) => "grandparent" === e.kind),
          t = state.parents.find((e) => "Father" === e.role),
          a = state.parents.find((e) => "Mother" === e.role),
          o = (e[2] || e[3] || {}).last || ulast(),
          n = [0, 1, 2, 3].map((n) => {
            if (e[n]) return e[n];
            const s = n % 2 ? "f" : "m",
              r = ftBornOf(n < 2 ? t : a),
              i = r - rint(22, 36),
              l = ftAnc(s, n < 2 ? SURNAME : o, i, state.country, r);
            return (l.life = Math.max(r - i + 5, state.birthYear - i - rint(1, 12))), l;
          }),
          s = ftLine(n[0], ftBornOf(n[0]), state.country, 3, !0),
          r = ftLine(n[3], ftBornOf(n[3]), state.country, 3, !1);
        (state.ft = { gp: n, p: s, m: r, matLast: o }), ftExtend(state.ft), ftRoyalDynasty(state.ft);
        const i = [...s.flat(), ...r.flat()];
        for (let e = 0; e < 20; e++) {
          const e = any(i),
            t = ftFame(e);
          if (t) {
            e.famous = t;
            break;
          }
        }
        return state.ft;
      }
      const FT_CAVE_NAMES = {
          m: [
            "Ugo",
            "Tor",
            "Grak",
            "Bru",
            "Kael",
            "Rok",
            "Dag",
            "Thog",
            "Oro",
            "Brak",
            "Hun",
            "Zug",
            "Arn",
            "Gor",
          ],
          f: [
            "Ayla",
            "Eki",
            "Nara",
            "Sora",
            "Mira",
            "Una",
            "Lia",
            "Tala",
            "Ena",
            "Iska",
            "Reva",
            "Oma",
            "Kira",
            "Vesa",
          ],
        },
        FT_CAVE_PLACES = [
          "the Dordogne Valley (France)",
          "the Swabian Jura (Germany)",
          "the Altai Mountains (Siberia)",
          "the Zagros Mountains (Iran)",
          "the Great Rift Valley (East Africa)",
          "the Cantabrian coast (Spain)",
          "the Carpathian Mountains (Romania)",
        ];
      function ftCaveCause(e, t) {
        return any(
          e < 3
            ? [
                "a fever in the first winter",
                "an infection",
                "the bitter cold of an Ice Age winter",
                "hunger, in a winter when the reindeer herds never came",
              ]
            : e < 14
              ? [
                  "a wolf attack while gathering berries",
                  "falling from the rocks above the cave",
                  "drowning while fishing in the river",
                  "a fever no herb could cure",
                  "eating poisonous mushrooms",
                  "a viper bite",
                  "a hyena attack near the camp",
                ]
              : e < 40
                ? [
                    "being trampled by a woolly mammoth during a hunt",
                    "a cave bear attack",
                    "a saber-toothed cat ambush",
                    "an infected spear wound",
                    "a fight with a rival clan",
                    "falling through thin ice on the river",
                    "freezing in a blizzard while tracking reindeer",
                    "a rockfall inside the cave",
                    "an infected tooth",
                    "starvation during a harsh winter",
                    "being gored by a woolly rhinoceros",
                    ...("f" === t ? ["complications in childbirth", "complications in childbirth"] : []),
                  ]
                : [
                    "old age (rare for the Stone Age!)",
                    "pneumonia in a long Ice Age winter",
                    "a broken hip that never healed",
                    "a fever in the cold season",
                  ],
        );
      }
      function ftCaveClan() {
        const e =
            any([
              "Bear",
              "River",
              "Wolf",
              "Mammoth",
              "Elk",
              "Raven",
              "Flint",
              "Fire",
              "Cave Lion",
              "Reindeer",
            ]) + " Clan",
          t = any(FT_CAVE_PLACES),
          a = new Set(),
          o = (e) => {
            let t;
            do {
              t = any(FT_CAVE_NAMES[e]);
            } while (a.has(t));
            return a.add(t), t;
          },
          n = (a, n, s) => ({
            anc: !0,
            cave: !0,
            g: a,
            first: o(a),
            last: "",
            clan: e,
            where: t,
            born: n,
            life: s,
          }),
          s = n(any(["m", "f"]), -rint(39e3, 43e3), rint(44, 62)),
          r = n("m", s.born + rint(16, 24), 0),
          i = n("f", r.born + rint(-4, 3), 0),
          l = [],
          c = rint(3, 5);
        let d = i.born + rint(15, 19);
        for (let e = 0; e < c; e++) {
          const e = any(["m", "f"]),
            t = Math.random();
          l.push(
            n(e, d, t < 0.35 ? rint(0, 2) : t < 0.6 ? rint(3, 13) : t < 0.9 ? rint(14, 34) : rint(35, 52)),
          ),
            (d += rint(2, 4));
        }
        const u = l.find((e) => e.life >= 18) || l[0];
        u.life < 18 && (u.life = rint(18, 36)), (u.heir = !0);
        const h = l[l.length - 1].born;
        (r.life = Math.max(h - r.born + 1, chance(0.55) ? rint(24, 39) : rint(40, 56))),
          (i.life = chance(0.3)
            ? h - i.born
            : Math.max(h - i.born + 1, chance(0.6) ? rint(24, 39) : rint(40, 52)));
        for (const e of [s, r, ...l]) e.cause = ftCaveCause(e.life, e.g);
        (i.cause =
          i.born + i.life === h
            ? `complications giving birth to ${l[l.length - 1].first}`
            : ftCaveCause(i.life, "f")),
          (r.spouseOf = i),
          (i.spouseOf = r),
          (r.kidsCount = i.kidsCount = l.length),
          (s.kidsCount = rint(3, 7));
        for (const e of l) e.kidsCount = e.heir ? rint(2, 5) : e.life >= 20 ? rint(0, 3) : 0;
        return { clan: e, where: t, elder: s, dad: r, mom: i, kids: l };
      }
      const ftY = (e) => (e < 0 ? `${(-e).toLocaleString("en-US")} BC` : `${e}`),
        FT_PACK = {
          us: ["united_states"],
          gb: ["england", "scotland"],
          ie: ["ireland"],
          fr: ["france"],
          de: ["germany"],
          it: ["italy"],
          es: ["spain"],
          pt: ["portugal"],
          nl: ["netherlands"],
          se: ["sweden"],
          pl: ["poland"],
          ru: ["russia"],
          gr: ["greece"],
          tr: ["turkiye"],
          in: ["india_north", "india_south"],
          cn: ["china"],
          jp: ["japan"],
          kr: ["korea"],
          vn: ["vietnam"],
          ph: ["philippines"],
          ir: ["iran"],
          eg: ["egypt"],
          ma: ["morocco"],
          ng: ["nigeria_yoruba"],
          et: ["ethiopia"],
          br: ["brazil"],
          mx: ["mexico"],
          ar: ["argentina"],
          ht: ["haiti"],
          cu: ["cuba"],
          id: ["indonesia"],
        },
        FT_PACK_CODE = Object.fromEntries(Object.entries(FT_PACK).flatMap(([e, t]) => t.map((t) => [t, e]))),
        FT_PACK_SLUGS = Object.keys(FT_PACK_CODE),
        FT_FAME_LVL = {
          "town-famous": "Town-famous",
          "regionally famous": "Regionally famous",
          "nationally recognized": "Nationally recognized",
          "internationally known": "Internationally known",
        },
        FT_FAME_ICO = {
          healthcare: "1f489",
          medicine: "1f489",
          commerce: "1f4b0",
          journalism: "1f4f0",
          "food craft": "1f36a",
          agriculture: "1f333",
          horticulture: "1f333",
          "maritime craft": "26f5",
          law: "2696-fe0f",
          education: "1f4d6",
          theater: "1f3ad",
          literature: "1f4d6",
          "public service": "1f3db-fe0f",
          technology: "1f4a1",
          architecture: "1f3db-fe0f",
          exploration: "1f5fa-fe0f",
          music: "1f3bb",
          publishing: "1f4f0",
          science: "1f52c",
          "visual arts": "1f3a8",
          craftsmanship: "1f528",
          scholarship: "1f393",
          engineering: "2699-fe0f",
        },
        ftCap = (e) => (e ? e[0].toUpperCase() + e.slice(1) : e),
        ftPackP = {},
        ftPackLoad = (e) =>
          Promise.all(
            e.map((e) =>
              (window.FT1800 || {})[e]
                ? null
                : (ftPackP[e] ||= new Promise((t) => {
                    const a = document.createElement("script");
                    (a.src = `family1800s/${e}.js`),
                      (a.charset = "utf-8"),
                      (a.onload = a.onerror = () => t()),
                      document.head.append(a);
                  })),
            ),
          );
      function ftPackText(e, t) {
        const a = e.pack;
        return a && t
          ? ((t = t.split(`${a[1]} ${a[2]}`).join(`${e.first} ${e.last}`)),
            "m" === e.g && e.last !== a[2] && (t = t.split(a[2]).join(e.last)),
            t.replace(/\b([Aa]) (?=[aeioAEIO])/g, "$1n "))
          : t;
      }
      function ftPackSlots(e) {
        const t = [];
        return (
          e.gp.forEach((a, o) => {
            a.anc && t.push([a, o < 2 ? e.parentsSrc?.[0] : e.parentsSrc?.[1], null, o < 2 ? "P" : "M"]);
          }),
          [
            [e.p, 0, "P"],
            [e.m, 1, "M"],
          ].forEach(([a, o, n]) =>
            a.forEach((s, r) => {
              const i = r ? a[r - 1][o] : e.gp[o ? 3 : 0],
                l = a[r + 1] || null;
              s.forEach((e) => t.push([e, i, e === s[o] ? l : null, n, s]));
            }),
          ),
          t.filter(([e]) => e.born >= 1800 && e.born <= 1899 && !e.famous)
        );
      }
      function ftPrepare() {
        const e = ftSetup();
        e.parentsSrc = [
          state.parents.find((e) => "Father" === e.role),
          state.parents.find((e) => "Mother" === e.role),
        ];
        const t = ftPackSlots(e).filter(([e]) => !e.pack && !e.packTried);
        return t.length
          ? ((e.packLine ||= {}),
            t.forEach(([t, , , a, o]) => {
              const n = o ? o[0] : t;
              (n.packSlug ??= FT_PACK[n.country]
                ? any(FT_PACK[n.country])
                : (e.packLine[a] ||= any(FT_PACK_SLUGS))),
                (t.packSlug ??= n.packSlug);
            }),
            ftPackLoad([...new Set(t.map(([e]) => e.packSlug))]).then(() => {
              const a = new Set(
                ftPackSlots(e)
                  .filter(([e]) => e.pack)
                  .map(([e]) => e.pack[0]),
              );
              for (const [e, o, n, s, r] of t) {
                e.packTried = !0;
                const t = o ? ftBornOf(o) : e.born + 30,
                  i = (o, n) =>
                    o[3] === e.g &&
                    !a.has(o[0]) &&
                    Math.abs(o[4] - e.born) <= n &&
                    t - o[4] >= 16 &&
                    t - o[4] <= 48 &&
                    o[5] > t;
                let l = (window.FT1800 || {})[e.packSlug] || [],
                  c = l.filter((e) => i(e, 4));
                if ((c.length || (c = l.filter((e) => i(e, 10))), !c.length)) continue;
                const d = any(c);
                a.add(d[0]),
                  (e.pack = d),
                  (e.first = d[1]),
                  (e.born = d[4]),
                  (e.life = d[5] - d[4]),
                  (e.city = d[6]),
                  (e.job = ftCap(d[7])),
                  (e.country = FT_PACK_CODE[e.packSlug] || e.country),
                  delete e.ftInfo,
                  n &&
                    n.forEach((t) => {
                      t.anc && (t.life = Math.max(t.life, e.born - t.born + 1));
                    }),
                  "f" === e.g && (e.maiden = d[2]),
                  "M" === s &&
                    "m" === e.g &&
                    r &&
                    (r.forEach((e) => {
                      e.last = d[2];
                    }),
                    o && o.anc && "f" === o.g && (o.maiden = d[2]));
                const u = o && o.anc ? o.country : state.country;
                e.country !== u ? (e.movedTo = u) : delete e.movedTo,
                  e.milRolled &&
                    (delete e.milRolled,
                    delete e.mil,
                    e.famous && e.famous.milHero && delete e.famous,
                    e.look && (delete e.look.milHat, delete e.look.milScar));
                const h = d[9];
                "nationally recognized" === h || "internationally known" === h
                  ? (e.famous = ftPackFame(e, d))
                  : (e.localFame = { level: h, reason: d[11], year: d[10], cat: d[8] });
              }
              return e;
            }))
          : Promise.resolve(e);
      }
      function ftPackFame(e, t) {
        const a = (t) => ftPackText(e, t);
        return {
          t: ftCap(t[7]),
          ico: FT_FAME_ICO[t[8]] || "2b50",
          year: t[10],
          stars: "internationally known" === t[9] ? 5 : 4,
          pack: !0,
          hl: `${FT_FAME_LVL[t[9]]}: ${ftCap(t[11])}`,
          story: [a(t[16]), a(t[17]), a(t[18])],
          feats: [`${ftCap(t[11])} (${t[10]})`, `${FT_FAME_LVL[t[9]]} in ${t[8]}`, `Left behind ${t[12]}`],
          legacy: a(t[19]),
        };
      }
      setTimeout(() => {
        mods.familyTree &&
          ftPrepare().finally(() => {
            try {
              ftInheritAll(ftSetup(), ftCtx());
            } catch (e) {
              console.warn(e);
            }
          });
      }, 600);
      const LIVES_INDEX = "bitlifepp-lives-index",
        ACTIVE_KEY = "bitlifepp-active";
      let lifeLive = !!PICK;
      if (PICK) {
        state.lifeId = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
        try {
          localStorage.setItem(ACTIVE_KEY, state.lifeId);
        } catch {}
      }
      const livesDb = () =>
          (livesDb.p ||= new Promise((e, t) => {
            // [fix] a hung or blocked IndexedDB open used to leave the game hidden forever: give up after 5 s
            const to = setTimeout(() => {
              livesDb.p = null;
              t(new Error("IndexedDB timeout"));
            }, 5000);
            let a;
            try {
              a = indexedDB.open("bitlifepp", 1);
            } catch (err) {
              clearTimeout(to);
              livesDb.p = null;
              return t(err);
            }
            (a.onupgradeneeded = () => a.result.createObjectStore("lives", { keyPath: "id" })),
              (a.onsuccess = () => (clearTimeout(to), e(a.result))),
              (a.onblocked = () => (clearTimeout(to), (livesDb.p = null), t(new Error("IndexedDB blocked")))),
              (a.onerror = () => (clearTimeout(to), (livesDb.p = null), t(a.error)));
          })),
        dbDo = (e, t) =>
          livesDb().then(
            (a) =>
              new Promise((o, n) => {
                const s = a.transaction("lives", e),
                  r = t(s.objectStore("lives"));
                (s.oncomplete = () => o(r && r.result)), (s.onerror = s.onabort = () => n(s.error));
              }),
          ),
        livesIndex = () => {
          try {
            return JSON.parse(localStorage.getItem(LIVES_INDEX) || "[]");
          } catch {
            return [];
          }
        },
        setLivesIndex = (e) => {
          try {
            localStorage.setItem(LIVES_INDEX, JSON.stringify(e));
          } catch {}
        };
      function lifeCopy(e) {
        const t = new Map(),
          a = { __isState: 1 },
          o = (n) => {
            if (n === state && n !== e) return a;
            if (!n || "object" != typeof n) return "function" == typeof n ? void 0 : n;
            if (n instanceof Node) return;
            if (t.has(n)) return t.get(n);
            if (n instanceof Date) return new Date(n);
            if (n instanceof Set) {
              const e = new Set();
              return t.set(n, e), n.forEach((t) => e.add(o(t))), e;
            }
            if (n instanceof Map) {
              const e = new Map();
              return t.set(n, e), n.forEach((t, a) => e.set(o(a), o(t))), e;
            }
            const s = Array.isArray(n) ? [] : {};
            t.set(n, s);
            for (const e of Object.keys(n)) {
              const t = o(n[e]);
              (void 0 !== t || Array.isArray(n)) && (s[e] = t);
            }
            return s;
          };
        return o(e);
      }
      const lifeSummary = () => ({
        id: state.lifeId,
        first: state.first,
        last: SURNAME,
        g: PG(),
        age: state.age,
        country: state.country,
        look: {
          skin: state.look.skin,
          eyes: state.look.eyes,
          hair: state.look.hair,
          seed: state.look.seed,
          beard: state.look.beard || 0,
        },
        dead: !!state.dead,
        born: state.birthYear,
        money: state.money,
        savedAt: Date.now(),
      });
      let saving = null;
      const lifeSig = () => {
          const e = log.innerHTML;
          let t = 0;
          for (let a = Math.max(0, e.length - 4e3); a < e.length; a++) t = (31 * t + e.charCodeAt(a)) | 0;
          return [
            state.lifeId,
            e.length,
            t,
            state.age,
            state.money,
            state.dead,
            JSON.stringify(state.stats),
            state.job && state.job.t,
            (state.family || []).length,
            (state.props || []).length,
            (state.lovers || []).length,
            (state.metals || []).length,
            state.first,
            state.country,
          ].join("|");
        },
        lastSig = {};
      function saveLife() {
        return !lifeLive ||
          !state.lifeId ||
          window.blTabInactive ||
          (window.blAccount && window.blAccount.locked)
          ? Promise.resolve(!1)
          : (saving = (saving || Promise.resolve())
              .then(() => {
                const e = lifeSig(),
                  t = livesIndex().find((e) => e.id === state.lifeId),
                  a = lifeSummary();
                lastSig[state.lifeId] === e && t && t.savedAt && (a.savedAt = t.savedAt),
                  (lastSig[state.lifeId] = e);
                const o = {
                  id: state.lifeId,
                  state: lifeCopy(state),
                  log: log.innerHTML,
                  mods: { ...mods },
                  modsV: 4,
                  ach: [...achSeen],
                  surname: SURNAME,
                  summary: a,
                };
                return dbDo("readwrite", (e) => e.put(o)).then(() => {
                  const e = livesIndex().filter((e) => e.id !== o.id);
                  return e.unshift(o.summary), setLivesIndex(e), !0;
                });
              })
              .catch((e) => (console.warn("Could not save this life", e), !1)));
      }
      function startNewLife() {
        openNewLifeMenu({ closable: lifeLive && !state.dead });
      }
      (window.blSaveLife = saveLife),
        (window.blLifeStats = () => {
          if (!lifeLive || !state.lifeId || !COUNTRIES[state.country]) return null;
          const [e, t] = COUNTRIES[state.country];
          return {
            life_id: state.lifeId,
            name: `${state.first} ${SURNAME}`,
            country: state.country,
            city: `${state.city || t}, ${e}`,
            age: state.age,
            net_worth: Math.round(netWorth()) || 0,
            children: (state.family || []).filter((e) => "child" === e.kind).length,
            lovers: (state.lovers || []).length + (state.exes || []).length,
          };
        });
      const lookOf = (e) => (e ? { ...e } : null);
      function relationOf(e) {
        return state.parents.includes(e)
          ? "parent"
          : "child" === e.kind
            ? "child"
            : "sibling" === e.kind
              ? "sibling"
              : (state.lovers || []).includes(e) || e === state.spouse
                ? "partner"
                : "other";
      }
      function switchToPerson(e, t, { died: a = !1 } = {}) {
        const o = state.age,
          n = relationOf(e),
          s = `${state.first} ${SURNAME}`,
          r = PG(),
          i = lookOf(state.look),
          l = String(
            e.g ||
              e.gender ||
              e.gLabel ||
              (/Mother|Daughter|Sister|Wife|Grandmother|Aunt/.test(e.role || "") ? "f" : "m"),
          ).toLowerCase(),
          c = /^(f|female|girl|woman|transgender female)$/.test(l) ? "f" : "m",
          d = e.last || SURNAME,
          u = `${e.first} ${d}`,
          h = {
            age: t,
            birthYear: state.birthYear + o - t,
            parents: null,
            sibs: null,
            spouse: null,
            kids: null,
            money: 0,
            intro: [],
            notice: null,
            smarts: e.smarts,
            looks: e.looks,
          },
          p = (e, a) => ({
            g: e.g,
            first: e.first,
            last: e.last || a,
            off: relAge(e) - t,
            look: e.look,
            rel: rint(50, 85),
            job: e.job || (e.prof && e.prof.job),
            edu: e.edu,
            prof: e.prof ? { ...e.prof } : null,
          }),
          m = (e) =>
            [state.spouse, ...(state.lovers || []), ...(state.exes || [])].find(
              (t) => t && `${t.first} ${t.last}` === e,
            ),
          myJob = () =>
            state.job
              ? state.job.t
              : state.age >= 65
                ? "Retired"
                : state.age >= 18
                  ? "Unemployed"
                  : "Student",
          myProf = () => ({
            job: myJob(),
            money: state.money,
            edu: state.edu,
            marital: state.spouse ? "Married" : "Single",
          });
        t >= 18 &&
          (h.friends = Array.from({ length: rint(3, 6) }, () => {
            const e = chance(0.5) ? "m" : "f",
              a = Math.max(18, t + rint(-5, 5));
            return {
              first: uname(e),
              last: ulast(),
              g: e,
              age: a,
              look: randomLook(e, a),
              rel: rint(55, 90),
            };
          }));
        if ("child" === n) {
          const n = m(e.otherParent),
            s = n ? n.g : "f" === r ? "m" : "f",
            [l, ...c] = String(e.otherParent || `${uname(s)} ${ulast()}`).split(" ");
          let d = null;
          try {
            n && ((state.lovers || []).includes(n) || n === state.spouse) && (d = loverAge(n));
          } catch {}
          (h.parents = [
            {
              first: state.first,
              last: SURNAME,
              g: r,
              look: i,
              ageAtBirth: o - t,
              rel: e.rel ?? 80,
              dead: a,
              job: state.job ? state.job.t : null,
              prof: state.job
                ? {
                    job: state.job.t,
                    money: state.money,
                    edu: state.edu,
                    marital: state.spouse ? "Married" : "Single",
                  }
                : null,
            },
            {
              first: l,
              last: c.join(" "),
              g: s,
              look: lookOf(n && n.look),
              ageAtBirth: null != d ? Math.max(16, d - t) : o - t,
              rel: rint(60, 90),
              dead: !(!n || !n.dead),
              job: n && (n.job || (n.prof && n.prof.job)),
              prof: n && n.prof ? { ...n.prof } : null,
            },
          ]),
            (h.sibs = state.family
              .filter((t) => "child" === t.kind && !t.dead && t !== e)
              .map((e) => p(e, SURNAME))),
            (h.parents[0].past = pastLifeOf(a)),
            (h.parents[0].job = h.parents[0].past.job),
            (h.grand = state.parents.map((e) => ({
              first: e.first,
              last: SURNAME,
              g: e.gender,
              look: lookOf(e.look),
              age: e.ageAtBirth + o,
              rel: e.rel ?? 60,
              dead: !!e.dead,
              diedAgo: e.dead ? o - (e.diedAt ?? o) : 0,
              job: e.job || (e.prof && e.prof.job),
              edu: e.edu,
              prof: e.prof ? { ...e.prof } : null,
            }))),
            (h.aunts = state.family
              .filter((e) => "sibling" === e.kind)
              .map((e) => ({
                first: e.first,
                last: e.last || SURNAME,
                g: e.g,
                look: lookOf(e.look),
                age: relAge(e),
                rel: rint(40, 75),
                dead: !!e.dead,
                diedAgo: e.dead ? o - (e.diedAt ?? o) : 0,
                job: e.job || (e.prof && e.prof.job),
                edu: e.edu,
                prof: e.prof ? { ...e.prof } : null,
              }))),
            (h.cousins = state.family
              .filter((e) => ["cousin", "cousinkid", "nibling"].includes(e.kind))
              .map((e) => ({
                first: e.first,
                last: e.last || SURNAME,
                g: e.g || e.gender,
                look: lookOf(e.look),
                age: relAge(e),
                rel: e.rel ?? 50,
                dead: !!e.dead,
                diedAgo: e.dead ? o - (e.diedAt ?? o) : 0,
                job: e.job || (e.prof && e.prof.job),
                edu: e.edu,
                prof: e.prof ? { ...e.prof } : null,
              })));
        } else if ("sibling" === n)
          (h.parents = state.parents.map((e) => ({
            first: e.first,
            last: SURNAME,
            g: e.gender,
            look: lookOf(e.look),
            ageAtBirth: e.ageAtBirth + o - t,
            rel: e.rel,
            dead: !!e.dead,
            diedAgo: e.dead ? o - (e.diedAt ?? o) : 0,
            job: e.job || (e.prof && e.prof.job),
            edu: e.edu,
            prof: e.prof ? { ...e.prof } : null,
          }))),
            (h.sibs = [
              {
                g: r,
                first: state.first,
                last: SURNAME,
                off: o - t,
                look: i,
                rel: e.rel ?? 60,
                job: myJob(),
              },
              ...state.family
                .filter((t) => "sibling" === t.kind && !t.dead && t !== e)
                .map((e) => p(e, SURNAME)),
            ]),
            (h.grand = state.family
              .filter((e) => "grandparent" === e.kind)
              .map((e) => ({
                first: e.first,
                last: e.last || SURNAME,
                g: e.g || e.gender,
                look: lookOf(e.look),
                age: relAge(e),
                rel: e.rel ?? 55,
                dead: !!e.dead,
                diedAgo: e.dead ? o - (e.diedAt ?? o) : 0,
                job: e.job || (e.prof && e.prof.job),
                edu: e.edu,
                prof: e.prof ? { ...e.prof } : null,
              }))),
            (h.aunts = state.family
              .filter((e) => "auntuncle" === e.kind)
              .map((e) => ({
                first: e.first,
                last: e.last || SURNAME,
                g: e.g || e.gender,
                look: lookOf(e.look),
                age: relAge(e),
                rel: e.rel ?? 50,
                dead: !!e.dead,
                diedAgo: e.dead ? o - (e.diedAt ?? o) : 0,
                job: e.job || (e.prof && e.prof.job),
                edu: e.edu,
                prof: e.prof ? { ...e.prof } : null,
              }))),
            (h.cousins = state.family
              .filter((e) => ["cousin", "cousinkid"].includes(e.kind))
              .map((e) => ({
                first: e.first,
                last: e.last || SURNAME,
                g: e.g || e.gender,
                look: lookOf(e.look),
                age: relAge(e),
                rel: e.rel ?? 50,
                dead: !!e.dead,
                diedAgo: e.dead ? o - (e.diedAt ?? o) : 0,
                job: e.job || (e.prof && e.prof.job),
                edu: e.edu,
                prof: e.prof ? { ...e.prof } : null,
              }))),
            (h.nibs = state.family
              .filter((e) => "nibling" === e.kind)
              .map((e) => ({
                first: e.first,
                last: e.last || SURNAME,
                g: e.g || e.gender,
                look: lookOf(e.look),
                age: relAge(e),
                rel: e.rel ?? 50,
                dead: !!e.dead,
                diedAgo: e.dead ? o - (e.diedAt ?? o) : 0,
                job: e.job || (e.prof && e.prof.job),
                edu: e.edu,
                prof: e.prof ? { ...e.prof } : null,
              })));
        else if ("parent" === n) {
          const a = state.family.filter((e) => "grandparent" === e.kind),
            n =
              "Father" === e.role ? a.filter((e) => e.last === SURNAME) : a.filter((e) => e.last !== SURNAME);
          n.length &&
            (h.parents = n
              .slice(0, 2)
              .map((e) => ({
                first: e.first,
                last: e.last,
                g: e.g,
                look: lookOf(e.look),
                ageAtBirth: Math.max(16, relAge(e) - t),
                rel: e.rel ?? 60,
                dead: !!e.dead,
                diedAgo: e.dead ? o - (e.diedAt ?? o) : 0,
                job: e.job || (e.prof && e.prof.job),
                edu: e.edu,
                prof: e.prof ? { ...e.prof } : null,
              })));
          const s = state.parents.find((t) => t !== e),
            l = state.pm && "divorced" === state.pm.status;
          !s ||
            s.dead ||
            l ||
            (h.spouse = {
              first: s.first,
              last: SURNAME,
              g: s.gender,
              look: lookOf(s.look),
              age: s.ageAtBirth + o,
              rel: rint(55, 90),
              married: !0,
              job: s.job || (s.prof && s.prof.job),
              edu: s.edu,
              prof: s.prof ? { ...s.prof } : null,
            });
          const c = s ? `${s.first} ${SURNAME}` : "";
          h.kids = [
            {
              g: r,
              first: state.first,
              last: SURNAME,
              age: o,
              look: i,
              rel: e.rel ?? 70,
              otherParent: c,
              job: myJob(),
            },
            ...state.family
              .filter((e) => "sibling" === e.kind && !e.dead)
              .map((e) => ({
                g: e.g,
                first: e.first,
                last: e.last || SURNAME,
                age: relAge(e),
                look: e.look,
                rel: e.rel ?? 70,
                otherParent: c,
                job: e.job || (e.prof && e.prof.job),
                edu: e.edu,
                prof: e.prof ? { ...e.prof } : null,
              })),
          ],
            (h.sibs = state.family
              .filter((e) => "auntuncle" === e.kind && !e.dead)
              .map((e) => ({
                g: e.g || e.gender,
                first: e.first,
                last: e.last || SURNAME,
                off: relAge(e) - t,
                look: e.look,
                rel: e.rel ?? 50,
                job: e.job || (e.prof && e.prof.job),
                edu: e.edu,
                prof: e.prof ? { ...e.prof } : null,
              })));
        } else
          "partner" === n &&
            ((h.spouse = {
              first: state.first,
              last: SURNAME,
              g: r,
              look: i,
              age: o,
              rel: e.rel ?? 60,
              married: !!e.married,
              job: myJob(),
              prof: myProf(),
            }),
            (h.kids = state.family
              .filter((e) => "child" === e.kind && !e.dead && e.otherParent === u)
              .map((e) => ({
                g: e.g,
                first: e.first,
                last: e.last,
                age: relAge(e),
                look: e.look,
                rel: rint(60, 95),
                otherParent: s,
                job: e.job || (e.prof && e.prof.job),
                edu: e.edu,
                prof: e.prof ? { ...e.prof } : null,
              }))));
        if (t >= 18 && !a)
          try {
            h.money = Math.max(0, Math.round(profileOf(e, t).money || e.money || 0));
          } catch {
            h.money = Math.max(0, e.money || 0);
          }
        const f = (e) =>
            e && e.royal && !e.royal.abdicated && ROY_RANKS[e.royal.rank]
              ? { rank: e.royal.rank, title: e.royal.title || null }
              : null,
          g =
            state.royal && !state.royal.abdicated && ROY_RANKS[state.royal.rank]
              ? { rank: state.royal.rank, title: state.royal.title }
              : null,
          y = (e) => (e ? { rank: "monarch" === e.rank ? "prince" : e.rank, title: null } : null),
          b = (e, t) => (t && e && (e === state.spouse || e.married) ? { rank: t.rank, title: null } : null);
        if ("child" === n) {
          const t = m(e.otherParent);
          (h.parents[0].royal = g),
            (h.parents[1].royal = f(t) || b(t, g)),
            h.sibs.forEach((t, a) => {
              const o = state.family.filter((t) => "child" === t.kind && !t.dead && t !== e)[a];
              t.royal = f(o) || y(g);
            }),
            (h.royal = f(e) || y(g));
        } else if ("sibling" === n)
          h.parents.forEach((e, t) => {
            e.royal = f(state.parents[t]);
          }),
            (h.sibs[0].royal = g),
            h.sibs.slice(1).forEach((t, a) => {
              t.royal = f(state.family.filter((t) => "sibling" === t.kind && !t.dead && t !== e)[a]);
            }),
            (h.royal = f(e) || y(g));
        else if ("parent" === n) {
          const t = state.family.filter((e) => "grandparent" === e.kind),
            a =
              "Father" === e.role ? t.filter((e) => e.last === SURNAME) : t.filter((e) => e.last !== SURNAME);
          h.parents &&
            h.parents.forEach((e, t) => {
              e.royal = f(a[t]);
            }),
            h.spouse && (h.spouse.royal = f(state.parents.find((t) => t !== e))),
            (h.kids[0].royal = g),
            h.kids.slice(1).forEach((e, t) => {
              e.royal = f(state.family.filter((e) => "sibling" === e.kind && !e.dead)[t]);
            }),
            (h.royal = f(e));
        } else
          "partner" === n
            ? ((h.spouse.royal = g),
              h.kids.forEach((e, t) => {
                e.royal = f(
                  state.family.filter((e) => "child" === e.kind && !e.dead && e.otherParent === u)[t],
                );
              }),
              (h.royal = f(e) || b(e, g)))
            : (h.royal = f(e));
        const v = e.look && e.look.npcAcc;
        if (
          (v &&
            (h.acc = {
              eyewear: v.eyewear || null,
              headwear: v.headwear || null,
              mask: v.mask || null,
              scar: v.scar || null,
              patch: v.patch || null,
            }),
          e.look && e.look.faceTat && (h.faceTat = e.look.faceTat),
          e.celeb && (h.celeb = { ...e.celeb }),
          a)
        ) {
          const e = "f" === r ? "mother" : "father",
            plan = state.willPlan,
            split = !!plan && "split" === plan.mode,
            heirIndex = split ? (plan.heirs || []).indexOf(u) : -1,
            heir = plan
              ? "split" === plan.mode
                ? heirIndex >= 0
                : "one" === plan.mode
                  ? plan.name === u
                  : !1
              : !!state.will && state.will.replace(/ \(.*\)$/, "") === u,
            inheritsAssets = heir || (!plan && !state.will),
            propValue = (state.props || []).reduce(
              (e, t) => e + Math.round(t.price * (0.8 + t.cond / 250)),
              0,
            ),
            splitCount = split ? Math.max(1, (plan.heirs || []).length) : 1,
            share = split
              ? Math.round(Math.max(0, netWorth() - propValue) / splitCount)
              : Math.max(0, Math.round(netWorth()));
          (h.money = heir ? share : 0),
            (h.grief = !0),
            addictions().includes("alcohol") && (h.alcParent = state.first);
          const a = ((state.mine || {}).caves || []).filter((e) => e.claim);
          inheritsAssets && (state.ore || []).length && (h.ore = state.ore),
            inheritsAssets && a.length && (h.claims = a.map((e) => ({ ...e, workers: 0 }))),
            inheritsAssets && state.farm && (h.farm = { ...state.farm, hands: 0 }),
            inheritsAssets && (state.metals || []).length && (h.metals = state.metals),
            inheritsAssets &&
              (state.biz || []).length &&
              (h.biz = state.biz.map((e) => ({ ...e, over: null }))),
            inheritsAssets &&
              ((state.invent || {}).patents || []).length &&
              (h.patents = state.invent.patents);
          const o = (state.props || []).filter((e) => e.old && !e.royal);
          o.length && inheritsAssets &&
            ((h.homes = (split ? o.filter((e, t) => t % splitCount === heirIndex) : o).map((e) => ({
              ...e,
              forSale: null,
            }))),
            (split || !heir) ||
              (h.money = Math.max(
                0,
                h.money - o.reduce((e, t) => e + Math.round(t.price * (0.8 + t.cond / 250)), 0),
              ))),
            (h.intro = [
              `My ${e}, ${s}, passed away. I'm carrying on the family story.`,
              h.money
                ? `I inherited ${usd(h.money)} from my ${e}'s will.`
                : plan
                  ? `My ${e}'s will left everything to ${plan.label}.`
                  : state.will
                    ? `My ${e}'s will left me nothing.`
                    : `My ${e} never wrote a will, so I didn't inherit any${h.ore || h.claims || h.homes || h.farm || h.metals || h.biz || h.patents ? " money" : "thing"}.`,
              ...(h.ore || h.claims
                ? [
                    `The family's ${[h.ore ? "ore and minerals" : "", h.claims ? "mining claim" + (h.claims.length > 1 ? "s" : "") : ""].filter(Boolean).join(" and ")} passed down to me.`,
                  ]
                : []),
              ...(h.farm ? [`I inherited the family farm, ${h.farm.name}.`] : []),
              ...(h.metals ? ["I inherited the family's gold and silver."] : []),
              ...(h.biz
                ? [
                    `I inherited the family business${h.biz.length > 1 ? "es" : ""}: ${h.biz.map((e) => e.name).join(", ")}.`,
                  ]
                : []),
              ...(h.patents
                ? [
                    `I inherited the family's patent${h.patents.length > 1 ? "s" : ""} and the royalties that come with ${h.patents.length > 1 ? "them" : "it"}.`,
                  ]
                : []),
              ...(h.homes
                ? [
                    `I inherited the family ${h.homes.length > 1 ? `homes: ${h.homes.map((e) => `the ${e.name.toLowerCase()}`).join(", ")}` : `${h.homes[0].name.toLowerCase()} at ${h.homes[0].addr}`}.`,
                  ]
                : []),
            ]),
            (h.notice = [
              "A new chapter",
              `You are now ${u}, the ${"f" === c ? "daughter" : "son"} of ${s}.<br><br>` +
                (h.money
                  ? `Your ${e} left you ${usd(h.money)} in the will!`
                  : plan
                    ? `Your ${e}'s will left everything to ${plan.label}.`
                    : state.will
                      ? `Your ${e}'s will left you nothing.`
                      : `Your ${e} didn't write a will, so you didn't inherit anything.`),
            ]);
        } else {
          const t = {
            parent: "f" === c ? "mother" : "father",
            child: "f" === c ? "daughter" : "son",
            sibling: "f" === c ? "sister" : "brother",
            partner: e.married ? ("f" === c ? "wife" : "husband") : "partner",
          }[n];
          (h.intro = [
            t
              ? `I switched lives from ${s}, my ${{ parent: "f" === c ? "daughter" : "son", child: "f" === r ? "mother" : "father", sibling: "f" === r ? "sister" : "brother", partner: e.married ? ("f" === r ? "wife" : "husband") : "partner" }[n]}.`
              : "I'm living a brand new life.",
          ]),
            (h.notice = [
              "Switched lives",
              `You are now ${u}${t ? `, ${s}'s ${t}` : ""}.<br><br>${s}'s life was saved. You can switch back any time from My Lives.`,
            ]);
        }
        const w = {
          g: c,
          first: e.first,
          last: d,
          look: lookOf(e.look),
          genes: Array.isArray(state.genes) ? state.genes.slice() : null,
          genesNone: Array.isArray(state.genes) && !state.genes.length,
          species: state.species,
          birthYear: state.birthYear + o - t,
          stats: { Smarts: e.smarts, Looks: e.looks },
          country: state.country,
          city: state.city,
          heir: h,
          era: isOldEra() && h.birthYear < 1900 ? "1800s" : null,
          sexuality:
            { Gay: "Gay", Lesbian: "Gay", Bisexual: "Bisexual", Pansexual: "Bisexual", Queer: "Bisexual" }[
              e.sexuality
            ] || "Straight",
        };
        try {
          localStorage.setItem("bitlifepp-pick", JSON.stringify(w)), localStorage.removeItem(ACTIVE_KEY);
        } catch {}
        lifeLoading(() => saveLife().then(blReload, blReload));
      }
      function pastLifeOf(e) {
        const t = state.age,
          a = PG(),
          o = state.first,
          n = "f" === a ? "her" : "his",
          s = "f" === a ? "her" : "him",
          r = "f" === a ? "she" : "he",
          i = [...log.querySelectorAll(".year > p")]
            .map((e) => e.textContent.trim())
            .filter((e) => /^I\b/.test(e)),
          l =
            /\b(graduated|got (a|my) (job|degree|diploma)|was hired|got hired|promoted|got married|married|divorced|had a (baby|son|daughter)|gave birth|became a (father|mother|grand)|bought (a|my) (house|home|car|mansion)|won |became famous|famous|was arrested|was sentenced|got out of prison|released from prison|retired|enlisted|joined the|started (a|my) (business|company)|moved to|inherited|was cast|award|elected|adopted|founded)\b/i,
          c = i.filter((e) => l.test(e) && e.length < 160),
          d = c.length <= 6 ? c : [...c.slice(0, 3), ...c.slice(-3)],
          u = [...i]
            .reverse()
            .map((e) =>
              e.match(
                /\b(?:got a job as|was hired as|started working as|became) (?:an? )?([A-Z][^.,!]{2,40})/,
              ),
            )
            .find(Boolean),
          h = state.job ? state.job.t : u ? u[1] : t >= 65 ? "Retired" : t >= 18 ? "Unemployed" : "Student";
        let p = 0;
        try {
          p = Math.round(netWorth());
        } catch {
          p = state.money || 0;
        }
        return {
          born: state.birthYear,
          died: e ? state.birthYear + t : null,
          age: t,
          city: state.city || (COUNTRIES[state.country] || [, ""])[1],
          country: state.country,
          job: h,
          cause: (e && state.deathCause) || null,
          kids: state.family.filter((e) => "child" === e.kind).length,
          spouse: state.spouse ? `${state.spouse.first} ${state.spouse.last}` : null,
          worth: p,
          famous: !!(state.art && state.art.fameOn && state.art.fame >= 30),
          record: state.record || 0,
          story: d.map((e) =>
            e
              .replace(/^I\b/, o)
              .replace(/\bI'm\b/g, `${r}'s`)
              .replace(/\bI\b/g, r)
              .replace(/\bmyself\b/gi, `${s}self`)
              .replace(/\bmy\b/gi, n)
              .replace(/\bme\b/g, s)
              .replace(/\bmine\b/gi, `${n}s`),
          ),
        };
      }
      const continueAsHeir = (e) => switchToPerson(e, Math.max(0, relAge(e)), { died: !0 }),
        confirmSwitch = (e, t) =>
          iosConfirm(
            "Switch Lives",
            `Leave this life and play as ${e.first} ${e.last || SURNAME} (age ${t})? This life is saved first.`,
            () => {
              evWrap.classList.remove("open"), screen.classList.remove("open"), switchToPerson(e, t);
            },
          ),
        switchRow = (e) =>
          `<div class="row sm" data-a="switch"><img src="night/switch.png"><div class="t"><b>Switch Lives</b><span>Play as ${e}</span></div>${DOTS}</div>`,
        NL_COLS = ["green", "yellow", "orange", "red", "purple", "blue"],
        NL_SLIDE = 450,
        NL_SKIN = [
          "#fde3cc",
          "#ffdad5",
          "#efcfb8",
          "#e9cba9",
          "#f0c895",
          "#f0c189",
          "#e7bc91",
          "#edbf84",
          "#d09e7e",
          "#cc9764",
          "#ab8b65",
          "#b86c4e",
          "#9c6941",
          "#8f5c37",
          "#874f2e",
          "#7e4a21",
          "#6c401a",
          "#5f4028",
          "#463221",
        ],
        NL_EYES = [
          "#7397a1",
          "#487ca1",
          "#1f6fa1",
          "#0000e3",
          "#80a286",
          "#64a16f",
          "#498e56",
          "#05a200",
          "#916844",
          "#885c35",
          "#744a25",
          "#d40101",
          "#a801ab",
          "#ffa501",
          "#808080",
          "#1c0101",
        ],
        NL_HAIR = [
          "#1c1a1a",
          "#2a201b",
          "#3b2416",
          "#5b3a22",
          "#6b4226",
          "#8a5a2c",
          "#a8471f",
          "#c4602a",
          "#d99a6c",
          "#d8b26a",
          "#e2c27a",
          "#ece4cf",
          "#9a9a9a",
          "#f2f2f2",
        ],
        NL_ATTRS = [
          "Discipline",
          "Fertility",
          "Happiness",
          "Health",
          "Mental Health",
          "Insanity",
          "Karma",
          "Looks",
          "Sexuality",
          "Smarts",
          "Willpower",
        ],
        sexualityOf = (e) => (e <= 33 ? "Straight" : e <= 66 ? "Bisexual" : "Gay");
      function openNewLifeMenu({ closable: e = !0, edit: t = null } = {}) {
        document.getElementById("nlm")?.remove();
        const a = document.querySelector(".phone"),
          o = document.createElement("div");
        (o.id = "nlm"),
          a.append(o),
          (o.style.opacity = 0),
          o.offsetWidth,
          (o.style.transition = "opacity .25s"),
          (o.style.opacity = 1);
        const n = () => {
            if (t) return o.remove();
            (o.style.opacity = 0), setTimeout(() => o.remove(), 250);
          },
          s = (e) => {
            const t = randomLook(e, 25);
            return (t.beard = 0), (t.accRoll = t.hatRoll = 1), t;
          },
          r = chance(0.5) ? "m" : "f",
          i = (e) => {
            const t = (window.CITIES && CITIES[e]) || [COUNTRIES[e][1]];
            return t[Math.floor(Math.random() * t.length)];
          },
          l = (() => {
            try {
              return localStorage.getItem("bitlifepp-spawn");
            } catch {
              return null;
            }
          })(),
          c =
            l && COUNTRIES[l]
              ? l
              : Object.keys(COUNTRIES)[Math.floor(Math.random() * Object.keys(COUNTRIES).length)],
          d = {
            g: r,
            first: uname(r, c),
            last: ulast(c),
            look: s(r),
            genes: [],
            species: "human",
            nkRuling: !1,
            country: c,
            city: i(c),
            talent: null,
            attrs: null,
            royal: null,
          },
          u = t;
        u &&
          (o.classList.add("nl-edit"),
          Object.assign(d, {
            g: u.g,
            first: u.p.first,
            last: u.last,
            attrs: { ...u.attrs },
            look: { ...u.p.look, wantBeard: u.p.look.beard || 0, accRoll: 1, hatRoll: 1 },
          }));
        const h = (e) =>
            String(e || "")
              .replace(/[<>"&]/g, "")
              .trim()
              .slice(0, 24),
          p = (e) => `<img class="nl-ico" src="${e}" alt="">`,
          m = (e) => String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;"),
          f = () => `<button class="nl-back" data-back>${BACK_ICON}</button>`,
          g = (e, t, a = "emoji/26a1.png") => `<div class="nl-head"><h2>${p(a)}${e}</h2><p>${t}</p></div>`,
          y = (e, t, a) => `<button class="nl-btn c-${t}" ${e}>${a}</button>`;
        let b = null;
        const v = (e, a, s = 0) => {
            t && s < 0 && (s = 0);
            const r = document.createElement("div");
            (r.className = "nl-page"), (r.innerHTML = e);
            const i = b;
            if (((b = r), i && s))
              (r.style.transform = `translateX(${s > 0 ? 100 : -100}%)`),
                o.append(r),
                r.offsetWidth,
                (r.style.transform = ""),
                (i.style.transform = `translateX(${s > 0 ? -100 : 100}%)`),
                (i.style.pointerEvents = "none"),
                setTimeout(() => i.remove(), NL_SLIDE);
            else {
              const e = i ? i.scrollTop : 0;
              i?.remove(), o.append(r), s || (r.scrollTop = e);
            }
            const l = r.querySelector("[data-back]");
            l &&
              (l.onclick = () => {
                play("choice"), a(-1);
              });
            const c = r.querySelector("[data-close]");
            return (
              c &&
                (c.onclick = () => {
                  play("dismiss"), n();
                }),
              r
            );
          },
          w = (e, t) =>
            b.querySelectorAll(e).forEach((e) =>
              e.addEventListener("click", () => {
                play("choice"), t(e);
              }),
            ),
          k = (e = {}) => {
            const t = d.attrs,
              a = d.look,
              o = {
                g: d.g,
                first: d.first,
                last: d.last,
                look: {
                  skin: a.skin,
                  eyes: a.eyes,
                  hair: a.hair,
                  seed: a.seed,
                  hairCut: a.hairCut,
                  brow: a.brow,
                  wantBeard: a.wantBeard,
                  eye2: a.eye2,
                  xHair: a.xHair || null,
                  tats: a.tats || null,
                  scar: a.scar || 0,
                  patch: a.patch || 0,
                },
                genes: d.genes,
                genesNone: !!mods.birthTraits && !d.genes.length,
                country: d.country,
                city: d.city,
                talent: d.talent,
                species: d.species || "human",
                nkRuling: "kp" === d.country && !!d.nkRuling,
                birthYear: d.year || null,
                stats: t
                  ? { Happiness: t.Happiness, Health: t.Health, Smarts: t.Smarts, Looks: t.Looks }
                  : null,
                attrs: t
                  ? {
                      Discipline: t.Discipline,
                      Fertility: t.Fertility,
                      Karma: t.Karma,
                      Willpower: t.Willpower,
                    }
                  : null,
                mind:
                  t && null != t["Mental Health"] ? { mh: t["Mental Health"], ins: t.Insanity ?? 0 } : null,
                sexuality: t ? sexualityOf(t.Sexuality) : null,
                royal: ROYAL_LANDS.includes(d.country) ? d.royal : null,
                era: d.era || null,
                ...e,
              };
            o.lookMods = ["hairPack", ...TAT_GANGS.map((e) => e.mod)].filter((e) => mods[e]);
            const n = () => {
              try {
                localStorage.setItem("bitlifepp-pick", JSON.stringify(o)),
                  localStorage.removeItem(ACTIVE_KEY);
              } catch {}
              blReload();
            };
            lifeLoading(() => saveLife().then(n, n));
          },
          $ = (e, t, a) =>
            `<button class="nl-btn ${"f" === d.g ? "c-pink" : "c-blue"} nl-two" data-go="${e}"><b>${t}</b><small>${a}</small></button>`,
          S = '<img class="nl-god" src="newlife/godmode.png" alt="God Mode">',
          x = (t = 0) => {
            if (u)
              return ((e = 0) => {
                const t = "f" === u.g ? "her" : "his",
                  a = u.age,
                  o = '<img class="nl-ico nl-bolt" src="rel/godmode-bolt.png" alt="">',
                  s = v(
                    `<button class="nl-back nl-x" data-close>${X_ICON}</button>\n        ${g("God Mode", `Edit your ${m(u.role.toLowerCase())}, a ${a}-year old ${"f" === u.g ? "female" : "male"}.`)}\n        ${$("name", `<i class="nl-face"></i>${m(d.first)}${d.last ? " " + m(d.last) : ""}`, "Name")}\n        ${y('data-go="look"', "yellow", `${o}Edit ${t} appearance`)}\n        ${y('data-go="attrs"', "yellow", `${o}Edit ${t} attributes`)}\n        ${y('data-go="save"', "green nl-save nl-end", "Save")}`,
                    null,
                    e,
                  ),
                  { wantBeard: r, accRoll: i, hatRoll: l, ...c } = d.look;
                s
                  .querySelector(".nl-face")
                  .replaceWith(
                    npcFace(
                      {
                        ...c,
                        accRoll: u.p.look.accRoll ?? 1,
                        hatRoll: u.p.look.hatRoll ?? 1,
                        beard: ("m" === u.g && r) || 0,
                      },
                      u.g,
                      a,
                      moodOf(u.p.rel ?? 100),
                      "nl-face",
                    ),
                  ),
                  w("[data-go]", (e) => {
                    const t = e.dataset.go;
                    if ("save" === t) return u.save(d), n();
                    ({ name: R, look: E, attrs: H })[t](1);
                  });
              })(t);
            mods.birthTraits || (d.genes = []);
            const a = d.genes.length
              ? 1 === d.genes.length
                ? BT[d.genes[0]].name
                : `${d.genes.length} traits`
              : "None";
            v(
              `${e ? `<button class="nl-back nl-x" data-close>${X_ICON}</button>` : ""}\n        <button class="nl-reroll" data-reroll aria-label="Random name"></button>\n        ${g("New Life", "Start a new life!", "splash/seedling.png")}\n        ${y('data-go="start"', "green", `Start ${m(d.first)}'s life!`)}\n        <button class="nl-btn nl-million" data-go="million">Start with $1,000,000!</button>\n        <button class="nl-btn nl-million nl-famous" data-go="famous"><img src="freelife/apple/2b50.png" alt="">Start famous</button>\n        <hr class="nl-line">\n        ${$("name", `${m(d.first)} ${m(d.last)}`, "Name")}\n        ${$("gender", `<span class="nl-sym">${"f" === d.g ? "&#9792;" : "&#9794;"}</span>${"f" === d.g ? "Female" : "Male"}`, "Gender")}\n        ${$("species", d.species && "human" !== d.species ? `${d.species} Hybrid` : "Human", "Species")}\n        ${$("country", `${p(`flags/${d.country}.png`)}${m(COUNTRIES[d.country][0])}`, "Country")}\n        ${$("city", `${p(`flags/${d.country}.png`)}${m(d.city)}`, "City")}\n        ${$("year", `${p(d.year && d.year < 1900 ? "emoji/1f3a9.png" : "emoji/1f4c5.png")}${d.year || "Random"}`, "Birth Year")}\n        ${ROYAL_LANDS.includes(d.country) ? `<button class="nl-btn c-purple nl-two" data-go="royal"><b>${p(d.royal ? ROY_RANKS[d.royal].ico : "royal/broom.png")}${d.royal ? royWord(d.royal, d.g) : "Commoner"}<img class="nl-god nl-god-w" src="royal/godmode.png" alt="God Mode"></b><small>Royal Status</small></button>` : ""}
        ${"kp" === d.country ? y('data-go="nkfam"', "purple", d.nkRuling ? "Child of the Leader" : "Ordinary Citizen") : ""}\n        ${mods.birthTraits ? y('data-go="genes"', "yellow", `${p("emoji/1f9e0.png")}Genetic trait: ${m(a)}`) : ""}\n        ${y('data-go="talent"', "orange", d.talent ? `${p(TALENTS[d.talent].ico)}${TALENTS[d.talent].name}` : "Select your special talent")}\n        ${y('data-go="look"', "yellow", `${S}Select your appearance`)}\n        ${y('data-go="attrs"', "yellow", `${S}Select your attributes`)}`,
              null,
              t,
            );
            const o = {
              start: () => k(),
              million: () => k({ money: 1e6 }),
              famous: () => k({ famous: !0 }),
              genes: I,
              country: T,
              city: (e) => A(d.country, e),
              talent: L,
              look: E,
              attrs: H,
              name: R,
              gender: B,
              species: SP,
              nkfam: NKFAM,
              royal: M,
              year: C,
            };
            w("[data-go]", (e) => {
              const t = e.dataset.go;
              "start" === t || "million" === t || "famous" === t ? o[t]() : o[t](1);
            }),
              w("[data-reroll]", () => {
                (() => {
                  const e = Object.keys(COUNTRIES);
                  (d.g = chance(0.5) ? "m" : "f"),
                    (d.country = e[Math.floor(Math.random() * e.length)]),
                    (d.city = i(d.country)),
                    (d.first = uname(d.g, d.country)),
                    (d.last = ulast(d.country)),
                    (d.typed = !1),
                    (d.look = s(d.g)),
                    (d.attrs = Object.fromEntries(
                      NL_ATTRS.map((e) => [
                        e,
                        "Sexuality" === e ? rint(0, 33) : "Insanity" === e ? rint(0, 15) : rint(5, 100),
                      ]),
                    )),
                    (d.talent = null),
                    (d.year = d.era = null),
                    (d.royal = null);
                })(),
                  x();
              });
          },
          C = (e = 0) => {
            const t = v(
              `${f()}<div class="nl-panel">${g("Birth Year", "Pick the year you're born (1800-1899 or 1980-2026)!", "emoji/1f4c5.png")}\n        <div class="nl-form"><label>Birth Year</label><input id="nlYear" type="number" inputmode="numeric" min="1800" max="2026" placeholder="Random" value="${d.year || ""}"></div></div>\n        ${y('data-y="save"', "green nl-save", "Save")}${y('data-y="random"', "yellow", `${p("emoji/1f3b2.png")}Random year`)}`,
              x,
              e,
            );
            w("[data-y]", (e) => {
              if ("random" === e.dataset.y) return (d.year = d.era = null), x(-1);
              let a = parseInt(t.querySelector("#nlYear").value, 10);
              Number.isFinite(a) &&
                ((a = Math.max(1800, Math.min(2026, a))),
                a >= 1900 && a < 1980 && (a = a < 1940 ? 1899 : 1980)),
                (d.year = Number.isFinite(a) ? a : null),
                (d.era = d.year && d.year < 1900 ? "1800s" : null),
                x(-1);
            });
          },
          I = (e = 0) => {
            const t = new Set(d.genes),
              a = (e) => {
                v(
                  `${f()}${g("Genetic Traits", "Pick as many as you want!")}\n        ${y('data-g="random"', "yellow", `${p("stat-emoji/face-smile.png")}None${t.size ? "" : '<img class="nl-ck" src="emoji/2705.png" alt="">'}`)}` +
                    BIRTH_TRAITS.map((e, a) =>
                      y(
                        `data-g="${e.id}"`,
                        NL_COLS[(a + 1) % NL_COLS.length],
                        `${p(btIcon(e.id))}${e.name}${t.has(e.id) ? '<img class="nl-ck" src="emoji/2705.png" alt="">' : ""}`,
                      ),
                    ).join("") +
                    y('data-g="save"', "green", "Save"),
                  x,
                  e,
                ),
                  w("[data-g]", (e) => {
                    const o = e.dataset.g;
                    if ("save" === o) return (d.genes = [...t]), x(-1);
                    "random" === o ? t.clear() : t.has(o) ? t.delete(o) : t.add(o), a(0);
                  });
              };
            a(e);
          },
          T = (e = 0) => {
            const t = Object.keys(COUNTRIES).sort((e, t) => COUNTRIES[e][0].localeCompare(COUNTRIES[t][0]));
            v(
              `${f()}${g("Country", "Pick your country!")}` +
                t
                  .map((e, t) =>
                    y(
                      `data-c="${e}"`,
                      NL_COLS[t % NL_COLS.length],
                      `${p(`flags/${e}.png`)}${COUNTRIES[e][0]}`,
                    ),
                  )
                  .join(""),
              x,
              e,
            ),
              w("[data-c]", (e) => {
                const t = e.dataset.c;
                t !== d.country &&
                  ((d.country = t),
                  (d.city = i(t)),
                  ROYAL_LANDS.includes(t) || (d.royal = null),
                  d.typed || ((d.first = uname(d.g, t)), (d.last = ulast(t)))),
                  x(-1);
              });
          },
          A = (e, t = 0) => {
            const a = ((window.CITIES && CITIES[e]) || [COUNTRIES[e][1]])
              .slice()
              .sort((e, t) => e.localeCompare(t));
            v(
              `${f()}${g("City", "Pick your place or city!")}` +
                a
                  .map((t, a) =>
                    y(`data-i="${a}"`, NL_COLS[a % NL_COLS.length], `${p(`flags/${e}.png`)}${t}`),
                  )
                  .join(""),
              x,
              t,
            ),
              w("[data-i]", (e) => {
                (d.city = a[+e.dataset.i]), x(-1);
              });
          },
          M = (e = 0) => {
            v(
              `${f()}${g("Royal Status", "Pick your royal status!")}\n        ${y('data-r=""', d.royal ? "purple" : "yellow", `${p("royal/broom.png")}Commoner`)}` +
                ROY_PICKABLE.map((e) =>
                  y(
                    `data-r="${e}"`,
                    d.royal === e ? "yellow" : "purple",
                    `${p(ROY_RANKS[e].ico)}${royWord(e, d.g)}`,
                  ),
                ).join(""),
              x,
              e,
            ),
              w("[data-r]", (e) => {
                (d.royal = e.dataset.r || null), x(-1);
              });
          },
          L = (e = 0) => {
            v(
              `${f()}${g("Special Talent", "Pick your special talent!")}\n        ${y('data-t=""', "yellow", `${p("talent/none.png")}None`)}` +
                Object.entries(TALENTS)
                  .map(([e, t]) => y(`data-t="${e}"`, "orange", `${p(t.ico)}${t.name}`))
                  .join(""),
              x,
              e,
            ),
              w("[data-t]", (e) => {
                (d.talent = e.dataset.t || null), x(-1);
              });
          },
          E = (e = 0) => {
            const t = { ...d.look },
              a = d.g,
              o = u ? stage(u.age) : 3,
              n = ("f" === a ? FACE_LAYERS_F : FACE_LAYERS)[o],
              s = u
                ? [
                    ["eyes", "Eyes"],
                    ["skin", "Skin"],
                    ["brows", "Brows"],
                    ["hair", "Hair"],
                    ["xhair", "New Hairstyles"],
                    ...(n.glasses && n.glasses.length ? [["glasses", "Glasses"]] : []),
                    ...("m" === a && u.age >= 16 ? [["beard", "Facial Hair"]] : []),
                    ...(gangTatsOn()
                      ? [
                          ["tfh", "Forehead Tattoo"],
                          ["tcl", "Left Cheek"],
                          ["tcr", "Right Cheek"],
                          ["ttd", "Teardrop"],
                        ]
                      : []),
                    ["tft", "Face Tattoo"],
                  ]
                : [
                    ["eyes", "Eyes"],
                    ["skin", "Skin"],
                    ["brows", "Brows"],
                    ["hair", "Hair"],
                    ["xhair", "New Hairstyles"],
                    ...("m" === a ? [["beard", "Facial Hair"]] : []),
                    ["scar", "Scars"],
                    ["patch", "Eye Patch"],
                    ...(gangTatsOn()
                      ? [
                          ["tfh", "Forehead Tattoo"],
                          ["tcl", "Left Cheek"],
                          ["tcr", "Right Cheek"],
                          ["ttd", "Teardrop"],
                        ]
                      : []),
                    ["tft", "Face Tattoo"],
                  ],
              r = {
                eyes: { cols: [NL_EYES, "eyes"] },
                skin: { cols: [NL_SKIN, "skin"] },
                brows: { style: ["brow", n["eyebrows-happy"].length] },
                hair: { cols: [NL_HAIR, "hair"], style: ["hairCut", n["hair-base"].length] },
                xhair: { cols: [NL_HAIR, "hair"], style: ["xHair", hairPackList().length + 1] },
                tfh: { style: ["fh", 1] },
                tcl: { style: ["cl", 1] },
                tcr: { style: ["cr", 1] },
                ttd: { style: ["td", 1] },
                tft: { style: ["faceTat", FULL_FACE_TATS.length] },
                beard: { style: ["wantBeard", 14] },
                glasses: { style: ["glasses", (n.glasses || []).length + 1] },
                scar: { style: ["scar", ACCESSORIES.scar.length + 1] },
                patch: { style: ["patch", ACCESSORIES.patch.length + 1] },
              };
            let i = "eyes";
            const l = (e, t) => {
              if (!/^#[0-9a-f]{6}$/i.test(t || "")) return e[0];
              const a = (e) =>
                e
                  .slice(1)
                  .match(/../g)
                  .map((e) => parseInt(e, 16));
              return e.reduce((e, o) =>
                a(o).reduce((e, o, n) => e + (o - a(t)[n]) ** 2, 0) <
                a(e).reduce((e, o, n) => e + (o - a(t)[n]) ** 2, 0)
                  ? o
                  : e,
              );
            };
            (t.skin = l(NL_SKIN, t.skin)), (t.eyes = l(NL_EYES, t.eyes)), (t.scar ??= 0), (t.patch ??= 0);
            const c = (e) =>
                `<button class="nl-arw" data-step="${e}" aria-label="${e > 0 ? "Next" : "Previous"}"><svg viewBox="0 0 30 64"><polygon points="${e > 0 ? "2,2 28,32 2,62" : "28,2 2,32 28,62"}"/></svg></button>`,
              h = v(
                `${f()}${g("Appearance", u ? `Edit your ${m(u.role.toLowerCase())}'s appearance!` : "Select your appearance!")}<div class="nl-dbl"></div>\n        <div class="nl-stage">${c(-1)}<div class="nl-look"><canvas width="250" height="250"></canvas></div>${c(1)}</div>\n        ${y('data-a="save"', "green nl-save", "Save")}\n        <div class="nl-dock"><div class="nl-tabs"></div><div class="nl-sw"></div></div>`,
                x,
                e,
              );
            h.classList.add("nl-app"),
              dragScrollX(h.querySelector(".nl-tabs")),
              dragScrollX(h.querySelector(".nl-sw"));
            const p = h.querySelector(".nl-look canvas").getContext("2d"),
              b = () => {
                const e = ((e) => {
                    const n = { ...e, beard: ("m" === a && e.wantBeard) || 0, accRoll: 1, hatRoll: 1 };
                    n.eye2 === n.eyes && delete n.eye2,
                      u || (geneLook(n, d.genes), n.eye2 ? (t.eye2 = n.eye2) : delete t.eye2);
                    const s = {
                      eyewear: null,
                      headwear: null,
                      mask: null,
                      scar: e.scar ? `scar${e.scar}` : null,
                      patch: e.patch ? "patch" + (e.patch - 1) : null,
                    };
                    return composeFace(o, "happy", n, a, s, { genes: !0 });
                  })(t),
                  n = JSON.stringify(t);
                e.then((e) => {
                  JSON.stringify(t) === n && (p.clearRect(0, 0, 250, 250), p.drawImage(e, 0, 0));
                });
              },
              k = (e) => {
                const a = r[i].style;
                if (!a) return;
                const [o, n] = a;
                if ("xhair" === i) {
                  const a = hairPackList(),
                    o = (((a.findIndex((e) => e[0] === t.xHair) + 1 + e) % n) + n) % n;
                  o ? (t.xHair = a[o - 1][0]) : delete t.xHair;
                } else if ("tft" === i) {
                  const a =
                    (((Math.max(
                      0,
                      FULL_FACE_TATS.findIndex((e) => e[0] === (t.faceTat || null)),
                    ) +
                      e) %
                      n) +
                      n) %
                    n;
                  FULL_FACE_TATS[a][0] ? (t.faceTat = FULL_FACE_TATS[a][0]) : delete t.faceTat;
                } else if (/^t(fh|cl|cr|td)$/.test(i)) {
                  const a = (t.tats = { fh: null, cl: null, cr: null, td: 0, ...myTats(t) }),
                    n = tatOpts(o).map((e) => e[0]),
                    s = n.length;
                  a[o] = n[(((Math.max(0, n.indexOf(a[o])) + e) % s) + s) % s];
                } else
                  (t[o] = ((((t[o] ?? (e > 0 ? -1 : 0)) + e) % n) + n) % n), "hair" === i && delete t.xHair;
                play("choice"), b();
              };
            h.querySelectorAll("[data-step]").forEach((e) => (e.onclick = () => k(+e.dataset.step)));
            const $ = h.querySelector(".nl-look");
            let S = null;
            $.addEventListener("pointerdown", (e) => {
              S = e.clientX;
            }),
              $.addEventListener("pointerup", (e) => {
                if (null == S) return;
                const t = e.clientX - S;
                (S = null), Math.abs(t) > 30 && k(t < 0 ? 1 : -1);
              }),
              $.addEventListener("pointerleave", () => {
                S = null;
              });
            const C = (e) => {
              const a = r[i];
              h.querySelector(".nl-stage").classList.toggle("no-arw", !a.style),
                (h.querySelector(".nl-tabs").innerHTML = s
                  .map(([e, t]) => `<button data-tab="${e}" class="${e === i ? "on" : ""}">${t}</button>`)
                  .join("")),
                h.querySelectorAll("[data-tab]").forEach(
                  (e) =>
                    (e.onclick = () => {
                      play("choice"), (i = e.dataset.tab), C();
                    }),
                );
              const o = h.querySelector(".nl-sw"),
                n = e ? o.scrollLeft : 0;
              if (((o.innerHTML = ""), (o.style.display = a.cols ? "" : "none"), a.cols)) {
                const [e, n] = a.cols;
                e.forEach((e) => {
                  const a = document.createElement("button");
                  (a.className = "nl-swatch" + (t[n] === e ? " on" : "")),
                    (a.style.background = e),
                    (a.onclick = () => {
                      play("choice"), (t[n] = e), b(), C(!0);
                    }),
                    o.append(a);
                });
              }
              (o.scrollLeft = n),
                e || o.querySelector(".on")?.scrollIntoView({ inline: "center", block: "nearest" });
            };
            w("[data-a]", () => {
              (d.look = { ...t }), x(-1);
            }),
              b(),
              C();
          },
          H = (e = 0) => {
            const t = u ? u.attrList || GOD_ATTRS : NL_ATTRS,
              a = (e) => ("Sexuality" === e ? rint(0, 33) : "Insanity" === e ? rint(0, 15) : rint(5, 100)),
              o = { ...Object.fromEntries(NL_ATTRS.map((e) => [e, a(e)])), ...(d.attrs || {}) },
              n = (e, t) =>
                "Sexuality" === e ? sexualityOf(t) : "Wealth" === e ? usd(wealthMoney(t)) : t + "%",
              s = {
                Craziness: "emoji/1f92a.png",
                Generosity: "emoji/1f381.png",
                Wealth: "emoji/1f4b0.png",
                ...(document.querySelector(".phone").classList.contains("flui")
                  ? { "Mental Health": "emoji/1f60a.png", Insanity: "emoji/1f92a.png" }
                  : {
                      "Mental Health": "stat-emoji/face-slight-smile.png",
                      Insanity: "stat-emoji/face-silly.png",
                    }),
              },
              r = v(
                `${f()}<div class="nl-panel">${g("Attributes", u ? `Edit your ${m(u.role.toLowerCase())}'s attributes!` : "Select your attributes!")}` +
                  t
                    .map(
                      (e) =>
                        `<div class="nl-attr"><label><img src="${s[e] || `newlife/${e.toLowerCase()}.png`}" alt="">${e}<b data-v="${e}">${n(e, o[e])}</b></label><input type="range" min="0" max="100" value="${o[e]}" data-s="${e}"></div>`,
                    )
                    .join("") +
                  `</div>\n        ${y('data-st="save"', "green nl-save", "Save")}`,
                x,
                e,
              );
            r.querySelectorAll("[data-s]").forEach(
              (e) =>
                (e.oninput = () => {
                  r.querySelector(`[data-v="${e.dataset.s}"]`).textContent = n(e.dataset.s, +e.value);
                }),
            ),
              w("[data-st]", () => {
                (d.attrs = Object.fromEntries(
                  [...r.querySelectorAll("[data-s]")].map((e) => [e.dataset.s, +e.value]),
                )),
                  x(-1);
              });
          },
          R = (e = 0) => {
            const t = v(
              `${f()}<div class="nl-panel">${g("Name", "Select your name!")}\n        <div class="nl-form"><label>First Name</label><input id="nlFirst" maxlength="24" value="${m(d.first)}">\n        <label>Last Name</label><input id="nlLast" maxlength="24" value="${m(d.last)}"></div></div>\n        ${y('data-n="save"', "green nl-save", "Save")}`,
              x,
              e,
            );
            w("[data-n]", () => {
              (d.first = h(t.querySelector("#nlFirst").value) || d.first),
                (d.last = h(t.querySelector("#nlLast").value) || d.last),
                (d.typed = !0),
                x(-1);
            });
          },
          B = (e = 0) => {
            v(
              `${f()}${g("Gender", "Pick your gender!")}\n        ${y('data-gd="m"', "blue", '<span class="nl-sym">&#9794;</span>Male')}${y('data-gd="f"', "pink", '<span class="nl-sym">&#9792;</span>Female')}`,
              x,
              e,
            ),
              w("[data-gd]", (e) => {
                const t = e.dataset.gd;
                t !== d.g && ((d.g = t), d.typed || (d.first = uname(t, d.country)), (d.look = s(t))), x(-1);
              });
          },
          SP = (e = 0) => {
            const SPECIES_OPTS = [
              "human",
              "Wolf",
              "Red Fox",
              "Fennec Fox",
              "Lion",
              "Bengal Tiger",
              "Jaguar",
              "Leopard",
              "Cheetah",
              "Panda Bear",
              "Grizzly Bear",
              "Hyena",
              "Lynx",
              "Snow Leopard",
              "Black Panther",
              "Rabbit",
              "Deer",
              "Owl",
              "Raven",
              "Otter",
              "Komodo Dragon",
            ];
            v(
              `${f()}${g("Species", "Pick your species!")}\n        ${SPECIES_OPTS.map((e) => y(`data-sp="${e}"`, "yellow", "human" === e ? "Human" : `${e} Hybrid`)).join("")}`,
              x,
              e,
            ),
              w("[data-sp]", (e) => {
                (d.species = e.dataset.sp), x(-1);
              });
          },
          NKFAM = (e = 0) => {
            v(
              `${f()}${g("Birth Status", "Were you born into North Korea's ruling family?")}\n        ${y('data-nkf="0"', "blue", "Ordinary Citizen")}${y('data-nkf="1"', "purple", "Child of the Leader")}`,
              x,
              e,
            ),
              w("[data-nkf]", (e) => {
                (d.nkRuling = "1" === e.dataset.nkf), x(-1);
              });
          };
        x();
      }
      const MKT = [
          [
            "Best First Purchase",
            "#f39a12",
            "#fdf6dc",
            [
              ["boss", "Boss Mode", "Bundle and save! Unlock all 11 Job Packs!", "Best Value"],
              ["fighter", "Ultimate Fighter Mode", "Get ready to rumble!", "NEW"],
              ["vampire", "Vampire Mode", "Go for the jugular!", "Popular"],
              ["director", "Movie Director", "Become a famous movie director!", "NEW"],
            ],
          ],
          [
            "BitLife Essentials",
            "#5e2b5e",
            "#ebe9fb",
            [
              ["luxury", "Luxury Lifestyle", "Enjoy the perks of being a VIP", "Popular"],
              ["outdoor", "Outdoor Lifestyle", "Spend time with Mother Nature"],
            ],
          ],
          [
            "Expansion Packs",
            "#203e5e",
            "#e8f1fc",
            [
              [
                "landlord",
                "Landlord Expansion Pack",
                "Manage tenants, unlock exclusive homes, and more!",
                "Popular",
              ],
              ["casino", "Casino Expansion Pack", "Start your own casino!", "Popular"],
              ["racing", "Racing Expansion Pack", "Compete in street races, F1 races, and more!"],
              ["agent", "Secret Agent Expansion Pack", "Start a spy agency, take on missions, and more!"],
              ["blackmarket", "Black Market Expansion Pack", "Open a museum, purchase contraband, and more!"],
              ["zoo", "Zoo Expansion Pack", "Open your own zoo, collect animals, and more!"],
            ],
          ],
          [
            "Bundles",
            "#f39a12",
            "#fdf6dc",
            [
              ["fame", "Fame & Fortune Bundle", "Live a life of pure luxury!", null, "$22.99"],
              ["crimepays", "Crime Pays Bundle", "Become BitLife's wealthiest crime lord!", null, "$15.99"],
              ["party", "Party Animal Bundle", "Take a walk on the WILD side of life!", null, "$27.99"],
            ],
          ],
          [
            "Items",
            "#8b6a2f",
            "#f6edd5",
            [
              ["resume", "Golden Resume", "Get that dream job!", "Popular"],
              ["diploma", "Golden Diploma", "Become an overnight expert!", "Popular"],
              ["pacifier", "Golden Pacifier", "Make your dream babies!"],
              ["bracelet", "Friendship Bracelet", "Become everyone's favorite person!"],
              ["blade", "Assassin's Blade", "Get away with murder!"],
              ["aura", "Aura Ring", "Generate swag without trying!"],
              ["jailcard", "Get Out Of Jail Free Card", "Get out of jail whenever you want!"],
              ["pixie", "Dab of Pixie Dust", "Embark on the trip of a lifetime!"],
              ["neko", "Golden Neko Statue", "Make it rain!"],
              ["passport", "Golden Passport", "Emigrate to any country of your choice!"],
              ["piggy", "Golden Piggy Bank", "Get rich quick!"],
              ["wrench", "Golden Wrench", "Auto-maintain all of your vehicles!"],
              ["potion", "Promiscuity Potion", "Never catch an STD!"],
            ],
          ],
          [
            "Miscellaneous",
            "#8e2c2c",
            "#fbe6e6",
            [
              ["streak", "Streak Savers (x5)", "Keep your streak alive!"],
              ["vault", "Challenge Vault", "Gain access to past challenges!"],
              ["superstar", "Superstar", "Unlock an exclusive BitLife theme!"],
            ],
          ],
        ],
        MKT_OWNED = [
          ["bitizen", "Bitizenship", "Get rid of ads, play unlimited generations, and more!"],
          ["godmode", "God Mode", "Customize new lives, start royal lives, and more!"],
          ["investor", "Investor Expansion Pack", "Invest in stocks, bonds, crypto, and more!"],
          ["cult", "CULT Expansion Pack", "Start a commune, lead your followers, and more!"],
          ["hollywood", "Hollywood Star", "Skyrocket your way to stardom!"],
          ["actor", "Actor", "Become a famous TV or movie star!"],
          ["astronaut", "Astronaut", "Explore the cosmos!"],
          ["business", "Business", "Start up, acquire, or lead a company!"],
          ["dealer", "Dealer", "Join a drug cartel!"],
          ["mafia", "Mafia", "Join an organized crime syndicate!"],
          ["model", "Model", "Become a famous supermodel!"],
          ["producer", "Music Producer", "Become a famous music producer!"],
          ["musician", "Musician", "Join a band or go for a solo career!"],
          ["politician", "Politician", "Run for political office!"],
          ["athlete", "Pro Athlete", "Become a professional athlete!"],
          ["hustler", "Street Hustler", "Hit the streets and get your hustle on!"],
          ["timemachine", "Unlimited Time Machine", "Go back in time as much as you want!"],
        ];
      SND.boost = new Audio("sounds/a16_sndBoost.wav");
      const LOOKS_BOOSTS = [
          [
            "A friend who is a plastic surgeon offers you a free calf implant procedure, telling you {he} doesn't know anyone who could use them as much as you.<br><br>You've been feeling insecure about your scrawny calves recently.",
            "Let's do it!",
            "No, maybe I'll try cycling",
            "You accepted a plastic surgeon's offer for free calf implants.",
          ],
          [
            "A celebrity makeup artist spots you at the mall and offers you a free makeover, saying you're a \"fixer-upper.\"<br><br>You've been avoiding mirrors lately.",
            "Make me over!",
            "No thanks, I like my face",
            "You let a celebrity makeup artist give you a free makeover.",
          ],
          [
            "Your dentist offers to whiten and straighten your teeth for free if you'll let {him} use your before and after photos in an ad.<br><br>You've been hiding your smile for months.",
            "Smile for the camera!",
            "No, I'll keep my teeth",
            "You let your dentist fix your teeth in exchange for some before and after photos.",
          ],
          [
            "A personal trainer at your gym says {he} can turn your body around in a month, free of charge, if you follow {his} plan.<br><br>You've been feeling out of shape.",
            "Sign me up!",
            "No, the couch is calling",
            "You took a personal trainer up on a free month of workouts.",
          ],
          [
            "A dermatologist friend offers you a free laser treatment for your skin, saying {he} has seen worse but not by much.<br><br>Your skin has been bothering you lately.",
            "Zap away!",
            "No, lasers scare me",
            "You got a free laser skin treatment from a dermatologist friend.",
          ],
        ],
        STAT_BOOSTS = {
          Looks: {
            ico: "mkt/fire.png",
            titles: ["Much sexier", "Glow up", "Looking good"],
            list: LOOKS_BOOSTS,
          },
          Health: {
            ico: "stat-emoji/heart-red.png",
            titles: ["Feeling great", "Healthy as a horse", "New lease on life"],
            list: [
              [
                "A friend tells you {his} rowing team needs a replacement for the week.<br><br>You've been looking for a way to tone up a bit.",
                "Where's my paddle?",
                "I prefer speedboats",
                "You filled in on your friend's rowing team for the week.",
              ],
              [
                "A nutritionist at the farmers market offers to plan your meals for a month, free of charge.<br><br>You've been eating nothing but junk food lately.",
                "Feed me kale!",
                "Pass the fries",
                "You let a nutritionist plan your meals for a month.",
              ],
              [
                "A neighbor invites you to join {his} morning running club.<br><br>You get winded walking up the stairs these days.",
                "Lace up my sneakers!",
                "I only run late",
                "You joined your neighbor's morning running club.",
              ],
              [
                "A yoga instructor offers you a free month of classes after seeing you hunched over your phone.<br><br>Your back has been killing you.",
                "Namaste!",
                "I'm not that flexible",
                "You took a free month of yoga classes.",
              ],
            ],
          },
          Happiness: {
            ico: "stat-emoji/face-xd.png",
            titles: ["Good vibes", "Feeling better", "Turned that frown upside down"],
            list: [
              [
                "A friend invites you to spend the afternoon cuddling puppies at an animal shelter.<br><br>You've been feeling down lately.",
                "Bring on the puppies!",
                "I'm more of a cat person",
                "You spent the afternoon cuddling puppies at an animal shelter.",
              ],
              [
                "Your coworker has a spare ticket to a stand-up comedy show tonight.<br><br>You haven't laughed in weeks.",
                "Make me laugh!",
                "I'd rather mope",
                "You went to a stand-up comedy show and laughed until you cried.",
              ],
              [
                "A spa offers you a free day of pampering as their millionth customer.<br><br>You've been so stressed out.",
                "Treat yourself!",
                "Spas are overrated",
                "You spent a free day being pampered at a spa.",
              ],
            ],
          },
          Smarts: {
            ico: "stat-emoji/brain.png",
            titles: ["Big brain", "Smarty pants", "Knowledge is power"],
            list: [
              [
                "A retired professor offers to tutor you for free in exchange for help with {his} garden.<br><br>You've been feeling a little slow lately.",
                "Teach me everything!",
                "I hate gardening",
                "You traded garden work for tutoring from a retired professor.",
              ],
              [
                "Your local library is offering a free speed-reading course.<br><br>You haven't finished a book in years.",
                "Sign me up!",
                "Books are boring",
                "You took a free speed-reading course at the library.",
              ],
              [
                "A chess club invites you to play with them every week.<br><br>You've been looking for a way to sharpen your mind.",
                "Checkmate!",
                "Chess is for nerds",
                "You joined a weekly chess club.",
              ],
            ],
          },
        };
      function statBoost(e) {
        if (((state.boosts ||= {}), state.boosts[e] === state.age || state.dead || !STAT_BOOSTS[e])) return;
        const t = STAT_BOOSTS[e],
          a = ((state.boostSeen ||= {})[e] ||= []);
        let o = t.list.filter((e, t) => !a.includes(t));
        o.length || ((a.length = 0), (o = t.list));
        const n = any(o);
        a.push(t.list.indexOf(n));
        const [s, r, i, l] = n,
          c = chance(0.5) ? "m" : "f",
          d = (e) =>
            e
              .replace(/\{he\}/g, "m" === c ? "he" : "she")
              .replace(/\{him\}/g, "m" === c ? "him" : "her")
              .replace(/\{his\}/g, "m" === c ? "his" : "her"),
          u = state.stats[e];
        play("boost"),
          jCard({
            tag: "Boost",
            iconSrc: t.ico,
            title: e,
            lead: `${d(s)}<br><br>What will you do?`,
            bars: [[`Your ${e}`, u, u < 13 ? "#b3261e" : barCol(u)]],
            choices: [
              [
                r,
                () => {
                  (state.boosts[e] = state.age),
                    (state.stats[e] = clamp(u + rint(10, 25))),
                    renderStats(),
                    play("boost"),
                    say(
                      d(l)
                        .replace(/^You /, "I ")
                        .replace(/\byour\b/g, "my"),
                    ),
                    notice(
                      any(t.titles),
                      d(l),
                      null,
                      !0,
                      `<div class="ev-bars nb"><b>Old ${e}</b><i><u style="width:${Math.max(u, 2)}%;background:${barCol(u)}"></u></i><b>New ${e}</b><i><u style="width:${state.stats[e]}%;background:${barCol(state.stats[e])}"></u></i></div>`,
                    );
                },
              ],
              [
                i,
                () => {
                  (state.boosts[e] = state.age),
                    renderStats(),
                    say(`I passed on a chance to improve my ${e.toLowerCase()}.`);
                },
              ],
            ],
          });
      }
      stats.addEventListener("click", (e) => {
        const t = e.target.closest("[data-boost]");
        t && statBoost(t.dataset.boost);
      }),
        new MutationObserver(() => {
          !screen.classList.contains("open") &&
            screen.classList.contains("mkt") &&
            screen.classList.remove("mkt");
        }).observe(screen, { attributes: !0, attributeFilter: ["class"] });
      const mktOwned = () => {
        try {
          return JSON.parse(localStorage.getItem("bitlifepp-owned") || "[]");
        } catch {
          return [];
        }
      };
