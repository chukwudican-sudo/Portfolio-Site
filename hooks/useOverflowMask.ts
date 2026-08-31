"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * True only when the element's text is actually clamped.
 *
 * The fade mask must not be applied unconditionally: on copy that already fits,
 * it washes out the last line for no reason — a false affordance and a contrast
 * regression. Line count moves with width and with font loading, so this
 * re-measures on resize and once fonts settle.
 */
export function useOverflowMask<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [clamped, setClamped] = useState(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setClamped(el.scrollHeight > el.clientHeight + 1);
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return { ref, clamped };
}
