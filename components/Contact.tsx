"use client";

import { useReveal } from "@/hooks/useReveal";
import { email, resumeHref } from "@/lib/data";

export function Contact() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="contact" ref={ref} className="reveal flex flex-wrap gap-[19.8px] pb-6">
      <div
        className="relative min-w-0 flex-[1_1_100%] overflow-hidden rounded-[19.8px] border border-[rgba(224,138,92,0.26)] bg-[linear-gradient(150deg,rgba(56,32,22,0.66),rgba(20,17,16,0.82)_68%)] p-[clamp(27px,3.2vw,45px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.11),0_34px_76px_-44px_rgba(0,0,0,0.92)] backdrop-blur-[19.8px]
        max-[700px]:rounded-[18px] max-[700px]:p-[20px_18px_22px]"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(600px_320px_at_82%_10%,rgba(194,96,58,0.24),transparent_66%)]"
        />
        <div className="relative">
          <p className="m-0 mb-5 font-mono text-[9.9px] tracking-[0.12em] text-text-dim uppercase">05 — Contact</p>
          <h2 className="m-0 mb-[16.2px] max-w-[min(22ch,100%)] text-[clamp(27px,3.4vw,41.4px)] font-semibold tracking-[-0.04em] text-balance max-[700px]:mb-3 max-[700px]:max-w-full max-[700px]:text-[22.5px] max-[700px]:leading-[1.14]">
            Looking for a co-op software engineer?
          </h2>
          <p className="text-pretty m-0 mb-8 max-w-[min(48ch,100%)] text-[14.85px] leading-[1.65] text-text-secondary max-[700px]:mb-5 max-[700px]:text-[12.6px] max-[700px]:leading-[1.55]">
            I&rsquo;m available for Winter 2027 and happy to walk through any of these projects in detail —
            including the parts that went wrong.
          </p>
          <div className="flex flex-wrap gap-[12.6px] max-[700px]:flex-col max-[700px]:gap-[9px]">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center justify-center gap-[8.1px] rounded-[5.4px] bg-accent px-[23.4px] py-[13.5px] text-[13.5px] font-medium text-surface shadow-[0_14px_30px_-14px_rgba(194,96,58,0.9)] transition-all duration-250 hover:-translate-y-[2.7px] hover:bg-accent-light max-[700px]:min-h-12 max-[700px]:rounded-[9px] max-[700px]:px-[16.2px] max-[700px]:py-0 max-[700px]:text-[13.5px]"
            >
              Email me <span className="font-mono text-[11.25px]">→</span>
            </a>
            <a
              href={resumeHref}
              download="Chukwudi_Alex_Software_Engineering_Resume.pdf"
              className="inline-flex items-center justify-center rounded-[5.4px] border border-[rgba(242,237,228,0.18)] px-[23.4px] py-[13.5px] text-[13.5px] text-text-primary transition-all duration-250 hover:border-[rgba(224,138,92,0.55)] hover:bg-[rgba(194,96,58,0.10)] max-[700px]:min-h-12 max-[700px]:rounded-[9px] max-[700px]:px-[16.2px] max-[700px]:py-0 max-[700px]:text-[13.5px]"
            >
              Download résumé
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
