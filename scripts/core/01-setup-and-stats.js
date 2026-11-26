      const MODS_LOCKED = !1;
      try {
        const e = (JSON.parse(localStorage.getItem("bitlifepp-pick") || "null") || {}).lookMods || [];
        e.length
          ? localStorage.setItem("bitlifepp-mods", JSON.stringify(Object.fromEntries(e.map((e) => [e, !0]))))
          : localStorage.removeItem("bitlifepp-mods");
      } catch {}
      window.blReload = () => {
        try {
          sessionStorage.setItem("bitlifepp-quick-reload", "1");
        } catch {}
        location.reload();
      };
      {
        const t = (e) => e && e.closest && e.closest('input, textarea, [contenteditable="true"]');
        document.addEventListener("contextmenu", (e) => {
          t(e.target) || !(window.matchMedia && matchMedia("(pointer: coarse)").matches) || e.preventDefault();
        }),
          document.addEventListener("selectstart", (e) => {
            t(e.target) || e.preventDefault();
          }),
          document.addEventListener("dragstart", (e) => {
            t(e.target) || e.preventDefault();
          }),
          document.head.insertAdjacentHTML(
            "beforeend",
            '<style>body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}input,textarea,[contenteditable="true"]{-webkit-user-select:text;user-select:text}img{-webkit-user-drag:none}</style>',
          );
      }
      const SHOW_PENGUIN_INTRO = !1,
        SHOW_INTRO_VIDEO = !1;
      {
        const a = document.getElementById("splash");
        let o = !1;
        try {
          (o = "1" === sessionStorage.getItem("bitlifepp-quick-reload")),
            sessionStorage.removeItem("bitlifepp-quick-reload");
        } catch {}
        const n = "bitlifepp-intro-seen";
        let s = !0;
        try {
          s = "1" === localStorage.getItem(n);
        } catch {}
        const r = () => {};
        let i = !1;
        function startSplash() {
          if (!i && window.FreeLifeSplash) return FreeLifeSplash(a, r);
          const e = a.querySelector(".sp-sperm"),
            t = [0, 1, 2, 3, 4, 5].map((e) => `splash/sperm${e}.png`);
          t.forEach((e) => {
            new Image().src = e;
          });
          let o = 0,
            n = 0;
          const s = [
            [400, () => a.classList.add("s1")],
            [
              2500,
              () => {
                a.classList.add("s2"),
                  (n = setInterval(() => {
                    (o = (o + 1) % 6), (e.src = t[o]);
                  }, 70));
              },
            ],
            [
              3500,
              () => {
                clearInterval(n), a.classList.add("s3");
              },
            ],
          ].map(([e, t]) => setTimeout(t, e));
          let l = !1;
          const c = () => {
              l ||
                ((l = !0),
                clearInterval(n),
                s.forEach(clearTimeout),
                clearTimeout(d),
                r(),
                a.classList.add("out"),
                setTimeout(() => a.remove(), 550));
            },
            d = setTimeout(c, 8600);
          a.addEventListener("click", c);
        }
        o ? a.remove() : startSplash();
      }
      window.FL_LOADER_HTML = `<div class="ll-spin">${Array.from({ length: 12 }, (e, t) => `<i style="transform:rotate(${30 * t}deg);animation-delay:${(0.1 * (t - 12)).toFixed(1)}s"></i>`).join("")}</div>`;
      {
        const c = (() => {
            const e = document.createElement("canvas");
            e.width = e.height = 32;
            const t = e.getContext("2d"),
              a = t.createRadialGradient(16, 16, 0, 16, 16, 16);
            return (
              a.addColorStop(0, "rgba(255,255,255,1)"),
              a.addColorStop(0.45, "rgba(255,255,255,.85)"),
              a.addColorStop(1, "rgba(255,255,255,0)"),
              (t.fillStyle = a),
              t.fillRect(0, 0, 32, 32),
              e
            );
          })(),
          d = (e) => {
            if (e.__snow) return;
            e.__snow = !0;
            const t = document.createElement("canvas");
            (t.className = "ll-snow"), e.prepend(t);
            const a = t.getContext("2d");
            let o = 0,
              n = 0,
              s = [],
              r = performance.now();
            const i = (e) => {
                const t = Math.random() < 0.35;
                return {
                  x: Math.random() * o,
                  y: e ?? Math.random() * n,
                  r: t ? 2.2 + 2.2 * Math.random() : 0.9 + 1.4 * Math.random(),
                  v: t ? 38 + 30 * Math.random() : 14 + 16 * Math.random(),
                  a: t ? 0.9 : 0.45 + 0.3 * Math.random(),
                  ph: 6.3 * Math.random(),
                  sw: 8 + 18 * Math.random(),
                };
              },
              l = (d) => {
                if (!e.isConnected) return;
                (e.clientWidth === o && e.clientHeight === n) ||
                  (() => {
                    const r = Math.min(2, devicePixelRatio || 1);
                    (o = e.clientWidth),
                      (n = e.clientHeight),
                      (t.width = o * r),
                      (t.height = n * r),
                      a.setTransform(r, 0, 0, r, 0, 0),
                      (s = Array.from({ length: Math.round((o * n) / 2600) }, () => i()));
                  })();
                const u = Math.min(0.05, (d - r) / 1e3);
                (r = d), a.clearRect(0, 0, o, n);
                for (const e of s)
                  (e.y += e.v * u),
                    (e.ph += u),
                    e.y > n + 6 && Object.assign(e, i(-6)),
                    (a.globalAlpha = e.a),
                    a.drawImage(c, e.x + Math.sin(e.ph) * e.sw - 2 * e.r, e.y - 2 * e.r, 4 * e.r, 4 * e.r);
                (a.globalAlpha = 1), requestAnimationFrame(l);
              };
            requestAnimationFrame(l);
          };
        new MutationObserver((e) => {
          for (const t of e)
            for (const e of t.addedNodes) 1 === e.nodeType && e.classList.contains("ll-fl") && d(e);
        }).observe(document.body, { childList: !0, subtree: !0 });
      }
      {
        let u = !1;
        try {
          (u = "1" === sessionStorage.getItem("bitlifepp-fl-fadein")),
            sessionStorage.removeItem("bitlifepp-fl-fadein");
        } catch {}
        if (u) {
          const h = document.createElement("div");
          (h.id = "lifeLoadIn"),
            (h.className = "ll-fl on"),
            (h.innerHTML = FL_LOADER_HTML),
            document.querySelector(".phone").append(h);
          const p = () =>
            setTimeout(() => {
              h.classList.add("spun"),
                setTimeout(() => {
                  h.classList.add("gone"), setTimeout(() => h.remove(), 750);
                }, 400);
            }, 400);
          "loading" !== document.readyState
            ? setTimeout(p, 0)
            : addEventListener("DOMContentLoaded", p, { once: !0 });
        }
      }
                  const PENGUIN = [
  "              @@@       @@              ",
  "             @@@@      @@@@             ",
  "      @@@     @@@@    @@@@              ",
  "     @@@@    @@@@@@@@@@@@ ::            ",
  "       @@@@@@@@@@@@@@@@@@........       ",
  "        @@@@@@@@@::...    :........     ",
  "     @@@@ @@............-      .....:   ",
  "   @@@@@ ................-       :....  ",
  "  @@@@  .................-         ...: ",
  " @@@@   .................           ...:",
  "@@@@@   :..............:            :...",
  "@@@@     :............. ::     ...  -...",
  "@@@@       ..........: ....  ...... -...",
  "@@@@      :.......:: ..... ........=:...",
  "@@@@@     ..............:.......... ...:",
  " @@@@@    :...........:...........-:... ",
  "  @@@@@    ..................:...::...  ",
  "    @@@@@   .................-......:   ",
  "      @@@@@@  .............: ......     ",
  "        @@@@@@@@@::.....:    ...:       ",
  "            @@@@@@                      ",
];
      let chN = 0;
      const chs = (e) =>
        [...e].map((e) => (" " === e ? " " : `<span class="ch" style="--i:${chN++}">${e}</span>`)).join("");
      function showPenguin() {
        chN = 0;
        const e = document.createElement("div");
        (e.id = "penguin"),
          (e.innerHTML = `<canvas class="pg-snow"></canvas>\n      <div class="pg-stage"><pre class="pg-ball"></pre><pre class="pg-pow"></pre><pre class="pg-art"></pre></div>\n      <div class="pg-white"></div><div class="pg-cred"><div class="pg-type">${chs("BitLife recreated by Nan089111 and Itzbloodie")}</div>\n      <div class="pg-links"><b>${chs("Please look at READ ME .TXT")}</b></div></div>`),
          document.querySelector(".phone").append(e);
        const t = e.querySelector(".pg-art"),
          a = (e.querySelector(".pg-type"), e.querySelector(".pg-snow")),
          o = a.getContext("2d"),
          n = window.devicePixelRatio || 1;
        (a.width = e.clientWidth * n), (a.height = e.clientHeight * n);
        const s = (e) => {
            const t = 0.8 + 2.6 * Math.random();
            return {
              x: Math.random() * a.width,
              y: e ? -10 * n : Math.random() * a.height,
              r: t * n,
              vy: (0.35 + 0.32 * t) * n,
              sway: 6.28 * Math.random(),
              sw: 0.4 + 0.9 * Math.random(),
              a: 0.45 + 0.5 * Math.random(),
            };
          },
          r = Array.from({ length: 90 }, () => s(!1)),
          i = () => {
            if (e.isConnected) {
              o.clearRect(0, 0, a.width, a.height);
              for (const e of r)
                (e.y += e.vy),
                  (e.sway += 0.02),
                  (e.x += Math.sin(e.sway) * e.sw * n * 0.5),
                  e.y > a.height + 10 && Object.assign(e, s(!0)),
                  (o.globalAlpha = e.a),
                  (o.fillStyle = "#ff00ff"),
                  o.beginPath(),
                  o.arc(e.x, e.y, e.r, 0, 6.283),
                  o.fill();
              requestAnimationFrame(i);
            }
          };
        requestAnimationFrame(i);
        const l = Math.max(...PENGUIN.map((e) => e.length)),
          c = PENGUIN.map((e) => e.padEnd(l)),
          d = ".:-=+*#%@",
          u = l + 2 * c.length,
          h = performance.now();
        let p = !1,
          m = [];
        const f = setInterval(() => {
            (() => {
              const e = Math.min(1, (performance.now() - h) / 2200) * (u + 8);
              return (
                (t.textContent = c
                  .map((t, a) =>
                    [...t]
                      .map((t, o) => {
                        if (" " === t) return " ";
                        const n = o + 2 * a;
                        return n < e - 8 ? t : n < e ? d[Math.floor(9 * Math.random())] : " ";
                      })
                      .join(""),
                  )
                  .join("\n")),
                e >= u + 8
              );
            })() && (clearInterval(f), e.classList.add("drawn"), k());
          }, 33),
          g = e.querySelector(".pg-stage"),
          y = e.querySelector(".pg-ball"),
          b = e.querySelector(".pg-pow"),
          v = e.querySelector(".pg-white");
        (y.textContent = "  *  \n *** \n*****\n * * \n*   *"), (b.textContent = " .'*'.\n*:@@@:*\n '.*.'");
        const w = (e, t) => m.push(setTimeout(t, e)),
          k = () => {
            if (p) return;
            const e = t.offsetWidth,
              a = 0.12 * e,
              o = t.offsetTop + 0.14 * t.offsetHeight,
              n = [0.95 * -e, o + 150],
              s = [0.45 * -e, o - 40],
              r = [a, o],
              i = y.offsetLeft + y.offsetWidth / 2,
              l = y.offsetTop + y.offsetHeight / 2,
              c = g.offsetWidth / 2,
              d = g.offsetHeight / 2,
              u = ([e, t], a) => `translate(${c - (i + e) * a}px, ${d - (l + t) * a}px) scale(${a})`,
              h = 1250;
            w(250, () => {
              (y.style.opacity = 1),
                y.animate(
                  [
                    { transform: `translate(${n[0]}px, ${n[1]}px) rotate(0)` },
                    { transform: `translate(${s[0]}px, ${s[1]}px) rotate(-260deg)` },
                    { transform: `translate(${r[0]}px, ${r[1]}px) rotate(-520deg)` },
                  ],
                  { duration: h, easing: "cubic-bezier(.35,.05,.7,1)", fill: "forwards" },
                ),
                g.animate(
                  [
                    { transform: "translate(0,0) scale(1)" },
                    { transform: u(s, 1.7) },
                    { transform: u(r, 3.6) },
                  ],
                  { duration: h, easing: "cubic-bezier(.35,.05,.7,1)", fill: "forwards" },
                );
            }),
              w(1500, () => {
                y.animate([{ transform: `translate(${r[0]}px, ${r[1]}px) rotate(-520deg) scale(1)`, opacity: 1 }, { transform: `translate(${r[0]}px, ${r[1]}px) rotate(-650deg) scale(2.6)`, opacity: 0 }], { duration: 260, easing: "ease-out", fill: "forwards" }),
                  (b.style.cssText = `opacity:1;transform:translate(${a}px, ${o}px)`),
                  b.animate(
                    [
                      { transform: `translate(${a}px, ${o}px) scale(.4)` },
                      { transform: `translate(${a}px, ${o}px) scale(1.15)` },
                      { transform: `translate(${a}px, ${o}px) scale(1)` },
                    ],
                    { duration: 260, fill: "forwards" },
                  ),
                  v.animate([{ opacity: 0.75 }, { opacity: 0 }], { duration: 380, easing: "ease-out" }),
                  g.animate(
                    [
                      { transform: `${u(r, 3.6)} translate(0,0)` },
                      { transform: `${u(r, 3.6)} translate(-3px,2px)` },
                      { transform: `${u(r, 3.6)} translate(3px,-2px)` },
                      { transform: `${u(r, 3.6)} translate(0,0)` },
                    ],
                    { duration: 260, fill: "forwards" },
                  );
              }),
              w(2150, () =>
                g.animate([{ transform: u(r, 3.6) }, { transform: "translate(0,0) scale(1)" }], {
                  duration: 1e3,
                  easing: "cubic-bezier(.6,0,.3,1)",
                  fill: "forwards",
                }),
              ),
              w(3200, $);
          },
          $ = () => {
            if (p) return;
            const t = e.getBoundingClientRect(),
              a = b.getBoundingClientRect(),
              o = [...e.querySelectorAll(".pg-cred .ch")];
            let n = 0;
            o.forEach((o, s) => {
              const r = o.getBoundingClientRect(),
                i = document.createElement("span");
              (i.className = "pg-drip"), (i.textContent = any([".", ":", "*", "o", "°"]));
              const l = a.left - t.left + a.width * (0.2 + 0.6 * Math.random()),
                c = a.top - t.top + 0.7 * a.height,
                d = r.left - t.left + r.width / 2 - 4,
                u = r.top - t.top + 0.25 * r.height;
              (i.style.left = l + "px"), (i.style.top = c + "px"), e.append(i);
              const h = 650 + 450 * Math.random(),
                p = 28 * s + 120 * Math.random();
              n = Math.max(n, h + p);
              const f = () => {
                i.isConnected &&
                  (i.remove(),
                  o.classList.add("on", "frost"),
                  setTimeout(() => o.classList.remove("frost"), 70));
              };
              (i.animate(
                [
                  { transform: "translate(0,0) scale(.6)", opacity: 0 },
                  { transform: `translate(${0.15 * (d - l)}px, 10px) scale(1)`, opacity: 1, offset: 0.15 },
                  { transform: `translate(${d - l}px, ${u - c}px) scale(1.2)`, opacity: 1 },
                ],
                { duration: h, delay: p, easing: "cubic-bezier(.45,0,1,1)", fill: "both" },
              ).onfinish = f),
                m.push(setTimeout(f, h + p + 80));
            }),
              b.animate([{ opacity: 1 }, { opacity: 0 }], { duration: n, fill: "forwards" }),
              m.push(setTimeout(S, n + 3600));
          },
          S = () => {
            p ||
              ((p = !0),
              clearInterval(f),
              m.forEach((e) => {
                clearTimeout(e), clearInterval(e);
              }),
              e.classList.add("out"),
              setTimeout(() => e.remove(), 600));
          };
        e.addEventListener("click", (e) => {
          e.target.closest("a") || S();
        });
      }
      const state = { age: 83, money: 2707641, stats: { Happiness: 59, Health: 97, Smarts: 52, Looks: 88 } },
        PICK = (() => {
          try {
            const e = JSON.parse(localStorage.getItem("bitlifepp-pick") || "null");
            return localStorage.removeItem("bitlifepp-pick"), e;
          } catch {
            return null;
          }
        })(),
        PICKING = !PICK,
        RESUME_ID = PICK
          ? null
          : (() => {
              try {
                return localStorage.getItem("bitlifepp-active");
              } catch {
                return null;
              }
            })();
      state.gender = PICK && "f" === PICK.g ? "f" : "m";
      const PG = () => state.gender,
        BIO = () => state.birthGender || state.gender,
        ROYAL_LANDS = [
          "gb",
          "es",
          "nl",
          "be",
          "dk",
          "se",
          "no",
          "jp",
          "sa",
          "th",
          "ma",
          "jo",
          "mc",
          "kw",
          "qa",
          "my",
          "ae",
        ],
        ROY_RANKS = {
          baron: {
            m: "Baron",
            f: "Baroness",
            pay: 15e4,
            fame: 55,
            ico: "royal/crest.png",
            crown: ["headwear100003", "headwear100103"],
          },
          viscount: {
            m: "Viscount",
            f: "Viscountess",
            pay: 3e5,
            fame: 60,
            ico: "royal/crest.png",
            crown: ["headwear100003", "headwear100103"],
          },
          earl: {
            m: "Earl",
            f: "Countess",
            pay: 6e5,
            fame: 65,
            ico: "royal/crest.png",
            crown: ["headwear100003", "headwear100103"],
          },
          marquess: {
            m: "Marquess",
            f: "Marchioness",
            pay: 1e6,
            fame: 70,
            ico: "royal/crest.png",
            crown: ["headwear100003", "headwear100103"],
          },
          duke: {
            m: "Duke",
            f: "Duchess",
            pay: 2e6,
            fame: 78,
            ico: "royal/crown.png",
            crown: ["headwear100002", "headwear100102"],
          },
          prince: {
            m: "Prince",
            f: "Princess",
            pay: 45e5,
            fame: 88,
            ico: "royal/crown.png",
            crown: ["headwear100002", "headwear100102"],
          },
          monarch: {
            m: "King",
            f: "Queen",
            pay: 1e7,
            fame: 96,
            ico: "royal/monarch.png",
            crown: ["headwear100001", "headwear100101"],
          },
        },
        ROY_ORDER = Object.keys(ROY_RANKS),
        ROY_PICKABLE = ROY_ORDER.filter((e) => "monarch" !== e);
      function royWord(e, t) {
        return ROY_RANKS[e]["f" === t ? "f" : "m"];
      }
      const CURRENCY = {
        // Latin America, the Caribbean and the remaining countries: local symbol instead of "$"
        us: "$",
        ca: "C$",
        mx: "MX$",
        ar: "AR$",
        cl: "CL$",
        co: "COL$",
        pe: "S/",
        uy: "$U",
        py: "₲",
        bo: "Bs ",
        ve: "Bs.S ",
        ec: "US$",
        do: "RD$",
        cu: "CUP$",
        pr: "US$",
        gt: "Q",
        ni: "C$",
        cr: "₡",
        pa: "B/.",
        sv: "US$",
        ht: "G ",
        jm: "J$",
        bs: "B$",
        bz: "BZ$",
        gy: "G$",
        aw: "Afl ",
        au: "A$",
        nz: "NZ$",
        hk: "HK$",
        sg: "S$",
        tw: "NT$",
        mn: "₮",
        kz: "₸",
        ge: "₾",
        rs: "din ",
        lb: "LBP ",
        sy: "SYP ",
        iq: "IQD ",
        ir: "IRR ",
        af: "Af ",
        ao: "Kz ",
        cd: "FC ",
        dj: "Fdj ",
        dz: "DA ",
        et: "Br ",
        tn: "DT ",
        ug: "USh ",
        zw: "Z$",
        ws: "T$",
        pg: "K ",
        gb: "£",
        jp: "¥",
        cn: "¥",
        in: "₹",
        kr: "₩",
        ru: "₽",
        ng: "₦",
        ph: "₱",
        tr: "₺",
        il: "₪",
        ua: "₴",
        vn: "₫",
        th: "฿",
        br: "R$",
        za: "R",
        ch: "CHF ",
        se: "kr ",
        no: "kr ",
        dk: "kr ",
        is: "kr ",
        pl: "zł ",
        cz: "Kč ",
        hu: "Ft ",
        ro: "lei ",
        eg: "E£",
        sa: "SR ",
        ae: "AED ",
        qa: "QR ",
        kw: "KD ",
        id: "Rp ",
        my: "RM ",
        pk: "₨",
        bd: "৳",
        lk: "Rs ",
        np: "Rs ",
        ke: "KSh ",
        gh: "₵",
        ma: "MAD ",
        jo: "JD ",
        ag: "EC$",
        al: "L ",
        am: "֏",
        az: "₼",
        ba: "KM ",
        bb: "Bds$",
        bf: "FCFA ",
        bg: "лв ",
        bh: "BD ",
        bi: "FBu ",
        bj: "FCFA ",
        bn: "B$",
        bt: "Nu ",
        bw: "P ",
        by: "Br ",
        cf: "FCFA ",
        cg: "FCFA ",
        ci: "FCFA ",
        cm: "FCFA ",
        cv: "CVE ",
        dm: "EC$",
        er: "Nfk ",
        fj: "FJ$",
        fm: "$",
        ga: "FCFA ",
        gd: "EC$",
        gm: "D ",
        gn: "FG ",
        gq: "FCFA ",
        gw: "FCFA ",
        hn: "L ",
        kg: "som ",
        kh: "៛",
        ki: "A$",
        km: "CF ",
        kn: "EC$",
        kp: "₩",
        la: "₭",
        lc: "EC$",
        li: "CHF ",
        lr: "L$",
        ls: "L ",
        ly: "LD ",
        md: "L ",
        mg: "Ar ",
        mh: "$",
        mk: "ден ",
        ml: "FCFA ",
        mm: "K ",
        mr: "UM ",
        mu: "Rs ",
        mv: "Rf ",
        mw: "MK ",
        mz: "MT ",
        na: "N$",
        ne: "FCFA ",
        nr: "$",
        om: "OMR ",
        ps: "₪",
        pw: "$",
        rw: "RWF ",
        sb: "SI$",
        sc: "SR ",
        sd: "SDG ",
        sl: "Le ",
        sn: "FCFA ",
        so: "Sh ",
        sr: "SRD ",
        ss: "SSP ",
        st: "Db ",
        sz: "E ",
        td: "FCFA ",
        tg: "FCFA ",
        tj: "SM ",
        tl: "$",
        tm: "TMT ",
        to: "T$",
        tt: "TT$",
        tv: "A$",
        tz: "TSh ",
        uz: "som ",
        vc: "EC$",
        vu: "VT ",
        ye: "YR ",
        zm: "ZK ",
        ...Object.fromEntries(
          "at be cy de ee es fi fr gr hr ie it lt lu lv mt nl pt si sk ad mc sm va me xk"
            .split(" ")
            .map((e) => [e, "€"]),
        ),
      };
      function cur() {
        return CURRENCY[state.country] || "$";
      }
      const PRICE_LVL = {
          us: 1,
          ad: 0.85,
          ae: 0.7,
          af: 0.25,
          ao: 0.45,
          ar: 0.4,
          at: 0.85,
          au: 0.9,
          aw: 0.8,
          bd: 0.3,
          be: 0.85,
          bo: 0.35,
          br: 0.5,
          bs: 0.95,
          bz: 0.55,
          ca: 0.85,
          cd: 0.45,
          ch: 1.2,
          cl: 0.55,
          cn: 0.55,
          co: 0.35,
          cr: 0.6,
          cu: 0.4,
          cz: 0.6,
          de: 0.85,
          dj: 0.5,
          dk: 1.05,
          do: 0.45,
          dz: 0.3,
          ec: 0.45,
          ee: 0.7,
          eg: 0.2,
          es: 0.7,
          et: 0.3,
          fi: 0.9,
          fr: 0.85,
          gb: 0.85,
          ge: 0.35,
          gr: 0.65,
          gt: 0.45,
          gy: 0.45,
          hk: 0.8,
          hr: 0.6,
          ht: 0.55,
          hu: 0.5,
          id: 0.3,
          ie: 0.95,
          il: 0.95,
          in: 0.25,
          iq: 0.4,
          ir: 0.2,
          it: 0.75,
          jm: 0.65,
          jo: 0.5,
          jp: 0.65,
          ke: 0.4,
          kr: 0.7,
          kw: 0.55,
          kz: 0.35,
          lb: 0.5,
          ma: 0.4,
          mc: 1.1,
          mn: 0.3,
          mx: 0.55,
          my: 0.4,
          ng: 0.3,
          ni: 0.4,
          nl: 0.9,
          no: 1.1,
          np: 0.3,
          nz: 0.9,
          pa: 0.5,
          pe: 0.45,
          pg: 0.6,
          ph: 0.4,
          pk: 0.25,
          pl: 0.5,
          pr: 0.85,
          pt: 0.65,
          py: 0.4,
          qa: 0.7,
          ro: 0.45,
          rs: 0.45,
          ru: 0.4,
          sa: 0.55,
          se: 0.9,
          sg: 0.85,
          sk: 0.6,
          sv: 0.5,
          sy: 0.2,
          th: 0.4,
          tn: 0.3,
          tr: 0.35,
          tw: 0.55,
          ua: 0.3,
          ug: 0.35,
          uy: 0.7,
          ve: 0.45,
          vn: 0.35,
          ws: 0.6,
          za: 0.45,
          zw: 0.5,
        },
        ERA_LVL = [
          [1800, 0.005],
          [1830, 0.0055],
          [1860, 0.006],
          [1870, 0.0065],
          [1899, 0.008],
          [1910, 0.01],
          [1920, 0.02],
          [1940, 0.03],
          [1950, 0.05],
          [1960, 0.08],
          [1970, 0.12],
          [1980, 0.25],
          [1990, 0.4],
          [2e3, 0.55],
          [2010, 0.7],
          [2020, 0.85],
          [2026, 1],
        ];
      function eraLvl() {
        if ("1800s" !== state.era) return 1;
        const e = state.birthYear + state.age;
        if (e <= ERA_LVL[0][0]) return ERA_LVL[0][1];
        for (let t = 1; t < ERA_LVL.length; t++)
          if (e <= ERA_LVL[t][0]) {
            const [a, o] = ERA_LVL[t - 1],
              [n, s] = ERA_LVL[t];
            return o + ((s - o) * (e - a)) / (n - a);
          }
        return 1;
      }
      function eraPrice(e) {
        const t = (e * eraLvl()) / (ERA_FX[cur()] || 1);
        return t >= 20 ? Math.round(t) : Math.max(0.01, Math.round(100 * t) / 100);
      }
      const ep = (e) => ("1800s" === state.era && e > 0 ? eraPrice(e) : e),
        localPrice = (e) =>
          "1800s" === state.era
            ? eraPrice(e)
            : Math.max(5, 5 * Math.round((e * (PRICE_LVL[state.country] || 1)) / 5)),
        WAGE_LVL = {
          us: 1,
          ad: 0.75,
          ae: 0.7,
          af: 0.015,
          ao: 0.05,
          ar: 0.12,
          at: 0.8,
          au: 0.95,
          aw: 0.45,
          bd: 0.03,
          be: 0.85,
          bo: 0.07,
          br: 0.13,
          bs: 0.45,
          bz: 0.12,
          ca: 0.8,
          cd: 0.01,
          ch: 1.3,
          cl: 0.17,
          cn: 0.2,
          co: 0.09,
          cr: 0.17,
          cu: 0.015,
          cz: 0.32,
          de: 0.85,
          dj: 0.04,
          dk: 1,
          do: 0.1,
          dz: 0.05,
          ec: 0.1,
          ee: 0.3,
          eg: 0.035,
          es: 0.45,
          et: 0.012,
          fi: 0.75,
          fr: 0.7,
          gb: 0.75,
          ge: 0.1,
          gr: 0.3,
          gt: 0.08,
          gy: 0.1,
          hk: 0.65,
          hr: 0.27,
          ht: 0.015,
          hu: 0.25,
          id: 0.05,
          ie: 0.9,
          il: 0.75,
          in: 0.04,
          iq: 0.08,
          ir: 0.04,
          it: 0.55,
          jm: 0.1,
          jo: 0.1,
          jp: 0.55,
          ke: 0.04,
          kr: 0.6,
          kw: 0.7,
          kz: 0.1,
          lb: 0.05,
          ma: 0.06,
          mc: 1.2,
          mn: 0.07,
          mx: 0.14,
          my: 0.15,
          ng: 0.025,
          ni: 0.05,
          nl: 0.85,
          no: 1.05,
          np: 0.03,
          nz: 0.7,
          pa: 0.2,
          pe: 0.1,
          pg: 0.05,
          ph: 0.06,
          pk: 0.025,
          pl: 0.3,
          pr: 0.5,
          pt: 0.3,
          py: 0.08,
          qa: 0.85,
          ro: 0.22,
          rs: 0.17,
          ru: 0.15,
          sa: 0.45,
          se: 0.7,
          sg: 0.9,
          sk: 0.27,
          sv: 0.07,
          sy: 0.01,
          th: 0.1,
          tn: 0.06,
          tr: 0.15,
          tw: 0.35,
          ua: 0.08,
          ug: 0.015,
          uy: 0.2,
          ve: 0.015,
          vn: 0.07,
          ws: 0.06,
          za: 0.15,
          zw: 0.02,
        },
        inflFx = (r) => {
          if ("1800s" === state.era || null == state.birthYear) return 1;
          return Math.pow(r || 1.03, state.birthYear + (state.age || 0) - 2026);
        },
        wageLvl = () => WAGE_LVL[state.country] ?? (PRICE_LVL[state.country] || 1) ** 2.2,
        wage = (e) => {
          const t = e * wageLvl() * inflFx();
          return t >= 1e4 ? 100 * Math.round(t / 100) : t >= 100 ? Math.round(t) : Math.max(1, Math.round(t));
        },
        wageHr = (e) => Math.max(0.01, Math.round(e * wageLvl() * inflFx() * 100) / 100),
        CAR_TAX = {
          sg: 2.6,
          dk: 1.45,
          no: 1.2,
          il: 1.3,
          br: 1.3,
          ar: 1.35,
          tr: 1.3,
          in: 1.1,
          cn: 1.05,
          hk: 1.15,
          ae: 0.9,
          qa: 0.9,
          kw: 0.9,
          sa: 0.9,
        },
        HOME_HOT = {
          hk: 2,
          sg: 1.5,
          ch: 1.4,
          gb: 1.25,
          cn: 1.9,
          kr: 1.3,
          mc: 2.5,
          il: 1.4,
          au: 1.15,
          nz: 1.15,
          ca: 1.05,
          in: 1.4,
          tw: 1.3,
        },
        goodsLvl = (e) => {
          const t = wageLvl(),
            a = state.country;
          return "house" === e
            ? t ** 0.6 * (HOME_HOT[a] || 1)
            : "car" === e
              ? t ** 0.35 * (CAR_TAX[a] || 1)
              : t ** 0.4;
        };
      function royCrown(e, t) {
        return ROY_RANKS[e].crown["f" === t ? 1 : 0];
      }
      const usedFirst = new Set(),
        namesOf = (e) => (window.NAMES_FOR && NAMES_FOR(e || state.country)) || NAME_POOL;
      function uname(e, t) {
        const a = namesOf(t)[e],
          o = a.filter((e) => !usedFirst.has(e)),
          n = o.length ? o[Math.floor(Math.random() * o.length)] : a[Math.floor(Math.random() * a.length)];
        return usedFirst.add(n), n;
      }
      const ulast = (e) => {
          const t = namesOf(e).last;
          return t[Math.floor(Math.random() * t.length)];
        },
        STAT_EMOJI = {
          Happiness: (e) =>
            e >= 90
              ? "face-xd"
              : e >= 70
                ? "face-smile"
                : e >= 50
                  ? "face-smirk"
                  : e >= 31
                    ? "face-slight-smile"
                    : e >= 13
                      ? "face-sad"
                      : "face-sobbing",
          Health: (e) => (e >= 13 ? "heart-red" : "heart-broken"),
          Smarts: (e) => (e >= 90 ? "light-bulb" : e >= 31 ? "brain" : "face-silly"),
          Looks: (e) =>
            e >= 90
              ? "fire"
              : e >= 50
                ? "sun"
                : e >= 31
                  ? "sun-behind-cloud"
                  : e >= 13
                    ? "cloud"
                    : "cloud-rain",
          "Mental Health": (e) =>
            e >= 80
              ? "face-halo"
              : e >= 55
                ? "face-slight-smile"
                : e >= 31
                  ? "face-sad-slightly"
                  : e >= 13
                    ? "face-crying"
                    : "face-nothing",
          Insanity: (e) =>
            e >= 70 ? "face-vomit" : e >= 40 ? "face-happy-devil" : e >= 15 ? "face-silly" : "brain",
        },
        statIcon = (e, t) =>
          `<img src="stat-emoji/${STAT_EMOJI[e](t)}.png" alt="" style="width:24px;height:24px;vertical-align:middle">`,
        apple = (e) =>
          `<img src="emoji/${[...e].map((e) => e.codePointAt(0).toString(16)).join("-")}.png" alt="${e}" style="width:20px;height:20px;vertical-align:middle">`;
      function bankTotal() {
        return (state.money || 0) + (state.bankAccts || []).reduce((e, t) => e + (t.bal || 0), 0);
      }
      document.querySelector("#pray span").innerHTML =
        '<img src="stat-emoji/pray.png" alt="" style="width:26px;height:26px;vertical-align:middle">';
      const stats = document.getElementById("stats"),
        statBar = (e, t) =>
          `<div class="bar"><div class="bi"><div class="fill ${t}" style="width:${e}%"><span class="fin${e >= 75 ? " hi" : ""}">${e}%</span></div></div><span class="pct${e >= 75 ? " in" : ""}">${e}%</span></div>`;
      function renderStats() {
        "function" == typeof bankWatch && bankWatch();
        {
          const e = document.querySelector("#money + .lbl");
          e && (e.textContent = "1800s" === state.era ? "Savings" : "Bank Balance");
        }
        stats.innerHTML = "";
        for (const [e, t] of Object.entries(state.stats)) {
          const a = statIcon(e, t),
            o =
              t < 31 &&
              !state.dead &&
              !state.prison &&
              state.age >= 13 &&
              (state.boosts || {})[e] !== state.age,
            n = statBar(t, t < 13 ? "crit" : t < 31 ? "low" : "");
          if (
            (stats.insertAdjacentHTML(
              "beforeend",
              `<div class="stat-l ${t < 13 ? "warn" : ""}">${t < 13 ? '<img class="w" src="stat-emoji/warning.png">' : ""}${e}<span class="e">${a}</span></div>\n         ${o ? n.replace('<div class="bar">', `<div class="bar boost"><div class="boost-tail" style="left:calc((100% - 44px) * ${Math.max(t, 1) / 100})"></div><img class="boost-btn" src="mkt/boost-btn.png" alt="Boost!" data-boost="${e}">`) : n}`,
            ),
            "Health" === e && !(window.FL_noMH && FL_noMH()))
          ) {
            const e = mindOf(),
              t = Math.round(e.mh),
              a = Math.round(e.ins);
            stats.insertAdjacentHTML(
              "beforeend",
              `<div class="stat-l ${t < 13 ? "warn" : ""}">${t < 13 ? '<img class="w" src="stat-emoji/warning.png">' : ""}Mental Health<span class="e">${statIcon("Mental Health", t)}</span></div>${statBar(t, t < 13 ? "crit" : t < 31 ? "low" : "")}<div class="stat-l ${a >= 70 ? "warn" : ""}">${a >= 70 ? '<img class="w" src="stat-emoji/warning.png">' : ""}Insanity<span class="e">${statIcon("Insanity", a)}</span></div>${statBar(a, "insane")}`,
            );
          }
        }
        if (
          (document.querySelector(".phone").classList.toggle("famous", !(!state.art || !state.art.fameOn)),
          state.art && state.art.fameOn)
        ) {
          const e = Math.min(100, Math.max(state.art.fame, (ftOn() && state.fameFloor) || 0)),
            t = e;
          stats.insertAdjacentHTML(
            "beforeend",
            `<div class="stat-l">Fame<span class="e"><img src="stat-emoji/star.png" alt="" style="width:24px;height:24px;vertical-align:middle"></span></div>\n         ${statBar(
              t,
              e > 100 ? "fame mega" : "fame",
            )
              .split(`>${t}%</span>`)
              .join(`>${e}%</span>`)}`,
          );
        }
        if ("1800s" === state.era) {
          const e = Math.round(Math.max(0, Math.min(100, state.respect ?? 40)));
          stats.insertAdjacentHTML(
            "beforeend",
            `<div class="stat-l">Respect<span class="e"><img src="emoji/1f3a9.png" alt="" style="width:24px;height:24px;vertical-align:middle"></span></div>${statBar(e, "fame")}`,
          );
        }
        const e = document.getElementById("money"),
          t = (e) =>
            "1800s" === state.era && Math.abs(e) < 1e3 && e % 1
              ? e.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : Math.round(e).toLocaleString("en-US");
        (e.textContent = cur() + t(bankTotal())), e.classList.toggle("zero", !bankTotal());
        const a = document.getElementById("cash");
        a && ((a.textContent = cur() + t(state.cash || 0)), a.classList.toggle("zero", !state.cash)),
          (document.querySelector(".home").style.backgroundPosition = `0 -${stats.offsetHeight}px`),
          "function" == typeof sadWatch && sadWatch();
      }
      const clamp = (e) => Math.max(0, Math.min(100, e)),
        mindOf = () =>
          (state.mind ||= {
            mh: Math.min(100, ((state.stats && state.stats.Happiness) || 70) + 10),
            ins: 0,
            low: 0,
            happy: 0,
          }),
        mindBump = (e, t = 0) => {
          if (window.FL_noMH && FL_noMH()) return;
          const a = mindOf();
          (a.ins = clamp(a.ins + e)), (a.mh = clamp(a.mh + t));
        },
        log = document.getElementById("log");
      new MutationObserver(() => {
        log.scrollTop = log.scrollHeight;
      }).observe(log, { childList: !0, subtree: !0 });
      const STAT_DRIFT = {
        Health: (e) =>
          e < 30
            ? Math.floor(3 * Math.random()) - 1
            : e < 50
              ? Math.floor(4 * Math.random()) - 2
              : e < 65
                ? -Math.floor(3 * Math.random())
                : e < 80
                  ? -Math.floor(4 * Math.random())
                  : -1 - Math.floor(4 * Math.random()),
        Smarts: (e) =>
          e < 22
            ? Math.floor(5 * Math.random()) - 1
            : e < 70
              ? Math.floor(3 * Math.random()) - 1
              : Math.floor(4 * Math.random()) - 2,
        Looks: (e) =>
          e < 20
            ? Math.floor(6 * Math.random()) - 2
            : e < 40
              ? Math.floor(5 * Math.random()) - 2
              : e < 60
                ? Math.floor(5 * Math.random()) - 3
                : -Math.floor(4 * Math.random()),
        Happiness: (e, t) =>
          Math.floor(5 * Math.random()) - 2 + (Math.random() < 0.35 ? Math.sign(60 - t) : 0),
      };
      document.getElementById("ageBtn").addEventListener("click", () => {
        state.age++,
          log.insertAdjacentHTML(
            "beforeend",
            `<div class="year"><h3>Age: ${state.age} years<span class="yr"> (${state.birthYear + state.age})</span></h3></div>`,
          );
        for (const e in state.stats)
          state.stats[e] = clamp(
            state.stats[e] +
              (STAT_DRIFT[e] ? STAT_DRIFT[e](state.age, state.stats[e]) : Math.floor(3 * Math.random()) - 1),
          );
        renderStats(), (log.scrollTop = log.scrollHeight);
      });
      const toast = document.getElementById("toast");
      function show(e, t) {
        notice(e, t, null, !0);
      }
      function comingSoon() {
        // [mod] it used to say "Error / Error": it is a placeholder, not a failure
        notice("Coming soon", "This isn't available yet. Check back later!", null, !0);
      }
      (window.comingSoon = comingSoon),
        document
          .querySelectorAll(".tab[data-tab]")
          .forEach((e) => e.addEventListener("click", () => comingSoon())),
        document.getElementById("pray").addEventListener("click", () => prayCard());
      const avatarImg = document.createElement("canvas");
      (avatarImg.className = "avatar"),
        (avatarImg.width = avatarImg.height = 250),
        document.querySelector(".avatar").replaceWith(avatarImg);
      const pickR = (e) => e[Math.floor(Math.random() * e.length)],
        randomLook = (e = "m", t = 0) => ({
          skin: pickR(["#f6d3b3", "#eebd94", "#d9a274", "#b97c50", "#8a5a3a", "#5e3d27"]),
          eyes: pickR(["#6b4226", "#4a2c17", "#3f7fbf", "#4f8a4b", "#8a6a3a", "#5b6b7a"]),
          hair: pickR(["#2a201b", "#5b3a22", "#8a5a2c", "#d8b26a", "#a8471f"]),
          seed: Math.floor(1e3 * Math.random()),
          beard: "m" === e && t >= 18 && Math.random() < 0.5 ? 1 + Math.floor(13 * Math.random()) : 0,
          ...("m" === e && t >= 13 && Math.random() < ("1800s" === state.era ? 0.5 : 0.15)
            ? { xHair: `west${1 + Math.floor(10 * Math.random())}` }
            : "1800s" !== state.era && t >= 8 && Math.random() < 0.3 && typeof HAIR_PACK !== "undefined"
              ? { xHair: pickR(HAIR_PACK)[0] }
              : {}),
        }),
        BIRTH_TRAITS = [
          {
            id: "rhnull",
            name: "Rh-null Blood",
            col: "#d32f2f",
            h: 90,
            base: 0.05,
            pass: 0.05,
            old: "strange blood",
            desc: '"Golden blood": missing every Rh antigen. Fewer than 50 people on Earth have it, and they can only get blood from another Rh-null donor.',
            born: 'I was born with Rh-null "golden blood", one of the rarest blood types on Earth.',
            life: [
              "banked a supply of blood in case a transfusion was ever needed",
              "got letters from scientists all over the world asking for a sample",
              "stayed extra careful, knowing almost no donor on Earth could help",
            ],
          },
          {
            id: "heterochromia",
            name: "Heterochromia",
            col: "#3f7fbf",
            h: 60,
            base: 0.05,
            pass: 0.05,
            old: "odd eyes",
            fx: { Looks: 5 },
            desc: "Two different colored eyes.",
            born: "I was born with heterochromia: my eyes are two different colors.",
            life: [
              "got asked about the two-colored eyes by almost everyone",
              "heard again and again that the eyes were the best feature",
              'got nicknamed "Odd Eyes" at school',
            ],
          },
          {
            id: "supertaster",
            name: "Super Taster",
            col: "#e91e63",
            h: 70,
            base: 0.05,
            pass: 0.05,
            old: "a picky palate",
            desc: "Extra taste buds: bitter foods like coffee, broccoli and dark chocolate taste far stronger than they do for everyone else.",
            born: "I was born a super taster: flavors hit me much harder than other people.",
            life: [
              "could never stand broccoli, no matter how it was cooked",
              "became the best cook in the family",
              "could taste one wrong ingredient in any dish",
            ],
          },
          {
            id: "chimera",
            name: "Chimera Body",
            col: "#8e24aa",
            h: 5,
            base: 0.01,
            pass: 0.04,
            old: "a monstrous birth",
            desc: "Two sets of DNA in one body, from twin embryos that fused before birth. Here it shows as a second head.",
            born: "I was born a chimera: two sets of DNA in one body, and two heads.",
            life: [
              "turned heads everywhere (with both heads)",
              "had doctors writing papers about the case",
              "got into more arguments with the other head than with anyone else",
            ],
          },
          {
            id: "lrp5",
            name: "LRP5 Super Bones",
            col: "#5c6bc0",
            h: 50,
            base: 0.05,
            pass: 0.05,
            old: "iron bones",
            fx: { Health: 10 },
            desc: "A rare LRP5 gene mutation that makes bones extremely dense and almost impossible to break.",
            born: "I was born with the LRP5 gene: my bones are almost unbreakable.",
            life: [
              "walked away from a fall that should have broken every bone",
              "never broke a single bone, ever",
              "kept sinking straight to the bottom of the swimming pool",
            ],
          },
          {
            id: "hypertrichosis",
            name: "Werewolf Syndrome",
            col: "#795548",
            h: 50,
            base: 0.05,
            pass: 0.05,
            old: "the wolf-man curse",
            fx: { Looks: -15 },
            desc: "Hypertrichosis: thick hair grows all over the face and body.",
            born: "I was born with werewolf syndrome: hair covers my whole face.",
            life: [
              "got stared at in the street every single day",
              "got offered a job in a travelling circus",
              "learned to laugh along with the werewolf jokes",
            ],
          },
          {
            id: "hivimmune",
            name: "HIV Immunity",
            col: "#1e88e5",
            h: 90,
            base: 0.05,
            pass: 0.05,
            old: "a lucky constitution",
            fx: { Health: 3 },
            desc: "Two copies of the CCR5-Δ32 gene, which blocks the main way HIV gets into cells.",
            born: "I was born with two copies of CCR5-Δ32: I'm naturally immune to HIV.",
            life: [
              "got asked to help with HIV research",
              "got a letter from a lab asking for a blood sample",
              "stayed healthy through epidemics that hit everyone else",
            ],
          },
          {
            id: "tetrachromacy",
            name: "Tetrachromacy",
            col: "#00acc1",
            h: 60,
            base: 0.05,
            pass: 0.05,
            old: "a painter's eye",
            fOnly: 1,
            fx: { Smarts: 3 },
            desc: "A fourth kind of color cone in the eyes: sees up to 100 times more colors than most people. Almost always women.",
            born: "I was born a tetrachromat: I can see colors other people can't.",
            life: [
              "could tell apart colors nobody else could see",
              'painted with colors people called "impossible"',
              "won every argument about what color something was",
            ],
          },
          {
            id: "dec2",
            name: "DEC2 Short Sleeper",
            col: "#3949ab",
            h: 80,
            base: 0.05,
            pass: 0.05,
            old: "a restless sleeper",
            fx: { Smarts: 5 },
            desc: "A DEC2 gene mutation that means feeling fully rested after only 4–6 hours of sleep.",
            born: "I was born with the DEC2 gene: I only need about 5 hours of sleep.",
            life: [
              "got up before everyone else and went to bed after them",
              "got twice as much done as everyone else",
              "used the extra hours to read every book in the house",
            ],
          },
        ],
        BT = Object.fromEntries(BIRTH_TRAITS.map((e) => [e.id, e])),
        TALENTS = {
          acting: { name: "Acting", ico: "talent/acting.png", fx: { Looks: 5, Happiness: 5 } },
          crime: { name: "Crime", ico: "talent/crime.png", fx: { Smarts: 3 } },
          dealing: { name: "Dealing", ico: "talent/dealing.png", fx: { Smarts: 3 } },
          modeling: { name: "Modeling", ico: "talent/modeling.png", fx: { Looks: 15 } },
          music: { name: "Music", ico: "talent/music.png", fx: { Happiness: 8, Smarts: 4 } },
          sports: { name: "Sports", ico: "talent/sports.png", fx: { Health: 12 } },
        };
