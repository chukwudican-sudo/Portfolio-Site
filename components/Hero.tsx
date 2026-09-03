import { getPortraitAssets } from "@/lib/assets";
import { email, github, linkedin } from "@/lib/data";
import { GithubIcon, LinkedinIcon, MailIcon } from "./icons";
import { PointCloudPortrait } from "./PointCloudPortrait";

/** Must stay in step with the `beam-run` animation duration in globals.css. */
const BEAM_DUR = 4.6;

export function Hero() {
  const portrait = getPortraitAssets();
  return (
    <section
      className="flex min-h-[min(72vh,760px)] flex-wrap items-stretch gap-[19.8px] pt-[clamp(54px,10vh,118.8px)] pb-[clamp(7.2px,2vh,25.2px)] max-[700px]:min-h-0 max-[700px]:flex-col max-[700px]:items-center max-[700px]:justify-center max-[700px]:pt-[19.8px] max-[700px]:pb-0 max-[700px]:text-center"
    >
      {/* Text card */}
      <div className="glass glass-flat-mobile relative order-1 flex min-h-[clamp(342px,50vh,477px)] min-w-0 flex-[7_1_440px] flex-col justify-center overflow-hidden rounded-[19.8px] p-[clamp(30.6px,3.6vw,55.8px)] max-[700px]:order-2 max-[700px]:min-h-0 max-[700px]:w-full max-[700px]:flex-none max-[700px]:overflow-visible max-[700px]:p-0">
        <div className="relative">
          <div className="mb-[23.4px] flex items-center gap-[9.9px] max-[700px]:mb-5 max-[700px]:justify-center">
            <span
              className="h-[6.3px] w-[6.3px] shrink-0 rounded-full bg-accent-glow shadow-[0_0_8px_2px_rgba(224,138,92,0.75),0_0_18px_5px_rgba(194,96,58,0.35)] [animation:pulse-dot_2.6s_ease-in-out_infinite]"
              aria-hidden
            />
            <p className="m-0 font-mono text-[10.35px] tracking-[0.13em] text-text-dim uppercase max-[700px]:text-[9px] max-[700px]:tracking-[0.11em]">
              Available — Winter 2027 co-op
            </p>
          </div>

          <h1 className="m-0 mb-[16.2px] text-[clamp(33.3px,5.2vw,70.2px)] leading-[0.96] font-semibold tracking-[-0.05em] max-[700px]:mb-[9px] max-[700px]:text-[41.4px] max-[700px]:leading-[1.02] max-[700px]:tracking-[-0.045em]">
            Hi, I&rsquo;m{" "}
            <span className="bg-[linear-gradient(96deg,var(--color-accent-glow),var(--color-text-primary)_62%)] bg-clip-text pr-[0.08em] pb-[0.12em] text-[1.06em] leading-[1.28] font-normal tracking-normal text-transparent">
              <span className="font-script">Alex</span>
            </span>
          </h1>

          <p className="m-0 mt-[19.8px] mb-[27px] max-w-[min(54ch,100%)] text-[clamp(15.3px,1.4vw,18px)] leading-[1.6] font-medium text-text-primary max-[700px]:mx-auto max-[700px]:mt-[12.6px] max-[700px]:mb-[23.4px] max-[700px]:max-w-full max-[700px]:text-[12.15px] max-[700px]:leading-[1.55] max-[700px]:text-text-primary">
            A Software Engineer who builds things{" "}
            <span className="font-script pr-[0.06em] text-[1.18em] leading-[1.1] font-normal tracking-normal whitespace-nowrap text-text-primary">
              end to end
            </span>
            .
          </p>

          <div className="flex flex-wrap items-center gap-[16.2px] max-[700px]:justify-center max-[700px]:gap-[12.6px]">
            {/* direct links first, then the primary action, split by a rule */}
            <div className="flex items-center gap-[5.4px]">
              {[
                { href: `mailto:${email}`, label: "Email", Icon: MailIcon, external: false },
                { href: linkedin, label: "LinkedIn", Icon: LinkedinIcon, external: true },
                { href: github, label: "GitHub", Icon: GithubIcon, external: true },
              ].map(({ href, label, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(external ? { target: "_blank", rel: "noopener" } : {})}
                  className="flex h-11 w-11 items-center justify-center rounded-[9px] text-text-secondary transition-colors duration-250 hover:bg-[rgba(242,237,228,0.055)] hover:text-text-primary"
                >
                  <Icon size={19} />
                </a>
              ))}
            </div>

            <span aria-hidden className="h-6 w-px shrink-0 bg-[rgba(242,237,228,0.14)]" />

            <a
              href="#projects"
              className="beam inline-flex h-11 items-center gap-[9px] rounded-full border border-[rgba(242,237,228,0.16)] px-[19.8px] text-[13.05px] font-medium text-text-primary transition-colors duration-250 hover:border-[rgba(242,237,228,0.32)] hover:bg-[rgba(242,237,228,0.045)]"
            >
              <svg className="beam-track" aria-hidden>
                {/* halo the dot casts on the border it is passing over */}
                <rect
                  pathLength={100}
                  strokeDasharray="0.16 99.84"
                  strokeWidth={5}
                  opacity={0.24}
                  style={{ filter: "blur(3.5px)" }}
                />
                {/* the trail: short dashes a few hundredths of a second behind
                    the head, fading as they go, so it reads as one streak */}
                {/* A negative delay starts a copy further into the cycle, which
                    puts it AHEAD on the path. To sit behind the head, each copy
                    is offset by nearly a whole cycle instead — same phase, other
                    direction. BEAM_DUR must match the CSS animation duration. */}
                {Array.from({ length: 40 }, (_, i) => (
                  <rect
                    key={i}
                    pathLength={100}
                    // a dash this short plus a round cap is a dot, not a capsule
                    strokeDasharray="0.14 99.86"
                    strokeWidth={1.5 - i * 0.026}
                    opacity={i === 0 ? 1 : Math.pow(1 - i / 40, 2.1) * 0.5}
                    style={{
                      // spaced tighter than the dot is wide, so the trail reads
                      // as one streak rather than a row of separate blobs
                      animationDelay: `${i === 0 ? 0 : -(BEAM_DUR - i * 0.019)}s`,
                      filter: i > 6 ? `blur(${(i - 6) * 0.075}px)` : undefined,
                    }}
                  />
                ))}
              </svg>
              View my work <span className="font-mono text-[11.25px]">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* ID card */}
      <div
        className="relative order-2 flex min-h-[clamp(342px,50vh,477px)] min-w-0 flex-[5_1_330px] flex-col gap-[clamp(10.8px,1.2vw,16.2px)] rounded-[19.8px] border border-[rgba(242,237,228,0.13)] bg-[linear-gradient(200deg,rgba(44,32,26,0.72),rgba(16,15,14,0.86)_64%)] p-[clamp(14.4px,1.4vw,19.8px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_34px_76px_-44px_rgba(0,0,0,0.92)] backdrop-blur-[23.4px]
        max-[700px]:order-1 max-[700px]:mb-[23.4px] max-[700px]:h-[169.2px] max-[700px]:min-h-0 max-[700px]:w-[169.2px] max-[700px]:flex-none max-[700px]:gap-0 max-[700px]:rounded-full max-[700px]:bg-[radial-gradient(circle_at_50%_30%,rgba(194,96,58,0.42),rgba(16,15,14,0.9)_72%)] max-[700px]:p-[4.5px] max-[700px]:shadow-[0_0_60px_12px_rgba(194,96,58,0.28),inset_0_1px_0_rgba(255,255,255,0.12)]"
      >
        <div className="flex items-center gap-[12.6px] px-[5.4px] pt-0.5 max-[700px]:hidden">
          <span
            aria-hidden
            className="h-2 w-[46.8px] rounded-[3.6px] bg-[rgba(242,237,228,0.14)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
          />
          <div className="min-w-0 flex-1">
            <p className="m-0 font-mono text-[9.45px] tracking-[0.16em] text-text-dim uppercase">
              Ontario Tech University
            </p>
            <p className="mt-0.5 mb-0 font-mono text-[9.45px] tracking-[0.1em] text-text-faint uppercase">
              Software Engineering · Co-op
            </p>
          </div>
          <span className="font-mono text-[9.45px] tracking-[0.1em] whitespace-nowrap text-text-faint uppercase">
            ID 100911263
          </span>
        </div>

        <div className="relative flex min-h-0 flex-1 items-end overflow-hidden rounded-[12.6px] border border-[rgba(242,237,228,0.09)] bg-[radial-gradient(520px_340px_at_52%_24%,rgba(194,96,58,0.30),transparent_68%),rgba(0,0,0,0.22)] max-[700px]:w-full max-[700px]:rounded-full">
          <PointCloudPortrait photoSrc={portrait.photo} depthSrc={portrait.depth} />
          <span
            aria-hidden
            className="absolute top-[12.6px] right-[12.6px] h-[23.4px] w-[30.6px] rounded-[3.6px] border border-[rgba(224,138,92,0.34)] bg-[linear-gradient(150deg,rgba(224,138,92,0.22),rgba(194,96,58,0.06))] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.25)] max-[700px]:hidden"
          />
        </div>

        <div className="flex flex-wrap items-end justify-between gap-[16.2px] px-[5.4px] pb-0.5 max-[700px]:hidden">
          <div className="min-w-0">
            <p className="m-0 mb-[4.5px] font-mono text-[9.45px] tracking-[0.14em] text-text-faint uppercase">Name</p>
            <p className="m-0 mb-[8.1px] text-[17.1px] font-medium tracking-[-0.025em]">Chukwudi Ndubuisi</p>
            <p className="m-0 font-mono text-[9.45px] tracking-[0.1em] text-text-dim uppercase">
              Oshawa, ON · Class of &lsquo;28
            </p>
          </div>
          <div className="flex flex-col items-end gap-[8.1px]">
            <span className="rounded-[3.6px] border border-[rgba(224,138,92,0.4)] px-[8.1px] py-[4.5px] font-mono text-[9.45px] tracking-[0.08em] whitespace-nowrap text-accent-light uppercase">
              Co-op
            </span>
            <span aria-hidden className="flex h-[23.4px] items-end gap-[1.8px]">
              {[100, 70, 100, 56, 88, 100, 64, 92, 74].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%`, opacity: 0.22 + (h / 100) * 0.28 }}
                  className={i % 3 === 2 ? "w-[2.7px] bg-text-primary" : "w-px bg-text-primary"}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
