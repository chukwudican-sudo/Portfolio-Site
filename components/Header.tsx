import { BlogIcon, ExperienceIcon, HomeIcon, WorkIcon } from "./icons";
import { email, nav } from "@/lib/data";

const icons = { top: HomeIcon, projects: WorkIcon, experience: ExperienceIcon, writing: BlogIcon };

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(242,237,228,0.07)] bg-[rgba(14,13,12,0.62)] backdrop-blur-md">
      <div className="mx-auto flex min-h-[63px] w-full max-w-none flex-nowrap items-center gap-[9px] px-4 py-3 sm:gap-[23.4px] sm:px-[max(24px,calc((100%-var(--content-max-header))/2))]">
        <a
          href="#top"
          className="flex items-center gap-[9.9px] font-mono text-[11.7px] tracking-[0.04em] text-text-primary max-[700px]:min-h-11"
        >
          <span className="flex h-[23.4px] w-[23.4px] shrink-0 items-center justify-center rounded-[4.5px] border border-[rgba(242,237,228,0.22)] text-[10.8px] text-accent-light">
            CN
          </span>
          <span className="hidden max-[700px]:hidden min-[701px]:inline">Chukwudi Ndubuisi</span>
        </a>

        <span className="flex-1" />

        <nav className="flex flex-nowrap items-center gap-[3.6px] min-[701px]:gap-[19.8px]">
          {nav.map(({ href, label, id }) => {
            const Icon = icons[id];
            return (
              <a
                key={id}
                href={href}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-[9px] font-mono text-[10.35px] tracking-[0.08em] text-text-dim uppercase transition-colors duration-250 hover:text-text-primary min-[701px]:h-auto min-[701px]:w-auto min-[701px]:rounded-none"
              >
                <Icon className="block min-[701px]:hidden" />
                <span className="hidden min-[701px]:inline">{label}</span>
              </a>
            );
          })}
        </nav>

        <a
          href={`mailto:${email}`}
          className="inline-flex h-11 shrink-0 items-center rounded-[4.5px] bg-accent px-[12.6px] font-mono text-[9.45px] tracking-[0.06em] text-surface uppercase shadow-[0_8px_22px_-10px_rgba(194,96,58,0.8)] transition-all duration-250 hover:-translate-y-0.5 hover:bg-accent-light min-[701px]:h-auto min-[701px]:px-4 min-[701px]:py-[9px] min-[701px]:text-[10.35px]"
        >
          Hire me
        </a>
      </div>
    </header>
  );
}
