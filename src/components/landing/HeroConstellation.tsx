'use client';

import { useMemo } from 'react';

const FIELD_STARS_DEFAULT = 220;
const OUTER_STARS_DEFAULT = 48;
const FIELD_STARS_REDUCED = 70;
const OUTER_STARS_REDUCED = 20;

/** Round to 4 decimals so server and client hydrate identically (avoids float mismatch). */
function r4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

/** Tetrahedron: apex up (0) or down (1). Bases at y=0/100 for section alignment. Highlighted dots follow these lines. */
function tetrahedronPoints(angle: 0 | 1): { x: number; y: number }[] {
  const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
    x: r4(a.x + (b.x - a.x) * t),
    y: r4(a.y + (b.y - a.y) * t),
  });
  const apexUp = [
    { x: 50, y: 2 },
    { x: 5, y: 100 },
    { x: 95, y: 100 },
    { x: 50, y: 100 },
  ];
  const apexDown = [
    { x: 50, y: 98 },
    { x: 5, y: 0 },
    { x: 95, y: 0 },
    { x: 50, y: 0 },
  ];
  const verts = angle === 0 ? apexUp : apexDown;
  const points: { x: number; y: number }[] = verts.map((p) => ({ x: p.x, y: p.y }));
  const edgePairs: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1]];
  for (const [i, j] of edgePairs) {
    for (let k = 1; k <= 8; k++) {
      const t = k / 9;
      points.push(lerp(points[i], points[j], t));
    }
  }
  return points;
}

const TETRA_EDGES: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1]];

/** Full-sky: more random placement (jitter), varied size/opacity. Deterministic for hydration. */
function fullFieldStars(count: number = FIELD_STARS_DEFAULT): { x: number; y: number; r: number; opacity: number; delay: number }[] {
  return Array.from({ length: count }, (_, i) => {
    const s1 = (i * 9301 + 49297) % 233280;
    const s2 = (i * 7919 + 31) % 233280;
    const s3 = (i * 7829 + 7) % 233280;
    const s4 = (i * 6997 + 11) % 233280;
    const s5 = (i * 6007 + 41) % 233280;
    const s6 = (i * 4001 + 17) % 233280;
    const baseX = (s1 / 233280) * 100;
    const baseY = (s2 / 233280) * 100;
    const jitterX = ((s5 / 233280) - 0.5) * 14;
    const jitterY = ((s6 / 233280) - 0.5) * 14;
    const x = r4(Math.max(0, Math.min(100, baseX + jitterX)));
    const y = r4(Math.max(0, Math.min(100, baseY + jitterY)));
    const depth = s3 / 233280;
    const r = r4(0.05 + (s4 % 97) / 97 * 0.28);
    const opacity = r4(0.05 + (s1 % 89) / 89 * 0.22);
    const delay = r4((s2 % 80) / 20);
    return { x, y, r, opacity, delay };
  });
}

/** Outer stars: more random (angle + radius jitter, irregular spacing). Rounded for hydration. */
function outerStars(count: number = OUTER_STARS_DEFAULT): { x: number; y: number; r: number; opacity: number; delay: number }[] {
  return Array.from({ length: count }, (_, i) => {
    const s1 = (i * 9301 + 49297) % 233280;
    const s2 = (i * 7919 + 31) % 233280;
    const s3 = (i * 7829 + 7) % 233280;
    const s4 = (i * 6007 + 41) % 233280;
    const angle = (s1 / 233280) * 2 * Math.PI + (s4 / 233280) * 0.7;
    const dist = r4(35 + (s2 / 233280) * 38 + (s3 % 31) / 31 * 6);
    return {
      x: r4(50 + Math.cos(angle) * dist),
      y: r4(50 + Math.sin(angle) * dist * (0.88 + (s2 % 23) / 23 * 0.2)),
      r: r4(0.14 + (s3 % 73) / 73 * 0.3),
      opacity: r4(0.08 + (s1 % 67) / 67 * 0.24),
      delay: r4((s2 % 60) / 10 + (i % 5) / 8),
    };
  });
}

type Variant = 'hero' | 'section';

export default function HeroConstellation({
  variant = 'hero',
  sectionAngle = 1,
  sectionIndex = 0,
  reduced = false,
}: {
  variant?: Variant;
  sectionAngle?: 0 | 1;
  sectionIndex?: number;
  /** When true, fewer stars (for mobile / below-fold lazy sections). */
  reduced?: boolean;
}) {
  const angle = variant === 'hero' ? 0 : sectionAngle;
  const tetra = useMemo(() => tetrahedronPoints(angle), [angle]);
  const fieldLen = reduced ? FIELD_STARS_REDUCED : FIELD_STARS_DEFAULT;
  const outerLen = reduced ? OUTER_STARS_REDUCED : OUTER_STARS_DEFAULT;
  const field = useMemo(() => fullFieldStars(fieldLen), [fieldLen]);
  const outer = useMemo(() => outerStars(outerLen), [outerLen]);

  const id = sectionIndex;
  const filterStrong = `constellationGlowStrong-${id}`;
  const filterSoft = `constellationGlowSoft-${id}`;
  const filterSubtle = `constellationGlowSubtle-${id}`;
  const filterGas = `constellationGas-${id}`;
  const maskFrame = `constellationFrameMask-${id}`;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id={filterStrong} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.75" result="blur" />
            <feFlood floodColor="#8a8afe" floodOpacity="0.5" result="glowColor" />
            <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={filterSoft} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
            <feFlood floodColor="#8a8afe" floodOpacity="0.32" result="glowColor" />
            <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={filterSubtle} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="blur" />
            <feFlood floodColor="#a0a4fe" floodOpacity="0.22" result="glowColor" />
            <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={filterGas} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="blur" />
            <feFlood floodColor="#8a8afe" floodOpacity="0.35" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="gas" />
            <feMerge>
              <feMergeNode in="gas" />
            </feMerge>
          </filter>
          <mask id={maskFrame}>
            <radialGradient id={`frameFade-${id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="48%" stopColor="white" stopOpacity="0" />
              <stop offset="72%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0.85" />
            </radialGradient>
            <rect x="0" y="0" width="100" height="100" fill={`url(#frameFade-${id})`} />
          </mask>
          <style>{`
            @keyframes constellationPulse {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.7; }
            }
            @keyframes constellationTwinkle {
              0%, 100% { opacity: 0.12; }
              50% { opacity: 0.45; }
            }
            @keyframes gasPhase {
              0%, 100% { opacity: 0.12; }
              33% { opacity: 0.28; }
              66% { opacity: 0.2; }
            }
          `}</style>
        </defs>
        <g filter={`url(#${filterSubtle})`}>
          {field.map((s, i) => (
            <circle
              key={`f-${i}`}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#a0a4fe"
              opacity={s.opacity}
              style={{ animation: `constellationTwinkle 6s ease-in-out ${s.delay}s infinite` }}
            />
          ))}
        </g>
        <g filter={`url(#${filterSoft})`}>
          {outer.map((s, i) => (
            <circle
              key={`o-${i}`}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#8a8afe"
              opacity={s.opacity}
              style={{ animation: `constellationPulse 5s ease-in-out ${s.delay}s infinite` }}
            />
          ))}
        </g>
        {/* Tetrahedron: gas + highlighted bigger dots along tetrahedra lines, masked for soft edges */}
        <g mask={`url(#${maskFrame})`}>
          <g filter={`url(#${filterGas})`} style={{ animation: `gasPhase 9s ease-in-out ${id * 0.7}s infinite` }}>
            {TETRA_EDGES.map(([i, j], ei) => {
              const a = tetra[i];
              const b = tetra[j];
              return (
                <line
                  key={`gas-${ei}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#a0a4fe"
                  strokeWidth={3.2}
                  strokeLinecap="round"
                  opacity={0.7}
                />
              );
            })}
          </g>
          <g filter={`url(#${filterStrong})`}>
            {tetra.map((p, i) => (
              <circle
                key={`t-${i}`}
                cx={p.x}
                cy={p.y}
                r={i < 4 ? 0.44 : 0.3}
                fill="#8a8afe"
                opacity={i < 4 ? 0.7 : 0.55}
                style={{ animation: `constellationPulse 4s ease-in-out ${(i % 8) * 0.12}s infinite` }}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
