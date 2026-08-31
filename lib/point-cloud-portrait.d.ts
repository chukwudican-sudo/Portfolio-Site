/**
 * Types for the verbatim reference implementation in point-cloud-portrait.js.
 * That file is a straight port from the design handoff and must not be edited —
 * its constants were tuned against a real portrait. Declarations live here so
 * the .js stays byte-identical to the handoff copy.
 */
export function mountPointCloud(
  canvas: HTMLCanvasElement,
  hint: HTMLElement | null,
  opts?: { photo?: string; depth?: string },
): () => void;
