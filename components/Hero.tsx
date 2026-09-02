import { getPortraitAssets } from "@/lib/assets";
import { PointCloudPortrait } from "./PointCloudPortrait";

export function Hero() {
  const portrait = getPortraitAssets();
  return (
    <section
      className="flex min-h-[min(86vh,880px)] flex-wrap items-stretch gap-[22px] pt-[clamp(60px,10vh,132px)] pb-[clamp(8px,2vh,28px)] max-[700px]:min-h-0 max-[700px]:flex-col max-[700px]:items-center max-[700px]:justify-center max-[700px]:pt-[22px] max-[700px]:pb-0 max-[700px]:text-center"
    >
      {/* Text card */}
      <div className="glass glass-flat-mobile relative order-1 flex min-h-[clamp(430px,58vh,600px)] min-w-0 flex-[7_1_440px] flex-col justify-center overflow-hidden rounded-[22px] p-[clamp(34px,3.6vw,62px)] max-[700px]:order-2 max-[700px]:min-h-0 max-[700px]:w-full max-[700px]:flex-none max-[700px]:overflow-visible max-[700px]:p-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 font-mono text-accent-light max-[700px]:hidden"
        >
          <span className="absolute right-[5%] bottom-[9%] text-[44px] opacity-[0.075] [animation:drift-a_34s_ease-in-out_infinite]">
            {"{ }"}
          </span>
          <span className="absolute right-[16%] bottom-[7%] text-[26px] opacity-[0.06] [animation:drift-b_41s_ease-in-out_infinite]">
            {"=>"}
          </span>
          <span className="absolute top-[8%] right-[7%] text-[28px] opacity-[0.06] [animation:drift-b_37s_ease-in-out_infinite]">
            {"( )"}
          </span>
          <span className="absolute bottom-[5%] left-[3%] text-[22px] opacity-[0.05] [animation:drift-a_45s_ease-in-out_infinite]">
            ;
          </span>
        </div>

        <div className="relative">
          <div className="mb-[26px] flex items-center gap-[11px] max-[700px]:mb-5 max-[700px]:justify-center">
            <span
              className="h-[7px] w-[7px] shrink-0 rounded-full bg-accent-glow shadow-[0_0_8px_2px_rgba(224,138,92,0.75),0_0_18px_5px_rgba(194,96,58,0.35)] [animation:pulse-dot_2.6s_ease-in-out_infinite]"
              aria-hidden
            />
            <p className="m-0 font-mono text-[11.5px] tracking-[0.13em] text-text-dim uppercase max-[700px]:text-[10px] max-[700px]:tracking-[0.11em]">
              Available — Winter 2027 co-op
            </p>
          </div>

          <h1 className="m-0 mb-[18px] text-[clamp(37px,5.2vw,78px)] leading-[0.96] font-semibold tracking-[-0.05em] max-[700px]:mb-[10px] max-[700px]:text-[46px] max-[700px]:leading-[1.02] max-[700px]:tracking-[-0.045em]">
            Hi, I&rsquo;m{" "}
            <span className="bg-[linear-gradient(96deg,var(--color-accent-glow),var(--color-text-primary)_62%)] bg-clip-text pr-[0.08em] pb-[0.12em] text-[1.06em] leading-[1.28] font-normal tracking-normal text-transparent">
              <span className="font-script-caps pr-[0.02em]">A</span>
              <span className="font-script">lex</span>
            </span>
          </h1>

          <p className="m-0 mt-[22px] mb-[30px] max-w-[min(54ch,100%)] text-[clamp(17px,1.4vw,20px)] leading-[1.6] font-medium text-text-primary max-[700px]:mx-auto max-[700px]:mt-[14px] max-[700px]:mb-[26px] max-[700px]:max-w-full max-[700px]:text-[13.5px] max-[700px]:leading-[1.55] max-[700px]:text-text-primary">
            A Software Engineer who builds things{" "}
            <span className="font-script pr-[0.06em] text-[1.18em] leading-[1.1] font-normal tracking-normal whitespace-nowrap text-text-primary">
              end to end
            </span>
            .
          </p>

          <div className="flex flex-wrap gap-[14px] max-[700px]:justify-center max-[700px]:gap-[10px]">
            <a
              href="#projects"
              className="beam inline-flex items-center gap-[9px] rounded-[6px] bg-accent px-6 py-[14px] text-[14.5px] font-medium text-surface shadow-[0_14px_30px_-14px_rgba(194,96,58,0.9)] transition-all duration-250 hover:-translate-y-[3px] hover:bg-accent-light max-[700px]:min-h-11 max-[700px]:px-[18px] max-[700px]:py-3 max-[700px]:text-[13.5px]"
            >
              View projects <span className="font-mono text-[12.5px]">→</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center rounded-[6px] border border-[rgba(242,237,228,0.18)] px-6 py-[14px] text-[14.5px] whitespace-nowrap text-text-primary transition-all duration-250 hover:border-[rgba(224,138,92,0.55)] hover:bg-[rgba(194,96,58,0.10)] max-[700px]:min-h-11 max-[700px]:px-[18px] max-[700px]:py-3 max-[700px]:text-[13.5px]"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>

      {/* ID card */}
      <div
        className="relative order-2 flex min-h-[clamp(430px,58vh,600px)] min-w-0 flex-[5_1_330px] flex-col gap-[clamp(12px,1.2vw,18px)] rounded-[22px] border border-[rgba(242,237,228,0.13)] bg-[linear-gradient(200deg,rgba(44,32,26,0.72),rgba(16,15,14,0.86)_64%)] p-[clamp(16px,1.4vw,22px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_34px_76px_-44px_rgba(0,0,0,0.92)] backdrop-blur-[26px]
        max-[700px]:order-1 max-[700px]:mb-[26px] max-[700px]:h-[188px] max-[700px]:min-h-0 max-[700px]:w-[188px] max-[700px]:flex-none max-[700px]:gap-0 max-[700px]:rounded-full max-[700px]:bg-[radial-gradient(circle_at_50%_30%,rgba(194,96,58,0.42),rgba(16,15,14,0.9)_72%)] max-[700px]:p-[5px] max-[700px]:shadow-[0_0_60px_12px_rgba(194,96,58,0.28),inset_0_1px_0_rgba(255,255,255,0.12)]"
      >
        <div className="flex items-center gap-[14px] px-[6px] pt-0.5 max-[700px]:hidden">
          <span
            aria-hidden
            className="h-2 w-[52px] rounded-[4px] bg-[rgba(242,237,228,0.14)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
          />
          <div className="min-w-0 flex-1">
            <p className="m-0 font-mono text-[10.5px] tracking-[0.16em] text-text-dim uppercase">
              Ontario Tech University
            </p>
            <p className="mt-0.5 mb-0 font-mono text-[10.5px] tracking-[0.1em] text-text-faint uppercase">
              Software Engineering · Co-op
            </p>
          </div>
          <span className="font-mono text-[10.5px] tracking-[0.1em] whitespace-nowrap text-text-faint uppercase">
            ID 100911263
          </span>
        </div>

        <div className="relative flex min-h-0 flex-1 items-end overflow-hidden rounded-[14px] border border-[rgba(242,237,228,0.09)] bg-[radial-gradient(520px_340px_at_52%_24%,rgba(194,96,58,0.30),transparent_68%),rgba(0,0,0,0.22)] max-[700px]:w-full max-[700px]:rounded-full">
          <PointCloudPortrait photoSrc={portrait.photo} depthSrc={portrait.depth} />
          <span
            aria-hidden
            className="absolute top-[14px] right-[14px] h-[26px] w-[34px] rounded-[4px] border border-[rgba(224,138,92,0.34)] bg-[linear-gradient(150deg,rgba(224,138,92,0.22),rgba(194,96,58,0.06))] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.25)] max-[700px]:hidden"
          />
        </div>

        <div className="flex flex-wrap items-end justify-between gap-[18px] px-[6px] pb-0.5 max-[700px]:hidden">
          <div className="min-w-0">
            <p className="m-0 mb-[5px] font-mono text-[10.5px] tracking-[0.14em] text-text-faint uppercase">Name</p>
            <p className="m-0 mb-[9px] text-[19px] font-medium tracking-[-0.025em]">Chukwudi Ndubuisi</p>
            <p className="m-0 font-mono text-[10.5px] tracking-[0.1em] text-text-dim uppercase">
              Oshawa, ON · Class of &lsquo;28
            </p>
          </div>
          <div className="flex flex-col items-end gap-[9px]">
            <span className="rounded-[4px] border border-[rgba(224,138,92,0.4)] px-[9px] py-[5px] font-mono text-[10.5px] tracking-[0.08em] whitespace-nowrap text-accent-light uppercase">
              Co-op
            </span>
            <span aria-hidden className="flex h-[26px] items-end gap-[2px]">
              {[100, 70, 100, 56, 88, 100, 64, 92, 74].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%`, opacity: 0.22 + (h / 100) * 0.28 }}
                  className={i % 3 === 2 ? "w-[3px] bg-text-primary" : "w-px bg-text-primary"}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
