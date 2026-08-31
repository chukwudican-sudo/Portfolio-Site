"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Shared shell for the expanded card views: a centred modal above 700px, a
 * full-screen page at or below it.
 *
 * Rendered through a portal to document.body. Sections carry a transform (the
 * scroll reveal) and the page carries a `zoom`, either of which becomes the
 * containing block for position:fixed — in place, the scrim would size itself
 * to the section rather than the viewport.
 */
export function Overlay({
  label,
  isMobile,
  onClose,
  backLabel = "All projects",
  /** Panel width. Text-only content wants a narrower measure than content
   *  led by a full-bleed image. */
  width = 1020,
  children,
}: {
  label: string;
  isMobile: boolean;
  onClose: () => void;
  backLabel?: string;
  width?: number;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dismissRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // Refs point at nothing until the portal mounts, so this has to wait for
    // it or the dismiss control never takes focus.
    if (!mounted) return;

    // Lock both — iOS Safari honours documentElement, others body. Restore to
    // '' rather than 'visible' so any authored value survives.
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    if (panelRef.current) panelRef.current.scrollTop = 0;
    dismissRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = panelRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [onClose, mounted]);

  if (!mounted) return null;

  if (isMobile) {
    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        ref={panelRef}
        className="fixed inset-0 z-[300] overflow-y-auto bg-surface"
      >
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[rgba(242,237,228,0.09)] bg-[rgba(16,14,13,0.92)] px-[18px] py-[14px] backdrop-blur-md">
          <button
            ref={dismissRef}
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center gap-2 bg-transparent px-1 font-mono text-[11.5px] tracking-[0.07em] text-accent-light uppercase"
          >
            <span className="text-[15px] leading-none">←</span>
            {backLabel}
          </button>
        </div>
        <div className="pb-[60px]">{children}</div>
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[300] overflow-y-auto overscroll-contain bg-[rgba(8,7,7,0.72)] backdrop-blur-[10px]"
      onMouseDown={(e) => {
        // desktop-only scrim dismiss; anything inside the panel is ignored
        if (!panelRef.current?.contains(e.target as Node)) onClose();
      }}
    >
      {/* min-h-full + centring: short panels sit in the middle of the viewport,
          tall ones scroll from the top instead of being clipped. */}
      <div className="flex min-h-full items-center justify-center p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          ref={panelRef}
          style={{ width: `min(${width}px, 100%)` }}
          className="relative max-h-[86vh] overflow-y-auto overscroll-contain rounded-[14px] border border-[rgba(242,237,228,0.08)] bg-[#141211] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
        >
          {/* zero-height sticky rail: keeps the dismiss pinned while the panel
              scrolls, without reserving a band of empty space above content */}
          <div className="sticky top-0 z-20 h-0">
            <button
              ref={dismissRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-[8px] border border-[rgba(242,237,228,0.11)] bg-[rgba(20,18,17,0.82)] text-[15px] leading-none text-[#B7AFA3] backdrop-blur-sm transition-colors duration-200 hover:border-[rgba(224,138,92,0.42)] hover:text-text-primary"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
