"use client";

import { Fragment } from "react";
import type { Project } from "@/lib/data";
import { useOverflowMask } from "@/hooks/useOverflowMask";
import { ProjectClips } from "./ProjectClips";
import { ProjectPending } from "./ProjectPending";
import { ArrowUpRightIcon } from "./icons";

// An even two-column grid, as in the reference. Percentage bases matter here:
// pixel bases let a third card squeeze onto a row and strand the next one at
// full width.
const flexBySpan: Record<Project["span"], string> = {
  wide: "flex-[1_1_calc(50%-9.9px)] max-[700px]:flex-[1_1_100%]",
  narrow: "flex-[1_1_calc(50%-9.9px)] max-[700px]:flex-[1_1_100%]",
  full: "flex-[1_1_100%]",
};

/**
 * One project, in one of two presentations from a single content source:
 *
 *   resting  — a teaser: media, title, clamped description, chips, CTA. The
 *              write-up is not rendered at all, rather than hidden.
 *   expanded — the full write-up inside the overlay. Card chrome is stripped,
 *              or it reads as a card floating in a modal.
 */
export function ProjectCard({
  project,
  expanded = false,
  index = 0,
  clips,
  onOpen,
}: {
  project: Project;
  expanded?: boolean;
  /** preview clips, played in order and looped */
  clips?: string[];
  /** position in the grid, used to stagger the reveal */
  index?: number;
  onOpen?: (id: string) => void;
}) {
  const { ref: descRef, clamped } = useOverflowMask<HTMLParagraphElement>();
  const full = project.span === "full";
  const hasClips = Boolean(clips?.length);
  const still = project.preview === "still" ? `/assets/projects/${project.id}.png` : null;

  const media = (
    <div
      className={`relative flex items-end overflow-hidden bg-[linear-gradient(150deg,#33241D,#191413)] px-5 py-[16.2px] ${
        hasClips || still
          ? "aspect-[16/9]"
          : expanded
            ? "aspect-[16/7]"
            : full
              ? "aspect-[21/6]"
              : "aspect-[16/8]"
      }`}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(420px_240px_at_68%_20%,rgba(194,96,58,0.26),transparent_68%)]"
      />
      {clips && clips.length > 0 ? (
        <ProjectClips clips={clips} />
      ) : still ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={still} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <ProjectPending label={project.preview === "soon" ? "Preview coming soon" : "In production"} />
      )}
    </div>
  );

  const header = (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
      <h3 className="m-0 text-[20.7px] font-semibold tracking-[-0.025em] max-[700px]:text-[18px]">
        {project.title}
        <span className="font-normal text-text-faint"> | </span>
        <span className="font-medium text-text-muted">{project.subtitle}</span>
      </h3>
      <span className="rounded-[3.6px] border border-[rgba(224,138,92,0.4)] px-2 py-1 font-mono text-[9.45px] tracking-[0.08em] text-accent-light uppercase">
        {project.badge}
      </span>
    </div>
  );

  const description = expanded ? (
    <p className="text-pretty m-0 max-w-[min(70ch,100%)] text-[14.85px] leading-[1.65] text-text-muted max-[700px]:text-[13.5px]">
      {project.description}
    </p>
  ) : (
    // The fade is applied only when the copy is genuinely clamped — see
    // useOverflowMask. Unconditional, it dims the last line of complete text.
    <p
      ref={descRef}
      style={
        clamped
          ? {
              WebkitMaskImage: "linear-gradient(180deg,#000 62%,rgba(0,0,0,0.38))",
              maskImage: "linear-gradient(180deg,#000 62%,rgba(0,0,0,0.38))",
            }
          : undefined
      }
      className="clamp-desc text-pretty m-0 text-[13.95px] leading-[1.65] text-text-muted max-[700px]:text-[13.05px]"
    >
      {project.description}
    </p>
  );

  const writeUp = expanded ? (
    <div className="flex flex-col gap-[19.8px]">
      <ul className="m-0 flex max-w-[min(74ch,100%)] list-none flex-col gap-[8.1px] p-0">
        {project.bullets.map((b) => (
          <li key={b} className="flex gap-[9.9px] text-[13.05px] leading-[1.6] text-text-secondary">
            <span className="font-mono text-[11.25px] text-accent">→</span>
            {b}
          </li>
        ))}
      </ul>
      {(project.whatBroke || project.whatIdDoDifferently) && (
        <div className="flex max-w-[min(74ch,100%)] flex-col gap-3 rounded-[10.8px] border border-[rgba(242,237,228,0.09)] bg-[rgba(194,96,58,0.05)] px-[16.2px] py-4">
          {project.whatBroke && (
            <div>
              <p className="m-0 mb-[4.5px] font-mono text-[9px] tracking-[0.11em] text-text-faint uppercase">
                What broke
              </p>
              <p className="text-pretty m-0 text-[12.6px] leading-[1.6] text-text-secondary">{project.whatBroke}</p>
            </div>
          )}
          {project.whatIdDoDifferently && (
            <div>
              <p className="m-0 mb-[4.5px] font-mono text-[9px] tracking-[0.11em] text-text-faint uppercase">
                What I&rsquo;d do differently
              </p>
              <p className="text-pretty m-0 text-[12.6px] leading-[1.6] text-text-secondary">
                {project.whatIdDoDifferently}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  ) : null;

  const footer = (
    <div className="mt-auto flex flex-wrap items-center justify-between gap-[12.6px] border-t border-[rgba(242,237,228,0.09)] pt-4">
      <div className="flex flex-wrap gap-[6.3px]">
        {project.tech.map((t, i) => (
          <Fragment key={t}>
            {i > 0 && <span className="text-[#3E3833] max-[700px]:hidden">·</span>}
            <span className="font-mono text-[9.45px] text-text-faint max-[700px]:rounded-[6.3px] max-[700px]:border max-[700px]:border-[rgba(242,237,228,0.13)] max-[700px]:px-[8.1px] max-[700px]:py-[4.5px] max-[700px]:text-text-secondary">
              {t}
            </span>
          </Fragment>
        ))}
      </div>
      {expanded ? (
        <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {project.liveHref && (
            <a
              href={project.liveHref}
              target="_blank"
              rel="noopener"
              className="font-mono text-[10.35px] tracking-[0.06em] text-accent-light uppercase"
            >
              {project.liveHref.replace(/^https?:\/\//, "")} <ArrowUpRightIcon size={12} className="inline-block" />
            </a>
          )}
          <a
            href={project.href}
            target="_blank"
            rel="noopener"
            className="font-mono text-[10.35px] tracking-[0.06em] text-text-dim uppercase transition-colors duration-250 hover:text-accent-light"
          >
            Code on GitHub →
          </a>
        </span>
      ) : (
        <span className="font-mono text-[10.35px] tracking-[0.06em] text-accent-light uppercase">
          View project →
        </span>
      )}
    </div>
  );

  if (expanded) {
    return (
      <article className="flex flex-col">
        {media}
        <div className="flex flex-col gap-[19.8px] p-8 max-[700px]:p-5">
          {header}
          {description}
          {writeUp}
          {footer}
        </div>
      </article>
    );
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`${project.title} — ${project.subtitle}. View project`}
      onClick={(e) => {
        // a real link inside the card still navigates normally
        if ((e.target as HTMLElement).closest("a")) return;
        onOpen?.(project.id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.(project.id);
        }
      }}
      style={{ "--delay": `${index * 90}ms` } as React.CSSProperties}
      className={`blur-in glass glass-hover flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-[19.8px] outline-none focus-visible:border-[rgba(224,138,92,0.55)] ${flexBySpan[project.span]}`}
    >
      {media}
      <div className="flex flex-1 flex-col gap-[16.2px] p-7 pt-[23.4px] max-[700px]:p-5">
        {header}
        {description}
        {footer}
      </div>
    </article>
  );
}
