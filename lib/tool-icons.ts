import * as simpleIcons from "simple-icons";
import type { SimpleIcon } from "simple-icons";

/**
 * Brand marks for the tools rail, resolved from the `simple-icons` package
 * rather than fetched from a CDN — no third-party request on load, no layout
 * shift, and nothing external that can break a deploy.
 */
export type ToolIcon = { path: string; hex: string };

const bySlug = simpleIcons as unknown as Record<string, SimpleIcon | undefined>;

// simple-icons exports as `siPython`, `siNextdotjs`, …
const exportName = (slug: string) => `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;

/** Perceived brightness, 0–255 (ITU-R BT.601). */
function luminance(hex: string): number {
  const n = parseInt(hex, 16);
  return 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
}

export function getToolIcon(slug: string): ToolIcon | null {
  const icon = bySlug[exportName(slug)];
  if (!icon) return null;
  // Several brands (Next.js, OpenJDK) are officially black, which is invisible
  // on this page. Those fall back to the page's bone tone.
  const hex = luminance(icon.hex) < 40 ? "F2EDE4" : icon.hex;
  return { path: icon.path, hex: `#${hex}` };
}
