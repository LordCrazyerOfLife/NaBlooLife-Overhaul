/* NaBlooLife local mod: language support (English default, Español, Português BR).
 *
 * How it works: the game builds its UI in English. This file watches the DOM and swaps
 * each visible text node for its translation from i18n/<lang>.js. The game's code still
 * reads English: textContent/innerText return the original text for translated nodes,
 * so checks like `"ASSETS" === sTitle.textContent` keep working.
 *
 * Dictionary format (i18n/es.js):
 *   FL_I18N.add("es", { exact: { "Occupation": "Ocupación" }, re: [["^Age: (\\d+) years?$", "Edad: $1 años"]] });
 * - exact keys match case-insensitively; ALL-CAPS sources get ALL-CAPS output.
 * - trailing ":" "!" "?" "." "..." are retried without the punctuation.
 * - in re rules, each captured group is translated too when it is an exact key.
 */
(() => {
  const LANGS = { en: "English", es: "Español", pt: "Português (Brasil)" };
  let lang = "en";
  try {
    lang = JSON.parse(localStorage.getItem("bitlifepp-settings") || "{}").lang || "en";
  } catch {}
  if (!LANGS[lang]) lang = "en";

  const dicts = {};
  const I18N = (window.FL_I18N = {
    LANGS,
    lang,
    add(code, d) {
      const cur = (dicts[code] ||= { exact: new Map(), re: [], start: new Map(), inner: new Map() });
      for (const [k, v] of Object.entries(d.exact || {})) {
        const key = norm(k).toLowerCase();
        if (!d.weak || !cur.exact.has(key)) cur.exact.set(key, v); // weak = bulk events, never override UI
      }
      for (const [src, out] of d.re || []) cur.re.push([new RegExp(src, "i"), out]);
      // templates: [english with {tokens}, translation, bucketWord, startsWithLiteral(1/0)]
      for (const [en, tr, word, atStart] of d.tpl || []) {
        const idx = atStart ? cur.start : cur.inner;
        if (!idx.has(word)) idx.set(word, []);
        idx.get(word).push({ en, tr, rx: null, toks: null });
      }
    },
    t: (s) => translate(s) ?? s,
  });

  // ---- templates: "I let {full} copy my homework." matches "I let Ana Diaz copy my homework." ----
  const TOK = /\{[^{}\s]+\}/g;
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  function compile(t) {
    t.toks = t.en.match(TOK) || [];
    t.lit = t.en.replace(TOK, "").replace(/[^A-Za-z]/g, "").length; // letras literales = que tan especifica es
    let src = "", last = 0, m;
    TOK.lastIndex = 0;
    while ((m = TOK.exec(t.en))) {
      src += escRe(t.en.slice(last, m.index)) + (/[A-Za-z]$/.test(t.en.slice(0, m.index)) ? "(.*?)" : "(.+?)");
      last = m.index + m[0].length;
    }
    t.rx = new RegExp("^" + src + escRe(t.en.slice(last)) + "$", "i");
  }
  const firstWord = (s) => (/^[^A-Za-z]*([A-Za-z']+)/.exec(s) || [])[1]?.toLowerCase();
  const wordsOf = (g) => g.trim().split(/\s+/).length;
  // devuelve {t, m} si la plantilla encaja; las muy genericas ("{1} and the {2}") no se comen frases largas sin traducir
  function matchTpl(t, s, d) {
    if (!t.rx) compile(t);
    const m = t.rx.exec(s);
    if (!m) return null;
    if (t.lit < 10)
      for (let i = 1; i < m.length; i++) if (wordsOf(m[i]) >= 3 && capture(m[i], d) == null) return null;
    return m;
  }
  // ---- plurales y articulos: "audición{2}" con {2}="s" -> "audiciones"; "the cop" -> "el policía" ----
  const plural = (w) => {
    if (lang === "pt") {
      if (/ão$/i.test(w)) return w.slice(0, -2) + "ões";
      if (/m$/i.test(w)) return w.slice(0, -1) + "ns";
      if (/[rz]$/i.test(w)) return w + "es";
      if (/l$/i.test(w)) return w.slice(0, -1) + "is";
      return w + "s";
    }
    if (/ión$/i.test(w)) return w.slice(0, -3) + "iones";
    if (/z$/i.test(w)) return w.slice(0, -1) + "ces";
    if (/[^aeiouáéíóú]$/i.test(w)) return w + "es";
    return w + "s";
  };
  const FEM = /(a|ción|sión|dad|tad|umbre|ie|ã|agem|ção|são|dade)$/i;
  const NOFEM = /(día|mapa|planeta|problema|sistema|idioma|programa|tema|poema|clima|dia|mapa|sofá)$/i;
  const ART = {
    es: { the: ["el", "la"], a: ["un", "una"], an: ["un", "una"], my: ["mi", "mi"], your: ["tu", "tu"], his: ["su", "su"], her: ["su", "su"], their: ["su", "su"] },
    pt: { the: ["o", "a"], a: ["um", "uma"], an: ["um", "uma"], my: ["meu", "minha"], your: ["seu", "sua"], his: ["seu", "sua"], her: ["seu", "sua"], their: ["seu", "sua"] },
  };
  const artWord = (art, noun) => {
    const row = ART[lang]?.[art.toLowerCase()];
    if (!row) return null;
    const fem = (FEM.test(noun) && !NOFEM.test(noun)) || /^mãe$/i.test(noun);
    return row[fem ? 1 : 0];
  };
  // traduce un valor capturado: palabra suelta ("man"), frase del diccionario, oracion con regla o "el/un + sustantivo"
  function capture(g, d) {
    if (!hasLetters.test(g)) return null;
    let x = exact(g, d);
    if (x == null && wordsOf(g) >= 2) x = translateNested(g);
    if (x == null) {
      const a = /^(the|an?|my|your|his|her|their)\s+(.+)$/i.exec(g);
      const noun = a && exact(a[2], d);
      const w = noun && artWord(a[1], noun.split(" ")[0]);
      if (w) x = w + " " + noun[0].toLowerCase() + noun.slice(1);
    }
    return x;
  }
  function fill(t, m, d) {
    const val = {};
    t.toks.forEach((k, i) => (val[k] ??= m[i + 1]));
    // "word{n}" con {n} = "s"/"es": pluraliza la palabra traducida en vez de pegarle la "s"
    const tr = t.tr.replace(/([A-Za-zÀ-ÿ]+)(\{[^{}\s]+\})/g, (all, w, k) =>
      /^(s|es)$/i.test(val[k] ?? "") ? plural(w) + "§§" : (val[k] === "" ? w + "§§" : all),
    );
    return tr
      .replace(TOK, (k) => {
        const g = val[k] ?? k;
        let x = capture(g, d);
        if (x == null) return g;
        // "my dog" -> "mi perro", not "mi Perro": keep the captured value's lowercase start
        if (/^[a-z]/.test(g) && /^[A-ZÀ-Þ][a-zà-ÿ]/.test(x)) x = x[0].toLowerCase() + x.slice(1);
        return x;
      })
      .replace(/§§/g, "")
      .replace(lang === "es" ? /\b([Aa]|[Dd]e) el\b/g : /$^/, (_, p) => (p[0] === "a" || p[0] === "A" ? p + "l" : p + "l")); // a el -> al, de el -> del
  }
  // gana la plantilla con mas texto literal (la mas especifica), no la primera que encaje
  function templates(s, d) {
    let best = null, bm = null;
    const scan = (list) => {
      if (!list) return;
      for (const t of list) {
        const m = matchTpl(t, s, d);
        if (m && (!best || t.lit > best.lit)) (best = t), (bm = m);
      }
    };
    scan(d.start.get(firstWord(s)));
    const seen = new Set();
    for (const w of s.toLowerCase().match(/[a-z']+/g) || []) {
      if (seen.has(w)) continue;
      seen.add(w);
      scan(d.inner.get(w));
    }
    return best ? fill(best, bm, d) : null;
  }

  const norm = (s) => s.replace(/\s+/g, " ").trim();
  const hasLetters = /[A-Za-z]/;
  const isCaps = (s) => s === s.toUpperCase() && s !== s.toLowerCase();
  const matchCase = (src, out) =>
    isCaps(src) && src.length > 1
      ? out.toUpperCase()
      : /^[A-Z]/.test(src) && /^[a-zà-ÿ]/.test(out)
        ? out[0].toUpperCase() + out.slice(1)
        : out;

  function exact(s, d) {
    const v = d.exact.get(s.toLowerCase());
    return v === undefined ? null : matchCase(s, v);
  }

  function translate(raw) {
    if (lang === "en" || !raw || !hasLetters.test(raw)) return null;
    const d = dicts[lang];
    if (!d) return null;
    const s = norm(raw);
    let out = exact(s, d);
    if (out != null) return out;
    const p = /^(.*?)(\s*(?:\.\.\.|…|[:!?.]+))$/.exec(s);
    if (p && (out = exact(p[1], d)) != null) return out + p[2];
    if ((out = templates(s, d)) != null) return matchCase(s, out);
    for (const [re, rep] of d.re) {
      const m = re.exec(s);
      if (!m) continue;
      return matchCase(
        s,
        rep.replace(/\$(\d)/g, (_, i) => {
          const g = m[+i] ?? "";
          return (hasLetters.test(g) && (exact(g, d) ?? translateNested(g))) || g;
        }),
      );
    }
    return null;
  }
  // captured groups may themselves be sentences with a rule (one level deep is enough)
  let depth = 0;
  function translateNested(g) {
    if (depth) return null;
    depth++;
    try {
      return translate(g);
    } finally {
      depth--;
    }
  }

  if (lang === "en") return;
  document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;

  // ---- keep English visible to the game's own code ----
  const ORIG = new WeakMap(); // Text node -> { src, out }
  const tcDesc = Object.getOwnPropertyDescriptor(Node.prototype, "textContent");
  const itDesc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerText");
  const rawText = (n) => tcDesc.get.call(n);
  const srcOf = (n) => {
    const r = ORIG.get(n),
      cur = rawText(n);
    return r && r.out === cur ? r.src : cur;
  };
  function englishText(node) {
    if (node.nodeType === 3) return srcOf(node);
    const w = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let s = "",
      n;
    while ((n = w.nextNode())) s += srcOf(n);
    return s;
  }
  Object.defineProperty(Node.prototype, "textContent", {
    configurable: true,
    get() {
      const t = this.nodeType;
      return t === 1 || t === 3 || t === 11 ? englishText(this) : tcDesc.get.call(this);
    },
    set: tcDesc.set,
  });
  Object.defineProperty(HTMLElement.prototype, "innerText", {
    configurable: true,
    get() {
      const vis = itDesc.get.call(this);
      // innerText keeps layout whitespace; only remap when something inside was translated
      const tr = rawText(this),
        en = englishText(this);
      return tr === en ? vis : en;
    },
    set: itDesc.set,
  });

  // ---- DOM translation ----
  const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "SELECT", "OPTION", "CODE", "PRE", "NOSCRIPT"]);
  const skipEl = (el) => {
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      if (SKIP.has(e.tagName) || e.isContentEditable || e.hasAttribute("data-noi18n")) return true;
    }
    return false;
  };
  function doText(n) {
    const cur = rawText(n);
    const r = ORIG.get(n);
    if (r && r.out === cur) return;
    if (!hasLetters.test(cur) || skipEl(n.parentElement)) return;
    const out = translate(cur);
    if (out == null) return;
    const lead = /^\s*/.exec(cur)[0],
      trail = /\s*$/.exec(cur)[0];
    const val = lead + out + trail;
    ORIG.set(n, { src: cur, out: val });
    n.data = val;
  }
  const ATTRS = ["placeholder", "title", "aria-label"];
  const ORIG_ATTR = new WeakMap();
  function doAttrs(el) {
    if (skipEl(el) && el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") return;
    for (const a of ATTRS) {
      const v = el.getAttribute(a);
      if (!v) continue;
      const seen = ORIG_ATTR.get(el) || {};
      if (seen[a] === v) continue;
      const out = translate(v);
      if (out == null) continue;
      seen[a] = out;
      ORIG_ATTR.set(el, seen);
      el.setAttribute(a, out);
    }
  }
  function walk(root) {
    if (root.nodeType === 3) return doText(root);
    if (root.nodeType !== 1 && root.nodeType !== 11) return;
    if (root.nodeType === 1) doAttrs(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n;
    while ((n = w.nextNode())) n.nodeType === 3 ? doText(n) : doAttrs(n);
  }
  const mo = new MutationObserver((recs) => {
    for (const r of recs) {
      if (r.type === "childList") r.addedNodes.forEach(walk);
      else if (r.type === "characterData") doText(r.target);
      else if (r.type === "attributes") doAttrs(r.target);
    }
  });
  mo.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRS,
  });
  addEventListener("DOMContentLoaded", () => walk(document.body));

  // native dialogs
  for (const f of ["alert", "confirm", "prompt"]) {
    const o = window[f];
    window[f] = function (msg, ...rest) {
      return o.call(this, typeof msg === "string" ? I18N.t(msg) : msg, ...rest);
    };
  }
})();
