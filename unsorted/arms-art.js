/* [mod] Arte vectorial de las armas de arms.js (mod local). Todo SVG, sin imágenes externas.
 * Basado en _art-src/{glock-extended,draco,arp}.html (el usuario pasó las fotos de referencia: no agregar nada que no pidió).
 * API: FL_GUNART.uri({ gun, mag, att, color })  -> data URI listo para <img src>
 *   gun: glock | draco | mdraco | arp | marp | revolver | colt | pump | double | tactical | r22 | deer | bow
 *   mag: "std" | "ext" | "drum" | null (null = modelo base SIN cargador)
 *   att: { optic:"reddot"|"scope", muzzle:"comp"|"supp", grip:"vgrip", rail:"laser"|"light", stock:"brace", trigger:"switch"|"sear" }
 *   color: color del switch (red|blue|green|gold|pink|purple|orange|white)
 *   FL_GUNART.part(id, color) y FL_GUNART.magIcon(grp, type): piezas sueltas para listas.
 */
(() => {
  "use strict";
  const S = "#0b0c0e";

  // ---------------------------------------------------------------- piezas (se dibujan en su caja, origen arriba a la izquierda)
  const PART_DEFS =
    `<linearGradient id="p_m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c616b"/><stop offset=".5" stop-color="#34373e"/><stop offset="1" stop-color="#17181b"/></linearGradient>` +
    `<linearGradient id="p_d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3c3f46"/><stop offset="1" stop-color="#15161a"/></linearGradient>` +
    `<linearGradient id="p_l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a4a5a"/><stop offset="1" stop-color="#0f1c24"/></linearGradient>` +
    `<linearGradient id="p_g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a1b1f"/><stop offset=".5" stop-color="#3a3d44"/><stop offset="1" stop-color="#18191c"/></linearGradient>` +
    `<radialGradient id="p_cone" cx="0" cy=".5" r="1"><stop offset="0" stop-color="#fff6c4" stop-opacity=".9"/><stop offset="1" stop-color="#ffe27a" stop-opacity="0"/></radialGradient>`;
  const M = `fill="url(#p_m)" stroke="${S}" stroke-width="1.4" stroke-linejoin="round"`;
  const D = `fill="url(#p_d)" stroke="${S}" stroke-width="1.4" stroke-linejoin="round"`;
  const COL = {
    red: ["#ff6a5c", "#d93a2e", "#7c1710"], blue: ["#6aa2ff", "#2f6bd9", "#143a7c"], green: ["#6be59a", "#2fb066", "#146b3a"],
    gold: ["#ffe27a", "#e0a82a", "#8a5f10"], pink: ["#ffa6cf", "#e8639f", "#8a2c5c"], purple: ["#c19bff", "#8452d8", "#46228a"],
    orange: ["#ffbb6a", "#ee8a1f", "#8a4a08"], white: ["#ffffff", "#dfe2e8", "#8d929c"],
  };
  const PARTS = {
    // [ancho, alto, dibujo]
    reddot: [30, 17, () =>
      `<rect x="2" y="12" width="26" height="5" rx="1.5" ${D}/><rect x="3" y="2" width="24" height="12" rx="4" ${M}/>` +
      `<rect x="20" y="4" width="5" height="8" rx="1.5" fill="url(#p_l)" stroke="${S}" stroke-width="1"/><circle cx="22.5" cy="8" r="1.7" fill="#ff2a2a"/><circle cx="22.5" cy="8" r="3.2" fill="#ff2a2a" opacity=".25"/>` +
      `<circle cx="9" cy="6" r="2" fill="#17181b" stroke="${S}" stroke-width=".8"/><path d="M6 4 L16 4" stroke="#fff" stroke-width="1" opacity=".25"/>`],
    scope: [86, 22, () =>
      `<rect x="26" y="14" width="10" height="8" ${D}/><rect x="56" y="14" width="10" height="8" ${D}/>` +
      `<rect x="8" y="3" width="64" height="13" rx="6" ${M}/><rect x="0" y="1" width="18" height="17" rx="4" ${M}/><rect x="68" y="0" width="18" height="19" rx="4" ${M}/>` +
      `<ellipse cx="85" cy="9.5" rx="1.8" ry="7" fill="url(#p_l)" stroke="${S}" stroke-width="1"/><ellipse cx="1.5" cy="9.5" rx="1.5" ry="5.5" fill="url(#p_l)" stroke="${S}" stroke-width="1"/>` +
      `<rect x="36" y="-1" width="9" height="6" rx="2" ${D}/><path d="M14 5 L66 5" stroke="#fff" stroke-width="1.2" opacity=".22"/>`],
    comp: [16, 18, () =>
      `<rect x="0.7" y="0.7" width="14.6" height="16.6" rx="3" ${M}/><path d="M4 2 V16 M8 2 V16 M12 2 V16" stroke="${S}" stroke-width="1.8"/><path d="M2 3 H14" stroke="#fff" stroke-width="1" opacity=".25"/>`],
    supp: [64, 18, () =>
      `<rect x="0.7" y="2" width="8" height="14" rx="2" ${D}/><rect x="6" y="0.7" width="56" height="16.6" rx="5" ${M}/>` +
      `<path d="M16 1.5 V16.5 M26 1.5 V16.5 M36 1.5 V16.5 M46 1.5 V16.5" stroke="#8d929c" stroke-width="1" opacity=".7"/><ellipse cx="62" cy="9" rx="1.6" ry="5.2" fill="#08090b"/><path d="M10 4 H58" stroke="#fff" stroke-width="1.2" opacity=".2"/>`],
    vgrip: [20, 40, () =>
      `<rect x="1" y="0.7" width="18" height="7" rx="2" ${D}/><path d="M3 7 H17 L18 33 Q18 39 12 39 H8 Q2 39 2 33 Z" fill="url(#p_g)" stroke="${S}" stroke-width="1.4" stroke-linejoin="round"/>` +
      `<path d="M4 14 Q10 17 16 14 M4 20 Q10 23 16 20 M4 26 Q10 29 16 26" fill="none" stroke="${S}" stroke-width="1.2" opacity=".75"/><path d="M5 9 L5 33" stroke="#fff" stroke-width="1" opacity=".15"/>`],
    laser: [30, 16, () =>
      `<rect x="1" y="1" width="22" height="13" rx="3" ${M}/><rect x="4" y="3" width="10" height="3" rx="1" fill="#8d929c" opacity=".5"/>` +
      `<circle cx="24" cy="7.5" r="3.6" fill="#ff2a2a" stroke="${S}" stroke-width="1"/><circle cx="24" cy="7.5" r="6" fill="#ff2a2a" opacity=".25"/><path d="M27 7.5 H30" stroke="#ff5a4a" stroke-width="2" stroke-linecap="round"/>`],
    light: [34, 16, () =>
      `<path d="M26 8 L34 1 V15 Z" fill="url(#p_cone)"/><rect x="1" y="2" width="20" height="12" rx="3" ${M}/><rect x="19" y="0.7" width="9" height="14.6" rx="2.5" ${D}/>` +
      `<ellipse cx="27" cy="8" rx="1.8" ry="5.4" fill="#fff6c4" stroke="${S}" stroke-width="1"/><path d="M5 5 H17" stroke="#fff" stroke-width="1" opacity=".25"/>`],
    brace: [52, 30, () =>
      `<path d="M2 6 Q2 2 7 2 L44 4 Q50 4 50 10 L50 22 Q50 28 44 28 L7 29 Q2 29 2 24 Z" fill="url(#p_g)" stroke="${S}" stroke-width="1.5" stroke-linejoin="round"/>` +
      `<g fill="${S}" opacity=".55"><circle cx="12" cy="10" r="1.6"/><circle cx="20" cy="10" r="1.6"/><circle cx="28" cy="10" r="1.6"/><circle cx="36" cy="10" r="1.6"/><circle cx="12" cy="20" r="1.6"/><circle cx="20" cy="20" r="1.6"/><circle cx="28" cy="20" r="1.6"/><circle cx="36" cy="20" r="1.6"/></g>` +
      `<rect x="38" y="1" width="6" height="28" rx="2" fill="#2a2c31" stroke="${S}" stroke-width="1.2"/><path d="M6 4 L40 6" stroke="#fff" stroke-width="1" opacity=".2"/>`],
    sear: [18, 12, () =>
      `<rect x="1" y="1" width="16" height="10" rx="2.5" fill="url(#p_sg)" stroke="${S}" stroke-width="1.3"/><path d="M4 4 H14 M4 8 H14" stroke="#fff3b0" stroke-width="1" opacity=".8"/><circle cx="14" cy="6" r="1.4" fill="${S}"/>`],
  };
  const switchSvg = (color) => {
    const c = COL[color] || COL.red;
    return `<defs><linearGradient id="p_sw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset=".55" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient></defs>` +
      `<rect x="9" y="0.7" width="13" height="26" rx="3.5" fill="url(#p_sw)" stroke="${S}" stroke-width="1.6"/><rect x="1" y="8" width="11" height="9" rx="2.5" fill="url(#p_sw)" stroke="${S}" stroke-width="1.4"/><path d="M13 4 L13 23" stroke="#fff" stroke-width="1.4" opacity=".55"/>`;
  };
  const SEAR_DEFS = `<linearGradient id="p_sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset=".6" stop-color="#e0a82a"/><stop offset="1" stop-color="#8a5f10"/></linearGradient>`;
  const SWITCH_BOX = [32, 28];

  const put = (x, y, w, h, inner, rot) => {
    const g = `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" overflow="visible">${inner}</svg>`;
    return rot ? `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">${g}</g>` : g;
  };
  const drawPart = (id, [x, y], color) => {
    if (id === "switch") return put(x, y, SWITCH_BOX[0], SWITCH_BOX[1], switchSvg(color));
    const p = PARTS[id];
    return p ? put(x, y, p[0], p[1], p[2]()) : "";
  };

  // ---------------------------------------------------------------- GLOCK (viewBox nativa 200x200)
  const GLOCK_DEFS =
    `<linearGradient id="slide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b5f68"/><stop offset=".45" stop-color="#3a3d44"/><stop offset="1" stop-color="#24262b"/></linearGradient>` +
    `<linearGradient id="frame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d4047"/><stop offset="1" stop-color="#1f2125"/></linearGradient>` +
    `<linearGradient id="grip" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1c1e22"/><stop offset=".5" stop-color="#34373e"/><stop offset="1" stop-color="#1c1e22"/></linearGradient>` +
    `<linearGradient id="mag" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#17181b"/><stop offset=".45" stop-color="#2e3036"/><stop offset="1" stop-color="#141518"/></linearGradient>` +
    `<radialGradient id="gloss" cx=".3" cy=".15" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<pattern id="stip" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#000" opacity=".35"/><circle cx="3" cy="3" r=".6" fill="#fff" opacity=".06"/></pattern>` +
    `<filter id="blur"><feGaussianBlur stdDeviation="2.5"/></filter>`;
  const GLOCK_BODY =
    `<path d="M38 56 L84 56 L72 122 Q71 126 67 126 L40 126 Q35 126 36 121 Z" fill="url(#grip)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<path d="M45 74 L78 74 L70 116 L40 116 Z" fill="url(#stip)"/>` +
    `<path d="M80 82 Q76 86 79 90 Q75 95 78 99 Q74 104 77 108" fill="none" stroke="${S}" stroke-width="1.4" opacity=".7"/>` +
    `<path d="M39 58 Q30 60 29 67 Q35 65 42 65 Z" fill="#2a2c31" stroke="${S}" stroke-width="1.4" stroke-linejoin="round"/>` +
    `<path d="M40 56 L174 56 L174 70 L120 70 L112 76 L84 76 L84 66 L40 66 Z" fill="url(#frame)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<path d="M132 64 L170 64" stroke="${S}" stroke-width="1.2" stroke-dasharray="3 2.5"/>` +
    `<path d="M86 72 L86 90 Q86 98 96 98 L116 98 Q124 98 122 90 L118 74" fill="none" stroke="#24262b" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<path d="M86 72 L86 90 Q86 98 96 98 L116 98 Q124 98 122 90 L118 74" fill="none" stroke="${S}" stroke-width="1.2" stroke-linejoin="round" opacity=".8"/>` +
    `<path d="M101 74 Q106 80 104 90" fill="none" stroke="#14151a" stroke-width="3.6" stroke-linecap="round"/>` +
    `<path d="M38 30 L176 30 Q182 30 182 36 L182 54 Q182 60 176 60 L44 60 Q38 60 38 54 Z" fill="url(#slide)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<g stroke="#15161a" stroke-width="1.6" stroke-linecap="round"><path d="M46 36 L46 54"/><path d="M50 36 L50 54"/><path d="M54 36 L54 54"/><path d="M58 36 L58 54"/><path d="M62 36 L62 54"/><path d="M160 38 L160 52"/><path d="M164 38 L164 52"/><path d="M168 38 L168 52"/></g>` +
    `<rect x="102" y="33" width="34" height="10" rx="1.5" fill="#1a1b1f" stroke="${S}" stroke-width="1"/><rect x="106" y="35" width="26" height="5" rx="1" fill="#6b6f78" opacity=".55"/>` +
    `<rect x="40" y="25" width="10" height="6" rx="1" fill="#2a2c31" stroke="${S}" stroke-width="1.2"/><rect x="170" y="25" width="5" height="6" rx="1" fill="#2a2c31" stroke="${S}" stroke-width="1.2"/><circle cx="172.5" cy="27.5" r="1" fill="#fff" opacity=".8"/>` +
    `<rect x="180" y="40" width="4" height="10" rx="1" fill="#101114" stroke="${S}" stroke-width="1"/><rect x="96" y="62" width="10" height="3" rx="1" fill="#55585f"/>` +
    `<path d="M38 30 L176 30 Q182 30 182 36 L182 54 Q182 60 176 60 L44 60 Q38 60 38 54 Z" fill="url(#gloss)"/><path d="M44 33 L174 33" stroke="#fff" stroke-width="1.4" opacity=".25" stroke-linecap="round"/>`;
  const glockMag = (t) => {
    const tr = `<g transform="translate(-2 0) translate(58 120) skewX(4) translate(-58 -120)">`;
    if (t === "ext")
      return tr + `<path d="M44 120 L72 120 L58 182 Q57 186 53 186 L28 186 Q24 186 25 182 Z" fill="url(#mag)" stroke="${S}" stroke-width="1.6" stroke-linejoin="round"/><path d="M23 182 L60 182 Q63 182 62 185 L61 190 Q60 193 57 193 L24 193 Q20 193 21 190 L22 185 Q22 182 23 182 Z" fill="#26282d" stroke="${S}" stroke-width="1.6"/><g fill="${S}"><circle cx="63" cy="132" r="1.6"/><circle cx="61" cy="141" r="1.6"/><circle cx="59" cy="150" r="1.6"/><circle cx="57" cy="159" r="1.6"/><circle cx="55" cy="168" r="1.6"/></g><path d="M47 124 L36 176" stroke="#fff" stroke-width="1.2" opacity=".12" stroke-linecap="round"/></g>`;
    if (t === "drum")
      return `<path d="M44 118 L70 118 L68 146 L46 146 Z" fill="url(#mag)" stroke="${S}" stroke-width="1.6" stroke-linejoin="round"/>` +
        `<circle cx="56" cy="170" r="30" fill="url(#mag)" stroke="${S}" stroke-width="1.8"/><circle cx="56" cy="170" r="21" fill="#202228" stroke="${S}" stroke-width="1.4"/><circle cx="56" cy="170" r="7" fill="#3a3d44" stroke="${S}" stroke-width="1.2"/>` +
        `<g stroke="${S}" stroke-width="1.4" opacity=".8"><path d="M56 149 V163 M56 177 V191 M35 170 H49 M63 170 H77 M41 155 L51 165 M71 185 L61 175 M71 155 L61 165 M41 185 L51 175"/></g>` +
        `<path d="M36 156 Q40 146 52 142" fill="none" stroke="#fff" stroke-width="1.6" opacity=".18" stroke-linecap="round"/>`;
    return tr + `<path d="M44 120 L72 120 L66 146 Q65 150 61 150 L38 150 Q34 150 35 146 Z" fill="url(#mag)" stroke="${S}" stroke-width="1.6" stroke-linejoin="round"/><path d="M33 146 L67 146 Q70 146 69 149 L68 153 Q67 156 64 156 L35 156 Q31 156 32 152 L33 149 Q33 146 33 146 Z" fill="#26282d" stroke="${S}" stroke-width="1.6"/><g fill="${S}"><circle cx="66" cy="130" r="1.5"/><circle cx="64" cy="138" r="1.5"/></g></g>`;
  };

  // ---------------------------------------------------------------- DRACO (viewBox nativa 260x180)
  const DRACO_DEFS =
    `<linearGradient id="metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4d54"/><stop offset=".5" stop-color="#2c2e33"/><stop offset="1" stop-color="#18191c"/></linearGradient>` +
    `<linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2d59a"/><stop offset=".55" stop-color="#ddb46a"/><stop offset="1" stop-color="#b98a43"/></linearGradient>` +
    `<linearGradient id="grip" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3f1d18"/><stop offset=".5" stop-color="#6a3329"/><stop offset="1" stop-color="#3a1914"/></linearGradient>` +
    `<linearGradient id="mag" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#16171a"/><stop offset=".45" stop-color="#383a41"/><stop offset="1" stop-color="#131417"/></linearGradient>` +
    `<radialGradient id="gloss" cx=".3" cy=".1" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<pattern id="check" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 3 L3 0" stroke="#000" stroke-width=".6" opacity=".35"/></pattern>` +
    `<filter id="blur"><feGaussianBlur stdDeviation="3"/></filter>`;
  // cuerpo trasero común del Draco y el Mini Draco (empuñadura, guardamonte, cajón de mecanismos)
  const AK_REAR =
    `<path d="M58 78 L82 78 L72 126 Q71 131 66 131 L50 131 Q45 131 46 126 Z" fill="url(#grip)" stroke="#220d09" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<path d="M60 86 L78 86 L70 122 L52 122 Z" fill="url(#check)"/>` +
    `<path d="M84 80 L84 90 Q84 98 94 98 L104 98 Q110 98 108 90 L106 80" fill="none" stroke="#1f2125" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M95 80 Q99 86 97 93" fill="none" stroke="#111215" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M34 54 Q34 46 42 46 L172 46 L172 80 L40 80 Q34 80 34 74 Z" fill="url(#metal)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<path d="M40 46 Q42 40 50 40 L160 40 Q166 40 166 46" fill="#3a3d43" stroke="${S}" stroke-width="1.6"/><path d="M40 46 Q36 46 34 50" fill="none" stroke="${S}" stroke-width="1.4"/>` +
    `<rect x="98" y="52" width="30" height="7" rx="3.5" fill="#131417" stroke="${S}" stroke-width="1"/><rect x="122" y="51" width="8" height="9" rx="2" fill="#4a4d54" stroke="${S}" stroke-width="1"/>` +
    `<path d="M48 64 L92 66" stroke="#131417" stroke-width="3.6" stroke-linecap="round"/><path d="M48 63 L92 65" stroke="#7d818a" stroke-width="1" stroke-linecap="round" opacity=".6"/>` +
    `<g fill="#0f1013"><circle cx="112" cy="72" r="1.5"/><circle cx="120" cy="72" r="1.5"/><circle cx="150" cy="72" r="1.5"/><circle cx="160" cy="70" r="1.5"/><circle cx="44" cy="72" r="1.5"/></g>` +
    `<path d="M146 40 L148 33 L156 33 L158 40 Z" fill="#2c2e33" stroke="${S}" stroke-width="1.2"/>`;
  const DRACO_FRONT =
    `<rect x="170" y="44" width="50" height="9" rx="3" fill="url(#metal)" stroke="${S}" stroke-width="1.4"/>` +
    `<path d="M170 52 L216 52 Q222 52 222 58 L222 94 Q222 100 216 100 L206 100 Q200 100 200 94 L200 86 Q196 80 188 80 L170 80 Z" fill="url(#wood)" stroke="#7a5420" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<g stroke="#a87a35" stroke-width=".9" opacity=".7" fill="none"><path d="M174 58 Q196 56 216 60"/><path d="M174 66 Q190 64 214 70"/><path d="M204 76 Q210 84 206 96"/></g><path d="M174 55 L216 55" stroke="#fff" stroke-width="1.2" opacity=".35"/>` +
    `<path d="M220 48 L232 48 L232 64 L220 64 Z" fill="url(#metal)" stroke="${S}" stroke-width="1.4"/><path d="M222 48 L222 30 Q222 26 226 26 Q230 26 230 30 L230 48" fill="#2c2e33" stroke="${S}" stroke-width="1.4"/><circle cx="226" cy="34" r="2" fill="#131417"/>` +
    `<rect x="232" y="54" width="14" height="8" rx="2" fill="url(#metal)" stroke="${S}" stroke-width="1.4"/>` +
    `<path d="M244 51 L254 51 L256 58 L254 65 L244 65 Z" fill="#1b1c20" stroke="${S}" stroke-width="1.4" stroke-linejoin="round"/><path d="M248 52 L248 64 M251 52 L251 64" stroke="#55585f" stroke-width="1"/>`;
  // Mini Draco: sin tubo largo ni guardamanos grande; solo un tope de madera chico, mira y boca más cerca
  const MDRACO_FRONT =
    `<rect x="170" y="44" width="30" height="9" rx="3" fill="url(#metal)" stroke="${S}" stroke-width="1.4"/>` +
    `<path d="M170 52 L192 52 Q198 52 198 58 L198 82 Q198 88 192 88 L186 88 Q182 88 182 84 L182 80 Q178 76 172 76 L170 76 Z" fill="url(#wood)" stroke="#7a5420" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<path d="M174 56 L194 56" stroke="#fff" stroke-width="1.2" opacity=".35"/><path d="M186 70 Q190 76 188 84" fill="none" stroke="#a87a35" stroke-width=".9" opacity=".7"/>` +
    `<path d="M198 48 L210 48 L210 64 L198 64 Z" fill="url(#metal)" stroke="${S}" stroke-width="1.4"/><path d="M200 48 L200 32 Q200 28 204 28 Q208 28 208 32 L208 48" fill="#2c2e33" stroke="${S}" stroke-width="1.4"/><circle cx="204" cy="36" r="2" fill="#131417"/>` +
    `<rect x="210" y="54" width="8" height="8" rx="2" fill="url(#metal)" stroke="${S}" stroke-width="1.4"/>` +
    `<path d="M216 51 L226 51 L228 58 L226 65 L216 65 Z" fill="#1b1c20" stroke="${S}" stroke-width="1.4" stroke-linejoin="round"/><path d="M220 52 L220 64 M223 52 L223 64" stroke="#55585f" stroke-width="1"/>`;
  const akMag = (t) => {
    if (t === "ext") // el "banana grande" de la referencia (40 balas)
      return `<path d="M108 78 L140 78 Q146 118 172 150 Q175 154 171 157 L148 168 Q144 170 141 166 Q120 128 108 78 Z" fill="url(#mag)" stroke="#0b0c0e" stroke-width="1.8" stroke-linejoin="round"/><g fill="none" stroke="#0b0c0e" stroke-width="1.3" opacity=".7"><path d="M118 84 Q126 124 148 160"/><path d="M126 84 Q134 122 156 156"/><path d="M134 84 Q141 120 163 152"/></g><g fill="none" stroke="#fff" stroke-width="1" opacity=".13"><path d="M120 84 Q128 124 150 160"/><path d="M128 84 Q136 122 158 156"/></g>`;
    if (t === "drum")
      return `<path d="M110 78 L140 78 L138 104 L112 104 Z" fill="url(#mag)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"/>` +
        `<circle cx="126" cy="132" r="34" fill="url(#mag)" stroke="${S}" stroke-width="2"/><circle cx="126" cy="132" r="24" fill="#202228" stroke="${S}" stroke-width="1.5"/><circle cx="126" cy="132" r="8" fill="#3a3d44" stroke="${S}" stroke-width="1.3"/>` +
        `<g stroke="${S}" stroke-width="1.5" opacity=".8"><path d="M126 108 V124 M126 140 V156 M102 132 H118 M134 132 H150 M109 115 L120 126 M143 149 L132 138 M143 115 L132 126 M109 149 L120 138"/></g>` +
        `<path d="M100 118 Q106 106 120 100" fill="none" stroke="#fff" stroke-width="1.8" opacity=".18" stroke-linecap="round"/>`;
    // 30 balas: banana más corta
    return `<path d="M108 78 L140 78 Q143 104 158 128 Q161 132 157 135 L137 146 Q133 148 130 144 Q116 118 108 78 Z" fill="url(#mag)" stroke="#0b0c0e" stroke-width="1.8" stroke-linejoin="round"/><g fill="none" stroke="#0b0c0e" stroke-width="1.3" opacity=".7"><path d="M118 84 Q124 112 140 136"/><path d="M126 84 Q131 110 148 132"/></g><g fill="none" stroke="#fff" stroke-width="1" opacity=".13"><path d="M120 84 Q126 112 142 136"/></g>`;
  };

  // ---------------------------------------------------------------- ARP (viewBox nativa 300x180)
  const ARP_DEFS =
    `<linearGradient id="metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f535b"/><stop offset=".5" stop-color="#30333a"/><stop offset="1" stop-color="#1a1b1f"/></linearGradient>` +
    `<linearGradient id="dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#383b42"/><stop offset="1" stop-color="#17181b"/></linearGradient>` +
    `<linearGradient id="mag" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#16171a"/><stop offset=".45" stop-color="#363840"/><stop offset="1" stop-color="#131417"/></linearGradient>` +
    `<radialGradient id="gloss" cx=".3" cy=".1" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<pattern id="foam" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".7" fill="#000" opacity=".35"/></pattern>` +
    `<filter id="blur"><feGaussianBlur stdDeviation="3"/></filter>`;
  const AR_REAR =
    `<rect x="58" y="54" width="22" height="12" rx="2" fill="url(#metal)" stroke="${S}" stroke-width="1.4"/>` +
    `<rect x="16" y="50" width="46" height="20" rx="8" fill="#1d1e22" stroke="${S}" stroke-width="1.6"/><rect x="16" y="50" width="46" height="20" rx="8" fill="url(#foam)"/><path d="M22 53 L56 53" stroke="#fff" stroke-width="1.2" opacity=".12"/>` +
    `<path d="M86 84 L108 84 L98 128 Q97 132 93 132 L76 132 Q72 132 73 128 Z" fill="url(#dark)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<g stroke="${S}" stroke-width=".9" opacity=".5"><path d="M90 90 L82 126"/><path d="M96 90 L88 126"/><path d="M102 90 L94 126"/></g>` +
    `<path d="M106 86 L106 94 Q106 102 114 102 L120 102" fill="none" stroke="#24262b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M112 86 Q116 91 114 97" fill="none" stroke="#111215" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M82 66 L154 66 L154 84 L82 84 Q78 84 78 78 L78 70 Q78 66 82 66 Z" fill="url(#metal)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<path d="M118 66 L118 86 M150 66 L150 86" stroke="${S}" stroke-width="1.2" opacity=".6"/><circle cx="90" cy="74" r="2.4" fill="#111215"/><path d="M90 74 L96 70" stroke="#9ba0a8" stroke-width="1.4" stroke-linecap="round"/>` +
    `<path d="M78 46 L156 46 L156 66 L78 66 Z" fill="url(#metal)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<rect x="106" y="52" width="30" height="8" rx="1.5" fill="#16171a" stroke="${S}" stroke-width="1"/><circle cx="148" cy="56" r="4" fill="#2a2c31" stroke="${S}" stroke-width="1.2"/><path d="M70 44 L82 44 L82 50 L70 50 Z" fill="#2a2c31" stroke="${S}" stroke-width="1.2"/>`;
  const arRail = (end) =>
    `<rect x="78" y="40" width="${end - 78}" height="7" rx="1.5" fill="url(#dark)" stroke="${S}" stroke-width="1.4"/><path d="M82 43.5 L${end - 4} 43.5" stroke="${S}" stroke-width="2.2" stroke-dasharray="3 2.2"/>`;
  const ARP_FRONT =
    arRail(254) +
    `<path d="M156 47 L252 47 Q256 47 256 51 L256 68 Q256 72 252 72 L156 72 Z" fill="url(#dark)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<g fill="#0d0e10"><rect x="164" y="54" width="14" height="4" rx="2"/><rect x="184" y="54" width="14" height="4" rx="2"/><rect x="204" y="54" width="14" height="4" rx="2"/><rect x="224" y="54" width="14" height="4" rx="2"/><rect x="164" y="62" width="14" height="4" rx="2"/><rect x="184" y="62" width="14" height="4" rx="2"/><rect x="204" y="62" width="14" height="4" rx="2"/><rect x="224" y="62" width="14" height="4" rx="2"/></g>` +
    `<path d="M160 50 L252 50" stroke="#fff" stroke-width="1" opacity=".12"/><rect x="256" y="54" width="12" height="10" rx="2" fill="#1b1c20" stroke="${S}" stroke-width="1.4"/>`;
  // Mini ARP: guardamanos corto (la mitad), boca con apagallamas
  const MARP_FRONT =
    arRail(204) +
    `<path d="M156 47 L202 47 Q206 47 206 51 L206 68 Q206 72 202 72 L156 72 Z" fill="url(#dark)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<g fill="#0d0e10"><rect x="164" y="54" width="12" height="4" rx="2"/><rect x="182" y="54" width="12" height="4" rx="2"/><rect x="164" y="62" width="12" height="4" rx="2"/><rect x="182" y="62" width="12" height="4" rx="2"/></g>` +
    `<path d="M160 50 L202 50" stroke="#fff" stroke-width="1" opacity=".12"/>` +
    `<rect x="206" y="55" width="10" height="9" rx="2" fill="#26282d" stroke="${S}" stroke-width="1.4"/>` +
    `<path d="M214 52 L230 52 L232 59.5 L230 67 L214 67 Z" fill="#1b1c20" stroke="${S}" stroke-width="1.4" stroke-linejoin="round"/><path d="M219 53 V66 M224 53 V66" stroke="#55585f" stroke-width="1.1"/><path d="M215 55 H229" stroke="#fff" stroke-width="1" opacity=".18"/>`;
  const arMag = (t) => {
    if (t === "ext")
      return `<path d="M120 84 L148 84 L153 166 Q153 170 149 170 L127 172 Q123 172 123 168 Z" fill="url(#mag)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"/><g stroke="${S}" stroke-width="1.1" opacity=".7"><path d="M123 104 L150 103"/><path d="M123 114 L150 113"/><path d="M124 124 L151 123"/><path d="M124 134 L151 133"/><path d="M124 144 L152 143"/><path d="M124 154 L152 153"/></g><path d="M127 90 L130 164" stroke="#fff" stroke-width="1.2" opacity=".13"/>`;
    if (t === "drum")
      return `<path d="M122 84 L148 84 L147 108 L123 108 Z" fill="url(#mag)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"/>` +
        `<circle cx="135" cy="138" r="32" fill="url(#mag)" stroke="${S}" stroke-width="2"/><circle cx="135" cy="138" r="22" fill="#202228" stroke="${S}" stroke-width="1.5"/><circle cx="135" cy="138" r="8" fill="#3a3d44" stroke="${S}" stroke-width="1.3"/>` +
        `<g stroke="${S}" stroke-width="1.5" opacity=".8"><path d="M135 116 V130 M135 146 V160 M113 138 H127 M143 138 H157 M119 122 L129 132 M151 154 L141 144 M151 122 L141 132 M119 154 L129 144"/></g>` +
        `<path d="M110 124 Q116 112 130 108" fill="none" stroke="#fff" stroke-width="1.8" opacity=".18" stroke-linecap="round"/>`;
    return `<path d="M120 84 L148 84 L152 148 Q152 152 148 152 L126 154 Q122 154 122 150 Z" fill="url(#mag)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"/><g stroke="${S}" stroke-width="1.1" opacity=".7"><path d="M123 104 L150 103"/><path d="M123 112 L150 111"/><path d="M124 120 L151 119"/><path d="M124 128 L151 127"/></g><path d="M127 90 L130 146" stroke="#fff" stroke-width="1.2" opacity=".13"/>`;
  };

  // ---------------------------------------------------------------- armas legales (dibujadas nuevas, mismo estilo)
  const LEGAL_DEFS =
    `<linearGradient id="lm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a6f79"/><stop offset=".5" stop-color="#3b3e45"/><stop offset="1" stop-color="#1c1d21"/></linearGradient>` +
    `<linearGradient id="ls" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8bcc4"/><stop offset=".5" stop-color="#868b95"/><stop offset="1" stop-color="#4e525a"/></linearGradient>` +
    `<linearGradient id="lw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c98e56"/><stop offset=".55" stop-color="#9a6234"/><stop offset="1" stop-color="#5e3919"/></linearGradient>` +
    `<linearGradient id="lp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#43464d"/><stop offset="1" stop-color="#1a1b1e"/></linearGradient>` +
    `<radialGradient id="gloss" cx=".3" cy=".1" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<filter id="blur"><feGaussianBlur stdDeviation="3"/></filter>`;
  const LM = `fill="url(#lm)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"`;
  const LS = `fill="url(#ls)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"`;
  const LW = `fill="url(#lw)" stroke="#3a210c" stroke-width="1.8" stroke-linejoin="round"`;
  const LP = `fill="url(#lp)" stroke="${S}" stroke-width="1.8" stroke-linejoin="round"`;
  const grain = (d) => `<g fill="none" stroke="#3a210c" stroke-width="1" opacity=".45">${d}</g>`;
  const shadow = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="5" fill="#000" opacity=".28" filter="url(#blur)"/>`;

  const REVOLVER =
    shadow(124, 142, 100) +
    // empuñadura de madera
    `<path d="M44 70 Q32 78 28 116 Q27 128 40 129 L62 129 Q72 129 72 120 L78 76 Z" ${LW}/>` + grain(`<path d="M40 84 Q36 106 38 124"/><path d="M50 82 Q46 104 48 124"/>`) +
    `<circle cx="52" cy="104" r="3.2" fill="#c9ccd2" stroke="${S}" stroke-width="1.2"/>` +
    // martillo
    `<path d="M48 52 L38 40 Q44 34 54 38 L60 50 Z" ${LM}/><path d="M42 41 L50 40" stroke="#fff" stroke-width="1" opacity=".3"/>` +
    // armazón
    `<path d="M50 48 L156 48 L156 76 L104 76 L98 86 L76 86 L68 74 L56 70 Q48 66 50 58 Z" ${LS}/>` +
    // tambor con acanaladuras
    `<rect x="94" y="42" width="52" height="38" rx="8" ${LS}/><g fill="#1a1b1f" stroke="${S}" stroke-width="1"><rect x="102" y="48" width="8" height="26" rx="4"/><rect x="116" y="48" width="8" height="26" rx="4"/><rect x="130" y="48" width="8" height="26" rx="4"/></g>` +
    // cañón con costilla, varilla extractora y mira
    `<rect x="154" y="48" width="86" height="13" rx="3" ${LS}/><rect x="154" y="62" width="64" height="8" rx="3.5" ${LS}/><path d="M156 51 L238 51" stroke="#fff" stroke-width="1.2" opacity=".4"/>` +
    `<path d="M226 48 L234 48 L232 40 L228 40 Z" fill="#26282d" stroke="${S}" stroke-width="1.2"/><rect x="238" y="50" width="4" height="9" rx="1" fill="#101114" stroke="${S}" stroke-width="1"/>` +
    // guardamonte y gatillo
    `<path d="M80 86 Q78 108 100 108 Q116 108 116 90" fill="none" stroke="#6c717b" stroke-width="5.5" stroke-linecap="round"/><path d="M80 86 Q78 108 100 108 Q116 108 116 90" fill="none" stroke="${S}" stroke-width="1.2" opacity=".8"/>` +
    `<path d="M97 80 Q101 88 99 96" fill="none" stroke="#2a2c31" stroke-width="3.4" stroke-linecap="round"/>` +
    `<path d="M50 48 L156 48" stroke="#fff" stroke-width="1.3" opacity=".35"/><path d="M40 36 L242 36 L242 90 L40 90 Z" fill="url(#gloss)" opacity=".5"/>`;

  const COLT =
    shadow(120, 150, 92) +
    `<path d="M44 78 L82 78 L74 130 Q73 136 67 136 L48 136 Q42 136 43 130 Z" ${LM}/>` +
    `<path d="M50 84 L76 84 L70 128 L50 128 Z" ${LW}/>` + grain(`<path d="M56 88 L52 124"/><path d="M64 88 L60 124"/>`) + `<circle cx="63" cy="106" r="3" fill="#c9ccd2" stroke="${S}" stroke-width="1.1"/>` +
    // martillo + cola
    `<path d="M44 58 L36 46 Q42 40 52 44 L56 56 Z" ${LM}/><path d="M42 62 Q34 64 32 72 Q40 70 46 70 Z" ${LM}/>` +
    // armazón + guardamonte
    `<path d="M44 58 L168 58 L168 74 L122 74 L116 82 L88 82 L84 74 L44 72 Z" ${LM}/>` +
    `<path d="M88 78 L88 94 Q88 104 100 104 L118 104 Q126 104 124 94 L120 78" fill="none" stroke="#2a2c31" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M88 78 L88 94 Q88 104 100 104 L118 104 Q126 104 124 94 L120 78" fill="none" stroke="${S}" stroke-width="1.2" opacity=".8"/>` +
    `<path d="M102 78 Q106 86 104 94" fill="none" stroke="#14151a" stroke-width="3.6" stroke-linecap="round"/>` +
    // corredera plateada
    `<path d="M42 34 L220 34 Q226 34 226 40 L226 56 Q226 62 220 62 L48 62 Q42 62 42 56 Z" ${LS}/>` +
    `<g stroke="#3b3e45" stroke-width="1.6" stroke-linecap="round"><path d="M52 40 L52 56"/><path d="M57 40 L57 56"/><path d="M62 40 L62 56"/><path d="M67 40 L67 56"/><path d="M72 40 L72 56"/></g>` +
    `<rect x="110" y="38" width="38" height="9" rx="1.5" fill="#25262a" stroke="${S}" stroke-width="1"/>` +
    `<rect x="44" y="28" width="9" height="7" rx="1" fill="#2a2c31" stroke="${S}" stroke-width="1.2"/><rect x="214" y="28" width="6" height="7" rx="1" fill="#2a2c31" stroke="${S}" stroke-width="1.2"/>` +
    `<rect x="222" y="42" width="6" height="12" rx="2" fill="#101114" stroke="${S}" stroke-width="1"/><path d="M48 38 L218 38" stroke="#fff" stroke-width="1.4" opacity=".4"/>` +
    `<rect x="40" y="132" width="40" height="8" rx="2" fill="#26282d" stroke="${S}" stroke-width="1.4"/>` +
    `<path d="M40 24 L228 24 L228 70 L40 70 Z" fill="url(#gloss)" opacity=".5"/>`;

  const PUMP =
    shadow(170, 112, 150) +
    `<path d="M10 44 L92 38 L92 70 L40 88 Q18 96 12 84 Q6 64 10 44 Z" ${LW}/>` + grain(`<path d="M16 50 Q40 52 88 46"/><path d="M14 62 Q44 66 88 58"/>`) +
    `<rect x="4" y="46" width="10" height="38" rx="3" fill="#26282d" stroke="${S}" stroke-width="1.5"/>` +
    `<rect x="138" y="40" width="186" height="10" rx="3" ${LM}/><rect x="138" y="53" width="150" height="8" rx="4" ${LM}/>` +
    `<path d="M140 43 L322 43" stroke="#fff" stroke-width="1.2" opacity=".3"/>` +
    `<path d="M92 36 L142 36 L142 66 L92 66 Z" ${LM}/><rect x="104" y="44" width="30" height="7" rx="3" fill="#15161a" stroke="${S}" stroke-width="1"/>` +
    `<path d="M164 52 L226 52 Q234 52 234 60 Q234 68 226 68 L164 68 Q156 68 156 60 Q156 52 164 52 Z" ${LW}/>` + grain(`<path d="M166 56 H224"/><path d="M166 62 H224"/>`) +
    `<path d="M94 66 L94 82 Q94 92 106 92 L128 92 Q136 92 134 82 L132 66" fill="none" stroke="#2a2c31" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M110 66 Q114 74 112 82" fill="none" stroke="#14151a" stroke-width="3.4" stroke-linecap="round"/>` +
    `<path d="M318 36 L324 36 L322 40 L320 40 Z" fill="#c9ccd2" stroke="${S}" stroke-width="1"/>` +
    `<path d="M4 30 L326 30 L326 98 L4 98 Z" fill="url(#gloss)" opacity=".4"/>`;

  const DOUBLE =
    shadow(170, 116, 150) +
    `<path d="M8 50 L90 42 L90 72 L52 90 Q22 104 12 92 Q4 74 8 50 Z" ${LW}/>` + grain(`<path d="M14 56 Q40 56 86 48"/><path d="M12 68 Q42 70 86 60"/>`) +
    `<rect x="2" y="50" width="10" height="38" rx="3" fill="#26282d" stroke="${S}" stroke-width="1.5"/>` +
    `<rect x="116" y="38" width="208" height="10" rx="3" ${LM}/><rect x="116" y="49" width="208" height="10" rx="3" ${LM}/><path d="M118 41 L322 41" stroke="#fff" stroke-width="1.2" opacity=".3"/>` +
    `<rect x="116" y="35" width="206" height="3" fill="#c9ccd2" stroke="${S}" stroke-width="1"/>` +
    `<path d="M88 40 L122 40 L122 70 L88 70 Z" ${LS}/><path d="M94 46 Q104 44 112 48 M94 56 Q104 54 112 58" fill="none" stroke="#3b3e45" stroke-width="1.3" opacity=".7"/><circle cx="116" cy="62" r="3.5" fill="#c9ccd2" stroke="${S}" stroke-width="1.2"/>` +
    `<path d="M136 58 L190 58 Q198 58 198 66 Q198 74 190 74 L136 74 Q128 74 128 66 Q128 58 136 58 Z" ${LW}/>` + grain(`<path d="M138 63 H190"/><path d="M138 69 H190"/>`) +
    `<path d="M90 70 L90 86 Q90 96 102 96 L122 96 Q130 96 128 86 L126 70" fill="none" stroke="#2a2c31" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M104 70 Q106 78 105 86 M113 70 Q115 78 114 86" fill="none" stroke="#14151a" stroke-width="2.8" stroke-linecap="round"/>` +
    `<path d="M2 28 L326 28 L326 104 L2 104 Z" fill="url(#gloss)" opacity=".4"/>`;

  const TACTICAL =
    shadow(170, 124, 150) +
    // culata de polímero
    `<path d="M8 40 L96 40 L96 70 L52 70 L40 96 Q36 104 28 104 L14 104 Q6 104 8 94 Z" ${LP}/><path d="M18 50 L84 50 M18 60 L74 60" stroke="${S}" stroke-width="1.2" opacity=".6"/><rect x="4" y="44" width="10" height="44" rx="3" fill="#15161a" stroke="${S}" stroke-width="1.4"/>` +
    // riel superior
    `<rect x="92" y="28" width="86" height="7" rx="1.5" ${LM}/><path d="M96 31.5 L174 31.5" stroke="${S}" stroke-width="2" stroke-dasharray="3 2.2"/>` +
    `<path d="M92 34 L156 34 L156 68 L92 68 Z" ${LM}/><rect x="104" y="42" width="30" height="7" rx="3" fill="#15161a" stroke="${S}" stroke-width="1"/>` +
    // empuñadura de pistola
    `<path d="M96 68 L118 68 L110 108 Q109 112 104 112 L92 112 Q87 112 88 108 Z" ${LP}/><g stroke="${S}" stroke-width=".9" opacity=".5"><path d="M98 76 L92 104"/><path d="M104 76 L98 104"/></g>` +
    `<path d="M120 70 L120 86 Q120 94 130 94 L146 94" fill="none" stroke="#2a2c31" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` +
    // cañón + tubo + protector térmico
    `<rect x="152" y="38" width="172" height="9" rx="3" ${LM}/><rect x="152" y="50" width="146" height="8" rx="4" ${LM}/>` +
    `<path d="M178 33 L252 33 L252 52 L178 52 Z" ${LM}/><g fill="#0d0e10">${Array.from({ length: 8 }, (_, i) => `<rect x="${184 + i * 8.4}" y="38" width="4.6" height="3.4" rx="1.4"/><rect x="${184 + i * 8.4}" y="44" width="4.6" height="3.4" rx="1.4"/>`).join("")}</g>` +
    `<path d="M168 56 L228 56 Q236 56 236 64 Q236 72 228 72 L168 72 Q160 72 160 64 Q160 56 168 56 Z" ${LP}/><g stroke="${S}" stroke-width="1.1" opacity=".6"><path d="M176 58 V70 M186 58 V70 M196 58 V70 M206 58 V70 M216 58 V70"/></g>` +
    `<rect x="320" y="36" width="5" height="13" rx="1.5" fill="#101114" stroke="${S}" stroke-width="1"/>` +
    `<path d="M4 24 L326 24 L326 112 L4 112 Z" fill="url(#gloss)" opacity=".35"/>`;

  const R22 =
    shadow(176, 112, 160) +
    `<path d="M8 46 L100 40 L100 60 L56 66 L30 98 Q22 106 12 102 Q6 90 8 46 Z" ${LW}/>` + grain(`<path d="M14 50 Q50 50 96 44"/><path d="M12 62 Q50 62 94 54"/>`) + `<rect x="4" y="48" width="9" height="40" rx="3" fill="#26282d" stroke="${S}" stroke-width="1.4"/>` +
    `<path d="M98 40 L150 40 L150 62 L98 62 Z" ${LM}/><rect x="108" y="46" width="26" height="6" rx="2" fill="#15161a" stroke="${S}" stroke-width="1"/>` +
    `<path d="M134 38 L134 30 Q134 26 138 26 L142 26 Q146 26 146 30 L146 38" fill="#2c2e33" stroke="${S}" stroke-width="1.4"/><circle cx="143" cy="30" r="3.5" fill="#c9ccd2" stroke="${S}" stroke-width="1.2"/>` +
    `<rect x="148" y="46" width="188" height="7" rx="3" ${LM}/><path d="M150 48.5 L334 48.5" stroke="#fff" stroke-width="1.1" opacity=".3"/>` +
    `<path d="M150 56 L246 56 L246 70 Q246 76 240 76 L190 76 Q182 76 176 70 L150 62 Z" ${LW}/><path d="M104 62 L104 74 Q104 82 112 82 L128 82 Q134 82 132 74 L130 62" fill="none" stroke="#2a2c31" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M116 62 Q119 70 117 76" fill="none" stroke="#14151a" stroke-width="3" stroke-linecap="round"/>` +
    `<rect x="326" y="38" width="4" height="7" rx="1" fill="#c9ccd2" stroke="${S}" stroke-width="1"/><path d="M4 22 L340 22 L340 90 L4 90 Z" fill="url(#gloss)" opacity=".35"/>`;

  const DEER =
    shadow(180, 116, 164) +
    `<path d="M8 44 L102 38 L102 62 L58 70 L36 108 Q28 118 14 114 Q4 106 8 44 Z" ${LW}/>` + grain(`<path d="M14 50 Q54 50 98 42"/><path d="M12 64 Q54 64 96 54"/><path d="M16 80 Q40 80 60 70"/>`) + `<rect x="3" y="48" width="10" height="48" rx="3" fill="#26282d" stroke="${S}" stroke-width="1.5"/>` +
    `<path d="M100 38 L158 38 L158 64 L100 64 Z" ${LM}/><rect x="110" y="44" width="30" height="7" rx="3" fill="#15161a" stroke="${S}" stroke-width="1"/>` +
    `<path d="M120 36 L120 26 L128 24 L130 36" fill="#2c2e33" stroke="${S}" stroke-width="1.4"/><path d="M128 24 L146 24" stroke="${S}" stroke-width="2.4" stroke-linecap="round"/><circle cx="148" cy="24" r="4" fill="#c9ccd2" stroke="${S}" stroke-width="1.3"/>` +
    `<rect x="156" y="44" width="196" height="9" rx="3.5" ${LM}/><path d="M158 47 L350 47" stroke="#fff" stroke-width="1.2" opacity=".3"/>` +
    `<path d="M156 58 L262 58 L262 72 Q262 80 254 80 L200 80 Q186 80 178 72 L156 64 Z" ${LW}/>` + grain(`<path d="M164 64 H252"/><path d="M170 72 H250"/>`) +
    `<path d="M104 64 L104 78 Q104 88 114 88 L132 88 Q140 88 138 78 L136 64" fill="none" stroke="#2a2c31" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M118 64 Q122 72 120 80" fill="none" stroke="#14151a" stroke-width="3.2" stroke-linecap="round"/>` +
    `<rect x="342" y="42" width="5" height="13" rx="1.5" fill="#101114" stroke="${S}" stroke-width="1"/><rect x="338" y="36" width="5" height="8" rx="1" fill="#c9ccd2" stroke="${S}" stroke-width="1"/>` +
    `<path d="M4 20 L352 20 L352 96 L4 96 Z" fill="url(#gloss)" opacity=".35"/>`;

  const BOW =
    shadow(100, 188, 64) +
    // brazos del arco recurvo
    `<path d="M84 14 C140 30 150 80 120 100 C150 120 140 170 84 186" fill="none" stroke="#3a210c" stroke-width="13" stroke-linecap="round"/>` +
    `<path d="M84 14 C140 30 150 80 120 100 C150 120 140 170 84 186" fill="none" stroke="url(#lw)" stroke-width="9" stroke-linecap="round"/>` +
    `<path d="M88 16 C138 32 146 80 118 99" fill="none" stroke="#fff" stroke-width="1.6" opacity=".25" stroke-linecap="round"/>` +
    // cuerda
    `<path d="M84 14 L72 100 L84 186" fill="none" stroke="#efe9d6" stroke-width="2.2" stroke-linejoin="round"/>` +
    // empuñadura/riser
    `<rect x="110" y="78" width="22" height="44" rx="8" fill="url(#lp)" stroke="${S}" stroke-width="1.8"/><path d="M114 84 V116" stroke="#fff" stroke-width="1.4" opacity=".18"/><g stroke="${S}" stroke-width="1.2" opacity=".6"><path d="M112 90 H130 M112 98 H130 M112 106 H130"/></g>` +
    `<path d="M132 94 L148 94 L148 100 L132 100 Z" fill="#c9ccd2" stroke="${S}" stroke-width="1.2"/>` +
    // puntas
    `<circle cx="84" cy="14" r="5" fill="#26282d" stroke="${S}" stroke-width="1.4"/><circle cx="84" cy="186" r="5" fill="#26282d" stroke="${S}" stroke-width="1.4"/>`;

  // ---------------------------------------------------------------- definiciones de cada arma
  // anchors: [x, y] de la esquina arriba-izquierda de la pieza en coordenadas nativas del arma
  const GUNS = {
    glock: {
      vb: [-14, 8, 266, 200], defs: GLOCK_DEFS, body: GLOCK_BODY, mag: glockMag, ground: { std: 156, ext: 196, drum: 204 }, cx: 100, rx: 70,
      anchors: { optic: [98, 14], comp: [182, 33], supp: [182, 33], rail: [128, 69], trigger: [8, 33] }, behind: false,
    },
    draco: {
      vb: [-22, 14, 320, 170], defs: DRACO_DEFS, rear: AK_REAR, front: DRACO_FRONT, mag: akMag, ground: { std: 150, ext: 172, drum: 170 }, cx: 130, rx: 100,
      anchors: { optic: [74, 24], scope: [50, 17], comp: [256, 48], supp: [256, 48], grip: [176, 82], rail: [204, 100], stock: [-18, 38], trigger: [38, 60] },
    },
    mdraco: {
      vb: [-22, 14, 290, 170], defs: DRACO_DEFS, rear: AK_REAR, front: MDRACO_FRONT, mag: akMag, ground: { std: 150, ext: 172, drum: 170 }, cx: 120, rx: 90,
      anchors: { optic: [74, 24], scope: [48, 17], comp: [228, 48], supp: [228, 48], grip: [168, 82], rail: [174, 88], stock: [-18, 38], trigger: [38, 60] },
    },
    arp: {
      vb: [-18, 14, 360, 180], defs: ARP_DEFS, rear: AR_REAR, front: ARP_FRONT, mag: arMag, ground: { std: 156, ext: 176, drum: 174 }, cx: 150, rx: 120,
      anchors: { optic: [104, 24], scope: [92, 18], comp: [268, 50], supp: [268, 50], grip: [204, 72], rail: [214, 72], stock: [10, 42], trigger: [84, 70] },
    },
    marp: {
      vb: [-18, 14, 308, 180], defs: ARP_DEFS, rear: AR_REAR, front: MARP_FRONT, mag: arMag, ground: { std: 156, ext: 176, drum: 174 }, cx: 130, rx: 105,
      anchors: { optic: [104, 24], scope: [92, 18], comp: [232, 50], supp: [232, 50], grip: [166, 72], rail: [168, 72], stock: [10, 42], trigger: [84, 70] },
    },
    revolver: { vb: [14, 24, 240, 130], defs: LEGAL_DEFS, solid: REVOLVER },
    colt: { vb: [18, 12, 220, 140], defs: LEGAL_DEFS, solid: COLT },
    pump: { vb: [0, 20, 334, 100], defs: LEGAL_DEFS, solid: PUMP },
    double: { vb: [-4, 22, 334, 100], defs: LEGAL_DEFS, solid: DOUBLE },
    tactical: { vb: [0, 16, 334, 106], defs: LEGAL_DEFS, solid: TACTICAL },
    r22: { vb: [0, 14, 346, 90], defs: LEGAL_DEFS, solid: R22 },
    deer: { vb: [-2, 12, 360, 112], defs: LEGAL_DEFS, solid: DEER },
    bow: { vb: [50, 0, 120, 200], defs: LEGAL_DEFS, solid: BOW },
  };

  function render(spec) {
    const g = GUNS[spec.gun];
    if (!g) return "";
    const att = spec.att || {};
    const [x, y, w, h] = g.vb;
    let inner;
    if (g.solid) inner = g.solid;
    else {
      const mag = spec.mag === undefined ? "std" : spec.mag;
      const A = g.anchors;
      const parts = [];
      const behind = [];
      for (const [slot, id] of Object.entries(att)) {
        const pos = A[slot === "trigger" ? "trigger" : id === "vgrip" ? "grip" : id === "laser" || id === "light" ? "rail" : slot === "optic" ? (id === "scope" ? "scope" : "optic") : slot === "muzzle" ? id : slot];
        if (!pos) continue;
        // glock: el switch va pegado atrás del slide; ak/ar: el auto sear va junto al selector
        (slot === "stock" ? behind : parts).push(drawPart(id, pos, spec.color));
      }
      const ground = mag ? g.ground[mag] : spec.gun === "glock" ? 130 : 132;
      inner =
        `<ellipse cx="${g.cx}" cy="${ground + 4}" rx="${g.rx}" ry="5" fill="#000" opacity=".28" filter="url(#blur)"/>` +
        behind.join("") + (mag ? g.mag(mag) : "") + (g.rear || "") + (g.front || "") + (g.body || "") + parts.join("");
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}"><defs>${g.defs}${PART_DEFS}${SEAR_DEFS}</defs>${inner}</svg>`;
  }
  const toUri = (svg) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  const cache = {};
  const uri = (spec) => {
    const key = JSON.stringify(spec);
    return cache[key] || (cache[key] = toUri(render(spec)));
  };
  // pieza suelta centrada (para listas y popups)
  const part = (id, color) => {
    const p = id === "switch" ? [SWITCH_BOX[0], SWITCH_BOX[1]] : PARTS[id];
    if (!p) return "";
    const [w, h] = p;
    const s = Math.max(w, h) + 10;
    const ox = -(s - w) / 2, oy = -(s - h) / 2;
    return toUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${ox} ${oy} ${s} ${s}"><defs>${PART_DEFS}${SEAR_DEFS}</defs>${drawPart(id, [0, 0], color)}</svg>`);
  };
  // cargador suelto: se dibuja con su arma y se recorta a la zona del cargador
  const MAG_VIEW = { glock: [14, 112, 80, 100], ak: [96, 70, 90, 110], ar: [104, 78, 76, 100] };
  const magIcon = (grp, type) => {
    const gun = grp === "glock" ? "glock" : grp === "ak" ? "draco" : "arp";
    const g = GUNS[gun];
    const [x, y, w, h] = MAG_VIEW[grp];
    return toUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}"><defs>${g.defs}</defs>${g.mag(type)}</svg>`);
  };

  window.FL_GUNART = { render, uri, part, magIcon, GUNS: Object.keys(GUNS), PARTS: Object.keys(PARTS).concat("switch") };
})();
