"use client";

import { useReveal } from "@/hooks/useReveal";
import { CardEyebrow } from "./CardEyebrow";
import { Heatmap, HeatmapLegend, buildHeatmap } from "./Heatmap";
import { StatNumber } from "./StatNumber";
import {
  ActivityIcon,
  ArrowUpRightIcon,
  CoffeeIcon,
  CodeIcon,
  ConnectIcon,
  EducationIcon,
  GithubIcon,
  HeartIcon,
  LinkedinIcon,
  MailIcon,
  ToolIcon,
} from "./icons";
import type { Tool } from "@/lib/data";
import { currentlyLearning, email, github, linkedin, tools, toolsLoop } from "@/lib/data";
import { getToolIcon } from "@/lib/tool-icons";

const smallStatFont =
  "font-mono text-[14.85px] font-medium text-accent-light max-[700px]:text-[13.5px]";
const smallStatLabel =
  "font-mono text-[8.55px] tracking-[0.07em] text-text-faint uppercase whitespace-nowrap max-[700px]:text-[9.45px] max-[700px]:tracking-[0.06em]";

export function Snapshot() {
  const { total, longestStreak } = buildHeatmap();
  const row2Ref = useReveal<HTMLDivElement>();

  return (
    <section id="snapshot" className="flex flex-col gap-[19.8px]">
      <div className="flex flex-wrap items-stretch gap-[19.8px]">
        {/* Activity */}
        <div className="glass-accent min-w-0 flex-[6_1_340px] rounded-[19.8px] p-[clamp(21.6px,2.2vw,30.6px)] max-[700px]:flex-[1_1_100%]">
          <CardEyebrow icon={<ActivityIcon />} className="mb-[16.2px]">
            Activity
          </CardEyebrow>
          <div className="mb-[23.4px] flex flex-wrap items-baseline justify-between gap-5">
            <div className="mb-[6.3px] flex flex-wrap items-center gap-[9px]">
              <p className="m-0 font-mono text-[9.9px] tracking-[0.12em] text-text-faint uppercase">
                Contribution activity
              </p>
              <span className="rounded-[3.6px] border border-[rgba(224,138,92,0.45)] px-[6.3px] py-[2.7px] font-mono text-[8.55px] tracking-[0.11em] text-accent-light uppercase">
                Sample
              </span>
            </div>
            <HeatmapLegend />
          </div>
          <div className="pb-1">
            <Heatmap />
          </div>
          <div className="mt-[19.8px] flex flex-nowrap items-start justify-between gap-[16.2px] border-t border-[rgba(242,237,228,0.09)] pt-[16.2px]">
            <div className="flex-none">
              <p className={`m-0 mb-1 ${smallStatFont}`}>{total.toLocaleString("en-US")}</p>
              <p className={smallStatLabel}>contributions</p>
            </div>
            <div className="flex-none">
              <p className={`m-0 mb-1 ${smallStatFont}`}>{longestStreak} days</p>
              <p className={smallStatLabel}>longest streak</p>
            </div>
            <div className="flex-none">
              <p className={`m-0 mb-1 ${smallStatFont}`}>53</p>
              <p className={smallStatLabel}>weeks tracked</p>
            </div>
          </div>
        </div>

        {/* Numbers */}
        <div className="flex min-w-0 flex-[2_1_170px] flex-col gap-[19.8px] max-[700px]:order-2 max-[700px]:flex-none max-[700px]:basis-[calc(50%-9.9px)] max-[700px]:gap-[12.6px]">
          <div className="glass-accent flex flex-1 flex-col justify-center gap-1.5 rounded-[19.8px] p-[clamp(21.6px,2.2vw,30.6px)] max-[700px]:px-4 max-[700px]:py-5">
            <CardEyebrow icon={<CoffeeIcon />}>Coffees drank</CardEyebrow>
            <StatNumber
              end={1476}
              className="m-0 mt-1.5 text-[clamp(27px,3.4vw,39.6px)] leading-none font-medium tracking-[-0.035em] text-text-primary max-[700px]:text-[28.8px]"
            />
          </div>
          <div className="glass-accent flex flex-1 flex-col justify-center gap-1.5 rounded-[19.8px] p-[clamp(21.6px,2.2vw,30.6px)] max-[700px]:px-4 max-[700px]:py-5">
            <CardEyebrow icon={<CodeIcon />}>Lines of code</CardEyebrow>
            <StatNumber
              end={52110}
              className="m-0 mt-1.5 text-[clamp(27px,3.4vw,39.6px)] leading-none font-medium tracking-[-0.035em] text-text-primary max-[700px]:text-[28.8px]"
            />
          </div>
        </div>

        {/* Connect */}
        <div className="glass-accent flex min-w-0 flex-[2_1_180px] flex-col rounded-[19.8px] p-[clamp(21.6px,2.2vw,30.6px)] max-[700px]:order-1 max-[700px]:flex-none max-[700px]:basis-[calc(50%-9.9px)]">
          <CardEyebrow icon={<ConnectIcon />} className="mb-5">
            Connect
          </CardEyebrow>
          <div className="flex flex-1 flex-col justify-center">
            <a
              href={`mailto:${email}`}
              className="group/link flex items-center justify-between gap-[9.9px] border-b border-[rgba(242,237,228,0.08)] py-[11.7px] text-[13.05px] text-[#D8D0C4] transition-colors duration-250 hover:text-accent-light max-[700px]:min-h-[41.4px] max-[700px]:py-3 max-[700px]:text-[13.5px]"
            >
              <span className="flex min-w-0 items-center gap-[9.9px]">
                <MailIcon className="shrink-0 text-accent-light" />
                Email
              </span>
              <span className="shrink-0 font-mono text-[10.8px] text-text-faint transition-colors duration-250 group-hover/link:text-accent-light">
                →
              </span>
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener"
              className="group/link flex items-center justify-between gap-[9.9px] border-b border-[rgba(242,237,228,0.08)] py-[11.7px] text-[13.05px] text-[#D8D0C4] transition-colors duration-250 hover:text-accent-light max-[700px]:min-h-[41.4px] max-[700px]:py-3 max-[700px]:text-[13.5px]"
            >
              <span className="flex min-w-0 items-center gap-[9.9px]">
                <LinkedinIcon className="shrink-0 text-accent-light" />
                LinkedIn
              </span>
              <ArrowUpRightIcon size={12} className="shrink-0 text-text-faint transition-colors duration-250 group-hover/link:text-accent-light" />
            </a>
            <a
              href={github}
              target="_blank"
              rel="noopener"
              className="group/link flex items-center justify-between gap-[9.9px] py-[11.7px] text-[13.05px] text-[#D8D0C4] transition-colors duration-250 hover:text-accent-light max-[700px]:min-h-[41.4px] max-[700px]:py-3 max-[700px]:text-[13.5px]"
            >
              <span className="flex min-w-0 items-center gap-[9.9px]">
                <GithubIcon className="shrink-0 text-accent-light" />
                GitHub
              </span>
              <ArrowUpRightIcon size={12} className="shrink-0 text-text-faint transition-colors duration-250 group-hover/link:text-accent-light" />
            </a>
          </div>
        </div>
      </div>

      <div ref={row2Ref} className="reveal-group flex flex-wrap items-stretch gap-[19.8px]">
        {/* Education */}
        <div style={{ "--delay": "0ms" } as React.CSSProperties} className="blur-in glass-accent flex min-w-0 flex-[5_1_330px] flex-col gap-5 rounded-[19.8px] p-[clamp(21.6px,2.2vw,30.6px)]">
          <CardEyebrow icon={<EducationIcon />}>Education</CardEyebrow>
          <div>
            <p className="m-0 mb-1.5 text-[15.3px] font-medium tracking-[-0.015em]">Ontario Tech University</p>
            <p className="m-0 mb-[2.7px] text-[13.05px] text-text-muted">BEng Software Engineering</p>
            <p className="m-0 font-mono text-[10.35px] text-text-faint">Co-op stream · 2023 — 2028</p>
          </div>
          <div className="mt-auto flex flex-wrap gap-2">
            {["Data structures", "Databases", "Systems design"].map((t) => (
              <span
                key={t}
                className="rounded-[3.6px] border border-[rgba(242,237,228,0.14)] px-[8.1px] py-[4.5px] font-mono text-[9.45px] whitespace-nowrap text-text-secondary"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Fav tool */}
        <div style={{ "--delay": "110ms" } as React.CSSProperties} className="blur-in glass-accent flex min-w-0 flex-[4_1_285px] flex-col rounded-[19.8px] p-[clamp(21.6px,2.2vw,30.6px)]">
          <CardEyebrow icon={<HeartIcon />} className="mb-5">
            Fav tool
          </CardEyebrow>
          <div className="flex items-center gap-[12.6px]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10.8px] border border-[rgba(224,138,92,0.34)] bg-[rgba(194,96,58,0.12)] font-mono text-[13.5px] text-accent-light">
              SB
            </span>
            <div className="min-w-0">
              <p className="m-0 mb-[2.7px] text-[17.1px] tracking-[-0.02em]">Supabase</p>
              <p className="m-0 font-mono text-[9px] tracking-[0.09em] text-text-faint uppercase">
                postgres · rls · edge functions
              </p>
            </div>
          </div>
          <p className="text-pretty m-0 mt-auto pt-[16.2px] text-[12.6px] leading-[1.6] text-text-muted">
            Row-level security means the database enforces the rules, not my client code.
          </p>
        </div>
      </div>

      {/* Tools ticker */}
      <div className="glass-accent rounded-[19.8px] p-[clamp(21.6px,2.2vw,30.6px)]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-5">
          <CardEyebrow icon={<ToolIcon />}>Tools</CardEyebrow>
          <p className="m-0 font-mono text-[9px] tracking-[0.09em] text-text-faint uppercase max-[700px]:hidden">
            {tools.length} daily drivers
          </p>
        </div>
        <div
          // overflow-hidden clips at the padding box, and the tiles lift 3px
          // with a shadow on hover — so the strip carries vertical padding to
          // give that room, pulled back with margin so the layout is unchanged.
          className="relative overflow-hidden py-[9px]"
          style={{
            margin: "-10px calc(-1 * clamp(21.6px,2.2vw,30.6px))",
            maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
          }}
        >
          <ToolsTrack />
        </div>
        <div className="mt-[23.4px] flex flex-wrap gap-9 border-t border-[rgba(242,237,228,0.09)] pt-5">
          <div>
            <p className="m-0 mb-[8.1px] font-mono text-[9px] tracking-[0.09em] text-text-faint uppercase">
              Currently learning
            </p>
            <div className="flex flex-wrap gap-2">
              {currentlyLearning.map((t) => (
                <span
                  key={t}
                  className="rounded-[4.5px] border border-[rgba(242,237,228,0.14)] px-[9px] py-[5.4px] font-mono text-[9.9px] text-text-secondary"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Monochrome by default; the brand's own colour arrives on hover. */
function ToolMark({ tool }: { tool: Tool }) {
  const icon = getToolIcon(tool.slug);
  if (!icon) {
    return (
      <span className="flex h-[30.6px] w-[30.6px] shrink-0 items-center justify-center rounded-[7.2px] border border-[rgba(242,237,228,0.18)] font-mono text-[11.25px] text-text-secondary max-[700px]:h-[37.8px] max-[700px]:w-[37.8px]">
        {tool.mark}
      </span>
    );
  }
  return (
    <span
      style={{ "--brand": icon.hex } as React.CSSProperties}
      className="flex h-[30.6px] w-[30.6px] shrink-0 items-center justify-center text-[rgba(242,237,228,0.72)] transition-colors duration-300 group-hover/tool:text-[var(--brand)] max-[700px]:h-[37.8px] max-[700px]:w-[37.8px]"
    >
      <svg viewBox="0 0 24 24" aria-hidden className="h-[23.4px] w-[23.4px] max-[700px]:h-8 max-[700px]:w-8" fill="currentColor">
        <path d={icon.path} />
      </svg>
    </span>
  );
}

function ToolsTrack() {
  return (
    <div
      className="flex w-max gap-3 py-0.5 [animation:marquee-scroll_36s_linear_infinite] max-[700px]:gap-[12.6px]"
      style={{ padding: "2px clamp(21.6px,2.2vw,30.6px)" }}
    >
      {toolsLoop.map((tool, i) => (
        <div
          key={`${tool.mark}-${i}`}
          className="group/tool flex w-[133.2px] shrink-0 flex-col gap-3 rounded-[12.6px] border border-[rgba(242,237,228,0.09)] bg-[rgba(242,237,228,0.028)] px-4 py-[16.2px] transition-all duration-300 hover:-translate-y-[2.7px] hover:border-[rgba(242,237,228,0.2)] hover:bg-[rgba(242,237,228,0.05)] max-[700px]:w-auto max-[700px]:gap-0 max-[700px]:border-none max-[700px]:bg-transparent max-[700px]:p-0"
        >
          <ToolMark tool={tool} />
          <div className="max-[700px]:hidden">
            <p className="m-0 mb-[2.7px] text-[13.05px] tracking-[-0.01em]">{tool.name}</p>
            <p className="m-0 font-mono text-[9px] tracking-[0.07em] text-text-faint uppercase">{tool.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
