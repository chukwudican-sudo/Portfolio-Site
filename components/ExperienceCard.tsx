"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import type { ExperienceRole } from "@/lib/data";
import { ArrowUpRightIcon } from "./icons";

/**
 * One role, in one of two presentations from a single content source:
 *
 *   resting  — a compact row: logo tile, "Role • Company", date and location,
 *              a one-line summary, and skill chips. No bullets, no stats.
 *   expanded — the full write-up inside the overlay, chrome stripped.
 */
export function ExperienceCard({
  role,
  logo,
  expanded = false,
  onOpen,
  markRef,
}: {
  role: ExperienceRole;
  /** prepared white-on-transparent mark; falls back to the initials tile */
  logo?: string;
  expanded?: boolean;
  onOpen?: (id: string) => void;
  /** The rail dot aligns to the logo tile, so the section needs a ref to it. */
  markRef?: (el: HTMLElement | null) => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useReveal<HTMLDivElement>();
  const glowRef = useRef<HTMLSpanElement>(null);
  const boxRef = useRef<DOMRect | null>(null);
  const rafRef = useRef(0);
  const GLOW_R = 150;

  const onPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !glowRef.current || !rootRef.current) return;
    boxRef.current = rootRef.current.getBoundingClientRect();
    glowRef.current.style.display = "block";
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !glowRef.current) return;
    const { clientX, clientY } = e;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const g = glowRef.current;
      const root = rootRef.current;
      if (!g || !root) return;
      if (!boxRef.current) boxRef.current = root.getBoundingClientRect();
      const b = boxRef.current;
      // The page renders at a CSS `zoom`, so clientX/Y and this element's own
      // coordinate space differ by that factor. Derive it from the element.
      const scale = b.width / root.offsetWidth || 1;
      g.style.transform = `translate(${(clientX - b.left) / scale - GLOW_R}px, ${
        (clientY - b.top) / scale - GLOW_R
      }px)`;
      g.style.opacity = "1";
    });
  };
  const onPointerLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    boxRef.current = null;
    const g = glowRef.current;
    if (!g) return;
    g.style.opacity = "0";
    window.setTimeout(() => {
      if (g.style.opacity === "0") g.style.display = "none";
    }, 500);
  };

  const tile = (
    <span
      ref={markRef}
      aria-hidden
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-[11px] font-mono tracking-[0.05em] ${
        logo ? "" : "border border-[rgba(242,237,228,0.14)] bg-[rgba(242,237,228,0.05)] text-text-secondary"
      } ${
        expanded
          ? "h-[52px] w-[52px] text-[15px]"
          : "h-12 w-12 text-[14px] max-[700px]:h-[38px] max-[700px]:w-[38px] max-[700px]:text-[11px]"
      }`}
    >
      {logo ? (
        // used exactly as supplied — original colours and background
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" className="h-full w-full object-cover" />
      ) : (
        role.mark
      )}
    </span>
  );

  const heading = (
    <div className="min-w-0">
      <p className="m-0 text-[17px] leading-[1.3] font-semibold text-text-primary max-[700px]:text-[14px]">
        {role.title}
        <span className="mx-[7px] font-normal text-text-faint">•</span>
        {role.company}
      </p>
      <p className="m-0 mt-[4px] text-[14.5px] text-text-dim max-[700px]:text-[12.5px]">
        {role.date}
        <span className="mx-[7px] text-text-faint">•</span>
        {role.location}
      </p>
    </div>
  );

  const chips = (
    <div className="flex flex-wrap gap-2">
      {role.chips.map((chip, i) => (
        <span
          key={chip}
          style={{ "--delay": `${140 + i * 55}ms` } as React.CSSProperties}
          className="chip blur-in blur-in-left px-[11px] py-[6px] text-[13px] font-semibold max-[700px]:px-[9px] max-[700px]:py-1 max-[700px]:text-[12px]"
        >
          {chip}
        </span>
      ))}
    </div>
  );

  // ---- expanded: full write-up, no card chrome ----
  if (expanded) {
    return (
      <article className="flex flex-col gap-5 p-8 max-[700px]:p-5">
        <div className="flex items-start gap-[14px]">
          {tile}
          {heading}
        </div>
        <p className="text-pretty m-0 max-w-[min(70ch,100%)] text-[16.5px] leading-[1.65] text-text-muted max-[700px]:text-[15px]">
          {role.description}
        </p>
        {chips}
        <ul className="m-0 flex max-w-[min(74ch,100%)] list-none flex-col gap-[10px] p-0">
          {role.bullets.map((b) => (
            <li key={b} className="flex gap-[11px] text-[14.5px] leading-[1.6] text-text-secondary">
              <span className="font-mono text-[12.5px] text-accent">→</span>
              {b}
            </li>
          ))}
        </ul>
        {role.stats.length > 0 && (
          <div className="flex flex-wrap gap-x-7 gap-y-3 border-t border-[rgba(242,237,228,0.09)] pt-5">
            {role.stats.map((s) => (
              <div key={s.label}>
                <p className="m-0 mb-[3px] font-mono text-[22px] text-accent-light">{s.value}</p>
                <p className="m-0 font-mono text-[10px] tracking-[0.08em] text-text-faint uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        )}
        {role.locationHref && (
          <a
            href={role.locationHref}
            target="_blank"
            rel="noopener"
            className="font-mono text-[11.5px] tracking-[0.06em] text-accent-light uppercase"
          >
            {role.locationHref.replace("https://", "")} <ArrowUpRightIcon size={12} className="inline-block" />
          </a>
        )}
      </article>
    );
  }

  // ---- resting: compact row, the whole card is the control ----
  return (
    <div
      ref={(el) => {
        rootRef.current = el;
        groupRef.current = el;
      }}
      role="button"
      tabIndex={0}
      aria-label={`${role.title} at ${role.company}. View details`}
      onClick={() => onOpen?.(role.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.(role.id);
        }
      }}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="group reveal-group relative cursor-pointer overflow-hidden rounded-[14px] border border-[rgba(242,237,228,0.085)] p-6 outline-none transition-colors duration-300 hover:border-[rgba(242,237,228,0.17)] focus-visible:border-[rgba(242,237,228,0.3)] max-[700px]:rounded-[12px] max-[700px]:p-4"
    >
      <span
        ref={glowRef}
        aria-hidden
        style={{ display: "none", opacity: 0 }}
        className="pointer-events-none absolute top-0 left-0 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(224,138,92,0.15),rgba(194,96,58,0.05)_44%,rgba(194,96,58,0)_70%)] transition-opacity duration-[450ms]"
      />
      <div className="relative flex flex-col gap-[14px]">
        <div className="blur-in flex items-start gap-[14px] max-[700px]:gap-[10px]">
          {tile}
          {heading}
        </div>
        <p style={{ "--delay": "70ms" } as React.CSSProperties} className="blur-in text-pretty m-0 text-[14.5px] leading-[1.55] text-text-muted max-[700px]:text-[13px]">
          {role.description}
        </p>
        {chips}
      </div>
    </div>
  );
}
