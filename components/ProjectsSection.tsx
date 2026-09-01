"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { filters, projects } from "@/lib/data";
import { ProjectCard } from "./ProjectCard";
import { ProjectOverlay } from "./ProjectOverlay";

export function ProjectsSection() {
  const sectionRef = useReveal<HTMLElement>();
  const gridRef = useReveal<HTMLDivElement>();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const savedScroll = useRef(0);
  const openerRef = useRef<HTMLElement | null>(null);

  const filtered =
    activeFilter === "all" ? projects : projects.filter((p) => p.tags.includes(activeFilter));

  const openProject = filtered.find((p) => p.id === openProjectId) ?? projects.find((p) => p.id === openProjectId);

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
    <section id="projects" ref={sectionRef} className="reveal flex flex-col gap-[22px]">
      <div className="flex flex-wrap items-end justify-between gap-5 px-1 pt-1 pb-[10px]">
        <div>
          <p className="m-0 mb-[9px] font-mono text-[11px] tracking-[0.12em] text-text-faint uppercase">
            01 — Featured work
          </p>
          <h2 className="m-0 text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.035em]">Things I&rsquo;ve shipped</h2>
        </div>
        <div className="flex flex-nowrap items-center gap-[6px] overflow-x-auto max-[700px]:max-w-full min-[701px]:flex-wrap min-[701px]:gap-[10px]">
          {filters.map((f) => {
            const active = f.id === activeFilter;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`flex h-11 shrink-0 items-center justify-center rounded-[5px] border px-[10px] font-mono text-[9.5px] tracking-[0.08em] uppercase transition-colors duration-250 min-[701px]:h-auto min-[701px]:px-[15px] min-[701px]:py-[9px] min-[701px]:text-[11px] ${
                  active
                    ? "border-accent bg-accent text-surface"
                    : "border-[rgba(242,237,228,0.16)] bg-transparent text-text-dim hover:border-[rgba(224,138,92,0.5)] hover:text-text-primary"
                }`}
              >
                {f.label}
              </button>
            );
          })}
          <span className="shrink-0 font-mono text-[9.5px] text-text-faint min-[701px]:text-[11px]">
            {filtered.length} shown
          </span>
        </div>
      </div>

      <div ref={gridRef} className="reveal-group flex flex-wrap gap-4 min-[701px]:gap-[22px]">
        {filtered.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} onOpen={handleOpen} />
        ))}
      </div>

      {openProject && (
        <ProjectOverlay project={openProject} isMobile={isMobile} onClose={handleClose} />
      )}
    </section>
  );
}
