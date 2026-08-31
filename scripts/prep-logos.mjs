/**
 * Prepares company logos for the experience cards.
 *
 * Logos are used as supplied — original colours and background. This squares
 * them up, optionally insets the artwork so it isn't jammed against the tile
 * edge, and scales down so the site isn't shipping 1300px art for a 48px tile.
 *
 * The padding colour is sampled from the source's own top-left corner, so a
 * logo on a coloured field keeps that field rather than gaining white bars.
 *
 * Sources live in assets-src/logos/, output goes to public/assets/logos/.
 * Re-run after adding or replacing one:  npm run prep:logos
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { execFileSync } from "node:child_process";

const SRC_DIR = "assets-src/logos";
const OUT_DIR = "public/assets/logos";
const SIZE = 256; // plenty for a 48px tile at 2x

/** Per-logo inset: the share of the tile left as margin on each side. */
const INSET = {
  westernbell: 0.09,
  aegon: 0.08,
};

const sips = (...args) => execFileSync("sips", args, { stdio: "ignore" });

/** Read the top-left corner colour, so padding matches the logo's own field. */
function cornerColour(src) {
  const tmp = "/tmp/logo-corner.png";
  // Downscale to a small grid and read its top-left pixel: that averages the
  // corner region without needing a crop offset (sips crops from the centre).
  sips("-s", "format", "png", "-z", "16", "16", src, "--out", tmp);

  const buf = fs.readFileSync(tmp);
  let pos = 8;
  let colourType = 6;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") colourType = data[9];
    if (type === "IDAT") idat.push(data);
    if (type === "IEND") break;
    pos += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  // The very first pixel of the first scanline is unfiltered under every PNG
  // filter type (its left/above neighbours are all zero), so it can be read
  // directly. Byte 0 is the filter tag. greyscale=0, rgb=2, rgba=6.
  const [r, g, b] =
    colourType === 0 ? [raw[1], raw[1], raw[1]] : [raw[1], raw[2], raw[3]];
  return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

fs.mkdirSync(SRC_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const sources = fs
  .readdirSync(SRC_DIR)
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .sort();

if (!sources.length) {
  console.log(`no logos in ${SRC_DIR}/ — nothing to do`);
  process.exit(0);
}

for (const file of sources) {
  const name = file.replace(/\.[^.]+$/, "");
  const src = path.join(SRC_DIR, file);
  const out = path.join(OUT_DIR, `${name}.png`);
  const inset = INSET[name] ?? 0;
  const inner = Math.round(SIZE * (1 - inset * 2));
  const pad = cornerColour(src);

  // fit the artwork inside `inner`, then pad the canvas out to a square
  sips("-s", "format", "png", "-Z", String(inner), src, "--out", out);
  sips("-p", String(SIZE), String(SIZE), "--padColor", pad, out, "--out", out);

  console.log(
    `${file.padEnd(22)} inset ${String(Math.round(inset * 100)).padStart(2)}%  pad #${pad}  -> ${out}  ${(
      fs.statSync(out).size / 1024
    ).toFixed(0)}KB`,
  );
}
