/**
 * Prepares the Places photos.
 *
 * The marquee cards are portrait (~270x360 on desktop, 132x176 on mobile), so
 * each source is scaled until it covers that box and then centre-cropped. Phone
 * originals are ~4000px and several megabytes each; at card size that is a lot
 * of bytes for no visible gain, so they are resampled to 2x the largest card.
 *
 * Sources live in assets-src/places/ (any names, any order — they are sorted),
 * output goes to public/assets/places/place-01.jpg …
 *
 * Re-run after adding or replacing photos:  npm run prep:places
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SRC_DIR = "assets-src/places";
const OUT_DIR = "public/assets/places";
const OUT_W = 540; // 2x the 270px desktop card
const OUT_H = 720; // 2x the 360px desktop card
const QUALITY = "80";

const sips = (...args) => execFileSync("sips", args, { stdio: "ignore" });

fs.mkdirSync(SRC_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const sources = fs
  .readdirSync(SRC_DIR)
  .filter((f) => /\.(jpe?g|png|heic|webp)$/i.test(f))
  .sort();

if (!sources.length) {
  console.log(`no photos in ${SRC_DIR}/ — nothing to do`);
  process.exit(0);
}

// clear previous output so removing a source doesn't leave an orphan behind
for (const f of fs.readdirSync(OUT_DIR)) {
  if (/^place-\d+\.jpg$/.test(f)) fs.unlinkSync(path.join(OUT_DIR, f));
}

let total = 0;
sources.forEach((file, i) => {
  const src = path.join(SRC_DIR, file);
  const out = path.join(OUT_DIR, `place-${String(i + 1).padStart(2, "0")}.jpg`);

  const dims = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", src])
    .toString()
    .match(/\d+/g)
    .slice(-2)
    .map(Number);
  const [w, h] = dims;

  // Resize only — no crop. The cards use object-fit: cover, so the browser does
  // the cropping, and it applies EXIF orientation while doing so. Cropping here
  // instead operates on unrotated stored pixels and lands on the wrong axis for
  // any photo carrying a rotation tag.
  const scale = Math.max(OUT_W / Math.min(w, h), OUT_H / Math.max(w, h));
  const longest = Math.ceil(Math.max(w, h) * Math.max(scale, OUT_H / Math.min(w, h)));

  sips("-s", "format", "jpeg", "-s", "formatOptions", QUALITY, "-Z", String(longest), src, "--out", out);

  const kb = fs.statSync(out).size / 1024;
  total += kb;
  const got = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", out])
    .toString()
    .match(/\d+/g)
    .slice(-2)
    .join("x");
  console.log(`${file.padEnd(18)} ${w}x${h} -> ${got}  ${kb.toFixed(0)}KB`);
});

console.log(`\n${sources.length} photos, ${(total / 1024).toFixed(1)}MB total`);
