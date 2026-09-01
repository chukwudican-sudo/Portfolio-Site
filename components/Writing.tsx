"use client";

import { useReveal } from "@/hooks/useReveal";
import Link from "next/link";
import { posts } from "@/lib/data";
import { ImageSlot } from "./ImageSlot";

export function Writing() {
  const ref = useReveal<HTMLElement>();
  const gridRef = useReveal<HTMLDivElement>();
  return (
    <section id="writing" ref={ref} className="reveal flex flex-col gap-[26px]">
      <div className="flex flex-wrap items-baseline justify-between gap-5 px-1 pt-1">
        <div>
          <p className="m-0 mb-[9px] font-mono text-[11px] tracking-[0.12em] text-text-faint uppercase">
            03 — Writing
          </p>
          <h2 className="m-0 mb-[10px] text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.035em]">
            Notes from the build
          </h2>
          <p className="text-pretty m-0 max-w-[min(46ch,100%)] text-[15.5px] leading-[1.65] text-text-muted">
            Decisions I had to think hard about, written down while they were still fresh.
          </p>
        </div>
        <a href="#writing" className="shrink-0 font-mono text-[11.5px] tracking-[0.06em] text-accent-light whitespace-nowrap uppercase max-[700px]:hidden">
          All posts →
        </a>
      </div>

      <div ref={gridRef} className="reveal-group flex flex-wrap items-stretch gap-[22px] max-[700px]:flex-col max-[700px]:gap-6">
        {posts.map((post, i) => (
          <Link
            key={post.id}
            href={`/writing/${post.id}`}
            style={{ "--delay": `${i * 90}ms` } as React.CSSProperties}
            className="blur-in glass-accent glass-hover glass-flat-mobile flex min-w-0 flex-1 basis-[290px] flex-col overflow-hidden rounded-[18px] max-[700px]:flex-none max-[700px]:basis-auto max-[700px]:flex-row max-[700px]:items-start max-[700px]:gap-[14px] max-[700px]:rounded-none max-[700px]:p-0"
          >
            <div className="relative aspect-[16/10] overflow-hidden border-b border-[rgba(242,237,228,0.07)] bg-[radial-gradient(420px_220px_at_60%_30%,rgba(194,96,58,0.22),transparent_70%)] max-[700px]:mt-0.5 max-[700px]:aspect-[16/9] max-[700px]:w-[84px] max-[700px]:shrink-0 max-[700px]:rounded-[9px] max-[700px]:border-none">
              <ImageSlot label="Cover image" />
            </div>
            <div className="flex flex-1 flex-col gap-[11px] p-6 pb-[26px] max-[700px]:min-w-0 max-[700px]:gap-[7px] max-[700px]:p-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-pretty m-0 text-[18.5px] leading-[1.35] font-semibold tracking-[-0.02em] max-[700px]:text-[14px] max-[700px]:leading-[1.32] max-[700px]:font-bold">
                  {post.title} <span className="font-mono text-[12px] text-accent-light max-[700px]:hidden">↗</span>
                </h3>
                <span className="hidden shrink-0 pt-0.5 font-mono text-[11.5px] whitespace-nowrap text-text-faint max-[700px]:block">
                  {post.date}
                </span>
              </div>
              <p className="text-pretty m-0 text-[14.5px] leading-[1.6] text-text-muted max-[700px]:line-clamp-2 max-[700px]:text-[13px] max-[700px]:leading-[1.5]">
                {post.excerpt}
              </p>
              <div className="mt-auto flex justify-between gap-[14px] pt-[14px] font-mono text-[10px] tracking-[0.09em] text-text-faint uppercase max-[700px]:hidden">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <a
        href="#writing"
        className="hidden self-center text-[13.5px] text-text-dim max-[700px]:mt-1 max-[700px]:inline-flex max-[700px]:min-h-11 max-[700px]:items-center max-[700px]:justify-center"
      >
        Read all posts  ↗
      </a>
    </section>
  );
}
