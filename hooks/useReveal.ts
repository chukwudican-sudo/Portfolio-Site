"use client";

import { useEffect, useRef } from "react";

/**
 * Adds `.is-visible` (see .reveal in globals.css) the first time the element
 * intersects the viewport, for a one-shot fade/rise-in on scroll.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let settleTimer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
          // Drop the filter once the animation is done. A filter other than
          // `none` makes the element a containing block for fixed-position
          // descendants, so leaving blur(0) behind would silently reparent any
          // fixed child of a revealed section.
          settleTimer = setTimeout(() => el.classList.add("is-settled"), 1800);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(settleTimer);
    };
  }, []);

  return ref;
}
