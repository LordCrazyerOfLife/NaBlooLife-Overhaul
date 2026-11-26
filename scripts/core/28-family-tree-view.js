      function ftSpr(e, t = 40, a = "") {
        const o = FT_SPR[e];
        if (!o) return "";
        const [n, s, r, i, l] = o,
          [c, d, u] = FT_SHEETS[n],
          h = Math.max(i, l) + 6,
          p = s + i / 2,
          m = r + l / 2;
        return `<span class="ft-spr ${a}" style="width:${t}px;height:${t}px;background-image:url(${c});background-size:${((d / h) * 100).toFixed(2)}% ${((u / h) * 100).toFixed(2)}%;background-position:${(((p - h / 2) / (d - h)) * 100).toFixed(2)}% ${(((m - h / 2) / (u - h)) * 100).toFixed(2)}%"></span>`;
      }
      function ftYears(e) {
        const t = ftNow();
        if (e === state) return [state.birthYear, t];
        if (e.anc) return [e.born, Math.min(e.born + e.life, t)];
        const a =
          null != e.ageAtBirth ? state.birthYear - e.ageAtBirth : state.birthYear - (e.ageOffset ?? 0);
        return [a, e.dead ? a + (e.diedAge || 0) : t];
      }
      document.head.insertAdjacentHTML(
        "beforeend",
        `<style>${FT_CONDS.map(({ id: e, col: t }) => `.ft-tree[data-hl="${e}"] .ft-card:not(.has-${e}){opacity:.25;filter:grayscale(1)}.ft-tree[data-hl="${e}"] .ft-card.has-${e}{box-shadow:0 0 0 3px ${t},0 0 22px 6px ${t}}.ft-tree[data-hl="${e}"] .ft-svg .ln:not(.ln-${e}){opacity:.06}.ft-tree[data-hl="${e}"] .ft-svg .tl-${e}{display:inline}.ft-tree[data-hl="${e}"] .ft-fx:not(.fx-${e}),.ft-tree[data-hl="${e}"] .ft-gc{opacity:.35}`).join("")}</style>`,
      );
      const ftAllowed = (e, t) => {
          let [a, o] = ftYears(e);
          return (
            (e === state ? !state.dead : !e.anc && !e.dead) && (o = Math.max(o, a + 80)),
            o >= t.from + 1 && a + 40 >= t.from && o - a >= Math.min(t.onset, 3)
          );
        },
        ftForm = (e, t) => {
          const a = FT_COND[t.id || t].form;
          if (!a) return null;
          const [o, n] = ftYears(e);
          return (e.formSeed ??= Math.random()), a(Math.max(o + 16, Math.min(n, o + 30)), e.formSeed);
        };
      function ftGenes(e, t = []) {
        if (!e || e.conds) return e && e.conds;
        const a = [],
          o = [],
          n = {},
          s = (t = t.filter((e) => e && e.conds)).filter((e) =>
            e.conds.some((e) => FT_COND[e.id] && "add" === FT_COND[e.id].grp),
          ),
          r = e === state ? "m" === PG() : "m" === (e.g || e.gender);
        for (const i of [...FT_CONDS].sort(() => Math.random() - 0.5)) {
          if (!ftAllowed(e, i)) continue;
          const l = t.filter((e) => e.conds.some((e) => e.id === i.id));
          let c = l.length ? 1 - (1 - i.pass) ** l.length : t.length ? 0.6 * i.base : i.base;
          if ("gene" === i.grp) {
            i.fOnly && r && (c *= 0.1),
              (n[i.id] = Math.min(0.95, c)),
              (e.genes ? e.genes.includes(i.id) : (e.forceGenes || []).includes(i.id) || chance(c)) &&
                o.push({ id: i.id, par: l, general: !1 });
            continue;
          }
          let d = l;
          "add" === i.grp && !l.length && s.length && ((c = Math.max(c, 2.5 * i.base)), (d = s)),
            (n[i.id] = Math.min(0.95, c)),
            a.length < 4 && chance(c) && a.push({ id: i.id, par: d, general: d !== l });
        }
        return (
          (e.risk = n),
          geneLook(
            e.look,
            o.map((e) => e.id),
          ),
          (e.conds = [...a, ...o])
        );
      }
      function ftInheritAll(e, t) {
        const a = e.cave;
        [...e.gp, ...e.p.flat(), ...e.m.flat()].forEach((e) => {
          ftServe(e), !e || !e.look || (e.mil && e.mil.active) || delete e.look.milHat;
        }),
          ftServeNow(t),
          [...t.cousins, ...t.aus, ...t.sibs, t.dad, t.mom].forEach((e) => {
            if (
              (e &&
                e.mil &&
                e.mil.active &&
                (e.dead || ftNow() - ftYears(e)[0] >= 60) &&
                ((e.mil.active = !1),
                (e.mil.years = Math.max(1, ftYears(e)[1] - e.mil.y)),
                e.look && delete e.look.milHat),
              !e)
            )
              return;
            const t = e.mil && e.mil.active && !e.dead,
              a = ftNow() - ftYears(e)[0],
              o = t ? `${e.mil.branch} ${e.mil.rank}` : null;
            if (t) {
              const t = profileOf(e, a);
              (t.job = o), (t.milJob = o);
            } else
              e.look && delete e.look.milHat,
                e.prof &&
                  e.prof.milJob &&
                  (e.prof.job === e.prof.milJob && (e.prof.job = a >= 65 ? "Retired" : jobFor(a)),
                  delete e.prof.milJob);
          }),
          state.conds ||
            !1 === state.customGenes ||
            (state.genes || []).forEach((e) => {
              const a = "tetrachromacy" === e ? t.mom : chance(0.5) ? t.dad : t.mom;
              "chimera" !== e &&
                a &&
                !a.conds &&
                chance(Math.min(0.8, 1.4 * FT_COND[e].pass)) &&
                (a.forceGenes ||= []).push(e);
            }),
          ftGenes(a.elder),
          ftGenes(a.mom),
          ftGenes(a.dad, [a.elder]),
          a.kids.forEach((e) => ftGenes(e, [a.dad, a.mom]));
        const o = a.kids.find((e) => e.heir);
        for (const [t, a] of [
          [e.p, 0],
          [e.m, 1],
        ])
          for (let e = t.length - 1; e >= 0; e--) {
            const n = t[e][a],
              s = t[e][1 - a];
            ftGenes(n, e === t.length - 1 ? [o] : t[e + 1]), ftGenes(s);
          }
        const [n, s, r, i] = e.gp;
        ftGenes(n, e.p[0]),
          ftGenes(s),
          ftGenes(i, e.m[0]),
          ftGenes(r),
          ftGenes(t.dad, [n, s]),
          ftGenes(t.mom, [r, i]),
          t.aus.forEach((e) => ftGenes(e, "P" === e.ftSide ? [n, s] : [r, i])),
          [state, ...t.sibs].forEach((e) => ftGenes(e, [t.dad, t.mom])),
          t.partner && ftGenes(t.partner),
          [...t.cousins, ...t.nibs, ...t.ckids].forEach((e) => ftGenes(e, e.ftPar ? [e.ftPar] : [])),
          btBloodline(t);
      }
      function btBloodline(e) {
        if (!1 !== state.customGenes || state.genesBloodline || state.genesShown) return;
        state.genesBloodline = !0;
        const t = [e.dad, e.mom].filter((e) => e && e.conds),
          a = "m" === PG(),
          o = [];
        state.risk ||= {};
        for (const e of BIRTH_TRAITS) {
          const n = FT_COND[e.id],
            s = t.filter((t) => t.conds.some((t) => t.id === e.id));
          let r = s.length ? 1 - (1 - n.pass) ** s.length : t.length ? 0.6 * n.base : n.base;
          n.fOnly && a && (r *= 0.1),
            (state.risk[e.id] = Math.min(0.95, r)),
            chance(r) && o.push({ id: e.id, par: s, general: !1, odds: r });
        }
        (state.conds = [
          ...(state.conds || []).filter((e) => !FT_COND[e.id] || "gene" !== FT_COND[e.id].grp),
          ...o,
        ]),
          (state.genes = o.map((e) => e.id)),
          geneLook(state.look, state.genes);
      }
      const ftActive = (e, t) => e.age >= FT_COND[t.id].onset,
        ftFxHTML = (e, t) =>
          `<div class="ft-fx fx-${t.id}${ftActive(e, t) ? "" : " carrier"}" style="--cc:${FT_COND[t.id].col}"></div>`,
        FT_ICONS = {
          depression:
            '<path d="M7 14.5a3.6 3.6 0 1 1 .7-7.1A4.8 4.8 0 0 1 16.9 8.7 3 3 0 0 1 17 14.5z"/><path d="M8.5 17.5l-.8 2.2M12 17.5l-.8 2.2M15.5 17.5l-.8 2.2"/>',
          bipolar: '<circle cx="12" cy="12" r="7.5"/><path class="f" d="M12 4.5a7.5 7.5 0 0 0 0 15z"/>',
          anxiety: '<path d="M2.5 12.5h4l2-5 3.2 10 2.8-7 1.6 2h5.4"/>',
          adhd: '<path class="f" d="M13.5 2.5 5 13.5h6l-1 8 8.5-11h-6z"/>',
          ocd: '<path d="M16.5 3.5l3 3-3 3M5 11.5v-1.5a3.5 3.5 0 0 1 3.5-3.5h11M7.5 20.5l-3-3 3-3M19 12.5V14a3.5 3.5 0 0 1-3.5 3.5h-11"/>',
          schizophrenia:
            '<path d="M3.5 4.5h11v7h-6l-3.5 3v-3h-1.5z"/><path d="M17.5 9.5h3v7h-1.5v3l-3.5-3h-5v-2"/>',
          addiction: '<path d="M9.5 2.5h5M10.5 2.5v4.2L8 10v10.5h8V10l-2.5-3.3V2.5"/><path d="M8 14h8"/>',
          insomnia: '<path class="f" d="M15.5 3.5a8.5 8.5 0 1 0 5 13.6A7 7 0 0 1 15.5 3.5z"/>',
          ptsd: '<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6z"/><path d="M13 7.5l-2.5 4.5h3L11 16.5"/>',
          eating: '<circle cx="12" cy="13" r="6.5"/><path d="M12 6.5c0-2 1-3 2.5-3.5"/>',
          nicotine: '<path d="M3 15h14v3.5H3zM17 15h4v3.5h-4"/><path d="M18 12c0-2 2-2 2-4s-1.5-2.5-1.5-4"/>',
          cannabis:
            '<path d="M12 21v-7M12 14c-1-4-1-7 0-11 1 4 1 7 0 11zM12 14c-3-2-5.5-4-7-7 3.5 1 5.5 3 7 7zM12 14c3-2 5.5-4 7-7-3.5 1-5.5 3-7 7z"/>',
          opioid:
            '<rect x="4" y="9" width="16" height="7" rx="3.5" transform="rotate(-35 12 12.5)"/><path d="M9.5 8.5l5 8"/>',
          cocaine:
            '<path d="M3 17.5h18M6 14.5h12"/><circle class="f" cx="9" cy="10" r="1"/><circle class="f" cx="13" cy="9" r="1"/><circle class="f" cx="15" cy="11.5" r="1"/>',
          gambling:
            '<rect x="4" y="4" width="16" height="16" rx="3.5"/><circle class="f" cx="9" cy="9" r="1.4"/><circle class="f" cx="15" cy="15" r="1.4"/><circle class="f" cx="12" cy="12" r="1.4"/>',
          caffeine:
            '<path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5c0 1.5 1 1.5 1 3M12 3.5c0 1.5 1 1.5 1 3"/>',
          gaming:
            '<path d="M7 8.5h10a4 4 0 0 1 3.8 5.3l-1 3a2.2 2.2 0 0 1-3.8.7L14.5 16h-5L8 17.5a2.2 2.2 0 0 1-3.8-.7l-1-3A4 4 0 0 1 7 8.5z"/><path d="M8.5 11v3M7 12.5h3"/>',
          internet: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
        },
        ftIco = (e, t = "", a = "") => {
          const o = FT_COND[e];
          return o.img
            ? `<span class="ft-ico sp ${t}" style="--cc:${o.col}"${a}>${ftGenePic(o, 16)}</span>`
            : o.spr
              ? `<span class="ft-ico sp ${t}" style="--cc:${o.col}"${a}>${ftSpr(o.spr, 16, o.gray ? "gray" : "")}</span>`
              : `<span class="ft-ico ${t}" style="--cc:${o.col}"${a}><svg viewBox="0 0 24 24">${FT_ICONS[e]}</svg></span>`;
        },
        ftDotHTML = (e, t = "") => ftIco(e, t ? "lg" : "");
      function ftGenePic(e, t) {
        return `<span class="ft-spr" style="width:${t}px;height:${t}px;background:url(${e.img}) center/contain no-repeat"></span>`;
      }
      const ftTip = document.createElement("div");
      (ftTip.className = "ft-tip"), ftWrap.append(ftTip);
      const ftSbTree = blScroll(ftScroll),
        ftSbDlg = blScroll(ftDlg, "light");
      blScroll(ev, "light");
      let ftTipKey = null;
      const ftTipPos = (e, t) => {
          const a = ftWrap.clientWidth,
            o = ftWrap.clientHeight,
            n = ftTip.offsetWidth,
            s = ftTip.offsetHeight;
          (ftTip.style.left = Math.max(6, Math.min(e + 14, a - n - 6)) + "px"),
            (ftTip.style.top = (t + 16 + s > o ? Math.max(6, t - s - 12) : t + 16) + "px");
        },
        ftTipShow = (e, t, a, o = e, n = null) => {
          ftTipKey !== o &&
            ((ftTipKey = o), (ftTip.innerHTML = e), n && ftTip.querySelector(".tt-face")?.replaceWith(n)),
            ftTip.classList.add("show"),
            ftTipPos(t, a);
        },
        ftTipHide = () => {
          ftTip.classList.remove("show"), (ftTipKey = null);
        },
        ftTipAt = (e) => {
          const t = ftWrap.getBoundingClientRect();
          return [e.clientX - t.left, e.clientY - t.top];
        };
      ftTree.addEventListener("mousemove", (e) => {
        const t = e.target.closest("[data-tip]");
        if (!t) return;
        const a = t.dataset.tip,
          o = a.startsWith('<div class="ft-tr"');
        ftTipShow(
          o
            ? `<div class="tt-tag">Passed Down</div><div class="tt-rows">${a}</div>`
            : `<div class="tt-tag">This Generation</div><div class="none" style="font-style:normal;color:#333;padding-top:8px">${a}</div>`,
          ...ftTipAt(e),
          a,
        );
      }),
        ftTree.addEventListener("mouseout", (e) => {
          e.target.closest("[data-tip]") && ftTipHide();
        }),
        ftScroll.addEventListener("scroll", ftTipHide);
      const ftParNames = (e) =>
        e.par.length
          ? "Inherited from " + e.par.map((e) => (e === state ? "you" : e.first)).join(" & ")
          : "No family history: it started with them";
      function ftCardTip(e) {
        const t = ftConds(e.src);
        return `<div class="tt-tag">${t.length ? "Hereditary Traits" : "Family Tree"}</div><div class="tt-head${e.dead ? " dead" : ""}"><span class="tt-face"></span><div><h5>${e.first} ${e.last}</h5><div class="sub">${e.title}${e.dead ? ` · died at ${e.age}` : ` · age ${e.age}`}</div></div></div><div class="tt-rows">${
          t.length
            ? t
                .map((t) => {
                  const a = FT_COND[t.id],
                    o = ftActive(e, t),
                    n = ftForm(e.src, t);
                  return (
                    `<div class="ft-tr" style="--cc:${a.col}">${ftTraitPic(e, t, 30)}<div><b>${a.name}</b>${o ? "" : "<em>carrier</em>"}` +
                    (n ? `<small>Hooked on ${n[0]}</small>` : "") +
                    `<small class="from">${o ? ftParNames(t) : `${ftParNames(t)} · usually shows by age ${a.onset}`}</small>` +
                    `<small>${a.desc}</small></div></div>`
                  );
                })
                .join("")
            : `<div class="none">${ftSpr("happy", 22)} No hereditary conditions</div>`
        }</div><div class="tt-foot">Click for their full profile</div>`;
      }
      const ftTipFace = (e) => {
        if (e.cave) return ftCaveFace(e);
        const t = ftConds(e.src).find((t) => ftActive(e, t));
        return npcFace(
          e.look || randomLook(e.g, e.age),
          e.g,
          Math.max(0, e.age),
          t && "depression" === t.id ? "sad" : "happy",
        );
      };
      function ftNode(e, t, a = {}) {
        const o = ftNow();
        let n;
        if (e === state)
          n = {
            first: state.first,
            last: SURNAME,
            g: PG(),
            look: state.look,
            born: state.birthYear,
            age: state.age,
            dead: !1,
            you: !0,
          };
        else if (e.anc) {
          const t = e.born + e.life <= o;
          e.look && e.born < 1940 && (e.look.accRoll = e.look.hatRoll = 1),
            (n = {
              first: e.first,
              last: e.last,
              g: e.g,
              look: e.look,
              born: e.born,
              dead: t,
              age: t ? e.life : o - e.born,
              country: e.country,
              cave: !!e.cave,
            });
        } else
          n = e.role
            ? {
                first: e.first,
                last: SURNAME,
                g: e.gender,
                look: e.look,
                born: state.birthYear - e.ageAtBirth,
                dead: !!e.dead,
                age: e.dead ? e.diedAge : e.ageAtBirth + state.age,
              }
            : {
                first: e.first,
                last: e.last,
                g: e.g,
                look: e.look,
                born: state.birthYear - (e.ageOffset ?? 0),
                dead: !!e.dead,
                age: e.dead ? e.diedAge : null != e.ageOffset ? relAge(e) : e.age || 25,
              };
        const s =
          e === state
            ? state.royal && !state.royal.abdicated
              ? { ...state.royal, nth: state.royal.dynasty && state.royal.dynasty.nth, heir: !0 }
              : null
            : e.royal || null;
        return Object.assign(
          n,
          {
            src: e,
            title: t,
            royal: s,
            country: n.country || e.country || state.country,
            famous: e.famous,
            anc: !!e.anc,
            died: n.dead ? n.born + n.age : null,
            rel: e.anc ? null : e.rel,
          },
          a,
        );
      }
      const ftOrd = (e) => e + ({ 2: "nd", 3: "rd" }[e] || "th"),
        GT = (e) =>
          ["", "", "Grand", "Great-Grand", "Great-Great-Grand", "Great-Great-Great-Grand"][e] ||
          `${ftOrd(e - 2)} Great-Grand`,
        FT_ART = {
          cave: ["eras/s-cave.png?v=5", "Stone Age scene", "#c8bcac"],
          c1700: ["eras/s-victorian.png?v=5", "Gas-lit city scene", "#aeabb1"],
          c1800: ["eras/s-western.png?v=5", "Frontier town scene", "#abafb2"],
          c1850: ["eras/s-victorian.png?v=5", "Gas-lit city scene", "#aeabb1"],
          c1900: ["eras/s-ww2.png?v=5", "War-torn town scene", "#7f8080"],
          c1950: ["eras/s-suburb.png?v=5", "Post-war suburb scene", "#a5aea5"],
          c1970: ["eras/s-seventies.png?v=5", "1970s city scene", "#b3ac9a"],
          c2000: ["eras/s-modern.png?v=5", "Modern city scene", "#7fb0cb"],
        },
        FT_ERAS = [
          {
            to: -3e3,
            name: "Stone Age · Ice Age hunter-gatherers",
            col: "#4a3f33",
            art: FT_ART.cave,
            old: 1,
          },
          { to: 1800, name: "1700s · Age of Enlightenment", col: "#6e5f48", art: FT_ART.c1700, old: 1 },
          { to: 1850, name: "Early 1800s · Romantic Era", col: "#3f3d27", art: FT_ART.c1800, old: 1 },
          { to: 1900, name: "Late 1800s · Victorian Era", col: "#3a2a22", art: FT_ART.c1850 },
          { to: 1946, name: "Early 1900s · Jazz Age & World Wars", col: "#3b352f", art: FT_ART.c1900 },
          { to: 1965, name: "Mid-Century · Post-War America", col: "#5e5b57", art: FT_ART.c1950 },
          { to: 1997, name: "1970s–90s · Disco to Dial-Up", col: "#2e1e18", art: FT_ART.c1970 },
          { to: 9999, name: "Modern Day", col: "#2a2f4a", art: FT_ART.c2000 },
        ],
        ftEra = (e) => FT_ERAS.find((t) => e < t.to),
        FT_CAVE_SHEETS = {
          clan: ["cave/faces-clan.webp", 1536, 1024],
          pair: ["cave/faces-pair.webp", 1774, 887],
          elders: ["cave/faces-elders.webp", 1448, 1086],
        },
        FT_CAVE_SPRITES = (() => {
          const e = [96, 262, 430, 600, 770, 938, 1110, 1280, 1450],
            t = [];
          return (
            "m m m m m f f m m"
              .split(" ")
              .forEach((a, o) => t.push(["clan", e[o], 104, 188, a, 3 === o ? "elder" : "adult"])),
            e.forEach((e) => t.push(["clan", e, 292, 188, "f", "adult"])),
            "m m m m m m f f b"
              .split(" ")
              .forEach((a, o) =>
                t.push(["clan", e[o], 478, 188, "b" === a ? "x" : a, "b" === a ? "baby" : "kid"]),
              ),
            [
              [40, 28, 372, 428, "m", "adult"],
              [436, 40, 444, 444, "f", "adult"],
              [916, 32, 392, 432, "m", "elder"],
              [1348, 60, 416, 416, "f", "adult"],
            ].forEach(([e, a, o, n, s, r]) =>
              t.push(["pair", e + o / 2, a + n / 2, 1.02 * Math.max(o, n), s, r]),
            ),
            [
              [64, 8, 316, 310, "m"],
              [416, 8, 296, 308, "m"],
              [744, 28, 312, 292, "f"],
              [1120, 0, 236, 300, "f"],
              [64, 318, 316, 300, "m"],
              [428, 320, 264, 308, "f"],
              [776, 344, 236, 264, "m"],
              [1092, 328, 292, 268, "f"],
            ].forEach(([e, a, o, n, s]) =>
              t.push(["elders", e + o / 2, a + n / 2, 1.04 * Math.max(o, n), s, "elder"]),
            ),
            t
          );
        })();
      function ftCaveFace(e) {
        const t = e.age < 3 ? "baby" : e.age < 14 ? "kid" : e.age < 40 ? "adult" : "elder",
          a = FT_CAVE_SPRITES.filter((a) => a[5] === t && (a[4] === e.g || "x" === a[4])),
          o = a.length ? a : FT_CAVE_SPRITES.filter((e) => e[5] === t),
          n = t + e.g;
        (e.src.sprites ??= {}), (e.src.sprites[n] ??= rint(0, o.length - 1));
        const [s, r, i, l] = o[e.src.sprites[n] % o.length],
          [c, d, u] = FT_CAVE_SHEETS[s],
          h = document.createElement("div");
        return (
          (h.className = "fc cave"),
          (h.style.cssText = `background-image:url(${c});background-size:${((d / l) * 100).toFixed(2)}% auto;background-position:${(((r - l / 2) / (d - l)) * 100).toFixed(2)}% ${(((i - l / 2) / (u - l)) * 100).toFixed(2)}%`),
          h
        );
      }
      function ftCard(e) {
        const t = document.createElement("div");
        t.className = `ft-card ${e.g}${e.dead ? " dead" : ""}${e.famous ? " famous" : ""}${e.royal && !e.famous ? " royal" : ""}${e.you ? " you" : ""}`;
        const a = ftConds(e.src),
          o = a.find((t) => ftActive(e, t)),
          n = o && "depression" === o.id ? "sad" : "happy";
        let s;
        if (
          (e.cave
            ? (s = ftCaveFace(e))
            : ((s = npcFace(e.look || randomLook(e.g, e.age), e.g, Math.max(0, e.age), n)),
              s.classList.add("fc")),
          t.append(s),
          t.insertAdjacentHTML(
            "beforeend",
            `<b>${e.first} ${e.last}</b><span class="rl">${e.cardTitle || e.title}</span>` +
              (e.cave
                ? `<span class="ag">c. ${ftY(e.born)}</span>`
                : `<span class="ag"><img src="flags/${e.country}.png" alt="">${e.dead ? `${e.born}–${e.died}` : `Age ${e.age}`}</span>`) +
              `<span class="ft-pill">${e.dead ? '<img src="emoji/2620-fe0f.png" alt="" style="width:11px;height:11px;filter:brightness(3)">' + (e.cave ? `Died at ${e.age}` : "Deceased") : "♥ Alive"}</span>`,
          ),
          a.length)
        ) {
          a.forEach((e) => t.classList.add("has-" + e.id)), o && t.classList.add("c-" + o.id);
          const n = a.length > 4 ? a.slice(0, 3) : a;
          t.insertAdjacentHTML(
            "beforeend",
            `<div class="ft-cbadges">${n.map((t) => ftIco(t.id, ftActive(e, t) ? "" : "carrier")).join("")}` +
              (a.length > n.length ? `<span class="ft-ico ft-more">+${a.length - n.length}</span>` : "") +
              "</div>",
          ),
            t.insertAdjacentHTML("beforeend", ftFxHTML(e, o || a[0]));
        }
        const r = (t) => {
          ftTree.classList.toggle("hovering", t && !!e._fi),
            e._fi &&
              ftTree
                .querySelectorAll(`.ft-svg .gl[data-who~="${e._fi}"]`)
                .forEach((e) => e.classList.toggle("lit", t)),
            e._fi &&
              ftTree
                .querySelectorAll(`.ft-inh[data-who~="${e._fi}"]`)
                .forEach((e) => e.classList.toggle("hov", t));
        };
        (t.onmouseenter = (t) => {
          ftTipShow(ftCardTip(e), ...ftTipAt(t), e, ftTipFace(e)), r(!0);
        }),
          (t.onmousemove = (e) => ftTipPos(...ftTipAt(e))),
          (t.onmouseleave = () => {
            ftTipHide(), r(!1);
          });
        const i = e.royal
          ? `<span class="ft-tag royal"><img src="royal/crown.png" alt="">${e.royal.founder ? "FOUNDER" : e.royal.heir ? "HEIR" : "ROYAL"}</span>`
          : "";
        return (
          e.royal && !e.famous && t.insertAdjacentHTML("beforeend", i),
          e.famous &&
            t.insertAdjacentHTML(
              "beforeend",
              `${i || '<span class="ft-tag">★ FAMOUS</span>'}<div class="ft-orbit">${[0, 60, 120, 180, 240, 300].map((e, t) => `<span style="transform:rotate(${e}deg) translate(66px) rotate(-${e}deg);animation-delay:${0.23 * t}s"></span>`).join("")}</div>`,
            ),
          (t.onclick = () => {
            ftTipHide(), play("toList"), ftPerson(e);
          }),
          (e.el = t),
          (t._n = e),
          t
        );
      }
      const ftGroup = (e, t) => {
        const a = document.createElement("div");
        return (
          (a.className = "ft-grp" + (t ? " couple" : "")),
          e.forEach((e) => a.append(ftCard(e))),
          t &&
            2 === e.length &&
            a.insertAdjacentHTML(
              "beforeend",
              `<div class="ft-heart${e.some((e) => e.dead) ? " gone" : ""}">❤️</div>`,
            ),
          a
        );
      };
      function openFamilyTree() {
        ftPrepare().then(ftRenderTree, ftRenderTree);
      }
      function ftRenderTree() {
        const e = ftSetup(),
          t = (ftNow(), state.family.filter((e) => relAge(e) >= 0 || e.dead)),
          a = state.parents.find((e) => "Father" === e.role),
          o = state.parents.find((e) => "Mother" === e.role),
          n = (t) => (t === e.gp[0] || t === e.gp[1] ? "Paternal" : "Maternal"),
          s = (t) =>
            [e.p[t - 3], e.m[t - 3]].map((e, a) =>
              e.map((e) =>
                ftNode(e, `${GT(t)}${"m" === e.g ? "father" : "mother"}`, {
                  side: a ? "Maternal" : "Paternal",
                  gen: t,
                  cardTitle: `${t > 3 ? ftOrd(t - 2) + " " : ""}Great-<br>Grand${"m" === e.g ? "father" : "mother"}`,
                }),
              ),
            ),
          r = [],
          i = 2 + e.p.length,
          l = e.cave,
          c = (e) => ("m" === e.g ? "Son" : "Daughter"),
          d = (e, t, a) => ftNode(e, `${t} · ${l.clan}`, { cardTitle: a || t }),
          u = d(l.elder, "Clan Elder"),
          h = d(l.dad, "Ancient Forefather", "Ancient<br>Forefather"),
          p = d(l.mom, "Ancient Foremother", "Ancient<br>Foremother"),
          m = l.kids.map((e) =>
            d(
              e,
              e.heir ? "Ancient Ancestor" : `Their ${c(e)}`,
              e.heir ? "Ancient<br>Ancestor" : `Their ${c(e)}`,
            ),
          );
        r.push({ k: 99, label: "Stone Age Ancestors", groups: [[[u]], [[h, p], !0], [m]] });
        for (let e = i; e >= 3; e--) {
          const [t, a] = s(e);
          r.push({
            k: e,
            label: `${GT(e)}parents`,
            groups: [
              [t, !0],
              [a, !0],
            ],
          });
        }
        const f = e.gp.map((e) =>
          ftNode(e, "m" === e.g ? "Grandfather" : "Grandmother", { side: n(e), gen: 2 }),
        );
        r.push({
          k: 2,
          label: "Grandparents",
          groups: [
            [f.slice(0, 2), !0],
            [f.slice(2), !0],
          ],
        });
        const g = t.filter((e) => "auntuncle" === e.kind);
        g.forEach((e, t) => (e.ftSide ??= t % 2 ? "M" : "P"));
        const y = (e) =>
            ftNode(e, "m" === e.g ? "Uncle" : "Aunt", { side: "P" === e.ftSide ? "Paternal" : "Maternal" }),
          b = g.filter((e) => "P" === e.ftSide).map(y),
          v = g.filter((e) => "M" === e.ftSide).map(y);
        o.maiden ??= e.matLast;
        const w = ftNode(a, "Father"),
          k = ftNode(o, "Mother");
        r.push({ k: 1, label: "Parents, Aunts & Uncles", groups: [[b], [[w, k], !0], [v]] });
        const $ = t.filter((e) => "sibling" === e.kind).sort((e, t) => t.ageOffset - e.ageOffset),
          S = (e) => ftNode(e, relTitle(e)),
          x = ftNode(state, "You"),
          C =
            (state.spouse && !state.spouse.dead && state.spouse.look ? state.spouse : null) ||
            state.lovers.find((e) => e.main && !e.dead),
          I = C ? ftNode(C, state.spouse === C ? ("f" === C.g ? "Wife" : "Husband") : loverTitle(C)) : null,
          T = $.filter((e) => e.ageOffset > 0).map(S),
          A = $.filter((e) => e.ageOffset <= 0).map(S),
          M = t.filter((e) => "cousin" === e.kind);
        M.forEach((e) => {
          void 0 === e.ftPar && (e.ftPar = g.find((t) => t.last === e.last) || (g.length ? any(g) : null));
        });
        const L = (e) =>
            ftNode(e, "Cousin", { side: e.ftPar && "M" === e.ftPar.ftSide ? "Maternal" : "Paternal" }),
          E = M.filter((e) => !e.ftPar || "P" === e.ftPar.ftSide).map(L),
          H = M.filter((e) => e.ftPar && "M" === e.ftPar.ftSide).map(L);
        r.push({ k: 0, label: "Your Generation", groups: [[E], [[...T, x]], [I ? [I] : []], [A], [H]] });
        const R = t.filter((e) => "nibling" === e.kind),
          B = t.filter((e) => "cousinkid" === e.kind),
          O = $.filter((e) => "f" === e.g && e.ageOffset > 0);
        R.forEach((e) => {
          void 0 === e.ftPar && (e.ftPar = O.length ? any(O) : $.length ? any($) : null);
        }),
          B.forEach((e) => {
            void 0 === e.ftPar && (e.ftPar = M.find((t) => t.last === e.last) || (M.length ? any(M) : null));
          });
        const P = t
            .filter((e) => "child" === e.kind && !e.adoptedOut)
            .map((e) => ftNode(e, "m" === e.g ? "Son" : "Daughter")),
          Y = [
            ...P,
            ...R.map((e) => ftNode(e, "m" === e.g ? "Nephew" : "Niece")),
            ...B.map((e) => ftNode(e, relTitle(e))),
          ];
        Y.length && r.push({ k: -1, label: "Next Generation", groups: [[Y]] }),
          ftInheritAll(e, { dad: a, mom: o, aus: g, sibs: $, partner: C, cousins: M, nibs: R, ckids: B }),
          ftTree.replaceChildren(),
          ftPop.classList.remove("open");
        const N = [];
        for (const e of r) {
          const t = document.createElement("div");
          t.className = "ft-gen";
          const a = e.groups.flatMap(([e]) => e),
            o = a.map((e) => e.born).filter(Number.isFinite),
            n = Math.min(...o),
            s = Math.max(...o),
            r = o.length
              ? n < 0
                ? `c. ${(-n).toLocaleString("en-US")}–${(-s).toLocaleString("en-US")} BC`
                : `born ${n}${s !== n ? "–" + s : ""}`
              : "";
          (t._era = ftEra(o.length ? [...o].sort((e, t) => e - t)[o.length >> 1] : ftNow())),
            (t._famous = a.some((e) => e.famous)),
            t.classList.toggle("fame", t._famous);
          const i = [...new Set(a.flatMap((e) => ftConds(e.src).map((e) => e.id)))];
          t.innerHTML =
            `<div class="ft-label">${e.label}<i>${r}</i></div><div class="ft-era">${t._famous ? "★ Famous Generation · " : ""}${t._era.name}` +
            i
              .map(
                (e) =>
                  `<span class="ft-gc" data-tip="<b>${FT_COND[e].name}</b> shows up in this generation">${ftIco(e)}</span>`,
              )
              .join("") +
            "</div>";
          const l = document.createElement("div");
          (l.className = "ft-row"),
            e.groups.forEach(([t, a], o) => {
              t.length &&
                (o &&
                  e.k >= 2 &&
                  99 !== e.k &&
                  l.insertAdjacentHTML("beforeend", '<div class="ft-sep"></div>'),
                l.append(ftGroup(t, a)));
            }),
            t.append(l),
            ftTree.append(t),
            N.push(...a);
        }
        const j = [],
          D = m.find((e) => e.src.heir),
          _ = r.find((e) => e.k === i).groups.flatMap(([e]) => e),
          F = Math.round((Math.min(..._.map((e) => e.born)) - D.born) / 25);
        j.push(
          [[u], [h], !0],
          [[h, p], m, !0],
          [[D], [_[0], _[3]], !0, `≈ ${F.toLocaleString("en-US")} generations later`],
        );
        for (let e = i; e >= 3; e--) {
          const [t, a] = r.find((t) => t.k === e).groups.map(([e]) => e),
            o = r.find((t) => t.k === e - 1).groups,
            n = 3 === e ? f[0] : o[0][0][0],
            s = 3 === e ? f[3] : o[1][0][1];
          j.push([t, [n], !0], [a, [s], !0]);
        }
        j.push([f.slice(0, 2), [...b, w], !0], [f.slice(2), [k, ...v], !0]),
          j.push([[w, k], [...T, x, ...A], !0]),
          P.length && j.push([[x], P, !0]);
        const G = (e) => N.find((t) => t.src === e);
        for (const e of [M, R, B]) {
          const t = new Map();
          e.forEach((e) => {
            const a = e.ftPar && G(e.ftPar);
            a && (t.has(a) || t.set(a, []), t.get(a).push(G(e)));
          }),
            t.forEach((e, t) => j.push([[t], e.filter(Boolean), !1]));
        }
        const W = M.filter((e) => !e.ftPar).map(G);
        W.length && j.push([f.slice(0, 2), W, !1]), (ftWrap._links = j), (ftWrap._partner = I && [x, I]);
        const q = N.filter((e) => !e.dead).length;
        (document.getElementById("ftLegRoyal").style.display = N.some((e) => e.royal) ? "" : "none"),
          (document.getElementById("ftSub").innerHTML =
            `<img src="emoji/1f333.png" alt=""><span><b>${N.length}</b> family members · <b>${q}</b> living · the <b>${SURNAME}</b> bloodline</span>`);
        const z = FT_CONDS.map((e) => [
            e,
            N.filter((t) => ftConds(t.src).some((t) => t.id === e.id)).length,
          ]).filter(([, e]) => e),
          U = document.getElementById("ftTraits");
        delete ftTree.dataset.hl,
          (U.innerHTML =
            '<button class="key" title="What do the icons mean?">?</button><button class="glb" id="ftGlobeTraits" title="Where each trait came from"><img src="emoji/1f30e.png" alt="">Map</button><span class="lbl">Traits</span><button class="on" data-hl="">All</button>' +
            z
              .map(
                ([e, t]) =>
                  `<button data-hl="${e.id}" style="--cc:${e.col}">${ftIco(e.id)}${e.name}<b>${t}</b></button>`,
              )
              .join(""));
        const V = document.getElementById("ftKey");
        (V.innerHTML = `<div class="k-row">${ftList()
          .map((e) => `<span>${ftIco(e.id)}${e.name}</span>`)
          .join(
            "",
          )}</div><div class="k-row"><span>${ftIco("depression")} has it</span><span>${ftIco("depression", "carrier")} carries the genes, hasn't shown yet</span><span><i class="k-line"></i> colored line = passed from parent to child</span><span>Tap a trait above to see only its family line · hover anything for details</span></div>`),
          (U.querySelector(".key").onclick = () => {
            play("choice"), V.classList.toggle("open");
          }),
          (document.getElementById("ftGlobeTraits").onclick = () => {
            play("choice"), openGlobe("traits");
          }),
          U.querySelectorAll("button[data-hl]").forEach(
            (e) =>
              (e.onclick = () => {
                play("choice"),
                  U.querySelectorAll("button[data-hl]").forEach((t) => t.classList.toggle("on", t === e)),
                  e.dataset.hl ? (ftTree.dataset.hl = e.dataset.hl) : delete ftTree.dataset.hl;
              }),
          ),
          ftWrap.classList.add("open"),
          setTimeout(() => {
            ftFit(), ftDraw(), (ftScroll.scrollTop = 0), ftSbTree();
          });
      }
      function ftFit() {
        const e = ftTree.clientWidth - 16;
        ftTree.querySelectorAll(".ft-row").forEach((t) => {
          (t.style.zoom = ""), t.classList.remove("wrap"), (t.style.width = "max-content");
          const a = t.offsetWidth;
          if (((t.style.width = ""), a <= e)) return;
          const o = e / a;
          o >= 0.66 ? (t.style.zoom = o.toFixed(3)) : (t.classList.add("wrap"), (t.style.zoom = ".8"));
        });
      }
      const FT_WEED = (() => {
        let e = 7,
          t = "";
        const a = () => (e = (16807 * e) % 2147483647) / 2147483647;
        for (let e = 0; e < 16; e++) {
          const o = 6.28 * a(),
            n = 9 + 9 * a(),
            s = 5 + 10 * a();
          t += `<ellipse cx="${(20 + 3 * Math.cos(o)).toFixed(1)}" cy="${(20 + 3 * Math.sin(o)).toFixed(1)}" rx="${n.toFixed(1)}" ry="${s.toFixed(1)}" transform="rotate(${(180 * a()).toFixed(0)} 20 20)" stroke="${["#8a6a3a", "#a8844e", "#6f5530", "#b8955c"][e % 4]}"/>`;
        }
        for (let e = 0; e < 9; e++) {
          const e = 6.28 * a(),
            o = 12 + 8 * a();
          t += `<path d="M20 20L${(20 + Math.cos(e) * o).toFixed(1)} ${(20 + Math.sin(e) * o).toFixed(1)}" stroke="#7b5e33"/>`;
        }
        return `<svg viewBox="0 0 40 40" fill="none" stroke-width="1.3" stroke-linecap="round">${t}</svg>`;
      })();
      function ftWar(e, t = []) {
        if ((clearInterval(ftWrap._war), !e.length && !t.length)) return;
        t.forEach((e) => {
          e.nextWeed = performance.now() + 1200 + 2500 * Math.random();
        });
        const a = (e, t, a, o, n = "", s = 2600) => {
            const r = document.createElement("div");
            return (
              (r.className = t),
              (r.style.left = a + "px"),
              (r.style.top = o + "px"),
              (r.innerHTML = n),
              e.append(r),
              setTimeout(() => r.remove(), s),
              r
            );
          },
          o = (e, t, o, n = 1) => {
            const s = Array.from({ length: 7 }, (e, t) => {
              const a = 20 * t - 150 + 14 * Math.random(),
                o = (40 + 45 * Math.random()) * n;
              return `<i class="db" style="--dx:${(Math.cos((a * Math.PI) / 180) * o).toFixed(0)}px;--dy:${(Math.sin((a * Math.PI) / 180) * o).toFixed(0)}px;--rot:${(720 * Math.random() - 360).toFixed(0)}deg;animation-delay:${(0.06 * Math.random()).toFixed(2)}s"></i>`;
            }).join("");
            a(
              e.b,
              "ft-boom",
              t,
              o,
              `<i class="fl"></i><i class="sm s1"></i><i class="fb"></i><i class="f2"></i><i class="f3"></i><i class="sm s2"></i><i class="sm s3"></i><i class="sc"></i>${s}`,
              4500,
            ).style.setProperty("--sz", n),
              e.b.classList.remove("jolt"),
              e.b.offsetWidth,
              e.b.classList.add("jolt");
          },
          n = (e) => ({
            x: (20 + 330 * Math.random()) * e.k,
            y: e.sceneTop + (385 + 80 * Math.random()) * e.k,
          });
        e.forEach((e) => {
          (e.next = performance.now() + 1500), (e.nextBoom = performance.now() + 800);
        }),
          (ftWrap._war = setInterval(() => {
            if (!ftWrap.classList.contains("open") || document.hidden) return;
            const s = ftScroll.getBoundingClientRect(),
              r = performance.now();
            e.forEach((e) => {
              const t = e.b.getBoundingClientRect();
              if (!(t.bottom < s.top || t.top > s.bottom)) {
                if (r > e.next) {
                  e.next = r + 4200 + 3500 * Math.random();
                  const t = 266 * e.k,
                    s = e.sceneTop + 375 * e.k,
                    i = n(e);
                  (i.x = Math.min(i.x, t - 60)),
                    a(
                      e.b,
                      "ft-muzzle",
                      t,
                      s,
                      '<i class="mf"></i><i class="ms"></i><i class="ms m2"></i>',
                      2400,
                    );
                  const l = a(e.b, "ft-shell", t, s, "", 700);
                  requestAnimationFrame(() =>
                    requestAnimationFrame(() => {
                      (l.style.transform = `translate(${(i.x - t).toFixed(0)}px,${(i.y - s).toFixed(0)}px)`),
                        (l.style.opacity = ".2");
                    }),
                  ),
                    setTimeout(() => o(e, i.x, i.y, 1.1), 380);
                }
                if (r > e.nextBoom) {
                  e.nextBoom = r + 1800 + 3800 * Math.random();
                  const t = n(e);
                  o(e, t.x, t.y, 0.6 + 0.7 * Math.random());
                }
              }
            }),
              t.forEach((e) => {
                const t = e.b.getBoundingClientRect();
                if (t.bottom < s.top || t.top > s.bottom || r < e.nextWeed) return;
                e.nextWeed = r + 5e3 + 7e3 * Math.random();
                const o = e.b.offsetWidth,
                  n = Math.random() < 0.75,
                  i = 32 + 20 * Math.random(),
                  l = 6 + 4 * Math.random(),
                  c = e.sceneTop + (430 + 45 * Math.random()) * e.k;
                a(
                  e.b,
                  "ft-weed",
                  n ? -i : o + i,
                  c,
                  `<i class="sh"></i><div class="bn" style="animation-duration:${(0.7 + 0.5 * Math.random()).toFixed(2)}s"><div class="rl" style="--spin:${n ? 360 : -360}deg">${FT_WEED}</div></div>`,
                  1e3 * l + 200,
                ).style.cssText +=
                  `;--s:${i.toFixed(0)}px;--dx:${n ? o + 2 * i : -(o + 2 * i)}px;--d:${l.toFixed(1)}s`;
              });
          }, 250));
      }
      function ftDraw() {
        ftTree.querySelector(".ft-svg")?.remove(), ftTree.querySelector(".ft-bands")?.remove();
        const e = ftTree.scrollWidth,
          t = ftTree.clientWidth || e,
          a = Math.round((509 * t) / 380),
          o = [...ftTree.querySelectorAll(".ft-gen")];
        o.forEach((e) => {
          e.style.paddingBottom = "";
        });
        const n = [];
        o.forEach((e) => {
          const t = n[n.length - 1];
          t && t[0]._era === e._era ? t.push(e) : n.push([e]);
        }),
          n.forEach((e, t) => {
            const o = n[t + 1],
              s = e[0].offsetTop - 10,
              r = o ? o[0].offsetTop - 10 : ftTree.scrollHeight;
            r - s < a && (e[e.length - 1].style.paddingBottom = 12 + a - (r - s) + "px");
          });
        const s = ftTree.getBoundingClientRect(),
          r = ftTree.scrollHeight,
          i = document.createElement("div");
        i.className = "ft-bands";
        const l = [],
          c = [];
        n.forEach((o, d) => {
          const u = o[0],
            h = n[d + 1],
            p = u.offsetTop - 10,
            m = (h ? h[0].offsetTop - 10 : r) - p,
            f = u._era,
            g = o.some((e) => e._famous),
            y = document.createElement("div");
          if (
            ((y.className = "ft-band" + (g ? " fame" : "") + (f.old ? " old" : "")),
            (y.style.cssText = `top:${p}px;height:${m}px;--ec:${f.col};z-index:${n.length - d};background-image:url("${f.art[0]}");--sky:${f.art[2] || f.col}`),
            /ww2/.test(f.art[0]))
          ) {
            y.classList.add("dim", "war");
            const e = t / 381,
              a = m - 509 * e;
            l.push({ b: y, top: p, h: m, k: e, sceneTop: a }),
              y.insertAdjacentHTML(
                "beforeend",
                `<i class="ft-fog" style="top:${Math.round(a + 320 * e)}px;height:${Math.round(150 * e)}px"></i><i class="ft-fog f2" style="top:${Math.round(a + 395 * e)}px;height:${Math.round(120 * e)}px"></i>`,
              );
          }
          if (/western/.test(f.art[0])) {
            const e = t / 378;
            c.push({ b: y, top: p, h: m, k: e, sceneTop: m - 509 * e });
          }
          const b =
              Math.max(
                0,
                ...o.flatMap((e) =>
                  [...e.querySelectorAll(".ft-card")].map((e) => e.getBoundingClientRect().bottom - s.top),
                ),
              ) - p,
            v = Math.round(Math.min(Math.max(b + 90, 80), m - 0.4 * a));
          if (
            (y.insertAdjacentHTML(
              "beforeend",
              `<i class="ft-sunball" style="left:${Math.round(0.78 * t)}px;top:${v}px"></i>`,
            ),
            h)
          ) {
            let t = `M0 0H${e}V6`;
            for (let a = e; a > 0; ) {
              const e = rint(14, 34),
                o = rint(4, 22);
              (a -= e),
                (t += `Q${a + 0.75 * e} 6 ${a + 0.6 * e} ${6 + 0.6 * o}Q${a + e / 2} ${8 + o} ${a + 0.4 * e} ${6 + 0.6 * o}Q${a + 0.25 * e} 6 ${Math.max(0, a)} 6`);
            }
            y.insertAdjacentHTML(
              "beforeend",
              `<svg class="ft-drip" width="${e}" height="34" viewBox="0 0 ${e} 34"><path d="${t}Z" fill="${g ? "#f4d77a" : f.col}"/></svg>`,
            );
            for (let t = 0; t < Math.max(4, Math.round(e / 70)); t++)
              y.insertAdjacentHTML(
                "beforeend",
                `<i class="ft-drop" style="left:${rint(6, e - 6)}px;animation-delay:${(4 * Math.random()).toFixed(2)}s;animation-duration:${(2.6 + 2 * Math.random()).toFixed(2)}s"></i>`,
              );
          }
          i.append(y);
        }),
          ftTree.prepend(i);
        const d = (e) => {
            const t = e.getBoundingClientRect();
            return {
              l: t.left - s.left,
              t: t.top - s.top,
              r: t.right - s.left,
              b: t.bottom - s.top,
              cx: (t.left + t.right) / 2 - s.left,
            };
          },
          u = "http://www.w3.org/2000/svg",
          h = document.createElementNS(u, "svg");
        h.setAttribute("class", "ft-svg"),
          h.setAttribute("width", e),
          h.setAttribute("height", r),
          (h.innerHTML =
            '<defs><linearGradient id="ftGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#e6a417"/></linearGradient>\n      <filter id="ftGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>');
        const p = [...ftTree.querySelectorAll(".ft-card")].map((e) => Object.assign(d(e), { el: e })),
          m = new Map(),
          f = [],
          g = e / 2,
          y = "#2e2620";
        h.querySelector("defs").insertAdjacentHTML(
          "beforeend",
          '<linearGradient id="ftBark" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6b5d4e"/><stop offset=".12" stop-color="#a8957e"/><stop offset=".4" stop-color="#6e6152"/><stop offset=".8" stop-color="#3d342c"/><stop offset="1" stop-color="#2a231d"/></linearGradient>',
        );
        const b = document.createElementNS(u, "g");
        b.setAttribute("opacity", ".55"), b.setAttribute("class", "tree"), h.append(b);
        const v = (e) => b.insertAdjacentHTML("beforeend", e),
          w = (e, t, a, o, n) =>
            (1 - e) ** 3 * t + 3 * (1 - e) ** 2 * e * a + 3 * (1 - e) * e * e * o + e ** 3 * n,
          k = (e, t, a, o, n, s, r = "#5a4f45") => {
            const i = [],
              l = [],
              c = [];
            for (let n = 0; n <= 22; n++) {
              const s = n / 22;
              i.push([w(s, e[0], t[0], a[0], o[0]), w(s, e[1], t[1], a[1], o[1])]);
            }
            return (
              i.forEach(([e, t], a) => {
                const [o, r] = i[Math.min(22, a + 1)],
                  [d, u] = i[Math.max(0, a - 1)];
                let h = -(r - u),
                  p = o - d;
                const m = Math.hypot(h, p) || 1;
                (h /= m), (p /= m);
                const f = n + (a / 22) * (s - n);
                l.push(`${(e + h * f).toFixed(1)} ${(t + p * f).toFixed(1)}`),
                  c.unshift(`${(e - h * f).toFixed(1)} ${(t - p * f).toFixed(1)}`);
              }),
              v(`<path d="M${l.join("L")}L${c.join("L")}Z" fill="${r}"/>`),
              i.map(([e, t], a) => ({ x: e, y: t, w: n + (a / 22) * (s - n) }))
            );
          };
        if (p.length) {
          const e = Math.min(...p.map((e) => e.t)) - 14,
            t = r - 16,
            a = t - e,
            o = (t) => {
              const o = (t - e) / a;
              return Math.min(1, (t - e) / 60) * (7 + 12 * o) + (o > 0.95 ? ((o - 0.95) / 0.05) * 26 : 0);
            },
            n = (e) => 2.4 * Math.sin(e / 61) + 3.2 * Math.sin(e / 149),
            s = [],
            i = [];
          for (let a = e; a <= t; a += 6)
            s.push(`${(g - o(a) + n(a)).toFixed(1)} ${a}`), i.unshift(`${(g + o(a) + n(a)).toFixed(1)} ${a}`);
          v(`<path d="M${s.join("L")}L${i.join("L")}Z" fill="url(#ftBark)"/>`),
            [-0.5, -0.12, 0.3, 0.62].forEach((a, s) => {
              const r = [];
              for (let i = e + 40; i <= t - 30; i += 10)
                r.push(`${(g + o(i) * a + n(i) + 1.2 * Math.sin(i / 37 + s)).toFixed(1)} ${i}`);
              v(
                `<path d="M${r.join("L")}" fill="none" stroke="${y}" stroke-width="1.1" stroke-dasharray="${38 + 9 * s} ${22 + 7 * s}" stroke-linecap="round" opacity=".55"/>`,
              );
            });
          for (let a = e + 260, s = 1; a < t - 80; a += 430, s = -s)
            v(
              `<ellipse cx="${(g + s * o(a) * 0.35 + n(a)).toFixed(1)}" cy="${a}" rx="${(0.32 * o(a)).toFixed(1)}" ry="${(0.55 * o(a)).toFixed(1)}" fill="none" stroke="${y}" stroke-width="1.4" opacity=".6"/>`,
            );
          [
            [-1, 70, 10],
            [-1, 38, 16],
            [1, 42, 14],
            [1, 78, 8],
            [-1, 16, 20],
            [1, 18, 19],
          ].forEach(([e, a, s]) => {
            const r = g + n(t - 26) + e * o(t - 26) * 0.4;
            k(
              [r, t - 26],
              [r + e * a * 0.3, t - 10],
              [r + e * a * 0.75, t - 2],
              [r + e * a, t + 0.3 * s],
              7,
              1.2,
            );
          });
          const c = [];
          [...p]
            .sort((e, t) => e.b - t.b)
            .forEach((e) => {
              const t = c.find((t) => Math.abs(t.b - e.b) < 30);
              t ? t.cs.push(e) : c.push({ b: e.b, cs: [e] });
            }),
            c.forEach((e, a) =>
              [-1, 1].forEach((s) => {
                const r = e.cs.filter((e) => s * (e.cx - g) > 6).sort((e, t) => s * (e.cx - t.cx));
                if (!r.length) return;
                const i = r[r.length - 1],
                  l = i.cx - g,
                  c = Math.min(t - 50, e.b + 36 + 0.12 * Math.abs(l) + (s > 0 ? 18 : 0) + (a % 2) * 8),
                  d = g + n(c) + s * o(c) * 0.55,
                  u = k(
                    [d, c],
                    [d + 0.38 * l, c + 6],
                    [i.cx - 0.05 * l, i.b + 0.6 * (c - i.b)],
                    [i.cx, i.b - 8],
                    Math.max(5, 0.62 * o(c)),
                    2.6,
                  );
                f.push(u);
                let h = 0;
                r.slice(0, -1).forEach((e) => {
                  const t = u.reduce((t, a) => (Math.abs(a.x - e.cx) < Math.abs(t.x - e.cx) ? a : t), u[0]),
                    a = k(
                      [t.x, t.y],
                      [t.x + 0.3 * (e.cx - t.x), t.y - 12],
                      [e.cx, e.b + 0.45 * (t.y - e.b)],
                      [e.cx, e.b - 8],
                      Math.max(2.6, 0.8 * t.w),
                      2.2,
                    );
                  (h = Math.max(h, u.indexOf(t))),
                    m.set(e.el, {
                      pts: [{ x: g + n(c), y: c }, ...u.slice(0, u.indexOf(t) + 1), ...a],
                      ty: c,
                      own: a,
                    }),
                    f.push(a);
                }),
                  m.set(i.el, { pts: [{ x: g + n(c), y: c }, ...u], ty: c, own: u.slice(h) }),
                  [0.38, 0.72].forEach((e, t) => {
                    const o = u[Math.round(e * (u.length - 1))];
                    if ((a + t) % 2) return;
                    const n = -(14 + 6 * t);
                    f.push(
                      k(
                        [o.x, o.y],
                        [o.x + 6 * s, o.y + 0.5 * n],
                        [o.x + 10 * s, o.y + 0.9 * n],
                        [o.x + 13 * s, o.y + n],
                        Math.max(1.6, 0.45 * o.w),
                        0.6,
                      ),
                    );
                  });
              }),
            ),
            c.forEach((e) =>
              e.cs
                .filter((e) => Math.abs(e.cx - g) <= 6)
                .forEach((e) => {
                  const t = k(
                    [g + n(e.b + 30), e.b + 30],
                    [g, e.b + 15],
                    [e.cx, e.b + 4],
                    [e.cx, e.b - 8],
                    0.7 * o(e.b + 30),
                    3,
                  );
                  m.set(e.el, { pts: t, ty: e.b + 30, own: t });
                }),
            );
          let d =
            ((7919 * p.length + 31 * (state.birthYear || 0) + 104729 * SURNAME.length) % 2147483646) + 1;
          const b = () => (d = (16807 * d) % 2147483647) / 2147483647,
            w = document.createElementNS(u, "g");
          w.setAttribute("class", "leaves"), h.append(w);
          let $ = "";
          const S = (e, t, a, o) => {
            const n = ((Math.floor(t / 420) % 6) + 6) % 6;
            $ += `<g transform="translate(${e.toFixed(1)} ${t.toFixed(1)}) rotate(${a.toFixed(0)}) scale(${o.toFixed(2)})" data-w="${Math.floor(t / 260)}"><path class="lf s${n}" d="M0 0C3 -5.5 9.5 -5.5 14 0C9.5 5.5 3 5.5 0 0Z"/><path class="lv" d="M1 0H12"/></g>`;
          };
          if (
            (f.forEach((e) => {
              for (let t = Math.round(0.35 * e.length); t < e.length; t += 4 + Math.round(2 * b())) {
                const a = e[t],
                  o = e[Math.min(e.length - 1, t + 1)],
                  n = e[Math.max(0, t - 1)],
                  s = (180 * Math.atan2(o.y - n.y, o.x - n.x)) / Math.PI;
                [-1, 1].forEach((e) => {
                  if (b() < 0.4) return;
                  const t = ((s + 90 * e) * Math.PI) / 180;
                  S(
                    a.x + Math.cos(t) * a.w * 0.6,
                    a.y + Math.sin(t) * a.w * 0.6,
                    s + e * (40 + 45 * b()),
                    0.8 + 0.55 * b(),
                  );
                });
              }
              const t = e[e.length - 1];
              for (let e = 0; e < 3; e++) S(t.x, t.y + 4, 45 * (e - 1) - 90 + 12 * b(), 0.85 + 0.45 * b());
            }),
            (w.innerHTML = $),
            l.length)
          ) {
            const e = document.createElementNS(u, "g");
            e.setAttribute("class", "holes"), h.insertBefore(e, w);
            let t = "";
            const a = (e, a, o) => {
              const n = 360 * b();
              t += `<g transform="translate(${e.toFixed(1)} ${a.toFixed(1)}) rotate(${n.toFixed(0)})"><ellipse rx="${(1.7 * o).toFixed(1)}" ry="${(1.4 * o).toFixed(1)}" fill="#c9b08a" opacity=".55"/><path d="M${2.4 * -o} 0L${1.2 * -o} .4M${1.1 * o} ${0.9 * -o}L${2.2 * o} ${1.9 * -o}M${0.3 * o} ${1.2 * o}L${0.8 * o} ${2.5 * o}" stroke="#d8c29c" stroke-width=".9" opacity=".8"/><circle r="${o.toFixed(1)}" fill="#160f0a"/><circle r="${(0.45 * o).toFixed(1)}" cx="${(0.25 * -o).toFixed(1)}" cy="${(0.25 * -o).toFixed(1)}" fill="#000"/></g>`;
            };
            l.forEach(({ top: e, h: t }) => {
              const s = e + 30,
                r = e + t - 30;
              for (let e = s + 30 * b(); e < r; e += 22 + 40 * b())
                a(g + n(e) + (b() - 0.5) * o(e) * 1.3, e, 1.8 + 1.6 * b());
              f.forEach((e) =>
                e.forEach((e, t) => {
                  e.y > s &&
                    e.y < r &&
                    e.w > 2.6 &&
                    t % 5 == 2 &&
                    b() < 0.5 &&
                    a(e.x + (b() - 0.5) * e.w, e.y + (b() - 0.5) * e.w * 0.8, 1.3 + 0.9 * b());
                }),
              );
            }),
              (e.innerHTML = t);
          }
          clearInterval(ftWrap._seasons);
          const x = document.createElementNS(u, "g");
          x.setAttribute("class", "gold-limbs"), h.insertBefore(x, w);
          let C = "";
          p.forEach((e) => {
            const t = m.get(e.el);
            if (!t || !t.own || t.own.length < 2 || !e.el.classList.contains("famous")) return;
            const a = t.own,
              o = [],
              n = [];
            a.forEach((e, t) => {
              const s = a[Math.min(a.length - 1, t + 1)],
                r = a[Math.max(0, t - 1)];
              let i = -(s.y - r.y),
                l = s.x - r.x;
              const c = Math.hypot(i, l) || 1;
              (i /= c),
                (l /= c),
                o.push(`${(e.x + i * e.w).toFixed(1)} ${(e.y + l * e.w).toFixed(1)}`),
                n.unshift(`${(e.x - i * e.w).toFixed(1)} ${(e.y - l * e.w).toFixed(1)}`);
            }),
              (C += `<path d="M${o.join("L")}L${n.join("L")}Z" fill="url(#ftGold)" stroke="#c99a1c" stroke-width="1" filter="url(#ftGlow)"/><path d="M${a.map((e) => `${e.x.toFixed(1)} ${e.y.toFixed(1)}`).join("L")}" fill="none" stroke="#fff6c8" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>`);
          }),
            (x.innerHTML = C),
            FT_CONDS.forEach(({ id: e, col: t }) => {
              const a = p
                .map((t) => {
                  const a = t.el._n,
                    o = a && ftConds(a.src).find((t) => t.id === e),
                    n = m.get(t.el);
                  return o && n ? { r: n, carrier: !ftActive(a, o), n: a } : null;
                })
                .filter(Boolean);
              if (!a.length) return;
              const o = `style="filter:drop-shadow(0 0 3px ${t}) drop-shadow(0 0 6px ${t})"`,
                s = a.map((e) => e.r.ty),
                r = Math.min(...s),
                i = Math.max(...s);
              if (i - r > 2) {
                const a = [];
                for (let e = r; e <= i; e += 6) a.push(`${(g + n(e)).toFixed(1)} ${e.toFixed(1)}`);
                a.push(`${(g + n(i)).toFixed(1)} ${i.toFixed(1)}`),
                  h.insertAdjacentHTML(
                    "beforeend",
                    `<path class="tl tl-${e}" d="M${a.join("L")}" fill="none" stroke="${t}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" ${o}/>`,
                  );
              }
              a.forEach(({ r: a, carrier: n, n: s }) =>
                h.insertAdjacentHTML(
                  "beforeend",
                  `<path class="tl tl-${e}" d="M${a.pts.map((e) => `${e.x.toFixed(1)} ${e.y.toFixed(1)}`).join("L")}" fill="none" stroke="${t}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"${n ? ' stroke-dasharray="7 6"' : ""} ${o}><title>${FT_COND[e].name}${n ? " (carrier)" : ""}: ${s.first} ${s.last}</title></path>`,
                ),
              );
            });
        }
        const $ = (e) => (e._fi ||= "p" + Math.random().toString(36).slice(2, 8)),
          S = (e, t, a, o = []) => {
            const n = a ? ' stroke-dasharray="2 10"' : "",
              s = ` data-who=" ${o.map($).join(" ")} "`;
            h.insertAdjacentHTML(
              "beforeend",
              `<path class="gl"${s} d="${e}" fill="none" stroke="${t ? "rgba(60,35,0,.45)" : "rgba(0,10,30,.32)"}" stroke-width="${t ? 5.5 : 4}" stroke-linecap="round" stroke-linejoin="round"${n}/><path class="gl core"${s} d="${e}" fill="none" stroke="${t ? "url(#ftGold)" : "rgba(236,244,255,.85)"}" stroke-width="${t ? 2.8 : 1.8}" stroke-linecap="round" stroke-linejoin="round"${t ? ' filter="url(#ftGlow)"' : ""}${n}/>` +
                (t && !a
                  ? `<path class="gl flow"${s} d="${e}" fill="none" stroke="#fffbe6" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="2 22"/>`
                  : ""),
            );
          },
          x = {},
          C = [];
        ftTree.querySelectorAll(".ft-inh").forEach((e) => e.remove()),
          ftWrap._links.forEach(([t, a, o, n]) => {
            if (((t = t.filter((e) => e && e.el)), (a = a.filter((e) => e && e.el)), !t.length || !a.length))
              return;
            const s = t.map((e) => d(e.el)),
              r = a.map((e) => d(e.el)),
              i = s.reduce((e, t) => e + t.cx, 0) / s.length;
            2 === s.length && S(`M${s[0].r} ${s[0].t + 38}H${s[1].l}`, o, !1, t);
            const l = 2 === s.length ? s[0].t + 38 : Math.max(...s.map((e) => e.b)),
              c = Math.min(...r.map((e) => e.t)),
              u = c - 12 - (((x[c] = (x[c] || 0) + 1) - 1) % 3) * 6,
              p = r.map((e) => e.cx),
              m =
                (Math.min(i, ...p),
                Math.max(i, ...p),
                (e, t, a, o) => {
                  if (Math.abs(a - e) < 2) return `M${e} ${t}V${o}`;
                  const n = Math.sign(a - e),
                    s = Math.max(0, Math.min(12, Math.abs(a - e) / 2, u - t, o - u));
                  return `M${e} ${t}V${u - s}Q${e} ${u} ${e + n * s} ${u}H${a - n * s}Q${a} ${u} ${a} ${u + s}V${o}`;
                }),
              f = r.map((e) => m(i, l, e.cx, e.t)).join("");
            S(f, o, !!n, [...t, ...a]);
            const g = t.map((e) => e.src),
              y = a.map((e) => ftConds(e.src).filter((e) => e.par.some((e) => g.includes(e)))),
              b = [...new Set(y.flat().map((e) => e.id))],
              v = (e, t) =>
                t.forEach((t, a) =>
                  h.insertAdjacentHTML(
                    "beforeend",
                    `<path class="ln ln-${t}" d="${e}" fill="none" stroke="${FT_COND[t].col}" stroke-width="${a ? 3.6 : 4.2}" stroke-linecap="round"${a ? ` stroke-dasharray="7 7" stroke-dashoffset="${7 * a}"` : ""} style="filter:drop-shadow(0 0 3px ${FT_COND[t].col})"${n ? ' opacity=".7"' : ""}/>` +
                      (a
                        ? ""
                        : `<path class="ln ln-${t} lnflow" d="${e}" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="2 14"/>`),
                  ),
                );
            if (b.length && !n) {
              const o = l + 0.5 * (u - l),
                n = b.slice(0, 2);
              ((e) =>
                n.forEach((t, a) =>
                  h.insertAdjacentHTML(
                    "beforeend",
                    `<path class="inh" d="${e}" fill="none" stroke="${FT_COND[t].col}" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"${a ? ' stroke-dasharray="8 8" stroke-dashoffset="8"' : ""} style="filter:drop-shadow(0 0 3px ${FT_COND[t].col})"/>`,
                  ),
                ))(
                r
                  .filter((e, t) => y[t].length)
                  .map((e) => m(i, o, e.cx, e.t))
                  .join(""),
              );
              const s = C.length,
                c = ` data-who=" ${[...t, ...a.filter((e, t) => y[t].length)].map($).join(" ")} "`;
              h.insertAdjacentHTML(
                "beforeend",
                `<circle class="inh dot" data-inh="${s}" cx="${i}" cy="${o}" r="6.5" fill="#fff" stroke="${FT_COND[n[0]].col}" stroke-width="3"/>`,
              );
              const d = b.map((e) => FT_COND[e].name);
              C.push(
                `<div class="ft-inh${i > 0.55 * e ? " l" : ""}" data-inh="${s}"${c} style="left:${i}px;top:${o}px;--cc:${FT_COND[n[0]].col}"><span class="ar">⬇</span>${b
                  .slice(0, 3)
                  .map((e) => ftIco(e))
                  .join(
                    "",
                  )}<b>${d.slice(0, 2).join(" · ")}${d.length > 2 ? " +" + (d.length - 2) : ""}</b></div>`,
              );
            }
            b.length &&
              v(
                r
                  .filter((e, t) => y[t].length)
                  .map((e) => m(i, l, e.cx, e.t))
                  .join(""),
                b.slice(0, 2),
              ),
              r.forEach((e, t) => {
                if (!y[t].length) return;
                const a = Math.abs(e.cx - i) < 2 ? 0 : Math.min(12, e.t - u);
                v(`M${e.cx} ${u + a}V${e.t}`, [...new Set(y[t].map((e) => e.id))].slice(0, 2));
              });
            const w = t.map((e) => e.first).join(" & ");
            r.forEach((e, t) => {
              if (!y[t].length) return;
              const o = y[t]
                .map(
                  (e) =>
                    `<div class="ft-tr">${ftDotHTML(e.id)}<div><b>${FT_COND[e.id].name}</b><small>passed down from ${
                      e.par
                        .filter((e) => g.includes(e))
                        .map((e) => e.first)
                        .join(" & ") || w
                    } to ${a[t].first}</small></div></div>`,
                )
                .join("");
              h.insertAdjacentHTML(
                "beforeend",
                `<path class="hit" d="M${i} ${l}V${u}H${e.cx}V${e.t}" fill="none" stroke="transparent" stroke-width="14" data-tip="${o.replace(/"/g, "&quot;")}"/>`,
              );
            }),
              n &&
                h.insertAdjacentHTML(
                  "beforeend",
                  `<g transform="translate(${Math.min(Math.max(i + 12, 12), e - 180)} ${(l + u) / 2 - 6})"><text y="4.5" font-size="12" font-weight="900" font-style="italic" fill="#fff" stroke="rgba(0,0,0,.85)" stroke-width="3" paint-order="stroke" font-family="Nunito,Arial,sans-serif">${n}</text></g>`,
                );
          });
        const I = ftWrap._partner;
        if (I && I[0].el && I[1].el) {
          const e = d(I[0].el),
            t = d(I[1].el);
          S(`M${e.r} ${e.t + 40}H${t.l}`, !1, !1, I),
            h.insertAdjacentHTML(
              "beforeend",
              `<text x="${(e.r + t.l) / 2}" y="${e.t + 45}" font-size="13" text-anchor="middle">❤️</text>`,
            );
        }
        ftTree.prepend(h),
          ftTree.insertAdjacentHTML("beforeend", C.join("")),
          h.querySelectorAll(".dot").forEach((e) =>
            e.addEventListener("click", (t) => {
              t.stopPropagation();
              const a = ftTree.querySelector(`.ft-inh[data-inh="${e.dataset.inh}"]`),
                o = a.classList.contains("pin");
              ftTree.querySelectorAll(".ft-inh.pin").forEach((e) => e.classList.remove("pin")),
                o || (a.classList.add("pin"), play("choice"));
            }),
          ),
          ftWar(l, c);
      }
      function ftFacts(e) {
        const t = ftInfo(e),
          a = ftPron(e),
          o = e.famous,
          n = e.src.mil,
          s = `<img src="flags/${e.country}.png" alt="">`,
          r = `${t.city}, ${ftCountryName(e.country)}`,
          i = e.src.spouseOf ? `${e.src.spouseOf.first} ${e.src.spouseOf.last}` : null,
          l = e.cave,
          c = [
            ["Relation", e.title + (e.side ? ` (${e.side.toLowerCase()} side)` : "")],
            e.royal
              ? ["Royal title", e.royal.title + (e.royal.founder ? " · founder of the dynasty" : "")]
              : null,
            e.royal ? ["Fortune", ftWorth(e)] : null,
            ["Born", l ? `c. ${ftY(e.born)}` : `${t.month} ${t.day}, ${e.born}`],
            ["Birthplace", l ? t.city[0].toUpperCase() + t.city.slice(1) : s + r],
            e.dead
              ? ["Died", `${l ? "c. " + ftY(e.died) : e.died} at age ${e.age}`]
              : ["Age", `${e.age} years old`],
            e.dead ? ["Cause of death", t.cause[0].toUpperCase() + t.cause.slice(1)] : null,
            ["Occupation", t.job],
            o ? ["Known for", `${o.t} (${o.year})`] : null,
            e.src.maiden && "f" === e.g ? ["Maiden name", e.src.maiden] : null,
            i ? ["Spouse", i] : null,
            ["Children", t.kids],
            ["Height", t.height],
            e.src.movedTo
              ? ["Emigrated", `${ftCountryName(e.country)} → ${ftCountryName(e.src.movedTo)}`]
              : null,
            n
              ? [
                  "Military",
                  `${n.rank}, ${n.branch} · ${n.active ? `Active duty (${n.y}–present)` : `${n.war ? ftCap(n.war.replace(/^the /, "")) : "Peacetime"} (${n.y}${n.years > 1 ? "–" + (n.y + n.years - 1) : ""})`}`,
                ]
              : null,
            n && n.hero ? ["Honors", `War hero, awarded ${n.hero}`] : null,
            n && n.scar
              ? ["Battle scar", n.war ? `From ${n.war.replace(/^the /, "")}` : "From a training accident"]
              : null,
          ].filter(Boolean),
          d = l && state.ft.cave,
          u = l
            ? `${e.first} of the ${d.clan} was born around ${ftY(e.born)} in ${t.city}, during the last Ice Age, when woolly mammoths and cave lions still roamed. ` +
              (e.age < 14
                ? `Like many children of the Stone Age, ${a.he} never grew up: ${a.he} died of ${t.cause} at just ${0 === e.age ? "a few months" : e.age}${1 === e.age ? " year" : e.age ? " years" : ""} old.`
                : `${a.He} spent ${a.his} life as ${ftAn(t.job.toLowerCase())} and was remembered as ${t.traits[0].toLowerCase()} and ${t.traits[1].toLowerCase()}. ${a.He} died of ${t.cause} at ${e.age}.`) +
              (e.src.heir
                ? ` ${a.He} survived the Ice Age to have children of ${a.his} own, and every ${SURNAME} alive today descends from ${a.him}.`
                : "")
            : e.you
              ? "This is you! " +
                (state.age < 18
                  ? "Your story is just getting started."
                  : "The latest chapter of the " + SURNAME + " story is still being written.")
              : e.src.past
                ? ftPastBio(e, a, t)
                : `${e.first} was born in ${t.city} in ${e.born}. ${e.age >= 18 ? `${a.He} worked as ${ftAn(t.job.replace("Retired ", "").toLowerCase())}${i ? ` and married ${i}` : ""}${t.kids ? `, raising ${t.kids} ${1 === t.kids ? "child" : "children"}` : ""}. ` : ""}The family remembers ${a.him} as ${t.traits[0].toLowerCase()} and ${t.traits[1].toLowerCase()}. ` +
                  (e.dead
                    ? `${a.He} passed away in ${e.died} from ${t.cause}, aged ${e.age}.`
                    : e.src.movedTo
                      ? ""
                      : `${a.He} is still alive today at ${e.age}.`) +
                  (e.src.movedTo
                    ? ` ${a.He} left ${ftCountryName(e.country)} for a new life in ${ftCountryName(e.src.movedTo)}.`
                    : ""),
          h = e.src.pack,
          p = (t) => ftPackText(e.src, t),
          m = (h ? [p(h[16]), p(h[17]), p(h[18]), p(h[19]), p(h[15])].join(" ") : u) + ftMilLine(e, a);
        return (
          h &&
            c.splice(
              c.findIndex((e) => "Occupation" === e[0]) + 1,
              0,
              ...(o ? [] : [["Known for", `${ftCap(h[11])} (${h[10]})`]]),
              ["Fame", FT_FAME_LVL[h[9]]],
            ),
          { I: t, P: a, F: o, C: l, rows: c, bio: m, spouse: i }
        );
      }
      function ftPastBio(e, t, a) {
        const o = e.src.past,
          n =
            "Retired" === o.job
              ? ` ${t.He} retired after a long career.`
              : o.job && !/^(Student|Unemployed)$/.test(o.job)
                ? ` ${t.He} worked as ${ftAn(o.job.replace(/^Retired /, "").toLowerCase())}.`
                : "";
        return (
          `${e.first} was born in ${o.city || a.city} in ${o.born}.${n}` +
          (o.spouse ? ` ${t.He} married ${o.spouse}.` : "") +
          (o.kids ? ` ${t.He} raised ${o.kids} ${1 === o.kids ? "child" : "children"}.` : "") +
          (o.story && o.story.length
            ? " " +
              o.story
                .map((a, o) =>
                  ((e) => (/[.!?]$/.test(e) ? e : e + "."))(
                    2 === o
                      ? a
                      : a.replace(
                          new RegExp("^" + e.first.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b"),
                          t.He,
                        ),
                  ),
                )
                .join(" ")
            : "") +
          (o.famous ? ` ${t.He} was famous in ${t.his} day.` : "") +
          (o.record ? ` ${t.He} had ${o.record} run-in${o.record > 1 ? "s" : ""} with the law.` : "") +
          (e.dead
            ? ` ${t.He} passed away in ${e.died} from ${o.cause || a.cause}, aged ${e.age}${o.worth > 0 ? `, leaving behind ${usd(o.worth)}` : ""}.`
            : ` ${t.He} is still alive today at ${e.age}.`)
        );
      }
      function ftDetail(e) {
        const { I: t, P: a, F: o, C: n, rows: s, bio: r, spouse: i } = ftFacts(e),
          l = o
            ? `<div class="ft-fame"><div class="bar-tag">★ Famous Ancestor</div><h4><img src="emoji/${o.ico}.png" alt="">${o.t}</h4><div class="hl">${o.hl}</div>\n      <div class="fbar">Fame<div><u style="width:${20 * o.stars}%">${20 * o.stars}%</u></div></div>${o.story.map((e) => `<p>${e}</p>`).join("")}\n      <ul>${o.feats.map((e) => `<li>${e}</li>`).join("")}</ul><div class="lg">${o.legacy}</div></div>`
            : "",
          c = ftConds(e.src),
          d = ftYears(e.src)[1],
          u = n
            ? "The clan's shaman believed it was the work of spirits."
            : d < 1900
              ? 'Back then people called it "%s", and there was no real treatment.'
              : d < 1960
                ? 'Doctors of the time called it "%s" and had little to offer.'
                : "It was diagnosed, and treatment helped.",
          h = !n && ftYears(e.src)[1] >= 1960,
          p =
            '<div class="ft-h">Hereditary Traits &amp; Health</div>' +
            (c.length
              ? c
                  .map((t) => {
                    const o = FT_COND[t.id],
                      n = ftActive(e, t),
                      s = ftForm(e.src, t);
                    t.li ??= rint(0, o.life.length - 1);
                    const r = t.par.map((e) => (e === state ? "you" : e.first)).join(" &amp; "),
                      i = t.par.length
                        ? t.general
                          ? `Inherited a general addiction risk from ${r}`
                          : `Inherited from ${r}`
                        : "No known family history: it started with them";
                    if ("gene" === o.grp) return ftGeneCond(e, t, o, a, i, d);
                    const l =
                      n && h && o.treat.length
                        ? `<div class="ft-treat">${o.treat.map((e) => `<span>${ftSpr(FT_TREAT[e][1], 22)}${FT_TREAT[e][0]}</span>`).join("")}</div>`
                        : "";
                    return (
                      `<div class="ft-cond" style="--cc:${o.col}"><div class="h">${ftTraitPic(e, t, 34)}<div class="hn">${o.name}${n ? "" : " <em>carrier</em>"}` +
                      (s ? `<small>Hooked on ${s[0]}</small>` : "") +
                      `</div><span class="ft-herit">~${o.h}% genetic</span></div>` +
                      `<p>${o.desc}</p><p class="m"><img src="emoji/1f9ec.png" alt="" style="width:14px;height:14px;vertical-align:-2px;margin-right:3px">${i}</p>` +
                      (n
                        ? `<p>${e.you ? "You" : a.He} ${o.life[t.li]}. ${u.replace("%s", o.old)}</p>` + l
                        : `<p>${e.you ? "You carry" : `${a.He} carries`} the genes for it, but it usually shows up around age ${o.onset}${e.dead ? ` and ${a.he} died before then` : ". It may never show up at all"}.</p>`) +
                      "</div>"
                    );
                  })
                  .join("")
              : `<div class="ft-bio ft-none">${ftSpr("happy", 30)}<span>No hereditary conditions. ${e.you ? "You" : a.He} got lucky in the family lottery!</span></div>`) +
            `<button class="ft-tlink" id="ftAllTraits">See every inheritable trait &amp; ${e.you ? "your" : a.his} genetic risk ›</button>`;
        (ftDlg.className = "ft-dlg" + (o ? " famous" : "")),
          (ftDlg.innerHTML = `<div class="ft-top ${e.g}${e.dead ? " dead" : ""}${o ? " famous" : ""}"><div class="ft-x" id="ftX"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg></div>\n      <div id="ftFace"></div><h3 class="ft-name" id="ftName" title="See all inheritable traits">${e.first} ${e.last}<span class="chev">›</span></h3><div class="r">${e.title}</div>\n      <div class="yrs">${n ? `c. ${(-e.born).toLocaleString("en-US")} – ${ftY(e.died)}` : e.dead ? `${e.born} – ${e.died}` : `${e.born} – Present`}</div></div>\n      <div class="ft-body">${l}<table><tbody>${s.map(([e, t]) => `<tr><td>${e}</td><td>${t}</td></tr>`).join("")}</tbody></table>\n      ${p}\n      ${e.you ? "" : `<div class="ft-h">Personality</div><div class="ft-chips">${t.traits.map((e) => `<span>${e}</span>`).join("")}</div>`}\n      <div class="ft-h">Life Story</div><div class="ft-bio">${r}</div>\n      ${e.you ? "" : `<div class="ft-h">Fun Fact</div><div class="ft-bio">${t.fact}</div>`}\n      ${null == e.rel || e.dead || e.you ? "" : `<div class="ft-h">Relationship</div><div class="ft-bar"><u style="width:${Math.max(2, e.rel)}%"></u></div>`}</div>`),
          document
            .getElementById("ftFace")
            .append(
              n
                ? ftCaveFace(e)
                : npcFace(
                    e.look || randomLook(e.g, e.age),
                    e.g,
                    Math.max(0, e.age),
                    e.dead ? "sad" : "happy",
                  ),
            ),
          (document.getElementById("ftX").onclick = () => ftPop.classList.remove("open")),
          (document.getElementById("ftName").onclick = document.getElementById("ftAllTraits").onclick =
            () => {
              play("choice"), ftTraitsView(e);
            }),
          (ftDlg.scrollTop = 0),
          ftPop.classList.add("open");
      }
      window.addEventListener("resize", () => {
        ftWrap.classList.contains("open") && (ftFit(), ftDraw());
      });
      const ftGeneHow = (e, t, a) =>
        e.cave
          ? "The clan saw it as a sign from the spirits."
          : a < 1900
            ? `Back then people called it "${t.old}", and nobody knew it came from genes.`
            : a < 1990
              ? `Doctors of the time called it "${t.old}" and couldn't explain it.`
              : "A DNA test confirmed it.";
      function ftGeneCond(e, t, a, o, n, s) {
        return (
          (t.li ??= rint(0, a.life.length - 1)),
          `<div class="ft-cond" style="--cc:${a.col}"><div class="h">${ftTraitPic(e, t, 34)}<div class="hn">${a.name}<small>Born with it</small></div><span class="ft-herit">~${a.h}% genetic</span></div><p>${a.desc}</p><p class="m"><img src="emoji/1f9ec.png" alt="" style="width:14px;height:14px;vertical-align:-2px;margin-right:3px">${n}</p><p>${e.you ? "You" : o.He} ${a.life[t.li]}. ${ftGeneHow(e, a, s)}</p></div>`
        );
      }
      function ftTraitPic(e, t, a) {
        const o = FT_COND[t.id],
          n = ftForm(e.src, t),
          s = n ? n[1] : o.spr;
        if (o.img) return ftGenePic(o, a);
        const r = FT_ERA_PIC[s];
        return r
          ? `<span class="ft-spr" style="width:${a}px;height:${a}px;${r.endsWith(".png") ? `background:url(${r}) center/82% no-repeat">` : `">${r}`}</span>`
          : s
            ? ftSpr(s, a, o.gray ? "gray" : "")
            : ftIco(t.id, "lg");
      }
      const FT_ERA_PIC = {
        pipe: '<svg viewBox="0 0 32 32" width="100%" height="100%"><path d="M21 9.5c-1.5-1.5 1.5-2.5 0-4.5M24.2 10c-1.2-1.3 1.2-2.2 0-3.8" fill="none" stroke="#b0b6bd" stroke-width="1.4" stroke-linecap="round"/><path d="M2.6 13.4l15.6 4.3-.8 2.7L1.8 16z" fill="#2b1d14"/><path d="M16.5 12h11v6.5a5.5 5.5 0 0 1-11 0z" fill="#8a5a2b" stroke="#5a3a1c" stroke-width="1.2"/><ellipse cx="22" cy="12" rx="5.5" ry="1.6" fill="#3a2414"/><ellipse cx="22" cy="11.9" rx="3.6" ry=".9" fill="#e8662a"/></svg>',
        cigar:
          '<svg viewBox="0 0 32 32" width="100%" height="100%"><path d="M27 12.5c-1.3-1.4 1.3-2.4 0-4.2" fill="none" stroke="#b0b6bd" stroke-width="1.4" stroke-linecap="round"/><rect x="2.5" y="14" width="22.5" height="6" rx="3" fill="#7a4a24" stroke="#4e2e14" stroke-width="1"/><rect x="7.5" y="14" width="3.2" height="6" fill="#c62828"/><rect x="7.5" y="16.3" width="3.2" height="1.4" fill="#f4c044"/><rect x="24.5" y="14.4" width="4.5" height="5.2" rx="1.6" fill="#9e9e9e"/><rect x="24" y="14.4" width="1.5" height="5.2" fill="#e8662a"/></svg>',
        syringe: "emoji/1f489.png",
      };
      function ftTraitsView(e) {
        const t = e.src,
          a = t.risk || {},
          o = ftConds(t),
          n = ftPron(e),
          [s] = ftYears(t),
          r = ftList().filter((e) => ftAllowed(t, e)),
          i = ftList().filter((e) => !ftAllowed(t, e)),
          l = (s) => {
            const r = o.find((e) => e.id === s.id),
              i = r && ftActive(e, r),
              l = ftForm(t, s),
              c = Math.round(100 * Math.min(0.95, a[s.id] ?? s.base)),
              d = r ? (i ? "Has it" : "Carrier") : "Not affected";
            return `<div class="ft-trow${r ? " got" : ""}" style="--cc:${s.col}">${ftTraitPic(e, r || { id: s.id }, 38)}<div class="t"><b>${s.name}</b><small>${l ? `In ${n.his} time: ${l[0]}` : s.desc}</small><div class="rbar"><u style="width:${Math.max(3, c)}%"></u></div><small class="rl">${e.you ? "Your" : n.His} genetic risk: <b>${c}%</b> · ~${s.h}% heritable</small></div><span class="st">${d}</span></div>`;
          },
          c = (e, t) => (t.length ? `<div class="ft-h">${e}</div>${t.map(l).join("")}` : "");
        (ftDlg.querySelector(".ft-body").innerHTML =
          `<button class="ft-back" id="ftBackProfile">‹ Back to profile</button><div class="ft-tv-head"><b>${e.you ? "Your" : `${e.first}'s`} inheritable traits</b><span>Only traits that run in families and existed during ${e.you ? "your" : n.his} lifetime${e.cave ? " (the Ice Age)" : ` (born ${s})`}.</span></div>` +
          c(
            "Birth Traits",
            r.filter((e) => "gene" === e.grp),
          ) +
          c(
            "Mental Health",
            r.filter((e) => "mind" === e.grp),
          ) +
          c(
            "Addictions",
            r.filter((e) => "add" === e.grp),
          ) +
          (i.length
            ? `<div class="ft-later"><b>Didn't exist yet in ${e.you ? "your" : n.his} time:</b> ${i.map((e) => e.name).join(", ")}</div>`
            : "") +
          '<div class="ft-later"><b>Heritability</b> = how much of the difference between people comes from genes, from twin and family studies. ' +
          `<b>Genetic risk</b> = ${e.you ? "your" : n.his} odds based on which parents had it.</div>`),
          (document.getElementById("ftBackProfile").onclick = () => {
            play("choice"), ftDetail(e);
          }),
          (ftDlg.scrollTop = 0);
      }
      function ftCtx() {
        const e = state.family.filter((e) => relAge(e) >= 0 || e.dead),
          t = e.filter((e) => "auntuncle" === e.kind);
        t.forEach((e, t) => (e.ftSide ??= t % 2 ? "M" : "P"));
        const a = e.filter((e) => "sibling" === e.kind).sort((e, t) => t.ageOffset - e.ageOffset),
          o = e.filter((e) => "cousin" === e.kind),
          n = e.filter((e) => "nibling" === e.kind),
          s = e.filter((e) => "cousinkid" === e.kind);
        o.forEach((e) => {
          void 0 === e.ftPar && (e.ftPar = t.find((t) => t.last === e.last) || (t.length ? any(t) : null));
        });
        const r = a.filter((e) => "f" === e.g && e.ageOffset > 0);
        n.forEach((e) => {
          void 0 === e.ftPar && (e.ftPar = r.length ? any(r) : a.length ? any(a) : null);
        }),
          s.forEach((e) => {
            void 0 === e.ftPar && (e.ftPar = o.find((t) => t.last === e.last) || (o.length ? any(o) : null));
          });
        const i =
          (state.spouse && !state.spouse.dead && state.spouse.look ? state.spouse : null) ||
          state.lovers.find((e) => e.main && !e.dead);
        return {
          dad: state.parents.find((e) => "Father" === e.role),
          mom: state.parents.find((e) => "Mother" === e.role),
          aus: t,
          sibs: a,
          partner: i,
          cousins: o,
          nibs: n,
          ckids: s,
        };
      }
      function ftLateAncestors() {
        const e = ftSetup();
        ftInheritAll(e, ftCtx());
        const t = e.cave,
          a = [];
        return (
          e.gp.forEach((e, t) => {
            e.anc &&
              a.push([e, "m" === e.g ? "Grandfather" : "Grandmother", t < 2 ? "Paternal" : "Maternal"]);
          }),
          [
            [e.p, "Paternal"],
            [e.m, "Maternal"],
          ].forEach(([e, t]) =>
            e.forEach((e, o) =>
              e.forEach((e) =>
                a.push([
                  e,
                  `${o ? ftOrd(o + 1) + " " : ""}Great-Grand${"m" === e.g ? "father" : "mother"}`,
                  t,
                ]),
              ),
            ),
          ),
          a.push(
            [t.elder, "Clan Elder"],
            [t.dad, "Ancient Forefather"],
            [t.mom, "Ancient Foremother"],
            ...t.kids.map((e) => {
              return [
                e,
                e.heir ? "Ancient Ancestor" : "Their " + ((t = e), "m" === t.g ? "Son" : "Daughter"),
              ];
              var t;
            }),
          ),
          a
            .map(([e, a, o]) => ftNode(e, e.cave ? `${a} · ${t.clan}` : a, o ? { side: o } : {}))
            .filter((e) => e.dead)
            .sort((e, t) => t.died - e.died)
        );
      }
      function ftLateRows() {
        if (!mods.familyTree || !mods.lateAncestors) return "";
        const e = ftLateAncestors();
        if (((ftLateCache = e), !e.length)) return "";
        return (
          '<div class="sec">Late Relationships</div>' +
          e
            .map(
              (e, t) =>
                `<div class="row sm" data-late="${t}"><img src="ui/skull-and-bones.png" alt=""><div class="t"><b>${`${e.first} ${e.last}`.trim()} <em>(${e.title.split(" · ")[0]})</em></b><span>${((
                  e,
                ) => {
                  const t = ftNow() - e.died;
                  return t <= 0
                    ? "Died this year"
                    : 1 === t
                      ? "Died 1 year ago"
                      : `Died ${e.cave ? "about " : ""}${t.toLocaleString("en-US")} years ago`;
                })(e)}</span></div>${DOTS}</div>`,
            )
            .join("")
        );
      }
      let ftLateCache = [];
      function ftBindLate() {
        sList.querySelectorAll("[data-late]").forEach(
          (e) =>
            (e.onclick = () => {
              play("toList"),
                ftPerson(ftLateCache[+e.dataset.late], () => {
                  screen.classList.remove("ft-over"), openRelationships();
                });
            }),
        );
      }
      const ftRow = (e, t, a, o, n = DOTS) =>
          `<div class="row sm" ${e}>${t}<div class="t"><b>${a}</b>${o}</div>${n}</div>`,
        ftSub = (e) => `<span>${e}</span>`;
      function ftScreen(e, t, a) {
        syncProfile(),
          screen.classList.add("open", "ft-over"),
          (sTitle.textContent = e),
          (sSub.style.display = "none"),
          (sBack.innerHTML = BACK_ICON),
          (sTitle.style.fontSize = e.length > 17 ? "17px" : ""),
          (sBack.onclick = () => {
            (sTitle.style.fontSize = ""), a();
          }),
          (sList.innerHTML = t),
          (sList.scrollTop = 0);
      }
      const ftScreenClose = () => {
        screen.classList.remove("ft-over"), openAssets();
      };
      function ftFaceEl(e, t) {
        let a;
        if (e.cave) (a = ftCaveFace(e)), a.classList.add(t);
        else {
          const o = ftConds(e.src).find((t) => ftActive(e, t));
          a = npcFace(
            e.look || randomLook(e.g, e.age),
            e.g,
            Math.max(0, e.age),
            o && "depression" === o.id ? "sad" : "happy",
            t,
          );
        }
        return e.dead && (a.style.filter = "grayscale(1)"), a;
      }
      function ftWorth(e) {
        const t = e.you
          ? netWorth()
          : !e.src.anc && e.src.prof
            ? e.src.prof.money
            : (e.royal && e.royal.worth) || 0;
        return usd(Math.round(t));
      }
      function ftRoyalCard(e) {
        const t = e.royal,
          a = state.ft,
          o = ftPron(e),
          n = state.royal && state.royal.dynasty,
          s = state.parents.find((e) => "Father" === e.role),
          r = a
            ? [
                ...a.p
                  .map((e) => e[0])
                  .filter((e) => e.royal && !e.royal.consort)
                  .reverse(),
                a.gp[0],
                s,
              ].filter((e) => e && e.royal)
            : [],
          i = r.find((e) => e.royal.founder),
          l = i ? `${i.first} ${i.last || SURNAME}` : "your ancestors",
          c = i && (i.royal.founded ?? (n && n.founded)),
          d =
            r
              .map(
                (t) =>
                  `<li${t === e.src || e.src.spouseOf === t ? ' class="me"' : ""}><b>${t.royal.nth ? t.royal.nth + "." : ""}</b> ${t.first} ${t.last || SURNAME}` +
                  (t.royal.founder ? " <em>(founder)</em>" : "") +
                  "</li>",
              )
              .join("") +
            (state.royal && !state.royal.abdicated
              ? `<li${e.you ? ' class="me"' : ""}><b>${n ? n.nth + "." : ""}</b> ${state.first} ${SURNAME} <em>(you, the heir)</em></li>`
              : ""),
          u = t.founder
            ? `${e.first} founded the royal line in ${c || "the old days"}, becoming the very first ${royWord(t.rank, "m")} of ${t.place}. Every ${SURNAME} royal since descends from ${o.him}.`
            : t.consort
              ? `${e.first} married into the royal family and reigned beside ${o.his} spouse as ${t.title.replace(" (consort)", "")}.`
              : t.heir
                ? `You are next in the line that began with ${l}. One day the title passes to you.`
                : `${e.first} inherited the title from ${o.his} parent and passed it down to the next generation.`;
        jCard({
          tag: "Royalty",
          person: {
            name: `${e.first} ${e.last}`.trim(),
            look: e.look,
            g: e.g,
            age: Math.max(0, e.age),
            mood: "happy",
          },
          iconSrc: "monarch" === t.rank ? "royal/monarch.png" : "royal/crown.png",
          title: "Royal History",
          close: !0,
          lead: `${u}<ol class="ft-line">${d}</ol>`,
          rows: [
            ["Title", t.title],
            ["Fortune", ftWorth(e)],
            t.nth && !t.consort
              ? ["In the line", `${t.nth} of ${r.length + (state.royal && !state.royal.abdicated ? 1 : 0)}`]
              : null,
            i ? ["Dynasty founded", `${c} by ${l}`] : null,
          ].filter(Boolean),
        });
      }
      function ftPerson(e, t = ftScreenClose) {
        const { P: a, F: o } = ftFacts(e),
          n = ftConds(e.src),
          s = `${e.first} ${e.last}`.trim(),
          r = e.dead
            ? e.cave
              ? `c. ${ftY(e.born)} · ${state.ft.cave.clan}`
              : `${e.born} – ${e.died}`
            : null;
        ftScreen(
          e.title.split(" · ")[0].toUpperCase(),
          `<div class="row sm${o ? " ft-famous" : e.royal ? " ft-royal" : ""}" data-k="prof"><i class="ftface"></i><div class="t"><b>${s} <em>(${e.dead ? `Died at ${e.age}` : `Age ${e.age}`})</em>${o ? '<img src="emoji/2b50.png" alt="">' : e.royal ? '<img src="royal/crown.png" alt="">' : ""}</b>` +
            (null == e.rel || e.dead ? ftSub(r || e.title) : relBar(e.rel)) +
            `</div>${DOTS}</div><div class="sec">Family History</div>` +
            ftRow(
              'data-k="prof"',
              '<img src="act/profile.png">',
              "Profile",
              ftSub(`View ${e.you ? "your" : a.his} profile`),
            ) +
            ftRow(
              'data-k="story"',
              '<img src="emoji/1f4d6.png">',
              "Life Story",
              ftSub(e.dead ? `How ${a.he} lived and died` : `${e.you ? "Your" : a.His} story so far`),
            ) +
            (o ? ftRow('data-k="fame"', '<img src="emoji/2b50.png">', "Famous History", ftSub(o.t)) : "") +
            (e.royal
              ? ftRow('data-k="royal"', '<img src="royal/crown.png">', "Royal History", ftSub(e.royal.title))
              : "") +
            (e.src.localFame
              ? ftRow(
                  'data-k="local"',
                  `<img src="emoji/${FT_FAME_ICO[e.src.localFame.cat] || "1f3c5"}.png">`,
                  "Local Legend",
                  ftSub(`${FT_FAME_LVL[e.src.localFame.level]} · ${ftCap(e.src.localFame.reason)}`),
                )
              : "") +
            (e.src.mil
              ? ftRow(
                  'data-k="mil"',
                  `<img src="mil/${e.src.mil.hero ? "medal-silverstar" : "x-combat-helmet"}.png">`,
                  e.src.mil.hero ? "War Hero" : "Military Service",
                  ftSub(
                    e.src.mil.active
                      ? `Active duty · ${e.src.mil.rank}, ${e.src.mil.branch}`
                      : e.src.mil.war
                        ? `${e.src.mil.hero ? "Decorated in" : "Veteran of"} ${e.src.mil.war.replace(/^the /, "")}`
                        : `${e.src.mil.branch} veteran (peacetime)`,
                  ),
                )
              : "") +
            (e.src.pack && e.src.pack[20].length
              ? '<div class="sec">Family Archive</div>' +
                e.src.pack[20]
                  .map((t, a) => {
                    const [o, n] = FT_ARCHIVE[t[0]] || ["1f4dc", "Record"];
                    return ftRow(
                      `data-dlg="${a}"`,
                      `<img src="${o.includes("/") ? o : `emoji/${o}.png`}">`,
                      n,
                      ftSub(`${t[1]}${(e.src.dlgSeen || {})[a] ? " · ✓ read" : ""}`),
                    );
                  })
                  .join("")
              : "") +
            '<div class="sec">Hereditary Traits</div>' +
            (n.length
              ? n
                  .map((t) => {
                    const a = FT_COND[t.id],
                      o = ftActive(e, t),
                      n = ftForm(e.src, t),
                      s = t.par.map((e) => (e === state ? "you" : e.first)).join(" & "),
                      r = o
                        ? n
                          ? `Hooked on ${n[0]}`
                          : t.par.length
                            ? `Inherited from ${s}`
                            : "No family history"
                        : `Carrier · usually shows by age ${a.onset}`;
                    return ftRow(
                      `data-tr="${t.id}"`,
                      ftTraitPic(e, t, 34),
                      a.name + (o ? "" : " <em>(carrier)</em>"),
                      ftSub(r),
                    );
                  })
                  .join("")
              : ftRow(
                  "",
                  ftSpr("happy", 34),
                  "No Hereditary Traits",
                  ftSub(`${e.you ? "You" : a.He} got lucky in the family lottery`),
                  "",
                )) +
            ftRow(
              'data-k="all"',
              ftSpr("brain", 34),
              "All Inheritable Traits",
              ftSub(`Genetic risk for everything in ${e.you ? "your" : a.his} era`),
            ),
          t,
        ),
          sList.querySelector("i.ftface").replaceWith(ftFaceEl(e, "face")),
          sList.querySelectorAll('[data-k="prof"]').forEach((t) => (t.onclick = () => ftProfileCard(e))),
          (sList.querySelector('[data-k="story"]').onclick = () => ftStoryCard(e)),
          o && (sList.querySelector('[data-k="fame"]').onclick = () => ftFameCard(e)),
          e.royal && (sList.querySelector('[data-k="royal"]').onclick = () => ftRoyalCard(e));
        const i = sList.querySelector('[data-k="local"]');
        i && (i.onclick = () => ftLocalCard(e));
        const l = sList.querySelector('[data-k="mil"]');
        l && (l.onclick = () => ftMilCard(e)),
          sList
            .querySelectorAll("[data-dlg]")
            .forEach((a) => (a.onclick = () => ftArchive(e, +a.dataset.dlg, () => ftPerson(e, t)))),
          (sList.querySelector('[data-k="all"]').onclick = () => {
            play("toList"), ftAllTraits(e, t);
          }),
          sList
            .querySelectorAll("[data-tr]")
            .forEach((t) => (t.onclick = () => ftTraitCard(e, t.dataset.tr)));
      }
      function ftEvCard(e, t, a, o) {
        (ev.innerHTML = `${e.famous ? '<i class="ft-fame-mk" hidden></i>' : ""}<div class="jm-x" id="propX" style="left:-14px;top:-14px">${CARD_X}</div>\n      <div class="ev-tag" style="margin-top:12px"><i class="ftface"></i><span class="who">${`${e.first} ${e.last}`.trim()}</span><span class="kind">${e.title.split(" · ")[0]}</span></div>\n      <h4>${t}<span>${a}</span></h4>${o}`),
          ev.querySelector("i.ftface").replaceWith(ftFaceEl(e, "ev-av")),
          (ev.style.overflow = "visible"),
          (document.getElementById("propX").onclick = () => {
            evWrap.classList.remove("open"), (ev.style.overflow = "");
          }),
          evWrap.classList.add("open");
      }
      const ftBar = (e, t, a) =>
        `<b>${e}</b><i><u style="width:${Math.max(t, 1)}%;background:${a || barCol(t)}"></u></i>`;
      function ftProfileCard(e) {
        const { rows: t } = ftFacts(e),
          a = e.src;
        a.ftStats ??= { smarts: rint(5, 100), looks: rint(5, 100), relig: rint(0, 100), gen: rint(0, 100) };
        const o = ftConds(a);
        ftEvCard(
          e,
          '<img src="act/profile.png">',
          "Profile",
          `<table class="prof"><tbody>${t.map(([e, t]) => `<tr><td><b>${e}:</b> ${t}</td></tr>`).join("")}<tr><td><b>Hereditary Traits:</b> ${o.length ? o.map((e) => FT_COND[e.id].name).join(", ") : "None"}</td></tr></tbody></table><div class="ev-bars">${null == e.rel || e.you ? "" : ftBar("Relationship", e.rel)}${ftBar("Smarts", a.ftStats.smarts)}${ftBar("Looks", a.ftStats.looks)}${ftBar("Religiousness", a.ftStats.relig)}${ftBar("Generosity", a.ftStats.gen)}</div>`,
        );
      }
      function ftStoryCard(e) {
        const { I: t, bio: a } = ftFacts(e);
        ftEvCard(
          e,
          '<img src="emoji/1f4d6.png">',
          "Life Story",
          `<div class="lead" style="text-align:left">${a}</div>` +
            (e.you
              ? ""
              : `<table class="prof"><tbody><tr><td><b>Personality:</b> ${t.traits.join(", ")}</td></tr><tr><td><b>Fun Fact:</b> ${t.fact}</td></tr></tbody></table>`),
        );
      }
      function ftFameCard(e) {
        const t = e.famous;
        ftEvCard(
          e,
          `<img src="emoji/${t.ico}.png">`,
          t.t,
          `<div class="ft-fame" style="margin-bottom:6px"><div class="bar-tag">★ Famous Ancestor</div><div class="hl">${t.hl}</div><div class="fbar">Fame<div><u style="width:${20 * t.stars}%">${20 * t.stars}%</u></div></div>${t.story.map((e) => `<p>${e}</p>`).join("")}<ul>${t.feats.map((e) => `<li>${e}</li>`).join("")}</ul><div class="lg">${t.legacy}</div></div>`,
        );
      }
      function ftMilCard(e) {
        const t = e.src.mil,
          a = ftPron(e);
        ftEvCard(
          e,
          `<img src="mil/${t.hero ? "medal-silverstar" : "x-combat-helmet"}.png">`,
          t.hero ? "War Hero" : "Military Service",
          `<table class="prof"><tbody><tr><td><b>Branch:</b> ${t.branch}</td></tr><tr><td><b>Rank:</b> ${t.rank}</td></tr><tr><td><b>${t.active ? "Serving:</b> Active duty since " + t.y : `Served:</b> ${t.y}${t.years > 1 ? "–" + (t.y + t.years - 1) : ""}${t.war ? ` in ${t.war}` : " (peacetime)"}`}</td></tr>` +
            (t.hero ? `<tr><td><b>Honors:</b> ${ftCap(t.hero)}</td></tr>` : "") +
            (t.scar
              ? `<tr><td><b>${t.active ? "Scar:</b> From a training accident" : "Battle Scar:</b> " + (t.war ? "Yes, carried for life" : "From a training accident")}</td></tr>`
              : "") +
            (e.famous && e.famous.milHero ? "<tr><td><b>Fame:</b> A famous war hero</td></tr>" : "") +
            "</tbody></table>" +
            `<div class="lead" style="margin-top:-8px">${ftMilLine(e, a).trim()}</div>`,
        );
      }
      function ftTraitCard(e, t) {
        const a = FT_COND[t],
          o = ftPron(e),
          n = ftConds(e.src).find((e) => e.id === t),
          s = n && ftActive(e, n),
          r = ftForm(e.src, { id: t }),
          i = Math.round(100 * Math.min(0.95, (e.src.risk || {})[t] ?? a.base)),
          l = n ? n.par.map((e) => (e === state ? "you" : e.first)).join(" & ") : "",
          c = n
            ? n.par.length
              ? n.general
                ? `A general addiction risk from ${l}`
                : l
              : "No family history: it started with them"
            : "Not inherited",
          d = ftYears(e.src)[1],
          u = e.cave
            ? "The clan's shaman believed it was the work of spirits."
            : d < 1900
              ? `Back then people called it "${a.old}", and there was no real treatment.`
              : d < 1960
                ? `Doctors of the time called it "${a.old}" and had little to offer.`
                : "It was diagnosed, and treatment helped.";
        n && (n.li ??= rint(0, a.life.length - 1));
        const h = "gene" === a.grp,
          p = s
            ? `${e.you ? "You" : o.He} ${a.life[n.li]}. ${h ? ftGeneHow(e, a, d) : u}`
            : n
              ? `${e.you ? "You carry" : `${o.He} carries`} the genes for it, but it usually shows up around age ${a.onset}${e.dead ? ` and ${o.he} died before then` : ". It may never show up at all"}.`
              : `${e.you ? "You don't" : `${o.He} doesn't`} have it${i >= 20 ? `, even with a ${i}% genetic risk` : ""}.`,
          m =
            s && !e.cave && d >= 1960 && a.treat.length
              ? `<div class="ft-treat" style="justify-content:center;margin:-6px 0 14px">${a.treat.map((e) => `<span>${ftSpr(FT_TREAT[e][1], 22)}${FT_TREAT[e][0]}</span>`).join("")}</div>`
              : "";
        ftEvCard(
          e,
          ftTraitPic(e, n || { id: t }, 26),
          a.name,
          `<div class="lead">${a.desc}</div><table class="prof"><tbody><tr><td><b>Status:</b> ${s ? "Has it" : n ? "Carrier (not shown yet)" : "Not affected"}</td></tr><tr><td><b>Inherited From:</b> ${c}</td></tr>` +
            (r ? `<tr><td><b>In ${e.you ? "Your" : o.His} Era:</b> ${r[0]}</td></tr>` : "") +
            `<tr><td><b>Old Name:</b> ${a.old}</td></tr><tr><td><b>${h ? "Shows Up:</b> From birth" : `Usually Shows By:</b> Age ${a.onset}`}</td></tr></tbody></table>` +
            `<div class="lead" style="margin-top:-8px">${p}</div>${m}` +
            `<div class="ev-bars">${ftBar("Genetic Risk", i, a.col)}${ftBar("Heritability", a.h, "#8a94a6")}</div>`,
        );
      }
      function ftAllTraits(e, t = ftScreenClose) {
        const a = e.src,
          o = a.risk || {},
          n = ftConds(a),
          s = ftList().filter((e) => ftAllowed(a, e)),
          r = ftList().filter((e) => !ftAllowed(a, e)),
          i = (t) => {
            const a = n.find((e) => e.id === t.id),
              s = a && ftActive(e, a),
              r = Math.round(100 * Math.min(0.95, o[t.id] ?? t.base));
            return `<div class="row sm" data-tr="${t.id}">${ftTraitPic(e, a || { id: t.id }, 34)}<div class="t"><b>${t.name}</b><div class="rel">Genetic Risk <i><u style="width:${Math.max(2, r)}%;background:${t.col}"></u></i></div></div><span class="ft-st${a ? " on" : ""}" style="--cc:${t.col}">${s ? "Has it" : a ? "Carrier" : r + "%"}</span></div>`;
          };
        ftScreen(
          "ALL TRAITS",
          (s.some((e) => "gene" === e.grp)
            ? `<div class="sec">Birth Traits</div>${s
                .filter((e) => "gene" === e.grp)
                .map(i)
                .join("")}`
            : "") +
            `<div class="sec">Mental Health</div>${s
              .filter((e) => "mind" === e.grp)
              .map(i)
              .join("")}` +
            (s.some((e) => "add" === e.grp)
              ? `<div class="sec">Addictions</div>${s
                  .filter((e) => "add" === e.grp)
                  .map(i)
                  .join("")}`
              : "") +
            (r.length
              ? '<div class="sec">Didn\'t Exist Yet</div>' +
                r
                  .map(
                    (e) =>
                      `<div class="row sm dis">${e.img ? ftGenePic(e, 34) : e.spr ? ftSpr(e.spr, 34) : ftIco(e.id, "lg")}<div class="t"><b>${e.name}</b>${ftSub(e.from > 0 ? `From ${e.from}` : `From ${(-e.from).toLocaleString("en-US")} BC`)}</div></div>`,
                  )
                  .join("")
              : ""),
          () => ftPerson(e, t),
        ),
          sList
            .querySelectorAll("[data-tr]")
            .forEach((t) => (t.onclick = () => ftTraitCard(e, t.dataset.tr)));
      }
      SND.death = new Audio("sounds/a16_sndDeath.wav");
      const ageBtnEl = document.getElementById("ageBtn");
      function deathChance(e, t) {
        if (e < 30 && t >= 20) return 0;
        let a =
          e < 30 ? 8e-4 : e < 50 ? 0.002 : Math.min(0.6, Math.max(0.003, 0.015 * Math.exp(0.09 * (e - 65))));
        e >= 50 && t >= 20 && (a *= t >= 80 ? 0.7 : t >= 50 ? 0.9 : 1.3);
        const o = e < 18 ? 0.15 : e < 30 ? 0.3 : e < 45 ? 0.55 : 1;
        return (
          t <= 0
            ? (a = Math.max(
                2 * a + 0.03 * o,
                [0.08, 0.3, 0.55, 0.85][Math.min(3, (state.zeroHp || 1) - 1)] * o,
              ))
            : t < 20 && (a = 2 * a + 0.03 * o),
          state.diet && "Mediterranean" === state.diet.name && (a *= 0.75),
          Math.min(a, 1)
        );
      }
      function causeOfDeath(e, t) {
        const a = state.diet && void 0 !== DIETS && DIETS[state.diet.name];
        if (t < 20 && a && a.bad && chance(0.7)) return a.bad;
        if (t < 20)
          return (state.ills || []).some((e) => seriousIll(e))
            ? "complications from a long illness"
            : any(["organ failure", "pneumonia", "a heart attack"]);
        const o = (state.ills || []).filter((e) => e.known && seriousIll(e));
        return o.length && chance(0.6)
          ? `complications from ${illWord(any(o).name)}`
          : e >= 80 && chance(0.7)
            ? "old age"
            : any(
                e >= 70
                  ? ["a heart attack", "a stroke", "pneumonia", "heart failure", "old age"]
                  : ["a heart attack", "a stroke", "an aneurysm", "pneumonia"],
              );
      }
