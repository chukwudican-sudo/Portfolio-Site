"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectClip } from "@/lib/assets";

/**
 * Plays a project's clips end to end, then loops back to the first.
 *
 * Every clip gets its own <video>, all preloaded, and switching is just an
 * opacity swap. A single element with a swapped `src` has to tear down and
 * reload between clips, and the card's background flashes through the gap.
 */
export function ProjectClips({ clips, eager = false }: { clips: ProjectClip[]; eager?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  // The detail view is on screen the moment it opens, so it starts armed —
  // waiting for an observer there just adds a beat of black before playback.
  const [armed, setArmed] = useState(eager);

  useEffect(() => {
    if (eager) return;
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
  }, [active, eager]);

  useEffect(() => {
    if (!armed) return;
    const el = videoRefs.current[active];
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
  }, [active, armed]);

  return (
    <div ref={hostRef} className="absolute inset-0">
      {clips.map((clip, i) => (
        <video
          key={clip.sd}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          src={eager ? clip.hd : clip.sd}
          // the first frame paints immediately, so there is no black hole while
          // the file is still arriving
          poster={clip.poster}
          muted
          playsInline
          autoPlay={eager && i === 0}
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
