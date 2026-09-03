"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { experience } from "@/lib/data";
import { ExperienceCard } from "./ExperienceCard";
import { Overlay } from "./Overlay";

const RAIL_PAD = 5.4;
// kept in sync with the markup below so the light lands on the trail's tip
const GLOW = 14.4;
const SPARK = 10.8;

export function ExperienceSection({ logos = {} }: { logos?: Record<string, string> }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const savedScroll = useRef(0);
  const openerRef = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);
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
        dot.style.top = `${c - 2}px`;
      });
    };

    // The light chases the scroll position rather than being pinned to it, so
    // a fast scroll leaves it behind and it eases in afterwards. Done per frame
    // in JS rather than with a CSS transition: a transition restarts on every
    // scroll event, which on a continuous gesture keeps resetting the ease and
    // ends up tracking almost exactly.
    let targetP = 0;
    let curP = -999;   // sentinel: -0.x is now a legitimate position
    let ease = 0;

    const measure = () => {
      const rail = railRef.current;
      if (!rail) return null;
      const rr = rail.getBoundingClientRect();
      const scale = scaleOf(rail);
      const span = Math.max(1, rail.offsetHeight - RAIL_PAD * 2);
      const midpoint = (window.innerHeight * 0.5 - rr.top) / scale;
      let p = (midpoint - RAIL_PAD) / span;
      p = Math.max(0, Math.min(1, p));
      return { p, span };
    };

    const scan = () => {
      const m = measure();
      if (!m) return;
      targetP = m.p;
      if (curP === -999) curP = targetP;
      if (!ease) ease = requestAnimationFrame(step);
    };

    const step = () => {
      ease = 0;
      const m = measure();
      if (!m) return;
      const { span } = m;

      // exponential approach: quick at first, visibly decelerating into place
      curP += (targetP - curP) * 0.055;
      if (Math.abs(targetP - curP) < 0.0004) curP = targetP;
      else ease = requestAnimationFrame(step);

      const p = curP;
      const y = RAIL_PAD + p * span;

      if (trailRef.current) trailRef.current.style.height = `${p * span}px`;

      const vis = p <= 0 ? "0" : "1";
      // bloom centred on the tip
      if (headRef.current) {
        headRef.current.style.top = `${y - GLOW / 2}px`;
        headRef.current.style.opacity = vis;
      }
      // spark hangs above the tip so its bright end sits exactly on it
      if (sparkRef.current) {
        sparkRef.current.style.top = `${y - SPARK}px`;
        sparkRef.current.style.opacity = vis;
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
      curP = -999; // resize/layout change: adopt the new position without easing
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
      if (ease) cancelAnimationFrame(ease);
    };
  }, []);

  // Track the breakpoint in state so the overlay picks its presentation
  // declaratively rather than reading innerWidth mid-render.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Crossing the breakpoint while open would leave a phone-styled view in a
  // desktop viewport, so close and reopen the same role on the other side.
  useEffect(() => {
    if (!openId) return;
    const id = openId;
    setOpenId(null);
    const t = window.setTimeout(() => setOpenId(id), 0);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // Guarded on the previous value, or this fires on mount and jumps to the top.
  useEffect(() => {
    if (openId) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    window.scrollTo(0, savedScroll.current);
    openerRef.current?.focus?.();
  }, [openId]);

  const openRole = experience.find((r) => r.id === openId) ?? null;

  const handleOpen = (id: string, i: number) => {
    savedScroll.current = window.scrollY;
    openerRef.current = document.activeElement as HTMLElement | null;
    setOpenId(id);
    pulseDot(i);
  };

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
    <section id="experience" ref={sectionRef} className="reveal flex flex-wrap gap-[19.8px]">
      <div className="flex w-full min-w-0 flex-wrap items-baseline justify-between gap-5 px-1 pt-1 pb-[9px]">
        <div>
          <p className="m-0 mb-[8.1px] font-mono text-[9.9px] tracking-[0.12em] text-text-faint uppercase">
            02 — Experience
          </p>
          <h2 className="m-0 text-[clamp(25.2px,3vw,36px)] font-semibold tracking-[-0.035em]">Where I&rsquo;ve worked</h2>
        </div>
        <p className="m-0 font-mono text-[9.9px] text-text-faint">
          {experience.length} roles · 2023 — present
        </p>
      </div>

      {/* The gutter the design authors — the prototype's own runtime deleted it
          on desktop, which pinned the cards against the rail. */}
      <div className="flex w-full min-w-0 items-stretch gap-[clamp(16.2px,2.6vw,39.6px)] max-[700px]:gap-2.5">
        <div
          ref={railRef}
          aria-hidden
          className="relative min-h-20 flex-[0_0_6px] self-stretch max-[700px]:flex-[0_0_4px]"
        >
          <span className="absolute top-1.5 bottom-1.5 left-[2.25px] w-px rounded-full bg-[rgba(242,237,228,0.075)] max-[700px]:left-[1.35px]" />
          {/* gradient trail, filled to the scroll position */}
          <span
            ref={trailRef}
            className="absolute top-1.5 left-[2.25px] max-[700px]:left-[1.35px] h-0 w-px rounded-full bg-[linear-gradient(180deg,rgba(194,96,58,0.10)_0%,rgba(194,96,58,0.42)_46%,rgba(224,138,92,0.85)_84%,#F0B487_100%)] transition-none"
          />
          {/* soft glow head + bright spark riding the head of the trail */}
          <span
            ref={headRef}
            style={{ opacity: 0 }}
            className="absolute -left-[4.5px] top-0 h-4 w-4 max-[700px]:-left-[3.6px] max-[700px]:h-3 max-[700px]:w-3 rounded-full bg-[radial-gradient(circle,rgba(255,240,228,0.85)_0%,rgba(240,180,132,0.40)_20%,rgba(224,138,92,0.16)_40%,rgba(194,96,58,0)_66%)] transition-[opacity] duration-300"
          />
          <span
            ref={sparkRef}
            style={{ opacity: 0 }}
            className="absolute top-0 left-[2.25px] max-[700px]:left-[1.35px] h-3 w-px rounded-full bg-[linear-gradient(180deg,rgba(240,180,132,0)_0%,rgba(240,180,132,0.55)_45%,#FFF1E2_100%)] shadow-[0_0_10px_2px_rgba(224,138,92,0.5)] transition-[opacity] duration-300"
          />
          {experience.map((role, i) => (
            <span
              key={role.id}
              ref={(el) => {
                dotEls.current[i] = el;
              }}
              style={{ opacity: 0, background: "#171513", borderColor: "rgba(242,237,228,0.18)" }}
              className="absolute left-[1px] h-1 w-1 max-[700px]:left-[0.45px] max-[700px]:h-[2.7px] max-[700px]:w-[2.7px] rounded-full border transition-[background,border-color,box-shadow] duration-[400ms] "
            />
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {experience.map((role, i) => (
            <ExperienceCard
              key={role.id}
              role={role}
              logo={logos[role.id]}
              onOpen={(id) => handleOpen(id, i)}
              markRef={(el) => {
                markEls.current[role.id] = el;
              }}
            />
          ))}
        </div>
      </div>

      {openRole && (
        <Overlay
          label={`${openRole.title} at ${openRole.company}`}
          isMobile={isMobile}
          backLabel="All roles"
          width={760}
          onClose={() => setOpenId(null)}
        >
          <ExperienceCard role={openRole} logo={logos[openRole.id]} expanded />
        </Overlay>
      )}
    </section>
  );
}
