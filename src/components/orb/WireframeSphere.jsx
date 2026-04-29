import React from 'react';

/**
 * Vector wireframe sphere — meridians + parallels, like the
 * "Create your own" orb in the Project Genie reference.
 */
export default function WireframeSphere({ stroke = 'rgba(255,255,255,0.55)' }) {
  const cx = 100;
  const cy = 100;
  const r = 96;

  // parallels: ellipses at varying y-positions with shrinking radii
  const parallels = [-0.85, -0.6, -0.3, 0, 0.3, 0.6, 0.85].map((t) => {
    const y = cy + t * r;
    const rx = r * Math.sqrt(1 - t * t);
    const ry = rx * 0.18;
    return { rx, ry, y };
  });

  // meridians: arcs from north to south pole at different rotations
  const meridians = [-72, -36, 0, 36, 72].map((deg) => {
    const rx = r * Math.abs(Math.sin((deg * Math.PI) / 180)) || 0.001;
    return { rx, deg };
  });

  return (
    <svg
      viewBox="0 0 200 200"
      style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="wireSheen" cx="30%" cy="22%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={r} fill="url(#wireSheen)" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={stroke} strokeWidth="0.8" />

      {parallels.map((p, i) => (
        <ellipse
          key={`p-${i}`}
          cx={cx}
          cy={p.y}
          rx={p.rx}
          ry={p.ry}
          fill="none"
          stroke={stroke}
          strokeWidth="0.5"
          opacity="0.7"
        />
      ))}

      {meridians.map((m, i) => (
        <ellipse
          key={`m-${i}`}
          cx={cx}
          cy={cy}
          rx={m.rx}
          ry={r}
          fill="none"
          stroke={stroke}
          strokeWidth="0.5"
          opacity="0.7"
        />
      ))}
    </svg>
  );
}
