'use client';

import { useEffect, useRef } from 'react';
import SoulOrbCopy from '@/components/SoulOrbCopy';

export default function FooterWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;

      const lines = 38;
      const pts = 180;

      ctx.clearRect(0, 0, w, h);

      // Reversed gradient: cyan to coral
      for (let i = 0; i < lines; i++) {
        const prog = i / lines;
        const r1 = 77, g1 = 217, b1 = 232;   // cyan
        const r2 = 232, g2 = 82, b2 = 58;     // coral
        const mix = prog;
        const r = Math.round(r1 + (r2 - r1) * mix);
        const g = Math.round(g1 + (g2 - g1) * mix);
        const b = Math.round(b1 + (b2 - b1) * mix);

        ctx.beginPath();
        for (let j = 0; j <= pts; j++) {
          const x = (j / pts) * w;
          const xNorm = (x - w / 2) / (w / 2);
          const p = i / lines;
          let y = h * 0.4;
          y += Math.sin(xNorm * 2.8 - tRef.current * 0.5) * 35 * (1 - Math.abs(p - 0.5) * 1.5);
          y += Math.sin(xNorm * 4.5 + tRef.current * 0.4 + p * 2) * 18;
          y += Math.cos(xNorm * 1.8 - tRef.current * 0.25 + p) * 22;
          y += (p - 0.5) * h * 0.6;

          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${r},${g},${b},0.28)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Draw the dual sphere (Soulbis logo element)
      const sx = w * 0.22, sy = h * 0.42;
      const grad = ctx.createRadialGradient(sx - 8, sy - 8, 2, sx, sy, 20);
      grad.addColorStop(0, '#4dd9e8');
      grad.addColorStop(0.5, '#8b4daa');
      grad.addColorStop(1, '#e8523a');
      ctx.beginPath();
      ctx.arc(sx, sy, 16, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.globalAlpha = 1;

      if (!prefersReducedMotion) {
        tRef.current += 0.008;
      }
      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="relative h-64 w-full">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 block h-full w-full"
        aria-hidden
      />
      <SoulOrbCopy variant="footerOrb" />
    </div>
  );
}
