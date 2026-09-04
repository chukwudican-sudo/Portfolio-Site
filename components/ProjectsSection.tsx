"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { filters, projects } from "@/lib/data";
import { ProjectCard } from "./ProjectCard";
import { ProjectOverlay } from "./ProjectOverlay";
import type { ProjectClip } from "@/lib/assets";

export function ProjectsSection({ clips = {} }: { clips?: Record<string, ProjectClip[]> }) {
  const sectionRef = useReveal<HTMLElement>();
  const gridRef = useReveal<HTMLDivElement>();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const savedScroll = useRef(0);
  const openerRef = useRef<HTMLElement | null>(null);

  const filtered =
    activeFilter === "all" ? projects : projects.filter((p) => p.tags.includes(activeFilter));

  const openProject = filtered.find((p) => p.id === openProjectId) ?? projects.find((p) => p.id === openProjectId);

  // Lead with the three strongest; the rest stay one click away rather than
  // padding the grid. A filter narrows the list deliberately, so it opts out.
  // `expandable` does not depend on showAll — otherwise the control vanishes
  // once expanded and there is no way back to the short list.
  const expandable = activeFilter === "all" && filtered.length > 3;
  const shown = expandable && !showAll ? filtered.slice(0, 3) : filtered;
  const hiddenCount = expandable ? filtered.length - 3 : 0;

  const handleOpen = (id: string) => {
    savedScroll.current = window.scrollY;
    openerRef.current = document.activeElement as HTMLElement | null;
    setOpenProjectId(id);
  };

  const handleClose = () => {
    setOpenProjectId(null);
  };

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
  // desktop viewport, so close and reopen the same project on the other side.
  useEffect(() => {
    if (!openProjectId) return;
    const id = openProjectId;
    setOpenProjectId(null);
    const t = window.setTimeout(() => setOpenProjectId(id), 0);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // Restore scroll and focus when the overlay closes — guarded on the previous
  // value, or this fires on mount and jumps the page to the top on load.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (openProjectId) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    window.scrollTo(0, savedScroll.current);
    openerRef.current?.focus?.();
  }, [openProjectId]);

  return (
    <section id="projects" ref={sectionRef} className="reveal flex flex-col gap-[19.8px]">
      <div className="flex flex-wrap items-end justify-between gap-5 px-1 pt-1 pb-[9px]">
        <div>
          <p className="m-0 mb-[8.1px] font-mono text-[9.9px] tracking-[0.12em] text-text-faint uppercase">
            01 — Featured work
          </p>
          <h2 className="m-0 text-[clamp(25.2px,3vw,36px)] font-semibold tracking-[-0.035em]">Things I&rsquo;ve shipped</h2>
        </div>
        <div className="flex flex-nowrap items-center gap-[5.4px] overflow-x-auto max-[700px]:max-w-full min-[701px]:flex-wrap min-[701px]:gap-[9px]">
          {filters.map((f) => {
            const active = f.id === activeFilter;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`flex h-11 shrink-0 items-center justify-center rounded-[4.5px] border px-[9px] font-mono text-[8.55px] tracking-[0.08em] uppercase transition-colors duration-250 min-[701px]:h-auto min-[701px]:px-[13.5px] min-[701px]:py-[8.1px] min-[701px]:text-[9.9px] ${
                  active
                    ? "border-accent bg-accent text-surface"
                    : "border-[rgba(242,237,228,0.16)] bg-transparent text-text-dim hover:border-[rgba(224,138,92,0.5)] hover:text-text-primary"
                }`}
              >
                {f.label}
              </button>
            );
          })}
          <span className="shrink-0 font-mono text-[8.55px] text-text-faint min-[701px]:text-[9.9px]">
            {filtered.length} shown
          </span>
        </div>
      </div>

      <div ref={gridRef} className="reveal-group flex flex-wrap gap-4 min-[701px]:gap-[19.8px]">
        {shown.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            clips={clips[project.id]}
            onOpen={handleOpen}
          />
        ))}
      </div>

      {expandable && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-1 inline-flex items-center justify-center gap-2 self-center rounded-full border border-[rgba(242,237,228,0.16)] px-[19.8px] py-[9.9px] text-[12.6px] text-text-secondary transition-colors duration-250 hover:border-[rgba(242,237,228,0.3)] hover:text-text-primary max-[700px]:min-h-11"
        >
          {showAll ? "Show less" : `More projects (${hiddenCount})`}
        </button>
      )}

      {openProject && (
        <ProjectOverlay
          clips={clips[openProjectId ?? ""]} project={openProject} isMobile={isMobile} onClose={handleClose} />
      )}
    </section>
  );
}
