"use client";

import type { Project } from "@/lib/data";
import { Overlay } from "./Overlay";
import { ProjectCard } from "./ProjectCard";

export function ProjectOverlay({
  project,
  isMobile,
  onClose,
  clips,
}: {
  project: Project;
  isMobile: boolean;
  onClose: () => void;
  clips?: string[];
}) {
  return (
    <Overlay
      label={`${project.title} — ${project.subtitle}`}
      isMobile={isMobile}
      backLabel="All projects"
      onClose={onClose}
    >
      <ProjectCard project={project} expanded clips={clips} />
    </Overlay>
  );
}
