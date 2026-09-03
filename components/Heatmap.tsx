import { buildHeatmap } from "@/lib/data";

const legend = [
  "rgba(242,237,228,0.07)",
  "rgba(194,96,58,0.30)",
  "rgba(194,96,58,0.55)",
  "rgba(194,96,58,0.80)",
  "#E08A5C",
];

export function Heatmap() {
  const { cells } = buildHeatmap();
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-[clamp(1.35px,0.3vw,3.15px)]">
      {cells.map((cell, i) => (
        <span
          key={i}
          title={cell.title}
          style={{ background: cell.color }}
          className="aspect-square w-full min-w-0 rounded-[2.25px] transition-transform duration-200"
        />
      ))}
    </div>
  );
}

export function HeatmapLegend() {
  return (
    <div className="flex items-center gap-[8.1px] font-mono text-[9.45px] text-text-faint">
      <span>less</span>
      {legend.map((color) => (
        <span key={color} style={{ background: color }} className="h-[9.9px] w-[9.9px] rounded-[2.25px]" />
      ))}
      <span>more</span>
    </div>
  );
}

export { buildHeatmap };
