"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Plays a project's clips end to end, then loops back to the first.
 *
 * Every clip gets its own <video>, all preloaded, and switching is just an
 * opacity swap. A single element with a swapped `src` has to tear down and
 * reload between clips, and the card's background flashes through the gap.
 *
 * Nothing is fetched until the card is near the viewport: these are multi-
 * megabyte files and most of this site's traffic is on phones.
 */
export function ProjectClips({ clips }: { clips: string[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setArmed(entry.isIntersecting);
        const el = videoRefs.current[active];
        if (!el) return;
        // autoplay can still be refused; a rejected promise is not an error
        if (entry.isIntersecting) el.play().catch(() => {});
        else videoRefs.current.forEach((v) => v?.pause());
      },
      { rootMargin: "200px" },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [active]);

  useEffect(() => {
    if (!armed) return;
    const el = videoRefs.current[active];
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
  }, [active, armed]);

  return (
    <div ref={hostRef} className="absolute inset-0">
      {clips.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          src={src}
          muted
          playsInline
          // no `loop`: looping one clip would never reach the next
          preload={armed ? "auto" : "none"}
          onEnded={() => setActive((n) => (n + 1) % clips.length)}
          aria-label="Project preview"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
