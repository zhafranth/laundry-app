"use client";

interface HealthScoreGaugeProps {
  score: number;
}

function getScoreColor(score: number) {
  if (score >= 71) return "#00C853";
  if (score >= 41) return "#FFB703";
  return "#EF2D56";
}

function getScoreLabel(score: number) {
  if (score >= 71) return "Sehat";
  if (score >= 41) return "Perhatian";
  return "Kritis";
}

export function HealthScoreGauge({ score }: HealthScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const color = getScoreColor(clampedScore);
  const label = getScoreLabel(clampedScore);

  // SVG arc: semi-circle gauge (180°)
  const r = 30;
  const cx = 44;
  const cy = 40;
  const circumference = Math.PI * r; // half circle
  const progress = (clampedScore / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <svg width="88" height="48" viewBox="0 0 88 48" aria-label={`Health Score: ${score}`}>
        {/* Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#E8EDF2"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Progress */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          style={{
            fontSize: "14px",
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fill: "#0B1D35",
          }}
        >
          {clampedScore}
        </text>
        <text
          x={cx}
          y={cy + 9}
          textAnchor="middle"
          style={{
            fontSize: "7px",
            fontFamily: "Nunito Sans, system-ui",
            fontWeight: 600,
            fill: "#8899AA",
          }}
        >
          / 100
        </text>
      </svg>

      <div>
        <p
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.875rem",
            color,
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.7rem",
            color: "#8899AA",
            marginTop: 1,
          }}
        >
          Health Score
        </p>
      </div>
    </div>
  );
}
