      function socialSignup(e, t, a) {
        const [, o, n] = socOf(e);
        if (
          ((state.social[e] = {
            subs: 0,
            fake: 0,
            posts: 0,
            views: 0,
            years: 0,
            momentum: 0,
            postsYear: 0,
            viewsYear: 0,
            monet: !1,
            verified: !1,
            banned: !1,
            appealAt: 0,
            buysYear: 0,
            botYears: [],
          }),
          a && (state.social[e].handle = a),
          linkEmail(e, t || (state.emails || [])[0]?.addr),
          (state.socialInactive = (state.socialInactive || []).filter((t) => t !== e)),
          notSocial(e))
        )
          return subSignup(e);
        say(`I signed up for ${/^[AEIOU]/.test(o) ? "an" : "a"} ${o} account as @${showHandle(e)}.`),
          "roblox" === e && rbxBcMail(e),
          ftNepoSignup(e);
        const s = state.art;
        if (s && s.fameOn && s.fame > 0) {
          const t = socReach(e, s.fame ** 2 * rint(20, 120));
          t > 0 &&
            ((state.social[e].subs += t),
            say(
              `${fmtN(t)} of my fans followed my new ${o} account right away${socAge(e) < 2 ? `, even though ${o} just launched` : ""}.`,
            ));
        }
        socialStarCheck();
      }
      function socialStarCheck() {
        achSeen.has("Social Media Star") ||
          (Object.values(state.social).some((e) => !e.banned && e.subs >= 1e6) &&
            setTimeout(() => {
              achSeen.has("Social Media Star") ||
                showAchievement("Social Media Star", "Get a million followers on social media");
            }, 600));
      }
      function openSocialAccount(e) {
        if (emailLockedFor(e))
          return notice(
            "Locked out",
            `You lost access to ${state.social[e].email}, the email on @${showHandle(e)}. Recover the email first (Assets → Email).`,
            null,
            !0,
          );
        if (notSocial(e)) return openSub(e);
        if (socEnded(e))
          return notice(
            "Shut down",
            `${socOf(e)[1]} shut down in ${SOC_END[socBase(e)]}. Your account @${showHandle(e)} is gone with it.`,
            null,
            !0,
          );
        const [, t, a, o, n] = socOf(e),
          s = state.social[e],
          r = a[0].toUpperCase() + a.slice(1);
        (sTitle.textContent = t.toUpperCase()),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial);
        const i = (e, t, a, o) =>
          `<div class="row sm" data-sa="${e}"><img src="${t.includes("/") ? t : socIcon(t)}"><div class="t"><b>${a}</b><span>${o}</span></div>${DOTS}</div>`;
        var l;
        (sList.innerHTML =
          `<div class="row" data-sa="info"><img src="${socIcon(socBase(e))}"><div class="t"><b>@${showHandle(e)}</b><span>${s.banned ? disabledTxt(e) : "discord" === socBase(e) ? "" : `${fmtN(s.subs)} ${a}`}</span></div>${DOTS}</div>` +
          ("roblox" !== socBase(e) || s.banned || (!rbxUI() && null == rbxOf(e).club && null == rbxOf(e).prem)
            ? ""
            : robloxRows(e)) +
          '<div class="sec">Activities</div>' +
          (s.banned
            ? i("appeal", "post", "Appeal", "Appeal your ban") +
              i("newacct", "post", "New Account", `Start over with another ${t} account`) +
              i("delete", "delete", "Delete", "Delete your account")
            : ("discord" === socBase(e) ? "" : i("buy", "buy", `Buy ${r}`, `Buy some ${a}`)) +
              i("delete", "delete", "Delete", "Delete your account") +
              i("monetize", "monetize", "Monetize", "Monetize your account") +
              (GAMING.has(socBase(e))
                ? i("play", "emoji/1f3ae.png", "Play", `Play ${t} and have some fun`)
                : i("post", "post", "Post", `Post ${/^[aeiou]/.test(o) ? "an" : "a"} ${o}`)) +
              i("promote", "promote", "Promote", "Promote a product") +
              i(
                "rename",
                "emoji/270f-fe0f.png",
                "Username",
                `Change your username (@${showHandle(e)})${"roblox" === socBase(e) && rbxUI() ? ` · R$ ${fmtN(RBX_RENAME)}` : ""}`,
              ) +
              i(
                "verify",
                "discord" === socBase(e) ? verifyIcon(e) : "verify",
                "Verify",
                "Request verification",
              ) +
              i(
                "about",
                "emoji/1f4dd.png",
                "About Me",
                s.about
                  ? `"${escAttr(s.about.length > 40 ? s.about.slice(0, 40) + "…" : s.about)}"`
                  : "Write your status or about me",
              ) +
              i(
                "password",
                "emoji/1f512.png",
                "Password",
                (l = pwUses(pwOf(e)).length) > 1
                  ? `Used on ${l - 1} other account${l > 2 ? "s" : ""}`
                  : "Change your password",
              ) +
              i(
                "email",
                "emoji/1f4e7.png",
                "Email",
                s.email ? `Move to another email (${escAttr(s.email)})` : "Connect an email",
              )) +
          `<div class="sec">Your ${t} Accounts</div>` +
          Object.keys(state.social)
            .filter((t) => socBase(t) === socBase(e))
            .sort()
            .map((t) => {
              const o = state.social[t];
              return t !== e && emailLockedFor(t)
                ? `<div class="row sm dis"><img src="${socIcon(socBase(e))}"><div class="t"><b>@${showHandle(t)}</b><span><img src="emoji/1f512.png" alt="" style="width:13px;height:13px;vertical-align:-2px;margin-right:4px">Locked: you lost access to its email</span></div></div>`
                : `<div class="row sm${t === e ? " dis" : ""}" data-acct="${t}"><img src="${socIcon(socBase(e))}"><div class="t"><b>@${showHandle(t)}${t === e ? " <em>(Viewing)</em>" : ""}</b><span>${o.banned ? disabledTxt(t) : "discord" === socBase(e) ? "" : `${fmtN(o.subs)} ${a}`}</span></div>${t === e ? "" : CHEV}</div>`;
            })
            .join("") +
          i("newacct", "post", "New Account", `Make another ${t} account`) +
          i("search", "promote", "Search", `Look up a ${t} username`) +
          ("discord" !== socBase(e) || s.banned ? "" : discordRows(e))),
          (sList.scrollTop = 0);
        const c = () => openSocialAccount(e);
        sList.querySelectorAll("[data-acct]").forEach(
          (t) =>
            (t.onclick = () => {
              t.dataset.acct !== e && (play("choice"), openSocialAccount(t.dataset.acct));
            }),
        ),
          sList.querySelectorAll("[data-dc]").forEach(
            (t) =>
              (t.onclick = () => {
                play("choice"), discordAction(e, t.dataset.dc, c);
              }),
          ),
          sList.querySelectorAll("[data-rb]").forEach(
            (t) =>
              (t.onclick = () => {
                play("choice"), robloxAction(e, t.dataset.rb, c);
              }),
          ),
          sList.querySelectorAll("[data-sa]").forEach(
            (i) =>
              (i.onclick = () => {
                const l = i.dataset.sa;
                if ("info" === l) return "discord" === socBase(e) ? discordProfile(e) : socialProfile(e);
                if ("rename" === l) return renameCard(e, c);
                if ("about" === l) return aboutCard(e, c);
                if ("password" === l)
                  return pwCard(
                    t,
                    (a) => {
                      setPw(e, a),
                        say(`I changed my ${t} password.`),
                        notice("Password changed", `Your ${t} password is updated.`, c, !0);
                    },
                    pwOf(e),
                    e,
                  );
                if ("email" === l) {
                  const a = s.email,
                    o = (state.emails || []).filter((e) => !e.hacked && e.addr !== a);
                  if (!o.length)
                    return notice(
                      "No other email",
                      `You don't have another email to move @${showHandle(e)} to. Make a new address in the Email section of Assets.`,
                      null,
                      !0,
                    );
                  const n = window.SIMSWAP && SIMSWAP.hotAcct(e) && SIMSWAP.mainEmail(a);
                  return socSelCard({
                    icon: socIcon(o[0].prov),
                    title: "Change Email",
                    lead:
                      `Move your ${t} account @${showHandle(e)} to a different email.${a ? `<br><br>Current email: ${escAttr(a)}` : ""}` +
                      (n
                        ? "<br><br>This account was bought with stolen crypto, and it sits on the same email as your personal accounts. Moving it to a separate email makes it much harder to trace back to you."
                        : ""),
                    label: "New email:",
                    opts: o.map((e) => escAttr(e.addr)),
                    btn: "Move my account",
                    onGo: (n) => {
                      const s = o[n].addr;
                      a &&
                        mailTo(
                          a,
                          t,
                          `Your ${t} email was changed`,
                          `The email on your ${t} account @${showHandle(e)} was changed to ${s}. If this wasn't you, secure your account right away.`,
                        ),
                        linkEmail(e, s),
                        say(`I moved my ${t} account @${showHandle(e)} ${a ? `from ${a} ` : ""}to ${s}.`),
                        notice(
                          "Email changed",
                          `Your ${t} account @${showHandle(e)} is now on ${escAttr(s)}.`,
                          c,
                          !0,
                        );
                    },
                  });
                }
                if ("newacct" === l) return socialExtraAccount(e);
                if ("search" === l) return searchCard(e);
                if ("play" === l) {
                  const a = gameActs(e);
                  return socSelCard({
                    icon: `${socIcon(socBase(e))}`,
                    title: "Play",
                    lead: `Hop on ${t} and have some fun!`,
                    label: "What will you do?",
                    opts: a.map((e) => e[0]),
                    btn: "Let's play",
                    onGo: (t) => {
                      gamePlay(e, a[t]), c();
                    },
                  });
                }
                if ("post" === l)
                  return socSelCard({
                    icon: `${socIcon(socBase(e))}`,
                    title: o[0].toUpperCase() + o.slice(1),
                    lead: `Post ${/^[aeiou]/.test(o) ? "an" : "a"} ${o} on ${t} today!`,
                    label: `Pick your ${o}:`,
                    opts: n,
                    btn: `Post ${/^[aeiou]/.test(o) ? "an" : "a"} ${o}`,
                    onGo: (t) => {
                      socialPost(e, n[t]), c();
                    },
                  });
                if ("buy" === l) {
                  const o = [
                    [100, 12],
                    [250, 25],
                    [500, 38],
                    [1e3, 63],
                    [2500, 127],
                    [5e3, 191],
                  ];
                  return socSelCard({
                    icon: "social/buy.png",
                    title: `Buy ${r}`,
                    lead: `Buy some ${a} on ${t} today!`,
                    label: "Pick your followers:",
                    opts: o.map(([e, t]) => `${fmtN(e)} ${r} (${usd(t)})`),
                    btn: "Buy them",
                    onGo: (t) => {
                      socialBuy(e, ...o[t]), c();
                    },
                  });
                }
                if ("verify" === l)
                  return socSelCard({
                    icon: "discord" === socBase(e) ? verifyIcon(e) : "social/verify.png",
                    title: "Verification",
                    lead: `Request verification on your ${t} account today!`,
                    btn: "Verify me",
                    onGo: () => {
                      if (s.verifyAge === state.age)
                        return notice("Um, no", `You already asked ${t} to verify you this year.`, null, !0);
                      s.verifyAge = state.age;
                      const e = state.art && state.art.fameOn ? state.art.fame : 0,
                        a = !(!state.royal || state.royal.abdicated),
                        o = s.subs >= 1e6 ? 0.8 : s.subs >= 1e5 ? 0.4 : s.subs >= 1e4 ? 0.1 : 0.01,
                        n = a || e >= 40 ? 1 : e >= 30 ? Math.max(o, 0.6) : o;
                      if (!chance(n))
                        return (
                          say(`I asked ${t} to verify my account, but they said no.`),
                          notice(
                            "Um, no",
                            `Your attempt to verify your ${t} account has been rejected.`,
                            null,
                            !0,
                          )
                        );
                      (s.verified = !0),
                        (s.momentum = Math.min(10, s.momentum + 1)),
                        say(`My ${t} account got verified!`),
                        notice("Blue check", `Your ${t} account is now verified!`, null, !0),
                        c();
                    },
                  });
                if ("monetize" === l)
                  return socSelCard({
                    icon: "social/monetize.png",
                    title: "Monetize",
                    lead: `Monetize your ${t} account today!`,
                    btn: "Monetize it",
                    onGo: () =>
                      s.monet
                        ? notice("Already done", `Your ${t} account is already monetized.`, null, !0)
                        : s.subs < 1e3
                          ? (say(`I tried to monetize my ${t} account, but I didn't have enough ${a}.`),
                            notice(
                              "Um, no",
                              `Your request to monetize your ${t} account was rejected. You need at least 1,000 ${a}.`,
                              null,
                              !0,
                            ))
                          : ((s.monet = !0),
                            say(`I monetized my ${t} account.`),
                            void notice(
                              "Show me the money",
                              `You monetized your ${t} account. You'll earn money from it every year.`,
                              null,
                              !0,
                            )),
                  });
                if ("promote" === l) {
                  if (s.promoteAge === state.age)
                    return notice(
                      "Um, no",
                      "You already promoted a product on this account this year.",
                      null,
                      !0,
                    );
                  const o = Math.max(0, s.subs - s.fake);
                  if (o < 1e3)
                    return notice(
                      "Um, no",
                      `No company wants to sponsor an account with so few ${a}.`,
                      null,
                      !0,
                    );
                  const [n, i] = any(PROMO_PRODUCTS),
                    l =
                      100 * Math.round(((o / 1e3) * rint(10, 22) * (PROMO_RATE[socBase(e)] || 0.5)) / 100) ||
                      100;
                  return socSelCard({
                    icon: `${socIcon(socBase(e))}`,
                    title: "Promote",
                    lead: `You've received an offer to promote something on your ${t} account.<br><br>What will you do?`,
                    rows: [
                      ["Product", n],
                      ["Compensation", usd(l)],
                      [r, fmtN(s.subs)],
                    ],
                    btn: "Accept the offer",
                    onGo: () => {
                      (s.promoteAge = state.age), (state.money += l);
                      const e = n.toLowerCase(),
                        r = state.art,
                        c = r && r.fameOn;
                      let d, u, h;
                      if (chance(i)) {
                        const n = Math.round(o * (0.03 + 0.12 * i) * (0.6 + 0.8 * Math.random())),
                          p = c ? rint(2, 4 + Math.round(6 * i)) : 0;
                        (s.subs = Math.max(0, s.subs - n)),
                          p && (r.fame = clamp(r.fame - p)),
                          (h = any(["Sellout", "Cancelled", "Unsubscribed"])),
                          (u = `You promoted ${e} on your ${t} account and earned ${usd(l)}.<br><br>Your fans hated it. You lost ${fmtN(n)} ${a}${p ? " and some of your fame" : ""}.`),
                          (d = `I promoted ${e} on my ${t} account for ${usd(l)}, and my fans hated it. I lost ${fmtN(n)} ${a}.`);
                      } else if (chance(0.5)) {
                        const n = Math.round(o * (0.005 + 0.03 * Math.random())),
                          i = c && chance(0.4) ? rint(1, 2) : 0;
                        (s.subs += n),
                          i && (r.fame = clamp(r.fame + i)),
                          (h = any(["Brand deal", "Cha-ching", "Influencer"])),
                          (u = `You promoted ${e} on your ${t} account and earned ${usd(l)}.<br><br>Your fans loved it! You gained ${fmtN(n)} ${a}.`),
                          (d = `I promoted ${e} on my ${t} account for ${usd(l)}. My fans loved it, and I gained ${fmtN(n)} ${a}.`);
                      } else
                        (h = "Sponsored"),
                          (u = `You promoted ${e} on your ${t} account and earned ${usd(l)}.`),
                          (d = `I promoted ${e} on my ${t} account and got paid ${usd(l)}.`);
                      renderStats(), say(d), notice(h, u, null, !0);
                    },
                  });
                }
                return "delete" === l
                  ? tagCard({
                      tag: "Social",
                      iconSrc: "social/delete.png",
                      title: "Delete",
                      lead: `Are you sure you want to delete your ${t} account?`,
                      surprise: !1,
                      choices: [
                        [
                          "Delete it",
                          () => {
                            noteBans(),
                              delete state.social[e],
                              (state.socialInactive = [...new Set([...(state.socialInactive || []), e])]),
                              screen.classList.remove("open"),
                              say(`I deleted my ${t} account.`),
                              notice("Gone", `You deleted your ${t} account.`, null, !0);
                          },
                        ],
                        ["Never mind", () => {}],
                      ],
                    })
                  : "appeal" === l && s.hackWhy
                    ? hackAppealCard(e, c)
                    : "appeal" === l && s.banWhy
                      ? policyAppealCard(e, c)
                      : "appeal" === l
                        ? socSelCard({
                            icon: `${socIcon(socBase(e))}`,
                            title: "Appeal",
                            lead: `Your ${t} account was disabled for buying ${a}. How will you appeal?`,
                            label: "Pick your appeal:",
                            opts: ["Say I'm sorry", "Insult them", "Claim a misunderstanding"],
                            btn: "Submit appeal",
                            onGo: (o) => {
                              if (state.age < s.appealAt)
                                return notice(
                                  "Too soon",
                                  `${t} won't look at another appeal yet. You can try again at age ${s.appealAt}.`,
                                  null,
                                  !0,
                                );
                              const n = Math.min(0.95, [0.15, 0.02, 0.1][o] + waitBoost(s, 1 === o)),
                                r = waitNote(s);
                              if (chance(n))
                                return (
                                  restoreAcct(e),
                                  (s.subs = Math.max(0, s.subs - s.fake)),
                                  (s.fake = 0),
                                  (s.botYears = []),
                                  (s.buysYear = 0),
                                  say(`${t} reinstated my account after I appealed${r}.`),
                                  void notice(
                                    "Welcome back",
                                    `${t} accepted your appeal and reinstated your account. All your bought ${a} were removed.`,
                                    () => showAcct(e),
                                    !0,
                                  )
                                );
                              const i = rint(1, 3);
                              (s.appealAt = state.age + i),
                                say(`${t} denied my appeal.`),
                                notice(
                                  "Appeal denied",
                                  `${t} denied your appeal${1 === o ? " after you insulted them" : ""}. You'll have to wait ${i} year${i > 1 ? "s" : ""} before you can appeal again.`,
                                  null,
                                  !0,
                                );
                            },
                          })
                        : void 0;
              }),
          );
      }
      const GAME_ACTS = {
          roblox: [
            ["Play an obby", "beat an obby", "compete"],
            ["Play Work at a Pizza Place", "worked a shift at Work at a Pizza Place", "social", 2008],
            [
              "Play Natural Disaster Survival",
              "survived a tsunami in Natural Disaster Survival",
              "compete",
              2011,
            ],
            ["Play Jailbreak", "robbed the bank in Jailbreak", "compete", 2017],
            ["Play Adopt Me!", "raised pets in Adopt Me!", "social", 2017],
            ["Play Brookhaven", "roleplayed in Brookhaven", "social", 2020],
            ["Build a place in Studio", "built a place in Roblox Studio", "build"],
            ["Trade limiteds", "traded limiteds", "trade", 2007],
            ["Hang out in a hangout game", "hung out with strangers", "social"],
          ],
          minecraft: [
            ["Build a house", "built a house", "build"],
            ["Go mining", "went mining for diamonds", "fun"],
            ["Survive the first night", "survived the first night", "compete"],
            ["Fight the Ender Dragon", "fought the Ender Dragon", "compete", 2011],
            ["Play on a server", "played on a multiplayer server", "social"],
            ["Build a redstone machine", "built a redstone machine", "build"],
          ],
          runescape: [
            ["Train a skill", "trained Woodcutting for hours", "fun"],
            ["Do a quest", "finished a quest", "build"],
            ["Fight in the Wilderness", "fought in the Wilderness", "compete"],
            ["Trade at the Grand Exchange", "traded at the Grand Exchange", "trade", 2007],
            ["Trade in Varrock", "traded in Varrock square", "trade"],
            ["Hang out at the bank", "hung out at the Varrock bank", "social"],
          ],
          clubpenguin: [
            ["Go sledding", "went sledding", "fun"],
            ["Play Card-Jitsu", "played Card-Jitsu", "compete", 2008],
            ["Decorate your igloo", "decorated your igloo", "build"],
            ["Go to a party", "went to a party at the Night Club", "social"],
            ["Feed your puffle", "played with your puffle", "fun"],
            ["Look for Rockhopper", "searched for Rockhopper", "fun"],
          ],
          habbo: [
            ["Hang out in the lobby", "hung out in the hotel lobby", "social"],
            ["Decorate your room", "decorated your room", "build"],
            ["Trade furni", "traded furni", "trade"],
            ["Play Falling Furni", "played Falling Furni", "compete"],
          ],
          neopets: [
            ["Feed your Neopet", "fed your Neopet", "fun"],
            ["Play Meerca Chase", "played Meerca Chase", "compete"],
            ["Spin the Wheel of Excitement", "spun the Wheel of Excitement", "fun"],
            ["Use the Trading Post", "traded at the Trading Post", "trade"],
          ],
          webkinz: [
            ["Play Cash Cow", "played Cash Cow", "compete"],
            ["Decorate your pet's room", "decorated your pet's room", "build"],
            ["Work at the Employment Office", "worked at the Employment Office", "fun"],
            ["Visit the Clubhouse", "chatted in the Clubhouse", "social"],
          ],
          steam: [
            ["Play a new game", "played a new game", "fun"],
            ["Grind achievements", "grinded achievements", "compete"],
            ["Trade items", "traded items", "trade", 2011],
            ["Play with friends", "played with friends", "social"],
          ],
          xboxlive: [
            ["Play an online match", "played online matches", "compete"],
            ["Join a party chat", "chatted in a party", "social"],
            ["Grind achievements", "grinded achievements", "fun"],
          ],
          psn: [
            ["Play an online match", "played online matches", "compete"],
            ["Join a party chat", "chatted in a party", "social"],
            ["Hunt trophies", "hunted trophies", "fun"],
          ],
          miniclip: [
            ["Play 8 Ball Pool", "played 8 Ball Pool", "compete"],
            ["Play a flash game", "played flash games", "fun"],
            ["Beat your high score", "tried to beat your high score", "compete"],
          ],
          poptropica: [
            ["Explore an island", "explored an island", "fun"],
            ["Finish an island", "finished an island", "build"],
            ["Customize your avatar", "customized your avatar", "fun"],
          ],
          moshimonsters: [
            ["Feed your monster", "fed your monster", "fun"],
            ["Do a daily puzzle", "did the daily puzzle", "build"],
            ["Visit friends' rooms", "visited friends' rooms", "social"],
          ],
          toontown: [
            ["Fight Cogs", "fought Cogs", "compete"],
            ["Go fishing", "went fishing", "fun"],
            ["Play trolley games", "played trolley games", "social"],
            ["Do a ToonTask", "did a ToonTask", "build"],
          ],
          maplestory: [
            ["Grind levels", "grinded levels", "fun"],
            ["Do a party quest", "did a party quest", "social"],
            ["Sell in the Free Market", "traded in the Free Market", "trade"],
          ],
          wow: [
            ["Run a dungeon", "ran a dungeon", "social"],
            ["Go on a raid", "went on a raid", "compete"],
            ["Play battlegrounds", "played battlegrounds", "compete"],
            ["Farm gold", "farmed gold", "fun"],
          ],
          battlenet: [
            ["Play StarCraft", "played StarCraft", "compete"],
            ["Play Diablo", "played Diablo", "fun"],
            ["Play a ranked match", "played ranked", "compete"],
          ],
          wizard101: [
            ["Duel in the arena", "dueled in the arena", "compete"],
            ["Do a quest", "did a quest", "build"],
            ["Tend your garden", "tended your garden", "fun"],
          ],
          animaljam: [
            ["Trade items", "traded items", "trade"],
            ["Play mini games", "played mini games", "fun"],
            ["Go on an adventure", "went on an adventure", "social"],
          ],
          leagueoflegends: [
            ["Play ranked", "played ranked", "compete"],
            ["Play normals", "played normal games", "fun"],
            ["Play ARAM", "played ARAM", "social"],
          ],
          xfire: [
            ["Chat while gaming", "chatted while gaming", "social"],
            ["Record a clip", "recorded a clip", "fun"],
            ["Join a clan", "joined a clan", "social"],
          ],
          gaiaonline: [
            ["Post in the forums", "posted in the forums", "social"],
            ["Shop for avatar items", "shopped for avatar items", "fun"],
            ["Trade items", "traded items", "trade"],
          ],
          secondlife: [
            ["Build something", "built something", "build"],
            ["Go to a club", "went to a virtual club", "social"],
            ["Shop for your avatar", "shopped for your avatar", "fun"],
          ],
          stardoll: [
            ["Dress up dolls", "dressed up dolls", "fun"],
            ["Decorate your suite", "decorated your suite", "build"],
            ["Shop for clothes", "shopped for clothes", "fun"],
          ],
        },
        gameActs = (e) => {
          const t = socYear(),
            a = (
              GAME_ACTS[socBase(e)] || [
                ["Play a game", "played a game", "fun"],
                ["Play with friends", "played with friends", "social"],
              ]
            ).filter((e) => !e[3] || t >= e[3]);
          return a.length ? a : [["Play a game", "played a game", "fun"]];
        };
      function gamePlay(e, [, t, a]) {
        const [, o, n] = socOf(e),
          s = state.social[e];
        s.postsYear++, (s.momentum = Math.min(10, s.momentum + 0.3));
        const r = Math.max(0.25, 1 - 0.2 * Math.max(0, s.postsYear - 3));
        let i = Math.round(rint(3, 7) * r),
          l = rint(0, 2),
          c = "",
          d = "Game on";
        const u = Math.random();
        "social" === a && u < 0.35
          ? ((l += rint(1, 6)),
            (i += 2),
            (d = "New friends"),
            (c = " You met some cool people and they added you."))
          : "trade" === a && u < 0.2
            ? ((i = -rint(4, 8)),
              (d = "Scammed"),
              (c = " Someone scammed you in a trade and logged off. You lost your best item."))
            : "trade" === a && u < 0.4
              ? ((i += 4), (d = "Huge trade"), (c = " You pulled off an amazing trade!"))
              : "compete" === a && u < 0.3
                ? ((i += 3), (d = "Victory"), (c = " You won!"))
                : "compete" === a && u < 0.5
                  ? ((i = Math.min(i, rint(-3, 1))),
                    (d = "Rage quit"),
                    (c = " You lost badly and rage quit."))
                  : "build" === a
                    ? ((state.stats.Smarts = clamp(state.stats.Smarts + rint(0, 1))),
                      u < 0.25 &&
                        ((i += 2), (d = "Masterpiece"), (c = " You're really proud of how it turned out.")))
                    : u < 0.08 &&
                      ((d = "Toxic lobby"),
                      (i = -rint(1, 4)),
                      (c = " Some kid screamed at you the whole time.")),
          (s.subs += l),
          (state.stats.Happiness = clamp(state.stats.Happiness + i)),
          renderStats();
        const h = t.replace(/\byour\b/g, "my");
        say(
          `I ${h} on ${o}.${"Scammed" === d ? " I got scammed in a trade." : "Victory" === d ? " I won!" : ""}`,
        ),
          notice(
            d,
            `You ${t} on ${o}.${c}${l ? `<br><br>You got ${fmtN(l)} new ${n}.` : ""}`,
            null,
            !0,
            `<div class="ev-bars nb"><b>Happiness</b><i><u style="width:${Math.max(1, state.stats.Happiness)}%;background:${barCol(state.stats.Happiness)}"></u></i></div>`,
          );
      }
      function stolenPost(e, t) {
        const [, a, o, n] = socOf(e),
          s = state.social[e],
          r = s.stolen;
        s.posts++, s.postsYear++;
        const i = Math.round(s.subs * (0.2 + 0.6 * Math.random())),
          l = Math.round(i * (0.08 + 0.12 * Math.random())),
          c = Math.min(s.subs, Math.round(s.subs * (0.03 + 0.07 * Math.random())));
        (s.subs -= c), (s.views += i), (s.viewsYear += i);
        let d = 0;
        if (s.monet) {
          const [t, a] = SOC_RPM[socBase(e)] || [0.5, 2];
          (d = Math.round((i / 1e3) * (t + Math.random() * (a - t)))),
            (state.money += d),
            (s.earned = (s.earned || 0) + d);
        }
        (state.stats.Happiness = clamp(state.stats.Happiness + rint(2, 6))), renderStats();
        const u = `${/^[AEIOU]/.test(t) ? "an" : "a"} ${t.toLowerCase()} ${n}`;
        say(
          `I posted ${u} on ${r.name}'s ${a} account. It got ${fmtN(l)} likes, but ${fmtN(c)} ${o} unfollowed.`,
        ),
          notice(
            pickR(["Going viral", "Blowing up", "Huge reach"]),
            `You posted ${u} on @${showHandle(e)}.<br><br>It got ${fmtN(i)} views and ${fmtN(l)} likes${d ? ` and made you ${usd(d)}` : ""}.<br><br>But ${pickR([`fans can tell it isn't really ${r.name}`, `people are asking if ${r.name} got hacked`, `the comments are full of "this isn't ${r.name}"`])}. You lost ${fmtN(c)} ${o}.`,
            null,
            !0,
          );
      }
      function stolenYear() {
        for (const e of Object.keys(state.social)) {
          const t = state.social[e],
            a = t && t.stolen;
          if (!a || state.dead || state.prison || state.age - a.age < 1) continue;
          if (!chance(a.big ? 0.7 : 0.45)) continue;
          const [, o] = socOf(e),
            n = showHandle(e);
          noteBans(),
            delete state.social[e],
            (state.myListings = (state.myListings || []).filter((t) => t.k !== e)),
            say(`${a.name}'s team got their ${o} account @${n} back and reported me to the police.`),
            queueRoll(() =>
              notice(
                "Account recovered",
                `${a.name}'s team got @${n} back from ${o}. They traced the sale to you and went to the police.`,
                () => arrest("account theft"),
                !0,
              ),
            );
          break;
        }
      }
      function socialPost(e, t) {
        const [, a, o, n] = socOf(e),
          s = state.social[e];
        if (s.stolen) return stolenPost(e, t);
        s.posts++, s.postsYear++, (s.momentum = Math.min(10, s.momentum + 0.6));
        const r = Math.max(0, s.subs - s.fake),
          i = chance(Math.min(0.5, 0.01 + 0.035 * s.momentum + (s.verified ? 0.05 : 0)));
        let l = i
          ? rint(2e4, 4e5) * (1 + s.momentum) * (chance(0.2) ? rint(3, 15) : 1)
          : rint(0, 8) + r * (0.05 + 0.55 * Math.random()) * (1 + 0.15 * s.momentum);
        l = Math.round(l);
        const c = Math.round(l * (0.02 + 0.06 * Math.random()) * (1 + 0.1 * s.momentum));
        let d = Math.round(l * (l < 50 ? 0.3 + 0.7 * Math.random() : 0.01 + 0.03 * Math.random())),
          u = 0;
        state.washedUp &&
          ((d = 0),
          (u = Math.min(s.subs, rint(1e3, 9e3))),
          (s.subs -= u),
          (s.fake = Math.min(s.fake, s.subs))),
          (s.subs += d),
          (s.views += l),
          (s.viewsYear += l),
          socialStarCheck(),
          (state.stats.Happiness = clamp(state.stats.Happiness + (u ? -rint(2, 5) : i ? 8 : 2))),
          renderStats();
        const h = "youtube" === e || "tiktok" === e,
          p = h
            ? "BitLife" === t || "Vlog" === t
              ? "Vlog" === t
                ? "a vlog"
                : "a video"
              : `${/^[AEIOU]/.test(t) ? "an" : "a"} ${t.toLowerCase()} video`
            : `${/^[AEIOU]/.test(t) ? "an" : "a"} ${t.toLowerCase()} ${n}`,
          m = h && SOC_TAIL[t] ? SOC_TAIL[t]() : "";
        let f = 0;
        if (s.monet && l) {
          const [t, a] = SOC_RPM[socBase(e)] || [0.5, 2];
          (f = Math.round((l / 1e3) * (t + Math.random() * (a - t)))),
            f > 0 && ((state.money += f), (s.earned = (s.earned || 0) + f), renderStats());
        }
        if (
          (say(
            `I posted ${p} on ${a}${m.replace(/\byou\b/g, "me")}. It got ${fmtN(l)} views${f > 0 ? ` and made me ${usd(f)}` : ""}.${u ? ` I lost ${fmtN(u)} ${o}.` : ""}`,
          ),
          u)
        )
          return notice(
            "Unfollowed",
            `You posted ${p} on ${a}${m}.<br><br>Your ${n} got ${fmtN(l)} views, but you lost ${fmtN(u)} ${o}. People only followed you for basketball.`,
            null,
            !0,
          );
        notice(
          i ? "Hit like & subscribe!" : "Let's go viral",
          `You posted ${p} on ${a}${m}.<br><br>Your ${n} got ${fmtN(l)} views and ${fmtN(c)} likes${d ? `, and you earned ${fmtN(d)} new ${o}` : ""}.`,
          null,
          !0,
        );
      }
      function socialBuy(e, t, a) {
        const [, o, n] = socOf(e),
          s = state.social[e];
        if (state.money < a)
          return notice("Not enough", `You need ${usd(a)} to buy ${fmtN(t)} ${n}.`, null, !0);
        (state.money -= a),
          renderStats(),
          s.buyAge !== state.age && ((s.buyAge = state.age), (s.buysYear = 0)),
          s.buysYear++,
          s.botYears.includes(state.age) || s.botYears.push(state.age),
          (s.subs += t),
          (s.fake += t);
        const r = Math.min(0.95, 0.04 + 0.06 * (s.buysYear - 1) + 0.12 * (s.botYears.length - 1));
        if (chance(r))
          return (
            (s.banned = !0),
            (s.banAge = state.age),
            say(`${o} disabled my account for buying ${n}.`),
            notice(
              "Account disabled",
              `${o} caught you using bots and disabled your account for buying ${n}. You'll have to appeal to get it back.`,
              null,
              !0,
            )
          );
        say(`I bought ${fmtN(t)} ${n} on ${o}.`),
          notice("Paid pals", `You bought ${fmtN(t)} ${n} on ${o}.`, null, !0);
      }
      const SOC_LAUNCH = {
          battlenet: 1996,
          neopets: 1999,
          xanga: 1999,
          habbo: 2e3,
          runescape: 2001,
          miniclip: 2001,
          xboxlive: 2002,
          friendster: 2002,
          steam: 2003,
          toontown: 2003,
          gaiaonline: 2003,
          secondlife: 2003,
          myspace: 2003,
          wow: 2004,
          xfire: 2004,
          stardoll: 2004,
          orkut: 2004,
          flickr: 2004,
          clubpenguin: 2005,
          webkinz: 2005,
          maplestory: 2005,
          bebo: 2005,
          roblox: 2006,
          psn: 2006,
          poptropica: 2007,
          moshimonsters: 2008,
          wizard101: 2008,
          minecraft: 2009,
          leagueoflegends: 2009,
          animaljam: 2010,
          path: 2010,
          googleplus: 2011,
          vine: 2013,
          yikyak: 2013,
          musically: 2014,
          periscope: 2015,
          hotmail: 1996,
          yahoo: 1997,
          gmail: 2004,
          linkedin: 2003,
          facebook: 2004,
          youtube: 2005,
          reddit: 2005,
          twitter: 2006,
          tumblr: 2007,
          soundcloud: 2008,
          instagram: 2010,
          pinterest: 2010,
          snapchat: 2011,
          twitch: 2011,
          telegram: 2013,
          patreon: 2013,
          discord: 2015,
          onlyfans: 2016,
          tiktok: 2016,
          bereal: 2020,
          kick: 2022,
          threads: 2023,
          bluesky: 2023,
          netflix: 1997,
          hulu: 2007,
          disneyplus: 2019,
        },
        socYear = () => state.birthYear + state.age,
        SOC_END = {
          bebo: 2013,
          xanga: 2013,
          toontown: 2013,
          orkut: 2014,
          friendster: 2015,
          xfire: 2015,
          vine: 2017,
          clubpenguin: 2017,
          yikyak: 2017,
          musically: 2018,
          path: 2018,
          googleplus: 2019,
          moshimonsters: 2019,
          periscope: 2021,
        },
        socEnded = (e) => !!SOC_END[socBase(e)] && socYear() >= SOC_END[socBase(e)],
        socLive = (e) => socYear() >= (SOC_LAUNCH[socBase(e)] || 0) && !socEnded(e),
        SOC_MINLEN = {
          gmail: 6,
          yahoo: 4,
          facebook: 5,
          youtube: 3,
          reddit: 3,
          snapchat: 3,
          linkedin: 3,
          pinterest: 3,
          tumblr: 3,
          soundcloud: 3,
          patreon: 3,
          kick: 3,
          tiktok: 2,
          discord: 2,
        },
        SOC_NAME_MULT = {
          roblox: 0.7,
          xboxlive: 0.6,
          minecraft: 0.5,
          steam: 0.5,
          runescape: 0.3,
          psn: 0.4,
          leagueoflegends: 0.3,
          myspace: 0.15,
          vine: 0.15,
          musically: 0.1,
          battlenet: 0.1,
          wow: 0.1,
          clubpenguin: 0.05,
          maplestory: 0.04,
          habbo: 0.03,
          neopets: 0.04,
          webkinz: 0.01,
          miniclip: 0.01,
          poptropica: 0.01,
          moshimonsters: 0.01,
          toontown: 0.02,
          wizard101: 0.02,
          animaljam: 0.02,
          xfire: 0.01,
          gaiaonline: 0.02,
          secondlife: 0.03,
          stardoll: 0.01,
          bebo: 0.02,
          friendster: 0.01,
          xanga: 0.01,
          googleplus: 0.01,
          orkut: 0.01,
          periscope: 0.03,
          path: 0.01,
          yikyak: 0.02,
          flickr: 0.03,
          gmail: 0.5,
          yahoo: 0.35,
          hotmail: 0.3,
          instagram: 1.3,
          twitter: 1.2,
          tiktok: 1.2,
          snapchat: 1,
          telegram: 0.9,
          twitch: 0.8,
          threads: 0.7,
          youtube: 0.6,
          discord: 0.6,
          kick: 0.6,
          onlyfans: 0.5,
          pinterest: 0.5,
          linkedin: 0.5,
          bluesky: 0.5,
          facebook: 0.4,
          reddit: 0.4,
          tumblr: 0.4,
          soundcloud: 0.4,
          patreon: 0.4,
          bereal: 0.3,
          netflix: 0.01,
          hulu: 0.01,
          disneyplus: 0.01,
        },
        SWAT_PLAT = new Set(["instagram", "twitter", "tiktok", "snapchat", "telegram", "threads", "discord"]),
        SN = window.SOCIAL_NAMES || { words: "", bigBrands: "", brands: "" },
        WORD_RANK = new Map(
          SN.words
            .split(" ")
            .filter(Boolean)
            .map((e, t) => [e, t]),
        ),
        WIKI_RANK = new Map(
          String(window.WIKI_WORDS || "")
            .split(" ")
            .filter(Boolean)
            .map((e, t) => [e, t]),
        ),
        wordRank = (e) =>
          WORD_RANK.has(e) ? WORD_RANK.get(e) : WIKI_RANK.has(e) ? 1500 + WIKI_RANK.get(e) : null,
        RANK_MAX = Math.max(WORD_RANK.size, 1500 + WIKI_RANK.size),
        nameCommon = (e) => Math.max(0, Math.min(1, (8 - pwStrength(String(e).replace(/[._ ]/g, ""))) / 7)),
        nameSpammy = (e) => pwStrength(String(e).replace(/[._ ]/g, "")) >= 9,
        BIG_BRANDS = new Set(SN.bigBrands.split(" ")),
        BRANDS = new Set(SN.brands.split(" ")),
        CELEBS = new Map(
          "drake:2009:Drake:1|eminem:1999:Eminem:1|kanyewest:2004:Kanye West:1|jayz:1996:Jay-Z:1|lilwayne:2004:Lil Wayne|50cent:2003:50 Cent\n    |snoopdogg:1993:Snoop Dogg:1|kendricklamar:2011:Kendrick Lamar:1|jcole:2011:J. Cole|travisscott:2015:Travis Scott:1|postmalone:2015:Post Malone:1\n    |nickiminaj:2010:Nicki Minaj:1|cardib:2017:Cardi B|megantheestallion:2019:Megan Thee Stallion|dojacat:2019:Doja Cat|lilnasx:2019:Lil Nas X\n    |badbunny:2017:Bad Bunny:1|theweeknd:2011:The Weeknd:1|rihanna:2005:Rihanna:1|beyonce:2003:Beyonce:1|taylorswift:2006:Taylor Swift:1\n    |justinbieber:2009:Justin Bieber:1|arianagrande:2013:Ariana Grande:1|billieeilish:2017:Billie Eilish:1|selenagomez:2008:Selena Gomez:1\n    |ladygaga:2008:Lady Gaga:1|katyperry:2008:Katy Perry|brunomars:2010:Bruno Mars|edsheeran:2011:Ed Sheeran:1|harrystyles:2012:Harry Styles:1\n    |dualipa:2017:Dua Lipa|oliviarodrigo:2021:Olivia Rodrigo|sza:2017:SZA|mileycyrus:2006:Miley Cyrus|shakira:2001:Shakira|adele:2008:Adele:1\n    |bts:2017:BTS:1|blackpink:2016:BLACKPINK:1|sabrinacarpenter:2024:Sabrina Carpenter|iceSpice:2023:Ice Spice|21savage:2016:21 Savage\n    |zendaya:2010:Zendaya:1|tomholland:2016:Tom Holland|timotheechalamet:2017:Timothee Chalamet|margotrobbie:2013:Margot Robbie\n    |therock:2001:The Rock:1|kevinhart:2010:Kevin Hart|leonardodicaprio:1997:Leonardo DiCaprio:1|bradpitt:1995:Brad Pitt|tomcruise:1986:Tom Cruise\n    |willsmith:1996:Will Smith:1|keanureeves:1999:Keanu Reeves|ryanreynolds:2016:Ryan Reynolds|jenniferlawrence:2012:Jennifer Lawrence\n    |scarlettjohansson:2004:Scarlett Johansson|chrishemsworth:2011:Chris Hemsworth|sydneysweeney:2022:Sydney Sweeney|mrbeast:2018:MrBeast:1\n    |pewdiepie:2012:PewDiePie:1|kimkardashian:2007:Kim Kardashian:1|kyliejenner:2014:Kylie Jenner:1|khaby:2020:Khaby Lame|ishowspeed:2022:IShowSpeed\n    |kaicenat:2023:Kai Cenat|tomhanks:1995:Tom Hanks:1|denzelwashington:1995:Denzel Washington|morganfreeman:1995:Morgan Freeman\n    |samuelljackson:1997:Samuel L. Jackson|robertdowneyjr:2008:Robert Downey Jr.:1|chrisevans:2011:Chris Evans|vindiesel:2001:Vin Diesel:1\n    |jasonmomoa:2018:Jason Momoa|gal_gadot:2017:Gal Gadot|emmawatson:2001:Emma Watson:1|angelinajolie:1999:Angelina Jolie:1|jackiechan:1998:Jackie Chan:1\n    |jennifer_aniston:1995:Jennifer Aniston|sandrabullock:1995:Sandra Bullock|johnnydepp:2003:Johnny Depp:1|pedropascal:2023:Pedro Pascal\n    |jennaortega:2022:Jenna Ortega|florencepugh:2022:Florence Pugh|austinbutler:2022:Austin Butler|ryangosling:2011:Ryan Gosling"
            .split("|")
            .map((e) => {
              const [t, a, o, n] = e.trim().split(":");
              return [t.toLowerCase(), { year: +a, name: o, big: !!n }];
            }),
        ),
        celebOf = (e) => {
          const t = CELEBS.get(String(e || "").toLowerCase());
          return t && socYear() >= t.year ? t : null;
        };
      function nameValue(e, t) {
        t = socBase(t);
        const a = (e = String(e || "").toLowerCase()).length,
          o = /^[a-z]+$/.test(e),
          n = /^[a-z0-9]+$/.test(e),
          s = /^[0-9]+$/.test(e);
        if (SOC_END[t] && socYear() >= SOC_END[t]) return 0;
        if ("roblox" === t && /[ .]/.test(e)) {
          const t = socYear();
          if (t < 2007) return 40;
          const o = e.includes(" "),
            n = o ? 4e3 : 2500,
            s = Math.min(1, (t - 2007) / 19);
          return Math.round(
            (o ? 300 : 200) +
              (n - (o ? 300 : 200)) * s * (t > 2026 ? 1 + 0.06 * (t - 2026) : 1) * (a <= 6 ? 1.4 : 1),
          );
        }
        if (!a || !n)
          return /^[a-z]{2,8}[._][a-z]{2,8}$/.test(e) && null != wordRank(e.replace(/[._]/, "")) ? 150 : 0;
        let r = 0;
        const i = celebOf(e);
        i && (r = i.big ? 4e5 : 15e4),
          BIG_BRANDS.has(e)
            ? (r = 4e5 + (e.length <= 5 ? 2e5 : 0))
            : BRANDS.has(e) && (r = 1e5 + 25e3 * Math.max(0, 8 - a)),
          1 === a
            ? (r = Math.max(r, o ? 4e5 : 15e4))
            : 2 === a
              ? (r = Math.max(r, o ? 8e4 : 25e3))
              : 3 === a
                ? (r = Math.max(r, o ? 15e3 : s ? 5e3 : 3e3))
                : 4 === a && (r = Math.max(r, o ? 1500 : s ? 800 : 0));
        const l = o ? (wordRank(e) ?? (a >= 4 && a <= 9 && nameCommon(e) > 0.55 ? 2500 : null)) : null;
        null != l && (r = Math.max(r, (25e3 / Math.pow(1 + l / 400, 0.95)) * (a <= 5 ? 1.3 : 1))),
          o && a <= 12 && (r = Math.max(r, 160 - 10 * a));
        const c = nameCommon(e);
        if (
          (a <= 10 && c > 0.4 && (r = Math.max(r, Math.round(c * c * 900))),
          nameSpammy(e)
            ? (r = Math.min(r, 5))
            : c < 0.1 && !i && !BIG_BRANDS.has(e) && !BRANDS.has(e) && (r *= 0.3),
          "discord" === t)
        ) {
          const t = null != wordRank(e) || BIG_BRANDS.has(e) || BRANDS.has(e) || i;
          return Math.round(Math.max(a <= 2 ? 0 : t ? 0.6 * r : 0.15 * r, dcNameBase(e)) * dcYearMult());
        }
        const d = Math.max(0, socYear() - (SOC_LAUNCH[t] || 2004));
        return Math.round(r * (SOC_NAME_MULT[t] || 0.5) * Math.min(1.2, 0.25 + 0.1 * d));
      }
      function dcNameBase(e) {
        const t = e.length,
          a = /^[a-z]+$/.test(e),
          o = /^[0-9]+$/.test(e);
        return 2 === t
          ? a
            ? 7500
            : 5e3
          : 3 === t
            ? o
              ? 1e5
              : a
                ? 2e4
                : 6e3
            : 4 === t
              ? a
                ? 2500
                : o
                  ? 1500
                  : 0
              : 0;
      }
      const dcYearMult = () => {
        const e = socYear();
        return e < 2023 ? 0.03 : 2023 === e ? 0.5 : 2024 === e ? 0.8 : 1 + 0.12 * (e - 2025);
      };
      function nameTaken(e, t) {
        if (((t = socBase(t)), (e = String(e || "").toLowerCase()), "discord" === t && socYear() < 2023))
          return 0;
        const a = nameValue(e, t),
          o =
            Math.max(0, socYear() - ("discord" === t ? 2023 : SOC_LAUNCH[t] || 2004)) +
            ("discord" === t ? 5 : 0),
          n = CELEBS.get(e);
        if (n) return socYear() >= n.year ? 0.99 : 0.03;
        if (e.length <= 2) return o >= 1 ? 0.995 : 0.6;
        if (3 === e.length) return Math.min(0.99, 0.35 + 0.3 * o);
        const s =
          BIG_BRANDS.has(e) || BRANDS.has(e) ? 1 : null != wordRank(e) ? 1 - wordRank(e) / RANK_MAX : -1;
        if (nameSpammy(e)) return 0.02;
        if (s >= 0) return Math.min(0.99, 0.04 + o * (0.08 + 0.22 * s) + (a >= 1e4 ? 0.1 * o : 0));
        const r = nameCommon(e);
        return r > 0.2
          ? Math.min(0.98, 0.04 + o * (0.04 + 0.22 * r * r))
          : a < 1e3
            ? 0.04 + Math.min(0.2, 0.01 * o)
            : Math.min(0.98, 0.04 + ((o + 1) / 6) * (0.3 + 0.7 * Math.min(1, a / 5e4)));
      }
      const cleanHandle = (e) =>
          String(e || "")
            .toLowerCase()
            .replace(/[^a-z0-9._]/g, "")
            .slice(0, 15),
        cleanFor = (e, t) =>
          "roblox" !== socBase(e)
            ? cleanHandle(t)
            : socYear() < 2007
              ? String(t || "")
                  .toLowerCase()
                  .replace(/[^a-z0-9._ ]/g, "")
                  .replace(/\s+/g, " ")
                  .trim()
                  .slice(0, 15)
              : String(t || "")
                  .toLowerCase()
                  .replace(/[^a-z0-9_]/g, "")
                  .slice(0, 15),
        junkHandle = () => `user${rint(1e6, 9999999)}`;
      function handleOf(e) {
        const t = state.social[e];
        if (!t) return "";
        if (!t.handle) {
          const a = cleanHandle(document.getElementById("pname").textContent.replace(/\s+/g, "")) || "user";
          t.handle =
            a.length >= (SOC_MINLEN[socBase(e)] || 1) && !chance(nameTaken(a, e))
              ? a
              : `${a}${rint(1, 9999)}`;
        }
        return (
          t.hSeen &&
            t.hSeen !== t.handle &&
            ((t.pastH ||= []).push(t.hSeen), (t.pastH = t.pastH.filter((e) => e !== t.handle).slice(-10))),
          (t.hSeen = t.handle),
          t.handle
        );
      }
      const disabledTxt = (e) => {
          const t = pastHandles(e);
          return t.length ? `Disabled · was @${t[t.length - 1]}` : "Disabled";
        },
        pastHandles = (e) => {
          const t = state.social[e];
          return (
            handleOf(e),
            [...new Set([...(t.pastH || []), t.lostHandle, t.hackHandle].filter((e) => e && e !== t.handle))]
          );
        },
        dcTagged = (e) => "discord" === socBase(e) && socYear() < 2023,
        showHandle = (e) => {
          const t = state.social[e];
          if (!t) return "";
          const a = handleOf(e);
          return dcTagged(e) ? `${a}#${(t.disc ||= String(rint(1, 9999)).padStart(4, "0"))}` : a;
        },
        valueWord = (e) =>
          e >= 1e5 ? "extremely rare" : e >= 1e4 ? "very rare" : e >= 1e3 ? "rare" : "common",
        usualPw = () =>
          (state.usualPw ||= `${String(state.first || "user")
            .toLowerCase()
            .replace(
              /[^a-z]/g,
              "",
            )}${pickR([String(state.birthYear).slice(2), String(state.birthYear), "123", "1234", "!"])}`),
        uniquePw = () =>
          Array.from(
            { length: 12 },
            () => "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!#$%"[rint(0, 58)],
          ).join(""),
        acctMade = (e) => socYear() - (e.years || 0),
        pwScoreCache = {};
      function pwStrength(e) {
        if (((e = String(e || "")), null != pwScoreCache[e])) return pwScoreCache[e];
        let t = Math.min(20, e.length);
        try {
          window.zxcvbn && (t = zxcvbn(e).guesses_log10);
        } catch {}
        return (pwScoreCache[e] = t);
      }
      function pwOf(e) {
        const t = state.social[e];
        return t.pw || ((t.pw = chance(0.5) ? usualPw() : uniquePw()), (t.pwY = acctMade(t))), t.pw;
      }
      function setPw(e, t) {
        const a = state.social[e],
          o = pwOf(e);
        (a.pwHist ||= []).push({ pw: o, from: a.pwY ?? acctMade(a), until: socYear() }),
          (a.pwHist = a.pwHist.slice(-8)),
          (a.pw = t),
          (a.pwY = socYear());
      }
      function pwAt(e, t) {
        const a = state.social[e],
          o = pwOf(e);
        if ((a.pwY ?? 0) <= t) return o;
        const n = (a.pwHist || []).find((e) => e.from <= t && t < e.until);
        return n ? n.pw : o;
      }
      const pwUses = (e) => Object.keys(state.social).filter((t) => state.social[t].pw === e),
        emailPwOf = (e) => (
          e.pw || ((e.pw = chance(0.5) ? usualPw() : uniquePw()), (e.pwY = e.made || socYear())), e.pw
        ),
        mailPwUses = (e) => (state.emails || []).filter((t) => emailPwOf(t) === e),
        pwReuse = (e, t) =>
          pwUses(e).filter((e) => e !== t).length +
          mailPwUses(e).filter((e) => e !== t).length +
          ("bank" !== t && bankPwOf() === e ? 1 : 0),
        bankPwOf = () => (
          state.bankPw ||
            ((state.bankPw = chance(0.5) ? usualPw() : uniquePw()), (state.bankPwY = socYear())),
          state.bankPw
        ),
        escAttr = (e) =>
          String(e).replace(/[&"<>]/g, (e) => ({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" })[e]);
      function signUpWithPw(e, t, a, o) {
        if ("roblox" === socBase(e) && rbxEraPage(a)) return;
        if ("xboxlive" === socBase(e) && xblEraPage(e, a, o)) return;
        if ("discord" === socBase(e) && dcEraPage(e, a, o)) return;
        if ("youtube" === socBase(e) && ytEraPage(e, a, o)) return;
        const n = (n) =>
          pwCard(t, (t) => {
            socialSignup(e, a, n);
            const s = state.social[e];
            s && ((s.pw = t), (s.pwY = socYear())), o && o();
          });
        if (notSocial(e)) return n();
        const s = cleanHandle(document.getElementById("pname").textContent.replace(/\s+/g, "")) || "user",
          r = npcOwner(socBase(e), s);
        handleCard(
          e,
          t,
          s.length >= (SOC_MINLEN[socBase(e)] || 1) && (!r || r.sold)
            ? s
            : `${s.slice(0, 11)}${rint(1, 9999)}`,
          n,
        );
      }
      const RBX06_CSS =
          '<style>\n    .rb06{background:#fff;color:#000;font-family:"Comic Sans MS","Comic Neue","Chalkboard SE",cursive;padding:0 0 14px;min-height:100%}\n    .rb06 .bn{display:block;width:100%;height:auto;border-bottom:1px solid #000}\n    .rb06 .pg{padding:10px 16px 0}\n    .rb06 h3{font-size:17px;font-weight:700;letter-spacing:1.5px;margin:6px 0 14px}\n    .rb06 h4{font-size:13.5px;font-weight:700;margin:14px 0 8px}\n    .rb06 .f{display:flex;align-items:center;justify-content:flex-end;gap:6px;font-size:12.5px;margin:0 0 6px}\n    .rb06 .f input,.rb06 .f select{width:58%;height:24px;border:1px solid #7a7a7a;border-radius:2px;font:13px Tahoma,Verdana,sans-serif;padding:0 4px;background:#fff;color:#000}\n    .rb06 .hint{font-style:italic;font-size:11.5px;margin:4px 0 0;color:#000}\n    .rb06 .warn{font-size:11px;color:#b00;margin-top:3px;min-height:13px}\n    .rb06 .reg{display:block;margin:16px auto 8px;width:62%;padding:7px 0;background:#f5ca2c;border:2px solid #7a7a7a;font:inherit;font-size:21px;color:#000;cursor:pointer}\n    .rb06 .reg:active{background:#e0b51a}\n    .rb06 .side{background:#ddd;margin:14px 16px 0;padding:10px 12px;font-family:"Comic Sans MS","Comic Neue",cursive;font-size:11.5px;line-height:1.45}\n    .rb06 .side b{display:block;font-size:14px;letter-spacing:1px;margin-bottom:4px}\n    .rb06 a{color:#00e;text-decoration:underline;cursor:pointer}\n    .rb06 .ft{border-top:1px solid #999;margin:14px 16px 0;padding-top:6px;font:10px Verdana,Tahoma,sans-serif;text-align:center;line-height:1.5}\n  </style>',
        savedPws = () => {
          const e = new Map(),
            t = (t, a) => {
              t && (e.get(t) || e.set(t, []).get(t)).push(a);
            };
          for (const e in state.social) {
            const a = state.social[e];
            !a.stranger && a.pw && t(a.pw, socOf(e) ? socOf(e)[1] : e);
          }
          return (
            (state.emails || []).forEach((e) => t(e.pw, e.addr.split("@")[1])),
            state.bankPw && t(state.bankPw, bankFor()),
            e.size || t(usualPw(), "your usual password"),
            [...e.entries()].map(([e, t]) => ({ pw: e, where: [...new Set(t)] }))
          );
        };
      function pwAutofill(e, t, a = 99) {
        const o = e.parentElement;
        o.style.position = "relative";
        const n = document.createElement("div");
        (n.style.cssText =
          "position:absolute;z-index:20;background:#fff;border:1px solid #7f9db9;box-shadow:2px 2px 3px rgba(0,0,0,.3);box-sizing:border-box;font:11px Tahoma,Verdana,sans-serif;color:#000;display:none;text-align:left;max-height:150px;overflow:auto"),
          o.append(n);
        const s = () => {
          const o = savedPws();
          o.length &&
            ((n.innerHTML = o
              .map((e, t) => {
                const o = e.pw.length <= a && !/\s/.test(e.pw);
                return `<div data-i="${t}" style="padding:3px 6px;cursor:${o ? "default" : "not-allowed"};${o ? "" : "color:#999;"}border-bottom:1px solid #eef"><b style="font-weight:700">${escAttr(e.pw)}</b><div style="color:${o ? "#555" : "#aaa"};font-size:10px">${escAttr(e.where.slice(0, 3).join(", "))}${e.where.length > 3 ? "…" : ""}${o ? "" : " · too long for this site"}</div></div>`;
              })
              .join("")),
            n.querySelectorAll("[data-i]").forEach((e) => {
              const s = o[+e.dataset.i],
                r = s.pw.length <= a && !/\s/.test(s.pw);
              (e.onmouseenter = () => {
                r && ((e.style.background = "#316ac5"), (e.style.color = "#fff"));
              }),
                (e.onmouseleave = () => {
                  (e.style.background = ""), (e.style.color = r ? "" : "#999");
                }),
                (e.onmousedown = (e) => {
                  e.preventDefault(),
                    r &&
                      (t.forEach((e) => {
                        (e.value = s.pw), e.dispatchEvent(new Event("input"));
                      }),
                      (n.style.display = "none"),
                      play("choice"));
                });
            }),
            Object.assign(n.style, {
              left: `${e.offsetLeft}px`,
              top: `${e.offsetTop + e.offsetHeight}px`,
              width: `${Math.max(150, e.offsetWidth)}px`,
            }),
            (n.style.display = ""));
        };
        e.addEventListener("focus", s),
          e.addEventListener("click", s),
          e.addEventListener("blur", () =>
            setTimeout(() => {
              n.style.display = "none";
            }, 120),
          );
      }
      const xblNewKey = () => {
        if (!state.social.xboxlive) return "xboxlive";
        let e = 2;
        for (; state.social[`xboxlive~${e}`]; ) e++;
        return `xboxlive~${e}`;
      };
      function xblEraPage(e, t, a) {
        const o = socYear();
        return o >= 2003 && o <= 2007
          ? (xbox2003Home(e, t, a), !0)
          : 2008 === o || 2009 === o
            ? (xbox2009Home(e, t, a), !0)
            : (2010 === o || 2011 === o) && (xbox2011Home(e, t, a), !0);
      }
      const dcNewKey = () => {
        if (!state.social.discord) return "discord";
        let e = 2;
        for (; state.social[`discord~${e}`]; ) e++;
        return `discord~${e}`;
      };
      function dcEraPage(e, t, a) {
        return 2015 === socYear()
          ? (dc2015Home(e, t, a), !0)
          : 2016 === socYear()
            ? (dc2016Home(e, t, a), !0)
            : socYear() >= 2017 && socYear() <= 2019
              ? (dc2019Auth(e, t, a, "up"), !0)
              : socYear() >= 2021 && (dc2021Home(e, t, a), !0);
      }
      const DC15_CSS =
          "<style>\n    @font-face{font-family:'Whitney15';font-weight:300;src:url(social/discord/whitney300.woff) format('woff')}\n    @font-face{font-family:'Whitney15';font-weight:500;src:url(social/discord/whitney500.woff) format('woff')}\n    @font-face{font-family:'Whitney15';font-weight:600;src:url(social/discord/whitney600.woff) format('woff')}\n    @font-face{font-family:'Reenie15';src:url(social/discord/reenie.woff) format('woff')}\n    .dc15{background:#2e3136;color:#fff;font-family:'Whitney15','Helvetica Neue',Helvetica,Arial,sans-serif;min-height:100%;overflow:hidden}\n    .dc15 .d5hero{background:#1e2124 url(social/discord/2015-bg.jpg) center/cover no-repeat;padding:0 16px 10px;position:relative}\n    .dc15 .d5nav{display:flex;align-items:center;height:62px}\n    .dc15 .d5logo{width:108px;height:30px;background:url(social/discord/2015-logo.png) center/contain no-repeat}\n    .dc15 .d5soc{margin-left:auto;display:flex;align-items:center;gap:14px;font-size:14px}\n    .dc15 .d5soc a{color:#fff;cursor:pointer}\n    .dc15 .d5soc i{display:block;width:16px;height:16px;background:center/contain no-repeat;cursor:pointer}\n    .dc15 .d5soc .d5tw{background-image:url(social/discord/2015-twitter.svg)}\n    .dc15 .d5soc .d5fb{background-image:url(social/discord/2015-facebook.svg)}\n    .dc15 .d5soc b{width:4px;height:4px;border-radius:50%;background:#fff;opacity:.6}\n    .dc15 h1{font-weight:300;font-size:26px;line-height:36px;margin:14px 0 0;padding-bottom:12px}\n    .dc15 .d5hero p{font-weight:300;font-size:15px;line-height:21px;color:#ebebeb;margin:0 0 14px}\n    .dc15 .d5fb2{position:relative;margin:24px 0 58px;width:250px;max-width:100%;height:50px;display:flex;border-radius:25px}\n    .dc15 .d5fld{display:none;flex-grow:1;min-width:0;border:0;border-radius:25px;padding:0 70px 0 22px;font:500 16px 'Whitney15','Helvetica Neue',Arial,sans-serif;color:#99aab5;outline:none;background:#fff}\n    .dc15 .d5fld::placeholder{color:#bdc8cf}\n    .dc15 .d5btn{position:absolute;top:0;right:0;bottom:0;width:250px;height:50px;border:0;padding:0;border-radius:25px;background:#43b581;color:#fff;cursor:pointer;overflow:hidden;\n      text-transform:uppercase;white-space:nowrap;font:600 15px 'Whitney15','Helvetica Neue',Arial,sans-serif;outline:none;transition:350ms cubic-bezier(.25,.25,.315,1.35)}\n    .dc15 .d5btn span{position:absolute;top:4px;left:4px;right:4px;line-height:42px;border-radius:21px;background:#43b581;transition:background-color 350ms}\n    .dc15 .d5btn:active,.dc15 .d5btn:active span{background-color:#3ca374}\n    .dc15 .d5btn::after{content:'';position:absolute;top:0;left:-60px;width:60px;height:50px;background:url(social/discord/2015-go.svg) center/24px auto no-repeat;transition:350ms cubic-bezier(.25,.25,.315,1.35)}\n    .dc15 .d5fb2.d5open .d5fld{display:block}\n    .dc15 .d5fb2.d5open .d5btn{width:60px;text-indent:60px;background:#fff}\n    .dc15 .d5fb2.d5open .d5btn::after{left:0}\n    .dc15 .d5arw{position:absolute;left:150px;bottom:-46px;width:170px;text-align:center;font:22px/22px 'Reenie15','Comic Sans MS',cursive;color:#ebebeb}\n    .dc15 .d5arw::before{content:'';position:absolute;left:-58px;bottom:6px;width:72px;height:30px;background:url(social/discord/2015-arrow.svg) 0 0/72px 30px no-repeat}\n    .dc15 .d5arw.d5err{color:#f8a3a3;padding-left:10px}\n    .dc15 .d5arw.d5err::before{background-image:url(social/discord/2015-arrow-err.svg)}\n    .dc15 .d5art{position:relative;height:0;padding-bottom:58%;margin:0 -16px 0 0}\n    .dc15 .d5art .d5dt{position:absolute;inset:0 0 0 0;background:url(social/discord/2015-desktop.png) left top/auto 100% no-repeat}\n    .dc15 .d5art .d5an{position:absolute;right:4%;bottom:-6%;width:24%;height:88%;background:url(social/discord/2015-android.png) center bottom/contain no-repeat}\n    .dc15 .d5ft{background:#282b30;padding:18px 16px 20px;text-align:center;font-size:13px;color:#8a8e94}\n    .dc15 .d5ft div{display:flex;justify-content:center;flex-wrap:wrap;gap:6px 16px;margin-top:10px}\n    .dc15 .d5ft a{color:#b9bbbe;cursor:pointer}\n    .dc15 .d5cl{background:#1e2124 url(social/discord/2015-bg.jpg) center/cover no-repeat;padding:0 16px 40px;min-height:430px}\n    .dc15 .d5box{background:#fff;border-radius:5px;box-shadow:0 2px 10px rgba(0,0,0,.4);padding:26px 22px 22px;color:#737f8d;max-width:420px;margin:30px auto 0}\n    .dc15 .d5box h2{font:600 19px 'Whitney15','Helvetica Neue',Arial,sans-serif;color:#4f545c;text-transform:uppercase;letter-spacing:.3px;margin:0 0 6px;text-align:center}\n    .dc15 .d5box .d5sub{text-align:center;font-size:14px;color:#99aab5;margin:0 0 18px;line-height:1.4}\n    .dc15 .d5box label{display:block;font:600 12px 'Whitney15','Helvetica Neue',Arial,sans-serif;text-transform:uppercase;color:#87909c;letter-spacing:.4px;margin:14px 0 6px}\n    .dc15 .d5box input,.dc15 .d5box select{display:block;width:100%;height:40px;box-sizing:border-box;border:1px solid #d9d9d9;border-radius:3px;background:#fafafa;padding:0 10px;\n      font:500 15px 'Whitney15','Helvetica Neue',Arial,sans-serif;color:#4f545c;outline:none}\n    .dc15 .d5box input:focus,.dc15 .d5box select:focus{border-color:#7289da}\n    .dc15 .d5go{display:block;width:100%;height:44px;margin-top:20px;border:0;border-radius:3px;background:#7289da;color:#fff;font:600 15px 'Whitney15','Helvetica Neue',Arial,sans-serif;cursor:pointer}\n    .dc15 .d5go:active{background:#677bc4}\n    .dc15 .d5w{color:#f04747;font-size:13px;min-height:16px;margin-top:10px;text-align:center}\n    .dc15 .d5alt{text-align:center;font-size:14px;margin-top:12px;color:#99aab5}\n    .dc15 .d5alt a{color:#7289da;cursor:pointer}\n  </style>",
        DC15_FOOT =
          '<div class="d5ft">Discord &copy; 2015 All Rights Reserved<div><a>Help</a><a>Blog</a><a>Download</a><a>Privacy</a><a>Contact</a></div></div>';
      function dc2015Head() {
        return '<div class="d5nav"><div class="d5logo" id="d5home"></div><div class="d5soc"><a id="d5li">Login</a><b></b><i class="d5tw"></i><i class="d5fb"></i></div></div>';
      }
      function dc2015Wire(e, t, a) {
        const o = (e) => document.getElementById(e);
        (o("d5home").onclick = () => {
          play("choice"), dc2015Home(e, t, a);
        }),
          (o("d5li").onclick = () => {
            play("choice"), dc2015Auth(e, t, a, "in");
          });
      }
      function dc2015Home(e, t, a) {
        (sTitle.textContent = "DISCORD"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial),
          (sList.innerHTML =
            DC15_CSS +
            `<div class="dc15"><div class="d5hero">${dc2015Head()}\n      <h1>It's time to ditch Skype and TeamSpeak. Discord is here.</h1>\n      <p>All-in-one voice and text chat for gamers that&rsquo;s free, secure, and works on both your desktop and phone. Stop paying for TeamSpeak servers and hassling with Skype. Simplify your life.</p>\n      <p>You'll never go back.</p>\n      <form class="d5fb2" id="d5f" onsubmit="return false"><input class="d5fld" id="d5u" placeholder="enter a username" maxlength="32" autocomplete="off" spellcheck="false">\n        <button class="d5btn" id="d5b" type="submit"><span>Try Discord now, it's free</span></button>\n        <span class="d5arw" id="d5a">no download<br>required</span></form>\n      <div class="d5art"><div class="d5dt"></div><div class="d5an"></div></div></div>${DC15_FOOT}</div>`),
          (sList.scrollTop = 0),
          dc2015Wire(e, t, a);
        const o = (e) => document.getElementById(e),
          n = o("d5f"),
          s = o("d5u"),
          r = o("d5a"),
          i = (e) => {
            (r.className = "d5arw d5err"), (r.textContent = e);
          };
        (o("d5b").onclick = () => {
          if ((play("choice"), !n.classList.contains("d5open")))
            return n.classList.add("d5open"), void setTimeout(() => s.focus(), 50);
          const o = String(s.value || "")
            .trim()
            .replace(/\s+/g, " ");
          return o.length < 2
            ? i("must be between 2 and 32 characters")
            : isBadName(o)
              ? i("that username isn't allowed")
              : void dc2015Auth(e, t, a, "up", o);
        }),
          screen.classList.add("open");
      }
      function dc2015Auth(e, t, a, o, n) {
        const s = (state.emails || []).filter((e) => !e.hacked);
        (sTitle.textContent = "DISCORD"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => dc2015Home(e, t, a));
        const r = s
          .map((e) => `<option${e.addr === t ? " selected" : ""}>${escAttr(e.addr)}</option>`)
          .join("");
        (sList.innerHTML =
          DC15_CSS +
          `<div class="dc15"><div class="d5cl">${dc2015Head()}<div class="d5box">` +
          ("in" === o
            ? `<h2>Welcome back!</h2><div class="d5sub">We're so excited to see you again!</div>\n        <label>Email</label><select id="d5e">${r}</select>\n        <label>Password</label><input type="password" id="d5p" maxlength="128" autocomplete="off">\n        <button class="d5go" id="d5in">Login</button><div class="d5w" id="d5w"></div>\n        <div class="d5alt">Need an account? <a id="d5up">Register</a></div>`
            : `<h2>Claim your account</h2><div class="d5sub">Hey <b style="color:#4f545c">${escAttr(n)}</b>! Add an email and password so you never lose your account.</div>\n        <label>Email</label><select id="d5e">${r}</select>\n        <label>Password</label><input type="password" id="d5p" maxlength="128" autocomplete="off">\n        <button class="d5go" id="d5go">Claim Account</button><div class="d5w" id="d5w"></div>\n        <div class="d5alt">Already have an account? <a id="d5bk">Login</a></div>`) +
          `</div></div>${DC15_FOOT}</div>`),
          (sList.scrollTop = 0),
          dc2015Wire(e, t, a);
        const i = (e) => document.getElementById(e),
          l = i("d5w");
        if (
          (s.length || (l.textContent = "You need an email address first."),
          pwAutofill(i("d5p"), [i("d5p")], 128),
          "in" === o)
        )
          return (
            (i("d5up").onclick = () => {
              play("choice"), dc2015Home(e, t, a);
            }),
            (i("d5in").onclick = () => {
              play("choice"), (l.textContent = "");
              const e = i("d5e").value,
                t = i("d5p").value,
                a = Object.keys(state.social).find(
                  (t) => "discord" === socBase(t) && !state.social[t].stranger && state.social[t].email === e,
                );
              a && pwOf(a) === t
                ? state.social[a].banned
                  ? (l.textContent = "This account has been disabled.")
                  : openSocialAccount(a)
                : (l.textContent = "Email or password is invalid.");
            }),
            screen.classList.add("open")
          );
        (i("d5bk").onclick = () => {
          play("choice"), dc2015Auth(e, t, a, "in");
        }),
          (i("d5go").onclick = () => {
            play("choice"), (l.textContent = "");
            const t = i("d5e").value,
              o = i("d5p").value;
            if (!t) return void (l.textContent = "You need an email address first.");
            if (o.length < 6) return void (l.textContent = "Password must be at least 6 characters.");
            socialSignup(e, t, n);
            const s = state.social[e];
            s && ((s.pw = o), (s.pwY = socYear()), (s.handle = n)), a && a(), openSocialAccount(e);
          }),
          screen.classList.add("open");
      }
      const DC16_CSS =
          "<style>\n    @font-face{font-family:'Whitney16';font-weight:300;src:url(social/discord/whitney300.woff) format('woff')}\n    @font-face{font-family:'Whitney16';font-weight:500;src:url(social/discord/whitney500.woff) format('woff')}\n    @font-face{font-family:'Whitney16';font-weight:600;src:url(social/discord/whitney600.woff) format('woff')}\n    @keyframes d6float{from{transform:translate3d(0,-4px,0)}to{transform:translate3d(0,4px,0)}}\n    @keyframes d6fade{from{opacity:0}to{opacity:1}}\n    .dc16{background:#7289da;color:#fff;font-family:'Whitney16','Helvetica Neue',Helvetica,Arial,sans-serif;min-height:100%;overflow:hidden}\n    .dc16 .d6hd{display:flex;align-items:center;height:60px;padding:0 14px;background:#7289da;box-sizing:border-box}\n    .dc16 .d6logo{width:110px;height:30px;background:url(social/discord/2016-logo.svg) left center/contain no-repeat;cursor:pointer}\n    .dc16 .d6so{margin-left:auto;display:flex;align-items:center;gap:12px}\n    .dc16 .d6so i{display:block;width:16px;height:16px;background:center/contain no-repeat;opacity:.8}\n    .dc16 .d6so .d6tw{background-image:url(social/discord/2016-twitter.svg)}\n    .dc16 .d6so .d6fb{background-image:url(social/discord/2016-facebook.svg)}\n    .dc16 .d6so .d6ig{background-image:url(social/discord/2016-instagram.svg)}\n    .dc16 .d6li{color:#fff;opacity:.8;border:2px solid rgba(255,255,255,.8);border-radius:20px;padding:3px 14px 4px;font-size:14px;cursor:pointer}\n    .dc16 .d6li:active{opacity:1}\n    .dc16 .d6hero{text-align:center;padding:26px 16px 0}\n    .dc16 h1{font-weight:600;font-size:28px;line-height:120%;margin:0 0 14px}\n    .dc16 .d6blurb{font-size:15px;line-height:1.5;opacity:.9;margin:0 auto 24px;max-width:710px}\n    .dc16 .d6bt{display:flex;flex-direction:column;align-items:center;gap:14px;animation:d6fade .5s ease both}\n    .dc16 .d6dl{display:flex;align-items:center;justify-content:center;width:250px;height:45px;background:#fff;color:#7289da;border-radius:3px;font-weight:600;font-size:15px;\n      box-shadow:0 2px 6px 0 rgba(0,0,0,.2);cursor:pointer;transition:all .3s cubic-bezier(.25,.25,.315,1.35)}\n    .dc16 .d6dl:active,.dc16 .d6btn:active{box-shadow:none;transform:translateY(1px)}\n    .dc16 .d6fbx{position:relative;display:flex;width:250px;height:45px;border-radius:3px;background:#fff;box-shadow:0 2px 6px 0 rgba(0,0,0,.2);transition:width .3s cubic-bezier(.25,.25,.315,1.35)}\n    .dc16 .d6fld{display:none;flex-grow:1;min-width:0;border:0;border-radius:3px;padding:0 64px 0 16px;font:500 15px 'Whitney16','Helvetica Neue',Arial,sans-serif;color:#99aab5;outline:none;background:#fff}\n    .dc16 .d6fld::placeholder{color:#bdc8cf}\n    .dc16 .d6btn{position:absolute;top:0;right:0;bottom:0;width:250px;height:45px;border:0;padding:0;border-radius:3px;background:#fff;cursor:pointer;overflow:hidden;outline:none;\n      font:600 15px 'Whitney16','Helvetica Neue',Arial,sans-serif;color:#7289da;white-space:nowrap;transition:all .3s cubic-bezier(.25,.25,.315,1.35)}\n    .dc16 .d6btn span{position:absolute;inset:0;line-height:45px;border-radius:2px;background:#fff;color:#7289da}\n    .dc16 .d6btn::after{content:'';position:absolute;top:0;left:-56px;width:56px;height:45px;background:url(social/discord/2015-go.svg) center/22px auto no-repeat;transition:left .3s cubic-bezier(.25,.25,.315,1.35)}\n    .dc16 .d6fbx.d6open{width:100%;max-width:400px;box-shadow:none}\n    .dc16 .d6fbx.d6open .d6fld{display:block}\n    .dc16 .d6fbx.d6open .d6btn{width:56px;text-indent:56px}\n    .dc16 .d6fbx.d6open .d6btn span{background:rgba(67,181,129,.8);inset:4px;line-height:37px;text-indent:99px}\n    .dc16 .d6fbx.d6open .d6btn::after{left:0;z-index:1}\n    .dc16 .d6bt.d6open .d6dl{display:none}\n    .dc16 .d6nd{font-size:12px;opacity:.4;margin-top:-2px}\n    .dc16 .d6nd.d6err{opacity:1;color:#ffd0d0;font-weight:600}\n    .dc16 .d6img{position:relative;margin-top:14px;height:0;padding-bottom:49%;overflow:hidden}\n    .dc16 .d6st{position:absolute;left:0;bottom:0;width:1300px;height:638px;transform-origin:0 100%}\n    .dc16 .d6st img{position:absolute;bottom:10px}\n    .dc16 .d6st .d6fl{animation:d6float 1.6s ease-in-out infinite alternate}\n    .dc16 .d6st .d6dly{animation-delay:.4s}\n    .dc16 .d6st .d6bg{opacity:.3}\n    .dc16 .d6st .d6sh{position:absolute;bottom:0;left:50px;width:1300px;height:50px;border-radius:50px;background:rgba(0,0,0,.1)}\n    .dc16 .d6lm{text-align:center;padding:10px 0 14px;font-size:14px;text-transform:uppercase;letter-spacing:.3px}\n    .dc16 .d6lm img{margin-left:8px;position:relative;top:-1px;width:12px}\n    .dc16 .d6ft{background:#2e3136;padding:18px 16px 20px;text-align:center;font-size:13px;color:#8a8e94}\n    .dc16 .d6ft div{display:flex;justify-content:center;flex-wrap:wrap;gap:6px 16px;margin-top:10px}\n    .dc16 .d6ft a{color:#b9bbbe;cursor:pointer}\n    .dc16 .d6au{padding:24px 16px 40px;min-height:440px}\n    .dc16 .d6box{background:#fff;border-radius:5px;box-shadow:0 0 20px rgba(0,0,0,.25);padding:28px 22px 24px;color:#737f8d;max-width:420px;margin:0 auto}\n    .dc16 .d6box h2{font:600 18px 'Whitney16','Helvetica Neue',Arial,sans-serif;color:#7289da;text-transform:uppercase;text-align:center;margin:0 0 6px;line-height:1.3}\n    .dc16 .d6box .d6sub{text-align:center;font-size:14px;color:#99aab5;margin:0 0 14px;line-height:1.4}\n    .dc16 .d6box label{display:block;font:600 12px 'Whitney16','Helvetica Neue',Arial,sans-serif;text-transform:uppercase;color:#87909c;letter-spacing:.4px;margin:14px 0 6px}\n    .dc16 .d6box input,.dc16 .d6box select{display:block;width:100%;height:40px;box-sizing:border-box;border:1px solid rgba(0,0,0,.2);border-radius:3px;background:#fff;padding:0 10px;\n      font:500 15px 'Whitney16','Helvetica Neue',Arial,sans-serif;color:#4f545c;outline:none;transition:border-color .2s}\n    .dc16 .d6box input:focus,.dc16 .d6box select:focus{border-color:#7289da}\n    .dc16 .d6go{display:block;width:100%;height:44px;margin-top:22px;border:0;border-radius:3px;background:#7289da;color:#fff;font:600 16px 'Whitney16','Helvetica Neue',Arial,sans-serif;cursor:pointer}\n    .dc16 .d6go:active{background:#697ec4}\n    .dc16 .d6w{color:#f04747;font-size:13px;min-height:16px;margin-top:10px;text-align:center}\n    .dc16 .d6alt{font-size:14px;margin-top:10px;color:#b9bfc8}\n    .dc16 .d6alt a{color:#7289da;cursor:pointer}\n    .dc16 .d6tos{font-size:12px;color:#b9bfc8;margin-top:14px;line-height:1.4}\n    .dc16 .d6tos a{color:#7289da}\n  </style>",
        DC16_FOOT =
          '<div class="d6ft">&copy; 2016 Discord, Inc.<div><a>Features</a><a>Download</a><a>Partners</a><a>Blog</a><a>Help &amp; Support</a><a>Privacy</a><a>Terms</a></div></div>',
        DC16_ART = [
          ["bg-triangle", -560, 300, 19],
          ["bg-triangle", 50, 550, 19],
          ["bg-triangle", -270, 448, 19],
          ["bg-dot", -580, 200, 19],
          ["bg-dot", -300, 600, 19],
          ["bg-dot", 200, 500, 19],
          ["bg-dot", 550, 600, 19],
          ["bg-dot", 640, 140, 19],
          ["bg-circle", -340, 530, 19],
          ["bg-circle", 595, 280, 19],
          ["bg-circle", -180, 88, 19],
          ["bg-square", 36, 92, 19],
          ["bg-square", 450, 400, 19],
          ["bg-square", 350, 600, 19],
          ["bg-x", 120, 440, 19],
          ["bg-x", 560, 220, 19],
          ["bg-x", -560, 510, 19],
          ["potion", -500, 10, 59],
          ["bomb", -435, 335, 46, "d6fl d6dly"],
          ["coin", -388, 300, 40, "d6fl"],
          ["coin", 120, 530, 40, "d6fl"],
          ["cartridge", 296, 392, 46, "d6fl"],
          ["shield", 552, 10, 109],
          ["smallbox", -200, 462, 39],
          ["desktop", 0, 10, 289.5],
          ["android", -364, 10, 128, "", 2],
          ["iphone", -216, 10, 125.5],
          ["controller", -115, 10, 80],
          ["laptop", 300, 10, 304],
          ["headphones", 340, 142, 70, "d6hp"],
        ];
      function dc2016Head() {
        return '<div class="d6hd"><div class="d6logo" id="d6home"></div><div class="d6so"><i class="d6tw"></i><i class="d6fb"></i><i class="d6ig"></i><a class="d6li" id="d6li">Login</a></div></div>';
      }
      function dc2016Wire(e, t, a) {
        const o = (e) => document.getElementById(e);
        (o("d6home").onclick = () => {
          play("choice"), dc2016Home(e, t, a);
        }),
          (o("d6li").onclick = () => {
            play("choice"), dc2016Auth(e, t, a, "in");
          });
      }
      function dc2016Home(e, t, a) {
        (sTitle.textContent = "DISCORD"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial);
        const o = DC16_ART.map(
          ([e, t, a, o, n = "", s]) =>
            `<img src="social/discord/2016-${e}.svg" alt="" class="${e.startsWith("bg-") ? "d6bg d6fl" : n}" style="left:${650 - o + t}px;bottom:${a}px${s ? `;z-index:${s}` : ""}${"d6hp" === n ? ";transform:scale(.75)" : ""}">`,
        ).join("");
        (sList.innerHTML =
          DC16_CSS +
          `<div class="dc16">${dc2016Head()}<div class="d6hero">\n      <h1>It&rsquo;s time to ditch Skype and TeamSpeak.</h1>\n      <p class="d6blurb">All-in-one voice and text chat for gamers that&rsquo;s free, secure, and works on both your desktop and phone. Stop paying for TeamSpeak servers and hassling with Skype. Simplify your life.</p>\n      <div class="d6bt" id="d6bt"><div class="d6dl" id="d6dl">Download for Windows</div>\n        <form class="d6fbx" id="d6f" onsubmit="return false"><input class="d6fld" id="d6u" placeholder="Enter a username" maxlength="32" autocomplete="off" spellcheck="false">\n          <button class="d6btn" id="d6b" type="submit"><span>Open Discord in your browser</span></button></form>\n        <div class="d6nd" id="d6nd">No download required</div></div></div>\n      <div class="d6img"><div class="d6st" id="d6st"><div class="d6sh"></div>${o}</div></div>\n      <div class="d6lm">Learn more<img src="social/discord/2016-learnmore.svg" alt=""></div>${DC16_FOOT}</div>`),
          (sList.scrollTop = 0),
          dc2016Wire(e, t, a);
        const n = (e) => document.getElementById(e),
          s = n("d6f"),
          r = n("d6u"),
          i = n("d6nd"),
          l = n("d6st"),
          c = () => {
            l.isConnected && (l.style.transform = `scale(${l.parentElement.clientWidth / 1300})`);
          };
        c(), requestAnimationFrame(c);
        const d = (e) => {
          (i.className = "d6nd d6err"), (i.textContent = e);
        };
        (n("d6dl").onclick = () => {
          play("choice"), d("You can use Discord right in your browser.");
        }),
          (n("d6b").onclick = () => {
            if ((play("choice"), !s.classList.contains("d6open")))
              return (
                s.classList.add("d6open"),
                n("d6bt").classList.add("d6open"),
                void setTimeout(() => r.focus(), 50)
              );
            const o = String(r.value || "")
              .trim()
              .replace(/\s+/g, " ");
            return o.length < 2
              ? d("Must be between 2 and 32 characters.")
              : isBadName(o)
                ? d("That username isn't allowed.")
                : void dc2016Auth(e, t, a, "up", o);
          }),
          screen.classList.add("open");
      }
      function dc2016Auth(e, t, a, o, n = "") {
        const s = (state.emails || []).filter((e) => !e.hacked);
        (sTitle.textContent = "DISCORD"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => dc2016Home(e, t, a));
        const r = s
          .map((e) => `<option${e.addr === t ? " selected" : ""}>${escAttr(e.addr)}</option>`)
          .join("");
        (sList.innerHTML =
          DC16_CSS +
          `<div class="dc16">${dc2016Head()}<div class="d6au"><div class="d6box">` +
          ("in" === o
            ? `<h2>Welcome back!</h2><div class="d6sub">We're so excited to see you again!</div>\n        <label>Email</label><select id="d6e">${r}</select>\n        <label>Password</label><input type="password" id="d6p" maxlength="128" autocomplete="off">\n        <button class="d6go" id="d6in">Login</button><div class="d6w" id="d6w"></div>\n        <div class="d6alt">Need an account? <a id="d6up">Register</a></div>`
            : `<h2>Create an account</h2>\n        <label>Email</label><select id="d6e">${r}</select>\n        <label>Username</label><input id="d6n" maxlength="32" autocomplete="off" spellcheck="false" value="${escAttr(n)}">\n        <label>Password</label><input type="password" id="d6p" maxlength="128" autocomplete="off">\n        <button class="d6go" id="d6go">Continue</button><div class="d6w" id="d6w"></div>\n        <div class="d6alt"><a id="d6bk">Already have an account?</a></div>\n        <div class="d6tos">By registering, you agree to Discord's <a>Terms of Service</a> and <a>Privacy Policy</a>.</div>`) +
          `</div></div>${DC16_FOOT}</div>`),
          (sList.scrollTop = 0),
          dc2016Wire(e, t, a);
        const i = (e) => document.getElementById(e),
          l = i("d6w");
        if (
          (s.length || (l.textContent = "You need an email address first."),
          pwAutofill(i("d6p"), [i("d6p")], 128),
          "in" === o)
        )
          return (
            (i("d6up").onclick = () => {
              play("choice"), dc2016Auth(e, t, a, "up");
            }),
            (i("d6in").onclick = () => {
              play("choice"), (l.textContent = "");
              const e = i("d6e").value,
                t = i("d6p").value,
                a = Object.keys(state.social).find(
                  (t) => "discord" === socBase(t) && !state.social[t].stranger && state.social[t].email === e,
                );
              a && pwOf(a) === t
                ? state.social[a].banned
                  ? (l.textContent = "This account has been disabled.")
                  : openSocialAccount(a)
                : (l.textContent = "Email or password is invalid.");
            }),
            screen.classList.add("open")
          );
        (i("d6bk").onclick = () => {
          play("choice"), dc2016Auth(e, t, a, "in");
        }),
          (i("d6go").onclick = () => {
            play("choice"), (l.textContent = "");
            const t = i("d6e").value,
              o = String(i("d6n").value || "")
                .trim()
                .replace(/\s+/g, " "),
              n = i("d6p").value;
            if (!t) return void (l.textContent = "You need an email address first.");
            if (o.length < 2) return void (l.textContent = "Username must be between 2 and 32 characters.");
            if (isBadName(o)) return void (l.textContent = "That username isn't allowed.");
            if (n.length < 6) return void (l.textContent = "Password must be at least 6 characters.");
            socialSignup(e, t, o);
            const s = state.social[e];
            s && ((s.pw = n), (s.pwY = socYear()), (s.handle = o)), a && a(), openSocialAccount(e);
          }),
          screen.classList.add("open");
      }
      const DC19_CSS =
        "<style>\n    @font-face{font-family:'Whitney19';font-weight:300;src:url(social/discord/whitney300.woff) format('woff')}\n    @font-face{font-family:'Whitney19';font-weight:500;src:url(social/discord/whitney500.woff) format('woff')}\n    @font-face{font-family:'Whitney19';font-weight:600;src:url(social/discord/whitney600.woff) format('woff')}\n    @keyframes d9in{from{opacity:0;transform:scale(1.05)}to{opacity:1;transform:scale(1)}}\n    .dc19{position:relative;min-height:100%;background:#2f3136 url(social/discord/2019-bg.jpg) center bottom/cover no-repeat;font-family:'Whitney19','Helvetica Neue',Helvetica,Arial,sans-serif;\n      display:flex;flex-direction:column;align-items:center;padding:28px 14px 40px;box-sizing:border-box;overflow:hidden}\n    .dc19 .d9logo{width:124px;height:36px;background:url(social/discord/2019-logo.svg) center/contain no-repeat;opacity:.9;margin-bottom:26px;flex:none}\n    .dc19 .d9box{width:100%;max-width:480px;box-sizing:border-box;background:#36393f;border-radius:5px;box-shadow:0 2px 10px 0 rgba(0,0,0,.2);padding:32px 24px 28px;color:#72767d;\n      animation:d9in .3s cubic-bezier(.25,.25,.315,1.35) both}\n    .dc19 h2{font:300 26px/32px 'Whitney19','Helvetica Neue',Arial,sans-serif;color:#fff;text-align:center;margin:0 0 8px}\n    .dc19 .d9sub{font-size:17px;line-height:22px;text-align:center;color:#72767d;margin:0}\n    .dc19 .d9f{margin-top:20px}\n    .dc19 label{display:block;font:600 12px/16px 'Whitney19','Helvetica Neue',Arial,sans-serif;text-transform:uppercase;letter-spacing:.5px;color:#b9bbbe;margin:20px 0 8px}\n    .dc19 .d9f>label:first-child{margin-top:0}\n    .dc19 label.d9bad{color:#f04747}\n    .dc19 label i{font-style:italic;font-weight:500;text-transform:none;letter-spacing:0}\n    .dc19 input,.dc19 select{display:block;width:100%;height:40px;box-sizing:border-box;padding:10px;border:1px solid rgba(0,0,0,.3);border-radius:3px;background:rgba(0,0,0,.1);\n      font:16px 'Whitney19','Helvetica Neue',Arial,sans-serif;color:#f6f6f7;outline:none;transition:border-color .2s ease-in-out}\n    .dc19 select option{background:#36393f;color:#f6f6f7}\n    .dc19 input:hover,.dc19 select:hover{border-color:#040405}\n    .dc19 input:focus,.dc19 select:focus{border-color:#7289da}\n    .dc19 a{color:#7289da;cursor:pointer;font-weight:500}\n    .dc19 a:active{text-decoration:underline}\n    .dc19 .d9fg{display:inline-block;font-size:14px;margin:6px 0 20px}\n    .dc19 .d9go{display:block;width:100%;height:44px;border:0;border-radius:3px;background:#7289da;color:#fff;font:500 16px 'Whitney19','Helvetica Neue',Arial,sans-serif;cursor:pointer;\n      margin-bottom:8px;transition:background-color .17s ease}\n    .dc19 .d9go:active{background:#677bc4}\n    .dc19 .d9up .d9go{margin-top:20px}\n    .dc19 .d9alt{font-size:14px;margin-top:4px;color:#72767d}\n    .dc19 .d9alt a{margin-left:4px}\n    .dc19 .d9up .d9alt a{margin-left:0}\n    .dc19 .d9tos{font-size:12px;line-height:16px;color:#72767d;margin-top:20px}\n  </style>";
      function dc2019Auth(e, t, a, o, n = "") {
        const s = (state.emails || []).filter((e) => !e.hacked);
        (sTitle.textContent = "DISCORD"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial);
        const r = s
          .map((e) => `<option${e.addr === t ? " selected" : ""}>${escAttr(e.addr)}</option>`)
          .join("");
        (sList.innerHTML =
          DC19_CSS +
          `<div class="dc19"><div class="d9logo"></div><form class="d9box${"in" === o ? "" : " d9up"}" onsubmit="return false">` +
          ("in" === o
            ? `<h2>Welcome back!</h2><div class="d9sub">We're so excited to see you again!</div><div class="d9f">\n        <label id="d9el">Email</label><select id="d9e">${r}</select>\n        <label id="d9pl">Password</label><input type="password" id="d9p" maxlength="128" autocomplete="off" spellcheck="false">\n        <a class="d9fg" id="d9fg">Forgot your password?</a>\n        <button class="d9go" id="d9in" type="submit">Login</button>\n        <div class="d9alt">Need an account?<a id="d9up">Register</a></div></div>`
            : `<h2>Create an account</h2><div class="d9f">\n        <label id="d9el">Email</label><select id="d9e">${r}</select>\n        <label id="d9nl">Username</label><input id="d9n" maxlength="32" autocomplete="off" spellcheck="false" value="${escAttr(n)}">\n        <label id="d9pl">Password</label><input type="password" id="d9p" maxlength="128" autocomplete="off" spellcheck="false">\n        <button class="d9go" id="d9go" type="submit">Continue</button>\n        <div class="d9alt"><a id="d9bk">Already have an account?</a></div>\n        <div class="d9tos">By registering, you agree to Discord's <a>Terms of Service</a> and <a>Privacy Policy</a>.</div></div>`) +
          "</form></div>"),
          (sList.scrollTop = 0);
        const i = (e) => document.getElementById(e),
          l = (e, t, a) => {
            const o = i(e);
            (o.className = "d9bad"), (o.innerHTML = `${t} <i>- ${a}</i>`);
          },
          c = () =>
            [
              ["d9el", "Email"],
              ["d9nl", "Username"],
              ["d9pl", "Password"],
            ].forEach(([e, t]) => {
              const a = i(e);
              a && ((a.className = ""), (a.textContent = t));
            });
        if (
          (s.length || l("d9el", "Email", "You need an email address first."),
          pwAutofill(i("d9p"), [i("d9p")], 128),
          "in" === o)
        )
          return (
            (i("d9up").onclick = () => {
              play("choice"), dc2019Auth(e, t, a, "up");
            }),
            (i("d9fg").onclick = () => {
              play("choice"), c(), l("d9el", "Email", "Check your inbox for a password reset link.");
            }),
            (i("d9in").onclick = () => {
              play("choice"), c();
              const e = i("d9e").value,
                t = i("d9p").value;
              if (!e) return l("d9el", "Email", "This field is required");
              if (!t) return l("d9pl", "Password", "This field is required");
              const a = Object.keys(state.social).find(
                (t) => "discord" === socBase(t) && !state.social[t].stranger && state.social[t].email === e,
              );
              return a && pwOf(a) === t
                ? state.social[a].banned
                  ? l("d9el", "Email", "This account has been disabled.")
                  : void openSocialAccount(a)
                : (l("d9el", "Email", "Login or password is invalid."),
                  l("d9pl", "Password", "Login or password is invalid."));
            }),
            screen.classList.add("open")
          );
        (i("d9bk").onclick = () => {
          play("choice"), dc2019Auth(e, t, a, "in");
        }),
          (i("d9go").onclick = () => {
            play("choice"), c();
            const t = i("d9e").value,
              o = String(i("d9n").value || "")
                .trim()
                .replace(/\s+/g, " "),
              n = i("d9p").value;
            if (!t) return l("d9el", "Email", "You need an email address first.");
            if (o.length < 2) return l("d9nl", "Username", "Must be between 2 and 32 in length");
            if (isBadName(o)) return l("d9nl", "Username", "That username isn't allowed");
            if (n.length < 6) return l("d9pl", "Password", "Must be at least 6 characters long");
            socialSignup(e, t, o);
            const s = state.social[e];
            s && ((s.pw = n), (s.pwY = socYear()), (s.handle = o)), a && a(), openSocialAccount(e);
          }),
          screen.classList.add("open");
      }
      const DC21_CSS =
          "<style>\n    @font-face{font-family:'Whitney21';font-weight:400;src:url(social/discord/whitney400.woff) format('woff')}\n    @font-face{font-family:'Whitney21';font-weight:500;src:url(social/discord/whitney500.woff) format('woff')}\n    @font-face{font-family:'Whitney21';font-weight:600;src:url(social/discord/whitney600.woff) format('woff')}\n    @font-face{font-family:'GintoNord21';font-weight:800;src:url(social/discord/ginto-nord800.woff2) format('woff2')}\n    @font-face{font-family:'Ginto21';font-weight:400;src:url(social/discord/ginto400.woff2) format('woff2')}\n    @font-face{font-family:'Ginto21';font-weight:700;src:url(social/discord/ginto700.woff2) format('woff2')}\n    @keyframes d21in{from{opacity:0;transform:scale(1.05)}to{opacity:1;transform:scale(1)}}\n    .dc21{font-family:'Whitney21','Helvetica Neue',Helvetica,Arial,sans-serif;min-height:100%;background:#fff;color:#23272a;overflow:hidden}\n    .dc21 .q1hero{background:#404eed;color:#fff;padding:0 24px 0;position:relative}\n    .dc21 .q1nav{display:flex;align-items:center;height:80px}\n    .dc21 .q1logo{width:124px;height:34px;background:url(social/discord/2021-logo.svg) left center/contain no-repeat;cursor:pointer}\n    .dc21 .q1li{margin-left:auto;background:#fff;color:#23272a;border-radius:40px;padding:7px 16px;font-size:14px;line-height:24px;font-weight:500;cursor:pointer;transition:all .2s}\n    .dc21 .q1li:active{color:#5865f2;box-shadow:0 8px 15px rgba(0,0,0,.2)}\n    .dc21 .q1bars{width:30px;margin-left:16px;display:flex;flex-direction:column;gap:5px}\n    .dc21 .q1bars i{display:block;height:4px;border-radius:2px;background:#fff}\n    .dc21 h1{font:800 26px/1.0 'GintoNord21','Ginto21',Whitney,sans-serif;text-transform:uppercase;margin:40px 0 0}\n    .dc21 .q1hero p{font-size:16px;line-height:26px;margin:24px 0 0}\n    .dc21 .q1bt{display:flex;flex-direction:column;align-items:flex-start;gap:24px;margin-top:24px}\n    .dc21 .q1b{display:inline-flex;align-items:center;border-radius:28px;padding:16px 32px;font-size:20px;line-height:24px;font-weight:500;cursor:pointer;transition:all .2s ease-in-out;white-space:nowrap}\n    .dc21 .q1dl{background:#fff;color:#23272a}\n    .dc21 .q1dl:active{color:#5865f2;box-shadow:0 8px 15px rgba(0,0,0,.2)}\n    .dc21 .q1dl svg{width:24px;height:24px;margin-right:8px}\n    .dc21 .q1br{background:#23272a;color:#fff}\n    .dc21 .q1br:active{background:#36393f;box-shadow:0 8px 15px rgba(0,0,0,.2)}\n    .dc21 .q1note{font-size:13px;margin-top:-8px;min-height:16px;color:#fff;opacity:.85}\n    .dc21 .q1art{display:block;width:calc(100% + 48px);margin:24px -24px 0;height:auto}\n    .dc21 .q1sec{padding:56px 24px}\n    .dc21 .q1sec:nth-of-type(odd){background:#f6f6f6}\n    .dc21 .q1sec img{display:block;width:100%;height:auto;margin-bottom:32px}\n    .dc21 h2{font:700 20px/24px 'Ginto21',Whitney,sans-serif;margin:0 0 24px}\n    .dc21 .q1sec p{font-size:16px;line-height:26px;margin:0}\n    .dc21 .q1tech{text-align:center;background:#f6f6f6}\n    .dc21 .q1tech h2{font:800 20px/19px 'GintoNord21','Ginto21',sans-serif;text-transform:uppercase}\n    .dc21 .q1ready{text-align:center;background:#f6f6f6;padding:0 24px 64px;position:relative}\n    .dc21 .q1ready img{width:100%;max-width:532px;height:auto;margin:0 auto -18px;display:block}\n    .dc21 .q1ready h3{font:700 32px/38px 'Ginto21',Whitney,sans-serif;margin:0 0 32px;text-align:left}\n    .dc21 .q1go{background:#5865f2;color:#fff}\n    .dc21 .q1go:active{background:#7983f5;box-shadow:0 8px 15px rgba(0,0,0,.2)}\n    .dc21 .q1go svg{width:24px;height:24px;margin-right:8px}\n    .dc21 .q1ft{background:#23272a;color:#fff;padding:64px 24px 64px}\n    .dc21 .q1ft h4{font:800 32px/1 'GintoNord21','Ginto21',sans-serif;color:#5865f2;text-transform:uppercase;margin:0 0 24px}\n    .dc21 .q1lang{font-size:14px;margin-bottom:24px}\n    .dc21 .q1cols{display:grid;grid-template-columns:1fr 1fr;gap:40px 16px}\n    .dc21 .q1cols b{display:block;color:#5865f2;font-size:16px;font-weight:400;margin-bottom:12px}\n    .dc21 .q1cols a{display:block;color:#fff;font-size:16px;line-height:1.5;margin-bottom:8px;cursor:pointer}\n    .dc21 .q1bot{display:flex;align-items:center;justify-content:space-between;border-top:1px solid #5865f2;margin-top:32px;padding-top:32px}\n    .dc21 .q1bot .q1logo{width:124px;height:34px}\n    .dc21 .q1sm{background:#5865f2;color:#fff;border-radius:40px;padding:7px 16px;font-size:14px;line-height:24px;font-weight:500;cursor:pointer}\n    .dc21a{position:relative;min-height:100%;background:#5865f2 url(social/discord/2021-auth-bg.svg) center/cover no-repeat;font-family:'Whitney21','Helvetica Neue',Helvetica,Arial,sans-serif;\n      display:flex;flex-direction:column;align-items:center;padding:56px 0 40px;box-sizing:border-box;overflow:hidden}\n    .dc21a .q2box{width:100%;max-width:480px;box-sizing:border-box;background:#36393f;border-radius:5px;box-shadow:0 2px 10px 0 rgba(0,0,0,.2);padding:32px 16px;color:#72767d;font-size:18px;\n      animation:d21in .3s cubic-bezier(.25,.25,.315,1.35) both}\n    .dc21a h2{font:700 24px/30px 'Ginto21',Whitney,sans-serif;color:#fff;text-align:center;margin:0 0 8px}\n    .dc21a .q2sub{font-size:16px;line-height:20px;text-align:center;color:#b9bbbe}\n    .dc21a .q2f{margin-top:20px}\n    .dc21a label{display:block;font:600 12px/16px 'Whitney21','Helvetica Neue',Arial,sans-serif;text-transform:uppercase;letter-spacing:.02em;color:#b9bbbe;margin:20px 0 8px}\n    .dc21a .q2f>label:first-child{margin-top:0}\n    .dc21a label.q2bad{color:#ed4245}\n    .dc21a label i{font-style:italic;font-weight:500;text-transform:none;letter-spacing:0}\n    .dc21a input:not([type=checkbox]),.dc21a select{display:block;width:100%;height:40px;box-sizing:border-box;padding:10px;border:1px solid rgba(0,0,0,.3);border-radius:3px;background:rgba(0,0,0,.1);\n      font:16px 'Whitney21','Helvetica Neue',Arial,sans-serif;color:#dcddde;outline:none;transition:border-color .2s ease-in-out}\n    .dc21a select{background:#303339;border-color:#202225;padding:0 8px;color:#dcddde}\n    .dc21a select:invalid{color:#72767d}\n    .dc21a select option{background:#2f3136;color:#dcddde}\n    .dc21a input:hover,.dc21a select:hover{border-color:#040405}\n    .dc21a input:focus,.dc21a select:focus{border-color:#00b0f4}\n    .dc21a .q2dob{display:flex;gap:10px}\n    .dc21a .q2dob select:first-child{flex:1.3}\n    .dc21a .q2dob select{flex:1}\n    .dc21a a{color:#00aff4;cursor:pointer;font-weight:500}\n    .dc21a a:active{text-decoration:underline}\n    .dc21a .q2fg{display:inline-block;font-size:14px;margin:4px 0 20px}\n    .dc21a .q2chk{display:flex;align-items:center;gap:8px;font-size:12px;line-height:16px;color:#b9bbbe;margin:20px 0 0;cursor:pointer}\n    .dc21a .q2chk input{appearance:none;-webkit-appearance:none;flex:none;width:24px;height:24px;margin:0;border:1px solid #72767d;border-radius:6px;background:transparent;cursor:pointer}\n    .dc21a .q2chk input:checked{background:#5865f2 url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z'/%3E%3C/svg%3E\") center/18px no-repeat;border-color:#5865f2}\n    .dc21a .q2chk a{font-weight:400}\n    .dc21a .q2go{display:block;width:100%;height:44px;border:0;border-radius:3px;background:#5865f2;color:#fff;font:500 16px 'Whitney21','Helvetica Neue',Arial,sans-serif;cursor:pointer;\n      margin-bottom:8px;transition:background-color .17s ease,opacity .17s}\n    .dc21a .q2go:active{background:#4752c4}\n    .dc21a .q2go:disabled{opacity:.5;cursor:not-allowed}\n    .dc21a .q2up .q2go{margin-top:20px}\n    .dc21a .q2alt{font-size:14px;margin-top:4px;color:#72767d}\n    .dc21a .q2alt a{margin-left:4px}\n    .dc21a .q2up .q2alt a{margin-left:0}\n  </style>",
        DC21_DL =
          '<svg viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M16.293 9.293L17.707 10.707L12 16.414L6.29297 10.707L7.70697 9.293L11 12.586V2H13V12.586L16.293 9.293ZM18 20V18H20V20C20 21.102 19.104 22 18 22H6C4.896 22 4 21.102 4 20V18H6V20H18Z"/></svg>',
        DC21_SECS = [
          [
            "servers",
            "Create an invite-only place where you belong",
            "Discord servers are organized into topic-based channels where you can collaborate, share, and just talk about your day without clogging up a group chat.",
          ],
          [
            "voice",
            "Where hanging out is easy",
            "Grab a seat in a voice channel when you&rsquo;re free. Friends in your server can see you&rsquo;re around and instantly pop in to talk without having to call.",
          ],
          [
            "roles",
            "From few to a fandom",
            "Get any community running with moderation tools and custom member access. Give members special powers, set up private channels, and more.",
          ],
        ];
      function dc2021Home(e, t, a) {
        (sTitle.textContent = "DISCORD"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial);
        const o = socYear(),
          n = (e, t) => `<div><b>${e}</b>${t.map((e) => `<a>${e}</a>`).join("")}</div>`;
        (sList.innerHTML =
          DC21_CSS +
          `<div class="dc21"><div class="q1hero"><div class="q1nav"><div class="q1logo" id="q1home"></div><div class="q1li" id="q1li">Login</div><div class="q1bars"><i></i><i></i><i></i></div></div>\n      <h1>Imagine a place...</h1>\n      <p>...where you can belong to a school club, a gaming group, or a worldwide art community. Where just you and a handful of friends can spend time together. A place that makes it easy to talk every day and hang out more often.</p>\n      <div class="q1bt"><div class="q1b q1dl" id="q1dl">${DC21_DL}Download for Windows</div><div class="q1b q1br" id="q1br">Open Discord in your browser</div></div>\n      <div class="q1note" id="q1nt"></div>\n      <img class="q1art" src="social/discord/2021-hero-mobile.svg" alt=""></div>` +
          DC21_SECS.map(
            ([e, t, a]) =>
              `<div class="q1sec"><img src="social/discord/2021-${e}.svg" alt=""><h2>${t}</h2><p>${a}</p></div>`,
          ).join("") +
          `<div class="q1sec q1tech"><h2>Reliable tech for staying close</h2><p>Low-latency voice and video feels like you&rsquo;re in the same room. Wave hello over video, watch friends stream their games, or gather up and have a drawing session with screen share.</p>\n        <img src="social/discord/2021-video.svg" alt="" style="margin:32px 0 0"></div>\n      <div class="q1ready"><img src="social/discord/2021-sparkles.svg" alt=""><h3>Ready to start your journey?</h3><div class="q1b q1go" id="q1go">${DC21_DL}Open Discord in your browser</div></div>\n      <div class="q1ft"><h4>Imagine a place</h4><div class="q1lang">English, USA</div><div class="q1cols">` +
          n("Product", ["Download", "Nitro", "Status"]) +
          n("Company", ["About", "Jobs", "Branding", "Newsroom"]) +
          n("Resources", ["College", "Support", "Safety", "Blog", "Feedback", "Developers", "StreamKit"]) +
          n("Policies", [
            "Terms",
            "Privacy",
            "Cookie Settings",
            "Guidelines",
            "Acknowledgements",
            "Licenses",
            "Moderation",
          ]) +
          `</div><div class="q1bot"><div class="q1logo" id="q1home2"></div><div class="q1sm" id="q1sm">${o >= 2023 ? "Open Discord" : "Download"}</div></div></div></div>`),
          (sList.scrollTop = 0);
        const s = (e) => document.getElementById(e);
        (s("q1home").onclick = s("q1home2").onclick =
          () => {
            play("choice"), (sList.scrollTop = 0);
          }),
          (s("q1li").onclick = () => {
            play("choice"), dc2021Auth(e, t, a, "in");
          }),
          (s("q1dl").onclick = () => {
            play("choice"), (s("q1nt").textContent = "You can use Discord right in your browser.");
          }),
          (s("q1br").onclick =
            s("q1go").onclick =
            s("q1sm").onclick =
              () => {
                play("choice"), dc2021Auth(e, t, a, "up");
              }),
          screen.classList.add("open");
      }
      function dc2021Auth(e, t, a, o, n = "") {
        const s = (state.emails || []).filter((e) => !e.hacked),
          r = socYear();
        (sTitle.textContent = "DISCORD"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => dc2021Home(e, t, a));
        const i = s
            .map((e) => `<option${e.addr === t ? " selected" : ""}>${escAttr(e.addr)}</option>`)
            .join(""),
          l = (e, t, a) =>
            `<select id="${e}" required><option value="" disabled selected hidden>${t}</option>${a.map(([e, t]) => `<option value="${e}">${t}</option>`).join("")}</select>`;
        (sList.innerHTML =
          DC21_CSS +
          `<div class="dc21a"><form class="q2box${"in" === o ? "" : " q2up"}" onsubmit="return false">` +
          ("in" === o
            ? `<h2>Welcome back!</h2><div class="q2sub">We're so excited to see you again!</div><div class="q2f">\n        <label id="q2el">Email or Phone Number</label><select id="q2e">${i}</select>\n        <label id="q2pl">Password</label><input type="password" id="q2p" maxlength="128" autocomplete="off" spellcheck="false">\n        <a class="q2fg" id="q2fg">Forgot your password?</a>\n        <button class="q2go" id="q2in" type="submit">Login</button>\n        <div class="q2alt">Need an account?<a id="q2up">Register</a></div></div>`
            : `<h2>Create an account</h2><div class="q2f">\n        <label id="q2el">Email</label><select id="q2e">${i}</select>\n        <label id="q2nl">Username</label><input id="q2n" maxlength="32" autocomplete="off" spellcheck="false" value="${escAttr(n)}">\n        <label id="q2pl">Password</label><input type="password" id="q2p" maxlength="128" autocomplete="off" spellcheck="false">\n        <label id="q2dl">Date of Birth</label><div class="q2dob">${l(
                "q2m",
                "Select",
                [
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
                ].map((e, t) => [t + 1, e]),
              )}${l(
                "q2d",
                "Select",
                Array.from({ length: 31 }, (e, t) => [t + 1, t + 1]),
              )}${l(
                "q2y",
                "Select",
                Array.from({ length: 120 }, (e, t) => [r - 3 - t, r - 3 - t]),
              )}</div>\n        <label class="q2chk"><input type="checkbox" id="q2c"><span>I have read and agree to Discord's <a>Terms of Service</a> and <a>Privacy Policy</a>.</span></label>\n        <button class="q2go" id="q2go" type="submit" disabled>Continue</button>\n        <div class="q2alt"><a id="q2bk">Already have an account?</a></div></div>`) +
          "</form></div>"),
          (sList.scrollTop = 0);
        const c = (e) => document.getElementById(e),
          d = (e, t, a) => {
            const o = c(e);
            (o.className = "q2bad"), (o.innerHTML = `${t} <i>- ${a}</i>`);
          },
          u = () =>
            [
              ["q2el", "in" === o ? "Email or Phone Number" : "Email"],
              ["q2nl", "Username"],
              ["q2pl", "Password"],
              ["q2dl", "Date of Birth"],
            ].forEach(([e, t]) => {
              const a = c(e);
              a && ((a.className = ""), (a.textContent = t));
            });
        if (
          (s.length || d("q2el", "Email", "You need an email address first."),
          pwAutofill(c("q2p"), [c("q2p")], 128),
          "in" === o)
        )
          return (
            (c("q2up").onclick = () => {
              play("choice"), dc2021Auth(e, t, a, "up");
            }),
            (c("q2fg").onclick = () => {
              play("choice"),
                u(),
                d("q2el", "Email or Phone Number", "Check your inbox for a password reset link.");
            }),
            (c("q2in").onclick = () => {
              play("choice"), u();
              const e = c("q2e").value,
                t = c("q2p").value;
              if (!e) return d("q2el", "Email or Phone Number", "This field is required");
              if (!t) return d("q2pl", "Password", "This field is required");
              const a = Object.keys(state.social).find(
                (t) => "discord" === socBase(t) && !state.social[t].stranger && state.social[t].email === e,
              );
              return a && pwOf(a) === t
                ? state.social[a].banned
                  ? d("q2el", "Email or Phone Number", "This account has been disabled.")
                  : void openSocialAccount(a)
                : (d("q2el", "Email or Phone Number", "Login or password is invalid."),
                  d("q2pl", "Password", "Login or password is invalid."));
            }),
            screen.classList.add("open")
          );
        (c("q2c").onchange = () => {
          c("q2go").disabled = !c("q2c").checked;
        }),
          (c("q2bk").onclick = () => {
            play("choice"), dc2021Auth(e, t, a, "in");
          }),
          (c("q2go").onclick = () => {
            play("choice"), u();
            const t = c("q2e").value,
              o = String(c("q2n").value || "")
                .trim()
                .replace(/\s+/g, " "),
              n = c("q2p").value,
              s = +c("q2m").value,
              i = +c("q2d").value,
              l = +c("q2y").value;
            if (!t) return d("q2el", "Email", "You need an email address first.");
            if (o.length < 2) return d("q2nl", "Username", "Must be between 2 and 32 in length");
            if (r >= 2023 && !/^[a-z0-9_.]+$/.test(o))
              return d("q2nl", "Username", "Please only use numbers, letters, underscores _ , or periods .");
            if (isBadName(o)) return d("q2nl", "Username", "That username isn't allowed");
            if (r >= 2023) {
              const t = npcOwner("discord", o),
                a = Object.keys(state.social).some(
                  (t) => "discord" === socBase(t) && t !== e && state.social[t].handle === o,
                );
              if ((t && !t.sold) || a)
                return d(
                  "q2nl",
                  "Username",
                  "Username is unavailable. Try adding numbers, letters, underscores _ , or periods.",
                );
            }
            if (n.length < 8) return d("q2pl", "Password", "Must be at least 8 characters long");
            if (!s || !i || !l) return d("q2dl", "Date of Birth", "This field is required");
            if (new Date(l, s - 1, i).getMonth() !== s - 1)
              return d("q2dl", "Date of Birth", "Please enter a valid date of birth");
            if (r - l < 13) return d("q2dl", "Date of Birth", "You need to be 13 or older to use Discord");
            socialSignup(e, t, o);
            const h = state.social[e];
            h && ((h.pw = n), (h.pwY = socYear()), (h.handle = o)), a && a(), openSocialAccount(e);
          }),
          screen.classList.add("open");
      }
      const ytNewKey = () => {
        if (!state.social.youtube) return "youtube";
        let e = 2;
        for (; state.social[`youtube~${e}`]; ) e++;
        return `youtube~${e}`;
      };
      function ytEraPage(e, t, a) {
        return socYear() <= 2006
          ? (yt2006Signup(e, t, a), !0)
          : socYear() >= 2008 && socYear() <= 2010
            ? (yt2008Signup(e, t, a), !0)
            : socYear() >= 2014 && (yt2017Home(e, t, a), !0);
      }
      const YT06_CSS =
        "<style>\n    .yt06{background:#fff;color:#222;font:12px Arial,Helvetica,sans-serif;min-height:100%;padding:8px 8px 16px;box-sizing:border-box}\n    .yt06 a{color:#03c;cursor:pointer;text-decoration:underline}\n    .yt06 .y6hd{display:flex;align-items:flex-end;gap:6px}\n    .yt06 .y6logo{width:120px;height:48px;cursor:pointer;flex:none}\n    .yt06 .y6tag{width:110px;height:15px;margin-bottom:9px;flex:none}\n    .yt06 .y6ut{margin-left:auto;align-self:flex-start;font-weight:700;white-space:nowrap;padding-top:2px}\n    .yt06 .y6ut a{font-weight:700}\n    .yt06 .y6sr{display:flex;justify-content:flex-end;gap:4px;margin:4px 0 6px}\n    .yt06 .y6sr input[type=text]{width:150px;height:18px;border:2px inset #767676;padding:1px 2px;font:12px Arial,sans-serif;box-sizing:content-box}\n    .yt06 button,.yt06 .y6btn{font:13.33px Arial,sans-serif;color:#000;background:#f0f0f0;border:2px outset #ddd;padding:1px 6px;cursor:pointer}\n    .yt06 button:active{border-style:inset}\n    .yt06 .y6tabs{display:grid;grid-template-columns:repeat(6,1fr);gap:2px}\n    .yt06 .y6tabs a{display:block;text-align:center;font:700 11px/25px Arial,sans-serif;background:#bECEEE;border-radius:5px 5px 0 0;white-space:nowrap;overflow:hidden}\n    .yt06 .y6tabs a.on{background:#ddd;line-height:26px}\n    .yt06 .y6sub{background:#ddd;padding:7px 6px;text-align:center;line-height:18px;border-radius:0 0 5px 5px}\n    .yt06 .y6sub i{font-style:normal;color:#222;margin:0 4px}\n    .yt06 h1{font:700 14px Arial,sans-serif;color:#c63;margin:14px 0 6px;padding:0 0 5px}\n    .yt06 .lightFocusBox{background:#eee;border:1px solid #ccc;padding:8px 8px 12px}\n    .yt06 .y6bh{font-weight:700;color:#03c;font-size:12px;margin:0 0 6px}\n    .yt06 .y6lead{margin:0 0 2px;line-height:15px}\n    .yt06 .y6req{font-size:10px;margin-bottom:12px}\n    .yt06 table{border-collapse:collapse;width:100%}\n    .yt06 td{padding:3px 0;vertical-align:middle}\n    .yt06 td.y6l{text-align:right;font-weight:700;color:#333;white-space:nowrap;padding-right:6px;width:1%}\n    .yt06 td input[type=text],.yt06 td input[type=password]{width:100%;max-width:180px;height:16px;border:2px inset #767676;padding:1px 2px;font:12px Arial,sans-serif;box-sizing:content-box}\n    .yt06 select{font:12px Arial,sans-serif;max-width:100%;border:1px solid #767676;background:#fff;color:#000}\n    .yt06 .y6s{font-size:11px;line-height:14px}\n    .yt06 .y6g label{margin-right:12px;white-space:nowrap}\n    .yt06 .y6g input{vertical-align:-2px;margin:0 3px 0 0}\n    .yt06 .y6ck{display:flex;align-items:center;gap:4px}\n    .yt06 .y6err{background:#ffc;border:1px solid #fc0;color:#c00;font-weight:700;padding:6px 8px;margin:0 0 8px;display:none}\n    .yt06 .y6err.on{display:block}\n    .yt06 .y6side{margin-top:14px;padding:0 4px}\n    .yt06 .y6side h2{font:700 14px Arial,sans-serif;color:#333;margin:0 0 4px}\n    .yt06 .y6side .y6li{font:700 12px Arial,sans-serif;color:#03c;margin:0 0 4px}\n    .yt06 .y6side ul{margin:4px 0 8px 22px;padding:0;line-height:15px}\n    .yt06 .y6ft{text-align:center;font-size:11px;margin-top:20px;line-height:18px}\n    .yt06 .y6ft a{margin:0 2px}\n    .yt06 .y6cp{display:flex;justify-content:center;align-items:center;gap:8px;margin-top:6px;font-size:11px}\n  </style>";
