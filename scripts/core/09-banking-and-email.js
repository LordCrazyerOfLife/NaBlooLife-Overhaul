      function bankEmailCard() {
        const e = state.emails || [],
          t = bankEmail(),
          a = bankFor();
        if (!e.length)
          return notice(
            "No email",
            "You need an email address first. Make one in Assets → Email.",
            openBank,
            !0,
          );
        socSelCard({
          icon: "emoji/1f4e7.png",
          title: "Account Email",
          tag: "Bank",
          lead: `Which email should ${a} use for alerts, receipts and password resets?${t ? `<br><br>Right now it's ${t.addr}.` : ""}`,
          label: "Email:",
          opts: e.map((e) => `${e.addr}${e.hacked ? " (locked out)" : ""}`),
          btn: "Save",
          onGo: (o) => {
            const n = e[o];
            if (t && n.addr === t.addr) return openBank();
            t &&
              mailTo(
                t.addr,
                a,
                "Your email address was changed",
                `The email on your account ending in ${state.bankAcct || "0000"} was changed to ${n.addr}. If you didn't do this, call us right away.`,
                bankAddr(),
                !0,
              ),
              (state.bankEmail = n.addr),
              bankMailTo(
                a,
                "Email address updated",
                `This is now the email for your ${a} account ending in ${state.bankAcct || "0000"}.`,
                bankAddr(),
                !0,
              ),
              say(`I changed the email on my ${a} account to ${n.addr}.`),
              notice(
                "Email updated",
                `${a} will now email ${n.addr}.${n.hacked ? "<br><br>Careful: you're locked out of that address." : ""}`,
                openBank,
                !0,
              );
          },
        });
      }
      function openBank() {
        if (isOldEra()) return openBank1800();
        if (state.bankLock) return openBankLocked();
        if (!bankOpen()) return openBankApply();
        const e = socYear(),
          t = bankFor(),
          a = BANKS.filter((t) => t[1] <= e && (!t[2] || e <= t[2]));
        (sTitle.textContent = "BANK"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openAssets);
        const o = state.bankTx || [],
          n = new Set(
            o
              .filter((t) => t.y === e)
              .slice(-2)
              .map((e) => e.acct || "chk"),
          ),
          s = { chk: "#6b7280", sav: "#4a8fa8", mm: "#8e7cc3", hys: "#2ea043" },
          r = (e, t) =>
            `<div class="bkc" data-acct="${e}" style="border-left-color:${s[t]}"><b>${acctLabel(e)}</b><span>Available Balance</span><em>${usd(acctBal(e))}</em>${n.has(e) ? "<i>Transactions Pending</i>" : ""}</div>`;
        var i, l, c;
        (sList.innerHTML =
          `<style>#screen .bkg{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px 12px}\n        #screen .bkc{background:#fff;color:#1d2433;border-left:6px solid;border-radius:4px;padding:9px 10px;cursor:pointer;min-width:0;box-shadow:0 1px 2px rgba(0,0,0,.25)}\n        #screen .bkc b{display:block;font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n        #screen .bkc span{display:block;font-size:10.5px;color:#555;margin-top:6px}#screen .bkc em{display:block;font-style:normal;font-weight:700;font-size:15px;text-align:right;margin-top:-2px}\n        #screen .bkc i{display:block;font-style:normal;font-size:10.5px;color:#c62828;margin-top:2px}\n        .phone.dark #screen .bkc{background:#1f2b40;color:#e8eef6;box-shadow:0 0 0 1px #2c3b55}.phone.dark #screen .bkc span{color:#93a4bb}.phone.dark #screen .bkc i{color:#ff7a6b}</style><div class="row">${bankLogo(bankFile(t))}<div class="t"><b>${t}</b><span>${"custodial" === state.bankOpen ? "Custodial account · opened by your parents" : `${1 + accts().length} account${accts().length ? "s" : ""} · tap an account for its activity`}</span></div></div>` +
          ("custodial" === state.bankOpen
            ? state.age < 13
              ? '<div class="row dis"><img src="emoji/1f46a.png"><div class="t"><b>Managed by your parents</b><span>You can withdraw, deposit and open your own account at 13</span></div></div>'
              : `<div class="row sm" id="bkOwn"><img src="emoji/1f4dd.png"><div class="t"><b>Open Your Own Account</b><span>Apply at any bank to take over your money</span></div>${CHEV}</div>`
            : "") +
          `<div class="bkg">${r("chk", "chk")}${accts()
            .map((e) => r(e.num, e.type))
            .join("")}</div>` +
          activityRow(o, "bkAct") +
          `<div class="row sm" id="bkXfer"><img src="emoji/1f501.png"><div class="t"><b>Transfer Money</b><span>Between your checking and savings</span></div>${DOTS}</div>` +
          `<div class="row sm" id="bkNew"><img src="emoji/1f4dd.png"><div class="t"><b>Open an Account</b><span>Savings, money market and more</span></div>${DOTS}</div>` +
          `<div class="row sm" id="bkOut"><img src="emoji/1f4b5.png"><div class="t"><b>Withdraw Cash</b><span>Cash on hand: ${usd(state.cash || 0)}</span></div>${DOTS}</div>` +
          `<div class="row sm" id="bkIn"><img src="emoji/1f3e6.png"><div class="t"><b>Deposit Cash</b><span>Put your cash back in checking</span></div>${DOTS}</div>` +
          `<div class="row sm" id="bkTax"><img src="emoji/1f9fe.png"><div class="t"><b>Taxes</b><span>${(c = state.taxHistory || []).length ? `${usd(c.reduce((e, t) => e + (t.tax || 0), 0))} paid in all · ${usd(c[c.length - 1].tax || 0)} last year` : "No taxes paid yet"}</span></div>${DOTS}</div>` +
          `<div class="row sm" id="bkPw"><img src="emoji/1f512.png"><div class="t"><b>Password</b><span>${((l = pwReuse(bankPwOf(), "bank")), l ? `Used on ${l} other account${l > 1 ? "s" : ""}` : "Change your online banking password")}</span></div>${DOTS}</div>` +
          `<div class="row sm" id="bkMail"><img src="emoji/1f4e7.png"><div class="t"><b>Account Email</b><span>${((i = bankEmail()), i ? `${i.addr}${i.hacked ? " · locked out" : ""}` : "No email on file")}</span></div>${DOTS}</div>` +
          (state.bankHack && !state.bankHack.done
            ? `<div class="row sm" id="bkDispute"><img src="emoji/26a0-fe0f.png"><div class="t"><b style="color:#e2401f">Dispute Stolen Money</b><span>${usd(state.bankHack.amt)} wired out by hackers</span></div>${DOTS}</div>`
            : "") +
          '<div class="sec">Banks</div>' +
          a
            .map(
              (e) =>
                `<div class="row${e[0] === t ? " dis" : ""}" data-bank="${e[0]}">${bankLogo(e[3])}<div class="t"><b>${e[0]}${e[0] === t ? " <em>(Your bank)</em>" : ""}</b><span>${e[0] === t ? "Your paychecks go here" : "Move your money here"}</span></div>${e[0] === t ? "" : DOTS}</div>`,
            )
            .join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-acct]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice");
                const t = e.dataset.acct;
                if ("chk" === t)
                  return activityCard(
                    o.filter((e) => "chk" === (e.acct || "chk")),
                    acctLabel("chk"),
                  );
                openAcct(t);
              }),
          ),
          (document.getElementById("bkAct").onclick = () => {
            play("choice"), activityCard(o, `${t} Activity`);
          }),
          (document.getElementById("bkXfer").onclick = () => {
            play("choice"), transferCard();
          }),
          (document.getElementById("bkPw").onclick = () => {
            play("choice"),
              pwCard(
                t,
                (e) => {
                  (state.bankPw = e),
                    (state.bankPwY = socYear()),
                    say(`I changed my ${t} password.`),
                    notice("Password changed", `Your ${t} online banking password is updated.`, openBank, !0);
                },
                bankPwOf(),
                "bank",
              );
          }),
          (document.getElementById("bkMail").onclick = () => {
            play("choice"), bankEmailCard();
          });
        const d = document.getElementById("bkDispute");
        d &&
          (d.onclick = () => {
            play("choice"), bankAppealCard();
          }),
          (document.getElementById("bkTax").onclick = () => {
            play("choice"), bankTaxCard();
          }),
          (document.getElementById("bkNew").onclick = () => {
            play("choice"), openAcctCard();
          });
        const u = document.getElementById("bkOwn");
        u &&
          (u.onclick = () => {
            play("choice"), openBankApply();
          }),
          (document.getElementById("bkOut").onclick = () => {
            play("choice"), cashMoveCard(!0, openBank);
          }),
          (document.getElementById("bkIn").onclick = () => {
            play("choice"), cashMoveCard(!1, openBank);
          }),
          sList.querySelectorAll("[data-bank]").forEach(
            (e) =>
              (e.onclick = () => {
                const a = e.dataset.bank;
                if (a !== t) {
                  if ((play("choice"), state.age < 13))
                    return notice("Too young", "Your parents handle your money until you're 13.", null, !0);
                  socSelCard({
                    icon: "emoji/1f3e6.png",
                    title: a,
                    tag: "Bank",
                    lead: `Close your ${t} accounts and move everything to ${a}? Your paychecks will go to ${a} from now on.`,
                    btn: `Switch to ${a}`,
                    onGo: () => {
                      const e = t;
                      (state.bank = a),
                        (state.bankAcct = String(rint(1e3, 9999))),
                        bankMailTo(
                          a,
                          `Welcome to ${a}`,
                          `Your new checking account ending in ${state.bankAcct} is open. We moved over your balance of ${usd(state.money)} from ${e}.`,
                          bankAddr(),
                          !0,
                        ),
                        say(`I moved my money from ${e} to ${a}.`),
                        notice("New bank", `Your money is now at ${a}.`, openBank, !0);
                    },
                  });
                }
              }),
          ),
          screen.classList.add("open");
      }
      const BANKS_1800 = () =>
          ("us" === state.country
            ? [
                ["Bank of North America", 1781, 0, "commercial", 1.5],
                ["Bank of New York", 1784, 0, "commercial", 1.5],
                ["Bank of the United States", 1791, 1811, "national", 2],
                ["Second Bank of the United States", 1816, 1836, "national", 2],
                ["Philadelphia Saving Fund Society", 1816, 0, "savings", 4.5],
                ["Bank for Savings in New York", 1819, 0, "savings", 5],
                ["Merchants Bank", 1803, 0, "commercial", 1.5],
                ["Wells, Fargo & Company", 1852, 0, "express", 1],
                ["Boston Five Cents Savings Bank", 1854, 0, "savings", 4],
                ["First National Bank", 1863, 0, "national", 2],
                ["Freedman's Savings Bank", 1865, 1874, "savings", 5],
                ["Chase National Bank", 1877, 0, "national", 2],
              ]
            : [
                ["Bank of England", 1694, 0, "central", 0],
                ["Coutts & Co", 1692, 0, "private", 1],
                ["Barings Bank", 1762, 0, "merchant", 1.5],
                ["Lloyds Bank", 1765, 0, "commercial", 1.5],
                ["Trustee Savings Bank", 1810, 0, "savings", 3],
                ["National Provincial Bank", 1833, 0, "commercial", 1.5],
                ["Midland Bank", 1836, 0, "commercial", 1.5],
                ["Overend, Gurney & Co", 1800, 1866, "discount", 3],
                ["Post Office Savings Bank", 1861, 0, "savings", 2.5],
              ]
          ).map(([e, t, a, o, n]) => ({ name: e, from: t, to: a, kind: o, rate: n })),
        BANK_KIND = {
          commercial: "Commercial bank",
          national: "National bank",
          savings: "Savings bank",
          express: "Express company and bank",
          central: "The nation's central bank",
          private: "Private bank for the wealthy",
          merchant: "Merchant bank",
          discount: "Discount house",
        },
        BANK_RISK = {
          commercial: 0.3,
          national: 0.2,
          savings: 0.15,
          express: 0.3,
          central: 0,
          private: 0.1,
          merchant: 0.25,
          discount: 0.35,
        },
        BANK_PANICS = () =>
          "us" === state.country
            ? {
                1819: "the Panic of 1819",
                1837: "the Panic of 1837",
                1857: "the Panic of 1857",
                1873: "the Panic of 1873",
                1884: "the Panic of 1884",
                1893: "the Panic of 1893",
              }
            : {
                1825: "the Panic of 1825",
                1847: "the Panic of 1847",
                1857: "the Panic of 1857",
                1866: "the collapse of Overend, Gurney",
                1878: "the City of Glasgow Bank failure",
                1890: "the Baring crisis",
              },
        yearOld = () => state.birthYear + state.age,
        banksOpen1800 = () => BANKS_1800().filter((e) => yearOld() >= e.from && (!e.to || yearOld() < e.to)),
        myBank1800 = () => {
          const e = BANKS_1800(),
            t = e.find((e) => e.name === state.bank);
          if (!t || yearOld() < t.from || (t.to && yearOld() >= t.to)) {
            const e = banksOpen1800().filter((e) => "savings" === e.kind || "commercial" === e.kind);
            state.bank = pickR(e.length ? e : banksOpen1800()).name;
          }
          return e.find((e) => e.name === state.bank);
        },
        bankMin1800 = (e) =>
          "private" === e.kind || "central" === e.kind
            ? eraCash(1e3)
            : "merchant" === e.kind
              ? eraCash(500)
              : 0;
      function openBank1800() {
        const e = myBank1800(),
          t = yearOld(),
          a = state.bankLoan1800,
          o = state.age < 13;
        (sTitle.textContent = "BANK"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openAssets);
        const n = (state.bankTx || []).filter((e) => e.amt);
        (sList.innerHTML =
          `<div class="row"><img src="emoji/1f3e6.png" alt=""><div class="t"><b>${e.name}</b><span>${BANK_KIND[e.kind]} · founded ${e.from}</span></div></div><div class="row" id="bk8Book"><img src="emoji/1f4d4.png" alt=""><div class="t"><b>Passbook Savings · ${usd(state.money)}</b><span>${e.rate ? `Pays ${e.rate}% interest a year` : "Pays no interest on deposits"} · ${n.length} entr${1 === n.length ? "y" : "ies"} in the passbook</span></div>${CHEV}</div>` +
          (o
            ? '<div class="row dis"><img src="emoji/1f46a.png" alt=""><div class="t"><b>Kept by your parents</b><span>Your parents hold your passbook until you\'re 13</span></div></div>'
            : `<div class="sec">The Teller's Window · open Monday to Saturday, 10 to 3</div><div class="row sm" id="bk8In"><img src="emoji/1fa99.png" alt=""><div class="t"><b>Deposit Cash</b><span>Hand coins and notes to the teller to be written in your passbook</span></div>${DOTS}</div><div class="row sm" id="bk8Out"><img src="emoji/1f4b5.png" alt=""><div class="t"><b>Withdraw Cash</b><span>Draw money from your passbook in person</span></div>${DOTS}</div><div class="row sm dis"><img src="emoji/1f3e0.png" alt=""><div class="t"><b>Cash Kept at Home · ${usd(state.cash || 0)}</b><span>Hidden under the floorboards. Thieves and fires can take it</span></div></div><div class="sec">The Banker's Office</div><div class="row sm" id="bk8Loan"><img src="emoji/1f4dc.png" alt=""><div class="t"><b>${a ? `Loan · ${usd(a.left)} owed` : "Ask the Banker for a Loan"}</b><span>${a ? `${usd(a.pay)} due each year · ${a.yrs} year${1 === a.yrs ? "" : "s"} left` : "Borrow against your wages or your property"}</span></div>${DOTS}</div>`) +
          `<div class="row sm dis"><img src="emoji/26a0-fe0f.png" alt=""><div class="t"><b>No one guarantees your deposits</b><span>If ${e.name} fails in a panic, your savings can be lost</span></div></div>` +
          `<div class="sec">Banks in ${t}</div>` +
          banksOpen1800()
            .map(
              (t) =>
                `<div class="row${t.name === e.name ? " dis" : ""}" data-b8="${t.name}"><img src="emoji/1f3e6.png" alt=""><div class="t"><b>${t.name}${t.name === e.name ? " <em>(Your bank)</em>" : ""}</b><span>${BANK_KIND[t.kind]} · ${t.rate ? `${t.rate}% interest` : "no interest"}${bankMin1800(t) ? ` · only takes clients with ${usd(bankMin1800(t))} or more` : ""}</span></div>${t.name === e.name ? "" : DOTS}</div>`,
            )
            .join("")),
          (sList.scrollTop = 0),
          (document.getElementById("bk8Book").onclick = () => {
            play("choice"), passbookCard(e, n);
          });
        const s = (e, t) => {
          const a = document.getElementById(e);
          a &&
            (a.onclick = () => {
              play("choice"), t();
            });
        };
        s("bk8In", () => cashMoveCard(!1, openBank1800)),
          s("bk8Out", () => cashMoveCard(!0, openBank1800)),
          s("bk8Loan", () => (state.bankLoan1800 ? loanCard1800() : askLoan1800())),
          sList.querySelectorAll("[data-b8]").forEach(
            (t) =>
              (t.onclick = () => {
                const a = BANKS_1800().find((e) => e.name === t.dataset.b8);
                if (a && a.name !== e.name)
                  return (
                    play("choice"),
                    o
                      ? notice(
                          "Too young",
                          "Your parents decide where your savings are kept until you're 13.",
                          null,
                          !0,
                        )
                      : state.money < bankMin1800(a)
                        ? notice(
                            "Turned away",
                            `${a.name} only takes clients with at least ${usd(bankMin1800(a))} to deposit.`,
                            null,
                            !0,
                          )
                        : void jCard({
                            tag: "Bank",
                            iconSrc: "emoji/1f3e6.png",
                            title: a.name,
                            close: !0,
                            lead: `Close your passbook at ${e.name}, carry your ${usd(state.money)} across town and open a new one at ${a.name}?`,
                            rows: [
                              ["Kind", BANK_KIND[a.kind]],
                              ["Founded", a.from],
                              ["Interest", a.rate ? `${a.rate}% a year` : "None"],
                            ],
                            choices: [
                              [
                                `Move to ${a.name}`,
                                () => {
                                  const t = e.name;
                                  (state.bank = a.name),
                                    say(`I closed my passbook at ${t} and moved my savings to ${a.name}.`),
                                    notice(
                                      "New passbook",
                                      `Your savings are now kept at ${a.name}.`,
                                      openBank1800,
                                      !0,
                                    );
                                },
                              ],
                            ],
                          })
                  );
              }),
          ),
          screen.classList.add("open");
      }
      function passbookCard(e, t) {
        const a = t
          .slice(-14)
          .reverse()
          .map((e) => [
            `${e.y} · ${e.amt > 0 ? "Deposit" : "Withdrawal"}`,
            `${e.amt > 0 ? "" : "−"}${usd(Math.abs(e.amt))}`,
          ]);
        jCard({
          tag: e.name,
          iconSrc: "emoji/1f4d4.png",
          title: "Your Passbook",
          close: !0,
          lead:
            "The clerk writes every deposit and withdrawal in your passbook by hand. " +
            (e.rate ? "Interest is added once a year." : ""),
          rows: [
            ["Balance", usd(state.money)],
            ...(state.bankInt1800 ? [["Interest last year", usd(state.bankInt1800)]] : []),
            ...(a.length ? a : [["Entries", "None yet"]]),
          ],
          ok: () => {},
        });
      }
      function askLoan1800() {
        if (state.age < 21)
          return notice("Too young", "The banker won't lend money to anyone under 21.", null, !0);
        const e = (state.props || []).filter((e) => e.old),
          t = state.job && state.job.pay > 0,
          a = myBank1800();
        if (!t && !e.length)
          return notice(
            "Loan refused",
            `The banker at ${a.name} looks you up and down. "No wages and no property? I'm afraid not."`,
            null,
            !0,
          );
        const o = Math.max(t ? 0.8 * state.job.pay : 0, 0.5 * e.reduce((e, t) => e + t.price, 0)),
          n = "us" === state.country ? 6 : 5,
          s = [0.25, 0.5, 1].map((e) => cents(o * e)).filter((e, t, a) => e >= 0.5 && a.indexOf(e) === t);
        if (!s.length)
          return notice(
            "Loan refused",
            "The banker says your security is too small to lend against.",
            null,
            !0,
          );
        jCard({
          tag: a.name,
          iconSrc: "emoji/1f4dc.png",
          title: "A Loan from the Banker",
          close: !0,
          lead: `The banker will lend against your ${e.length ? "property" : "wages"} at ${n}% a year, repaid over five years. ${e.length ? "Miss your payments and the bank takes your house." : "Miss your payments and the bank takes you to court."}`,
          rows: [
            ["Interest", `${n}% a year`],
            ["Term", "5 years"],
          ],
          choices: s.map((e) => [
            `Borrow ${usd(e)}`,
            () => {
              const t = cents(e * (1 + (n / 100) * 5)),
                o = cents(t / 5);
              (state.bankLoan1800 = { amt: e, left: t, pay: o, yrs: 5, missed: 0, bank: a.name }),
                (state.money = cents(state.money + e)),
                renderStats(),
                say(`I borrowed ${usd(e)} from ${a.name}.`),
                notice(
                  "Loan granted",
                  `${a.name} lent you ${usd(e)}. You'll repay ${usd(o)} a year for five years.`,
                  openBank1800,
                  !0,
                );
            },
          ]),
        });
      }
      function loanCard1800() {
        const e = state.bankLoan1800;
        jCard({
          tag: e.bank,
          iconSrc: "emoji/1f4dc.png",
          title: "Your Loan",
          close: !0,
          lead: `You borrowed ${usd(e.amt)} from ${e.bank}.`,
          rows: [
            ["Still Owed", usd(e.left)],
            ["Yearly Payment", usd(e.pay)],
            ["Years Left", e.yrs],
            ["Savings", usd(state.money)],
          ],
          choices: [
            [
              `Pay it all off (${usd(e.left)})`,
              () => {
                if (state.money < e.left)
                  return notice("Not enough money", `You need ${usd(e.left)} to clear the loan.`, null, !0);
                (state.money = cents(state.money - e.left)),
                  (state.bankLoan1800 = null),
                  renderStats(),
                  say(`I paid off my loan from ${e.bank}.`),
                  notice("Paid off", 'The banker stamps your loan paper "paid in full".', openBank1800, !0);
              },
            ],
          ],
        });
      }
      function openPayApps() {
        const e = socYear(),
          t = (state.payApps ||= {});
        (sTitle.textContent = "PAYMENT APPS"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openAssets);
        const a = (a) => {
            const o = t[a.id],
              n = e >= a.y;
            return `<div class="row${n ? "" : " dis"}" ${n ? `data-app="${a.id}"` : ""}>${bankLogo(a.logo, "1f4b3")}<div class="t"><b>${appName(a)}</b>${n ? `<span>${o ? `Linked to ${bankFor()} · since ${o.since}` : "Link it to your bank"}</span>` : ""}</div>${n ? (o ? CHEV : DOTS) : ""}</div>`;
          },
          o = PAY_APPS.filter((e) => t[e.id]),
          n = PAY_APPS.filter((e) => !t[e.id]);
        (sList.innerHTML =
          (o.length ? '<div class="sec">Your Apps</div>' + o.map(a).join("") : "") +
          '<div class="sec">Available</div>' +
          n.map(a).join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-app]").forEach(
            (a) =>
              (a.onclick = () => {
                play("choice");
                const o = PAY_APPS.find((e) => e.id === a.dataset.app);
                return t[o.id]
                  ? openPayApp(o)
                  : state.age < o.age
                    ? notice("Too young", `You need to be ${o.age} to use ${appName(o)}.`, null, !0)
                    : bankOpen()
                      ? void socSelCard({
                          icon: "emoji/1f4b3.png",
                          title: appName(o),
                          tag: "Payment Apps",
                          lead: `Sign up for ${appName(o)} and link it to your ${bankFor()} account?`,
                          btn: "Link my bank",
                          onGo: () => {
                            (t[o.id] = { since: e }),
                              (state.emails || [])[0] &&
                                mailTo(
                                  state.emails[0].addr,
                                  appName(o),
                                  `Welcome to ${appName(o)}`,
                                  `Your ${bankFor()} account is linked. You're ready to pay.`,
                                  null,
                                  !0,
                                ),
                              say(`I signed up for ${appName(o)}.`),
                              notice(
                                "Linked",
                                `${appName(o)} is linked to your ${bankFor()} account.`,
                                openPayApps,
                                !0,
                              );
                          },
                        })
                      : notice(
                          "No bank account",
                          `${appName(o)} needs a bank account to link to. Apply for one in Assets → Bank.`,
                          null,
                          !0,
                        );
              }),
          ),
          screen.classList.add("open");
      }
      function openPayApp(e) {
        (sTitle.textContent = appName(e).toUpperCase()),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openPayApps);
        const t = (state.bankTx || []).filter((t) => t.app === e.id);
        (sList.innerHTML =
          `<div class="row">${bankLogo(e.logo, "1f4b3")}<div class="t"><b>${appName(e)}</b><span>Linked to ${bankFor()} · since ${state.payApps[e.id].since}</span></div></div>` +
          activityRow(t, "appAct") +
          `<div class="sec">Account</div><div class="row sm" id="appUnlink"><img src="${socIcon("delete")}"><div class="t"><b>Delete</b><span>Unlink and delete your ${appName(e)} account</span></div>${DOTS}</div>`),
          (sList.scrollTop = 0),
          (document.getElementById("appAct").onclick = () => {
            play("choice"), activityCard(t, `${appName(e)} Activity`);
          }),
          (document.getElementById("appUnlink").onclick = () => {
            play("choice"),
              delete state.payApps[e.id],
              say(`I deleted my ${appName(e)} account.`),
              notice("Deleted", `You deleted your ${appName(e)} account.`, openPayApps, !0);
          }),
          screen.classList.add("open");
      }
      function addressMailYear() {
        const e = socYear();
        if (!(state.emails || []).length || !window.EMAIL_SIGNUPS) return;
        const t = () => `${uname(chance(0.5) ? "m" : "f")} ${ulast(state.country)}`;
        for (const a of state.emails) {
          const o = a.addr.split("@")[0].toLowerCase(),
            n = Math.max(0, e - (SOC_LAUNCH[a.prov] || 2e3)),
            s = null != wordRank(o);
          if (s || o.length <= 4 || BIG_BRANDS.has(o) || BRANDS.has(o)) {
            const r = s ? 1 - wordRank(o) / RANK_MAX : 1,
              i = Math.round(Math.min(25, (1 + n) * (1 + 3 * r)) * (0.5 + Math.random()));
            for (let o = 0; o < i; o++) {
              const o = t();
              if (chance(0.55)) {
                const t = window.EMAIL_SIGNUPS.filter((t) => t[0] <= e);
                if (!t.length) continue;
                const [, n, s, r] = pickR(t);
                mailTo(
                  a.addr,
                  n,
                  s.replace(/\{name\}/g, o.split(" ")[0]),
                  r.replace(/\{name\}/g, o),
                  serviceAddr(n),
                );
                const i = strangerAcct(a, n, o) || strangerHandle(platOf(n), ...o.split(" "));
                (a.linked ||= []).push({ svc: n, who: o, y: e, user: i }), (a.linked = a.linked.slice(-200));
              } else {
                const [e, t] = pickR(window.EMAIL_MISSENT),
                  n = uname(chance(0.5) ? "m" : "f");
                mailTo(
                  a.addr,
                  o,
                  e,
                  t.replace(/\{other\}/g, n).replace(/\{name\}/g, o.split(" ")[0]),
                  personAddr(o, "rand"),
                );
              }
            }
          }
          if (BAD_WORDS.test(o))
            for (let e = rint(3, 12); e > 0; e--) {
              const [e, o] = pickR(window.EMAIL_BADADDR),
                n = t();
              mailTo(a.addr, n, e, o, personAddr(n, "rand"));
            }
          const r = celebOf(o);
          if (r)
            for (let o = Math.min(40, rint(5, 15) + 2 * (e - r.year)); o > 0; o--) {
              const [e, o] = pickR(window.EMAIL_FAN),
                n = t();
              mailTo(
                a.addr,
                n,
                e.replace(/\{celeb\}/g, r.name),
                o.replace(/\{celeb\}/g, r.name),
                personAddr(n, "rand"),
              );
            }
        }
      }
      function strangerAcct(e, t, a) {
        const o = SOCIALS.find((e) => e[1].toLowerCase() === String(t).toLowerCase());
        if (!o) return;
        const n = o[0];
        if (!socLive(n)) return;
        const s = Object.keys(state.social).filter((e) => state.social[e].stranger);
        if (s.length >= 12 || s.filter((e) => socBase(e) === n).length >= 2) return;
        let r = 2;
        for (; state.social[`${n}~${r}`]; ) r++;
        const i = `${n}~${r}`,
          [l, c = ""] = a.split(" "),
          d = socYear();
        if (
          ((state.social[i] = {
            subs: notSocial(n) ? 0 : rint(0, 300),
            fake: 0,
            posts: rint(0, 60),
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
            stranger: a,
            email: e.addr,
            pw: chance(0.6) ? `${l.toLowerCase()}${rint(1, 9999)}` : uniquePw(),
            pwY: d,
            handle: strangerHandle(n, l, c),
          }),
          notSocial(n))
        ) {
          const e = subPlan(n);
          state.social[i].nf = { on: !0, since: d, plan: e.id, price: e.price };
        }
        return state.social[i].handle;
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || !isOldEra()) return;
        const e = yearOld(),
          t = myBank1800();
        if (t.rate && state.money > 0) {
          const e = cents((state.money * t.rate) / 100);
          (state.bankInt1800 = e),
            e >= 0.01 &&
              ((state.money = cents(state.money + e)),
              state.age >= 13 && say(`My savings at ${t.name} earned ${usd(e)} in interest.`));
        }
        if ((state.cash || 0) > eraCash(20) && chance(0.04)) {
          const e = cents(state.cash * (0.3 + 0.7 * Math.random()));
          (state.cash = cents(state.cash - e)),
            say(
              chance(0.5)
                ? `A thief broke in and stole ${usd(e)} I had hidden at home.`
                : `A fire at home burned ${usd(e)} of the cash I kept hidden there.`,
            );
        }
        const a = state.bankLoan1800;
        if (a)
          if (state.money >= a.pay)
            (state.money = cents(state.money - a.pay)),
              (a.left = cents(Math.max(0, a.left - a.pay))),
              a.yrs--,
              (a.missed = 0),
              (a.yrs <= 0 || a.left <= 0) &&
                ((state.bankLoan1800 = null), say(`I made the last payment on my loan from ${a.bank}.`));
          else if (++a.missed >= 2) {
            const e = (state.props || []).find((e) => e.old);
            if (((state.bankLoan1800 = null), (state.respect = clamp((state.respect ?? 40) - 6)), e))
              state.props.splice(state.props.indexOf(e), 1),
                say(`${a.bank} foreclosed on my ${e.name.toLowerCase()} because I couldn't repay my loan.`),
                queuePopup(() =>
                  notice(
                    "Foreclosed",
                    `${a.bank} took your ${e.name.toLowerCase()} at ${e.addr} to cover your unpaid loan.`,
                    null,
                    !0,
                  ),
                );
            else {
              const e = state.money;
              (state.money = 0),
                say(`${a.bank} took me to court over my unpaid loan and seized my savings.`),
                queuePopup(() =>
                  notice(
                    "Taken to court",
                    `The court ordered your savings of ${usd(e)} paid to ${a.bank}, and the debt was written off.`,
                    null,
                    !0,
                  ),
                );
            }
          } else say(`I couldn't make my loan payment to ${a.bank} this year.`);
        const o = BANKS_1800().find((t) => t.name === state.bank && t.to && e >= t.to);
        if (o && state.money > 0) {
          const e = "Freedman's Savings Bank" === o.name ? 0.4 : "Overend, Gurney & Co" === o.name ? 0.75 : 0,
            t = cents(state.money * e);
          state.money = cents(state.money - t);
          const a = o.name;
          state.bank = null;
          const n = myBank1800();
          say(
            e
              ? `${a} collapsed and I lost ${usd(t)} of my savings.`
              : `${a} closed its doors and my savings were moved to ${n.name}.`,
          ),
            queuePopup(() =>
              notice(
                e ? "Bank failed" : "Bank closed",
                e
                  ? `${a} has failed! You lost ${usd(t)} of your savings. What was left went to ${n.name}.`
                  : `${a} has closed. Your passbook savings were moved to ${n.name}.`,
                null,
                !0,
              ),
            );
        }
        const n = BANK_PANICS()[e],
          s = (state.panicSeen ||= {});
        if (n && !s[e] && state.money > eraCash(1) && state.age >= 13 && !(o && state.money <= 0)) {
          s[e] = !0;
          const t = myBank1800();
          queuePopup(() =>
            jCard({
              tag: "Bank Panic",
              iconSrc: "emoji/1f3e6.png",
              title: "Run on the Bank!",
              lead: `It's ${n}. Crowds are lining up outside ${t.name} to pull their money out, and rumors say the bank is about to fail. You have ${usd(state.money)} in your passbook.`,
              choices: [
                [
                  "Join the line and withdraw it all",
                  () => {
                    const e = chance(0.6),
                      a = e ? state.money : cents(state.money * (0.3 + 0.4 * Math.random())),
                      o = cents(state.money - a);
                    (state.money = 0),
                      (state.cash = cents((state.cash || 0) + a)),
                      renderStats(),
                      say(
                        e
                          ? `I stood in line during ${n} and got all ${usd(a)} of my savings out of ${t.name}.`
                          : `I only got ${usd(a)} out of ${t.name} before it shut its doors during ${n}. I lost ${usd(o)}.`,
                      ),
                      notice(
                        e ? "Got it out" : "Doors closed",
                        e
                          ? `You pushed to the front and the teller counted out all ${usd(a)}. It's hidden at home now.`
                          : `The bank ran out of coin and shut its doors with you still in line. You got ${usd(a)} and lost the rest.`,
                        null,
                        !0,
                      );
                  },
                ],
                [
                  "Trust the bank",
                  () => {
                    if (!chance(BANK_RISK[t.kind] || 0.2))
                      return (
                        say(`I trusted ${t.name} during ${n}, and it survived.`),
                        notice("It held", `${t.name} weathered the panic. Your savings are safe.`, null, !0)
                      );
                    const e = cents(state.money * (0.4 + 0.6 * Math.random()));
                    (state.money = cents(state.money - e)),
                      renderStats(),
                      (state.stats.Happiness = clamp(state.stats.Happiness - 10)),
                      say(`${t.name} failed during ${n} and I lost ${usd(e)} of my savings.`),
                      notice(
                        "The bank failed",
                        `${t.name} suspended payments and never fully reopened. You lost ${usd(e)}.`,
                        null,
                        !0,
                      );
                  },
                ],
              ],
            }),
          );
        }
      });
      const GAMEY_SVC = /fortnite|xbox|playstation|steam|minecraft|roblox|runescape|club penguin|epic games/i,
        platOf = (e) => {
          const t = SOCIALS.find((t) => t[1].toLowerCase() === String(e).toLowerCase());
          return t ? t[0] : GAMEY_SVC.test(e) ? "steam" : "other";
        };
      function strangerHandle(e, t, a) {
        const o = cleanHandle(t) || "user",
          n = cleanHandle(a),
          s = rint(1, 99),
          r = window.GAMERTAGS || [],
          i = new Set(
            Object.keys(state.social)
              .filter((t) => socBase(t) === e)
              .map((e) => String(state.social[e].handle || "").toLowerCase()),
          ),
          l = Math.max(0, socYear() - (SOC_LAUNCH[e] || socYear() - 5)),
          c = l <= 1 ? 0.45 : l <= 3 ? 0.25 : l <= 6 ? 0.08 : 0.02,
          d = [...WORD_RANK.keys()].slice(0, 4e3).filter((e) => e.length >= 3 && e.length <= 10);
        for (let t = 0; t < 8; t++) {
          const t =
            d.length && chance(c)
              ? pickR(d)
              : r.length && chance(GAMING.has(e) ? 0.65 : 0.3)
                ? pickR(r).slice(0, 15)
                : pickR([
                    `${o}${n}${s}`,
                    `${o}_${n}`,
                    `${o}.${n}`,
                    `${o}${rint(1, 9999)}`,
                    `xX${o}Xx`,
                    `${o}${n.slice(0, 1)}${rint(80, 99)}`,
                    `its${o}`,
                    `${o[0]}${n}${s}`,
                  ]).slice(0, 15);
          if (!i.has(t.toLowerCase())) return t;
        }
        return `${o.slice(0, 10)}${rint(1e3, 9999)}`;
      }
      function scamYear() {
        const e = window.EMAIL_SCAM,
          t = (state.emails || [])[0];
        if (!e || !t || !window.INVEST) return;
        const a = window.INVEST.cryptoWorth ? window.INVEST.cryptoWorth() : 0,
          o = a >= localPrice(1e4);
        if (!state.cryptoEarly && !o) return;
        const n = Math.min(
            40,
            rint(3, 8) +
              (o ? Math.round(10 * Math.log10(a / localPrice(1e4) + 1)) : 0) +
              (state.cryptoEarly ? rint(2, 6) : 0),
          ),
          s = ["Bitcoin", "Ethereum", "BTC", "ETH", "Solana", "Dogecoin"];
        for (let a = 0; a < n; a++) {
          const [a, o, n] = pickR(e),
            r = a.replace(/\{name\}/g, () => uname(chance(0.5) ? "m" : "f")),
            i = (e) =>
              e
                .replace(/\{coin\}/g, pickR(s))
                .replace(/\{amt\}/g, usd(localPrice(100 * rint(2, 900))))
                .replace(/\{name\}/g, r);
          mailTo(t.addr, r, i(o), i(n), "{name}" === a ? personAddr(r, "rand") : serviceAddr("free " + r));
        }
      }
      function emailYear() {
        const e = window.EMAIL_POOL;
        if (!e || isOldEra() || !(state.emails || []).length) return;
        const t = socYear(),
          a = Object.keys(e)
            .map(Number)
            .filter((e) => e <= t)
            .pop();
        if (!a) return;
        const o = (document.getElementById("pname").textContent || "").split(" ")[0],
          n = (e) =>
            e
              .replace(/\{name\}/g, () => uname(chance(0.5) ? "m" : "f"))
              .replace(/\{me\}/g, o)
              .replace(/\{year\}/g, t),
          s = (e, t, a) => {
            if (!t || !t.length) return null;
            const o = ((e) => ((state.mailSent ||= {})[e] ||= []))(e);
            for (let e = 0; e < 8; e++) {
              const e = pickR(t),
                n = `${e[e.length - 2]}|${String(e[e.length - 1]).slice(0, 60)}`;
              if ((!a || a(e)) && !o.includes(n)) return o.push(n), e;
            }
            return null;
          },
          r = window.EMAIL_WORK,
          i = state.job,
          l = state.emails[0];
        if (r && i && l && !state.prison) {
          const e = i.emp || i.c || "Work",
            a = `${i.t} ${i.c || ""}`,
            o =
              String(e)
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "") || "work",
            c = [
              "any",
              /restaurant|cook|chef|server|waiter|barista|fast food|pizza|bartender|kitchen|dish|donut|sandwich|coffee/i.test(
                a,
              ) && "food",
              /retail|cashier|store|sales associate|stocker|walmart|mall|clerk|grocer/i.test(a) && "retail",
              /nurse|doctor|hospital|clinic|medical|dental|pharma|paramedic|surgeon/i.test(a) && "medical",
              /teacher|school|professor|tutor|principal/i.test(a) && "school",
              /software|developer|engineer|programmer|data|tech|discord|computer/i.test(a) && "tech",
              /driver|dasher|delivery|courier|truck|uber|eats/i.test(a) && "driving",
              /army|navy|marine|air force|coast guard|military/i.test(a) && "military",
            ].filter(Boolean);
          1 === c.length && c.push("office"),
            t >= 2020 && c.some((e) => "office" === e || "tech" === e) && c.push("remote"),
            "string" == typeof i.boss && (i.boss = null);
          const d =
              i.boss && i.boss.first
                ? `${i.boss.first} ${i.boss.last}`
                : (i.mailBoss ||= `${uname(chance(0.5) ? "m" : "f")} ${ulast(state.country)}`),
            u = d.toLowerCase().split(" "),
            h = `${u[0]}.${(u[1] || "").replace(/[^a-z]/g, "")}@${o}.com`,
            p = (t) =>
              n(t)
                .replace(/\{job\}/g, i.t)
                .replace(/\{co\}/g, e)
                .replace(/\{boss\}/g, d)
                .replace(/\{q\}/g, rint(1, 4));
          for (let t = rint(4, 12); t > 0; t--) {
            const t = s(l.addr, r[pickR(c)] || r.any);
            if (!t) continue;
            const [a, n] = t,
              i = chance(0.6),
              u = i ? `${d} (${e})` : `${uname(chance(0.5) ? "m" : "f")} (${e})`;
            mailTo(l.addr, u, p(a), p(n), i ? h : `${u.split(" ")[0].toLowerCase()}@${o}.com`);
          }
        }
        const c = window.EMAIL_PEOPLE,
          d = state.emails[0];
        if (c && d) {
          const e = [
            ...aliveParents().map((e) => ["parent", `${e.first} (${e.role})`]),
            ...(state.family || [])
              .filter((e) => !e.dead && e.first)
              .flatMap((e) =>
                "sibling" === e.kind
                  ? [["sibling", `${e.first} (${relTitle(e)})`]]
                  : "grandparent" === e.kind
                    ? [["grand", `${e.first} (${relTitle(e)})`]]
                    : "child" === e.kind && relAge(e) >= 8
                      ? [["child", `${e.first} (${"m" === e.g ? "Son" : "Daughter"})`]]
                      : [],
              ),
            ...(state.lovers || [])
              .filter((e) => !e.dead && !e.ex && e.first)
              .map((e) => ["partner", `${e.first} (${loverTitle(e)})`]),
            ...(state.friends || [])
              .filter((e) => !e.dead && e.first && schoolPal(e))
              .map((e) => ["friend", `${e.first} ${e.last || ""}`.trim()]),
          ];
          let a = 0;
          for (const [o, r] of e.sort(() => Math.random() - 0.5))
            if (c[o] && !(a >= 30))
              for (let e = rint(1, 4); e > 0 && a < 30; e--, a++) {
                const e = (window.EMAIL_EMOJI || []).filter((e) => e[0] <= t),
                  a = t >= 2011 && e.length && "parent" !== o && "grand" !== o && chance(0.35),
                  i = s(d.addr, a ? e : c[o]);
                if (!i) continue;
                const [l, u] = i.slice(-2);
                mailTo(d.addr, r, n(l), n(u), personAddr(r, o));
              }
        }
        const u = (state.friends || []).filter((e) => !e.dead && e.first && schoolPal(e));
        for (const o of state.emails) {
          if (o.made > t) continue;
          const r = rint(20, 60),
            i = ([e, t, a]) => "{name}" === e || (/\{name\}/.test(t + a) && /friend/i.test(t + a)),
            l = o === state.emails[0],
            c = (e) => {
              const t = String(e).toLowerCase();
              return SOCIALS.find((e) => {
                const a = e[1].toLowerCase();
                return t === a || t.startsWith(a + " ") || t.startsWith(a + ":");
              });
            },
            d = (e) =>
              Object.keys(state.social).some((t) => socBase(t) === e[0] && state.social[t].email === o.addr),
            p = (e) => {
              return (
                !Object.values(SUBS).some((t) => t.name === e[0]) &&
                !(i(e) && (!u.length || !l)) &&
                !("Mom" === e[0] && !l) &&
                (!(t = c(e[0])) || d(t))
              );
              var t;
            };
          for (let t = 0; t < r; t++) {
            const t = s(o.addr, chance(0.85) ? e[a] : window.EMAIL_ANY || e[a], p);
            if (!t) continue;
            const [r, l, c] = t,
              d = i(t) ? pickR(u) : null,
              m = d && `${d.first} ${d.last || ""}`.trim(),
              f = (e) => n(d ? e.replace(/\{name\}/g, d.first) : e),
              g = "{name}" === r && d ? m : f(r),
              y =
                "{name}" === r
                  ? personAddr(m, "friend")
                  : "Mom" === r
                    ? personAddr(
                        (h = aliveParents().find((e) => "Mother" === e.role))
                          ? `${h.first} (${h.role})`
                          : "Mom",
                        "parent",
                      )
                    : void 0;
            mailTo(o.addr, g, f(l), f(c), y);
          }
          for (const e in state.social) {
            const a = state.social[e];
            if (a.email !== o.addr || !socOf(e) || notSocial(e)) continue;
            const [, n, s] = socOf(e),
              r = showHandle(e);
            for (let e = rint(1, 5); e > 0; e--)
              mailTo(
                o.addr,
                n,
                pickR([
                  `You have new ${s}`,
                  `@${r}, see what you missed`,
                  `${n}: your weekly recap`,
                  "New activity on your account",
                ]),
                `${fmtN(rint(2, 200))} new notifications on @${r}.`,
              );
            const i = nameValue(handleOf(e), e),
              l = t - (a.joined?.y || t - (a.years || 0));
            if (i < 1e3 || l < 2) continue;
            const c = Math.min(8, Math.round(Math.log10(i)));
            for (let e = rint(0, c); e > 0; e--)
              mailTo(
                o.addr,
                n,
                "Unusual sign-in attempt",
                `Someone tried to sign in to @${r} from ${pickR(["Russia", "Brazil", "Vietnam", "Nigeria", "an unknown device", "a VPN", "Romania", "India"])}. We blocked it. If this wasn't you, no action is needed.`,
              );
            for (let t = rint(0, Math.ceil(c / 2)); t > 0; t--) {
              const t = pickR(["person", "person", "collector", "reseller"]),
                a = `${uname(chance(0.5) ? "m" : "f")} ${ulast(state.country)}`,
                s = pickR([
                  "HandleVault",
                  "OGNames",
                  "RareTags",
                  "NameFlip",
                  "UserMart",
                  "TagBroker",
                  "ShortHandles",
                ]),
                l =
                  50 *
                  Math.round(
                    localPrice(
                      i *
                        ("collector" === t
                          ? 0.5 + Math.random()
                          : "reseller" === t
                            ? 0.15 + 0.4 * Math.random()
                            : 0.2 + 0.8 * Math.random()),
                    ) / 50,
                  ),
                c =
                  "collector" === t
                    ? `${a} (Username Collector)`
                    : "reseller" === t
                      ? `${s} (Username Reseller)`
                      : a,
                d =
                  "collector" === t
                    ? `Hello, I collect rare usernames and @${r} on ${n} would be a great fit for my collection. I can offer ${usd(l)}. Payment sent as soon as the name is transferred.`
                    : "reseller" === t
                      ? `Hi, we buy and resell usernames. We'd like to make a quick offer of ${usd(l)} for your ${n} username @${r}. Fast payment, no hassle.`
                      : `Hi! I'm interested in buying your ${n} username @${r}. Would you take ${usd(l)}? Let me know.`,
                u = mailTo(
                  o.addr,
                  c,
                  `Interested in @${r}`,
                  d,
                  "reseller" === t ? `deals@${s.toLowerCase()}.com` : personAddr(a, "rand"),
                );
              u && (u.buy = { k: e, h: r, amt: l, kind: t, who: "reseller" === t ? s : a });
            }
          }
        }
        var h;
        window.mailScamsYear && mailScamsYear();
      }
      function linkEmail(e, t) {
        const a = state.social[e];
        if (!a || !t) return;
        a.email = t;
        const [, o] = socOf(e);
        mailTo(
          t,
          o,
          `Verify your ${o} account`,
          `Welcome to ${o}! Your account @${showHandle(e)} is now verified and connected to ${t}.`,
        );
      }
      function pickEmail(e, t) {
        const a = (state.emails || []).filter((e) => !e.hacked);
        if (!a.length)
          return notice(
            "Email needed",
            (state.emails || []).length
              ? `You're locked out of your email, so you can't sign up for ${e}. Recover it or make a new address in the Email section of Assets.`
              : `You need an email address to sign up for ${e}. Make one in the Email section of Assets.`,
            null,
            !0,
          );
        setTimeout(
          () =>
            socSelCard({
              icon: socIcon(a[0].prov),
              title: "Pick an Email",
              tag: "Social",
              lead: `Which email should your ${e} account use?`,
              label: "Email:",
              opts: a.map((e) => e.addr),
              btn: "Use this email",
              onGo: (e) => t(a[e].addr),
            }),
          60,
        );
      }
      function emailRows() {
        const e = socYear();
        return (
          '<div class="sec">Email</div>' +
          Object.entries(EMAIL_PROV)
            .map(([t, a]) => {
              const o = (state.emails || []).filter((e) => e.prov === t),
                n = o.reduce((e, t) => e + (t.inbox || []).filter((e) => e.unread).length, 0);
              return e < a.year
                ? `<div class="row dis"><img src="${socIcon(t)}"><div class="t"><b>${a.name}</b></div></div>`
                : `<div class="row" data-soc="${t}"><img src="${socIcon(t)}"><div class="t"><b>${provName(t)}${n ? ` <em>(${n} new)</em>` : ""}</b><span>${o.length ? `${o.length} address${o.length > 1 ? "es" : ""}` : "Make an email address"}</span></div>${CHEV}</div>`;
            })
            .join("")
        );
      }
      function emailAssetRow() {
        const e = state.emails || [],
          t = e.reduce((e, t) => e + (t.inbox || []).filter((e) => e.unread).length, 0);
        return `<div class="row" id="assetEmail"><img src="${socIcon("gmail")}"><div class="t"><b>Email${t ? ` <em>(${t} new)</em>` : ""}</b><span>${e.length ? `${e.length} address${e.length > 1 ? "es" : ""}` : "Make an email address"}</span></div>${CHEV}</div>`;
      }
      function openEmail() {
        if (isOldEra()) return oldEraNo("email");
        (sTitle.textContent = "EMAIL"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openAssets),
          (sList.innerHTML = emailRows()),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-soc]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), openEmailProvider(e.dataset.soc);
              }),
          ),
          screen.classList.add("open");
      }
      function openEmailProvider(e) {
        const t = (state.emails || []).filter((t) => t.prov === e);
        (sTitle.textContent = provName(e).toUpperCase()),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openEmail),
          (sList.innerHTML =
            t
              .map((t, a) => {
                const o = (t.inbox || []).filter((e) => e.unread).length;
                return `<div class="row" data-em="${a}"><img src="${socIcon(e)}"><div class="t"><b>${t.addr}</b><span>${t.hacked ? '<img src="emoji/1f512.png" alt="" style="width:15px;height:15px;vertical-align:-2px;margin-right:4px">Can\'t sign in: password changed' : `${(t.inbox || []).length} emails${o ? ` · ${o} new` : ""}`}</span></div>${CHEV}</div>`;
              })
              .join("") +
            `<div class="row" id="emNew"><img src="${socIcon(e)}"><div class="t"><b>New Address</b><span>Claim a ${provName(e)} address</span></div>${DOTS}</div>`),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-em]").forEach(
            (a) =>
              (a.onclick = () => {
                play("choice");
                const o = t[+a.dataset.em];
                o.hacked ? emailLoginCard(o, e) : openInbox(o, e);
              }),
          ),
          (document.getElementById("emNew").onclick = () => {
            play("choice"), newEmailCard(e);
          }),
          screen.classList.add("open");
      }
      function emailClaimed(e, t, a) {
        const o = socYear(),
          n = "outlook.com" === a ? 2013 : (EMAIL_PROV[e] || {}).year || o,
          s = Math.max(0, o - n),
          r = wordRank(t),
          i = nameCommon(t),
          l = Math.max(null != r ? Math.max(0, 1 - r / RANK_MAX) : -1, i);
        let c = celebOf(t) ? 0.99 : Math.min(0.99, 0.03 + s * (0.06 + 0.5 * l * l + 0.1 * l));
        o >= 2021 && (c = Math.max(c, i > 0.45 ? 0.97 : i > 0.25 ? 0.8 : i > 0.1 ? 0.5 : 0.1)),
          nameSpammy(t) && (c = Math.min(c, 0.03));
        const d = (state.emailClaims ||= {}),
          u = `${a}:${t}`,
          h = d[u];
        if (h && h.t) return !0;
        if (h && h.y === o) return !1;
        const p = h ? h.p : 0,
          m = chance(p >= 1 ? 1 : Math.max(0, (c - p) / (1 - p)));
        return (d[u] = { y: o, p: c, t: m }), m;
      }
      function newEmailCard(e) {
        const t = EMAIL_PROV[e],
          a = emailDomain(e),
          o = t.min;
        (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div><div class="jm-tag" style="margin-top:12px">Email</div>\n      <h4><img src="${socIcon(e)}" alt=""><span>New ${provName(e)} Address</span></h4>\n      <div class="lead">Pick your address (${o}-15 letters, numbers, dots or underscores).</div>\n      <label class="hr-lab">Address:</label><div class="hr-sel txt" style="display:flex;align-items:center"><input id="emName" maxlength="15" autocomplete="off" spellcheck="false"\n        style="flex:1;min-width:0;height:40px;border:none;background:transparent;font:inherit;font-size:17px;padding:0 4px 0 10px" placeholder="name"><span style="padding-right:10px;color:#666">@${a}</span></div>\n      <label class="hr-lab" style="margin-top:12px">Password:</label><div class="hr-sel txt"><input id="pwIn" maxlength="24" autocomplete="off" spellcheck="false"\n        style="width:100%;height:40px;border:none;background:transparent;font:inherit;font-size:17px;padding:0 10px" value="${escAttr(usualPw())}"></div>\n      <div class="lead" id="pwHint" style="font-size:14px;margin:10px 0 18px"></div>\n      <button class="jm-apply ev-btn" id="pwGen">Make a strong password</button><button class="jm-apply ev-btn" id="socGo">Claim address</button>`),
          (ev.style.overflow = "visible");
        const n = () => {
            evWrap.classList.remove("open"), (ev.style.overflow = "");
          },
          s = document.getElementById("pwIn"),
          r = document.getElementById("pwHint"),
          i = () => {
            const e = pwReuse(s.value);
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
            const t = document.getElementById("emName").value,
              r = cleanHandle(t),
              i = s.value.trim();
            if ((n(), isBadName(t) || isBadName(r)))
              return notice(
                "Not allowed",
                "That address isn't allowed. Pick one without bad words.",
                null,
                !0,
              );
            if (r.length < o)
              return notice("Too short", `${provName(e)} addresses need at least ${o} characters.`, null, !0);
            if (i.length < 6) return notice("Too short", "Passwords need at least 6 characters.", null, !0);
            const l = `${r}@${a}`;
            if (emailClaimed(e, r, a) || (state.emails || []).some((e) => e.addr === l))
              return (
                say(`I tried to make the email ${l}, but it was taken.`),
                notice("Taken", `${l} is already taken.`, null, !0)
              );
            (state.emails ||= []).push({
              prov: e,
              addr: l,
              made: socYear(),
              inbox: [],
              pw: i,
              pwY: socYear(),
            }),
              mailTo(l, provName(e), `Welcome to ${provName(e)}`, `Your new address ${l} is ready to use.`),
              say(`I made a new email address: ${l}.`),
              openEmailProvider(e),
              notice("New email", `${l} is yours.`, null, !0);
          }),
          evWrap.classList.add("open");
      }
      window.MAIL_MAIN = (e, t, a, o) => {
        const n = (state.emails || [])[0];
        n && mailTo(n.addr, e, `🪙 ${t}`, a, o, !0);
      };
      const EMOJI_YEAR = {
          "1fa99": 2020,
          "1f9fe": 2018,
          "1f97a": 2018,
          "1f970": 2018,
          "1f973": 2018,
          "1f92a": 2017,
          "1f9e2": 2017,
          "1f923": 2016,
          "1f914": 2016,
          "1f921": 2016,
          "1f644": 2015,
          "1f911": 2015,
          "1f917": 2015,
          "1fae0": 2021,
          "1fae1": 2021,
          "1f972": 2020,
          "1f90c": 2020,
          "1f9ff": 2018,
          "1f975": 2018,
        },
        EMOJI_OLDER = {
          "1fa99": "1f4b0",
          "1f9fe": "1f4c3",
          "1f97a": "1f622",
          "1f970": "1f60d",
          "1f973": "1f389",
          "1f92a": "1f61c",
          "1f923": "1f602",
          "1f914": "1f615",
          "1f644": "1f615",
          "1f911": "1f4b0",
          "1f917": "1f60a",
          "1fae0": "1f60a",
          "1fae1": "1f60a",
          "1f972": "1f60a",
          "1f975": "1f60a",
        },
        EMOTICON = {
          "1f602": "lol",
          "1f923": "lol",
          "1f60a": ":)",
          "1f642": ":)",
          "1f600": ":D",
          "1f603": ":D",
          "1f604": ":D",
          "1f601": ":D",
          "1f61b": ":P",
          "1f61c": ";P",
          "1f609": ";)",
          "1f622": ":'(",
          "1f62d": ":'(",
          "1f61e": ":(",
          "1f641": ":(",
          2764: "<3",
          "1f60d": "<3",
          "1f618": ":*",
          "1f62e": ":O",
          "1f60e": "B)",
          "1f610": ":|",
        },
        EMOJI_RX = /\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic}️?|[\u{1F3FB}-\u{1F3FF}])*/gu;
      function emojify(e, t = socYear()) {
        return String(e).replace(EMOJI_RX, (e) => {
          let a = [...e]
            .map((e) => e.codePointAt(0).toString(16))
            .filter((e) => "fe0f" !== e)
            .join("-");
          if (t < 2011) return null != EMOTICON[a] ? EMOTICON[a] : "";
          for (; EMOJI_YEAR[a] && t < EMOJI_YEAR[a]; ) {
            if (!EMOJI_OLDER[a]) return EMOTICON[a] || "";
            a = EMOJI_OLDER[a];
          }
          const o = "2764" === a ? "2764-fe0f" : a;
          return `<img src="emoji/${o}.png" alt="" style="width:1.15em;height:1.15em;vertical-align:-.2em" onerror="this.onerror=()=>this.remove();this.src='freelife/apple/${o}.png'">`;
        });
      }
      function openInbox(e, t) {
        (sTitle.textContent = "INBOX"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => openEmailProvider(t));
        const a = [...(e.inbox || [])].reverse().sort((e, t) => (t.t || 0) - (e.t || 0)),
          o = Object.keys(state.social).filter(
            (t) => state.social[t].email === e.addr && !state.social[t].stranger,
          ),
          n = e.linked || [],
          s =
            o.length + n.length
              ? `<div class="row sm" id="emLinked"><img src="emoji/1f465.png"><div class="t"><b>Linked Accounts <em>(${o.length + n.length})</em></b><span>${o.length} yours · ${n.length} from strangers</span></div>${DOTS}</div>`
              : "",
          r = `<div class="row sm" id="emPw"><img src="emoji/1f512.png"><div class="t"><b>Password</b><span>Change the password for this address</span></div>${DOTS}</div>`,
          i = [e.sec && e.sec.q && "question", e.phone && "phone", e.backup && "backup email"].filter(
            Boolean,
          ),
          l = `<div class="row sm" id="emSec"><img src="emoji/1f6e1-fe0f.png" onerror="this.onerror=null;this.src='emoji/1f512.png'"><div class="t"><b>Security</b><span>${i.length ? `Recovery: ${i.join(", ")}` : "Add recovery options (question, phone, backup email)"}</span></div>${CHEV}</div>`,
          c = window.mailCompose
            ? `<div class="row sm" id="emNew"><img src="emoji/270f-fe0f.png" onerror="this.onerror=null;this.src='emoji/1f4e7.png'"><div class="t"><b>New Email</b><span>Write to family, friends or your partner</span></div>${CHEV}</div>`
            : "";
        (sList.innerHTML =
          `<div class="sec">${e.addr}</div>` +
          c +
          r +
          l +
          s +
          (a.length
            ? a
                .map(
                  (e, a) =>
                    `<div class="row sm" data-mail="${a}"><img src="${mailIcon(e, t)}"><div class="t"><b>${e.unread ? "● " : ""}${emojify(e.subj, Math.floor((e.t || 0) / 400) || socYear())}</b><span>${e.from}${e.fa ? ` &lt;${e.fa}&gt;` : ""} · ${e.date}</span></div>${DOTS}</div>`,
                )
                .join("")
            : `<div class="row dis"><img src="${socIcon(t)}"><div class="t"><b>No emails</b><span>Your inbox is empty</span></div></div>`)),
          (sList.scrollTop = 0),
          a.forEach((e) => {
            e.unread = !1;
          }),
          (document.getElementById("emPw").onclick = () => {
            play("choice"),
              pwCard(
                provName(t),
                (a) => {
                  emailPwOf(e),
                    (e.pw = a),
                    (e.pwY = socYear()),
                    say(`I changed the password on ${e.addr}.`),
                    notice("Password changed", `${e.addr} has a new password.`, () => openInbox(e, t), !0);
                },
                emailPwOf(e),
                e,
              );
          }),
          (document.getElementById("emSec").onclick = () => {
            play("choice"), emailSecurity(e, t);
          });
        const d = document.getElementById("emNew");
        d &&
          (d.onclick = () => {
            play("choice"), mailCompose(e, () => openInbox(e, t));
          });
        const u = document.getElementById("emLinked");
        u &&
          (u.onclick = () => {
            play("choice");
            const a = [
              ...o.map((e) => `<tr><td><b>${socOf(e)[1]}:</b> @${showHandle(e)} (you)</td></tr>`),
              ...n
                .slice(-30)
                .reverse()
                .map(
                  (e) =>
                    `<tr><td><b>${e.svc}:</b> ${e.user ? `@${escAttr(e.user)}` : e.who} (${e.y})</td></tr>`,
                ),
            ].join("");
            notice(
              "Linked Accounts",
              `Accounts using ${e.addr}.${n.length ? " Strangers keep putting your address in when they sign up for things." : ""}<table class="nt">${a}</table>`,
              () => openInbox(e, t),
              !0,
            );
          }),
          sList.querySelectorAll("[data-mail]").forEach(
            (o) =>
              (o.onclick = () => {
                play("choice");
                const n = a[+o.dataset.mail];
                if (((n.unread = !1), n.buy && !n.buy.done))
                  return buyerMailCard(e, n, () => openInbox(e, t));
                if (n.scam && !n.scam.done && window.scamMailCard)
                  return scamMailCard(e, n, () => openInbox(e, t));
                if (window.mailCanReply && mailCanReply(n)) return mailThread(e, n, () => openInbox(e, t));
                const s = Math.floor((n.t || 0) / 400) || socYear();
                notice(
                  `<img class="nt-ico" src="${mailIcon(n, t)}" alt="">${n.subj.replace(EMOJI_RX, "").trim() || "Email"}`,
                  `<b>From:</b> ${n.from}${n.fa ? `<br>&lt;${n.fa}&gt;` : ""}<br><b>To:</b> ${e.addr}<br><b>Date:</b> ${n.date}<br><br>${isRbxBcMail(n) ? rbxBcMailBody() : emojify(n.body, s)}`,
                  () => openInbox(e, t),
                  !0,
                );
              }),
          ),
          screen.classList.add("open");
      }
      const emailLockedFor = (e) => {
          const t = state.social[e];
          return !(
            !t ||
            !t.email ||
            t.stranger ||
            !(state.emails || []).some((e) => e.addr === t.email && e.hacked)
          );
        },
        SEC_QS = [
          "What was the name of your first pet?",
          "What city were you born in?",
          "What is your mother's maiden name?",
          "What was your first school called?",
          "What is your favorite food?",
          "What was your childhood nickname?",
        ],
        myPhone = () =>
          (state.phoneNum ||= `(${rint(201, 989)}) ${rint(200, 999)}-${String(rint(0, 9999)).padStart(4, "0")}`),
        maskPhone = (e) => `(•••) •••-${String(e).slice(-4)}`;
      function emailSecurity(e, t) {
        const a = provName(t),
          o = () => emailSecurity(e, t);
        (sTitle.textContent = "SECURITY"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => openInbox(e, t));
        const n = (state.emails || []).filter((t) => t !== e);
        (sList.innerHTML = `<div class="sec">${e.addr}</div><div class="row sm" id="secQ"><img src="emoji/2753.png" onerror="this.onerror=null;this.src='emoji/1f512.png'"><div class="t"><b>Security Question</b><span>${e.sec && e.sec.q ? escAttr(e.sec.q) : "Not set"}</span></div>${DOTS}</div><div class="row sm" id="secP"><img src="emoji/1f4f1.png" onerror="this.onerror=null;this.src='emoji/1f512.png'"><div class="t"><b>Recovery Phone</b><span>${e.phone ? maskPhone(e.phone) : "Not set"}</span></div>${DOTS}</div><div class="row sm" id="secB"><img src="emoji/1f4e7.png" onerror="this.onerror=null;this.src='emoji/1f512.png'"><div class="t"><b>Backup Email</b><span>${e.backup ? escAttr(e.backup) : "Not set"}</span></div>${DOTS}</div><div class="row dis"><img src="emoji/1f4a1.png" onerror="this.onerror=null;this.src='emoji/1f512.png'"><div class="t"><b>Tip</b><span>Each one gives you a better chance of getting back in if ${a} is ever hacked</span></div></div>`),
          (sList.scrollTop = 0),
          (document.getElementById("secQ").onclick = () => {
            play("choice"),
              socSelCard({
                icon: socIcon(t),
                tag: "Security",
                title: "Security Question",
                lead: "Pick a question only you know the answer to.",
                label: "Question:",
                opts: SEC_QS,
                btn: "Next",
                onGo: (a) =>
                  setTimeout(() => {
                    (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div><div class="jm-tag" style="margin-top:12px">Security</div>\n          <h4><img src="${socIcon(t)}" alt=""><span>Your Answer</span></h4><div class="lead">${escAttr(SEC_QS[a])}</div>\n          <label class="hr-lab">Answer:</label><div class="hr-sel txt"><input id="secA" maxlength="40" autocomplete="off" spellcheck="false" style="width:100%;height:40px;border:none;background:transparent;font:inherit;font-size:16px;padding:0 10px"></div>\n          <button class="jm-apply ev-btn" id="socGo">Save</button>`),
                      (ev.style.overflow = "visible");
                    const n = () => {
                      evWrap.classList.remove("open"), (ev.style.overflow = "");
                    };
                    (document.getElementById("propX").onclick = n),
                      (document.getElementById("socGo").onclick = () => {
                        const t = document.getElementById("secA").value.trim();
                        if ((n(), !t)) return notice("No answer", "Type an answer first.", o, !0);
                        (e.sec = { q: SEC_QS[a], a: t }),
                          say(`I set a security question on ${e.addr}.`),
                          notice("Saved", "Your security question is set.", o, !0);
                      }),
                      evWrap.classList.add("open");
                  }, 60),
              });
          }),
          (document.getElementById("secP").onclick = () => {
            if ((play("choice"), state.age < 10 || socYear() < 1998))
              return notice(
                "No phone",
                socYear() < 1998
                  ? "Hardly anyone has a cell phone yet."
                  : "You don't have a phone of your own yet.",
                o,
                !0,
              );
            socSelCard({
              icon: socIcon(t),
              tag: "Security",
              title: "Recovery Phone",
              lead: e.phone
                ? `Your recovery phone is ${maskPhone(e.phone)}.`
                : `Add your phone number (${myPhone()}) so ${a} can text you a code if you get locked out.`,
              label: "Phone:",
              opts: e.phone ? ["Keep it", "Remove it"] : [`Add ${myPhone()}`, "Not now"],
              btn: "Save",
              onGo: (t) => {
                e.phone || 0 !== t
                  ? e.phone && 1 === t && ((e.phone = null), say(`I removed my phone number from ${e.addr}.`))
                  : ((e.phone = myPhone()), say(`I added my phone number to ${e.addr}.`)),
                  o();
              },
            });
          }),
          (document.getElementById("secB").onclick = () => {
            if ((play("choice"), !n.length))
              return notice(
                "No other address",
                "Make another email address first, then you can use it as a backup.",
                o,
                !0,
              );
            socSelCard({
              icon: socIcon(t),
              tag: "Security",
              title: "Backup Email",
              lead: `A second address ${a} can send a recovery link to.`,
              label: "Backup:",
              opts: [...n.map((e) => e.addr), "None"],
              btn: "Save",
              onGo: (t) => {
                (e.backup = t < n.length ? n[t].addr : null),
                  say(
                    e.backup
                      ? `I set ${e.backup} as the backup for ${e.addr}.`
                      : `I removed the backup email from ${e.addr}.`,
                  ),
                  o();
              },
            });
          }),
          screen.classList.add("open");
      }
      function socialExtraAccount(e, t, a, o) {
        const n = socBase(e),
          [, s] = socOf(n);
        Object.keys(state.social).filter((e) => socBase(e) === n);
        if (!t)
          return pickEmail(
            s,
            (t) =>
              ("roblox" === n && rbxEraPage(t)) ||
              ("xboxlive" === n && xblEraPage(xblNewKey(), t)) ||
              ("discord" === n && dcEraPage(dcNewKey(), t)) ||
              ("youtube" === n && ytEraPage(ytNewKey(), t)) ||
              handleCard(
                n,
                s,
                `${(handleOf(e) || "user").replace(/\d+$/, "").slice(0, 11) || "user"}${rint(10, 9999)}`,
                (a) => pwCard(s, (o) => socialExtraAccount(e, t, o, a)),
              ),
          );
        let r = 2;
        for (; state.social[`${n}~${r}`]; ) r++;
        const i = `${n}~${r}`;
        (state.social[i] = {
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
          (state.social[i].handle =
            o || `${handleOf(n).replace(/\d+$/, "").slice(0, 11) || "user"}${rint(10, 9999)}`),
          (state.social[i].pw = a || usualPw()),
          (state.social[i].pwY = socYear()),
          linkEmail(i, t),
          say(`I made another ${s} account, @${state.social[i].handle}.`),
          openSocialAccount(i),
          notice(
            "New account",
            `You made a new ${s} account, @${state.social[i].handle}. Change its username any time.`,
            null,
            !0,
          );
      }
      const socAge = (e) => {
          const t = SOC_LAUNCH[socBase(e)];
          return t ? Math.max(0, socYear() - t) : 99;
        },
        socReach = (e, t) => {
          const a = socAge(e);
          return Math.round(Math.min(5e3 * 12 ** Math.min(a, 6), t * Math.min(1, ((a + 1) / 8) ** 2)));
        };
