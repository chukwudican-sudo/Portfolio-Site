/**
 * Stand-in for a project with no preview footage yet: a pixel hourglass whose
 * sand falls grain by grain, on black. Built from discrete squares with
 * `steps()` timing rather than smooth motion, so it reads as pixel art rather
 * than a spinner that happens to be blocky.
 */
export function ProjectPending({ label = "In production" }: { label?: string }) {
  // grains in the upper bulb, drained top-down; each is a 3px cell
  const top = [
    [7, 4], [9, 4], [11, 4], [13, 4],
    [8, 6], [10, 6], [12, 6],
    [9, 8], [11, 8],
    [10, 10],
  ];
  // grains piling up in the lower bulb, filled bottom-up
  const bottom = [
    [10, 22],
    [9, 24], [11, 24],
    [8, 26], [10, 26], [12, 26],
    [7, 28], [9, 28], [11, 28], [13, 28],
  ];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[12.6px] bg-black">
      <svg width="60" height="60" viewBox="0 0 21 34" shapeRendering="crispEdges" aria-hidden>
        {/* frame */}
        <g fill="rgba(242,237,228,0.34)">
          <rect x="4" y="1" width="13" height="2" />
          <rect x="4" y="31" width="13" height="2" />
        </g>
        <g fill="rgba(242,237,228,0.18)">
          <rect x="5" y="3" width="2" height="2" />
          <rect x="14" y="3" width="2" height="2" />
          <rect x="7" y="12" width="2" height="2" />
          <rect x="12" y="12" width="2" height="2" />
          <rect x="7" y="20" width="2" height="2" />
          <rect x="12" y="20" width="2" height="2" />
          <rect x="5" y="29" width="2" height="2" />
          <rect x="14" y="29" width="2" height="2" />
        </g>

        {/* upper bulb drains */}
        {top.map(([x, y], i) => (
          <rect
            key={`t${i}`}
            x={x}
            y={y}
            width="2"
            height="2"
            fill="#E08A5C"
            style={{ animation: `pf-drain 4.4s steps(1) ${(i * 0.32).toFixed(2)}s infinite` }}
          />
        ))}

        {/* a grain in the neck */}
        <rect
          x="10"
          y="15"
          width="1"
          height="2"
          fill="#F0B487"
          style={{ animation: "pf-fall 0.55s steps(4) infinite" }}
        />

        {/* lower bulb fills */}
        {bottom.map(([x, y], i) => (
          <rect
            key={`b${i}`}
            x={x}
            y={y}
            width="2"
            height="2"
            fill="#C2603A"
            style={{ animation: `pf-fill 4.4s steps(1) ${(i * 0.32).toFixed(2)}s infinite` }}
          />
        ))}
      </svg>

      <p className="m-0 font-mono text-[9px] tracking-[0.16em] text-[rgba(242,237,228,0.42)] uppercase">
        {label}
      </p>
    </div>
  );
}
