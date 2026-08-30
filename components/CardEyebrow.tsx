import type { ReactNode } from "react";

/**
 * Card label row (icon + mono caption). The gap below it differs per card in
 * the design (18px / 20px / none, where the card's own flex gap supplies it),
 * so spacing is passed in rather than baked in.
 */
export function CardEyebrow({
  icon,
  children,
  className = "",
}: {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-[10px] ${className}`}>
      <span className="shrink-0 text-accent-light">{icon}</span>
      <p className="m-0 font-mono text-[11px] tracking-[0.12em] text-[#C8BFB2] uppercase">{children}</p>
    </div>
  );
}
