"use client";

import { useCountUp } from "@/hooks/useCountUp";

export function StatNumber({ end, className }: { end: number; className?: string }) {
  const { ref, value } = useCountUp(end);
  return (
    <p ref={ref} className={className}>
      {value.toLocaleString("en-US")}
    </p>
  );
}
