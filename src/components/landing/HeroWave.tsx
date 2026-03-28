'use client';

import { useEffect, useRef } from 'react';

/**
 * Clean manifold wave background - Soulbis style.
 * Simple flowing waves with plenty of negative space.
 * Coral → Cyan gradient represents the Swordsman → Mage axis.
 */
export default function HeroWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Soulbis hero config: sparse, clean, lots of negative space
    const lines = 55;
    const alpha = 0.22;
    const lineWidth = 0.7;
    const speed = 0.007;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function getY(x: number, time: number, lineIndex: number, totalLines: number): number {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const cy = h / 2;
      const prog = lineIndex / totalLines;
      const xNorm = (x - cx) / cx;

      let y = cy;
      // Base wave shape - simple, clean curves
      y += Math.sin(xNorm * 3.5 + time * 0.4) * 40 * (1 - Math.abs(prog - 0.5) * 1.8);
      y += Math.sin(xNorm * 2.1 - time * 0.3 + prog * 2) * 25;
      y += Math.cos(xNorm * 5 + time * 0.6 + prog * 1.5) * 12;
      // Terrain variation per line
      y += (prog - 0.5) * h * 0.75;
      return y;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const pts = 200;

      ctx.clearRect(0, 0, w, h);

      // Simple coral → cyan gradient (Swordsman → Mage)
      const coral = { r: 232, g: 82, b: 58 };
      const cyan = { r: 77, g: 217, b: 232 };

      for (let i = 0; i < lines; i++) {
        const mix = i / lines;
        const r = Math.round(coral.r + (cyan.r - coral.r) * mix);
        const g = Math.round(coral.g + (cyan.g - coral.g) * mix);
        const b = Math.round(coral.b + (cyan.b - coral.b) * mix);

        ctx.beginPath();
        for (let j = 0; j <= pts; j++) {
          const x = (j / pts) * w;
          const y = getY(x, tRef.current, i, lines);
          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      if (!prefersReducedMotion) {
        tRef.current += speed;
      }
      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  );
}
