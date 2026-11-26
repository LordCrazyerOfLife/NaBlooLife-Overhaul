// Replaces Capacitor's default launcher icons with unsorted/ui/navbarNabloo.png.
// Run after "npx cap add android".
import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const logo = join(here, "..", "unsorted", "ui", "navbarNabloo.png");
const res = join(here, "android", "app", "src", "main", "res");
const BG = "#1d3a6b";
const clear = { r: 0, g: 0, b: 0, alpha: 0 };

// the logo, centred on a square canvas, covering `share` of its width
async function draw(size, share, background) {
  const w = Math.round(size * share);
  const art = await sharp(logo).resize(w, w, { fit: "contain", background: clear }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: art, gravity: "centre" }])
    .png()
    .toBuffer();
}

const circle = (size) =>
  Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`);

for (const [density, scale] of Object.entries({ mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 })) {
  const dir = join(res, `mipmap-${density}`);
  if (!existsSync(dir)) throw new Error(`missing ${dir}: run "npx cap add android" first`);
  const size = 48 * scale;
  const square = await draw(size, 0.72, BG);
  writeFileSync(join(dir, "ic_launcher.png"), square);
  writeFileSync(
    join(dir, "ic_launcher_round.png"),
    await sharp(square).composite([{ input: circle(size), blend: "dest-in" }]).png().toBuffer(),
  );
  // adaptive icon (Android 8+): 108dp canvas, the launcher's mask may crop to the middle 66dp
  writeFileSync(join(dir, "ic_launcher_foreground.png"), await draw(108 * scale, 0.56, clear));
}

const color = join(res, "values", "ic_launcher_background.xml");
if (!existsSync(color)) throw new Error(`missing ${color}`);
writeFileSync(
  color,
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${BG}</color>\n</resources>\n`,
);
console.log("NaBlooLife launcher icons written");
