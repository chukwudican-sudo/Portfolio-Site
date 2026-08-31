"use client";

import { useReveal } from "@/hooks/useReveal";
import { email, resumeHref } from "@/lib/data";

export function Contact() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="contact" ref={ref} className="reveal flex flex-wrap gap-[22px] pb-6">
      <div
        className="relative min-w-0 flex-[1_1_100%] overflow-hidden rounded-[22px] border border-[rgba(224,138,92,0.26)] bg-[linear-gradient(150deg,rgba(56,32,22,0.66),rgba(20,17,16,0.82)_68%)] p-[clamp(30px,3.2vw,50px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.11),0_34px_76px_-44px_rgba(0,0,0,0.92)] backdrop-blur-[22px]
        max-[700px]:rounded-[20px] max-[700px]:p-[20px_18px_22px]"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(600px_320px_at_82%_10%,rgba(194,96,58,0.24),transparent_66%)]"
        />
        <div className="relative">
          <p className="m-0 mb-5 font-mono text-[11px] tracking-[0.12em] text-text-dim uppercase">05 — Contact</p>
          <h2 className="m-0 mb-[18px] max-w-[min(22ch,100%)] text-[clamp(30px,3.4vw,46px)] font-semibold tracking-[-0.04em] text-balance max-[700px]:mb-3 max-[700px]:max-w-full max-[700px]:text-[25px] max-[700px]:leading-[1.14]">
            Looking for a co-op software engineer?
          </h2>
          <p className="text-pretty m-0 mb-8 max-w-[min(48ch,100%)] text-[16.5px] leading-[1.65] text-text-secondary max-[700px]:mb-5 max-[700px]:text-[14px] max-[700px]:leading-[1.55]">
            I&rsquo;m available for Winter 2027 and happy to walk through any of these projects in detail —
            including the parts that went wrong.
          </p>
          <div className="flex flex-wrap gap-[14px] max-[700px]:flex-col max-[700px]:gap-[10px]">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center justify-center gap-[9px] rounded-[6px] bg-accent px-[26px] py-[15px] text-[15px] font-medium text-surface shadow-[0_14px_30px_-14px_rgba(194,96,58,0.9)] transition-all duration-250 hover:-translate-y-[3px] hover:bg-accent-light max-[700px]:min-h-12 max-[700px]:rounded-[10px] max-[700px]:px-[18px] max-[700px]:py-0 max-[700px]:text-[15px]"
            >
              Email me <span className="font-mono text-[12.5px]">→</span>
            </a>
            <a
              href={resumeHref}
              download="Chukwudi_Alex_Software_Engineering_Resume.pdf"
              className="inline-flex items-center justify-center rounded-[6px] border border-[rgba(242,237,228,0.18)] px-[26px] py-[15px] text-[15px] text-text-primary transition-all duration-250 hover:border-[rgba(224,138,92,0.55)] hover:bg-[rgba(194,96,58,0.10)] max-[700px]:min-h-12 max-[700px]:rounded-[10px] max-[700px]:px-[18px] max-[700px]:py-0 max-[700px]:text-[15px]"
            >
              Download résumé
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
