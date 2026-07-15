interface RadarChartProps {
  fear: number;
  joy: number;
  trust: number;
  sadness: number;
  anger: number;
}

export default function RadarChart({ fear, joy, trust, sadness, anger }: RadarChartProps) {
  // SVG dimensions
  const size = 260;
  const center = size / 2;
  const rMax = 80; // maximum radius of pentagon

  // Pentagon vertex angles (in radians) starting at top (12 o'clock)
  const angles = [
    -Math.PI / 2,                  // CORTISOL / FEAR (Top)
    -Math.PI / 2 + (2 * Math.PI) / 5, // SEROTONIN / JOY (Right)
    -Math.PI / 2 + (4 * Math.PI) / 5, // DOPAMINE / TRUST (Bottom-Right)
    -Math.PI / 2 + (6 * Math.PI) / 5, // MELATONIN / SADNESS (Bottom-Left)
    -Math.PI / 2 + (8 * Math.PI) / 5, // EPINEPHRINE / ANGER (Left)
  ];

  // Helper to get coordinates of a value along an axis
  const getCoordinates = (angle: number, value: number) => {
    const r = (value / 100) * rMax;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Helper to get grid path of a specific scale (e.g. 25%, 50%, 75%, 100%)
  const getGridPath = (scale: number) => {
    const points = angles.map((angle) => {
      const { x, y } = getCoordinates(angle, scale);
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")} Z`;
  };

  // Calculate coordinates for the actual emotional state
  const values = [fear, joy, trust, sadness, anger];
  const emotionalPoints = angles.map((angle, i) => getCoordinates(angle, values[i]));
  const emotionalPath = `M ${emotionalPoints.map(p => `${p.x},${p.y}`).join(" L ")} Z`;

  // Labels positioning using the previous emotional names
  const labels = [
    { text: "FEAR", value: fear, ...getCoordinates(angles[0], 122) },
    { text: "JOY", value: joy, ...getCoordinates(angles[1], 120) },
    { text: "TRUST", value: trust, ...getCoordinates(angles[2], 120) },
    { text: "SADNESS", value: sadness, ...getCoordinates(angles[3], 122) },
    { text: "ANGER", value: anger, ...getCoordinates(angles[4], 122) },
  ];

  return (
    <div className="flex justify-center items-center h-full w-full relative" id="radar-chart-container">
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${size} ${size}`} 
        className="max-w-[280px]"
        id="radar-chart-svg"
      >
        {/* Background Grid Lines (25%, 50%, 75%, 100%) */}
        {[25, 50, 75, 100].map((scale) => (
          <path
            key={scale}
            d={getGridPath(scale)}
            fill="none"
            stroke="rgba(168, 85, 247, 0.15)"
            strokeWidth="1"
            strokeDasharray={scale === 100 ? "none" : "3,3"}
            id={`radar-grid-${scale}`}
          />
        ))}

        {/* Axis Web lines radiating from center */}
        {angles.map((angle, i) => {
          const end = getCoordinates(angle, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="rgba(168, 85, 247, 0.18)"
              strokeWidth="1"
              id={`radar-axis-line-${i}`}
            />
          );
        })}

        {/* Outer neon bounds indicator ring */}
        <circle 
          cx={center} 
          cy={center} 
          r={rMax} 
          fill="none" 
          stroke="rgba(168, 85, 247, 0.05)" 
          strokeWidth="1"
          id="radar-bounds-ring"
        />

        {/* Filled polygon for emotion values */}
        <path
          d={emotionalPath}
          fill="rgba(147, 51, 234, 0.22)"
          stroke="rgba(168, 85, 247, 0.85)"
          strokeWidth="1.5"
          className="transition-all duration-700 ease-out"
          style={{
            filter: "drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))"
          }}
          id="radar-polygon-filled"
        />

        {/* Interactive nodes at emotional points */}
        {emotionalPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill="#a855f7"
            stroke="#e9d5ff"
            strokeWidth="1"
            className="transition-all duration-700 ease-out"
            id={`radar-vertex-node-${i}`}
          />
        ))}

        {/* Labels with percentages */}
        {labels.map((label, i) => {
          // Adjust text anchoring based on location relative to center
          let textAnchor = "middle";
          if (label.x < center - 10) textAnchor = "end";
          if (label.x > center + 10) textAnchor = "start";

          // Fine tune vertical alignments
          let dy = "0.3em";
          if (angles[i] === -Math.PI / 2) dy = "-0.4em"; // FEAR label is on top
          if (angles[i] > 0 && angles[i] < Math.PI) dy = "0.8em"; // Bottom labels

          return (
            <g key={i} className="select-none" id={`radar-label-group-${i}`}>
              <text
                x={label.x}
                y={label.y}
                dy={dy}
                textAnchor={textAnchor}
                fill="rgba(192, 132, 252, 0.8)"
                className="font-display font-medium text-[9px] tracking-wider"
              >
                {label.text}
              </text>
              <text
                x={label.x}
                y={label.y + 11}
                dy={dy}
                textAnchor={textAnchor}
                fill="rgba(233, 213, 255, 0.9)"
                className="font-mono text-[9px]"
              >
                {label.value}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
