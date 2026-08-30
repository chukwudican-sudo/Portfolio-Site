import fs from "node:fs";
import path from "node:path";

const ASSET_DIR = path.join(process.cwd(), "public", "assets");

function firstExisting(names: string[]): string | null {
  for (const name of names) {
    try {
      if (fs.existsSync(path.join(ASSET_DIR, name))) return `/assets/${name}`;
    } catch {
      /* unreadable dir — treat as absent */
    }
  }
  return null;
}

/**
 * Resolved on the server so the client only ever requests files that exist —
 * the hero portrait is optional, and probing for it in the browser would put
 * 404s in the console on every load until the assets are supplied.
 */
export function getPortraitAssets(): { photo: string | null; depth: string | null } {
  return {
    photo: firstExisting(["head-photo.png", "head-photo.jpg", "head-photo.jpeg", "head-photo.webp"]),
    depth: firstExisting(["head-depth.png", "head-depth.jpg"]),
  };
}
