import type { Project } from "@/lib/data";
import { ImageSlot } from "./ImageSlot";

export function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] overflow-y-auto bg-surface">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[rgba(242,237,228,0.09)] bg-[rgba(16,14,13,0.92)] px-[18px] py-[14px] backdrop-blur-md">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 items-center gap-2 bg-transparent px-1 font-mono text-[11.5px] tracking-[0.07em] text-accent-light uppercase"
        >
          <span className="text-[15px] leading-none">←</span>All projects
        </button>
      </div>

      <div className="pb-[60px]">
        <div className="relative aspect-[16/9] bg-[linear-gradient(150deg,#33241D,#191413)] p-5">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(420px_240px_at_68%_20%,rgba(194,96,58,0.26),transparent_68%)]"
          />
          <ImageSlot />
        </div>

        <div className="flex flex-col gap-[22px] p-5">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="m-0 text-[26px] font-semibold tracking-[-0.025em]">{project.title}</h2>
            <span className="rounded-[4px] border border-[rgba(224,138,92,0.4)] px-2 py-1 font-mono text-[10.5px] tracking-[0.08em] text-accent-light uppercase">
              {project.badge}
            </span>
          </div>

          <p className="text-pretty m-0 text-[15.5px] leading-[1.65] text-text-muted">{project.description}</p>

          <ul className="m-0 flex list-none flex-col gap-[9px] p-0">
            {project.bullets.map((b) => (
              <li key={b} className="flex gap-[11px] text-[14.5px] leading-[1.6] text-text-secondary">
                <span className="font-mono text-[12.5px] text-accent">→</span>
                {b}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 rounded-[12px] border border-[rgba(242,237,228,0.09)] bg-[rgba(194,96,58,0.05)] p-4">
            <div>
              <p className="m-0 mb-[5px] font-mono text-[10px] tracking-[0.11em] text-text-faint uppercase">
                What broke
              </p>
              <p className="text-pretty m-0 text-[14px] leading-[1.6] text-text-secondary">{project.whatBroke}</p>
            </div>
            <div>
              <p className="m-0 mb-[5px] font-mono text-[10px] tracking-[0.11em] text-text-faint uppercase">
                What I&rsquo;d do differently
              </p>
              <p className="text-pretty m-0 text-[14px] leading-[1.6] text-text-secondary">
                {project.whatIdDoDifferently}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-[14px] border-t border-[rgba(242,237,228,0.09)] pt-4">
            <div className="flex flex-wrap gap-[7px]">
              {project.tech.map((t, i) => (
                <span key={t} className="flex items-center gap-[7px] font-mono text-[10.5px] text-text-faint">
                  {i > 0 && <span className="text-[#3E3833]">·</span>}
                  {t}
                </span>
              ))}
            </div>
            <a href={project.href} target="_blank" rel="noopener" className="font-mono text-[11.5px] tracking-[0.06em] text-accent-light uppercase">
              Code on GitHub →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
