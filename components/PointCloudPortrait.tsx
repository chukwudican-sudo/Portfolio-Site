"use client";

import { useEffect, useRef, useState } from "react";
import { createPointCloud, synthesiseDepth, type PointCloudHandle } from "@/lib/pointCloud";

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * The hero ID-card portrait. Renders the rotatable point cloud when its assets
 * are present, and otherwise leaves the card's gradient panel showing with the
 * mono label — per the spec, this never silently degrades to a plain <img>,
 * because losing the element quietly is the one outcome the design can't absorb.
 */
export function PointCloudPortrait({
  photoSrc,
  depthSrc,
}: {
  photoSrc: string | null;
  depthSrc: string | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<PointCloudHandle | null>(null);
  const [ready, setReady] = useState(false);
  const [hintHidden, setHintHidden] = useState(false);
  const [autoSway, setAutoSway] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const canvas = canvasRef.current;
      if (!canvas || !photoSrc) return; // no portrait yet — placeholder stands

      const photo = await loadImage(photoSrc);
      if (cancelled || !photo) return;

      // A real depth map is preferred; fall back to synthesising one from a
      // cutout's alpha + luminance rather than dropping the feature.
      let depth: (CanvasImageSource & { width: number; height: number }) | null = depthSrc
        ? await loadImage(depthSrc)
        : null;
      if (cancelled) return;
      if (!depth) depth = synthesiseDepth(photo);
      if (!depth) return;

      const sway = window.matchMedia("(hover: none)").matches;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const handle = createPointCloud({
        canvas,
        photo,
        depth,
        autoSway: sway,
        reducedMotion,
        onFirstDrag: () => setHintHidden(true),
      });
      if (!handle) return; // no WebGL — placeholder stands

      handleRef.current = handle;
      setAutoSway(sway);
      setReady(true);
    })();

    return () => {
      cancelled = true;
      handleRef.current?.destroy();
      handleRef.current = null;
    };
  }, [photoSrc, depthSrc]);

  return (
    <>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Chukwudi Ndubuisi — portrait rendered as a rotatable 3D point cloud"
        style={{ opacity: ready ? 1 : 0 }}
        className="absolute inset-0 block h-full w-full transition-opacity duration-700"
      />
      {/* An affordance, not decoration: it goes away for good after the first
          drag, and never shows on touch where dragging is disabled. */}
      {!(autoSway || hintHidden) && (
        <p
          className="pointer-events-none absolute top-4 left-[18px] m-0 font-mono text-[10px] tracking-[0.1em] text-[rgba(242,237,228,0.42)] uppercase transition-opacity duration-[600ms] max-[700px]:hidden"
          style={{ opacity: hintHidden ? 0 : 1 }}
        >
          drag to rotate
        </p>
      )}
    </>
  );
}
