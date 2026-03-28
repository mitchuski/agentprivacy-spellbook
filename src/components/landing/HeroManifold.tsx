'use client';

import { useEffect, useRef } from 'react';

/**
 * True dual manifolds: for every ribbon (prog), BOTH lattices are drawn on the same yBase.
 * Shared phase-shifted carriers (latPhase 0 vs 0.55) make the families intersect, beat, and form
 * emergent shapes where coral (sword/privacy) and cyan (mage/delegation) overlap.
 * Lattice 0: boundary pull toward the orb. Lattice 1: tetra arms + radial flow through the center.
 *
 * Soulbis-style constellation: drifting stars + edges between nearby pairs (shapes emerge as they move).
 */

const SQRT2 = Math.SQRT2;

const HERO_STAR_COUNT = 80;

type HeroStar = {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  pulse: number;
  color: string;
};

function createHeroStars(w: number, h: number): HeroStar[] {
  const stars: HeroStar[] = [];
  for (let i = 0; i < HERO_STAR_COUNT; i++) {
    const colorRoll = Math.random();
    const color =
      colorRoll < 0.7 ? '240,238,232' : colorRoll < 0.85 ? '77,217,232' : '232,82,58';
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      color,
    });
  }
  return stars;
}

function heroLineRgb(prog: number) {
  const r1 = 232;
  const g1 = 82;
  const b1 = 58;
  const r2 = 77;
  const g2 = 217;
  const b2 = 232;
  return {
    r: Math.round(r1 + (r2 - r1) * prog),
    g: Math.round(g1 + (g2 - g1) * prog),
    b: Math.round(b1 + (b2 - b1) * prog),
  };
}

function privacyLineRgb(prog: number) {
  const b = heroLineRgb(prog);
  return {
    r: Math.min(255, Math.round(b.r * 0.82 + 232 * 0.18)),
    g: Math.min(255, Math.round(b.g * 0.82 + 82 * 0.18)),
    b: Math.min(255, Math.round(b.b * 0.82 + 58 * 0.18)),
  };
}

function delegationLineRgb(prog: number) {
  const b = heroLineRgb(prog);
  return {
    r: Math.min(255, Math.round(b.r * 0.82 + 77 * 0.18)),
    g: Math.min(255, Math.round(b.g * 0.82 + 217 * 0.18)),
    b: Math.min(255, Math.round(b.b * 0.82 + 232 * 0.18)),
  };
}

/**
 * Same prog ribbon for both lattices — they share vertical placement then diverge by phase + physics.
 */
function dualManifoldY(
  x: number,
  t: number,
  prog: number,
  w: number,
  h: number,
  orbX: number,
  orbY: number,
  lattice: 0 | 1
): number {
  const latPhase = lattice * 0.55;
  const xNorm = (x - orbX) / (w * 0.5);
  const yBase = h * 0.5 + (prog - 0.5) * h * 0.78;
  const rdx = x - orbX;
  const rdy = yBase - orbY;
  const angle = Math.atan2(rdy, rdx);
  const distN = Math.hypot(rdx / w, rdy / h) + 1e-5;
  const orbFalloffX = Math.exp(-(Math.abs(rdx) / w) * 3.1);
  const vertEnv = Math.max(0.2, 1 - Math.abs(prog - 0.5) * 1.5);

  let y = yBase;

  // Coupled carriers — π-shifted between lattices ⇒ visible crossings & moiré
  y += Math.sin(xNorm * 3.95 + t * 0.405 + prog * 1.52 + latPhase) * 44 * vertEnv;
  y += Math.sin(xNorm * 2.45 - t * 0.315 + prog * 2.38 + latPhase * 0.74) * 29 * vertEnv;
  y += Math.cos(xNorm * 5.65 + t * 0.495 + latPhase * 1.08) * 15 * vertEnv;

  if (lattice === 0) {
    // Swordsman / privacy: lateral cage, pull toward orb
    y += Math.sin(xNorm * 6.75 + t * 0.37 + prog * 1.12) * 13 * vertEnv;
    y += (orbY - yBase) * orbFalloffX * 0.017 * 56;
  } else {
    // Mage / delegation: tetra directions around centroid + radial through orb
    for (let k = 0; k < 4; k++) {
      const arm = angle + k * (Math.PI / 2) + prog * 0.72;
      y += Math.sin(arm * 3.12 + t * (0.465 + k * 0.034)) * 11.5 * vertEnv;
    }
    y += Math.sin(distN * 20.5 - t * 0.71 + prog * 2.65) * 16.5 * vertEnv;
    y += Math.cos(distN * 13.5 + t * 0.54) * 10 * vertEnv;
    y += Math.sin(xNorm * SQRT2 * 4.05 + t * 0.435 + prog * 1.42) * 17 * vertEnv;
  }

  return y;
}

export type HeroManifoldProps = {
  orbAnchorX?: number;
  orbAnchorY?: number;
  baseAlpha?: number;
};

export default function HeroManifold({
  orbAnchorX = 0.65,
  orbAnchorY = 0.46,
  baseAlpha = 0.19,
}: HeroManifoldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);
  const animRef = useRef(0);
  const starsRef = useRef<HeroStar[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      if (cw > 2 && ch > 2) {
        starsRef.current = createHeroStars(cw, ch);
      }
    }

    function drawConstellation(w: number, h: number) {
      const stars = starsRef.current;
      if (stars.length === 0) {
        starsRef.current = createHeroStars(w, h);
      }
      const list = starsRef.current;

      for (const s of list) {
        if (!prefersReducedMotion) {
          s.x += s.speedX;
          s.y += s.speedY;
          s.pulse += 0.02;
          if (s.x < 0 || s.x > w || s.y < 0 || s.y > h) {
            s.x = Math.random() * w;
            s.y = Math.random() * h;
          }
        }
        const flicker = prefersReducedMotion ? 1 : Math.sin(s.pulse) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${s.opacity * flicker})`;
        ctx.fill();
      }

      const linkDist = Math.min(110, 0.13 * Math.min(w, h));
      const linkSq = linkDist * linkDist;
      ctx.strokeStyle = 'rgba(240,238,232,0.065)';
      ctx.lineWidth = 0.5;
      const n = list.length;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const dx = list[i].x - list[j].x;
          const dy = list[i].y - list[j].y;
          if (dx * dx + dy * dy < linkSq) {
            ctx.beginPath();
            ctx.moveTo(list[i].x, list[i].y);
            ctx.lineTo(list[j].x, list[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w < 2 || h < 2) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      const mobile = w < 768;
      // Mobile: pull focal point south + center so the convergence sits below CTAs, aligned with hero orb
      const anchorX = mobile ? 0.5 : orbAnchorX;
      const anchorY = mobile ? Math.min(0.64, orbAnchorY + 0.17) : orbAnchorY;
      const orbX = w * anchorX;
      const orbY = h * anchorY;
      const ribbons = mobile ? 34 : 44;
      const pts = mobile ? 200 : 250;
      const strokeAlpha = baseAlpha * 0.92;

      ctx.clearRect(0, 0, w, h);

      drawConstellation(w, h);

      const t = tRef.current;

      for (let i = 0; i < ribbons; i++) {
        const prog = ribbons > 1 ? i / (ribbons - 1) : 0.5;

        for (const lattice of [0, 1] as const) {
          const rgb = lattice === 0 ? privacyLineRgb(prog) : delegationLineRgb(prog);

          ctx.beginPath();
          for (let j = 0; j <= pts; j++) {
            const x = (j / pts) * w;
            const y = dualManifoldY(x, t, prog, w, h, orbX, orbY, lattice);
            j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${strokeAlpha})`;
          ctx.lineWidth =
            lattice === 0
              ? mobile
                ? 0.64
                : 0.72
              : mobile
                ? 0.58
                : 0.66;
          ctx.stroke();
        }
      }

      if (!prefersReducedMotion) {
        tRef.current += 0.008;
      }
      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [orbAnchorX, orbAnchorY, baseAlpha]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      style={{ opacity: 0.98 }}
      aria-hidden
    />
  );
}
