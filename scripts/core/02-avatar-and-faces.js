      let btShow = !1;
      function revealGenes(e) {
        if (state.genesShown || !state.genes.length) return;
        state.genesShown = !0;
        const t = document.getElementById("log").lastElementChild,
          a = t.querySelector(".news");
        state.genes.forEach((o) => {
          const n = BT[o];
          for (const [e, t] of Object.entries(n.fx || {}))
            state.stats[e] = Math.max(0, Math.min(100, state.stats[e] + t));
          const s = (state.conds || []).find((e) => e.id === o),
            r =
              s && s.par && s.par.length
                ? s.par.map((e) => (e.role ? `my ${e.role.toLowerCase()}` : e.first)).join(" and ")
                : null,
            i = s && null != s.odds ? Math.round(1e3 * s.odds) / 10 : null,
            l = r
              ? ` I inherited it from ${r}${null != i ? ` (a ${i}% chance)` : ""}.`
              : null != i
                ? ` Nobody in my family had it before me (a ${i}% chance).`
                : "",
            c = (e ? n.born : `A DNA test showed ${n.born}`) + l;
          (e && a ? a : t).insertAdjacentHTML(e && a ? "beforebegin" : "beforeend", `<p>${c}</p>`);
        });
      }
      const btIcon = (e) => `genes/${e}.png`;
      function geneLook(e, t) {
        if (!e) return;
        const a = (e) => t.includes(e),
          o = (e) =>
            e
              .slice(1)
              .match(/../g)
              .map((e) => parseInt(e, 16)),
          n = (e, t) => o(e).reduce((e, a, n) => e + (a - o(t)[n]) ** 2, 0);
        a("heterochromia")
          ? (e.eye2 ||= ["#3f9fe0", "#2fae5a", "#6b4226", "#a8742e", "#8fa3b5", "#1f5fbf"]
              .sort((t, a) => n(a, e.eyes) - n(t, e.eyes))
              .slice(0, 2)[Math.floor(2 * Math.random())])
          : delete e.eye2,
          a("hypertrichosis") ? (e.fur = 1) : delete e.fur,
          a("chimera") ? (e.twin = 1) : delete e.twin;
      }
      const seededRand = (e) => () => {
        e = (e + 1831565813) | 0;
        let t = Math.imul(e ^ (e >>> 15), 1 | e);
        return (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t), ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
      function drawFur(e, t, a, o) {
        const n = document.createElement("canvas");
        n.width = n.height = 250;
        const s = n.getContext("2d");
        /^#[0-9a-f]{6}$/i.test(a) || (a = "#5b3a22");
        const r = seededRand(7919 * o + 13),
          i = [shade(a, 0.6), shade(a, 0.75), shade(a, 0.9), a];
        s.lineCap = "round";
        for (let e = 0; e < 2600; e++) {
          const e = 10 + 230 * r(),
            t = 10 + 240 * r(),
            a = (e - 125) / 32,
            o = (t - 170) / 44;
          if (a * a + o * o < 1 && r() < 0.75) continue;
          const n = 0.55 * Math.atan2(t - 95, e - 125) + (Math.PI / 2) * 0.45 + 0.7 * (r() - 0.5),
            l = 5 + 8 * r();
          (s.strokeStyle = i[Math.floor(r() * i.length)]),
            (s.globalAlpha = 0.55 + 0.4 * r()),
            (s.lineWidth = 1.2 + 1.3 * r()),
            s.beginPath(),
            s.moveTo(e, t),
            s.lineTo(e + Math.cos(n) * l, t + Math.sin(n) * l),
            s.stroke();
        }
        (s.globalAlpha = 1),
          (s.globalCompositeOperation = "destination-in"),
          s.drawImage(t, -6.25, -5, 262.5, 262.5),
          e.drawImage(n, 0, 0);
      }
      function drawPox(e, t, a) {
        const o = document.createElement("canvas");
        o.width = o.height = 250;
        const n = o.getContext("2d"),
          s = seededRand(104729 * a + 7);
        for (let e = 0; e < 46; e++) {
          const e = 55 + 140 * s(),
            t = 70 + 150 * s(),
            a = 2.2 + 2.6 * s();
          (n.globalAlpha = 0.9),
            (n.fillStyle = "#e0575b"),
            n.beginPath(),
            n.arc(e, t, a, 0, 2 * Math.PI),
            n.fill(),
            (n.globalAlpha = 0.55),
            (n.fillStyle = "#ffb3a8"),
            n.beginPath(),
            n.arc(e - 0.3 * a, t - 0.3 * a, 0.45 * a, 0, 2 * Math.PI),
            n.fill();
        }
        (n.globalAlpha = 1),
          (n.globalCompositeOperation = "destination-in"),
          n.drawImage(t, 0, 0, 250, 250),
          e.drawImage(o, 0, 0);
      }
      function drawPinkEye(e, t, a) {
        const o = document.createElement("canvas");
        o.width = o.height = 250;
        const n = o.getContext("2d"),
          s = seededRand(7727 * a + 3);
        (n.fillStyle = "rgba(226,58,82,.6)"),
          n.fillRect(0, 0, 250, 250),
          (n.strokeStyle = "rgba(170,10,35,.9)"),
          (n.lineCap = "round");
        for (let e = 0; e < 70; e++) {
          let e = 250 * s(),
            t = 60 + 120 * s();
          (n.lineWidth = 0.7 + 0.8 * s()), n.beginPath(), n.moveTo(e, t);
          for (let a = 0; a < 3; a++) (e += 16 * (s() - 0.5)), (t += 10 * (s() - 0.5)), n.lineTo(e, t);
          n.stroke();
        }
        (n.globalCompositeOperation = "destination-in"), n.drawImage(t, 0, 0, 250, 250), e.drawImage(o, 0, 0);
      }
      function drawTwin(e, t) {
        for (const [a, o] of [
          [162, 0.24],
          [88, -0.24],
        ])
          e.save(),
            e.translate(a, 222),
            e.rotate(o),
            e.scale(0.64, 0.64),
            e.translate(-125, -250),
            t(e),
            e.restore();
      }
      function twinFace(e) {
        const t = document.createElement("canvas");
        return (t.width = t.height = 250), drawTwin(t.getContext("2d"), (t) => t.drawImage(e, 0, 0)), t;
      }
      if (((state.look = randomLook(PG(), 0)), PICK && PICK.look)) {
        const f = PICK.look;
        if (PICK.heir) {
          Object.assign(state.look, f);
        } else {
          const m = state.look.hairCut;
          Object.assign(state.look, f, { beard: 0 }),
            (state.lookLater = {
              hairCut: f.hairCut,
              xHair: f.xHair || null,
              tats: f.tats || null,
              faceTat: f.faceTat || null,
              scar: f.scar || 0,
              patch: f.patch || 0,
            }),
            (state.look.hairCut = m),
            delete state.look.xHair,
            delete state.look.tats,
            delete state.look.faceTat;
        }
      }
      function applyLookLater() {
        const e = state.lookLater;
        !e ||
          state.age < 16 ||
          state.dead ||
          (delete state.lookLater,
          null != e.hairCut && (state.look.hairCut = e.hairCut),
          e.xHair && (state.look.xHair = e.xHair),
          e.tats && (state.look.tats = e.tats),
          e.faceTat && (state.look.faceTat = e.faceTat),
          e.scar && (state.acc.scar = `scar${e.scar}`),
          e.patch && (state.acc.patch = "patch" + (e.patch - 1)),
          "function" == typeof renderAvatar && renderAvatar(),
          say(
            `I turned 16 and finally got the look I always wanted${e.tats || e.faceTat ? ", tattoos and all" : ""}.`,
          ));
      }
      (state.acc = { eyewear: null, headwear: null, mask: null, scar: null, patch: null }),
        delete state.look.scar,
        delete state.look.patch;
      const stage = (e) => (e < 3 ? 0 : e < 13 ? 1 : e < 18 ? 2 : e < 35 ? 3 : e < 60 ? 4 : 5),
        stageName = (e) =>
          e < 3 ? "Baby" : e < 13 ? "Child" : e < 18 ? "Teen" : e < 60 ? "Adult" : "Retired",
        layerImgs = {},
        loadLayer = (e) =>
          (layerImgs[e] ||= new Promise((t) => {
            const a = new Image();
            (a.onload = () => t(a)),
              (a.onerror = () => t(null)),
              (a.src = e.startsWith("acc/")
                ? `${e}.png${/^acc\/(scar|patch)/.test(e) ? "?v=6" : /^acc\/cowboy/.test(e) ? "?v=2" : ""}`
                : /^hair\/west/.test(e)
                  ? `${e}.png?v=9`
                  : /^(hair|tattoo)\//.test(e)
                    ? `${e}.png?v=10`
                    : `faces/${e}.png`);
          })),
        HAIR_PACK = [
          ...[1, 2, 3, 4, 5].map((e) => [`hhc${e}`, `Hip-Hop Hair ${e}`]),
          ...[1, 2, 3].map((e) => [`long${e}`, `Long Hair ${e}`]),
          ...[1, 2, 3, 4, 5].map((e) => [`short${e}`, `Short Hair ${e}`]),
          ["buzz", "Buzz Cut"],
          ...Array.from({ length: 48 }, (e, t) => [
            `tx${String(t + 1).padStart(2, "0")}`,
            `Textured Hair ${t + 1}`,
            !0,
          ]),
          ["dread-green", "Green Dreads", !0],
          ["dread-blonde", "Blonde & Black Dreads", !0],
          ["dread-red", "Red Dreads", !0],
          ["dread-black", "Black Dreads", !0],
          ["emo-pink1", "Pink & Black Emo", !0],
          ["emo-pink2", "Pink & Black Emo 2", !0],
          ["rainbow-long", "Rainbow Hair", !0],
          ["braids-bw", "Box Braids", !0],
          ...Array.from({ length: 10 }, (e, t) => [`west${t + 1}`, `Shaggy Hair ${t + 1}`]),
          ["nh01", "Wave Cap", !0],
          ["nh02", "Curly Top", !0],
          ["nh03", "Spiky Fluff", !0],
          ["nh04", "Slick Side Part", !0],
          ["nh05", "Cornrow Fan", !0],
          ["nh06", "Tight Curls", !0],
          ["nh07", "Low Waves", !0],
          ["nh08", "Loose Curls", !0],
          ["nh09", "Textured Quiff", !0],
          ["nh10", "Waves & Part", !0],
          ["nh11", "Short Twists", !0],
          ["nh12", "Blond Curls", !0],
          ["nh13", "Box Braids Part", !0],
          ["nh14", "High Ponytail", !0],
          ["nh15", "Curly Afro", !0],
          ["nh16", "Blonde Bob", !0],
          ["nh17", "Long Waves", !0],
          ["nh18", "Messy Bun", !0],
          ["nh19", "Cornrow Cap", !0],
          ["nh20", "Long Twists", !0],
          ["nh21", "Curly Space Buns", !0],
          ["nh22", "Long Straight Blonde", !0],
          ["nh23", "Short Black Spikes", !0],
          ["nh24", "Layered Brown", !0],
        ],
        freeHair = (e) => /^west\d+$/.test(e || ""),
        hairPackList = () => (hairPackOn() ? HAIR_PACK : HAIR_PACK.filter((e) => freeHair(e[0]))),
        modFlag = (e) => {
          try {
            return !!mods[e];
          } catch {
            try {
              return !!(JSON.parse(localStorage.getItem("bitlifepp-mods")) || {})[e];
            } catch {
              return !1;
            }
          }
        },
        hairPackOn = () => !0,
        TAT_GANGS = [
          {
            mod: "gangTats",
            name: "Compton Varrio Locos 38St",
            fh: [
              ["cvlocos", "CV Locos"],
              ["els13", "ELS 13"],
              ["locos", "Locos"],
              ["oldenglish", "Old English"],
            ],
            cl: [["38st", "38th St"]],
            cr: [["streetgang", "Street Gang"]],
          },
          {
            mod: "pardinosTats",
            name: "Barrio Los Pardinos 13",
            fh: [
              ["blptrece", "BLP Trece"],
              ["barriopardinos", "Barrio Pardinos X3"],
              ["gotbarriop", "Got Barrio P"],
            ],
            cl: [["blsp", "BLSP"]],
            cr: [["cblsp", "C BLSP"]],
          },
          {
            mod: "bloodelTats",
            name: "Bloodel Street Piru",
            fh: [
              ["bloodelstreet", "Bloodel Street Piru"],
              ["killagangstaz", "Everybody Killa Gangstaz"],
              ["wblst", "WBLST Piru"],
              ["spybp", "SPY BP"],
            ],
            cl: [["blstpiru", "BLST Piru"]],
            cr: [["bloodelpiru", "Bloodel Piru"]],
          },
          {
            name: "Six Nine",
            fh: [
              ["sn-gothic69", "Gothic 69"],
              ["sn-bold69", "Bold 69"],
              ["sn-sixnine", "SIX NINE"],
              ["sn-script1", "Six nine Script"],
              ["sn-script2", "Sixnine Script"],
              ["sn-small69", "Small 69"],
            ],
            cl: [
              ["sn-rose", "Rose"],
              ["sn-web-l", "Spider Web"],
              ["sn-wings", "69 Wings"],
              ["sn-jigsaw", "Jigsaw"],
              ["sn-small69", "Small 69"],
              ["sn-bold69", "Bold 69"],
            ],
            cr: [
              ["sn-rose", "Rose"],
              ["sn-web-r", "Spider Web"],
              ["sn-wings", "69 Wings"],
              ["sn-jigsaw", "Jigsaw"],
              ["sn-small69", "Small 69"],
              ["sn-bold69", "Bold 69"],
            ],
          },
          {
            name: "Tribal & Script",
            fh: [
              ["ts-1212", "1212"],
              ["ts-tally", "Tally Marks"],
              ["ts-big69", "Big 69"],
              ["ts-3e", "3E"],
              ["ts-swirls", "Swirls"],
              ["ts-cmmf", "CMMF"],
              ["ts-arabic1", "Arabic Script"],
              ["ts-arabic2", "Arabic Script 2"],
              ["ts-stars", "Two Stars"],
              ["ts-cross", "Red Cross"],
            ],
            cl: [
              ["ts-cross", "Red Cross"],
              ["ts-slash", "Red Slash"],
              ["ts-claw", "Red Claw"],
              ["ts-star", "Red Star"],
              ["ts-bang", "Exclamation"],
              ["ts-heart", "Heart"],
              ["ts-flame", "Tribal Flame"],
              ["ts-spine", "Tribal Spine"],
              ["ts-stars", "Two Stars"],
              ["ts-3e", "3E"],
            ],
            cr: [
              ["ts-cross", "Red Cross"],
              ["ts-slash", "Red Slash"],
              ["ts-claw", "Red Claw"],
              ["ts-star", "Red Star"],
              ["ts-bang", "Exclamation"],
              ["ts-heart", "Heart"],
              ["ts-flame", "Tribal Flame"],
              ["ts-spine", "Tribal Spine"],
              ["ts-stars", "Two Stars"],
              ["ts-3e", "3E"],
            ],
          },
        ],
        TAT_SCALE = {
          "sn-web-l": 1.8,
          "sn-web-r": 1.8,
          "sn-wings": 1.8,
          "sn-rose": 1.6,
          "sn-jigsaw": 1.2,
          "ts-slash": 1.4,
          "ts-claw": 1.3,
          "ts-flame": 1.5,
          "ts-spine": 1.6,
          "ts-cross": 1.3,
        },
        TAT_SLOTS = [
          ["fh", "Forehead Tattoo"],
          ["cl", "Left Cheek Tattoo"],
          ["cr", "Right Cheek Tattoo"],
          ["td", "Teardrop Tattoo"],
        ],
        TEARDROPS = [
          [0, "None"],
          [1, "Left eye"],
          [2, "Right eye"],
          [3, "Both eyes"],
        ],
        gangModOn = () => TAT_GANGS.some((e) => e.mod && modFlag(e.mod)),
        gangTatsOn = () => TAT_GANGS.some((e) => !e.mod || modFlag(e.mod)),
        tatGangsOn = () => TAT_GANGS.filter((e) => !e.mod || gangModOn()),
        tatOpts = (e) => ("td" === e ? TEARDROPS : [[null, "None"], ...tatGangsOn().flatMap((t) => t[e])]),
        tatLabel = (e, t) =>
          (tatOpts(e).find((a) => a[0] === (t ?? ("td" === e ? 0 : null))) || [, "None"])[1],
        myTats = (e) => {
          const t = gangTatsOn() && e && e.tats;
          if (!t) return null;
          const a = (e) => {
              const a =
                "cl" === e
                  ? (t.cl ?? (1 & t.ck ? "38st" : null))
                  : "cr" === e
                    ? (t.cr ?? (2 & t.ck ? "streetgang" : null))
                    : t[e];
              return a && tatOpts(e).some((e) => e[0] === a) ? a : null;
            },
            o = { fh: a("fh"), cl: a("cl"), cr: a("cr"), td: t.td || 0 };
          return o.fh || o.cl || o.cr || o.td ? o : null;
        },
        tatKey = (e) => {
          const t = myTats(e);
          return t ? `${t.fh || ""}.${t.cl || ""}.${t.cr || ""}.${t.td}` : "";
        },
        alphaBoxes = {},
        alphaBox = (e, t) =>
          (alphaBoxes[e] ||= (() => {
            const e = document.createElement("canvas");
            e.width = e.height = 250;
            const a = e.getContext("2d");
            a.drawImage(t, 0, 0, 250, 250);
            const o = a.getImageData(0, 0, 250, 250).data;
            let n = 250,
              s = 250,
              r = 0,
              i = 0;
            for (let e = 0; e < 250; e++)
              for (let t = 0; t < 250; t++)
                o[4 * (250 * e + t) + 3] > 40 &&
                  (t < n && (n = t), t > r && (r = t), e < s && (s = e), e > i && (i = e));
            return [n, s, r, i];
          })()),
        tatColored = (e) =>
          (e._colored ??= (() => {
            const t = document.createElement("canvas");
            (t.width = 60), (t.height = Math.max(1, Math.round((60 * e.height) / e.width)));
            const a = t.getContext("2d");
            a.drawImage(e, 0, 0, t.width, t.height);
            const o = a.getImageData(0, 0, t.width, t.height).data;
            let n = 0,
              s = 0;
            for (let e = 0; e < o.length; e += 4)
              o[e + 3] > 60 &&
                (n++, Math.max(o[e], o[e + 1], o[e + 2]) - Math.min(o[e], o[e + 1], o[e + 2]) > 60 && s++);
            return n > 0 && s / n > 0.3;
          })());
      async function tattooLayer(e, t, a, o, n, s) {
        const [r, , i, l] = alphaBox(o, a),
          c = n ? alphaBox(s, n)[1] : alphaBox(o, a)[1] - 16,
          d = (r + i) / 2,
          u = i - r,
          h = [e.fh, e.cl, e.cr, e.td && "teardrop"].filter(Boolean),
          p = Object.fromEntries(
            await Promise.all(
              h.map(async (e) => {
                const t = await loadLayer("tattoo/" + e);
                return t && (t._tat = e), [e, t];
              }),
            ),
          ),
          m = document.createElement("canvas");
        m.width = m.height = 250;
        const f = m.getContext("2d"),
          g = (e, t, a) => {
            const o = TAT_SCALE[e._tat] || 1;
            a *= o;
            let n = ((t *= o) * e.height) / e.width;
            return n > a && ((n = a), (t = (n * e.width) / e.height)), [t, n];
          },
          y = (e, t, a, o, n) => {
            const s = document.createElement("canvas");
            s.width = s.height = 250;
            const r = s.getContext("2d");
            for (let s = 0; s < 2; s++) r.drawImage(e, t, a, o, n);
            tatColored(e) ||
              ((r.globalCompositeOperation = "source-atop"),
              (r.fillStyle = "rgba(16,20,32,.45)"),
              r.fillRect(0, 0, 250, 250)),
              f.drawImage(s, 0, 0);
          };
        if (e.fh && p[e.fh]) {
          const [t, a] = g(p[e.fh], 0.84 * u, 36);
          y(p[e.fh], d - t / 2, c - 3 - a, t, a);
        }
        if (e.cl && p[e.cl]) {
          const [t, a] = g(p[e.cl], 0.32 * u, 32);
          y(p[e.cl], r + 0.03 * u, l + 5, t, a);
        }
        if (e.cr && p[e.cr]) {
          const [t, a] = g(p[e.cr], 0.32 * u, 32);
          y(p[e.cr], i - 0.03 * u - t, l + 5, t, a);
        }
        if (p.teardrop) {
          const t = 0.1 * u,
            a = (t * p.teardrop.width) / p.teardrop.height,
            o = r + 0.12 * u,
            n = l + 2;
          1 & e.td && f.drawImage(p.teardrop, o - a / 2, n, a, t),
            2 & e.td &&
              (f.save(),
              f.translate(2 * d - o, 0),
              f.scale(-1, 1),
              f.drawImage(p.teardrop, -a / 2, n, a, t),
              f.restore());
        }
        return (
          (f.globalCompositeOperation = "destination-in"),
          f.drawImage(t, 0, 0, 250, 250),
          (f.globalCompositeOperation = "destination-out"),
          f.drawImage(a, 0, 0, 250, 250),
          m
        );
      }
      const FACE_TATS = {
          "ct-818": [0.39, 0.82],
          "ct-xv3": [0.41, 0.86],
          "ct-666": [0.4, 0.64],
          "ct-hated": [0.45, 0.6],
          "ft-thorncross": [0.62, 0.5],
          "ft-tribal": [0.35, 0.7],
        },
        FULL_FACE_TATS = [
          [null, "None"],
          ["ft-thorncross", "Thorns & Cross"],
          ["ft-tribal", "Tribal Mask"],
        ];
      async function faceTatLayer(e, t, a, o) {
        const n = await loadLayer("tattoo/" + e),
          s = FACE_TATS[e];
        if (!n || !s) return null;
        const [r, i, l, c] = alphaBox(o, a),
          d = (l - r) / s[1],
          u = (d * n.height) / n.width,
          h = document.createElement("canvas");
        h.width = h.height = 250;
        const p = h.getContext("2d");
        return (
          (p.globalAlpha = 0.85),
          p.drawImage(n, (r + l) / 2 - d / 2, (i + c) / 2 - s[0] * u, d, u),
          (p.globalAlpha = 1),
          (p.globalCompositeOperation = "destination-in"),
          p.drawImage(t, 0, 0, 250, 250),
          (p.globalCompositeOperation = "destination-out"),
          p.drawImage(a, 0, 0, 250, 250),
          h
        );
      }
      async function addictLayer(e, t, a, o, n) {
        const [s, r, i, l] = alphaBox(o, a),
          c = i - s,
          d = Math.max(8, l - r);
        let u = e.seed || 7;
        const h = () => (u = (16807 * u) % 2147483647) / 2147483647,
          p = document.createElement("canvas");
        p.width = p.height = 250;
        const m = p.getContext("2d"),
          f = (e, t, a, o, n, s) => {
            m.save(), m.translate(e, t), m.scale(1, o / a);
            const r = m.createRadialGradient(0, 0, 0, 0, 0, a);
            r.addColorStop(0, n.replace("A", s)),
              r.addColorStop(1, n.replace("A", 0)),
              (m.fillStyle = r),
              m.beginPath(),
              m.arc(0, 0, a, 0, 2 * Math.PI),
              m.fill(),
              m.restore();
          },
          g = [s + 0.22 * c, i - 0.22 * c];
        e.bags &&
          g.forEach((t) => {
            f(t, l + 0.25 * d, 0.19 * c, 0.45 * d, "rgba(80,40,70,A)", 0.35 + 0.3 * e.bags),
              f(t, l + 0.1 * d, 0.14 * c, 0.22 * d, "rgba(60,25,50,A)", 0.25 * e.bags);
          }),
          e.hollow &&
            [s + 0.1 * c, i - 0.1 * c].forEach((e) => {
              f(e, l + 2.3 * d, 0.15 * c, 1.1 * d, "rgba(70,40,30,A)", 0.32),
                f(e, l + 0.9 * d, 0.14 * c, 0.4 * d, "rgba(255,240,225,A)", 0.18);
            });
        for (let t = 0; t < (e.sores || 0); t++) {
          const e = s + c * (0.05 + 0.9 * h()),
            t = r - 1.2 * d + h() * d * 5.5,
            a = 1.6 + 2.4 * h();
          f(e, t, 2.2 * a, 2.2 * a, "rgba(190,60,50,A)", 0.45),
            (m.fillStyle = "rgba(120,35,30,.85)"),
            m.beginPath(),
            m.arc(e, t, 0.7 * a, 0, 2 * Math.PI),
            m.fill();
        }
        if (
          ((m.globalCompositeOperation = "destination-in"),
          m.drawImage(t, 0, 0, 250, 250),
          (m.globalCompositeOperation = "destination-out"),
          m.drawImage(a, 0, 0, 250, 250),
          e.red)
        ) {
          const e = document.createElement("canvas");
          e.width = e.height = 250;
          const t = e.getContext("2d");
          (t.fillStyle = "rgba(225,70,70,.32)"),
            t.fillRect(0, 0, 250, 250),
            (t.strokeStyle = "rgba(200,20,20,.75)"),
            (t.lineWidth = 1),
            g.forEach((e) => {
              for (let a = 0; a < 6; a++) {
                const o = a % 2 ? 1 : -1,
                  n = r + d * (0.25 + 0.5 * h());
                t.beginPath(),
                  t.moveTo(e + o * c * 0.2, n),
                  t.quadraticCurveTo(
                    e + o * c * (0.12 + 0.05 * h()),
                    n + (h() - 0.5) * d * 0.4,
                    e + o * c * (0.05 + 0.05 * h()),
                    n + (h() - 0.5) * d * 0.3,
                  ),
                  t.stroke();
              }
            }),
            (t.globalCompositeOperation = "destination-in"),
            t.drawImage(a, 0, 0, 250, 250),
            n && ((t.globalCompositeOperation = "destination-out"), t.drawImage(n, 0, 0, 250, 250)),
            (m.globalCompositeOperation = "source-over"),
            m.drawImage(e, 0, 0);
        }
        return p;
      }
      const packHair = (e) =>
          e && (hairPackOn() || freeHair(e)) && HAIR_PACK.some((t) => t[0] === e) ? e : null,
        packHairName = (e) => (HAIR_PACK.find((t) => t[0] === e) || [, ""])[1],
        shade = (e, t) =>
          "#" +
          e
            .slice(1)
            .match(/../g)
            .map((e) =>
              Math.round(parseInt(e, 16) * t)
                .toString(16)
                .padStart(2, "0"),
            )
            .join(""),
        faceCache = {};
      async function composeFace(e, t, a = state.look, o = "m", n = null, s = {}) {
        noAccLife() && (n = eraAcc(n));
        const r = ("f" === o ? FACE_LAYERS_F : FACE_LAYERS)[e],
          i = (e) => e[a.seed % e.length],
          l = "f" === o ? "f-" : "",
          c = btShow || s.genes ? a : {},
          d =
            a === state.look && state.mod && state.mod.color ? state.mod.color : 5 === e ? "#c9c9c9" : a.hair,
          u = 5 === e ? "#9a9a9a" : shade(a.hair, 0.8),
          h = a === state.look && state.mod,
          p = (h && state.mod.skinColor) || a.skin,
          m = (h && state.mod.eyeColor) || a.eyes,
          f = r["lighting-" + t] ? "lighting-" + t : "happy" === t ? "lighting-happy" : "lighting-angry-sad",
          g =
            s.hair && r["hair-base"].includes(s.hair)
              ? s.hair
              : null != a.hairCut
                ? r["hair-base"][a.hairCut % r["hair-base"].length]
                : i(r["hair-base"]),
          y = r["hair-accessory-base"] || [],
          b = r["hair-accessory-lighting"] || [],
          v = [
            [`stage${e}-base`, p],
            [`stage${e}-eye-base`],
            [`stage${e}-iris-base`, m],
            [`stage${e}-iris-lighting`],
            [`stage${e}-${f}`],
            [
              `stage${e}-eyebrows-${t}${null != a.brow ? r["eyebrows-" + t][a.brow % r["eyebrows-" + t].length] : i(r["eyebrows-" + t])}`,
              u,
            ],
            (s.glasses ?? a.glasses) && r.glasses && r.glasses.length
              ? [
                  `stage${e}-glasses${r.glasses.includes(s.glasses ?? a.glasses) ? (s.glasses ?? a.glasses) : r.glasses.reduce((e, t) => (Math.abs(t - (s.glasses ?? a.glasses)) < Math.abs(e - (s.glasses ?? a.glasses)) ? t : e))}`,
                  "#1d1d1f",
                ]
              : null,
            (c.fur || a.beard) && r["facial-hair"]
              ? [`stage${e}-facial-hair${c.fur ? 7 : a.beard}`, d]
              : null,
            [`stage${e}-hair-base${g}`, d],
            r["hair-lighting"].includes(g) ? [`stage${e}-hair-lighting${g}`] : null,
            y.includes(g) ? [`stage${e}-hair-accessory-base${g}`] : null,
            b.includes(g) ? [`stage${e}-hair-accessory-lighting${g}`] : null,
            r["mouth-accessory-base"] ? [`stage${e}-mouth-accessory-base`] : null,
          ]
            .filter(Boolean)
            .map(([e, t]) => [l + e, t]),
          w = packHair(
            void 0 !== s.xHair
              ? s.xHair
              : s.hair
                ? null
                : a === state.look && state.mod
                  ? myXHair()
                  : a.xHair,
          );
        if (w) {
          const e = v.findIndex((e) => e[0].includes("-hair-base"));
          for (let e = v.length - 1; e >= 0; e--)
            /-hair-(base|lighting|accessory)/.test(v[e][0]) && v.splice(e, 1);
          HAIR_PACK.find((e) => e[0] === w)[2]
            ? v.splice(e, 0, [`hair/${w}-hair-base`])
            : v.splice(e, 0, [`hair/${w}-hair-base`, d], [`hair/${w}-hair-lighting`]);
        }
        if (n) {
          n.patch && n.eyewear && (n = { ...n, eyewear: null });
          const t = ACCESSORIES.eyeY[o][e],
            a = (n.eyewear && ACCESSORIES.eyewear.find((e) => e.id === n.eyewear)) || {},
            s = () => v.findIndex((e) => e[0].includes("-hair-base"));
          n.scar && v.splice(s(), 0, [`acc/${n.scar}`, null, t, { clip: !0 }]),
            n.patch && v.splice(s(), 0, [`acc/${n.patch}`, null, t, { clip: !0 }]),
            n.eyewear && v.splice(s(), 0, [`acc/${n.eyewear}`, null, t, a]),
            n.mask && v.push([`acc/${n.mask}`]),
            n.headwear && v.push([`acc/${n.headwear}`]);
        }
        const k = await Promise.all(v.map(([e]) => loadLayer(e))),
          $ = void 0 !== s.tats ? myTats({ tats: s.tats }) : myTats(a),
          S = (e) => v.findIndex((t) => t[0].endsWith(e)),
          x = v.findIndex((e) => e[0].includes("-eyebrows-"));
        window.FL_HAIRFIT && FL_HAIRFIT(v, k, e); // hairfit.js: keep pack hair on the head (follows head/eye position)
        let C =
          $ && k[S(`stage${e}-base`)] && k[S(`stage${e}-eye-base`)]
            ? await tattooLayer(
                $,
                k[S(`stage${e}-base`)],
                k[S(`stage${e}-eye-base`)],
                v[S(`stage${e}-eye-base`)][0],
                k[x],
                x >= 0 && v[x][0],
              )
            : null;
        if (a.faceTat && e >= 3 && k[S(`stage${e}-base`)] && k[S(`stage${e}-eye-base`)]) {
          const t = await faceTatLayer(
            a.faceTat,
            k[S(`stage${e}-base`)],
            k[S(`stage${e}-eye-base`)],
            v[S(`stage${e}-eye-base`)][0],
          );
          t && (C ? C.getContext("2d").drawImage(t, 0, 0) : (C = t));
        }
        if (a.addict && e >= 2 && k[S(`stage${e}-base`)] && k[S(`stage${e}-eye-base`)]) {
          const t = await addictLayer(
            a.addict,
            k[S(`stage${e}-base`)],
            k[S(`stage${e}-eye-base`)],
            v[S(`stage${e}-eye-base`)][0],
            k[S(`stage${e}-iris-base`)],
          );
          C ? C.getContext("2d").drawImage(t, 0, 0) : (C = t);
        }
        const I = document.createElement("canvas");
        I.width = I.height = 250;
        const T = I.getContext("2d"),
          A = document.createElement("canvas");
        A.width = A.height = 250;
        const M = A.getContext("2d");
        let L = null;
        const E = (t, a, o, n, s) => {
            if (null != n && s && s.clip) {
              const o = document.createElement("canvas");
              o.width = o.height = 250;
              const s = o.getContext("2d");
              return (
                s.drawImage(a, 0, n - a.height / 2),
                (s.globalCompositeOperation = "destination-in"),
                s.drawImage(
                  (() => {
                    if (L) return L;
                    (L = document.createElement("canvas")), (L.width = L.height = 250);
                    const t = L.getContext("2d");
                    return (
                      v.forEach(([a], o) => {
                        k[o] &&
                          (a.endsWith(`stage${e}-base`) || a.endsWith(`stage${e}-eye-base`)) &&
                          t.drawImage(k[o], 0, 0, 250, 250);
                      }),
                      L
                    );
                  })(),
                  0,
                  0,
                ),
                t.drawImage(o, 0, 0)
              );
            }
            if (null != n && s && s.glow) {
              const e = n - a.height / 2;
              t.save(), (t.shadowColor = s.glow);
              for (const o of [22, 10]) (t.shadowBlur = o), t.drawImage(a, 0, e);
              return t.restore(), t.drawImage(a, 0, e);
            }
            return null != n
              ? t.drawImage(a, 0, n - a.height / 2)
              : o
                ? ((M.globalCompositeOperation = "source-over"),
                  M.clearRect(0, 0, 250, 250),
                  M.drawImage(a, 0, 0, 250, 250),
                  (M.globalCompositeOperation = "source-in"),
                  (M.fillStyle = o),
                  M.fillRect(0, 0, 250, 250),
                  void t.drawImage(A, 0, 0))
                : t.drawImage(a, 0, 0, 250, 250);
          },
          H = n && n.headwear,
          R = H ? v.findIndex((e) => e[0] === `acc/${H}`) : -1,
          B = R >= 0 && k[R] && !/^headwear100(00[123]|10[123]|301)$/.test(H);
        let O = null,
          P = T;
        const Y = s.split ? [] : null;
        let N = null;
        const j = () => {
          if (O) {
            if (B) {
              const e = k[R],
                [, t, , a] = ACC_BOX[H] || [0, 0, 250, 120],
                o = document.createElement("canvas");
              o.width = o.height = 250;
              const n = o.getContext("2d");
              for (let t = 0; t <= 250; t += 4) n.drawImage(e, 0, -t, 250, 250);
              n.fillRect(0, 0, 250, t + 0.62 * (a - t));
              const s = O.getContext("2d");
              (s.globalCompositeOperation = "destination-out"), s.drawImage(o, 0, 0);
            }
            if (c.fur && !B) {
              const e = document.createElement("canvas");
              e.width = e.height = 250;
              const t = e.getContext("2d");
              t.drawImage(O, -14, -10, 278, 278), t.drawImage(O, 0, 0), (O = e);
            }
            Y ? (Y.push({ type: "hair", c: O }), (N = "hair")) : T.drawImage(O, 0, 0), (O = null);
          }
        };
        let J;
        return (
          v.forEach(([t, o, n, s], r) => {
            if (C && (t.includes(`stage${e}-lighting`) || t.includes("-eyebrows-"))) {
              if (Y) {
                Y.push({ type: "plain", c: C }), (N = "plain");
                const e = document.createElement("canvas");
                (e.width = e.height = 250), Y.push({ type: "plain", c: e }), (P = e.getContext("2d"));
              } else T.drawImage(C, 0, 0);
              C = null;
            }
            const i = k[r];
            if (i) {
              if (t.includes("-hair-"))
                return (
                  O || ((O = document.createElement("canvas")), (O.width = O.height = 250)),
                  E(O.getContext("2d"), i, o, n)
                );
              if ((j(), Y)) {
                const a = t.endsWith(`stage${e}-base`) ? "skin" : t.endsWith("-iris-base") ? "iris" : "plain";
                if (a !== N) {
                  const e = document.createElement("canvas");
                  (e.width = e.height = 250), Y.push({ type: a, c: e }), (N = a), (P = e.getContext("2d"));
                }
              }
              E(P, i, o, n, s),
                c.eye2 &&
                  t.endsWith("-iris-base") &&
                  (P.save(), P.beginPath(), P.rect(125, 0, 125, 250), P.clip(), E(P, i, c.eye2), P.restore()),
                c.fur && t.endsWith(`stage${e}-base`) && drawFur(P, i, d, a.seed),
                a.pox && t.endsWith(`stage${e}-base`) && drawPox(P, i, a.seed),
                a.pinkEye && t.endsWith(`stage${e}-eye-base`) && drawPinkEye(P, i, a.seed);
            }
          }),
          j(),
          Y ||
            ((J =
              a === state.look && window.FL_DRESS_JEWELRY
                ? await FL_DRESS_JEWELRY(I, {
                    stage: e,
                    g: o,
                    mood: t,
                    skin: p,
                    base: k[S(`stage${e}-base`)],
                    eyeY: (ACCESSORIES.eyeY[o] || [])[e],
                  })
                : I),
            c.twin ? twinFace(J) : J)
        );
      }
      const npcCache = {};
      [
        "Brown Cowboy Hat",
        "Black Studded Cowboy Hat",
        "Cream Lone Star Cowboy Hat",
        "Braided Brown Cowboy Hat",
        "Black Embroidered Cowboy Hat",
        "Straw Cowboy Hat",
        "Red Star Cowboy Hat",
        "Cream Rope Cowboy Hat",
        "Gunslinger Cowboy Hat",
        "Brown Buckle Cowboy Hat",
      ].forEach((e, t) => {
        ACCESSORIES.headwear.push({ id: `cowboy${t + 1}`, name: e }),
          (ACC_BOX[`cowboy${t + 1}`] = [
            [7, 0, 243, 129],
            [0, 0, 250, 127],
            [4, 0, 246, 131],
            [0, 0, 240, 129],
            [4, 0, 246, 121],
            [7, 0, 243, 128],
            [1, 0, 249, 127],
            [7, 0, 243, 131],
            [0, 0, 250, 129],
            [7, 0, 243, 131],
          ][t]);
      });
      const NPC_HATS = ACCESSORIES.headwear
          .filter((e) => /Baseball Cap|Beanie|Newsboy Cap|Bucket Hat|Fedora|Cowboy/.test(e.name))
          .map((e) => e.id),
        NPC_GLASSES = ACCESSORIES.eyewear
          .filter((e) => /Aviators|Round Glasses|Cat-Eye|Wayfarers|Oversized Shades/.test(e.name))
          .map((e) => e.id);
      ACCESSORIES.eyewear.unshift({
        id: "bitlifepp-aviators",
        name: "BitLife++ Aviators",
        strip: 120,
        glow: "rgba(255,24,24,.95)",
      }),
        ACCESSORIES.headwear.unshift({ id: "helmet-camo", name: "Camo Military Helmet" }),
        (ACC_BOX["helmet-camo"] = [11, 0, 240, 157]),
        ACCESSORIES.headwear.unshift({ id: "helmet-cartel", name: "Cartel Helmet" }),
        (ACC_BOX["helmet-cartel"] = [21, 0, 228, 146]);
      const landSoldier = () =>
          !(!mods.militaryExpanded || !state.job || ("Army" !== state.job.c && "Marines" !== state.job.c)),
        inMyUnit = (e) => {
          const t = state.job;
          return !!t && ((t.boss && t.boss.look === e) || (t.coworkers || []).some((t) => t.look === e));
        };
      (ACCESSORIES.scar = Array.from({ length: 75 }, (e, t) => ({
        id: `scar${t + 1}`,
        name: `Scar ${t + 1}`,
      }))),
        (ACCESSORIES.patch = [
          "Classic",
          "Black",
          "Brown Leather",
          "Gray",
          "Round Black",
          "Slate",
          "Red Leather",
          "White",
          "Skull & Crossbones",
          "Gold Trim",
          "Silver",
          "Tactical",
          "Matte Black",
          "Cross",
          "Chained",
          "Red X",
          "Belted",
          "Spiked",
          "Camo",
          "Red Flame",
          "Bandage",
          "Fur",
          "Cyborg",
        ].map((e, t) => ({ id: `patch${t}`, name: `${e} Eye Patch` })));
      const battleMarks = (e) => {
          if (!mods.battleScars) return {};
          const t = (t) => {
            let a = (2654435761 * e.seed + 974711 * t) >>> 0;
            return (
              (a ^= a >>> 16),
              (a = Math.imul(a, 2246822507) >>> 0),
              (a ^= a >>> 13),
              (a = Math.imul(a, 3266489909) >>> 0),
              (a ^= a >>> 16),
              (a >>> 0) / 4294967296
            );
          };
          return {
            scar: t(1) < 0.3 ? ACCESSORIES.scar[Math.floor(t(2) * ACCESSORIES.scar.length)].id : null,
            patch: t(3) < 0.08 ? ACCESSORIES.patch[Math.floor(t(4) * ACCESSORIES.patch.length)].id : null,
          };
        },
        isOldEra = () => "1800s" === state.era,
        MODERN_TEXT =
          /\b(cell ?phones?|smart ?phones?|i?phones?|texted|texting|texts? (?:from|you|me|him|her)|voicemail|internet|online|websites?|e-?mails?|inbox|computers?|laptops?|ipads?|video ?games?|gamers?|gaming|xbox|playstation|nintendo|consoles?|tv|television|netflix|streaming|youtube|tiktok|instagram|facebook|twitter|snapchat|social media|selfies?|influencers?|followers|viral|memes?|hashtags?|apps?|wi-?fi|gps|headphones|earbuds|ipods?|podcasts?|spotify|crypto|bitcoin|nfts?|vap(?:e|es|ing)|microwave|fridge|refrigerator|movie theaters?|cinema|movies?|airplanes?|planes?|airports?|cars?|trucks?|driver'?s license|uber|lyft|taxis?|fast food|mcdonald'?s|burger king|walmart|amazon|starbucks|google|malls?|credit cards?|debit cards?|atms?|venmo|paypal|cash app|zoom|covid|helicopters?|rockets?|astronauts?|nuclear|terrorists?|tasers?|911|police cars?|skateboards?|hoverboards?|drones?|robots?|karaoke|nightclubs?|hip[- ]hop|rappers?|dj|tinder|dating apps?|photoshop|elevators?|escalators?|parking lots?|gas stations?|highways?|freeways?|subways?|school bus|antibiotics|chemo(?:therapy)?|ultrasounds?|mri|ct scan|energy drinks?|antidepressants?|adderall|opioids?|meth|fentanyl|weed|marijuana|ecstasy|drug use|vaccines?|plastic surgery|tattoo parlou?r|gym|yoga|adhd|dating coach(?:es)?|prank calls?|high scores?|white powder|zelle|sleepovers?|stink bombs?|science lab|trampolines?|fake ids?|road trips?|proms?|startups?|sports cars?|pickleball|bingo|cruise ships?|senior cruise|hearing aids?|video|early bird special|science fairs?|talent shows?|field trips?|juice box(?:es)?|stickers?|soap operas?|therapists?|therapy|skydiv(?:e|ing)|bungee|cheerleaders?|homecoming|ice cream trucks?|sneakers|hoodies?|t-shirts?|flashlights?|radios?|stereos?|cds?|dvds?|vending machines?|calculators?|electric guitars?|garage band|frisbees?|water parks?|theme parks?|roller coasters?|arcades?|laser tag|paintball|mini ?golf|golf carts?|lottery tickets?|scratch[- ]offs?|hollywood|paparazzi|reality (?:tv|shows?)|rehab|x-?rays?|emergency room|dating apps?|swip(?:e|ed|ing) right|one night stand|playdates?|minivans?|suvs?|motorcycles?|selfie|blogs?|vlogs?|superheroes?|pokemon|lego|barbie|fidget spinners?|emojis?|bff|bestie|gym buddy|game consoles?|board game night|concert tickets|sold-out concert|bucket list|empty nest|midlife crisis|red sports car|class reunion|high school reunion|nursing homes?|senior living|wheelchair van|cable|remote control|air condition(?:er|ing)|plastic|batteries|carpool|traffic jam|parking ticket|speeding ticket|pinterest|group chats?|youtubers?|parking tickets|las vegas|canc[uú]n|maldives|bora bora|daycare|strollers?|microchips?|talk shows?|guinness world|wiretaps?|the dea|secret service|drive-thru|doorbell cameras?|security cameras?|scratch tickets?|detention center|juvie|custody hearing|self-help|airbnb|filmed you|posted it online|blocked your number|music too loud|road rage|tailgat(?:e|ed|ing)|animal control|headshots?|box office|pizza|money market|apy)\b/i,
        ERA_OK = [
          [
            1900,
            "phones?|cars?|trucks?|elevators?|escalators?|batteries|flashlights?|x-?rays?|subways?|roller coasters?",
          ],
          [1903, "airplanes?|planes?"],
          [1905, "movies?|movie theaters?|cinema"],
          [
            1910,
            "driver'?s license|taxis?|highways?|motorcycles?|gas stations?|traffic jam|hollywood|parking tickets?|speeding ticket|police cars?|airports?",
          ],
          [
            1920,
            "radios?|cheerleaders?|homecoming|school bus|parking lots?|road trips?|proms?|field trips?|talent shows?|refrigerator|fridge|vending machines?|mini ?golf|nightclubs?|box office",
          ],
          [1930, "soap operas?|bingo|pizza|lottery tickets?"],
          [1939, "tv|television"],
          [1940, "helicopters?|antibiotics|nuclear|rockets?|science fairs?|vaccines?|plastic"],
          [
            1950,
            "credit cards?|fast food|mcdonald'?s|malls?|drive-thru|sleepovers?|frisbees?|remote control|air condition(?:er|ing)|stereos?|theme parks?|ice cream trucks?|dj|therapy|therapists?",
          ],
          [1960, "astronauts?|skateboards?|lego|barbie|yoga|electric guitars?|cable"],
          [1970, "video ?games?|arcades?|computers?|atms?|gym|calculators?|cds?"],
          [1975, "video"],
          [1980, "nintendo|minivans?|laser tag|cell ?phones?|karaoke|headphones"],
          [1990, "internet|online|websites?|e-?mails?|laptops?|dvds?|pokemon|playstation|suvs?"],
        ].map(([e, t]) => [e, new RegExp(`\\b(?:${t})\\b`, "gi")]),
        isModernText = (e) => {
          if (!isOldEra()) return !1;
          let t = String(e || "").replace(/<[^>]+>/g, " ");
          const a = state && null != state.birthYear ? state.birthYear + state.age : 0;
          for (const [e, o] of ERA_OK) a >= e && (t = t.replace(o, " "));
          return MODERN_TEXT.test(t);
        },
        ERA_FX = { "£": 4.87 },
        cents = (e) => Math.round(100 * e) / 100,
        eraCash = (e) => {
          if (!isOldEra()) return e;
          const t = e / (ERA_FX[cur()] || 1);
          return Math.abs(t) >= 20 ? Math.round(t) : cents(t);
        },
        noAccLife = () =>
          isOldEra() || !(!state.cartel || !state.cartel.active) || !(!state.mafia || !state.mafia.active),
        MODERN_JOB =
          /Animat|Auto Mechanic|Auto Shop|Car Dealer|Car Wash|Telemarket|Call Center|Truck|Electric|Makeup Artist|Nail Tech|Engineer I+\b|Engineering|Biotech|Microbiolog|Analyst|Database|Computer|App Developer|Web Developer|IT Support|Technical Support|Tech Teacher|Graphic Designer|Interior Designer|Pilot|Airline|Airport|Flight Attendant|Baggage|Crime Scene|Forensic|Plastic Surgeon|Chiropractor|Physical Therapist|Psycholog|Mental Health|Marriage Counselor|Dental Hygienist|Environmental Scientist|Marine Biologist|Cameraman|Television|Film Studio|Voice ?[Oo]ver|Stunt|Disk Jockey|\bDJ\b|Exotic Dancer|Stripper|Strip Club|Porn|Adult Film|Modeling Agency|Mall|Water Slide|Water Park|Porta Potty|Lobbyist|Personal Trainer|Fitness|Yoga|Gym|PR Assistant|Public Relations|Communications Director|Cat Behavior|Bus Driver|Transit Authority|Ride Sharing|Rideshare|Wedding Planner|Background Vocalist|Record Label|Video|Beta Tester|Kiosk|Brand Ambassador|Pool|Grocery Bagger|Bike Shop|Arcade|Barista|Coffee Shop|Concessions|Movie Theater|Laser Tag|Social Media|Amusement Park|Product Tester|Armpit|Deodorant|Mystery Shopper|Survey Taker|Collections Specialist|Resident Assistant|Sign Holder|Lifeguard|Fast Food|Trooper|Roadkill|Space Agency|(Grocery|Food) Delivery|Car Washer|Mobile Mechanic/,
        eraJobOk = (e) =>
          !isOldEra() ||
          !!e.from ||
          !MODERN_JOB.test(`${e.t}|${e.c || ""}|${e.emp || ""}`) ||
          /Composer|Singer/.test(e.t),
        ACADEMIC = [
          "Philosophy",
          "History",
          "Literature",
          "Classical Studies",
          "Mathematics",
          "Natural Philosophy",
        ],
        OLD_REQ = {
          Doctor: { deg: ["Medicine"], label: "Medicine degree" },
          Surgeon: { deg: ["Medicine"], label: "Medicine degree" },
          Lawyer: { deg: ["Law"], label: "Law degree" },
          Priest: { deg: ["Theology"], label: "Theology degree" },
          Clergyman: { deg: ["Theology"], label: "Theology degree" },
          "Civil Engineer": { deg: ["Engineering"], label: "Engineering degree" },
          Scientist: {
            deg: ["Natural Philosophy", "Chemistry"],
            label: "Natural Philosophy or Chemistry degree",
          },
          Surveyor: { deg: ["Mathematics", "Engineering"], label: "Mathematics or Engineering degree" },
          Architect: { deg: ["Architecture"], label: "Architecture degree" },
          Dentist: { deg: ["Dentistry"], label: "Dentistry degree" },
          Pharmacist: { deg: ["Pharmacy", "Chemistry"], label: "Pharmacy or Chemistry degree" },
          "Veterinary Surgeon": { deg: ["Veterinary Medicine"], label: "Veterinary Medicine degree" },
          Chemist: { deg: ["Chemistry"], label: "Chemistry degree" },
          "Agricultural Specialist": { deg: ["Agriculture"], label: "Agriculture degree" },
          Historian: { deg: ["History"], label: "History degree" },
          Professor: { deg: ACADEMIC, label: "Degree in an academic subject" },
          Lecturer: { deg: ACADEMIC, label: "Degree in an academic subject" },
          Tutor: {
            deg: ["Classical Studies", "Literature", "Philosophy", "History", "Mathematics"],
            label: "Classics, Literature, Philosophy, History or Mathematics degree",
          },
          Schoolteacher: { teach: !0, label: "Teacher training or a university degree" },
          "Bounty Hunter": { horse: "ride", label: "Must own a riding horse" },
          Farmer: { horse: "work", label: "Must own a workhorse" },
          "Cave Miner": { pick: !0, label: "Must own a pickaxe" },
          ...Object.fromEntries(
            ["Blacksmith", "Carpenter", "Tailor", "Cobbler", "Printer", "Midwife", "Baker"].map((e) => [
              e,
              { appr: e, label: `${e} apprenticeship` },
            ]),
          ),
        },
        OLD_JOBS = [
          ["Washerwoman", "emoji/1f9fa.png", 100, 10, "poor"],
          ["Chimney Sweep", "emoji/1f9f9.png", 60, 8, "poor"],
          ["Seamstress", "job-emoji/thread.png", 100, 12, "poor"],
          ["Housemaid", "emoji/1f9fc.png", 90, 12, "poor"],
          ["Farm Hand", "job-emoji/cow.png", 160, 10, "poor"],
          ["Shepherd", "2018/emoji/1f411.png", 150, 10, "poor"],
          ["Stable Hand", "2018/emoji/1f434.png", 150, 12, "poor"],
          ["Fisherman", "job-emoji/fish.png", 200, 14, "poor"],
          ["Servant", "job-emoji/broom.png", 120, 12, "poor"],
          ["Dock Worker", "emoji/2693.png", 300, 14, "poor"],
          ["Soldier", "freelife/apple/2694-fe0f.png", 156, 17, "poor"],
          ["Carpenter", "job-emoji/hammer.png", 450, 16, "middle"],
          ["Factory Worker", "emoji/2699-fe0f.png", 250, 10, "poor"],
          ["Lumberjack", "job-emoji/axe.png", 260, 16, "poor"],
          ["Baker", "job-emoji/croissant.png", 350, 16, "middle"],
          ["Tavern Keeper", "emoji/1f37a.png", 400, 18, "middle"],
          ["Coal Miner", "emoji/1f56f-fe0f.png", 300, 12, "poor"],
          ["Tailor", "emoji/2702-fe0f.png", 350, 16, "middle"],
          ["Blacksmith", "emoji/1f528.png", 450, 16, "middle"],
          ["Schoolteacher", "job-emoji/books.png", 300, 18, "middle"],
          ["Constable", "emoji/1f46e.png", 500, 18, "middle"],
          ["Shopkeeper", "emoji/1f3ea.png", 600, 18, "middle"],
          ["Clerk", "emoji/1f4dc.png", 500, 16, "middle"],
          ["Priest", "emoji/26ea.png", 400, 21, "middle"],
          ["Doctor", "emoji/1fa7a.png", 1200, 21, "rich"],
          ["Lawyer", "emoji/2696-fe0f.png", 1500, 21, "rich"],
          ["Merchant", "emoji/1f4b0.png", 2500, 16, "rich"],
          ["Banker", "emoji/1f3e6.png", 3e3, 21, "rich"],
          ["Cobbler", "emoji/1f9f5.png", 300, 16, "middle"],
          ["Printer", "emoji/1f4f0.png", 450, 16, "middle"],
          ["Midwife", "freelife/apple/1f469-200d-2695-fe0f.png", 200, 18, "middle"],
          ["Farmer", "2018/emoji/1f33d.png", 400, 16, "middle"],
          ["Railway Worker", "job-emoji/roadwork.png", 350, 15, "poor"],
          ["Sailor", "job-emoji/boat.png", 180, 13, "poor"],
          ["Bounty Hunter", "hunt/lever.png", 400, 18, "poor"],
          ["Cave Miner", "mining/pick2.png", 350, 14, "poor"],
          ["Surgeon", "emoji/1fa7a.png", 1800, 23, "rich"],
          ["Clergyman", "emoji/26ea.png", 600, 21, "middle"],
          ["Civil Engineer", "job-emoji/roadwork.png", 1500, 21, "rich"],
          ["Scientist", "emoji/1f52c.png", 900, 21, "middle"],
          ["Surveyor", "emoji/1f4d0.png", 700, 20, "middle"],
          ["Architect", "emoji/1f3db-fe0f.png", 1500, 21, "rich"],
          ["Dentist", "job-emoji/tooth.png", 1e3, 21, "middle"],
          ["Pharmacist", "emoji/1f48a.png", 700, 20, "middle"],
          ["Veterinary Surgeon", "2018/emoji/1f434.png", 700, 21, "middle"],
          ["Professor", "emoji/1f393.png", 1500, 25, "rich"],
          ["Lecturer", "emoji/1f4da.png", 900, 22, "middle"],
          ["Chemist", "freelife/apple/2697-fe0f.png", 800, 21, "middle"],
          ["Agricultural Specialist", "2018/emoji/1f33d.png", 600, 20, "middle"],
          ["Historian", "emoji/1f4dc.png", 600, 21, "middle"],
          ["Tutor", "emoji/1f4d6.png", 400, 19, "middle"],
        ].map(([e, t, a, o, n]) => ({
          t: e,
          img: t,
          pay: a,
          minAge: o,
          cls: n,
          c: "Trade",
          emp: "Local Employer",
          edu: (OLD_REQ[e] || {}).label || "None",
          req: OLD_REQ[e] || null,
          old: !0,
        })),
        OLD_JOB_TO = {
          "Chimney Sweep": 1935,
          Washerwoman: 1945,
          "Stable Hand": 1950,
          "Bounty Hunter": 1912,
          Servant: 1950,
          Blacksmith: 1955,
          "Cave Miner": 1940,
          Midwife: 1960,
          Shepherd: 1960,
          Tutor: 1950,
        };
      OLD_JOBS.forEach((e) => {
        OLD_JOB_TO[e.t] && (e.to = OLD_JOB_TO[e.t]);
      });
      const NEW_JOBS_1900 = [
          ["Telephone Operator", "1f4de", 280, 16, "poor", 1880, 1975],
          ["Typist", "2328-fe0f", 380, 16, "middle", 1885],
          ["Stenographer", "1f4dd", 450, 17, "middle", 1890],
          ["Streetcar Conductor", "1f68c", 420, 18, "poor", 1890, 1955],
          ["Electrician", "26a1", 650, 18, "middle", 1890],
          ["Lineman", "1f50c", 520, 18, "poor", 1890],
          ["Steelworker", "1f3ed", 480, 16, "poor", 1890],
          ["Plumber", "1f6bf", 560, 18, "middle", 1895],
          ["Nurse", "1f469-200d-2695-fe0f", 400, 18, "middle", 1890],
          ["Photographer", "1f4f8", 500, 18, "middle", 1890],
          ["Newspaper Reporter", "1f4f0", 480, 18, "middle", 1890],
          ["Accountant", "1f4c8", 900, 21, "middle", 1895],
          ["Insurance Salesman", "1f4b5", 700, 18, "middle", 1895],
          ["Elevator Operator", "1f6d7", 260, 16, "poor", 1900, 1975],
          ["Milkman", "1f95b", 300, 16, "poor", 1900, 1980],
          ["Iceman", "1f9ca", 280, 16, "poor", 1900, 1950],
          ["Hotel Bellhop", "1f3e8", 240, 15, "poor", 1900],
          ["Auto Mechanic", "1f468-200d-1f527", 550, 17, "middle", 1905],
          ["Chauffeur", "1f697", 480, 18, "middle", 1905, 1960],
          ["Movie Projectionist", "1f3ac", 400, 17, "middle", 1908],
          ["Film Actor", "1f3ad", 900, 18, "middle", 1910],
          ["Soda Jerk", "1f366", 200, 14, "poor", 1910, 1970],
          ["Radio Operator", "1f4fb", 520, 18, "middle", 1912],
          ["Assembly Line Worker", "1f527", 600, 17, "poor", 1913],
          ["Aviator", "2708-fe0f", 1600, 21, "rich", 1915],
          ["Truck Driver", "1f69a", 480, 18, "poor", 1915],
          ["Gas Station Attendant", "26fd", 300, 16, "poor", 1915],
          ["Bus Driver", "1f68c", 460, 18, "poor", 1920],
          ["Construction Foreman", "1f3d7-fe0f", 800, 21, "middle", 1920],
          ["Radio Announcer", "1f4fb", 1e3, 20, "middle", 1922],
          ["Flight Attendant", "2708-fe0f", 650, 20, "middle", 1930],
          ["Airline Pilot", "2708-fe0f", 2200, 23, "rich", 1930],
          ["Television Repairman", "1f4fa", 700, 18, "middle", 1948],
          ["Computer Programmer", "1f4bb", 1600, 21, "rich", 1955],
          ["Rocket Engineer", "1f680", 2600, 23, "rich", 1955],
        ].map(([e, t, a, o, n, s, r]) => ({
          t: e,
          img: `freelife/apple/${t}.png`,
          pay: a,
          minAge: o,
          cls: n,
          from: s,
          to: r,
          c: "Trade",
          emp: "Local Employer",
          edu: "None",
          req: null,
          old: !0,
        })),
        oldWageScale = () => Math.max(1, eraLvl() / 0.0075),
        oldWage = (e) => eraCash(e * oldWageScale());
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (state.dead || !isOldEra()) return;
        const e = eraLvl(),
          t = state.eraLvlSeen;
        if (((state.eraLvlSeen = e), !(!t || e <= t || state.birthYear + state.age < 1900)))
          for (const a of [state.job, state.partJob]) a && a.pay > 0 && (a.pay = cents((a.pay * e) / t));
      });
      const oldJobsNow = () => {
          const e = state.birthYear + state.age;
          return [...OLD_JOBS, ...NEW_JOBS_1900].filter((t) => (t.from || 0) <= e && (!t.to || e <= t.to));
        },
        OLD_EMP = {
          "Farm Hand": "Estate",
          Shepherd: "Farm",
          "Stable Hand": "Stables",
          Servant: "Household",
          Housemaid: "Household",
          "Factory Worker": "Mill",
          "Coal Miner": "Colliery",
          "Dock Worker": "Shipping Co.",
          Soldier: "Regiment",
          Lumberjack: "Timber Co.",
          Clerk: "& Sons",
          Banker: "Bank",
          Merchant: "Trading Co.",
          Lawyer: "& Partners",
          Printer: "Print Works",
          "Railway Worker": "Railway Company",
          Sailor: "Shipping Line",
          "Bounty Hunter": "Sheriff's Office",
          "Cave Miner": "Mining Co.",
          Doctor: "Infirmary",
          Surgeon: "Infirmary",
          "Civil Engineer": "Engineering Works",
          Architect: "& Associates",
          Professor: "College",
          Lecturer: "College",
          Scientist: "Laboratory",
          Chemist: "Apothecary",
          Pharmacist: "Apothecary",
          Dentist: "Dental Rooms",
          Surveyor: "Survey Office",
          Priest: "Parish",
          Clergyman: "Parish",
          Farmer: "Farm",
          Midwife: "Parish",
        },
        OLD_PART = [
          ["Newsboy", "emoji/1f4f0.png", 30, 8, "Newspaper", "Gazette", 1833],
          ["Bootblack", "freelife/apple/1f45e.png", 35, 8, "Street Trade", "Shoeshine Stand", 1800],
          ["Errand Runner", "freelife/apple/1f4e6.png", 25, 8, "Shop", "Dry Goods Store", 1800],
          [
            "Telegraph Messenger",
            "freelife/apple/1f4e8.png",
            45,
            12,
            "Telegraph Office",
            "Telegraph Office",
            1846,
          ],
          ["Stable Helper", "2018/emoji/1f434.png", 30, 10, "Livery Stable", "Livery Stable", 1800],
          ["Bobbin Doffer", "freelife/apple/1f9f6.png", 50, 10, "Textile Mill", "Mill", 1814],
          ["Shop Sweeper", "emoji/1f9f9.png", 25, 9, "Shop", "General Store", 1800],
          ["Harvest Helper", "job-emoji/cow.png", 30, 8, "Farm", "Farm", 1800],
          ["Lamplighter", "emoji/1f56f-fe0f.png", 60, 14, "Town", "Gas Works", 1820],
          ["Grocer's Delivery Boy", "emoji/1f9fa.png", 35, 11, "Grocer", "Grocery", 1800],
          ["Iceman's Helper", "freelife/apple/1f9ca.png", 40, 12, "Ice House", "Ice Company", 1820],
          ["Nursemaid", "freelife/apple/1f37c.png", 30, 12, "Household", "Household", 1800],
          ["Laundry Helper", "emoji/1f9fc.png", 25, 10, "Laundry", "Laundry", 1800],
          ["Printer's Devil", "emoji/1f4f0.png", 40, 12, "Print Shop", "Print Works", 1800],
          ["Scullery Maid", "freelife/apple/1f37d-fe0f.png", 30, 11, "Household", "Household", 1800],
          ["Milk Delivery Boy", "freelife/apple/1f95b.png", 30, 10, "Dairy", "Dairy", 1800],
          ["Woodpile Splitter", "freelife/apple/1fab5.png", 25, 10, "Odd Jobs", "Woodyard", 1800],
          ["Rag Picker", "job-emoji/broom.png", 15, 7, "Street Trade", "Rag Shop", 1800],
        ].map(([e, t, a, o, n, s, r]) => ({
          t: e,
          img: t,
          pay: a,
          minAge: o,
          c: n,
          empSuffix: s,
          from: r,
          edu: "None",
          old: !0,
          part: !0,
        })),
        oldEmpFor = (e) =>
          e.part
            ? `The ${any(LAST)} ${e.empSuffix}`
            : "Soldier" === e.t
              ? `The ${pickR(["Royal", "King's", "Queen's", "1st", "4th", "9th"])} Regiment`
              : `The ${any(LAST)} ${OLD_EMP[e.t] || "Shop"}`,
        OLD_CLASS_JOBS = {
          poor: ["Unemployed", ...OLD_JOBS.filter((e) => "poor" === e.cls).map((e) => e.t)],
          middle: OLD_JOBS.filter((e) => "middle" === e.cls).map((e) => e.t),
          rich: ["Landowner", "Factory Owner", ...OLD_JOBS.filter((e) => "rich" === e.cls).map((e) => e.t)],
        },
        OLD_CLASS_MONEY = {
          poor: () => eraCash(rint(0, 30)),
          middle: () => eraCash(rint(100, 800)),
          rich: () => eraCash(rint(5e3, 6e4)),
        },
        oldEraNo = (e) => notice("Not invented yet", `There's no ${e} in the 1800s.`, null, !0),
        eraAcc = (e) => {
          if (!isOldEra() || !e) return null;
          const t = /^cowboy\d+$/.test(e.headwear || "") ? e.headwear : null;
          return t || e.scar || e.patch
            ? { eyewear: null, headwear: t, mask: null, scar: e.scar || null, patch: e.patch || null }
            : null;
        },
        wornAcc = () => {
          if (noAccLife()) return eraAcc(state.acc);
          if (
            (landSoldier() ||
              !!(mods.militaryExpanded && state.veteran && /^(Army|Marines)$/.test(state.veteran.branch))) &&
            mods.battleScars &&
            !state.battleMarked
          ) {
            state.battleMarked = !0;
            const e = battleMarks(state.look);
            e.scar && !state.acc.scar && (state.acc.scar = e.scar),
              e.patch && !state.acc.patch && (state.acc.patch = e.patch);
          }
          const e =
            modFlag("allAccessories") || mods.battleScars
              ? state.acc
              : { ...state.acc, scar: null, patch: null };
          if (landSoldier()) return { ...e, headwear: "helmet-camo" };
          const t = state.royal;
          return !t || t.abdicated || e.headwear ? e : { ...e, headwear: royCrown(t.rank, PG()) };
        };
      function npcAcc(e, t) {
        if (e === state.look) return wornAcc();
        if (noAccLife()) {
          if (!isOldEra() || t < 2 || 1 === e.accRoll || (window.blSettings && !blSettings.npcAcc))
            return null;
          null == e.accRoll && ((e.accRoll = Math.random()), (e.hatRoll = Math.random())),
            null == e.scarRoll && (e.scarRoll = Math.random());
          const a = e.hatRoll < 0.3 ? "cowboy" + (1 + (e.seed % 10)) : null,
            o =
              t >= 3 && e.scarRoll < 0.1
                ? ACCESSORIES.scar[Math.floor((e.scarRoll / 0.1) * ACCESSORIES.scar.length)].id
                : null;
          return a || o ? { eyewear: null, headwear: a, mask: null, scar: o, patch: null } : null;
        }
        if (e.crown) return { eyewear: null, headwear: e.crown, mask: null, scar: null, patch: null };
        if (t < 2) return null;
        if (e.npcAcc) return e.npcAcc;
        if (e.milHat || e.milScar)
          return {
            eyewear: null,
            headwear: e.milHat ? "helmet-camo" : null,
            mask: null,
            scar: e.milScar || null,
            patch: null,
          };
        if (window.blSettings && !blSettings.npcAcc) return null;
        null == e.accRoll && ((e.accRoll = Math.random()), (e.hatRoll = Math.random()));
        const a = e.accRoll < (5 === t ? 0.4 : 0.18) ? NPC_GLASSES[e.seed % NPC_GLASSES.length] : null,
          o = landSoldier() && inMyUnit(e),
          n = o
            ? "helmet-camo"
            : e.hatRoll < (5 === t ? 0.1 : 0.16)
              ? NPC_HATS[(7 * e.seed) % NPC_HATS.length]
              : null,
          s = o ? battleMarks(e) : {},
          r = s.patch || null;
        null == e.scarRoll && (e.scarRoll = Math.random());
        const i =
          s.scar ||
          (t >= 3 && 1 !== e.accRoll && e.scarRoll < 0.08
            ? ACCESSORIES.scar[Math.floor((e.scarRoll / 0.08) * ACCESSORIES.scar.length)].id
            : null);
        return a || n || i || r ? { eyewear: a, headwear: n, mask: null, scar: i, patch: r } : null;
      }
      const is2018 = () => document.querySelector(".phone").classList.contains("y2018"),
        oldFaceSrc = (e, t) =>
          `2018/emoji/${t < 4 ? "1f476" : t < 13 ? ("f" === e ? "1f467" : "1f466") : t < 60 ? ("f" === e ? "1f469" : "1f468") : "f" === e ? "1f475" : "1f474"}.png`,
        oldFaceImgs = {},
        drawOldFace = (e, t, a) => {
          const o = oldFaceSrc(t, a),
            n = (oldFaceImgs[o] ||= Object.assign(new Image(), { src: o })),
            s = () => {
              const t = e.getContext("2d");
              t.clearRect(0, 0, 250, 250), t.drawImage(n, 25, 25, 200, 200);
            };
          n.complete ? s() : n.addEventListener("load", s, { once: !0 });
        };
      function npcFace(e, t, a, o = "happy", n = "") {
        const s = stage(a),
          r = npcAcc(e, s),
          i =
            JSON.stringify(e) +
            t +
            s +
            o +
            JSON.stringify(r) +
            btShow +
            (e === state.look ? myXHair() + tatKey(e) + (window.FL_JEWEL_KEY ? window.FL_JEWEL_KEY() : "") : tatKey(e) + (e.xHair ? packHair(e.xHair) : "")),
          l = document.createElement("canvas");
        return (
          (l.width = l.height = 250),
          n && (l.className = n),
          is2018()
            ? (drawOldFace(l, t, a), l)
            : ((npcCache[i] ||= composeFace(s, o, e, t, r)).then((e) =>
                l.getContext("2d").drawImage(e, 0, 0),
              ),
              l)
        );
      }
      state.mod = {
        style: null,
        xHair: null,
        effect: "none",
        color: null,
        eyeColor: null,
        skinColor: null,
        eyeFx: "none",
        skinFx: "none",
      };
      const myXHair = () => packHair(state.mod.xHair || (null == state.mod.style ? state.look.xHair : null)),
        dyeKey = () =>
          [
            state.mod.color,
            state.mod.eyeColor,
            state.mod.skinColor,
            state.look.hairCut,
            state.look.glasses,
            state.look.brow,
            myXHair(),
            tatKey(state.look),
            state.look.faceTat || "",
          ].join(","),
        HAIR_FX = [
          ["none", "Normal", "Your natural hair"],
          ["rainbow", "RGB Rainbow", "Cycles through every color"],
          ["lava", "Lava", "Molten, glowing and bubbling"],
          ["water", "Water", "Rippling ocean waves"],
          ["fade", "Disappearing", "Vanishes and comes back"],
          ["huge", "Overly Large", "Way too much hair"],
          ["tiny", "Tiny", "A miniature hairdo"],
          ["gold", "Solid Gold", "Shiny 24-karat hair"],
          ["neon", "Neon Glow", "Glows in changing neon colors"],
          ["ghost", "Ghost", "Spooky see-through floating hair"],
          ["glitch", "Glitch", "Corrupted and twitchy"],
          ["galaxy", "Galaxy", "A night sky full of stars"],
          ["frozen", "Frozen", "Icy and sparkling"],
          ["bouncy", "Bouncy", "Boings up and down"],
          ["spin", "Helicopter", "Spins around your head"],
          ["bald", "Bald", "No hair at all"],
        ],
        HAIR_THEMES = [
          ["Sunset", ["#ffcf5c", "#ff7e5f", "#c0392b"]],
          ["Ocean", ["#a8edea", "#2193b0", "#0b3d91"]],
          ["Mint", ["#e0fff4", "#3ee6a8", "#0f9d75"]],
          ["Cotton Candy", ["#ffd1f0", "#f78fd6", "#9bd3ff"]],
          ["Toxic", ["#f4ff61", "#7cff00", "#1c8c00"]],
          ["Blood Moon", ["#ff6b6b", "#b3001b", "#3d0008"]],
          ["Chrome", ["#ffffff", "#b8c2cc", "#59636e"]],
          ["Bronze", ["#f3c28b", "#b0703b", "#5c3317"]],
          ["Emerald", ["#a7f3c1", "#10b960", "#05522b"]],
          ["Ruby", ["#ff9aa8", "#e0115f", "#6d0028"]],
          ["Sapphire", ["#a9c7ff", "#1f5bd8", "#0a1f66"]],
          ["Amethyst", ["#e2c6ff", "#9b4dff", "#3d0f73"]],
          ["Pastel", ["#ffe3ec", "#d6f0ff", "#e8ffd6"]],
          ["Cyberpunk", ["#00f0ff", "#ff00c8", "#3a00ff"]],
          ["Aurora", ["#7bffb2", "#43c6ff", "#b56bff"]],
          ["Peach", ["#ffe5c4", "#ffb38a", "#ff8160"]],
          ["Midnight", ["#4a5bd4", "#1a1f5e", "#05061a"]],
          ["Lemonade", ["#fffbd1", "#ffe74c", "#ff9f1c"]],
          ["Bubblegum", ["#ffc8f2", "#ff6ec7", "#c2187a"]],
          ["Forest", ["#c9e79a", "#4d8b31", "#1f3d12"]],
        ],
        HAIR_ANIMS = [
          ["Shimmer", "flowing colors"],
          ["Pulse", "breathing glow"],
          ["Sparkle", "twinkling glitter"],
          ["Wave", "rippling strands"],
          ["Stripes", "moving candy stripes"],
        ];
      function customHairFx(e, t, a, o, n) {
        const s = HAIR_THEMES[o][1],
          r = (e, t = 0) => {
            const a = e.createLinearGradient(0, -t, 0, 250 - t);
            return s.concat(s[0]).forEach((e, t, o) => a.addColorStop(t / (o.length - 1), e)), a;
          };
        if (0 === n)
          return e.drawImage(
            paintHair(
              t,
              (e) => {
                (e.fillStyle = r(e, (60 * a) % 250)), e.fillRect(0, -250, 250, 750);
              },
              0.2,
            ),
            0,
            0,
          );
        if (1 === n)
          return (
            (e.shadowColor = s[1]),
            (e.shadowBlur = 8 + 10 * (Math.sin(3 * a) + 1)),
            e.drawImage(
              paintHair(
                t,
                (e) => {
                  (e.fillStyle = r(e)), e.fillRect(0, 0, 250, 250);
                },
                0.15 + 0.15 * Math.sin(3 * a),
              ),
              0,
              0,
            )
          );
        if (2 === n)
          return e.drawImage(
            paintHair(
              t,
              (e) => {
                (e.fillStyle = r(e)), e.fillRect(0, 0, 250, 250);
                for (let t = 0; t < 30; t++) {
                  const o = (Math.sin(4 * a + 1.9 * t) + 1) / 2;
                  (e.fillStyle = `rgba(255,255,255,${o})`), e.fillRect((61 * t) % 250, (37 * t) % 160, 3, 3);
                }
              },
              0.2,
            ),
            0,
            0,
          );
        if (3 !== n)
          e.drawImage(
            paintHair(
              t,
              (e) => {
                const t = (40 * a) % 40;
                for (let a = -260; a < 520; a += 40)
                  (e.fillStyle = s[((a + 260) / 40) % s.length | 0]),
                    e.beginPath(),
                    e.moveTo(a + t, 0),
                    e.lineTo(a + t + 20, 0),
                    e.lineTo(a + t + 20 - 250, 250),
                    e.lineTo(a + t - 250, 250),
                    e.fill();
              },
              0.2,
            ),
            0,
            0,
          );
        else {
          const o = paintHair(
            t,
            (e) => {
              (e.fillStyle = r(e)), e.fillRect(0, 0, 250, 250);
            },
            0.2,
          );
          for (let t = 0; t < 250; t += 4)
            e.drawImage(o, 0, t, 250, 4, 4 * Math.sin(4 * a + t / 10), t, 250, 4);
        }
      }
      HAIR_THEMES.forEach(([e, t], a) =>
        HAIR_ANIMS.forEach(([t, o], n) =>
          HAIR_FX.push([`c:${a}:${n}`, `${e} ${t}`, `Custom: ${e.toLowerCase()} colors, ${o}`]),
        ),
      );
      const fxTmp = document.createElement("canvas");
      fxTmp.width = fxTmp.height = 250;
      const fxg = fxTmp.getContext("2d"),
        paintHair = (e, t, a = 0.35) => (
          (fxg.globalCompositeOperation = "source-over"),
          (fxg.globalAlpha = 1),
          fxg.clearRect(0, 0, 250, 250),
          fxg.drawImage(e, 0, 0),
          (fxg.globalCompositeOperation = "source-atop"),
          (fxg.globalAlpha = 1 - a),
          t(fxg),
          (fxg.globalAlpha = 1),
          (fxg.globalCompositeOperation = "source-over"),
          fxTmp
        ),
        vGrad = (e, t = 0, a = 250) => {
          const o = fxg.createLinearGradient(0, t, 0, a);
          return e.forEach(([e, t]) => o.addColorStop(e, t)), o;
        };
      function drawHairFx(e, t, a, o) {
        const n = a / 1e3;
        switch ((e.save(), o)) {
          case "bald":
            break;
          case "rainbow":
            e.drawImage(
              paintHair(
                t,
                (e) => {
                  const t = e.createLinearGradient(0, 0, 250, 250);
                  for (let e = 0; e <= 6; e++)
                    t.addColorStop(e / 6, `hsl(${(120 * n + 60 * e) % 360},100%,55%)`);
                  (e.fillStyle = t), e.fillRect(0, 0, 250, 250);
                },
                0.15,
              ),
              0,
              0,
            );
            break;
          case "lava":
            (e.shadowColor = `rgba(255,${90 + 60 * Math.sin(6 * n)},0,.9)`),
              (e.shadowBlur = 14 + 6 * Math.sin(4 * n)),
              e.drawImage(
                paintHair(
                  t,
                  (e) => {
                    const t = (40 * n) % 60;
                    (e.fillStyle = vGrad(
                      [
                        [0, "#ffe066"],
                        [0.35, "#ff7b00"],
                        [0.7, "#d81e00"],
                        [1, "#5a0a00"],
                      ],
                      -t,
                      250 - t,
                    )),
                      e.fillRect(0, 0, 250, 250);
                  },
                  0.1,
                ),
                0,
                0,
              );
            break;
          case "water": {
            const a = paintHair(
              t,
              (e) => {
                const t = (30 * n) % 80;
                (e.fillStyle = vGrad(
                  [
                    [0, "#bff6ff"],
                    [0.4, "#29b6f6"],
                    [0.8, "#0b5fa5"],
                    [1, "#063a6b"],
                  ],
                  -t,
                  250 - t,
                )),
                  e.fillRect(0, 0, 250, 250);
              },
              0.15,
            );
            for (let t = 0; t < 250; t += 4)
              e.drawImage(a, 0, t, 250, 4, 3 * Math.sin(3 * n + t / 14), t, 250, 4);
            break;
          }
          case "fade":
            (e.globalAlpha = (Math.sin(2 * n) + 1) / 2), e.drawImage(t, 0, 0);
            break;
          case "huge": {
            const a = 1.5 + 0.04 * Math.sin(2 * n);
            e.translate(125, 155), e.scale(a, a), e.drawImage(t, -125, -155);
            break;
          }
          case "tiny":
            e.translate(125, 95), e.scale(0.55, 0.55), e.drawImage(t, -125, -95);
            break;
          case "gold":
            e.drawImage(
              paintHair(
                t,
                (e) => {
                  (e.fillStyle = vGrad([
                    [0, "#fff3b0"],
                    [0.4, "#f5c518"],
                    [1, "#9c6b00"],
                  ])),
                    e.fillRect(0, 0, 250, 250);
                  const t = ((160 * n) % 450) - 100,
                    a = e.createLinearGradient(t, 0, t + 60, 60);
                  a.addColorStop(0, "rgba(255,255,255,0)"),
                    a.addColorStop(0.5, "rgba(255,255,255,.95)"),
                    a.addColorStop(1, "rgba(255,255,255,0)"),
                    (e.fillStyle = a),
                    e.fillRect(0, 0, 250, 250);
                },
                0.1,
              ),
              0,
              0,
            );
            break;
          case "neon": {
            const a = `hsl(${(90 * n) % 360},100%,60%)`;
            (e.shadowColor = a),
              (e.shadowBlur = 18),
              e.drawImage(
                paintHair(
                  t,
                  (e) => {
                    (e.fillStyle = a), e.fillRect(0, 0, 250, 250);
                  },
                  0.2,
                ),
                0,
                0,
              );
            break;
          }
          case "ghost":
            (e.globalAlpha = 0.35 + 0.15 * Math.sin(3 * n)),
              e.drawImage(
                paintHair(
                  t,
                  (e) => {
                    (e.fillStyle = "#e8f4ff"), e.fillRect(0, 0, 250, 250);
                  },
                  0.3,
                ),
                0,
                6 * Math.sin(2 * n) - 8,
              );
            break;
          case "glitch": {
            const a = Math.floor(12 * n) % 7 == 0;
            for (let o = 0; o < 250; o += 10)
              e.drawImage(t, 0, o, 250, 10, a ? 18 * (Math.random() - 0.5) : 0, o, 250, 10);
            a &&
              ((e.globalAlpha = 0.5),
              (e.globalCompositeOperation = "lighter"),
              e.drawImage(
                paintHair(
                  t,
                  (e) => {
                    (e.fillStyle = "#ff0040"), e.fillRect(0, 0, 250, 250);
                  },
                  0,
                ),
                -4,
                0,
              ),
              e.drawImage(
                paintHair(
                  t,
                  (e) => {
                    (e.fillStyle = "#00e5ff"), e.fillRect(0, 0, 250, 250);
                  },
                  0,
                ),
                4,
                0,
              ));
            break;
          }
          case "galaxy":
            e.drawImage(
              paintHair(
                t,
                (e) => {
                  (e.fillStyle = vGrad([
                    [0, "#2b0a5c"],
                    [0.5, "#4a148c"],
                    [1, "#0d0221"],
                  ])),
                    e.fillRect(0, 0, 250, 250);
                  for (let t = 0; t < 40; t++) {
                    const a = (Math.sin(3 * n + 1.7 * t) + 1) / 2;
                    (e.fillStyle = `rgba(255,255,255,${a})`),
                      e.fillRect((53 * t) % 250, (97 * t) % 160, 2.5, 2.5);
                  }
                },
                0.05,
              ),
              0,
              0,
            );
            break;
          case "frozen":
            e.drawImage(
              paintHair(
                t,
                (e) => {
                  (e.fillStyle = vGrad([
                    [0, "#ffffff"],
                    [0.5, "#b3e5fc"],
                    [1, "#4fc3f7"],
                  ])),
                    e.fillRect(0, 0, 250, 250);
                  for (let t = 0; t < 18; t++) {
                    const a = (Math.sin(5 * n + 2.3 * t) + 1) / 2;
                    (e.fillStyle = `rgba(255,255,255,${a})`),
                      e.fillRect((71 * t) % 250, (41 * t) % 150, 3, 3);
                  }
                },
                0.2,
              ),
              0,
              0,
            );
            break;
          case "bouncy":
            e.drawImage(t, 0, 22 * -Math.abs(Math.sin(4 * n)));
            break;
          case "spin":
            e.translate(125, 110), e.rotate(4 * n), e.drawImage(t, -125, -110);
            break;
          default:
            if (o.startsWith("c:")) {
              const [, a, s] = o.split(":").map(Number);
              customHairFx(e, t, n, a, s);
            } else e.drawImage(t, 0, 0);
        }
        e.restore();
      }
      let modParts = null,
        modLoop = 0;
      function drawModded(e) {
        modParts &&
          document.querySelectorAll("canvas.avatar").forEach((t) => {
            const a = t.getContext("2d");
            a.clearRect(0, 0, 250, 250),
              a.save(),
              "huge" === state.mod.effect &&
                (a.translate(125, 250), a.scale(0.72, 0.72), a.translate(-125, -250));
            const o = (t) => {
              for (const a of modParts) {
                const o =
                  "hair" === a.type
                    ? state.mod.effect
                    : "skin" === a.type
                      ? state.mod.skinFx
                      : "iris" === a.type
                        ? state.mod.eyeFx
                        : "none";
                "none" === o ? t.drawImage(a.c, 0, 0) : drawHairFx(t, a.c, e, o);
              }
            };
            btShow && state.look.twin ? drawTwin(a, o) : o(a), a.restore();
          });
      }
      function startModLoop() {
        cancelAnimationFrame(modLoop);
        if (
          ("none" === state.mod.effect || "bald" === state.mod.effect) &&
          "none" === state.mod.eyeFx &&
          "none" === state.mod.skinFx
        )
          return drawModded(performance.now());
        let e = 0;
        const t = (a) => {
          a - e > 33 && ((e = a), drawModded(a)), (modLoop = requestAnimationFrame(t));
        };
        modLoop = requestAnimationFrame(t);
      }
      const hairList = (e) => ("f" === PG() ? FACE_LAYERS_F : FACE_LAYERS)[e]["hair-base"],
        moddedHairNum = (e) =>
          null == state.mod.style ? null : hairList(e)[state.mod.style % hairList(e).length];
      let faceKey = "";
      function renderAvatar() {
        const e = state.stats.Happiness,
          t = stage(state.age),
          a = e < 25 ? "sad" : e < 40 ? "angry" : "happy",
          o =
            null != state.mod.style ||
            "none" !== state.mod.effect ||
            "none" !== state.mod.eyeFx ||
            "none" !== state.mod.skinFx,
          n = moddedHairNum(t);
        if (is2018())
          return (
            (faceKey = "2018"),
            cancelAnimationFrame(modLoop),
            (modParts = null),
            document.querySelectorAll("canvas.avatar").forEach((e) => drawOldFace(e, PG(), state.age)),
            void (document.getElementById("pjob").textContent = stageName(state.age))
          );
        const s = wornAcc();
        (state.ills || []).some((e) => "Chickenpox" === e.name)
          ? (state.look.pox = 1)
          : delete state.look.pox,
          (state.ills || []).some((e) => "Pink Eye" === e.name)
            ? (state.look.pinkEye = 1)
            : delete state.look.pinkEye;
        const r = (faceKey =
          (state.look.pox ? "pox" : "") +
          (state.look.pinkEye ? "pink" : "") +
          t +
          a +
          state.look.beard +
          JSON.stringify(s) +
          dyeKey() +
          (window.FL_JEWEL_KEY ? window.FL_JEWEL_KEY() : "") +
          (o ? `|mod${n}` : "") +
          (btShow
            ? `|${state.look.eye2 || ""}${state.look.fur ? "f" : ""}${state.look.twin ? "t" : ""}`
            : ""));
        o
          ? (faceCache[r] ||= composeFace(t, a, state.look, PG(), s, {
              split: !0,
              hair: n,
              xHair: myXHair(),
            })).then((e) => {
              faceKey === r && ((modParts = e), startModLoop());
            })
          : (cancelAnimationFrame(modLoop),
            (modParts = null),
            (faceCache[r] ||= composeFace(t, a, state.look, PG(), s, { xHair: myXHair() })).then((e) => {
              faceKey === r &&
                document.querySelectorAll("canvas.avatar").forEach((t) => {
                  const a = t.getContext("2d");
                  a.clearRect(0, 0, 250, 250), a.drawImage(e, 0, 0);
                });
            })),
          (document.getElementById("pjob").textContent = stageName(state.age));
      }
      document.getElementById("ageBtn").addEventListener("click", () => {
        if (18 === state.age && "m" === PG() && !state.look.beard) {
          if (null != state.look.wantBeard) {
            if (!state.look.wantBeard) return;
            state.look.beard = state.look.wantBeard;
          } else {
            if (Math.random() >= 0.6) return;
            state.look.beard = 1 + Math.floor(13 * Math.random());
          }
          log.lastElementChild.insertAdjacentHTML("beforeend", "<p>I started growing facial hair.</p>"),
            renderAvatar();
        }
      });
      const _renderStats = renderStats,
        prayBtn = document.getElementById("pray");
      if (
        ((renderStats = function () {
          _renderStats(), eraTheme(), renderAvatar();
          const e = document.querySelector("#sProfile .money .amt");
          e && (e.textContent = usd(state.money));
          const t = document.querySelectorAll("#sProfile .money .amt")[1];
          t && (t.textContent = usd(state.cash || 0)),
            prayBtn.classList.toggle("hide", !Object.values(state.stats).some((e) => e < 13));
        }),
        (state.age = 0),
        (state.money = 0),
        (state.cash = 0),
        (state.stats = { Happiness: 90, Health: 100, Smarts: 40, Looks: 70 }),
        PICK && PICK.money && (state.money = PICK.money),
        PICK && PICK.stats)
      )
        for (const g in state.stats)
          null != PICK.stats[g] && (state.stats[g] = Math.max(0, Math.min(100, +PICK.stats[g])));
      PICK && PICK.attrs && (state.attrs = { ...PICK.attrs }),
        PICK &&
          PICK.mind &&
          (state.mind = {
            mh: Math.max(0, Math.min(100, +PICK.mind.mh)),
            ins: Math.max(0, Math.min(100, +PICK.mind.ins)),
            low: 0,
            happy: 0,
          }),
        PICK && PICK.sexuality && (state.sexuality = PICK.sexuality),
        (state.era = PICK && "1800s" === PICK.era ? "1800s" : null),
        (state.birthYear = isOldEra()
          ? PICK.birthYear >= 1800 && PICK.birthYear <= 1899
            ? PICK.birthYear
            : 1800 + Math.floor(81 * Math.random())
          : PICK && PICK.birthYear >= 1980 && PICK.birthYear <= 2026
            ? PICK.birthYear
            : 1990 + Math.floor(37 * Math.random()));
      const newsFor = (e) =>
          [...(window.WORLD_EVENTS?.[e] || [])]
            .sort(() => Math.random() - 0.5)
            .slice(0, 2 + Math.floor(3 * Math.random()))
            .map((e) => `<p class="news">${e}</p>`)
            .join(""),
        codes = Object.keys(window.COUNTRIES),
        spawnUS = (() => {
          try {
            const e = localStorage.getItem("bitlifepp-spawn");
            return PICKING || localStorage.removeItem("bitlifepp-spawn"), e;
          } catch {
            return null;
          }
        })();
      (state.country =
        PICK && PICK.country && COUNTRIES[PICK.country]
          ? PICK.country
          : spawnUS && COUNTRIES[spawnUS]
            ? spawnUS
            : codes[Math.floor(Math.random() * codes.length)]),
        PICK && PICK.city && PICK.country === state.country && (state.city = PICK.city);
      state.species = PICK && PICK.species && "human" !== PICK.species ? PICK.species : "human";
      state.nkHeir = !("kp" !== state.country || !PICK || !PICK.nkRuling);
      const [countryName, capital] = COUNTRIES[state.country],
        city = state.city || capital;
      (document.querySelector(".phone > .profile .pflag").src = `flags/${state.country}.png`),
        (document.querySelector(".phone > .profile .pflag").alt = countryName),
        (log.innerHTML = `<div class="year"><h3>Age: 0 years<span class="yr"> (${state.birthYear})</span></h3><p>I was born a ${"f" === PG() ? "female" : "male"} in ${city === countryName ? city : `${city}, ${countryName}`}.</p><p>My birthday is May 3, ${state.birthYear}.</p>${newsFor(state.birthYear)}</div>`);
      const customGenes =
        PICK && Array.isArray(PICK.genes) && (PICK.genes.length || PICK.genesNone)
          ? PICK.genes
          : (() => {
              try {
                const e = localStorage.getItem("bitlifepp-genes");
                return PICKING || localStorage.removeItem("bitlifepp-genes"), e ? JSON.parse(e) : null;
              } catch {
                return null;
              }
            })();
      if (
        (Array.isArray(customGenes) && (btShow = !0),
        (state.customGenes = Array.isArray(customGenes)),
        (state.genes = Array.isArray(customGenes)
          ? customGenes.filter((e) => BT[e])
          : BIRTH_TRAITS.filter((e) => Math.random() < e.base * (e.fOnly ? 0.1 : 1)).map((e) => e.id)),
        geneLook(state.look, state.genes),
        btShow && revealGenes(!0),
        PICK && PICK.talent && TALENTS[PICK.talent])
      ) {
        const y = TALENTS[PICK.talent];
        state.talent = PICK.talent;
        for (const [w, k] of Object.entries(y.fx))
          state.stats[w] = Math.max(0, Math.min(100, state.stats[w] + k));
        const b = log.firstElementChild,
          v = b.querySelector(".news");
        (v || b).insertAdjacentHTML(
          v ? "beforebegin" : "beforeend",
          `<p>I was born with a special talent for ${y.name.toLowerCase()}.</p>`,
        );
      }
      document
        .getElementById("ageBtn")
        .addEventListener("click", () =>
          log.lastElementChild.insertAdjacentHTML("beforeend", newsFor(state.birthYear + state.age)),
        ),
        document.getElementById("ageBtn").addEventListener("click", renderAvatar);
      const X_ICON =
          '<svg viewBox="0 0 16 16"><path d="M2 2l12 12M14 2L2 14" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>',
        BACK_ICON =
          '<svg viewBox="0 0 16 16"><path d="M11 2L5 8l6 6" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        CHEV =
          '<div class="chev"><svg viewBox="0 0 16 24"><path d="M3 3l10 9-10 9" stroke="#3d4a5c" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>',
        DOTS = '<div class="dots"><i></i><i></i><i></i></div>',
        OCC = [
          ["occ/education.png", "Education", "Go back to school", CHEV, "education"],
          ["occ/freelance.png", "Freelance Gigs", "Make some quick money", CHEV],
          ["occ/recruiter.png", "Job Recruiter", "Visit the job recruiter", DOTS, "recruiter"],
          ["occ/jobs.png", "Jobs", "Browse full-time job listings", CHEV, "fulltime"],
          ["occ/military.png", "Military", "Join the military", CHEV, "military"],
          ["occ/parttime.png", "Part-Time Jobs", "Browse hourly job listings", CHEV, "parttime"],
          ["occ/restaurants.png", "Restaurant Jobs", "Work at a real restaurant chain", CHEV, "restaurants"],
          ["occ/employers.png", "Big Employers", "Amazon, Walmart, DoorDash & Uber Eats", CHEV, "employers"],
          ["occ/special.png", "Special Careers", "Find a special career", CHEV, "special", "special"],
          ["occ/painting.png", "Painting", "Paint, exhibit and sell your art", CHEV, "painting"],
        ];
      (OCC[1][4] = "freelance"),
        [
          ["Car Washer", 12, "car-blue", 12],
          ["Snow Shoveler", 11, "broom", 12],
          ["House Cleaner", 15, "broom", 14],
          ["Window Washer", 14, "sweat-drops", 14],
          ["Grocery Delivery", 14, "shopping-bags", 16],
          ["Food Delivery Driver", 16, "cheeseburger", 16],
          ["Rideshare Driver", 18, "taxi", 18],
          ["Mover", 18, "box", 16],
          ["House Painter", 20, "roadwork", 16],
          ["Gardener", 13, "sunflower", 12],
          ["Pool Cleaner", 15, "man-swimming", 14],
          ["Lifeguard", 15, "shield", 16],
          ["Personal Trainer", 30, "man-lifting-weights", 18, { hard: 0.7 }],
          ["Yoga Instructor", 25, "woman-lotus", 18],
          ["Music Teacher", 22, "violin", 16, { bg: !0 }],
          ["Street Performer", 9, "busker", 12],
          ["Photographer", 28, "camera", 16, { hard: 0.75 }],
          ["Videographer", 30, "movie-camera", 18, { hard: 0.65 }],
          ["Graphic Designer", 32, "palette", 16, { hard: 0.65, adult: 20, young: 0.4 }],
          ["Web Developer", 40, "laptop", 16, { hard: 0.55, adult: 22, young: 0.3 }],
          ["Beta Tester", 14, "video-game", 13],
          ["Video Editor", 27, "film-frames", 16, { hard: 0.7 }],
          ["Social Media Manager", 22, "man-blogger", 16],
          ["Copywriter", 24, "newspaper", 16, { hard: 0.75 }],
          ["Translator", 26, "earth", 16, { hard: 0.6 }],
          ["Voice Over Artist", 30, "mic-studio", 16, { hard: 0.6 }],
          ["Party DJ", 35, "headphones", 18, { hard: 0.6, adult: 21, young: 0.4 }],
          ["Event Server", 14, "dinner-plate", 16],
          ["Event Bartender", 18, "cocktail-bar", 18],
          ["Party Clown", 20, "juggler", 16, { bg: !0 }],
          ["Magician", 25, "golden-wand", 14, { hard: 0.7, bg: !0 }],
          ["Face Painter", 15, "circus-tent", 13, { bg: !0 }],
          ["Hair Stylist", 22, "man-haircut", 16],
          ["Nail Technician", 20, "manicure", 16],
          ["Massage Therapist", 30, "man-massage", 18, { hard: 0.6 }],
          ["Makeup Artist", 24, "lipstick", 16, { hard: 0.75 }],
          ["Tailor", 18, "thread", 14],
          ["Courier", 13, "mailbox", 14],
          ["Plumber's Helper", 18, "wrench", 16],
          ["Electrician's Helper", 20, "electric-plug", 18],
          ["Mobile Mechanic", 26, "mechanic", 18, { hard: 0.6, adult: 21, young: 0.3 }],
          ["Computer Repair", 24, "computer", 14, { hard: 0.75 }],
          ["House Sitter", 11, "house-garden", 14, { bg: !0 }],
          ["Plant Sitter", 9, "seedling", 12],
          ["Errand Runner", 11, "luggage", 13],
          ["Tour Guide", 18, "earth", 18],
          ["Fishing Guide", 22, "fishing-pole", 18],
          ["Home Baker", 16, "croissant", 14],
          ["Cake Decorator", 18, "doughnut", 14],
          ["Personal Chef", 30, "man-cook", 18, { hard: 0.6, adult: 21, young: 0.4 }],
          ["Mystery Shopper", 15, "magnifier", 18],
          ["Survey Taker", 8, "chart-bar", 13],
          ["Horse Groomer", 15, "jockey", 14],
          ["Dog Groomer", 16, "poodle", 16],
        ].forEach(([e, t, a, o, n = {}]) => {
          JOB_DATA.freelance.some((t) => t.t === e) ||
            JOB_DATA.freelance.push({
              t: e,
              e: "1f4bc",
              c: "Freelance",
              pay: t,
              edu: "None",
              s: a,
              hourlyGig: !0,
              gig: { min: o, ...n },
            });
        }),
        JOB_DATA.freelance.sort((e, t) => t.pay - e.pay);
      const LISTS = {
          fulltime: { title: "JOBS", secs: [{ items: JOB_DATA.fulltime }] },
          parttime: { title: "PART-TIME JOBS", secs: [{ items: JOB_DATA.parttime }] },
          freelance: { title: "FREELANCE GIGS", secs: [{ items: JOB_DATA.freelance }] },
          special: { title: "SPECIAL CAREERS", secs: [{ items: JOB_DATA.special }] },
          military: { title: "MILITARY", secs: JOB_DATA.military },
          old: { title: "1800s JOBS", secs: [{ items: OLD_JOBS }] },
        },
        hrLabel = (e) => {
          const t = wageHr(e);
          return cur() + (t % 1 ? t.toFixed(2) : t.toLocaleString("en-US"));
        },
        payLabel = (e, t) =>
          e.old
            ? `${usd(oldWage(e.pay))} a year`
            : e.hourly
              ? `${hrLabel(e.pay)}/hr`
              : "parttime" === t
                ? hrLabel(e.pay) + "/hour"
                : "freelance" === t
                  ? hrLabel(e.pay) + "+/hour"
                  : usd(wage(e.pay)),
        NAMES = [
          "Aristotle",
          "Pinnacle",
          "Summit",
          "Blue Reef",
          "Iron Anvil",
          "Lumen",
          "Northstar",
          "Evergreen",
          "Silverline",
          "Redwood",
          "Crescent",
          "Harbor",
          "Keystone",
          "Orion",
          "Liberty",
        ],
        employerFor = (e) =>
          e.old
            ? oldEmpFor(e)
            : e.emp
              ? e.emp
              : "Private" === e.c
                ? "Private Client"
                : `${NAMES[[...e.t].reduce((e, t) => e + t.charCodeAt(0), 0) % NAMES.length]} ${"Corporate" === e.c ? "Holdings" : e.c}`,
        screen = document.getElementById("screen"),
        sList = document.getElementById("sList"),
        usd = (e) =>
          cur() +
          (e % 1
            ? e.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : e.toLocaleString("en-US"));
      function syncProfile() {
        const e = document.querySelector(".phone > .profile").cloneNode(!0);
        e.querySelector("#money").textContent = usd(Math.round(bankTotal()));
        const t = e.querySelector("#cash");
        t && (t.textContent = usd(state.cash || 0)),
          e.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id"));
        const a = e.querySelector("canvas.avatar");
        a && a.getContext("2d").drawImage(document.querySelector(".phone > .profile canvas.avatar"), 0, 0),
          sProfile.replaceChildren(e);
      }
