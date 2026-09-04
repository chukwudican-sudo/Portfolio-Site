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
    photo: firstExisting(["head-photo.jpg", "head-photo.png", "head-photo.jpeg"]),
    depth: firstExisting(["head-depth.png"]),
  };
}

/**
 * Which roles have a prepared logo. Resolved on the server so a missing file
 * simply falls back to the initials tile, with no 404 in the console.
 */
export function getRoleLogos(ids: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const id of ids) {
    try {
      if (fs.existsSync(path.join(ASSET_DIR, "logos", `${id}.png`))) {
        out[id] = `/assets/logos/${id}.png`;
      }
    } catch {
      /* unreadable dir — treat as absent */
    }
  }
  return out;
}

/**
 * The prepared Places photos, shuffled so the strip doesn't read as the order
 * they happened to sit in on disk.
 *
 * Shuffled here on the server rather than in the component: the client receives
 * the finished array as a prop, so the markup React hydrates against matches
 * what was rendered. Shuffling during render would either mismatch on hydration
 * or visibly reshuffle after mount. The order is fixed per build.
 */
export function getPlacePhotos(): string[] {
  let files: string[];
  try {
    files = fs
      .readdirSync(path.join(ASSET_DIR, "places"))
      .filter((f) => /^place-\d+\.jpg$/.test(f))
      .sort();
  } catch {
    return [];
  }

  // Fisher-Yates
  for (let i = files.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [files[i], files[j]] = [files[j], files[i]];
  }
  return files.map((f) => `/assets/places/${f}`);
}

/**
 * Which posts have a cover image. Same server-side resolution as the logos, so
 * a post without one falls back to the placeholder slot instead of 404ing.
 */
export function getPostCovers(ids: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const id of ids) {
    try {
      if (fs.existsSync(path.join(ASSET_DIR, "writing", `${id}.png`))) {
        out[id] = `/assets/writing/${id}.png`;
      }
    } catch {
      /* unreadable dir — treat as absent */
    }
  }
  return out;
}

/**
 * Preview clips for a project, in play order: `<id>.mp4`, then `<id>2.mp4`,
 * `<id>3.mp4` and so on. Resolved on the server like the other assets, so a
 * project with no footage falls back to its placeholder rather than 404ing.
 */
export type ProjectClip = { sd: string; hd: string; poster?: string };

export function getProjectClips(ids: string[]): Record<string, ProjectClip[]> {
  const out: Record<string, ProjectClip[]> = {};
  const has = (f: string) => {
    try {
      return fs.existsSync(path.join(ASSET_DIR, "projects", f));
    } catch {
      return false;
    }
  };
  for (const id of ids) {
    const clips: ProjectClip[] = [];
    for (let n = 1; n <= 6; n++) {
      const base = `${id}${n === 1 ? "" : n}`;
      if (!has(`${base}.mp4`)) continue;
      clips.push({
        sd: `/assets/projects/${base}.mp4`,
        // The detail view is 1020px wide — 2040 device px on a retina screen —
        // so it gets a 1080p rendition. The card is a fraction of that size and
        // keeps the small file, since most visitors never open the detail.
        hd: has(`${base}-hd.mp4`) ? `/assets/projects/${base}-hd.mp4` : `/assets/projects/${base}.mp4`,
        poster: has(`${base}-poster.jpg`) ? `/assets/projects/${base}-poster.jpg` : undefined,
      });
    }
    if (clips.length) out[id] = clips;
  }
  return out;
}
