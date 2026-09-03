import { GithubIcon, LinkedinIcon, MailIcon } from "./icons";
import { email, github, linkedin } from "@/lib/data";

export function Footer() {
  return (
    <footer className="flex flex-col gap-8 border-t border-[rgba(242,237,228,0.09)] pt-[37.8px] pr-1 pb-10 pl-1 max-[700px]:gap-[23.4px] max-[700px]:px-0 max-[700px]:py-[30.6px]">
      <div className="flex flex-wrap gap-x-[23.4px] gap-y-[30.6px] max-[700px]:gap-x-[16.2px] max-[700px]:gap-y-[23.4px]">
        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-[12.6px] max-[700px]:flex-[1_1_100%]">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-[8.1px] border border-[rgba(242,237,228,0.22)] font-mono text-[12.6px] tracking-[0.04em] text-accent-light"
          >
            CN
          </span>
          <p className="m-0 text-[15.3px] font-semibold tracking-[-0.02em] text-text-primary">Chukwudi Ndubuisi</p>
          <p className="text-pretty m-0 max-w-[min(46ch,100%)] text-[12.6px] leading-[1.62] text-text-dim">
            Software engineer building full products — interfaces, APIs, and the data underneath. Open to Winter
            2027 co-op placements.
          </p>
        </div>

        <nav className="flex min-w-[117px] flex-[0_1_150px] flex-col gap-0.5 max-[700px]:min-w-0 max-[700px]:flex-[1_1_0]">
          <p className="m-0 mb-1 font-mono text-[9.45px] tracking-[0.14em] text-text-primary uppercase">Navigate</p>
          {[
            { href: "#top", label: "Home" },
            { href: "#projects", label: "Projects" },
            { href: "#experience", label: "Experience" },
            { href: "#writing", label: "Blog" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex min-h-[34.2px] items-center text-[13.05px] text-text-muted transition-colors duration-250 hover:text-text-primary max-[700px]:min-h-11"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex min-w-[126px] flex-[0_1_170px] flex-col gap-0.5 max-[700px]:min-w-0 max-[700px]:flex-[1_1_0]">
          <p className="m-0 mb-1 font-mono text-[9.45px] tracking-[0.14em] text-text-primary uppercase">Connect</p>
          <a
            href={`mailto:${email}`}
            className="flex min-h-[34.2px] items-center gap-[9.9px] text-[13.05px] text-text-muted transition-colors duration-250 hover:text-accent-light max-[700px]:min-h-11"
          >
            <MailIcon size={17} className="shrink-0 text-text-faint" />
            Email
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener"
            className="flex min-h-[34.2px] items-center gap-[9.9px] text-[13.05px] text-text-muted transition-colors duration-250 hover:text-accent-light max-[700px]:min-h-11"
          >
            <LinkedinIcon size={17} className="shrink-0 text-text-faint" />
            LinkedIn
          </a>
          <a
            href={github}
            target="_blank"
            rel="noopener"
            className="flex min-h-[34.2px] items-center gap-[9.9px] text-[13.05px] text-text-muted transition-colors duration-250 hover:text-accent-light max-[700px]:min-h-11"
          >
            <GithubIcon size={17} className="shrink-0 text-text-faint" />
            GitHub
          </a>
        </div>
      </div>

      <div className="flex flex-col items-center gap-[6.3px] border-t border-[rgba(242,237,228,0.09)] pt-6">
        <p className="m-0 text-[11.25px] text-text-faint">© 2026 Chukwudi Ndubuisi. All rights reserved.</p>
        <p className="m-0 text-[11.25px] text-text-faint">Built from scratch · Space Grotesk + JetBrains Mono</p>
      </div>
    </footer>
  );
}
