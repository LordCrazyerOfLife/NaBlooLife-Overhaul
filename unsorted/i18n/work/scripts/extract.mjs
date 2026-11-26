// Extract player-facing text units from Free Life sources.
// node extract.mjs <srcDir> <out.jsonl>
// A unit is the text of one future DOM text node: template ${expr} -> {1},{2}..., HTML tags split units.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import * as acorn from "acorn";
import * as walk from "acorn-walk";

const [, , SRC, OUT, DICT_FILE] = process.argv;
// English word list (one per line) used to keep only real words among single-word strings
const DICT = new Set(DICT_FILE ? readFileSync(DICT_FILE, "utf8").split(/\r?\n/) : []);
const SKIP = new Set(["zxcvbn.js", "wiki-words.js", "gamertags.js", "social-names.js", "random-names.js", "names.js",
  "country-names.js", "cities.js", "email-pool.js", "artists.js", "i18n.js"]);
const files = [];
(function rec(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) { if (!["i18n", "_original"].includes(f)) rec(p); }
    else if (/\.(js|html)$/.test(f) && !SKIP.has(f)) files.push(p);
  }
})(SRC);

const CODEY = /[{};]\s*$|^\s*[.#][\w-]+\s*\{|:\s*[^ ]+;|\b(px|rem|rgba?|var\(|function|=>|return|const |let |\.png|\.jpg|\.svg|\.js\b|https?:|www\.)|[=<>]{2}|&&|\|\||^[\w$.-]+$|^[\w-]+(\s[\w-]+)?$(?<![A-Z][a-z]+ [a-z]+)/;
const units = new Map(); // text -> {file, n}
function add(text, file) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length < 4 || t.length > 600) return;
  const plain = t.replace(/\{\d+\}/g, "");
  const words = plain.match(/[A-Za-z][a-z']+/g) || [];
  // single lowercase dictionary words: values the game drops into sentences ("wife", "librarian")
  if (/^[a-z]{3,}$/.test(t)) {
    if (DICT.has(t) && !units.has(t)) units.set(t, { file, n: 1 });
    else if (units.has(t)) units.get(t).n++;
    return;
  }
  if (words.length < 2 ||!/[a-z]{2,}[ ,.!?'][^{]*[a-z]/i.test(plain)) return;
  if (CODEY.test(plain) && !/[.!?]["”]?$/.test(plain)) return;
  if (/[<>]|\\u|^[a-z-]+:|\b[a-z]+[A-Z][a-z]+\b(?!['’])/.test(plain) && !/[.!?]$/.test(plain)) return; // camelCase/tags
  if (/^[a-z0-9 _-]+$/.test(plain) && words.length > 12 && !/[.,]/.test(plain)) return; // bare word lists
  const u = units.get(t);
  if (u) u.n++;
  else units.set(t, { file, n: 1 });
}
// split a string with {n} tokens on HTML tags/entities into text-node units, renumbering tokens per unit
function emit(s, file) {
  for (const seg of s.split(/<[^>]*>|&[a-z]+;|&#\d+;/i)) {
    let i = 0;
    const map = {};
    add(seg.replace(/\{(\d+)\}/g, (_, d) => `{${(map[d] ??= ++i)}}`), file);
  }
}
function parse(code, file) {
  let ast;
  for (const sourceType of ["script", "module"]) {
    try { ast = acorn.parse(code, { ecmaVersion: "latest", sourceType, allowHashBang: true }); break; } catch {}
  }
  if (!ast) return console.error("parse failed:", file);
  walk.full(ast, (node) => {
    if (node.type === "Literal" && typeof node.value === "string") emit(node.value.replace(/\{(\d+)\}/g, "{ $1}"), file);
    else if (node.type === "TemplateLiteral") {
      let s = "";
      node.quasis.forEach((q, i) => {
        s += (q.value.cooked ?? q.value.raw).replace(/\{(\d+)\}/g, "{ $1}");
        if (i < node.expressions.length) s += `{${i + 1}}`;
      });
      emit(s, file);
    }
  });
}
for (const p of files) {
  const rel = relative(SRC, p).replace(/\\/g, "/");
  const txt = readFileSync(p, "utf8");
  if (p.endsWith(".html")) {
    for (const m of txt.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) parse(m[1], rel);
    const body = txt.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "");
    for (const m of body.matchAll(/>([^<>]+)</g)) emit(m[1], rel);
  } else parse(txt, rel);
}
const rows = [...units].map(([en, v], i) => ({ id: i + 1, en, file: v.file, n: v.n }));
writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
const byFile = {};
rows.forEach((r) => (byFile[r.file] = (byFile[r.file] || 0) + 1));
console.log(rows.length, "units;", rows.reduce((a, r) => a + r.en.split(" ").length, 0), "words");
console.log(Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 12).map((e) => e.join(":")).join("  "));
