"use client";

import type { Project } from "@/lib/data";
import { Overlay } from "./Overlay";
import { ProjectCard } from "./ProjectCard";

export function ProjectOverlay({
  project,
  isMobile,
  onClose,
}: {
  project: Project;
  isMobile: boolean;
  onClose: () => void;
}) {
  return (
    <Overlay
      label={`${project.title} — ${project.subtitle}`}
      isMobile={isMobile}
      backLabel="All projects"
      onClose={onClose}
    >
      <ProjectCard project={project} expanded />
    </Overlay>
  );
}
