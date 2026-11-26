      const SOC_ERAS = {
          gmail: [2004, 2007, 2010, 2011, 2014, 2020, 2026],
          yahoo: [1990, 1995, 1996, 2009, 2013, 2019],
          hotmail: [1996, 1997, 1998, 2e3, 2003, 2007, 2010, 2011, 2012, 2013, 2019, 2025],
          instagram: [2010, 2013, 2015, 2016, 2026],
          facebook: [2004, 2005, 2015, 2019, 2023],
          twitter: [1990, 2006, 2010, 2012, 2023],
          youtube: [2005, 2011, 2013, 2015, 2017, 2024],
          twitch: [2011, 2012, 2019],
          reddit: [2005, 2017, 2023],
          tiktok: [2016, 2018, 2025],
          roblox: [1990, 2004, 2005, 2006, 2007, 2010, 2015, 2017, 2018, 2022],
          clubpenguin: [1990, 2005, 2007, 2008, 2012],
          steam: [2003, 2010, 2014],
          xboxlive: [1990, 2002, 2005, 2010, 2013, 2019, 2026],
          webkinz: [1990, 2005, 2013, 2014, 2016, 2020],
          neopets: [1999, 2009, 2014, 2020],
          psn: [2006, 2008, 2013, 2015, 2017],
          miniclip: [2001, 2020],
          leagueoflegends: [2009, 2010, 2013, 2019],
          myspace: [2003, 2004, 2010, 2012],
          googleplus: [2011, 2015],
          onlyfans: [2016, 2021],
          snapchat: [1990, 2011, 2013, 2014, 2019],
          pinterest: [2010, 2011, 2017, 2021],
          linkedin: [2003, 2011, 2019, 2021],
          threads: [1990, 2023, 2026],
          kick: [2022],
          bluesky: [1990, 2023],
          tumblr: [2007, 2013, 2018],
          bereal: [2020],
          patreon: [2013, 2017, 2020, 2023],
          telegram: [2013, 2014, 2019],
          runescape: [1990, 2001, 2004, 2008, 2011, 2013, 2026],
          habbo: [2e3, 2001, 2003],
          minecraft: [2009, 2016, 2019, 2021],
          poptropica: [2007],
          moshimonsters: [2008],
          toontown: [1990, 2003],
          maplestory: [2003, 2007, 2012],
          battlenet: [1996, 1999, 2009, 2017, 2021],
          wizard101: [2008],
          animaljam: [2010, 2011, 2016, 2020],
          gaiaonline: [2003, 2006, 2007],
          secondlife: [2002, 2019],
          vine: [1990, 2013, 2017],
          bebo: [2005, 2009, 2013],
          friendster: [2002, 2009, 2011],
          xanga: [1999],
          orkut: [2004, 2007, 2011],
          periscope: [2015],
          path: [2010],
          yikyak: [2013, 2021],
          flickr: [2004],
          musically: [2014],
          wow: [1990, 2004, 2007, 2008, 2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024, 2026],
          netflix: [1997, 2e3, 2001, 2014],
          hulu: [1990, 2007, 2014, 2017, 2018],
          disneyplus: [1990, 2019, 2024],
          discord: [1990, 2015, 2021],
          soundcloud: [2007, 2008, 2010, 2014],
        },
        verifyIcon = (e) => ("discord" === socBase(e) ? "social/discord-verified.png" : socIcon("verify"));
      function socIcon(e) {
        const t = SOC_ERAS[e],
          a = state.birthYear + state.age;
        if (!t) return `social/${e}.png`;
        if (Array.isArray(t[0]))
          return a >= t[0][0] && a <= t[0][1] ? `social/eras/${e}-${t[0][0]}.png` : `social/${e}.png`;
        return `social/eras/${e}-${[...t].reverse().find((e) => a >= e) || t[0]}.png`;
      }
      const VIDEO_KINDS = [
          "BitLife",
          "Challenge",
          "Dance",
          "Educational",
          "Gaming",
          "How-To",
          "Music",
          "Prank",
          "Reaction",
          "Unboxing",
          "Vlog",
        ],
        SOCIALS = [
          [
            "facebook",
            "Facebook",
            "friends",
            "post",
            ["Status Update", "Photo", "Meme", "Life Event", "Rant"],
            13,
          ],
          [
            "instagram",
            "Instagram",
            "followers",
            "photo",
            ["Selfie", "Food", "Travel", "Pet", "Fashion", "Meme"],
            13,
          ],
          ["onlyfans", "OnlyFans", "subscribers", "post", ["Photo", "Video", "Livestream"], 18],
          ["tiktok", "TikTok", "followers", "video", VIDEO_KINDS, 13],
          ["twitch", "Twitch", "followers", "stream", ["Gaming", "Just Chatting", "Music", "IRL"], 13],
          ["twitter", "Twitter", "followers", "tweet", ["Opinion", "Joke", "Meme", "News", "Rant"], 13],
          ["soundcloud", "SoundCloud", "followers", "track", ["Hip-Hop", "Pop", "Rock", "EDM", "Lo-fi"], 13],
          ["youtube", "YouTube", "subscribers", "video", VIDEO_KINDS, 13],
          ["snapchat", "Snapchat", "friends", "snap", ["Selfie", "Story", "Food", "Pet", "Funny Filter"], 13],
          [
            "reddit",
            "Reddit",
            "followers",
            "post",
            ["Meme", "Question", "Hot Take", "Story", "Shower Thought"],
            13,
          ],
          [
            "pinterest",
            "Pinterest",
            "followers",
            "pin",
            ["Recipe", "DIY", "Outfit", "Home Decor", "Wedding Idea"],
            13,
          ],
          [
            "linkedin",
            "LinkedIn",
            "connections",
            "post",
            ["Career Update", "Humblebrag", "Hiring Post", "Motivational Story", "Industry News"],
            16,
          ],
          [
            "threads",
            "Threads",
            "followers",
            "thread",
            ["Opinion", "Joke", "Hot Take", "Life Update", "Meme"],
            13,
          ],
          [
            "discord",
            "Discord",
            "friend requests",
            "message",
            ["Announcement", "Meme", "Gaming Clip", "Event", "Poll"],
            13,
          ],
          ["kick", "Kick", "followers", "stream", ["Gaming", "Just Chatting", "IRL", "Music"], 18],
          ["bluesky", "Bluesky", "followers", "post", ["Opinion", "Joke", "Art", "News", "Rant"], 13],
          ["tumblr", "Tumblr", "followers", "post", ["Fan Art", "Aesthetic", "Poetry", "Meme", "Rant"], 13],
          [
            "bereal",
            "BeReal",
            "friends",
            "BeReal",
            ["Morning", "At Work", "At School", "Out With Friends", "Late"],
            13,
          ],
          [
            "patreon",
            "Patreon",
            "patrons",
            "post",
            ["Exclusive Video", "Behind the Scenes", "Tutorial", "Early Access", "Q&A"],
            18,
          ],
          [
            "telegram",
            "Telegram",
            "subscribers",
            "message",
            ["News", "Meme", "Tips", "Voice Note", "Poll"],
            13,
          ],
          [
            "runescape",
            "RuneScape",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "roblox",
            "Roblox",
            "followers",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "clubpenguin",
            "Club Penguin",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "habbo",
            "Habbo",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "neopets",
            "Neopets",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "webkinz",
            "Webkinz",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "minecraft",
            "Minecraft",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "steam",
            "Steam",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "xboxlive",
            "Xbox Live",
            "followers",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "psn",
            "PlayStation Network",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "miniclip",
            "Miniclip",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "poptropica",
            "Poptropica",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "moshimonsters",
            "Moshi Monsters",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "toontown",
            "Toontown Online",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "maplestory",
            "MapleStory",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "wow",
            "World of Warcraft",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "battlenet",
            "Battle.net",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "wizard101",
            "Wizard101",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "animaljam",
            "Animal Jam",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "leagueoflegends",
            "League of Legends",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "xfire",
            "Xfire",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "gaiaonline",
            "Gaia Online",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "secondlife",
            "Second Life",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "stardoll",
            "Stardoll",
            "friends",
            "post",
            ["Gameplay Clip", "Screenshot", "Trade Offer", "Achievement", "Guide"],
            8,
          ],
          [
            "myspace",
            "MySpace",
            "friends",
            "post",
            ["Status", "Photo", "Top 8 Update", "Song", "Bulletin"],
            13,
          ],
          ["vine", "Vine", "followers", "vine", ["Comedy", "Dance", "Prank", "Loop", "Music"], 13],
          ["bebo", "Bebo", "friends", "post", ["Status", "Photo", "Quiz", "Skin"], 13],
          ["friendster", "Friendster", "friends", "post", ["Status", "Photo", "Testimonial"], 13],
          ["xanga", "Xanga", "subscribers", "blog post", ["Rant", "Poem", "Diary", "Song Lyrics"], 13],
          ["googleplus", "Google+", "followers", "post", ["Status", "Photo", "Hangout", "Link"], 13],
          ["orkut", "Orkut", "friends", "scrap", ["Scrap", "Photo", "Testimonial"], 13],
          ["periscope", "Periscope", "followers", "broadcast", ["Live", "Q&A", "Concert", "IRL"], 13],
          ["path", "Path", "friends", "moment", ["Moment", "Photo", "Check-in"], 13],
          ["yikyak", "Yik Yak", "followers", "yak", ["Joke", "Confession", "Campus News"], 13],
          ["flickr", "Flickr", "followers", "photo", ["Landscape", "Portrait", "Street", "Pet"], 13],
          ["musically", "Musical.ly", "fans", "musical.ly", ["Lip Sync", "Dance", "Comedy"], 13],
          ["netflix", "Netflix", "profiles", "review", ["Review"], 18],
          ["hulu", "Hulu", "profiles", "review", ["Review"], 18],
          ["disneyplus", "Disney+", "profiles", "review", ["Review"], 18],
        ],
        NON_SOCIAL = new Set(["netflix", "hulu", "disneyplus"]),
        notSocial = (e) => NON_SOCIAL.has(socBase(e)),
        SOC_GAMES = [
          "Solitaire",
          "Minecraft",
          "Fortnite",
          "BitLife",
          "Tetris",
          "Among Us",
          "Roblox",
          "Pac-Man",
          "Mario Kart",
          "chess",
        ],
        SOC_TAIL = {
          BitLife: () => " of you playing BitLife mindlessly",
          Gaming: () => ` of you playing ${pickR(SOC_GAMES)}`,
          "How-To": () =>
            ` showing how to ${pickR(["tie a tie", "fold a fitted sheet", "make pancakes", "change a tire", "grow a beard", "cook rice"])}`,
          Challenge: () =>
            ` of you doing the ${pickR(["ice bucket", "cinnamon", "one chip", "mannequin", "bottle flip"])} challenge`,
          Dance: () =>
            ` of you dancing to ${pickR(["a viral song", "the Macarena", "disco music", "a K-pop hit"])}`,
          Educational: () =>
            ` about ${pickR(["black holes", "the Roman Empire", "taxes", "dinosaurs", "budgeting"])}`,
          Music: () => " of you singing an original song",
          Prank: () =>
            ` of you pranking ${pickR(["your neighbor", "a stranger", "your mom", "your best friend"])}`,
          Reaction: () =>
            ` of you reacting to ${pickR(["a movie trailer", "old memes", "a music video", "your baby photos"])}`,
          Unboxing: () =>
            ` of you unboxing ${pickR(["a new phone", "a mystery box", "sneakers", "a gaming console"])}`,
          Vlog: () => " about your day",
        };
      state.social = {};
      const SOC_RPM = {
          youtube: [1.5, 5],
          twitch: [2, 4],
          facebook: [0.5, 2.5],
          instagram: [0.3, 1.5],
          tiktok: [0.4, 1],
          twitter: [0.1, 0.8],
          soundcloud: [2.5, 4],
          onlyfans: [8, 25],
          snapchat: [0.3, 1.2],
          reddit: [0.1, 0.6],
          pinterest: [0.3, 1.2],
          linkedin: [0.8, 2.5],
          threads: [0.1, 0.7],
          discord: [0.5, 1.5],
          kick: [2.5, 6],
          bluesky: [0.1, 0.5],
          tumblr: [0.1, 0.6],
          bereal: [0.05, 0.3],
          patreon: [10, 30],
          telegram: [0.3, 1.2],
        },
        PROMO_PRODUCTS = [
          ["Lotion", 0.15],
          ["Energy Drinks", 0.3],
          ["A Mobile Game", 0.35],
          ["Protein Powder", 0.2],
          ["Teeth Whitening Strips", 0.3],
          ["A VPN", 0.25],
          ["Sunglasses", 0.1],
          ["Meal Kits", 0.2],
          ["A Mattress", 0.15],
          ["Hair Gummies", 0.5],
          ["Sneakers", 0.1],
          ["A Dating App", 0.35],
          ["Headphones", 0.1],
          ["Skincare", 0.15],
          ["A Budgeting App", 0.2],
          ["Phone Cases", 0.15],
          ["Hot Sauce", 0.1],
          ["Vitamins", 0.25],
          ["A Crypto Coin", 0.8],
          ["Detox Tea", 0.7],
          ["A Gambling App", 0.75],
          ["Vape Pens", 0.7],
          ["A Get-Rich-Quick Course", 0.85],
          ["Fake Designer Bags", 0.65],
        ],
        PROMO_RATE = {
          youtube: 1,
          instagram: 0.9,
          twitch: 0.8,
          tiktok: 0.6,
          facebook: 0.5,
          onlyfans: 0.5,
          twitter: 0.4,
          soundcloud: 0.3,
          snapchat: 0.5,
          reddit: 0.3,
          pinterest: 0.6,
          linkedin: 0.7,
          threads: 0.4,
          discord: 0.4,
          kick: 0.7,
          bluesky: 0.3,
          tumblr: 0.3,
          bereal: 0.2,
          patreon: 0.6,
          telegram: 0.4,
        },
        socBase = (e) => String(e).split("~")[0],
        socOf = (e) => {
          const t = SOCIALS.find((t) => t[0] === socBase(e));
          return t && "friends" === t[2] && GAMING.has(t[0])
            ? [t[0], t[1], "pending friends", ...t.slice(3)]
            : t && "twitter" === t[0] && socYear() >= 2023
              ? ["twitter", "X", t[2], "post", t[4], t[5]]
              : t;
        },
        fmtN = (e) => Math.round(e).toLocaleString("en-US");
      function socSelCard({
        icon: e,
        title: t,
        lead: a,
        label: o,
        opts: n,
        btn: s,
        onGo: r,
        tag: i = "Social",
        rows: l = [],
      }) {
        (ev.innerHTML = `<div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div><div class="jm-tag" style="margin-top:12px">${i}</div>\n      <h4><img src="${e}" alt=""><span>${t}</span></h4><div class="lead">${a}</div>\n      ${l.length ? `<table><tbody>${l.map(([e, t]) => `<tr><td style="text-align:center;padding-left:0"><b>${e}:</b> ${t}</td></tr>`).join("")}</tbody></table>` : ""}\n      ${o ? `<label class="hr-lab">${o}</label><div class="hr-sel"><select id="socSel">${n.map((e, t) => `<option value="${t}">${e}</option>`).join("")}</select></div>` : ""}\n      <button class="jm-apply ev-btn" id="socGo">${s}</button>`),
          (ev.style.overflow = "visible");
        const c = () => {
          evWrap.classList.remove("open"), (ev.style.overflow = "");
        };
        (document.getElementById("propX").onclick = c),
          (document.getElementById("socGo").onclick = () => {
            const e = o ? +document.getElementById("socSel").value : 0;
            c(), screen.classList.remove("open"), r(e);
          }),
          evWrap.classList.add("open");
      }
      let socialBack = null,
        socialCat = "social";
      const SOCIAL_OFF = new Set(["onlyfans", "soundcloud", "podcast"]),
        GAMING = new Set([
          "runescape",
          "roblox",
          "clubpenguin",
          "habbo",
          "neopets",
          "webkinz",
          "minecraft",
          "steam",
          "xboxlive",
          "psn",
          "miniclip",
          "poptropica",
          "moshimonsters",
          "toontown",
          "maplestory",
          "wow",
          "battlenet",
          "wizard101",
          "animaljam",
          "leagueoflegends",
          "xfire",
          "gaiaonline",
          "secondlife",
          "stardoll",
        ]),
        socCat = (e) =>
          "podcast" === e
            ? "social"
            : NON_SOCIAL.has(socBase(e))
              ? "subs"
              : GAMING.has(socBase(e))
                ? "gaming"
                : "social",
        SOC_CATS = { social: "SOCIAL MEDIA", gaming: "GAMING PLATFORMS", subs: "SUBSCRIPTIONS" };
      let catCycle = 0;
      function cycleCatIcons() {
        clearInterval(catCycle);
        const e = [...sList.querySelectorAll("img.cyc")];
        if (!e.length) return;
        const t = (e) => {
            const t = SOCIALS.map((e) => e[0]).filter((t) => socCat(t) === e),
              a = t.filter((e) => socLive(e));
            return (a.length ? a : t).map((e) => socIcon(e));
          },
          a = e.map((e) => ({ im: e, L: t(e.dataset.cat), i: 0 }));
        a.forEach((e) => {
          (e.i = Math.max(0, e.L.indexOf(e.im.getAttribute("src")))), e.L.length && (e.im.src = e.L[e.i]);
        }),
          (catCycle = setInterval(() => {
            if (!a.some((e) => e.im.isConnected)) return clearInterval(catCycle);
            a.forEach((e) => {
              e.L.length > 1 && ((e.i = (e.i + 1) % e.L.length), (e.im.src = e.L[e.i]));
            });
          }, 3e3));
      }
      function openSocial(e, t) {
        if (isOldEra())
          return oldEraNo("gaming" === t ? "gaming" : "subs" === t ? "streaming" : "social media");
        "function" == typeof e && ((socialBack = e), (socialCat = t || "social")),
          (sTitle.textContent = SOC_CATS[socialCat]),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = socialBack || openActivities);
        const a = (e) => {
            const [, t, a] = socOf(e),
              o = state.social[e];
            return emailLockedFor(e)
              ? `<div class="row dis" data-soc="${e}"><img src="${socIcon(socBase(e))}"><div class="t"><b>${t} <em>@${showHandle(e)}</em></b><span><img src="emoji/1f512.png" alt="" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px">Locked: you lost access to ${escAttr(o.email)}</span></div></div>`
              : `<div class="row${socEnded(e) ? " dis" : ""}" data-soc="${e}"><img src="${o.verified && !o.banned ? verifyIcon(e) : socIcon(socBase(e))}"><div class="t"><b>${t} <em>@${showHandle(e)}</em></b><span>${o.stranger ? `${o.stranger}'s account · ` : ""}${socEnded(e) ? `Shut down in ${SOC_END[socBase(e)]}` : o.banned ? `Account ${disabledTxt(e).replace("Disabled", "disabled")}` : "discord" === socBase(e) ? "" : notSocial(e) ? subStatus(e) : `${fmtN(o.subs)} ${a}`}</span></div>${CHEV}</div>`;
          },
          o = SOCIAL_OFF.has("podcast")
            ? '<div class="row dis" data-soc="podcast"><img src="social/podcast.png"><div class="t"><b>Podcast</b><span>Start your own podcast</span></div></div>'
            : `<div class="row" data-soc="podcast"><img src="social/podcast.png"><div class="t"><b>Podcast</b><span>Start your own podcast</span></div>${DOTS}</div>`,
          n = [...SOCIALS.map((e) => e[0]), "podcast"]
            .filter((e) => socCat(e) === socialCat)
            .sort((e, t) =>
              ("podcast" === e ? "Podcast" : socOf(e)[1]).localeCompare(
                "podcast" === t ? "Podcast" : socOf(t)[1],
              ),
            ),
          s = (e) =>
            Object.keys(state.social)
              .filter((t) => socBase(t) === e)
              .sort(),
          r = (e) => {
            const t = state.social[e];
            return !t.stranger && !t.banned && !emailLockedFor(e);
          },
          i = n.filter((e) => s(e).length),
          l = n.filter((e) => !s(e).some(r)),
          c =
            "social" === socialCat && socYear() >= MARKET_OPENS
              ? state.age < 13
                ? '<div class="row dis" data-soc="market"><img src="emoji/1f6d2.png"><div class="t"><b>Username Market</b></div></div>'
                : `<div class="row" data-soc="market"><img src="emoji/1f6d2.png"><div class="t"><b>Username Market</b><span>Buy rare usernames with crypto</span></div>${CHEV}</div>`
              : "",
          d = (state.soldAccts || [])
            .map((e, t) => [e, t])
            .filter(([e]) => socOf(e.key) && socCat(socBase(e.key)) === socialCat)
            .map(
              ([e, t]) =>
                `<div class="row" data-sold="${t}"><img src="${socIcon(socBase(e.key))}" style="filter:grayscale(1);opacity:.5"><div class="t"><b>${socOf(e.key)[1]} <em>@${escAttr(e.h)}</em></b><span><img src="emoji/1f501.png" alt="" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px">Unavailable · tap to try to recover</span></div>${CHEV}</div>`,
            )
            .join("");
        (sList.innerHTML =
          c +
          i.flatMap((e) => s(e).map(a)).join("") +
          d +
          `<div class="sec">${"subs" === socialCat ? "Available" : "gaming" === socialCat ? "Platforms" : "Inactive Channels"}</div>` +
          l
            .map((e) =>
              "podcast" === e
                ? o
                : ((e) => s(e).some((e) => !state.social[e].stranger))(e) && socLive(e)
                  ? `<div class="row" data-newacct="${e}"><img src="${socIcon(e)}"><div class="t"><b>${socOf(e)[1]}</b><span>Sign up for another ${socOf(e)[1]} account</span></div>${DOTS}</div>`
                  : (([e, t, a]) => {
                      const o = state.social[e];
                      if (!o && !socLive(e))
                        return `<div class="row dis" data-soc="${e}"><img src="${socIcon(socBase(e))}"><div class="t"><b>${t}</b>${socEnded(e) ? `<span>Shut down in ${SOC_END[e]}</span>` : ""}</div></div>`;
                      if (SOCIAL_OFF.has(e))
                        return `<div class="row dis" data-soc="${e}"><img src="${socIcon(socBase(e))}"><div class="t"><b>${t}</b><span>Sign up for ${t}</span></div></div>`;
                      const n = (socOf(e) || [])[5] || 0;
                      return !o && state.age < n
                        ? `<div class="row dis" data-soc="${e}"><img src="${socIcon(socBase(e))}"><div class="t"><b>${t}</b></div></div>`
                        : `<div class="row" data-soc="${e}"><img src="${o && o.verified && !o.banned ? verifyIcon(e) : socIcon(e)}"><div class="t"><b>${t}</b><span>${o ? (o.banned ? "Account disabled" : `${fmtN(o.subs)} ${a}`) : `Sign up for ${t}`}</span></div>${o ? CHEV : DOTS}</div>`;
                    })(socOf(e)),
            )
            .join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-sold]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"), window.soldRecover && soldRecover(+e.dataset.sold, () => openSocial());
              }),
          ),
          sList.querySelectorAll("[data-newacct]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice");
                const t = e.dataset.newacct,
                  a = (socOf(t) || [])[5] || 0;
                if (state.age < a)
                  return notice(
                    "Too Young",
                    `You must be at least ${a} to sign up for ${socOf(t)[1]}.`,
                    null,
                    !0,
                  );
                socialExtraAccount(t);
              }),
          ),
          sList.querySelectorAll("[data-soc]").forEach(
            (e) =>
              (e.onclick = () => {
                const t = e.dataset.soc;
                if (
                  e.classList.contains("dis") &&
                  !state.social[t] &&
                  !socEnded(t) &&
                  !SOCIAL_OFF.has(t) &&
                  "podcast" !== t
                )
                  return;
                if ("market" === t)
                  return state.age < 13
                    ? notice("Too Young", "You must be at least 13 to use the Username Market.", null, !0)
                    : openNameMarket();
                if (SOCIAL_OFF.has(t))
                  return notice(
                    "Error",
                    `${"podcast" === t ? "Podcast" : socOf(t)[1]} is not available right now.`,
                    null,
                    !0,
                  );
                if ("podcast" !== t && !state.social[t] && !socLive(t))
                  return socEnded(t)
                    ? notice("Shut down", `${socOf(t)[1]} shut down in ${SOC_END[t]}.`, null, !0)
                    : notice(
                        "Not invented yet",
                        `${socOf(t)[1]} doesn't exist until ${SOC_LAUNCH[t]}.`,
                        null,
                        !0,
                      );
                if ("podcast" === t) return comingSoon();
                if (state.social[t] && emailLockedFor(t))
                  return jCard({
                    tag: "Social",
                    iconSrc: socIcon(socBase(t)),
                    title: "Locked out",
                    close: !0,
                    lead: `You lost access to ${state.social[t].email}, the email on this account. Recover the email first (Assets → Email), or start a new ${socOf(t)[1]} account with a different email.`,
                    choices: [
                      ["Make a new account", () => setTimeout(() => socialExtraAccount(t), 60)],
                      ["OK", () => {}],
                    ],
                  });
                if (state.social[t]) return openSocialAccount(t);
                {
                  const e = (socOf(t) || [])[5] || 0;
                  if (state.age < e)
                    return notice(
                      "Too Young",
                      `You must be at least ${e} to sign up for ${socOf(t)[1]}.`,
                      null,
                      !0,
                    );
                }
                const [, a, , , , o] = socOf(t);
                socSelCard({
                  icon: `${socIcon(socBase(t))}`,
                  title: a,
                  lead: `Sign up for ${/^[AEIOU]/.test(a) ? "an" : "a"} ${a} account today!`,
                  btn: `Sign up for ${a}`,
                  onGo: () => {
                    if (state.age < o)
                      return notice("Too Young", `You must be at least ${o} to sign up for ${a}.`, null, !0);
                    pickEmail(a, (e) =>
                      signUpWithPw(t, a, e, () =>
                        notice(
                          "Building a community",
                          `You signed up for ${/^[AEIOU]/.test(a) ? "an" : "a"} ${a} account. Check ${e} for the verification email.`,
                          null,
                          !0,
                        ),
                      ),
                    );
                  },
                });
              }),
          );
      }
      const EMAIL_PROV = {
          hotmail: { name: "Hotmail", year: 1996, min: 1 },
          yahoo: { name: "Yahoo Mail", year: 1997, min: 4 },
          gmail: { name: "Gmail", year: 2004, min: 6 },
        },
        emailDomain = (e) =>
          "gmail" === e
            ? "gmail.com"
            : "yahoo" === e
              ? "yahoo.com"
              : socYear() >= 2013
                ? "outlook.com"
                : "hotmail.com",
        provName = (e) => ("hotmail" === e && socYear() >= 2013 ? "Outlook" : EMAIL_PROV[e].name),
        todayStr = () => `${MON3[rint(0, 11)]} ${rint(1, 28)}, ${socYear()}`;
      function eraDomain(e) {
        const t =
          e < 2005
            ? [
                ["aol.com", 4],
                ["hotmail.com", 4],
                ["yahoo.com", 4],
                ["msn.com", 2],
                ["earthlink.net", 1],
                ["juno.com", 1],
              ]
            : e < 2010
              ? [
                  ["hotmail.com", 4],
                  ["yahoo.com", 4],
                  ["aol.com", 2],
                  ["gmail.com", 3],
                  ["msn.com", 1],
                ]
              : e < 2015
                ? [
                    ["gmail.com", 7],
                    ["yahoo.com", 3],
                    [e >= 2013 ? "outlook.com" : "hotmail.com", 2],
                    ...(e >= 2011 ? [["icloud.com", 2]] : []),
                  ]
                : [
                    ["gmail.com", 10],
                    ["icloud.com", 3],
                    ["outlook.com", 2],
                    ["yahoo.com", 1],
                    ...(e >= 2016 ? [["proton.me", 1]] : []),
                  ];
        let a = Math.random() * t.reduce((e, [, t]) => e + t, 0);
        for (const [e, o] of t) if ((a -= o) < 0) return e;
        return t[0][0];
      }
      function personAddr(e, t) {
        const a = (state.emailContacts ||= {});
        if ("rand" !== t && a[e]) return a[e];
        const o = socYear(),
          [n, ...s] = String(e)
            .replace(/\s*\(.*\)$/, "")
            .toLowerCase()
            .replace(/[^a-z ]/g, "")
            .split(" "),
          r =
            ["parent", "sibling", "grand", "child"].includes(t) && "string" == typeof SURNAME
              ? SURNAME.toLowerCase().replace(/[^a-z]/g, "")
              : "",
          i = s.join("") || r || pickR(["smith", "jones", "lee", "garcia", "brown", "miller"]),
          l = n || "user",
          c = rint(1, 99),
          d = o - rint(30, 60),
          u = ("friend" === t || "sibling" === t || "rand" === t) && chance(0.6),
          h = `${pickR("parent" === t || "grand" === t ? [`${l}.${i}`, `${l}${i}${d}`, `${l}_${i}`, `${l[0]}${i}${c}`] : o < 2005 ? [`${l}${c}`, `${l}_${i}`, `cool${l}${c}`, `${l}${i}`] : o < 2010 && u ? [`xX${l}Xx`, `${l}_rawr${c}`, `lil_${l}${c}`, `sk8r${l}`, `${l}luvs${pickR(["music", "cats", "pizza"])}`, `${l}xoxo${c}`] : o < 2015 && u ? [`${l}${i}${c}`, `${l}_${c}`, `its${l}`, `${l}.${i}`] : [`${l}.${i}`, `${l}${i}${c}`, `${l}.${i}${c}`, `${l[0]}${i}`]).replace(/[^a-zA-Z0-9._]/g, "")}@${eraDomain(o)}`;
        return "rand" === t ? h : (a[e] = h);
      }
      const serviceAddr = (e) => {
        const t = String(e)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
        return /lottery|prince|free|miracle|giveaway|gift|ico|nft|dropship|ringtone/.test(t)
          ? `${pickR(["winner", "offer", "claim", "promo"])}${rint(100, 999)}@${pickR(["mail-offers.biz", "win-now.info", "xclusivedeals.net", "promo-center.ru"])}`
          : `no-reply@${t.slice(0, 18) || "mail"}.com`;
      };
      function mailTo(e, t, a, o, n, s) {
        if (isOldEra()) return;
        const r = (state.emails || []).find((t) => t.addr === e);
        if (!r) return;
        let i = rint(0, 11),
          l = rint(1, 28),
          c = socYear(),
          d = 400 * c + 31 * i + l;
        if (s) {
          const e = state.txClock && state.txClock.y === c ? state.txClock : (state.txClock = { y: c, n: 0 });
          e.n++,
            (i = Math.min(11, Math.floor(e.n / 4))),
            (l = 1 + ((3 * e.n) % 28)),
            (d = 400 * c + 380 + Math.min(19, e.n) + e.n / 1e3);
        }
        const u = {
          from: t,
          fa: n || serviceAddr(t),
          subj: a,
          body: o,
          date: `${MON3[i]} ${l}, ${c}`,
          t: d,
          unread: !0,
          now: !!s,
        };
        return (
          (r.inbox ||= []).push(u),
          r.inbox.length > 400 && (r.inbox = r.inbox.sort((e, t) => (e.t || 0) - (t.t || 0)).slice(-400)),
          u
        );
      }
      function bankFor() {
        const e = socYear(),
          t = "us" === state.country;
        if (isOldEra()) return myBank1800().name;
        const a = t
          ? e < 2009
            ? ["Washington Mutual", "Wachovia", "Bank of America", "Chase", "Wells Fargo", "Citibank"]
            : e < 2015
              ? ["Bank of America", "Chase", "Wells Fargo", "Citibank", "PNC", "Capital One"]
              : [
                  "Bank of America",
                  "Chase",
                  "Wells Fargo",
                  "Capital One",
                  "Chime",
                  "Ally Bank",
                  ...(e >= 2018 ? ["SoFi"] : []),
                ]
          : ["HSBC", "Barclays", "Santander", "BNP Paribas", "Deutsche Bank", "ING", "Citibank"];
        return (state.bank ||= pickR(a));
      }
      const BANK_FATE = { "Washington Mutual": ["Chase", 2008], Wachovia: ["Wells Fargo", 2008] };
      state.bankOpen = "custodial";
      const bankOpen = () => !!state.bankOpen,
        bankEmail = () => {
          const e = state.emails || [];
          return e.find((e) => e.addr === state.bankEmail) || e[0] || null;
        },
        bankMailTo = (...e) => {
          const t = bankEmail();
          return t && bankOpen() ? mailTo(t.addr, ...e) : null;
        },
        bankAddr = () =>
          `alerts@${bankFor()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")}.com`;
      let bankPending = 0,
        bankTimer = null,
        txNote = null;
      const saleTransfer = (e, t) => {
        txNote = {
          memo: `Bank transfer from ${t || `${uname(chance(0.5) ? "m" : "f")} ${ulast(state.country)}`}`,
          site: socBase(e),
        };
      };
      function bankWatch() {
        if (state.dead || "number" != typeof state.money) return;
        if (null == state.lastMoney) return void (state.lastMoney = state.money);
        const e = state.money - state.lastMoney;
        (state.lastMoney = state.money),
          Math.abs(e) < 1 ||
            ((bankPending += e),
            clearTimeout(bankTimer),
            (bankTimer = setTimeout(() => {
              const e = Math.round(bankPending);
              if (((bankPending = 0), !e)) return;
              const t = log.lastElementChild && log.lastElementChild.querySelector("p:last-of-type"),
                a = txNote;
              txNote = null;
              const o = a ? a.memo : t ? t.textContent.trim() : "",
                n = Object.keys(state.payApps || {}).filter((e) => PAY_APPS.some((t) => t.id === e)),
                s = e < 0 && -e <= localPrice(2e3) && n.length && chance(0.5) ? pickR(n) : null,
                r = {
                  y: socYear(),
                  age: state.age,
                  amt: e,
                  memo: o.slice(0, 140),
                  bank: bankFor(),
                  app: s,
                  site: a && a.site,
                };
              if (
                (!a &&
                  e > 0 &&
                  state.job &&
                  state.job.pay &&
                  e >= 0.3 * state.job.pay &&
                  e <= 1.6 * state.job.pay + 1 &&
                  (r.pay = String(state.job.emp || state.job.c || state.job.t || "EMPLOYER")),
                a && a.type && ((r.type = a.type), (r.desc = a.desc)),
                txMeta(r),
                (state.bankTx ||= []).push(r),
                (state.bankTx = state.bankTx.slice(-300)),
                !(state.emails || []).length || !bankOpen())
              )
                return;
              const i = bankFor(),
                l = (state.bankAcct ||= String(rint(1e3, 9999)));
              e > 0
                ? bankMailTo(
                    i,
                    `🏦 Deposit received: ${usd(e)}`,
                    `A deposit of ${usd(e)} was made to your account ending in ${l}.<br><b>Details:</b> ${r.desc}<br><b>Balance:</b> ${usd(state.money)}`,
                    bankAddr(),
                    !0,
                  )
                : bankMailTo(
                    i,
                    `🧾 Receipt: ${usd(-e)} payment`,
                    `A payment of ${usd(-e)} was made from your account ending in ${l}.<br><b>For:</b> ${r.desc}<br><b>Balance:</b> ${usd(state.money)}<br><b>Ref:</b> ${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
                    bankAddr(),
                    !0,
                  );
            }, 40)));
      }
      function bankYear() {
        savingsInterestYear();
        const e = BANK_FATE[state.bank];
        if (!e || socYear() <= e[1] || !(state.emails || []).length) return;
        const t = state.bank;
        (state.bank = e[0]),
          bankMailTo(
            e[0],
            `Welcome to ${e[0]}`,
            `${t} is now part of ${e[0]}. Your account and balance moved over automatically.`,
            bankAddr(),
          ),
          say(`My bank, ${t}, was taken over by ${e[0]}.`);
      }
      const BANKS = [
          ["Chase", 1955, 0, "chase"],
          ["Bank of America", 1904, 0, "bankofamerica"],
          ["Wells Fargo", 1852, 0, "wellsfargo"],
          ["Citibank", 1812, 0, "citibank"],
          ["Washington Mutual", 1889, 2008, "wamu"],
          ["Wachovia", 1879, 2008, "wachovia"],
          ["Capital One", 1994, 0, "capitalone"],
          ["PNC", 1983, 0, "pnc"],
          ["U.S. Bank", 1997, 0, "usbank"],
          ["TD Bank", 2008, 0, "tdbank"],
          ["Navy Federal", 1933, 0, "navyfederal"],
          ["Discover Bank", 1986, 0, "discover"],
          ["Ally Bank", 2009, 0, "ally"],
          ["Chime", 2013, 0, "chime"],
          ["SoFi", 2018, 0, "sofi"],
          ["HSBC", 1865, 0, "hsbc"],
          ["Barclays", 1896, 0, "barclays"],
          ["Santander", 1857, 0, "santander"],
        ],
        PAY_APPS = [
          { id: "paypal", name: "PayPal", y: 1998, age: 13, logo: "paypal" },
          { id: "venmo", name: "Venmo", y: 2009, age: 18, logo: "venmo" },
          {
            id: "googlepay",
            name: "Google Pay",
            y: 2011,
            age: 13,
            logo: "googlepay",
            old: ["Google Wallet", 2018],
          },
          { id: "cashapp", name: "Cash App", y: 2013, age: 13, logo: "cashapp", old: ["Square Cash", 2018] },
          { id: "applepay", name: "Apple Pay", y: 2014, age: 13, logo: "applepay" },
          { id: "samsungpay", name: "Samsung Pay", y: 2015, age: 13, logo: "samsungpay" },
          { id: "zelle", name: "Zelle", y: 2017, age: 18, logo: "zelle" },
          { id: "applecash", name: "Apple Cash", y: 2017, age: 13, logo: "applecash" },
        ],
        appName = (e) => (e.old && socYear() < e.old[1] ? e.old[0] : e.name),
        LOGO_ERAS = {
          bankofamerica: [2018],
          wellsfargo: [2020],
          usbank: [2023],
          discover: [2001],
          paypal: [2014, 2024],
          googlepay: [2015, 2018, 2020],
        },
        bankLogo = (e, t = "1f3e6") => {
          const a = (LOGO_ERAS[e] || []).filter((e) => e <= socYear()).pop();
          return `<img src="bank/${e}${a ? `-${a}` : ""}.png" style="object-fit:contain;background:#fff;border-radius:7px;padding:2px;box-sizing:border-box" onerror="this.onerror=null;this.style.background='none';this.style.padding='0';this.src='emoji/${t}.png'">`;
        },
        bankFile = (e) => (BANKS.find((t) => t[0] === e) || [])[3] || "none",
        pickBy = (e, t) => e[t % e.length],
        capsWord = (e) =>
          String(e || "")
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .toUpperCase()
            .replace(/[^A-Z0-9 ]/g, "")
            .trim(),
        TX_SITES = [...SOCIALS.map((e) => [e[1], e[0]]), ["X", "twitter"]].sort(
          (e, t) => t[0].length - e[0].length,
        ),
        siteIn = (e) =>
          TX_SITES.find(
            ([t]) => t.length > 2 && new RegExp(`\\b${t.replace(/[.+*?^$()[\]{}|\\]/g, "\\$&")}\\b`).test(e),
          ),
        TX_KINDS = [
          [
            /ring|necklace|diamond|gem|jewel|bracelet|earring/i,
            "Debit Card Purchase",
            ["KAY JEWELERS", "ZALES", "TIFFANY & CO", "JARED"],
            "1f48d",
          ],
          [
            /\bpets?\b|dog|\bcat\b|puppy|kitten|adopt|hamster|parrot|horse|vet\b/i,
            "Debit Card Purchase",
            ["PETSMART", "PETCO", "PET SUPPLIES PLUS"],
            "1f43e",
          ],
          [
            /\bcar\b|truck|motorcycle|vehicle|dealership|mechanic/i,
            "Debit Card Purchase",
            ["CARMAX", "AUTONATION", "AUTO DEALER"],
            "1f697",
          ],
          [/mortgage|house|home|property|landlord/i, "ACH Debit", ["MORTGAGE PMT", "HOME LOAN PMT"], "1f3e0"],
          [/rent|apartment/i, "ACH Debit", ["RENT PAYMENT"], "1f3e0"],
          [
            /hospital|doctor|surgery|dentist|therapy|medic|pharma/i,
            "Debit Card Purchase",
            ["MEDICAL CENTER", "CVS PHARMACY", "WALGREENS"],
            "1f3e5",
          ],
          [
            /divorce|lawyer|court|sued|lawsuit|\bfine\b|bail|police|ticket/i,
            "ACH Debit",
            ["LAW OFFICES", "COUNTY COURT FEES"],
            "2696-fe0f",
          ],
          [
            /casino|\bbet\b|gambl|lottery|slot|poker|blackjack/i,
            "Debit Card Purchase",
            ["CASINO", "STATE LOTTERY"],
            "1f3b0",
          ],
          [/school|college|tuition|university|class/i, "ACH Debit", ["TUITION PMT", "STUDENT ACCT"], "1f393"],
          [
            /vacation|trip|flight|hotel|cruise/i,
            "Debit Card Purchase",
            ["EXPEDIA", "DELTA AIR LINES", "MARRIOTT"],
            "2708-fe0f",
          ],
          [
            /food|pizza|burger|restaurant|dinner|lunch|meal/i,
            "Debit Card Purchase",
            ["RESTAURANT", "DOORDASH"],
            "1f354",
          ],
          [/crypto|bitcoin|ethereum/i, "ACH Debit", ["COINBASE"], "1f4b0"],
          [/stock|invest|shares|fund/i, "Funds Transfer", ["BROKERAGE TRANSFER"], "1f4c8"],
          [/gift|birthday|present/i, "Debit Card Purchase", ["GIFT SHOP", "AMAZON"], "1f381"],
        ];
      function txMeta(e) {
        if (e.id) return e;
        (e.id = rint(1e6, 9999999)), (e.acct ||= "chk");
        const t = (state.bankTx || []).filter((t) => t.y === e.y && t.doy).pop();
        if (
          ((e.doy = Math.min(365, t ? t.doy + rint(0, 12) : rint(1, 40))),
          (e.tm = `${rint(1, 12)}:${String(rint(0, 59)).padStart(2, "0")} ${chance(0.5) ? "AM" : "PM"}`),
          e.type)
        )
          return e;
        const a = String(e.memo || ""),
          o = e.app && PAY_APPS.find((t) => t.id === e.app);
        if (e.site)
          return (
            (e.type = "Incoming Wire"),
            (e.desc = `WIRE FROM ${capsWord(a.replace(/^Bank transfer from /, ""))}`),
            e
          );
        if (e.pay)
          return (e.type = "Payroll"), (e.desc = `DIRECT DEP ${capsWord(e.pay).slice(0, 18)} PAYROLL`), e;
        if (/withdrew .*cash/i.test(a))
          return (e.type = "ATM Withdrawal"), (e.desc = "ATM WITHDRAWAL #" + (e.id % 1e4)), e;
        if (/deposited .*cash/i.test(a))
          return (e.type = "ATM Deposit"), (e.desc = "ATM CASH DEPOSIT #" + (e.id % 1e4)), e;
        const n = siteIn(a);
        if (n) {
          const t = capsWord(n[0]).replace(/ /g, ""),
            s = (a.match(/bought (?:an? |the )?(.+?)(?: \(| on | for | from |\.|$)/i) || [])[1],
            r = s
              ? capsWord(s)
                  .split(" ")
                  .filter((e) => e && e !== t && !/^(A|AN|THE|OF|AND|MY|NEW)$/.test(e))
                  .slice(-2)
                  .join("")
                  .slice(0, 14)
              : "";
          return (
            (e.type = e.amt > 0 ? "ACH Credit" : o ? `${appName(o)} Payment` : "Debit Card Purchase"),
            (e.desc = e.amt > 0 ? `${t} PAYOUT` : `PAID ${t}${r ? `*${r}` : ".COM"}`),
            (e.site = n[1]),
            e
          );
        }
        const s = TX_KINDS.find(([e]) => e.test(a));
        if (e.amt < 0) {
          const t = s ? pickBy(s[2], e.id) : "POS PURCHASE";
          return (
            (e.type = o ? `${appName(o)} Payment` : s ? s[1] : "Debit Card Purchase"),
            (e.desc = o ? `${capsWord(appName(o)).replace(/ /g, "")} *${t}` : t),
            e
          );
        }
        return (
          (e.type = /inherit|estate|\bwill\b/i.test(a)
            ? "Estate Transfer"
            : /gave me|gift|birthday/i.test(a)
              ? "Zelle Credit"
              : /sold|sale/i.test(a)
                ? "ACH Credit"
                : "ACH Deposit"),
          (e.desc =
            "Estate Transfer" === e.type
              ? "ESTATE DISTRIBUTION"
              : "Zelle Credit" === e.type
                ? "ZELLE FROM FAMILY"
                : "ACH Credit" === e.type
                  ? "SALE PROCEEDS"
                  : "DEPOSIT"),
          e
        );
      }
      function txIcon(e) {
        if (e.app) {
          const t = PAY_APPS.find((t) => t.id === e.app);
          if (t) return bankLogo(t.logo, "1f4b3");
        }
        if (e.site) return `<img src="${socIcon(e.site)}">`;
        const t = String(e.memo || "");
        return `<img src="emoji/${/Payroll/.test(e.type) ? "1f4bc" : /ATM|Transfer/.test(e.type) ? "1f3e6" : /Interest/.test(e.type) ? "1f4c8" : (TX_KINDS.find(([e]) => e.test(t)) || [])[3] || (e.amt > 0 ? "1f4b5" : "1f9fe")}.png" onerror="this.onerror=null;this.src='emoji/${e.amt > 0 ? "1f4b5" : "1f9fe"}.png'">`;
      }
      const ACCT_TYPES = [
          { id: "sav", name: "Savings", y: 0, rate: (e) => (e < 2009 ? 0.02 : e < 2022 ? 0.001 : 0.005) },
          { id: "mm", name: "Money Market", y: 0, rate: (e) => (e < 2009 ? 0.03 : e < 2022 ? 0.002 : 0.02) },
          { id: "hys", name: "High-Yield Savings", y: 2009, rate: (e) => (e < 2022 ? 0.012 : 0.042) },
        ],
        accts = () => (state.bankAccts ||= []),
        acctLabel = (e) => {
          return "chk" === e
            ? `CHECKING **${(state.bankAcct ||= String(rint(1e3, 9999)))}`
            : (t = accts().find((t) => t.num === e))
              ? `${(ACCT_TYPES.find((e) => e.id === t.type) || {}).name.toUpperCase()} **${t.num}`
              : "ACCOUNT";
          var t;
        },
        acctBal = (e) => ("chk" === e ? state.money : (accts().find((t) => t.num === e) || {}).bal || 0),
        sideTx = (e, t, a, o) => {
          const n = txMeta({
            y: socYear(),
            age: state.age,
            amt: t,
            memo: o,
            bank: bankFor(),
            acct: e,
            type: a,
            desc: o,
          });
          (state.bankTx ||= []).push(n), (state.bankTx = state.bankTx.slice(-300));
        };
      function acctPts(e) {
        const t = socYear(),
          a = [...(e.hist || [{ y: e.opened || t, bal: 0 }])];
        (a.length && a[a.length - 1].bal === e.bal) || a.push({ y: t + 0.5, bal: e.bal });
        let o = [a[0].bal];
        for (let e = 1; e < a.length; e++) {
          const t = a[e - 1].bal,
            n = a[e].bal;
          for (let e = 1; e <= 12; e++)
            o.push(t > 0 && n > 0 ? t * Math.pow(n / t, e / 12) : t + ((n - t) * e) / 12);
        }
        return o.length < 2 ? [e.bal, e.bal] : o;
      }
      function savingsYearCard(e) {
        const [t, a, o, n] = e[0],
          s = e.slice(1),
          r =
            (socYear(),
            window.INVEST && window.INVEST.chart
              ? `<div style="margin:8px -4px 0">${window.INVEST.chart(acctPts(t), "Balance Growth")}</div>`
              : "");
        bankSound(),
          jCard({
            tag: "Bank",
            iconSrc: "emoji/1f4c8.png",
            title: "Interest Earned",
            lead: `Your ${o.name.toLowerCase()} account at ${bankFor()} earned ${usd(a)} in interest this year.${r}`,
            rows: [
              ["Account", acctLabel(t.num)],
              ["APY", `${(100 * n).toFixed(2)}%`],
              ["Interest", `+${usd(a)}`],
              ["Balance", usd(t.bal)],
              ["Earned in All", usd(t.earned || 0)],
              ...s.map(([e, t]) => [acctLabel(e.num), `+${usd(t)} → ${usd(e.bal)}`]),
            ],
            ok: () => {},
          });
      }
      function savingsInterestYear() {
        const e = socYear(),
          t = [];
        for (const a of accts()) {
          const o = ACCT_TYPES.find((e) => e.id === a.type);
          if (!o) continue;
          const n = a.bal >= 1 ? Math.round(a.bal * o.rate(e)) : 0;
          n >= 1 &&
            ((a.bal += n),
            (a.earned = (a.earned || 0) + n),
            sideTx(a.num, n, "Interest Payment", `INTEREST PAID ${(100 * o.rate(e)).toFixed(2)}% APY`),
            say(
              `My ${o.name.toLowerCase()} account${a.trust ? " from my famous family" : ""} earned ${usd(n)} in interest this year (${(100 * o.rate(e)).toFixed(2)}% APY). It's now ${usd(a.bal)}.`,
            ),
            t.push([a, n, o, o.rate(e)])),
            (a.lastInt = n),
            (a.hist ||= [{ y: a.opened || e - 1, bal: 0 }]).push({ y: e, bal: a.bal }),
            (a.hist = a.hist.slice(-60));
        }
        t.length && (t.sort((e, t) => t[1] - e[1]), queuePopup(() => savingsYearCard(t)));
      }
      function openAcctCard() {
        if (state.age < 13)
          return notice("Too young", "Your parents handle your money until you're 13.", null, !0);
        const e = socYear(),
          t = ACCT_TYPES.filter((t) => e >= t.y);
        socSelCard({
          icon: "emoji/1f3e6.png",
          title: "Open an Account",
          tag: "Bank",
          lead: `Open a new account at ${bankFor()}. It starts empty; move money in with a transfer.`,
          label: "Account:",
          opts: t.map((t) => `${t.name} (${(100 * t.rate(e)).toFixed(2)}% APY)`),
          btn: "Open account",
          onGo: (a) => {
            const o = t[a],
              n = String(rint(1e3, 9999));
            accts().push({ type: o.id, num: n, bal: 0, opened: e, hist: [{ y: e, bal: 0 }], earned: 0 }),
              say(`I opened a ${o.name.toLowerCase()} account at ${bankFor()}.`),
              notice(
                "Account opened",
                `Your ${o.name} account ending in ${n} is open. Tap it to deposit money.`,
                () => openAcct(n),
                !0,
              );
          },
        });
      }
      function transferCard() {
        if (!accts().length)
          return notice(
            "No other accounts",
            "Open a savings or money market account first, then you can move money into it.",
            openBank,
            !0,
          );
        const e = accts().flatMap((e) => [
          ["chk", e.num],
          [e.num, "chk"],
        ]);
        socSelCard({
          icon: "emoji/1f3e6.png",
          title: "Transfer Money",
          tag: "Bank",
          lead: "Move money between your accounts.",
          label: "From → To:",
          opts: e.map(([e, t]) => `${acctLabel(e)} → ${acctLabel(t)}`),
          btn: "Next",
          onGo: (t) =>
            setTimeout(() => {
              const [a, o] = e[t];
              moveAcct("chk" === a ? o : a, "chk" === a, openBank);
            }, 60),
        });
      }
      function moveAcct(e, t, a) {
        const o = accts().find((t) => t.num === e);
        if (!o) return;
        const n = t ? state.money : o.bal;
        if (n < 1) return notice("No money", `${acctLabel(t ? "chk" : e)} is empty.`, a, !0);
        moneySlider({
          title: t ? "Deposit" : "Withdraw",
          icon: t ? "emoji/1f3e6.png" : "emoji/1f4b5.png",
          have: n,
          btn: t ? "Deposit" : "Withdraw",
          lead: t
            ? `Move money from checking (${usd(state.money)}) into ${acctLabel(e)}.`
            : `Move money from ${acctLabel(e)} (${usd(o.bal)}) back to checking.`,
          go: (n) => {
            (txNote = {
              memo: "transfer",
              type: "Funds Transfer",
              desc: `ONLINE TRANSFER ${t ? "TO" : "FROM"} ${o.type.toUpperCase()} *${e}`,
            }),
              t ? ((state.money -= n), (o.bal += n)) : ((o.bal -= n), (state.money += n)),
              sideTx(
                e,
                t ? n : -n,
                "Funds Transfer",
                `ONLINE TRANSFER ${t ? "FROM" : "TO"} CHK *${state.bankAcct}`,
              ),
              say(
                t
                  ? `I put ${usd(n)} into my ${acctLabel(e).split(" **")[0].toLowerCase()} account.`
                  : `I took ${usd(n)} out of my ${acctLabel(e).split(" **")[0].toLowerCase()} account.`,
              ),
              renderStats(),
              a && a();
          },
        });
      }
      function bankTaxCard() {
        const e = state.taxHistory || [],
          t = e.reduce((e, t) => e + (t.tax || 0), 0),
          a = e.reduce((e, t) => e + (t.gross || 0), 0),
          o = e[e.length - 1];
        jCard({
          tag: "Bank",
          iconSrc: "emoji/1f9fe.png",
          title: "Taxes",
          close: !0,
          lead: e.length
            ? `Taxes taken out of your paychecks over the years.<br><br><b>Recent years</b><br>${e
                .slice(-8)
                .reverse()
                .map(
                  (e) =>
                    `Age ${e.age} (${e.year}): earned ${usd(e.gross)}, paid ${usd(e.tax)}, kept ${usd(e.net)}`,
                )
                .join("<br>")}`
            : "You haven't paid any taxes yet. Once you have a job, the taxes taken out of each year's pay show up here.",
          rows: [
            ["Total Taxes Paid", usd(t)],
            ["Total Earned", usd(a)],
            ...(a ? [["Average Tax Rate", `${((t / a) * 100).toFixed(1)}%`]] : []),
            ...(o ? [["Last Year", `${usd(o.tax)} on ${usd(o.gross)}`]] : []),
          ],
          choices: state.job ? [["This year's paycheck breakdown", () => setTimeout(taxCard, 60)]] : [],
        });
      }
      function openAcct(e) {
        const t = accts().find((t) => t.num === e);
        if (!t) return openBank();
        const a = ACCT_TYPES.find((e) => e.id === t.type) || ACCT_TYPES[0],
          o = socYear(),
          n = a.rate(o),
          s = (state.bankTx || []).filter((t) => t.acct === e);
        (sTitle.textContent = a.name.toUpperCase()),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openBank);
        const r = acctPts(t),
          i =
            window.INVEST && window.INVEST.chart
              ? `<div style="padding:10px 16px 4px">${window.INVEST.chart(r, "Balance Growth")}</div>`
              : "";
        (sList.innerHTML =
          `<div class="row">${bankLogo(bankFile(bankFor()))}<div class="t"><b>${acctLabel(e)}</b><span>Available Balance ${usd(t.bal)} · ${(100 * n).toFixed(2)}% APY</span></div></div>` +
          i +
          `<div class="row sm"><img src="emoji/1f4c8.png"><div class="t"><b>Interest Earned</b><span>${usd(t.earned || 0)} in all · ${usd(t.lastInt || 0)} last year</span></div></div>` +
          `<div class="row sm" id="acIn"><img src="emoji/1f3e6.png"><div class="t"><b>Deposit</b><span>Move money in from checking (${usd(state.money)})</span></div>${DOTS}</div>` +
          `<div class="row sm" id="acOut"><img src="emoji/1f4b5.png"><div class="t"><b>Withdraw</b><span>Move money back to checking</span></div>${DOTS}</div>` +
          activityRow(s, "acAct") +
          `<div class="row sm" id="acClose"><img src="${socIcon("delete")}"><div class="t"><b>Close Account</b><span>Its balance moves to checking</span></div>${DOTS}</div>`),
          (sList.scrollTop = 0);
        const l = () => openAcct(e);
        (document.getElementById("acIn").onclick = () => {
          play("choice"), moveAcct(e, !0, l);
        }),
          (document.getElementById("acOut").onclick = () => {
            play("choice"), moveAcct(e, !1, l);
          }),
          (document.getElementById("acAct").onclick = () => {
            play("choice"), activityCard(s, acctLabel(e));
          }),
          (document.getElementById("acClose").onclick = () => {
            play("choice"), closeAcctCard(e);
          }),
          screen.classList.add("open");
      }
      function closeAcctCard(e) {
        const t = accts().find((t) => t.num === e);
        t &&
          socSelCard({
            icon: "emoji/1f3e6.png",
            title: acctLabel(e),
            tag: "Bank",
            lead: `Close this account? Its ${usd(t.bal)} moves to your checking account.`,
            btn: "Close account",
            onGo: () => {
              t.bal &&
                ((txNote = { memo: "transfer", type: "Funds Transfer", desc: `ACCOUNT CLOSURE *${e}` }),
                (state.money += t.bal)),
                (state.bankAccts = accts().filter((e) => e !== t)),
                renderStats(),
                say(`I closed my ${acctLabel(e).split(" **")[0].toLowerCase()} account.`),
                notice("Closed", "The account is closed.", openBank, !0);
            },
          });
      }
      const txDate = (e) => {
          const t = new Date(Date.UTC(e.y, 0, e.doy || 1));
          return `${t.getUTCMonth() + 1}/${t.getUTCDate()}/${e.y}`;
        },
        activityRow = (e, t) => {
          return `<div class="row" id="${t}"><img src="emoji/1f9fe.png"><div class="t"><b>Activity <em>(${fmtN(e.length)})</em></b><span>${e.length ? "Latest: " + ((a = txMeta(e[e.length - 1])), `${a.amt > 0 ? "+" : "−"}${usd(Math.abs(a.amt))} · ${a.desc || ""}`) : "Paychecks and purchases show up here"}</span></div>${CHEV}</div>`;
          var a;
        };
      function activityCard(e, t) {
        e.forEach(txMeta);
        const a = state.bankTx || [],
          o = socYear(),
          n = new Set(a.filter((e) => e.y === o).slice(-2));
        let s = "date",
          r = -1;
        ev.innerHTML = `<style>#ev .txw{position:relative;margin:6px -10px 0;background:#fff;border-radius:8px;color:#1d2433}\n        #ev .txl{max-height:min(58vh,470px);overflow-y:auto;scrollbar-width:none;padding-right:12px}#ev .txl::-webkit-scrollbar{display:none}\n        #ev table.tx{width:100%;border-collapse:collapse;font-size:11.5px;text-align:left;table-layout:fixed}\n        #ev table.tx th{position:sticky;top:0;background:#fff;font-weight:600;color:#333;padding:8px 5px;border-bottom:1px solid #d5dae2;white-space:nowrap;cursor:pointer;font-size:11.5px}\n        #ev table.tx td{padding:9px 5px;border-bottom:1px solid #e6e9ef;vertical-align:top;color:#1d2433}\n        #ev table.tx td small{display:block;color:#6b7280;font-size:10px;margin-top:1px}\n        #ev .tdesc{display:flex;align-items:flex-start;gap:5px}#ev .tdesc img{width:16px;height:16px;object-fit:contain;flex:none;margin-top:1px}\n        #ev .tdesc code{font:600 10.5px/1.3 ui-monospace,Menlo,Consolas,monospace;color:#1d2433;overflow-wrap:anywhere}\n        #ev .tst{font-size:11px}#ev .tst.p{color:#c2410c;font-weight:600}#ev td.ta{text-align:right;font-weight:600;white-space:nowrap}#ev th.ta{text-align:right}\n        #ev td.ta.in{color:#15803d}\n        .phone.dark #ev .txw{background:#1b2638;color:#e8eef6;box-shadow:0 0 0 1px #2c3b55}.phone.dark #ev table.tx th{background:#1b2638;color:#c9d4e2;border-bottom-color:#33435e}\n        .phone.dark #ev table.tx td{color:#e8eef6;border-bottom-color:#2a3850}.phone.dark #ev table.tx td small{color:#8fa1b8}.phone.dark #ev .tdesc code{color:#e8eef6}\n        .phone.dark #ev .tst.p{color:#fb923c}.phone.dark #ev td.ta.in{color:#4ade80}</style>\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div><div class="jm-tag" style="margin-top:12px">Bank</div>\n      <h4><img src="emoji/1f9fe.png" alt=""><span>${t}</span></h4>\n      <div class="txw"><div class="txl"><table class="tx"><colgroup><col style="width:66px"><col style="width:66px"><col><col style="width:78px"></colgroup>\n        <thead><tr><th data-s="date">Date ▾</th><th data-s="status">Status ▾</th><th data-s="type">Transaction ▾</th><th class="ta" data-s="amt">Amount ▾</th></tr></thead><tbody></tbody></table></div></div>`;
        const i = ev.querySelector("tbody"),
          l = () => {
            const t = (e) =>
                "amt" === s
                  ? e.amt
                  : "status" === s
                    ? n.has(e)
                      ? 0
                      : 1
                    : "type" === s
                      ? e.type || ""
                      : 400 * e.y + (e.doy || 0) + a.indexOf(e) / 1e5,
              o = [...e]
                .sort((e, a) => {
                  const o = t(e),
                    n = t(a);
                  return (o > n ? 1 : o < n ? -1 : 0) * r;
                })
                .slice(0, 300);
            (i.innerHTML = o.length
              ? o
                  .map(
                    (e) =>
                      `<tr><td>${txDate(e)}<small>${e.tm || ""}</small></td><td class="tst${n.has(e) ? " p" : ""}">${n.has(e) ? "Pending" : "Processed"}</td><td><b style="font-weight:600">${e.type}</b><div class="tdesc">${txIcon(e)}<code>${e.desc}</code></div><small>${acctLabel(e.acct || "chk")} · ID ${e.id}</small></td><td class="ta${e.amt > 0 ? " in" : ""}">${e.amt > 0 ? "" : "−"}${usd(Math.abs(e.amt))}</td></tr>`,
                  )
                  .join("")
              : '<tr><td colspan="4" style="text-align:center;padding:18px">No activity yet. Paychecks and purchases show up here.</td></tr>'),
              ev
                .querySelectorAll("th")
                .forEach(
                  (e) =>
                    (e.textContent =
                      e.textContent.replace(/ [▾▴]$/, "") +
                      (e.dataset.s === s ? (r < 0 ? " ▾" : " ▴") : " ▾")),
                );
          };
        ev.querySelectorAll("th").forEach(
          (e) =>
            (e.onclick = () => {
              play("choice"), s === e.dataset.s ? (r = -r) : ((s = e.dataset.s), (r = -1)), l();
            }),
        ),
          l(),
          (ev.style.overflow = "visible"),
          (document.getElementById("propX").onclick = () => {
            evWrap.classList.remove("open"), (ev.style.overflow = "");
          }),
          evWrap.classList.add("open"),
          blScroll(ev.querySelector(".txl"), "light")();
      }
      const bankSound = () =>
        isOldEra()
          ? play("coins")
          : document.querySelector(".phone").classList.contains("flui")
            ? play("atm")
            : chaChing();
      function lockBank(e) {
        if (state.bankLock || state.age >= 18 || state.dead) return !1;
        const t =
          Math.max(0, state.money || 0) +
          (state.bankAccts || []).reduce((e, t) => e + Math.max(0, t.bal || 0), 0);
        (state.money = 0),
          (state.bankAccts || []).forEach((e) => {
            e.bal = 0;
          });
        const a = chance(0.35);
        return (
          (state.bankLock = { by: e.first, role: e.role || "parent", age: state.age, held: t, taken: a }),
          say(
            `My ${(e.role || "parent").toLowerCase()}, ${e.first}, locked me out of my bank account because of my drug use.`,
          ),
          a && t > 0 && say(`${e.first} took the ${usd(t)} that was in my account.`),
          renderStats(),
          queuePopup(() =>
            notice(
              "Bank locked",
              `${e.first} found out about your drug use and locked you out of your ${bankFor()} account until you're 18.${t > 0 ? (a ? `<br><br>${e.first} also took all ${usd(t)} out of it. You might never see that money again.` : `<br><br>The ${usd(t)} in it is frozen. You can't touch it.`) : ""}<br><br>Maybe you can talk ${"Father" === e.role ? "him" : "her"} into giving it back by email.`,
              null,
              !0,
            ),
          ),
          !0
        );
      }
      function unlockBank(e) {
        const t = state.bankLock;
        if (!t) return 0;
        const a = t.taken
          ? "convinced" === e
            ? Math.round(t.held * (0.3 + 0.7 * Math.random()))
            : 0
          : t.held;
        return (
          (state.money = (state.money || 0) + a),
          (state.bankLock = null),
          renderStats(),
          say(
            "eighteen" === e
              ? `I turned 18 and got access to my bank account back${a ? ` with ${usd(a)} in it` : ", but the money was gone"}.`
              : `My ${t.role.toLowerCase()}, ${t.by}, unlocked my bank account${a ? ` and gave back ${usd(a)}` : ""}.`,
          ),
          a
        );
      }
      function openBankLocked() {
        const e = state.bankLock;
        (sTitle.textContent = "BANK"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = openAssets),
          (sList.innerHTML = `<div class="row">${bankLogo(bankFile(bankFor()))}<div class="t"><b>${bankFor()}</b><span>Account locked by your ${e.role.toLowerCase()}</span></div></div><div class="row dis"><img src="emoji/1f512.png"><div class="t"><b>Locked until you're 18</b><span>${e.by} locked it at age ${e.age} because of your drug use</span></div></div><div class="row dis"><img src="emoji/1f4b5.png"><div class="t"><b>${e.taken ? "Money taken" : "Frozen balance"}</b><span>${e.taken ? `${e.by} took ${usd(e.held)} out of it` : `${usd(e.held)} you can't touch`}</span></div></div><div class="row dis"><img src="emoji/1f4e7.png"><div class="t"><b>Talk to them</b><span>Email ${e.by} and try to convince ${"Father" === e.role ? "him" : "her"} to unlock it</span></div></div>`),
          (sList.scrollTop = 0),
          screen.classList.add("open");
      }
      function cashMoveCard(e, t) {
        if (state.bankLock)
          return notice(
            "Account locked",
            `${state.bankLock.by} locked your bank account. You can't ${e ? "withdraw" : "deposit"} anything until you're 18.`,
            null,
            !0,
          );
        const a = bankFor(),
          o = e ? state.money : state.cash || 0;
        return state.age < 13
          ? notice("Too young", "Your parents handle your money until you're 13.", null, !0)
          : o < (isOldEra() ? 0.01 : 1)
            ? notice(
                e ? "No money" : "No cash",
                e ? `There's nothing in your ${a} account to take out.` : "You don't have any cash on you.",
                null,
                !0,
              )
            : void moneySlider({
                title: e ? "Withdraw Cash" : "Deposit Cash",
                icon: e ? "emoji/1f4b5.png" : "emoji/1f3e6.png",
                have: o,
                btn: e ? "Withdraw" : "Deposit",
                lead: isOldEra()
                  ? e
                    ? `Your passbook at ${a} shows ${usd(state.money)}. How much will you ask the teller for?`
                    : `You have ${usd(state.cash || 0)} in coins and notes. How much will you hand the teller?`
                  : e
                    ? `You have ${usd(state.money)} in ${a}. How much cash do you want to take out?`
                    : `You have ${usd(state.cash || 0)} in cash. How much do you want to put in ${a}?`,
                go: (o) => {
                  say(
                    e ? `I withdrew ${usd(o)} in cash from ${a}.` : `I deposited ${usd(o)} in cash at ${a}.`,
                  ),
                    e
                      ? ((state.money = cents(state.money - o)), (state.cash = cents((state.cash || 0) + o)))
                      : ((state.cash = cents(state.cash - o)), (state.money = cents(state.money + o))),
                    renderStats(),
                    t && t();
                },
              });
      }
      function moneySlider({ title: e, icon: t, lead: a, have: o, btn: n, go: s }) {
        const r = (e) =>
          isOldEra()
            ? e >= 1e3
              ? cents(o)
              : Math.max(0.01, cents(o * Math.pow(e / 1e3, 2.6)))
            : e >= 1e3
              ? Math.round(o)
              : Math.max(1, Math.round(o * Math.pow(e / 1e3, 2.6)));
        (ev.innerHTML = `<style>#ev .atm-rng{-webkit-appearance:none;appearance:none;width:100%;height:30px;background:transparent;margin:6px 0 2px;cursor:pointer}\n        #ev .atm-rng::-webkit-slider-runnable-track{height:3px;background:#8a8f99;border-radius:2px}#ev .atm-rng::-moz-range-track{height:3px;background:#8a8f99;border-radius:2px}\n        #ev .atm-rng::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;margin-top:-11.5px;border:none;background:url(newlife/slider-thumb.png) center/contain no-repeat}\n        #ev .atm-rng::-moz-range-thumb{width:26px;height:26px;border:none;background:url(newlife/slider-thumb.png) center/contain no-repeat}\n        #ev .atm-amt{font-size:26px;font-weight:900;text-align:center;margin:4px 0 0;color:#1f5481}.phone.dark #ev .atm-amt{color:#fff}</style>\n      <div class="jm-x" id="propX" style="left:-14px;top:-14px"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#e2401f" stroke-width="2.6" stroke-linecap="round"/></svg></div><div class="jm-tag" style="margin-top:12px">Bank</div>\n      <h4><img src="${t}" alt=""><span>${e}</span></h4>\n      <div class="lead">${a}</div>\n      <div class="atm-amt" id="atmAmt"></div><input class="atm-rng" id="atmRng" type="range" min="1" max="1000" value="450">\n      <button class="jm-apply ev-btn" id="socGo">${n}</button>`),
          (ev.style.overflow = "visible");
        const i = () => {
            evWrap.classList.remove("open"), (ev.style.overflow = "");
          },
          l = document.getElementById("atmRng"),
          c = document.getElementById("atmAmt"),
          d = () => {
            c.textContent = usd(r(+l.value));
          };
        (l.oninput = d),
          d(),
          (document.getElementById("propX").onclick = i),
          (document.getElementById("socGo").onclick = () => {
            const e = r(+l.value);
            i(), screen.classList.remove("open"), bankSound(), s(e);
          }),
          evWrap.classList.add("open");
      }
      document.getElementById("ageBtn").addEventListener("click", () =>
        setTimeout(() => {
          const e = state.bankLock;
          if (
            e &&
            !state.dead &&
            ((state.money || 0) > 0 && ((e.held += state.money), (state.money = 0), renderStats()),
            state.age >= 18)
          ) {
            const t = unlockBank("eighteen");
            queuePopup(() =>
              notice(
                "Bank unlocked",
                `You're 18 now. ${e.by} can't keep you locked out anymore.${t ? `<br><br>${usd(t)} is back in your account.` : `<br><br>The money ${e.by} took is gone.`}`,
                null,
                !0,
              ),
            );
          }
        }, 0),
      );
      {
        const E = document.querySelector(".phone > .profile .money");
        E &&
          ((E.style.cursor = "pointer"),
          E.addEventListener("click", (e) => {
            e.stopPropagation(),
              state.dead ||
                (play("choice"),
                jCard({
                  tag: "Bank",
                  iconSrc: "emoji/1f3e6.png",
                  title: bankFor(),
                  close: !0,
                  lead: `<b>Bank Balance:</b> ${usd(state.money)}<br><b>Cash:</b> ${usd(state.cash || 0)}`,
                  choices: [
                    ["Withdraw Cash", () => setTimeout(() => cashMoveCard(!0), 60)],
                    ["Deposit Cash", () => setTimeout(() => cashMoveCard(!1), 60)],
                  ],
                }));
          }));
      }
      function openBankApply() {
        const e = socYear(),
          t = BANKS.filter((t) => t[1] <= e && (!t[2] || e <= t[2])),
          a = state.age < 13,
          o = "custodial" === state.bankOpen;
        (sTitle.textContent = "BANK"),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sBack.onclick = o ? openBank : openAssets),
          (sList.innerHTML =
            `<div class="row dis"><img src="emoji/1f3e6.png"><div class="t"><b>${o ? `Custodial account at ${bankFor()}` : "No bank account"}</b><span>${a ? "Your parents handle your money until you're 13" : o ? "Your parents opened this for you. Apply to open an account of your own." : "Apply at a bank to open your first checking account"}</span></div></div><div class="sec">Apply at a Bank</div>` +
            t
              .map(
                (e) =>
                  `<div class="row${a ? " dis" : ""}" data-apply="${e[0]}">${bankLogo(e[3])}<div class="t"><b>${e[0]}</b><span>${a ? "Available at 13" : "Open a checking account"}</span></div>${a ? "" : DOTS}</div>`,
              )
              .join("")),
          (sList.scrollTop = 0),
          sList.querySelectorAll("[data-apply]").forEach(
            (e) =>
              (e.onclick = () => {
                const t = e.dataset.apply;
                if (state.age < 13)
                  return notice(
                    "Too young",
                    "You can apply for a bank account when you turn 13. Until then, your parents handle your money.",
                    null,
                    !0,
                  );
                play("choice");
                const a = state.emails || [],
                  o = state.age < 18,
                  n = (state.parents || []).some((e) => !e.dead);
                socSelCard({
                  icon: "emoji/1f3e6.png",
                  title: t,
                  tag: "Bank",
                  lead: `Apply for a checking account at ${t}?${o ? "<br><br>You're under 18, so a parent has to co-sign." : ""}`,
                  label: "Email for your account:",
                  opts: a.length ? a.map((e) => e.addr) : ["No email (add one in Assets → Email)"],
                  btn: "Submit application",
                  onGo: (e) => {
                    let s = o ? (n ? 0.92 : 0.3) : 0.93;
                    if (((state.record || 0) >= 2 && (s -= 0.25), state.bankHack && (s -= 0.15), !chance(s)))
                      return (
                        say(`${t} denied my bank account application.`),
                        notice(
                          "Application denied",
                          o && !n
                            ? `${t} needs a parent or guardian to co-sign for anyone under 18.`
                            : `${t} denied your application. You can try a different bank.`,
                          openBankApply,
                          !0,
                        )
                      );
                    (state.bankOpen = !0),
                      (state.bank = t),
                      (state.bankAcct = String(rint(1e3, 9999))),
                      (state.bankEmail = a[e] ? a[e].addr : null),
                      (state.bankOpenedAt = state.age),
                      bankMailTo(
                        t,
                        `Welcome to ${t}`,
                        `Your checking account ending in ${state.bankAcct} is open. Your balance of ${usd(state.money)} is ready to use.`,
                        bankAddr(),
                        !0,
                      ),
                      say(`I opened my first bank account at ${t}${o ? " with my parent co-signing" : ""}.`),
                      notice(
                        "Account opened",
                        `Your ${t} checking account is open.${state.bankEmail ? `<br><br>Bank emails will go to ${state.bankEmail}.` : ""}`,
                        openBank,
                        !0,
                      );
                  },
                });
              }),
          ),
          screen.classList.add("open");
      }
