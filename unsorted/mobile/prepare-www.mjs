// Copies the game into mobile/www for Capacitor.
//   node prepare-www.mjs          copy
//   node prepare-www.mjs --dry    only count what would be copied
//   --webp   re-encode every .png as WebP KEEPING the .png name (WebViews sniff the bytes, so no code path changes)
//   --ogg    re-encode every .wav as .ogg (Vorbis) and rewrite ".wav" -> ".ogg" in the copied text files.
//            Android only: iOS WKWebView can't play Ogg Vorbis, so the iOS job must NOT pass --ogg.
// Left out: git/CI files, the service-worker packs (the app already has every file locally), art sources, scratch.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const out = join(here, "www");
const dry = process.argv.includes("--dry");
const doWebp = process.argv.includes("--webp");
const doOgg = process.argv.includes("--ogg");

const SKIP_DIRS = new Set([".git", ".github", "mobile", "node_modules", "packs", "_art-src", "_original", "_rea-export", "GRIDS", "dev", "work", "www"]);
const SKIP_PATHS = new Set(["i18n/work", "i18n/_backup"]);
const SKIP_FILES = /^(sw\.js|index\.html|CONTEXT\.md|README\.md|\.gitignore|cand_wide.*\.png|yl_preview\.png|p[0-9]\.png)$/i;
// scratch screenshots that were leaking into the app (comida/_numbered-1.png, ropa/_preview_120x54.png...)
const SKIP_SCRATCH = /^_(numbered|preview)/i;
const SKIP_EXT = /\.(bak|psd|tsv|md|log|map)$|\.bak-/i;

let files = 0;
let bytes = 0;
const filter = (src) => {
  const rel = relative(root, src).split(sep).join("/");
  if (!rel) return true;
  const name = rel.split("/").pop();
  const st = statSync(src);
  if (st.isDirectory()) {
    if (rel.indexOf("/") < 0 && SKIP_DIRS.has(name)) return false;
    if (SKIP_PATHS.has(rel)) return false;
    return true;
  }
  if (rel.indexOf("/") < 0 && SKIP_FILES.test(name)) return false;
  if (SKIP_EXT.test(name) || SKIP_SCRATCH.test(name)) return false;
  files++;
  bytes += st.size;
  return true;
};

if (!dry) {
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  // copy the top-level entries one by one: Node refuses to copy a folder into a subfolder of itself (mobile/www is inside the repo)
  for (const name of readdirSync(root)) {
    cpSync(join(root, name), join(out, name), { recursive: true, filter });
  }
  // the launcher only existed for the web service worker: the app opens the game directly
  writeFileSync(
    join(out, "index.html"),
    '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta http-equiv="refresh" content="0;url=game.html"><style>html,body{margin:0;height:100%;background:#1d3a6b}</style></head><body><script>location.replace("game.html")</script></body></html>',
  );
} else {
  const walk = (d) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (filter(p) && statSync(p).isDirectory()) walk(p);
    }
  };
  walk(root);
}
const walkFiles = (d, acc = []) => {
  for (const n of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, n.name);
    n.isDirectory() ? walkFiles(p, acc) : acc.push(p);
  }
  return acc;
};
const mb = (n) => (n / 1e6).toFixed(1) + " MB";

async function toWebp(all) {
  const { default: sharp } = await import("sharp");
  const pngs = all.filter((f) => /\.png$/i.test(f));
  let before = 0, after = 0, kept = 0;
  const one = async (f) => {
    const buf = readFileSync(f);
    before += buf.length;
    // animated PNG: sharp would keep only frame 1, leave it alone
    if (buf.includes("acTL")) { after += buf.length; kept++; return; }
    try {
      // small sprites/emoji: lossless (no smudging); big art: lossy q90 with alpha
      const opt = buf.length < 24000 ? { lossless: true, effort: 4 } : { quality: 90, alphaQuality: 100, effort: 4 };
      const out = await sharp(buf, { animated: false }).webp(opt).toBuffer();
      if (out.length < buf.length) { writeFileSync(f, out); after += out.length; }
      else { after += buf.length; kept++; }
    } catch (e) { after += buf.length; kept++; console.warn("webp skipped:", relative(out, f), e.message); }
  };
  for (let i = 0; i < pngs.length; i += 24) await Promise.all(pngs.slice(i, i + 24).map(one));
  console.log(`webp: ${pngs.length} png, ${mb(before)} -> ${mb(after)} (${kept} left as is)`);
}

function toOgg(all) {
  // the CI runner may not have ffmpeg: then keep every .wav (the game works the same, the app is just bigger)
  const probe = spawnSync("ffmpeg", ["-version"]);
  if (probe.error || probe.status !== 0) {
    console.warn("ogg: ffmpeg not found, keeping the .wav files");
    return;
  }
  const wavs = all.filter((f) => /\.wav$/i.test(f));
  const made = [];
  let before = 0, failed = 0;
  for (const f of wavs) {
    const dst = f.replace(/\.wav$/i, ".ogg");
    before += statSync(f).size;
    const r = spawnSync("ffmpeg", ["-y", "-v", "error", "-i", f, "-c:a", "libvorbis", "-q:a", "4", dst]);
    if (r.status === 0 && existsSync(dst)) made.push([f, dst]);
    else { failed++; console.warn("ogg failed:", relative(out, f), String(r.stderr || r.error || "").slice(0, 120)); }
  }
  // all or nothing: the references are rewritten from .wav to .ogg everywhere, so every sound must have converted
  if (failed) {
    for (const [, dst] of made) rmSync(dst, { force: true });
    console.warn(`ogg: ${failed} of ${wavs.length} wav failed, keeping every .wav`);
    return;
  }
  let after = 0;
  for (const [f, dst] of made) { after += statSync(dst).size; rmSync(f); }
  const TEXT = /\.(js|mjs|html|css|json)$/i;
  let rewritten = 0;
  for (const f of all) {
    if (!TEXT.test(f) || !existsSync(f)) continue;
    const t = readFileSync(f, "utf8");
    if (!t.includes(".wav")) continue;
    writeFileSync(f, t.replace(/\.wav(?![A-Za-z0-9_])/g, ".ogg"));
    rewritten++;
  }
  console.log(`ogg: ${made.length}/${wavs.length} wav, ${mb(before)} -> ${mb(after)}, refs rewritten in ${rewritten} files`);
}

if (!dry && (doWebp || doOgg)) {
  const all = walkFiles(out);
  if (doWebp) await toWebp(all);
  if (doOgg) toOgg(walkFiles(out));
}

console.log(`${dry ? "[dry] " : ""}${files} files, ${(bytes / 1e6).toFixed(1)} MB${dry ? "" : " -> mobile/www"}`);
if (!dry && !existsSync(join(out, "game.html"))) {
  console.error("game.html missing in www");
  process.exit(1);
}
