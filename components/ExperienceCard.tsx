"use client";

import { useEffect, useRef, useState } from "react";
import type { ExperienceRole } from "@/lib/data";
import { ChevronIcon } from "./icons";

export function ExperienceCard({
  role,
  isOpen,
  onToggle,
  markRef,
}: {
  role: ExperienceRole;
  isOpen: boolean;
  onToggle: () => void;
  /** The rail dot aligns to the icon tile, so the section needs a ref to it. */
  markRef?: (el: HTMLElement | null) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<DOMRect | null>(null);
  const rafRef = useRef(0);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (!panelRef.current) return;
    if (isOpen) {
      setMaxHeight(`${panelRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [isOpen, role]);

  // 150px radial highlight that follows the pointer. Fine pointers only —
  // on touch there is no hover state to track.
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
      // The page is rendered at a CSS `zoom` on desktop, so clientX/Y (viewport
      // pixels) and this element's own coordinate space differ by that factor.
      // Derive it from the element rather than hard-coding the zoom value.
      const scale = b.width / root.offsetWidth || 1;
      const x = (clientX - b.left) / scale;
      const y = (clientY - b.top) / scale;
      g.style.transform = `translate(${x - GLOW_R}px, ${y - GLOW_R}px)`;
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

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      ref={rootRef}
      className="glass glass-hover-static relative cursor-pointer overflow-hidden rounded-[22px]"
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <span
        ref={glowRef}
        aria-hidden
        style={{ display: "none", opacity: 0 }}
        className="pointer-events-none absolute top-0 left-0 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(224,138,92,0.15),rgba(194,96,58,0.05)_44%,rgba(194,96,58,0)_70%)] transition-opacity duration-[450ms]"
      />
      <div className="exp-grid">
        <span ref={markRef} className="exp-icon flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[14px] border border-[rgba(224,138,92,0.26)] bg-[linear-gradient(150deg,rgba(194,96,58,0.20),rgba(255,255,255,0.028))] font-mono text-[15px] tracking-[0.05em] text-accent-light max-[700px]:h-[30px] max-[700px]:w-[30px] max-[700px]:rounded-[9px] max-[700px]:text-[10px]">
          {role.mark}
        </span>

        <div className="exp-title flex min-w-0 items-baseline gap-3 max-[700px]:flex-nowrap max-[700px]:gap-[4px] max-[700px]:overflow-hidden max-[700px]:whitespace-nowrap">
          <h3 className="m-0 text-[21px] font-semibold tracking-[-0.025em] max-[700px]:overflow-hidden max-[700px]:text-[12.5px] max-[700px]:leading-[1.32] max-[700px]:font-bold max-[700px]:tracking-normal max-[700px]:text-ellipsis max-[700px]:whitespace-nowrap">
            {role.title}
          </h3>
          <p className="m-0 text-[14.5px] text-accent-light max-[700px]:shrink-0 max-[700px]:text-[12.5px] max-[700px]:leading-[1.32] max-[700px]:font-bold max-[700px]:text-text-primary">
            <span className="hidden max-[700px]:inline">•  </span>
            {role.company}
          </p>
        </div>

        <p className="exp-date m-0 font-mono text-[11.5px] tracking-[0.03em] whitespace-nowrap text-text-faint max-[700px]:pt-0 max-[700px]:font-sans max-[700px]:text-[11.5px] max-[700px]:tracking-normal">
          {role.date}
          <span className="hidden max-[700px]:inline"> · {role.location}</span>
        </p>

        <span className="exp-chev flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-[rgba(242,237,228,0.14)] text-text-dim transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: isOpen ? "rotate(180deg)" : "none" }}>
          <ChevronIcon />
        </span>

        <p className="exp-desc text-pretty clamp-mobile-2-tight m-0 max-w-[min(64ch,100%)] text-[14.5px] leading-[1.6] text-text-dim max-[700px]:text-[13px] max-[700px]:leading-[1.46] max-[700px]:text-text-muted">
          {role.description}
        </p>

        <div className="exp-chips flex flex-wrap gap-2">
          {role.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-[7px] border border-[rgba(242,237,228,0.05)] bg-[rgba(242,237,228,0.055)] px-[11px] py-[6px] text-[12.5px] text-[#C2BAAE] max-[700px]:rounded-[7px] max-[700px]:border-none max-[700px]:bg-[rgba(242,237,228,0.06)] max-[700px]:px-[9px] max-[700px]:py-1 max-[700px]:text-[11.5px] max-[700px]:font-medium max-[700px]:text-[#CFC7BA]"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div ref={panelRef} style={{ maxHeight }} className="overflow-hidden transition-[max-height] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div className="px-[30px] pt-0.5 pb-[30px] max-[700px]:hidden">
          <span className="mb-5 block h-px bg-[rgba(242,237,228,0.09)]" />
          <div className="mb-4 flex flex-wrap items-center gap-[14px]">
            <p className="m-0 font-mono text-[10.5px] tracking-[0.08em] text-text-faint uppercase">
              {role.location}
            </p>
            {role.locationHref && (
              <a
                href={role.locationHref}
                target="_blank"
                rel="noopener"
                className="font-mono text-[10.5px] tracking-[0.08em] text-accent-light uppercase"
              >
                {role.locationHref.replace("https://", "")} ↗
              </a>
            )}
          </div>
          <ul className="m-0 mb-[22px] flex max-w-[min(78ch,100%)] list-none flex-col gap-[10px] p-0">
            {role.bullets.map((b) => (
              <li key={b} className="flex gap-[11px] text-[14.5px] leading-[1.6] text-text-secondary">
                <span className="font-mono text-[12.5px] text-accent">→</span>
                {b}
              </li>
            ))}
          </ul>
          {role.stats.length > 0 && (
            <div className="flex flex-wrap gap-x-7 gap-y-3">
              {role.stats.map((s) => (
                <div key={s.label}>
                  <p className="m-0 mb-[3px] font-mono text-[22px] text-accent-light">{s.value}</p>
                  <p className="m-0 font-mono text-[10px] tracking-[0.08em] text-text-faint uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compact mobile write-up: same content, tighter type */}
        <div className="hidden px-[14px] pt-0.5 pb-4 max-[700px]:block">
          <span className="mb-4 block h-px bg-[rgba(242,237,228,0.09)]" />
          <p className="m-0 mb-3 font-mono text-[10px] tracking-[0.08em] text-text-faint uppercase">
            {role.location}
          </p>
          <ul className="m-0 mb-4 flex list-none flex-col gap-2 p-0">
            {role.bullets.map((b) => (
              <li key={b} className="flex gap-[9px] text-[13px] leading-[1.5] text-text-secondary">
                <span className="font-mono text-[11px] text-accent">→</span>
                {b}
              </li>
            ))}
          </ul>
          {role.stats.length > 0 && (
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {role.stats.map((s) => (
                <div key={s.label}>
                  <p className="m-0 mb-[3px] font-mono text-[18px] text-accent-light">{s.value}</p>
                  <p className="m-0 font-mono text-[9px] tracking-[0.08em] text-text-faint uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
