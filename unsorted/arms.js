/* [mod] Vendedores de armas para NaBlooLife (mod local). Lo carga gang.js (código 13131313).
 * Tienda legal (pistolas, escopetas, armas de caza) + dealers de la calle (Draco, Mini Draco, switches,
 * accesorios y cargadores sueltos). Estado: state.arms (JSON puro, por vida).
 * Usar un arma en algo ilegal suma un cargo extra al arresto (busted()). Se conecta a la pandilla con window.FL_ARMS.
 * Textos: T("english", "español", "português"); add_chess_i18n.py los pasa al ui.tsv.
 * REGLA: los textos de T() van entre comillas dobles, sin template literals.
 */
(() => {
  "use strict";
  const T = (en) => en;
  const E = (code) => `emoji/${code}.png`;
  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const clampN = (v, a, b) => Math.max(a, Math.min(b, v));
  const money = (n) => (typeof usd === "function" ? usd(n) : "$" + Math.round(n).toLocaleString("en-US"));
  const price = (n) => (!n ? 0 : typeof localPrice === "function" ? localPrice(n) : n);
  const TITLE = T("Gun Dealers", "Vendedores de armas", "Vendedores de armas");
  const PIECE = (p) => `<em style="font-style:normal">${p}</em>`;
  // iconos PNG: cargador generico y hueco vacio (pixel transparente, sin dibujo vectorial)
  const MAG_ICON = "guns/glock-parts/mag-extended-01-icon.png?v=2";
  const BLANK = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  // ---------------------------------------------------------------- íconos dibujados en SVG (data URI)
  const svg = (body) =>
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs>` +
        `<linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a606b"/><stop offset=".5" stop-color="#2b2f36"/><stop offset="1" stop-color="#15171b"/></linearGradient>` +
        `<linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9824f"/><stop offset="1" stop-color="#6e4421"/></linearGradient>` +
        `</defs>${body}</svg>`,
    );
  const M = 'fill="url(#m)" stroke="#0e0f12" stroke-width="2"';
  const W = 'fill="url(#w)" stroke="#47280f" stroke-width="2"';
  const ICONS = {
    shotgun: svg(`<rect x="8" y="50" width="74" height="7" rx="3" ${M}/><rect x="8" y="58" width="60" height="5" rx="2" ${M}/><rect x="40" y="63" width="26" height="9" rx="4" ${W}/><rect x="64" y="48" width="26" height="18" rx="4" ${M}/><path d="M88 50 L112 58 L108 82 L88 68 Z" ${W}/>`),
    tactical: svg(`<rect x="8" y="52" width="70" height="8" rx="3" ${M}/><rect x="34" y="61" width="28" height="9" rx="4" ${M}/><rect x="60" y="48" width="26" height="18" rx="4" ${M}/><path d="M86 50 L110 54 L108 76 L86 66 Z" ${M}/>`),
    double: svg(`<rect x="8" y="48" width="74" height="6" rx="3" ${M}/><rect x="8" y="55" width="74" height="6" rx="3" ${M}/><rect x="46" y="62" width="30" height="8" rx="4" ${W}/><rect x="66" y="46" width="20" height="18" rx="4" ${M}/><path d="M84 48 L112 58 L108 84 L84 68 Z" ${W}/>`),
    rifle: svg(`<rect x="6" y="56" width="66" height="5" rx="2" ${M}/><rect x="62" y="50" width="30" height="13" rx="3" ${M}/><rect x="40" y="41" width="40" height="7" rx="3" ${M}/><circle cx="43" cy="44" r="5" ${M}/><path d="M90 52 L114 58 L110 80 L90 66 Z" ${W}/><rect x="30" y="62" width="34" height="7" rx="3" ${W}/>`),
    small: svg(`<rect x="6" y="57" width="60" height="4" rx="2" ${M}/><rect x="60" y="52" width="26" height="11" rx="3" ${M}/><path d="M84 53 L112 59 L108 78 L84 66 Z" ${W}/><rect x="28" y="62" width="32" height="6" rx="3" ${W}/>`),
    bow: svg(`<path d="M46 14 C92 30 92 90 46 106" fill="none" stroke="#8a5a2b" stroke-width="7" stroke-linecap="round"/><path d="M46 14 L46 106" stroke="#e8e2d0" stroke-width="2"/><path d="M30 60 L96 60" stroke="#c9b48a" stroke-width="3"/><path d="M96 60 L84 54 M96 60 L84 66" stroke="#c9b48a" stroke-width="3"/>`),
    mag: svg(`<path d="M44 20 L74 20 L80 100 L52 104 Z" ${M}/><rect x="42" y="14" width="34" height="8" rx="2" ${M}/><path d="M50 40 H72 M50 56 H73 M51 72 H75" stroke="#7b818c" stroke-width="2"/>`),
    drum: svg(`<rect x="50" y="8" width="26" height="26" rx="3" ${M}/><circle cx="62" cy="72" r="34" ${M}/><circle cx="62" cy="72" r="18" fill="#15171b" stroke="#7b818c" stroke-width="2"/><circle cx="62" cy="72" r="5" fill="#7b818c"/>`),
    reddot: svg(`<rect x="30" y="48" width="60" height="30" rx="6" ${M}/><rect x="40" y="54" width="40" height="18" rx="3" fill="#1b2a33" stroke="#0e0f12" stroke-width="2"/><circle cx="60" cy="63" r="4" fill="#ff2a2a"/><rect x="38" y="78" width="44" height="8" rx="2" ${M}/>`),
    scope: svg(`<rect x="12" y="50" width="96" height="20" rx="9" ${M}/><circle cx="20" cy="60" r="14" ${M}/><circle cx="20" cy="60" r="8" fill="#1b2a33"/><circle cx="102" cy="60" r="10" ${M}/><rect x="40" y="70" width="12" height="14" ${M}/><rect x="72" y="70" width="12" height="14" ${M}/>`),
    laser: svg(`<rect x="26" y="46" width="48" height="28" rx="5" ${M}/><circle cx="76" cy="60" r="5" fill="#ff2a2a"/><path d="M82 60 H114" stroke="#ff2a2a" stroke-width="3" stroke-linecap="round"/>`),
    light: svg(`<path d="M80 40 L112 24 L112 96 L80 80 Z" fill="#ffe27a" opacity=".55"/><rect x="24" y="42" width="58" height="36" rx="6" ${M}/><rect x="74" y="38" width="12" height="44" rx="4" ${M}/><circle cx="80" cy="60" r="6" fill="#fff6c4"/>`),
    supp: svg(`<rect x="14" y="44" width="92" height="32" rx="8" ${M}/><path d="M34 46 V74 M52 46 V74 M70 46 V74 M88 46 V74" stroke="#7b818c" stroke-width="2"/><circle cx="106" cy="60" r="5" fill="#0e0f12"/>`),
    comp: svg(`<rect x="30" y="46" width="60" height="28" rx="6" ${M}/><path d="M44 48 V72 M56 48 V72 M68 48 V72" stroke="#0e0f12" stroke-width="4"/>`),
    vgrip: svg(`<rect x="22" y="22" width="76" height="14" rx="4" ${M}/><path d="M50 36 H72 L76 98 Q76 106 68 106 H56 Q48 106 48 98 Z" ${M}/><path d="M54 52 H70 M54 66 H71 M54 80 H72" stroke="#7b818c" stroke-width="2"/>`),
    brace: svg(`<rect x="12" y="46" width="30" height="14" rx="3" ${M}/><path d="M40 44 L108 36 L108 82 L40 66 Z" ${M}/><path d="M60 52 L100 48 M60 62 L100 62" stroke="#7b818c" stroke-width="2"/>`),
    sear: svg(`<rect x="26" y="34" width="68" height="52" rx="6" ${M}/><rect x="36" y="44" width="48" height="32" rx="3" fill="#8a6a1a" stroke="#0e0f12" stroke-width="2"/><path d="M44 52 H76 M44 60 H76 M44 68 H76" stroke="#ffd45a" stroke-width="2"/>`),
  };

  // ---------------------------------------------------------------- catálogo
  // grp = familia de cargadores/accesorios: glock | ak (Draco)
  const GUNS = {
    // ---- legales (tienda)
    g19: { n: T("Glock 19", "Glock 19", "Glock 19"), cat: "pistol", price: 550, power: 0.06, grp: "glock", icon: "guns/glock.png?v=3", age: 21 },
    rev: { n: T("Revolver .38", "Revólver .38", "Revólver .38"), cat: "pistol", price: 400, power: 0.05, icon: E("1f52b"), age: 21 },
    p45: { n: T(".45 Pistol", "Pistola .45", "Pistola .45"), cat: "pistol", price: 650, power: 0.07, icon: E("1f52b"), age: 21 },
    pump: { n: T("Pump Shotgun", "Escopeta de bombeo", "Escopeta pump"), cat: "shotgun", price: 450, power: 0.12, icon: ICONS.shotgun, age: 18, hunt: 1 },
    dbl: { n: T("Double-Barrel Shotgun", "Escopeta de dos cañones", "Escopeta de dois canos"), cat: "shotgun", price: 600, power: 0.12, icon: ICONS.double, age: 18, hunt: 1 },
    tact: { n: T("Tactical Shotgun", "Escopeta táctica", "Escopeta tática"), cat: "shotgun", price: 800, power: 0.16, icon: ICONS.tactical, age: 18 },
    r22: { n: T(".22 Rifle", "Rifle .22", "Rifle .22"), cat: "hunting", price: 250, power: 0.04, icon: ICONS.small, age: 18, hunt: 1 },
    deer: { n: T("Deer Rifle .308", "Rifle de venado .308", "Rifle de veado .308"), cat: "hunting", price: 700, power: 0.1, icon: ICONS.rifle, age: 18, hunt: 2 },
    bow: { n: T("Hunting Bow", "Arco de caza", "Arco de caça"), cat: "hunting", price: 300, power: 0.03, icon: ICONS.bow, age: 16, hunt: 1 },
    // ---- ilegales (calle)
    sg19: { n: T("Street Glock", "Glock de la calle", "Glock da rua"), price: 900, power: 0.08, heat: 4, illegal: 1, grp: "glock", icon: "guns/glock.png?v=3" },
    draco: { n: T("Draco", "Draco", "Draco"), price: 4000, power: 0.2, heat: 9, illegal: 1, grp: "ak", icon: "guns/draco.png?v=3" },
    mdraco: { n: T("Mini Draco", "Mini Draco", "Mini Draco"), price: 3200, power: 0.17, heat: 8, illegal: 1, grp: "ak", mini: 1, icon: "guns/draco.png?v=3" },
    // ARP retirada del catálogo: solo quedan la Glock y la Draco nuevas
    // Mini ARP retirada del catálogo
  };
  const CATS = [
    ["pistol", T("Pistols", "Pistolas", "Pistolas")],
    ["shotgun", T("Shotguns", "Escopetas", "Escopetas")],
    ["hunting", T("Hunting", "Caza", "Caça")],
  ];

  // cargadores sueltos: se compran aparte y se le cargan a un arma compatible
  const MAGS = {
    "glock:ext": { n: T("Glock Extended Mag (33 rounds)", "Cargador extendido de Glock (33 balas)", "Pente estendido de Glock (33 balas)"), grp: "glock", price: 120, power: 0.02, heat: 1, icon: "guns/glock-parts/mag-extended-01-icon.png?v=2" },
    "glock:drum": { n: T("Glock Drum Mag (50 rounds)", "Cargador de tambor de Glock (50 balas)", "Pente tambor de Glock (50 balas)"), grp: "glock", price: 350, power: 0.05, heat: 3, illegal: 1, icon: "guns/glock-parts/mag-drum-01-icon.png?v=2" },
    "ak:ext": { n: T("Draco Extended Mag (40 rounds)", "Cargador extendido de Draco (40 balas)", "Pente estendido de Draco (40 balas)"), grp: "ak", price: 150, power: 0.02, heat: 1, icon: "guns/glock-parts/mag-extended-01-icon.png?v=2" },
    "ak:drum": { n: T("Draco Drum Mag (75 rounds)", "Cargador de tambor de Draco (75 balas)", "Pente tambor de Draco (75 balas)"), grp: "ak", price: 400, power: 0.06, heat: 3, illegal: 1, icon: "guns/glock-parts/mag-drum-01-icon.png?v=2" },


  };
  const STD = {
    glock: T("Standard mag (17 rounds)", "Cargador estándar (17 balas)", "Pente padrão (17 balas)"),
    ak: T("Standard mag (30 rounds)", "Cargador estándar (30 balas)", "Pente padrão (30 balas)"),
    ar: T("Standard mag (30 rounds)", "Cargador estándar (30 balas)", "Pente padrão (30 balas)"),
  };

  const SLOTS = {
    optic: T("Optic", "Mira", "Mira"),
    muzzle: T("Muzzle", "Boca del cañón", "Boca do cano"),
    grip: T("Grip", "Empuñadura", "Empunhadura"),
    rail: T("Rail", "Riel", "Trilho"),
    stock: T("Stock", "Culata", "Coronha"),
    trigger: T("Trigger", "Gatillo", "Gatilho"),
  };
  const SLOTS_BY = {
    glock: ["optic", "muzzle", "trigger"],
    ak: ["optic", "muzzle", "trigger"],
    ar: ["optic", "muzzle", "trigger"],
  };
  const slotsOf = (def) => (def.grp ? SLOTS_BY[def.grp].filter((s) => !(def.mini && s === "stock")) : []);

  const ALL = ["glock", "ak", "ar"];
  const PARTS = {
    reddot: { n: T("Red Dot Sight", "Mira de punto rojo", "Mira de ponto vermelho"), slot: "optic", grps: ALL, price: 150, power: 0.02, heat: 0, icon: "guns/attachments/red-dot.png?v=2" },
    supp: { n: T("Suppressor", "Silenciador", "Silenciador"), slot: "muzzle", grps: ALL, price: 900, power: 0, heat: -4, illegal: 1, icon: "guns/attachments/suppressor.png?v=2" },
    switch: { n: T("Switch", "Switch", "Switch"), slot: "trigger", grps: ["glock"], price: 600, power: 0.12, heat: 6, illegal: 1, auto: 1, color: 1, icon: "guns/switch-red.png?v=3" },
    sear: { n: T("Auto Sear", "Auto sear", "Auto sear"), slot: "trigger", grps: ["ak"], price: 1100, power: 0.12, heat: 7, illegal: 1, auto: 1, icon: "guns/glock-parts/control-part-04.png?v=2" },
  };
  const COLORS = [
    ["red", T("Red", "Rojo", "Vermelho")], ["blue", T("Blue", "Azul", "Azul")], ["green", T("Green", "Verde", "Verde")],
    ["gold", T("Gold", "Dorado", "Dourado")], ["pink", T("Pink", "Rosado", "Rosa")], ["purple", T("Purple", "Morado", "Roxo")],
    ["orange", T("Orange", "Naranja", "Laranja")], ["white", T("White", "Blanco", "Branco")],
  ];
  const colorName = (id) => (COLORS.find((c) => c[0] === id) || COLORS[0])[1];
  const partIcon = (p) => (p.id === "switch" ? `guns/switch-${p.color || "red"}.png?v=3` : PARTS[p.id].icon);

  // ---------------------------------------------------------------- ícono compuesto: el arma con lo que le instalaste
  // ---------------------------------------------------------------- icono del arma (solo PNG nuevo)
  // Si lleva switch montado se usa el PNG del switch en su color; si no, el PNG del arma.
  // No se dibuja ninguna pieza a mano encima.
  function pic(gun) {
    const d = GUNS[gun.id];
    const t = (gun.att || {}).trigger;
    if (t && t.id === "switch") return `guns/switch-${t.color || "red"}.png?v=3`;
    return d.icon;
  }

  // armas ya armadas con accesorios (vienen instalados; cuestan un 10% menos que comprarlo todo por separado)
  const KITS = {
    kg19: { n: T("Glock 19 · Tactical", "Glock 19 · Táctica", "Glock 19 · Tática"), base: "g19", att: { optic: { id: "reddot" } } },
    kglock: { n: T("Glock · Switched", "Glock · Con switch", "Glock · Com switch"), base: "sg19", att: { trigger: { id: "switch", color: "red" } }, mag: "glock:ext" },
    kglock2: { n: T("Glock · Full Kit", "Glock · Kit completo", "Glock · Kit completo"), base: "sg19", att: { trigger: { id: "switch", color: "purple" }, muzzle: { id: "supp" }, optic: { id: "reddot" } }, mag: "glock:drum" },
    kdraco1: { n: T("Draco · Optic Pack", "Draco · Paquete con mira", "Draco · Pacote com mira"), base: "draco", att: { optic: { id: "reddot" } }, mag: "ak:ext" },
    kdraco2: { n: T("Draco · Full Auto", "Draco · Automático", "Draco · Automático"), base: "draco", att: { trigger: { id: "sear" }, muzzle: { id: "supp" } }, mag: "ak:drum" },
    kmdraco: { n: T("Mini Draco · Compact Kit", "Mini Draco · Kit compacto", "Mini Draco · Kit compacto"), base: "mdraco", att: { optic: { id: "reddot" } }, mag: "ak:ext" },
  };
  const kitPrice = (k) => Math.round((GUNS[k.base].price + Object.values(k.att).reduce((s, a) => s + PARTS[a.id].price, 0) + (k.mag ? MAGS[k.mag].price : 0)) * 0.9);
  const kitGun = (k) => ({ id: k.base, att: JSON.parse(JSON.stringify(k.att)), mag: k.mag || null });
  // el nombre del kit solo se ve mientras el arma siga igual que como la compraste
  const sameLoadout = (gun, k) => JSON.stringify(gun.att || {}) === JSON.stringify(k.att) && (gun.mag || null) === (k.mag || null);
  const gunName = (gun) => (gun.kit && KITS[gun.kit] && sameLoadout(gun, KITS[gun.kit]) ? KITS[gun.kit].n : GUNS[gun.id].n);

  // dealers
  const DEALERS = {
    store: { n: T("Gun Store", "Tienda de armas", "Loja de armas"), icon: E("1f3ea"), legal: 1, kits: ["kg19"], sub: T("Pistols, shotguns and hunting gear. Everything legal.", "Pistolas, escopetas y armas de caza. Todo legal.", "Pistolas, escopetas e armas de caça. Tudo legal.") },
    ray: { n: T("Lil Ray", "Lil Ray", "Lil Ray"), icon: E("1f9e2"), guns: ["sg19"], kits: ["kglock", "kglock2"], mags: ["glock:ext", "glock:drum"], parts: ["switch"], sub: T("Corner guy. Glocks, switches and Glock mags.", "El de la esquina. Glocks, switches y cargadores de Glock.", "O cara da esquina. Glocks, switches e pentes de Glock.") },
    ortiz: { n: T("Mr. Ortiz", "Don Ortiz", "Seu Ortiz"), icon: E("1f3a9"), guns: ["draco", "mdraco"], kits: ["kdraco1", "kdraco2", "kmdraco"], mags: ["ak:ext", "ak:drum"], parts: ["sear"], sub: T("Gun runner. Dracos, big and mini.", "Traficante de armas. Dracos, grandes y mini.", "Traficante de armas. Dracos, grandes e mini."), minRank: 1 },
    ghost: { n: T("Ghost", "Ghost", "Ghost"), icon: E("1f9d4"), mags: Object.keys(MAGS), parts: ["reddot", "supp"], sub: T("Parts guy. Attachments and magazines for everything.", "El de las piezas. Accesorios y cargadores para todo.", "O cara das peças. Acessórios e pentes para tudo.") },
  };

  // ---------------------------------------------------------------- estado
  const A = () => {
    const a = (state.arms ||= { v: 1, guns: [], carry: null, mags: {}, parts: [], uid: 1, license: false, yr: { age: -1, hunts: 0 } });
    if (!a.v || a.v < 3) {
      // limpieza: fuera armas, piezas y cargadores que ya no existen en el catalogo
      a.guns = (a.guns || []).filter((g) => g && GUNS[g.id]);
      for (const g of a.guns) {
        const att = g.att || (g.att = {});
        for (const k of Object.keys(att)) if (!att[k] || !PARTS[att[k].id]) delete att[k];
        if (g.mag && !MAGS[g.mag]) g.mag = null;
      }
      a.parts = (a.parts || []).filter((x) => x && PARTS[x.id]);
      a.mags = a.mags || {};
      for (const k of Object.keys(a.mags)) if (!MAGS[k] || !(a.mags[k] > 0)) delete a.mags[k];
      if (a.carry != null && !a.guns.some((g) => g.uid === a.carry)) a.carry = null;
      a.uid = Math.max(1, a.uid || 1);
      a.v = 3;
    }
    return a;
  };

  const yr = () => {
    const a = A();
    if (a.yr.age !== state.age) a.yr = { age: state.age, hunts: 0 };
    return a.yr;
  };
  const findGun = (uid) => A().guns.find((x) => x.uid === uid);
  const gunDef = (gun) => GUNS[gun.id];
  const attList = (gun) => Object.values(gun.att || {});
  function stats(gun) {
    const d = gunDef(gun);
    let power = d.power, heat = d.heat || 0, illegal = !!d.illegal, auto = false;
    for (const a of attList(gun)) {
      const p = PARTS[a.id];
      power += p.power;
      heat += p.heat;
      illegal = illegal || !!p.illegal;
      auto = auto || !!p.auto;
    }
    const m = gun.mag && MAGS[gun.mag];
    if (m) (power += m.power), (heat += m.heat), (illegal = illegal || !!m.illegal);
    return { power: clampN(power, 0, 0.5), heat: illegal ? clampN(Math.round(heat), 0, 30) : 0, illegal, auto };
  }
  const carriedGun = () => {
    const a = A();
    return a.carry != null ? findGun(a.carry) || null : null;
  };
  const pct = (x) => `${Math.round(x * 100)}%`;
  const statusTxt = (s) => (s.auto ? T("Automatic", "Automática", "Automática") : s.illegal ? T("Illegal", "Ilegal", "Ilegal") : T("Legal", "Legal", "Legal"));

  // ---------------------------------------------------------------- pantallas
  const row = (id, icon, title, sub, dis, tail) =>
    `<div class="row${dis ? " dis" : ""}" id="${id}"><img src="${icon}"><div class="t"><b>${title}</b><span>${sub}</span></div>${dis ? "" : tail || (typeof DOTS !== "undefined" ? DOTS : "")}</div>`;
  const chev = () => (typeof CHEV !== "undefined" ? CHEV : "");
  const tap = (id, fn) => {
    const el = document.getElementById(id);
    if (el && !el.classList.contains("dis")) el.onclick = () => (typeof play === "function" && play("choice"), fn());
  };
  const plain = (t, cb) => notice(TITLE, t, cb || null, !0);
  let origin = null; // a dónde vuelve el botón atrás de la pantalla principal

  function frame(title, back) {
    if (state.prison) return false;
    screen.classList.add("open");
    sTitle.textContent = String(title).toUpperCase();
    sSub.style.display = "none";
    sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "‹";
    sBack.onclick = back;
    return true;
  }

  function openArms(from) {
    origin = from || null;
    if (state.prison) return plain(T("You can't do that from prison.", "No puedes hacer eso desde la cárcel.", "Você não pode fazer isso da prisão."));
    const a = A();
    const g = state.gangLife && state.gangLife.member ? state.gangLife : null;
    frame(TITLE, () => (origin ? origin() : typeof openActivities === "function" ? openActivities() : screen.classList.remove("open")));
    const young = state.age < 16;
    let html = `<div class="sec">${T("Legal", "Legal", "Legal")}</div>`;
    html += row("aD_store", DEALERS.store.icon, DEALERS.store.n, state.age < 16 ? `${T("Age", "Edad", "Idade")} 16+` : DEALERS.store.sub, state.age < 16, chev());
    html += `<div class="sec">${T("Street Dealers", "Dealers de la calle", "Dealers da rua")}</div>`;
    for (const id of ["ray", "ortiz", "ghost"]) {
      const d = DEALERS[id];
      const lock = young ? `${T("Age", "Edad", "Idade")} 16+` : d.sub;
      html += row(`aD_${id}`, d.icon, d.n, lock, young, chev());
    }
    html += `<div class="sec">${T("My Arsenal", "Mi arsenal", "Meu arsenal")}</div>`;
    if (!a.guns.length) html += row("aNone", E("1f4e6"), T("No guns yet", "Todavía sin armas", "Ainda sem armas"), T("Buy one from a dealer", "Compra una con un vendedor", "Compre uma com um vendedor"), true);
    for (const gun of a.guns) {
      const s = stats(gun);
      const sub = [a.carry === gun.uid ? PIECE(T("Carrying it", "La llevas encima", "Está com você")) : "", PIECE(statusTxt(s)), PIECE(`${T("Power", "Poder", "Poder")} ${pct(s.power)}`)].filter(Boolean).join(" · ");
      html += row(`aG_${gun.uid}`, pic(gun), gunName(gun), sub, false, chev());
    }
    const nm = Object.values(a.mags).reduce((x, y) => x + y, 0);
    html += row("aMags", MAG_ICON, T("Magazines & Parts", "Cargadores y piezas", "Pentes e peças"), `${PIECE(`${T("Magazines", "Cargadores", "Pentes")} ${nm}`)} · ${PIECE(`${T("Parts", "Piezas", "Peças")} ${a.parts.length}`)}`, false, chev());
    const hunter = a.guns.some((x) => gunDef(x).hunt);
    html += row("aHunt", E("1f333"), T("Go Hunting", "Ir de cacería", "Ir caçar"), hunter ? (a.license ? T("Hunting license: yes", "Licencia de caza: sí", "Licença de caça: sim") : T("You'll need a license", "Vas a necesitar licencia", "Você vai precisar de licença")) : T("You need a hunting weapon", "Necesitas un arma de caza", "Você precisa de uma arma de caça"), !hunter);
    if (carriedGun()) html += row("aHol", E("1f45c"), T("Put It Away", "Guardarla", "Guardar"), T("Stop carrying a gun", "Dejar de andar armado", "Parar de andar armado"));
    sList.innerHTML = html;
    sList.scrollTop = 0;
    for (const id of Object.keys(DEALERS)) tap(`aD_${id}`, () => openShop(id));
    for (const gun of a.guns) tap(`aG_${gun.uid}`, () => openGun(gun.uid));
    tap("aMags", openStock);
    tap("aHunt", goHunting);
    tap("aHol", () => ((a.carry = null), openArms()));
  }

  // ---- tienda / dealer
  const premium = (d) => {
    const g = state.gangLife && state.gangLife.member ? state.gangLife : null;
    return d.minRank && (!g || g.rank < d.minRank) ? 1.4 : 1;
  };
  function openShop(id) {
    const d = DEALERS[id];
    const a = A();
    frame(d.n, () => openArms(origin));
    const pr = premium(d);
    let html = "";
    if (pr > 1) html += `<div class="sec">${T("He doesn't know you. Prices are 40% higher.", "No te conoce. Los precios están 40% más altos.", "Ele não te conhece. Os preços estão 40% mais altos.")}</div>`;
    const item = (kind, key, def, icon, extra) => {
      const cost = Math.round(price(def.price) * pr);
      return row(`aB_${kind}_${key}`, icon, def.n, `${PIECE(money(cost))}${extra ? " · " + extra : ""}`, false, "");
    };
    if (d.legal) {
      for (const [cat, label] of CATS) {
        html += `<div class="sec">${label}</div>`;
        for (const k of Object.keys(GUNS).filter((x) => GUNS[x].cat === cat)) {
          const def = GUNS[k];
          html += item("g", k, def, def.icon, PIECE(`${T("Power", "Poder", "Poder")} ${pct(def.power)}`) + (state.age < def.age ? ` · ${PIECE(`${T("Age", "Edad", "Idade")} ${def.age}+`)}` : ""));
        }
      }
    } else {
      if (d.guns) {
        html += `<div class="sec">${T("Guns", "Armas", "Armas")}</div>`;
        for (const k of d.guns) html += item("g", k, GUNS[k], GUNS[k].icon, `${PIECE(`${T("Power", "Poder", "Poder")} ${pct(GUNS[k].power)}`)} · ${PIECE(T("Illegal", "Ilegal", "Ilegal"))}`);
      }
      if (d.mags) {
        html += `<div class="sec">${T("Magazines", "Cargadores", "Pentes")}</div>`;
        for (const k of d.mags) html += item("m", k, MAGS[k], MAGS[k].icon, MAGS[k].illegal ? PIECE(T("Illegal", "Ilegal", "Ilegal")) : "");
      }
      if (d.parts) {
        html += `<div class="sec">${T("Attachments", "Accesorios", "Acessórios")}</div>`;
        for (const k of d.parts) {
          const p = PARTS[k];
          const fits = p.grps.length === 3 ? T("Fits everything", "Sirve para todas", "Serve em todas") : p.grps[0] === "glock" ? T("Glocks", "Glocks", "Glocks") : T("Dracos", "Dracos", "Dracos");
          html += item("p", k, p, p.icon, `${PIECE(SLOTS[p.slot])} · ${PIECE(fits)}`);
        }
      }
    }
    if (d.kits) {
      html += `<div class="sec">${T("Ready-Made (with attachments)", "Ya armadas (con accesorios)", "Já montadas (com acessórios)")}</div>`;
      for (const k of d.kits) {
        const kit = KITS[k];
        const st = stats(kitGun(kit));
        html += item("k", k, { n: kit.n, price: kitPrice(kit) }, pic(kitGun(kit)), `${PIECE(`${T("Power", "Poder", "Poder")} ${pct(st.power)}`)} · ${PIECE(statusTxt(st))}`);
      }
    }
    sList.innerHTML = html;
    sList.scrollTop = 0;
    for (const k of d.kits || []) tap(`aB_k_${k}`, () => buy(id, "k", k));
    for (const k of d.guns || Object.keys(GUNS).filter((x) => d.legal && GUNS[x].cat)) tap(`aB_g_${k}`, () => buy(id, "g", k));
    for (const k of d.mags || []) tap(`aB_m_${k}`, () => buy(id, "m", k));
    for (const k of d.parts || []) tap(`aB_p_${k}`, () => buy(id, "p", k));
  }

  function buy(id, kind, key) {
    const d = DEALERS[id];
    const a = A();
    const kit = kind === "k" ? KITS[key] : null;
    const def = kit ? { n: kit.n, price: kitPrice(kit), icon: pic(kitGun(kit)), age: GUNS[kit.base].age, illegal: stats(kitGun(kit)).illegal } : kind === "g" ? GUNS[key] : kind === "m" ? MAGS[key] : PARTS[key];
    const cost = Math.round(price(def.price) * premium(d));
    if ((kind === "g" || kind === "k") && state.age < (def.age || 16)) return plain(`${T("You have to be at least", "Tienes que tener al menos", "Você precisa ter pelo menos")} ${def.age} ${T("years old to buy that.", "años para comprar eso.", "anos para comprar isso.")}`);
    if (d.legal && (kind === "g" || kind === "k") && window.FL_LICENSES && !FL_LICENSES.has("firearm")) return FL_LICENSES.need("firearm");
    if (state.money < cost) return plain(T("You don't have enough money for that.", "No te alcanza para eso.", "Você não tem dinheiro para isso."));
    const done = (extra) => {
      state.money -= cost;
      if (kind === "g") a.guns.push({ uid: a.uid++, id: key, mag: null, att: {} });
      else if (kind === "k") a.guns.push({ uid: a.uid++, ...kitGun(kit), kit: key });
      else if (kind === "m") a.mags[key] = (a.mags[key] || 0) + 1;
      else a.parts.push(extra ? { id: key, color: extra } : { id: key });
      typeof renderStats === "function" && renderStats();
      typeof chaChing === "function" && chaChing();
      say(d.legal ? T("I bought a gun legally.", "Compré un arma legalmente.", "Comprei uma arma legalmente.") : T("I bought some gear from a street dealer.", "Compré equipo con un dealer de la calle.", "Comprei equipamento com um dealer da rua."));
      jCard({
        tag: TITLE,
        iconSrc: kind === "p" ? partIcon({ id: key, color: extra }) : def.icon,
        title: def.n,
        lead: d.legal
          ? T("Background check cleared. It's all yours.", "Pasó la verificación de antecedentes. Es toda tuya.", "Passou na verificação de antecedentes. É toda sua.")
          : T("You got it from a guy who knows a guy. No receipt, no questions.", "Te lo consiguió un pana de un pana. Sin factura y sin preguntas.", "Você conseguiu com um conhecido de um conhecido. Sem nota e sem perguntas."),
        rows: [["Money", `-${money(cost)}`]],
        choices: [["OK", () => openShop(id)]],
      });
    };
    const go = (extra) => {
      // riesgos de comprar en la calle
      if (!d.legal && (kind === "g" || kind === "k" || def.illegal)) {
        const x = rnd();
        if (x < 0.05) {
          state.money -= cost;
          typeof renderStats === "function" && renderStats();
          say(T("A dealer took my money and disappeared.", "Un dealer se llevó mi plata y desapareció.", "Um dealer pegou meu dinheiro e sumiu."));
          return jCard({ tag: TITLE, iconSrc: d.icon, title: T("Scammed", "Te estafaron", "Você foi enganado"), lead: T("He took your cash and never showed up. Lesson learned.", "Se llevó tu plata y nunca apareció. Aprendiste la lección.", "Ele pegou seu dinheiro e nunca apareceu. Lição aprendida."), rows: [["Money", `-${money(cost)}`]], choices: [["OK", () => openShop(id)]] });
        }
        if (x < 0.08) {
          say(T("It was a police sting.", "Era una trampa de la policía.", "Era uma armadilha da polícia."));
          return setTimeout(() => typeof arrest === "function" && arrest("attempted purchase of an illegal firearm", [2, 6]), 50);
        }
      }
      done(extra);
    };
    const confirm = (extra) =>
      jCard({
        tag: TITLE,
        iconSrc: kind === "p" ? partIcon({ id: key, color: extra }) : def.icon,
        title: def.n,
        lead: `${T("Price", "Precio", "Preço")}: ${money(cost)}`,
        rows: [["Money", money(state.money)]],
        choices: [[T("Buy it", "Comprarlo", "Comprar"), () => go(extra)], [T("Never mind", "Mejor no", "Deixa pra lá"), () => {}]],
      });
    if (kind === "p" && def.color)
      return socSelCard({
        tag: TITLE,
        icon: partIcon({ id: key }),
        title: def.n,
        lead: T("Pick the color of the switch.", "Elige el color del switch.", "Escolha a cor do switch."),
        label: T("Color:", "Color:", "Cor:"),
        opts: COLORS.map((c) => c[1]),
        btn: `${T("Buy", "Comprar", "Comprar")} · ${money(cost)}`,
        onGo: (i) => go(COLORS[i][0]),
      });
    confirm(null);
  }

  // ---- un arma: llevarla, cargador, accesorios, vender
  function openGun(uid) {
    const a = A();
    const gun = findGun(uid);
    if (!gun) return openArms();
    const d = gunDef(gun);
    const s = stats(gun);
    frame(gunName(gun), () => openArms(origin));
    const on = a.carry === uid;
    let html = `<div class="sec">${gunName(gun)}</div>`;
    html += `<div style="text-align:center;padding:6px 0 2px"><img src="${pic(gun)}" alt="" style="width:200px;height:180px;object-fit:contain;margin:0"></div>`;
    html += row("gInfo", pic(gun), statusTxt(s), `${PIECE(`${T("Power", "Poder", "Poder")} ${pct(s.power)}`)} · ${PIECE(`${T("Police heat", "Calor policial", "Atenção da polícia")} +${s.heat}`)}`, true);
    html += row("gCarry", E("1f45c"), on ? T("Put It Away", "Guardarla", "Guardar") : T("Carry It", "Llevarla encima", "Levar com você"), on ? T("You're armed", "Andas armado", "Você está armado") : T("Only one gun at a time", "Solo una arma a la vez", "Só uma arma por vez"));
    if (d.grp) {
      html += `<div class="sec">${T("Magazine", "Cargador", "Pente")}</div>`;
      const m = gun.mag && MAGS[gun.mag];
      html += row("gMag", m ? m.icon : MAG_ICON, m ? m.n : STD[d.grp], T("Tap to change", "Toca para cambiarlo", "Toque para trocar"));
      html += `<div class="sec">${T("Attachments", "Accesorios", "Acessórios")}</div>`;
      for (const sl of slotsOf(d)) {
        const at = gun.att[sl];
        html += row(`gS_${sl}`, at ? partIcon(at) : BLANK, at ? PARTS[at.id].n : SLOTS[sl], at ? `${PIECE(SLOTS[sl])}${at.color ? " · " + PIECE(colorName(at.color)) : ""}` : T("Empty. Tap to install", "Vacío. Toca para instalar", "Vazio. Toque para instalar"));
      }
    }
    html += `<div class="sec">${T("Get Rid of It", "Deshacerte de ella", "Se livrar dela")}</div>`;
    html += row("gSell", E("1f4b0"), T("Sell It", "Venderla", "Vender"), `${PIECE(money(Math.round(price(d.price) * 0.5)))}`);
    sList.innerHTML = html;
    sList.scrollTop = 0;
    tap("gCarry", () => {
      if (on) a.carry = null;
      else {
        a.carry = uid;
        window.FL_GANG_STOW && window.FL_GANG_STOW();
        say(T("I started carrying a gun.", "Empecé a andar armado.", "Comecei a andar armado."));
      }
      openGun(uid);
    });
    tap("gMag", () => pickMag(gun));
    for (const sl of d.grp ? slotsOf(d) : []) tap(`gS_${sl}`, () => pickPart(gun, sl));
    tap("gSell", () => {
      const cash = Math.round(price(d.price) * 0.5);
      jCard({
        tag: TITLE,
        iconSrc: pic(gun),
        title: gunName(gun),
        lead: T("Sell it for half of what it's worth? Attachments and the magazine go back to your stock.", "¿Venderla por la mitad de lo que vale? Los accesorios y el cargador vuelven a tu inventario.", "Vender pela metade do valor? Os acessórios e o pente voltam para o seu estoque."),
        rows: [["Money", `+${money(cash)}`]],
        choices: [
          [T("Sell it", "Venderla", "Vender"), () => {
            returnParts(gun);
            a.guns.splice(a.guns.indexOf(gun), 1);
            if (a.carry === uid) a.carry = null;
            state.money += cash;
            typeof renderStats === "function" && renderStats();
            typeof chaChing === "function" && chaChing();
            say(T("I sold a gun.", "Vendí un arma.", "Vendi uma arma."));
            openArms();
          }],
          [T("Keep it", "Quedármela", "Ficar com ela"), () => {}],
        ],
      });
    });
  }
  function returnParts(gun) {
    const a = A();
    for (const at of attList(gun)) a.parts.push(at);
    if (gun.mag) a.mags[gun.mag] = (a.mags[gun.mag] || 0) + 1;
    gun.att = {};
    gun.mag = null;
  }

  function pickMag(gun) {
    const a = A();
    const d = gunDef(gun);
    const have = Object.keys(a.mags).filter((k) => a.mags[k] > 0 && MAGS[k].grp === d.grp);
    const keys = ["", ...have.filter((k) => k !== gun.mag)];
    if (keys.length === 1 && !gun.mag) return plain(T("You don't have any other magazines for this gun. Buy some from a dealer.", "No tienes otros cargadores para esta arma. Cómpralos con un dealer.", "Você não tem outros pentes para esta arma. Compre com um dealer."));
    socSelCard({
      tag: TITLE,
      icon: MAG_ICON,
      title: T("Load a Magazine", "Cargar un cargador", "Carregar um pente"),
      lead: T("The magazine you're using goes back to your stock.", "El cargador que traes puesto vuelve a tu inventario.", "O pente que está em uso volta para o seu estoque."),
      label: T("Magazine:", "Cargador:", "Pente:"),
      opts: keys.map((k) => (k ? `${MAGS[k].n} ×${a.mags[k]}` : STD[d.grp])),
      btn: T("Load it", "Cargarlo", "Carregar"),
      onGo: (i) => {
        const k = keys[i];
        if (gun.mag) a.mags[gun.mag] = (a.mags[gun.mag] || 0) + 1;
        if (k) a.mags[k]--;
        gun.mag = k || null;
        say(T("I changed the magazine.", "Cambié el cargador.", "Troquei o pente."));
        openGun(gun.uid);
      },
    });
  }

  function pickPart(gun, slot) {
    const a = A();
    const d = gunDef(gun);
    const at = gun.att[slot];
    if (at)
      return jCard({
        tag: TITLE,
        iconSrc: partIcon(at),
        title: PARTS[at.id].n,
        lead: T("Take it off? It goes back to your parts stock.", "¿Quitarla? Vuelve a tu inventario de piezas.", "Tirar? Ela volta para o seu estoque de peças."),
        choices: [
          [T("Remove it", "Quitarla", "Tirar"), () => ((a.parts.push(at), delete gun.att[slot]), openGun(gun.uid))],
          [T("Keep it", "Dejarla", "Deixar"), () => {}],
        ],
      });
    const opts = a.parts.map((p, i) => [p, i]).filter(([p]) => PARTS[p.id].slot === slot && PARTS[p.id].grps.includes(d.grp));
    if (!opts.length) return plain(T("You don't have any parts for this slot. Ghost and the other dealers sell them.", "No tienes piezas para este lugar. Ghost y los otros dealers las venden.", "Você não tem peças para este lugar. O Ghost e os outros dealers vendem."));
    socSelCard({
      tag: TITLE,
      icon: partIcon(opts[0][0]),
      title: SLOTS[slot],
      lead: T("Pick what to install.", "Elige qué instalar.", "Escolha o que instalar."),
      label: T("Part:", "Pieza:", "Peça:"),
      opts: opts.map(([p]) => PARTS[p.id].n + (p.color ? ` (${colorName(p.color)})` : "")),
      btn: T("Install it", "Instalarla", "Instalar"),
      onGo: (i) => {
        const [p, idx] = opts[i];
        a.parts.splice(idx, 1);
        gun.att[slot] = p;
        say(T("I put an attachment on my gun.", "Le puse un accesorio a mi arma.", "Coloquei um acessório na minha arma."));
        openGun(gun.uid);
      },
    });
  }

  function openStock() {
    const a = A();
    frame(T("Magazines & Parts", "Cargadores y piezas", "Pentes e peças"), () => openArms(origin));
    let html = `<div class="sec">${T("Magazines", "Cargadores", "Pentes")}</div>`;
    const mk = Object.keys(a.mags).filter((k) => a.mags[k] > 0);
    html += mk.length ? mk.map((k) => row(`sM_${k}`, MAGS[k].icon, MAGS[k].n, `${PIECE(`×${a.mags[k]}`)}`, true)).join("") : row("sM0", E("1f4e6"), T("No magazines", "Sin cargadores", "Sem pentes"), T("Buy some from a dealer", "Cómpralos con un dealer", "Compre com um dealer"), true);
    html += `<div class="sec">${T("Parts", "Piezas", "Peças")}</div>`;
    html += a.parts.length ? a.parts.map((p, i) => row(`sP_${i}`, partIcon(p), PARTS[p.id].n, `${PIECE(SLOTS[PARTS[p.id].slot])}${p.color ? " · " + PIECE(colorName(p.color)) : ""}`, true)).join("") : row("sP0", E("1f4e6"), T("No parts", "Sin piezas", "Sem peças"), T("Buy some from a dealer", "Cómpralas con un dealer", "Compre com um dealer"), true);
    sList.innerHTML = html;
    sList.scrollTop = 0;
  }

  // ---- cacería (legal)
  function goHunting() {
    const a = A();
    const hunters = a.guns.filter((x) => gunDef(x).hunt);
    if (!hunters.length) return plain(T("You need a hunting weapon.", "Necesitas un arma de caza.", "Você precisa de uma arma de caça."));
    if (yr().hunts >= 2) return plain(T("You've already been hunting twice this year. The season's over.", "Ya fuiste de cacería dos veces este año. Se acabó la temporada.", "Você já foi caçar duas vezes este ano. A temporada acabou."));
    const go = () => {
      const best = hunters.reduce((m, x) => (stats(x).power + gunDef(x).hunt * 0.05 > stats(m).power + gunDef(m).hunt * 0.05 ? x : m), hunters[0]);
      yr().hunts++;
      const luck = 0.45 + stats(best).power * 1.5 + (state.stats ? (state.stats.Health || 50) / 400 : 0);
      const rows = [];
      if (rnd() < 0.03) {
        if (state.stats) state.stats.Health = clampN((state.stats.Health || 50) - ri(15, 35), 0, 100);
        typeof renderStats === "function" && renderStats();
        say(T("I got hurt in a hunting accident.", "Me lastimé en un accidente de cacería.", "Me machuquei num acidente de caça."));
        return jCard({ tag: TITLE, iconSrc: gunDef(best).icon, title: T("Hunting Accident", "Accidente de cacería", "Acidente de caça"), lead: T("You slipped in the woods and got hurt badly.", "Te resbalaste en el monte y te lastimaste feo.", "Você escorregou no mato e se machucou feio."), rows: [["Health", "-"]], choices: [["OK", openArms]] });
      }
      if (rnd() < luck) {
        const cash = ri(60, 320);
        state.money += cash;
        if (state.stats) state.stats.Happiness = clampN((state.stats.Happiness || 50) + ri(2, 6), 0, 100);
        typeof renderStats === "function" && renderStats();
        say(T("I went hunting and caught something big.", "Fui de cacería y cacé algo grande.", "Fui caçar e peguei algo grande."));
        rows.push(["Money", `+${money(cash)}`]);
        jCard({ tag: TITLE, iconSrc: gunDef(best).icon, title: T("Good Hunt", "Buena cacería", "Boa caçada"), lead: T("You came back with a trophy and a freezer full of meat.", "Volviste con un trofeo y un congelador lleno de carne.", "Você voltou com um troféu e um freezer cheio de carne."), rows, choices: [["OK", openArms]] });
      } else {
        if (state.stats) state.stats.Happiness = clampN((state.stats.Happiness || 50) + 1, 0, 100);
        typeof renderStats === "function" && renderStats();
        say(T("I went hunting but came back empty-handed.", "Fui de cacería pero volví con las manos vacías.", "Fui caçar mas voltei de mãos vazias."));
        jCard({ tag: TITLE, iconSrc: gunDef(best).icon, title: T("Empty-Handed", "Con las manos vacías", "De mãos vazias"), lead: T("You sat in the cold all day and saw nothing. Still, it was peaceful.", "Pasaste el día en el frío sin ver nada. Aun así, fue tranquilo.", "Você passou o dia no frio sem ver nada. Mesmo assim, foi tranquilo."), choices: [["OK", openArms]] });
      }
    };
    if (a.license) return go();
    const fee = price(60);
    jCard({
      tag: TITLE,
      iconSrc: E("1f333"),
      title: T("Hunting License", "Licencia de caza", "Licença de caça"),
      lead: T("You need a license to hunt legally.", "Necesitas una licencia para cazar legalmente.", "Você precisa de uma licença para caçar legalmente."),
      rows: [["Price", money(fee)]],
      choices: [
        [T("Buy the license", "Comprar la licencia", "Comprar a licença"), () => {
          if (state.money < fee) return plain(T("You don't have enough money for that.", "No te alcanza para eso.", "Você não tem dinheiro para isso."));
          state.money -= fee;
          a.license = true;
          typeof renderStats === "function" && renderStats();
          go();
        }],
        [T("Not now", "Ahora no", "Agora não"), () => {}],
      ],
    });
  }

  // ---------------------------------------------------------------- conexión con la pandilla y la policía
  // Se llama cuando te arrestan en algo ilegal. Si llevas un arma suma el cargo extra y te la quitan.
  function busted(crime) {
    const gun = carriedGun();
    if (!gun) return null;
    const a = A();
    const s = stats(gun);
    const base = (typeof CHARGES !== "undefined" && CHARGES[crime]) || [1, 4];
    const lo = base[0], hi = base[1];
    let charge, years;
    if (s.auto) (charge = `${crime} and possession of an automatic weapon`), (years = [lo + 6, hi + 10]);
    else if (s.illegal) (charge = `${crime} and illegal firearm possession`), (years = [lo + 3, hi + 6]);
    else (charge = `${crime} with a firearm`), (years = [lo + 2, hi + 4]); // arma legal usada en algo ilegal
    years[1] = Math.min(years[1], 40);
    a.guns.splice(a.guns.indexOf(gun), 1);
    a.carry = null;
    say(T("The police confiscated my gun.", "La policía me quitó el arma.", "A polícia apreendeu minha arma."));
    return { charge, years };
  }

  window.FL_ARMS = {
    open: openArms,
    state: () => state.arms,
    carried: () => {
      const g = carriedGun();
      return g ? { name: gunDef(g).n, ...stats(g) } : null;
    },
    power: () => {
      const g = carriedGun();
      return g ? stats(g).power : 0;
    },
    heat: () => {
      const g = carriedGun();
      return g ? stats(g).heat : 0;
    },
    stow: () => {
      A().carry = null;
    },
    busted,
  };

  // ---------------------------------------------------------------- arranque
  function boot() {
    if (typeof openActivities !== "function" || !document.getElementById("ageBtn") || typeof sList === "undefined") return setTimeout(boot, 60);
    const orig = openActivities;
    openActivities = function () {
      const r = orig.apply(this, arguments);
      try {
        const html = '<div class="sec">' + T("Guns", "Armas", "Armas") + "</div>" + row("actArms", DEALERS.ray.icon, TITLE, state.age < 16 ? `${T("Age", "Edad", "Idade")} 16+` : T("Legal store, street dealers and your arsenal", "Tienda legal, dealers de la calle y tu arsenal", "Loja legal, dealers da rua e seu arsenal"), state.age < 16, chev());
        const all = [...sList.querySelectorAll(".sec")].find((e) => "All" === e.textContent.trim());
        all ? all.insertAdjacentHTML("beforebegin", html) : sList.insertAdjacentHTML("afterbegin", html);
        const el = document.getElementById("actArms");
        if (el && state.age >= 16) el.onclick = () => (typeof play === "function" && play("choice"), openArms(null));
      } catch (e) {
        console.warn("[arms] menu", e);
      }
      return r;
    };
  }
  boot();
})();
