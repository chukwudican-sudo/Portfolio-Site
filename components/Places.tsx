"use client";

import { useEffect, useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { ImageSlot } from "./ImageSlot";

const SPEED_PX_S = 30;

export function Places({ photos = [] }: { photos?: string[] }) {
  const sectionRef = useReveal<HTMLElement>();
  const trackRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);

  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  const hoveringRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const halfWidthRef = useRef(1);
  const isTouchRef = useRef(false);

  useEffect(() => {
    isTouchRef.current = window.matchMedia("(hover: none)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      if (trackRef.current) {
        halfWidthRef.current = trackRef.current.scrollWidth / 2 || 1;
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (firstCardRef.current) ro.observe(firstCardRef.current);
    if (stripRef.current) ro.observe(stripRef.current);

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = now - last;
      last = now;

      if (!draggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.01) {
          offsetRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(0.94, dt / 16.7);
        } else if (!prefersReduced && (isTouchRef.current || !hoveringRef.current)) {
          // Touch devices auto-scroll unconditionally: pointerenter fires on tap
          // and would otherwise latch the strip paused for good. Hover-to-pause
          // is a mouse affordance only.
          offsetRef.current += (SPEED_PX_S * dt) / 1000;
        }
      }

      const half = halfWidthRef.current;
      offsetRef.current = ((offsetRef.current % half) + half) % half;
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    velocityRef.current = 0;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (stripRef.current) stripRef.current.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const now = performance.now();
    const dx = e.clientX - lastXRef.current;
    const dt = Math.max(now - lastTimeRef.current, 1);
    offsetRef.current -= dx;
    velocityRef.current = -dx / dt;
    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
  };

  const endDrag = () => {
    draggingRef.current = false;
    if (stripRef.current) stripRef.current.style.cursor = "grab";
  };

  // Duplicated so the strip can loop seamlessly; falls back to empty slots
  // until the photos are prepared.
  const slots = photos.length ? photos : Array.from({ length: 8 }, () => "");
  const cards = [...slots, ...slots];

  return (
    <section id="places" ref={sectionRef} className="reveal flex flex-col gap-[23.4px]">
      <div className="flex flex-wrap items-baseline justify-between gap-5 px-1 pt-1">
        <div>
          <p className="m-0 mb-[8.1px] font-mono text-[9.9px] tracking-[0.12em] text-text-faint uppercase">
            04 — Off the clock
          </p>
          <h2 className="m-0 mb-[9px] text-[clamp(25.2px,3vw,36px)] font-semibold tracking-[-0.035em]">
            Places that made me stop
          </h2>
          <p className="text-pretty m-0 max-w-[min(46ch,100%)] text-[13.95px] leading-[1.65] text-text-muted">
            Between commits, I go outside. Some of what I brought back.
          </p>
        </div>
        <p className="m-0 font-mono text-[9.9px] text-text-faint max-[700px]:hidden">drag or swipe to browse</p>
      </div>

      <div
        ref={stripRef}
        className="relative h-[clamp(234px,29vw,324px)] cursor-grab touch-pan-y overflow-hidden max-[700px]:mx-[-14.4px] max-[700px]:h-[158.4px] max-[700px]:w-[calc(100%+28.8px)]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={() => {
          hoveringRef.current = false;
          if (draggingRef.current) endDrag();
        }}
        onPointerEnter={() => {
          hoveringRef.current = true;
        }}
      >
        <div ref={trackRef} className="absolute top-0 left-0 flex h-full gap-[16.2px] will-change-transform max-[700px]:gap-[9.9px]">
          {cards.map((src, i) => (
            <div
              key={i}
              ref={i === 0 ? firstCardRef : undefined}
              className="h-full w-[clamp(175.5px,21.5vw,243px)] shrink-0 overflow-hidden rounded-[16.2px] border border-[rgba(242,237,228,0.10)] shadow-[0_24px_54px_-38px_rgba(0,0,0,0.9)] max-[700px]:w-[118.8px] max-[700px]:rounded-[12.6px]"
            >
              <div className="pointer-events-none relative h-full w-full">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    draggable={false}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageSlot label="Drop a photo" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progressive blur at both ends. The backdrop blur is full strength at
            the outer edge and ramps to nothing inward, so photos soften as they
            approach the edge and then stop at the container's clean line —
            rather than dissolving to nothing or being chopped mid-photo. The
            page background is laid over the same ramp so the softened edge
            settles into the site colour instead of staying a bright smear. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[10%] bg-[linear-gradient(90deg,var(--color-bg),transparent_72%)] backdrop-blur-[7.2px] [mask-image:linear-gradient(90deg,#000_36%,transparent)] [-webkit-mask-image:linear-gradient(90deg,#000_36%,transparent)] max-[700px]:w-[17%]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[10%] bg-[linear-gradient(270deg,var(--color-bg),transparent_72%)] backdrop-blur-[7.2px] [mask-image:linear-gradient(270deg,#000_36%,transparent)] [-webkit-mask-image:linear-gradient(270deg,#000_36%,transparent)] max-[700px]:w-[17%]"
        />
      </div>
    </section>
  );
}
