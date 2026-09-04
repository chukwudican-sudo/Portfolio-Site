"use client";

import type { Project } from "@/lib/data";
import { Overlay } from "./Overlay";
import { ProjectCard } from "./ProjectCard";
import type { ProjectClip } from "@/lib/assets";

export function ProjectOverlay({
  project,
  isMobile,
  onClose,
  clips,
}: {
  project: Project;
  isMobile: boolean;
  onClose: () => void;
  clips?: ProjectClip[];
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
