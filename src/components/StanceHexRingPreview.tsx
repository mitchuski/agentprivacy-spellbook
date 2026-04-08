'use client';

import type { HexagramSnapshot } from '@/lib/training-progress';
import type { OrbLoadoutSlot } from '@/lib/orb-loadout';

const CX = 100;
const CY = 100;
/** Emoji sits here; classical L1 = bottom of figure → start at 6 o’clock and go counterclockwise */
const R_SECTOR = 72;
const R_LABEL = 52;

type StanceHexRingPreviewProps = {
  lines: HexagramSnapshot['lines'];
  swordsman: OrbLoadoutSlot[];
  className?: string;
};

/**
 * Static map: six stance lines → six sectors around Soulbis for zk blade facets (bottom = L1).
 * Yin / yang tint matches DualOrbs radius bias (yin slightly inward, yang outward).
 */
export default function StanceHexRingPreview({ lines, swordsman, className = '' }: StanceHexRingPreviewProps) {
  const sectors = lines.map((bit, i) => {
    const t0 = Math.PI / 2 + (i / 6) * Math.PI * 2;
    const t1 = Math.PI / 2 + ((i + 1) / 6) * Math.PI * 2;
    const rIn = 38;
    const rOut = 88;
    const large = 0;
    const x0o = CX + Math.cos(t0) * rOut;
    const y0o = CY + Math.sin(t0) * rOut;
    const x1o = CX + Math.cos(t1) * rOut;
    const y1o = CY + Math.sin(t1) * rOut;
    const x1i = CX + Math.cos(t1) * rIn;
    const y1i = CY + Math.sin(t1) * rIn;
    const x0i = CX + Math.cos(t0) * rIn;
    const y0i = CY + Math.sin(t0) * rIn;
    const path = [
      `M ${x0o.toFixed(2)} ${y0o.toFixed(2)}`,
      `A ${rOut} ${rOut} 0 ${large} 1 ${x1o.toFixed(2)} ${y1o.toFixed(2)}`,
      `L ${x1i.toFixed(2)} ${y1i.toFixed(2)}`,
      `A ${rIn} ${rIn} 0 ${large} 0 ${x0i.toFixed(2)} ${y0i.toFixed(2)}`,
      'Z',
    ].join(' ');
    const mid = (t0 + t1) / 2;
    const em = (swordsman[i]?.emoji || '').trim() || '·';
    const ex = CX + Math.cos(mid) * R_SECTOR;
    const ey = CY + Math.sin(mid) * R_SECTOR;
    const lx = CX + Math.cos(mid) * R_LABEL;
    const ly = CY + Math.sin(mid) * R_LABEL;
    const fill = bit === 1 ? 'rgba(245, 158, 11, 0.22)' : 'rgba(139, 92, 246, 0.2)';
    const stroke = bit === 1 ? 'rgba(245, 158, 11, 0.45)' : 'rgba(139, 92, 246, 0.45)';
    return { path, fill, stroke, ex, ey, em, lx, ly, i };
  });

  return (
    <div className={`rounded-xl border border-amber-500/25 bg-background/40 p-3 ${className}`}>
      <p className="text-[10px] font-medium text-text-muted mb-2 uppercase tracking-wide">Blade ring (Soulbis)</p>
      <svg viewBox="0 0 200 200" className="w-full max-w-[220px] mx-auto" aria-hidden>
        <circle cx={CX} cy={CY} r={34} fill="rgba(231, 76, 60, 0.12)" stroke="rgba(231, 76, 60, 0.35)" strokeWidth={1} />
        <text x={CX} y={CY + 4} textAnchor="middle" fill="rgba(226,232,240,0.9)" style={{ fontFamily: 'system-ui', fontSize: 18 }}>
          ⚔️
        </text>
        {sectors.map((s) => (
          <g key={s.i}>
            <path d={s.path} fill={s.fill} stroke={s.stroke} strokeWidth={1} />
            <text x={s.lx} y={s.ly + 3} textAnchor="middle" fill="rgba(148,163,184,0.85)" style={{ fontFamily: 'ui-monospace, monospace', fontSize: 8 }}>
              L{s.i + 1}
            </text>
            <text
              x={s.ex}
              y={s.ey + 5}
              textAnchor="middle"
              fill="rgba(248,250,252,0.95)"
              style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", sans-serif', fontSize: 15 }}
            >
              {s.em}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-[10px] text-text-muted mt-2 leading-relaxed">
        Facets from spellweb forged path map here; L1 = bottom line. <span className="text-violet-300/90">Yin</span> in,{' '}
        <span className="text-amber-300/90">yang</span> out — same bias as live training orbs.
      </p>
    </div>
  );
}
