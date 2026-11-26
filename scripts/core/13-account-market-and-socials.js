      function openNameMarket() {
        const e = marketListings(),
          t = state.nameMarket.quality || {};
        (sTitle.textContent = "USERNAME MARKET"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial);
        const a = marketCoins(),
          o = (state.myListings || []).filter((e) => state.social[e.k]),
          n = a
            .filter((e) => e.held >= 1)
            .map((e) => `${coinAmt(e, e.held)} (${usd(Math.round(e.held))})`)
            .join(" · ");
        (sList.innerHTML =
          `<div class="row"><img src="emoji/1f4b0.png"><div class="t"><b>Your Crypto Wallet</b><span>${n || `No ${a.map((e) => e.name).join(" or ") || "crypto"} yet`}</span></div></div><div class="sec">Selling</div>` +
          o
            .map(
              (e) =>
                `<div class="row" data-ml="${e.k}"><img src="${socIcon(socBase(e.k))}"><div class="t"><b>@${showHandle(e.k)} <em>(${socOf(e.k)[1]})</em></b><span>Asking ${usd(e.price)} in ${window.INVEST?.coinInfo(e.coin).tick || "crypto"} · listed ${e.year}</span></div>${DOTS}</div>`,
            )
            .join("") +
          `<div class="row" id="mlNew"><img src="emoji/1f4b8.png"><div class="t"><b>List an Account</b><span>Sell one of your accounts for crypto</span></div>${CHEV}</div>` +
          `<div class="sec">For Sale ${socYear()}</div>` +
          Object.keys(e)
            .map((a) => {
              const [, o] = socOf(a),
                n = e[a][0];
              return `<div class="row" data-mp="${a}"><img src="${socIcon(a)}"><div class="t"><b>${o} <em>(${e[a].length})</em></b><span>${qualityWord(t[a] || 0)}${n ? ` · top: @${n.h} ${usd(n.price)}` : ""}</span></div>${CHEV}</div>`;
            })
            .join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-mp]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), openMarketAisle(e.dataset.mp);
              }),
          ),
          sList.querySelectorAll("[data-ml]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), cancelListingCard(e.dataset.ml);
              }),
          ),
          (document.getElementById("mlNew").onclick = () => {
            play("choice"), listAccountCard();
          }),
          screen.classList.add("open");
      }
      const FORUM_CSS =
          "<style>\n    .fm{background:#121212;min-height:100%;padding:6px 6px 14px;font-family:'Segoe UI',Roboto,Arial,sans-serif;color:#e6e6e6}\n    .fm .hd{color:#9aa0a6;font-size:11.5px;padding:4px 6px 8px}\n    .fm .th{background:#1c1c1c;border-radius:6px;margin:0 0 6px;padding:9px 10px;display:flex;gap:9px;align-items:center;cursor:pointer}\n    .fm .th:active{background:#242424}\n    .fm .th .m{flex:1;min-width:0}\n    .fm .th .tt{font-size:13px;font-weight:700;color:#f1f1f1;line-height:1.3;overflow-wrap:anywhere}\n    .fm .by{font-size:11px;color:#8b8f94;margin-top:3px}\n    .fm .st{flex:none;text-align:right;font-size:10.5px;color:#9aa0a6;line-height:1.5;white-space:nowrap}\n    .fm .st b{color:#d6d6d6;font-weight:700}\n    .fm .tag{display:inline-block;font-size:10.5px;font-weight:700;margin-right:5px;vertical-align:1px}\n    .fm .tag.sell{background:#1d8cf0;color:#fff;border-radius:10px;padding:1px 7px}\n    .fm .tag.void{color:#a855f7}.fm .tag.solar{color:#38bdf8}.fm .tag.apollo{color:#fff}.fm .tag.buy{color:#22c55e}\n    .fm .ux{font-weight:700}\n    .fm .ux.white{color:#fff}.fm .ux.purple{color:#a855f7}.fm .ux.pink{color:#ec4899}.fm .ux.yellow{color:#facc15}.fm .ux.cyan{color:#22d3ee}\n    .fm .ux.glow{color:#c4b5fd;text-shadow:0 0 6px #8b5cf6,0 0 12px #7c3aed}\n    .fm .ux.rainbow{background:linear-gradient(90deg,#f43f5e,#f59e0b,#eab308,#22c55e,#3b82f6,#a855f7,#f43f5e);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:fmRb 3s linear infinite}\n    .fm .ux.fire{background:linear-gradient(90deg,#ff3d00,#ffb300,#ff3d00);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:fmRb 1.6s linear infinite;text-shadow:none}\n    .fm .ux.sparkle{color:#fff;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.55) 50%,transparent 70%) 0 0/200% 100% no-repeat,linear-gradient(#3b82f6,#3b82f6);-webkit-background-clip:text;background-clip:text;color:transparent;animation:fmRb 2.2s linear infinite}\n    .fm .ux.banned{color:#fff;text-decoration:underline wavy #ef4444;text-underline-offset:3px}\n    .fm .ux.boxed{color:#fff;background:#b91c1c;padding:0 3px;border-radius:2px}\n    @keyframes fmRb{to{background-position:-200% 0}}\n    .fm .post{background:#1c1c1c;border-radius:6px;padding:10px;margin-top:6px}\n    .fm .post .pu{display:flex;gap:10px;align-items:center;border-bottom:1px solid #2a2a2a;padding-bottom:9px;margin-bottom:9px}\n    .fm .post .pu img{width:46px;height:46px;border-radius:50%;flex:none}\n    .fm .post .pu small{display:block;color:#8b8f94;font-size:10.5px;margin-top:2px}\n    .fm .post p{font-size:13px;line-height:1.5;margin:0 0 8px;color:#dcdcdc}\n    .fm .price{background:#111;border:1px solid #2f2f2f;border-radius:6px;padding:8px;text-align:center;margin:10px 0}\n    .fm .price b{display:block;font-size:20px;color:#22c55e}\n    .fm .bt{display:block;width:100%;padding:10px;border:none;border-radius:6px;background:#1d8cf0;color:#fff;font-weight:700;font-size:14px;font-family:inherit;cursor:pointer;margin-top:6px}\n    .fm .bt.gy{background:#2a2a2a;color:#ddd}\n    .fm .ci{width:14px;height:14px;vertical-align:-2px;margin-right:2px}\n    .fm .vb{width:15px;height:15px;vertical-align:-2px;margin:0 3px 0 1px}\n    .fm .th.vf{background:#1f1a08 url(fame/stars-dm.png) 0 0/90px 90px repeat;box-shadow:inset 4px 0 0 #f2b705,0 0 0 1px #5a4a10}\n    .fm .th.vf .tt{color:#ffe08a}\n    .fm .tag.vtag{background:#f2b705;color:#2a1d00;border-radius:10px;padding:1px 7px}\n  </style>",
        strHash = (e) => {
          let t = 2166136261;
          for (let a = 0; a < e.length; a++) t = Math.imul(t ^ e.charCodeAt(a), 16777619);
          return t >>> 0;
        },
        mulberry32 = (e) => () => {
          e = (e + 1831565813) | 0;
          let t = Math.imul(e ^ (e >>> 15), 1 | e);
          return (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t), ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        },
        FORUM_FX = [
          "white",
          "white",
          "purple",
          "pink",
          "yellow",
          "cyan",
          "glow",
          "rainbow",
          "fire",
          "sparkle",
          "banned",
          "boxed",
        ],
        FORUM_TAGS = [
          ["sell", "Selling"],
          ["sell", "Selling"],
          ["sell", "Selling"],
          ["void", "VOID"],
          ["solar", "Solar"],
          ["apollo", "Apollo"],
        ];
      function forumMeta(e) {
        const t = mulberry32(strHash(`${e.base}:${e.h}:${socYear()}`)),
          a = (e) => e[Math.floor(t() * e.length)],
          [, o] = socOf(e.base),
          n = window.GAMERTAGS || [],
          s =
            t() < 0.5 && n.length
              ? a(n)
              : a([
                  "cardistry",
                  "Sesko",
                  "Scotty Ross",
                  "ene",
                  "woobzey",
                  "Roki",
                  "azusa",
                  "Stay High",
                  "GangstaRap",
                  "Tirana",
                  "jealous",
                  "vjd",
                  "mqb",
                  "moar",
                  "marcineq",
                  "apelido",
                  "L",
                  "05",
                ]),
          r = e.h.length,
          i = r <= 3 ? `${r}L ` : r <= 4 ? "4L " : "",
          l = e.verified ? ["vtag", e.celeb ? "Celebrity" : "Verified"] : a(FORUM_TAGS),
          c = e.celeb
            ? a([
                `${e.celeb.name}'s REAL ${o} @${e.h} | ${fmtN(e.subs)} followers | Serious buyers only`,
                `Verified ${o} @${e.h} (${e.celeb.name}) | Full access`,
                `[${o}] @${e.h} | ${e.celeb.name} | Pulled from their team, don't ask`,
                `Celebrity ${o} @${e.h} | Blue check | Escrow only`,
              ])
            : e.verified
              ? a([
                  `Pre-verified ${o} @${e.h} | Blue check included`,
                  `Verified ${o} account @${e.h} | ${fmtN(e.subs)} followers`,
                  `[${o}] Blue check @${e.h} | Cheap`,
                ])
              : a([
                  `OG ${i}@${e.h} | ${o} | Instant Delivery`,
                  `${i}${o} @${e.h} | full access, email changeable`,
                  `[${o}] @${e.h} | Original owner | Middleman OK`,
                  `Rare ${o} handle @${e.h} | Clean history`,
                  `Selling @${e.h} (${o}) | Price inside`,
                  `@${e.h} ${o} account | Quick sale`,
                  `${o} OG @${e.h} | Vouched seller`,
                ]),
          d = a([
            `${Math.floor(59 * t()) + 1} minutes ago`,
            `${Math.floor(11 * t()) + 1} hours ago`,
            "Today, 01:02 AM",
            "Yesterday, 09:47 PM",
            "Yesterday, 06:22 PM",
            `${Math.floor(6 * t()) + 2} days ago`,
          ]),
          u = Math.floor(1500 * Math.pow(t(), 2.2)),
          h = Math.min(socYear(), Math.max(2013, socYear() - Math.floor(9 * t()))),
          p = Math.floor(4e3 * t()) + 3,
          m = [
            a([
              `Selling @${e.h} on ${o}.`,
              `Up for grabs: @${e.h} on ${o}.`,
              `Letting go of @${e.h} (${o}).`,
            ]),
            a([
              "Original owner, full email access, nothing shady.",
              "Clean name, never banned, never flagged.",
              "Had it since day one, just don't use it anymore.",
              "Comes with the original email, I change it over to yours.",
            ]),
            a([
              "No lowballs, I know what it's worth.",
              "Price is firm.",
              "Open to reasonable offers but don't waste my time.",
              "First come first serve.",
            ]),
            a([
              "Middleman accepted.",
              "Vouches in my profile.",
              "Crypto only.",
              "Paying first if you have no vouches.",
              "DM me, I reply fast.",
            ]),
          ];
        return {
          seller: s,
          fx: a(FORUM_FX),
          tag: l,
          title: c,
          ago: d,
          replies: u,
          joined: h,
          posts: p,
          body: m,
        };
      }
      const CHAT_ICO = '<img class="ci" src="freelife/apple/1f4ac.png" alt="">',
        VBADGE = '<img class="vb" src="social/verify.png" alt="Verified">',
        forumName = (e) => `<span class="ux ${e.fx}">${escAttr(e.seller)}</span>`,
        forumTag = (e) => `<span class="tag ${e.tag[0]}">${e.tag[1]}</span>`;
      function openMarketAisle(e) {
        const t = marketListings()[e] || [],
          [, a] = socOf(e);
        (sTitle.textContent = `${a.toUpperCase()} NAMES`),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openNameMarket),
          (sList.innerHTML =
            FORUM_CSS +
            `<div class="fm"><div class="hd">${a} accounts · ${qualityWord((state.nameMarket.quality || {})[e] || 0)} · ${t.length} threads</div>` +
            (t.length
              ? t
                  .map((e, t) => {
                    const a = forumMeta(e);
                    return `<div class="th${e.verified ? " vf" : ""}" data-nm="${t}"><div class="m"><div class="tt">${forumTag(a)}${e.verified ? VBADGE : ""}${escAttr(a.title)}</div><div class="by">by ${forumName(a)}</div></div><div class="st">${CHAT_ICO}<b>${fmtN(a.replies)}</b><br>${a.ago}</div></div>`;
                  })
                  .join("")
              : '<div class="hd">No threads yet. Check back next year.</div>') +
            "</div>"),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-nm]").forEach(
            (a) =>
              (a.onclick = () => {
                play("choice"), forumThread(e, t[+a.dataset.nm]);
              }),
          ),
          screen.classList.add("open");
      }
      function forumThread(e, t) {
        const a = forumMeta(t),
          [, o] = socOf(e);
        (sTitle.textContent = "THREAD"),
          (sBack.onclick = () => openMarketAisle(e)),
          (sList.innerHTML =
            FORUM_CSS +
            `<div class="fm"><div class="th" style="cursor:default"><div class="m"><div class="tt">${forumTag(a)}${escAttr(a.title)}</div>` +
            `<div class="by">by ${forumName(a)} · ${a.ago} · ${CHAT_ICO}${fmtN(a.replies)}</div></div></div>\n      <div class="post"><div class="pu"><img src="social/market/pfp.png" alt=""><div>${forumName(a)}<small>${"Selling" === a.tag[1] ? "Member" : `${a.tag[1]} member`} · Joined ${a.joined} · ${fmtN(a.posts)} posts</small></div></div>\n        ${a.body.map((e) => `<p>${escAttr(e)}</p>`).join("")}\n        ${t.verified ? `<p>${VBADGE}<b>${t.celeb ? `${escAttr(t.celeb.name)}'s verified account` : "Verified account"}</b> · ${fmtN(t.subs)} followers${t.celeb ? ". You get the whole account, followers and blue check. What happens after is your problem." : "."}</p>` : ""}\n        <div class="price">Asking price<b>${usd(t.price)}</b>${o} · @${escAttr(t.h)}</div>\n        <button class="bt" id="fmBuy">Buy @${escAttr(t.h)}</button><button class="bt gy" id="fmBack">Back to threads</button></div></div>`),
          (sList.scrollTop = 0),
          (document.getElementById("fmBack").onclick = () => {
            play("choice"), openMarketAisle(e);
          }),
          (document.getElementById("fmBuy").onclick = () => {
            play("choice"), screen.classList.remove("open"), setTimeout(() => marketBuyCard(t), 80);
          });
      }
      const acctWorth = (e) =>
        "discord" === socBase(e)
          ? dcWorth(e)
          : Math.round(
              localPrice(
                nameValue(handleOf(e), e) * marketInflation(socYear()) +
                  0.05 * Math.max(0, state.social[e].subs - (state.social[e].fake || 0)),
              ),
            );
      function listAccountCard() {
        const e = marketCoins().filter((e) => e.live),
          t = new Set((state.myListings || []).map((e) => e.k)),
          a = Object.keys(state.social).filter(
            (e) => socOf(e) && !state.social[e].banned && !t.has(e) && !socEnded(e) && !notSocial(e),
          );
        return e.length
          ? a.length
            ? void socSelCard({
                icon: "emoji/1f4b8.png",
                title: "List an Account",
                tag: "Market",
                lead: "Pick an account to put up for sale. You set the price next.",
                label: "Account:",
                opts: a.map((e) => `@${showHandle(e)} (${socOf(e)[1]})`),
                btn: "Next",
                onGo: (t) => setTimeout(() => listPriceCard(a[t], e), 50),
              })
            : notice("Nothing to sell", "You have no accounts to list.", null, !0)
          : notice(
              "No crypto yet",
              "Buyers on the market pay in Bitcoin or Ethereum, and neither exists yet.",
              null,
              !0,
            );
      }
      function listPriceCard(e, t) {
        const a = Math.max(localPrice(25), acctWorth(e)),
          o = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 5],
          n = t.flatMap((e) => o.map((t) => [e, Math.max(5, 5 * Math.round((a * t) / 5))]));
        socSelCard({
          icon: `${socIcon(socBase(e))}`,
          title: `Sell @${showHandle(e)}`,
          tag: "Market",
          lead: "Set an asking price. Ask too much and it could sit for years; ask too little and it goes fast.",
          label: "Price and coin:",
          opts: n.map(([e, t]) => `${usd(t)} in ${e.tick}`),
          btn: "List it",
          onGo: (t) => {
            const [a, o] = n[t],
              s = { k: e, price: o, coin: a.id, year: socYear(), views: 0, up: 0, down: 0 };
            (state.myListings ||= []).push(s),
              listingTraffic(s),
              say(
                `I listed my ${socOf(e)[1]} account @${showHandle(e)} on the Username Market for ${usd(o)}.`,
              );
            const r = o / Math.max(1, acctWorth(e)),
              i = acctWorth(e);
            if ((r <= 0.6 && i >= localPrice(3e3)) || (r <= 0.35 && i >= localPrice(300)))
              return sellListing(s, !0);
            openNameMarket(),
              notice(
                "Listed",
                `@${showHandle(e)} is on the market for ${usd(o)} in ${a.name}. Buyers may show up in the coming years.`,
                null,
                !0,
              );
          },
        });
      }
      function listingTraffic(e) {
        const t = Math.max(1, acctWorth(e.k)),
          a = e.price / t,
          o = Math.pow(t, 0.75) * (0.5 + Math.random()),
          n = Math.round(o * Math.min(3, 1 / Math.max(0.3, a)) + rint(3, 40));
        (e.views += n),
          (e.up += Math.round(n * (0.02 + 0.06 * Math.random()) * (a < 1 ? 1.6 : a < 1.5 ? 1 : 0.5))),
          (e.down += Math.round(n * (0.004 + 0.02 * Math.random()) * (a > 2 ? 4 : a > 1.3 ? 2 : 1)));
      }
      function cancelListingCard(e) {
        const t = (state.myListings || []).find((t) => t.k === e);
        t &&
          ((t.views ??= 0),
          (t.up ??= 0),
          (t.down ??= 0),
          socSelCard({
            icon: `${socIcon(socBase(e))}`,
            title: `@${showHandle(e)}`,
            tag: "Market",
            lead: "Your listing on the Username Market.",
            rows: [
              ["Price", usd(t.price)],
              ["Listed", t.year],
              ["Views", fmtN(t.views)],
              ["Upvotes", `▲ ${fmtN(t.up)}`],
              ["Downvotes", `▼ ${fmtN(t.down)}`],
            ],
            btn: "Take it off the market",
            onGo: () => {
              (state.myListings = state.myListings.filter((e) => e !== t)),
                say(`I took @${showHandle(e)} off the Username Market.`),
                openNameMarket();
            },
          }));
      }
      function sellListing(e, t) {
        const a = window.INVEST && window.INVEST.coinInfo(e.coin);
        if (!a || !a.live) return !1;
        if (!window.INVEST.receiveCoin(e.coin, e.price)) return !1;
        const [, o] = socOf(e.k),
          n = showHandle(e.k);
        delete state.social[e.k],
          (state.myListings = state.myListings.filter((t) => t !== e)),
          say(
            `I sold my ${o} account @${n} on the Username Market for ${coinAmt(a, e.price)} (${usd(e.price)})${t ? " minutes after listing it" : ""}.`,
          );
        const s = () => {
          crimeSnd("ChaChing"),
            notice(
              t ? "Sold instantly!" : "Account sold",
              `${t ? `@${n} sold the moment you listed it. Someone jumped on that price.` : `A buyer bought @${n} on ${o}.`}<br><br>You were paid ${coinAmt(a, e.price)} (${usd(e.price)}). It's in your crypto now (Assets → Investments).`,
              null,
              !0,
            );
        };
        return t ? (openNameMarket(), s()) : queuePopup(s), !0;
      }
      function marketSellYear() {
        const e = state.myListings || [];
        if (e.length && window.INVEST)
          for (const t of [...e]) {
            if (!state.social[t.k]) {
              state.myListings = state.myListings.filter((e) => e !== t);
              continue;
            }
            (t.views ??= 0), (t.up ??= 0), (t.down ??= 0), listingTraffic(t);
            const e = t.price / Math.max(1, acctWorth(t.k)),
              a = Math.max(0.03, Math.min(0.85, 0.75 - 0.45 * (e - 1)));
            chance(a) && sellListing(t, !1);
          }
      }
      function marketBuyCard(e) {
        const [, t, a] = socOf(e.base),
          o = marketCoins(),
          n = o.map((e) => e.name).join(" or ") || "crypto",
          s = o.filter((t) => t.held >= e.price);
        if (!o.some((e) => e.held >= 1))
          return notice(
            "Crypto only",
            `The Username Market only takes ${n}. Buy some in Assets → Investments → Crypto first.`,
            null,
            !0,
          );
        if (!s.length)
          return notice(
            "Not enough crypto",
            `@${e.h} costs ${usd(e.price)}. You don't hold that much ${n}.`,
            null,
            !0,
          );
        const r = Object.keys(state.social).filter((t) => socBase(t) === e.base),
          i = e.verified ? [["new"]] : [...r.map((e) => ["acct", e]), ["new"]],
          l = s.flatMap((e) => i.map((t) => [e, t]));
        socSelCard({
          icon: `${socIcon(e.base)}`,
          title: `@${e.h}`,
          tag: "Market",
          lead: `Buy the ${t} username @${e.h} on the Username Market.`,
          rows: [
            ["Price", usd(e.price)],
            ["Rarity", valueWord(nameValue(e.h, e.base))],
            ...s.map((t) => [`In ${t.name}`, coinAmt(t, e.price)]),
            ...s
              .filter((e) => window.SIMSWAP && SIMSWAP.trail(e.id))
              .map((e) => [`${e.tick} traceability`, SIMSWAP.trail(e.id)]),
          ],
          label: "Pay with, and put it on:",
          opts: l.map(
            ([e, a]) => `${e.tick} → ${"new" === a[0] ? `a new ${t} account` : `@${handleOf(a[1])}`}`,
          ),
          btn: "Buy it",
          onGo: (a) => {
            const [o, n] = l[a],
              s = window.INVEST.spendCoin(o.id, e.price);
            if (s + 1 < e.price)
              return notice("Not enough crypto", `You don't hold enough ${o.name} anymore.`, null, !0);
            const r = state.nameMarket;
            (r.plats[e.base] = (r.plats[e.base] || []).filter((t) => t !== e)),
              ((state.socialNPC ||= {})[`${e.base}:${e.h}`] = null);
            let i = n[1],
              c = null;
            if ("new" === n[0]) {
              let t = 2;
              if (((i = e.base), state.social[i])) {
                for (; state.social[`${e.base}~${t}`]; ) t++;
                i = `${e.base}~${t}`;
              }
              (state.social[i] = {
                subs: e.subs || 0,
                fake: 0,
                posts: e.verified ? rint(200, 4e3) : 0,
                views: (e.subs || 0) * rint(5, 30),
                years: 0,
                momentum: e.celeb ? 5 : 0,
                postsYear: 0,
                viewsYear: 0,
                monet: !1,
                verified: !!e.verified,
                banned: !1,
                appealAt: 0,
                buysYear: 0,
                botYears: [],
                handle: e.h,
                bought: !0,
                ...(e.celeb
                  ? { stolen: { name: e.celeb.name, big: e.celeb.big, age: state.age, price: e.price } }
                  : {}),
              }),
                linkEmail(i, ((state.emails || []).find((e) => !e.hacked) || {}).addr);
            } else (c = handleOf(i)), (state.social[i].handle = e.h);
            const d = window.SIMSWAP ? SIMSWAP.spent(o.id, s, { k: i, h: e.h, n: t, celeb: !!e.celeb }) : 0;
            renderStats(),
              e.verified && socialStarCheck(),
              say(
                e.celeb
                  ? `I bought ${e.celeb.name}'s ${t} account @${e.h} on the Username Market for ${coinAmt(o, e.price)} (${usd(e.price)}).`
                  : `I bought the ${e.verified ? "verified " : ""}${t} ${e.verified ? "account" : "username"} @${e.h} on the Username Market for ${coinAmt(o, e.price)} (${usd(e.price)}).`,
              ),
              openSocialAccount(i),
              screen.classList.add("open"),
              "new" === n[0] && askPw(i, t),
              notice(
                "Yours now",
                e.celeb
                  ? `You paid ${coinAmt(o, e.price)} for ${e.celeb.name}'s verified ${t} account, @${e.h}, with ${fmtN(e.subs)} followers.<br><br>${e.celeb.name}'s team will be looking for it.`
                  : `You paid ${coinAmt(o, e.price)} for @${e.h}.${c ? ` Your account @${c} is now @${e.h}.` : ` It's on a new ${t} account${e.verified ? ", blue check and all" : ""}.`}` +
                      (d
                        ? `<br><br>Some of that ${o.name} came from your SIM swap. Investigators can follow it to @${e.h}, and then to whatever email it's on.`
                        : ""),
                null,
                !0,
              );
          },
        });
      }
      const DC_BADGE = {
          staff: "Discord Staff",
          partner: "Partnered Server Owner",
          bravery: "HypeSquad Bravery",
          brilliance: "HypeSquad Brilliance",
          balance: "HypeSquad Balance",
          bughunter: "Bug Hunter",
          bughunter2: "Gold Bug Hunter",
          early: "Early Supporter",
          earlybot: "Early Verified Bot Developer",
          activedev: "Active Developer",
          modalumni: "Moderator Programs Alumni",
          nitro: "Nitro",
          legacy: "Originally known as",
          quest: "Completed a Quest",
          orbs: "Orbs Apprentice",
        },
        NITRO_TIERS = [
          [72, "opal", "Opal"],
          [60, "ruby", "Ruby"],
          [36, "emerald", "Emerald"],
          [24, "diamond", "Diamond"],
          [12, "platinum", "Platinum"],
          [6, "gold", "Gold"],
          [3, "silver", "Silver"],
          [1, "bronze", "Bronze"],
        ],
        DC_WIN = { earlybot: 2020, bug: [2016, 2023], mod: [2019, 2022] },
        BOOST_TIERS = [24, 18, 15, 12, 9, 6, 3, 2, 1],
        DC_PRICE = { nitro: 100, boost: 60 },
        dcOf = (e) =>
          (state.social[e].dc ||= {
            nitroMonths: 0,
            nitroOn: !1,
            boostMonths: 0,
            boostOn: !1,
            firstNitro: 0,
            quests: 0,
          }),
        dcStaff = () => !(!state.job || "Discord" !== state.job.emp);
      function dcBadges(e) {
        const t = state.social[e],
          a = dcOf(e),
          o = socYear(),
          n = [];
        if (
          (dcStaff() && n.push(["staff", DC_BADGE.staff]),
          a.partner && n.push(["partner", DC_BADGE.partner]),
          a.house && n.push([a.house, DC_BADGE[a.house]]),
          a.bugs >= 2
            ? n.push(["bughunter2", DC_BADGE.bughunter2])
            : a.bugs && n.push(["bughunter", DC_BADGE.bughunter]),
          a.firstNitro && a.firstNitro <= 2018 && n.push(["early", DC_BADGE.early]),
          a.botVerified && a.botVerified <= DC_WIN.earlybot && n.push(["earlybot", DC_BADGE.earlybot]),
          a.bot && o >= 2022 && n.push(["activedev", DC_BADGE.activedev]),
          a.modAlumni && n.push(["modalumni", DC_BADGE.modalumni]),
          a.nitroOn)
        ) {
          const e = NITRO_TIERS.find(([e]) => a.nitroMonths >= e);
          n.push(
            o >= 2025 && e
              ? [`nitro-${e[1]}`, `Nitro ${e[2]} (${a.nitroMonths} months)`]
              : ["nitro", `Nitro (${a.nitroMonths} months)`],
          );
        }
        if (a.boostOn) {
          const e = BOOST_TIERS.find((e) => a.boostMonths >= e);
          e && n.push([`boost-${e}`, `Server Booster (${a.boostMonths} months)`]);
        }
        return (
          o >= 2023 && socYear() - (t.years || 0) < 2023 && n.push(["legacy", DC_BADGE.legacy]),
          a.quests && n.push(["quest", DC_BADGE.quest]),
          a.quests >= 3 && o >= 2025 && n.push(["orbs", DC_BADGE.orbs]),
          n
        );
      }
      const DC_BADGE_WORTH = {
          early: 1500,
          earlybot: 4e3,
          bughunter: 3e3,
          bughunter2: 8e3,
          modalumni: 800,
          partner: 5e3,
          legacy: 400,
          activedev: 200,
          bravery: 50,
          brilliance: 50,
          balance: 50,
          quest: 30,
          orbs: 60,
          "nitro-opal": 450,
          "nitro-ruby": 320,
          "nitro-emerald": 240,
          "nitro-diamond": 170,
          "boost-24": 140,
          "boost-18": 90,
        },
        dcWorth = (e) =>
          Math.round(
            localPrice(
              nameValue(handleOf(e), "discord") +
                dcBadges(e).reduce((e, [t]) => e + (DC_BADGE_WORTH[t] || 0), 0) * Math.max(0.3, dcYearMult()),
            ),
          ),
        svgUri = (e) =>
          `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${e}</svg>`)}`,
        ROBUX_ICONS = [
          [2007, "social/roblox/robux-2007.png"],
          [2008, "social/roblox/robux-2008.png"],
          [2014, "social/roblox/robux-2014.png"],
          [2017, "social/roblox/robux-2017.png"],
          [
            2019,
            svgUri(
              '<polygon points="32,5 55,18.5 55,45.5 32,59 9,45.5 9,18.5" fill="none" stroke="#ececec" stroke-width="7" stroke-linejoin="miter"/><rect x="24" y="24" width="16" height="16" fill="#ececec"/>',
            ),
          ],
          [2022, "social/roblox/robux.png"],
        ],
        eraIcon = (e, t) => ([...e].reverse().find(([e]) => t >= e) || e[0])[1],
        robuxIcon = () => eraIcon(ROBUX_ICONS, socYear()),
        tixIcon = () => "social/roblox/tix.png",
        ROBUX_YEAR = 2007,
        TIX_YEARS = [2007, 2015],
        RBX_CLUB_END = 2018,
        RBX_CLUB = [
          ["Builders Club", 2007, 15],
          ["Turbo Builders Club", 2008, 35],
          ["Outrageous Builders Club", 2008, 60],
        ],
        RBX_PREM = [
          ["Premium 450", 59.88, 450],
          ["Premium 1000", 119.88, 1e3],
          ["Premium 2200", 239.88, 2200],
        ],
        BC_PRICE = {
          month: [5.95, 11.95, 19.95],
          "6mo": [29.95, 44.95, 69.95],
          year: [57.95, 85.95, 129.95],
          life: [199.95, 299.95, 349.95],
        },
        BC_PLAN = { month: "Monthly", "6mo": "6 Months", year: "12 Months", life: "Lifetime" },
        bcPlanName = (e) => (socYear() > 2013 && "year" === e ? "Annually" : BC_PLAN[e] || "12 Months"),
        bcRenewCost = (e, t) => ("month" === t ? 12 * BC_PRICE.month[e] : BC_PRICE.year[e]),
        RBX_PACKS = [
          [400, 4.99],
          [800, 9.99],
          [1700, 19.99],
          [4500, 49.99],
          [1e4, 99.99],
        ],
        RBX_TIER = ["bc", "tbc", "obc"],
        rbxClubIcon = (e = 0) =>
          socYear() >= RBX_CLUB_END
            ? "social/roblox/premium.png"
            : `social/roblox/${RBX_TIER[e ?? 0] || "bc"}.png`,
        RBX_HATS = [
          "Builders Club Hard Hat",
          "Turbo Builders Club Hard Hat",
          "Outrageous Builders Club Hard Hat",
        ];
      function rbxGiveHat(e, t) {
        const a = `hat-${RBX_TIER[t]}`;
        (e.inv ||= []),
          e.inv.some((e) => e.id === a) || e.inv.push({ id: a, name: RBX_HATS[t], y: socYear() });
      }
      function openRobloxInventory(e) {
        const t = rbxOf(e);
        (sTitle.textContent = "INVENTORY"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => openSocialAccount(e)),
          (sList.innerHTML =
            '<div class="sec">Hats</div>' +
            (t.inv || [])
              .map(
                (e) =>
                  `<div class="row"><img src="social/roblox/${e.id}.png"><div class="t"><b>${e.name}</b><span>Got it in ${e.y}</span></div></div>`,
              )
              .join("")),
          (sList.scrollTop = 0);
      }
      const rbxOf = (e) => (state.social[e].rbx ||= { robux: 0, tix: 0, club: null, prem: null }),
        tixEra = () => socYear() >= TIX_YEARS[0] && socYear() <= TIX_YEARS[1],
        tixRate = () =>
          state.rbxRate && state.rbxRate.y === socYear()
            ? state.rbxRate.r
            : (state.rbxRate = { y: socYear(), r: rint(10, 20) }).r;
      function robloxRows(e) {
        const t = rbxOf(e),
          a = socYear(),
          o = (e, t, a, o, n) =>
            `<div class="row sm${n ? " dis" : ""}" ${n ? "" : `data-rb="${e}"`}><img src="${t}"><div class="t"><b>${a}</b><span>${o}</span></div>${n ? "" : DOTS}</div>`,
          n =
            null != t.club
              ? `${RBX_CLUB[t.club][0]} (${bcPlanName(t.plan)})`
              : null != t.prem
                ? `Roblox ${RBX_PREM[t.prem][0]}${t.premLife ? " (Lifetime)" : ""}`
                : "",
          s = rbxClubIcon(t.club),
          r = (t.inv || []).length;
        return (
          '<div class="sec">Wallet</div>' +
          (a < ROBUX_YEAR
            ? o("robux", robuxIcon(), "Robux", `Coming in ${ROBUX_YEAR}`, !0)
            : o("robux", robuxIcon(), `R$ ${fmtN(t.robux)}`, "Robux · buy more")) +
          (tixEra()
            ? o("tix", tixIcon(), `${fmtN(t.tix)} Tix`, `Trade Tix for Robux (${tixRate()} Tix = R$ 1)`)
            : "") +
          (a < RBX_CLUB[0][1]
            ? o("club", s, "Builders Club", `Coming in ${RBX_CLUB[0][1]}`, !0)
            : o(
                "club",
                s,
                a >= RBX_CLUB_END ? "Roblox Premium" : "Builders Club",
                n ? `Member · ${n}` : a >= RBX_CLUB_END ? "Subscribe to Premium" : "Join Builders Club",
              )) +
          (r
            ? o(
                "inv",
                `social/roblox/${t.inv[t.inv.length - 1].id}.png`,
                "Inventory",
                `${r} item${r > 1 ? "s" : ""}`,
              )
            : "")
        );
      }
      function robloxAction(e, t, a) {
        const o = rbxOf(e),
          n = socYear();
        if ("inv" === t) return openRobloxInventory(e);
        if ("robux" === t)
          return socSelCard({
            icon: robuxIcon(),
            title: "Buy Robux",
            tag: "Roblox",
            lead: `You have R$ ${fmtN(o.robux)}.<br><br>Buy more Robux today!`,
            label: "Pick a pack:",
            opts: RBX_PACKS.map(([e, t]) => `R$ ${fmtN(e)} (${usd(localPrice(t))})`),
            btn: "Buy Robux",
            onGo: (e) => {
              const [t, n] = RBX_PACKS[e],
                s = localPrice(n);
              if (state.money < s)
                return notice("Not enough", `You need ${usd(s)} for R$ ${fmtN(t)}.`, null, !0);
              (state.money -= s),
                (o.robux += t),
                renderStats(),
                say(`I bought R$ ${fmtN(t)} on Roblox for ${usd(s)}.`),
                notice("Robux!", `You bought R$ ${fmtN(t)}. You now have R$ ${fmtN(o.robux)}.`, a, !0);
            },
          });
        if ("tix" === t) {
          const e = tixRate(),
            t = Math.floor(o.tix / e);
          return socSelCard({
            icon: tixIcon(),
            title: "Trade Currency",
            tag: "Roblox",
            lead: `You have ${fmtN(o.tix)} Tix. This year's rate is ${e} Tix for R$ 1.`,
            rows: [["You get", `R$ ${fmtN(t)}`]],
            btn: "Trade all my Tix",
            onGo: () => {
              if (!t) return notice("Not enough Tix", `You need at least ${e} Tix to get R$ 1.`, null, !0);
              (o.tix -= t * e),
                (o.robux += t),
                say(`I traded my Tix for R$ ${fmtN(t)} on Roblox.`),
                notice("Traded", `You traded ${fmtN(t * e)} Tix for R$ ${fmtN(t)}.`, a, !0);
            },
          });
        }
        if ("club" === t && n < RBX_CLUB_END) return openBuildersClub(e);
        if ("club" === t) {
          const e = o.prem,
            t = null != e,
            n = (e) => `Roblox ${RBX_PREM[e][0]}`,
            s = (e) => localPrice(RBX_PREM[e][1]),
            r = (e) => `R$ ${fmtN(RBX_PREM[e][2])} a month`;
          return t && o.premLife
            ? notice(
                "Lifetime",
                `You're a ${n(e)} member for life (${r(e)}), carried over from your Lifetime Builders Club.`,
                null,
                !0,
              )
            : socSelCard(
                t
                  ? {
                      icon: rbxClubIcon(e),
                      title: "Premium",
                      tag: "Roblox",
                      lead: `You're a ${n(e)} member (${r(e)}). It renews every year for ${usd(s(e))}.`,
                      btn: "Cancel membership",
                      onGo: () => {
                        (o.prem = null),
                          say(`I canceled my ${n(e)} membership.`),
                          notice("Canceled", `You're no longer a ${n(e)} member.`, a, !0);
                      },
                    }
                  : {
                      icon: rbxClubIcon(),
                      title: "Premium",
                      tag: "Roblox",
                      lead: "Subscribe to Roblox Premium and get Robux every month.",
                      label: "Pick a membership:",
                      opts: RBX_PREM.map((e, t) => `${n(t)}: ${r(t)} (${usd(s(t))}/yr)`),
                      btn: "Join",
                      onGo: (e) => {
                        if (state.money < s(e))
                          return notice("Not enough", `You need ${usd(s(e))}.`, null, !0);
                        const t = 12 * RBX_PREM[e][2];
                        (state.money -= s(e)),
                          (o.robux += t),
                          (o.prem = e),
                          (o.premLife = !1),
                          rbxGiveHat(o, e),
                          renderStats(),
                          say(`I joined ${n(e)} on Roblox and got the ${RBX_HATS[e]}.`),
                          notice(
                            "Welcome!",
                            `You're now a ${n(e)} member. You got R$ ${fmtN(t)} this year, and the ${RBX_HATS[e]} is in your inventory.`,
                            a,
                            !0,
                          );
                      },
                    },
              );
        }
      }
      const BCW_CSS =
        "<style>\n    .bcw{background:#fff;color:#333;font-family:Verdana,Arial,sans-serif;padding:12px 10px 18px;min-height:100%;box-sizing:border-box}\n    .bcw img{display:block}\n    .bcw-mem{background:#fff8d6;border:1px solid #e3c75a;color:#5a4a00;font-size:12px;padding:8px 10px;margin-bottom:10px;line-height:1.45}\n    .bcw-mem a{color:#0b5cad;text-decoration:underline;cursor:pointer}\n    .bcw-banner{width:100%;height:auto;margin:0 auto 10px}\n    .bcw-box{border:1px solid #c9c9c9;background:linear-gradient(#ececec,#fff 120px);padding:8px 6px 10px}\n    .bcw-h{font-family:'Trebuchet MS',Arial,sans-serif;font-style:italic;font-size:16px;color:#7a9ccb;margin:6px 2px 4px;letter-spacing:-.3px}\n    .bcw-h .tb{color:#8a9a1e}\n    .bcw-tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-bottom:6px}\n    .bcw-tiles img{width:100%;height:auto;cursor:pointer;border-radius:5px}\n    .bcw-tiles img:active{transform:scale(.97)}\n    .bcw-tiles img.cur,.bcw14 .bcw-btn.cur{outline:3px solid #ffd400;outline-offset:1px}\n    .bcw13 table{width:100%;border-collapse:collapse;margin-top:12px;font-size:10.5px;color:#2e5c9a;table-layout:fixed}\n    .bcw13 th{font-weight:normal;font-size:11px;color:#2b5ea7;padding:8px 2px;border-left:1px solid #d4d4d4;vertical-align:bottom}\n    .bcw13 td{padding:7px 2px;text-align:center;border-left:1px solid #d4d4d4;line-height:1.3}\n    .bcw13 tr:nth-child(even) td{background:#e8eefb}\n    .bcw13 td.lab{text-align:left;border-left:none}\n    .bcw13 td.lab div{display:flex;align-items:center;gap:5px}\n    .bcw13 td.lab img{width:22px;height:22px;object-fit:contain;flex:none}\n    .bcw13 td img.vh{width:26px;height:22px;object-fit:contain;margin:0 auto}\n    .bcw-foot{font-size:10px;color:#222;margin-top:10px;line-height:1.7}\n    .bcw-foot a{color:#0b5cad}\n    .bcw14{font-family:'Source Sans Pro','Segoe UI',Arial,sans-serif}\n    .bcw14 .bcw-t{font-size:22px;font-weight:600;color:#333;margin:2px 0 14px}\n    .bcw14 .g{display:grid;grid-template-columns:1.25fr repeat(4,1fr);align-items:center}\n    .bcw14 .nm{text-align:center;font-size:17px;font-weight:300;color:#333}\n    .bcw14 .ci img{width:58px;height:58px;margin:6px auto 12px}\n    .bcw14 .r>div{font-size:11px;padding:5px 2px;border-bottom:1px solid #ddd;text-align:center;font-weight:600;color:#222}\n    .bcw14 .r>div:first-child{text-align:left;font-weight:600}\n    .bcw14 .no{color:#d0021b}.bcw14 .gr{color:#24a624}\n    .bcw14 .note{text-align:center;font-size:10.5px;font-weight:600;margin:6px 0 18px}\n    .bcw14 .pr{display:grid;grid-template-columns:1.25fr repeat(3,1fr)}\n    .bcw14 .pr>div{border-left:1px solid #ddd;text-align:center;padding:4px 2px 8px}\n    .bcw14 .pr>div:first-child{border-left:none;display:flex;flex-direction:column;justify-content:space-around}\n    .bcw14 .pr>div:first-child hr{border:none;border-top:1px solid #ccc;width:80%;margin:28px 0 0}\n    .bcw14 .pl{font-size:12px;color:#333;margin:10px 0 6px}\n    .bcw-btn{display:inline-block;min-width:70%;padding:6px 4px;color:#fff;font-size:14px;font-weight:600;cursor:pointer;\n      background:linear-gradient(#3cb73c,#0d8a12);border:1px solid #0a6b0d;box-shadow:inset 0 1px 0 rgba(255,255,255,.35)}\n    .bcw-btn:active{background:linear-gradient(#0d8a12,#3cb73c)}\n  </style>";
      function bcPage2013(e, t) {
        const a = ["bc", "tbc", "obc"],
          o = (e) => t.map(() => e),
          n = (e, t, a, o) =>
            `<tr><td class="lab"><div><img src="social/roblox/bc2013/i-${e}.png" alt="">${t}</div></td><td>${a}</td>${o.map((e) => `<td>${e}</td>`).join("")}</tr>`,
          s = (e) => t.map((t) => e[t]);
        return `<img class="bcw-banner" src="social/roblox/bc2013/banner.png" alt="Get More with Builders Club">\n      <div class="bcw-box">${t.map((t) => `<div class="bcw-h">${((e) => (0 === e ? "Builders Club" : `<span class="tb">${1 === e ? "Turbo" : "Outrageous"}</span> Builders Club`))(t)}</div><div class="bcw-tiles">` + ["month", "6mo", "year", "life"].map((o) => `<img class="${((t, a) => (e.club === t && (e.plan || "year") === a ? " cur" : ""))(t, o).trim()}" data-bc="${t}:${o}" src="social/roblox/bc2013/${a[t]}-${o}.png" alt="${BC_PLAN[o]}">`).join("") + "</div>").join("")}\n      <table><thead><tr><th style="border-left:none;width:28%">Benefits</th><th>Free Account</th>${t.map((e) => `<th>${RBX_CLUB[e][0]}</th>`).join("")}</tr></thead><tbody>\n        ${n("places", "Active Places", "1", s(["10", "25", "100"]))}\n        ${n("robux", "Daily ROBUX", "None", s(["15 R$", "35 R$", "60 R$"]))}\n        ${n("sell", "Sell Stuff", "No", o("Yes"))}\n        ${n("ads", "See Ads", "Yes", o("No"))}\n        ${n(
          "hat",
          "Virtual Hat",
          "None",
          t.map((e) => `<img class="vh" src="social/roblox/bc2013/vhat-${a[e]}.png" alt="">`),
        )}\n        ${n("gear", "Bonus Gear Item", "No", s(["No", "Yes", "Yes"]))}\n        ${n("bonus", "Signing Bonus", "None", o("100 R$ for initial purchase"))}\n        ${n("groups", "Create Groups", "No", s(["Yes (10)", "Yes (20)", "Yes (100)"]))}\n        ${n("join", "Join Groups", "Yes (5)", s(["Yes (10)", "Yes (20)", "Yes (100)"]))}\n        ${n("badges", "Create Badges", "No", o("Yes"))}\n        ${n("beta", "BC Beta Features", "No", o("Yes"))}\n        ${n("servers", "Personal Servers", "No", o("Yes"))}\n        ${n("trade", "Trade System", "No", o("Yes"))}\n      </tbody></table>\n      <div class="bcw-foot">For more information, read our <a>Builders Club FAQs</a>.<br>All items and gear are virtual.<br>All Sales are final. Please see our <a>Terms &amp; Conditions</a> for more information.</div></div>`;
      }
      function bcPage2014(e) {
        const t = '<span class="no">No</span>',
          a = (e, ...t) =>
            `<div class="g r"><div>${e}</div>${t.map((e) => `<div>${e}</div>`).join("")}</div>`,
          o = (t, a) =>
            `<div class="pl">${"month" === a ? "Monthly" : "Annually"}</div><div class="bcw-btn${((t, a) => (e.club === t && (e.plan || "year") === a ? " cur" : ""))(t, a)}" data-bc="${t}:${a}">$${BC_PRICE[a][t].toFixed(2)}</div>`;
        return `<div class="bcw-t">Upgrade to ROBLOX Builders Club</div>\n      <div class="g"><div></div>${["Free", "Classic", "Turbo", "Outrageous"].map((e) => `<div class="nm">${e}</div>`).join("")}</div>\n      <div class="g ci"><div></div>${["free", "classic", "turbo", "outrageous"].map((e) => `<div><img src="social/roblox/bc2014/${e}.png" alt=""></div>`).join("")}</div>\n      ${a("Daily ROBUX", t, "R$15", '<span class="gr">R$35</span>', '<span class="gr">R$60</span>')}\n      ${a("Join Groups", "5", "10", "20", "100!")}\n      ${a("Create Groups", t, "10", "20", "100!")}\n      ${a("Signing Bonus*", t, "R$100", "R$100", "R$100")}\n      ${a("Paid Access", '<span class="no">10%</span>', "70%", "70%", "70%")}\n      <div class="note">* Signing bonus is for first time membership purchase only.</div>\n      <div class="pr"><div><hr><hr></div>${[0, 1, 2].map((e) => `<div>${o(e, "month")}${o(e, "year")}</div>`).join("")}</div>`;
      }
      function openBuildersClub(e) {
        const t = rbxOf(e),
          a = socYear(),
          o = [0, 1, 2].filter((e) => a >= RBX_CLUB[e][1]),
          n = t.plan || "year";
        (sTitle.textContent = "BUILDERS CLUB"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = () => openSocialAccount(e));
        const s = null != t.club && !t.cancel && ("month" === n || "year" === n),
          r =
            null == t.club
              ? ""
              : `<div class="bcw-mem">You are a <b>${RBX_CLUB[t.club][0]}</b> member (${bcPlanName(n)}). ` +
                ("life" === n
                  ? "Your membership never expires."
                  : "6mo" === n || t.cancel
                    ? "It ends at your next birthday."
                    : `It renews at your next birthday for ${usd(localPrice(bcRenewCost(t.club, n)))}.`) +
                (s ? " <a data-bccancel>Cancel renewal</a>" : "") +
                "</div>";
        (sList.innerHTML =
          BCW_CSS +
          `<div class="bcw ${a <= 2013 ? "bcw13" : "bcw14"}">${r}${a <= 2013 ? bcPage2013(t, o) : bcPage2014(t)}</div>`),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-bc]").forEach(
            (t) =>
              (t.onclick = () => {
                const [a, o] = t.dataset.bc.split(":");
                play("choice"), bcBuy(e, +a, o);
              }),
          );
        const i = sList.querySelector("[data-bccancel]");
        i &&
          (i.onclick = () => {
            (t.cancel = !0),
              say(`I turned off renewal for my ${RBX_CLUB[t.club][0]} membership.`),
              notice(
                "Canceled",
                `Your ${RBX_CLUB[t.club][0]} won't renew. It ends at your next birthday.`,
                () => openBuildersClub(e),
                !0,
              );
          });
      }
      function bcBuy(e, t, a) {
        const o = rbxOf(e),
          n = RBX_CLUB[t][0],
          s = bcPlanName(a),
          r = localPrice(BC_PRICE[a][t]),
          i = () => openBuildersClub(e);
        return o.club === t && (o.plan || "year") === a
          ? notice("Already a member", `You already have ${n} (${s}).`, null, !0)
          : null != o.club && "life" === o.plan && t <= o.club
            ? notice(
                "Lifetime member",
                `You already have Lifetime ${RBX_CLUB[o.club][0]}. It never expires.`,
                null,
                !0,
              )
            : void jCard({
                tag: "Roblox",
                iconSrc: rbxClubIcon(t),
                title: n,
                close: !0,
                lead: `Buy ${n} (${s}) for ${usd(r)}?${null != o.club ? `<br><br>This replaces your ${RBX_CLUB[o.club][0]} (${bcPlanName(o.plan || "year")}). Memberships are not refundable.` : ""}`,
                choices: [
                  [
                    `Pay ${usd(r)}`,
                    () => {
                      if (state.money < r)
                        return notice("Not enough", `You need ${usd(r)} for ${n} (${s}).`, null, !0);
                      const e = "6mo" === a ? 182 : 365,
                        l = o.bcBonus ? 0 : 100,
                        c = RBX_CLUB[t][2] * e + l;
                      (state.money -= r),
                        (o.club = t),
                        (o.plan = a),
                        (o.cancel = !1),
                        (o.bcBonus = !0),
                        (o.robux += c),
                        rbxGiveHat(o, t),
                        renderStats(),
                        say(`I bought ${n} (${s}) on Roblox for ${usd(r)} and got the ${RBX_HATS[t]}.`),
                        notice(
                          "Welcome to Builders Club!",
                          `You're now a ${n} member (${s}).<br><br>You got R$ ${fmtN(c)}${l ? " (including the R$ 100 signing bonus)" : ""}, and the ${RBX_HATS[t]} is in your inventory.`,
                          i,
                          !0,
                        );
                    },
                  ],
                  ["Cancel", () => {}],
                ],
              });
      }
      const SUBS = {
          netflix: {
            name: "Netflix",
            share: 2023,
            plans: [
              [1997, "rent", "DVD Rentals", 15.95, 1, 0],
              [1999, "dvd", "Unlimited DVDs (3 at a time)", 19.95, 1, 0],
              [2007, "both", "Unlimited DVDs + Watch Instantly", 16.99, 1, 1],
              [2011, "stream", "Streaming Plan", 7.99, 0, 1],
              [2014, "std", "Standard Plan", 8.99, 0, 1],
              [2015, "std", "Standard Plan", 9.99, 0, 1],
              [2017, "std", "Standard Plan", 10.99, 0, 1],
              [2019, "std", "Standard Plan", 12.99, 0, 1],
              [2020, "std", "Standard Plan", 13.99, 0, 1],
              [2022, "std", "Standard Plan", 15.49, 0, 1],
              [2025, "std", "Standard Plan", 17.99, 0, 1],
            ],
            titles: [
              [1997, "Titanic"],
              [1999, "The Matrix"],
              [2e3, "Gladiator"],
              [2001, "Shrek"],
              [2001, "Harry Potter and the Sorcerer's Stone"],
              [2002, "Spider-Man"],
              [2003, "Finding Nemo"],
              [2003, "The Return of the King"],
              [2004, "The Incredibles"],
              [2005, "Batman Begins"],
              [2006, "Pirates of the Caribbean"],
              [2007, "Transformers"],
              [2008, "The Dark Knight"],
              [2009, "Avatar"],
              [2010, "Inception"],
              [2010, "Breaking Bad"],
              [2011, "The Office"],
              [2012, "The Avengers"],
              [2013, "Frozen"],
              [2013, "House of Cards"],
              [2013, "Orange Is the New Black"],
              [2015, "Narcos"],
              [2016, "Stranger Things"],
              [2016, "The Crown"],
              [2016, "Black Mirror"],
              [2017, "Ozark"],
              [2017, "Money Heist"],
              [2020, "Tiger King"],
              [2020, "Bridgerton"],
              [2020, "The Queen's Gambit"],
              [2021, "Squid Game"],
              [2022, "Wednesday"],
              [2023, "Beef"],
              [2025, "Adolescence"],
              [2025, "KPop Demon Hunters"],
            ],
          },
          hulu: {
            name: "Hulu",
            plans: [
              [2007, "free", "Hulu (free with ads)", 0, 0, 1],
              [2010, "plus", "Hulu Plus", 7.99, 0, 1],
              [2015, "ads", "Hulu (With Ads)", 7.99, 0, 1],
              [2019, "ads", "Hulu (With Ads)", 5.99, 0, 1],
              [2022, "ads", "Hulu (With Ads)", 7.99, 0, 1],
              [2024, "ads", "Hulu (With Ads)", 9.99, 0, 1],
              [2025, "ads", "Hulu (With Ads)", 11.99, 0, 1],
            ],
            titles: [
              [2005, "The Office"],
              [2006, "30 Rock"],
              [1999, "Family Guy"],
              [2007, "Saturday Night Live"],
              [2009, "Glee"],
              [2009, "Modern Family"],
              [2011, "New Girl"],
              [2013, "Brooklyn Nine-Nine"],
              [2017, "The Handmaid's Tale"],
              [2020, "Normal People"],
              [2021, "Only Murders in the Building"],
              [2022, "The Bear"],
              [2023, "Futurama"],
              [2024, "Shogun"],
              [2025, "Paradise"],
            ],
          },
          disneyplus: {
            name: "Disney+",
            plans: [
              [2019, "std", "Disney+", 6.99, 0, 1],
              [2021, "std", "Disney+", 7.99, 0, 1],
              [2022, "prem", "Disney+ Premium", 10.99, 0, 1],
              [2023, "prem", "Disney+ Premium", 13.99, 0, 1],
              [2025, "prem", "Disney+ Premium", 15.99, 0, 1],
            ],
            titles: [
              [1994, "The Lion King"],
              [2013, "Frozen"],
              [2016, "Moana"],
              [2017, "Coco"],
              [2018, "Avengers: Infinity War"],
              [2019, "The Mandalorian"],
              [2019, "Toy Story 4"],
              [2020, "Hamilton"],
              [2021, "WandaVision"],
              [2021, "Loki"],
              [2021, "Encanto"],
              [2022, "Andor"],
              [2023, "Ahsoka"],
              [2024, "Inside Out 2"],
              [2025, "Daredevil: Born Again"],
            ],
          },
        },
        subPlan = (e) => {
          const t = SUBS[e].plans,
            a = [...t].reverse().find((e) => socYear() >= e[0]) || t[0];
          return { id: a[1], name: a[2], price: a[3], dvd: !!a[4], stream: !!a[5] };
        },
        subTitle = (e) => {
          const t = socYear(),
            a = SUBS[e].titles.filter((e) => e[0] <= t),
            o = a.filter((e) => e[0] >= t - 2);
          return pickR(o.length && chance(0.6) ? o : a.length ? a : SUBS[e].titles)[1];
        },
        subOf = (e) => (state.social[e].nf ||= { on: !1 }),
        subPrice = (e) => (e.price ? `${usd(localPrice(e.price))}/mo` : "Free"),
        subStatus = (e) =>
          subOf(e).on ? `${subPlan(socBase(e)).name} · ${subPrice(subPlan(socBase(e)))}` : "Not subscribed";
      function openSub(e) {
        const t = socBase(e),
          a = SUBS[t].name,
          o = state.social[e],
          n = subOf(e),
          s = subPlan(t),
          r = socIcon(t);
        (sTitle.textContent = a.toUpperCase()),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openSocial);
        const i = (e, t, a, o, n) =>
          `<div class="row sm${n ? " dis" : ""}" ${n ? "" : `data-nf="${e}"`}><img src="${t}"><div class="t"><b>${a}</b><span>${o}</span></div>${n ? "" : DOTS}</div>`;
        var l;
        (sList.innerHTML =
          `<div class="row"><img src="${r}"><div class="t"><b>${a}</b><span>${o.email || "Your account"}${n.since ? ` · member since ${n.since}` : ""}</span></div></div><div class="sec">Membership</div>` +
          i(
            "plan",
            r,
            n.on ? s.name : "Not subscribed",
            n.on
              ? `${subPrice(s)}${s.price ? " · renews at your birthday" : ""}`
              : `Restart ${s.name} (${subPrice(s)})`,
          ) +
          i(
            "watch",
            "emoji/1f37f.png",
            s.stream ? "Watch Something" : "Rent a DVD",
            n.on ? (s.stream ? "Stream a movie or show" : "Get a DVD in the mail") : "Subscribe first",
            !n.on,
          ) +
          '<div class="sec">Activities</div>' +
          i(
            "password",
            "emoji/1f512.png",
            "Password",
            (l = pwUses(pwOf(e)).length) > 1
              ? `Used on ${l - 1} other account${l > 2 ? "s" : ""}`
              : "Change your password",
          ) +
          i("delete", socIcon("delete"), "Delete", "Delete your account")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-nf]").forEach(
            (i) =>
              (i.onclick = () => {
                play("choice");
                const l = i.dataset.nf,
                  c = () => openSub(e);
                if ("password" === l)
                  return pwCard(
                    a,
                    (t) => {
                      setPw(e, t),
                        say(`I changed my ${a} password.`),
                        notice("Password changed", `Your ${a} password is updated.`, c, !0);
                    },
                    pwOf(e),
                    e,
                  );
                if ("plan" === l)
                  return n.on
                    ? socSelCard({
                        icon: r,
                        title: "Membership",
                        tag: a,
                        lead: `You're on ${s.name} (${subPrice(s)}).`,
                        btn: "Cancel membership",
                        onGo: () => {
                          (n.on = !1),
                            say(`I canceled my ${a} membership.`),
                            o.email &&
                              mailTo(
                                o.email,
                                a,
                                "Your membership is canceled",
                                "We're sorry to see you go. You can restart your membership any time.",
                                null,
                                !0,
                              ),
                            notice("Canceled", `Your ${a} membership is canceled.`, c, !0);
                        },
                      })
                    : socSelCard({
                        icon: r,
                        title: "Membership",
                        tag: a,
                        lead: `Restart ${s.name} (${subPrice(s)}).${s.price ? " You pay for the year now." : ""}`,
                        btn: "Restart membership",
                        onGo: () => {
                          const e = 12 * localPrice(s.price);
                          if (state.money < e)
                            return notice("Not enough", `You need ${usd(e)} for a year of ${a}.`, null, !0);
                          (state.money -= e),
                            (n.on = !0),
                            (n.since ||= socYear()),
                            (n.price = s.price),
                            renderStats(),
                            say(`I restarted my ${a} membership.`),
                            o.email &&
                              mailTo(
                                o.email,
                                a,
                                "Welcome back!",
                                `Your ${s.name} membership is active again. Enjoy!`,
                                null,
                                !0,
                              ),
                            notice(
                              "Welcome back",
                              `Your ${a} membership is active again${e ? ` (${usd(e)} for the year)` : ""}.`,
                              c,
                              !0,
                            );
                        },
                      });
                if ("watch" === l) {
                  const e = subTitle(t),
                    o = rint(2, 6);
                  return (
                    (state.stats.Happiness = clamp(state.stats.Happiness + o)),
                    renderStats(),
                    s.stream
                      ? (say(`I watched ${e} on ${a}.`),
                        notice(
                          "netflix" === t ? "Netflix and chill" : "Binge time",
                          `You watched ${e} on ${a}.`,
                          c,
                          !0,
                        ))
                      : (say(`I rented ${e} from ${a}. The DVD came in the mail and I watched it.`),
                        notice(
                          "Movie night",
                          `The ${e} DVD arrived in its red envelope. You watched it and mailed it back.`,
                          c,
                          !0,
                        ))
                  );
                }
                return "delete" === l
                  ? tagCard({
                      tag: a,
                      iconSrc: socIcon("delete"),
                      title: "Delete",
                      lead: `Are you sure you want to delete your ${a} account?`,
                      surprise: !1,
                      choices: [
                        [
                          "Delete it",
                          () => {
                            noteBans(),
                              delete state.social[e],
                              screen.classList.remove("open"),
                              say(`I deleted my ${a} account.`),
                              notice("Gone", `You deleted your ${a} account.`, null, !0);
                          },
                        ],
                        ["Never mind", () => {}],
                      ],
                    })
                  : void 0;
              }),
          );
      }
      function subSignup(e) {
        const t = socBase(e),
          a = SUBS[t].name,
          o = subPlan(t),
          n = state.social[e];
        (n.nf = { on: !0, since: socYear(), plan: o.id, price: o.price }),
          say(`I signed up for ${a} (${o.name}).${o.price ? " The first month is free." : ""}`),
          mailTo(
            n.email,
            a,
            `Welcome to ${a}!`,
            o.price
              ? `Your free month of ${o.name} starts today. After that it's ${subPrice(o)}. ${o.dvd ? "Add movies to your Queue and we'll mail you DVDs." : "Start watching on any screen."}`
              : `${o.name} is ready. Start watching on any screen.`,
          );
      }
      function subsYear() {
        const e = socYear(),
          t = state.first;
        let a = 0;
        for (const o in state.social) {
          if (!notSocial(o)) continue;
          const n = socBase(o),
            s = SUBS[n],
            r = s.name,
            i = state.social[o],
            l = subOf(o),
            c = subPlan(n),
            d = (e, t) => i.email && mailTo(i.email, r, e, t);
          if (!l.on) {
            l.since &&
              chance(0.6) &&
              d("We miss you!", `Come back to ${r}. ${subTitle(n)} is waiting for you.`);
            continue;
          }
          const u = i.stranger ? 0 : 12 * localPrice(c.price);
          if (state.money < u)
            (l.on = !1),
              say(`My ${r} membership was canceled because my payment failed.`),
              d(
                "Your payment was declined",
                "We couldn't charge your card, so your membership is on hold. Update your payment to keep watching.",
              );
          else {
            (state.money -= u),
              l.plan && l.plan !== c.id
                ? d(
                    "Changes to your plan",
                    `You're now on ${c.name}${c.price ? ` (${subPrice(c)})` : ""}.${c.stream && !c.dvd && "netflix" === n ? " DVDs are no longer part of it." : c.dvd && c.stream ? " You can now watch instantly on your computer!" : ""}`,
                  )
                : l.price &&
                  l.price !== c.price &&
                  d("An update on your membership price", `${c.name} is going to ${subPrice(c)}.`),
              (l.plan = c.id),
              (l.price = c.price);
            for (let e = rint(2, 6); e > 0; e--) {
              const e = subTitle(n);
              !c.dvd || (c.stream && !chance(0.5))
                ? d(
                    ...pickR([
                      [`New on ${r}`, `${e} is now streaming. Watch it tonight.`],
                      [`${t}, we picked something for you`, `We think you'll love ${e}.`],
                      ...(c.price
                        ? [
                            [
                              `Your ${r} receipt`,
                              `Thanks for being a member. You were charged ${usd(localPrice(c.price))} this month.`,
                            ],
                          ]
                        : []),
                    ]),
                  )
                : d(
                    ...pickR([
                      ["Your DVD has shipped", `${e} is on its way. It should arrive in 1-2 business days.`],
                      ["We received your DVD", `We got ${e} back. Your next movie ships today.`],
                    ]),
                  );
            }
            s.share &&
              e >= s.share &&
              !l.shareMail &&
              ((l.shareMail = !0),
              d(
                `Your ${r} account is for you and the people you live with`,
                "Sharing outside your home? Add an extra member to your plan.",
              )),
              chance(0.3) && (a += state.depressed ? (chance(0.25) ? 1 : 0) : rint(1, 2));
          }
        }
        a && ((state.stats.Happiness = clamp(state.stats.Happiness + Math.min(3, a))), renderStats());
      }
      function rbxBcMailBody() {
        const e = (e) => `<div style="margin:0 0 9px">${e}</div>`,
          t = (e) => `<div style="font-weight:bold;font-size:13px;margin:12px 0 5px">${e}</div>`;
        return (
          '<div style="background:#eee8cb;color:#222;font:12px/1.42 Verdana,Geneva,sans-serif;text-align:left;margin:0 -10px;padding:12px 12px 14px;border-left:5px solid #b9a77d;border-radius:4px"><div style="display:flex;align-items:baseline;justify-content:space-between;gap:6px;margin-bottom:9px"><b style="font-size:15px;color:#3b2a10">&#128196; Builders Club is Here!</b><span style="font-size:10px;color:#444;white-space:nowrap">August 16th 2007</span></div><img src="social/roblox/bc2007-figure.png" alt="" style="float:left;width:38%;max-width:120px;margin:2px 10px 6px 0;border:2px solid #c5d6a0;background:#fff">' +
          e(
            "This is the biggest update ROBLOX has ever had. Our longtime players know we've been building Builders Club for months, and today it's finally open to everyone.",
          ) +
          e(
            "ROBLOX is still free, and you can have a great time without spending anything. Builders Club is our premium membership for players who want to do more.",
          ) +
          e(
            "The big perk: up to 10 places on one account. You can also put your creations (shirts, for now) in the Catalog and sell them. Members get 15 ROBUX every day and never see outside ads on ROBLOX.com. If you cancel or let it lapse, you keep all 10 places.",
          ) +
          e("For more details, check out the <b>Builders Club</b> page.") +
          '<img src="social/roblox/bc2007-join.png" alt="Join Builders Club Now!" style="clear:both;display:block;width:100%;height:auto;margin:12px 0 10px"><div style="font-weight:bold;font-size:11px;margin-bottom:4px">Why Join Builders Club?</div><ul style="margin:4px 0 8px;padding-left:20px;color:#222;font-size:12px"><li>Up to 10 places on one account</li><li>15 ROBUX a day</li><li>Sell your creations in the ROBLOX Catalog</li><li>No outside ads on ROBLOX.com</li><li>The exclusive Builders Club construction hard hat</li></ul><div style="text-align:center;margin:6px 0">- - -</div>' +
          t("New Headgear") +
          e("We also added <b>15 new hats</b> to the Catalog, the most we've ever released at once. Enjoy!") +
          t("The Future") +
          e(
            "Thanks to everyone who's been with us from the start. Lots more is coming soon, so keep sending your <b>feedback</b>.",
          ) +
          '<div style="text-align:right;margin-top:10px">- The ROBLOX Team</div></div>'
        );
      }
      const isRbxBcMail = (e) => "ROBLOX" === e.from && "Builders Club is Here!" === e.subj,
        MAIL_SITE_ALIAS = {
          xbox: "xboxlive",
          playstation: "psn",
          "playstation network": "psn",
          "yahoo mail": "yahoo",
          outlook: "hotmail",
          "musical.ly": "musically",
          x: "twitter",
        };
      function mailIcon(e, t) {
        const a = String(e.from || "")
          .replace(/\s*\(.*\)$/, "")
          .trim()
          .toLowerCase();
        return socIcon(
          MAIL_SITE_ALIAS[a] ||
            (SOCIALS.find((e) => e[1].toLowerCase() === a) || [])[0] ||
            (EMAIL_PROV[a] ? a : null) ||
            t,
        );
      }
      function rbxBcMail(e) {
        const t = state.social[e],
          a = t && t.email;
        if (!a || 2007 !== socYear()) return;
        const o = (state.rbxBcMail ||= []);
        if (o.includes(a)) return;
        o.push(a), mailTo(a, "ROBLOX", "Builders Club is Here!", rbxBcMailBody(), "news@roblox.com");
        const n = (state.emails || []).find((e) => e.addr === a),
          s = n && n.inbox[n.inbox.length - 1];
        s && ((s.date = "Aug 16, 2007"), (s.t = 803033));
      }
      function robloxYear() {
        const e = socYear();
        for (const t in state.social) {
          if ("roblox" !== socBase(t) || state.social[t].banned || socEnded(t)) continue;
          const a = rbxOf(t);
          if ((rbxBcMail(t), null != a.club && rbxGiveHat(a, a.club), null != a.club && e < RBX_CLUB_END)) {
            const e = a.club,
              t = a.plan || "year",
              o = RBX_CLUB[e][0],
              n = (e) => {
                (a.club = null), (a.plan = null), (a.cancel = !1), say(`My ${o} membership ${e}.`);
              };
            if ("6mo" === t || (a.cancel && "life" !== t)) n("ended");
            else if ("life" === t) a.robux += 365 * RBX_CLUB[e][2];
            else {
              const o = localPrice(bcRenewCost(e, t));
              state.money >= o
                ? ((state.money -= o), (a.robux += 365 * RBX_CLUB[e][2]))
                : n("ran out because I couldn't pay");
            }
          }
          if (e >= RBX_CLUB_END && null != a.club) {
            const e = RBX_CLUB[a.club][0];
            (a.prem = a.club),
              (a.premLife = "life" === a.plan),
              (a.club = null),
              (a.plan = null),
              say(`Roblox discontinued Builders Club. My ${e} became Roblox ${RBX_PREM[a.prem][0]}.`),
              queuePopup(() =>
                notice(
                  "Builders Club is gone",
                  `Roblox discontinued Builders Club. Your ${e} membership is now Roblox ${RBX_PREM[a.prem][0]}${a.premLife ? ", free for life" : ""}.`,
                  null,
                  !0,
                ),
              );
          }
          if (null != a.prem) {
            const e = a.premLife ? 0 : localPrice(RBX_PREM[a.prem][1]);
            state.money >= e
              ? ((state.money -= e), (a.robux += 12 * RBX_PREM[a.prem][2]))
              : ((a.prem = null), say("My Roblox Premium ran out because I couldn't pay."));
          }
          if ((tixEra() && (a.tix += rint(1200, 3650)), e > TIX_YEARS[1] && a.tix > 0)) {
            const e = a.tix,
              t = Math.floor(e / 10);
            (a.robux += t),
              (a.tix = 0),
              say(`Roblox removed Tix. My ${fmtN(e)} Tix became R$ ${fmtN(t)}.`),
              queuePopup(() =>
                notice(
                  "Tix removed",
                  `Roblox got rid of Tix. Your ${fmtN(e)} Tix were turned into R$ ${fmtN(t)}.`,
                  null,
                  !0,
                ),
              );
          }
        }
      }
      function discordRows(e) {
        dcStaff() && !dcOf(e).staffPerks && discordYear();
        const t = socYear(),
          a = dcOf(e),
          o = (e, t, a, o, n) =>
            `<div class="row sm${n ? " dis" : ""}" ${n ? "" : `data-dc="${e}"`}><img src="${t}"><div class="t"><b>${a}</b><span>${o}</span></div>${n ? "" : DOTS}</div>`;
        return (
          '<div class="sec">Discord</div>' +
          o(
            "profile",
            "social/discord/nitro.png",
            "Profile & Badges",
            `${dcBadges(e).length} badges · worth ~${usd(dcWorth(e))}`,
          ) +
          o(
            "nitro",
            "social/discord/nitro.png",
            "Nitro",
            t < 2017
              ? "Coming in 2017"
              : a.nitroOn
                ? `Subscribed · ${a.nitroMonths} months`
                : "Subscribe to Nitro",
            t < 2017,
          ) +
          o(
            "boost",
            "social/discord/boost-1.png",
            "Server Boost",
            t < 2019 ? "Coming in 2019" : a.boostOn ? `Boosting · ${a.boostMonths} months` : "Boost a server",
            t < 2019,
          ) +
          o(
            "bot",
            "social/discord/bot.png",
            "Make a Bot",
            a.botVerified
              ? `${a.bot} (verified · ${fmtN(a.servers || 0)} servers)`
              : a.bot
                ? `${a.bot} (${fmtN(a.servers || 0)} servers${t <= DC_WIN.earlybot ? ` · verify by ${DC_WIN.earlybot} for the early badge` : ""})`
                : t <= DC_WIN.earlybot
                  ? `Build a bot (verify by ${DC_WIN.earlybot} for a rare badge)`
                  : "Build a Discord bot",
          ) +
          o(
            "bug",
            "social/discord/bughunter.png",
            "Report Bugs",
            a.bugs
              ? `${a.bugs} bug${a.bugs > 1 ? "s" : ""} found`
              : t < DC_WIN.bug[0]
                ? `Opens in ${DC_WIN.bug[0]}`
                : t > DC_WIN.bug[1]
                  ? `Bug Hunter program closed in ${DC_WIN.bug[1]}`
                  : `Hunt for bugs (until ${DC_WIN.bug[1]})`,
            !a.bugs && (t < DC_WIN.bug[0] || t > DC_WIN.bug[1]),
          ) +
          o(
            "mod",
            "social/discord/modalumni.png",
            "Moderator Academy",
            a.modAlumni
              ? "Passed"
              : t < DC_WIN.mod[0]
                ? `Opens in ${DC_WIN.mod[0]}`
                : t > DC_WIN.mod[1]
                  ? `The program ended in ${DC_WIN.mod[1]}`
                  : `Take the moderation course (until ${DC_WIN.mod[1]})`,
            !a.modAlumni && (t < DC_WIN.mod[0] || t > DC_WIN.mod[1]),
          ) +
          o(
            "hype",
            "social/discord/bravery.png",
            "HypeSquad",
            t < 2017 ? "Coming in 2017" : a.house ? DC_BADGE[a.house] : "Join a HypeSquad house",
            t < 2017,
          ) +
          o(
            "quest",
            "social/discord/quest.png",
            "Quests",
            t < 2024 ? "Coming in 2024" : `${a.quests} completed`,
            t < 2024,
          )
        );
      }
      function discordAction(e, t, a) {
        state.social[e];
        const o = dcOf(e),
          n = socYear();
        if ("profile" === t) return discordProfile(e);
        if ("nitro" === t || "boost" === t) {
          const e = "nitro" === t ? o.nitroOn : o.boostOn,
            a = localPrice(DC_PRICE[t]),
            s = "nitro" === t ? "Nitro" : "a Server Boost";
          return socSelCard({
            icon: `social/discord/${"nitro" === t ? "nitro" : "boost-1"}.png`,
            title: "nitro" === t ? "Nitro" : "Server Boost",
            tag: "Discord",
            lead: e
              ? `You're subscribed. It renews every year for ${usd(a)}.`
              : `Subscribe to ${s} for ${usd(a)} a year.${"nitro" === t && n >= 2025 ? " Your Nitro badge evolves the longer you keep it." : " Your badge evolves the longer you keep it."}`,
            btn: e ? "Cancel subscription" : `Subscribe (${usd(a)}/yr)`,
            onGo: () =>
              e
                ? ("nitro" === t ? (o.nitroOn = !1) : (o.boostOn = !1),
                  say(`I canceled my Discord ${"nitro" === t ? "Nitro" : "server boost"}.`),
                  notice(
                    "Canceled",
                    "Your subscription is canceled. Your months so far still count if you come back.",
                    null,
                    !0,
                  ))
                : state.money < a
                  ? notice("Not enough", `You need ${usd(a)}.`, null, !0)
                  : ((state.money -= a),
                    renderStats(),
                    "nitro" === t
                      ? ((o.nitroOn = !0), (o.nitroMonths += 12), (o.firstNitro ||= n))
                      : ((o.boostOn = !0), (o.boostMonths += 12)),
                    say(
                      `I subscribed to Discord ${"nitro" === t ? "Nitro" : "server boosting"} for ${usd(a)}.`,
                    ),
                    void notice(
                      "Subscribed",
                      `You subscribed for ${usd(a)}. It renews every year while you can afford it.`,
                      null,
                      !0,
                    )),
          });
        }
        if ("bot" === t) {
          if (o.botAge === state.age)
            return notice("Already coding", "You already worked on your bot this year.", null, !0);
          if (state.age < 13)
            return notice("Too young", "You need to be at least 13 to make a Discord bot.", null, !0);
          if (o.bot)
            return socSelCard({
              icon: "social/discord/bot.png",
              title: o.bot,
              tag: "Discord",
              lead: `Your bot is in ${fmtN(o.servers || 0)} servers.${o.botVerified ? " It's verified." : " Bots in 75+ servers can apply for verification."}`,
              btn: o.botVerified || (o.servers || 0) < 75 ? "Work on it" : "Apply for verification",
              onGo: () => {
                if (((o.botAge = state.age), !o.botVerified && (o.servers || 0) >= 75))
                  return chance(0.6 + state.stats.Smarts / 400)
                    ? ((o.botVerified = n),
                      say(`My Discord bot ${o.bot} got verified!`),
                      notice(
                        "Verified bot",
                        `${o.bot} is now a verified bot.${n <= 2020 ? " You earned the Early Verified Bot Developer badge." : ""}`,
                        null,
                        !0,
                      ))
                    : (say(`Discord turned down verification for my bot ${o.bot}.`),
                      notice(
                        "Not yet",
                        "Discord turned down your verification request. Try again next year.",
                        null,
                        !0,
                      ));
                const e =
                  Math.round((o.servers || 1) * (0.3 + Math.random() * (o.botQuality || 0.5) * 2)) +
                  rint(2, 20);
                (o.servers = (o.servers || 0) + e),
                  say(`I worked on my Discord bot ${o.bot}. It's now in ${fmtN(o.servers)} servers.`),
                  notice("Shipped an update", `${o.bot} grew to ${fmtN(o.servers)} servers.`, null, !0);
              },
            });
          const e = [
            ["Music bot", 0.75],
            ["Moderation bot", 0.7],
            ["Leveling bot", 0.6],
            ["Ticket support bot", 0.55],
            ["AI chat bot", n >= 2023 ? 0.8 : 0.3],
            ["Economy game bot", 0.6],
            ["Meme bot", 0.4],
            ["Crypto price bot", n >= 2017 ? 0.5 : 0.2],
            ["Pet battler bot", 0.45],
            ["Reminder bot", 0.35],
          ];
          return socSelCard({
            icon: "social/discord/bot.png",
            title: "Make a Bot",
            tag: "Discord",
            lead: "Come up with an idea for a Discord bot. A good idea in the right year takes off.",
            label: "Pick your idea:",
            opts: e.map((e) => e[0]),
            btn: "Build it",
            onGo: (t) => {
              o.botAge = state.age;
              const [a, n] = e[t],
                s = Math.min(1, n * (0.6 + 0.6 * Math.random()) + state.stats.Smarts / 400);
              (o.bot = `${pickR(["Mee", "Dyno", "Groov", "Carl", "Nova", "Pixel", "Bolt", "Echo", "Atlas", "Kiwi"])}${pickR(["Bot", "y", "o", "Pal", "X"])}`),
                (o.botQuality = s),
                (o.servers = Math.round(s * s * rint(20, 140))),
                say(`I built a Discord ${a.toLowerCase()} called ${o.bot}. It's in ${o.servers} servers.`),
                notice(
                  s > 0.7 ? "It took off" : s > 0.45 ? "Not bad" : "Crickets",
                  `You built ${o.bot}, a ${a.toLowerCase()}. It's in ${fmtN(o.servers)} servers.${o.servers >= 75 ? " You can apply for verification!" : ""}`,
                  null,
                  !0,
                );
            },
          });
        }
        return "bug" === t
          ? n < DC_WIN.bug[0] || n > DC_WIN.bug[1]
            ? notice(
                "Closed",
                `The Bug Hunter program runs from ${DC_WIN.bug[0]} to ${DC_WIN.bug[1]}.`,
                null,
                !0,
              )
            : o.bugAge === state.age
              ? notice("Already looked", "You already went bug hunting this year.", null, !0)
              : ((o.bugAge = state.age),
                chance(0.04 + state.stats.Smarts / 2500)
                  ? ((o.bugs = (o.bugs || 0) + 1),
                    say(
                      "I found a bug in Discord and reported it. " +
                        (o.bugs >= 2
                          ? "I earned the Gold Bug Hunter badge!"
                          : "I earned the Bug Hunter badge!"),
                    ),
                    notice(
                      "Bug Hunter",
                      `You found a real bug and reported it to Discord. You earned the ${o.bugs >= 2 ? "Gold " : ""}Bug Hunter badge!`,
                      null,
                      !0,
                    ))
                  : (say("I spent hours looking for bugs in Discord, but found nothing."),
                    notice(
                      "Nothing",
                      "You searched for hours but didn't find any bugs worth reporting.",
                      null,
                      !0,
                    )))
          : "mod" === t
            ? o.modAlumni
              ? notice("Alumni", "You already passed the moderation course.", null, !0)
              : n < DC_WIN.mod[0] || n > DC_WIN.mod[1]
                ? notice(
                    "Closed",
                    `The Moderator Academy ran from ${DC_WIN.mod[0]} to ${DC_WIN.mod[1]}.`,
                    null,
                    !0,
                  )
                : o.modAge === state.age
                  ? notice("Next year", "You can retake the course next year.", null, !0)
                  : ((o.modAge = state.age),
                    chance(0.25 + 0.006 * state.stats.Smarts)
                      ? ((o.modAlumni = !0),
                        say("I passed the Discord Moderator Academy course."),
                        notice(
                          "Graduated",
                          "You passed the moderation course and earned the Moderator Programs Alumni badge!",
                          null,
                          !0,
                        ))
                      : (say("I failed the Discord moderation course."),
                        notice(
                          "Failed",
                          "You failed the moderation exam. You can try again next year.",
                          null,
                          !0,
                        )))
            : "hype" === t
              ? socSelCard({
                  icon: "social/discord/bravery.png",
                  title: "HypeSquad",
                  tag: "Discord",
                  lead: "Take the quiz and join a HypeSquad house.",
                  label: "Pick your house:",
                  opts: ["Bravery", "Brilliance", "Balance"],
                  btn: "Join house",
                  onGo: (e) => {
                    (o.house = ["bravery", "brilliance", "balance"][e]),
                      say(`I joined HypeSquad ${DC_BADGE[o.house].split(" ")[1]} on Discord.`),
                      notice("Welcome", `You joined ${DC_BADGE[o.house]}.`, null, !0);
                  },
                })
              : "quest" === t
                ? o.questAge === state.age
                  ? notice("Done for now", "You already finished a quest this year.", null, !0)
                  : ((o.questAge = state.age),
                    o.quests++,
                    say(`I completed a Discord quest by playing ${pickR(SOC_GAMES)}.`),
                    notice(
                      "Quest complete",
                      "You completed a quest." +
                        (1 === o.quests
                          ? " You earned the Quest badge!"
                          : 3 === o.quests && n >= 2025
                            ? " You earned the Orbs Apprentice badge!"
                            : ""),
                      null,
                      !0,
                    ))
                : void 0;
      }
      const MON3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        joinDate = (e) => {
          const t = state.social[e];
          return (
            (t.joined ||= { y: socYear() - (t.years || 0), m: rint(0, 11), d: rint(1, 28) }),
            `${MON3[t.joined.m]} ${t.joined.d}, ${t.joined.y}`
          );
        };
      function discordProfile(e) {
        const t = state.social[e],
          a = (dcOf(e), dcBadges(e)),
          o = document.getElementById("pname").textContent,
          n = (t.offers || []).slice(-3).reverse();
        ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="ev-tag" style="margin-top:12px"><canvas class="ev-av" width="250" height="250"></canvas><span class="who">@${showHandle(e)}</span><span class="kind">Discord</span></div>\n      <h4><img src="${socIcon("discord")}" alt=""><span>${o}</span></h4>\n      <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;background:#232428;border-radius:10px;padding:8px;margin:4px 0 10px">\n        ${a.length ? a.map(([e, t]) => `<img src="social/discord/${e}.png" title="${t}" alt="${t}" style="width:26px;height:26px">`).join("") : '<span style="color:#b5bac1;font-size:13px">No badges yet</span>'}</div>\n      <table class="prof"><tbody>\n        <tr><td><b>Member Since:</b> ${joinDate(e)}</td></tr>\n        <tr><td><b>Friend Requests:</b> ${fmtN(t.subs)}</td></tr>\n        ${a.map(([, e]) => `<tr><td>${e}</td></tr>`).join("")}\n        <tr><td><b>Account Worth:</b> ~${usd(dcWorth(e))}</td></tr>\n        ${n.length ? n.map((e) => `<tr><td><b>Offer (${e.y}):</b> ${usd(e.amt)}</td></tr>`).join("") : "<tr><td><b>Offers:</b> None yet</td></tr>"}\n      </tbody></table>`;
        const s = ev.querySelector(".ev-av"),
          r = document.querySelector(".phone > .profile canvas.avatar");
        r && s.getContext("2d").drawImage(r, 0, 0, 250, 250),
          (ev.style.overflow = "visible"),
          (document.getElementById("propX").onclick = () => {
            evWrap.classList.remove("open"), (ev.style.overflow = "");
          }),
          evWrap.classList.add("open");
      }
      function discordYear() {
        for (const e in state.social) {
          if ("discord" !== socBase(e) || state.social[e].banned) continue;
          const t = state.social[e],
            a = dcOf(e);
          if (socYear() >= 2023 && !a.unique) {
            a.unique = !0;
            const o = t.joined ? t.joined.y : socYear() - (t.years || 0);
            if (o < 2023) {
              const a = handleOf(e),
                n = o <= 2015 ? 1 : Math.max(0.03, Math.pow(0.5, o - 2015)),
                s = chance(n);
              if (s) {
                const e = (state.socialNPC ||= {});
                e[`discord:${a}`] && (e[`discord:${a}`].sold = !0);
              } else t.handle = `${a.slice(0, 11)}${rint(10, 999)}`;
              say(
                "Discord switched to unique usernames. " +
                  (s ? `I kept @${a}.` : `Someone with an older account got @${a}, so I'm @${t.handle} now.`),
              ),
                queuePopup(() =>
                  notice(
                    "Unique usernames",
                    `Discord dropped the #1234 tags. ${s ? `You kept @${a}!` : `Someone with an older account got @${a} first, so you're @${t.handle}.`}<br><br>Rare names are up for grabs this year. Change your username before they're gone.`,
                    null,
                    !0,
                  ),
                );
            }
          }
          for (const e of ["nitro", "boost"]) {
            const t = "nitro" === e ? "nitroOn" : "boostOn",
              o = "nitro" === e ? "nitroMonths" : "boostMonths",
              n = localPrice(DC_PRICE[e]);
            a[t] &&
              (state.money >= n
                ? ((state.money -= n), (a[o] += 12))
                : ((a[t] = !1),
                  say(
                    `My Discord ${"nitro" === e ? "Nitro" : "server boost"} ran out because I couldn't pay.`,
                  )));
          }
          if (
            (a.bot &&
              (a.servers = Math.round((a.servers || 0) * (1 + (a.botQuality || 0.4) * Math.random() * 0.5))),
            a.bot && a.servers > 1e3 && (t.subs += Math.round(a.servers * Math.random() * 0.2)),
            !a.partner &&
              t.subs >= 1e5 &&
              socYear() >= 2017 &&
              socYear() <= 2021 &&
              chance(0.3) &&
              ((a.partner = !0), say("My Discord server was accepted into the Partner Program.")),
            dcStaff() && !a.staffPerks)
          ) {
            (a.staffPerks = !0), (t.verified = !0);
            const o = rint(2e4, 8e4);
            (t.subs += o),
              say(
                `Working at Discord got me the Staff badge and ${fmtN(o)} new followers on @${showHandle(e)}.`,
              );
          }
        }
      }
      function socialProfile(e) {
        const [, t, a, o] = socOf(e),
          n = state.social[e],
          s = a[0].toUpperCase() + a.slice(1),
          r = document.getElementById("pname").textContent;
        var i;
        ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div class="ev-tag" style="margin-top:12px"><canvas class="ev-av" width="250" height="250"></canvas><span class="who">${r}</span><span class="kind">You</span></div>\n      <h4><img src="${socIcon(socBase(e))}"><span>${t} Account</span></h4>\n      <table class="prof"><tbody><tr><td><b>Name:</b> ${r}</td></tr><tr><td><b>Username:</b> @${showHandle(e)}</td></tr>${
          ((i = pastHandles(e)),
          i.length
            ? `<tr><td><b>Past Usernames:</b> ${i
                .slice()
                .reverse()
                .map((e) => `@${e}`)
                .join(", ")}</td></tr>`
            : "")
        }<tr><td><b>Channel:</b> ${t}</td></tr><tr><td><b>Joined:</b> ${joinDate(e)}</td></tr>${n.email ? `<tr><td><b>Email:</b> ${n.email}</td></tr>` : ""}<tr><td><b>${s}:</b> ${fmtN(n.subs)}</td></tr>\n        <tr><td><b>${o[0].toUpperCase() + o.slice(1)}s:</b> ${fmtN(n.posts)}</td></tr><tr><td><b>Views:</b> ${fmtN(n.views)}</td></tr><tr><td><b>Years Active:</b> ${n.years}</td></tr>${n.about ? `<tr><td><b>About Me:</b> ${escAttr(n.about)}</td></tr>` : ""}\n        ${n.banned ? "<tr><td><b>Status:</b> Disabled</td></tr>" : ""}${n.monet ? `<tr><td><b>Monetized:</b> Yes</td></tr><tr><td><b>Total Earnings:</b> ${usd(n.earned || 0)}</td></tr>` : ""}${n.verified ? "<tr><td><b>Verified:</b> Yes</td></tr>" : ""}</tbody></table>`;
        const l = ev.querySelector(".ev-av"),
          c = document.querySelector(".phone > .profile canvas.avatar");
        c && l.getContext("2d").drawImage(c, 0, 0, 250, 250),
          (ev.style.overflow = "visible"),
          (document.getElementById("propX").onclick = () => {
            evWrap.classList.remove("open"), (ev.style.overflow = "");
          }),
          evWrap.classList.add("open");
      }
      const MIND_TRIGGERS = [
        [
          /\bI (?:attacked and )?(?:murdered|killed|assassinated|strangled|poisoned|executed|drained)\b|\bI (?:stabbed|shot|beat) .+ to death\b|\bI had .+ killed\b|^I .+[.!] (?:He|She|They) died\.$/i,
          [10, 20],
          [-12, -6],
        ],
        [
          /\bmy (?:mother|father|mom|dad|son|daughter|wife|husband|child|twin)\b.*\b(?:died|passed away|was killed|was murdered|killed himself|killed herself)\b/i,
          [10, 18],
          [-15, -8],
        ],
        [
          /\bmy (?:step\w+|brother|sister|grand\w+|aunt|uncle|cousin|boyfriend|girlfriend|fianc\w*|partner|best friend|friend|pet|dog|cat)\b.*\b(?:died|passed away|was killed|was murdered)\b/i,
          [4, 10],
          [-8, -3],
        ],
        [/\b(?:I was|I got|I've been) (?:fired|laid off|let go)\b|\bfired me\b/i, [5, 10], [-10, -5]],
        [/\b(?:I was|I got) (?:sentenced|convicted|arrested)\b|\bwent to prison\b/i, [4, 8], [-8, -4]],
        [
          /\b(?:I was|I got) (?:robbed|mugged|assaulted|attacked|stabbed|shot|kidnapped|swatted)\b/i,
          [5, 12],
          [-10, -4],
        ],
        [/\bdivorced? me\b|\bour divorce\b|\bwe got divorced\b|\bbroke up with me\b/i, [2, 6], [-8, -3]],
        [/\bI was diagnosed with\b/i, [2, 6], [-6, -2]],
      ];
      let mindLive = !1;
      function noMH() {
        try {
          return !!mods.noMentalHealth;
        } catch {
          return !1;
        }
      }
      window.FL_noMH = noMH;
      function mindYear() {
        if (noMH()) return;
        const e = mindOf(),
          t = state.stats,
          a = t.Happiness,
          o = e.low >= 3 ? 0.45 : e.ins >= 60 ? 0.6 : 1;
        if (o < 1 && e.snap)
          for (const a of ["Happiness", "Health", "Smarts", "Looks"])
            t[a] > e.snap[a] && (t[a] = Math.round(e.snap[a] + (t[a] - e.snap[a]) * o));
        (e.happy = a >= 65 ? (e.happy || 0) + 1 : 0),
          (e.mh = clamp(e.mh + 0.2 * (a - e.mh) - e.ins / 14 - (state.depressed ? 4 : 0))),
          e.ins > 0 && (t.Health = clamp(t.Health - Math.min(6, Math.round(e.ins / 18)))),
          e.happy >= 2
            ? (e.ins = clamp(e.ins - rint(2, 5)))
            : e.mh < 30 && (e.ins = clamp(e.ins + rint(0, 3))),
          (e.low = e.mh < 30 ? (e.low || 0) + 1 : 0),
          3 === e.low &&
            queueRoll(() =>
              notice(
                "Mental health",
                "Your mental health has been low for years. It's getting hard to feel better at anything.<br><br>Therapy can help (Activities → Therapy).",
                null,
                !0,
              ),
            ),
          e.ins >= 75 &&
            !e.warned &&
            ((e.warned = !0),
            queueRoll(() =>
              notice(
                "Insanity",
                "Your mind is slipping. Your health is suffering for it.<br><br>Therapy is the only thing that will really bring it down.",
                null,
                !0,
              ),
            )),
          e.ins < 50 && (e.warned = !1),
          (e.snap = { Happiness: t.Happiness, Health: t.Health, Smarts: t.Smarts, Looks: t.Looks });
      }
      function openTherapy() {
        const e = mindOf(),
          t = (e.thY === state.age && e.thN) || 0,
          a = 1 / (1 + 0.6 * t),
          o = state.age < 18 && parentsAlive().length > 0,
          n = o
            ? parentsAlive()
                .map((e) => ({ p: e, P: profileOf(e, e.ageAtBirth + state.age) }))
                .sort((e, t) => t.P.money - e.P.money)[0]
            : null;
        if (o && e.thDenied === state.age)
          return notice(
            "Therapy",
            `Your ${n.p.role.toLowerCase()} already said no this year. Ask again next year.`,
            null,
            !0,
          );
        const s = (e, t) => ({
            name: `Dr. ${ulast(state.country)}`,
            kind: e,
            fee: Math.round(localPrice(rint(...t))),
            eff: rint(15, 100),
          }),
          r = [
            s("therapist", [90, 220]),
            s("therapist", [90, 220]),
            ...(state.age >= 18 ? [s("psychiatrist", [250, 700])] : []),
          ],
          i = o
            ? [["Cost", freeCare() ? "You won't be charged (public healthcare)" : "You won't be charged"]]
            : r.map((e) => [
                `${e.name} (${e.kind})`,
                freeCare() ? "No charge (public healthcare)" : usd(e.fee),
              ]);
        jCard({
          tag: "Therapy",
          iconSrc: "emoji/1f6cb-fe0f.png",
          title: "Therapy",
          surprise: !0,
          close: !0,
          lead: o
            ? "Ask your parents to take you to see someone. Who would you like to see?"
            : "Which local professional will you see?",
          rows: [["Mental Health", `${Math.round(e.mh)}%`], ["Insanity", `${Math.round(e.ins)}%`], ...i],
          bars: r.map((e) => [
            `${e.name}'s Effectiveness`,
            e.eff,
            e.eff < 30 ? "#b3261e" : e.eff < 60 ? "#f5841f" : "#2fa03b",
          ]),
          choices: [
            ...r.map((s) => [
              `${s.name} (${"psychiatrist" === s.kind ? "Psychiatrist" : "Therapist"})`,
              () => {
                if (o) {
                  const { p: t, P: a } = n,
                    o = `Your ${t.role.toLowerCase()}`,
                    r = Math.max(
                      0.05,
                      Math.min(
                        0.7,
                        0.15 +
                          (e.mh >= 60 ? 0.25 : 0) +
                          (e.ins < 20 ? 0.15 : 0) -
                          (e.ins >= 60 ? 0.15 : 0) +
                          (a.relig > 70 ? 0.1 : 0) +
                          ((t.rel ?? 60) < 40 ? 0.1 : (t.rel ?? 60) >= 75 ? -0.05 : 0),
                      ),
                    );
                  if (chance(r))
                    return (
                      (e.thDenied = state.age),
                      say(
                        `I asked my ${t.role.toLowerCase()} to take me to therapy, but ${"f" === t.g || "Mother" === t.role ? "she" : "he"} said I didn't need it.`,
                      ),
                      screen.classList.remove("open"),
                      notice("Denied", `${o} said you don't need therapy.`, null, !0)
                    );
                  if (!freeCare()) {
                    if (a.money < s.fee)
                      return (
                        say("My parents couldn't afford to take me to therapy."),
                        screen.classList.remove("open"),
                        notice("Can't afford it", `${o} can't afford to pay for therapy right now.`, null, !0)
                      );
                    a.money -= s.fee;
                  }
                } else {
                  if (!canPay(s.fee))
                    return notice("Flat broke", "You can't afford a session.", null, !1, brokeRows(s.fee));
                  payMedical(s.fee);
                }
                (e.thY = state.age), (e.thN = t + 1);
                const r = (0.35 + s.eff / 100) * a * ("psychiatrist" === s.kind ? 1.35 : 1),
                  i = Math.max(0, Math.round(rint(4, 11) * r)),
                  l = Math.max(0, Math.round(rint(4, 10) * r));
                (e.ins = clamp(e.ins - i)),
                  (e.mh = clamp(e.mh + l)),
                  e.mh >= 30 && (e.low = 0),
                  (state.stats.Happiness = clamp(state.stats.Happiness + (s.eff >= 40 ? rint(1, 4) : 0))),
                  renderStats(),
                  say(
                    o
                      ? `My parents took me to see ${s.name}, a ${s.kind}.`
                      : `I went to see ${s.name}, a ${s.kind}.`,
                  ),
                  screen.classList.remove("open"),
                  notice(
                    "Therapy",
                    `${s.eff < 30 ? `${s.name} wasn't much help.` : s.eff < 60 ? `${s.name} helped a little.` : `${s.name} really helped.`}${t ? " Another session this year didn't help as much as the first." : ""}`,
                    null,
                    !0,
                  );
              },
            ]),
            ["Actually, never mind", () => {}],
          ],
        });
      }
      setTimeout(() => {
        mindLive = !0;
      }, 2500),
        new MutationObserver((e) => {
          if (!mindLive || state.dead || window.FL_RESTORING) return;
          let t = !1;
          for (const a of e)
            for (const e of a.addedNodes) {
              const a = 1 === e.nodeType || 3 === e.nodeType ? e.textContent : "";
              if (!a) continue;
              const o = MIND_TRIGGERS.find(([e]) => e.test(a));
              o && (mindBump(rint(...o[1]), rint(...o[2])), (t = !0));
            }
          t && renderStats();
        }).observe(log, { childList: !0, subtree: !0 });
      const PRESSURE = {
          job: [
            "When are you going to get a job? You can't live off us forever.",
            "Your cousin has a job already. What's your excuse?",
            "We're not paying for everything anymore. Find work.",
            "I printed some job listings for you. They're on your bed.",
            "You sleep until noon every day. Get a job!",
          ],
          license: [
            "You're old enough to drive. Why don't you have your license yet?",
            "I'm not driving you everywhere anymore. Go get your license.",
            "Every other kid your age is driving. Book the test already.",
          ],
          partner: [
            "When are you going to bring someone home for us to meet?",
            "Your sister is married already. Are you even dating?",
            "I'm not getting any younger. I want grandkids!",
            "Maybe stop staying in your room and go meet someone.",
          ],
        },
        ownsHome = () => (state.props || []).length > 0,
        HOME_RX = /\byour (place|door|doorstep|front door|house|home|apartment|couch|guest room)\b/i;
      function pressureYear() {
        const e = parentsAlive();
        if (!e.length || state.prison || state.homeless || ownsHome() || state.age < 16) return;
        const t = ["job", "job", "license", "partner"].filter(pressureNeeded),
          a = (state.pressure ||= { n: 0, kickAge: rint(23, 27) });
        if (
          (state.job && (a.n = Math.max(0, a.n - 1)),
          !state.job && !state.school && state.age >= a.kickAge && a.n >= 2 && chance(0.55))
        )
          return queueRoll(() => kickedOutCard(pickR(e)));
        if (!t.length || !chance(0.45)) return;
        const o = pickR(t),
          n = pickR(e);
        queueRoll(() => pressureCard(n, o));
      }
      function pressureNeeded(e) {
        return "job" === e
          ? !state.job && !state.school && !state.retired && state.age >= 18
          : "license" === e
            ? !isOldEra() && !state.license && !(state.cars || []).length && state.age > driveAge()
            : "partner" === e && state.age >= 22 && isSingle();
      }
      function pressureCard(e, t) {
        if (state.dead || state.homeless || state.prison || ownsHome() || e.dead || !pressureNeeded(t))
          return;
        const a = e.role.toLowerCase(),
          o = "f" === e.gender || "Mother" === e.role,
          n = o ? "She" : "He",
          s = (state.pressure ||= { n: 0, kickAge: rint(23, 27) });
        s.n++, (e.rel = clamp((e.rel ?? 60) - rint(3, 7)));
        const r = { job: "get a job", license: "get your driving license", partner: "find a partner" }[t];
        jCard({
          tag: e.role,
          person: {
            name: `${e.first} ${SURNAME}`,
            look: e.look,
            g: e.gender,
            age: e.ageAtBirth + state.age,
            mood: "angry",
          },
          iconSrc: "emoji/1f624.png",
          title: "Get Your Life Together",
          surprise: !0,
          lead: `Your ${a}, ${e.first}, is pressuring you to ${r}.<br><br>"${pickR(PRESSURE[t])}"<br><br>What will you do?`,
          bars: [["Relationship", e.rel]],
          choices: [
            [
              "Promise to do it",
              () => {
                (e.rel = clamp(e.rel + rint(0, 2))), say(`My ${a} pressured me to ${r}. I promised I would.`);
              },
            ],
            [
              `Tell ${o ? "her" : "him"} to back off`,
              () => {
                (e.rel = clamp(e.rel - rint(5, 10))),
                  s.n++,
                  say(`My ${a} pressured me to ${r}, and I told ${o ? "her" : "him"} to back off.`),
                  notice("Back off", `${n} stormed out of your room.`, null, !0);
              },
            ],
            [
              "Ignore it",
              () => {
                (e.rel = clamp(e.rel - rint(2, 5))), say(`My ${a} kept pressuring me to ${r}. I ignored it.`);
              },
            ],
          ],
        });
      }
      function kickedOutCard(e) {
        if (state.dead || state.homeless || ownsHome()) return;
        const t = e.role.toLowerCase();
        "f" === e.gender || e.role;
        (state.homeless = { since: state.age }),
          (e.rel = clamp((e.rel ?? 60) - rint(10, 20))),
          say("My parents kicked me out of the house. I'm homeless now."),
          jCard({
            tag: e.role,
            person: {
              name: `${e.first} ${SURNAME}`,
              look: e.look,
              g: e.gender,
              age: e.ageAtBirth + state.age,
              mood: "angry",
            },
            iconSrc: "emoji/1f6aa.png",
            title: "Kicked Out",
            lead: `Your ${t}, ${e.first}, has had enough. "${pickR(["You're an adult. Pack your things and go.", "We've told you a hundred times. You need to leave.", "Don't come back until you have a job."])}"<br><br>Your parents officially kicked you out. You're homeless until you can buy a place of your own.`,
            ok: () => {},
          });
      }
      function homelessYear() {
        const e = state.homeless;
        if (e && !state.dead)
          return ownsHome()
            ? ((state.homeless = null),
              say("I finally have a roof over my head again."),
              queueRoll(() =>
                notice("Home at last", "You have a home of your own. You're not homeless anymore.", null, !0),
              ))
            : void (
                state.prison ||
                ((state.stats.Health = clamp(state.stats.Health - rint(8, 15))),
                (state.stats.Happiness = clamp(state.stats.Happiness - rint(8, 15))),
                mindBump(rint(2, 5), -rint(4, 8)),
                state.age - e.since >= 1 &&
                  chance(0.35) &&
                  say(
                    pickR([
                      "I slept on a park bench again.",
                      "I spent another cold night in a shelter.",
                      "I asked strangers for spare change.",
                    ]),
                  ))
              );
      }
      (window.homeOk = (e) => state.age < 18 || ownsHome() || !HOME_RX.test(String(e || ""))),
        document.getElementById("ageBtn").addEventListener("click", () => {
          if (!state.dead) {
            mindYear(),
              applyLookLater(),
              homelessYear(),
              pressureYear(),
              stolenYear(),
              window.familyDramaYear && familyDramaYear(),
              window.loveLifeYear && loveLifeYear(),
              window.lifeStagesYear && lifeStagesYear();
            for (const e in state.social) {
              const t = state.social[e],
                [, a] = socOf(e);
              if (socEnded(e)) {
                t.endNoted ||
                  ((t.endNoted = !0),
                  say(`${a} shut down, and my account @${showHandle(e)} went with it.`),
                  t.email &&
                    mailTo(
                      t.email,
                      a,
                      `${a} is shutting down`,
                      `Thank you for being part of ${a}. As of ${SOC_END[socBase(e)]}, the service is closed and accounts like @${showHandle(e)} are no longer available.`,
                    ));
                continue;
              }
              if ((t.years++, t.banned || notSocial(e))) continue;
              t.postsYear || (t.momentum *= 0.5);
              const o = Math.max(0, t.subs - t.fake);
              if (o) {
                const a = Math.round(o * (6 + 14 * Math.random()) * (1 + 0.05 * t.momentum));
                if (((t.views += a), t.monet)) {
                  const [o, n] = SOC_RPM[socBase(e)] || [0.5, 2],
                    s = Math.round((a / 1e3) * (o + Math.random() * (n - o)));
                  s > 0 && ((state.money += s), (t.earned = (t.earned || 0) + s));
                }
              }
              (t.subs = Math.max(
                0,
                t.subs + Math.round(o * (0.13 * Math.random() - 0.03) * (1 + 0.1 * t.momentum)),
              )),
                (t.subs += rint(0, 4) + Math.round(Math.min(t.years, 25) * Math.random() * 2)),
                (t.postsYear = 0),
                (t.viewsYear = 0);
            }
            artistYear(),
              fameSocialYear(),
              socialNameYear(),
              nameFamilyYear(),
              discordYear(),
              robloxYear(),
              subsYear(),
              breachYear(),
              guessYear(),
              emailHackYear(),
              bankHackYear(),
              marketSellYear(),
              policyBanYear(),
              emailYear(),
              scamYear(),
              bankYear(),
              addressMailYear(),
              renderStats();
          }
        });
      const MARKET = [
          ["bread", "Bread", "emoji/1f956.png", 0.05, 3, 0, 1],
          ["apples", "Apples", "emoji/1f34e.png", 0.1, 3, 1, 1],
          ["carrots", "Carrots", "emoji/1f955.png", 0.05, 2, 1, 1],
          ["eggs", "Eggs", "emoji/1f95a.png", 0.15, 3, 1, 1],
          ["milk", "Milk", "emoji/1f95b.png", 0.05, 3, 1, 1],
          ["corn", "Corn", "2018/emoji/1f33d.png", 0.05, 2, 1, 1],
          ["mushrooms", "Mushrooms", "2018/emoji/1f344.png", 0.1, 2, 0, 1],
          ["peaches", "Peaches", "freelife/apple/1f351.png", 0.15, 4, 1, 1],
          ["butter", "Butter", "emoji/1f9c8.png", 0.2, 3, 0, 1],
          ["cheese", "Cheese", "emoji/1f9c0.png", 0.12, 4, 0, 2],
          ["fish", "Fresh Fish", "emoji/1f41f.png", 0.1, 4, 2, 1],
          ["stew", "Stew", "emoji/1f372.png", 0.1, 5, 2, 1],
          ["pie", "Meat Pie", "emoji/1f967.png", 0.1, 6, 1, 1],
          ["chicken", "Roast Chicken", "emoji/1f357.png", 0.3, 5, 2, 1],
          ["meat", "Salted Pork", "emoji/1f356.png", 0.12, 5, 2, 2],
          ["bacon", "Bacon", "2018/emoji/1f953.png", 0.15, 5, 0, 2],
          ["biscuits", "Biscuits", "emoji/1f36a.png", 0.1, 4, 0, 2],
          ["peanuts", "Peanuts", "emoji/1f95c.png", 0.05, 2, 1, 3],
          ["sweets", "Boiled Sweets", "emoji/1f36c.png", 0.05, 4, -1, 3],
          ["chocolate", "Chocolate", "emoji/1f36b.png", 0.25, 6, -1, 3],
          ["cake", "Cake", "emoji/1f370.png", 0.25, 8, -1, 1],
          ["coffee", "Coffee Beans", "emoji/2615.png", 0.2, 3, 0, 3],
          ["ale", "Ale", "emoji/1f37a.png", 0.05, 4, -1, 2],
          ["wine", "Wine", "emoji/1f377.png", 0.5, 6, -1, 10],
          ["whiskey", "Whiskey", "emoji/1f943.png", 0.4, 6, -2, 15],
          ["salt", "Salt", "emoji/1f9c2.png", 0.05, 1, 0, 20],
          ["rabbit", "Rabbit", "emoji/1f356.png", 0, 5, 2, 1, !0],
          ["venison", "Venison", "emoji/1f356.png", 0, 7, 3, 1, !0],
        ].map(([e, t, a, o, n, s, r, i]) => ({
          id: e,
          name: t,
          ico: a,
          price: o,
          h: n,
          he: s,
          keeps: r,
          wild: i,
        })),
        marketItem = (e) => MARKET.find((t) => t.id === e),
        keepsTxt = (e) => (1 === e ? "Keeps 1 year" : `Keeps ${e} years`),
        pantryAdd = (e, t = 1) => {
          const a = (state.pantry ||= []);
          for (let o = 0; o < t; o++) a.push({ id: e, at: state.age });
        };
