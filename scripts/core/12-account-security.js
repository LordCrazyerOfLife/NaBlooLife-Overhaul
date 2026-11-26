      function askPw(e, t, a) {
        pwCard(t, (t) => {
          const o = state.social[e];
          o && ((o.pw = t), (o.pwY = socYear())), a && a();
        });
      }
      function pwCard(e, t, a, o) {
        setTimeout(() => {
          (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div><div class="jm-tag" style="margin-top:12px">Social</div>\n        <h4><img src="emoji/1f512.png" alt=""><span>Password</span></h4>\n        <div class="lead">${a ? `Change the password for your ${e} account.` : `Pick a password for your ${e} account.`}<br><br>Using the same password everywhere is easy to remember, until one of those sites gets hacked.</div>\n        <label class="hr-lab">Password:</label><div class="hr-sel txt"><input id="pwIn" maxlength="24" autocomplete="off" spellcheck="false"\n          style="width:100%;height:40px;border:none;background:transparent;font:inherit;font-size:17px;padding:0 10px" value="${escAttr(a || usualPw())}"></div>\n        <div class="lead" id="pwHint" style="font-size:14px;margin:10px 0 18px"></div>\n        <button class="jm-apply ev-btn" id="pwGen">Make a strong password</button><button class="jm-apply ev-btn" id="socGo">Use this password</button>`),
            (ev.style.overflow = "visible");
          const n = () => {
              evWrap.classList.remove("open"), (ev.style.overflow = "");
            },
            s = document.getElementById("pwIn"),
            r = document.getElementById("pwHint"),
            i = () => {
              const e = pwReuse(s.value, o);
              r.textContent = e
                ? `You already use this password on ${e} other account${e > 1 ? "s" : ""}.`
                : "You don't use this password anywhere else.";
            };
          (s.oninput = i),
            i(),
            (document.getElementById("pwGen").onclick = () => {
              play("choice"), (s.value = uniquePw()), i();
            }),
            (document.getElementById("propX").onclick = n),
            (document.getElementById("socGo").onclick = () => {
              const e = s.value.trim();
              if ((n(), e.length < 6))
                return notice("Too short", "Passwords need at least 6 characters.", null, !0);
              t(e);
            }),
            evWrap.classList.add("open");
        }, 60);
      }
      const BREACHES = [
        [
          "reddit",
          2007,
          2018,
          1,
          "an old 2007 backup of our database, including usernames, email addresses and scrambled passwords, was stolen",
        ],
        [
          "myspace",
          2008,
          2016,
          1,
          "usernames, email addresses and passwords from accounts made before June 2013 were stolen and put up for sale online",
        ],
        [
          "psn",
          2011,
          2011,
          1,
          "an attacker broke into the PlayStation Network and took account details, including names, email addresses, birthdates and passwords. PSN was taken offline for 23 days",
        ],
        [
          "steam",
          2011,
          2011,
          1,
          "intruders got into a Steam database containing usernames, scrambled passwords and email addresses",
        ],
        ["linkedin", 2012, 2012, 1, "millions of LinkedIn passwords were stolen and posted online"],
        [
          "leagueoflegends",
          2012,
          2012,
          1,
          "attackers took usernames, email addresses and scrambled passwords from some of our servers",
        ],
        [
          "battlenet",
          2012,
          2012,
          1,
          "attackers got into our network and took email addresses, security answers and scrambled passwords",
        ],
        [
          "tumblr",
          2013,
          2016,
          1,
          "a set of email addresses and scrambled passwords from early 2013 was stolen",
        ],
        [
          "neopets",
          2013,
          2016,
          1,
          "usernames, email addresses and passwords from Neopets accounts were stolen",
        ],
        [
          "twitter",
          2018,
          2018,
          0,
          "a bug stored passwords unmasked in an internal log. We fixed it and found no sign anyone misused them, but we recommend changing your password",
        ],
        [
          "instagram",
          2019,
          2019,
          0,
          "some passwords were stored in a readable format on our internal systems. Nobody outside the company saw them, but we recommend changing your password",
        ],
        [
          "webkinz",
          2019,
          2019,
          1,
          "the Webkinz World forums were hacked and usernames and scrambled passwords were taken",
        ],
        [
          "animaljam",
          2020,
          2020,
          1,
          "a database with usernames, email addresses and scrambled passwords was stolen from a third-party service we use",
        ],
        [
          "neopets",
          2022,
          2022,
          1,
          "a database with account details, including passwords, was stolen and offered for sale",
        ],
      ];
      function breachYear() {
        const e = socYear(),
          t = (state.leaks ||= []);
        let a = null;
        for (const [o, n, s, r, i] of BREACHES) {
          if (e < n) continue;
          const l = `${o}:${n}`;
          for (const c in state.social) {
            if (socBase(c) !== o) continue;
            const d = state.social[c],
              u = (d.breach ||= {}),
              h = socOf(c)[1];
            if (acctMade(d) > n) {
              u[l] = "n/a";
              continue;
            }
            if (
              (r && !u[l]
                ? ((u[l] = "leaked"), t.push({ pw: pwAt(c, n), site: h, y: n }))
                : u[l] || (u[l] = "leaked"),
              e < s || "told" === u[l])
            )
              continue;
            u[l] = "told";
            const p = r && pwOf(c) === pwAt(c, n);
            p && setPw(c, uniquePw()),
              d.email &&
                mailTo(
                  d.email,
                  h,
                  n === s
                    ? `Important: ${h} security incident`
                    : `Important information about your ${h} account`,
                  `${n === s ? "We recently discovered that" : `We recently learned that in ${n},`} ${i}.${p ? " As a precaution, we've reset your password. You'll need to make a new one next time you sign in." : ""}` +
                    (r
                      ? " If you used the same password on any other site, change it there right away."
                      : ""),
                ),
              say(
                `${h} told me my account data was ${r ? "stolen" : "exposed"} in a ${n === s ? "" : `${n} `}data breach.`,
              ),
              !a && e - s <= 1 && (a = { k: c, n: h, by: n, leaks: r, pw: pwAt(c, n) });
          }
        }
        a && queuePopup(() => breachCard(a)), stuffYear();
      }
      function breachCard({ k: e, n: t, by: a, leaks: o, pw: n }) {
        const s = o ? pwUses(n).filter((t) => t !== e) : [],
          r = o ? mailPwUses(n).filter((e) => !e.hacked) : [];
        if (r.length) {
          const o = [...new Set(s.map((e) => socOf(e)[1]))].slice(0, 3),
            i = s.length + r.length;
          return jCard({
            tag: "Social",
            iconSrc: socIcon(socBase(e)),
            title: "Data breach",
            surprise: !1,
            lead: `${t} was hacked${a < socYear() - 1 ? ` back in ${a}` : ""} and your password leaked.<br><br>You use the same password on ${r.map((e) => e.addr).join(", ")}${o.length ? ` and ${o.join(", ")}` : ""}. Hackers try leaked passwords everywhere, and whoever gets into your email can get into everything linked to it.`,
            choices: [
              [
                "Change it everywhere",
                () => {
                  s.forEach((e) => setPw(e, uniquePw())),
                    bankPwOf() === n && ((state.bankPw = uniquePw()), (state.bankPwY = socYear())),
                    r.forEach((e) => {
                      (e.pw = uniquePw()), (e.pwY = socYear());
                    }),
                    say(`My ${t} password leaked, so I changed it everywhere I used it, including my email.`),
                    notice(
                      "Locked down",
                      `You changed your password on ${i} account${i > 1 ? "s" : ""}.`,
                      null,
                      !0,
                    );
                },
              ],
              [
                "Ignore it",
                () => {
                  say(
                    `My ${t} password leaked in a data breach. I didn't change it anywhere, not even on my email.`,
                  );
                },
              ],
            ],
          });
        }
        if (!s.length)
          return notice(
            "Data breach",
            `${t} was ${o ? "hacked" : "caught storing passwords badly"}${a < socYear() - 1 ? ` back in ${a}` : ""}, and your account was affected.${o ? " Your password there was reset, and you don't use it anywhere else, so you're safe." : " Changing your password is a good idea."}`,
            null,
            !0,
          );
        jCard({
          tag: "Social",
          iconSrc: socIcon(socBase(e)),
          title: "Data breach",
          surprise: !1,
          lead: `${t} was hacked${a < socYear() - 1 ? ` back in ${a}` : ""} and your password leaked.<br><br>You use the same password on ${s.length} other account${s.length > 1 ? "s" : ""} (${[...new Set(s.map((e) => socOf(e)[1]))].slice(0, 4).join(", ")}). Hackers try leaked passwords everywhere.`,
          choices: [
            [
              "Change it everywhere",
              () => {
                s.forEach((e) => setPw(e, uniquePw())),
                  bankPwOf() === n && ((state.bankPw = uniquePw()), (state.bankPwY = socYear())),
                  say(`My ${t} password leaked, so I changed it everywhere I used it.`),
                  notice(
                    "Locked down",
                    `You changed your password on ${s.length} account${s.length > 1 ? "s" : ""}.`,
                    null,
                    !0,
                  );
              },
            ],
            [
              "Ignore it",
              () => {
                say(`My ${t} password leaked in a data breach. I didn't change it anywhere.`);
              },
            ],
          ],
        });
      }
      function stuffYear() {
        const e = socYear(),
          t = (state.leaks || []).filter((t) => e - t.y <= 8);
        if (!t.length || state.prison) return;
        const a = new Map(t.map((e) => [e.pw, e]));
        let o = null;
        for (const e in state.social) {
          const t = state.social[e];
          if (t.banned || socEnded(e) || t.twofa || !socOf(e)) continue;
          const n = a.get(pwOf(e));
          if (!n) continue;
          const s = notSocial(e) ? 0 : nameValue(handleOf(e), e),
            r = s >= 1e3 ? 0.5 : notSocial(e) ? 0.15 : 0.1;
          chance(r) && (!o || s > o.v) && (o = { k: e, v: s, l: n });
        }
        o && queueRoll(() => stuffCard(o.k, o.v, o.l));
      }
      function stuffCard(e, t, a) {
        const o = state.social[e];
        if (!o) return;
        const n = socBase(e),
          [, s, r] = socOf(e),
          i = pickR(["Russia", "Brazil", "Vietnam", "Nigeria", "Romania", "Indonesia", "an unknown device"]);
        if ((setPw(e, uniquePw()), notSocial(e)))
          return (
            say(`Someone got into my ${s} account with a password that leaked in the ${a.site} breach.`),
            notice(
              "Account hacked",
              `Someone in ${i} logged into your ${s} account using the password you also used on ${a.site}, which leaked in its ${a.y} breach. You reset your password and kicked them out.`,
              null,
              !0,
            )
          );
        if (t >= 1e3) {
          const t = loseHandle(e);
          return jCard({
            tag: "Social",
            iconSrc: socIcon(n),
            title: "Account stolen",
            surprise: !0,
            lead: `Hackers logged into your ${s} account @${t} using the same password you used on ${a.site}, which leaked in its ${a.y} data breach. They moved @${t} to their own account and left you with @${o.handle}.<br><br>What will you do?`,
            choices: [
              [
                `Report it to ${s}`,
                () => {
                  if (chance(0.25))
                    return (
                      (o.handle = t),
                      say(`${s} gave me back @${t} after hackers stole it with a leaked password.`),
                      notice("Recovered", `${s} support restored @${t} to your account.`, null, !0)
                    );
                  say(
                    `Hackers stole my ${s} username @${t} with a password leaked in the ${a.site} breach. Support couldn't help.`,
                  ),
                    notice("No luck", `${s} support couldn't do anything. @${t} is gone.`, null, !0);
                },
              ],
              [
                "Let it go",
                () => {
                  say(`Hackers stole my ${s} username @${t} with a password leaked in the ${a.site} breach.`),
                    notice("Gone", `@${t} is gone.`, null, !0);
                },
              ],
            ],
          });
        }
        const l = hackMischief(e, 0.05, 0.2);
        say(`Hackers got into my ${s} account with a password leaked in the ${a.site} breach and ${l.log}.`),
          notice(
            "Account hacked",
            `Someone in ${i} logged into your ${s} account using the password you also used on ${a.site}, which leaked in its ${a.y} breach. They ${l.text} before you got back in.<br><br>You reset your password.${l.after}`,
            null,
            !0,
          );
      }
      function hackMischief(e, t = 0.03, a = 0.15) {
        const o = state.social[e],
          [, n, s] = socOf(e),
          r = socBase(e),
          i = GAMING.has(r),
          l = socYear(),
          c = Math.round((o.subs || 0) * (t + Math.random() * (a - t))),
          d = c ? `<br><br>You lost ${fmtN(c)} ${1 === c ? s.replace(/s$/, "") : s}.` : "",
          u = pickR([
            "you all suck lol",
            "this game is trash and so r u",
            "hacked lmao get rekt",
            "L + ratio + you got hacked",
          ]),
          h = i
            ? [
                () => (
                  (o.about = "roblox" === r && l >= 2009 ? rbxFilter(`${u} shit`) : `${u} shit`),
                  {
                    text: "changed your About Me to swear words",
                    log: "changed my about me to swear words",
                    after:
                      "roblox" === r && l >= 2009
                        ? "<br><br>Roblox's filter turned most of it into ####, but you should fix it."
                        : "<br><br>Change it before a moderator sees it.",
                  }
                ),
                ...("roblox" === r && (rbxOf(e).robux || 0) > 0
                  ? [
                      () => {
                        const t = rbxOf(e),
                          a = t.robux;
                        return (
                          (t.robux = 0),
                          {
                            text: `spent all your Robux (R$ ${fmtN(a)}) on junk`,
                            log: "spent all my Robux",
                            after: "",
                          }
                        );
                      },
                    ]
                  : []),
                ...("roblox" === r && (rbxOf(e).inv || []).length
                  ? [
                      () => {
                        const t = rbxOf(e).inv.pop();
                        return {
                          text: `traded away your ${t.name || "item"} to their own account`,
                          log: `traded away my ${t.name || "item"}`,
                          after: "",
                        };
                      },
                    ]
                  : []),
                () => (
                  p(),
                  {
                    text: "sent rude messages to everyone on your friends list",
                    log: "sent rude messages to my friends",
                    after: d,
                  }
                ),
                () => ({
                  text: "changed your avatar to something ridiculous and wore it around every game",
                  log: "messed with my avatar",
                  after: "",
                }),
              ]
            : [
                () => (
                  p(),
                  {
                    text: "posted a bunch of embarrassing stuff from your account",
                    log: "posted embarrassing stuff from my account",
                    after: d,
                  }
                ),
                () => (
                  p(),
                  {
                    text: `messaged all your ${s} weird links`,
                    log: `messaged my ${s} weird links`,
                    after: d,
                  }
                ),
                () => (
                  (o.about = `${u} shit`),
                  {
                    text: "changed your bio to swear words",
                    log: "changed my bio to swear words",
                    after: "<br><br>Change it back before people screenshot it.",
                  }
                ),
                () => (
                  p(),
                  {
                    text: "started fights in the comments of famous people's posts as you",
                    log: "started fights in comments as me",
                    after: d,
                  }
                ),
              ];
        function p() {
          (o.subs = Math.max(0, (o.subs || 0) - c)), (o.fake = Math.min(o.fake || 0, o.subs));
        }
        return pickR(h)();
      }
      function guessReach(e, t) {
        const a =
          e < 2e3
            ? 3
            : e < 2009
              ? 4 + 0.3 * (e - 2e3)
              : e < 2015
                ? 7 + 0.35 * (e - 2009)
                : Math.min(12, 9.1 + 0.2 * (e - 2015));
        return Math.min(11.5, a + (t >= 1e3 ? Math.min(3, Math.log10(t) - 2) : 0));
      }
      function guessYear() {
        const e = socYear();
        if (state.prison) return;
        let t = null;
        for (const a in state.social) {
          const o = state.social[a];
          if (o.banned || o.twofa || socEnded(a) || !socOf(a)) continue;
          const n = pwStrength(pwOf(a)),
            s = notSocial(a) ? 0 : nameValue(handleOf(a), a),
            r = guessReach(e, s) - n;
          if (r <= 0) continue;
          const i = Math.min(0.85, 0.04 + 0.12 * r) * (s >= 1e3 ? 1.3 : 1);
          chance(i) && (!t || s > t.v) && (t = { k: a, v: s, g: n });
        }
        t && queueRoll(() => hackedAcct(t.k, t.v));
      }
      const HACK_DOMAINS = [
        "protonmail.ch",
        "tutanota.com",
        "yandex.ru",
        "mail.ru",
        "mailinator.com",
        "guerrillamail.com",
        "gmx.com",
        "outlook.com",
      ];
      function hackedAcct(e, t) {
        const a = state.social[e];
        if (!a || a.banned) return;
        const o = Math.random(),
          n = o < 0.35 ? "kicked" : o < 0.6 ? "spam" : o < 0.82 ? "changed" : "locked",
          [, s, r] = socOf(e),
          i = socYear();
        if (notSocial(e))
          return (
            setPw(e, uniquePw()),
            a.email &&
              mailTo(
                a.email,
                s,
                "New sign-in to your account",
                `Someone signed in to your ${s} account from a new device. We've signed everyone out and reset your password.`,
                null,
                !0,
              ),
            say(`Someone guessed my ${s} password and was watching on my account.`),
            notice(
              "Account hacked",
              `Someone guessed your ${s} password and was watching on your account. ${s} signed them out and reset your password.`,
              null,
              !0,
            )
          );
        if ("kicked" === n)
          return (
            setPw(e, uniquePw()),
            a.email &&
              mailTo(
                a.email,
                s,
                "New sign-in to your account",
                `There was a sign-in to @${showHandle(e)} from a new device. If this wasn't you, change your password.`,
                null,
                !0,
              ),
            say(`Someone got into my ${s} account, but I caught it and kicked them out.`),
            notice(
              "Hacker kicked out",
              `Someone guessed your ${s} password and logged in, but you got the sign-in alert, changed your password and kicked them out before they did anything.`,
              null,
              !0,
            )
          );
        if ("spam" === n) {
          setPw(e, uniquePw());
          const t = hackMischief(e);
          return (
            say(`Hackers got into my ${s} account and ${t.log} before I got it back.`),
            notice(
              "Account hacked",
              `Someone guessed your ${s} password and ${t.text} before you got back in and changed your password.${t.after}`,
              null,
              !0,
            )
          );
        }
        const l = `${pickR(["acct", "rec", "swap", "og", "xx", "zz"])}${rint(100, 99999)}@${pickR(HACK_DOMAINS.filter((e) => i >= 2013 || "tutanota.com" !== e))}`;
        (a.banned = !0),
          (a.banAge = state.age),
          (a.hackWhy = n),
          (a.hackY = i),
          (a.appealAt = 0),
          "changed" === n && (a.hackMail = l),
          "changed" === n && t >= 1e3 && (a.hackHandle = loseHandle(e));
        const c = a.hackHandle;
        a.email &&
          mailTo(
            a.email,
            s,
            "changed" === n
              ? "Your account information was changed"
              : "We locked your account to keep it safe",
            "changed" === n
              ? `The email address on your ${s} account was changed to ${l}.${c ? ` Your username was also changed from @${c}.` : ""} If you didn't make this change, your account may have been compromised. Submit an appeal to recover it.`
              : `We noticed sign-ins to your ${s} account that look like someone guessing your password, so we've deactivated it for your safety. Submit an appeal to get it back.`,
            null,
            !0,
          ),
          say(
            "changed" === n
              ? `Someone guessed my ${s} password and changed the account's email to ${l}.`
              : `${s} locked my account after someone kept guessing my password.`,
          ),
          notice(
            "changed" === n ? "Account hijacked" : "Account locked",
            "changed" === n
              ? `Someone guessed your ${s} password and changed the account's email to ${l}.${c ? ` They also took @${c}.` : ""}<br><br>The account is disabled until you appeal. Check your email.`
              : `${s} deactivated your account for your safety after someone tried to guess your password.<br><br>Appeal to get it back. Check your email.`,
            null,
            !0,
          );
      }
      function restoreAcct(e) {
        const t = state.social[e];
        t &&
          ((t.banned = !1),
          (t.hackWhy = t.hackMail = t.hackHandle = null),
          delete t.banWhy,
          delete t.banAge,
          (t.appealAt = 0),
          (t.restoredAt = state.age));
      }
      const BAN_WAIT_MAX = {
        bots: 0.45,
        locked: 0.15,
        kicked: 0.15,
        spam: 0.15,
        changed: 0.3,
        inactive: 0.45,
        oldname: 0.45,
        edgy: 0.4,
        about: 0.4,
        offensive: 0.3,
        trademark: 0.25,
        evasion: 0.2,
      };
      function banWait(e) {
        return (e.banAge ??= state.age), state.age - e.banAge;
      }
      function waitBoost(e, t) {
        const a = banWait(e);
        if (a < 5) return 0;
        const o = e.hackWhy || e.banWhy || "bots";
        return (BAN_WAIT_MAX[o] ?? 0.3) * (0.25 + 0.75 * Math.min(1, (a - 5) / 14)) * (t ? 0.3 : 1);
      }
      const waitNote = (e) => (banWait(e) >= 5 ? ` after waiting ${banWait(e)} years` : ""),
        showAcct = (e) => {
          state.social[e] && !state.dead && (screen.classList.add("open"), openSocialAccount(e));
        };
      function hackAppealCard(e, t) {
        const a = state.social[e],
          [, o] = socOf(e);
        socSelCard({
          icon: socIcon(socBase(e)),
          title: "Appeal",
          lead:
            "changed" === a.hackWhy
              ? `Someone changed the email on your ${o} account to ${a.hackMail}. Prove the account is yours to get it back.`
              : `${o} deactivated your account for your safety. Prove the account is yours to get it back.`,
          label: "Pick your appeal:",
          opts: ["Send proof of ID", "Answer my security questions", "Send an angry message"],
          btn: "Submit appeal",
          onGo: (t) => {
            if (state.age < a.appealAt)
              return notice(
                "Too soon",
                `${o} won't look at another appeal yet. You can try again at age ${a.appealAt}.`,
                null,
                !0,
              );
            const n = Math.min(
                0.95,
                ["locked" === a.hackWhy ? 0.8 : 0.6, "locked" === a.hackWhy ? 0.65 : 0.45, 0.08][t] +
                  waitBoost(a, 2 === t),
              ),
              s = waitNote(a);
            if (chance(n)) {
              const t = a.hackHandle && chance(0.6) ? a.hackHandle : null;
              return (
                t && (a.handle = t),
                restoreAcct(e),
                setPw(e, uniquePw()),
                say(`${o} gave my account back after I appealed${s}${t ? `, with @${t}` : ""}.`),
                a.email &&
                  mailTo(
                    a.email,
                    o,
                    "Your account has been restored",
                    `Your ${o} account is yours again. We've set a new password for you.${t ? ` Your username @${t} was restored.` : ""}`,
                    null,
                    !0,
                  ),
                void notice(
                  "Recovered",
                  `${o} restored your account${t ? ` and gave you back @${t}` : ""}. You have a new, strong password.`,
                  () => showAcct(e),
                  !0,
                )
              );
            }
            const r = rint(1, 2);
            (a.appealAt = state.age + r),
              say(`${o} denied my appeal to get my hacked account back.`),
              notice(
                "Appeal denied",
                `${o} couldn't confirm the account is yours. You can try again in ${r} year${r > 1 ? "s" : ""}.`,
                null,
                !0,
              );
          },
        });
      }
      function emailHackYear() {
        const e = socYear(),
          t = state.emails || [];
        if (!t.length || state.prison) return;
        const a = new Map((state.leaks || []).filter((t) => e - t.y <= 8).map((e) => [e.pw, e]));
        let o = null;
        for (const n of t) {
          if (n.hacked || (n.made || 0) > e) continue;
          const t = emailPwOf(n),
            s = a.get(t),
            r = nameValue(n.addr.split("@")[0], n.prov),
            i = guessReach(e, r) - pwStrength(t),
            l = Math.max(s ? 0.2 : 0, i > 0 ? Math.min(0.6, 0.03 + 0.1 * i) : 0);
          l && chance(l) && (!o || r > o.v) && (o = { e: n, v: r, l: s || null });
        }
        o && queueRoll(() => emailHackedCard(o.e, o.l));
      }
      function emailHackedCard(e, t, a) {
        if (!e || e.hacked) return;
        const o =
            (a && a.hacked && a.hacked.where) ||
            pickR(["Russia", "Brazil", "Vietnam", "Nigeria", "Romania", "Indonesia", "an unknown device"]),
          n = a ? Math.max(2, (a.hacked && a.hacked.skill) || 2) : chance(0.5) ? 1 : chance(0.6) ? 2 : 3,
          s = { q: !(!e.sec || !e.sec.q), phone: !!e.phone, backup: e.backup || null },
          r = ["q", "phone", "backup"].filter((e) => s[e]),
          i = 3 === n ? r : 2 === n && r.length ? [pickR(r)] : [];
        a && !i.includes("backup") && s.backup && i.push("backup"),
          (e.hacked = {
            y: socYear(),
            how: a ? "backup" : t ? "leak" : "guess",
            site: t ? t.site : null,
            via: a ? a.addr : null,
            recAt: 0,
            skill: n,
            had: s,
            changed: i,
            where: o,
          }),
          (e.pw = uniquePw()),
          (e.pwY = socYear()),
          say(
            a
              ? `Hackers who got into my backup email ${a.addr} used it to reset the password on my main email ${e.addr}.`
              : t
                ? `Someone got into my email ${e.addr} with a password that leaked in the ${t.site} breach and changed the password.`
                : `Someone guessed the password to my email ${e.addr} and changed it. I can't log in anymore.`,
          ),
          notice(
            "Email hacked",
            (a
              ? `The hackers who took over ${a.addr} saw it was the backup for ${e.addr}. They sent a password reset link to it and took over ${e.addr} too.`
              : t
                ? `Someone in ${o} signed in to ${e.addr} using the password you also used on ${t.site}, which leaked in its ${t.y} breach.`
                : `Someone in ${o} guessed the password to ${e.addr}.`) +
              " They changed the password, so you can't log in anymore.<br><br>Try recovering it in the Email section of Assets.",
            null,
            !0,
          );
        for (const t of (state.emails || []).filter((t) => t !== e && !t.hacked && t.backup === e.addr))
          chance(0.75) && queueRoll(() => emailHackedCard(t, null, e), !0);
        const l = Object.keys(state.social).filter((t) => {
          const a = state.social[t];
          return a.email === e.addr && !a.banned && !a.twofa && !socEnded(t) && socOf(t);
        });
        if (l.length && chance(0.4)) {
          const e = pickR(l);
          queueRoll(() => hackedAcct(e, notSocial(e) ? 0 : nameValue(handleOf(e), e)));
        }
      }
      function bankHackYear() {
        const e = socYear();
        if (
          state.age < 13 ||
          !bankOpen() ||
          state.prison ||
          state.dead ||
          (state.bankHack && !state.bankHack.done)
        )
          return;
        const t = state.money + accts().reduce((e, t) => e + (t.bal || 0), 0);
        if (t < localPrice(200)) return;
        const a = bankPwOf(),
          o = (state.leaks || []).find((t) => e - t.y <= 8 && t.pw === a),
          n = t >= localPrice(5e4) ? 4e3 : t >= localPrice(5e3) ? 1200 : 300,
          s = guessReach(e, n) - pwStrength(a),
          r = bankEmail(),
          i =
            0.75 *
            Math.max(o ? 0.14 : 0, s > 0 ? Math.min(0.35, 0.02 + 0.07 * s) : 0, r && r.hacked ? 0.4 : 0);
        i && chance(i) && queueRoll(() => bankHackedCard(o));
      }
      function bankHackedCard(e) {
        const t = bankFor(),
          a = socYear(),
          o = accts().filter((e) => e.bal > 0),
          n = state.money + o.reduce((e, t) => e + t.bal, 0);
        if (n < 1) return;
        const s = `****${rint(1e3, 9999)}`;
        state.money > 0 &&
          ((txNote = { memo: "transfer", type: "Outgoing Wire", desc: `WIRE TRANSFER TO EXT ACCT ${s}` }),
          (state.money = 0)),
          o.forEach((e) => {
            sideTx(e.num, -e.bal, "Outgoing Wire", `WIRE TRANSFER TO EXT ACCT ${s}`), (e.bal = 0);
          }),
          (state.bankPw = uniquePw()),
          (state.bankPwY = a),
          (state.bankHack = {
            amt: n,
            y: a,
            age: state.age,
            tries: 0,
            appealAt: state.age,
            done: !1,
            how: e ? "leak" : "guess",
            site: e ? e.site : null,
          }),
          renderStats(),
          bankMailTo(
            t,
            "Unusual activity on your account",
            `We detected transfers of ${usd(n)} out of your accounts to an outside account ending in ${s.slice(4)}. We've locked online banking and reset your password. If you didn't make these transfers, file a dispute right away.`,
            bankAddr(),
            !0,
          ),
          say(
            e
              ? `Hackers broke into my ${t} account with a password that leaked in the ${e.site} breach and stole ${usd(n)}.`
              : `Hackers guessed my ${t} password and stole ${usd(n)} from my accounts.`,
          ),
          notice(
            "Bank account hacked",
            `${e ? `Someone logged into your ${t} account using the password you also used on ${e.site}, which leaked in its ${e.y} breach.` : `Someone guessed your ${t} online banking password.`} They wired out all of your money: ${usd(n)}.<br><br>You can dispute the transfers with your bank (Assets → Bank).`,
            null,
            !0,
          );
        const r = (state.lovers || []).find((e) => e.married && !e.dead && !e.ex);
        r && queueRoll(() => spouseBankFight(r, n));
      }
      const BANK_FIGHT = [
        "You used the same password for everything, didn't you? Our whole savings is GONE!",
        "How could you let someone empty OUR bank account?!",
        "That was our money. Our rent, our groceries, everything!",
        "I told you to change that password years ago!",
        "We share that account! You don't get to be careless with it!",
        "Do you even know how long it took us to save that?",
        "I can't believe I trusted you with our finances.",
        "What are we supposed to do now? Live on nothing?",
        "Your password was probably 'password123', wasn't it?",
        "Don't you dare tell me this isn't your fault!",
        "I'm so angry I can't even look at you right now.",
        "Every cent we had is gone because of you!",
        "Our kids could have gone to college with that money!",
        "I am never letting you near our money again.",
      ];
      function spouseBankFight(e, t) {
        if (e.dead || !e.married) return;
        const a = loverTitle(e),
          o = "f" === e.g,
          n = o ? "She" : "He",
          s = o ? "her" : "him",
          r = [...BANK_FIGHT]
            .sort(() => Math.random() - 0.5)
            .slice(0, 2)
            .map((e) => `"${e}"`)
            .join("<br><br>"),
          i = (t) => {
            (e.rel = 0),
              say(`My ${a}, ${e.first}, was furious that our joint bank account got hacked. ${t}`),
              renderStats(),
              notice(
                "Relationship ruined",
                `${e.first} is livid. Your relationship has hit rock bottom.`,
                null,
                !0,
              );
          };
        jCard({
          tag: a,
          person: { name: `${e.first} ${e.last}`, look: e.look, g: e.g, age: loverAge(e), mood: "angry" },
          iconSrc: "emoji/1f92c.png",
          title: "Argument",
          lead: `Your ${a}, ${e.first}, found out hackers emptied your joint account (${usd(t)}).<br><br>${r}<br><br>What will you do?`,
          surprise: !0,
          bars: [["Relationship", e.rel]],
          choices: [
            [`Apologize to ${s}`, () => i("I apologized, but it didn't help.")],
            ["Blame the hackers", () => i(`${n} said it was still my fault.`)],
            ["Argue back", () => i("We had a huge fight about it.")],
            ["Promise to get it back", () => i(`${n} didn't believe me.`)],
          ],
        });
      }
      function bankAppealCard() {
        const e = state.bankHack,
          t = bankFor();
        if (!e || e.done) return;
        if (state.age < e.appealAt)
          return notice(
            "Under review",
            `${t} is still looking at your last dispute. Try again next year.`,
            null,
            !0,
          );
        const a = [
          ["File a fraud claim online", 0.5],
          ["Call the fraud department", 0.4],
          ["Go to a branch in person", 0.6],
        ];
        socSelCard({
          icon: "emoji/1f3e6.png",
          title: "Dispute Transfers",
          tag: "Bank",
          lead: `Hackers wired ${usd(e.amt)} out of your ${t} accounts. Ask the bank to give it back.`,
          label: "How:",
          opts: a.map((e) => e[0]),
          btn: "Dispute",
          onGo: (o) => (
            e.tries++,
            (e.appealAt = state.age + 1),
            chance(a[o][1])
              ? ((e.done = !0),
                chance(0.6)
                  ? ((txNote = { memo: "refund", type: "Fraud Credit", desc: "FRAUD CLAIM CREDIT" }),
                    (state.money += e.amt),
                    renderStats(),
                    bankSound(),
                    bankMailTo(
                      t,
                      "Your dispute was resolved",
                      `We've finished investigating and credited ${usd(e.amt)} back to your checking account.`,
                      bankAddr(),
                      !0,
                    ),
                    say(`${t} investigated and gave me back the ${usd(e.amt)} hackers stole.`),
                    notice(
                      "Money returned",
                      `${t} investigated and returned all ${usd(e.amt)} to your checking account.`,
                      openBank,
                      !0,
                    ))
                  : (say(`${t} investigated the stolen ${usd(e.amt)} but refused to refund it.`),
                    void notice(
                      "Claim denied",
                      `${t} investigated, but because your correct password was used, they ruled the transfers authorized. The money is gone.`,
                      openBank,
                      !0,
                    )))
              : (e.tries >= 3 && (e.done = !0),
                say(`${t} wouldn't look into the money stolen from my account.`),
                notice(
                  "Not reviewed",
                  `${t} declined to investigate.${e.done ? " Your case is closed." : " You can try again next year."}`,
                  openBank,
                  !0,
                ))
          ),
        });
      }
      function emailLoginCard(e, t) {
        (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div><div class="jm-tag" style="margin-top:12px">Email</div>\n      <h4><img src="${socIcon(t)}" alt=""><span>Sign in</span></h4>\n      <div class="lead">${e.addr}</div>\n      <label class="hr-lab">Password:</label><div class="hr-sel txt"><input id="pwIn" type="password" maxlength="24" autocomplete="off" spellcheck="false"\n        style="width:100%;height:40px;border:none;background:transparent;font:inherit;font-size:17px;padding:0 10px"></div>\n      <div class="lead" id="pwHint" style="font-size:14px;margin:10px 0 18px;color:#e2401f"></div>\n      <button class="jm-apply ev-btn" id="emForgot">Forgot password?</button><button class="jm-apply ev-btn" id="socGo">Sign in</button>`),
          (ev.style.overflow = "visible");
        const a = () => {
            evWrap.classList.remove("open"), (ev.style.overflow = "");
          },
          o = document.getElementById("pwHint");
        (document.getElementById("propX").onclick = a),
          (document.getElementById("socGo").onclick = () => {
            play("choice"),
              (o.textContent = document.getElementById("pwIn").value
                ? "Wrong password. Try again or click Forgot password?"
                : "Enter your password.");
          }),
          (document.getElementById("emForgot").onclick = () => {
            a(), setTimeout(() => emailRecoverCard(e, t), 60);
          }),
          evWrap.classList.add("open");
      }
      function emailRecoverCard(e, t) {
        const a = provName(t),
          o = e.hacked,
          n = o.had || {},
          s = new Set(o.changed || []),
          r = 1 - 0.12 * ((o.skill || 1) - 1),
          i = n.backup && (state.emails || []).find((e) => e.addr === n.backup),
          l = [
            ...(n.phone ? [["Send a code to my phone", s.has("phone") ? 0.05 : 0.78]] : []),
            ...(n.q ? [["Answer my security question", s.has("q") ? 0.1 : 0.82]] : []),
            ...(n.backup
              ? [["Send a link to my backup email", s.has("backup") || !i || i.hacked ? 0.05 : 0.72]]
              : []),
            ["Fill out the recovery form", n.phone || n.q || n.backup ? 0.2 : 0.3],
          ].map(([e, t]) => [e, t * r]);
        socSelCard({
          icon: socIcon(t),
          tag: "Email",
          title: "Account recovery",
          lead:
            `Someone changed the password on ${e.addr}. Prove the address is yours to get it back.` +
            (1 === l.length
              ? "<br><br>You never set up a recovery phone, security question or backup email, so the recovery form is all you have."
              : ""),
          label: "Recover with:",
          opts: l.map((e) => e[0]),
          btn: "Recover account",
          onGo: (n) =>
            state.age < o.recAt
              ? notice(
                  "Too soon",
                  `${a} won't take another recovery request yet. You can try again at age ${o.recAt}.`,
                  null,
                  !0,
                )
              : chance(l[n][1])
                ? void pwCard(
                    a,
                    (n) => {
                      (e.hacked = null),
                        (e.pw = n),
                        (e.pwY = socYear()),
                        s.has("phone") && (e.phone = null),
                        s.has("q") && (e.sec = null),
                        s.has("backup") && (e.backup = null),
                        hackerTrailMail(e, a, o),
                        mailTo(
                          e.addr,
                          a,
                          "Your account has been recovered",
                          `You're signed back in to ${e.addr}. Check your security settings, and if you used your old password anywhere else, change it there too.`,
                          null,
                          !0,
                        ),
                        say(`I got my hacked email ${e.addr} back.`),
                        notice(
                          "Recovered",
                          `${e.addr} is yours again with a new password.${s.size ? "<br><br>The hacker changed your recovery info. Check your inbox to see what they did, then set it up again in Security." : "<br><br>Check your inbox to see what happened."}`,
                          () => openEmailProvider(t),
                          !0,
                        );
                    },
                    null,
                    e,
                  )
                : ((o.recAt = state.age + 1),
                  say(`I couldn't get my hacked email ${e.addr} back.`),
                  notice(
                    "Recovery failed",
                    `${l[n][0].startsWith("Send a code") && s.has("phone") ? "The code went to a phone number that isn't yours anymore. " : l[n][0].startsWith("Answer") && s.has("q") ? "Your answer didn't match. Someone changed the question. " : l[n][0].startsWith("Send a link") && (s.has("backup") || !i || i.hacked) ? "The link went to an address you can't get into. " : ""}${a} couldn't confirm ${e.addr} is yours. You can try again next year.`,
                    null,
                    !0,
                  )),
        });
      }
      function hackerTrailMail(e, t, a) {
        const o = `${pickR(["recovery", "secure", "acct", "backup"])}${rint(10, 9999)}@${pickR(HACK_DOMAINS)}`,
          n = `(${rint(201, 989)}) ${rint(200, 999)}-${String(rint(0, 9999)).padStart(4, "0")}`,
          s = [
            [
              "New sign-in to your account",
              `Someone signed in to ${e.addr} from ${a.where || "an unknown device"}. If this wasn't you, your account may be compromised.`,
            ],
            [
              "Your password was changed",
              `The password for ${e.addr} was just changed. If you didn't do this, recover your account right away.`,
            ],
          ],
          r = a.changed || [];
        r.includes("phone") &&
          s.push([
            "Your recovery phone number was changed",
            `The recovery phone on ${e.addr} was changed to ${maskPhone(n)}.`,
          ]),
          r.includes("backup") &&
            s.push(["Your backup email was changed", `The backup email for ${e.addr} was changed to ${o}.`]),
          r.includes("q") &&
            s.push([
              "Your security question was changed",
              `The security question and answer on ${e.addr} were changed.`,
            ]);
        const i = [
          ["Mail forwarding turned on", `All new mail to ${e.addr} is now being forwarded to ${o}.`],
          ["Your contacts were exported", `Your contact list was downloaded from ${e.addr}.`],
          ["Messages deleted", `${rint(20, 300)} messages were moved to the trash from ${e.addr}.`],
          ["New recovery phone added", `A recovery phone ending in ${n.slice(-4)} was added to ${e.addr}.`],
        ];
        for (; s.length < 4; ) s.push(i.splice(rint(0, i.length - 1), 1)[0]);
        s.forEach(([a, o]) => mailTo(e.addr, t, a, o, null, !0));
      }
      function randomHandle(e = 1) {
        const t = window.RANDOM_NAMES || {},
          a = socYear(),
          o = Object.keys(t)
            .map(Number)
            .sort((e, t) => e - t),
          n = o.filter((e) => e <= a).pop() ?? o[0];
        if (null == n) return "";
        const s = (t[n] || []).filter((t) => {
          return t.length <= 15 && t.length >= e && !((o = t.match(/((?:19|20)\d\d)$/)) && +o[1] > a);
          var o;
        });
        return s.length ? pickR(s) : "";
      }
      const rbxFilter = (e) =>
        e.replace(/\S+/g, (e) => (BAD_WORDS.test(e.toLowerCase()) ? "#".repeat(e.length) : e));
      function aboutCard(e, t) {
        const [, a] = socOf(e),
          o = state.social[e],
          n = "roblox" === socBase(e);
        (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div><div class="jm-tag" style="margin-top:12px">Social</div>\n      <h4><img src="${socIcon(socBase(e))}" alt=""><span>About Me</span></h4>\n      <div class="lead">What should your ${a} About Me say?</div>\n      <label class="hr-lab">About me:</label><div class="hr-sel txt"><input id="abIn" maxlength="120" autocomplete="off" spellcheck="false"\n        style="width:100%;height:40px;border:none;background:transparent;font:inherit;font-size:16px;padding:0 10px" value="${escAttr(o.about || "")}" placeholder="Say something about yourself"></div>\n      <button class="jm-apply ev-btn" id="socGo">Save</button>`),
          (ev.style.overflow = "visible");
        const s = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = s),
          (document.getElementById("socGo").onclick = () => {
            const r = document.getElementById("abIn").value.replace(/[<>]/g, "").trim().slice(0, 120),
              i = socYear(),
              l = BAD_WORDS.test(r.toLowerCase());
            s();
            const c = n && i >= 2009 && l;
            if (
              ((o.about = c ? rbxFilter(r) : r),
              say(
                r
                  ? `I updated my ${a} about me${c ? ", but the filter turned part of it into ####" : ""}.`
                  : `I cleared my ${a} about me.`,
              ),
              n && l && i < 2009 && chance(0.4))
            )
              return (
                (o.banned = !0),
                (o.banAge = state.age),
                (o.banWhy = "about"),
                (o.appealAt = state.age + rint(1, 2)),
                (o.lostHandle = showHandle(e)),
                o.email &&
                  mailTo(
                    o.email,
                    a,
                    "Your account has been suspended",
                    `Your account @${o.lostHandle} was suspended for inappropriate content in your About Me. You may appeal after a review period.`,
                  ),
                say(`${a} suspended my account for what I wrote in my about me.`),
                notice(
                  "Account suspended",
                  `A ${a} moderator saw your About Me and suspended @${o.lostHandle} for inappropriate content.<br><br>You can appeal at age ${o.appealAt}.`,
                  t,
                  !0,
                )
              );
            notice(
              "About Me",
              c
                ? `Saved, but ${a}'s filter tagged it:<br><br>"${escAttr(o.about)}"`
                : r
                  ? `Your About Me now says:<br><br>"${escAttr(o.about)}"`
                  : "Your About Me is empty now.",
              t,
              !0,
            );
          }),
          evWrap.classList.add("open");
      }
      const RBX_RENAME = 1e3;
      function renameCard(e, t) {
        const [, a] = socOf(e),
          o = state.social[e],
          n = SOC_MINLEN[socBase(e)] || 1,
          s = "roblox" === socBase(e) && rbxUI();
        (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div><div class="jm-tag" style="margin-top:12px">Social</div>\n      <h4><img src="${socIcon(socBase(e))}" alt=""><span>Username</span></h4>\n      <div class="lead">Your ${a} username is @${showHandle(e)}.<br><br>Pick a new one (${n}-15 letters, numbers, dots or underscores).${s ? `<br><br>A username change costs R$ ${fmtN(RBX_RENAME)}. You have R$ ${fmtN(rbxOf(e).robux)}.` : ""}</div>\n      <label class="hr-lab">New username:</label><div class="hr-sel txt" style="display:flex;align-items:center"><input id="socName" maxlength="15" autocomplete="off" spellcheck="false"\n        style="flex:1;min-width:0;height:40px;border:none;background:transparent;font:inherit;font-size:17px;padding:0 4px 0 10px" value="${handleOf(e)}">\n        <button id="socRand" aria-label="Random username" style="flex:none;width:32px;height:32px;margin-right:6px;border:none;padding:0;cursor:pointer;background:url(newlife/randomize.png) center/contain no-repeat"></button></div>\n      <button class="jm-apply ev-btn" id="socGo">Change username</button>`),
          (ev.style.overflow = "visible");
        const r = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = r),
          (document.getElementById("socRand").onclick = () => {
            play("choice");
            const e = document.getElementById("socRand"),
              t = randomHandle(n);
            t && (document.getElementById("socName").value = t),
              e.animate(
                [
                  { transform: "rotate(0)" },
                  { transform: "rotate(-90deg) scale(.92)" },
                  { transform: "rotate(0)" },
                ],
                { duration: 250 },
              );
          }),
          (document.getElementById("socGo").onclick = () => {
            const i = document.getElementById("socName").value,
              l = cleanFor(e, i);
            if ((r(), isBadName(i) || isBadName(l)))
              return notice("Not allowed", `${a} doesn't allow that username.`, null, !0);
            if (l.length < n)
              return notice(
                "Too short",
                `${a} usernames need at least ${n} character${n > 1 ? "s" : ""}.`,
                null,
                !0,
              );
            if (l === o.handle) return;
            if (s && rbxOf(e).robux < RBX_RENAME)
              return notice(
                "Not enough Robux",
                `Changing your ${a} username costs R$ ${fmtN(RBX_RENAME)}. You only have R$ ${fmtN(rbxOf(e).robux)}.`,
                null,
                !0,
              );
            const c = dcTagged(e) ? null : npcOwner(socBase(e), l);
            if (c && !c.sold)
              return (
                say(`I tried to change my ${a} username to @${l}, but it was taken.`),
                notice("Taken", `Someone already has @${l} on ${a}.`, null, !0)
              );
            const d = o.handle;
            (o.handle = l),
              s && (rbxOf(e).robux -= RBX_RENAME),
              say(`I changed my ${a} username from @${d} to @${l}${s ? ` for R$ ${fmtN(RBX_RENAME)}` : ""}.`),
              notice(
                "New name",
                `You're now @${l} on ${a}.${s ? ` That cost R$ ${fmtN(RBX_RENAME)}.` : ""}`,
                t,
                !0,
              );
          }),
          evWrap.classList.add("open");
      }
      function socialNameYear() {
        const e = [];
        for (const t in state.social) {
          const a = state.social[t];
          if (a.banned || !socOf(t) || notSocial(t)) continue;
          const o = nameValue(handleOf(t), t);
          if (o < 150) continue;
          const n = a.handle.length,
            s = 1 + 0.15 * Math.min(a.years || 0, 20),
            r =
              socYear() < 2009
                ? n <= 2 || o >= 1e5
                  ? rint(800, 1200)
                  : o >= 1e4
                    ? rint(400, 800)
                    : o >= 1e3
                      ? rint(200, 500)
                      : rint(10, 60)
                : Math.round(
                    (n <= 2
                      ? rint(2e4, 1e5)
                      : o >= 1e5
                        ? rint(8e3, 4e4)
                        : o >= 1e4
                          ? rint(2e3, 8e3)
                          : o >= 5e3
                            ? rint(800, 3e3)
                            : o >= 1e3
                              ? rint(300, 900)
                              : rint(20, 150)) * s,
                  );
          (a.subs += r), (a.nameFans = (a.nameFans || 0) + r), e.push({ k: t, v: o });
        }
        if (!e.length || state.prison) return;
        let t = Math.random() * e.reduce((e, t) => e + Math.sqrt(t.v), 0),
          a = e[0];
        for (const o of e)
          if (((t -= Math.sqrt(o.v)), t <= 0)) {
            a = o;
            break;
          }
        const { k: o, v: n } = a,
          s = state.social[o],
          r = s.handle.length,
          i = celebOf(s.handle);
        return i && !s.celebAsked && bigPlat(o) && chance(0.45)
          ? ((s.celebAsked = state.age), queueRoll(() => offerCard(o, i)))
          : r <= 2 && SWAT_PLAT.has(socBase(o)) && state.age >= 16 && chance(1 === r ? 0.14 : 0.07)
            ? queueRoll(() => swatCard(o))
            : n >= 3e3 && chance(Math.min(0.3, 0.03 + n / 4e5 + (i ? 0.08 : 0)))
              ? queueRoll(() => hackCard(o))
              : void (
                  chance(n >= 1e3 ? Math.min(0.45, 0.08 + n / 15e4) : 0.06) && queueRoll(() => offerCard(o))
                );
      }
      function nameFamilyYear() {
        const e = window.NAME_FAMILY_EVENTS || [];
        if (!e.length || state.prison) return;
        let t = null;
        for (const e in state.social) {
          if (state.social[e].banned || !socOf(e) || notSocial(e)) continue;
          const a = nameValue(handleOf(e), e);
          a >= 1e3 && (!t || a > t.v) && (t = { k: e, v: a });
        }
        if (!t || !chance(Math.min(0.45, 0.12 + t.v / 2e5))) return;
        const a = [
          ...aliveParents().map((e) => ({ p: e, first: e.first, rel: `your ${e.role.toLowerCase()}` })),
          ...(state.family || [])
            .filter((e) => !e.dead && famOn(e) && e.first)
            .map((e) => ({ p: e, first: e.first, rel: `your ${relTitle(e).toLowerCase()}` })),
        ];
        a.length && queueRoll(() => nameFamilyCard(t.k, pickR(a), pickR(e)));
      }
      function nameFamilyCard(e, t, [a, o, n]) {
        const s = state.social[e];
        if (!s) return;
        const [, r] = socOf(e),
          i = handleOf(e),
          l = (e) =>
            e
              .replace(/\{Rel\}/g, ((e) => e[0].toUpperCase() + e.slice(1))(t.rel))
              .replace(/\{rel\}/g, t.rel)
              .replace(/\{name\}/g, t.first)
              .replace(/\{h\}/g, i)
              .replace(/\{n\}/g, r),
          c = (e, a, o, n = {}) => {
            var s;
            n.h && (state.stats.Happiness = clamp(state.stats.Happiness + n.h)),
              n.r && ((s = n.r), t.p && null != t.p.rel && (t.p.rel = clamp(t.p.rel + s))),
              renderStats(),
              say(l(e)),
              notice(a, l(o), null, !0);
          },
          d =
            {
              buyer: [
                [
                  "Say it's not for sale",
                  () =>
                    c(
                      "I told {rel} {name} that @{h} is not for sale.",
                      "Not for sale",
                      "You told {name} that @{h} isn't for sale.",
                      { r: 2 },
                    ),
                ],
                [
                  "Hear their offer",
                  () => {
                    say(l("{Rel} {name} passed along an offer for @{h}.")), offerCard(e);
                  },
                ],
                [
                  "Tell {name} to ignore them",
                  () =>
                    c(
                      "I told {rel} {name} to ignore people asking about @{h}.",
                      "Ignored",
                      "{name} will ignore them from now on.",
                    ),
                ],
              ],
              pest: [
                [
                  "Tell {name} to block them",
                  () =>
                    c(
                      "I helped {rel} {name} block the people asking about @{h}.",
                      "Blocked",
                      "You helped {name} block them. It got quieter.",
                      { r: 3 },
                    ),
                ],
                [
                  "Report them",
                  () =>
                    c(
                      "I reported the people bothering {rel} {name} about @{h}.",
                      "Reported",
                      "You reported the accounts. Some of them got taken down.",
                      { r: 2 },
                    ),
                ],
                [
                  "Apologize to {name}",
                  () =>
                    c(
                      "I apologized to {rel} {name} for all the messages about @{h}.",
                      "Sorry",
                      "{name} appreciated the apology.",
                      { r: 4, h: -1 },
                    ),
                ],
              ],
              proud: [
                [
                  "Thank {name}",
                  () =>
                    c(
                      "I thanked {rel} {name} for being so proud of @{h}.",
                      "Family pride",
                      "{name} beamed.",
                      { r: 4, h: 3 },
                    ),
                ],
                [
                  "Brag a little too",
                  () =>
                    c("I bragged about @{h} with {rel} {name}.", "Show-off", "You both had a good laugh.", {
                      r: 2,
                      h: 4,
                    }),
                ],
                [
                  "Tell {name} to tone it down",
                  () =>
                    c(
                      "I asked {rel} {name} to stop bragging about @{h}.",
                      "Toned down",
                      "{name} looked a little hurt.",
                      { r: -3 },
                    ),
                ],
              ],
              worry: [
                [
                  "Reassure {name}",
                  () =>
                    c("I reassured {rel} {name} that @{h} is safe.", "All good", "{name} feels better now.", {
                      r: 3,
                    }),
                ],
                [
                  "Lock the account down",
                  () => {
                    (s.twofa = !0),
                      c(
                        "I turned on two-factor login for @{h} after {rel} {name} worried about it.",
                        "Locked down",
                        "Your account is much harder to break into now.",
                        { r: 2 },
                      );
                  },
                ],
                [
                  "Brush it off",
                  () =>
                    c(
                      "I brushed off {rel} {name}'s worries about @{h}.",
                      "Brushed off",
                      "{name} still looks worried.",
                      { r: -2 },
                    ),
                ],
              ],
              sell: [
                [
                  "Think about selling",
                  () => {
                    say(l("{Rel} {name} talked me into hearing offers for @{h}.")), offerCard(e);
                  },
                ],
                [
                  "Say you're keeping it",
                  () =>
                    c(
                      "I told {rel} {name} I'm keeping @{h}.",
                      "Keeping it",
                      "{name} sighed but understood.",
                      { r: -2 },
                    ),
                ],
                [
                  "Explain what it's worth",
                  () =>
                    c(
                      "I explained to {rel} {name} why @{h} is worth keeping.",
                      "Long game",
                      "{name} came around to your side.",
                      { r: 2 },
                    ),
                ],
              ],
              gift: [
                [
                  "Help {name} out",
                  () => {
                    (s.subs += rint(5, 60)),
                      c("I helped {rel} {name} out with @{h}.", "Family first", "{name} was thrilled.", {
                        r: 5,
                        h: 2,
                      });
                  },
                ],
                [
                  "Say no",
                  () => c("I told {rel} {name} no about @{h}.", "No", "{name} was disappointed.", { r: -4 }),
                ],
              ],
              press: [
                [
                  "Do the interview",
                  () => {
                    const e = rint(200, 4e3);
                    (s.subs += e),
                      c(
                        `I did an interview about @{h} and gained ${fmtN(e)} followers.`,
                        "In the news",
                        `The story ran and you gained ${fmtN(e)} followers.`,
                        { h: 4 },
                      );
                  },
                ],
                [
                  "Decline",
                  () => c("I declined an interview about @{h}.", "No comment", "You kept a low profile."),
                ],
              ],
            }[a] || [];
        jCard({
          tag: "Family",
          iconSrc: `${socIcon(socBase(e))}`,
          title: o,
          lead: `${l(n)}<br><br>What will you do?`,
          surprise: !0,
          choices: d.map(([e, t]) => [l(e), t]),
        });
      }
      const BRAND_YEAR = {
          xbox: 2001,
          tesla: 2003,
          uber: 2009,
          lyft: 2012,
          airbnb: 2008,
          openai: 2015,
          chatgpt: 2022,
          zoom: 2011,
          slack: 2013,
          discord: 2015,
          fortnite: 2017,
          roblox: 2006,
          minecraft: 2009,
          venmo: 2009,
          coinbase: 2012,
          robinhood: 2013,
          peloton: 2012,
          tiktok: 2016,
          snapchat: 2011,
          instagram: 2010,
          twitch: 2011,
          spotify: 2008,
          netflix: 2007,
          youtube: 2005,
          doordash: 2013,
          ubereats: 2014,
          instacart: 2012,
          shopify: 2006,
          tinder: 2012,
          bumble: 2014,
          hinge: 2012,
          cashapp: 2013,
          binance: 2017,
          epicgames: 2012,
          gopro: 2004,
          fitbit: 2008,
          beats: 2008,
          playstation: 1994,
          nintendo: 1985,
        },
        BAD_WORDS = /fuck|shit|bitch|asshole|cunt|whore|slut|pussy|dick|cock|porn|nazi|hitler|bastard/,
        BAD_EXTRA = /fuk|fck|phuck|fvck|btch|biatch|azzhole|asshat|nigg|faggot|retard/;
      function isBadName(e) {
        const t = String(e || "").toLowerCase(),
          a = t
            .replace(/[0]/g, "o")
            .replace(/[1!|]/g, "i")
            .replace(/3/g, "e")
            .replace(/[4@]/g, "a")
            .replace(/[5$]/g, "s")
            .replace(/7/g, "t")
            .replace(/8/g, "b")
            .replace(/9/g, "g")
            .replace(/[^a-z]/g, ""),
          o = a.replace(/(.)\1+/g, "$1");
        return [t.replace(/[\s._\-]/g, ""), a, o].some((e) => BAD_WORDS.test(e) || BAD_EXTRA.test(e));
      }
      const EDGY_LONG =
          /death|dead|killer|killa|killz|murder|suicid|satan|demon|devil|bloodlust|bloody|corpse|reaper|slayer|massacre|psycho|sniper|cocaine|stoner|zombie|skull|poison|tortur|homicid|lethal|carnage|slaughter|hatred|graveyard|knife|bullet|toxic|weed|drugs|druggie|kys/,
        EDGY_SHORT =
          /(^|[^a-z])(die|dying|rip|hell|doom|kill|evil|cult|thug|gore|blood|gun|guns|hate|hater|rage|sin|war|crip)([^a-z]|$)/,
        isEdgyName = (e) => {
          const t = String(e || "").toLowerCase(),
            a = t.replace(/^[x_.\d]+|[x_.\d]+$/g, "");
          return EDGY_LONG.test(t.replace(/[^a-z]/g, "")) || EDGY_SHORT.test(t) || EDGY_SHORT.test(a);
        },
        EVADE_FAM = {
          instagram: ["instagram", "facebook"],
          facebook: ["facebook", "instagram"],
          twitter: ["twitter"],
          roblox: ["roblox"],
        };
      function noteBans() {
        const e = (state.banHist ||= {});
        for (const t in state.social) {
          const a = state.social[t];
          if (!a || !a.banned || !a.email || a.stranger) continue;
          a.banId ||= Math.random().toString(36).slice(2, 10);
          const o = (e[a.email] ||= []);
          o.some((e) => e.id === a.banId) || o.push({ id: a.banId, b: socBase(t), y: socYear() });
        }
        return e;
      }
      function policyBanYear() {
        const e = socYear(),
          t = noteBans();
        for (const a in state.social) {
          const o = state.social[a];
          if (o.banned || !socOf(a) || dcTagged(a) || socEnded(a) || notSocial(a)) continue;
          const n = handleOf(a).toLowerCase(),
            s = BIG_BRANDS.has(n) || BRANDS.has(n) || ("x" === n && "twitter" === socBase(a)),
            r = "x" === n ? 2023 : (BRAND_YEAR[n] ?? 1990);
          (o.posts || 0) === o.idleMark
            ? (o.idle = (o.idle || 0) + 1)
            : ((o.idle = 0), (o.idleMark = o.posts || 0));
          const i = nameValue(n, a),
            l = ["roblox", "twitch", "twitter", "instagram"].includes(socBase(a)),
            c =
              o.idle >= 3 && i >= 500
                ? Math.min(0.45, 0.07 * (o.idle - 2)) * (i >= 2e4 ? 1.8 : i >= 3e3 ? 1.4 : 1) * (l ? 1 : 0.25)
                : 0,
            d = e - (o.joined?.y || e - (o.years || 0)),
            u =
              d >= 2 && isEdgyName(n)
                ? Math.min(0.3, ("roblox" === socBase(a) ? 0.1 : 0.05) + 0.02 * (d - 2))
                : 0,
            h = EVADE_FAM[socBase(a)],
            p =
              h && o.email
                ? (t[o.email] || []).filter((e) => (!o.banId || e.id !== o.banId) && h.includes(e.b)).length
                : 0,
            m = p ? Math.min(0.35, 0.1 + 0.06 * (p - 1)) : 0;
          let f = null;
          if (
            (c && chance(c)
              ? (f = "inactive")
              : m && chance(m)
                ? (f = "evasion")
                : u && chance(u)
                  ? (f = "edgy")
                  : s && e >= r && e >= (SOC_LAUNCH[socBase(a)] || 0) + 1 && chance(e - r <= 1 ? 0.3 : 0.05)
                    ? (f = "trademark")
                    : BAD_WORDS.test(n) && chance(0.18)
                      ? (f = "offensive")
                      : "roblox" === socBase(a) &&
                          e >= 2007 &&
                          /[ .]/.test(n) &&
                          chance(n.includes(" ") ? 0.08 : 0.06)
                        ? (f = "oldname")
                        : o.about &&
                          BAD_WORDS.test(o.about.toLowerCase()) &&
                          chance("roblox" === socBase(a) && e < 2009 ? 0.25 : 0.04) &&
                          (f = "about"),
            !f)
          )
            continue;
          const [, g] = socOf(a),
            y = showHandle(a),
            b = n[0].toUpperCase() + n.slice(1);
          (o.banned = !0),
            (o.banAge = state.age),
            (o.banWhy = f),
            (o.appealAt = state.age + ("oldname" === f ? rint(1, 2) : rint(2, 4))),
            (o.lostHandle = y),
            "trademark" === f &&
              ((o.handle = junkHandle()),
              ((state.socialNPC ||= {})[`${socBase(a)}:${n}`] = {
                name: b,
                g: "m",
                celeb: !0,
                subs: rint(1e5, 5e7),
                posts: rint(100, 5e3),
                since: e,
                greed: 9,
                mood: 0,
                blocked: !1,
              }));
          const v =
            "inactive" === f
              ? `Your account @${y} has been suspended for inactivity. Rare usernames on inactive accounts may be released to other users.`
              : "edgy" === f
                ? `Your account @${y} has been suspended. Usernames that reference violence, death or self-harm are no longer allowed under our updated community guidelines.`
                : "evasion" === f
                  ? `Your account @${y} has been deactivated for ban evasion. It is linked to ${o.email}, which was used by a previously suspended account.`
                  : "trademark" === f
                    ? `Your account @${y} has been suspended for violating our trademark policy. The username @${y} has been reassigned to ${b}'s official account.`
                    : "about" === f
                      ? `Your account @${y} has been suspended for inappropriate content in your About Me.`
                      : "oldname" === f
                        ? `Your account @${y} has been suspended because usernames with spaces or periods are no longer allowed.`
                        : `Your account @${y} has been suspended because its username violates our community guidelines.`;
          o.email &&
            mailTo(
              o.email,
              g,
              "Your account has been suspended",
              `${v} You may submit an appeal after a review period.`,
            ),
            say(
              "inactive" === f
                ? `${g} suspended my rare username @${y} because I hadn't used it in ${o.idle} years.`
                : "edgy" === f
                  ? `${g} suspended my account @${y} for having an edgy username.`
                  : "evasion" === f
                    ? `${g} deactivated my account @${y} for ban evasion because my email had a banned account before.`
                    : "about" === f
                      ? `${g} suspended my account @${y} for what my About Me said.`
                      : "oldname" === f
                        ? `Roblox suspended my account @${y} because old usernames with spaces or periods aren't allowed anymore.`
                        : "trademark" === f
                          ? `${g} suspended my account @${y} and gave the name to ${b}.`
                          : `${g} suspended my account @${y} for an offensive username.`,
            ),
            queueRoll(() =>
              notice(
                "Account suspended",
                `${v}${o.email ? `<br><br>They emailed ${o.email} with the details.` : ""}<br><br>You can appeal at age ${o.appealAt}.`,
                null,
                !0,
              ),
            );
        }
      }
      function policyAppealCard(e, t) {
        const a = state.social[e],
          [, o] = socOf(e);
        socSelCard({
          icon: socIcon(socBase(e)),
          title: "Appeal",
          lead:
            "trademark" === a.banWhy
              ? `${o} suspended you and gave @${a.lostHandle} to a company. Appeal the suspension?`
              : "about" === a.banWhy
                ? `${o} suspended @${a.lostHandle} over what your About Me said. Appeal?`
                : "oldname" === a.banWhy
                  ? `${o} suspended @${a.lostHandle} because old names with spaces or periods aren't allowed anymore. Appeal to keep it?`
                  : "inactive" === a.banWhy
                    ? `${o} suspended @${a.lostHandle} for being inactive. Appeal before they release the name?`
                    : "edgy" === a.banWhy
                      ? `${o} suspended @${a.lostHandle} because edgy usernames aren't allowed anymore. Appeal?`
                      : "evasion" === a.banWhy
                        ? `${o} deactivated @${a.lostHandle} for ban evasion because your email was tied to a banned account. Appeal?`
                        : `${o} suspended you over your username @${a.lostHandle}. Appeal?`,
          label: "Pick your appeal:",
          opts: ["Explain I had it first", "Promise to change the name", "Write a long, angry email"],
          btn: "Submit appeal",
          onGo: (t) => {
            if (state.age < a.appealAt)
              return notice(
                "Under review",
                `${o} is still reviewing your case. You can appeal again at age ${a.appealAt}.`,
                null,
                !0,
              );
            const n =
                "inactive" === a.banWhy
                  ? [0.5, 0.35, 0.05][t]
                  : "edgy" === a.banWhy
                    ? [0.15, 0.6, 0.02][t]
                    : "evasion" === a.banWhy
                      ? [0.2, 0.1, 0.02][t]
                      : "about" === a.banWhy
                        ? [0.25, 0.55, 0.03][t]
                        : "oldname" === a.banWhy
                          ? [0.45, 0.4, 0.03][t]
                          : [
                              "trademark" === a.banWhy ? 0.12 : 0.06,
                              "offensive" === a.banWhy ? 0.35 : 0.15,
                              0.02,
                            ][t],
              s = waitNote(a);
            if (chance(Math.min(0.95, n + waitBoost(a, 2 === t)))) {
              "about" === a.banWhy && (a.about = ""),
                ("offensive" !== a.banWhy && (("oldname" !== a.banWhy && "edgy" !== a.banWhy) || 1 !== t)) ||
                  (a.handle = junkHandle());
              const n = "trademark" === a.banWhy && 0 === t && chance(0.15);
              return (
                n &&
                  ((a.handle = a.lostHandle),
                  delete (state.socialNPC || {})[`${socBase(e)}:${a.lostHandle}`]),
                restoreAcct(e),
                (a.idle = 0),
                (a.idleMark = a.posts || 0),
                a.email &&
                  mailTo(
                    a.email,
                    o,
                    "Your appeal was approved",
                    `Your account is active again${n ? ` and @${a.handle} is yours again` : ""}.`,
                  ),
                say(`${o} restored my account after my appeal${s}.`),
                void notice(
                  "Appeal approved",
                  `${o} restored your account${n ? ` and gave you back @${a.handle}!` : `. It's now @${showHandle(e)}.`}`,
                  () => showAcct(e),
                  !0,
                )
              );
            }
            (a.appealAt = state.age + rint(2, 5)),
              a.email &&
                mailTo(
                  a.email,
                  o,
                  "Your appeal was denied",
                  "After review, the suspension will remain in place.",
                ),
              say(`${o} denied my appeal.`),
              notice(
                "Appeal denied",
                `${o} denied your appeal. You can try again at age ${a.appealAt}.`,
                null,
                !0,
              );
          },
        });
      }
      const loseHandle = (e) => {
        const t = state.social[e],
          a = t.handle;
        t.handle = junkHandle();
        const o = Math.min(t.subs, Math.round(0.5 * (t.nameFans || 0)));
        return (t.subs -= o), (t.nameFans = 0), a;
      };
      function offerCard(e, t) {
        const [, a] = socOf(e),
          o = state.social[e],
          n = o.handle,
          s = nameValue(n, e);
        if (s < 150) return;
        if (t && !celebOf(n)) return;
        const r = BIG_BRANDS.has(n) || BRANDS.has(n),
          i = Math.max(
            100,
            100 * Math.round(localPrice(s * (t ? 0.8 + 1.7 * Math.random() : 0.35 + Math.random())) / 100),
          ),
          l = t
            ? `${t.name}'s management team`
            : r
              ? `A lawyer for ${n[0].toUpperCase() + n.slice(1)}`
              : pickR(["Someone", "A stranger", "An anonymous buyer", "A username collector"]);
        (o.offers ||= []).push({ y: socYear(), amt: i, h: n }),
          (o.offers = o.offers.slice(-5)),
          jCard({
            tag: "Social",
            iconSrc: `${socIcon(socBase(e))}`,
            title: "Username Offer",
            surprise: !0,
            lead: `${l} contacted you from your phone number asking to buy your ${a} username @${n}.${t ? ` You claimed it before ${t.name} got famous, and they want it.` : ""}<br><br>They made an offer of ${usd(i)}.`,
            choices: [
              [
                `Sell it (${usd(i)})`,
                () => {
                  saleTransfer(e, t ? t.name : r ? n[0].toUpperCase() + n.slice(1) : null),
                    (state.money += i);
                  const s = loseHandle(e);
                  renderStats(),
                    say(`I sold my ${a} username @${s} for ${usd(i)}.`),
                    notice(
                      "Sold",
                      `You sold @${s} for ${usd(i)}. Your account is now @${o.handle}.`,
                      null,
                      !0,
                    );
                },
              ],
              [
                "Ask for more",
                () => {
                  const s = 100 * Math.round((i * (1.3 + 0.5 * Math.random())) / 100);
                  if (chance(0.45)) {
                    saleTransfer(e, t ? t.name : r ? n[0].toUpperCase() + n.slice(1) : null),
                      (state.money += s);
                    const i = loseHandle(e);
                    return (
                      renderStats(),
                      say(`I haggled and sold my ${a} username @${i} for ${usd(s)}.`),
                      notice(
                        "Deal",
                        `They agreed to ${usd(s)} for @${i}. Your account is now @${o.handle}.`,
                        null,
                        !0,
                      )
                    );
                  }
                  say(`I asked for more money for my ${a} username @${n}, and the buyer walked away.`),
                    notice("Walked away", "The buyer wouldn't go higher and stopped replying.", null, !0);
                },
              ],
              [
                "Not for sale",
                () => {
                  say(`Someone offered me ${usd(i)} for my ${a} username @${n}. I said no.`),
                    notice("Not for sale", `You told them @${n} isn't for sale.`, null, !0);
                },
              ],
            ],
          });
      }
      const BIG_PLATS = new Set([
          "instagram",
          "twitter",
          "tiktok",
          "youtube",
          "facebook",
          "snapchat",
          "threads",
          "twitch",
          "soundcloud",
        ]),
        bigPlat = (e) => {
          const t = socBase(e),
            a = socYear();
          return BIG_PLATS.has(t) || ("myspace" === t && a <= 2010) || ("vine" === t && a <= 2016);
        },
        ARTIST_PAY = { 1: [3e5, 1e6, 5e4], 2: [1e5, 4e5, 1e4], 3: [2e4, 12e4, 5e3], 4: [2e3, 25e3, 500] },
        LABELS = [
          "Interscope Records",
          "Def Jam Recordings",
          "Atlantic Records",
          "Columbia Records",
          "Republic Records",
          "Capitol Records",
          "RCA Records",
          "Island Records",
          "Epic Records",
          "Warner Records",
          "Universal Music Group",
          "Sony Music",
        ];
      function artistYear() {
        const e = window.ARTISTS,
          t = socYear();
        if (e && !state.prison)
          for (const a in state.social) {
            const o = state.social[a];
            if (o.banned || o.stranger || !socOf(a) || notSocial(a) || socEnded(a) || !bigPlat(a)) continue;
            const n = handleOf(a).toLowerCase(),
              s = e[n];
            if (!s || t < s.year || t > s.year + 3) continue;
            const r = ((o.artistAsk ||= {})[n] ||= { n: 0, y: 0 });
            if (!(r.n >= 2 || r.y === t) && chance([0.55, 0.4, 0.3, 0.25][t - s.year]))
              return (
                r.n++,
                (r.y = t),
                (o.celebAsked ||= state.age),
                queueRoll(() => artistOfferCard(a, n, s, r.n > 1))
              );
          }
      }
      function nameHandles() {
        const e = String(state.first || "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, ""),
          t = String("string" == typeof SURNAME ? SURNAME : "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, ""),
          a = [
            e && t && `${e}${t}`,
            state.music && state.music.band && state.music.band.name
              ? String(state.music.band.name)
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, "")
              : "",
          ].filter(Boolean);
        return new Set(
          a.flatMap((e) => [e, `real${e}`, `the${e}`, `${e}official`, `official${e}`, `its${e}`, `iam${e}`]),
        );
      }
      const isMyName = (e, t) => {
          const a = handleOf(e).toLowerCase().replace(/[._]/g, "");
          return t.has(a) || t.has(a.replace(/\d+$/, ""));
        },
        ONLINE = [
          [1998, 0.02],
          [2003, 0.05],
          [2005, 0.09],
          [2007, 0.16],
          [2009, 0.26],
          [2011, 0.38],
          [2013, 0.52],
          [2015, 0.66],
          [2017, 0.8],
          [2019, 0.9],
          [2021, 1],
        ],
        onlineShare = (e) => {
          if (e <= ONLINE[0][0]) return ONLINE[0][1];
          for (let t = 1; t < ONLINE.length; t++) {
            const [a, o] = ONLINE[t],
              [n, s] = ONLINE[t - 1];
            if (e <= a) return s + ((o - s) * (e - n)) / (a - n);
          }
          return 1;
        },
        fameReach = (e) => onlineShare(socYear()) * Math.min(1, (socAge(e) + 1) / 6);
      function fameSocialYear() {
        const e = state.art,
          t = (e && e.fameOn && e.fame) || 0;
        if (t < 5 || state.prison) return;
        const a = nameHandles(),
          o = Object.keys(state.social).filter((e) => {
            const t = state.social[e];
            return !t.banned && !t.stranger && socOf(e) && !notSocial(e) && !socEnded(e);
          });
        for (const e of o) {
          const o = state.social[e],
            n = isMyName(e, a);
          if (!((n && o.nameNoticed) || !0 === o.fansFound)) continue;
          const s = Math.round(t * t * rint(5, 30) * (bigPlat(e) ? 1 : 0.15) * (n ? 1 : 0.6) * fameReach(e));
          (o.subs += s), (o.fameFans = (o.fameFans || 0) + s);
        }
        const n = o.filter(
          (e) =>
            isMyName(e, a) &&
            !state.social[e].nameNoticed &&
            state.age -
              (state.social[e].joinAge ??
                state.social[e].nameSeenAge ??
                (state.social[e].nameSeenAge = state.age)) >=
              1,
        );
        if (n.length && chance(Math.min(0.6, 0.1 + t / 160) * Math.max(0.3, onlineShare(socYear())))) {
          const e = pickR(n.filter((e) => bigPlat(e)).length ? n.filter((e) => bigPlat(e)) : n),
            a = state.social[e];
          a.nameNoticed = !0;
          const o = Math.round(t * t * rint(3, 12) * (bigPlat(e) ? 1 : 0.15) * fameReach(e));
          return (
            (a.subs += o),
            (a.fameFans = (a.fameFans || 0) + o),
            void say(
              `Fans found my ${socOf(e)[1]} account @${showHandle(e)} because it uses my name. I gained ${fmtN(o)} ${socOf(e)[2]}.`,
            )
          );
        }
        if (t < 40 || !chance(Math.min(0.35, (t - 30) / 160) * Math.max(0.3, onlineShare(socYear())))) return;
        const s = o.filter((e) => !state.social[e].fansFound && !isMyName(e, a) && (bigPlat(e) || t >= 80));
        if (!s.length) return;
        const r = pickR(s.filter((e) => bigPlat(e)).length && chance(0.75) ? s.filter((e) => bigPlat(e)) : s);
        queueRoll(() => fansFoundCard(r, t));
      }
      function fansFoundCard(e, t) {
        const a = state.social[e];
        if (!a || a.fansFound) return;
        const [, o, n] = socOf(e),
          s = Math.round(t * t * rint(20, 60) * (bigPlat(e) ? 1 : 0.2) * fameReach(e));
        (a.fansFound = !0),
          (a.subs += s),
          (a.fameFans = (a.fameFans || 0) + s),
          say(`My fans found my ${o} account @${showHandle(e)}. I gained ${fmtN(s)} ${n} overnight.`),
          jCard({
            tag: "Fame",
            iconSrc: socIcon(socBase(e)),
            title: "Account Found",
            surprise: !1,
            lead: `Your fans found your ${o} account @${showHandle(e)}!<br><br>Screenshots of it are everywhere, and you gained ${fmtN(s)} ${n} overnight.`,
            choices: [
              [
                "Embrace it",
                () => {
                  (state.stats.Happiness = clamp(state.stats.Happiness + rint(2, 6))),
                    renderStats(),
                    notice(
                      "Embraced",
                      `You posted a hello to your new fans on @${showHandle(e)}. They loved it.`,
                      null,
                      !0,
                    );
                },
              ],
              [
                "Make it private",
                () => {
                  const t = Math.round(s * (0.3 + 0.3 * Math.random()));
                  (a.subs = Math.max(0, a.subs - t)),
                    (a.fansFound = "private"),
                    say(`I made my ${o} account private after fans found it.`),
                    notice(
                      "Private",
                      `You locked @${showHandle(e)} down. ${fmtN(t)} ${n} lost interest.`,
                      null,
                      !0,
                    );
                },
              ],
            ],
          });
      }
      function artistOfferCard(e, t, a, o) {
        const n = state.social[e];
        if (!n || handleOf(e).toLowerCase() !== t) return;
        const [, s] = socOf(e),
          [r, i, l] = ARTIST_PAY[a.tier] || ARTIST_PAY[4],
          c = Math.round(localPrice((r + Math.random() * (i - r)) * (o ? 1.4 : 1)) / l) * l,
          d = a.tier <= 3 ? chance(0.65) : chance(0.3),
          u = d ? (a.label ||= pickR(LABELS)) : null,
          h = d ? `${u}, ${a.name}'s record label,` : `${a.name} personally`,
          p = (o) => {
            saleTransfer(e, u || a.name), (state.money += o);
            const r = loseHandle(e);
            renderStats(),
              ((state.socialNPC ||= {})[`${socBase(e)}:${t}`] = {
                name: a.name,
                g: "m",
                celeb: !0,
                subs: rint(1e5, 5e7),
                posts: rint(100, 5e3),
                since: socYear(),
                greed: 9,
                mood: 0,
                blocked: !1,
              }),
              n.email &&
                mailTo(
                  n.email,
                  u || a.name,
                  `Payment for @${r}`,
                  `Thanks for the transfer of @${r}. ${usd(o)} has been sent to you.`,
                  null,
                  !0,
                ),
              say(`I sold my ${s} username @${r} to ${a.name}${u ? `'s label, ${u},` : ""} for ${usd(o)}.`),
              notice(
                "Sold",
                `You sold @${r} to ${a.name} for ${usd(o)}. Your account is now @${n.handle}.`,
                null,
                !0,
              );
          };
        jCard({
          tag: "Social",
          iconSrc: socIcon(socBase(e)),
          title: o ? "A Better Offer" : "Artist Offer",
          surprise: !0,
          lead: `${h} reached out about your ${s} username @${t}.${o ? " They came back after you turned them down." : ` ${a.name} just blew up, and they want their name.`}<br><br>They're offering ${usd(c)}.`,
          choices: [
            [`Sell it (${usd(c)})`, () => p(c)],
            [
              "Ask for more",
              () => {
                const e = Math.round((c * (1.25 + 0.5 * Math.random())) / l) * l;
                if (chance(a.tier <= 2 ? 0.5 : 0.4)) return p(e);
                say(`I asked ${a.name}'s team for more money for @${t}, and they walked away.`),
                  notice("Walked away", `${a.name}'s team wouldn't go higher.`, null, !0);
              },
            ],
            [
              "Not for sale",
              () => {
                say(
                  `${a.name}${u ? "'s label" : ""} offered me ${usd(c)} for my ${s} username @${t}. I said no.`,
                ),
                  notice("Not for sale", `You told ${a.name}'s team @${t} isn't for sale.`, null, !0);
              },
            ],
          ],
        });
      }
      const BUYER_WORD = {
        person: "A random person",
        collector: "A username collector",
        reseller: "A username reseller",
      };
      function buyerMailCard(e, t, a) {
        const o = t.buy,
          n = state.social[o.k];
        if (
          !n ||
          (n.banned && !window.mailThread) ||
          handleOf(o.k).toLowerCase() !== String(o.h).toLowerCase()
        )
          return (
            (o.done = !0),
            notice(t.subj, `You don't have @${o.h} anymore, so there's nothing to sell.`, a, !0)
          );
        const [, s] = socOf(o.k),
          r = () => a && a(),
          i = (t) => {
            (o.done = !0),
              notice(
                "Deal",
                `${o.who} agreed to buy @${o.h} for ${usd(t)}. You transferred the username to them.`,
                () => buyerPays(e, o, t, a),
                !0,
              );
          };
        if (window.mailThread)
          return jCard({
            tag: "Email",
            iconSrc: socIcon(socBase(o.k)),
            title: "Username Offer",
            close: r,
            lead: `<b>From:</b> ${t.from}<br>${BUYER_WORD[o.kind] || "Someone"} wants to buy your ${s} username @${o.h}.<br><br>They're offering ${usd(o.amt)}. You'll have to work out a deal with them over email.${n.banned ? `<br><br>Your @${o.h} account is banned. They don't seem to know that yet.` : ""}`,
            choices: [
              ["Reply to negotiate", () => setTimeout(() => mailThread(e, t, a), 60)],
              [
                "Not for sale",
                () => {
                  (o.done = !0),
                    say(
                      `${o.who} emailed me offering ${usd(o.amt)} for my ${s} username @${o.h}. I said no.`,
                    ),
                    notice("Not for sale", `You told ${o.who} that @${o.h} isn't for sale.`, a, !0);
                },
              ],
            ],
          });
        jCard({
          tag: "Email",
          iconSrc: socIcon(socBase(o.k)),
          title: "Username Offer",
          close: r,
          lead: `<b>From:</b> ${t.from}<br>${BUYER_WORD[o.kind] || "Someone"} wants to buy your ${s} username @${o.h}.<br><br>They're offering ${usd(o.amt)}.`,
          choices: [
            [`Sell it (${usd(o.amt)})`, () => i(o.amt)],
            [
              "Ask for more",
              () => {
                const e = 50 * Math.round((o.amt * (1.3 + 0.4 * Math.random())) / 50);
                if (chance("collector" === o.kind ? 0.5 : "reseller" === o.kind ? 0.25 : 0.4)) return i(e);
                (o.done = !0),
                  say(
                    `I asked ${o.who} for more money for my ${s} username @${o.h}, and they stopped replying.`,
                  ),
                  notice("No reply", `${o.who} wouldn't go higher and stopped replying.`, a, !0);
              },
            ],
            [
              "Not for sale",
              () => {
                (o.done = !0),
                  say(`${o.who} emailed me offering ${usd(o.amt)} for my ${s} username @${o.h}. I said no.`),
                  notice("Not for sale", `You told ${o.who} that @${o.h} isn't for sale.`, a, !0);
              },
            ],
          ],
        });
      }
      function buyerPays(e, t, a, o) {
        const n = state.social[t.k],
          [, s] = socOf(t.k),
          r = loseHandle(t.k);
        if (
          (((state.socialNPC ||= {})[`${socBase(t.k)}:${String(r).toLowerCase()}`] = {
            name: t.who,
            g: "m",
            celeb: !1,
            subs: rint(0, 500),
            posts: 0,
            since: socYear(),
            greed: 3,
            mood: 0,
            blocked: !1,
          }),
          chance({ person: 0.15, collector: 0.08, reseller: 0.22 }[t.kind] ?? 0.15))
        )
          return (
            say(
              `I sold my ${s} username @${r} to ${t.who} for ${usd(a)}, but they never paid. I got scammed.`,
            ),
            notice(
              "Scammed",
              `You gave @${r} to ${t.who}, but the payment never came. They blocked you everywhere.<br><br>Your account is now @${n.handle}.`,
              o,
              !0,
            )
          );
        const i = socYear() >= MARKET_OPENS && window.INVEST ? marketCoins().filter((e) => e.live)[0] : null,
          l = i ? window.INVEST.receiveCoin(i.id, a) : 0;
        l
          ? mailTo(
              e.addr,
              `${i.name} Wallet`,
              `🪙 You received ${coinAmt(i, a)}`,
              `${t.who} sent you ${coinAmt(i, a)} (${usd(a)}) for @${r}. It's in your crypto (Assets → Investments).`,
              null,
              !0,
            )
          : (saleTransfer(t.k, t.who), (state.money += a), renderStats()),
          mailTo(
            e.addr,
            t.who,
            `Re: Interested in @${r}`,
            "Got the name, thanks! " +
              (l ? `Sent you ${coinAmt(i, a)}.` : `I sent ${usd(a)} to your bank account.`),
            null,
            !0,
          ),
          crimeSnd("ChaChing"),
          say(`I sold my ${s} username @${r} to ${t.who} for ${usd(a)}${l ? ` in ${i.tick}` : ""}.`),
          notice(
            "Paid",
            `${t.who} paid you ${l ? `${coinAmt(i, a)} (${usd(a)}). It's in your crypto now.` : `${usd(a)} by bank transfer.`} Check your email.<br><br>Your account is now @${n.handle}.`,
            o,
            !0,
          );
      }
      function hackCard(e) {
        const [, t] = socOf(e),
          a = state.social[e],
          o = a.handle;
        if (chance(a.twofa ? 0.08 : 0.4)) {
          const o = loseHandle(e);
          jCard({
            tag: "Social",
            iconSrc: `${socIcon(socBase(e))}`,
            title: "Hacked",
            surprise: !0,
            lead: `Someone hacked into your ${t} account and swapped your username. They took @${o} for themselves and left you with @${a.handle}.<br><br>What will you do?`,
            choices: [
              [
                `Report it to ${t}`,
                () => {
                  if (chance(0.3))
                    return (
                      (a.handle = o),
                      say(`${t} gave me back my username @${o} after I was hacked.`),
                      notice("Recovered", `${t} support restored @${o} to your account.`, null, !0)
                    );
                  say(`My ${t} account was hacked and @${o} was stolen. Support couldn't help.`),
                    notice(
                      "No luck",
                      `${t} support said they couldn't do anything. @${o} is gone.`,
                      null,
                      !0,
                    );
                },
              ],
              [
                "Let it go",
                () => {
                  say(`My ${t} account was hacked and someone stole my username @${o}.`),
                    notice("Gone", `@${o} is gone.`, null, !0);
                },
              ],
            ],
          });
        } else
          jCard({
            tag: "Social",
            iconSrc: `${socIcon(socBase(e))}`,
            title: "Login Alert",
            surprise: !0,
            lead: `Someone tried to log into your ${t} account (@${o}) from a device you don't recognize. They didn't get in.<br><br>What will you do?`,
            choices: [
              [
                a.twofa ? "Change your password" : "Turn on two-factor login",
                () => {
                  (a.twofa = !0),
                    say(`Someone tried to hack my ${t} account, so I locked it down.`),
                    notice("Locked down", `Your ${t} account is much harder to break into now.`, null, !0);
                },
              ],
              [
                "Ignore it",
                () => {
                  say(`Someone tried to hack my ${t} account.`),
                    notice("Ignored", "You ignored the alert.", null, !0);
                },
              ],
            ],
          });
      }
      function swatCard(e) {
        const [, t] = socOf(e),
          a = state.social[e],
          o = a.handle;
        crimeSnd("Cops"),
          jCard({
            tag: "Police",
            iconSrc: "emoji/1f6a8.png",
            title: "Swatted",
            surprise: !0,
            lead: `A SWAT team kicked in your door with guns drawn after someone made a fake 911 call about your home. Once the police left, you got a message: "Give us @${o} on ${t} or we do it again."<br><br>What will you do?`,
            choices: [
              [
                `Give up @${o}`,
                () => {
                  const o = loseHandle(e);
                  (state.stats.Happiness = clamp(state.stats.Happiness - rint(5, 12))),
                    renderStats(),
                    say(`I was swatted by hackers who wanted my ${t} username. I gave them @${o}.`),
                    notice(
                      "Gave it up",
                      `You handed over @${o}. Your account is now @${a.handle}.`,
                      null,
                      !0,
                    );
                },
              ],
              [
                "Refuse",
                () => {
                  const e = chance(0.2) ? rint(10, 30) : rint(0, 6);
                  (state.stats.Health = clamp(state.stats.Health - e)),
                    (state.stats.Happiness = clamp(state.stats.Happiness - rint(10, 20))),
                    (a.swats = (a.swats || 0) + 1),
                    renderStats(),
                    say(
                      `I was swatted by hackers who wanted my ${t} username @${o}, but I refused to give it up.`,
                    ),
                    notice(
                      "Refused",
                      `You kept @${o}.${e >= 10 ? " You got hurt in the raid." : ""} The hackers might try again.`,
                      null,
                      !0,
                    );
                },
              ],
            ],
          });
      }
      const earlyJoinBy = (e, t, a) => {
        const o = SOC_LAUNCH[e] || 2004,
          n = a >= 1e5 ? 0 : a >= 1e4 || t.length <= 3 ? 1 : a >= 1e3 ? 3 : null;
        return null == n ? null : Math.min(socYear(), o + n);
      };
      function npcOwner(e, t) {
        const a = (state.socialNPC ||= {}),
          o = `${e}:${t}`,
          n = (state.npcFreeY ||= {});
        if ((null === a[o] && n[o] !== socYear() && delete a[o], void 0 !== a[o])) {
          const n = a[o],
            s = !n || n.celeb || n.earlyFix || "roblox" === e ? null : earlyJoinBy(e, t, nameValue(t, e));
          if ((n && !n.celeb && (n.earlyFix = !0), null != s && n.since > s)) {
            const t = n.since;
            (n.since = rint(SOC_LAUNCH[e] || 2004, s)),
              (n.posts = Math.round(
                ((n.posts || 0) * (socYear() - n.since + 1)) / Math.max(1, socYear() - t + 1),
              ));
          }
          return n;
        }
        const s = celebOf(t),
          r = nameValue(t, e);
        if (!s && !chance(nameTaken(t, e))) return (n[o] = socYear()), (a[o] = null);
        const i = chance(0.5) ? "m" : "f",
          l = Math.max(0, Math.min(socYear() - (SOC_LAUNCH[e] || 2004), rint(0, 12))),
          c = s
            ? rint(2e6, 9e7)
            : Math.round(
                (r >= 1e3 ? rint(500, 2e4) : rint(0, 900)) * (1 + 3 * Math.random()) +
                  (r / 10) * Math.random(),
              );
        let d = socYear() - l;
        if ("roblox" === e && !s && (t.length <= 3 || r >= 1e3))
          d = rint(2006, Math.min(t.length <= 3 ? 2010 : 2009, socYear()));
        else if (!s) {
          const a = earlyJoinBy(e, t, r);
          null != a && (d = rint(SOC_LAUNCH[e] || 2004, a));
        }
        return (a[o] = {
          name: s ? s.name : `${uname(i)} ${ulast(state.country)}`,
          g: i,
          celeb: !!s,
          subs: c,
          posts: rint(0, 40) * (socYear() - d + 1),
          since: d,
          greed: 0.8 + 2.2 * Math.random(),
          mood: 0,
          blocked: !1,
          earlyFix: !0,
        });
      }
      function rbxInactive(e, t) {
        return (
          !("roblox" !== e || t.celeb || t.since > 2010) &&
          (void 0 === t.inactive &&
            socYear() - t.since >= 4 &&
            ((t.inactive = chance(0.6)),
            t.inactive && (t.lastOn = rint(t.since, Math.min(socYear() - 3, t.since + 3)))),
          !!t.inactive && !t.revealed)
        );
      }
      function friendRequest(e, t) {
        const a = socBase(e),
          [, o] = socOf(e),
          n = npcOwner(a, t);
        return n.reqYear === socYear()
          ? notice("Pending", `Your friend request to @${t} is still pending. Nobody has replied.`, null, !0)
          : ((n.reqYear = socYear()),
            chance(Math.max(0.04, 0.2 - 0.01 * (socYear() - n.lastOn)))
              ? ((n.revealed = !0),
                say(`${n.name} accepted my friend request on ${o}. They own @${t}.`),
                void jCard({
                  tag: "Social",
                  iconSrc: `${socIcon(a)}`,
                  title: "Request accepted",
                  surprise: !0,
                  lead: `${n.name} logged back into ${o} for the first time since ${n.lastOn} and accepted your friend request. They own @${t}.<br><br>What will you do?`,
                  choices: [
                    ["Offer to buy the account", () => setTimeout(() => buyOfferCard(e, t), 50)],
                    [
                      "Just say hi",
                      () => notice("Friends", `You and ${n.name} are friends on ${o} now.`, null, !0),
                    ],
                  ],
                }))
              : (say(`I sent a friend request to @${t} on ${o} hoping to buy the name, but nobody replied.`),
                notice(
                  "No reply",
                  `You sent @${t} a friend request. The account hasn't been online since ${n.lastOn}, and nobody replied.`,
                  null,
                  !0,
                )));
      }
      function searchCard(e) {
        const t = socBase(e),
          [, a] = socOf(e);
        (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div><div class="jm-tag" style="margin-top:12px">Social</div>\n      <h4><img src="${socIcon(t)}" alt=""><span>Search ${a}</span></h4><div class="lead">Look up any ${a} username.</div>\n      <label class="hr-lab">Username:</label><div class="hr-sel txt"><input id="socFind" maxlength="15" autocomplete="off" spellcheck="false"\n        style="width:100%;height:40px;border:none;background:transparent;font:inherit;font-size:17px;padding:0 10px" placeholder="username"></div>\n      <button class="jm-apply ev-btn" id="socGo">Search</button>`),
          (ev.style.overflow = "visible");
        const o = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = o),
          (document.getElementById("socGo").onclick = () => {
            const n = cleanHandle(document.getElementById("socFind").value);
            if ((o(), !n)) return;
            if (dcTagged(e))
              return setTimeout(
                () =>
                  notice(
                    "Name#1234",
                    `Discord names aren't unique yet. Lots of people are ${n}#something. Unique usernames arrive in 2023.`,
                    null,
                    !0,
                  ),
                50,
              );
            if (
              Object.keys(state.social).find(
                (e) => socBase(e) === t && (state.social[e].handle || "").toLowerCase() === n,
              )
            )
              return setTimeout(
                () => notice("That's you", `@${n} is one of your own ${a} accounts.`, null, !0),
                50,
              );
            const s = npcOwner(t, n);
            if (!s || s.sold)
              return setTimeout(
                () =>
                  notice(
                    "Available",
                    `Nobody on ${a} has @${n}. Change one of your usernames to claim it.`,
                    null,
                    !0,
                  ),
                50,
              );
            setTimeout(() => ownerCard(e, n), 50);
          }),
          evWrap.classList.add("open"),
          setTimeout(() => document.getElementById("socFind")?.focus(), 60);
      }
      function ownerCard(e, t) {
        const a = socBase(e),
          [, o, n] = socOf(e),
          s = npcOwner(a, t),
          r = nameValue(t, a),
          i = n[0].toUpperCase() + n.slice(1),
          l =
            r >= 1e3
              ? `${valueWord(r)[0].toUpperCase() + valueWord(r).slice(1)} (~${usd(localPrice(r))})`
              : "Common";
        return rbxInactive(a, s)
          ? jCard({
              tag: "Social",
              iconSrc: `${socIcon(a)}`,
              title: `@${t}`,
              close: !0,
              lead: `@${t} has been on ${o} since ${s.since}. Its owner hasn't been online since ${s.lastOn}.`,
              rows: [
                ["Owner", "Hidden"],
                ["Joined", s.since],
                ["Last online", s.lastOn],
                [i, fmtN(s.subs)],
                ["Username", l],
              ],
              choices: [
                ["Send a friend request", () => setTimeout(() => friendRequest(e, t), 50)],
                [
                  `Follow @${t}`,
                  () => {
                    say(`I followed @${t} on ${o}.`), notice("Following", `You followed @${t}.`, null, !0);
                  },
                ],
              ],
            })
          : s.found || s.revealed || s.celeb
            ? void jCard({
                tag: "Social",
                iconSrc: `${socIcon(a)}`,
                title: `@${t}`,
                close: !0,
                lead: `${s.name} has had @${t} on ${o} since ${s.since}.${s.email ? `<br><br>Their email: ${s.email}` : ""}`,
                rows: [
                  ["Owner", s.name],
                  [n[0].toUpperCase() + n.slice(1), fmtN(s.subs)],
                  ["Posts", fmtN(s.posts)],
                  ["Username", l],
                ],
                choices: [
                  [
                    s.email ? "Email them an offer" : "Offer to buy the account",
                    () => setTimeout(() => buyOfferCard(e, t), 50),
                  ],
                  [
                    `Follow @${t}`,
                    () => {
                      say(`I followed @${t} on ${o}.`),
                        notice("Following", `You followed ${s.name} (@${t}).`, null, !0);
                    },
                  ],
                ],
              })
            : jCard({
                tag: "Social",
                iconSrc: `${socIcon(a)}`,
                title: `@${t}`,
                close: !0,
                lead: `@${t} has been on ${o} since ${s.since}. You don't know who owns it.`,
                rows: [
                  ["Owner", "Unknown"],
                  [i, fmtN(s.subs)],
                  ["Posts", fmtN(s.posts)],
                  ["Username", l],
                ],
                choices: [
                  ["Try to find information", () => setTimeout(() => digOwner(e, t), 50)],
                  [
                    `Follow @${t}`,
                    () => {
                      say(`I followed @${t} on ${o}.`), notice("Following", `You followed @${t}.`, null, !0);
                    },
                  ],
                ],
              });
      }
      function digOwner(e, t) {
        const a = socBase(e),
          [, o] = socOf(e),
          n = npcOwner(a, t);
        if (!n) return;
        if (n.digY === socYear())
          return notice(
            "Nothing new",
            `You already dug into @${t} this year. Try again next year.`,
            null,
            !0,
          );
        n.digY = socYear();
        const s = Math.min(
          0.7,
          0.3 +
            Math.min(0.2, 0.02 * (socYear() - n.since)) +
            (n.subs > 1e3 ? 0.1 : 0) +
            (n.posts > 100 ? 0.1 : 0),
        );
        if (!chance(s))
          return (
            say(`I tried to find out who owns @${t} on ${o}, but came up empty.`),
            notice(
              "Dead end",
              `You searched old posts and linked sites but couldn't find anything about whoever owns @${t}. Try again next year.`,
              null,
              !0,
            )
          );
        (n.found = !0), (n.email = personAddr(n.name, "rand"));
        const r = pickR([
          "an old forum signature",
          "a linked YouTube channel",
          "a reused username on another site",
          "a leaked database from an old breach",
          "a tagged photo",
        ]);
        say(`I found out ${n.name} owns @${t} on ${o}, and got their email.`),
          notice(
            "Found them",
            `Through ${r}, you found out @${t} belongs to ${n.name}.<br><br>Their email: ${n.email}`,
            () => ownerCard(e, t),
            !0,
          );
      }
      const askOf = (e, t, a) =>
        Math.max(
          localPrice(150),
          50 * Math.round(localPrice((nameValue(t, a) + 0.4 * e.subs) * e.greed) / 50),
        );
      function buyOfferCard(e, t) {
        const a = socBase(e),
          [, o] = socOf(e),
          n = npcOwner(a, t);
        if (n.celeb)
          return notice("Not for sale", `@${t} belongs to ${n.name}. Their team won't even reply.`, null, !0);
        if (n.blocked)
          return notice("Blocked", `${n.name} blocked you after you kept asking about @${t}.`, null, !0);
        const s = Math.max(localPrice(100), localPrice(nameValue(t, a) + 0.4 * n.subs)),
          r = [0.25, 0.5, 0.75, 1, 1.5, 2, 3];
        socSelCard({
          icon: `${socIcon(a)}`,
          title: "Buy Account",
          lead: `Make ${n.name} an offer for their ${o} account @${t}.`,
          label: "Pick your offer:",
          opts: r.map((e) => usd(50 * Math.round((s * e) / 50))),
          btn: "Send offer",
          onGo: (a) => {
            const o = 50 * Math.round((s * r[a]) / 50);
            if (state.money < o) return notice("Not enough", `You don't have ${usd(o)}.`, null, !0);
            haggle(e, t, o);
          },
        });
      }
      function haggle(e, t, a) {
        const o = socBase(e),
          [, n] = socOf(e),
          s = npcOwner(o, t),
          r = askOf(s, t, o),
          i = a / r;
        s.mood++;
        const l = (state.emails || []).find((e) => !e.hacked),
          c = (e, t) => {
            l && s.email && mailTo(l.addr, s.name, e, t, s.email, !0);
          };
        if (s.email) {
          if (chance(0.3 + Math.min(0.25, 0.1 * (s.mood - 1))))
            return (
              say(`I emailed ${s.name} an offer of ${usd(a)} for @${t} on ${n}. They never replied.`),
              notice("No reply", `${s.name} never answered your email about @${t}.`, null, !0)
            );
          if (i < 1 && i >= 0.25 && chance(0.12))
            return (
              c(`Re: @${t}`, `Honestly I could use the money right now. ${usd(a)} works, deal.`),
              buyAccount(e, t, a)
            );
          if (chance(0.25)) {
            const a = 50 * Math.round((r * (1.6 + 1.6 * Math.random())) / 50);
            return (
              c(
                `Re: @${t}`,
                `@${t} is worth way more than that. I'd let it go for ${usd(a)}, not a cent less.`,
              ),
              jCard({
                tag: "Social",
                iconSrc: `${socIcon(o)}`,
                title: "Reply",
                surprise: !0,
                lead: `${s.name} emailed back: "@${t} is worth way more than that. I'd let it go for ${usd(a)}, not a cent less."<br><br>That's far more than it's worth this year. What will you do?`,
                choices: [
                  [
                    `Pay ${usd(a)}`,
                    () => {
                      if (state.money < a) return notice("Not enough", `You don't have ${usd(a)}.`, null, !0);
                      buyAccount(e, t, a);
                    },
                  ],
                  [
                    "Ignore them",
                    () => {
                      say(`${s.name} wanted ${usd(a)} for @${t} on ${n}. I ignored them.`);
                    },
                  ],
                ],
              })
            );
          }
        }
        if (i < 0.6 && (s.mood >= 3 || chance(0.35)))
          return (
            (s.blocked = s.mood >= 3),
            say(`I offered ${s.name} ${usd(a)} for @${t} on ${n}. They told me to stop contacting them.`),
            notice(
              "Stop messaging me",
              `${s.name} isn't selling @${t} and told you to stop contacting them.${s.blocked ? " They blocked you." : ""}`,
              null,
              !0,
            )
          );
        if (i >= 1 || chance(Math.max(0, 1.2 * (i - 0.7)))) return buyAccount(e, t, a);
        if (i >= 0.35 && chance(0.65)) {
          const i = 50 * Math.round((r * (1 + 0.6 * Math.random())) / 50);
          return jCard({
            tag: "Social",
            iconSrc: `${socIcon(o)}`,
            title: "Counteroffer",
            surprise: !0,
            lead: `${s.name} won't take ${usd(a)} for @${t}, but says they'd let it go for ${usd(i)}.<br><br>What will you do?`,
            choices: [
              [
                `Pay ${usd(i)}`,
                () => {
                  if (state.money < i) return notice("Not enough", `You don't have ${usd(i)}.`, null, !0);
                  buyAccount(e, t, i);
                },
              ],
              [
                "Walk away",
                () => {
                  say(`${s.name} wanted ${usd(i)} for @${t} on ${n}. I walked away.`),
                    notice("Walked away", "You passed on their counteroffer.", null, !0);
                },
              ],
            ],
          });
        }
        say(`I offered ${s.name} ${usd(a)} for @${t} on ${n}, but they said no.`),
          notice("No deal", `${s.name} doesn't want to sell @${t}.`, null, !0);
      }
      function buyAccount(e, t, a) {
        const o = socBase(e),
          [, n, s] = socOf(e),
          r = npcOwner(o, t);
        (state.money -= a), renderStats();
        let i = 2,
          l = o;
        if (state.social[o]) {
          for (; state.social[`${o}~${i}`]; ) i++;
          l = `${o}~${i}`;
        }
        (state.social[l] = {
          subs: r.subs,
          fake: 0,
          posts: r.posts,
          views: r.subs * rint(5, 30),
          years: socYear() - r.since,
          momentum: 1,
          postsYear: 0,
          viewsYear: 0,
          monet: !1,
          verified: !1,
          banned: !1,
          appealAt: 0,
          buysYear: 0,
          botYears: [],
          handle: t,
          bought: state.age,
          pw: uniquePw(),
          pwY: socYear(),
        }),
          (r.sold = !0),
          socialStarCheck(),
          say(`I bought the ${n} account @${t} from ${r.name} for ${usd(a)}.`),
          openSocialAccount(l),
          screen.classList.add("open"),
          notice(
            "Sold!",
            `${r.name} sold you @${t} for ${usd(a)}. It's in your accounts now, with its ${fmtN(r.subs)} ${s}.`,
            null,
            !0,
          );
      }
      const MARKET_COINS = ["CRNG", "CTETA"],
        MARKET_OPENS = 2013,
        marketInflation = (e) =>
          e < MARKET_OPENS
            ? 0
            : e <= 2020
              ? 0.15 + (0.85 / (2020 - MARKET_OPENS)) * (e - MARKET_OPENS)
              : Math.min(3, 1 + 0.25 * (e - 2020)),
        MARKET_DEMAND = { discord: 2.6, instagram: 1.7, tiktok: 1.2, twitter: 1.1, snapchat: 1, telegram: 1 },
        MARKET_WEIGHT = { discord: 4, instagram: 4, tiktok: 2, twitter: 2 };
      function marketQuality(e) {
        const t = Math.random();
        return t < 0.2
          ? 0.9 + 0.1 * Math.random()
          : t < 0.55
            ? 0.45 + 0.35 * Math.random()
            : 0.4 * Math.random();
      }
      const qualityWord = (e) =>
        e >= 0.85 ? "Great year" : e >= 0.6 ? "Good year" : e >= 0.35 ? "Average year" : "Slow year";
      function marketListings() {
        const e = socYear(),
          t = state.nameMarket;
        if (t && t.year === e && t.plats && 2 === t.v) return t.plats;
        const a = {},
          o = {},
          n = [...WORD_RANK.keys()].filter((e) => e.length >= 3 && e.length <= 9),
          s = [...BRANDS],
          r = (e, t = "abcdefghijklmnopqrstuvwxyz") =>
            Array.from({ length: e }, () => t[rint(0, t.length - 1)]).join("");
        for (const t of SOCIALS.map((e) => e[0]).filter(
          (e) => socLive(e) && !SOCIAL_OFF.has(e) && !NON_SOCIAL.has(e),
        )) {
          const i = (o[t] = marketQuality(t)),
            l = [],
            c = new Set(),
            d = rint(50, 60),
            u = Math.round(250 + 12e3 * (1 - i));
          for (let a = 0; l.length < d && a < 900; a++) {
            const a = Math.random(),
              o =
                a < 0.04 + 0.12 * i
                  ? r(rint(2, 3))
                  : a < 0.08 + 0.16 * i
                    ? r(3, "0123456789")
                    : a < 0.1 + 0.2 * i
                      ? pickR(s)
                      : n[rint(0, Math.min(n.length - 1, u))];
            if (c.has(o) || o.length < (SOC_MINLEN[t] || 1) || CELEBS.has(o)) continue;
            if (
              Object.keys(state.social).some(
                (e) => socBase(e) === t && (state.social[e].handle || "").toLowerCase() === o,
              )
            )
              continue;
            const d = nameValue(o, t);
            if (d < 40) continue;
            const h = Math.min(
              22e4,
              Math.max(25, d * (1.2 + 0.8 * Math.random()) * (MARKET_DEMAND[t] || 0.8) * marketInflation(e)),
            );
            c.add(o), l.push({ base: t, h: o, price: Math.max(5, 5 * Math.round(localPrice(h) / 5)) });
          }
          if (((a[t] = l.sort((e, t) => t.price - e.price)), BIG_PLATS.has(t))) {
            const o = [];
            for (let e = rint(2, 4); e > 0; e--) {
              const e = n[rint(0, Math.min(n.length - 1, 4e3))] + (chance(0.4) ? rint(1, 99) : "");
              c.has(e) ||
                (c.add(e),
                o.push({
                  base: t,
                  h: e,
                  verified: !0,
                  subs: rint(5e3, 25e4),
                  price: Math.max(5, 5 * Math.round(localPrice(rint(1e3, 2500)) / 5)),
                }));
            }
            const s = window.ARTISTS || {},
              r = [
                ...[...CELEBS]
                  .filter(([, t]) => e >= t.year)
                  .map(([e, t]) => ({ h: e, name: t.name, big: t.big })),
                ...Object.entries(s)
                  .filter(([, t]) => t.year <= e && t.tier <= 2)
                  .map(([e, t]) => ({ h: e, name: t.name, big: 1 === t.tier })),
              ],
              i = new Set(Object.values(state.social).map((e) => (e.handle || "").toLowerCase()));
            for (const e of [...r]
              .sort(() => Math.random() - 0.5)
              .filter((e) => !c.has(e.h) && !i.has(e.h))
              .slice(0, rint(1, 3)))
              c.add(e.h),
                o.push({
                  base: t,
                  h: e.h,
                  verified: !0,
                  celeb: { name: e.name, big: e.big },
                  subs: e.big ? 1e6 * rint(50, 300) : 1e6 * rint(4, 60),
                  price: Math.max(
                    5,
                    5 * Math.round(localPrice(e.big ? 1e3 * rint(200, 300) : 1e3 * rint(100, 200)) / 5),
                  ),
                });
            a[t] = [...o.sort((e, t) => t.price - e.price), ...a[t]];
          }
        }
        return (state.nameMarket = { v: 2, year: e, plats: a, quality: o }), a;
      }
      const coinAmt = (e, t) => {
          const a = t / e.price;
          return `${a >= 100 ? fmtN(a) : +a.toPrecision(3)} ${e.tick}`;
        },
        marketCoins = () => (window.INVEST ? MARKET_COINS.map((e) => window.INVEST.coinInfo(e)) : []);
