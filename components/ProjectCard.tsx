import { Fragment } from "react";
import type { Project } from "@/lib/data";
import { ImageSlot } from "./ImageSlot";

const flexBySpan: Record<Project["span"], string> = {
  wide: "flex-[7_1_420px]",
  narrow: "flex-[5_1_330px]",
  full: "flex-[1_1_100%]",
};

const aspectBySpan: Record<Project["span"], string> = {
  wide: "aspect-[16/8]",
  narrow: "aspect-[16/9]",
  full: "",
};

export function ProjectCard({ project, onOpen }: { project: Project; onOpen: (id: string) => void }) {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 700) {
      onOpen(project.id);
    }
  };

  const media = (
    <div
      className={`relative ${aspectBySpan[project.span] || "aspect-[16/9] min-h-[260px] flex-none max-[700px]:aspect-[16/9]"} flex items-end bg-[linear-gradient(150deg,#33241D,#191413)] px-5 py-[18px]`}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(420px_240px_at_68%_20%,rgba(194,96,58,0.26),transparent_68%)]"
      />
      <ImageSlot />
      <p className="relative m-0 font-mono text-[10px] tracking-[0.1em] text-[rgba(242,237,228,0.5)] uppercase">
        preview coming soon
      </p>
    </div>
  );

  const header = (
    <div className="flex flex-wrap items-baseline gap-3">
      <h3 className="m-0 text-[23px] font-semibold tracking-[-0.025em] max-[700px]:text-[20px]">{project.title}</h3>
      <span className="rounded-[4px] border border-[rgba(224,138,92,0.4)] px-2 py-1 font-mono text-[10.5px] tracking-[0.08em] text-accent-light uppercase">
        {project.badge}
      </span>
    </div>
  );

  const desc = (
    <p className="clamp-mobile-2 text-pretty m-0 text-[15.5px] leading-[1.65] text-text-muted max-[700px]:text-[14.5px]">
      {project.description}
    </p>
  );

  const more = (
    <div className="flex flex-col gap-[22px] max-[700px]:hidden">
      <ul className="m-0 flex list-none flex-col gap-[9px] p-0">
        {project.bullets.map((b) => (
          <li key={b} className="flex gap-[11px] text-[14.5px] leading-[1.6] text-text-secondary">
            <span className="font-mono text-[12.5px] text-accent">→</span>
            {b}
          </li>
        ))}
      </ul>
      {/* The full-width card sets these two blocks side by side; the narrower
          cards stack them. */}
      <div
        className={`rounded-[12px] border border-[rgba(242,237,228,0.09)] bg-[rgba(194,96,58,0.05)] px-[18px] py-4 ${
          project.span === "full"
            ? "flex flex-wrap gap-x-[26px] gap-y-3"
            : "flex flex-col gap-3"
        }`}
      >
        <div className={project.span === "full" ? "min-w-0 flex-[1_1_240px]" : undefined}>
          <p className="m-0 mb-[5px] font-mono text-[10px] tracking-[0.11em] text-text-faint uppercase">
            What broke
          </p>
          <p className="text-pretty m-0 text-[14px] leading-[1.6] text-text-secondary">{project.whatBroke}</p>
        </div>
        <div className={project.span === "full" ? "min-w-0 flex-[1_1_240px]" : undefined}>
          <p className="m-0 mb-[5px] font-mono text-[10px] tracking-[0.11em] text-text-faint uppercase">
            What I&rsquo;d do differently
          </p>
          <p className="text-pretty m-0 text-[14px] leading-[1.6] text-text-secondary">
            {project.whatIdDoDifferently}
          </p>
        </div>
      </div>
    </div>
  );

  const footer = (
    <div className="mt-auto flex flex-wrap items-center justify-between gap-[14px] border-t border-[rgba(242,237,228,0.09)] pt-4">
      {/* Separators are siblings at the inherited body size, not part of the
          mono chip — their taller line box is what sets this row's height. */}
      <div className="flex flex-wrap gap-[7px]">
        {project.tech.map((t, i) => (
          <Fragment key={t}>
            {i > 0 && <span className="text-[#3E3833] max-[700px]:hidden">·</span>}
            <span className="font-mono text-[10.5px] text-text-faint max-[700px]:rounded-[7px] max-[700px]:border max-[700px]:border-[rgba(242,237,228,0.13)] max-[700px]:px-[9px] max-[700px]:py-[5px] max-[700px]:text-text-secondary">
              {t}
            </span>
          </Fragment>
        ))}
      </div>
      <a
        href={project.href}
        target="_blank"
        rel="noopener"
        onClick={(e) => {
          if (typeof window !== "undefined" && window.innerWidth <= 700) {
            e.preventDefault();
            onOpen(project.id);
          }
        }}
        className="font-mono text-[11.5px] tracking-[0.06em] text-accent-light uppercase"
      >
        <span className="max-[700px]:hidden">Code on GitHub →</span>
        <span className="hidden max-[700px]:inline">View project →</span>
      </a>
    </div>
  );

  if (project.span === "full") {
    return (
      <article
        className={`glass glass-hover min-w-0 overflow-hidden rounded-[22px] ${flexBySpan[project.span]}`}
      >
        <div className="flex flex-wrap items-stretch max-[700px]:flex-col-reverse" onClick={handleClick}>
          <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-[22px] p-8 pt-[30px] max-[700px]:p-5">
            {header}
            {desc}
            {more}
            {footer}
          </div>
          <div className="relative flex min-h-[260px] min-w-0 flex-[1_1_300px] items-end bg-[linear-gradient(150deg,#33241D,#191413)] px-5 py-[18px] max-[700px]:aspect-[16/9] max-[700px]:min-h-0">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(420px_240px_at_68%_20%,rgba(194,96,58,0.26),transparent_68%)]"
            />
            <ImageSlot />
            <p className="relative m-0 font-mono text-[10px] tracking-[0.1em] text-[rgba(242,237,228,0.5)] uppercase">
              preview coming soon
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`glass glass-hover flex min-w-0 flex-col overflow-hidden rounded-[22px] ${flexBySpan[project.span]}`}
      onClick={handleClick}
    >
      {media}
      <div className="flex flex-1 flex-col gap-[22px] p-7 pt-[26px] max-[700px]:p-5">
        {header}
        {desc}
        {more}
        {footer}
      </div>
    </article>
  );
}
