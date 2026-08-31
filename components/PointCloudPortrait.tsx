"use client";

import { useEffect, useRef } from "react";
import { mountPointCloud } from "@/lib/point-cloud-portrait";

/**
 * Hero ID-card portrait.
 *
 * The effect itself lives in lib/point-cloud-portrait.js — the verbatim
 * reference implementation from the design handoff. This component only mounts
 * it and owns the two DOM nodes it expects: a CSS-sized canvas and the hint
 * label (which the library hides itself on first drag, and on touch).
 *
 * With no assets present nothing mounts and the card keeps its gradient panel
 * and label — per the handoff, this never falls back to a flat <img>.
 */
export function PointCloudPortrait({
  photoSrc,
  depthSrc,
}: {
  photoSrc: string | null;
  depthSrc: string | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !photoSrc || !depthSrc) return;
    // returns the dispose function the reference implementation provides
    return mountPointCloud(canvasRef.current, hintRef.current, {
      photo: photoSrc,
      depth: depthSrc,
    });
  }, [photoSrc, depthSrc]);

  const active = Boolean(photoSrc && depthSrc);

  return (
    <>
      {active && (
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Chukwudi Ndubuisi — portrait rendered as a rotatable 3D point cloud"
          className="absolute inset-0 block h-full w-full cursor-grab"
        />
      )}
      <p
        ref={hintRef}
        className="pointer-events-none absolute top-4 left-[18px] m-0 font-mono text-[10px] tracking-[0.1em] text-[rgba(242,237,228,0.42)] uppercase transition-opacity duration-[600ms] max-[700px]:hidden"
      >
        drag to rotate
      </p>
    </>
  );
}
