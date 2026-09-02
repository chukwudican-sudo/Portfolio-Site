"use client";

import { useReveal } from "@/hooks/useReveal";
import Link from "next/link";
import { posts } from "@/lib/data";
import { ImageSlot } from "./ImageSlot";

export function Writing({ covers = {} }: { covers?: Record<string, string> }) {
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
      </div>

      {/* The cover is the only framed element — title, excerpt and date sit on
          the page itself rather than inside a card. */}
      <div
        ref={gridRef}
        className="reveal-group grid grid-cols-3 gap-x-[34px] gap-y-10 max-[700px]:grid-cols-1 max-[700px]:gap-y-9"
      >
        {posts.map((post, i) => (
          <Link
            key={post.id}
            href={`/writing/${post.id}`}
            style={{ "--delay": `${i * 90}ms` } as React.CSSProperties}
            className="blur-in group/post flex min-w-0 flex-col outline-none"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] border border-[rgba(242,237,228,0.09)] bg-[rgba(255,255,255,0.014)] transition-colors duration-300 group-hover/post:border-[rgba(242,237,228,0.2)]">
              {covers[post.id] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={covers[post.id]} alt="" loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <ImageSlot label="Cover image" />
              )}
            </div>

            <h3 className="text-pretty m-0 mt-[22px] text-[19.5px] leading-[1.3] font-semibold tracking-[-0.02em] text-text-primary max-[700px]:mt-4 max-[700px]:text-[18px]">
              {post.title}{" "}
              <span className="ml-0.5 inline-block text-[13px] text-text-dim transition-colors duration-250 group-hover/post:text-accent-light">
                ↗
              </span>
            </h3>

            <p className="text-pretty m-0 mt-[10px] line-clamp-2 text-[15px] leading-[1.6] text-text-muted">
              {post.excerpt}
            </p>

            <span className="mt-[18px] text-[14px] text-text-faint max-[700px]:mt-3">{post.date}</span>
          </Link>
        ))}
      </div>

      <a
        href="#writing"
        className="mt-2 inline-flex items-center justify-center gap-2 self-center text-[15px] text-text-dim transition-colors duration-250 hover:text-text-primary max-[700px]:min-h-11"
      >
        Read all posts <span className="text-[13px]">↗</span>
      </a>
    </section>
  );
}
