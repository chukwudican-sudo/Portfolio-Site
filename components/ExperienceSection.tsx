"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { experience } from "@/lib/data";
import { ExperienceCard } from "./ExperienceCard";

const RAIL_PAD = 6;

export function ExperienceSection() {
  const [openId, setOpenId] = useState<string | null>(experience[0]?.id ?? null);
  const sectionRef = useReveal<HTMLElement>();
  const railRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLSpanElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const sparkRef = useRef<HTMLSpanElement>(null);
  const dotEls = useRef<(HTMLSpanElement | null)[]>([]);
  const markEls = useRef<Record<string, HTMLElement | null>>({});
  const dotTops = useRef<number[]>([]);

  // The rail tracks scroll position, not the open card: the light sits at the
  // viewport midpoint and dots ignite as it passes them.
  useLayoutEffect(() => {
    // getBoundingClientRect and window.innerHeight are screen pixels, but the
    // styles we write are interpreted inside the page's `zoom` container. Read
    // the ratio off the element so the two spaces line up at any zoom.
    const scaleOf = (el: HTMLElement) => el.getBoundingClientRect().height / el.offsetHeight || 1;

    const place = () => {
      const rail = railRef.current;
      if (!rail) return;
      const rr = rail.getBoundingClientRect();
      const scale = scaleOf(rail);
      experience.forEach((role, i) => {
        const dot = dotEls.current[i];
        const mark = markEls.current[role.id];
        if (!dot || !mark) return;
        const ar = mark.getBoundingClientRect();
        const c = (ar.top - rr.top + ar.height / 2) / scale;
        dotTops.current[i] = c;
        dot.style.opacity = "1";
        dot.style.top = `${c - 4.5}px`;
      });
    };

    const scan = () => {
      const rail = railRef.current;
      if (!rail) return;
      const rr = rail.getBoundingClientRect();
      const scale = scaleOf(rail);
      // work entirely in the rail's own coordinate space
      const span = Math.max(1, rail.offsetHeight - RAIL_PAD * 2);
      const midpoint = (window.innerHeight * 0.5 - rr.top) / scale;
      let p = (midpoint - RAIL_PAD) / span;
      p = Math.max(0, Math.min(1, p));
      const y = RAIL_PAD + p * span;

      if (trailRef.current) trailRef.current.style.height = `${p * span}px`;
      for (const ref of [headRef, sparkRef]) {
        if (!ref.current) continue;
        ref.current.style.top = `${y - 20}px`;
        ref.current.style.opacity = p <= 0 ? "0" : p >= 1 ? (ref === headRef ? "0.3" : "0.25") : "1";
      }
      dotEls.current.forEach((dot, i) => {
        if (!dot) return;
        const top = dotTops.current[i];
        const lit = top != null && y >= top - 2;
        dot.style.background = lit ? "#C2603A" : "#171513";
        dot.style.borderColor = lit ? "rgba(224,138,92,0.7)" : "rgba(242,237,228,0.18)";
        if (!dot.style.animation || dot.style.animation === "none") {
          dot.style.boxShadow = lit ? "0 0 12px 2px rgba(224,138,92,0.4)" : "none";
        }
      });
    };

    const sync = () => {
      place();
      scan();
    };
    sync();
    // the panel animates for ~0.6s after a toggle, so re-place once it settles
    const t1 = window.setTimeout(sync, 220);
    const t2 = window.setTimeout(sync, 680);
    window.addEventListener("scroll", scan, { passive: true });
    window.addEventListener("resize", sync);
    if (document.fonts?.ready) document.fonts.ready.then(sync).catch(() => {});
    return () => {
      window.removeEventListener("scroll", scan);
      window.removeEventListener("resize", sync);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [openId]);

  const pulseDot = (i: number) => {
    const dot = dotEls.current[i];
    if (!dot) return;
    dot.style.animation = "none";
    void dot.offsetWidth; // force reflow so the animation restarts
    dot.style.animation = "rail-pulse 0.9s cubic-bezier(0.16,1,0.3,1) 1";
    window.setTimeout(() => {
      dot.style.animation = "none";
    }, 950);
  };

  return (
    <section id="experience" ref={sectionRef} className="reveal flex flex-wrap gap-[22px]">
      <div className="flex w-full min-w-0 flex-wrap items-baseline justify-between gap-5 px-1 pt-1 pb-[10px]">
        <div>
          <p className="m-0 mb-[9px] font-mono text-[11px] tracking-[0.12em] text-text-faint uppercase">
            02 — Experience
          </p>
          <h2 className="m-0 text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.035em]">Where I&rsquo;ve worked</h2>
        </div>
        <p className="m-0 font-mono text-[11px] text-text-faint">
          {experience.length} roles · 2023 — present
        </p>
      </div>

      {/* The gutter the design authors — the prototype's own runtime deleted it
          on desktop, which pinned the cards against the rail. */}
      <div className="flex w-full min-w-0 items-stretch gap-[clamp(18px,2.6vw,44px)] max-[700px]:gap-2">
        <div
          ref={railRef}
          aria-hidden
          className="relative min-h-20 flex-[0_0_12px] self-stretch max-[700px]:flex-[0_0_3px]"
        >
          <span className="absolute top-1.5 bottom-1.5 left-[5px] w-0.5 rounded-full bg-[rgba(242,237,228,0.09)] max-[700px]:left-0" />
          {/* gradient trail, filled to the scroll position */}
          <span
            ref={trailRef}
            className="absolute top-1.5 left-[5px] h-0 w-0.5 rounded-full bg-[linear-gradient(180deg,rgba(194,96,58,0.10)_0%,rgba(194,96,58,0.42)_46%,rgba(224,138,92,0.85)_84%,#F0B487_100%)] transition-[height] duration-[140ms] ease-linear max-[700px]:left-0"
          />
          {/* soft glow head + bright spark riding the head of the trail */}
          <span
            ref={headRef}
            style={{ opacity: 0 }}
            className="absolute -left-[14px] top-0 h-10 w-10 rounded-full bg-[radial-gradient(circle,rgba(255,240,228,0.85)_0%,rgba(240,180,132,0.40)_20%,rgba(224,138,92,0.16)_40%,rgba(194,96,58,0)_66%)] transition-[top,opacity] duration-[140ms] ease-linear"
          />
          <span
            ref={sparkRef}
            style={{ opacity: 0 }}
            className="absolute top-0 left-[4.5px] h-7 w-[3px] rounded-[3px] bg-[linear-gradient(180deg,rgba(240,180,132,0)_0%,rgba(246,211,188,0.9)_42%,#E08A5C_76%,rgba(194,96,58,0)_100%)] shadow-[0_0_14px_3px_rgba(224,138,92,0.45)] transition-[top,opacity] duration-[140ms] ease-linear max-[700px]:left-0"
          />
          {experience.map((role, i) => (
            <span
              key={role.id}
              ref={(el) => {
                dotEls.current[i] = el;
              }}
              style={{ opacity: 0, background: "#171513", borderColor: "rgba(242,237,228,0.18)" }}
              className="absolute left-0.5 h-2 w-2 rounded-full border transition-[background,border-color,box-shadow] duration-[400ms] max-[700px]:left-0"
            />
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {experience.map((role, i) => (
            <ExperienceCard
              key={role.id}
              role={role}
              isOpen={role.id === openId}
              onToggle={() => {
                const opening = openId !== role.id;
                setOpenId(opening ? role.id : null);
                if (opening) pulseDot(i);
              }}
              markRef={(el) => {
                markEls.current[role.id] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
