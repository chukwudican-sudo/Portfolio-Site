"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { filters, projects } from "@/lib/data";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetail } from "./ProjectDetail";

export function ProjectsSection() {
  const sectionRef = useReveal<HTMLElement>();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const savedScroll = useRef(0);

  const filtered =
    activeFilter === "all" ? projects : projects.filter((p) => p.tags.includes(activeFilter));

  const openProject = filtered.find((p) => p.id === openProjectId) ?? projects.find((p) => p.id === openProjectId);

  const handleOpen = (id: string) => {
    savedScroll.current = window.scrollY;
    setOpenProjectId(id);
  };

  const handleClose = () => {
    setOpenProjectId(null);
  };

  useEffect(() => {
    if (openProjectId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      window.scrollTo(0, savedScroll.current);
    }
    return () => {
      document.body.style.overflow = "";
    };
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

      <div className="flex flex-wrap gap-4 min-[701px]:gap-[22px]">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} onOpen={handleOpen} />
        ))}
      </div>

      {openProject && <ProjectDetail project={openProject} onClose={handleClose} />}
    </section>
  );
}
