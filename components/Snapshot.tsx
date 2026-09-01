"use client";

import { useReveal } from "@/hooks/useReveal";
import { CardEyebrow } from "./CardEyebrow";
import { Heatmap, HeatmapLegend, buildHeatmap } from "./Heatmap";
import { StatNumber } from "./StatNumber";
import {
  ActivityIcon,
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
import { currentlyLearning, email, github, linkedin, tools, toolsLoop } from "@/lib/data";

const smallStatFont =
  "font-mono text-[16.5px] font-medium text-accent-light max-[700px]:text-[15px]";
const smallStatLabel =
  "font-mono text-[9.5px] tracking-[0.07em] text-text-faint uppercase whitespace-nowrap max-[700px]:text-[10.5px] max-[700px]:tracking-[0.06em]";

export function Snapshot() {
  const { total, longestStreak } = buildHeatmap();
  const ref = useReveal<HTMLElement>();
  const row1Ref = useReveal<HTMLDivElement>();
  const row2Ref = useReveal<HTMLDivElement>();

  return (
    <section id="snapshot" ref={ref} className="reveal flex flex-col gap-[22px]">
      <div ref={row1Ref} className="reveal-group flex flex-wrap items-stretch gap-[22px]">
        {/* Activity */}
        <div style={{ "--delay": "0ms" } as React.CSSProperties} className="blur-in glass-accent min-w-0 flex-[6_1_340px] rounded-[22px] p-[clamp(24px,2.2vw,34px)] max-[700px]:flex-[1_1_100%]">
          <CardEyebrow icon={<ActivityIcon />} className="mb-[18px]">
            Activity
          </CardEyebrow>
          <div className="mb-[26px] flex flex-wrap items-baseline justify-between gap-5">
            <div className="mb-[7px] flex flex-wrap items-center gap-[10px]">
              <p className="m-0 font-mono text-[11px] tracking-[0.12em] text-text-faint uppercase">
                Contribution activity
              </p>
              <span className="rounded-[4px] border border-[rgba(224,138,92,0.45)] px-[7px] py-[3px] font-mono text-[9.5px] tracking-[0.11em] text-accent-light uppercase">
                Sample
              </span>
            </div>
            <HeatmapLegend />
          </div>
          <div className="pb-1">
            <Heatmap />
          </div>
          <div className="mt-[22px] flex flex-nowrap items-start justify-between gap-[18px] border-t border-[rgba(242,237,228,0.09)] pt-[18px]">
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
        <div style={{ "--delay": "110ms" } as React.CSSProperties} className="blur-in flex min-w-0 flex-[2_1_170px] flex-col gap-[22px] max-[700px]:order-2 max-[700px]:flex-none max-[700px]:basis-[calc(50%-11px)] max-[700px]:gap-[14px]">
          <div className="glass-accent flex flex-1 flex-col justify-center gap-1.5 rounded-[22px] p-[clamp(24px,2.2vw,34px)] max-[700px]:px-4 max-[700px]:py-5">
            <CardEyebrow icon={<CoffeeIcon />}>Coffees drank</CardEyebrow>
            <StatNumber
              end={1476}
              className="m-0 mt-1.5 text-[clamp(30px,3.4vw,44px)] leading-none font-medium tracking-[-0.035em] text-text-primary max-[700px]:text-[32px]"
            />
          </div>
          <div className="glass-accent flex flex-1 flex-col justify-center gap-1.5 rounded-[22px] p-[clamp(24px,2.2vw,34px)] max-[700px]:px-4 max-[700px]:py-5">
            <CardEyebrow icon={<CodeIcon />}>Lines of code</CardEyebrow>
            <StatNumber
              end={52110}
              className="m-0 mt-1.5 text-[clamp(30px,3.4vw,44px)] leading-none font-medium tracking-[-0.035em] text-text-primary max-[700px]:text-[32px]"
            />
          </div>
        </div>

        {/* Connect */}
        <div style={{ "--delay": "220ms" } as React.CSSProperties} className="blur-in glass-accent flex min-w-0 flex-[2_1_180px] flex-col rounded-[22px] p-[clamp(24px,2.2vw,34px)] max-[700px]:order-1 max-[700px]:flex-none max-[700px]:basis-[calc(50%-11px)]">
          <CardEyebrow icon={<ConnectIcon />} className="mb-5">
            Connect
          </CardEyebrow>
          <div className="flex flex-col">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-[11px] border-b border-[rgba(242,237,228,0.08)] py-[11px] text-[14.5px] text-[#D8D0C4] transition-colors duration-250 hover:text-accent-light max-[700px]:min-h-[46px] max-[700px]:py-3 max-[700px]:text-[15px]"
            >
              <MailIcon className="shrink-0 text-accent-light" />
              Email
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-[11px] border-b border-[rgba(242,237,228,0.08)] py-[11px] text-[14.5px] text-[#D8D0C4] transition-colors duration-250 hover:text-accent-light max-[700px]:min-h-[46px] max-[700px]:py-3 max-[700px]:text-[15px]"
            >
              <LinkedinIcon className="shrink-0 text-accent-light" />
              LinkedIn
            </a>
            <a
              href={github}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-[11px] border-b border-[rgba(242,237,228,0.08)] py-[11px] text-[14.5px] text-[#D8D0C4] transition-colors duration-250 hover:text-accent-light max-[700px]:min-h-[46px] max-[700px]:py-3 max-[700px]:text-[15px]"
            >
              <GithubIcon className="shrink-0 text-accent-light" />
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div ref={row2Ref} className="reveal-group flex flex-wrap items-stretch gap-[22px]">
        {/* Education */}
        <div style={{ "--delay": "0ms" } as React.CSSProperties} className="blur-in glass-accent flex min-w-0 flex-[5_1_330px] flex-col gap-5 rounded-[22px] p-[clamp(24px,2.2vw,34px)]">
          <CardEyebrow icon={<EducationIcon />}>Education</CardEyebrow>
          <div>
            <p className="m-0 mb-1.5 text-[17px] font-medium tracking-[-0.015em]">Ontario Tech University</p>
            <p className="m-0 mb-[3px] text-[14.5px] text-text-muted">BEng Software Engineering</p>
            <p className="m-0 font-mono text-[11.5px] text-text-faint">Co-op stream · 2023 — 2028</p>
          </div>
          <div className="mt-auto flex flex-wrap gap-2">
            {["Data structures", "Databases", "Systems design"].map((t) => (
              <span
                key={t}
                className="rounded-[4px] border border-[rgba(242,237,228,0.14)] px-[9px] py-[5px] font-mono text-[10.5px] whitespace-nowrap text-text-secondary"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Fav tool */}
        <div style={{ "--delay": "110ms" } as React.CSSProperties} className="blur-in glass-accent flex min-w-0 flex-[4_1_285px] flex-col rounded-[22px] p-[clamp(24px,2.2vw,34px)]">
          <CardEyebrow icon={<HeartIcon />} className="mb-5">
            Fav tool
          </CardEyebrow>
          <div className="flex items-center gap-[14px]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[rgba(224,138,92,0.34)] bg-[rgba(194,96,58,0.12)] font-mono text-[15px] text-accent-light">
              SB
            </span>
            <div className="min-w-0">
              <p className="m-0 mb-[3px] text-[19px] tracking-[-0.02em]">Supabase</p>
              <p className="m-0 font-mono text-[10px] tracking-[0.09em] text-text-faint uppercase">
                postgres · rls · edge functions
              </p>
            </div>
          </div>
          <p className="text-pretty m-0 mt-auto pt-[18px] text-[14px] leading-[1.6] text-text-muted">
            Row-level security means the database enforces the rules, not my client code.
          </p>
        </div>
      </div>

      {/* Tools ticker */}
      <div className="glass-accent rounded-[22px] p-[clamp(24px,2.2vw,34px)]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-5">
          <CardEyebrow icon={<ToolIcon />}>Tools</CardEyebrow>
          <p className="m-0 font-mono text-[10px] tracking-[0.09em] text-text-faint uppercase max-[700px]:hidden">
            {tools.length} daily drivers
          </p>
        </div>
        <div
          className="relative overflow-hidden"
          style={{
            margin: "0 calc(-1 * clamp(24px,2.2vw,34px))",
            maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
          }}
        >
          <ToolsTrack />
        </div>
        <div className="mt-[26px] flex flex-wrap gap-9 border-t border-[rgba(242,237,228,0.09)] pt-5">
          <div>
            <p className="m-0 mb-[9px] font-mono text-[10px] tracking-[0.09em] text-text-faint uppercase">
              Currently learning
            </p>
            <div className="flex flex-wrap gap-2">
              {currentlyLearning.map((t) => (
                <span
                  key={t}
                  className="rounded-[5px] border border-[rgba(242,237,228,0.14)] px-[10px] py-[6px] font-mono text-[11px] text-text-secondary"
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

function ToolsTrack() {
  return (
    <div
      className="flex w-max gap-3 py-0.5 [animation:marquee-scroll_36s_linear_infinite] max-[700px]:gap-[14px]"
      style={{ padding: "2px clamp(24px,2.2vw,34px)" }}
    >
      {toolsLoop.map((tool, i) => (
        <div
          key={`${tool.mark}-${i}`}
          className="flex w-[148px] shrink-0 flex-col gap-3 rounded-[14px] border border-[rgba(242,237,228,0.09)] bg-[rgba(242,237,228,0.028)] px-4 py-[18px] transition-all duration-300 hover:-translate-y-[3px] hover:border-[rgba(224,138,92,0.4)] hover:bg-[rgba(194,96,58,0.08)] max-[700px]:w-auto max-[700px]:gap-0 max-[700px]:border-none max-[700px]:bg-transparent max-[700px]:p-0"
        >
          <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] border border-[rgba(224,138,92,0.34)] font-mono text-[12.5px] text-accent-light max-[700px]:h-[42px] max-[700px]:w-[42px] max-[700px]:rounded-[11px] max-[700px]:text-[14px]">
            {tool.mark}
          </span>
          <div className="max-[700px]:hidden">
            <p className="m-0 mb-[3px] text-[14.5px] tracking-[-0.01em]">{tool.name}</p>
            <p className="m-0 font-mono text-[10px] tracking-[0.07em] text-text-faint uppercase">{tool.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
